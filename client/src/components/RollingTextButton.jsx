import React from 'react'

/**
 * RollingTextButton
 * Implements the signature luxury rolling-text reveal animation:
 * On hover, the primary text line slides UP (-100%) while an identical
 * secondary line rolls up from below into view, accompanied by a diagonal
 * micro-translation of the arrow glyph (↗).
 */
export default function RollingTextButton({
  text = 'Apartment Details',
  onClick,
  className = '',
  variant = 'primary',
}) {
  const isPrimary = variant === 'primary'

  const baseStyles = isPrimary
    ? 'bg-slate-900 hover:bg-emerald-950 text-white border-slate-900'
    : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-300'

  return (
    <button
      onClick={onClick}
      className={`group relative inline-flex items-center justify-center px-5 py-3 border text-[10px] tracking-[0.24em] font-bold uppercase overflow-hidden cursor-pointer active:scale-[0.97] transition-all duration-300 shadow-xs ${baseStyles} ${className}`}
    >
      {/* Rolling Text Container */}
      <span className="relative inline-block overflow-hidden h-[1.3em] leading-tight">
        {/* Top Text (exits upwards on hover) */}
        <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full will-change-transform">
          {text}
        </span>

        {/* Bottom Duplicate Text (enters from bottom on hover) */}
        <span
          aria-hidden="true"
          className="absolute top-0 left-0 inline-block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-full group-hover:translate-y-0 will-change-transform"
        >
          {text}
        </span>
      </span>

      {/* Diagonal Moving Arrow */}
      <span
        aria-hidden="true"
        className="ml-2 font-mono text-xs transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      >
        ↗
      </span>
    </button>
  )
}
