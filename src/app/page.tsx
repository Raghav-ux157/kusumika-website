"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { ArchImageFrame, LotusDivider, ArtisanProvenanceStamp, WeaveMeter } from "@/components/brand";
import { ProductCard } from "@/components/commerce";
import { Button, Card, Badge } from "@/components/ui";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import { Product } from "@/types";

export default function HomePage() {
  const [cartCount, setCartCount] = useState(2);
  const [wishlistCount, setWishlistCount] = useState(3);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleQuickAdd = (product: Product) => {
    setCartCount((prev) => prev + 1);
    showToast(`Added "${product.title}" to your sanctuary cart!`);
  };

  const handleWishlistToggle = (product: Product, isWishlisted: boolean) => {
    setWishlistCount((prev) => (isWishlisted ? prev + 1 : Math.max(0, prev - 1)));
    showToast(
      isWishlisted
        ? `Saved "${product.title}" to your wishlist.`
        : `Removed "${product.title}" from wishlist.`
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary-container text-surface px-5 py-3 rounded-lg shadow-elevation-2 font-sans text-xs uppercase tracking-wider flex items-center gap-2 border border-outline-variant/50 animate-in fade-in slide-in-from-bottom-4">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Header */}
      <Header
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onOpenCart={() => showToast("Opening Sanctuary Cart Drawer...")}
        onOpenWishlist={() => showToast("Navigating to Wishlist...")}
        onOpenSearch={() => showToast("Opening Search modal...")}
      />

      <main className="flex-1 w-full">
        {/* PHASE 0 HERO BANNER ANNOUNCING DESIGN SYSTEM & PREVIEW */}
        <div className="w-full bg-surface-container py-3 px-4 border-b border-outline-variant/50 text-center select-none">
          <div className="max-w-[1360px] mx-auto flex flex-wrap items-center justify-center gap-2 text-xs font-sans">
            <Badge variant="terracotta" size="sm">Phase 0 Complete</Badge>
            <span className="text-on-surface">
              Explore the full interactive Component Library & Token Swatches:
            </span>
            <Link
              href="/design-preview"
              className="font-bold text-primary underline underline-offset-4 hover:text-secondary"
            >
              Go to /design-preview →
            </Link>
          </div>
        </div>

        {/* HERO SECTION (Editorial Jharokha Arch & Asymmetrical Overlap Layout) */}
        <section className="relative w-full px-4 sm:px-8 lg:px-12 pt-8 pb-16 lg:pb-24 bg-surface-container-low overflow-hidden">
          {/* Ambient Terracotta Glows */}
          <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-secondary-fixed/30 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-primary-fixed/20 blur-3xl pointer-events-none" />

          <div className="max-w-[1360px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Dominant Arched Visual Presentation (7 cols) */}
              <div className="lg:col-span-7 relative order-2 lg:order-1">
                <ArchImageFrame
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRMIchdugj20pPdd_lSPpXZWh0B-iMTnXxw7Pnoo9XIzrypUR09G8ecgnRktlUqm6CduhjxafsAorjHSwOYkAcTtqw0ZA37zU8ihpsMySVuFciOsdnkgm4TabUJucGKvYlJiroBceAlhqFKrUdj8Aq9mvAUNRIhDFRRN-THsieH-YlTYH_1Ibp9mZZ5iWJRfYMWp-A2a3Ah3AJVdz-NsYrRhfxZwqepS5DSGHbUqoMtzznMbCjZG9M4g"
                  alt="Luxurious heritage Indian royal bedroom bathed in warm golden afternoon sunlight"
                  variant="hero"
                  aspectRatio="aspect-[16/13] md:aspect-[4/3]"
                  badgeText="Bagru Loom"
                  priority={true}
                >
                  {/* Overlapping Floating Editorial Callout Card */}
                  <div className="absolute -bottom-6 right-2 sm:right-6 bg-surface p-4 rounded-xl shadow-xl border border-outline-variant/40 max-w-[280px] pointer-events-auto">
                    <div className="flex items-center gap-1 text-tertiary mb-1">
                      <span className="material-symbols-outlined text-[16px] text-brand-gold" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span className="font-sans text-xs text-on-surface-variant font-bold ml-1">
                        5.0 (420+ Patrons)
                      </span>
                    </div>
                    <p className="font-serif text-base text-primary font-normal leading-snug">
                      The Sanganer Edit
                    </p>
                    <p className="font-sans text-xs text-on-surface-variant">
                      Mulberry Silk & Cotton Dohar
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-serif text-lg text-secondary font-bold">
                        ₹3,450
                      </span>
                      <span className="px-2 py-0.5 rounded bg-surface-container text-secondary font-sans text-[10px] uppercase font-bold tracking-wider">
                        Heritage Lot
                      </span>
                    </div>
                  </div>
                </ArchImageFrame>
              </div>

              {/* Right Column: Editorial Storytelling (5 cols) */}
              <div className="lg:col-span-5 space-y-5 order-1 lg:order-2 z-10 lg:pl-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-container-highest text-secondary text-[11px] font-sans font-bold tracking-widest uppercase">
                  <span className="material-symbols-outlined text-[16px]">stars</span>
                  <span>Handcrafted in Rajasthan</span>
                </div>

                <div className="space-y-3">
                  <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-primary font-normal tracking-tight leading-[1.08]">
                    Soft like Silk,<br />
                    <span className="italic text-secondary">Feels like a Hug</span>
                  </h1>
                  <p className="font-sans text-base lg:text-lg text-on-surface-variant leading-relaxed">
                    Immerse your sanctuary in pure 400-thread-count organic cotton and mulberry silk weaves. Hand-loomed with centuries-old Sanganeri and Bagru botanical block prints.
                  </p>
                </div>

                {/* Call to Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Button
                    variant="secondary"
                    size="lg"
                    rightIcon={<span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
                    onClick={() => showToast("Navigating to Bedsheets Collection...")}
                  >
                    Explore Bed Linen
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    leftIcon={<span className="material-symbols-outlined text-[18px]">menu_book</span>}
                    onClick={() => showToast("Opening Hospitality Catalog...")}
                  >
                    Trade Catalog
                  </Button>
                </div>

                {/* Trust Badges Inline */}
                <div className="pt-4 flex flex-wrap sm:flex-nowrap items-center gap-4 border-t border-outline-variant/40">
                  <div className="flex items-center gap-1.5 text-on-surface-variant font-sans text-xs">
                    <span className="material-symbols-outlined text-tertiary text-[18px]">check_circle</span>
                    <span>100% GOTS Cotton</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-on-surface-variant font-sans text-xs">
                    <span className="material-symbols-outlined text-tertiary text-[18px]">check_circle</span>
                    <span>Artisanal Hand-Block</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-on-surface-variant font-sans text-xs">
                    <span className="material-symbols-outlined text-tertiary text-[18px]">check_circle</span>
                    <span>Partial COD Option</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION DIVIDER: Lotus Emblem & Filigree */}
        <LotusDivider label="Kusumika" lineWidth="md" />

        {/* FEATURED HEIRLOOM COLLECTION PREVIEW */}
        <section className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12 py-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div className="space-y-1">
              <span className="font-sans text-xs uppercase tracking-[0.2em] text-secondary font-bold">
                Heirloom Handloom Edition
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-primary font-normal">
                Curated Bed Linen & Dohars
              </h2>
            </div>
            <Link href="/design-preview" className="text-xs font-sans uppercase font-bold tracking-wider text-secondary hover:text-primary underline underline-offset-4">
              View All Components & Tokens →
            </Link>
          </div>

          {/* 3-Column Product Grid with Arch Frames */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {MOCK_PRODUCTS.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onQuickAdd={handleQuickAdd}
                onWishlistToggle={handleWishlistToggle}
              />
            ))}
          </div>
        </section>

        {/* ARTISAN PROVENANCE & WEAVE METER SHOWCASE */}
        <section className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12 py-10 border-t border-outline-variant/30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <Card variant="editorial" padded={true}>
              <div className="space-y-3">
                <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-secondary">
                  The Jaipur Atelier Standard
                </span>
                <h3 className="font-serif text-2xl text-primary font-normal">
                  Authentic Mud-Resist & Vegetable Washes
                </h3>
                <p className="font-sans text-xs md:text-sm text-on-surface-variant leading-relaxed">
                  Every thread is hand-spun and immersed in herbal mordants extracted from dried pomegranate rind, madder roots, and indigo leaves. No toxic azo dyes or synthetic finishes touch our fabric.
                </p>
                <div className="pt-2">
                  <ArtisanProvenanceStamp
                    village="Sanganer & Bagru Collective"
                    sealText="Certified GI Heritage Craftsmanship • Rajasthan, India"
                  />
                </div>
              </div>
            </Card>

            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-sans font-bold uppercase tracking-widest text-primary">
                  Tactile Sensory Guide
                </span>
                <h3 className="font-serif text-2xl text-primary font-normal">
                  Understanding Weave & Thread Counts
                </h3>
                <p className="font-sans text-xs md:text-sm text-on-surface-variant leading-relaxed">
                  Unlike industrial brands that inflate counts with synthetic multi-ply yarns, Kusumika uses single-ply long-staple organic cotton.
                </p>
              </div>

              <WeaveMeter threadCount={400} />

              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="font-sans text-xs font-bold text-primary uppercase tracking-wider">
                    Partial COD Available Across India
                  </span>
                  <p className="font-sans text-[11px] text-outline">
                    Pay ₹500 advance online to confirm loom order, balance on doorstep delivery.
                  </p>
                </div>
                <Badge variant="terracotta" size="sm">Zero Risk</Badge>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
