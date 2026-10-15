"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { ProductCard, BulkQuoteModal } from "@/components/commerce";
import { Drawer, Button, Checkbox, Select, Badge } from "@/components/ui";
import { MOCK_CATALOG } from "@/lib/mockCatalog";
import { useStore } from "@/context/StoreContext";
import { ProductCategory, Product } from "@/types";
import { cn } from "@/lib/utils";

const CATEGORY_NAMES: Record<string, { title: string; subtitle: string }> = {
  all: {
    title: "All Handcrafted Collections",
    subtitle: "Pure 400–600TC cotton bedsheets, reversible silk dohars, waffle bath towels & decor.",
  },
  "bedsheets-linens": {
    title: "Hand-Loomed Bedsheets & Linens",
    subtitle: "Woven with centuries-old Sanganeri botanicals, breathable 400 to 600 thread counts, and gentle vegetable washes.",
  },
  "throws-quilts": {
    title: "Throws, Dohars & Jaipuri Quilts",
    subtitle: "Featherlight 3-layer mulberry silk & cotton dohars with artisanal hand-tagai quilting.",
  },
  "towels-bath": {
    title: "Towels & Luxury Bath Linens",
    subtitle: "700 GSM deep waffle-weave and zero-twist combed Aegean cottons for plush sanctuary comfort.",
  },
  "cushions-decor": {
    title: "Cushions & Living Sanctuaries",
    subtitle: "Raw matka silk and pure cotton slub accented with delicate Jaipur Aari needlecraft.",
  },
  "festive-edit": {
    title: "Festive Heritage Edit",
    subtitle: "Celebratory diwan sets, zari borders, and rare botanical block editions for auspicious gatherings.",
  },
};

const PIGMENT_COLORS = [
  { name: "Terracotta", hex: "#B85C4A" },
  { name: "Indigo", hex: "#2C3E50" },
  { name: "Sage Olive", hex: "#6B6B3F" },
  { name: "Turmeric", hex: "#D4AF37" },
  { name: "Ochre", hex: "#C28C4B" },
  { name: "Sand Ivory", hex: "#F3E9DC" },
];

export interface CollectionsViewProps {
  initialCategory?: ProductCategory | "all";
  initialSearchQuery?: string;
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({
  initialCategory = "all",
  initialSearchQuery = "",
}) => {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedCrafts, setSelectedCrafts] = useState<string[]>([]);
  const [selectedThreadCounts, setSelectedThreadCounts] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);

  // Helper toggle functions
  const toggleItem = (list: string[], setList: (val: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const clearAllFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedMaterials([]);
    setSelectedCrafts([]);
    setSelectedThreadCounts([]);
    setSelectedPriceRanges([]);
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedSizes.length > 0 ||
    selectedColors.length > 0 ||
    selectedMaterials.length > 0 ||
    selectedCrafts.length > 0 ||
    selectedThreadCounts.length > 0 ||
    selectedPriceRanges.length > 0 ||
    searchQuery.trim().length > 0;

  // Filter logic
  const filteredProducts = useMemo(() => {
    return MOCK_CATALOG.filter((prod) => {
      // Category filter
      if (selectedCategory !== "all" && prod.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = prod.title.toLowerCase().includes(q);
        const matchSub = prod.subtitle.toLowerCase().includes(q);
        const matchCraft = prod.craftTechnique.toLowerCase().includes(q);
        const matchMat = prod.material.toLowerCase().includes(q);
        if (!matchTitle && !matchSub && !matchCraft && !matchMat) return false;
      }

      // Color filter
      if (selectedColors.length > 0) {
        const hasColor = prod.swatches.some((sw) =>
          selectedColors.some(
            (c) =>
              sw.name.toLowerCase().includes(c.toLowerCase()) ||
              c.toLowerCase().includes(sw.name.toLowerCase())
          )
        );
        if (!hasColor) return false;
      }

      // Material filter
      if (selectedMaterials.length > 0) {
        const hasMat = selectedMaterials.some((m) =>
          prod.material.toLowerCase().includes(m.toLowerCase())
        );
        if (!hasMat) return false;
      }

      // Craft filter
      if (selectedCrafts.length > 0) {
        const hasCraft = selectedCrafts.some((c) =>
          prod.craftTechnique.toLowerCase().includes(c.toLowerCase())
        );
        if (!hasCraft) return false;
      }

      // Thread count filter
      if (selectedThreadCounts.length > 0) {
        const tc = prod.threadCount || 300;
        const matchTc = selectedThreadCounts.some((range) => {
          if (range === "200-300") return tc >= 200 && tc <= 300;
          if (range === "300-400") return tc > 300 && tc <= 400;
          if (range === "400+") return tc > 400;
          return true;
        });
        if (!matchTc) return false;
      }

      // Price range filter
      if (selectedPriceRanges.length > 0) {
        const p = prod.price;
        const matchPrice = selectedPriceRanges.some((range) => {
          if (range === "under-2000") return p < 2000;
          if (range === "2000-3500") return p >= 2000 && p <= 3500;
          if (range === "3500-5000") return p > 3500 && p <= 5000;
          if (range === "5000+") return p > 5000;
          return true;
        });
        if (!matchPrice) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "tc-desc") return (b.threadCount || 0) - (a.threadCount || 0);
      if (sortBy === "bestselling") return b.reviewCount - a.reviewCount;
      return 0; // featured
    });
  }, [
    selectedCategory,
    searchQuery,
    selectedColors,
    selectedMaterials,
    selectedCrafts,
    selectedThreadCounts,
    selectedPriceRanges,
    sortBy,
  ]);

  const catMeta =
    CATEGORY_NAMES[selectedCategory] || CATEGORY_NAMES.all;

  // Filter Sidebar Content (shared between Desktop sidebar & Mobile Drawer)
  const FilterControls = (
    <div className="flex flex-col gap-6 font-sans">
      {/* Category Selection Tabs */}
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wider text-primary font-bold">
          Category Focus
        </span>
        <div className="flex flex-col gap-1 text-sm">
          {[
            { id: "all", label: "All Collections" },
            { id: "bedsheets-linens", label: "Bedsheets & Linens" },
            { id: "throws-quilts", label: "Throws & Quilts" },
            { id: "towels-bath", label: "Towels & Bath" },
            { id: "cushions-decor", label: "Cushions & Living" },
            { id: "festive-edit", label: "Festive Edit" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "py-1.5 px-2.5 rounded-lg text-left transition-colors flex items-center justify-between text-xs",
                selectedCategory === cat.id
                  ? "bg-surface-container font-bold text-primary"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
              )}
            >
              <span>{cat.label}</span>
              {selectedCategory === cat.id && (
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bed Size Filter */}
      <div className="flex flex-col gap-2.5 pt-4 border-t border-outline-variant/30">
        <span className="text-xs uppercase tracking-wider text-primary font-bold">
          Bed Linen Sizes
        </span>
        <div className="flex flex-col gap-2">
          {[
            { id: "queen", label: "Double / Queen (84x100\")" },
            { id: "king", label: "King Palatial (108x108\")" },
            { id: "single", label: "Single / Twin (60x90\")" },
            { id: "fitted", label: "Fitted Elastic Corner" },
          ].map((size) => (
            <Checkbox
              key={size.id}
              label={size.label}
              checked={selectedSizes.includes(size.id)}
              onChange={() => toggleItem(selectedSizes, setSelectedSizes, size.id)}
            />
          ))}
        </div>
      </div>

      {/* Organic Pigment Tones */}
      <div className="flex flex-col gap-2.5 pt-4 border-t border-outline-variant/30">
        <span className="text-xs uppercase tracking-wider text-primary font-bold">
          Organic Pigment Tones
        </span>
        <div className="grid grid-cols-3 gap-2">
          {PIGMENT_COLORS.map((color) => {
            const isSelected = selectedColors.includes(color.name);
            return (
              <button
                key={color.name}
                type="button"
                onClick={() => toggleItem(selectedColors, setSelectedColors, color.name)}
                className={cn(
                  "flex flex-col items-center gap-1 p-1.5 rounded-lg transition-all text-center",
                  isSelected
                    ? "bg-surface-container ring-1 ring-primary"
                    : "bg-surface hover:bg-surface-container-low"
                )}
              >
                <span
                  className={cn(
                    "w-5 h-5 rounded-full shadow-inner",
                    isSelected && "ring-2 ring-primary ring-offset-1"
                  )}
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-[10px] text-on-surface-variant line-clamp-1">
                  {color.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Weave & Material */}
      <div className="flex flex-col gap-2.5 pt-4 border-t border-outline-variant/30">
        <span className="text-xs uppercase tracking-wider text-primary font-bold">
          Weave & Material
        </span>
        <div className="flex flex-col gap-2">
          {[
            { id: "GOTS", label: "100% GOTS Pure Cotton" },
            { id: "Sateen", label: "Cotton Sateen Weave" },
            { id: "Silk", label: "Mulberry Silk Blend" },
            { id: "Waffle", label: "700 GSM Waffle Weave" },
          ].map((mat) => (
            <Checkbox
              key={mat.id}
              label={mat.label}
              checked={selectedMaterials.includes(mat.id)}
              onChange={() => toggleItem(selectedMaterials, setSelectedMaterials, mat.id)}
            />
          ))}
        </div>
      </div>

      {/* Thread Count Range */}
      <div className="flex flex-col gap-2.5 pt-4 border-t border-outline-variant/30">
        <span className="text-xs uppercase tracking-wider text-primary font-bold">
          Thread Count (TC)
        </span>
        <div className="flex flex-col gap-2">
          {[
            { id: "200-300", label: "200–300 TC (Crisp Daily)" },
            { id: "300-400", label: "300–400 TC (Silky Smooth)" },
            { id: "400+", label: "400+ TC (Royal Sateen)" },
          ].map((tc) => (
            <Checkbox
              key={tc.id}
              label={tc.label}
              checked={selectedThreadCounts.includes(tc.id)}
              onChange={() => toggleItem(selectedThreadCounts, setSelectedThreadCounts, tc.id)}
            />
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="flex flex-col gap-2.5 pt-4 border-t border-outline-variant/30">
        <span className="text-xs uppercase tracking-wider text-primary font-bold">
          Price Range
        </span>
        <div className="flex flex-col gap-2">
          {[
            { id: "under-2000", label: "Under ₹1,999" },
            { id: "2000-3500", label: "₹2,000 – ₹3,499" },
            { id: "3500-5000", label: "₹3,500 – ₹4,999" },
            { id: "5000+", label: "₹5,000 & Above" },
          ].map((price) => (
            <Checkbox
              key={price.id}
              label={price.label}
              checked={selectedPriceRanges.includes(price.id)}
              onChange={() => toggleItem(selectedPriceRanges, setSelectedPriceRanges, price.id)}
            />
          ))}
        </div>
      </div>

      {/* Clear Filters CTA */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearAllFilters}
          fullWidth={true}
          className="mt-2"
        >
          Reset All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Header />

      <main className="flex-1 w-full">
        {/* COLLECTION HEADER HERO */}
        <section className="w-full bg-surface-container-low border-b border-outline-variant/40 px-4 sm:px-8 lg:px-12 py-10 lg:py-14">
          <div className="max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">
                  spa
                </span>
                <span className="font-sans text-xs uppercase tracking-[0.2em] text-secondary font-bold">
                  Heirloom Handloom Edition
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-primary font-normal leading-tight">
                {catMeta.title}
              </h1>
              <p className="font-sans text-sm md:text-base text-on-surface-variant max-w-2xl leading-relaxed">
                {catMeta.subtitle}
              </p>
            </div>

            {/* Purity Standard Badges */}
            <div className="lg:col-span-4 flex items-center lg:justify-end gap-3 flex-wrap">
              <div className="bg-surface px-4 py-2.5 rounded-lg border border-outline-variant/50 shadow-sm flex items-center gap-2.5">
                <span className="material-symbols-outlined text-tertiary text-[24px]">
                  verified
                </span>
                <div className="flex flex-col">
                  <span className="font-sans text-[10px] uppercase text-outline font-semibold">
                    Purity Standard
                  </span>
                  <span className="font-serif text-sm text-primary font-medium leading-tight">
                    100% GOTS Pure
                  </span>
                </div>
              </div>

              <div className="bg-surface px-4 py-2.5 rounded-lg border border-outline-variant/50 shadow-sm flex items-center gap-2.5">
                <span className="material-symbols-outlined text-secondary text-[24px]">
                  brush
                </span>
                <div className="flex flex-col">
                  <span className="font-sans text-[10px] uppercase text-outline font-semibold">
                    Master Craft
                  </span>
                  <span className="font-serif text-sm text-primary font-medium leading-tight">
                    Teakwood Block
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* UTILITY CONTROL BAR (Filter toggle, search, results count & sorting) */}
        <section className="sticky top-20 z-30 bg-surface/95 backdrop-blur border-b border-outline-variant/40 px-4 sm:px-8 lg:px-12 py-3 shadow-sm">
          <div className="max-w-[1360px] mx-auto flex flex-wrap items-center justify-between gap-4">
            {/* Left: Mobile Filter Button & Results Count */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant text-xs font-sans font-bold uppercase tracking-wider text-primary"
              >
                <span className="material-symbols-outlined text-[16px]">
                  tune
                </span>
                <span>Filters ({hasActiveFilters ? "Active" : "All"})</span>
              </button>

              <div className="flex items-center gap-2 text-xs font-sans">
                <span className="font-bold text-secondary uppercase tracking-wider">
                  Catalogue Index
                </span>
                <span className="text-outline">•</span>
                <span className="text-on-surface-variant">
                  Showing <strong>{filteredProducts.length}</strong> handcrafted designs
                </span>
              </div>
            </div>

            {/* Right: Search filter input & Sort By dropdown */}
            <div className="flex items-center gap-3">
              <div className="relative hidden sm:flex items-center">
                <input
                  type="text"
                  placeholder="Filter designs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded bg-surface-container-low border border-outline-variant px-3 py-1.5 pl-8 text-xs font-sans text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container"
                />
                <span className="material-symbols-outlined text-outline absolute left-2 text-[16px]">
                  search
                </span>
              </div>

              <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded border border-outline-variant/40">
                <label
                  htmlFor="sort-select"
                  className="text-xs font-sans uppercase tracking-wider text-outline whitespace-nowrap"
                >
                  Sort By:
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs font-sans font-semibold text-on-surface cursor-pointer focus:outline-none"
                >
                  <option value="featured">Featured Curations</option>
                  <option value="bestselling">Best Selling Heirlooms</option>
                  <option value="tc-desc">Thread Count: High to Low</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* ACTIVE REFINEMENT PILLS ROW */}
          {hasActiveFilters && (
            <div className="max-w-[1360px] mx-auto pt-2.5 pb-1 flex flex-wrap items-center gap-2 border-t border-outline-variant/30 mt-2">
              <span className="font-sans text-[11px] uppercase tracking-wider text-outline pr-1">
                Active Refinements:
              </span>

              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface text-xs font-sans">
                  <span>"{searchQuery}"</span>
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="hover:text-primary"
                  >
                    ×
                  </button>
                </span>
              )}

              {selectedColors.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface text-xs font-sans"
                >
                  <span>{c}</span>
                  <button
                    type="button"
                    onClick={() => toggleItem(selectedColors, setSelectedColors, c)}
                    className="hover:text-primary"
                  >
                    ×
                  </button>
                </span>
              ))}

              {selectedSizes.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface text-xs font-sans"
                >
                  <span className="capitalize">{s}</span>
                  <button
                    type="button"
                    onClick={() => toggleItem(selectedSizes, setSelectedSizes, s)}
                    className="hover:text-primary"
                  >
                    ×
                  </button>
                </span>
              ))}

              {selectedMaterials.map((m) => (
                <span
                  key={m}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface text-xs font-sans"
                >
                  <span>{m}</span>
                  <button
                    type="button"
                    onClick={() => toggleItem(selectedMaterials, setSelectedMaterials, m)}
                    className="hover:text-primary"
                  >
                    ×
                  </button>
                </span>
              ))}

              <button
                type="button"
                onClick={clearAllFilters}
                className="font-sans text-xs uppercase tracking-wider text-secondary underline hover:text-primary ml-2"
              >
                Clear All
              </button>
            </div>
          )}
        </section>

        {/* MAIN CATALOG CONTENT WITH SIDEBAR & PRODUCT GRID */}
        <section className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Desktop Filter Sidebar (3 cols) */}
            <aside className="hidden lg:block lg:col-span-3 sticky top-36 p-5 rounded-xl bg-surface-container-low border border-outline-variant/40 shadow-sm space-y-6">
              {FilterControls}

              {/* Artisan Collective Stamp Banner */}
              <div className="pt-4 border-t border-outline-variant/40 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center shrink-0 border border-outline-variant/40">
                  <span className="material-symbols-outlined text-secondary text-[18px]">
                    filter_vintage
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-primary">
                    Sanganer & Bagru
                  </span>
                  <span className="font-sans text-[10px] text-outline leading-tight">
                    Direct GI artisan provenance seal guaranteed.
                  </span>
                </div>
              </div>
            </aside>

            {/* Product Grid Area (9 cols) */}
            <div className="lg:col-span-9 flex flex-col gap-8">
              {filteredProducts.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-center gap-4 bg-surface-container-low rounded-2xl border border-outline-variant/40 p-8">
                  <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-outline">
                    <span className="material-symbols-outlined text-[32px]">
                      search_off
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif text-2xl text-primary font-normal">
                      No Handcrafted Designs Found
                    </h3>
                    <p className="font-sans text-sm text-on-surface-variant max-w-md">
                      We could not find any items matching your active refinements. Try clearing some filters or searching for terms like "Lotus", "Bagru", or "Sateen".
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={clearAllFilters}>
                    Clear All Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                  {filteredProducts.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      initialWishlisted={isInWishlist(prod.id)}
                      onQuickAdd={(p) => addToCart(p)}
                      onWishlistToggle={(p) => toggleWishlist(p)}
                    />
                  ))}
                </div>
              )}

              {/* Bulk / Trade Inquiry Callout Banner at bottom of PLP */}
              <div className="p-6 rounded-2xl bg-surface-container border border-outline-variant/60 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                <div className="space-y-1 text-center md:text-left">
                  <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-secondary">
                    Hospitality & Trade Program
                  </span>
                  <h3 className="font-serif text-2xl text-primary font-normal">
                    Equip Your Hotel or Homestay with Kusumika Linens
                  </h3>
                  <p className="font-sans text-xs text-on-surface-variant max-w-xl">
                    Direct loom allocation, bespoke thread counts (300–800 TC), monogram embroidery, and wholesale trade pricing for orders of 10+ units.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setBulkModalOpen(true)}
                  className="shrink-0"
                >
                  Request Trade Pricing
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Mobile Filter Slide-Over Drawer */}
      <Drawer
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        position="left"
        width="md"
        title="Refine Collection"
        subtitle={`Showing ${filteredProducts.length} items`}
      >
        <div className="py-2">
          {FilterControls}
          <div className="pt-6 mt-6 border-t border-outline-variant/40">
            <Button
              variant="primary"
              fullWidth={true}
              onClick={() => setMobileFilterOpen(false)}
            >
              Apply Refinements ({filteredProducts.length} Results)
            </Button>
          </div>
        </div>
      </Drawer>

      {/* Bulk Quote Modal */}
      <BulkQuoteModal
        isOpen={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
      />
    </div>
  );
};
