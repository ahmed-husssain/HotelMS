import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

/**
 * EstatePage — The Estate & Grounds
 * 
 * Style 1: The Classic Full-Screen Fixed Window Parallax
 * 
 * How it works:
 * 1. Large, authentic, full-bleed ocean resort photos stay fixed in the background.
 * 2. Solid, warm alabaster cards with hotel stories and information slide up over the photos.
 * 3. As you scroll past each card, a new window reveals the next hotel experience (Dining, Spa, Beach).
 * 4. 100% butter-smooth, zero lag, zero jank, zero fake coordinates or robotic filler.
 */
export default function EstatePage() {
  const navigate = useNavigate()

  // Real, authentic, physics-abiding photography
  const HERO_IMG = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2400&q=85'
  const DINING_IMG = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2400&q=85'
  const SPA_IMG = 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=2400&q=85'

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 selection:bg-emerald-100 selection:text-emerald-950 font-sans-clean">
      {/* 1. Header Navigation */}
      <Navbar onOpenDrawer={() => navigate('/reserve')} />

      {/* ========================================================= */}
      {/* WINDOW 1: THE HERO (FIXED OCEAN CLIFFSIDE RETREAT PHOTO)  */}
      {/* ========================================================= */}
      <section
        className="relative h-screen w-full flex flex-col justify-between pt-28 pb-12 px-6 sm:px-12 lg:px-20 select-none bg-slate-950"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.3) 50%, rgba(15,23,42,0.65) 100%), url(${HERO_IMG})`,
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        {/* Top Eyebrow */}
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between text-xs font-mono uppercase tracking-[0.25em] text-[#FFF0CA]">
          <div className="flex items-center gap-2 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>STAYZA RESORT &bull; SINDH COAST</span>
          </div>
          <span className="hidden sm:inline-block text-white/80 font-normal">
            PRIVATE OCEAN SANCTUARY
          </span>
        </div>

        {/* Center Grand Title */}
        <div className="max-w-4xl w-full mx-auto my-auto text-center space-y-6">
          <span className="text-xs font-mono uppercase tracking-[0.35em] text-emerald-300 font-semibold block">
            42 OCEANFRONT ACRES &bull; 7 PRIVATE SUITES
          </span>
          <h1 className="font-serif-grand text-4xl sm:text-7xl lg:text-8xl font-light text-[#FAF8F5] tracking-tight leading-[1.04]">
            An Oceanfront Sanctuary Built into the Coast.
          </h1>
          <p className="text-sm sm:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed font-light">
            Secluded cliffside residences, farm-to-table coastal dining, and natural mineral hot springs overlooking the Arabian Sea.
          </p>
          <div className="pt-2 flex items-center justify-center gap-4">
            <a
              href="#grounds"
              className="px-6 py-3.5 bg-[#FAF8F5] hover:bg-white text-slate-950 font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] transition-all cursor-pointer shadow-xl active:scale-95"
            >
              Explore The Estate &darr;
            </a>
            <Link
              to="/suites"
              className="px-6 py-3.5 border border-white/50 hover:border-white text-[#FAF8F5] font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] transition-all"
            >
              View All 7 Suites &rarr;
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between text-[11px] font-mono text-white/70 border-t border-white/15 pt-4">
          <span>7 PRIVATE SUITES</span>
          <span className="text-white">SCROLL DOWN TO REVEAL SLIDING CARDS &darr;</span>
          <span>1.2 KM PRIVATE BEACH</span>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SLIDING CARD 1: THE GROUNDS & THE SUITES (SLIDES UP OVER HERO) */}
      {/* ========================================================= */}
      <div id="grounds" className="relative z-20 bg-[#FAF8F5] border-y border-slate-200/90 shadow-2xl">
        {/* Chapter 01: The Grounds */}
        <section className="py-20 sm:py-28 px-5 sm:px-12 lg:px-20 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-900 font-bold block">
                01 &bull; THE GROUNDS
              </span>
              <h2 className="font-serif-grand text-3xl sm:text-5xl text-slate-900 font-light leading-tight">
                Secluded Coastal Cliffs &amp; Private Beach.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Located on a quiet stretch of the Sindh coastline, Stayza spans forty-two acres of undisturbed cliffs and a kilometer of secluded beach. With zero commercial neighbors and zero noise, it is designed for peaceful ocean living.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2 font-mono text-xs">
                <div className="p-3.5 bg-white border border-slate-200 rounded-[2px]">
                  <span className="text-[10px] text-slate-400 block uppercase">Beachfront</span>
                  <strong className="text-slate-900 text-sm">1.2 km Secluded Sand</strong>
                </div>
                <div className="p-3.5 bg-white border border-slate-200 rounded-[2px]">
                  <span className="text-[10px] text-slate-400 block uppercase">Total Property</span>
                  <strong className="text-slate-900 text-sm">42 Private Acres</strong>
                </div>
                <div className="p-3.5 bg-white border border-slate-200 rounded-[2px]">
                  <span className="text-[10px] text-slate-400 block uppercase">Ocean View</span>
                  <strong className="text-slate-900 text-sm">100% West-Facing</strong>
                </div>
                <div className="p-3.5 bg-white border border-slate-200 rounded-[2px]">
                  <span className="text-[10px] text-slate-400 block uppercase">Sunset</span>
                  <strong className="text-slate-900 text-sm">Every Evening</strong>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="h-80 sm:h-[480px] rounded-[2px] overflow-hidden bg-slate-900 shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85"
                  alt="Secluded beach and untouched sands at Stayza"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>
        </section>

        {/* Chapter 02: Living Spaces (Suites & Villas) */}
        <section className="py-20 sm:py-28 px-5 sm:px-12 lg:px-20 bg-white">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-900 font-bold block">
                  02 &bull; LIVING SPACES
                </span>
                <h2 className="font-serif-grand text-3xl sm:text-5xl text-slate-900 font-light leading-tight">
                  Seven Oceanfront Residences.
                </h2>
              </div>
              <Link
                to="/suites"
                className="px-5 py-2.5 bg-slate-900 text-white font-mono text-xs uppercase tracking-wider rounded-[2px] hover:bg-emerald-950 transition-colors shrink-0"
              >
                Browse All 7 Suites &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Suite 1 */}
              <div className="space-y-4">
                <div className="h-72 rounded-[2px] overflow-hidden bg-slate-900 shadow-md">
                  <img
                    src="https://res.cloudinary.com/v1rl3ras/image/upload/v1795019369/hotel-suites/suite-301/suite-301-bedroom.webp"
                    alt="King master bedroom suite with ocean view"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-emerald-800 uppercase font-bold tracking-widest block">SUITE 301</span>
                  <h3 className="font-serif-grand text-xl text-slate-900">The Horizon Penthouse</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Panoramic master bedroom, private infinity plunge pool, and floor-to-ceiling sea horizon views.
                  </p>
                </div>
              </div>

              {/* Suite 2 */}
              <div className="space-y-4">
                <div className="h-72 rounded-[2px] overflow-hidden bg-slate-900 shadow-md">
                  <img
                    src="https://res.cloudinary.com/v1rl3ras/image/upload/v1795019371/hotel-suites/suite-301/suite-301-living.webp"
                    alt="Ocean living salon with travertine stone and teak wood"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-emerald-800 uppercase font-bold tracking-widest block">SUITE 204</span>
                  <h3 className="font-serif-grand text-xl text-slate-900">The Coastal Villa</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Sunlit living salon, hand-carved travertine walls, and private outdoor basalt stone courtyard.
                  </p>
                </div>
              </div>

              {/* Suite 3 */}
              <div className="space-y-4">
                <div className="h-72 rounded-[2px] overflow-hidden bg-slate-900 shadow-md">
                  <img
                    src="https://res.cloudinary.com/v1rl3ras/image/upload/v1795019373/hotel-suites/suite-301/suite-301-bath.webp"
                    alt="Travertine stone deep soaking bath overlooking the ocean"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-emerald-800 uppercase font-bold tracking-widest block">SUITE 401</span>
                  <h3 className="font-serif-grand text-xl text-slate-900">The Overwater Pavilion</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Heated travertine spa tub, rain shower, and direct terrace access above the breaking surf.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ========================================================= */}
      {/* WINDOW 2: THE HARVEST PAVILION DINING (FIXED OCEAN PHOTO)  */}
      {/* ========================================================= */}
      <section
        className="relative h-[65vh] sm:h-[80vh] w-full flex items-center justify-center select-none bg-slate-950"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.3) 50%, rgba(15,23,42,0.7) 100%), url(${DINING_IMG})`,
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <div className="max-w-3xl text-center px-6 text-white space-y-4">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#FFF0CA] font-semibold block">
            03 &bull; COASTAL DINING
          </span>
          <h2 className="font-serif-grand text-4xl sm:text-6xl font-light text-white leading-tight">
            The Harvest Pavilion
          </h2>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-light">
            Open-air seaside dining with fresh morning catch landed directly on our beach and organic produce from our estate garden.
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SLIDING CARD 2: DINING STORY & MENUS (SLIDES UP OVER DINING) */}
      {/* ========================================================= */}
      <div className="relative z-20 bg-[#FAF8F5] py-20 sm:py-28 px-5 sm:px-12 lg:px-20 border-y border-slate-200/90 shadow-2xl">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-900 font-bold block">
              FARM-TO-TABLE PHILOSOPHY
            </span>
            <h3 className="font-serif-grand text-3xl sm:text-4xl text-slate-900 font-light">
              Simple, Seasonal &amp; Fresh from the Tide.
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Every dawn, local artisanal fishermen arrive with wild red snapper, sea bass, and gulf prawns. Our chefs prepare meals over open wood-fired grills, paired with fresh herbs picked that morning from the garden beds above the villas.
            </p>

            <div className="p-5 bg-white border border-slate-200 rounded-[2px] space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 uppercase text-[10px]">Open-Air Breakfast</span>
                <strong>07:00 &ndash; 11:00</strong>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 uppercase text-[10px]">All-Day Coastal Dining</span>
                <strong>12:00 &ndash; 22:30</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 uppercase text-[10px]">In-Suite Private Chef</span>
                <strong>By Request (On Your Terrace)</strong>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="h-80 sm:h-[450px] rounded-[2px] overflow-hidden bg-slate-900 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85"
                alt="Fresh estate vegetables and local morning catch"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* WINDOW 3: MINERAL HOT SPRINGS & SPA (FIXED SPA PHOTO)      */}
      {/* ========================================================= */}
      <section
        className="relative h-[65vh] sm:h-[80vh] w-full flex items-center justify-center select-none bg-slate-950"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.3) 50%, rgba(15,23,42,0.7) 100%), url(${SPA_IMG})`,
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <div className="max-w-3xl text-center px-6 text-white space-y-4">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#FFF0CA] font-semibold block">
            04 &bull; WELLNESS &amp; THERMAL WATERS
          </span>
          <h2 className="font-serif-grand text-4xl sm:text-6xl font-light text-white leading-tight">
            Mineral Hot Springs &amp; Cedar Baths
          </h2>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-light">
            Naturally heated geothermal saline baths carved directly out of the coastal cliffs overlooking the breaking waves.
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SLIDING CARD 3: WELLNESS STORY & ARRIVAL (SLIDES UP OVER SPA) */}
      {/* ========================================================= */}
      <div className="relative z-20 bg-white py-20 sm:py-28 px-5 sm:px-12 lg:px-20 border-y border-slate-200/90 shadow-2xl">
        <div className="max-w-7xl mx-auto space-y-20">
          
          {/* Spa Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-[#FAF8F5] border border-slate-200 rounded-[2px] space-y-2">
              <strong className="text-slate-900 block font-mono text-xs uppercase">38°C Thermal Plunge Baths</strong>
              <p className="text-xs text-slate-600 leading-relaxed">
                Naturally heated geothermal mineral waters rich in sea minerals, positioned on cliff terraces directly above the surf.
              </p>
            </div>
            <div className="p-6 bg-[#FAF8F5] border border-slate-200 rounded-[2px] space-y-2">
              <strong className="text-slate-900 block font-mono text-xs uppercase">Panoramic Cedar Saunas</strong>
              <p className="text-xs text-slate-600 leading-relaxed">
                Weathered timber dry saunas infused with wild coastal thyme, overlooking the vast ocean horizon.
              </p>
            </div>
            <div className="p-6 bg-[#FAF8F5] border border-slate-200 rounded-[2px] space-y-2">
              <strong className="text-slate-900 block font-mono text-xs uppercase">Holistic Marine Treatments</strong>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rejuvenating sea salt scrubs and organic body treatments curated by resident holistic therapists.
              </p>
            </div>
          </div>

          {/* Chapter 05: Arrival Sanctuary */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center pt-8 border-t border-slate-200">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-900 font-bold block">
                05 &bull; COMPLETE PRIVACY
              </span>
              <h3 className="font-serif-grand text-3xl sm:text-4xl text-slate-900 font-light leading-tight">
                Underground Valet &amp; Zero Hotel Lobbies.
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                True luxury is peace and quiet. When you arrive at the estate, your vehicle enters an underground travertine portal. A private elevator takes you straight into your suite, where check-in takes place in complete comfort without lobbies or waiting.
              </p>
              <div className="space-y-3 pt-2 text-xs font-mono">
                <div className="p-3 bg-[#FAF8F5] border border-slate-200 rounded-[2px] flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-700" />
                  <span>Private Chauffeur Transfers from Karachi (75 Minutes)</span>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-slate-200 rounded-[2px] flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-700" />
                  <span>Underground Parking &amp; Direct Suite Elevators</span>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-slate-200 rounded-[2px] flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-700" />
                  <span>100% In-Suite Check-In (No Crowds, No Waiting)</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="h-80 sm:h-[420px] rounded-[2px] overflow-hidden bg-slate-900 shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=85"
                  alt="Underground valet portal and private residence entrance"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* FINAL CALL TO ACTION (RESERVE A SUITE)                    */}
      {/* ========================================================= */}
      <section className="relative z-20 py-24 sm:py-32 px-5 sm:px-12 lg:px-20 bg-[#0E1201] text-[#FAF8F5] text-center select-none">
        <div className="max-w-3xl mx-auto space-y-6">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#FFF0CA] font-bold block">
            STAYZA RESIDENCES &bull; 7 PRIVATE SUITES
          </span>
          <h2 className="font-serif-grand text-3xl sm:text-6xl font-light tracking-tight text-white leading-tight">
            Reserve Your Stay on the Coast.
          </h2>
          <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-normal">
            Experience the peace of our cliffside residences, mineral hot springs, and coastal dining. Secure your suite with a 30% advance deposit.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-mono">
            <Link
              to="/suites"
              className="w-full sm:w-auto px-8 py-4 bg-[#FFF0CA] text-slate-950 font-bold uppercase tracking-wider rounded-[2px] hover:bg-white transition-colors min-h-[44px] flex items-center justify-center"
            >
              Explore the 7 Suites &rarr;
            </Link>
            <Link
              to="/reserve"
              className="w-full sm:w-auto px-8 py-4 border border-slate-700 text-[#FAF8F5] font-bold uppercase tracking-wider rounded-[2px] hover:bg-slate-900 transition-colors min-h-[44px] flex items-center justify-center"
            >
              Book a Stay (30% Deposit)
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Architectural Footer */}
      <Footer />
    </div>
  )
}
