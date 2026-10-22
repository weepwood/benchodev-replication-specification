import React from "react";
import { notFound } from "next/navigation";
import { getBlockById } from "@/lib/blocksCatalog";
import { BlockDetailStudio } from "@/components/blocks/BlockDetailStudio";

export default async function BlockDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const block = getBlockById(id);

  if (!block) {
    notFound();
  }

  return <BlockDetailStudio block={block} />;
}
