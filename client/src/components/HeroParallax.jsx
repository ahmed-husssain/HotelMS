import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React, { useEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

export default function HeroParallax({ onQuickReserve }) {
  const heroRef = useRef(null)
  const imageRef = useRef(null)
  const titleRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax scale and subtle translate scrub for hero image
      gsap.to(imageRef.current, {
        scale: 1.0,
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      // Floating title fade and subtle lift on scroll
      gsap.to(titleRef.current, {
        yPercent: -20,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative min-h-[95vh] pt-28 flex flex-col justify-between overflow-hidden bg-[#FAF8F5]"
    >
      {/* Background Hero Image with Hardware Scale */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          ref={imageRef}
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2400&q=90"
          alt="Luxury Architecture Sanctuary"
          className="w-full h-full object-cover object-center scale-110 origin-center filter brightness-[0.98]"
        />
        {/* Soft Alabaster Editorial Mist: Balances dusk photography with obsidian typography */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5]/90 via-[#FAF8F5]/70 to-[#FAF8F5]" />
      </div>

      {/* Hero Editorial Header */}
      <div ref={titleRef} className="relative z-10 max-w-7xl mx-auto px-6 pt-16 w-full text-center">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1 mb-6 rounded-full bg-white/95 backdrop-blur-md border border-slate-300/80 text-slate-800 text-[10px] tracking-[0.28em] font-semibold uppercase shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          Autumn Residency Openings
        </div>

        <h1 className="font-serif-grand text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-slate-900 leading-[1.08] max-w-4xl mx-auto">
          Where Architecture Meets Silence.
        </h1>

        <p className="mt-4 text-xs sm:text-sm tracking-[0.25em] text-slate-800 uppercase font-medium">
          Privileged Sanctuaries &bull; Ocean Horizon &bull; Complete Privacy
        </p>
      </div>

      {/* Floating 1-Line Check-In Dock */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 w-full pb-14">
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl p-3 sm:p-4 rounded-sm grid grid-cols-2 md:grid-cols-4 gap-3 items-center">
          <div className="px-3 border-r border-slate-100">
            <span className="block text-[9px] tracking-[0.25em] text-slate-400 font-bold uppercase">
              CHECK-IN
            </span>
            <span className="text-xs font-semibold text-slate-800">
              Nov 24, 2026
            </span>
          </div>

          <div className="px-3 border-r border-slate-100">
            <span className="block text-[9px] tracking-[0.25em] text-slate-400 font-bold uppercase">
              CHECK-OUT
            </span>
            <span className="text-xs font-semibold text-slate-800">
              Nov 28, 2026 (4 Nights)
            </span>
          </div>

          <div className="px-3 border-r border-slate-100">
            <span className="block text-[9px] tracking-[0.25em] text-slate-400 font-bold uppercase">
              SANCTUARY
            </span>
            <span className="text-xs font-semibold text-slate-800 truncate block">
              2 Guests &bull; 1 Suite
            </span>
          </div>

          <button
            onClick={onQuickReserve}
            className="tactile col-span-2 md:col-span-1 w-full py-3 bg-emerald-950 hover:bg-slate-900 text-white text-[10px] tracking-[0.22em] font-bold uppercase transition-colors"
          >
            CHECK AVAILABILITY
          </button>
        </div>
      </div>
    </section>
  )
}
