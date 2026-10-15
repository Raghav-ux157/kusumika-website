# Kusumika - Atelier Heritage Design System Reference
*Extracted from Stitch Project `18093954457664837866`*

## Brand & Style
The design system embodies the warmth, serenity, and timeless dignity of heritage Indian artisanal luxury. It bridges traditional textile craftsmanship with refined digital commerce, evoking the tactile sensory experience of soft weaves, block prints, and ancestral haveli architecture.

The aesthetic is **Tactile Editorial Heritage**:
- **Atmosphere:** Warm, luminous, and grounding. Surfaces evoke sun-washed lime plaster, handmade textured cotton, and aged parchment rather than stark synthetic screens.
- **Demeanor:** Quietly opulent and confident. It rejects hurried e-commerce tropes in favor of spacious, museum-grade curation, storytelling, and generational permanence.
- **Visual Expression:** Characterized by delicate framing, architectural silhouettes drawn from Rajasthani jharokha arches, organic linework, and typographic distinction.

---

## Color Tokens

```yaml
colors:
  # Surfaces & Canvas
  surface: '#fff8f6'                   # Base Soft Ivory canvas
  surface-dim: '#e7d7d2'               # Dim surface for photo backdrops
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'  # Pure crisp white for cards/drawers
  surface-container-low: '#fff1ec'     # Hero & section subtle tint
  surface-container: '#fbeae5'         # Warm Cream surface
  surface-container-high: '#f5e5e0'    # Raised cards/buttons
  surface-container-highest: '#f0dfda' # Tag badges & borders
  surface-variant: '#f0dfda'
  surface-tint: '#984543'

  # Ink & Typographic Neutrals
  on-surface: '#221a17'                # Deep Charcoal Bark (Primary typography ink)
  on-surface-variant: '#544241'        # Desert Sand (Secondary text, captions)
  on-background: '#221a17'
  background: '#fff8f6'
  inverse-surface: '#382e2b'
  inverse-on-surface: '#feede8'

  # Brand Primary: Deep Heirloom Maroon
  primary: '#5c181a'                   # Deepest Maroon
  primary-container: '#7a2e2e'         # Deep Heirloom Maroon (Core brand mark & CTA)
  on-primary: '#ffffff'
  on-primary-container: '#ff9a96'
  inverse-primary: '#ffb3b0'
  primary-fixed: '#ffdad8'
  primary-fixed-dim: '#ffb3b0'
  on-primary-fixed: '#3f0207'
  on-primary-fixed-variant: '#7a2e2e'

  # Brand Secondary: Baked Terracotta
  secondary: '#994534'                 # Baked Terracotta
  secondary-container: '#fe947e'       # Bright Terracotta accent
  on-secondary: '#ffffff'
  on-secondary-container: '#762b1c'
  secondary-fixed: '#ffdad3'
  secondary-fixed-dim: '#ffb4a5'
  on-secondary-fixed: '#3f0400'
  on-secondary-fixed-variant: '#7b2e1f'

  # Brand Tertiary: Muted Olive Leaf
  tertiary: '#616136'                  # Muted Olive Leaf
  tertiary-container: '#afae7c'        # Sage container
  on-tertiary: '#ffffff'
  on-tertiary-container: '#41421a'
  tertiary-fixed: '#e7e5af'
  tertiary-fixed-dim: '#cac995'
  on-tertiary-fixed: '#1d1d00'
  on-tertiary-fixed-variant: '#494920'

  # Brand Accent Gold: Antique Zari
  accent-gold: '#c9a24d'               # Antique Zari gold for luxury highlights & ratings

  # Outlines & Structural Linework
  outline: '#877271'                   # Muted border
  outline-variant: '#dac1bf'           # Lime Mortar 1px structural dividing lines
  border-subtle: '#e3d3c1'

  # Error & Alerts
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
```

---

## Typography Scale

```yaml
typography:
  display-lg:
    fontFamily: EB Garamond
    fontSize: 3.5rem (56px)
    fontWeight: '400'
    lineHeight: 4rem
    letterSpacing: -0.01em
  headline-xl:
    fontFamily: EB Garamond
    fontSize: 2.5rem (40px)
    fontWeight: '400'
    lineHeight: 3rem
  headline-lg:
    fontFamily: EB Garamond
    fontSize: 2rem (32px)
    fontWeight: '500'
    lineHeight: 2.5rem
  headline-md:
    fontFamily: EB Garamond
    fontSize: 1.5rem (24px)
    fontWeight: '500'
    lineHeight: 2rem
  headline-sm:
    fontFamily: EB Garamond
    fontSize: 1.25rem (20px)
    fontWeight: '600'
    lineHeight: 1.75rem
  body-lg:
    fontFamily: Manrope
    fontSize: 1.125rem (18px)
    fontWeight: '400'
    lineHeight: 1.875rem
  body-md:
    fontFamily: Manrope
    fontSize: 1rem (16px)
    fontWeight: '400'
    lineHeight: 1.625rem
  body-sm:
    fontFamily: Manrope
    fontSize: 0.875rem (14px)
    fontWeight: '400'
    lineHeight: 1.375rem
  label-lg:
    fontFamily: Manrope
    fontSize: 0.875rem (14px)
    fontWeight: '600'
    lineHeight: 1.25rem
    letterSpacing: 0.06em
  label-md:
    fontFamily: Manrope
    fontSize: 0.75rem (12px)
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.08em
  label-sm:
    fontFamily: Manrope
    fontSize: 0.6875rem (11px)
    fontWeight: '500'
    lineHeight: 0.875rem
    letterSpacing: 0.1em
```

---

## Architectural Silhouettes & Corner Radii

- **Architectural Jharokha Arch:**
  - Hero Display Arch: `rounded-t-[280px] rounded-b-2xl`
  - Product Card Arch: `rounded-t-[5rem]` (`80px` top arch with crisp base)
- **Standard Corners:**
  - `sm`: `0.125rem` (2px)
  - `DEFAULT`: `0.25rem` (4px - Tailored architectural linen corners for buttons & inputs)
  - `lg`: `0.5rem` (8px - Lookbook cards & banners)
  - `xl`: `0.75rem` (12px - Product cards & floating panels)
  - `full`: `9999px` (Pills, badges & circular buttons)

---

## Key Stitch Screens Reference
1. `d7c87d88ce544adfac11f342d37bd774` - Home (Editorial Layout Variant)
2. `b00e871e1a8e4f60b6d9a3124356595c` - Bedsheets & Handcrafted Linens Collection (PLP Desktop)
3. `802b930f63574e088c77b45a4f650146` - Marwar Lotus 400TC Bedsheet Set (PDP Desktop)
4. `e60f1dbb69e94b099d1db63dd9584454` - Cart (Desktop)
5. `9ff3c32ae2d34e35b4d90c2ca303b60a` - Checkout & Partial COD (Desktop)
6. `8c7c4771d5bb4d7da10292a80eebc34c` - Customer Account & Order Tracking (Desktop)
7. `40c4505b413f4a7da35c81f269602c23` - Home (Mobile)
8. `e37bd40617144973947e79cf3a482112` - Collection (PLP Mobile)
9. `a20dfa5163b74c6fbb297a7d71fd9e97` - Bedsheet PDP (Mobile)
10. `337964dc6f4f47b7979008811344c9dc` - Cart (Mobile)
11. `f5a606d724b24acfbff200df0adafccc` - Checkout & Partial COD (Mobile)
12. `abf12248a2a245d88c218d5571a8ebf5` - Bulk & Hospitality Order Form (Mobile)
13. `abc1484001d34f0ba8b444ac4b23ea1f` - CRM Leads Pipeline (Kanban)
14. `ef029e04cbec42bc8bc35dbf73c7a76a` - CRM Orders & Partial COD Ledger
15. `c4ec5554fa044b1fb09934b07b9f6343` - CRM Patron Profile & Communication Timeline
16. `3cf313f5147b42748d49c21bac63624e` - CRM Inventory & Godown Stock
17. `e31402e9ffda4a249dea264b2f769814` - CRM Support Tickets & Patron Care Inbox
18. `bac289b992d44555ba828db92f0875ac` - CRM Abandoned Cart Recovery & Concierge
19. `015d393759564725b3979904b9eec991` - CRM Operations & Executive Analytics
