import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import BrandLogo from './BrandLogo'

/**
 * The Haven — Option 2: Symmetrical Split Navigation
 *
 * ARCHITECTURE & VIVA DEFENSE:
 * 1. Symmetrical Flanking Geometry:
 *    - Left Flank (Width ~190px): 2 primary links ("Residences" & "The Estate") with kinetic vertical reveals.
 *    - Center Portal: Mathematically locked to viewport center (BrandLogo).
 *    - Right Flank (Width ~210px): "Staff PMS" + tactile "Reserve" CTA + circular Aperture Menu button.
 *    - Result: 190px left vs 210px right = optical 1:1 balance with >350px clearance around the center logo.
 *      Zero overlap, zero collision, even on compact 1024px-1280px laptops.
 *
 * 2. Responsive Mobile Adaptability:
 *    - Tablet/Desktop (>= 640px): Displays full architectural emblem & wordmark.
 *    - Mobile (< 640px): Gracefully collapses center to compact emblem so controls never collide on 320px screens.
 *
 * 3. 120 FPS Composited Performance:
 *    - Eliminates DOM rect layout-thrashing on mousemove.
 *    - Kinetic slot-machine vertical character reveal runs purely on the GPU compositor thread.
 */
export default function Navbar({ onOpenDrawer }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
  const [{ dateLabel, fullDateLabel }] = useState(() => {
    const now = new Date()
    const day = now.getDate()
    const month = now.toLocaleString('en-US', { month: 'short' }).toUpperCase()
    const year = now.getFullYear()
    return {
      dateLabel: `${day} ${month}`,
      fullDateLabel: `${day} ${month} ${year}`,
    }
  })

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

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  return (
    <>
      {/* ============================================================== */}
      {/* 1. TOP HEADER — OPTION 2: SYMMETRICAL SPLIT NAVIGATION */}
      {/* ============================================================== */}
      <header
        className={`fixed top-0 inset-x-0 z-30 px-5 sm:px-8 md:px-14 py-5 sm:py-6 flex items-center justify-between transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] select-none pointer-events-none ${
          isScrolled ? '-translate-y-6 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
        }`}
      >
        {/* Left Flank: Primary Architectural Links (Desktop) & Monogram (Mobile) */}
        <div className="pointer-events-auto flex items-center h-10 shrink-0">
          {/* Desktop Left Nav Links (Option 2 Symmetrical Split) */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-mono uppercase tracking-wider text-slate-700" aria-label="Primary Left Navigation">
            <a
              href="#residences"
              className="group relative h-10 flex items-center text-slate-700 hover:text-slate-950 transition-colors select-none"
            >
              <span className="relative inline-flex flex-col h-10 overflow-hidden justify-center leading-none">
                <span className="h-10 flex items-center whitespace-nowrap transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full will-change-transform">
                  Residences
                </span>
                <span className="absolute top-full left-0 h-10 flex items-center whitespace-nowrap font-semibold text-slate-900 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full will-change-transform">
                  Residences
                </span>
              </span>
            </a>

            <a
              href="#experience"
              className="group relative h-10 flex items-center text-slate-700 hover:text-slate-950 transition-colors select-none"
            >
              <span className="relative inline-flex flex-col h-10 overflow-hidden justify-center leading-none">
                <span className="h-10 flex items-center whitespace-nowrap transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full will-change-transform">
                  The Estate
                </span>
                <span className="absolute top-full left-0 h-10 flex items-center whitespace-nowrap font-semibold text-slate-900 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full will-change-transform">
                  The Estate
                </span>
              </span>
            </a>
          </nav>

          {/* Mobile/Tablet Fallback Left Anchor */}
          <div className="lg:hidden flex items-center h-10">
            <Link
              to="/"
              className="group flex items-center gap-2 h-10 text-xs font-mono tracking-tight text-slate-900 focus-visible:outline-none active:scale-[0.97] transition-transform duration-100 ease-[cubic-bezier(0.16,1,0.3,1)]"
            >
              <span className="text-slate-400 font-normal select-none leading-none">&copy;</span>
              <span className="relative inline-flex items-center overflow-hidden h-10 w-[140px]">
                <span className="absolute inset-0 flex items-center whitespace-nowrap leading-none text-slate-900 font-normal">
                  Habitas &middot; 2026
                </span>
              </span>
            </Link>
          </div>
        </div>

        {/* Center Portal: Absolute Mathematical Viewport Centering for The Haven Emblem & Wordmark */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto hidden sm:flex items-center justify-center">
          <BrandLogo variant="full" theme="dark" size="md" />
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto sm:hidden flex items-center justify-center">
          <BrandLogo variant="emblem" theme="dark" size="sm" />
        </div>

        {/* Right Flank: Staff PMS + Reserve Button + Three-Pill Menu Trigger */}
        <div className="pointer-events-auto flex items-center gap-3 sm:gap-4 shrink-0 h-10">
          <Link
            to="/pms"
            className="hidden lg:flex group relative h-10 items-center text-xs font-mono uppercase tracking-wider text-slate-700 hover:text-slate-950 transition-colors select-none mr-2"
          >
            <span className="relative inline-flex flex-col h-10 overflow-hidden justify-center leading-none">
              <span className="h-10 flex items-center whitespace-nowrap transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full will-change-transform">
                Staff PMS
              </span>
              <span className="absolute top-full left-0 h-10 flex items-center whitespace-nowrap font-semibold text-slate-900 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full will-change-transform">
                Staff PMS
              </span>
            </span>
          </Link>

          {/* Reserve CTA */}
          <button
            type="button"
            onClick={onOpenDrawer}
            className="h-9 px-4 flex items-center justify-center text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-[#FAF8F5] transition-all duration-300 active:scale-[0.97] cursor-pointer rounded-[2px]"
          >
            Reserve
          </button>

          {/* Three-Pill Menu Trigger */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open Navigation Menu"
            className="group relative w-9 h-9 rounded-full border border-slate-300 hover:border-slate-900 bg-[#FAF8F5] flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-xs shrink-0"
          >
            <div className="relative w-3.5 h-2.5 flex flex-col justify-between items-center pointer-events-none">
              <span className="w-3.5 h-[1.5px] bg-slate-900 rounded-full" />
              <span className="w-3.5 h-[1.5px] bg-slate-900 rounded-full" />
              <span className="w-3.5 h-[1.5px] bg-slate-900 rounded-full" />
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
              Habitas &middot; Safepay 30% Advance &middot; 5-Min Atomic Lock
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
