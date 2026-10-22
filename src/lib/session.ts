import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "bencho_sid";

export async function getOrCreateSessionId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(COOKIE_NAME)?.value;
  if (existing && existing.length >= 8) {
    return existing;
  }
  const fresh = `bnc_${crypto.randomBytes(10).toString("hex")}`;
  try {
    store.set(COOKIE_NAME, fresh, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  } catch {
    // Read-only cookie context fallback
  }
  return fresh;
}
