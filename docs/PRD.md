# LuxuryStay Hotel Management System — Product Requirements Document (PRD)

---

## 1. Document Overview
* **Product Name:** LuxuryStay Hotel Management System (HMS)
* **Product Type:** Full-Stack Web Application (MERN Stack)
* **Target Audience:** High-End Luxury Hospitality Chains (Guests, Front-Desk Staff, Housekeeping, Hotel Executives)
* **Version:** 1.0.0
* **Status:** Approved for Development

---

## 2. Product Vision & Goals

LuxuryStay is designed to elevate the guest journey while streamlining backend hotel operations. Unlike standard student projects with generic tables and toy workflows, LuxuryStay enforces realistic commercial hospitality practices:
1. **Frictionless Guest Experience:** Date-range discovery, dynamic pricing transparency, instant online reservations with a guaranteed 30% advance deposit via Safepay, and self-service booking histories.
2. **Operational Front-Desk Excellence:** Fast guest check-in/out, multi-room status monitoring, incidental charges management (guest folio), and shift-closing cash reconciliation.
3. **Synchronized Housekeeping & Maintenance:** Zero-latency task queues so rooms become available for sale the exact moment they are cleaned and inspected.
4. **Financial Integrity & Double-Entry Accounting:** Immutable payment ledgers, two-stage billing (30% advance online + 70% balance at hotel desk), and automated tax invoicing.

---

## 3. User Personas & Roles

### 3.1 Persona 1: The Luxury Guest ("Sophia")
* **Goal:** Wants to browse suites, check real-time availability for specific vacation dates, see transparent pricing with taxes, secure the booking with an online deposit, and receive an instant digital receipt.
* **Key Tasks:** Search rooms by date $\rightarrow$ View amenities/photos $\rightarrow$ Place reservation $\rightarrow$ Pay 30% advance via Safepay $\rightarrow$ Access digital confirmation receipt $\rightarrow$ View stay history.

### 3.2 Persona 2: The Front Desk Receptionist ("Ali")
* **Goal:** Needs to see incoming arrivals for the day, quickly check guests in, issue physical room keys, add incidental services (room service, laundry) to the guest's folio, collect the 70% balance, and close out the cash drawer at shift end.
* **Key Tasks:** Check-in guest $\rightarrow$ Assign room key $\rightarrow$ Add folio charges $\rightarrow$ Collect balance at checkout $\rightarrow$ Issue final tax invoice $\rightarrow$ Close cashier shift (Z-Report).

### 3.3 Persona 3: The Housekeeping & Maintenance Lead ("Maria")
* **Goal:** Needs an immediate, mobile-responsive queue of dirty rooms after check-out, updates room cleanliness status in real time, and logs maintenance tickets for broken fixtures.
* **Key Tasks:** View dirty room queue $\rightarrow$ Start cleaning $\rightarrow$ Mark clean/inspected $\rightarrow$ Flag maintenance issues (e.g. leaking faucet) with urgency levels.

### 3.4 Persona 4: The Hotel General Manager / Admin ("Mr. Khan")
* **Goal:** Needs birds-eye visibility over occupancy rates, collected revenue vs outstanding receivables, room performance, staff accounts, and system audit logs.
* **Key Tasks:** Manage room catalog & nightly rates $\rightarrow$ Create and deactivate staff accounts $\rightarrow$ View occupancy and revenue reports $\rightarrow$ Review audit logs.

---

## 4. Functional Requirements by Module

### Module 1: Guest Discovery & Booking Engine
* **FR-1.1 Date-Range Search:** Users can filter available rooms by check-in date, check-out date, and guest count (adults/children).
* **FR-1.2 Room Showcase:** High-resolution photo galleries, floor indicators, detailed amenities lists, and capacity indicators.
* **FR-1.3 Dynamic Price Breakdown:** Transparent calculation of nightly rates, total nights, 13% hospitality tax, 30% advance deposit required, and remaining 70% balance due on arrival.
* **FR-1.4 5-Minute Checkout Hold:** When checkout begins, the room is placed in `AWAITING_PAYMENT` with an atomic pessimistic lock for 5 minutes.
* **FR-1.5 Live Countdown Timer:** UI displays an active countdown (`05:00... 00:00`). If user navigates away or cancels, the lock is freed immediately.

### Module 2: Online Payments & Advance Receipts
* **FR-2.1 Safepay Sandbox Integration:** Secure hosted checkout initiation for the exact 30% advance amount in PKR.
* **FR-2.2 Server-to-Server Webhook:** Background webhook listener verifying HMAC SHA-256 signatures to confirm payment completion without relying on browser redirects.
* **FR-2.3 Idempotency Enforcement:** Rejects duplicate webhook deliveries using unique transaction references.
* **FR-2.4 Advance Payment Receipt:** Automatically generates a downloadable PDF receipt with booking reference, guest details, amount paid, and remaining balance due.

### Module 3: Front Desk Operations & Check-in / Check-out
* **FR-3.1 Daily Operations Dashboard:** Filterable view of today's expected arrivals, current in-house guests, and scheduled departures.
* **FR-3.2 One-Click Check-in:** Front desk confirms guest arrival, switches booking status to `CHECKED_IN`, and sets room status to `OCCUPIED`.
* **FR-3.3 Incidental Guest Folio:** Allows staff to post extra charges (Room Service, Laundry, Minibar, Spa, Airport Taxi) to the active stay.
* **FR-3.4 Balance Collection & Checkout:** At checkout, receptionist verifies total folio balance ($70\% \text{ room rate} + \sum \text{extras}$), records payment (Cash/Card POS), generates the final tax invoice PDF, and transitions room status to `DIRTY`.

### Module 4: Housekeeping & Maintenance Management
* **FR-4.1 Automated Turnover Creation:** Checking out a room automatically generates a `CLEAN_TURNOVER` housekeeping task.
* **FR-4.2 Real-Time Status Toggle:** Housekeeper marks room `CLEANING` $\rightarrow$ `AVAILABLE`. The Front Desk board updates immediately via Socket.IO without refreshing.
* **FR-4.3 Maintenance Ticket Logging:** Staff or guests can report maintenance issues (AC, plumbing, electrical) with urgency tags (`LOW`, `MEDIUM`, `HIGH`, `URGENT`). Rooms under repair transition to `MAINTENANCE` and cannot be booked.

### Module 5: Front Desk Shift & Cashier Handover (Z-Report)
* **FR-5.1 Shift Sessions:** Receptionists open a shift with an initial float amount.
* **FR-5.2 Shift Summary:** Tracks all cash and card payments collected by that specific user during their session.
* **FR-5.3 Handover Z-Report:** On closing the shift, system prints/displays total cash expected vs actual, discrepancy notes, and transfers control to the next staff member.

### Module 6: Executive Analytics & System Administration
* **FR-6.1 Occupancy Metrics:** Graph of occupancy percentage over daily, weekly, and monthly timeframes.
* **FR-6.2 Verified Revenue Analytics:** Charts reflecting *actual collected funds* (advance + desk collections) rather than theoretical booking sums.
* **FR-6.3 Room Catalog CRUD:** Admin can create, modify, or deactivate rooms, adjust nightly pricing, and update amenities.
* **FR-6.4 Staff Role Management:** Admin creates staff accounts and assigns granular roles (`receptionist`, `housekeeping`, `admin`).
* **FR-6.5 Activity Audit Trail:** Immutable log of system actions (check-ins, balance collections, room overrides, manual discounts, cancellations).

---

## 5. Non-Functional Requirements (NFR)

* **Performance:** API responses under 300ms for availability queries; under 1.5s for PDF invoice generation.
* **Concurrency:** Pessimistic database locking ensures zero double-booking even under concurrent simultaneous checkouts.
* **Security:** Bcrypt password hashing (10 salt rounds), JWT in secure HTTP cookies/Authorization headers, zero plain-text storage of credentials, role-based route guard.
* **Reliability:** 99.9% uptime target, graceful handling of third-party payment gateway downtime.
* **Usability & Design:** Mobile-responsive luxury aesthetic (Dark Slate, Warm Gold accents, Ivory surfaces), adhering to WCAG 2.1 AA contrast requirements.

---

## 6. Success Metrics & Demonstration Acceptance Criteria
1. **Double-Booking Prevention:** Two simultaneous checkout attempts on the last available suite result in exactly 1 successful booking and 1 immediate friendly lockout.
2. **Financial Precision:** In every scenario, $\text{Advance (30\%)} + \text{Balance (70\%)} + \text{Folio Extras} \equiv \text{Final Paid Invoice}$.
3. **Live Sync Speed:** Marking a room clean updates the front-desk display in $<500\text{ms}$ via WebSockets.
4. **Shift Balancing:** Shift closing report matches the physical cash collected to the exact rupee.

