import React from "react";
import { formatPrice, cn } from "@/lib/utils";

export interface PartialCodBadgeProps {
  minAdvanceAmount?: number;
  className?: string;
  variant?: "pill" | "banner" | "compact";
}

export const PartialCodBadge: React.FC<PartialCodBadgeProps> = ({
  minAdvanceAmount = 500,
  className,
  variant = "pill",
}) => {
  if (variant === "compact") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container text-secondary text-[10px] font-sans font-semibold uppercase tracking-wider select-none",
          className
        )}
      >
        <span className="material-symbols-outlined text-[13px]">payments</span>
        <span>Partial COD Available</span>
      </span>
    );
  }

  if (variant === "banner") {
    return (
      <div
        className={cn(
          "rounded-lg bg-surface-container-high border border-outline-variant/60 p-3 flex items-center justify-between gap-3 text-xs font-sans",
          className
        )}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-secondary/15 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-secondary text-[16px]">
              account_balance_wallet
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-primary uppercase tracking-wider text-[11px]">
              Partial COD Eligible
            </span>
            <span className="text-on-surface-variant text-[11px]">
              Pay {formatPrice(minAdvanceAmount)} advance online, balance upon doorstep delivery.
            </span>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-secondary shrink-0 bg-surface px-2 py-1 rounded border border-outline-variant/40">
          Zero Risk
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container border border-outline-variant/50 shadow-sm text-on-surface select-none",
        className
      )}
    >
      <span className="material-symbols-outlined text-secondary text-[14px]">
        payments
      </span>
      <span className="font-sans text-[11px] font-medium">
        Partial COD: Pay{" "}
        <strong className="text-secondary font-bold">
          {formatPrice(minAdvanceAmount)}
        </strong>{" "}
        now, rest on delivery
      </span>
    </div>
  );
};
