import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import { useAuth } from '../context/AuthContext'
import { useHotelData } from '../context/HotelDataContext'
import CleaningQueue from '../components/housekeeping/CleaningQueue'
import GuestRequests from '../components/housekeeping/GuestRequests'
import MaintenanceList from '../components/housekeeping/MaintenanceList'
import NewTicketModal from '../components/housekeeping/NewTicketModal'
import SuppliesInventory from '../components/housekeeping/SuppliesInventory'

export default function HousekeepingPage() {
  const { currentUser, logout } = useAuth()
  const {
    rooms,
    guestRequests,
    maintenanceTickets,
    inventory,
    updateCleaningTask,
    certifyRoomReady,
    markServiceDelivered,
    createMaintenanceTicket,
    restockInventory,
  } = useHotelData()

  // Navigation Tabs: 'CLEANING' | 'REQUESTS' | 'MAINTENANCE' | 'SUPPLIES'
  const [activeTab, setActiveTab] = useState('CLEANING')
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false)

  // Quick Metrics
  const dirtyCount = rooms.filter((r) => r.status === 'DIRTY').length
  const cleaningCount = rooms.filter((r) => r.status === 'CLEANING').length
  const readyCount = rooms.filter((r) => r.status === 'AVAILABLE' || r.status === 'INSPECTED').length
  const pendingRequestsCount = guestRequests.filter((r) => r.status === 'PENDING').length

  const handleLogTicket = (ticketData) => {
    createMaintenanceTicket(ticketData, currentUser?.name || 'Housekeeping Staff')
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
            <span className="hidden sm:inline">Hotel Overview</span>
          </Link>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-900 font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>HOUSEKEEPING &amp; FACILITIES TERMINAL</span>
          </div>
        </div>

        <BrandLogo variant="wordmark" theme="dark" size="sm" />

        <div className="flex items-center gap-3">
          {currentUser?.role === 'admin' && (
            <Link
              to="/pms"
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors"
            >
              PMS Desk &rarr;
            </Link>
          )}

          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-300 text-xs font-mono">
            <span className="text-slate-500">{currentUser?.name || 'Bilal Farooq'}</span>
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
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Awaiting Turnover</span>
            <span className="font-serif-grand text-2xl text-red-900 mt-1 block">{dirtyCount} Suites</span>
            <span className="text-[10px] font-mono text-slate-500">Need Immediate Cleaning</span>
          </div>
          <div className="p-4 bg-white border border-slate-200/90 rounded-[2px] shadow-2xs">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">In Progress</span>
            <span className="font-serif-grand text-2xl text-blue-900 mt-1 block">{cleaningCount} Suites</span>
            <span className="text-[10px] font-mono text-slate-500">Active Cleaning Steps</span>
          </div>
          <div className="p-4 bg-white border border-slate-200/90 rounded-[2px] shadow-2xs">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Certified Ready</span>
            <span className="font-serif-grand text-2xl text-emerald-900 mt-1 block">{readyCount} Suites</span>
            <span className="text-[10px] font-mono text-emerald-700">Available on PMS</span>
          </div>
          <div className="p-4 bg-white border border-slate-200/90 rounded-[2px] shadow-2xs">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">In-Stay Requests</span>
            <span className="font-serif-grand text-2xl text-amber-900 mt-1 block">{pendingRequestsCount} Pending</span>
            <span className="text-[10px] font-mono text-slate-500">Guest Service Orders</span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('CLEANING')}
            className={`px-5 py-3 text-xs font-mono uppercase font-bold tracking-wider cursor-pointer border-b-2 transition-all ${
              activeTab === 'CLEANING'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Turnover Queue ({rooms.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('REQUESTS')}
            className={`px-5 py-3 text-xs font-mono uppercase font-bold tracking-wider cursor-pointer border-b-2 transition-all ${
              activeTab === 'REQUESTS'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Guest Requests ({pendingRequestsCount} Pending)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('MAINTENANCE')}
            className={`px-5 py-3 text-xs font-mono uppercase font-bold tracking-wider cursor-pointer border-b-2 transition-all ${
              activeTab === 'MAINTENANCE'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Maintenance Tickets ({maintenanceTickets.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('SUPPLIES')}
            className={`px-5 py-3 text-xs font-mono uppercase font-bold tracking-wider cursor-pointer border-b-2 transition-all ${
              activeTab === 'SUPPLIES'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Supplies &amp; Linens ({inventory.length || 7})
          </button>
        </div>

        {/* Views */}
        {activeTab === 'CLEANING' && (
          <CleaningQueue
            rooms={rooms}
            onToggleTask={updateCleaningTask}
            onCertifyReady={certifyRoomReady}
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

      {/* Maintenance Logger Modal */}
      <NewTicketModal
        isOpen={isNewTicketModalOpen}
        onClose={() => setIsNewTicketModalOpen(false)}
        rooms={rooms}
        onSubmitTicket={handleLogTicket}
      />
    </div>
  )
}
