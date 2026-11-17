import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BrandLogo from './BrandLogo'

/**
 * Polished Minimal Luxury Footer for Habitas
 * 
 * Features:
 * - Reduced vertical height with zero empty dead space
 * - Warm alabaster palette (#FAF8F5) matching the rest of the site
 * - Simple, plain-English wording
 * - Live Estate Telemetry (PKT Asia/Karachi UTC+5)
 * - Three suites with exact nightly rates and direct reserve links
 * - Experiences, Guest Portal, Staff PMS Terminal, and direct Concierge contacts
 * - Accolades and smooth Back to Top action
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
    }, 4500)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="w-full bg-[#FAF8F5] text-[#121619] border-t border-[#E5DFD5] font-sans-clean">
      {/* ============================================================== */}
      {/* 1. NEWSLETTER & GUEST INVITATION BAR (COMPACT HEIGHT) */}
      {/* ============================================================== */}
      <div className="border-b border-[#E5DFD5] py-7 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-700"></span>
              <span className="text-[10px] font-mono tracking-[0.25em] font-bold uppercase text-emerald-950">
                STAY CONNECTED
              </span>
            </div>
            <h3 className="font-cinzel text-xl sm:text-2xl font-semibold text-[#121619] tracking-tight">
              Join Our Private Guest List
            </h3>
            <p className="text-xs text-[#5C646A] leading-relaxed">
              Seasonal suite openings, private dining invitations, and exclusive updates directly from the concierge.
            </p>
          </div>

          <div className="w-full md:w-auto">
            {isSubmitted ? (
              <div className="p-2.5 px-4 bg-emerald-50 border border-emerald-300 rounded-[2px] text-xs font-mono text-emerald-950 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>Thank you. You have been added to our private guest list.</span>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="flex gap-2 w-full md:w-80 lg:w-96">
                <input
                  type="email"
                  required
                  value={inquiryEmail}
                  onChange={(e) => setInquiryEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 bg-white border border-[#DDD7CE] px-3.5 py-2 text-xs text-[#121619] placeholder:text-[#8E877C] rounded-[2px] focus:outline-none focus:border-[#121619] focus:ring-1 focus:ring-[#121619] transition-all font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#121619] hover:bg-[#252B30] text-[#FFF0CA] font-mono text-xs font-semibold uppercase tracking-wider rounded-[2px] transition-all cursor-pointer shrink-0 active:scale-95 shadow-xs flex items-center gap-1.5"
                >
                  <span>Join</span>
                  <span className="text-xs">&rarr;</span>
                </button>
              </form>
            )}
            <span className="block text-[10px] text-[#8E877C] font-mono mt-1.5">
              Zero spam. Unsubscribe at any time.
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. MAIN 4-COLUMN BALANCED DIRECTORY (COMPACT HEIGHT) */}
      {/* ============================================================== */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-9 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Column 1: Brand, About & Live Estate Clock (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <BrandLogo variant="full" theme="dark" size="sm" to="/" />
            </div>

            <p className="text-xs text-[#5C646A] leading-relaxed max-w-sm">
              A private coastal retreat built along the Sindh cliffs. Just three secluded residences designed for quiet luxury, open ocean horizons, and attentive personal service.
            </p>

            {/* Live Estate Telemetry Card */}
            <div className="p-3 bg-white border border-[#E5DFD5] rounded-[2px] space-y-1.5 font-mono text-xs text-[#5C646A] max-w-sm shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#8E877C] uppercase tracking-wider font-semibold">ESTATE TIME:</span>
                <span className="font-bold text-[#121619] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span>{estateTime || '15:45:00 PKT'}</span>
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#5C646A] pt-1.5 border-t border-[#F0EBE3]">
                <span>Sindh Coast &bull; 24°48'N, 67°01'E</span>
                <span className="text-amber-800 font-semibold">24°C &bull; Calm</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#8E877C] pt-0.5">
                <span>Check-in: 15:00</span>
                <span>Check-out: 12:00</span>
              </div>
            </div>
          </div>

          {/* Column 2: Residences & Rates (3 cols) */}
          <div className="lg:col-span-3 space-y-2.5">
            <span className="text-[10px] font-mono tracking-[0.25em] font-bold text-[#121619] uppercase block pb-1.5 border-b border-[#E5DFD5]">
              01 &bull; OUR SUITES
            </span>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/reserve?room=301" className="block group transition-transform duration-200 hover:translate-x-1">
                  <span className="font-semibold text-[#121619] group-hover:text-amber-800 transition-colors block">
                    The Horizon Penthouse
                  </span>
                  <span className="text-[11px] text-[#5C646A] font-mono block">
                    Suite 301 &bull; 210 m² &bull; PKR 110,000 / night
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/reserve?room=204" className="block group transition-transform duration-200 hover:translate-x-1">
                  <span className="font-semibold text-[#121619] group-hover:text-amber-800 transition-colors block">
                    The Courtyard Villa
                  </span>
                  <span className="text-[11px] text-[#5C646A] font-mono block">
                    Villa 204 &bull; 165 m² &bull; PKR 75,000 / night
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/reserve?room=102" className="block group transition-transform duration-200 hover:translate-x-1">
                  <span className="font-semibold text-[#121619] group-hover:text-amber-800 transition-colors block">
                    The Ocean Pavilion
                  </span>
                  <span className="text-[11px] text-[#5C646A] font-mono block">
                    Pavilion 102 &bull; 185 m² &bull; PKR 95,000 / night
                  </span>
                </Link>
              </li>
              <li className="pt-1.5 border-t border-[#F0EBE3]">
                <Link to="/reserve?room=102" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#121619] hover:text-amber-800 transition-colors">
                  <span>View Live Room Calendar</span>
                  <span>&rarr;</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resort Experiences (2 cols) */}
          <div className="lg:col-span-2 space-y-2.5">
            <span className="text-[10px] font-mono tracking-[0.25em] font-bold text-[#121619] uppercase block pb-1.5 border-b border-[#E5DFD5]">
              02 &bull; EXPERIENCES
            </span>
            <ul className="space-y-2 text-xs text-[#5C646A]">
              <li>
                <a href="#experience" className="block group transition-transform duration-200 hover:translate-x-1">
                  <span className="font-medium text-[#121619] group-hover:text-amber-800 transition-colors block">
                    Cedar Spa &amp; Baths
                  </span>
                  <span className="text-[11px] text-[#8E877C] block">Saltwater soaking tubs</span>
                </a>
              </li>
              <li>
                <a href="#experience" className="block group transition-transform duration-200 hover:translate-x-1">
                  <span className="font-medium text-[#121619] group-hover:text-amber-800 transition-colors block">
                    Harvest Pavilion
                  </span>
                  <span className="text-[11px] text-[#8E877C] block">Fresh coastal dining</span>
                </a>
              </li>
              <li>
                <a href="#experience" className="block group transition-transform duration-200 hover:translate-x-1">
                  <span className="font-medium text-[#121619] group-hover:text-amber-800 transition-colors block">
                    Underground Valet
                  </span>
                  <span className="text-[11px] text-[#8E877C] block">Private elevator access</span>
                </a>
              </li>
              <li>
                <div className="block">
                  <span className="font-medium text-[#121619] block">Helicopter Transfers</span>
                  <span className="text-[11px] text-[#8E877C] block">Direct on-site pad</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Portals & Direct Concierge (3 cols) */}
          <div className="lg:col-span-3 space-y-2.5">
            <span className="text-[10px] font-mono tracking-[0.25em] font-bold text-[#121619] uppercase block pb-1.5 border-b border-[#E5DFD5]">
              03 &bull; PORTALS &amp; CONTACT
            </span>
            <div className="space-y-2">
              {/* Guest Portal */}
              <Link
                to="/my-stay"
                className="flex items-center justify-between p-2.5 rounded-[2px] bg-white border border-[#E5DFD5] hover:border-[#121619] hover:shadow-2xs transition-all group"
              >
                <div>
                  <span className="font-bold text-xs text-[#121619] block">Guest Portal (My Stay)</span>
                  <span className="text-[10px] text-[#8E877C] font-mono">Digital Key &bull; Room Service</span>
                </div>
                <span className="text-xs text-[#8E877C] group-hover:text-[#121619] group-hover:translate-x-0.5 transition-transform">&rarr;</span>
              </Link>

              {/* Staff PMS */}
              <Link
                to="/pms"
                className="flex items-center justify-between p-2.5 rounded-[2px] bg-white border border-[#E5DFD5] hover:border-[#121619] hover:shadow-2xs transition-all group"
              >
                <div>
                  <span className="font-bold text-xs text-[#121619] block">Staff PMS Terminal</span>
                  <span className="text-[10px] text-[#8E877C] font-mono">Front Desk &bull; Shift Reports</span>
                </div>
                <span className="text-xs text-[#8E877C] group-hover:text-[#121619] group-hover:translate-x-0.5 transition-transform">&rarr;</span>
              </Link>
              
              {/* Direct Contact Box */}
              <div className="pt-2 border-t border-[#F0EBE3] space-y-1 font-mono text-xs">
                <span className="text-[9px] text-[#8E877C] uppercase tracking-wider block font-bold">
                  DIRECT CONCIERGE DESK
                </span>
                <div>
                  <a href="tel:+922138900000" className="font-bold text-[#121619] hover:text-amber-800 transition-colors inline-block">
                    +92 21 3890 0000
                  </a>
                </div>
                <div>
                  <a href="mailto:concierge@habitas.pk" className="text-[#5C646A] hover:text-[#121619] transition-colors inline-block">
                    concierge@habitas.pk
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. BOTTOM HAIRLINE BAR: ACCOLADES, LEGAL, BACK TO TOP */}
      {/* ============================================================== */}
      <div className="border-t border-[#E5DFD5] bg-white/70 px-6 sm:px-10 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] font-mono text-[#5C646A]">
          
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-center md:text-left justify-center md:justify-start">
            <span className="font-bold text-[#121619]">&copy; 2026 Habitas Resort</span>
            <span>&bull;</span>
            <span>Aptech LuxuryStay Hotel Management System</span>
            <span className="hidden sm:inline">&bull;</span>
            <span className="hidden sm:inline text-amber-800 font-semibold">&starf;&starf;&starf; Three Michelin Keys (Preview)</span>
          </div>

          <div className="flex items-center gap-5">
            <span className="hidden lg:inline text-[#8E877C]">Sindh Coast, PK</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="text-[#121619] hover:text-amber-800 font-bold uppercase tracking-wider cursor-pointer flex items-center gap-1 active:scale-95 transition-transform group py-0.5"
              aria-label="Back to top of page"
            >
              <span>Back to Top</span>
              <span className="group-hover:-translate-y-0.5 transition-transform text-xs font-bold">&uarr;</span>
            </button>
          </div>

        </div>
      </div>
    </footer>
  )
}
