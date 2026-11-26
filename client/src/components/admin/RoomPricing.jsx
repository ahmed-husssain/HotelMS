import React, { useState, useMemo } from 'react'
import { useToast } from '../../context/ToastContext'

export default function RoomPricing({
  rooms,
  onUpdateRate,
  onToggleMaintenance,
}) {
  const { showToast } = useToast()
  const [editingRoom, setEditingRoom] = useState(null)
  const [newRate, setNewRate] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [locationFilter, setLocationFilter] = useState('all')

  const filteredRooms = useMemo(() => {
    if (!locationFilter || locationFilter === 'all') return rooms
    return rooms.filter((r) => (r.locationId || 'sindh-coast') === locationFilter)
  }, [rooms, locationFilter])

  const handleStartEdit = (room) => {
    setEditingRoom(room.roomNumber)
    setNewRate(room.nightlyRate)
  }

  const handleSaveRate = async (roomNumber) => {
    const rateVal = Number(newRate)
    if (!rateVal || rateVal <= 0) {
      showToast({
        type: 'error',
        title: 'Invalid Price',
        message: 'Please specify a positive nightly rate in PKR.',
      })
      return
    }

    try {
      setIsSaving(true)
      await onUpdateRate(roomNumber, rateVal)
      showToast({
        type: 'success',
        title: 'Price Updated',
        message: `${roomNumber} nightly price set to PKR ${rateVal.toLocaleString()}.`,
      })
      setEditingRoom(null)
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'Could not update room price.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleMaintenance = async (room) => {
    try {
      await onToggleMaintenance(room.roomNumber)
      const nextMode = room.status === 'MAINTENANCE' ? 'Ready for Guests' : 'Under Maintenance'
      showToast({
        type: 'info',
        title: 'Room Status Changed',
        message: `${room.roomNumber} set to ${nextMode}.`,
      })
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Action Failed',
        message: err.message || 'Could not update maintenance status.',
      })
    }
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-[2px] shadow-xs overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-serif-grand text-xl text-slate-900">Room Rates &amp; Pricing</h3>
          <p className="text-xs font-mono text-slate-500 mt-0.5">
            Manage nightly room prices and maintenance status across all 4 branches
          </p>
        </div>

        {/* Branch Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono shrink-0">
          {[
            { id: 'all', label: 'All (15)' },
            { id: 'sindh-coast', label: 'Sindh Coast' },
            { id: 'hunza', label: 'Hunza' },
            { id: 'lahore', label: 'Lahore' },
            { id: 'murree', label: 'Murree' },
          ].map((loc) => (
            <button
              key={loc.id}
              type="button"
              onClick={() => setLocationFilter(loc.id)}
              className={`px-2.5 py-1 rounded-[2px] cursor-pointer uppercase text-[10px] font-bold transition-colors ${
                locationFilter === loc.id
                  ? 'bg-slate-900 text-[#FFF0CA]'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {loc.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-50 border-b border-slate-200/80 text-[10px] text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-5">Room / Suite</th>
              <th className="py-3 px-4">Tier</th>
              <th className="py-3 px-4">Price Per Night</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRooms.map((room) => {
              const isEditing = editingRoom === room.roomNumber

              return (
                <tr key={room.roomNumber} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-slate-900">
                    {room.name}
                    <span className="block text-[10px] text-slate-400 font-normal">
                      {room.roomNumber} &bull; {room.city || (room.locationId === 'hunza' ? 'Hunza Valley' : room.locationId === 'lahore' ? 'Old Lahore' : room.locationId === 'murree' ? 'Murree Pines' : 'Sindh Coast')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{room.tier}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          required
                          min="1"
                          max="10000000"
                          value={newRate}
                          onChange={(e) => setNewRate(e.target.value)}
                          className="w-28 px-2 py-1 bg-white border border-slate-300 rounded-[2px] text-xs font-mono"
                          disabled={isSaving}
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveRate(room.roomNumber)}
                          disabled={isSaving}
                          className="px-3 py-1.5 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] text-xs font-semibold rounded-[2px] cursor-pointer disabled:opacity-50"
                        >
                          {isSaving ? '...' : 'Save'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingRoom(null)}
                          className="px-2 py-1 text-slate-400 hover:text-slate-700 text-sm cursor-pointer"
                        >
                          &times;
                        </button>
                      </div>
                    ) : (
                      <span>PKR {room.nightlyRate?.toLocaleString()}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        room.status === 'MAINTENANCE'
                          ? 'bg-red-100 text-red-900'
                          : 'bg-emerald-100 text-emerald-950'
                      }`}
                    >
                      {room.status === 'MAINTENANCE' ? 'UNDER MAINTENANCE' : 'READY FOR GUESTS'}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(room)}
                      className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider border border-slate-200 hover:border-slate-900 rounded-[2px] transition-colors cursor-pointer text-slate-700"
                    >
                      Edit Price
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleMaintenance(room)}
                      className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer border ${
                        room.status === 'MAINTENANCE'
                          ? 'border-emerald-200 text-emerald-800 hover:bg-emerald-50'
                          : 'border-amber-200 text-amber-800 hover:bg-amber-50'
                      }`}
                    >
                      {room.status === 'MAINTENANCE' ? 'Mark Available' : 'Mark Maintenance'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
