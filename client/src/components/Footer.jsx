import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BrandLogo from './BrandLogo'

/**
 * Minimalist Travertine Footer for Habitas
 * 
 * - Single unified #FAF8F5 surface
 * - Minimal wording, zero corporate/marketing fluff
 * - Sleek hairline guest ledger strip (no eCommerce boxes)
 * - Clean typographic directory with subtle hover micro-interactions
 * - Core integrated baseline: Live PKT Time, Safepay 30% Deposit & Top button
 * - Zero separate bottom telemetry strips or fake entity strings
 */
export default function Footer() {
  const [estateTime, setEstateTime] = useState('')
  const [inquiryEmail, setInquiryEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Live ticking estate clock (Pakistan Standard Time / UTC+5)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
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
    <footer className="w-full bg-[#FAF8F5] text-[#121619] border-t border-[#E5DFD5] font-sans-clean select-none relative overflow-hidden">
      
      {/* Subtle Architectural Watermark Monogram */}
      <div 
        aria-hidden="true" 
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[120px] sm:text-[140px] font-cinzel font-bold text-slate-900/[0.025] tracking-[0.25em] pointer-events-none select-none whitespace-nowrap"
      >
        HABITAS
      </div>

      {/* ============================================================== */}
      {/* 1. MINIMAL GUEST LEDGER STRIP (SEAMLESS HAIRLINE) */}
      {/* ============================================================== */}
      <div className="border-b border-[#E5DFD5] px-6 sm:px-10 py-3 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse shrink-0"></span>
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase font-bold text-[#121619]">
              Private Guest Ledger
            </span>
            <span className="text-[#8E877C] font-mono text-[10px]">&bull;</span>
            <span className="text-[#5C646A] text-xs font-light">
              Seasonal suite openings &amp; dining
            </span>
          </div>

          <div className="w-full sm:w-auto">
            {isSubmitted ? (
              <div className="text-xs font-mono text-emerald-900 flex items-center gap-2 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                <span>Email recorded in private ledger.</span>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="flex items-center gap-2 w-full sm:w-80 relative">
                <input
                  type="email"
                  required
                  value={inquiryEmail}
                  onChange={(e) => setInquiryEmail(e.target.value)}
                  placeholder="Enter email for private openings"
                  className="w-full bg-transparent border-b border-[#DDD7CE] focus:border-[#121619] py-1 text-xs text-[#121619] placeholder:text-[#8E877C] font-mono focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  aria-label="Submit email"
                  className="text-xs font-mono text-[#121619] hover:text-amber-800 transition-colors px-1 cursor-pointer"
                >
                  &rarr;
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. CORE DIRECTORY & INTEGRATED BASELINE */}
      {/* ============================================================== */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-10 items-start">
          
          {/* Column 1: Brand & Contact */}
          <div className="space-y-3">
            <BrandLogo variant="full" theme="dark" size="sm" to="/" />

            <p className="text-xs text-[#5C646A] leading-relaxed max-w-xs font-light">
              Quiet coastal sanctuary of three private oceanfront suites along the Sindh cliffs.
            </p>

            <div className="pt-1 space-y-1 text-xs font-mono">
              <a href="tel:+922138900000" className="block font-semibold text-[#121619] hover:text-amber-800 transition-colors">
                +92 21 3890 0000
              </a>
              <a href="mailto:concierge@habitas.pk" className="block text-[11px] text-[#5C646A] hover:text-[#121619] transition-colors">
                concierge@habitas.pk
              </a>
            </div>
          </div>

          {/* Column 2: Residences & Rates */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono tracking-[0.2em] font-bold text-[#121619] uppercase block pb-1 border-b border-[#E5DFD5]">
              01 &bull; RESIDENCES
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/reserve?room=301" className="block group transition-transform duration-200 hover:translate-x-1">
                  <div className="flex items-baseline justify-between">
                    <span className="font-medium text-[#121619] group-hover:text-amber-800 transition-colors">
                      Suite 301 &bull; Penthouse
                    </span>
                    <span className="text-[10px] font-mono text-[#8E877C]">[TH-301]</span>
                  </div>
                  <span className="text-[11px] text-[#8E877C] font-mono block mt-0.5">
                    PKR 110,000 / night
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/reserve?room=204" className="block group transition-transform duration-200 hover:translate-x-1">
                  <div className="flex items-baseline justify-between">
                    <span className="font-medium text-[#121619] group-hover:text-amber-800 transition-colors">
                      Villa 204 &bull; Courtyard
                    </span>
                    <span className="text-[10px] font-mono text-[#8E877C]">[TH-204]</span>
                  </div>
                  <span className="text-[11px] text-[#8E877C] font-mono block mt-0.5">
                    PKR 75,000 / night
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/reserve?room=102" className="block group transition-transform duration-200 hover:translate-x-1">
                  <div className="flex items-baseline justify-between">
                    <span className="font-medium text-[#121619] group-hover:text-amber-800 transition-colors">
                      Pavilion 102 &bull; Ocean
                    </span>
                    <span className="text-[10px] font-mono text-[#8E877C]">[TH-102]</span>
                  </div>
                  <span className="text-[11px] text-[#8E877C] font-mono block mt-0.5">
                    PKR 95,000 / night
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Experiences */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono tracking-[0.2em] font-bold text-[#121619] uppercase block pb-1 border-b border-[#E5DFD5]">
              02 &bull; EXPERIENCES
            </span>
            <ul className="space-y-1.5 text-xs text-[#5C646A]">
              <li>
                <a href="#experience" className="block hover:text-amber-800 transition-colors">
                  Cedar Spa &amp; Saltwater Baths
                </a>
              </li>
              <li>
                <a href="#experience" className="block hover:text-amber-800 transition-colors">
                  The Harvest Coastal Pavilion
                </a>
              </li>
              <li>
                <a href="#experience" className="block hover:text-amber-800 transition-colors">
                  Underground Valet &amp; Helipad
                </a>
              </li>
              <li>
                <a href="#experience" className="block hover:text-amber-800 transition-colors">
                  Private Arabian Boat Charters
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Portals & Access */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono tracking-[0.2em] font-bold text-[#121619] uppercase block pb-1 border-b border-[#E5DFD5]">
              03 &bull; PORTALS
            </span>
            <div className="space-y-2 text-xs">
              <Link
                to="/my-stay"
                className="group block py-1.5 border-b border-[#E5DFD5]/80 hover:border-[#121619] transition-colors"
              >
                <div className="flex items-center justify-between text-[#121619]">
                  <span className="font-medium group-hover:text-amber-800 transition-colors">Guest Portal</span>
                  <span className="font-mono text-xs text-[#8E877C] group-hover:translate-x-1 transition-transform group-hover:text-[#121619]">&rarr;</span>
                </div>
                <span className="text-[10px] font-mono text-[#8E877C] block mt-0.5">
                  Digital Key &bull; In-Stay Folio
                </span>
              </Link>

              <Link
                to="/pms"
                className="group block py-1.5 border-b border-[#E5DFD5]/80 hover:border-[#121619] transition-colors"
              >
                <div className="flex items-center justify-between text-[#121619]">
                  <span className="font-medium group-hover:text-amber-800 transition-colors">Front Desk PMS</span>
                  <span className="font-mono text-xs text-[#8E877C] group-hover:translate-x-1 transition-transform group-hover:text-[#121619]">&rarr;</span>
                </div>
                <span className="text-[10px] font-mono text-[#8E877C] block mt-0.5">
                  Arrivals &bull; Folio Billing
                </span>
              </Link>

              <Link
                to="/housekeeping"
                className="group block py-1.5 border-b border-[#E5DFD5]/80 hover:border-[#121619] transition-colors"
              >
                <div className="flex items-center justify-between text-[#121619]">
                  <span className="font-medium group-hover:text-amber-800 transition-colors">Housekeeping Queue</span>
                  <span className="font-mono text-xs text-[#8E877C] group-hover:translate-x-1 transition-transform group-hover:text-[#121619]">&rarr;</span>
                </div>
                <span className="text-[10px] font-mono text-[#8E877C] block mt-0.5">
                  Room Turnovers &bull; Maintenance
                </span>
              </Link>

              <Link
                to="/login"
                className="group block py-1 text-[11px] font-mono text-[#8E877C] hover:text-[#121619] transition-colors flex items-center justify-between pt-1"
              >
                <span>Staff Sign In</span>
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </Link>
            </div>
          </div>

        </div>

        {/* ============================================================== */}
        {/* CORE BASELINE: TIME & SAFEPAY DEPOSIT (LEFT) & TOP BUTTON (RIGHT) */}
        {/* ============================================================== */}
        <div className="pt-6 mt-6 border-t border-[#E5DFD5] flex items-center justify-between text-xs font-mono text-[#5C646A]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-semibold text-[#121619]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>{estateTime || '17:28:00 PKT'}</span>
            </span>
            <span>&bull;</span>
            <span className="text-[#8E877C]">Safepay 30% Deposit</span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="text-[#121619] hover:text-amber-800 font-bold uppercase tracking-wider cursor-pointer flex items-center gap-1 transition-colors active:scale-95"
            aria-label="Back to top of page"
          >
            <span>Top</span>
            <span className="text-xs">&uarr;</span>
          </button>
        </div>

      </div>
    </footer>
  )
}
