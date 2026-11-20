import React from 'react'
import { Link } from 'react-router-dom'

/**
 * BrandLogo — Stayza Concept 01: The Cantilevered Pavilion & Horizon
 *
 * Grounded in the architectural ethos of the property:
 * - Cantilevered Overhang Roof: Shelter, elevation, and bold modernism
 * - Monolithic Pylons: Structural permanence and privacy
 * - Inner Sanctuary Portal Arch: Transition into deep relaxation
 * - Travertine Lintel Base: Grounded coastal stone foundation
 * - Ocean Horizon Hairline: The Sindh coast meets the Arabian Sea
 * - Celestial Gold Keystone: Dawn sun marker (#D4AF37)
 * - Sculpted Wordmark: STAYZA in Syne Extrabold
 */
export default function BrandLogo({
  variant = 'full', // 'full' | 'emblem' | 'wordmark'
  theme = 'dark',   // 'dark' (on alabaster/light bg) | 'light' (on obsidian/dark bg)
  size = 'md',      // 'sm' | 'md' | 'lg'
  showSubtitle = false,
  to = '/',
  className = '',
}) {
  const isLight = theme === 'light'

  // Size configurations
  const dimensions = {
    sm: {
      emblem: 'w-6 h-6',
      title: 'text-base tracking-[0.20em]',
      subtitle: 'text-[7px] tracking-[0.30em]',
    },
    md: {
      emblem: 'w-7 h-7 sm:w-8 sm:h-8',
      title: 'text-lg sm:text-xl tracking-[0.22em]',
      subtitle: 'text-[8px] tracking-[0.34em]',
    },
    lg: {
      emblem: 'w-10 h-10 sm:w-12 sm:h-12',
      title: 'text-2xl sm:text-3xl tracking-[0.25em]',
      subtitle: 'text-[10px] tracking-[0.38em]',
    },
  }[size] || {
    emblem: 'w-7 h-7 sm:w-8 sm:h-8',
    title: 'text-lg sm:text-xl tracking-[0.22em]',
    subtitle: 'text-[8px] tracking-[0.34em]',
  }

  const textColor = isLight ? 'text-[#FAF8F5]' : 'text-[#0E1201]'
  const subtitleColor = isLight ? 'text-[#A8A29E]' : 'text-[#78716C]'
  const emblemStroke = isLight ? '#FAF8F5' : '#0E1201'

  // Concept 01: Scalable SVG Architectural Pavilion & Horizon
  const Emblem = (
    <svg
      viewBox="0 0 100 100"
      className={`${dimensions.emblem} transition-transform duration-500 group-hover:scale-105 shrink-0`}
      fill="none"
      stroke={emblemStroke}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Cantilevered Overhang Roof */}
      <path d="M 12 34 L 50 20 L 88 34" strokeWidth="2.6" />
      {/* Monolithic Vertical Pylons */}
      <line x1="26" y1="36" x2="26" y2="78" />
      <line x1="74" y1="36" x2="74" y2="78" />
      {/* Inner Sanctuary Portal Arch */}
      <path
        d="M 38 78 L 38 52 C 38 45.4 43.4 40 50 40 C 56.6 40 62 45.4 62 52 L 62 78"
        strokeWidth="1.8"
        opacity="0.45"
      />
      {/* Structural Travertine Lintel Base */}
      <line x1="16" y1="78" x2="84" y2="78" strokeWidth="3" />
      {/* Coastal Horizon Line */}
      <line x1="22" y1="65" x2="78" y2="65" strokeWidth="1" opacity="0.3" />
      {/* Keystone Center Dot — Unified Theme Monochrome */}
      <circle cx="50" cy="50" r="3.2" fill={emblemStroke} stroke="none" />
    </svg>
  )

  const content = (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {(variant === 'full' || variant === 'emblem') && Emblem}

      {(variant === 'full' || variant === 'wordmark') && (
        <div className="flex flex-col justify-center">
          <span
            className={`font-serif-grand font-extrabold uppercase ${dimensions.title} ${textColor} leading-none`}
          >
            STAYZA
          </span>
          {showSubtitle && (
            <span
              className={`font-sans-clean font-semibold uppercase ${dimensions.subtitle} ${subtitleColor} leading-none pt-1`}
            >
              RESORTS &bull; SUITES
            </span>
          )}
        </div>
      )}
    </div>
  )

  if (to) {
    return (
      <Link
        to={to}
        className="group inline-flex items-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-800 transition-opacity hover:opacity-90 active:scale-[0.98]"
        aria-label="Stayza - Return to home"
      >
        {content}
      </Link>
    )
  }

  return content
}
