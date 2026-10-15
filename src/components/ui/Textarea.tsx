import React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, helperText, error, id, ...props }, ref) => {
    const textareaId =
      id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={textareaId}
            className="font-sans text-xs uppercase tracking-wider font-semibold text-on-surface"
          >
            {label}
            {props.required && <span className="text-secondary ml-1">*</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={props.rows || 4}
          className={cn(
            "w-full rounded bg-surface border border-outline-variant px-3.5 py-2.5 text-sm font-sans text-on-surface placeholder:text-outline/70 transition-colors duration-200 resize-y",
            "focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container",
            "disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-surface-dim",
            error && "border-error focus:border-error focus:ring-error text-error",
            className
          )}
          {...props}
        />
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

Textarea.displayName = "Textarea";
