import React from "react";
import { formatPrice, cn } from "@/lib/utils";

export interface PriceDisplayProps {
  price: number;
  compareAtPrice?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  compareAtPrice,
  size = "md",
  className,
}) => {
  const discountPercent =
    compareAtPrice && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : null;

  const sizeStyles = {
    sm: {
      price: "text-base font-bold",
      compare: "text-xs",
      discount: "text-[10px]",
    },
    md: {
      price: "text-lg md:text-xl font-bold",
      compare: "text-xs md:text-sm",
      discount: "text-[11px]",
    },
    lg: {
      price: "text-2xl md:text-3xl font-bold",
      compare: "text-sm md:text-base",
      discount: "text-xs",
    },
  };

  const selectedSize = sizeStyles[size];

  return (
    <div
      className={cn(
        "inline-flex items-baseline gap-2 flex-wrap select-none",
        className
      )}
    >
      <span
        className={cn(
          "font-serif text-on-surface leading-none",
          selectedSize.price
        )}
      >
        {formatPrice(price)}
      </span>

      {compareAtPrice && compareAtPrice > price && (
        <span
          className={cn(
            "font-sans text-outline line-through leading-none",
            selectedSize.compare
          )}
        >
          {formatPrice(compareAtPrice)}
        </span>
      )}

      {discountPercent && (
        <span
          className={cn(
            "font-sans font-semibold text-secondary uppercase tracking-wider leading-none",
            selectedSize.discount
          )}
        >
          {discountPercent}% off
        </span>
      )}
    </div>
  );
};
