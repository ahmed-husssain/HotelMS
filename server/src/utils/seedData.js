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
 * - 3 Signature Ocean Suites with full amenities & operational status
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

    // 3. Create the 3 Luxury Suites
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
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=85',
          'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1400&q=85',
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
        roomNumber: 'Suite 302',
        name: 'The Courtyard Villa',
        tier: 'PRIVATE COURTYARD VILLA',
        roomType: 'villa',
        floor: 1,
        dimensions: '185 m²',
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
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1400&q=85',
          'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1400&q=85',
        ],
        description: 'Enclosed within ancient limestone walls, the Courtyard Villa centers around an open-air reflecting pool, private garden pavilion, and sunken aromatic cedar bath.',
        status: 'DIRTY',
        credentials: { wifiNetwork: 'Habitas_Guest', wifiPassword: 'pacific2026' },
        valetBay: 'Bay #302',
        assignedButler: 'Zubair Shah',
        cleaningTasks: { linen: false, bathSalts: false, minibar: false, inspection: false },
        assignedCleaner: 'Bilal Farooq',
      },
      {
        roomNumber: 'Suite 303',
        name: 'The Ocean Villa',
        tier: 'PANORAMIC OCEAN SUITE',
        roomType: 'suite',
        floor: 2,
        dimensions: '160 m²',
        baseNightlyRate: 95000,
        capacity: { adults: 2, children: 0 },
        amenities: [
          'Direct Beach Access Path',
          'Cantilevered Sunset Daybed',
          'Complimentary High Tea Service',
          'Organic Cedar Spa Amenities',
          'Acoustic Soundproofing',
        ],
        images: [
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1400&q=85',
          'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1400&q=85',
        ],
        description: 'Featuring floor-to-ceiling retractable glass doors that open directly to the coastal ocean breeze, private timber terrace, and bespoke artisan interiors.',
        status: 'AVAILABLE',
        credentials: { wifiNetwork: 'Habitas_Guest', wifiPassword: 'pacific2026' },
        valetBay: 'Bay #303',
        assignedButler: 'Kamran Malik',
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
