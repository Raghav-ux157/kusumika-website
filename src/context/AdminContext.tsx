"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  StaffRole,
  LeadStage,
  B2BLead,
  AdminOrder,
  PatronProfile,
  InventoryItem,
  SupportTicket,
  AbandonedCart,
} from "@/types/admin";
import {
  MOCK_LEADS,
  MOCK_ADMIN_ORDERS,
  MOCK_PATRONS,
  MOCK_INVENTORY,
  MOCK_TICKETS,
  MOCK_ABANDONED_CARTS,
} from "@/lib/mockAdminData";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

interface AdminContextType {
  activeRole: StaffRole;
  setActiveRole: (role: StaffRole) => void;
  hasAccess: (module: string) => boolean;

  // Cluster Filter
  selectedCluster: string;
  setSelectedCluster: (cluster: string) => void;

  // Leads Module
  leads: B2BLead[];
  updateLeadStatus: (leadId: string, status: LeadStage) => void;
  addLead: (lead: Partial<B2BLead>) => void;

  // Orders Module
  orders: AdminOrder[];
  updateOrderStatus: (orderId: string, status: AdminOrder["status"]) => void;
  markCodBalanceCollected: (orderId: string, method: "cash" | "upi") => void;

  // Patrons Module
  patrons: PatronProfile[];
  addPatronTimelineEvent: (
    patronId: string,
    event: { type: any; title: string; description: string; author: string }
  ) => void;

  // Inventory Module
  inventory: InventoryItem[];
  updateStock: (sku: string, delta: number, reason: string) => void;

  // Tickets Module
  tickets: SupportTicket[];
  updateTicketStatus: (ticketId: string, status: SupportTicket["status"]) => void;
  addTicketMessage: (ticketId: string, message: string) => void;

  // Abandoned Carts Module
  abandonedCarts: AbandonedCart[];
  sendCartNudge: (cartId: string) => void;
  markCartRecovered: (cartId: string) => void;

  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [activeRole, setActiveRoleState] = useState<StaffRole>("admin");
  const [selectedCluster, setSelectedCluster] = useState<string>("All Clusters: Sanganer, Bagru, Jaipur");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [leads, setLeads] = useState<B2BLead[]>(MOCK_LEADS);
  const [orders, setOrders] = useState<AdminOrder[]>(MOCK_ADMIN_ORDERS);
  const [patrons, setPatrons] = useState<PatronProfile[]>(MOCK_PATRONS);
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [tickets, setTickets] = useState<SupportTicket[]>(MOCK_TICKETS);
  const [abandonedCarts, setAbandonedCarts] = useState<AbandonedCart[]>(MOCK_ABANDONED_CARTS);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const setActiveRole = (role: StaffRole) => {
    setActiveRoleState(role);
    if (typeof window !== "undefined") {
      localStorage.setItem("kusumika_admin_role", role);
    }
    const roleLabels: Record<StaffRole, string> = {
      admin: "Administrator (Full Atelier Access)",
      sales: "Sales & Concierge (Pipeline & Leads)",
      support: "Support & Patron Care (Tickets & Dossiers)",
      warehouse: "Warehouse & Dispatch (Consignments & Stock)",
    };
    showToast(`Switched active persona to ${roleLabels[role]}`);
  };

  // Load from localStorage or Supabase on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedRole = localStorage.getItem("kusumika_admin_role") as StaffRole;
    if (savedRole && ["admin", "sales", "support", "warehouse"].includes(savedRole)) {
      setActiveRoleState(savedRole);
    }

    const savedLeads = localStorage.getItem("kusumika_admin_leads");
    if (savedLeads) {
      try {
        setLeads(JSON.parse(savedLeads));
      } catch {}
    }

    const savedOrders = localStorage.getItem("kusumika_admin_orders");
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch {}
    }

    // Attempt to sync live leads from Supabase if active
    const supabase: any = getSupabaseBrowserClient();
    if (supabase) {
      (async () => {
        try {
          const { data: dbLeads } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
          if (dbLeads && dbLeads.length > 0) {
            const mappedDbLeads: B2BLead[] = dbLeads.map((dl: any) => ({
              id: dl.id,
              inquiry_number: dl.inquiry_number,
              contact_name: dl.contact_name,
              business_name: dl.business_name,
              establishment_nature: dl.establishment_nature,
              email: dl.email,
              phone: dl.phone,
              city: dl.city,
              pincode: dl.pincode,
              gstin: dl.gstin,
              categories_needed: dl.categories_needed || [],
              weave_grade: dl.weave_grade,
              quantity_tier: dl.quantity_tier,
              bed_sizes: dl.bed_sizes || [],
              branding_option: dl.branding_option,
              timeline: dl.timeline,
              notes: dl.notes,
              swatch_binder_requested: dl.swatch_binder_requested || false,
              status: dl.status as LeadStage,
              proposed_value: 250000,
              cluster: "Sanganer Hand-Block",
              assignee: { name: "Arvind Oberoi", initials: "AO", avatarColor: "bg-primary-container" },
              tags: ["Web Ingest", "Hospitality"],
              created_at: dl.created_at,
              updated_at: dl.updated_at,
            }));

            // Combine with mock leads avoiding duplicate inquiry numbers
            setLeads((prev) => {
              const existingInquiries = new Set(mappedDbLeads.map((l) => l.inquiry_number));
              const combined = [...mappedDbLeads, ...prev.filter((l) => !existingInquiries.has(l.inquiry_number))];
              return combined;
            });
          }
        } catch (e) {
          console.warn("Supabase CRM leads sync notice:", e);
        }
      })();
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("kusumika_admin_leads", JSON.stringify(leads));
      localStorage.setItem("kusumika_admin_orders", JSON.stringify(orders));
    }
  }, [leads, orders]);

  // Role Access Matrix
  const hasAccess = (module: string): boolean => {
    if (activeRole === "admin") return true;

    switch (module) {
      case "overview":
        return true;
      case "leads":
        return activeRole === "sales";
      case "orders":
        return activeRole === "sales" || activeRole === "warehouse" || activeRole === "support";
      case "customers":
        return activeRole === "sales" || activeRole === "support";
      case "inventory":
        return activeRole === "warehouse";
      case "tickets":
        return activeRole === "support";
      case "abandoned-carts":
        return activeRole === "sales";
      case "reports":
        return false; // Admin only
      case "settings":
        return false; // Admin only
      default:
        return false;
    }
  };

  // Leads Mutations
  const updateLeadStatus = (leadId: string, status: LeadStage) => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id === leadId) {
          return { ...lead, status, updated_at: new Date().toISOString() };
        }
        return lead;
      })
    );

    // Sync with Supabase if active
    const supabase: any = getSupabaseBrowserClient();
    if (supabase) {
      (async () => {
        try {
          await supabase.from("leads").update({ status }).eq("id", leadId);
        } catch {}
      })();
    }

    const stageNames: Record<LeadStage, string> = {
      new: "New Inquiry",
      contacted: "Contacted / Swatch Sent",
      quote_sent: "Quote Issued",
      converted: "Closed Won",
      lost: "Archived Lost",
    };
    showToast(`Lead updated to: ${stageNames[status]}`);
  };

  const addLead = (newLeadData: Partial<B2BLead>) => {
    const newLead: B2BLead = {
      id: `lead_${Date.now()}`,
      inquiry_number: `INQ-KSM-${Math.floor(1000 + Math.random() * 9000)}`,
      contact_name: newLeadData.contact_name || "New Hospitality Contact",
      business_name: newLeadData.business_name || "Boutique Hotel Lead",
      establishment_nature: newLeadData.establishment_nature || "Boutique Hotel",
      email: newLeadData.email || "",
      phone: newLeadData.phone || "+91 ",
      city: newLeadData.city || "Jaipur",
      pincode: newLeadData.pincode || "302001",
      categories_needed: newLeadData.categories_needed || ["Bedsheets & Pillow Shams"],
      weave_grade: newLeadData.weave_grade || "400TC Organic Sateen",
      quantity_tier: newLeadData.quantity_tier || "25 Suite Sets",
      bed_sizes: newLeadData.bed_sizes || ["King (108x108\")"],
      branding_option: newLeadData.branding_option || "Embroidered Monogram",
      timeline: newLeadData.timeline || "Within 4 weeks",
      notes: newLeadData.notes || "",
      swatch_binder_requested: newLeadData.swatch_binder_requested ?? true,
      status: "new",
      proposed_value: newLeadData.proposed_value || 250000,
      cluster: newLeadData.cluster || "Sanganer Hand-Block",
      assignee: newLeadData.assignee || { name: "Arvind Oberoi", initials: "AO", avatarColor: "bg-primary-container" },
      urgency: "Today",
      tags: ["Direct Ingest", "Hospitality"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setLeads((prev) => [newLead, ...prev]);
    showToast(`Registered new trade lead: #${newLead.inquiry_number} (${newLead.business_name})`);

    // Persist to Supabase if available
    const supabase: any = getSupabaseBrowserClient();
    if (supabase) {
      (async () => {
        try {
          await supabase.from("leads").insert({
            inquiry_number: newLead.inquiry_number,
            contact_name: newLead.contact_name,
            business_name: newLead.business_name,
            establishment_nature: newLead.establishment_nature,
            email: newLead.email,
            phone: newLead.phone,
            city: newLead.city,
            pincode: newLead.pincode,
            categories_needed: newLead.categories_needed,
            weave_grade: newLead.weave_grade,
            quantity_tier: newLead.quantity_tier,
            bed_sizes: newLead.bed_sizes,
            branding_option: newLead.branding_option,
            timeline: newLead.timeline,
            notes: newLead.notes,
            swatch_binder_requested: newLead.swatch_binder_requested,
            status: "new",
          });
        } catch {}
      })();
    }
  };

  // Orders Mutations
  const updateOrderStatus = (orderId: string, status: AdminOrder["status"]) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId || order.order_number === orderId) {
          return { ...order, status };
        }
        return order;
      })
    );

    const supabase: any = getSupabaseBrowserClient();
    if (supabase) {
      (async () => {
        try {
          await supabase.from("orders").update({ status }).or(`id.eq.${orderId},order_number.eq.${orderId}`);
        } catch {}
      })();
    }

    showToast(`Order status updated to: ${status}`);
  };

  const markCodBalanceCollected = (orderId: string, method: "cash" | "upi") => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId || order.order_number === orderId) {
          return {
            ...order,
            cod_collected: true,
            cod_collection_method: method,
            balance_due: 0,
            status: "Delivered",
          };
        }
        return order;
      })
    );

    showToast(`Settled doorstep COD balance via ${method.toUpperCase()} for ${orderId}`);
  };

  // Patrons Mutations
  const addPatronTimelineEvent = (
    patronId: string,
    event: { type: any; title: string; description: string; author: string }
  ) => {
    const newEvent = {
      id: `tl_${Date.now()}`,
      type: event.type,
      title: event.title,
      description: event.description,
      author: event.author,
      timestamp: "Just now",
    };

    setPatrons((prev) =>
      prev.map((p) => {
        if (p.id === patronId) {
          return {
            ...p,
            timeline: [newEvent, ...p.timeline],
          };
        }
        return p;
      })
    );

    showToast(`Added event to patron timeline: ${event.title}`);
  };

  // Inventory Mutations
  const updateStock = (sku: string, delta: number, reason: string) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.sku === sku) {
          const newStock = Math.max(0, item.in_stock + delta);
          const newAvailable = Math.max(0, newStock - item.reserved);
          return {
            ...item,
            in_stock: newStock,
            available: newAvailable,
            last_replenished: "Today",
          };
        }
        return item;
      })
    );

    showToast(`Adjusted SKU ${sku} (${delta > 0 ? "+" + delta : delta} units) - ${reason}`);
  };

  // Tickets Mutations
  const updateTicketStatus = (ticketId: string, status: SupportTicket["status"]) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId || t.ticket_number === ticketId ? { ...t, status } : t))
    );
    showToast(`Ticket status updated to: ${status}`);
  };

  const addTicketMessage = (ticketId: string, message: string) => {
    const newMessage = {
      id: `msg_${Date.now()}`,
      sender: "Devika Sharma (Atelier Concierge)",
      sender_type: "staff" as const,
      message,
      timestamp: "Just now",
    };

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId || t.ticket_number === ticketId) {
          return {
            ...t,
            messages: [...t.messages, newMessage],
            updated_at: new Date().toISOString(),
          };
        }
        return t;
      })
    );

    showToast("Reply sent to patron.");
  };

  // Abandoned Carts Mutations
  const sendCartNudge = (cartId: string) => {
    setAbandonedCarts((prev) =>
      prev.map((c) =>
        c.id === cartId
          ? {
              ...c,
              recovery_status: "nudge_sent",
              last_nudge_at: "Just now",
            }
          : c
      )
    );
    showToast("Personalized WhatsApp concierge recovery nudge dispatched.");
  };

  const markCartRecovered = (cartId: string) => {
    setAbandonedCarts((prev) =>
      prev.map((c) =>
        c.id === cartId
          ? {
              ...c,
              recovery_status: "recovered",
            }
          : c
      )
    );
    showToast("Cart marked as successfully converted to order.");
  };

  return (
    <AdminContext.Provider
      value={{
        activeRole,
        setActiveRole,
        hasAccess,
        selectedCluster,
        setSelectedCluster,
        leads,
        updateLeadStatus,
        addLead,
        orders,
        updateOrderStatus,
        markCodBalanceCollected,
        patrons,
        addPatronTimelineEvent,
        inventory,
        updateStock,
        tickets,
        updateTicketStatus,
        addTicketMessage,
        abandonedCarts,
        sendCartNudge,
        markCartRecovered,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
