import React, { useState } from 'react'

export const INCIDENTAL_CATALOG = [
  { title: 'In-Suite Champagne & Caviar Tasting', price: 28000 },
  { title: 'Executive Coastal Chauffeur Service', price: 15000 },
  { title: 'Express Silk Garment Laundry', price: 6500 },
  { title: 'Estate Private Dining Dinner', price: 18000 },
  { title: 'Sommelier Wine Reserve Selection', price: 32000 },
]

export default function AddChargeModal({ isOpen, onClose, selectedRoom, onAddIncidental }) {
  const [customItem, setCustomItem] = useState('')
  const [customAmount, setCustomAmount] = useState('')

  if (!isOpen || !selectedRoom) return null

  const handlePostCatalog = (item) => {
    onAddIncidental(selectedRoom.roomNumber, item.title, item.price)
    onClose()
  }

  const handlePostCustom = (e) => {
    e.preventDefault()
    if (!customItem || !customAmount) return
    onAddIncidental(selectedRoom.roomNumber, customItem.trim(), Number(customAmount))
    setCustomItem('')
    setCustomAmount('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF8F5] border border-slate-300 rounded-[2px] shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 animate-scale-in">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-emerald-900 font-extrabold uppercase">
              Incidental Room Charge
            </span>
            <h3 className="font-serif-grand text-2xl text-slate-900 mt-0.5">
              Post Charge &bull; {selectedRoom.roomNumber}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 text-lg cursor-pointer font-bold"
          >
            &times;
          </button>
        </div>

        <div className="text-xs font-mono text-slate-600">
          Guest: <strong className="text-slate-900">{selectedRoom.guest}</strong> &bull; Folio:{' '}
          <strong>{selectedRoom.folioNumber}</strong>
        </div>

        {/* Quick Catalog */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
            Concierge Standard Catalog:
          </span>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {INCIDENTAL_CATALOG.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => handlePostCatalog(item)}
                className="w-full p-2.5 bg-white border border-slate-200 hover:border-slate-900 rounded-[2px] text-xs font-mono flex justify-between items-center transition-colors cursor-pointer text-left"
              >
                <span className="text-slate-900">{item.title}</span>
                <span className="font-bold text-slate-700">+ PKR {item.price.toLocaleString()}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Item Form */}
        <form onSubmit={handlePostCustom} className="space-y-3 pt-3 border-t border-slate-200">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
            Or Post Custom Charge:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Item description"
              value={customItem}
              onChange={(e) => setCustomItem(e.target.value)}
              className="col-span-2 px-3 py-2 bg-white border border-slate-300 rounded-[2px] text-xs font-mono text-slate-900 focus:outline-none focus:border-slate-900"
            />
            <input
              type="number"
              placeholder="PKR Amount"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-300 rounded-[2px] text-xs font-mono text-slate-900 focus:outline-none focus:border-slate-900"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-slate-900 hover:bg-slate-950 text-white text-xs font-mono uppercase font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer"
          >
            Post Custom Charge to Folio
          </button>
        </form>
      </div>
    </div>
  )
}
