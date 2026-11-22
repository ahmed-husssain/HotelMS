import React, { useEffect, useState } from 'react'

export default function CheckoutInvoiceModal({
  isOpen,
  onClose,
  selectedRoom,
  taxRate = 13,
  onConfirmCheckout,
}) {
  const [paymentMethod, setPaymentMethod] = useState('CASH')
  const [isProcessing, setIsProcessing] = useState(false)
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

  const roomSubtotal = (selectedRoom.nightlyRate || 0) * (selectedRoom.nights || 1)
  const incidentalsTotal = (selectedRoom.incidentals || []).reduce((s, i) => s + (i.amount || i.price || 0), 0)
  const subtotal = roomSubtotal + incidentalsTotal
  const tax = Math.round(subtotal * (taxRate / 100))
  const grandTotal = subtotal + tax
  const paidAdvance = selectedRoom.advancePaid || 0
  const balanceDue = Math.max(0, grandTotal - paidAdvance)

  const handleCompleteSettlement = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      onConfirmCheckout(selectedRoom.roomNumber, {
        paymentMethod: balanceDue > 0 ? paymentMethod : null,
        amountPaid: balanceDue,
      })
      onClose()
    }, 600)
  }

  return (
    <div
      data-lenis-prevent="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className={`fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 transition-opacity duration-300 ease-out cursor-pointer ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        data-lenis-prevent="true"
        onClick={(e) => e.stopPropagation()}
        className={`bg-[#FAF8F5] border-t sm:border border-slate-300 rounded-t-2xl sm:rounded-[3px] shadow-2xl max-w-xl w-full p-5 sm:p-8 space-y-5 sm:space-y-6 will-change-transform transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] max-h-[92vh] overflow-y-auto overscroll-contain cursor-default ${
          isVisible ? 'translate-y-0 opacity-100 sm:scale-100' : 'translate-y-8 opacity-0 sm:translate-y-0 sm:scale-95'
        }`}
      >
        {/* Mobile Sheet Grab Handle */}
        <div className="sm:hidden flex justify-center -mt-1 mb-2">
          <div className="w-10 h-1 bg-slate-300 rounded-full" />
        </div>
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-emerald-900 font-extrabold uppercase">
              OFFICIAL TAX INVOICE &bull; STAYZA RESORTS &amp; SUITES
            </span>
            <h3 className="font-serif-grand text-2xl text-slate-900 mt-0.5">
              Settlement &amp; Check-Out
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout invoice modal"
            className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 text-lg cursor-pointer font-bold transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Invoice Header Details */}
        <div className="grid grid-cols-2 gap-4 text-xs font-mono p-4 bg-white border border-slate-200/80 rounded-[2px]">
          <div>
            <span className="text-slate-400 uppercase text-[9px] block">Guest Details:</span>
            <strong className="text-slate-900">{selectedRoom.guest || 'In-House Guest'}</strong>
            <div className="text-[11px] text-slate-500">{selectedRoom.phone || 'Phone verified'}</div>
          </div>
          <div className="text-right">
            <span className="text-slate-400 uppercase text-[9px] block">Invoice / Bill:</span>
            <strong className="text-slate-900">{selectedRoom.folioNumber || `INV-${selectedRoom.roomNumber?.replace(/\D/g, '')}-9041`}</strong>
            <div className="text-[11px] text-slate-500">SRB NTN: 8941203-9</div>
          </div>
        </div>

        {/* Itemized Line Items */}
        <div className="space-y-2 text-xs font-mono">
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span>Accommodation ({selectedRoom.nights || 1} Nights &times; PKR {selectedRoom.nightlyRate?.toLocaleString()})</span>
            <span className="font-bold text-slate-900">PKR {roomSubtotal.toLocaleString()}</span>
          </div>

          {(selectedRoom.incidentals || []).map((inc) => (
            <div key={inc.id} className="flex justify-between py-1 border-b border-slate-100 text-slate-700">
              <span>{inc.item || inc.title}</span>
              <span>+ PKR {(inc.amount || inc.price || 0).toLocaleString()}</span>
            </div>
          ))}

          <div className="flex justify-between py-1 border-b border-slate-100 text-slate-700">
            <span>Sindh Hospitality Sales Tax ({taxRate}%)</span>
            <span>+ PKR {tax.toLocaleString()}</span>
          </div>

          <div className="flex justify-between py-2 text-sm font-bold text-slate-900 border-t border-slate-200">
            <span>Total Amount:</span>
            <span>PKR {grandTotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between py-1 text-emerald-900 font-bold">
            <span>Less: 30% Safepay Online Deposit:</span>
            <span>- PKR {paidAdvance.toLocaleString()}</span>
          </div>

          <div className="flex justify-between py-2 text-base font-extrabold text-amber-950 bg-amber-50 px-3 rounded-[2px] border border-amber-200">
            <span>Balance Due at Front Desk:</span>
            <span>PKR {balanceDue.toLocaleString()}</span>
          </div>
        </div>

        {/* Payment Method Selector if Balance is Due (Flaw 2: The Unpaid Incidentals Checkout Leak) */}
        {balanceDue > 0 ? (
          <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-[2px] space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-700 block">
              Required: Select Settlement Mode for PKR {balanceDue.toLocaleString()}
            </span>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <button
                type="button"
                onClick={() => setPaymentMethod('CASH')}
                className={`p-3 text-left border rounded-[2px] transition-colors cursor-pointer ${
                  paymentMethod === 'CASH'
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="block text-sm font-bold">Cash Drawer</span>
                <span className="text-[10px] text-slate-500 font-normal">Physical currency into drawer</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CARD_POS')}
                className={`p-3 text-left border rounded-[2px] transition-colors cursor-pointer ${
                  paymentMethod === 'CARD_POS'
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="block text-sm font-bold">Card POS Slip</span>
                <span className="text-[10px] text-slate-500 font-normal">Bank Card Machine (POS Authorization)</span>
              </button>
            </div>
            <p className="text-[11px] font-mono text-slate-500">
              * Payment is recorded into today's front desk shift summary before room is released to housekeeping.
            </p>
          </div>
        ) : (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[2px] text-xs font-mono text-emerald-900">
            Folio is fully settled. No remaining balance due at front desk.
          </div>
        )}

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
            disabled={isProcessing}
            onClick={handleCompleteSettlement}
            className="px-5 py-2.5 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer shadow-md"
          >
            {isProcessing
              ? 'Settling & Releasing Room...'
              : balanceDue > 0
              ? `Collect PKR ${balanceDue.toLocaleString()} & Check-Out →`
              : 'Complete Check-Out & Release Room →'}
          </button>
        </div>
      </div>
    </div>
  )
}
