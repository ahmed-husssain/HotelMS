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
  { id: 'grounds', num: '05', title: 'The Coastline' },
  { id: 'arrival', num: '06', title: 'Arrival Sanctuary' },
]

/**
 * EstatePage — The Estate & Sanctuary (Awwwards Parallax Edition)
 * 
 * Implements premier luxury resort web design (Aman / Habitas / Belmond caliber):
 * - Authentic, grounded architectural photography (real physical geology & materials)
 * - Dual-speed parallax "window" frames with GSAP ScrollTrigger & Lenis 120 FPS
 * - Asymmetrical counter-scrolling editorial plates (FIG. 01, FIG. 02)
 * - Sticky hairline chapter index with active scroll tracking
 * - 100% mobile-compliant (touch target >= 44px, zero horizontal overflow)
 */
export default function EstatePage() {
  useSmoothScroll()
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const [activeChapter, setActiveChapter] = useState('land')

  // Initialize GSAP Parallax & Chapter Tracking
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const isTouch = window.matchMedia('(pointer: coarse), (hover: none)').matches
    const parallaxDistance = isTouch ? 6 : 14

    const ctx = gsap.context(() => {
      // 1. Hero Zoom & Slow Parallax Drop
      gsap.fromTo(
        '.hero-parallax-img',
        { yPercent: -6, scale: 1.08 },
        {
          yPercent: 12,
          scale: 1.0,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero-parallax-container',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        }
      )

      // 2. Dual-Speed Parallax Images (Looking through architectural windows)
      gsap.utils.toArray('.awwwards-parallax-img').forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -parallaxDistance, scale: 1.08 },
          {
            yPercent: parallaxDistance,
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

      // 3. Counter-scrolling Floating Editorial Plates (Moves faster in opposite direction)
      gsap.utils.toArray('.counter-scroll-plate').forEach((plate) => {
        gsap.fromTo(
          plate,
          { yPercent: 18 },
          {
            yPercent: -18,
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

      // 4. Track Active Chapter on Scroll
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

    return () => ctx.revert()
  }, [])

  // Smooth jump to chapter
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
      {/* 1. Primary Fixed Header Navigation */}
      <Navbar onOpenDrawer={() => navigate('/reserve')} />

      {/* 2. Hero Section: The Monumental Fullscreen Opening */}
      <section className="hero-parallax-container relative min-h-[92vh] sm:min-h-screen flex flex-col justify-between pt-28 sm:pt-36 pb-8 px-4 sm:px-8 lg:px-14 border-b border-slate-200/80 overflow-hidden">
        {/* Top Monograph Eyebrow */}
        <div className="max-w-7xl w-full mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono uppercase tracking-[0.28em] text-slate-600 z-10 shrink-0">
          <div className="flex items-center gap-2 text-emerald-950 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
            <span>THE SANCTUARY ESTATE &bull; SINDH COAST</span>
          </div>
          <span className="text-slate-400 font-normal tracking-widest text-[11px]">
            24° 51' 14" N &bull; 67° 00' 42" E
          </span>
        </div>

        {/* Center Editorial Title */}
        <div className="max-w-5xl w-full mx-auto my-auto py-10 sm:py-16 space-y-6 z-10">
          <span className="font-mono text-[10px] sm:text-xs text-emerald-900 uppercase tracking-[0.35em] font-semibold block">
            AN ARCHITECTURAL MONOGRAPH &bull; 42 ACRES
          </span>
          <h1 className="font-serif-grand text-4xl sm:text-7xl lg:text-8xl font-light text-slate-900 tracking-tight leading-[1.02]">
            An Untouched Coastline Between Bedrock and Sky.
          </h1>
          <p className="text-sm sm:text-lg text-slate-600 max-w-2xl leading-relaxed font-normal">
            Sculpted directly into the coastal sandstone cliffs of the Arabian Sea. Seven private cliffside residences, geothermal mineral springs, organic farm-to-table dining, and a kilometer of secluded tidal sand.
          </p>
        </div>

        {/* Full-Bleed Parallax Cinematic Window */}
        <div className="max-w-7xl w-full mx-auto relative h-[45vh] sm:h-[60vh] rounded-[2px] overflow-hidden shadow-2xl bg-slate-950 shrink-0">
          <img
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=2200&q=85"
            alt="The cliffside estate and Arabian Sea horizon at Stayza"
            className="hero-parallax-img absolute inset-0 w-full h-[120%] object-cover filter brightness-[0.9] will-change-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-6 sm:p-10 pointer-events-none">
            <div className="text-white space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-emerald-300 font-bold block">
                PLATE I &bull; ELEVATION 38 METERS
              </span>
              <p className="font-serif-grand text-xl sm:text-2xl font-light text-white">
                The cliffside pavilion suspended above the morning tide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Sticky Hairline Chapter Navigation Bar */}
      <nav
        aria-label="Estate Chapters"
        className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 lg:px-14 py-3 overflow-x-auto no-scrollbar"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 min-w-max text-xs font-mono uppercase tracking-wider">
          <div className="flex items-center gap-6 sm:gap-8">
            <span className="text-[10px] text-slate-400 tracking-widest hidden lg:inline-block">CHAPTERS:</span>
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
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0E1201] text-[#FFF0CA] text-[11px] font-bold rounded-[2px] hover:bg-slate-900 transition-colors shrink-0"
          >
            <span>View 7 Suites</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </nav>

      {/* 4. CHAPTER 01: THE LAND & NATURAL GEOGRAPHY */}
      <section id="land" className="py-20 sm:py-32 px-4 sm:px-8 lg:px-14 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Chapter Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-baseline">
            <div className="lg:col-span-4 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-emerald-900 font-bold block">
                CHAPTER 01 &bull; GEOGRAPHY
              </span>
              <h2 className="font-serif-grand text-3xl sm:text-5xl text-slate-900 font-light leading-tight">
                Forty-Two Acres of Undisturbed Shoreline.
              </h2>
            </div>
            <div className="lg:col-span-8 lg:pl-12 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              <p>
                Situated along a remote coastal stretch seventy-five minutes from the city, the estate encompasses high sandstone bluffs, coastal scrub, and a kilometer of secluded beach. Here, the desert meets the Indian Ocean with zero light pollution, zero commercial neighbors, and undisturbed privacy.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 border-t border-slate-200 text-slate-900 font-mono text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Terrain</span>
                  <strong>Sandstone Bluff</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Coastline</span>
                  <strong>1,200m Private</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Orientation</span>
                  <strong>Due West (Sunset)</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Climate</span>
                  <strong>Temperate Coastal</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Asymmetrical Dual-Parallax Spread */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Tall Parallax Window */}
            <div className="lg:col-span-7 relative h-[55vh] sm:h-[75vh] rounded-[2px] overflow-hidden bg-slate-950 shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85"
                alt="Secluded beach and untouched sandstone cliffs on the Sindh Coast"
                className="awwwards-parallax-img absolute inset-0 w-full h-[125%] object-cover will-change-transform"
              />
              <div className="counter-scroll-plate absolute bottom-6 right-6 p-4 bg-[#FAF8F5]/95 backdrop-blur-md border border-slate-300 text-xs font-mono rounded-[2px] max-w-xs shadow-xl hidden sm:block will-change-transform">
                <span className="text-[10px] text-emerald-900 font-bold block uppercase tracking-wider">
                  FIG. 01 &bull; TIDAL REEF
                </span>
                <span className="text-slate-600 mt-1 block">
                  Natural limestone tide pools form at low tide directly below the residential ridge.
                </span>
              </div>
            </div>

            {/* Right Offset Architectural Inset */}
            <div className="lg:col-span-5 space-y-8 lg:pl-6">
              <div className="relative h-64 sm:h-80 rounded-[2px] overflow-hidden bg-slate-900 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=85"
                  alt="Low-slung cantilevered villa overlooking the ocean"
                  className="awwwards-parallax-img absolute inset-0 w-full h-[125%] object-cover will-change-transform"
                />
              </div>
              <div className="space-y-3">
                <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest block font-bold">
                  PASSIVE MICROCLIMATE
                </span>
                <h3 className="font-serif-grand text-2xl text-slate-900 font-light">
                  Sea Breeze Thermal Cooling
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  The architecture harnesses natural afternoon sea thermal winds that rise up the cliff faces, directing constant ocean breezes through slatted timber pergolas and shaded basalt stone courtyards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CHAPTER 02: ARCHITECTURE & RAW MATERIALS */}
      <section id="architecture" className="py-20 sm:py-32 px-4 sm:px-8 lg:px-14 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="max-w-3xl space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-emerald-900 font-bold block">
              CHAPTER 02 &bull; THE CRAFT
            </span>
            <h2 className="font-serif-grand text-3xl sm:text-5xl text-slate-900 font-light leading-tight">
              Raw Limestone, Teak Timber &amp; Basalt Stone.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We chose not to build standard concrete towers. Instead, every structure was hand-chiseled from regional Sindh travertine stone that absorbs the desert heat by day and gently radiates warmth after twilight.
            </p>
          </div>

          {/* Split Velocity Parallax Photography Pair */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Vertical Architectural Detail */}
            <div className="lg:col-span-5 relative h-[60vh] sm:h-[80vh] rounded-[2px] overflow-hidden bg-slate-900 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85"
                alt="Hand-chiseled travertine limestone walls and teak slatted screens"
                className="awwwards-parallax-img absolute inset-0 w-full h-[125%] object-cover will-change-transform"
              />
              <div className="absolute top-6 left-6 p-3 bg-slate-950/85 backdrop-blur-md text-white text-[10px] font-mono uppercase tracking-widest rounded-[2px]">
                TRAVERTINE &bull; 120MM SLABS
              </div>
            </div>

            {/* Right Architectural Monograph Details */}
            <div className="lg:col-span-7 space-y-8 lg:pl-8">
              <div className="relative h-72 sm:h-96 rounded-[2px] overflow-hidden bg-slate-900 shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=85"
                  alt="Minimalist cantilevered pavilion overlooking the water"
                  className="awwwards-parallax-img absolute inset-0 w-full h-[125%] object-cover will-change-transform"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 text-xs font-mono text-slate-700">
                <div className="p-5 bg-[#FAF8F5] border border-slate-200/90 rounded-[2px] space-y-2">
                  <strong className="text-slate-900 block uppercase font-bold text-[11px]">
                    Cantilevered Roof Pylons
                  </strong>
                  <p className="text-slate-600 font-sans text-xs leading-relaxed">
                    Overhanging eaves extend four meters out, casting continuous natural shade over private plunge decks.
                  </p>
                </div>
                <div className="p-5 bg-[#FAF8F5] border border-slate-200/90 rounded-[2px] space-y-2">
                  <strong className="text-slate-900 block uppercase font-bold text-[11px]">
                    Black Basalt Water Pools
                  </strong>
                  <p className="text-slate-600 font-sans text-xs leading-relaxed">
                    Dark volcanic stone naturally retains sun warmth, keeping plunge pools comfortable well into the cool evening.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CHAPTER 03: THE CULINARY HARVEST TABLE (DINING) */}
      <section id="culinary" className="py-20 sm:py-32 px-4 sm:px-8 lg:px-14 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Chapter Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-baseline">
            <div className="lg:col-span-5 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-emerald-900 font-bold block">
                CHAPTER 03 &bull; THE HARVEST TABLE
              </span>
              <h2 className="font-serif-grand text-3xl sm:text-5xl text-slate-900 font-light leading-tight">
                Farm-to-Table Coastal Dining &amp; Open Fire.
              </h2>
            </div>
            <div className="lg:col-span-7 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              <p>
                At <strong>The Harvest Pavilion</strong>, cuisine is rooted in simplicity and coastal abundance. Every morning at dawn, local artisanal fishermen land wild red snapper, gulf prawns, and sea bass directly on our beach. Our culinary team pairs the morning catch with heirloom vegetables harvested daily from the estate organic garden.
              </p>
              <div className="flex items-center gap-6 pt-2 font-mono text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Breakfast</span>
                  <strong>07:00 &ndash; 11:00</strong>
                </div>
                <div className="border-l border-slate-200 pl-6">
                  <span className="text-slate-400 block text-[10px] uppercase">All-Day Dining</span>
                  <strong>12:00 &ndash; 22:30</strong>
                </div>
                <div className="border-l border-slate-200 pl-6">
                  <span className="text-slate-400 block text-[10px] uppercase">Service</span>
                  <strong>Pavilion &bull; In-Suite</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Full-Width Parallax Dining Spread */}
          <div className="relative h-[50vh] sm:h-[65vh] rounded-[2px] overflow-hidden bg-slate-950 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=85"
              alt="Open-air seaside dining at The Harvest Pavilion at dusk"
              className="awwwards-parallax-img absolute inset-0 w-full h-[125%] object-cover filter brightness-[0.85] will-change-transform"
            />
            {/* Floating Counter-Scroll Menu Plate */}
            <div className="counter-scroll-plate absolute top-8 left-8 sm:top-12 sm:left-12 p-6 bg-[#FAF8F5]/95 backdrop-blur-md border border-slate-300 rounded-[2px] max-w-sm shadow-2xl hidden sm:block will-change-transform">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-900 font-bold block mb-1">
                FIG. 02 &bull; THE HARVEST MENU
              </span>
              <h4 className="font-serif-grand text-xl text-slate-900 font-light mb-2">
                Charcoal-Grilled Red Snapper
              </h4>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                Salt-crusted, served over heirloom tomatoes, hand-picked coastal herbs, and cold-pressed citrus vinaigrette.
              </p>
            </div>
          </div>

          {/* Asymmetrical Culinary Photography Pair */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            <div className="space-y-3">
              <div className="h-60 rounded-[2px] overflow-hidden bg-slate-900 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=85"
                  alt="Fresh organic estate produce and morning harvest"
                  className="w-full h-full object-cover"
                />
              </div>
              <strong className="text-xs font-mono uppercase text-slate-900 block">Estate Organic Garden</strong>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                Herbs, heirloom produce, and wild greens cultivated on the sunlit plateau above the villas.
              </p>
            </div>

            <div className="space-y-3">
              <div className="h-60 rounded-[2px] overflow-hidden bg-slate-900 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=85"
                  alt="Candlelit private chef dinner on ocean terrace"
                  className="w-full h-full object-cover"
                />
              </div>
              <strong className="text-xs font-mono uppercase text-slate-900 block">In-Suite Private Dining</strong>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                Multi-course tasting menus prepared live by private chefs on your residence terrace.
              </p>
            </div>

            <div className="space-y-3 sm:col-span-2 lg:col-span-1">
              <div className="h-60 rounded-[2px] overflow-hidden bg-slate-900 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=85"
                  alt="Artisanal cardamom chai and cellar selections at sunset"
                  className="w-full h-full object-cover"
                />
              </div>
              <strong className="text-xs font-mono uppercase text-slate-900 block">The Lookout Lounge</strong>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                Slow-brewed cardamom chai and curated cellar selections on cantilevered daybeds at dusk.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CHAPTER 04: WELLNESS & THERMAL SPRINGS */}
      <section id="wellness" className="py-20 sm:py-32 px-4 sm:px-8 lg:px-14 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Vertical Parallax Detail */}
            <div className="lg:col-span-5 relative h-[55vh] sm:h-[75vh] rounded-[2px] overflow-hidden bg-slate-950 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=85"
                alt="Outdoor thermal hot spring pool overlooking the ocean surf"
                className="awwwards-parallax-img absolute inset-0 w-full h-[125%] object-cover will-change-transform"
              />
              <div className="counter-scroll-plate absolute top-6 right-6 p-4 bg-[#FAF8F5]/95 backdrop-blur-md border border-slate-300 text-xs font-mono rounded-[2px] max-w-xs shadow-xl hidden sm:block will-change-transform">
                <span className="text-[10px] text-emerald-900 font-bold block uppercase tracking-wider">
                  FIG. 03 &bull; THERMAL BATHS
                </span>
                <span className="text-slate-600 mt-1 block">
                  Natural saline mineral waters maintained at 38°C perched above the tide.
                </span>
              </div>
            </div>

            {/* Right Editorial Story */}
            <div className="lg:col-span-7 space-y-6 lg:pl-8">
              <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-emerald-900 font-bold block">
                CHAPTER 04 &bull; RESTORATIVE WATERS
              </span>
              <h2 className="font-serif-grand text-3xl sm:text-5xl text-slate-900 font-light leading-tight">
                Mineral Hot Springs &amp; Cedar Wood Baths.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Tapping deep coastal aquifers, our mineral baths provide geothermal therapeutic waters rich in sulfur, magnesium, and sea minerals. Positioned on open rock terraces facing the sea, steam rises into the cool evening air while the tide crashes beneath your feet.
              </p>

              <div className="space-y-4 pt-2">
                <div className="p-4 bg-[#FAF8F5] border border-slate-200 rounded-[2px] flex items-start gap-4">
                  <span className="font-mono text-xs text-emerald-900 font-bold mt-0.5">38°C</span>
                  <div>
                    <strong className="text-slate-900 block font-mono text-xs uppercase">Saline Mineral Hot Tubs</strong>
                    <span className="text-xs text-slate-600">Deep muscle relaxation overlooking the Arabian sea horizon.</span>
                  </div>
                </div>
                <div className="p-4 bg-[#FAF8F5] border border-slate-200 rounded-[2px] flex items-start gap-4">
                  <span className="font-mono text-xs text-emerald-900 font-bold mt-0.5">CEDAR</span>
                  <div>
                    <strong className="text-slate-900 block font-mono text-xs uppercase">Panoramic Dry Saunas</strong>
                    <span className="text-xs text-slate-600">Weathered timber rooms infused with wild coastal thyme.</span>
                  </div>
                </div>
                <div className="p-4 bg-[#FAF8F5] border border-slate-200 rounded-[2px] flex items-start gap-4">
                  <span className="font-mono text-xs text-emerald-900 font-bold mt-0.5">SALT</span>
                  <div>
                    <strong className="text-slate-900 block font-mono text-xs uppercase">Marine Exfoliation Rituals</strong>
                    <span className="text-xs text-slate-600">Natural sea minerals and cold plunge stone pools.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CHAPTER 05: SECLUDED COASTLINE & GROUNDS */}
      <section id="grounds" className="py-20 sm:py-32 px-4 sm:px-8 lg:px-14 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="max-w-3xl space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-emerald-900 font-bold block">
              CHAPTER 05 &bull; THE COASTLINE
            </span>
            <h2 className="font-serif-grand text-3xl sm:text-5xl text-slate-900 font-light leading-tight">
              One Kilometer of Private Sand &amp; Sea.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Unlike crowded public beaches, Stayza's coastline is completely enclosed by surrounding cliffs. Solitary teak daybeds and linen sun canopies offer quiet shelter along pristine sands.
            </p>
          </div>

          {/* Panoramic Coastline Parallax Window */}
          <div className="relative h-[50vh] sm:h-[65vh] rounded-[2px] overflow-hidden bg-slate-950 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2200&q=85"
              alt="Pristine coastal shoreline and private beach at Stayza"
              className="awwwards-parallax-img absolute inset-0 w-full h-[125%] object-cover will-change-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-6 sm:p-10 pointer-events-none">
              <div className="text-white space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-emerald-300 font-bold block">
                  PLATE IV &bull; SINDH TIDAL REACH
                </span>
                <p className="font-serif-grand text-xl sm:text-2xl font-light text-white">
                  Secluded beach access with private catamaran charters available daily.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CHAPTER 06: PRIVATE UNDERGROUND ARRIVAL SANCTUARY */}
      <section id="arrival" className="py-20 sm:py-32 px-4 sm:px-8 lg:px-14 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-emerald-900 font-bold block">
                CHAPTER 06 &bull; ARRIVAL SANCTUARY
              </span>
              <h2 className="font-serif-grand text-3xl sm:text-5xl text-slate-900 font-light leading-tight">
                Discreet Valet &amp; Zero Crowded Lobbies.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                True luxury is the absence of queues, lobbies, and noise. Upon arrival at the estate gates, vehicles descend smoothly into a quiet underground travertine portal. A private subterranean elevator brings you directly into your residence, where in-suite check-in takes place in complete peace.
              </p>
              <div className="space-y-3 pt-2 text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                  <span>Private Chauffeur Transfers from Karachi (75 Minutes)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                  <span>Helipad Coordinates: 24° 51' 14" N &bull; 67° 00' 42" E</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                  <span>Underground Valet &amp; 100% In-Suite Check-In</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative h-72 sm:h-96 rounded-[2px] overflow-hidden bg-slate-900 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=85"
                alt="Underground valet and private residence arrival portal"
                className="awwwards-parallax-img absolute inset-0 w-full h-[125%] object-cover will-change-transform"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 10. The Closing Monograph & Reservation Deck */}
      <section className="py-24 sm:py-32 px-4 sm:px-8 lg:px-14 bg-[#0E1201] text-[#FAF8F5] text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          <span className="text-[10px] font-mono uppercase tracking-[0.32em] text-[#FFF0CA] font-bold block">
            STAYZA RESIDENCES &bull; 7 PRIVATE KEYS
          </span>
          <h2 className="font-serif-grand text-3xl sm:text-6xl font-light tracking-tight text-white leading-tight">
            Begin Your Journey to the Sindh Coast.
          </h2>
          <p className="text-xs sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed font-normal">
            Experience the tranquility of our cliffside residences, mineral hot springs, and coastal dining. Secure your suite with a 30% advance deposit.
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

      {/* 11. Architectural Footer */}
      <Footer />
    </div>
  )
}
