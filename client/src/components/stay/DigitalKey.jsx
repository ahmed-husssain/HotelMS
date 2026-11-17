import React from 'react'
import BrandLogo from '../BrandLogo'

export default function DigitalKey({ currentBooking }) {
  return (
    <div className="bg-[#0E1201] text-[#FFF0CA] border border-slate-800 p-7 rounded-[2px] shadow-xl space-y-6 relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <span className="text-[9px] font-mono tracking-[0.25em] text-amber-400 uppercase block">
            CONTACTLESS DIGITAL PASS
          </span>
          <h3 className="font-cinzel text-xl font-bold tracking-widest text-[#FAF8F5] mt-0.5">
            {currentBooking.roomNumber || `SUITE ${currentBooking.residence?.roomNumber}`}
          </h3>
        </div>
        <BrandLogo variant="emblem" theme="light" size="sm" to={null} />
      </div>

      {/* High-Contrast SVG QR Pass Simulation */}
      <div className="flex flex-col items-center justify-center p-5 bg-white rounded-[2px] text-slate-900 space-y-2">
        <svg viewBox="0 0 120 120" className="w-32 h-32" fill="none">
          <rect width="120" height="120" fill="white" />
          <rect x="10" y="10" width="30" height="30" stroke="#0E1201" strokeWidth="6" fill="white" />
          <rect x="18" y="18" width="14" height="14" fill="#0E1201" />

          <rect x="80" y="10" width="30" height="30" stroke="#0E1201" strokeWidth="6" fill="white" />
          <rect x="88" y="18" width="14" height="14" fill="#0E1201" />

          <rect x="10" y="80" width="30" height="30" stroke="#0E1201" strokeWidth="6" fill="white" />
          <rect x="18" y="88" width="14" height="14" fill="#0E1201" />

          <rect x="48" y="14" width="6" height="6" fill="#0E1201" />
          <rect x="62" y="14" width="6" height="6" fill="#0E1201" />
          <rect x="48" y="28" width="12" height="6" fill="#0E1201" />
          <rect x="52" y="48" width="18" height="18" fill="#0E1201" />
          <rect x="18" y="52" width="12" height="6" fill="#0E1201" />
          <rect x="84" y="52" width="16" height="6" fill="#0E1201" />
          <rect x="48" y="80" width="10" height="8" fill="#0E1201" />
          <rect x="66" y="84" width="12" height="6" fill="#0E1201" />
          <rect x="84" y="80" width="8" height="12" fill="#0E1201" />
          <rect x="98" y="94" width="10" height="10" fill="#0E1201" />
        </svg>
        <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500 font-bold">
          REF: {currentBooking.bookingRef}
        </span>
      </div>

      <div className="space-y-1.5 text-xs font-mono text-slate-300 pt-1">
        <div className="flex justify-between">
          <span className="text-slate-400">Primary Guest:</span>
          <span className="font-bold text-[#FAF8F5]">{currentBooking.guestName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Access Tier:</span>
          <span className="text-amber-400">UNRESTRICTED RESIDENTIAL</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Valet Bay:</span>
          <span>Bay #301 (Subterranean)</span>
        </div>
      </div>
    </div>
  )
}
