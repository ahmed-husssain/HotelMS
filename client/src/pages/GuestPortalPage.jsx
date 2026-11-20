import React, { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import { RESIDENCES } from '../data/residences'
import { useAuth } from '../context/AuthContext'
import { useHotelData } from '../context/HotelDataContext'
import { useToast } from '../context/ToastContext'
import BookingLookup from '../components/stay/BookingLookup'
import InvoicePreviewModal from '../components/invoice/InvoicePreviewModal'
import {
  lookupStay,
  toggleDigitalDoor,
  updateStaySettings,
  orderStayService,
  submitStayFeedback,
} from '../services/api'

// Bespoke Luxury SVG Icons for Portal Navigation & Services
const KeyIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 2l-2 2m-1.5 1.5L16 7l-2-2m-3.5 3.5a5 5 0 1 0-7.07 7.07 5 5 0 0 0 7.07-7.07z" />
  </svg>
)

const DiningIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 19h18M4 15h16a8 8 0 0 0-16 0zM12 4v3" />
  </svg>
)

const SpaIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22c5.523 0 10-4.477 10-10a10 10 0 0 0-10-10C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10z" />
    <path d="M7 12c3.5 0 6-2.5 6-6 0 3.5 2.5 6 6 6-3.5 0-6 2.5-6 6 0-3.5-2.5-6-6-6z" />
  </svg>
)

const ButlerIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    <path d="M12 2v2" />
  </svg>
)

const FolioIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
)

const BedIcon = ({ className = "w-5 h-5 text-amber-800" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9" />
  </svg>
)

const CandleIcon = ({ className = "w-5 h-5 text-amber-800" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2s-3 3.5-3 6a3 3 0 0 0 6 0c0-2.5-3-6-3-6z" />
    <path d="M6 13v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-8" />
    <line x1="6" y1="13" x2="18" y2="13" />
  </svg>
)

const SpinnerIcon = ({ className = "w-4 h-4 animate-spin" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
  </svg>
)

// Demo Stay Record for Suite 301
const DEMO_BOOKING = {
  bookingRef: 'ST-301-9041',
  roomNumber: 'Suite 301',
  residence: RESIDENCES[0],
  guestName: 'Dr. Tariq Khan',
  guestEmail: 'tariq.khan@luxury.pk',
  guestPhone: '+92 300 8219401',
  nights: 4,
  checkIn: 'Nov 24, 2026',
  checkOut: 'Nov 28, 2026',
  checkInTime: '14:00 PKT',
  checkOutTime: '12:00 PKT',
  guestCount: 2,
  safepayRef: 'SPF-892104',
  initialServices: [
    { id: 'srv-1', title: 'Private Coastal Helipad Transfer', price: 25000, category: 'Transport', time: 'Booked' },
  ],
}

// In-Suite Dining Catalog — Authentic Luxury Room Service
const DINING_MENU = [
  {
    id: 'dining-1',
    category: 'Dining',
    title: 'Club Sandwich & Herb Sea-Salt Fries',
    description: 'Toasted brioche, smoked chicken breast, aged white cheddar, butter lettuce, and hand-cut sea salt fries.',
    price: 2400,
    timeEst: '25 mins',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'dining-2',
    category: 'Dining',
    title: 'Grilled Arabian Sea Snapper & Greens',
    description: 'Pan-seared fresh red snapper filet served with charred asparagus, citrus vinaigrette, and wild herb butter.',
    price: 4800,
    timeEst: '35 mins',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'dining-3',
    category: 'Dining',
    title: 'Continental Breakfast & Fresh Croissants',
    description: 'Artisanal butter croissants, seasonal berry preserves, organic Greek yoghurt, and freshly squeezed orange juice.',
    price: 3200,
    timeEst: '20 mins',
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'dining-4',
    category: 'Dining',
    title: 'Seasonal Fruit Platter & Wild Honey',
    description: 'Fresh sliced rockmelon, dragon fruit, sweet figs, and strawberries served with coastal Sindh forest honey.',
    price: 1600,
    timeEst: '15 mins',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'dining-5',
    category: 'Dining',
    title: 'Iced Coastal Espresso & Mint Tonic',
    description: 'Double espresso poured over chilled artisanal mineral tonic with crushed fresh garden mint.',
    price: 1200,
    timeEst: '10 mins',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=700&q=80',
  },
]

// Cedar Spa & Housekeeping Catalog
const SPA_HOUSEKEEPING_SERVICES = [
  {
    id: 'spa-1',
    category: 'Housekeeping',
    title: 'Fresh Cotton Linens & Extra Pillows',
    description: 'Fresh Egyptian cotton linen change and complimentary selection of feather down or firm pillows.',
    price: 0,
    timeEst: '15 mins',
    badge: 'Complimentary',
  },
  {
    id: 'spa-2',
    category: 'Housekeeping',
    title: 'Plush Bath Towels & Cedar Robes',
    description: 'Fresh set of oversized organic cotton bath sheets, hand towels, and warm spa robes.',
    price: 0,
    timeEst: '15 mins',
    badge: 'Complimentary',
  },
  {
    id: 'spa-3',
    category: 'Housekeeping',
    title: 'Evening Turndown Service',
    description: 'Subtle ambient lighting, bedside iced water carafe, and essential oil mist before rest.',
    price: 0,
    timeEst: '20 mins',
    badge: 'Complimentary',
  },
  {
    id: 'spa-4',
    category: 'Spa',
    title: 'Relaxing In-Suite Aromatherapy Bath',
    description: 'Natural mineral bath salts, jasmine petals, and warm cedar bath oils prepared in your tub.',
    price: 4500,
    timeEst: '30 mins',
    badge: 'Signature',
  },
]

// Butler & Concierge Services
const BUTLER_SERVICES = [
  {
    id: 'concierge-1',
    category: 'Transport',
    title: 'Private Chauffeur Airport Transfer',
    description: 'Private luxury sedan with chilled refreshments and valet luggage handling directly to your suite.',
    price: 12000,
    timeEst: 'Scheduled Pickup',
  },
  {
    id: 'concierge-2',
    category: 'Transport',
    title: 'Coastal Helipad VIP Transfer',
    description: 'Direct helicopter connection between estate helipad and Karachi Jinnah International Airport.',
    price: 25000,
    timeEst: 'Scheduled Flight',
  },
  {
    id: 'concierge-3',
    category: 'Experience',
    title: 'Private Sunset Coastal Boat Tour (2 Hours)',
    description: 'Private coastal boat cruise along the cliffs with evening refreshments.',
    price: 35000,
    timeEst: '17:00 – 19:00 PKT',
  },
  {
    id: 'concierge-4',
    category: 'Experience',
    title: 'Beachside Stargazing Firepit Setup',
    description: 'Private cliffside fire pit setup with warm cedar blankets and herbal tea infusions.',
    price: 8500,
    timeEst: 'Evening Setup',
  },
]

export default function GuestPortalPage() {
  const [searchParams] = useSearchParams()
  const initialRef = searchParams.get('ref') || ''
  const { currentUser, logout } = useAuth()
  const { requestGuestService, arrivals } = useHotelData()
  const { toast } = useToast()

  // Navigation & View State
  const [activeTab, setActiveTab] = useState('suite') // 'suite' | 'dining' | 'spa' | 'concierge' | 'folio'
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false)

  // Portal Authentication State
  const [bookingCode, setBookingCode] = useState(() => initialRef || currentUser?.activeReservationCode || '')
  const [guestEmailInput, setGuestEmailInput] = useState(() => currentUser?.email || '')
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isLoadingStay, setIsLoadingStay] = useState(Boolean(initialRef || currentUser?.activeReservationCode))
  const [searchError, setSearchError] = useState('')

  // Active Stay State
  const [currentBooking, setCurrentBooking] = useState(DEMO_BOOKING)

  // Live MongoDB Atlas Stay Sync on Mount
  useEffect(() => {
    let isMounted = true
    const activeRef = initialRef || currentUser?.activeReservationCode

    if (!activeRef) {
      setIsUnlocked(false)
      setIsLoadingStay(false)
      return
    }

    async function loadLiveStay() {
      setIsLoadingStay(true)
      try {
        const res = await lookupStay(activeRef)
        if (isMounted && res.success && res.data) {
          const b = res.data
          const matchedRes = RESIDENCES.find((r) => r.roomNumber === (b.roomNumber?.replace(/\D/g, '') || '301')) || RESIDENCES[0]

          setCurrentBooking({
            bookingRef: b.bookingReference,
            roomNumber: b.roomNumber,
            residence: {
              ...matchedRes,
              id: b.room?._id || matchedRes.id,
              roomNumber: b.roomNumber?.replace(/\D/g, '') || matchedRes.roomNumber,
              nightlyRate: b.pricingSnapshot?.nightlyRate || matchedRes.nightlyRate,
              credentials: b.room?.credentials || { wifiNetwork: 'Stayza_Guest', wifiPassword: 'pacific2026' },
              valetBay: b.room?.valetBay || 'Bay #301 (Underground Parking)',
              assignedButler: b.room?.assignedButler || 'Tariq J.',
            },
            guestName: b.guestDetails?.name || 'In-House Guest',
            guestEmail: b.guestDetails?.email || '',
            guestPhone: b.guestDetails?.phone || '',
            nights: b.numberOfNights || 4,
            checkIn: new Date(b.checkInDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            checkOut: new Date(b.checkOutDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            checkInTime: '14:00 PKT',
            checkOutTime: '12:00 PKT',
            guestCount: 2,
            safepayRef: b.safepayRef || 'SPF-892104',
            initialServices: b.incidentals && b.incidentals.length > 0 ? b.incidentals : [],
          })

          if (b.incidentals && b.incidentals.length > 0) {
            setOrderedServices(b.incidentals)
          }
          if (b.inStaySettings) {
            setIsDND(Boolean(b.inStaySettings.isDND))
            if (b.inStaySettings.climateMode) setClimateMode(b.inStaySettings.climateMode)
          }
          setIsUnlocked(true)
          setSearchError('')
        } else {
          // Check local confirmed arrivals registry
          const localArrival = (arrivals || []).find((a) => a.bookingRef?.toUpperCase() === activeRef.toUpperCase())
          if (localArrival) {
            const roomNum = localArrival.roomNumber?.replace(/\D/g, '') || '301'
            const matchedRes = RESIDENCES.find((r) => r.roomNumber === roomNum) || RESIDENCES[0]
            setCurrentBooking({
              bookingRef: localArrival.bookingRef,
              roomNumber: localArrival.roomNumber || `Suite ${roomNum}`,
              residence: {
                ...matchedRes,
                roomNumber: roomNum,
                credentials: { wifiNetwork: 'Stayza_Guest', wifiPassword: 'pacific2026' },
                valetBay: `Bay #${roomNum} (Underground Parking)`,
                assignedButler: 'Tariq J.',
              },
              guestName: localArrival.guest || 'In-House Guest',
              guestEmail: localArrival.guestEmail || '',
              guestPhone: localArrival.phone || '',
              nights: localArrival.nights || 4,
              checkIn: 'Today',
              checkOut: 'In 4 Days',
              checkInTime: '14:00 PKT',
              checkOutTime: '12:00 PKT',
              guestCount: 2,
              safepayRef: localArrival.safepayRef || 'SPF-892104',
              initialServices: [],
            })
            setIsUnlocked(true)
            setSearchError('')
            return
          }

          if (isMounted) {
            setIsUnlocked(false)
            setSearchError('Reservation code not found.')
          }
        }
      } catch (err) {
        // Fallback: Check local confirmed arrivals registry
        const localArrival = (arrivals || []).find((a) => a.bookingRef?.toUpperCase() === activeRef.toUpperCase())
        if (localArrival) {
          const roomNum = localArrival.roomNumber?.replace(/\D/g, '') || '301'
          const matchedRes = RESIDENCES.find((r) => r.roomNumber === roomNum) || RESIDENCES[0]
          setCurrentBooking({
            bookingRef: localArrival.bookingRef,
            roomNumber: localArrival.roomNumber || `Suite ${roomNum}`,
            residence: {
              ...matchedRes,
              roomNumber: roomNum,
              credentials: { wifiNetwork: 'Stayza_Guest', wifiPassword: 'pacific2026' },
              valetBay: `Bay #${roomNum} (Underground Parking)`,
              assignedButler: 'Tariq J.',
            },
            guestName: localArrival.guest || 'In-House Guest',
            guestEmail: localArrival.guestEmail || '',
            guestPhone: localArrival.phone || '',
            nights: localArrival.nights || 4,
            checkIn: 'Today',
            checkOut: 'In 4 Days',
            checkInTime: '14:00 PKT',
            checkOutTime: '12:00 PKT',
            guestCount: 2,
            safepayRef: localArrival.safepayRef || 'SPF-892104',
            initialServices: [],
          })
          setIsUnlocked(true)
          setSearchError('')
          return
        }

        if (isMounted) {
          setIsUnlocked(false)
          setSearchError('Reservation code not found.')
        }
      } finally {
        if (isMounted) setIsLoadingStay(false)
      }
    }

    loadLiveStay()
    return () => { isMounted = false }
  }, [initialRef, currentUser])

  const [orderedServices, setOrderedServices] = useState(DEMO_BOOKING.initialServices)
  const [serviceFeedbackNotice, setServiceFeedbackNotice] = useState('')

  // Interactive In-Stay Controls
  const [isDND, setIsDND] = useState(false)
  const [isKeyUnlocking, setIsKeyUnlocking] = useState(false)
  const [keyUnlockedToast, setKeyUnlockedToast] = useState(false)
  const [climateMode, setClimateMode] = useState('ocean') // 'ocean' (21°C) or 'cedar' (24°C)
  const [wifiCopied, setWifiCopied] = useState(false)
  const [expressCheckoutNotice, setExpressCheckoutNotice] = useState(false)

  // Feedback State
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewSubmitted, setReviewSubmitted] = useState(false)

  // Financial Calculations
  const financials = useMemo(() => {
    const roomRate = currentBooking.residence?.nightlyRate || 110000
    const roomSubtotal = roomRate * currentBooking.nights
    const servicesTotal = orderedServices.reduce((sum, item) => sum + item.price, 0)
    const netSubtotal = roomSubtotal + servicesTotal
    const sindhTax = Math.round(netSubtotal * 0.13)
    const totalStayAmount = netSubtotal + sindhTax
    const advancePaid = Math.round((roomSubtotal + currentBooking.initialServices.reduce((s, i) => s + i.price, 0) * 1.13) * 0.3)
    const balanceDue = totalStayAmount - advancePaid

    return {
      roomSubtotal,
      servicesTotal,
      sindhTax,
      totalStayAmount,
      advancePaid,
      balanceDue,
    }
  }, [currentBooking, orderedServices])

  // Formatted booking payload for Invoice Preview
  const invoiceBookingData = useMemo(() => ({
    bookingRef: currentBooking.bookingRef || 'TH-301-9041',
    residence: currentBooking.residence || RESIDENCES[0],
    guestName: currentBooking.guestName,
    guestPhone: currentBooking.guestPhone,
    guestEmail: currentBooking.guestEmail,
    nights: currentBooking.nights,
    safepayRef: currentBooking.safepayRef || 'SPF-892104',
    suiteSubtotal: financials.roomSubtotal,
    selectedAddons: [],
    diningOrders: orderedServices.filter((s) => s.price > 0).map((s) => ({ title: s.title, price: s.price })),
    advance: financials.advancePaid,
    status: 'CONFIRMED',
  }), [currentBooking, financials, orderedServices])

  // Lookup Form Submission
  const handleLookupSubmit = async (e) => {
    e.preventDefault()
    setSearchError('')

    const cleanCode = bookingCode.trim().toUpperCase()
    const cleanEmail = guestEmailInput.trim().toLowerCase()

    if (!cleanCode && !cleanEmail) {
      setSearchError('Reservation code not found.')
      return
    }

    try {
      const res = await lookupStay(cleanCode ? { ref: cleanCode } : { email: cleanEmail })
      if (res.success && res.data) {
        const b = res.data
        const matchedRes = RESIDENCES.find((r) => r.roomNumber === (b.roomNumber?.replace(/\D/g, '') || '301')) || RESIDENCES[0]
        setCurrentBooking({
          bookingRef: b.bookingReference,
          roomNumber: b.roomNumber,
          residence: {
            ...matchedRes,
            id: b.room?._id || matchedRes.id,
            roomNumber: b.roomNumber?.replace(/\D/g, '') || matchedRes.roomNumber,
            nightlyRate: b.pricingSnapshot?.nightlyRate || matchedRes.nightlyRate,
            credentials: b.room?.credentials || { wifiNetwork: 'Stayza_Guest', wifiPassword: 'pacific2026' },
            valetBay: b.room?.valetBay || 'Bay #301 (Underground Parking)',
            assignedButler: b.room?.assignedButler || 'Tariq J.',
          },
          guestName: b.guestDetails?.name || 'In-House Guest',
          guestEmail: b.guestDetails?.email || '',
          guestPhone: b.guestDetails?.phone || '',
          nights: b.numberOfNights || 4,
          checkIn: new Date(b.checkInDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          checkOut: new Date(b.checkOutDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          checkInTime: '14:00 PKT',
          checkOutTime: '12:00 PKT',
          guestCount: 2,
          safepayRef: 'SPF-892104',
          initialServices: b.incidentals || [],
        })
        if (b.incidentals && b.incidentals.length > 0) {
          setOrderedServices(b.incidentals)
        }
        setIsUnlocked(true)
        toast.success(`Welcome to ${b.roomNumber}, ${b.guestDetails?.name}`, 'SUITE CONNECTED')
        return
      }
    } catch {
      // Fallback: Check local confirmed arrivals registry
    }

    // Check confirmed local arrivals registry (HotelDataContext)
    const localArrival = (arrivals || []).find((a) => {
      const matchRef = cleanCode && a.bookingRef?.toUpperCase() === cleanCode
      const matchEmail = cleanEmail && (a.guestEmail?.toLowerCase() === cleanEmail || a.email?.toLowerCase() === cleanEmail)
      return matchRef || matchEmail
    })

    if (localArrival) {
      const roomNum = localArrival.roomNumber?.replace(/\D/g, '') || '301'
      const matchedRes = RESIDENCES.find((r) => r.roomNumber === roomNum) || RESIDENCES[0]
      setCurrentBooking({
        bookingRef: localArrival.bookingRef,
        roomNumber: localArrival.roomNumber || `Suite ${roomNum}`,
        residence: {
          ...matchedRes,
          roomNumber: roomNum,
          credentials: { wifiNetwork: 'Stayza_Guest', wifiPassword: 'pacific2026' },
          valetBay: `Bay #${roomNum} (Underground Parking)`,
          assignedButler: 'Tariq J.',
        },
        guestName: localArrival.guest || 'In-House Guest',
        guestEmail: localArrival.guestEmail || cleanEmail || '',
        guestPhone: localArrival.phone || '',
        nights: localArrival.nights || 4,
        checkIn: 'Today',
        checkOut: 'In 4 Days',
        checkInTime: '14:00 PKT',
        checkOutTime: '12:00 PKT',
        guestCount: 2,
        safepayRef: localArrival.safepayRef || 'SPF-892104',
        initialServices: [],
      })
      setIsUnlocked(true)
      toast.success(`Welcome to ${localArrival.roomNumber}`, 'SUITE CONNECTED')
      return
    }

    // Designated official demo stay
    if (cleanCode === 'ST-301-9041' || cleanCode === 'TH-301-9041' || cleanEmail === 'tariq.khan@luxury.pk') {
      setCurrentBooking(DEMO_BOOKING)
      setIsUnlocked(true)
      return
    }

    // Strictly reject any unverified code
    setIsUnlocked(false)
    setSearchError('Reservation code not found.')
  }

  const handleLoadDemo = async () => {
    setBookingCode('ST-301-9041')
    setGuestEmailInput('tariq.khan@luxury.pk')
    setSearchError('')
    setIsLoadingStay(true)
    try {
      const res = await lookupStay('ST-301-9041')
      if (res.success && res.data) {
        const b = res.data
        const matchedRes = RESIDENCES.find((r) => r.roomNumber === '301') || RESIDENCES[0]
        setCurrentBooking({
          bookingRef: b.bookingReference,
          roomNumber: b.roomNumber,
          residence: {
            ...matchedRes,
            id: b.room?._id || matchedRes.id,
            credentials: b.room?.credentials || { wifiNetwork: 'Stayza_Guest', wifiPassword: 'pacific2026' },
            valetBay: b.room?.valetBay || 'Bay #301 (Underground Parking)',
            assignedButler: b.room?.assignedButler || 'Tariq J.',
          },
          guestName: b.guestDetails?.name || 'Dr. Tariq Khan',
          guestEmail: b.guestDetails?.email || 'tariq.khan@luxury.pk',
          guestPhone: b.guestDetails?.phone || '+92 300 8219401',
          nights: b.numberOfNights || 4,
          checkIn: new Date(b.checkInDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          checkOut: new Date(b.checkOutDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          checkInTime: '14:00 PKT',
          checkOutTime: '12:00 PKT',
          guestCount: 2,
          safepayRef: 'SPF-892104',
          initialServices: b.incidentals && b.incidentals.length > 0 ? b.incidentals : DEMO_BOOKING.initialServices,
        })
        if (b.incidentals && b.incidentals.length > 0) setOrderedServices(b.incidentals)
        setIsUnlocked(true)
        return
      }
    } catch {
      // Fallback to static if offline
      setCurrentBooking(DEMO_BOOKING)
      setIsUnlocked(true)
    } finally {
      setIsLoadingStay(false)
    }
  }

  // Dispatch In-Stay Guest Service
  const handleRequestService = async (service) => {
    const alreadyOrdered = orderedServices.some((s) => s.id === service.id || s.title === service.title)
    if (alreadyOrdered) {
      setServiceFeedbackNotice(`"${service.title}" is already on your active folio.`)
      setTimeout(() => setServiceFeedbackNotice(''), 3500)
      return
    }

    const newItem = {
      ...service,
      id: service.id || `srv-${Date.now()}`,
      time: 'Just now',
    }

    setOrderedServices((prev) => [...prev, newItem])

    // Dispatches to backend MongoDB Atlas
    try {
      await orderStayService(currentBooking.bookingRef, {
        title: service.title,
        price: service.price,
        category: service.category || 'General',
      })
    } catch (err) {
      console.warn('[GuestPortal] Incidental save fallback:', err.message)
    }

    // Dispatches live request to Housekeeping & PMS context
    requestGuestService(
      currentBooking.roomNumber || 'Suite 301',
      currentBooking.guestName,
      service.title,
      service.price,
      service.category
    )

    setServiceFeedbackNotice(`Dispatched to estate concierge: "${service.title}" added to bill.`)
    toast.success(`"${service.title}" dispatched & added to folio`, 'Concierge Request')
    setTimeout(() => setServiceFeedbackNotice(''), 4500)
  }

  // Digital Key Trigger
  const handleTriggerDigitalKey = async () => {
    if (isKeyUnlocking) return
    setIsKeyUnlocking(true)

    // Optional haptic feedback on supported mobile devices
    if (navigator?.vibrate) {
      navigator.vibrate([40, 60, 40])
    }

    try {
      await toggleDigitalDoor(currentBooking.bookingRef)
    } catch (err) {
      console.warn('[GuestPortal] Unlock fallback:', err.message)
    }

    setTimeout(() => {
      setIsKeyUnlocking(false)
      setKeyUnlockedToast(true)
      toast.success(`${currentBooking.roomNumber || 'Suite 301'} lock disengaged`, 'Door Unlocked')
      setTimeout(() => setKeyUnlockedToast(false), 8000)
    }, 1200)
  }

  // Copy Wi-Fi Credentials
  const handleCopyWifi = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText('pacific2026')
    }
    setWifiCopied(true)
    toast.success('Wi-Fi password copied to clipboard', 'Password Copied')
    setTimeout(() => setWifiCopied(false), 2500)
  }

  // Express Checkout Request
  const handleRequestCheckout = () => {
    setExpressCheckoutNotice(true)
    requestGuestService(
      currentBooking.roomNumber || 'Suite 301',
      currentBooking.guestName,
      'Express Check-Out Notification & Valet Dispatch',
      0,
      'Front Desk'
    )
    toast.info('Front desk notified for departure and valet assistance', 'Checkout Requested')
    setTimeout(() => setExpressCheckoutNotice(false), 7000)
  }

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-[#FAF8F5] text-slate-900 font-sans-clean antialiased selection:bg-emerald-100 selection:text-emerald-950 flex flex-col justify-between"
    >
      {/* ============================================================== */}
      {/* 1. TOP ESSENTIAL APP DOCK (ZERO CLUTTER, 44PX TARGETS)        */}
      {/* ============================================================== */}
      <header className="shrink-0 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-slate-200/80 z-40">
        {/* Main Essential Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-3">
          {/* Left: Return & Brand */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/"
              className="touch-target text-xs font-mono tracking-wider text-slate-500 hover:text-slate-950 uppercase transition-colors"
              title="Return to Overview"
            >
              <span>&larr;</span>
              <span className="hidden md:inline ml-1">Overview</span>
            </Link>

            <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />

            <BrandLogo variant="wordmark" theme="dark" size="sm" />
          </div>

          {/* Center: Suite Identifier & Live Dot (Zero Huge Banner) */}
          {isUnlocked && (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse shrink-0" />
              <div className="flex items-baseline gap-1.5 font-mono text-xs sm:text-sm">
                <span className="font-bold text-slate-900 uppercase tracking-wider">
                  {currentBooking.roomNumber || 'Suite 301'}
                </span>
                <span className="hidden sm:inline text-slate-500 text-xs tracking-wide">
                  &bull; Checked In
                </span>
              </div>
            </div>
          )}

          {/* Right: Quick DND, Folio Pill & Sign In/Out */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isUnlocked && (
              <>
                {/* DND Toggle */}
                <button
                  type="button"
                  onClick={() => setIsDND((prev) => !prev)}
                  className={`touch-target px-3 py-1.5 text-xs font-mono font-bold rounded-[2px] transition-all cursor-pointer border ${
                    isDND
                      ? 'bg-rose-900 text-rose-100 border-rose-950 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-900'
                  }`}
                  title="Toggle Do Not Disturb"
                >
                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5 inline-block ${isDND ? 'bg-rose-400' : 'bg-slate-300'}`} />
                  <span>{isDND ? 'DND: On' : 'DND: Off'}</span>
                </button>

                {/* Quick Folio Link */}
                <button
                  type="button"
                  onClick={() => setActiveTab('folio')}
                  className="touch-target px-3.5 py-1.5 bg-slate-900 text-[#FFF0CA] font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] hover:bg-slate-800 transition-all cursor-pointer active:scale-95 shadow-xs"
                >
                  <span className="hidden sm:inline">Bill: </span>
                  <span>PKR {Math.round(financials.totalStayAmount / 1000)}k &rarr;</span>
                </button>
              </>
            )}

            {currentUser ? (
              <button
                type="button"
                onClick={logout}
                className="touch-target px-2 text-xs font-mono text-slate-500 hover:text-slate-900 uppercase transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/login?redirect=/my-stay"
                className="touch-target text-xs font-mono text-emerald-900 font-bold uppercase tracking-widest underline"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* 5 HORIZONTAL SEGMENTED EXPERIENCE TABS */}
        {isUnlocked && (
          <div className="border-t border-slate-200/60 bg-[#FAF8F5]">
            <nav
              aria-label="Guest Operations Navigation"
              className="max-w-7xl mx-auto px-4 sm:px-8 py-2.5 flex items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none"
            >
              {[
                { id: 'suite', label: 'My Suite & Key', Icon: KeyIcon },
                { id: 'dining', label: 'In-Suite Dining', Icon: DiningIcon },
                { id: 'spa', label: 'Cedar Spa & Linens', Icon: SpaIcon },
                { id: 'concierge', label: 'Butler & Services', Icon: ButlerIcon },
                { id: 'folio', label: 'Room Bill & Checkout', Icon: FolioIcon },
              ].map((tab) => {
                const isActive = activeTab === tab.id
                const TabIcon = tab.Icon
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`touch-target px-4 sm:px-5 py-2.5 rounded-full font-mono text-xs sm:text-[13px] font-semibold uppercase tracking-wider transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
                      isActive
                        ? 'bg-slate-900 text-[#FFF0CA] shadow-sm'
                        : 'bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80'
                    }`}
                  >
                    <TabIcon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        )}
      </header>

      {/* ============================================================== */}
      {/* 2. GATEWAY OR ACTIVE MULTI-OPTION GUEST HUB                     */}
      {/* ============================================================== */}
      {!isUnlocked ? (
        <BookingLookup
          currentUser={currentUser}
          bookingCode={bookingCode}
          setBookingCode={setBookingCode}
          guestEmailInput={guestEmailInput}
          setGuestEmailInput={setGuestEmailInput}
          searchError={searchError}
          onSubmit={handleLookupSubmit}
          onLoadDemo={handleLoadDemo}
        />
      ) : (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-6 w-full space-y-6">
          {/* Live Service Notification Toast */}
          {serviceFeedbackNotice && (
            <div className="p-3 bg-emerald-950 text-emerald-200 text-xs font-mono flex items-center justify-between rounded-[2px] shadow-lg border border-emerald-800 animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                <span>{serviceFeedbackNotice}</span>
              </div>
              <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold">
                LIVE DISPATCH
              </span>
            </div>
          )}

          {/* Express Checkout Toast */}
          {expressCheckoutNotice && (
            <div className="p-3 bg-slate-900 text-[#FFF0CA] text-xs font-mono flex items-center justify-between rounded-[2px] shadow-lg border border-slate-800 animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
                <span>Express Check-out initiated. Butler &amp; Valet dispatched to Suite 301.</span>
              </div>
              <span className="text-[10px] text-amber-400 uppercase tracking-widest font-bold">
                FRONT DESK NOTIFIED
              </span>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 1: MY SUITE & DIGITAL KEY                                */}
          {/* ============================================================ */}
          {activeTab === 'suite' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
                {/* Left: Cinematic Suite Card with Live NFC Key Access */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/9.5] max-h-[360px] sm:max-h-[380px] rounded-[2px] overflow-hidden bg-slate-900 border border-slate-200/80 shadow-md group">
                    <img
                      src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=85"
                      alt="Suite 301 Horizon Penthouse"
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35" />

                    {/* Top Overlay Badges */}
                    <div className="absolute top-3 inset-x-3 sm:top-4 sm:inset-x-4 flex items-center justify-between font-mono text-xs text-white">
                      <span className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-[2px] border border-white/15 tracking-widest uppercase text-[#FFF0CA] font-bold">
                        {currentBooking.roomNumber || 'Suite 301'} &bull; 210 m²
                      </span>
                      <span className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-[2px] border border-white/15 text-slate-300 tracking-wider">
                        {currentBooking.checkIn} – {currentBooking.checkOut}
                      </span>
                    </div>

                    {/* Bottom Digital Key Trigger */}
                    <div className="absolute bottom-4 inset-x-4 sm:bottom-5 sm:inset-x-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-mono tracking-[0.25em] text-amber-400 uppercase block font-bold">
                          ROOM KEY &bull; DIGITAL ACCESS
                        </span>
                        <h2 className="font-serif-grand text-2xl sm:text-3xl text-white block mt-1">
                          {currentBooking.residence?.name || 'The Horizon Penthouse'}
                        </h2>
                      </div>

                      <button
                        type="button"
                        onClick={handleTriggerDigitalKey}
                        disabled={isKeyUnlocking}
                        className={`touch-target px-6 py-3.5 font-mono text-xs sm:text-[13px] font-bold uppercase tracking-widest rounded-full shadow-2xl flex items-center justify-center gap-2.5 transition-all cursor-pointer shrink-0 active:scale-95 ${
                          isKeyUnlocking
                            ? 'bg-amber-400 text-slate-950 scale-102 ring-4 ring-amber-300/40'
                            : 'bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-slate-950 hover:brightness-105'
                        }`}
                      >
                        {isKeyUnlocking ? (
                          <SpinnerIcon className="w-4 h-4 text-slate-950 animate-spin" />
                        ) : (
                          <KeyIcon className="w-4 h-4 text-slate-950" />
                        )}
                        <span>{isKeyUnlocking ? 'Unlocking Door...' : 'Unlock Suite Door'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Key Unlock Feedback Toast */}
                  {keyUnlockedToast && (
                    <div className="p-3.5 bg-emerald-950 text-emerald-200 border border-emerald-800 rounded-[2px] font-mono text-xs sm:text-sm flex items-center justify-between shadow-md animate-fade-in">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                        <span>Suite 301 lock disengaged. Welcome inside, {currentBooking.guestName}.</span>
                      </div>
                      <span className="text-[11px] text-emerald-400 uppercase font-bold">
                        UNLOCKED (15S)
                      </span>
                    </div>
                  )}
                </div>

                {/* Right: In-Room Amenities & Tactile Controls */}
                <div className="lg:col-span-5 space-y-4">
                  <div>
                    <span className="text-[11px] font-mono tracking-[0.25em] font-bold text-slate-400 uppercase block">
                      Suite Essentials
                    </span>
                    <h3 className="type-h2 text-2xl sm:text-3xl text-slate-900 mt-0.5">
                      Room Info
                    </h3>
                  </div>

                  {/* 3 Metric Control Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Wi-Fi Card */}
                    <div className="p-3.5 sm:p-4 bg-white border border-slate-200/90 rounded-[2px] space-y-1 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-slate-400 uppercase font-bold">WI-FI</span>
                        <button
                          type="button"
                          onClick={handleCopyWifi}
                          className="text-[11px] font-mono text-emerald-900 uppercase font-bold hover:underline cursor-pointer"
                        >
                          {wifiCopied ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <span className="font-mono text-sm font-bold text-slate-900 block truncate">
                        Stayza_Guest
                      </span>
                      <span className="text-xs text-slate-500 font-mono block">Pass: pacific2026</span>
                    </div>

                    {/* Climate Card */}
                    <div className="p-3.5 sm:p-4 bg-white border border-slate-200/90 rounded-[2px] space-y-1 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-slate-400 uppercase font-bold">CLIMATE</span>
                        <button
                          type="button"
                          onClick={() => setClimateMode((prev) => (prev === 'ocean' ? 'cedar' : 'ocean'))}
                          className="text-[11px] font-mono text-slate-900 font-bold hover:underline cursor-pointer"
                        >
                          Toggle
                        </button>
                      </div>
                      <span className="font-mono text-sm font-bold text-slate-900 block">
                        {climateMode === 'ocean' ? '21°C • Ocean' : '24°C • Cedar'}
                      </span>
                      <span className="text-xs text-emerald-800 font-mono block">Automated</span>
                    </div>

                    {/* Valet Bay Card */}
                    <div className="p-3.5 sm:p-4 bg-white border border-slate-200/90 rounded-[2px] space-y-1 shadow-xs">
                      <span className="text-[11px] font-mono text-slate-400 uppercase block font-bold">VALET</span>
                      <span className="font-mono text-sm font-bold text-slate-900 block">
                        Bay #301
                      </span>
                      <span className="text-xs text-slate-500 font-mono block">Underground Parking</span>
                    </div>
                  </div>

                  {/* Private Butler & Residence Features */}
                  <div className="p-4 sm:p-5 bg-white border border-slate-200/90 rounded-[2px] space-y-3 shadow-xs text-sm text-slate-600">
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                      <div>
                        <span className="font-bold text-slate-900 block text-sm">Private Butler on Duty</span>
                        <span className="text-xs text-slate-500 font-mono">Tariq J. &bull; In-House</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRequestService({
                          id: 'butler-call',
                          title: 'Direct Butler Room Consultation',
                          price: 0,
                          category: 'Front Desk',
                        })}
                        className="touch-target px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-mono text-xs uppercase font-bold rounded-[2px] transition-colors cursor-pointer"
                      >
                        Request Butler &rarr;
                      </button>
                    </div>

                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                      <span className="font-medium text-slate-800">Private Oceanfront Pool</span>
                      <span className="font-mono text-emerald-900 font-semibold text-xs">Heated &bull; 28°C</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-800">Reservation Reference</span>
                      <span className="font-mono text-slate-900 font-bold text-xs">{currentBooking.bookingRef}</span>
                    </div>
                  </div>

                  {/* Quick Housekeeping Triggers */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono tracking-wider font-bold text-slate-400 uppercase block">
                      QUICK ROOM SERVICES &bull; 1-TOUCH REQUEST
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleRequestService({
                          id: 'linen-quick',
                          title: 'Fresh Egyptian Linens & Pillow Refresh',
                          price: 0,
                          category: 'Housekeeping',
                        })}
                        className="touch-target p-3.5 sm:p-4 bg-white border border-slate-200 hover:border-slate-900 rounded-[2px] text-left font-mono text-xs sm:text-sm transition-all cursor-pointer active:scale-95 shadow-xs flex items-center gap-3"
                      >
                        <BedIcon className="w-5 h-5 text-amber-800 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-900 block text-xs sm:text-sm">Fresh Linens</span>
                          <span className="text-[11px] text-slate-500">Complimentary</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRequestService({
                          id: 'turndown-quick',
                          title: 'Evening Turn-Down & Aromatherapy Mist',
                          price: 0,
                          category: 'Housekeeping',
                        })}
                        className="touch-target p-3.5 sm:p-4 bg-white border border-slate-200 hover:border-slate-900 rounded-[2px] text-left font-mono text-xs sm:text-sm transition-all cursor-pointer active:scale-95 shadow-xs flex items-center gap-3"
                      >
                        <CandleIcon className="w-5 h-5 text-amber-800 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-900 block text-xs sm:text-sm">Turn-Down Setup</span>
                          <span className="text-[11px] text-slate-500">Cedar Mist &bull; Free</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: IN-SUITE DINING                                       */}
          {/* ============================================================ */}
          {activeTab === 'dining' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 pb-4">
                <div>
                  <span className="text-[10px] font-mono tracking-[0.25em] font-bold text-slate-400 uppercase block">
                    IN-SUITE COASTAL DINING &bull; PRIVATE CHEF
                  </span>
                  <h2 className="font-serif-grand text-2xl sm:text-3xl text-slate-900 mt-0.5">
                    Curated Coastal Menu
                  </h2>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  Served in {currentBooking.roomNumber || 'Suite 301'} &bull; Added to your room bill
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {DINING_MENU.map((item) => {
                  const isOrdered = orderedServices.some((s) => s.id === item.id)
                  return (
                    <div
                      key={item.id}
                      className="bg-white border border-slate-200/90 rounded-[2px] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                    >
                      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <span className="absolute top-3 right-3 px-2 py-1 bg-black/70 backdrop-blur-md text-[#FFF0CA] font-mono text-[10px] font-bold rounded-[2px]">
                          {item.timeEst}
                        </span>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-1.5">
                          <div className="flex items-baseline justify-between gap-2">
                            <h3 className="font-serif-grand text-lg text-slate-900">
                              {item.title}
                            </h3>
                            <span className="font-mono text-xs font-bold text-slate-900 shrink-0">
                              PKR {item.price.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRequestService(item)}
                          disabled={isOrdered}
                          className={`touch-target w-full py-2.5 font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] transition-all cursor-pointer ${
                            isOrdered
                              ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                              : 'bg-slate-900 hover:bg-slate-800 text-[#FFF0CA] active:scale-[0.98]'
                          }`}
                        >
                          {isOrdered ? 'Added to Room Bill ✓' : `Order to ${currentBooking.roomNumber || 'Suite 301'} →`}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 3: CEDAR SPA & LINENS                                   */}
          {/* ============================================================ */}
          {activeTab === 'spa' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 pb-4">
                <div>
                  <span className="text-[10px] font-mono tracking-[0.25em] font-bold text-slate-400 uppercase block">
                    WELLNESS, SPA &bull; HOUSEKEEPING ON DEMAND
                  </span>
                  <h2 className="font-serif-grand text-2xl sm:text-3xl text-slate-900 mt-0.5">
                    Cedar Spa &amp; Suite Refresh
                  </h2>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  Floor attendants on standby 24/7
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {SPA_HOUSEKEEPING_SERVICES.map((item) => {
                  const isOrdered = orderedServices.some((s) => s.id === item.id)
                  return (
                    <div
                      key={item.id}
                      className="bg-white border border-slate-200/90 rounded-[2px] p-6 shadow-xs flex flex-col justify-between space-y-5"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-950 font-mono text-[9px] font-bold uppercase tracking-wider rounded">
                            {item.badge}
                          </span>
                          <span className="font-mono text-xs text-slate-500">
                            {item.timeEst}
                          </span>
                        </div>

                        <div className="flex items-baseline justify-between gap-2 pt-1">
                          <h3 className="font-serif-grand text-lg text-slate-900">
                            {item.title}
                          </h3>
                          <span className="font-mono text-xs font-bold text-slate-900 shrink-0">
                            {item.price === 0 ? 'COMPLIMENTARY' : `PKR ${item.price.toLocaleString()}`}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRequestService(item)}
                        disabled={isOrdered}
                        className={`touch-target w-full py-2.5 font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] transition-all cursor-pointer ${
                          isOrdered
                            ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                            : 'bg-slate-900 hover:bg-slate-800 text-[#FFF0CA] active:scale-[0.98]'
                        }`}
                      >
                        {isOrdered ? 'Service Requested ✓' : 'Request Service →'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 4: BUTLER & CONCIERGE                                    */}
          {/* ============================================================ */}
          {activeTab === 'concierge' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 pb-4">
                <div>
                  <span className="text-[10px] font-mono tracking-[0.25em] font-bold text-slate-400 uppercase block">
                    ESTATE BUTLER &bull; BESPOKE EXPERIENCES
                  </span>
                  <h2 className="font-serif-grand text-2xl sm:text-3xl text-slate-900 mt-0.5">
                    Concierge &amp; Transfers
                  </h2>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  Private air, land &amp; coastal experiences
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {BUTLER_SERVICES.map((item) => {
                  const isOrdered = orderedServices.some((s) => s.id === item.id)
                  return (
                    <div
                      key={item.id}
                      className="bg-white border border-slate-200/90 rounded-[2px] p-6 shadow-xs flex flex-col justify-between space-y-5"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-950 font-mono text-[9px] font-bold uppercase tracking-wider rounded">
                            {item.category}
                          </span>
                          <span className="font-mono text-xs text-slate-500">
                            {item.timeEst}
                          </span>
                        </div>

                        <div className="flex items-baseline justify-between gap-2 pt-1">
                          <h3 className="font-serif-grand text-lg text-slate-900">
                            {item.title}
                          </h3>
                          <span className="font-mono text-xs font-bold text-slate-900 shrink-0">
                            PKR {item.price.toLocaleString()}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRequestService(item)}
                        disabled={isOrdered}
                        className={`touch-target w-full py-2.5 font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] transition-all cursor-pointer ${
                          isOrdered
                            ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                            : 'bg-slate-900 hover:bg-slate-800 text-[#FFF0CA] active:scale-[0.98]'
                        }`}
                      >
                        {isOrdered ? 'Reserved & Posted ✓' : 'Reserve Experience →'}
                      </button>
                    </div>
                  )
                })}
              </div>

              {/* Direct Concierge Contact Card */}
              <div className="p-6 bg-slate-900 text-[#FAF8F5] rounded-[2px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-amber-400 uppercase tracking-widest block font-bold">
                    DIRECT PRIVATE LINE
                  </span>
                  <h3 className="font-serif-grand text-xl text-white">
                    Need Custom Itinerary or Luggage Assistance?
                  </h3>
                  <p className="text-xs text-slate-300">
                    Dial 0 from your in-suite phone or speak directly with Head Concierge Tariq J.
                  </p>
                </div>
                <a
                  href="tel:+923008921455"
                  className="touch-target px-5 py-2.5 bg-[#D4AF37] text-slate-950 font-mono text-xs font-bold uppercase tracking-wider rounded-full hover:bg-amber-300 transition-colors shrink-0 flex items-center gap-1.5"
                >
                  <span>Call Concierge Desk</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 5: FOLIO & EXPRESS CHECKOUT                              */}
          {/* ============================================================ */}
          {activeTab === 'folio' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-4">
                <div>
                  <span className="text-[10px] font-mono tracking-[0.25em] font-bold text-slate-400 uppercase block">
                    BILLING &amp; ROOM CHARGES
                  </span>
                  <h2 className="font-serif-grand text-2xl sm:text-3xl text-slate-900 mt-0.5">
                    Live Room Bill &amp; Invoice
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsInvoiceOpen(true)}
                    className="touch-target px-3.5 py-2 bg-white border border-slate-300 hover:border-slate-900 text-slate-900 font-mono text-xs uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>Preview &amp; Print Invoice</span>
                    <span>→</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRequestCheckout}
                    className="touch-target px-4 py-2 bg-slate-900 hover:bg-slate-800 text-[#FFF0CA] font-mono text-xs uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer shadow-sm active:scale-95 flex items-center gap-1"
                  >
                    <span>Request Express Checkout</span>
                    <span>→</span>
                  </button>
                </div>
              </div>

              {/* Folio Breakdown */}
              <div className="bg-white border border-slate-200/90 rounded-[2px] p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 font-mono text-xs">
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] block">RESERVATION REF</span>
                    <strong className="text-slate-900">{currentBooking.bookingRef}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] block">PRIMARY GUEST</span>
                    <strong className="text-slate-900">{currentBooking.guestName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] block">STAY DATES</span>
                    <strong className="text-slate-900">{currentBooking.checkIn} – {currentBooking.checkOut} ({currentBooking.nights} Nights)</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] block">PAYMENT AUDIT</span>
                    <span className="text-emerald-800 font-bold">SAFEPAY CONFIRMED</span>
                  </div>
                </div>

                {/* Line Items */}
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-2 border-b border-slate-100 text-slate-700">
                    <div>
                      <span className="font-bold text-slate-900 block">
                        {currentBooking.residence?.name || 'Suite 301'} &bull; {currentBooking.nights} Nights
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Base Rate: PKR {currentBooking.residence?.nightlyRate?.toLocaleString()} / night
                      </span>
                    </div>
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      PKR {financials.roomSubtotal.toLocaleString()}
                    </span>
                  </div>

                  {orderedServices.map((service, idx) => (
                    <div key={idx} className="flex justify-between py-2 border-b border-slate-100 text-slate-700 pl-3 border-l-2 border-emerald-800">
                      <div>
                        <span className="font-medium text-slate-900 block">{service.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono uppercase">{service.category} &bull; {service.time || 'In-Stay'}</span>
                      </div>
                      <span className="font-mono font-medium text-slate-900">
                        {service.price === 0 ? 'COMPLIMENTARY' : `+ PKR ${service.price.toLocaleString()}`}
                      </span>
                    </div>
                  ))}

                  <div className="flex justify-between py-2 text-slate-600">
                    <span>Sindh Sales Tax (13%)</span>
                    <span className="font-mono font-medium text-slate-900">
                      PKR {financials.sindhTax.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between py-3 border-t-2 border-slate-900 text-slate-900 font-bold text-base">
                    <span>Total Stay Valuation</span>
                    <span className="font-mono">PKR {financials.totalStayAmount.toLocaleString()}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <div className="flex justify-between text-emerald-900 font-bold text-xs">
                      <span>Advance Deposit Paid (30% via Safepay)</span>
                      <span className="font-mono">- PKR {financials.advancePaid.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-900 font-bold text-sm bg-slate-50 p-3 rounded-[2px]">
                      <span>Balance Due at Front Desk / Checkout</span>
                      <span className="font-mono text-emerald-950">PKR {financials.balanceDue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guest Experience Rating Card */}
              <div className="bg-white border border-slate-200/90 rounded-[2px] p-6 sm:p-8 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-slate-400 uppercase">
                    Guest Feedback
                  </span>
                  <h3 className="font-serif-grand text-xl text-slate-900 mt-0.5">
                    Rate Your Stay with STAYZA
                  </h3>
                </div>

                {reviewSubmitted ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-[2px] text-center space-y-1">
                    <span className="font-serif-grand text-lg block">Thank You, {currentBooking.guestName}</span>
                    <p className="text-xs">Your rating and feedback have been shared directly with the General Manager.</p>
                  </div>
                ) : (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault()
                      setReviewSubmitted(true)
                      try {
                        await submitStayFeedback(currentBooking.bookingRef, {
                          rating: reviewRating,
                          comment: reviewComment,
                        })
                        toast.success('Your feedback has been delivered to General Manager Tariq J.', 'THANK YOU')
                      } catch (err) {
                        console.warn('[GuestPortal] Feedback submit fallback:', err.message)
                      }
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Overall Experience</label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className="text-2xl cursor-pointer hover:scale-110 transition-transform"
                          >
                            {star <= reviewRating ? '★' : '☆'}
                          </button>
                        ))}
                        <span className="text-xs font-mono text-slate-500 ml-2">
                          {reviewRating} of 5 Stars
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Private Comments for General Manager</label>
                      <textarea
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Share any special memories or recommendations regarding your stay..."
                        className="w-full p-3 bg-slate-50 border border-slate-300 focus:border-slate-900 rounded-[2px] text-xs text-slate-900 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="touch-target px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-[#FFF0CA] font-mono text-xs uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Submit Stay Feedback</span>
                      <span>→</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </main>
      )}

      {/* ============================================================== */}
      {/* 3. ULTRA-MINIMAL GUEST FOOTER (ONLY WHEN IN-RESIDENCE)          */}
      {/* ============================================================== */}
      {isUnlocked && (
        <footer className="shrink-0 border-t border-slate-200/60 bg-[#FAF8F5] py-2 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2 text-[10px] font-mono text-slate-500">
            <span className="uppercase tracking-widest text-[9px] text-slate-400">STAYZA IN-RESIDENCE ROOM BILL</span>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsUnlocked(false)}
                className="text-slate-600 hover:text-slate-950 underline cursor-pointer"
              >
                Switch Reservation
              </button>
            </div>
          </div>
        </footer>
      )}

      {/* Official Luxury Hotel Tax Invoice Modal */}
      <InvoicePreviewModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        booking={invoiceBookingData}
        type="FINAL_TAX_INVOICE"
      />
    </div>
  )
}
