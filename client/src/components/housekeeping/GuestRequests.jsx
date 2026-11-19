import React from 'react'

/**
 * GuestRequests — In-Stay Guest Requests Table
 * 
 * Strict Zero-Icon Protocol:
 * - Pure typographic status labels (Pending Action, Delivered)
 * - Clear, high-contrast actions (Mark Delivered)
 * - Minimum 44x44px touch targets
 */
export default function GuestRequests({ requests = [], onMarkDelivered }) {
  const pendingCount = requests.filter((r) => r.status === 'PENDING').length

  return (
    <div className="bg-white border border-slate-200/90 rounded-[2px] shadow-xs overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-serif-grand text-xl font-bold text-slate-900">In-Stay Guest Requests</h3>
          <p className="text-xs font-mono text-slate-500 mt-0.5">
            Live service orders requested by staying guests via the guest portal
          </p>
        </div>
        <span className="px-3 py-1 bg-amber-50 border border-amber-300 text-amber-900 text-xs font-mono font-bold uppercase rounded-[2px] self-start sm:self-auto">
          {pendingCount} Pending Delivery
        </span>
      </div>

      {requests.length === 0 ? (
        <div className="p-10 text-center text-xs font-mono text-slate-400">
          No active in-stay requests from guests.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#FAF8F5] border-b border-slate-200/80 text-[10px] text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3 px-5">Request ID</th>
                <th className="py-3 px-4">Room</th>
                <th className="py-3 px-4">Guest Name</th>
                <th className="py-3 px-4">Service Requested</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans-clean text-xs">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-5 font-mono font-bold text-slate-500">{req.id}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{req.roomNumber}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{req.guestName}</td>
                  <td className="py-3.5 px-4 text-slate-900 font-semibold">{req.request}</td>
                  <td className="py-3.5 px-4 font-mono">
                    <span
                      className={`px-2 py-0.5 rounded-[2px] text-[10px] font-bold uppercase tracking-wider border ${
                        req.status === 'DELIVERED'
                          ? 'bg-emerald-50 text-emerald-950 border-emerald-200'
                          : 'bg-amber-50 text-amber-900 border-amber-300'
                      }`}
                    >
                      {req.status === 'DELIVERED' ? 'Delivered' : 'Pending Action'}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono">
                    {req.status === 'PENDING' ? (
                      <button
                        type="button"
                        onClick={() => onMarkDelivered(req.id)}
                        className="min-h-[40px] px-3.5 py-1.5 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer shadow-2xs"
                      >
                        Mark Delivered
                      </button>
                    ) : (
                      <span className="text-slate-500 text-xs font-semibold">Delivered to Room</span>
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
