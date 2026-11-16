# LuxuryStay Hospitality — Backend Architecture & Agent Implementation Blueprint

This document serves as the **definitive engineering specification** for developing the LuxuryStay Hotel Management System backend. Any AI agent or developer implementing features must strictly follow the conventions, schemas, business logic, and API contracts defined herein.

---

## 1. Directory Structure & File Map

```
d:\Hotel-Management\server\
├── package.json
├── .env.example
├── .gitignore
├── server.js                  # Express bootstrap, HTTP server & Socket.IO initialization
└── src\
    ├── config\
    │   ├── db.js              # Mongoose MongoDB connection handler
    │   ├── safepay.js         # Safepay SDK / config (Sandbox keys, webhook secrets)
    │   └── socket.js          # Socket.IO instance and connection manager
    ├── models\
    │   ├── User.js            # Guest, Admin, Receptionist, Housekeeping profiles
    │   ├── Room.js            # Room inventory, types, amenities, operational status
    │   ├── Booking.js         # Reservations, dates, guests, price snapshot, status
    │   ├── Payment.js         # Financial ledger (30% advance, 70% balance, refunds)
    │   ├── Invoice.js         # Generated invoices and advance receipts
    │   ├── HousekeepingTask.js# Housekeeping cleaning & inspection queues
    │   └── Notification.js    # In-app persistent alerts for staff & guests
    ├── middleware\
    │   ├── auth.js            # JWT verification & `req.user` attachment
    │   ├── rbac.js            # Role-based authorization (`authorize('admin', 'receptionist')`)
    │   ├── validate.js        # Request body & query parameter schema validator
    │   └── errorHandler.js    # Global centralized error handler with HTTP status codes
    ├── controllers\
    │   ├── authController.js         # Register, login, current profile, password update
    │   ├── roomController.js         # Room CRUD & date-based availability search
    │   ├── bookingController.js      # Booking creation, temporary hold, cancel, list
    │   ├── paymentController.js      # Safepay checkout session, webhook handler, balance collection
    │   ├── staffOperationsController.js # Check-in, check-out, room status override
    │   ├── housekeepingController.js # Cleaning tasks, status update, maintenance flags
    │   └── reportController.js       # Occupancy calculations, collected revenue, analytics
    ├── routes\
    │   ├── authRoutes.js
    │   ├── roomRoutes.js
    │   ├── bookingRoutes.js
    │   ├── paymentRoutes.js
    │   ├── staffRoutes.js
    │   ├── housekeepingRoutes.js
    │   └── reportRoutes.js
    ├── services\
    │   ├── availabilityService.js    # Overlap query logic & atomic hold release
    │   ├── pricingService.js         # Server-side pricing: nights, taxes, 30%/70% splits
    │   ├── pdfService.js             # PDFKit generator for receipts and final invoices
    │   └── socketService.js          # Typed helper to emit real-time staff alerts
    └── utils\
        ├── seedData.js               # Comprehensive test database seeder
        └── logger.js                 # Structured console logging
```

---

## 2. MongoDB Mongoose Schemas (Exact Definitions)

### 2.1 `User.js`
* **Roles:** `'guest'`, `'receptionist'`, `'housekeeping'`, `'admin'`
* **Fields:**
  * `name`: `{ type: String, required: true, trim: true }`
  * `email`: `{ type: String, required: true, unique: true, lowercase: true, trim: true }`
  * `password`: `{ type: String, required: true, minlength: 6, select: false }`
  * `role`: `{ type: String, enum: ['guest', 'receptionist', 'housekeeping', 'admin'], default: 'guest' }`
  * `phone`: `{ type: String, trim: true }`
  * `address`: `{ type: String }`
  * `isActive`: `{ type: Boolean, default: true }`
  * `timestamps`: `true`
* **Hooks:** Pre-save bcrypt hashing (salt rounds: 10). Method `comparePassword(candidatePassword)`.

### 2.2 `Room.js`
* **Operational Statuses:**
  * `'AVAILABLE'` — Clean and ready for occupancy.
  * `'OCCUPIED'` — Guest has checked in.
  * `'DIRTY'` — Guest checked out or cleaning scheduled.
  * `'CLEANING'` — Housekeeper actively servicing the room.
  * `'MAINTENANCE'` — Out of order / under repair.
* **Fields:**
  * `roomNumber`: `{ type: String, required: true, unique: true, trim: true }`
  * `title`: `{ type: String, required: true }` (e.g., "Presidential Suite - Ocean View")
  * `type`: `{ type: String, enum: ['Single', 'Double', 'Deluxe', 'Executive Suite', 'Presidential Suite'], required: true }`
  * `capacity`: `{ adults: { type: Number, required: true, default: 2 }, children: { type: Number, default: 0 } }`
  * `baseNightlyRate`: `{ type: Number, required: true, min: 0 }` (PKR currency standard)
  * `amenities`: `[{ type: String }]` (e.g. `['WiFi', 'Jacuzzi', 'Mini Bar', 'King Bed', 'City View', 'Balcony']`)
  * `images`: `[{ type: String }]` (URLs or asset paths)
  * `description`: `{ type: String }`
  * `floor`: `{ type: Number, required: true }`
  * `status`: `{ type: String, enum: ['AVAILABLE', 'OCCUPIED', 'DIRTY', 'CLEANING', 'MAINTENANCE'], default: 'AVAILABLE' }`
  * `isPublished`: `{ type: Boolean, default: true }`
  * `timestamps`: `true`

### 2.3 `Booking.js`
* **Booking Statuses:**
  * `'AWAITING_PAYMENT'` — Temporary hold (15-min TTL) while paying advance.
  * `'CONFIRMED'` — 30% advance verified by Safepay webhook.
  * `'CHECKED_IN'` — Guest arrived; verified by receptionist.
  * `'CHECKED_OUT'` — Remaining 70% paid, final invoice generated, guest left.
  * `'CANCELLED'` — Cancelled by guest or staff.
  * `'EXPIRED'` — Payment window elapsed without completion.
* **Fields:**
  * `bookingReference`: `{ type: String, required: true, unique: true, uppercase: true }` (e.g., `LS-202611-8842`)
  * `guest`: `{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }`
  * `room`: `{ type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true }`
  * `checkInDate`: `{ type: Date, required: true }`
  * `checkOutDate`: `{ type: Date, required: true }`
  * `numberOfNights`: `{ type: Number, required: true }`
  * `guestDetails`: `{ name: String, email: String, phone: String, specialRequests: String }`
  * `pricingSnapshot`: `{
      nightlyRate: Number,
      subtotal: Number,
      taxPercent: { type: Number, default: 13 },
      taxAmount: Number,
      totalAmount: Number,
      advancePercentage: { type: Number, default: 30 },
      advanceAmountRequired: Number,
      advanceAmountPaid: { type: Number, default: 0 },
      remainingBalance: Number,
      currency: { type: String, default: 'PKR' }
    }`
  * `status`: `{ type: String, enum: ['AWAITING_PAYMENT', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED', 'EXPIRED'], default: 'AWAITING_PAYMENT' }`
  * `holdExpiresAt`: `{ type: Date }` (Created as `now + 15 minutes`)
  * `checkedInAt`: `{ type: Date }`
  * `checkedOutAt`: `{ type: Date }`
  * `timestamps`: `true`

### 2.4 `Payment.js`
* **Fields:**
  * `booking`: `{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true }`
  * `transactionType`: `{ type: String, enum: ['ADVANCE_30', 'BALANCE_70', 'EXTRA_CHARGES', 'REFUND'], required: true }`
  * `paymentMethod`: `{ type: String, enum: ['SAFEPAY_CHECKOUT', 'CASH_AT_DESK', 'CARD_AT_DESK', 'BANK_TRANSFER'], required: true }`
  * `amount`: `{ type: Number, required: true }`
  * `currency`: `{ type: String, default: 'PKR' }`
  * `status`: `{ type: String, enum: ['PENDING', 'SUCCEEDED', 'FAILED', 'EXPIRED', 'REFUNDED'], default: 'PENDING' }`
  * `safepayToken`: `{ type: String }` (Safepay tracker / session token)
  * `safepayReference`: `{ type: String }` (Safepay payment reference ID)
  * `safepaySignature`: `{ type: String }` (Webhook verification signature)
  * `collectedBy`: `{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }` (Staff ID who recorded desk balance)
  * `receiptNumber`: `{ type: String, unique: true }`
  * `paidAt`: `{ type: Date }`
  * `timestamps`: `true`

### 2.5 `Invoice.js`
* **Fields:**
  * `invoiceNumber`: `{ type: String, required: true, unique: true }` (e.g., `INV-2026-1049`)
  * `booking`: `{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true }`
  * `guest`: `{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }`
  * `type`: `{ type: String, enum: ['ADVANCE_RECEIPT', 'FINAL_INVOICE'], required: true }`
  * `lineItems`: `[{ description: String, quantity: Number, unitPrice: Number, totalPrice: Number }]`
  * `subtotal`: `{ type: Number, required: true }`
  * `taxAmount`: `{ type: Number, required: true }`
  * `totalAmount`: `{ type: Number, required: true }`
  * `amountPaid`: `{ type: Number, required: true }`
  * `balanceDue`: `{ type: Number, required: true }`
  * `pdfPath`: `{ type: String }`
  * `issueDate`: `{ type: Date, default: Date.now }`
  * `timestamps`: `true`

### 2.6 `HousekeepingTask.js`
* **Fields:**
  * `room`: `{ type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true }`
  * `assignedTo`: `{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }`
  * `taskType`: `{ type: String, enum: ['CLEAN_TURNOVER', 'DAILY_TIDY', 'DEEP_CLEAN', 'INSPECTION'], default: 'CLEAN_TURNOVER' }`
  * `priority`: `{ type: String, enum: ['LOW', 'NORMAL', 'HIGH', 'URGENT'], default: 'NORMAL' }`
  * `status`: `{ type: String, enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'INSPECTED'], default: 'PENDING' }`
  * `notes`: `{ type: String }`
  * `completedAt`: `{ type: Date }`
  * `timestamps`: `true`

---

## 3. Core Algorithms & Business Rules

### 3.1 Date Overlap & Availability Algorithm
A room $R$ is unavailable during target search range $[S_{in}, S_{out}]$ if there is ANY existing active booking $[B_{in}, B_{out}]$ that satisfies:
$$\text{Overlaps} \iff B_{in} < S_{out} \quad \text{AND} \quad B_{out} > S_{in}$$
* **Active Statuses that Block a Room:**
  * `'CONFIRMED'`, `'CHECKED_IN'`
  * `'AWAITING_PAYMENT'` **IF AND ONLY IF** `holdExpiresAt > new Date()`
* **Mongoose Implementation:**
  ```javascript
  const overlappingBookings = await Booking.find({
    room: roomId,
    status: { $in: ['CONFIRMED', 'CHECKED_IN', 'AWAITING_PAYMENT'] },
    $or: [
      { status: { $in: ['CONFIRMED', 'CHECKED_IN'] } },
      { status: 'AWAITING_PAYMENT', holdExpiresAt: { $gt: new Date() } }
    ],
    checkInDate: { $lt: searchCheckOut },
    checkOutDate: { $gt: searchCheckIn }
  }).select('room');
  ```

### 3.2 Server-Side Pricing & 30% / 70% Calculation
**Rule:** The client-side browser is NEVER trusted with calculations.
```javascript
function calculateBookingPrice(baseNightlyRate, checkInDate, checkOutDate) {
  const nights = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));
  if (nights < 1) throw new Error('Check-out date must be at least 1 night after check-in.');

  const subtotal = nights * baseNightlyRate;
  const taxPercent = 13; // Luxury Hospitality Tax
  const taxAmount = Math.round(subtotal * (taxPercent / 100));
  const totalAmount = subtotal + taxAmount;
  
  const advancePercentage = 30;
  const advanceAmountRequired = Math.round(totalAmount * (advancePercentage / 100));
  const remainingBalance = totalAmount - advanceAmountRequired;

  return {
    nightlyRate: baseNightlyRate,
    numberOfNights: nights,
    subtotal,
    taxPercent,
    taxAmount,
    totalAmount,
    advancePercentage,
    advanceAmountRequired,
    remainingBalance,
    currency: 'PKR'
  };
}
```

### 3.3 Safepay Checkout & Webhook Verification
1. **Frontend Request:** `POST /api/payments/create-checkout` with `{ bookingId }`.
2. **Backend Action:**
   * Validate booking is in `AWAITING_PAYMENT` and `holdExpiresAt > now`.
   * Initialize Safepay payment tracker with `amount = pricingSnapshot.advanceAmountRequired` and currency `PKR`.
   * Return the hosted checkout URL or checkout token to frontend.
3. **Webhook Listener:** `POST /api/payments/webhook`.
   * Must verify Safepay signature using the secret key from `.env`.
   * Verify amount and currency match the booking record.
   * If verified, update `Payment` to `SUCCEEDED`, update `Booking` to `CONFIRMED`, and emit Socket.IO notification to Reception.

---

## 4. API Endpoints Contract

### 4.1 Authentication (`/api/auth`)
* `POST /api/auth/register` — Register a guest account. Returns JWT + user object.
* `POST /api/auth/login` — Login with email/password. Returns JWT + role + user object.
* `GET /api/auth/me` — (Protected) Get current logged-in profile.
* `POST /api/auth/logout` — Clear token / session.

### 4.2 Rooms (`/api/rooms`)
* `GET /api/rooms` — Public listing of rooms with filter queries (`type`, `capacity`, `minPrice`, `maxPrice`).
* `GET /api/rooms/availability?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD&adults=N` — Date-range availability query.
* `GET /api/rooms/:id` — Details of a specific room, amenities, and photos.
* `POST /api/rooms` — (Admin only) Create new room.
* `PUT /api/rooms/:id` — (Admin only) Update room details or base rate.
* `DELETE /api/rooms/:id` — (Admin only) Deactivate / delete room.

### 4.3 Bookings (`/api/bookings`)
* `POST /api/bookings` — (Guest/Auth) Create temporary reservation (`AWAITING_PAYMENT`, 15-min hold).
* `GET /api/bookings/my` — (Guest) List current user's bookings.
* `GET /api/bookings/:id` — (Guest/Staff) Get detailed booking snapshot.
* `GET /api/bookings` — (Staff/Admin) List all bookings with status filter.
* `PATCH /api/bookings/:id/cancel` — Cancel reservation.

### 4.4 Payments (`/api/payments`)
* `POST /api/payments/create-checkout` — Generate Safepay checkout session for 30% advance.
* `POST /api/payments/webhook` — Safepay server-to-server webhook callback (signature verified).
* `POST /api/payments/collect-balance` — (Receptionist/Admin) Record remaining 70% paid at hotel desk.
* `GET /api/payments/booking/:bookingId` — Fetch audit ledger of all payments for a booking.

### 4.5 Front-Desk Staff Operations (`/api/staff`)
* `PATCH /api/staff/bookings/:id/check-in` — Record guest arrival (updates room to `OCCUPIED`).
* `PATCH /api/staff/bookings/:id/check-out` — Record guest departure (verifies balance = 0, updates room to `DIRTY`, triggers housekeeping).
* `PATCH /api/staff/rooms/:id/status` — Receptionist/Manager manual status override.

### 4.6 Housekeeping (`/api/housekeeping`)
* `GET /api/housekeeping/tasks` — List pending/in-progress cleaning tasks.
* `PATCH /api/housekeeping/tasks/:id/status` — Update task (`IN_PROGRESS`, `COMPLETED`).
* `PATCH /api/housekeeping/rooms/:id/cleaned` — Mark room as `CLEAN` $\rightarrow$ automatically transitions room to `AVAILABLE` and notifies Receptionist.

### 4.7 Reports & Analytics (`/api/reports`)
* `GET /api/reports/dashboard-stats` — Key counters: Today's check-ins, check-outs, occupied rooms, pending cleanings.
* `GET /api/reports/occupancy?startDate=...&endDate=...` — Percentage occupancy over date range.
* `GET /api/reports/revenue?startDate=...&endDate=...` — Verified collected money (advance + balance).

---

## 5. Socket.IO Real-Time Event Architecture

| Event Name | Emitter | Intended Room / Listeners | Payload |
| :--- | :--- | :--- | :--- |
| `booking:new` | Backend Payment Webhook | `receptionists`, `admins` | `{ bookingReference, guestName, roomNumber, totalAmount, advancePaid }` |
| `booking:checked_in` | Receptionist Check-in | `receptionists`, `admins` | `{ bookingReference, roomNumber, checkedInAt }` |
| `room:status_changed` | Housekeeping / Staff | `receptionists`, `housekeeping` | `{ roomId, roomNumber, previousStatus, newStatus }` |
| `housekeeping:task_created` | Check-out trigger | `housekeeping` | `{ taskId, roomNumber, priority: 'HIGH' }` |
| `housekeeping:task_completed`| Housekeeper mark clean | `receptionists` | `{ roomId, roomNumber, status: 'AVAILABLE' }` |

---

## 6. Implementation Phasing for Development Agents

1. **Step 1: Scaffolding & Configuration**
   * Initialize `server/package.json` with dependencies (`express`, `mongoose`, `cors`, `dotenv`, `jsonwebtoken`, `bcryptjs`, `socket.io`, `pdfkit`, `morgan`).
   * Setup `src/config/db.js` and `server.js` with CORS and basic healthcheck route (`GET /health`).
2. **Step 2: Models & Seed Engine**
   * Write all 7 Mongoose schemas in `src/models/`.
   * Create `src/utils/seedData.js` to seed 8 rooms (Deluxe, Suites, etc.) and demo users for all 4 roles.
3. **Step 3: Auth & RBAC Middleware**
   * Implement JWT signing and verify middleware in `src/middleware/auth.js` and `src/middleware/rbac.js`.
   * Implement `authRoutes.js` and `authController.js`.
4. **Step 4: Rooms & Availability Engine**
   * Implement `roomController.js` and `availabilityService.js` with the overlap algorithm.
5. **Step 5: Bookings & 15-Minute Hold Logic**
   * Implement `bookingController.js` with atomic booking creation and hold expiry check.
6. **Step 6: Safepay Integration & Payments Ledger**
   * Implement `paymentController.js` and `safepay.js` service for checkout and webhook.
7. **Step 7: Staff & Housekeeping Operations**
   * Implement check-in/out endpoints and housekeeping task updates.
8. **Step 8: Socket.IO & PDF Invoice Generation**
   * Connect Socket.IO events and generate printable PDF receipts.

