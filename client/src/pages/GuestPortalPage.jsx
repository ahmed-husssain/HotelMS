import React, { useState, useMemo, useEffect, useRef } from 'react'
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
  updatePassword,
  sendPasswordOtp,
  resetPasswordWithOtp,
} from '../services/api'

// Bespoke Luxury SVG Icons for Portal Navigation & Services
const KeyIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 2l-2 2m-1.5 1.5L16 7l-2-2m-3.5 3.5a5 5 0 1 0-7.07 7.07 5 5 0 0 0 7.07-7.07z" />
  </svg>
)

const LockClosedIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const LockOpenIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
  </svg>
)

const ThermometerIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
  </svg>
)

const WifiIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="2.5" />
  </svg>
)

const CarIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="1" y="5" width="22" height="13" rx="2" />
    <path d="M7 15h.01M17 15h.01" strokeWidth="2.5" />
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
    tag: 'Artisanal Brioche',
  },
  {
    id: 'dining-2',
    category: 'Dining',
    title: 'Grilled Arabian Sea Snapper & Greens',
    description: 'Pan-seared fresh red snapper filet served with charred asparagus, citrus vinaigrette, and wild herb butter.',
    price: 4800,
    timeEst: '35 mins',
    tag: 'Wild Catch',
  },
  {
    id: 'dining-3',
    category: 'Dining',
    title: 'Continental Breakfast & Fresh Croissants',
    description: 'Artisanal butter croissants, seasonal berry preserves, organic Greek yoghurt, and freshly squeezed orange juice.',
    price: 3200,
    timeEst: '20 mins',
    tag: 'Morning Bakery',
  },
  {
    id: 'dining-4',
    category: 'Dining',
    title: 'Seasonal Fruit Platter & Wild Honey',
    description: 'Fresh sliced rockmelon, dragon fruit, sweet figs, and strawberries served with coastal Sindh forest honey.',
    price: 1600,
    timeEst: '15 mins',
    tag: 'Seasonal Organic',
  },
  {
    id: 'dining-5',
    category: 'Dining',
    title: 'Iced Coastal Espresso & Mint Tonic',
    description: 'Double espresso poured over chilled artisanal mineral tonic with crushed fresh garden mint.',
    price: 1200,
    timeEst: '10 mins',
    tag: 'Single Origin',
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
  {
    id: 'spa-5',
    category: 'Housekeeping',
    title: 'In-Suite Ice Bucket & Mineral Water Carafe',
    description: 'Fresh artisan mineral ice bucket, chilled sparkling or still carafes, and fresh cut citrus slices.',
    price: 0,
    timeEst: '10 mins',
    badge: 'Complimentary',
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

  // Guest Portal Scoped Theme State (Light = Warm Daylight, Dark = Midnight Lounge)
  const [guestTheme, setGuestTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('stayza_guest_portal_theme') || 'light'
    }
    return 'light'
  })

  const handleToggleTheme = (newTheme) => {
    const chosen = newTheme || (guestTheme === 'dark' ? 'light' : 'dark')
    setGuestTheme(chosen)
    if (typeof window !== 'undefined') {
      localStorage.setItem('stayza_guest_portal_theme', chosen)
    }
    toast.success(
      `Lighting switched to ${chosen === 'dark' ? 'Midnight Lounge (Dark)' : 'Warm Daylight (Light)'}`,
      'Portal Theme'
    )
  }

  // Sleek Anchored Profile & Settings Dropdown Tab State
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [profileTab, setProfileTab] = useState('account') // 'account' | 'orders' | 'theme' | 'password'
  const profileDropdownRef = useRef(null)

  // Password Management State (Standard vs Option B: Email OTP)
  const [passwordMode, setPasswordMode] = useState('standard') // 'standard' | 'otp'
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPass, setShowCurrentPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  // Option B: Email OTP Reset State
  const [otpCode, setOtpCode] = useState('')
  const [otpNewPassword, setOtpNewPassword] = useState('')
  const [otpConfirmPassword, setOtpConfirmPassword] = useState('')
  const [showOtpNewPass, setShowOtpNewPass] = useState(false)
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isResettingWithOtp, setIsResettingWithOtp] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpCooldown, setOtpCooldown] = useState(0)
  const [demoOtpHint, setDemoOtpHint] = useState('')

  // Close Profile Dropdown on Click Outside or Escape Key
  useEffect(() => {
    if (!isProfileDropdownOpen) return

    const handleClickOutside = (e) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
        if (e.target.closest('[data-profile-trigger]')) return
        setIsProfileDropdownOpen(false)
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsProfileDropdownOpen(false)
    }

    window.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('touchstart', handleClickOutside)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('touchstart', handleClickOutside)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isProfileDropdownOpen])

  // OTP 60-Second Cooldown Countdown
  useEffect(() => {
    if (otpCooldown <= 0) return
    const timer = setInterval(() => {
      setOtpCooldown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [otpCooldown])

  // Handler: Standard Password Update (when current password is known)
  const handleStandardPasswordSubmit = async (e) => {
    e.preventDefault()
    if (!currentPassword) {
      toast.error('Please enter your current password.', 'Password Update')
      return
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.', 'Password Update')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.', 'Password Update')
      return
    }

    setIsUpdatingPassword(true)
    try {
      await updatePassword(currentPassword, newPassword)
      toast.success('Your account password has been updated.', 'Password Changed')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setProfileTab('account')
    } catch (err) {
      toast.error(err.message || 'Failed to update password.', 'Update Failed')
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  // Handler: Request 6-digit OTP code to registered email (Option B)
  const handleRequestPasswordOtp = async () => {
    if (otpCooldown > 0) return
    setIsSendingOtp(true)
    try {
      const res = await sendPasswordOtp()
      setOtpSent(true)
      setOtpCooldown(60)
      if (res.data?.demoOtp) {
        setDemoOtpHint(res.data.demoOtp)
      }
      toast.success(
        `6-digit verification code sent to ${currentUser?.email || 'your email'}`,
        'Verification Sent'
      )
    } catch (err) {
      toast.error(err.message || 'Could not send verification code.', 'Dispatch Error')
    } finally {
      setIsSendingOtp(false)
    }
  }

  // Handler: Verify OTP and reset password (Option B)
  const handleResetPasswordWithOtpSubmit = async (e) => {
    e.preventDefault()
    if (!otpCode || otpCode.trim().length !== 6) {
      toast.error('Please enter the 6-digit code received in your email.', 'Invalid Code')
      return
    }
    if (otpNewPassword.length < 6) {
      toast.error('New password must be at least 6 characters.', 'Password Reset')
      return
    }
    if (otpNewPassword !== otpConfirmPassword) {
      toast.error('New passwords do not match.', 'Password Reset')
      return
    }

    setIsResettingWithOtp(true)
    try {
      await resetPasswordWithOtp(otpCode.trim(), otpNewPassword)
      toast.success('Your password has been reset successfully. Please keep it safe.', 'Password Reset')
      setOtpCode('')
      setOtpNewPassword('')
      setOtpConfirmPassword('')
      setOtpSent(false)
      setDemoOtpHint('')
      setPasswordMode('standard')
      setProfileTab('account')
    } catch (err) {
      toast.error(err.message || 'Invalid or expired code. Please try again.', 'Reset Failed')
    } finally {
      setIsResettingWithOtp(false)
    }
  }

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
  const [orderingServiceId, setOrderingServiceId] = useState(null)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false)

  // Interactive In-Stay Controls
  const [isDND, setIsDND] = useState(false)
  const [climateMode, setClimateMode] = useState('ocean') // 'ocean' (20°C), 'cedar' (24°C), 'eco' (22°C)
  const [climateTemp, setClimateTemp] = useState(21)
  const [wifiCopied, setWifiCopied] = useState(false)
  const [valetRequested, setValetRequested] = useState(false)
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
    const sId = service.id || service.title
    if (orderingServiceId) return
    const alreadyOrdered = orderedServices.some((s) => s.id === service.id || s.title === service.title)
    if (alreadyOrdered) {
      setServiceFeedbackNotice(`"${service.title}" is already added to your bill.`)
      setTimeout(() => setServiceFeedbackNotice(''), 3500)
      return
    }

    setOrderingServiceId(sId)

    const newItem = {
      ...service,
      id: service.id || `srv-${Date.now()}`,
      time: 'Just now',
    }

    // Dispatches to backend MongoDB Atlas
    try {
      await orderStayService(currentBooking.bookingRef, {
        title: service.title,
        price: service.price,
        category: service.category || 'General',
      })
    } catch (err) {
      console.warn('[GuestPortal] Incidental save fallback:', err.message)
    } finally {
      setOrderingServiceId(null)
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

    setServiceFeedbackNotice(`Request sent to front desk: "${service.title}" added to your bill.`)
    toast.success(`"${service.title}" added to your room bill`, 'Service Requested')
    setTimeout(() => setServiceFeedbackNotice(''), 4500)
  }

  // Fluid iOS-style Do Not Disturb toggle
  const handleToggleDND = async () => {
    const nextDND = !isDND
    setIsDND(nextDND)

    if (navigator?.vibrate) {
      navigator.vibrate(25)
    }

    try {
      await updateStaySettings(currentBooking.bookingRef, { isDND: nextDND })
    } catch (err) {
      console.warn('[GuestPortal] DND fallback:', err.message)
    }

    if (nextDND) {
      toast.info('Do Not Disturb enabled. Housekeeping and calls paused.', 'Privacy Active')
    } else {
      toast.info('Do Not Disturb disabled. Standard service resumed.', 'Privacy Inactive')
    }
  }

  // Interactive Climate Presets & Steppers (Apple HomeKit inspired)
  const handleSetClimatePreset = async (mode, temp) => {
    setClimateMode(mode)
    setClimateTemp(temp)

    if (navigator?.vibrate) {
      navigator.vibrate(20)
    }

    try {
      await updateStaySettings(currentBooking.bookingRef, { climateMode: mode, climateTemp: temp })
    } catch (err) {
      console.warn('[GuestPortal] Climate preset fallback:', err.message)
    }

    toast.success(`Thermostat set to ${temp}°C (${mode === 'ocean' ? 'Ocean Breeze' : mode === 'cedar' ? 'Cedar Warmth' : 'Quiet Eco'})`, 'Climate Updated')
  }

  const handleStepClimate = async (delta) => {
    const newTemp = Math.min(28, Math.max(18, climateTemp + delta))
    setClimateTemp(newTemp)

    if (navigator?.vibrate) {
      navigator.vibrate(15)
    }

    try {
      await updateStaySettings(currentBooking.bookingRef, { climateTemp: newTemp })
    } catch (err) {
      console.warn('[GuestPortal] Climate step fallback:', err.message)
    }
  }

  // Copy Wi-Fi Credentials with instant visual confirmation
  const handleCopyWifi = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText('pacific2026')
    }
    setWifiCopied(true)
    toast.success('Wi-Fi password copied to clipboard', 'Password Copied')
    setTimeout(() => setWifiCopied(false), 2500)
  }

  // Valet Vehicle Retrieval
  const handleRequestValet = () => {
    if (valetRequested) return
    setValetRequested(true)
    requestGuestService(
      currentBooking.roomNumber || 'Suite 301',
      currentBooking.guestName,
      'Valet Vehicle Retrieval Request (Bay #301)',
      0,
      'Valet'
    )
    toast.success('Valet team dispatched to bring your car from Bay #301.', 'Vehicle Requested')
    setTimeout(() => setValetRequested(false), 8000)
  }

  // Express Checkout Request
  const handleRequestCheckout = () => {
    if (isCheckingOut) return
    setIsCheckingOut(true)
    requestGuestService(
      currentBooking.roomNumber || 'Suite 301',
      currentBooking.guestName,
      'Express Check-Out Notification & Valet Dispatch',
      0,
      'Front Desk'
    )
    setExpressCheckoutNotice(true)
    toast.info('Front desk notified for departure and valet assistance', 'Checkout Requested')
    setTimeout(() => {
      setExpressCheckoutNotice(false)
      setIsCheckingOut(false)
    }, 7000)
  }

  return (
    <div
      data-guest-theme={guestTheme}
      className={`font-sans-clean antialiased flex flex-col justify-between transition-colors duration-300 ${
        !isUnlocked ? 'h-[100dvh] overflow-hidden' : 'min-h-screen overflow-x-hidden'
      } ${
        guestTheme === 'dark'
          ? 'stayza-guest-dark bg-[#0B1120] text-slate-100 selection:bg-emerald-900 selection:text-emerald-100'
          : 'bg-[#FAF8F5] text-slate-900 selection:bg-emerald-100 selection:text-emerald-950'
      }`}
    >
      {/* ============================================================== */}
      {/* 1. TOP ESSENTIAL APP DOCK (ZERO CLUTTER, 44PX TARGETS)        */}
      {/* ============================================================== */}
      <header
        className={`shrink-0 backdrop-blur-md border-b z-40 transition-colors duration-300 relative ${
          guestTheme === 'dark'
            ? 'bg-[#0B1120]/95 border-slate-800/80 text-slate-100'
            : 'bg-[#FAF8F5]/95 border-slate-200/80 text-slate-900'
        }`}
      >
        {/* Mobile Header (<768px) */}
        <div className="md:hidden">
          {/* Mobile Tier 1: Brand & Guest Identity */}
          <div className={`px-4 py-2.5 flex items-center justify-between border-b ${
            guestTheme === 'dark' ? 'border-slate-800/60' : 'border-slate-200/50'
          }`}>
            <div className="flex items-center gap-2.5">
              <Link
                to="/"
                className={`w-8 h-8 flex items-center justify-center transition-colors ${
                  guestTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-950'
                }`}
                title="Return to Overview"
              >
                &larr;
              </Link>
              <BrandLogo variant="wordmark" theme={guestTheme === 'dark' ? 'light' : 'dark'} size="sm" />
            </div>

            {/* Guest Profile Trigger */}
            {currentUser ? (
              <button
                type="button"
                data-profile-trigger="mobile"
                onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                className={`flex items-center gap-1.5 py-1 px-2.5 rounded-full transition-all cursor-pointer shadow-2xs active:scale-95 border ${
                  isProfileDropdownOpen
                    ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                    : guestTheme === 'dark'
                    ? 'bg-slate-900 border-slate-700 text-slate-200'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
                title="View Guest Profile & Settings"
                aria-expanded={isProfileDropdownOpen}
              >
                <span className="w-5 h-5 rounded-full bg-emerald-800 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'G'}
                </span>
                <span className="font-mono text-xs font-semibold max-w-[120px] sm:max-w-[180px] truncate">
                  {currentUser.name ? currentUser.name.split(' ')[0] : 'Guest'}
                </span>
                <span
                  className={`text-[9px] transition-transform duration-200 ${
                    isProfileDropdownOpen ? 'rotate-180 text-emerald-600' : 'text-slate-400'
                  }`}
                >
                  ▼
                </span>
              </button>
            ) : (
              <Link
                to="/login?redirect=/my-stay"
                className="font-mono text-xs font-bold text-emerald-900 underline uppercase tracking-wider py-1 px-2"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Tier 2: Suite Status, DND Switch, Bill */}
          {isUnlocked && (
            <div className={`px-4 py-2 flex items-center justify-between gap-2 border-b ${
              guestTheme === 'dark'
                ? 'bg-[#0F172A]/90 border-slate-800/60'
                : 'bg-slate-50/90 border-slate-200/40'
            }`}>
              <div className="flex items-center gap-1.5 font-mono text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shrink-0" />
                <span className={`font-bold uppercase tracking-wide ${guestTheme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                  {currentBooking.roomNumber || 'Suite 301'}
                </span>
              </div>

              {/* Apple-Style Fluid DND Spring Switch */}
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                  {isDND ? 'Privacy On' : 'Privacy Off'}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isDND}
                  aria-label="Toggle Do Not Disturb privacy"
                  onClick={handleToggleDND}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer focus:outline-none"
                >
                  <div
                    className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ease-in-out p-0.5 ${
                      isDND ? 'bg-rose-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${
                        isDND ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </button>
              </div>

              {/* Quick Bill Button */}
              <button
                type="button"
                onClick={() => setActiveTab('folio')}
                className="py-1.5 px-3 bg-slate-900 text-[#FFF0CA] font-mono text-[11px] font-bold uppercase tracking-wider rounded-[2px] active:scale-95 transition-all shadow-2xs cursor-pointer"
              >
                PKR {Math.round(financials.totalStayAmount / 1000)}k &rarr;
              </button>
            </div>
          )}
        </div>

        {/* Desktop Header (>=768px) */}
        <div className="hidden md:flex max-w-7xl mx-auto px-4 sm:px-8 py-2 sm:py-2.5 items-center justify-between gap-3">
          {/* Left: Return & Brand */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/"
              className={`touch-target text-xs font-mono tracking-wider uppercase transition-colors ${
                guestTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-950'
              }`}
              title="Return to Overview"
            >
              <span>&larr;</span>
              <span className="hidden md:inline ml-1">Overview</span>
            </Link>

            <div className={`h-4 w-[1px] hidden sm:block ${guestTheme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`} />

            <BrandLogo variant="wordmark" theme={guestTheme === 'dark' ? 'light' : 'dark'} size="sm" />
          </div>

          {/* Center: Suite Identifier & Live Dot (Zero Huge Banner) */}
          {isUnlocked && (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse shrink-0" />
              <div className="flex items-baseline gap-1.5 font-mono text-xs sm:text-sm">
                <span className={`font-bold uppercase tracking-wider ${guestTheme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                  {currentBooking.roomNumber || 'Suite 301'}
                </span>
                <span className={`hidden sm:inline text-xs tracking-wide ${guestTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  &bull; Checked In
                </span>
              </div>
            </div>
          )}

          {/* Right: Quick DND, Folio Pill & Guest Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isUnlocked && (
              <>
                {/* Apple-Style Fluid DND Spring Switch */}
                <div className="flex items-center gap-2">
                  <span className="hidden md:inline font-mono text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                    {isDND ? 'Privacy On' : 'Privacy Off'}
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isDND}
                    aria-label="Toggle Do Not Disturb privacy"
                    onClick={handleToggleDND}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer focus:outline-none"
                  >
                    <div
                      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ease-in-out p-0.5 ${
                        isDND ? 'bg-rose-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${
                          isDND ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </button>
                </div>

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
                data-profile-trigger="desktop"
                onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                className={`flex items-center gap-2 py-1.5 px-3 rounded-full transition-all cursor-pointer shadow-2xs active:scale-95 border ${
                  isProfileDropdownOpen
                    ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                    : guestTheme === 'dark'
                    ? 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-200'
                    : 'bg-white border-slate-200 hover:border-slate-400 text-slate-800'
                }`}
                title="Guest Profile & Account Settings"
                aria-expanded={isProfileDropdownOpen}
              >
                <span className="w-5 h-5 rounded-full bg-emerald-800 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'G'}
                </span>
                <span className="font-mono text-xs font-semibold max-w-[160px] sm:max-w-[220px] truncate">
                  {currentUser.name || 'Guest Profile'}
                </span>
                <span
                  className={`text-[9px] transition-transform duration-200 ${
                    isProfileDropdownOpen ? 'rotate-180 text-emerald-600' : 'text-slate-400'
                  }`}
                >
                  ▼
                </span>
              </button>
            ) : (
              <Link
                to="/login?redirect=/my-stay"
                className="touch-target text-xs font-mono text-emerald-900 font-bold uppercase tracking-widest underline px-2"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* 5 HORIZONTAL SEGMENTED EXPERIENCE TABS */}
        {isUnlocked && (
          <div className={`border-t transition-colors duration-300 ${
            guestTheme === 'dark' ? 'border-slate-800/60 bg-[#0B1120]' : 'border-slate-200/60 bg-[#FAF8F5]'
          }`}>
            <nav
              aria-label="Guest Operations Navigation"
              className="max-w-7xl mx-auto px-4 sm:px-8 py-2.5 flex items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none"
            >
              {[
                { id: 'suite', label: 'My Suite', Icon: KeyIcon },
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
                    onClick={() => {
                      setActiveTab(tab.id)
                      if (navigator?.vibrate) navigator.vibrate(15)
                    }}
                    className={`touch-target px-4 sm:px-5 py-2.5 rounded-full font-mono text-xs sm:text-[13px] font-semibold uppercase tracking-wider transition-all cursor-pointer shrink-0 flex items-center gap-2 active:scale-95 ${
                      isActive
                        ? guestTheme === 'dark'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-900 text-[#FFF0CA] shadow-sm'
                        : guestTheme === 'dark'
                        ? 'bg-slate-900/80 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
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

        {/* Sleek Anchored Profile & Settings Dropdown Tab */}
        {isProfileDropdownOpen && (
          <>
            {/* Mobile Backdrop Overlay for Instant Tap-Outside Dismissal */}
            <div
              className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-2xs md:hidden"
              onClick={() => setIsProfileDropdownOpen(false)}
              aria-hidden="true"
            />

            {/* Dropdown Container */}
            <div
              ref={profileDropdownRef}
              role="dialog"
              aria-modal="false"
              aria-label="Guest Profile and Settings"
              className={`fixed top-[56px] left-3 right-3 md:fixed md:top-[64px] md:left-auto md:right-8 md:w-[430px] max-h-[85vh] overflow-y-auto overscroll-contain z-50 rounded-2xl shadow-2xl border transition-all duration-200 p-4 sm:p-5 space-y-4 animate-in fade-in slide-in-from-top-2 ${
                guestTheme === 'dark'
                  ? 'bg-[#0F172A] border-slate-800 text-slate-100 shadow-slate-950/90'
                  : 'bg-white border-slate-200/90 text-slate-900 shadow-2xl'
              }`}
            >
              {/* Dropdown Header */}
              <div className="flex items-center justify-between border-b pb-3 border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-emerald-900 text-white font-mono text-sm font-bold flex items-center justify-center shadow-xs">
                    {(currentUser?.name || currentBooking.guestName || 'G').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-syne font-bold text-sm sm:text-base leading-tight">
                      {currentUser?.name || currentBooking.guestName || 'Guest Profile'}
                    </h3>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      Verified Stayza Guest
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-mono cursor-pointer transition-colors ${
                    guestTheme === 'dark'
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                  aria-label="Close profile dropdown"
                >
                  ✕
                </button>
              </div>

              {/* 4 Internal Segmented Control Tabs */}
              <div
                role="tablist"
                className={`grid grid-cols-4 p-1 rounded-xl font-mono text-[11px] sm:text-xs font-semibold ${
                  guestTheme === 'dark' ? 'bg-slate-900/90 border border-slate-800' : 'bg-slate-100'
                }`}
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={profileTab === 'account'}
                  onClick={() => setProfileTab('account')}
                  className={`py-1.5 sm:py-2 px-1 text-center rounded-lg transition-all cursor-pointer truncate ${
                    profileTab === 'account'
                      ? guestTheme === 'dark'
                        ? 'bg-slate-800 text-white shadow-xs'
                        : 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Account
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={profileTab === 'orders'}
                  onClick={() => setProfileTab('orders')}
                  className={`py-1.5 sm:py-2 px-1 text-center rounded-lg transition-all cursor-pointer truncate ${
                    profileTab === 'orders'
                      ? guestTheme === 'dark'
                        ? 'bg-slate-800 text-white shadow-xs'
                        : 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="sm:hidden">Orders</span>
                  <span className="hidden sm:inline">Orders</span>
                  {orderedServices?.length > 0 && (
                    <span className="ml-1 px-1 py-0.2 rounded-full text-[9px] bg-emerald-500 text-white font-bold">
                      {orderedServices.length}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={profileTab === 'theme'}
                  onClick={() => setProfileTab('theme')}
                  className={`py-1.5 sm:py-2 px-1 text-center rounded-lg transition-all cursor-pointer truncate ${
                    profileTab === 'theme'
                      ? guestTheme === 'dark'
                        ? 'bg-slate-800 text-white shadow-xs'
                        : 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Theme
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={profileTab === 'password'}
                  onClick={() => setProfileTab('password')}
                  className={`py-1.5 sm:py-2 px-1 text-center rounded-lg transition-all cursor-pointer truncate ${
                    profileTab === 'password'
                      ? guestTheme === 'dark'
                        ? 'bg-slate-800 text-white shadow-xs'
                        : 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Password
                </button>
              </div>

              {/* TAB 1: ACCOUNT OVERVIEW */}
              {profileTab === 'account' && (
                <div className="space-y-3 font-mono text-xs animate-in fade-in duration-150">
                  <div className={`p-3 rounded-xl space-y-2 border ${
                    guestTheme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200/80'
                  }`}>
                    <div className="flex items-center justify-between border-b pb-1.5 border-slate-200/50 dark:border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase">EMAIL ADDRESS</span>
                      <span className="font-bold text-right truncate max-w-[200px]">
                        {currentUser?.email || currentBooking.guestEmail || 'guest@stayza.com'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b pb-1.5 border-slate-200/50 dark:border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase">PHONE NUMBER</span>
                      <span className="font-bold text-right">
                        {currentUser?.phone || currentBooking.guestPhone || '+92 300 1234567'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[10px] uppercase">RESERVATION REF</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 text-right">
                        {currentBooking.bookingRef || 'TH-301-4575'}
                      </span>
                    </div>
                  </div>

                  {/* In-Residence Information */}
                  <div className={`p-3 rounded-xl space-y-1.5 border ${
                    guestTheme === 'dark' ? 'bg-amber-950/20 border-amber-900/40 text-amber-200' : 'bg-amber-50/60 border-amber-200/80'
                  }`}>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-semibold">ASSIGNED SUITE</span>
                      <span className="font-bold">
                        {currentBooking.roomNumber || 'Suite 301'} &bull; {currentBooking.residence?.name || 'The Horizon Penthouse'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] gap-2">
                      <span className="text-slate-400 font-semibold shrink-0">STAY DURATION</span>
                      <span className="text-right">
                        {currentBooking.checkIn} – {currentBooking.checkOut} ({currentBooking.nights} Nights)
                      </span>
                    </div>
                  </div>

                  {/* Orders & Requests Quick Access */}
                  <div
                    onClick={() => setProfileTab('orders')}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] ${
                      guestTheme === 'dark'
                        ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                        : 'bg-slate-50 border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        Orders &amp; Requests
                      </span>
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                        {orderedServices?.length || 0} active
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">&rarr;</span>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileDropdownOpen(false)
                        setIsInvoiceOpen(true)
                      }}
                      className="touch-target w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-[#FFF0CA] font-mono text-xs uppercase font-bold tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.98]"
                    >
                      <FolioIcon className="w-4 h-4" />
                      <span>Preview &amp; Download PDF Invoice</span>
                    </button>

                    {currentUser ? (
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileDropdownOpen(false)
                          logout()
                        }}
                        className={`touch-target w-full py-2 px-4 font-mono text-xs uppercase font-semibold tracking-wider rounded-xl transition-colors cursor-pointer border ${
                          guestTheme === 'dark'
                            ? 'bg-slate-900 hover:bg-rose-950/40 border-slate-800 text-slate-300 hover:text-rose-300'
                            : 'bg-slate-100 hover:bg-rose-50 border-slate-200 text-slate-600 hover:text-rose-700'
                        }`}
                      >
                        Sign Out of Account
                      </button>
                    ) : (
                      <Link
                        to="/login?redirect=/my-stay"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="touch-target w-full py-2 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-mono text-xs uppercase font-bold tracking-wider rounded-xl transition-colors text-center block"
                      >
                        Sign In with Existing Account
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: IN-STAY ORDERS & REQUESTS */}
              {profileTab === 'orders' && (
                <div className="space-y-3 font-mono text-xs animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Orders &amp; Requests ({orderedServices?.length || 0})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileDropdownOpen(false)
                        setActiveTab('folio')
                      }}
                      className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                    >
                      View Room Bill &rarr;
                    </button>
                  </div>

                  {(!orderedServices || orderedServices.length === 0) ? (
                    <div className={`p-6 rounded-xl text-center space-y-2 border ${
                      guestTheme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200/80'
                    }`}>
                      <p className="text-slate-500 text-xs">No active orders or requests yet.</p>
                      <p className="text-[11px] text-slate-400">
                        Order in-suite dining or request spa &amp; butler services from the portal.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {orderedServices.map((item, idx) => (
                        <div
                          key={item.id || idx}
                          className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                            guestTheme === 'dark'
                              ? 'bg-slate-900/60 border-slate-800'
                              : 'bg-white border-slate-200/90 shadow-2xs'
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                {item.category || 'Service'}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {item.time || 'In Stay'}
                              </span>
                            </div>
                            <span className="text-xs font-bold block truncate mt-1 text-slate-900 dark:text-slate-100">
                              {item.title}
                            </span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-mono text-xs font-bold block text-slate-900 dark:text-slate-100">
                              {item.price === 0 ? 'Complimentary' : `PKR ${Number(item.price).toLocaleString()}`}
                            </span>
                            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 uppercase font-semibold">
                              Dispatched ✓
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: PORTAL THEME TOGGLE (SCOPED STRICTLY TO GUEST OS) */}
              {profileTab === 'theme' && (
                <div className="space-y-3 font-mono text-xs animate-in fade-in duration-150">
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    {/* Warm Daylight Swatch */}
                    <button
                      type="button"
                      onClick={() => handleToggleTheme('light')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 touch-target ${
                        guestTheme === 'light'
                          ? 'border-emerald-600 bg-amber-50/50 shadow-xs ring-2 ring-emerald-500/20'
                          : guestTheme === 'dark'
                          ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-300'
                          : 'border-slate-200 bg-slate-50 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <svg className="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="12" cy="12" r="4" />
                          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                        </svg>
                        {guestTheme === 'light' ? (
                          <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded-full uppercase">
                            Active
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 uppercase">Select</span>
                        )}
                      </div>
                      <div>
                        <div className={`font-bold text-xs ${guestTheme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                          Warm Daylight
                        </div>
                        <div className={`text-[10px] mt-0.5 ${guestTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                          Classic Stayza alabaster linen
                        </div>
                      </div>
                    </button>

                    {/* Midnight Lounge Swatch */}
                    <button
                      type="button"
                      onClick={() => handleToggleTheme('dark')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 touch-target ${
                        guestTheme === 'dark'
                          ? 'border-emerald-500 bg-emerald-950/30 shadow-xs ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-slate-50 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                        </svg>
                        {guestTheme === 'dark' ? (
                          <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded-full uppercase">
                            Active
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 uppercase">Select</span>
                        )}
                      </div>
                      <div>
                        <div className={`font-bold text-xs ${guestTheme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                          Midnight Lounge
                        </div>
                        <div className={`text-[10px] mt-0.5 ${guestTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                          Deep obsidian ambient night
                        </div>
                      </div>
                    </button>
                  </div>

                  <div className={`p-2.5 rounded-xl border text-[11px] flex items-center gap-2 ${
                    guestTheme === 'dark' ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}>
                    <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Saved locally. Staff consoles and public pages remain unaffected.</span>
                  </div>
                </div>
              )}

              {/* TAB 3: PASSWORD & SECURITY (OPTION B EMAIL OTP + STANDARD) */}
              {profileTab === 'password' && (
                <div className="space-y-3 font-mono text-xs animate-in fade-in duration-150">
                  {/* Sub-mode selector */}
                  <div className={`flex items-center p-0.5 rounded-lg border text-[11px] ${
                    guestTheme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
                  }`}>
                    <button
                      type="button"
                      onClick={() => setPasswordMode('standard')}
                      className={`flex-1 py-1.5 rounded-md text-center font-semibold transition-all cursor-pointer ${
                        passwordMode === 'standard'
                          ? guestTheme === 'dark' ? 'bg-slate-800 text-white shadow-2xs' : 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'
                      }`}
                    >
                      Standard Update
                    </button>
                    <button
                      type="button"
                      onClick={() => setPasswordMode('otp')}
                      className={`flex-1 py-1.5 rounded-md text-center font-semibold transition-all cursor-pointer ${
                        passwordMode === 'otp'
                          ? guestTheme === 'dark' ? 'bg-slate-800 text-white shadow-2xs' : 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'
                      }`}
                    >
                      Email Code (OTP)
                    </button>
                  </div>

                  {/* SUBMODE 1: STANDARD PASSWORD UPDATE */}
                  {passwordMode === 'standard' && (
                    <form onSubmit={handleStandardPasswordSubmit} className="space-y-3">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPass ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password"
                            required
                            className={`w-full px-3 py-2 pr-10 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono ${
                              guestTheme === 'dark'
                                ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500'
                                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPass(!showCurrentPass)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-[10px] font-bold"
                          >
                            {showCurrentPass ? 'HIDE' : 'SHOW'}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                          New Password (Min 6 Characters)
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPass ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            required
                            minLength={6}
                            className={`w-full px-3 py-2 pr-10 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono ${
                              guestTheme === 'dark'
                                ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500'
                                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPass(!showNewPass)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-[10px] font-bold"
                          >
                            {showNewPass ? 'HIDE' : 'SHOW'}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          required
                          className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono ${
                            guestTheme === 'dark'
                              ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500'
                              : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                          }`}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isUpdatingPassword}
                        className="touch-target w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-700 text-white font-mono text-xs uppercase font-bold tracking-wider rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                      >
                        {isUpdatingPassword ? 'Updating Password...' : 'Update Password'}
                      </button>

                      <div className="text-center pt-1">
                        <button
                          type="button"
                          onClick={() => setPasswordMode('otp')}
                          className="text-[11px] text-emerald-600 dark:text-emerald-400 underline hover:opacity-80 cursor-pointer"
                        >
                          Don't know current password? Reset with email code &rarr;
                        </button>
                      </div>
                    </form>
                  )}

                  {/* SUBMODE 2: OPTION B (EMAIL OTP RESET) */}
                  {passwordMode === 'otp' && (
                    <div className="space-y-3">
                      <div className={`p-3 rounded-xl border text-[11px] space-y-2 ${
                        guestTheme === 'dark' ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}>
                        <div className={`flex items-center gap-1.5 font-bold ${guestTheme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                          <svg className={`w-3.5 h-3.5 ${guestTheme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <rect width="20" height="16" x="2" y="4" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                          </svg>
                          <span>Registered Email Verification</span>
                        </div>
                        <p className={`text-[10px] ${guestTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          We will send a 6-digit one-time passcode to:
                        </p>
                        <div className={`font-bold break-all ${guestTheme === 'dark' ? 'text-emerald-400' : 'text-emerald-800'}`}>
                          {currentUser?.email || currentBooking.guestEmail || 'guest@stayza.com'}
                        </div>

                        {/* Request Code Button */}
                        <button
                          type="button"
                          onClick={handleRequestPasswordOtp}
                          disabled={isSendingOtp || otpCooldown > 0}
                          className="touch-target w-full mt-1 py-2 px-3 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-[#FFF0CA] font-mono text-xs uppercase font-bold rounded-lg transition-all disabled:opacity-50 cursor-pointer shadow-xs"
                        >
                          {isSendingOtp
                            ? 'Sending Code...'
                            : otpCooldown > 0
                            ? `Resend Code in ${otpCooldown}s`
                            : otpSent
                            ? 'Resend Verification Code'
                            : 'Send 6-Digit Code'}
                        </button>
                      </div>

                      {demoOtpHint && (
                        <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-500 text-[10px] flex items-center justify-between">
                          <span>Demo Verification Code:</span>
                          <span className="font-mono font-bold tracking-widest text-xs bg-emerald-500/20 px-2 py-0.5 rounded">
                            {demoOtpHint}
                          </span>
                        </div>
                      )}

                      {/* Reset Password Form once OTP requested or ready */}
                      <form onSubmit={handleResetPasswordWithOtpSubmit} className="space-y-2.5">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                            6-Digit Verification Code
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                            placeholder="123456"
                            required
                            className={`w-full px-3 py-2 text-center text-base tracking-[0.3em] font-bold rounded-xl border focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono ${
                              guestTheme === 'dark'
                                ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-600'
                                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-300'
                            }`}
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                            New Password (Min 6 Characters)
                          </label>
                          <div className="relative">
                            <input
                              type={showOtpNewPass ? 'text' : 'password'}
                              value={otpNewPassword}
                              onChange={(e) => setOtpNewPassword(e.target.value)}
                              placeholder="Enter new password"
                              required
                              minLength={6}
                              className={`w-full px-3 py-2 pr-10 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono ${
                                guestTheme === 'dark'
                                  ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500'
                                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowOtpNewPass(!showOtpNewPass)}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-[10px] font-bold"
                            >
                              {showOtpNewPass ? 'HIDE' : 'SHOW'}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={otpConfirmPassword}
                            onChange={(e) => setOtpConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            required
                            className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono ${
                              guestTheme === 'dark'
                                ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500'
                                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                            }`}
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isResettingWithOtp || !otpCode}
                          className="touch-target w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-700 text-white font-mono text-xs uppercase font-bold tracking-wider rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                        >
                          {isResettingWithOtp ? 'Verifying & Resetting...' : 'Verify Code & Set Password'}
                        </button>

                        <div className="text-center pt-1">
                          <button
                            type="button"
                            onClick={() => setPasswordMode('standard')}
                            className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                          >
                            &larr; Return to standard password change
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
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
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
                {/* Left: Apple Wallet-Grade Digital Keycard & Suite Showcase */}
                <div className="lg:col-span-7 space-y-4">
                  {/* 1. LUXURY IN-RESIDENCE SUITE PASS (Clean Static Luxury) */}
                  <div className="w-full bg-[#1C1A18] text-[#F3EFEA] border border-[#2F2C28] rounded-2xl p-6 sm:p-7 shadow-xl relative overflow-hidden select-none">
                    {/* Pass Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-[#2F2C28]">
                      <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] text-[#D8CEBE] uppercase font-semibold">
                        STAYZA &bull; IN-RESIDENCE SUITE PASS
                      </span>
                      <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] text-[#A89E90] tracking-widest uppercase">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-emerald-400 font-bold">IN RESIDENCE</span>
                      </div>
                    </div>

                    {/* Upper Section: Room Info (Left) + Architectural Monogram Badge (Right) */}
                    <div className="py-5 sm:py-6 flex items-start justify-between gap-4">
                      <div className="space-y-1.5">
                        <span className="font-mono text-[10px] tracking-[0.22em] text-[#9A9184] uppercase font-semibold block">
                          GUEST RESIDENCE
                        </span>
                        <h2 className="font-serif-grand text-3xl sm:text-5xl font-bold text-[#F3EFEA] tracking-tight leading-none">
                          {currentBooking.roomNumber || 'Suite 301'}
                        </h2>
                        <p className="font-sans-clean text-sm sm:text-base text-[#D8CEBE] font-normal tracking-wide pt-1">
                          {currentBooking.residence?.name || 'The Horizon Penthouse'}
                        </p>
                      </div>

                      {/* Residence Monogram Badge */}
                      <div className="shrink-0 flex flex-col items-center">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border border-[#2F2C28] bg-black/25 flex flex-col items-center justify-center p-2.5">
                          <svg className="w-8 h-8 sm:w-9 sm:h-9 text-[#D8CEBE]" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                            <path d="M 14 36 L 50 22 L 86 36" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            <line x1="28" y1="38" x2="28" y2="78" strokeWidth="2.5" strokeLinecap="round" />
                            <line x1="72" y1="38" x2="72" y2="78" strokeWidth="2.5" strokeLinecap="round" />
                            <path d="M 38 78 L 38 52 C 38 45.4 43.4 40 50 40 C 56.6 40 62 45.4 62 52 L 62 78" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                            <line x1="16" y1="78" x2="84" y2="78" strokeWidth="3" strokeLinecap="round" />
                            <circle cx="50" cy="50" r="3.5" fill="currentColor" />
                          </svg>
                          <span className="font-mono text-[8px] text-[#9A9184] uppercase tracking-[0.22em] mt-1.5 font-semibold text-center block">
                            SUITE PASS
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Full-Width Metadata Tags Grid (Spacious, Zero Ellipsis Truncation) */}
                    <div className="grid grid-cols-3 gap-3 py-3 px-4 bg-black/25 border border-[#2F2C28] rounded-xl font-mono text-[11px] sm:text-xs">
                      <div>
                        <span className="text-[9px] text-[#8C8477] block tracking-wider uppercase font-medium">PRIMARY GUEST</span>
                        <span className="font-sans-clean text-[#F3EFEA] font-medium block mt-0.5 truncate">
                          {currentBooking.guestName}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-[#8C8477] block tracking-wider uppercase font-medium">VALID DATES</span>
                        <span className="font-mono text-[#D8CEBE] block mt-0.5 truncate">
                          {currentBooking.checkIn} – {currentBooking.checkOut}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-[#8C8477] block tracking-wider uppercase font-medium">FOLIO REF</span>
                        <span className="font-mono text-[#D8CEBE] font-medium block mt-0.5 truncate">
                          FOLIO #{currentBooking.bookingRef || 'TH-301'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 2. CINEMATIC SUITE PREVIEW CARD */}
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-xs group">
                    <img
                      src={currentBooking.residence?.detailImage || 'https://res.cloudinary.com/v1rl3ras/image/upload/v1795019369/hotel-suites/suite-301/suite-301-bedroom.webp'}
                      alt={`${currentBooking.roomNumber || 'Suite 301'} Master Bedroom`}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 inset-x-3 sm:inset-x-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-white font-mono text-xs">
                      <span className="font-semibold text-white/95">{currentBooking.roomNumber || 'Suite 301'} &bull; 210 m² Living Space</span>
                      <span className="text-amber-300 font-bold text-[11px] sm:text-xs">Private Plunge Pool</span>
                    </div>
                  </div>
                </div>

                {/* Right: In-Room Amenities & Tactile Controls */}
                <div className="lg:col-span-5 space-y-4">
                  <div>
                    <span className="text-[11px] font-mono tracking-[0.25em] font-bold text-slate-400 uppercase block">
                      Suite Controls
                    </span>
                    <h3 className="type-h2 text-2xl sm:text-3xl text-slate-900 mt-0.5">
                      Room Atmosphere
                    </h3>
                  </div>

                  {/* 1. APPLE HOMEKIT-STYLE CLIMATE CARD */}
                  <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ThermometerIcon className="w-5 h-5 text-amber-800" />
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
                          In-Suite Thermostat
                        </span>
                      </div>
                      <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        climateTemp <= 21
                          ? 'bg-sky-50 text-sky-800'
                          : climateTemp <= 23
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-amber-50 text-amber-800'
                      }`}>
                        {climateTemp <= 21 ? 'Cooling Active' : climateTemp <= 23 ? 'Optimal Balance' : 'Gentle Heating'}
                      </span>
                    </div>

                    {/* Large Stepper Display */}
                    <div className="flex items-center justify-between py-2 px-4 bg-slate-50 rounded-xl border border-slate-100">
                      <button
                        type="button"
                        onClick={() => handleStepClimate(-1)}
                        className="touch-target w-11 h-11 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-800 hover:bg-slate-100 active:scale-90 font-mono text-xl font-bold cursor-pointer transition-all shadow-2xs"
                        aria-label="Decrease temperature by 1 degree"
                      >
                        −
                      </button>

                      <div className="text-center">
                        <span className="font-serif-grand text-4xl font-bold text-slate-900 tracking-tight">
                          {climateTemp}°C
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 block uppercase tracking-wider">
                          Suite Ambient
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleStepClimate(+1)}
                        className="touch-target w-11 h-11 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-800 hover:bg-slate-100 active:scale-90 font-mono text-xl font-bold cursor-pointer transition-all shadow-2xs"
                        aria-label="Increase temperature by 1 degree"
                      >
                        +
                      </button>
                    </div>

                    {/* 3 Atmosphere Mode Presets */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {[
                        { id: 'ocean', label: 'Ocean Breeze', temp: 20 },
                        { id: 'eco', label: 'Quiet Eco', temp: 22 },
                        { id: 'cedar', label: 'Cedar Warmth', temp: 24 },
                      ].map((preset) => {
                        const isSelected = climateMode === preset.id && climateTemp === preset.temp
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handleSetClimatePreset(preset.id, preset.temp)}
                            className={`min-h-[58px] py-2 px-1.5 flex flex-col items-center justify-center text-center font-mono rounded-lg border transition-all cursor-pointer active:scale-95 ${
                              isSelected
                                ? 'bg-slate-900 text-[#FFF0CA] border-slate-900 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                            }`}
                          >
                            <span className="text-[11px] font-bold leading-tight block text-center">
                              {preset.label}
                            </span>
                            <span className={`text-[10px] font-bold mt-1 block ${isSelected ? 'text-amber-300' : 'text-emerald-800'}`}>
                              {preset.temp}°C
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* 2. WI-FI & VALET 2-COLUMN GRID */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Wi-Fi Card */}
                    <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <WifiIcon className="w-4 h-4 text-amber-800" />
                          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">WI-FI</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyWifi}
                          className="text-[11px] font-mono text-emerald-900 uppercase font-bold hover:underline cursor-pointer active:scale-95 transition-transform"
                        >
                          {wifiCopied ? 'Copied ✓' : 'Copy'}
                        </button>
                      </div>
                      <div>
                        <span className="font-mono text-xs font-bold text-slate-900 block truncate">Stayza_Guest</span>
                        <span className="text-[11px] font-mono text-slate-500">Pass: pacific2026</span>
                      </div>
                    </div>

                    {/* Valet Parking Card */}
                    <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <CarIcon className="w-4 h-4 text-amber-800" />
                          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">VALET BAY</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRequestValet}
                          className="text-[11px] font-mono text-slate-900 uppercase font-bold hover:underline cursor-pointer active:scale-95 transition-transform"
                        >
                          {valetRequested ? 'Dispatched ✓' : 'Call Car'}
                        </button>
                      </div>
                      <div>
                        <span className="font-mono text-xs font-bold text-slate-900 block">Bay #301</span>
                        <span className="text-[11px] font-mono text-slate-500">Underground Floor P1</span>
                      </div>
                    </div>
                  </div>

                  {/* 3. HEAD BUTLER SERVICE TILE */}
                  <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Head Butler On Duty</span>
                      <span className="text-xs text-slate-500 font-mono">Tariq J. &bull; In-Residence Concierge</span>
                    </div>
                    <button
                      type="button"
                      disabled={orderedServices.some((s) => s.id === 'butler-call') || orderingServiceId === 'butler-call'}
                      onClick={() => handleRequestService({
                        id: 'butler-call',
                        title: 'Direct Butler Room Consultation',
                        price: 0,
                        category: 'Front Desk',
                      })}
                      className="touch-target px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-[#FFF0CA] font-mono text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer active:scale-95 shrink-0 disabled:opacity-75 disabled:cursor-not-allowed flex items-center gap-1.5"
                    >
                      {orderingServiceId === 'butler-call' ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-[#FFF0CA] border-t-transparent rounded-full animate-spin shrink-0" />
                          <span>Calling...</span>
                        </>
                      ) : orderedServices.some((s) => s.id === 'butler-call') ? (
                        <span>Butler Requested ✓</span>
                      ) : (
                        <span>Request Butler &rarr;</span>
                      )}
                    </button>
                  </div>

                  {/* 4. ONE-TOUCH HOUSEKEEPING AMENITIES (2X2 GRID) */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono tracking-wider font-bold text-slate-400 uppercase block">
                      QUICK ROOM SERVICES &bull; 1-TOUCH REQUEST
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        disabled={orderedServices.some((s) => s.id === 'linen-quick') || orderingServiceId === 'linen-quick'}
                        onClick={() => handleRequestService({
                          id: 'linen-quick',
                          title: 'Fresh Egyptian Linens & Extra Pillows',
                          price: 0,
                          category: 'Housekeeping',
                        })}
                        className="touch-target p-3.5 sm:p-4 bg-white border border-slate-200 hover:border-slate-900 rounded-xl text-left font-mono text-xs transition-all cursor-pointer active:scale-95 shadow-xs flex items-center gap-3 disabled:opacity-75 disabled:cursor-not-allowed"
                      >
                        <BedIcon className="w-5 h-5 text-amber-800 shrink-0" />
                        <div className="flex-1">
                          <span className="font-bold text-slate-900 block text-xs">Fresh Linens</span>
                          <span className="text-[11px] text-slate-500">
                            {orderingServiceId === 'linen-quick' ? (
                              <span className="flex items-center gap-1 text-amber-800 font-semibold">
                                <span className="w-2.5 h-2.5 border-2 border-amber-800 border-t-transparent rounded-full animate-spin shrink-0" />
                                <span>Requesting...</span>
                              </span>
                            ) : orderedServices.some((s) => s.id === 'linen-quick') ? (
                              <span className="text-emerald-700 font-semibold">Requested ✓</span>
                            ) : (
                              'Complimentary'
                            )}
                          </span>
                        </div>
                      </button>

                      <button
                        type="button"
                        disabled={orderedServices.some((s) => s.id === 'turndown-quick') || orderingServiceId === 'turndown-quick'}
                        onClick={() => handleRequestService({
                          id: 'turndown-quick',
                          title: 'Evening Turn-Down & Aromatherapy Mist',
                          price: 0,
                          category: 'Housekeeping',
                        })}
                        className="touch-target p-3.5 sm:p-4 bg-white border border-slate-200 hover:border-slate-900 rounded-xl text-left font-mono text-xs transition-all cursor-pointer active:scale-95 shadow-xs flex items-center gap-3 disabled:opacity-75 disabled:cursor-not-allowed"
                      >
                        <CandleIcon className="w-5 h-5 text-amber-800 shrink-0" />
                        <div className="flex-1">
                          <span className="font-bold text-slate-900 block text-xs">Turn-Down Setup</span>
                          <span className="text-[11px] text-slate-500">
                            {orderingServiceId === 'turndown-quick' ? (
                              <span className="flex items-center gap-1 text-amber-800 font-semibold">
                                <span className="w-2.5 h-2.5 border-2 border-amber-800 border-t-transparent rounded-full animate-spin shrink-0" />
                                <span>Requesting...</span>
                              </span>
                            ) : orderedServices.some((s) => s.id === 'turndown-quick') ? (
                              <span className="text-emerald-700 font-semibold">Requested ✓</span>
                            ) : (
                              'Cedar Mist • Free'
                            )}
                          </span>
                        </div>
                      </button>

                      <button
                        type="button"
                        disabled={orderedServices.some((s) => s.id === 'water-ice-quick') || orderingServiceId === 'water-ice-quick'}
                        onClick={() => handleRequestService({
                          id: 'water-ice-quick',
                          title: 'In-Suite Ice Bucket & Mineral Water Carafe',
                          price: 0,
                          category: 'Housekeeping',
                        })}
                        className="touch-target p-3.5 sm:p-4 bg-white border border-slate-200 hover:border-slate-900 rounded-xl text-left font-mono text-xs transition-all cursor-pointer active:scale-95 shadow-xs flex items-center gap-3 disabled:opacity-75 disabled:cursor-not-allowed"
                      >
                        <DiningIcon className="w-5 h-5 text-amber-800 shrink-0" />
                        <div className="flex-1">
                          <span className="font-bold text-slate-900 block text-xs">Ice &amp; Mineral Water</span>
                          <span className="text-[11px] text-slate-500">
                            {orderingServiceId === 'water-ice-quick' ? (
                              <span className="flex items-center gap-1 text-amber-800 font-semibold">
                                <span className="w-2.5 h-2.5 border-2 border-amber-800 border-t-transparent rounded-full animate-spin shrink-0" />
                                <span>Requesting...</span>
                              </span>
                            ) : orderedServices.some((s) => s.id === 'water-ice-quick') ? (
                              <span className="text-emerald-700 font-semibold">Requested ✓</span>
                            ) : (
                              'Complimentary'
                            )}
                          </span>
                        </div>
                      </button>

                      <button
                        type="button"
                        disabled={orderedServices.some((s) => s.id === 'spa-towels-quick') || orderingServiceId === 'spa-towels-quick'}
                        onClick={() => handleRequestService({
                          id: 'spa-towels-quick',
                          title: 'Plush Bath Towels & Cedar Robes',
                          price: 0,
                          category: 'Housekeeping',
                        })}
                        className="touch-target p-3.5 sm:p-4 bg-white border border-slate-200 hover:border-slate-900 rounded-xl text-left font-mono text-xs transition-all cursor-pointer active:scale-95 shadow-xs flex items-center gap-3 disabled:opacity-75 disabled:cursor-not-allowed"
                      >
                        <SpaIcon className="w-5 h-5 text-amber-800 shrink-0" />
                        <div className="flex-1">
                          <span className="font-bold text-slate-900 block text-xs">Extra Towels &amp; Robes</span>
                          <span className="text-[11px] text-slate-500">
                            {orderingServiceId === 'spa-towels-quick' ? (
                              <span className="flex items-center gap-1 text-amber-800 font-semibold">
                                <span className="w-2.5 h-2.5 border-2 border-amber-800 border-t-transparent rounded-full animate-spin shrink-0" />
                                <span>Requesting...</span>
                              </span>
                            ) : orderedServices.some((s) => s.id === 'spa-towels-quick') ? (
                              <span className="text-emerald-700 font-semibold">Requested ✓</span>
                            ) : (
                              'Complimentary'
                            )}
                          </span>
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

              {/* In-Stay Active Dining Tracker Bar */}
              {orderedServices.filter((s) => s.category === 'Dining').length > 0 && (
                <div className="p-4 bg-white border border-slate-200/90 rounded-xl shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
                        Kitchen Order Tracker &bull; {orderedServices.filter((s) => s.category === 'Dining').length} Items
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-500">
                      Dispatched to Executive Chef
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {orderedServices.filter((s) => s.category === 'Dining').slice(-3).map((item, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900">{item.title}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                            {item.time || 'In-Kitchen'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-semibold text-slate-900">PKR {item.price?.toLocaleString()}</span>
                          <span className="font-mono text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold uppercase">
                            Preparing
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {DINING_MENU.map((item) => {
                  const isOrdered = orderedServices.some((s) => s.id === item.id)
                  return (
                    <div
                      key={item.id}
                      className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between space-y-5"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 bg-amber-50 text-amber-950 font-mono text-[10px] font-bold uppercase tracking-wider rounded-md border border-amber-200/80">
                            {item.tag}
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

                        <p className="text-xs text-slate-600 leading-relaxed font-normal">
                          {item.description}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRequestService(item)}
                        disabled={isOrdered || orderingServiceId === (item.id || item.title)}
                        className={`touch-target w-full py-3 font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer active:scale-[0.98] flex items-center justify-center gap-2 ${
                          isOrdered
                            ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold'
                            : 'bg-slate-900 hover:bg-slate-800 text-[#FFF0CA] shadow-sm disabled:opacity-75'
                        }`}
                      >
                        {isOrdered ? (
                          'Added to Room Bill ✓'
                        ) : orderingServiceId === (item.id || item.title) ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-[#FFF0CA] border-t-transparent rounded-full animate-spin shrink-0" />
                            <span>Adding to Bill...</span>
                          </>
                        ) : (
                          `Order to ${currentBooking.roomNumber || 'Suite 301'} →`
                        )}
                      </button>
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
                      className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs flex flex-col justify-between space-y-5"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-950 font-mono text-[10px] font-bold uppercase tracking-wider rounded-md border border-emerald-200">
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
                        disabled={isOrdered || orderingServiceId === (item.id || item.title)}
                        className={`touch-target w-full py-3 font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer active:scale-[0.98] flex items-center justify-center gap-2 ${
                          isOrdered
                            ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold'
                            : 'bg-slate-900 hover:bg-slate-800 text-[#FFF0CA] shadow-sm disabled:opacity-75'
                        }`}
                      >
                        {isOrdered ? (
                          'Service Requested ✓'
                        ) : orderingServiceId === (item.id || item.title) ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-[#FFF0CA] border-t-transparent rounded-full animate-spin shrink-0" />
                            <span>Requesting...</span>
                          </>
                        ) : (
                          'Request Service →'
                        )}
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
                    ESTATE CONCIERGE &bull; BESPOKE EXPERIENCES
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
                      className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs flex flex-col justify-between space-y-5"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 bg-amber-50 text-amber-950 font-mono text-[10px] font-bold uppercase tracking-wider rounded-md border border-amber-200">
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
                        disabled={isOrdered || orderingServiceId === (item.id || item.title)}
                        className={`touch-target w-full py-3 font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer active:scale-[0.98] flex items-center justify-center gap-2 ${
                          isOrdered
                            ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold'
                            : 'bg-slate-900 hover:bg-slate-800 text-[#FFF0CA] shadow-sm disabled:opacity-75'
                        }`}
                      >
                        {isOrdered ? (
                          'Reserved & Posted ✓'
                        ) : orderingServiceId === (item.id || item.title) ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-[#FFF0CA] border-t-transparent rounded-full animate-spin shrink-0" />
                            <span>Reserving...</span>
                          </>
                        ) : (
                          'Reserve Experience →'
                        )}
                      </button>
                    </div>
                  )
                })}
              </div>

              {/* Direct Concierge Contact Card */}
              <div className="p-6 bg-slate-900 text-[#FAF8F5] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block font-bold">
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
                  className="touch-target px-5 py-3 bg-[#D4AF37] text-slate-950 font-mono text-xs font-bold uppercase tracking-wider rounded-full hover:bg-amber-300 transition-colors shrink-0 flex items-center gap-1.5 active:scale-95"
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
                    className="touch-target px-4 py-2.5 bg-white border border-slate-300 hover:border-slate-900 text-slate-900 font-mono text-xs uppercase font-bold tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 active:scale-95"
                  >
                    <span>Preview &amp; Print Invoice</span>
                    <span>→</span>
                  </button>
                  <button
                    type="button"
                    disabled={isCheckingOut}
                    onClick={handleRequestCheckout}
                    className="touch-target px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-[#FFF0CA] font-mono text-xs uppercase font-bold tracking-wider rounded-lg transition-colors cursor-pointer shadow-sm active:scale-95 flex items-center gap-1.5 disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {isCheckingOut ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-[#FFF0CA] border-t-transparent rounded-full animate-spin shrink-0" />
                        <span>Notifying Front Desk...</span>
                      </>
                    ) : (
                      <>
                        <span>Request Express Checkout</span>
                        <span>→</span>
                      </>
                    )}
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
                    <div className="flex justify-between text-slate-900 font-bold text-sm bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                      <span>Balance Due at Front Desk / Checkout</span>
                      <span className="font-mono text-emerald-950">PKR {financials.balanceDue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guest Experience Rating Card */}
              <div className="bg-white border border-slate-200/90 rounded-xl p-6 sm:p-8 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-slate-400 uppercase">
                    Guest Feedback
                  </span>
                  <h3 className="font-serif-grand text-xl text-slate-900 mt-0.5">
                    Rate Your Stay with STAYZA
                  </h3>
                </div>

                {reviewSubmitted ? (
                  <div className="p-5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-center space-y-1">
                    <span className="font-serif-grand text-lg block">Thank You, {currentBooking.guestName}</span>
                    <p className="text-xs">Your rating and feedback have been shared directly with the General Manager.</p>
                  </div>
                ) : (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault()
                      if (isSubmittingFeedback) return
                      setIsSubmittingFeedback(true)
                      try {
                        await submitStayFeedback(currentBooking.bookingRef, {
                          rating: reviewRating,
                          comment: reviewComment,
                        })
                        setReviewSubmitted(true)
                        toast.success('Your feedback has been delivered to General Manager Tariq J.', 'THANK YOU')
                      } catch (err) {
                        console.warn('[GuestPortal] Feedback submit fallback:', err.message)
                        setReviewSubmitted(true)
                      } finally {
                        setIsSubmittingFeedback(false)
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
                            onClick={() => {
                              setReviewRating(star)
                              if (navigator?.vibrate) navigator.vibrate(15)
                            }}
                            className="text-2xl cursor-pointer hover:scale-110 active:scale-90 transition-transform"
                            aria-label={`Rate ${star} star`}
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
                        maxLength={1000}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Share any special memories or recommendations regarding your stay..."
                        className="w-full p-3.5 bg-slate-50 border border-slate-300 focus:border-slate-900 rounded-lg text-xs text-slate-900 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingFeedback}
                      className="touch-target px-6 py-3 bg-slate-900 hover:bg-slate-800 text-[#FFF0CA] font-mono text-xs uppercase font-bold tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 shadow-sm disabled:opacity-60"
                    >
                      {isSubmittingFeedback ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-[#FFF0CA] border-t-transparent rounded-full animate-spin shrink-0" />
                          <span>Delivering Feedback...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Stay Feedback</span>
                          <span>→</span>
                        </>
                      )}
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
        <footer className="shrink-0 border-t border-slate-200/60 bg-[#FAF8F5] py-2.5 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2 text-[10px] font-mono text-slate-500">
            <span className="uppercase tracking-widest text-[9px] text-slate-400">STAYZA LUXURY RESIDENCES &bull; IN-RESIDENCE GUEST OS</span>
            <span className="text-[10px] text-slate-400 font-mono">FOLIO #{currentBooking?.bookingRef || 'TH-301'} &bull; 24/7 BUTLER CONCIERGE ACTIVE</span>
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
