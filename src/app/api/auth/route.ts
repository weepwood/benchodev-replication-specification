import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { mcpKeys, proAccounts } from "@/db/schema";
import { ensureSchema } from "@/db/ensureSchema";
import { getOrCreateSessionId } from "@/lib/session";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  await ensureSchema();
  const sessionId = await getOrCreateSessionId();
  const [account] = await db
    .select()
    .from(proAccounts)
    .where(eq(proAccounts.sessionId, sessionId));

  return NextResponse.json({
    authenticated: Boolean(account),
    pro: Boolean(account),
    account: account ?? null,
  });
}

export async function POST(req: NextRequest) {
  await ensureSchema();
  const sessionId = await getOrCreateSessionId();
  const body = await req.json().catch(() => ({}));
  const action = body.action ?? "unlock";

  if (action === "signout") {
    await db.delete(proAccounts).where(eq(proAccounts.sessionId, sessionId));
    return NextResponse.json({ authenticated: false, pro: false });
  }

  const email =
    typeof body.email === "string" && body.email.includes("@")
      ? body.email.trim().slice(0, 100)
      : "designer@bencho.dev";

  const [account] = await db
    .insert(proAccounts)
    .values({
      sessionId,
      email,
      plan: "pro_lifetime",
    })
    .onConflictDoUpdate({
      target: proAccounts.sessionId,
      set: { email, plan: "pro_lifetime", unlockedAt: new Date() },
    })
    .returning();

  // Upgrade any existing MCP keys for this session to pro
  await db
    .update(mcpKeys)
    .set({ tier: "pro" })
    .where(eq(mcpKeys.sessionId, sessionId));

  return NextResponse.json({
    authenticated: true,
    pro: true,
    account,
  });
}
