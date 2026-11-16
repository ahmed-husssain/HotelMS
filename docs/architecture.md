# LuxuryStay Hotel Management System — Architecture Specification

---

## 1. High-Level Component Architecture

```mermaid
flowchart TD
    subgraph Clients ["Client Layer (React / Vite / Tailwind)"]
        GuestPortal["Guest Web Portal<br/>(Rooms, Dates, Cart, Safepay Checkout)"]
        FrontDeskPortal["Front Desk Receptionist Portal<br/>(Arrivals, Departures, Folio, Shifts)"]
        HousekeepingPortal["Housekeeping & Maintenance Mobile UI<br/>(Turnover Tasks, Status Toggles, Tickets)"]
        AdminDashboard["Executive Management Dashboard<br/>(Rooms CRUD, Staff, Financial Analytics, Audits)"]
    end

    subgraph Gateway ["Networking & Gateway"]
        ReverseProxy["Reverse Proxy / API Router (Port 5000)"]
        CORS["Strict CORS & Helmet Security"]
        RateLimiter["Rate Limiting & DDOS Filter"]
    end

    subgraph AppServer ["Express.js Application Core"]
        AuthMiddleware["JWT Authentication & RBAC Filter"]
        
        subgraph Subservices ["Specialized Micro-Services"]
            AvailService["Availability & Atomic Lock Service"]
            PricingService["Zero-Trust Pricing Calculator"]
            PayService["Payment & Webhook Processor"]
            FolioService["Folio & Incidentals Engine"]
            ShiftService["Cashier Shift & Z-Report Engine"]
            PDFService["PDFKit Invoice Engine"]
            AuditService["Activity Audit Logger"]
        end

        SocketHub["Socket.IO Real-Time Event Hub"]
    end

    subgraph DataPersistence ["Persistence Layer (MongoDB)"]
        Mongo["MongoDB Database Cluster<br/>(Replica Set with ACID Transactions)"]
    end

    subgraph ThirdParty ["Third-Party External Services"]
        SafepayAPI["Safepay Payment Gateway (Sandbox)"]
        SMTP["Nodemailer SMTP Mailer"]
    end

    Clients --> Gateway
    Gateway --> AppServer
    AuthMiddleware --> Subservices
    Subservices --> Mongo
    PayService <-->|Checkout & Webhooks| SafepayAPI
    PDFService --> SMTP
    SocketHub -.->|Instant UI Sync| Clients
```

---

## 2. End-to-End Sequence Diagrams

### 2.1 The 5-Minute Pessimistic Booking & Safepay Payment Flow

```mermaid
sequenceDiagram
    autonumber
    actor Guest as Guest (Web)
    participant API as Express API
    participant DB as MongoDB
    participant SP as Safepay Gateway
    actor Desk as Front Desk Staff

    Guest->>API: POST /api/bookings (Selects dates & room)
    activate API
    API->>DB: Atomic Pessimistic Lock (5-Minute Hold, AWAITING_PAYMENT)
    DB-->>API: Lock acquired (Booking Ref: LS-2026-901)
    API->>SP: Initialize Checkout Session (30% Advance amount)
    SP-->>API: Return Checkout URL & Tracker Token
    API-->>Guest: 201 Created (Checkout URL + Timer: 300 seconds)
    deactivate API

    Guest->>SP: Completes 30% payment on hosted gateway
    SP->>API: POST /api/payments/webhook (HMAC Signature Header)
    activate API
    API->>API: Verify HMAC Signature with Secret
    API->>DB: Idempotency Check (Has reference been processed?)
    API->>DB: Insert Payment Record (SUCCEEDED)
    API->>DB: Update Booking (Status: CONFIRMED, remove hold timer)
    API->>API: Generate PDF Advance Receipt
    API-->>Desk: Socket.IO: 'booking:confirmed' (Alert front desk)
    API-->>SP: 200 OK (Acknowledge webhook)
    deactivate API
```

---

### 2.2 Check-in, Incidental Folio & Checkout Flow

```mermaid
sequenceDiagram
    autonumber
    actor Guest as Arriving Guest
    actor Desk as Receptionist (Front Desk)
    participant API as Express API
    participant DB as MongoDB
    actor HK as Housekeeping Team

    Guest->>Desk: Arrives at hotel for check-in
    Desk->>API: POST /api/staff/check-in/:bookingId
    API->>DB: Update Booking -> CHECKED_IN, Room -> OCCUPIED
    API->>Desk: Check-in verified. Issue Keycard.

    Note over Guest,Desk: During 3-day stay, Guest orders Room Service & Laundry
    Desk->>API: POST /api/folio/:bookingId/add (Room Service: PKR 3,500)
    API->>DB: Insert FolioItem linked to Booking

    Note over Guest,Desk: On Departure Day (Check-out)
    Guest->>Desk: Requests Check-out
    Desk->>API: GET /api/staff/folio-summary/:bookingId
    API-->>Desk: Balance: 70% Room Rate (PKR 24,500) + Extras (PKR 3,500) = PKR 28,000
    Guest->>Desk: Pays PKR 28,000 (Cash / POS Card)
    Desk->>API: POST /api/staff/check-out/:bookingId (Record payment & settle folio)
    API->>DB: Insert Payment Record (BALANCE_70 + EXTRAS)
    API->>DB: Update Booking -> CHECKED_OUT, Room -> DIRTY
    API->>API: Generate Final Tax Invoice PDF
    API-->>HK: Socket.IO: 'room:dirty' (Room 301 needs cleaning)
    API-->>Desk: Check-out Complete. Printable PDF Invoice ready.
```

---

## 3. Operational State Machines

### 3.1 Room Operational Lifecycle
```mermaid
stateDiagram-v2
    [*] --> AVAILABLE
    AVAILABLE --> AWAITING_PAYMENT : 5-Minute Hold Placed
    AWAITING_PAYMENT --> AVAILABLE : Hold Expired or Cancelled
    AWAITING_PAYMENT --> AVAILABLE : Payment Confirmed (Future Date)
    AVAILABLE --> OCCUPIED : Guest Check-in
    OCCUPIED --> DIRTY : Guest Check-out
    DIRTY --> CLEANING : Housekeeper starts cleaning
    CLEANING --> AVAILABLE : Housekeeper marks clean / inspected
    AVAILABLE --> MAINTENANCE : Maintenance ticket logged
    MAINTENANCE --> DIRTY : Repair resolved, requires cleaning
```

### 3.2 Booking Lifecycle
```mermaid
stateDiagram-v2
    [*] --> AWAITING_PAYMENT : Booking initiated
    AWAITING_PAYMENT --> EXPIRED : 5 minutes elapsed without payment
    AWAITING_PAYMENT --> CANCELLED : Guest clicks cancel / aborts
    AWAITING_PAYMENT --> CONFIRMED : 30% Safepay payment verified
    CONFIRMED --> CHECKED_IN : Front desk records arrival
    CONFIRMED --> CANCELLED : Cancelled under hotel policy
    CHECKED_IN --> CHECKED_OUT : 70% balance + folio settled at desk
```

---

## 4. Front Desk Cashier Shift Closing (Z-Report Data Flow)

```mermaid
flowchart LR
    Open["Receptionist logs in & opens shift<br/>Opening Float: PKR 10,000"]
    Tx["Shift Transactions:<br/>+ Booking 1 Cash: PKR 15,000<br/>+ Booking 2 Card: PKR 25,000<br/>+ Folio Cash: PKR 3,000"]
    Close["Shift Closing Trigger<br/>System aggregates transactions:"]
    ZReport["Z-Report Summary:<br/>Expected Cash: PKR 28,000<br/>Expected Card: PKR 25,000<br/>Cashier Enters Actual Count<br/>Discrepancy logged & Shift Locked"]

    Open --> Tx
    Tx --> Close
    Close --> ZReport
```

