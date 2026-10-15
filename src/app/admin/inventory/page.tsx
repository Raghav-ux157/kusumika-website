"use client";

import React, { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { InventoryItem } from "@/types/admin";
import { cn } from "@/lib/utils";

export default function AdminInventoryPage() {
  const { inventory, updateStock, showToast } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [godownFilter, setGodownFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(5);
  const [adjustReason, setAdjustReason] = useState("New Loom Batch Received");

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.product_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.weave_batch.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGodown = godownFilter === "all" || item.godown.includes(godownFilter);
    return matchesSearch && matchesGodown;
  });

  const totalInStock = inventory.reduce((sum, item) => sum + item.in_stock, 0);
  const lowStockItems = inventory.filter((item) => item.available <= item.reorder_level);

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    updateStock(selectedItem.sku, adjustAmount, adjustReason);
    setSelectedItem(null);
  };

  return (
    <div className="px-4 sm:px-8 py-6 space-y-6 max-w-[1700px] mx-auto">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30 text-xs">
        <div className="flex items-center gap-2 uppercase tracking-widest text-on-surface-variant font-semibold">
          <span>Supply Chain</span>
          <span className="text-outline">/</span>
          <span className="text-primary">Godown Stock & Loom Batches</span>
        </div>
        <span className="text-outline">Updated: Just now across 3 Godowns</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-primary font-normal tracking-tight">
            Inventory & Godown Stock
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Real-time finished goods inventory across Jaipur Central, Sanganer, and Bagru depot hubs.
          </p>
        </div>

        <button
          onClick={() => {
            showToast("Syncing RFID stock counts with physical Godowns...");
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold rounded-lg shadow-sm border border-outline-variant/30 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px] text-primary">sync</span>
          <span>Reconcile Godown Stock</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-outline text-[10px] uppercase font-semibold">
            <span>Total Units in Stock</span>
            <span className="material-symbols-outlined text-primary text-[18px]">inventory_2</span>
          </div>
          <div className="font-serif text-3xl font-bold text-on-surface">{totalInStock} Sets</div>
          <p className="text-[11px] text-on-surface-variant">Across 3 regional ateliers</p>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-outline text-[10px] uppercase font-semibold">
            <span>Loom WIP (Being Woven)</span>
            <span className="material-symbols-outlined text-secondary text-[18px]">precision_manufacturing</span>
          </div>
          <div className="font-serif text-3xl font-bold text-secondary">118 Units</div>
          <p className="text-[11px] text-on-surface-variant">Scheduled for QC inspection</p>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-outline text-[10px] uppercase font-semibold">
            <span>Low Stock Warnings</span>
            <span className="material-symbols-outlined text-red-600 text-[18px]">warning</span>
          </div>
          <div className="font-serif text-3xl font-bold text-red-700">{lowStockItems.length} SKUs</div>
          <p className="text-[11px] text-red-600 font-medium">Below reorder threshold</p>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-outline text-[10px] uppercase font-semibold">
            <span>Raw Organic Yardage</span>
            <span className="material-symbols-outlined text-tertiary text-[18px]">straighten</span>
          </div>
          <div className="font-serif text-3xl font-bold text-tertiary">4,850 Mtr</div>
          <p className="text-[11px] text-on-surface-variant">100% GOTS organic cotton</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
            search
          </span>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container-low text-on-surface placeholder:text-outline text-xs pl-9 pr-3 py-2 rounded-lg border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Search SKU (KSM-...), Product Title, or Weave Batch..."
            type="text"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={godownFilter}
            onChange={(e) => setGodownFilter(e.target.value)}
            className="bg-surface-container-low text-on-surface text-xs font-semibold px-3 py-2 rounded-lg border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Godown Locations</option>
            <option value="Jaipur Central">Jaipur Central Atelier</option>
            <option value="Sanganer">Sanganer Cluster Hub</option>
            <option value="Bagru">Bagru Mud-Resist Depot</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="bg-surface-container-low text-on-surface uppercase tracking-wider border-b border-outline-variant/30 select-none">
                <th className="py-3 px-4 font-semibold">SKU Code</th>
                <th className="py-3 px-4 font-semibold">Product Title & Size</th>
                <th className="py-3 px-4 font-semibold">Godown Hub</th>
                <th className="py-3 px-4 font-semibold text-center">In Stock</th>
                <th className="py-3 px-4 font-semibold text-center">Reserved</th>
                <th className="py-3 px-4 font-semibold text-center">Available</th>
                <th className="py-3 px-4 font-semibold">Loom Batch</th>
                <th className="py-3 px-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filteredInventory.map((item) => {
                const isLow = item.available <= item.reorder_level;
                return (
                  <tr key={item.id} className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-primary">
                      {item.sku}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-on-surface">{item.product_title}</div>
                      <div className="text-[11px] text-outline">Size: {item.variant_size}</div>
                    </td>

                    <td className="py-3 px-4 text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-tertiary">warehouse</span>
                        <span>{item.godown}</span>
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center font-bold text-on-surface">
                      {item.in_stock}
                    </td>

                    <td className="py-3 px-4 text-center text-outline">
                      {item.reserved}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-full font-bold text-xs inline-block",
                          isLow
                            ? "bg-red-100 text-red-800 animate-pulse"
                            : "bg-tertiary/15 text-tertiary"
                        )}
                      >
                        {item.available}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-mono text-[11px] text-on-surface font-semibold">{item.weave_batch}</div>
                      <div className="text-[10px] text-outline">Last: {item.last_replenished}</div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high text-primary font-semibold rounded-lg text-xs transition-colors border border-outline-variant/30"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADJUST STOCK MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl p-6 sm:p-8 shadow-2xl border border-outline-variant/40 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-outline">Stock Adjustment</span>
                <h3 className="font-serif text-xl text-primary font-medium">{selectedItem.product_title}</h3>
              </div>
              <button onClick={() => setSelectedItem(null)} className="text-outline hover:text-primary p-1">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-4 text-xs font-sans">
              <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/30 flex justify-between">
                <div>
                  <span className="text-outline text-[10px] uppercase">SKU</span>
                  <p className="font-mono font-bold text-primary">{selectedItem.sku}</p>
                </div>
                <div className="text-right">
                  <span className="text-outline text-[10px] uppercase">Current Available</span>
                  <p className="font-serif font-bold text-on-surface text-base">{selectedItem.available} Units</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-on-surface">Units to Add or Deduct (Use - for deductions)</label>
                <input
                  type="number"
                  required
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(Number(e.target.value))}
                  className="w-full bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/30 focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-on-surface">Adjustment Rationale</label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/30 focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer"
                >
                  <option value="New Loom Batch Received">New Loom Batch Received</option>
                  <option value="Physical Audit Discrepancy">Physical Audit Discrepancy</option>
                  <option value="QC Damage Quarantine">QC Damage Quarantine</option>
                  <option value="Swatch Sample Cut">Swatch Sample Cut</option>
                  <option value="Hotel Commission Reservation">Hotel Commission Reservation</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 rounded-lg text-outline hover:text-on-surface font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-semibold shadow-sm"
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
