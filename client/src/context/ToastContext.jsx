import React, { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

/**
 * ToastProvider
 * 
 * Luxury Travertine Notification System for Stayza HMS:
 * - Subtle bottom-right floating cards (mobile: centered bottom sheet toast)
 * - Restrained typography (Space Grotesk for telemetry, Inter for body)
 * - Auto-dismiss with smooth exit animation
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback((message, type = 'success', title = '') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    const newToast = { id, message, type, title }
    
    setToasts((prev) => [...prev.slice(-3), newToast]) // keep max 4 toasts

    setTimeout(() => {
      removeToast(id)
    }, 4500)
  }, [removeToast])

  const toast = {
    success: (msg, title = 'Confirmed') => addToast(msg, 'success', title),
    info: (msg, title = 'Notice') => addToast(msg, 'info', title),
    error: (msg, title = 'Attention') => addToast(msg, 'error', title),
  }

  return (
    <ToastContext.Provider value={{ toast, addToast }}>
      {children}

      {/* Floating Toast Portal — Shadcn / Sonner Dark Obsidian Aesthetic */}
      <div 
        aria-live="polite" 
        aria-atomic="true"
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none select-none px-3 sm:px-0"
      >
        {toasts.map((t) => {
          const isSuccess = t.type === 'success'
          const isError = t.type === 'error'

          return (
            <div
              key={t.id}
              role="alert"
              className="pointer-events-auto bg-[#0E1201] text-white border border-white/15 shadow-2xl p-3.5 rounded-[4px] flex items-start justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200"
            >
              <div className="flex items-start gap-2.5">
                {isSuccess ? (
                  <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : isError ? (
                  <svg className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                )}
                
                <div className="space-y-0.5">
                  {t.title && (
                    <span className="text-[11px] font-sans font-semibold text-white block leading-tight">
                      {t.title}
                    </span>
                  )}
                  <p className="text-xs font-sans text-slate-300 leading-snug">
                    {t.message}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeToast(t.id)}
                aria-label="Dismiss notification"
                className="text-slate-400 hover:text-white text-sm leading-none p-1 -mr-1 -mt-1 cursor-pointer transition-colors"
              >
                &times;
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    // Graceful fallback if used outside provider
    return {
      toast: {
        success: (msg) => console.log('[Toast Success]:', msg),
        info: (msg) => console.log('[Toast Info]:', msg),
        error: (msg) => console.error('[Toast Error]:', msg),
      },
      addToast: () => {},
    }
  }
  return context
}
