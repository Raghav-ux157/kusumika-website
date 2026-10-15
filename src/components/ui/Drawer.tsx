"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  position?: "left" | "right";
  width?: "sm" | "md" | "lg";
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  position = "right",
  width = "md",
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const widthStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  const positionStyles = {
    right: "right-0 inset-y-0",
    left: "left-0 inset-y-0",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div
        className={cn(
          "fixed flex flex-col w-full h-full bg-surface shadow-2xl border-outline-variant z-10 transition-transform duration-300",
          positionStyles[position],
          widthStyles[width],
          position === "right"
            ? "border-l animate-in slide-in-from-right"
            : "border-r animate-in slide-in-from-left"
        )}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-outline-variant/40 flex items-center justify-between bg-surface-container-low shrink-0">
          <div className="space-y-0.5">
            {title && (
              <h3 className="font-serif text-2xl text-primary font-normal leading-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="font-sans text-xs text-outline">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-outline hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container"
            aria-label="Close drawer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
};
