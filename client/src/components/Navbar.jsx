import React from 'react'
import { Link } from 'react-router-dom'
import RollingTextButton from './RollingTextButton'

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

        {/* Minimal Rolling Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[11px] font-semibold tracking-[0.22em] text-slate-600">
          <a
            href="#residences"
            className="group relative overflow-hidden h-6 inline-flex items-center"
          >
            <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full text-slate-700">
              RESIDENCES
            </span>
            <span
              aria-hidden="true"
              className="absolute top-0 left-0 inline-block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-full group-hover:translate-y-0 text-emerald-900 font-bold"
            >
              RESIDENCES
            </span>
          </a>

          <a
            href="#experience"
            className="group relative overflow-hidden h-6 inline-flex items-center"
          >
            <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full text-slate-700">
              THE ESTATE
            </span>
            <span
              aria-hidden="true"
              className="absolute top-0 left-0 inline-block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-full group-hover:translate-y-0 text-emerald-900 font-bold"
            >
              THE ESTATE
            </span>
          </a>

          <Link
            to="/pms"
            className="group relative overflow-hidden h-7 px-3 bg-slate-100 hover:bg-slate-200 rounded text-slate-800 font-bold inline-flex items-center"
          >
            <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
              STAFF PMS
            </span>
            <span
              aria-hidden="true"
              className="absolute top-0 left-3 inline-block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-full group-hover:translate-y-0 text-emerald-950 font-extrabold"
            >
              STAFF PMS
            </span>
          </Link>
        </nav>

        {/* Action Button with Rolling Text */}
        <RollingTextButton
          text="Reserve Suite"
          onClick={() => onOpenDrawer()}
        />
      </div>
    </header>
  )
}
