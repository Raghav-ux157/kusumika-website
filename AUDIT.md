# Kusumika Luxury Home Textiles — Comprehensive Project Audit Report
**Date:** November 18, 2026  
**Auditor:** Antigravity Autonomous Systems / Advanced Agentic Coding  
**Platform Version:** Next.js 14.2.15 (App Router) | Tailwind CSS 3.4.1  
**Project Workspace:** `c:\Users\hp\Desktop\Kusumika Website`  
**Git Repository:** [Raghav-ux157/kusumika-website](https://github.com/Raghav-ux157/kusumika-website)  

---

## Executive Summary

The **Kusumika** (*"Soft like Silk, Feels like a Hug"*) luxury home textiles platform has reached an operational, feature-dense state. All **38 application routes** compile cleanly and respond with HTTP 200 OK. The frontend architecture faithfully reflects the *Tactile Editorial Heritage* aesthetic defined in the Stitch design system (`DESIGN.md`), featuring Rajasthani Jharokha arch silhouettes, botanical color tokens (Heirloom Maroon, Baked Terracotta, Muted Olive Leaf), and Indian e-commerce workflows (Partial Cash on Delivery, BlueDart logistics, Razorpay UPI/Cards, and WhatsApp Concierge).

However, a technical audit reveals a foundational dichotomy between the **UI layer** (which is 95%+ complete and interactive) and the **persistence/integration layer** (which relies heavily on client-side `localStorage`, mock data fallbacks, and sandbox simulators). To transition from a prototype to a production e-commerce business, the project requires:
1. Hardening admin route security (currently unprotected).
2. Connecting live Supabase Postgres credentials and running database migrations.
3. Switching Razorpay and Shiprocket from simulated sandbox to verified live production keys.
4. Fixing 2 broken footer routes (`/partial-cod` and `/wash-care`).

---

## 1. COMPLETED (End-to-End Functional Features)

The following pages and features are built and fully functional end-to-end within the current application lifecycle:

### Storefront & Consumer Commerce
- **Homepage (`/`)**: Hero section with architectural 280px Jharokha arch frame, artisanal provenance stamp, category discovery tiles (Bedsheets, Dohars, Towels, Cushions), bestselling carousel, handloom heritage manifesto, and gazette newsletter signup.
- **Catalog & PLP (`/collections`, `/collections/[category]`)**: Dynamic category routing (`bedsheets-linens`, `throws-quilts`, `towels-bath`, `cushions-decor`, `festive-edit`), multi-facet filtering (sizes, pigment colors, materials, craft techniques, thread counts 400–600TC, price ranges), live search text query filtering, and sorting (Featured, Price: Low-High, Price: High-Low, Newest, Patron Rating).
- **Product Detail Page (PDP) (`/products/[slug]`)**: High-res gallery with thumbnail selector, swatch selector, size selector (Single, Double/Queen, King Palatial), quantity controller, interactive Indian 6-digit postal pincode delivery check with BlueDart delivery transit times, collapsible fabric & dimensions accordion, Partial COD breakdown, and Add to Cart / Buy Now actions.
- **Cart (`/cart` & Global Slide-Over Drawer)**: Item list with quantity stepper, item removal, free shipping progress bar (orders > ₹2,500), coupon code application (`FESTIVE500`, `KUSUMIKA10`, `WELCOME15`), and subtotal calculation with Partial COD advance payable split.
- **Wishlist (`/wishlist`)**: LocalStorage-persisted wishlist with one-tap toggle across cards, instant "Move to Cart", and empty state.
- **Checkout (`/checkout`)**: Multi-step checkout with patron details, 10-digit Indian phone validation (`^[6-9]\d{9}$`), 6-digit pincode verification (`^[1-9][0-9]{5}$`), payment mode selector (Prepaid UPI/Cards vs. Partial COD with ₹500 advance deposit), Razorpay Checkout SDK modal integration, and mobile order summary accordion.
- **Order Tracking (`/track-order`, `/account/orders/[id]`)**: Lookup by Order ID or Air Waybill (AWB), visual progress timeline with 7 slow-craft checkpoints (Loom Assigned, Natural Dyeing, Wax Seal QA, BlueDart Air Cargo, Out for Delivery), and courier tracking link.
- **Certified GST Tax Invoice (`/account/orders/[id]/invoice`)**: Printable Indian GST-compliant invoice format with 12% HSN 6302 classification, IGST/CGST/SGST breakdown, registered GSTIN, digital signature stamp, and browser print trigger.
- **Bulk & Hospitality RFQ (`/bulk-enquiry`)**: Comprehensive B2B enquiry form for luxury boutique hotels and interior curators, collecting establishment nature, weave grade, volume tiers, bed dimensions, and swatch binder requests.
- **Statutory Policy Charters**: Canonical policies (`/shipping-policy`, `/returns-exchange`, `/privacy-policy`, `/terms-of-service`) and shorthand aliases (`/shipping`, `/returns`, `/privacy`, `/terms`) complying with Consumer Protection (E-Commerce) Rules 2020 and DPDP Act 2023.
- **Luxury Fallbacks (`not-found.tsx`, `error.tsx`, `loading.tsx`)**: Jharokha arch 404 screen, loom shuttle error boundary with retry and WhatsApp concierge escalation, and golden lotus shimmering skeleton loader.
- **SEO Studio (`/admin/seo`)**: 5-tab metadata command center with live character counters, Google Desktop/Mobile SERP simulator, WhatsApp and Facebook OpenGraph preview cards, AI metadata generator presets, and automated 10-point audit checklist.

---

## 2. MOCKED OR PARTIAL (Mock Data, Simulators, Fallbacks)

The following components currently use simulated behavior, local storage, or mock fallbacks:

| Feature / Module | File Path | Current Status & Mock Implementation | Required for 100% Production |
| :--- | :--- | :--- | :--- |
| **Catalog Data** | `src/lib/mockCatalog.ts` | 6 hard-coded products with remote Unsplash/Google image links. `fetchProducts()` attempts Supabase then falls back to `MOCK_CATALOG`. | Upload master products into Supabase `products`, `product_variants`, and `product_swatches` tables. |
| **Customer Reviews** | `src/lib/mockCatalog.ts` | Static dictionary (`MOCK_REVIEWS`) with 3 pre-written reviews. PDP displays reviews but has no form for verified patrons to write new reviews. | Connect `reviews` table in Supabase and create a "Write a Review" submission modal with star rating and photo upload. |
| **Admin CRM Leads** | `src/app/admin/leads/page.tsx` | Uses `MOCK_LEADS` (7 leads) initialized in React state. Updates persist only to browser `localStorage`. | Synchronize lead status changes, comments, and new leads directly to the Supabase `leads` table via real-time subscriptions. |
| **Admin Orders Ledger** | `src/app/admin/orders/page.tsx` | Uses `MOCK_ADMIN_ORDERS` (6 orders) initialized in React state and stored in `localStorage`. | Query live orders from Supabase `orders` and `payments` tables with real-time status Webhooks. |
| **Admin Inventory & Godown** | `src/app/admin/inventory/page.tsx` | Uses `MOCK_INVENTORY` (8 SKUs) stored in `localStorage`. Adjustments do not update remote database stock. | Bind stock adjustments to `product_variants.stock_count` in Supabase. |
| **Admin Support Tickets** | `src/app/admin/tickets/page.tsx` | Uses `MOCK_TICKETS` (5 tickets) stored in `localStorage`. Replies do not send customer emails. | Link to `tickets` and `ticket_messages` tables; trigger transactional email/WhatsApp on ticket updates. |
| **Abandoned Cart Recovery** | `src/app/admin/abandoned-carts/page.tsx` | Uses `MOCK_ABANDONED_CARTS` (4 carts). Clicking "Send Recovery Nudge" logs a simulation to console. | Track abandoned checkouts in Supabase `cart_items` / `checkouts` table; trigger Resend email with dynamic restore URL. |
| **Executive Reports** | `src/app/admin/reports/page.tsx` | Settlement figures (e.g., ₹88,04,250) are hardcoded static numbers. | Calculate dynamic aggregations using SQL `SUM()` queries over `orders` and `payments` tables. |
| **Admin Settings** | `src/app/admin/settings/page.tsx` | Form inputs trigger a toast notification without persisting configuration to database or file. | Save settings to a `site_settings` table in Supabase or encrypted key-value store. |
| **Razorpay Verification** | `src/app/api/checkout/verify-payment/route.ts` | Accepts `isMock: true` from frontend and creates mock order IDs if Razorpay credentials are unset. | Restrict `isMock` to non-production environments; enforce mandatory HMAC verification for all live payments. |
| **Shiprocket Dispatch** | `src/lib/shipping/shiprocket.ts` | `createShiprocketShipment` falls back to `generateSimulatedShipment` with mock BlueDart AWB (`SR-BD-XXXXXXXXX`). | Provide live Shiprocket API credentials, funded wallet, and real pickup depot address. |
| **WhatsApp Notifications** | `src/lib/notifications/whatsappService.ts` | Logs template JSON to console if Meta API tokens are not provided. | Configure approved WhatsApp Cloud API templates and phone number ID in Meta Business Manager. |
| **Email Service** | `src/lib/notifications/emailService.ts` | Falls back to `console.log` simulation if `RESEND_API_KEY` is not provided. | Verify custom domain in Resend and supply live API key. |

---

## 3. MISSING Versus Target Scope

Comparison against the user's specific functional scope checklist:

| Scope Item | Status | Evaluation & Gap Analysis |
| :--- | :---: | :--- |
| **Home** | **Present** | Complete with Jharokha arch, lotus crest, categories, bestseller carousel, and manifesto. |
| **Listing with Filters/Search/Sort** | **Present** | Complete; filters by category, sizes, colors, material, craft, thread count, price ranges, sort options. |
| **Product Detail with Variants & Reviews** | **Partial** | Variants (size, color) are fully functional. Reviews are read-only mock data; **review submission form is missing**. |
| **Cart** | **Present** | Full cart drawer + standalone page `/cart` with quantity controls, empty state, and free shipping tracker. |
| **Wishlist** | **Present** | Standalone `/wishlist` route, persistent across sessions, move-to-cart capability. |
| **Checkout (UPI/Cards/Wallets + Partial COD)** | **Present** | Complete with Razorpay modal, UPI/card validation, and Partial COD advance calculation. |
| **Order Tracking** | **Present** | Complete with order ID/AWB lookup, 7-step timeline, courier info, and wax seal inspection instructions. |
| **Bulk-Enquiry Form** | **Present** | Multi-step hospitality form with volume tiers, sample binder requests, and lead generation. |
| **Coupons** | **Present** | Validated client-side and in API (`FESTIVE500`, `KUSUMIKA10`, `WELCOME15`). Dynamic coupon management UI is missing. |
| **/admin with Roles (Admin, Sales, Support, Warehouse)** | **Partial** | Role switcher exists in UI and filters tabs; **server-side auth / password protection is completely missing**. |
| **Leads Kanban** | **Present** | Complete with 5 stages (New, Contacted, Quote Sent, Converted, Lost), search, and new lead creation. |
| **Customer Profiles** | **Present** | Customer directory with dossiers, communication timeline, LTV, and loyalty points (localStorage-backed). |
| **Orders & COD Balance Status** | **Present** | Orders ledger with advance vs balance tracking, mark COD collected, BlueDart AWB generation. |
| **Inventory** | **Present** | Godown stock table, low stock alerts, stock adjustment modal, loom status indicators. |
| **Support Tickets** | **Present** | Support ticket list, priority badges, conversation thread viewer, staff reply modal. |
| **Abandoned-Cart Follow-up** | **Present** | Abandoned carts list, nudge dispatch button, recovery discount code generator. |
| **Customer Segmentation** | **Present** | 4 segment views (All Patrons, Royal Patrons, Festive Gifting / B2B, Organic Homeowners). |
| **Reports** | **Partial** | UI exists with print-to-PDF button; **metrics are hardcoded rather than dynamically calculated**. |
| **Shiprocket** | **Partial** | Complete API client with fallback simulation; **live integration requires funded production account**. |
| **WhatsApp / Email** | **Partial** | Complete templates and Resend/Meta API callers; **currently running in fallback simulator mode**. |
| **GST Invoice** | **Present** | Complete GST tax invoice view with 12% rate, HSN classification, and print-ready format. |
| **Analytics / Meta Pixel** | **Present** | Google Analytics 4 and Meta Pixel scripts integrated with Google Consent Mode v2 banner. |
| **SEO** | **Present** | Sitemap.xml, robots.txt, Schema.org JSON-LD, plus complete `/admin/seo` management studio. |
| **Policy Pages** | **Present** | Shipping, returns & exchange, privacy, terms canonical pages and shortcuts. |

---

## 4. DESIGN FIDELITY AUDIT (/design-reference Comparison)

We compared the running application against the design reference specifications in `design-reference/DESIGN.md` at both **Mobile (390px)** and **Desktop (1440px)**:

### 4.1. Color Tokens Fidelity
- **Surface Canvas**: `#FFF8F6` soft ivory is consistently used as the primary background across all storefront and admin pages.
- **Brand Primary**: Deep Heirloom Maroon (`#5C181A` / `#7A2E2E`) is accurately applied to header announcements, primary CTAs, active navigation items, and brand headers.
- **Brand Secondary**: Baked Terracotta (`#994534` / `#B85C4A`) is correctly applied to price highlights, badges, and focus rings.
- **Brand Tertiary**: Muted Olive Leaf (`#616136` / `#AFAE7C`) is accurately applied to loom indicators, stock status tags, and sustainability notes.
- **Accent Gold**: Antique Zari (`#C9A24D`) is consistently used for 5-star ratings, premium badges, and wax seal graphics.
- **Borders & Dividers**: Lime Mortar (`#DAC1BF` / `#E3D3C1`) is applied as 1px subtle dividing lines across cards and headers.

### 4.2. Typography Scale Fidelity
- **Display & Headings**: `EB Garamond` is loaded and applied to brand headlines (`display-lg`, `headline-xl`, `headline-md`).
- **Body & Labels**: `Manrope` is applied to body copy, table text, form inputs, and uppercase tracking labels.
- **Visual Discrepancy (Minor)**: Google Fonts are loaded via external `<link>` tags in `<head>` rather than Next.js native `next/font/google`. On slow mobile networks, this causes a brief Flash of Unstyled Text (FOUT) before Garamond and Manrope render.

### 4.3. Architectural Silhouettes & Lotus Motifs
- **Hero Arch Frame**: The 280px Jharokha arch (`rounded-t-[280px] rounded-b-2xl`) renders on desktop. 
  - *Mobile (390px) Difference*: On 390px viewport, the arch height was adjusted to `h-[420px]` to prevent vertical overflow. The curvature renders smoothly, but images with non-centered subjects can have their top edges cropped by the steep 280px radius.
- **Card Arches**: Product cards use `rounded-t-[5rem]` top arches with tailored 4px corners at the base, matching the Stitch design specification.
- **Lotus Crest**: The golden lotus motif (`🪷` and SVG crests) appears in the header, footer, loading screen, and section dividers.

### 4.4. Desktop (1440px) vs Mobile (390px) Differences

| Page / Element | Desktop (1440px) | Mobile (390px) | Visual / Interaction Difference |
| :--- | :--- | :--- | :--- |
| **Header Navigation** | Full horizontal menu with announcement bar, search input, and right utility icons. | Hamburger menu with slide-out drawer, compact search icon, and bag badge. | **Accurate**: Clean transition with smooth slide-over navigation. |
| **Product Detail Page (PDP)** | Two-column grid (gallery on left, purchase controls on right). | Single-column stacked layout with **sticky bottom action bar** (`₹2,850 • Add to Bag`). | **Enhanced for Mobile**: Added sticky bottom bar ensures checkout CTA is always within thumb reach. |
| **Checkout Summary** | Sticky right-hand order summary card (col-span-5). | Collapsible order summary accordion at top of form. | **Enhanced for Mobile**: Prevents patron from having to scroll past 6 items before entering address. |
| **Collections Catalog** | 3-column grid with sticky left sidebar filter drawer. | 2-column grid with slide-over bottom sheet filter modal. | **Accurate**: Mobile uses a slide-out filter drawer to maximize catalog browsing area. |
| **Admin Shell Navigation** | Fixed 72-width (288px) sidebar on left with live loom monitor ribbon. | Collapsed sidebar hidden behind hamburger button. Top bar has compact horizontal controls. | **Accurate**: Content area dynamically stretches with `lg:pl-72`. |
| **Admin Leads Kanban** | 5 horizontal stage columns side-by-side with horizontal scroll. | Single stacked column view with horizontal swipe or toggle to table mode. | **Usability**: Mobile Kanban requires horizontal scrolling across columns; Table mode is recommended on small screens. |

---

## 5. BUGS & DEFECTS FOUND

During automated route crawling and DOM inspection, the following bugs were detected:

### 1. Broken Links (404 Not Found) — High Impact
- **`/partial-cod`**: Linked in `src/components/layout/Footer.tsx` (Line 144) under *Trade & Care → Partial COD Policy*. Clicking this link returns a 404 page.
  - *Root Cause:* The page was not created as a dedicated route.
  - *Remediation:* Create a redirect or dedicated page at `src/app/partial-cod/page.tsx` linking to the Partial COD charter in `/shipping-policy#cod-charter`.
- **`/wash-care`**: Linked in `src/components/layout/Footer.tsx` (Line 152) under *Trade & Care → Loom & Wash Care*. Clicking this link returns a 404 page.
  - *Root Cause:* The route does not exist.
  - *Remediation:* Create `src/app/wash-care/page.tsx` with handloom care instructions (cold water wash, line dry, gentle iron).

### 2. Native Browser `alert()` in Footer Form — Low Impact
- In `src/components/layout/Footer.tsx` (Line 180), submitting the newsletter form triggers a synchronous browser `alert("Thank you for joining the Kusumika Artisan Gazette!")`.
  - *Remediation:* Replace with the brand toast notification (`showToast(...)`) for a refined user experience.

### 3. Missing Review Submission Capability — Medium Impact
- On `/products/[slug]`, patrons can view 3 static reviews, but there is no "Write a Review" button or modal to submit new reviews.

### 4. Accessibility & Contrast Observations — Medium Impact
- **Tap Targets**: Mobile bottom action bar buttons meet the 48px tap target requirement.
- **Color Contrast**: 
  - Text in `#877271` (outline) on `#FFF8F6` background has a contrast ratio of ~4.1:1, slightly below the 4.5:1 WCAG AA requirement for body text. Recommend darkening secondary caption text to `#544241` (`on-surface-variant`).
- **Missing `aria-label`**:
  - Image thumbnail buttons on PDP lack explicit `aria-label="View product image 2"`.
  - Filter drawer close buttons lack screen-reader text.

---

## 6. SECURITY AUDIT

### 6.1. Unprotected Admin Routes (CRITICAL BLOCKER)
- **Current State:** Navigating to `/admin`, `/admin/orders`, `/admin/leads`, `/admin/seo`, or any sub-route grants instant, unrestricted administrative access without requiring authentication, login credentials, or session cookies.
- **Risk:** Anyone on the internet who discovers the `/admin` URL on your live Vercel deployment can view customer names, phone numbers, delivery addresses, order values, and change lead statuses.
- **Remediation:** Implement Next.js Edge Middleware (`src/middleware.ts`) enforcing session authentication or a protected Admin Login screen (`/admin/login`) with encrypted cookie sessions.

### 6.2. Payment Verification Bypass Parameter (HIGH RISK)
- In `src/app/api/checkout/verify-payment/route.ts` (Line 26):
  ```typescript
  if (!isMock && isRazorpayConfigured()) { ... }
  ```
  If an attacker sends a POST request with `{ "isMock": true }` to `/api/checkout/verify-payment`, the endpoint bypasses cryptographic signature verification and marks the order as confirmed.
- **Remediation:** Remove client-controlled `isMock` bypass in production. Check `process.env.NODE_ENV !== "production"` or verify server-side credentials only.

### 6.3. Unauthenticated Shiprocket Webhook (HIGH RISK)
- In `src/app/api/webhooks/shiprocket/route.ts`:
  The endpoint accepts raw POST requests without verifying any shared secret or token in headers. An attacker could forge webhook payloads to mark orders as "Delivered" or "Cancelled".
- **Remediation:** Add a secret token query parameter or header validation (e.g., `req.headers.get("x-shiprocket-secret") === process.env.SHIPROCKET_WEBHOOK_SECRET`).

### 6.4. Secret Keys Inspection
- `.env.local` contains placeholder mock values (`mock-kusumika.supabase.co`, `rzp_test_...`). No live production credentials or private keys have been leaked into Git history.

---

## 7. PERFORMANCE & ASSET AUDIT

### 7.1. JavaScript Bundle Sizes
From the production build analysis (`next build`):
- **Shared First Load JS**: 87.2 kB (very clean, well under the 128 kB budget).
- **Core Route Sizes**:
  - Homepage (`/`): 6.55 kB (First Load JS: 207 kB)
  - Collections (`/collections`): 169 B (First Load JS: 206 kB)
  - Product Detail (`/products/[slug]`): 9.52 kB (First Load JS: 210 kB)
  - Checkout (`/checkout`): 8.2 kB (First Load JS: 201 kB)
  - SEO Studio (`/admin/seo`): 13.2 kB (First Load JS: 196 kB)
- **Evaluation:** Bundle sizes are lean and well-optimized.

### 7.2. Image Optimization Warning
- Next.js build logged: `⚠ For production Image Optimization with Next.js, the optional 'sharp' package is strongly recommended.`
- **Action:** Install `sharp` in `dependencies` (`npm i sharp`) to enable high-performance WebP/AVIF image transcoding on Vercel.

### 7.3. Google Fonts Loading Strategy
- Fonts are currently loaded using external `<link>` tags in `<head>` (`https://fonts.googleapis.com/...`).
- **Recommendation:** Migrate to `next/font/google` (`import { EB_Garamond, Manrope } from "next/font/google"`). This eliminates external network handshakes and automatically self-hosts the font files.

---

## 8. DEPLOYMENT & ENVIRONMENT STATUS

### 8.1. Environment Variables Audit

| Environment Variable | Status on Local | Status Required on Vercel | Purpose |
| :--- | :---: | :---: | :--- |
| `NEXT_PUBLIC_APP_URL` | Set (`http://localhost:3000`) | `https://kusumika.com` (or Vercel URL) | Canonical URLs, OpenGraph, Webhook callbacks |
| `NEXT_PUBLIC_SUPABASE_URL` | Mock | **Missing / Required** | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Mock | **Missing / Required** | Supabase anonymous browser client key |
| `SUPABASE_SERVICE_ROLE_KEY` | Mock | **Missing / Required** | Server-side admin queries bypassing RLS |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Mock (`rzp_test_...`) | **Missing / Required** | Razorpay key (Test or Live) |
| `RAZORPAY_KEY_SECRET` | Mock | **Missing / Required** | Razorpay HMAC verification secret |
| `RAZORPAY_WEBHOOK_SECRET` | Unset | **Recommended** | Verifies Razorpay webhook events |
| `SHIPROCKET_EMAIL` | Mock | **Missing / Required** | Shiprocket API login |
| `SHIPROCKET_PASSWORD` | Mock | **Missing / Required** | Shiprocket API password |
| `SHIPROCKET_PICKUP_LOCATION` | Unset | `"Jaipur Central Depot"` | Exact pickup address name in Shiprocket |
| `WHATSAPP_ACCESS_TOKEN` | Mock | Optional (for live WhatsApp) | Meta Cloud API permanent system user token |
| `WHATSAPP_PHONE_NUMBER_ID` | Mock | Optional (for live WhatsApp) | Meta WhatsApp Phone Number ID |
| `RESEND_API_KEY` | Unset | Optional (for live emails) | Resend API key for order confirmations |
| `NOTIFICATION_EMAIL_FROM` | Mock | Optional | `Kusumika Atelier <orders@kusumika.com>` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Unset | Optional | Google Analytics 4 tracking ID |
| `NEXT_PUBLIC_META_PIXEL_ID` | Unset | Optional | Meta (Facebook) Pixel ID |

### 8.2. Domain & DNS Status
- The code is committed and pushed to GitHub: `https://github.com/Raghav-ux157/kusumika-website.git` (`main` branch).
- When imported to Vercel, the app automatically deploys to `<project-name>.vercel.app`.
- Custom domain `kusumika.com` requires pointing DNS A record to `76.76.21.21` or CNAME to `cname.vercel-dns.com`.

---

## 9. PRIORITISED ACTION PLAN

### 🔴 Phase A: Blockers (Must Complete Before Launch)
1. **Secure Admin Routes**:
   - Create an Admin Login page (`/admin/login`) with username/email and password (or PIN code).
   - Implement Next.js middleware to block unauthenticated access to `/admin/*`.
2. **Close Payment Security Loophole**:
   - In `/api/checkout/verify-payment`, reject `isMock: true` requests when running in production.
3. **Fix 404 Footer Routes**:
   - Create `src/app/partial-cod/page.tsx` and `src/app/wash-care/page.tsx`.
4. **Configure Production Database**:
   - Connect real Supabase project credentials in Vercel.
   - Run `supabase/schema.sql` and `supabase/seed.sql` to instantiate live tables and initial catalog.

### 🟡 Phase B: Important (High Priority for Operational Excellence)
5. **Secure Shiprocket Webhook**:
   - Add shared token authentication to `/api/webhooks/shiprocket`.
6. **Live Payment & Shipping Gateways**:
   - Replace Razorpay test keys with live keys (`rzp_live_...`).
   - Fund Shiprocket shipping wallet (minimum ₹500) and verify pickup location name.
7. **Production Image Optimization**:
   - Install `sharp` package to optimize remote images.
8. **Font Optimization**:
   - Migrate from external Google Font `<link>` tags to Next.js `next/font/google`.

### 🟢 Phase C: Nice-to-Have (Post-Launch Polish)
9. **Interactive Review Submission**:
   - Build a modal on PDP allowing verified customers to submit ratings, reviews, and fabric photos.
10. **Dynamic CRM Reports**:
    - Replace static financial summaries in `/admin/reports` with live SQL aggregations.
11. **Transactional Email & WhatsApp Live Modes**:
    - Verify sending domain in Resend (`orders@kusumika.com`) and configure WhatsApp Business templates.

---

## 10. Recommended Next Phase: Phase 7 (Security Hardening & Live Integrations)

We recommend proceeding immediately to **Phase 7: Production Security Hardening & Infrastructure Binding**:
1. Implement the `/admin/login` authentication barrier and Next.js middleware protection.
2. Resolve the 2 broken footer routes (`/partial-cod` and `/wash-care`).
3. Seal the payment verification security check so only cryptographically signed transactions are captured.
4. Set up live database connectivity and guide environment variable deployment on Vercel.
