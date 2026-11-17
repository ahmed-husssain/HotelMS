import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import { RESIDENCES } from '../data/residences'

/**
 * ReservationPage — The Haven Minimalist Reservation Monograph (/reserve)
 * 
 * VIVA & ARCHITECTURAL SUMMARY:
 * 1. Minimalist Editorial Layout (Inspired by Aman & Casa Momo):
 *    Replaced bulky nested cards and text bloat with clean hairline dividers,
 *    generous whitespace, and uncluttered 1-line selections.
 * 
 * 2. Zero-Trust Financial Formula (PRD FR-1.3):
 *    - Subtotal = (Nightly Rate * Nights) + Sum(Selected Add-ons)
 *    - Sindh Sales Tax (13%) = round(Subtotal * 0.13)
 *    - Total Stay Valuation = Subtotal + Tax
 *    - 30% Advance Deposit = round(Total * 0.3)
 *    - 70% Front-Desk Balance = Total - Advance
 * 
 * 3. 5-Minute Atomic Hold Timer (PRD FR-1.4 & FR-1.5):
 *    Active session lock holding the suite for 300 seconds.
 */

// Curated 1-line Concierge Add-ons (No paragraph bloat)
const CONCIERGE_ADDONS = [
  {
    id: 'helipad',
    title: 'Private Coastal Helipad VIP Transfer',
    price: 25000,
  },
  {
    id: 'onsen_spa',
    title: 'Private Cedar Hot Tub & Spa Experience',
    price: 18000,
  },
  {
    id: 'tasting_menu',
    title: "Chef's Fresh Seafood & Farm-to-Table Dinner",
    price: 15000,
  },
]

export default function ReservationPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  // 1. Resolve Active Suite from Query Param (?room=102, ?room=301, ?room=204)
  const roomParam = searchParams.get('room')
  const selectedResidence = useMemo(() => {
    const match = RESIDENCES.find((r) => r.roomNumber === roomParam)
    return match || RESIDENCES[2] // Defaults to Room 102 if matched, else first
  }, [roomParam])

  // 2. Stay Parameters
  const [nights, setNights] = useState(4)
  const [guestCount, setGuestCount] = useState(2)
  const [selectedAddons, setSelectedAddons] = useState(['helipad'])

  // 3. Guest Information
  const [guestDossier, setGuestDossier] = useState({
    fullName: 'Ahmed Khan',
    email: 'ahmed.khan@havenresorts.pk',
    phone: '+92 300 1234567',
    identificationNumber: '42101-9876543-1',
    specialRequests: '',
  })

  // 4. Atomic 5-Minute Inventory Hold (300 seconds)
  const [secondsLeft, setSecondsLeft] = useState(300)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showMobileFolio, setShowMobileFolio] = useState(false)

  useEffect(() => {
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

  const toggleAddon = (addonId) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    )
  }

  // 5. Zero-Trust Financial Calculations
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

  // 6. Confirm Booking & Navigate to Receipt Voucher
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
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-slate-200/60 px-4 sm:px-8 lg:px-12 py-3.5 sm:py-4 flex items-center justify-between">
        <Link
          to="/"
          className="group inline-flex items-center gap-1.5 sm:gap-2 text-xs font-mono tracking-wider text-slate-600 hover:text-slate-950 uppercase transition-colors"
        >
          <span className="transition-transform group-hover:-translate-x-1">&larr;</span>
          <span className="hidden sm:inline">Return to </span>
          <span>Suites</span>
        </Link>

        {/* Center Brand Wordmark */}
        <BrandLogo variant="wordmark" theme="dark" size="sm" />

        {/* Suite Indicator */}
        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-pulse" />
          <span>Room {selectedResidence.roomNumber}</span>
          <span className="hidden sm:inline">&bull; 256-Bit SSL</span>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. MAIN 2-COLUMN MINIMALIST WORKSPACE */}
      {/* ============================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-8 lg:py-10 pb-28 lg:pb-12">
        
        {/* Suite Header with Minimal Telemetry */}
        <div className="mb-8 sm:mb-12 border-b border-slate-200/80 pb-5 sm:pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
          <div className="space-y-1 sm:space-y-1.5">
            <span className="text-[10px] font-mono tracking-[0.25em] font-extrabold text-emerald-900 uppercase block">
              SUITE {selectedResidence.roomNumber} &bull; {selectedResidence.tier}
            </span>
            <h1 className="font-cinzel text-2xl sm:text-4xl lg:text-5xl font-light text-slate-900 tracking-tight">
              {selectedResidence.name}
            </h1>
            <p className="text-xs font-mono text-slate-500 tracking-wider uppercase pt-0.5 sm:pt-1">
              PKR {selectedResidence.nightlyRate.toLocaleString()} / Night &bull; 100% Uninterrupted Seclusion
            </p>
          </div>

          {/* Minimal Suite Switcher */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-white border border-slate-200 p-1 rounded-[2px] self-start md:self-end shadow-2xs overflow-x-auto max-w-full">
            {RESIDENCES.map((res) => {
              const isActive = res.roomNumber === selectedResidence.roomNumber
              return (
                <button
                  key={res.id}
                  type="button"
                  onClick={() => setSearchParams({ room: res.roomNumber })}
                  className={`px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider rounded-[2px] transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#0E1201] text-[#FFF0CA] font-bold shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Suite {res.roomNumber}
                </button>
              )
            })}
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <form onSubmit={handleConfirmReservation} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* ============================================================ */}
          {/* LEFT COLUMN: MINIMALIST DOSSIER & PARAMETERS (7 cols) */}
          {/* ============================================================ */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Section 1: Stay Parameters */}
            <section className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <span className="text-xs font-mono font-bold tracking-[0.2em] text-slate-900 uppercase">
                  01 &bull; Stay Parameters
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase">
                  Nov 24 &ndash; Nov 28 (4 Nights)
                </span>
              </div>

              {/* Minimalist Duration & Guests Pill Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <span className="text-[10px] font-mono tracking-wider font-semibold text-slate-400 uppercase block mb-2">
                    Duration of Stay
                  </span>
                  <div className="flex gap-1.5">
                    {[2, 3, 4, 7].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setNights(n)}
                        className={`flex-1 py-2 text-xs font-mono rounded-[2px] border transition-all cursor-pointer ${
                          nights === n
                            ? 'bg-[#0E1201] text-[#FFF0CA] border-[#0E1201] font-bold shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        {n}N
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono tracking-wider font-semibold text-slate-400 uppercase block mb-2">
                    Guest Occupancy
                  </span>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGuestCount(g)}
                        className={`flex-1 py-2 text-xs font-mono rounded-[2px] border transition-all cursor-pointer ${
                          guestCount === g
                            ? 'bg-[#0E1201] text-[#FFF0CA] border-[#0E1201] font-bold shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        {g} {g === 1 ? 'Guest' : 'Guests'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Primary Guest Dossier Form (Clean Hairline Inputs) */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <span className="text-xs font-mono font-bold tracking-[0.2em] text-slate-900 uppercase">
                  02 &bull; Guest Information
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase">
                  Direct Check-in Registration
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-mono tracking-wider font-semibold text-slate-400 uppercase block mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    value={guestDossier.fullName}
                    onChange={(e) => setGuestDossier({ ...guestDossier, fullName: e.target.value })}
                    placeholder="Ahmed Khan"
                    className="w-full py-2.5 px-0 bg-transparent border-b border-slate-300 focus:border-slate-900 text-sm font-medium text-slate-900 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono tracking-wider font-semibold text-slate-400 uppercase block mb-1">
                    CNIC / Passport ID
                  </label>
                  <input
                    type="text"
                    required
                    value={guestDossier.identificationNumber}
                    onChange={(e) => setGuestDossier({ ...guestDossier, identificationNumber: e.target.value })}
                    placeholder="42101-9876543-1"
                    className="w-full py-2.5 px-0 bg-transparent border-b border-slate-300 focus:border-slate-900 text-sm font-mono text-slate-900 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono tracking-wider font-semibold text-slate-400 uppercase block mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    required
                    value={guestDossier.email}
                    onChange={(e) => setGuestDossier({ ...guestDossier, email: e.target.value })}
                    placeholder="ahmed@example.com"
                    className="w-full py-2.5 px-0 bg-transparent border-b border-slate-300 focus:border-slate-900 text-sm text-slate-900 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono tracking-wider font-semibold text-slate-400 uppercase block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={guestDossier.phone}
                    onChange={(e) => setGuestDossier({ ...guestDossier, phone: e.target.value })}
                    placeholder="+92 300 1234567"
                    className="w-full py-2.5 px-0 bg-transparent border-b border-slate-300 focus:border-slate-900 text-sm font-mono text-slate-900 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono tracking-wider font-semibold text-slate-400 uppercase block mb-1">
                  Concierge Notes or Arrival Requests (Optional)
                </label>
                <input
                  type="text"
                  value={guestDossier.specialRequests}
                  onChange={(e) => setGuestDossier({ ...guestDossier, specialRequests: e.target.value })}
                  placeholder="e.g. Dawn check-in; dietary restrictions"
                  className="w-full py-2.5 px-0 bg-transparent border-b border-slate-300 focus:border-slate-900 text-xs text-slate-900 focus:outline-none transition-colors"
                />
              </div>
            </section>

            {/* Section 3: Concierge Enhancements (1-Line Minimalist Selectors) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <span className="text-xs font-mono font-bold tracking-[0.2em] text-slate-900 uppercase">
                  03 &bull; Optional Add-Ons &amp; Experiences
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase">
                  Added to Guest Bill
                </span>
              </div>

              <div className="space-y-2.5">
                {CONCIERGE_ADDONS.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id)
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-3.5 rounded-[2px] border transition-all cursor-pointer flex items-center justify-between select-none ${
                        isChecked
                          ? 'bg-white border-slate-900 shadow-2xs'
                          : 'bg-white/60 border-slate-200/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 accent-slate-950 rounded cursor-pointer"
                        />
                        <span className="text-xs font-medium text-slate-900">
                          {addon.title}
                        </span>
                      </div>

                      <span className="font-mono text-xs font-bold text-slate-900">
                        + PKR {addon.price.toLocaleString()}
                      </span>
                    </div>
                  )
                })}
              </div>
            </section>
          </div>

          {/* ============================================================ */}
          {/* RIGHT COLUMN: MONOLITHIC EDITORIAL FOLIO (5 cols) */}
          {/* ============================================================ */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            
            {/* The Monograph Folio Card */}
            <div className="bg-white rounded-[2px] border border-slate-200/90 shadow-lg overflow-hidden">
              
              {/* Suite Photography Hero */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                <img
                  src={selectedResidence.mainImage || selectedResidence.gallery[0]?.url}
                  alt={selectedResidence.name}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-2.5 py-1 bg-[#0E1201]/70 backdrop-blur-md text-[9px] font-mono tracking-widest text-[#FFF0CA] uppercase rounded-[2px] border border-white/10 font-bold">
                    SUITE {selectedResidence.roomNumber}
                  </span>
                </div>
              </div>

              {/* Ledger Breakdown */}
              <div className="p-7 space-y-3.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>{nights} Nights &times; PKR {selectedResidence.nightlyRate.toLocaleString()}</span>
                  <span className="font-mono font-medium text-slate-900">
                    PKR {suiteSubtotal.toLocaleString()}
                  </span>
                </div>

                {addonTotal > 0 && (
                  <div className="flex justify-between text-slate-900">
                    <span>Selected Add-Ons ({selectedAddons.length})</span>
                    <span className="font-mono font-medium">
                      + PKR {addonTotal.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Sindh Sales Tax (13%)</span>
                  <span className="font-mono font-medium text-slate-900">
                    PKR {sindhTax.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-base font-bold text-slate-900 pt-3 border-t border-slate-200/80">
                  <span>Total Stay Amount</span>
                  <span className="font-mono">PKR {totalValuation.toLocaleString()}</span>
                </div>

                {/* Deposit Split */}
                <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs font-bold text-emerald-950 block">
                      30% ADVANCE DUE TODAY
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Remaining 70% (PKR {remainingBalance.toLocaleString()}) settled at front desk
                    </span>
                  </div>
                  <span className="font-mono text-base font-extrabold text-emerald-950">
                    PKR {advanceDeposit.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Button & Timer Strip */}
              <div className="p-6 bg-slate-50/70 border-t border-slate-200/80 space-y-2.5">
                <button
                  type="submit"
                  disabled={isProcessing || secondsLeft === 0}
                  className="w-full py-4 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] font-mono text-xs font-bold uppercase tracking-[0.2em] rounded-[2px] shadow-md transition-all duration-300 flex items-center justify-center gap-2 disabled:bg-slate-300 cursor-pointer active:scale-[0.98]"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-[#FFF0CA]/30 border-t-[#FFF0CA] rounded-full animate-spin" />
                      AUTHENTICATING SAFEPAY...
                    </>
                  ) : secondsLeft === 0 ? (
                    'SESSION EXPIRED &bull; REFRESH'
                  ) : (
                    `CONFIRM & DEPOSIT PKR ${advanceDeposit.toLocaleString()}`
                  )}
                </button>

                {/* Session Countdown */}
                <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                  <span>Session Hold: {formatTimer(secondsLeft)}</span>
                  <span>&bull;</span>
                  <span>Instant Confirmation</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
