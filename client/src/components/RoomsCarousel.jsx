import useEmblaCarousel from 'embla-carousel-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import AnimatedButton from './AnimatedButton'
import { getOptimizedImageUrl, getResponsiveSrcSet } from '../utils/cloudinary'

gsap.registerPlugin(ScrollTrigger)

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

  const optimizedSrc = getOptimizedImageUrl(photo.url, { width: 900 })
  const responsiveSrcSet = getResponsiveSrcSet(photo.url, [450, 800, 1200])
  const lqipSrc = getOptimizedImageUrl(photo.url, { lqip: true })

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setIsLoaded(true)
    }
  }, [optimizedSrc])

  return (
    <div className="flex-[0_0_100%] min-w-0 relative w-full h-full overflow-hidden bg-slate-900 select-none">
      {/* 1. Instant ~400-byte Blurred Silhouette (LQIP) — Prevents cold black screen */}
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
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px"
          alt={`${residenceName} - ${photo.title}`}
          width="800"
          height="500"
          loading={isEager ? 'eager' : 'lazy'}
          fetchPriority={isEager ? 'high' : 'auto'}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={`relative z-[5] w-full h-full object-cover object-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-[1.025] ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  )
}

export default function RoomsCarousel({ residence, index, onReserve, onOpenSpecs }) {
  const containerRef = useRef(null)
  const insetImgRef = useRef(null)

  const isReversed = index % 2 !== 0

  // 1. Defer Off-Screen Embla Engine Initialization (Saves ~400ms Main-Thread TBT)
  const [shouldInitCarousel, setShouldInitCarousel] = useState(index === 0)

  // JIT Image Deferral: Load Slide 0 immediately; fetch slides 1-4 on hover, touch, or idle
  const [isEngaged, setIsEngaged] = useState(false)

  const markEngaged = useCallback(() => {
    setIsEngaged(true)
  }, [])

  // Idle prefetch: When card has been visible in viewport for 1.2s, quietly fetch remaining slides
  useEffect(() => {
    if (!shouldInitCarousel || isEngaged) return
    const timer = setTimeout(() => {
      setIsEngaged(true)
    }, 1200)
    return () => clearTimeout(timer)
  }, [shouldInitCarousel, isEngaged])

  useEffect(() => {
    if (shouldInitCarousel) return
    const el = containerRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShouldInitCarousel(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldInitCarousel(true)
          observer.disconnect()
        }
      },
      { rootMargin: '300px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [shouldInitCarousel])

  // Ultra-Premium Embla Carousel Engine
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 35, // Smooth, cinematic transition duration matching luxury editorial sites
    skipSnaps: false,
    dragFree: false,
  })

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
      setIsEngaged(true)
      if (emblaApi) emblaApi.scrollPrev()
    },
    [emblaApi]
  )

  const scrollNext = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      setIsEngaged(true)
      if (emblaApi) emblaApi.scrollNext()
    },
    [emblaApi]
  )

  // 2. GSAP Dual-Layer Parallax for Inset Photo
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (insetImgRef.current) {
        gsap.to(insetImgRef.current, {
          yPercent: -18,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const gallery = residence.gallery && residence.gallery.length > 0
    ? residence.gallery
    : [{ title: residence.name, tag: 'OVERVIEW', url: residence.mainImage }]

  const activeSlide = gallery[selectedIndex] || gallery[0]

  return (
    <div
      ref={containerRef}
      onMouseEnter={markEngaged}
      onTouchStart={markEngaged}
      className={`group/card relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center py-12 transition-all duration-500 ${isReversed ? 'lg:grid-flow-dense' : ''
        }`}
    >
      {/* Visual Photography Column (7 cols) with Premium Embla Carousel */}
      <div className={`relative ${isReversed ? 'lg:col-start-6 lg:col-span-7' : 'lg:col-span-7'}`}>
        {/* Main Architectural Carousel Frame */}
        <div
          onClick={() => (onOpenSpecs ? onOpenSpecs(residence) : onReserve(residence))}
          data-cursor="Suite Details"
          className="relative aspect-[16/10] overflow-hidden bg-slate-900 border border-slate-200/90 group-hover/card:border-slate-400 transition-colors duration-500 shadow-md rounded-[2px] select-none cursor-pointer"
        >
          {/* Embla Viewport (Lazy-connected for off-screen suites) */}
          <div ref={shouldInitCarousel ? emblaRef : null} className="overflow-hidden w-full h-full">
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

          {/* Top Floating Telemetry & Perspective Indicator */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none z-20">
            {/* Room Number Emblem */}
              <span className="px-3 py-1 bg-[#0E1201]/45 backdrop-blur-md text-[9px] font-mono tracking-[0.2em] font-bold text-[#FFF0CA] uppercase border border-white/10 rounded-[2px] shadow-xs">
                SUITE {residence.roomNumber}
              </span>

              {/* Clean Minimalist Slide Counter (Zero Text Clutter) */}
              <span className="px-3 py-1 bg-[#0E1201]/45 backdrop-blur-md text-[9px] font-mono tracking-[0.2em] font-bold text-[#FFF0CA] uppercase border border-white/10 rounded-[2px] shadow-xs">
                {String(selectedIndex + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')}
              </span>
              </div>

              {/* Casa Momo Frosted Glass Slide Navigation Arrows (Touch friendly on mobile/tablet) */}
              <div className="absolute inset-y-0 inset-x-2 sm:inset-x-3 flex items-center justify-between pointer-events-none z-20">
                {/* Previous Photo Button */}
                <button
                  type="button"
                  onClick={scrollPrev}
                  data-cursor-hide="true"
                  aria-label="Previous photo"
                  className="pointer-events-auto opacity-90 sm:opacity-0 sm:group-hover/card:opacity-100 transition-all duration-300 ease-[cubic-bezier(0.52,0,0,1)] w-9 h-9 sm:w-11 sm:h-11 grid place-items-center bg-[#0E1201]/55 hover:bg-[#0E1201]/85 hover:scale-105 active:scale-95 backdrop-blur-md border border-white/20 rounded-[2px] text-[#FFF0CA] shadow-xl cursor-pointer"
                >
                  <CasaMomoSlideArrow left />
                </button>

                {/* Next Photo Button */}
                <button
                  type="button"
                  onClick={scrollNext}
                  data-cursor-hide="true"
                  aria-label="Next photo"
                  className="pointer-events-auto opacity-90 sm:opacity-0 sm:group-hover/card:opacity-100 transition-all duration-300 ease-[cubic-bezier(0.52,0,0,1)] w-9 h-9 sm:w-11 sm:h-11 grid place-items-center bg-[#0E1201]/55 hover:bg-[#0E1201]/85 hover:scale-105 active:scale-95 backdrop-blur-md border border-white/20 rounded-[2px] text-[#FFF0CA] shadow-xl cursor-pointer"
                >
                  <CasaMomoSlideArrow />
                </button>
              </div>

              {/* Minimal 1px Hairline Progress Track */}
              <div className="absolute bottom-0 inset-x-0 h-[2px] bg-white/15 z-20">
                <div
                  className="h-full bg-[#FFF0CA] transition-all duration-400 ease-[cubic-bezier(0.52,0,0,1)]"
                  style={{
                    width: `${((selectedIndex + 1) / gallery.length) * 100}%`,
                  }}
                />
              </div>
          </div>

          {/* Floating Detail Inset Photo (Dual-layer Parallax, contained on tablet) */}
          <div
            ref={insetImgRef}
            className={`hidden sm:block absolute -bottom-8 ${isReversed ? 'sm:left-2 lg:-left-6' : 'sm:right-2 lg:-right-6'
              } w-44 sm:w-48 lg:w-56 aspect-[4/3] bg-white p-1.5 shadow-xl border border-slate-200 z-20 group-hover/card:translate-y-[-2px] transition-transform duration-300 pointer-events-none`}
          >
            <img
              src={getOptimizedImageUrl(residence.detailImage, { width: 450 })}
              alt={`${residence.name} Detail`}
              width="450"
              height="338"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Telemetry Monograph Column (5 cols) */}
        <div className={`${isReversed ? 'lg:col-start-1 lg:col-span-5' : 'lg:col-span-5'} space-y-6`}>
          {/* Tier & Number Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] tracking-[0.3em] font-extrabold text-emerald-900 uppercase">
                ROOM {residence.roomNumber} &bull; {residence.tier}
              </span>
            </div>
            <h2 className="font-serif-grand text-3xl sm:text-4xl text-slate-900 font-normal">
              {residence.name}
            </h2>
          </div>

              {/* Minimalist 3-Metric Editorial Grid */ }
              < div className = "grid grid-cols-3 gap-3 pt-2" >
              {
                residence.specs.slice(0, 3).map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white border border-slate-200/80 rounded-[2px] flex flex-col justify-between hover:border-slate-400 hover:-translate-y-0.5 transition-all duration-200 shadow-2xs"
                  >
                    <span className="text-[8px] tracking-[0.25em] font-bold text-slate-600 uppercase">
                      {item.label}
                    </span>
                      <span className="text-xs font-bold text-slate-900 tracking-tight mt-1">
                        {item.value}
                      </span>
                  </div>
                ))
              }
        </div>

                {/* Curated Amenities List (Clean 2 Key Highlights) */}
                <ul className="space-y-2 pt-2 text-xs text-slate-600 font-medium">
                  {residence.amenities.slice(0, 2).map((amenity, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-800/60 shrink-0" />
                      <span>{amenity}</span>
                    </li>
                  ))}
                </ul>

                {/* Pricing & Signature Rolling-Text CTA Button */}
                <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs font-semibold text-slate-600">PKR</span>
                      <span className="text-2xl font-bold text-slate-900 tracking-tight">
                        {residence.nightlyRate.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-600 font-normal">/ Night</span>
                    </div>
                    <span className="text-[10px] tracking-[0.18em] text-emerald-800 font-semibold uppercase block mt-0.5">
                      30% Deposit (PKR {Math.round(residence.nightlyRate * 0.3).toLocaleString()})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {onOpenSpecs && (
                      <button
                        type="button"
                        onClick={() => onOpenSpecs(residence)}
                        className="px-2.5 py-1.5 text-[10px] font-mono tracking-wider uppercase text-slate-600 hover:text-slate-950 underline transition-colors cursor-pointer"
                      >
                        Specs &bull; {residence.roomNumber === '301' ? '185m²' : residence.roomNumber === '204' ? '140m²' : '160m²'}
                      </button>
                    )}
                    <AnimatedButton
                      text="Suite Details"
                      onClick={() => onReserve(residence)}
                    />
                  </div>
                </div>
              </div>
    </div>
        )
}
