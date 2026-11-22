# Stayza Resorts & Suites — Server API & Real-Time Engine

> **Backend REST API, WebSocket Server, & PDF Billing Engine**  
> Built with Node.js, Express.js, MongoDB Atlas (Mongoose ODM), Socket.IO, JWT, and PDFKit.

[![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![Express.js](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express)](https://expressjs.com)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-010101?style=for-the-badge&logo=socket.io)](https://socket.io)

---

## 🏛 Core Architectural Principles

1. **Zero-Trust Financial Calculations (`pricingService.js`):**  
   Nightly room rates, date duration differences, the 13% Sindh Sales Tax (SRB), 30% online advance deposit, and 70% remaining balance are calculated and validated exclusively on the backend. Client payloads are never trusted for pricing.
2. **Pessimistic Concurrency Holds (`availabilityService.js`):**  
   When a guest initiates checkout, the room is temporarily locked on the database with a 5-minute atomic hold (`holdExpiresAt`) to prevent double-booking. If the checkout is canceled or expires, the hold is safely released.
3. **Role-Based Access Control (`auth.js`, `rbac.js`):**  
   Strict server-side route guards enforcing 4 distinct roles: `guest`, `receptionist`, `housekeeping`, and `admin`. Public registration is strictly restricted to the `guest` role.
4. **Streamed In-Memory PDF Invoices (`invoiceService.js`):**  
   Uses `pdfkit` to generate official branded tax invoices and advance payment receipts on the fly, streaming binary PDFs directly to the HTTP response with zero disk I/O.
5. **Real-Time Sockets (`socketService.js`):**  
   Broadcasting live room status changes, housekeeping certifications, and new service requests to staff dashboards instantly.

---

## 🗄 Domain Data Models (Mongoose Schemas)

| Model | Collection | Primary Responsibility |
| :--- | :--- | :--- |
| **`User`** | `users` | User credentials, bcrypt hashed passwords (10 salt rounds), roles, and contact info. |
| **`Room`** | `rooms` | Room numbers, categories, base nightly rates, specs, amenities, and operational statuses (*AVAILABLE*, *OCCUPIED*, *DIRTY*, *CLEANING*, *MAINTENANCE*). |
| **`Booking`** | `bookings` | Guest reference, room ID, check-in/out dates, pricing snapshot, 5-minute hold timestamps, and booking status. |
| **`Payment`** | `payments` | Safepay transaction references, payment status (*SUCCEEDED*, *PENDING*), amount, and split tracking (30% Advance vs 70% Balance). |
| **`Invoice`** | `invoices` | Official invoice numbers, tax breakdown (13% Sindh Sales Tax), and settlement records. |
| **`HousekeepingTask`**| `housekeepingtasks` | 4-point cleaning step checklists, room assignment, priority, and certification records. |
| **`MaintenanceRequest`**| `maintenancerequests` | Reported room defects, severity levels, room locks, and resolution logs. |
| **`InventoryItem`** | `inventoryitems` | Stock counts for cleaning supplies and guest amenities with low-stock alerts. |
| **`ActivityLog`** | `activitylogs` | Immutable audit trail of administrative changes, staff operations, and check-ins. |

---

## 📡 REST API Reference

### 1. Authentication (`/api/auth`)
* `POST /api/auth/register` — Register a new guest account (strictly forces `role: 'guest'`).
* `POST /api/auth/login` — Authenticate user and issue JWT bearer token.
* `GET  /api/auth/me` — Retrieve active user session profile (protected).

### 2. Room Inventory (`/api/rooms`)
* `GET   /api/rooms` — List all suites with optional date-range availability filters.
* `GET   /api/rooms/:id` — Retrieve detailed specifications for a single suite.
* `PATCH /api/rooms/:id/status` — Update room operational status (Staff only).
* `PATCH /api/rooms/:id/checklist` — Update room preparation checklist (Housekeeping only).

### 3. Bookings & Availability (`/api/bookings`)
* `POST /api/bookings/quote` — Calculate zero-trust price quote with 13% tax and 30% split.
* `POST /api/bookings/hold` — Place a 5-minute pessimistic hold on a room.
* `POST /api/bookings/:reference/release-hold` — Release an expired or canceled room hold.
* `POST /api/bookings/:reference/confirm` — Confirm reservation after verified payment.
* `GET  /api/bookings/lookup` — Look up guest reservation by reference code.
* `GET  /api/bookings/:reference/invoice` — Generate and stream official PDF tax invoice / receipt.
* `POST /api/bookings/:reference/incidentals` — Post an in-stay room service order.
* `POST /api/bookings/:reference/feedback` — Submit guest stay rating and feedback.

### 4. Payments (`/api/payments`)
* `POST /api/payments/checkout-session` — Create Safepay sandbox checkout session for 30% advance deposit.
* `POST /api/payments/verify` — Verify completed transaction with Safepay API.
* `POST /api/payments/webhook` — Idempotent webhook listener for asynchronous payment settlement.

### 5. Front Desk Operations (`/api/staff`)
* `GET  /api/staff/dashboard` — Live arrivals list, in-house residents, and room rack matrix.
* `POST /api/staff/check-in/:bookingRef` — Check in arriving guest.
* `POST /api/staff/check-out/:bookingRef` — Check out guest and settle remaining balance.
* `POST /api/staff/folio/:bookingRef/add` — Post additional incidental charges to guest folio.
* `GET  /api/staff/shifts/current` — Cashier shift revenue and handover summary.

### 6. Housekeeping & Facilities (`/api/housekeeping`)
* `GET   /api/housekeeping/dashboard` — Cleaning task queue and incoming guest requests.
* `PATCH /api/housekeeping/tasks/:taskId/step` — Toggle individual cleaning checklist steps.
* `POST  /api/housekeeping/tasks/:taskId/certify` — Certify room as clean and ready for guests.
* `POST  /api/housekeeping/maintenance` — Create maintenance ticket and lock room.
* `PATCH /api/housekeeping/inventory/:itemId/restock` — Restock linen or amenity supplies.

### 7. Executive Administration (`/api/admin`)
* `GET   /api/admin/analytics` — Live hotel KPI analytics (Occupancy %, ADR, RevPAR, Gross Revenue).
* `GET   /api/admin/staff` — List staff accounts and roles.
* `POST  /api/admin/staff` — Provision new receptionist or housekeeping staff member.
* `PATCH /api/admin/staff/:id/status` — Activate or deactivate staff member account.

---

## 🛠 Local Setup & Installation

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `server/` root:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/luxurystay?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
SAFEPAY_API_KEY=your_safepay_sandbox_key
SAFEPAY_SECRET_KEY=your_safepay_sandbox_secret
```

### 3. Seed Database
Populate MongoDB Atlas with default suites, staff accounts, and operational tasks:
```bash
npm run seed
```

### 4. Start Server
```bash
# Development with auto-restart
npm run dev

# Production
npm start
```
