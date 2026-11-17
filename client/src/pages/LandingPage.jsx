import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import HeroParallax from '../components/HeroParallax'
import Navbar from '../components/Navbar'
import ResidenceSpread from '../components/ResidenceSpread'
import SplashScreen from '../components/SplashScreen'
import { RESIDENCES } from '../data/residences'
import { useSmoothScroll } from '../hooks/useSmoothScroll'

export default function LandingPage() {
  // Initialize Lenis + GSAP single scroll authority
  useSmoothScroll()
  const navigate = useNavigate()

  // Cinematic opening sequence state
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window !== 'undefined') {
      const hasSeen = sessionStorage.getItem('habitas_splash_seen')
      const forceIntro = new URLSearchParams(window.location.search).get('intro') === 'true'
      return !hasSeen || forceIntro
    }
    return true
  })

  const handleSplashComplete = () => {
    sessionStorage.setItem('habitas_splash_seen', 'true')
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
      <HeroParallax onQuickReserve={() => handleOpenReservation(RESIDENCES[0])} />

      {/* Architectural Residences Showcase */}
      <main id="residences" className="max-w-7xl mx-auto px-6 py-24 space-y-28">
        <div className="border-b border-slate-200/80 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] tracking-[0.3em] font-extrabold text-emerald-900 uppercase">
              OUR LUXURY SUITES &amp; VILLAS
            </span>
            <h2 className="font-serif-grand text-3xl sm:text-5xl text-slate-900 font-light mt-1">
              Featured Suites &amp; Villas
            </h2>
          </div>
          <span className="text-xs text-slate-500 tracking-[0.15em] uppercase font-medium">
            3 Private Suites &bull; Complete Seclusion &amp; Ocean Views
          </span>
        </div>

        {/* Render Residences with Embla Carousel & Casa Momo Kinetic Hover */}
        {RESIDENCES.map((residence, idx) => (
          <ResidenceSpread
            key={residence.id}
            residence={residence}
            index={idx}
            onReserve={(res) => handleOpenReservation(res)}
          />
        ))}
      </main>

      {/* Wellness / Estate Brief Section */}
      <section id="experience" className="bg-white border-y border-slate-200/80 py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-slate-600">
          <div className="space-y-3">
            <span className="text-[10px] tracking-[0.25em] font-bold text-slate-400 uppercase">
              01 &bull; TOTAL RELAXATION
            </span>
            <h3 className="font-serif-grand text-2xl text-slate-900 font-normal">
              Cedar Spa &amp; Hot Springs
            </h3>
            <p className="text-xs leading-relaxed">
              Warm mineral hot tubs and outdoor cedar baths positioned right above the ocean tides.
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] tracking-[0.25em] font-bold text-slate-400 uppercase">
              02 &bull; DINING
            </span>
            <h3 className="font-serif-grand text-2xl text-slate-900 font-normal">
              The Harvest Pavilion
            </h3>
            <p className="text-xs leading-relaxed">
              Fresh farm-to-table dining prepared daily with organic vegetables from our garden and fresh local seafood.
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] tracking-[0.25em] font-bold text-slate-400 uppercase">
              03 &bull; PRIVACY
            </span>
            <h3 className="font-serif-grand text-2xl text-slate-900 font-normal">
              Private Underground Valet
            </h3>
            <p className="text-xs leading-relaxed">
              Quiet, private arrivals through underground parking with private elevator access directly to your suite. No shared corridors or busy lobbies.
            </p>
          </div>
        </div>
      </section>

      {/* Architectural Luxury Footer */}
      <Footer />
    </div>
  )
}
