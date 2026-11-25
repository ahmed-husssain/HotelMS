/**
 * Verification Script: Password Update & Email OTP Reset Flow (Option B)
 */
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../../.env') })
const mongoose = require('mongoose')
const User = require('../models/User')
const {
  updatePassword,
  sendPasswordOtp,
  resetPasswordWithOtp,
} = require('../controllers/authController')

async function runTest() {
  console.log('\n=== TESTING PASSWORD UPDATE & EMAIL OTP (OPTION B) ===\n')

  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/luxurystay_dev'
  await mongoose.connect(mongoUri)
  console.log('✓ Connected to MongoDB')

  // Find or create test guest
  const testEmail = 'test_guest_otp_eval@stayza.com'
  let testUser = await User.findOne({ email: testEmail })
  if (!testUser) {
    testUser = await User.create({
      name: 'Dr. Tariq Khan',
      email: testEmail,
      password: 'InitialPassword123!',
      role: 'guest',
      phone: '+92 300 9876543',
    })
    console.log('✓ Created test user with InitialPassword123!')
  } else {
    testUser.password = 'InitialPassword123!'
    await testUser.save()
    console.log('✓ Reset test user password to InitialPassword123!')
  }

  // Mock req, res helpers
  function createMockRes() {
    return {
      statusCode: 200,
      body: null,
      status(code) {
        this.statusCode = code
        return this
      },
      json(data) {
        this.body = data
        return this
      },
    }
  }

  // TEST 1: Standard Password Update with incorrect current password
  console.log('\n[Test 1] Standard password update with WRONG current password...')
  let req = {
    user: { _id: testUser._id },
    body: {
      currentPassword: 'WrongPassword!',
      newPassword: 'UpdatedPassword2026!',
    },
  }
  let res = createMockRes()
  await updatePassword(req, res)
  console.log(`Status: ${res.statusCode}, Message: ${res.body.message}`)
  if (res.statusCode === 401 && !res.body.success) {
    console.log('✓ PASS: Wrong current password correctly rejected with 401')
  } else {
    throw new Error('FAIL: Wrong current password was not rejected')
  }

  // TEST 2: Standard Password Update with CORRECT current password
  console.log('\n[Test 2] Standard password update with CORRECT current password...')
  req.body.currentPassword = 'InitialPassword123!'
  res = createMockRes()
  await updatePassword(req, res)
  console.log(`Status: ${res.statusCode}, Message: ${res.body.message}`)
  if (res.statusCode === 200 && res.body.success) {
    console.log('✓ PASS: Password successfully updated')
  } else {
    throw new Error('FAIL: Valid password update failed')
  }

  // Verify bcrypt check with new password
  const refreshedUser = await User.findById(testUser._id).select('+password')
  const matchNew = await refreshedUser.comparePassword('UpdatedPassword2026!')
  if (matchNew) {
    console.log('✓ PASS: User can authenticate with UpdatedPassword2026!')
  } else {
    throw new Error('FAIL: Password did not match new hash')
  }

  // TEST 3: Option B - Send 6-Digit Email OTP
  console.log('\n[Test 3] Option B: Requesting 6-digit OTP code to registered email...')
  req = { user: { _id: testUser._id } }
  res = createMockRes()
  await sendPasswordOtp(req, res)
  console.log(`Status: ${res.statusCode}, Message: ${res.body.message}`)
  const generatedOtp = res.body.data?.demoOtp
  console.log(`Generated OTP: [${generatedOtp}]`)
  if (res.statusCode === 200 && res.body.success && generatedOtp && generatedOtp.length === 6) {
    console.log('✓ PASS: 6-digit OTP generated and dispatched')
  } else {
    throw new Error('FAIL: OTP dispatch failed')
  }

  // TEST 4: Option B - Reset with WRONG OTP
  console.log('\n[Test 4] Option B: Attempting reset with WRONG OTP code...')
  req = {
    user: { _id: testUser._id },
    body: {
      otp: '999999',
      newPassword: 'BrandNewPassword2026!',
    },
  }
  res = createMockRes()
  await resetPasswordWithOtp(req, res)
  console.log(`Status: ${res.statusCode}, Message: ${res.body.message}`)
  if (res.statusCode === 400 && !res.body.success) {
    console.log('✓ PASS: Wrong OTP correctly rejected with 400')
  } else {
    throw new Error('FAIL: Wrong OTP was not rejected')
  }

  // TEST 5: Option B - Reset with CORRECT OTP
  console.log('\n[Test 5] Option B: Resetting password with VALID OTP code...')
  req.body.otp = generatedOtp
  res = createMockRes()
  await resetPasswordWithOtp(req, res)
  console.log(`Status: ${res.statusCode}, Message: ${res.body.message}`)
  if (res.statusCode === 200 && res.body.success) {
    console.log('✓ PASS: Password successfully reset with OTP')
  } else {
    throw new Error('FAIL: OTP password reset failed')
  }

  // Verify bcrypt check with brand new password & OTP fields cleared
  const finalUser = await User.findById(testUser._id).select('+password')
  const matchBrandNew = await finalUser.comparePassword('BrandNewPassword2026!')
  if (matchBrandNew && finalUser.resetPasswordOtp === null) {
    console.log('✓ PASS: User authenticated with BrandNewPassword2026! and OTP cleared')
  } else {
    throw new Error('FAIL: Reset password verification failed')
  }

  // Cleanup test user
  await User.deleteOne({ email: testEmail })
  console.log('✓ Cleaned up test user')

  await mongoose.disconnect()
  console.log('\n=== ALL TESTS PASSED SUCCESSFULLY! ===\n')
}

runTest().catch((err) => {
  console.error('Test execution failed:', err)
  process.exit(1)
})
