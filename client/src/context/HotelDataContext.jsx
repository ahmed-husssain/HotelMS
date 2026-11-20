import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  fetchStaffDashboard,
  checkInStaffGuest,
  checkOutStaffGuest,
  markNoShowStaffGuest,
  fetchShiftSummary,
  postFolioCharge,
  patchRoomStatus,
  patchRoomChecklist,
  patchAdminRoomRate,
  fetchHousekeepingDashboard,
  restockInventoryItem,
  toggleCleaningStep,
  certifyHousekeepingRoom,
} from '../services/api'
import {
  subscribeToRoomUpdates,
  subscribeToFolioUpdates,
  subscribeToBookingEvents,
} from '../services/socket'
import { useToast } from './ToastContext'

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
    name: 'The Beach Suite',
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

  // 7. Hotel Supplies & Linens Inventory (Priority 2)
  const [inventory, setInventory] = useState(() => {
    try {
      const saved = localStorage.getItem('stayza_hotel_inventory')
      return saved ? JSON.parse(saved) : [
        { _id: 'inv-1', name: 'Bed Sheets', category: 'linen', inStock: 25, inLaundry: 8, minAlertLevel: 5, unit: 'sets' },
        { _id: 'inv-2', name: 'Bath Towels', category: 'linen', inStock: 40, inLaundry: 12, minAlertLevel: 10, unit: 'sets' },
        { _id: 'inv-3', name: 'Pillows & Blankets', category: 'linen', inStock: 20, inLaundry: 4, minAlertLevel: 5, unit: 'sets' },
        { _id: 'inv-4', name: 'Soap & Shampoo', category: 'consumable', inStock: 50, inLaundry: 0, minAlertLevel: 10, unit: 'bottles' },
        { _id: 'inv-5', name: 'Water Bottles', category: 'consumable', inStock: 60, inLaundry: 0, minAlertLevel: 15, unit: 'bottles' },
        { _id: 'inv-6', name: 'Tea & Coffee Kits', category: 'consumable', inStock: 45, inLaundry: 0, minAlertLevel: 10, unit: 'packs' },
        { _id: 'inv-7', name: 'Snacks', category: 'consumable', inStock: 40, inLaundry: 0, minAlertLevel: 10, unit: 'packs' },
      ]
    } catch {
      return []
    }
  })

  // Synchronize state changes to localStorage
  useEffect(() => {
    localStorage.setItem('stayza_hotel_rooms', JSON.stringify(rooms))
  }, [rooms])

  useEffect(() => {
    localStorage.setItem('stayza_hotel_inventory', JSON.stringify(inventory))
  }, [inventory])

  // 8. Front Desk Cashier Payments & Collections (Priority 3 Drawer Balancing)
  const [deskPayments, setDeskPayments] = useState(() => {
    try {
      const saved = localStorage.getItem('stayza_hotel_desk_payments')
      return saved ? JSON.parse(saved) : [
        {
          id: 'PAY-1001',
          time: '09:30 AM',
          type: 'INCIDENTAL_SETTLEMENT',
          method: 'CASH',
          amount: 25000,
          roomNumber: 'Suite 301',
          guest: 'Dr. Tariq Khan',
          notes: 'Helipad chauffeur transfer cash settlement',
        },
        {
          id: 'PAY-1002',
          time: '11:15 AM',
          type: 'CHECKOUT_SETTLEMENT',
          method: 'CARD_POS',
          amount: 65000,
          roomNumber: 'Suite 202',
          guest: 'Faraz Ahmed',
          notes: 'Standard suite checkout card settlement',
        },
      ]
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('stayza_hotel_desk_payments', JSON.stringify(deskPayments))
  }, [deskPayments])

  const openingFloat = 50000
  const cashCollected = deskPayments
    .filter((p) => p.method === 'CASH' || p.paymentMethod === 'CASH_AT_DESK')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0)

  const cardPOS = deskPayments
    .filter(
      (p) =>
        p.method === 'CARD_POS' ||
        p.method === 'CARD' ||
        p.paymentMethod === 'CARD_POS' ||
        p.paymentMethod === 'CARD_AT_DESK'
    )
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0)

  const expectedCashTotal = openingFloat + cashCollected

  const addDeskPayment = (paymentData) => {
    const record = {
      id: paymentData.id || `PAY-${Date.now().toString().slice(-4)}`,
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      ...paymentData,
      amount: Number(paymentData.amount) || 0,
    }
    setDeskPayments((prev) => [record, ...prev])
    return record
  }

  const { toast } = useToast()

  // Live MongoDB Atlas Sync on Mount + Smart Live Heartbeat (Every 3.5s for zero-refresh updates)
  useEffect(() => {
    let isMounted = true

    async function syncLiveDashboard(isInitial = false) {
      // Only poll when page/tab is active/visible
      if (typeof document !== 'undefined' && document.hidden) return

      try {
        const res = await fetchStaffDashboard()
        if (isMounted && res.success && res.data) {
          if (res.data.rooms && res.data.rooms.length > 0) {
            setRooms((prev) => {
              // Check if any room status changed to trigger live notification
              if (!isInitial && Array.isArray(prev)) {
                res.data.rooms.forEach((newRoom) => {
                  const oldRoom = prev.find((r) => r.roomNumber === newRoom.roomNumber)
                  if (oldRoom && oldRoom.status !== newRoom.status) {
                    if (newRoom.status === 'AVAILABLE') {
                      toast?.success?.(`${newRoom.roomNumber} certified & ready for arrivals`, 'ROOM READY')
                    } else if (newRoom.status === 'DIRTY') {
                      toast?.info?.(`${newRoom.roomNumber} flagged DIRTY for turnover`, 'TURNOVER QUEUE')
                    } else if (newRoom.status === 'OCCUPIED') {
                      toast?.info?.(`${newRoom.roomNumber} checked in: ${newRoom.guest || 'Guest'}`, 'CHECK-IN')
                    } else if (newRoom.status === 'MAINTENANCE') {
                      toast?.warning?.(`${newRoom.roomNumber} locked for maintenance`, 'MAINTENANCE')
                    }
                  }
                })
              }
              return res.data.rooms
            })
          }
          if (res.data.arrivals && res.data.arrivals.length > 0) {
            setArrivals(res.data.arrivals)
          }
        }
      } catch (err) {
        if (isInitial) {
          console.warn('[HotelDataContext] Fallback to cached hotel state:', err.message)
        }
      }

      try {
        const shiftRes = await fetchShiftSummary()
        if (isMounted && shiftRes.success && shiftRes.data) {
          if (Array.isArray(shiftRes.data.payments) && shiftRes.data.payments.length > 0) {
            setDeskPayments((prev) => {
              const existingIds = new Set(prev.map((p) => p.id || p._id))
              const newRemote = shiftRes.data.payments
                .filter((p) => !existingIds.has(p._id) && !existingIds.has(p.id))
                .map((p) => ({
                  id: p._id || p.id,
                  time: new Date(p.paidAt || Date.now()).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
                  type: p.transactionType || 'DESK_PAYMENT',
                  method: p.paymentMethod === 'CARD_POS' || p.paymentMethod === 'CARD_AT_DESK' ? 'CARD_POS' : 'CASH',
                  amount: p.amount,
                  roomNumber: p.bookingId?.roomNumber || 'Front Desk',
                  guest: p.bookingId?.guestDetails?.name || 'Guest',
                  notes: p.notes,
                }))
              return newRemote.length > 0 ? [...newRemote, ...prev] : prev
            })
          }
        }
      } catch (err) {
        // Fallback silently if running client-only
      }
    }

    // 1. Initial mount load
    syncLiveDashboard(true)

    // 2. Smart Background Heartbeat (every 3.5s): auto-syncs so changes reflect across devices without manual refresh
    const heartbeatInterval = setInterval(() => {
      syncLiveDashboard(false)
    }, 3500)

    return () => {
      isMounted = false
      clearInterval(heartbeatInterval)
    }
  }, [toast])

  // Real-Time Socket.io Synchronization (<40ms duplex event bus)
  useEffect(() => {
    // 1. Subscribe to Room Status & Checklist updates
    const unsubscribeRooms = subscribeToRoomUpdates(({ type, data }) => {
      if (!data || !data.roomNumber) return

      if (type === 'STATUS_CHANGED') {
        setRooms((prev) =>
          prev.map((r) => {
            const isMatch =
              r.roomNumber === data.roomNumber ||
              r.roomNumber.replace(/\D/g, '') === String(data.roomNumber).replace(/\D/g, '')
            if (isMatch) {
              return {
                ...r,
                status: data.status,
                ...(data.cleaningTasks ? { cleaningTasks: data.cleaningTasks } : {}),
                ...(data.guest !== undefined ? { guest: data.guest } : {}),
                ...(data.status === 'AVAILABLE' ? { checkoutTime: 'Turnover Completed' } : {}),
              }
            }
            return r
          })
        )

        // Informative, elegant toast notifications
        if (data.status === 'AVAILABLE') {
          toast?.success?.(`${data.roomNumber} certified & ready for arrivals`, 'ROOM READY')
        } else if (data.status === 'DIRTY') {
          toast?.info?.(`${data.roomNumber} flagged DIRTY for turnover`, 'TURNOVER QUEUE')
        } else {
          toast?.info?.(`${data.roomNumber} status: ${data.status}`, 'ROOM UPDATE')
        }
      } else if (type === 'CHECKLIST_UPDATED') {
        setRooms((prev) =>
          prev.map((r) => {
            const isMatch =
              r.roomNumber === data.roomNumber ||
              r.roomNumber.replace(/\D/g, '') === String(data.roomNumber).replace(/\D/g, '')
            if (isMatch) {
              return {
                ...r,
                status: data.status,
                cleaningTasks: data.cleaningTasks,
              }
            }
            return r
          })
        )
      }
    })

    // 2. Subscribe to Folio Additions
    const unsubscribeFolio = subscribeToFolioUpdates((data) => {
      if (!data || !data.roomNumber) return

      setRooms((prev) =>
        prev.map((r) => {
          const isMatch =
            r.roomNumber === data.roomNumber ||
            r.roomNumber.replace(/\D/g, '') === String(data.roomNumber).replace(/\D/g, '')
          if (isMatch) {
            const incTitle = data.incidental?.title || data.incidental?.item || 'Incidental Charge'
            const incPrice = data.incidental?.price || data.incidental?.amount || 0
            const updatedIncidentals = [
              ...(r.incidentals || []).filter((inc) => inc.id !== data.incidental?.id),
              {
                id: data.incidental?.id || `inc-${Date.now()}`,
                item: incTitle,
                amount: incPrice,
                time: 'Just Now',
              },
            ]
            return {
              ...r,
              incidentals: updatedIncidentals,
              balanceDue: data.newBalanceDue ?? r.balanceDue,
            }
          }
          return r
        })
      )
      toast?.info?.(
        `PKR ${(data.incidental?.price || data.incidental?.amount || 0).toLocaleString()} posted to ${data.roomNumber}`,
        'FOLIO UPDATE'
      )
    })

    // 3. Subscribe to Guest Check-Ins & Check-Outs
    const unsubscribeBookings = subscribeToBookingEvents(({ type, data }) => {
      if (!data) return

      if (type === 'CHECKED_IN') {
        setArrivals((prev) =>
          prev.filter((a) => a.bookingRef !== data.bookingRef && a.id !== data.bookingRef)
        )
        if (data.roomNumber) {
          setRooms((prev) =>
            prev.map((r) => {
              const isMatch =
                r.roomNumber === data.roomNumber ||
                r.roomNumber.replace(/\D/g, '') === String(data.roomNumber).replace(/\D/g, '')
              if (isMatch) {
                return {
                  ...r,
                  status: 'OCCUPIED',
                  guest: data.guest || r.guest,
                }
              }
              return r
            })
          )
        }
        toast?.success?.(`Guest checked into ${data.roomNumber || 'suite'}`, 'PMS CHECK-IN')
      } else if (type === 'CHECKED_OUT') {
        if (data.roomNumber) {
          setRooms((prev) =>
            prev.map((r) => {
              const isMatch =
                r.roomNumber === data.roomNumber ||
                r.roomNumber.replace(/\D/g, '') === String(data.roomNumber).replace(/\D/g, '')
              if (isMatch) {
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
        }
        toast?.info?.(`Guest checked out of ${data.roomNumber || 'suite'}`, 'PMS CHECK-OUT')
      }
    })

    return () => {
      unsubscribeRooms()
      unsubscribeFolio()
      unsubscribeBookings()
    }
  }, [toast])

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
   * Optimistically updates checklist and syncs via WebSockets to Front Desk PMS
   */
  const updateCleaningTask = async (roomNumber, taskKey, isComplete, actor = 'Housekeeping Staff') => {
    // 1. Optimistic UI update for Room
    setRooms((prev) =>
      prev.map((r) => {
        const isMatch =
          r.roomNumber === roomNumber ||
          r.roomNumber.replace(/\D/g, '') === String(roomNumber).replace(/\D/g, '')
        if (isMatch) {
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

    // 2. Auto-deduct inventory supplies if step completed
    if (isComplete) {
      setInventory((prev) =>
        prev.map((item) => {
          if (taskKey === 'linen') {
            if (item.name === 'Bed Sheets') {
              return { ...item, inStock: Math.max(0, item.inStock - 1), inLaundry: (item.inLaundry || 0) + 1 }
            }
            if (item.name === 'Bath Towels') {
              return { ...item, inStock: Math.max(0, item.inStock - 2), inLaundry: (item.inLaundry || 0) + 2 }
            }
          } else if (taskKey === 'bathSalts') {
            if (item.name === 'Soap & Shampoo') {
              return { ...item, inStock: Math.max(0, item.inStock - 1) }
            }
          } else if (taskKey === 'minibar') {
            if (item.name === 'Water Bottles') {
              return { ...item, inStock: Math.max(0, item.inStock - 2) }
            }
            if (item.name === 'Tea & Coffee Kits') {
              return { ...item, inStock: Math.max(0, item.inStock - 1) }
            }
            if (item.name === 'Snacks') {
              return { ...item, inStock: Math.max(0, item.inStock - 1) }
            }
          }
          return item
        })
      )
    }

    // 3. Persist to MongoDB Atlas and broadcast across WebSockets (<40ms)
    try {
      await patchRoomChecklist(roomNumber, {
        taskKey,
        isComplete,
        cleanerName: actor,
      })
    } catch (err) {
      console.warn('[Housekeeping Checklist] Remote sync warning:', err.message)
    }
  }

  /**
   * Action F: Certify Room Ready & Available (Invoked on /housekeeping)
   * Advances room to AVAILABLE so Front Desk PMS immediately turns green!
   */
  const certifyRoomReady = async (roomNumber, cleanerName = 'Bilal Farooq') => {
    // 1. Optimistic UI update
    setRooms((prev) =>
      prev.map((r) => {
        const isMatch =
          r.roomNumber === roomNumber ||
          r.roomNumber.replace(/\D/g, '') === String(roomNumber).replace(/\D/g, '')
        if (isMatch) {
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

    // 2. Persist to MongoDB Atlas and broadcast across WebSockets (<40ms)
    try {
      await patchRoomStatus(roomNumber, {
        status: 'AVAILABLE',
        cleanerName,
        actor: cleanerName,
      })
    } catch (err) {
      console.warn('[Housekeeping Certify] Remote sync warning:', err.message)
    }
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
   * If urgency is URGENT or HIGH, lock room status to MAINTENANCE!
   */
  const createMaintenanceTicket = async (ticketData, reporterName = 'Staff Member') => {
    const newTicket = {
      id: `TKT-${Math.floor(100 + Math.random() * 900)}`,
      ...ticketData,
      status: 'OPEN',
      reportedAt: 'Just Now',
    }

    setMaintenanceTickets((prev) => [newTicket, ...prev])

    if (ticketData.urgency === 'URGENT' || ticketData.urgency === 'HIGH') {
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

    try {
      await createMaintenanceTicketApi({
        roomNumber: ticketData.roomNumber,
        issueCategory: ticketData.category || 'OTHER',
        issueDescription: ticketData.issue,
        priority: ticketData.urgency || 'MEDIUM',
        lockRoom: ticketData.urgency === 'URGENT' || ticketData.urgency === 'HIGH',
      })
    } catch (err) {
      console.warn('[Maintenance Ticket] Atlas sync warning:', err.message)
    }

    return newTicket
  }

  /**
   * Action J: Restock Supplies or Return Cleaned Linens from Laundry (Priority 2)
   */
  const restockInventory = async (itemId, amount = 10, type = 'clean_restock') => {
    try {
      const res = await restockInventoryItem(itemId, amount, type)
      if (res.success && res.data) {
        if (res.data.inventory) {
          setInventory(res.data.inventory)
        }
        toast?.success?.(res.message || 'Supplies replenished', 'INVENTORY')
        return res.data
      }
    } catch (err) {
      console.warn('[Inventory Restock] Remote sync fallback:', err.message)
      setInventory((prev) =>
        prev.map((item) => {
          if (item._id === itemId || item.name === itemId) {
            if (type === 'laundry_return' && item.category === 'linen') {
              const ret = Math.min(amount, item.inLaundry || 0)
              return {
                ...item,
                inStock: (item.inStock || 0) + ret,
                inLaundry: Math.max(0, (item.inLaundry || 0) - ret),
              }
            }
            return {
              ...item,
              inStock: (item.inStock || 0) + amount,
            }
          }
          return item
        })
      )
      toast?.info?.(`Stock replenished (+${amount})`, 'LOCAL RESTOCK')
    }
  }

  /**
   * Action K: Update Base Room Rate (Invoked on /admin)
   * Updates state optimistically and persists to MongoDB Atlas via PATCH /api/admin/rooms/:id/rate
   */
  const updateRoomRate = async (roomNumber, newRate, actorName = 'General Manager') => {
    const rateNum = Number(newRate)
    setRooms((prev) =>
      prev.map((r) => (r.roomNumber === roomNumber ? { ...r, nightlyRate: rateNum } : r))
    )
    addAuditLog(
      'ROOM_RATE_UPDATED',
      'SETTINGS',
      `Updated ${roomNumber} base nightly tariff to PKR ${rateNum.toLocaleString()}.`,
      actorName
    )

    try {
      await patchAdminRoomRate(roomNumber, rateNum)
    } catch (err) {
      console.warn('[HotelDataContext.updateRoomRate] Remote sync warning:', err.message)
    }
  }

  /**
   * Action K: Toggle Room Refurbishment Maintenance (Invoked on /admin)
   * Updates state optimistically and locks/unlocks room in MongoDB Atlas via PATCH /api/rooms/:id/status
   */
  const toggleRoomMaintenance = async (roomNumber, actorName = 'General Manager') => {
    let nextStatus = 'MAINTENANCE'
    setRooms((prev) =>
      prev.map((r) => {
        if (r.roomNumber === roomNumber) {
          nextStatus = r.status === 'MAINTENANCE' ? 'AVAILABLE' : 'MAINTENANCE'
          return { ...r, status: nextStatus }
        }
        return r
      })
    )
    addAuditLog(
      'MAINTENANCE_TOGGLED',
      'SETTINGS',
      `Toggled maintenance mode on ${roomNumber} (${nextStatus}).`,
      actorName
    )

    try {
      await patchRoomStatus(roomNumber, { status: nextStatus })
    } catch (err) {
      console.warn('[HotelDataContext.toggleRoomMaintenance] Remote sync warning:', err.message)
    }
  }

  /**
   * Action L: Update System Configuration Settings (Invoked on /admin)
   */
  const updateSettings = (newSettings, actorName = 'General Manager') => {
    setHotelSettings(newSettings)
    try {
      localStorage.setItem('stayza_hotel_settings', JSON.stringify(newSettings))
    } catch (err) {
      console.warn('[HotelDataContext.updateSettings] LocalStorage error:', err.message)
    }
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
    inventory,
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
    restockInventory,
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
