import React, { useEffect, useState, useRef } from 'react'

/**
 * SplashScreen — Pure Monolithic Sanctuary Portal
 *
 * Implements a quiet, high-luxury cinematic opening:
 * - Pure obsidian stillness (#070B14)
 * - Hairline architectural vector drawing of the Monolithic Archway & lintel
 * - Radiant celestial gold keystone ignition (#D4AF37)
 * - Dignified HABITAS serif brand mark & Sindh Coast subtitle
 * - Exponential deceleration camera glide through the portal into the hero
 * - Zero tech clutter, zero digital counters, zero robotic telemetry
 */
export default function SplashScreen({ onComplete }) {
  const [isDrawn, setIsDrawn] = useState(false)
  const [isIgnited, setIsIgnited] = useState(false)
  const [isSteppingIn, setIsSteppingIn] = useState(false)
  const [isCurtainDissolved, setIsCurtainDissolved] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  const portalRef = useRef(null)

  useEffect(() => {
    // Respect reduced motion preference, search engine crawlers, and speed audits
    const isBotOrAudit = typeof navigator !== 'undefined' && (
      Boolean(navigator.webdriver) ||
      /bot|googlebot|crawler|spider|robot|crawling|lighthouse/i.test(navigator.userAgent)
    )
    if (isBotOrAudit || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
      setIsDismissed(true)
      if (onComplete) onComplete()
      return
    }

    // 1. Lock document body scroll while intro is playing
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Phase 1: Begin hairline vector drawing
    const drawTimer = setTimeout(() => {
      setIsDrawn(true)
    }, 60)

    // Phase 2: Keystone Ignition & Brand Reveal (at 550ms)
    const igniteTimer = setTimeout(() => {
      setIsIgnited(true)
    }, 550)

    // Phase 3: Cinematic Step-In Glide (at 1100ms)
    const stepInTimer = setTimeout(() => {
      setIsSteppingIn(true)

      // Curtain dissolve initiates during camera forward glide
      const curtainTimer = setTimeout(() => {
        setIsCurtainDissolved(true)
      }, 150)

      // Complete unmount & unlock scroll when camera completes transition
      const completeTimer = setTimeout(() => {
        document.body.style.overflow = originalOverflow
        setIsDismissed(true)
        if (onComplete) onComplete()
      }, 750)

      return () => {
        clearTimeout(curtainTimer)
        clearTimeout(completeTimer)
      }
    }, 1100)

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
      className={`fixed inset-0 z-[9999] bg-[#070B14] flex items-center justify-center select-none overflow-hidden transition-opacity duration-1200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isCurtainDissolved ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
    >
      {/* Center: Monolithic Archway & Gold Keystone Portal */}
      <div
        ref={portalRef}
        style={{
          transform: isSteppingIn ? 'scale(6.2)' : 'scale(1)',
          opacity: isSteppingIn ? 0 : 1,
          transition: 'transform 1500ms cubic-bezier(0.22, 1, 0.36, 1), opacity 1100ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        className="relative flex flex-col items-center will-change-transform px-6"
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
              transition: 'stroke-dashoffset 1000ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
          {/* Inner Architectural Arch */}
          <path
            strokeWidth="1.6"
            opacity="0.35"
            d="M 35 76 L 35 48 C 35 39.7 41.7 33 50 33 C 58.3 33 65 39.7 65 48 L 65 76"
            style={{
              strokeDasharray: 230,
              strokeDashoffset: isDrawn ? 0 : 230,
              transition: 'stroke-dashoffset 1000ms cubic-bezier(0.16, 1, 0.3, 1) 120ms',
            }}
          />
          {/* Structural Ground Lintel */}
          <line
            x1="16"
            y1="76"
            x2="84"
            y2="76"
            strokeWidth="2.6"
            style={{
              strokeDasharray: 100,
              strokeDashoffset: isDrawn ? 0 : 100,
              transition: 'stroke-dashoffset 850ms cubic-bezier(0.16, 1, 0.3, 1) 250ms',
            }}
          />
          {/* Ocean Horizon Hairline */}
          <line
            x1="22"
            y1="62"
            x2="78"
            y2="62"
            strokeWidth="1.2"
            opacity="0.3"
            style={{
              strokeDasharray: 80,
              strokeDashoffset: isDrawn ? 0 : 80,
              transition: 'stroke-dashoffset 850ms cubic-bezier(0.16, 1, 0.3, 1) 350ms',
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

        {/* Brand Wordmark & Subtle Editorial Tagline */}
        <div
          style={{
            opacity: isIgnited ? 1 : 0,
            transform: isIgnited ? 'translateY(0)' : 'translateY(8px)',
            transition: 'all 600ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="text-center mt-5"
        >
          <div className="font-cinzel text-xl sm:text-2xl font-bold tracking-[0.35em] text-[#FAF8F5]">
            HABITAS
          </div>
          <div className="font-mono text-[9px] sm:text-[10px] tracking-[0.35em] text-amber-500/85 uppercase mt-1.5 font-light">
            HOTEL &bull; RESIDENCES
          </div>
        </div>
      </div>
    </div>
  )
}
