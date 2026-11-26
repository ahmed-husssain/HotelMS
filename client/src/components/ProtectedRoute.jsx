import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import BrandLogo from './BrandLogo'

/**
 * CLIENT-SIDE ROLE-BASED ACCESS CONTROL (RBAC) GUARD
 * 
 * Role-Based Access Control (RBAC) & Route Security:
 * - Blocks unauthenticated visitors from accessing internal staff workspaces
 * - Blocks role elevation (e.g., Receptionists cannot view /admin)
 * - Presents an editorial, luxury access-restricted interface with 1-click workspace returns
 */
export default function ProtectedRoute({ allowedRoles, children }) {
  const { currentUser, logout } = useAuth()

  // 1. Not authenticated -> Redirect to unified /login
  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  // 2. Authenticated but unauthorized role -> Show luxury access denied guard
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    const roleWorkspaces = {
      guest: { path: '/my-stay', label: 'Guest Portal & Key' },
      receptionist: { path: '/reception', label: 'Reception Desk' },
      housekeeping: { path: '/housekeeping', label: 'Housekeeping & Maintenance' },
      admin: { path: '/admin', label: 'General Manager Console' },
    }

    const authorizedWorkspace = roleWorkspaces[currentUser.role] || {
      path: '/',
      label: 'Home',
    }

    return (
      <div className="h-screen h-[100dvh] w-full bg-[#141210] text-[#F3EFEA] flex flex-col justify-between px-4 sm:px-8 py-5 sm:py-8 box-border select-none overflow-hidden">
        {/* Top Header */}
        <header className="max-w-4xl w-full mx-auto flex items-center justify-between shrink-0 pb-4 border-b border-[#2F2C28]">
          <Link to="/" className="inline-block transition-opacity hover:opacity-80">
            <BrandLogo variant="full" theme="light" size="sm" />
          </Link>
          <span className="font-mono text-[10px] text-[#A89E90] uppercase tracking-widest font-semibold flex items-center gap-1.5 bg-black/40 border border-[#2F2C28] px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D8CEBE]" />
            Restricted
          </span>
        </header>

        {/* Center Card (Optical Center, Never Overflows) */}
        <main className="my-auto max-w-md w-full mx-auto text-center space-y-5 px-2 shrink-0">
          {/* Minimalist Lock Emblem */}
          <div className="w-12 h-12 rounded-2xl bg-black/30 border border-[#2F2C28] flex items-center justify-center mx-auto text-[#D8CEBE]">
            <svg className="w-5 h-5 text-[#D8CEBE]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          {/* Typography */}
          <div className="space-y-1.5">
            <span className="font-mono text-[10px] text-[#9A9184] uppercase tracking-[0.22em] font-bold block">
              Staff Workspace
            </span>
            <h1 className="font-serif-grand text-2xl sm:text-3xl font-bold text-[#F3EFEA] tracking-tight">
              Access Restricted
            </h1>
            <p className="font-sans-clean text-[#A89E90] text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
              You are signed in as <strong className="text-[#F3EFEA] font-semibold">{currentUser.name}</strong>. This area is reserved exclusively for hotel management and administrative staff.
            </p>
          </div>

          {/* Action Buttons (100% Mobile Touch Targets, min-h-[44px]) */}
          <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-2.5 font-mono text-xs">
            <Link
              to={authorizedWorkspace.path}
              className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl bg-[#FAF8F5] text-slate-900 font-bold uppercase tracking-wider hover:bg-white transition-all shadow-sm flex items-center justify-center text-center cursor-pointer active:scale-[0.98]"
            >
              Return to {authorizedWorkspace.label} &rarr;
            </Link>
            
            <button
              type="button"
              onClick={logout}
              className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-black/40 text-[#D8CEBE] border border-[#2F2C28] font-semibold uppercase tracking-wider hover:bg-black/60 transition-all cursor-pointer flex items-center justify-center text-center active:scale-[0.98]"
            >
              Sign Out
            </button>
          </div>
        </main>

        {/* Footer */}
        <footer className="max-w-4xl w-full mx-auto text-center shrink-0 pt-4 border-t border-[#2F2C28]">
          <span className="font-mono text-[10px] text-[#7A7267] tracking-wider uppercase">
            Stayza Resorts &bull; Role-Based Security Guard
          </span>
        </footer>
      </div>
    )
  }

  // 3. Authorized -> Render requested route
  return children
}
