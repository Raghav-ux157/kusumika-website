import React from "react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: SelectOption[];
  helperText?: string;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      options,
      helperText,
      error,
      id,
      children,
      ...props
    },
    ref
  ) => {
    const selectId =
      id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="font-sans text-xs uppercase tracking-wider font-semibold text-on-surface"
          >
            {label}
            {props.required && <span className="text-secondary ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center w-full">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              "w-full rounded bg-surface border border-outline-variant px-3.5 py-2.5 pr-10 text-sm font-sans text-on-surface appearance-none transition-colors duration-200 cursor-pointer",
              "focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container",
              "disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-surface-dim",
              error && "border-error focus:border-error focus:ring-error text-error",
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <div className="absolute right-3.5 pointer-events-none text-outline flex items-center">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {error && (
          <p className="text-xs text-error font-sans flex items-center gap-1 mt-0.5">
            <span>•</span>
            <span>{error}</span>
          </p>
        )}
        {!error && helperText && (
          <p className="text-xs text-outline font-sans mt-0.5">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
