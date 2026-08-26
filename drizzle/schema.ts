import { foreignKey, index, int, mysqlEnum, mysqlTable, primaryKey, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/** Explicit opt-in state for syncing a browser-local citation log to an authenticated account. */
export const citationSyncSettings = mysqlTable("citation_sync_settings", {
  userId: int("userId").primaryKey().notNull().references(() => users.id, { onDelete: "cascade" }),
  consentedAt: timestamp("consentedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** User-owned, source-level citations. These rows exist only after the account owner actively enables sync. */
export const syncedCitationEntries = mysqlTable("synced_citation_entries", {
  id: varchar("id", { length: 64 }).primaryKey().notNull(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  sourceTitle: varchar("sourceTitle", { length: 500 }).notNull(),
  sourceUrl: text("sourceUrl").notNull(),
  accessedOn: varchar("accessedOn", { length: 10 }).notNull(),
  purpose: text("purpose").notNull(),
  notes: text("notes").notNull(),
  savedAt: varchar("savedAt", { length: 40 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [index("synced_citation_entries_user_idx").on(table.userId)]);

export type SyncedCitationEntry = typeof syncedCitationEntries.$inferSelect;

/** User-owned workspaces for organizing explicitly synced citations. */
export const researchCollections = mysqlTable("research_collections", {
  id: varchar("id", { length: 64 }).primaryKey().notNull(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  description: text("description").notNull(),
  accent: varchar("accent", { length: 24 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  index("research_collections_user_idx").on(table.userId),
  foreignKey({ columns: [table.userId], foreignColumns: [users.id], name: "rc_user_fk" }).onDelete("cascade"),
]);

/** A collection references an existing synced citation; it never duplicates citation content. */
export const researchCollectionCitations = mysqlTable("research_collection_citations", {
  collectionId: varchar("collectionId", { length: 64 }).notNull(),
  citationId: varchar("citationId", { length: 64 }).notNull(),
  addedAt: timestamp("addedAt").defaultNow().notNull(),
}, (table) => [
  primaryKey({ columns: [table.collectionId, table.citationId] }),
  index("research_collection_citations_citation_idx").on(table.citationId),
  foreignKey({ columns: [table.collectionId], foreignColumns: [researchCollections.id], name: "rcc_collection_fk" }).onDelete("cascade"),
  foreignKey({ columns: [table.citationId], foreignColumns: [syncedCitationEntries.id], name: "rcc_citation_fk" }).onDelete("cascade"),
]);

export type ResearchCollection = typeof researchCollections.$inferSelect;
