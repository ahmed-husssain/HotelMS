import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import { useAuth } from '../context/AuthContext'

/**
 * UNIFIED LOGIN PAGE (/login) — MINIMAL LUXURY ARCHITECTURE
 * 
 * - Aman x Bulgari Editorial Aesthetic: Clean Alabaster Canvas with Obsidian accents
 * - 100% Zero-Clutter: No developer quick-fill buttons or prototype badges
 * - Automatic Server Role Detection (Guest, Receptionist, Housekeeping, Admin)
 */
export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectUrl = searchParams.get('redirect')
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setIsSubmitting(true)

    try {
      const user = await login(email, password)
      
      const roleDestinations = {
        guest: { path: '/my-stay', label: 'Guest Portal & Key' },
        receptionist: { path: '/pms', label: 'Front Desk PMS Terminal' },
        housekeeping: { path: '/housekeeping', label: 'Housekeeping & Maintenance' },
        admin: { path: '/admin', label: 'General Manager Console' },
      }

      const target = roleDestinations[user.role] || roleDestinations.guest
      setSuccessMsg(`Welcome, ${user.name}. Redirecting...`)

      setTimeout(() => {
        if (redirectUrl && (user.role === 'guest' || redirectUrl === '/reserve')) {
          navigate(redirectUrl)
        } else {
          navigate(target.path)
        }
      }, 500)
    } catch (err) {
      setErrorMsg(err.message || 'Invalid credentials. Please verify your email and password.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen min-h-dvh overflow-y-auto bg-[#0E1201] text-slate-800 p-0 sm:p-4 md:p-6 lg:p-8 flex flex-col justify-between selection:bg-[#D4AF37] selection:text-slate-900">
      
      {/* Top Desktop Brand Bar */}
      <header className="hidden md:flex max-w-5xl w-full mx-auto mb-3 shrink-0 items-center justify-between">
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
      <main className="flex-1 min-h-0 w-full max-w-5xl mx-auto bg-[#FAF8F5] sm:border sm:border-slate-300/80 sm:shadow-2xl sm:rounded-[3px] overflow-hidden flex flex-col md:grid md:grid-cols-12 my-auto">
        
        {/* 1. MOBILE TOP APERTURE */}
        <div className="md:hidden relative w-full h-[180px] shrink-0 overflow-hidden bg-slate-900">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=85"
            alt="Stayza Architecture"
            className="w-full h-full object-cover filter brightness-[0.72] contrast-[1.08]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-transparent to-black/50" />

          {/* Integrated Mobile Brand Header */}
          <div className="absolute top-3.5 inset-x-0 px-5 flex items-center justify-between text-white z-20">
            <Link to="/" className="flex items-center gap-1.5">
              <span className="font-serif-grand text-base font-light tracking-[0.25em] text-[#FFF0CA]">STAYZA</span>
            </Link>
            <Link
              to="/"
              className="font-mono text-[9px] uppercase tracking-wider flex items-center gap-1 text-white/90 hover:text-white bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/15"
            >
              <span>&larr;</span> Home
            </Link>
          </div>
        </div>

        {/* 2. DESKTOP LEFT 5 COLUMNS — Quiet Photography Stage */}
        <aside className="hidden md:flex md:col-span-5 bg-[#0E1201] text-[#FAF8F5] relative overflow-hidden flex-col justify-between p-8 lg:p-10 border-r border-slate-800 shrink-0">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85"
            alt="Stayza Architecture"
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.55] contrast-[1.08] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E1201] via-[#0E1201]/30 to-transparent" />

          <div className="relative z-10">
            <span className="font-serif-grand text-2xl font-light tracking-[0.2em] text-[#FFF0CA] block">
              STAYZA
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-300 block mt-1">
              Sindh Coast &bull; Pakistan
            </span>
          </div>

          <div className="relative z-10 text-[10px] font-mono text-slate-400 tracking-wider">
            Private Suites &bull; Coastal Sanctuary
          </div>
        </aside>

        {/* 3. RIGHT FORM PANEL — Clean Minimalist Threshold */}
        <section className="flex-1 min-h-0 md:col-span-7 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center bg-[#FAF8F5] overflow-y-auto space-y-6">
          
          <div>
            <h1 className="font-serif-grand text-3xl sm:text-4xl text-slate-900 font-light tracking-tight">
              Sign In
            </h1>
            <p className="text-xs text-slate-500 font-mono mt-1.5">
              Access your reservations and hotel services
            </p>
          </div>

          {/* Feedback Banners */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-900 text-xs font-mono rounded-[2px]">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-mono rounded-[2px] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Clean Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Address */}
            <div>
              <label
                htmlFor="login-email"
                className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold block mb-1"
              >
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-2.5 px-3 bg-white border border-slate-300 focus:border-slate-900 rounded-[2px] text-xs sm:text-sm font-medium text-slate-900 focus:outline-none transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="login-pass"
                className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold block mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="login-pass"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-2.5 px-3 bg-white border border-slate-300 focus:border-slate-900 rounded-[2px] text-xs sm:text-sm text-slate-900 focus:outline-none transition-colors pr-10 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800 text-xs cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? '🔒' : '👁'}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full py-3.5 bg-slate-900 hover:bg-[#0E1201] text-[#FFF0CA] font-mono text-xs font-bold uppercase tracking-[0.2em] rounded-[2px] transition-all cursor-pointer shadow-md hover:shadow-xl active:scale-[0.98] mt-2 flex items-center justify-center gap-2 disabled:opacity-50 min-h-[44px]"
            >
              <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
              <span className="text-xs">&rarr;</span>
            </button>
          </form>

          {/* Switch to Register */}
          <div className="pt-4 border-t border-slate-200/80 text-center">
            <p className="text-xs text-slate-600 font-normal">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-slate-900 font-bold underline hover:text-amber-900 cursor-pointer ml-1"
              >
                Create Guest Account &rarr;
              </Link>
            </p>
          </div>

        </section>

      </main>

      {/* Desktop Footer */}
      <footer className="hidden md:block max-w-5xl w-full mx-auto mt-3 text-center font-mono text-[9px] text-slate-500 shrink-0">
        &copy; {new Date().getFullYear()} Stayza Hotel &bull; All rights reserved.
      </footer>

    </div>
  )
}
