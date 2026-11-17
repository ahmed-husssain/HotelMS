import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import { RESIDENCES } from '../data/residences'

/**
 * ReservationPage — The Haven Dedicated Luxury Reservation Monograph (/reserve)
 *
 * ARCHITECTURAL VIVA DEFENSE SUMMARY:
 * 1. Infinite Scalability:
 *    Unlike a cramped 450px side drawer that cuts off on laptops, this 2-column editorial
 *    layout provides unlimited breathing room for dates, guest dossier, and concierge add-ons
 *    on the left, while maintaining a permanently pinned live ledger on the right.
 *
 * 2. Zero-Trust Financial Formula (PRD FR-1.3):
 *    - Subtotal = (Nightly Rate * Nights) + Sum(Selected Add-ons)
 *    - Sindh Sales Tax (13%) = round(Subtotal * 0.13)
 *    - Total Stay Valuation = Subtotal + Tax
 *    - 30% Online Advance Deposit = round(Total * 0.3)
 *    - 70% Front-Desk Balance = Total - Advance
 *
 * 3. Atomic 5-Minute Inventory Hold (PRD FR-1.4 & FR-1.5):
 *    Simulates a pessimistic lock session. Room is held exclusively for 300 seconds.
 */

// Available Bespoke Enhancements (Incidental concierge add-ons)
const CONCIERGE_ADDONS = [
  {
    id: 'helipad',
    title: 'Private Coastal Helipad Transfer',
    description: 'Direct VIP pickup from Jinnah Int. Airport to The Haven Private Heliport',
    price: 25000,
  },
  {
    id: 'onsen_spa',
    title: 'Hinoki Cedar Onsen Hydrotherapy Session',
    description: '90-minute couple thermal mineral soak and restorative botanic body massage',
    price: 18000,
  },
  {
    id: 'tasting_menu',
    title: 'Zero-Kilometer Organic Tasting Menu',
    description: 'Private 7-course seasonal seaside dinner curated by Executive Chef',
    price: 15000,
  },
]

export default function ReservationPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  // 1. Resolve Active Suite from Query Param (?room=301)
  const roomParam = searchParams.get('room')
  const selectedResidence = useMemo(() => {
    const match = RESIDENCES.find((r) => r.roomNumber === roomParam)
    return match || RESIDENCES[0]
  }, [roomParam])

  // 2. Stay Configuration State
  const [nights, setNights] = useState(4)
  const [guestCount, setGuestCount] = useState(2)
  const [selectedAddons, setSelectedAddons] = useState(['helipad'])

  // 3. Guest Information State
  const [guestDossier, setGuestDossier] = useState({
    fullName: 'Ahmed Khan',
    email: 'ahmed.khan@havenresorts.pk',
    phone: '+92 300 1234567',
    identificationNumber: '42101-9876543-1',
    specialRequests: 'High-floor quiet suite preference; ocean-facing dawn arrival.',
  })

  // 4. Atomic 5-Minute Pessimistic Hold Timer (300 seconds)
  const [secondsLeft, setSecondsLeft] = useState(300)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    // Reset timer whenever a new room is selected
    setSecondsLeft(300)
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [selectedResidence.id])

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`
  }

  // 5. Toggle Concierge Add-on
  const toggleAddon = (addonId) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    )
  }

  // 6. Zero-Trust Financial Calculations
  const addonTotal = useMemo(() => {
    return selectedAddons.reduce((sum, id) => {
      const item = CONCIERGE_ADDONS.find((a) => a.id === id)
      return sum + (item ? item.price : 0)
    }, 0)
  }, [selectedAddons])

  const suiteSubtotal = selectedResidence.nightlyRate * nights
  const netSubtotal = suiteSubtotal + addonTotal
  const sindhTax = Math.round(netSubtotal * 0.13)
  const totalValuation = netSubtotal + sindhTax
  const advanceDeposit = Math.round(totalValuation * 0.3)
  const remainingBalance = totalValuation - advanceDeposit

  // 7. Handle Safepay 30% Advance Deposit Confirmation
  const handleConfirmReservation = (e) => {
    e.preventDefault()
    if (secondsLeft === 0) return

    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      const bookingData = {
        residence: selectedResidence,
        nights,
        guestCount,
        guestDossier,
        selectedAddons: CONCIERGE_ADDONS.filter((a) => selectedAddons.includes(a.id)),
        suiteSubtotal,
        addonTotal,
        sindhTax,
        total: totalValuation,
        advance: advanceDeposit,
        balance: remainingBalance,
        safepayRef: `SPF-${Math.floor(100000 + Math.random() * 900000)}`,
        bookingRef: `TH-${selectedResidence.roomNumber}-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
      }

      navigate('/confirmation', { state: { booking: bookingData } })
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 font-sans-clean antialiased selection:bg-emerald-100 selection:text-emerald-950">
      {/* ============================================================== */}
      {/* 1. MINIMAL ARCHITECTURAL TOP BAR */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-slate-200/80 px-6 sm:px-12 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 text-xs font-mono tracking-wider text-slate-600 hover:text-slate-950 uppercase transition-colors"
        >
          <span className="transition-transform group-hover:-translate-x-1">&larr;</span>
          <span>Return to Sanctuaries</span>
        </Link>

        {/* Center Brand Wordmark */}
        <BrandLogo variant="wordmark" theme="dark" size="sm" />

        {/* Security Indicator */}
        <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-900 uppercase tracking-widest bg-emerald-50/80 border border-emerald-200 px-3 py-1 rounded-[2px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          <span className="hidden sm:inline">256-Bit SSL</span>
          <span>Atomic Session</span>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. MAIN 2-COLUMN RESERVATION WORKSPACE */}
      {/* ============================================================== */}
      <main className="max-w-7xl mx-auto px-6 sm:px-12 py-10 lg:py-16">
        {/* Breadcrumb & Section Title */}
        <div className="mb-10 space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] font-bold text-emerald-900 uppercase">
            <span>RESIDENCE DOSSIER</span>
            <span>&bull;</span>
            <span>SUITE {selectedResidence.roomNumber}</span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-light text-slate-900">
            Secure Your Sanctuary
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Configure your stay parameters, select bespoke concierge enhancements, and lock your suite with an encrypted 30% advance deposit via Safepay.
          </p>

          {/* Quick Suite Switcher Pills */}
          <div className="pt-4 flex flex-wrap gap-2">
            <span className="text-[11px] font-mono text-slate-400 self-center uppercase tracking-wider mr-2">
              Select Sanctuary:
            </span>
            {RESIDENCES.map((res) => {
              const isActive = res.roomNumber === selectedResidence.roomNumber
              return (
                <button
                  key={res.id}
                  type="button"
                  onClick={() => setSearchParams({ room: res.roomNumber })}
                  className={`px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider rounded-[2px] border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0E1201] text-[#FFF0CA] border-[#0E1201] shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  Room {res.roomNumber} &bull; {res.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* 2-Column Responsive Workspace */}
        <form onSubmit={handleConfirmReservation} className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* ============================================================ */}
          {/* LEFT COLUMN: GUEST DOSSIER, DATES & ENHANCEMENTS (7 cols) */}
          {/* ============================================================ */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Step 1: Stay Dates & Capacity */}
            <section className="bg-white p-6 sm:p-8 rounded-[2px] border border-slate-200/90 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-mono font-bold tracking-[0.2em] text-emerald-950 uppercase">
                  01 &bull; STAY PARAMETERS
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase">
                  {nights} Nights Planned
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-mono font-bold text-slate-400 uppercase block mb-1.5">
                    CHECK-IN DATE
                  </label>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-[2px] text-xs font-mono text-slate-900 flex justify-between items-center">
                    <span>Nov 24, 2026</span>
                    <span className="text-slate-400">14:00 PKT</span>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-mono font-bold text-slate-400 uppercase block mb-1.5">
                    CHECK-OUT DATE
                  </label>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-[2px] text-xs font-mono text-slate-900 flex justify-between items-center">
                    <span>Nov 28, 2026</span>
                    <span className="text-slate-400">11:00 PKT</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-[9px] font-mono font-bold text-slate-400 uppercase block mb-1.5">
                    DURATION OF STAY (NIGHTS)
                  </label>
                  <select
                    value={nights}
                    onChange={(e) => setNights(Number(e.target.value))}
                    className="w-full p-3 bg-white border border-slate-300 rounded-[2px] text-xs font-mono text-slate-900 focus:outline-none focus:border-slate-900 cursor-pointer"
                  >
                    <option value={2}>2 Nights</option>
                    <option value={3}>3 Nights</option>
                    <option value={4}>4 Nights (Recommended)</option>
                    <option value={7}>7 Nights (Weekly Retreat)</option>
                    <option value={14}>14 Nights (Extended Monograph)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-mono font-bold text-slate-400 uppercase block mb-1.5">
                    REGISTERED GUEST OCCUPANCY
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full p-3 bg-white border border-slate-300 rounded-[2px] text-xs font-mono text-slate-900 focus:outline-none focus:border-slate-900 cursor-pointer"
                  >
                    <option value={1}>1 Solo Traveller</option>
                    <option value={2}>2 Adults</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4 Guests (Suite Capacity)</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Step 2: Primary Guest Dossier Form */}
            <section className="bg-white p-6 sm:p-8 rounded-[2px] border border-slate-200/90 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-mono font-bold tracking-[0.2em] text-emerald-950 uppercase">
                  02 &bull; PRIMARY GUEST DOSSIER
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase">
                  REQUIRED FOR SAFEPAY
                </span>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-mono font-bold text-slate-400 uppercase block mb-1">
                      FULL LEGAL NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={guestDossier.fullName}
                      onChange={(e) => setGuestDossier({ ...guestDossier, fullName: e.target.value })}
                      placeholder="e.g. Tariq Mansoor"
                      className="w-full p-3 bg-white border border-slate-300 rounded-[2px] text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-mono font-bold text-slate-400 uppercase block mb-1">
                      CNIC / PASSPORT ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={guestDossier.identificationNumber}
                      onChange={(e) => setGuestDossier({ ...guestDossier, identificationNumber: e.target.value })}
                      placeholder="42101-XXXXXXX-X"
                      className="w-full p-3 bg-white border border-slate-300 rounded-[2px] text-xs font-mono text-slate-900 focus:outline-none focus:border-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-mono font-bold text-slate-400 uppercase block mb-1">
                      CONTACT EMAIL *
                    </label>
                    <input
                      type="email"
                      required
                      value={guestDossier.email}
                      onChange={(e) => setGuestDossier({ ...guestDossier, email: e.target.value })}
                      placeholder="guest@domain.com"
                      className="w-full p-3 bg-white border border-slate-300 rounded-[2px] text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-mono font-bold text-slate-400 uppercase block mb-1">
                      PHONE NUMBER *
                    </label>
                    <input
                      type="tel"
                      required
                      value={guestDossier.phone}
                      onChange={(e) => setGuestDossier({ ...guestDossier, phone: e.target.value })}
                      placeholder="+92 300 0000000"
                      className="w-full p-3 bg-white border border-slate-300 rounded-[2px] text-xs font-mono text-slate-900 focus:outline-none focus:border-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-mono font-bold text-slate-400 uppercase block mb-1">
                    SPECIAL DIETARY OR CONCIERGE REQUESTS
                  </label>
                  <textarea
                    rows={2}
                    value={guestDossier.specialRequests}
                    onChange={(e) => setGuestDossier({ ...guestDossier, specialRequests: e.target.value })}
                    placeholder="Provide any dietary restrictions or arrival preferences..."
                    className="w-full p-3 bg-white border border-slate-300 rounded-[2px] text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>
            </section>

            {/* Step 3: Curated Concierge Enhancements */}
            <section className="bg-white p-6 sm:p-8 rounded-[2px] border border-slate-200/90 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-mono font-bold tracking-[0.2em] text-emerald-950 uppercase">
                  03 &bull; BESPOKE CONCIERGE ENHANCEMENTS
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase">
                  LIVE FOLIO SYNC
                </span>
              </div>

              <div className="space-y-3">
                {CONCIERGE_ADDONS.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id)
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-4 rounded-[2px] border transition-all cursor-pointer flex items-start justify-between gap-4 select-none ${
                        isChecked
                          ? 'bg-emerald-50/50 border-emerald-900/40 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 mt-0.5 accent-emerald-950 rounded cursor-pointer"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">
                            {addon.title}
                          </span>
                          <span className="text-[11px] text-slate-500 leading-relaxed block mt-0.5">
                            {addon.description}
                          </span>
                        </div>
                      </div>

                      <span className="font-mono text-xs font-bold text-slate-900 whitespace-nowrap shrink-0">
                        + PKR {addon.price.toLocaleString()}
                      </span>
                    </div>
                  )
                })}
              </div>
            </section>
          </div>

          {/* ============================================================ */}
          {/* RIGHT COLUMN: PINNED LIVE FOLIO LEDGER & SAFEPAY CTA (5 cols) */}
          {/* ============================================================ */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            
            {/* Main Folio Card */}
            <div className="bg-white rounded-[2px] border border-slate-200/90 shadow-xl overflow-hidden">
              
              {/* Atomic Lock Bar */}
              <div className="p-3.5 bg-amber-50/90 border-b border-amber-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono font-bold text-amber-950 uppercase block">
                    PESSIMISTIC INVENTORY HOLD
                  </span>
                  <span className="text-[11px] text-amber-900/80">
                    Room {selectedResidence.roomNumber} locked exclusively for you
                  </span>
                </div>
                <span className="font-mono text-sm font-extrabold text-amber-950 bg-white px-2.5 py-1 rounded-[2px] border border-amber-200 shrink-0 shadow-2xs">
                  {formatTimer(secondsLeft)}
                </span>
              </div>

              {/* Suite Monograph Preview */}
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-900">
                <img
                  src={selectedResidence.mainImage || selectedResidence.gallery[0]?.url}
                  alt={selectedResidence.name}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                  <span className="text-[9px] font-mono tracking-[0.2em] uppercase font-bold text-emerald-300">
                    SUITE {selectedResidence.roomNumber} &bull; {selectedResidence.tier}
                  </span>
                  <h3 className="font-cinzel text-xl font-medium tracking-wide">
                    {selectedResidence.name}
                  </h3>
                </div>
              </div>

              {/* Itemized Financial Breakdown */}
              <div className="p-6 space-y-3.5 text-xs text-slate-600 border-b border-slate-100">
                <div className="flex justify-between">
                  <span>{nights} Nights &times; PKR {selectedResidence.nightlyRate.toLocaleString()}</span>
                  <span className="font-mono font-semibold text-slate-900">
                    PKR {suiteSubtotal.toLocaleString()}
                  </span>
                </div>

                {addonTotal > 0 && (
                  <div className="flex justify-between text-emerald-950">
                    <span>Curated Enhancements ({selectedAddons.length})</span>
                    <span className="font-mono font-semibold">
                      + PKR {addonTotal.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Sindh Sales Tax (13%)</span>
                  <span className="font-mono font-semibold text-slate-900">
                    PKR {sindhTax.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-base font-bold text-slate-900 pt-3 border-t border-slate-200">
                  <span>Total Stay Valuation</span>
                  <span className="font-mono">PKR {totalValuation.toLocaleString()}</span>
                </div>

                {/* Deposit Split Summary */}
                <div className="mt-4 p-4 bg-emerald-50/80 border border-emerald-200/90 rounded-[2px] space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-emerald-950">
                    <span>30% SAFEPAY ADVANCE TODAY</span>
                    <span className="font-mono text-sm font-extrabold text-emerald-900">
                      PKR {advanceDeposit.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-600 pt-1.5 border-t border-emerald-100">
                    <span>70% Remaining Front-Desk Balance</span>
                    <span className="font-mono">PKR {remainingBalance.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Primary Call to Action Button */}
              <div className="p-6 bg-slate-50/60">
                <button
                  type="submit"
                  disabled={isProcessing || secondsLeft === 0}
                  className="w-full py-4 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] font-mono text-xs font-bold uppercase tracking-[0.2em] rounded-[2px] shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:bg-slate-300 cursor-pointer active:scale-[0.98]"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-[#FFF0CA]/30 border-t-[#FFF0CA] rounded-full animate-spin" />
                      AUTHENTICATING SAFEPAY...
                    </>
                  ) : secondsLeft === 0 ? (
                    'SESSION EXPIRED — REFRESH'
                  ) : (
                    `CONFIRM & DEPOSIT PKR ${advanceDeposit.toLocaleString()}`
                  )}
                </button>
                <span className="block text-center text-[9px] font-mono text-slate-400 mt-2.5 uppercase tracking-widest">
                  Encrypted 256-Bit Safepay Sandbox &bull; Instant Confirmation
                </span>
              </div>
            </div>

            {/* Guarantee Policy Badge */}
            <div className="p-4 bg-white border border-slate-200/80 rounded-[2px] text-[11px] text-slate-500 space-y-1">
              <span className="font-mono text-[9px] font-bold text-slate-800 uppercase block tracking-wider">
                HOSPITALITY PROTOCOL GUARANTEE
              </span>
              <p className="leading-relaxed">
                Reservations are confirmed immediately upon advance payment. Free cancellation available up to 72 hours prior to arrival date.
              </p>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
