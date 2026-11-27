import useEmblaCarousel from 'embla-carousel-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import AnimatedButton from './AnimatedButton'
import { getOptimizedImageUrl, getResponsiveSrcSet } from '../utils/cloudinary'

/**
 * CasaMomoSlideArrow
 * Exact arrow geometry extracted from casamomo.at (ParallaxImage.B0Hj84BA.mjs)
 */
function CasaMomoSlideArrow({ left = false }) {
  return (
    <svg
      width="14"
      height="12"
      viewBox="0 0 14 12"
      fill="none"
      aria-hidden="true"
      className={`text-[#FFF0CA] block transition-transform duration-200 ${left ? 'rotate-180' : ''
        }`}
    >
      <path
        d="M14,6l-4.9,4.9-.7-.7,2.1-2.1c.6-.6.2-1.6-.7-1.6H0v-1h9.8c.8,0,1.3-1,.7-1.6l-2.1-2.1.7-.7,4.9,4.9Z"
        fill="currentColor"
      />
    </svg>
  )
}

/**
 * CarouselSlide — High-Performance JIT Slide with LQIP Blur-Up & Loading Feedback
 */
function CarouselSlide({ photo, residenceName, isEager, shouldLoad = true }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const imgRef = useRef(null)

  const optimizedSrc = getOptimizedImageUrl(photo.url, { width: 1400 })
  const responsiveSrcSet = getResponsiveSrcSet(photo.url, [600, 1000, 1400, 1920])
  const lqipSrc = getOptimizedImageUrl(photo.url, { lqip: true })

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setIsLoaded(true)
    }
  }, [optimizedSrc])

  return (
    <div className="flex-[0_0_100%] min-w-0 relative w-full h-full overflow-hidden bg-slate-900 select-none">
      {/* 1. Instant ~400-byte Blurred Silhouette (LQIP) */}
      {lqipSrc && (
        <img
          src={lqipSrc}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover object-center filter blur-lg scale-110 pointer-events-none transition-opacity duration-700 ${
            isLoaded ? 'opacity-0' : 'opacity-60'
          }`}
        />
      )}

      {/* 2. Minimalist "Loading..." feedback during active download */}
      {!isLoaded && shouldLoad && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-[2px] z-10 transition-opacity duration-300">
          <span className="text-[#FFF0CA] font-mono text-xs tracking-[0.25em] uppercase animate-pulse select-none">
            Loading...
          </span>
        </div>
      )}

      {/* 3. Deferred High-Res Image with Responsive SrcSet */}
      {shouldLoad && (
        <img
          ref={imgRef}
          src={optimizedSrc}
          srcSet={responsiveSrcSet}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 95vw, 1280px"
          alt={`${residenceName} - ${photo.title}`}
          width="1400"
          height="788"
          loading={isEager ? 'eager' : 'lazy'}
          fetchPriority={isEager ? 'high' : 'auto'}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={`relative z-[5] w-full h-full object-cover object-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-[1.015] ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  )
}

export default function RoomsCarousel({ residence, index, onReserve, onOpenSpecs }) {
  const containerRef = useRef(null)

  // 1. 70% Viewport Visibility Tracker (Card must be >= 70% visible to activate carousel)
  const [isVisible70, setIsVisible70] = useState(index === 0)
  const [shouldInitCarousel, setShouldInitCarousel] = useState(index === 0)

  // JIT Image Deferral: Load Slide 0 immediately; fetch remaining slides on engagement
  const [isEngaged, setIsEngaged] = useState(false)

  const markEngaged = useCallback(() => {
    setIsEngaged(true)
  }, [])

  // 2. IntersectionObserver strictly tracking 70% visibility threshold
  useEffect(() => {
    const el = containerRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsVisible70(true)
      setShouldInitCarousel(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return

        // Check if at least 70% of the suite card is visible in the viewport
        const meetsThreshold = entry.isIntersecting && entry.intersectionRatio >= 0.7
        setIsVisible70(meetsThreshold)

        // Initialize Embla engine once card enters near-viewport
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
          setShouldInitCarousel(true)
        }
      },
      {
        threshold: [0, 0.35, 0.7, 1.0],
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Idle prefetch: When card is 70% visible for 1s, quietly load remaining slides
  useEffect(() => {
    if (!isVisible70 || isEngaged) return
    const timer = setTimeout(() => {
      setIsEngaged(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [isVisible70, isEngaged])

  // 3. Magnetic Focus Handler:
  // If user attempts to interact while card is partially visible (< 70%),
  // smoothly glide the card into center view to immediately unlock the carousel
  const handleMagneticFocus = useCallback(
    (e) => {
      if (!isVisible70) {
        if (e && e.preventDefault) {
          e.preventDefault()
          e.stopPropagation()
        }
        containerRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }
    },
    [isVisible70]
  )

  // 4. Ultra-Premium Embla Carousel Engine
  // Gestures (watchDrag) are strictly enabled ONLY when visible >= 70%
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 35,
    skipSnaps: false,
    dragFree: false,
    watchDrag: isVisible70,
  })

  // Synchronize Embla drag-lock dynamically when visibility crosses 70%
  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit({ watchDrag: isVisible70 })
    }
  }, [emblaApi, isVisible70])

  const [selectedIndex, setSelectedIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    onSelect()
  }, [emblaApi, onSelect])

  const scrollPrev = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      if (!isVisible70) {
        handleMagneticFocus(e)
        return
      }
      setIsEngaged(true)
      if (emblaApi) emblaApi.scrollPrev()
    },
    [emblaApi, isVisible70, handleMagneticFocus]
  )

  const scrollNext = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      if (!isVisible70) {
        handleMagneticFocus(e)
        return
      }
      setIsEngaged(true)
      if (emblaApi) emblaApi.scrollNext()
    },
    [emblaApi, isVisible70, handleMagneticFocus]
  )

  // Simple, elegant branch label without jargon (Fix 2)
  const branchLabel = useMemo(() => {
    const locMap = {
      'sindh-coast': 'Sindh Coast',
      hunza: 'Hunza Valley',
      lahore: 'Lahore Estate',
      murree: 'Murree Pines',
    }
    return locMap[residence.locationId] || residence.city?.split(',')[0] || 'Sanctuary'
  }, [residence.locationId, residence.city])

  const gallery = residence.gallery && residence.gallery.length > 0
    ? residence.gallery
    : [{ title: residence.name, tag: 'OVERVIEW', url: residence.mainImage }]

  return (
    <article
      ref={containerRef}
      onMouseEnter={markEngaged}
      onTouchStart={markEngaged}
      className="group/card relative w-full py-4 sm:py-6 transition-all duration-500"
    >
      {/* 1. Main Architectural Cinema Stage with Integrated Lower-Third Editorial Interface */}
      <div
        data-cursor={isVisible70 ? 'Swipe Gallery' : 'Scroll to Focus'}
        className="relative w-full aspect-[16/11] sm:aspect-[16/10] lg:aspect-[16/9] min-h-[380px] sm:min-h-[460px] max-h-[82vh] overflow-hidden bg-slate-900 shadow-xl rounded-[2px] select-none"
      >
        {/* Embla Viewport — Covers 100% of the stage for full-bleed touch & swipe */}
        <div ref={shouldInitCarousel ? emblaRef : null} className="absolute inset-0 overflow-hidden w-full h-full">
          <div className="flex w-full h-full touch-pan-y">
            {gallery.map((photo, i) => (
              <CarouselSlide
                key={i}
                photo={photo}
                residenceName={residence.name}
                isEager={index === 0 && i === 0}
                shouldLoad={i === 0 || isEngaged}
              />
            ))}
          </div>
        </div>

        {/* Top Floating Room Emblem */}
        <div className="absolute top-3.5 sm:top-5 inset-x-3.5 sm:inset-x-6 flex items-center justify-between pointer-events-none z-20">
          {/* Room Number Badge — Simple room code and branch location without jargon */}
          <span
            className={`px-3 py-1 bg-[#0E1201]/75 backdrop-blur-md text-[9px] sm:text-[10px] font-mono tracking-[0.18em] font-bold text-[#FFF0CA] uppercase border border-white/10 rounded-[2px] shadow-xs transition-opacity duration-300 ${
              isVisible70 ? 'opacity-100' : 'opacity-40'
            }`}
          >
            SUITE {residence.roomNumber} &bull; {branchLabel}
          </span>

          {/* Minimalist Slide Counter */}
          <span
            className={`px-3 py-1 bg-[#0E1201]/55 backdrop-blur-md text-[9px] sm:text-[10px] font-mono tracking-[0.2em] font-bold text-[#FFF0CA] uppercase border border-white/10 rounded-[2px] shadow-xs transition-opacity duration-300 ${
              isVisible70 ? 'opacity-100' : 'opacity-40'
            }`}
          >
            {String(selectedIndex + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')}
          </span>
        </div>

        {/* Awakening Navigation Arrows (Clickable left & right with 44px+ touch targets) */}
        <div className="absolute inset-y-0 inset-x-2 sm:inset-x-4 flex items-center justify-between pointer-events-none z-20">
          {/* Previous Photo Button */}
          <button
            type="button"
            onClick={scrollPrev}
            data-cursor-hide="true"
            aria-label="Previous photo"
            className={`pointer-events-auto transition-all duration-300 ease-[cubic-bezier(0.52,0,0,1)] w-10 h-10 sm:w-12 sm:h-12 grid place-items-center bg-[#0E1201]/60 hover:bg-[#0E1201]/90 hover:scale-105 active:scale-95 backdrop-blur-md border border-white/20 rounded-[2px] text-[#FAF8F5] shadow-xl cursor-pointer ${
              isVisible70 ? 'opacity-90 sm:opacity-0 sm:group-hover/card:opacity-100' : 'opacity-25 hover:opacity-60'
            }`}
          >
            <CasaMomoSlideArrow left />
          </button>

          {/* Next Photo Button */}
          <button
            type="button"
            onClick={scrollNext}
            data-cursor-hide="true"
            aria-label="Next photo"
            className={`pointer-events-auto transition-all duration-300 ease-[cubic-bezier(0.52,0,0,1)] w-10 h-10 sm:w-12 sm:h-12 grid place-items-center bg-[#0E1201]/60 hover:bg-[#0E1201]/90 hover:scale-105 active:scale-95 backdrop-blur-md border border-white/20 rounded-[2px] text-[#FAF8F5] shadow-xl cursor-pointer ${
              isVisible70 ? 'opacity-90 sm:opacity-0 sm:group-hover/card:opacity-100' : 'opacity-25 hover:opacity-60'
            }`}
          >
            <CasaMomoSlideArrow />
          </button>
        </div>

        {/* Unified Lower-Third Editorial Interface — The Pure Whisper (Clean, Calm, Borderless) */}
        <div className="absolute inset-x-0 bottom-0 z-20 pointer-events-none bg-gradient-to-t from-black/80 via-black/35 to-transparent pt-16 sm:pt-24 pb-5 sm:pb-7 px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-6">
            
            {/* Left: Suite Name & Clean Whisper Specs (No shouting labels) */}
            <div className="space-y-1 sm:space-y-1.5 max-w-2xl">
              <h2 className="font-serif-grand text-2xl sm:text-3xl lg:text-4xl text-white font-normal tracking-tight leading-tight drop-shadow-md">
                {residence.name}
              </h2>

              {/* Single-line Whisper Specs directly on the picture */}
              <div className="flex flex-wrap items-center gap-x-2.5 sm:gap-x-3 gap-y-0.5 text-xs sm:text-sm font-mono text-slate-200 drop-shadow-sm pt-1">
                {residence.specs.slice(0, 4).map((item, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span className="text-white/40 select-none">&bull;</span>}
                    <span>{item.value}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Right: Clean Price & Signature Kinetic Reserve Button */}
            <div className="flex items-center justify-between md:justify-end gap-4 sm:gap-6 shrink-0 pt-1 md:pt-0">
              <div className="text-left md:text-right font-mono">
                <div className="flex items-baseline md:justify-end gap-1.5 text-white">
                  <span className="text-xs text-slate-300 font-medium">PKR</span>
                  <span className="text-2xl sm:text-3xl font-bold text-[#FFF0CA] tracking-tight">
                    {residence.nightlyRate.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-300 font-normal">/ night</span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                {onOpenSpecs && (
                  <button
                    type="button"
                    onClick={() => onOpenSpecs(residence)}
                    className="pointer-events-auto px-2.5 py-1.5 text-xs font-mono tracking-wider uppercase text-slate-300 hover:text-white underline transition-colors cursor-pointer min-h-[44px] flex items-center"
                  >
                    Details
                  </button>
                )}
                <div className="pointer-events-auto">
                  <AnimatedButton
                    text="Book Suite"
                    onClick={() => onReserve(residence)}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Minimal 1px Hairline Progress Track */}
        <div className="absolute bottom-0 inset-x-0 h-[2px] bg-white/20 z-30">
          <div
            className={`h-full bg-[#FAF8F5] transition-all duration-400 ease-[cubic-bezier(0.52,0,0,1)] ${
              isVisible70 ? 'opacity-100' : 'opacity-40'
            }`}
            style={{
              width: `${((selectedIndex + 1) / gallery.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </article>
  )
}
