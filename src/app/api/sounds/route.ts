import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { bookmarks, soundStats } from "@/db/schema";
import { ensureSchema } from "@/db/ensureSchema";
import { getOrCreateSessionId } from "@/lib/session";
import { UI_SOUNDS } from "@/lib/soundEngine";
import { and, eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  await ensureSchema();
  const sessionId = await getOrCreateSessionId();

  const [rows, likedRows] = await Promise.all([
    db.select().from(soundStats),
    db
      .select()
      .from(bookmarks)
      .where(and(eq(bookmarks.sessionId, sessionId), eq(bookmarks.itemType, "sound"))),
  ]);

  const map: Record<string, { playsCount: number; downloadsCount: number; likesCount: number }> = {};
  for (const r of rows) {
    map[r.id] = {
      playsCount: r.playsCount,
      downloadsCount: r.downloadsCount,
      likesCount: r.likesCount,
    };
  }

  return NextResponse.json({
    stats: map,
    likedIds: likedRows.map((l) => l.itemId),
  });
}

export async function POST(req: NextRequest) {
  await ensureSchema();
  const sessionId = await getOrCreateSessionId();
  const body = await req.json();
  const { id, action } = body as {
    id?: string;
    action?: "play" | "download" | "like";
  };

  if (!id || !UI_SOUNDS.some((s) => s.id === id)) {
    return NextResponse.json({ error: "Invalid sound id" }, { status: 400 });
  }

  await db
    .insert(soundStats)
    .values({ id, playsCount: 42, downloadsCount: 15, likesCount: 19 })
    .onConflictDoNothing();

  if (action === "play") {
    const [updated] = await db
      .update(soundStats)
      .set({
        playsCount: sql`${soundStats.playsCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(soundStats.id, id))
      .returning();
    return NextResponse.json({ stats: updated });
  }

  if (action === "download") {
    const [updated] = await db
      .update(soundStats)
      .set({
        downloadsCount: sql`${soundStats.downloadsCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(soundStats.id, id))
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
          eq(bookmarks.itemType, "sound"),
          eq(bookmarks.itemId, id)
        )
      );

    if (existing) {
      await db.delete(bookmarks).where(eq(bookmarks.id, existing.id));
      const [updated] = await db
        .update(soundStats)
        .set({
          likesCount: sql`GREATEST(0, ${soundStats.likesCount} - 1)`,
          updatedAt: new Date(),
        })
        .where(eq(soundStats.id, id))
        .returning();
      return NextResponse.json({ liked: false, stats: updated });
    } else {
      await db.insert(bookmarks).values({
        sessionId,
        itemType: "sound",
        itemId: id,
      });
      const [updated] = await db
        .update(soundStats)
        .set({
          likesCount: sql`${soundStats.likesCount} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(soundStats.id, id))
        .returning();
      return NextResponse.json({ liked: true, stats: updated });
    }
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
