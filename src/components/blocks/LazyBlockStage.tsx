"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { LiveBlockProps } from "./types";
import type { BlockMeta, BlockTweakConfig } from "@/lib/blocksCatalog";

const StageSkeleton = () => (
  <div
    className="bnc-shimmer-bar"
    style={{
      width: 148,
      height: 44,
      borderRadius: 999,
      opacity: 0.6,
    }}
  />
);

const LAZY_CHUNKS: Record<string, ComponentType<LiveBlockProps>> = {
  "ink-bloom": dynamic(() => import("./items/InkBloom"), { loading: StageSkeleton }),
  "peek-rating": dynamic(() => import("./items/PeekRating"), { loading: StageSkeleton }),
  "card-swap": dynamic(() => import("./items/CardSwap"), { loading: StageSkeleton }),
  "dot-swarm": dynamic(() => import("./items/DotSwarm"), { loading: StageSkeleton, ssr: false }),
  "wake-slider": dynamic(() => import("./items/WakeSlider"), { loading: StageSkeleton }),
  metaballs: dynamic(() => import("./items/Metaballs"), { loading: StageSkeleton, ssr: false }),
  "ai-chat-input": dynamic(() => import("./items/AIChatInput"), { loading: StageSkeleton }),
  "orbit-cards": dynamic(() => import("./items/OrbitCards"), { loading: StageSkeleton }),
  "load-cards": dynamic(() => import("./items/LoadCards"), { loading: StageSkeleton }),
  "edge-light": dynamic(() => import("./items/EdgeLight"), { loading: StageSkeleton }),
  "blueprint-loader": dynamic(() => import("./items/BlueprintLoader"), { loading: StageSkeleton }),
  "line-sidebar": dynamic(() => import("./items/LineSidebar"), { loading: StageSkeleton }),
  "option-wheel": dynamic(() => import("./items/OptionWheel"), { loading: StageSkeleton }),
  "line-sphere": dynamic(() => import("./items/LineSphere"), { loading: StageSkeleton, ssr: false }),
  "connect-sources": dynamic(() => import("./items/ConnectSources"), { loading: StageSkeleton }),
  "page-peel": dynamic(() => import("./items/PagePeel"), { loading: StageSkeleton }),
  "stacked-bars": dynamic(() => import("./items/StackedBars"), { loading: StageSkeleton }),
  "blast-radius": dynamic(() => import("./items/BlastRadius"), { loading: StageSkeleton }),
  "faq-accordion": dynamic(() => import("./items/FAQAccordion"), { loading: StageSkeleton }),
  "toast-stack": dynamic(() => import("./items/ToastStack"), { loading: StageSkeleton }),
  "resizable-panels": dynamic(() => import("./items/ResizablePanels"), { loading: StageSkeleton }),
  "tree-view": dynamic(() => import("./items/TreeView"), { loading: StageSkeleton }),
  "access-request": dynamic(() => import("./items/AccessRequest"), { loading: StageSkeleton }),
  "avatar-group": dynamic(() => import("./items/AvatarGroup"), { loading: StageSkeleton }),
  "profile-hover-card": dynamic(() => import("./items/ProfileHoverCard"), { loading: StageSkeleton }),
  "slide-confirm": dynamic(() => import("./items/SlideConfirm"), { loading: StageSkeleton }),
  "command-bar": dynamic(() => import("./items/CommandBar"), { loading: StageSkeleton }),
  "otp-slots": dynamic(() => import("./items/OtpSlots"), { loading: StageSkeleton }),
  "inline-rename": dynamic(() => import("./items/InlineRename"), { loading: StageSkeleton }),
  "dot-loader": dynamic(() => import("./items/DotLoader"), { loading: StageSkeleton }),
  "image-shimmer": dynamic(() => import("./items/ImageShimmer"), { loading: StageSkeleton }),
  "shimmer-text": dynamic(() => import("./items/ShimmerText"), { loading: StageSkeleton }),
};

const LazyArchiveArchetype = dynamic(() => import("./items/ArchiveArchetype"), {
  loading: StageSkeleton,
});

export function LazyBlockStage({
  block,
  tweaks,
  compact = true,
}: {
  block: BlockMeta;
  tweaks?: BlockTweakConfig;
  compact?: boolean;
}) {
  const Component = LAZY_CHUNKS[block.id] ?? LazyArchiveArchetype;
  return <Component tweaks={tweaks ?? block.defaultTweaks} compact={compact} meta={block} />;
}
