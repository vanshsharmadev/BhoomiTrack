---
name: Sovereign Civic Infrastructure
colors:
  surface: '#f8f9ff'
  surface-dim: '#cadcf4'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eef4ff'
  surface-container: '#e4efff'
  surface-container-high: '#dbe9ff'
  surface-container-highest: '#d2e4fd'
  on-surface: '#0a1d2f'
  on-surface-variant: '#43474d'
  inverse-surface: '#213245'
  inverse-on-surface: '#e9f1ff'
  outline: '#74777e'
  outline-variant: '#c4c6ce'
  surface-tint: '#49607e'
  primary: '#000f22'
  on-primary: '#ffffff'
  primary-container: '#0a2540'
  on-primary-container: '#768dad'
  inverse-primary: '#b0c8eb'
  secondary: '#3a6188'
  on-secondary: '#ffffff'
  secondary-container: '#acd2ff'
  on-secondary-container: '#335b81'
  tertiary: '#200700'
  on-tertiary: '#ffffff'
  tertiary-container: '#421700'
  on-tertiary-container: '#e46514'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d2e4ff'
  primary-fixed-dim: '#b0c8eb'
  on-primary-fixed: '#001c37'
  on-primary-fixed-variant: '#314865'
  secondary-fixed: '#d0e4ff'
  secondary-fixed-dim: '#a3caf6'
  on-secondary-fixed: '#001d35'
  on-secondary-fixed-variant: '#1f496f'
  tertiary-fixed: '#ffdbcb'
  tertiary-fixed-dim: '#ffb693'
  on-tertiary-fixed: '#341000'
  on-tertiary-fixed-variant: '#7a3000'
  background: '#f8f9ff'
  on-background: '#0a1d2f'
  surface-variant: '#d2e4fd'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-lg:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  headline-sm:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
  label-md:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 12px
  code-tabular:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.5rem
  margin-mobile: 0.75rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 1.75rem
---

## Brand & Style

This design system establishes an institutional, authoritative, and audit-grade digital workspace engineered for the National Land Acquisition & Management System (NLAMS). Serving district revenue officers, cadastral surveyors, legal adjudicators, highway planning authorities, and project directors across India, the interface prioritizes evidentiary clarity, procedural rigor, and unimpeachable legibility.

### Core Philosophy
- **Constitutional Authority & Neutrality:** Visually grounded, sober, and free of cosmetic distractions. The interface evokes legal permanence, administrative precision, and public trust.
- **Evidentiary Density:** Large-scale land acquisition demands high information density—parcel schedules, gazette notifications, award matrices, GIS cadastre overlays, and grievance workflows. Data is systematically gridded, legible at high scanning velocity, and prioritized over decorative padding.
- **Tri-Color Civic Accents:** National identity is conveyed through restrained, functional status markers (deep sovereign navy, disciplined saffron for pending actions/notices, enterprise green for clearances/disbursements).
- **Absolute Accessibility (WCAG AAA):** High contrast ratios against crisp backgrounds ensure reliable field operations on ruggedized field tablets, standard-issue government monitors, and low-bandwidth rural collectorate terminals.

### Design Movement
**Institutional Modernism with High-Density Grid Structure.** Sharp, hairline-bordered container architectures, architectural rule lines, strict vertical rhythms, and zero artificial ornamentation (no glassmorphism, no non-semantic gradients, no exaggerated drop shadows).

## Colors

The color system enforces a rigorous institutional hierarchy built around public governance, administrative status, and legal validation. Contrast ratios meet or exceed WCAG 2.1 AAA benchmarks across all standard viewports.

### Primary Palette
- **Deep Sovereign Navy (`#0A2540`):** Core structural chrome, application top-bar, modal primary headers, primary CTA backgrounds, and active state highlights.
- **Administrative Blue (`#0B3B60`):** Secondary structural headers, table sort controls, active navigation nodes, and focused link anchors.

### National Civic & Operational Accents
- **Ashoka Ochre / Saffron (`#D95D08`):** Restrained civic indicator for statutory notices, Section 11/19 notifications under RFCTLARR, pending collector approvals, and warning states. Tuned for AAA contrast against white surfaces.
- **India Enterprise Green (`#107307`):** Direct clearance indicators, award disbursement confirmations, executed deed records, and validated land parcels.
- **Judicial Crimson (`#A61B1B`):** Restrained destructive actions, litigation flags, contested title alerts, and stay-order warnings.

### Canvas & Structural Neutrals
- **Canvas Base (`#F4F6F9`):** Non-glare, slate-tinted neutral surface engineered to prevent eye strain during 8-hour administrative audit cycles.
- **Surface Elevation (`#FFFFFF`):** High-clarity white backing for data grids, parcel manifests, and interactive forms.
- **Hairline Border (`#D1D9E2`):** Universal 1px structural dividing lines for cell borders, card edges, and tab demarcations.
- **Deep Charcoal Typography (`#0F172A`):** Ultra-high-contrast text baseline for primary data attributes.
- **Subdued Slate Typography (`#506176`):** Secondary metadata, survey token identifiers, and column subtitles.

## Typography

The type system is calibrated for tabular efficiency, dense data comprehension, and unambiguous legibility across alphanumeric cadastral identifiers (e.g., Khasra, Survey Nos., Aadhaar-linked tokens, and statutory section references).

### Typographic Directives
- **Font Configuration:** `Inter` is applied globally. It is strictly configured with OpenType features `cv02` (open 4), `cv03` (open 6), `cv04` (open 9), and `tnum` (tabular lining figures) enabled across all numeric inputs, spatial metric columns, compensation amounts, and area dimensions.
- **Letter Spacing:** All uppercase administrative labels (`label-sm`, `label-md`) must enforce a `+0.04em` tracking to preserve legibility in dense legal header strips.
- **Hierarchy Stacking:** Bold headings are reserved strictly for page titles, parcel record cards, and aggregate valuation summaries. Inline metadata relies on distinct weight contrast (600 semi-bold for field keys, 400 regular for values) rather than excessive size variations.

## Layout & Spacing

The layout architecture implements a high-density, multi-pane operational canvas tailored for dual-screen cadastral verification, GIS map cross-referencing, and continuous table audit workflows.

### Grid & Canvas Specs
- **Desktop (≥ 1440px):** 12-column or 16-column structural grid with 1.5rem margins and 1rem gutters. Supports standard enterprise 3-pane split architectures: Navigation Tree (240px fixed), Data Master Matrix (flexible), and Spatial/GIS Preview Panel (480px collapsible or pinned).
- **Tablet (768px – 1439px):** Responsive 8-column layout. The secondary spatial drawer docks beneath the parcel roster or slides as a high-performance bottom sheet.
- **Mobile (≤ 767px):** Single-column stacked layout with 0.75rem margins. Designed for district field inspections; data tables reflow into dense key-value summary cards.

### Spacing Principles
- Density takes precedence over expansive negative space. Form fields, table rows, and status indicators operate on an uncompromising 4px baseline sub-rhythm (`space-xs` = 4px, `space-sm` = 8px, `space-md` = 12px, `space-lg` = 20px, `space-xl` = 28px).
- Vertical margins between distinct administrative modules are locked to `space-lg` to maintain cognitive boundary without fragmenting the audit trail.

## Elevation & Depth

This system intentionally rejects ambient blur layers, skeuomorphic extrusion, and ornamental drop shadows. Depth and hierarchy are achieved entirely through structural layering, border contrast, and tonal surface steps.

### Elevation Levels
- **Floor Level (`#F4F6F9`):** Application foundation, global background behind data modules and workspace canvases.
- **Structural Tier 1 (`#FFFFFF`):** Data cards, cadastral registries, form panels, and analytical metric blocks. Separated from the base canvas strictly via a continuous `1px solid #D1D9E2` hairline boundary. No shadow.
- **Structural Tier 2 (`#FFFFFF`):** Interactive menus, contextual action popovers, and cadastral coordinate inspect overlays. Retains the `1px solid #D1D9E2` border and adds a precise, low-spread administrative shadow: `0 2px 4px rgba(10, 37, 64, 0.08)`.
- **System Tier 3 (Modals, Legal Approval Gates):** Critical administrative confirmations and gazette publication sign-offs. Backed by a high-opacity institutional backdrop (`rgba(10, 37, 64, 0.60)`), framed in `1px solid #0A2540`, with an elevated grounding shadow: `0 8px 24px rgba(10, 37, 64, 0.16)`.

## Shapes

The geometric framework is functional, sharp, and disciplined. Soft, playful border radii are strictly excluded in favor of precise, rectilinear architectural containment.

### Corner Radii Hierarchy
- **Standard UI Elements (`0.25rem` / 4px):** Form controls, inputs, action buttons, alert banners, and notification callouts use minimal, crisp 4px corners to communicate precision without harsh needle points.
- **Structural Panels & Cards (`0.25rem` / 4px):** Data tables, map containment viewports, and audit list groups maintain uniform 4px corner radii matching standard UI controls.
- **System Badges & Status Pills (`9999px`):** Status indicators (e.g., "Award Approved", "Notice Dispatched", "Under Litigation") use full rounded pill geometry to instantly distinguish classification markers from interactive rectangular buttons and inputs.

## Components

### Buttons
- **Primary Sovereign:** Solid `#0A2540` background, `#FFFFFF` text, `4px` radius, `0 1px 2px rgba(10,37,64,0.1)`. Hover shifts to `#0B3B60`. Focus indicator: crisp `2px solid #0A2540` with `2px` offset.
- **Secondary Civic:** Clean `#FFFFFF` fill with `1px solid #D1D9E2` border, text `#0A2540`. Hover shifts background to `#F4F6F9`.
- **Statutory Danger:** Direct action for objections/revocations. Transparent fill with `1px solid #A61B1B` border and text `#A61B1B`. Hover fills `#A61B1B` with `#FFFFFF` text.
- **Padding:** Compact height standards: Small (28px), Medium (34px), Large (40px). Vertical padding constrained to `space-xs` and `space-sm`.

### Data Grids & Cadastral Tables
- **Header Cells:** `#F8FAFC` background, `1px solid #D1D9E2` bottom rule, uppercase `label-sm` tracking with `#506176` slate coloring. Height: 36px.
- **Body Rows:** `#FFFFFF` background with alternating subtle tinting (`#FAFCFE`) on ultra-wide matrices. Dense row height: 38px. Border bottom `1px solid #E2E8F0`. Hover row state: `#F1F5F9`.
- **Numeric & Metric Cells:** Right-aligned, formatted with `code-tabular` Inter lining digits and clear unit notation (e.g., "1.4250 Ha", "₹14,20,500").

### Status Badges & Pills
- **Geometry:** Pill-shaped (9999px border-radius), inline-flex, uppercase `label-sm`, padding `2px 8px`.
- **Approved / Disbursed:** Background `#EAF7EC`, Text `#107307`, Border `1px solid #B8E4BC`.
- **Pending / Notification Section 11:** Background `#FEF3EB`, Text `#D95D08`, Border `1px solid #FCD3B6`.
- **Litigation / Stay Order:** Background `#FDEAEA`, Text `#A61B1B`, Border `1px solid #F8B4B4`.
- **Draft / In Review:** Background `#EDF2F7`, Text `#0B3B60`, Border `1px solid #CBD5E1`.

### Input Fields & Selects
- Height locked to 34px for enterprise desktop ergonomics. Background `#FFFFFF`, border `1px solid #D1D9E2`, border-radius `4px`, text `body-md` (`#0F172A`).
- **Focus State:** Border color `#0A2540`, outline `2px solid rgba(10,37,64,0.15)`. No chromatic halo.
- **Labels:** Uppercase or sentence-case `label-md` seated 4px above the input with explicit mandatory red asterisk (`#A61B1B`).

### Checkboxes & Radio Controls
- Square 16px boxes with `2px` border-radius. Unchecked: `1.5px solid #506176` on white. Checked: `#0A2540` fill with solid white checkmark vector. Radio buttons use matching 16px concentric circle geometry.

### Cadastre & GIS Control Overlays
- Floating map toolbars use `#FFFFFF` backing, `1px solid #D1D9E2`, `4px` radius, and Tier 2 subtle shadow. Map layer chips use `label-md` with toggled solid-state backgrounds (`#0A2540` for active boundary layers, `#FFFFFF` for disabled).