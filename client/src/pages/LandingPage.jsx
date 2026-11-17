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
              PORTFOLIO OF SANCTUARIES
            </span>
            <h2 className="font-serif-grand text-3xl sm:text-5xl text-slate-900 font-light mt-1">
              Architectural Residences
            </h2>
          </div>
          <span className="text-xs text-slate-500 tracking-[0.15em] uppercase font-medium">
            3 Private Units &bull; 100% Uninterrupted Seclusion
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
              01 &bull; TOTAL RETREAT
            </span>
            <h3 className="font-serif-grand text-2xl text-slate-900 font-normal">
              Hinoki Cedar Wellness
            </h3>
            <p className="text-xs leading-relaxed">
              Thermal hydrotherapy baths crafted from 300-year-old sustainably sourced Kyoto cedar, positioned above tide level.
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] tracking-[0.25em] font-bold text-slate-400 uppercase">
              02 &bull; GASTRONOMY
            </span>
            <h3 className="font-serif-grand text-2xl text-slate-900 font-normal">
              The Harvest Pavilion
            </h3>
            <p className="text-xs leading-relaxed">
              Zero-kilometer organic tasting menus harvested daily from the estate gardens and coastal line-catch fishers.
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] tracking-[0.25em] font-bold text-slate-400 uppercase">
              03 &bull; DISCRETION
            </span>
            <h3 className="font-serif-grand text-2xl text-slate-900 font-normal">
              Subterranean Valet
            </h3>
            <p className="text-xs leading-relaxed">
              Soundless in-residence arrivals via private subterranean access tunnels. Zero corridors, zero shared lobbies.
            </p>
          </div>
        </div>
      </section>

      {/* Architectural Luxury Footer */}
      <Footer />
    </div>
  )
}
