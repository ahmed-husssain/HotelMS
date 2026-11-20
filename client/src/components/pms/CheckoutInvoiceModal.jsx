import React, { useEffect, useState } from 'react'

export default function CheckoutInvoiceModal({
  isOpen,
  onClose,
  selectedRoom,
  taxRate = 13,
  onConfirmCheckout,
}) {
  const [isRendered, setIsRendered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Fluid Hardware-Accelerated Mount/Unmount lifecycle
  useEffect(() => {
    if (isOpen) {
      setIsRendered(true)
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true)
        })
      })
      return () => cancelAnimationFrame(raf)
    } else {
      setIsVisible(false)
      const timer = setTimeout(() => {
        setIsRendered(false)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

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

  if (!isRendered || !selectedRoom) return null

  const handlePrint = () => {
    window.print()
  }

  const handleCompleteSettlement = () => {
    onConfirmCheckout(selectedRoom.roomNumber)
    onClose()
  }

  const roomSubtotal = (selectedRoom.nightlyRate || 0) * (selectedRoom.nights || 1)
  const incidentalsTotal = (selectedRoom.incidentals || []).reduce((s, i) => s + i.amount, 0)
  const subtotal = roomSubtotal + incidentalsTotal
  const tax = Math.round(subtotal * (taxRate / 100))
  const grandTotal = subtotal + tax
  const paidAdvance = selectedRoom.advancePaid || 0
  const balanceDue = grandTotal - paidAdvance

  return (
    <div 
      data-lenis-prevent="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className={`fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 transition-opacity duration-200 ease-out cursor-pointer ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div 
        data-lenis-prevent="true"
        onClick={(e) => e.stopPropagation()}
        className={`bg-[#FAF8F5] border border-slate-300 rounded-[2px] shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 will-change-transform transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] max-h-[90vh] overflow-y-auto overscroll-contain cursor-default ${
          isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-2'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-emerald-900 font-extrabold uppercase">
              OFFICIAL TAX INVOICE &bull; STAYZA RESORTS &amp; SUITES
            </span>
            <h3 className="font-serif-grand text-2xl text-slate-900 mt-0.5">
              Settlement &amp; Check-out
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 text-lg cursor-pointer font-bold"
          >
            &times;
          </button>
        </div>

        {/* Invoice Header Details */}
        <div className="grid grid-cols-2 gap-4 text-xs font-mono p-4 bg-white border border-slate-200/80 rounded-[2px]">
          <div>
            <span className="text-slate-400 uppercase text-[9px] block">Guest Details:</span>
            <strong className="text-slate-900">{selectedRoom.guest}</strong>
            <div className="text-[11px] text-slate-500">{selectedRoom.phone}</div>
          </div>
          <div className="text-right">
            <span className="text-slate-400 uppercase text-[9px] block">Bill Number:</span>
            <strong className="text-slate-900">{selectedRoom.folioNumber}</strong>
            <div className="text-[11px] text-slate-500">NTN: 8941203-9</div>
          </div>
        </div>

        {/* Itemized Line Items */}
        <div className="space-y-2 text-xs font-mono">
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span>Accommodation ({selectedRoom.nights} Nights &times; PKR {selectedRoom.nightlyRate?.toLocaleString()})</span>
            <span className="font-bold text-slate-900">PKR {roomSubtotal.toLocaleString()}</span>
          </div>

          {(selectedRoom.incidentals || []).map((inc) => (
            <div key={inc.id} className="flex justify-between py-1 border-b border-slate-100 text-slate-700">
              <span>{inc.item}</span>
              <span>+ PKR {inc.amount.toLocaleString()}</span>
            </div>
          ))}

          <div className="flex justify-between py-1 border-b border-slate-100 text-slate-700">
            <span>Sindh Sales Tax ({taxRate}%)</span>
            <span>+ PKR {tax.toLocaleString()}</span>
          </div>

          <div className="flex justify-between py-2 text-sm font-bold text-slate-900 border-t border-slate-200">
            <span>Total Stay Valuation:</span>
            <span>PKR {grandTotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between py-1 text-emerald-900 font-bold">
            <span>Less: 30% Safepay Deposit Paid:</span>
            <span>- PKR {paidAdvance.toLocaleString()}</span>
          </div>

          <div className="flex justify-between py-2 text-base font-extrabold text-amber-950 bg-amber-50 px-3 rounded-[2px] border border-amber-200">
            <span>Balance Collected at Front Desk:</span>
            <span>PKR {balanceDue.toLocaleString()}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono uppercase font-bold rounded-[2px] transition-colors cursor-pointer"
          >
            Print Tax Receipt &darr;
          </button>

          <button
            type="button"
            onClick={handleCompleteSettlement}
            className="px-5 py-2.5 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer shadow-md"
          >
            Collect Balance &amp; Check-Out &rarr;
          </button>
        </div>
      </div>
    </div>
  )
}
