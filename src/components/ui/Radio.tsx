import React from "react";
import { cn } from "@/lib/utils";

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  sublabel?: string;
  badge?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, sublabel, badge, id, ...props }, ref) => {
    const radioId =
      id || (typeof label === "string" ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <label
        htmlFor={radioId}
        className={cn(
          "inline-flex items-start gap-3 cursor-pointer select-none text-left group",
          props.disabled && "cursor-not-allowed opacity-60",
          className
        )}
      >
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            id={radioId}
            ref={ref}
            type="radio"
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              "w-4 h-4 rounded-full border border-outline transition-all duration-200 bg-surface",
              "peer-checked:border-primary-container",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-primary-container/40 peer-focus-visible:ring-offset-1",
              "group-hover:border-primary-container"
            )}
          />
          <div className="absolute w-2 h-2 rounded-full bg-primary-container pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-150" />
        </div>
        {(label || sublabel) && (
          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-2">
              {label && (
                <span className="text-sm font-sans font-medium text-on-surface group-hover:text-primary-container transition-colors">
                  {label}
                </span>
              )}
              {badge && (
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-surface-container text-secondary">
                  {badge}
                </span>
              )}
            </div>
            {sublabel && (
              <span className="text-xs text-outline font-sans mt-0.5">{sublabel}</span>
            )}
          </div>
        )}
      </label>
    );
  }
);

Radio.displayName = "Radio";
