import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sponsorApplications } from "@/db/schema";
import { ensureSchema } from "@/db/ensureSchema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

const FEATURED_SPONSORS = [
  {
    id: "mobbin",
    companyName: "Mobbin",
    websiteUrl: "https://mobbin.com",
    tagline:
      "Save hours of UI & UX research with 400,000+ searchable iOS, Android, and Web product flows.",
    tier: "flagship-holo",
    accentColor: "#0d99ff",
    badge: "FLAGSHIP PARTNER",
  },
  {
    id: "raycast",
    companyName: "Raycast",
    websiteUrl: "https://raycast.com",
    tagline:
      "Your shortcut to everything. Blazingly fast launcher, AI workflows, and developer extensions.",
    tier: "grid-card",
    accentColor: "#ff3b6b",
    badge: "CATALOG SPONSOR",
  },
  {
    id: "linear",
    companyName: "Linear",
    websiteUrl: "https://linear.app",
    tagline:
      "Purpose-built tool for planning and building software with high-craft keyboard speed.",
    tier: "grid-card",
    accentColor: "#5b8def",
    badge: "DESIGN TOOLS",
  },
];

export async function GET() {
  await ensureSchema();
  const community = await db
    .select()
    .from(sponsorApplications)
    .orderBy(desc(sponsorApplications.createdAt))
    .limit(12);

  return NextResponse.json({
    featured: FEATURED_SPONSORS,
    applications: community,
    slotsRemaining: Math.max(1, 4 - Math.min(3, community.length)),
  });
}

export async function POST(req: NextRequest) {
  await ensureSchema();
  const body = await req.json();
  const companyName = String(body.companyName ?? "").trim();
  const contactEmail = String(body.contactEmail ?? "").trim();
  const websiteUrl = String(body.websiteUrl ?? "").trim();
  const tagline = String(body.tagline ?? "").trim();
  const tier = String(body.tier ?? "grid-card").trim();
  const accentColor = String(body.accentColor ?? "#0d99ff").trim();

  if (!companyName || !contactEmail || !websiteUrl || !tagline) {
    return NextResponse.json(
      { error: "All fields are required to submit a sponsor slot request." },
      { status: 400 }
    );
  }

  const [created] = await db
    .insert(sponsorApplications)
    .values({
      companyName: companyName.slice(0, 64),
      contactEmail: contactEmail.slice(0, 120),
      websiteUrl: websiteUrl.slice(0, 180),
      tagline: tagline.slice(0, 220),
      tier,
      accentColor,
      status: "live_preview",
    })
    .returning();

  return NextResponse.json({ application: created }, { status: 201 });
}
