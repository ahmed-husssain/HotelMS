import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import BrandLogo from './BrandLogo'
import AnimatedButton from './AnimatedButton'
import NavMenu from './navigation/NavMenu'
import { useAuth } from '../context/AuthContext'

/**
 * StaggeredWaveText — Smooth character roll on hover
 */
function StaggeredWaveText({ text }) {
  return (
    <span className="inline-flex items-center overflow-hidden h-10 leading-none select-none">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-flex items-center">
        {Array.from(text).map((char, index) => (
          <span
            key={index}
            className="relative inline-block overflow-hidden align-top select-none leading-tight"
            style={{ height: '1.15em' }}
          >
            <span className="invisible">{char === ' ' ? '\u00A0' : char}</span>
            <span
              className="absolute top-0 left-0 inline-block will-change-transform select-none transition-transform duration-[620ms] ease-[cubic-bezier(0.52,0,0,1)] group-hover:-translate-y-[135%]"
              style={{ transitionDelay: `${index * 12}ms` }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
            <span
              className="absolute top-0 left-0 inline-block will-change-transform select-none font-semibold text-slate-900 transition-transform duration-[620ms] ease-[cubic-bezier(0.52,0,0,1)] translate-y-[135%] group-hover:translate-y-0"
              style={{ transitionDelay: `${index * 12}ms` }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          </span>
        ))}
      </span>
    </span>
  )
}

export default function Navbar({ onOpenDrawer }) {
  const { currentUser, logout } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Navigation Links & Live Preview Data (The Haven Sindh Coast)
  const navItems = useMemo(() => [
    {
      num: '01',
      label: 'Rooms & Suites',
      href: '/suites',
      isRouter: true,
      desc: 'Luxury Ocean Suites & Villas',
      preview: {
        tag: 'SUITE 301',
        title: 'The Cliffside Suite',
        subtitle: 'Suspended above the Arabian Sea with private infinity plunge pool and basalt stone courtyard.',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=85',
      },
    },
    {
      num: '02',
      label: 'The Estate',
      href: '/estate',
      isRouter: true,
      desc: 'Architecture, Dining, Beach & Spa',
      preview: {
        tag: 'THE ESTATE',
        title: 'Sindh Coast Sanctuary',
        subtitle: '42 secluded oceanfront acres featuring cliffside architecture, farm-to-table dining, and mineral thermal springs.',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=85',
      },
    },
    {
      num: '03',
      label: 'My Stay',
      href: '/my-stay',
      isRouter: true,
      desc: 'Digital Key, Room Service & Feedback',
      preview: {
        tag: 'GUEST PORTAL',
        title: 'Your Reservation & Digital Key',
        subtitle: 'Manage your active reservation, request in-room dining, view your live bill, and access your digital key.',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=85',
      },
    },
  ], [])

  const [activePreview, setActivePreview] = useState(navItems[0].preview)

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

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMenuOpen) setIsMenuOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

  const closeMenu = useCallback(() => setIsMenuOpen(false), [])

  return (
    <>
      {/* 1. TOP HEADER */}
      <header
        className={`fixed top-0 inset-x-0 z-30 px-5 sm:px-8 md:px-14 py-5 sm:py-6 flex items-center justify-between transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] select-none pointer-events-none ${
          isScrolled ? '-translate-y-6 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
        }`}
      >
        {/* Left Flank: Primary Links */}
        <div className="pointer-events-auto flex items-center h-10 shrink-0">
          <nav className="hidden lg:flex items-center gap-7 text-xs font-mono uppercase tracking-wider text-slate-700">
            <Link
              to="/suites"
              className="group relative h-10 flex items-center text-slate-700 hover:text-slate-950 transition-colors select-none"
            >
              <StaggeredWaveText text="Rooms & Suites" />
            </Link>
            <Link
              to="/estate"
              className="group relative h-10 flex items-center text-slate-700 hover:text-slate-950 transition-colors select-none"
            >
              <StaggeredWaveText text="The Estate" />
            </Link>
          </nav>

          {/* Mobile Left Brand Logo (< sm: Eliminates center collision with Reserve button) */}
          <div className="sm:hidden flex items-center h-10">
            <BrandLogo variant="full" theme="dark" size="sm" />
          </div>

          {/* Tablet Left Eyebrow (sm to lg) */}
          <div className="hidden sm:flex lg:hidden items-center h-10">
            <Link
              to="/"
              className="group flex items-center gap-1.5 h-10 text-xs font-mono tracking-tight text-slate-900 focus-visible:outline-none"
            >
              <span className="whitespace-nowrap leading-none text-slate-900 font-medium tracking-wider">
                STAYZA &bull; 2026
              </span>
            </Link>
          </div>
        </div>

        {/* Center Portal: Brand Logo (Active on sm and desktop with ample breathing space) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto hidden sm:flex items-center justify-center">
          <BrandLogo variant="full" theme="dark" size="md" />
        </div>

        {/* Right Flank: Dynamic Session / Reserve / Menu Trigger */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3 shrink-0 h-10">
          {currentUser ? (
            <div className="hidden lg:flex items-center gap-2 font-mono text-xs">
              <Link
                to={
                  currentUser.role === 'admin'
                    ? '/admin'
                    : currentUser.role === 'receptionist'
                    ? '/reception'
                    : currentUser.role === 'housekeeping'
                    ? '/housekeeping'
                    : '/my-stay'
                }
                className="group relative h-9 px-2.5 flex items-center gap-1.5 border border-slate-300 rounded-[2px] hover:border-slate-900 transition-colors bg-[#FAF8F5]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                <span className="font-semibold text-slate-900">{currentUser.name.split(' ')[0]}</span>
                <span className="text-[9px] text-slate-500 uppercase tracking-wider">
                  &bull; {currentUser.role}
                </span>
              </Link>
              <button
                type="button"
                onClick={logout}
                className="text-[10px] text-slate-400 hover:text-red-700 transition-colors uppercase cursor-pointer"
                title="Sign Out"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden lg:flex group relative h-10 items-center text-xs font-mono uppercase tracking-wider text-slate-700 hover:text-slate-950 transition-colors select-none mr-1"
            >
              <StaggeredWaveText text="Sign In" />
            </Link>
          )}

          <AnimatedButton
            text="Reserve"
            onClick={onOpenDrawer}
            size="sm"
            variant="outline"
          />

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

      {/* 2. SCROLLED FLOATING CORNER PILL */}
      <div
        className={`fixed top-4 right-4 sm:top-6 sm:right-10 z-30 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${
          isScrolled && !isMenuOpen
            ? 'scale-100 opacity-100 pointer-events-auto'
            : 'scale-90 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2 bg-[#FAF8F5]/95 border border-slate-300/80 p-1.5 pl-3.5 rounded-full shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-slate-800">
            {dateLabel}
          </span>
          <AnimatedButton
            text="Reserve"
            onClick={onOpenDrawer}
            size="xs"
            variant="outline"
            className="ml-1"
          />
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open Navigation Menu"
            className="group relative w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-300 hover:border-slate-900 bg-[#FAF8F5] flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-2xs shrink-0"
          >
            <div className="relative w-3 h-2 sm:w-3.5 sm:h-2.5 flex flex-col justify-between items-center pointer-events-none">
              <span className="w-full h-[1.5px] bg-slate-900 rounded-full" />
              <span className="w-full h-[1.5px] bg-slate-900 rounded-full" />
              <span className="w-full h-[1.5px] bg-slate-900 rounded-full" />
            </div>
          </button>
        </div>
      </div>

      {/* 3. APERTURE DRAWER OVERLAY */}
      <NavMenu
        isOpen={isMenuOpen}
        onClose={closeMenu}
        onOpenDrawer={onOpenDrawer}
        navItems={navItems}
        activePreview={activePreview}
        setActivePreview={setActivePreview}
        fullDateLabel={fullDateLabel}
        currentUser={currentUser}
        logout={logout}
      />
    </>
  )
}
