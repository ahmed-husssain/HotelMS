import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import { useAuth } from '../context/AuthContext'

/**
 * GUEST REGISTRATION PAGE (/register)
 * 
 * - Desktop: Architectural split-card with local hero imagery
 * - Mobile: Clean responsive layout with zero cut-off elements
 * - Provisions strict role: 'guest' in compliance with zero-trust RBAC
 * - Pure theme monochrome (zero yellowish accents)
 * - Custom React validation with inline error messaging (zero generic HTML popups)
 */
export default function RegisterPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectUrl = searchParams.get('redirect')
  const { registerGuest } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)

  // Custom Field-Level Validation State
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [apiError, setApiError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Validation function
  const validateField = (field, value, allValues = {}) => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Full legal name is required.'
        if (value.trim().length < 2) return 'Please enter your full name.'
        return ''
      case 'email':
        if (!value.trim()) return 'Email address is required.'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return 'Please enter a valid email address (e.g. name@domain.com).'
        }
        return ''
      case 'phone':
        if (!value.trim()) return 'Contact phone number is required.'
        if (value.replace(/\D/g, '').length < 10) {
          return 'Please enter a valid phone number (at least 10 digits).'
        }
        return ''
      case 'password':
        if (!value) return 'Password is required.'
        if (value.length < 6) return 'Password must be at least 6 characters.'
        return ''
      case 'confirmPassword':
        if (!value) return 'Please re-type your password.'
        if (value !== (allValues.password ?? password)) {
          return 'Passwords do not match.'
        }
        return ''
      case 'terms':
        if (!value) return 'You must agree to the Terms and Privacy Policy.'
        return ''
      default:
        return ''
    }
  }

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    let val = ''
    if (field === 'name') val = name
    if (field === 'email') val = email
    if (field === 'phone') val = phone
    if (field === 'password') val = password
    if (field === 'confirmPassword') val = confirmPassword
    if (field === 'terms') val = agreeTerms

    const err = validateField(field, val, { password, confirmPassword })
    setErrors((prev) => ({ ...prev, [field]: err }))
  }

  const handleChange = (field, value) => {
    if (field === 'name') setName(value)
    if (field === 'email') setEmail(value)
    if (field === 'phone') setPhone(value)
    if (field === 'password') {
      setPassword(value)
      if (touched.confirmPassword && confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: validateField('confirmPassword', confirmPassword, { password: value }),
        }))
      }
    }
    if (field === 'confirmPassword') setConfirmPassword(value)
    if (field === 'terms') setAgreeTerms(value)

    if (touched[field]) {
      const err = validateField(field, value, { password, confirmPassword })
      setErrors((prev) => ({ ...prev, [field]: err }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')

    // Validate all fields
    const allErrors = {
      name: validateField('name', name),
      email: validateField('email', email),
      phone: validateField('phone', phone),
      password: validateField('password', password),
      confirmPassword: validateField('confirmPassword', confirmPassword, { password }),
      terms: validateField('terms', agreeTerms),
    }

    setTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
      terms: true,
    })

    const hasErrors = Object.values(allErrors).some(Boolean)
    setErrors(allErrors)

    if (hasErrors) {
      return
    }

    setIsSubmitting(true)

    try {
      await registerGuest({ name, email, password, phone })
      // Smooth redirect to suites catalog or requested destination
      setTimeout(() => {
        navigate(redirectUrl || '/suites?welcome=true')
      }, 500)
    } catch (err) {
      setApiError(err.message || 'Failed to create guest profile.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen min-h-dvh bg-[#0E1201] text-slate-800 p-3 sm:p-5 md:p-8 pb-12 sm:pb-8 flex flex-col justify-start md:justify-center overflow-y-auto selection:bg-slate-700 selection:text-white">
      
      {/* Top Desktop Brand Bar (Hidden on Mobile: Mobile uses the Aperture Header) */}
      <header className="hidden md:flex max-w-5xl w-full mx-auto mb-3 sm:mb-4 items-center justify-between shrink-0">
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

          {/* Backend API Error Banner */}
          {apiError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-900 text-xs font-mono rounded-[2px]">
              {apiError}
            </div>
          )}

          {/* The Registration Form (noValidate disables generic browser bubbles) */}
          <form onSubmit={handleSubmit} noValidate className="space-y-3">
            
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
                maxLength={100}
                placeholder="e.g. Tariq Khan"
                value={name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                className={`w-full py-2 px-3 bg-white border rounded-[2px] text-xs sm:text-sm font-medium text-slate-900 focus:outline-none transition-colors ${
                  touched.name && errors.name
                    ? 'border-red-400 focus:border-red-600 bg-red-50/20'
                    : 'border-slate-300 focus:border-slate-900'
                }`}
              />
              {touched.name && errors.name && (
                <span className="text-[10px] text-red-600 font-mono mt-1 block">
                  {errors.name}
                </span>
              )}
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
                  maxLength={120}
                  placeholder="guest@stayza.com"
                  value={email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className={`w-full py-2 px-3 bg-white border rounded-[2px] text-xs sm:text-sm text-slate-900 focus:outline-none transition-colors font-mono ${
                    touched.email && errors.email
                      ? 'border-red-400 focus:border-red-600 bg-red-50/20'
                      : 'border-slate-300 focus:border-slate-900'
                  }`}
                />
                {touched.email && errors.email && (
                  <span className="text-[10px] text-red-600 font-mono mt-1 block">
                    {errors.email}
                  </span>
                )}
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
                  maxLength={20}
                  placeholder="+92 300 1234567"
                  value={phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  className={`w-full py-2 px-3 bg-white border rounded-[2px] text-xs sm:text-sm text-slate-900 focus:outline-none transition-colors font-mono ${
                    touched.phone && errors.phone
                      ? 'border-red-400 focus:border-red-600 bg-red-50/20'
                      : 'border-slate-300 focus:border-slate-900'
                  }`}
                />
                {touched.phone && errors.phone && (
                  <span className="text-[10px] text-red-600 font-mono mt-1 block">
                    {errors.phone}
                  </span>
                )}
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
                  minLength={6}
                  maxLength={100}
                  autoComplete="new-password"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  className={`w-full py-2 px-3 bg-white border rounded-[2px] text-xs sm:text-sm text-slate-900 focus:outline-none transition-colors font-mono ${
                    touched.password && errors.password
                      ? 'border-red-400 focus:border-red-600 bg-red-50/20'
                      : 'border-slate-300 focus:border-slate-900'
                  }`}
                />
                {touched.password && errors.password && (
                  <span className="text-[10px] text-red-600 font-mono mt-1 block">
                    {errors.password}
                  </span>
                )}
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
                  minLength={6}
                  maxLength={100}
                  autoComplete="new-password"
                  placeholder="Re-type password"
                  value={confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  onBlur={() => handleBlur('confirmPassword')}
                  className={`w-full py-2 px-3 bg-white border rounded-[2px] text-xs sm:text-sm text-slate-900 focus:outline-none transition-colors font-mono ${
                    touched.confirmPassword && errors.confirmPassword
                      ? 'border-red-400 focus:border-red-600 bg-red-50/20'
                      : 'border-slate-300 focus:border-slate-900'
                  }`}
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <span className="text-[10px] text-red-600 font-mono mt-1 block">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="pt-1">
              <div className="flex items-start gap-2">
                <input
                  id="reg-terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => handleChange('terms', e.target.checked)}
                  onBlur={() => handleBlur('terms')}
                  className="mt-0.5 accent-slate-950 cursor-pointer"
                />
                <label htmlFor="reg-terms" className="text-[10px] sm:text-xs text-slate-600 cursor-pointer select-none leading-tight">
                  I agree to the Terms of Service and Privacy Policy.
                </label>
              </div>
              {touched.terms && errors.terms && (
                <span className="text-[10px] text-red-600 font-mono mt-1 block">
                  {errors.terms}
                </span>
              )}
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
