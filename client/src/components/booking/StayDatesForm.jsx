import React from 'react'

export default function StayDatesForm({ nights, setNights, guestCount, setGuestCount }) {
  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
        <span className="text-xs sm:text-sm font-mono font-bold tracking-[0.15em] text-slate-900 uppercase">
          1. Choose Your Stay
        </span>
        <span className="text-[11px] font-mono text-slate-500 uppercase">
          {nights} Nights Selected
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <span className="text-[11px] font-mono tracking-wider font-semibold text-slate-500 uppercase block mb-2">
            Duration of Stay
          </span>
          <div className="grid grid-cols-4 gap-1.5">
            {[2, 3, 4, 7].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setNights(n)}
                className={`py-2 text-[11px] sm:text-xs font-mono rounded-[2px] border transition-all cursor-pointer whitespace-nowrap text-center ${
                  nights === n
                    ? 'bg-[#0E1201] text-[#FFF0CA] border-[#0E1201] font-bold shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                }`}
              >
                {n} Nights
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="text-[10px] font-mono tracking-wider font-semibold text-slate-400 uppercase block mb-2">
            Guest Occupancy
          </span>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGuestCount(g)}
                className={`flex-1 py-2 text-[11px] sm:text-xs font-mono rounded-[2px] border transition-all cursor-pointer whitespace-nowrap ${
                  guestCount === g
                    ? 'bg-[#0E1201] text-[#FFF0CA] border-[#0E1201] font-bold shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                }`}
              >
                {g} {g === 1 ? 'Guest' : 'Guests'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
