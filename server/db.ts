import { and, desc, eq, inArray, notInArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { citationSyncSettings, InsertUser, researchCollectionCitations, researchCollections, syncedCitationEntries, users } from "../drizzle/schema";
import { randomUUID } from "node:crypto";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export type CitationSyncInput = {
  id: string;
  sourceTitle: string;
  sourceUrl: string;
  accessedOn: string;
  purpose: string;
  notes: string;
  savedAt: string;
};

export async function getCitationSyncState(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const [setting] = await db.select().from(citationSyncSettings).where(eq(citationSyncSettings.userId, userId)).limit(1);
  const entries = setting
    ? await db.select().from(syncedCitationEntries).where(eq(syncedCitationEntries.userId, userId)).orderBy(desc(syncedCitationEntries.updatedAt))
    : [];

  return { enabled: Boolean(setting), consentedAt: setting?.consentedAt ?? null, entries };
}

export async function enableCitationSync(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const now = new Date();
  await db.insert(citationSyncSettings).values({ userId, consentedAt: now }).onDuplicateKeyUpdate({ set: { consentedAt: now } });
  return getCitationSyncState(userId);
}

export async function replaceSyncedCitations(userId: number, entries: CitationSyncInput[]) {
  const db = await getDb();
  if (!db) return undefined;

  const [setting] = await db.select().from(citationSyncSettings).where(eq(citationSyncSettings.userId, userId)).limit(1);
  if (!setting) return null;

  await db.transaction(async (tx) => {
    if (entries.length) {
      for (const entry of entries) {
        await tx.insert(syncedCitationEntries).values({ ...entry, userId }).onDuplicateKeyUpdate({
          set: {
            sourceTitle: entry.sourceTitle,
            sourceUrl: entry.sourceUrl,
            accessedOn: entry.accessedOn,
            purpose: entry.purpose,
            notes: entry.notes,
            savedAt: entry.savedAt,
          },
        });
      }
      await tx.delete(syncedCitationEntries).where(and(eq(syncedCitationEntries.userId, userId), notInArray(syncedCitationEntries.id, entries.map((entry) => entry.id))));
    } else {
      await tx.delete(syncedCitationEntries).where(eq(syncedCitationEntries.userId, userId));
    }
  });

  return getCitationSyncState(userId);
}

export async function disconnectCitationSync(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  await db.transaction(async (tx) => {
    await tx.delete(researchCollections).where(eq(researchCollections.userId, userId));
    await tx.delete(syncedCitationEntries).where(eq(syncedCitationEntries.userId, userId));
    await tx.delete(citationSyncSettings).where(eq(citationSyncSettings.userId, userId));
  });
}

export type ResearchCollectionInput = {
  name: string;
  description: string;
  accent: "teal" | "coral" | "violet" | "gold" | "blue";
};

async function citationSyncEnabled(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const [setting] = await db.select({ userId: citationSyncSettings.userId }).from(citationSyncSettings).where(eq(citationSyncSettings.userId, userId)).limit(1);
  return Boolean(setting);
}

export async function getResearchCollectionState(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const enabled = await citationSyncEnabled(userId);
  if (!enabled) return { enabled: false, collections: [], citations: [] };

  const [collections, citations] = await Promise.all([
    db.select().from(researchCollections).where(eq(researchCollections.userId, userId)).orderBy(desc(researchCollections.updatedAt)),
    db.select().from(syncedCitationEntries).where(eq(syncedCitationEntries.userId, userId)).orderBy(desc(syncedCitationEntries.updatedAt)),
  ]);
  const assignments = collections.length
    ? await db.select().from(researchCollectionCitations).where(inArray(researchCollectionCitations.collectionId, collections.map((collection) => collection.id)))
    : [];
  const citationIdsByCollection = new Map<string, string[]>();
  for (const assignment of assignments) {
    const current = citationIdsByCollection.get(assignment.collectionId) ?? [];
    current.push(assignment.citationId);
    citationIdsByCollection.set(assignment.collectionId, current);
  }

  return {
    enabled: true,
    collections: collections.map((collection) => ({ ...collection, citationIds: citationIdsByCollection.get(collection.id) ?? [] })),
    citations,
  };
}

export async function createResearchCollection(userId: number, input: ResearchCollectionInput) {
  const db = await getDb();
  if (!db) return undefined;
  if (!(await citationSyncEnabled(userId))) return null;

  const id = randomUUID();
  await db.insert(researchCollections).values({ id, userId, ...input });
  return getResearchCollectionState(userId);
}

export async function updateResearchCollection(userId: number, collectionId: string, input: ResearchCollectionInput) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.update(researchCollections).set(input).where(and(eq(researchCollections.id, collectionId), eq(researchCollections.userId, userId)));
  if (!result[0]?.affectedRows) return null;
  return getResearchCollectionState(userId);
}

export async function deleteResearchCollection(userId: number, collectionId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.delete(researchCollections).where(and(eq(researchCollections.id, collectionId), eq(researchCollections.userId, userId)));
  if (!result[0]?.affectedRows) return null;
  return getResearchCollectionState(userId);
}

export async function assignCitationToCollection(userId: number, collectionId: string, citationId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const [[collection], [citation]] = await Promise.all([
    db.select({ id: researchCollections.id }).from(researchCollections).where(and(eq(researchCollections.id, collectionId), eq(researchCollections.userId, userId))).limit(1),
    db.select({ id: syncedCitationEntries.id }).from(syncedCitationEntries).where(and(eq(syncedCitationEntries.id, citationId), eq(syncedCitationEntries.userId, userId))).limit(1),
  ]);
  if (!collection || !citation) return null;
  await db.insert(researchCollectionCitations).values({ collectionId, citationId }).onDuplicateKeyUpdate({ set: { addedAt: new Date() } });
  return getResearchCollectionState(userId);
}

export async function removeCitationFromCollection(userId: number, collectionId: string, citationId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const [collection] = await db.select({ id: researchCollections.id }).from(researchCollections).where(and(eq(researchCollections.id, collectionId), eq(researchCollections.userId, userId))).limit(1);
  if (!collection) return null;
  await db.delete(researchCollectionCitations).where(and(eq(researchCollectionCitations.collectionId, collectionId), eq(researchCollectionCitations.citationId, citationId)));
  return getResearchCollectionState(userId);
}
