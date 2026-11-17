import React from 'react'

export default function RoomRack({
  rooms,
  activeFilter,
  setActiveFilter,
  onOpenCheckIn,
  onOpenFolio,
  onOpenInvoice,
}) {
  const filteredRooms = rooms.filter((r) => {
    if (activeFilter === 'ALL') return true
    return r.status === activeFilter
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OCCUPIED':
        return 'bg-amber-100 text-amber-900 border-amber-300'
      case 'AVAILABLE':
        return 'bg-emerald-100 text-emerald-950 border-emerald-300'
      case 'DIRTY':
        return 'bg-red-100 text-red-900 border-red-300'
      case 'CLEANING':
        return 'bg-blue-100 text-blue-900 border-blue-300'
      case 'INSPECTED':
        return 'bg-purple-100 text-purple-900 border-purple-300'
      case 'MAINTENANCE':
        return 'bg-slate-200 text-slate-800 border-slate-400'
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Hairline Status Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
          {['ALL', 'OCCUPIED', 'AVAILABLE', 'DIRTY', 'CLEANING', 'INSPECTED', 'MAINTENANCE'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setActiveFilter(status)}
              className={`px-3 py-1.5 rounded-[2px] transition-all cursor-pointer font-bold uppercase tracking-wider text-[10px] ${
                activeFilter === status
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <span className="text-[11px] font-mono text-slate-400">
          Showing {filteredRooms.length} of {rooms.length} Suites
        </span>
      </div>

      {/* Grid of Suites */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredRooms.map((room) => {
          const isOccupied = room.status === 'OCCUPIED'

          return (
            <div
              key={room.roomNumber}
              className="bg-white border border-slate-200/90 rounded-[2px] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              {/* Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-900 tracking-wider">
                    {room.roomNumber}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase border ${getStatusBadge(
                      room.status
                    )}`}
                  >
                    {room.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-serif-grand text-lg text-slate-900 leading-tight">
                    {room.name}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">
                    PKR {room.nightlyRate?.toLocaleString()} / Night
                  </span>
                </div>
              </div>

              {/* Guest / Occupant Info */}
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-[2px] text-xs font-mono space-y-1">
                {isOccupied ? (
                  <>
                    <div className="text-slate-900 font-bold truncate">{room.guest}</div>
                    <div className="text-[10px] text-slate-500">Folio: {room.folioNumber}</div>
                    <div className="text-[10px] text-amber-900 font-semibold pt-1 border-t border-slate-200 flex justify-between">
                      <span>Due at Checkout:</span>
                      <span>PKR {room.balanceDue?.toLocaleString()}</span>
                    </div>
                  </>
                ) : (
                  <div className="text-slate-400 text-[11px] py-1">
                    {room.status === 'AVAILABLE' ? 'Vacant & Ready for Check-in' : `Turnover Status: ${room.status}`}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex gap-2">
                {isOccupied ? (
                  <>
                    <button
                      type="button"
                      onClick={() => onOpenFolio(room)}
                      className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-mono uppercase tracking-wider font-bold rounded-[2px] transition-colors cursor-pointer"
                    >
                      + Incidental
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenInvoice(room)}
                      className="flex-1 py-2 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] text-[10px] font-mono uppercase tracking-wider font-bold rounded-[2px] transition-colors cursor-pointer"
                    >
                      Checkout &rarr;
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => onOpenCheckIn(room)}
                    disabled={room.status !== 'AVAILABLE'}
                    className={`w-full py-2 text-[10px] font-mono uppercase tracking-wider font-bold rounded-[2px] transition-colors ${
                      room.status === 'AVAILABLE'
                        ? 'bg-emerald-900 hover:bg-emerald-950 text-white cursor-pointer'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {room.status === 'AVAILABLE' ? 'Check-in Guest' : 'Awaiting Turnover'}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
