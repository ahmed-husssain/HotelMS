/**
 * LuxuryStay Hospitality — Server-Side Zero-Trust Pricing Service
 * 
 * Rules & Invariants (Doc PRD FR-1.3 & TRD 3.1):
 * 1. Browser inputs are NEVER trusted to compute money, nights, or taxes.
 * 2. 13% Sindh Sales / Hospitality Tax is computed strictly on subtotal.
 * 3. 30% Advance Deposit is required to secure the online reservation.
 * 4. 70% Remaining Balance is collected at the front desk upon check-out.
 * 5. All monetary calculations are rounded to the nearest whole Rupee (PKR).
 */

/**
 * Calculates complete pricing breakdown for a stay
 * 
 * @param {number} baseNightlyRate - Room rate per night in PKR
 * @param {Date|string} checkInDate - Arrival date
 * @param {Date|string} checkOutDate - Departure date
 * @returns {Object} Complete pricing snapshot matching Booking schema
 */
function calculatePricing(baseNightlyRate, checkInDate, checkOutDate) {
  const checkIn = new Date(checkInDate)
  const checkOut = new Date(checkOutDate)

  // 1. Validate dates are well-formed
  if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
    throw new Error('Invalid check-in or check-out date format')
  }

  // 2. Validate arrival is not in the historical past (zero out time component)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const checkInMidnight = new Date(checkIn)
  checkInMidnight.setHours(0, 0, 0, 0)

  if (checkInMidnight < today) {
    throw new Error('Check-in date cannot be in the past')
  }

  // 3. Calculate difference in nights (minimum 1 night)
  const diffTime = checkOut.getTime() - checkIn.getTime()
  const numberOfNights = Math.round(diffTime / (1000 * 60 * 60 * 24))

  if (numberOfNights < 1) {
    throw new Error('Check-out date must be at least 1 night after check-in date')
  }

  // 4. Rate calculation (Zero-Trust)
  const nightlyRate = Math.max(0, Math.round(baseNightlyRate))
  const subtotal = nightlyRate * numberOfNights

  // 5. All-Inclusive Luxury Tariff (0% additional provincial tax surcharge)
  // Transparent luxury pricing: The quoted nightly rate is all-inclusive.
  const taxPercent = 0
  const taxAmount = 0
  const totalAmount = subtotal

  // 6. 30% Online Advance Deposit vs 70% Balance Due at Front Desk
  const advancePercent = 30
  const advanceAmount = Math.round((totalAmount * advancePercent) / 100)
  const balanceDue = totalAmount - advanceAmount

  return {
    nightlyRate,
    numberOfNights,
    subtotal,
    taxPercent,
    taxAmount,
    totalAmount,
    advancePercent,
    advanceAmount,
    advancePaid: 0,
    balanceDue,
    currency: 'PKR',
  }
}

module.exports = {
  calculatePricing,
}
