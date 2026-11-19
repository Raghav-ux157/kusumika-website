#!/usr/bin/env node

/**
 * Kusumika Atelier - Admin Seeding Script
 * Provisions initial Administrator and operational staff accounts in Supabase Auth & staff_roles table.
 *
 * Usage:
 *   node scripts/seed-admin.mjs
 *   npm run seed:admin
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Attempt to load .env.local if present
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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const INITIAL_STAFF = [
  {
    email: process.env.ADMIN_INITIAL_EMAIL || "admin@kusumika.com",
    password: process.env.ADMIN_INITIAL_PASSWORD || "Kusumika@Atelier2026!",
    fullName: process.env.ADMIN_INITIAL_NAME || "Kusumika Atelier Admin",
    role: "admin",
  },
  {
    email: "sales@kusumika.com",
    password: process.env.ADMIN_INITIAL_PASSWORD || "Kusumika@Atelier2026!",
    fullName: "Devika Sharma (Sales & Concierge)",
    role: "sales",
  },
  {
    email: "warehouse@kusumika.com",
    password: process.env.ADMIN_INITIAL_PASSWORD || "Kusumika@Atelier2026!",
    fullName: "Kailash Meena (Warehouse & Godown)",
    role: "warehouse",
  },
  {
    email: "support@kusumika.com",
    password: process.env.ADMIN_INITIAL_PASSWORD || "Kusumika@Atelier2026!",
    fullName: "Vikram Seth (Patron Care & Tickets)",
    role: "support",
  },
];

async function seedAdmin() {
  console.log("=================================================================");
  console.log("🪷  KUSUMIKA ATELIER — STAFF PROVISIONING & RBAC SEED");
  console.log("=================================================================\n");

  const isLiveSupabase =
    supabaseUrl &&
    serviceRoleKey &&
    !supabaseUrl.includes("mock-kusumika") &&
    !supabaseUrl.includes("your-project");

  if (!isLiveSupabase) {
    console.log("ℹ️  [MODE: Local Sandbox / Offline Development]");
    console.log("    Supabase live credentials not detected or set to mock.");
    console.log("    The following staff accounts are pre-configured for local testing:\n");

    INITIAL_STAFF.forEach((staff) => {
      console.log(`    • Role: [${staff.role.toUpperCase().padEnd(9)}] ${staff.email.padEnd(25)} (Name: ${staff.fullName})`);
    });

    console.log(`\n    Default Password: ${INITIAL_STAFF[0].password}`);
    console.log("\n    👉 You can immediately sign in at: http://localhost:3000/admin/login");
    console.log("    When deploying to production, supply real NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.\n");
    console.log("=================================================================");
    return;
  }

  console.log(`🌐  [MODE: Live Supabase Connected] Target: ${supabaseUrl}\n`);

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  for (const staff of INITIAL_STAFF) {
    try {
      console.log(`⏳  Provisioning [${staff.role.toUpperCase()}]: ${staff.email}...`);

      let userId;

      // 1. Create or retrieve auth.users record
      const { data: createData, error: createError } = await supabase.auth.admin.createUser({
        email: staff.email,
        password: staff.password,
        email_confirm: true,
        user_metadata: { full_name: staff.fullName },
      });

      if (createError) {
        if (createError.message.includes("already been registered") || createError.message.includes("already exists")) {
          // Fetch existing user ID
          const { data: listData } = await supabase.auth.admin.listUsers();
          const existing = listData?.users?.find((u) => u.email?.toLowerCase() === staff.email.toLowerCase());
          if (existing) {
            userId = existing.id;
            console.log(`    ℹ️  User already registered in auth.users (ID: ${userId})`);
          }
        } else {
          console.error(`    ❌ Failed to create auth user: ${createError.message}`);
          continue;
        }
      } else {
        userId = createData.user?.id;
        console.log(`    ✅ Created auth user in Supabase (ID: ${userId})`);
      }

      if (!userId) {
        console.warn(`    ⚠️ Could not determine user ID for ${staff.email}`);
        continue;
      }

      // 2. Upsert staff_roles table record
      const { error: roleError } = await supabase.from("staff_roles").upsert(
        {
          user_id: userId,
          email: staff.email,
          role: staff.role,
          full_name: staff.fullName,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "email" }
      );

      if (roleError) {
        console.error(`    ❌ Failed to upsert staff_roles record: ${roleError.message}`);
      } else {
        console.log(`    ✅ Role [${staff.role}] attached in public.staff_roles`);
      }
    } catch (err) {
      console.error(`    ❌ Exception provisioning ${staff.email}:`, err.message);
    }
  }

  console.log("\n=================================================================");
  console.log("✨  STAFF PROVISIONING COMPLETED SUCCESSFULLY");
  console.log("=================================================================\n");
}

seedAdmin().catch((err) => {
  console.error("Fatal seed error:", err);
  process.exit(1);
});
