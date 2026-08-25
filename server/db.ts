import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { citationSyncSettings, InsertUser, syncedCitationEntries, users } from "../drizzle/schema";
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
    await tx.delete(syncedCitationEntries).where(eq(syncedCitationEntries.userId, userId));
    if (entries.length) {
      await tx.insert(syncedCitationEntries).values(entries.map((entry) => ({ ...entry, userId })));
    }
  });

  return getCitationSyncState(userId);
}

export async function disconnectCitationSync(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  await db.transaction(async (tx) => {
    await tx.delete(syncedCitationEntries).where(eq(syncedCitationEntries.userId, userId));
    await tx.delete(citationSyncSettings).where(eq(citationSyncSettings.userId, userId));
  });
}
