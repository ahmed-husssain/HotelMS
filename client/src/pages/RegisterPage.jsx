import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import { useAuth } from '../context/AuthContext'

/**
 * GUEST REGISTRATION PAGE (/register)
 * 
 * - Desktop: Architectural split-card with local hero imagery
 * - Mobile: Clean responsive layout with zero cut-off elements
 * - Provisions strict role: 'guest' in compliance with Aptech Module 1 & 7
 * - Pure theme monochrome (zero yellowish accents)
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

  const handleSubmit = async (e) => {
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
      setErrorMsg('Please review and accept the Terms and Privacy Policy.')
      return
    }

    setIsSubmitting(true)

    try {
      await registerGuest({ name, email, password, phone })
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
    <div className="min-h-screen min-h-dvh bg-[#0E1201] text-slate-800 p-3 sm:p-5 md:p-8 flex flex-col justify-center selection:bg-slate-700 selection:text-white">
      
      {/* Top Desktop Brand Bar */}
      <header className="max-w-5xl w-full mx-auto mb-3 sm:mb-4 flex items-center justify-between">
        <Link to="/" className="inline-block">
          <BrandLogo variant="full" theme="light" size="sm" />
        </Link>
        <Link
          to="/"
          className="font-mono text-xs text-slate-400 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1.5"
        >
          <span>&larr;</span> Back to Home
        </Link>
      </header>

      {/* Main Luxury Split Card */}
      <main className="w-full max-w-5xl mx-auto bg-[#FAF8F5] sm:border sm:border-slate-300/80 sm:shadow-2xl sm:rounded-[3px] overflow-hidden flex flex-col md:grid md:grid-cols-12">
        
        {/* 1. MOBILE TOP APERTURE (< md) */}
        <div className="md:hidden relative w-full h-[140px] shrink-0 overflow-hidden bg-[#0E1201]">
          <img
            src="/assets/hero-drone-poster.webp"
            alt="Stayza Architecture"
            className="w-full h-full object-cover filter brightness-[0.6] contrast-[1.08]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-transparent to-black/50" />

          {/* Integrated Mobile Brand Header */}
          <div className="absolute top-3.5 inset-x-0 px-5 flex items-center justify-between text-white z-20">
            <Link to="/" className="flex items-center gap-1.5">
              <span className="font-serif-grand text-base font-bold tracking-[0.25em] text-[#FAF8F5]">STAYZA</span>
            </Link>
            <Link
              to="/"
              className="font-mono text-[9px] uppercase tracking-wider flex items-center gap-1 text-white/90 hover:text-white bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/15"
            >
              <span>&larr;</span> Home
            </Link>
          </div>
        </div>

        {/* 2. DESKTOP LEFT 5 COLUMNS — Local Photographic Stage */}
        <aside className="hidden md:flex md:col-span-5 bg-[#0E1201] text-[#FAF8F5] relative overflow-hidden flex-col justify-between p-8 lg:p-10 border-r border-slate-800 shrink-0">
          <img
            src="/assets/hero-drone-poster.webp"
            alt="Stayza Architecture"
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.5] contrast-[1.08] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E1201] via-[#0E1201]/40 to-transparent" />

          <div className="relative z-10">
            <span className="font-serif-grand text-2xl font-extrabold tracking-[0.24em] text-[#FAF8F5] block">
              STAYZA
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#A8A29E] block mt-1">
              Sindh Coast &bull; Pakistan
            </span>
          </div>

          <div className="relative z-10 text-[10px] font-mono text-[#A8A29E] tracking-wider">
            Private Suites &bull; Coastal Sanctuary
          </div>
        </aside>

        {/* 3. RIGHT FORM PANEL — Clean Minimalist Registration Form */}
        <section className="md:col-span-7 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center bg-[#FAF8F5] space-y-4">
          
          <div>
            <h1 className="font-serif-grand text-3xl sm:text-4xl text-slate-900 font-bold tracking-tight">
              Create Account
            </h1>
            <p className="text-xs text-slate-500 font-mono mt-1">
              Join Stayza to manage your reservations and hotel services
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-900 text-xs font-mono rounded-[2px]">
              {errorMsg}
            </div>
          )}

          {/* The Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            
            {/* Full Name */}
            <div>
              <label
                htmlFor="reg-name"
                className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold block mb-1"
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
                className="w-full py-2 px-3 bg-white border border-slate-300 focus:border-slate-900 rounded-[2px] text-xs sm:text-sm font-medium text-slate-900 focus:outline-none transition-colors"
              />
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="reg-email"
                  className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold block mb-1"
                >
                  Email Address
                </label>
                <input
                  id="reg-email"
                  type="email"
                  required
                  placeholder="tariq@stayza.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-2 px-3 bg-white border border-slate-300 focus:border-slate-900 rounded-[2px] text-xs sm:text-sm text-slate-900 focus:outline-none transition-colors font-mono"
                />
              </div>

              <div>
                <label
                  htmlFor="reg-phone"
                  className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold block mb-1"
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
                  className="w-full py-2 px-3 bg-white border border-slate-300 focus:border-slate-900 rounded-[2px] text-xs sm:text-sm text-slate-900 focus:outline-none transition-colors font-mono"
                />
              </div>
            </div>

            {/* Passcode & Confirm Passcode Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="reg-pass"
                  className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold block mb-1"
                >
                  Password
                </label>
                <input
                  id="reg-pass"
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-2 px-3 bg-white border border-slate-300 focus:border-slate-900 rounded-[2px] text-xs sm:text-sm text-slate-900 focus:outline-none transition-colors font-mono"
                />
              </div>

              <div>
                <label
                  htmlFor="reg-confirm"
                  className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold block mb-1"
                >
                  Confirm Password
                </label>
                <input
                  id="reg-confirm"
                  type="password"
                  required
                  placeholder="Re-type password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full py-2 px-3 bg-white border border-slate-300 focus:border-slate-900 rounded-[2px] text-xs sm:text-sm text-slate-900 focus:outline-none transition-colors font-mono"
                />
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-2 pt-1">
              <input
                id="reg-terms"
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 accent-slate-950 cursor-pointer"
              />
              <label htmlFor="reg-terms" className="text-[10px] sm:text-xs text-slate-600 cursor-pointer select-none leading-tight">
                I agree to the Terms of Service and Privacy Policy.
              </label>
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full py-3.5 bg-slate-900 hover:bg-[#0E1201] text-[#FAF8F5] font-mono text-xs font-bold uppercase tracking-[0.2em] rounded-[2px] transition-all cursor-pointer shadow-md hover:shadow-xl active:scale-[0.98] mt-2 flex items-center justify-center gap-2 disabled:opacity-50 min-h-[44px]"
            >
              <span>{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
              <span className="text-xs">&rarr;</span>
            </button>
          </form>

          {/* Switch to Sign In */}
          <div className="pt-3 border-t border-slate-200/80 text-center">
            <p className="text-xs text-slate-600 font-normal">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-slate-900 font-bold underline hover:text-stone-700 cursor-pointer ml-1"
              >
                Sign In &rarr;
              </Link>
            </p>
          </div>

        </section>

      </main>

    </div>
  )
}
