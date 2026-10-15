import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface ArchImageFrameProps {
  src: string;
  alt: string;
  variant?: "hero" | "card" | "window";
  aspectRatio?: string;
  badgeText?: string;
  badgeIcon?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  children?: React.ReactNode;
}

export const ArchImageFrame: React.FC<ArchImageFrameProps> = ({
  src,
  alt,
  variant = "card",
  aspectRatio = "aspect-[4/5]",
  badgeText,
  badgeIcon,
  className,
  containerClassName,
  priority = false,
  children,
}) => {
  if (variant === "hero") {
    return (
      <div
        className={cn(
          "relative max-w-[620px] p-3 md:p-3.5 bg-surface-container rounded-t-[280px] rounded-b-2xl shadow-2xl border border-outline-variant/40",
          containerClassName
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-t-[270px] rounded-b-xl w-full bg-surface-dim",
            aspectRatio,
            className
          )}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            priority={priority}
            className="object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent pointer-events-none" />
          {children}
        </div>

        {/* Hero Artisan Seal Badge Pin */}
        {badgeText && (
          <div className="absolute -top-3 -left-3 md:-top-5 md:-left-5 w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary-container text-surface flex flex-col items-center justify-center p-2 text-center shadow-lg border-2 border-surface-container select-none z-20">
            {badgeIcon || (
              <span className="material-symbols-outlined text-[18px] md:text-[20px]">
                filter_vintage
              </span>
            )}
            <span className="font-sans text-[7px] md:text-[8px] uppercase tracking-widest leading-tight mt-0.5 font-bold">
              {badgeText}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Card Variant
  return (
    <div
      className={cn(
        "relative w-full bg-surface-container overflow-hidden pt-1.5 px-1.5 rounded-t-2xl",
        containerClassName
      )}
    >
      <div
        className={cn(
          "w-full h-full rounded-t-[5rem] overflow-hidden relative bg-surface-dim",
          aspectRatio,
          className
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          priority={priority}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        {children}
      </div>

      {/* Floating Badge Tag */}
      {badgeText && (
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <span className="px-2.5 py-1 rounded-full bg-surface/90 backdrop-blur font-sans text-[10px] text-primary font-bold uppercase tracking-wider shadow-sm border border-outline-variant/30 flex items-center gap-1">
            {badgeIcon}
            <span>{badgeText}</span>
          </span>
        </div>
      )}
    </div>
  );
};
