import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "material"
    | "craft"
    | "accent"
    | "terracotta"
    | "maroon"
    | "outline";
  size?: "sm" | "md";
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "material",
  size = "md",
  icon,
  children,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center gap-1.5 font-sans uppercase font-bold tracking-wider rounded-full transition-colors select-none";

  const variantStyles = {
    material:
      "bg-surface-container text-on-surface border border-outline-variant/60 shadow-sm",
    craft:
      "bg-tertiary text-on-tertiary shadow-sm",
    accent:
      "bg-brand-gold text-on-surface shadow-sm font-semibold",
    terracotta:
      "bg-secondary text-surface shadow-sm",
    maroon:
      "bg-primary-container text-surface shadow-sm",
    outline:
      "bg-surface/80 backdrop-blur border border-outline-variant text-on-surface-variant",
  };

  const sizeStyles = {
    sm: "text-[10px] py-0.5 px-2.5 leading-none",
    md: "text-[11px] py-1 px-3 leading-tight",
  };

  return (
    <span
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

Badge.displayName = "Badge";
