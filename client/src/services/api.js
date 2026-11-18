/**
 * LuxuryStay / Habitas — Client API Service
 * 
 * Centralized, minimal native fetch client for communicating with Express backend.
 * Zero external libraries (KISS & Viva Defense compliant).
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api'

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  try {
    const res = await fetch(url, { ...options, headers })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`)
    }
    return data
  } catch (err) {
    console.warn(`[API] ${options.method || 'GET'} ${endpoint} error:`, err.message)
    throw err
  }
}

// 1. Suite Inventory
export async function fetchSuites(params = {}) {
  const query = new URLSearchParams()
  if (params.checkIn) query.append('checkIn', params.checkIn)
  if (params.checkOut) query.append('checkOut', params.checkOut)
  if (params.guests) query.append('guests', params.guests)
  if (params.category && params.category !== 'all') query.append('category', params.category)

  const qs = query.toString() ? `?${query.toString()}` : ''
  return request(`/rooms${qs}`)
}

export async function fetchSuiteById(id) {
  return request(`/rooms/${id}`)
}

// 2. Reservation & Pricing
export async function getPricingQuote(payload) {
  return request('/bookings/quote', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function createCheckoutHold(payload) {
  return request('/bookings/hold', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function releaseHold(reference) {
  return request(`/bookings/${reference}/release-hold`, {
    method: 'POST',
  })
}

export async function confirmReservation(reference, payload = {}) {
  return request(`/bookings/${reference}/confirm`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// 3. /my-stay Guest OS Hub
export async function lookupStay(query) {
  const qs = typeof query === 'string'
    ? `?ref=${encodeURIComponent(query)}`
    : `?${new URLSearchParams(query).toString()}`
  return request(`/bookings/lookup${qs}`)
}

export async function toggleDigitalDoor(reference) {
  return request(`/bookings/${reference}/unlock`, {
    method: 'POST',
  })
}

export async function updateStaySettings(reference, settings) {
  return request(`/bookings/${reference}/settings`, {
    method: 'PATCH',
    body: JSON.stringify(settings),
  })
}

export async function orderStayService(reference, service) {
  return request(`/bookings/${reference}/incidentals`, {
    method: 'POST',
    body: JSON.stringify(service),
  })
}

export async function submitStayFeedback(reference, feedback) {
  return request(`/bookings/${reference}/feedback`, {
    method: 'POST',
    body: JSON.stringify(feedback),
  })
}
