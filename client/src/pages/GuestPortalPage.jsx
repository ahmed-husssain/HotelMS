import React, { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import { RESIDENCES } from '../data/residences'
import { useAuth } from '../context/AuthContext'
import { useHotelData } from '../context/HotelDataContext'
import { useToast } from '../context/ToastContext'
import BookingLookup from '../components/stay/BookingLookup'
import InvoicePreviewModal from '../components/invoice/InvoicePreviewModal'

// Demo Stay Record for Suite 301
const DEMO_BOOKING = {
  bookingRef: 'TH-301-9041',
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

// In-Suite Dining Catalog
const DINING_MENU = [
  {
    id: 'dining-1',
    category: 'Dining',
    title: 'Coastal Line-Catch Seafood Tasting Dinner',
    description: 'Fresh Arabian Sea lobster & black pomfret prepared in-suite by our private executive chef.',
    price: 15000,
    timeEst: '45 mins',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'dining-2',
    category: 'Dining',
    title: 'Arabian Lobster Thermidor with Saffron Pilaf',
    description: 'Charred rock lobster, gruyère reduction, and wild saffron pilaf served with vintage citrus butter.',
    price: 18500,
    timeEst: '40 mins',
    image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'dining-3',
    category: 'Dining',
    title: 'Estate High Tea & Artisanal Cedar Brew',
    description: 'Fresh organic pastries, estate-grown herbal infusions, and ceremonial matcha served on your terrace.',
    price: 4500,
    timeEst: '25 mins',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'dining-4',
    category: 'Dining',
    title: 'Midnight Artisanal Cheese & Fruit Board',
    description: 'Imported raw milk cheeses, honeycomb, roasted pistachios, sun-dried figs, and sourdough crisps.',
    price: 6800,
    timeEst: '20 mins',
    image: 'https://images.unsplash.com/photo-1631379578550-7038263db699?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'dining-5',
    category: 'Dining',
    title: 'Cold-Pressed Coastal Citrus & Wild Forest Honey',
    description: 'Valencia oranges, sea buckthorn, cold-pressed mint & wild Sindh forest honey.',
    price: 2200,
    timeEst: '15 mins',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=700&q=80',
  },
]

// Cedar Spa & Housekeeping Catalog
const SPA_HOUSEKEEPING_SERVICES = [
  {
    id: 'spa-1',
    category: 'Housekeeping',
    title: 'Fresh Egyptian Linen & Feather Pillow Refresh',
    description: 'Mid-stay organic cotton linen change with aromatic cedar mist spray.',
    price: 0,
    timeEst: '20 mins',
    badge: 'Complimentary',
  },
  {
    id: 'spa-2',
    category: 'Housekeeping',
    title: 'Evening Cedar Spa & Aromatic Bath Setup',
    description: 'Organic magnesium flakes, fresh jasmine blossoms, and warmed cedar bath oils prepared in your spa tub.',
    price: 6000,
    timeEst: '30 mins',
    badge: 'Signature',
  },
  {
    id: 'spa-3',
    category: 'Spa',
    title: 'Deep Tissue Ocean Mist Massage (60 Min)',
    description: 'Private therapeutic bodywork with warmed coastal basalt stones in your villa pavilion.',
    price: 14000,
    timeEst: 'By Appointment',
    badge: 'In-Suite Therapist',
  },
  {
    id: 'spa-4',
    category: 'Housekeeping',
    title: 'Luggage Unpacking, Steaming & Wardrobe Pressing',
    description: 'Garment steaming and cedar closet organization by floor butler upon arrival.',
    price: 3500,
    timeEst: '45 mins',
    badge: 'Valet Service',
  },
]

// Butler & Bespoke Concierge Catalog
const BUTLER_SERVICES = [
  {
    id: 'concierge-1',
    category: 'Transport',
    title: 'Private Coastal Helipad Transfer',
    description: 'Direct helicopter connection between estate helipad and Karachi Jinnah International Airport.',
    price: 25000,
    timeEst: 'Scheduled Flight',
  },
  {
    id: 'concierge-2',
    category: 'Transport',
    title: 'Chauffeur Executive Sedan Airport Transfer',
    description: 'Private luxury sedan with chilled towels and coastal refreshment upon arrival.',
    price: 12000,
    timeEst: 'Scheduled Pickup',
  },
  {
    id: 'concierge-3',
    category: 'Experience',
    title: 'Private Sunset Yacht Charter (2 Hours)',
    description: 'Twin-engine luxury yacht along the Arabian Sea cliffs with vintage refreshments.',
    price: 45000,
    timeEst: '17:00 – 19:00 PKT',
  },
  {
    id: 'concierge-4',
    category: 'Experience',
    title: 'Beachside Stargazing Firepit & Nightcap',
    description: 'Private cliffside fire pit setup with warm cedar blankets and artisanal nightcaps.',
    price: 8500,
    timeEst: 'Evening Setup',
  },
]

export default function GuestPortalPage() {
  const [searchParams] = useSearchParams()
  const initialRef = searchParams.get('ref') || ''
  const { currentUser, logout } = useAuth()
  const { requestGuestService } = useHotelData()
  const { toast } = useToast()

  // Navigation & View State
  const [activeTab, setActiveTab] = useState('suite') // 'suite' | 'dining' | 'spa' | 'concierge' | 'folio'
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false)

  // Portal Authentication State
  const [bookingCode, setBookingCode] = useState(() => initialRef || currentUser?.activeReservationCode || 'TH-301-9041')
  const [guestEmailInput, setGuestEmailInput] = useState(() => currentUser?.email || '')
  const [isUnlocked, setIsUnlocked] = useState(() => Boolean(initialRef || currentUser?.role === 'guest'))
  const [searchError, setSearchError] = useState('')

  // Active Stay State
  const [currentBooking, setCurrentBooking] = useState(() => {
    if (currentUser?.name) {
      return {
        ...DEMO_BOOKING,
        guestName: currentUser.name,
        guestEmail: currentUser.email || DEMO_BOOKING.guestEmail,
        bookingRef: currentUser.activeReservationCode || DEMO_BOOKING.bookingRef,
      }
    }
    return DEMO_BOOKING
  })

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
  const handleLookupSubmit = (e) => {
    e.preventDefault()
    setSearchError('')

    const cleanCode = bookingCode.trim().toUpperCase()
    const cleanEmail = guestEmailInput.trim().toLowerCase()

    if (cleanCode === 'TH-301-9041' || cleanCode.startsWith('TH-') || cleanCode.startsWith('LX-') || cleanEmail.includes('@')) {
      setIsUnlocked(true)
    } else {
      setSearchError('Reservation reference not found. Try demo reference TH-301-9041.')
    }
  }

  const handleLoadDemo = () => {
    setBookingCode('TH-301-9041')
    setGuestEmailInput('tariq.khan@luxury.pk')
    setCurrentBooking(DEMO_BOOKING)
    setIsUnlocked(true)
    setSearchError('')
  }

  // Dispatch In-Stay Guest Service
  const handleRequestService = (service) => {
    const alreadyOrdered = orderedServices.some((s) => s.id === service.id)
    if (alreadyOrdered) {
      setServiceFeedbackNotice(`"${service.title}" is already on your active folio.`)
      setTimeout(() => setServiceFeedbackNotice(''), 3500)
      return
    }

    const newItem = {
      ...service,
      time: 'Just now',
    }

    setOrderedServices((prev) => [...prev, newItem])

    // Dispatches live request to Housekeeping & PMS context
    requestGuestService(
      currentBooking.roomNumber || 'Suite 301',
      currentBooking.guestName,
      service.title,
      service.price,
      service.category
    )

    setServiceFeedbackNotice(`Dispatched to estate concierge: "${service.title}" added to bill.`)
    toast.success(`"${service.title}" dispatched & added to folio`, 'CONCIERGE DISPATCH')
    setTimeout(() => setServiceFeedbackNotice(''), 4500)
  }

  // Digital Key Trigger
  const handleTriggerDigitalKey = () => {
    if (isKeyUnlocking) return
    setIsKeyUnlocking(true)

    // Optional haptic feedback on supported mobile devices
    if (navigator?.vibrate) {
      navigator.vibrate([40, 60, 40])
    }

    setTimeout(() => {
      setIsKeyUnlocking(false)
      setKeyUnlockedToast(true)
      toast.success('Suite 301 NFC Electronic Lock Engaged', 'DOOR UNLOCKED')
      setTimeout(() => setKeyUnlockedToast(false), 8000)
    }, 1200)
  }

  // Copy Wi-Fi Credentials
  const handleCopyWifi = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText('pacific2026')
    }
    setWifiCopied(true)
    toast.success('Habitas 1Gbps Wi-Fi key copied to clipboard', 'NETWORK KEY COPIED')
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
    toast.info('Express check-out dispatched to Front Desk', 'CHECKOUT REQUESTED')
    setTimeout(() => setExpressCheckoutNotice(false), 7000)
  }

  return (
    <div className="h-screen h-[100dvh] max-h-[100dvh] overflow-hidden bg-[#FAF8F5] text-slate-900 font-sans-clean antialiased selection:bg-emerald-100 selection:text-emerald-950 flex flex-col justify-between">
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
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shrink-0" />
              <div className="flex items-baseline gap-1.5 font-mono text-xs">
                <span className="font-bold text-slate-900 uppercase tracking-wider">
                  {currentBooking.roomNumber || 'Suite 301'}
                </span>
                <span className="hidden sm:inline text-slate-500 text-[11px] tracking-wide">
                  &bull; In Residence
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
                  className={`touch-target px-2.5 py-1 text-[11px] font-mono font-bold rounded-[2px] transition-all cursor-pointer border ${
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
                  className="touch-target px-3 py-1 bg-slate-900 text-[#FFF0CA] font-mono text-[11px] font-bold uppercase tracking-wider rounded-[2px] hover:bg-slate-800 transition-all cursor-pointer active:scale-95 shadow-xs"
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
                className="touch-target px-2 text-[10px] font-mono text-slate-500 hover:text-slate-900 uppercase transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/login?redirect=/my-stay"
                className="touch-target text-[10px] font-mono text-emerald-900 font-bold uppercase tracking-widest underline"
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
              className="max-w-7xl mx-auto px-4 sm:px-8 py-1.5 flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2.5 overflow-x-auto scrollbar-none"
            >
              {[
                { id: 'suite', label: 'My Suite & Key', icon: '🔑' },
                { id: 'dining', label: 'In-Suite Dining', icon: '🍽️' },
                { id: 'spa', label: 'Cedar Spa & Linens', icon: '🌿' },
                { id: 'concierge', label: 'Butler & Services', icon: '🛎️' },
                { id: 'folio', label: 'Folio & Checkout', icon: '🧾' },
              ].map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`touch-target px-3.5 sm:px-4 py-1.5 rounded-full font-mono text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
                      isActive
                        ? 'bg-slate-900 text-[#FFF0CA] shadow-sm'
                        : 'bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80'
                    }`}
                  >
                    <span>{tab.icon}</span>
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
          bookingCode={bookingCode}
          setBookingCode={setBookingCode}
          guestEmailInput={guestEmailInput}
          setGuestEmailInput={setGuestEmailInput}
          searchError={searchError}
          onSubmit={handleLookupSubmit}
          onLoadDemo={handleLoadDemo}
        />
      ) : (
        <main className="flex-1 min-h-0 overflow-y-auto scrollbar-none max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-5 w-full space-y-5">
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
                    <div className="absolute top-3 inset-x-3 sm:top-4 sm:inset-x-4 flex items-center justify-between font-mono text-[10px] text-white">
                      <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-[2px] border border-white/15 tracking-widest uppercase text-[#FFF0CA] font-bold">
                        {currentBooking.roomNumber || 'Suite 301'} &bull; 210 m²
                      </span>
                      <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-[2px] border border-white/15 text-slate-300 tracking-wider">
                        {currentBooking.checkIn} – {currentBooking.checkOut}
                      </span>
                    </div>

                    {/* Bottom Digital Key Trigger */}
                    <div className="absolute bottom-4 inset-x-4 sm:bottom-5 sm:inset-x-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                      <div>
                        <span className="text-[9px] font-mono tracking-[0.25em] text-amber-400 uppercase block font-bold">
                          CONTACTLESS DIGITAL NFC PASS
                        </span>
                        <h2 className="font-serif-grand text-xl sm:text-2xl text-white block mt-0.5">
                          {currentBooking.residence?.name || 'The Horizon Penthouse'}
                        </h2>
                      </div>

                      <button
                        type="button"
                        onClick={handleTriggerDigitalKey}
                        disabled={isKeyUnlocking}
                        className={`touch-target px-5 py-3 font-mono text-xs font-bold uppercase tracking-widest rounded-full shadow-2xl flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 active:scale-95 ${
                          isKeyUnlocking
                            ? 'bg-amber-400 text-slate-950 scale-102 ring-4 ring-amber-300/40'
                            : 'bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-slate-950 hover:brightness-105'
                        }`}
                      >
                        <span className="text-sm">{isKeyUnlocking ? '⚙️' : '🔑'}</span>
                        <span>{isKeyUnlocking ? 'Disengaging Lock...' : 'Tap to Unlock Door'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Key Unlock Feedback Toast */}
                  {keyUnlockedToast && (
                    <div className="p-3 bg-emerald-950 text-emerald-200 border border-emerald-800 rounded-[2px] font-mono text-xs flex items-center justify-between shadow-md animate-fade-in">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span>Suite 301 lock disengaged. Welcome inside, {currentBooking.guestName}.</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 uppercase font-bold">
                        UNLOCKED (15S)
                      </span>
                    </div>
                  )}
                </div>

                {/* Right: In-Room Amenities & Tactile Controls */}
                <div className="lg:col-span-5 space-y-3.5">
                  <div>
                    <span className="text-[9px] font-mono tracking-[0.25em] font-bold text-slate-400 uppercase block">
                      IN-RESIDENCE CREDENTIALS
                    </span>
                    <h3 className="type-h2 text-xl sm:text-2xl text-slate-900 mt-0.5">
                      Suite Controls &amp; Valet
                    </h3>
                  </div>

                  {/* 3 Metric Control Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {/* Wi-Fi Card */}
                    <div className="p-3 bg-white border border-slate-200/90 rounded-[2px] space-y-1 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">WI-FI</span>
                        <button
                          type="button"
                          onClick={handleCopyWifi}
                          className="text-[9px] font-mono text-emerald-900 uppercase font-bold hover:underline cursor-pointer"
                        >
                          {wifiCopied ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-900 block truncate">
                        Habitas_Guest
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono block">Pass: pacific2026</span>
                    </div>

                    {/* Climate Card */}
                    <div className="p-3 bg-white border border-slate-200/90 rounded-[2px] space-y-1 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">CLIMATE</span>
                        <button
                          type="button"
                          onClick={() => setClimateMode((prev) => (prev === 'ocean' ? 'cedar' : 'ocean'))}
                          className="text-[9px] font-mono text-slate-900 font-bold hover:underline cursor-pointer"
                        >
                          Toggle
                        </button>
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-900 block">
                        {climateMode === 'ocean' ? '21°C • Ocean' : '24°C • Cedar'}
                      </span>
                      <span className="text-[10px] text-emerald-800 font-mono block">Automated</span>
                    </div>

                    {/* Valet Bay Card */}
                    <div className="p-3 bg-white border border-slate-200/90 rounded-[2px] space-y-1 shadow-xs">
                      <span className="text-[9px] font-mono text-slate-400 uppercase block font-bold">VALET</span>
                      <span className="font-mono text-xs font-bold text-slate-900 block">
                        Bay #301
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono block">Subterranean Lift</span>
                    </div>
                  </div>

                  {/* Private Butler & Residence Features */}
                  <div className="p-4 bg-white border border-slate-200/90 rounded-[2px] space-y-2.5 shadow-xs text-xs text-slate-600">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div>
                        <span className="font-bold text-slate-900 block">Private Butler on Duty</span>
                        <span className="text-[11px] text-slate-500 font-mono">Tariq J. &bull; In-House</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRequestService({
                          id: 'butler-call',
                          title: 'Direct Butler Room Consultation',
                          price: 0,
                          category: 'Front Desk',
                        })}
                        className="touch-target px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-900 font-mono text-[10px] uppercase font-bold rounded-[2px] transition-colors cursor-pointer"
                      >
                        Request Butler &rarr;
                      </button>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="font-medium text-slate-800">Private Oceanfront Pool</span>
                      <span className="font-mono text-emerald-900 font-semibold text-[11px]">Heated &bull; 28°C</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-800">Reservation Reference</span>
                      <span className="font-mono text-slate-900 font-bold text-[11px]">{currentBooking.bookingRef}</span>
                    </div>
                  </div>

                  {/* Quick Housekeeping Triggers */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono tracking-wider font-bold text-slate-400 uppercase block">
                      QUICK REQUESTS &bull; 1-TOUCH DISPATCH
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleRequestService({
                          id: 'linen-quick',
                          title: 'Fresh Egyptian Linens & Pillow Refresh',
                          price: 0,
                          category: 'Housekeeping',
                        })}
                        className="touch-target p-3 bg-white border border-slate-200 hover:border-slate-900 rounded-[2px] text-left font-mono text-xs transition-all cursor-pointer active:scale-95 shadow-xs flex items-center gap-2"
                      >
                        <span className="text-base">🛏️</span>
                        <div>
                          <span className="font-bold text-slate-900 block text-[11px]">Fresh Linens</span>
                          <span className="text-[9px] text-slate-500">Complimentary</span>
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
                        className="touch-target p-3 bg-white border border-slate-200 hover:border-slate-900 rounded-[2px] text-left font-mono text-xs transition-all cursor-pointer active:scale-95 shadow-xs flex items-center gap-2"
                      >
                        <span className="text-base">🕯️</span>
                        <div>
                          <span className="font-bold text-slate-900 block text-[11px]">Turn-Down Setup</span>
                          <span className="text-[9px] text-slate-500">Cedar Mist &bull; Free</span>
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
                  Served in {currentBooking.roomNumber || 'Suite 301'} &bull; Charges post to active folio
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
                          {isOrdered ? 'Added to Active Bill ✓' : 'Order to Suite 301 &rarr;'}
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
                        {isOrdered ? 'Service Dispatched ✓' : 'Request Service &rarr;'}
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
                        {isOrdered ? 'Reserved & Posted ✓' : 'Reserve Experience &rarr;'}
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
                  className="touch-target px-5 py-2.5 bg-[#D4AF37] text-slate-950 font-mono text-xs font-bold uppercase tracking-wider rounded-full hover:bg-amber-300 transition-colors shrink-0"
                >
                  Call Concierge Desk &rarr;
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
                    BILLING &amp; FOLIO
                  </span>
                  <h2 className="font-serif-grand text-2xl sm:text-3xl text-slate-900 mt-0.5">
                    Live Stay Folio &amp; Invoice
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsInvoiceOpen(true)}
                    className="touch-target px-3.5 py-2 bg-white border border-slate-300 hover:border-slate-900 text-slate-900 font-mono text-xs uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer"
                  >
                    Preview &amp; Print Invoice &rarr;
                  </button>
                  <button
                    type="button"
                    onClick={handleRequestCheckout}
                    className="touch-target px-4 py-2 bg-slate-900 hover:bg-slate-800 text-[#FFF0CA] font-mono text-xs uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer shadow-sm active:scale-95"
                  >
                    Request Express Checkout &rarr;
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
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-slate-400 uppercase">
                      GUEST SATISFACTION
                    </span>
                    <h3 className="font-serif-grand text-xl text-slate-900 mt-0.5">
                      Rate Your Stay with HABITAS
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    GUEST FEEDBACK
                  </span>
                </div>

                {reviewSubmitted ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-[2px] text-center space-y-1">
                    <span className="font-serif-grand text-lg block">Thank You, {currentBooking.guestName}</span>
                    <p className="text-xs">Your rating and feedback have been shared directly with the General Manager.</p>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      setReviewSubmitted(true)
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
                      className="touch-target px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-[#FFF0CA] font-mono text-xs uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer"
                    >
                      Submit Stay Feedback &rarr;
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </main>
      )}

      {/* ============================================================== */}
      {/* 3. ULTRA-MINIMAL GUEST FOOTER                                  */}
      {/* ============================================================== */}
      <footer className="shrink-0 border-t border-slate-200/60 bg-[#FAF8F5] py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2 text-[10px] font-mono text-slate-500">
          <span>&copy; {new Date().getFullYear()} HABITAS HOTEL &bull; ALL RIGHTS RESERVED</span>
          <div className="flex items-center gap-4">
            <span>Concierge: +92 300 8921455</span>
            <span>Valet Bay #301</span>
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
