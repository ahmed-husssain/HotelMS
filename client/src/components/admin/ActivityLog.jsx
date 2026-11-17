import React, { useState } from 'react'

export default function ActivityLog({ auditLogs }) {
  const [filterCategory, setFilterCategory] = useState('ALL')

  const filteredLogs = auditLogs.filter((log) => {
    if (filterCategory === 'ALL') return true
    return log.category === filterCategory
  })

  // Export CSV
  const handleExportCSV = () => {
    const headers = 'Log ID,Timestamp,Actor,Action,Category,Details\n'
    const rows = filteredLogs
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.actor}","${l.action}","${l.category}","${l.details?.replace(/"/g, '""')}"`
      )
      .join('\n')

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `habitas_audit_log_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-[2px] shadow-xs overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif-grand text-xl text-slate-900">Immutable Activity Audit Trail</h3>
          <p className="text-xs font-mono text-slate-500 mt-0.5">
            Cryptographic ledger of staff operations, rate adjustments, check-ins, and settlements
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-[2px] text-xs font-mono text-slate-800"
          >
            <option value="ALL">All Categories</option>
            <option value="PMS">Front Desk PMS</option>
            <option value="HOUSEKEEPING">Housekeeping</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="SETTINGS">Settings</option>
            <option value="BILLING">Billing &amp; Tax</option>
          </select>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-4 py-1.5 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>📥 Export CSV</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-50 border-b border-slate-200/80 text-[10px] text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-5">Log ID</th>
              <th className="py-3 px-4">Time</th>
              <th className="py-3 px-4">Operator / Actor</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-5">Operational Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-5 font-bold text-slate-400">{log.id}</td>
                <td className="py-3.5 px-4 text-slate-500">{log.timestamp}</td>
                <td className="py-3.5 px-4 font-bold text-slate-900">{log.actor}</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-800 text-[9px] font-bold rounded">
                    {log.action}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-600 font-semibold">{log.category}</td>
                <td className="py-3.5 px-5 text-slate-700 max-w-md">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
