import React from 'react'

export const CONCIERGE_ADDONS = [
  {
    id: 'airport_transfer',
    title: 'Airport Pick & Drop Service',
    description: 'Chauffeured luxury SUV from Karachi Jinnah International Airport',
    price: 8000,
  },
  {
    id: 'breakfast',
    title: 'Daily Gourmet Breakfast Buffet',
    description: 'Artisanal coastal breakfast served on the oceanfront terrace',
    price: 5000,
  },
  {
    id: 'spa_pass',
    title: 'Thermal Spa & Hydrotherapy Pass',
    description: 'Unlimited access to private steam suites, plunge pools, and cedar sauna',
    price: 6500,
  },
]

export default function ExtraServices({ selectedAddons, toggleAddon }) {
  return (
    <section className="bg-white border border-slate-200/90 rounded-xl p-5 sm:p-7 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-[#0F172A] text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
            3
          </span>
          <h2 className="font-syne font-bold text-base sm:text-lg text-slate-900 tracking-tight">
            Optional Concierge Upgrades
          </h2>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Can also be added at check-in
        </span>
      </div>

      <div className="space-y-3">
        {CONCIERGE_ADDONS.map((addon) => {
          const isSelected = selectedAddons.includes(addon.id)
          return (
            <label
              key={addon.id}
              className={`flex items-center justify-between p-4 border rounded-lg transition-all cursor-pointer ${
                isSelected
                  ? 'border-slate-900 bg-slate-50/80 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/40'
              }`}
            >
              <div className="flex items-start gap-3.5 pr-2">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleAddon(addon.id)}
                  className="w-4 h-4 mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                />
                <div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-900 block">
                    {addon.title}
                  </span>
                  <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                    {addon.description}
                  </span>
                </div>
              </div>
              <span className="font-mono text-xs sm:text-sm font-bold text-slate-800 whitespace-nowrap shrink-0">
                + PKR {addon.price.toLocaleString()}
              </span>
            </label>
          )
        })}
      </div>
    </section>
  )
}
