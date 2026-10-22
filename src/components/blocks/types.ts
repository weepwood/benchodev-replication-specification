import type { BlockTweakConfig, BlockMeta } from "@/lib/blocksCatalog";

export interface LiveBlockProps {
  tweaks?: BlockTweakConfig;
  compact?: boolean;
  meta?: BlockMeta;
}
