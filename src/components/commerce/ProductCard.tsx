"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { PriceDisplay } from "./PriceDisplay";
import { RatingStars } from "./RatingStars";
import { PartialCodBadge } from "./PartialCodBadge";
import { cn } from "@/lib/utils";

export interface ProductCardProps {
  product: Product;
  onQuickAdd?: (product: Product) => void;
  onWishlistToggle?: (product: Product, isWishlisted: boolean) => void;
  initialWishlisted?: boolean;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickAdd,
  onWishlistToggle,
  initialWishlisted = false,
  className,
}) => {
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);
  const [selectedSwatchIndex, setSelectedSwatchIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = !isWishlisted;
    setIsWishlisted(nextState);
    onWishlistToggle?.(product, nextState);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickAdd?.(product);
  };

  const currentImage =
    product.images[selectedSwatchIndex] || product.images[0] || "/placeholder.jpg";

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between select-none",
        className
      )}
    >
      {/* Top Media Container with Architectural Arch Image Frame */}
      <div className="relative w-full aspect-[4/5] bg-surface-container overflow-hidden pt-2 px-2">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <div className="w-full h-full rounded-t-[5rem] overflow-hidden relative bg-surface-dim">
            <Image
              src={currentImage}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Subtle Gradient Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-on-surface/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Link>

        {/* Craft Origin / Material Badge */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <span className="px-2.5 py-1 rounded-full bg-surface/90 backdrop-blur font-sans text-[10px] text-primary font-bold uppercase tracking-wider shadow-sm border border-outline-variant/30">
            {product.origin || "Handcrafted in Rajasthan"}
          </span>
        </div>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          aria-label={`Save ${product.title} to wishlist`}
          onClick={handleWishlist}
          className={cn(
            "absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-surface/90 backdrop-blur flex items-center justify-center transition-all shadow-sm focus:outline-none",
            isWishlisted
              ? "text-secondary bg-surface scale-110"
              : "text-primary hover:bg-primary hover:text-surface"
          )}
        >
          <span
            className="material-symbols-outlined text-[18px]"
            style={{
              fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            favorite
          </span>
        </button>

        {/* Quick Add Overlay on Hover */}
        <div className="absolute bottom-4 inset-x-4 z-10 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <button
            type="button"
            onClick={handleQuickAdd}
            className="w-full py-2.5 px-4 bg-primary text-surface font-sans text-xs uppercase font-bold tracking-wider rounded-lg shadow-md hover:bg-secondary active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">
              shopping_bag
            </span>
            <span>Quick Add • ₹{product.price.toLocaleString("en-IN")}</span>
          </button>
        </div>
      </div>

      {/* Product Metadata Body */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3 bg-surface-container-low">
        <div className="flex flex-col gap-1.5">
          {/* Eyebrow & Star Rating */}
          <div className="flex items-center justify-between gap-2">
            <span className="font-sans text-[11px] uppercase tracking-widest text-secondary font-bold truncate">
              {product.threadCount
                ? `${product.threadCount} TC • ${product.material}`
                : product.material}
            </span>
            <RatingStars
              rating={product.rating}
              reviewCount={product.reviewCount}
              size="sm"
            />
          </div>

          {/* Title */}
          <Link href={`/products/${product.slug}`} className="group-hover:text-secondary transition-colors">
            <h3 className="font-serif text-lg md:text-xl text-primary leading-snug line-clamp-1">
              {product.title}
            </h3>
          </Link>

          {/* Subtitle / Included Items */}
          <p className="font-sans text-xs text-on-surface-variant line-clamp-1">
            {product.subtitle || `${product.craftTechnique} • Pure Herbal Washes`}
          </p>
        </div>

        {/* Partial COD Chip */}
        {product.partialCodEligible && (
          <div className="pt-0.5">
            <PartialCodBadge
              minAdvanceAmount={product.minAdvanceAmount || 500}
              variant="compact"
            />
          </div>
        )}

        {/* Swatches & Pricing Row */}
        <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between gap-2">
          {/* Color Swatch Dots */}
          <div className="flex items-center gap-1.5">
            {product.swatches.map((swatch, idx) => (
              <button
                key={swatch.name}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedSwatchIndex(idx);
                }}
                className={cn(
                  "w-4 h-4 rounded-full transition-all duration-150 focus:outline-none",
                  selectedSwatchIndex === idx
                    ? "ring-2 ring-primary scale-110"
                    : "hover:ring-1 hover:ring-outline"
                )}
                style={{ backgroundColor: swatch.hex }}
                title={swatch.name}
              />
            ))}
            {product.swatches.length > 3 && (
              <span className="font-sans text-[10px] text-outline ml-0.5">
                +{product.swatches.length - 3} hues
              </span>
            )}
          </div>

          {/* Price */}
          <PriceDisplay
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            size="sm"
          />
        </div>
      </div>
    </article>
  );
};
