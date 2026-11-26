import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function BookingLookup({
  currentUser,
  bookingCode,
  setBookingCode,
  guestEmailInput,
  setGuestEmailInput,
  searchError,
  onSubmit,
  onLoadDemo,
}) {
  const [localError, setLocalError] = useState('')
  const [showManualLookup, setShowManualLookup] = useState(!currentUser)
  const [isDemoLoading, setIsDemoLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDemoClick = () => {
    if (isDemoLoading) return
    setIsDemoLoading(true)
    if (onLoadDemo) {
      onLoadDemo()
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')

    if (!bookingCode?.trim() && !guestEmailInput?.trim()) {
      setLocalError('Please enter your booking reference code.')
      return
    }

    if (onSubmit) {
      setIsSubmitting(true)
      try {
        await onSubmit(e)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <main className="flex-1 w-full flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-sm text-center">
        {currentUser && !showManualLookup ? (
          <div className="bg-white border border-slate-200/90 shadow-xl p-5 sm:p-6 rounded-2xl text-center space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-widest text-emerald-800 uppercase font-semibold block">
                SIGNED IN AS {currentUser.name.toUpperCase()}
              </span>
              <h2 className="font-syne text-xl text-slate-900 font-bold">
                No Active Stay
              </h2>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-normal font-sans-clean">
                Reserve a luxury suite or explore the in-suite guest portal below.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <Link
                to="/suites"
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-[#FFF0CA] font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs min-h-[44px] active:scale-[0.98]"
              >
                <span>Explore Suites &amp; Book</span>
                <span className="text-xs">&rarr;</span>
              </Link>

              {onLoadDemo && (
                <button
                  type="button"
                  disabled={isDemoLoading}
                  onClick={handleDemoClick}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer min-h-[44px] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  {isDemoLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-slate-700 border-t-transparent rounded-full animate-spin shrink-0" />
                      <span>Loading Suite 301...</span>
                    </>
                  ) : (
                    <span>Preview Demo Stay (Suite 301) &rarr;</span>
                  )}
                </button>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowManualLookup(true)}
                className="text-[11px] font-mono text-slate-500 hover:text-slate-900 underline cursor-pointer transition-colors"
              >
                Have a reference code? Link your stay &rarr;
              </button>
            </div>
          </div>
        ) : (
          /* Manual Lookup Form */
          <div className="bg-white border border-slate-200/90 shadow-xl p-5 sm:p-6 rounded-2xl text-left space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs font-mono">
              <span className="font-bold text-slate-900">Link Existing Stay</span>
              {currentUser && (
                <button
                  type="button"
                  onClick={() => setShowManualLookup(false)}
                  className="text-slate-500 hover:text-slate-900 underline cursor-pointer text-[11px]"
                >
                  &larr; Back
                </button>
              )}
            </div>

            <form onSubmit={handleFormSubmit} noValidate className="space-y-3">
              <div>
                <label className="text-[10px] font-mono tracking-wider font-semibold text-slate-500 uppercase block mb-1">
                  Booking Reference Code
                </label>
                <input
                  type="text"
                  maxLength={30}
                  value={bookingCode}
                  onChange={(e) => {
                    setBookingCode(e.target.value)
                    if (localError) setLocalError('')
                  }}
                  placeholder="e.g. ST-301-9041"
                  className={`w-full py-2 px-3 bg-slate-50 border rounded-xl text-xs font-mono uppercase tracking-wider text-slate-900 focus:outline-none transition-colors ${
                    localError
                      ? 'border-red-400 bg-red-50/20'
                      : 'border-slate-300 focus:border-slate-900'
                  }`}
                />
                {localError && (
                  <span className="text-[10px] text-red-600 font-mono mt-1 block">
                    {localError}
                  </span>
                )}
              </div>

              {searchError && (
                <div className="py-1.5 px-2.5 bg-red-50 border border-red-200 text-red-800 text-[11px] font-mono rounded-lg flex items-center gap-1.5">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>{searchError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="touch-target w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-[#FFF0CA] font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-amber-300 border-t-transparent rounded-full animate-spin shrink-0" />
                    <span>Accessing Stay...</span>
                  </>
                ) : (
                  <span>Access Stay &rarr;</span>
                )}
              </button>
            </form>

            {onLoadDemo && (
              <div className="pt-2 border-t border-slate-100 text-center">
                <button
                  type="button"
                  disabled={isDemoLoading}
                  onClick={handleDemoClick}
                  className="text-[11px] font-mono text-slate-600 hover:text-slate-900 font-semibold underline cursor-pointer transition-colors"
                >
                  {isDemoLoading ? 'Loading Demo Suite...' : 'Preview Demo Stay (Suite 301) →'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

