import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * SafepayCheckoutModal — Clean, Minimal 30% Deposit Authorization
 * 
 * Simple, elegant modal that routes guests directly to Safepay's secure hosted portal.
 * No AI jargon, no distracting simulator banners.
 */
export default function SafepayCheckoutModal({
  session,
  residence,
  onCancel,
}) {
  const navigate = useNavigate()
  const [secondsRemaining, setSecondsRemaining] = useState(300)
  const [isRendered, setIsRendered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Fluid Hardware-Accelerated Mount/Unmount lifecycle (Apple Critically Damped Spring)
  useEffect(() => {
    setIsRendered(true)
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsVisible(true)
      })
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  // 5-Minute Hold Countdown
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

  // Keyboard accessibility: Escape to dismiss & Body Scroll Lock
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onCancel])

  if (!session || !isRendered) return null

  const minutes = String(Math.floor(secondsRemaining / 60)).padStart(2, '0')
  const seconds = String(secondsRemaining % 60).padStart(2, '0')
  const residenceName = residence?.name || session.residence?.name || 'Luxury Suite'
  const roomNumber = session.roomNumber || residence?.roomNumber || '301'
  const advanceAmount = session.advanceAmount || Math.round((session.totalAmount || 0) * 0.3)
  const balanceAmount = (session.totalAmount || 0) - advanceAmount

  // Construct official Safepay hosted checkout URL
  const safepayUrl =
    session.checkoutUrl && session.checkoutUrl !== '#'
      ? session.checkoutUrl
      : `https://sandbox.api.getsafepay.com/checkout?env=sandbox&beacon=${session.trackerToken || 'track_' + session.bookingRef}&order_id=${encodeURIComponent(
          session.bookingRef
        )}&source=magento2&webhooks=true&redirect_url=${encodeURIComponent(
          window.location.origin + '/payment/verify?ref=' + session.bookingRef
        )}&cancel_url=${encodeURIComponent(window.location.origin + '/reserve?cancelled=true&ref=' + session.bookingRef)}`

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Safepay Advance Deposit"
      data-lenis-prevent="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
      className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 transition-opacity duration-300 ease-out cursor-pointer ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div 
        data-lenis-prevent="true"
        onClick={(e) => e.stopPropagation()}
        className={`max-w-md w-full bg-[#FFFFFF] text-slate-900 border-t sm:border border-slate-200 shadow-2xl rounded-t-2xl sm:rounded-lg overflow-hidden flex flex-col cursor-default max-h-[92vh] sm:max-h-none overflow-y-auto overscroll-contain will-change-transform transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible ? 'translate-y-0 opacity-100 sm:scale-100' : 'translate-y-8 opacity-0 sm:translate-y-0 sm:scale-95'
        }`}
      >
        {/* Mobile Sheet Grab Handle */}
        <div className="pt-2 pb-1 bg-[#0F172A] sm:hidden flex justify-center">
          <div className="w-10 h-1 bg-white/30 rounded-full" />
        </div>

        {/* Header */}
        <div className="bg-[#0F172A] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-semibold tracking-wider uppercase text-white">
              Secure Deposit Guarantee
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-2.5 py-0.5 bg-white/10 rounded-full text-[11px] font-mono text-emerald-300 font-medium">
              Hold: {minutes}:{seconds}
            </div>
            <button
              type="button"
              onClick={onCancel}
              aria-label="Close checkout modal"
              className="w-8 h-8 rounded-full text-slate-300 hover:text-white hover:bg-white/10 flex items-center justify-center text-lg cursor-pointer transition-colors"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <div className="text-[11px] text-slate-500 font-medium">
              Reservation Reference: <strong className="text-slate-800">{session.bookingRef}</strong>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              Suite {roomNumber} &bull; {residenceName}
            </h3>
          </div>

          {/* Pricing Box */}
          <div className="bg-[#F8FAFC] border border-slate-200 rounded-md p-4 space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Total Stay (All-Inclusive):</span>
              <span className="font-semibold text-slate-900">
                PKR {session.totalAmount?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-y border-slate-200 text-slate-900 font-bold">
              <span className="text-emerald-800">30% Advance Deposit Due:</span>
              <span className="text-emerald-800 font-mono text-base">
                PKR {advanceAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-slate-500 text-xs">
              <span>Remaining 70% at Hotel Check-In:</span>
              <span>PKR {balanceAmount.toLocaleString()}</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Your suite is reserved for the next 5 minutes. You will now be redirected to Safepay to securely pay your 30% advance deposit.
          </p>

          {/* Primary Action Button */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => {
                window.location.href = safepayUrl
              }}
              className="w-full py-3.5 bg-[#0F172A] hover:bg-slate-800 active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider rounded-md transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <span>Pay PKR {advanceAmount.toLocaleString()} via Safepay</span>
              <span className="text-sm">&rarr;</span>
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="w-full py-2 text-slate-500 hover:text-slate-800 text-xs transition-colors cursor-pointer text-center"
            >
              Cancel reservation
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Protected by Safepay Sandbox</span>
          <span>Official 256-Bit SSL Encrypted</span>
        </div>
      </div>
    </div>
  )
}
