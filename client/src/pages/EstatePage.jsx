import React, { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

gsap.registerPlugin(ScrollTrigger)

/**
 * CasaMomoArrow — Signature minimal SVG arrow from casamomo.at
 */
function CasaMomoArrow({ left = false, className = '' }) {
  return (
    <svg
      width="14"
      height="12"
      viewBox="0 0 14 12"
      fill="none"
      aria-hidden="true"
      className={`inline-block transition-transform duration-200 ${left ? 'rotate-180' : ''} ${className}`}
    >
      <path
        d="M14,6l-4.9,4.9-.7-.7,2.1-2.1c.6-.6.2-1.6-.7-1.6H0v-1h9.8c.8,0,1.3-1,.7-1.6l-2.1-2.1.7-.7,4.9,4.9Z"
        fill="currentColor"
      />
    </svg>
  )
}

/**
 * CasaMomoParallaxImage
 * 
 * Exact ParallaxImage architecture extracted from casamomo.at (ParallaxImage.CUHZn7sZ.mjs):
 * 1. Container has overflow: hidden and fixed bounds.
 * 2. Image inside is rendered at 130% height (top: -15%).
 * 3. GSAP ScrollTrigger drives translateY from -15% to +15% based on scroll progress [start end, end start].
 * 4. Optional scaleGrow expands the outer frame from 0.88 to 1.0 as you scroll toward it.
 */
function CasaMomoParallaxImage({
  src,
  alt,
  className = '',
  containerClassName = '',
  intensity = 15,
  scaleGrow = false,
}) {
  const containerRef = useRef(null)
  const imgRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const img = imgRef.current
    if (!container || !img) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // 1. Inset window camera drift: -15% to +15%
      gsap.fromTo(
        img,
        { yPercent: -intensity },
        {
          yPercent: intensity,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1, // Smooth catch-up interpolation
          },
        }
      )

      // 2. Casa Momo Scale-Grow (for featured landscape breaks)
      if (scaleGrow) {
        gsap.fromTo(
          container,
          { scale: 0.88, borderRadius: '16px' },
          {
            scale: 1.0,
            borderRadius: '0px',
            ease: 'none',
            scrollTrigger: {
              trigger: container,
              start: 'top 85%',
              end: 'top 20%',
              scrub: 1,
            },
          }
        )
      }
    }, containerRef)

    return () => ctx.revert()
  }, [intensity, scaleGrow])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden will-change-transform ${containerClassName}`}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`absolute left-0 right-0 w-full object-cover will-change-transform select-none ${className}`}
        style={{
          top: `-${intensity}%`,
          height: `${100 + 2 * intensity}%`,
        }}
      />
    </div>
  )
}

/**
 * CasaMomoWordReveal
 * 
 * Signature text animation from casamomo.at:
 * Words start dim (opacity: 0.18) and light up to 1.0 in reading sequence as you scroll down.
 */
function CasaMomoWordReveal({ text, className = '' }) {
  const containerRef = useRef(null)
  const words = text.split(' ')

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      const spans = container.querySelectorAll('.casa-word')
      gsap.fromTo(
        spans,
        { opacity: 0.18 },
        {
          opacity: 1,
          stagger: 0.08,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top 80%',
            end: 'bottom 45%',
            scrub: true,
          },
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <p ref={containerRef} className={className}>
      {words.map((word, i) => (
        <span key={i} className="casa-word inline-block mr-[0.25em] transition-opacity duration-150">
          {word}
        </span>
      ))}
    </p>
  )
}

/**
 * EstatePage — The Estate & Grounds
 * 
 * Authentic Casa Momo Parallax Architecture (casamomo.at):
 * 1. Hero with Expanding Photo Frame (scale 0.88 -> 1.0) & -15% -> +15% inner camera glide.
 * 2. Scrubbed Word-by-Word Text Illumination across editorial manifestos.
 * 3. Exact ParallaxImage internal vertical travel (130% height) across all suite & landscape cards.
 * 4. High-resolution ocean cliffside resort photography adhering to real-world physics.
 */
export default function EstatePage() {
  const navigate = useNavigate()
  const heroContainerRef = useRef(null)
  const heroFrameRef = useRef(null)
  const heroImgRef = useRef(null)

  // Real, authentic resort photography
  const HERO_IMG = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2400&q=85'
  const BEACH_IMG = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85'
  const DINING_IMG = '/images/estate/coastal-dining.jpg'
  const SPA_IMG = '/images/estate/wellness-spa.jpg'
  const VALET_IMG = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85'

  // Hero Expanding Photo Animation (Exact Casa Momo "Video/Image Grow" effect)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 200)

    const ctx = gsap.context(() => {
      // Outer frame expands from contained 88% width to full width
      if (heroFrameRef.current) {
        gsap.fromTo(
          heroFrameRef.current,
          { scale: 0.90, borderRadius: '16px' },
          {
            scale: 1.0,
            borderRadius: '0px',
            ease: 'none',
            scrollTrigger: {
              trigger: heroContainerRef.current,
              start: 'top top',
              end: 'bottom 60%',
              scrub: 1,
            },
          }
        )
      }

      // Inner image glides from -15% to +15%
      if (heroImgRef.current) {
        gsap.fromTo(
          heroImgRef.current,
          { yPercent: -15 },
          {
            yPercent: 15,
            ease: 'none',
            scrollTrigger: {
              trigger: heroContainerRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 1,
            },
          }
        )
      }
    }, heroContainerRef)

    return () => {
      clearTimeout(timer)
      ctx.revert()
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 selection:bg-emerald-100 selection:text-emerald-950 font-sans-clean overflow-x-clip">
      {/* 1. Header Navigation */}
      <Navbar onOpenDrawer={() => navigate('/reserve')} />

      {/* ========================================================= */}
      {/* HERO SECTION: CASA MOMO EXPANDING ARCHITECTURAL FRAME     */}
      {/* ========================================================= */}
      <section
        ref={heroContainerRef}
        className="relative pt-32 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-8 lg:px-14 flex flex-col items-center justify-between min-h-[92vh] overflow-hidden"
      >
        {/* Grand Editorial Headline */}
        <div className="max-w-5xl mx-auto text-center space-y-4 my-auto py-6">
          <h1 className="font-serif-grand text-4xl sm:text-7xl lg:text-8xl font-light text-slate-900 tracking-tight leading-[1.02]">
            An Oceanfront Sanctuary Built into the Coast.
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-normal leading-relaxed">
            Secluded cliffside residences, farm-to-table coastal dining, and natural geothermal springs overlooking the Arabian Sea.
          </p>
        </div>

        {/* CASA MOMO SIGNATURE GROWING PHOTO FRAME */}
        <div className="w-full max-w-7xl mx-auto mt-6">
          <div
            ref={heroFrameRef}
            className="relative h-[55vh] sm:h-[75vh] w-full overflow-hidden shadow-2xl bg-slate-950 will-change-transform"
          >
            <img
              ref={heroImgRef}
              src={HERO_IMG}
              alt="Stayza ocean cliffside architectural sanctuary"
              className="absolute left-0 right-0 w-full object-cover will-change-transform select-none"
              style={{ top: '-15%', height: '130%' }}
            />
            {/* Subtle Gradient Shadow */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

            {/* Bottom Caption Pill */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs font-mono text-[#FAF8F5] pointer-events-none">
              <span className="bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-[2px] border border-white/10 uppercase tracking-widest text-[10px]">
                THE CLIFFSIDE RESIDENCES
              </span>
              <span className="hidden sm:inline-block text-[#FFF0CA] text-[11px] font-medium">
                SCROLL DOWN TO EXPLORE &darr;
              </span>
            </div>
          </div>
        </div>
      </section>


      {/* ========================================================= */}
      {/* CHAPTER 01: THE GROUNDS (WORD REVEAL + INSET PARALLAX)    */}
      {/* ========================================================= */}
      <section className="py-24 sm:py-36 px-5 sm:px-12 lg:px-20 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-20">
          
          {/* Casa Momo Scroll-Scrubbed Text Manifesto */}
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-900 font-bold block">
              01 &bull; THE GROUNDS &bull; SINDH COAST
            </span>
            <CasaMomoWordReveal
              text="Located on an untouched stretch of the Sindh coastline, Stayza spans forty-two secluded acres between raw bedrock and sky. Designed for quiet privacy, open space, and the unbroken rhythm of the sea."
              className="font-serif-grand text-2xl sm:text-4xl lg:text-5xl text-slate-900 font-light leading-snug"
            />
          </div>

          {/* Grounds Inset Parallax Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center pt-8">
            <div className="lg:col-span-5 space-y-6">
              <h2 className="font-serif-grand text-3xl sm:text-4xl text-slate-900 font-light leading-tight">
                A Kilometer of Private, Undisturbed Beach.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                With zero commercial neighbors, the estate offers complete seclusion. Every sunset is uninterrupted, with walking trails carved along the clifftops and direct boardwalk paths down to the soft sand below.
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-2 font-mono text-xs">
                <div className="p-4 bg-white border border-slate-200 rounded-[2px] space-y-1">
                  <span className="text-[10px] text-slate-400 block uppercase">Beachfront</span>
                  <strong className="text-slate-900 text-sm">1.2 km Secluded Sand</strong>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-[2px] space-y-1">
                  <span className="text-[10px] text-slate-400 block uppercase">Total Property</span>
                  <strong className="text-slate-900 text-sm">42 Private Acres</strong>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-[2px] space-y-1">
                  <span className="text-[10px] text-slate-400 block uppercase">Ocean View</span>
                  <strong className="text-slate-900 text-sm">100% West-Facing</strong>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-[2px] space-y-1">
                  <span className="text-[10px] text-slate-400 block uppercase">Evening Sunset</span>
                  <strong className="text-slate-900 text-sm">Every Afternoon</strong>
                </div>
              </div>
            </div>

            {/* Casa Momo Gliding Image Window */}
            <div className="lg:col-span-7">
              <CasaMomoParallaxImage
                src={BEACH_IMG}
                alt="Secluded beach sands and clear ocean tide"
                containerClassName="h-96 sm:h-[500px] w-full rounded-[4px] shadow-xl border border-slate-200"
                intensity={16}
              />
            </div>
          </div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* CHAPTER 02: LIVING SPACES (7 RESIDENCES WITH PARALLAX)    */}
      {/* ========================================================= */}
      <section className="py-24 sm:py-36 px-5 sm:px-12 lg:px-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-16">
          
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
              className="px-6 py-3 bg-slate-900 text-white font-mono text-xs uppercase tracking-wider rounded-[2px] hover:bg-emerald-950 transition-colors shrink-0 flex items-center gap-2"
            >
              <span>Explore All 7 Suites</span>
              <CasaMomoArrow className="text-[#FFF0CA]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {/* Suite 301 */}
            <div className="space-y-4 group">
              <CasaMomoParallaxImage
                src="https://res.cloudinary.com/v1rl3ras/image/upload/v1795019369/hotel-suites/suite-301/suite-301-bedroom.webp"
                alt="The Horizon Penthouse Master Suite"
                containerClassName="h-80 sm:h-96 w-full rounded-[2px] shadow-md border border-slate-100"
                intensity={14}
              />
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono text-emerald-900 uppercase font-bold tracking-widest block">
                  SUITE 301 &bull; PENTHOUSE
                </span>
                <h3 className="font-serif-grand text-2xl text-slate-900 font-light">
                  The Horizon Penthouse
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Panoramic master bedroom, private infinity plunge pool, and floor-to-ceiling sea horizon views.
                </p>
              </div>
            </div>

            {/* Suite 204 */}
            <div className="space-y-4 group">
              <CasaMomoParallaxImage
                src="https://res.cloudinary.com/v1rl3ras/image/upload/v1795019371/hotel-suites/suite-301/suite-301-living.webp"
                alt="The Coastal Villa Living Salon"
                containerClassName="h-80 sm:h-96 w-full rounded-[2px] shadow-md border border-slate-100"
                intensity={14}
              />
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono text-emerald-900 uppercase font-bold tracking-widest block">
                  SUITE 204 &bull; VILLA
                </span>
                <h3 className="font-serif-grand text-2xl text-slate-900 font-light">
                  The Coastal Villa
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Sunlit living salon, hand-carved travertine walls, and private outdoor basalt stone courtyard.
                </p>
              </div>
            </div>

            {/* Suite 401 */}
            <div className="space-y-4 group">
              <CasaMomoParallaxImage
                src="https://res.cloudinary.com/v1rl3ras/image/upload/v1795019373/hotel-suites/suite-301/suite-301-bath.webp"
                alt="The Overwater Pavilion Deep Bath"
                containerClassName="h-80 sm:h-96 w-full rounded-[2px] shadow-md border border-slate-100"
                intensity={14}
              />
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono text-emerald-900 uppercase font-bold tracking-widest block">
                  SUITE 401 &bull; PAVILION
                </span>
                <h3 className="font-serif-grand text-2xl text-slate-900 font-light">
                  The Overwater Pavilion
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Heated travertine spa tub, rain shower, and direct terrace access above the breaking surf.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* CHAPTER 03: COASTAL DINING (CASA MOMO SCALE-GROW BREAK)   */}
      {/* ========================================================= */}
      <section id="dining" className="py-24 sm:py-36 px-5 sm:px-12 lg:px-20 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="max-w-3xl space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-900 font-bold block">
              03 &bull; COASTAL DINING
            </span>
            <h2 className="font-serif-grand text-3xl sm:text-5xl text-slate-900 font-light leading-tight">
              The Harvest Pavilion
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Open-air seaside dining with fresh morning catch landed directly on our beach and organic produce harvested from our estate garden beds.
            </p>
          </div>

          {/* Full-Width Casa Momo Scale-Grow Dining Photo */}
          <div className="w-full">
            <CasaMomoParallaxImage
              src={DINING_IMG}
              alt="Open-air seaside dining overlooking the ocean"
              containerClassName="h-[60vh] sm:h-[75vh] w-full shadow-2xl bg-slate-950"
              intensity={18}
              scaleGrow={true}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 font-mono text-xs">
            <div className="p-6 bg-white border border-slate-200 rounded-[2px] space-y-2 hover:border-slate-400 hover:shadow-xs transition-all duration-300">
              <span className="text-slate-400 uppercase text-[10px] block">BREAKFAST</span>
              <strong className="text-slate-900 text-sm block">07:00 &ndash; 11:00</strong>
              <p className="text-slate-600 font-sans text-xs">Fresh pastries, local fruit, and hand-brewed pour-overs beside the tide.</p>
            </div>
            <div className="p-6 bg-white border border-slate-200 rounded-[2px] space-y-2 hover:border-slate-400 hover:shadow-xs transition-all duration-300">
              <span className="text-slate-400 uppercase text-[10px] block">COASTAL DINNER</span>
              <strong className="text-slate-900 text-sm block">18:00 &ndash; 23:00</strong>
              <p className="text-slate-600 font-sans text-xs">Wood-fired red snapper, wild sea bass, and herbs picked that morning.</p>
            </div>
            <div className="p-6 bg-white border border-slate-200 rounded-[2px] space-y-2 hover:border-slate-400 hover:shadow-xs transition-all duration-300">
              <span className="text-slate-400 uppercase text-[10px] block">PRIVATE CHEF</span>
              <strong className="text-slate-900 text-sm block">In-Suite Service</strong>
              <p className="text-slate-600 font-sans text-xs">Custom multi-course dinners prepared directly on your private terrace.</p>
            </div>
          </div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* CHAPTER 04: GEOTHERMAL MINERAL SPRINGS (INSET PARALLAX)   */}
      {/* ========================================================= */}
      <section id="wellness" className="py-24 sm:py-36 px-5 sm:px-12 lg:px-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="max-w-3xl space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-900 font-bold block">
              04 &bull; WELLNESS &amp; MINERAL WATERS
            </span>
            <h2 className="font-serif-grand text-3xl sm:text-5xl text-slate-900 font-light leading-tight">
              Mineral Hot Springs &amp; Cedar Saunas.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Naturally heated geothermal saline pools carved directly into the coastal rock terrace, elevated above the breaking ocean surf.
            </p>
          </div>

          {/* Full-Width Casa Momo Scale-Grow Spa Photo */}
          <div className="w-full">
            <CasaMomoParallaxImage
              src={SPA_IMG}
              alt="Outdoor geothermal mineral hot spring pool over ocean surf"
              containerClassName="h-[60vh] sm:h-[75vh] w-full shadow-2xl bg-slate-950"
              intensity={18}
              scaleGrow={true}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
            <div className="p-6 bg-[#FAF8F5] border border-slate-200 rounded-[2px] space-y-2 hover:border-slate-400 hover:shadow-xs transition-all duration-300">
              <strong className="text-slate-900 block font-mono text-xs uppercase">38°C Thermal Plunge Baths</strong>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Geothermal mineral water pools rich in sea magnesium, positioned on cliff terraces directly above the waves.
              </p>
            </div>
            <div className="p-6 bg-[#FAF8F5] border border-slate-200 rounded-[2px] space-y-2 hover:border-slate-400 hover:shadow-xs transition-all duration-300">
              <strong className="text-slate-900 block font-mono text-xs uppercase">Panoramic Cedar Saunas</strong>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Weathered timber dry saunas infused with wild coastal thyme, overlooking the vast ocean horizon.
              </p>
            </div>
            <div className="p-6 bg-[#FAF8F5] border border-slate-200 rounded-[2px] space-y-2 hover:border-slate-400 hover:shadow-xs transition-all duration-300">
              <strong className="text-slate-900 block font-mono text-xs uppercase">Holistic Marine Treatments</strong>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Rejuvenating sea salt scrubs and organic body treatments curated by resident holistic therapists.
              </p>
            </div>
          </div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* CHAPTER 05: ARRIVAL SANCTUARY & PRIVACY                   */}
      {/* ========================================================= */}
      <section id="arrival" className="py-24 sm:py-36 px-5 sm:px-12 lg:px-20 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-900 font-bold block">
              05 &bull; COMPLETE PRIVACY
            </span>
            <h2 className="font-serif-grand text-3xl sm:text-5xl text-slate-900 font-light leading-tight">
              Underground Valet &amp; Zero Hotel Lobbies.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              True luxury is peace and quiet. When you arrive at the estate, your vehicle enters an underground travertine portal. A private elevator takes you straight into your suite, where check-in takes place in complete comfort without lobbies or waiting.
            </p>
            
            <div className="space-y-3 pt-2 text-xs font-mono">
              <div className="p-4 bg-white border border-slate-200 rounded-[2px] flex items-center gap-3 hover:border-emerald-700/50 hover:bg-slate-50 transition-all duration-300">
                <span className="w-2 h-2 rounded-full bg-emerald-700 shrink-0" />
                <span>Private Chauffeur Transfers from Karachi (75 Minutes)</span>
              </div>
              <div className="p-4 bg-white border border-slate-200 rounded-[2px] flex items-center gap-3 hover:border-emerald-700/50 hover:bg-slate-50 transition-all duration-300">
                <span className="w-2 h-2 rounded-full bg-emerald-700 shrink-0" />
                <span>Underground Parking &amp; Direct Suite Elevators</span>
              </div>
              <div className="p-4 bg-white border border-slate-200 rounded-[2px] flex items-center gap-3 hover:border-emerald-700/50 hover:bg-slate-50 transition-all duration-300">
                <span className="w-2 h-2 rounded-full bg-emerald-700 shrink-0" />
                <span>100% In-Suite Check-In (No Crowds, No Waiting)</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <CasaMomoParallaxImage
              src={VALET_IMG}
              alt="Underground valet portal and private residence entrance"
              containerClassName="h-80 sm:h-[480px] w-full rounded-[4px] shadow-xl border border-slate-200"
              intensity={15}
            />
          </div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* FINAL CALL TO ACTION (RESERVE A SUITE)                    */}
      {/* ========================================================= */}
      <section className="py-24 sm:py-32 px-5 sm:px-12 lg:px-20 bg-[#0E1201] text-[#FAF8F5] text-center select-none border-t border-slate-800">
        <div className="max-w-3xl mx-auto space-y-6">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#FFF0CA] font-bold block">
            STAYZA RESIDENCES &bull; 7 PRIVATE SUITES
          </span>
          <h2 className="font-serif-grand text-3xl sm:text-6xl font-light tracking-tight text-white leading-tight">
            Reserve Your Stay on the Coast.
          </h2>
          <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-normal">
            Experience the peace of our cliffside residences, geothermal mineral springs, and coastal dining. Secure your suite with a 30% advance deposit.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-mono">
            <Link
              to="/suites"
              className="w-full sm:w-auto px-8 py-4 bg-[#FFF0CA] text-slate-950 font-bold uppercase tracking-wider rounded-[2px] hover:bg-white transition-colors min-h-[44px] flex items-center justify-center gap-2"
            >
              <span>Explore the 7 Suites</span>
              <CasaMomoArrow className="text-slate-950" />
            </Link>
            <Link
              to="/reserve"
              className="w-full sm:w-auto px-8 py-4 border border-slate-700 text-[#FAF8F5] font-bold uppercase tracking-wider rounded-[2px] hover:bg-slate-900 transition-colors min-h-[44px] flex items-center justify-center gap-2"
            >
              <span>Book a Stay (30% Deposit)</span>
              <CasaMomoArrow className="text-white" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Architectural Footer */}
      <Footer />
    </div>
  )
}
