import React, { useState } from 'react'
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

  const handleStartEdit = (room) => {
    setEditingRoom(room.roomNumber)
    setNewRate(room.nightlyRate)
  }

  const handleSaveRate = async (roomNumber) => {
    const rateVal = Number(newRate)
    if (!rateVal || rateVal <= 0) {
      showToast({
        type: 'error',
        title: 'Invalid Tariff',
        message: 'Please specify a positive nightly rate in PKR.',
      })
      return
    }

    try {
      setIsSaving(true)
      await onUpdateRate(roomNumber, rateVal)
      showToast({
        type: 'success',
        title: 'Tariff Updated',
        message: `${roomNumber} base nightly tariff set to PKR ${rateVal.toLocaleString()}.`,
      })
      setEditingRoom(null)
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'Could not update room tariff.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleMaintenance = async (room) => {
    try {
      await onToggleMaintenance(room.roomNumber)
      const nextMode = room.status === 'MAINTENANCE' ? 'Active Inventory' : 'Refurbishment'
      showToast({
        type: 'info',
        title: 'Inventory Mode Changed',
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
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-serif-grand text-xl text-slate-900">Residences Catalog &amp; Dynamic Tariffs</h3>
          <p className="text-xs font-mono text-slate-500 mt-0.5">
            Manage base nightly tariffs, live catalog display, and maintenance refurbishment modes
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-50 border-b border-slate-200/80 text-[10px] text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-5">Residence</th>
              <th className="py-3 px-4">Tier</th>
              <th className="py-3 px-4">Base Tariff / Night</th>
              <th className="py-3 px-4">Operating Status</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rooms.map((room) => {
              const isEditing = editingRoom === room.roomNumber

              return (
                <tr key={room.roomNumber} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-slate-900">
                    {room.name}
                    <span className="block text-[10px] text-slate-400 font-normal">{room.roomNumber}</span>
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
                      {room.status === 'MAINTENANCE' ? 'REFURBISHMENT' : 'ACTIVE INVENTORY'}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(room)}
                      className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider border border-slate-200 hover:border-slate-900 rounded-[2px] transition-colors cursor-pointer text-slate-700"
                    >
                      Edit Rate
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
                      {room.status === 'MAINTENANCE' ? 'Reopen Suite' : 'Set Refurbishment'}
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
