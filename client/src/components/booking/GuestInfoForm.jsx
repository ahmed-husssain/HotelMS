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
    // Prevent multiple plus signs
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
    <section className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
        <span className="text-xs sm:text-sm font-mono font-bold tracking-[0.15em] text-slate-900 uppercase">
          2. Guest Details
        </span>
        {currentUser ? (
          <span className="text-[10px] font-mono text-emerald-800 uppercase font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Verified Profile &bull; {currentUser.name}
          </span>
        ) : (
          <Link
            to="/login?redirect=/reserve"
            className="text-[10px] font-mono text-slate-500 hover:text-slate-900 uppercase underline transition-colors"
          >
            Sign in to auto-fill details &rarr;
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* 1. Full Legal Name */}
        <div>
          <label className="text-[10px] font-mono tracking-wider font-semibold text-slate-500 uppercase block mb-1">
            Full Legal Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={guestDossier.fullName}
            onChange={handleNameChange}
            onBlur={() => handleBlur('fullName')}
            placeholder="e.g. Ahmed Khan"
            className={`w-full px-3.5 py-2.5 bg-white border rounded-[2px] text-xs sm:text-sm font-medium text-slate-900 focus:outline-none transition-all placeholder:text-slate-400 min-h-[44px] ${
              touched.fullName && errors.fullName
                ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/20'
                : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900'
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
          <div className="flex items-center justify-between mb-1">
            <label className="text-[10px] font-mono tracking-wider font-semibold text-slate-500 uppercase block">
              CNIC / National ID (13 Digits) <span className="text-rose-500">*</span>
            </label>
            <span className="text-[10px] font-mono text-slate-400">
              {(guestDossier.identificationNumber || '').replace(/\D/g, '').length}/13
            </span>
          </div>
          <input
            type="text"
            required
            inputMode="numeric"
            value={guestDossier.identificationNumber}
            onChange={handleCNICChange}
            onBlur={() => handleBlur('identificationNumber')}
            placeholder="42101-1234567-1"
            maxLength={15}
            className={`w-full px-3.5 py-2.5 bg-white border rounded-[2px] text-xs sm:text-sm font-mono text-slate-900 focus:outline-none transition-all placeholder:text-slate-400 min-h-[44px] tracking-wider ${
              touched.identificationNumber && errors.identificationNumber
                ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/20'
                : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900'
            }`}
          />
          {touched.identificationNumber && errors.identificationNumber && (
            <p className="text-[11px] font-mono text-rose-600 mt-1 flex items-center gap-1">
              <span>&bull;</span> {errors.identificationNumber}
            </p>
          )}
        </div>

        {/* 3. Contact Email */}
        <div>
          <label className="text-[10px] font-mono tracking-wider font-semibold text-slate-500 uppercase block mb-1">
            Contact Email <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            required
            value={guestDossier.email}
            onChange={(e) => setGuestDossier((prev) => ({ ...prev, email: e.target.value.trim() }))}
            onBlur={() => handleBlur('email')}
            placeholder="ahmed.khan@example.com"
            className={`w-full px-3.5 py-2.5 bg-white border rounded-[2px] text-xs sm:text-sm text-slate-900 focus:outline-none transition-all placeholder:text-slate-400 min-h-[44px] ${
              touched.email && errors.email
                ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/20'
                : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900'
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
          <label className="text-[10px] font-mono tracking-wider font-semibold text-slate-500 uppercase block mb-1">
            Mobile Phone <span className="text-rose-500">*</span>
          </label>
          <input
            type="tel"
            required
            inputMode="tel"
            value={guestDossier.phone}
            onChange={handlePhoneChange}
            onBlur={() => handleBlur('phone')}
            placeholder="+92 300 1234567"
            maxLength={16}
            className={`w-full px-3.5 py-2.5 bg-white border rounded-[2px] text-xs sm:text-sm font-mono text-slate-900 focus:outline-none transition-all placeholder:text-slate-400 min-h-[44px] ${
              touched.phone && errors.phone
                ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/20'
                : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900'
            }`}
          />
          {touched.phone && errors.phone && (
            <p className="text-[11px] font-mono text-rose-600 mt-1 flex items-center gap-1">
              <span>&bull;</span> {errors.phone}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
