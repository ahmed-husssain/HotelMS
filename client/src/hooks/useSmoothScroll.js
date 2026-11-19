import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

gsap.registerPlugin(ScrollTrigger)

/**
 * useSmoothScroll — Enterprise High-Performance Scroll Authority
 * 
 * VIVA & ARCHITECTURAL DEFENSE:
 * 1. Hardware Segregation (Native on Mobile, Smooth on Desktop):
 *    - Mobile Phones & Tablets: Emulating touch via JS creates lag and battery drain.
 *      Touchscreens are bypassed to run on 100% native 120Hz GPU ProMotion scroll.
 *    - Desktop & Laptop: Snappy 0.85s exponential momentum glide for precision mouse wheels.
 * 
 * 2. Zero-Lag Form Isolation & Route Filtering:
 *    - Nested form sheets use 'data-lenis-prevent' to eliminate input latency.
 *    - Front-Desk Staff PMS (/pms) runs at 100% raw native speed for cashier efficiency.
 * 
 * 3. Accessibility & Frame Locking:
 *    - Bypasses virtual scroll if user has 'prefers-reduced-motion: reduce'.
 *    - Direct GSAP ticker binding eliminates micro-stutters and layout reflow.
 */
export function useSmoothScroll() {
  const location = useLocation()
  const lenisRef = useRef(null)

  useEffect(() => {
    // 1. Accessibility Guard: Respect user reduced-motion OS preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    // 2. Hardware Guard: Never emulate touch on mobile/tablet (uses 100% native 120Hz GPU scroll)
    const isTouchDevice = window.matchMedia('(pointer: coarse), (hover: none)').matches
    if (isTouchDevice) return

    // 3. Route Guard: Smooth virtual scroll runs ONLY on marketing showcase pages ('/', '/rooms', '/suites', '/residences').
    // All operational terminals, portals, forms, and modals run at 100% native browser speed.
    const isMarketingPage = ['/', '/suites', '/residences', '/rooms'].includes(location.pathname)
    if (!isMarketingPage) return

    // 4. Initialize Lenis with snappy, non-sluggish luxury physics (0.85s duration)
    const lenis = new Lenis({
      duration: 0.85, // Snappy & brisk; eliminates the "sluggish/heavy" feeling
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential deceleration
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95, // Smooth trackpad dampening
      touchMultiplier: 0,    // 0% touch hijacking
      autoRaf: false,        // GSAP ticker drives the render loop for 120 FPS sync
      allowNestedScroll: true, // Allow native scroll inside nested scrollable panes
      prevent: (node) => {
        if (!node || typeof node.closest !== 'function') return false

        // 1. Any element explicitly marked with data-lenis-prevent
        if (node.closest('[data-lenis-prevent]')) return true

        // 2. Any modal dialog, drawer, bottom sheet or fixed overlay
        if (node.closest('[role="dialog"], [aria-modal="true"], .fixed.z-50, .fixed.z-40')) return true

        // 3. Any element inside an ancestor with scrollable overflow
        let el = node
        while (el && el !== document.body && el !== document.documentElement) {
          if (el instanceof HTMLElement) {
            const overflowY = window.getComputedStyle(el).overflowY
            if (['auto', 'scroll'].includes(overflowY) && el.scrollHeight > el.clientHeight) {
              return true
            }
          }
          el = el.parentElement
        }

        // 4. Any time document body scroll is locked by a modal
        if (typeof document !== 'undefined' && document.body.style.overflow === 'hidden') {
          return true
        }

        return false
      },
    })

    lenisRef.current = lenis

    // 5. Connect Lenis scroll updates to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    // 6. Frame-locked synchronization on GSAP ticker
    const tickerCallback = (time) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tickerCallback)

    return () => {
      gsap.ticker.remove(tickerCallback)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [location.pathname])

  // Reset scroll to top cleanly on route navigation
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
  }, [location.pathname])
}
