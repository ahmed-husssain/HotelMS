import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useSmoothScroll } from '../hooks/useSmoothScroll'

gsap.registerPlugin(ScrollTrigger)

/**
 * Chapters of The Estate — Editorial Chapter Navigation
 */
const CHAPTERS = [
  { id: 'land', num: '01', title: 'The Land' },
  { id: 'architecture', num: '02', title: 'Architecture' },
  { id: 'culinary', num: '03', title: 'The Harvest Table' },
  { id: 'wellness', num: '04', title: 'Thermal Springs' },
  { id: 'arrival', num: '05', title: 'Arrival Sanctuary' },
]

/**
 * EstatePage — The Estate & Sanctuary (Awwwards Master Parallax Edition)
 * 
 * Signature Awwwards Luxury Hotel Techniques:
 * 1. Pinned Split-Screen Storytelling (Pinned text column + full-height gliding photography)
 * 2. Full-bleed Fixed-Depth Parallax Curtain Windows (250px+ travel displacement)
 * 3. Scroll-Driven Horizontal Kinetic Typography Ribbons
 * 4. Dual-speed Asymmetrical Counter-scrolling Editorial Badges
 * 5. Authentic real-world architectural photography with true physical lighting & geology
 */
export default function EstatePage() {
  useSmoothScroll()
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const [activeChapter, setActiveChapter] = useState('land')

  useEffect(() => {
    // Refresh ScrollTrigger once DOM layout stabilizes
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 200)

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return () => clearTimeout(refreshTimer)

    const ctx = gsap.context(() => {
      // 1. HERO PARALLAX: Deep Background Drop on Scroll
      gsap.fromTo(
        '.awwwards-hero-img',
        { y: 0, scale: 1.1 },
        {
          y: 220,
          scale: 1.0,
          ease: 'none',
          scrollTrigger: {
            trigger: '.awwwards-hero-container',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        }
      )

      // Hero Text Fade & Rise
      gsap.to('.awwwards-hero-text', {
        y: -120,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.awwwards-hero-container',
          start: 'top top',
          end: '80% top',
          scrub: true,
        },
      })

      // 2. KINETIC HORIZONTAL TYPOGRAPHY RIBBON (Moves across screen driven by scroll)
      gsap.to('.kinetic-ribbon-text-1', {
        xPercent: -35,
        ease: 'none',
        scrollTrigger: {
          trigger: '.kinetic-ribbon-1',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.3,
        },
      })

      gsap.to('.kinetic-ribbon-text-2', {
        xPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.kinetic-ribbon-2',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.3,
        },
      })

      // 3. DRAMATIC DUAL-SPEED PARALLAX WINDOWS (200px+ true travel displacement)
      gsap.utils.toArray('.awwwards-parallax-window').forEach((windowEl) => {
        const img = windowEl.querySelector('img')
        if (!img) return

        gsap.fromTo(
          img,
          { y: -140, scale: 1.15 },
          {
            y: 140,
            scale: 1.0,
            ease: 'none',
            scrollTrigger: {
              trigger: windowEl,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        )
      })

      // 4. COUNTER-SCROLLING PLATES (Moves in opposite direction for 3D depth)
      gsap.utils.toArray('.awwwards-counter-plate').forEach((plate) => {
        gsap.fromTo(
          plate,
          { y: 90 },
          {
            y: -90,
            ease: 'none',
            scrollTrigger: {
              trigger: plate.parentElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        )
      })

      // 5. Track Active Chapter based on scroll trigger
      CHAPTERS.forEach((ch) => {
        ScrollTrigger.create({
          trigger: `#${ch.id}`,
          start: 'top 40%',
          end: 'bottom 40%',
          onEnter: () => setActiveChapter(ch.id),
          onEnterBack: () => setActiveChapter(ch.id),
        })
      })
    }, containerRef)

    return () => {
      clearTimeout(refreshTimer)
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

      {/* 2. HERO: FULLSCREEN MONUMENTAL PARALLAX OPENING */}
      <section className="awwwards-hero-container relative h-screen w-full overflow-hidden flex flex-col justify-between pt-28 pb-12 px-5 sm:px-10 lg:px-16 select-none bg-slate-950">
        {/* Deep Fixed-Layer Parallax Background Photo */}
        <div className="absolute inset-0 w-full h-[130%] -top-[15%] pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=2400&q=85"
            alt="Stayza Sanctuary perched on the Sindh Coastline"
            className="awwwards-hero-img w-full h-full object-cover filter brightness-[0.75] contrast-[1.05] will-change-transform"
          />
          {/* Subtle Film Grain Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/60" />
        </div>

        {/* Hero Top Eyebrow */}
        <div className="relative z-10 max-w-7xl w-full mx-auto flex items-center justify-between text-xs font-mono uppercase tracking-[0.3em] text-[#FFF0CA]">
          <div className="flex items-center gap-2 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>THE SANCTUARY ESTATE &bull; SINDH COAST</span>
          </div>
          <span className="hidden sm:inline-block text-white/70 font-normal">
            24° 51' 14" N &bull; 67° 00' 42" E
          </span>
        </div>

        {/* Hero Center Monumental Typography (Glides up and fades on scroll) */}
        <div className="awwwards-hero-text relative z-10 max-w-5xl w-full mx-auto my-auto text-center space-y-6 will-change-transform">
          <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.45em] text-emerald-300 font-semibold block">
            AN ARCHITECTURAL MONOGRAPH &bull; 42 OCEANFRONT ACRES
          </span>
          <h1 className="font-serif-grand text-4xl sm:text-7xl lg:text-8xl font-light text-[#FAF8F5] tracking-tight leading-[1.03]">
            An Untouched Coastline Between Bedrock and Sky.
          </h1>
          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light font-sans">
            Sculpted into the sandstone cliffs above the Arabian Sea. Seven cantilevered suites, geothermal mineral hot springs, and farm-to-table coastal cuisine.
          </p>
          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => scrollToChapter('land')}
              className="px-6 py-3 bg-[#FAF8F5] hover:bg-white text-slate-950 font-mono text-xs font-bold uppercase tracking-widest rounded-[2px] transition-all cursor-pointer shadow-lg active:scale-95"
            >
              Explore The Estate &darr;
            </button>
          </div>
        </div>

        {/* Hero Bottom Telemetry Strip */}
        <div className="relative z-10 max-w-7xl w-full mx-auto flex items-center justify-between text-[11px] font-mono text-white/60 border-t border-white/15 pt-4">
          <span>7 PRIVATE KEYS</span>
          <span className="animate-bounce text-white">SCROLL TO DISCOVER &darr;</span>
          <span>1,200M SECLUDED BEACH</span>
        </div>
      </section>

      {/* 3. STICKY HAIRLINE CHAPTER NAVIGATION BAR */}
      <nav
        aria-label="Estate Chapters"
        className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 lg:px-14 py-3 shadow-xs"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 overflow-x-auto no-scrollbar text-xs font-mono uppercase tracking-wider">
          <div className="flex items-center gap-6 sm:gap-8 min-w-max">
            <span className="text-[10px] text-slate-400 tracking-widest hidden md:inline-block">CHAPTERS:</span>
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
            to="/suites"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0E1201] text-[#FFF0CA] text-[11px] font-bold rounded-[2px] hover:bg-slate-900 transition-colors shrink-0"
          >
            <span>View 7 Suites</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </nav>

      {/* 4. CHAPTER 01: THE LAND (PINNED SPLIT-SCREEN PARALLAX) */}
      <section id="land" className="relative py-16 sm:py-28 px-4 sm:px-8 lg:px-14 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT: Pinned Sticky Column (Locks in place while user scrolls through photos) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-8">
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-900 font-bold block">
                CHAPTER 01 &bull; GEOGRAPHY
              </span>
              <h2 className="font-serif-grand text-3xl sm:text-5xl text-slate-900 font-light leading-[1.08]">
                Forty-Two Acres of Undisturbed Shoreline.
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Situated along an untouched coastal bluff seventy-five minutes from the city, the estate encompasses dramatic sandstone cliffs, indigenous scrub, and a kilometer of secluded beach. Here, desert bedrock meets the Indian Ocean with zero light pollution and total silence.
            </p>

            {/* Architectural Data Ribbon */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 font-mono text-xs">
              <div className="p-3 bg-white border border-slate-200/80 rounded-[2px]">
                <span className="text-[10px] text-slate-400 block uppercase">Elevation</span>
                <strong className="text-slate-900 text-sm">38m Sea Bluff</strong>
              </div>
              <div className="p-3 bg-white border border-slate-200/80 rounded-[2px]">
                <span className="text-[10px] text-slate-400 block uppercase">Shoreline</span>
                <strong className="text-slate-900 text-sm">1.2 km Private</strong>
              </div>
              <div className="p-3 bg-white border border-slate-200/80 rounded-[2px]">
                <span className="text-[10px] text-slate-400 block uppercase">Sun Exposure</span>
                <strong className="text-slate-900 text-sm">Due West Sunset</strong>
              </div>
              <div className="p-3 bg-white border border-slate-200/80 rounded-[2px]">
                <span className="text-[10px] text-slate-400 block uppercase">Density</span>
                <strong className="text-slate-900 text-sm">7 Suites Only</strong>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-1">
                COORDINATES:
              </span>
              <span className="font-mono text-xs text-slate-700">
                24° 51' 14.2" N &bull; 67° 00' 42.8" E &bull; SINDH PROVINCE
              </span>
            </div>
          </div>

          {/* RIGHT: High-Velocity Gliding Photo Column */}
          <div className="lg:col-span-7 space-y-16">
            {/* Parallax Photo 1: Sandstone Coastline */}
            <div className="awwwards-parallax-window relative h-[60vh] sm:h-[80vh] rounded-[2px] overflow-hidden bg-slate-950 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85"
                alt="Secluded sandstone coast and turquoise Arabian Sea"
                className="absolute inset-0 w-full h-[140%] object-cover will-change-transform"
              />
              <div className="awwwards-counter-plate absolute bottom-8 right-8 p-5 bg-[#FAF8F5]/95 backdrop-blur-md border border-slate-300 text-xs font-mono rounded-[2px] max-w-xs shadow-2xl hidden sm:block will-change-transform">
                <span className="text-[10px] text-emerald-900 font-bold block uppercase tracking-wider mb-1">
                  FIG. 01 &bull; THE TIDAL REEF
                </span>
                <p className="text-slate-600 font-sans text-xs leading-relaxed">
                  Natural limestone tide pools form at low tide directly below the residential cliff ridge.
                </p>
              </div>
            </div>

            {/* Parallax Photo 2: Cantilevered Residence Terrace */}
            <div className="awwwards-parallax-window relative h-[50vh] sm:h-[70vh] rounded-[2px] overflow-hidden bg-slate-950 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=85"
                alt="Cantilevered suite balcony suspended over the ocean"
                className="absolute inset-0 w-full h-[140%] object-cover will-change-transform"
              />
              <div className="awwwards-counter-plate absolute top-8 left-8 p-5 bg-[#FAF8F5]/95 backdrop-blur-md border border-slate-300 text-xs font-mono rounded-[2px] max-w-xs shadow-2xl hidden sm:block will-change-transform">
                <span className="text-[10px] text-emerald-900 font-bold block uppercase tracking-wider mb-1">
                  FIG. 02 &bull; CLIFFSIDE TERRACES
                </span>
                <p className="text-slate-600 font-sans text-xs leading-relaxed">
                  Low-slung architecture built directly into the bedrock with zero vertical towers.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. KINETIC SCROLL-DRIVEN HORIZONTAL TYPOGRAPHY RIBBON #1 */}
      <section className="kinetic-ribbon-1 py-10 sm:py-16 bg-[#0E1201] text-[#FAF8F5] overflow-hidden border-y border-slate-800 select-none">
        <div className="kinetic-ribbon-text-1 flex items-center whitespace-nowrap text-3xl sm:text-6xl font-serif-grand font-light tracking-[0.2em] text-[#FFF0CA] will-change-transform">
          <span>&bull; SINDH COASTLINE &bull; 42 PRIVATE ACRES &bull; MONOLITHIC TRAVERTINE &bull; 100% OCEANFRONT &bull; NATURAL GEOTHERMAL SPRINGS &bull; SECLUDED BEACH</span>
          <span className="ml-8">&bull; SINDH COASTLINE &bull; 42 PRIVATE ACRES &bull; MONOLITHIC TRAVERTINE &bull; 100% OCEANFRONT &bull; NATURAL GEOTHERMAL SPRINGS &bull; SECLUDED BEACH</span>
        </div>
      </section>

      {/* 6. CHAPTER 02: ARCHITECTURE & RAW MATERIALS */}
      <section id="architecture" className="relative py-16 sm:py-28 px-4 sm:px-8 lg:px-14 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="max-w-3xl space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-900 font-bold block">
              CHAPTER 02 &bull; THE ARCHITECTURE
            </span>
            <h2 className="font-serif-grand text-3xl sm:text-5xl text-slate-900 font-light leading-tight">
              Hand-Chiseled Travertine &amp; Volcanic Basalt.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Every wall is formed from 120mm slabs of regional Sindh limestone. Deep cantilevered roof overhangs cut solar heat gain by 65%, while open slatted teak screens channel continuous sea breezes throughout the living spaces.
            </p>
          </div>

          {/* Full-Bleed Parallax Architecture Window */}
          <div className="awwwards-parallax-window relative h-[55vh] sm:h-[75vh] rounded-[2px] overflow-hidden bg-slate-950 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2200&q=85"
              alt="Hand-chiseled travertine walls and architectural terraces"
              className="absolute inset-0 w-full h-[140%] object-cover will-change-transform"
            />
            <div className="awwwards-counter-plate absolute bottom-8 left-8 p-6 bg-[#FAF8F5]/95 backdrop-blur-md border border-slate-300 rounded-[2px] max-w-sm shadow-2xl hidden sm:block will-change-transform">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-900 font-bold block mb-1">
                FIG. 03 &bull; PASSIVE THERMAL MASS
              </span>
              <h4 className="font-serif-grand text-xl text-slate-900 font-light mb-2">
                120mm Travertine Slabs
              </h4>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                Dense natural limestone absorbs desert sunlight by day and gently radiates natural warmth after twilight.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CHAPTER 03: THE HARVEST TABLE (PINNED SPLIT-SCREEN DINING) */}
      <section id="culinary" className="relative py-16 sm:py-28 px-4 sm:px-8 lg:px-14 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* RIGHT: Pinned Sticky Dining Monograph */}
          <div className="lg:col-span-5 lg:order-2 lg:sticky lg:top-28 space-y-8">
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-900 font-bold block">
                CHAPTER 03 &bull; THE HARVEST TABLE
              </span>
              <h2 className="font-serif-grand text-3xl sm:text-5xl text-slate-900 font-light leading-[1.08]">
                Farm-to-Table Coastal Cuisine &amp; Open Fire.
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              At <strong>The Harvest Pavilion</strong>, food is simple, seasonal, and hyper-local. Every dawn, local fishermen land red snapper and gulf prawns directly on our beach. Our kitchen pairs the catch with organic heirloom vegetables harvested daily from the estate garden.
            </p>

            <div className="p-5 bg-white border border-slate-200/90 rounded-[2px] space-y-3 font-mono text-xs">
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
                <strong>By Request (Live Deck Grill)</strong>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-[2px] text-xs text-emerald-950 font-mono">
              <strong>Signature Catch:</strong> Whole salt-crusted red snapper grilled over charred tamarind wood with cold-pressed citrus oil.
            </div>
          </div>

          {/* LEFT: Scrolling High-Impact Culinary Photos */}
          <div className="lg:col-span-7 lg:order-1 space-y-16">
            {/* Dining Photo 1: Oceanfront Table */}
            <div className="awwwards-parallax-window relative h-[60vh] sm:h-[80vh] rounded-[2px] overflow-hidden bg-slate-950 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=85"
                alt="Open-air oceanfront dining table at dusk"
                className="absolute inset-0 w-full h-[140%] object-cover will-change-transform filter brightness-[0.85]"
              />
              <div className="awwwards-counter-plate absolute bottom-8 left-8 p-5 bg-[#FAF8F5]/95 backdrop-blur-md border border-slate-300 text-xs font-mono rounded-[2px] max-w-xs shadow-2xl hidden sm:block will-change-transform">
                <span className="text-[10px] text-emerald-900 font-bold block uppercase tracking-wider mb-1">
                  FIG. 04 &bull; THE PAVILION DECK
                </span>
                <p className="text-slate-600 font-sans text-xs leading-relaxed">
                  Open-air candlelight dining above the breaking surf.
                </p>
              </div>
            </div>

            {/* Dining Photo 2: Fresh Morning Harvest */}
            <div className="awwwards-parallax-window relative h-[50vh] sm:h-[70vh] rounded-[2px] overflow-hidden bg-slate-950 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=85"
                alt="Fresh organic estate vegetables and fresh herbs"
                className="absolute inset-0 w-full h-[140%] object-cover will-change-transform"
              />
              <div className="awwwards-counter-plate absolute top-8 right-8 p-5 bg-[#FAF8F5]/95 backdrop-blur-md border border-slate-300 text-xs font-mono rounded-[2px] max-w-xs shadow-2xl hidden sm:block will-change-transform">
                <span className="text-[10px] text-emerald-900 font-bold block uppercase tracking-wider mb-1">
                  FIG. 05 &bull; ORGANIC HARVEST
                </span>
                <p className="text-slate-600 font-sans text-xs leading-relaxed">
                  Heirloom produce picked daily from our coastal garden beds.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 8. KINETIC SCROLL-DRIVEN HORIZONTAL TYPOGRAPHY RIBBON #2 */}
      <section className="kinetic-ribbon-2 py-10 sm:py-16 bg-[#0E1201] text-[#FAF8F5] overflow-hidden border-y border-slate-800 select-none">
        <div className="kinetic-ribbon-text-2 flex items-center whitespace-nowrap text-3xl sm:text-6xl font-serif-grand font-light tracking-[0.2em] text-[#FFF0CA] will-change-transform -translate-x-1/3">
          <span>&bull; GEOTHERMAL SALINE POOLS &bull; 38°C THERMAL BATHS &bull; PANORAMIC CEDAR SAUNAS &bull; UNDERGROUND VALET PORTAL &bull; PRIVATE SUITE CHECK-IN</span>
          <span className="ml-8">&bull; GEOTHERMAL SALINE POOLS &bull; 38°C THERMAL BATHS &bull; PANORAMIC CEDAR SAUNAS &bull; UNDERGROUND VALET PORTAL &bull; PRIVATE SUITE CHECK-IN</span>
        </div>
      </section>

      {/* 9. CHAPTER 04: WELLNESS & THERMAL SPRINGS */}
      <section id="wellness" className="relative py-16 sm:py-28 px-4 sm:px-8 lg:px-14 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="max-w-3xl space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-900 font-bold block">
              CHAPTER 04 &bull; RESTORATIVE WATERS
            </span>
            <h2 className="font-serif-grand text-3xl sm:text-5xl text-slate-900 font-light leading-tight">
              38°C Mineral Springs &amp; Sea Salt Cedar Baths.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Sourced from geothermal coastal aquifers, our thermal stone baths are naturally rich in sulfur, magnesium, and marine trace elements. Steam gently rises into the crisp sea air as the waves break beneath your terrace.
            </p>
          </div>

          {/* Full-Bleed Parallax Thermal Pool Window */}
          <div className="awwwards-parallax-window relative h-[60vh] sm:h-[80vh] rounded-[2px] overflow-hidden bg-slate-950 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=2200&q=85"
              alt="Outdoor thermal hot spring pool overlooking the ocean surf"
              className="absolute inset-0 w-full h-[140%] object-cover will-change-transform"
            />
            <div className="awwwards-counter-plate absolute top-8 right-8 p-6 bg-[#FAF8F5]/95 backdrop-blur-md border border-slate-300 rounded-[2px] max-w-sm shadow-2xl hidden sm:block will-change-transform">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-900 font-bold block mb-1">
                FIG. 06 &bull; THERMAL BATHS
              </span>
              <h4 className="font-serif-grand text-xl text-slate-900 font-light mb-2">
                Naturally Heated Saline Aquifer
              </h4>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                Carved into bedrock terraces perched above the surf.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. CHAPTER 05: UNDERGROUND VALET ARRIVAL SANCTUARY */}
      <section id="arrival" className="relative py-16 sm:py-28 px-4 sm:px-8 lg:px-14 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-900 font-bold block">
              CHAPTER 05 &bull; THE ARRIVAL
            </span>
            <h2 className="font-serif-grand text-3xl sm:text-5xl text-slate-900 font-light leading-tight">
              Subterranean Valet &amp; Zero Hotel Lobbies.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              True luxury is the complete absence of noise, queues, and crowded lobbies. Upon arriving at the estate gates, vehicles descend smoothly into a quiet underground travertine portal. A private elevator ascends directly into your suite, where in-residence check-in takes place in absolute peace.
            </p>
            <div className="space-y-3 pt-2 text-xs font-mono">
              <div className="p-3 bg-white border border-slate-200 rounded-[2px] flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-700" />
                <span>Chauffeur Transfers from Karachi (75 Minutes)</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-[2px] flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-700" />
                <span>Private Helipad: 24° 51' 14" N &bull; 67° 00' 42" E</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-[2px] flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-700" />
                <span>Underground Valet &bull; 100% In-Suite Check-In</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="awwwards-parallax-window relative h-80 sm:h-[500px] rounded-[2px] overflow-hidden bg-slate-950 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85"
                alt="Underground valet portal and private residence entrance"
                className="absolute inset-0 w-full h-[140%] object-cover will-change-transform"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 11. CLOSING MONOGRAPH & RESERVATION DECK */}
      <section className="py-24 sm:py-36 px-4 sm:px-8 lg:px-14 bg-[#0E1201] text-[#FAF8F5] text-center relative overflow-hidden select-none">
        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          <span className="text-[10px] font-mono uppercase tracking-[0.35em] text-[#FFF0CA] font-bold block">
            STAYZA RESIDENCES &bull; 7 PRIVATE SUITES
          </span>
          <h2 className="font-serif-grand text-3xl sm:text-6xl font-light tracking-tight text-white leading-tight">
            Begin Your Journey to the Sindh Coast.
          </h2>
          <p className="text-xs sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed font-normal">
            Experience the quiet luxury of our cliffside residences, geothermal mineral springs, and farm-to-table coastal cuisine. Secure your suite with a 30% advance deposit.
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

      {/* 12. Architectural Footer */}
      <Footer />
    </div>
  )
}
