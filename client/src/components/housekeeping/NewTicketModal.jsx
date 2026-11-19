import React, { useEffect, useState } from 'react'

export default function NewTicketModal({ isOpen, onClose, rooms = [], onSubmitTicket, initialRoomNumber = '' }) {
  const [roomNumber, setRoomNumber] = useState(initialRoomNumber || (rooms[0]?.roomNumber || 'Suite 301'))
  const [category, setCategory] = useState('HVAC / Climate')
  const [issue, setIssue] = useState('')
  const [urgency, setUrgency] = useState('HIGH')
  const [assignedTo, setAssignedTo] = useState('Chief Engineer Rashid')
  const [isRendered, setIsRendered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen && initialRoomNumber) {
      setRoomNumber(initialRoomNumber)
    }
  }, [isOpen, initialRoomNumber])

  // Fluid Hardware-Accelerated Mount/Unmount lifecycle
  useEffect(() => {
    if (isOpen) {
      setIsRendered(true)
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true)
        })
      })
      return () => cancelAnimationFrame(raf)
    } else {
      setIsVisible(false)
      const timer = setTimeout(() => {
        setIsRendered(false)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isRendered) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!issue.trim()) return

    onSubmitTicket({
      roomNumber,
      category,
      issue: issue.trim(),
      urgency,
      assignedTo,
    })

    setIssue('')
    onClose()
  }

  return (
    <div 
      data-lenis-prevent="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className={`fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 transition-opacity duration-200 ease-out cursor-pointer ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div 
        data-lenis-prevent="true"
        onClick={(e) => e.stopPropagation()}
        className={`bg-[#FAF8F5] border border-slate-300 rounded-[2px] shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto overscroll-contain p-6 sm:p-8 space-y-6 will-change-transform transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-default ${
          isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-2'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-emerald-900 font-extrabold uppercase">
              // LOG MAINTENANCE WORK ORDER
            </span>
            <h3 className="font-serif-grand text-2xl text-slate-900 mt-0.5">
              New Engineering Ticket
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 text-lg cursor-pointer font-bold"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block mb-1">
                Suite Affected:
              </label>
              <select
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-[2px] text-slate-900 focus:outline-none focus:border-slate-900"
              >
                {rooms.map((r) => (
                  <option key={r.roomNumber} value={r.roomNumber}>
                    {r.roomNumber} ({r.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block mb-1">
                Category:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-[2px] text-slate-900 focus:outline-none focus:border-slate-900"
              >
                <option value="HVAC / Climate">HVAC / Climate</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Audio / Visual">Audio / Visual</option>
                <option value="Carpentry / Stone">Carpentry / Stone</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block mb-1">
              Urgency Level:
            </label>
            <div className="flex gap-2">
              {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUrgency(u)}
                  className={`flex-1 py-1.5 rounded-[2px] font-bold text-[10px] uppercase tracking-wider transition-colors cursor-pointer border ${
                    urgency === u
                      ? u === 'URGENT'
                        ? 'bg-red-900 text-white border-red-900'
                        : 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
            {urgency === 'URGENT' && (
              <span className="text-[10px] text-red-700 block mt-1">
                Warning: URGENT tickets automatically lock the suite to MAINTENANCE on PMS.
              </span>
            )}
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block mb-1">
              Detailed Description of Issue:
            </label>
            <textarea
              required
              rows="3"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              placeholder="Describe malfunction, leaking fixture, or calibration error..."
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-[2px] text-slate-900 focus:outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block mb-1">
              Assign to Engineer:
            </label>
            <input
              type="text"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-[2px] text-slate-900 focus:outline-none focus:border-slate-900"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs uppercase text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] text-xs uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer"
            >
              Dispatch Work Order →
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
