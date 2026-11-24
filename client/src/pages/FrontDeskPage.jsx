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
  const [noShowArrival, setNoShowArrival] = useState(null)
  const [isCheckInOpen, setIsCheckInOpen] = useState(false)
  const [isFolioOpen, setIsFolioOpen] = useState(false)
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false)
  const [isZReportOpen, setIsZReportOpen] = useState(false)
  const [isNoShowModalOpen, setIsNoShowModalOpen] = useState(false)

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
    setNoShowArrival(arrival)
    setIsNoShowModalOpen(true)
  }

  const handleConfirmNoShow = () => {
    if (!noShowArrival) return
    markNoShow(noShowArrival.id, noShowArrival.roomNumber, currentUser?.name || 'Sara Ahmed (Front Desk)')
    setIsNoShowModalOpen(false)
    setNoShowArrival(null)
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
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-slate-200/80">
        {/* Mobile Header (<640px) */}
        <div className="sm:hidden px-4 py-2.5 space-y-2">
          {/* Top Row: Navigation, Logo & Staff Exit */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="w-8 h-8 flex items-center justify-center text-xs font-mono text-slate-600 hover:text-slate-950 font-bold"
                title="Return to Hotel Overview"
              >
                &larr;
              </Link>
              <span className="font-serif-grand text-base font-bold tracking-tight text-slate-900">STAYZA</span>
              <span className="text-[10px] font-mono uppercase text-emerald-900 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-[2px] font-semibold">
                Front Desk
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-600 font-medium truncate max-w-[100px]">
                {currentUser?.name ? currentUser.name.split(' ')[0] : 'Sara'}
              </span>
              <button
                type="button"
                onClick={logout}
                className="text-[11px] text-red-700 hover:underline uppercase font-bold cursor-pointer"
              >
                Exit
              </button>
            </div>
          </div>

          {/* Sub Row: Shift Closing Button */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
              Shift Active &bull; {arrivals.length} Incoming
            </span>
            <button
              type="button"
              onClick={() => setIsZReportOpen(true)}
              className="px-3 py-1.5 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer shadow-2xs min-h-[38px] flex items-center"
            >
              Shift Closing &rarr;
            </button>
          </div>
        </div>

        {/* Desktop Header (>=640px) */}
        <div className="hidden sm:flex max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-3.5 items-center justify-between">
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
              className="px-3.5 py-1.5 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer shadow-2xs min-h-[44px] flex items-center"
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
        </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-5 sm:py-8 space-y-6 sm:space-y-8">
        {/* Operational Summary & Search Bar (Structured, Non-Empty, Strictly Zero Icons) */}
        <div className="bg-white border border-slate-200/90 rounded-[2px] p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2.5 sm:space-y-1 w-full md:w-auto">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 font-bold block">
              Today's Front Desk Summary
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
              <div className="p-2 sm:p-0 bg-slate-50 sm:bg-transparent rounded-[2px] sm:rounded-none">
                <span className="text-slate-400 block text-[10px] uppercase">Arrivals</span>
                <strong className="text-sm sm:text-base text-slate-900 font-bold">{arrivals.length} Incoming</strong>
              </div>
              <div className="p-2 sm:p-0 bg-slate-50 sm:bg-transparent rounded-[2px] sm:rounded-none sm:border-l sm:border-slate-200 sm:pl-5">
                <span className="text-slate-400 block text-[10px] uppercase">Departures</span>
                <strong className="text-sm sm:text-base text-slate-900 font-bold">{occupiedCount} Due Today</strong>
              </div>
              <div className="p-2 sm:p-0 bg-slate-50 sm:bg-transparent rounded-[2px] sm:rounded-none sm:border-l sm:border-slate-200 sm:pl-5">
                <span className="text-slate-400 block text-[10px] uppercase">House Occupancy</span>
                <strong className="text-sm sm:text-base text-slate-900 font-bold">{occupancyRate}% ({occupiedCount}/{rooms.length})</strong>
              </div>
              <div className="p-2 sm:p-0 bg-slate-50 sm:bg-transparent rounded-[2px] sm:rounded-none sm:border-l sm:border-slate-200 sm:pl-5">
                <span className="text-slate-400 block text-[10px] uppercase">Ready to Check-In</span>
                <strong className="text-sm sm:text-base text-emerald-950 font-bold">{availableCount} Suites</strong>
              </div>
              <div className="col-span-2 sm:col-span-1 p-2 sm:p-0 bg-slate-50 sm:bg-transparent rounded-[2px] sm:rounded-none sm:border-l sm:border-slate-200 sm:pl-5">
                <span className="text-slate-400 block text-[10px] uppercase">Needs Cleaning</span>
                <strong className="text-sm sm:text-base text-amber-900 font-bold">{dirtyCount} Suites</strong>
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
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-slate-200/90 rounded-[2px] text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-colors"
            />
          </div>
        </div>

        {/* Tab Controls (Structured, Clean, Substantial) */}
        <div className="flex items-center gap-2 sm:gap-3 border-b border-slate-200/80 pb-2 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('QUEUE')}
            className={`px-3.5 sm:px-4 py-2.5 text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] cursor-pointer transition-colors whitespace-nowrap min-h-[44px] flex items-center ${
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

      {/* Luxury In-App Confirmation Modal for No-Show */}
      {isNoShowModalOpen && noShowArrival && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FAF8F5] border border-stone-200/90 rounded-sm max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-6">
            <div className="space-y-1.5 border-b border-stone-200/80 pb-4">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-600 font-bold block">
                Reservation Forfeit Warning
              </span>
              <h3 className="font-serif-grand text-xl font-bold text-slate-900">
                Confirm No-Show Release
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to declare a guest No-Show for Suite{' '}
                <strong className="text-slate-900 font-mono">{noShowArrival.roomNumber}</strong>?
              </p>
            </div>

            <div className="bg-white border border-stone-200/80 rounded-sm p-4 space-y-2.5 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 uppercase">Guest</span>
                <span className="font-bold text-slate-900 font-sans-clean">{noShowArrival.guest}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-100 pt-2">
                <span className="text-slate-500 uppercase">Reserved Suite</span>
                <span className="font-bold text-slate-900">{noShowArrival.roomNumber}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-100 pt-2">
                <span className="text-slate-500 uppercase">Advance Deposit (30%)</span>
                <span className="font-bold text-red-700">
                  PKR {Number(noShowArrival.advancePaid || 0).toLocaleString()} (Forfeited)
                </span>
              </div>
              <p className="text-[11px] font-sans-clean text-slate-500 pt-1 leading-normal">
                This suite will immediately be returned to{' '}
                <strong className="text-emerald-700 font-semibold">AVAILABLE</strong> on the room rack and can be booked by walk-in guests.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsNoShowModalOpen(false)
                  setNoShowArrival(null)
                }}
                className="px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-slate-600 hover:text-slate-900 hover:bg-stone-200/60 rounded-xs transition-colors cursor-pointer"
              >
                Keep Reservation
              </button>
              <button
                type="button"
                onClick={handleConfirmNoShow}
                className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white text-xs font-mono uppercase tracking-wider font-bold rounded-xs transition-colors cursor-pointer shadow-sm"
              >
                Forfeit &amp; Release Suite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
