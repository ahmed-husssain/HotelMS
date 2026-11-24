import React, { useState, useEffect } from 'react'
import { fetchAdminAuditLogs } from '../../services/api'

export default function ActivityLog({ auditLogs: fallbackLogs = [] }) {
  const [logs, setLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('stayza_hotel_audit')
      return saved ? JSON.parse(saved) : fallbackLogs
    } catch {
      return fallbackLogs
    }
  })
  const [filterCategory, setFilterCategory] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)

  const loadLogs = () => {
    setLoading(true)
    fetchAdminAuditLogs()
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setLogs(res.data)
        }
      })
      .catch((err) => console.warn('[ActivityLog] Atlas sync warning:', err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadLogs()
  }, [])

  // Helper to ensure full date & time (e.g. 24 Nov 2026, 14:22 PKT)
  const formatTimestamp = (ts, createdAt) => {
    if (createdAt) {
      const d = new Date(createdAt)
      if (!isNaN(d.getTime())) {
        const dateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        const timeStr = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
        return `${dateStr}, ${timeStr} PKT`
      }
    }
    if (ts && ts.includes(',')) return ts
    if (ts && ts.includes('PKT')) return `24 Nov 2026, ${ts}`
    return ts || '24 Nov 2026, 14:00 PKT'
  }

  // Helper to sanitize dirty booking references (e.g. TH-301-4575?order_id=TH-301-4575 -> TH-301-4575)
  const cleanDetails = (str) => {
    if (!str) return ''
    return str
      .replace(/\?order_id=[^ &]*/g, '')
      .replace(/\?ref=[^ &]*/g, '')
  }

  const filteredLogs = logs.filter((log) => {
    if (filterCategory !== 'ALL' && log.category !== filterCategory) {
      return false
    }
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      log.actor?.toLowerCase().includes(q) ||
      log.action?.toLowerCase().includes(q) ||
      log.details?.toLowerCase().includes(q) ||
      log.id?.toLowerCase().includes(q)
    )
  })

  // Export CSV
  const handleExportCSV = () => {
    const headers = 'Log ID,Timestamp,Actor,Action,Category,Details\n'
    const rows = filteredLogs
      .map((l) => {
        const ts = formatTimestamp(l.timestamp, l.createdAt)
        const det = cleanDetails(l.details).replace(/"/g, '""')
        return `"${l.id}","${ts}","${l.actor}","${l.action}","${l.category}","${det}"`
      })
      .join('\n')

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `stayza_activity_log_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
  }

  const getActionBadge = (action) => {
    switch (action) {
      case 'USER_LOGIN':
        return 'bg-emerald-100 text-emerald-950 border-emerald-300'
      case 'USER_LOGOUT':
        return 'bg-slate-200 text-slate-800 border-slate-300'
      case 'ONLINE_RESERVATION_CREATED':
      case 'RESERVATION':
        return 'bg-blue-100 text-blue-950 border-blue-300'
      case 'CHECKIN_COMPLETED':
      case 'CHECKOUT_COMPLETED':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300'
      case 'ROOM_RATE_UPDATED':
      case 'RATE_ADJUSTMENT':
        return 'bg-amber-100 text-amber-900 border-amber-300'
      case 'STAFF_ACCOUNT_CREATED':
      case 'STAFF_ACCOUNT_UPDATED':
        return 'bg-purple-100 text-purple-950 border-purple-300'
      case 'STAFF_ACCOUNT_DELETED':
      case 'STAFF_ACCOUNT_DEACTIVATED':
        return 'bg-red-100 text-red-900 border-red-300'
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200'
    }
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-[2px] shadow-xs overflow-hidden">
      {/* 1. Header with Controls */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif-grand text-xl text-slate-900">System History &amp; Audit Trail</h3>
          <p className="text-xs font-mono text-slate-500 mt-0.5">
            Immutable chronological record of logins, reservations, front desk check-ins, and tariff adjustments
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search by actor, action, or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-[2px] text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-900 w-48 sm:w-60"
          />

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-[2px] text-xs font-mono text-slate-800"
          >
            <option value="ALL">All Categories</option>
            <option value="SECURITY">Security &amp; Logins</option>
            <option value="RESERVATION">Bookings &amp; Holds</option>
            <option value="PMS">Front Desk Operations</option>
            <option value="HOUSEKEEPING">Housekeeping</option>
            <option value="SETTINGS">Tariffs &amp; Settings</option>
          </select>

          <button
            type="button"
            onClick={loadLogs}
            disabled={loading}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            <span>{loading ? '...' : '↻ Refresh'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-4 py-1.5 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Export CSV ↓</span>
          </button>
        </div>
      </div>

      {/* 2. Audit Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-50 border-b border-slate-200/80 text-[10px] text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-5">Log ID</th>
              <th className="py-3 px-4">Date &amp; Time (PKT)</th>
              <th className="py-3 px-4">Operator / Actor</th>
              <th className="py-3 px-4">Action Event</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-5">Operational Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLogs.map((log) => {
              const formattedTime = formatTimestamp(log.timestamp, log.createdAt)
              const cleanedDetail = cleanDetails(log.details)

              return (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-slate-400">{log.id}</td>
                  <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap font-medium">
                    {formattedTime}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{log.actor}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 border text-[10px] font-bold rounded ${getActionBadge(
                        log.action
                      )}`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-semibold">{log.category}</td>
                  <td className="py-3.5 px-5 text-slate-800 max-w-lg leading-relaxed">
                    {cleanedDetail}
                  </td>
                </tr>
              )
            })}
            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan="6" className="py-8 text-center text-slate-400 font-mono text-xs">
                  No activity log entries found matching criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
