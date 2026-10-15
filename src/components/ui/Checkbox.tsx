import React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  sublabel?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, sublabel, id, ...props }, ref) => {
    const checkboxId =
      id || (typeof label === "string" ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <label
        htmlFor={checkboxId}
        className={cn(
          "inline-flex items-start gap-2.5 cursor-pointer select-none text-left group",
          props.disabled && "cursor-not-allowed opacity-60",
          className
        )}
      >
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            id={checkboxId}
            ref={ref}
            type="checkbox"
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              "w-4 h-4 rounded-sm border border-outline transition-all duration-200 bg-surface",
              "peer-checked:bg-primary-container peer-checked:border-primary-container",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-primary-container/40 peer-focus-visible:ring-offset-1",
              "group-hover:border-primary-container"
            )}
          />
          <svg
            className="absolute w-2.5 h-2.5 text-surface pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-150"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        {(label || sublabel) && (
          <div className="flex flex-col">
            {label && (
              <span className="text-sm font-sans text-on-surface group-hover:text-primary-container transition-colors">
                {label}
              </span>
            )}
            {sublabel && (
              <span className="text-xs text-outline font-sans">{sublabel}</span>
            )}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
