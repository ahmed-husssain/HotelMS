import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import { useAuth } from '../context/AuthContext'
import { useHotelData } from '../context/HotelDataContext'
import AnalyticsReport from '../components/admin/AnalyticsReport'
import StaffList from '../components/admin/StaffList'
import GuestList from '../components/admin/GuestList'
import RoomPricing from '../components/admin/RoomPricing'
import HotelSettings from '../components/admin/HotelSettings'
import ActivityLog from '../components/admin/ActivityLog'

export default function AdminPage() {
  const { currentUser, staffAccounts, createStaffAccount, toggleStaffStatus, logout } = useAuth()
  const {
    rooms,
    systemSettings,
    auditLogs,
    updateRoomRate,
    toggleRoomMaintenance,
    updateSettings,
  } = useHotelData()

  // Navigation Tabs: 'ANALYTICS' | 'STAFF' | 'GUESTS' | 'RESIDENCES' | 'SETTINGS' | 'AUDIT'
  const [activeTab, setActiveTab] = useState('ANALYTICS')

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 font-sans-clean antialiased selection:bg-emerald-100 selection:text-emerald-950">
      {/* 1. TOP EXECUTIVE HEADER */}
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
            <span>GENERAL MANAGER EXECUTIVE CONSOLE</span>
          </div>
        </div>

        <BrandLogo variant="wordmark" theme="dark" size="sm" />

        <div className="flex items-center gap-3">
          <Link
            to="/reception"
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors"
          >
            Reception &rarr;
          </Link>

          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-300 text-xs font-mono">
            <span className="text-slate-500">{currentUser?.name || 'Karim Mansoor'} (GM)</span>
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

      {/* 2. MAIN EXECUTIVE WORKSPACE */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 overflow-x-auto text-xs font-mono">
          {[
            { id: 'ANALYTICS', label: 'Executive Analytics' },
            { id: 'STAFF', label: `Staff Governance (${staffAccounts?.length || 0})` },
            { id: 'GUESTS', label: 'Guest Directory' },
            { id: 'RESIDENCES', label: 'Tariffs & Inventory' },
            { id: 'SETTINGS', label: 'Tax & Settings' },
            { id: 'AUDIT', label: 'Activity Log' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 uppercase font-bold tracking-wider whitespace-nowrap cursor-pointer border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modular Views */}
        {activeTab === 'ANALYTICS' && <AnalyticsReport rooms={rooms} />}

        {activeTab === 'STAFF' && (
          <StaffList
            staffAccounts={staffAccounts}
            onCreateStaff={createStaffAccount}
            onToggleStatus={toggleStaffStatus}
          />
        )}

        {activeTab === 'GUESTS' && <GuestList />}

        {activeTab === 'RESIDENCES' && (
          <RoomPricing
            rooms={rooms}
            onUpdateRate={updateRoomRate}
            onToggleMaintenance={toggleRoomMaintenance}
          />
        )}

        {activeTab === 'SETTINGS' && (
          <HotelSettings
            systemSettings={systemSettings}
            onSaveSettings={updateSettings}
          />
        )}

        {activeTab === 'AUDIT' && <ActivityLog auditLogs={auditLogs} />}
      </main>
    </div>
  )
}
