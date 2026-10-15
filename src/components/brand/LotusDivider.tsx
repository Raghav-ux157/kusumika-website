import React from "react";
import { cn } from "@/lib/utils";

export interface LotusDividerProps {
  label?: string | null;
  className?: string;
  lineWidth?: "sm" | "md" | "lg" | "full";
  color?: "secondary" | "primary" | "tertiary" | "gold";
}

export const LotusDivider: React.FC<LotusDividerProps> = ({
  label = "Kusumika",
  className,
  lineWidth = "md",
  color = "secondary",
}) => {
  const lineStyles = {
    sm: "w-12 sm:w-20",
    md: "w-24 sm:w-48",
    lg: "w-36 sm:w-72",
    full: "flex-1",
  };

  const colorStyles = {
    secondary: "text-secondary",
    primary: "text-primary-container",
    tertiary: "text-tertiary",
    gold: "text-brand-gold",
  };

  return (
    <div
      className={cn(
        "w-full py-6 flex items-center justify-center gap-4 select-none",
        className
      )}
    >
      {/* Left Filigree Line */}
      <div
        className={cn(
          "h-[1px] bg-outline-variant/60 relative",
          lineStyles[lineWidth]
        )}
      >
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rotate-45 border border-outline-variant/70 bg-surface" />
      </div>

      {/* Lotus Emblem with optional label */}
      <div
        className={cn(
          "flex items-center gap-2 transition-transform duration-300 hover:scale-105",
          colorStyles[color]
        )}
      >
        {/* Stylized Lotus SVG */}
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 3C11.5 6 9 8.5 6 10C9 11.5 11 14 12 18C13 14 15 11.5 18 10C15 8.5 12.5 6 12 3Z" />
          <path
            d="M12 18C8 16.5 5 18.5 3 21C7 20 10 19 12 18Z"
            opacity="0.8"
          />
          <path
            d="M12 18C16 16.5 19 18.5 21 21C17 20 14 19 12 18Z"
            opacity="0.8"
          />
        </svg>
        {label && (
          <span className="font-serif text-lg italic tracking-wider">
            {label}
          </span>
        )}
      </div>

      {/* Right Filigree Line */}
      <div
        className={cn(
          "h-[1px] bg-outline-variant/60 relative",
          lineStyles[lineWidth]
        )}
      >
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rotate-45 border border-outline-variant/70 bg-surface" />
      </div>
    </div>
  );
};
