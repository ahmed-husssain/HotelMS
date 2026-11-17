import React from 'react'

export default function ArrivalsList({ arrivals, onCheckInArrival }) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-[2px] shadow-xs overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-serif-grand text-xl text-slate-900">Today's Expected Arrivals</h3>
          <p className="text-xs font-mono text-slate-500 mt-0.5">
            Confirmed reservations with 30% Safepay deposits held in escrow
          </p>
        </div>
        <span className="px-3 py-1 bg-emerald-50 text-emerald-900 text-xs font-mono font-bold rounded-full">
          {arrivals.length} Expected
        </span>
      </div>

      {arrivals.length === 0 ? (
        <div className="p-10 text-center text-xs font-mono text-slate-400">
          No remaining arrivals in today&apos;s queue. All guests checked in.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-[10px] text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-5">Guest Name</th>
                <th className="py-3 px-4">Suite</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Safepay Ref</th>
                <th className="py-3 px-4">30% Deposit</th>
                <th className="py-3 px-4">Est. Arrival</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {arrivals.map((arr) => (
                <tr key={arr.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-slate-900">{arr.guest}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-emerald-950">{arr.roomNumber}</span>
                    <span className="block text-[9px] text-slate-400">{arr.tier}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{arr.phone}</td>
                  <td className="py-3.5 px-4 text-slate-500 font-bold">{arr.safepayRef}</td>
                  <td className="py-3.5 px-4 text-emerald-900 font-bold">
                    PKR {arr.advancePaid?.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{arr.eta}</td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      type="button"
                      onClick={() => onCheckInArrival(arr)}
                      className="px-4 py-1.5 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] text-[10px] uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer shadow-xs"
                    >
                      Check-In &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
