import { db } from "@/db";
import { sql } from "drizzle-orm";

let initialized = false;

export async function ensureSchema() {
  if (initialized) return;
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS block_stats (
        id TEXT PRIMARY KEY,
        copy_count INTEGER NOT NULL DEFAULT 0,
        likes_count INTEGER NOT NULL DEFAULT 0,
        mcp_pulls INTEGER NOT NULL DEFAULT 0,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS sound_stats (
        id TEXT PRIMARY KEY,
        plays_count INTEGER NOT NULL DEFAULT 0,
        downloads_count INTEGER NOT NULL DEFAULT 0,
        likes_count INTEGER NOT NULL DEFAULT 0,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS bookmarks (
        id SERIAL PRIMARY KEY,
        session_id TEXT NOT NULL,
        item_type TEXT NOT NULL,
        item_id TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
      CREATE UNIQUE INDEX IF NOT EXISTS bookmarks_session_item_idx
        ON bookmarks (session_id, item_type, item_id);
      CREATE TABLE IF NOT EXISTS mcp_keys (
        id SERIAL PRIMARY KEY,
        session_id TEXT NOT NULL,
        api_key TEXT NOT NULL UNIQUE,
        label TEXT NOT NULL DEFAULT 'Cursor / Claude Code',
        tier TEXT NOT NULL DEFAULT 'free',
        usage_count INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS sponsor_applications (
        id SERIAL PRIMARY KEY,
        company_name TEXT NOT NULL,
        contact_email TEXT NOT NULL,
        website_url TEXT NOT NULL,
        tagline TEXT NOT NULL,
        tier TEXT NOT NULL DEFAULT 'grid-card',
        accent_color TEXT NOT NULL DEFAULT '#0d99ff',
        status TEXT NOT NULL DEFAULT 'approved_preview',
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS pro_accounts (
        session_id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        plan TEXT NOT NULL DEFAULT 'pro_lifetime',
        unlocked_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS presence_heartbeats (
        session_id TEXT PRIMARY KEY,
        current_path TEXT NOT NULL DEFAULT '/',
        last_seen_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    initialized = true;
  } catch (err) {
    console.error("ensureSchema warning:", err);
  }
}
