import React from 'react'

export default function StayBill({
  currentBooking,
  orderedServices,
  financials,
  onPrintFolio,
}) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-[2px] shadow-lg p-7 space-y-6">
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <div>
          <span className="text-[9px] font-mono font-bold tracking-[0.2em] text-slate-400 uppercase block">
            STATEMENT OF CHARGES
          </span>
          <h3 className="font-serif-grand text-xl text-slate-900">
            Live Guest Folio
          </h3>
        </div>
        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-900 font-mono text-[9px] font-bold rounded">
          SAFEPAY VERIFIED
        </span>
      </div>

      {/* Detailed Line-Item Accrual */}
      <div className="space-y-3 text-xs text-slate-600">
        <div className="flex justify-between">
          <span>
            {currentBooking.nights} Nights &times; PKR {currentBooking.residence?.nightlyRate?.toLocaleString()}
          </span>
          <span className="font-mono font-medium text-slate-900">
            PKR {financials.roomSubtotal.toLocaleString()}
          </span>
        </div>

        {/* Render Requested In-Stay Services */}
        {orderedServices.map((service, index) => (
          <div key={index} className="flex justify-between text-slate-800 pl-2 border-l-2 border-emerald-800/40">
            <span className="truncate pr-2">{service.title}</span>
            <span className="font-mono shrink-0 font-medium text-slate-900">
              {service.price === 0 ? 'FREE' : `+ PKR ${service.price.toLocaleString()}`}
            </span>
          </div>
        ))}

        <div className="flex justify-between">
          <span>Sindh Sales Tax (13%)</span>
          <span className="font-mono font-medium text-slate-900">
            PKR {financials.sindhTax.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between text-base font-bold text-slate-900 pt-3 border-t border-slate-200/80">
          <span>Total Stay Amount</span>
          <span className="font-mono">PKR {financials.totalStayAmount.toLocaleString()}</span>
        </div>

        {/* Paid Deposit & Remaining Balance */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex justify-between text-emerald-900 font-bold">
            <span>30% Deposit Paid Online:</span>
            <span className="font-mono">- PKR {financials.advancePaid.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-baseline pt-2 border-t border-slate-100">
            <div>
              <span className="text-xs font-extrabold text-slate-900 block">
                REMAINING FRONT-DESK BALANCE
              </span>
              <span className="text-[10px] text-slate-400">
                Due at checkout (Cash / Card POS)
              </span>
            </div>
            <span className="font-mono text-base font-extrabold text-amber-900">
              PKR {financials.balanceDue.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Print Invoice Action Button */}
      <button
        type="button"
        onClick={onPrintFolio}
        className="w-full py-3.5 bg-slate-900 hover:bg-emerald-950 text-white font-mono text-xs uppercase tracking-wider font-bold rounded-[2px] transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
      >
        <span>Download Official Tax Invoice</span>
        <span>&darr;</span>
      </button>
    </div>
  )
}
