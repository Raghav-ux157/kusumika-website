"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAdmin } from "@/context/AdminContext";
import { PatronProfile } from "@/types/admin";
import { formatPrice, cn } from "@/lib/utils";

const SEGMENT_TABS = [
  { id: "all", label: "All Patrons" },
  { id: "royal", label: "Royal Patrons (LTV > ₹30k)" },
  { id: "festive_gifting", label: "Festive Gifting / B2B" },
  { id: "organic_homeowner", label: "Organic Homeowners" },
];

export default function CustomersPage() {
  const { patrons, addPatronTimelineEvent, showToast } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [segmentFilter, setSegmentFilter] = useState("all");
  const [selectedPatron, setSelectedPatron] = useState<PatronProfile | null>(patrons[0] || null);

  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState<"whatsapp" | "call" | "internal_note">("internal_note");

  const filteredPatrons = patrons.filter((p) => {
    const matchesSearch =
      p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSegment = segmentFilter === "all" || p.segment === segmentFilter;
    return matchesSearch && matchesSegment;
  });

  const handleAddTimelineNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedPatron) return;

    addPatronTimelineEvent(selectedPatron.id, {
      type: noteType,
      title:
        noteType === "whatsapp"
          ? "WhatsApp Concierge Message Sent"
          : noteType === "call"
          ? "Concierge Discovery Call"
          : "Staff Internal Note",
      description: newNote,
      author: "Devika Sharma (Ops)",
    });

    setNewNote("");
  };

  return (
    <div className="px-4 sm:px-8 py-6 space-y-6 max-w-[1700px] mx-auto">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30 text-xs">
        <div className="flex items-center gap-2 uppercase tracking-widest text-on-surface-variant font-semibold">
          <span>Patron Care</span>
          <span className="text-outline">/</span>
          <span className="text-primary">Dossiers & Touchpoints</span>
        </div>
        <span className="text-outline">Active Patrons Registered: {patrons.length}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-primary font-normal tracking-tight">
            Patron Profiles & Communication Timeline
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Track multi-channel customer interactions, loyalty tier progression, and doorstep delivery satisfaction.
          </p>
        </div>
      </div>

      {/* Segment Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-outline-variant/30 pb-3">
        {SEGMENT_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSegmentFilter(tab.id)}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
              segmentFilter === tab.id
                ? "bg-primary text-on-primary shadow-sm"
                : "bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dual Pane Layout: Directory on Left (5 cols) and Detail Dossier on Right (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Patrons Directory (5 cols) */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-4 space-y-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-container-low text-on-surface placeholder:text-outline text-xs pl-9 pr-3 py-2 rounded-lg border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Search patron by name, phone (+91), or city..."
              type="text"
            />
          </div>

          <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
            {filteredPatrons.map((patron) => {
              const isSelected = selectedPatron?.id === patron.id;
              return (
                <div
                  key={patron.id}
                  onClick={() => setSelectedPatron(patron)}
                  className={cn(
                    "p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3",
                    isSelected
                      ? "bg-surface-container-high border-primary/40 shadow-sm"
                      : "bg-surface hover:bg-surface-container-low border-outline-variant/30"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary font-bold text-xs flex items-center justify-center shrink-0">
                      {patron.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-serif text-sm font-semibold text-on-surface truncate">
                          {patron.full_name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-outline truncate">{patron.city}, {patron.state}</p>
                      <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">
                        {patron.loyalty_tier}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-serif font-bold text-primary text-sm">
                      {formatPrice(patron.total_spent)}
                    </div>
                    <div className="text-[11px] text-outline font-medium">
                      {patron.orders_count} Orders
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Patron Dossier & Timeline (7 cols) */}
        {selectedPatron ? (
          <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-6 sm:p-8 space-y-6">
            {/* Patron Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary text-on-primary font-serif font-bold text-xl flex items-center justify-center shadow-md">
                  {selectedPatron.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-2xl text-primary font-medium">
                      {selectedPatron.full_name}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-surface-container text-secondary border border-secondary/20">
                      {selectedPatron.loyalty_tier}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Patron since {selectedPatron.joined_date} • {selectedPatron.city}, {selectedPatron.state}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/${selectedPatron.phone.replace(/[^0-9]/g, "")}?text=Namaste%20${encodeURIComponent(selectedPatron.full_name)}%2C%20from%20Kusumika%20Atelier.`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container hover:bg-tertiary/20 text-tertiary text-xs font-semibold rounded-lg transition-colors border border-outline-variant/30"
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`tel:${selectedPatron.phone}`}
                  className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-outline hover:text-primary transition-colors border border-outline-variant/30"
                >
                  <span className="material-symbols-outlined text-[16px]">call</span>
                </a>
              </div>
            </div>

            {/* Patron Financials Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-sans">
              <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/30 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-outline">Total LTV</span>
                <p className="font-serif text-xl font-bold text-primary">
                  {formatPrice(selectedPatron.total_spent)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/30 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-outline">Total Orders</span>
                <p className="font-serif text-xl font-bold text-on-surface">
                  {selectedPatron.orders_count}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/30 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-outline">Loyalty Points</span>
                <p className="font-serif text-xl font-bold text-secondary">
                  {selectedPatron.loyalty_points}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/30 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-outline">Contact</span>
                <p className="text-on-surface font-mono text-[11px] truncate">
                  {selectedPatron.phone}
                </p>
              </div>
            </div>

            {selectedPatron.notes && (
              <div className="p-3.5 rounded-lg bg-surface-container border border-outline-variant/30 text-xs text-on-surface-variant flex items-start gap-2">
                <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">
                  notes
                </span>
                <p className="leading-relaxed">
                  <strong>Atelier Concierge Notes:</strong> {selectedPatron.notes}
                </p>
              </div>
            )}

            {/* Quick Touchpoint Composer */}
            <form onSubmit={handleAddTimelineNote} className="space-y-3 pt-2 border-t border-outline-variant/30">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-primary uppercase tracking-wider">
                  Log Concierge Touchpoint
                </label>
                <div className="flex items-center gap-2 text-xs">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="note_type"
                      checked={noteType === "internal_note"}
                      onChange={() => setNoteType("internal_note")}
                      className="accent-primary"
                    />
                    <span>Internal Note</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="note_type"
                      checked={noteType === "whatsapp"}
                      onChange={() => setNoteType("whatsapp")}
                      className="accent-primary"
                    />
                    <span>WhatsApp</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="note_type"
                      checked={noteType === "call"}
                      onChange={() => setNoteType("call")}
                      className="accent-primary"
                    />
                    <span>Phone Call</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Record interaction or preference (e.g. 'Customer prefers ivory satin finishes')..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 bg-surface-container-low text-xs px-3 py-2 rounded-lg border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold rounded-lg transition-colors shadow-sm"
                >
                  Post Note
                </button>
              </div>
            </form>

            {/* Interactive Timeline Stream */}
            <div className="space-y-4 pt-4 border-t border-outline-variant/30">
              <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Multi-Channel Interaction History
              </h3>

              <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-outline-variant/40">
                {selectedPatron.timeline.map((event) => {
                  const getIcon = () => {
                    switch (event.type) {
                      case "whatsapp":
                        return { icon: "chat", color: "text-tertiary bg-tertiary/10" };
                      case "otp_verified":
                        return { icon: "verified_user", color: "text-secondary bg-secondary/10" };
                      case "call":
                        return { icon: "call", color: "text-primary bg-primary/10" };
                      case "order":
                        return { icon: "shopping_bag", color: "text-primary bg-primary/10" };
                      default:
                        return { icon: "edit_note", color: "text-on-surface-variant bg-surface-container" };
                    }
                  };
                  const iconConfig = getIcon();

                  return (
                    <div key={event.id} className="relative flex items-start gap-3.5 text-xs font-sans pl-1">
                      <div
                        className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 border border-outline-variant/30",
                          iconConfig.color
                        )}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {iconConfig.icon}
                        </span>
                      </div>
                      <div className="flex-1 bg-surface-container-low p-3 rounded-lg border border-outline-variant/20 space-y-1">
                        <div className="flex items-center justify-between">
                          <strong className="text-on-surface font-semibold">{event.title}</strong>
                          <span className="text-[10px] text-outline font-mono">{event.timestamp}</span>
                        </div>
                        <p className="text-on-surface-variant leading-relaxed">{event.description}</p>
                        <div className="text-[10px] text-outline italic">By: {event.author}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 p-12 text-center text-outline text-xs">
            Select a patron from the left directory to view full history.
          </div>
        )}
      </div>
    </div>
  );
}
