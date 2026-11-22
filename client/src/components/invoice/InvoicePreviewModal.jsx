import React, { useEffect, useRef, useState } from 'react'

/**
 * InvoicePreviewModal — Mobile-First, Minimal Luxury Hotel Tax Document
 * 
 * Fully responsive:
 * - On Mobile: Full-width clean sheet, stacked accommodation card (zero horizontal overflow),
 *   compact top action bar, and easy-tap buttons.
 * - On Desktop: Publication-grade A4 layout with clean 4-column ledger and printable styling.
 */
export default function InvoicePreviewModal({ isOpen, onClose, booking, isFinalInvoice = false }) {
  const invoiceRef = useRef(null)
  const [copied, setCopied] = useState(false)
  const [isRendered, setIsRendered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true)
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsVisible(true))
      })
      return () => cancelAnimationFrame(raf)
    } else {
      setIsVisible(false)
      const timer = setTimeout(() => setIsRendered(false), 200)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Body scroll lock effect
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

  if (!isRendered || !booking) return null

  const residence = booking.residence || {
    name: 'The Horizon Penthouse',
    roomNumber: '301',
    tier: 'PRESIDENTIAL SUITE',
    nightlyRate: 110000,
  }

  const nights = booking.nights || 2
  const nightlyRate = residence.nightlyRate || 110000
  const suiteSubtotal = booking.suiteSubtotal || (nightlyRate * nights)
  const addonsTotal = (booking.selectedAddons || []).reduce((sum, item) => sum + (item.price || 0), 0)
  const diningTotal = (booking.diningOrders || []).reduce((sum, item) => sum + (item.price || 0), 0)
  const netSubtotal = suiteSubtotal + addonsTotal + diningTotal
  const sindhTax = Math.round(netSubtotal * 0.13)
  const totalAmount = netSubtotal + sindhTax
  const advancePaid = booking.advance || Math.round(totalAmount * 0.3)
  const balanceDue = isFinalInvoice ? 0 : Math.max(0, totalAmount - advancePaid)

  const bookingRef = booking.bookingRef || 'ST-301-6077'
  const invoiceNum = isFinalInvoice ? `INV-2026-${bookingRef.slice(-4)}` : `RCP-2026-${bookingRef.slice(-4)}`
  const docTitle = isFinalInvoice ? 'Official Tax Invoice' : 'Advance Deposit Receipt'

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = async () => {
    try {
      const res = await fetch(`/api/bookings/${bookingRef}/invoice`, { method: 'HEAD' })
      if (res.ok && res.headers.get('content-type')?.includes('application/pdf')) {
        window.open(`/api/bookings/${bookingRef}/invoice`, '_blank')
        return
      }
    } catch {
      // Fallback to print
    }
    window.print()
  }

  const handleCopySummary = () => {
    const summary = `STAYZA HOTEL INVOICE
Ref: ${bookingRef}
Invoice #: ${invoiceNum}
Guest: ${booking.guestName || 'Valued Guest'}
Suite: Suite ${residence.roomNumber} - ${residence.name}
Total: PKR ${totalAmount.toLocaleString()}
Advance Paid (30%): PKR ${advancePaid.toLocaleString()}
Balance: PKR ${balanceDue.toLocaleString()}`

    if (navigator?.clipboard) {
      navigator.clipboard.writeText(summary)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto bg-black/60 p-0 sm:p-6 flex justify-center items-start print:p-0 print:bg-white print:static transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {/* Modal Container: Full-width on mobile (no cramped side margins), centered card on desktop */}
      <div
        className={`relative w-full max-w-2xl bg-white border-0 sm:border sm:border-slate-200 rounded-none sm:rounded-lg shadow-2xl my-0 sm:my-8 flex flex-col min-h-screen sm:min-h-0 overflow-hidden transition-all duration-200 print:border-none print:shadow-none print:w-full print:m-0 ${
          isVisible ? 'scale-100' : 'scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar: Clean, compact on mobile with touch-friendly 44px close button */}
        <div className="bg-[#0F172A] text-white px-4 sm:px-6 py-3 flex items-center justify-between border-b border-slate-800 print:hidden shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-200 truncate">
              {docTitle}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopySummary}
              className="px-2.5 py-1 text-slate-300 hover:text-white text-xs transition-colors cursor-pointer hidden sm:inline-block"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>

            <button
              type="button"
              onClick={handleDownloadPDF}
              className="px-3 py-1.5 bg-white text-slate-900 hover:bg-slate-100 text-xs font-semibold rounded transition-colors cursor-pointer flex items-center gap-1 shadow-xs touch-target"
            >
              <span>Download PDF</span>
              <span>&darr;</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-2.5 py-1 text-slate-300 hover:text-white text-xs transition-colors cursor-pointer hidden sm:inline-block"
            >
              Print
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close invoice preview"
              className="w-9 h-9 rounded-full text-slate-300 hover:text-white hover:bg-white/10 flex items-center justify-center text-xl cursor-pointer transition-colors touch-target"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Invoice Document Body */}
        <div ref={invoiceRef} className="p-4 sm:p-8 bg-white text-slate-900 space-y-4 sm:space-y-5 print:p-6">
          {/* Letterhead */}
          <div className="border-b border-slate-200 pb-4 sm:pb-5 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-wider text-slate-900 uppercase">
                STAYZA HOTEL &amp; RESORT
              </h1>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Karachi &ndash; Thatta Coastal Road, Sindh, Pakistan<br />
                Phone: +92 21 3890 0000 &bull; Email: concierge@stayza.pk
              </p>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-600 space-y-0.5">
              <span className="font-bold text-sm text-slate-900 block">{docTitle}</span>
              <span className="font-mono text-slate-700 block font-medium">Invoice #: {invoiceNum}</span>
              <span className="text-slate-500 block">
                Issued: {new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
              <span className="text-slate-500 block">NTN: 9821481-2 &bull; STRN: 17-00-9821-001</span>
            </div>
          </div>

          {/* Guest & Reservation Details (Responsive Stack) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-[#FAF8F5] p-3.5 sm:p-4 rounded-md border border-slate-200 text-xs">
            <div>
              <span className="font-semibold text-slate-500 uppercase tracking-wider text-[11px] block mb-1">
                Guest Details
              </span>
              <p className="font-bold text-sm text-slate-900">{booking.guestName || 'Ahmed Hussain'}</p>
              <p className="text-slate-600 mt-0.5">{booking.guestPhone || '+92 300 0000000'}</p>
              <p className="text-slate-600">{booking.guestEmail || 'ahmedhusssain117@gmail.com'}</p>
            </div>

            <div className="sm:text-right border-t sm:border-t-0 pt-2.5 sm:pt-0 border-slate-200/80">
              <span className="font-semibold text-slate-500 uppercase tracking-wider text-[11px] block mb-1">
                Booking Details
              </span>
              <p className="font-bold text-sm text-slate-900 font-mono">Ref: {bookingRef}</p>
              <p className="text-slate-700 mt-0.5 font-medium">Suite {residence.roomNumber} &bull; {residence.name}</p>
              <p className="text-slate-500">
                Duration: {nights} {nights === 1 ? 'Night' : 'Nights'}
              </p>
            </div>
          </div>

          {/* Charges Section: Mobile-optimized card view + Desktop Table View */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Charges Summary
            </span>

            {/* Mobile View: Stacked Card (Eliminates table overflow on small phones) */}
            <div className="sm:hidden bg-[#F8FAFC] border border-slate-200 rounded-md p-3.5 space-y-2 text-xs">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <strong className="text-slate-900 text-sm block">Suite {residence.roomNumber} Accommodation</strong>
                  <span className="text-slate-500 text-xs">{residence.name}</span>
                </div>
                <span className="font-mono font-bold text-slate-900 text-sm whitespace-nowrap">
                  PKR {suiteSubtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 text-xs pt-1.5 border-t border-slate-200/70">
                <span>Duration: {nights} Nights</span>
                <span>Rate: PKR {nightlyRate.toLocaleString()}/night</span>
              </div>

              {/* Any additional service line items */}
              {(booking.diningOrders || []).map((item, idx) => (
                <div key={`m-item-${idx}`} className="flex justify-between pt-1 text-slate-700 border-t border-slate-200/50">
                  <span>{item.title}</span>
                  <span className="font-mono font-medium">PKR {item.price?.toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Desktop View: Full 4-Column Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 uppercase text-[11px] border-y border-slate-200">
                    <th className="py-2 px-3 text-left font-semibold">Description</th>
                    <th className="py-2 px-3 text-center font-semibold">Duration</th>
                    <th className="py-2 px-3 text-right font-semibold">Rate (PKR)</th>
                    <th className="py-2 px-3 text-right font-semibold">Amount (PKR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-slate-900 block">Suite {residence.roomNumber} Accommodation</span>
                      <span className="text-[11px] text-slate-500">{residence.name}</span>
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-600">{nights} Nights</td>
                    <td className="py-2.5 px-3 text-right text-slate-600 font-mono">{nightlyRate.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-semibold text-slate-900 font-mono">{suiteSubtotal.toLocaleString()}</td>
                  </tr>

                  {(booking.diningOrders || []).map((item, idx) => (
                    <tr key={`item-${idx}`}>
                      <td className="py-2 px-3 text-slate-800">{item.title}</td>
                      <td className="py-2 px-3 text-center text-slate-600">1</td>
                      <td className="py-2 px-3 text-right text-slate-600 font-mono">{item.price?.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right font-medium text-slate-900 font-mono">{item.price?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="bg-[#FAF8F5] p-3.5 sm:p-4 rounded-md border border-slate-200 flex justify-end">
            <div className="w-full sm:w-80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Services Subtotal:</span>
                <span className="font-mono text-slate-900 font-medium">PKR {netSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Sindh Sales Tax (13%):</span>
                <span className="font-mono text-slate-900 font-medium">PKR {sindhTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold border-t border-slate-200 pt-2 text-sm">
                <span>Total Amount:</span>
                <span className="font-mono">PKR {totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1.5 rounded border border-emerald-200">
                <span>30% Advance Deposit Paid:</span>
                <span className="font-mono">- PKR {advancePaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold pt-1 text-xs">
                <span className={balanceDue === 0 ? 'text-emerald-800' : 'text-amber-900'}>
                  {balanceDue === 0 ? 'Balance (Settled):' : 'Balance Due at Check-in:'}
                </span>
                <span className={`font-mono text-sm ${balanceDue === 0 ? 'text-emerald-800' : 'text-amber-900'}`}>
                  PKR {balanceDue.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Verification Notice */}
          <div className="bg-slate-50 border border-slate-200 rounded p-3 text-[11px] text-slate-600 leading-relaxed">
            <strong className="text-emerald-800 block mb-0.5">
              [ Verified Reservation ] &bull; 30% Online Advance Deposit Confirmed
            </strong>
            This official tax invoice is system-generated in accordance with Sindh Revenue Board (SRB) rules.
            Please present this booking reference or valid CNIC/Passport upon arrival at the Front Desk.
          </div>

          {/* Mobile Bottom Action: Full-width download button */}
          <div className="sm:hidden pt-2">
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="w-full py-3 bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-md flex items-center justify-center gap-2 shadow-sm cursor-pointer touch-target"
            >
              <span>Download Official PDF Receipt</span>
              <span>&darr;</span>
            </button>
          </div>

          {/* Footer */}
          <div className="pt-2 text-center text-[10px] text-slate-400">
            Stayza Hotel &amp; Resort &bull; Coastal Road, Sindh, Pakistan &bull; www.stayza.pk
          </div>
        </div>
      </div>
    </div>
  )
}
