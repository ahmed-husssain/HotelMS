/**
 * Automated Verification Test for Priority 2:
 * Housekeeping, Maintenance & Supplies Inventory Persistence in MongoDB Atlas
 * 
 * Tests:
 * 1. Housekeeper Login (JWT issuance)
 * 2. GET /api/housekeeping/dashboard (7 inventory items, tasks, tickets, metrics)
 * 3. PATCH /api/housekeeping/tasks/:id/step (auto-deduction of linen & supplies)
 * 4. PATCH /api/housekeeping/inventory/:id/restock (replenishing stock)
 * 5. POST /api/housekeeping/tasks/:id/certify (room flips to AVAILABLE)
 * 6. POST /api/housekeeping/maintenance (urgent ticket locks room to MAINTENANCE)
 * 7. PATCH /api/housekeeping/maintenance/:id/resolve (defect resolved, room returns to AVAILABLE)
 * 8. RBAC security check (Guest account rejected with 403 Forbidden)
 */

const BASE_URL = 'http://localhost:5000/api'

async function runTests() {
  console.log('\n=== RUNNING PRIORITY 2 INTEGRATION SUITE ===\n')

  let passed = 0
  let failed = 0

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`)
      passed++
    } else {
      console.error(`  ✗ FAIL: ${message}`)
      failed++
    }
  }

  try {
    // 1. Authenticate as Housekeeper
    console.log('[Test 1] Authenticating as Housekeeper (cleaning@stayza.com)...')
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'cleaning@stayza.com', password: 'Password123!' }),
    })
    const loginData = await loginRes.json()
    assert(loginRes.status === 200 && loginData.data?.token, 'Housekeeper logged in with valid JWT token')
    const token = loginData.data.token

    // Authenticate as Guest for RBAC testing
    console.log('[Test 2] Authenticating as Guest (guest@stayza.com)...')
    const guestLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'guest@stayza.com', password: 'Password123!' }),
    })
    const guestData = await guestLoginRes.json()
    const guestToken = guestData.data?.token

    // 3. RBAC Boundary Test: Guest cannot access housekeeping dashboard
    console.log('[Test 3] Testing RBAC Guard: Guest accessing /api/housekeeping/dashboard...')
    const guestHkRes = await fetch(`${BASE_URL}/housekeeping/dashboard`, {
      headers: { Authorization: `Bearer ${guestToken}` },
    })
    assert(guestHkRes.status === 403, 'Guest received HTTP 403 Forbidden when requesting Housekeeping Dashboard')

    // 4. Fetch Housekeeping Dashboard
    console.log('[Test 4] Fetching Housekeeping Dashboard with Housekeeper token...')
    const dashRes = await fetch(`${BASE_URL}/housekeeping/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const dashData = await dashRes.json()
    assert(dashRes.status === 200 && dashData.success, 'GET /api/housekeeping/dashboard returned 200 OK')

    const inventory = dashData.data?.inventory || []
    assert(inventory.length === 7, `Expected 7 everyday supplies, received ${inventory.length}`)

    const itemNames = inventory.map((i) => i.name)
    const expectedItems = [
      'Bed Sheets',
      'Bath Towels',
      'Pillows & Blankets',
      'Soap & Shampoo',
      'Water Bottles',
      'Tea & Coffee Kits',
      'Snacks',
    ]
    const allExist = expectedItems.every((name) => itemNames.includes(name))
    assert(allExist, 'All 7 everyday hotel items exist in MongoDB Atlas')

    const tasks = dashData.data?.tasks || []
    assert(tasks.length > 0, `Active housekeeping tasks loaded (${tasks.length} found)`)
    const targetTask = tasks[0]

    // 5. Test Checklist Toggle & Auto-Deduction
    console.log(`[Test 5] Testing checklist toggle on Task ${targetTask._id} (Suite ${targetTask.roomNumber})...`)
    const bedSheetsBefore = inventory.find((i) => i.name === 'Bed Sheets')?.inStock || 0
    const bedSheetsLaundryBefore = inventory.find((i) => i.name === 'Bed Sheets')?.inLaundry || 0

    const stepRes = await fetch(`${BASE_URL}/housekeeping/tasks/${targetTask._id}/step`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ step: 'linen', value: true }),
    })
    const stepData = await stepRes.json()
    assert(stepRes.status === 200 && stepData.success, 'PATCH checklist step returned 200 OK')

    const updatedSheets = stepData.data?.inventory?.find((i) => i.name === 'Bed Sheets')
    assert(
      updatedSheets && updatedSheets.inStock === bedSheetsBefore - 1,
      `Auto-deduction confirmed: Bed Sheets stock reduced from ${bedSheetsBefore} to ${updatedSheets?.inStock}`
    )
    assert(
      updatedSheets && updatedSheets.inLaundry === bedSheetsLaundryBefore + 1,
      `Laundry tracking confirmed: Bed Sheets in-laundry increased from ${bedSheetsLaundryBefore} to ${updatedSheets?.inLaundry}`
    )

    // 6. Test Restocking Inventory
    console.log('[Test 6] Testing Inventory Restock (+10 Bed Sheets)...')
    const sheetItem = inventory.find((i) => i.name === 'Bed Sheets')
    const restockRes = await fetch(`${BASE_URL}/housekeeping/inventory/${sheetItem._id}/restock`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount: 10, type: 'clean_restock' }),
    })
    const restockData = await restockRes.json()
    assert(restockRes.status === 200 && restockData.success, 'PATCH /inventory/:id/restock returned 200 OK')
    const freshStock = restockData.data?.item?.inStock
    assert(freshStock === updatedSheets.inStock + 10, `Stock replenished cleanly (+10): New stock is ${freshStock}`)

    // 7. Test Room Turnover Certification
    console.log(`[Test 7] Certifying turnover on Task ${targetTask._id}...`)
    const certifyRes = await fetch(`${BASE_URL}/housekeeping/tasks/${targetTask._id}/certify`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
    const certifyData = await certifyRes.json()
    assert(certifyRes.status === 200 && certifyData.success, 'POST /tasks/:id/certify returned 200 OK')
    assert(certifyData.data?.room?.status === 'AVAILABLE', 'Room status in MongoDB Atlas flipped to AVAILABLE')

    // 8. Test Maintenance Request Creation & Atomic Room Lock
    console.log('[Test 8] Reporting URGENT plumbing issue on Suite 302...')
    const ticketRes = await fetch(`${BASE_URL}/housekeeping/maintenance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        roomNumber: 'Suite 302',
        issueCategory: 'PLUMBING',
        issueDescription: 'Balcony private spa filtration nozzle leak.',
        priority: 'URGENT',
        lockRoom: true,
      }),
    })
    const ticketData = await ticketRes.json()
    assert(ticketRes.status === 201 && ticketData.success, 'POST /maintenance returned 201 Created')

    // Verify room is locked in MongoDB
    const roomCheckRes = await fetch(`${BASE_URL}/rooms`)
    const roomCheckData = await roomCheckRes.json()
    const suite302 = roomCheckData.data?.find((r) => r.roomNumber?.toUpperCase().includes('302'))
    assert(suite302?.status === 'MAINTENANCE', 'Suite 302 atomically locked to MAINTENANCE in MongoDB Atlas')

    // 9. Test Resolving Maintenance Ticket
    console.log(`[Test 9] Resolving Maintenance Ticket ${ticketData.data?._id}...`)
    const resolveRes = await fetch(`${BASE_URL}/housekeeping/maintenance/${ticketData.data?._id}/resolve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ resolutionNotes: 'Replaced high-pressure brass cartridge and certified seal.' }),
    })
    const resolveData = await resolveRes.json()
    assert(resolveRes.status === 200 && resolveData.success, 'PATCH /maintenance/:id/resolve returned 200 OK')

    // Verify room is restored to AVAILABLE
    const roomCheckRes2 = await fetch(`${BASE_URL}/rooms`)
    const roomCheckData2 = await roomCheckRes2.json()
    const suite302After = roomCheckData2.data?.find((r) => r.roomNumber?.toUpperCase().includes('302'))
    assert(suite302After?.status === 'AVAILABLE', 'Suite 302 unlocked and restored to AVAILABLE in MongoDB Atlas')

    console.log('\n=============================================')
    console.log(`PRIORITY 2 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`)
    console.log('=============================================\n')

    if (failed > 0) process.exit(1)
    process.exit(0)
  } catch (err) {
    console.error('[Integration Test Fatal Error]:', err.message)
    process.exit(1)
  }
}

runTests()
