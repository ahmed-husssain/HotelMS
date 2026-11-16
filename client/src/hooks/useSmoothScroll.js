import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useEffect } from 'react'

gsap.registerPlugin(ScrollTrigger)

/**
 * useSmoothScroll
 * Establishes a single scroll authority linking Lenis virtual momentum scroll
 * to GSAP's requestAnimationFrame ticker for stutter-free 120 FPS parallax.
 */
export function useSmoothScroll() {
  useEffect(() => {
    // 1. Initialize Lenis with exponential luxury easing
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    })

    // 2. Feed Lenis scroll updates into GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    // 3. Bind Lenis to GSAP ticker for frame-locked synchronization
    const tickerCallback = (time) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tickerCallback)
    gsap.ticker.lagSmoothing(0)

    // Cleanup on unmount
    return () => {
      gsap.ticker.remove(tickerCallback)
      lenis.destroy()
    }
  }, [])
}
