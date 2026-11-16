import React, { useEffect, useState } from 'react'

/**
 * BookingDrawer — Luxury Stay Reservation Folio
 * Built to match the Big Picture Liquid Curve Navigation Menu:
 * - Edge-to-edge full screen on mobile (w-full)
 * - Sculptural curved slide-over on desktop (sm:w-[480px] md:w-[540px]) with organic liquid curve SVG
 * - Full max-h-[100dvh] with smooth vertical overflow-y-auto so no content or CTAs are cut off
 * - 5-minute pessimistic inventory hold countdown timer
 * - Zero-Trust 30% Safepay advance deposit split architecture
 */
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

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Escape key closes drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

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
        aria-hidden="true"
        className="fixed inset-0 bg-slate-950/45 backdrop-blur-xs transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      />

              {/* Slide-in Curved Drawer (Identical architecture to Navbar Menu) */}
              <aside
                role="dialog"
                aria-modal="true"
                aria-label="Reservation Folio"
                className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[480px] md:w-[540px] max-h-[100dvh] bg-[#FAF8F5] transition-transform duration-600 ease-[cubic-bezier(0.76,0,0.24,1)] will-change-transform shadow-2xl flex flex-col"
                style={{
                  transform: 'translate3d(0, 0, 0)',
                }}
              >
                {/* Organic Liquid Curve SVG Path (Left Edge of Drawer on Desktop) */}
                <div
                  className="absolute top-0 -left-[79px] sm:-left-[99px] w-[80px] sm:w-[100px] h-full pointer-events-none select-none -mr-px hidden sm:block z-20 text-[#FAF8F5]"
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 100 1000"
                    fill="currentColor"
                    preserveAspectRatio="none"
                    className="w-full h-full"
                  >
                    <path d="M100,0 L100,1000 Q0,500 100,0 Z" />
                  </svg>
                </div>

                {/* Scrollable Drawer Content Container */}
                <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-10 overflow-y-auto z-10">
                  {/* Top Section */}
                  <div className="space-y-6">
                    {/* Header Strip */}
                    <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-pulse" />
                        <span className="text-[10px] tracking-[0.25em] font-mono text-slate-800 font-bold uppercase">
                          RESERVATION FOLIO
                        </span>
                        <span className="text-slate-300">&middot;</span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">
                          ROOM {residence.roomNumber}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close Folio"
                        className="text-slate-500 hover:text-slate-900 text-xs font-mono font-bold px-2 py-1 rounded hover:bg-slate-200/60 transition-colors cursor-pointer"
                      >
                        ✕ CLOSE
                      </button>
                    </div>

                          {/* Atomic Pessimistic Hold Banner */}
                          <div className="p-3.5 bg-amber-50/90 border border-amber-200/90 rounded-[2px] flex items-center justify-between shadow-2xs">
                            <div className="space-y-0.5 pr-2">
                              <span className="text-[9px] tracking-[0.2em] font-bold text-amber-950 uppercase block">
                                PESSIMISTIC INVENTORY HOLD
                              </span>
                                <span className="text-[11px] text-amber-900/80">
                                  Room {residence.roomNumber} locked exclusively for your session.
                                </span>
                            </div>
                              <span className="font-mono text-sm font-extrabold text-amber-950 bg-white px-2.5 py-1 rounded-[2px] border border-amber-200 shrink-0 shadow-2xs">
                                {formatTimer(secondsLeft)}
                              </span>
                          </div>

                          {/* Residence Monograph Summary */}
                            <div className="flex items-center gap-4 p-3 bg-white border border-slate-200/70 rounded-[2px] shadow-2xs">
                              <img
                                src={residence.detailImage}
                                alt={residence.name}
                                className="w-20 h-20 object-cover rounded-[2px] border border-slate-200 shrink-0"
                              />
                                  <div className="min-w-0">
                                    <span className="text-[9px] tracking-[0.2em] font-bold text-emerald-900 uppercase block truncate">
                                      {residence.tier}
                                    </span>
                                      <h3 className="font-serif-grand text-lg text-slate-900 font-medium truncate mt-0.5">
                                        {residence.name}
                                      </h3>
                                        <span className="text-[11px] text-slate-500 block mt-1">
                                          Check-in: Nov 24 &bull; Check-out: Nov 28 (4 Nights)
                                        </span>
                                      </div>
                                  </div>

                                  {/* Financial Telemetry Breakdown */}
                                    <div className="space-y-3 pt-4 border-t border-slate-200/80 text-xs text-slate-600">
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

                                        <div className="flex justify-between text-sm font-bold text-slate-900 pt-2.5 border-t border-slate-200/80">
                                          <span>Total Stay Valuation</span>
                                          <span className="font-mono">PKR {total.toLocaleString()}</span>
                                        </div>

                                        {/* Deposit Split Architecture */}
                                            <div className="mt-4 p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-[2px] space-y-2">
                                              <div className="flex justify-between items-center text-xs font-bold text-emerald-950">
                                                <span className="tracking-wide">30% ONLINE ADVANCE (SAFEPAY)</span>
                                                <span className="font-mono text-sm">PKR {advance.toLocaleString()}</span>
                                              </div>
                                                <div className="flex justify-between text-[11px] text-slate-600 pt-1 border-t border-emerald-100">
                                                  <span>70% Remaining Front-Desk Balance</span>
                                                  <span className="font-mono">PKR {balance.toLocaleString()}</span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>

                                            {/* Bottom Action CTA Strip */}
                                            <div className="pt-6 border-t border-slate-200/80 mt-6 shrink-0">
                                              <button
                                                type="button"
                                                onClick={handlePaySafepay}
                                                disabled={isProcessing || secondsLeft === 0}
                                                className="tactile w-full py-4 bg-emerald-950 hover:bg-slate-900 text-[#FFF0CA] text-[10px] tracking-[0.25em] font-bold uppercase transition-all duration-300 rounded-[2px] flex items-center justify-center gap-2 disabled:bg-slate-300 shadow-md cursor-pointer active:scale-[0.98]"
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
                                                <span className="block text-center text-[9px] tracking-[0.15em] text-slate-400 uppercase mt-2.5 font-mono">
                                                  Encrypted 256-Bit Safepay Sandbox &bull; Instant Confirmation
                                                </span>
                                            </div>
                                          </div>
                                      </aside>
                                    </div>
                                    )
}
