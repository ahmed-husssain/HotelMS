import React from 'react'

export default function BookingSummary({
  selectedResidence,
  nights,
  suiteSubtotal,
  addonTotal,
  sindhTax,
  totalValuation,
  advanceDeposit,
  remainingBalance,
  secondsLeft,
  formatTimer,
  isProcessing,
  taxRate = 13,
  depositRate = 30,
}) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-[2px] shadow-lg p-6 sm:p-7 space-y-6">
      {/* 5-Min Hold Timer */}
      <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-[2px] flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${secondsLeft > 0 ? 'bg-emerald-600 animate-pulse' : 'bg-red-600'}`} />
          <span className="text-slate-600 text-[11px] uppercase tracking-wider">Inventory Hold</span>
        </div>
        <span className={`font-bold tracking-widest ${secondsLeft < 60 ? 'text-red-700 animate-pulse' : 'text-slate-900'}`}>
          {formatTimer(secondsLeft)}
        </span>
      </div>

      {/* Residence Title */}
      <div className="border-b border-slate-100 pb-4">
        <span className="text-[9px] font-mono tracking-widest text-emerald-900 font-extrabold uppercase">
          {selectedResidence.tier}
        </span>
        <h3 className="font-serif-grand text-xl text-slate-900 mt-0.5">
          {selectedResidence.name}
        </h3>
        <span className="font-mono text-xs text-slate-500">
          Suite {selectedResidence.roomNumber} &bull; {nights} Nights
        </span>
      </div>

      {/* Folio Breakdown */}
      <div className="space-y-3 text-xs text-slate-600">
        <div className="flex justify-between">
          <span>Suite Rate ({nights} &times; PKR {selectedResidence.nightlyRate.toLocaleString()})</span>
          <span className="font-mono text-slate-900 font-medium">PKR {suiteSubtotal.toLocaleString()}</span>
        </div>

        {addonTotal > 0 && (
          <div className="flex justify-between">
            <span>Selected Concierge Add-ons</span>
            <span className="font-mono text-slate-900 font-medium">+ PKR {addonTotal.toLocaleString()}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Sindh Sales Tax ({taxRate}%)</span>
          <span className="font-mono text-slate-900 font-medium">PKR {sindhTax.toLocaleString()}</span>
        </div>

        <div className="flex justify-between text-base font-bold text-slate-900 pt-3 border-t border-slate-200">
          <span>Total Stay Valuation</span>
          <span className="font-mono">PKR {totalValuation.toLocaleString()}</span>
        </div>

        {/* 30% Deposit & 70% Balance */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex justify-between text-emerald-900 font-bold">
            <span>{depositRate}% Online Deposit (Safepay):</span>
            <span className="font-mono">PKR {advanceDeposit.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-500 text-[11px]">
            <span>Remaining 70% at Front Desk:</span>
            <span className="font-mono font-semibold text-slate-800">PKR {remainingBalance.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isProcessing || secondsLeft === 0}
        className="w-full py-4 bg-[#0E1201] hover:bg-slate-900 disabled:bg-slate-300 text-[#FFF0CA] font-mono text-xs font-bold uppercase tracking-[0.2em] rounded-[2px] transition-all cursor-pointer shadow-md active:scale-[0.98]"
      >
        {isProcessing
          ? 'Verifying Safepay Deposit...'
          : secondsLeft === 0
          ? 'Hold Expired — Refresh'
          : `Confirm & Pay 30% Deposit (PKR ${advanceDeposit.toLocaleString()}) →`}
      </button>

      <div className="text-[10px] text-slate-400 font-mono text-center tracking-wider uppercase">
        256-Bit SSL Encrypted &bull; Safepay Verified
      </div>
    </div>
  )
}
