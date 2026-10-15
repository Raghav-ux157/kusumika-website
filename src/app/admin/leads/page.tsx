"use client";

import React, { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { LeadStage, B2BLead } from "@/types/admin";
import { formatPrice, cn } from "@/lib/utils";

const STAGES: Array<{ id: LeadStage; title: string; color: string; badgeBg: string }> = [
  { id: "new", title: "New Inquiries", color: "bg-secondary", badgeBg: "bg-secondary/15 text-secondary" },
  { id: "contacted", title: "Contacted / Swatch", color: "bg-tertiary", badgeBg: "bg-tertiary/15 text-tertiary" },
  { id: "quote_sent", title: "Quote Issued", color: "bg-amber-600", badgeBg: "bg-amber-100 text-amber-800" },
  { id: "converted", title: "Closed Won", color: "bg-primary", badgeBg: "bg-primary-container text-on-primary" },
  { id: "lost", title: "Archived Lost", color: "bg-outline", badgeBg: "bg-surface-container-highest text-outline" },
];

export default function LeadsKanbanPage() {
  const { leads, updateLeadStatus, addLead, showToast } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [clusterFilter, setClusterFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newLeadForm, setNewLeadForm] = useState({
    business_name: "",
    contact_name: "",
    phone: "",
    email: "",
    city: "Jaipur",
    establishment_nature: "Boutique Hotel",
    quantity_tier: "30 King Sheet Sets",
    weave_grade: "400TC Organic Sateen",
    proposed_value: 280000,
    notes: "",
  });

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.inquiry_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCluster = clusterFilter === "all" || lead.cluster.includes(clusterFilter);
    return matchesSearch && matchesCluster;
  });

  const totalPipeline = leads
    .filter((l) => l.status !== "lost")
    .reduce((sum, l) => sum + (l.proposed_value || 0), 0);

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.business_name || !newLeadForm.contact_name) return;

    addLead({
      business_name: newLeadForm.business_name,
      contact_name: newLeadForm.contact_name,
      phone: newLeadForm.phone,
      email: newLeadForm.email,
      city: newLeadForm.city,
      establishment_nature: newLeadForm.establishment_nature,
      quantity_tier: newLeadForm.quantity_tier,
      weave_grade: newLeadForm.weave_grade,
      proposed_value: Number(newLeadForm.proposed_value),
      notes: newLeadForm.notes,
    });

    setNewLeadForm({
      business_name: "",
      contact_name: "",
      phone: "",
      email: "",
      city: "Jaipur",
      establishment_nature: "Boutique Hotel",
      quantity_tier: "30 King Sheet Sets",
      weave_grade: "400TC Organic Sateen",
      proposed_value: 280000,
      notes: "",
    });
    setIsModalOpen(false);
  };

  return (
    <div className="px-4 sm:px-8 py-6 space-y-6 max-w-[1700px] mx-auto">
      {/* Top Breadcrumb & Metadata Ribbon */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-outline-variant/30">
        <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
          <span className="flex items-center gap-1 text-outline">
            <span className="material-symbols-outlined text-[16px]">corporate_fare</span>
            CRM
          </span>
          <span className="text-outline">/</span>
          <span className="text-on-surface font-semibold tracking-wide">
            Hotel & Bulk Inquiries Pipeline
          </span>
          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-tertiary/15 text-tertiary">
            Q4 Active Cycle
          </span>
        </div>

        {/* Quick Metrics Summary Bar */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-sans bg-surface-container-low px-4 py-2 rounded-lg border border-outline-variant/30">
          <div className="flex items-center gap-1.5">
            <span className="text-outline text-[11px] uppercase tracking-wider font-semibold">
              Total Pipeline:
            </span>
            <span className="font-serif text-sm text-primary font-bold">
              {formatPrice(totalPipeline)}
            </span>
          </div>
          <div className="h-4 w-[1px] bg-outline-variant/50 hidden sm:block" />
          <div className="flex items-center gap-1.5">
            <span className="text-outline text-[11px] uppercase tracking-wider font-semibold">
              Active Deals:
            </span>
            <span className="font-bold text-on-surface">{leads.length} Accounts</span>
          </div>
          <div className="h-4 w-[1px] bg-outline-variant/50 hidden sm:block" />
          <div className="flex items-center gap-1.5">
            <span className="text-outline text-[11px] uppercase tracking-wider font-semibold">
              Win Rate:
            </span>
            <span className="font-bold text-tertiary">78.4%</span>
          </div>
        </div>
      </div>

      {/* Title & Primary Action Controls */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-serif text-3xl sm:text-4xl text-primary font-normal tracking-tight">
              Bulk Orders & Hotel Deals Pipeline
            </h1>
            <span
              className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-surface-container text-primary"
              title="GOTS Certified Slow Textiles"
            >
              <span className="material-symbols-outlined text-[16px]">verified</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Track active inquiries worth <strong className="text-primary">{formatPrice(totalPipeline)}</strong> from boutique hotels, corporate gifting clients, and haveli architects.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Switcher */}
          <div className="inline-flex bg-surface-container p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                viewMode === "kanban"
                  ? "bg-surface-container-lowest text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">view_kanban</span>
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                viewMode === "table"
                  ? "bg-surface-container-lowest text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">table_rows</span>
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold rounded-lg shadow-sm transition-all uppercase tracking-wider"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span>Add New Lead</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
            search
          </span>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container-low text-on-surface placeholder:text-outline text-xs pl-9 pr-3 py-2 rounded-lg border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Search lead property, contact person, city, or inquiry ID..."
            type="text"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={clusterFilter}
            onChange={(e) => setClusterFilter(e.target.value)}
            className="bg-surface-container-low text-on-surface text-xs font-semibold px-3 py-2 rounded-lg border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Weaving Clusters</option>
            <option value="Sanganer">Sanganer Hand-Block</option>
            <option value="Bagru">Bagru Mud-Resist</option>
            <option value="Barmer">Barmer Heritage Quilt</option>
          </select>
        </div>
      </div>

      {/* KANBAN BOARD VIEW (5 COLUMNS) */}
      {viewMode === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-start w-full">
          {STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.status === stage.id);
            const stageTotal = stageLeads.reduce((sum, l) => sum + (l.proposed_value || 0), 0);

            return (
              <div
                key={stage.id}
                className="flex flex-col bg-surface-container-low/60 rounded-xl p-3 border border-outline-variant/30 shadow-sm min-w-0 space-y-3"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    <span className={cn("w-2.5 h-2.5 rounded-full", stage.color)} />
                    <h3 className="font-serif text-sm font-semibold text-on-surface">
                      {stage.title}
                    </h3>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-surface-container-highest text-on-surface">
                      {stageLeads.length}
                    </span>
                  </div>
                  <span className="text-xs font-serif font-bold text-primary">
                    {formatPrice(stageTotal)}
                  </span>
                </div>

                {/* Cards Stream */}
                <div className="flex flex-col gap-3 min-h-[150px]">
                  {stageLeads.length === 0 ? (
                    <div className="p-4 text-center text-outline text-[11px] italic bg-surface-container/30 rounded-lg">
                      No inquiries in this stage
                    </div>
                  ) : (
                    stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="bg-surface-container-lowest p-3.5 rounded-lg border border-outline-variant/30 shadow-sm hover:shadow-md transition-all flex flex-col gap-2.5 group"
                      >
                        {/* ID & Urgency */}
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono text-outline font-semibold">
                            {lead.inquiry_number}
                          </span>
                          {lead.urgency && (
                            <span className="text-[10px] font-bold text-secondary bg-surface-container px-2 py-0.5 rounded">
                              {lead.urgency}
                            </span>
                          )}
                        </div>

                        {/* Title & Organization */}
                        <div>
                          <h4 className="font-serif text-sm font-medium text-primary group-hover:text-primary-container leading-snug">
                            {lead.business_name}
                          </h4>
                          <p className="text-[11px] text-on-surface-variant flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-[13px]">location_on</span>
                            <span>{lead.city} • {lead.contact_name}</span>
                          </p>
                        </div>

                        {/* Proposed Value & Craft */}
                        <div className="flex items-baseline justify-between py-1 border-y border-outline-variant/20 text-xs">
                          <div>
                            <span className="text-[10px] text-outline block uppercase tracking-wider">
                              Pipeline Value
                            </span>
                            <span className="font-serif font-bold text-on-surface">
                              {formatPrice(lead.proposed_value)}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-outline block uppercase tracking-wider">
                              Cluster
                            </span>
                            <span className="text-[11px] font-semibold text-tertiary">
                              {lead.cluster.split(" ")[0]}
                            </span>
                          </div>
                        </div>

                        {/* Notes snippet */}
                        {lead.notes && (
                          <p className="text-[11px] text-on-surface-variant italic line-clamp-2 bg-surface-container-low/80 p-2 rounded">
                            “{lead.notes}”
                          </p>
                        )}

                        {/* Lost Reason alert */}
                        {lead.status === "lost" && lead.lost_reason && (
                          <div className="p-2 rounded bg-red-50 text-[10px] text-red-900 border-l-2 border-red-500">
                            <strong>Reason:</strong> {lead.lost_reason}
                          </div>
                        )}

                        {/* Advance Stage Control */}
                        <div className="pt-1 flex items-center justify-between border-t border-outline-variant/20 text-xs">
                          <select
                            value={lead.status}
                            onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStage)}
                            className="text-[10px] font-semibold bg-surface-container-low px-2 py-1 rounded border border-outline-variant/30 text-primary cursor-pointer"
                          >
                            <option value="new">Move: New</option>
                            <option value="contacted">Move: Contacted</option>
                            <option value="quote_sent">Move: Quote Sent</option>
                            <option value="converted">Move: Closed Won</option>
                            <option value="lost">Move: Closed Lost</option>
                          </select>

                          <div className="flex items-center gap-1">
                            <a
                              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=Namaste%20${encodeURIComponent(lead.contact_name)}%2C%20regarding%20your%20inquiry%20for%20${encodeURIComponent(lead.business_name)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="w-6 h-6 rounded bg-surface-container hover:bg-tertiary/20 flex items-center justify-center text-tertiary transition-colors"
                              title="Message via WhatsApp"
                            >
                              <span className="material-symbols-outlined text-[14px]">chat</span>
                            </a>
                            <a
                              href={`tel:${lead.phone}`}
                              className="w-6 h-6 rounded bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-outline hover:text-primary transition-colors"
                              title="Call Patron"
                            >
                              <span className="material-symbols-outlined text-[14px]">call</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="bg-surface-container-low text-on-surface uppercase tracking-wider border-b border-outline-variant/30">
                  <th className="py-3 px-4 font-semibold">Inquiry ID</th>
                  <th className="py-3 px-4 font-semibold">Property / Business</th>
                  <th className="py-3 px-4 font-semibold">Contact & Phone</th>
                  <th className="py-3 px-4 font-semibold">Weave & Tier</th>
                  <th className="py-3 px-4 font-semibold text-right">Value</th>
                  <th className="py-3 px-4 font-semibold">Stage</th>
                  <th className="py-3 px-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-primary">
                      {lead.inquiry_number}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-on-surface">{lead.business_name}</div>
                      <div className="text-[11px] text-outline">{lead.city} • {lead.establishment_nature}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div>{lead.contact_name}</div>
                      <div className="text-[11px] text-outline font-mono">{lead.phone}</div>
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant">
                      <div>{lead.quantity_tier}</div>
                      <div className="text-[11px] text-tertiary">{lead.cluster}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-serif font-bold text-on-surface">
                      {formatPrice(lead.proposed_value)}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStage)}
                        className="text-[11px] font-semibold bg-surface-container-low px-2 py-1 rounded border border-outline-variant/30 text-primary cursor-pointer"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="quote_sent">Quote Sent</option>
                        <option value="converted">Closed Won</option>
                        <option value="lost">Closed Lost</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <a
                          href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 rounded hover:bg-surface-container text-tertiary"
                        >
                          <span className="material-symbols-outlined text-[16px]">chat</span>
                        </a>
                        <a
                          href={`tel:${lead.phone}`}
                          className="p-1 rounded hover:bg-surface-container text-outline hover:text-primary"
                        >
                          <span className="material-symbols-outlined text-[16px]">call</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE NEW LEAD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl p-6 sm:p-8 shadow-2xl border border-outline-variant/40 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <h3 className="font-serif text-2xl text-primary font-normal">
                New Hospitality & Trade Inquiry
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-outline hover:text-primary p-1">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-on-surface">Property / Hotel Name *</label>
                  <input
                    required
                    placeholder="e.g. Alila Fort Bishangarh"
                    value={newLeadForm.business_name}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, business_name: e.target.value })}
                    className="w-full bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/40 focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-on-surface">Contact Person *</label>
                  <input
                    required
                    placeholder="e.g. Colonel R.K. Rathore"
                    value={newLeadForm.contact_name}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, contact_name: e.target.value })}
                    className="w-full bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/40 focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-on-surface">Phone (+91) *</label>
                  <input
                    required
                    placeholder="+91 98290 55667"
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    className="w-full bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/40 focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-on-surface">Email Address</label>
                  <input
                    type="email"
                    placeholder="operations@alilahotels.com"
                    value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    className="w-full bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/40 focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-on-surface">Destination City</label>
                  <input
                    placeholder="e.g. Jaipur"
                    value={newLeadForm.city}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, city: e.target.value })}
                    className="w-full bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/40 focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-on-surface">Estimated Pipeline Value (INR)</label>
                  <input
                    type="number"
                    value={newLeadForm.proposed_value}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, proposed_value: Number(e.target.value) })}
                    className="w-full bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/40 focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-on-surface">Notes / Weave Requirements</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Requires 50 King sets in 400TC cambric with haveli crest."
                  value={newLeadForm.notes}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                  className="w-full bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/40 focus:ring-1 focus:ring-primary focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-outline hover:text-on-surface font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-semibold shadow-sm"
                >
                  Create & Ingest Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
