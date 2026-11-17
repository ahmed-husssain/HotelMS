import React, { useState } from 'react'

export default function AnalyticsReport({ rooms }) {
  const [timeframe, setTimeframe] = useState('MONTH')

  const metricsData = {
    DAY: { revenue: 'PKR 295,000', occupancy: '66.7%', adr: 'PKR 145,000', label: 'Today (24 Hours)' },
    WEEK: { revenue: 'PKR 1,480,000', occupancy: '75.0%', adr: 'PKR 142,000', label: 'Past 7 Days' },
    MONTH: { revenue: 'PKR 4,820,000', occupancy: '82.4%', adr: 'PKR 145,000', label: 'Past 30 Days' },
    QUARTER: { revenue: 'PKR 14,250,000', occupancy: '79.1%', adr: 'PKR 138,000', label: 'Fiscal Quarter' },
  }

  const activeMetric = metricsData[timeframe]

  return (
    <div className="space-y-8">
      {/* Predictive Yield & Surge Guidance Banner */}
      <div className="p-5 bg-[#0E1201] text-[#FFF0CA] border border-slate-800 rounded-[2px] shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-400 font-bold">
              AI DEMAND FORECAST &bull; SINDH COAST
            </span>
          </div>
          <h3 className="font-serif-grand text-xl text-white">
            Upcoming Weekend: Projected 95% Occupancy Surge
          </h3>
          <p className="text-xs text-slate-300 font-mono">
            High coastal getaway demand detected. Recommended tariff adjustment: +12% on Suite 301.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 p-1 rounded-[2px] shrink-0 font-mono text-[10px]">
          {['DAY', 'WEEK', 'MONTH', 'QUARTER'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1 uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer ${
                timeframe === t
                  ? 'bg-white text-slate-900 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 bg-white border border-slate-200/90 rounded-[2px] shadow-xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Total Revenue ({activeMetric.label})
          </span>
          <span className="font-serif-grand text-3xl text-slate-900 mt-2 block">
            {activeMetric.revenue}
          </span>
          <span className="text-[10px] font-mono text-emerald-800 font-semibold block mt-1">
            &uarr; 14.8% vs previous period
          </span>
        </div>

        <div className="p-6 bg-white border border-slate-200/90 rounded-[2px] shadow-xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Average Occupancy Rate
          </span>
          <span className="font-serif-grand text-3xl text-slate-900 mt-2 block">
            {activeMetric.occupancy}
          </span>
          <span className="text-[10px] font-mono text-slate-500 block mt-1">
            Capacity: 4 Ultra-Luxury Suites
          </span>
        </div>

        <div className="p-6 bg-white border border-slate-200/90 rounded-[2px] shadow-xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Average Daily Rate (ADR)
          </span>
          <span className="font-serif-grand text-3xl text-slate-900 mt-2 block">
            {activeMetric.adr}
          </span>
          <span className="text-[10px] font-mono text-emerald-800 font-semibold block mt-1">
            High-Yield Residential Tier
          </span>
        </div>

        <div className="p-6 bg-white border border-slate-200/90 rounded-[2px] shadow-xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Two-Stage Cash Split
          </span>
          <div className="mt-2 text-xs font-mono space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Safepay 30% Online:</span>
              <strong className="text-emerald-900">PKR 1,446,000</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Front Desk 70%:</span>
              <strong className="text-slate-900">PKR 3,374,000</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Suite Performance Bars */}
      <div className="p-6 bg-white border border-slate-200/90 rounded-[2px] shadow-xs space-y-4">
        <h4 className="font-serif-grand text-lg text-slate-900">Per-Suite Revenue Contribution</h4>
        <div className="space-y-3">
          {rooms.map((r, i) => {
            const percentages = [42, 28, 20, 10]
            const p = percentages[i % percentages.length]

            return (
              <div key={r.roomNumber} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-bold text-slate-900">{r.name} ({r.roomNumber})</span>
                  <span className="text-slate-600">{p}% of gross revenue</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-900 rounded-full" style={{ width: `${p}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
