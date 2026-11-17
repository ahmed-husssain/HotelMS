import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import BrandLogo from './BrandLogo'

/**
 * CLIENT-SIDE ROLE-BASED ACCESS CONTROL (RBAC) GUARD
 * 
 * Fulfills Aptech Module 7 (Security & Access Control):
 * - Blocks unauthenticated visitors from accessing internal staff terminals
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
      guest: { path: '/my-stay', label: 'Guest Dossier & Key' },
      receptionist: { path: '/pms', label: 'Front Desk PMS Terminal' },
      housekeeping: { path: '/housekeeping', label: 'Housekeeping & Maintenance' },
      admin: { path: '/admin', label: 'General Manager Console' },
    }

    const authorizedWorkspace = roleWorkspaces[currentUser.role] || {
      path: '/',
      label: 'Sanctuary Homepage',
    }

    return (
      <div className="min-h-screen bg-[#0E1201] text-[#FAF8F5] p-6 sm:p-12 flex flex-col justify-between selection:bg-[#D4AF37] selection:text-slate-900">
        <header className="max-w-4xl w-full mx-auto flex items-center justify-between">
          <Link to="/" className="inline-block">
            <BrandLogo variant="full" theme="light" size="sm" />
          </Link>
          <span className="font-mono text-xs text-red-400 bg-red-950/80 border border-red-800/80 px-2.5 py-1 rounded-[2px] uppercase tracking-wider">
            ● RESTRICTED ACCESS
          </span>
        </header>

        <main className="max-w-xl w-full mx-auto bg-[#FAF8F5] text-slate-900 border border-slate-300 rounded-[2px] p-8 sm:p-12 shadow-2xl my-auto space-y-6">
          <div>
            <span className="font-mono text-[10px] text-red-800 uppercase tracking-widest font-bold block mb-1">
              // SECURITY ENFORCEMENT &bull; RBAC PROTOCOL
            </span>
            <h1 className="font-serif-grand text-3xl text-slate-900 font-light">
              Access Restricted
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Your current active session as <strong>{currentUser.name}</strong> (<code>{currentUser.roleLabel || currentUser.role}</code>) does not possess authorization to view this terminal.
            </p>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-[2px] text-xs font-mono text-amber-900">
            <strong>Required Authorization:</strong> {allowedRoles.join(' or ').toUpperCase()} privileges.
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 font-mono text-xs">
            <Link
              to={authorizedWorkspace.path}
              className="w-full sm:w-auto flex-1 text-center py-3 px-4 bg-[#0E1201] text-[#FFF0CA] font-bold uppercase tracking-wider rounded-[2px] hover:bg-slate-900 transition-colors"
            >
              Return to Your Workspace ({authorizedWorkspace.label}) &rarr;
            </Link>
            
            <button
              type="button"
              onClick={logout}
              className="w-full sm:w-auto py-3 px-4 bg-slate-200 text-slate-800 font-bold uppercase tracking-wider rounded-[2px] hover:bg-slate-300 transition-colors cursor-pointer"
            >
              Sign Out / Switch User
            </button>
          </div>
        </main>

        <footer className="max-w-4xl w-full mx-auto text-center font-mono text-[10px] text-slate-500">
          HABITAS SANCTUARY &bull; ROLE-BASED ACCESS CONTROL ENFORCEMENT ACTIVE
        </footer>
      </div>
    )
  }

  // 3. Authorized -> Render requested route
  return children
}
