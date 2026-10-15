import React from "react";
import { cn } from "@/lib/utils";

export interface ArtisanProvenanceStampProps {
  village?: string;
  craft?: string;
  sealText?: string;
  variant?: "horizontal" | "badge" | "circular";
  className?: string;
}

export const ArtisanProvenanceStamp: React.FC<ArtisanProvenanceStampProps> = ({
  village = "Sanganer & Bagru",
  craft = "Hand-Carved Botanical Block Print",
  sealText = "Direct artisan provenance seal guaranteed.",
  variant = "horizontal",
  className,
}) => {
  if (variant === "circular") {
    return (
      <div
        className={cn(
          "w-24 h-24 rounded-full border-2 border-dashed border-primary/40 bg-surface-container flex flex-col items-center justify-center p-2 text-center select-none shadow-sm group hover:border-primary transition-colors",
          className
        )}
      >
        <span className="material-symbols-outlined text-secondary text-[20px]">
          filter_vintage
        </span>
        <span className="font-sans text-[8px] font-bold uppercase tracking-wider text-primary mt-0.5 leading-tight">
          {village}
        </span>
        <span className="font-sans text-[7px] text-outline uppercase tracking-widest mt-0.5">
          Artisan Seal
        </span>
      </div>
    );
  }

  if (variant === "badge") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant/60 shadow-sm",
          className
        )}
      >
        <div className="w-5 h-5 rounded-full bg-secondary/15 flex items-center justify-center">
          <span className="material-symbols-outlined text-secondary text-[14px]">
            verified
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-sans">
          <span className="font-bold uppercase tracking-wider text-primary">
            {village}
          </span>
          <span className="text-outline">•</span>
          <span className="text-on-surface-variant text-[11px]">{craft}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-surface p-4 rounded-xl border border-outline-variant/50 flex items-center gap-3.5 shadow-sm",
        className
      )}
    >
      <div className="w-11 h-11 rounded-full bg-surface-container flex items-center justify-center shrink-0 border border-outline-variant/40">
        <span className="material-symbols-outlined text-secondary text-[22px]">
          filter_vintage
        </span>
      </div>
      <div className="flex flex-col">
        <span className="font-sans text-xs text-primary font-bold uppercase tracking-wider">
          {village}
        </span>
        <span className="font-sans text-[11px] text-on-surface-variant leading-tight mt-0.5">
          {sealText}
        </span>
      </div>
    </div>
  );
};
