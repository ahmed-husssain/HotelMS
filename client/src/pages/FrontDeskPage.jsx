import React, { useState, useMemo, useEffect } from 'react'
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
    rooms: allRooms,
    arrivals: allArrivals,
    selectedLocation,
    setSelectedLocation,
    checkInGuest,
    checkOutGuest,
    markNoShow,
    addIncidental,
    systemSettings,
    guestRequests = [],
    markServiceDelivered,
  } = useHotelData()

  // Filter rooms & arrivals based on active branch selection
  const rooms = useMemo(() => {
    if (!selectedLocation || selectedLocation === 'all') return allRooms
    return allRooms.filter((r) => (r.locationId || 'sindh-coast') === selectedLocation)
  }, [allRooms, selectedLocation])

  const arrivals = useMemo(() => {
    if (!selectedLocation || selectedLocation === 'all') return allArrivals
    return allArrivals.filter((a) => (a.locationId || 'sindh-coast') === selectedLocation)
  }, [allArrivals, selectedLocation])

  const pendingOrdersCount = useMemo(() => {
    return (guestRequests || []).filter((r) => r.status === 'PENDING').length
  }, [guestRequests])

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

  // Lock body scroll when No-Show confirmation modal is active
  useEffect(() => {
    if (!isNoShowModalOpen) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsNoShowModalOpen(false)
        setNoShowArrival(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isNoShowModalOpen])

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

          {/* Sub Row: Shift Closing Button & Property Selector */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/50">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2 py-1 text-[11px] font-mono font-bold text-slate-800 cursor-pointer min-h-[38px] max-w-[170px]"
              aria-label="Filter by Property Mobile"
            >
              <option value="all">All Branches (15)</option>
              <option value="sindh-coast">Sindh Coast (4)</option>
              <option value="hunza">Hunza Valley (4)</option>
              <option value="lahore">Lahore Estate (4)</option>
              <option value="murree">Murree Pines (3)</option>
            </select>
            <button
              type="button"
              onClick={() => setIsZReportOpen(true)}
              className="px-3 py-1.5 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer shadow-2xs min-h-[38px] flex items-center shrink-0"
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
              <span className="text-slate-300">/</span>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs font-mono font-bold text-slate-900 cursor-pointer min-h-[36px] hover:border-slate-900 transition-colors"
                aria-label="Filter by Property"
              >
                <option value="all">All Branches (18 Rooms)</option>
                <option value="sindh-coast">Sindh Coast (5 Rooms)</option>
                <option value="hunza">Hunza Valley (5 Rooms)</option>
                <option value="lahore">Lahore Estate (4 Rooms)</option>
                <option value="murree">Murree Pines (4 Rooms)</option>
              </select>
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
          <button
            type="button"
            onClick={() => setActiveTab('ORDERS')}
            className={`px-3.5 sm:px-4 py-2.5 text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] cursor-pointer transition-colors whitespace-nowrap min-h-[44px] flex items-center gap-2 ${
              activeTab === 'ORDERS'
                ? 'bg-[#0E1201] text-[#FFF0CA]'
                : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700'
            }`}
          >
            <span>Guest Orders &amp; Room Service</span>
            {pendingOrdersCount > 0 ? (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[10px] flex items-center justify-center font-bold">
                {pendingOrdersCount}
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 font-mono">({guestRequests.length})</span>
            )}
          </button>
        </div>

        {/* Views */}
        {activeTab === 'QUEUE' && (
          <ArrivalsList
            arrivals={arrivals}
            rooms={rooms}
            onCheckInArrival={handleCheckInArrival}
            onOpenFolio={handleOpenFolio}
            onOpenInvoice={handleOpenInvoice}
            onMarkNoShow={handleMarkNoShow}
            searchQuery={searchQuery}
          />
        )}
        {activeTab === 'RACK' && (
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
        {activeTab === 'ORDERS' && (
          <div className="bg-white border border-slate-200/90 rounded-[2px] p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-slate-400 block">
                  IN-STAY DINING &amp; CONCIERGE DISPATCH
                </span>
                <h3 className="font-serif-grand text-xl sm:text-2xl text-slate-900 mt-0.5">
                  Guest Room Service &amp; Orders Queue
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-500 self-start sm:self-auto">
                {pendingOrdersCount} Pending &bull; {guestRequests.length} Total Today
              </span>
            </div>

            {guestRequests.length === 0 ? (
              <div className="py-12 text-center text-slate-500 font-mono text-xs space-y-1">
                <p className="font-bold text-slate-700">No active room service orders</p>
                <p className="text-[11px] text-slate-400">
                  Guest dining and concierge requests ordered via the digital guest portal will appear here in real time.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Mobile View: Vertical Cards */}
                <div className="sm:hidden space-y-3">
                  {guestRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-4 bg-[#FAF8F5] border border-slate-200 rounded-[2px] space-y-2.5 text-xs font-mono"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <strong className="text-slate-900 font-bold block text-sm">
                            {req.roomNumber}
                          </strong>
                          <span className="text-slate-500 text-[11px]">{req.guestName}</span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            req.status === 'DELIVERED'
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                              : 'bg-amber-100 text-amber-900 border border-amber-200 animate-pulse'
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>

                      <div className="border-t border-slate-200/60 pt-2 flex justify-between items-center text-slate-700">
                        <span>{req.request || req.title}</span>
                        <strong className="text-slate-900">PKR {(req.price || 0).toLocaleString()}</strong>
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                        <span>Time: {req.requestedAt || 'Just Now'}</span>
                        {req.status !== 'DELIVERED' ? (
                          <button
                            type="button"
                            onClick={() => markServiceDelivered(req.id, currentUser?.name || 'Sara Ahmed')}
                            className="px-3 py-1.5 bg-[#0E1201] text-[#FFF0CA] font-bold uppercase tracking-wider rounded-[2px] cursor-pointer min-h-[36px]"
                          >
                            Mark Delivered &rarr;
                          </button>
                        ) : (
                          <span className="text-emerald-700 font-bold">✓ Delivered to Room</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop View: Full Clean Ledger */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-xs font-mono border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-y border-slate-200">
                        <th className="py-2.5 px-4 text-left">Room / Suite</th>
                        <th className="py-2.5 px-4 text-left">Guest</th>
                        <th className="py-2.5 px-4 text-left">Requested Service / Order</th>
                        <th className="py-2.5 px-4 text-right">Amount (PKR)</th>
                        <th className="py-2.5 px-4 text-center">Time</th>
                        <th className="py-2.5 px-4 text-center">Status</th>
                        <th className="py-2.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {guestRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-900">{req.roomNumber}</td>
                          <td className="py-3 px-4 text-slate-700">{req.guestName}</td>
                          <td className="py-3 px-4 text-slate-900 font-medium">
                            <span className="block">{req.request || req.title}</span>
                            <span className="text-[10px] text-slate-400 uppercase">{req.category || 'Dining'}</span>
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-slate-900">
                            {(req.price || 0).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-center text-slate-500 text-[11px]">
                            {req.requestedAt || 'Just Now'}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                req.status === 'DELIVERED'
                                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                                  : 'bg-amber-100 text-amber-900 border border-amber-200'
                              }`}
                            >
                              {req.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            {req.status !== 'DELIVERED' ? (
                              <button
                                type="button"
                                onClick={() => markServiceDelivered(req.id, currentUser?.name || 'Sara Ahmed')}
                                className="px-3 py-1.5 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] text-[10px] font-bold uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer"
                              >
                                Mark Delivered
                              </button>
                            ) : (
                              <span className="text-[11px] text-emerald-700 font-bold">✓ Delivered</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
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

      {/* In-App Confirmation Modal for No-Show & Room Release (Fix 5: Clean redesign & trap-free) */}
      {isNoShowModalOpen && noShowArrival && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="no-show-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsNoShowModalOpen(false)
              setNoShowArrival(null)
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overscroll-contain cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FAF8F5] border border-stone-200/90 rounded-sm max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto overscroll-contain cursor-default"
          >
            {/* Header with Title & Dedicated Close (X) Button */}
            <div className="flex items-start justify-between border-b border-stone-200/80 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-900 font-bold block">
                  FRONT DESK &bull; UNCLAIMED RESERVATION
                </span>
                <h3 id="no-show-modal-title" className="font-serif-grand text-2xl font-bold text-slate-900 mt-0.5">
                  Guest No-Show &amp; Room Release
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsNoShowModalOpen(false)
                  setNoShowArrival(null)
                }}
                aria-label="Close modal"
                className="w-8 h-8 rounded-full hover:bg-stone-200 flex items-center justify-center text-slate-400 hover:text-slate-900 text-lg cursor-pointer transition-colors font-bold"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              The guest has not checked in for their scheduled arrival for Suite{' '}
              <strong className="text-slate-900 font-mono">{noShowArrival.roomNumber}</strong>. Releasing this reservation will return the suite to <strong className="text-emerald-700 font-semibold">AVAILABLE</strong> on the room rack for walk-in arrivals.
            </p>

            {/* Summary Details */}
            <div className="bg-white border border-stone-200/80 rounded-sm p-4 space-y-2.5 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 uppercase">Guest</span>
                <span className="font-bold text-slate-900 font-sans-clean">{noShowArrival.guest}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-100 pt-2">
                <span className="text-slate-500 uppercase">Reserved Suite</span>
                <span className="font-bold text-slate-900">{noShowArrival.roomNumber}</span>
              </div>
              {noShowArrival.bookingRef && (
                <div className="flex justify-between items-center border-t border-slate-100 pt-2">
                  <span className="text-slate-500 uppercase">Booking Reference</span>
                  <span className="font-bold text-slate-900 font-mono">{noShowArrival.bookingRef}</span>
                </div>
              )}
              <div className="flex justify-between items-center border-t border-slate-100 pt-2">
                <span className="text-slate-500 uppercase">30% Advance Deposit</span>
                <span className="font-bold text-slate-900 font-mono">
                  PKR {Number(noShowArrival.advancePaid || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-stone-200/60">
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
                className="px-5 py-2.5 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] text-xs font-mono uppercase tracking-wider font-bold rounded-xs transition-colors cursor-pointer shadow-sm"
              >
                Release Room to Available &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
