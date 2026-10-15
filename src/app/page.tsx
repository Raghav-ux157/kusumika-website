"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { ArchImageFrame, LotusDivider, ArtisanProvenanceStamp, WeaveMeter } from "@/components/brand";
import { ProductCard, BulkQuoteModal } from "@/components/commerce";
import { Button, Card, Badge } from "@/components/ui";
import { MOCK_CATALOG } from "@/lib/mockCatalog";
import { useStore } from "@/context/StoreContext";

const CATEGORY_STRIP = [
  {
    name: "Bedsheets & Linens",
    href: "/collections/bedsheets-linens",
    desc: "400–600 TC Sateen & Percale",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBcAyVJ0jGVMBnmrBTuLekK_ich2CU6qqheQEidSh-_CpKd9AwW-U1RtMtw-w9W0D3gZBKXW3K1LjlPflVZ7M-1Zr2exxEgwDfTnVwJw3u1IBl91hJnP9zAHY295dki_24ZEFvJwcmbTTyTo_yaVRcOVaRTiSRwJmH39XarT8r3gf7Oyrq1w2H0W0q7Fxn9H_rBXu5ha5fp7lk1GPQl7pYpTqp9OXMSXUTGmkl1b4H6Uz_BH5TjuWgOAg",
  },
  {
    name: "Throws & Quilts",
    href: "/collections/throws-quilts",
    desc: "Mulberry Silk & Cotton Dohars",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBRMIchdugj20pPdd_lSPpXZWh0B-iMTnXxw7Pnoo9XIzrypUR09G8ecgnRktlUqm6CduhjxafsAorjHSwOYkAcTtqw0ZA37zU8ihpsMySVuFciOsdnkgm4TabUJucGKvYlJiroBceAlhqFKrUdj8Aq9mvAUNRIhDFRRN-THsieH-YlTYH_1Ibp9mZZ5iWJRfYMWp-A2a3Ah3AJVdz-NsYrRhfxZwqepS5DSGHbUqoMtzznMbCjZG9M4g",
  },
  {
    name: "Towels & Bath",
    href: "/collections/towels-bath",
    desc: "700 GSM Waffle Weave",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcpXu5ISUZNwesOrcde-lUwHJQHjmtrTjoS5FWaLcT4GsBn0WNgpsI6FbpfN5OHJJLrXSKRARHrwY2kRBO2hjI1WPmAFG-wthTMr93lAyOsq05fd_i7fVwfXlJd5lLmK063AiwuNtbZpPvmuPbDmt6dtK-CZehmrQbtVxFgUMKr7vnkQfLujhGWaq8H5C1plBpbnAUmYNJbUrdqNG0R-c9wolquwfshkw0_CONU7knB-S2VAom15PKsg",
  },
  {
    name: "Cushions & Living",
    href: "/collections/cushions-decor",
    desc: "Hand-Embroidered Raw Silk",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBcAyVJ0jGVMBnmrBTuLekK_ich2CU6qqheQEidSh-_CpKd9AwW-U1RtMtw-w9W0D3gZBKXW3K1LjlPflVZ7M-1Zr2exxEgwDfTnVwJw3u1IBl91hJnP9zAHY295dki_24ZEFvJwcmbTTyTo_yaVRcOVaRTiSRwJmH39XarT8r3gf7Oyrq1w2H0W0q7Fxn9H_rBXu5ha5fp7lk1GPQl7pYpTqp9OXMSXUTGmkl1b4H6Uz_BH5TjuWgOAg",
  },
  {
    name: "Festive Edit",
    href: "/collections/festive-edit",
    desc: "Zari Inlay & Gota Patti Diwan Sets",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcpXu5ISUZNwesOrcde-lUwHJQHjmtrTjoS5FWaLcT4GsBn0WNgpsI6FbpfN5OHJJLrXSKRARHrwY2kRBO2hjI1WPmAFG-wthTMr93lAyOsq05fd_i7fVwfXlJd5lLmK063AiwuNtbZpPvmuPbDmt6dtK-CZehmrQbtVxFgUMKr7vnkQfLujhGWaq8H5C1plBpbnAUmYNJbUrdqNG0R-c9wolquwfshkw0_CONU7knB-S2VAom15PKsg",
  },
];

export default function HomePage() {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      {/* Global Header */}
      <Header />

      <main className="flex-1 w-full">
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
                  <Link href="/collections/bedsheets-linens">
                    <Button
                      variant="secondary"
                      size="lg"
                      rightIcon={<span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
                    >
                      Explore Bed Linen
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="lg"
                    leftIcon={<span className="material-symbols-outlined text-[18px]">menu_book</span>}
                    onClick={() => setIsBulkModalOpen(true)}
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
                    <span className="material-symbols-outlined text-secondary text-[18px]">payments</span>
                    <span>Partial COD Option</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORY EXPLORATION CAROUSEL STRIP */}
        <section className="w-full bg-surface py-12 px-4 sm:px-8 lg:px-12 border-b border-outline-variant/30">
          <div className="max-w-[1360px] mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div className="space-y-1">
                <span className="font-sans text-xs uppercase tracking-widest text-secondary font-bold">
                  Curated Living
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-primary font-normal">
                  Explore by Sanctuary Space
                </h2>
              </div>
              <Link
                href="/collections"
                className="text-xs font-sans uppercase font-bold tracking-wider text-secondary hover:text-primary underline underline-offset-4"
              >
                View Complete Catalogue →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {CATEGORY_STRIP.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="group flex flex-col p-3 rounded-xl bg-surface-container-low border border-outline-variant/40 hover:border-primary/40 hover:shadow-md transition-all select-none"
                >
                  <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-surface-dim mb-3">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-serif text-base text-primary font-medium group-hover:text-secondary transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                  <p className="font-sans text-[11px] text-outline line-clamp-1 mt-0.5">
                    {cat.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION DIVIDER: Lotus Emblem & Filigree */}
        <LotusDivider label="Heirloom Collections" lineWidth="md" />

        {/* FEATURED HEIRLOOM COLLECTION PREVIEW */}
        <section className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12 py-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div className="space-y-1">
              <span className="font-sans text-xs uppercase tracking-[0.2em] text-secondary font-bold">
                Signature Handloom Editions
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-primary font-normal">
                Bedsheets, Dohars & Heritage Quilts
              </h2>
            </div>
            <Link
              href="/collections/bedsheets-linens"
              className="text-xs font-sans uppercase font-bold tracking-wider text-secondary hover:text-primary underline underline-offset-4"
            >
              Browse All Bedsheets ({MOCK_CATALOG.length}) →
            </Link>
          </div>

          {/* 3-Column Product Grid with Arch Frames */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {MOCK_CATALOG.slice(0, 6).map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                initialWishlisted={isInWishlist(prod.id)}
                onQuickAdd={(p) => addToCart(p)}
                onWishlistToggle={(p) => toggleWishlist(p)}
              />
            ))}
          </div>
        </section>

        {/* ARTISAN PROVENANCE & WEAVE METER SHOWCASE */}
        <section className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12 py-12 border-t border-outline-variant/30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <Card variant="editorial" padded={true}>
              <div className="space-y-4">
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

              {/* Partial COD & Hospitality Quick Callouts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50 flex flex-col justify-between gap-2">
                  <div className="space-y-1">
                    <span className="font-sans text-xs font-bold text-primary uppercase tracking-wider">
                      Partial COD Option
                    </span>
                    <p className="font-sans text-[11px] text-outline">
                      Pay ₹500 advance online, rest on doorstep delivery.
                    </p>
                  </div>
                  <Badge variant="terracotta" size="sm">Zero Risk</Badge>
                </div>

                <div className="p-4 rounded-xl bg-surface-container-high border border-outline-variant/50 flex flex-col justify-between gap-2">
                  <div className="space-y-1">
                    <span className="font-sans text-xs font-bold text-primary uppercase tracking-wider">
                      Bulk & Trade Pricing
                    </span>
                    <p className="font-sans text-[11px] text-outline">
                      Bespoke hospitality specs & GST invoices for 10+ units.
                    </p>
                  </div>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setIsBulkModalOpen(true)}
                  >
                    Request Quote →
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Bulk Quote Inquiry Modal */}
      <BulkQuoteModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
      />
    </div>
  );
}
