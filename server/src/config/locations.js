/**
 * Stayza HMS — Central Multi-Property Location Registry
 * 
 * Defines the 4 physical hotel sanctuary locations across Pakistan:
 * 1. Sindh Coast (Flagship Ocean Sanctuary, Karachi)
 * 2. Hunza Valley (Karakoram Alpine Glacial Sanctuary)
 * 3. Lahore Estate (Heritage Mughal Courtyard Estate, Walled City)
 * 4. Murree Pines (Cedar Forest Mountain Chalet, Bhurban)
 * 
 * Each location has its unique property code, physical address, and suite allocation.
 */
const LOCATIONS = [
  {
    id: 'sindh-coast',
    code: 'SC',
    name: 'Stayza Coastal Sanctuary',
    shortName: 'Sindh Coast',
    city: 'Karachi',
    province: 'Sindh',
    region: 'Arabian Sea Coast',
    address: 'Hawkesbay Bluff, Coastal Marine Highway, Karachi, Sindh, Pakistan',
    phone: '+92 21 3892 1100',
    email: 'coast@stayza.com',
    arrivalTransfer: 'Private Ocean Chauffeur from Karachi Jinnah Int’l (KHI)',
    valetBay: 'Subterranean Lift & Cliffside Valet',
    suitesCount: 5,
    description: 'Perched on the rugged limestone cliffs overlooking the Arabian Sea, featuring heated cliffside plunge pools and panoramic ocean terraces.',
  },
  {
    id: 'hunza',
    code: 'HZ',
    name: 'Stayza Mountain Pavilion',
    shortName: 'Hunza Valley',
    city: 'Karimabad, Hunza',
    province: 'Gilgit-Baltistan',
    region: 'Karakoram Mountain Range',
    address: 'Baltit Fort Ridge, Karimabad, Hunza Valley, Gilgit-Baltistan, Pakistan',
    phone: '+92 5813 457 200',
    email: 'hunza@stayza.com',
    arrivalTransfer: 'Alpine Helipad Transfer from Gilgit Airport (GIL)',
    valetBay: 'Heated Mountain Carport & Private Helipad Pad #2',
    suitesCount: 5,
    description: 'Nestled beneath the majestic peaks of Rakaposhi and Ultar Sar, featuring heated cedar spa baths, roaring stone fireplaces, and glacier views.',
  },
  {
    id: 'lahore',
    code: 'LH',
    name: 'Stayza Cultural Estate',
    shortName: 'Lahore Estate',
    city: 'Old Lahore',
    province: 'Punjab',
    region: 'Historic Walled City',
    address: 'Haveli Courtyard, Walled City Heritage Zone, Lahore, Punjab, Pakistan',
    phone: '+92 42 3765 8900',
    email: 'lahore@stayza.com',
    arrivalTransfer: 'Mughal Heritage Chauffeur from Allama Iqbal Int’l (LHE)',
    valetBay: 'Private Brick Courtyard Valet & Chauffeur Bay',
    suitesCount: 4,
    description: 'Restored 19th-century haveli architecture centering around open-air jasmine courtyards, fountain verandas, and hand-carved brick masonry.',
  },
  {
    id: 'murree',
    code: 'MR',
    name: 'Stayza Pinecrest Retreat',
    shortName: 'Murree Pines',
    city: 'Bhurban, Murree',
    province: 'Punjab',
    region: 'Himalayan Foothills',
    address: 'Pinecrest Ridge, Bhurban Cedar Forest, Murree Hills, Punjab, Pakistan',
    phone: '+92 51 3355 400',
    email: 'murree@stayza.com',
    arrivalTransfer: 'Mountain Express Chauffeur from Islamabad Int’l (ISB)',
    valetBay: 'Covered Timber Ridge Carport #1',
    suitesCount: 4,
    description: 'Enclosed in aromatic pine and cedar forest, offering cantilevered mountain ridge lofts, private saunas, and mist-covered forest balconies.',
  },
]

// Helper function to resolve location object by ID ('hunza', 'sindh-coast', etc.)
function getLocationById(id) {
  if (!id) return LOCATIONS[0]
  return LOCATIONS.find((loc) => loc.id === id.toLowerCase()) || LOCATIONS[0]
}

// Helper function to get valid location IDs array
function getLocationIds() {
  return LOCATIONS.map((loc) => loc.id)
}

module.exports = {
  LOCATIONS,
  getLocationById,
  getLocationIds,
}
