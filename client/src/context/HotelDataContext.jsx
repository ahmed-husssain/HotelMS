import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  fetchStaffDashboard,
  checkInStaffGuest,
  checkOutStaffGuest,
  postFolioCharge,
} from '../services/api'

/**
 * HABITAS SANCTUARY & LUXURYSTAY — HOTEL DATA & WORKFLOW CONTEXT
 * 
 * Fulfills Aptech Modules 1 through 9:
 * - Module 2: Room Inventory & Real-Time Status Synchronization
 * - Module 3: Reservation, Arrivals Queue & Check-In/Check-Out
 * - Module 4: Billing, Folios, Incidental Posting & 13% Sindh Tax
 * - Module 5: Housekeeping Turnovers & Maintenance Ticket Locking
 * - Module 6: Executive Analytics Data Feed
 * - Module 8: In-Stay Guest Services & Feedback Tracking
 * - Module 9: System Settings & Central Audit Trail
 * 
 * Single source of truth across Front Desk PMS, Housekeeping, GM Admin, and Guest Portal.
 */

// Initial Seed Rooms (Aligned across all terminals)
const INITIAL_ROOMS = [
  {
    roomNumber: 'Suite 301',
    name: 'The Horizon Penthouse',
    tier: 'PRESIDENTIAL SUITE',
    category: 'penthouse',
    nightlyRate: 110000,
    status: 'OCCUPIED',
    guest: 'Dr. Tariq Khan',
    phone: '+92 300 8921455',
    checkIn: '15 Nov 2026',
    checkOut: '18 Nov 2026',
    nights: 3,
    advancePaid: 111870,
    balanceDue: 261030,
    folioNumber: 'FOL-301-89',
    assignedCleaner: 'Bilal Farooq',
    cleaningTasks: { linen: true, bathSalts: true, minibar: false, inspection: false },
    priority: 'HIGH',
    checkoutTime: '11:00 AM',
    nextArrival: '02:00 PM (Dr. Tariq Khan)',
    incidentals: [
      { id: 'inc-1', item: 'Coastal Helipad Transfer', amount: 25000, time: '15 Nov, 14:30' },
      { id: 'inc-2', item: 'Sommelier Wine Reserve', amount: 35000, time: '16 Nov, 20:15' },
    ],
  },
  {
    roomNumber: 'Suite 302',
    name: 'The Courtyard Villa',
    tier: 'PRIVATE COURTYARD VILLA',
    category: 'villa',
    nightlyRate: 75000,
    status: 'DIRTY',
    guest: null,
    phone: null,
    checkIn: null,
    checkOut: null,
    nights: 0,
    advancePaid: 0,
    balanceDue: 0,
    folioNumber: null,
    assignedCleaner: 'Zubair Shah',
    cleaningTasks: { linen: false, bathSalts: false, minibar: false, inspection: false },
    priority: 'URGENT',
    checkoutTime: '11:30 AM',
    nextArrival: '01:30 PM (Ambassador Malik)',
    incidentals: [],
  },
  {
    roomNumber: 'Suite 303',
    name: 'The Overwater Pavilion',
    tier: 'ROYAL OCEAN PAVILION',
    category: 'overwater',
    nightlyRate: 95000,
    status: 'AVAILABLE',
    guest: null,
    phone: null,
    checkIn: null,
    checkOut: null,
    nights: 0,
    advancePaid: 0,
    balanceDue: 0,
    folioNumber: null,
    assignedCleaner: 'Bilal Farooq',
    cleaningTasks: { linen: true, bathSalts: true, minibar: true, inspection: true },
    priority: 'NORMAL',
    checkoutTime: 'Yesterday',
    nextArrival: 'Tomorrow',
    incidentals: [],
  },
  {
    roomNumber: 'Suite 201',
    name: 'The Dune Sanctuary',
    tier: 'GARDEN & LAGOON RESIDENCE',
    category: 'sanctuary',
    nightlyRate: 65000,
    status: 'AVAILABLE',
    guest: null,
    phone: null,
    checkIn: null,
    checkOut: null,
    nights: 0,
    advancePaid: 0,
    balanceDue: 0,
    folioNumber: null,
    assignedCleaner: 'Khurram Ali',
    cleaningTasks: { linen: true, bathSalts: true, minibar: true, inspection: true },
    priority: 'NORMAL',
    checkoutTime: '2 Days Ago',
    nextArrival: 'Open',
    incidentals: [],
  },
]

// Initial Expected Arrivals (PMS Queue)
const INITIAL_ARRIVALS = [
  {
    id: 'ARR-901',
    guest: 'Ambassador Malik',
    phone: '+92 321 9988776',
    roomNumber: 'Suite 302',
    tier: 'PRIVATE COURTYARD VILLA',
    eta: '13:30 PKT',
    safepayRef: 'SPF-781923',
    status: 'Deposit Confirmed (30%)',
    advancePaid: 76275,
    totalValuation: 254250,
    nights: 3,
  },
  {
    id: 'ARR-902',
    guest: 'Amina & Haris Vohra',
    phone: '+92 301 5544332',
    roomNumber: 'Suite 303',
    tier: 'ROYAL OCEAN PAVILION',
    eta: '16:00 PKT',
    safepayRef: 'SPF-892110',
    status: 'Deposit Confirmed (30%)',
    advancePaid: 96615,
    totalValuation: 322050,
    nights: 3,
  },
]

// Initial Guest In-Stay Service Requests (Doc FR-57)
const INITIAL_GUEST_REQUESTS = [
  {
    id: 'REQ-501',
    roomNumber: 'Suite 301',
    guestName: 'Dr. Tariq Khan',
    request: 'Fresh Egyptian Cotton Linens & Extra Hypoallergenic Pillows',
    category: 'Housekeeping',
    price: 0,
    requestedAt: '12:30 PM',
    status: 'PENDING',
  },
  {
    id: 'REQ-502',
    roomNumber: 'Suite 301',
    guestName: 'Dr. Tariq Khan',
    request: 'Cedar Hot Tub Salt Replenishment & Essential Oil',
    category: 'Spa',
    price: 6000,
    requestedAt: '01:10 PM',
    status: 'DELIVERED',
  },
]

// Initial Maintenance Work Orders (Doc FR-49)
const INITIAL_MAINTENANCE_TICKETS = [
  {
    id: 'TKT-108',
    roomNumber: 'Suite 301',
    category: 'HVAC / Climate',
    issue: 'Infinity plunge pool temperature regulator reading 2°C below calibrated preset.',
    urgency: 'HIGH',
    status: 'IN_PROGRESS',
    reportedAt: 'Today, 09:15 AM',
    assignedTo: 'Chief Engineer Rashid',
  },
  {
    id: 'TKT-109',
    roomNumber: 'Suite 302',
    category: 'Plumbing',
    issue: 'Basalt outdoor rain shower handle slight drip after shutoff.',
    urgency: 'MEDIUM',
    status: 'OPEN',
    reportedAt: 'Today, 10:40 AM',
    assignedTo: 'Plumbing Lead Tariq',
  },
]

// Central Audit Logs
const INITIAL_AUDIT_LOGS = [
  {
    id: 'LOG-701',
    timestamp: '14:22 PKT',
    actor: 'Sara Ahmed (Front Desk)',
    action: 'CHECKIN_COMPLETED',
    category: 'PMS',
    details: 'Checked in Dr. Tariq Khan to Suite 301. Calibrated RFID Keycard #KF-8921.',
  },
  {
    id: 'LOG-702',
    timestamp: '13:05 PKT',
    actor: 'Bilal Farooq (Housekeeping)',
    action: 'ROOM_CLEANING_CERTIFIED',
    category: 'HOUSEKEEPING',
    details: 'Completed 4-point turnover on Suite 303. Certified room AVAILABLE.',
  },
  {
    id: 'LOG-703',
    timestamp: '11:15 PKT',
    actor: 'Karim Mansoor (General Manager)',
    action: 'RATE_ADJUSTMENT',
    category: 'SETTINGS',
    details: 'Adjusted Suite 301 base tariff to PKR 110,000 for upcoming weekend demand surge.',
  },
]

const HotelDataContext = createContext(null)

export function HotelDataProvider({ children }) {
  // 1. Rooms Inventory
  const [rooms, setRooms] = useState(() => {
    try {
      const saved = localStorage.getItem('stayza_hotel_rooms') || localStorage.getItem('habitas_hotel_rooms')
      return saved ? JSON.parse(saved) : INITIAL_ROOMS
    } catch {
      return INITIAL_ROOMS
    }
  })

  // 2. Expected Arrivals
  const [arrivals, setArrivals] = useState(() => {
    try {
      const saved = localStorage.getItem('stayza_hotel_arrivals') || localStorage.getItem('habitas_hotel_arrivals')
      return saved ? JSON.parse(saved) : INITIAL_ARRIVALS
    } catch {
      return INITIAL_ARRIVALS
    }
  })

  // 3. Guest Service Requests
  const [guestRequests, setGuestRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('stayza_hotel_requests') || localStorage.getItem('habitas_hotel_requests')
      return saved ? JSON.parse(saved) : INITIAL_GUEST_REQUESTS
    } catch {
      return INITIAL_GUEST_REQUESTS
    }
  })

  // 4. Maintenance Work Orders
  const [maintenanceTickets, setMaintenanceTickets] = useState(() => {
    try {
      const saved = localStorage.getItem('stayza_hotel_tickets') || localStorage.getItem('habitas_hotel_tickets')
      return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE_TICKETS
    } catch {
      return INITIAL_MAINTENANCE_TICKETS
    }
  })

  // 5. System Settings
  const [systemSettings, setHotelSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('stayza_hotel_settings') || localStorage.getItem('habitas_hotel_settings')
      return saved ? JSON.parse(saved) : {
        taxRate: 13,
        depositRate: 30,
        currency: 'PKR',
        checkInTime: '14:00',
        checkOutTime: '11:00',
        policyNotes: 'Full refund up to 7 days prior to check-in. 30% advance deposit non-refundable within 48 hours.',
      }
    } catch {
      return {
        taxRate: 13,
        depositRate: 30,
        currency: 'PKR',
        checkInTime: '14:00',
        checkOutTime: '11:00',
        policyNotes: 'Full refund up to 7 days prior to check-in. 30% advance deposit non-refundable within 48 hours.',
      }
    }
  })

  // 6. Audit Trail
  const [auditLogs, setAuditLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('stayza_hotel_audit') || localStorage.getItem('habitas_hotel_audit')
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS
    } catch {
      return INITIAL_AUDIT_LOGS
    }
  })

  // Synchronize state changes to localStorage
  useEffect(() => {
    localStorage.setItem('stayza_hotel_rooms', JSON.stringify(rooms))
  }, [rooms])

  // Live MongoDB Atlas Sync on Mount
  useEffect(() => {
    let isMounted = true
    async function loadLiveDashboard() {
      try {
        const res = await fetchStaffDashboard()
        if (isMounted && res.success && res.data) {
          if (res.data.rooms && res.data.rooms.length > 0) {
            setRooms(res.data.rooms)
          }
          if (res.data.arrivals && res.data.arrivals.length > 0) {
            setArrivals(res.data.arrivals)
          }
        }
      } catch (err) {
        console.warn('[HotelDataContext] Fallback to cached hotel state:', err.message)
      }
    }
    loadLiveDashboard()
    return () => { isMounted = false }
  }, [])

  useEffect(() => {
    localStorage.setItem('stayza_hotel_arrivals', JSON.stringify(arrivals))
  }, [arrivals])

  useEffect(() => {
    localStorage.setItem('stayza_hotel_requests', JSON.stringify(guestRequests))
  }, [guestRequests])

  useEffect(() => {
    localStorage.setItem('stayza_hotel_tickets', JSON.stringify(maintenanceTickets))
  }, [maintenanceTickets])

  useEffect(() => {
    localStorage.setItem('stayza_hotel_settings', JSON.stringify(systemSettings))
  }, [systemSettings])

  useEffect(() => {
    localStorage.setItem('stayza_hotel_audit', JSON.stringify(auditLogs))
  }, [auditLogs])

  // Helper: Append Audit Log
  const addAuditLog = (action, category, details, actor = 'System Operator') => {
    const newLog = {
      id: `LOG-${Math.floor(700 + Math.random() * 300)}`,
      timestamp: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' PKT',
      actor,
      action,
      category,
      details,
    }
    setAuditLogs((prev) => [newLog, ...prev])
  }

  // -------------------------------------------------------------
  // OPERATIONAL WORKFLOW ACTIONS (Modules 1 - 9)
  // -------------------------------------------------------------

  /**
   * Action A: Create Reservation (Invoked on /reserve)
   * Adds booking to Arrivals and updates audit log
   */
  const createReservation = (bookingData) => {
    const newArrival = {
      id: `ARR-${Math.floor(900 + Math.random() * 100)}`,
      guest: bookingData.guestDossier.fullName,
      phone: bookingData.guestDossier.phone,
      roomNumber: `Suite ${bookingData.residence.roomNumber}`,
      tier: bookingData.residence.tier,
      eta: '14:00 PKT',
      safepayRef: bookingData.safepayRef,
      bookingRef: bookingData.bookingRef,
      status: 'Deposit Confirmed (30%)',
      advancePaid: bookingData.advance,
      totalValuation: bookingData.total,
      nights: bookingData.nights,
    }

    setArrivals((prev) => [newArrival, ...prev])
    addAuditLog(
      'ONLINE_RESERVATION_CREATED',
      'RESERVATION',
      `New booking ${bookingData.bookingRef} by ${bookingData.guestDossier.fullName} for Suite ${bookingData.residence.roomNumber}. Advance: PKR ${bookingData.advance.toLocaleString()}.`,
      bookingData.guestDossier.fullName
    )
    return newArrival
  }

  /**
   * Action B: Check-in Guest (Invoked on /pms)
   * Transitions room to OCCUPIED, removes from arrivals queue, syncs with MongoDB Atlas
   */
  const checkInGuest = async (arrivalId, roomNumber, actorName = 'Sara Ahmed (Front Desk)') => {
    const arrival = arrivals.find((a) => a.id === arrivalId || a.bookingRef === arrivalId)
    const bookingRef = arrival?.bookingRef || arrivalId

    setRooms((prev) =>
      prev.map((r) => {
        if (r.roomNumber === roomNumber) {
          return {
            ...r,
            status: 'OCCUPIED',
            guest: arrival?.guest || 'In-House Guest',
            phone: arrival?.phone || '+92 300 0000000',
            checkIn: new Date().toLocaleDateString('en-GB'),
            checkOut: 'In-House',
            nights: arrival?.nights || 1,
            advancePaid: arrival?.advancePaid || 0,
            balanceDue: (arrival?.totalValuation || 0) - (arrival?.advancePaid || 0),
            folioNumber: `FOL-${roomNumber.replace(/\D/g, '')}-${Math.floor(10 + Math.random() * 90)}`,
            bookingRef,
          }
        }
        return r
      })
    )

    setArrivals((prev) => prev.filter((a) => a.id !== arrivalId && a.bookingRef !== arrivalId))
    addAuditLog('CHECKIN_COMPLETED', 'PMS', `Checked in ${arrival?.guest || 'Guest'} into ${roomNumber}.`, actorName)

    try {
      await checkInStaffGuest(bookingRef, {
        roomNumber,
        guestName: arrival?.guest,
        guestPhone: arrival?.phone,
      })
    } catch (err) {
      console.warn('[PMS CheckIn] Remote Atlas sync warning:', err.message)
    }
  }

  /**
   * Action C: Check-out Guest & Release Folio (Invoked on /pms)
   * Transitions room to DIRTY, marks balance settled, triggers Housekeeping Turnover, syncs with MongoDB Atlas
   */
  const checkOutGuest = async (roomNumber, actorName = 'Sara Ahmed (Front Desk)') => {
    const currentRoom = rooms.find((r) => r.roomNumber === roomNumber)
    const guestName = currentRoom?.guest || 'Guest'
    const bookingRef = currentRoom?.bookingRef || `TH-${roomNumber.replace(/\D/g, '')}-9041`

    setRooms((prev) =>
      prev.map((r) => {
        if (r.roomNumber === roomNumber) {
          return {
            ...r,
            status: 'DIRTY',
            guest: null,
            phone: null,
            checkIn: null,
            checkOut: null,
            nights: 0,
            advancePaid: 0,
            balanceDue: 0,
            folioNumber: null,
            cleaningTasks: { linen: false, bathSalts: false, minibar: false, inspection: false },
            priority: 'HIGH',
            checkoutTime: 'Just Now',
            incidentals: [],
          }
        }
        return r
      })
    )

    addAuditLog(
      'CHECKOUT_AND_SETTLEMENT',
      'PMS',
      `Checked out ${guestName} from ${roomNumber}. Folio balance settled. Room flagged DIRTY for housekeeping turnover.`,
      actorName
    )

    try {
      await checkOutStaffGuest(bookingRef, { paymentMethod: 'CASH_AT_DESK' })
    } catch (err) {
      console.warn('[PMS CheckOut] Remote Atlas sync warning:', err.message)
    }
  }

  /**
   * Action D: Add Incidental to Room Folio (Invoked on /pms)
   * Posts extra charge and syncs with MongoDB Atlas
   */
  const addIncidental = async (roomNumber, itemTitle, amount, actorName = 'Front Desk') => {
    const currentRoom = rooms.find((r) => r.roomNumber === roomNumber)
    const bookingRef = currentRoom?.bookingRef || `TH-${roomNumber.replace(/\D/g, '')}-9041`

    setRooms((prev) =>
      prev.map((r) => {
        if (r.roomNumber === roomNumber) {
          const updatedIncidentals = [
            ...(r.incidentals || []),
            {
              id: `inc-${Date.now()}`,
              item: itemTitle,
              amount,
              time: 'Just Now',
            },
          ]
          const tax = Math.round(amount * (systemSettings.taxRate / 100))
          return {
            ...r,
            incidentals: updatedIncidentals,
            balanceDue: r.balanceDue + amount + tax,
          }
        }
        return r
      })
    )

    addAuditLog(
      'INCIDENTAL_POSTED',
      'BILLING',
      `Posted ${itemTitle} (+PKR ${amount.toLocaleString()}) to ${roomNumber} folio.`,
      actorName
    )

    try {
      await postFolioCharge(bookingRef, { item: itemTitle, price: amount })
    } catch (err) {
      console.warn('[PMS Incidental] Remote Atlas sync warning:', err.message)
    }
  }

  /**
   * Action E: Housekeeping Task Checklist Toggle (Invoked on /housekeeping)
   */
  const updateCleaningTask = (roomNumber, taskKey, isComplete) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.roomNumber === roomNumber) {
          const updatedTasks = { ...r.cleaningTasks, [taskKey]: isComplete }
          const allDone = Object.values(updatedTasks).every(Boolean)
          return {
            ...r,
            cleaningTasks: updatedTasks,
            status: allDone ? 'INSPECTED' : 'CLEANING',
          }
        }
        return r
      })
    )
  }

  /**
   * Action F: Certify Room Ready & Available (Invoked on /housekeeping)
   * Advances room to AVAILABLE so Front Desk PMS immediately sees it ready!
   */
  const certifyRoomReady = (roomNumber, cleanerName = 'Bilal Farooq') => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.roomNumber === roomNumber) {
          return {
            ...r,
            status: 'AVAILABLE',
            cleaningTasks: { linen: true, bathSalts: true, minibar: true, inspection: true },
            priority: 'NORMAL',
            checkoutTime: 'Turnover Completed',
          }
        }
        return r
      })
    )

    addAuditLog(
      'ROOM_CLEANING_CERTIFIED',
      'HOUSEKEEPING',
      `${roomNumber} inspected and certified AVAILABLE by ${cleanerName}. Ready for guest arrivals.`,
      cleanerName
    )
  }

  /**
   * Action G: Request In-Stay Guest Service (Invoked on /my-stay)
   * Dispatches request live to Housekeeping feed & appends to Room Folio
   */
  const requestGuestService = (roomNumber, guestName, serviceTitle, price, category = 'Housekeeping') => {
    const newReq = {
      id: `REQ-${Math.floor(500 + Math.random() * 500)}`,
      roomNumber,
      guestName,
      request: serviceTitle,
      category,
      price,
      requestedAt: 'Just Now',
      status: 'PENDING',
    }

    setGuestRequests((prev) => [newReq, ...prev])

    // If price > 0, post to room folio
    if (price > 0) {
      addIncidental(roomNumber, serviceTitle, price, `${guestName} (Guest Portal)`)
    }

    addAuditLog(
      'GUEST_SERVICE_DISPATCHED',
      'GUEST_SERVICES',
      `${guestName} (${roomNumber}) requested: ${serviceTitle}.`,
      guestName
    )
    return newReq
  }

  /**
   * Action H: Mark In-Stay Request Delivered (Invoked on /housekeeping)
   */
  const markServiceDelivered = (requestId, cleanerName = 'Housekeeping Staff') => {
    setGuestRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status: 'DELIVERED' } : req))
    )
    addAuditLog('SERVICE_REQUEST_DELIVERED', 'HOUSEKEEPING', `Request #${requestId} delivered to suite.`, cleanerName)
  }

  /**
   * Action I: Log Maintenance Ticket (Invoked on /housekeeping)
   * If urgency is URGENT, lock room status to MAINTENANCE!
   */
  const createMaintenanceTicket = (ticketData, reporterName = 'Staff Member') => {
    const newTicket = {
      id: `TKT-${Math.floor(100 + Math.random() * 900)}`,
      ...ticketData,
      status: 'OPEN',
      reportedAt: 'Just Now',
    }

    setMaintenanceTickets((prev) => [newTicket, ...prev])

    if (ticketData.urgency === 'URGENT') {
      setRooms((prev) =>
        prev.map((r) => (r.roomNumber === ticketData.roomNumber ? { ...r, status: 'MAINTENANCE' } : r))
      )
    }

    addAuditLog(
      'MAINTENANCE_TICKET_LOGGED',
      'MAINTENANCE',
      `Logged ${ticketData.urgency} ticket for ${ticketData.roomNumber}: ${ticketData.issue}`,
      reporterName
    )
    return newTicket
  }

  /**
   * Action J: Update Base Room Rate (Invoked on /admin)
   */
  const updateRoomRate = (roomNumber, newRate, actorName = 'General Manager') => {
    setRooms((prev) =>
      prev.map((r) => (r.roomNumber === roomNumber ? { ...r, nightlyRate: Number(newRate) } : r))
    )
    addAuditLog(
      'ROOM_RATE_UPDATED',
      'SETTINGS',
      `Updated ${roomNumber} base nightly tariff to PKR ${Number(newRate).toLocaleString()}.`,
      actorName
    )
  }

  /**
   * Action K: Toggle Room Refurbishment Maintenance (Invoked on /admin)
   */
  const toggleRoomMaintenance = (roomNumber, actorName = 'General Manager') => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.roomNumber === roomNumber) {
          const nextStatus = r.status === 'MAINTENANCE' ? 'AVAILABLE' : 'MAINTENANCE'
          return { ...r, status: nextStatus }
        }
        return r
      })
    )
    addAuditLog('MAINTENANCE_TOGGLED', 'SETTINGS', `Toggled maintenance mode on ${roomNumber}.`, actorName)
  }

  /**
   * Action L: Update System Configuration Settings (Invoked on /admin)
   */
  const updateSettings = (newSettings, actorName = 'General Manager') => {
    setHotelSettings(newSettings)
    addAuditLog(
      'SYSTEM_SETTINGS_UPDATE',
      'SETTINGS',
      `Updated tax rate to ${newSettings.taxRate}% and deposit requirement to ${newSettings.depositRate}%.`,
      actorName
    )
  }

  const value = {
    rooms,
    arrivals,
    guestRequests,
    maintenanceTickets,
    systemSettings,
    auditLogs,
    createReservation,
    checkInGuest,
    checkOutGuest,
    addIncidental,
    updateCleaningTask,
    certifyRoomReady,
    requestGuestService,
    markServiceDelivered,
    createMaintenanceTicket,
    updateRoomRate,
    toggleRoomMaintenance,
    updateSettings,
    addAuditLog,
  }

  return <HotelDataContext.Provider value={value}>{children}</HotelDataContext.Provider>
}

export function useHotelData() {
  const context = useContext(HotelDataContext)
  if (!context) {
    throw new Error('useHotelData must be used within a HotelDataProvider')
  }
  return context
}
