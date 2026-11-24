import React, { useEffect, useState } from 'react'

export default function CheckInModal({
  isOpen,
  onClose,
  selectedArrival,
  rooms = [],
  onConfirmCheckIn,
}) {
  const [selectedRoomNumber, setSelectedRoomNumber] = useState('')
  const [rfidKey, setRfidKey] = useState('KF-8921')
  const [settleBalanceNow, setSettleBalanceNow] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('CASH')
  const [isCalibrating, setIsCalibrating] = useState(false)
  const [isRendered, setIsRendered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Sync selected room when arrival opens
  useEffect(() => {
    if (selectedArrival) {
      setSelectedRoomNumber(selectedArrival.roomNumber || '')
      setSettleBalanceNow(false)
      setPaymentMethod('CASH')
    }
  }, [selectedArrival])

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

  if (!isRendered || !selectedArrival) return null

  // Lookup target room status
  const currentRoom = rooms.find((r) => r.roomNumber === selectedRoomNumber)
  const isDirty = currentRoom && (currentRoom.status === 'DIRTY' || currentRoom.status === 'CLEANING')
  const isMaintenance = currentRoom && currentRoom.status === 'MAINTENANCE'
  const isOccupied = currentRoom && currentRoom.status === 'OCCUPIED'
  const isBlocked = isDirty || isMaintenance || isOccupied

  // Pricing & Balance calculations
  const totalAmount = selectedArrival.totalValuation || (selectedArrival.advancePaid ? Math.round(selectedArrival.advancePaid / 0.3) : 0)
  const advancePaid = selectedArrival.advancePaid || 0
  const balanceDue = Math.max(0, totalAmount - advancePaid)

  // Available clean suites for upgrade/reassignment
  const cleanSuites = rooms.filter((r) => r.status === 'AVAILABLE')

  const handleProcess = (e) => {
    e.preventDefault()
    if (isBlocked) return

    setIsCalibrating(true)
    setTimeout(() => {
      setIsCalibrating(false)
      onConfirmCheckIn(selectedArrival.id, selectedRoomNumber, {
        paymentMethod: settleBalanceNow ? paymentMethod : null,
        settleBalanceNow,
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
        className={`bg-[#FAF8F5] border-t sm:border border-slate-300 rounded-t-2xl sm:rounded-[3px] shadow-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto overscroll-contain p-5 sm:p-8 space-y-5 sm:space-y-6 will-change-transform transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-default ${
          isVisible ? 'translate-y-0 opacity-100 sm:scale-100' : 'translate-y-8 opacity-0 sm:translate-y-0 sm:scale-95'
        }`}
      >
        {/* Mobile Sheet Grab Handle */}
        <div className="sm:hidden flex justify-center -mt-1 mb-2">
          <div className="w-10 h-1 bg-slate-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-emerald-900 font-extrabold uppercase">
              FRONT DESK &bull; GUEST CHECK-IN
            </span>
            <h3 className="font-serif-grand text-2xl text-slate-900 mt-0.5">
              Check-In {selectedArrival.guest}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close check-in modal"
            className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 text-lg cursor-pointer font-bold transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Guest Summary Card */}
        <div className="p-4 bg-white border border-slate-200/80 rounded-[2px] text-xs font-mono space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500">Contact Number:</span>
            <span className="text-slate-900 font-bold">{selectedArrival.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">National ID / CNIC:</span>
            <span className="text-slate-900 font-bold">
              {selectedArrival.identificationNumber || selectedArrival.guestDetails?.identificationNumber || 'Verified Online'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Duration:</span>
            <span className="text-slate-700">{selectedArrival.nights || 1} {selectedArrival.nights === 1 ? 'Night' : 'Nights'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Online Deposit (30% Safepay):</span>
            <span className="font-bold text-emerald-900">PKR {advancePaid.toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-t border-slate-100 pt-2 text-slate-900 font-bold">
            <span>Remaining 70% Balance Due:</span>
            <span className="text-amber-950">PKR {balanceDue.toLocaleString()}</span>
          </div>
        </div>

        <form onSubmit={handleProcess} className="space-y-5">
          {/* 1. ROOM ASSIGNMENT & DIRTY ROOM GUARD */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-wider font-semibold text-slate-600 block">
              Assigned Suite (Reassign or Upgrade if Needed):
            </label>
            <select
              value={selectedRoomNumber}
              onChange={(e) => setSelectedRoomNumber(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-[2px] text-xs font-mono text-slate-900 focus:outline-none focus:border-slate-900"
            >
              {/* Currently Assigned Room Option */}
              {selectedRoomNumber && (
                <option value={selectedRoomNumber}>
                  {selectedRoomNumber} &bull; {currentRoom?.tier || 'Assigned Suite'} {currentRoom ? `[${currentRoom.status}]` : ''}
                </option>
              )}
              {/* Clean Available Suites */}
              {cleanSuites
                .filter((r) => r.roomNumber !== selectedRoomNumber)
                .map((r) => (
                  <option key={r.roomNumber} value={r.roomNumber}>
                    {r.roomNumber} &bull; {r.name} [CLEAN &amp; AVAILABLE]
                  </option>
                ))}
            </select>

            {/* Dirty Room Alert Barrier */}
            {isDirty && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-[2px] text-xs font-mono text-red-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <span>&bull;</span>
                  <span>SUITE NOT READY: {selectedRoomNumber} is currently {currentRoom.status}</span>
                </div>
                <p className="text-[11px] text-red-700">
                  Housekeeping has not certified this suite. You cannot check in a guest to an uncleaned room. Reassign to an available clean suite above or wait for turnover.
                </p>
              </div>
            )}

            {isMaintenance && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-[2px] text-xs font-mono text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <span>&bull;</span>
                  <span>MAINTENANCE HOLD: {selectedRoomNumber} is locked for repairs</span>
                </div>
                <p className="text-[11px] text-amber-700">
                  Please select an alternative available suite from the dropdown above.
                </p>
              </div>
            )}

            {isOccupied && currentRoom?.roomNumber !== selectedArrival.roomNumber && (
              <div className="p-3 bg-slate-100 border border-slate-300 rounded-[2px] text-xs font-mono text-slate-800">
                This suite is currently occupied by another in-house guest.
              </div>
            )}
          </div>

          {/* 2. 70% BALANCE SETTLEMENT OPTION */}
          {balanceDue > 0 && (
            <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-[2px] space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-700 block">
                Balance Collection at Check-In (PKR {balanceDue.toLocaleString()})
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                <label
                  className={`flex items-center gap-2 p-2.5 border rounded-[2px] cursor-pointer transition-colors ${
                    settleBalanceNow
                      ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 font-bold'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="settleOption"
                    checked={settleBalanceNow}
                    onChange={() => setSettleBalanceNow(true)}
                    className="accent-emerald-900"
                  />
                  <span>Collect Now at Desk</span>
                </label>

                <label
                  className={`flex items-center gap-2 p-2.5 border rounded-[2px] cursor-pointer transition-colors ${
                    !settleBalanceNow
                      ? 'border-slate-900 bg-slate-100 text-slate-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="settleOption"
                    checked={!settleBalanceNow}
                    onChange={() => setSettleBalanceNow(false)}
                    className="accent-slate-900"
                  />
                  <span>Pay at Check-Out</span>
                </label>
              </div>

              {/* Payment Method Selector if collecting now */}
              {settleBalanceNow && (
                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-600 text-[11px]">Payment Mode:</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CASH')}
                      className={`px-3 py-1.5 rounded-[2px] text-xs font-mono uppercase font-bold transition-colors cursor-pointer ${
                        paymentMethod === 'CASH'
                          ? 'bg-[#0E1201] text-[#FFF0CA]'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Cash Drawer
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CARD_POS')}
                      className={`px-3 py-1.5 rounded-[2px] text-xs font-mono uppercase font-bold transition-colors cursor-pointer ${
                        paymentMethod === 'CARD_POS'
                          ? 'bg-[#0E1201] text-[#FFF0CA]'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Card POS Machine
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. ROOM KEYCARD ISSUANCE */}
          <div>
            <label className="text-[10px] font-mono uppercase tracking-wider font-semibold text-slate-500 block mb-1">
              Issue Room Keycard (RFID Key)
            </label>
            <input
              type="text"
              required
              maxLength={50}
              value={rfidKey}
              onChange={(e) => setRfidKey(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-[2px] text-xs font-mono text-slate-900 focus:outline-none focus:border-slate-900"
            />
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-[2px] text-[11px] font-mono text-emerald-900">
            Digital NFC Room Pass will be synchronized automatically to guest mobile app.
          </div>

          {/* Actions */}
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
              disabled={isCalibrating || isBlocked}
              className={`px-5 py-2.5 text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors ${
                isBlocked
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] cursor-pointer shadow-md'
              }`}
            >
              {isCalibrating
                ? 'Encoding Keycard...'
                : isBlocked
                ? 'Suite Not Ready (Blocked)'
                : 'Complete Check-In →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
