import React, { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

/**
 * ToastProvider
 * 
 * Luxury Travertine Notification System for Habitas HMS:
 * - Subtle bottom-right floating cards (mobile: centered bottom sheet toast)
 * - Restrained typography (JetBrains Mono for telemetry, Plus Jakarta Sans for body)
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
    success: (msg, title = 'CONFIRMED') => addToast(msg, 'success', title),
    info: (msg, title = 'NOTIFICATION') => addToast(msg, 'info', title),
    error: (msg, title = 'ATTENTION') => addToast(msg, 'error', title),
  }

  return (
    <ToastContext.Provider value={{ toast, addToast }}>
      {children}

      {/* Floating Toast Portal */}
      <div 
        aria-live="polite" 
        aria-atomic="true"
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none select-none"
      >
        {toasts.map((t) => {
          const isSuccess = t.type === 'success'
          const isError = t.type === 'error'

          return (
            <div
              key={t.id}
              role="alert"
              className="pointer-events-auto bg-[#FAF8F5] border border-[#E5DFD5] text-[#121619] shadow-xl p-3.5 sm:p-4 rounded-[2px] flex items-start justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <div className="flex items-start gap-2.5">
                <span 
                  className={`w-2 h-2 rounded-full mt-1 shrink-0 ${
                    isSuccess ? 'bg-emerald-600' : isError ? 'bg-red-600' : 'bg-amber-600'
                  }`} 
                />
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono font-bold tracking-[0.2em] text-[#57534E] uppercase block">
                    {t.title}
                  </span>
                  <p className="text-xs font-sans-clean font-medium text-[#121619] leading-snug">
                    {t.message}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeToast(t.id)}
                aria-label="Dismiss notification"
                className="text-slate-400 hover:text-slate-900 text-xs font-mono p-1 -mr-1 -mt-1 cursor-pointer transition-colors"
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
