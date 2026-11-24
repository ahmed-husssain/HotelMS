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
  // If user is logged in but has no active stay, show the welcome card first unless they choose to link a code
  const [showManualLookup, setShowManualLookup] = useState(!currentUser)

  const handleFormSubmit = (e) => {
    e.preventDefault()
    setLocalError('')

    if (!bookingCode?.trim() && !guestEmailInput?.trim()) {
      setLocalError('Please enter your booking reference code.')
      return
    }

    if (onSubmit) {
      onSubmit(e)
    }
  }

  return (
    <main className="flex-1 w-full flex flex-col items-center justify-center px-4 sm:px-6 py-6">
      <div className="w-full max-w-md text-center space-y-4 my-auto">
        
        {/* Header Monogram */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono tracking-[0.25em] font-extrabold text-slate-800 uppercase block">
            GUEST SELF-SERVICE PORTAL
          </span>
          <h1 className="font-serif-grand text-2xl sm:text-3xl font-light text-slate-900 tracking-tight">
            {currentUser && !showManualLookup ? 'Your Guest Account' : 'Access Your Stay.'}
          </h1>
          <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
            {currentUser && !showManualLookup
              ? 'Manage active reservations, digital keycards, and in-suite hotel services.'
              : 'Enter your booking reference code to view your digital key, request in-room dining, and manage services.'}
          </p>
        </div>

        {/* 1. Logged-In User with No Active Stays -> Clear Welcome Hub */}
        {currentUser && !showManualLookup ? (
          <div className="bg-white border border-slate-200/90 shadow-xl p-6 sm:p-7 rounded-[2px] text-center space-y-5">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-900 shadow-xs">
              <svg className="w-5 h-5 text-emerald-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 2l-2 2m-1.5 1.5L16 7l-2-2m-3.5 3.5a5 5 0 1 0-7.07 7.07 5 5 0 0 0 7.07-7.07z" />
              </svg>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-widest text-emerald-900 uppercase font-bold block">
                SIGNED IN AS {currentUser.name.toUpperCase()}
              </span>
              <h2 className="font-serif-grand text-xl sm:text-2xl text-slate-900 font-light">
                No Active Reservation
              </h2>
              <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed font-sans-clean pt-1">
                You do not have a booked suite yet. Reserve a suite to unlock your digital room key and room services.
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              <Link
                to="/suites"
                className="w-full py-3.5 px-4 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] font-mono text-xs font-bold uppercase tracking-[0.2em] rounded-[2px] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-xl active:scale-[0.98] min-h-[44px]"
              >
                <span>Explore Suites &amp; Book a Stay</span>
                <span className="text-xs">&rarr;</span>
              </Link>

              {onLoadDemo && (
                <button
                  type="button"
                  onClick={onLoadDemo}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer min-h-[44px]"
                >
                  Preview Demo Stay (Suite 301) &rarr;
                </button>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowManualLookup(true)}
                className="text-xs font-mono text-slate-500 hover:text-slate-900 underline cursor-pointer transition-colors"
              >
                Have a reference code from phone or front desk? Link your stay &darr;
              </button>
            </div>
          </div>
        ) : (
          /* 2. Manual Booking Code Lookup Form */
          <div className="bg-white border border-slate-200/90 shadow-xl p-5 sm:p-6 rounded-[2px] text-left space-y-4">
            {currentUser && (
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs font-mono">
                <span className="text-slate-500">Guest: {currentUser.name}</span>
                <button
                  type="button"
                  onClick={() => setShowManualLookup(false)}
                  className="text-slate-700 hover:text-slate-950 underline cursor-pointer text-[11px]"
                >
                  &larr; Back to Account
                </button>
              </div>
            )}

            <form onSubmit={handleFormSubmit} noValidate className="space-y-3.5">
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
                  className={`w-full py-2.5 px-3 bg-slate-50/70 border rounded-[2px] text-sm font-mono uppercase tracking-wider text-slate-900 focus:outline-none transition-colors ${
                    localError
                      ? 'border-red-400 focus:border-red-600 bg-red-50/20'
                      : 'border-slate-300 focus:border-slate-900'
                  }`}
                />
                {localError && (
                  <span className="text-[10px] text-red-600 font-mono mt-1 block">
                    {localError}
                  </span>
                )}
              </div>

              <div>
                <label className="text-[10px] font-mono tracking-wider font-semibold text-slate-500 uppercase block mb-1">
                  Guest Contact Email (Optional)
                </label>
                <input
                  type="email"
                  maxLength={120}
                  value={guestEmailInput}
                  onChange={(e) => setGuestEmailInput(e.target.value)}
                  placeholder="e.g. guest@stayza.com"
                  className="w-full py-2.5 px-3 bg-slate-50/70 border border-slate-300 focus:border-slate-900 text-sm text-slate-900 focus:outline-none transition-colors rounded-[2px]"
                />
              </div>

              {searchError && (
                <div className="py-2 px-3 bg-red-50/90 border border-red-200/90 text-red-800 text-xs font-mono rounded-[2px] flex items-center gap-2 animate-fade-in">
                  <span className="text-red-500 font-bold text-[11px]">✕</span>
                  <span>{searchError}</span>
                </div>
              )}

              <button
                type="submit"
                className="touch-target w-full py-3 bg-[#0E1201] hover:bg-slate-900 text-[#FAF8F5] font-mono text-xs font-bold uppercase tracking-[0.2em] rounded-[2px] transition-all cursor-pointer shadow-md active:scale-[0.98]"
              >
                Unlock My Stay &rarr;
              </button>
            </form>

            {/* 1-Click Demo Stay Preview for New Guests */}
            {onLoadDemo && (
              <div className="pt-3 border-t border-slate-200/80 text-center">
                <button
                  type="button"
                  onClick={onLoadDemo}
                  className="text-xs font-mono text-slate-600 hover:text-slate-900 font-bold underline cursor-pointer transition-colors"
                >
                  Preview Verified Demo Stay (Suite 301) &rarr;
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  )
}
