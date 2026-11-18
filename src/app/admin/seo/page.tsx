"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAdmin } from "@/context/AdminContext";
import { PageSeoConfig, SeoSiteSettings, SeoAuditIssue } from "@/types/seo";
import {
  DEFAULT_PAGE_SEO_CONFIGS,
  DEFAULT_SEO_SITE_SETTINGS,
  INITIAL_AUDIT_ISSUES,
  AI_META_TEMPLATES,
} from "@/lib/seo/defaultSeoData";
import { cn } from "@/lib/utils";

type ActiveTab = "editor" | "serp" | "audit" | "sitemap" | "schema";
type SerpDevice = "mobile" | "desktop";
type SocialPlatform = "google" | "whatsapp" | "facebook" | "twitter";

export default function AdminSeoPage() {
  const { showToast } = useAdmin();

  // Settings & Pages state
  const [pages, setPages] = useState<PageSeoConfig[]>(DEFAULT_PAGE_SEO_CONFIGS);
  const [siteSettings, setSiteSettings] = useState<SeoSiteSettings>(DEFAULT_SEO_SITE_SETTINGS);
  const [auditIssues, setAuditIssues] = useState<SeoAuditIssue[]>(INITIAL_AUDIT_ISSUES);
  const [selectedPageId, setSelectedPageId] = useState<string>("home");
  const [activeTab, setActiveTab] = useState<ActiveTab>("editor");
  const [serpDevice, setSerpDevice] = useState<SerpDevice>("mobile");
  const [socialPlatform, setSocialPlatform] = useState<SocialPlatform>("google");
  const [isAuditing, setIsAuditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [newKeywordInput, setNewKeywordInput] = useState("");
  const [pingStatus, setPingStatus] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("kusumika_seo_pages");
    if (saved) {
      try {
        setPages(JSON.parse(saved));
      } catch (e) {
        console.error("Could not parse saved SEO pages", e);
      }
    }

    const savedSettings = localStorage.getItem("kusumika_seo_settings");
    if (savedSettings) {
      try {
        setSiteSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Could not parse saved SEO settings", e);
      }
    }
  }, []);

  // Currently selected page config
  const currentPage = useMemo(() => {
    return pages.find((p) => p.id === selectedPageId) || pages[0];
  }, [pages, selectedPageId]);

  // Overall SEO Health Score calculation
  const overallSeoScore = useMemo(() => {
    let totalScore = 0;
    pages.forEach((p) => {
      let pageScore = 50; // base
      if (p.title.length >= 45 && p.title.length <= 65) pageScore += 20;
      else if (p.title.length > 20) pageScore += 10;

      if (p.metaDescription.length >= 120 && p.metaDescription.length <= 165) pageScore += 20;
      else if (p.metaDescription.length > 50) pageScore += 10;

      if (p.focusKeywords.length >= 2) pageScore += 10;
      totalScore += pageScore;
    });
    return Math.round(totalScore / pages.length);
  }, [pages]);

  // Title character quality
  const titleCharCount = currentPage.title.length;
  const isTitleOptimal = titleCharCount >= 45 && titleCharCount <= 65;
  const titleWarning =
    titleCharCount < 40
      ? "Title is too short. Search engines prefer 50–60 characters."
      : titleCharCount > 65
      ? "Title exceeds 65 characters and may be truncated on Google SERPs."
      : "Optimal length for Google Desktop & Mobile search.";

  // Description character quality
  const descCharCount = currentPage.metaDescription.length;
  const isDescOptimal = descCharCount >= 120 && descCharCount <= 165;
  const descWarning =
    descCharCount < 100
      ? "Description is short. Aim for 130–160 characters for maximum search snippet real-estate."
      : descCharCount > 165
      ? "Description exceeds 165 characters and will be clipped with an ellipsis on mobile devices."
      : "Ideal character count for mobile and desktop click-throughs.";

  // Save changes handler
  const handleSave = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("kusumika_seo_pages", JSON.stringify(pages));
      localStorage.setItem("kusumika_seo_settings", JSON.stringify(siteSettings));
    }
    setHasUnsavedChanges(false);
    showToast("SEO configurations and structured microdata published successfully!");
  };

  // Reset to defaults
  const handleReset = () => {
    if (confirm("Reset all SEO configurations to curated factory defaults?")) {
      setPages(DEFAULT_PAGE_SEO_CONFIGS);
      setSiteSettings(DEFAULT_SEO_SITE_SETTINGS);
      if (typeof window !== "undefined") {
        localStorage.removeItem("kusumika_seo_pages");
        localStorage.removeItem("kusumika_seo_settings");
      }
      setHasUnsavedChanges(false);
      showToast("SEO presets reset to handcrafted defaults.");
    }
  };

  // Export JSON
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ pages, siteSettings }, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `kusumika-seo-manifest-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Exported SEO manifest JSON successfully.");
  };

  // Update field on currently active page
  const updateCurrentPage = (field: keyof PageSeoConfig, value: any) => {
    setPages((prev) =>
      prev.map((p) => {
        if (p.id === selectedPageId) {
          return { ...p, [field]: value, lastModified: new Date().toISOString() };
        }
        return p;
      })
    );
    setHasUnsavedChanges(true);
  };

  // Add keyword chip
  const handleAddKeyword = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newKeywordInput.trim()) return;
    const kw = newKeywordInput.trim().toLowerCase();
    if (!currentPage.focusKeywords.includes(kw)) {
      updateCurrentPage("focusKeywords", [...currentPage.focusKeywords, kw]);
    }
    setNewKeywordInput("");
  };

  // Remove keyword chip
  const handleRemoveKeyword = (kw: string) => {
    updateCurrentPage(
      "focusKeywords",
      currentPage.focusKeywords.filter((k) => k !== kw)
    );
  };

  // AI Generator application
  const applyAiTemplate = (template: typeof AI_META_TEMPLATES[0]) => {
    const newTitle = template.generateTitle(currentPage.name);
    const newDesc = template.generateDesc(currentPage.name, currentPage.focusKeywords);
    updateCurrentPage("title", newTitle);
    updateCurrentPage("metaDescription", newDesc);
    setAiModalOpen(false);
    showToast(`Applied ${template.tone} metadata preset.`);
  };

  // Ping search engines simulation
  const handlePingSearchEngines = () => {
    setPingStatus("Pinging Google Search Console & Bing Webmaster bots...");
    setTimeout(() => {
      setPingStatus(`Successfully notified Google & Bing sitemaps at ${new Date().toLocaleTimeString()}! Index refresh queued.`);
      showToast("Google & Bing crawler ping acknowledged (HTTP 200).");
    }, 1200);
  };

  // Re-run health scan simulation
  const handleRunHealthScan = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      showToast("SEO Health Audit complete: 37 routes scanned, 0 critical blockers found.");
    }, 1500);
  };

  return (
    <div className="px-4 sm:px-8 py-6 space-y-6 max-w-[1400px] mx-auto select-none">
      {/* TOP BREADCRUMBS & STATUS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant/30 text-xs">
        <div className="flex items-center gap-2 uppercase tracking-widest text-on-surface-variant font-semibold">
          <span>Operations Administration</span>
          <span className="text-outline">/</span>
          <span className="text-primary font-bold">SEO & Organic Search Command Center</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {hasUnsavedChanges && (
            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-sans text-[11px] font-bold flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-600" />
              Unpublished Edits
            </span>
          )}
          <button
            onClick={handleSave}
            type="button"
            className="px-4 py-1.5 rounded-lg bg-primary text-surface font-sans text-xs font-bold uppercase tracking-wider hover:bg-primary-container transition-colors shadow-sm flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">save</span>
            <span>Publish SEO</span>
          </button>
          <button
            onClick={handleExportJson}
            type="button"
            className="px-3 py-1.5 rounded-lg bg-surface border border-outline-variant/60 text-primary font-sans text-xs font-semibold hover:bg-surface-container transition-colors shadow-sm flex items-center gap-1"
            title="Download JSON manifest"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={handleReset}
            type="button"
            className="p-1.5 rounded-lg bg-surface border border-outline-variant/60 text-outline hover:text-error transition-colors"
            title="Reset to Defaults"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
          </button>
        </div>
      </div>

      {/* HEADER HERO */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[28px]">
              travel_explore
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-primary font-normal tracking-tight">
              SEO & Search Engine Panel
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-surface-container border border-outline-variant/50 text-[11px] font-sans font-bold text-secondary">
              Atelier Edition
            </span>
          </div>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl">
            Control Google search snippets, social previews (WhatsApp, Meta, X), meta titles, and Schema.org rich results in a single, intuitive dashboard.
          </p>
        </div>

        {/* Global SEO Health Score Gauge Badge */}
        <div className="flex items-center gap-4 bg-surface-container-lowest p-3.5 sm:px-5 rounded-xl border border-outline-variant/40 shadow-sm shrink-0">
          <div className="relative flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="currentColor"
                strokeWidth="5"
                className="text-surface-container-high"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="currentColor"
                strokeWidth="5"
                strokeDasharray={163.3}
                strokeDashoffset={163.3 - (163.3 * overallSeoScore) / 100}
                strokeLinecap="round"
                className="text-tertiary transition-all duration-1000"
                fill="transparent"
              />
            </svg>
            <span className="absolute font-serif text-lg font-bold text-primary">
              {overallSeoScore}%
            </span>
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-sans uppercase font-bold tracking-wider text-primary">
                SEO Health Score
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-tertiary/15 text-tertiary font-bold">
                Grade A
              </span>
            </div>
            <p className="text-[11px] text-on-surface-variant">
              37 URLs indexed • 100% Rich Snippets
            </p>
            <div className="flex items-center gap-2 pt-0.5 text-[11px]">
              <Link
                href="/sitemap.xml"
                target="_blank"
                className="text-secondary hover:underline font-semibold flex items-center gap-0.5"
              >
                <span>/sitemap.xml</span>
                <span className="material-symbols-outlined text-[12px]">open_in_new</span>
              </Link>
              <span>•</span>
              <Link
                href="/robots.txt"
                target="_blank"
                className="text-secondary hover:underline font-semibold flex items-center gap-0.5"
              >
                <span>/robots.txt</span>
                <span className="material-symbols-outlined text-[12px]">open_in_new</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-outline-variant/40 overflow-x-auto no-scrollbar font-sans text-xs">
        <button
          onClick={() => setActiveTab("editor")}
          type="button"
          className={cn(
            "px-4 py-3 font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5",
            activeTab === "editor"
              ? "border-primary text-primary bg-surface-container-low"
              : "border-transparent text-outline hover:text-on-surface"
          )}
        >
          <span className="material-symbols-outlined text-[18px]">edit_note</span>
          <span>Page Metadata Studio</span>
        </button>

        <button
          onClick={() => setActiveTab("serp")}
          type="button"
          className={cn(
            "px-4 py-3 font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5",
            activeTab === "serp"
              ? "border-primary text-primary bg-surface-container-low"
              : "border-transparent text-outline hover:text-on-surface"
          )}
        >
          <span className="material-symbols-outlined text-[18px]">preview</span>
          <span>Google & Social Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab("audit")}
          type="button"
          className={cn(
            "px-4 py-3 font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5",
            activeTab === "audit"
              ? "border-primary text-primary bg-surface-container-low"
              : "border-transparent text-outline hover:text-on-surface"
          )}
        >
          <span className="material-symbols-outlined text-[18px]">health_and_safety</span>
          <span>Site Health Audit</span>
          <span className="px-1.5 py-0.2 rounded-full bg-surface-container-highest text-[10px] text-primary">
            {auditIssues.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("sitemap")}
          type="button"
          className={cn(
            "px-4 py-3 font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5",
            activeTab === "sitemap"
              ? "border-primary text-primary bg-surface-container-low"
              : "border-transparent text-outline hover:text-on-surface"
          )}
        >
          <span className="material-symbols-outlined text-[18px]">map</span>
          <span>Sitemap & Robots</span>
        </button>

        <button
          onClick={() => setActiveTab("schema")}
          type="button"
          className={cn(
            "px-4 py-3 font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5",
            activeTab === "schema"
              ? "border-primary text-primary bg-surface-container-low"
              : "border-transparent text-outline hover:text-on-surface"
          )}
        >
          <span className="material-symbols-outlined text-[18px]">data_object</span>
          <span>Rich Snippets (Schema.org)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PAGE METADATA STUDIO                                               */}
      {/* ========================================================================= */}
      {activeTab === "editor" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Page Selector Sidebar (4 cols) */}
          <div className="lg:col-span-4 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/40 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
              <span className="font-sans text-xs uppercase tracking-wider font-bold text-primary">
                Select Page to Optimize
              </span>
              <span className="text-[10px] text-outline font-sans">
                {pages.length} Pages Available
              </span>
            </div>

            <div className="space-y-1 max-h-[580px] overflow-y-auto pr-1">
              {pages.map((p) => {
                const isSelected = p.id === selectedPageId;
                const isReady = p.title.length > 30 && p.metaDescription.length > 80;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPageId(p.id)}
                    type="button"
                    className={cn(
                      "w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between gap-3 text-xs font-sans",
                      isSelected
                        ? "bg-surface-container border-primary text-primary shadow-sm"
                        : "bg-surface hover:bg-surface-container-low border-outline-variant/30 text-on-surface"
                    )}
                  >
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold truncate">{p.name}</span>
                        <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-surface-dim text-outline">
                          {p.category}
                        </span>
                      </div>
                      <span className="text-[10px] text-outline font-mono truncate">
                        {p.path}
                      </span>
                    </div>

                    <div className="shrink-0 flex items-center gap-1">
                      {isReady ? (
                        <span
                          className="material-symbols-outlined text-tertiary text-[18px]"
                          title="Healthy metadata"
                        >
                          check_circle
                        </span>
                      ) : (
                        <span
                          className="material-symbols-outlined text-amber-600 text-[18px]"
                          title="Needs optimization"
                        >
                          warning
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-outline-variant/30">
              <button
                type="button"
                onClick={() => setAiModalOpen(true)}
                className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-secondary via-primary to-primary text-surface font-sans text-xs uppercase font-bold tracking-wider hover:opacity-95 transition-opacity flex items-center justify-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                <span>AI Metadata Writer</span>
              </button>
            </div>
          </div>

          {/* Right Column: Active Page Editor & Real-time Live Guidance (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/40 shadow-sm space-y-6">
              {/* Page Identity Banner */}
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-xl sm:text-2xl text-primary font-normal">
                      {currentPage.name}
                    </h3>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface-container text-secondary font-semibold">
                      {currentPage.path}
                    </span>
                  </div>
                  <p className="font-sans text-xs text-outline">
                    Category: {currentPage.category} • Last Modified:{" "}
                    {new Date(currentPage.lastModified).toLocaleDateString()}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab("serp")}
                  className="px-3 py-1.5 rounded-lg border border-outline-variant/50 hover:bg-surface-container text-xs font-sans font-semibold text-primary transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                  <span>View Preview</span>
                </button>
              </div>

              {/* 1. SEO Title Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-sans">
                  <label className="font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                    <span>Meta Title (Search Heading)</span>
                    <span className="text-secondary font-bold">*</span>
                  </label>
                  <span
                    className={cn(
                      "font-mono font-bold",
                      isTitleOptimal ? "text-tertiary" : "text-amber-700"
                    )}
                  >
                    {titleCharCount} / 60 chars
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={currentPage.title}
                    onChange={(e) => updateCurrentPage("title", e.target.value)}
                    className="w-full bg-surface-container-low text-on-surface text-sm px-3.5 py-2.5 rounded-lg border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-primary font-sans"
                    placeholder="Enter high-ranking page title..."
                  />
                </div>

                {/* Live Character Progress Bar */}
                <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-300",
                      isTitleOptimal
                        ? "bg-tertiary"
                        : titleCharCount > 65
                        ? "bg-red-500"
                        : "bg-amber-500"
                    )}
                    style={{ width: `${Math.min((titleCharCount / 60) * 100, 100)}%` }}
                  />
                </div>

                <p className="text-[11px] text-outline font-sans flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">
                    {isTitleOptimal ? "check" : "info"}
                  </span>
                  <span>{titleWarning}</span>
                </p>
              </div>

              {/* 2. Meta Description Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-sans">
                  <label className="font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                    <span>Meta Description (Search Snippet)</span>
                    <span className="text-secondary font-bold">*</span>
                  </label>
                  <span
                    className={cn(
                      "font-mono font-bold",
                      isDescOptimal ? "text-tertiary" : "text-amber-700"
                    )}
                  >
                    {descCharCount} / 160 chars
                  </span>
                </div>

                <textarea
                  rows={3}
                  value={currentPage.metaDescription}
                  onChange={(e) => updateCurrentPage("metaDescription", e.target.value)}
                  className="w-full bg-surface-container-low text-on-surface text-sm p-3.5 rounded-lg border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-primary font-sans leading-relaxed"
                  placeholder="Enter compelling search snippet with natural keywords..."
                />

                {/* Progress Bar */}
                <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-300",
                      isDescOptimal
                        ? "bg-tertiary"
                        : descCharCount > 165
                        ? "bg-red-500"
                        : "bg-amber-500"
                    )}
                    style={{ width: `${Math.min((descCharCount / 160) * 100, 100)}%` }}
                  />
                </div>

                <p className="text-[11px] text-outline font-sans flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">
                    {isDescOptimal ? "check" : "info"}
                  </span>
                  <span>{descWarning}</span>
                </p>
              </div>

              {/* 3. Focus Target Keywords */}
              <div className="space-y-2 pt-2 border-t border-outline-variant/30">
                <label className="text-xs font-sans font-bold uppercase tracking-wider text-on-surface">
                  Focus Ranking Keywords
                </label>

                <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 min-h-[44px]">
                  {currentPage.focusKeywords.map((kw) => (
                    <span
                      key={kw}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface border border-outline-variant/40 text-primary font-sans text-xs font-medium shadow-2xs"
                    >
                      <span>{kw}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(kw)}
                        className="text-outline hover:text-error text-sm font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}

                  <form onSubmit={handleAddKeyword} className="inline-flex items-center gap-1 flex-1 min-w-[140px]">
                    <input
                      type="text"
                      value={newKeywordInput}
                      onChange={(e) => setNewKeywordInput(e.target.value)}
                      placeholder="+ Add keyword..."
                      className="bg-transparent text-xs font-sans text-on-surface focus:outline-none w-full placeholder:text-outline"
                    />
                  </form>
                </div>

                {/* Recommended keyword chips */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px] font-sans text-outline">
                  <span>Suggested keywords:</span>
                  {["400TC Cotton", "Jaipur Bedsheets", "Bagru Dohar", "Luxury Hotel Linen", "Sanganer Prints"].map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => {
                        if (!currentPage.focusKeywords.includes(sug.toLowerCase())) {
                          updateCurrentPage("focusKeywords", [...currentPage.focusKeywords, sug.toLowerCase()]);
                        }
                      }}
                      className="text-primary hover:text-secondary underline decoration-dotted font-medium"
                    >
                      +{sug}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Canonical & OpenGraph Social Image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-outline-variant/30 text-xs font-sans">
                <div className="space-y-1.5">
                  <label className="font-bold text-on-surface uppercase tracking-wider">
                    Canonical URL Tag
                  </label>
                  <input
                    type="url"
                    value={currentPage.canonicalUrl}
                    onChange={(e) => updateCurrentPage("canonicalUrl", e.target.value)}
                    className="w-full bg-surface-container-low text-on-surface text-xs px-3 py-2 rounded-lg border border-outline-variant/40 font-mono"
                  />
                  <span className="text-[10px] text-outline">
                    Prevents search engines from penalizing duplicate URLs.
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-on-surface uppercase tracking-wider">
                    Social Sharing Image (OG:Image)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={currentPage.ogImage}
                      onChange={(e) => updateCurrentPage("ogImage", e.target.value)}
                      className="w-full bg-surface-container-low text-on-surface text-xs px-3 py-2 rounded-lg border border-outline-variant/40 font-mono truncate"
                    />
                    <div className="relative w-9 h-9 rounded bg-surface-dim shrink-0 overflow-hidden border border-outline-variant/40">
                      <Image
                        src={currentPage.ogImage}
                        alt="OG Preview"
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <span className="text-[10px] text-outline">
                    Preview image for WhatsApp, iMessage, Facebook & X links.
                  </span>
                </div>
              </div>

              {/* 5. Robots Crawling Directives */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-sans">
                <div>
                  <h4 className="font-bold text-primary">Search Crawler Directives (Robots Meta)</h4>
                  <p className="text-on-surface-variant text-[11px] mt-0.5">
                    Allow or disallow web spiders (Googlebot, Bingbot) from indexing this specific route.
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentPage.robotsIndex}
                      onChange={(e) => updateCurrentPage("robotsIndex", e.target.checked)}
                      className="rounded accent-primary w-4 h-4"
                    />
                    <span className="font-semibold text-on-surface">Allow Indexing (index)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentPage.robotsFollow}
                      onChange={(e) => updateCurrentPage("robotsFollow", e.target.checked)}
                      className="rounded accent-primary w-4 h-4"
                    />
                    <span className="font-semibold text-on-surface">Follow Links (follow)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: LIVE SERP & SOCIAL SIMULATOR                                       */}
      {/* ========================================================================= */}
      {activeTab === "serp" && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/40 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="font-sans text-xs uppercase font-bold text-primary">Platform:</span>
              <div className="flex items-center gap-1.5 font-sans text-xs">
                <button
                  type="button"
                  onClick={() => setSocialPlatform("google")}
                  className={cn(
                    "px-3 py-1 rounded-md font-semibold transition-colors",
                    socialPlatform === "google"
                      ? "bg-primary text-surface"
                      : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                  )}
                >
                  Google SERP
                </button>
                <button
                  type="button"
                  onClick={() => setSocialPlatform("whatsapp")}
                  className={cn(
                    "px-3 py-1 rounded-md font-semibold transition-colors",
                    socialPlatform === "whatsapp"
                      ? "bg-[#25D366] text-white"
                      : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                  )}
                >
                  WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => setSocialPlatform("facebook")}
                  className={cn(
                    "px-3 py-1 rounded-md font-semibold transition-colors",
                    socialPlatform === "facebook"
                      ? "bg-[#1877F2] text-white"
                      : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                  )}
                >
                  Facebook / Meta
                </button>
                <button
                  type="button"
                  onClick={() => setSocialPlatform("twitter")}
                  className={cn(
                    "px-3 py-1 rounded-md font-semibold transition-colors",
                    socialPlatform === "twitter"
                      ? "bg-black text-white"
                      : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                  )}
                >
                  X (Twitter)
                </button>
              </div>
            </div>

            {socialPlatform === "google" && (
              <div className="flex items-center gap-2 font-sans text-xs">
                <span className="uppercase font-bold text-outline">Device:</span>
                <button
                  type="button"
                  onClick={() => setSerpDevice("mobile")}
                  className={cn(
                    "p-1.5 rounded flex items-center justify-center transition-colors",
                    serpDevice === "mobile"
                      ? "bg-primary text-surface"
                      : "bg-surface-container text-outline hover:text-primary"
                  )}
                  title="Mobile SERP"
                >
                  <span className="material-symbols-outlined text-[18px]">smartphone</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSerpDevice("desktop")}
                  className={cn(
                    "p-1.5 rounded flex items-center justify-center transition-colors",
                    serpDevice === "desktop"
                      ? "bg-primary text-surface"
                      : "bg-surface-container text-outline hover:text-primary"
                  )}
                  title="Desktop SERP"
                >
                  <span className="material-symbols-outlined text-[18px]">laptop</span>
                </button>
              </div>
            )}
          </div>

          {/* SIMULATOR CANVAS */}
          <div className="p-6 sm:p-10 rounded-2xl bg-surface-dim/40 border border-outline-variant/50 flex flex-col items-center justify-center min-h-[400px]">
            {/* 1. GOOGLE SERP PREVIEW */}
            {socialPlatform === "google" && (
              <div
                className={cn(
                  "bg-white text-[#202124] rounded-2xl shadow-md border border-gray-200 p-4 sm:p-5 font-sans transition-all w-full",
                  serpDevice === "mobile" ? "max-w-md" : "max-w-2xl"
                )}
              >
                {/* Header breadcrumb & Favicon */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-7 h-7 rounded-full bg-[#5C181A]/10 text-[#5C181A] flex items-center justify-center font-serif text-xs font-bold shrink-0">
                    ❀
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs text-[#202124] font-medium leading-none">
                      Kusumika
                    </span>
                    <span className="text-[11px] text-[#5f6368] truncate leading-tight">
                      https://kusumika.com{currentPage.path === "/" ? "" : currentPage.path}
                    </span>
                  </div>
                </div>

                {/* Clickable Blue Title */}
                <h3 className="text-[#1a0dab] hover:underline cursor-pointer text-lg sm:text-xl font-normal leading-snug line-clamp-2">
                  {currentPage.title}
                </h3>

                {/* Rich Snippets Row (for products) */}
                {currentPage.category === "Products" && (
                  <div className="flex items-center gap-2 text-xs text-[#5f6368] my-1">
                    <div className="flex items-center text-amber-500">
                      <span>★★★★★</span>
                    </div>
                    <span className="font-semibold text-gray-700">4.9 (420)</span>
                    <span>•</span>
                    <span className="font-bold text-emerald-700">In stock</span>
                    <span>•</span>
                    <span>₹2,999</span>
                  </div>
                )}

                {/* Search Meta Description Snippet */}
                <p className="text-xs sm:text-sm text-[#4d5156] leading-relaxed mt-1 line-clamp-3">
                  {currentPage.metaDescription}
                </p>

                {/* Google Sitelinks Pill simulation */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100 mt-3 text-xs text-[#1a0dab] overflow-x-auto no-scrollbar">
                  <span className="hover:underline cursor-pointer">Bedsheets (400TC)</span>
                  <span>•</span>
                  <span className="hover:underline cursor-pointer">Mulberry Dohars</span>
                  <span>•</span>
                  <span className="hover:underline cursor-pointer">Partial COD Policy</span>
                  <span>•</span>
                  <span className="hover:underline cursor-pointer">Track Consignment</span>
                </div>
              </div>
            )}

            {/* 2. WHATSAPP CHAT PREVIEW */}
            {socialPlatform === "whatsapp" && (
              <div className="max-w-sm w-full bg-[#EFEAE2] p-4 rounded-2xl shadow-lg border border-[#e0d6cb]">
                <div className="bg-white rounded-lg p-2.5 shadow-sm border border-black/5 space-y-2">
                  <div className="relative w-full aspect-[16/9] rounded-md overflow-hidden bg-gray-100">
                    <Image
                      src={currentPage.ogImage}
                      alt={currentPage.title}
                      fill
                      sizes="340px"
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-0.5 px-0.5">
                    <span className="text-[10px] uppercase font-sans text-gray-400 font-semibold tracking-wider">
                      kusumika.com
                    </span>
                    <h4 className="font-bold text-xs text-[#111b21] line-clamp-2 leading-tight">
                      {currentPage.title}
                    </h4>
                    <p className="text-[11px] text-[#667781] line-clamp-2 leading-snug">
                      {currentPage.metaDescription}
                    </p>
                  </div>
                </div>
                <div className="text-[10px] text-[#667781] text-right mt-1 font-mono">
                  10:42 AM • Read ✓✓
                </div>
              </div>
            )}

            {/* 3. FACEBOOK OPENGRAPH CARD */}
            {socialPlatform === "facebook" && (
              <div className="max-w-md w-full bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden font-sans">
                <div className="relative w-full aspect-[1.91/1] bg-gray-100">
                  <Image
                    src={currentPage.ogImage}
                    alt={currentPage.title}
                    fill
                    sizes="450px"
                    className="object-cover"
                  />
                </div>
                <div className="p-3.5 bg-[#f0f2f5] space-y-1">
                  <span className="text-[11px] uppercase tracking-wider text-[#65676b] font-medium block">
                    KUSUMIKA.COM
                  </span>
                  <h4 className="text-sm font-bold text-[#050505] line-clamp-2 leading-tight hover:underline cursor-pointer">
                    {currentPage.title}
                  </h4>
                  <p className="text-xs text-[#65676b] line-clamp-2 leading-snug">
                    {currentPage.metaDescription}
                  </p>
                </div>
              </div>
            )}

            {/* 4. TWITTER / X SUMMARY CARD */}
            {socialPlatform === "twitter" && (
              <div className="max-w-md w-full bg-black text-white rounded-2xl shadow-xl border border-gray-800 overflow-hidden font-sans">
                <div className="relative w-full aspect-[16/9] bg-gray-900">
                  <Image
                    src={currentPage.ogImage}
                    alt={currentPage.title}
                    fill
                    sizes="450px"
                    className="object-cover"
                  />
                </div>
                <div className="p-3.5 space-y-1">
                  <span className="text-xs text-gray-400 font-mono">
                    kusumika.com
                  </span>
                  <h4 className="text-sm font-bold text-white line-clamp-1">
                    {currentPage.title}
                  </h4>
                  <p className="text-xs text-gray-400 line-clamp-2">
                    {currentPage.metaDescription}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SITE HEALTH AUDIT                                                  */}
      {/* ========================================================================= */}
      {activeTab === "audit" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/40 shadow-sm">
            <div className="space-y-0.5">
              <h3 className="font-serif text-xl sm:text-2xl text-primary font-normal">
                Automated Search Engine Health Audit
              </h3>
              <p className="text-xs text-on-surface-variant font-sans">
                Deep scan for Core Web Vitals, Schema.org rich snippets, title lengths, and indexing safeguards.
              </p>
            </div>

            <button
              onClick={handleRunHealthScan}
              disabled={isAuditing}
              type="button"
              className="px-4 py-2 rounded-lg bg-primary text-surface font-sans text-xs uppercase font-bold tracking-wider hover:bg-primary-container transition-colors shadow-sm flex items-center gap-2 self-start sm:self-center"
            >
              <span className={cn("material-symbols-outlined text-[16px]", isAuditing && "animate-spin")}>
                {isAuditing ? "sync" : "radar"}
              </span>
              <span>{isAuditing ? "Scanning Site..." : "Re-Scan Website"}</span>
            </button>
          </div>

          {/* Audit Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/40 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-outline">
                <span className="text-xs uppercase font-bold tracking-wider">Indexed Routes</span>
                <span className="material-symbols-outlined text-tertiary text-[20px]">check_circle</span>
              </div>
              <div className="font-serif text-2xl font-bold text-primary">37 / 37</div>
              <p className="text-[11px] text-tertiary font-semibold">100% Coverage on Sitemap.xml</p>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/40 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-outline">
                <span className="text-xs uppercase font-bold tracking-wider">Avg Meta Length</span>
                <span className="material-symbols-outlined text-tertiary text-[20px]">straighten</span>
              </div>
              <div className="font-serif text-2xl font-bold text-primary">152 chars</div>
              <p className="text-[11px] text-tertiary font-semibold">Perfect for Mobile SERP</p>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/40 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-outline">
                <span className="text-xs uppercase font-bold tracking-wider">Schema Microdata</span>
                <span className="material-symbols-outlined text-tertiary text-[20px]">verified</span>
              </div>
              <div className="font-serif text-2xl font-bold text-primary">5 Schemas</div>
              <p className="text-[11px] text-tertiary font-semibold">Valid JSON-LD Rich Snippets</p>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/40 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-outline">
                <span className="text-xs uppercase font-bold tracking-wider">Robots Protection</span>
                <span className="material-symbols-outlined text-secondary text-[20px]">security</span>
              </div>
              <div className="font-serif text-2xl font-bold text-primary">Protected</div>
              <p className="text-[11px] text-on-surface-variant">Admin & Checkout Disallowed</p>
            </div>
          </div>

          {/* Audit Issues List */}
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/40 shadow-sm space-y-4 font-sans text-xs">
            <h4 className="font-bold text-primary text-sm">Audit Findings & Optimization Actions</h4>
            <div className="divide-y divide-outline-variant/30">
              {auditIssues.map((issue) => (
                <div key={issue.id} className="py-3.5 flex items-start gap-3">
                  <span
                    className={cn(
                      "material-symbols-outlined text-[20px] shrink-0 mt-0.5",
                      issue.severity === "good"
                        ? "text-tertiary"
                        : issue.severity === "warning"
                        ? "text-amber-600"
                        : "text-red-600"
                    )}
                  >
                    {issue.severity === "good" ? "check_circle" : "warning"}
                  </span>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-on-surface text-sm">{issue.title}</span>
                      {issue.pagePath && (
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-surface-container text-secondary">
                          {issue.pagePath}
                        </span>
                      )}
                    </div>
                    <p className="text-on-surface-variant text-xs leading-relaxed">
                      {issue.description}
                    </p>
                    <p className="text-[11px] text-primary font-medium">
                      <strong>Recommendation:</strong> {issue.recommendation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SITEMAP & ROBOTS.TXT COMMAND CENTER                                 */}
      {/* ========================================================================= */}
      {activeTab === "sitemap" && (
        <div className="space-y-6">
          {/* Top Ping & Health Row */}
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans text-xs">
            <div className="space-y-1">
              <h3 className="font-serif text-xl sm:text-2xl text-primary font-normal">
                Sitemap & Search Bot Directives
              </h3>
              <p className="text-on-surface-variant">
                Search engines automatically crawl your store via <code className="text-primary font-bold">/sitemap.xml</code> and respect <code className="text-primary font-bold">/robots.txt</code>.
              </p>
            </div>

            <button
              onClick={handlePingSearchEngines}
              type="button"
              className="px-4 py-2.5 rounded-lg bg-secondary text-surface font-bold uppercase tracking-wider hover:bg-primary transition-colors shadow-sm flex items-center gap-2 self-start sm:self-center"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              <span>Ping Google & Bing Bots</span>
            </button>
          </div>

          {pingStatus && (
            <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-sans flex items-center gap-2 animate-in fade-in">
              <span className="material-symbols-outlined text-emerald-700 text-[18px]">done_all</span>
              <span>{pingStatus}</span>
            </div>
          )}

          {/* Sitemap & Robots Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans text-xs">
            {/* Sitemap Panel */}
            <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/40 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
                <div className="flex items-center gap-2 font-bold text-primary">
                  <span className="material-symbols-outlined text-[18px]">lan</span>
                  <span>Live Dynamic Sitemap (sitemap.ts)</span>
                </div>
                <Link
                  href="/sitemap.xml"
                  target="_blank"
                  className="text-secondary font-bold hover:underline flex items-center gap-1"
                >
                  <span>Open XML</span>
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </Link>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] text-outline font-semibold uppercase">
                  Currently Indexed Route Segments
                </span>
                <div className="bg-surface-container-low p-3 rounded-lg font-mono text-[11px] space-y-1.5 max-h-60 overflow-y-auto">
                  <div className="flex justify-between text-on-surface">
                    <span>https://kusumika.com/</span>
                    <span className="text-tertiary">priority 1.0 (daily)</span>
                  </div>
                  <div className="flex justify-between text-on-surface">
                    <span>https://kusumika.com/collections</span>
                    <span className="text-tertiary">priority 0.9 (daily)</span>
                  </div>
                  <div className="flex justify-between text-on-surface">
                    <span>https://kusumika.com/collections/bedsheets</span>
                    <span className="text-tertiary">priority 0.8 (weekly)</span>
                  </div>
                  <div className="flex justify-between text-on-surface">
                    <span>https://kusumika.com/collections/quilts</span>
                    <span className="text-tertiary">priority 0.8 (weekly)</span>
                  </div>
                  <div className="flex justify-between text-on-surface">
                    <span>https://kusumika.com/products/sanganer-botanical-cotton-bedsheet</span>
                    <span className="text-tertiary">priority 0.8 (weekly)</span>
                  </div>
                  <div className="flex justify-between text-on-surface">
                    <span>https://kusumika.com/bulk-enquiry</span>
                    <span className="text-tertiary">priority 0.8 (monthly)</span>
                  </div>
                  <div className="flex justify-between text-on-surface">
                    <span>https://kusumika.com/shipping-policy</span>
                    <span className="text-tertiary">priority 0.5 (monthly)</span>
                  </div>
                  <div className="flex justify-between text-on-surface">
                    <span>https://kusumika.com/returns-exchange</span>
                    <span className="text-tertiary">priority 0.5 (monthly)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Robots.txt Panel */}
            <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/40 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
                <div className="flex items-center gap-2 font-bold text-primary">
                  <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                  <span>Robots Crawler Directives (robots.ts)</span>
                </div>
                <Link
                  href="/robots.txt"
                  target="_blank"
                  className="text-secondary font-bold hover:underline flex items-center gap-1"
                >
                  <span>Open robots.txt</span>
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </Link>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] text-outline font-semibold uppercase">
                  Active Directives Output
                </span>
                <pre className="bg-surface-container-low p-3.5 rounded-lg font-mono text-[11px] text-on-surface leading-relaxed overflow-x-auto">
{`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /account/
Disallow: /checkout

Sitemap: https://kusumika.com/sitemap.xml`}
                </pre>
                <p className="text-[11px] text-outline">
                  Protects sensitive patron dossiers and administrative operations while maximizing crawl budget for storefront product catalogs.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: SCHEMA.ORG RICH SNIPPETS                                           */}
      {/* ========================================================================= */}
      {activeTab === "schema" && (
        <div className="space-y-6">
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans text-xs">
            <div className="space-y-1">
              <h3 className="font-serif text-xl sm:text-2xl text-primary font-normal">
                Schema.org JSON-LD Structured Data
              </h3>
              <p className="text-on-surface-variant">
                Enables Google to display rich search features: Star ratings, INR price tags, in-stock badges, and FAQs directly inside search results.
              </p>
            </div>

            <a
              href="https://search.google.com/test/rich-results"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-lg border border-outline-variant/60 hover:bg-surface-container text-primary font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center gap-2 self-start sm:self-center"
            >
              <span>Test on Google Rich Results</span>
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans text-xs">
            {/* Organization Schema Preview */}
            <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/40 shadow-sm space-y-3">
              <div className="flex items-center gap-2 font-bold text-primary">
                <span className="material-symbols-outlined text-[18px]">corporate_fare</span>
                <span>Organization Schema (Brand Identity)</span>
              </div>
              <p className="text-[11px] text-outline">
                Injected globally on the homepage to establish Kusumika's Knowledge Graph entry.
              </p>
              <pre className="bg-surface-container-low p-3.5 rounded-lg font-mono text-[10px] sm:text-[11px] text-on-surface overflow-x-auto max-h-64 leading-relaxed">
{JSON.stringify(
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Kusumika Luxury Home Textiles",
    legalName: "Kusumika Artisanal Textiles Private Limited",
    url: "https://kusumika.com",
    logo: "https://kusumika.com/logo.png",
    slogan: "Soft like Silk, Feels like a Hug",
    foundingLocation: {
      "@type": "Place",
      name: "Jaipur, Rajasthan, India",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Bagru & Sanganer Artisanal Road",
      addressLocality: "Jaipur",
      postalCode: "302029",
      addressCountry: "IN",
    },
  },
  null,
  2
)}
              </pre>
            </div>

            {/* Product & Offer Schema Preview */}
            <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/40 shadow-sm space-y-3">
              <div className="flex items-center gap-2 font-bold text-primary">
                <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                <span>Product & Offer Schema (Pricing & Stock)</span>
              </div>
              <p className="text-[11px] text-outline">
                Injected on all individual product showcase pages for Google Shopping cards.
              </p>
              <pre className="bg-surface-container-low p-3.5 rounded-lg font-mono text-[10px] sm:text-[11px] text-on-surface overflow-x-auto max-h-64 leading-relaxed">
{JSON.stringify(
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Sanganer Botanical Pure 400TC Cotton Bedsheet Set",
    brand: { "@type": "Brand", name: "Kusumika" },
    material: "100% GOTS Pure Cotton",
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: 2999,
      availability: "https://schema.org/InStock",
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "INR" },
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "420",
    },
  },
  null,
  2
)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* AI METADATA GENERATOR MODAL                                               */}
      {/* ========================================================================= */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface p-6 rounded-2xl max-w-lg w-full border border-outline-variant/60 shadow-2xl space-y-4 font-sans text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <span className="material-symbols-outlined text-[20px] text-secondary">
                  auto_awesome
                </span>
                <span>AI Luxury Metadata Writer</span>
              </div>
              <button
                type="button"
                onClick={() => setAiModalOpen(false)}
                className="text-outline hover:text-on-surface text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-on-surface-variant leading-relaxed">
              Choose an editorial brand tone to automatically draft SEO titles and descriptions optimized for Indian luxury home textile searches:
            </p>

            <div className="space-y-3">
              {AI_META_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.tone}
                  className="p-3.5 rounded-xl border border-outline-variant/40 bg-surface-container-low hover:bg-surface-container transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">{tmpl.tone}</span>
                    <button
                      type="button"
                      onClick={() => applyAiTemplate(tmpl)}
                      className="px-3 py-1 rounded bg-secondary text-surface text-[11px] font-bold uppercase tracking-wider hover:bg-primary transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  <p className="text-[11px] text-outline font-serif italic">
                    "{tmpl.generateTitle(currentPage.name)}"
                  </p>
                  <p className="text-[11px] text-on-surface-variant line-clamp-2">
                    {tmpl.generateDesc(currentPage.name, currentPage.focusKeywords)}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setAiModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-surface border border-outline-variant/60 font-semibold text-primary hover:bg-surface-container"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
