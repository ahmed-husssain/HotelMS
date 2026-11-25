import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useHotelData } from '../context/HotelDataContext'
import CleaningQueue from '../components/housekeeping/CleaningQueue'
import GuestRequests from '../components/housekeeping/GuestRequests'
import MaintenanceList from '../components/housekeeping/MaintenanceList'
import NewTicketModal from '../components/housekeeping/NewTicketModal'
import SuppliesInventory from '../components/housekeeping/SuppliesInventory'

/**
 * HousekeepingPage — LuxuryStay Architectural Housekeeping Terminal
 * 
 * Strict Compliance:
 * - AGENTS.md Architectural Constitution
 * - Option A: Architectural Floor Matrix with high-craft typography
 * - Plain, simple English (no jargon, immediately understandable on first glance)
 * - Strict Zero-Icon Protocol (no SVGs, no emojis, no icon fonts)
 * - Touch-first mobile compliance (minimum 44x44px touch targets)
 */
export default function HousekeepingPage() {
  const { currentUser, logout } = useAuth()
  const {
    rooms: allRooms,
    guestRequests,
    maintenanceTickets,
    inventory,
    selectedLocation,
    setSelectedLocation,
    updateCleaningTask,
    certifyRoomReady,
    markServiceDelivered,
    createMaintenanceTicket,
    restockInventory,
  } = useHotelData()

  // Filter rooms based on active branch selection
  const rooms = useMemo(() => {
    if (!selectedLocation || selectedLocation === 'all') return allRooms
    return allRooms.filter((r) => (r.locationId || 'sindh-coast') === selectedLocation)
  }, [allRooms, selectedLocation])

  // Navigation Tabs: 'CLEANING' | 'REQUESTS' | 'MAINTENANCE' | 'SUPPLIES'
  const [activeTab, setActiveTab] = useState('CLEANING')
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false)
  const [prefilledRoomNumber, setPrefilledRoomNumber] = useState('')

  // Operational Counts
  const dirtyCount = rooms.filter((r) => r.status === 'DIRTY').length
  const cleaningCount = rooms.filter((r) => r.status === 'CLEANING').length
  const readyCount = rooms.filter((r) => r.status === 'AVAILABLE' || r.status === 'INSPECTED').length
  const pendingRequestsCount = guestRequests.filter((r) => r.status === 'PENDING').length

  const handleLogTicket = (ticketData) => {
    createMaintenanceTicket(ticketData, currentUser?.name || 'Housekeeping Staff')
  }

  const handleOpenRoomTicket = (roomNumber) => {
    setPrefilledRoomNumber(roomNumber)
    setIsNewTicketModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 font-sans-clean antialiased selection:bg-emerald-100 selection:text-emerald-950">
      {/* 1. TOP OPERATIONAL HEADER (STRICT ZERO ICONS) */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 lg:px-12 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="group inline-flex items-center text-xs font-mono tracking-wider text-slate-600 hover:text-slate-950 uppercase transition-colors"
          >
            <span>Back to Hotel Overview</span>
          </Link>
          <span className="text-slate-300">/</span>
          <div className="flex items-center gap-2">
            <span className="font-serif-grand text-base font-bold tracking-tight text-slate-900">STAYZA</span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-mono uppercase tracking-widest text-slate-600 font-semibold">Housekeeping &amp; Turns</span>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs font-mono font-bold text-slate-900 cursor-pointer min-h-[36px] hover:border-slate-900 transition-colors"
              aria-label="Filter Housekeeping by Property"
            >
              <option value="all">📍 All Properties (18 Keys)</option>
              <option value="sindh-coast">🌊 Sindh Coast (5 Keys)</option>
              <option value="hunza">🏔️ Hunza Valley (5 Keys)</option>
              <option value="lahore">🏛️ Lahore Estate (4 Keys)</option>
              <option value="murree">🌲 Murree Pines (4 Keys)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {currentUser?.role === 'admin' && (
            <Link
              to="/reception"
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors"
            >
              Reception
            </Link>
          )}

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-500 hidden sm:inline">Staff: {currentUser?.name || 'Sara Ahmed'}</span>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <button
              type="button"
              onClick={logout}
              className="text-xs text-rose-700 hover:text-rose-900 font-mono uppercase font-bold tracking-wider cursor-pointer"
            >
              Exit
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-8 space-y-8">
        
        {/* Page Title & Operational KPI Ribbon */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-slate-200/90 pb-6 gap-6">
          <div>
            <div className="inline-block text-[11px] font-mono uppercase tracking-[0.2em] font-bold text-emerald-950 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 mb-2">
              Daily Room Cleaning
            </div>
            <h1 className="font-serif-grand text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Housekeeping Floor Plan
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-xl font-sans-clean">
              Floor-by-floor room status for daily cleaning, stayover service, and supervisor quality approval.
            </p>
          </div>

          {/* 4 Clean Metric Cards (Space Grotesk, Zero Icons, Plain English) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3 border border-slate-200 shadow-xs">
            <div className="px-3 sm:px-4 py-1.5 border-r border-slate-200">
              <div className="text-[10px] font-mono uppercase tracking-widest text-rose-700 font-semibold">Needs Cleaning</div>
              <div className="font-mono text-xl sm:text-2xl font-bold text-rose-900">{dirtyCount}</div>
              <div className="text-[10px] font-mono text-slate-500">Rooms Due</div>
            </div>
            <div className="px-3 sm:px-4 py-1.5 border-r border-slate-200">
              <div className="text-[10px] font-mono uppercase tracking-widest text-amber-700 font-semibold">Being Cleaned</div>
              <div className="font-mono text-xl sm:text-2xl font-bold text-amber-900">{cleaningCount}</div>
              <div className="text-[10px] font-mono text-slate-500">Staff in Room</div>
            </div>
            <div className="px-3 sm:px-4 py-1.5 border-r border-slate-200">
              <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 font-semibold">Clean &amp; Ready</div>
              <div className="font-mono text-xl sm:text-2xl font-bold text-emerald-950">{readyCount}</div>
              <div className="text-[10px] font-mono text-slate-500">Ready for Guests</div>
            </div>
            <div className="px-3 sm:px-4 py-1.5">
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-600 font-semibold">Guest Requests</div>
              <div className="font-mono text-xl sm:text-2xl font-bold text-slate-900">{pendingRequestsCount}</div>
              <div className="text-[10px] font-mono text-slate-500">Awaiting Delivery</div>
            </div>
          </div>
        </div>

        {/* 4 Core Housekeeping Tabs */}
        <div className="flex overflow-x-auto border-b border-slate-200 gap-1 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('CLEANING')}
            className={`min-h-[44px] px-5 py-3 uppercase font-bold tracking-wider cursor-pointer border-b-2 transition-all shrink-0 ${
              activeTab === 'CLEANING'
                ? 'border-slate-900 text-slate-900 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Rooms to Clean ({rooms.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('REQUESTS')}
            className={`min-h-[44px] px-5 py-3 uppercase font-bold tracking-wider cursor-pointer border-b-2 transition-all shrink-0 ${
              activeTab === 'REQUESTS'
                ? 'border-slate-900 text-slate-900 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Guest Requests ({pendingRequestsCount} Pending)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('MAINTENANCE')}
            className={`min-h-[44px] px-5 py-3 uppercase font-bold tracking-wider cursor-pointer border-b-2 transition-all shrink-0 ${
              activeTab === 'MAINTENANCE'
                ? 'border-slate-900 text-slate-900 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Broken &amp; Maintenance ({maintenanceTickets.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('SUPPLIES')}
            className={`min-h-[44px] px-5 py-3 uppercase font-bold tracking-wider cursor-pointer border-b-2 transition-all shrink-0 ${
              activeTab === 'SUPPLIES'
                ? 'border-slate-900 text-slate-900 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Linen &amp; Supplies ({inventory.length || 7})
          </button>
        </div>

        {/* Active Tab Views */}
        {activeTab === 'CLEANING' && (
          <CleaningQueue
            rooms={rooms}
            onToggleTask={updateCleaningTask}
            onCertifyReady={certifyRoomReady}
            onOpenReportTicket={handleOpenRoomTicket}
          />
        )}

        {activeTab === 'REQUESTS' && (
          <GuestRequests
            requests={guestRequests}
            onMarkDelivered={markServiceDelivered}
          />
        )}

        {activeTab === 'MAINTENANCE' && (
          <MaintenanceList
            tickets={maintenanceTickets}
            onOpenModal={() => setIsNewTicketModalOpen(true)}
          />
        )}

        {activeTab === 'SUPPLIES' && (
          <SuppliesInventory
            inventory={inventory}
            onRestockItem={restockInventory}
          />
        )}
      </main>

      {/* Maintenance Ticket Modal */}
      <NewTicketModal
        isOpen={isNewTicketModalOpen}
        onClose={() => {
          setIsNewTicketModalOpen(false)
          setPrefilledRoomNumber('')
        }}
        rooms={rooms}
        initialRoomNumber={prefilledRoomNumber}
        onSubmitTicket={handleLogTicket}
      />
    </div>
  )
}
