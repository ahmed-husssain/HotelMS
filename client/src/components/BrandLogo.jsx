import React from 'react'
import { Link } from 'react-router-dom'

/**
 * BrandLogo — Habitas Architectural Emblem & Wordmark
 *
 * Grounded in the architectural ethos of the property:
 * - Monolithic Arch: The portal to absolute privacy and seclusion
 * - Hairline Horizon: Where the Sindh coast meets the Arabian Sea
 * - Celestial Keystone: Gold dawn marker (#D4AF37)
 * - Single-line pure wordmark: HABITAS
 */
export default function BrandLogo({
  variant = 'full', // 'full' | 'emblem' | 'wordmark'
  theme = 'dark',   // 'dark' (on alabaster/light bg) | 'light' (on obsidian/dark bg)
  size = 'md',      // 'sm' | 'md' | 'lg'
  to = '/',
  className = '',
}) {
  const isLight = theme === 'light'

  // Size configurations
  const dimensions = {
    sm: { emblem: 'w-6 h-6', title: 'text-base tracking-[0.22em]' },
    md: { emblem: 'w-7 h-7 sm:w-8 sm:h-8', title: 'text-lg sm:text-xl tracking-[0.25em]' },
    lg: { emblem: 'w-10 h-10 sm:w-12 sm:h-12', title: 'text-2xl sm:text-3xl tracking-[0.28em]' },
  }[size] || dimensions.md

  const textColor = isLight ? 'text-[#FAF8F5]' : 'text-slate-900'
  const emblemStroke = isLight ? '#FAF8F5' : '#0F172A'

  // Scalable SVG Architectural Monogram
  const Emblem = (
    <svg
      viewBox="0 0 100 100"
      className={`${dimensions.emblem} transition-transform duration-500 group-hover:scale-105 shrink-0`}
      fill="none"
      stroke={emblemStroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Outer Monolithic Portal */}
      <path d="M 25 76 L 25 45 C 25 31.2 36.2 20 50 20 C 63.8 20 75 31.2 75 45 L 75 76" />
      {/* Inner Architectural Arch */}
      <path d="M 35 76 L 35 48 C 35 39.7 41.7 33 50 33 C 58.3 33 65 39.7 65 48 L 65 76" opacity="0.4" strokeWidth="1.6" />
      {/* Structural Ground Lintel */}
      <line x1="16" y1="76" x2="84" y2="76" strokeWidth="2.4" />
      {/* Ocean Horizon Hairline */}
      <line x1="22" y1="62" x2="78" y2="62" strokeWidth="1.2" opacity="0.35" />
      {/* Celestial Dawn Keystone */}
      <circle cx="50" cy="48" r="3" fill="#D4AF37" stroke="none" />
    </svg>
  )

  const content = (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {(variant === 'full' || variant === 'emblem') && Emblem}

      {(variant === 'full' || variant === 'wordmark') && (
        <span className={`font-serif-grand font-bold uppercase tracking-[0.16em] ${dimensions.title} ${textColor} leading-none`}>
          STAYZA
        </span>
      )}
    </div>
  )

  if (to) {
    return (
      <Link
        to={to}
        className="group inline-flex items-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-800 transition-opacity hover:opacity-90 active:scale-[0.98]"
        aria-label="Stayza — Return to home"
      >
        {content}
      </Link>
    )
  }

  return content
}
