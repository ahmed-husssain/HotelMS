# Stayza — Client Application

> **Frontend application for the Stayza Hotel Management System.**  
> Built with React 19, Vite 8, Tailwind CSS v4, and React Router v7. Provides a clean, responsive guest reservation experience and staff management dashboards.

[![React 19](https://img.shields.io/badge/React-19-0F172A?style=for-the-badge&logo=react)](https://react.dev)
[![Vite 8](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-38BDF8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)

---

## 🧭 Page Routes & Features

### Guest Experience
* **`/` (Home):** Hero banner, featured luxury suites, resort grounds tour, and room feature details.
* **`/suites` (All Suites):** Filter suites by category (*Oceanfront Villa*, *Beach Suite*, *Horizon Penthouse*).
* **`/book` (Booking):** Date search, live price summary with 13% tax, 5-minute room hold timer, and Safepay online payment launcher.
* **`/verify-payment`:** Verifies the Safepay transaction and confirms the booking.
* **`/confirmation`:** Booking confirmation voucher with copyable confirmation code and invoice download link.
* **`/my-stay` (Guest Portal):** Self-service hub for in-house guests:
  * Digital room key with PIN.
  * In-room service orders (dining, extra towels, experiences).
  * Real-time room folio bill.
  * Review and feedback form.

### Staff & Operations Portals
* **`/login` & `/register`:** Clean authentication form that automatically directs users to their assigned workspace based on their role.
* **`/front-desk`:** Reception console with today's arrivals, guest check-in/out, extra room charges, a color-coded room rack, and cashier shift closing.
* **`/housekeeping`:** Cleaning queue with step-by-step checklists, incoming guest requests, maintenance issue reports, and linen stock levels.
* **`/admin`:** General manager dashboard with occupancy %, daily rates, staff accounts, room price editor, and activity audit logs with CSV export.

---

## 🏗 Frontend Architecture

* **`AuthContext.jsx`:** Stores the active JWT login token, user profile, and handles automatic login on page refresh.
* **`HotelDataContext.jsx`:** Manages rooms, bookings, cleaning tasks, and guest service requests in real time.
* **`api.js`:** Connects to the Express backend and automatically attaches the user's login token to requests.
* **Server-Validated Pricing:** Room rates, nights, taxes, and advance splits are always verified with the server to prevent browser tampering.

---

## 🛠 Local Setup

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Configure Environment
Create a `.env` file inside `client/`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Run Development Server
```bash
npm run dev
# Opens at http://localhost:5173
```

### 4. Build for Production
```bash
npm run build
# Creates optimized files in client/dist/
```
