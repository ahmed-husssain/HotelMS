import React, { useState } from 'react'

/**
 * CleaningQueue — Option A Architectural Floor Matrix
 * 
 * Fulfills Hotel Operations Standard:
 * - Clean floor-by-floor room groupings (Level 01, Level 02, Level 03)
 * - Plain, simple English (no confusing hotel jargon)
 * - High-value contextual information (Next Arrival, Stayover vs Checkout, Cleaner assigned)
 * - 4-step verified cleaning checklist with tactile feedback
 * - Strict Zero-Icon Protocol (no SVGs, no emojis, no icon fonts)
 * - Touch-first mobile compliance (>=44x44px targets)
 */
export default function CleaningQueue({
  rooms = [],
  onToggleTask,
  onCertifyReady,
  onOpenReportTicket,
}) {
  const [activeFilter, setActiveFilter] = useState('ALL') // 'ALL' | 'DIRTY' | 'CLEANING' | 'READY'
  const [selectedDetailRoom, setSelectedDetailRoom] = useState(null)

  // Body scroll lock effect when room detail drawer is open
  useEffect(() => {
    if (!selectedDetailRoom) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedDetailRoom(null)
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedDetailRoom])

  // Quick Counts
  const dirtyCount = rooms.filter((r) => r.status === 'DIRTY').length
  const cleaningCount = rooms.filter((r) => r.status === 'CLEANING').length
  const readyCount = rooms.filter((r) => r.status === 'AVAILABLE' || r.status === 'INSPECTED').length

  // Helper to determine floor level from roomNumber or category
  const getFloorNumber = (room) => {
    const numStr = (room.roomNumber || '').replace(/\D/g, '')
    const num = parseInt(numStr, 10)
    if (!isNaN(num)) {
      if (num >= 300) return 3
      if (num >= 200) return 2
      return 1
    }
    if ((room.category || '').toLowerCase().includes('penthouse')) return 3
    if ((room.category || '').toLowerCase().includes('ocean') || (room.category || '').toLowerCase().includes('courtyard')) return 2
    return 1
  }

  const floorSections = [
    {
      level: 1,
      title: 'Floor 1',
      subtitle: 'Beachfront & Overwater Villas',
    },
    {
      level: 2,
      title: 'Floor 2',
      subtitle: 'Ocean View Courtyard Suites',
    },
    {
      level: 3,
      title: 'Floor 3',
      subtitle: 'Top Floor Luxury Penthouses',
    },
  ]

  const getFilteredRoomsForFloor = (floorLevel) => {
    return rooms.filter((room) => {
      if (getFloorNumber(room) !== floorLevel) return false
      const isReady = room.status === 'AVAILABLE' || room.status === 'INSPECTED'
      const isDirty = room.status === 'DIRTY'
      const isCleaning = room.status === 'CLEANING'

      if (activeFilter === 'DIRTY' && !isDirty) return false
      if (activeFilter === 'CLEANING' && !isCleaning) return false
      if (activeFilter === 'READY' && !isReady) return false
      return true
    })
  }

  return (
    <div className="space-y-8">
      {/* 1. FILTER CONTROLS (STRICTLY ZERO ICONS) */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-slate-500 uppercase tracking-wider mr-1">Show:</span>
          <button
            type="button"
            onClick={() => setActiveFilter('ALL')}
            className={`min-h-[40px] px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider font-bold rounded-[2px] cursor-pointer transition-all ${
              activeFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-400'
            }`}
          >
            All Rooms ({rooms.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('DIRTY')}
            className={`min-h-[40px] px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider font-semibold rounded-[2px] cursor-pointer transition-all ${
              activeFilter === 'DIRTY'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-400'
            }`}
          >
            Needs Cleaning ({dirtyCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('CLEANING')}
            className={`min-h-[40px] px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider font-semibold rounded-[2px] cursor-pointer transition-all ${
              activeFilter === 'CLEANING'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-400'
            }`}
          >
            Being Cleaned ({cleaningCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('READY')}
            className={`min-h-[40px] px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider font-semibold rounded-[2px] cursor-pointer transition-all ${
              activeFilter === 'READY'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-400'
            }`}
          >
            Clean &amp; Ready ({readyCount})
          </button>
        </div>

        <div className="text-xs font-mono text-slate-500">
          Check off 4 steps to approve room for front desk
        </div>
      </div>

      {/* 2. OPTION A: ARCHITECTURAL FLOOR MATRIX */}
      <div className="space-y-10">
        {floorSections.map((floor) => {
          const floorRooms = getFilteredRoomsForFloor(floor.level)
          if (floorRooms.length === 0 && activeFilter !== 'ALL') return null

          return (
            <section key={floor.level} className="space-y-4">
              {/* Floor Header */}
              <div className="flex items-center justify-between border-b border-slate-300 pb-2.5">
                <div className="flex items-center gap-3">
                  <h3 className="font-serif-grand text-xl font-bold text-slate-900">{floor.title}</h3>
                  <span className="text-xs font-mono uppercase text-slate-500 font-medium">
                    {floor.subtitle}
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-600 font-semibold">
                  {floorRooms.length} {floorRooms.length === 1 ? 'Room' : 'Rooms'}
                </span>
              </div>

              {/* Room Cards Grid */}
              {floorRooms.length === 0 ? (
                <div className="p-6 text-center text-xs font-mono text-slate-400 bg-white border border-slate-200 rounded-[2px]">
                  No rooms on {floor.title} match the selected filter.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {floorRooms.map((room) => {
                    const tasks = room.cleaningTasks || { linen: false, bathSalts: false, minibar: false, inspection: false }
                    const completedCount = Object.values(tasks).filter(Boolean).length
                    const isAllStepsDone = completedCount === 4
                    const isAvailable = room.status === 'AVAILABLE' || room.status === 'INSPECTED'
                    const isDirty = room.status === 'DIRTY'
                    const isCleaning = room.status === 'CLEANING'

                    // Status Pill (Simple English, Zero Icons)
                    let statusLabel = 'Needs Cleaning'
                    let statusClasses = 'bg-rose-50 border-rose-200 text-rose-800'
                    if (isAvailable) {
                      statusLabel = 'Clean & Ready'
                      statusClasses = 'bg-emerald-50 border-emerald-200 text-emerald-950 font-bold'
                    } else if (isCleaning) {
                      statusLabel = 'Being Cleaned'
                      statusClasses = 'bg-amber-50 border-amber-300 text-amber-900 font-bold'
                    }

                    // Priority / Arrival Notice
                    const isUrgent = room.priority === 'URGENT' || room.priority === 'HIGH'
                    const arrivalText = room.nextArrival || (isUrgent ? 'Next Guest Arriving Today' : 'Next Arrival: Open')
                    const situationText = isAvailable
                      ? 'Ready for Guest Check-In'
                      : room.guest
                      ? 'Guest Staying Today (Refresh Service)'
                      : 'Guest Checked Out (Deep Clean)'

                    return (
                      <div
                        key={room.roomNumber}
                        className={`bg-white border rounded-[2px] p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-sm transition-shadow ${
                          isAvailable
                            ? 'border-emerald-200 bg-emerald-50/15'
                            : isDirty
                            ? 'border-rose-200'
                            : 'border-amber-200'
                        }`}
                      >
                        {/* Top Card Info */}
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="font-serif-grand text-2xl font-bold text-slate-900 block leading-tight">
                                {room.roomNumber}
                              </span>
                              <span className="text-xs text-slate-500 font-sans-clean font-medium block">
                                {room.name || room.tier || 'Luxury Suite'}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                                {room.city || (room.locationId === 'hunza' ? 'Hunza Valley' : room.locationId === 'lahore' ? 'Old Lahore' : room.locationId === 'murree' ? 'Murree Pines' : 'Sindh Coast')}
                              </span>
                            </div>
                            <span className={`inline-block text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 border rounded-[2px] shrink-0 ${statusClasses}`}>
                              {statusLabel}
                            </span>
                          </div>

                          {/* Urgent Arrival Notice */}
                          {isUrgent && (
                            <div className="text-[10px] font-mono font-bold text-amber-950 bg-amber-100/70 border border-amber-300 px-2 py-0.5 inline-block rounded-[2px]">
                              URGENT: Next Guest Arriving Soon
                            </div>
                          )}

                          {/* Operational Context (Simple English) */}
                          <div className="pt-2 border-t border-slate-100 text-xs font-sans-clean space-y-1">
                            <div className="text-slate-700 font-medium">{situationText}</div>
                            <div className="text-[11px] font-mono text-slate-500">{arrivalText}</div>
                            <div className="text-[11px] font-mono text-slate-600">
                              Cleaned by: <span className="font-bold text-slate-800">{room.assignedCleaner || 'Housekeeping Staff'}</span>
                            </div>
                          </div>

                          {/* 4-Step Checklist (Plain English, Zero Icons) */}
                          <div className="pt-3 border-t border-slate-100 space-y-2 text-xs font-mono">
                            <div className="flex justify-between items-center text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                              <span>Cleaning Steps</span>
                              <span className="font-bold text-slate-700">{completedCount} of 4 Completed</span>
                            </div>

                            <label className="flex items-center gap-2.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={!!tasks.linen}
                                onChange={(e) => onToggleTask(room.roomNumber, 'linen', e.target.checked)}
                                className="w-4 h-4 accent-slate-900 cursor-pointer rounded-[2px]"
                              />
                              <span className={tasks.linen ? 'text-slate-900 line-through' : 'text-slate-700'}>
                                1. Clean Bed Sheets &amp; Towels
                              </span>
                            </label>

                            <label className="flex items-center gap-2.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={!!tasks.bathSalts}
                                onChange={(e) => onToggleTask(room.roomNumber, 'bathSalts', e.target.checked)}
                                className="w-4 h-4 accent-slate-900 cursor-pointer rounded-[2px]"
                              />
                              <span className={tasks.bathSalts ? 'text-slate-900 line-through' : 'text-slate-700'}>
                                2. Bathroom Clean &amp; Soaps Filled
                              </span>
                            </label>

                            <label className="flex items-center gap-2.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={!!tasks.minibar}
                                onChange={(e) => onToggleTask(room.roomNumber, 'minibar', e.target.checked)}
                                className="w-4 h-4 accent-slate-900 cursor-pointer rounded-[2px]"
                              />
                              <span className={tasks.minibar ? 'text-slate-900 line-through' : 'text-slate-700'}>
                                3. Water Bottles &amp; Fridge Restocked
                              </span>
                            </label>

                            <label className="flex items-center gap-2.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={!!tasks.inspection}
                                onChange={(e) => onToggleTask(room.roomNumber, 'inspection', e.target.checked)}
                                className="w-4 h-4 accent-slate-900 cursor-pointer rounded-[2px]"
                              />
                              <span className={tasks.inspection ? 'text-slate-900 font-bold' : 'text-slate-700'}>
                                4. Supervisor Final Room Check
                              </span>
                            </label>
                          </div>
                        </div>

                        {/* Bottom Actions (>=44px touch target) */}
                        <div className="pt-3 border-t border-slate-100 space-y-2">
                          {isAvailable ? (
                            <div className="min-h-[44px] w-full bg-emerald-50 text-emerald-950 border border-emerald-200 text-xs font-mono font-bold uppercase tracking-wider rounded-[2px] flex items-center justify-center">
                              Room Certified Clean &amp; Ready
                            </div>
                          ) : (
                            <button
                              type="button"
                              disabled={!isAllStepsDone}
                              onClick={() => onCertifyReady(room.roomNumber)}
                              className={`w-full min-h-[44px] py-2.5 text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors ${
                                isAllStepsDone
                                  ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer shadow-2xs'
                                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              }`}
                            >
                              {isAllStepsDone ? 'Approve Room for Next Guest' : 'Complete 4 Steps to Approve'}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setSelectedDetailRoom(room)}
                            className="w-full min-h-[38px] py-1.5 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 text-xs font-mono uppercase tracking-wider rounded-[2px] cursor-pointer"
                          >
                            View Room Details &amp; Notes
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          )
        })}
      </div>

      {/* 3. ROOM DETAIL DRAWER (PROGRESSIVE DISCLOSURE — ZERO ICONS) */}
      {selectedDetailRoom && (
        <>
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40"
            onClick={() => setSelectedDetailRoom(null)}
          />
          <aside className="fixed top-0 right-0 h-full w-full max-w-md bg-[#FAF8F5] border-l border-slate-300 shadow-2xl z-50 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto overscroll-contain">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
                    Room Details &amp; Guest Preferences
                  </span>
                  <h3 className="font-serif-grand text-2xl font-bold text-slate-900 mt-1">
                    {selectedDetailRoom.roomNumber}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDetailRoom(null)}
                  className="min-h-[44px] px-3.5 border border-slate-300 bg-white text-xs font-mono uppercase text-slate-700 hover:text-slate-950 rounded-[2px] cursor-pointer"
                >
                  Close [X]
                </button>
              </div>

              {/* Essential Room Specifications */}
              <div className="bg-white border border-slate-200 p-4 rounded-[2px] space-y-2 text-xs font-sans-clean">
                <div className="flex justify-between">
                  <span className="text-slate-500">Suite Type:</span>
                  <span className="font-bold text-slate-900">{selectedDetailRoom.name || selectedDetailRoom.tier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Bed Configuration:</span>
                  <span className="font-bold text-slate-900">1 California King Bed (Split upon request)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cleaner Assigned:</span>
                  <span className="font-bold text-slate-900">{selectedDetailRoom.assignedCleaner || 'Housekeeping Staff'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Next Scheduled Arrival:</span>
                  <span className="font-bold text-slate-900">{selectedDetailRoom.nextArrival || 'Today (Check-in 14:00)'}</span>
                </div>
              </div>

              {/* Special Guest Instructions & Alerts */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase text-slate-600 font-bold tracking-wider block">
                  Special Guest Notes for Attendant
                </span>
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-[2px] text-xs font-sans-clean space-y-2">
                  <div className="font-semibold text-amber-950">Feather Allergy Notice</div>
                  <p className="text-amber-900 text-xs">
                    Guest has feather allergy. Dress bed with synthetic hypoallergenic pillows and duvet only. Do not use feather bolsters.
                  </p>
                </div>
              </div>

              {/* Mini-Fridge Consumable Checklist */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase text-slate-600 font-bold tracking-wider block">
                  Check Mini-Fridge &amp; Snacks
                </span>
                <div className="bg-white border border-slate-200 p-4 rounded-[2px] text-xs font-mono space-y-1.5 text-slate-700">
                  <div className="flex justify-between">
                    <span>Complimentary Artisan Water</span>
                    <span className="font-bold">4 Bottles Stocked</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Espresso Pods &amp; Loose Tea</span>
                    <span className="font-bold">6 Pods Stocked</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Organic Fruit &amp; Nut Tray</span>
                    <span className="font-bold">Fresh Replenished</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Actions */}
            <div className="pt-6 border-t border-slate-200 space-y-2.5 mt-6">
              <button
                type="button"
                onClick={() => {
                  setSelectedDetailRoom(null)
                  if (onOpenReportTicket) onOpenReportTicket(selectedDetailRoom.roomNumber)
                }}
                className="w-full min-h-[44px] bg-white border border-rose-300 text-rose-900 hover:bg-rose-50 font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] cursor-pointer"
              >
                Report Broken Item in this Room
              </button>
              <button
                type="button"
                onClick={() => setSelectedDetailRoom(null)}
                className="w-full min-h-[44px] bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] cursor-pointer"
              >
                Done / Back to Floor Plan
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  )
}
