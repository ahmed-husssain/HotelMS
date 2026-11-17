import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import { useAuth } from '../context/AuthContext'
import { useHotelData } from '../context/HotelDataContext'
import RoomRack from '../components/pms/RoomRack'
import ArrivalsList from '../components/pms/ArrivalsList'
import CheckInModal from '../components/pms/CheckInModal'
import AddChargeModal from '../components/pms/AddChargeModal'
import CheckoutInvoiceModal from '../components/pms/CheckoutInvoiceModal'
import ShiftClosingModal from '../components/pms/ShiftClosingModal'

export default function FrontDeskPage() {
  const { currentUser, logout } = useAuth()
  const {
    rooms,
    arrivals,
    checkInGuest,
    checkOutGuest,
    addIncidental,
    systemSettings,
  } = useHotelData()

  // Terminal Navigation Tab: 'RACK' | 'ARRIVALS'
  const [activeTab, setActiveTab] = useState('RACK')
  const [roomFilter, setRoomFilter] = useState('ALL')

  // Modals State
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [selectedArrival, setSelectedArrival] = useState(null)
  const [isCheckInOpen, setIsCheckInOpen] = useState(false)
  const [isFolioOpen, setIsFolioOpen] = useState(false)
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false)
  const [isZReportOpen, setIsZReportOpen] = useState(false)

  // Calculations for KPI Ribbons
  const occupiedCount = rooms.filter((r) => r.status === 'OCCUPIED').length
  const availableCount = rooms.filter((r) => r.status === 'AVAILABLE').length
  const dirtyCount = rooms.filter((r) => r.status === 'DIRTY' || r.status === 'CLEANING').length
  const occupancyRate = Math.round((occupiedCount / rooms.length) * 100)

  // Modal Handlers
  const handleOpenCheckIn = (room) => {
    // Match with first arrival or create mock
    const match = arrivals.find((a) => a.roomNumber === room.roomNumber) || {
      id: `ARR-${Date.now().toString().slice(-3)}`,
      guest: 'Walk-In Guest',
      phone: '+92 300 0000000',
      roomNumber: room.roomNumber,
      advancePaid: Math.round(room.nightlyRate * 0.3),
      totalValuation: room.nightlyRate,
      nights: 1,
    }
    setSelectedArrival(match)
    setIsCheckInOpen(true)
  }

  const handleCheckInArrival = (arrival) => {
    setSelectedArrival(arrival)
    setIsCheckInOpen(true)
  }

  const handleOpenFolio = (room) => {
    setSelectedRoom(room)
    setIsFolioOpen(true)
  }

  const handleOpenInvoice = (room) => {
    setSelectedRoom(room)
    setIsInvoiceOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 font-sans-clean antialiased selection:bg-emerald-100 selection:text-emerald-950">
      {/* 1. TOP OPERATIONAL HEADER */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-slate-200/60 px-4 sm:px-8 lg:px-12 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="group inline-flex items-center gap-1.5 text-xs font-mono tracking-wider text-slate-600 hover:text-slate-950 uppercase transition-colors"
          >
            <span>&larr;</span>
            <span className="hidden sm:inline">Sanctuary Overview</span>
          </Link>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-900 font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>FRONT DESK PMS TERMINAL</span>
          </div>
        </div>

        <BrandLogo variant="wordmark" theme="dark" size="sm" />

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsZReportOpen(true)}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-950 text-[#FFF0CA] text-[10px] font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer"
          >
            Cashier Z-Report
          </button>

          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-300 text-xs font-mono">
            <span className="text-slate-500">{currentUser?.name || 'Sara Ahmed'}</span>
            <button
              type="button"
              onClick={logout}
              className="text-[10px] text-red-700 hover:underline uppercase cursor-pointer"
            >
              Exit
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-8 space-y-8">
        {/* Metric Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-white border border-slate-200/90 rounded-[2px] shadow-2xs">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Occupancy Rate</span>
            <span className="font-serif-grand text-2xl text-slate-900 mt-1 block">{occupancyRate}%</span>
            <span className="text-[10px] font-mono text-slate-500">{occupiedCount} of {rooms.length} Suites</span>
          </div>
          <div className="p-4 bg-white border border-slate-200/90 rounded-[2px] shadow-2xs">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Available Ready</span>
            <span className="font-serif-grand text-2xl text-emerald-900 mt-1 block">{availableCount} Suites</span>
            <span className="text-[10px] font-mono text-emerald-700">Inspected &amp; Clean</span>
          </div>
          <div className="p-4 bg-white border border-slate-200/90 rounded-[2px] shadow-2xs">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Pending Turnover</span>
            <span className="font-serif-grand text-2xl text-amber-900 mt-1 block">{dirtyCount} Suites</span>
            <span className="text-[10px] font-mono text-slate-500">In Housekeeping Queue</span>
          </div>
          <div className="p-4 bg-white border border-slate-200/90 rounded-[2px] shadow-2xs">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Today&apos;s Arrivals</span>
            <span className="font-serif-grand text-2xl text-slate-900 mt-1 block">{arrivals.length} Guests</span>
            <span className="text-[10px] font-mono text-slate-500">Safepay 30% Held</span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('RACK')}
            className={`px-5 py-3 text-xs font-mono uppercase font-bold tracking-wider cursor-pointer border-b-2 transition-all ${
              activeTab === 'RACK'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Physical Room Rack ({rooms.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ARRIVALS')}
            className={`px-5 py-3 text-xs font-mono uppercase font-bold tracking-wider cursor-pointer border-b-2 transition-all ${
              activeTab === 'ARRIVALS'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Expected Arrivals Queue ({arrivals.length})
          </button>
        </div>

        {/* Views */}
        {activeTab === 'RACK' ? (
          <RoomRack
            rooms={rooms}
            activeFilter={roomFilter}
            setActiveFilter={setRoomFilter}
            onOpenCheckIn={handleOpenCheckIn}
            onOpenFolio={handleOpenFolio}
            onOpenInvoice={handleOpenInvoice}
          />
        ) : (
          <ArrivalsList
            arrivals={arrivals}
            onCheckInArrival={handleCheckInArrival}
          />
        )}
      </main>

      {/* Modals */}
      <CheckInModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        selectedArrival={selectedArrival}
        onConfirmCheckIn={checkInGuest}
      />

      <AddChargeModal
        isOpen={isFolioOpen}
        onClose={() => setIsFolioOpen(false)}
        selectedRoom={selectedRoom}
        onAddIncidental={addIncidental}
      />

      <CheckoutInvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        selectedRoom={selectedRoom}
        taxRate={systemSettings.taxRate}
        onConfirmCheckout={checkOutGuest}
      />

      <ShiftClosingModal
        isOpen={isZReportOpen}
        onClose={() => setIsZReportOpen(false)}
        currentUser={currentUser}
      />
    </div>
  )
}
