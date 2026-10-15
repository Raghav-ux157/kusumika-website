"use client";

import React, { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { SupportTicket } from "@/types/admin";
import { cn } from "@/lib/utils";

const CANNED_RESPONSES = [
  {
    title: "Doorstep Inspection Guarantee",
    text: "Namaste. Kusumika offers a zero-risk doorstep inspection guarantee. When the BlueDart delivery executive arrives, you are warmly invited to examine the intact artisan wax seal and touch the organic weave before settling the balance due via Cash or dynamic UPI QR.",
  },
  {
    title: "Vegetable Indigo Washing Protocol",
    text: "Namaste. For authentic hand-block printed indigo, we advise cold water hand wash or gentle cycle for the first three washes with a teaspoon of rock salt or natural soapnuts to permanently lock the pure vegetable dye luster.",
  },
  {
    title: "Artisan Loom Slow Weaving Notice",
    text: "Namaste. Your linens are being woven on heirloom hand-looms in our Jaipur guild. Because we sun-cure all fabrics under natural desert sunlight, our artisanal cadence takes 2–3 additional days to ensure sovereign quality.",
  },
];

export default function AdminTicketsPage() {
  const { tickets, updateTicketStatus, addTicketMessage, showToast } = useAdmin();
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket>(tickets[0]);
  const [replyMessage, setReplyMessage] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTickets = tickets.filter((t) => {
    const matchesPriority = priorityFilter === "all" || t.priority === priorityFilter;
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesPriority && matchesStatus;
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;

    addTicketMessage(selectedTicket.id, replyMessage);
    setReplyMessage("");
  };

  const handleInsertCanned = (text: string) => {
    setReplyMessage(text);
  };

  return (
    <div className="px-4 sm:px-8 py-6 space-y-6 max-w-[1700px] mx-auto">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30 text-xs">
        <div className="flex items-center gap-2 uppercase tracking-widest text-on-surface-variant font-semibold">
          <span>Patron Concierge</span>
          <span className="text-outline">/</span>
          <span className="text-primary">Support & Care Inbox</span>
        </div>
        <span className="text-outline">Avg Response SLA: 18 mins</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-primary font-normal tracking-tight">
            Support & Patron Care Tickets
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Resolve delivery inquiries, doorstep inspection questions, and bespoke embroidery requests.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-outline">Open Tickets</span>
          <p className="font-serif text-3xl font-bold text-primary">
            {tickets.filter((t) => t.status === "open").length}
          </p>
          <span className="text-[11px] text-on-surface-variant">Requires initial reply</span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-outline">In Progress</span>
          <p className="font-serif text-3xl font-bold text-secondary">
            {tickets.filter((t) => t.status === "in_progress").length}
          </p>
          <span className="text-[11px] text-on-surface-variant">Being curated by concierge</span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-outline">Resolved Today</span>
          <p className="font-serif text-3xl font-bold text-tertiary">
            {tickets.filter((t) => t.status === "resolved").length + 12}
          </p>
          <span className="text-[11px] text-tertiary font-bold">100% CSAT Satisfaction</span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-outline">Avg Response Time</span>
          <p className="font-serif text-3xl font-bold text-on-surface">18 Mins</p>
          <span className="text-[11px] text-tertiary font-medium">Faster than 30m target</span>
        </div>
      </div>

      {/* Main Inbox Workspace: List on Left (5 cols) & Thread on Right (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Tickets Queue (5 cols) */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30 text-xs">
            <span className="font-bold text-on-surface uppercase tracking-wider">Tickets Queue</span>
            <div className="flex items-center gap-1.5">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-surface-container-low text-[11px] font-semibold px-2 py-1 rounded border border-outline-variant/30"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 max-h-[650px] overflow-y-auto pr-1">
            {filteredTickets.map((ticket) => {
              const isSelected = selectedTicket?.id === ticket.id;
              const priorityColors: Record<string, string> = {
                urgent: "bg-red-100 text-red-800 border-red-200",
                high: "bg-amber-100 text-amber-800 border-amber-200",
                medium: "bg-surface-container text-on-surface border-outline-variant/40",
                low: "bg-surface-dim text-outline border-outline-variant/30",
              };

              return (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={cn(
                    "p-3.5 rounded-xl border transition-all cursor-pointer space-y-2",
                    isSelected
                      ? "bg-surface-container-high border-primary/40 shadow-sm"
                      : "bg-surface hover:bg-surface-container-low border-outline-variant/30"
                  )}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono font-bold text-primary">{ticket.ticket_number}</span>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
                        priorityColors[ticket.priority] || "bg-surface text-outline"
                      )}
                    >
                      {ticket.priority}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-serif text-sm font-semibold text-on-surface line-clamp-1">
                      {ticket.subject}
                    </h4>
                    <p className="text-[11px] text-outline mt-0.5">
                      {ticket.customer_name} {ticket.order_number && `• Order #${ticket.order_number}`}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] pt-1 border-t border-outline-variant/20 text-on-surface-variant">
                    <span className="font-medium text-secondary">{ticket.category}</span>
                    <span className="capitalize font-semibold">{ticket.status.replace("_", " ")}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Ticket Conversation & Canned Response Drawer (7 cols) */}
        {selectedTicket ? (
          <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-6 sm:p-8 space-y-6">
            {/* Ticket Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-outline-variant/30">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-primary">
                    {selectedTicket.ticket_number}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-surface-container text-secondary">
                    {selectedTicket.category}
                  </span>
                </div>
                <h2 className="font-serif text-2xl text-primary font-medium">
                  {selectedTicket.subject}
                </h2>
                <p className="text-xs text-on-surface-variant">
                  From: <strong>{selectedTicket.customer_name}</strong> ({selectedTicket.customer_phone}) • {selectedTicket.customer_email}
                </p>
              </div>

              {/* Status Selector */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-outline font-semibold">Status:</span>
                <select
                  value={selectedTicket.status}
                  onChange={(e) => updateTicketStatus(selectedTicket.id, e.target.value as any)}
                  className="bg-surface-container-low text-xs font-bold text-primary px-3 py-1.5 rounded-lg border border-outline-variant/30 cursor-pointer"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="waiting_on_customer">Waiting on Customer</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            {/* Conversation Messages */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {selectedTicket.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "p-4 rounded-xl text-xs space-y-1.5 max-w-xl",
                    msg.sender_type === "customer"
                      ? "bg-surface-container-low border border-outline-variant/30 mr-auto"
                      : "bg-surface-container border border-primary/20 ml-auto"
                  )}
                >
                  <div className="flex items-center justify-between font-semibold text-[11px] text-on-surface">
                    <span className={msg.sender_type === "staff" ? "text-primary font-bold" : "text-on-surface"}>
                      {msg.sender}
                    </span>
                    <span className="text-outline text-[10px] font-mono">{msg.timestamp}</span>
                  </div>
                  <p className="text-on-surface-variant leading-relaxed">{msg.message}</p>
                </div>
              ))}
            </div>

            {/* Canned Responses Quick Select */}
            <div className="space-y-2 pt-2 border-t border-outline-variant/30">
              <span className="text-[10px] uppercase font-bold text-outline">
                Atelier Concierge Canned Templates
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                {CANNED_RESPONSES.map((cr, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleInsertCanned(cr.text)}
                    className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high rounded text-[11px] text-primary font-medium transition-colors border border-outline-variant/30"
                  >
                    + {cr.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Reply Composer */}
            <form onSubmit={handleSendReply} className="space-y-3">
              <textarea
                rows={3}
                placeholder="Type response to patron..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="w-full bg-surface-container-low p-3 rounded-xl border border-outline-variant/30 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
              />

              <div className="flex items-center justify-between">
                <a
                  href={`https://wa.me/${selectedTicket.customer_phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-tertiary font-semibold hover:underline"
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  <span>Open WhatsApp Thread</span>
                </a>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      updateTicketStatus(selectedTicket.id, "resolved");
                      showToast(`Ticket #${selectedTicket.ticket_number} marked as resolved.`);
                    }}
                    className="px-3.5 py-2 bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface rounded-lg transition-colors border border-outline-variant/30"
                  >
                    Mark Resolved
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold rounded-lg shadow-sm transition-colors"
                  >
                    Send Reply
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="lg:col-span-7 p-12 text-center text-outline text-xs">
            Select a ticket from the left queue to view messages.
          </div>
        )}
      </div>
    </div>
  );
}
