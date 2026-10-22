import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { mcpKeys, proAccounts } from "@/db/schema";
import { ensureSchema } from "@/db/ensureSchema";
import { getOrCreateSessionId } from "@/lib/session";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  await ensureSchema();
  const sessionId = await getOrCreateSessionId();

  const keys = await db
    .select()
    .from(mcpKeys)
    .where(eq(mcpKeys.sessionId, sessionId))
    .orderBy(desc(mcpKeys.createdAt));

  if (keys.length === 0) {
    const [proRow] = await db
      .select()
      .from(proAccounts)
      .where(eq(proAccounts.sessionId, sessionId));

    const defaultKey = `bnc_live_${crypto.randomBytes(12).toString("hex")}`;
    const [inserted] = await db
      .insert(mcpKeys)
      .values({
        sessionId,
        apiKey: defaultKey,
        label: "Cursor / Claude Code",
        tier: proRow ? "pro" : "free",
      })
      .returning();

    return NextResponse.json({ keys: [inserted] });
  }

  return NextResponse.json({ keys });
}

export async function POST(req: NextRequest) {
  await ensureSchema();
  const sessionId = await getOrCreateSessionId();
  const body = await req.json().catch(() => ({}));
  const label =
    typeof body.label === "string" && body.label.trim()
      ? body.label.trim().slice(0, 48)
      : "Editor MCP Key";

  const [proRow] = await db
    .select()
    .from(proAccounts)
    .where(eq(proAccounts.sessionId, sessionId));

  const freshKey = `bnc_live_${crypto.randomBytes(12).toString("hex")}`;
  const [created] = await db
    .insert(mcpKeys)
    .values({
      sessionId,
      apiKey: freshKey,
      label,
      tier: proRow ? "pro" : "free",
    })
    .returning();

  return NextResponse.json({ key: created });
}
