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
 * - Zero separate bottom data strips or fake entity strings
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
      
      {/* Subtle Architectural Watermark Monogram (Desktop & Tablet only to prevent mobile clutter) */}
      <div 
        aria-hidden="true" 
        className="hidden sm:block absolute -bottom-6 left-1/2 -translate-x-1/2 text-[120px] sm:text-[140px] font-serif-grand font-bold text-slate-900/[0.02] tracking-[0.25em] pointer-events-none select-none whitespace-nowrap"
      >
        STAYZA
      </div>

      {/* ============================================================== */}
      {/* 1. MINIMAL GUEST LEDGER STRIP (SEAMLESS HAIRLINE) */}
      {/* ============================================================== */}
      <div className="border-b border-[#E5DFD5] px-6 sm:px-10 py-3 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 shrink-0"></span>
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase font-bold text-[#121619]">
              Stayza Newsletter
            </span>
            <span className="text-[#57534E] font-mono text-[10px]">&bull;</span>
            <span className="text-[#44403C] text-xs font-light">
              Seasonal suite openings &amp; dining
            </span>
          </div>

          <div className="w-full sm:w-auto">
            {isSubmitted ? (
              <div className="text-xs font-mono text-emerald-900 flex items-center gap-2 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                <span>Thank you — you have been added to our private guest list.</span>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="flex items-center gap-2 w-full sm:w-80 relative">
                <input
                  type="email"
                  required
                  maxLength={120}
                  value={inquiryEmail}
                  onChange={(e) => setInquiryEmail(e.target.value)}
                  placeholder="Enter email for private openings"
                  aria-label="Enter email for private openings"
                  className="w-full bg-transparent border-b border-[#DDD7CE] focus:border-[#121619] py-1 text-xs text-[#121619] placeholder:text-[#57534E] font-mono focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  aria-label="Submit email"
                  className="touch-target w-9 h-9 inline-flex items-center justify-center text-xs font-mono text-[#121619] hover:text-amber-800 transition-colors cursor-pointer"
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
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-6 sm:py-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 items-start">
          
          {/* Column 1: Brand & Contact */}
          <div className="space-y-3">
            <BrandLogo variant="full" theme="dark" size="sm" showSubtitle={true} to="/" />

            <p className="text-xs text-[#44403C] leading-relaxed max-w-xs font-light">
              Luxury oceanfront suites and residences with bespoke hospitality.
            </p>

            <div className="pt-2 flex flex-col gap-1 text-xs font-mono">
              <a href="tel:+922138900000" className="inline-flex items-center min-h-[28px] py-1 font-semibold text-[#121619] hover:text-amber-800 transition-colors">
                +92 21 3890 0000
              </a>
              <a href="mailto:hello@stayza.com" className="inline-flex items-center min-h-[28px] py-1 text-[11px] text-[#44403C] hover:text-[#121619] transition-colors">
                hello@stayza.com
              </a>
              <span className="text-[11px] text-[#78716C] leading-normal pt-1 font-sans">
                Beachfront Avenue, Coastal Highway, Thatta, Sindh, Pakistan
              </span>
            </div>
          </div>

          {/* Column 2: Rooms & Suites Rates */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono tracking-[0.2em] font-bold text-[#121619] uppercase block pb-1 border-b border-[#E5DFD5]">
              Rooms &amp; Suites
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/reserve?room=301" className="block group transition-transform duration-200 hover:translate-x-1 py-1">
                  <div className="flex items-baseline justify-between">
                    <span className="font-medium text-[#121619] group-hover:text-amber-800 transition-colors">
                      Suite 301 &bull; Penthouse
                    </span>
                  </div>
                  <span className="text-[11px] text-[#57534E] font-mono block mt-0.5">
                    PKR 110,000 / night
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/reserve?room=204" className="block group transition-transform duration-200 hover:translate-x-1 py-1">
                  <div className="flex items-baseline justify-between">
                    <span className="font-medium text-[#121619] group-hover:text-amber-800 transition-colors">
                      Villa 204 &bull; Courtyard
                    </span>
                  </div>
                  <span className="text-[11px] text-[#57534E] font-mono block mt-0.5">
                    PKR 75,000 / night
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/reserve?room=102" className="block group transition-transform duration-200 hover:translate-x-1 py-1">
                  <div className="flex items-baseline justify-between">
                    <span className="font-medium text-[#121619] group-hover:text-amber-800 transition-colors">
                      Pavilion 102 &bull; Ocean
                    </span>
                  </div>
                  <span className="text-[11px] text-[#57534E] font-mono block mt-0.5">
                    PKR 95,000 / night
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Experiences */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono tracking-[0.2em] font-bold text-[#121619] uppercase block pb-1 border-b border-[#E5DFD5]">
              The Estate
            </span>
            <ul className="space-y-1 text-xs">
              <li>
                <Link to="/estate#spa" className="inline-flex items-center min-h-[28px] py-1 text-[#44403C] hover:text-amber-800 transition-colors">
                  Cedar Spa &amp; Saltwater Baths
                </Link>
              </li>
              <li>
                <Link to="/estate#dining" className="inline-flex items-center min-h-[28px] py-1 text-[#44403C] hover:text-amber-800 transition-colors">
                  The Harvest Coastal Pavilion
                </Link>
              </li>
              <li>
                <Link to="/estate" className="inline-flex items-center min-h-[28px] py-1 text-[#44403C] hover:text-amber-800 transition-colors">
                  Underground Valet &amp; Helipad
                </Link>
              </li>
              <li>
                <Link to="/estate" className="inline-flex items-center min-h-[28px] py-1 text-[#44403C] hover:text-amber-800 transition-colors">
                  Private Arabian Boat Charters
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Portals & Access */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono tracking-[0.2em] font-bold text-[#121619] uppercase block pb-1 border-b border-[#E5DFD5]">
              Portals &amp; Access
            </span>
            <div className="space-y-2 text-xs">
              <Link
                to="/my-stay"
                className="group block py-1.5 border-b border-[#E5DFD5]/80 hover:border-[#121619] transition-colors"
              >
                <div className="flex items-center justify-between text-[#121619]">
                  <span className="font-medium group-hover:text-amber-800 transition-colors">Guest Portal &amp; Key</span>
                  <span className="font-mono text-xs text-[#57534E] group-hover:translate-x-1 transition-transform group-hover:text-[#121619]">&rarr;</span>
                </div>
                <span className="text-[10px] font-mono text-[#57534E] block mt-0.5">
                  Digital NFC Key &bull; Room Service
                </span>
              </Link>

              <Link
                to="/login"
                className="group block py-1.5 border-b border-[#E5DFD5]/80 hover:border-[#121619] transition-colors"
              >
                <div className="flex items-center justify-between text-[#121619]">
                  <span className="font-medium group-hover:text-amber-800 transition-colors">Staff &amp; Guest Sign In</span>
                  <span className="font-mono text-xs text-[#57534E] group-hover:translate-x-1 transition-transform group-hover:text-[#121619]">&rarr;</span>
                </div>
                <span className="text-[10px] font-mono text-[#57534E] block mt-0.5">
                  Automatic Role Detection
                </span>
              </Link>

              <Link
                to="/login"
                className="group block py-1.5 hover:border-[#121619] transition-colors"
              >
                <div className="flex items-center justify-between text-[#44403C]">
                  <span className="text-[11px] font-mono group-hover:text-[#121619] transition-colors flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500 group-hover:bg-emerald-600 transition-colors" />
                    Staff Portal
                  </span>
                  <span className="font-mono text-xs text-[#57534E] group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
                <span className="text-[9px] font-mono text-[#57534E] block mt-0.5 pl-3">
                  Front Desk, Housekeeping &amp; General Manager
                </span>
              </Link>
            </div>
          </div>

        </div>

        {/* ============================================================== */}
        {/* CORE BASELINE: TIME & SAFEPAY DEPOSIT (LEFT) & TOP BUTTON (RIGHT) */}
        {/* ============================================================== */}
        <div className="pt-6 mt-6 border-t border-[#E5DFD5] flex items-center justify-between text-xs font-mono text-[#44403C]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-semibold text-[#121619]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-700"></span>
              <span>{estateTime || '17:28:00 PKT'}</span>
            </span>
            <span>&bull;</span>
            <span className="text-[#57534E] font-medium">Safepay 30% Deposit</span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="touch-target inline-flex items-center text-[#121619] hover:text-amber-800 font-bold uppercase tracking-wider cursor-pointer gap-1 transition-colors active:scale-95 text-xs"
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
