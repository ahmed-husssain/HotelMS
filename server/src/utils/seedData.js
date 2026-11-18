require('dotenv').config()
const mongoose = require('mongoose')
const connectDB = require('../config/db')
const User = require('../models/User')
const Room = require('../models/Room')
const Booking = require('../models/Booking')
const Payment = require('../models/Payment')
const ActivityLog = require('../models/ActivityLog')

/**
 * LuxuryStay / Habitas — Rich Database Seed Script
 * 
 * Provisions realistic resort data matching the live website:
 * - 4 Stakeholder Accounts (Guest, Front Desk, Housekeeper, General Manager)
 * - 5 Signature Ocean Suites with full amenities, operational status & Cloudinary CDN galleries
 * - 1 Active In-House Stay for Suite 301 (Dr. Tariq Khan) with incidentals & Safepay deposit
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
    ])
    console.log('[Seed] Database cleared.')

    // 2. Create the 4 Canonical Stakeholder Accounts
    // Passwords are automatically hashed by User.js pre-save hook
    const users = await User.create([
      {
        name: 'Dr. Tariq Khan',
        email: 'guest@habitas.com',
        password: 'Password123!',
        role: 'guest',
        phone: '+92 300 8219401',
        address: 'Defence Phase VIII, Karachi, Pakistan',
        activeReservationCode: 'TH-301-9041',
        preferences: { pillowType: 'Feather & Down', climatePreference: '21°C' },
      },
      {
        name: 'Ali Raza',
        email: 'reception@habitas.com',
        password: 'Password123!',
        role: 'receptionist',
        phone: '+92 321 4458921',
        address: 'Clifton Block 4, Karachi, Pakistan',
      },
      {
        name: 'Bilal Farooq',
        email: 'cleaning@habitas.com',
        password: 'Password123!',
        role: 'housekeeping',
        phone: '+92 333 9012488',
        address: 'PECHS Block 2, Karachi, Pakistan',
      },
      {
        name: 'General Manager Tariq J.',
        email: 'admin@habitas.com',
        password: 'Password123!',
        role: 'admin',
        phone: '+92 300 8921455',
        address: 'Habitas Estate Headquarters, Sindh Coast',
      },
    ])
    console.log(`[Seed] Created ${users.length} stakeholder accounts with encrypted passwords.`)

    const guestUser = users[0]
    const receptionistUser = users[1]
    const adminUser = users[3]

    // 3. Create the 5 Luxury Suites with Cloudinary CDN Imagery
    const rooms = await Room.create([
      {
        roomNumber: 'Suite 301',
        name: 'The Horizon Penthouse',
        tier: 'PRESIDENTIAL SUITE',
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
        credentials: { wifiNetwork: 'Habitas_Guest', wifiPassword: 'pacific2026' },
        valetBay: 'Bay #301 (Subterranean Lift)',
        assignedButler: 'Tariq J.',
        cleaningTasks: { linen: true, bathSalts: true, minibar: false, inspection: false },
        assignedCleaner: 'Bilal Farooq',
      },
      {
        roomNumber: 'Suite 204',
        name: 'The Courtyard Villa',
        tier: 'PRIVATE COURTYARD VILLA',
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
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1795019389/hotel-suites/suite-204/suite-204-vignette.webp',
        ],
        description: 'Enclosed within ancient limestone walls, the Courtyard Villa centers around an open-air reflecting pool, private garden pavilion, and sunken aromatic cedar bath.',
        status: 'DIRTY',
        credentials: { wifiNetwork: 'Habitas_Guest', wifiPassword: 'pacific2026' },
        valetBay: 'Bay #204',
        assignedButler: 'Zubair Shah',
        cleaningTasks: { linen: false, bathSalts: false, minibar: false, inspection: false },
        assignedCleaner: 'Bilal Farooq',
      },
      {
        roomNumber: 'Suite 102',
        name: 'The Ocean Pavilion',
        tier: 'OVERWATER VILLA',
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
        credentials: { wifiNetwork: 'Habitas_Guest', wifiPassword: 'pacific2026' },
        valetBay: 'Bay #102',
        assignedButler: 'Kamran Malik',
        cleaningTasks: { linen: true, bathSalts: true, minibar: true, inspection: true },
        assignedCleaner: 'Bilal Farooq',
      },
      {
        roomNumber: 'Suite 201',
        name: 'The Cliff Sanctuary',
        tier: 'CLIFFTOP RESIDENCE',
        roomType: 'suite',
        floor: 2,
        dimensions: '175 m²',
        baseNightlyRate: 85000,
        capacity: { adults: 2, children: 2 },
        amenities: [
          'Cantilevered Ocean Cliff Balcony',
          'Handcrafted Sandstone Soaking Tub',
          'Bespoke Mini Bar with Local Artisans',
          'High-Speed Satellite Wi-Fi 6',
        ],
        images: [
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1794997229/hotel-suites/room-04/room-04-1.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1794997231/hotel-suites/room-04/room-04-2.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1794997233/hotel-suites/room-04/room-04-3.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1794997235/hotel-suites/room-04/room-04-4.webp',
          'https://res.cloudinary.com/v1rl3ras/image/upload/v1794997237/hotel-suites/room-04/room-04-5.webp',
        ],
        description: 'Built into sheer limestone bluffs, offering an immersive sanctuary experience, double master suites, and panoramic views of the coastal tides.',
        status: 'AVAILABLE',
        credentials: { wifiNetwork: 'Habitas_Guest', wifiPassword: 'pacific2026' },
        valetBay: 'Bay #201',
        assignedButler: 'Kamran Malik',
        cleaningTasks: { linen: true, bathSalts: true, minibar: true, inspection: true },
        assignedCleaner: 'Bilal Farooq',
      },
      {
        roomNumber: 'Suite 302',
        name: 'The Royal Palm Suite',
        tier: 'ROYAL DUPLEX SUITE',
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
        credentials: { wifiNetwork: 'Habitas_Guest', wifiPassword: 'pacific2026' },
        valetBay: 'Bay #302',
        assignedButler: 'Tariq J.',
        cleaningTasks: { linen: true, bathSalts: true, minibar: true, inspection: true },
        assignedCleaner: 'Bilal Farooq',
      },
      {
        roomNumber: 'Suite 401',
        name: 'The Cenote Jungle Villa',
        tier: 'BIOPHILIC JUNGLE SANCTUARY',
        roomType: 'villa',
        floor: 1,
        dimensions: '195 m²',
        baseNightlyRate: 90000,
        capacity: { adults: 2, children: 2 },
        amenities: [
          'Private Freshwater Cenote Plunge Pool',
          'Monolithic Chukum Plaster Soaking Tub',
          'Outdoor Rain Shower in Banana Garden',
          'Acoustic Soundproofing & Copal Aromatherapy',
        ],
        images: [
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
          'https://images.unsplash.com/photo-1540541338287-41700207dee6',
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
          'https://images.unsplash.com/photo-1590490360182-c33d57733427',
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39',
        ],
        description: 'Immersed in native coastal flora, featuring organic chukum plaster curves, private freshwater cenote bath, and seamless biophilic living.',
        status: 'AVAILABLE',
        credentials: { wifiNetwork: 'Habitas_Guest', wifiPassword: 'pacific2026' },
        valetBay: 'Bay #401',
        assignedButler: 'Zubair Shah',
        cleaningTasks: { linen: true, bathSalts: true, minibar: true, inspection: true },
        assignedCleaner: 'Bilal Farooq',
      },
      {
        roomNumber: 'Suite 501',
        name: 'The Obsidian Caldera Villa',
        tier: 'VOLCANIC OCEAN ESTATE',
        roomType: 'penthouse',
        floor: 4,
        dimensions: '260 m²',
        baseNightlyRate: 135000,
        capacity: { adults: 4, children: 0 },
        amenities: [
          'Cantilevered Black Basalt Infinity Plunge Pool',
          'Private Sommelier Wine Cellar & Tasting Bar',
          'Shou Sugi Ban Charred Wood Living Deck',
          'Chauffeured Airport & Helipad Transfer Included',
        ],
        images: [
          'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
          'https://images.unsplash.com/photo-1566073771259-6a8506099945',
          'https://images.unsplash.com/photo-1602002418082-a4443e081dd1',
        ],
        description: 'Perched on high volcanic bluff outcroppings, featuring chiseled black basalt stone, charred cedar timber decks, and 360-degree caldera horizon panoramas.',
        status: 'AVAILABLE',
        credentials: { wifiNetwork: 'Habitas_Guest', wifiPassword: 'pacific2026' },
        valetBay: 'Bay #501 (Helipad Access)',
        assignedButler: 'Tariq J.',
        cleaningTasks: { linen: true, bathSalts: true, minibar: true, inspection: true },
        assignedCleaner: 'Bilal Farooq',
      },
    ])
    console.log(`[Seed] Created ${rooms.length} luxury suites.`)

    const suite301 = rooms[0]

    // 4. Create Active In-House Stay for Suite 301
    const checkIn = new Date('2026-11-24T14:00:00Z')
    const checkOut = new Date('2026-11-28T12:00:00Z')
    const nights = 4
    const roomRate = 110000
    const subtotal = roomRate * nights // 440,000
    const taxAmount = Math.round(subtotal * 0.13) // 57,200
    const totalAmount = subtotal + taxAmount // 497,200
    const advancePaid = Math.round(totalAmount * 0.3) // 149,160
    const balanceDue = totalAmount - advancePaid // 348,040

    const booking = await Booking.create({
      bookingReference: 'TH-301-9041',
      guest: guestUser._id,
      room: suite301._id,
      roomNumber: 'Suite 301',
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
        taxPercent: 13,
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

    // 6. Create Initial System Activity Logs
    await ActivityLog.create([
      {
        userId: guestUser._id,
        actorName: guestUser.name,
        action: 'ONLINE_RESERVATION_CREATED',
        category: 'RESERVATION',
        details: `Online booking created for Suite 301. Safepay 30% advance deposit paid (PKR ${advancePaid.toLocaleString()}).`,
        targetModel: 'Booking',
        targetId: booking._id.toString(),
      },
      {
        userId: receptionistUser._id,
        actorName: receptionistUser.name,
        action: 'CHECK_IN_GUEST',
        category: 'PMS_FRONT_DESK',
        details: `Guest Dr. Tariq Khan checked in to Suite 301. NFC Keycard dispatched.`,
        targetModel: 'Booking',
        targetId: booking._id.toString(),
      },
      {
        userId: adminUser._id,
        actorName: adminUser.name,
        action: 'SYSTEM_SEEDED',
        category: 'SYSTEM',
        details: 'Initial database provisioned with 3 luxury suites, 4 stakeholders, and demo reservations.',
        targetModel: 'System',
        targetId: 'SEED_INIT',
      },
    ])
    console.log('[Seed] Created activity audit logs.')

    console.log('\n======================================================')
    console.log('✅ DATABASE SEED COMPLETE!')
    console.log('------------------------------------------------------')
    console.log('Demo Credentials for Viva / Examiner Testing:')
    console.log('1. Guest:        guest@habitas.com      / Password123!')
    console.log('2. Front Desk:   reception@habitas.com  / Password123!')
    console.log('3. Housekeeping: cleaning@habitas.com   / Password123!')
    console.log('4. Admin / GM:   admin@habitas.com      / Password123!')
    console.log('Active Stay Ref: TH-301-9041 (Suite 301)')
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
