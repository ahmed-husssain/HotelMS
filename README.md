# Stayza — Luxury Hotel Management System (HMS)

> **A modern hotel booking and operations platform built with the MERN stack.**  
> Features real-time room availability with 5-minute temporary holds, 30% online advance deposits via Safepay, front desk check-in, live housekeeping updates, and a self-service guest portal with digital room keys.

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-064E3B?style=for-the-badge)](https://mongodb.com)
[![React 19](https://img.shields.io/badge/React-19-0F172A?style=for-the-badge&logo=react)](https://react.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-38BDF8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com)
[![Safepay](https://img.shields.io/badge/Payments-Safepay_30%25-D4AF37?style=for-the-badge)](https://getsafepay.com)

---

## 🌐 Live Deployments

* **Frontend Web Application:** [https://stayza.web.app](https://stayza.web.app) *(Mirror: [https://habittas.web.app](https://habittas.web.app))*
* **Backend REST API:** [https://hotel-ms-mu.vercel.app](https://hotel-ms-mu.vercel.app)
* **GitHub Repository:** [https://github.com/ahmed-husssain/HotelMS](https://github.com/ahmed-husssain/HotelMS)

---

## 📖 What is Stayza?

**Stayza** is a full-stack hotel management web application designed to connect guests and hotel staff seamlessly:

* **For Guests:** Browse luxury suites, check real-time availability, hold a room for 5 minutes during checkout, pay a 30% advance deposit online via Safepay, and manage their stay with a digital room key, room service orders, and live billing.
* **For Front Desk:** View arriving guests, check guests in/out, collect the remaining 70% balance at the desk, post extra room charges, view a visual room rack, and close daily cashier shifts.
* **For Housekeeping:** Track dirty and cleaning rooms, complete step-by-step cleaning checklists, report maintenance issues, deliver guest requests, and track linen inventory.
* **For General Managers:** Monitor live occupancy rates, average daily room rates, revenue metrics, manage staff accounts, adjust room prices, and view activity logs.

---

## ✨ Key Features

### 1. Guest Booking Journey
* **Suite Showcase:** Browse luxury suites (Oceanfront Villa, Beach Suite, Horizon Penthouse) with high-resolution photos and room specs.
* **5-Minute Temporary Room Hold:** When a guest begins checkout, the room is temporarily held in MongoDB for 5 minutes to prevent double-booking. If checkout is canceled or times out, the room is automatically released.
* **Server-Side Pricing & Tax:** Room rates, nights, 13% Sindh Sales Tax, 30% online advance deposit, and 70% balance due at front desk are calculated securely on the server to prevent tampering.
* **Online Payment (Safepay):** Pay the 30% advance deposit online with automated transaction verification.
* **Guest Portal (`/my-stay`):** Self-service hub with an animated digital room key, room service ordering, live room bill, and review submission.

### 2. Front Desk Operations (`/front-desk`)
* **Arrivals & In-House Desk:** View today's arriving guests, in-house guests, and departures in real time.
* **Check-In & Check-Out:** Assign clean rooms, check guests in, and collect the remaining 70% balance at check-out.
* **Visual Room Rack:** Color-coded grid showing real-time room statuses (*Available*, *Occupied*, *Needs Cleaning*, *In Cleaning*, *Maintenance*).
* **Extra Room Charges:** Add dining or extra service charges directly to any guest's room bill.
* **Daily Shift Closing:** Cashier shift summary tracking collected cash and online deposits.

### 3. Housekeeping Operations (`/housekeeping`)
* **Daily Cleaning Queue:** View rooms that need cleaning after checkout and complete step-by-step cleaning checklists.
* **Guest Service Requests:** Receive incoming requests (extra towels, water bottles, snacks) directly from guests in real time.
* **Maintenance Reporting:** Report broken items, lock rooms from booking until fixed, and log repairs.
* **Supplies & Linen Inventory:** Track stock counts for everyday room supplies with quick restock buttons.

### 4. Manager & Admin Dashboard (`/admin`)
* **Hotel Statistics:** Live occupancy rate %, Average Daily Rate (ADR), RevPAR, and total revenue.
* **Staff Management:** Create and manage staff accounts with specific roles (*Front Desk*, *Housekeeping*, *Admin*).
* **Room Price Editor:** Update nightly room rates directly in MongoDB Atlas.
* **Activity Log:** Searchable history of staff operations, rate adjustments, and check-ins with one-click CSV export.

### 5. Automated PDF Invoices
* Downloadable official PDF invoices and payment receipts generated on the fly via `GET /api/bookings/:reference/invoice`.

---

## 👥 User Roles & Access

Access is secured on the backend using JWT tokens:

| Role | Access Route | What They Can Do |
| :--- | :--- | :--- |
| **Guest** | `/my-stay` | Search suites, book rooms, pay 30% deposit, unlock digital key, order room service. |
| **Front Desk** | `/front-desk` | View arrivals, check-in/out guests, add room charges, monitor room rack, close shifts. |
| **Housekeeping** | `/housekeeping` | Complete cleaning checklists, report maintenance, deliver guest requests, restock linen. |
| **Admin** | `/admin` | View revenue analytics, update room rates, manage staff accounts, inspect activity logs. |

---

## 🛠 Technology Stack

| Layer | Tools |
| :--- | :--- |
| **Frontend** | React 19, Vite 8, Tailwind CSS v4, React Router v7, Lucide Icons |
| **Backend** | Node.js, Express.js, JWT Authentication, bcryptjs, PDFKit |
| **Database** | MongoDB Atlas with Mongoose ODM |
| **Payments** | Safepay Sandbox (Online 30% Advance Deposit) |
| **Real-Time** | Socket.IO (instant sync between Housekeeping and Front Desk) |
| **Hosting** | Firebase Hosting (Frontend) &middot; Vercel (Backend API) |

---

## 📁 Project Structure

```
Hotel-Management/
├── client/                     # Frontend React application
│   ├── src/
│   │   ├── components/         # UI, Admin, Front Desk, and Housekeeping components
│   │   ├── context/            # AuthContext (login) & HotelDataContext (rooms & tasks)
│   │   ├── pages/              # LandingPage, BookingPage, FrontDeskPage, etc.
│   │   └── services/           # api.js (backend API connection)
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                     # Backend Express API
│   ├── src/
│   │   ├── config/             # MongoDB Atlas connection (db.js)
│   │   ├── controllers/        # Booking, auth, room, staff, and payment logic
│   │   ├── middleware/         # auth.js (JWT verify) & rbac.js (role guards)
│   │   ├── models/             # Mongoose schemas (User, Room, Booking, Payment, etc.)
│   │   ├── routes/             # API routes (/api/auth, /api/rooms, /api/bookings, etc.)
│   │   ├── services/           # availabilityService, pricingService, invoiceService
│   │   └── utils/              # Database seed script (seedData.js)
│   ├── server.js               # Express entry point & Socket.IO server
│   └── package.json
└── docs/                       # Project documentation & guides
```

---

## 💻 Local Setup & Installation

### 1. Clone Repository
```bash
git clone https://github.com/ahmed-husssain/HotelMS.git
cd HotelMS
```

### 2. Backend Setup
```bash
cd server
npm install

# Create environment file
copy .env.example .env
```

Ensure `server/.env` contains your settings:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_jwt_key
CLIENT_URL=http://localhost:5173
SAFEPAY_API_KEY=your_safepay_key
SAFEPAY_SECRET_KEY=your_safepay_secret
```

Seed initial rooms, staff accounts, and test data:
```bash
npm run seed
```

Start backend:
```bash
npm run dev
# Server runs on http://localhost:5000
```

### 3. Frontend Setup
In another terminal:
```bash
cd client
npm install
npm run dev
# App opens on http://localhost:5173
```

---

## 🔑 Pre-Configured Test Accounts

Run `npm run seed` in `server/` to load these accounts:

| Role | Email | Password | Access Page |
| :--- | :--- | :--- | :--- |
| **Admin (Manager)** | `admin@stayza.com` | `Password123!` | `/admin` |
| **Front Desk** | `reception@stayza.com` | `Password123!` | `/front-desk` |
| **Housekeeping** | `cleaning@stayza.com` | `Password123!` | `/housekeeping` |
| **Guest** | `guest@stayza.com` | `Password123!` | `/my-stay` |

*(You can also register a fresh guest account anytime at `/register`)*
