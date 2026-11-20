import React, { useState } from 'react'
import { Link } from 'react-router-dom'
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
    markNoShow,
    addIncidental,
    systemSettings,
  } = useHotelData()

  // Terminal Navigation Tab: 'QUEUE' | 'RACK'
  const [activeTab, setActiveTab] = useState('QUEUE')
  const [roomFilter, setRoomFilter] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')

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
  const occupancyRate = rooms.length > 0 ? Math.round((occupiedCount / rooms.length) * 100) : 0

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

  const handleMarkNoShow = (arrival) => {
    const isConfirmed = window.confirm(
      `Mark ${arrival.guest} as No-Show for ${arrival.roomNumber}?\n\nThis will release the suite back to AVAILABLE immediately. The 30% Safepay deposit (PKR ${arrival.advancePaid?.toLocaleString()}) will be forfeited per hotel cancellation policy.`
    )
    if (isConfirmed) {
      markNoShow(arrival.id, arrival.roomNumber, currentUser?.name || 'Sara Ahmed (Front Desk)')
    }
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
      {/* 1. TOP OPERATIONAL HEADER (STRICTLY ZERO ICONS) */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 lg:px-12 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="group inline-flex items-center gap-1.5 text-xs font-mono tracking-wider text-slate-600 hover:text-slate-950 uppercase transition-colors"
          >
            <span>&larr;</span>
            <span className="hidden sm:inline">Hotel Overview</span>
          </Link>
          <span className="text-slate-300">/</span>
          <div className="flex items-center gap-2">
            <span className="font-serif-grand text-base font-bold tracking-tight text-slate-900">STAYZA</span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-mono uppercase tracking-widest text-slate-600 font-semibold">Front Desk Operations</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-slate-500 hidden md:inline">Shift: {currentUser?.name || 'Sara Ahmed'}</span>
          <span className="text-slate-300 hidden md:inline">/</span>
          <button
            type="button"
            onClick={() => setIsZReportOpen(true)}
            className="px-3.5 py-1.5 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer shadow-2xs"
          >
            Shift Closing &rarr;
          </button>
          <button
            type="button"
            onClick={logout}
            className="text-[11px] text-red-700 hover:underline uppercase cursor-pointer"
          >
            Exit
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-8 space-y-8">
        {/* Operational Summary & Search Bar (Structured, Non-Empty, Strictly Zero Icons) */}
        <div className="bg-white border border-slate-200/90 rounded-[2px] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 font-bold block">
              Today's Front Desk Summary
            </span>
            <div className="flex items-baseline gap-6 text-xs font-mono flex-wrap">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Arrivals</span>
                <strong className="text-base text-slate-900 font-bold">{arrivals.length} Incoming</strong>
              </div>
              <div className="border-l border-slate-200 pl-6">
                <span className="text-slate-400 block text-[10px] uppercase">Departures</span>
                <strong className="text-base text-slate-900 font-bold">{occupiedCount} Due Today</strong>
              </div>
              <div className="border-l border-slate-200 pl-6">
                <span className="text-slate-400 block text-[10px] uppercase">House Occupancy</span>
                <strong className="text-base text-slate-900 font-bold">{occupancyRate}% ({occupiedCount} of {rooms.length})</strong>
              </div>
              <div className="border-l border-slate-200 pl-6">
                <span className="text-slate-400 block text-[10px] uppercase">Ready for Check-In</span>
                <strong className="text-base text-emerald-950 font-bold">{availableCount} Suites</strong>
              </div>
              <div className="border-l border-slate-200 pl-6">
                <span className="text-slate-400 block text-[10px] uppercase">Needs Cleaning</span>
                <strong className="text-base text-amber-900 font-bold">{dirtyCount} Suites</strong>
              </div>
            </div>
          </div>

          <div className="w-full md:w-80 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
              Instant Search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type guest name, suite #, phone..."
              className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-slate-200/90 rounded-[2px] text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-colors"
            />
          </div>
        </div>

        {/* Tab Controls (Structured, Clean, Substantial) */}
        <div className="flex items-center gap-3 border-b border-slate-200/80 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('QUEUE')}
            className={`px-4 py-2 text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] cursor-pointer transition-colors ${
              activeTab === 'QUEUE'
                ? 'bg-[#0E1201] text-[#FFF0CA]'
                : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700'
            }`}
          >
            Today's Guest Desk ({arrivals.length + occupiedCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('RACK')}
            className={`px-4 py-2 text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] cursor-pointer transition-colors ${
              activeTab === 'RACK'
                ? 'bg-[#0E1201] text-[#FFF0CA]'
                : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700'
            }`}
          >
            All {rooms.length} Suites Status
          </button>
        </div>

        {/* Views */}
        {activeTab === 'QUEUE' ? (
          <ArrivalsList
            arrivals={arrivals}
            rooms={rooms}
            onCheckInArrival={handleCheckInArrival}
            onOpenFolio={handleOpenFolio}
            onOpenInvoice={handleOpenInvoice}
            onMarkNoShow={handleMarkNoShow}
            searchQuery={searchQuery}
          />
        ) : (
          <RoomRack
            rooms={rooms}
            activeFilter={roomFilter}
            setActiveFilter={setRoomFilter}
            onOpenCheckIn={handleOpenCheckIn}
            onOpenFolio={handleOpenFolio}
            onOpenInvoice={handleOpenInvoice}
            searchQuery={searchQuery}
          />
        )}
      </main>

      {/* Modals */}
      <CheckInModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        selectedArrival={selectedArrival}
        rooms={rooms}
        onConfirmCheckIn={(arrivalId, targetRoom, options) =>
          checkInGuest(arrivalId, targetRoom, {
            ...options,
            actorName: currentUser?.name || 'Sara Ahmed (Front Desk)',
          })
        }
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
        onConfirmCheckout={(roomNumber, options) =>
          checkOutGuest(roomNumber, {
            ...options,
            actorName: currentUser?.name || 'Sara Ahmed (Front Desk)',
          })
        }
      />

      <ShiftClosingModal
        isOpen={isZReportOpen}
        onClose={() => setIsZReportOpen(false)}
        currentUser={currentUser}
      />
    </div>
  )
}
