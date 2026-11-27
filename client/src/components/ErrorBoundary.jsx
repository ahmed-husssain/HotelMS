import React from 'react'
import BrandLogo from './BrandLogo'

/**
 * STAYZA HOSPITALITY — ENTERPRISE REACT ERROR BOUNDARY
 * 
 * Prevents blank white screens across lazy-loaded route chunks, network drops,
 * or unexpected runtime errors. Renders an editorial luxury recovery screen
 * with 1-click reload and navigation recovery.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Stayza ErrorBoundary] Uncaught runtime exception:', error, errorInfo)
    this.setState({ errorInfo })

    // Auto-recover from stale Vite chunk hash mismatches after deployments
    const isChunkLoadFailed =
      error?.message?.includes('Failed to fetch dynamically imported module') ||
      error?.message?.includes('Loading chunk') ||
      error?.message?.includes('dynamically imported module')

    if (isChunkLoadFailed) {
      const hasReloaded = sessionStorage.getItem('stayza_chunk_retry')
      if (!hasReloaded) {
        sessionStorage.setItem('stayza_chunk_retry', 'true')
        window.location.reload()
      }
    }
  }

  handleReload = () => {
    sessionStorage.removeItem('stayza_chunk_retry')
    window.location.reload()
  }

  handleReset = () => {
    sessionStorage.removeItem('stayza_chunk_retry')
    this.setState({ hasError: false, error: null, errorInfo: null })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      const isDev = import.meta.env?.DEV ?? false

      return (
        <div className="min-h-screen min-h-dvh bg-[#0E1201] text-[#FAF8F5] p-6 sm:p-12 flex flex-col justify-between selection:bg-[#D4AF37] selection:text-slate-900">
          {/* Top Brand Header */}
          <header className="max-w-4xl w-full mx-auto flex items-center justify-between">
            <a href="/" className="inline-block">
              <BrandLogo variant="full" theme="light" size="sm" />
            </a>
            <span className="font-mono text-xs text-amber-300 bg-amber-950/80 border border-amber-800/80 px-2.5 py-1 rounded-[2px] uppercase tracking-wider">
              ● TEMPORARY STATE
            </span>
          </header>

          {/* Recovery Sanctuary Card */}
          <main className="max-w-xl w-full mx-auto bg-[#FAF8F5] text-slate-900 border border-slate-300 rounded-[2px] p-8 sm:p-12 shadow-2xl my-auto space-y-6">
            <div>
              <span className="font-mono text-[10px] text-amber-800 uppercase tracking-widest font-bold block mb-1">
                SYSTEM RECOVERY
              </span>
              <h1 className="font-serif-grand text-3xl sm:text-4xl text-slate-900 font-light">
                Session Interruption
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                A temporary interface issue occurred while loading this view. You can reload the application or return to the home page.
              </p>
            </div>

            {/* Error Detail (Dev or sanitized) */}
            {isDev && this.state.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-[2px] text-xs font-mono text-red-900 overflow-x-auto max-h-32">
                <strong>Error:</strong> {this.state.error.toString()}
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 font-mono text-xs">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto flex-1 text-center py-3.5 px-4 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] font-bold uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer shadow-md"
              >
                Reload Page &rarr;
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto py-3.5 px-4 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer"
              >
                Return to Home
              </button>
            </div>
          </main>

          {/* Luxury Footer */}
          <footer className="max-w-4xl w-full mx-auto text-center font-mono text-[10px] text-slate-500">
            STAYZA RESORTS &bull; LUXURY HOTELS &bull; SINDH, PAKISTAN
          </footer>
        </div>
      )
    }

    return this.props.children
  }
}
