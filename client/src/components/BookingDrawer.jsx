import React, { useEffect, useState } from 'react'

export default function BookingDrawer({ isOpen, onClose, residence, onConfirmBooking }) {
  const [secondsLeft, setSecondsLeft] = useState(300) // 5 minutes atomic lock
  const [isProcessing, setIsProcessing] = useState(false)

  // 5-minute countdown timer logic
  useEffect(() => {
    if (!isOpen) {
      setSecondsLeft(300)
      return
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen])

  if (!isOpen || !residence) return null

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`
  }

  // Financial calculations
  const nights = 4
  const subtotal = residence.nightlyRate * nights
  const tax = Math.round(subtotal * 0.13)
  const total = subtotal + tax
  const advance = Math.round(total * 0.3)
  const balance = total - advance

  const handlePaySafepay = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      onConfirmBooking({
        residence,
        nights,
        total,
        advance,
        balance,
        safepayRef: `SPF-${Math.floor(100000 + Math.random() * 900000)}`,
      })
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between p-6 sm:p-8">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-[10px] tracking-[0.25em] text-slate-400 font-bold uppercase">
                RESERVATION FOLIO
              </span>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-800 text-sm font-bold p-1"
              >
                ✕ CLOSE
              </button>
            </div>

            {/* Atomic Lock Banner */}
            <div className="mt-4 p-3.5 bg-amber-50/80 border border-amber-200 rounded-xs flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[9px] tracking-[0.2em] font-bold text-amber-900 uppercase block">
                  PESSIMISTIC INVENTORY HOLD
                </span>
                <span className="text-[11px] text-amber-800">
                  Room {residence.roomNumber} locked exclusively for you.
                </span>
              </div>
              <span className="font-mono text-base font-extrabold text-amber-900 bg-white px-2 py-1 rounded border border-amber-200">
                {formatTimer(secondsLeft)}
              </span>
            </div>

            {/* Residence Monograph Summary */}
            <div className="mt-6 flex items-start gap-4">
              <img
                src={residence.detailImage}
                alt={residence.name}
                className="w-20 h-20 object-cover rounded-xs border border-slate-200"
              />
              <div>
                <span className="text-[9px] tracking-[0.2em] font-bold text-emerald-900 uppercase">
                  {residence.tier}
                </span>
                <h3 className="font-serif-grand text-xl text-slate-900 font-medium">
                  {residence.name}
                </h3>
                <span className="text-xs text-slate-500 block mt-1">
                  Check-in: Nov 24 &bull; Check-out: Nov 28 (4 Nights)
                </span>
              </div>
            </div>

            {/* Financial Telemetry Breakdown */}
            <div className="mt-8 space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>4 Nights &times; PKR {residence.nightlyRate.toLocaleString()}</span>
                <span className="font-semibold text-slate-900">
                  PKR {subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Sindh Sales Tax (13%)</span>
                <span className="font-semibold text-slate-900">
                  PKR {tax.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-100">
                <span>Total Stay Valuation</span>
                <span>PKR {total.toLocaleString()}</span>
              </div>

              {/* Deposit Split Architecture */}
              <div className="mt-4 p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xs space-y-2">
                <div className="flex justify-between text-xs font-bold text-emerald-950">
                  <span>30% ONLINE ADVANCE (SAFEPAY)</span>
                  <span className="text-sm">PKR {advance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>70% Remaining Front-Desk Balance</span>
                  <span>PKR {balance.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-6 border-t border-slate-100">
            <button
              onClick={handlePaySafepay}
              disabled={isProcessing || secondsLeft === 0}
              className="tactile w-full py-4 bg-emerald-950 hover:bg-slate-900 text-white text-[10px] tracking-[0.25em] font-bold uppercase transition-colors flex items-center justify-center gap-2 disabled:bg-slate-300"
            >
              {isProcessing ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  AUTHENTICATING SAFEPAY...
                </>
              ) : secondsLeft === 0 ? (
                'HOLD EXPIRED — REFRESH'
              ) : (
                `CONFIRM & DEPOSIT PKR ${advance.toLocaleString()}`
              )}
            </button>
            <span className="block text-center text-[9px] tracking-[0.15em] text-slate-400 uppercase mt-2.5">
              Encrypted 256-Bit Safepay Sandbox &bull; Instant Confirmation
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
