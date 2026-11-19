import React from 'react'
import { Link } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'

/**
 * NotFoundPage (404)
 * 
 * Clean, human-designed luxury 404:
 * - Simple, honest, human-readable copy (no AI sci-fi jargon or fake telemetry)
 * - Natural typography and standard, clean casing
 * - Clear, friendly navigation back to home or suites
 */
export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 font-sans-clean flex flex-col justify-between py-6 sm:py-8 px-6 sm:px-12 selection:bg-emerald-100 selection:text-emerald-950">
      
      {/* Top Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <BrandLogo variant="full" theme="dark" size="sm" to="/" />
        <Link 
          to="/" 
          className="text-xs text-slate-600 hover:text-slate-950 transition-colors"
        >
          &larr; Back to home
        </Link>
      </header>

      {/* Main Content */}
      <main className="max-w-lg w-full mx-auto my-auto text-center py-16 sm:py-24 space-y-5">
        
        {/* Subtle, standard 404 indicator */}
        <span className="font-mono text-sm font-semibold text-slate-400">
          404
        </span>

        {/* Natural Headline */}
        <h1 className="font-serif-grand text-3xl sm:text-5xl text-slate-900 font-normal tracking-tight">
          Page not found
        </h1>

        {/* Plain-English, Human Description */}
        <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed">
          Sorry, we couldn’t find the page you’re looking for. It might have been moved, renamed, or doesn't exist.
        </p>

        {/* Clean, Human Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-[2px] transition-colors"
          >
            Back to Home
          </Link>

          <Link
            to="/suites"
            className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 text-xs font-semibold rounded-[2px] transition-colors"
          >
            Browse Suites
          </Link>
        </div>

      </main>

      {/* Clean, Unobtrusive Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center text-xs text-slate-400 border-t border-slate-200/80 pt-4">
        &copy; {new Date().getFullYear()} Stayza. All rights reserved.
      </footer>

    </div>
  )
}
