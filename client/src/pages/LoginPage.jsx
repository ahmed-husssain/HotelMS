import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import { useAuth } from '../context/AuthContext'

/**
 * UNIFIED SIGN IN PAGE (/login)
 * 
 * - Desktop: Architectural split-card with local hero imagery
 * - Mobile: Clean responsive layout with zero cut-off elements
 * - 1-Click quick role testing for Admin (GM), Receptionist, Housekeeping, Guest
 * - Pure theme monochrome (no yellowish accents)
 */
export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectUrl = searchParams.get('redirect')
  const { login } = useAuth()

  const [email, setEmail] = useState('admin@stayza.com')
  const [password, setPassword] = useState('Password123!')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 1-Click Role Quick Fill for testing
  const handleQuickFill = (roleEmail) => {
    setEmail(roleEmail)
    setPassword('Password123!')
    setErrorMsg('')
    setSuccessMsg('')
  }

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
      setSuccessMsg(`Welcome, ${user.name}. Identified as ${user.roleLabel}. Redirecting...`)

      setTimeout(() => {
        if (redirectUrl) {
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
            alt="Stayza Sanctuary"
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

        {/* 3. RIGHT FORM PANEL — Clean Minimalist Threshold */}
        <section className="md:col-span-7 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center bg-[#FAF8F5] space-y-5">
          
          <div>
            <h1 className="font-serif-grand text-3xl sm:text-4xl text-slate-900 font-bold tracking-tight">
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
              className="group relative w-full py-3.5 bg-slate-900 hover:bg-[#0E1201] text-[#FAF8F5] font-mono text-xs font-bold uppercase tracking-[0.2em] rounded-[2px] transition-all cursor-pointer shadow-md hover:shadow-xl active:scale-[0.98] mt-1 flex items-center justify-center gap-2 disabled:opacity-50 min-h-[44px]"
            >
              <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
              <span className="text-xs">&rarr;</span>
            </button>
          </form>

          {/* Quick 1-Click Role Testing Badges */}
          <div className="pt-2 border-t border-slate-200/80 text-center font-mono">
            <span className="text-[10px] text-slate-400 block mb-1.5 uppercase tracking-widest font-bold">
              1-Click Panel Quick Fill:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickFill('admin@stayza.com')}
                className={`px-2.5 py-1 rounded-[2px] transition-all cursor-pointer font-bold ${
                  email === 'admin@stayza.com'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                Admin (GM)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('reception@stayza.com')}
                className={`px-2.5 py-1 rounded-[2px] transition-all cursor-pointer font-bold ${
                  email === 'reception@stayza.com'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                Reception
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('cleaning@stayza.com')}
                className={`px-2.5 py-1 rounded-[2px] transition-all cursor-pointer font-bold ${
                  email === 'cleaning@stayza.com'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                Housekeeping
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('guest@stayza.com')}
                className={`px-2.5 py-1 rounded-[2px] transition-all cursor-pointer font-bold ${
                  email === 'guest@stayza.com'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                Guest
              </button>
            </div>
          </div>

          {/* Switch to Register (Kept as requested) */}
          <div className="text-center pt-1">
            <p className="text-xs text-slate-600 font-normal">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-slate-900 font-bold underline hover:text-stone-700 cursor-pointer ml-1"
              >
                Create Guest Account &rarr;
              </Link>
            </p>
          </div>

        </section>

      </main>

    </div>
  )
}
