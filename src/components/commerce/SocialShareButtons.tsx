"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";

export interface SocialShareButtonsProps {
  title: string;
  url?: string;
  imageUrl?: string;
  description?: string;
  className?: string;
}

export const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({
  title,
  url,
  imageUrl,
  description,
  className = "",
}) => {
  const { showToast } = useStore();
  const [copied, setCopied] = useState(false);

  const shareUrl =
    url || (typeof window !== "undefined" ? window.location.href : "https://kusumika.com");
  const shareText = `${title} — Handcrafted slow-textiles by Kusumika (Soft like Silk, Feels like a Hug)`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);
  const encodedMedia = encodeURIComponent(imageUrl || "https://kusumika.com/og-image.jpg");

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      showToast("Atelier product link copied to clipboard.");
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const platforms = [
    {
      name: "WhatsApp",
      icon: "chat",
      href: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
      color: "hover:bg-[#25D366]/10 hover:text-[#25D366] hover:border-[#25D366]/40",
    },
    {
      name: "Pinterest",
      icon: "photo_library",
      href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedMedia}&description=${encodedText}`,
      color: "hover:bg-[#BD081C]/10 hover:text-[#BD081C] hover:border-[#BD081C]/40",
    },
    {
      name: "Facebook",
      icon: "share",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "hover:bg-[#1877F2]/10 hover:text-[#1877F2] hover:border-[#1877F2]/40",
    },
    {
      name: "X (Twitter)",
      icon: "send",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      color: "hover:bg-on-surface/10 hover:text-on-surface hover:border-on-surface/40",
    },
  ];

  return (
    <div className={`space-y-2 select-none ${className}`}>
      <div className="flex items-center justify-between text-xs font-sans">
        <span className="font-bold uppercase tracking-wider text-primary text-[11px] flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px] text-secondary">
            ios_share
          </span>
          <span>Share Textile Craft</span>
        </span>
        <span className="text-[10px] text-outline italic">
          Inspire someone's sanctuary
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {platforms.map((p) => (
          <a
            key={p.name}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            title={`Share on ${p.name}`}
            className={`px-3 py-1.5 rounded-lg border border-outline-variant/60 bg-surface text-on-surface text-xs font-sans font-medium flex items-center gap-1.5 transition-all shadow-sm ${p.color}`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {p.icon}
            </span>
            <span>{p.name}</span>
          </a>
        ))}

        {/* Copy Link Button */}
        <button
          type="button"
          onClick={handleCopyLink}
          title="Copy Link"
          className="px-3 py-1.5 rounded-lg border border-outline-variant/60 bg-surface hover:bg-surface-container text-on-surface text-xs font-sans font-medium flex items-center gap-1.5 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px]">
            {copied ? "done" : "content_copy"}
          </span>
          <span>{copied ? "Link Copied!" : "Copy Link"}</span>
        </button>
      </div>
    </div>
  );
};
