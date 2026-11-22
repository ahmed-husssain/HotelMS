import React from 'react'
import { Link } from 'react-router-dom'

export default function GuestInfoForm({
  guestDossier,
  setGuestDossier,
  currentUser,
  errors = {},
  touched = {},
  setTouched = () => {},
}) {
  // Format CNIC as XXXXX-XXXXXXX-X (digits only, max 13 digits)
  const handleCNICChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 13)
    let formatted = raw
    if (raw.length > 5 && raw.length <= 12) {
      formatted = `${raw.slice(0, 5)}-${raw.slice(5)}`
    } else if (raw.length > 12) {
      formatted = `${raw.slice(0, 5)}-${raw.slice(5, 12)}-${raw.slice(12, 13)}`
    }
    setGuestDossier((prev) => ({ ...prev, identificationNumber: formatted }))
  }

  // Phone: Digits, spaces, and optional leading + only (max 16 chars)
  const handlePhoneChange = (e) => {
    let raw = e.target.value.replace(/[^\d+\s-]/g, '').slice(0, 16)
    if (raw.includes('+')) {
      raw = '+' + raw.replace(/\+/g, '')
    }
    setGuestDossier((prev) => ({ ...prev, phone: raw }))
  }

  // Name: Letters, spaces, apostrophes, and hyphens only
  const handleNameChange = (e) => {
    const clean = e.target.value.replace(/[^a-zA-Z\s'-]/g, '').slice(0, 60)
    setGuestDossier((prev) => ({ ...prev, fullName: clean }))
  }

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  return (
    <section className="bg-white border border-slate-200/90 rounded-xl p-5 sm:p-7 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-[#0F172A] text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
            2
          </span>
          <h2 className="font-syne font-bold text-base sm:text-lg text-slate-900 tracking-tight">
            Guest Information
          </h2>
        </div>

        {currentUser ? (
          <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Verified &bull; {currentUser.name}
          </span>
        ) : (
          <Link
            to="/login?redirect=/reserve"
            className="text-[11px] font-mono text-slate-500 hover:text-slate-900 underline transition-colors"
          >
            Sign in to auto-fill &rarr;
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {/* 1. Full Legal Name */}
        <div>
          <label className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-semibold block mb-1.5">
            Full Legal Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={guestDossier.fullName}
            onChange={handleNameChange}
            onBlur={() => handleBlur('fullName')}
            placeholder="e.g. Ahmed Khan"
            className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-lg text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400 touch-target ${
              touched.fullName && errors.fullName
                ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/20'
                : 'border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900'
            }`}
          />
          {touched.fullName && errors.fullName && (
            <p className="text-[11px] font-mono text-rose-600 mt-1 flex items-center gap-1">
              <span>&bull;</span> {errors.fullName}
            </p>
          )}
        </div>

        {/* 2. CNIC / National ID */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-semibold block">
              CNIC / National ID <span className="text-rose-500">*</span>
            </label>
            <span className="text-[10px] font-mono text-slate-400">
              {(guestDossier.identificationNumber || '').replace(/\D/g, '').length}/13
            </span>
          </div>
          <input
            type="text"
            required
            value={guestDossier.identificationNumber}
            onChange={handleCNICChange}
            onBlur={() => handleBlur('identificationNumber')}
            placeholder="42101-1234567-1"
            className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-lg text-xs sm:text-sm font-mono text-slate-900 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400 touch-target ${
              touched.identificationNumber && errors.identificationNumber
                ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/20'
                : 'border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900'
            }`}
          />
          {touched.identificationNumber && errors.identificationNumber && (
            <p className="text-[11px] font-mono text-rose-600 mt-1 flex items-center gap-1">
              <span>&bull;</span> {errors.identificationNumber}
            </p>
          )}
        </div>

        {/* 3. Email */}
        <div>
          <label className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-semibold block mb-1.5">
            Email Address (For PDF Invoices) <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            required
            value={guestDossier.email}
            onChange={(e) => setGuestDossier((prev) => ({ ...prev, email: e.target.value }))}
            onBlur={() => handleBlur('email')}
            placeholder="name@example.com"
            className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-lg text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400 touch-target ${
              touched.email && errors.email
                ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/20'
                : 'border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900'
            }`}
          />
          {touched.email && errors.email && (
            <p className="text-[11px] font-mono text-rose-600 mt-1 flex items-center gap-1">
              <span>&bull;</span> {errors.email}
            </p>
          )}
        </div>

        {/* 4. Phone Number */}
        <div>
          <label className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-semibold block mb-1.5">
            Mobile Number <span className="text-rose-500">*</span>
          </label>
          <input
            type="tel"
            required
            value={guestDossier.phone}
            onChange={handlePhoneChange}
            onBlur={() => handleBlur('phone')}
            placeholder="+92 300 1234567"
            className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-lg text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400 touch-target ${
              touched.phone && errors.phone
                ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/20'
                : 'border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900'
            }`}
          />
          {touched.phone && errors.phone && (
            <p className="text-[11px] font-mono text-rose-600 mt-1 flex items-center gap-1">
              <span>&bull;</span> {errors.phone}
            </p>
          )}
        </div>

        {/* 5. Optional Account Password for Auto-Registration */}
        {!currentUser && (
          <div className="sm:col-span-2 p-3 bg-slate-50 border border-slate-200/80 rounded-lg space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono text-slate-700 uppercase tracking-wider font-semibold block">
                Create Account Password (Optional)
              </label>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                Instant Auto-Login
              </span>
            </div>
            <input
              type="password"
              value={guestDossier.password || ''}
              onChange={(e) => setGuestDossier((prev) => ({ ...prev, password: e.target.value }))}
              placeholder="Min. 6 characters (for digital key & in-suite controls)"
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-md text-xs sm:text-sm font-medium text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none transition-all placeholder:text-slate-400"
            />
            <p className="text-[10px] text-slate-500 font-mono">
              Save your profile to access your digital room key, view invoices, and control suite climate anytime.
            </p>
          </div>
        )}
      </div>

      {/* Special Requests */}
      <div>
        <label className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-semibold block mb-1.5">
          Special Requests &amp; Arrival Time (Optional)
        </label>
        <textarea
          rows={2}
          value={guestDossier.specialRequests}
          onChange={(e) => setGuestDossier((prev) => ({ ...prev, specialRequests: e.target.value }))}
          placeholder="e.g. Quiet upper floor, feather pillows, estimated arrival time 15:00"
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none transition-all placeholder:text-slate-400 resize-none"
        />
      </div>
    </section>
  )
}
