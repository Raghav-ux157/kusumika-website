# Kusumika • Luxury Artisanal Home Textiles & CRM Platform

> *"Soft like Silk, Feels like a Hug"*

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database_%26_Auth-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Partial_COD_%26_UPI-0C2340?style=for-the-badge&logo=razorpay)](https://razorpay.com/)
[![Shiprocket](https://img.shields.io/badge/Shiprocket-Logistics_%26_Tracking-FF6B00?style=for-the-badge)](https://shiprocket.in/)

Kusumika is a production-ready, full-stack luxury e-commerce platform and operational CRM engineered for a heritage Indian home textiles maison (bedsheets, dohars, quilts, waffle towels, cushions). Hand-loomed in Jaipur with breathable 400–800 thread counts, botanical dyes, and gentle organic washes.

---

## ✨ Key Features & Architectural Capabilities

### 🌸 1. Storefront Experience
* **Artisanal Aesthetics**: Tailored design system with Warm Cream (`#FFF8F6`), Heirloom Maroon (`#5C181A`), Terracotta (`#994534`), and Olive (`#616136`) tokens.
* **Architectural Framing**: Consistent Jharokha arch frame motifs and golden lotus dividers.
* **Catalog & Variant Engine**: Thread count selectors (400TC / 600TC / 800TC), sizes (Single, Queen, King), dynamic image galleries, customer reviews, and live Indian postal pincode check.
* **Hospitality Trade & Bulk Orders**: Bespoke bulk quotation workflow with automated lead generation for boutique hotels and luxury resorts.

### 💳 2. Partial COD & Payment Engine
* **Hybrid Cash-on-Delivery**: Customers pay a configurable nominal advance (e.g. 20% or ₹500) online via Razorpay (UPI, Credit/Debit Cards, NetBanking), and the remaining balance is collected upon doorstep delivery.
* **Drop-off & Failure Recovery**: Context-aware payment notices with cart and address state preservation.
* **Webhook Settlement**: Automated verification of digital signatures and database payment reconciliations.

### 🚚 3. Logistics & Consignment Radar
* **Shiprocket Integration**: Automated adhoc order dispatch with BlueDart and Delhivery courier assignment.
* **Consignment Radar**: Live timeline tracking showing dispatch checkpoints and the **Doorstep Wax Seal Inspection Guarantee**.

### 🧾 4. Statutory Indian GST Invoicing
* **Rule 46 Compliant Tax Invoice**: Single-page printable A4 layout with state code classification (Rajasthan 08 intra-state CGST/SGST vs inter-state IGST), HSN `6302`/`9404`, and Indian currency words conversion (Lakhs & Crores).
* **Doorstep Balance Ledger**: Explicit documentation of online advance payment vs pending doorstep collection.

### 💬 5. Multi-Channel Notifications
* **WhatsApp Cloud API (Meta)**: Automated transaction notices for order confirmation, shipment dispatch with GPS tracking, out-for-delivery inspection reminders, and cart recovery.
* **Resend Transactional Email**: Luxury editorial HTML notifications for customers and warehouse managers.

### 🛡️ 6. Full Operations CRM Suite (`/admin`)
* **Role-Based Access Control (RBAC)**: Admin, Sales, Support, and Warehouse operational views.
* **Hospitality Kanban Pipeline**: Drag-and-drop B2B deal progression (New Enquiry $\rightarrow$ Swatches Sent $\rightarrow$ Loom Scheduled $\rightarrow$ Contract Won).
* **Inventory & Loom Monitoring**: Real-time stock alerts and manual stock adjustments.
* **Abandoned Cart Recovery**: Direct WhatsApp concierge outreach with one-click privilege discounts (`HEIRLOOM5`).

### 🔍 7. SEO, Privacy & Modern Web Standards
* **Schema.org Microdata**: Comprehensive JSON-LD structured data for `Organization`, `WebSite`, `Product`, `BreadcrumbList`, and `FAQPage`.
* **Dynamic Sitemap & Robots**: Next.js App Router dynamic `/sitemap.xml` and `/robots.txt`.
* **DPDP Act 2023 & Google Consent Mode v2**: Privacy banner with granular cookie consent preferences (Essential, Analytics, Marketing).

---

## 🚀 Getting Started

### Prerequisites
* Node.js 18.17+ or 20+
* npm or pnpm

### 1. Clone & Install
```bash
git clone https://github.com/Raghav-ux157/kusumika-website.git
cd kusumika-website
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Razorpay (Test / Live)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_kusumika_sandbox
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Shiprocket Logistics
SHIPROCKET_EMAIL=tech@kusumika.com
SHIPROCKET_PASSWORD=your_shiprocket_password
SHIPROCKET_PICKUP_LOCATION="Jaipur Central Depot"

# WhatsApp Cloud API & Notifications
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_system_user_token
WHATSAPP_BUSINESS_ACCOUNT_ID=your_waba_id
RESEND_API_KEY=re_your_api_key
EMAIL_FROM="Kusumika Atelier <orders@kusumika.com>"

# Analytics & Tracking
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=104829104820194
```

### 3. Run Locally
```bash
# Run Development Server
npm run dev

# Run Production Build
npm run build
npm start
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📁 Project Structure

```
├── src/
│   ├── app/                    # Next.js 14 App Router routes & layouts
│   │   ├── (storefront)/       # Home, Catalog, Product Detail, Cart, Wishlist, Checkout
│   │   ├── account/            # Patron Account & Orders & Tax Invoice
│   │   ├── admin/              # Operations Dashboard, Leads Kanban, Inventory, Orders
│   │   ├── api/                # API Endpoints (Razorpay, Shiprocket, Invoices, Webhooks)
│   │   ├── sitemap.ts          # Dynamic XML Sitemap generator
│   │   ├── robots.ts           # Dynamic Robots.txt generator
│   │   ├── error.tsx           # Luxury Error Boundary
│   │   ├── loading.tsx         # Atmospheric Skeleton Loader
│   │   └── not-found.tsx       # Architectural 404 Jharokha Arch
│   ├── components/             # Reusable UI, Layout, Commerce, & SEO components
│   ├── context/                # StoreContext (Cart, Wishlist, Auth, State)
│   ├── lib/                    # SDK Clients (Supabase, Razorpay, Shiprocket, Invoicing)
│   └── types/                  # TypeScript interface definitions
```

---

## 📜 License & Craft
Crafted with devotion for **Kusumika Artisanal Textiles Pvt. Ltd.**, Jaipur, Rajasthan.
All rights reserved © 2026.
