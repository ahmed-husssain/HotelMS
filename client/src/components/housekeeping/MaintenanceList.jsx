import React from 'react'

/**
 * MaintenanceList — Room Defects & Maintenance Work Orders
 * 
 * Strict Zero-Icon Protocol:
 * - Clean plain-English labels (Urgent, High, Normal)
 * - Clear table hierarchy with tabular Space Grotesk numerals
 */
export default function MaintenanceList({ tickets = [], onOpenModal }) {
  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'URGENT':
        return 'bg-rose-50 text-rose-900 border-rose-300'
      case 'HIGH':
        return 'bg-amber-50 text-amber-900 border-amber-300'
      default:
        return 'bg-slate-50 text-slate-800 border-slate-200'
    }
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-[2px] shadow-xs overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif-grand text-xl font-bold text-slate-900">Maintenance &amp; Broken Items</h3>
          <p className="text-xs font-mono text-slate-500 mt-0.5">
            Reported room defects, plumbing issues, and AC climate controls
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenModal}
          className="min-h-[44px] px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer shadow-2xs self-start sm:self-auto"
        >
          Report Broken Item
        </button>
      </div>

      {tickets.length === 0 ? (
        <div className="p-10 text-center text-xs font-mono text-slate-400">
          No open maintenance tickets. All room fixtures operating normally.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#FAF8F5] border-b border-slate-200/80 text-[10px] text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3 px-5">Ticket ID</th>
                <th className="py-3 px-4">Room</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Issue Description</th>
                <th className="py-3 px-4">Urgency</th>
                <th className="py-3 px-4">Reported</th>
                <th className="py-3 px-5">Assigned Engineer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans-clean text-xs">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-5 font-mono font-bold text-slate-500">{t.id}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{t.roomNumber}</td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">{t.category}</td>
                  <td className="py-3.5 px-4 text-slate-900 max-w-xs">{t.issue}</td>
                  <td className="py-3.5 px-4 font-mono">
                    <span
                      className={`px-2 py-0.5 rounded-[2px] text-[10px] font-bold uppercase tracking-wider border ${getUrgencyBadge(
                        t.urgency
                      )}`}
                    >
                      {t.urgency}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">{t.reportedAt}</td>
                  <td className="py-3.5 px-5 font-mono text-slate-700 font-medium">{t.assignedTo || 'Unassigned'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
