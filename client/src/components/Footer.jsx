import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BrandLogo from './BrandLogo'

/**
 * Editorial Luxury Footer for The Haven
 *
 * Implements:
 * - Live Estate Time telemetry (PKT / UTC+5)
 * - The Guest Ledger (Discreet email inquiry dispatch)
 * - Architecture, Sanctuaries, and Wellness directories
 * - Aptech LuxuryStay HMS curriculum and PMS staff portal gateway
 * - Michelin Keys / Architectural accolades
 * - Smooth "Return to Summit" (Back to Top)
 */
export default function Footer() {
  const [estateTime, setEstateTime] = useState('')
  const [inquiryEmail, setInquiryEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Live ticking estate clock (Pakistan Standard Time / UTC+5)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      // Format as 24-hr time with seconds: e.g. 23:45:12 PKT
      const timeStr = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Karachi',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      setEstateTime(`${timeStr} PKT`)
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleInquirySubmit = (e) => {
    e.preventDefault()
    if (!inquiryEmail) return
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setInquiryEmail('')
    }, 4000)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-[#0B1120] text-slate-300 border-t border-slate-800/80 font-sans-clean selection:bg-emerald-900 selection:text-emerald-100">
      {/* ============================================================== */}
      {/* 1. THE GUEST LEDGER (PRIVATE INQUIRIES DISPATCH) */}
      {/* ============================================================== */}
      <div className="border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-7 space-y-3">
              <span className="text-[10px] tracking-[0.35em] font-bold text-amber-500 uppercase">
                PRIVATE GUEST LEDGER
              </span>
              <h2 className="font-serif-grand text-3xl sm:text-4xl text-[#FAF8F5] font-light tracking-tight leading-tight">
                Discreet Dispatches &amp; Unlisted Openings.
              </h2>
              <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                Join our private guest roll to receive unlisted seasonal residency openings, private marine transfer updates, and architectural monographs directly from the estate concierge.
              </p>
            </div>

            <div className="lg:col-span-5 w-full">
              {isSubmitted ? (
                <div className="p-4 rounded border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 text-xs flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Your correspondence has been received by the private concierge desk.
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    placeholder="Enter your private email address"
                    className="flex-1 bg-slate-900/90 border border-slate-700/80 text-xs text-slate-200 px-4 py-3 focus:outline-none focus:border-amber-500 transition-colors placeholder:text-slate-500 rounded-none"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#FAF8F5] text-slate-950 text-xs font-mono uppercase tracking-[0.2em] font-semibold hover:bg-amber-400 transition-colors active:scale-[0.98] cursor-pointer whitespace-nowrap"
                  >
                    Request Access
                  </button>
                </form>
              )}
              <span className="block text-[10px] text-slate-500 mt-2 tracking-wider">
                Strict discretion observed. Zero marketing spam. Encrypted dispatch.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. MAIN DIRECTORY & ESTATE TELEMETRY */}
      {/* ============================================================== */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 sm:gap-10">
          {/* Brand & Coordinates (Col 1-4) */}
          <div className="lg:col-span-4 space-y-6">
            <BrandLogo variant="full" theme="light" size="md" />

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              An architectural ocean sanctuary built into the coastal limestone cliffs. Three bespoke residential units designed for absolute silence, privacy, and architectural meditation.
            </p>

            {/* Live Estate Telemetry Card */}
            <div className="p-4 rounded-none border border-slate-800 bg-slate-900/60 space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-400 border-b border-slate-800/80 pb-2">
                <span className="text-[10px] tracking-widest text-slate-500 uppercase">ESTATE TIME</span>
                <span className="text-[#FAF8F5] font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {estateTime || '23:00:00 PKT'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] tracking-widest text-slate-500 uppercase">COORDINATES</span>
                <span className="text-slate-300 text-[11px]">24°48&apos;36&quot; N &bull; 67°01&apos;12&quot; E</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] tracking-widest text-slate-500 uppercase">LOCATION</span>
                <span className="text-slate-300 text-[11px]">Sindh Coast, Arabian Sea</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] tracking-widest text-slate-500 uppercase">ATMOSPHERE</span>
                <span className="text-amber-400/90 text-[11px]">23&deg;C &bull; Calm Tides &bull; Secluded</span>
              </div>
            </div>
          </div>

          {/* Directory Column 1: The Sanctuaries (Col 5-6) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-mono text-xs font-bold text-[#FAF8F5] tracking-[0.25em] uppercase border-b border-slate-800 pb-2">
              THE SANCTUARIES
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a href="#residences" className="hover:text-amber-400 transition-colors block">
                  <span className="text-[#FAF8F5] block font-medium">The Horizon Penthouse</span>
                  <span className="text-[11px] text-slate-500">Suite 301 &bull; 210 m² &bull; Cantilevered Reef Pool</span>
                </a>
              </li>
              <li>
                <a href="#residences" className="hover:text-amber-400 transition-colors block">
                  <span className="text-[#FAF8F5] block font-medium">The Courtyard Villa</span>
                  <span className="text-[11px] text-slate-500">Villa 204 &bull; 165 m² &bull; Kyoto Cedar Garden</span>
                </a>
              </li>
              <li>
                <a href="#residences" className="hover:text-amber-400 transition-colors block">
                  <span className="text-[#FAF8F5] block font-medium">The Cliffside Pavilion</span>
                  <span className="text-[11px] text-slate-500">Pavilion 102 &bull; 140 m² &bull; Monolithic Sea Arch</span>
                </a>
              </li>
              <li>
                <span className="text-[11px] text-amber-500/90 tracking-wider uppercase block pt-1">
                  &bull; 100% Uninterrupted Seclusion
                </span>
              </li>
            </ul>
          </div>

          {/* Directory Column 2: Experiences & Amenities (Col 7-9) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-mono text-xs font-bold text-[#FAF8F5] tracking-[0.25em] uppercase border-b border-slate-800 pb-2">
              EXPERIENCES
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a href="#experience" className="hover:text-amber-400 transition-colors block">
                  <span className="text-[#FAF8F5] block font-medium">Hinoki Cedar Wellness</span>
                  <span className="text-[11px] text-slate-500">Thermal hydrotherapy baths above tide level</span>
                </a>
              </li>
              <li>
                <a href="#experience" className="hover:text-amber-400 transition-colors block">
                  <span className="text-[#FAF8F5] block font-medium">The Harvest Pavilion</span>
                  <span className="text-[11px] text-slate-500">Zero-kilometer organic coastal dining</span>
                </a>
              </li>
              <li>
                <a href="#experience" className="hover:text-amber-400 transition-colors block">
                  <span className="text-[#FAF8F5] block font-medium">Subterranean Valet</span>
                  <span className="text-[11px] text-slate-500">Soundless in-residence arrivals, zero lobbies</span>
                </a>
              </li>
              <li>
                <span className="hover:text-slate-300 transition-colors block cursor-default">
                  <span className="text-[#FAF8F5] block font-medium">Marine &amp; Helipad Charters</span>
                  <span className="text-[11px] text-slate-500">Direct coordinate arrivals via private pad</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Directory Column 3: Portals & HMS Architecture (Col 10-12) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-mono text-xs font-bold text-[#FAF8F5] tracking-[0.25em] uppercase border-b border-slate-800 pb-2">
              SYSTEM &amp; STAFF
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link
                  to="/pms"
                  className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold transition-colors"
                >
                  <span>Staff PMS Terminal</span>
                  <span>&rarr;</span>
                </Link>
                <span className="text-[10px] text-slate-500 block">Front Desk, Folio &amp; Z-Report</span>
              </li>
              <li className="pt-2 border-t border-slate-800/80">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                  Curriculum Engine
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Aptech LuxuryStay HMS
                </span>
              </li>
              <li>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                  Payments Architecture
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Safepay 30% Advance + Folio
                </span>
              </li>
              <li>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                  Concurrency Control
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  5-Min Atomic Lock
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. LUXURY ACCOLADES & ARCHITECTURAL BADGES */}
      {/* ============================================================== */}
      <div className="border-t border-slate-800/80 bg-slate-950/60 py-6">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex flex-wrap items-center justify-between gap-6 text-[11px] text-slate-400 font-mono tracking-wider">
          <div className="flex flex-wrap items-center gap-6 sm:gap-10">
            <span className="flex items-center gap-2">
              <span className="text-amber-400">&#9733;&#9733;&#9733;</span>
              <span>THREE MICHELIN KEYS (PREVIEW)</span>
            </span>
            <span className="hidden sm:inline text-slate-700">&bull;</span>
            <span>ARCHITECTURAL DIGEST SANCTUARY 2026</span>
            <span className="hidden sm:inline text-slate-700">&bull;</span>
            <span>100% CARBON NEUTRAL OPERATION</span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-2 text-slate-400 hover:text-[#FAF8F5] transition-colors uppercase tracking-[0.2em] font-semibold text-[10px] cursor-pointer"
            aria-label="Return to top of page"
          >
            <span>Return to Summit</span>
            <span className="text-amber-400">&uarr;</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. SUB-FOOTER LEGAL & ACADEMIC CREDITS */}
      {/* ============================================================== */}
      <div className="border-t border-slate-900 bg-[#070B14] py-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span className="font-cinzel text-xs font-semibold tracking-[0.2em] text-[#FAF8F5]">
              THE HAVEN
            </span>
            <span className="hidden sm:inline text-slate-600">&bull;</span>
            <span className="text-[11px] text-slate-400">
              An Aptech Luxury Hospitality Curriculum System &bull; LuxuryStay MERN Implementation
            </span>
          </div>

          <div className="flex items-center gap-6 text-[11px] text-slate-400 tracking-wider">
            <span>Sindh Coast, PK</span>
            <span>&copy; 2026</span>
            <Link to="/pms" className="text-amber-400/90 hover:text-amber-300 transition-colors">
              Staff Portal &rarr;
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
