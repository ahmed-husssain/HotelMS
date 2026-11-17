import React, { useEffect, useState, useRef } from 'react'

/**
 * SplashScreen — Concept 01 (The Monolithic Portal & Keystone)
 *
 * Implements the refined cinematic camera glide:
 * - Phase 0: Obsidian stillness (#070B14) & perimeter coordinates
 * - Phase 1: SVG hairline vector drawing of the Monolithic Archway & lintel
 * - Phase 2: Gold keystone ignition (#D4AF37) & Habitas brand reveal
 * - Phase 3: Buttery-smooth exponential deceleration camera glide (1600ms)
 * - Auto-dismisses cleanly, unlocks scroll, and records session state.
 */
export default function SplashScreen({ onComplete }) {
  const [isDrawn, setIsDrawn] = useState(false)
  const [isIgnited, setIsIgnited] = useState(false)
  const [isSteppingIn, setIsSteppingIn] = useState(false)
  const [isCurtainDissolved, setIsCurtainDissolved] = useState(false)
  const [counter, setCounter] = useState('000%')
  const [isDismissed, setIsDismissed] = useState(false)

  const portalRef = useRef(null)

  useEffect(() => {
    // 1. Lock document body scroll while intro is playing
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Phase 1: Begin vector drawing (at 100ms)
    const drawTimer = setTimeout(() => {
      setIsDrawn(true)

      // Smooth numeric counter 000% -> 100%
      let count = 0
      const counterInterval = setInterval(() => {
        count += 5
        if (count > 100) count = 100
        setCounter(`${count < 10 ? '00' : count < 100 ? '0' : ''}${count}%`)
        if (count >= 100) clearInterval(counterInterval)
      }, 50)
    }, 100)

    // Phase 2: Keystone Ignition & Brand Reveal (at 1100ms)
    const igniteTimer = setTimeout(() => {
      setIsIgnited(true)
    }, 1100)

    // Phase 3: The Buttery-Smooth Step-In Glide (at 1750ms - allows 650ms to appreciate the logo)
    const stepInTimer = setTimeout(() => {
      setIsSteppingIn(true)

      // Staggered curtain dissolve (starts 250ms after scale starts)
      const curtainTimer = setTimeout(() => {
        setIsCurtainDissolved(true)
      }, 250)

      // Final unmount & unlock scroll (after 1600ms glide finishes)
      const completeTimer = setTimeout(() => {
        document.body.style.overflow = originalOverflow
        setIsDismissed(true)
        if (onComplete) onComplete()
      }, 1600)

      return () => {
        clearTimeout(curtainTimer)
        clearTimeout(completeTimer)
      }
    }, 1750)

    return () => {
      clearTimeout(drawTimer)
      clearTimeout(igniteTimer)
      clearTimeout(stepInTimer)
      document.body.style.overflow = originalOverflow
    }
  }, [onComplete])

  if (isDismissed) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Habitas Opening Sequence"
      className={`fixed inset-0 z-[9999] bg-[#070B14] flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden transition-opacity duration-1300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isCurtainDissolved ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
    >
      {/* Top Telemetry Markers */}
      <div
        className={`flex justify-between items-center text-slate-500 font-mono text-[10px] tracking-[0.25em] uppercase transition-opacity duration-500 ${
          isSteppingIn ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          <span className="text-slate-400 font-semibold">HABITAS</span>
          <span className="text-slate-600">//</span>
          <span className="text-slate-400">SANCTUARY</span>
        </div>
        <span>SINDH COAST &bull; 24&deg;48&apos;N</span>
      </div>

      {/* Center: Monolithic Archway & Gold Keystone Portal */}
      <div className="flex flex-col items-center justify-center my-auto">
        <div
          ref={portalRef}
          style={{
            transform: isSteppingIn ? 'scale(6.2)' : 'scale(1)',
            opacity: isSteppingIn ? 0 : 1,
            transition: 'transform 1600ms cubic-bezier(0.22, 1, 0.36, 1), opacity 1200ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
          className="relative flex flex-col items-center will-change-transform"
        >
          {/* SVG Arch with Hairline Vector Strokes */}
          <svg
            viewBox="0 0 100 100"
            className="w-28 h-28 sm:w-36 sm:h-36 text-[#FAF8F5] overflow-visible"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Outer Monolithic Arch */}
            <path
              strokeWidth="2.2"
              d="M 25 76 L 25 45 C 25 31.2 36.2 20 50 20 C 63.8 20 75 31.2 75 45 L 75 76"
              style={{
                strokeDasharray: 280,
                strokeDashoffset: isDrawn ? 0 : 280,
                transition: 'stroke-dashoffset 1100ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
            {/* Inner Architectural Arch */}
            <path
              strokeWidth="1.6"
              opacity="0.4"
              d="M 35 76 L 35 48 C 35 39.7 41.7 33 50 33 C 58.3 33 65 39.7 65 48 L 65 76"
              style={{
                strokeDasharray: 230,
                strokeDashoffset: isDrawn ? 0 : 230,
                transition: 'stroke-dashoffset 1100ms cubic-bezier(0.16, 1, 0.3, 1) 150ms',
              }}
            />
            {/* Structural Ground Lintel */}
            <line
              x1="16"
              y1="76"
              x2="84"
              y2="76"
              strokeWidth="2.8"
              style={{
                strokeDasharray: 100,
                strokeDashoffset: isDrawn ? 0 : 100,
                transition: 'stroke-dashoffset 900ms cubic-bezier(0.16, 1, 0.3, 1) 300ms',
              }}
            />
            {/* Ocean Horizon Hairline */}
            <line
              x1="22"
              y1="62"
              x2="78"
              y2="62"
              strokeWidth="1.2"
              opacity="0.35"
              style={{
                strokeDasharray: 80,
                strokeDashoffset: isDrawn ? 0 : 80,
                transition: 'stroke-dashoffset 900ms cubic-bezier(0.16, 1, 0.3, 1) 400ms',
              }}
            />

            {/* Radiant Celestial Keystone Sun */}
            <circle
              cx="50"
              cy="48"
              r="3.2"
              fill="#D4AF37"
              style={{
                transform: isIgnited ? 'scale(1)' : 'scale(0.5)',
                opacity: isIgnited ? 1 : 0,
                transformOrigin: '50px 48px',
                transition: 'all 500ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          </svg>

          {/* Brand Wordmark & Tagline */}
          <div
            style={{
              opacity: isIgnited ? 1 : 0,
              transform: isIgnited ? 'translateY(0)' : 'translateY(8px)',
              transition: 'all 600ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="text-center mt-4"
          >
            <div className="font-cinzel text-xl sm:text-2xl font-bold tracking-[0.3em] text-[#FAF8F5]">
              HABITAS
            </div>
            <div className="font-mono text-[9px] sm:text-[10px] tracking-[0.35em] text-amber-500 uppercase mt-1">
              RESIDENCES &bull; SANCTUARY
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Markers */}
      <div
        className={`flex justify-between items-center text-slate-500 font-mono text-[10px] tracking-[0.2em] uppercase transition-opacity duration-500 border-t border-slate-900 pt-3 ${
          isSteppingIn ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <span>PORTAL VERIFIED</span>
        <span className="text-[#FAF8F5] font-bold">{counter}</span>
        <span>EST. 2026</span>
      </div>
    </div>
  )
}
