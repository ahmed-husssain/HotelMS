import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BookingDrawer from '../components/BookingDrawer'
import HeroParallax from '../components/HeroParallax'
import Navbar from '../components/Navbar'
import ResidenceSpread from '../components/ResidenceSpread'
import { RESIDENCES } from '../data/residences'
import { useSmoothScroll } from '../hooks/useSmoothScroll'

export default function LandingPage() {
  // Initialize Lenis + GSAP single scroll authority
  useSmoothScroll()
  const navigate = useNavigate()

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedResidence, setSelectedResidence] = useState(RESIDENCES[0])

  const handleOpenDrawer = (residence = RESIDENCES[0]) => {
    setSelectedResidence(residence)
    setIsDrawerOpen(true)
  }

  const handleConfirmBooking = (bookingData) => {
    setIsDrawerOpen(false)
    navigate('/confirmation', { state: { booking: bookingData } })
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 selection:bg-emerald-100 selection:text-emerald-950 font-sans-clean">
      {/* Floating Header */}
      <Navbar onOpenDrawer={() => handleOpenDrawer(RESIDENCES[0])} />

      {/* Parallax Hero Section */}
      <HeroParallax onQuickReserve={() => handleOpenDrawer(RESIDENCES[0])} />

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

        {/* Render Residences */}
        {RESIDENCES.map((residence, idx) => (
          <ResidenceSpread
            key={residence.id}
            residence={residence}
            index={idx}
            onReserve={(res) => handleOpenDrawer(res)}
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

      {/* Minimalist Editorial Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-500 text-xs">
        <div className="flex flex-col">
          <span className="font-cinzel text-sm tracking-[0.28em] font-bold text-slate-900">
            LUXURYSTAY
          </span>
          <span className="text-[10px] text-slate-400 tracking-[0.2em] mt-0.5">
            AN APTECH LUXURY HOSPITALITY CURRICULUM SYSTEM
          </span>
        </div>

        <div className="flex gap-8 text-[11px] tracking-[0.18em] font-semibold text-slate-600">
          <span>SINDH COAST, PK</span>
          <span>EST. 2026</span>
          <a href="/pms" className="text-emerald-900 hover:underline">
            STAFF PORTAL &rarr;
          </a>
        </div>
      </footer>

      {/* Reservation Drawer with Live 5-Minute Pessimistic Lock */}
      <BookingDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        residence={selectedResidence}
        onConfirmBooking={handleConfirmBooking}
      />
    </div>
  )
}
