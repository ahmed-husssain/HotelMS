import React, { useEffect, useState } from 'react'
import { useHotelData } from '../../context/HotelDataContext'

export default function ShiftClosingModal({ isOpen, onClose, currentUser }) {
  const {
    openingFloat,
    cashCollected,
    cardPOS,
    expectedCashTotal,
    deskPayments = [],
    closeCashierShift,
  } = useHotelData()

  const [countedCash, setCountedCash] = useState('')
  const [shiftNotes, setShiftNotes] = useState('All front desk check-outs verified. Drawer balanced.')
  const [isClosed, setIsClosed] = useState(false)
  const [isRendered, setIsRendered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Initialize counted cash to expected drawer total when opened
  useEffect(() => {
    if (isOpen) {
      setCountedCash(String(expectedCashTotal))
    }
  }, [isOpen, expectedCashTotal])

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

  if (!isRendered) return null

  const discrepancy = Number(countedCash || 0) - expectedCashTotal
  const hasDiscrepancy = discrepancy !== 0
  const isNotesMissing = hasDiscrepancy && (!shiftNotes || shiftNotes.trim().length < 5)

  const handleCloseShift = (e) => {
    e.preventDefault()
    if (isNotesMissing) return

    setIsClosed(true)
    closeCashierShift({
      countedCash,
      shiftNotes,
      actorName: currentUser?.name || 'Sara Ahmed (Front Desk)',
    })

    setTimeout(() => {
      setIsClosed(false)
      onClose()
    }, 900)
  }

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
        className={`bg-[#FAF8F5] border border-slate-300 rounded-[2px] shadow-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto overscroll-contain p-6 sm:p-8 space-y-6 will-change-transform transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-default ${
          isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-2'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-emerald-900 font-extrabold uppercase">
              CASHIER SHIFT CLOSING &bull; Z-REPORT
            </span>
            <h3 className="font-serif-grand text-2xl text-slate-900 mt-0.5">
              Shift Closing &amp; Drawer Balancing
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

        {/* Real Cashier Telemetry Summary */}
        <div className="p-4 bg-white border border-slate-200/80 rounded-[2px] text-xs font-mono space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500">Cashier on Duty:</span>
            <strong className="text-slate-900">{currentUser?.name || 'Sara Ahmed'}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Opening Cash Float:</span>
            <span>PKR {openingFloat.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Desk Cash Collected Today:</span>
            <span className="text-emerald-900 font-bold">+ PKR {cashCollected.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Card POS Slips Verified:</span>
            <span className="text-slate-800">PKR {cardPOS.toLocaleString()}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
            <span>Expected Cash Drawer:</span>
            <span className="text-emerald-950 font-bold">PKR {expectedCashTotal.toLocaleString()}</span>
          </div>
        </div>

        {/* Itemized Desk Transactions (Recent) */}
        {deskPayments.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-slate-500 block">
              Today's Desk Transactions ({deskPayments.length}):
            </span>
            <div className="max-h-28 overflow-y-auto space-y-1 pr-1 font-mono text-[11px]">
              {deskPayments.slice(0, 5).map((pay) => (
                <div
                  key={pay.id}
                  className="p-2 bg-slate-50 border border-slate-200/60 rounded-[2px] flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-slate-900">{pay.roomNumber || 'Front Desk'}</span>
                    <span className="text-slate-500 ml-1.5">({pay.guest || 'Guest'})</span>
                    <span className="text-slate-400 ml-1.5 text-[10px]">{pay.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-[2px] font-bold ${
                        pay.method === 'CASH'
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-blue-100 text-blue-900'
                      }`}
                    >
                      {pay.method}
                    </span>
                    <strong className="text-slate-900 font-bold">PKR {pay.amount.toLocaleString()}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleCloseShift} className="space-y-4">
          <div>
            <label className="text-[10px] font-mono uppercase tracking-wider font-semibold text-slate-600 block mb-1">
              Physically Counted Cash in Drawer (PKR):
            </label>
            <input
              type="number"
              required
              value={countedCash}
              onChange={(e) => setCountedCash(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-[2px] text-xs font-mono text-slate-900 focus:outline-none focus:border-slate-900"
            />
          </div>

          {/* Variance Badge */}
          <div
            className={`p-3 rounded-[2px] text-xs font-mono flex justify-between items-center ${
              discrepancy === 0
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                : discrepancy < 0
                ? 'bg-red-50 text-red-900 border border-red-200'
                : 'bg-amber-50 text-amber-900 border border-amber-200'
            }`}
          >
            <span className="font-semibold">
              {discrepancy === 0
                ? 'Drawer Status:'
                : discrepancy < 0
                ? 'Cash Shortage Detected:'
                : 'Cash Overage Detected:'}
            </span>
            <strong className="font-bold text-sm">
              {discrepancy === 0
                ? 'PKR 0 (BALANCED)'
                : `${discrepancy < 0 ? '-' : '+'}PKR ${Math.abs(discrepancy).toLocaleString()}`}
            </strong>
          </div>

          {/* Handover remarks */}
          <div>
            <label className="text-[10px] font-mono uppercase tracking-wider font-semibold text-slate-600 block mb-1">
              Handover Remarks / Discrepancy Explanation:
              {hasDiscrepancy && (
                <span className="text-red-700 font-bold ml-1">* Mandatory for variance</span>
              )}
            </label>
            <textarea
              rows="2"
              required={hasDiscrepancy}
              value={shiftNotes}
              onChange={(e) => setShiftNotes(e.target.value)}
              placeholder={
                hasDiscrepancy
                  ? 'Required: Explain drawer shortage/overage reason before closing...'
                  : 'Enter handover notes for incoming cashier...'
              }
              className={`w-full px-3 py-2 bg-white border rounded-[2px] text-xs font-mono text-slate-900 focus:outline-none ${
                isNotesMissing
                  ? 'border-red-400 focus:border-red-700 bg-red-50/20'
                  : 'border-slate-300 focus:border-slate-900'
              }`}
            />
            {isNotesMissing && (
              <p className="text-[11px] font-mono text-red-700 mt-1">
                Please enter a brief note explaining the PKR {Math.abs(discrepancy).toLocaleString()} variance before closing.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono uppercase text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isClosed || isNotesMissing}
              className={`px-5 py-2.5 text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors ${
                isNotesMissing
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] cursor-pointer shadow-md'
              }`}
            >
              {isClosed ? 'Shift Handover Certified!' : 'Certify & Close Shift →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
