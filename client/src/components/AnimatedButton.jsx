import React from 'react'

/**
 * AnimatedButton
 * 
 * Signature ultra-luxury staggered kinetic wave button:
 * - Each letter of the word rolls upward sequentially (one by one) with a staggered
 *   micro-delay, creating a mesmerizing cascading burst wave across the word.
 * - Powered by CSS pseudo-elements (`::after { content: attr(data-char) }`):
 *   Guarantees ZERO duplicate DOM text nodes for 100/100 WCAG 2.2 AA & axe-core
 *   `label-content-name-mismatch` compliance.
 * - The diagonal arrow (↗) follows the wave, sliding up-right out of view while
 *   a secondary arrow enters from bottom-left into position.
 * - Supports outline (Concept 2 / Image 2 reference) and solid luxury obsidian.
 */
export default function AnimatedButton({
  text = 'Reserve',
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  type = 'button',
}) {
  const isPrimary = variant === 'primary'
  const isOutline = variant === 'outline'

  const baseStyles = isOutline
    ? 'bg-transparent hover:bg-slate-900 text-slate-900 hover:text-[#FAF8F5] border-slate-900'
    : isPrimary
    ? 'bg-slate-900 hover:bg-emerald-950 text-[#FAF8F5] border-slate-900'
    : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-300'

  const sizeStyles = {
    xs: 'h-7 px-3 text-[10px] tracking-[0.2em]',
    sm: 'h-9 px-3.5 sm:px-4 text-[11px] sm:text-xs tracking-[0.2em]',
    md: 'px-5 py-3 text-[10px] tracking-[0.2em]',
  }[size] || 'px-5 py-3 text-[10px] tracking-[0.2em]'

  const letters = Array.from(text)

  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={text}
      title={text}
      className={`group relative inline-flex items-center justify-center border font-mono uppercase font-bold overflow-hidden cursor-pointer active:scale-[0.97] transition-all duration-300 shadow-xs rounded-[2px] ${sizeStyles} ${baseStyles} ${className}`}
    >
      {/* 1. Staggered Cascading Wave Text (Single DOM Text Node per Character) */}
      <span className="relative inline-flex items-center select-none overflow-hidden h-[1.3em] leading-tight">
        {letters.map((char, index) => {
          const delayMs = index * 40
          const displayChar = char === ' ' ? '\u00A0' : char

          return (
            <span
              key={index}
              data-char={displayChar}
              className={`kinetic-letter ${index < letters.length - 1 ? 'mr-[0.16em]' : ''}`}
              style={{
                '--stagger': `${delayMs}ms`,
              }}
            >
              <span className="kinetic-primary">
                {displayChar}
              </span>
            </span>
          )
        })}
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
          className="w-3 h-3 transition-transform duration-[550ms] ease-[cubic-bezier(0.52,0,0,1)] group-hover:translate-x-full group-hover:-translate-y-full will-change-transform"
          style={{
            transitionDelay: `${letters.length * 40}ms`,
          }}
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
          className="w-3 h-3 absolute top-0 left-0 transition-all duration-[550ms] ease-[cubic-bezier(0.52,0,0,1)] -translate-x-full translate-y-full group-hover:translate-x-0 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 will-change-transform"
          style={{
            transitionDelay: `${letters.length * 40}ms`,
          }}
        >
          <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" />
        </svg>
      </span>
    </button>
  )
}
