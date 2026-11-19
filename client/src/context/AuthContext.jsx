import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  loginUser,
  registerUser,
  fetchAdminStaff,
  createAdminStaff,
  toggleAdminStaffStatus,
} from '../services/api'

/**
 * HABITAS SANCTUARY & LUXURYSTAY — AUTHENTICATION & RBAC CONTEXT
 * 
 * Implements Aptech Module 1 (User Management) & Module 7 (Security & RBAC):
 * - Role-Based Access Control: 'guest', 'receptionist', 'housekeeping', 'admin'
 * - Single source of truth for user session (persisted to localStorage)
 * - Automatic role detection on login (no toggles needed)
 * - Safe client-side role guarding for navigation
 */

// Canonical seed accounts for testing and evaluation
export const INITIAL_STAFF_ACCOUNTS = [
  {
    id: 'usr-guest-001',
    name: 'Dr. Tariq Khan',
    email: 'guest@stayza.com',
    role: 'guest',
    roleLabel: 'Verified Guest',
    phone: '+92 300 8219401',
    activeReservationCode: 'TH-301-9041',
    suiteNumber: 'Suite 301',
    status: 'active',
  },
  {
    id: 'usr-guest-002',
    name: 'Tariq Khan',
    email: 'tariq@luxury.pk',
    role: 'guest',
    roleLabel: 'Verified Guest',
    phone: '+92 300 8921455',
    activeReservationCode: 'ST-301-9041',
    suiteNumber: 'Suite 301',
    status: 'active',
  },
  {
    id: 'usr-rec-002',
    name: 'Sara Ahmed',
    email: 'reception@stayza.com',
    role: 'receptionist',
    roleLabel: 'Front Desk Receptionist',
    phone: '+92 321 4455667',
    shiftStatus: 'Morning Shift (Active)',
    status: 'active',
  },
  {
    id: 'usr-hk-003',
    name: 'Bilal Farooq',
    email: 'cleaning@stayza.com',
    role: 'housekeeping',
    roleLabel: 'Housekeeping Lead',
    phone: '+92 333 1122334',
    shiftStatus: 'Active Duty',
    status: 'active',
  },
  {
    id: 'usr-adm-004',
    name: 'Karim Mansoor',
    email: 'admin@stayza.com',
    role: 'admin',
    roleLabel: 'General Manager',
    phone: '+92 300 0001122',
    department: 'Executive Operations',
    status: 'active',
  },
]

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // 1. Load active user session from localStorage (with legacy migration fallback)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('stayza_auth_user') || localStorage.getItem('habitas_auth_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  // 2. Load staff registry (allows Admin to add/deactivate accounts in-memory + localStorage)
  const [staffAccounts, setStaffAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem('stayza_staff_registry') || localStorage.getItem('habitas_staff_registry')
      return saved ? JSON.parse(saved) : INITIAL_STAFF_ACCOUNTS
    } catch {
      return INITIAL_STAFF_ACCOUNTS
    }
  })

  // Persist session changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('stayza_auth_user', JSON.stringify(currentUser))
      localStorage.removeItem('habitas_auth_user')
    } else {
      localStorage.removeItem('stayza_auth_user')
      localStorage.removeItem('habitas_auth_user')
    }
  }, [currentUser])

  // Persist staff accounts
  useEffect(() => {
    localStorage.setItem('stayza_staff_registry', JSON.stringify(staffAccounts))
    localStorage.removeItem('habitas_staff_registry')
  }, [staffAccounts])

  // Live Staff Registry Sync for Admin
  useEffect(() => {
    let isMounted = true
    if (currentUser?.role === 'admin') {
      fetchAdminStaff()
        .then((res) => {
          if (isMounted && res.success && Array.isArray(res.data) && res.data.length > 0) {
            const mapped = res.data.map((s) => ({
              id: s._id || s.id,
              name: s.name,
              email: s.email,
              role: s.role,
              phone: s.phone || '',
              status: s.isActive !== false ? 'active' : 'inactive',
              createdAt: s.createdAt,
            }))
            setStaffAccounts(mapped)
          }
        })
        .catch((err) => console.warn('[AuthContext] Staff fetch warning:', err.message))
    }
    return () => { isMounted = false }
  }, [currentUser?.role])

  /**
   * Login function with Server-Side JWT Authentication & Automatic Role Detection.
   * Calls Express POST /api/auth/login and securely persists JWT.
   */
  const login = async (email, password = 'Password123!') => {
    const cleanEmail = email.trim().toLowerCase()

    try {
      // 1. Attempt Real Server-Side JWT Authentication (Priority 1)
      const res = await loginUser({ email: cleanEmail, password })
      if (res.success && res.data) {
        const { token, user } = res.data

        // Store JWT token for all subsequent authenticated API calls
        localStorage.setItem('stayza_auth_token', token)
        localStorage.setItem('habitas_auth_token', token)

        const roleLabels = {
          guest: 'Verified Guest',
          receptionist: 'Front Desk Receptionist',
          housekeeping: 'Housekeeping Lead',
          admin: 'General Manager',
        }

        const userSession = {
          id: user.id || user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          roleLabel: roleLabels[user.role] || user.role,
          phone: user.phone || '',
          activeReservationCode: user.activeReservationCode || 'ST-301-9041',
          suiteNumber: user.role === 'guest' ? 'Suite 301' : null,
          token,
          lastLogin: new Date().toISOString(),
        }

        setCurrentUser(userSession)
        return userSession
      }
    } catch (apiErr) {
      // Check if this is an explicit business rejection from Express (e.g. 401 invalid password)
      const isNetworkOrProxyFailure =
        !apiErr.message ||
        apiErr.message.toLowerCase().includes('failed to fetch') ||
        apiErr.message.toLowerCase().includes('networkerror') ||
        apiErr.message.toLowerCase().includes('backend api unavailable') ||
        apiErr.message.toLowerCase().includes('non-json') ||
        apiErr.message.toLowerCase().includes('unexpected token') ||
        apiErr.message.includes('<!doctype')

      if (!isNetworkOrProxyFailure) {
        throw apiErr
      }
      console.warn('[AuthContext] Backend API unreachable, falling back to cached registry:', apiErr.message)
    }

    // 2. Offline / Hosted static fallback
    const matchedAccount = staffAccounts.find(
      (acc) =>
        acc.email.toLowerCase() === cleanEmail ||
        acc.email.toLowerCase() === cleanEmail.replace('@habitas.com', '@stayza.com') ||
        acc.email.toLowerCase() === cleanEmail.replace('@stayza.com', '@habitas.com')
    )

    if (matchedAccount) {
      if (matchedAccount.status === 'inactive') {
        throw new Error('This account has been deactivated by the General Manager.')
      }

      // Loosely check testing passwords in client mode so Password123!, password123, 123 all work seamlessly
      const normalizedPass = (password || '').trim().toLowerCase()
      if (
        normalizedPass &&
        !['password123!', 'password123', '123', 'admin', '123456', 'pass'].includes(normalizedPass)
      ) {
        throw new Error('Invalid credentials. Password is Password123!')
      }

      const userSession = {
        ...matchedAccount,
        lastLogin: new Date().toISOString(),
      }
      setCurrentUser(userSession)
      return userSession
    }

    // If email is not in staff registry, treat as newly recognized guest
    const guestSession = {
      id: `usr-guest-${Date.now().toString().slice(-4)}`,
      name: cleanEmail.split('@')[0].replace('.', ' '),
      email: cleanEmail,
      role: 'guest',
      roleLabel: 'Guest Profile',
      activeReservationCode: 'ST-301-9041',
      suiteNumber: 'Suite 301',
      status: 'active',
      lastLogin: new Date().toISOString(),
    }

    setCurrentUser(guestSession)
    return guestSession
  }

  /**
   * Public Registration (Strictly creates role: 'guest' in MongoDB Atlas)
   */
  const registerGuest = async ({ name, email, password = 'Password123!', phone }) => {
    const cleanEmail = email.trim().toLowerCase()

    try {
      // 1. Attempt Server-Side Registration
      const res = await registerUser({ name, email: cleanEmail, password, phone })
      if (res.success && res.data) {
        const { token, user } = res.data
        localStorage.setItem('stayza_auth_token', token)
        localStorage.setItem('habitas_auth_token', token)

        const userSession = {
          id: user.id || user._id,
          name: user.name,
          email: user.email,
          role: 'guest',
          roleLabel: 'Registered Guest',
          phone: user.phone || phone || '',
          activeReservationCode: null,
          suiteNumber: null,
          token,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        }

        setCurrentUser(userSession)
        return userSession
      }
    } catch (apiErr) {
      if (apiErr.message && !apiErr.message.toLowerCase().includes('failed to fetch')) {
        throw apiErr
      }
      console.warn('[AuthContext] Backend unreachable, falling back to local registration:', apiErr.message)
    }

    // 2. Offline fallback
    const exists = staffAccounts.some((acc) => acc.email.toLowerCase() === cleanEmail)
    if (exists) {
      throw new Error('An account with this email address already exists. Please sign in.')
    }

    const newGuest = {
      id: `usr-guest-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      email: cleanEmail,
      phone: phone || '+92 300 0000000',
      role: 'guest',
      roleLabel: 'Registered Guest',
      activeReservationCode: null,
      suiteNumber: null,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    }

    setStaffAccounts((prev) => [...prev, newGuest])
    setCurrentUser(newGuest)
    return newGuest
  }

  /**
   * Admin Function: Create new staff member
   */
  const createStaffAccount = async ({ name, email, role, phone, password = 'Password123!' }) => {
    const cleanEmail = email.trim().toLowerCase().replace('@habitas.com', '@stayza.com')
    
    if (staffAccounts.some((acc) => acc.email.toLowerCase() === cleanEmail)) {
      throw new Error('An account with this email already exists.')
    }

    const roleLabels = {
      receptionist: 'Front Desk Receptionist',
      housekeeping: 'Housekeeping Staff',
      admin: 'Operations Manager',
    }

    const tempId = `usr-${role.slice(0, 3)}-${Date.now().toString().slice(-3)}`
    const newStaff = {
      id: tempId,
      name: name.trim(),
      email: cleanEmail,
      role,
      roleLabel: roleLabels[role] || role,
      phone: phone || 'Internal Extension',
      shiftStatus: 'Standard Duty',
      status: 'active',
      createdAt: new Date().toISOString(),
    }

    setStaffAccounts((prev) => [...prev, newStaff])

    // Persist to MongoDB Atlas
    try {
      const res = await createAdminStaff({ name, email: cleanEmail, role, phone, password })
      if (res.success && res.data) {
        setStaffAccounts((prev) =>
          prev.map((s) => (s.id === tempId ? { ...s, id: res.data.id || s.id } : s))
        )
      }
    } catch (err) {
      console.warn('[Staff Create] Remote Atlas sync warning:', err.message)
      throw err
    }

    return newStaff
  }

  /**
   * Admin Function: Toggle account activation (active / inactive)
   */
  const toggleStaffStatus = async (id) => {
    setStaffAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === id) {
          const nextStatus = acc.status === 'active' ? 'inactive' : 'active'
          return { ...acc, status: nextStatus }
        }
        return acc
      })
    )

    try {
      await toggleAdminStaffStatus(id)
    } catch (err) {
      console.warn('[Staff Toggle] Remote Atlas sync warning:', err.message)
    }
  }

  /**
   * Log out active session & purge JWT tokens
   */
  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('stayza_auth_user')
    localStorage.removeItem('habitas_auth_user')
    localStorage.removeItem('stayza_auth_token')
    localStorage.removeItem('habitas_auth_token')
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        staffAccounts,
        login,
        logout,
        registerGuest,
        createStaffAccount,
        toggleStaffStatus,
        isAuthenticated: !!currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
