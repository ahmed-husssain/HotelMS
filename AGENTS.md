# LuxuryStay HMS — Agent Operational Rules & Architectural Constitution (`AGENTS.md`)

This document is the **supreme law and behavioral contract** for all AI agents working on the **LuxuryStay / Habitas Hotel Management System**. Every agent turn must strictly comply with these rules without exception.

---

## 1. Strict Task Boundaries & Mandatory Approval Gate

* **Work Only on Assigned Tasks:** The agent must only write code, create files, or modify logic that is explicitly assigned by the user in the immediate prompt.
* **No Unsolicited Changes:** The agent is strictly forbidden from "cleaning up", refactoring, restructuring, or deleting any file or function outside the immediate scope.
* **Mandatory Confirmation Gate:** If an assigned task unexpectedly requires changing an outside file, component, schema, or configuration, the agent must **STOP immediately**, explain the reason and tradeoffs in plain English, and wait for the user's explicit **"Yes / Approved"** before touching any file.

---

## 2. Strict Backend API Isolation & Zero-Secret Protocol

* **Zero Direct Third-Party APIs on Frontend:** 
  * The frontend client must **NEVER** directly call any external third-party API (e.g., Safepay, Stripe, MongoDB, external email/SMS providers, or AI services).
  * **All** third-party integrations, external HTTP requests, and secret-bearing SDKs must reside and execute exclusively on the Express backend server (`server/src/controllers/`, `server/src/services/`).
* **Internal `/api/*` Proxy Only:** The client browser communicates exclusively with our own local backend endpoints (e.g., `POST /api/bookings`, `POST /api/payments/checkout-session`).
* **Zero Secret Leakage:** 
  * Private keys (`JWT_SECRET`, `SAFEPAY_SECRET_KEY`, `SAFEPAY_API_KEY`, `MONGO_URI`) must strictly remain in `server/.env`.
  * No private secret or sensitive credential may ever be placed in client code, frontend `.env` files, or committed to Git.
  * Inspect `git status -u` before every commit to ensure no `.env` or credential files are tracked.

---

## 3. Zero-Trust Pricing, Availability & Roles

* **Browser Data is Never Trusted:** 
  * Nightly room rates, date difference calculations, the 13% Sindh Hospitality Tax, the 30% advance deposit split, and the 70% remaining balance must be calculated and validated **exclusively on the backend** (`pricingService.js`).
  * The client only sends desired check-in/out dates and room IDs.
* **Server-Enforced Role-Based Access Control (RBAC):**
  * User roles (`guest`, `receptionist`, `housekeeping`, `admin`) are strictly provisioned and verified on the server via JWT tokens and middleware (`rbac.js`).
  * Public registration endpoints must strictly force `role: 'guest'`. Staff accounts can only be created by the General Manager / Admin.
* **Pessimistic Concurrency:**
  * Room availability must be checked atomically on the database with a 5-minute pessimistic hold (`holdExpiresAt`) to prevent double-booking.

---

## 4. Minimal, Clean & Explainable Code (KISS & Viva Defense)

* **Keep It Simple & Understandable:** Write clean, minimal, standard code using core Node.js, Express, and Mongoose. Avoid over-engineering, unnecessary abstractions, speculative design patterns, or bloated dependencies.
* **Viva Defense Standard:** The user must be able to understand every line of code and comfortably explain it to an examiner or teacher during project defense:
  * *What does this function do?*
  * *Why is it written this way?*
  * *How does data flow from the frontend to the database?*
* **Plain-English Comments:** Every major controller, service, and middleware function must have simple, plain-English comments explaining the business logic without confusing jargon.

---

## 5. In-Place Clean Updates (Zero Zombie / Dead Code)

* **Direct Replacement:** When updating or refactoring code, cleanly update the implementation directly in-place.
* **Zero Clutter:** Never leave commented-out blocks of code, deprecated functions (`calculatePrice_old`), or duplicate backup files (`_v2.js`, `_backup.js`) in the repository. The codebase must remain 100% clean and free of dead weight.

---

## 6. Frontend Invariant & Preservation Mandate

* **Preserve World-Class Quality:** The agent must never break, alter, or downgrade the existing frontend:
  * **90+ Mobile Performance:** Maintain fast FCP and LCP optimizations.
  * **100/100 Accessibility & SEO:** Maintain single DOM text nodes for kinetic buttons, valid label-content names, and ARD 1.0 schema compliance (`specVersion: "1.0"`, `entries: [...]`).
  * **Luxury Editorial Design:** Retain the Stayza minimalist aesthetic, modern architectural typography hierarchy (`Syne` for display/headings, `Inter` for clean UI/body, `Space Grotesk` for numerals/pricing), and smooth micro-interactions.
* **Mobile-First Invariant:** All interactive elements must maintain a minimum **44×44px touch target** with zero horizontal overflow (`overflow-x: hidden`).

---

## 7. Server-Side Authentication & Zero Client-Trust Protocol

* **Server-Enforced Auth:** The backend Express server must never expose open mutation or administrative routes without JWT token validation (`auth.js`) and role guards (`rbac.js`).
* **Zero Client-Side Role Authority:** User roles stored in `localStorage` or React Context are strictly for UI rendering convenience; the server must independently verify the cryptographic JWT signature on every incoming request.
* **Privilege Escalation Defense:** Public registration endpoints must strictly force `role: 'guest'`. Under no circumstances may client payloads assign or elevate roles (`receptionist`, `housekeeping`, `admin`).

---

## 8. Single Source of Truth (Database-First, Zero LocalStorage Divergence)

* **No Orphaned State:** Operational state (Housekeeping tasks, maintenance tickets, cashier shifts, room availability) must reside in MongoDB Atlas.
* **LocalStorage Boundary:** `localStorage` must only be used to store the user's active session token (`token`) and non-sensitive display preferences, never business domain data.

---

## 9. Automated Testing & Verification Standard

* **Automated Guardrails:** Core financial calculations (`pricingService.js`), atomic holds (`availabilityService.js`), and RBAC routes must have executable test suites verifying that tampering, concurrency races, and boundary exploits are rejected with standard HTTP errors.
