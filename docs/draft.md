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

## 7. Phase 1 Backend Architecture Plan (Parked for Execution After Frontend)

* **Status:** Fully specified & parked. Deferred to execute after completing the world-class frontend.
* **Component 1: Database Setup (`server/src/config/db.js`):**
  * Minimal Mongoose connection with error handling and environment fallback.
* **Component 2: The 9 Mongoose Models (`server/src/models/`):**
  1. `User.js` — Guest, Receptionist, Housekeeping, Admin roles. Pre-save bcrypt hashing (cost 10).
  2. `Room.js` — Unified room model (roomNumber, roomType, floor, baseNightlyRate, amenities, images, status).
  3. `Booking.js` — Reference, guestId, roomId, checkIn, checkOut, pricingSnapshot (frozen), 5-min holdExpiresAt.
  4. `Payment.js` — Double-entry audit ledger with `safepayReference` and `idempotencyKey`.
  5. `FolioItem.js` — Incidental charges (Food, Laundry, Minibar, Spa).
  6. `Invoice.js` — Advance receipts & final stay tax invoices.
  7. `HousekeepingTask.js` — Room turnover and cleaning queues.
  8. `MaintenanceRequest.js` — Facilities repair tickets with urgency tiers.
  9. `CashierShift.js` — Front-desk cash drawer balancing and Z-Report handover.
  10. `ActivityLog.js` — System audit trail.
* **Component 3: Database Seeder (`server/src/utils/seedData.js`):**
  * One-command population of 4 role test accounts (`Password123!`), 8 physical luxury rooms, and realistic sample reservations.
* **Component 4: Unit Test Suite:**
  * Adversarial unit tests for schema validation, enum restrictions, and password encryption.

---

## 8. Brand Identity, Rebrand & Modern Typography Research (`Stayza`)

### 8.1 Official Brand Rename
* **Former Temporary Name:** Habitas / LuxuryStay
* **Final Chosen Brand Name:** **Stayza**
* **Brand Positioning:** Contemporary ultra-luxury boutique hospitality. Modern architectural calm, generous negative space, warm organic textures, and zero clutter.
* **Logo Transition:** User is finalizing the vector/raster logo asset; upon delivery, it will be placed across all navigation, drawer, confirmation, and invoice touchpoints.

### 8.2 Modern Typography System: Research & Architectural Direction
* **Key Finding:** Traditional high-contrast serif typefaces (Playfair Display, Bodoni, Fraunces) often look dated, ornate, or like wedding invitations. Modern 5-star architectural hotels (Aman, EDITION, Nobu, Santa Monica Proper) use disciplined, high-end sans-serif and grotesque type systems characterized by wide horizontal proportions, geometric clarity, and high legibility.
* **The 4 Researched Typography Directions:**

1. **System A: Swiss Architectural (Minimalist Brutalism / Tadao Ando Aesthetic)**
   * **Headings:** `Space Grotesk` (Bold/Medium, wide geometric stance, architectural authority)
   * **Body & UI:** `Inter` (Neutral, hyper-legible, smooth line-height for descriptions and long copy)
   * **Pricing & Meta:** `DM Mono` (Crisp, tabular precision for room rates, dates, and specs)
   * *Best For:* Clean architectural lines, concrete/stone palettes, serene brutalist luxury.

2. **System B: High-Fashion Minimalist (Parisian Luxury / Saint Laurent Style)**
   * **Headings:** `Raleway` (Light 300 / Regular 400 in all-caps with generous letter-spacing `tracking-[0.25em]`)
   * **Body & UI:** `Plus Jakarta Sans` (Contemporary geometric humanist, effortless reading)
   * **Pricing & Meta:** `JetBrains Mono` (Modern clean mono numerals)
   * *Best For:* Ultra-refined, light, breathable editorial luxury with haute-couture restraint.

3. **System C: Perfected Sculptural (The Refined Contemporary Edition)**
   * **Headings:** `Syne` (Uppercase, weight 600, letter-spacing `0.15em`, sculptural curves paired with structural rigor)
   * **Body & UI:** `Inter` (Balanced, familiar, highly readable text rhythm)
   * **Pricing & Meta:** `Space Grotesk` (Distinct modern numerals with tabular clarity)
   * *Best For:* Awwwards Site-of-the-Year boutique hotels, avant-garde interior architecture.

4. **System D: Nordic Sanctuary (Japandi Warmth & Organic Modernism)**
   * **Headings:** `Urbanist` (Soft geometric sans, warm modern curves)
   * **Body & UI:** `DM Sans` (Approachable, human, premium editorial warmth)
   * **Pricing & Meta:** `DM Mono` (Understated elegance)
   * *Best For:* Natural cedar, linen textures, wellness and coastal retreat ambiance.

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




