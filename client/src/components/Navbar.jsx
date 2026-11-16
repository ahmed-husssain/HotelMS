import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar({ onOpenDrawer }) {
  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex flex-col items-start group">
          <span className="font-cinzel text-lg tracking-[0.28em] font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
            LUXURYSTAY
          </span>
          <span className="text-[9px] tracking-[0.35em] text-slate-500 font-medium">
            RESORT &amp; RESIDENCES
          </span>
        </Link>

        {/* Minimal Editorial Links */}
        <nav className="hidden md:flex items-center gap-10 text-[11px] font-semibold tracking-[0.22em] text-slate-600">
          <a href="#residences" className="hover:text-slate-900 transition-colors">RESIDENCES</a>
          <a href="#experience" className="hover:text-slate-900 transition-colors">THE ESTATE</a>
          <a href="#wellness" className="hover:text-slate-900 transition-colors">HINOKI SPA</a>
          <Link to="/pms" className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">
            STAFF PMS
          </Link>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onOpenDrawer()}
            className="tactile px-5 py-2.5 bg-slate-900 hover:bg-emerald-950 text-white text-[10px] tracking-[0.22em] font-semibold transition-colors duration-200 shadow-sm"
          >
            RESERVE SUITE
          </button>
        </div>
      </div>
    </header>
  )
}
