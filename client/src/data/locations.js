/**
 * Stayza HMS — Client Locations Registry
 * 
 * Defines the 4 physical hotel sanctuary locations across Pakistan:
 * 1. Sindh Coast (Flagship Ocean Sanctuary, Karachi)
 * 2. Hunza Valley (Karakoram Alpine Glacial Sanctuary)
 * 3. Lahore Estate (Heritage Mughal Courtyard Estate, Walled City)
 * 4. Murree Pines (Cedar Forest Mountain Chalet, Bhurban)
 */
export const LOCATIONS = [
  {
    id: 'sindh-coast',
    code: 'SC',
    name: 'Stayza Coastal Sanctuary',
    shortName: 'Sindh Coast',
    city: 'Karachi',
    province: 'Sindh',
    region: 'Arabian Sea Coast',
    address: 'Hawkesbay Bluff, Coastal Highway, Karachi, Sindh',
    phone: '+92 21 3892 1100',
    email: 'coast@stayza.com',
    arrivalTransfer: 'Private Ocean Chauffeur from Karachi Jinnah Int’l (KHI)',
    valetBay: 'Subterranean Lift & Cliffside Valet',
    suitesCount: 5,
    description: 'Perched on rugged limestone cliffs overlooking the Arabian Sea, featuring heated plunge pools and panoramic ocean horizons.',
  },
  {
    id: 'hunza',
    code: 'HZ',
    name: 'Stayza Mountain Pavilion',
    shortName: 'Hunza Valley',
    city: 'Karimabad, Hunza',
    province: 'Gilgit-Baltistan',
    region: 'Karakoram Mountain Range',
    address: 'Baltit Fort Ridge, Karimabad, Hunza Valley',
    phone: '+92 5813 457 200',
    email: 'hunza@stayza.com',
    arrivalTransfer: 'Alpine Helipad Transfer from Gilgit Airport (GIL)',
    valetBay: 'Heated Mountain Carport & Private Helipad Pad #2',
    suitesCount: 5,
    description: 'Nestled beneath Rakaposhi and Ultar Sar peaks, featuring heated cedar spa baths, stone fireplaces, and glacier views.',
  },
  {
    id: 'lahore',
    code: 'LH',
    name: 'Stayza Cultural Estate',
    shortName: 'Lahore Estate',
    city: 'Old Lahore',
    province: 'Punjab',
    region: 'Historic Walled City',
    address: 'Haveli Courtyard, Walled City Heritage Zone, Lahore',
    phone: '+92 42 3765 8900',
    email: 'lahore@stayza.com',
    arrivalTransfer: 'Mughal Heritage Chauffeur from Allama Iqbal Int’l (LHE)',
    valetBay: 'Private Brick Courtyard Valet & Chauffeur Bay',
    suitesCount: 4,
    description: 'Restored 19th-century haveli architecture centering around open-air jasmine courtyards and fountain verandas.',
  },
  {
    id: 'murree',
    code: 'MR',
    name: 'Stayza Pinecrest Retreat',
    shortName: 'Murree Pines',
    city: 'Bhurban, Murree',
    province: 'Punjab',
    region: 'Himalayan Foothills',
    address: 'Pinecrest Ridge, Bhurban Forest, Murree Hills',
    phone: '+92 51 3355 400',
    email: 'murree@stayza.com',
    arrivalTransfer: 'Mountain Express Chauffeur from Islamabad Int’l (ISB)',
    valetBay: 'Covered Timber Ridge Carport #1',
    suitesCount: 4,
    description: 'Enclosed in aromatic pine forest, offering cantilevered mountain ridge lofts, private saunas, and forest balconies.',
  },
]

export function getLocationById(id) {
  if (!id) return LOCATIONS[0]
  return LOCATIONS.find((loc) => loc.id === id.toLowerCase()) || LOCATIONS[0]
}
