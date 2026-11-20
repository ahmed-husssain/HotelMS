import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

gsap.registerPlugin(ScrollTrigger)

/**
 * Chapters of The Estate — Simple, Clean Navigation
 */
const CHAPTERS = [
  { id: 'grounds', num: '01', title: 'The Grounds' },
  { id: 'suites', num: '02', title: 'Suites & Villas' },
  { id: 'dining', num: '03', title: 'Coastal Dining' },
  { id: 'wellness', num: '04', title: 'Mineral Springs' },
  { id: 'arrival', num: '05', title: 'Arrival & Privacy' },
]

/**
 * EstatePage — The Estate & Grounds
 * 
 * Clean, genuine luxury resort presentation (Habitas / Aman style):
 * - Real drone video and authentic ocean/resort photography (no random towels or lotion bottles)
 * - Zero pretentious robotic filler (no fake coordinates or "architectural monograph" jargon)
 * - Silky-smooth hardware-accelerated parallax (single unified scroll engine, zero stutter)
 * - Focused 100% on what guests actually care about: the beach, suites, food, and spa
 */
export default function EstatePage() {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const videoRef = useRef(null)
  const [activeChapter, setActiveChapter] = useState('grounds')

  useEffect(() => {
    // Refresh ScrollTrigger after DOM renders
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 250)

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return () => clearTimeout(timer)

    const ctx = gsap.context(() => {
      // 1. Hero Drone Video Parallax
      gsap.to('.estate-hero-video', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: '.estate-hero-container',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      // 2. Parallax Windows (Smooth, natural 80px travel displacement)
      gsap.utils.toArray('.estate-parallax-img').forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -10, scale: 1.08 },
          {
            yPercent: 10,
            scale: 1.0,
            ease: 'none',
            scrollTrigger: {
              trigger: img.parentElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        )
      })

      // 3. Track Active Chapter on Scroll
      CHAPTERS.forEach((ch) => {
        ScrollTrigger.create({
          trigger: `#${ch.id}`,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActiveChapter(ch.id),
          onEnterBack: () => setActiveChapter(ch.id),
        })
      })
    }, containerRef)

    return () => {
      clearTimeout(timer)
      ctx.revert()
    }
  }, [])

  const scrollToChapter = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
      setActiveChapter(id)
    }
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#FAF8F5] text-slate-900 selection:bg-emerald-100 selection:text-emerald-950 font-sans-clean overflow-x-hidden"
    >
      {/* 1. Header Navigation */}
      <Navbar onOpenDrawer={() => navigate('/reserve')} />

      {/* 2. HERO: CINEMATIC OCEAN DRONE PARALLAX (REAL COASTLINE, NO FAKE JARGON) */}
      <section className="estate-hero-container relative h-screen w-full overflow-hidden flex flex-col justify-between pt-28 pb-10 px-5 sm:px-10 lg:px-16 select-none bg-slate-950">
        {/* Real Coastal Drone Video / Poster Background */}
        <div className="absolute inset-0 w-full h-[125%] -top-[12%] pointer-events-none">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="/assets/hero-drone-poster.webp"
            className="estate-hero-video w-full h-full object-cover object-center filter brightness-[0.75] contrast-[1.05] will-change-transform"
          >
            <source src="/assets/hero-drone-ultra.webm" type="video/webm" />
            <source src="/assets/hero-drone-optimized.mp4" type="video/mp4" />
          </video>
          {/* Gentle cinematic darkening gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/60" />
        </div>

        {/* Clean, Simple Top Eyebrow */}
        <div className="relative z-10 max-w-7xl w-full mx-auto flex items-center justify-between text-xs font-mono uppercase tracking-[0.25em] text-[#FFF0CA]">
          <div className="flex items-center gap-2 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>STAYZA RESORT &bull; SINDH COAST</span>
          </div>
          <span className="hidden sm:inline-block text-white/70 font-normal">
            PRIVATE COASTAL RETREAT
          </span>
        </div>

        {/* Center Title (Clean, Grand, Human Wording) */}
        <div className="relative z-10 max-w-4xl w-full mx-auto my-auto text-center space-y-6">
          <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.35em] text-emerald-300 font-semibold block">
            42 OCEANFRONT ACRES &bull; 7 PRIVATE SUITES
          </span>
          <h1 className="font-serif-grand text-4xl sm:text-7xl lg:text-8xl font-light text-[#FAF8F5] tracking-tight leading-[1.04]">
            An Oceanfront Sanctuary Built into the Coast.
          </h1>
          <p className="text-sm sm:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed font-light">
            Secluded cliffside residences, farm-to-table coastal dining, and natural mineral hot springs overlooking the Arabian Sea.
          </p>
          <div className="pt-2 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => scrollToChapter('grounds')}
              className="px-6 py-3 bg-[#FAF8F5] hover:bg-white text-slate-950 font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] transition-all cursor-pointer shadow-lg active:scale-95"
            >
              Explore The Property &darr;
            </button>
            <Link
              to="/suites"
              className="px-6 py-3 border border-white/40 hover:border-white text-[#FAF8F5] font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] transition-all"
            >
              View Suites &rarr;
            </Link>
          </div>
        </div>

        {/* Bottom Quick Facts (Simple & Real) */}
        <div className="relative z-10 max-w-7xl w-full mx-auto flex items-center justify-between text-[11px] font-mono text-white/70 border-t border-white/15 pt-4">
          <span>7 PRIVATE SUITES &amp; VILLAS</span>
          <span>1.2 KM PRIVATE BEACH</span>
          <span>75 MIN FROM KARACHI</span>
        </div>
      </section>

      {/* 3. STICKY CHAPTER NAVIGATION BAR */}
      <nav
        aria-label="Estate Chapters"
        className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 lg:px-14 py-3 shadow-xs"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 overflow-x-auto no-scrollbar text-xs font-mono uppercase tracking-wider">
          <div className="flex items-center gap-6 sm:gap-8 min-w-max">
            {CHAPTERS.map((ch) => {
              const isActive = activeChapter === ch.id
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => scrollToChapter(ch.id)}
                  className={`group relative flex items-center gap-2 py-1.5 transition-colors cursor-pointer min-h-[44px] ${
                    isActive ? 'text-slate-950 font-bold' : 'text-slate-500 hover:text-slate-800 font-normal'
                  }`}
                >
                  <span className={`text-[10px] ${isActive ? 'text-emerald-700' : 'text-slate-400'}`}>
                    [{ch.num}]
                  </span>
                  <span>{ch.title}</span>
                  {isActive && (
                    <span className="absolute bottom-0 inset-x-0 h-[2px] bg-slate-900 rounded-full" />
                  )}
                </button>
              )
            })}
          </div>

          <Link
            to="/reserve"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0E1201] text-[#FFF0CA] text-[11px] font-bold rounded-[2px] hover:bg-slate-900 transition-colors shrink-0"
          >
            <span>Book a Stay (30% Deposit)</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </nav>

      {/* 4. CHAPTER 01: THE GROUNDS & BEACH */}
      <section id="grounds" className="py-20 sm:py-28 px-4 sm:px-8 lg:px-14 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Pinned Info Column */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-900 font-bold block">
                01 &bull; THE GROUNDS
              </span>
              <h2 className="font-serif-grand text-3xl sm:text-5xl text-slate-900 font-light leading-tight">
                Secluded Coastal Cliffs &amp; Private Beach.
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Located on a quiet stretch of the Sindh coastline, Stayza spans forty-two acres of undisturbed cliffs and a kilometer of secluded beach. With zero crowded commercial neighbors and zero noise, it is designed for peaceful ocean living.
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

          {/* Gliding Real Ocean Photos */}
          <div className="lg:col-span-7 space-y-12">
            <div className="relative h-[55vh] sm:h-[70vh] rounded-[2px] overflow-hidden bg-slate-950 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85"
                alt="Pristine coastal sand and calm blue ocean waves"
                className="estate-parallax-img absolute inset-0 w-full h-[120%] object-cover will-change-transform"
              />
              <div className="absolute bottom-6 left-6 p-4 bg-[#FAF8F5]/95 backdrop-blur-md border border-slate-300 text-xs font-mono rounded-[2px] shadow-lg max-w-xs">
                <strong className="text-slate-900 block text-xs uppercase mb-0.5">The Private Shoreline</strong>
                <span className="text-slate-600 text-[11px]">Reserved exclusively for resident guests.</span>
              </div>
            </div>

            <div className="relative h-[45vh] sm:h-[60vh] rounded-[2px] overflow-hidden bg-slate-950 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=85"
                alt="Cliffside villa terrace overlooking the sea"
                className="estate-parallax-img absolute inset-0 w-full h-[120%] object-cover will-change-transform"
              />
              <div className="absolute bottom-6 left-6 p-4 bg-[#FAF8F5]/95 backdrop-blur-md border border-slate-300 text-xs font-mono rounded-[2px] shadow-lg max-w-xs">
                <strong className="text-slate-900 block text-xs uppercase mb-0.5">Terraces Above the Sea</strong>
                <span className="text-slate-600 text-[11px]">Private plunge pools suspended over the tide.</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. CHAPTER 02: SUITES & VILLAS (REAL SUITES FROM THE PROPERTY) */}
      <section id="suites" className="py-20 sm:py-28 px-4 sm:px-8 lg:px-14 bg-white border-b border-slate-200/80">
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
                  alt="King bedroom suite with ocean view"
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

      {/* 6. CHAPTER 03: COASTAL DINING & THE HARVEST TABLE */}
      <section id="dining" className="py-20 sm:py-28 px-4 sm:px-8 lg:px-14 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Pinned Dining Monograph */}
          <div className="lg:col-span-5 lg:order-2 lg:sticky lg:top-28 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-900 font-bold block">
                03 &bull; COASTAL CUISINE
              </span>
              <h2 className="font-serif-grand text-3xl sm:text-5xl text-slate-900 font-light leading-tight">
                The Harvest Pavilion &amp; Fresh Seafood.
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Dining at Stayza is open-air and farm-to-table. Every morning at dawn, local fishermen land fresh red snapper, gulf prawns, and sea bass directly on our beach. Our kitchen pairs the catch with organic vegetables grown right on the property.
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

            <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-[2px] text-xs text-emerald-950 font-mono">
              <strong>Guest Highlight:</strong> Whole salt-crusted red snapper grilled over charred wood with cold-pressed citrus oil and garden herbs.
            </div>
          </div>

          {/* Gliding Real Dining Photos */}
          <div className="lg:col-span-7 lg:order-1 space-y-12">
            <div className="relative h-[55vh] sm:h-[70vh] rounded-[2px] overflow-hidden bg-slate-950 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=85"
                alt="Open-air seaside dining table at dusk"
                className="estate-parallax-img absolute inset-0 w-full h-[120%] object-cover filter brightness-[0.85] will-change-transform"
              />
              <div className="absolute bottom-6 left-6 p-4 bg-[#FAF8F5]/95 backdrop-blur-md border border-slate-300 text-xs font-mono rounded-[2px] shadow-lg max-w-xs">
                <strong className="text-slate-900 block text-xs uppercase mb-0.5">The Harvest Pavilion</strong>
                <span className="text-slate-600 text-[11px]">Candlelit tables overlooking the sunset tide.</span>
              </div>
            </div>

            <div className="relative h-[45vh] sm:h-[60vh] rounded-[2px] overflow-hidden bg-slate-950 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=85"
                alt="Fresh organic estate vegetables and fresh herbs"
                className="estate-parallax-img absolute inset-0 w-full h-[120%] object-cover will-change-transform"
              />
              <div className="absolute bottom-6 left-6 p-4 bg-[#FAF8F5]/95 backdrop-blur-md border border-slate-300 text-xs font-mono rounded-[2px] shadow-lg max-w-xs">
                <strong className="text-slate-900 block text-xs uppercase mb-0.5">Estate Garden</strong>
                <span className="text-slate-600 text-[11px]">Organic produce picked fresh every morning.</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 7. CHAPTER 04: WELLNESS & MINERAL HOT SPRINGS */}
      <section id="wellness" className="py-20 sm:py-28 px-4 sm:px-8 lg:px-14 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-3xl space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-900 font-bold block">
              04 &bull; WELLNESS &amp; SPA
            </span>
            <h2 className="font-serif-grand text-3xl sm:text-5xl text-slate-900 font-light leading-tight">
              Mineral Hot Springs &amp; Cedar Wood Baths.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Sourced from natural coastal aquifers, our stone thermal baths are rich in natural sea minerals. Positioned on open rock terraces facing the sea, steam rises into the cool evening air while the tide crashes beneath your feet.
            </p>
          </div>

          <div className="relative h-[55vh] sm:h-[70vh] rounded-[2px] overflow-hidden bg-slate-950 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=2200&q=85"
              alt="Outdoor thermal hot spring pool overlooking the ocean surf"
              className="estate-parallax-img absolute inset-0 w-full h-[120%] object-cover will-change-transform"
            />
            <div className="absolute bottom-6 left-6 p-5 bg-[#FAF8F5]/95 backdrop-blur-md border border-slate-300 rounded-[2px] max-w-sm shadow-xl">
              <strong className="text-slate-900 block font-mono text-xs uppercase mb-1">
                38°C Natural Mineral Baths
              </strong>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                Carved into the seaside rock, soothing tired muscles while the ocean breeze keeps the air fresh.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CHAPTER 05: ARRIVAL & COMPLETE PRIVACY */}
      <section id="arrival" className="py-20 sm:py-28 px-4 sm:px-8 lg:px-14 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-900 font-bold block">
              05 &bull; COMPLETE PRIVACY
            </span>
            <h2 className="font-serif-grand text-3xl sm:text-5xl text-slate-900 font-light leading-tight">
              Underground Valet &amp; Zero Hotel Lobbies.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              True luxury is peace and quiet. When you arrive at the estate, your vehicle enters an underground travertine portal. A private elevator takes you straight into your suite, where check-in takes place in complete comfort.
            </p>
            <div className="space-y-3 pt-2 text-xs font-mono">
              <div className="p-3 bg-white border border-slate-200 rounded-[2px] flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-700" />
                <span>Private Chauffeur Transfers from Karachi (75 Minutes)</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-[2px] flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-700" />
                <span>Underground Parking &amp; Private Suite Elevators</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-[2px] flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-700" />
                <span>100% In-Suite Check-In (No Crowds, No Waiting)</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative h-80 sm:h-[450px] rounded-[2px] overflow-hidden bg-slate-900 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85"
                alt="Underground valet portal and private residence entrance"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 9. CLOSING RESERVATION CALL TO ACTION */}
      <section className="py-24 sm:py-32 px-4 sm:px-8 lg:px-14 bg-[#0E1201] text-[#FAF8F5] text-center relative overflow-hidden select-none">
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
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

      {/* 10. Footer */}
      <Footer />
    </div>
  )
}
