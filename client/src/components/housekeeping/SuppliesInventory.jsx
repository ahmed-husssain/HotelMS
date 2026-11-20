import React, { useState } from 'react'

/**
 * SuppliesInventory — Everyday Hotel Supplies & Linens Inventory
 * 
 * Fulfills Priority 2: Real-time tracking and restocking of the 7 core hotel items:
 * - Bed Sheets (Linens)
 * - Bath Towels (Linens)
 * - Pillows & Blankets (Linens)
 * - Soap & Shampoo (Consumables)
 * - Water Bottles (Consumables)
 * - Tea & Coffee Kits (Consumables)
 * - Snacks (Consumables)
 */
export default function SuppliesInventory({
  inventory = [],
  onRestockItem,
  isLoading = false,
}) {
  const [filter, setFilter] = useState('ALL') // 'ALL' | 'LINEN' | 'CONSUMABLE'
  const [updatingId, setUpdatingId] = useState(null)

  // Default fallback if loading or unseeded
  const items = inventory.length > 0 ? inventory : [
    { _id: '1', name: 'Bed Sheets', category: 'linen', inStock: 25, inLaundry: 8, minAlertLevel: 5, unit: 'sets' },
    { _id: '2', name: 'Bath Towels', category: 'linen', inStock: 40, inLaundry: 12, minAlertLevel: 10, unit: 'sets' },
    { _id: '3', name: 'Pillows & Blankets', category: 'linen', inStock: 20, inLaundry: 4, minAlertLevel: 5, unit: 'sets' },
    { _id: '4', name: 'Soap & Shampoo', category: 'consumable', inStock: 50, inLaundry: 0, minAlertLevel: 10, unit: 'bottles' },
    { _id: '5', name: 'Water Bottles', category: 'consumable', inStock: 60, inLaundry: 0, minAlertLevel: 15, unit: 'bottles' },
    { _id: '6', name: 'Tea & Coffee Kits', category: 'consumable', inStock: 45, inLaundry: 0, minAlertLevel: 10, unit: 'packs' },
    { _id: '7', name: 'Snacks', category: 'consumable', inStock: 40, inLaundry: 0, minAlertLevel: 10, unit: 'packs' },
  ]

  const filteredItems = items.filter((item) => {
    if (filter === 'LINEN') return item.category === 'linen'
    if (filter === 'CONSUMABLE') return item.category === 'consumable'
    return true
  })

  // Summary Metrics
  const totalLinensClean = items
    .filter((i) => i.category === 'linen')
    .reduce((acc, curr) => acc + (curr.inStock || 0), 0)

  const totalInLaundry = items
    .filter((i) => i.category === 'linen')
    .reduce((acc, curr) => acc + (curr.inLaundry || 0), 0)

  const totalConsumables = items
    .filter((i) => i.category === 'consumable')
    .reduce((acc, curr) => acc + (curr.inStock || 0), 0)

  const lowStockCount = items.filter(
    (i) => (i.inStock || 0) <= (i.minAlertLevel || 5)
  ).length

  const handleRestock = async (itemId, amount, type = 'clean_restock') => {
    if (!onRestockItem || updatingId) return
    setUpdatingId(itemId)
    try {
      await onRestockItem(itemId, amount, type)
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* 1. Header & Category Filters */}
      <div className="border-b border-slate-200/80 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="font-serif-grand text-xl text-slate-900">
            Hotel Supplies &amp; Linens Inventory
          </h3>
          <p className="text-xs font-mono text-slate-500 mt-0.5">
            Cleaning supplies and guest amenities in stock.
          </p>
        </div>

        <div className="inline-flex p-1 bg-slate-100 rounded-[2px] border border-slate-200 text-xs font-mono">
          <button
            type="button"
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-[2px] transition-colors ${
              filter === 'ALL'
                ? 'bg-white font-bold text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All Items ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('LINEN')}
            className={`px-3 py-1.5 rounded-[2px] transition-colors ${
              filter === 'LINEN'
                ? 'bg-white font-bold text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Linens (3)
          </button>
          <button
            type="button"
            onClick={() => setFilter('CONSUMABLE')}
            className={`px-3 py-1.5 rounded-[2px] transition-colors ${
              filter === 'CONSUMABLE'
                ? 'bg-white font-bold text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Consumables (4)
          </button>
        </div>
      </div>

      {/* 2. Mini Summary Ribbons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200/90 rounded-[2px] shadow-2xs">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
            Clean Linens
          </span>
          <span className="font-serif-grand text-2xl text-slate-900 mt-1 block">
            {totalLinensClean} Sets
          </span>
          <span className="text-[10px] font-mono text-slate-500">Ready in linen closet</span>
        </div>

        <div className="p-4 bg-white border border-slate-200/90 rounded-[2px] shadow-2xs">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
            In Laundry Wash
          </span>
          <span className="font-serif-grand text-2xl text-amber-900 mt-1 block">
            {totalInLaundry} Sets
          </span>
          <span className="text-[10px] font-mono text-amber-700">Being washed &amp; pressed</span>
        </div>

        <div className="p-4 bg-white border border-slate-200/90 rounded-[2px] shadow-2xs">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
            Room Consumables
          </span>
          <span className="font-serif-grand text-2xl text-slate-900 mt-1 block">
            {totalConsumables} Units
          </span>
          <span className="text-[10px] font-mono text-slate-500">Soaps, water, snacks</span>
        </div>

        <div className="p-4 bg-white border border-slate-200/90 rounded-[2px] shadow-2xs">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
            Stock Warnings
          </span>
          <span
            className={`font-serif-grand text-2xl mt-1 block ${
              lowStockCount > 0 ? 'text-red-900' : 'text-emerald-900'
            }`}
          >
            {lowStockCount} Items
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            {lowStockCount > 0 ? 'Restock recommended' : 'All stocks healthy'}
          </span>
        </div>
      </div>

      {/* 3. Inventory Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => {
          const isLow = (item.inStock || 0) <= (item.minAlertLevel || 5)
          const isLinen = item.category === 'linen'
          const isUpdating = updatingId === item._id

          return (
            <div
              key={item._id || item.name}
              className={`bg-white border rounded-[2px] p-5 shadow-xs flex flex-col justify-between space-y-4 transition-all ${
                isLow ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200/90'
              }`}
            >
              <div className="space-y-3">
                {/* Badge & Category */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-slate-100 text-slate-600 font-semibold">
                    {item.category === 'linen' ? 'Linen & Bedding' : 'Everyday Consumable'}
                  </span>
                  {isLow ? (
                    <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-amber-100 text-amber-900 font-bold">
                      Low Stock (Min: {item.minAlertLevel})
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-emerald-100 text-emerald-900 font-semibold">
                      In Stock
                    </span>
                  )}
                </div>

                {/* Name */}
                <div>
                  <h4 className="font-serif-grand text-lg text-slate-900 font-bold">
                    {item.name}
                  </h4>
                  <p className="text-[11px] font-mono text-slate-500">
                    Standard hotel unit: {item.unit || 'units'}
                  </p>
                </div>

                {/* Count Metrics */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">
                      Clean &amp; Available
                    </span>
                    <span className="font-mono text-2xl font-bold text-slate-900">
                      {item.inStock}{' '}
                      <span className="text-xs font-normal text-slate-500">
                        {item.unit}
                      </span>
                    </span>
                  </div>

                  {isLinen && (
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">
                        In Laundry
                      </span>
                      <span className="font-mono text-lg font-semibold text-amber-800">
                        {item.inLaundry}{' '}
                        <span className="text-xs font-normal text-slate-500">
                          {item.unit}
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons (Touch Target 44px compliant) */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => handleRestock(item._id, 10, 'clean_restock')}
                  className="flex-1 min-h-[44px] px-3 py-2 bg-slate-900 hover:bg-slate-950 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : '+10 Restock'}
                </button>

                {isLinen && item.inLaundry > 0 && (
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleRestock(item._id, 5, 'laundry_return')}
                    className="min-h-[44px] px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-mono font-bold uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer disabled:opacity-50"
                    title="Return clean items from laundry back into available stock"
                  >
                    +5 From Wash
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
