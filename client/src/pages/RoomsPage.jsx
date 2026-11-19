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
    label: 'Penthouses',
    keys: '2 Keys',
    matcher: (r) => r.roomNumber === '301' || r.roomNumber === '302',
  },
  {
    id: 'villas',
    label: 'Private Villas',
    keys: '3 Keys',
    matcher: (r) => r.roomNumber === '204' || r.roomNumber === '401' || r.roomNumber === '501',
  },
  {
    id: 'overwater',
    label: 'Overwater & Cliff',
    keys: '2 Keys',
    matcher: (r) => r.roomNumber === '102' || r.roomNumber === '201',
  },
  {
    id: 'all',
    label: 'All Suites',
    keys: '7 Keys',
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

      {/* 2. Low-Profile Architectural Masthead (Clean, Poised, Suites Immediately Visible) */}
      <header className="pt-24 sm:pt-28 pb-4 sm:pb-6 px-6 sm:px-12 border-b border-slate-200/80 bg-gradient-to-b from-white/70 to-transparent">
        <div className="max-w-7xl mx-auto space-y-4">
          
          {/* Subtle Monograph Eyebrow */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-[0.3em] font-extrabold text-emerald-900 uppercase">
              THE RESIDENCES &bull; 7 PRIVATE KEYS
            </span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest hidden sm:inline-block">
              100% Oceanfront
            </span>
          </div>

          {/* Grand Architectural Serif Title */}
          <h1 className="font-serif-grand text-3xl sm:text-5xl text-slate-900 font-light tracking-tight leading-tight">
            Architectural Suites &amp; Villas.
          </h1>

          {/* Quiet Luxury Editorial Navigation Tabs */}
          <div className="pt-2">
            <nav aria-label="Suite Collections" className="flex items-center gap-6 sm:gap-10 overflow-x-auto pb-1 scrollbar-none text-xs font-mono tracking-wider">
              {ARCHITECTURAL_COLLECTIONS.map((col, idx) => {
                const isActive = selectedCollectionId === col.id
                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => setSelectedCollectionId(col.id)}
                    className={`relative py-2.5 transition-colors cursor-pointer whitespace-nowrap min-h-[44px] flex items-center gap-2 select-none ${
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
