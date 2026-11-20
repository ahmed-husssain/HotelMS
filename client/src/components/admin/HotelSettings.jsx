import React, { useState } from 'react'
import { useToast } from '../../context/ToastContext'

export default function HotelSettings({
  systemSettings = {},
  onSaveSettings,
}) {
  const { showToast } = useToast()
  const [taxRate, setTaxRate] = useState(systemSettings?.taxRate || 13)
  const [depositRate, setDepositRate] = useState(systemSettings?.depositRate || 30)
  const [checkInTime, setCheckInTime] = useState(systemSettings?.checkInTime || '14:00')
  const [checkOutTime, setCheckOutTime] = useState(systemSettings?.checkOutTime || '11:00')
  const [policyNotes, setPolicyNotes] = useState(systemSettings?.policyNotes || '')
  const [savedNotice, setSavedNotice] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSaveSettings({
      taxRate: Number(taxRate),
      depositRate: Number(depositRate),
      checkInTime,
      checkOutTime,
      policyNotes,
    })
    setSavedNotice(true)
    showToast({
      type: 'success',
      title: 'Global Settings Saved',
      message: `Sindh GST set to ${taxRate}% and online deposit split set to ${depositRate}%.`,
    })
    setTimeout(() => setSavedNotice(false), 3000)
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-[2px] shadow-xs p-6 sm:p-8 space-y-6">
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <div>
          <h3 className="font-serif-grand text-xl text-slate-900">Hotel Settings &amp; Policies</h3>
          <p className="text-xs font-mono text-slate-500 mt-0.5">
            Provincial tax percentages, advance split rules, check-in/out hours, and legal policies
          </p>
        </div>
        {savedNotice && (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-950 font-mono text-xs font-bold rounded">
            ✓ Parameters Saved
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs font-mono">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] uppercase text-slate-500 font-semibold block mb-1">
              Sindh Sales Tax Rate (%)
            </label>
            <input
              type="number"
              required
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-[2px] text-slate-900 focus:outline-none focus:border-slate-900"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Standard Sindh Provincial GST: 13%</span>
          </div>

          <div>
            <label className="text-[10px] uppercase text-slate-500 font-semibold block mb-1">
              Online Advance Deposit (%)
            </label>
            <input
              type="number"
              required
              value={depositRate}
              onChange={(e) => setDepositRate(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-[2px] text-slate-900 focus:outline-none focus:border-slate-900"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Online Advance Deposit: 30%</span>
          </div>

          <div>
            <label className="text-[10px] uppercase text-slate-500 font-semibold block mb-1">
              Standard Check-In Hour
            </label>
            <input
              type="text"
              required
              value={checkInTime}
              onChange={(e) => setCheckInTime(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-[2px] text-slate-900 focus:outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase text-slate-500 font-semibold block mb-1">
              Standard Check-Out Hour
            </label>
            <input
              type="text"
              required
              value={checkOutTime}
              onChange={(e) => setCheckOutTime(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-[2px] text-slate-900 focus:outline-none focus:border-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase text-slate-500 font-semibold block mb-1">
            Cancellation &amp; Reservation Policy Terms
          </label>
          <textarea
            rows="3"
            value={policyNotes}
            onChange={(e) => setPolicyNotes(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-[2px] text-slate-900 focus:outline-none focus:border-slate-900"
          />
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            type="submit"
            className="px-6 py-3 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] font-bold uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer"
          >
            Save Configuration Changes →
          </button>
        </div>
      </form>
    </div>
  )
}
