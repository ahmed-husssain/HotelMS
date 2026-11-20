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
import SafepayCheckoutModal from '../components/booking/SafepayCheckoutModal'
import { createCheckoutHold, createPaymentSession, cancelPaymentSession } from '../services/api'

export default function BookingPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { currentUser, linkReservationCode } = useAuth()
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
  const [selectedAddons, setSelectedAddons] = useState([])

  // 3. Guest Information (Empty by default unless authenticated)
  const [guestDossier, setGuestDossier] = useState(() => ({
    fullName: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    identificationNumber: '',
    specialRequests: '',
  }))

  const [formErrors, setFormErrors] = useState({})
  const [touchedFields, setTouchedFields] = useState({})
  const [isSuitePickerOpen, setIsSuitePickerOpen] = useState(false)

  // Validation helper
  const validateForm = () => {
    const errors = {}
    const nameTrimmed = (guestDossier.fullName || '').trim()
    if (!nameTrimmed || nameTrimmed.length < 2) {
      errors.fullName = 'Please enter your name'
    }

    const cnicDigits = (guestDossier.identificationNumber || '').replace(/\D/g, '')
    if (!cnicDigits) {
      errors.identificationNumber = 'CNIC / National ID is required'
    } else if (cnicDigits.length < 5) {
      errors.identificationNumber = 'Please enter a valid CNIC / ID number'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    if (!guestDossier.email || !emailRegex.test(guestDossier.email.trim())) {
      errors.email = 'Please provide a valid email address'
    }

    const phoneDigits = (guestDossier.phone || '').replace(/\D/g, '')
    if (!phoneDigits || phoneDigits.length < 8) {
      errors.phone = 'Please provide a valid mobile number'
    }

    setFormErrors(errors)
    return errors
  }

  // Auto-sync if user logs in while on booking page
  useEffect(() => {
    if (currentUser) {
      setGuestDossier((prev) => ({
        ...prev,
        fullName: prev.fullName || currentUser.name || '',
        email: prev.email || currentUser.email || '',
        phone: prev.phone || currentUser.phone || '',
      }))
    }
  }, [currentUser])

  // 4. Processing & Safepay Gateway State
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeCheckoutSession, setActiveCheckoutSession] = useState(null)

  // Explicit Hold Release (When user clicks Cancel on checkout)
  const handleCancelHold = async () => {
    if (activeCheckoutSession?.bookingRef) {
      try {
        await cancelPaymentSession(activeCheckoutSession.bookingRef)
      } catch (err) {
        console.warn('[Booking] Hold release notice:', err.message)
      }
    }
    setActiveCheckoutSession(null)
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

  // 6. Initiate Atomic Hold & Safepay 30% Advance Checkout Session
  const handleConfirmReservation = async (e) => {
    e.preventDefault()

    // Run strict validation against all fields
    const errors = validateForm()
    setTouchedFields({
      fullName: true,
      identificationNumber: true,
      email: true,
      phone: true,
    })

    if (Object.keys(errors).length > 0) {
      return
    }

    setIsProcessing(true)

    try {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const departure = new Date(tomorrow)
      departure.setDate(departure.getDate() + nights)

      // 1. Create 5-minute atomic hold on the suite in MongoDB Atlas
      const holdRes = await createCheckoutHold({
        roomId: selectedResidence.roomNumber || selectedResidence.id,
        checkInDate: tomorrow.toISOString(),
        checkOutDate: departure.toISOString(),
        guestDetails: {
          name: guestDossier.fullName,
          email: guestDossier.email,
          phone: guestDossier.phone,
          specialRequests: guestDossier.specialRequests,
        },
      })

      const finalBookingRef =
        holdRes?.data?.bookingReference ||
        `ST-${selectedResidence.roomNumber}-${Math.floor(1000 + Math.random() * 9000)}`

      // 2. Initiate Safepay 30% Advance Checkout Session on backend
      const successUrl = `${window.location.origin}/payment/verify?ref=${finalBookingRef}`
      const cancelUrl = `${window.location.origin}/reserve?room=${selectedResidence.roomNumber}&cancelled=true&ref=${finalBookingRef}`

      const sessionRes = await createPaymentSession(finalBookingRef, successUrl, cancelUrl)

      const isLiveCheckout = Boolean(sessionRes?.success && sessionRes.data?.checkoutUrl && sessionRes.data.checkoutUrl !== '#')

      const sessionData = {
        bookingRef: finalBookingRef,
        trackerToken: sessionRes?.data?.trackerToken || `track_sim_${Date.now()}`,
        checkoutUrl: isLiveCheckout ? sessionRes.data.checkoutUrl : null,
        advanceAmount: sessionRes?.data?.advanceAmount || advanceDeposit,
        totalAmount: totalValuation,
        currency: sessionRes?.data?.currency || 'PKR',
        roomNumber: selectedResidence.roomNumber,
        residence: selectedResidence,
        nights,
        guestDossier,
        sindhTax,
      }

      try {
        sessionStorage.setItem('stayza_checkout_session', JSON.stringify(sessionData))
      } catch {
        // Ignore storage exceptions
      }

      setActiveCheckoutSession(sessionData)
    } catch (apiErr) {
      console.warn('[Booking] API sync issue; opening verification fallback:', apiErr.message)
      const fallbackRef = `ST-${selectedResidence.roomNumber}-${Math.floor(1000 + Math.random() * 9000)}`
      const fallbackSession = {
        bookingRef: fallbackRef,
        trackerToken: `track_sim_${Date.now()}`,
        checkoutUrl: null,
        advanceAmount: advanceDeposit,
        totalAmount: totalValuation,
        currency: 'PKR',
        roomNumber: selectedResidence.roomNumber,
        residence: selectedResidence,
        nights,
        guestDossier,
        sindhTax,
      }

      try {
        sessionStorage.setItem('stayza_checkout_session', JSON.stringify(fallbackSession))
      } catch {
        // Ignore storage exceptions
      }

      setActiveCheckoutSession(fallbackSession)
    } finally {
      setIsProcessing(false)
    }
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
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
          <span>Suite {selectedResidence.roomNumber}</span>
          <span className="hidden sm:inline">&bull; Secure Checkout</span>
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
            <h1 className="font-serif-grand text-2xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
              {selectedResidence.name}
            </h1>
            <p className="text-xs font-mono text-slate-500 tracking-wider uppercase pt-0.5 sm:pt-1">
              PKR {selectedResidence.nightlyRate.toLocaleString()} / Night &bull; 100% Uninterrupted Seclusion
            </p>
          </div>

          {/* Scalable Luxury Suite Dropdown Picker (Zero Horizontal Scrollbar) */}
          <div className="relative self-start md:self-end">
            <button
              type="button"
              onClick={() => setIsSuitePickerOpen((prev) => !prev)}
              className="flex items-center gap-3 px-3.5 py-2 bg-white border border-slate-300 hover:border-slate-900 rounded-[2px] text-xs font-mono tracking-wider text-slate-900 shadow-xs transition-all cursor-pointer min-h-[44px]"
              aria-expanded={isSuitePickerOpen}
              aria-label="Select Accommodation Suite"
            >
              <div className="flex items-center gap-2 text-left">
                <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold uppercase block text-slate-900 text-[11px]">
                    Suite {selectedResidence.roomNumber} &bull; {selectedResidence.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono block">
                    PKR {selectedResidence.nightlyRate.toLocaleString()} / Night
                  </span>
                </div>
              </div>
              <span className={`text-[10px] text-slate-400 transition-transform duration-200 ${isSuitePickerOpen ? 'rotate-180' : ''}`}>
                &#9660;
              </span>
            </button>

            {/* Dropdown Popover */}
            {isSuitePickerOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsSuitePickerOpen(false)} 
                />
                <div className="absolute right-0 mt-1.5 w-72 sm:w-80 bg-white border border-slate-200 shadow-2xl rounded-[2px] z-50 overflow-hidden divide-y divide-slate-100 max-h-80 overflow-y-auto animate-fade-in">
                  <div className="px-3.5 py-2 bg-slate-50 font-mono text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                    Choose Luxury Residence ({RESIDENCES.length} Available)
                  </div>
                  {RESIDENCES.map((res) => {
                    const isSelected = res.roomNumber === selectedResidence.roomNumber
                    return (
                      <button
                        key={res.id}
                        type="button"
                        onClick={() => {
                          setSearchParams({ room: res.roomNumber })
                          setIsSuitePickerOpen(false)
                        }}
                        className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#0E1201] text-[#FFF0CA]'
                            : 'hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold uppercase text-[11px]">
                              Suite {res.roomNumber}
                            </span>
                            <span className={`text-[10px] ${isSelected ? 'text-[#FFF0CA]/70' : 'text-slate-400'}`}>
                              &bull; {res.categoryLabel || res.tier}
                            </span>
                          </div>
                          <span className={`text-[11px] block ${isSelected ? 'text-white' : 'text-slate-900 font-medium'}`}>
                            {res.name}
                          </span>
                          <span className={`text-[10px] font-mono block ${isSelected ? 'text-[#FFF0CA]/80' : 'text-slate-500'}`}>
                            PKR {res.nightlyRate.toLocaleString()} / Night
                          </span>
                        </div>
                        {isSelected && (
                          <span className="text-amber-400 text-sm font-bold font-mono">✓</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </>
            )}
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
              errors={formErrors}
              touched={touchedFields}
              setTouched={setTouchedFields}
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
              isProcessing={isProcessing}
              taxRate={taxRate}
              depositRate={depositRate}
            />
          </div>
        </form>
      </main>

      {/* High-Performance Isolated Safepay Checkout Modal */}
      {activeCheckoutSession && (
        <SafepayCheckoutModal
          session={activeCheckoutSession}
          residence={selectedResidence}
          onCancel={handleCancelHold}
        />
      )}
    </div>
  )
}
