import React from 'react'
import { Link } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'

/**
 * NotFoundPage (404)
 * 
 * Minimalist luxury architectural error boundary:
 * - Pure Habitas alabaster surface (#FAF8F5)
 * - Restrained typography (Cinzel, Playfair Display, Plus Jakarta Sans, JetBrains Mono)
 * - Quick navigational portals back to Sanctuary overview, Residences catalog, or Active Stay
 */
export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 font-sans-clean flex flex-col justify-between py-8 sm:py-12 px-6 sm:px-12 selection:bg-emerald-100 selection:text-emerald-950">
      
      {/* Top Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <Link to="/" aria-label="Habitas Home">
          <BrandLogo variant="full" theme="dark" size="sm" />
        </Link>
        <span className="font-mono text-[10px] tracking-[0.25em] text-slate-500 uppercase">
          ERROR 404 &bull; SANCTUARY BOUNDARY
        </span>
      </header>

      {/* Main 404 Monograph */}
      <main className="max-w-2xl w-full mx-auto my-auto text-center py-12 sm:py-16 space-y-6">
        
        {/* Architectural Monogram Archetype */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-[10px] font-mono tracking-[0.25em] uppercase shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
          Coordinates Uncharted
        </div>

        <div className="space-y-3">
          <span className="font-mono text-xs sm:text-sm tracking-[0.3em] text-slate-400 uppercase block">
            404 // BEYOND BOUNDARY
          </span>
          <h1 className="font-serif-grand text-4xl sm:text-6xl text-slate-900 font-light leading-tight">
            The Path You Seek Rests in Silence.
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed font-light">
            The requested sanctuary coordinates do not exist, or the private residence has transitioned to unlisted occupancy.
          </p>
        </div>

        {/* Navigation Portals */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 font-mono text-xs uppercase">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3.5 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] font-bold tracking-[0.2em] rounded-[2px] transition-colors shadow-xs"
          >
            &larr; Return to Sanctuary
          </Link>

          <Link
            to="/suites"
            className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-bold tracking-[0.2em] rounded-[2px] transition-colors"
          >
            Explore Residences &rarr;
          </Link>

          <Link
            to="/my-stay"
            className="w-full sm:w-auto px-5 py-3.5 text-slate-600 hover:text-slate-950 font-medium tracking-wider underline transition-colors"
          >
            Check Active Stay
          </Link>
        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center font-mono text-[10px] text-slate-400 tracking-[0.2em] uppercase border-t border-slate-200/80 pt-4">
        &copy; {new Date().getFullYear()} HABITAS SANCTUARY &bull; SINDH COAST &bull; 24&deg;48'N, 67&deg;01'E
      </footer>

    </div>
  )
}
