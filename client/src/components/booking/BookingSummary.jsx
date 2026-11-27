import React from 'react'

/**
 * BookingSummary — Sticky Visual Order Ledger with Suite Anchoring
 * 
 * Features:
 * - High-res Cloudinary photography of the chosen suite
 * - Micro-specs (Area, View, Bed)
 * - Clear 30% advance deposit breakdown vs 70% check-in balance
 * - Live submit button connected to Safepay
 */
export default function BookingSummary({
  selectedResidence,
  nights,
  suiteSubtotal,
  addonTotal = 0,
  sindhTax,
  totalValuation,
  advanceDeposit,
  remainingBalance,
  isProcessing = false,
  isAvailable = true,
  checkInDate,
  checkOutDate,
  taxRate = 0,
  depositRate = 30,
}) {
  const heroImage =
    selectedResidence.detailImage ||
    selectedResidence.gallery?.[0]?.url ||
    'https://res.cloudinary.com/v1rl3ras/image/upload/v1795019369/hotel-suites/suite-301/suite-301-bedroom.webp'

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-md">
      {/* 1. Visual Suite Hero Image — Cinematic Editorial Showcase */}
      <div className="relative h-64 sm:h-72 bg-slate-900 overflow-hidden group">
        <img
          src={heroImage}
          alt={selectedResidence.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Editorial vignette gradient: keeps architecture bright while text stays crisp */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

        <div className="absolute top-3.5 right-3.5 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[11px] font-mono font-bold text-white shadow-sm">
          Suite {selectedResidence.roomNumber}
        </div>

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-emerald-300 block mb-1">
            {selectedResidence.tier}
          </span>
          <h3 className="font-syne font-bold text-lg sm:text-xl text-white leading-tight">
            {selectedResidence.name}
          </h3>
        </div>
      </div>

      {/* 2. Micro-Specs Strip */}
      <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 text-center py-2 bg-slate-50 text-[11px] font-mono text-slate-600">
        <div>
          <strong className="text-slate-900 block">{selectedResidence.specs?.[0]?.value || '210 M²'}</strong> Area
        </div>
        <div>
          <strong className="text-slate-900 block">{selectedResidence.specs?.[1]?.value || 'OCEAN'}</strong> View
        </div>
        <div>
          <strong className="text-slate-900 block">{selectedResidence.specs?.[2]?.value || 'KING'}</strong> Bed
        </div>
      </div>

      {/* 3. Financial Summary */}
      <div className="p-5 space-y-3.5 text-xs">
        <div className="flex justify-between text-slate-600">
          <span>Accommodation ({nights}N &times; PKR {selectedResidence.nightlyRate?.toLocaleString()})</span>
          <span className="font-mono text-slate-900 font-semibold">PKR {suiteSubtotal.toLocaleString()}</span>
        </div>

        {addonTotal > 0 && (
          <div className="flex justify-between text-slate-600">
            <span>Selected Concierge Services</span>
            <span className="font-mono text-slate-900 font-semibold">+ PKR {addonTotal.toLocaleString()}</span>
          </div>
        )}

        {taxRate > 0 && sindhTax > 0 && (
          <div className="flex justify-between text-slate-600">
            <span>Provincial Sales Tax ({taxRate}%)</span>
            <span className="font-mono text-slate-900 font-semibold">PKR {sindhTax.toLocaleString()}</span>
          </div>
        )}

        <div className="flex justify-between text-sm font-bold text-slate-900 pt-2.5 border-t border-slate-200">
          <span>Total Stay Charges</span>
          <span className="font-mono">PKR {totalValuation.toLocaleString()}</span>
        </div>

        {/* 4. Highlighted 30% Advance Deposit Due Today */}
        <div className="bg-emerald-50 border border-emerald-200/90 rounded-lg p-3 space-y-1.5 mt-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-emerald-950 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              {depositRate}% Advance Deposit Due Today:
            </span>
            <span className="font-mono font-extrabold text-sm text-emerald-950">
              PKR {advanceDeposit.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-emerald-800 leading-tight">
            Locks Suite {selectedResidence.roomNumber} securely via Safepay.
          </p>
        </div>

        {/* 5. 70% Remaining Balance */}
        <div className="flex justify-between text-[11px] text-slate-500 pt-1">
          <span>Remaining 70% at Hotel Check-In:</span>
          <span className="font-mono font-bold text-slate-800">
            PKR {remainingBalance.toLocaleString()}
          </span>
        </div>

        {/* 6. Primary Action Button */}
        <button
          type="submit"
          disabled={isProcessing || !isAvailable}
          className={`w-full mt-3 py-4 text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 shadow-md touch-target ${
            !isAvailable
              ? 'bg-rose-100 text-rose-800 border border-rose-300 cursor-not-allowed'
              : isProcessing
              ? 'bg-slate-300 text-slate-600 cursor-wait'
              : 'bg-[#0F172A] hover:bg-slate-800 text-white hover:shadow-lg active:scale-[0.98] cursor-pointer'
          }`}
        >
          {isProcessing ? (
            <span>Securing 5-Minute Hold...</span>
          ) : !isAvailable ? (
            <span>Unavailable for Selected Dates</span>
          ) : (
            <>
              <span>Confirm &amp; Pay 30% Deposit (PKR {advanceDeposit.toLocaleString()})</span>
              <span className="text-sm">&rarr;</span>
            </>
          )}
        </button>

        {/* 7. Reassurance Badges */}
        <div className="pt-2 text-center text-[10px] font-mono text-slate-400 space-y-1">
          <div>&bull; Free cancellation up to 48 hours prior to arrival</div>
          <div>&bull; 256-Bit SSL Encrypted &bull; Official Tax Invoice Attached</div>
        </div>
      </div>
    </div>
  )
}
