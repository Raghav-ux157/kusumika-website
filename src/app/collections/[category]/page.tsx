import React from "react";
import { CollectionsView } from "@/components/commerce/CollectionsView";
import { ProductCategory } from "@/types";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const titles: Record<string, string> = {
    "bedsheets-linens": "Hand-Loomed Bedsheets & Linens (400-600 TC)",
    "throws-quilts": "Throws, Reversible Dohars & Jaipuri Razais",
    "towels-bath": "700 GSM Waffle Weave & Aegean Bath Towel Sets",
    "cushions-decor": "Hand-Embroidered Raw Silk & Slub Cushion Covers",
    "festive-edit": "Festive Heritage Diwan Sets & Zari Weaves",
  };

  const title = titles[params.category] || "Artisanal Home Textiles";

  return {
    title: `${title} | Kusumika`,
    description: `Shop authentic Rajasthani hand-loomed ${title.toLowerCase()} crafted from pure GOTS cotton and herbal plant dyes.`,
  };
}

export default function CategoryCollectionsPage({
  params,
  searchParams,
}: {
  params: { category: string };
  searchParams?: { search?: string };
}) {
  return (
    <CollectionsView
      initialCategory={(params.category as ProductCategory) || "all"}
      initialSearchQuery={searchParams?.search || ""}
    />
  );
}
