import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import { RESIDENCES } from '../data/residences'
import { useAuth } from '../context/AuthContext'
import { useHotelData } from '../context/HotelDataContext'
import StayDatesForm from '../components/booking/StayDatesForm'
import GuestInfoForm from '../components/booking/GuestInfoForm'
import ExtraServices, { CONCIERGE_ADDONS } from '../components/booking/ExtraServices'
import BookingSummary from '../components/booking/BookingSummary'

export default function BookingPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { currentUser } = useAuth()
  const { createReservation, systemSettings } = useHotelData()

  // 1. Resolve Active Suite (?room=301, ?room=302, etc.)
  const roomParam = searchParams.get('room')
  const selectedResidence = useMemo(() => {
    const match = RESIDENCES.find((r) => r.roomNumber === roomParam)
    return match || RESIDENCES[0]
  }, [roomParam])

  // 2. Stay Parameters
  const [nights, setNights] = useState(4)
  const [guestCount, setGuestCount] = useState(2)
  const [selectedAddons, setSelectedAddons] = useState(['helipad'])

  // 3. Guest Information
  const [guestDossier, setGuestDossier] = useState(() => ({
    fullName: currentUser?.name || 'Ahmed Khan',
    email: currentUser?.email || 'ahmed.khan@havenresorts.pk',
    phone: currentUser?.phone || '+92 300 1234567',
    identificationNumber: '42101-9876543-1',
    specialRequests: '',
  }))

  // 4. Atomic 5-Minute Inventory Hold (300 seconds)
  const [secondsLeft, setSecondsLeft] = useState(300)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
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

  // 5. Zero-Trust Financial Calculations (PRD FR-1.3)
  const addonTotal = useMemo(() => {
    return selectedAddons.reduce((sum, id) => {
      const item = CONCIERGE_ADDONS.find((a) => a.id === id)
      return sum + (item ? item.price : 0)
    }, 0)
  }, [selectedAddons])

  const suiteSubtotal = selectedResidence.nightlyRate * nights
  const netSubtotal = suiteSubtotal + addonTotal
  const taxRate = systemSettings?.taxRate || 13
  const depositRate = systemSettings?.depositRate || 30
  const sindhTax = Math.round(netSubtotal * (taxRate / 100))
  const totalValuation = netSubtotal + sindhTax
  const advanceDeposit = Math.round(totalValuation * (depositRate / 100))
  const remainingBalance = totalValuation - advanceDeposit

  // 6. Confirm Booking & Post to Shared Arrivals Queue
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

      // Sync into unified hotel state!
      createReservation(bookingData)

      navigate('/confirmation', { state: { booking: bookingData } })
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 font-sans-clean antialiased selection:bg-emerald-100 selection:text-emerald-950">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-slate-200/60 px-4 sm:px-8 lg:px-12 py-3.5 sm:py-4 flex items-center justify-between">
        <Link
          to="/"
          className="group inline-flex items-center gap-1.5 sm:gap-2 text-xs font-mono tracking-wider text-slate-600 hover:text-slate-950 uppercase transition-colors"
        >
          <span className="transition-transform group-hover:-translate-x-1">&larr;</span>
          <span className="hidden sm:inline">Return to </span>
          <span>Suites</span>
        </Link>

        <BrandLogo variant="wordmark" theme="dark" size="sm" />

        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-pulse" />
          <span>Room {selectedResidence.roomNumber}</span>
          <span className="hidden sm:inline">&bull; 256-Bit SSL</span>
        </div>
      </header>

      {/* Main 2-Column Monograph */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-8 lg:py-10 pb-28 lg:pb-12">
        {/* Suite Header with Switcher */}
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

        {/* 2-Column Form */}
        <form onSubmit={handleConfirmReservation} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          <div className="lg:col-span-7 space-y-12">
            <StayDatesForm
              nights={nights}
              setNights={setNights}
              guestCount={guestCount}
              setGuestCount={setGuestCount}
            />

            <GuestInfoForm
              guestDossier={guestDossier}
              setGuestDossier={setGuestDossier}
              currentUser={currentUser}
            />

            <ExtraServices
              selectedAddons={selectedAddons}
              toggleAddon={toggleAddon}
            />
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <BookingSummary
              selectedResidence={selectedResidence}
              nights={nights}
              suiteSubtotal={suiteSubtotal}
              addonTotal={addonTotal}
              sindhTax={sindhTax}
              totalValuation={totalValuation}
              advanceDeposit={advanceDeposit}
              remainingBalance={remainingBalance}
              secondsLeft={secondsLeft}
              formatTimer={formatTimer}
              isProcessing={isProcessing}
              taxRate={taxRate}
              depositRate={depositRate}
            />
          </div>
        </form>
      </main>
    </div>
  )
}
