import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import { useAuth } from '../context/AuthContext'

/**
 * GUEST REGISTRATION PAGE (/register)
 * 
 * Fulfills Aptech Module 1 (User Management) & Module 7 (Security):
 * - Clean self-registration strictly provisions role: 'guest'
 * - Prevents unauthorized self-assignment of staff or administrative roles
 * - Automatically logs the guest in and redirects to their stay portal.
 */
export default function RegisterPage() {
  const navigate = useNavigate()
  const { registerGuest } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (password !== confirmPassword) {
      setErrorMsg('Passcodes do not match. Please verify and re-enter.')
      return
    }

    if (password.length < 6) {
      setErrorMsg('Passcode must be at least 6 characters in length.')
      return
    }

    if (!agreeTerms) {
      setErrorMsg('Please review and accept the Sanctuary Reservation Terms.')
      return
    }

    setIsSubmitting(true)

    try {
      registerGuest({ name, email, phone })
      // Smooth redirect to guest portal
      setTimeout(() => {
        navigate('/my-stay')
      }, 500)
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create guest profile.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0E1201] text-slate-800 p-3 sm:p-6 lg:p-10 flex flex-col justify-between selection:bg-[#D4AF37] selection:text-slate-900">
      
      {/* Top Brand Bar */}
      <header className="max-w-6xl w-full mx-auto mb-4 flex items-center justify-between">
        <Link to="/" className="inline-block">
          <BrandLogo variant="full" theme="light" size="sm" />
        </Link>
        <Link
          to="/"
          className="font-mono text-xs text-slate-400 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1.5"
        >
          <span>&larr;</span> Return to Sanctuary
        </Link>
      </header>

      {/* Main Luxury Split Card */}
      <main className="max-w-6xl w-full mx-auto bg-[#FAF8F5] border border-slate-300 shadow-2xl rounded-[2px] overflow-hidden my-auto grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* Left 5 Columns: Photography & Philosophy */}
        <aside className="lg:col-span-5 bg-[#0E1201] text-[#FAF8F5] relative overflow-hidden flex flex-col justify-between p-8 sm:p-12 border-b lg:border-b-0 lg:border-r border-slate-800">
          <img
            src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=85"
            alt="Habitas Luxury Guest Experience"
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.45] contrast-[1.1] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E1201] via-[#0E1201]/40 to-transparent" />

          <div className="relative z-10">
            <span className="font-serif-grand text-2xl font-light tracking-[0.2em] text-[#FFF0CA] block">
              HABITAS
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-slate-400 block mt-1">
              Sindh Coast &bull; Pakistan
            </span>
          </div>

          <div className="relative z-10 my-8">
            <span className="font-mono text-[10px] tracking-[0.25em] text-[#D4AF37] uppercase font-semibold block mb-2">
              // Guest Privilege Dossier
            </span>
            <p className="font-serif italic text-lg sm:text-xl text-slate-200 leading-relaxed font-light">
              "Your personalized key to cliffside residences, subterranean valet, and coastal wellness."
            </p>
          </div>

          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>GUEST VERIFICATION PORTAL</span>
            <span>EST. 2026</span>
          </div>
        </aside>

        {/* Right 7 Columns: Registration Form */}
        <section className="lg:col-span-7 p-6 sm:p-10 lg:p-14 flex flex-col justify-between bg-[#FAF8F5] overflow-y-auto">
          <div className="space-y-5">
            
            {/* Header */}
            <div>
              <span className="text-[10px] font-mono tracking-[0.28em] text-slate-500 uppercase font-semibold">
                // GUEST ONBOARDING
              </span>
              <h1 className="font-serif-grand text-3xl sm:text-4xl text-slate-900 font-light mt-1">
                Register as a Guest
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-normal">
                Create your verified guest profile to manage active stays, access your digital NFC key pass, and order bespoke estate dining.
              </p>
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-900 text-xs font-mono rounded-[2px]">
                {errorMsg}
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-1">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="reg-name"
                  className="text-[10px] font-mono uppercase tracking-wider text-slate-600 font-bold block mb-1"
                >
                  Full Legal Name
                </label>
                <input
                  id="reg-name"
                  type="text"
                  required
                  placeholder="e.g. Tariq Khan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full py-2 px-0 bg-transparent border-b border-slate-300 focus:border-slate-900 text-sm font-medium text-slate-900 focus:outline-none transition-colors"
                />
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="reg-email"
                    className="text-[10px] font-mono uppercase tracking-wider text-slate-600 font-bold block mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    placeholder="tariq@luxury.pk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-2 px-0 bg-transparent border-b border-slate-300 focus:border-slate-900 text-sm font-medium text-slate-900 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="reg-phone"
                    className="text-[10px] font-mono uppercase tracking-wider text-slate-600 font-bold block mb-1"
                  >
                    Contact Phone
                  </label>
                  <input
                    id="reg-phone"
                    type="tel"
                    required
                    placeholder="+92 300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full py-2 px-0 bg-transparent border-b border-slate-300 focus:border-slate-900 text-sm font-medium text-slate-900 focus:outline-none transition-colors font-mono"
                  />
                </div>
              </div>

              {/* Passcode & Confirm Passcode Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="reg-pass"
                    className="text-[10px] font-mono uppercase tracking-wider text-slate-600 font-bold block mb-1"
                  >
                    Create Passcode
                  </label>
                  <input
                    id="reg-pass"
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full py-2 px-0 bg-transparent border-b border-slate-300 focus:border-slate-900 text-sm text-slate-900 focus:outline-none transition-colors font-mono"
                  />
                </div>

                <div>
                  <label
                    htmlFor="reg-confirm"
                    className="text-[10px] font-mono uppercase tracking-wider text-slate-600 font-bold block mb-1"
                  >
                    Confirm Passcode
                  </label>
                  <input
                    id="reg-confirm"
                    type="password"
                    required
                    placeholder="Re-type passcode"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full py-2 px-0 bg-transparent border-b border-slate-300 focus:border-slate-900 text-sm text-slate-900 focus:outline-none transition-colors font-mono"
                  />
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start gap-2.5 pt-2">
                <input
                  id="reg-terms"
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 accent-[#0E1201] cursor-pointer"
                />
                <label htmlFor="reg-terms" className="text-xs text-slate-600 cursor-pointer select-none">
                  I agree to the Habitas Sanctuary Reservation Terms, Privacy Policy, and Subterranean Valet protocols.
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] font-mono text-xs font-bold uppercase tracking-[0.2em] rounded-[2px] transition-all cursor-pointer shadow-md active:scale-[0.98] mt-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Creating Profile...' : 'Create Verified Guest Account →'}
              </button>
            </form>

            {/* Security Notice */}
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-[2px] text-[11px] font-mono text-amber-900 flex items-start gap-2">
              <span className="text-amber-700">🔒</span>
              <p>
                <strong>Security Protocol:</strong> Public registrations strictly provision <code>role: 'guest'</code>. Hotel staff accounts (Front Desk, Housekeeping, Manager) are provisioned exclusively through the General Manager's Console.
              </p>
            </div>

            {/* Link to Login */}
            <div className="pt-1 text-center">
              <p className="text-xs text-slate-600 font-normal">
                Already registered?{' '}
                <Link
                  to="/login"
                  className="text-[#0E1201] font-bold underline hover:text-amber-900 cursor-pointer ml-1"
                >
                  Sign In to Sanctuary &rarr;
                </Link>
              </p>
            </div>

          </div>

          {/* Footer note */}
          <div className="pt-4 border-t border-slate-200/60 text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>STRICT GUEST RBAC</span>
            <span>DATA ENCRYPTION ENABLED</span>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto mt-4 text-center font-mono text-[10px] text-slate-500">
        &copy; 2026 Habitas Sanctuary Residences &bull; Aptech MERN eProject
      </footer>

    </div>
  )
}
