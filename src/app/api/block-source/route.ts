import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { blockStats, bookmarks, proAccounts } from "@/db/schema";
import { ensureSchema } from "@/db/ensureSchema";
import { getOrCreateSessionId } from "@/lib/session";
import {
  ALL_138_BLOCKS,
  generateBlockSourceCode,
  getBlockById,
} from "@/lib/blocksCatalog";
import { and, eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  await ensureSchema();
  const sessionId = await getOrCreateSessionId();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    // Return aggregate stats + user's bookmarked block IDs
    const [statsRows, userBookmarks] = await Promise.all([
      db.select().from(blockStats),
      db
        .select()
        .from(bookmarks)
        .where(and(eq(bookmarks.sessionId, sessionId), eq(bookmarks.itemType, "block"))),
    ]);

    const statsMap: Record<string, { copyCount: number; likesCount: number; mcpPulls: number }> = {};
    for (const r of statsRows) {
      statsMap[r.id] = {
        copyCount: r.copyCount,
        likesCount: r.likesCount,
        mcpPulls: r.mcpPulls,
      };
    }

    return NextResponse.json({
      totalCatalog: ALL_138_BLOCKS.length,
      stats: statsMap,
      likedIds: userBookmarks.map((b) => b.itemId),
    });
  }

  const block = getBlockById(id);
  if (!block) {
    return NextResponse.json({ error: "Block not found" }, { status: 404 });
  }

  const accent = searchParams.get("accent") ?? block.defaultTweaks.accent;
  const stiffness = Number(searchParams.get("stiffness") ?? block.defaultTweaks.stiffness);
  const damping = Number(searchParams.get("damping") ?? block.defaultTweaks.damping);
  const speed = Number(searchParams.get("speed") ?? block.defaultTweaks.speed);

  const [statRow] = await db
    .select()
    .from(blockStats)
    .where(eq(blockStats.id, block.id));

  const [likedRow] = await db
    .select()
    .from(bookmarks)
    .where(
      and(
        eq(bookmarks.sessionId, sessionId),
        eq(bookmarks.itemType, "block"),
        eq(bookmarks.itemId, block.id)
      )
    );

  const [proRow] = await db
    .select()
    .from(proAccounts)
    .where(eq(proAccounts.sessionId, sessionId));

  const source = generateBlockSourceCode(block, {
    accent,
    stiffness,
    damping,
    speed,
  });

  return NextResponse.json({
    id: block.id,
    title: block.title,
    kind: block.kind,
    pro: Boolean(block.pro),
    isProUser: Boolean(proRow),
    liked: Boolean(likedRow),
    stats: {
      copyCount: statRow?.copyCount ?? 24,
      likesCount: statRow?.likesCount ?? 18,
      mcpPulls: statRow?.mcpPulls ?? 9,
    },
    source,
  });
}

export async function POST(req: NextRequest) {
  await ensureSchema();
  const sessionId = await getOrCreateSessionId();
  const body = await req.json();
  const { id, action } = body as { id?: string; action?: "copy" | "like" };

  if (!id || !getBlockById(id)) {
    return NextResponse.json({ error: "Invalid block id" }, { status: 400 });
  }

  // Ensure row exists with realistic baseline
  await db
    .insert(blockStats)
    .values({ id, copyCount: 24, likesCount: 18, mcpPulls: 9 })
    .onConflictDoNothing();

  if (action === "copy") {
    const [updated] = await db
      .update(blockStats)
      .set({
        copyCount: sql`${blockStats.copyCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(blockStats.id, id))
      .returning();

    return NextResponse.json({ stats: updated });
  }

  if (action === "like") {
    const [existing] = await db
      .select()
      .from(bookmarks)
      .where(
        and(
          eq(bookmarks.sessionId, sessionId),
          eq(bookmarks.itemType, "block"),
          eq(bookmarks.itemId, id)
        )
      );

    if (existing) {
      await db.delete(bookmarks).where(eq(bookmarks.id, existing.id));
      const [updated] = await db
        .update(blockStats)
        .set({
          likesCount: sql`GREATEST(0, ${blockStats.likesCount} - 1)`,
          updatedAt: new Date(),
        })
        .where(eq(blockStats.id, id))
        .returning();
      return NextResponse.json({ liked: false, stats: updated });
    } else {
      await db.insert(bookmarks).values({
        sessionId,
        itemType: "block",
        itemId: id,
      });
      const [updated] = await db
        .update(blockStats)
        .set({
          likesCount: sql`${blockStats.likesCount} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(blockStats.id, id))
        .returning();
      return NextResponse.json({ liked: true, stats: updated });
    }
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
