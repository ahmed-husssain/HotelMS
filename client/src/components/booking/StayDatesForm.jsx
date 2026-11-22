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
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              Checking availability...
            </span>
          ) : isAvailable ? (
            <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              Suite {roomNumber} is Available
            </span>
          ) : (
            <span className="text-[11px] font-mono text-rose-800 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
              Unavailable for these dates
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
            min={todayStr}
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
            min={checkInDate || todayStr}
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

        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
            className="w-8 h-8 rounded bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors"
          >
            &minus;
          </button>
          <span className="font-mono font-bold text-xs w-6 text-center text-slate-900">
            {guestCount}
          </span>
          <button
            type="button"
            onClick={() => setGuestCount(Math.min(4, guestCount + 1))}
            className="w-8 h-8 rounded bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors"
          >
            &plus;
          </button>
        </div>
      </div>
    </section>
  )
}
