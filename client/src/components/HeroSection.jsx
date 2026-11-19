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
export default function HeroSection({ onQuickReserve }) {
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

      {/* Floating 1-Line Check-In Dock (Harmonious on Mobile, Tablet & Desktop) */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 w-full pb-8 sm:pb-14">
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl p-3 sm:p-4 rounded-[2px] grid grid-cols-2 md:grid-cols-4 gap-3 items-center">
          <div className="px-2 sm:px-3 border-r border-slate-200/80">
            <span className="block text-[9px] tracking-[0.25em] text-slate-400 font-bold uppercase">
              CHECK-IN
            </span>
            <span className="text-xs font-semibold text-slate-800">
              Nov 24, 2026
            </span>
          </div>

          <div className="px-2 sm:px-3 md:border-r md:border-slate-200/80">
            <span className="block text-[9px] tracking-[0.25em] text-slate-400 font-bold uppercase">
              CHECK-OUT
            </span>
            <span className="text-xs font-semibold text-slate-800">
              Nov 28 (4N)
            </span>
          </div>

          <div className="col-span-2 md:col-span-1 px-2 sm:px-3 border-t md:border-t-0 md:border-r border-slate-200/80 pt-2 md:pt-0">
            <span className="block text-[9px] tracking-[0.25em] text-slate-400 font-bold uppercase">
              SUITE SELECTION
            </span>
            <span className="text-xs font-semibold text-slate-800 truncate block">
              2 Guests &bull; 1 Suite
            </span>
          </div>

          <button
            onClick={onQuickReserve}
            className="tactile col-span-2 md:col-span-1 w-full py-3 bg-emerald-950 hover:bg-slate-900 text-white text-[10px] tracking-[0.22em] font-bold uppercase transition-colors rounded-[2px] cursor-pointer"
          >
            CHECK AVAILABILITY
          </button>
        </div>
      </div>
    </section>
  )
}
