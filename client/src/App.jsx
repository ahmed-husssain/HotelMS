import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CustomCursor from './components/CustomCursor'
import BookingConfirmation from './pages/BookingConfirmation'
import LandingPage from './pages/LandingPage'
import StaffDashboard from './pages/StaffDashboard'

export default function App() {
  return (
    <BrowserRouter>
      {/* Magnetic Architectural Cursor Follower */}
      <CustomCursor />

      <Routes>
        {/* Guest Public Luxury Experience */}
        <Route path="/" element={<LandingPage />} />

        {/* Post-Reservation Confirmation Receipt */}
        <Route path="/confirmation" element={<BookingConfirmation />} />

        {/* Aptech Curriculum Front-Desk Staff PMS & Folio Terminal */}
        <Route path="/pms" element={<StaffDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
