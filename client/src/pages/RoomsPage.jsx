import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import RoomsCarousel from '../components/RoomsCarousel'
import SuiteSpecsDrawer from '../components/suites/SuiteSpecsDrawer'
import { RESIDENCES } from '../data/residences'
import { useSmoothScroll } from '../hooks/useSmoothScroll'

export default function RoomsPage() {
  useSmoothScroll()
  const navigate = useNavigate()

  // Architectural Specs Drawer State
  const [activeSpecsSuite, setActiveSpecsSuite] = useState(null)

  // Filter States (Doc FR-1.1 & FR-1.2)
  const [selectedCategory, setSelectedCategory] = useState('all') // 'all' | 'penthouse' | 'villa' | 'overwater'
  const [guestCapacity, setGuestCapacity] = useState('all')       // 'all' | '2' | '4'
  const [selectedFeature, setSelectedFeature] = useState('all')   // 'all' | 'pool' | 'cedar_tub' | 'lagoon_access'
  const [sortOrder, setSortOrder] = useState('featured')          // 'featured' | 'price-asc' | 'price-desc'

  // Filter & Sort Logic
  const filteredSuites = useMemo(() => {
    let list = [...RESIDENCES]

    // 1. Category Filter
    if (selectedCategory !== 'all') {
      list = list.filter((r) => r.category === selectedCategory)
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
  }, [selectedCategory, guestCapacity, selectedFeature, sortOrder])

  // Navigate directly to /reserve with pre-selected room
  const handleOpenReservation = (residence = RESIDENCES[0]) => {
    navigate(`/reserve?room=${residence.roomNumber}`)
  }

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCategory('all')
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
            RESIDENTIAL DIRECTORY &bull; SINDH COAST
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="font-serif-grand text-4xl sm:text-6xl text-slate-900 font-light tracking-tight">
                Architectural Suites &amp; Villas.
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-2 leading-relaxed font-normal">
                Five bespoke oceanfront dwellings engineered for absolute privacy, silence, and natural light. Built directly into the limestone cliffs of the Sindh Coast.
              </p>
            </div>

            <div className="text-xs font-mono text-slate-500 uppercase tracking-widest shrink-0">
              <span>● 100% Oceanfront</span> &bull; <span>5 Private Keys</span>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Luxury Hairline Filter Bar (Doc FR-1.1 & FR-1.2) */}
      <section className="bg-[#FAF8F5] border-b border-slate-200/80 py-5 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto space-y-3">
          
          {/* Filter Controls Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Category / Setting Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs font-mono">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mr-1.5 shrink-0">
                SETTING:
              </span>
              {[
                { id: 'all', label: 'All Suites' },
                { id: 'penthouse', label: 'Penthouse' },
                { id: 'villa', label: 'Garden Villa' },
                { id: 'overwater', label: 'Overwater' },
              ].map((cat) => {
                const isActive = selectedCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-[2px] border transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#0E1201] text-[#FFF0CA] border-[#0E1201] font-bold shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200/90 hover:border-slate-400'
                    }`}
                  >
                    {cat.label}
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
                <option value="all">Any Occupancy</option>
                <option value="2">2+ Guests</option>
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

          {/* Active Status & Reset Row */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-200/60">
            <span>
              Showing <strong>{filteredSuites.length}</strong> of <strong>{RESIDENCES.length}</strong> Architectural Residences
            </span>
            {(selectedCategory !== 'all' || selectedFeature !== 'all' || guestCapacity !== 'all' || sortOrder !== 'featured') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-amber-800 hover:text-amber-950 font-bold underline cursor-pointer"
              >
                Reset All Filters &times;
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 4. The Suite Cards Stream (Exact Same RoomsCarousel Component) */}
      <main className="max-w-7xl mx-auto px-6 py-16 sm:py-24 space-y-24">
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
