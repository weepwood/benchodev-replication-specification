import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { blockStats, mcpKeys } from "@/db/schema";
import { ensureSchema } from "@/db/ensureSchema";
import {
  ALL_138_BLOCKS,
  FEATURED_BLOCKS,
  generateBlockSourceCode,
  getBlockById,
} from "@/lib/blocksCatalog";
import { UI_SOUNDS, generateSoundCodeSnippet } from "@/lib/soundEngine";
import { eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

async function recordKeyUsage(key: string | null, blockId?: string) {
  if (key && key.startsWith("bnc_")) {
    await db
      .update(mcpKeys)
      .set({ usageCount: sql`${mcpKeys.usageCount} + 1` })
      .where(eq(mcpKeys.apiKey, key));
  }
  if (blockId) {
    await db
      .insert(blockStats)
      .values({ id: blockId, copyCount: 24, likesCount: 18, mcpPulls: 10 })
      .onConflictDoUpdate({
        target: blockStats.id,
        set: { mcpPulls: sql`${blockStats.mcpPulls} + 1`, updatedAt: new Date() },
      });
  }
}

export async function GET(req: NextRequest) {
  await ensureSchema();
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  const blockId = searchParams.get("id");

  await recordKeyUsage(key, blockId ?? undefined);

  if (blockId) {
    const block = getBlockById(blockId);
    if (!block) {
      return NextResponse.json({ error: "Block not found" }, { status: 404 });
    }
    return NextResponse.json({
      protocol: "bencho-mcp/1.0",
      authenticated: Boolean(key),
      tool: "get_block_source",
      block: {
        id: block.id,
        title: block.title,
        kind: block.kind,
        tagline: block.tagline,
        source: generateBlockSourceCode(block),
      },
    });
  }

  return NextResponse.json({
    protocol: "bencho-mcp/1.0",
    name: "bencho-mcp-server",
    version: "1.4.0",
    authenticated: Boolean(key),
    capabilities: ["list_blocks", "get_block_source", "get_sound_synth"],
    totalBlocks: ALL_138_BLOCKS.length,
    featuredBlocks: FEATURED_BLOCKS.map((b) => ({
      id: b.id,
      title: b.title,
      kind: b.kind,
      tagline: b.tagline,
    })),
  });
}

export async function POST(req: NextRequest) {
  await ensureSchema();
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key") ?? req.headers.get("x-bencho-key");
  const payload = await req.json().catch(() => ({}));
  const { id = 1, method, params } = payload;

  await recordKeyUsage(key, params?.arguments?.id);

  if (method === "initialize") {
    return NextResponse.json({
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2025-03-26",
        serverInfo: { name: "bencho-mcp", version: "1.4.0" },
        capabilities: { tools: {} },
      },
    });
  }

  if (method === "tools/list") {
    return NextResponse.json({
      jsonrpc: "2.0",
      id,
      result: {
        tools: [
          {
            name: "list_blocks",
            description: "List interactive UI blocks in Bencho by kind.",
            inputSchema: {
              type: "object",
              properties: { kind: { type: "string" } },
            },
          },
          {
            name: "pull_block",
            description: "Pull standalone TSX source code for a live Bencho block.",
            inputSchema: {
              type: "object",
              required: ["id"],
              properties: { id: { type: "string" } },
            },
          },
          {
            name: "pull_sound",
            description: "Pull zero-dependency Web Audio TypeScript synth for a UI sound.",
            inputSchema: {
              type: "object",
              required: ["id"],
              properties: { id: { type: "string" } },
            },
          },
        ],
      },
    });
  }

  if (method === "tools/call") {
    const toolName = params?.name;
    const args = params?.arguments ?? {};

    if (toolName === "pull_block") {
      const block = getBlockById(String(args.id ?? "ink-bloom"));
      if (!block) {
        return NextResponse.json({
          jsonrpc: "2.0",
          id,
          error: { code: -32602, message: "Block not found" },
        });
      }
      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        result: {
          content: [
            {
              type: "text",
              text: generateBlockSourceCode(block),
            },
          ],
        },
      });
    }

    if (toolName === "pull_sound") {
      const sound = UI_SOUNDS.find((s) => s.id === args.id) ?? UI_SOUNDS[0];
      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        result: {
          content: [{ type: "text", text: generateSoundCodeSnippet(sound) }],
        },
      });
    }

    const list = args.kind
      ? FEATURED_BLOCKS.filter((b) => b.kind.toLowerCase() === String(args.kind).toLowerCase())
      : FEATURED_BLOCKS;

    return NextResponse.json({
      jsonrpc: "2.0",
      id,
      result: {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              list.map((b) => ({ id: b.id, title: b.title, kind: b.kind })),
              null,
              2
            ),
          },
        ],
      },
    });
  }

  return NextResponse.json({
    jsonrpc: "2.0",
    id,
    result: { status: "ok", message: "Bencho MCP endpoint ready" },
  });
}
