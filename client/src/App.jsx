import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import CustomCursor from './components/CustomCursor'
import ErrorBoundary from './components/ErrorBoundary'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { HotelDataProvider } from './context/HotelDataContext'
import { ToastProvider } from './context/ToastContext'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import LandingPage from './pages/LandingPage'

// Lazy-loaded auxiliary routes for ultra-low initial bundle weight
const RoomsPage = lazy(() => import('./pages/RoomsPage'))
const BookingPage = lazy(() => import('./pages/BookingPage'))
const GuestPortalPage = lazy(() => import('./pages/GuestPortalPage'))
const ConfirmationPage = lazy(() => import('./pages/ConfirmationPage'))
const PaymentVerifyPage = lazy(() => import('./pages/PaymentVerifyPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const FrontDeskPage = lazy(() => import('./pages/FrontDeskPage'))
const HousekeepingPage = lazy(() => import('./pages/HousekeepingPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

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
      {/* Magnetic Architectural Cursor Follower (Disabled on Touch) */}
      <CustomCursor />

      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* Guest Public Luxury Experience */}
          <Route path="/" element={<LandingPage />} />

          {/* Dedicated Suites & Residences Catalog */}
          <Route path="/suites" element={<RoomsPage />} />
          <Route path="/residences" element={<RoomsPage />} />
          <Route path="/rooms" element={<RoomsPage />} />

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
