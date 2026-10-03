---
name: Sovereign Civic Infrastructure - National Land Acquisition Management System (NLAMS / BhoomiTrack)
version: 2.4.0
authority: Government of India • Ministry of Rural Development • Department of Land Resources (DoLR) • PM GatiShakti NMP
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
  civic-green: '#107307'
  civic-saffron: '#d95d08'
  civic-crimson: '#a61b1b'
typography:
  fontFamily: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
  features: cv02, cv03, cv04, tnum
  headline-xl: { fontSize: '30px', fontWeight: '700', lineHeight: '38px' }
  headline-lg: { fontSize: '22px', fontWeight: '700', lineHeight: '28px' }
  headline-md: { fontSize: '18px', fontWeight: '600', lineHeight: '24px' }
  headline-sm: { fontSize: '15px', fontWeight: '600', lineHeight: '20px' }
  body-lg: { fontSize: '15px', fontWeight: '400', lineHeight: '22px' }
  body-md: { fontSize: '13px', fontWeight: '400', lineHeight: '18px' }
  body-sm: { fontSize: '12px', fontWeight: '400', lineHeight: '16px' }
  label-lg: { fontSize: '13px', fontWeight: '600', lineHeight: '16px' }
  label-md: { fontSize: '11px', fontWeight: '600', lineHeight: '14px' }
  label-sm: { fontSize: '10px', fontWeight: '600', lineHeight: '12px' }
  code-tabular: { fontSize: '12px', fontWeight: '500', lineHeight: '16px' }
rounded:
  sm: '0.125rem'
  DEFAULT: '0.25rem'
  md: '0.375rem'
  lg: '0.5rem'
  xl: '0.75rem'
  full: '9999px'
---

# National Land Acquisition Management System (NLAMS / BhoomiTrack)
## Sovereign Civic Infrastructure Design System Specification

This document is the authoritative standard for all visual and operational user experiences across the BhoomiTrack National Land Acquisition Management System.

---

## 1. Product Vision & Core Principle
The platform manages the complete statutory acquisition lifecycle under the **Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013 (RFCTLARR Act)** and the **PM GatiShakti National Master Plan (NMP)**.

### The Operational Cycle
```
PROJECT INITIATION
  → DPR / PROPOSAL SCRUTINY (Sec 4 SIA)
  → LAND IDENTIFICATION & BHU-NAKSHA INGESTION
  → CADASTRAL VERIFICATION & JAMABANDI 7/12 MAPPING
  → JOINT VERIFICATION & SURVEY (JEV) (DGPS/NavIC RTK)
  → LEGAL NOTIFICATION (Sec 11 Preliminary Gazette)
  → CLAIMS & OBJECTIONS (Sec 15 Hearings)
  → LEGAL NOTIFICATION (Sec 19 Declaration of Acquisition)
  → VALUATION & STATUTORY AWARD (Sec 23 + 100% Solatium)
  → COMPENSATION & DIRECT BENEFIT TRANSFER (PFMS / RTGS)
  → REHABILITATION & RESETTLEMENT (Schedule II Entitlements)
  → PHYSICAL POSSESSION & VESTING (Sec 38 Panchnama)
  → PROJECT CLOSURE & ASSET TRANSFER
  → AUDIT, RTI & PARLIAMENTARY RETURNS
```

### Core Axiom
$$\text{DATA} \longrightarrow \text{VISUALIZATION} \longrightarrow \text{UNDERSTANDING} \longrightarrow \text{ACTION} \longrightarrow \text{AUDIT}$$

---

## 2. Role-Based UX Architecture
Access to internal modules and administrative actions is strictly governed by role context:
- **Central / National Government**: Macro portfolio analytics, inter-state velocity comparisons, national GIS, high-risk early warning radar, Parliamentary reporting, Cabinet briefings.
- **State Government (State Nodal Officers / CALA)**: State-wide corridor tracking, district velocity comparison, gazette vetting, CALA resource deployment.
- **District / Field Administration (Collector / SDM / CALA)**: Operational dossier management, Khasra-level hearing schedules, Sec 23 award generation, Panchnama approvals.
- **Finance Officer**: Sanctioned escrow oversight, PFMS host-to-host DBT execution, bank account validation, exception reconciliation.
- **Field / JEV Officer (Amin / Revenue Inspector / Engineer)**: Field-first rugged UI with offline sync, GPS/GNSS RTK rover telemetry, geo-tagged photo/video capture, digital party signatures.
- **Auditor / Transparency Officer**: Immutable cryptographic audit logs (STQC L-4), RTI response timers, gazette hash validation.
- **Citizen / Landowner**: Dedicated standalone portal. Zero administrative noise. Focus on: *My Land*, *Khasra Status*, *Award Notice*, *DBT Payment Status*, *R&R Grants*, and *File Grievance*.

---

## 3. Visual System & Color Tokens

### Primary Palette
- **Deep Sovereign Navy (`#0A2540` / `#000F22`)**: Structural top chrome, primary brand elements, modal headers, authoritative buttons.
- **Administrative Blue (`#0B3B60`)**: Navigation nodes, active state borders, secondary headers.
- **Canvas Base (`#F8F9FF` / `#F4F6F9`)**: Non-glare slate backing engineered to reduce fatigue during extended audit sessions.
- **Surface Elevation (`#FFFFFF`)**: Pure white data cards, table backgrounds, and input fields.
- **Hairline Dividing Rules (`#D1D9E2`)**: Universal 1px structural demarcations. Ambient blurs, gradients, and exaggerated shadows are prohibited.

### Civic & Operational Status Tokens
- **Enterprise Green (`#107307` / `#138808`)**: Clean title clearances, PFMS DBT settlement, possession vested, verified survey.
- **Ashoka Ochre / Saffron (`#D95D08` / `#E06D10`)**: Statutory Sec 11/19 publication windows, 60-day objection clocks, warning notices.
- **Judicial Crimson (`#A61B1B` / `#BA1A1A`)**: Stay orders, litigation flags, contested titles, Sec 19 lapse risk (< 30 days).

---

## 4. Layout Architecture & Screen Templates

### Dual-Layer Navigation
- **Persistent Sovereign Topbar (64px)**:
  - Official GOI emblem & NLAMS title
  - Global Telemetry strip (PM GatiShakti sync, PFMS escrow live status, STQC L-4 audit status)
  - Universal Search (`ALT+K`) indexing Projects, Khasras, Gazette IDs, Awards, DBT Txns
  - Role switcher for testing & multi-stakeholder operational review
  - Real-time statutory notification drawer & user profile credentials
- **Left Navigation Drawer (260px)**:
  - Categorized strictly into 6 functional domains:
    1. Overview (`/dashboard`, `/monitoring/states`, `/projects`)
    2. Land Acquisition (`/acquisition/proposals`, `/land/parcels`, `/acquisition/notifications`, `/field/joint-verification`, `/acquisition/claims`, `/compensation/awards`, `/acquisition/possession`)
    3. Land & Beneficiaries (`/beneficiaries/landowners`, `/beneficiaries/affected-families`, `/beneficiaries/grievances`, `/rr`)
    4. Compensation & Finance (`/compensation/dbt`)
    5. GIS & Intelligence (`/gis`, `/intelligence/risk-radar`)
    6. Governance (`/governance/vault`, `/governance/audit`, `/governance/rti`, `/governance/parliamentary-returns`)
    7. Citizen Portal Access (`/citizen`)

---

## 5. Table UX & Progressive Disclosure Standards
1. **Never dump 15+ raw columns into default view.**
2. **Central Project Registry Default Columns**:
   - `1. Project (ID + Title)`
   - `2. Location (State + District)`
   - `3. Acquisition Progress (Bar + % + Ha)`
   - `4. Current Statutory Stage (Stage + Section)`
   - `5. Risk (Clear / Low / Medium / High / Critical)`
   - `6. Overall Status (On Track / Delayed / At Risk / Completed / Blocked)`
   - `7. Action (Primary "Open →" + row menu)`
3. The entire row must be clickable to trigger Quick View or full Project Workspace (`/projects/:projectId`).
4. Column customization modal allows toggling secondary attributes (Executing Agency, Sanctioned Escrow, R&R Families, Gazette Date).

---

## 6. Field & Joint Verification Survey (JEV) Directives
- **Touch-optimized**: Minimum 44px hit targets for rugged field tablets.
- **RTK GNSS Telemetry**: Real-time display of satellite lock status, fix precision (±0.03m), and NavIC/IRNSS ephemeris sync.
- **Offline & Synchronized Caching**: Clear visual badge showing un-synced field records.
- **Evidentiary Integrity**: Geo-tagged photographs with embedded EXIF coordinates, compass orientation, and timestamp watermarks.
- **Multi-Party Signatures**: Digital signatures of Amin, CALA representative, Implementing Agency engineer, and Landowner.

---

## 7. AI & Predictive Intelligence Principles
- **Assistive, Never Decisive**: AI algorithms detect anomalies (e.g. RoR land area discrepancies, Sec 19 lapse projections, compensation disbursement bottlenecks).
- **Mandatory 5-Part Finding Card**:
  1. *Finding*: Plain-language statement of the detected condition.
  2. *Evidence*: Specific Khasra records, dates, and historical averages compared.
  3. *Confidence Level*: Expressed as a percentage (e.g. 87%).
  4. *Human Review Status*: Clearly marked `Pending Review by CALA / SDM`.
  5. *Recommended Administrative Action*: Actionable statutory step (e.g., "Issue Sec 19(7) Extension Order").
- **Zero Silent Automation**: AI is never permitted to approve compensation, publish gazettes, or dispossess land.

---

## 8. Sovereign Security & Data Protection
- **Masked Identity & Financials**: Bank account numbers (`•••• •••• 4092`), Aadhaar tokens (`•••• •••• 8912`), and private phone numbers must never be displayed unmasked in standard views.
- **Immutable STQC L-4 Audit**: Every modification, view of sensitive records, approval, or rejection writes an append-only cryptographic event with actor UUID, role, IP, and timestamp.
