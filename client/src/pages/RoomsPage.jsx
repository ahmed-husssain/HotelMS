import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import RoomsCarousel from '../components/RoomsCarousel'
import SuiteSpecsDrawer from '../components/suites/SuiteSpecsDrawer'
import { RESIDENCES } from '../data/residences'
import { useSmoothScroll } from '../hooks/useSmoothScroll'

// Curated Architectural Collections (Option A: 2-3 Keys Per Setting)
const SUITE_COLLECTIONS = [
  {
    id: 'penthouses',
    badge: 'COLLECTION 01',
    label: 'Penthouses & Ocean Estates',
    shortLabel: 'Penthouses',
    count: '3 Keys',
    description: 'Double-height coastal duplexes and cantilevered basalt infinity pools suspended above the tides.',
    roomNumbers: ['301', '302', '501'],
  },
  {
    id: 'villas',
    badge: 'COLLECTION 02',
    label: 'Private Garden & Jungle Villas',
    shortLabel: 'Villas',
    count: '2 Keys',
    description: 'Enclosed stone courtyards, private cenote plunge pools, and open-air chukum living pavilions.',
    roomNumbers: ['204', '401'],
  },
  {
    id: 'sanctuaries',
    badge: 'COLLECTION 03',
    label: 'Ocean & Cliff Sanctuaries',
    shortLabel: 'Sanctuaries',
    count: '2 Keys',
    description: 'Direct lagoon sundecks, glass ocean-viewing floors, and cantilevered sandstone cliff balustrades.',
    roomNumbers: ['102', '201'],
  },
]

export default function RoomsPage() {
  useSmoothScroll()
  const navigate = useNavigate()

  // Architectural Specs Drawer State
  const [activeSpecsSuite, setActiveSpecsSuite] = useState(null)

  // Curated Collection Setting (Option A: Default to Penthouses, 3 Keys)
  const [selectedCollection, setSelectedCollection] = useState('penthouses')
  const [guestCapacity, setGuestCapacity] = useState('all')       // 'all' | '2' | '4'
  const [selectedFeature, setSelectedFeature] = useState('all')   // 'all' | 'pool' | 'cedar_tub' | 'lagoon_access'
  const [sortOrder, setSortOrder] = useState('featured')          // 'featured' | 'price-asc' | 'price-desc'

  const activeCollection = SUITE_COLLECTIONS.find((c) => c.id === selectedCollection)

  // Filter & Sort Logic
  const filteredSuites = useMemo(() => {
    let list = [...RESIDENCES]

    // 1. Curated Collection Filter (Only 2 or 3 keys displayed at a time)
    if (selectedCollection !== 'all') {
      const col = SUITE_COLLECTIONS.find((c) => c.id === selectedCollection)
      if (col) {
        list = list.filter((r) => col.roomNumbers.includes(r.roomNumber))
      }
    }

    // 2. Guest Capacity Filter
    if (guestCapacity !== 'all') {
      const cap = parseInt(guestCapacity, 10)
      list = list.filter((r) => r.maxGuests >= cap)
    }

    // 3. Feature Filter
    if (selectedFeature !== 'all') {
      list = list.filter((r) => r.features && r.features.includes(selectedFeature))
    }

    // 4. Sort Order
    if (sortOrder === 'price-asc') {
      list.sort((a, b) => a.nightlyRate - b.nightlyRate)
    } else if (sortOrder === 'price-desc') {
      list.sort((a, b) => b.nightlyRate - a.nightlyRate)
    }

    return list
  }, [selectedCollection, guestCapacity, selectedFeature, sortOrder])

  // Navigate directly to /reserve with pre-selected room
  const handleOpenReservation = (residence = RESIDENCES[0]) => {
    navigate(`/reserve?room=${residence.roomNumber}`)
  }

  // Reset all filters back to default Curated Penthouses
  const handleResetFilters = () => {
    setSelectedCollection('penthouses')
    setGuestCapacity('all')
    setSelectedFeature('all')
    setSortOrder('featured')
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 selection:bg-emerald-100 selection:text-emerald-950 font-sans-clean">
      {/* 1. Sticky Minimal Navbar */}
      <Navbar onOpenDrawer={() => handleOpenReservation(RESIDENCES[0])} />

      {/* 2. Editorial Header */}
      <header className="pt-32 sm:pt-40 pb-12 px-6 sm:px-12 border-b border-slate-200/80 bg-gradient-to-b from-white/60 to-transparent">
        <div className="max-w-7xl mx-auto space-y-4">
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
                Seven architectural suites and private villas designed for comfort, natural light, and quiet privacy.
              </p>
            </div>

            <div className="text-xs font-mono text-slate-500 uppercase tracking-widest shrink-0">
              <span>● 100% Oceanfront</span> &bull; <span>7 Private Keys</span>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Curated Architectural Setting Tabs (Option A: 2-3 Keys Per Collection) */}
      <section className="bg-[#FAF8F5] border-b border-slate-200/80 py-6 px-6 sm:px-12 sticky top-16 sm:top-20 z-30 backdrop-blur-md bg-[#FAF8F5]/90">
        <div className="max-w-7xl mx-auto space-y-4">
          
          {/* Collection Tab Switcher Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* 3 Primary Setting Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs font-mono">
              {SUITE_COLLECTIONS.map((col) => {
                const isActive = selectedCollection === col.id
                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => setSelectedCollection(col.id)}
                    className={`px-4 py-2.5 rounded-[2px] border transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center gap-2.5 ${
                      isActive
                        ? 'bg-[#0E1201] text-[#FFF0CA] border-[#0E1201] font-bold shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200/90 hover:border-slate-400 hover:text-slate-950'
                    }`}
                  >
                    <span>{col.label}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-[2px] font-mono tracking-wider ${
                        isActive ? 'bg-[#FFF0CA]/20 text-[#FFF0CA]' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {col.count}
                    </span>
                  </button>
                )
              })}

              {/* Optional 'All Keys' Tab */}
              <button
                type="button"
                onClick={() => setSelectedCollection('all')}
                className={`px-3 py-2.5 rounded-[2px] border transition-all duration-300 cursor-pointer whitespace-nowrap text-[11px] font-mono ${
                  selectedCollection === 'all'
                    ? 'bg-[#0E1201] text-[#FFF0CA] border-[#0E1201] font-bold shadow-xs'
                    : 'bg-white/60 text-slate-500 border-slate-200/70 hover:border-slate-400 hover:text-slate-800'
                }`}
              >
                All 7 Keys
              </button>
            </div>

            {/* Quick Filter Selectors (Capacity & Sort) */}
            <div className="flex items-center gap-3 text-xs font-mono">
              <select
                value={guestCapacity}
                onChange={(e) => setGuestCapacity(e.target.value)}
                className="py-1.5 px-2.5 bg-white border border-slate-200/90 rounded-[2px] text-slate-800 text-xs font-mono focus:outline-none focus:border-slate-900 cursor-pointer"
              >
                <option value="all">Any Occupancy</option>
                <option value="2">2+ Guests</option>
                <option value="4">4 Guests</option>
              </select>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="py-1.5 px-2.5 bg-white border border-slate-200/90 rounded-[2px] text-slate-800 text-xs font-mono focus:outline-none focus:border-slate-900 cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Rate: Low to High</option>
                <option value="price-desc">Rate: High to Low</option>
              </select>
            </div>
          </div>

          {/* Active Collection Atmosphere Dossier Brief */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-slate-500 pt-1 border-t border-slate-200/60">
            <p className="text-slate-600 text-xs italic tracking-normal">
              {activeCollection
                ? activeCollection.description
                : 'All seven private suites and oceanfront cliff villas across the estate.'}
            </p>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[10px] tracking-widest uppercase text-slate-400">
                {activeCollection ? activeCollection.badge : 'FULL COLLECTION'} &bull; {filteredSuites.length} OF {activeCollection ? activeCollection.count : `${RESIDENCES.length} Keys`}
              </span>
              {(selectedCollection !== 'penthouses' || guestCapacity !== 'all' || selectedFeature !== 'all' || sortOrder !== 'featured') && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-amber-800 hover:text-amber-950 font-bold underline cursor-pointer"
                >
                  Reset &times;
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. The Suite Cards Stream (Curated 2-3 Suites Per View) */}
      <main className="max-w-7xl mx-auto px-6 py-8 sm:py-12 space-y-12 sm:space-y-16">
        {filteredSuites.length > 0 ? (
          filteredSuites.map((residence, idx) => (
            <RoomsCarousel
              key={residence.id}
              residence={residence}
              index={idx}
              onReserve={(res) => handleOpenReservation(res)}
              onOpenSpecs={(res) => setActiveSpecsSuite(res)}
            />
          ))
        ) : (
          <div className="p-16 bg-white border border-slate-200 text-center rounded-[2px] space-y-4 max-w-lg mx-auto my-12">
            <span className="text-3xl block">🏛</span>
            <h3 className="font-serif-grand text-2xl text-slate-900">No Suites Match Your Filters</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-mono">
              Adjust your setting or amenities filters above to view our available luxury suites.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-6 py-2.5 bg-slate-900 text-[#FFF0CA] font-mono text-xs uppercase tracking-wider font-bold rounded-[2px] hover:bg-emerald-950 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* 5. Same Architectural Footer */}
      <Footer />

      {/* 6. Architectural Specification Dossier Drawer */}
      <SuiteSpecsDrawer
        residence={activeSpecsSuite}
        isOpen={Boolean(activeSpecsSuite)}
        onClose={() => setActiveSpecsSuite(null)}
      />
    </div>
  )
}
