import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React, { useEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

export default function ResidenceSpread({ residence, index, onReserve }) {
  const containerRef = useRef(null)
  const mainImgRef = useRef(null)
  const insetImgRef = useRef(null)

  const isReversed = index % 2 !== 0

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Main architectural photo scrub (moves down slightly)
      if (mainImgRef.current) {
        gsap.to(mainImgRef.current, {
          yPercent: 7,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      }

      // Floating inset photo scrub (counter-movement upwards for authentic depth)
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

  return (
    <div
      ref={containerRef}
      className={`relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center py-12 ${
        isReversed ? 'lg:grid-flow-dense' : ''
      }`}
    >
      {/* Visual Photography Column (7 cols) */}
      <div className={`relative ${isReversed ? 'lg:col-start-6 lg:col-span-7' : 'lg:col-span-7'}`}>
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 border border-slate-200/80 shadow-md">
          <img
            ref={mainImgRef}
            src={residence.mainImage}
            alt={residence.name}
            className="w-full h-[115%] object-cover object-center -mt-[7%]"
          />
        </div>

        {/* Floating Detail Inset (Dual-layer Parallax) */}
        <div
          ref={insetImgRef}
          className={`hidden sm:block absolute -bottom-8 ${
            isReversed ? '-left-6' : '-right-6'
          } w-52 md:w-64 aspect-[4/3] bg-white p-1.5 shadow-2xl border border-slate-200/90 z-20`}
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

        {/* 1-Second Telemetry Chips Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
          {residence.specs.map((item, idx) => (
            <div
              key={idx}
              className="p-3 bg-white border border-slate-200/70 rounded-xs flex flex-col justify-between"
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

        {/* Pricing & Reservation CTA */}
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

          <button
            onClick={() => onReserve(residence)}
            className="tactile px-6 py-3 bg-slate-900 hover:bg-emerald-950 text-white text-[10px] tracking-[0.25em] font-bold uppercase transition-colors"
          >
            RESERVE SANCTUARY
          </button>
        </div>
      </div>
    </div>
  )
}
