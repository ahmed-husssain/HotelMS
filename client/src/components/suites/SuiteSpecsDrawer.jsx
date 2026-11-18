import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getOptimizedImageUrl } from '../../utils/cloudinary'

/**
 * SuiteSpecsDrawer
 * 
 * Architectural Specification Dossier for Habitas Residences:
 * - Mobile-First: Bottom-sheet on mobile (< 768px), elegant slide-over drawer on desktop
 * - Full architectural telemetry: square meters, ceiling heights, heated plunge pool specs, acoustics
 * - Direct luxury booking CTA with 30% deposit calculation
 */
export default function SuiteSpecsDrawer({ residence, isOpen, onClose }) {
  // Lock document body scroll while drawer is open
  useEffect(() => {
    if (!isOpen) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen || !residence) return null

  // Calculate advance deposit preview
  const advanceDepositPreview = Math.round(residence.nightlyRate * 0.3)

  // Architectural specifications mapped by suite tier
  const specs = {
    '301': {
      interiorArea: '185 m² (1,991 sq ft)',
      terraceArea: '65 m² cantilevered deck',
      ceilingHeight: '4.2m monolithic limestone',
      plungePool: '14 m² heated mineral pool (28°C)',
      orientation: '24°48\'N, 67°01\'E • 180° Arabian Sunset',
      acoustics: 'STC 64 triple-glazed ocean isolation',
      valetBay: 'Subterranean Bay #301 (EV Ultra-Fast 150kW)',
      maxOccupancy: '2 Adults • Complete Seclusion',
    },
    '204': {
      interiorArea: '140 m² (1,506 sq ft)',
      terraceArea: '48 m² enclosed garden court',
      ceilingHeight: '3.8m acoustic cedar beams',
      plungePool: '10 m² heated cedar hydrotherapy tub',
      orientation: 'East-Facing Cliff & Courtyard Garden',
      acoustics: 'STC 60 tranquil courtyard barrier',
      valetBay: 'Subterranean Bay #204 (EV Ready)',
      maxOccupancy: '2 Adults • Garden Courtyard',
    },
    '102': {
      interiorArea: '160 m² (1,722 sq ft)',
      terraceArea: '55 m² tide-line stone terrace',
      ceilingHeight: '4.0m architectural travertine',
      plungePool: '12 m² tidal infinity plunge pool',
      orientation: 'Direct Sea Level Water Edge',
      acoustics: 'STC 62 marine acoustic glazing',
      valetBay: 'Subterranean Bay #102 (EV Ready)',
      maxOccupancy: '2 Adults • Sea-Level Pavilion',
    },
  }[residence.roomNumber] || {
    interiorArea: '160 m² (1,722 sq ft)',
    terraceArea: '55 m² panoramic terrace',
    ceilingHeight: '4.0m basalt concrete',
    plungePool: '12 m² heated saltwater plunge',
    orientation: 'Arabian Coastal Panorama',
    acoustics: 'STC 62 luxury noise barrier',
    valetBay: 'Subterranean Dedicated Bay',
    maxOccupancy: '2 Adults',
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="suite-specs-title">
      {/* 1. Backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300" 
      />

      {/* 2. Slide-Over Panel (Mobile: Bottom Sheet | Desktop: Right Drawer) */}
      <div className="fixed inset-x-0 bottom-0 md:inset-x-auto md:right-0 md:top-0 md:bottom-0 w-full md:max-w-xl bg-[#FAF8F5] text-slate-900 border-t md:border-t-0 md:border-l border-[#E5DFD5] shadow-2xl flex flex-col max-h-[92vh] md:max-h-full overflow-hidden rounded-t-2xl md:rounded-none animate-in slide-in-from-bottom md:slide-in-from-right duration-400">
        
        {/* Drawer Header */}
        <div className="px-5 sm:px-8 py-4 sm:py-5 border-b border-[#E5DFD5] flex items-center justify-between bg-[#FAF8F5]/90 backdrop-blur-md shrink-0">
          <div>
            <span className="text-[9px] font-mono tracking-[0.25em] font-bold text-emerald-900 uppercase">
              ARCHITECTURAL SPECIFICATION &bull; SUITE {residence.roomNumber}
            </span>
            <h2 id="suite-specs-title" className="font-serif-grand text-xl sm:text-2xl text-slate-900 mt-0.5">
              {residence.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close specifications drawer"
            className="w-8 h-8 rounded-full border border-slate-300 hover:border-slate-900 flex items-center justify-center text-slate-600 hover:text-slate-950 text-base cursor-pointer transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 sm:space-y-8 font-sans-clean">
          
          {/* Hero Perspective Photo */}
          <div className="relative aspect-[16/9] w-full rounded-[2px] overflow-hidden bg-slate-900 border border-slate-200 shadow-sm">
            <img
              src={getOptimizedImageUrl(residence.gallery?.[0]?.url || residence.mainImage, { width: 800 })}
              alt={residence.name}
              width="800"
              height="450"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover filter brightness-[0.95]"
            />
            <div className="absolute bottom-2.5 left-2.5 px-3 py-1 bg-black/60 backdrop-blur-md rounded-[2px] text-[10px] font-mono text-[#FFF0CA] uppercase tracking-wider">
              {residence.tier || 'PRESIDENTIAL RESIDENCE'}
            </div>
          </div>

          {/* Editorial Philosophy Statement */}
          <div className="border-l-2 border-[#D4AF37] pl-4 py-0.5">
            <p className="font-serif italic text-sm text-slate-700 leading-relaxed font-light">
              "{residence.description || 'Spacious oceanfront residence designed for comfort, natural light, and quiet privacy.'}"
            </p>
          </div>

          {/* Architectural Telemetry Matrix */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#E5DFD5] pb-2">
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase font-bold text-slate-900">
                01 &bull; ARCHITECTURAL DIMENSIONS &amp; ACOUSTICS
              </span>
              <span className="text-[9px] font-mono text-slate-400">UNITS: METRIC / IMPERIAL</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white border border-[#E5DFD5] rounded-[2px]">
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">Interior Living Space</span>
                <span className="font-semibold text-slate-900 mt-0.5 block">{specs.interiorArea}</span>
              </div>

              <div className="p-3 bg-white border border-[#E5DFD5] rounded-[2px]">
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">Oceanfront Terrace Deck</span>
                <span className="font-semibold text-slate-900 mt-0.5 block">{specs.terraceArea}</span>
              </div>

              <div className="p-3 bg-white border border-[#E5DFD5] rounded-[2px]">
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">Ceiling Height</span>
                <span className="font-semibold text-slate-900 mt-0.5 block">{specs.ceilingHeight}</span>
              </div>

              <div className="p-3 bg-white border border-[#E5DFD5] rounded-[2px]">
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">Private Pool System</span>
                <span className="font-semibold text-emerald-950 mt-0.5 block">{specs.plungePool}</span>
              </div>

              <div className="p-3 bg-white border border-[#E5DFD5] rounded-[2px]">
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">Acoustic Isolation</span>
                <span className="font-semibold text-slate-900 mt-0.5 block">{specs.acoustics}</span>
              </div>

              <div className="p-3 bg-white border border-[#E5DFD5] rounded-[2px]">
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">Valet &amp; Parking</span>
                <span className="font-semibold text-slate-900 mt-0.5 block">{specs.valetBay}</span>
              </div>
            </div>
          </div>

          {/* Curated In-Suite Inclusions */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase font-bold text-slate-900 block border-b border-[#E5DFD5] pb-2">
              02 &bull; COMPLIMENTARY SUITE INCLUSIONS
            </span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                <span>Executive airport luxury chauffeur</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                <span>Daily terrace organic orchard breakfast</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                <span>Bang &amp; Olufsen bespoke acoustic audio</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                <span>Subterranean valet &amp; EV recharge</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                <span>Cedar spa steam &amp; bath amenities</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                <span>24/7 dedicated private suite host</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Drawer Sticky Footer Action Bar */}
        <div className="p-4 sm:p-6 border-t border-[#E5DFD5] bg-[#FAF8F5] flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div>
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">
              30% Safepay Online Deposit
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-lg font-bold text-slate-900">
                PKR {advanceDepositPreview.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                / total PKR {residence.nightlyRate.toLocaleString()}
              </span>
            </div>
          </div>

          <Link
            to={`/reserve?room=${residence.roomNumber}`}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] font-mono text-xs font-bold uppercase tracking-[0.2em] rounded-[2px] transition-colors text-center shadow-md active:scale-95"
          >
            Reserve Suite {residence.roomNumber} &rarr;
          </Link>
        </div>

      </div>
    </div>
  )
}
