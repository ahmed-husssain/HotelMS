import React from 'react'
import { Link } from 'react-router-dom'

export default function GuestInfoForm({ guestDossier, setGuestDossier, currentUser }) {
  const handleChange = (field, value) => {
    setGuestDossier((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
        <span className="text-xs font-mono font-bold tracking-[0.2em] text-slate-900 uppercase">
          02 &bull; Guest Information
        </span>
        {currentUser ? (
          <span className="text-[10px] font-mono text-emerald-800 uppercase font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Express Check-in &bull; {currentUser.name}
          </span>
        ) : (
          <Link
            to="/login?redirect=/reserve"
            className="text-[10px] font-mono text-slate-500 hover:text-slate-900 uppercase underline transition-colors"
          >
            Sign In for 1-Click Dossier &rarr;
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="text-[10px] font-mono tracking-wider font-semibold text-slate-400 uppercase block mb-1">
            Full Legal Name
          </label>
          <input
            type="text"
            required
            value={guestDossier.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="Ahmed Khan"
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-[2px] focus:border-slate-900 focus:ring-1 focus:ring-slate-900 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none transition-all placeholder:text-slate-400 min-h-[42px]"
          />
        </div>

        <div>
          <label className="text-[10px] font-mono tracking-wider font-semibold text-slate-400 uppercase block mb-1">
            CNIC / Passport ID
          </label>
          <input
            type="text"
            required
            value={guestDossier.identificationNumber}
            onChange={(e) => handleChange('identificationNumber', e.target.value)}
            placeholder="42101-9876543-1"
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-[2px] focus:border-slate-900 focus:ring-1 focus:ring-slate-900 text-xs sm:text-sm font-mono text-slate-900 focus:outline-none transition-all placeholder:text-slate-400 min-h-[42px]"
          />
        </div>

        <div>
          <label className="text-[10px] font-mono tracking-wider font-semibold text-slate-400 uppercase block mb-1">
            Contact Email
          </label>
          <input
            type="email"
            required
            value={guestDossier.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="ahmed@example.com"
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-[2px] focus:border-slate-900 focus:ring-1 focus:ring-slate-900 text-xs sm:text-sm text-slate-900 focus:outline-none transition-all placeholder:text-slate-400 min-h-[42px]"
          />
        </div>

        <div>
          <label className="text-[10px] font-mono tracking-wider font-semibold text-slate-400 uppercase block mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            required
            value={guestDossier.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+92 300 1234567"
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-[2px] focus:border-slate-900 focus:ring-1 focus:ring-slate-900 text-xs sm:text-sm font-mono text-slate-900 focus:outline-none transition-all placeholder:text-slate-400 min-h-[42px]"
          />
        </div>
      </div>
    </section>
  )
}
