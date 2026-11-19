import React, { useEffect, useState } from 'react'

export default function ShiftClosingModal({ isOpen, onClose, currentUser }) {
  const [openingFloat] = useState(50000)
  const [cashCollected] = useState(261030)
  const [cardPOS] = useState(145000)
  const [countedCash, setCountedCash] = useState('311030') // 50000 + 261030
  const [shiftNotes, setShiftNotes] = useState('All front desk check-outs verified. No drawer discrepancy.')
  const [isClosed, setIsClosed] = useState(false)
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

  if (!isRendered) return null

  const expectedTotal = openingFloat + cashCollected
  const discrepancy = Number(countedCash || 0) - expectedTotal

  const handleCloseShift = (e) => {
    e.preventDefault()
    setIsClosed(true)
    setTimeout(() => {
      onClose()
    }, 1200)
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
        className={`bg-[#FAF8F5] border border-slate-300 rounded-[2px] shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto overscroll-contain p-6 sm:p-8 space-y-6 will-change-transform transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-default ${
          isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-2'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-emerald-900 font-extrabold uppercase">
              Cashier Shift Closing
            </span>
            <h3 className="font-serif-grand text-2xl text-slate-900 mt-0.5">
              Shift Z-Report Handover
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
            <span className="text-slate-500">Desk Cash Collected:</span>
            <span className="text-emerald-900 font-bold">+ PKR {cashCollected.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Card POS Slips:</span>
            <span className="text-slate-800">PKR {cardPOS.toLocaleString()}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
            <span>Expected Cash Drawer:</span>
            <span>PKR {expectedTotal.toLocaleString()}</span>
          </div>
        </div>

        <form onSubmit={handleCloseShift} className="space-y-4">
          <div>
            <label className="text-[10px] font-mono uppercase tracking-wider font-semibold text-slate-500 block mb-1">
              Physically Counted Cash Drawer:
            </label>
            <input
              type="number"
              required
              value={countedCash}
              onChange={(e) => setCountedCash(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-[2px] text-xs font-mono text-slate-900 focus:outline-none focus:border-slate-900"
            />
          </div>

          <div
            className={`p-3 rounded-[2px] text-xs font-mono flex justify-between items-center ${
              discrepancy === 0
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                : 'bg-red-50 text-red-900 border border-red-200'
            }`}
          >
            <span>Drawer Variance:</span>
            <strong>{discrepancy === 0 ? 'PKR 0 (BALANCED)' : `PKR ${discrepancy.toLocaleString()}`}</strong>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase tracking-wider font-semibold text-slate-500 block mb-1">
              Handover Remarks / Incident Notes:
            </label>
            <textarea
              rows="2"
              value={shiftNotes}
              onChange={(e) => setShiftNotes(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-[2px] text-xs font-mono text-slate-900 focus:outline-none focus:border-slate-900"
            />
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
              disabled={isClosed}
              className="px-5 py-2.5 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer"
            >
              {isClosed ? 'Shift Handover Logged!' : 'Certify & Close Shift →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
