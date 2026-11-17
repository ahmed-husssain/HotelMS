import React, { useEffect, useRef, useState } from 'react'

/**
 * CasaMomoArrow
 * Exact SVG vector extracted from casamomo.at production bundle
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
       * Exact Casa Momo character staggered wave-roll (ScrollRadius.CU3IUbFx.mjs)
       * Duration: 0.70s, Easing: cubic-bezier(0.52, 0, 0, 1), Stagger: 10ms per char
       * Instant reset with transition: 'none' when rolled is false
       */
      function CharacterRoll({char, index, isRolled}) {
      const delay = `${index * 10}ms`
      const transition = isRolled
      ? `transform 0.7s cubic-bezier(0.52, 0, 0, 1) ${delay}`
      : 'none'

      return (
        <span className="inline-block relative overflow-hidden align-top select-none" style={{ height: '1.2em' }}>
          {/* Sizer to hold font metrics */}
          <span className="invisible">{char === ' ' ? '\u00A0' : char}</span>

          {/* Primary character (exits to -100% on roll) */}
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

          {/* Secondary character (enters from 100% to 0% on roll) */}
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
         * Exact Casa Momo dual-arrow diagonal kinetic translation
         * Arrow 1: (0, 0) -> (11px, -11px)
         * Arrow 2: (-11px, 11px) -> (0, 0)
         * Duration: 0.70s, Easing: cubic-bezier(0.52, 0, 0, 1)
         */
        function ArrowRoll({isRolled, charCount}) {
        const delay = `${charCount * 10 + 20}ms`
        const transition = isRolled
        ? `transform 0.7s cubic-bezier(0.52, 0, 0, 1) ${delay}`
        : 'none'

        return (
          <span className="relative block overflow-hidden w-[12px] h-[12px] shrink-0">
            {/* Primary arrow exiting to top-right */}
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

            {/* Secondary arrow entering from bottom-left */}
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
           * CustomCursor — Complete Casa Momo Architecture
           */
          export default function CustomCursor() {
  const cursorRef = useRef(null)

          const coordsRef = useRef({
            targetX: -100,
          targetY: -100,
          currentX: -100,
          currentY: -100,
          hasMoved: false,
          activeCard: null,
  })

          const [active, setActive] = useState(false)
          const [label, setLabel] = useState('Apartment Details')
          const [isRolled, setIsRolled] = useState(false)
          const [isFinePointer, setIsFinePointer] = useState(false)

  useEffect(() => {
    // Mobile / Touch guard
    const isFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    setIsFinePointer(isFine)
    if (!isFine) return

          const cursorEl = cursorRef.current
          if (!cursorEl) return

          const coords = coordsRef.current
          let animId

    // 120 FPS requestAnimationFrame Loop (0.24 spring factor)
    const loop = () => {
            coords.currentX += (coords.targetX - coords.currentX) * 0.24
      coords.currentY += (coords.targetY - coords.currentY) * 0.24

          if (cursorEl && coords.hasMoved) {
            cursorEl.style.transform = `translate3d(${coords.currentX}px, ${coords.currentY}px, 0) translate(-50%, -50%)`
          }

          animId = requestAnimationFrame(loop)
    }
          animId = requestAnimationFrame(loop)

    // Element checker with interactive button exclusion for smooth transitions
    const checkTarget = (target) => {
      if (!target) return

          // If hovering over an interactive control (carousel arrow button, link, close button):
          // Smoothly collapse and hide the floating pill so the button can be interacted with cleanly!
          const buttonOrAction = target.closest('button, a, [role="button"], [data-cursor-hide], [data-no-cursor]')
          if (buttonOrAction) {
            coords.activeCard = null
        setActive(false)
          setIsRolled(false)
          return
      }

          const card = target.closest('[data-cursor]')
          if (card) {
        const text = card.getAttribute('data-cursor') || 'Apartment Details'
          if (coords.activeCard !== card) {
            coords.activeCard = card
          setLabel(text)
          setActive(true)
          // Trigger the wave roll
          setIsRolled(false)
          setTimeout(() => setIsRolled(true), 30)
        }
      } else {
            coords.activeCard = null
        setActive(false)
          setIsRolled(false)
      }
    }

    const onPointerMove = (e) => {
      if (!coords.hasMoved) {
            coords.currentX = e.clientX
        coords.currentY = e.clientY
          coords.hasMoved = true
      }
          coords.targetX = e.clientX
          coords.targetY = e.clientY
          checkTarget(e.target)
    }

    const onPointerOver = (e) => {
      if (!coords.hasMoved) {
            coords.currentX = e.clientX
        coords.currentY = e.clientY
          coords.hasMoved = true
      }
          coords.targetX = e.clientX
          coords.targetY = e.clientY
          checkTarget(e.target)
    }

    const onScroll = () => {
      if (coords.targetX >= 0 && coords.targetY >= 0) {
        const el = document.elementFromPoint(coords.targetX, coords.targetY)
          checkTarget(el)
      }
    }

    const onMouseLeave = (e) => {
      if (!e.relatedTarget) {
            setActive(false)
        setIsRolled(false)
          coords.activeCard = null
      }
    }

          window.addEventListener('pointermove', onPointerMove, {passive: true })
          window.addEventListener('pointerover', onPointerOver, {passive: true })
          window.addEventListener('scroll', onScroll, {passive: true, capture: true })
          document.addEventListener('mouseleave', onMouseLeave)

    return () => {
            window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerover', onPointerOver)
          window.removeEventListener('scroll', onScroll, {capture: true })
          document.removeEventListener('mouseleave', onMouseLeave)
          cancelAnimationFrame(animId)
    }
  }, [])

  if (!isFinePointer) return null

  return (
    <div
      ref={cursorRef}
      className="custom-cursor-root fixed top-0 left-0 pointer-events-none z-[99999] will-change-transform select-none hidden md:block"
      style={{ left: 0, top: 0 }}
    >
            {/* 1. Default Resting Dot (Empty canvas) with mix-blend difference */}
            <div
        className={`w-2.5 h-2.5 rounded-full bg-[#FFF0CA] transition-all duration-300 ease-[cubic-bezier(0.52,0,0,1)] ${active ? 'opacity-0 scale-0' : 'opacity-85 scale-100 shadow-xs'
                }`}
              style={{ mixBlendMode: 'difference' }}
            />

            {/* 2. Expanded Floating Pill Capsule (Exact Casa Momo 2px border radius) */}
            <div
              className={`absolute top-0 left-0 px-3 py-1.5 rounded-[2px] bg-slate-900/90 border border-slate-700/50 backdrop-blur-md flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                active
                  ? 'opacity-100 scale-100 translate-y-0 pointer-events-none'
                  : 'opacity-0 scale-75 pointer-events-none'
              }`}
            >
        {/* Kinetic Staggered Wave-Roll Typography */}
        <div className="flex items-center text-[15px] font-medium tracking-[-0.01em] whitespace-nowrap leading-[1.2em] font-sans-clean text-[#FFF0CA]">
          {Array.from(label).map((char, index) => (
            <CharacterRoll
              key={index}
              char={char}
              index={index}
              isRolled={isRolled}
            />
          ))}
        </div>

        {/* Casa Momo Diagonal Arrow Glyph Roll */}
        <div className="ml-[6px] flex items-center justify-center">
          <ArrowRoll
            isRolled={isRolled}
            charCount={label.length}
          />
        </div>
      </div>
    </div>
  )
}
