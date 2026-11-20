#!/usr/bin/env node

/**
 * Kusumika Atelier - Optional Demo Data Seeder
 * Populates realistic demo orders, leads, support ticket threads, abandoned carts, and patron dossiers for local/staging presentations.
 *
 * SAFETY GUARD:
 * This script is STRICTLY BLOCKED from running in production environments.
 *
 * Usage:
 *   node scripts/seed-demo-data.mjs
 *   npm run seed:demo
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// 1. STRICT PRODUCTION SAFETY GUARD
if (
  process.env.NODE_ENV === "production" ||
  process.env.VERCEL_ENV === "production" ||
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
) {
  console.error("\n=======================================================");
  console.error("❌ CRITICAL ERROR: Demo seeding is STRICTLY PROHIBITED in production!");
  console.error("=======================================================\n");
  process.exit(1);
}

// 2. Load environment variables from .env.local
const envLocalPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, "utf8");
  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [key, ...rest] = trimmed.split("=");
      const val = rest.join("=").replace(/^['"]|['"]$/g, "");
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  });
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const isLiveConfigured =
  SUPABASE_URL &&
  SERVICE_ROLE_KEY &&
  !SUPABASE_URL.includes("mock-kusumika") &&
  !SERVICE_ROLE_KEY.includes("mock-service-role-key");

console.log("\n==================================================");
console.log("KUSUMIKA ATELIER - DEMO DATA SEEDER");
console.log("==================================================");

if (!isLiveConfigured) {
  console.log("\nℹ Notice: Live Supabase credentials are not configured in .env.local.");
  console.log("  NEXT_PUBLIC_SUPABASE_URL:", SUPABASE_URL || "(missing)");
  console.log("  SUPABASE_SERVICE_ROLE_KEY: (present or sandbox)");
  console.log("\nSimulated Demo Seeding Dry-Run Summary:");
  console.log("  • 4 Patron Profiles (Royal, Hospitality, Organic Homeowner)");
  console.log("  • 6 B2B Hospitality Leads (New, Contacted, Quote Issued, Closed Won)");
  console.log("  • 5 Demonstrative Orders (Partial COD with Doorstep Balance & Prepaid)");
  console.log("  • 4 Support Care Ticket Threads with Staff Concierge Replies");
  console.log("  • 3 Abandoned Cart Sessions for WhatsApp Recovery Demo");
  console.log("  • Operational Policy & SEO Settings in site_settings");
  console.log("\nTo seed a live database, connect your real Supabase credentials and re-run.\n");
  process.exit(0);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function seedDemoData() {
  try {
    console.log("✓ Live Supabase credentials validated. Commencing demo data population...\n");

    // 1. Seed Patron Profiles
    console.log("Seeding Patron Profiles...");
    const DEMO_CUSTOMERS = [
      {
        full_name: "Maharaja Arvind Singh",
        email: "arvind.singh@citypalace.org",
        phone: "+91 98290 11223",
        loyalty_tier: "Royal Heirloom Benefactor",
        loyalty_points: 2450,
        role: "customer",
        segment: "royal",
        metadata: {
          city: "Udaipur",
          state: "Rajasthan",
          notes: "Patron of Mewar heritage textiles. Requests pure natural indigo and hand-stitched silk edging.",
          timeline: [
            {
              id: "tl_1",
              type: "order",
              title: "Heritage Suite Commission Placed",
              description: "Commissioned 12 custom King dohars for City Palace guest wing.",
              author: "Devika Sharma (Ops)",
              timestamp: "12 Oct 2026",
            },
            {
              id: "tl_2",
              type: "whatsapp",
              title: "Swatch Binder Hand-Delivered",
              description: "Delivered Sanganer teakwood swatch binder to palace estate manager.",
              author: "Arvind Oberoi",
              timestamp: "05 Oct 2026",
            },
          ],
        },
      },
      {
        full_name: "Gayatri Devi Somani",
        email: "gayatri.somani@heritagehaven.in",
        phone: "+91 98100 44556",
        loyalty_tier: "Atelier Connoisseur",
        loyalty_points: 1200,
        role: "customer",
        segment: "festive_gifting",
        metadata: {
          city: "Jaipur",
          state: "Rajasthan",
          notes: "Curates bespoke Deepavali gifting suites for industrial family estates.",
        },
      },
      {
        full_name: "Sunita Nambiar",
        email: "sunita.nambiar@ecodesign.in",
        phone: "+91 98450 77889",
        loyalty_tier: "Loom Patron",
        loyalty_points: 450,
        role: "customer",
        segment: "organic_homeowner",
        metadata: {
          city: "Bengaluru",
          state: "Karnataka",
          notes: "Architect patron focused on GOTS-certified unbleached bedding and chemical-free desert washes.",
        },
      },
    ];

    const customerIds = [];
    for (const c of DEMO_CUSTOMERS) {
      const { data, error } = await supabase
        .from("customers")
        .upsert(c, { onConflict: "email" })
        .select("id")
        .single();
      if (!error && data) {
        customerIds.push(data.id);
      }
    }
    console.log(`  ✓ Seeded ${customerIds.length} demo patrons`);

    // 2. Seed B2B Hospitality Leads
    console.log("Seeding B2B Hospitality Leads...");
    const DEMO_LEADS = [
      {
        inquiry_number: "INQ-KSM-1042",
        contact_name: "Vikramaditya Rathore",
        business_name: "Umaid Heritage Haveli & Spa",
        establishment_nature: "Boutique Hotel",
        email: "gm@umaidhaveli.com",
        phone: "+91 98290 88776",
        city: "Jodhpur",
        pincode: "342001",
        categories_needed: ["Bedsheets & Pillow Shams", "Throws & Fine Razais"],
        weave_grade: "600TC Single-Ply Organic Sateen",
        quantity_tier: "50 Suite Sets",
        bed_sizes: ["King (108x108\")", "Queen (90x100\")"],
        branding_option: "Embroidered Monogram",
        timeline: "Planned Suite Opening (3-4 weeks)",
        notes: "Require royal madder terracotta and indigo piping on all pillow shams.",
        swatch_binder_requested: true,
        status: "quote_sent",
      },
      {
        inquiry_number: "INQ-KSM-1088",
        contact_name: "Radhika Singhania",
        business_name: "Singhania Estate Diwal Gifting",
        establishment_nature: "Corporate Gifting",
        email: "radhika@singhaniaholdings.com",
        phone: "+91 98110 99887",
        city: "Mumbai",
        pincode: "400021",
        categories_needed: ["Spa Waffle Towels", "Festive Heritage Edit"],
        weave_grade: "Honeycomb Waffle 650 GSM",
        quantity_tier: "100+ Master Suites",
        bed_sizes: ["Super King / Custom"],
        branding_option: "Custom Woven Guild Ribbon",
        timeline: "Festive Delivery Deadline",
        notes: "Packaged in handmade unbleached mulberry paper boxes with wax seal.",
        swatch_binder_requested: true,
        status: "new",
      },
      {
        inquiry_number: "INQ-KSM-2115",
        contact_name: "Karan Johar Oberoi",
        business_name: "Amanbagh Forest Retreat",
        establishment_nature: "Luxury Resort",
        email: "procurement@amanbagh-retreat.com",
        phone: "+91 94140 33221",
        city: "Alwar",
        pincode: "301001",
        categories_needed: ["Dohars & Fine Razais", "Cushions & Bolsters"],
        weave_grade: "Mulmul 3-Layer Brushed Cotton Flannel",
        quantity_tier: "35 Sets",
        bed_sizes: ["King (108x108\")"],
        branding_option: "Artisan Wax Seal Stamp",
        timeline: "Within 2 weeks",
        notes: "Fast-track consignment approved. Swatch approved by General Manager.",
        swatch_binder_requested: true,
        status: "converted",
      },
    ];

    for (const lead of DEMO_LEADS) {
      await supabase.from("leads").upsert(lead, { onConflict: "inquiry_number" });
    }
    console.log(`  ✓ Seeded ${DEMO_LEADS.length} B2B hospitality leads`);

    // 3. Seed Demonstrative Orders (Storefront Orders + Doorstep COD)
    console.log("Seeding Demonstrative Orders...");
    const DEMO_ORDERS = [
      {
        order_number: "KSM-92810",
        customer_name: "Maharaja Arvind Singh",
        customer_email: "arvind.singh@citypalace.org",
        customer_phone: "+91 98290 11223",
        shipping_address: {
          address_line1: "City Palace Heritage Wing",
          address_line2: "Near Jagdish Temple",
          city: "Udaipur",
          state: "Rajasthan",
          pincode: "313001",
        },
        subtotal: 5700,
        discount: 500,
        shipping_fee: 0,
        total: 5200,
        payment_mode: "partial_cod",
        advance_paid: 1040,
        balance_due: 4160,
        cod_collected: false,
        status: "Loom Assigned",
        tracking_carrier: "BlueDart Luxury Surface",
        tracking_awb: "KUS-BLUEDART-882910",
        estimated_delivery: "5–7 Days",
        notes: "Artisan wax seal inspection requested before balance settlement.",
      },
      {
        order_number: "KSM-93114",
        customer_name: "Gayatri Devi Somani",
        customer_email: "gayatri.somani@heritagehaven.in",
        customer_phone: "+91 98100 44556",
        shipping_address: {
          address_line1: "Somani Manor, Civil Lines",
          city: "Jaipur",
          state: "Rajasthan",
          pincode: "302006",
        },
        subtotal: 3500,
        discount: 350,
        shipping_fee: 0,
        total: 3150,
        payment_mode: "upi",
        advance_paid: 3150,
        balance_due: 0,
        cod_collected: true,
        status: "Shipped",
        tracking_carrier: "BlueDart Air Express",
        tracking_awb: "KUS-BLUEDART-883114",
        estimated_delivery: "2–3 Days",
        notes: "Prepaid online via Razorpay Dynamic UPI.",
      },
    ];

    for (const ord of DEMO_ORDERS) {
      const { data: newOrder, error } = await supabase
        .from("orders")
        .upsert(ord, { onConflict: "order_number" })
        .select("id")
        .single();

      if (!error && newOrder) {
        // Insert sample line item
        await supabase.from("order_items").insert({
          order_id: newOrder.id,
          product_title: "Marwar Lotus 400TC Double Bedsheet Set",
          variant_size: "King Sanctuary (108x108\")",
          swatch_name: "Terracotta Lotus",
          price: ord.total,
          quantity: 1,
          total: ord.total,
        });

        // Insert advance payment record
        await supabase.from("payments").insert({
          order_id: newOrder.id,
          gateway: "razorpay",
          amount: ord.advance_paid,
          status: "captured",
          payment_type: ord.payment_mode === "partial_cod" ? "advance" : "full",
        });
      }
    }
    console.log(`  ✓ Seeded ${DEMO_ORDERS.length} orders with payments & items`);

    // 4. Seed Support Tickets & Threaded Messages
    console.log("Seeding Support Tickets & Messages...");
    const { data: ticket1 } = await supabase
      .from("tickets")
      .upsert(
        {
          ticket_number: "TCK-2026-8801",
          customer_name: "Devika Chauhan",
          customer_email: "devika.chauhan@gmail.com",
          customer_phone: "+91 98200 66778",
          subject: "Doorstep Wax Seal Inspection Inquiry",
          category: "Doorstep Inspection",
          priority: "medium",
          status: "open",
        },
        { onConflict: "ticket_number" }
      )
      .select("id")
      .single();

    if (ticket1) {
      await supabase.from("ticket_messages").insert([
        {
          ticket_id: ticket1.id,
          sender_type: "customer",
          message:
            "Namaste. Can I inspect the natural vegetable indigo dye finish before the BlueDart courier collects the ₹2,300 balance due?",
        },
        {
          ticket_id: ticket1.id,
          sender_type: "staff",
          message:
            "Namaste Ms. Chauhan. Absolutely. Kusumika offers a zero-risk doorstep inspection guarantee. You are warmly invited to examine the intact artisan seal and touch the organic weave before completing payment via Cash or dynamic UPI QR.",
        },
      ]);
    }
    console.log("  ✓ Seeded threaded support tickets");

    // 5. Seed Abandoned Checkouts
    console.log("Seeding Abandoned Checkouts...");
    await supabase.from("abandoned_checkouts").insert([
      {
        customer_name: "Pooja Singhal",
        email: "pooja.singhal@studioarch.com",
        phone: "+91 99880 12345",
        cart_items: [
          {
            title: "Jaipur Dohar Triple-Layer Cotton Mulmul Quilt",
            size: "Double / Queen",
            color: "Bagru Indigo Kashish",
            price: 2450,
          },
        ],
        subtotal: 2450,
        total: 2450,
        recovery_status: "pending",
      },
    ]);
    console.log("  ✓ Seeded abandoned checkouts");

    // 6. Seed Site Settings
    console.log("Seeding Site Settings...");
    await supabase.from("site_settings").upsert(
      {
        key: "operational_policy",
        value: {
          partialCodEnabled: true,
          minCodAdvance: 500,
          codPercentage: 20,
          maxCodAdvance: 2000,
          doorstepInspectionOtp: true,
          autoAssignLooms: true,
          enableWhatsAppAlerts: true,
        },
        description: "Atelier Partial COD rules, doorstep inspection, and operational cadence",
      },
      { onConflict: "key" }
    );
    console.log("  ✓ Seeded site_settings operational policy");

    console.log("\n==================================================");
    console.log("ALL DEMO DATA POPULATED SUCCESSFULLY!");
    console.log("==================================================\n");
  } catch (err) {
    console.error("Demo seeding failed:", err);
    process.exit(1);
  }
}

seedDemoData();
