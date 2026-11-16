import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function BookingConfirmation() {
  const location = useLocation()
  const booking = location.state?.booking || {
    residence: {
      name: 'The Horizon Penthouse',
      roomNumber: '301',
      tier: 'PRESIDENTIAL SUITE',
      nightlyRate: 110000,
    },
    nights: 4,
    total: 497200,
    advance: 149160,
    balance: 348040,
    safepayRef: 'SPF-829104',
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 font-sans-clean flex flex-col justify-between py-12 px-6">
      <div className="max-w-xl mx-auto w-full space-y-8">
        {/* Brand */}
        <div className="text-center space-y-1">
          <Link to="/" className="font-cinzel text-xl tracking-[0.25em] font-bold text-slate-900">
            LUXURYSTAY
          </Link>
          <span className="block text-[9px] tracking-[0.3em] text-emerald-800 font-semibold uppercase">
            RESERVATION GUARANTEED &bull; SAFEPAY VERIFIED
          </span>
        </div>

        {/* Receipt Folio Card */}
        <div className="bg-white border border-slate-200/90 shadow-xl p-8 rounded-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] tracking-[0.2em] text-slate-400 font-bold uppercase">
                CONFIRMATION CODE
              </span>
              <h2 className="font-mono text-lg font-bold text-slate-900 mt-0.5">
                LX-2026-90412
              </h2>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-950 text-[10px] tracking-[0.15em] font-bold uppercase rounded-full">
              CONFIRMED
            </span>
          </div>

          {/* Residence Details */}
          <div className="space-y-1">
            <span className="text-[9px] tracking-[0.2em] font-bold text-emerald-900 uppercase">
              ROOM {booking.residence.roomNumber} &bull; {booking.residence.tier}
            </span>
            <h3 className="font-serif-grand text-2xl text-slate-900">
              {booking.residence.name}
            </h3>
            <p className="text-xs text-slate-500">
              Check-in: Nov 24, 2026 (14:00) &bull; Check-out: Nov 28, 2026 (12:00)
            </p>
          </div>

          {/* Payment Telemetry */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xs space-y-3 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Safepay Reference:</span>
              <span className="font-mono font-bold text-slate-900">{booking.safepayRef}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Total Valuation:</span>
              <span className="font-semibold text-slate-900">
                PKR {booking.total.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-emerald-900 font-bold border-t border-slate-200 pt-2">
              <span>30% Deposit Paid Online:</span>
              <span>PKR {booking.advance.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Remaining Balance Due at Front-Desk:</span>
              <span className="font-bold text-slate-900">
                PKR {booking.balance.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-[11px] text-slate-500 leading-relaxed space-y-1">
            <p>&bull; An automated SMS and Email confirmation voucher has been dispatched.</p>
            <p>&bull; Subterranean valet arrival instructions will be unlocked 24 hours prior to check-in.</p>
          </div>

          {/* Action Links */}
          <div className="flex gap-4 pt-4 border-t border-slate-100">
            <Link
              to="/"
              className="tactile flex-1 py-3 text-center bg-slate-900 hover:bg-emerald-950 text-white text-[10px] tracking-[0.2em] font-bold uppercase transition-colors"
            >
              RETURN TO OVERVIEW
            </Link>
            <Link
              to="/pms"
              className="tactile flex-1 py-3 text-center border border-slate-300 hover:bg-slate-50 text-slate-800 text-[10px] tracking-[0.2em] font-bold uppercase transition-colors"
            >
              VIEW ON STAFF PMS &rarr;
            </Link>
          </div>
        </div>
      </div>

      <footer className="text-center text-[10px] text-slate-400 tracking-[0.2em] uppercase">
        LuxuryStay Resort &bull; Aptech eProject Submission
      </footer>
    </div>
  )
}
