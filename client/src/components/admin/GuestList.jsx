import React, { useState, useEffect } from 'react'
import { fetchAdminGuests } from '../../services/api'

export const INITIAL_GUEST_PROFILES = [
  {
    id: 'GST-101',
    name: 'Dr. Tariq Khan',
    email: 'tariq.khan@luxury.pk',
    phone: '+92 300 8219401',
    tier: 'VIP PLATINUM',
    totalStays: 4,
    lifetimeSpend: 1850000,
    preferences: 'Oceanfront Penthouse, High-thread-count Egyptian linen, Silent check-in',
  },
  {
    id: 'GST-102',
    name: 'Ambassador Malik',
    email: 'malik@diplomatic.gov.pk',
    phone: '+92 321 9988776',
    tier: 'DIPLOMATIC VIP',
    totalStays: 6,
    lifetimeSpend: 2420000,
    preferences: 'Courtyard Villa, Subterranean private valet, Mineral thermal baths',
  },
  {
    id: 'GST-103',
    name: 'Amina & Haris Vohra',
    email: 'amina.vohra@studio.pk',
    phone: '+92 301 5544332',
    tier: 'ESTATE RESIDENT',
    totalStays: 2,
    lifetimeSpend: 890000,
    preferences: 'Overwater Pavilion, In-suite executive chef seafood dinners',
  },
]

export default function GuestList() {
  const [guests, setGuests] = useState(INITIAL_GUEST_PROFILES)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [tierFilter, setTierFilter] = useState('ALL')

  const loadGuests = async () => {
    try {
      setLoading(true)
      const res = await fetchAdminGuests()
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setGuests(res.data)
      }
    } catch (err) {
      console.warn('[GuestList] Remote Atlas sync warning:', err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGuests()
  }, [])

  const filteredGuests = guests.filter((g) => {
    if (tierFilter !== 'ALL' && !g.tier?.toUpperCase().includes(tierFilter)) {
      return false
    }
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      g.name?.toLowerCase().includes(q) ||
      g.email?.toLowerCase().includes(q) ||
      g.phone?.toLowerCase().includes(q) ||
      g.preferences?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="bg-white border border-slate-200/90 rounded-[2px] shadow-xs overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif-grand text-xl text-slate-900">Registered Guest Directory</h3>
          <p className="text-xs font-mono text-slate-500 mt-0.5">
            Guest profiles, VIP tiers, preferences, and historical stay expenditures
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search by guest name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-[2px] text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-900 w-52 sm:w-64"
          />

          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-[2px] text-xs font-mono text-slate-800"
          >
            <option value="ALL">All Tiers</option>
            <option value="PLATINUM">Platinum VIP</option>
            <option value="DIPLOMATIC">Diplomatic VIP</option>
            <option value="RESIDENT">Registered Guest</option>
            <option value="STANDARD">Standard Guest</option>
          </select>

          <button
            type="button"
            onClick={loadGuests}
            disabled={loading}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            <span>{loading ? '...' : '↻ Refresh'}</span>
          </button>

          <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-mono font-bold rounded-full">
            {filteredGuests.length} / {guests.length} Profiles
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-50 border-b border-slate-200/80 text-[10px] text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-5">Guest Name</th>
              <th className="py-3 px-4">Contact Details</th>
              <th className="py-3 px-4">Tier Status</th>
              <th className="py-3 px-4">Total Stays</th>
              <th className="py-3 px-4">Lifetime Spend</th>
              <th className="py-3 px-5">Stay Preferences</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredGuests.map((g) => (
              <tr key={g.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-5 font-bold text-slate-900">{g.name}</td>
                <td className="py-3.5 px-4 text-slate-600">
                  <div>{g.email}</div>
                  <div className="text-[10px] text-slate-400">{g.phone}</div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[9px] font-bold rounded">
                    {g.tier}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-bold text-slate-800">{g.totalStays} Stays</td>
                <td className="py-3.5 px-4 text-emerald-900 font-bold">
                  PKR {g.lifetimeSpend.toLocaleString()}
                </td>
                <td className="py-3.5 px-5 text-slate-500 max-w-xs">{g.preferences}</td>
              </tr>
            ))}
            {filteredGuests.length === 0 && (
              <tr>
                <td colSpan="6" className="py-8 text-center text-slate-400 font-mono text-xs">
                  No guest profiles match the search query "{searchQuery}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
