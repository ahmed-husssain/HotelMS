import React from 'react'

export const AVAILABLE_SERVICES = [
  {
    id: 'dining-1',
    category: 'Dining',
    title: 'Coastal Line-Catch Seafood Tasting Dinner',
    description: 'Fresh Arabian Sea lobster & black pomfret prepared in-suite by our private executive chef.',
    price: 15000,
  },
  {
    id: 'dining-2',
    category: 'Dining',
    title: 'Estate High Tea & Artisanal Cedar Brew',
    description: 'Fresh organic pastries, estate-grown herbal infusions, and Japanese matcha served in-villa.',
    price: 4500,
  },
  {
    id: 'comfort-1',
    category: 'Housekeeping',
    title: 'Fresh Egyptian Linen & Feather Pillow Refresh',
    description: 'Complimentary mid-stay linen change with choice of lavender or cedar aromatic mist.',
    price: 0,
  },
  {
    id: 'comfort-2',
    category: 'Housekeeping',
    title: 'Evening Cedar Spa & Aromatic Bath Setup',
    description: 'Organic magnesium salts, fresh jasmine blossoms, and warmed cedar bath oils prepared in your spa tub.',
    price: 6000,
  },
  {
    id: 'transfer-1',
    category: 'Transport',
    title: 'Chauffeur Executive Sedan Airport Transfer',
    description: 'Private transfer from Karachi Jinnah International Airport directly to the estate valet.',
    price: 12000,
  },
]

export default function RoomServiceMenu({ orderedServices, onRequestService }) {
  return (
    <section className="space-y-6">
      <div className="border-b border-slate-200/80 pb-2.5 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono font-bold tracking-[0.2em] text-slate-900 uppercase">
            In-Suite Guest Services
          </span>
          <span className="block text-[10px] text-slate-400 mt-0.5">
            Request dining, extra housekeeping, or private transport directly to your suite
          </span>
        </div>
        <span className="text-[10px] font-mono text-emerald-800 uppercase font-semibold">
          Complimentary Delivery
        </span>
      </div>

      <div className="space-y-3">
        {AVAILABLE_SERVICES.map((service) => {
          const isAlreadyAdded = orderedServices.some((s) => s.id === service.id)

          return (
            <div
              key={service.id}
              className="p-4 bg-white border border-slate-200/90 rounded-[2px] hover:border-slate-400 transition-all shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 max-w-md">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[8px] font-mono font-bold uppercase rounded">
                    {service.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900">{service.title}</h4>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                <span className="font-mono text-xs font-bold text-slate-900">
                  {service.price === 0 ? 'COMPLIMENTARY' : `+ PKR ${service.price.toLocaleString()}`}
                </span>

                <button
                  type="button"
                  disabled={isAlreadyAdded}
                  onClick={() => onRequestService(service)}
                  className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider font-bold rounded-[2px] transition-all cursor-pointer ${
                    isAlreadyAdded
                      ? 'bg-emerald-100 text-emerald-950 cursor-default'
                      : 'bg-slate-900 text-white hover:bg-emerald-950 active:scale-95'
                  }`}
                >
                  {isAlreadyAdded ? '✓ Requested' : '+ Request Service'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
