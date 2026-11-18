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
  const [guestCapacity, setGuestCapacity] = useState('all')       // 'all' | '2' | '4'
  const [selectedFeature, setSelectedFeature] = useState('all')   // 'all' | 'pool' | 'cedar_tub' | 'lagoon_access'
  const [sortOrder, setSortOrder] = useState('featured')          // 'featured' | 'price-asc' | 'price-desc'

  const activeCollection = useMemo(() => {
    return (
      ARCHITECTURAL_COLLECTIONS.find((c) => c.id === selectedCollectionId) ||
      ARCHITECTURAL_COLLECTIONS[0]
    )
  }, [selectedCollectionId])

  // Filter & Sort Logic within Curated Collection
  const filteredSuites = useMemo(() => {
    let list = RESIDENCES.filter(activeCollection.matcher)

    // 1. Guest Capacity Filter
    if (guestCapacity !== 'all') {
      const cap = parseInt(guestCapacity, 10)
      list = list.filter((r) => r.maxGuests >= cap)
    }

    // 2. Feature Filter
    if (selectedFeature !== 'all') {
      list = list.filter((r) => r.features && r.features.includes(selectedFeature))
    }

    // 3. Sort Order
    if (sortOrder === 'price-asc') {
      list.sort((a, b) => a.nightlyRate - b.nightlyRate)
    } else if (sortOrder === 'price-desc') {
      list.sort((a, b) => b.nightlyRate - a.nightlyRate)
    }

    return list
  }, [activeCollection, guestCapacity, selectedFeature, sortOrder])

  // Navigate directly to /reserve with pre-selected room
  const handleOpenReservation = (residence = RESIDENCES[0]) => {
    navigate(`/reserve?room=${residence.roomNumber}`)
  }

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCollectionId('penthouses')
    setGuestCapacity('all')
    setSelectedFeature('all')
    setSortOrder('featured')
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 selection:bg-emerald-100 selection:text-emerald-950 font-sans-clean">
      {/* 1. Sticky Minimal Navbar */}
      <Navbar onOpenDrawer={() => handleOpenReservation(RESIDENCES[0])} />

      {/* 2. Editorial Header */}
      <header className="pt-32 sm:pt-40 pb-10 px-6 sm:px-12 border-b border-slate-200/80 bg-gradient-to-b from-white/60 to-transparent">
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
                Curated collections of private oceanfront residences designed for quiet privacy, natural light, and space.
              </p>
            </div>

            <div className="text-xs font-mono text-slate-500 uppercase tracking-widest shrink-0">
              <span>● 100% Oceanfront</span> &bull; <span>7 Private Keys</span>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Luxury Collection Tabs & Hairline Filter Bar (Option A) */}
      <section className="bg-[#FAF8F5] border-b border-slate-200/80 py-5 px-6 sm:px-12 sticky top-20 z-30 backdrop-blur-md bg-[#FAF8F5]/95">
        <div className="max-w-7xl mx-auto space-y-4">
          
          {/* Curated Collection Navigation Pills */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* 3 Intimate Setting Collections + Complete View */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none text-xs font-mono">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mr-1 shrink-0 select-none">
                COLLECTION:
              </span>
              {ARCHITECTURAL_COLLECTIONS.map((col) => {
                const isActive = selectedCollectionId === col.id
                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => setSelectedCollectionId(col.id)}
                    className={`px-3.5 py-2 rounded-[2px] border transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                      isActive
                        ? 'bg-[#0E1201] text-[#FFF0CA] border-[#0E1201] font-bold shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200/90 hover:border-slate-400'
                    }`}
                  >
                    <span>{col.label}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-[1px] font-mono tracking-widest ${
                        isActive
                          ? 'bg-white/20 text-[#FFF0CA]'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {col.keys}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Feature & Sorting Dropdown Controls */}
            <div className="flex items-center gap-3 text-xs font-mono">
              {/* Feature Quick Selector */}
              <select
                value={selectedFeature}
                onChange={(e) => setSelectedFeature(e.target.value)}
                className="py-1.5 px-2.5 bg-white border border-slate-200/90 rounded-[2px] text-slate-800 text-xs font-mono focus:outline-none focus:border-slate-900 cursor-pointer"
              >
                <option value="all">All Amenities</option>
                <option value="pool">Private Infinity Pool</option>
                <option value="cedar_tub">Cedar Hot Tub</option>
                <option value="lagoon_access">Lagoon Sundeck</option>
              </select>

              {/* Guest Capacity Selector */}
              <select
                value={guestCapacity}
                onChange={(e) => setGuestCapacity(e.target.value)}
                className="py-1.5 px-2.5 bg-white border border-slate-200/90 rounded-[2px] text-slate-800 text-xs font-mono focus:outline-none focus:border-slate-900 cursor-pointer"
              >
                <option value="all">Any Capacity</option>
                <option value="2">2 Guests</option>
                <option value="4">4 Guests</option>
              </select>

              {/* Price Sort Order */}
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

          {/* Active Collection Editorial Tagline & Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200/60">
            <span className="text-slate-600">
              {activeCollection.tagline}
            </span>
            <div className="flex items-center gap-3 shrink-0">
              <span>
                Showing <strong>{filteredSuites.length}</strong> of <strong>{RESIDENCES.length}</strong> Keys
              </span>
              {(selectedCollectionId !== 'penthouses' || selectedFeature !== 'all' || guestCapacity !== 'all' || sortOrder !== 'featured') && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-amber-800 hover:text-amber-950 font-bold underline cursor-pointer"
                >
                  Reset View &times;
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. The Curated Suites Showcase (Only 2-3 suites per collection, Zero Scroll Fatigue) */}
      <main className="max-w-7xl mx-auto px-6 py-12 sm:py-16 space-y-16">
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

      {/* 5. Architectural Footer */}
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
