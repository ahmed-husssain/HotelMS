import React, { useState } from 'react'

export default function CheckInModal({ isOpen, onClose, selectedArrival, onConfirmCheckIn }) {
  const [rfidKey, setRfidKey] = useState('KF-8921')
  const [isCalibrating, setIsCalibrating] = useState(false)

  if (!isOpen || !selectedArrival) return null

  const handleProcess = (e) => {
    e.preventDefault()
    setIsCalibrating(true)
    setTimeout(() => {
      setIsCalibrating(false)
      onConfirmCheckIn(selectedArrival.id, selectedArrival.roomNumber)
      onClose()
    }, 800)
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF8F5] border border-slate-300 rounded-[2px] shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 animate-scale-in">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-emerald-900 font-extrabold uppercase">
              // RECEPTION PMS CHECK-IN
            </span>
            <h3 className="font-serif-grand text-2xl text-slate-900 mt-0.5">
              Check-In {selectedArrival.guest}
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

        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-[2px] text-xs font-mono space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500">Suite Assignment:</span>
            <span className="font-bold text-slate-900">{selectedArrival.roomNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Contact Number:</span>
            <span className="text-slate-700">{selectedArrival.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Safepay 30% Advance:</span>
            <span className="font-bold text-emerald-900">PKR {selectedArrival.advancePaid?.toLocaleString()}</span>
          </div>
        </div>

        <form onSubmit={handleProcess} className="space-y-4">
          <div>
            <label className="text-[10px] font-mono uppercase tracking-wider font-semibold text-slate-500 block mb-1">
              Calibrate RFID Physical Keycard
            </label>
            <input
              type="text"
              required
              value={rfidKey}
              onChange={(e) => setRfidKey(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-[2px] text-xs font-mono text-slate-900 focus:outline-none focus:border-slate-900"
            />
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-[2px] text-[11px] font-mono text-emerald-900">
            Digital NFC Room Pass will be synchronized automatically to guest mobile app.
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
              disabled={isCalibrating}
              className="px-5 py-2.5 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer"
            >
              {isCalibrating ? 'Calibrating Keycard...' : 'Complete Check-In →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
