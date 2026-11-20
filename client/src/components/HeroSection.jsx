import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React, { useEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

/**
 * HeroSection — Cross-Device Optimized Luxury Cinematic Hero
 * 
 * Performance & Responsiveness Architecture:
 * - Mobile/Tablet (<1024px): Bypasses JS scroll scrub to preserve native 60/120Hz touch inertia.
 * - Laptop/Desktop (>=1024px): Parallax transforms are applied to a lightweight hardware-accelerated
 *   wrapper div with translate3d, leaving the video decoder untouched in its own GPU thread.
 * - Battery & GPU Relief: IntersectionObserver auto-pauses video when scrolled out of view.
 * - Zero GPU Filter Thrashing: Replaced CSS brightness filter with a zero-cost static tint layer.
 * - Network Efficient: Uses preload="metadata" with high-efficiency WebM & MP4 fallback sources.
 */
export default function HeroSection({ onQuickReserve, onExplore }) {
  const heroRef = useRef(null)
  const mediaWrapperRef = useRef(null)
  const videoRef = useRef(null)
  const titleRef = useRef(null)

  useEffect(() => {
    // 1. IntersectionObserver to auto-pause video off-screen (saves 100% GPU/battery when exploring suites)
    const videoEl = videoRef.current
    let observer = null

    if (videoEl && typeof IntersectionObserver !== 'undefined' && heroRef.current) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            videoEl.play().catch(() => {
              // Gracefully handle browser autoplay policies or iOS Low Power Mode
            })
          } else {
            videoEl.pause()
          }
        },
        { threshold: 0.05 }
      )
      observer.observe(heroRef.current)
    }

    // 2. Responsive GSAP Animation (Laptops & Desktops Only)
    const isDesktop = window.matchMedia && window.matchMedia('(min-width: 1024px)').matches
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let ctx = null
    if (isDesktop && !prefersReducedMotion) {
      ctx = gsap.context(() => {
        // Parallax translate scrub applied to container wrapper, NOT directly to video tag
        if (mediaWrapperRef.current) {
          gsap.to(mediaWrapperRef.current, {
            yPercent: 12,
            scale: 1.02,
            ease: 'none',
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          })
        }

        // Subtle lift & fade for typography on scroll
        if (titleRef.current) {
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
        }
      }, heroRef)
    }

    return () => {
      if (observer) observer.disconnect()
      if (ctx) ctx.revert()
    }
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative min-h-[92dvh] sm:min-h-[95vh] pt-24 sm:pt-28 flex flex-col justify-between overflow-hidden bg-[#FAF8F5]"
    >
      {/* Background Hero Cinematic Media Layer with Decoupled Hardware-Accelerated Wrapper */}
      <div 
        ref={mediaWrapperRef}
        className="absolute inset-0 overflow-hidden pointer-events-none will-change-transform transform-gpu"
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/assets/hero-drone-poster.webp"
          className="w-full h-full object-cover object-center scale-105 origin-center"
        >
          <source src="/assets/hero-drone-ultra.webm" type="video/webm" />
          <source src="/assets/hero-drone-optimized.mp4" type="video/mp4" />
        </video>
        {/* Subtle Static Optical Density Tint (Zero GPU Shading Cost vs CSS Filters) */}
        <div className="absolute inset-0 bg-black/[0.04]" />
        {/* Soft Alabaster Editorial Mist: Balances dusk photography with obsidian typography */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5]/85 via-[#FAF8F5]/60 to-[#FAF8F5]" />
      </div>

      {/* Hero Editorial Header */}
      <div ref={titleRef} className="relative z-10 max-w-7xl mx-auto px-6 pt-16 sm:pt-20 w-full text-center">
        <h1 className="font-serif-grand text-4xl sm:text-6xl md:text-7xl font-bold tracking-[0.02em] text-slate-900 leading-[1.08] max-w-4xl mx-auto">
          Where Architecture Meets Silence.
        </h1>

        <p className="mt-4 text-xs sm:text-sm tracking-[0.25em] text-slate-800 uppercase font-medium">
          Luxury Suites & Villas &bull; Ocean Views &bull; Complete Privacy
        </p>
      </div>

      {/* Sculptural Arch Stamp — Solution A: Discover Residences Invitation */}
      <div className="relative z-20 w-full px-4 sm:px-6 pb-8 sm:pb-12 flex flex-col items-center">
        <button
          type="button"
          onClick={() => {
            if (onExplore) {
              onExplore()
            } else {
              const el = document.getElementById('residences')
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          }}
          className="group inline-flex items-center gap-2 p-1.5 pl-4 pr-1.5 bg-[#FAF8F5]/90 hover:bg-[#FAF8F5] backdrop-blur-md rounded-full border border-[#E5DFD5] hover:border-slate-900 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer min-h-[44px] active:scale-[0.98]"
          aria-label="Explore luxury ocean suites at Stayza"
        >
          <div className="flex items-center gap-2 font-mono text-xs text-slate-900">
            {/* Stayza Concept 01 Pavilion Emblem — Pure Monochrome Matching Theme */}
            <svg className="w-4 h-4 text-slate-900" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 14 36 L 50 22 L 86 36" strokeWidth="7" />
              <line x1="28" y1="38" x2="28" y2="78" strokeWidth="6" />
              <line x1="72" y1="38" x2="72" y2="78" strokeWidth="6" />
              <line x1="16" y1="78" x2="84" y2="78" strokeWidth="8" />
              <circle cx="50" cy="50" r="7" fill="currentColor" stroke="none" />
            </svg>
            <span className="font-semibold text-slate-900 tracking-wider">Explore Rooms &amp; Suites</span>
          </div>

          <span className="w-[1px] h-4 bg-[#E5DFD5] mx-1" aria-hidden="true" />

          {/* Kinetic Arrow Capsule — Theme Monochrome */}
          <div className="px-4 py-2 bg-slate-900 group-hover:bg-slate-800 text-[#FAF8F5] font-mono text-[10px] font-bold uppercase tracking-widest rounded-full transition-colors flex items-center gap-1.5 shadow-xs">
            <span>Discover</span>
            <span className="transition-transform duration-200 group-hover:translate-y-0.5">&darr;</span>
          </div>
        </button>

        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-2.5 block select-none">
          Private Ocean Suites &bull; Luxury Villas
        </span>
      </div>
    </section>
  )
}
