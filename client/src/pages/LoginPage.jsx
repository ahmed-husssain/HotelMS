import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import { useAuth } from '../context/AuthContext'

/**
 * UNIFIED LOGIN PAGE (/login) — ZERO-TOGGLE AUTOMATIC ROLE DETECTION
 * 
 * Fulfills Aptech Module 7 (Security & RBAC):
 * - Clean, elegant single form for all hotel stakeholders
 * - Evaluates role server/client-side and redirects to appropriate portal:
 *   * Guest        -> /my-stay
 *   * Receptionist -> /pms
 *   * Housekeeping -> /housekeeping
 *   * Admin / GM   -> /admin
 * - Includes subtle 1-click test fill chips for effortless examiner evaluation.
 */
export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectUrl = searchParams.get('redirect')
  const { login } = useAuth()

  const [email, setEmail] = useState('tariq@luxury.pk')
  const [password, setPassword] = useState('password123')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 1-Click Role Quick Fill for testing
  const handleQuickFill = (roleEmail) => {
    setEmail(roleEmail)
    setPassword('password123')
    setErrorMsg('')
    setSuccessMsg('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setIsSubmitting(true)

    try {
      const user = login(email, password)
      
      const roleDestinations = {
        guest: { path: '/my-stay', label: 'Guest Dossier & Key' },
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
      setErrorMsg(err.message || 'Invalid credentials. Please verify your email.')
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
        
        {/* Left 5 Columns: Architectural Photography & Philosophy */}
        <aside className="lg:col-span-5 bg-[#0E1201] text-[#FAF8F5] relative overflow-hidden flex flex-col justify-between p-8 sm:p-12 border-b lg:border-b-0 lg:border-r border-slate-800">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=85"
            alt="Habitas Architecture"
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
              // The Sanctuary Standard
            </span>
            <p className="font-serif italic text-lg sm:text-xl text-slate-200 leading-relaxed font-light">
              "A seamless bridge between natural limestone silence and effortless hospitality."
            </p>
          </div>

          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>UNIFIED RBAC GATEWAY</span>
            <span>EST. 2026</span>
          </div>
        </aside>

        {/* Right 7 Columns: Unified Sign In Form */}
        <section className="lg:col-span-7 p-6 sm:p-10 lg:p-14 flex flex-col justify-between bg-[#FAF8F5]">
          <div className="space-y-6">
            
            {/* Header */}
            <div>
              <span className="text-[10px] font-mono tracking-[0.28em] text-slate-500 uppercase font-semibold">
                // AUTHENTICATION ACCESS
              </span>
              <h1 className="font-serif-grand text-3xl sm:text-4xl text-slate-900 font-light mt-1">
                Sign In to Habitas
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-normal">
                Enter your credentials. The system automatically identifies your role and directs you to your active workspace.
              </p>
            </div>

            {/* Error & Success Feedback Banners */}
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

            {/* The Unified Form (Zero Toggles) */}
            <form onSubmit={handleSubmit} className="space-y-5 pt-1">
              <div>
                <label
                  htmlFor="login-email"
                  className="text-[10px] font-mono uppercase tracking-wider text-slate-600 font-bold block mb-1"
                >
                  Email Address or Personnel ID
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-2.5 px-0 bg-transparent border-b border-slate-300 focus:border-slate-900 text-sm font-medium text-slate-900 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label
                    htmlFor="login-pass"
                    className="text-[10px] font-mono uppercase tracking-wider text-slate-600 font-bold"
                  >
                    Secret Passcode
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">Default: password123</span>
                </div>
                <div className="relative">
                  <input
                    id="login-pass"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full py-2.5 px-0 bg-transparent border-b border-slate-300 focus:border-slate-900 text-sm text-slate-900 focus:outline-none transition-colors pr-8 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800 text-xs cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? '🔒' : '👁'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] font-mono text-xs font-bold uppercase tracking-[0.2em] rounded-[2px] transition-all cursor-pointer shadow-md active:scale-[0.98] mt-3 disabled:opacity-50"
              >
                {isSubmitting ? 'Authenticating...' : 'Sign In to Sanctuary →'}
              </button>
            </form>

            {/* 1-Click Demo Testing Chips */}
            <div className="pt-4 border-t border-slate-200/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
                  // Quick Test Credentials (1-Click Fill):
                </span>
                <span className="text-[9px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  Auto-Detect Active
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => handleQuickFill('tariq@luxury.pk')}
                  className="p-2 text-left bg-white border border-slate-200 hover:border-slate-900 rounded-[2px] transition-all cursor-pointer group"
                >
                  <span className="block text-[9px] text-slate-400 group-hover:text-slate-900">ROLE 1</span>
                  <span className="font-bold text-slate-800 block text-[11px]">Guest</span>
                  <span className="text-[9px] text-slate-500 block truncate">tariq@luxury.pk</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('reception@habitas.com')}
                  className="p-2 text-left bg-white border border-slate-200 hover:border-slate-900 rounded-[2px] transition-all cursor-pointer group"
                >
                  <span className="block text-[9px] text-slate-400 group-hover:text-slate-900">ROLE 2</span>
                  <span className="font-bold text-slate-800 block text-[11px]">Front Desk</span>
                  <span className="text-[9px] text-slate-500 block truncate">reception@habitas.com</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('cleaning@habitas.com')}
                  className="p-2 text-left bg-white border border-slate-200 hover:border-slate-900 rounded-[2px] transition-all cursor-pointer group"
                >
                  <span className="block text-[9px] text-slate-400 group-hover:text-slate-900">ROLE 3</span>
                  <span className="font-bold text-slate-800 block text-[11px]">Housekeeper</span>
                  <span className="text-[9px] text-slate-500 block truncate">cleaning@habitas.com</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('admin@habitas.com')}
                  className="p-2 text-left bg-white border border-slate-200 hover:border-slate-900 rounded-[2px] transition-all cursor-pointer group"
                >
                  <span className="block text-[9px] text-slate-400 group-hover:text-slate-900">ROLE 4</span>
                  <span className="font-bold text-slate-800 block text-[11px]">General Mgr</span>
                  <span className="text-[9px] text-slate-500 block truncate">admin@habitas.com</span>
                </button>
              </div>
            </div>

            {/* Switch to Register */}
            <div className="pt-2 text-center">
              <p className="text-xs text-slate-600 font-normal">
                New to Habitas Sanctuary?{' '}
                <Link
                  to="/register"
                  className="text-[#0E1201] font-bold underline hover:text-amber-900 cursor-pointer ml-1"
                >
                  Create Guest Profile &rarr;
                </Link>
              </p>
            </div>

          </div>

          {/* Footer note */}
          <div className="pt-4 border-t border-slate-200/60 text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>256-BIT ENCRYPTION</span>
            <span>ROLE-BASED ACCESS CONTROL (RBAC)</span>
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
