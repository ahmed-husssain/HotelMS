const mongoose = require('mongoose')

/**
 * InventoryItem Schema — Hotel Supplies & Linens Inventory
 * 
 * Tracks the 7 core everyday hotel supplies:
 * Linens: Bed Sheets, Bath Towels, Pillows & Blankets (Clean Stock vs In Laundry)
 * Consumables: Soap & Shampoo, Water Bottles, Tea & Coffee Kits, Snacks (Direct stock counts)
 */
const inventoryItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['linen', 'consumable'],
      required: true,
      default: 'consumable',
    },
    inStock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    inLaundry: {
      type: Number,
      min: [0, 'Laundry count cannot be negative'],
      default: 0,
    },
    minAlertLevel: {
      type: Number,
      required: true,
      default: 5,
    },
    unit: {
      type: String,
      default: 'units', // 'sets', 'bottles', 'packs'
    },
    lastRestockedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('InventoryItem', inventoryItemSchema)
