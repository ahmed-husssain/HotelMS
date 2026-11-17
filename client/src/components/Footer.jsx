import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BrandLogo from './BrandLogo'

/**
 * Ultra-Compact Minimal Luxury Footer for Habitas
 * 
 * Optimized for low vertical footprint (~270px total):
 * - Slim horizontal guest invitation ribbon (42px)
 * - Equalized 4-column directory with zero dead space
 * - Integrated live telemetry & status bar (PKT Asia/Karachi UTC+5)
 * - All essential links preserved: Suites + Rates, Experiences, Portals, Direct Contact
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
    <footer className="w-full bg-[#FAF8F5] text-[#121619] border-t border-[#E5DFD5] font-sans-clean select-none">
      {/* ============================================================== */}
      {/* 1. SLIM HORIZONTAL GUEST INVITATION STRIP (COMPACT ~44px) */}
      {/* ============================================================== */}
      <div className="border-b border-[#E5DFD5] py-3 px-6 sm:px-10 bg-[#F7F4EE]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-cinzel font-bold text-sm text-[#121619] tracking-wide">
              Private Guest List
            </span>
            <span className="hidden md:inline text-[#8E877C] font-mono text-[11px]">&bull;</span>
            <span className="hidden md:inline text-[#5C646A] text-xs">
              Seasonal suite openings &amp; private dining invitations.
            </span>
          </div>

          <div>
            {isSubmitted ? (
              <div className="px-3 py-1 bg-emerald-50 border border-emerald-300 rounded-[2px] text-xs font-mono text-emerald-950 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>You have been added to our private guest list.</span>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="flex items-center gap-2 max-w-sm w-full sm:w-auto">
                <input
                  type="email"
                  required
                  value={inquiryEmail}
                  onChange={(e) => setInquiryEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 sm:w-60 bg-white border border-[#DDD7CE] px-3 py-1.5 text-xs text-[#121619] placeholder:text-[#8E877C] rounded-[2px] focus:outline-none focus:border-[#121619] font-mono"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-[#121619] hover:bg-[#252B30] text-[#FFF0CA] font-mono text-[11px] font-semibold uppercase tracking-wider rounded-[2px] transition-all cursor-pointer shrink-0 active:scale-95 shadow-xs"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. BALANCED 4-COLUMN DIRECTORY (EQUAL HEIGHTS, ZERO DEAD SPACE) */}
      {/* ============================================================== */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-6 sm:py-7">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 items-start">
          
          {/* Column 1: Brand & Direct Contact */}
          <div className="space-y-2">
            <BrandLogo variant="full" theme="dark" size="sm" to="/" />

            <p className="text-[11px] text-[#5C646A] leading-relaxed max-w-xs">
              Quiet coastal sanctuary of three private oceanfront suites along the Sindh cliffs.
            </p>

            <div className="pt-1 space-y-0.5 text-xs font-mono">
              <a href="tel:+922138900000" className="block font-semibold text-[#121619] hover:text-amber-800 transition-colors">
                +92 21 3890 0000
              </a>
              <a href="mailto:concierge@habitas.pk" className="block text-[11px] text-[#5C646A] hover:text-[#121619] transition-colors">
                concierge@habitas.pk
              </a>
            </div>
          </div>

          {/* Column 2: Our Suites with Real Rates */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-[0.2em] font-bold text-[#121619] uppercase block pb-1 border-b border-[#E5DFD5]">
              01 &bull; OUR SUITES
            </span>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link to="/reserve?room=301" className="block group transition-transform duration-200 hover:translate-x-1">
                  <span className="font-medium text-[#121619] group-hover:text-amber-800 transition-colors block text-[11px]">
                    Suite 301 &bull; Penthouse
                  </span>
                  <span className="text-[10px] text-[#8E877C] font-mono block">
                    PKR 110,000 / night
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/reserve?room=204" className="block group transition-transform duration-200 hover:translate-x-1">
                  <span className="font-medium text-[#121619] group-hover:text-amber-800 transition-colors block text-[11px]">
                    Villa 204 &bull; Courtyard
                  </span>
                  <span className="text-[10px] text-[#8E877C] font-mono block">
                    PKR 75,000 / night
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/reserve?room=102" className="block group transition-transform duration-200 hover:translate-x-1">
                  <span className="font-medium text-[#121619] group-hover:text-amber-800 transition-colors block text-[11px]">
                    Pavilion 102 &bull; Ocean
                  </span>
                  <span className="text-[10px] text-[#8E877C] font-mono block">
                    PKR 95,000 / night
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resort Experiences */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-[0.2em] font-bold text-[#121619] uppercase block pb-1 border-b border-[#E5DFD5]">
              02 &bull; EXPERIENCES
            </span>
            <ul className="space-y-1 text-xs text-[#5C646A]">
              <li>
                <a href="#experience" className="block text-[11px] hover:text-amber-800 transition-colors">
                  Cedar Spa &amp; Saltwater Baths
                </a>
              </li>
              <li>
                <a href="#experience" className="block text-[11px] hover:text-amber-800 transition-colors">
                  The Harvest Coastal Pavilion
                </a>
              </li>
              <li>
                <a href="#experience" className="block text-[11px] hover:text-amber-800 transition-colors">
                  Underground Valet &amp; Elevator
                </a>
              </li>
              <li>
                <span className="block text-[11px] text-[#8E877C]">
                  Helipad &amp; Boat Transfers
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Portals */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-[0.2em] font-bold text-[#121619] uppercase block pb-1 border-b border-[#E5DFD5]">
              03 &bull; PORTALS
            </span>
            <div className="space-y-1.5">
              <Link
                to="/my-stay"
                className="flex items-center justify-between p-2 rounded-[2px] bg-white border border-[#E5DFD5] hover:border-[#121619] hover:shadow-2xs transition-all group"
              >
                <div>
                  <span className="font-bold text-xs text-[#121619] block leading-tight">Guest Portal</span>
                  <span className="text-[9px] text-[#8E877C] font-mono">Digital Key &bull; Room Service</span>
                </div>
                <span className="text-xs text-[#8E877C] group-hover:text-[#121619] transition-transform group-hover:translate-x-0.5">&rarr;</span>
              </Link>

              <Link
                to="/pms"
                className="flex items-center justify-between p-2 rounded-[2px] bg-white border border-[#E5DFD5] hover:border-[#121619] hover:shadow-2xs transition-all group"
              >
                <div>
                  <span className="font-bold text-xs text-[#121619] block leading-tight">Staff PMS</span>
                  <span className="text-[9px] text-[#8E877C] font-mono">Front Desk Operations</span>
                </div>
                <span className="text-xs text-[#8E877C] group-hover:text-[#121619] transition-transform group-hover:translate-x-0.5">&rarr;</span>
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. INTEGRATED TELEMETRY & ACCREDITATION BAR (COMPACT ~36px) */}
      {/* ============================================================== */}
      <div className="border-t border-[#E5DFD5] bg-white/80 px-6 sm:px-10 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-[10px] font-mono text-[#5C646A]">
          
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-bold text-[#121619]">&copy; 2026 Habitas</span>
            <span>&bull;</span>
            <span>Sindh Coast (24°48'N, 67°01'E)</span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5 font-bold text-[#121619]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>{estateTime || '16:15:00 PKT'}</span>
            </span>
            <span className="hidden sm:inline">&bull;</span>
            <span className="hidden sm:inline text-amber-800 font-semibold">&starf;&starf;&starf; Three Michelin Keys</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden lg:inline text-[#8E877C]">Aptech LuxuryStay HMS</span>
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
      </div>
    </footer>
  )
}
