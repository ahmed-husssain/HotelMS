import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import HeroSection from '../components/HeroSection'
import Navbar from '../components/Navbar'
import ResidenceSpread from '../components/ResidenceSpread'
import SplashScreen from '../components/SplashScreen'
import SuiteSpecsDrawer from '../components/suites/SuiteSpecsDrawer'
import { RESIDENCES } from '../data/residences'

// Module-level flag: plays on each fresh page load/reload, avoids replaying on internal SPA back-and-forth
let hasPlayedSplashThisPageLoad = false

export default function LandingPage() {
  const navigate = useNavigate()

  // Architectural Specs Drawer State
  const [activeSpecsSuite, setActiveSpecsSuite] = useState(null)

  // Cinematic opening sequence state — plays on each page load/refresh
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window !== 'undefined') {
      const forceIntro = new URLSearchParams(window.location.search).get('intro') === 'true'
      const skipIntro = new URLSearchParams(window.location.search).get('intro') === 'false'
      if (skipIntro) return false
      if (forceIntro) return true
      return !hasPlayedSplashThisPageLoad
    }
    return true
  })

  const handleSplashComplete = () => {
    hasPlayedSplashThisPageLoad = true
    setShowSplash(false)
  }

  // Navigate to Dedicated Luxury Reservation Flow (/reserve)
  const handleOpenReservation = (residence = RESIDENCES[0]) => {
    navigate(`/reserve?room=${residence.roomNumber}`)
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 selection:bg-emerald-100 selection:text-emerald-950 font-sans-clean">
      {/* Monolithic Opening Portal Sequence */}
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      {/* Floating Header */}
      <Navbar onOpenDrawer={() => handleOpenReservation(RESIDENCES[0])} />

      {/* Parallax Hero Section */}
      <HeroSection 
        onExplore={() => {
          const el = document.getElementById('residences')
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }}
        onQuickReserve={() => handleOpenReservation(RESIDENCES[0])} 
      />

      {/* Architectural Residences Showcase — Tight Luxury Editorial Cadence */}
      <main id="residences" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-10 sm:space-y-14 lg:space-y-18 overflow-x-clip">
        <div className="border-b border-slate-200/80 pb-4 sm:pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-[10px] tracking-[0.3em] font-extrabold text-emerald-900 uppercase">
              OUR LUXURY SUITES &amp; VILLAS
            </span>
            <h2 className="font-serif-grand text-2xl sm:text-4xl lg:text-5xl text-slate-900 font-light mt-1">
              Featured Suites &amp; Villas
            </h2>
          </div>
          <span className="text-xs text-slate-600 tracking-[0.15em] uppercase font-medium">
            3 Private Suites &bull; Complete Seclusion &amp; Ocean Views
          </span>
        </div>

        {/* Render Exactly 3 Signature Residences with Alternating Editorial Layout & Inset Parallax */}
        {RESIDENCES.slice(0, 3).map((residence, idx) => (
          <ResidenceSpread
            key={residence.id}
            residence={residence}
            index={idx}
            onReserve={(res) => handleOpenReservation(res)}
            onOpenSpecs={(res) => setActiveSpecsSuite(res)}
          />
        ))}

        {/* Explore All Suites Link */}
        <div className="pt-6 sm:pt-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 sm:p-8 bg-white border border-slate-200/90 rounded-[2px] shadow-2xs">
          <div>
            <span className="text-[9px] font-mono tracking-[0.25em] text-emerald-900 uppercase font-bold block">
              FULL ARCHITECTURAL COLLECTION
            </span>
            <p className="font-serif-grand text-xl sm:text-2xl text-slate-900 font-normal mt-0.5">
              Discover All 18 Suites &amp; Private Residences
            </p>
          </div>
          <Link
            to="/suites"
            className="inline-flex items-center gap-3 px-6 py-3.5 bg-slate-900 hover:bg-emerald-950 text-[#FFF0CA] text-xs font-mono tracking-[0.2em] uppercase transition-all duration-300 rounded-[2px] shadow-xs hover:shadow-md cursor-pointer group"
          >
            <span>Explore All Suites</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
          </Link>
        </div>
      </main>

      {/* Wellness / Estate Brief Section */}
      <section id="experience" className="bg-white border-y border-slate-200/80 py-14 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 text-slate-600">
          <div className="space-y-3">
            <span className="text-[10px] tracking-[0.25em] font-bold text-slate-500 uppercase">
              Wellness &amp; Springs
            </span>
            <h3 className="font-serif-grand text-2xl text-slate-900 font-normal">
              Cedar Spa &amp; Hot Springs
            </h3>
            <p className="text-xs leading-relaxed">
              Warm mineral hot tubs and outdoor cedar baths positioned right above the ocean tides.
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] tracking-[0.25em] font-bold text-slate-500 uppercase">
              Coastal Dining
            </span>
            <h3 className="font-serif-grand text-2xl text-slate-900 font-normal">
              The Harvest Pavilion
            </h3>
            <p className="text-xs leading-relaxed">
              Fresh farm-to-table dining prepared daily with organic vegetables from our garden and fresh local seafood.
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] tracking-[0.25em] font-bold text-slate-500 uppercase">
              Private Arrival
            </span>
            <h3 className="font-serif-grand text-2xl text-slate-900 font-normal">
              Private Underground Valet
            </h3>
            <p className="text-xs leading-relaxed">
              Quiet, private arrivals through underground parking with private elevator access directly to your suite. No shared corridors or busy lobbies.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/estate"
            className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] font-semibold text-slate-900 hover:text-emerald-900 transition-colors"
          >
            <span>Discover The Estate &amp; Grounds</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
          </Link>
        </div>
      </section>

      {/* Architectural Luxury Footer */}
      <Footer />

      {/* Architectural Specification Dossier Drawer */}
      <SuiteSpecsDrawer
        residence={activeSpecsSuite}
        isOpen={Boolean(activeSpecsSuite)}
        onClose={() => setActiveSpecsSuite(null)}
      />
    </div>
  )
}
