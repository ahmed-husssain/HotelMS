# Stayza — Server API & Real-Time Engine

> **Backend REST API, WebSocket Server, & PDF Invoice Engine**  
> Built with Node.js, Express.js, MongoDB Atlas (Mongoose ODM), Socket.IO, JWT, and PDFKit.

[![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![Express.js](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express)](https://expressjs.com)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-010101?style=for-the-badge&logo=socket.io)](https://socket.io)

---

## 🏛 Core Architecture Principles

1. **Server-Side Pricing (`pricingService.js`):**  
   Nightly rates, date math, 13% Sindh Sales Tax, 30% online advance deposit, and 70% front-desk balance are calculated strictly on the backend so prices cannot be manipulated from the browser.
2. **5-Minute Temporary Room Hold (`availabilityService.js`):**  
   When a guest starts checkout, the room is temporarily locked in MongoDB for 5 minutes (`holdExpiresAt`) to prevent double-booking. If payment is canceled or expires, the hold is safely cleared.
3. **Role-Based Access Control (`auth.js`, `rbac.js`):**  
   Protected endpoints verify JWT signatures and enforce permissions across 4 roles: `guest`, `receptionist`, `housekeeping`, and `admin`. Public registration only creates `guest` accounts.
4. **Instant PDF Invoices (`invoiceService.js`):**  
   Uses `pdfkit` to generate official branded tax invoices and receipts in memory and stream them directly as a PDF download.
5. **Real-Time Updates (`socketService.js`):**  
   Socket.IO broadcasts room status updates, housekeeping completions, and guest requests across staff consoles without requiring page reloads.

---

## 🗄 Database Models (MongoDB Collections)

| Model | Collection | Purpose |
| :--- | :--- | :--- |
| **`User`** | `users` | Accounts with bcrypt-hashed passwords and roles (`guest`, `receptionist`, `housekeeping`, `admin`). |
| **`Room`** | `rooms` | Suite details, nightly rates, amenities, and status (*AVAILABLE*, *OCCUPIED*, *DIRTY*, *CLEANING*, *MAINTENANCE*). |
| **`Booking`** | `bookings` | Guest info, room ID, check-in/out dates, price snapshot, 5-minute hold timestamps, and status. |
| **`Payment`** | `payments` | Safepay transaction reference, amount, currency, and payment type (30% Advance vs 70% Balance). |
| **`Invoice`** | `invoices` | Invoice numbers, tax breakdown (13% Sindh Sales Tax), and settlement history. |
| **`HousekeepingTask`**| `housekeepingtasks` | Room cleaning checklists, assigned housekeeper, priority, and certification timestamp. |
| **`MaintenanceRequest`**| `maintenancerequests` | Room maintenance issues, severity, room locking, and resolution notes. |
| **`InventoryItem`** | `inventoryitems` | Stock counts for cleaning supplies and guest amenities. |
| **`ActivityLog`** | `activitylogs` | Record of staff actions, rate updates, check-ins, and payments. |

---

## 📡 API Endpoints Overview

### 1. Authentication (`/api/auth`)
* `POST /api/auth/register` — Create a new guest account.
* `POST /api/auth/login` — Sign in and receive a JWT token.
* `GET  /api/auth/me` — Get current logged-in user profile.

### 2. Room Inventory (`/api/rooms`)
* `GET   /api/rooms` — List all suites (with optional date availability filter).
* `GET   /api/rooms/:id` — Get specifications for a single suite.
* `PATCH /api/rooms/:id/status` — Update room operational status (Staff only).
* `PATCH /api/rooms/:id/checklist` — Update cleaning checklist (Housekeeping only).

### 3. Bookings (`/api/bookings`)
* `POST /api/bookings/quote` — Get server-validated price quote with 13% tax and 30% split.
* `POST /api/bookings/hold` — Place a 5-minute hold on a room.
* `POST /api/bookings/:reference/release-hold` — Release an expired or canceled hold.
* `POST /api/bookings/:reference/confirm` — Confirm booking after payment verification.
* `GET  /api/bookings/lookup` — Look up reservation by booking reference code.
* `GET  /api/bookings/:reference/invoice` — Download official PDF invoice/receipt.
* `POST /api/bookings/:reference/incidentals` — Order room service or extra experiences.
* `POST /api/bookings/:reference/feedback` — Submit guest stay feedback and star rating.

### 4. Payments (`/api/payments`)
* `POST /api/payments/checkout-session` — Create Safepay checkout session for 30% deposit.
* `POST /api/payments/verify` — Verify transaction with Safepay API.
* `POST /api/payments/webhook` — Safepay webhook listener for payment settlement.

### 5. Front Desk (`/api/staff`)
* `GET  /api/staff/dashboard` — Live arrivals, in-house guests, and room status matrix.
* `POST /api/staff/check-in/:bookingRef` — Check in an arriving guest.
* `POST /api/staff/check-out/:bookingRef` — Check out guest and settle remaining balance.
* `POST /api/staff/folio/:bookingRef/add` — Add an extra charge to a guest's room bill.
* `GET  /api/staff/shifts/current` — Daily cashier shift summary.

### 6. Housekeeping (`/api/housekeeping`)
* `GET   /api/housekeeping/dashboard` — Cleaning queue and guest service requests.
* `PATCH /api/housekeeping/tasks/:taskId/step` — Check off a cleaning step.
* `POST  /api/housekeeping/tasks/:taskId/certify` — Certify room as clean and ready.
* `POST  /api/housekeeping/maintenance` — Report a broken item and lock the room.
* `PATCH /api/housekeeping/inventory/:itemId/restock` — Restock supplies or linen.

### 7. Manager & Admin (`/api/admin`)
* `GET   /api/admin/analytics` — Live hotel stats (Occupancy %, ADR, RevPAR, Revenue).
* `GET   /api/admin/staff` — List staff members and roles.
* `POST  /api/admin/staff` — Add a new staff member.
* `PATCH /api/admin/staff/:id/status` — Activate or deactivate a staff account.

---

## 🛠 Local Setup & Running

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Environment Variables
Create a `.env` file in `server/`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/luxurystay?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
SAFEPAY_API_KEY=your_safepay_key
SAFEPAY_SECRET_KEY=your_safepay_secret
```

### 3. Seed Database & Run
```bash
# Seed initial rooms and accounts
npm run seed

# Run with auto-reload
npm run dev

# Run in production mode
npm start
```
