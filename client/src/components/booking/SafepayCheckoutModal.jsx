import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * SafepayCheckoutModal
 * 
 * High-performance, isolated checkout modal for the 30% advance deposit.
 * Manages its own 5-minute atomic hold countdown to prevent parent page re-renders.
 * Eliminates GPU-heavy full-viewport blur for instant, responsive rendering.
 */
export default function SafepayCheckoutModal({
  session,
  residenceName,
  onCancel,
}) {
  const navigate = useNavigate()
  const [secondsRemaining, setSecondsRemaining] = useState(300)

  // Isolated countdown timer: Only re-renders this tiny modal header, not the parent BookingPage
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!session) return null

  const minutes = String(Math.floor(secondsRemaining / 60)).padStart(2, '0')
  const seconds = String(secondsRemaining % 60).padStart(2, '0')

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Safepay Sandbox Checkout"
      className="fixed inset-0 z-50 bg-[#0E1201]/85 flex items-center justify-center p-4 sm:p-6 animate-fade-in"
    >
      <div className="max-w-md w-full bg-[#FAF8F5] text-slate-900 border border-slate-300 shadow-2xl rounded-[3px] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#0E1201] text-[#FAF8F5] px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest font-bold text-[#FAF8F5]">
              Safepay Hosted Gateway
            </span>
          </div>

          {/* 5-Minute Countdown Badge */}
          <div className="px-2.5 py-1 bg-black/60 border border-white/10 rounded-full font-mono text-[10px] text-emerald-300 font-bold flex items-center gap-1.5">
            <span>⏱ Hold:</span>
            <span>{minutes}:{seconds}</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500 font-bold block">
              Suite Hold Active &bull; Reference {session.bookingRef}
            </span>
            <h3 className="font-serif-grand text-xl text-slate-900">
              Suite {session.roomNumber} &bull; {residenceName}
            </h3>
          </div>

          {/* Two-Stage Deposit Breakdown */}
          <div className="p-4 bg-slate-100/90 border border-slate-200 rounded-[2px] space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-slate-600">
              <span>Total Stay Valuation:</span>
              <span className="font-semibold text-slate-900">
                PKR {session.totalAmount?.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-y border-slate-200 text-slate-900 font-bold">
              <span className="flex items-center gap-1 text-emerald-900">
                <span>30% Advance Deposit Due:</span>
              </span>
              <span className="text-base text-emerald-950">
                PKR {session.advanceAmount?.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-500 text-[11px]">
              <span>Remaining 70% at Hotel Check-In:</span>
              <span>
                PKR {(session.totalAmount - session.advanceAmount)?.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Notice */}
          <p className="text-[11px] text-slate-600 font-mono leading-relaxed">
            Your suite is securely locked with a 5-minute atomic hold. Select an option below to authorize the advance deposit.
          </p>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-1">
            {/* 1. Official Safepay Sandbox Gateway */}
            {session.checkoutUrl && session.checkoutUrl !== '#' && (
              <a
                href={session.checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-slate-900 hover:bg-[#0E1201] text-[#FAF8F5] font-mono text-xs font-bold uppercase tracking-widest rounded-[2px] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer"
              >
                <span>Open Safepay Sandbox Portal</span>
                <span className="text-sm">&rarr;</span>
              </a>
            )}

            {/* 2. Instant Simulator for Viva Examination / Presentation */}
            <button
              type="button"
              onClick={() => {
                navigate(`/payment/verify?ref=${session.bookingRef}&tracker=${session.trackerToken}`)
              }}
              className="w-full py-3 bg-emerald-950 hover:bg-emerald-900 text-emerald-200 font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.98]"
            >
              <span>Authorize &amp; Settle (Viva Defense Simulator)</span>
              <span className="text-xs">&#10003;</span>
            </button>

            {/* 3. Cancel & Release Hold */}
            <button
              type="button"
              onClick={onCancel}
              className="w-full py-2.5 text-slate-500 hover:text-red-700 text-xs font-mono tracking-wider uppercase transition-colors cursor-pointer"
            >
              Cancel &amp; Release Suite Hold
            </button>
          </div>
        </div>

        {/* Modal Footer Note */}
        <div className="bg-slate-50 px-6 py-2.5 border-t border-slate-200 text-center font-mono text-[9px] text-slate-500">
          Encrypted SSL &bull; HMAC-SHA256 Signed &bull; Idempotent Ledger Protected
        </div>
      </div>
    </div>
  )
}
