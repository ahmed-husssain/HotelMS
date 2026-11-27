import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import RoomsCarousel from '../components/RoomsCarousel'
import SuiteSpecsDrawer from '../components/suites/SuiteSpecsDrawer'
import { RESIDENCES } from '../data/residences'
import { LOCATIONS } from '../data/locations'
import { useAuth } from '../context/AuthContext'

/**
 * Curated Architectural Collections by Destination Property
 * Groups 18 suites into 4 physical hotel sanctuary locations across Pakistan:
 * - Sindh Coast (Karachi, Sindh) — 5 Suites
 * - Hunza Valley (Gilgit-Baltistan) — 5 Suites
 * - Lahore Estate (Old Lahore, Punjab) — 4 Suites
 * - Murree Pines (Bhurban, Punjab) — 4 Suites
 */
const ARCHITECTURAL_COLLECTIONS = [
  {
    id: 'all',
    label: 'All Properties',
    keys: '18 Suites',
    subtitle: '18 Curated Sanctuaries Across Pakistan',
    matcher: () => true,
  },
  {
    id: 'sindh-coast',
    label: 'Sindh Coast',
    keys: '5 Suites',
    subtitle: 'Cliffside Ocean Sanctuary • Karachi, Sindh',
    matcher: (r) => r.locationId === 'sindh-coast',
  },
  {
    id: 'hunza',
    label: 'Hunza Valley',
    keys: '5 Suites',
    subtitle: 'Karakoram Alpine Glacial Sanctuary • Gilgit-Baltistan',
    matcher: (r) => r.locationId === 'hunza',
  },
  {
    id: 'lahore',
    label: 'Lahore Estate',
    keys: '4 Suites',
    subtitle: 'Cultural Heritage Estate • Old Lahore, Punjab',
    matcher: (r) => r.locationId === 'lahore',
  },
  {
    id: 'murree',
    label: 'Murree Pines',
    keys: '4 Suites',
    subtitle: 'Cedar Forest Mountain Retreat • Bhurban, Punjab',
    matcher: (r) => r.locationId === 'murree',
  },
]

export default function RoomsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { currentUser } = useAuth()
  const requestedRoom = searchParams.get('room')
  const requestedLocation = searchParams.get('location')

  // Architectural Specs Drawer State
  const [activeSpecsSuite, setActiveSpecsSuite] = useState(null)

  // Auto-resolve collection if deep-linked via ?location=xxx or ?room=xxx
  const initialCollectionId = useMemo(() => {
    if (requestedLocation) {
      const matchLoc = ARCHITECTURAL_COLLECTIONS.find((c) => c.id === requestedLocation.toLowerCase())
      if (matchLoc) return matchLoc.id
    }
    if (requestedRoom) {
      const found = ARCHITECTURAL_COLLECTIONS.find((c) =>
        c.id !== 'all' && RESIDENCES.filter(c.matcher).some((r) => r.roomNumber === requestedRoom || r.displayNumber === requestedRoom)
      )
      if (found) return found.id
    }
    return 'all'
  }, [requestedRoom, requestedLocation])

  const [selectedCollectionId, setSelectedCollectionId] = useState(initialCollectionId)

  // Auto-dismiss welcome banner after 4 seconds (Fix 1)
  const [showWelcome, setShowWelcome] = useState(() => searchParams.get('welcome') === 'true')
  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [showWelcome])

  // Sync collection state dynamically if query param changes
  useEffect(() => {
    if (requestedLocation) {
      const matchLoc = ARCHITECTURAL_COLLECTIONS.find((c) => c.id === requestedLocation.toLowerCase())
      if (matchLoc) setSelectedCollectionId(matchLoc.id)
    } else if (requestedRoom) {
      const match = ARCHITECTURAL_COLLECTIONS.find((c) =>
        c.id !== 'all' && RESIDENCES.filter(c.matcher).some((r) => r.roomNumber === requestedRoom || r.displayNumber === requestedRoom)
      )
      if (match) setSelectedCollectionId(match.id)
    }
  }, [requestedRoom, requestedLocation])

  // Smooth scroll requested suite into view
  useEffect(() => {
    if (requestedRoom) {
      const timer = setTimeout(() => {
        const el = document.getElementById(`suite-card-${requestedRoom}`)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [requestedRoom, selectedCollectionId])

  const activeCollection = useMemo(() => {
    return (
      ARCHITECTURAL_COLLECTIONS.find((c) => c.id === selectedCollectionId) ||
      ARCHITECTURAL_COLLECTIONS[0]
    )
  }, [selectedCollectionId])

  // Pure Curated Filter: 3-4 keys per property view
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

      {/* 2. Low-Profile Architectural Masthead */}
      <header className="pt-24 sm:pt-28 pb-4 sm:pb-6 px-4 sm:px-12 border-b border-slate-200/80 bg-gradient-to-b from-white/70 to-transparent">
        <div className="max-w-7xl mx-auto space-y-3 sm:space-y-4">
          
          {/* Subtle Monograph Eyebrow */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-[0.3em] font-extrabold text-emerald-900 uppercase">
              ROOMS &amp; SUITES &bull; 18 LUXURY RESIDENCES ACROSS PAKISTAN
            </span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest hidden sm:inline-block">
              {activeCollection.subtitle}
            </span>
          </div>

          {/* Welcome Banner for Newly Registered Guests (Auto-dismisses in 4s, clean styling) */}
          {showWelcome && (
            <div className="p-3.5 sm:p-4 bg-[#0E1201] text-[#FAF8F5] border border-slate-800 rounded-[2px] flex items-center justify-between gap-3 text-xs font-mono shadow-md animate-in fade-in duration-300">
              <span className="leading-relaxed">
                Welcome to Stayza{currentUser?.name ? `, ${currentUser.name}` : ''}! Choose your preferred residence to begin your reservation.
              </span>
              <button
                type="button"
                onClick={() => setShowWelcome(false)}
                className="text-slate-400 hover:text-white text-base leading-none px-2 py-1 rounded cursor-pointer transition-colors shrink-0"
                aria-label="Dismiss welcome banner"
              >
                &times;
              </button>
            </div>
          )}

          {/* Grand Architectural Serif Title */}
          <h1 className="font-serif-grand text-3xl sm:text-5xl text-slate-900 font-light tracking-tight leading-tight">
            Curated Sanctuaries &amp; Residences.
          </h1>

          {/* Quiet Luxury Destination Filter Tabs */}
          <div className="pt-1 sm:pt-2">
            <nav aria-label="Hotel Locations" className="flex items-center gap-4 sm:gap-8 overflow-x-auto pb-1 scrollbar-none text-xs font-mono tracking-wider">
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

      {/* 3. The Curated Suites Showcase (3-4 suites per destination, Zero Scroll Fatigue) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16 space-y-12 sm:space-y-16">
        {filteredSuites.map((residence, idx) => (
          <div key={residence.id} id={`suite-card-${residence.roomNumber}`}>
            <RoomsCarousel
              residence={residence}
              index={idx}
              onReserve={(res) => handleOpenReservation(res)}
              onOpenSpecs={(res) => setActiveSpecsSuite(res)}
            />
          </div>
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
