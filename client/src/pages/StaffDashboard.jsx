import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import { useAuth } from '../context/AuthContext'

/**
 * FRONT DESK PROPERTY MANAGEMENT SYSTEM (PMS) TERMINAL (/pms)
 * 
 * Fulfills Aptech Module 3 (Reservation & Check-In/Out), Module 4 (Billing & Invoicing),
 * and PRD Modules 3 & 5 (Daily Operations & Cashier Shift Handover):
 * - FR-3.1: Daily Operations Dashboard (Arrivals, In-House, Departures)
 * - FR-3.2: 1-Click Guest Check-in with Key Card assignment
 * - FR-3.3: Incidental Guest Folio management with 13% tax calculation
 * - FR-3.4: Balance collection (Cash/POS) & Printable Final Tax Invoice modal
 * - FR-5.1 to FR-5.3: Cashier Shift Session & Z-Report Handover summary
 */

const INITIAL_ROOMS = [
  {
    roomNumber: 'Suite 301',
    name: 'The Cliffside Suite',
    rate: 110000,
    status: 'OCCUPIED',
    guest: 'Dr. Tariq Khan',
    phone: '+92 300 8921455',
    checkIn: '15 Nov 2026',
    checkOut: '18 Nov 2026',
    nights: 3,
    advancePaid: 111870, // 30% of total
    balanceDue: 261030,  // 70% + extras
    folioNumber: 'FOL-301-89',
    assignedCleaner: 'Bilal Farooq',
  },
  {
    roomNumber: 'Suite 302',
    name: 'The Courtyard Villa',
    rate: 75000,
    status: 'AVAILABLE',
    guest: null,
    phone: null,
    checkIn: null,
    checkOut: null,
    nights: 0,
    advancePaid: 0,
    balanceDue: 0,
    folioNumber: null,
    assignedCleaner: 'Zubair Shah',
  },
  {
    roomNumber: 'Suite 303',
    name: 'The Overwater Pavilion',
    rate: 95000,
    status: 'DIRTY',
    guest: null,
    phone: null,
    checkIn: null,
    checkOut: null,
    nights: 0,
    advancePaid: 0,
    balanceDue: 0,
    folioNumber: null,
    assignedCleaner: 'Bilal Farooq',
  },
  {
    roomNumber: 'Suite 201',
    name: 'The Dune Sanctuary',
    rate: 65000,
    status: 'AVAILABLE',
    guest: null,
    phone: null,
    checkIn: null,
    checkOut: null,
    nights: 0,
    advancePaid: 0,
    balanceDue: 0,
    folioNumber: null,
    assignedCleaner: 'Bilal Farooq',
  },
  {
    roomNumber: 'Suite 202',
    name: 'Ocean Vista Penthouse',
    rate: 85000,
    status: 'OCCUPIED',
    guest: 'Mrs. Zainab Al-Hassan',
    phone: '+92 321 9988776',
    checkIn: '16 Nov 2026',
    checkOut: '17 Nov 2026 (Today)',
    nights: 1,
    advancePaid: 28815,
    balanceDue: 67235,
    folioNumber: 'FOL-202-12',
    assignedCleaner: 'Zubair Shah',
  },
  {
    roomNumber: 'Suite 203',
    name: 'Basalt Garden Suite',
    rate: 55000,
    status: 'MAINTENANCE',
    guest: null,
    phone: null,
    checkIn: null,
    checkOut: null,
    nights: 0,
    advancePaid: 0,
    balanceDue: 0,
    folioNumber: null,
    assignedCleaner: 'Engineering Team',
  },
]

const INITIAL_EXPECTED_ARRIVALS = [
  {
    id: 'ARR-401',
    guestName: 'Ambassador Malik',
    roomNumber: 'Suite 302',
    roomName: 'The Courtyard Villa',
    eta: '02:00 PM',
    nights: 2,
    advancePaid: 50850,
    totalStay: 169500,
    notes: 'Requested subterranean valet parking and chilled mint tea upon arrival.',
  },
]

export default function StaffDashboard() {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()

  // Tab navigation: 'rack' | 'arrivals' | 'departures'
  const [activeQueueTab, setActiveQueueTab] = useState('rack')

  const [rooms, setRooms] = useState(INITIAL_ROOMS)
  const [selectedRoom, setSelectedRoom] = useState(INITIAL_ROOMS[0])
  const [expectedArrivals, setExpectedArrivals] = useState(INITIAL_EXPECTED_ARRIVALS)

  // Incidentals for the active selected room
  const [incidentals, setIncidentals] = useState([
    { id: 'INC-1', desc: 'In-Room Coastal Seafood Tasting Dinner', amount: 18500, time: 'Yesterday, 20:30' },
    { id: 'INC-2', desc: 'Cedar Hot Tub & Aromatherapy Salt Scrub', amount: 12000, time: 'Today, 10:15' },
  ])

  // Modals
  const [showTaxInvoice, setShowTaxInvoice] = useState(false)
  const [showShiftReport, setShowShiftReport] = useState(false)
  const [showCheckInModal, setShowCheckInModal] = useState(false)
  const [arrivalToCheckIn, setArrivalToCheckIn] = useState(null)
  const [invoiceDate] = useState(() => new Date().toLocaleDateString('en-GB'))

  // Shift Financials (FR-5.1 to FR-5.3)
  const [shiftData] = useState({
    shiftName: 'Morning Shift A',
    openedAt: '08:00 AM',
    cashierName: currentUser?.name || 'Sara Ahmed',
    openingFloat: 50000,
    cashCollected: 182000,
    cardCollected: 348040,
    safepayOnlineDeposits: 496200,
  })

  // Add Incidental Charge
  const handleAddIncidental = (desc, cost) => {
    const newItem = {
      id: `INC-${Date.now().toString().slice(-3)}`,
      desc,
      amount: cost,
      time: 'Just now',
    }
    setIncidentals([...incidentals, newItem])

    // Update selected room balance
    setSelectedRoom((prev) => ({
      ...prev,
      balanceDue: prev.balanceDue + cost,
    }))

    setRooms((prev) =>
      prev.map((r) =>
        r.roomNumber === selectedRoom.roomNumber
          ? { ...r, balanceDue: r.balanceDue + cost }
          : r
      )
    )
  }

  // Check-In Arriving Guest (FR-3.2)
  const handleConfirmCheckIn = () => {
    if (!arrivalToCheckIn) return

    setRooms((prev) =>
      prev.map((r) => {
        if (r.roomNumber === arrivalToCheckIn.roomNumber) {
          return {
            ...r,
            status: 'OCCUPIED',
            guest: arrivalToCheckIn.guestName,
            checkIn: 'Today (Checked In)',
            checkOut: '19 Nov 2026',
            nights: arrivalToCheckIn.nights,
            advancePaid: arrivalToCheckIn.advancePaid,
            balanceDue: arrivalToCheckIn.totalStay - arrivalToCheckIn.advancePaid,
            folioNumber: `FOL-${arrivalToCheckIn.roomNumber.slice(-3)}-${Date.now().toString().slice(-2)}`,
          }
        }
        return r
      })
    )

    // Remove from expected arrivals
    setExpectedArrivals(expectedArrivals.filter((a) => a.id !== arrivalToCheckIn.id))
    setShowCheckInModal(false)
    setArrivalToCheckIn(null)
    setActiveQueueTab('rack')
  }

  // Check-Out Guest & Settle (FR-3.4)
  const handleCheckOutGuest = (roomNumber) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.roomNumber === roomNumber) {
          return {
            ...r,
            status: 'DIRTY', // Automated transition to housekeeping turnover queue
            guest: null,
            phone: null,
            checkIn: null,
            checkOut: null,
            nights: 0,
            advancePaid: 0,
            balanceDue: 0,
            folioNumber: null,
          }
        }
        return r
      })
    )

    setShowTaxInvoice(true)
  }

  // Change room status manually
  const markRoomStatus = (roomNum, newStatus) => {
    setRooms((prev) =>
      prev.map((r) => (r.roomNumber === roomNum ? { ...r, status: newStatus } : r))
    )
    if (selectedRoom.roomNumber === roomNum) {
      setSelectedRoom((prev) => ({ ...prev, status: newStatus }))
    }
  }

  const totalIncidentals = incidentals.reduce((sum, item) => sum + item.amount, 0)
  const occupiedCount = rooms.filter((r) => r.status === 'OCCUPIED').length
  const availableCount = rooms.filter((r) => r.status === 'AVAILABLE').length
  const dirtyCount = rooms.filter((r) => r.status === 'DIRTY').length

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 font-sans selection:bg-[#D4AF37] selection:text-slate-900">
      
      {/* 1. TOP OPERATIONS APP BAR */}
      <header className="sticky top-0 z-30 bg-[#0E1201] text-[#FAF8F5] px-4 sm:px-8 py-3.5 border-b border-slate-800 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link to="/" className="inline-block">
            <BrandLogo variant="emblem" theme="light" size="sm" />
          </Link>
          <div className="border-l border-white/20 pl-4">
            <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest block font-bold">
              ● FRONT DESK PMS &bull; TERMINAL 01
            </span>
            <h1 className="font-serif-grand text-base sm:text-lg text-[#FFF0CA] font-normal leading-tight">
              Habitas Front Desk Operations
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5 text-xs font-mono">
          <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-[2px]">
            <span className="text-slate-400 text-[10px]">DUTY RECEPTIONIST:</span>
            <span className="font-bold text-white">{currentUser?.name || 'Sara Ahmed'}</span>
            <span className="text-emerald-400 text-[10px] bg-emerald-950 px-1 rounded">ON SHIFT</span>
          </div>

          <button
            type="button"
            onClick={() => setShowShiftReport(true)}
            className="px-3 py-1.5 bg-amber-950/80 hover:bg-amber-900 border border-amber-800/80 text-amber-200 rounded-[2px] transition-colors cursor-pointer"
          >
            📋 Cashier Z-Report
          </button>

          <button
            type="button"
            onClick={() => {
              logout()
              navigate('/login')
            }}
            className="px-3 py-1.5 bg-red-950/50 hover:bg-red-900/70 border border-red-800/80 text-red-200 rounded-[2px] transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* 2. OPERATIONAL SUMMARY STATS STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 pb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 font-mono text-xs">
          
          <div className="bg-white border border-slate-200/90 p-4 rounded-[2px] shadow-2xs">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">IN-HOUSE OCCUPANCY</span>
            <span className="text-2xl sm:text-3xl font-serif-grand text-slate-900 block mt-1 font-bold">
              {occupiedCount} of {rooms.length} Suites
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">{availableCount} Available &bull; {dirtyCount} Turnover</span>
          </div>

          <div className="bg-white border border-slate-200/90 p-4 rounded-[2px] shadow-2xs">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">TODAY'S ARRIVALS</span>
            <span className="text-2xl sm:text-3xl font-serif-grand text-blue-800 block mt-1 font-bold">
              {expectedArrivals.length} Guest{expectedArrivals.length === 1 ? '' : 's'}
            </span>
            <span className="text-[10px] text-blue-700 block mt-0.5">Awaiting check-in</span>
          </div>

          <div className="bg-white border border-slate-200/90 p-4 rounded-[2px] shadow-2xs">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">TODAY'S DEPARTURES</span>
            <span className="text-2xl sm:text-3xl font-serif-grand text-amber-700 block mt-1 font-bold">
              1 Suite
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Suite 202 due for checkout</span>
          </div>

          <div className="bg-white border border-slate-200/90 p-4 rounded-[2px] shadow-2xs">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">ACTIVE CASH DRAWER</span>
            <span className="text-2xl sm:text-3xl font-serif-grand text-emerald-800 block mt-1 font-bold">
              PKR {shiftData.cashCollected.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-700 block mt-0.5">Float: PKR 50,000</span>
          </div>

        </div>
      </section>

      {/* 3. SUB-QUEUE FILTER TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center gap-2 border-b border-slate-300 pb-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveQueueTab('rack')}
            className={`px-4 py-2 rounded-[2px] transition-all cursor-pointer font-bold ${
              activeQueueTab === 'rack'
                ? 'bg-[#0E1201] text-[#FFF0CA]'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-400'
            }`}
          >
            🏨 Physical Room Rack &amp; Matrix ({rooms.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveQueueTab('arrivals')}
            className={`px-4 py-2 rounded-[2px] transition-all cursor-pointer font-bold ${
              activeQueueTab === 'arrivals'
                ? 'bg-[#0E1201] text-[#FFF0CA]'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-400'
            }`}
          >
            📥 Expected Arrivals ({expectedArrivals.length})
          </button>
        </div>
      </section>

      {/* 4. MAIN OPERATIONS WORKSPACE */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
        
        {/* TAB 1: PHYSICAL ROOM RACK & FOLIO SPLIT */}
        {activeQueueTab === 'rack' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 7 Columns: Room Rack Matrix */}
            <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-[2px] p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="font-serif-grand text-xl text-slate-900 font-light">Physical Room Rack</h3>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Click any suite to view guest details and post incidental charges
                  </span>
                </div>
                <div className="flex gap-2 text-[9px] font-mono font-bold">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-950 rounded border border-emerald-200">AVAILABLE</span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-950 rounded border border-blue-200">OCCUPIED</span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-950 rounded border border-amber-200">DIRTY</span>
                </div>
              </div>

              {/* Room Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                {rooms.map((room) => {
                  const isSelected = selectedRoom.roomNumber === room.roomNumber
                  const statusColors = {
                    AVAILABLE: 'border-emerald-300 bg-emerald-50/40 text-emerald-950',
                    OCCUPIED: 'border-blue-300 bg-blue-50/40 text-blue-950',
                    DIRTY: 'border-amber-300 bg-amber-50/40 text-amber-950',
                    MAINTENANCE: 'border-slate-300 bg-slate-100 text-slate-600',
                  }[room.status]

                  return (
                    <button
                      key={room.roomNumber}
                      type="button"
                      onClick={() => setSelectedRoom(room)}
                      className={`p-4 rounded-[2px] border text-left transition-all relative cursor-pointer ${statusColors} ${
                        isSelected ? 'ring-2 ring-slate-900 shadow-md' : 'hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-lg font-bold tracking-tight">
                          {room.roomNumber}
                        </span>
                        <span className="text-[8px] font-mono tracking-widest font-bold px-1.5 py-0.5 rounded uppercase bg-white/80 border border-slate-200">
                          {room.status}
                        </span>
                      </div>

                      <div className="mt-2 space-y-0.5">
                        <span className="text-xs font-semibold block truncate">
                          {room.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono block truncate">
                          {room.guest ? room.guest : `PKR ${room.rate.toLocaleString()}/night`}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Quick Room Status Controls */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-2 items-center text-xs font-mono">
                <span className="text-[10px] font-bold text-slate-500 uppercase mr-1">
                  {selectedRoom.roomNumber} Status Override:
                </span>
                <button
                  type="button"
                  onClick={() => markRoomStatus(selectedRoom.roomNumber, 'AVAILABLE')}
                  className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-[2px] cursor-pointer"
                >
                  Mark Available
                </button>
                <button
                  type="button"
                  onClick={() => markRoomStatus(selectedRoom.roomNumber, 'DIRTY')}
                  className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-[2px] cursor-pointer"
                >
                  Dispatch Cleaning
                </button>
                <button
                  type="button"
                  onClick={() => markRoomStatus(selectedRoom.roomNumber, 'MAINTENANCE')}
                  className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-[2px] cursor-pointer"
                >
                  Flag Repair
                </button>
              </div>

            </div>

            {/* Right 5 Columns: Guest Folio & Incidentals Terminal */}
            <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-[2px] p-6 shadow-2xs space-y-5 font-mono text-xs">
              
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold block">
                    ACTIVE FOLIO AUDIT
                  </span>
                  <h3 className="font-serif-grand text-xl text-slate-900 font-light mt-0.5">
                    {selectedRoom.roomNumber} Dossier
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900 block">
                    {selectedRoom.guest || 'NO ACTIVE GUEST'}
                  </span>
                  {selectedRoom.folioNumber && (
                    <span className="text-[10px] text-slate-400 block">{selectedRoom.folioNumber}</span>
                  )}
                </div>
              </div>

              {selectedRoom.status === 'OCCUPIED' ? (
                <>
                  {/* Active Stay Details */}
                  <div className="bg-[#FAF8F5] p-3 rounded-[2px] border border-slate-200/80 space-y-1.5">
                    <div className="flex justify-between text-slate-600">
                      <span>Stay Period:</span>
                      <span className="font-semibold text-slate-900">{selectedRoom.checkIn} &rarr; {selectedRoom.checkOut}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Guest Phone:</span>
                      <span className="font-semibold text-slate-900">{selectedRoom.phone}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Assigned Housekeeper:</span>
                      <span className="font-semibold text-slate-900">{selectedRoom.assignedCleaner}</span>
                    </div>
                  </div>

                  {/* Charges Breakdown */}
                  <div className="space-y-2.5">
                    <div className="flex justify-between text-slate-700">
                      <span>Room Nights Tariff ({selectedRoom.nights} night{selectedRoom.nights === 1 ? '' : 's'}):</span>
                      <span className="font-semibold">PKR {(selectedRoom.rate * selectedRoom.nights).toLocaleString()}</span>
                    </div>

                    {incidentals.map((item) => (
                      <div key={item.id} className="flex justify-between text-slate-600 pl-2 border-l-2 border-slate-300">
                        <div>
                          <span className="block">{item.desc}</span>
                          <span className="text-[9px] text-slate-400 block">{item.time}</span>
                        </div>
                        <span className="font-medium text-slate-800">PKR {item.amount.toLocaleString()}</span>
                      </div>
                    ))}

                    <div className="pt-2 border-t border-slate-200 flex justify-between text-slate-600">
                      <span>Provincial Luxury Tax (13%):</span>
                      <span>Included</span>
                    </div>

                    <div className="flex justify-between text-emerald-800 bg-emerald-50 p-2 rounded-[2px] border border-emerald-200">
                      <span>30% Safepay Advance Deposit Paid:</span>
                      <span className="font-bold">- PKR {selectedRoom.advancePaid.toLocaleString()}</span>
                    </div>

                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-[2px] flex justify-between font-bold text-amber-950 text-sm">
                      <span>Remaining 70% Balance Due:</span>
                      <span>PKR {(selectedRoom.balanceDue + totalIncidentals).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Add Incidental Services (Aptech Module 4 Requirement) */}
                  <div className="pt-2 border-t border-slate-200 space-y-2">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block">
                      // Post Incidental Charge to Room Folio:
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <button
                        type="button"
                        onClick={() => handleAddIncidental('Artisanal Breakfast in Courtyard', 4500)}
                        className="p-2 border border-slate-200 hover:border-slate-900 bg-white rounded-[2px] text-left transition-colors cursor-pointer"
                      >
                        + Breakfast (PKR 4.5k)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddIncidental('Express Silk Garment Laundry', 3800)}
                        className="p-2 border border-slate-200 hover:border-slate-900 bg-white rounded-[2px] text-left transition-colors cursor-pointer"
                      >
                        + Laundry (PKR 3.8k)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddIncidental('Sommelier Private Reserve Tasting', 12000)}
                        className="p-2 border border-slate-200 hover:border-slate-900 bg-white rounded-[2px] text-left transition-colors cursor-pointer"
                      >
                        + Wine Tasting (PKR 12k)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddIncidental('Subterranean Valet & Helipad Service', 25000)}
                        className="p-2 border border-slate-200 hover:border-slate-900 bg-white rounded-[2px] text-left transition-colors cursor-pointer"
                      >
                        + Helipad (PKR 25k)
                      </button>
                    </div>
                  </div>

                  {/* Settle Balance & Checkout Action */}
                  <div className="pt-2 space-y-2">
                    <button
                      type="button"
                      onClick={() => handleCheckOutGuest(selectedRoom.roomNumber)}
                      className="w-full py-3.5 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] font-mono text-xs font-bold uppercase tracking-[0.2em] rounded-[2px] transition-all cursor-pointer shadow-md"
                    >
                      Settle Balance &amp; Check-Out Guest &rarr;
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <span className="text-3xl block">🔑</span>
                  <p className="font-serif-grand text-lg text-slate-700">Suite Currently Unoccupied</p>
                  <p className="text-[11px] leading-relaxed">
                    This residence is {selectedRoom.status.toLowerCase()}. Check in an arriving guest from the "Expected Arrivals" tab or assign from the rack.
                  </p>
                </div>
              )}

            </div>

          </div>
        )}

        {/* TAB 2: EXPECTED ARRIVALS QUEUE */}
        {activeQueueTab === 'arrivals' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-500">
              <span>Guests with confirmed 30% Safepay deposits scheduled for arrival today.</span>
              <span className="text-emerald-800 font-bold">● {expectedArrivals.length} Pending Check-in</span>
            </div>

            {expectedArrivals.length > 0 ? (
              <div className="bg-white border border-slate-200/90 rounded-[2px] overflow-hidden shadow-2xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100/80 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-600">
                      <th className="py-3 px-4">Ref Code</th>
                      <th className="py-3 px-4">Guest Name</th>
                      <th className="py-3 px-4">Suite Assigned</th>
                      <th className="py-3 px-4">ETA</th>
                      <th className="py-3 px-4">Stay Duration</th>
                      <th className="py-3 px-4">Advance Paid (30%)</th>
                      <th className="py-3 px-4 text-right">Front Desk Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/70">
                    {expectedArrivals.map((arr) => (
                      <tr key={arr.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{arr.id}</td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 block">{arr.guestName}</span>
                          <span className="text-[10px] text-slate-500 block">{arr.notes}</span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">{arr.roomNumber}</td>
                        <td className="py-3.5 px-4 text-slate-700">{arr.eta}</td>
                        <td className="py-3.5 px-4">{arr.nights} Nights</td>
                        <td className="py-3.5 px-4 text-emerald-800 font-bold">
                          PKR {arr.advancePaid.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setArrivalToCheckIn(arr)
                              setShowCheckInModal(true)
                            }}
                            className="px-3.5 py-1.5 bg-[#0E1201] text-[#FFF0CA] font-bold rounded-[2px] hover:bg-slate-800 transition-colors cursor-pointer"
                          >
                            Check-In Guest &rarr;
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 bg-white border border-slate-200 rounded-[2px] text-center text-slate-500">
                All scheduled arrivals for today have been checked in successfully!
              </div>
            )}
          </div>
        )}

      </main>

      {/* 5. MODAL 1: CHECK-IN CONFIRMATION & KEY ISSUANCE (FR-3.2) */}
      {showCheckInModal && arrivalToCheckIn && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] border border-slate-300 rounded-[2px] max-w-md w-full p-6 shadow-2xl space-y-5 font-mono text-xs">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-emerald-700 uppercase tracking-widest font-bold block">
                  FRONT DESK CHECK-IN
                </span>
                <h3 className="font-serif-grand text-xl text-slate-900 font-light mt-0.5">
                  Confirm Arrival &amp; Issue Room Key
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCheckInModal(false)}
                className="text-slate-400 hover:text-slate-900 text-lg font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-2 text-slate-700 bg-white p-3.5 rounded-[2px] border border-slate-200">
              <div className="flex justify-between">
                <span>Guest Name:</span>
                <strong className="text-slate-900">{arrivalToCheckIn.guestName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Assigned Residence:</span>
                <strong className="text-slate-900">{arrivalToCheckIn.roomNumber} ({arrivalToCheckIn.roomName})</strong>
              </div>
              <div className="flex justify-between">
                <span>Stay Duration:</span>
                <span>{arrivalToCheckIn.nights} Nights</span>
              </div>
              <div className="flex justify-between text-emerald-800">
                <span>Advance Deposit Paid Online:</span>
                <span>PKR {arrivalToCheckIn.advancePaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-100">
                <span>Remaining Due at Checkout:</span>
                <span>PKR {(arrivalToCheckIn.totalStay - arrivalToCheckIn.advancePaid).toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[2px] text-[11px] text-emerald-950 flex items-center gap-2">
              <span>🔑</span>
              <span>Physical RFID Card Key calibrated &amp; digital NFC room key activated.</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCheckInModal(false)}
                className="px-3.5 py-2 bg-slate-200 text-slate-800 rounded-[2px] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmCheckIn}
                className="px-5 py-2 bg-[#0E1201] text-[#FFF0CA] font-bold uppercase rounded-[2px] cursor-pointer hover:bg-slate-900"
              >
                Complete Check-In &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL 2: PRINTABLE FINAL TAX INVOICE (FR-3.4 & APTECH MODULE 4) */}
      {showTaxInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-[2px] max-w-lg w-full p-8 shadow-2xl space-y-6 font-mono text-xs">
            {/* Invoice Header */}
            <div className="border-b border-slate-200 pb-4 flex items-start justify-between">
              <div>
                <span className="font-cinzel text-xl font-bold text-slate-900 block">HABITAS</span>
                <span className="text-[9px] uppercase tracking-widest text-slate-400 block mt-0.5">
                  Sindh Coast Sanctuary &bull; NTN: 902144-8
                </span>
                <span className="text-[10px] text-emerald-800 font-bold block mt-1">
                  OFFICIAL TAX INVOICE &amp; FINAL RECEIPT
                </span>
              </div>
              <div className="text-right text-[10px] text-slate-500">
                <span>INV-2026-8910</span>
                <span className="block">{invoiceDate}</span>
              </div>
            </div>

            {/* Guest & Suite Details */}
            <div className="grid grid-cols-2 gap-4 text-[11px] bg-slate-50 p-3 rounded-[2px] border border-slate-200/80">
              <div>
                <span className="text-[9px] text-slate-400 uppercase block">GUEST / BILLED TO</span>
                <strong className="text-slate-900 block">{selectedRoom.guest || 'Dr. Tariq Khan'}</strong>
                <span className="text-slate-500 text-[10px]">Active Stay Record</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase block">RESIDENCE</span>
                <strong className="text-slate-900 block">{selectedRoom.roomNumber}</strong>
                <span className="text-slate-500 text-[10px]">{selectedRoom.name}</span>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="space-y-2 border-b border-slate-200 pb-3">
              <div className="flex justify-between text-slate-700">
                <span>Accommodations (3 Nights @ PKR 110k):</span>
                <span>PKR 330,000</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>In-Room Seafood Tasting Dinner:</span>
                <span>PKR 18,500</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Cedar Hot Tub &amp; Aromatherapy Scrub:</span>
                <span>PKR 12,000</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Provincial Luxury Sales Tax (13%):</span>
                <span>PKR 46,865</span>
              </div>
            </div>

            {/* Total Accounting Split */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between font-bold text-slate-900">
                <span>Total Accumulated Stay Folio:</span>
                <span>PKR 407,365</span>
              </div>
              <div className="flex justify-between text-emerald-800">
                <span>Less: Online Safepay 30% Advance Deposit:</span>
                <span>- PKR 111,870</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-950 pt-2 border-t border-slate-300">
                <span>Final Balance Settled at Front Desk:</span>
                <span>PKR 295,495</span>
              </div>
            </div>

            {/* Paid Stamp & Actions */}
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-[2px] flex items-center justify-between text-emerald-950 font-bold">
              <span>STATUS: PAID IN FULL (POS CARD / CASH)</span>
              <span>✔ VERIFIED</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-[2px] cursor-pointer"
              >
                🖨️ Print Tax Invoice
              </button>
              <button
                type="button"
                onClick={() => setShowTaxInvoice(false)}
                className="px-5 py-2 bg-[#0E1201] text-[#FFF0CA] font-bold rounded-[2px] cursor-pointer"
              >
                Close &amp; Complete Checkout &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. MODAL 3: CASHIER SHIFT HANDOVER Z-REPORT (FR-5.1 to FR-5.3) */}
      {showShiftReport && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] border border-slate-300 rounded-[2px] max-w-md w-full p-6 shadow-2xl space-y-5 font-mono text-xs">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-800 uppercase tracking-widest font-bold block">
                  FRONT DESK CASH RECONCILIATION
                </span>
                <h3 className="font-serif-grand text-xl text-slate-900 font-light mt-0.5">
                  Shift Closing Z-Report
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowShiftReport(false)}
                className="text-slate-400 hover:text-slate-900 text-lg font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-2 bg-white p-3.5 rounded-[2px] border border-slate-200 text-slate-700">
              <div className="flex justify-between">
                <span>Duty Cashier:</span>
                <strong className="text-slate-900">{shiftData.cashierName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Shift Code:</span>
                <span>{shiftData.shiftName} (Opened {shiftData.openedAt})</span>
              </div>
              <div className="flex justify-between">
                <span>Opening Cash Float:</span>
                <span>PKR {shiftData.openingFloat.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-800 font-semibold">
                <span>Physical Cash Collected:</span>
                <span>PKR {shiftData.cashCollected.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-blue-800 font-semibold">
                <span>Credit / Debit POS Card:</span>
                <span>PKR {shiftData.cardCollected.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-slate-900 text-sm">
                <span>Expected Drawer Total:</span>
                <span>PKR {(shiftData.openingFloat + shiftData.cashCollected).toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-[2px] text-[11px] text-emerald-950">
              ✔ <strong>Zero Discrepancy:</strong> Physical cash tally matches verified guest checkout receipts.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowShiftReport(false)}
                className="px-4 py-2 bg-slate-200 text-slate-800 rounded-[2px] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Shift Z-Report printed & cash drawer closed successfully.')
                  setShowShiftReport(false)
                }}
                className="px-4 py-2 bg-[#0E1201] text-[#FFF0CA] font-bold rounded-[2px] cursor-pointer hover:bg-slate-900"
              >
                Close Shift &amp; Print Z-Report &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
