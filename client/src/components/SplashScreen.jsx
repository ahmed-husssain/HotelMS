import React, { useEffect, useState } from 'react'

/**
 * SplashScreen — Stayza Concept 01: The Cantilevered Pavilion & Horizon
 *
 * Implements a quiet, high-luxury cinematic opening:
 * - Pure architectural obsidian stillness (#0E1201)
 * - Stroke-by-stroke CSS keyframe vector animation of Concept 01:
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
  const [isDissolving, setIsDissolving] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  const handleDismiss = () => {
    if (isDismissed) return
    setIsDismissed(true)
    document.body.style.overflow = ''
    if (onComplete) onComplete()
  }

  useEffect(() => {
    // If URL explicitly requests skipping intro (?intro=false)
    if (
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('intro') === 'false'
    ) {
      handleDismiss()
      return
    }

    // Lock document body scroll while intro is playing
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Dissolve initiates at 2.6s
    const dissolveTimer = setTimeout(() => {
      setIsDissolving(true)
    }, 2600)

    // Complete dismiss & unlock scroll at 3.4s
    const dismissTimer = setTimeout(() => {
      document.body.style.overflow = originalOverflow
      handleDismiss()
    }, 3400)

    // Keyboard dismiss on Escape or Space
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        handleDismiss()
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      clearTimeout(dissolveTimer)
      clearTimeout(dismissTimer)
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [onComplete])

  if (isDismissed) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Stayza Opening Sequence"
      onClick={handleDismiss}
      className={`fixed inset-0 z-[9999] bg-[#0E1201] flex flex-col items-center justify-center select-none overflow-hidden cursor-pointer transition-opacity duration-800 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isDissolving ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
    >
      <style>{`
        @keyframes drawLine {
          to { stroke-dashoffset: 0; }
        }
        @keyframes popIn {
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeInUp {
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-roof {
          stroke-dasharray: 95;
          stroke-dashoffset: 95;
          animation: drawLine 800ms cubic-bezier(0.16, 1, 0.3, 1) 150ms forwards;
        }
        .anim-pylon {
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: drawLine 650ms cubic-bezier(0.16, 1, 0.3, 1) 450ms forwards;
        }
        .anim-arch {
          stroke-dasharray: 125;
          stroke-dashoffset: 125;
          animation: drawLine 750ms cubic-bezier(0.16, 1, 0.3, 1) 750ms forwards;
        }
        .anim-base {
          stroke-dasharray: 75;
          stroke-dashoffset: 75;
          animation: drawLine 600ms cubic-bezier(0.16, 1, 0.3, 1) 850ms forwards;
        }
        .anim-horizon {
          stroke-dasharray: 60;
          stroke-dashoffset: 60;
          animation: drawLine 600ms cubic-bezier(0.16, 1, 0.3, 1) 950ms forwards;
        }
        .anim-keystone {
          opacity: 0;
          transform: scale(0.2);
          transform-origin: 50px 50px;
          animation: popIn 500ms cubic-bezier(0.16, 1, 0.3, 1) 1200ms forwards;
        }
        .anim-wordmark {
          opacity: 0;
          transform: translateY(12px);
          animation: fadeInUp 750ms cubic-bezier(0.16, 1, 0.3, 1) 1250ms forwards;
        }
        .anim-skip {
          opacity: 0;
          animation: fadeInUp 800ms ease-out 1800ms forwards;
        }
      `}</style>

      {/* Center Architectural Composition */}
      <div
        style={{
          transform: isDissolving ? 'scale(1.06)' : 'scale(1)',
          transition: 'transform 800ms cubic-bezier(0.22, 1, 0.36, 1)',
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
            className="anim-roof"
          />

          {/* 2. Monolithic Vertical Pylons */}
          <line
            x1="26"
            y1="36"
            x2="26"
            y2="78"
            strokeWidth="2.2"
            className="anim-pylon"
          />
          <line
            x1="74"
            y1="36"
            x2="74"
            y2="78"
            strokeWidth="2.2"
            className="anim-pylon"
          />

          {/* 3. Inner Sanctuary Portal Arch */}
          <path
            d="M 38 78 L 38 52 C 38 45.4 43.4 40 50 40 C 56.6 40 62 45.4 62 52 L 62 78"
            strokeWidth="1.8"
            opacity="0.45"
            className="anim-arch"
          />

          {/* 4. Structural Travertine Lintel Base */}
          <line
            x1="16"
            y1="78"
            x2="84"
            y2="78"
            strokeWidth="3.2"
            className="anim-base"
          />

          {/* 5. Coastal Horizon Hairline */}
          <line
            x1="22"
            y1="65"
            x2="78"
            y2="65"
            strokeWidth="1"
            opacity="0.35"
            className="anim-horizon"
          />

          {/* 6. Keystone Center Dot — Pure Alabaster Monochrome (Zero Yellow) */}
          <circle
            cx="50"
            cy="50"
            r="3.2"
            fill="#FAF8F5"
            stroke="none"
            className="anim-keystone"
          />
        </svg>

        {/* Brand Wordmark & Architectural Subtitle */}
        <div className="anim-wordmark text-center mt-6">
          <div className="font-serif-grand text-2xl sm:text-3xl font-extrabold tracking-[0.28em] text-[#FAF8F5]">
            STAYZA
          </div>
          <div className="font-sans-clean text-[9px] sm:text-[10px] tracking-[0.38em] text-[#A8A29E] uppercase mt-2 font-medium">
            SANCTUARY &bull; RESIDENCES
          </div>
        </div>
      </div>

      {/* Discreet Tap/Click to Enter Indicator */}
      <div className="anim-skip absolute bottom-8 sm:bottom-12 text-[9px] font-mono tracking-[0.3em] uppercase text-[#78716C] hover:text-[#FAF8F5] transition-colors">
        Click anywhere to enter &rarr;
      </div>
    </div>
  )
}
