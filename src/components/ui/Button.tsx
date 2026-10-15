import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "gold"
    | "ghost"
    | "link";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold uppercase tracking-wider transition-all duration-300 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none";

    const variantStyles = {
      primary:
        "bg-primary-container text-surface hover:bg-secondary active:bg-primary shadow-sm hover:shadow-md",
      secondary:
        "bg-secondary text-surface hover:bg-primary-container active:bg-secondary-container shadow-sm hover:shadow-md",
      outline:
        "border border-primary-container text-primary-container bg-transparent hover:bg-surface-container active:bg-surface-container-high",
      gold:
        "bg-brand-gold text-on-surface hover:bg-[#b89139] active:bg-[#a67e2a] shadow-sm",
      ghost:
        "bg-transparent text-on-surface hover:bg-surface-container active:bg-surface-container-high",
      link:
        "bg-transparent text-on-surface underline underline-offset-4 decoration-outline-variant hover:text-secondary hover:decoration-secondary p-0 tracking-normal normal-case",
    };

    const sizeStyles = {
      sm: "text-[11px] py-1.5 px-3.5 gap-1.5 leading-none",
      md: "text-xs py-2.5 px-6 gap-2 leading-tight",
      lg: "text-sm py-3.5 px-8 gap-2.5 leading-snug",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          variant !== "link" && sizeStyles[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
