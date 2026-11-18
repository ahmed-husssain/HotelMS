# LuxuryStay Hotel Management System — Security & Rules

This document outlines the **Security Standards** and the **Strict Rules of Engagement** for developers and AI agents working on this repository.

---

## Part 1: Core Working Rules & Developer Conduct

### 1. Mandatory Approval Gate (No Blind Changes)
* **Rule:** Do NOT write, modify, delete, or refactor any code or files without explicit prior user approval.
* **Process:** Always explain the proposed changes in plain, simple language first. Cross-question or outline the tradeoffs, wait for the user to say "Yes / Approved", and only then touch the files.

### 2. Clean, Minimal & Easily Understandable Code (KISS Principle)
* **Rule:** Keep the code as simple, clean, and minimal as possible. Avoid over-engineering, unnecessary design patterns, complex abstractions, or bloated dependencies.
* **Explainability Standard:** The user must be able to easily understand every single file and comfortably explain to an examiner or teacher during project defense:
  * *What does this function do?*
  * *Why is it written this way?*
  * *How does data flow from the frontend to the database?*
* **Well-Documented:** Add clear, plain-English comments above important blocks explaining the business logic in simple terms, without jargon.

### 3. In-Place Replacement (Zero Dead / Zombie Code)
* **Rule:** Never leave dead, commented-out, unused, or duplicate versions of code behind (e.g. keeping `bookingController_old.js` or leaving `// function calculatePrice_v1() { ... }` sitting above the new function).
* **Action:** When updating or refactoring code, cleanly replace the previous implementation directly in-place. The codebase must remain 100% clean and free of clutter.

### 4. Single Source of Truth (No Duplicate Files)
* **Rule:** Never create multiple files for the same purpose (e.g. having both lowercase and capitalized versions of docs or routes). Every model, route, service, and document must have exactly one canonical file.

### 5. High-Clarity Naming Conventions
* **Rule:** Variables, functions, routes, and database fields must use clear, intuitive, human-friendly names:
  * Good: `checkInDate`, `totalNights`, `calculateFinalBill()`
  * Bad: `cid`, `tot_n`, `calc()`

### 6. Strict Mobile-First Responsive Mandate & Typography System

#### A. Mobile as the Primary Baseline Persona
* **Rule:** Over 80% of actual users access the LuxuryStay system from mobile devices:
  * **Guests:** Opening the portal in their suite from an iPhone/Android to unlock the door, order dining, or request housekeeping.
  * **Housekeepers:** Carrying a mobile phone across floors to inspect rooms and toggle cleaning status.
  * **Front Desk & Concierge:** Walking the lobby or desk with a tablet or mobile phone.
  * **Admin:** Monitoring live occupancy and financial reports on the go.
* **The Mandate:** Mobile is **never** an afterthought or a scaled-down desktop window. All interfaces must be designed and verified **Mobile-First (375px–390px)**, cascading upward:
  $$\text{Mobile (375px–390px)} \longrightarrow \text{Tablet (768px)} \longrightarrow \text{Laptop (1024px–1280px)} \longrightarrow \text{Desktop Monitor (1440px+)}$$

#### B. Touch & Viewport Standards
1. **44×44px Minimum Touch Target:** Every button, input, toggle switch, dropdown, and tab must have a minimum interactive tap boundary of 44×44px (complying with Apple Human Interface Guidelines and WCAG 2.2 AA target size criteria).
2. **Bottom Sheets & Mobile Drawers:** Cramped desktop centered modal dialogues are strictly forbidden on mobile screens (< 768px). All mobile overlays, filters, and booking forms must render as bottom sheets (`fixed inset-x-0 bottom-0 rounded-t-2xl max-h-[92vh] overflow-y-auto`) or full-screen viewports with thumb-friendly dismiss targets.
3. **Zero Horizontal Scroll:** Root viewports must enforce `overflow-x: hidden`. No element may cause horizontal scrolling or layout jumping.
4. **Adaptive Data Displays (Table-to-Card Transformation):** Multi-column tabular data (booking logs, room queues, staff rosters, folio itemizations) must never render as squished or cut-off tables on mobile screens. Tables must automatically transform into clean, stacked vertical cards below `768px` (`hidden md:table` / `md:hidden block`).

#### C. Unified Luxury Typography Standard (Option 3 • Perfected Sculptural)
Eliminate all arbitrary, one-off, and discordant font choices. The entire Stayza application adheres to exactly one unified modern sans-serif typography hierarchy:

| Role | Font Family | CSS Utility | Usage Scope |
| :--- | :--- | :--- | :--- |
| **Architectural Display & Headings** | `Syne` | `.font-serif-grand` / `.font-cinzel` | Display titles, section headers (H1–H3), suite names, brand monogram |
| **Clean UI & Editorial Body** | `Inter` | `.font-sans-clean` / `body` | All body copy, buttons, inputs, navigation, status pills, labels, drawer copy |
| **Architectural Numerals & Metrics** | `Space Grotesk` | `.font-mono` / `.font-mono-code` | Currency (`PKR`), room rates, timestamps, dates, booking codes, suite dimensions |

#### D. Standardized Design Token Type Scale
Every portal must adhere strictly to these typography hierarchy tokens:

* **H1 (Hero & Main Titles):**
  * Mobile: `text-2xl` (24px) / `leading-tight` / `font-serif-grand font-normal`
  * Desktop: `text-4xl` to `text-5xl` (36px–48px) / `leading-none` / `tracking-tight`
* **H2 (Section Headings):**
  * Mobile: `text-xl` (20px) / `font-serif-grand font-medium`
  * Desktop: `text-2xl` to `text-3xl` (24px–30px) / `tracking-tight`
* **H3 (Card Titles & Sub-Sections):**
  * Mobile: `text-base` (16px) / `font-sans-clean font-semibold`
  * Desktop: `text-lg` to `text-xl` (18px–20px) / `tracking-tight`
* **Subtitle / Section Context:**
  * Universal: `text-sm` (14px) / `font-sans-clean font-normal text-slate-500 leading-relaxed`
* **Body Text:**
  * Universal: `text-sm` (14px) to `text-base` (16px) / `font-sans-clean font-normal text-slate-700 leading-relaxed`
* **Eyebrow / Category Badges:**
  * Universal: `text-[10px]` to `text-[11px]` / `font-mono uppercase font-bold tracking-[0.2em] text-slate-500`
* **Button & Interactive Controls:**
  * Universal: `min-h-[44px]` / `px-4 sm:px-6` / `text-[11px] sm:text-xs` / `font-mono uppercase font-bold tracking-[0.2em]`

---

## Part 2: Security & Zero-Trust Architecture

### 1. Zero-Trust Pricing & Calculations
* **The Golden Rule:** The browser is NEVER trusted to calculate prices, nights, taxes, or deposit amounts.
* All calculations (nightly rates, 13% tax, 30% advance deposit, 70% front-desk balance) must be computed exclusively by the backend in `src/services/pricingService.js`.
* **Immutable Snapshot:** Once a booking is created, its pricing snapshot is frozen inside the booking record. Future price updates by hotel management will never mutate historical reservations.

### 2. Authentication & Passwords
* **Password Hashing:** Passwords must be hashed using `bcryptjs` with 10 salt rounds before saving to MongoDB.
* **Leak Prevention:** The `password` field in the `User` schema must be defined with `select: false` so it is never accidentally sent in API responses.
* **JWT Tokens:** Authenticated sessions use JSON Web Tokens signed with `process.env.JWT_SECRET`, expiring after 7 days. Tokens only carry `{ id, role }`.

### 3. Role-Based Access Control (RBAC) Matrix

| Action / Route | Guest | Receptionist | Housekeeping | Admin |
| :--- | :---: | :---: | :---: | :---: |
| Search rooms & view availability | ✅ | ✅ | ✅ | ✅ |
| Reserve room (5-min hold) | ✅ | ✅ | ❌ | ✅ |
| Pay 30% advance via Safepay | ✅ | ❌ | ❌ | ❌ |
| View personal bookings & receipts | ✅ | ❌ | ❌ | ✅ |
| View all hotel arrivals & departures | ❌ | ✅ | ❌ | ✅ |
| Check-in guest & hand over key | ❌ | ✅ | ❌ | ✅ |
| Add extra charges (Room Service / Laundry) | ❌ | ✅ | ❌ | ✅ |
| Collect 70% balance & check-out guest | ❌ | ✅ | ❌ | ✅ |
| Open & Close Cashier Shift (Z-Report) | ❌ | ✅ | ❌ | ✅ |
| View dirty room cleaning queue | ❌ | ✅ | ✅ | ✅ |
| Mark room as cleaning / clean | ❌ | ❌ | ✅ | ✅ |
| Log a maintenance issue (e.g. broken AC) | ❌ | ✅ | ✅ | ✅ |
| Manage rooms (create, edit, delete, set rates) | ❌ | ❌ | ❌ | ✅ |
| Manage staff accounts & permissions | ❌ | ❌ | ❌ | ✅ |
| View revenue & occupancy reports | ❌ | ❌ | ❌ | ✅ |
| View system activity audit trail | ❌ | ❌ | ❌ | ✅ |

### 4. Concurrency & Double-Booking Protection
* **Pessimistic Locking:** A room is locked atomically when checkout begins. If two users click "Book" for the same room on the same dates at the exact same millisecond, MongoDB's atomic query guarantees only one succeeds.
* **5-Minute Hold:** The lock lasts exactly 5 minutes (`holdExpiresAt`). If the user closes their browser or cancels, the hold expires or is explicitly released, freeing the room immediately.

### 5. Payment Security & Idempotency
* **No Card Data on Server:** Credit card numbers and CVVs are entered directly on Safepay's hosted checkout. Our servers never see or store raw card information.
* **HMAC Signature Check:** Safepay webhooks must verify the cryptographic signature (`x-sfpy-signature`) using `SAFEPAY_WEBHOOK_SECRET` before updating payment status.
* **Idempotency:** Every payment is recorded with a unique `safepayReference` and `idempotencyKey`. If Safepay sends the same webhook twice, the duplicate is ignored safely without double-charging.
* **Audit Trail:** Every payment (advance deposit, cash at desk, card at desk, or refund) is appended to the separate `payments` collection and never edited or deleted.

### 6. Activity Audit Logging
* Critical actions (guest check-in, guest check-out, balance collection, manual room status overrides, staff creation) must automatically write an immutable record to the `activity_logs` collection:
  * `userId`: Who did it
  * `action`: What was done (e.g. `CHECK_IN_GUEST`, `COLLECT_BALANCE`)
  * `targetId`: Which booking or room was affected
  * `timestamp`: Exact date and time

---

## Part 3: Adversarial & Strict Testing Mandate (Unit + Integration)

### 1. Zero "Soft" Tests — Hostile Testing Philosophy
* **Rule:** Tests must NOT be written to favor the code or merely verify easy "happy paths". Tests must be **adversarial, hard, and comprehensive**. They must actively attempt to break the system.
* **Coverage Scope:** Every single controller, service, pricing formula, role-guard, and state transition must have rigorous Unit and Integration test coverage.

### 2. Mandatory Hard Test Cases (Non-Negotiable)
1. **Concurrent Race Conditions:** Simulate 10 simultaneous parallel booking requests hitting the API for the same room on the same dates. Verify that *exactly one* acquires the 5-minute hold and the other 9 receive clean conflict errors.
2. **Date Overlap Boundary Exploits:**
   * Same-day check-in and check-out ($0$ nights).
   * Reversed dates (Check-out before Check-in).
   * Historical dates in the past.
   * Adjacent bookings (Guest A checks out Nov 10, Guest B checks in Nov 10 — must be allowed, not falsely blocked).
3. **Financial & Math Tampering:**
   * Sending modified prices, negative rates, or NaN from the client.
   * Testing that `advanceAmount + balanceRemaining + folioExtras === finalInvoicePaid` to the exact rupee without floating-point rounding errors.
4. **Safepay Webhook & Idempotency Attack Tests:**
   * Tampered or fake `x-sfpy-signature` HMAC headers (must be rejected with `401 Unauthorized`).
   * Sending the exact same successful webhook payload 5 times in rapid succession (must process once and return `200 Already Processed` without double crediting).
5. **Privilege Escalation & RBAC Penetration:**
   * Guest attempting to check-in themselves or view other guests' invoices.
   * Housekeeping attempting to collect payments or edit room rates.
   * Receptionist attempting to create admin accounts or view system audit logs.
6. **NoSQL Query Injection & Input Fuzzing:**
   * Sending MongoDB operators like `{"$gt": ""}` in username or search queries.
   * XSS payloads in special requests or guest notes.
7. **Unsettled Folio Guard:**
   * Attempting to check out a guest whose folio has unpaid extra services (must be rejected until balance is zeroed).

---

## Part 4: Skill-Driven Development & Proactive Research Framework

The developer and agents must proactively utilize and recommend specialized skills for each specific phase of development:

### 1. Code Simplification & Bloat-Killing
* **`/ponytail` & `/ponytail-review`:** 
  * Channel senior engineering discipline: reach for native JavaScript / Node stdlib before adding third-party npm packages.
  * Question speculative features: build only what is required by the PRD.
  * Audit PRs for dead code, unneeded dependencies, and bloated abstractions.

### 2. Security & Vulnerability Auditing
* **`/security-audit`:** 
  * Run focused vulnerability audits on authentication, JWT handling, endpoint authorization, and payment webhooks before releasing milestones.

### 3. Luxury UI/UX, Motion & Visual Polish (Frontend Phase)
* **`/ui-ux-pro-max`:** Guide high-end hospitality typography, responsive grids, color theory (Dark Slate, Warm Gold, Cream), accessibility, and chart design.
* **`/apple-design`:** Infuse subtle depth, spring physics, restraint, and tactile feedback into buttons, cards, and drawers.
* **`/animate`:** Construct purposeful, lightweight animations for the 5-minute checkout countdown, room availability transitions, and toast alerts.
* **`/generative-ui`:** Render rich inline UI components (interactive room timeline, printable folio bills).
* **`/ask-matt`:** Product sounding board for user experience questions.

### 4. Proactive Skill Suggestion Protocol
* **Rule:** Before starting any significant task or feature, the agent must research best practices and suggest the exact skill or GitHub design pattern that best solves that particular problem.

---

## Part 5: Secrets Hygiene & Zero-Leakage Protocol

This protocol governs the handling of all credentials, API keys, webhook secrets, database connection strings, and tokens across the repository.

### 1. The Zero-Frontend-Secrets Standard
* **Absolute Ban:** Private API keys, payment gateway secrets (Safepay Secret Key), database connection strings (`MONGO_URI`), and JWT signing keys (`JWT_SECRET`) must **NEVER** exist in the `client/` codebase under any circumstances.
* **No Hardcoding:** Hardcoding tokens or secrets into `.jsx`, `.js`, or `.html` files is strictly prohibited.
* **Vite `VITE_` Namespace Protection:**
  * In Vite, any variable prefixed with `VITE_*` is statically baked into client JavaScript bundles at build time.
  * Never prefix sensitive credentials with `VITE_` (e.g., `VITE_SAFEPAY_SECRET` is forbidden).
  * The frontend is only permitted non-sensitive public configuration (e.g., `VITE_API_URL=http://localhost:5000`).

### 2. Mandatory Backend Proxy (BFF Pattern)
* The client browser is an untrusted environment and must **never** communicate directly with third-party payment gateways, database clusters, or external APIs.
* All external interactions must flow through Express backend controller endpoints:
  * Guest Booking $\rightarrow$ `POST /api/payments/checkout-session` $\rightarrow$ Backend contacts Safepay API $\rightarrow$ Returns hosted checkout URL to client.
  * Webhook updates $\rightarrow$ Safepay sends HMAC signed webhook to `POST /api/payments/webhook` $\rightarrow$ Server verifies HMAC before database mutation.

### 3. Zero Cross-Boundary Module Imports
* Client files (`client/src/**`) must never import files from the backend (`server/src/**`).
* Bundling server files into the frontend causes Rollup to embed server environment access into client distribution bundles.

### 4. Database Response Sanitization
* All Mongoose models containing sensitive credentials (e.g., `User.password`, payment gateway tokens) must set `{ select: false }` on those schema fields.
* API controllers must never return raw database documents containing hash salts, webhook secrets, or internal administrative tokens to the client.

### 5. Multi-Tier Git Exclusion Rules
* All `.env` and `.env.*` files across root, `client/`, and `server/` must be ignored in `.gitignore`.
* Only `.env.example` containing empty dummy placeholders is allowed in version control.
* Certificate keys (`*.pem`, `*.key`), credentials files (`*credentials*.json`), and service account keys (`serviceAccountKey*.json`) are universally excluded.

### 6. Pre-Commit Verification Gate
* Developers and AI agents must run `git status -u` prior to every commit or push to verify that no untracked secrets, `.env` files, or staging keys are staged.
* If any credential file appears in `git status`, committing must be immediately aborted and `.gitignore` updated.


