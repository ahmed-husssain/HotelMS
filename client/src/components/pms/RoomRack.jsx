import React from 'react'

export default function RoomRack({
  rooms = [],
  activeFilter = 'ALL',
  setActiveFilter,
  onOpenCheckIn,
  onOpenFolio,
  onOpenInvoice,
  searchQuery = '',
}) {
  const q = searchQuery.toLowerCase().trim()

  const availableCount = rooms.filter((r) => r.status === 'AVAILABLE').length
  const occupiedCount = rooms.filter((r) => r.status === 'OCCUPIED').length
  const turnoverCount = rooms.filter((r) => r.status === 'DIRTY' || r.status === 'CLEANING').length
  const maintCount = rooms.filter((r) => r.status === 'MAINTENANCE').length

  const filteredRooms = rooms.filter((r) => {
    // 1. Status Filter
    if (activeFilter === 'AVAILABLE' && r.status !== 'AVAILABLE') return false
    if (activeFilter === 'OCCUPIED' && r.status !== 'OCCUPIED') return false
    if (activeFilter === 'TURNOVER' && r.status !== 'DIRTY' && r.status !== 'CLEANING') return false
    if (activeFilter === 'MAINTENANCE' && r.status !== 'MAINTENANCE') return false

    // 2. Search Query
    if (q) {
      const matchRoom = r.roomNumber && r.roomNumber.toLowerCase().includes(q)
      const matchName = r.name && r.name.toLowerCase().includes(q)
      const matchGuest = r.guest && r.guest.toLowerCase().includes(q)
      const matchStatus = r.status && r.status.toLowerCase().includes(q)
      const matchTier = r.tier && r.tier.toLowerCase().includes(q)
      if (!matchRoom && !matchName && !matchGuest && !matchStatus && !matchTier) return false
    }

    return true
  })

  const getFloorLabel = (roomNumber = '') => {
    if (roomNumber.includes('301') || roomNumber.includes('501')) return 'Level 04 (Penthouse / Top Floor)'
    if (roomNumber.includes('401') || roomNumber.includes('201') || roomNumber.includes('302')) {
      return 'Level 02 (Ocean & Courtyard)'
    }
    return 'Level 01 (Beachfront / Overwater)'
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return <span className="font-bold text-emerald-950">Available Ready</span>
      case 'OCCUPIED':
        return <span className="font-bold text-slate-900">Occupied</span>
      case 'CLEANING':
        return <span className="font-semibold text-amber-900">Cleaning in Progress</span>
      case 'DIRTY':
        return <span className="font-semibold text-rose-900">Dirty (Turnover Queue)</span>
      case 'MAINTENANCE':
        return <span className="text-slate-500 font-semibold">Maintenance Hold</span>
      default:
        return <span className="text-slate-700">{status}</span>
    }
  }

  return (
    <div className="space-y-6">
      {/* Hairline Status Filter Bar (Strictly Zero Icons, Pure Text Buttons) */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-[2px] transition-all cursor-pointer font-bold uppercase tracking-wider text-[11px] ${
              activeFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-400'
            }`}
          >
            All Suites ({rooms.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('AVAILABLE')}
            className={`px-3.5 py-1.5 rounded-[2px] transition-all cursor-pointer font-bold uppercase tracking-wider text-[11px] ${
              activeFilter === 'AVAILABLE'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-400'
            }`}
          >
            Available ({availableCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('OCCUPIED')}
            className={`px-3.5 py-1.5 rounded-[2px] transition-all cursor-pointer font-bold uppercase tracking-wider text-[11px] ${
              activeFilter === 'OCCUPIED'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-400'
            }`}
          >
            Occupied ({occupiedCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('TURNOVER')}
            className={`px-3.5 py-1.5 rounded-[2px] transition-all cursor-pointer font-bold uppercase tracking-wider text-[11px] ${
              activeFilter === 'TURNOVER'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-400'
            }`}
          >
            Turnover ({turnoverCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('MAINTENANCE')}
            className={`px-3.5 py-1.5 rounded-[2px] transition-all cursor-pointer font-bold uppercase tracking-wider text-[11px] ${
              activeFilter === 'MAINTENANCE'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-400'
            }`}
          >
            Maintenance ({maintCount})
          </button>
        </div>

        <span className="text-[11px] font-mono text-slate-400">
          Showing {filteredRooms.length} of {rooms.length} Suites
        </span>
      </div>

      {/* Comprehensive Suite Inventory Table */}
      <div className="bg-white border border-slate-200/90 rounded-[2px] shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-[#FAF8F5]/60 flex items-center justify-between">
          <div>
            <h3 className="font-serif-grand text-base font-bold text-slate-900">
              Comprehensive Suite Inventory ({rooms.length} Residences)
            </h3>
            <p className="text-xs font-mono text-slate-500 mt-0.5">
              Live physical room statuses, housekeeping clearances, and occupancy.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">Floor-by-Floor Hierarchy</span>
        </div>

        {filteredRooms.length === 0 ? (
          <div className="p-10 text-center text-xs font-mono text-slate-400">
            No suites match the selected filter or search query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#FAF8F5] border-b border-slate-200/80 text-[10px] text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-5">Suite #</th>
                  <th className="py-3 px-4">Residence Title &amp; Tier</th>
                  <th className="py-3 px-4">Level / Floor</th>
                  <th className="py-3 px-4">Nightly Rate</th>
                  <th className="py-3 px-4">Room Status</th>
                  <th className="py-3 px-4">Assigned Guest</th>
                  <th className="py-3 px-5 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRooms.map((room) => {
                  const isOccupied = room.status === 'OCCUPIED'
                  const isAvailable = room.status === 'AVAILABLE'

                  return (
                    <tr key={room.roomNumber} className="hover:bg-[#FAF8F5]/50 transition-colors">
                      <td className="py-3.5 px-5 font-bold text-sm text-slate-900">
                        {room.roomNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <strong className="font-serif-grand text-sm text-slate-900 block font-bold">
                          {room.name}
                        </strong>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                          {room.tier || 'Luxury Suite'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {getFloorLabel(room.roomNumber)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        PKR {room.nightlyRate?.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        {getStatusText(room.status)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {isOccupied && (
                          <div>
                            <strong className="text-slate-900">{room.guest}</strong>
                            <span className="text-slate-500 block text-[11px]">
                              Due: PKR {room.balanceDue?.toLocaleString()}
                            </span>
                          </div>
                        )}
                        {isAvailable && (
                          <span className="text-emerald-950 font-medium">
                            Inspected &amp; Clean &bull; Ready for Check-In
                          </span>
                        )}
                        {room.status === 'CLEANING' && (
                          <span className="text-amber-900">
                            Cleaning Active &bull; {room.assignedCleaner || 'Attendant Assigned'}
                          </span>
                        )}
                        {room.status === 'DIRTY' && (
                          <span className="text-rose-900">
                            Turnover Queue &bull; Awaiting Cleaning
                          </span>
                        )}
                        {room.status === 'MAINTENANCE' && (
                          <span className="text-slate-500">
                            Engineering Work Order &bull; WO-891
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        {isOccupied && (
                          <div className="inline-flex gap-2">
                            <button
                              type="button"
                              onClick={() => onOpenFolio(room)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-mono uppercase font-bold rounded-[2px] transition-colors cursor-pointer"
                            >
                              + Charge
                            </button>
                            <button
                              type="button"
                              onClick={() => onOpenInvoice(room)}
                              className="px-3.5 py-1 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] text-[11px] font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer shadow-2xs"
                            >
                              Settle Bill &rarr;
                            </button>
                          </div>
                        )}
                        {isAvailable && (
                          <button
                            type="button"
                            onClick={() => onOpenCheckIn(room)}
                            className="px-4 py-1.5 bg-emerald-900 hover:bg-emerald-950 text-white text-[11px] font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer shadow-2xs"
                          >
                            Check-In &rarr;
                          </button>
                        )}
                        {!isOccupied && !isAvailable && (
                          <span className="text-[11px] font-mono uppercase text-slate-400 font-bold tracking-wider">
                            {room.status === 'CLEANING' ? 'In Cleaning' : room.status === 'DIRTY' ? 'In Turnover' : 'PMS Locked'}
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
