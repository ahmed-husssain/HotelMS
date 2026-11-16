# LuxuryStay Hotel Management System — Security & Engineering Rules

---

## 1. Authentication & Session Security

### 1.1 Password Security
* Passwords must be hashed using `bcryptjs` with a work factor of **10 salt rounds** prior to database persistence.
* The `password` field in the `User` schema must be defined with `select: false` to prevent accidental leakage in user queries.
* Passwords must enforce a minimum length of 8 characters containing at least one numeric digit and one uppercase letter.

### 1.2 JWT (JSON Web Token) Standards
* Tokens must be signed with a cryptographically strong secret stored in `process.env.JWT_SECRET`.
* Standard expiration: **7 days** (`7d`).
* The token payload must contain only minimal non-sensitive identity claims: `{ id: user._id, role: user.role }`.
* Protected API routes must verify tokens via the standard `Authorization: Bearer <token>` header or secure HTTP-only cookies.

---

## 2. Role-Based Access Control (RBAC) Permission Matrix

| Endpoint / Operation | Guest | Receptionist | Housekeeping | Admin |
| :--- | :---: | :---: | :---: | :---: |
| Search Rooms & Check Availability | ✅ | ✅ | ✅ | ✅ |
| Create 5-Min Hold Booking | ✅ | ✅ | ❌ | ✅ |
| Pay 30% Advance via Safepay | ✅ | ❌ | ❌ | ❌ |
| View Own Bookings & Receipts | ✅ | ❌ | ❌ | ✅ |
| View All Bookings (Arrivals/Departures) | ❌ | ✅ | ❌ | ✅ |
| Check-in Guest & Assign Room Key | ❌ | ✅ | ❌ | ✅ |
| Add Incidental Charges to Folio | ❌ | ✅ | ❌ | ✅ |
| Collect 70% Balance & Check-out Guest | ❌ | ✅ | ❌ | ✅ |
| Open / Close Cashier Shift (Z-Report) | ❌ | ✅ | ❌ | ✅ |
| View Dirty Rooms Queue | ❌ | ✅ | ✅ | ✅ |
| Toggle Room Status (Cleaning / Clean) | ❌ | ❌ | ✅ | ✅ |
| Log Maintenance Ticket | ❌ | ✅ | ✅ | ✅ |
| Resolve Maintenance Ticket | ❌ | ❌ | ❌ | ✅ |
| Create / Edit / Delete Physical Rooms | ❌ | ❌ | ❌ | ✅ |
| Create / Deactivate Staff Accounts | ❌ | ❌ | ❌ | ✅ |
| View Occupancy & Revenue Analytics | ❌ | ❌ | ❌ | ✅ |
| View System Activity Audit Logs | ❌ | ❌ | ❌ | ✅ |

---

## 3. Financial & Zero-Trust Calculation Rules

> **Cardinal Rule:** The client-side browser is NEVER trusted to calculate or provide prices, taxes, nights, or payable totals.

1. **Server-Side Computations Only:** Nightly rates, tax sums (13%), 30% advance split, and 70% balance must be computed exclusively inside `src/services/pricingService.js` on the Node.js server.
2. **Immutable Price Snapshots:** At the time a booking is created, the computed pricing breakdown is permanently captured inside the `pricingSnapshot` field of the booking document. Subsequent price changes made by hotel management will never mutate historical reservations.
3. **Double-Entry Ledger Integrity:** 
   * Direct editing of past payment rows is strictly forbidden.
   * Corrections, adjustments, and refunds must be appended as new discrete records in the `payments` collection.
4. **Shift Closing Balancing:** Front-desk receptionists cannot close a cashier shift without declaring their physical cash drawer count. Any difference between expected and counted cash is automatically logged as a discrepancy.

---

## 4. Payment Gateway & Webhook Security (Safepay)

1. **Secret Key Isolation:** Safepay Secret Keys (`SAFEPAY_SECRET_KEY`, `SAFEPAY_WEBHOOK_SECRET`) must reside exclusively in server `.env` files and must never be exposed to the client or committed to version control.
2. **PCI-DSS Compliance:** The application must never collect, inspect, or store credit card numbers, CVVs, or cardholder banking credentials. Payment entry takes place entirely within Safepay's hosted sandbox environment.
3. **Webhook HMAC Signature Verification:** Every payload hitting `/api/payments/webhook` must have its `x-sfpy-signature` header validated against the raw request body using HMAC SHA-256 before any database state is updated.
4. **Idempotency Enforcement:** Every incoming webhook must check whether its transaction reference already exists in the `payments` collection with status `SUCCEEDED`. Duplicate webhook calls must be acknowledged with `200 OK` without re-executing credit updates.

---

## 5. Concurrency & Double-Booking Protection Rules

1. **Pessimistic Atomic Locks:** Checking room availability and acquiring the temporary 5-minute hold must execute inside an atomic MongoDB session transaction (`mongoose.startSession()`).
2. **Hard Overlap Prohibition:** No two bookings may ever overlap on the same room if both have active statuses (`CONFIRMED`, `CHECKED_IN`, or unexpired `AWAITING_PAYMENT`).
3. **Automated Expiry Release:** Any booking in `AWAITING_PAYMENT` with `holdExpiresAt < new Date()` is considered expired and will not block subsequent availability queries.

---

## 6. Engineering & Coding Standards for Agents & Contributors

* **Centralized Error Handling:** All asynchronous controller methods must pass errors to the Express error-handling middleware (`next(error)`). Never send bare unhandled stack traces to the client.
* **Standard JSON Response Envelope:**
  * Success: `{ success: true, data: ... }`
  * Error: `{ success: false, message: "Descriptive error message", error?: ... }`
* **Audit Trail Obligation:** Any mutation altering financial balances, room statuses, or staff roles must invoke `ActivityLog.create(...)`.
* **Clean Code:** Use ES6+ async/await, avoid deep callback nesting, and enforce strict Mongoose schema validation on all inputs.

