import React from 'react'

export default function BookingLookup({
  bookingCode,
  setBookingCode,
  guestEmailInput,
  setGuestEmailInput,
  searchError,
  onSubmit,
  onLoadDemo,
}) {
  return (
    <main className="flex-1 min-h-0 w-full flex flex-col items-center justify-center px-4 sm:px-6 py-4 overflow-y-auto scrollbar-none">
      <div className="w-full max-w-lg text-center space-y-4 sm:space-y-5 my-auto">
        <div className="space-y-2">
          <span className="text-[10px] font-mono tracking-[0.3em] font-extrabold text-emerald-900 uppercase block">
            GUEST SELF-SERVICE PORTAL
          </span>
          <h1 className="font-serif-grand text-2xl sm:text-4xl font-light text-slate-900 tracking-tight">
            Access Your Stay.
          </h1>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Enter your booking reference code or email address to view your digital key, request in-room dining, manage services, and download your tax invoice.
          </p>
        </div>

        <div className="bg-white border border-slate-200/90 shadow-xl p-6 sm:p-7 rounded-[2px] text-left space-y-4 sm:space-y-5">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-mono tracking-wider font-semibold text-slate-400 uppercase block mb-1">
                Booking Reference Code
              </label>
              <input
                type="text"
                required
                value={bookingCode}
                onChange={(e) => setBookingCode(e.target.value)}
                placeholder="e.g. TH-301-9041"
                className="w-full py-2 px-3 bg-slate-50/70 border border-slate-300 focus:border-slate-900 text-sm font-mono uppercase tracking-wider text-slate-900 focus:outline-none transition-colors rounded-[2px]"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono tracking-wider font-semibold text-slate-400 uppercase block mb-1">
                Guest Contact Email (Optional)
              </label>
              <input
                type="email"
                value={guestEmailInput}
                onChange={(e) => setGuestEmailInput(e.target.value)}
                placeholder="e.g. tariq.khan@luxury.pk"
                className="w-full py-2 px-3 bg-slate-50/70 border border-slate-300 focus:border-slate-900 text-sm text-slate-900 focus:outline-none transition-colors rounded-[2px]"
              />
            </div>

            {searchError && (
              <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-[2px]">
                {searchError}
              </div>
            )}

            <button
              type="submit"
              className="touch-target w-full py-3 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] font-mono text-xs font-bold uppercase tracking-[0.2em] rounded-[2px] transition-all cursor-pointer shadow-md active:scale-[0.98]"
            >
              Unlock My Stay &rarr;
            </button>
          </form>

          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-500 font-mono">
            <span className="text-[10px] uppercase tracking-wider text-slate-400">Demo Stay Credentials:</span>
            <button
              type="button"
              onClick={onLoadDemo}
              className="px-3 py-1.5 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 rounded-[2px] border border-emerald-200/80 text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer min-h-[44px] flex items-center justify-center"
            >
              1-Click Load: Suite 301 Demo &rarr;
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
