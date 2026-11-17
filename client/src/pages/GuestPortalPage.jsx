import React, { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import { RESIDENCES } from '../data/residences'
import { useAuth } from '../context/AuthContext'
import { useHotelData } from '../context/HotelDataContext'
import BookingLookup from '../components/stay/BookingLookup'
import DigitalKey from '../components/stay/DigitalKey'
import RoomServiceMenu from '../components/stay/RoomServiceMenu'
import ReviewForm from '../components/stay/ReviewForm'
import StayBill from '../components/stay/StayBill'

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

export default function GuestPortalPage() {
  const [searchParams] = useSearchParams()
  const initialRef = searchParams.get('ref') || ''
  const { currentUser, logout } = useAuth()
  const { requestGuestService } = useHotelData()

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

  // Financial Calculations (Doc FR-45 & FR-46)
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

  // Order In-Stay Service (Doc FR-57) & Sync with Housekeeping!
  const handleRequestService = (service) => {
    const alreadyOrdered = orderedServices.some((s) => s.id === service.id)
    if (alreadyOrdered) {
      setServiceFeedbackNotice(`"${service.title}" is already requested and on your active bill.`)
      setTimeout(() => setServiceFeedbackNotice(''), 3500)
      return
    }

    const newItem = {
      ...service,
      time: 'Just now',
    }

    setOrderedServices((prev) => [...prev, newItem])

    // Dispatches live request to Housekeeping terminal & adds to folio!
    requestGuestService(
      currentBooking.roomNumber || 'Suite 301',
      currentBooking.guestName,
      service.title,
      service.price,
      service.category
    )

    setServiceFeedbackNotice(`Request dispatched to estate concierge: "${service.title}" added to folio.`)
    setTimeout(() => setServiceFeedbackNotice(''), 4500)
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 font-sans-clean antialiased selection:bg-emerald-100 selection:text-emerald-950">
      {/* 1. TOP HEADER */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-slate-200/60 px-4 sm:px-12 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 text-xs font-mono tracking-wider text-slate-600 hover:text-slate-950 uppercase transition-colors"
        >
          <span>&larr;</span>
          <span className="hidden sm:inline">Return to </span>
          <span>Overview</span>
        </Link>

        <BrandLogo variant="wordmark" theme="dark" size="sm" />

        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="hidden md:inline text-slate-500 uppercase tracking-wider">
                Guest: <strong className="text-slate-900">{currentUser.name}</strong>
              </span>
              <button
                type="button"
                onClick={logout}
                className="px-2 py-1 bg-slate-200/70 hover:bg-slate-300 text-slate-800 uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer text-[9px]"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/login?redirect=/my-stay"
              className="text-[10px] font-mono text-emerald-900 hover:text-emerald-950 uppercase tracking-widest font-bold underline transition-colors"
            >
              Sign In
            </Link>
          )}

          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-2 border-l border-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="hidden sm:inline">Guest Portal</span>
          </div>
        </div>
      </header>

      {/* 2. GATEWAY OR ACTIVE STAY */}
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
        <main className="max-w-7xl mx-auto px-6 sm:px-12 py-10 lg:py-14 space-y-12">
          {/* Top Stay Ribbon */}
          <div className="border-b border-slate-200/80 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-950 font-mono text-[9px] font-bold uppercase tracking-wider rounded-full">
                  RESERVATION CONFIRMED
                </span>
                <span className="font-mono text-xs text-slate-500 tracking-wider">
                  REF: {currentBooking.bookingRef}
                </span>
              </div>
              <h1 className="font-serif-grand text-3xl sm:text-5xl font-normal text-slate-900 tracking-tight">
                Welcome, {currentBooking.guestName}.
              </h1>
              <p className="text-xs text-slate-600 font-mono tracking-wider">
                {currentBooking.residence?.name} &bull; {currentBooking.roomNumber} &bull; {currentBooking.checkIn} to {currentBooking.checkOut}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsUnlocked(false)}
                className="px-3 py-2 text-xs font-mono text-slate-500 hover:text-slate-900 uppercase border border-slate-200 hover:border-slate-400 rounded-[2px] transition-colors cursor-pointer"
              >
                Switch Stay
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#0E1201] text-[#FFF0CA] font-mono text-xs uppercase tracking-wider font-bold rounded-[2px] hover:bg-slate-900 transition-colors cursor-pointer"
              >
                Print Invoice &darr;
              </button>
            </div>
          </div>

          {/* Feedback Toast Notification */}
          {serviceFeedbackNotice && (
            <div className="p-4 bg-emerald-950 text-emerald-200 text-xs font-mono flex items-center justify-between rounded-[2px] shadow-lg animate-fade-in border border-emerald-800">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{serviceFeedbackNotice}</span>
              </div>
              <span className="text-[10px] text-emerald-400 uppercase tracking-widest">LIVE DISPATCH</span>
            </div>
          )}

          {/* 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-7 space-y-12">
              <RoomServiceMenu
                orderedServices={orderedServices}
                onRequestService={handleRequestService}
              />

              <ReviewForm guestName={currentBooking.guestName} />
            </div>

            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-8">
              <DigitalKey currentBooking={currentBooking} />

              <StayBill
                currentBooking={currentBooking}
                orderedServices={orderedServices}
                financials={financials}
                onPrintFolio={() => window.print()}
              />
            </div>
          </div>
        </main>
      )}
    </div>
  )
}
