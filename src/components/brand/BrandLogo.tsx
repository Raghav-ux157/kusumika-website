import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface BrandLogoProps {
  className?: string;
  showTagline?: boolean;
  variant?: "horizontal" | "vertical" | "mark-only";
  size?: "sm" | "md" | "lg";
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className,
  showTagline = true,
  variant = "horizontal",
  size = "md",
}) => {
  const sizeMap = {
    sm: {
      archH: "h-7 w-6",
      title: "text-lg",
      tagline: "text-[9px]",
    },
    md: {
      archH: "h-9 w-7",
      title: "text-2xl",
      tagline: "text-[11px]",
    },
    lg: {
      archH: "h-14 w-11",
      title: "text-3xl md:text-4xl",
      tagline: "text-xs md:text-sm",
    },
  };

  const selectedSize = sizeMap[size];

  // SVG Arch & Lotus Brand Mark
  const LogoMark = (
    <div
      className={cn(
        "relative flex items-center justify-center shrink-0 border border-primary/30 bg-surface-container rounded-t-full rounded-b-sm shadow-sm transition-transform duration-300 hover:scale-105",
        selectedSize.archH
      )}
    >
      {/* Delicate inner arch line */}
      <div className="absolute inset-[2px] border border-primary/20 rounded-t-full rounded-b-none flex items-center justify-center">
        {/* Lotus Icon */}
        <svg
          viewBox="0 0 24 24"
          className="w-3/5 h-3/5 text-primary fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2C11.5 5 9 8 6 9.5C9 11 11 14 12 18C13 14 15 11 18 9.5C15 8 12.5 5 12 2Z" />
          <path
            d="M12 18C8 17 5 19 3 22C7 21 10 20 12 18Z"
            opacity="0.8"
          />
          <path
            d="M12 18C16 17 19 19 21 22C17 21 14 20 12 18Z"
            opacity="0.8"
          />
        </svg>
      </div>
    </div>
  );

  if (variant === "mark-only") {
    return (
      <Link href="/" className={cn("inline-flex items-center", className)}>
        {LogoMark}
      </Link>
    );
  }

  if (variant === "vertical") {
    return (
      <Link
        href="/"
        className={cn(
          "inline-flex flex-col items-center text-center gap-2 group select-none",
          className
        )}
      >
        {LogoMark}
        <div className="flex flex-col items-center">
          <span
            className={cn(
              "font-serif tracking-[0.2em] uppercase text-primary font-normal group-hover:text-secondary transition-colors leading-none",
              selectedSize.title
            )}
          >
            Kusumika
          </span>
          {showTagline && (
            <span
              className={cn(
                "font-serif italic text-secondary tracking-normal mt-1",
                selectedSize.tagline
              )}
            >
              Soft like Silk, Feels like a Hug
            </span>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-3 group select-none",
        className
      )}
    >
      {LogoMark}
      <div className="flex flex-col">
        <span
          className={cn(
            "font-serif tracking-[0.16em] uppercase text-primary font-normal group-hover:text-secondary transition-colors leading-none",
            selectedSize.title
          )}
        >
          Kusumika
        </span>
        {showTagline && (
          <span
            className={cn(
              "font-serif italic text-secondary tracking-normal mt-0.5",
              selectedSize.tagline
            )}
          >
            Soft like Silk, Feels like a Hug
          </span>
        )}
      </div>
    </Link>
  );
};
