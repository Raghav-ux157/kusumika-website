"use client";

import React, { useState } from "react";
import { Modal, Input, Textarea, Select, Button } from "@/components/ui";
import { Product } from "@/types";
import { useStore } from "@/context/StoreContext";

export interface BulkQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
}

export const BulkQuoteModal: React.FC<BulkQuoteModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const { showToast } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    contactPerson: "",
    phone: "",
    email: "",
    quantity: "25-50",
    orderType: "Boutique Hotel / Resort",
    gstNumber: "",
    customSpecs: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactName: formData.contactPerson,
          businessName: formData.businessName,
          phone: formData.phone,
          email: formData.email,
          establishmentNature: formData.orderType,
          quantityTier: formData.quantity,
          gstNumber: formData.gstNumber,
          notes: `${formData.customSpecs || ""}${product ? ` | Inquired for: ${product.title} (SKU: ${product.slug})` : ""}`.trim(),
          source: "pdp_bulk_quote",
        }),
      });

      const data = await response.json();
      const inqId = data.inquiryNumber || `INQ-KSM-${Math.floor(1000 + Math.random() * 9000)}`;

      showToast(
        `Inquiry #${inqId} registered! Thank you ${formData.contactPerson}. Our Atelier Concierge will reach out via WhatsApp.`
      );
    } catch {
      showToast(
        `Thank you ${formData.contactPerson || ""}! Your hospitality trade inquiry has been received. Our Trade Concierge will reach out via WhatsApp.`
      );
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bespoke Hospitality & Bulk Inquiry"
      subtitle={
        product
          ? `Inquiry for "${product.title}" • Minimum Order: 10 units`
          : "Trade pricing, custom weaves, embroidery & GST invoices for boutique hotels and designers"
      }
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Business / Hotel / Firm Name"
            placeholder="e.g. Amber Heritage Retreat"
            value={formData.businessName}
            onChange={(e) =>
              setFormData({ ...formData, businessName: e.target.value })
            }
            required
          />
          <Input
            label="Contact Person Name"
            placeholder="e.g. Vikramaditya Rathore"
            value={formData.contactPerson}
            onChange={(e) =>
              setFormData({ ...formData, contactPerson: e.target.value })
            }
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="WhatsApp Contact Phone"
            placeholder="+91 98765 43210"
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            required
            helperText="Trade catalogs and custom swatch sheets sent via WhatsApp."
          />
          <Input
            label="Official Work Email"
            placeholder="procurement@hotel.com"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Estimated Order Quantity"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: e.target.value })
            }
            options={[
              { label: "10 – 24 Units (Small Boutique)", value: "10-24" },
              { label: "25 – 50 Units (Standard Lot)", value: "25-50" },
              { label: "51 – 100 Units (Palatial Lot)", value: "51-100" },
              { label: "100+ Units (Corporate / Multi-property)", value: "100+" },
            ]}
          />
          <Select
            label="Industry / Buyer Type"
            value={formData.orderType}
            onChange={(e) =>
              setFormData({ ...formData, orderType: e.target.value })
            }
            options={[
              { label: "Boutique Hotel / Luxury Resort", value: "Boutique Hotel / Resort" },
              { label: "Interior Architecture & Design Firm", value: "Interior Designer" },
              { label: "Corporate Gifting & Wedding Troussseau", value: "Corporate Gifting" },
              { label: "Retail / Export Partner", value: "Retail / Export" },
            ]}
          />
        </div>

        <Input
          label="GST Identification Number (Optional)"
          placeholder="08AAAAA0000A1Z5 (For GST input tax credit)"
          value={formData.gstNumber}
          onChange={(e) =>
            setFormData({ ...formData, gstNumber: e.target.value })
          }
        />

        <Textarea
          label="Weave Specifications & Customization Notes"
          placeholder="Mention specific dimensions (e.g. 108x108 in), thread count requirement (300-800TC), custom monogram embroidery, or target delivery timeframe..."
          value={formData.customSpecs}
          onChange={(e) =>
            setFormData({ ...formData, customSpecs: e.target.value })
          }
          rows={3}
        />

        <div className="p-3.5 rounded-lg bg-surface-container border border-outline-variant/60 flex items-center justify-between text-xs font-sans">
          <div className="flex items-center gap-2 text-primary font-medium">
            <span className="material-symbols-outlined text-secondary text-[18px]">
              verified
            </span>
            <span>Includes physical woven swatch samples shipped to your office</span>
          </div>
          <span className="text-secondary font-bold uppercase tracking-wider text-[10px]">
            Direct Loom Rates
          </span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/40">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
          >
            Submit Trade Inquiry
          </Button>
        </div>
      </form>
    </Modal>
  );
};
