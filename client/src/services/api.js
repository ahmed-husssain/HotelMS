/**
 * Stayza Hospitality — Client API Service
 * 
 * Centralized, minimal native fetch client for communicating with Express backend.
 * Zero external libraries (KISS & Viva Defense compliant).
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api'

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`
  const token =
    typeof localStorage !== 'undefined'
      ? localStorage.getItem('stayza_auth_token') || localStorage.getItem('habitas_auth_token')
      : null

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  try {
    const res = await fetch(url, { ...options, headers })

    // Verify response is actually JSON before calling res.json()
    // (Prevents Firebase static hosting SPA fallback returning index.html "<!doctype" from crashing JSON parsing)
    const contentType = res.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      throw new Error('Backend API unavailable. Running in client mode.')
    }

    const data = await res.json()
    if (!res.ok) {
      const err = new Error(data.message || `Request failed with status ${res.status}`)
      err.status = res.status
      throw err
    }
    return data
  } catch (err) {
    console.warn(`[API] ${options.method || 'GET'} ${endpoint} error:`, err.message)
    throw err
  }
}

// 0. Authentication API
export async function loginUser(credentials) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export async function registerUser(payload) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// 1. Reservation & Pricing
export async function createCheckoutHold(payload) {
  return request('/bookings/hold', {
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

// 4. Staff & Front Desk PMS Operations
export async function fetchStaffDashboard() {
  return request('/staff/dashboard')
}

export async function patchRoomStatus(roomIdentifier, payload) {
  return request(`/rooms/${encodeURIComponent(roomIdentifier)}/status`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export async function patchRoomChecklist(roomIdentifier, payload) {
  return request(`/rooms/${encodeURIComponent(roomIdentifier)}/checklist`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export async function checkInStaffGuest(bookingRef, payload = {}) {
  return request(`/staff/check-in/${encodeURIComponent(bookingRef)}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function checkOutStaffGuest(bookingRef, payload = {}) {
  return request(`/staff/check-out/${encodeURIComponent(bookingRef)}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function postFolioCharge(bookingRef, payload) {
  return request(`/staff/folio/${encodeURIComponent(bookingRef)}/add`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// 5. Housekeeping, Maintenance & Hotel Supplies
export async function fetchHousekeepingDashboard() {
  return request('/housekeeping/dashboard')
}

export async function toggleCleaningStep(taskId, step, value) {
  return request(`/housekeeping/tasks/${encodeURIComponent(taskId)}/step`, {
    method: 'PATCH',
    body: JSON.stringify({ step, value }),
  })
}

export async function certifyHousekeepingRoom(taskId) {
  return request(`/housekeeping/tasks/${encodeURIComponent(taskId)}/certify`, {
    method: 'POST',
  })
}

export async function createMaintenanceTicketApi(payload) {
  return request('/housekeeping/maintenance', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function restockInventoryItem(itemId, amount = 10, type = 'clean_restock') {
  return request(`/housekeeping/inventory/${encodeURIComponent(itemId)}/restock`, {
    method: 'PATCH',
    body: JSON.stringify({ amount, type }),
  })
}

// 6. Admin & General Manager Executive Operations
export async function fetchAdminAnalytics() {
  return request('/admin/analytics')
}

export async function fetchAdminStaff() {
  return request('/admin/staff')
}

export async function createAdminStaff(payload) {
  return request('/admin/staff', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function toggleAdminStaffStatus(id) {
  return request(`/admin/staff/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
  })
}

export async function fetchAdminGuests() {
  return request('/admin/guests')
}

export async function patchAdminRoomRate(roomIdentifier, nightlyRate) {
  return request(`/admin/rooms/${encodeURIComponent(roomIdentifier)}/rate`, {
    method: 'PATCH',
    body: JSON.stringify({ nightlyRate }),
  })
}

export async function fetchAdminAuditLogs() {
  return request('/admin/audit-logs')
}

// 7. Safepay Payment Gateway & Ledger API
export async function createPaymentSession(bookingReference, successUrl, cancelUrl) {
  return request('/payments/checkout-session', {
    method: 'POST',
    body: JSON.stringify({ bookingReference, successUrl, cancelUrl }),
  })
}

export async function verifyPaymentSession(bookingReference, trackerToken) {
  return request('/payments/verify-session', {
    method: 'POST',
    body: JSON.stringify({ bookingReference, trackerToken }),
  })
}

export async function cancelPaymentSession(bookingReference) {
  return request('/payments/cancel-session', {
    method: 'POST',
    body: JSON.stringify({ bookingReference }),
  })
}
