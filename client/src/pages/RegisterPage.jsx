import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import { useAuth } from '../context/AuthContext'

/**
 * GUEST REGISTRATION PAGE (/register) — ZERO-SCROLL RESPONSIVE ARCHITECTURE
 * 
 * - Mobile: Aman x Bulgari Editorial Split (Top 32% Suite Aperture + Bottom 68% Alabaster Canvas)
 * - Tablet & Desktop: Centered luxury split-screen card locked within 100dvh
 * - 100% Zero-Scroll across every screen dimension (Mobile, Tablet, Laptop, Monitor)
 * - Provisions strict role: 'guest' in compliance with Aptech Module 1 & 7
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
    <div className="h-screen h-dvh max-h-dvh overflow-hidden bg-[#0E1201] text-slate-800 p-0 sm:p-3 md:p-5 lg:p-7 flex flex-col justify-between selection:bg-[#D4AF37] selection:text-slate-900">
      
      {/* Top Desktop Brand Bar (Hidden on Mobile) */}
      <header className="hidden md:flex max-w-5xl w-full mx-auto mb-2 shrink-0 items-center justify-between">
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

      {/* Main Luxury Split Card (Zero-Scroll Container) */}
      <main className="flex-1 min-h-0 w-full max-w-5xl mx-auto bg-[#FAF8F5] sm:border sm:border-slate-300/80 sm:shadow-2xl sm:rounded-[3px] overflow-hidden flex flex-col md:grid md:grid-cols-12">
        
        {/* 1. MOBILE-ONLY TOP BANNER (< md) */}
        <div className="md:hidden relative w-full h-[215px] sm:h-[235px] shrink-0 overflow-hidden bg-slate-900">
          <img
            src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=85"
            alt="Habitas Luxury Experience"
            className="w-full h-full object-cover filter brightness-[0.72] contrast-[1.08]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-transparent to-black/50" />

          {/* Integrated Mobile Brand Header */}
          <div className="absolute top-3.5 inset-x-0 px-5 flex items-center justify-between text-white z-20">
            <Link to="/" className="flex items-center gap-1.5">
              <span className="font-serif-grand text-base font-light tracking-[0.25em] text-[#FFF0CA]">STAYZA</span>
              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/70 border-l border-white/25 pl-1.5">
                HOTEL
              </span>
            </Link>
            <Link
              to="/"
              className="font-mono text-[9px] uppercase tracking-wider flex items-center gap-1 text-white/90 hover:text-white bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/15"
            >
              <span>&larr;</span> Home
            </Link>
          </div>

          {/* Mobile Threshold Title */}
          <div className="absolute bottom-2.5 inset-x-0 px-5 z-20">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[9px] font-mono tracking-wider text-[#8C6D15] uppercase font-bold">
                Account Registration
              </span>
              <span className="text-[9px] font-mono text-stone-500 uppercase">
                Portal
              </span>
            </div>
            <h1 className="font-serif-grand text-2xl font-light text-slate-900 leading-tight">
              Create an Account.
            </h1>
          </div>
        </div>

        {/* 2. DESKTOP/TABLET LEFT 5 COLUMNS (>= md) */}
        <aside className="hidden md:flex md:col-span-5 bg-[#0E1201] text-[#FAF8F5] relative overflow-hidden flex-col justify-between p-6 sm:p-8 lg:p-10 border-r border-slate-800 shrink-0">
          <img
            src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85"
            alt="Stayza Luxury Experience"
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.45] contrast-[1.1] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E1201] via-[#0E1201]/40 to-transparent" />

          <div className="relative z-10">
            <span className="font-serif-grand text-2xl font-light tracking-[0.2em] text-[#FFF0CA] block">
              STAYZA
            </span>
            <span className="text-[11px] uppercase tracking-wider text-slate-300 block mt-1 font-sans">
              Hotel &amp; Residences
            </span>
          </div>

          <div className="relative z-10 my-auto py-4">
            <p className="font-serif text-base lg:text-lg text-slate-200 leading-relaxed font-light">
              Book your stay, access your digital room key, and manage hotel services.
            </p>
          </div>

          <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-slate-400">
            <span>Guest Registration</span>
            <span>Secure Access</span>
          </div>
        </aside>

        {/* 3. RIGHT FORM PANEL (Aman Alabaster Surface, Zero-Scroll) */}
        <section className="flex-1 min-h-0 md:col-span-7 p-5 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-between bg-[#FAF8F5] overflow-y-auto">
          
          {/* Desktop/Tablet Header (Hidden on Mobile) */}
          <div className="hidden md:block">
            <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase font-semibold">
              Account Registration
            </span>
            <h1 className="font-serif-grand text-2xl lg:text-3xl text-slate-900 font-light mt-1">
              Register as a Guest
            </h1>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed font-normal">
              Create your profile to manage active stays, access your digital key, and request hotel services.
            </p>
          </div>

          {/* Mobile Subtitle (< md) */}
          <p className="md:hidden text-xs text-stone-600 leading-tight">
            Create an account to manage your reservations, digital room keys, and hotel services.
          </p>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-2 sm:p-2.5 bg-red-50 border border-red-200 text-red-900 text-xs font-mono rounded-[2px]">
              {errorMsg}
            </div>
          )}

          {/* The Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3 my-auto py-1">
            
            {/* Full Name */}
            <div>
              <label
                htmlFor="reg-name"
                className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] text-stone-500 font-semibold block mb-0.5"
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
                className="w-full py-1.5 sm:py-2 px-0 bg-transparent border-b border-stone-300 focus:border-slate-900 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none transition-colors"
              />
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <div>
                <label
                  htmlFor="reg-email"
                  className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] text-stone-500 font-semibold block mb-0.5"
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
                  className="w-full py-1.5 sm:py-2 px-0 bg-transparent border-b border-stone-300 focus:border-slate-900 text-xs sm:text-sm text-slate-900 focus:outline-none transition-colors font-mono"
                />
              </div>

              <div>
                <label
                  htmlFor="reg-phone"
                  className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] text-stone-500 font-semibold block mb-0.5"
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
                  className="w-full py-1.5 sm:py-2 px-0 bg-transparent border-b border-stone-300 focus:border-slate-900 text-xs sm:text-sm text-slate-900 focus:outline-none transition-colors font-mono"
                />
              </div>
            </div>

            {/* Passcode & Confirm Passcode Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <div>
                <label
                  htmlFor="reg-pass"
                  className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-semibold block mb-0.5"
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
                  className="w-full py-1.5 sm:py-2 px-0 bg-transparent border-b border-stone-300 focus:border-slate-900 text-xs sm:text-sm text-slate-900 focus:outline-none transition-colors font-mono"
                />
              </div>

              <div>
                <label
                  htmlFor="reg-confirm"
                  className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-semibold block mb-0.5"
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
                  className="w-full py-1.5 sm:py-2 px-0 bg-transparent border-b border-stone-300 focus:border-slate-900 text-xs sm:text-sm text-slate-900 focus:outline-none transition-colors font-mono"
                />
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-2 pt-0.5">
              <input
                id="reg-terms"
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 accent-slate-950 cursor-pointer"
              />
              <label htmlFor="reg-terms" className="text-[10px] sm:text-xs text-stone-600 cursor-pointer select-none leading-tight">
                I agree to the Terms of Service and Privacy Policy.
              </label>
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full py-3 sm:py-3.5 bg-slate-900 hover:bg-[#0E1201] text-[#FFF0CA] font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] rounded-[2px] transition-all cursor-pointer shadow-md hover:shadow-xl active:scale-[0.98] mt-1 overflow-hidden flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
              <span className="text-xs">&rarr;</span>
            </button>
          </form>

          {/* Security Notice & Switch to Login */}
          <div className="pt-2 border-t border-stone-200/80 space-y-1.5">
            <div className="px-2.5 py-1 bg-amber-50/90 border border-amber-200/80 rounded text-[9px] font-mono text-amber-900 flex items-center gap-1.5">
              <span>🔒</span>
              <span className="truncate">Public signup provisions <strong>role: 'guest'</strong>. Staff accounts via GM.</span>
            </div>

            <div className="text-center pt-0.5">
              <p className="text-xs text-stone-600 font-normal">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-slate-900 font-bold underline hover:text-amber-900 cursor-pointer ml-1"
                >
                  Sign In &rarr;
                </Link>
              </p>
            </div>
          </div>

        </section>

      </main>

      {/* Desktop Footer (Hidden on Mobile) */}
      <footer className="hidden md:block max-w-5xl w-full mx-auto mt-2 text-center font-mono text-[9px] text-slate-500 shrink-0">
        &copy; {new Date().getFullYear()} Stayza Hotel &bull; All rights reserved.
      </footer>

    </div>
  )
}
