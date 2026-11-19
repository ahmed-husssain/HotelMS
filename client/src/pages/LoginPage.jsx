import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import { useAuth } from '../context/AuthContext'

/**
 * UNIFIED LOGIN PAGE (/login) — ZERO-SCROLL RESPONSIVE ARCHITECTURE
 * 
 * - Mobile: Aman x Bulgari Editorial Split (Top 32% Coastal Aperture + Bottom 68% Alabaster Canvas)
 * - Tablet & Desktop: High-art centered split-screen card locked within 100dvh
 * - 100% Zero-Scroll across every screen dimension (Mobile, Tablet, Laptop, Monitor)
 * - Zero-Toggle Automatic Role Detection (Guest, Receptionist, Housekeeping, Admin)
 */
export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectUrl = searchParams.get('redirect')
  const { login } = useAuth()

  const [email, setEmail] = useState('tariq@luxury.pk')
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
        if (redirectUrl && (user.role === 'guest' || redirectUrl === '/reserve')) {
          navigate(redirectUrl)
        } else {
          navigate(target.path)
        }
      }, 700)
    } catch (err) {
      setErrorMsg(err.message || 'Invalid credentials. Please verify your email and password.')
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
        
        {/* 1. MOBILE-ONLY TOP APERTURE BANNER (< md: Bulgari Style) */}
        <div className="md:hidden relative w-full h-[215px] sm:h-[235px] shrink-0 overflow-hidden bg-slate-900">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=85"
            alt="Habitas Architecture"
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
                Account Sign In
              </span>
              <span className="text-[9px] font-mono text-stone-500 uppercase">
                Portal
              </span>
            </div>
            <h1 className="font-serif-grand text-2xl font-light text-slate-900 leading-tight">
              Welcome back.
            </h1>
          </div>
        </div>

        {/* 2. DESKTOP/TABLET LEFT 5 COLUMNS (>= md: Panel) */}
        <aside className="hidden md:flex md:col-span-5 bg-[#0E1201] text-[#FAF8F5] relative overflow-hidden flex-col justify-between p-6 sm:p-8 lg:p-10 border-r border-slate-800 shrink-0">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85"
            alt="Stayza Architecture"
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
              Manage your reservations, digital key, and hotel services in one place.
            </p>
          </div>

          <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-slate-400">
            <span>Guest &amp; Staff Portal</span>
            <span>Secure Access</span>
          </div>
        </aside>

        {/* 3. RIGHT FORM PANEL (Aman Alabaster Surface, Zero-Scroll) */}
        <section className="flex-1 min-h-0 md:col-span-7 p-5 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-between bg-[#FAF8F5] overflow-y-auto">
          
          {/* Desktop/Tablet Header (Hidden on Mobile) */}
          <div className="hidden md:block">
            <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase font-semibold">
              Account Sign In
            </span>
            <h1 className="font-serif-grand text-2xl lg:text-3xl text-slate-900 font-light mt-1">
              Sign In to Stayza
            </h1>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed font-normal">
              Enter your credentials to access your active reservations and hotel services.
            </p>
          </div>

          {/* Mobile Subtitle (< md) */}
          <p className="md:hidden text-xs text-stone-600 leading-tight">
            Sign in to access your active reservations, digital key, and hotel services.
          </p>

          {/* Feedback Banners */}
          {errorMsg && (
            <div className="p-2 sm:p-2.5 bg-red-50 border border-red-200 text-red-900 text-xs font-mono rounded-[2px]">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-2 sm:p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-mono rounded-[2px] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* The Unified Form */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5 my-auto py-1">
            
            {/* Email Address */}
            <div>
              <label
                htmlFor="login-email"
                className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-semibold block mb-0.5"
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
                className="w-full py-1.5 sm:py-2 px-0 bg-transparent border-b border-stone-300 focus:border-slate-900 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-0.5">
                <label
                  htmlFor="login-pass"
                  className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-semibold"
                >
                  Password
                </label>
                <span className="text-[9px] font-mono text-stone-400">Default: password123</span>
              </div>
              <div className="relative">
                <input
                  id="login-pass"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-1.5 sm:py-2 px-0 bg-transparent border-b border-stone-300 focus:border-slate-900 text-xs sm:text-sm text-slate-900 focus:outline-none transition-colors pr-8 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-800 text-xs cursor-pointer"
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
              className="group relative w-full py-3 sm:py-3.5 bg-slate-900 hover:bg-[#0E1201] text-[#FFF0CA] font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] rounded-[2px] transition-all cursor-pointer shadow-md hover:shadow-xl active:scale-[0.98] mt-2 overflow-hidden flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
              <span className="text-xs">&rarr;</span>
            </button>
          </form>

          {/* Quick Test Roles & Switch to Register */}
          <div className="pt-2 sm:pt-3 border-t border-stone-200/80 space-y-2">
            
            {/* Quick Demo Chips */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-mono text-stone-500 uppercase tracking-wider font-semibold">
                  Demo Accounts:
                </span>
                <span className="text-[8px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-bold">
                  Auto-Role Detect
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1.5 text-center font-mono text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickFill('tariq@luxury.pk')}
                  className="py-1 px-1 bg-white border border-stone-200 hover:border-slate-900 rounded-[2px] transition-all cursor-pointer group"
                >
                  <span className="block text-[7px] text-stone-400 group-hover:text-slate-900">DEMO</span>
                  <span className="font-bold text-slate-800 block text-[9px] sm:text-[10px]">Guest</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('reception@stayza.com')}
                  className="py-1 px-1 bg-white border border-stone-200 hover:border-slate-900 rounded-[2px] transition-all cursor-pointer group"
                >
                  <span className="block text-[7px] text-stone-400 group-hover:text-slate-900">DEMO</span>
                  <span className="font-bold text-slate-800 block text-[9px] sm:text-[10px]">Reception</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('cleaning@stayza.com')}
                  className="py-1 px-1 bg-white border border-stone-200 hover:border-slate-900 rounded-[2px] transition-all cursor-pointer group"
                >
                  <span className="block text-[7px] text-stone-400 group-hover:text-slate-900">DEMO</span>
                  <span className="font-bold text-slate-800 block text-[9px] sm:text-[10px]">Cleaning</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('admin@stayza.com')}
                  className="py-1 px-1 bg-white border border-stone-200 hover:border-slate-900 rounded-[2px] transition-all cursor-pointer group"
                >
                  <span className="block text-[7px] text-stone-400 group-hover:text-slate-900">DEMO</span>
                  <span className="font-bold text-slate-800 block text-[9px] sm:text-[10px]">Admin</span>
                </button>
              </div>
            </div>

            {/* Switch to Register */}
            <div className="text-center pt-0.5">
              <p className="text-xs text-stone-600 font-normal">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-slate-900 font-bold underline hover:text-amber-900 cursor-pointer ml-1"
                >
                  Create Guest Account &rarr;
                </Link>
              </p>
            </div>

            {/* Desktop Encryption Badge */}
            <div className="hidden sm:flex pt-1.5 border-t border-stone-200/50 text-[9px] font-mono text-stone-400 items-center justify-between">
              <span>Encrypted Connection</span>
              <span>Role-Based Access Control</span>
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
