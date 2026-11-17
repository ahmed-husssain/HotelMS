# Habitas Sanctuary & LuxuryStay — Frontend Architecture & Client Monograph

> **Aptech MERN eProject — Enterprise Hotel Management System (HMS)**  
> **Client Framework:** React 19 &middot; Vite 8 &middot; Tailwind CSS v4 &middot; React Router v7 &middot; Oxlint &middot; Lucide Icons  
> **Aesthetic Standard:** Minimalist Architectural Luxury (Inspired by Aman, Habitas, & Casa Momo) &middot; `#FAF8F5`, `#0E1201`, `#D4AF37`

---

## 1. Executive Summary

This client repository represents the complete frontend interface for **Habitas Sanctuary / LuxuryStay**, an enterprise-grade Hotel Management System designed to simulate end-to-end hospitality operations. 

Every view and interaction adheres to the **9 functional modules** of the Aptech eProject curriculum, providing dedicated role-based workspaces for:
1. **Public Visitors & Guests** &mdash; Architectural exploration, direct 2-column bookings with 5-minute atomic holds, and a contactless self-service portal.
2. **Front Desk Receptionists** &mdash; Room rack status matrix, expected arrivals queue, RFID/NFC keycard calibration, incidental folio billing, Sindh GST invoices, and cashier shift handover (Z-Report).
3. **Housekeeping & Facilities** &mdash; 4-point room cleaning queue, live guest service delivery, and maintenance ticket logging with suite locking.
4. **Executive General Manager** &mdash; Predictive demand forecasting, revenue analytics, staff RBAC management, dynamic room tariffs, and immutable audit logging with CSV export.

---

## 2. Core Architecture & Design Philosophy

### A. Zero-Toggle Automatic Role Detection (`/login`)
Public login is implemented as a clean, single form (Email + Password). It completely eliminates cumbersome role selector toggle buttons by evaluating the authenticated account client/server-side and automatically routing stakeholders to their designated workspaces:
* **Guests** &rarr; `/my-stay` (Private Stay Dossier & Digital NFC/QR Key)
* **Receptionists** &rarr; `/pms` (Front Desk PMS Terminal)
* **Housekeepers** &rarr; `/housekeeping` (Turnover Queue & Work Orders)
* **General Manager / Admin** &rarr; `/admin` (Executive Console)

### B. Client-Side Role-Based Route Guards (`ProtectedRoute.jsx`)
Guards enforce strict client-side privilege boundaries matching the project's security specification:
* Public visitors and guests attempting to access `/pms`, `/housekeeping`, or `/admin` are blocked and redirected to `/login`.
* Receptionists are blocked from accessing General Manager executive tools (`/admin`).
* Housekeepers cannot view guest billing folios or financial data.
* Access violations render an editorial "Access Restricted" screen with 1-click returns to authorized workspaces.

### C. Unified State Synchronization (`HotelDataContext.jsx`)
All terminals share a synchronized state engine persisted in `localStorage`. Changes in one terminal instantly reflect across the others:
* **Check-Outs on PMS** &rarr; Room turns `DIRTY` in Housekeeping turnover queue.
* **Inspections on Housekeeping** &rarr; Room turns `AVAILABLE` on PMS.
* **Bookings on `/reserve`** &rarr; Instantly appears in Expected Arrivals on PMS.
* **In-Stay Orders on `/my-stay`** &rarr; Dispatches live to Housekeeping and posts to the active guest folio.
* **Rate Adjustments on `/admin`** &rarr; Updates live pricing on `/suites` and `/reserve`.

---

## 3. Route & Terminal Directory

| Route | View Component | Access Role | Description |
| :--- | :--- | :--- | :--- |
| `/` | `LandingPage.jsx` | Public | Architectural monograph, hero parallax, and experience overview. |
| `/suites`, `/residences` | `RoomsPage.jsx` | Public | Ocean suites directory with hairline filters (Category, Guests, Amenities, Sort). |
| `/reserve` | `BookingPage.jsx` | Public / Guest | 2-column reservation monograph with 5-minute atomic inventory hold. |
| `/confirmation` | `ConfirmationPage.jsx` | Public / Guest | Safepay 30% advance receipt, confirmation voucher, and printable folio. |
| `/my-stay` | `GuestPortalPage.jsx` | Guest / Public | Contactless QR key, in-stay room service orders, live bill, and 5-star review form. |
| `/login` | `LoginPage.jsx` | Public | Single clean form with automatic role detection and 1-click demo test chips. |
| `/register` | `RegisterPage.jsx` | Public | Self-registration strictly provisioning `role: 'guest'`. |
| `/pms` | `FrontDeskPage.jsx` | Receptionist, Admin | Physical room rack, expected arrivals, check-in, incidental billing, and Z-report. |
| `/housekeeping` | `HousekeepingPage.jsx` | Housekeeping, Admin | 4-point turnover checklist, live guest requests feed, and maintenance work orders. |
| `/admin` | `AdminPage.jsx` | Admin (GM) | Executive analytics, staff RBAC governance, dynamic tariffs, and CSV audit export. |

---

## 4. Modular Component Structure

The frontend is structured into clean, single-responsibility components (~80–180 lines each):

```
client/src/
├── components/
│   ├── admin/                    # General Manager Executive Controls
│   │   ├── ActivityLog.jsx       # Activity audit trail with CSV export
│   │   ├── AnalyticsReport.jsx   # KPI cards, revenue bars & demand forecast
│   │   ├── GuestList.jsx         # Registered guest profiles directory
│   │   ├── HotelSettings.jsx     # Sindh tax, advance split & check-in hours
│   │   ├── RoomPricing.jsx       # In-place base night tariff editor
│   │   └── StaffList.jsx         # Staff RBAC accounts & activation toggles
│   ├── booking/                  # Reservation Monograph Sub-Components
│   │   ├── BookingSummary.jsx    # 5-minute hold timer & financial breakdown
│   │   ├── ExtraServices.jsx     # Helipad, hot tub, and chef dining add-ons
│   │   ├── GuestInfoForm.jsx     # Legal name, CNIC/passport & contact details
│   │   └── StayDatesForm.jsx     # Stay duration & guest occupancy pill selectors
│   ├── housekeeping/             # Turnover & Maintenance Terminal Sub-Components
│   │   ├── CleaningQueue.jsx     # 4-step checklist with progress percentage
│   │   ├── GuestRequests.jsx     # Live guest requests feed (Doc FR-57)
│   │   ├── MaintenanceList.jsx   # Open work orders with urgency badges
│   │   └── NewTicketModal.jsx    # Maintenance reporting modal with room locking
│   ├── navigation/               # Layout & Header Drawers
│   │   └── NavMenu.jsx           # Circular aperture slide-down navigation menu
│   ├── pms/                      # Front Desk Receptionist PMS Sub-Components
│   │   ├── AddChargeModal.jsx    # Incidental folio charge posting
│   │   ├── ArrivalsList.jsx      # Expected arrivals with 30% deposit verification
│   │   ├── CheckInModal.jsx      # RFID keycard & NFC mobile pass issuance
│   │   ├── CheckoutInvoiceModal.jsx # Formal printable Sindh sales tax receipt
│   │   ├── RoomRack.jsx          # Color-coded physical room status matrix
│   │   └── ShiftClosingModal.jsx # Cashier Z-report & drawer discrepancy check
│   ├── stay/                     # Guest Self-Service Portal Sub-Components
│   │   ├── BookingLookup.jsx     # Reference code & email lookup gateway
│   │   ├── DigitalKey.jsx        # High-contrast contactless QR pass & valet routing
│   │   ├── ReviewForm.jsx        # 5-star interactive rating & stay highlight tags
│   │   ├── RoomServiceMenu.jsx   # In-stay dining & housekeeping ordering catalog
│   │   └── StayBill.jsx          # Transparent split folio (30% advance vs 70% balance)
│   ├── AnimatedButton.jsx        # Kinetic button with GPU text reveal
│   ├── BrandLogo.jsx             # Symmetrical wordmark & architectural emblem
│   ├── CustomCursor.jsx          # Magnetic 120 FPS cursor follower (desktop-only)
│   ├── Footer.jsx                # Editorial footer with discreet staff terminal link
│   ├── HeroSection.jsx           # Full-screen architectural photography hero
│   ├── Navbar.jsx                # Symmetrical split top bar with dynamic session badge
│   ├── ProtectedRoute.jsx        # Client-side RBAC navigation guard
│   ├── RoomsCarousel.jsx         # Touch/mouse momentum suite carousel
│   └── SplashScreen.jsx          # Initial architectural brand intro
├── context/
│   ├── AuthContext.jsx           # User session, login auto-detect & staff registry
│   └── HotelDataContext.jsx      # Unified live rooms, arrivals, requests & audit store
├── data/
│   └── residences.js             # Residential architectural catalog & metadata
├── pages/
│   ├── AdminPage.jsx             # General Manager Executive Console
│   ├── BookingPage.jsx           # 2-Column Minimalist Reservation Monograph
│   ├── ConfirmationPage.jsx      # Booking Voucher & Safepay Receipt
│   ├── FrontDeskPage.jsx         # Front Desk Receptionist PMS Terminal
│   ├── GuestPortalPage.jsx       # Guest Self-Service Dossier & Digital Key Pass
│   ├── HousekeepingPage.jsx      # Housekeeping Turnover & Facilities Queue
│   ├── LandingPage.jsx           # Architectural Overview & Experience
│   ├── LoginPage.jsx             # Unified Zero-Toggle Public Login
│   ├── RegisterPage.jsx          # Guest Self-Registration
│   └── RoomsPage.jsx             # Suites & Residences Catalog
├── App.jsx                       # Master Route Table & Provider Injections
├── index.css                     # Tailwind CSS v4 directives & typography
└── main.jsx                      # Vite Application Entry Point
```

---

## 5. End-to-End Evaluation Workflows

Examiners and evaluators can verify the following complete workflows:

### Workflow 1: Online Booking &rarr; Receptionist Arrival Queue
1. Visit `/suites` and click **"Reserve Suite"** on Suite 201.
2. Complete the form on `/reserve` (notice the 5-minute hold timer and 30% Safepay deposit calculation).
3. Confirm reservation &rarr; view confirmation voucher on `/confirmation`.
4. Sign in as Receptionist (`reception@habitas.com`) &rarr; open `/pms` &rarr; click **Expected Arrivals Queue**.
5. The newly booked guest appears live in the queue ready for 1-click check-in!

### Workflow 2: Reception Check-Out &rarr; Housekeeping Room Turnover
1. On `/pms`, find Suite 301 (Occupied by Dr. Tariq Khan).
2. Click **"Checkout &rarr;"** &rarr; review itemized charges and Sindh GST &rarr; click **"Collect Balance & Check-Out"**.
3. Suite 301 is marked `DIRTY`.
4. Sign in as Housekeeper (`cleaning@habitas.com`) &rarr; open `/housekeeping`.
5. Suite 301 appears in the cleaning queue. Check off Egyptian Linens, Cedar Salts, Minibar, and Supervisor Inspection &rarr; click **"Certify Inspected & Ready &rarr;"**.
6. Switch back to `/pms` &rarr; Suite 301 is instantly green `AVAILABLE` for new guests!

### Workflow 3: In-Stay Service Request &rarr; Housekeeping Delivery & PMS Folio
1. Visit `/my-stay` (or click 1-Click Load Demo).
2. Under Section 2 (In-Stay Guest Services), click **"+ Request Service"** on *"Evening Cedar Spa & Aromatic Bath Setup"* (+PKR 6,000).
3. The guest folio immediately recalculates total valuation and remaining balance.
4. Log into `/housekeeping` &rarr; the request appears live in the **In-Stay Guest Requests** table.
5. Click **"Mark Delivered &rarr;"** &rarr; state synchronizes across the estate!

### Workflow 4: Urgent Maintenance & Suite Locking
1. On `/housekeeping`, switch to the **Maintenance Tickets** tab &rarr; click **"+ Log Work Order"**.
2. Select Suite 302, Category "HVAC / Climate", urgency **`URGENT`**, and submit.
3. Suite 302 is locked into `MAINTENANCE` status.
4. Open `/pms` &rarr; Suite 302 shows `MAINTENANCE`, preventing accidental check-ins until resolved!

### Workflow 5: General Manager Tariffs & Audit Export
1. Sign in as Admin (`admin@habitas.com`) &rarr; open `/admin`.
2. Under **Residences & Tariffs**, edit the nightly rate for Suite 301.
3. Open `/suites` or `/reserve` &rarr; the updated tariff is live across public booking channels.
4. Switch to **Activity Audit Trail** on `/admin` &rarr; every check-in, turnover certification, and setting change is listed in the ledger.
5. Click **"📥 Export CSV"** to download the official operational audit log.

---

## 6. Seed Accounts for Testing

The login page (`/login`) includes 1-click quick-fill buttons for instant evaluation:

| Role | Email | Password | Access Granted |
| :--- | :--- | :--- | :--- |
| **Verified Guest** | `tariq@luxury.pk` | `password123` | Guest Self-Service Portal (`/my-stay`) |
| **Front Desk Receptionist** | `reception@habitas.com` | `password123` | Front Desk PMS Terminal (`/pms`) |
| **Housekeeping Lead** | `cleaning@habitas.com` | `password123` | Turnover Queue & Facilities (`/housekeeping`) |
| **General Manager** | `admin@habitas.com` | `password123` | Executive Admin Console (`/admin`) |

---

## 7. Development & Build Commands

Inside the `client/` directory:

```bash
# Install dependencies
npm install

# Start Vite live development server (http://localhost:5173)
npm run dev

# Run Oxlint high-speed code quality check
npm run lint

# Compile production bundle with automatic code-splitting
npm run build

# Preview production build locally
npm run preview
```

---

## 8. Quality & Performance Verification
* **Linter:** 0 errors across all 52 modules.
* **Production Build:** Compiled cleanly in **3.48 seconds**.
* **Bundle Splitting:** Individual page chunks range from **4 kB to 27 kB**; main bundle under **500 kB**.
* **Zero Layout Shifts:** Full responsiveness verified on 375px (mobile), 768px (tablet), and 1440px (desktop).
