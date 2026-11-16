# LuxuryStay Hotel Management System — Technical Requirements Document (TRD)

---

## 1. System Overview & Technology Stack

* **Architecture Pattern:** Decoupled Client-Server (RESTful JSON API + WebSocket Real-Time Event Hub)
* **Backend:** Node.js (v24 LTS), Express.js (v4.21+)
* **Database:** MongoDB (v7+) with Mongoose ODM (v8.9+)
* **Frontend:** React (v18/19), Vite, Tailwind CSS, Lucide React Icons
* **Real-Time Communication:** Socket.IO (v4.8+)
* **Payment Integration:** Safepay API (Hosted Checkout + Webhook Verification)
* **Document Generation:** PDFKit (Server-Side Advance Receipts & Final Tax Invoices)

---

## 2. Database Schema Specifications (Mongoose)

### 2.1 Collection: `users`
```typescript
interface IUser {
  _id: ObjectId;
  name: string;
  email: string; // unique, lowercase, indexed
  password: string; // select: false, bcrypt hashed (cost 10)
  role: 'guest' | 'receptionist' | 'housekeeping' | 'admin';
  phone?: string;
  address?: string;
  isActive: boolean; // default: true
  createdAt: Date;
  updatedAt: Date;
}
```

### 2.2 Collection: `rooms`
```typescript
interface IRoom {
  _id: ObjectId;
  roomNumber: string; // unique, e.g. "101", "302"
  roomType: 'Deluxe Room' | 'Executive Suite' | 'Presidential Suite' | 'Family Suite';
  floor: number;
  baseNightlyRate: number; // in PKR
  capacity: {
    adults: number;
    children: number;
  };
  amenities: string[]; // ["High-speed WiFi", "Jacuzzi", "King Bed", "Balcony"]
  images: string[]; // paths / URLs
  description: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'DIRTY' | 'CLEANING' | 'MAINTENANCE';
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}
// Indexes: { roomType: 1, status: 1 }, { roomNumber: 1 }
```

### 2.3 Collection: `bookings`
```typescript
interface IBooking {
  _id: ObjectId;
  bookingReference: string; // unique, e.g. "LS-202611-9821"
  guest: ObjectId; // ref: 'User'
  room: ObjectId; // ref: 'Room'
  checkInDate: Date;
  checkOutDate: Date;
  numberOfNights: number;
  guestDetails: {
    name: string;
    email: string;
    phone: string;
    specialRequests?: string;
  };
  pricingSnapshot: {
    nightlyRate: number;
    subtotal: number;
    taxPercent: number; // 13%
    taxAmount: number;
    totalAmount: number;
    advancePercentage: number; // 30%
    advanceAmountRequired: number;
    advanceAmountPaid: number;
    remainingBalance: number;
    currency: 'PKR';
  };
  status: 'AWAITING_PAYMENT' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED' | 'EXPIRED';
  holdExpiresAt?: Date; // 5 minutes TTL lock
  checkedInAt?: Date;
  checkedOutAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
// Indexes: { room: 1, checkInDate: 1, checkOutDate: 1, status: 1 }
```

### 2.4 Collection: `payments`
```typescript
interface IPayment {
  _id: ObjectId;
  bookingId: ObjectId; // ref: 'Booking'
  guestId: ObjectId; // ref: 'User'
  collectedBy?: ObjectId; // ref: 'User' (Staff who received desk payment)
  transactionType: 'ADVANCE_30' | 'BALANCE_70' | 'EXTRA_SERVICE' | 'REFUND';
  paymentMethod: 'SAFEPAY_ONLINE' | 'CASH_AT_DESK' | 'CARD_POS' | 'BANK_TRANSFER';
  amount: number;
  currency: 'PKR';
  status: 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'REFUNDED';
  idempotencyKey: string; // unique index
  safepayReference?: string; // unique index
  safepaySignature?: string;
  receiptNumber: string; // unique, e.g. "RCP-2026-4401"
  notes?: string;
  paidAt: Date;
  createdAt: Date;
}
```

### 2.5 Collection: `folio_items`
```typescript
interface IFolioItem {
  _id: ObjectId;
  bookingId: ObjectId; // ref: 'Booking'
  category: 'FOOD_BEVERAGE' | 'LAUNDRY' | 'MINIBAR' | 'SPA' | 'AIRPORT_TRANSFER' | 'LATE_CHECKOUT';
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  addedBy: ObjectId; // ref: 'User' (Staff who added charge)
  createdAt: Date;
}
```

### 2.6 Collection: `invoices`
```typescript
interface IInvoice {
  _id: ObjectId;
  invoiceNumber: string; // unique, e.g. "INV-2026-8812"
  bookingId: ObjectId; // ref: 'Booking'
  guestId: ObjectId; // ref: 'User'
  type: 'ADVANCE_RECEIPT' | 'FINAL_TAX_INVOICE';
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  pdfPath?: string;
  issuedAt: Date;
}
```

### 2.7 Collection: `housekeeping_tasks`
```typescript
interface IHousekeepingTask {
  _id: ObjectId;
  roomId: ObjectId; // ref: 'Room'
  assignedTo?: ObjectId; // ref: 'User'
  taskType: 'TURNOVER_CLEAN' | 'DAILY_TIDY' | 'DEEP_CLEAN';
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'INSPECTED';
  notes?: string;
  completedAt?: Date;
  createdAt: Date;
}
```

### 2.8 Collection: `maintenance_requests`
```typescript
interface IMaintenanceRequest {
  _id: ObjectId;
  roomId: ObjectId; // ref: 'Room'
  reportedBy: ObjectId; // ref: 'User'
  assignedTechnician?: string;
  issueCategory: 'PLUMBING' | 'ELECTRICAL' | 'HVAC_AIR_CONDITIONING' | 'CARPENTRY' | 'ELECTRONICS';
  issueDescription: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'REPORTED' | 'IN_PROGRESS' | 'RESOLVED';
  resolutionNotes?: string;
  resolvedAt?: Date;
  createdAt: Date;
}
```

### 2.9 Collection: `cashier_shifts`
```typescript
interface ICashierShift {
  _id: ObjectId;
  cashier: ObjectId; // ref: 'User'
  openedAt: Date;
  closedAt?: Date;
  openingFloat: number; // Initial cash in drawer
  totalCashCollected: number;
  totalCardCollected: number;
  expectedCashTotal: number;
  actualCashReported?: number;
  discrepancy?: number;
  handoverNotes?: string;
  status: 'OPEN' | 'CLOSED';
}
```

### 2.10 Collection: `activity_logs`
```typescript
interface IActivityLog {
  _id: ObjectId;
  userId?: ObjectId; // ref: 'User'
  action: string; // e.g. "CHECK_IN_GUEST", "OVERRIDE_ROOM_STATUS", "RECORD_PAYMENT"
  details: string;
  targetModel: 'Booking' | 'Room' | 'Payment' | 'User' | 'FolioItem';
  targetId: ObjectId;
  ipAddress?: string;
  timestamp: Date;
}
```

---

## 3. Core Technical Algorithms

### 3.1 Date Overlap Availability Engine
Given a search window $[S_{\text{in}}, S_{\text{out}}]$, a room is available if it has **zero** overlapping active bookings:
```javascript
const conflictingBookings = await Booking.find({
  room: roomId,
  checkInDate: { $lt: searchCheckOutDate },
  checkOutDate: { $gt: searchCheckInDate },
  $or: [
    { status: { $in: ['CONFIRMED', 'CHECKED_IN'] } },
    { status: 'AWAITING_PAYMENT', holdExpiresAt: { $gt: new Date() } }
  ]
}).select('room');
```

### 3.2 5-Minute Dynamic Pessimistic Lock
When a user initiates booking:
```javascript
const session = await mongoose.startSession();
session.startTransaction();
try {
  // Check room status and conflict in one atomic step
  const conflict = await Booking.findOne({
    room: roomId,
    checkInDate: { $lt: checkOutDate },
    checkOutDate: { $gt: checkInDate },
    $or: [
      { status: { $in: ['CONFIRMED', 'CHECKED_IN'] } },
      { status: 'AWAITING_PAYMENT', holdExpiresAt: { $gt: new Date() } }
    ]
  }).session(session);

  if (conflict) {
    throw new Error('Room is no longer available for these dates.');
  }

  const booking = await Booking.create([{
    bookingReference: generateRef(),
    guest: userId,
    room: roomId,
    checkInDate,
    checkOutDate,
    pricingSnapshot: calculatePrices(room.baseNightlyRate, checkInDate, checkOutDate),
    status: 'AWAITING_PAYMENT',
    holdExpiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
  }], { session });

  await session.commitTransaction();
  return booking[0];
} catch (err) {
  await session.abortTransaction();
  throw err;
} finally {
  session.endSession();
}
```

### 3.3 Idempotent Safepay Webhook Handling
```javascript
exports.handleSafepayWebhook = async (req, res) => {
  const signature = req.headers['x-sfpy-signature'];
  const isValid = verifySafepayHmac(req.rawBody, signature, process.env.SAFEPAY_WEBHOOK_SECRET);
  if (!isValid) return res.status(401).json({ error: 'Invalid HMAC signature' });

  const { tracker, reference, amount, currency, status } = req.body.data;
  
  // Idempotency: Check if already processed
  const existing = await Payment.findOne({ safepayReference: reference });
  if (existing && existing.status === 'SUCCEEDED') {
    return res.status(200).json({ status: 'ALREADY_PROCESSED' });
  }

  // Update payment and booking
  const payment = await Payment.create({
    bookingId: req.body.data.metadata.bookingId,
    guestId: req.body.data.metadata.guestId,
    transactionType: 'ADVANCE_30',
    paymentMethod: 'SAFEPAY_ONLINE',
    amount,
    currency,
    status: 'SUCCEEDED',
    safepayReference: reference,
    idempotencyKey: `IDEMP-${reference}`,
    receiptNumber: generateReceiptNum(),
    paidAt: new Date()
  });

  await Booking.findByIdAndUpdate(payment.bookingId, {
    status: 'CONFIRMED',
    $unset: { holdExpiresAt: 1 }
  });

  // Real-time broadcast to front-desk
  io.to('receptionists').emit('booking:confirmed', { bookingId: payment.bookingId });

  return res.status(200).json({ status: 'SUCCESS' });
};
```

---

## 4. API Endpoints Map

| Method | Route | Description | Auth / Role |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new guest | Public |
| `POST` | `/api/auth/login` | Login user, return JWT | Public |
| `GET` | `/api/auth/me` | Fetch authenticated profile | Any Auth |
| `GET` | `/api/rooms` | Search & filter room catalog | Public |
| `GET` | `/api/rooms/availability` | Query available rooms for dates | Public |
| `POST` | `/api/rooms` | Add new physical room | Admin |
| `POST` | `/api/bookings` | Create 5-min locked booking | Guest / Auth |
| `POST` | `/api/bookings/:id/release-hold` | Free locked room immediately | Guest / Auth |
| `GET` | `/api/bookings/my` | View guest's booking history | Guest |
| `POST` | `/api/payments/checkout-session` | Initialize Safepay advance | Guest |
| `POST` | `/api/payments/webhook` | Safepay server notification | Safepay HMAC |
| `POST` | `/api/staff/check-in/:id` | Check in guest & occupy room | Receptionist / Admin |
| `POST` | `/api/staff/check-out/:id` | Settle folio & check out guest | Receptionist / Admin |
| `POST` | `/api/folio/:bookingId/add` | Post extra service charge | Receptionist / Admin |
| `GET` | `/api/housekeeping/queue` | View dirty / cleaning rooms | Housekeeping / Admin |
| `PATCH`| `/api/housekeeping/:id/status` | Mark room clean / available | Housekeeping / Admin |
| `POST` | `/api/shifts/open` | Open cashier shift session | Receptionist |
| `POST` | `/api/shifts/close` | Close cashier shift (Z-Report) | Receptionist |
| `GET` | `/api/reports/analytics` | Occupancy & revenue analytics | Admin |
| `GET` | `/api/reports/audit-logs` | Review activity audit trail | Admin |

