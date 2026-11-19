import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import RoomsCarousel from '../components/RoomsCarousel'
import SuiteSpecsDrawer from '../components/suites/SuiteSpecsDrawer'
import { RESIDENCES } from '../data/residences'
import { useSmoothScroll } from '../hooks/useSmoothScroll'

/**
 * Curated Architectural Collections (Doc Option A)
 * Eliminates scroll fatigue by grouping 7 suites into 3 intimate collections of 2-3 keys
 */
const ARCHITECTURAL_COLLECTIONS = [
  {
    id: 'penthouses',
    label: 'Penthouses & Duplexes',
    keys: '2 Keys',
    tagline: 'Elevated multi-level suites, panoramic horizons, and private rooftop plunge pools.',
    matcher: (r) => r.roomNumber === '301' || r.roomNumber === '302',
  },
  {
    id: 'villas',
    label: 'Private Villas & Estates',
    keys: '3 Keys',
    tagline: 'Secluded garden courtyards, biophilic cenotes, and monolithic volcanic basalt grounds.',
    matcher: (r) => r.roomNumber === '204' || r.roomNumber === '401' || r.roomNumber === '501',
  },
  {
    id: 'overwater',
    label: 'Overwater & Cliff Sanctuaries',
    keys: '2 Keys',
    tagline: 'Cantilevered bluff views, glass coral viewing floors, and direct ocean tides.',
    matcher: (r) => r.roomNumber === '102' || r.roomNumber === '201',
  },
  {
    id: 'all',
    label: 'Complete Collection',
    keys: '7 Keys',
    tagline: 'The complete architectural collection of all seven private keys across the estate.',
    matcher: () => true,
  },
]

export default function RoomsPage() {
  useSmoothScroll()
  const navigate = useNavigate()

  // Architectural Specs Drawer State
  const [activeSpecsSuite, setActiveSpecsSuite] = useState(null)

  // Curated Collection Setting (Option A: Defaults to Penthouses, 2 keys per view)
  const [selectedCollectionId, setSelectedCollectionId] = useState('penthouses')

  const activeCollection = useMemo(() => {
    return (
      ARCHITECTURAL_COLLECTIONS.find((c) => c.id === selectedCollectionId) ||
      ARCHITECTURAL_COLLECTIONS[0]
    )
  }, [selectedCollectionId])

  // Pure Curated Filter: 2-3 keys per collection
  const filteredSuites = useMemo(() => {
    return RESIDENCES.filter(activeCollection.matcher)
  }, [activeCollection])

  // Navigate directly to /reserve with pre-selected room
  const handleOpenReservation = (residence = RESIDENCES[0]) => {
    navigate(`/reserve?room=${residence.roomNumber}`)
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 selection:bg-emerald-100 selection:text-emerald-950 font-sans-clean">
      {/* 1. Minimal Fixed Navbar */}
      <Navbar onOpenDrawer={() => handleOpenReservation(RESIDENCES[0])} />

      {/* 2. Editorial Header with Quiet Inline Collection Switcher (Static, Never Sticky) */}
      <header className="pt-32 sm:pt-40 pb-8 px-6 sm:px-12 border-b border-slate-200/80 bg-gradient-to-b from-white/60 to-transparent">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200/80 text-[10px] font-mono tracking-[0.25em] text-emerald-950 font-semibold uppercase shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            SUITES &amp; RESIDENCES
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="font-serif-grand text-4xl sm:text-6xl text-slate-900 font-light tracking-tight">
                Architectural Suites &amp; Villas.
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-2 leading-relaxed font-normal">
                Curated collections of private oceanfront residences designed for quiet privacy, natural light, and space.
              </p>
            </div>

            <div className="text-xs font-mono text-slate-500 uppercase tracking-widest shrink-0">
              <span>● 100% Oceanfront</span> &bull; <span>7 Private Keys</span>
            </div>
          </div>

          {/* Quiet Luxury Editorial Navigation Tabs (Zero Clutter, Zero Sticky Overlap) */}
          <div className="pt-6 border-t border-slate-200/70 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <nav aria-label="Suite Collections" className="flex items-center gap-6 sm:gap-8 overflow-x-auto pb-1 scrollbar-none text-xs font-mono tracking-wider">
              {ARCHITECTURAL_COLLECTIONS.map((col, idx) => {
                const isActive = selectedCollectionId === col.id
                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => setSelectedCollectionId(col.id)}
                    className={`relative py-3 transition-colors cursor-pointer whitespace-nowrap min-h-[44px] flex items-center gap-2 select-none ${
                      isActive
                        ? 'text-slate-950 font-bold'
                        : 'text-slate-500 hover:text-slate-950 font-normal'
                    }`}
                  >
                    <span className="text-[10px] text-slate-400 font-normal select-none">
                      0{idx + 1}
                    </span>
                    <span>{col.label}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono tracking-normal ${
                        isActive
                          ? 'bg-slate-900 text-[#FFF0CA]'
                          : 'bg-slate-200/70 text-slate-600'
                      }`}
                    >
                      {col.keys}
                    </span>
                    {/* Active Hairline Underline Indicator */}
                    {isActive && (
                      <span className="absolute bottom-0 inset-x-0 h-[2px] bg-slate-900 rounded-full" />
                    )}
                  </button>
                )
              })}
            </nav>

            {/* Subtle Active Collection Tagline */}
            <p className="text-[11px] font-mono text-slate-500 pb-3 hidden md:block max-w-md text-right">
              {activeCollection.tagline}
            </p>
          </div>
        </div>
      </header>

      {/* 3. The Curated Suites Showcase (Only 2-3 suites per collection, Zero Scroll Fatigue) */}
      <main className="max-w-7xl mx-auto px-6 py-12 sm:py-16 space-y-16">
        {filteredSuites.map((residence, idx) => (
          <RoomsCarousel
            key={residence.id}
            residence={residence}
            index={idx}
            onReserve={(res) => handleOpenReservation(res)}
            onOpenSpecs={(res) => setActiveSpecsSuite(res)}
          />
        ))}
      </main>

      {/* 4. Architectural Footer */}
      <Footer />

      {/* 5. Architectural Specification Dossier Drawer */}
      <SuiteSpecsDrawer
        residence={activeSpecsSuite}
        isOpen={Boolean(activeSpecsSuite)}
        onClose={() => setActiveSpecsSuite(null)}
      />
    </div>
  )
}
