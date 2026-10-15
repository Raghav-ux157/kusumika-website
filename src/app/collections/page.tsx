import React from "react";
import { CollectionsView } from "@/components/commerce/CollectionsView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Handcrafted Indian Home Textiles & Bed Linen Collections | Kusumika",
  description:
    "Explore pure 400TC organic cotton bedsheets, reversible mulberry silk dohars, 700 GSM waffle bath towels, and hand-embroidered cushions.",
};

export default function CollectionsPage({
  searchParams,
}: {
  searchParams?: { search?: string };
}) {
  return (
    <CollectionsView
      initialCategory="all"
      initialSearchQuery={searchParams?.search || ""}
    />
  );
}
