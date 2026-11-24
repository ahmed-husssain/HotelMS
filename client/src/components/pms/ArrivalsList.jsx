import React from 'react'

export default function ArrivalsList({
  arrivals = [],
  rooms = [],
  onCheckInArrival,
  onOpenFolio,
  onOpenInvoice,
  onMarkNoShow,
  searchQuery = '',
}) {
  const q = searchQuery.toLowerCase().trim()

  const filteredArrivals = arrivals.filter((arr) => {
    if (!q) return true
    return (
      (arr.guest && arr.guest.toLowerCase().includes(q)) ||
      (arr.roomNumber && arr.roomNumber.toLowerCase().includes(q)) ||
      (arr.phone && arr.phone.toLowerCase().includes(q)) ||
      (arr.safepayRef && arr.safepayRef.toLowerCase().includes(q))
    )
  })

  // Occupied rooms scheduled for checkout or currently in residence
  const occupiedRooms = rooms.filter((r) => r.status === 'OCCUPIED')
  const departingRooms = occupiedRooms.filter((r) => {
    if (!q) return true
    return (
      (r.guest && r.guest.toLowerCase().includes(q)) ||
      (r.roomNumber && r.roomNumber.toLowerCase().includes(q)) ||
      (r.folioNumber && r.folioNumber.toLowerCase().includes(q))
    )
  })

  return (
    <div className="space-y-8">
      {/* SECTION A: ARRIVING TODAY */}
      <div className="bg-white border border-slate-200/90 rounded-[2px] shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-[#FAF8F5]/60 flex items-center justify-between">
          <div>
            <h3 className="font-serif-grand text-base font-bold text-slate-900">
              Arriving Today &bull; Check-In Queue
            </h3>
            <p className="text-xs font-mono text-slate-500 mt-0.5">
              Guests scheduled to arrive with verified Safepay 30% online deposit.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-700">
            {filteredArrivals.length} {filteredArrivals.length === 1 ? 'Guest' : 'Guests'}
          </span>
        </div>

        {filteredArrivals.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-slate-400">
            {q ? `No arrivals matching "${searchQuery}".` : 'No remaining arrivals in today’s queue.'}
          </div>
        ) : (
          <>
            {/* Desktop View (>=768px): Full 6-Column Operational Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#FAF8F5] border-b border-slate-200/80 text-[10px] text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-5">Suite Assignment</th>
                    <th className="py-3 px-4">Guest Information</th>
                    <th className="py-3 px-4">Estimated Arrival</th>
                    <th className="py-3 px-4">Online Deposit Paid (30%)</th>
                    <th className="py-3 px-4">Balance at Desk</th>
                    <th className="py-3 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredArrivals.map((arr) => {
                    const total = arr.totalValuation || (arr.advancePaid ? Math.round(arr.advancePaid / 0.3) : 0)
                    const balanceDue = total > arr.advancePaid ? total - arr.advancePaid : 0

                    return (
                      <tr key={arr.id} className="hover:bg-[#FAF8F5]/50 transition-colors">
                        <td className="py-4 px-5">
                          <span className="font-bold text-slate-900 text-sm block">
                            {arr.roomNumber}
                          </span>
                          <span className="text-[11px] text-slate-500 block">{arr.tier || 'Luxury Residence'}</span>
                          {(() => {
                            const r = rooms.find((rm) => rm.roomNumber === arr.roomNumber)
                            if (!r) return null
                            if (r.status === 'AVAILABLE') {
                              return <span className="inline-block mt-1 text-[9px] px-1.5 py-0.5 bg-emerald-100 text-emerald-950 rounded-[2px] font-bold">Clean &amp; Ready</span>
                            }
                            if (r.status === 'DIRTY' || r.status === 'CLEANING') {
                              return <span className="inline-block mt-1 text-[9px] px-1.5 py-0.5 bg-amber-100 text-amber-950 rounded-[2px] font-bold">Needs Cleaning</span>
                            }
                            if (r.status === 'MAINTENANCE') {
                              return <span className="inline-block mt-1 text-[9px] px-1.5 py-0.5 bg-red-100 text-red-950 rounded-[2px] font-bold">Maintenance Hold</span>
                            }
                            return null
                          })()}
                        </td>
                        <td className="py-4 px-4">
                          <strong className="font-serif-grand text-sm text-slate-900 block font-bold">
                            {arr.guest}
                          </strong>
                          <span className="text-slate-500 text-[11px]">
                            {arr.phone} &bull; {arr.nights || 1} {arr.nights === 1 ? 'Night' : 'Nights'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-slate-900 font-bold block">{arr.eta || 'Today'}</span>
                          <span className="text-[10px] text-slate-400">{arr.safepayRef}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-bold text-emerald-950 block">
                            PKR {arr.advancePaid?.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-400">Safepay 30% Verified</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-bold text-slate-900">
                            PKR {balanceDue ? balanceDue.toLocaleString() : 'Settled'}
                          </span>
                          <span className="text-[10px] text-slate-400 block">Due at Desk</span>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <div className="inline-flex gap-2">
                            <button
                              type="button"
                              onClick={() => onMarkNoShow && onMarkNoShow(arr)}
                              className="px-2.5 py-1.5 bg-white hover:bg-red-50 hover:text-red-700 text-slate-600 text-xs font-mono uppercase font-semibold rounded-[2px] border border-slate-200 transition-colors cursor-pointer min-h-[38px]"
                              title="Mark guest as no-show and release suite"
                            >
                              No-Show
                            </button>
                            <button
                              type="button"
                              onClick={() => onCheckInArrival(arr)}
                              className="px-4 py-1.5 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer shadow-2xs min-h-[38px] flex items-center"
                            >
                              Check-In &rarr;
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile View (<768px): Touch-Friendly Arrival Cards */}
            <div className="md:hidden divide-y divide-slate-100 p-3.5 space-y-4">
              {filteredArrivals.map((arr) => {
                const total = arr.totalValuation || (arr.advancePaid ? Math.round(arr.advancePaid / 0.3) : 0)
                const balanceDue = total > arr.advancePaid ? total - arr.advancePaid : 0
                const r = rooms.find((rm) => rm.roomNumber === arr.roomNumber)

                return (
                  <div key={arr.id} className="pt-4 first:pt-0 space-y-3">
                    {/* Suite & Status Pill */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 text-base font-mono">
                          {arr.roomNumber}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono block">
                          {arr.tier || 'Luxury Residence'}
                        </span>
                      </div>
                      {r && (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-[2px] font-bold uppercase ${
                          r.status === 'AVAILABLE'
                            ? 'bg-emerald-100 text-emerald-950'
                            : r.status === 'DIRTY' || r.status === 'CLEANING'
                            ? 'bg-amber-100 text-amber-950'
                            : 'bg-red-100 text-red-950'
                        }`}>
                          {r.status === 'AVAILABLE' ? 'Clean & Ready' : r.status === 'DIRTY' || r.status === 'CLEANING' ? 'Needs Cleaning' : 'Maintenance Hold'}
                        </span>
                      )}
                    </div>

                    {/* Guest Details */}
                    <div className="p-3 bg-slate-50 rounded-[2px] border border-slate-100 font-mono text-xs space-y-1">
                      <div className="flex justify-between items-baseline">
                        <strong className="font-serif-grand text-sm text-slate-900 font-bold">
                          {arr.guest}
                        </strong>
                        <span className="text-slate-500 text-[11px]">
                          {arr.nights || 1} {arr.nights === 1 ? 'Night' : 'Nights'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex justify-between">
                        <span>{arr.phone}</span>
                        <span className="text-slate-400 font-mono text-[10px]">{arr.safepayRef}</span>
                      </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="p-2 bg-emerald-50/70 border border-emerald-200/80 rounded-[2px]">
                        <span className="text-[10px] text-emerald-800 uppercase block font-semibold">30% Advance (Paid)</span>
                        <strong className="text-emerald-950 font-bold text-sm block">PKR {arr.advancePaid?.toLocaleString()}</strong>
                      </div>
                      <div className="p-2 bg-slate-100/80 border border-slate-200 rounded-[2px]">
                        <span className="text-[10px] text-slate-500 uppercase block font-semibold">Balance Due at Desk</span>
                        <strong className="text-slate-900 font-bold text-sm block">
                          {balanceDue ? `PKR ${balanceDue.toLocaleString()}` : 'Settled'}
                        </strong>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => onMarkNoShow && onMarkNoShow(arr)}
                        className="flex-1 py-2.5 px-3 bg-white hover:bg-red-50 hover:text-red-700 text-slate-600 text-xs font-mono uppercase font-semibold rounded-[2px] border border-slate-200 transition-colors cursor-pointer text-center min-h-[44px] flex items-center justify-center"
                        title="Mark guest as no-show and release suite"
                      >
                        No-Show
                      </button>
                      <button
                        type="button"
                        onClick={() => onCheckInArrival(arr)}
                        className="flex-[2] py-2.5 px-4 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer shadow-2xs text-center min-h-[44px] flex items-center justify-center gap-1.5"
                      >
                        <span>Check-In Guest</span>
                        <span>&rarr;</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* SECTION B: DEPARTING RESIDENTS (SETTLEMENT) */}
      <div className="bg-white border border-slate-200/90 rounded-[2px] shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-[#FAF8F5]/60 flex items-center justify-between">
          <div>
            <h3 className="font-serif-grand text-base font-bold text-slate-900">
              Departing Today &bull; Tax Invoice Settlement
            </h3>
            <p className="text-xs font-mono text-slate-500 mt-0.5">
              Collect remaining stay balance, post incidentals, and finalize checkout.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-700">
            {departingRooms.length} {departingRooms.length === 1 ? 'Departure' : 'Departures'}
          </span>
        </div>

        {departingRooms.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-slate-400">
            {q ? `No departures matching "${searchQuery}".` : 'No occupied rooms pending checkout.'}
          </div>
        ) : (
          <>
            {/* Desktop View (>=768px): Full 6-Column Operational Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#FAF8F5] border-b border-slate-200/80 text-[10px] text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-5">Suite &amp; Bill #</th>
                    <th className="py-3 px-4">Guest Information</th>
                    <th className="py-3 px-4">Nights Stayed</th>
                    <th className="py-3 px-4">Extra Services Posted</th>
                    <th className="py-3 px-4">Total Balance Due</th>
                    <th className="py-3 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {departingRooms.map((room) => {
                    const incidentalsCount = room.incidentals ? room.incidentals.length : 0
                    const incidentalsSum = room.incidentals
                      ? room.incidentals.reduce((sum, item) => sum + (item.amount || 0), 0)
                      : 0

                    return (
                      <tr key={room.roomNumber} className="hover:bg-[#FAF8F5]/50 transition-colors">
                        <td className="py-4 px-5">
                          <span className="font-bold text-slate-900 text-sm block">
                            {room.roomNumber}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Bill #: {room.folioNumber || 'OPEN'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <strong className="font-serif-grand text-sm text-slate-900 block font-bold">
                            {room.guest}
                          </strong>
                          <span className="text-slate-500 text-[11px]">
                            {room.phone || 'Phone verified'} &bull; {room.name}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-slate-900 font-bold block">
                            {room.nights || 1} {room.nights === 1 ? 'Night' : 'Nights'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {room.checkIn || '15 Nov'} &rarr; {room.checkOut || 'Today'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-bold text-slate-900 block">
                            PKR {incidentalsSum.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {incidentalsCount} {incidentalsCount === 1 ? 'Service Posted' : 'Services Posted'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-bold text-amber-950 text-base block">
                            PKR {room.balanceDue ? room.balanceDue.toLocaleString() : '0'}
                          </span>
                          <span className="text-[10px] text-slate-400">Includes 13% Sindh Tax</span>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <div className="inline-flex gap-2">
                            <button
                              type="button"
                              onClick={() => onOpenFolio(room)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono uppercase font-bold rounded-[2px] transition-colors cursor-pointer min-h-[38px]"
                            >
                              + Charge
                            </button>
                            <button
                              type="button"
                              onClick={() => onOpenInvoice(room)}
                              className="px-4 py-1.5 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer shadow-2xs min-h-[38px] flex items-center"
                            >
                              Settle &amp; Checkout &rarr;
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile View (<768px): Touch-Friendly Departure Settlement Cards */}
            <div className="md:hidden divide-y divide-slate-100 p-3.5 space-y-4">
              {departingRooms.map((room) => {
                const incidentalsCount = room.incidentals ? room.incidentals.length : 0
                const incidentalsSum = room.incidentals
                  ? room.incidentals.reduce((sum, item) => sum + (item.amount || 0), 0)
                  : 0

                return (
                  <div key={room.roomNumber} className="pt-4 first:pt-0 space-y-3">
                    {/* Suite & Bill Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 text-base font-mono">
                          Suite {room.roomNumber}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono block">
                          {room.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-[2px] font-semibold uppercase">
                        Bill #: {room.folioNumber || 'OPEN'}
                      </span>
                    </div>

                    {/* Guest Details */}
                    <div className="p-3 bg-slate-50 rounded-[2px] border border-slate-100 font-mono text-xs space-y-1">
                      <div className="flex justify-between items-baseline">
                        <strong className="font-serif-grand text-sm text-slate-900 font-bold">
                          {room.guest}
                        </strong>
                        <span className="text-slate-500 text-[11px]">
                          {room.nights || 1} {room.nights === 1 ? 'Night' : 'Nights'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Stay: {room.checkIn || '15 Nov'} &rarr; {room.checkOut || 'Today'}
                      </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="p-2 bg-slate-100/80 border border-slate-200 rounded-[2px]">
                        <span className="text-[10px] text-slate-500 uppercase block font-semibold">Incidentals Posted</span>
                        <strong className="text-slate-900 font-bold text-sm block">PKR {incidentalsSum.toLocaleString()}</strong>
                        <span className="text-[9px] text-slate-400 block">{incidentalsCount} services</span>
                      </div>
                      <div className="p-2 bg-amber-50/80 border border-amber-200 rounded-[2px]">
                        <span className="text-[10px] text-amber-800 uppercase block font-semibold">Total Balance Due</span>
                        <strong className="text-amber-950 font-bold text-sm block">
                          PKR {room.balanceDue ? room.balanceDue.toLocaleString() : '0'}
                        </strong>
                        <span className="text-[9px] text-slate-400 block">incl. 13% Sindh tax</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => onOpenFolio(room)}
                        className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono uppercase font-bold rounded-[2px] transition-colors cursor-pointer text-center min-h-[44px] flex items-center justify-center"
                      >
                        + Charge
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenInvoice(room)}
                        className="flex-[2] py-2.5 px-4 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer shadow-2xs text-center min-h-[44px] flex items-center justify-center gap-1.5"
                      >
                        <span>Settle &amp; Checkout</span>
                        <span>&rarr;</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
