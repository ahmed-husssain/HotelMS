# LuxuryStay Hotel Management System — Comprehensive Draft & Working Notes

> **Notice:** This document is a consolidated record of all initial project inputs, analysis, cross-examinations, architectural debates, decisions, and raw planning notes for the LuxuryStay Hotel Management System (MERN Stack).

---

## 1. Project Background & Academic Context

* **Institution:** Aptech Learning (eProject Curriculum)
* **Assigned Problem Statement:** `MERN-Hotel_Management_System.docx`
* **Accompanying Guide:** `LuxuryStay_Complete_Project_Plan.pdf`
* **Evaluation Deliverables:**
  * Two interim Status Reports (`eProject_Status_Report(V1).xls`) at equal intervals (Day 7-10 and Day 18-20).
  * Student Feedback Form (`eProject_Feeback_Form.xls`).
  * Final Submission: Single compressed ZIP containing full source code, database scripts/seeders, complete documentation, login credentials, and a video walkthrough demonstration.
* **Core Situation:** All groups in the batch were assigned the exact same project topic. To stand out, the solution must avoid generic, buggy student tropes (such as client-side price calculations, double-booking race conditions, fake payment buttons, or static non-reactive tables) and implement enterprise-grade hospitality patterns.

---

## 2. Cross-Examination & Architecture Decisions Log

### Decision 1: Room Selection Model (Unified Single Collection)
* **Debate:** 
  * Option A: Direct selection of physical room number online.
  * Option B (Two-Tier): `RoomType` collection (category) + `Room` collection (physical numbers) with front-desk assignment.
  * Resolved: The two-tier model created unnecessary schema bloat and join overhead. We resolved to use a **Single Unified `rooms` Collection**.
  * **Result:** Each document in `rooms` represents a physical room (e.g. Room 101, Room 201) with its `roomType` (e.g. "Executive Suite"), `floor`, `baseNightlyRate`, `amenities`, `images`, and operational `status` (`AVAILABLE`, `OCCUPIED`, `DIRTY`, `CLEANING`, `MAINTENANCE`).
  * **Guest UX:** Guests search and view rooms grouped by `roomType`. On booking, the backend atomically assigns an available physical room of that category for the requested dates.

### Decision 2: Concurrency & Lock Mechanism (Pessimistic Lock vs 15-Minute Hold)
* **Debate:**
  * The PDF recommended a 15-minute hold on `AWAITING_PAYMENT`.
  * We identified that **15 minutes is far too long**; if an online user abandons checkout, that room is locked for a quarter of an hour, turning away real customers.
  * Resolved: Adopt a **5-Minute Dynamic Window** with a live countdown timer (`05:00... 00:00`) on the checkout UI.
  * **Pessimistic Atomic Lock:** Implemented via MongoDB `findOneAndUpdate` checking that no overlapping booking exists in `CONFIRMED`, `CHECKED_IN`, or unexpired `AWAITING_PAYMENT`.
  * **Early Unlock:** If the guest clicks "Cancel" or closes the tab, an explicit unlock endpoint frees the room immediately.
  * **Soft Expiry:** If the timer reaches 00:00 without payment confirmation, the booking status transitions to `EXPIRED`, immediately restoring room availability for search queries while preserving the record for checkout drop-off analytics.

### Decision 3: Payment Architecture (Separate Ledger vs Embedded Array)
* **Debate:** Storing payments inside `Booking.payments` vs a separate `payments` collection.
* **Resolved:** Mandatory **Separate `payments` Collection**.
  * Ensures strict double-entry ledger accounting.
  * Supports Safepay webhook idempotency (unique index on `safepayReference` and `idempotencyKey`).
  * Links directly to `bookingId` AND `guestId` (User) for quick guest financial history.
  * Enables **Front Desk Shift Handover / Cashier Sessions**: Shift-closing queries (`Payment.find({ collectedBy: staffId, paymentMethod: 'CASH', createdAt: shiftDate })`) instantly verify physical cash in drawer.
  * Handles refunds and adjustments without modifying the original advance payment records.

### Decision 4: Inclusions & Removals from Luxury Hotel Ecosystem
* ❌ **Removed:** Guest Identity / KYC (No requirement to capture or store CNIC/Passport photo uploads; reduces unnecessary GDPR/privacy overhead).
* ✅ **Retained & Approved:**
  * **Module A: Extra Services Folio (`FolioItem`):** Itemized charges for Food & Beverage, Laundry, Minibar, Spa, and Airport Transfers added to the guest's folio during their stay and billed at checkout.
  * **Module C: Maintenance vs Housekeeping:** Separated into two distinct operational flows:
    * Housekeeping: Routine cleaning, turnover after checkout, daily tidy (`HousekeepingTask`).
    * Maintenance: Facilities repairs (AC, plumbing, electrical) with priority tiers (`LOW`, `MEDIUM`, `HIGH`, `URGENT`) via `MaintenanceRequest`.
  * **Module D: Cashier Shift Handover (`CashierShift`):** Tracking front-desk cash and card transactions per work shift (Z-Report generation).
  * **Module E: Activity Audit Log (`ActivityLog`):** Recording staff actions (check-ins, check-outs, room status overrides, refunds, manual discounts).

### Decision 5: Two-Stage Payment Flow (30% Online / 70% Desk)
* **Stage 1 (Online):** 30% advance required to guarantee reservation via Safepay sandbox checkout. Verified strictly via server-to-server webhook signature.
* **Stage 2 (At Hotel):** Remaining 70% balance collected by Front Desk receptionist during check-in or checkout, along with accumulated folio charges.
* **Invoices:**
  * Advance Payment Receipt generated upon successful 30% online payment.
  * Final Consolidated Tax Invoice generated upon checkout showing room charges, tax, extra services, advance paid, and final balance collected.

---

## 3. Mathematical & Pricing Formulas

### Zero-Trust Backend Calculation
* Number of Nights ($N$):
  $$N = \max\left(1, \left\lceil \frac{D_{\text{checkout}} - D_{\text{checkin}}}{86,400,000 \text{ ms}} \right\rceil\right)$$
* Room Subtotal:
  $$\text{Subtotal} = N \times \text{baseNightlyRate}$$
* Luxury Hospitality Tax ($13\%$):
  $$\text{Tax} = \text{round}(\text{Subtotal} \times 0.13)$$
* Room Total Amount:
  $$\text{RoomTotal} = \text{Subtotal} + \text{Tax}$$
* 30% Advance Online:
  $$\text{AdvanceRequired} = \text{round}(\text{RoomTotal} \times 0.30)$$
* Remaining 70% Room Balance:
  $$\text{BalanceRemaining} = \text{RoomTotal} - \text{AdvanceRequired}$$
* Final Checkout Folio Total:
  $$\text{FinalDue} = \text{BalanceRemaining} + \sum_{i} \text{FolioItem}_i.\text{totalPrice} - \text{ApprovedDiscounts}$$

---

## 4. Availability Overlap Formula

Two date intervals $[S_{\text{in}}, S_{\text{out}}]$ and $[B_{\text{in}}, B_{\text{out}}]$ overlap if and only if:
$$B_{\text{in}} < S_{\text{out}} \quad \text{AND} \quad B_{\text{out}} > S_{\text{in}}$$

A room is considered **Blocked / Unavailable** if it has any booking matching:
1. `status` in `['CONFIRMED', 'CHECKED_IN']`, OR
2. `status == 'AWAITING_PAYMENT'` AND `holdExpiresAt > new Date()`

---

## 5. Safepay Integration & Webhook Security Notes

* Sandbox Base URL: `https://sandbox.api.getsafepay.com`
* Checkout Creation: Backend initiates tracker token; frontend loads Safepay hosted checkout.
* Webhook Endpoint: `POST /api/payments/webhook`
* Verification: HMAC SHA-256 signature verification using `SAFEPAY_WEBHOOK_SECRET`.
* Idempotency Check:
  ```javascript
  const existingPayment = await Payment.findOne({ safepayReference: payload.data.token });
  if (existingPayment && existingPayment.status === 'SUCCEEDED') {
    return res.status(200).json({ message: 'Payment already processed' });
  }
  ```

---

## 6. Real-Time Socket.IO Channels Map

* Namespace: `/`
* Rooms:
  * `receptionists` — Joined by users with role `receptionist` or `admin`.
  * `housekeeping` — Joined by users with role `housekeeping`.
  * `guest_<userId>` — Joined by specific authenticated guests.
* Key Events:
  * `booking:confirmed` $\rightarrow$ emitted to `receptionists`
  * `room:status_update` $\rightarrow$ emitted to `receptionists` & `housekeeping`
  * `housekeeping:task_assigned` $\rightarrow$ emitted to `housekeeping`
  * `folio:item_added` $\rightarrow$ emitted to `receptionists`

---

## 7. Backend Architecture Status & Milestones

### 7.1 Completed & Operational Components
* ✅ **Component 1: Database Setup (`server/src/config/db.js`):**
  * Robust Mongoose connection to MongoDB Atlas with environment fallback and error handling.
* ✅ **Component 2: Core Mongoose Data Models (`server/src/models/`):**
  1. `User.js` — Guest, Receptionist, Housekeeping, Admin roles. Pre-save bcrypt hashing (cost 10).
  2. `Room.js` — Unified room model (roomNumber, roomType, floor, baseNightlyRate, amenities, images, status).
  3. `Booking.js` — Reference, guestId, roomId, checkIn, checkOut, pricingSnapshot (frozen), 5-min holdExpiresAt.
  4. `Payment.js` — Double-entry audit ledger with `safepayReference` and `idempotencyKey`.
  5. `ActivityLog.js` — System audit trail for administrative, front-desk, and turnover actions.
* ✅ **Component 3: Database Seeder (`server/src/utils/seedData.js`):**
  * One-command population of 4 role test accounts (`Password123!`), 8 physical luxury rooms, and realistic sample reservations.
* ✅ **Component 4: Backend Business Services & Controllers:**
  * `server/src/services/pricingService.js` — Server-authoritative Zero-Trust pricing (13% Sindh tax, 30% advance split, 70% balance).
  * `server/src/services/availabilityService.js` — Atomic calendar overlap checking and pessimistic hold validation.
  * `server/src/controllers/bookingController.js` — Holds, quotes, confirmations, guest lookups, digital keys.
  * `server/src/controllers/staffOperationsController.js` — Live PMS dashboard, check-ins, incidental posting, check-outs, cashier shifts (Z-Report).

### 7.2 Remaining Backend Tasks
* ⏳ **Task 1: WebSockets Real-Time Sync (`Socket.io`)** — Wrap HTTP server with Socket.io in `server/server.js` and connect to `HotelDataContext.jsx` for live 0-latency room turnover events.
* ⏳ **Task 2: JWT Authentication & RBAC Middleware (`server/src/middleware/auth.js`)** — Enforce server-side token verification on staff routes (`receptionist`, `housekeeping`, `admin`).
* ⏳ **Task 3: Safepay Webhook & Hosted Checkout (`server/src/controllers/paymentController.js`)** — Production HMAC SHA-256 signature verification.

---

## 8. Brand Identity, Rebrand & Official Typography System (`Stayza`)

### 8.1 Official Brand Rename
* **Former Temporary Names:** Habitas / LuxuryStay
* **Final Chosen Brand Name:** **Stayza**
* **Brand Positioning:** Contemporary ultra-luxury boutique hospitality. Modern architectural calm, generous negative space, warm organic textures, and zero clutter.
* **Logo Status:** User is finalizing the vector/raster logo asset; upon delivery, it will be placed across all navigation, drawer, confirmation, and invoice touchpoints.

### 8.2 Official Implemented Typography System: Option 3 • Perfected Sculptural
* **Status:** **100% IMPLEMENTED & DEPLOYED SITE-WIDE** (Commit `27cfee6`).
* **Legacy Font Eradication:** `Playfair Display`, `Cinzel`, `Plus Jakarta Sans`, and `JetBrains Mono` were completely removed and deleted from all HTML, CSS, component files, and project rules.
* **The Final Approved 3-Font Hierarchy:**
  1. **Architectural Display & Headings:** `Syne` (Weights 600, 700, 800) — Hero title, section headers, suite names, brand monograms.
  2. **Clean UI & Editorial Body:** `Inter` (Weights 300, 400, 500, 600) — All body paragraphs, guest forms, navigation links, buttons, drawer specs, staff tables.
  3. **Architectural Numerals & Metrics:** `Space Grotesk` (Weights 500, 600, 700, `tabular-nums`) — Room rates (`PKR 145,000`), check-in dates, suite dimensions, invoice line items.

### 8.3 Live Visual Preview Tool
* A dedicated interactive visual testing tool is available in `client/public/typography-lab.html` and deployed live at `https://habittas.web.app/typography-lab.html` allowing side-by-side comparison of heading hierarchy, room rates, body copy, and button micro-interactions.

---

## 9. Live Operational Synchronization: Front Desk PMS & Housekeeping (Solution B — Socket.io Architecture)

### 9.1 Background & The Luxury Operational Problem
In world-class 5-star hospitality, operational velocity between the **Front Desk** (Receptionists) and **Housekeeping** (Cleaners and Floor Supervisors) directly determines guest satisfaction:
* When a guest checks out at 11:00 AM, that suite must immediately appear in the Housekeeping queue as `DIRTY` (requiring turnover).
* Once the housekeeper finishes sanitization, restocks linen and amenities, and certifies the room ready, the Front Desk terminal must reflect `AVAILABLE` / `INSPECTED` within milliseconds.
* Without real-time synchronization, front-desk staff must make manual phone calls or wait for batch updates, causing delayed check-ins and operational friction.

### 9.2 Traditional HTTP vs. WebSockets (Socket.io) Comparison

| Dimension | Traditional HTTP Polling | WebSockets / Socket.io (Solution B) |
| :--- | :--- | :--- |
| **Connection Model** | Half-duplex, stateless request-response. Client must initiate every check. | **Full-duplex, persistent connection**. Stays open continuously. |
| **Directionality** | Client $\rightarrow$ Server only. Server cannot notify client unsolicited. | **Bi-directional**. Server pushes updates to clients instantly. |
| **Latency** | 2,000ms – 5,000ms (governed by polling interval). | **10ms – 50ms** (instant real-time event push). |
| **Network Overhead** | High: Sends repeated HTTP headers (cookies, auth, agent) on every poll. | **Minimal**: Tiny framing packets; zero repeated header serialization. |
| **Resource Efficiency** | Wastes server CPU and database I/O querying unchanged tables. | **Event-driven**: Executes only when an actual state transition occurs. |

### 9.3 End-to-End System Architecture & Data Flow

```
┌─────────────────────────────────┐                 ┌─────────────────────────────────┐
│     HOUSEKEEPER'S MOBILE        │                 │      FRONT DESK PMS DESK        │
│        (/housekeeping)          │                 │             (/pms)              │
└────────────────┬────────────────┘                 └────────────────▲────────────────┘
                 │                                                   │
                 │ 1. Housekeeper completes tasks:                   │ 4. Front Desk receives
                 │    [x] Linen [x] Minibar [x] Spa                  │    'room:status_changed'
                 │    Taps "Certify Suite Ready"                     │    Suite 301 card turns
                 ▼                                                   │    GREEN instantly (<40ms)
       ┌──────────────────┐                                          │
       │  EXPRESS SERVER  │──────────────────────────────────────────┘
       │   + SOCKET.IO    │  3. Server broadcasts:
       └────────┬─────────┘     io.emit('room:status_changed', payload)
                │
                │ 2. Saves new state permanently
                ▼
       ┌──────────────────┐
       │     MONGODB      │
       │   (Permanent)    │
       └──────────────────┘
```

### 9.4 Key Academic Concepts & Viva Defense Guide

1. **Full-Duplex TCP Channel:**
   * A single, long-lived TCP connection established via an initial HTTP 101 Switching Protocols handshake, allowing client and server to stream messages independently in both directions without connection re-establishment overhead.
2. **Event-Driven Publish-Subscribe Architecture:**
   * **`socket.emit(event, data)`**: The emitting client (e.g. Housekeeper completing inspection) dispatches a strongly-typed domain event.
   * **`socket.on(event, handler)`**: The receiving client (e.g. Front Desk Room Rack) listens and executes local state updates reactively.
3. **Broadcasting vs. Unicast Messaging:**
   * Unlike standard REST controllers that respond exclusively to the requesting socket, `io.emit()` or `socket.broadcast.emit()` fans out the updated room state to all subscribed staff terminals concurrently.
4. **Separation of Concerns: Persistence vs. Event Dissemination:**
   * **MongoDB (Mongoose)** acts as the **durable source of truth**: all status changes (`DIRTY`, `CLEANING`, `INSPECTED`, `AVAILABLE`, `OCCUPIED`) are validated against schema enums and committed with audit timestamps.
   * **Socket.io** acts as the **real-time signaling bus**: it carries lightweight state notifications so already-rendered React components update in place without re-querying the database.
   * If a receptionist opens a new tab or refreshes, `GET /api/rooms` hydrates the full initial state from MongoDB; subsequent live operations stream over the WebSocket.

### 9.5 4-Step Technical Implementation Blueprint

1. **Step 1: Backend Server Integration (`server/server.js`)**
   * Wrap Express using Node's native `http.createServer(app)`.
   * Initialize `new Server(httpServer, { cors: { origin: CLIENT_URL, credentials: true } })`.
   * Attach `io` instance to Express `req.app.set('io', io)` so any controller can broadcast.
2. **Step 2: Room Operational Controller & Routes (`server/src/controllers/roomController.js`)**
   * Endpoint `PATCH /api/rooms/:id/status`: Updates room status in MongoDB, appends to `ActivityLog`, and calls `io.emit('room:status_changed', updatedRoom)`.
   * Endpoint `PATCH /api/rooms/:id/checklist`: Updates specific cleaning tasks (`linen`, `bathSalts`, `minibar`, `inspection`).
3. **Step 3: Frontend Client Socket Manager (`client/src/services/socket.js`)**
   * Instantiate a singleton `io(SOCKET_URL, { autoConnect: true, reconnection: true })`.
   * Export clean helper methods: `subscribeToRoomUpdates(callback)`, `disconnectSocket()`.
4. **Step 4: Centralized State Synchronization (`client/src/context/HotelDataContext.jsx`)**
   * In `useEffect`, listen for `room:status_changed`:
     ```javascript
     useEffect(() => {
       const unsubscribe = subscribeToRoomUpdates((updatedRoom) => {
         setRooms((prevRooms) =>
           prevRooms.map((r) => r.roomNumber === updatedRoom.roomNumber ? { ...r, ...updatedRoom } : r)
         )
       })
       return () => unsubscribe()
     }, [])
     ```
   * Result: Immediate, synchronized 0-latency UI updates across Front Desk (`/pms`) and Housekeeping (`/housekeeping`) with zero full-page reloads.

---

## 10. Codebase Audit & High-Priority Next Roadmap

### 10.1 Completed & Deployed Milestones
* ✅ **Frontend Aesthetics & Humanization:** Removed all robotic/AI jargon (`//`, `Dossier`, `Coordinates Uncharted`) across all pages.
* ✅ **Cross-Device Performance:** Optimized drone video from 3.7MB to 1.59MB with WebM/MP4, responsive WebP poster preload, decoupled hardware transforms, and `IntersectionObserver` auto-pause.
* ✅ **Unified Typography System:** Adopted Option 3 (`Syne` + `Inter` + `Space Grotesk`) across 100% of the site and eradicated old serifs/legacy fonts.
* ✅ **Core Backend Architecture:** MongoDB Atlas connection, 5 core Mongoose models, DB seeder, Zero-Trust pricing engine, availability overlap service, and PMS staff controllers.
* ✅ **Guest OS & Self-Service Portal:** Interactive guest portal with live stay details, digital key toggle, in-stay requests, and print-ready tax invoice modal.
* ✅ **Real-Time WebSockets Synchronization (Socket.io):** Full-duplex WebSocket bus between Front Desk PMS (`/pms`) and Housekeeping (`/housekeeping`), broadcasting room status changes, cleaning checklist updates, folio postings, and check-in/out events with <40ms latency and zero full-page reloads.

### 10.2 Prioritized Remaining Tasks (Next Sprints)
1. 🎯 **Priority 1: Server-Side Authentication & JWT Security Middleware**
   * Implement `POST /api/auth/login` and `POST /api/auth/register` with JWT cookies/headers.
   * Protect staff endpoints (`/api/staff/*`, `/api/rooms/:id/status`, `/api/rooms/:id/checklist`) with `verifyToken` and `requireRole(['admin', 'receptionist', 'housekeeping'])`.
2. 🎯 **Priority 2: Safepay Hosted Checkout & Webhook Verification**
   * Integrate Safepay sandbox checkout session generator and HMAC SHA-256 webhook listener for real test-card payment simulation.
3. 🎯 **Priority 3: Stayza Official Brand Logo Integration**
   * Awaiting user's finalized logo asset to place across all brand mark touchpoints (`BrandLogo`, `SplashScreen`, `InvoicePreviewModal`).
4. 🎯 **Priority 4: Automated PDF Email Receipts**
   * Implement server-side PDF invoice generation / email dispatch for confirmed bookings and checkout folio settlements.




