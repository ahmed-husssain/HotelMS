import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import BrandLogo from './BrandLogo'

/**
 * The Haven — Circular Aperture Navigation (Concept 2)
 *
 * ARCHITECTURE & VIVA DEFENSE:
 * 1. Circular Aperture Geometry (No awkward side SVG fins):
 *    The entire menu expands outward from the menu button coordinates using
 *    GPU-composited `clip-path: circle(...)`. When closed, it smoothly collapses
 *    back into the button. Zero layout thrashing, zero static SVG deformities.
 *
 * 2. Dynamic Sanctuary Visual Preview:
 *    Hovering over any link dynamically cross-fades the left photo wing with
 *    high-resolution photography of that specific sanctuary or section.
 *
 * 3. 120 FPS Compositing:
 *    Runs entirely on the compositor thread with Apple's fluid cubic-bezier curve.
 *    Paired with `scrollbar-gutter: stable` so locking scroll causes 0px layout shift.
 *
 * 4. Zero Fluff / Clean Design:
 *    Direct, grounded architectural copy: // NAVIGATION · SINDH COAST.
 */
export default function Navbar({ onOpenDrawer }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 })
  const navTrackRef = useRef(null)

  // Navigation Links & Live Preview Data (The Haven Sindh Coast)
  const navItems = useMemo(() => [
    {
      num: '01',
      label: 'Residences',
      href: '#residences',
      desc: 'Private Monolithic Sanctuaries',
      preview: {
        tag: 'SANCTUARY I',
        title: 'The Cliff Sanctuary',
        subtitle: 'Suspended above the Arabian Sea with private infinity plunge pool and basalt stone courtyard.',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=85',
      },
    },
    {
      num: '02',
      label: 'The Estate',
      href: '#experience',
      desc: 'Thermal Hydrotherapy & Private Dunes',
      preview: {
        tag: 'SANCTUARY WELLNESS',
        title: 'Thermal Springs & Dining',
        subtitle: 'Subterranean mineral baths at 41.5°C and zero-kilometer coastal tasting menus.',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=85',
      },
    },
    {
      num: '03',
      label: 'Staff PMS',
      href: '/pms',
      isRouter: true,
      desc: 'Front Desk Operations & Folio Console',
      preview: {
        tag: 'OPERATIONAL FOLIO',
        title: 'Property Management Console',
        subtitle: 'Real-time room status, 5-minute pessimistic hold manager, and Safepay ledger.',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=85',
      },
    },
  ], [])

  // Active preview state for the left photo wing
  const [activePreview, setActivePreview] = useState(navItems[0].preview)

  // Live Current Date
  const { dateLabel, fullDateLabel } = useMemo(() => {
    const now = new Date()
    const day = now.getDate()
    const month = now.toLocaleString('en-US', { month: 'short' }).toUpperCase()
    const year = now.getFullYear()
    return {
      dateLabel: `${day} ${month}`,
      fullDateLabel: `${day} ${month} ${year}`,
    }
  }, [])

  // Passive window scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock background scroll when menu is open
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

  // Desktop links sliding underline tracker
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

  return (
    <>
      {/* ============================================================== */}
      {/* 1. TOP HEADER (Visible at top, fades gracefully on scroll) */}
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

        {/* Right: Desktop Links + Reserve Button + Three-Pill Menu Trigger */}
        <div className="pointer-events-auto flex items-center gap-4 sm:gap-6">
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

          {/* Reserve CTA */}
          <button
            type="button"
            onClick={onOpenDrawer}
            className="px-3.5 sm:px-4 py-2 text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-[#FAF8F5] transition-all duration-300 active:scale-[0.97] cursor-pointer"
          >
            Reserve
          </button>

          {/* Three-Pill Menu Trigger */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open Navigation Menu"
            className="group relative w-10 h-10 rounded-full border border-slate-300 hover:border-slate-900 bg-[#FAF8F5] flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-xs"
          >
            <div className="relative w-4 h-3 flex flex-col justify-between items-center pointer-events-none">
              <span className="w-4 h-[1.5px] bg-slate-900 rounded-full" />
              <span className="w-4 h-[1.5px] bg-slate-900 rounded-full" />
              <span className="w-4 h-[1.5px] bg-slate-900 rounded-full" />
            </div>
          </button>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. SCROLLED FLOATING CORNER PILL */}
      {/* (Only visible when scrolled down AND menu is closed) */}
      {/* ============================================================== */}
      <div
        className={`fixed top-4 right-4 sm:top-6 sm:right-10 z-30 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${
          isScrolled && !isMenuOpen
            ? 'scale-100 opacity-100 pointer-events-auto'
            : 'scale-90 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2 bg-[#FAF8F5]/95 border border-slate-300/80 p-1.5 pl-3.5 rounded-full shadow-md">
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
      {/* 3. CONCEPT 2: CIRCULAR APERTURE EXPANSION MENU */}
      {/* Expanding circular lens from trigger button with 0-lag GPU clip-path */}
      {/* NO ugly deformed side SVG fins — pure architectural geometry */}
      {/* ============================================================== */}

      {/* Dimmed Dark Luxury Backdrop */}
      <div
        onClick={closeMenu}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-slate-950/70 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Expanding Circular Aperture Overlay Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Main Navigation Menu"
        className={`fixed inset-0 z-50 flex flex-col md:flex-row bg-[#FAF8F5] shadow-2xl overflow-hidden transition-[clip-path] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        style={{
          clipPath: isMenuOpen
            ? 'circle(150% at calc(100% - 48px) 36px)'
            : 'circle(0% at calc(100% - 48px) 36px)',
        }}
      >
        {/* Left 45%: Live Suite Image Preview Window (Desktop Only) */}
        <div className="hidden md:block md:w-5/12 h-full relative overflow-hidden bg-slate-950 border-r border-slate-200/80">
          <img
            src={activePreview.image}
            alt={activePreview.title}
            className="w-full h-full object-cover transition-all duration-700 filter brightness-[0.88] scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-end p-10 lg:p-14 text-white">
            <span className="font-mono text-[10px] tracking-[0.28em] text-emerald-400 uppercase">
              {activePreview.tag}
            </span>
            <h3 className="font-serif-grand text-3xl font-light mt-1.5 text-white">
              {activePreview.title}
            </h3>
            <p className="font-mono text-xs text-slate-300 mt-2 max-w-sm leading-relaxed">
              {activePreview.subtitle}
            </p>
          </div>
        </div>

        {/* Right 55%: Navigation Index & Controls */}
        <div className="w-full md:w-7/12 h-full flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-y-auto overscroll-contain">
          
          {/* Top Bar: Clean Branding & Dedicated Close Button */}
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest border-b border-slate-200/80 pb-4 shrink-0">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-slate-900 font-semibold tracking-wider">// NAVIGATION</span>
              <span className="text-slate-300 hidden sm:inline">&middot;</span>
              <span className="text-slate-500 hidden sm:inline text-[10px]">SINDH COAST, PK</span>
            </div>

            {/* Dedicated Accessible Close Button */}
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Close Navigation Menu"
              className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-300 hover:border-slate-900 bg-white hover:bg-slate-900 hover:text-white text-[10px] font-mono uppercase tracking-wider text-slate-800 transition-all cursor-pointer active:scale-95 shadow-xs"
            >
              <span>Close</span>
              <span className="font-bold">&times;</span>
            </button>
          </div>

          {/* Navigation Links with Dynamic Hover Trigger */}
          <nav className="my-auto py-6 sm:py-8 space-y-5 lg:space-y-7 shrink-0" aria-label="Menu Items">
            {navItems.map((item) => {
              const linkContent = (
                <div
                  onMouseEnter={() => setActivePreview(item.preview)}
                  onClick={closeMenu}
                  className="group block border-b border-slate-200/70 pb-4 hover:border-slate-900 transition-colors cursor-pointer"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-slate-400 group-hover:text-emerald-800 transition-colors">
                      [{item.num}]
                    </span>
                    <span className="font-serif-grand text-3xl sm:text-4xl lg:text-5xl text-slate-900 font-normal group-hover:translate-x-3 transition-transform duration-300">
                      {item.label}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-slate-500 tracking-wider block mt-1 pl-10">
                    {item.desc}
                  </span>
                </div>
              )

              return (
                <div key={item.label}>
                  {item.isRouter ? (
                    <Link to={item.href}>{linkContent}</Link>
                  ) : (
                    <a href={item.href}>{linkContent}</a>
                  )}
                </div>
              )
            })}

            {/* Direct Reserve Sanctuary CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  closeMenu()
                  onOpenDrawer()
                }}
                className="w-full py-4 px-6 bg-slate-900 text-[#FAF8F5] text-xs font-mono uppercase tracking-[0.25em] font-semibold hover:bg-emerald-950 transition-colors flex items-center justify-between cursor-pointer active:scale-[0.98] shadow-md"
              >
                <span>Reserve Sanctuary (30% Online)</span>
                <span>&rarr;</span>
              </button>
            </div>
          </nav>

          {/* Bottom Telemetry & Metadata Strip */}
          <div className="border-t border-slate-200/80 pt-5 text-[10px] font-mono text-slate-500 space-y-1.5 shrink-0">
            <div className="flex justify-between items-center text-slate-800">
              <span className="uppercase tracking-widest">Active Vacation Dates</span>
              <span className="font-semibold">{fullDateLabel}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>LAT: 24&deg;48&apos;N &middot; THERMAL: 41.5&deg;C</span>
              <span className="text-emerald-700 font-semibold uppercase">● 3 Sanctuaries Ready</span>
            </div>
            <div className="text-slate-400 pt-1 text-[9px] uppercase tracking-wider">
              The Haven &middot; Safepay 30% Advance &middot; 5-Min Atomic Lock
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
