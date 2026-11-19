import React, { useState, useEffect } from 'react'
import { fetchAdminAnalytics } from '../../services/api'

/**
 * LuxuryStay / Stayza HMS — Executive Analytics Report (PRD Module 6)
 * 
 * 100% database-backed operational metrics calculated live from MongoDB Atlas:
 * 1. Gross Realized Revenue & Payment Split (Payment Ledger)
 * 2. Live Occupancy Rate & Operational Distribution (Room Inventory)
 * 3. Average Daily Rate (ADR) & RevPAR (Pricing Yield)
 * 4. Checkout Hold Conversion vs Abandonment Rate (5-Min Concurrency Telemetry)
 * 5. Incidental Folio Upsell & Top Concierge Services (In-Stay Folios)
 */
export default function AnalyticsReport({ rooms }) {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    async function loadAnalytics() {
      try {
        setLoading(true)
        const res = await fetchAdminAnalytics()
        if (isMounted && res.success && res.data) {
          setAnalytics(res.data)
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to load executive analytics.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadAnalytics()
    return () => { isMounted = false }
  }, [])

  if (loading) {
    return (
      <div className="p-12 text-center bg-white border border-slate-200/90 rounded-[2px] shadow-xs">
        <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin mx-auto mb-3" />
        <span className="text-xs font-mono uppercase tracking-widest text-slate-500">
          Aggregating Live Financial &amp; Inventory Telemetry...
        </span>
      </div>
    )
  }

  if (error || !analytics) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-[2px] text-xs font-mono text-red-900">
        <strong>Telemetry Warning:</strong> {error || 'Unable to connect to analytics engine.'}
      </div>
    )
  }

  const { revenue, occupancy, pricingYield, bookingFunnel, incidentals } = analytics

  return (
    <div className="space-y-8">
      {/* 1. EXECUTIVE OPERATIONAL STATUS BANNER */}
      <div className="p-5 bg-[#0E1201] text-[#FFF0CA] border border-slate-800 rounded-[2px] shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-400 font-bold">
              MONGODB ATLAS LIVE TELEMETRY &bull; EXECUTIVE DASHBOARD
            </span>
          </div>
          <h3 className="font-serif-grand text-xl text-white">
            Property Performance &bull; Stayza Sanctuary
          </h3>
          <p className="text-xs text-slate-300 font-mono">
            Zero-Trust financial ledger, atomic 5-minute hold concurrency, and live room turnover sync.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-[2px] shrink-0 font-mono text-[10px] text-slate-300">
          <span>Sindh GST: <strong className="text-white">13%</strong></span>
          <span className="text-slate-600">|</span>
          <span>Advance Split: <strong className="text-white">30% / 70%</strong></span>
        </div>
      </div>

      {/* 2. THE 4 PRIMARY TELEMETRY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* METRIC 1: Gross Realized Revenue */}
        <div className="p-6 bg-white border border-slate-200/90 rounded-[2px] shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
              Gross Realized Revenue (M1)
            </span>
            <span className="font-serif-grand text-2xl lg:text-3xl text-slate-900 mt-2 block tracking-tight">
              PKR {revenue.grossRevenue.toLocaleString()}
            </span>
            <span className="text-[10px] font-mono text-emerald-800 font-semibold block mt-1">
              ✓ Verified Double-Entry Ledger
            </span>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] font-mono space-y-1.5">
            <div className="flex justify-between text-slate-600">
              <span>Online Advance (30%):</span>
              <strong className="text-emerald-900">PKR {revenue.advanceTotal.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Desk Settlements (70%):</span>
              <strong className="text-slate-900">PKR {revenue.balanceTotal.toLocaleString()}</strong>
            </div>
            {revenue.extrasTotal > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Folio Extras:</span>
                <strong className="text-amber-900">PKR {revenue.extrasTotal.toLocaleString()}</strong>
              </div>
            )}
          </div>
        </div>

        {/* METRIC 2: Live Occupancy Rate */}
        <div className="p-6 bg-white border border-slate-200/90 rounded-[2px] shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
              Live Occupancy Rate (M2)
            </span>
            <span className="font-serif-grand text-2xl lg:text-3xl text-slate-900 mt-2 block tracking-tight">
              {occupancy.occupancyRate}%
            </span>
            <span className="text-[10px] font-mono text-slate-500 block mt-1">
              Capacity: {occupancy.totalRooms} Ultra-Luxury Suites
            </span>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-1.5 text-[9px] font-mono font-bold uppercase">
            <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded">
              Occupied: {occupancy.occupiedCount}
            </span>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-950 rounded">
              Ready: {occupancy.availableCount}
            </span>
            <span className="px-2 py-0.5 bg-red-100 text-red-900 rounded">
              Dirty: {occupancy.dirtyCount}
            </span>
            {occupancy.maintenanceCount > 0 && (
              <span className="px-2 py-0.5 bg-slate-200 text-slate-800 rounded">
                Maint: {occupancy.maintenanceCount}
              </span>
            )}
          </div>
        </div>

        {/* METRIC 3: Average Daily Rate (ADR) & RevPAR */}
        <div className="p-6 bg-white border border-slate-200/90 rounded-[2px] shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
              Pricing Yield: ADR &amp; RevPAR (M3)
            </span>
            <span className="font-serif-grand text-2xl lg:text-3xl text-slate-900 mt-2 block tracking-tight">
              PKR {pricingYield.adr.toLocaleString()}
            </span>
            <span className="text-[10px] font-mono text-emerald-800 font-semibold block mt-1">
              RevPAR: PKR {pricingYield.revPar.toLocaleString()} / Suite
            </span>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] font-mono space-y-1 text-slate-600">
            <div className="flex justify-between">
              <span>Booked Nights:</span>
              <strong className="text-slate-900">{pricingYield.totalRoomNights} Nights</strong>
            </div>
            <div className="flex justify-between">
              <span>Gross Tariff Volume:</span>
              <strong className="text-slate-900">PKR {pricingYield.totalRoomRevenue.toLocaleString()}</strong>
            </div>
          </div>
        </div>

        {/* METRIC 4: 5-Minute Hold Conversion vs Abandonment */}
        <div className="p-6 bg-white border border-slate-200/90 rounded-[2px] shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
              Checkout Hold Conversion (M4)
            </span>
            <span className="font-serif-grand text-2xl lg:text-3xl text-slate-900 mt-2 block tracking-tight">
              {bookingFunnel.conversionRate}%
            </span>
            <span className="text-[10px] font-mono text-slate-500 block mt-1">
              5-Min Pessimistic Lock Funnel
            </span>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] font-mono space-y-1 text-slate-600">
            <div className="flex justify-between">
              <span>Confirmed Stays:</span>
              <strong className="text-emerald-900">{bookingFunnel.confirmedStays}</strong>
            </div>
            <div className="flex justify-between">
              <span>Holds Initiated:</span>
              <strong className="text-slate-900">{bookingFunnel.totalHoldsInitiated}</strong>
            </div>
            <div className="flex justify-between">
              <span>Drop-Off Rate:</span>
              <strong className="text-red-700">{bookingFunnel.abandonmentRate}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 3. METRIC 5: INCIDENTAL FOLIO UPSELL & TOP CONCIERGE SERVICES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Top Services Ranking */}
        <div className="lg:col-span-7 p-6 bg-white border border-slate-200/90 rounded-[2px] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h4 className="font-serif-grand text-lg text-slate-900">
                In-Stay Concierge &amp; Incidental Leaderboard (M5)
              </h4>
              <p className="text-xs font-mono text-slate-500 mt-0.5">
                Highest-grossing luxury ancillary services ordered via /my-stay &amp; Front Desk folios
              </p>
            </div>
            <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-950 font-mono text-xs font-bold rounded">
              PKR {incidentals.totalIncidentalRevenue.toLocaleString()} Total
            </span>
          </div>

          {incidentals.topServices && incidentals.topServices.length > 0 ? (
            <div className="space-y-3">
              {incidentals.topServices.map((svc, idx) => {
                const maxRev = incidentals.topServices[0]?.revenue || 1
                const pct = Math.round((svc.revenue / maxRev) * 100)

                return (
                  <div key={svc.title} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="font-bold text-slate-900">
                        #{idx + 1} {svc.title}
                      </span>
                      <span className="font-bold text-slate-700">
                        PKR {svc.revenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-900 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="py-6 text-center text-xs font-mono text-slate-400">
              No extra incidental services posted to active folios yet.
            </div>
          )}
        </div>

        {/* Right: Cash Channel Distribution */}
        <div className="lg:col-span-5 p-6 bg-white border border-slate-200/90 rounded-[2px] shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="font-serif-grand text-lg text-slate-900">Payment Channel Distribution</h4>
            <p className="text-xs font-mono text-slate-500 mt-0.5">
              Breakdown of funds collected via Safepay vs Front Desk
            </p>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-[2px] flex items-center justify-between">
              <div>
                <span className="text-slate-900 font-bold block">Safepay Online (30% Advance)</span>
                <span className="text-[10px] text-slate-500">Automated Webhook Guaranteed</span>
              </div>
              <strong className="text-emerald-900 font-bold">
                PKR {revenue.channels.safepayOnline.toLocaleString()}
              </strong>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-100 rounded-[2px] flex items-center justify-between">
              <div>
                <span className="text-slate-900 font-bold block">Cash at Front Desk</span>
                <span className="text-[10px] text-slate-500">Physical Register Drawer</span>
              </div>
              <strong className="text-slate-900 font-bold">
                PKR {revenue.channels.deskCash.toLocaleString()}
              </strong>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-100 rounded-[2px] flex items-center justify-between">
              <div>
                <span className="text-slate-900 font-bold block">Card Terminal POS at Desk</span>
                <span className="text-[10px] text-slate-500">Credit / Debit Merchant Terminal</span>
              </div>
              <strong className="text-slate-900 font-bold">
                PKR {revenue.channels.deskCard.toLocaleString()}
              </strong>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 flex justify-between">
              <span>Ancillary Folio Contribution:</span>
              <strong className="text-slate-900">{incidentals.ancillaryShare}% of Total Gross</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
