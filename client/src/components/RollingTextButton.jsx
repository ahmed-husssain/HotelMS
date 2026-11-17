import React from 'react'

/**
 * RollingTextButton
 * 
 * Signature ultra-luxury Awwwards rolling reveal interaction:
 * - Simultaneous vertical text rolling: Top line slides up (-100%) while duplicate rolls up from below.
 * - Dual diagonal arrow aperture: Primary arrow glides up-right (↗) out of view while a secondary 
 *   arrow glides in from bottom-left to center with cubic-bezier physics.
 * - Tactile active compression & butter-smooth 120 FPS GPU transitions.
 */
export default function RollingTextButton({
  text = 'Reserve',
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  type = 'button',
}) {
  const isPrimary = variant === 'primary'
  const isOutline = variant === 'outline'

  const baseStyles = isPrimary
    ? 'bg-slate-900 hover:bg-emerald-950 text-[#FAF8F5] border-slate-900'
    : isOutline
    ? 'bg-transparent hover:bg-slate-900 text-slate-900 hover:text-[#FAF8F5] border-slate-900'
    : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-300'

  const sizeStyles = {
    xs: 'h-7 px-3 text-[10px] tracking-[0.16em]',
    sm: 'h-9 px-3.5 sm:px-4 text-[11px] sm:text-xs tracking-[0.2em]',
    md: 'px-5 py-3 text-[10px] tracking-[0.24em]',
  }[size] || 'px-5 py-3 text-[10px] tracking-[0.24em]'

  return (
    <button
      type={type}
      onClick={onClick}
      className={`group relative inline-flex items-center justify-center border font-mono uppercase font-bold overflow-hidden cursor-pointer active:scale-[0.97] transition-all duration-300 shadow-xs rounded-[2px] ${sizeStyles} ${baseStyles} ${className}`}
    >
      {/* 1. Vertical Rolling Text Container */}
      <span className="relative inline-block overflow-hidden h-[1.3em] leading-tight select-none">
        {/* Top Text (exits upwards on hover) */}
        <span className="inline-block transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full will-change-transform">
          {text}
        </span>

        {/* Bottom Duplicate Text (enters from bottom on hover) */}
        <span
          aria-hidden="true"
          className="absolute top-0 left-0 inline-block transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-full group-hover:translate-y-0 will-change-transform"
        >
          {text}
        </span>
      </span>

      {/* 2. Dual Diagonal Rolling Arrow Aperture */}
      <span
        aria-hidden="true"
        className="relative ml-2 w-3 h-3 overflow-hidden inline-flex items-center justify-center shrink-0"
      >
        {/* Primary Arrow: slides up and right out of view on hover */}
        <svg
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3 h-3 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-full group-hover:-translate-y-full will-change-transform"
        >
          <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" />
        </svg>

        {/* Secondary Arrow: enters from bottom-left to center on hover */}
        <svg
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3 h-3 absolute top-0 left-0 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] -translate-x-full translate-y-full group-hover:translate-x-0 group-hover:translate-y-0 will-change-transform"
        >
          <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" />
        </svg>
      </span>
    </button>
  )
}
