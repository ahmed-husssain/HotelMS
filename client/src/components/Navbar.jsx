import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'

/**
 * LuxuryStay Minimalist Navigation
 * Inspired by Aman Resorts & Ahmed Hussain (ahmedev.web.app):
 * - Left: Rolling monogram text reveal on hover (Kyoto Sanctuaries -> LuxuryStay · 2026)
 * - Center: Understated, quiet editorial wordmark
 * - Right: Slot-machine vertical flip links + dynamic sliding hairline indicator
 * - Three-Pill Animated Menu Button: Morphs 3 horizontal pills into an 'X' with smooth physics
 * - Big Picture Liquid Curve Drawer: Full-height architectural overlay with curved SVG edge and staggered rotating links
 * - Scroll behavior: Graceful auto-hide on scroll (>100px) with pop-in floating corner trigger
 */
export default function Navbar({ onOpenDrawer }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 })
  const navTrackRef = useRef(null)

  // Live date for the floating corner pill and drawer footer
  const { dateLabel, fullDateLabel } = useMemo(() => {
    const now = new Date()
    const day = now.getDate()
    const month = now.toLocaleString('en-US', { month: 'short' }).toUpperCase()
    const year = now.getFullYear()
    return {
      dateLabel: `${day} ${month}`,          // e.g. "16 NOV"
      fullDateLabel: `${day} ${month} ${year}` // e.g. "16 NOV 2026"
    }
  }, [])

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when big picture menu is open
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

  // Escape key closes menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

  // Dynamic sliding hairline underline tracking
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

  const navLinks = [
    { num: '01', label: 'Residences', href: '#residences', desc: 'Private Monolithic Sanctuaries' },
    { num: '02', label: 'The Estate', href: '#experience', desc: 'Thermal Onsen & Alpine Gardens' },
    { num: '03', label: 'Staff PMS', href: '/pms', isRouter: true, desc: 'Operational Console & Folio' },
  ]

  return (
    <>
      {/* ============================================================== */}
      {/* 1. MAIN MINIMALIST HEADER */}
      {/* ============================================================== */}
      <header
        className={`fixed top-0 inset-x-0 z-40 px-6 sm:px-10 md:px-14 py-6 sm:py-8 flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] select-none pointer-events-none ${
          isScrolled ? '-translate-y-6 opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        {/* LEFT: Rolling Monogram Emblem */}
        <div className="pointer-events-auto flex items-center h-8">
          <Link
            to="/"
            className="group flex items-center gap-2 h-8 text-xs font-mono tracking-tight text-slate-900 focus-visible:outline-none active:scale-[0.97] transition-transform duration-100 ease-[cubic-bezier(0.16,1,0.3,1)]"
          >
            <span className="text-slate-400 font-normal select-none leading-none">&copy;</span>
            <span className="relative inline-flex items-center overflow-hidden h-8 w-[164px]">
              <span className="absolute inset-0 flex items-center whitespace-nowrap transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-[115%] will-change-transform leading-none text-slate-900 font-normal">
                Kyoto Sanctuaries
              </span>
              <span className="absolute inset-0 flex items-center whitespace-nowrap font-medium text-slate-900 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] translate-x-[115%] group-hover:translate-x-0 will-change-transform leading-none">
                LuxuryStay &middot; 2026
              </span>
            </span>
          </Link>
        </div>

        {/* CENTER: Aman-Style Quiet Wordmark */}
        <div className="pointer-events-auto hidden md:flex items-center">
          <Link
            to="/"
            className="font-serif-grand text-xl sm:text-2xl tracking-[0.28em] uppercase text-slate-900 font-normal hover:opacity-75 transition-opacity"
          >
            LUXURYSTAY
          </Link>
        </div>

        {/* RIGHT: Links + Aman Slim Button + Three-Pill Menu Trigger */}
        <div className="pointer-events-auto flex items-center gap-5 sm:gap-7">
          {/* Desktop Nav Links with Sliding Indicator */}
          <nav
            ref={navTrackRef}
            onMouseLeave={handleMouseLeave}
            className="hidden md:flex items-center h-8 gap-7 relative"
            aria-label="Main Navigation"
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

          {/* Aman Slim Reserve Button */}
          <button
            type="button"
            onClick={onOpenDrawer}
            className="px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-[#FAF8F5] transition-all duration-300 active:scale-[0.97] cursor-pointer"
          >
            Reserve
          </button>

          {/* Three-Pill Menu Trigger Button (Top Right) */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            className="group relative w-10 h-10 rounded-full border border-slate-300 hover:border-slate-900 bg-[#FAF8F5]/80 hover:bg-[#FAF8F5] flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-xs"
          >
            <div className="relative w-4 h-3 flex flex-col justify-between items-center pointer-events-none">
              <span
                className={`w-4 h-[1.5px] bg-slate-900 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isMenuOpen ? 'translate-y-[5px] rotate-45' : ''
                }`}
              />
              <span
                className={`w-4 h-[1.5px] bg-slate-900 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'
                }`}
              />
              <span
                className={`w-4 h-[1.5px] bg-slate-900 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isMenuOpen ? '-translate-y-[5.5px] -rotate-45' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. SCROLLED FLOATING CORNER TRIGGER (Pops in when scrolled > 100px) */}
      {/* ============================================================== */}
      <div
        className={`fixed top-5 right-6 sm:top-6 sm:right-10 z-50 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${
          isScrolled || isMenuOpen
            ? 'scale-100 opacity-100 pointer-events-auto'
            : 'scale-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2 bg-[#FAF8F5]/90 backdrop-blur-md border border-slate-300 p-1.5 pl-3.5 rounded-full shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-slate-800">
            {dateLabel}
          </span>
          <button
            type="button"
            onClick={onOpenDrawer}
            className="px-3 py-1 bg-slate-900 text-[#FAF8F5] text-[10px] font-mono uppercase tracking-wider rounded-full hover:bg-slate-800 transition-colors ml-1 cursor-pointer active:scale-95"
          >
            Reserve
          </button>

          {/* Three-Pill Morphing Button inside Scrolled Capsule */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            className="w-8 h-8 rounded-full hover:bg-slate-200/70 flex items-center justify-center cursor-pointer transition-colors active:scale-95"
          >
            <div className="relative w-3.5 h-2.5 flex flex-col justify-between items-center pointer-events-none">
              <span
                className={`w-3.5 h-[1.5px] bg-slate-900 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isMenuOpen ? 'translate-y-[4px] rotate-45' : ''
                }`}
              />
              <span
                className={`w-3.5 h-[1.5px] bg-slate-900 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'
                }`}
              />
              <span
                className={`w-3.5 h-[1.5px] bg-slate-900 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isMenuOpen ? '-translate-y-[4.5px] -rotate-45' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. BIG PICTURE LIQUID CURVE NAVIGATION DRAWER */}
      {/* Denis Snellenberg / Ahmed Hussain Signature Curve Drawer */}
      {/* ============================================================== */}
      {/* Backdrop */}
      <div
        onClick={closeMenu}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Slide-in Curved Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Big Picture Navigation Menu"
        className="fixed top-0 right-0 bottom-0 z-40 w-full sm:w-[480px] md:w-[540px] max-h-[100dvh] bg-[#FAF8F5] transition-transform duration-600 ease-[cubic-bezier(0.76,0,0.24,1)] will-change-transform shadow-2xl"
        style={{
          transform: isMenuOpen ? 'translate3d(0, 0, 0)' : 'translate3d(calc(100% + 100px), 0, 0)',
        }}
      >
        {/* Organic Liquid Curve SVG Path (Left Edge of Drawer) */}
        <div
          className="absolute top-0 -left-[79px] sm:-left-[99px] w-[80px] sm:w-[100px] h-full pointer-events-none select-none -mr-px hidden sm:block z-20 text-[#FAF8F5]"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 100 1000"
            fill="currentColor"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path d="M100,0 L100,1000 Q0,500 100,0 Z" />
          </svg>
        </div>

        {/* Drawer Content */}
        <div className="relative w-full h-full flex flex-col justify-between p-8 sm:p-12 overflow-y-auto z-10">
          
          {/* Drawer Top Strip */}
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-slate-500 border-b border-slate-200/80 pb-4 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span className="text-slate-800 font-semibold">// NAVIGATION</span>
              <span className="text-slate-300">&middot;</span>
              <span>KYOTO HIGASHIYAMA</span>
            </div>
          </div>

          {/* Staggered Big Picture Links with Rotation Entrance */}
          <nav className="my-auto py-8 space-y-5 shrink-0" aria-label="Big Picture Menu Links">
            {navLinks.map((item, index) => {
              const delay = 120 + index * 70
              const linkContent = (
                <div
                  className="group block py-2 border-b border-slate-200/60 hover:border-slate-900 transition-colors"
                  onClick={closeMenu}
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-slate-400 group-hover:text-emerald-800 transition-colors">
                      [{item.num}]
                    </span>
                    <span className="font-serif-grand text-3xl sm:text-4xl text-slate-900 font-normal group-hover:translate-x-2 transition-transform duration-300">
                      {item.label}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-500 tracking-wider block mt-1 pl-10">
                    {item.desc}
                  </span>
                </div>
              )

              return (
                <div
                  key={item.label}
                  className="overflow-hidden will-change-transform"
                  style={{
                    transform: isMenuOpen
                      ? 'translate3d(0, 0, 0) rotate(0deg)'
                      : 'translate3d(0, 120%, 0) rotate(3deg)',
                    opacity: isMenuOpen ? 1 : 0,
                    transition: isMenuOpen
                      ? `transform 550ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, opacity 400ms ease ${delay}ms`
                      : 'transform 200ms cubic-bezier(0.23, 1, 0.32, 1), opacity 160ms ease-out',
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

            {/* Direct Reserve Action Link */}
            <div
              className="overflow-hidden will-change-transform pt-2"
              style={{
                transform: isMenuOpen
                  ? 'translate3d(0, 0, 0) rotate(0deg)'
                  : 'translate3d(0, 120%, 0) rotate(3deg)',
                opacity: isMenuOpen ? 1 : 0,
                transition: isMenuOpen
                  ? 'transform 550ms cubic-bezier(0.16, 1, 0.3, 1) 330ms, opacity 400ms ease 330ms'
                  : 'transform 200ms cubic-bezier(0.23, 1, 0.32, 1), opacity 160ms ease-out',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  closeMenu()
                  onOpenDrawer()
                }}
                className="w-full py-4 px-6 bg-slate-900 text-[#FAF8F5] text-xs font-mono uppercase tracking-[0.25em] font-semibold hover:bg-emerald-950 transition-colors flex items-center justify-between cursor-pointer active:scale-[0.98]"
              >
                <span>Reserve Residence (30% Online)</span>
                <span>&rarr;</span>
              </button>
            </div>
          </nav>

          {/* Drawer Bottom Meta Information */}
          <div className="border-t border-slate-200/80 pt-6 text-[10px] font-mono text-slate-500 space-y-1.5 shrink-0">
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
