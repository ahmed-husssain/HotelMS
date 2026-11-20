import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useSmoothScroll } from '../hooks/useSmoothScroll'

/**
 * EstatePage — The Estate & Sanctuary Showcase
 * 
 * Comprehensive, dedicated overview of the Stayza property:
 * - Architectural design & natural travertine materials
 * - Coastal dining at The Harvest Pavilion & farm-to-table cuisine
 * - Mineral hot springs, cedar saunas & oceanfront wellness
 * - Private 1.2km beach, underground valet & quiet luxury arrival
 * 
 * Strict Compliance:
 * - AGENTS.md Architectural Constitution
 * - Zero emoji icons (clean typography & minimalist SVGs)
 * - Mobile-first responsive layout (min 44px touch targets)
 * - Pure Alabaster (#FAF8F5) aesthetic
 */
export default function EstatePage() {
  useSmoothScroll()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 selection:bg-emerald-100 selection:text-emerald-950 font-sans-clean">
      {/* 1. Header Navigation */}
      <Navbar onOpenDrawer={() => navigate('/reserve')} />

      {/* 2. Hero Section: The Estate Monograph */}
      <section className="relative pt-32 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-12 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Eyebrow strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-mono uppercase tracking-[0.28em] text-emerald-900 font-bold">
            <span>THE ESTATE &bull; SINDH COASTLINE</span>
            <span className="text-slate-500 font-normal tracking-widest">
              24° 51' N, 67° 00' E &bull; 42 PRIVATE ACRES
            </span>
          </div>

          {/* Editorial Title */}
          <div className="space-y-4 max-w-4xl">
            <h1 className="font-serif-grand text-4xl sm:text-6xl lg:text-7xl font-light text-slate-900 tracking-tight leading-[1.08]">
              Where Minimalist Architecture Meets the Arabian Sea.
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed font-normal">
              An oceanfront sanctuary designed in quiet harmony with the coastal cliffs. Forty-two acres of undisturbed shoreline, private mineral springs, farm-to-table dining, and cantilevered suites sculpted from local stone.
            </p>
          </div>

          {/* Cinematic Hero Imagery */}
          <div className="relative w-full h-[50vh] sm:h-[65vh] rounded-[2px] overflow-hidden shadow-xl bg-slate-950">
            <img
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1920&q=85"
              alt="The Estate grounds and coastline at Stayza"
              className="w-full h-full object-cover filter brightness-[0.92]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-6 sm:p-10">
              <div className="text-white space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-300 font-bold block">
                  COASTAL SANCTUARY
                </span>
                <p className="font-serif-grand text-xl sm:text-2xl font-light">
                  Secluded cliffside pavilion overlooking the tidal horizon.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Key Property Metrics Bar */}
      <section className="bg-white border-b border-slate-200/80 py-8 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-serif-grand font-light text-slate-900 block">42 Acres</span>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Private Oceanfront Grounds</span>
          </div>
          <div className="space-y-1 border-l border-slate-200 pl-4">
            <span className="text-2xl sm:text-3xl font-serif-grand font-light text-slate-900 block">7 Suites</span>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Intimate Low-Density Living</span>
          </div>
          <div className="space-y-1 border-l border-slate-200 pl-4">
            <span className="text-2xl sm:text-3xl font-serif-grand font-light text-slate-900 block">1.2 km</span>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Secluded Tidal Beach</span>
          </div>
          <div className="space-y-1 border-l border-slate-200 pl-4">
            <span className="text-2xl sm:text-3xl font-serif-grand font-light text-slate-900 block">100%</span>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Unobstructed Ocean View</span>
          </div>
        </div>
      </section>

      {/* 4. Architecture & Sustainable Materials */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-900 font-bold block">
                01 &bull; ARCHITECTURAL PHILOSOPHY
              </span>
              <h2 className="font-serif-grand text-3xl sm:text-4xl text-slate-900 font-light leading-tight">
                Built into the Bedrock, Not on Top of It.
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Stayza was conceived as an architectural dialogue between raw limestone, seasoned teak timber, and the vast Arabian Sea. We deliberately avoided multi-story hotel towers in favor of low-slung, cantilevered pavilions that hug the natural cliffside contours.
            </p>
            <div className="space-y-4 pt-2 text-xs text-slate-700">
              <div className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-slate-900 block font-mono text-[11px] uppercase">Sindh Travertine &amp; Basalt</strong>
                  Hand-cut regional stone that absorbs the desert sun and naturally insulates residences against coastal winds.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-slate-900 block font-mono text-[11px] uppercase">Passive Cooling Overhangs</strong>
                  Deep cantilevered roofs cast sheltering shade across floor-to-ceiling glass, cutting solar heat gain by 65%.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-slate-900 block font-mono text-[11px] uppercase">Private Subterranean Access</strong>
                  Underground arrival corridors and elevators ensure zero vehicular noise and absolute privacy across all suites.
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-72 sm:h-96 rounded-[2px] overflow-hidden bg-slate-900 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=85"
                alt="Cantilevered suite architecture at Stayza"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="h-72 sm:h-96 rounded-[2px] overflow-hidden bg-slate-900 shadow-md sm:translate-y-8">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85"
                alt="Travertine stone and teak terrace design"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Coastal Dining & The Harvest Pavilion */}
      <section id="dining" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-900 font-bold block">
                02 &bull; COASTAL DINING &amp; CUISINE
              </span>
              <h2 className="font-serif-grand text-3xl sm:text-4xl text-slate-900 font-light">
                The Harvest Pavilion
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md leading-relaxed">
              Organic, farm-to-table cuisine prepared with seafood caught each dawn by local coastal fishermen and fresh produce picked directly from our estate garden.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Card 1: Farm-to-Table */}
            <div className="bg-[#FAF8F5] border border-slate-200/90 rounded-[2px] p-6 space-y-4 shadow-xs">
              <div className="h-48 rounded-[2px] overflow-hidden bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=700&q=85"
                  alt="Fresh coastal dining at Stayza"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">RESTAURANT &bull; HARVEST PAVILION</span>
                <h3 className="font-serif-grand text-xl text-slate-900">Morning &amp; Evening Dining</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Open daily from 07:00 to 22:30. Enjoy open-air breakfast overlooking the tide, artisanal sourdoughs, cold-pressed coastal juices, and charcoal-grilled red snapper.
                </p>
              </div>
            </div>

            {/* Card 2: In-Suite Chef Dining */}
            <div className="bg-[#FAF8F5] border border-slate-200/90 rounded-[2px] p-6 space-y-4 shadow-xs">
              <div className="h-48 rounded-[2px] overflow-hidden bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=85"
                  alt="In-suite private chef terrace dining"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">PRIVATE &bull; IN-SUITE CHEF</span>
                <h3 className="font-serif-grand text-xl text-slate-900">Terrace Candlelight Dinners</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Request a multi-course tasting menu prepared live on your private suite plunge deck. Full sommelier pairings and custom dietary menus curated upon check-in.
                </p>
              </div>
            </div>

            {/* Card 3: Coastal Chai & Wine Lounge */}
            <div className="bg-[#FAF8F5] border border-slate-200/90 rounded-[2px] p-6 space-y-4 shadow-xs">
              <div className="h-48 rounded-[2px] overflow-hidden bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=700&q=85"
                  alt="Artisanal chai and sunset cellar selections"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">SUNSET &bull; THE LOOKOUT LOUNGE</span>
                <h3 className="font-serif-grand text-xl text-slate-900">Artisanal Chai &amp; Cellar</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Slow-brewed cardamom tea, regional infusions, and an international cellar selection served on cantilevered daybeds as the sunset dips into the Arabian Sea.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Mineral Hot Springs & Cedar Spa */}
      <section id="spa" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-72 sm:h-96 rounded-[2px] overflow-hidden bg-slate-900 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=900&q=85"
                alt="Cedar spa and warm mineral hot springs"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="h-72 sm:h-96 rounded-[2px] overflow-hidden bg-slate-900 shadow-md sm:translate-y-8">
              <img
                src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=85"
                alt="Holistic massage therapy at Stayza Spa"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-900 font-bold block">
                03 &bull; WELLNESS &amp; THERMAL WATERS
              </span>
              <h2 className="font-serif-grand text-3xl sm:text-4xl text-slate-900 font-light leading-tight">
                Mineral Hot Springs &amp; Cedar Baths.
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Carved directly out of the coastal cliffside, our thermal mineral springs tap into deep saline aquifers. Natural minerals soothe tired muscles while the gentle ocean breeze keeps the air fresh and cool.
            </p>
            <div className="space-y-3 pt-2 text-xs font-mono text-slate-800">
              <div className="p-3.5 bg-white border border-slate-200 rounded-[2px]">
                <strong className="block text-slate-900 font-semibold mb-0.5">38°C Mineral Plunge Pools</strong>
                Naturally heated mineral hot baths perched directly above the breaking surf.
              </div>
              <div className="p-3.5 bg-white border border-slate-200 rounded-[2px]">
                <strong className="block text-slate-900 font-semibold mb-0.5">Panoramic Dry Cedar Saunas</strong>
                Infused with coastal eucalyptus and wild thyme, overlooking the sea horizon.
              </div>
              <div className="p-3.5 bg-white border border-slate-200 rounded-[2px]">
                <strong className="block text-slate-900 font-semibold mb-0.5">Holistic Marine Treatments</strong>
                Sea salt exfoliation and organic botanical wraps curated by resident therapists.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Facilities, Grounds & Secluded Arrival */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-900 font-bold block">
              04 &bull; RESORT FACILITIES &amp; GROUNDS
            </span>
            <h2 className="font-serif-grand text-3xl sm:text-4xl text-slate-900 font-light">
              Designed for Uninterrupted Solitude.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every square meter of The Estate is curated to give each guest a quiet, private sanctuary free of crowded hotel lobbies or intrusive check-in lines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-[#FAF8F5] border border-slate-200/90 rounded-[2px] space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-800 font-bold block">BEACH ACCESS</span>
              <h3 className="font-serif-grand text-xl text-slate-900">1.2 km Private Beach</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Untouched coastal sands with private cabanas, shaded daybeds, and tidal wading pools reserved exclusively for resident guests.
              </p>
            </div>

            <div className="p-6 bg-[#FAF8F5] border border-slate-200/90 rounded-[2px] space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-800 font-bold block">ARRIVAL SANCTUARY</span>
              <h3 className="font-serif-grand text-xl text-slate-900">Underground Valet &amp; Helipad</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Vehicles arrive through a private subterranean portal with discreet elevators ascending directly into your suite. Private helipad coordinates available.
              </p>
            </div>

            <div className="p-6 bg-[#FAF8F5] border border-slate-200/90 rounded-[2px] space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-800 font-bold block">OCEAN ADVENTURES</span>
              <h3 className="font-serif-grand text-xl text-slate-900">Private Boat Charters</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Morning catamaran charters through the coastal coves and dolphin watching along the Sindh Coast, fully catered with fresh brunch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Call to Action — Reserve or Explore */}
      <section className="py-20 px-4 sm:px-6 lg:px-12 bg-[#0E1201] text-[#FAF8F5] text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#FFF0CA] font-bold block">
            STAYZA RESIDENCES &bull; 7 PRIVATE KEYS
          </span>
          <h2 className="font-serif-grand text-3xl sm:text-5xl font-light tracking-tight text-white leading-tight">
            Reserve Your Sanctuary on the Sindh Coast.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Experience the tranquility of our cliffside residences, mineral hot springs, and coastal dining. Secure your suite with a 30% advance deposit.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-mono">
            <Link
              to="/suites"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#FFF0CA] text-slate-950 font-bold uppercase tracking-wider rounded-[2px] hover:bg-white transition-colors"
            >
              Explore the 7 Suites &rarr;
            </Link>
            <Link
              to="/reserve"
              className="w-full sm:w-auto px-8 py-3.5 border border-slate-700 text-[#FAF8F5] font-bold uppercase tracking-wider rounded-[2px] hover:bg-slate-900 transition-colors"
            >
              Book a Stay (30% Deposit)
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Architectural Footer */}
      <Footer />
    </div>
  )
}
