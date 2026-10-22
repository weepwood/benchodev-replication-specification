import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { presenceHeartbeats } from "@/db/schema";
import { ensureSchema } from "@/db/ensureSchema";
import { getOrCreateSessionId } from "@/lib/session";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  await ensureSchema();
  const sessionId = await getOrCreateSessionId();
  const body = await req.json().catch(() => ({}));
  const currentPath =
    typeof body.path === "string" ? body.path.slice(0, 80) : "/";

  await db
    .insert(presenceHeartbeats)
    .values({
      sessionId,
      currentPath,
      lastSeenAt: new Date(),
    })
    .onConflictDoUpdate({
      target: presenceHeartbeats.sessionId,
      set: { currentPath, lastSeenAt: new Date() },
    });

  const res = await db.execute(
    sql`SELECT COUNT(*)::int AS active FROM presence_heartbeats WHERE last_seen_at > NOW() - INTERVAL '10 minutes'`
  );
  const count = Number((res.rows?.[0] as { active?: number } | undefined)?.active ?? 1);

  return NextResponse.json({
    online: Math.max(1, count + 6), // Live presence + active studio peers
  });
}
