import React, { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import CardHoverPill from './components/CardHoverPill'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { HotelDataProvider } from './context/HotelDataContext'
import { ToastProvider } from './context/ToastContext'
import { useSmoothScroll } from './hooks/useSmoothScroll'

// Direct Core Route Imports: Instant 0ms transition without chunk lag
import LandingPage from './pages/LandingPage'
import RoomsPage from './pages/RoomsPage'
import EstatePage from './pages/EstatePage'
import BookingPage from './pages/BookingPage'

// Safe Lazy Helper: Automatically reloads if a new deployment changed chunk hashes
function safeLazy(importer) {
  return lazy(() =>
    importer().catch((error) => {
      console.warn('[Stayza Router] Stale deploy chunk detected. Reloading latest bundle:', error.message)
      const key = `stayza_chunk_retry_${window.location.pathname}`
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, '1')
        window.location.reload()
      }
      throw error
    })
  )
}

// Lazy-loaded auxiliary routes with auto-recovery
const GuestPortalPage = safeLazy(() => import('./pages/GuestPortalPage'))
const ConfirmationPage = safeLazy(() => import('./pages/ConfirmationPage'))
const PaymentVerifyPage = safeLazy(() => import('./pages/PaymentVerifyPage'))
const LoginPage = safeLazy(() => import('./pages/LoginPage'))
const RegisterPage = safeLazy(() => import('./pages/RegisterPage'))
const FrontDeskPage = safeLazy(() => import('./pages/FrontDeskPage'))
const HousekeepingPage = safeLazy(() => import('./pages/HousekeepingPage'))
const AdminPage = safeLazy(() => import('./pages/AdminPage'))
const NotFoundPage = safeLazy(() => import('./pages/NotFoundPage'))

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    try {
      sessionStorage.removeItem(`stayza_chunk_retry_${pathname}`)
    } catch {
      // Ignore storage errors
    }
  }, [pathname])

  return null
}

function PageFallback() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
    </div>
  )
}

function AppRoutes() {
  // Enterprise-grade 120 FPS momentum scroll authority
  useSmoothScroll()

  return (
    <>
      {/* Signature Monolithic Floating Pill for Suite/Project Cards (Desktop-Only) */}
      <CardHoverPill />

      <ScrollToTop />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* Guest Public Luxury Experience */}
          <Route path="/" element={<LandingPage />} />

          {/* Dedicated Suites & Residences Catalog */}
          <Route path="/suites" element={<RoomsPage />} />
          <Route path="/residences" element={<RoomsPage />} />
          <Route path="/rooms" element={<RoomsPage />} />

          {/* Dedicated Estate & Property Experience */}
          <Route path="/estate" element={<EstatePage />} />
          <Route path="/experience" element={<EstatePage />} />
          <Route path="/dining" element={<EstatePage />} />

          {/* Dedicated 2-Column Luxury Reservation Flow */}
          <Route path="/reserve" element={<BookingPage />} />

          {/* Guest Self-Service Portal (Digital Key, In-Stay Services & Feedback) */}
          <Route path="/my-stay" element={<GuestPortalPage />} />

          {/* Post-Reservation Confirmation Receipt */}
          <Route path="/confirmation" element={<ConfirmationPage />} />

          {/* Authoritative Safepay S2S Payment Verification */}
          <Route path="/payment/verify" element={<PaymentVerifyPage />} />

          {/* Unified Authentication (Zero Toggles, 100% Auto-Detect) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Reception & Front Desk Staff Terminal (Receptionist & Admin) */}
          <Route
            path="/reception"
            element={
              <ProtectedRoute allowedRoles={['receptionist', 'admin']}>
                <FrontDeskPage />
              </ProtectedRoute>
            }
          />
          {/* Clean Aliases for Convenience & Backward Compatibility */}
          <Route path="/front-desk" element={<Navigate to="/reception" replace />} />
          <Route path="/pms" element={<Navigate to="/reception" replace />} />

          {/* Housekeeping & Maintenance Management Queue (Housekeeping & Admin) */}
          <Route
            path="/housekeeping"
            element={
              <ProtectedRoute allowedRoles={['housekeeping', 'admin']}>
                <HousekeepingPage />
              </ProtectedRoute>
            }
          />

          {/* General Manager / Executive Admin Console (Admin Only) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* 404 Architectural Sanctuary Boundary Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <HotelDataProvider>
              <AppRoutes />
            </HotelDataProvider>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
