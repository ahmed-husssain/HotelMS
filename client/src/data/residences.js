/**
 * Showcase residences data with 1-second telemetry chips
 * Aligns with the physical rooms collection in the backend.
 */
export const RESIDENCES = [
  {
    id: 'res-301',
    roomNumber: '301',
    name: 'The Horizon Penthouse',
    tier: 'PRESIDENTIAL SUITE',
    nightlyRate: 110000,
    mainImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1800&q=85',
    detailImage: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=85',
    specs: [
      { label: 'AREA', value: '210 M²' },
      { label: 'EXPOSURE', value: '360° OCEAN' },
      { label: 'BED', value: 'EMPEROR' },
      { label: 'POOL', value: '20M REEF' },
      { label: 'SERVICE', value: '24H BUTLER' },
    ],
    amenities: ['Private Helipad Transfer', 'Temperature Regulated Onyx Tub', 'Sub-Zero Wine Reserve', 'Private Lift Access']
  },
  {
    id: 'res-204',
    roomNumber: '204',
    name: 'The Courtyard Villa',
    tier: 'PRIVATE GARDEN VILLA',
    nightlyRate: 75000,
    mainImage: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1800&q=85',
    detailImage: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=85',
    specs: [
      { label: 'AREA', value: '160 M²' },
      { label: 'GARDEN', value: 'KYOTO CEDAR' },
      { label: 'SOAK', value: 'HINOKI ONSEN' },
      { label: 'BED', value: 'GRAND KING' },
      { label: 'DINING', value: 'PRIVATE CHEF' },
    ],
    amenities: ['Enclosed Stone Courtyard', 'Bespoke Tea Sommelier', 'Dyson Airblade System', 'In-Villa Sound Architecture']
  },
  {
    id: 'res-102',
    roomNumber: '102',
    name: 'The Ocean Pavilion',
    tier: 'OVERWATER SANCTUARY',
    nightlyRate: 95000,
    mainImage: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1800&q=85',
    detailImage: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=85',
    specs: [
      { label: 'AREA', value: '185 M²' },
      { label: 'TERRACE', value: 'OVERWATER' },
      { label: 'LAGOON', value: 'DIRECT ACCESS' },
      { label: 'SHOWER', value: 'MONSOON DUAL' },
      { label: 'WELLNESS', value: 'IN-ROOM SPA' },
    ],
    amenities: ['Glass Viewing Sub-Floor', 'Private Sundeck Daybeds', 'Night Snorkel Equipment', 'Custom Linen Menu']
  }
]
