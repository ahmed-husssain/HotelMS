import React, { useState, useEffect } from 'react'
import { fetchAdminGuests } from '../../services/api'
import { useToast } from '../../context/ToastContext'

export const INITIAL_GUEST_PROFILES = [
  {
    id: 'GST-101',
    name: 'Dr. Tariq Khan',
    email: 'tariq.khan@luxury.pk',
    phone: '+92 300 8219401',
    cnic: '42101-8219401-1',
    tier: 'VIP PLATINUM',
    totalStays: 4,
    lifetimeSpend: 1850000,
    activeReservationCode: 'TH-301-4575',
    suiteNumber: 'Suite 301 • The Horizon Penthouse',
    checkInDate: '24 Nov 2026 (14:00)',
    checkOutDate: '28 Nov 2026 (12:00)',
    numberOfNights: 4,
    advancePaid: 74580,
    balanceDue: 174020,
    totalStayAmount: 248600,
    preferences: 'Oceanfront Penthouse, High-thread-count Egyptian linen, Silent check-in',
    climatePreference: '20°C Ocean Breeze',
    pillowType: 'Hypoallergenic Egyptian Feather',
  },
  {
    id: 'GST-102',
    name: 'Ambassador Malik',
    email: 'malik@diplomatic.gov.pk',
    phone: '+92 321 9988776',
    cnic: '61101-1122334-5',
    tier: 'DIPLOMATIC VIP',
    totalStays: 6,
    lifetimeSpend: 2420000,
    activeReservationCode: 'CV-302-8821',
    suiteNumber: 'Suite 302 • The Courtyard Villa',
    checkInDate: '20 Nov 2026 (14:00)',
    checkOutDate: '26 Nov 2026 (11:00)',
    numberOfNights: 6,
    advancePaid: 152550,
    balanceDue: 355950,
    totalStayAmount: 508500,
    preferences: 'Courtyard Villa, Subterranean private valet, Mineral thermal baths',
    climatePreference: '22°C Quiet Eco',
    pillowType: 'Organic Buckwheat & Silk',
  },
  {
    id: 'GST-103',
    name: 'Amina & Haris Vohra',
    email: 'amina.vohra@studio.pk',
    phone: '+92 301 5544332',
    cnic: '35202-7788990-3',
    tier: 'ESTATE RESIDENT',
    totalStays: 2,
    lifetimeSpend: 890000,
    activeReservationCode: 'OP-303-1204',
    suiteNumber: 'Suite 303 • The Overwater Pavilion',
    checkInDate: '22 Nov 2026 (14:00)',
    checkOutDate: '25 Nov 2026 (11:00)',
    numberOfNights: 3,
    advancePaid: 96615,
    balanceDue: 225435,
    totalStayAmount: 322050,
    preferences: 'Overwater Pavilion, In-suite executive chef seafood dinners',
    climatePreference: '24°C Cedar Warmth',
    pillowType: 'Natural Latex Contoured',
  },
]

export default function GuestList() {
  const { showToast } = useToast()
  const [guests, setGuests] = useState(INITIAL_GUEST_PROFILES)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [tierFilter, setTierFilter] = useState('ALL')
  const [selectedGuest, setSelectedGuest] = useState(null)
  const [isDossierOpen, setIsDossierOpen] = useState(false)

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

  // Lock body scroll when dossier modal is open
  useEffect(() => {
    document.body.style.overflow = isDossierOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isDossierOpen])

  // ESC key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsDossierOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleOpenDossier = (guest) => {
    setSelectedGuest(guest)
    setIsDossierOpen(true)
  }

  const handleCopyCode = (code) => {
    if (!code) return
    const clean = code.split('?')[0].split('&')[0]
    navigator.clipboard?.writeText(clean)
    showToast({
      type: 'success',
      title: 'Confirmation Code Copied',
      message: `Reservation code ${clean} copied to clipboard.`,
    })
  }

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
      g.preferences?.toLowerCase().includes(q) ||
      g.activeReservationCode?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="bg-white border border-slate-200/90 rounded-[2px] shadow-xs overflow-hidden">
      {/* 1. Header with Controls */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif-grand text-xl text-slate-900">Guest Profiles &amp; Stays</h3>
          <p className="text-xs font-mono text-slate-500 mt-0.5">
            Profiles, stay history, verified CNIC, preferences, and lifetime spend
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search by name, email, phone, code..."
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
            <option value="RESIDENT">Registered Resident</option>
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

      {/* 2. Guest Directory Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-50 border-b border-slate-200/80 text-[10px] text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-5">Guest Name</th>
              <th className="py-3 px-4">Contact Details</th>
              <th className="py-3 px-4">Loyalty Tier</th>
              <th className="py-3 px-4">Total Visits</th>
              <th className="py-3 px-4">Lifetime Spend</th>
              <th className="py-3 px-4">Current / Active Suite</th>
              <th className="py-3 px-5 text-right">Dossier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredGuests.map((g) => (
              <tr key={g.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-5 font-bold text-slate-900">
                  {g.name}
                </td>
                <td className="py-3.5 px-4 text-slate-600">
                  <div>{g.email}</div>
                  <div className="text-[10px] text-slate-400">{g.phone}</div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold rounded">
                    {g.tier || 'STANDARD GUEST'}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-bold text-slate-800">{g.totalStays || 1} Stays</td>
                <td className="py-3.5 px-4 text-emerald-900 font-bold">
                  PKR {(g.lifetimeSpend || 0).toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-slate-700">
                  <div className="font-semibold">{g.suiteNumber || 'Suite 301'}</div>
                  {g.activeReservationCode && (
                    <div className="text-[10px] text-slate-400 font-mono">
                      Ref: {g.activeReservationCode.split('?')[0].split('&')[0]}
                    </div>
                  )}
                </td>
                <td className="py-3.5 px-5 text-right">
                  <button
                    type="button"
                    onClick={() => handleOpenDossier(g)}
                    className="px-3 py-1.5 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] text-[10px] font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer"
                  >
                    View Details &rarr;
                  </button>
                </td>
              </tr>
            ))}
            {filteredGuests.length === 0 && (
              <tr>
                <td colSpan="7" className="py-8 text-center text-slate-400 font-mono text-xs">
                  No guest profiles match the search query "{searchQuery}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 3. RICH GUEST DOSSIER MODAL */}
      {isDossierOpen && selectedGuest && (
        <div
          data-lenis-prevent="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsDossierOpen(false)
          }}
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            data-lenis-prevent="true"
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FAF8F5] border border-slate-300 rounded-[3px] shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-mono font-bold rounded">
                    {selectedGuest.tier || 'STANDARD GUEST'}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    ID: {selectedGuest.id}
                  </span>
                </div>
                <h3 className="font-serif-grand text-2xl text-slate-900">
                  {selectedGuest.name}
                </h3>
                <p className="text-xs font-mono text-slate-500">
                  {selectedGuest.email} &bull; {selectedGuest.phone}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsDossierOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Section 1: Active Stay & Room Details */}
            <div className="p-4 bg-white border border-slate-200 rounded-[2px] space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Active Stay &amp; Room Assignment
                </span>
                {selectedGuest.activeReservationCode && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">Code:</span>
                    <strong className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {selectedGuest.activeReservationCode.split('?')[0].split('&')[0]}
                    </strong>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(selectedGuest.activeReservationCode)}
                      className="text-[10px] text-emerald-800 hover:underline uppercase font-bold cursor-pointer"
                    >
                      Copy
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Assigned Suite</span>
                  <strong className="text-slate-900 text-sm font-sans-clean block mt-0.5">
                    {selectedGuest.suiteNumber || 'Suite 301 • The Horizon Penthouse'}
                  </strong>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Government ID / CNIC</span>
                  <strong className="text-slate-900 block mt-0.5">
                    {selectedGuest.cnic || '42101-*******-1'}
                  </strong>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Check-In</span>
                  <span className="text-slate-700 block mt-0.5">
                    {selectedGuest.checkInDate || '24 Nov 2026 (14:00)'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Check-Out</span>
                  <span className="text-slate-700 block mt-0.5">
                    {selectedGuest.checkOutDate || '28 Nov 2026 (12:00)'} ({selectedGuest.numberOfNights || 4} Nights)
                  </span>
                </div>
              </div>

              {/* Financial Split */}
              <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center bg-slate-50 p-2.5 rounded-[2px]">
                <div>
                  <span className="text-[9px] uppercase text-slate-500 block">Total Stay</span>
                  <strong className="text-slate-900 text-xs">
                    PKR {(selectedGuest.totalStayAmount || 248600).toLocaleString()}
                  </strong>
                </div>
                <div>
                  <span className="text-[9px] uppercase text-emerald-800 block">30% Paid Online</span>
                  <strong className="text-emerald-900 text-xs">
                    PKR {(selectedGuest.advancePaid || 74580).toLocaleString()}
                  </strong>
                </div>
                <div>
                  <span className="text-[9px] uppercase text-amber-800 block">70% Due At Desk</span>
                  <strong className="text-amber-950 text-xs">
                    PKR {(selectedGuest.balanceDue || 174020).toLocaleString()}
                  </strong>
                </div>
              </div>
            </div>

            {/* Section 2: Lifetime History & Preferences */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-4 bg-white border border-slate-200 rounded-[2px] space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block border-b border-slate-100 pb-1.5">
                  Hospitality History
                </span>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-600">Total Stays Completed:</span>
                  <strong className="text-slate-900">{selectedGuest.totalStays || 1} Stays</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-600">Lifetime Revenue:</span>
                  <strong className="text-emerald-900 font-bold">
                    PKR {(selectedGuest.lifetimeSpend || 0).toLocaleString()}
                  </strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-600">Loyalty Status:</span>
                  <strong className="text-amber-900 font-bold">{selectedGuest.tier || 'STANDARD'}</strong>
                </div>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-[2px] space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block border-b border-slate-100 pb-1.5">
                  Guest Preferences
                </span>
                <div className="py-1">
                  <span className="text-slate-400 text-[10px] block uppercase">Climate Setting</span>
                  <strong className="text-slate-800">
                    {selectedGuest.climatePreference || '20°C Ocean Breeze'}
                  </strong>
                </div>
                <div className="py-1">
                  <span className="text-slate-400 text-[10px] block uppercase">Pillow &amp; Linen</span>
                  <strong className="text-slate-800">
                    {selectedGuest.pillowType || 'Hypoallergenic Egyptian Cotton'}
                  </strong>
                </div>
                <div className="py-1">
                  <span className="text-slate-400 text-[10px] block uppercase">Special Requests</span>
                  <span className="text-slate-600 text-[11px] block">
                    {selectedGuest.preferences || 'High-thread-count Egyptian linen, Silent check-in'}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="text-[10px] font-mono text-slate-400">
                Data verified from Stayza Guest Directory
              </span>
              <button
                type="button"
                onClick={() => setIsDossierOpen(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-950 text-[#FFF0CA] font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
