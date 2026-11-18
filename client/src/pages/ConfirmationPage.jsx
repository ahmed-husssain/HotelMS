import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import InvoicePreviewModal from '../components/invoice/InvoicePreviewModal'
import { useAuth } from '../context/AuthContext'

export default function ConfirmationPage() {
  const location = useLocation()
  const { currentUser } = useAuth()
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false)
  const booking = location.state?.booking || {
    bookingRef: 'TH-301-9041',
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
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 font-sans-clean flex flex-col justify-between py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-xl mx-auto w-full space-y-6 sm:space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <BrandLogo variant="full" theme="dark" size="md" />
          </div>
          <span className="block text-[9px] tracking-[0.3em] text-emerald-800 font-semibold uppercase">
            RESERVATION GUARANTEED &bull; SAFEPAY VERIFIED
          </span>
        </div>

        {/* Receipt Folio Card */}
        <div className="bg-white border border-slate-200/90 shadow-xl p-5 sm:p-8 rounded-[2px] space-y-5 sm:space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] tracking-[0.2em] text-slate-400 font-bold uppercase">
                CONFIRMATION CODE
              </span>
              <h2 className="font-mono text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                {booking.bookingRef || 'TH-301-9041'}
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
            <h3 className="font-serif-grand text-xl sm:text-2xl text-slate-900">
              {booking.residence.name}
            </h3>
            <p className="text-xs text-slate-500">
              Check-in: Nov 24, 2026 (14:00) &bull; Check-out: Nov 28, 2026 (12:00)
            </p>
          </div>

          {/* Payment Telemetry */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-[2px] space-y-2.5 sm:space-y-3 text-xs">
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
            <p>&bull; Private parking and check-in instructions will be sent 24 hours prior to your arrival.</p>
          </div>

          {/* Action Links */}
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 pt-4 border-t border-slate-100">
            <Link
              to={`/my-stay?ref=${booking.bookingRef || 'TH-301-9041'}`}
              className="tactile flex-1 py-3 text-center bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] text-[10px] tracking-[0.2em] font-bold uppercase transition-colors rounded-[2px]"
            >
              OPEN GUEST PORTAL &rarr;
            </Link>
            {currentUser && (currentUser.role === 'admin' || currentUser.role === 'receptionist') ? (
              <Link
                to="/pms"
                className="tactile flex-1 py-3 text-center border border-slate-300 hover:bg-slate-50 text-slate-800 text-[10px] tracking-[0.2em] font-bold uppercase transition-colors rounded-[2px]"
              >
                VIEW ON STAFF PMS &rarr;
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setIsInvoiceOpen(true)}
                className="tactile flex-1 py-3 text-center border border-slate-300 hover:bg-slate-50 text-slate-800 text-[10px] tracking-[0.2em] font-bold uppercase transition-colors rounded-[2px] cursor-pointer"
              >
                PREVIEW &amp; PRINT VOUCHER &rarr;
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

      <footer className="text-center text-[10px] text-slate-400 tracking-[0.2em] uppercase">
        Habitas &bull; An Aptech Luxury Hospitality Curriculum System &bull; LuxuryStay HMS
      </footer>
    </div>
  )
}
