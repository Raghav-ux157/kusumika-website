"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import { Header, Footer } from "@/components/layout";
import {
  ArchImageFrame,
  LotusDivider,
  ArtisanProvenanceStamp,
  WeaveMeter,
} from "@/components/brand";
import {
  PriceDisplay,
  RatingStars,
  PartialCodBadge,
  ProductCard,
  BulkQuoteModal,
} from "@/components/commerce";
import { Button, Input, Badge } from "@/components/ui";
import { MOCK_CATALOG, MOCK_REVIEWS } from "@/lib/mockCatalog";
import { useStore } from "@/context/StoreContext";
import { formatPrice, cn } from "@/lib/utils";

const SIZES = [
  { id: "Double / Queen (84x100\")", label: "Double / Queen (84x100\")", dims: "90 x 108 inches" },
  { id: "King Set (108x108\")", label: "King Palatial (108x108\")", dims: "108 x 108 inches" },
  { id: "Single / Twin (60x90\")", label: "Single / Twin (60x90\")", dims: "60 x 90 inches" },
  { id: "Fitted Elastic Corner", label: "Fitted Elastic Corner", dims: "78 x 72 + 12 in drop" },
];

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();
  const { addToCart, toggleWishlist, isInWishlist, checkPincode, verifiedPincode } = useStore();

  const product = MOCK_CATALOG.find((p) => p.slug === params.slug);
  if (!product) {
    notFound();
  }

  // State
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(SIZES[0].label);
  const [selectedSwatch, setSelectedSwatch] = useState(product.swatches[0]);
  const [quantity, setQuantity] = useState(1);
  const [pincodeInput, setPincodeInput] = useState(verifiedPincode?.pincode || "302001");
  const [pincodeMessage, setPincodeMessage] = useState<string | null>(
    verifiedPincode
      ? `Delivery to ${verifiedPincode.pincode} (${verifiedPincode.city}) in ${verifiedPincode.days}–${verifiedPincode.days + 1} business days • Partial COD Eligible.`
      : null
  );
  const [isPincodeValid, setIsPincodeValid] = useState(true);
  const [activeAccordion, setActiveAccordion] = useState<string | null>("dimensions");
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const isWishlisted = isInWishlist(product.id);
  const reviews = MOCK_REVIEWS[product.slug] || [
    {
      id: "rev-gen-1",
      author: "Radhika Mehra",
      rating: 5,
      date: "12 Oct 2026",
      title: "Feels like heaven in Mumbai's humid weather!",
      comment:
        "The single-ply weave is genuinely cool to the touch and breathable. The botanical block motifs haven't bled even after 3 cold gentle washes. The Partial COD option gave me total peace of mind.",
      verified: true,
      location: "Mumbai, Maharashtra",
    },
    {
      id: "rev-gen-2",
      author: "Aditya Singhania",
      rating: 5,
      date: "04 Oct 2026",
      title: "Exceptional Rajasthani craftsmanship",
      comment:
        "Purchased for our boutique heritage homestay. Guests constantly inquire about the fabric softness and the Bagru block motifs. Elegant packaging with the intact wax seal.",
      verified: true,
      location: "Udaipur, Rajasthan",
    },
  ];

  // Calculations for Partial COD
  const advanceAmount = product.minAdvanceAmount || 500;
  const balanceDue = product.price * quantity - advanceAmount;

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const result = checkPincode(pincodeInput);
    setIsPincodeValid(result.valid);
    setPincodeMessage(result.message);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedSwatch, quantity);
    router.push("/checkout");
  };

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  const relatedProducts = MOCK_CATALOG.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Header />

      <main className="flex-1 w-full">
        {/* BREADCRUMBS BAR */}
        <div className="bg-surface-container-low border-b border-outline-variant/30 py-3 px-4 sm:px-8 lg:px-12 select-none">
          <div className="max-w-[1360px] mx-auto flex items-center gap-2 text-xs font-sans text-outline overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/collections" className="hover:text-primary transition-colors">
              Collections
            </Link>
            <span>/</span>
            <Link
              href={`/collections/${product.category}`}
              className="hover:text-primary transition-colors capitalize"
            >
              {product.category.replace("-", " & ")}
            </Link>
            <span>/</span>
            <span className="text-on-surface font-medium truncate max-w-xs">
              {product.title}
            </span>
          </div>
        </div>

        {/* MAIN PDP GRID */}
        <section className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12 py-10 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* LEFT COLUMN: Architectural Jharokha Arch Gallery (6 cols) */}
            <div className="lg:col-span-6 flex flex-col gap-4 sticky top-28">
              {/* Main Jharokha Arched Image Frame */}
              <div className="relative p-2.5 sm:p-3.5 bg-surface-container rounded-t-[180px] sm:rounded-t-[240px] rounded-b-2xl shadow-xl border border-outline-variant/40">
                <div className="relative overflow-hidden rounded-t-[170px] sm:rounded-t-[230px] rounded-b-xl aspect-[4/5] w-full bg-surface-dim">
                  <Image
                    src={product.images[selectedImageIndex] || product.images[0]}
                    alt={product.title}
                    fill
                    priority={true}
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Artisan Seal Badge Pin */}
                <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-container text-surface flex flex-col items-center justify-center p-2 text-center shadow-lg border-2 border-surface-container select-none z-20">
                  <span className="material-symbols-outlined text-[18px] sm:text-[22px]">
                    filter_vintage
                  </span>
                  <span className="font-sans text-[7px] sm:text-[8px] uppercase tracking-widest leading-tight mt-0.5 font-bold">
                    Bagru Loom
                  </span>
                </div>
              </div>

              {/* Thumbnails Strip */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={cn(
                        "relative w-20 h-24 rounded-lg overflow-hidden border-2 transition-all shrink-0 bg-surface-dim",
                        selectedImageIndex === idx
                          ? "border-primary shadow-md scale-105"
                          : "border-outline-variant/40 opacity-70 hover:opacity-100"
                      )}
                    >
                      <Image
                        src={img}
                        alt={`${product.title} thumbnail ${idx + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Product Specifications & Order Matrix (6 cols) */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              {/* Category Eyebrow & Badges */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="font-sans text-xs uppercase tracking-[0.2em] text-secondary font-bold">
                  {product.threadCount ? `${product.threadCount} TC • ${product.material}` : product.material}
                </span>
                <div className="flex items-center gap-2">
                  {product.badges?.map((badge) => (
                    <Badge key={badge} variant="terracotta" size="sm">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1.5">
                <h1 className="font-serif text-3xl sm:text-4xl text-primary font-normal leading-tight">
                  {product.title}
                </h1>
                <p className="font-sans text-sm text-on-surface-variant">
                  {product.subtitle}
                </p>
              </div>

              {/* Reviews & Star Rating */}
              <div className="flex items-center gap-3">
                <RatingStars
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                  size="md"
                />
                <span className="text-outline text-xs">•</span>
                <a
                  href="#reviews"
                  className="font-sans text-xs text-secondary font-semibold underline underline-offset-4 hover:text-primary"
                >
                  Read Verified Patron Reviews
                </a>
              </div>

              {/* Price & Tax Note */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <PriceDisplay
                    price={product.price}
                    compareAtPrice={product.compareAtPrice}
                    size="lg"
                  />
                  <span className="font-sans text-[11px] text-outline">
                    Inclusive of all taxes • Complimentary Pan-India delivery
                  </span>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded bg-surface text-secondary font-sans text-xs font-bold uppercase tracking-wider border border-outline-variant/40">
                    In Stock (Loom Ready)
                  </span>
                </div>
              </div>

              {/* PARTIAL COD ADVANCE CALLOUT (SIGNATURE BRAND HIGHLIGHT) */}
              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/60 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[22px]">
                      payments
                    </span>
                    <span className="font-sans text-xs uppercase tracking-wider text-primary font-bold">
                      Partial Cash on Delivery Available
                    </span>
                  </div>
                  <Badge variant="terracotta" size="sm">Zero Risk</Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1 text-xs font-sans">
                  <div className="p-2.5 rounded bg-surface border border-outline-variant/30 flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-outline">
                      Advance Payable Online
                    </span>
                    <span className="font-serif text-lg text-secondary font-bold">
                      {formatPrice(advanceAmount)}
                    </span>
                    <span className="text-[10px] text-outline">Locks loom allocation</span>
                  </div>
                  <div className="p-2.5 rounded bg-surface border border-outline-variant/30 flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-outline">
                      Balance on Doorstep Delivery
                    </span>
                    <span className="font-serif text-lg text-primary font-bold">
                      {formatPrice(balanceDue)}
                    </span>
                    <span className="text-[10px] text-outline">Pay courier via Cash/UPI</span>
                  </div>
                </div>

                <p className="font-sans text-[11px] text-on-surface-variant flex items-center gap-1.5 pt-1">
                  <span className="material-symbols-outlined text-tertiary text-[16px]">
                    verified_user
                  </span>
                  <span>
                    Inspect intact wax seal & feel the weave before paying courier balance.
                  </span>
                </p>
              </div>

              {/* SELECTOR 1: Bed Sizes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-sans">
                  <span className="uppercase tracking-wider text-primary font-bold">
                    Select Bed Linen Size
                  </span>
                  <span className="text-secondary font-medium">Size Guide</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SIZES.map((size) => (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setSelectedSize(size.label)}
                      className={cn(
                        "p-2.5 rounded-lg border text-xs font-sans transition-all text-center flex flex-col items-center justify-center gap-0.5",
                        selectedSize === size.label
                          ? "border-primary bg-surface-container font-bold text-primary shadow-sm"
                          : "border-outline-variant/50 bg-surface hover:border-outline text-on-surface-variant"
                      )}
                    >
                      <span className="line-clamp-1">{size.label}</span>
                      <span className="text-[10px] text-outline font-normal">
                        {size.dims}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* SELECTOR 2: Organic Pigment Swatches */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-sans">
                  <span className="uppercase tracking-wider text-primary font-bold">
                    Organic Pigment Tone:{" "}
                    <strong className="text-secondary font-semibold">
                      {selectedSwatch.name}
                    </strong>
                  </span>
                  <span className="text-outline text-[11px]">Vegetable dyed</span>
                </div>
                <div className="flex items-center gap-3">
                  {product.swatches.map((swatch) => (
                    <button
                      key={swatch.name}
                      type="button"
                      onClick={() => setSelectedSwatch(swatch)}
                      className={cn(
                        "flex items-center gap-2 p-1.5 pr-3 rounded-full border transition-all text-xs font-sans",
                        selectedSwatch.name === swatch.name
                          ? "border-primary bg-surface-container font-bold text-primary"
                          : "border-outline-variant/40 bg-surface hover:border-outline"
                      )}
                    >
                      <span
                        className="w-5 h-5 rounded-full shadow-inner inline-block"
                        style={{ backgroundColor: swatch.hex }}
                      />
                      <span>{swatch.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* QUANTITY & ACTIONS */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                {/* Quantity input */}
                <div className="flex items-center border border-outline-variant rounded-lg bg-surface px-2 py-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 text-on-surface hover:text-primary hover:bg-surface-container rounded flex items-center justify-center font-bold"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-sans text-sm font-bold">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 text-on-surface hover:text-primary hover:bg-surface-container rounded flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Primary Add to Cart */}
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth={true}
                  leftIcon={
                    <span className="material-symbols-outlined text-[18px]">
                      shopping_bag
                    </span>
                  }
                  onClick={() => addToCart(product, selectedSize, selectedSwatch, quantity)}
                >
                  Add to Sanctuary Cart • {formatPrice(product.price * quantity)}
                </Button>

                {/* Wishlist toggle */}
                <button
                  type="button"
                  aria-label="Wishlist toggle"
                  onClick={() => toggleWishlist(product)}
                  className={cn(
                    "p-3.5 rounded-lg border border-outline-variant/60 flex items-center justify-center transition-colors shadow-sm shrink-0",
                    isWishlisted
                      ? "text-secondary bg-surface-container"
                      : "text-outline hover:text-primary bg-surface"
                  )}
                >
                  <span
                    className="material-symbols-outlined text-[22px]"
                    style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    favorite
                  </span>
                </button>
              </div>

              {/* Direct Partial COD Buy Now Button */}
              <Button
                variant="secondary"
                size="md"
                fullWidth={true}
                onClick={handleBuyNow}
                leftIcon={
                  <span className="material-symbols-outlined text-[18px]">
                    payments
                  </span>
                }
              >
                Buy Now with Partial COD (Pay {formatPrice(advanceAmount)} Online)
              </Button>

              {/* B2B / Hospitality Quote Button */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-lg bg-surface-container-high border border-outline-variant/60 text-primary hover:bg-surface-variant font-sans text-xs uppercase font-bold tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px] text-tertiary">
                    domain
                  </span>
                  <span>Request Bulk / Hospitality Quote (10+ Units)</span>
                </button>
              </div>

              {/* PINCODE DELIVERY CHECKER */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-2">
                <span className="text-xs font-sans font-bold uppercase tracking-wider text-primary">
                  Pan-India Delivery & COD Check
                </span>
                <form onSubmit={handlePincodeCheck} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit Indian Pincode"
                    value={pincodeInput}
                    onChange={(e) => setPincodeInput(e.target.value)}
                    className="w-full rounded bg-surface border border-outline-variant px-3 py-2 text-xs font-sans text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container"
                  />
                  <Button type="submit" variant="outline" size="sm" className="shrink-0">
                    Verify
                  </Button>
                </form>
                {pincodeMessage && (
                  <p
                    className={cn(
                      "text-xs font-sans flex items-center gap-1 mt-1",
                      isPincodeValid ? "text-tertiary font-medium" : "text-error"
                    )}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isPincodeValid ? "check_circle" : "error"}
                    </span>
                    <span>{pincodeMessage}</span>
                  </p>
                )}
              </div>

              {/* TACTILE WEAVE METER & PROVENANCE STAMP */}
              <div className="space-y-4 pt-2 border-t border-outline-variant/30">
                <WeaveMeter threadCount={product.threadCount || 400} />
                <ArtisanProvenanceStamp
                  village={product.origin}
                  craft={product.craftTechnique}
                  variant="horizontal"
                />
              </div>

              {/* EXPANDABLE ACCORDIONS */}
              <div className="divide-y divide-outline-variant/40 border-t border-b border-outline-variant/40 pt-2 font-sans">
                {/* Accordion 1: Dimensions */}
                <div className="py-3.5">
                  <button
                    type="button"
                    onClick={() => toggleAccordion("dimensions")}
                    className="w-full flex items-center justify-between text-left text-sm font-semibold text-primary"
                  >
                    <span>Dimensions & Set Contents</span>
                    <span className="font-serif text-lg leading-none">
                      {activeAccordion === "dimensions" ? "−" : "+"}
                    </span>
                  </button>
                  {activeAccordion === "dimensions" && (
                    <div className="pt-2.5 text-xs text-on-surface-variant space-y-1.5 leading-relaxed">
                      <p>
                        <strong>Package Includes:</strong> 1 Bed Sheet ({product.dimensions}) and 2 King Pillowcases (18 x 28 inches with a 2-inch flanged architectural hem).
                      </p>
                      <p>
                        Generously cut to tuck securely under deep modern 8 to 12-inch mattresses without slipping.
                      </p>
                    </div>
                  )}
                </div>

                {/* Accordion 2: Artisan Heritage */}
                <div className="py-3.5">
                  <button
                    type="button"
                    onClick={() => toggleAccordion("heritage")}
                    className="w-full flex items-center justify-between text-left text-sm font-semibold text-primary"
                  >
                    <span>Loom & Botanical Dye Heritage</span>
                    <span className="font-serif text-lg leading-none">
                      {activeAccordion === "heritage" ? "−" : "+"}
                    </span>
                  </button>
                  {activeAccordion === "heritage" && (
                    <div className="pt-2.5 text-xs text-on-surface-variant space-y-1.5 leading-relaxed">
                      <p>
                        Hand-printed in Bagru and Sanganer, Rajasthan. Seasoned master artisans carve wooden blocks out of teakwood, then hand-stamp natural indigo, madder, and turmeric mordants onto unbleached cotton.
                      </p>
                      <p>
                        Subtle organic variations in motif alignment reflect authentic human artisanal touch, ensuring no two bedsheets are identical.
                      </p>
                    </div>
                  )}
                </div>

                {/* Accordion 3: Care Instructions */}
                <div className="py-3.5">
                  <button
                    type="button"
                    onClick={() => toggleAccordion("care")}
                    className="w-full flex items-center justify-between text-left text-sm font-semibold text-primary"
                  >
                    <span>Fabric & Wash Care</span>
                    <span className="font-serif text-lg leading-none">
                      {activeAccordion === "care" ? "−" : "+"}
                    </span>
                  </button>
                  {activeAccordion === "care" && (
                    <ul className="pt-2.5 text-xs text-on-surface-variant space-y-1 list-disc pl-4 leading-relaxed">
                      {(product.careInstructions || [
                        "Machine wash cold separately on gentle cycle.",
                        "Use mild eco-friendly liquid detergent.",
                        "Line dry in morning shade to preserve botanical dyes.",
                        "Warm iron on reverse side.",
                      ]).map((care, i) => (
                        <li key={i}>{care}</li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Accordion 4: Shipping & Doorstep Inspection */}
                <div className="py-3.5">
                  <button
                    type="button"
                    onClick={() => toggleAccordion("shipping")}
                    className="w-full flex items-center justify-between text-left text-sm font-semibold text-primary"
                  >
                    <span>Shipping & Doorstep Inspection Guarantee</span>
                    <span className="font-serif text-lg leading-none">
                      {activeAccordion === "shipping" ? "−" : "+"}
                    </span>
                  </button>
                  {activeAccordion === "shipping" && (
                    <div className="pt-2.5 text-xs text-on-surface-variant space-y-1.5 leading-relaxed">
                      <p>
                        <strong>Doorstep Inspection:</strong> We encourage you to inspect the intact Kusumika artisan seal and verify the textile quality before paying the balance COD amount.
                      </p>
                      <p>
                        Dispatched in 24–48 hours from our Jaipur loom center via Shiprocket insured express courier.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CUSTOMER REVIEWS & RATINGS */}
        <section id="reviews" className="w-full bg-surface-container-low border-t border-outline-variant/40 py-14 px-4 sm:px-8 lg:px-12">
          <div className="max-w-[1360px] mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-outline-variant/30 pb-4">
              <div className="space-y-1">
                <span className="font-sans text-xs uppercase tracking-widest text-secondary font-bold">
                  Verified Patron Feedback
                </span>
                <h2 className="font-serif text-3xl text-primary font-normal">
                  Experiences with {product.title}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="md" />
              </div>
            </div>

            {/* Reviews Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-xl bg-surface border border-outline-variant/50 shadow-sm flex flex-col justify-between gap-4 font-sans"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <RatingStars rating={rev.rating} size="sm" showScore={false} />
                      <span className="text-[11px] text-outline">{rev.date}</span>
                    </div>
                    <h4 className="font-serif text-base text-primary font-medium leading-snug">
                      "{rev.title}"
                    </h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between text-[11px]">
                    <div className="flex flex-col">
                      <span className="font-bold text-on-surface">{rev.author}</span>
                      <span className="text-outline">{rev.location}</span>
                    </div>
                    {rev.verified && (
                      <span className="text-tertiary font-bold flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[14px]">verified</span>
                        <span>Verified</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RELATED HEIRLOOM PRODUCTS */}
        <section className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12 py-12">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="font-sans text-xs uppercase tracking-widest text-secondary font-bold">
                  Complete Your Sanctuary
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-primary font-normal">
                  Complementary Bed Linens & Dohars
                </h3>
              </div>
              <Link
                href="/collections"
                className="text-xs font-sans uppercase font-bold tracking-wider text-secondary hover:text-primary underline underline-offset-4"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard
                  key={rel.id}
                  product={rel}
                  initialWishlisted={isInWishlist(rel.id)}
                  onQuickAdd={(p) => addToCart(p)}
                  onWishlistToggle={(p) => toggleWishlist(p)}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Bulk Quote Modal */}
      <BulkQuoteModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        product={product}
      />
    </div>
  );
}
