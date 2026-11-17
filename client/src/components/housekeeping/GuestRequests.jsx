import React from 'react'

export default function GuestRequests({ requests, onMarkDelivered }) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-[2px] shadow-xs overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-serif-grand text-xl text-slate-900">In-Stay Guest Requests (Doc FR-57)</h3>
          <p className="text-xs font-mono text-slate-500 mt-0.5">
            Live requests submitted by guests via their personal digital stay dossier
          </p>
        </div>
        <span className="px-3 py-1 bg-amber-50 text-amber-900 text-xs font-mono font-bold rounded-full">
          {requests.filter((r) => r.status === 'PENDING').length} Pending Action
        </span>
      </div>

      {requests.length === 0 ? (
        <div className="p-10 text-center text-xs font-mono text-slate-400">
          No active in-stay requests from guests.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-[10px] text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-5">Request ID</th>
                <th className="py-3 px-4">Suite</th>
                <th className="py-3 px-4">Guest</th>
                <th className="py-3 px-4">Service Requested</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-slate-500">{req.id}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{req.roomNumber}</td>
                  <td className="py-3.5 px-4 text-slate-700">{req.guestName}</td>
                  <td className="py-3.5 px-4 text-slate-900">{req.request}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        req.status === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-950'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    {req.status === 'PENDING' ? (
                      <button
                        type="button"
                        onClick={() => onMarkDelivered(req.id)}
                        className="px-3 py-1 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] text-[10px] uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer"
                      >
                        Mark Delivered &rarr;
                      </button>
                    ) : (
                      <span className="text-slate-400 text-[10px]">✓ Fulfilled</span>
                    )}
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
