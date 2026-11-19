/**
 * Kusumika Complete Catalog & Database Seeder
 * Populates categories, products, variants, swatches, images, coupons, site_settings, and reviews.
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

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const isLiveConfigured =
  SUPABASE_URL &&
  SERVICE_ROLE_KEY &&
  !SUPABASE_URL.includes("mock-kusumika") &&
  !SERVICE_ROLE_KEY.includes("mock-service-role-key");

const CATEGORIES_DATA = [
  {
    slug: "bedsheets-linens",
    name: "Bedsheets & Linens",
    description: "Breathable 400–800 thread count sateen and cambric hand-block printed bed linens crafted with unbleached organic cotton.",
    hero_image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80",
    display_order: 1,
  },
  {
    slug: "throws-quilts",
    name: "Throws & Quilts",
    description: "Weightless cotton mulmul dohars and fine Jaipur razais quilted by hand with pure carded surgical cotton batting.",
    hero_image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=1200&q=80",
    display_order: 2,
  },
  {
    slug: "towels-bath",
    name: "Towels & Bath",
    description: "Ultra-absorbent honeycombed waffle-weave spa towels pre-washed with natural desert soapnuts for skin-soothing softness.",
    hero_image: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=1200&q=80",
    display_order: 3,
  },
  {
    slug: "cushions-decor",
    name: "Cushions & Living",
    description: "Heritage jewel-toned velvet and textured raw slub cotton cushions finished with antique zari and kantha stitching.",
    hero_image: "https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?w=1200&q=80",
    display_order: 4,
  },
  {
    slug: "festive-edit",
    name: "Festive Heritage Edit",
    description: "Limited-batch festive treasures infused with natural madder, wild turmeric haldi, and deep Persian indigo vat dyes.",
    hero_image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&q=80",
    display_order: 5,
  },
];

const PRODUCTS_DATA = [
  {
    title: "Marwar Lotus 400TC Double Bedsheet Set",
    subtitle: "Includes 2 Matching King Flanged Pillowcases • Sanganeri Hand-Block",
    slug: "marwar-lotus-400tc-double-bedsheet-set",
    categorySlug: "bedsheets-linens",
    description: "An homage to Rajasthan's imperial gardens, this 400 thread-count sateen weave is adorned with rhythmic terracotta lotus medallions hand-pressed by master Chippa artisans.",
    story: "Handcrafted in Sanganer using hand-carved teakwood blocks. Washed in the waters of the Saraswati riverbed basin to lock natural luster without stiff synthetic resins.",
    care_instructions: "Cold gentle machine wash with mild liquid soap. Dry in soft morning shade. Warm steam iron on reverse.",
    dimensions: 'Double/Queen: 84" x 100", King: 108" x 108"',
    weave_type: "Single-Ply Satin Sateen Luster Weave",
    thread_count: 400,
    material: "100% Certified GOTS Long-Staple Organic Cotton",
    gots_certified: true,
    base_price: 2850,
    mrp: 3500,
    is_featured: true,
    is_festive: false,
    partial_cod_eligible: true,
    cod_advance_amount: 500,
    variants: [
      { size: 'Double / Queen (84x100")', sku: "KSM-ML-DBL", priceAdjustment: 0, stock: 24, isDefault: true },
      { size: 'King Sanctuary (108x108")', sku: "KSM-ML-KNG", priceAdjustment: 400, stock: 18, isDefault: false },
    ],
    swatches: [
      { name: "Terracotta Lotus", color_code: "#B35446", image_url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80" },
      { name: "Indigo Oasis", color_code: "#2C3E50", image_url: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&q=80" },
    ],
    images: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1000&q=80",
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=1000&q=80",
    ],
  },
  {
    title: "Jaipur Dohar Triple-Layer Cotton Mulmul Quilt",
    subtitle: "Ultra-Lightweight Reversible Summer Dohar with Soft Brushed Flannel Core",
    slug: "jaipur-dohar-triple-layer-cotton-mulmul-quilt",
    categorySlug: "throws-quilts",
    description: "Featherweight luxury crafted from three whispering layers of fine Indian mulmul cotton enclosing a delicate brushed cotton flannel core.",
    story: "Stitched by generational women artisans in Bagru. Each piece is hand-bound with an heirloom contrast piping.",
    care_instructions: "Hand wash or gentle cold cycle. Lay flat on muslin cloth to air dry.",
    dimensions: 'Double: 90" x 100"',
    weave_type: "Hand-Spun Fine Mulmul Muslin",
    thread_count: 300,
    material: "Pure Unbleached Desi Cotton Mulmul",
    gots_certified: true,
    base_price: 3200,
    mrp: 4200,
    is_featured: true,
    is_festive: false,
    partial_cod_eligible: true,
    cod_advance_amount: 500,
    variants: [
      { size: 'Single Dohar (60x90")', sku: "KSM-JD-SGL", priceAdjustment: -600, stock: 15, isDefault: false },
      { size: 'Double Quilt (90x100")', sku: "KSM-JD-DBL", priceAdjustment: 0, stock: 20, isDefault: true },
    ],
    swatches: [
      { name: "Peshwai Gold & Ochre", color_code: "#D4AC0D", image_url: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&q=80" },
    ],
    images: [
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=1000&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1000&q=80",
    ],
  },
  {
    title: "Mughal Jaal 600TC Egyptian Cotton Fitted Set",
    subtitle: "Deep 14-Inch Elasticated Pockets • Antique Madder Red & Zari Block",
    slug: "mughal-jaal-600tc-egyptian-cotton-fitted-set",
    categorySlug: "festive-edit",
    description: "An heirloom masterwork woven with high-tenacity Egyptian long-staple cotton, featuring intricate hand-blocked botanical vines.",
    story: "Created for festive sanctuaries with natural pomegranate peel, alum, and madder root dye fermentations.",
    care_instructions: "Dry clean for first two washes; thereafter gentle machine wash.",
    dimensions: 'Super King Fitted: 72" x 78" x 14" Deep Drop',
    weave_type: "600TC High-Density Lustrous Weave",
    thread_count: 600,
    material: "Extra Long-Staple Giza Cotton",
    gots_certified: true,
    base_price: 4450,
    mrp: 5800,
    is_featured: true,
    is_festive: true,
    partial_cod_eligible: true,
    cod_advance_amount: 800,
    variants: [
      { size: 'King Fitted (72x78x14")', sku: "KSM-MJ-KNG", priceAdjustment: 0, stock: 12, isDefault: true },
    ],
    swatches: [
      { name: "Imperial Madder Red", color_code: "#8B0000", image_url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80" },
    ],
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1000&q=80",
    ],
  },
  {
    title: "Honeycomb Waffle Spa Bath Towel Set (Pack of 2)",
    subtitle: "Pre-Washed Desert Reetha Soapnut Finish • Quick-Drying Cellular Loom",
    slug: "honeycomb-waffle-spa-bath-towel-set",
    categorySlug: "towels-bath",
    description: "Woven on antique jacquard looms, these deep cellular honeycombs expand upon contact with water, absorbing four times their weight instantly.",
    story: "Pre-softened using natural Rajasthani soapnuts, eliminating all synthetic softening chemicals for complete skin neutrality.",
    care_instructions: "Wash separately before first use. Avoid fabric softeners which coat natural fibers.",
    dimensions: 'Bath Sheet: 30" x 60"',
    weave_type: "Zero-Twist 3D Cellular Waffle Weave",
    thread_count: 450,
    material: "100% Combed Turkish Ring-Spun Cotton",
    gots_certified: true,
    base_price: 1850,
    mrp: 2400,
    is_featured: false,
    is_festive: false,
    partial_cod_eligible: true,
    cod_advance_amount: 500,
    variants: [
      { size: 'Set of 2 Bath Sheets (30x60")', sku: "KSM-HC-TWL2", priceAdjustment: 0, stock: 35, isDefault: true },
    ],
    swatches: [
      { name: "Earthy Oatmeal", color_code: "#D7C4B7", image_url: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=600&q=80" },
    ],
    images: [
      "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=1000&q=80",
    ],
  },
  {
    title: "Raw Slub Cotton Textured Lumbar Cushion Cover",
    subtitle: "Concealed YKK Antique Brass Zipper • Antique Kantha Running Stitch",
    slug: "raw-slub-cotton-textured-lumbar-cushion-cover",
    categorySlug: "cushions-decor",
    description: "Textured unbleached slub yarn offering raw, tactile warmth, highlighted with tonal kantha hand-embroidery along the seams.",
    story: "Embroidered by an artisan guild in Barmer, Rajasthan.",
    care_instructions: "Spot clean or dry clean only.",
    dimensions: 'Lumbar: 14" x 24"',
    weave_type: "Chunky Slub Handloom Weave",
    thread_count: 220,
    material: "100% Organic Raw Slub Cotton",
    gots_certified: true,
    base_price: 1250,
    mrp: 1650,
    is_featured: false,
    is_festive: false,
    partial_cod_eligible: true,
    cod_advance_amount: 500,
    variants: [
      { size: 'Lumbar (14x24")', sku: "KSM-RC-LMB", priceAdjustment: 0, stock: 25, isDefault: true },
    ],
    swatches: [
      { name: "Desert Sand", color_code: "#C2B280", image_url: "https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?w=600&q=80" },
    ],
    images: [
      "https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?w=1000&q=80",
    ],
  },
];

const SITE_SETTINGS_DATA = [
  { key: "brand_name", value: { text: "Kusumika Luxury Home Textiles" }, description: "Brand title", is_public: true },
  { key: "brand_tagline", value: { text: "Soft like Silk, Feels like a Hug" }, description: "Official motto", is_public: true },
  { key: "support_phone", value: { phone: "+91 141 289 9000", whatsapp: "+91 98765 43210" }, description: "Concierge contact numbers", is_public: true },
  { key: "support_email", value: { email: "care@kusumika.com" }, description: "Patron care email", is_public: true },
  { key: "partial_cod_config", value: { min_advance: 500, percentage: 20, max_advance: 2000 }, description: "Partial COD calculation formula", is_public: true },
  { key: "shipping_config", value: { free_shipping_threshold: 1999, priority_air_fee: 250 }, description: "Logistics thresholds", is_public: true },
  { key: "announcement_banner", value: { message: "Artisanal Heritage Looming • Complimentary Insured Dispatch on all acquisitions above ₹1,999", active: true }, description: "Global marquee banner", is_public: true },
];

const COUPONS_DATA = [
  { code: "FESTIVE500", type: "flat", value: 500, min_order_amount: 2500, description: "₹500 flat privilege on festive orders above ₹2,500" },
  { code: "KUSUMIKA10", type: "percent", value: 10, min_order_amount: 0, description: "10% privilege discount on all handloom weaves" },
  { code: "WELCOME15", type: "percent", value: 15, min_order_amount: 3000, description: "15% off on your first sanctuary acquisition" },
];

async function seedCatalog() {
  console.log("==================================================");
  console.log("KUSUMIKA SUPABASE CATALOG SEEDER");
  console.log("==================================================\n");

  if (!isLiveConfigured) {
    console.log("ℹ Notice: Live Supabase credentials are not connected in .env.local.");
    console.log("  NEXT_PUBLIC_SUPABASE_URL:", SUPABASE_URL || "(missing)");
    console.log("  SUPABASE_SERVICE_ROLE_KEY:", SERVICE_ROLE_KEY ? "(present)" : "(missing)");
    console.log("\nSimulated dry-run summary:");
    console.log(`- Categories to seed: ${CATEGORIES_DATA.length}`);
    console.log(`- Products to seed: ${PRODUCTS_DATA.length}`);
    console.log(`- Site Settings to seed: ${SITE_SETTINGS_DATA.length}`);
    console.log(`- Coupons to seed: ${COUPONS_DATA.length}`);
    console.log("\nTo seed a live database, connect your real Supabase credentials and re-run.");
    return;
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    // 1. Ensure Storage Bucket exists
    console.log("1. Setting up Supabase Storage bucket 'product-images'...");
    const { error: bucketErr } = await supabase.storage.createBucket("product-images", {
      public: true,
      fileSizeLimit: 10485760, // 10MB
    });
    if (bucketErr && !bucketErr.message.includes("already exists")) {
      console.warn("  Storage bucket notice:", bucketErr.message);
    } else {
      console.log("  ✓ Bucket 'product-images' is verified & public.");
    }

    // 2. Seed Categories
    console.log("\n2. Seeding Categories...");
    const categoryMap = new Map();
    for (const cat of CATEGORIES_DATA) {
      const { data, error } = await supabase
        .from("categories")
        .upsert(cat, { onConflict: "slug" })
        .select("id, slug")
        .single();

      if (error) {
        console.error(`  ✗ Error upserting category '${cat.name}':`, error.message);
      } else {
        categoryMap.set(data.slug, data.id);
        console.log(`  ✓ Category: ${cat.name} (${data.id})`);
      }
    }

    // 3. Seed Products, Variants, Swatches, Images, and Initial Stock Movements
    console.log("\n3. Seeding Products & Variants...");
    for (const prod of PRODUCTS_DATA) {
      const categoryId = categoryMap.get(prod.categorySlug) || null;

      const productPayload = {
        title: prod.title,
        subtitle: prod.subtitle,
        slug: prod.slug,
        description: prod.description,
        story: prod.story,
        care_instructions: prod.care_instructions,
        dimensions: prod.dimensions,
        weave_type: prod.weave_type,
        thread_count: prod.thread_count,
        material: prod.material,
        gots_certified: prod.gots_certified,
        base_price: prod.base_price,
        mrp: prod.mrp,
        category_id: categoryId,
        is_featured: prod.is_featured,
        is_festive: prod.is_festive,
        partial_cod_eligible: prod.partial_cod_eligible,
        cod_advance_amount: prod.cod_advance_amount,
        is_active: true,
      };

      const { data: productRow, error: pError } = await supabase
        .from("products")
        .upsert(productPayload, { onConflict: "slug" })
        .select("id, slug, title")
        .single();

      if (pError) {
        console.error(`  ✗ Error upserting product '${prod.title}':`, pError.message);
        continue;
      }

      console.log(`  ✓ Product: ${productRow.title} (${productRow.id})`);

      // Variants
      for (const v of prod.variants) {
        const { data: vRow, error: vErr } = await supabase
          .from("product_variants")
          .upsert(
            {
              product_id: productRow.id,
              sku: v.sku,
              size: v.size,
              price_adjustment: v.priceAdjustment,
              stock_count: v.stock,
              is_default: v.isDefault,
            },
            { onConflict: "sku" }
          )
          .select("id")
          .single();

        if (vErr) {
          console.warn(`    - Variant warning (${v.sku}):`, vErr.message);
        } else if (vRow) {
          // Log initial stock movement
          await supabase.from("inventory_movements").insert({
            product_id: productRow.id,
            variant_id: vRow.id,
            movement_type: "purchase_receipt",
            quantity_delta: v.stock,
            previous_stock: 0,
            new_stock: v.stock,
            reason: "Initial artisanal loom intake batch",
          });
        }
      }

      // Swatches
      for (let i = 0; i < prod.swatches.length; i++) {
        const s = prod.swatches[i];
        await supabase.from("product_swatches").insert({
          product_id: productRow.id,
          name: s.name,
          color_code: s.color_code,
          image_url: s.image_url,
          sort_order: i,
        });
      }

      // Images
      for (let i = 0; i < prod.images.length; i++) {
        const imgUrl = prod.images[i];
        await supabase.from("product_images").insert({
          product_id: productRow.id,
          image_url: imgUrl,
          alt_text: `${productRow.title} angle ${i + 1}`,
          is_primary: i === 0,
          sort_order: i,
        });
      }
    }

    // 4. Seed Site Settings
    console.log("\n4. Seeding Site Settings...");
    for (const setting of SITE_SETTINGS_DATA) {
      const { error } = await supabase
        .from("site_settings")
        .upsert(setting, { onConflict: "key" });
      if (error) {
        console.warn(`  - Setting warning (${setting.key}):`, error.message);
      } else {
        console.log(`  ✓ Setting: ${setting.key}`);
      }
    }

    // 5. Seed Coupons
    console.log("\n5. Seeding Privilege Coupons...");
    for (const coupon of COUPONS_DATA) {
      const { error } = await supabase
        .from("coupons")
        .upsert(coupon, { onConflict: "code" });
      if (error) {
        console.warn(`  - Coupon warning (${coupon.code}):`, error.message);
      } else {
        console.log(`  ✓ Coupon: ${coupon.code}`);
      }
    }

    console.log("\n==================================================");
    console.log("SUPABASE CATALOG SEEDING COMPLETED SUCCESSFULLY!");
    console.log("==================================================");
  } catch (err) {
    console.error("Fatal error during catalog seeding:", err);
  }
}

seedCatalog();
