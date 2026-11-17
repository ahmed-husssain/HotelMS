import React from 'react'

export default function CleaningQueue({
  rooms,
  onToggleTask,
  onCertifyReady,
}) {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200/80 pb-3 flex items-center justify-between">
        <div>
          <h3 className="font-serif-grand text-xl text-slate-900">Room Cleaning &amp; Turnover Queue</h3>
          <p className="text-xs font-mono text-slate-500 mt-0.5">
            4-Point Luxury Sanctuary Standard: Linens, Spa Salts, Minibar, and Supervisor Certification
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => {
          const tasks = room.cleaningTasks || { linen: false, bathSalts: false, minibar: false, inspection: false }
          const completedCount = Object.values(tasks).filter(Boolean).length
          const progressPercent = Math.round((completedCount / 4) * 100)
          const isReady = completedCount === 4
          const isAvailable = room.status === 'AVAILABLE'

          return (
            <div
              key={room.roomNumber}
              className={`bg-white border rounded-[2px] p-6 shadow-xs flex flex-col justify-between space-y-5 transition-all ${
                isAvailable
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : room.status === 'DIRTY'
                  ? 'border-red-200'
                  : 'border-slate-200/90'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-900">
                    {room.roomNumber}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase ${
                      isAvailable
                        ? 'bg-emerald-100 text-emerald-950'
                        : room.status === 'DIRTY'
                        ? 'bg-red-100 text-red-900'
                        : 'bg-blue-100 text-blue-900'
                    }`}
                  >
                    {room.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-serif-grand text-lg text-slate-900 leading-tight">
                    {room.name}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-500">
                    Assigned: {room.assignedCleaner || 'Bilal Farooq'} &bull; Priority: {room.priority || 'NORMAL'}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>Turnover Checklist</span>
                    <span>{completedCount} of 4 ({progressPercent}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isReady ? 'bg-emerald-600' : 'bg-slate-900'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Checklist Toggles */}
                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs font-mono">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tasks.linen}
                      onChange={(e) => onToggleTask(room.roomNumber, 'linen', e.target.checked)}
                      className="w-3.5 h-3.5 rounded-[2px] text-slate-900 focus:ring-0 cursor-pointer"
                    />
                    <span className={tasks.linen ? 'text-slate-900 line-through' : 'text-slate-600'}>
                      Fresh Egyptian Cotton Linens
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tasks.bathSalts}
                      onChange={(e) => onToggleTask(room.roomNumber, 'bathSalts', e.target.checked)}
                      className="w-3.5 h-3.5 rounded-[2px] text-slate-900 focus:ring-0 cursor-pointer"
                    />
                    <span className={tasks.bathSalts ? 'text-slate-900 line-through' : 'text-slate-600'}>
                      Cedar Bath Salts &amp; Jasmine Mist
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tasks.minibar}
                      onChange={(e) => onToggleTask(room.roomNumber, 'minibar', e.target.checked)}
                      className="w-3.5 h-3.5 rounded-[2px] text-slate-900 focus:ring-0 cursor-pointer"
                    />
                    <span className={tasks.minibar ? 'text-slate-900 line-through' : 'text-slate-600'}>
                      Organic Minibar Restocked
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tasks.inspection}
                      onChange={(e) => onToggleTask(room.roomNumber, 'inspection', e.target.checked)}
                      className="w-3.5 h-3.5 rounded-[2px] text-slate-900 focus:ring-0 cursor-pointer"
                    />
                    <span className={tasks.inspection ? 'text-slate-900 font-bold' : 'text-slate-600'}>
                      Supervisor Inspection Sign-Off
                    </span>
                  </label>
                </div>
              </div>

              {/* Ready Certification Button */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  disabled={!isReady || isAvailable}
                  onClick={() => onCertifyReady(room.roomNumber)}
                  className={`w-full py-2.5 text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors ${
                    isAvailable
                      ? 'bg-emerald-100 text-emerald-950 cursor-default'
                      : isReady
                      ? 'bg-emerald-900 hover:bg-emerald-950 text-white cursor-pointer shadow-xs'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isAvailable ? '✓ Ready & Available' : isReady ? 'Certify Inspected & Ready →' : 'Complete 4 Steps to Certify'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
