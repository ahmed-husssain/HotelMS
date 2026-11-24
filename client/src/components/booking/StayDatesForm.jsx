import React from 'react'

/**
 * StayDatesForm — Interactive Calendar Date Selection & Occupancy
 * 
 * Features:
 * - Real Check-in & Check-out date pickers with live validation
 * - Quick duration selectors (2, 3, 4, 7 nights)
 * - Guest occupancy stepper
 * - Live MongoDB availability indicator badge
 */
export default function StayDatesForm({
  checkInDate,
  setCheckInDate,
  checkOutDate,
  setCheckOutDate,
  nights,
  onQuickNights,
  guestCount,
  setGuestCount,
  isAvailable,
  isCheckingAvailability,
  roomNumber = '301',
}) {
  const todayStr = new Date().toISOString().split('T')[0]
  const maxDateStr = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  return (
    <section className="bg-white border border-slate-200/90 rounded-xl p-5 sm:p-7 shadow-xs space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-[#0F172A] text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
            1
          </span>
          <h2 className="font-syne font-bold text-base sm:text-lg text-slate-900 tracking-tight">
            Dates &amp; Occupancy
          </h2>
        </div>

        {/* Live Availability Badge */}
        <div>
          {isCheckingAvailability ? (
            <span className="text-[11px] font-mono text-slate-500 bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5">
              <svg className="w-3 h-3 animate-spin text-slate-400" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Verifying dates...
            </span>
          ) : isAvailable ? (
            <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5">
              <svg className="w-3 h-3 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Suite {roomNumber} Available
            </span>
          ) : (
            <span className="text-[11px] font-mono text-rose-800 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5">
              <svg className="w-3 h-3 text-rose-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Dates Unavailable
            </span>
          )}
        </div>
      </div>

      {/* Date Pickers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-semibold block mb-1.5">
            Check-In Date
          </label>
          <input
            type="date"
            required
            min={todayStr}
            max={maxDateStr}
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-medium text-slate-900 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none transition-all touch-target cursor-pointer"
          />
        </div>

        <div>
          <label className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-semibold block mb-1.5">
            Check-Out Date
          </label>
          <input
            type="date"
            required
            min={checkInDate || todayStr}
            max={maxDateStr}
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-medium text-slate-900 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none transition-all touch-target cursor-pointer"
          />
        </div>
      </div>

      {/* Quick Duration Selector Pills */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
            Quick Duration Selection:
          </span>
          <span className="text-[11px] font-mono font-bold text-slate-700">
            {nights} {nights === 1 ? 'Night' : 'Nights'} Stay
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[2, 3, 4, 7].map((n) => {
            const isSelected = nights === n
            return (
              <button
                key={n}
                type="button"
                onClick={() => onQuickNights(n)}
                className={`py-2 text-xs font-mono rounded-lg border transition-all cursor-pointer text-center font-medium touch-target ${
                  isSelected
                    ? 'bg-[#0F172A] text-white border-[#0F172A] font-bold shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                {n} Nights
              </button>
            )
          })}
        </div>
      </div>

      {/* Guest Occupancy Stepper */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-900 block">Adult Guests</span>
          <span className="text-[11px] text-slate-400">Accommodates up to 4 guests</span>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1">
          <button
            type="button"
            aria-label="Decrease guest count"
            onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
            className="w-8 h-8 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 active:scale-95 flex items-center justify-center cursor-pointer transition-all shadow-2xs touch-target"
          >
            <svg className="w-3.5 h-3.5 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <span className="font-mono font-bold text-sm w-7 text-center text-slate-900 select-none">
            {guestCount}
          </span>
          <button
            type="button"
            aria-label="Increase guest count"
            onClick={() => setGuestCount(Math.min(4, guestCount + 1))}
            className="w-8 h-8 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 active:scale-95 flex items-center justify-center cursor-pointer transition-all shadow-2xs touch-target"
          >
            <svg className="w-3.5 h-3.5 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
