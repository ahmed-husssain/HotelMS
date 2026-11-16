import useEmblaCarousel from 'embla-carousel-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import RollingTextButton from './RollingTextButton'

gsap.registerPlugin(ScrollTrigger)

export default function ResidenceSpread({ residence, index, onReserve }) {
  const containerRef = useRef(null)
  const insetImgRef = useRef(null)

  const isReversed = index % 2 !== 0

  // Embla Carousel Setup with touch/mouse inertia
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 25,
    skipSnaps: false,
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

  const scrollTo = (idx) => {
    if (emblaApi) emblaApi.scrollTo(idx)
  }

  // GSAP Dual-Layer Parallax for Floating Inset Photo
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

  const gallery = residence.gallery || [
    { title: residence.name, tag: 'OVERVIEW', url: residence.mainImage },
  ]

  return (
    <div
      ref={containerRef}
      className={`group/card relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center py-12 transition-all duration-500 ${
        isReversed ? 'lg:grid-flow-dense' : ''
      }`}
    >
      {/* Visual Photography Column with Embla Carousel (7 cols) */}
      <div className={`relative ${isReversed ? 'lg:col-start-6 lg:col-span-7' : 'lg:col-span-7'}`}>
        {/* Main Architectural Carousel Frame */}
        <div
          data-cursor-text="DRAG ↔"
          className="relative aspect-[16/10] overflow-hidden bg-slate-100 border border-slate-200/90 group-hover/card:border-slate-400 transition-colors duration-500 shadow-md rounded-xs cursor-grab active:cursor-grabbing select-none"
        >
          {/* Embla Viewport */}
          <div ref={emblaRef} className="overflow-hidden w-full h-full">
            <div className="flex w-full h-full touch-pan-y">
              {gallery.map((photo, i) => (
                <div
                  key={i}
                  className="flex-[0_0_100%] min-w-0 relative w-full h-full overflow-hidden"
                >
                  <img
                    src={photo.url}
                    alt={`${residence.name} - ${photo.title}`}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-[1.03]"
                  />
                  {/* Floating Perspective Tag Overlay */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md text-[9px] font-mono tracking-[0.2em] font-bold text-slate-900 uppercase border border-slate-200/80 shadow-xs">
                      {photo.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hairline 1px Progress Track */}
          <div className="absolute bottom-0 inset-x-0 h-1 bg-black/20 z-10">
            <div
              className="h-full bg-white transition-all duration-300 ease-out"
              style={{
                width: `${((selectedIndex + 1) / gallery.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Perspective Selector Pills & Counter */}
        <div className="mt-3 flex items-center justify-between gap-2 overflow-x-auto pb-1 text-slate-500">
          <div className="flex items-center gap-1.5 flex-wrap">
            {gallery.map((photo, idx) => (
              <button
                key={idx}
                onClick={() => scrollTo(idx)}
                className={`px-2.5 py-1 text-[9px] font-mono tracking-[0.18em] uppercase transition-all duration-200 rounded-xs border ${
                  selectedIndex === idx
                    ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                0{idx + 1} {photo.tag}
              </button>
            ))}
          </div>

          <span className="text-[10px] font-mono font-bold text-slate-400 shrink-0">
            0{selectedIndex + 1} / 0{gallery.length}
          </span>
        </div>

        {/* Floating Detail Inset (Dual-layer Parallax Scrub) */}
        <div
          ref={insetImgRef}
          className={`hidden sm:block absolute -bottom-10 ${
            isReversed ? '-left-6' : '-right-6'
          } w-48 md:w-56 aspect-[4/3] bg-white p-1.5 shadow-2xl border border-slate-200 z-20 group-hover/card:translate-y-[-2px] transition-transform duration-300`}
        >
          <img
            src={residence.detailImage}
            alt={`${residence.name} Detail`}
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

        {/* 1-Second Telemetry Chips Grid with Micro-Lift Hover */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
          {residence.specs.map((item, idx) => (
            <div
              key={idx}
              className="p-3 bg-white border border-slate-200/80 rounded-xs flex flex-col justify-between hover:border-slate-400 hover:-translate-y-0.5 transition-all duration-200 shadow-2xs"
            >
              <span className="text-[8px] tracking-[0.25em] font-bold text-slate-400 uppercase">
                {item.label}
              </span>
              <span className="text-xs font-bold text-slate-900 tracking-tight mt-0.5">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Curated Amenities List */}
        <ul className="space-y-1.5 pt-2 text-xs text-slate-600 font-medium">
          {residence.amenities.map((amenity, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="w-1.5 h-px bg-slate-400" />
              <span>{amenity}</span>
            </li>
          ))}
        </ul>

        {/* Pricing & Rolling Text CTA Button */}
        <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-semibold text-slate-500">PKR</span>
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                {residence.nightlyRate.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 font-normal">/ Night</span>
            </div>
            <span className="text-[10px] tracking-[0.18em] text-emerald-800 font-semibold uppercase block mt-0.5">
              30% Deposit (PKR {Math.round(residence.nightlyRate * 0.3).toLocaleString()})
            </span>
          </div>

          {/* Signature Rolling-Text Reveal Button */}
          <RollingTextButton
            text="Reserve Sanctuary"
            onClick={() => onReserve(residence)}
          />
        </div>
      </div>
    </div>
  )
}
