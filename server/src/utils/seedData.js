require('dotenv').config()
const mongoose = require('mongoose')
const connectDB = require('../config/db')
const User = require('../models/User')
const Room = require('../models/Room')
const Booking = require('../models/Booking')
const Payment = require('../models/Payment')
const ActivityLog = require('../models/ActivityLog')
const InventoryItem = require('../models/InventoryItem')
const HousekeepingTask = require('../models/HousekeepingTask')
const MaintenanceRequest = require('../models/MaintenanceRequest')
const { LOCATIONS } = require('../config/locations')

/**
 * Stayza HMS — Multi-Property Database Seed Script
 * 
 * Provisions realistic resort data matching the live website across 4 physical branches in Pakistan:
 * - 4 Stakeholder Accounts (Guest, Front Desk, Housekeeper, General Manager)
 * - 18 Curated Luxury Suites (Zero duplicate photography):
 *   - Sindh Coast (5 Suites): SC-301, SC-302, SC-204, SC-102, SC-401
 *   - Hunza Valley (5 Suites): HZ-101, HZ-102, HZ-201, HZ-202, HZ-301
 *   - Lahore Estate (4 Suites): LH-101, LH-102, LH-201, LH-202
 *   - Murree Pines (4 Suites): MR-101, MR-102, MR-201, MR-202
 * - 1 Active In-House Stay for Suite SC-301 (Dr. Tariq Khan) with incidentals & Safepay deposit
 * - Audit logs for system history
 * 
 * Execution: `npm run seed` inside the server/ directory
 */
const seedDatabase = async () => {
  try {
    await connectDB()
    console.log('[Seed] Connected to database. Purging existing collections...')

    // 1. Clean existing records cleanly in-place
    await Promise.all([
      User.deleteMany({}),
      Room.deleteMany({}),
      Booking.deleteMany({}),
      Payment.deleteMany({}),
      ActivityLog.deleteMany({}),
      InventoryItem.deleteMany({}),
      HousekeepingTask.deleteMany({}),
      MaintenanceRequest.deleteMany({}),
    ])
    console.log('[Seed] Database cleared.')

    // 2. Create Stakeholder Accounts across branches
    // Passwords are automatically hashed by User.js pre-save hook (bcrypt 10 rounds)
    const users = await User.create([
      {
        name: 'Dr. Tariq Khan',
        email: 'guest@stayza.com',
        password: 'Password123!',
        role: 'guest',
        phone: '+92 300 8219401',
        address: 'Defence Phase VIII, Karachi, Pakistan',
        activeReservationCode: 'TH-301-9041',
        assignedLocation: 'all',
        preferences: { pillowType: 'Feather & Down', climatePreference: '21°C' },
      },
      {
        name: 'Dr. Tariq Khan',
        email: 'tariq@luxury.pk',
        password: 'Password123!',
        role: 'guest',
        phone: '+92 300 8921455',
        address: 'Defence Phase VIII, Karachi, Pakistan',
        activeReservationCode: 'TH-301-9041',
        assignedLocation: 'all',
        preferences: { pillowType: 'Feather & Down', climatePreference: '21°C' },
      },
      {
        name: 'Ali Raza',
        email: 'reception@stayza.com',
        password: 'Password123!',
        role: 'receptionist',
        phone: '+92 321 4458921',
        address: 'Clifton Block 4, Karachi, Pakistan',
        assignedLocation: 'sindh-coast',
      },
      {
        name: 'Sara Ahmed',
        email: 'reception@habitas.com',
        password: 'Password123!',
        role: 'receptionist',
        phone: '+92 321 4455667',
        address: 'Clifton Block 4, Karachi, Pakistan',
        assignedLocation: 'hunza',
      },
      {
        name: 'Bilal Farooq',
        email: 'cleaning@stayza.com',
        password: 'Password123!',
        role: 'housekeeping',
        phone: '+92 333 9012488',
        address: 'PECHS Block 2, Karachi, Pakistan',
        assignedLocation: 'sindh-coast',
      },
      {
        name: 'Khurram Ali',
        email: 'cleaning@habitas.com',
        password: 'Password123!',
        role: 'housekeeping',
        phone: '+92 333 1122334',
        address: 'Karimabad, Hunza, Pakistan',
        assignedLocation: 'hunza',
      },
      {
        name: 'General Manager Tariq J.',
        email: 'admin@stayza.com',
        password: 'Password123!',
        role: 'admin',
        phone: '+92 300 8921455',
        address: 'Stayza Sanctuary Headquarters, Sindh Coast',
        assignedLocation: 'all',
      },
      {
        name: 'Karim Mansoor',
        email: 'admin@habitas.com',
        password: 'Password123!',
        role: 'admin',
        phone: '+92 300 0001122',
        address: 'Habitas Executive Operations, Sindh Coast',
        assignedLocation: 'all',
      },
    ])
    console.log(`[Seed] Created ${users.length} stakeholder accounts with encrypted passwords.`)

    const guestUser = users[0]
    const receptionistUser = users[2]
    const adminUser = users[6]
    const housekeeperUser = users[4]

    // 3. Create the 18 Luxury Suites across 4 Properties
    const rooms = await Room.create([
      // -------------------------------------------------------------
      // SINDH COASTAL SANCTUARY (5 Suites)
      // -------------------------------------------------------------
      {
        roomNumber: 'SC-301',
        name: 'The Horizon Penthouse',
        tier: 'PRESIDENTIAL PENTHOUSE',
        locationId: 'sindh-coast',
        city: 'Karachi, Sindh',
        roomType: 'penthouse',
        floor: 3,
        dimensions: '210 m²',
        baseNightlyRate: 110000,
        capacity: { adults: 2, children: 1 },
        amenities: [
          'Private Heated Infinity Pool',
          'Panoramic Ocean View',
          'Private Subterranean Valet Bay',
          'Bang & Olufsen Acoustics',
          '24/7 Dedicated Butler Service',
          'En-Suite Cedar Sauna & Rain Shower',
        ],
        images: [
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795019369/hotel-suites/suite-301/suite-301-bedroom.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795019371/hotel-suites/suite-301/suite-301-living.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795019373/hotel-suites/suite-301/suite-301-bath.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795019375/hotel-suites/suite-301/suite-301-vanity.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795019377/hotel-suites/suite-301/suite-301-vignette.webp',
        ],
        description: 'Perched on the highest bluff overlooking the Arabian Sea, the Horizon Penthouse features 210 square meters of serene private living with a cliffside plunge pool and dedicated butler.',
        status: 'OCCUPIED',
        credentials: { wifiNetwork: 'Stayza_Guest', wifiPassword: 'pacific2026' },
        valetBay: 'Bay #301 (Subterranean Lift)',
        assignedButler: 'Tariq J.',
        cleaningTasks: { linen: true, bathSalts: true, minibar: false, inspection: false },
        assignedCleaner: 'Bilal Farooq',
      },
      {
        roomNumber: 'SC-302',
        name: 'The Royal Palm Suite',
        tier: 'ROYAL DUPLEX SUITE',
        locationId: 'sindh-coast',
        city: 'Karachi, Sindh',
        roomType: 'penthouse',
        floor: 3,
        dimensions: '240 m²',
        baseNightlyRate: 125000,
        capacity: { adults: 2, children: 0 },
        amenities: [
          'Double-Height Coastal Windows',
          'Freestanding Italian Onyx Soaking Tub',
          'Custom Wine Cellar & Sommelier Service',
          'Chauffeured Airport Transfer Service',
        ],
        images: [
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1794997240/hotel-suites/room-05/room-05-1.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1794997243/hotel-suites/room-05/room-05-2.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1794997245/hotel-suites/room-05/room-05-3.webp',
        ],
        description: 'The epitome of coastal architectural luxury, featuring double-height ceiling voids, bespoke Italian craftsmanship, and uninterrupted horizon views.',
        status: 'AVAILABLE',
        credentials: { wifiNetwork: 'Stayza_Guest', wifiPassword: 'pacific2026' },
        valetBay: 'Bay #302',
        assignedButler: 'Tariq J.',
        cleaningTasks: { linen: true, bathSalts: true, minibar: true, inspection: true },
        assignedCleaner: 'Bilal Farooq',
      },
      {
        roomNumber: 'SC-204',
        name: 'The Courtyard Villa',
        tier: 'PRIVATE GARDEN VILLA',
        locationId: 'sindh-coast',
        city: 'Karachi, Sindh',
        roomType: 'villa',
        floor: 2,
        dimensions: '160 m²',
        baseNightlyRate: 75000,
        capacity: { adults: 2, children: 2 },
        amenities: [
          'Private Jasmine Zen Courtyard',
          'Outdoor Aromatic Cedar Spa Tub',
          'Private Dining Pavilion',
          'Egyptian Cotton 1000TC Bedding',
          'Subterranean Valet Bay',
        ],
        images: [
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795019379/hotel-suites/suite-204/suite-204-bedroom.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795019381/hotel-suites/suite-204/suite-204-living.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795019383/hotel-suites/suite-204/suite-204-terrace.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795019385/hotel-suites/suite-204/suite-204-bath.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795019387/hotel-suites/suite-204/suite-204-reading.webp',
        ],
        description: 'Enclosed within ancient limestone walls, the Courtyard Villa centers around an open-air reflecting pool, private garden pavilion, and sunken aromatic cedar bath.',
        status: 'DIRTY',
        credentials: { wifiNetwork: 'Stayza_Guest', wifiPassword: 'pacific2026' },
        valetBay: 'Bay #204',
        assignedButler: 'Zubair Shah',
        cleaningTasks: { linen: false, bathSalts: false, minibar: false, inspection: false },
        assignedCleaner: 'Bilal Farooq',
      },
      {
        roomNumber: 'SC-102',
        name: 'The Ocean Pavilion',
        tier: 'OVERWATER VILLA',
        locationId: 'sindh-coast',
        city: 'Karachi, Sindh',
        roomType: 'villa',
        floor: 1,
        dimensions: '185 m²',
        baseNightlyRate: 95000,
        capacity: { adults: 2, children: 1 },
        amenities: [
          'Direct Lagoon Access Path',
          'Cantilevered Sunset Daybed',
          'Complimentary High Tea Service',
          'Organic Cedar Spa Amenities',
          'Acoustic Soundproofing',
        ],
        images: [
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1794997220/hotel-suites/room-03/room-03-1.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1794997222/hotel-suites/room-03/room-03-2.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1794997224/hotel-suites/room-03/room-03-3.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1794997226/hotel-suites/room-03/room-03-4.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1794997227/hotel-suites/room-03/room-03-5.webp',
        ],
        description: 'Featuring floor-to-ceiling glass that opens directly to the coastal ocean breeze, overwater sundeck, and bespoke artisan interiors.',
        status: 'AVAILABLE',
        credentials: { wifiNetwork: 'Stayza_Guest', wifiPassword: 'pacific2026' },
        valetBay: 'Bay #102',
        assignedButler: 'Kamran Malik',
        cleaningTasks: { linen: true, bathSalts: true, minibar: true, inspection: true },
        assignedCleaner: 'Bilal Farooq',
      },
      {
        roomNumber: 'SC-401',
        name: 'The Palm Terrace Villa',
        tier: 'COASTAL CANOPY VILLA',
        locationId: 'sindh-coast',
        city: 'Karachi, Sindh',
        roomType: 'villa',
        floor: 4,
        dimensions: '175 m²',
        baseNightlyRate: 85000,
        capacity: { adults: 2, children: 1 },
        amenities: [
          'Private Balcony Immersed in Coastal Palm Canopies',
          'Walk-In Natural Sandstone Rain Shower',
          'Private Reading Library & Walnut Writing Desk',
          'Full Kitchenette with Artisan Coffee Service',
        ],
        images: [
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618641/hotel-suites/room-16/room-16-1.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618649/hotel-suites/room-16/room-16-4.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618644/hotel-suites/room-16/room-16-2.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618646/hotel-suites/room-16/room-16-3.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618652/hotel-suites/room-16/room-16-5.webp',
        ],
        description: 'Surrounded by lush tropical palm trees with wrap-around glass balcony views, natural sandstone bath, and quiet reading study.',
        status: 'AVAILABLE',
        credentials: { wifiNetwork: 'Stayza_Guest', wifiPassword: 'pacific2026' },
        valetBay: 'Bay #401',
        assignedButler: 'Kamran Malik',
        cleaningTasks: { linen: true, bathSalts: true, minibar: true, inspection: true },
        assignedCleaner: 'Bilal Farooq',
      },

      // -------------------------------------------------------------
      // HUNZA VALLEY MOUNTAIN PAVILION (5 Suites)
      // -------------------------------------------------------------
      {
        roomNumber: 'HZ-101',
        name: 'Rakaposhi Glacier Suite',
        tier: 'ALPINE GLACIER RESIDENCE',
        locationId: 'hunza',
        city: 'Karimabad, Hunza',
        roomType: 'suite',
        floor: 1,
        dimensions: '220 m²',
        baseNightlyRate: 105000,
        capacity: { adults: 4, children: 1 },
        amenities: [
          'Panoramic Views of 7,788m Rakaposhi Peak',
          'Private Heated Cedar Soaking Hot Tub',
          'Karakoram Herbal Tea Bar & Samovar',
          'Helipad Shuttle from Gilgit Airport Included',
        ],
        images: [
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1794997229/hotel-suites/room-04/room-04-1.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1794997231/hotel-suites/room-04/room-04-2.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1794997233/hotel-suites/room-04/room-04-3.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1794997235/hotel-suites/room-04/room-04-4.webp',
        ],
        description: 'Perched high above the Hunza River valley beneath the snow-capped peak of Rakaposhi, featuring heated cedar decks and panoramic mountain sunrise vistas.',
        status: 'AVAILABLE',
        credentials: { wifiNetwork: 'Stayza_Hunza', wifiPassword: 'karakoram2026' },
        valetBay: 'Mountain Carport #1',
        assignedButler: 'Khurram Ali',
        cleaningTasks: { linen: true, bathSalts: true, minibar: true, inspection: true },
        assignedCleaner: 'Khurram Ali',
      },
      {
        roomNumber: 'HZ-102',
        name: 'Ultar Peak Residence',
        tier: 'PANORAMIC CHALET',
        locationId: 'hunza',
        city: 'Karimabad, Hunza',
        roomType: 'suite',
        floor: 1,
        dimensions: '185 m²',
        baseNightlyRate: 88000,
        capacity: { adults: 2, children: 1 },
        amenities: [
          'Roaring Natural River Stone Hearth',
          'Handcrafted Woolen Blankets & Down Quilts',
          'Private Outdoor Stargazing Daybed',
          'High-Speed Satellite Starlink Internet',
        ],
        images: [
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1794997207/hotel-suites/room-01/room-01-4.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1794997084/hotel-suites/room-01/room-01-1.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1794997205/hotel-suites/room-01/room-01-3.webp',
        ],
        description: 'Facing the Ultar Glacier cirque, featuring monolithic stone masonry, a crackling central fireplace, and raw timber beam construction.',
        status: 'AVAILABLE',
        credentials: { wifiNetwork: 'Stayza_Hunza', wifiPassword: 'karakoram2026' },
        valetBay: 'Mountain Carport #2',
        assignedButler: 'Khurram Ali',
        cleaningTasks: { linen: true, bathSalts: true, minibar: true, inspection: true },
        assignedCleaner: 'Khurram Ali',
      },
      {
        roomNumber: 'HZ-201',
        name: 'The Executive Suite',
        tier: 'EXECUTIVE STUDY RESIDENCE',
        locationId: 'hunza',
        city: 'Karimabad, Hunza',
        roomType: 'suite',
        floor: 2,
        dimensions: '190 m²',
        baseNightlyRate: 92000,
        capacity: { adults: 2, children: 1 },
        amenities: [
          'Private Two-Person Walnut Work Study & Library',
          'Slate Grey Stone Spa Bathroom with Freestanding Tub',
          'Full Marble Waterfall Kitchen with Espresso Bar',
          'High-Speed Starlink Wi-Fi for Remote Executive Stays',
        ],
        images: [
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618598/hotel-suites/room-12/room-12-5.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618587/hotel-suites/room-12/room-12-1.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618590/hotel-suites/room-12/room-12-2.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618595/hotel-suites/room-12/room-12-4.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618592/hotel-suites/room-12/room-12-3.webp',
        ],
        description: 'Tailored for serene executive mountain retreats, featuring a dual-workstation walnut study, slate stone spa bath, and vertical navy channel-tufted master suite.',
        status: 'AVAILABLE',
        credentials: { wifiNetwork: 'Stayza_Hunza', wifiPassword: 'karakoram2026' },
        valetBay: 'Mountain Carport #3',
        assignedButler: 'Khurram Ali',
        cleaningTasks: { linen: true, bathSalts: true, minibar: true, inspection: true },
        assignedCleaner: 'Khurram Ali',
      },
      {
        roomNumber: 'HZ-202',
        name: 'The Sunlit Family Villa',
        tier: 'TWO-BEDROOM FAMILY VILLA',
        locationId: 'hunza',
        city: 'Karimabad, Hunza',
        roomType: 'villa',
        floor: 2,
        dimensions: '230 m²',
        baseNightlyRate: 125000,
        capacity: { adults: 3, children: 2 },
        amenities: [
          'Separate Twin Kids’ Bedroom with Dual Study Desks',
          'Family-Friendly Bathroom with Inset Tub & Step Stool',
          'Full Oak Kitchen & Round Family Dining Table',
          'Curved Bouclé Sectional & Children’s Reading Library',
        ],
        images: [
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618624/hotel-suites/room-14/room-14-5.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618622/hotel-suites/room-14/room-14-4.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618616/hotel-suites/room-14/room-14-2.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618618/hotel-suites/room-14/room-14-3.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618613/hotel-suites/room-14/room-14-1.webp',
        ],
        description: 'Warm natural oak two-bedroom family sanctuary featuring a twin kids’ study bedroom, organic stone bathroom, and sunlit bouclé family lounge.',
        status: 'AVAILABLE',
        credentials: { wifiNetwork: 'Stayza_Hunza', wifiPassword: 'karakoram2026' },
        valetBay: 'Mountain Carport #4',
        assignedButler: 'Khurram Ali',
        cleaningTasks: { linen: true, bathSalts: true, minibar: true, inspection: true },
        assignedCleaner: 'Khurram Ali',
      },
      {
        roomNumber: 'HZ-301',
        name: 'Karakoram Presidential Lodge',
        tier: 'PRESIDENTIAL MOUNTAIN LODGE',
        locationId: 'hunza',
        city: 'Karimabad, Hunza',
        roomType: 'penthouse',
        floor: 3,
        dimensions: '270 m²',
        baseNightlyRate: 130000,
        capacity: { adults: 4, children: 2 },
        amenities: [
          'Direct Private Helipad Access on Bluff',
          'Heated Outdoor Hydrotherapy Plunge Pool',
          'Dedicated 24/7 Butler & Local Mountain Guide',
          'Bespoke Wine & Single Malt Library',
        ],
        images: [
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1794997211/hotel-suites/room-02/room-02-1.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1794997213/hotel-suites/room-02/room-02-2.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1794997215/hotel-suites/room-02/room-02-3.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1794997217/hotel-suites/room-02/room-02-4.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1794997218/hotel-suites/room-02/room-02-5.webp',
        ],
        description: 'The highest luxury lodge in northern Pakistan, offering 360-degree vistas across five 7,000-meter peaks, private heated outdoor plunge bath, and direct helipad access.',
        status: 'AVAILABLE',
        credentials: { wifiNetwork: 'Stayza_Hunza', wifiPassword: 'karakoram2026' },
        valetBay: 'Helipad Pad #2',
        assignedButler: 'Khurram Ali',
        cleaningTasks: { linen: true, bathSalts: true, minibar: true, inspection: true },
        assignedCleaner: 'Khurram Ali',
      },

      // -------------------------------------------------------------
      // LAHORE CULTURAL ESTATE (4 Suites)
      // -------------------------------------------------------------
      {
        roomNumber: 'LH-101',
        name: 'The Heritage Suite',
        tier: 'CLASSIC HERITAGE RESIDENCE',
        locationId: 'lahore',
        city: 'Old Lahore, Punjab',
        roomType: 'suite',
        floor: 1,
        dimensions: '175 m²',
        baseNightlyRate: 98000,
        capacity: { adults: 2, children: 0 },
        amenities: [
          'Tall French Balcony Doors & Classic Wall Moldings',
          'Freestanding Oval Tub & Walk-In Glass Rain Shower',
          'Private Walk-In Wardrobe with Illuminated Oak Vanity',
          'Private Bistro Kitchen & Morning High-Tea Service',
        ],
        images: [
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618585/hotel-suites/room-11/room-11-5.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618582/hotel-suites/room-11/room-11-4.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618577/hotel-suites/room-11/room-11-2.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618580/hotel-suites/room-11/room-11-3.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618575/hotel-suites/room-11/room-11-1.webp',
        ],
        description: 'Bright classic residence featuring boiserie wall moldings, chevron oak parquet, freestanding soaking bath, and private walk-in wardrobe.',
        status: 'AVAILABLE',
        credentials: { wifiNetwork: 'Stayza_Lahore', wifiPassword: 'walledcity2026' },
        valetBay: 'Courtyard Bay #1',
        assignedButler: 'Hamza Malik',
        cleaningTasks: { linen: true, bathSalts: true, minibar: true, inspection: true },
        assignedCleaner: 'Hamza Malik',
      },
      {
        roomNumber: 'LH-102',
        name: 'The Emerald Penthouse',
        tier: 'ART DECO GRAND PENTHOUSE',
        locationId: 'lahore',
        city: 'Old Lahore, Punjab',
        roomType: 'penthouse',
        floor: 1,
        dimensions: '245 m²',
        baseNightlyRate: 130000,
        capacity: { adults: 4, children: 0 },
        amenities: [
          'Emerald Velvet Curated Salon & Crystal Chandeliers',
          'Private Walk-In Dressing Suite with Jewelry Island',
          'Calacatta Marble Waterfall Chef Kitchen',
          'Dedicated 24-Hour Private Butler & Chauffeur',
        ],
        images: [
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618561/hotel-suites/room-09/room-09-5.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618558/hotel-suites/room-09/room-09-4.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618555/hotel-suites/room-09/room-09-3.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618550/hotel-suites/room-09/room-09-1.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618553/hotel-suites/room-09/room-09-2.webp',
        ],
        description: 'Grand Art Deco penthouse adorned with emerald velvet seating, brass wall inlays, crystal chandeliers, and a marble island dressing room.',
        status: 'AVAILABLE',
        credentials: { wifiNetwork: 'Stayza_Lahore', wifiPassword: 'walledcity2026' },
        valetBay: 'Courtyard Bay #2',
        assignedButler: 'Hamza Malik',
        cleaningTasks: { linen: true, bathSalts: true, minibar: true, inspection: true },
        assignedCleaner: 'Hamza Malik',
      },
      {
        roomNumber: 'LH-201',
        name: 'The Presidential Spa Suite',
        tier: 'PRESIDENTIAL WELLNESS RESIDENCE',
        locationId: 'lahore',
        city: 'Old Lahore, Punjab',
        roomType: 'penthouse',
        floor: 2,
        dimensions: '310 m²',
        baseNightlyRate: 150000,
        capacity: { adults: 4, children: 0 },
        amenities: [
          'Private In-Suite Spa Room with Hydraulic Massage Table & Yoga Gear',
          'Formal 8-Seater Calacatta Marble Dining Room & Wine Cabinets',
          'Sound-Insulated Acoustic Navy Cinema Lounge',
          'VIP Airport Limousine & Dedicated 24/7 Butler',
        ],
        images: [
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618677/hotel-suites/room-18/room-18-5.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618673/hotel-suites/room-18/room-18-3.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618668/hotel-suites/room-18/room-18-1.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618670/hotel-suites/room-18/room-18-2.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618675/hotel-suites/room-18/room-18-4.webp',
        ],
        description: 'Our flagship presidential residence featuring an in-suite wellness massage studio, formal 8-seat dining salon, acoustic cinema room, and private dressing island.',
        status: 'AVAILABLE',
        credentials: { wifiNetwork: 'Stayza_Lahore', wifiPassword: 'walledcity2026' },
        valetBay: 'Courtyard Bay #3',
        assignedButler: 'Hamza Malik',
        cleaningTasks: { linen: true, bathSalts: true, minibar: true, inspection: true },
        assignedCleaner: 'Hamza Malik',
      },
      {
        roomNumber: 'LH-202',
        name: 'The Grand Family Suite',
        tier: 'TWO-BEDROOM FAMILY RESIDENCE',
        locationId: 'lahore',
        city: 'Old Lahore, Punjab',
        roomType: 'villa',
        floor: 2,
        dimensions: '225 m²',
        baseNightlyRate: 120000,
        capacity: { adults: 3, children: 2 },
        amenities: [
          '2 Full Bedrooms: King Master + Blue/Sage Twin Kids’ Room',
          'Family Living Salon with Dedicated Children’s Book & Toy Credenza',
          'Full Kitchen Island, Double Ovens & 4-Person Dining Table',
          'Child-Friendly Dual Vanity Bath with Step Stool & Soaking Tub',
        ],
        images: [
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618611/hotel-suites/room-13/room-13-5.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618606/hotel-suites/room-13/room-13-3.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618608/hotel-suites/room-13/room-13-4.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618600/hotel-suites/room-13/room-13-1.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618603/hotel-suites/room-13/room-13-2.webp',
        ],
        description: 'Spacious two-bedroom family suite combining a tailored parents’ master chamber with a dedicated twin kids’ bedroom, study desks, and full gourmet kitchen.',
        status: 'AVAILABLE',
        credentials: { wifiNetwork: 'Stayza_Lahore', wifiPassword: 'walledcity2026' },
        valetBay: 'Courtyard Bay #4',
        assignedButler: 'Hamza Malik',
        cleaningTasks: { linen: true, bathSalts: true, minibar: true, inspection: true },
        assignedCleaner: 'Hamza Malik',
      },

      // -------------------------------------------------------------
      // MURREE PINECREST RETREAT (4 Suites)
      // -------------------------------------------------------------
      {
        roomNumber: 'MR-101',
        name: 'The Cedar Villa',
        tier: 'TIMBER & STONE SANCTUARY',
        locationId: 'murree',
        city: 'Bhurban, Murree',
        roomType: 'villa',
        floor: 1,
        dimensions: '180 m²',
        baseNightlyRate: 88000,
        capacity: { adults: 2, children: 1 },
        amenities: [
          'Hand-Troweled Limewash Plaster Walls & Rough Timber Ceiling Beams',
          'Chiseled Travertine Trough Sink & Heated Towel Ladder',
          'Curved Oatmeal Bouclé Sofa & Floor-to-Ceiling Pine Views',
          'Private Glass-Door Walnut Walk-In Wardrobe & Vanity',
        ],
        images: [
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618627/hotel-suites/room-15/room-15-1.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618630/hotel-suites/room-15/room-15-2.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618635/hotel-suites/room-15/room-15-4.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618633/hotel-suites/room-15/room-15-3.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618638/hotel-suites/room-15/room-15-5.webp',
        ],
        description: 'Peaceful timber-and-limewash sanctuary nestled in deep Bhurban forest with exposed ceiling beams, curved bouclé salon, and chiseled travertine bath.',
        status: 'AVAILABLE',
        credentials: { wifiNetwork: 'Stayza_Murree', wifiPassword: 'pinecrest2026' },
        valetBay: 'Timber Carport #1',
        assignedButler: 'Usman Qazi',
        cleaningTasks: { linen: true, bathSalts: true, minibar: true, inspection: true },
        assignedCleaner: 'Usman Qazi',
      },
      {
        roomNumber: 'MR-102',
        name: 'The Parkview Suite',
        tier: 'FOREST TERRACE RESIDENCE',
        locationId: 'murree',
        city: 'Bhurban, Murree',
        roomType: 'villa',
        floor: 1,
        dimensions: '185 m²',
        baseNightlyRate: 90000,
        capacity: { adults: 2, children: 1 },
        amenities: [
          'Private Teak Wood Outdoor Balcony Lounge Overlooking Trees',
          'Limestone En-Suite Rain Shower with Built-In Heated Bench',
          'Herringbone Parquet Flooring & Warm Walnut Millwork',
          'Full Mid-Century Kitchenette & Morning Espresso Setup',
        ],
        images: [
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618655/hotel-suites/room-17/room-17-1.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618660/hotel-suites/room-17/room-17-3.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618657/hotel-suites/room-17/room-17-2.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618663/hotel-suites/room-17/room-17-4.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618665/hotel-suites/room-17/room-17-5.webp',
        ],
        description: 'Mid-century walnut suite opening onto a spacious teak outdoor balcony lounge framed by evergreen treetops, paired with a heated bench shower.',
        status: 'AVAILABLE',
        credentials: { wifiNetwork: 'Stayza_Murree', wifiPassword: 'pinecrest2026' },
        valetBay: 'Timber Carport #2',
        assignedButler: 'Usman Qazi',
        cleaningTasks: { linen: true, bathSalts: true, minibar: true, inspection: true },
        assignedCleaner: 'Usman Qazi',
      },
      {
        roomNumber: 'MR-201',
        name: 'The Sky Loft Suite',
        tier: 'ARCHITECTURAL LOFT PENTHOUSE',
        locationId: 'murree',
        city: 'Bhurban, Murree',
        roomType: 'penthouse',
        floor: 2,
        dimensions: '235 m²',
        baseNightlyRate: 115000,
        capacity: { adults: 4, children: 0 },
        amenities: [
          'Architectural Concrete Beams & Warm Recessed Cove Lighting',
          'Private Fluted-Walnut Home Theater & Media Lounge',
          'Dark Stone Waterfall Kitchen Island & Formal Dining Table',
          'Private Balcony & Personal Mountain Chalet Butler',
        ],
        images: [
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618547/hotel-suites/room-08/room-08-5.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618537/hotel-suites/room-08/room-08-1.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618539/hotel-suites/room-08/room-08-2.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618542/hotel-suites/room-08/room-08-3.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618545/hotel-suites/room-08/room-08-4.webp',
        ],
        description: 'Contemporary loft penthouse crafted in board-formed concrete and rich dark walnut, complete with a fluted media cinema room and open waterfall kitchen.',
        status: 'AVAILABLE',
        credentials: { wifiNetwork: 'Stayza_Murree', wifiPassword: 'pinecrest2026' },
        valetBay: 'Timber Carport #3',
        assignedButler: 'Usman Qazi',
        cleaningTasks: { linen: true, bathSalts: true, minibar: true, inspection: true },
        assignedCleaner: 'Usman Qazi',
      },
      {
        roomNumber: 'MR-202',
        name: 'The Skyline Suite',
        tier: 'HORIZON STUDY PENTHOUSE',
        locationId: 'murree',
        city: 'Bhurban, Murree',
        roomType: 'penthouse',
        floor: 2,
        dimensions: '205 m²',
        baseNightlyRate: 105000,
        capacity: { adults: 2, children: 1 },
        amenities: [
          'Floor-to-Ceiling Panoramic Windows with Mountain Horizon Vistas',
          'Dedicated Private Executive Office & Illuminated Bookshelves',
          'Travertine Waterfall Kitchen & 6-Seater Walnut Dining',
          'Sandstone & Bronze-Inlay Calm Minimalist Interiors',
        ],
        images: [
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618569/hotel-suites/room-10/room-10-3.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618564/hotel-suites/room-10/room-10-1.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618567/hotel-suites/room-10/room-10-2.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795618572/hotel-suites/room-10/room-10-4.webp',
        ],
        description: 'Serene elevated skyline suite framed by full-height panorama windows, sandstone wall panels, executive study desk, and travertine island dining.',
        status: 'AVAILABLE',
        credentials: { wifiNetwork: 'Stayza_Murree', wifiPassword: 'pinecrest2026' },
        valetBay: 'Timber Carport #4',
        assignedButler: 'Usman Qazi',
        cleaningTasks: { linen: true, bathSalts: true, minibar: true, inspection: true },
        assignedCleaner: 'Usman Qazi',
      },
    ])
    console.log(`[Seed] Created ${rooms.length} luxury suites across 4 physical properties.`)

    const suiteSC301 = rooms[0]

    // 4. Create Active In-House Stay for Suite SC-301 (Dr. Tariq Khan)
    const checkIn = new Date('2026-11-24T14:00:00Z')
    const checkOut = new Date('2026-11-28T12:00:00Z')
    const nights = 4
    const roomRate = 110000
    const subtotal = roomRate * nights // 440,000
    const taxAmount = 0 // Transparent all-inclusive pricing
    const totalAmount = subtotal
    const advancePaid = Math.round(totalAmount * 0.3) // 132,000
    const balanceDue = totalAmount - advancePaid // 308,000

    const booking = await Booking.create({
      bookingReference: 'TH-301-9041',
      guest: guestUser._id,
      room: suiteSC301._id,
      locationId: 'sindh-coast',
      locationName: 'Stayza Coastal Sanctuary',
      roomNumber: 'SC-301',
      checkInDate: checkIn,
      checkOutDate: checkOut,
      numberOfNights: nights,
      guestDetails: {
        name: guestUser.name,
        email: guestUser.email,
        phone: guestUser.phone,
        specialRequests: 'High-floor quiet suite, extra cedar bath salts, late checkout if available.',
      },
      pricingSnapshot: {
        nightlyRate: roomRate,
        subtotal,
        taxPercent: 0,
        taxAmount,
        totalAmount,
        advancePercent: 30,
        advanceAmount: advancePaid,
        advancePaid,
        balanceDue,
        currency: 'PKR',
      },
      status: 'CHECKED_IN',
      checkedInAt: checkIn,
      inStaySettings: {
        isDND: false,
        climateMode: 'ocean',
      },
      digitalKeyAccess: {
        isUnlocked: true,
        lastUnlockedAt: new Date(),
      },
      incidentals: [
        {
          id: 'srv-1',
          title: 'Private Coastal Helipad Transfer',
          price: 25000,
          category: 'Transport',
          time: '24 Nov 14:30',
          addedBy: 'Concierge Desk',
        },
        {
          id: 'srv-2',
          title: 'Coastal Line-Catch Seafood Tasting Dinner',
          price: 15000,
          category: 'Dining',
          time: '25 Nov 20:15',
          addedBy: 'In-House Guest',
        },
      ],
      feedback: {
        rating: 5,
        comment: 'Exceptional architectural serenity and world-class discreet service.',
        tags: ['Suite Comfort', 'Ocean View', 'Butler Tariq'],
        submittedAt: new Date(),
      },
    })
    console.log(`[Seed] Created active reservation: ${booking.bookingReference} for ${booking.guestDetails.name}`)

    // 5. Create 30% Safepay Advance Deposit Ledger Record
    const payment = await Payment.create({
      bookingId: booking._id,
      guestId: guestUser._id,
      locationId: 'sindh-coast',
      transactionType: 'ADVANCE_30',
      paymentMethod: 'SAFEPAY_ONLINE',
      amount: advancePaid,
      currency: 'PKR',
      status: 'SUCCEEDED',
      idempotencyKey: 'IDEMP-TH-301-ADVANCE-2026',
      safepayReference: 'SPF-892104',
      safepaySignature: 'sha256_mock_verified_signature_9921',
      receiptNumber: 'RCP-2026-9041',
      notes: '30% Advance Deposit paid via Safepay Sandbox (Visa ***4242)',
      paidAt: checkIn,
    })
    console.log(`[Seed] Created payment ledger: ${payment.receiptNumber} (PKR ${payment.amount.toLocaleString()})`)

    // 6. Seed Everyday Hotel Supplies Inventory (7 Core Items)
    const inventoryItems = await InventoryItem.create([
      { name: 'Bed Sheets', category: 'linen', inStock: 25, inLaundry: 8, minAlertLevel: 5, unit: 'sets' },
      { name: 'Bath Towels', category: 'linen', inStock: 40, inLaundry: 12, minAlertLevel: 10, unit: 'sets' },
      { name: 'Pillows & Blankets', category: 'linen', inStock: 20, inLaundry: 4, minAlertLevel: 5, unit: 'sets' },
      { name: 'Soap & Shampoo', category: 'consumable', inStock: 50, inLaundry: 0, minAlertLevel: 10, unit: 'bottles' },
      { name: 'Water Bottles', category: 'consumable', inStock: 60, inLaundry: 0, minAlertLevel: 15, unit: 'bottles' },
      { name: 'Tea & Coffee Kits', category: 'consumable', inStock: 45, inLaundry: 0, minAlertLevel: 10, unit: 'packs' },
      { name: 'Snacks', category: 'consumable', inStock: 40, inLaundry: 0, minAlertLevel: 10, unit: 'packs' },
    ])
    console.log(`[Seed] Seeded ${inventoryItems.length} everyday hotel supplies & linen inventory items.`)

    // 7. Seed Active Housekeeping Tasks (Turnovers & Tidies)
    const suiteSC204 = rooms.find((r) => r.roomNumber === 'SC-204')
    await HousekeepingTask.create([
      {
        room: suiteSC204._id,
        roomNumber: 'SC-204',
        assignedTo: housekeeperUser?._id,
        assignedName: housekeeperUser?.name || 'Bilal Farooq',
        taskType: 'TURNOVER_CLEAN',
        priority: 'HIGH',
        status: 'PENDING',
        checklist: { linen: false, bathSalts: false, minibar: false, inspection: false },
        notes: 'Guest checked out at 11:00 AM. Priority turnover for incoming 3:00 PM VIP arrival.',
      },
      {
        room: suiteSC301._id,
        roomNumber: 'SC-301',
        assignedTo: housekeeperUser?._id,
        assignedName: housekeeperUser?.name || 'Bilal Farooq',
        taskType: 'DAILY_TIDY',
        priority: 'NORMAL',
        status: 'IN_PROGRESS',
        checklist: { linen: true, bathSalts: true, minibar: false, inspection: false },
        notes: 'Morning refresh requested by Dr. Tariq Khan.',
      },
    ])
    console.log('[Seed] Created active housekeeping tasks.')

    // 8. Seed Maintenance Tickets
    const suiteHZ101 = rooms.find((r) => r.roomNumber === 'HZ-101')
    const suiteSC102 = rooms.find((r) => r.roomNumber === 'SC-102')

    await MaintenanceRequest.create([
      {
        room: suiteHZ101._id,
        roomNumber: 'HZ-101',
        reportedBy: housekeeperUser?._id,
        reportedByName: 'Khurram Ali',
        assignedTechnician: 'Chief Engineer Rashid',
        issueCategory: 'HVAC_AIR_CONDITIONING',
        issueDescription: 'Thermostat sensor calibration running 2°C higher than setpoint in alpine cold.',
        priority: 'MEDIUM',
        status: 'REPORTED',
      },
      {
        room: suiteSC102._id,
        roomNumber: 'SC-102',
        reportedBy: housekeeperUser?._id,
        reportedByName: 'Bilal Farooq',
        assignedTechnician: 'Chief Engineer Rashid',
        issueCategory: 'PLUMBING',
        issueDescription: 'Balcony plunge pool filtration nozzle pressure check.',
        priority: 'LOW',
        status: 'RESOLVED',
        resolutionNotes: 'Filter flushed and water flow restored to optimal gpm.',
        resolvedAt: new Date(),
      },
    ])
    console.log('[Seed] Created maintenance requests.')

    // 9. Create Initial System Activity Logs
    await ActivityLog.create([
      {
        userId: guestUser._id,
        actorName: guestUser.name,
        action: 'ONLINE_RESERVATION_CREATED',
        category: 'RESERVATION',
        details: `Online booking created for Suite SC-301. Safepay 30% advance deposit paid (PKR ${advancePaid.toLocaleString()}).`,
        targetModel: 'Booking',
        targetId: booking._id.toString(),
      },
      {
        userId: receptionistUser._id,
        actorName: receptionistUser.name,
        action: 'CHECK_IN_GUEST',
        category: 'PMS_FRONT_DESK',
        details: `Guest Dr. Tariq Khan checked in to Suite SC-301. NFC Keycard dispatched.`,
        targetModel: 'Booking',
        targetId: booking._id.toString(),
      },
      {
        userId: adminUser._id,
        actorName: adminUser.name,
        action: 'SYSTEM_SEEDED',
        category: 'SYSTEM',
        details: 'Initial database provisioned with 18 luxury suites across 4 physical branches in Pakistan.',
        targetModel: 'System',
        targetId: 'SEED_INIT',
      },
    ])
    console.log('[Seed] Created activity audit logs.')

    console.log('\n======================================================')
    console.log('✅ DATABASE SEED COMPLETE: 18 SUITES ACROSS 4 PROPERTIES')
    console.log('------------------------------------------------------')
    console.log('Properties Seeded:')
    console.log('1. Sindh Coast:    5 Suites (SC-301, SC-302, SC-204, SC-102, SC-401)')
    console.log('2. Hunza Valley:   5 Suites (HZ-101, HZ-102, HZ-201, HZ-202, HZ-301)')
    console.log('3. Lahore Estate:  4 Suites (LH-101, LH-102, LH-201, LH-202)')
    console.log('4. Murree Pines:   4 Suites (MR-101, MR-102, MR-201, MR-202)')
    console.log('------------------------------------------------------')
    console.log('Demo Credentials for Evaluation & Testing:')
    console.log('1. Guest:        guest@stayza.com      / Password123!')
    console.log('2. Front Desk:   reception@stayza.com  / Password123!')
    console.log('3. Housekeeping: cleaning@stayza.com   / Password123!')
    console.log('4. Admin / GM:   admin@stayza.com      / Password123!')
    console.log('Active Stay Ref: TH-301-9041 (Suite SC-301)')
    console.log('======================================================\n')

    await mongoose.disconnect()
    process.exit(0)
  } catch (error) {
    console.error(`[Seed Error] Failed to seed database: ${error.message}`)
    console.error(error)
    process.exit(1)
  }
}

seedDatabase()
