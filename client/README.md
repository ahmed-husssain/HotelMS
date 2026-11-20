# Stayza Resorts & Suites — Client Application

> **Frontend Client for Stayza Hotel Management System**  
> Built with React 19, Vite 8, Tailwind CSS v4, React Router v7, and Socket.IO Client. Delivers an executive-grade luxury aesthetic with responsive layouts, accessible touch targets, and zero-trust backend integration.

[![React 19](https://img.shields.io/badge/React-19-0F172A?style=for-the-badge&logo=react)](https://react.dev)
[![Vite 8](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-38BDF8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)

---

## 📑 Page Routes & Portal Directory

The client application automatically routes users based on their role and authentication status:

### Public & Guest Pages
* **`/` (Landing Page):** Full-screen hero section, luxury suite showcase, interactive specifications drawer, and resort grounds monograph.
* **`/suites` (Suites Catalog):** Curated 7-suite catalog organized into collections (*Oceanfront Villa*, *Beach Suite*, *Horizon Penthouse*).
* **`/book` (Booking Engine):** Interactive date picker, live nightly price calculator, 13% Sindh tax computation, 5-minute pessimistic hold timer, and Safepay checkout launcher.
* **`/verify-payment`:** Instant payment confirmation screen polling the Safepay checkout session.
* **`/confirmation`:** Booking confirmation voucher with copyable confirmation code, guest details, and invoice download link.
* **`/my-stay` (Guest Portal):** Self-service guest hub featuring:
  * Interactive digital room key with animated PIN code.
  * In-stay room service catalog with instant ordering.
  * Live room folio bill with real-time charge breakdown.
  * 5-star review and feedback modal.

### Operations & Staff Portals
* **`/login` & `/register`:** Unified authentication portal with automatic role detection and clean password visibility controls.
* **`/front-desk` (PMS Desk):** Receptionist console featuring the Today's Arrivals queue, check-in modal, extra service charge poster, 7-suite Room Rack with live status updates, and shift closing summary.
* **`/housekeeping` (Housekeeping Hub):** Daily cleaning queue with 4-step room certification, live guest requests feed, maintenance issue logger with room lock, and linen/supplies stock tracker.
* **`/admin` (General Manager Suite):** Executive telemetry dashboard showing live occupancy %, Average Daily Rate (ADR), RevPAR, gross revenue, staff RBAC manager, room rate editor, and activity audit logs with CSV export.

---

## 🏗 State Management & Architecture

* **`AuthContext.jsx`:** Manages JWT session tokens, active user profiles, role enforcement, and auto-login on refresh.
* **`HotelDataContext.jsx`:** Real-time data store managing rooms inventory, bookings, active cleaning tasks, maintenance tickets, and incoming service requests.
* **`api.js`:** Clean HTTP service handling communication with the Express backend, automatically injecting Bearer tokens into request headers.
* **Zero-Trust Pricing:** Nightly rates and taxes are calculated exclusively on the backend. The frontend only displays verified server quotes.

---

## 🛠 Local Development & Scripts

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `client/` folder:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```
*(For production, these point to your deployed backend API on Vercel).*

### 3. Start Development Server
```bash
npm run dev
# Vite runs locally on http://localhost:5173
```

### 4. Build for Production
```bash
npm run build
# Compiles optimized static assets into client/dist/
```

### 5. Preview Production Build
```bash
npm run preview
```

---

## 🎨 UI/UX Design Standards

* **Typography Hierarchy:** `Syne` for grand headlines, `Inter` for clean interface copy, and `Space Grotesk` for pricing numerals.
* **Accessibility & Touch Targets:** All buttons maintain a minimum 40–44px touch area. Text sizes strictly follow readable body sizes (`11px` to `16px`) with high-contrast text.
* **Mobile-First Layout:** Responsive flex and grid structures with zero horizontal scrolling (`overflow-x: hidden`).
