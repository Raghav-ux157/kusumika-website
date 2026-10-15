import React from "react";
import { cn } from "@/lib/utils";

export interface RatingStarsProps {
  rating: number;
  maxStars?: number;
  reviewCount?: number;
  size?: "sm" | "md";
  className?: string;
  showScore?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxStars = 5,
  reviewCount,
  size = "sm",
  className,
  showScore = true,
}) => {
  const iconSize = size === "sm" ? "text-[15px]" : "text-[18px]";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 select-none text-brand-gold",
        className
      )}
    >
      <div className="flex items-center">
        {Array.from({ length: maxStars }).map((_, i) => {
          const isFilled = i < Math.floor(rating);
          const isHalf = !isFilled && i < rating;

          return (
            <span
              key={i}
              className={cn("material-symbols-outlined leading-none", iconSize)}
              style={{
                fontVariationSettings: isFilled ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              {isFilled ? "star" : isHalf ? "star_half" : "star"}
            </span>
          );
        })}
      </div>

      {showScore && (
        <span className="font-sans text-xs font-bold text-on-surface ml-0.5">
          {rating.toFixed(1)}
        </span>
      )}

      {reviewCount !== undefined && (
        <span className="font-sans text-[11px] text-outline font-normal">
          ({reviewCount})
        </span>
      )}
    </div>
  );
};
