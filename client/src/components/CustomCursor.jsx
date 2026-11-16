import React, { useEffect, useState } from 'react'

/**
 * CustomCursor
 * Minimal architectural cursor follower inspired by ahmedev.web.app.
 * Glides smoothly behind pointer coordinates. Expands into an interactive
 * capsule with dynamic context labels (e.g. "DRAG" or "VIEW") over cards.
 */
export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [cursorText, setCursorText] = useState('')
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only enable on desktop pointer devices
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!isFinePointer) return

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })
      if (!isVisible) setIsVisible(true)

      // Check if target or parent has data-cursor attributes
      const target = e.target.closest('[data-cursor-text]')
      if (target) {
        setCursorText(target.getAttribute('data-cursor-text') || '')
        setIsHovered(true)
      } else {
        const isClickable = e.target.closest('button, a, input, select')
        if (isClickable) {
          setCursorText('')
          setIsHovered(true)
        } else {
          setCursorText('')
          setIsHovered(false)
        }
      }
    }

    const handleMouseLeave = () => setIsVisible(false)

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div
      className="pointer-events-none fixed z-50 transition-transform duration-75 ease-out"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        left: 0,
        top: 0,
      }}
    >
      {cursorText ? (
        // Expanded Drag / Explore Capsule
        <div className="relative -top-4 -left-12 px-3 py-1 bg-slate-900/90 text-white text-[9px] font-mono tracking-[0.2em] uppercase rounded-full backdrop-blur-xs border border-white/20 shadow-lg flex items-center justify-center whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
          {cursorText}
        </div>
      ) : (
        // Minimal Hairline Follower Dot
        <div
          className={`w-3.5 h-3.5 -top-1.5 -left-1.5 rounded-full border border-slate-900/80 transition-all duration-200 ${
            isHovered ? 'scale-150 bg-slate-900/20' : 'bg-slate-900/40'
          }`}
        />
      )}
    </div>
  )
}
