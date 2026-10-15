import React from "react";
import { cn } from "@/lib/utils";

export interface WeaveMeterProps {
  threadCount?: number;
  className?: string;
  showLabels?: boolean;
}

export const WeaveMeter: React.FC<WeaveMeterProps> = ({
  threadCount = 400,
  className,
  showLabels = true,
}) => {
  // Map 200 TC (0%) to 800 TC (100%)
  const percentage = Math.min(
    100,
    Math.max(10, ((threadCount - 200) / (800 - 200)) * 100)
  );

  const getTierName = (tc: number) => {
    if (tc < 300) return "Crisp Daily Linen";
    if (tc <= 400) return "Silky Smooth Heirloom";
    if (tc <= 600) return "Royal Sateen Weave";
    return "Palatial Ultra-Dense Weave";
  };

  return (
    <div className={cn("flex flex-col gap-2 select-none", className)}>
      {showLabels && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-sans text-xs uppercase tracking-wider text-primary font-bold">
              Weave Density
            </span>
            <span className="text-[11px] font-sans font-bold text-secondary">
              • {threadCount} TC
            </span>
          </div>
          <span className="font-sans text-[11px] text-brand-gold font-semibold tracking-wide">
            {getTierName(threadCount)}
          </span>
        </div>
      )}

      {/* Meter Bar */}
      <div className="bg-surface p-2.5 rounded-lg border border-outline-variant/40 flex flex-col gap-1.5 shadow-sm">
        <div className="flex justify-between text-[10px] font-sans uppercase tracking-wider text-outline">
          <span>200 TC (Airy)</span>
          <span>400 TC (Optimal)</span>
          <span>800 TC (Ultra)</span>
        </div>
        <div className="w-full h-2 bg-surface-container rounded-full relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-secondary via-[#c9a24d] to-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
