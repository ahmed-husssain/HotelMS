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
function CharacterRoll({ char, index, isRolled, active = true }) {
  const delay = `${index * 12}ms`
  const transition = isRolled && active
    ? `transform 0.45s cubic-bezier(0.52, 0, 0, 1) ${delay}`
    : 'none'

  return (
    <span className="inline-block relative overflow-hidden align-top select-none" style={{ height: '1.2em' }}>
      <span className="invisible">{char === ' ' ? '\u00A0' : char}</span>
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 inline-block will-change-transform select-none"
        style={{
          transform: isRolled && active ? 'translateY(-100%)' : 'translateY(0%)',
          transition,
        }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 inline-block will-change-transform select-none"
        style={{
          transform: isRolled && active ? 'translateY(0%)' : 'translateY(100%)',
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
function ArrowRoll({ isRolled, charCount, active = true }) {
  const delay = `${charCount * 12 + 20}ms`
  const transition = isRolled && active
    ? `transform 0.45s cubic-bezier(0.52, 0, 0, 1) ${delay}`
    : 'none'

  return (
    <span className="relative block overflow-hidden w-[12px] h-[12px] shrink-0">
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 block will-change-transform"
        style={{
          transform: isRolled && active ? 'translate(11px, -11px)' : 'translate(0px, 0px)',
          transition,
        }}
      >
        <CasaMomoArrow />
      </span>
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 block will-change-transform"
        style={{
          transform: isRolled && active ? 'translate(0px, 0px)' : 'translate(-11px, 11px)',
          transition,
        }}
      >
        <CasaMomoArrow />
      </span>
    </span>
  )
}

/**
 * CardHoverPill
 * 
 * Signature monolithic floating pill that activates ONLY when hovering
 * over project cards & suite showcases marked with [data-cursor].
 * 
 * Never overrides or hides the native OS cursor.
 * Zero interference with buttons, links, or text inputs.
 */
export default function CardHoverPill() {
  const pillRef = useRef(null)
  const posRef = useRef({ x: -100, y: -100, activeCard: null })

  const [isVisible, setIsVisible] = useState(false)
  const [label, setLabel] = useState('Suite Details')
  const [isRolled, setIsRolled] = useState(false)

  useEffect(() => {
    // Only enable on desktop/mouse devices
    const isFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!isFine) return

    const pillEl = pillRef.current
    if (!pillEl) return

    const pos = posRef.current

    const onPointerMove = (e) => {
      pos.x = e.clientX
      pos.y = e.clientY
      pillEl.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
    }

    const checkTarget = (target) => {
      if (!target || !(target instanceof Element)) {
        pos.activeCard = null
        setIsVisible(false)
        return
      }

      // Hide if over buttons inside the card (e.g. carousel arrows) or interactive controls
      if (target.closest('button, [data-cursor-hide], [data-no-cursor], input')) {
        pos.activeCard = null
        setIsVisible(false)
        return
      }

      // Check for card with data-cursor attribute
      const card = target.closest('[data-cursor]')
      if (card) {
        if (pos.activeCard !== card) {
          pos.activeCard = card
          const text = card.getAttribute('data-cursor') || 'Suite Details'
          setLabel(text)
          setIsVisible(true)
          setIsRolled(false)
          setTimeout(() => setIsRolled(true), 25)
        }
      } else {
        pos.activeCard = null
        setIsVisible(false)
      }
    }

    const onPointerOver = (e) => {
      checkTarget(e.target)
    }

    const onPointerOut = (e) => {
      if (!e.relatedTarget) {
        pos.activeCard = null
        setIsVisible(false)
      }
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerover', onPointerOver, { passive: true })
    window.addEventListener('pointerout', onPointerOut, { passive: true })

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerover', onPointerOver)
      window.removeEventListener('pointerout', onPointerOut)
    }
  }, [])

  return (
    <div
      ref={pillRef}
      className="fixed top-0 left-0 pointer-events-none z-[999999] will-change-transform select-none"
      style={{ transform: 'translate3d(-100px, -100px, 0)' }}
    >
      <div
        className={`px-3.5 py-1.5 rounded-[2px] bg-slate-900/95 border border-slate-700/60 shadow-xl backdrop-blur-md flex items-center justify-center -translate-x-1/2 -translate-y-1/2 will-change-transform transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible
            ? 'opacity-100 scale-100 pointer-events-none'
            : 'opacity-0 scale-50 pointer-events-none'
        }`}
      >
        {/* Kinetic Staggered Wave-Roll Typography */}
        <div className="flex items-center text-[12px] font-medium tracking-tight whitespace-nowrap leading-[1.2em] font-sans-clean text-[#FFF0CA]">
          {Array.from(label).map((char, index) => (
            <CharacterRoll
              key={index}
              char={char}
              index={index}
              isRolled={isRolled}
              active={isVisible}
            />
          ))}
        </div>

        {/* Diagonal Arrow Glyph Roll */}
        <div className="ml-2 flex items-center justify-center">
          <ArrowRoll
            isRolled={isRolled}
            charCount={label.length}
            active={isVisible}
          />
        </div>
      </div>
    </div>
  )
}
