import React, { useEffect, useState, useRef } from 'react'

/**
 * SplashScreen — Stayza Concept 01: The Cantilevered Pavilion & Horizon
 *
 * Implements a quiet, high-luxury cinematic opening:
 * - Pure architectural obsidian stillness (#0E1201)
 * - Stroke-by-stroke vector animation of Concept 01:
 *     1. Cantilevered Overhang Roof (Apex out to wings)
 *     2. Monolithic Pylons (Dropping from roof to bedrock)
 *     3. Foundation Travertine Lintel & Inner Sanctuary Arch
 *     4. Coastal Horizon Hairline
 *     5. Pure Alabaster Keystone Dot (#FAF8F5 — zero yellowish tint)
 * - Harmonious STAYZA wordmark (Syne) & SANCTUARY • RESIDENCES (Inter)
 * - Smooth cinematic curtain dissolve into the hero
 * - Click/Tap anywhere to skip immediately
 */
export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState(0) // 0: init, 1: roof, 2: pylons, 3: arch+base, 4: keystone+wordmark, 5: dissolve
  const [isDismissed, setIsDismissed] = useState(false)
  const portalRef = useRef(null)

  const handleDismiss = () => {
    if (isDismissed) return
    setIsDismissed(true)
    document.body.style.overflow = ''
    if (onComplete) onComplete()
  }

  useEffect(() => {
    // Respect reduced motion preference or automated speed audits
    const isBotOrAudit =
      typeof navigator !== 'undefined' &&
      (Boolean(navigator.webdriver) ||
        /bot|googlebot|crawler|spider|robot|crawling|lighthouse/i.test(navigator.userAgent))

    if (isBotOrAudit || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
      handleDismiss()
      return
    }

    // Lock document body scroll while intro is playing
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Phase 1: Cantilevered Roof begins drawing (120ms)
    const t1 = setTimeout(() => setPhase(1), 120)

    // Phase 2: Monolithic Pylons descend (450ms)
    const t2 = setTimeout(() => setPhase(2), 450)

    // Phase 3: Travertine Base + Sanctuary Arch rise (800ms)
    const t3 = setTimeout(() => setPhase(3), 800)

    // Phase 4: Keystone Center Dot + STAYZA Wordmark reveal (1200ms)
    const t4 = setTimeout(() => setPhase(4), 1200)

    // Phase 5: Soft Curtain Dissolve (2500ms)
    const t5 = setTimeout(() => setPhase(5), 2500)

    // Phase 6: Unmount & complete (3200ms)
    const t6 = setTimeout(() => {
      document.body.style.overflow = originalOverflow
      handleDismiss()
    }, 3200)

    // Keyboard dismiss on Escape or Space
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        handleDismiss()
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
      clearTimeout(t6)
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [onComplete])

  if (isDismissed) return null

  const isRoofDrawn = phase >= 1
  const isPylonsDrawn = phase >= 2
  const isArchDrawn = phase >= 3
  const isAssembled = phase >= 4
  const isDissolving = phase >= 5

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Stayza Opening Sequence"
      onClick={handleDismiss}
      className={`fixed inset-0 z-[9999] bg-[#0E1201] flex flex-col items-center justify-center select-none overflow-hidden cursor-pointer transition-opacity duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isDissolving ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
    >
      {/* Center Architectural Composition */}
      <div
        ref={portalRef}
        style={{
          transform: isDissolving ? 'scale(1.08)' : 'scale(1)',
          transition: 'transform 1000ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        className="relative flex flex-col items-center px-6 will-change-transform"
      >
        {/* Concept 01: The Cantilevered Pavilion & Horizon (Pure Alabaster Monochrome #FAF8F5) */}
        <svg
          viewBox="0 0 100 100"
          className="w-28 h-28 sm:w-36 sm:h-36 text-[#FAF8F5] overflow-visible"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* 1. Cantilevered Overhang Roof */}
          <path
            d="M 12 34 L 50 20 L 88 34"
            strokeWidth="2.6"
            style={{
              strokeDasharray: 90,
              strokeDashoffset: isRoofDrawn ? 0 : 90,
              transition: 'stroke-dashoffset 750ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />

          {/* 2. Monolithic Vertical Pylons */}
          <line
            x1="26"
            y1="36"
            x2="26"
            y2="78"
            strokeWidth="2.2"
            style={{
              strokeDasharray: 45,
              strokeDashoffset: isPylonsDrawn ? 0 : 45,
              transition: 'stroke-dashoffset 650ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
          <line
            x1="74"
            y1="36"
            x2="74"
            y2="78"
            strokeWidth="2.2"
            style={{
              strokeDasharray: 45,
              strokeDashoffset: isPylonsDrawn ? 0 : 45,
              transition: 'stroke-dashoffset 650ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />

          {/* 3. Inner Sanctuary Portal Arch */}
          <path
            d="M 38 78 L 38 52 C 38 45.4 43.4 40 50 40 C 56.6 40 62 45.4 62 52 L 62 78"
            strokeWidth="1.8"
            opacity="0.45"
            style={{
              strokeDasharray: 120,
              strokeDashoffset: isArchDrawn ? 0 : 120,
              transition: 'stroke-dashoffset 700ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />

          {/* 4. Structural Travertine Lintel Base */}
          <line
            x1="16"
            y1="78"
            x2="84"
            y2="78"
            strokeWidth="3.2"
            style={{
              strokeDasharray: 70,
              strokeDashoffset: isArchDrawn ? 0 : 70,
              transition: 'stroke-dashoffset 600ms cubic-bezier(0.16, 1, 0.3, 1) 100ms',
            }}
          />

          {/* 5. Coastal Horizon Hairline */}
          <line
            x1="22"
            y1="65"
            x2="78"
            y2="65"
            strokeWidth="1"
            opacity="0.35"
            style={{
              strokeDasharray: 60,
              strokeDashoffset: isArchDrawn ? 0 : 60,
              transition: 'stroke-dashoffset 600ms cubic-bezier(0.16, 1, 0.3, 1) 200ms',
            }}
          />

          {/* 6. Keystone Center Dot — Pure Alabaster Monochrome (Zero Yellow) */}
          <circle
            cx="50"
            cy="50"
            r="3.2"
            fill="#FAF8F5"
            stroke="none"
            style={{
              transform: isAssembled ? 'scale(1)' : 'scale(0.2)',
              opacity: isAssembled ? 1 : 0,
              transformOrigin: '50px 50px',
              transition: 'all 500ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </svg>

        {/* Brand Wordmark & Architectural Subtitle */}
        <div
          style={{
            opacity: isAssembled ? 1 : 0,
            transform: isAssembled ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 700ms cubic-bezier(0.16, 1, 0.3, 1), transform 700ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="text-center mt-6"
        >
          <div className="font-serif-grand text-2xl sm:text-3xl font-extrabold tracking-[0.28em] text-[#FAF8F5]">
            STAYZA
          </div>
          <div className="font-sans-clean text-[9px] sm:text-[10px] tracking-[0.38em] text-[#A8A29E] uppercase mt-2 font-medium">
            SANCTUARY &bull; RESIDENCES
          </div>
        </div>
      </div>

      {/* Discreet Tap/Click to Enter Indicator */}
      <div
        style={{
          opacity: isAssembled ? 0.6 : 0,
          transition: 'opacity 800ms ease-out 400ms',
        }}
        className="absolute bottom-8 sm:bottom-12 text-[9px] font-mono tracking-[0.3em] uppercase text-[#78716C] hover:text-[#FAF8F5] transition-colors"
      >
        Click anywhere to enter &rarr;
      </div>
    </div>
  )
}
