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
import {
  createCheckoutHold,
  createPaymentSession,
  cancelPaymentSession,
  fetchRoomQuote,
  fetchRoomDetails,
} from '../services/api'

export default function BookingPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { currentUser } = useAuth()
  const { systemSettings } = useHotelData()

  // 1. Resolve Active Suite (?room=SC-301, ?room=301, ?room=HZ-101, etc.)
  const roomParam = searchParams.get('room')
  const selectedResidence = useMemo(() => {
    if (!roomParam) return RESIDENCES[0]
    const match = RESIDENCES.find(
      (r) => r.roomNumber === roomParam || r.displayNumber === roomParam || r.id === roomParam
    )
    return match || RESIDENCES[0]
  }, [roomParam])

  // 2. Real Stay Parameters (Dates & Nights)
  const getTomorrowStr = () => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d.toISOString().split('T')[0]
  }
  const getDefaultCheckoutStr = () => {
    const d = new Date()
    d.setDate(d.getDate() + 4)
    return d.toISOString().split('T')[0]
  }

  const [checkInDate, setCheckInDate] = useState(getTomorrowStr)
  const [checkOutDate, setCheckOutDate] = useState(getDefaultCheckoutStr)
  const [guestCount, setGuestCount] = useState(2)
  const [selectedAddons, setSelectedAddons] = useState([])

  // Cancellation return handling
  const isCancelled = searchParams.get('cancelled') === 'true'
  const cancelledRef = searchParams.get('ref')
  const [showCancelledBanner, setShowCancelledBanner] = useState(isCancelled)

  useEffect(() => {
    if (isCancelled && cancelledRef) {
      cancelPaymentSession(cancelledRef).catch(() => {})
    }
  }, [isCancelled, cancelledRef])

  const nights = useMemo(() => {
    const d1 = new Date(checkInDate)
    const d2 = new Date(checkOutDate)
    const diff = Math.round((d2 - d1) / (1000 * 60 * 60 * 24))
    return Math.max(1, isNaN(diff) ? 1 : diff)
  }, [checkInDate, checkOutDate])

  const handleQuickNights = (n) => {
    const d1 = new Date(checkInDate || getTomorrowStr())
    const d2 = new Date(d1)
    d2.setDate(d2.getDate() + n)
    setCheckOutDate(d2.toISOString().split('T')[0])
  }

  // 3. Live Availability Verification against MongoDB
  const [isAvailable, setIsAvailable] = useState(true)
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
  const [bookedRanges, setBookedRanges] = useState([])

  // Load upcoming booked ranges for the active suite across all 7 residences
  useEffect(() => {
    let isCurrent = true
    const loadSuiteRanges = async () => {
      if (!selectedResidence?.roomNumber) return
      try {
        const res = await fetchRoomDetails(selectedResidence.roomNumber)
        if (isCurrent && res?.data?.bookedRanges) {
          setBookedRanges(res.data.bookedRanges)
        }
      } catch (err) {
        console.warn('[Booking] Could not fetch booked ranges:', err.message)
      }
    }
    loadSuiteRanges()
    return () => {
      isCurrent = false
    }
  }, [selectedResidence?.roomNumber])

  useEffect(() => {
    let isCurrent = true
    const checkLiveAvail = async () => {
      if (!selectedResidence?.roomNumber || !checkInDate || !checkOutDate) return
      setIsCheckingAvailability(true)
      try {
        const quoteRes = await fetchRoomQuote(
          selectedResidence.roomNumber,
          new Date(checkInDate).toISOString(),
          new Date(checkOutDate).toISOString()
        )
        if (isCurrent && quoteRes?.data) {
          setIsAvailable(quoteRes.data.isAvailable !== false)
        }
      } catch (err) {
        console.warn('[Booking] Live availability check notice:', err.message)
        if (isCurrent) setIsAvailable(false)
      } finally {
        if (isCurrent) setIsCheckingAvailability(false)
      }
    }

    const timer = setTimeout(checkLiveAvail, 300)
    return () => {
      isCurrent = false
      clearTimeout(timer)
    }
  }, [selectedResidence?.roomNumber, checkInDate, checkOutDate])

  // 4. Guest Information
  const [guestDossier, setGuestDossier] = useState(() => ({
    fullName: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    identificationNumber: '',
    specialRequests: '',
    password: '',
  }))

  const [formErrors, setFormErrors] = useState({})
  const [touchedFields, setTouchedFields] = useState({})
  const [isSuitePickerOpen, setIsSuitePickerOpen] = useState(false)

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

  // Auto-fill if user logs in
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

  // 5. Processing & Safepay Gateway State
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeCheckoutSession, setActiveCheckoutSession] = useState(null)

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

  // 6. Zero-Trust Financial Calculations
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

  // 7. Initiate 5-Minute Hold & Safepay 30% Advance Session
  const handleConfirmReservation = async (e) => {
    e.preventDefault()

    const errors = validateForm()
    setTouchedFields({
      fullName: true,
      identificationNumber: true,
      email: true,
      phone: true,
    })

    if (Object.keys(errors).length > 0) return
    if (!isAvailable) return

    setIsProcessing(true)

    try {
      const arrival = new Date(checkInDate)
      const departure = new Date(checkOutDate)

      // 1. Create 5-minute pessimistic hold in MongoDB Atlas
      const holdRes = await createCheckoutHold({
        roomId: selectedResidence.roomNumber || selectedResidence.id,
        checkInDate: arrival.toISOString(),
        checkOutDate: departure.toISOString(),
        guestDetails: {
          name: guestDossier.fullName,
          email: guestDossier.email,
          phone: guestDossier.phone,
          identificationNumber: guestDossier.identificationNumber,
          specialRequests: guestDossier.specialRequests,
          password: guestDossier.password || undefined,
        },
      })

      const finalBookingRef =
        holdRes?.data?.bookingReference ||
        `TH-${selectedResidence.roomNumber}-${Math.floor(1000 + Math.random() * 9000)}`

      // 2. Initiate Safepay 30% Advance Checkout Session
      // Safepay auto-appends ?order_id=...&tracker=... to redirect_url, so keep base clean
      const successUrl = `${window.location.origin}/payment/verify`
      const cancelUrl = `${window.location.origin}/reserve?room=${selectedResidence.roomNumber}&cancelled=true&ref=${finalBookingRef}`

      const sessionRes = await createPaymentSession(finalBookingRef, successUrl, cancelUrl)

      const trackerToken =
        sessionRes?.data?.trackerToken || `track_${finalBookingRef.toLowerCase()}_${Date.now()}`
      const checkoutUrl =
        sessionRes?.data?.checkoutUrl && sessionRes.data.checkoutUrl !== '#'
          ? sessionRes.data.checkoutUrl
          : `https://sandbox.api.getsafepay.com/checkout?env=sandbox&beacon=${trackerToken}&order_id=${encodeURIComponent(
              finalBookingRef
            )}&source=magento2&webhooks=true&redirect_url=${encodeURIComponent(
              successUrl
            )}&cancel_url=${encodeURIComponent(cancelUrl)}`

      const sessionData = {
        bookingRef: finalBookingRef,
        trackerToken,
        checkoutUrl,
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
      console.error('[Booking] Hold creation failed:', apiErr.message)
      setIsAvailable(false)
      setFormErrors((prev) => ({
        ...prev,
        submit:
          apiErr.message ||
          'This suite is no longer available for the selected dates. Please choose another date or suite.',
      }))
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 font-sans-clean antialiased selection:bg-emerald-100 selection:text-emerald-950 pb-20">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-slate-200/60 px-4 sm:px-8 lg:px-12 py-3.5 flex items-center justify-between">
        <Link
          to="/"
          className="group inline-flex items-center gap-1.5 sm:gap-2 text-xs font-mono tracking-wider text-slate-600 hover:text-slate-950 uppercase transition-colors"
        >
          <span className="transition-transform group-hover:-translate-x-1">&larr;</span>
          <span className="hidden sm:inline">Return to </span>
          <span>Suites</span>
        </Link>

        <BrandLogo variant="wordmark" theme="dark" size="sm" />

        <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-900 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          <span>Suite {selectedResidence.roomNumber} &bull; Guaranteed Rate</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-8 lg:py-10">
        {/* Cancelled Notice Banner */}
        {showCancelledBanner && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200/90 rounded-xl flex items-center justify-between text-xs text-amber-950 shadow-xs animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              <span>
                <strong>Reservation Hold Released:</strong> Checkout was cancelled on Safepay. No charges were made, and your temporary hold on Suite {selectedResidence.roomNumber} has been released.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowCancelledBanner(false)}
              className="text-amber-800 hover:text-amber-950 font-bold px-2 py-1 cursor-pointer text-sm"
              aria-label="Dismiss notice"
            >
              &times;
            </button>
          </div>
        )}

        {/* Page Header & Suite Switcher */}
        <div className="mb-8 border-b border-slate-200/80 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono tracking-[0.2em] font-extrabold text-emerald-900 uppercase block mb-1">
              {selectedResidence.locationName || 'Stayza Sanctuary'} &bull; SUITE {selectedResidence.roomNumber}
            </span>
            <h1 className="font-serif-grand text-2xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
              {selectedResidence.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-mono mt-1">
              PKR {selectedResidence.nightlyRate.toLocaleString()} / Night &bull; {selectedResidence.city || 'Pakistan'}
            </p>
          </div>

          {/* Suite Switcher Dropdown */}
          <div className="relative self-start md:self-end">
            <button
              type="button"
              onClick={() => setIsSuitePickerOpen((prev) => !prev)}
              className="flex items-center gap-3 px-3.5 py-2 bg-white border border-slate-300 hover:border-slate-900 rounded-lg text-xs font-mono tracking-wider text-slate-900 shadow-xs transition-all cursor-pointer min-h-[44px]"
              aria-expanded={isSuitePickerOpen}
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

            {isSuitePickerOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsSuitePickerOpen(false)} />
                <div className="absolute right-0 mt-1.5 w-72 sm:w-80 bg-white border border-slate-200 shadow-2xl rounded-lg z-50 overflow-hidden divide-y divide-slate-100 max-h-80 overflow-y-auto animate-fade-in">
                  <div className="px-3.5 py-2 bg-slate-50 font-mono text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                    Choose Suite ({RESIDENCES.length} Available)
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
                          isSelected ? 'bg-[#0F172A] text-white' : 'hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold uppercase text-[11px]">
                              Suite {res.roomNumber}
                            </span>
                            <span className={`text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                              &bull; {res.categoryLabel || res.tier}
                            </span>
                          </div>
                          <span className={`text-[11px] block ${isSelected ? 'text-white' : 'text-slate-900 font-medium'}`}>
                            {res.name}
                          </span>
                        </div>
                        {isSelected && <span className="text-emerald-400 font-bold font-mono">✓</span>}
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <form onSubmit={handleConfirmReservation} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column (7 cols): The 3-Step Booking Journey */}
          <div className="lg:col-span-7 space-y-8">
            <StayDatesForm
              checkInDate={checkInDate}
              setCheckInDate={setCheckInDate}
              checkOutDate={checkOutDate}
              setCheckOutDate={setCheckOutDate}
              nights={nights}
              onQuickNights={handleQuickNights}
              guestCount={guestCount}
              setGuestCount={setGuestCount}
              isAvailable={isAvailable}
              isCheckingAvailability={isCheckingAvailability}
              roomNumber={selectedResidence.roomNumber}
              bookedRanges={bookedRanges}
            />

            <GuestInfoForm
              guestDossier={guestDossier}
              setGuestDossier={setGuestDossier}
              currentUser={currentUser}
              errors={formErrors}
              touched={touchedFields}
              setTouched={setTouchedFields}
            />

            <ExtraServices selectedAddons={selectedAddons} toggleAddon={toggleAddon} />
          </div>

          {/* Right Column (5 cols): Sticky Visual Order Ledger */}
          <div className="lg:col-span-5 lg:sticky lg:top-20">
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
              isAvailable={isAvailable}
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              taxRate={taxRate}
              depositRate={depositRate}
            />
          </div>
        </form>
      </main>

      {/* Clean Safepay Hosted Checkout Modal */}
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
