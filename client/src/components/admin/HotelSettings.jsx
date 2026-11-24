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
  const [policyNotes, setPolicyNotes] = useState(
    systemSettings?.policyNotes ||
      'Complimentary cancellation permitted up to 48 hours prior to 14:00 PKT check-in. The 30% online advance deposit is non-refundable within 24 hours of scheduled arrival. Remaining 70% balance is settled upon arrival at the Front Desk.'
  )
  const [savedNotice, setSavedNotice] = useState(false)

  // Handle Restore Defaults
  const handleRestoreDefaults = () => {
    setTaxRate(13)
    setDepositRate(30)
    setCheckInTime('14:00')
    setCheckOutTime('11:00')
    setPolicyNotes(
      'Complimentary cancellation permitted up to 48 hours prior to 14:00 PKT check-in. The 30% online advance deposit is non-refundable within 24 hours of scheduled arrival. Remaining 70% balance is settled upon arrival at the Front Desk.'
    )
    showToast({
      type: 'info',
      title: 'Defaults Restored',
      message: 'Recommended hotel tax & policy presets loaded.',
    })
  }

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
      title: 'Hotel Policies Saved',
      message: `Sindh GST set to ${taxRate}% and online deposit split set to ${depositRate}%.`,
    })
    setTimeout(() => setSavedNotice(false), 3000)
  }

  // Dynamic preview calculations based on current inputs
  const sampleSuitePrice = 100000
  const sampleTaxAmount = Math.round(sampleSuitePrice * (Number(taxRate) / 100))
  const sampleTotal = sampleSuitePrice + sampleTaxAmount
  const sampleAdvance = Math.round(sampleTotal * (Number(depositRate) / 100))
  const sampleBalance = sampleTotal - sampleAdvance

  return (
    <div className="bg-white border border-slate-200/90 rounded-[2px] shadow-xs p-6 sm:p-8 space-y-8">
      {/* 1. Header Banner */}
      <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-900 font-bold">
              System Configuration
            </span>
          </div>
          <h3 className="font-serif-grand text-2xl text-slate-900 mt-1">
            Hotel Policies &amp; Tax Controls
          </h3>
          <p className="text-xs font-mono text-slate-500 mt-0.5">
            Configure provincial hospitality taxes, Safepay advance splits, check-in schedules, and guest terms
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRestoreDefaults}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer"
          >
            ↺ Recommended Presets
          </button>
          {savedNotice && (
            <span className="px-3 py-1 bg-emerald-100 text-emerald-950 font-mono text-xs font-bold rounded">
              ✓ Settings Saved
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 text-xs font-mono">
        {/* 2. Educational Setting Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CARD 1: Sindh Sales Tax Rate */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-[2px] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Provincial Taxation
              </span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-950 text-[10px] font-bold rounded">
                SRB Standard: 13%
              </span>
            </div>

            <h4 className="font-serif-grand text-lg text-slate-900">
              Sindh Sales Tax Rate (SRB GST)
            </h4>

            <p className="text-slate-600 text-[11px] leading-relaxed">
              Mandatory government sales tax applied automatically to all suite nights, food &amp; beverage folios, and concierge add-ons.
            </p>

            <div className="pt-2">
              <label className="text-[10px] uppercase text-slate-500 font-semibold block mb-1">
                Tax Percentage Rate (%)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  step="0.1"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="w-32 px-3 py-2 bg-white border border-slate-300 rounded-[2px] text-slate-900 font-bold text-sm focus:outline-none focus:border-slate-900"
                />
                <span className="text-slate-500 text-sm font-bold">%</span>
              </div>
            </div>

            {/* Real-time Math Preview */}
            <div className="p-3 bg-white border border-slate-200 rounded-[2px] text-[11px] text-slate-600 space-y-1">
              <strong className="text-slate-900 block text-[10px] uppercase tracking-wider">
                Live Calculation Example:
              </strong>
              <div>Base Suite Rate: PKR {sampleSuitePrice.toLocaleString()}</div>
              <div>+ {taxRate}% Sindh GST: <strong className="text-emerald-900">PKR {sampleTaxAmount.toLocaleString()}</strong></div>
              <div className="font-bold text-slate-900 pt-0.5 border-t border-slate-100">
                Total Billed to Guest: PKR {sampleTotal.toLocaleString()}
              </div>
            </div>
          </div>

          {/* CARD 2: Online Advance Deposit Split */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-[2px] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Payment Guarantee
              </span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-950 text-[10px] font-bold rounded">
                Default: 30% / 70%
              </span>
            </div>

            <h4 className="font-serif-grand text-lg text-slate-900">
              Online Advance Deposit Requirement
            </h4>

            <p className="text-slate-600 text-[11px] leading-relaxed">
              The portion of the reservation total that guests pay online via Safepay to lock in their suite. The remaining balance is collected upon arrival at the Front Desk.
            </p>

            <div className="pt-2">
              <label className="text-[10px] uppercase text-slate-500 font-semibold block mb-1">
                Online Advance Split (%)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  step="1"
                  value={depositRate}
                  onChange={(e) => setDepositRate(e.target.value)}
                  className="w-32 px-3 py-2 bg-white border border-slate-300 rounded-[2px] text-slate-900 font-bold text-sm focus:outline-none focus:border-slate-900"
                />
                <span className="text-slate-500 text-sm font-bold">%</span>
                <span className="text-[11px] text-slate-500 ml-2">
                  (Remaining: <strong className="text-slate-900">{100 - Number(depositRate)}%</strong> at Front Desk)
                </span>
              </div>
            </div>

            {/* Real-time Math Preview */}
            <div className="p-3 bg-white border border-slate-200 rounded-[2px] text-[11px] text-slate-600 space-y-1">
              <strong className="text-slate-900 block text-[10px] uppercase tracking-wider">
                Payment Distribution on PKR {sampleTotal.toLocaleString()}:
              </strong>
              <div>Paid Online via Safepay ({depositRate}%): <strong className="text-emerald-900">PKR {sampleAdvance.toLocaleString()}</strong></div>
              <div>Due at Front Desk ({100 - Number(depositRate)}%): <strong className="text-slate-900">PKR {sampleBalance.toLocaleString()}</strong></div>
            </div>
          </div>

          {/* CARD 3: Check-In & Check-Out Operating Hours */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-[2px] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Front Desk Schedule
              </span>
              <span className="px-2 py-0.5 bg-slate-200 text-slate-800 text-[10px] font-bold rounded">
                3-Hour Cleaning Window
              </span>
            </div>

            <h4 className="font-serif-grand text-lg text-slate-900">
              Standard Operating Hours
            </h4>

            <p className="text-slate-600 text-[11px] leading-relaxed">
              Standard arrival and departure hours. The 3-hour window between check-out and check-in gives housekeeping time to clean and sanitize suites.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-[10px] uppercase text-slate-500 font-semibold block mb-1">
                  Check-In Hour (Arrival)
                </label>
                <input
                  type="time"
                  required
                  value={checkInTime}
                  onChange={(e) => setCheckInTime(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-[2px] text-slate-900 font-bold focus:outline-none focus:border-slate-900"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Default: 14:00 (2:00 PM)</span>
              </div>

              <div>
                <label className="text-[10px] uppercase text-slate-500 font-semibold block mb-1">
                  Check-Out Hour (Departure)
                </label>
                <input
                  type="time"
                  required
                  value={checkOutTime}
                  onChange={(e) => setCheckOutTime(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-[2px] text-slate-900 font-bold focus:outline-none focus:border-slate-900"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Default: 11:00 (11:00 AM)</span>
              </div>
            </div>
          </div>

          {/* CARD 4: Cancellation Policy Terms */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-[2px] space-y-3">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              Legal Terms
            </span>

            <h4 className="font-serif-grand text-lg text-slate-900">
              Cancellation &amp; Refund Terms
            </h4>

            <p className="text-slate-600 text-[11px] leading-relaxed">
              Policy text displayed to guests during the booking checkout flow and printed on verified PDF receipts.
            </p>

            <div className="pt-2">
              <label className="text-[10px] uppercase text-slate-500 font-semibold block mb-1">
                Policy Agreement Text
              </label>
              <textarea
                rows="4"
                maxLength={2000}
                value={policyNotes}
                onChange={(e) => setPolicyNotes(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-[2px] text-slate-900 focus:outline-none focus:border-slate-900 font-mono text-xs leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* 3. Bottom Save Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="text-[11px] text-slate-500">
            Changes update pricing calculations and booking receipts across the entire hotel system.
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-[#0E1201] hover:bg-slate-900 text-[#FFF0CA] font-bold uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer"
          >
            Save Policy &amp; Tax Settings →
          </button>
        </div>
      </form>
    </div>
  )
}
