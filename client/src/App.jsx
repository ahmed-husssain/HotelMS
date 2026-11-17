import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CustomCursor from './components/CustomCursor'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import BookingConfirmation from './pages/BookingConfirmation'
import LandingPage from './pages/LandingPage'
import MyStayPage from './pages/MyStayPage'
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

        {/* Aptech Curriculum Front-Desk Staff PMS & Folio Terminal */}
        <Route path="/pms" element={<StaffDashboard />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
