import React, { useState, useEffect } from 'react'
import { useToast } from '../../context/ToastContext'

export default function StaffList({
  staffAccounts = [],
  onCreateStaff,
  onToggleStatus,
  onUpdateStaff,
  onDeleteStaff,
}) {
  const { showToast } = useToast()

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [showStaffPassword, setShowStaffPassword] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Add Form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('Password123!')
  const [role, setRole] = useState('receptionist')
  const [phone, setPhone] = useState('')
  const [shiftStatus, setShiftStatus] = useState('Morning Shift (08:00 - 16:00)')

  // Edit Form state
  const [editStaffId, setEditStaffId] = useState('')
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editRole, setEditRole] = useState('receptionist')
  const [editPhone, setEditPhone] = useState('')
  const [editShift, setEditShift] = useState('')

  // Delete target state
  const [staffToDelete, setStaffToDelete] = useState(null)

  // ESC key modal handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsAddModalOpen(false)
        setIsEditModalOpen(false)
        setIsDeleteModalOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Lock body scroll when any modal is open
  useEffect(() => {
    const isOpen = isAddModalOpen || isEditModalOpen || isDeleteModalOpen
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isAddModalOpen, isEditModalOpen, isDeleteModalOpen])

  // Handle Create Staff
  const handleCreate = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setIsSubmitting(true)

    try {
      await onCreateStaff({
        name,
        email,
        role,
        phone,
        password,
        shiftStatus,
      })
      showToast({
        type: 'success',
        title: 'Staff Member Added',
        message: `${name.trim()} (${role}) added to hotel staff team.`,
      })
      setName('')
      setEmail('')
      setPhone('')
      setPassword('Password123!')
      setShiftStatus('Morning Shift (08:00 - 16:00)')
      setIsAddModalOpen(false)
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create staff account.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Open Edit Modal with pre-filled staff data
  const handleOpenEdit = (staff) => {
    setErrorMsg('')
    setEditStaffId(staff.id)
    setEditName(staff.name || '')
    setEditEmail(staff.email || '')
    setEditRole(staff.role || 'receptionist')
    setEditPhone(staff.phone || '')
    setEditShift(staff.shiftStatus || 'Morning Shift (08:00 - 16:00)')
    setIsEditModalOpen(true)
  }

  // Handle Update Staff
  const handleUpdate = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setIsSubmitting(true)

    try {
      if (onUpdateStaff) {
        await onUpdateStaff(editStaffId, {
          name: editName.trim(),
          email: editEmail.trim(),
          role: editRole,
          phone: editPhone.trim(),
          shiftStatus: editShift.trim(),
        })
      }
      showToast({
        type: 'success',
        title: 'Staff Profile Updated',
        message: `${editName.trim()} profile details updated successfully.`,
      })
      setIsEditModalOpen(false)
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update staff member.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Toggle Active/Inactive
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

  // Open Delete Confirmation Modal
  const handleOpenDelete = (staff) => {
    setStaffToDelete(staff)
    setIsDeleteModalOpen(true)
  }

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!staffToDelete) return
    setIsSubmitting(true)
    try {
      if (onDeleteStaff) {
        await onDeleteStaff(staffToDelete.id)
      }
      showToast({
        type: 'success',
        title: 'Staff Member Removed',
        message: `${staffToDelete.name} was removed from the team.`,
      })
      setIsDeleteModalOpen(false)
      setStaffToDelete(null)
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Deletion Failed',
        message: err.message || 'Could not delete staff member.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredStaff = staffAccounts.filter((s) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      s.name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.role?.toLowerCase().includes(q) ||
      s.shiftStatus?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="bg-white border border-slate-200/90 rounded-[2px] shadow-xs overflow-hidden">
      {/* 1. Header with Controls */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif-grand text-xl text-slate-900">Hotel Staff Team</h3>
          <p className="text-xs font-mono text-slate-500 mt-0.5">
            Staff Roles &amp; Permissions &bull; Receptionists, Housekeeping, Operations
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search staff by name, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-[2px] text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-900 w-52 sm:w-64"
          />
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-950 text-[#FFF0CA] text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer shrink-0"
          >
            + Add Staff Member
          </button>
        </div>
      </div>

      {/* 2. Staff Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-50 border-b border-slate-200/80 text-[10px] text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-5">Staff Member</th>
              <th className="py-3 px-4">Work Email</th>
              <th className="py-3 px-4">Assigned Role</th>
              <th className="py-3 px-4">Phone / Ext</th>
              <th className="py-3 px-4">Duty Shift</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStaff.map((staff) => (
              <tr key={staff.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-5 font-bold text-slate-900">
                  {staff.name}
                  {staff.role === 'admin' && (
                    <span className="ml-2 text-[9px] text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded uppercase font-bold">
                      GM
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-slate-600">{staff.email}</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-800 text-[10px] uppercase font-bold rounded">
                    {staff.role === 'receptionist'
                      ? 'Receptionist'
                      : staff.role === 'housekeeping'
                      ? 'Housekeeping'
                      : 'Operations GM'}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-500">{staff.phone || 'Internal Ext'}</td>
                <td className="py-3.5 px-4 text-slate-600">
                  <span className="text-[11px] text-slate-700">
                    {staff.shiftStatus || 'Morning Shift (Active)'}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      staff.status === 'active'
                        ? 'bg-emerald-100 text-emerald-950'
                        : 'bg-red-100 text-red-900'
                    }`}
                  >
                    {staff.status || 'active'}
                  </span>
                </td>
                <td className="py-3.5 px-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(staff)}
                      className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer border border-slate-300 text-slate-700 hover:bg-slate-100"
                    >
                      Edit
                    </button>

                    {/* Activate / Deactivate Toggle (Hidden for primary admin) */}
                    {staff.role !== 'admin' && (
                      <button
                        type="button"
                        onClick={() => handleToggle(staff)}
                        className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer border ${
                          staff.status === 'active'
                            ? 'border-amber-200 text-amber-800 hover:bg-amber-50'
                            : 'border-emerald-200 text-emerald-800 hover:bg-emerald-50'
                        }`}
                      >
                        {staff.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    )}

                    {/* Delete Button (Hidden for primary admin) */}
                    {staff.role !== 'admin' && (
                      <button
                        type="button"
                        onClick={() => handleOpenDelete(staff)}
                        className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer border border-red-200 text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredStaff.length === 0 && (
              <tr>
                <td colSpan="7" className="py-8 text-center text-slate-400 font-mono text-xs">
                  No staff members match the query "{searchQuery}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 3. ADD STAFF MODAL */}
      {isAddModalOpen && (
        <div
          data-lenis-prevent="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddModalOpen(false)
          }}
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            data-lenis-prevent="true"
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FAF8F5] border border-slate-300 rounded-[3px] shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-serif-grand text-xl text-slate-900">Add Hotel Staff Member</h3>
                <p className="text-[11px] font-mono text-slate-500">Create new staff credentials with role permissions</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 text-lg cursor-pointer"
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
                  maxLength={100}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Asad Malik"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-[2px] text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase text-slate-500 font-semibold block mb-1">
                  Work Email Address
                </label>
                <input
                  type="email"
                  required
                  maxLength={120}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. asad@stayza.com"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-[2px] text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase text-slate-500 font-semibold block mb-1">
                  Initial Password
                </label>
                <div className="relative">
                  <input
                    type={showStaffPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-[2px] text-slate-900 focus:outline-none focus:border-slate-900 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowStaffPassword(!showStaffPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800 p-1 cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showStaffPassword ? (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase text-slate-500 font-semibold block mb-1">
                    Staff Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-[2px] text-slate-900 focus:outline-none focus:border-slate-900"
                  >
                    <option value="receptionist">Receptionist (/reception)</option>
                    <option value="housekeeping">Housekeeping (/housekeeping)</option>
                    <option value="admin">Operations GM (/admin)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase text-slate-500 font-semibold block mb-1">
                    Phone / Extension (Digits Only, Max 15)
                  </label>
                  <input
                    type="tel"
                    maxLength={15}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^\d+]/g, '').slice(0, 15))}
                    placeholder="+92 300 0000000"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-[2px] text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase text-slate-500 font-semibold block mb-1">
                  Assigned Shift
                </label>
                <select
                  value={shiftStatus}
                  onChange={(e) => setShiftStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-[2px] text-slate-900 focus:outline-none focus:border-slate-900"
                >
                  <option value="Morning Shift (08:00 - 16:00)">Morning Shift (08:00 - 16:00)</option>
                  <option value="Evening Shift (16:00 - 00:00)">Evening Shift (16:00 - 00:00)</option>
                  <option value="Night Shift (00:00 - 08:00)">Night Shift (00:00 - 08:00)</option>
                  <option value="Rotating Duty">Rotating Duty</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 uppercase text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-[#0E1201] hover:bg-slate-900 disabled:opacity-50 text-[#FFF0CA] font-bold uppercase tracking-wider rounded-[2px] cursor-pointer"
                >
                  {isSubmitting ? 'Adding...' : 'Add Staff Member →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. EDIT STAFF MODAL */}
      {isEditModalOpen && (
        <div
          data-lenis-prevent="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsEditModalOpen(false)
          }}
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            data-lenis-prevent="true"
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FAF8F5] border border-slate-300 rounded-[3px] shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-serif-grand text-xl text-slate-900">Edit Staff Member</h3>
                <p className="text-[11px] font-mono text-slate-500">Update employee profile, shift, or role assignment</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-900 text-xs rounded-[2px]">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-[10px] uppercase text-slate-500 font-semibold block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-[2px] text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase text-slate-500 font-semibold block mb-1">
                  Work Email Address
                </label>
                <input
                  type="email"
                  required
                  maxLength={120}
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-[2px] text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase text-slate-500 font-semibold block mb-1">
                    Staff Role
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-[2px] text-slate-900 focus:outline-none focus:border-slate-900"
                  >
                    <option value="receptionist">Receptionist (/reception)</option>
                    <option value="housekeeping">Housekeeping (/housekeeping)</option>
                    <option value="admin">Operations GM (/admin)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase text-slate-500 font-semibold block mb-1">
                    Phone / Extension
                  </label>
                  <input
                    type="tel"
                    maxLength={15}
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value.replace(/[^\d+]/g, '').slice(0, 15))}
                    placeholder="+92 300 0000000"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-[2px] text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase text-slate-500 font-semibold block mb-1">
                  Duty Shift
                </label>
                <select
                  value={editShift}
                  onChange={(e) => setEditShift(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-[2px] text-slate-900 focus:outline-none focus:border-slate-900"
                >
                  <option value="Morning Shift (08:00 - 16:00)">Morning Shift (08:00 - 16:00)</option>
                  <option value="Evening Shift (16:00 - 00:00)">Evening Shift (16:00 - 00:00)</option>
                  <option value="Night Shift (00:00 - 08:00)">Night Shift (00:00 - 08:00)</option>
                  <option value="Rotating Duty">Rotating Duty</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 uppercase text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-[#0E1201] hover:bg-slate-900 disabled:opacity-50 text-[#FFF0CA] font-bold uppercase tracking-wider rounded-[2px] cursor-pointer"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && staffToDelete && (
        <div
          data-lenis-prevent="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsDeleteModalOpen(false)
          }}
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            data-lenis-prevent="true"
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FAF8F5] border border-red-300 rounded-[3px] shadow-2xl max-w-sm w-full p-6 space-y-4 text-xs font-mono"
          >
            <div className="flex items-center gap-2 text-red-700 font-bold uppercase tracking-wider text-[11px]">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
              <span>Confirm Staff Removal</span>
            </div>

            <p className="text-slate-800 text-sm font-sans-clean font-medium">
              Are you sure you want to remove <strong>{staffToDelete.name}</strong> ({staffToDelete.email}) from the hotel staff directory?
            </p>

            <p className="text-[11px] text-slate-500 bg-red-50 p-2.5 border border-red-200 rounded-[2px]">
              This employee will lose access to the hotel system. Active shifts and assigned tasks will be unassigned.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 uppercase text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white font-bold uppercase tracking-wider rounded-[2px] cursor-pointer"
              >
                {isSubmitting ? 'Deleting...' : 'Delete Staff Member'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
