import React, { useEffect, useRef, useState } from 'react'

/**
 * CasaMomoArrow
 * Exact SVG vector for diagonal kinetic expansion
 */
function CasaMomoArrow() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-[#FFF0CA]">
      <path
        d="M4 1V2H6.98C7.83 2 8.26 3.03 7.66 3.63L1 10.29L1.71 11L8.37 4.34C8.97 3.74 10 4.16 10 5.02V8H11V1H4Z"
        fill="currentColor"
      />
    </svg>
  )
}

/**
 * CharacterRoll
 * Kinetic character staggered wave-roll with cubic-bezier easing
 */
function CharacterRoll({ char, index, isRolled }) {
  const delay = `${index * 12}ms`
  const transition = isRolled
    ? `transform 0.65s cubic-bezier(0.52, 0, 0, 1) ${delay}`
    : 'none'

  return (
    <span className="inline-block relative overflow-hidden align-top select-none" style={{ height: '1.2em' }}>
      <span className="invisible">{char === ' ' ? '\u00A0' : char}</span>
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 inline-block will-change-transform select-none"
        style={{
          transform: isRolled ? 'translateY(-100%)' : 'translateY(0%)',
          transition,
        }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 inline-block will-change-transform select-none"
        style={{
          transform: isRolled ? 'translateY(0%)' : 'translateY(100%)',
          transition,
        }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    </span>
  )
}

/**
 * ArrowRoll
 * Kinetic dual-arrow diagonal translation
 */
function ArrowRoll({ isRolled, charCount }) {
  const delay = `${charCount * 12 + 20}ms`
  const transition = isRolled
    ? `transform 0.65s cubic-bezier(0.52, 0, 0, 1) ${delay}`
    : 'none'

  return (
    <span className="relative block overflow-hidden w-[12px] h-[12px] shrink-0">
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 block will-change-transform"
        style={{
          transform: isRolled ? 'translate(11px, -11px)' : 'translate(0px, 0px)',
          transition,
        }}
      >
        <CasaMomoArrow />
      </span>
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 block will-change-transform"
        style={{
          transform: isRolled ? 'translate(0px, 0px)' : 'translate(-11px, 11px)',
          transition,
        }}
      >
        <CasaMomoArrow />
      </span>
    </span>
  )
}

/**
 * Concept 3: Quiet Luxury Minimal Cursor (Subtle Soft Halo)
 * 
 * Features:
 * - Single unified dot (zero outer detached rings, zero lag)
 * - 28px soft translucent whisper halo over links & buttons
 * - Immediate auto-detection on scroll via document.elementFromPoint
 * - Suite photo cards seamlessly bloom into Suite Details ↗ pill
 * - Form inputs gracefully restore native I-beam typing
 */
export default function CustomCursor() {
  const rootRef = useRef(null)
  const dotRef = useRef(null)
  const pillRef = useRef(null)

  const posRef = useRef({
    x: -100,
    y: -100,
    hasMoved: false,
    activeCard: null,
  })

  const [cursorMode, setCursorMode] = useState('default') // 'default' | 'link' | 'card' | 'input' | 'button'
  const [cardLabel, setCardLabel] = useState('Suite Details')
  const [isRolled, setIsRolled] = useState(false)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    // Check if the device has a mouse/fine pointer
    const isFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!isFine) {
      document.documentElement.classList.remove('has-custom-cursor')
      return
    }

    const rootEl = rootRef.current
    if (!rootEl) return

    const pos = posRef.current

    // Unified target classifier
    const detectTarget = (target) => {
      if (!target || !(target instanceof Element)) {
        pos.activeCard = null
        setCursorMode('default')
        return
      }

      // 1. Text input / textarea: Hide custom cursor for clean typing
      if (target.closest('input, textarea, [contenteditable="true"]')) {
        pos.activeCard = null
        setCursorMode('input')
        return
      }

      // 2. Buttons inside cards (e.g. carousel < > arrows) & interactive buttons: High-visibility luxury ring
      if (target.closest('button, [data-cursor-hide], [data-no-cursor]')) {
        pos.activeCard = null
        setCursorMode('button')
        return
      }

      // 3. Suite / Project Cards: Signature Casa Momo Pill
      const card = target.closest('[data-cursor]')
      if (card) {
        if (pos.activeCard !== card) {
          pos.activeCard = card
          const text = card.getAttribute('data-cursor') || 'Suite Details'
          setCardLabel(text)
          setCursorMode('card')
          setIsRolled(false)
          setTimeout(() => setIsRolled(true), 25)
        }
        return
      }

      pos.activeCard = null

      // 4. Clickable Links, Buttons & Menu triggers across the site
      if (target.closest('a, [role="button"], .cursor-pointer, select')) {
        setCursorMode('link')
        return
      }

      // 5. Default canvas
      setCursorMode('default')
    }

    // Direct 1-to-1 immediate mouse follow (0 latency, impossible to detach)
    const onPointerMove = (e) => {
      pos.x = e.clientX
      pos.y = e.clientY
      if (!pos.hasMoved) {
        pos.hasMoved = true
        document.documentElement.classList.add('has-custom-cursor')
        setIsActive(true)
      }
      rootEl.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
    }

    // Boundary-triggered element detection on hover
    const onPointerOver = (e) => {
      detectTarget(e.target)
    }

    const onPointerOut = (e) => {
      if (!e.relatedTarget) {
        pos.activeCard = null
        setCursorMode('default')
      }
    }

    // Real-time scroll detection throttled with RAF (eliminates forced reflows during scroll)
    let scrollRaf = null
    const onScroll = () => {
      if (!pos.hasMoved || pos.x < 0 || pos.y < 0) return
      if (scrollRaf) return
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = null
        const elementUnderMouse = document.elementFromPoint(pos.x, pos.y)
        detectTarget(elementUnderMouse)
      })
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerover', onPointerOver, { passive: true })
    window.addEventListener('pointerout', onPointerOut, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true, capture: true })

    return () => {
      if (scrollRaf) cancelAnimationFrame(scrollRaf)
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerover', onPointerOver)
      window.removeEventListener('pointerout', onPointerOut)
      window.removeEventListener('scroll', onScroll, { capture: true })
    }
  }, [])

  const isInput = cursorMode === 'input'
  const isLink = cursorMode === 'link'
  const isCard = cursorMode === 'card'

  return (
    <div
      ref={rootRef}
      className={`custom-cursor-container fixed top-0 left-0 pointer-events-none z-[999999] will-change-transform select-none ${
        isActive ? 'block' : 'hidden'
      }`}
      style={{ transform: 'translate3d(-100px, -100px, 0)' }}
    >
      {/* ============================================================== */}
      {/* 1. SINGLE UNIFIED QUIET LUXURY DOT / SOFT HALO */}
      {/* ============================================================== */}
      <div
        ref={dotRef}
        className={`will-change-transform rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isInput || isCard ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
        } ${
          isLink
            ? 'w-7 h-7 bg-[#121619]/15 border border-[#121619]/20'
            : 'w-2 h-2 bg-[#121619]'
        }`}
      />

      {/* ============================================================== */}
      {/* 2. SIGNATURE MONOLITHIC SUITE PILL (OVER ROOM CARDS) */}
      {/* ============================================================== */}
      <div
        ref={pillRef}
        className={`absolute top-0 left-0 px-3.5 py-1.5 rounded-[2px] bg-slate-900/95 border border-slate-700/60 shadow-xl backdrop-blur-md flex items-center justify-center -translate-x-1/2 -translate-y-1/2 will-change-transform transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isCard
            ? 'opacity-100 scale-100 pointer-events-none'
            : 'opacity-0 scale-75 pointer-events-none'
        }`}
      >
        {/* Kinetic Staggered Wave-Roll Typography */}
        <div className="flex items-center text-[12px] font-medium tracking-tight whitespace-nowrap leading-[1.2em] font-sans-clean text-[#FFF0CA]">
          {Array.from(cardLabel).map((char, index) => (
            <CharacterRoll
              key={index}
              char={char}
              index={index}
              isRolled={isRolled}
            />
          ))}
        </div>

        {/* Diagonal Arrow Glyph Roll */}
        <div className="ml-2 flex items-center justify-center">
          <ArrowRoll
            isRolled={isRolled}
            charCount={cardLabel.length}
          />
        </div>
      </div>
    </div>
  )
}
