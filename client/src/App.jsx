import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CustomCursor from './components/CustomCursor'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import AdminPage from './pages/AdminPage'
import BookingConfirmation from './pages/BookingConfirmation'
import HousekeepingPage from './pages/HousekeepingPage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import MyStayPage from './pages/MyStayPage'
import RegisterPage from './pages/RegisterPage'
import ReservationPage from './pages/ReservationPage'
import StaffDashboard from './pages/StaffDashboard'
import SuitesPage from './pages/SuitesPage'

function AppRoutes() {
  // Enterprise-grade 120 FPS momentum scroll authority
  useSmoothScroll()

  return (
    <>
      {/* Magnetic Architectural Cursor Follower (Disabled on Touch) */}
      <CustomCursor />

      <Routes>
        {/* Guest Public Luxury Experience */}
        <Route path="/" element={<LandingPage />} />

        {/* Dedicated Suites & Residences Catalog */}
        <Route path="/suites" element={<SuitesPage />} />
        <Route path="/residences" element={<SuitesPage />} />

        {/* Dedicated 2-Column Luxury Reservation Flow */}
        <Route path="/reserve" element={<ReservationPage />} />

        {/* Guest Self-Service Portal (Digital Key, In-Stay Services & Feedback) */}
        <Route path="/my-stay" element={<MyStayPage />} />

        {/* Post-Reservation Confirmation Receipt */}
        <Route path="/confirmation" element={<BookingConfirmation />} />

        {/* Unified Authentication (Zero Toggles, 100% Auto-Detect) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Aptech Curriculum Front-Desk Staff PMS & Folio Terminal (Receptionist & Admin) */}
        <Route
          path="/pms"
          element={
            <ProtectedRoute allowedRoles={['receptionist', 'admin']}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />

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
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
