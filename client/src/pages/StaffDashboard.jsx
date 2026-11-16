import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'

const INITIAL_ROOMS = [
  { roomNumber: '301', type: 'Presidential Penthouse', rate: 110000, status: 'OCCUPIED', guest: 'Dr. Tariq Khan', folio: 497200, balance: 348040 },
  { roomNumber: '204', type: 'Garden Villa', rate: 75000, status: 'AVAILABLE', guest: null, folio: 0, balance: 0 },
  { roomNumber: '102', type: 'Ocean Pavilion', rate: 95000, status: 'DIRTY', guest: null, folio: 0, balance: 0 },
  { roomNumber: '101', type: 'Executive Suite', rate: 65000, status: 'AVAILABLE', guest: null, folio: 0, balance: 0 },
  { roomNumber: '201', type: 'Deluxe Suite', rate: 50000, status: 'MAINTENANCE', guest: null, folio: 0, balance: 0 },
  { roomNumber: '202', type: 'Deluxe Suite', rate: 50000, status: 'OCCUPIED', guest: 'Sara Ahmed', folio: 226000, balance: 158200 },
]

export default function StaffDashboard() {
  const [rooms, setRooms] = useState(INITIAL_ROOMS)
  const [selectedRoom, setSelectedRoom] = useState(INITIAL_ROOMS[0])
  const [extraItems, setExtraItems] = useState([
    { description: 'In-Room Dining (Kobe & White Truffle)', amount: 18500, time: '14:20' },
    { description: 'Hinoki Hydrotherapy Soak Service', amount: 12000, time: '16:00' },
  ])

  const addFolioCharge = (desc, cost) => {
    setExtraItems((prev) => [...prev, { description: desc, amount: cost, time: 'Just now' }])
    setSelectedRoom((prev) => ({
      ...prev,
      balance: prev.balance + cost,
      folio: prev.folio + cost,
    }))
  }

  const markRoomStatus = (roomNum, newStatus) => {
    setRooms((prev) =>
      prev.map((r) => (r.roomNumber === roomNum ? { ...r, status: newStatus } : r))
    )
    if (selectedRoom.roomNumber === roomNum) {
      setSelectedRoom((prev) => ({ ...prev, status: newStatus }))
    }
  }

  const totalFolioExtra = extraItems.reduce((acc, curr) => acc + curr.amount, 0)

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 font-sans-clean">
      {/* Staff Top Nav */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BrandLogo variant="full" theme="dark" size="sm" />
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] tracking-[0.18em] font-bold rounded">
            FRONT-DESK TERMINAL #01
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-600">
          <span>Active Cashier: <strong>Syed Hamza (Shift A)</strong></span>
          <Link
            to="/"
            className="tactile px-3.5 py-1.5 bg-slate-900 text-white text-[10px] tracking-[0.15em] font-bold rounded"
          >
            VIEW GUEST LANDING &rarr;
          </Link>
        </div>
      </header>

      {/* Main Terminal View */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Status Bar / Shift Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white border border-slate-200 rounded-xs shadow-xs">
            <span className="text-[9px] tracking-[0.2em] text-slate-400 font-bold uppercase block">
              TOTAL INVENTORY
            </span>
            <span className="text-2xl font-bold text-slate-900">6 Rooms</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">3 Available &bull; 2 Occupied</span>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xs shadow-xs">
            <span className="text-[9px] tracking-[0.2em] text-slate-400 font-bold uppercase block">
              OCCUPANCY RATE
            </span>
            <span className="text-2xl font-bold text-emerald-800">40.0%</span>
            <span className="text-[10px] text-emerald-700 block mt-0.5">&uarr; 12% vs yesterday</span>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xs shadow-xs">
            <span className="text-[9px] tracking-[0.2em] text-slate-400 font-bold uppercase block">
              ACTIVE CASH DRAWER
            </span>
            <span className="text-2xl font-bold text-slate-900">PKR 185,000</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Z-Report Shift Balance</span>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xs shadow-xs">
            <span className="text-[9px] tracking-[0.2em] text-slate-400 font-bold uppercase block">
              SAFEPAY ONLINE DEPOSITS
            </span>
            <span className="text-2xl font-bold text-emerald-900">PKR 496,200</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">2 Advance Holds Settled</span>
          </div>
        </div>

        {/* Room Rack & Folio Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Room Rack Grid (7 Cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xs p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-serif-grand text-xl text-slate-900">Physical Room Rack</h3>
                <span className="text-[10px] tracking-[0.15em] text-slate-400 uppercase">
                  Click a room to inspect active guest folio &amp; billing
                </span>
              </div>
              <div className="flex gap-2 text-[9px] tracking-[0.1em] font-bold">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-950 rounded">AVAIL</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-950 rounded">OCCUPIED</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-950 rounded">DIRTY</span>
              </div>
            </div>

            {/* Room Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {rooms.map((room) => {
                const isSelected = selectedRoom.roomNumber === room.roomNumber
                const statusStyles = {
                  AVAILABLE: 'border-emerald-300 bg-emerald-50/40 text-emerald-950',
                  OCCUPIED: 'border-blue-300 bg-blue-50/40 text-blue-950',
                  DIRTY: 'border-amber-300 bg-amber-50/40 text-amber-950',
                  MAINTENANCE: 'border-slate-300 bg-slate-100 text-slate-600',
                }[room.status]

                return (
                  <button
                    key={room.roomNumber}
                    onClick={() => setSelectedRoom(room)}
                    className={`tactile p-4 rounded-xs border text-left transition-all relative ${statusStyles} ${
                      isSelected ? 'ring-2 ring-slate-900 shadow-md' : 'hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xl font-bold tracking-tight">
                        {room.roomNumber}
                      </span>
                      <span className="text-[8px] tracking-[0.2em] font-extrabold px-1.5 py-0.5 rounded uppercase bg-white/80">
                        {room.status}
                      </span>
                    </div>

                    <div className="mt-2 space-y-0.5">
                      <span className="text-xs font-semibold block truncate">
                        {room.type}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {room.guest ? room.guest : `PKR ${room.rate.toLocaleString()}/n`}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Operational Quick Controls */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2 items-center text-xs">
              <span className="text-[10px] tracking-[0.15em] font-bold text-slate-500 uppercase mr-2">
                Room {selectedRoom.roomNumber} Actions:
              </span>
              <button
                onClick={() => markRoomStatus(selectedRoom.roomNumber, 'AVAILABLE')}
                className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-[10px] font-bold rounded"
              >
                Mark Clean &amp; Available
              </button>
              <button
                onClick={() => markRoomStatus(selectedRoom.roomNumber, 'DIRTY')}
                className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 text-[10px] font-bold rounded"
              >
                Mark Housekeeping Dirty
              </button>
              <button
                onClick={() => markRoomStatus(selectedRoom.roomNumber, 'MAINTENANCE')}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-[10px] font-bold rounded"
              >
                Flag Maintenance
              </button>
            </div>
          </div>

          {/* Guest Folio Billing Terminal (5 Cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xs p-6 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[9px] tracking-[0.2em] text-slate-400 font-bold uppercase block">
                  APTECH FOLIO AUDIT
                </span>
                <h3 className="font-serif-grand text-xl text-slate-900">
                  Room {selectedRoom.roomNumber} Guest Folio
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-600">
                {selectedRoom.guest || 'UNOCCUPIED'}
              </span>
            </div>

            {/* Billing Items Breakdown */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Base Room Nightly Accrual:</span>
                <span className="font-bold text-slate-900">
                  PKR {selectedRoom.rate.toLocaleString()}
                </span>
              </div>

              {extraItems.map((item, i) => (
                <div key={i} className="flex justify-between text-slate-600 pl-2 border-l-2 border-slate-200">
                  <div className="space-y-0.5">
                    <span>{item.description}</span>
                    <span className="text-[9px] text-slate-400 block">{item.time}</span>
                  </div>
                  <span className="font-semibold text-slate-800">
                    PKR {item.amount.toLocaleString()}
                  </span>
                </div>
              ))}

              <div className="pt-3 border-t border-slate-100 flex justify-between font-bold text-slate-900">
                <span>Total Accumulated Folio:</span>
                <span className="text-base text-emerald-950">
                  PKR {(selectedRoom.folio + totalFolioExtra).toLocaleString()}
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xs flex justify-between text-xs font-bold text-slate-800">
                <span>Remaining Balance Due:</span>
                <span className="text-amber-900">
                  PKR {(selectedRoom.balance + totalFolioExtra).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Add Extra Charges (Aptech Extra Services Requirement) */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[9px] tracking-[0.18em] font-bold text-slate-400 uppercase block">
                Post Additional Service Charge:
              </span>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                <button
                  onClick={() => addFolioCharge('Minibar (Crystal Reserve)', 7500)}
                  className="tactile p-2 border border-slate-200 hover:bg-slate-50 text-slate-800 rounded text-left"
                >
                  + Minibar (PKR 7.5k)
                </button>
                <button
                  onClick={() => addFolioCharge('Laundry (Express Silk Press)', 4200)}
                  className="tactile p-2 border border-slate-200 hover:bg-slate-50 text-slate-800 rounded text-left"
                >
                  + Laundry (PKR 4.2k)
                </button>
                <button
                  onClick={() => addFolioCharge('Sommelier Private Cellar', 15000)}
                  className="tactile p-2 border border-slate-200 hover:bg-slate-50 text-slate-800 rounded text-left"
                >
                  + Wine Cellar (PKR 15k)
                </button>
                <button
                  onClick={() => addFolioCharge('Airport Helipad Transfer', 35000)}
                  className="tactile p-2 border border-slate-200 hover:bg-slate-50 text-slate-800 rounded text-left"
                >
                  + Helipad (PKR 35k)
                </button>
              </div>
            </div>

            {/* Settle / Print Folio */}
            <div className="pt-2">
              <button
                onClick={() => alert(`Folio settled for Room ${selectedRoom.roomNumber}!\nReceipt sent to guest.`)}
                className="tactile w-full py-3 bg-slate-900 hover:bg-emerald-950 text-white text-[10px] tracking-[0.2em] font-bold uppercase transition-colors"
              >
                SETTLE FOLIO &amp; PRINT Z-RECEIPT
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
