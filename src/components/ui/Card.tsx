import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "editorial" | "flat";
  padded?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className,
  variant = "default",
  padded = true,
  children,
  ...props
}) => {
  const baseStyles = "rounded-xl transition-all duration-300 overflow-hidden";

  const variantStyles = {
    default:
      "bg-surface-container-low border border-outline-variant/40 shadow-sm hover:shadow-md",
    elevated:
      "bg-surface-container-lowest border border-outline-variant/50 shadow-terracotta hover:shadow-elevation-2",
    editorial:
      "bg-surface border border-outline-variant/60 shadow-sm relative miniature-frame",
    flat:
      "bg-surface-container border border-outline-variant/40",
  };

  return (
    <div
      className={cn(
        baseStyles,
        variantStyles[variant],
        padded && "p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const EditorialCard: React.FC<
  React.HTMLAttributes<HTMLDivElement> & { padded?: boolean }
> = ({ className, padded = true, children, ...props }) => {
  return (
    <div
      className={cn(
        "relative rounded-xl bg-surface-container p-2 md:p-3 border border-outline-variant/50 shadow-sm",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "rounded-lg bg-surface border border-outline-variant/60 relative",
          padded && "p-5 md:p-7"
        )}
      >
        {children}
      </div>
    </div>
  );
};

Card.displayName = "Card";
EditorialCard.displayName = "EditorialCard";
