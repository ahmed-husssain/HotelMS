import React from 'react'

/**
 * AnimatedButton
 * 
 * Signature ultra-luxury staggered kinetic wave button:
 * - Each letter of the word rolls upward sequentially (one by one) with a staggered
 *   micro-delay, creating a mesmerizing cascading ripple / wave burst across the word.
 * - The diagonal arrow (↗) follows the wave, sliding up-right out of view while
 *   a secondary arrow enters from bottom-left into position.
 * - Powered by exponential deceleration easing cubic-bezier(0.16, 1, 0.3, 1) at 120 FPS.
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

  const baseStyles = isPrimary
    ? 'bg-slate-900 hover:bg-emerald-950 text-[#FAF8F5] border-slate-900'
    : isOutline
    ? 'bg-transparent hover:bg-slate-900 text-slate-900 hover:text-[#FAF8F5] border-slate-900'
    : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-300'

  const sizeStyles = {
    xs: 'h-7 px-3 text-[10px]',
    sm: 'h-9 px-3.5 sm:px-4 text-[11px] sm:text-xs',
    md: 'px-5 py-3 text-[10px]',
  }[size] || 'px-5 py-3 text-[10px]'

  const letters = Array.from(text)

  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={text}
      title={text}
      className={`group relative inline-flex items-center justify-center border font-mono uppercase font-bold overflow-hidden cursor-pointer active:scale-[0.97] transition-all duration-300 shadow-xs rounded-[2px] ${sizeStyles} ${baseStyles} ${className}`}
    >
      {/* Accessible text for screen readers & AI agent tree resolution */}
      <span className="sr-only">{text}</span>

      {/* 1. Staggered Cascading Wave Text (Letter by Letter - Visual Only) */}
      <span aria-hidden="true" className="relative inline-flex items-center select-none overflow-hidden h-[1.3em] leading-tight">
        {letters.map((char, index) => {
          // Delay each letter by 32ms for a fluid, slow, cascading wave
          const delayMs = index * 32

          return (
            <span
              key={index}
              className={`relative inline-block overflow-hidden align-top will-change-transform ${
                index < letters.length - 1 ? 'mr-[0.18em]' : ''
              }`}
              style={{ height: '1.25em' }}
            >
              {/* Invisible layout placeholder for exact glyph metrics */}
              <span className="invisible">{char === ' ' ? '\u00A0' : char}</span>

              {/* Primary character: lifts up and out to -125% */}
              <span
                aria-hidden="true"
                className="absolute top-0 left-0 inline-block will-change-transform select-none transition-transform duration-[520ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[125%]"
                style={{
                  transitionDelay: `${delayMs}ms`,
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>

              {/* Duplicate character: rolls in from +125% below to 0% */}
              <span
                aria-hidden="true"
                className="absolute top-0 left-0 inline-block will-change-transform select-none transition-transform duration-[520ms] ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-[125%] group-hover:translate-y-0"
                style={{
                  transitionDelay: `${delayMs}ms`,
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            </span>
          )
        })}
      </span>

      {/* 2. Dual Diagonal Rolling Arrow Aperture (Completes the Wave) */}
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
          className="w-3 h-3 transition-transform duration-[500ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-full group-hover:-translate-y-full will-change-transform"
          style={{
            transitionDelay: `${letters.length * 30}ms`,
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
          className="w-3 h-3 absolute top-0 left-0 transition-transform duration-[500ms] ease-[cubic-bezier(0.16,1,0.3,1)] -translate-x-full translate-y-full group-hover:translate-x-0 group-hover:translate-y-0 will-change-transform"
          style={{
            transitionDelay: `${letters.length * 30}ms`,
          }}
        >
          <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" />
        </svg>
      </span>
    </button>
  )
}
