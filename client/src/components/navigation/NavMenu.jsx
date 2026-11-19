import React from 'react'
import { Link } from 'react-router-dom'

/**
 * NavMenu — Expanding Circular Aperture Overlay Sheet
 * Clean, lightweight, luxury navigation drawer with suite preview.
 */
export default function NavMenu({
  isOpen,
  onClose,
  onOpenDrawer,
  navItems,
  activePreview,
  setActivePreview,
  fullDateLabel,
  currentUser,
  logout,
}) {
  return (
    <>
      {/* Dimmed Dark Luxury Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-slate-950/70 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Expanding Circular Aperture Overlay Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Main Navigation Menu"
        className={`fixed inset-0 z-50 flex flex-col md:flex-row bg-[#FAF8F5] shadow-2xl overflow-hidden transition-[clip-path] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        style={{
          clipPath: isOpen
            ? 'circle(150% at calc(100% - 48px) 36px)'
            : 'circle(0% at calc(100% - 48px) 36px)',
        }}
      >
        {/* Left 45%: Live Suite Image Preview Window (Desktop Only) */}
        <div className="hidden md:block md:w-5/12 h-full relative overflow-hidden bg-slate-950 border-r border-slate-200/80">
          <img
            src={activePreview.image}
            alt={activePreview.title}
            className="w-full h-full object-cover transition-all duration-700 filter brightness-[0.88] scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-end p-10 lg:p-14 text-white">
            <span className="font-mono text-[10px] tracking-[0.28em] text-emerald-400 uppercase">
              {activePreview.tag}
            </span>
            <h3 className="font-serif-grand text-3xl font-light mt-1.5 text-white">
              {activePreview.title}
            </h3>
            <p className="font-mono text-xs text-slate-300 mt-2 max-w-sm leading-relaxed">
              {activePreview.subtitle}
            </p>
          </div>
        </div>

        {/* Right 55%: Navigation Index & Controls */}
        <div className="w-full md:w-7/12 h-full flex flex-col justify-between p-6 sm:p-8 lg:p-10 overflow-y-auto overscroll-contain">
          {/* Top Bar: Clean Branding & Dedicated Close Button */}
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest border-b border-slate-200/80 pb-3 shrink-0">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
              <span className="text-slate-900 font-semibold tracking-wider">Navigation</span>
              <span className="text-slate-300 hidden sm:inline">&middot;</span>
              <span className="text-slate-500 hidden sm:inline text-[10px]">Hotel &amp; Residences</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close Navigation Menu"
              className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-300 hover:border-slate-900 bg-white hover:bg-slate-900 hover:text-white text-[10px] font-mono uppercase tracking-wider text-slate-800 transition-all cursor-pointer active:scale-95 shadow-xs"
            >
              <span>Close</span>
              <span className="font-bold">&times;</span>
            </button>
          </div>

          {/* Navigation Links with Dynamic Hover Trigger */}
          <nav className="my-auto py-2 sm:py-4 space-y-2.5 sm:space-y-3" aria-label="Menu Items">
            {navItems.map((item) => {
              const linkContent = (
                <div
                  onMouseEnter={() => setActivePreview(item.preview)}
                  onClick={onClose}
                  className="group block border-b border-slate-200/70 pb-2 sm:pb-2.5 hover:border-slate-900 transition-colors cursor-pointer"
                >
                  <div className="flex items-baseline gap-3 sm:gap-4">
                    <span className="font-mono text-xs text-slate-400 group-hover:text-emerald-800 transition-colors">
                      [{item.num}]
                    </span>
                    <span className="font-serif-grand text-2xl sm:text-3xl lg:text-[2rem] text-slate-900 font-normal group-hover:translate-x-2 transition-transform duration-300 leading-tight">
                      {item.label}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] sm:text-xs text-slate-500 tracking-wider block mt-0.5 pl-7 sm:pl-9">
                    {item.desc}
                  </span>
                </div>
              )

              return (
                <div key={item.label}>
                  {item.isRouter ? (
                    <Link to={item.href}>{linkContent}</Link>
                  ) : (
                    <a href={item.href}>{linkContent}</a>
                  )}
                </div>
              )
            })}

            {/* Direct Reserve Sanctuary CTA */}
            <div className="pt-2 sm:pt-3">
              <button
                type="button"
                onClick={() => {
                  onClose()
                  onOpenDrawer()
                }}
                className="w-full py-3 sm:py-3.5 px-5 bg-slate-900 text-[#FAF8F5] text-xs font-mono uppercase tracking-[0.25em] font-semibold hover:bg-emerald-950 transition-colors flex items-center justify-between cursor-pointer active:scale-[0.98] shadow-md"
              >
                <span>Reserve a Suite (30% Deposit)</span>
                <span>&rarr;</span>
              </button>
            </div>

            {/* If Logged in as Staff: Exclusive Operational Workspace Access */}
            {currentUser && currentUser.role !== 'guest' && (
              <div className="pt-2">
                <Link
                  to={
                    currentUser.role === 'admin'
                      ? '/admin'
                      : currentUser.role === 'receptionist'
                      ? '/pms'
                      : '/housekeeping'
                  }
                  onClick={onClose}
                  className="w-full py-2.5 px-4 bg-emerald-950 text-emerald-200 border border-emerald-800/80 text-xs font-mono uppercase tracking-wider flex items-center justify-between hover:bg-emerald-900 transition-colors rounded-[2px]"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Open {currentUser.roleLabel || 'Staff'} Workspace</span>
                  </span>
                  <span>&rarr;</span>
                </Link>
              </div>
            )}

            {/* Account Session Strip inside Menu */}
            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs font-mono">
              {currentUser ? (
                <div className="flex items-center justify-between w-full">
                  <span className="text-slate-600">
                    Signed in as <strong>{currentUser.name}</strong> ({currentUser.role})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      logout()
                      onClose()
                    }}
                    className="text-red-700 hover:text-red-900 font-bold underline cursor-pointer ml-2"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <span className="text-slate-500">Sanctuary Account:</span>
                  <div className="flex items-center gap-3">
                    <Link
                      to="/login"
                      onClick={onClose}
                      className="text-slate-900 hover:text-amber-800 font-bold underline"
                    >
                      Sign In &rarr;
                    </Link>
                    <Link
                      to="/register"
                      onClick={onClose}
                      className="text-slate-500 hover:text-slate-900"
                    >
                      Create Profile
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Bottom Telemetry & Metadata Strip */}
          <div className="border-t border-slate-200/80 pt-3 text-[10px] font-mono text-slate-500 space-y-1.5 shrink-0">
            <div className="flex justify-between items-center text-slate-800">
              <span className="uppercase tracking-widest">Active Vacation Dates</span>
              <span className="font-semibold">{fullDateLabel}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-emerald-700 font-semibold uppercase">● 3 Suites Available</span>
              <span className="text-slate-400 text-[9px] uppercase tracking-wider">
                Stayza &middot; 5-Min Reservation Hold
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
