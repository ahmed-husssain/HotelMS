import React, { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import { RESIDENCES } from '../data/residences'

// Default Demo Stay Record (Suite 301 - Dr. Tariq Khan)
const DEMO_BOOKING = {
  bookingRef: 'TH-301-9041',
  residence: RESIDENCES[0], // The Horizon Penthouse
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

// Available In-Stay Guest Services Catalog (Doc FR-57)
const AVAILABLE_SERVICES = [
  {
    id: 'dining-1',
    category: 'Dining',
    title: 'Coastal Line-Catch Seafood Tasting Dinner',
    description: 'Fresh Arabian Sea lobster & black pomfret prepared in-suite by our private executive chef.',
    price: 15000,
  },
  {
    id: 'dining-2',
    category: 'Dining',
    title: 'Estate High Tea & Artisanal Cedar Brew',
    description: 'Fresh organic pastries, estate-grown herbal infusions, and Japanese matcha served in-villa.',
    price: 4500,
  },
  {
    id: 'comfort-1',
    category: 'Housekeeping',
    title: 'Fresh Egyptian Linen & Feather Pillow Refresh',
    description: 'Complimentary mid-stay linen change with choice of lavender or cedar aromatic mist.',
    price: 0,
  },
  {
    id: 'comfort-2',
    category: 'Housekeeping',
    title: 'Evening Cedar Spa & Aromatic Bath Setup',
    description: 'Organic magnesium salts, fresh jasmine blossoms, and warmed cedar bath oils prepared in your spa tub.',
    price: 6000,
  },
  {
    id: 'transfer-1',
    category: 'Transport',
    title: 'Chauffeur Executive Sedan Airport Transfer',
    description: 'Private transfer from Karachi Jinnah International Airport directly to the estate valet.',
    price: 12000,
  },
]

export default function MyStayPage() {
  const [searchParams] = useSearchParams()
  const initialRef = searchParams.get('ref') || ''

  // Portal Authentication State
  const [bookingCode, setBookingCode] = useState(initialRef || 'TH-301-9041')
  const [guestEmailInput, setGuestEmailInput] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(Boolean(initialRef))
  const [searchError, setSearchError] = useState('')

  // Active Stay State
  const [currentBooking, setCurrentBooking] = useState(DEMO_BOOKING)
  const [orderedServices, setOrderedServices] = useState(DEMO_BOOKING.initialServices)
  const [serviceFeedbackNotice, setServiceFeedbackNotice] = useState('')

  // Review & Ratings State (Doc FR-56)
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [selectedTags, setSelectedTags] = useState(['Suite Comfort', 'Privacy & Seclusion'])
  const [reviewComment, setReviewComment] = useState('')
  const [reviewSubmitted, setReviewSubmitted] = useState(false)

  // Financial Calculations (Doc FR-45 & FR-46)
  const financials = useMemo(() => {
    const roomRate = currentBooking.residence.nightlyRate
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
      // Load matched booking (defaults to Suite 301 demo)
      setIsUnlocked(true)
    } else {
      setSearchError('Reservation reference not found. Try demo reference TH-301-9041.')
    }
  }

  // Load Demo Record
  const handleLoadDemo = () => {
    setBookingCode('TH-301-9041')
    setGuestEmailInput('tariq.khan@luxury.pk')
    setCurrentBooking(DEMO_BOOKING)
    setIsUnlocked(true)
    setSearchError('')
  }

  // Order In-Stay Service (Doc FR-57)
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
    setServiceFeedbackNotice(`Request dispatched to estate concierge: "${service.title}" has been added to your stay folio.`)
    setTimeout(() => setServiceFeedbackNotice(''), 4500)
  }

  // Toggle Review Tag
  const toggleReviewTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  // Submit Feedback (Doc FR-56)
  const handleReviewSubmit = (e) => {
    e.preventDefault()
    setReviewSubmitted(true)
  }

  // Print Tax Invoice / Folio
  const handlePrintFolio = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 font-sans-clean antialiased selection:bg-emerald-100 selection:text-emerald-950">
      {/* ============================================================== */}
      {/* 1. TOP HEADER (Consistent with Habitas Editorial Style) */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-slate-200/60 px-6 sm:px-12 py-5 flex items-center justify-between">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 text-xs font-mono tracking-wider text-slate-600 hover:text-slate-950 uppercase transition-colors"
        >
          <span className="transition-transform group-hover:-translate-x-1">&larr;</span>
          <span>Return to Overview</span>
        </Link>

        {/* Center Brand Wordmark */}
        <BrandLogo variant="wordmark" theme="dark" size="sm" />

        {/* Portal Tag */}
        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          <span>Guest Portal</span>
          <span className="hidden sm:inline">&bull; Sindh Coast</span>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. GATEWAY VIEW: LOOKUP CARD (When Portal is Locked) */}
      {/* ============================================================== */}
      {!isUnlocked ? (
        <main className="max-w-xl mx-auto px-6 py-20 sm:py-28 text-center space-y-8">
          <div className="space-y-3">
            <span className="text-[10px] font-mono tracking-[0.3em] font-extrabold text-emerald-900 uppercase block">
              GUEST SELF-SERVICE PORTAL
            </span>
            <h1 className="font-serif-grand text-3xl sm:text-5xl font-light text-slate-900 tracking-tight">
              Access Your Stay.
            </h1>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Enter your booking reference code or email address to view your digital key, request in-room dining, manage services, and download your tax invoice.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 shadow-xl p-8 rounded-[2px] text-left space-y-6">
            <form onSubmit={handleLookupSubmit} className="space-y-5">
              <div>
                <label className="text-[10px] font-mono tracking-wider font-semibold text-slate-400 uppercase block mb-1.5">
                  Booking Reference Code
                </label>
                <input
                  type="text"
                  required
                  value={bookingCode}
                  onChange={(e) => setBookingCode(e.target.value)}
                  placeholder="e.g. TH-301-9041"
                  className="w-full py-2.5 px-3 bg-slate-50/70 border border-slate-300 focus:border-slate-900 text-sm font-mono uppercase tracking-wider text-slate-900 focus:outline-none transition-colors rounded-[2px]"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono tracking-wider font-semibold text-slate-400 uppercase block mb-1.5">
                  Guest Contact Email (Optional)
                </label>
                <input
                  type="email"
                  value={guestEmailInput}
                  onChange={(e) => setGuestEmailInput(e.target.value)}
                  placeholder="e.g. tariq.khan@luxury.pk"
                  className="w-full py-2.5 px-3 bg-slate-50/70 border border-slate-300 focus:border-slate-900 text-sm text-slate-900 focus:outline-none transition-colors rounded-[2px]"
                />
              </div>

              {searchError && (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-[2px]">
                  {searchError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] font-mono text-xs font-bold uppercase tracking-[0.2em] rounded-[2px] transition-all cursor-pointer shadow-md active:scale-[0.98]"
              >
                Unlock My Stay &rarr;
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-mono">
              <span className="text-[10px]">Aptech Evaluation Demo:</span>
              <button
                type="button"
                onClick={handleLoadDemo}
                className="px-3 py-1.5 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 rounded-[2px] border border-emerald-200/80 text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer"
              >
                1-Click Load: Suite 301 Demo &rarr;
              </button>
            </div>
          </div>
        </main>
      ) : (
        /* ============================================================== */
        /* 3. ACTIVE STAY DOSSIER (2-Column Luxury Workspace) */
        /* ============================================================== */
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
                {currentBooking.residence.name} &bull; Suite {currentBooking.residence.roomNumber} &bull; {currentBooking.checkIn} to {currentBooking.checkOut}
              </p>
            </div>

            {/* Quick Action Badges */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsUnlocked(false)}
                className="px-3 py-2 text-xs font-mono text-slate-500 hover:text-slate-900 uppercase border border-slate-200 hover:border-slate-400 rounded-[2px] transition-colors cursor-pointer"
              >
                Switch Reservation
              </button>
              <button
                type="button"
                onClick={handlePrintFolio}
                className="px-4 py-2 bg-[#0E1201] text-[#FFF0CA] font-mono text-xs uppercase tracking-wider font-bold rounded-[2px] hover:bg-slate-900 transition-colors cursor-pointer flex items-center gap-2"
              >
                <span>Print Invoice</span>
                <span>&darr;</span>
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
            
            {/* ============================================================ */}
            {/* LEFT COLUMN: STAY OVERVIEW, IN-STAY SERVICES & FEEDBACK (7 cols) */}
            {/* ============================================================ */}
            <div className="lg:col-span-7 space-y-12">
              
              {/* Section 1: Suite Overview & Arrival Countdown */}
              <section className="bg-white border border-slate-200/90 rounded-[2px] p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-slate-400 uppercase">
                    01 &bull; SUITE &amp; ARRIVAL STATUS
                  </span>
                  <span className="text-[10px] font-mono text-emerald-800 font-bold uppercase tracking-wider">
                    ● 6 Days to Arrival
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  <div className="sm:col-span-5 aspect-[4/3] rounded-[2px] overflow-hidden bg-slate-900">
                    <img
                      src={currentBooking.residence.gallery[0]?.url}
                      alt={currentBooking.residence.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="sm:col-span-7 space-y-3">
                    <div>
                      <span className="text-[9px] font-mono tracking-widest text-emerald-900 font-extrabold uppercase">
                        {currentBooking.residence.tier}
                      </span>
                      <h3 className="font-serif-grand text-2xl text-slate-900">
                        {currentBooking.residence.name}
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs pt-1 font-mono">
                      <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-[2px]">
                        <span className="block text-[8px] text-slate-400 uppercase font-bold">CHECK-IN</span>
                        <span className="text-slate-900 font-bold">{currentBooking.checkIn}</span>
                        <span className="block text-[9px] text-slate-500">{currentBooking.checkInTime}</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-[2px]">
                        <span className="block text-[8px] text-slate-400 uppercase font-bold">CHECK-OUT</span>
                        <span className="text-slate-900 font-bold">{currentBooking.checkOut}</span>
                        <span className="block text-[9px] text-slate-500">{currentBooking.checkOutTime}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Private Arrival Instructions */}
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-[2px] text-xs space-y-1.5 text-slate-600 font-mono">
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold block">
                    VALET &amp; RESIDENCE ARRIVAL DIRECTIONS:
                  </span>
                  <p className="text-[11px] leading-relaxed">
                    Arrive via Coastal Highway KM-48. Scan your Digital QR Key at the South Security Gate. Private subterranean valet will direct your vehicle to designated Parking Bay #301 with direct private elevator lift access to your penthouse.
                  </p>
                </div>
              </section>

              {/* Section 2: In-Stay Additional Guest Services (Doc FR-57) */}
              <section className="space-y-6">
                <div className="border-b border-slate-200/80 pb-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold tracking-[0.2em] text-slate-900 uppercase">
                      02 &bull; In-Stay Guest Services
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">
                      Request room service, extra housekeeping, or private transport directly to your suite
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-800 uppercase font-semibold">
                    Doc FR-57 Compliant
                  </span>
                </div>

                <div className="space-y-3">
                  {AVAILABLE_SERVICES.map((service) => {
                    const isAlreadyAdded = orderedServices.some((s) => s.id === service.id)

                    return (
                      <div
                        key={service.id}
                        className="p-4 bg-white border border-slate-200/90 rounded-[2px] hover:border-slate-400 transition-all shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1 max-w-md">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[8px] font-mono font-bold uppercase rounded">
                              {service.category}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900">
                              {service.title}
                            </h4>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-relaxed">
                            {service.description}
                          </p>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                          <span className="font-mono text-xs font-bold text-slate-900">
                            {service.price === 0 ? 'COMPLIMENTARY' : `+ PKR ${service.price.toLocaleString()}`}
                          </span>

                          <button
                            type="button"
                            disabled={isAlreadyAdded}
                            onClick={() => handleRequestService(service)}
                            className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider font-bold rounded-[2px] transition-all cursor-pointer ${
                              isAlreadyAdded
                                ? 'bg-emerald-100 text-emerald-950 cursor-default'
                                : 'bg-slate-900 text-white hover:bg-emerald-950 active:scale-95'
                            }`}
                          >
                            {isAlreadyAdded ? '✓ Requested' : '+ Request Service'}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>

              {/* Section 3: Guest Feedback & Reviews (Doc FR-56) */}
              <section className="bg-white border border-slate-200/90 rounded-[2px] p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-slate-400 uppercase">
                      03 &bull; GUEST EXPERIENCE FEEDBACK
                    </span>
                    <h3 className="font-serif-grand text-xl text-slate-900">
                      Rate Your Stay with HABITAS
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-800 uppercase font-semibold">
                    Doc FR-56
                  </span>
                </div>

                {reviewSubmitted ? (
                  <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-[2px] text-center space-y-2">
                    <span className="text-emerald-700 font-serif-grand text-2xl block">Thank You, {currentBooking.guestName}</span>
                    <p className="text-xs text-emerald-900 leading-relaxed">
                      Your feedback and 5-star rating have been recorded and shared directly with the Estate General Manager and Executive Concierge.
                    </p>
                    <button
                      type="button"
                      onClick={() => setReviewSubmitted(false)}
                      className="mt-2 text-[10px] font-mono uppercase text-emerald-800 underline cursor-pointer"
                    >
                      Edit Review
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-5">
                    {/* Interactive 5-Star Selector */}
                    <div>
                      <span className="text-[10px] font-mono tracking-wider font-semibold text-slate-400 uppercase block mb-2">
                        Overall Rating
                      </span>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                            className="p-1 text-2xl transition-transform hover:scale-110 cursor-pointer focus:outline-none"
                            aria-label={`${star} Stars`}
                          >
                            <span
                              className={`${
                                (hoverRating || rating) >= star
                                  ? 'text-amber-500'
                                  : 'text-slate-300'
                              } transition-colors`}
                            >
                              &#9733;
                            </span>
                          </button>
                        ))}
                        <span className="ml-3 font-mono text-xs font-bold text-slate-700">
                          {rating} / 5 Stars
                        </span>
                      </div>
                    </div>

                    {/* Feedback Tags */}
                    <div>
                      <span className="text-[10px] font-mono tracking-wider font-semibold text-slate-400 uppercase block mb-2">
                        Highlights of Your Stay (Select all that apply)
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          'Suite Comfort',
                          'Privacy & Seclusion',
                          'Dining & Cuisine',
                          'Cedar Spa Bath',
                          'Concierge Service',
                          'Valet & Helipad',
                        ].map((tag) => {
                          const isSelected = selectedTags.includes(tag)
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => toggleReviewTag(tag)}
                              className={`px-3 py-1.5 text-xs font-mono rounded-[2px] border transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-slate-900 text-white border-slate-900 font-bold'
                                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-400'
                              }`}
                            >
                              {tag}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Review Comments */}
                    <div>
                      <label className="text-[10px] font-mono tracking-wider font-semibold text-slate-400 uppercase block mb-1.5">
                        Personal Notes or Suggestions
                      </label>
                      <textarea
                        rows="3"
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="The ocean views and quiet architecture made this an unforgettable stay..."
                        className="w-full p-3 bg-slate-50/70 border border-slate-300 focus:border-slate-900 text-xs text-slate-900 focus:outline-none transition-colors rounded-[2px]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] font-mono text-xs font-bold uppercase tracking-[0.2em] rounded-[2px] transition-colors cursor-pointer shadow-sm active:scale-98"
                    >
                      Submit Guest Review &rarr;
                    </button>
                  </form>
                )}
              </section>

            </div>

            {/* ============================================================ */}
            {/* RIGHT COLUMN: DIGITAL QR KEY & LIVE FOLIO INVOICE (5 cols) */}
            {/* ============================================================ */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-8">
              
              {/* Card 1: Contactless Digital Room Key & QR Pass */}
              <div className="bg-[#0E1201] text-[#FFF0CA] border border-slate-800 p-7 rounded-[2px] shadow-xl space-y-6 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[9px] font-mono tracking-[0.25em] text-amber-400 uppercase block">
                      CONTACTLESS DIGITAL PASS
                    </span>
                    <h3 className="font-cinzel text-xl font-bold tracking-widest text-[#FAF8F5] mt-0.5">
                      SUITE {currentBooking.residence.roomNumber}
                    </h3>
                  </div>
                  <BrandLogo variant="emblem" theme="light" size="sm" to={null} />
                </div>

                {/* High-Contrast SVG QR Pass Simulation */}
                <div className="flex flex-col items-center justify-center p-5 bg-white rounded-[2px] text-slate-900 space-y-2">
                  <svg viewBox="0 0 120 120" className="w-32 h-32" fill="none">
                    <rect width="120" height="120" fill="white" />
                    {/* Corner Position Targets */}
                    <rect x="10" y="10" width="30" height="30" stroke="#0E1201" strokeWidth="6" fill="white" />
                    <rect x="18" y="18" width="14" height="14" fill="#0E1201" />
                    
                    <rect x="80" y="10" width="30" height="30" stroke="#0E1201" strokeWidth="6" fill="white" />
                    <rect x="88" y="18" width="14" height="14" fill="#0E1201" />

                    <rect x="10" y="80" width="30" height="30" stroke="#0E1201" strokeWidth="6" fill="white" />
                    <rect x="18" y="88" width="14" height="14" fill="#0E1201" />

                    {/* Data Matrix Dots */}
                    <rect x="48" y="14" width="6" height="6" fill="#0E1201" />
                    <rect x="62" y="14" width="6" height="6" fill="#0E1201" />
                    <rect x="48" y="28" width="12" height="6" fill="#0E1201" />
                    <rect x="52" y="48" width="18" height="18" fill="#0E1201" />
                    <rect x="18" y="52" width="12" height="6" fill="#0E1201" />
                    <rect x="84" y="52" width="16" height="6" fill="#0E1201" />
                    <rect x="48" y="80" width="10" height="8" fill="#0E1201" />
                    <rect x="66" y="84" width="12" height="6" fill="#0E1201" />
                    <rect x="84" y="80" width="8" height="12" fill="#0E1201" />
                    <rect x="98" y="94" width="10" height="10" fill="#0E1201" />
                  </svg>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500 font-bold">
                    REF: {currentBooking.bookingRef}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs font-mono text-slate-300 pt-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Primary Guest:</span>
                    <span className="font-bold text-[#FAF8F5]">{currentBooking.guestName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Access Tier:</span>
                    <span className="text-amber-400">UNRESTRICTED RESIDENTIAL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Valet Bay:</span>
                    <span>Bay #301 (Subterranean)</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Live Invoicing & Billing Breakdown (Doc FR-45 & FR-46) */}
              <div className="bg-white border border-slate-200/90 rounded-[2px] shadow-lg p-7 space-y-6">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-mono font-bold tracking-[0.2em] text-slate-400 uppercase block">
                      STATEMENT OF CHARGES
                    </span>
                    <h3 className="font-serif-grand text-xl text-slate-900">
                      Live Guest Folio
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-900 font-mono text-[9px] font-bold rounded">
                    SAFEPAY VERIFIED
                  </span>
                </div>

                {/* Detailed Line-Item Accrual */}
                <div className="space-y-3 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>
                      {currentBooking.nights} Nights &times; PKR {currentBooking.residence.nightlyRate.toLocaleString()}
                    </span>
                    <span className="font-mono font-medium text-slate-900">
                      PKR {financials.roomSubtotal.toLocaleString()}
                    </span>
                  </div>

                  {/* Render Requested In-Stay Services */}
                  {orderedServices.map((service, index) => (
                    <div key={index} className="flex justify-between text-slate-800 pl-2 border-l-2 border-emerald-800/40">
                      <span className="truncate pr-2">{service.title}</span>
                      <span className="font-mono shrink-0 font-medium text-slate-900">
                        {service.price === 0 ? 'FREE' : `+ PKR ${service.price.toLocaleString()}`}
                      </span>
                    </div>
                  ))}

                  <div className="flex justify-between">
                    <span>Sindh Sales Tax (13%)</span>
                    <span className="font-mono font-medium text-slate-900">
                      PKR {financials.sindhTax.toLocaleString()}
                    </span>
                  </div>

                  {/* Total Valuation */}
                  <div className="flex justify-between text-base font-bold text-slate-900 pt-3 border-t border-slate-200/80">
                    <span>Total Stay Amount</span>
                    <span className="font-mono">PKR {financials.totalStayAmount.toLocaleString()}</span>
                  </div>

                  {/* Paid Deposit & Remaining Balance */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex justify-between text-emerald-900 font-bold">
                      <span>30% Deposit Paid Online:</span>
                      <span className="font-mono">- PKR {financials.advancePaid.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-xs font-extrabold text-slate-900 block">
                          REMAINING FRONT-DESK BALANCE
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Due at checkout (Cash / Card POS)
                        </span>
                      </div>
                      <span className="font-mono text-base font-extrabold text-amber-900">
                        PKR {financials.balanceDue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Print Invoice Action Button */}
                <button
                  type="button"
                  onClick={handlePrintFolio}
                  className="w-full py-3.5 bg-slate-900 hover:bg-emerald-950 text-white font-mono text-xs uppercase tracking-wider font-bold rounded-[2px] transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Download Official Tax Invoice</span>
                  <span>&darr;</span>
                </button>
              </div>

            </div>

          </div>
        </main>
      )}
    </div>
  )
}
