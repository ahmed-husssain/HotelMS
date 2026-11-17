import React from 'react'

export default function MaintenanceList({ tickets, onOpenModal }) {
  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'URGENT':
        return 'bg-red-100 text-red-900 border-red-300'
      case 'HIGH':
        return 'bg-amber-100 text-amber-900 border-amber-300'
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200'
    }
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-[2px] shadow-xs overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-serif-grand text-xl text-slate-900">Maintenance &amp; Engineering Tickets</h3>
          <p className="text-xs font-mono text-slate-500 mt-0.5">
            Reported broken fixtures, HVAC climate control, and plumbing requests
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenModal}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-950 text-[#FFF0CA] text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer"
        >
          + Log Work Order
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-50 border-b border-slate-200/80 text-[10px] text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-5">Ticket ID</th>
              <th className="py-3 px-4">Suite</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Issue Description</th>
              <th className="py-3 px-4">Urgency</th>
              <th className="py-3 px-4">Reported</th>
              <th className="py-3 px-5">Assigned Engineer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tickets.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-5 font-bold text-slate-500">{t.id}</td>
                <td className="py-3.5 px-4 font-bold text-slate-900">{t.roomNumber}</td>
                <td className="py-3.5 px-4 text-slate-600">{t.category}</td>
                <td className="py-3.5 px-4 text-slate-900 max-w-xs">{t.issue}</td>
                <td className="py-3.5 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${getUrgencyBadge(
                      t.urgency
                    )}`}
                  >
                    {t.urgency}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-500">{t.reportedAt}</td>
                <td className="py-3.5 px-5 text-slate-700">{t.assignedTo || 'Unassigned'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
