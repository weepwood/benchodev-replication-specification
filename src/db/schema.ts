import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const blockStats = pgTable("block_stats", {
  id: text("id").primaryKey(),
  copyCount: integer("copy_count").notNull().default(0),
  likesCount: integer("likes_count").notNull().default(0),
  mcpPulls: integer("mcp_pulls").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const soundStats = pgTable("sound_stats", {
  id: text("id").primaryKey(),
  playsCount: integer("plays_count").notNull().default(0),
  downloadsCount: integer("downloads_count").notNull().default(0),
  likesCount: integer("likes_count").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const bookmarks = pgTable(
  "bookmarks",
  {
    id: serial("id").primaryKey(),
    sessionId: text("session_id").notNull(),
    itemType: text("item_type").notNull(), // 'block' | 'sound'
    itemId: text("item_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("bookmarks_session_item_idx").on(
      table.sessionId,
      table.itemType,
      table.itemId
    ),
  ]
);

export const mcpKeys = pgTable("mcp_keys", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  apiKey: text("api_key").notNull().unique(),
  label: text("label").notNull().default("Cursor / Claude Code"),
  tier: text("tier").notNull().default("free"),
  usageCount: integer("usage_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sponsorApplications = pgTable("sponsor_applications", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  websiteUrl: text("website_url").notNull(),
  tagline: text("tagline").notNull(),
  tier: text("tier").notNull().default("grid-card"),
  accentColor: text("accent_color").notNull().default("#0d99ff"),
  status: text("status").notNull().default("approved_preview"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const proAccounts = pgTable("pro_accounts", {
  sessionId: text("session_id").primaryKey(),
  email: text("email").notNull(),
  plan: text("plan").notNull().default("pro_lifetime"),
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
});

export const presenceHeartbeats = pgTable("presence_heartbeats", {
  sessionId: text("session_id").primaryKey(),
  currentPath: text("current_path").notNull().default("/"),
  lastSeenAt: timestamp("last_seen_at").defaultNow().notNull(),
});
