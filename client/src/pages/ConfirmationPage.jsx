import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import InvoicePreviewModal from '../components/invoice/InvoicePreviewModal'
import { useAuth } from '../context/AuthContext'

export default function ConfirmationPage() {
  const location = useLocation()
  const { currentUser } = useAuth()
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const booking = location.state?.booking || {
    bookingRef: 'ST-301-9041',
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

  const handleCopyCode = async () => {
    const code = booking.bookingRef || 'ST-301-9041'
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  return (
    <div className="min-h-screen min-h-dvh overflow-y-auto bg-[#FAF8F5] text-slate-900 font-sans-clean flex flex-col justify-between py-6 sm:py-10 px-3 sm:px-6 antialiased selection:bg-emerald-100 selection:text-emerald-950">
      <div className="max-w-lg mx-auto w-full my-auto space-y-2.5 sm:space-y-3.5">
        {/* Brand Header */}
        <div className="text-center space-y-1">
          <div className="flex justify-center scale-90 sm:scale-100">
            <BrandLogo variant="full" theme="dark" size="sm" />
          </div>
          <span className="block text-[8px] sm:text-[9px] tracking-[0.25em] text-emerald-800 font-semibold uppercase font-mono">
            RESERVATION CONFIRMED &bull; SAFEPAY VERIFIED
          </span>
        </div>

        {/* Receipt Folio Card */}
        <div className="bg-white border border-slate-200/90 shadow-lg p-3.5 sm:p-5 rounded-[2px] space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <span className="text-[9px] font-mono tracking-[0.2em] text-slate-400 font-bold uppercase block">
                CONFIRMATION CODE
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <h2 className="font-mono text-sm sm:text-base font-bold text-slate-900 tracking-wider">
                  {booking.bookingRef || 'ST-301-9041'}
                </h2>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-mono rounded-[2px] transition-colors cursor-pointer flex items-center gap-1 active:scale-95"
                  title="Copy confirmation code"
                >
                  <span>{copied ? '✓ Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-950 text-[9px] font-mono tracking-wider font-bold uppercase rounded-full">
              CONFIRMED
            </span>
          </div>

          {/* Important Notice Box for the Booking Code */}
          <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-[2px] text-xs font-mono text-amber-950 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-[11px]">
              <svg className="w-3.5 h-3.5 text-amber-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 2l-2 2m-1.5 1.5L16 7l-2-2m-3.5 3.5a5 5 0 1 0-7.07 7.07 5 5 0 0 0 7.07-7.07z" />
              </svg>
              <span>Important: Save This Confirmation Code</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
              Please save or copy this reference code. You will present it at the Front Desk upon arrival to collect your physical RFID keycard, and use it anytime to access your digital room key.
            </p>
          </div>

          {/* Residence Details */}
          <div className="space-y-0.5">
            <span className="text-[9px] font-mono tracking-wider font-bold text-emerald-900 uppercase block">
              ROOM {booking.residence.roomNumber} &bull; {booking.residence.tier}
            </span>
            <h3 className="font-serif-grand text-base sm:text-lg text-slate-900 font-bold leading-tight">
              {booking.residence.name}
            </h3>
            <p className="text-[11px] text-slate-500 font-mono">
              Check-In: Nov 24, 2026 (14:00) &bull; Check-Out: Nov 28, 2026 (12:00)
            </p>
          </div>

          {/* Payment Telemetry */}
          <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-200/80 rounded-[2px] space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between text-slate-600">
              <span>Safepay Reference:</span>
              <span className="font-bold text-slate-900">{booking.safepayRef}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Total Stay Amount:</span>
              <span className="font-semibold text-slate-900">
                PKR {booking.total.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-emerald-900 font-bold border-t border-slate-200 pt-1.5">
              <span>30% Deposit Paid Online:</span>
              <span>PKR {booking.advance.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Remaining Balance Due at Front Desk:</span>
              <span className="font-bold text-slate-900">
                PKR {booking.balance.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-100">
            <Link
              to={`/my-stay?ref=${booking.bookingRef || 'ST-301-9041'}`}
              className="tactile flex-1 py-2.5 text-center bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] text-xs font-semibold font-mono uppercase tracking-wider transition-colors rounded-[2px] flex items-center justify-center gap-1 min-h-[44px]"
            >
              <span>Open My Room &amp; Digital Key</span>
              <span>&rarr;</span>
            </Link>
            {currentUser && (currentUser.role === 'admin' || currentUser.role === 'receptionist') ? (
              <Link
                to="/pms"
                className="tactile flex-1 py-2.5 text-center border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold font-mono uppercase tracking-wider transition-colors rounded-[2px] flex items-center justify-center gap-1 min-h-[44px]"
              >
                <span>View Staff PMS</span>
                <span>&rarr;</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setIsInvoiceOpen(true)}
                className="tactile flex-1 py-2.5 text-center border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold font-mono uppercase tracking-wider transition-colors rounded-[2px] cursor-pointer flex items-center justify-center gap-1 min-h-[44px]"
              >
                <span>View Stay Voucher</span>
                <span>&rarr;</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Hotel Tax Invoice & Voucher Preview Modal */}
        <InvoicePreviewModal
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
          booking={booking}
          type="ADVANCE_RECEIPT"
        />
      </div>

      <footer className="text-center text-[9px] font-mono text-slate-400 tracking-[0.2em] uppercase shrink-0 py-1">
        Stayza Hotel &bull; Luxury Residences &bull; Sindh Coast, Pakistan
      </footer>
    </div>
  )
}
