import React, { useState, useEffect } from 'react'
import { useToast } from '../../context/ToastContext'

export default function StaffList({
  staffAccounts = [],
  onCreateStaff,
  onToggleStatus,
}) {
  const { showToast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalRendered, setIsModalRendered] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('Password123!')
  const [role, setRole] = useState('receptionist')
  const [phone, setPhone] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fluid Hardware-Accelerated Mount/Unmount lifecycle
  useEffect(() => {
    if (isModalOpen) {
      setIsModalRendered(true)
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsModalVisible(true)
        })
      })
      return () => cancelAnimationFrame(raf)
    } else {
      setIsModalVisible(false)
      const timer = setTimeout(() => {
        setIsModalRendered(false)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isModalOpen])

  useEffect(() => {
    if (!isModalOpen) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsModalOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isModalOpen])

  const handleCreate = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setIsSubmitting(true)

    try {
      await onCreateStaff({ name, email, role, phone, password })
      showToast({
        type: 'success',
        title: 'Staff Account Created',
        message: `Account for ${name.trim()} (${role}) provisioned successfully.`,
      })
      setName('')
      setEmail('')
      setPhone('')
      setPassword('Password123!')
      setIsModalOpen(false)
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create staff account.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggle = async (staff) => {
    try {
      await onToggleStatus(staff.id)
      const nextStatus = staff.status === 'active' ? 'Deactivated' : 'Activated'
      showToast({
        type: 'info',
        title: `Staff ${nextStatus}`,
        message: `${staff.name} is now ${nextStatus.toLowerCase()}.`,
      })
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Status Update Failed',
        message: err.message || 'Could not update staff status.',
      })
    }
  }

  const filteredStaff = staffAccounts.filter((s) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      s.name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.role?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="bg-white border border-slate-200/90 rounded-[2px] shadow-xs overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif-grand text-xl text-slate-900">Staff Account Governance</h3>
          <p className="text-xs font-mono text-slate-500 mt-0.5">
            Role-Based Access Control (RBAC) &bull; Receptionists, Housekeeping, Operations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search staff by name or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-[2px] text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-900 w-52 sm:w-64"
          />
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-950 text-[#FFF0CA] text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer shrink-0"
          >
            + Add Staff Account
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-50 border-b border-slate-200/80 text-[10px] text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-5">Staff Member</th>
              <th className="py-3 px-4">Work Email</th>
              <th className="py-3 px-4">Assigned Role</th>
              <th className="py-3 px-4">Contact Extension</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStaff.map((staff) => (
              <tr key={staff.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-5 font-bold text-slate-900">{staff.name}</td>
                <td className="py-3.5 px-4 text-slate-600">{staff.email}</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-800 text-[10px] uppercase font-bold rounded">
                    {staff.role}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-500">{staff.phone}</td>
                <td className="py-3.5 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      staff.status === 'active'
                        ? 'bg-emerald-100 text-emerald-950'
                        : 'bg-red-100 text-red-900'
                    }`}
                  >
                    {staff.status}
                  </span>
                </td>
                <td className="py-3.5 px-5 text-right">
                  {staff.role !== 'admin' && (
                    <button
                      type="button"
                      onClick={() => handleToggle(staff)}
                      className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer border ${
                        staff.status === 'active'
                          ? 'border-red-200 text-red-700 hover:bg-red-50'
                          : 'border-emerald-200 text-emerald-800 hover:bg-emerald-50'
                      }`}
                    >
                      {staff.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filteredStaff.length === 0 && (
              <tr>
                <td colSpan="6" className="py-8 text-center text-slate-400 font-mono text-xs">
                  No staff members match the query "{searchQuery}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Staff Modal */}
      {isModalRendered && (
        <div 
          data-lenis-prevent="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false)
          }}
          className={`fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 transition-opacity duration-200 ease-out cursor-pointer ${
            isModalVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div 
            data-lenis-prevent="true"
            onClick={(e) => e.stopPropagation()}
            className={`bg-[#FAF8F5] border border-slate-300 rounded-[2px] shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto overscroll-contain p-6 sm:p-8 space-y-5 will-change-transform transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-default ${
              isModalVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-2'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-serif-grand text-xl text-slate-900">Provision New Staff Account</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-900 text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-900 text-xs rounded-[2px]">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-[10px] uppercase text-slate-500 font-semibold block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-[2px] text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase text-slate-500 font-semibold block mb-1">
                  Work Email (Used for Auto-Role Sign In)
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-[2px] text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase text-slate-500 font-semibold block mb-1">
                  Initial Password
                </label>
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-[2px] text-slate-900 focus:outline-none focus:border-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase text-slate-500 font-semibold block mb-1">
                  Assigned RBAC Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-[2px] text-slate-900 focus:outline-none focus:border-slate-900"
                >
                  <option value="receptionist">Front Desk Receptionist (/reception)</option>
                  <option value="housekeeping">Housekeeping Operations (/housekeeping)</option>
                  <option value="admin">Operations Manager (/admin)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase text-slate-500 font-semibold block mb-1">
                  Phone / Extension
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 0000000"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-[2px] text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 uppercase text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-[#0E1201] hover:bg-slate-900 disabled:opacity-50 text-[#FFF0CA] font-bold uppercase tracking-wider rounded-[2px] cursor-pointer"
                >
                  {isSubmitting ? 'Creating...' : 'Create Staff Account →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
