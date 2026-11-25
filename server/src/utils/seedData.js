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
 * - 15 Curated Luxury Suites:
 *   - Sindh Coast (4 Suites): SC-301, SC-302, SC-204, SC-102
 *   - Hunza Valley (4 Suites): HZ-101, HZ-102, HZ-201, HZ-301
 *   - Lahore Estate (4 Suites): LH-101, LH-102, LH-201, LH-202
 *   - Murree Pines (3 Suites): MR-101, MR-102, MR-201
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

    // 3. Create the 15 Luxury Suites across 4 Properties
    const rooms = await Room.create([
      // -------------------------------------------------------------
      // SINDH COASTAL SANCTUARY (4 Suites)
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
        ],
        description: 'Featuring floor-to-ceiling glass that opens directly to the coastal ocean breeze, overwater sundeck, and bespoke artisan interiors.',
        status: 'AVAILABLE',
        credentials: { wifiNetwork: 'Stayza_Guest', wifiPassword: 'pacific2026' },
        valetBay: 'Bay #102',
        assignedButler: 'Kamran Malik',
        cleaningTasks: { linen: true, bathSalts: true, minibar: true, inspection: true },
        assignedCleaner: 'Bilal Farooq',
      },

      // -------------------------------------------------------------
      // HUNZA VALLEY MOUNTAIN PAVILION (4 Suites)
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
        name: 'Attabad Alpine Chalet',
        tier: 'LAKESIDE MOUNTAIN VILLA',
        locationId: 'hunza',
        city: 'Karimabad, Hunza',
        roomType: 'villa',
        floor: 2,
        dimensions: '190 m²',
        baseNightlyRate: 95000,
        capacity: { adults: 3, children: 0 },
        amenities: [
          'Turquoise Glacial Lake Panorama',
          'Private Traditional Wood-Burning Stove',
          'Artisanal Apricot Wood Furnishings',
          'Private High-Altitude Heated Balcony',
        ],
        images: [
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795019381/hotel-suites/suite-204/suite-204-living.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795019387/hotel-suites/suite-204/suite-204-reading.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795019385/hotel-suites/suite-204/suite-204-bath.webp',
        ],
        description: 'Cantilevered over the alpine slopes with vistas reaching the brilliant turquoise waters of Attabad Lake.',
        status: 'AVAILABLE',
        credentials: { wifiNetwork: 'Stayza_Hunza', wifiPassword: 'karakoram2026' },
        valetBay: 'Mountain Carport #3',
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
        name: 'Haveli Courtyard Suite',
        tier: 'HERITAGE COURTYARD SUITE',
        locationId: 'lahore',
        city: 'Old Lahore, Punjab',
        roomType: 'suite',
        floor: 1,
        dimensions: '170 m²',
        baseNightlyRate: 80000,
        capacity: { adults: 2, children: 1 },
        amenities: [
          'Restored 19th-Century Mughal Brick Architecture',
          'Private Sunken Marble Courtyard with Water Fountain',
          'Bespoke Kashmiri Silk & Embroidered Linens',
          'Classical Sitar & Instrument Evening Concert Access',
        ],
        images: [
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795019379/hotel-suites/suite-204/suite-204-bedroom.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795019383/hotel-suites/suite-204/suite-204-terrace.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795019385/hotel-suites/suite-204/suite-204-bath.webp',
        ],
        description: 'Centered around a private open-air jasmine courtyard with flowing fountains and restored 19th-century haveli brick archways.',
        status: 'AVAILABLE',
        credentials: { wifiNetwork: 'Stayza_Lahore', wifiPassword: 'walledcity2026' },
        valetBay: 'Courtyard Bay #1',
        assignedButler: 'Hamza Malik',
        cleaningTasks: { linen: true, bathSalts: true, minibar: true, inspection: true },
        assignedCleaner: 'Hamza Malik',
      },
      {
        roomNumber: 'LH-102',
        name: 'Badshahi Minar Residence',
        tier: 'HISTORIC BALCONY RESIDENCE',
        locationId: 'lahore',
        city: 'Old Lahore, Punjab',
        roomType: 'suite',
        floor: 1,
        dimensions: '195 m²',
        baseNightlyRate: 92000,
        capacity: { adults: 3, children: 1 },
        amenities: [
          'Unobstructed View of Badshahi Mosque Minarets',
          'Terracotta Arched Sunset Dining Veranda',
          'Private Chef Curating Royal Mughal Cuisine',
          'Luxury Chauffeur Transfer from Allama Iqbal Airport',
        ],
        images: [
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1794997240/hotel-suites/room-05/room-05-1.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1794997243/hotel-suites/room-05/room-05-2.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1794997245/hotel-suites/room-05/room-05-3.webp',
        ],
        description: 'Overlooking the historic red sandstone minarets of Badshahi Mosque with high-vaulted ceilings and classical Mughal arch balconies.',
        status: 'AVAILABLE',
        credentials: { wifiNetwork: 'Stayza_Lahore', wifiPassword: 'walledcity2026' },
        valetBay: 'Courtyard Bay #2',
        assignedButler: 'Hamza Malik',
        cleaningTasks: { linen: true, bathSalts: true, minibar: true, inspection: true },
        assignedCleaner: 'Hamza Malik',
      },
      {
        roomNumber: 'LH-201',
        name: 'Mughal Royal Chamber',
        tier: 'PRESIDENTIAL HERITAGE SUITE',
        locationId: 'lahore',
        city: 'Old Lahore, Punjab',
        roomType: 'penthouse',
        floor: 2,
        dimensions: '250 m²',
        baseNightlyRate: 120000,
        capacity: { adults: 4, children: 0 },
        amenities: [
          'Hand-Carved Red Sandstone Archways & Frescoes',
          'Freestanding Green Onyx Soaking Bath',
          'Private Butler Serving Traditional Kahwa & High Tea',
          'VIP Walking Guide through Walled City Fort & Gates',
        ],
        images: [
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1794997211/hotel-suites/room-02/room-02-1.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1794997213/hotel-suites/room-02/room-02-2.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1794997217/hotel-suites/room-02/room-02-4.webp',
        ],
        description: 'The master suite of the cultural estate, featuring museum-grade hand-carved woodwork, antique silk carpets, and freestanding green onyx bath.',
        status: 'AVAILABLE',
        credentials: { wifiNetwork: 'Stayza_Lahore', wifiPassword: 'walledcity2026' },
        valetBay: 'Courtyard Bay #3',
        assignedButler: 'Hamza Malik',
        cleaningTasks: { linen: true, bathSalts: true, minibar: true, inspection: true },
        assignedCleaner: 'Hamza Malik',
      },
      {
        roomNumber: 'LH-202',
        name: 'Jasmine Garden Veranda',
        tier: 'GARDEN PAVILION',
        locationId: 'lahore',
        city: 'Old Lahore, Punjab',
        roomType: 'villa',
        floor: 2,
        dimensions: '160 m²',
        baseNightlyRate: 78000,
        capacity: { adults: 2, children: 0 },
        amenities: [
          'Enclosed Citrus Tree Garden with Wild Jasmine',
          'Sunlit Reading Nook with Classical Urdu Poetry',
          'Artisanal Brass Bathroom Fixtures',
          'Complimentary Daily Kashmiri Pink Tea Ceremony',
        ],
        images: [
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795019379/hotel-suites/suite-204/suite-204-bedroom.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795019383/hotel-suites/suite-204/suite-204-terrace.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795019385/hotel-suites/suite-204/suite-204-bath.webp',
        ],
        description: 'Surrounded by fragrant jasmine creepers, orange blossoms, and sunlit terracotta tile verandas.',
        status: 'AVAILABLE',
        credentials: { wifiNetwork: 'Stayza_Lahore', wifiPassword: 'walledcity2026' },
        valetBay: 'Courtyard Bay #4',
        assignedButler: 'Hamza Malik',
        cleaningTasks: { linen: true, bathSalts: true, minibar: true, inspection: true },
        assignedCleaner: 'Hamza Malik',
      },

      // -------------------------------------------------------------
      // MURREE PINECREST RETREAT (3 Suites)
      // -------------------------------------------------------------
      {
        roomNumber: 'MR-101',
        name: 'Cedar Forest Loft',
        tier: 'MOUNTAIN TIMBER LOFT',
        locationId: 'murree',
        city: 'Bhurban, Murree',
        roomType: 'suite',
        floor: 1,
        dimensions: '155 m²',
        baseNightlyRate: 72000,
        capacity: { adults: 2, children: 1 },
        amenities: [
          'Nestled Among Century-Old Deodar Pines',
          'Scandinavian Wood-Burning Hearth Stove',
          'Cantilevered Balcony Over Mist-Covered Valley',
          'Chauffeur Transfer from Islamabad Airport (ISB)',
        ],
        images: [
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1794997229/hotel-suites/room-04/room-04-1.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1794997231/hotel-suites/room-04/room-04-2.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1794997233/hotel-suites/room-04/room-04-3.webp',
        ],
        description: 'Immersed in deep pine forest silence, with raw timber interiors, heated wooden flooring, and a crackling iron hearth stove.',
        status: 'AVAILABLE',
        credentials: { wifiNetwork: 'Stayza_Murree', wifiPassword: 'pinecrest2026' },
        valetBay: 'Timber Carport #1',
        assignedButler: 'Usman Qazi',
        cleaningTasks: { linen: true, bathSalts: true, minibar: true, inspection: true },
        assignedCleaner: 'Usman Qazi',
      },
      {
        roomNumber: 'MR-102',
        name: 'Misty Valley Residence',
        tier: 'ALPINE CANOPY RESIDENCE',
        locationId: 'murree',
        city: 'Bhurban, Murree',
        roomType: 'suite',
        floor: 1,
        dimensions: '180 m²',
        baseNightlyRate: 85000,
        capacity: { adults: 3, children: 1 },
        amenities: [
          'Private Infrared Aromatic Cedar Sauna',
          'Sunken Natural Stone Heated Soaking Bath',
          'Panoramic Views of the Himalayan Foothills',
          'Artisanal Coffee & Single Origin Tea Bar',
        ],
        images: [
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795019381/hotel-suites/suite-204/suite-204-living.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795019387/hotel-suites/suite-204/suite-204-reading.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795019385/hotel-suites/suite-204/suite-204-bath.webp',
        ],
        description: 'Perched on the ridge canopy offering uninterrupted views of clouds drifting through the Himalayan pine valleys.',
        status: 'AVAILABLE',
        credentials: { wifiNetwork: 'Stayza_Murree', wifiPassword: 'pinecrest2026' },
        valetBay: 'Timber Carport #2',
        assignedButler: 'Usman Qazi',
        cleaningTasks: { linen: true, bathSalts: true, minibar: true, inspection: true },
        assignedCleaner: 'Usman Qazi',
      },
      {
        roomNumber: 'MR-201',
        name: 'The Ridge Penthouse Chalet',
        tier: 'PRESIDENTIAL TIMBER LODGE',
        locationId: 'murree',
        city: 'Bhurban, Murree',
        roomType: 'penthouse',
        floor: 2,
        dimensions: '235 m²',
        baseNightlyRate: 115000,
        capacity: { adults: 4, children: 0 },
        amenities: [
          '360° Panorama of Clouds Over Bhurban Valley',
          'Outdoor Temperature-Controlled Hydrotherapy Tub',
          'Private 24-Hour Chalet Host & Butler Service',
          'Direct Covered Timber Carport with Private Elevator',
        ],
        images: [
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1794997211/hotel-suites/room-02/room-02-1.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1794997213/hotel-suites/room-02/room-02-2.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1794997215/hotel-suites/room-02/room-02-3.webp',
        ],
        description: 'The crowning jewel of the Murree hills, with soaring cathedral wood ceilings, private outdoor heated hydrotherapy tub, and personal chalet butler.',
        status: 'AVAILABLE',
        credentials: { wifiNetwork: 'Stayza_Murree', wifiPassword: 'pinecrest2026' },
        valetBay: 'Timber Carport #3',
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
        details: 'Initial database provisioned with 15 luxury suites across 4 physical branches in Pakistan.',
        targetModel: 'System',
        targetId: 'SEED_INIT',
      },
    ])
    console.log('[Seed] Created activity audit logs.')

    console.log('\n======================================================')
    console.log('✅ DATABASE SEED COMPLETE: 15 SUITES ACROSS 4 PROPERTIES')
    console.log('------------------------------------------------------')
    console.log('Properties Seeded:')
    console.log('1. Sindh Coast:    4 Suites (SC-301, SC-302, SC-204, SC-102)')
    console.log('2. Hunza Valley:   4 Suites (HZ-101, HZ-102, HZ-201, HZ-301)')
    console.log('3. Lahore Estate:  4 Suites (LH-101, LH-102, LH-201, LH-202)')
    console.log('4. Murree Pines:   3 Suites (MR-101, MR-102, MR-201)')
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
