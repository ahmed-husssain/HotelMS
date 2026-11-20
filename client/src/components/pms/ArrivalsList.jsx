import React from 'react'

export default function ArrivalsList({
  arrivals = [],
  rooms = [],
  onCheckInArrival,
  onOpenFolio,
  onOpenInvoice,
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
          <div className="overflow-x-auto">
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
                        <span className="text-[11px] text-slate-500">{arr.tier || 'Luxury Residence'}</span>
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
                        <button
                          type="button"
                          onClick={() => onCheckInArrival(arr)}
                          className="px-4 py-2 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer shadow-2xs"
                        >
                          Check-In &rarr;
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
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
          <div className="overflow-x-auto">
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
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono uppercase font-bold rounded-[2px] transition-colors cursor-pointer"
                          >
                            + Charge
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenInvoice(room)}
                            className="px-4 py-1.5 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer shadow-2xs"
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
        )}
      </div>
    </div>
  )
}
