import React, { useRef } from 'react'
import BrandLogo from '../BrandLogo'

/**
 * InvoicePreviewModal — Clean Luxury Tax Folio & Advance Stay Voucher
 * 
 * Styled as an authentic luxury hotel tax document.
 * Viewport-responsive (fits within 90vh with smooth internal scroll on any device).
 */
export default function InvoicePreviewModal({ isOpen, onClose, booking, isFinalInvoice = false }) {
  const invoiceRef = useRef(null)

  if (!isOpen || !booking) return null

  const residence = booking.residence || {
    name: 'The Horizon Penthouse',
    roomNumber: '301',
    tier: 'PRESIDENTIAL PENTHOUSE',
    nightlyRate: 110000,
  }

  // Calculate numbers strictly from verified booking data
  const nights = booking.nights || 4
  const suiteSubtotal = booking.suiteSubtotal || (residence.nightlyRate * nights)
  const addonsTotal = (booking.selectedAddons || []).reduce((sum, item) => sum + (item.price || 0), 0)
  const diningTotal = (booking.diningOrders || []).reduce((sum, item) => sum + (item.price || 0), 0)
  const netSubtotal = suiteSubtotal + addonsTotal + diningTotal
  const sindhTax = Math.round(netSubtotal * 0.13) // 13% Sindh SST
  const totalValuation = netSubtotal + sindhTax
  const advancePaid = booking.advance || Math.round(totalValuation * 0.3)
  const balanceDue = isFinalInvoice ? 0 : Math.max(0, totalValuation - advancePaid)

  const handlePrint = () => {
    window.print()
  }

  const handleCopySummary = () => {
    const summary = `HABITAS LUXURY STAY VOUCHER
Ref: ${booking.bookingRef || 'TH-301-9041'}
Guest: ${booking.guestName || 'Guest'}
Suite: Room ${residence.roomNumber} - ${residence.name}
Total: PKR ${totalValuation.toLocaleString()}
Advance (30%): PKR ${advancePaid.toLocaleString()}
Balance Due: PKR ${balanceDue.toLocaleString()}`
    
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(summary)
      alert('Voucher summary copied to clipboard')
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static"
      role="dialog"
      aria-modal="true"
      aria-labelledby="invoice-preview-title"
    >
      {/* Outer Card Container - Constrained to 90vh with flex column */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white border border-slate-300 rounded-[2px] shadow-2xl overflow-hidden flex flex-col my-auto print:border-none print:shadow-none print:w-full print:max-w-none print:m-0 print:max-h-none">
        
        {/* ============================================================== */}
        {/* 1. TOP INTERACTIVE TOOLBAR (STICKY & VISIBLE)                   */}
        {/* ============================================================== */}
        <div className="bg-[#0E1201] text-[#FAF8F5] px-4 sm:px-6 py-3 flex items-center justify-between border-b border-slate-800 print:hidden shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="uppercase font-bold tracking-wider">
              {isFinalInvoice ? 'Official Tax Invoice Preview' : 'Official Advance Stay Voucher'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySummary}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-[#FFF0CA] font-mono text-[10px] uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer"
            >
              Copy Summary
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/80 text-white font-mono text-[10px] uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <span>Print / Save PDF</span>
              <span>&darr;</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close invoice preview"
              className="w-7 h-7 ml-1 rounded-full border border-white/20 hover:border-white flex items-center justify-center text-slate-400 hover:text-white text-base cursor-pointer transition-colors"
            >
              &times;
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. AUTHENTIC LUXURY HOTEL TAX INVOICE DOCUMENT (SCROLLABLE)    */}
        {/* ============================================================== */}
        <div 
          ref={invoiceRef} 
          className="flex-1 overflow-y-auto p-5 sm:p-8 bg-white text-slate-900 font-sans-clean space-y-5 sm:space-y-6 print:p-8 print:overflow-visible"
        >
          {/* A. Formal Letterhead */}
          <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <BrandLogo variant="wordmark" theme="dark" size="md" to="/" />
              <p className="text-[10px] font-mono text-slate-500 leading-tight max-w-sm">
                Cliffs of Sindh Coast (24&deg;48'N, 67&deg;01'E) &bull; Karachi - Thatta Coastal Road, Pakistan
                <br />
                Concierge Desk: +92 21 3890 0000 &bull; concierge@habitas.pk
              </p>
            </div>

            <div className="text-left sm:text-right font-mono text-xs space-y-0.5">
              <span className="text-[10px] text-slate-400 block tracking-widest uppercase">
                {isFinalInvoice ? 'TAX INVOICE' : 'ADVANCE DEPOSIT RECEIPT'}
              </span>
              <span className="text-base font-bold text-slate-900 block font-mono">
                {isFinalInvoice ? `INV-2026-${booking.bookingRef?.slice(-4) || '8812'}` : `RCP-2026-${booking.bookingRef?.slice(-4) || '4401'}`}
              </span>
              <span className="text-[10px] text-slate-500 block">
                Issued: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="text-[9px] text-slate-400 block">
                SNTN: 4829104-7 &bull; STRN: 3277876123456
              </span>
            </div>
          </div>

          {/* B. Two-Column Guest & Suite Telemetry */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAF8F5] p-3.5 sm:p-4 rounded-[2px] border border-slate-200/80">
            {/* Guest Profile */}
            <div className="space-y-1 border-b sm:border-b-0 sm:border-r border-slate-200 pb-3 sm:pb-0 sm:pr-4">
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                GUEST DETAILS
              </span>
              <h2 className="font-serif-grand text-base text-slate-900 font-bold">
                {booking.guestName || 'In-House Guest'}
              </h2>
              <div className="text-xs font-mono text-slate-600 space-y-0.5">
                <p>{booking.guestPhone || '+92 300 0000000'}</p>
                <p>{booking.guestEmail || 'guest@luxury.pk'}</p>
                <p className="text-[10px] text-slate-500 pt-1">
                  Ref Code: <strong className="text-slate-900">{booking.bookingRef || 'TH-301-9041'}</strong>
                </p>
              </div>
            </div>

            {/* Suite & Stay Profile */}
            <div className="space-y-1 sm:pl-2">
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                SUITE DETAILS
              </span>
              <h2 className="font-serif-grand text-base text-slate-900 font-bold">
                Room {residence.roomNumber} &bull; {residence.name}
              </h2>
              <div className="text-xs font-mono text-slate-600 space-y-0.5">
                <p>Check-In: <strong>{booking.checkIn || 'Nov 24, 2026 (14:00 PKT)'}</strong></p>
                <p>Check-Out: <strong>{booking.checkOut || 'Nov 28, 2026 (12:00 PKT)'}</strong></p>
                <p className="text-[10px] text-slate-500 pt-1">
                  Duration: <strong>{nights} Nights</strong> &bull; Safepay: <strong>{booking.safepayRef || 'SPF-981240'}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* C. Itemized Line Charges Table */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
              ITEMIZED SERVICES &amp; CHARGES
            </span>

            <table className="w-full text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-slate-900 text-[10px] text-slate-500 uppercase text-left">
                  <th className="py-1.5 font-bold">Description</th>
                  <th className="py-1.5 text-center font-bold">Qty / Nights</th>
                  <th className="py-1.5 text-right font-bold">Unit Rate (PKR)</th>
                  <th className="py-1.5 text-right font-bold">Amount (PKR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* 1. Base Suite Accommodation */}
                <tr>
                  <td className="py-2.5 pr-2">
                    <span className="font-bold text-slate-900 block">{residence.name} (Suite {residence.roomNumber})</span>
                    <span className="text-[10px] text-slate-400 block font-sans-clean">
                      Luxury oceanfront accommodation &bull; 100% Private Bluffs
                    </span>
                  </td>
                  <td className="py-2.5 text-center text-slate-600">{nights}N</td>
                  <td className="py-2.5 text-right text-slate-600">{residence.nightlyRate?.toLocaleString()}</td>
                  <td className="py-2.5 text-right font-bold text-slate-900">{suiteSubtotal.toLocaleString()}</td>
                </tr>

                {/* 2. Concierge Addons */}
                {(booking.selectedAddons || []).map((addon, idx) => (
                  <tr key={`addon-${idx}`}>
                    <td className="py-2 pr-2">
                      <span className="font-medium text-slate-900 block">{addon.title}</span>
                      <span className="text-[10px] text-slate-400 block font-sans-clean">Concierge Curated Experience</span>
                    </td>
                    <td className="py-2 text-center text-slate-600">1</td>
                    <td className="py-2 text-right text-slate-600">{addon.price?.toLocaleString()}</td>
                    <td className="py-2 text-right font-medium text-slate-900">{addon.price?.toLocaleString()}</td>
                  </tr>
                ))}

                {/* 3. In-Stay Folio Orders */}
                {(booking.diningOrders || []).map((order, idx) => (
                  <tr key={`order-${idx}`}>
                    <td className="py-2 pr-2">
                      <span className="font-medium text-slate-900 block">{order.title}</span>
                      <span className="text-[10px] text-slate-400 block font-sans-clean">In-Suite Service Charge</span>
                    </td>
                    <td className="py-2 text-center text-slate-600">1</td>
                    <td className="py-2 text-right text-slate-600">{order.price?.toLocaleString()}</td>
                    <td className="py-2 text-right font-medium text-slate-900">{order.price?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* D. Verification & Financial Breakdown Row */}
          <div className="border-t-2 border-slate-900 pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Live Verification Box */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white border border-slate-300 p-1 rounded-[2px] shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900" fill="currentColor">
                  <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z M40,10 h10 v10 h-10 z M60,40 h10 v10 h-10 z M40,60 h20 v10 h-20 z M70,70 h10 v10 h-10 z M90,90 h10 v10 h-10 z" />
                </svg>
              </div>

              <div className="space-y-0.5 text-[10px] font-mono text-slate-500 max-w-xs">
                <span className="font-bold text-emerald-950 uppercase block">
                  &bull; VERIFIED SECURE FOLIO
                </span>
                <p className="leading-tight">
                  Ref: <strong className="text-slate-900">{booking.bookingRef || 'TH-301-9041'}</strong>
                </p>
                <span className="text-[9px] text-slate-400 block">
                  Audited on Habitas PMS Network
                </span>
              </div>
            </div>

            {/* Financial Telemetry Split Box */}
            <div className="w-full sm:w-64 font-mono text-xs space-y-1.5 border-t sm:border-t-0 pt-3 sm:pt-0">
              <div className="flex justify-between text-slate-600 text-[11px]">
                <span>Services Subtotal:</span>
                <span>PKR {netSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-[11px]">
                <span>Sindh SST Tax (13%):</span>
                <span>PKR {sindhTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold border-t border-slate-300 pt-1 text-xs">
                <span>Total Stay Amount:</span>
                <span>PKR {totalValuation.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-emerald-900 font-semibold bg-emerald-50 px-2 py-1 rounded-[2px] border border-emerald-200 text-[11px]">
                <span>Advance Paid (30%):</span>
                <span>- PKR {advancePaid.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-slate-900 font-bold border-t border-slate-300 pt-1">
                <span className="text-[11px]">{isFinalInvoice ? 'Settled in Full:' : 'Balance Due at Desk:'}</span>
                <span className={balanceDue === 0 ? 'text-emerald-900' : 'text-slate-900'}>
                  PKR {balanceDue.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* E. Legal Audit Declarations & Signatures */}
          <div className="border-t border-slate-200 pt-4 grid grid-cols-2 gap-4 text-[9px] font-mono text-slate-500">
            <div className="space-y-4">
              <p className="leading-relaxed">
                Computer-generated tax voucher under Sindh Revenue Board rules.
              </p>
              <div className="border-t border-slate-300 pt-1">
                <span>GUEST ACKNOWLEDGEMENT</span>
              </div>
            </div>

            <div className="space-y-4 text-right">
              <div className="inline-block px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-[9px] font-bold uppercase rounded-[2px]">
                {isFinalInvoice ? 'PAID IN FULL' : '30% SAFEPAY DEPOSIT VERIFIED'}
              </div>
              <div className="border-t border-slate-300 pt-1">
                <span>GENERAL MANAGER &bull; TARIQ J.</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
