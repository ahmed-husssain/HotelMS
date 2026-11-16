import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import BrandLogo from './BrandLogo'

/**
 * LuxuryStay Minimalist Navigation
 * 
 * VIVA DEFENSE & ARCHITECTURE SUMMARY:
 * 1. Self-Contained Modal Architecture:
 *    The slide-over drawer owns its own header, title, and dedicated Close button.
 *    The external floating pill disappears when the drawer opens (`isScrolled && !isMenuOpen`),
 *    preventing the awkward layout overlap seen on mobile/tablet viewports.
 * 
 * 2. 120 FPS GPU-Composited Transitions:
 *    - Replaced heavy multi-pass `backdrop-filter: blur` on animated full-screen backdrops
 *      with a crisp, performant architectural dark wash (`bg-slate-950/60`).
 *    - Isolated the drawer on a dedicated hardware compositing layer (`will-change-transform`).
 *    - Uses `scrollbar-gutter: stable` (in index.css) so locking scroll never shifts viewport width by 15px.
 * 
 * 3. Responsive Fluid Layout:
 *    - Fits smoothly across 320px mobile screens up to ultra-wide displays.
 *    - Uses fluid typography and `overscroll-contain` to prevent vertical clipping on mobile devices.
 */
export default function Navbar({ onOpenDrawer }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 })
  const navTrackRef = useRef(null)

  // 1. Live Date Calculation for the floating pill and drawer footer
  const { dateLabel, fullDateLabel } = useMemo(() => {
    const now = new Date()
    const day = now.getDate()
    const month = now.toLocaleString('en-US', { month: 'short' }).toUpperCase()
    const year = now.getFullYear()
    return {
      dateLabel: `${day} ${month}`,            // e.g. "16 NOV"
      fullDateLabel: `${day} ${month} ${year}`   // e.g. "16 NOV 2026"
    }
  }, [])

  // 2. Track Window Scroll Position (Passive listener for 0-jank scroll detection)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 3. Lock Background Scroll when Drawer is Open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  // 4. Keyboard Accessibility: Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

  // 5. Sliding Underline Indicator on Desktop Nav Links
  const handleMouseEnter = (e) => {
    if (!navTrackRef.current) return
    const trackRect = navTrackRef.current.getBoundingClientRect()
    const linkRect = e.currentTarget.getBoundingClientRect()

    setIndicatorStyle({
      left: linkRect.left - trackRect.left,
      width: linkRect.width,
      opacity: 1,
    })
  }

  const handleMouseLeave = () => {
    setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }))
  }

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  // Navigation Links Data
  const navLinks = [
    { num: '01', label: 'Residences', href: '#residences', desc: 'Private Monolithic Sanctuaries' },
    { num: '02', label: 'The Estate', href: '#experience', desc: 'Thermal Onsen & Alpine Gardens' },
    { num: '03', label: 'Staff PMS', href: '/pms', isRouter: true, desc: 'Operational Console & Folio' },
  ]

  return (
    <>
      {/* ============================================================== */}
      {/* 1. TOP HEADER (Visible at top of page, gracefully fades on scroll) */}
      {/* ============================================================== */}
      <header
        className={`fixed top-0 inset-x-0 z-30 px-5 sm:px-8 md:px-14 py-5 sm:py-7 flex items-center justify-between transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] select-none pointer-events-none ${
          isScrolled ? '-translate-y-6 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
        }`}
      >
        {/* Left: Rolling Monogram Emblem */}
        <div className="pointer-events-auto flex items-center h-8">
          <Link
            to="/"
            className="group flex items-center gap-2 h-8 text-xs font-mono tracking-tight text-slate-900 focus-visible:outline-none active:scale-[0.97] transition-transform duration-100 ease-[cubic-bezier(0.16,1,0.3,1)]"
          >
            <span className="text-slate-400 font-normal select-none leading-none">&copy;</span>
            <span className="relative inline-flex items-center overflow-hidden h-8 w-[130px] sm:w-[175px]">
              <span className="absolute inset-0 flex items-center whitespace-nowrap transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-[115%] will-change-transform leading-none text-slate-900 font-normal">
                Sindh Coast Sanctuaries
              </span>
              <span className="absolute inset-0 flex items-center whitespace-nowrap font-medium text-slate-900 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] translate-x-[115%] group-hover:translate-x-0 will-change-transform leading-none">
                The Haven &middot; 2026
              </span>
            </span>
          </Link>
        </div>

        {/* Center: The Haven Monolithic Emblem & Wordmark */}
        <div className="pointer-events-auto hidden md:flex items-center">
          <BrandLogo variant="full" theme="dark" size="md" />
        </div>

        {/* Right: Desktop Links + Reserve CTA + Three-Pill Menu Trigger */}
        <div className="pointer-events-auto flex items-center gap-4 sm:gap-6">
          {/* Desktop Links with Sliding Hairline Indicator */}
          <nav
            ref={navTrackRef}
            onMouseLeave={handleMouseLeave}
            className="hidden lg:flex items-center h-8 gap-7 relative"
            aria-label="Desktop Navigation"
          >
            <span
              aria-hidden="true"
              className="absolute bottom-0 h-[1.5px] bg-slate-900 pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                transform: `translate3d(${indicatorStyle.left}px, 0, 0)`,
                width: `${indicatorStyle.width}px`,
                opacity: indicatorStyle.opacity,
              }}
            />

            <a
              href="#residences"
              onMouseEnter={handleMouseEnter}
              className="group relative h-8 flex items-center text-xs font-mono uppercase tracking-wider text-slate-700 hover:text-slate-950 transition-colors select-none"
            >
              <span className="relative inline-flex flex-col h-8 overflow-hidden justify-center leading-none">
                <span className="h-8 flex items-center whitespace-nowrap transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full will-change-transform">
                  Residences
                </span>
                <span className="absolute top-full left-0 h-8 flex items-center whitespace-nowrap font-semibold text-slate-900 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full will-change-transform">
                  Residences
                </span>
              </span>
            </a>

            <a
              href="#experience"
              onMouseEnter={handleMouseEnter}
              className="group relative h-8 flex items-center text-xs font-mono uppercase tracking-wider text-slate-700 hover:text-slate-950 transition-colors select-none"
            >
              <span className="relative inline-flex flex-col h-8 overflow-hidden justify-center leading-none">
                <span className="h-8 flex items-center whitespace-nowrap transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full will-change-transform">
                  The Estate
                </span>
                <span className="absolute top-full left-0 h-8 flex items-center whitespace-nowrap font-semibold text-slate-900 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full will-change-transform">
                  The Estate
                </span>
              </span>
            </a>

            <Link
              to="/pms"
              onMouseEnter={handleMouseEnter}
              className="group relative h-8 flex items-center text-xs font-mono uppercase tracking-wider text-slate-700 hover:text-slate-950 transition-colors select-none"
            >
              <span className="relative inline-flex flex-col h-8 overflow-hidden justify-center leading-none">
                <span className="h-8 flex items-center whitespace-nowrap transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full will-change-transform">
                  Staff PMS
                </span>
                <span className="absolute top-full left-0 h-8 flex items-center whitespace-nowrap font-semibold text-slate-900 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full will-change-transform">
                  Staff PMS
                </span>
              </span>
            </Link>
          </nav>

          {/* Reserve Button */}
          <button
            type="button"
            onClick={onOpenDrawer}
            className="px-3.5 sm:px-4 py-2 text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-[#FAF8F5] transition-all duration-300 active:scale-[0.97] cursor-pointer"
          >
            Reserve
          </button>

          {/* Three-Pill Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open Navigation Menu"
            className="group relative w-10 h-10 rounded-full border border-slate-300 hover:border-slate-900 bg-[#FAF8F5] flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-xs"
          >
            <div className="relative w-4 h-3 flex flex-col justify-between items-center pointer-events-none">
              <span className="w-4 h-[1.5px] bg-slate-900 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              <span className="w-4 h-[1.5px] bg-slate-900 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              <span className="w-4 h-[1.5px] bg-slate-900 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]" />
            </div>
          </button>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. SCROLLED FLOATING CORNER PILL */}
      {/* Appears strictly when user is scrolled AND menu is closed */}
      {/* (Never overlaps or interferes with the opened drawer) */}
      {/* ============================================================== */}
      <div
        className={`fixed top-4 right-4 sm:top-6 sm:right-10 z-30 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${
          isScrolled && !isMenuOpen
            ? 'scale-100 opacity-100 pointer-events-auto'
            : 'scale-90 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2 bg-[#FAF8F5]/95 border border-slate-300/80 p-1.5 pl-3.5 rounded-full shadow-md">
          {/* Live Dynamic Date */}
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-slate-800">
            {dateLabel}
          </span>

          {/* Quick Reserve CTA */}
          <button
            type="button"
            onClick={onOpenDrawer}
            className="px-3 py-1 bg-slate-900 text-[#FAF8F5] text-[10px] font-mono uppercase tracking-wider rounded-full hover:bg-slate-800 transition-colors ml-1 cursor-pointer active:scale-95"
          >
            Reserve
          </button>

          {/* Menu Trigger inside Pill */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open Navigation Menu"
            className="w-8 h-8 rounded-full hover:bg-slate-200/70 flex items-center justify-center cursor-pointer transition-colors active:scale-95"
          >
            <div className="relative w-3.5 h-2.5 flex flex-col justify-between items-center pointer-events-none">
              <span className="w-3.5 h-[1.5px] bg-slate-900 rounded-full" />
              <span className="w-3.5 h-[1.5px] bg-slate-900 rounded-full" />
              <span className="w-3.5 h-[1.5px] bg-slate-900 rounded-full" />
            </div>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. FULL-HEIGHT CURVED NAVIGATION DRAWER */}
      {/* Self-contained modal with dedicated header and Close button */}
      {/* ============================================================== */}
      
      {/* Backdrop: Lightweight GPU tint (No expensive Gaussian blur shader) */}
      <div
        onClick={closeMenu}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-slate-950/60 transition-opacity duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Slide-in Drawer Sheet */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
        className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[480px] md:w-[520px] max-h-[100dvh] bg-[#FAF8F5] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform shadow-2xl border-l border-slate-200 flex flex-col justify-between"
        style={{
          transform: isMenuOpen ? 'translate3d(0, 0, 0)' : 'translate3d(100%, 0, 0)',
        }}
      >
        {/* Organic Left Edge Curve for screens >= 640px */}
        <div
          className="absolute top-0 -left-[59px] w-[60px] h-full pointer-events-none select-none hidden sm:block z-20 text-[#FAF8F5]"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 60 1000"
            fill="currentColor"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path d="M60,0 L60,1000 Q0,500 60,0 Z" />
          </svg>
        </div>

        {/* Drawer Body Container */}
        <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-10 md:p-12 overflow-y-auto overscroll-contain z-10">
          
          {/* ========================================================== */}
          {/* DRAWER HEADER: Self-Contained Close Controls & Navigation Tag */}
          {/* ========================================================== */}
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest border-b border-slate-200/80 pb-4 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-slate-900 font-semibold">// NAVIGATION</span>
              <span className="text-slate-300 hidden sm:inline">&middot;</span>
              <span className="text-slate-500 hidden sm:inline text-[10px]">THE HAVEN &bull; SINDH COAST</span>
            </div>

            {/* Dedicated Accessible Close Button */}
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Close Navigation Menu"
              className="group flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-300 hover:border-slate-900 bg-white/90 hover:bg-white text-[10px] font-mono uppercase tracking-wider text-slate-800 transition-all cursor-pointer active:scale-95 shadow-xs"
            >
              <span>Close</span>
              <span className="text-slate-400 group-hover:text-slate-950 font-bold">&times;</span>
            </button>
          </div>

          {/* ========================================================== */}
          {/* DRAWER NAVIGATION LINKS (Staggered Entrance Animation) */}
          {/* ========================================================== */}
          <nav className="my-auto py-6 sm:py-8 space-y-4 sm:space-y-6 shrink-0" aria-label="Menu Links">
            {navLinks.map((item, index) => {
              const delay = 100 + index * 60
              const linkContent = (
                <div
                  className="group block py-2 border-b border-slate-200/60 hover:border-slate-900 transition-colors"
                  onClick={closeMenu}
                >
                  <div className="flex items-baseline gap-3 sm:gap-4">
                    <span className="font-mono text-xs text-slate-400 group-hover:text-emerald-800 transition-colors">
                      [{item.num}]
                    </span>
                    <span className="font-serif-grand text-2xl sm:text-3xl md:text-4xl text-slate-900 font-normal group-hover:translate-x-2 transition-transform duration-300">
                      {item.label}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] sm:text-[11px] text-slate-500 tracking-wider block mt-1 pl-8 sm:pl-10">
                    {item.desc}
                  </span>
                </div>
              )

              return (
                <div
                  key={item.label}
                  className="overflow-hidden will-change-transform"
                  style={{
                    transform: isMenuOpen ? 'translate3d(0, 0, 0)' : 'translate3d(0, 80%, 0)',
                    opacity: isMenuOpen ? 1 : 0,
                    transition: isMenuOpen
                      ? `transform 450ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, opacity 350ms ease ${delay}ms`
                      : 'transform 200ms ease, opacity 150ms ease',
                  }}
                >
                  {item.isRouter ? (
                    <Link to={item.href}>{linkContent}</Link>
                  ) : (
                    <a href={item.href}>{linkContent}</a>
                  )}
                </div>
              )
            })}

            {/* Direct Reserve Residence Action CTA inside Drawer */}
            <div
              className="overflow-hidden will-change-transform pt-2"
              style={{
                transform: isMenuOpen ? 'translate3d(0, 0, 0)' : 'translate3d(0, 80%, 0)',
                opacity: isMenuOpen ? 1 : 0,
                transition: isMenuOpen
                  ? 'transform 450ms cubic-bezier(0.16, 1, 0.3, 1) 280ms, opacity 350ms ease 280ms'
                  : 'transform 200ms ease, opacity 150ms ease',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  closeMenu()
                  onOpenDrawer()
                }}
                className="w-full py-3.5 sm:py-4 px-5 bg-slate-900 text-[#FAF8F5] text-xs font-mono uppercase tracking-[0.22em] font-semibold hover:bg-emerald-950 transition-colors flex items-center justify-between cursor-pointer active:scale-[0.98]"
              >
                <span>Reserve Residence (30% Online)</span>
                <span>&rarr;</span>
              </button>
            </div>
          </nav>

          {/* ========================================================== */}
          {/* DRAWER FOOTER: Metadata & Zero-Trust Architecture Note */}
          {/* ========================================================== */}
          <div className="border-t border-slate-200/80 pt-5 text-[10px] font-mono text-slate-500 space-y-1.5 shrink-0">
            <div className="flex justify-between items-center text-slate-800">
              <span className="uppercase tracking-widest">Active Vacation Window</span>
              <span className="font-semibold">{fullDateLabel}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>LAT: 33&deg;41'N &middot; THERMAL: 41.5&deg;C</span>
              <span className="text-emerald-700 font-semibold uppercase">● 4 Units Ready</span>
            </div>
            <div className="text-slate-400 pt-1 text-[9px] uppercase tracking-wider">
              Zero-Trust Pricing &middot; Safepay Sandbox &middot; 5-Min Atomic Lock
            </div>
          </div>

        </div>
      </aside>
    </>
  )
}
