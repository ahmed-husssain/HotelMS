import React from 'react'

export const CONCIERGE_ADDONS = [
  {
    id: 'helipad',
    title: 'Private Coastal Helipad VIP Transfer',
    price: 25000,
  },
  {
    id: 'onsen_spa',
    title: 'Private Cedar Hot Tub & Spa Experience',
    price: 18000,
  },
  {
    id: 'tasting_menu',
    title: "Chef's Fresh Seafood & Farm-to-Table Dinner",
    price: 15000,
  },
]

export default function ExtraServices({ selectedAddons, toggleAddon }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
        <span className="text-xs sm:text-sm font-mono font-bold tracking-[0.15em] text-slate-900 uppercase">
          3. Optional Services
        </span>
        <span className="text-[11px] font-mono text-slate-500 uppercase">
          Optional Extras
        </span>
      </div>

      <div className="space-y-2.5">
        {CONCIERGE_ADDONS.map((addon) => {
          const isSelected = selectedAddons.includes(addon.id)
          return (
            <label
              key={addon.id}
              className={`flex items-center justify-between p-3.5 border rounded-[2px] transition-all cursor-pointer ${
                isSelected
                  ? 'border-slate-900 bg-white shadow-2xs'
                  : 'border-slate-200 bg-white/60 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleAddon(addon.id)}
                  className="w-4 h-4 rounded-[2px] border-slate-300 text-slate-900 focus:ring-0 focus:outline-none cursor-pointer"
                />
                <span className="text-xs font-medium text-slate-900">{addon.title}</span>
              </div>
              <span className="font-mono text-xs text-slate-600">
                + PKR {addon.price.toLocaleString()}
              </span>
            </label>
          )
        })}
      </div>
    </section>
  )
}
