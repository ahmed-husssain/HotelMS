import React, { createContext, useContext, useState, useEffect } from 'react'

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
    name: 'Tariq Khan',
    email: 'tariq@luxury.pk',
    role: 'guest',
    roleLabel: 'Verified Guest',
    phone: '+92 300 8921455',
    activeReservationCode: 'TH-301-9041',
    suiteNumber: 'Suite 301',
    status: 'active',
  },
  {
    id: 'usr-rec-002',
    name: 'Sara Ahmed',
    email: 'reception@habitas.com',
    role: 'receptionist',
    roleLabel: 'Front Desk Receptionist',
    phone: '+92 321 4455667',
    shiftStatus: 'Morning Shift (Active)',
    status: 'active',
  },
  {
    id: 'usr-hk-003',
    name: 'Bilal Farooq',
    email: 'cleaning@habitas.com',
    role: 'housekeeping',
    roleLabel: 'Housekeeping Lead',
    phone: '+92 333 1122334',
    shiftStatus: 'Active Duty',
    status: 'active',
  },
  {
    id: 'usr-adm-004',
    name: 'Karim Mansoor',
    email: 'admin@habitas.com',
    role: 'admin',
    roleLabel: 'General Manager',
    phone: '+92 300 0001122',
    department: 'Executive Operations',
    status: 'active',
  },
]

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // 1. Load active user session from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('habitas_auth_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  // 2. Load staff registry (allows Admin to add/deactivate accounts in-memory + localStorage)
  const [staffAccounts, setStaffAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem('habitas_staff_registry')
      return saved ? JSON.parse(saved) : INITIAL_STAFF_ACCOUNTS
    } catch {
      return INITIAL_STAFF_ACCOUNTS
    }
  })

  // Persist session changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('habitas_auth_user', JSON.stringify(currentUser))
    } else {
      localStorage.removeItem('habitas_auth_user')
    }
  }, [currentUser])

  // Persist staff accounts
  useEffect(() => {
    localStorage.setItem('habitas_staff_registry', JSON.stringify(staffAccounts))
  }, [staffAccounts])

  /**
   * Login function with AUTOMATIC ROLE DETECTION.
   * Matches email against staff registry or defaults to guest.
   */
  const login = (email, _password) => {
    const cleanEmail = email.trim().toLowerCase()
    
    // Check known accounts
    const matchedAccount = staffAccounts.find(
      (acc) => acc.email.toLowerCase() === cleanEmail
    )

    if (matchedAccount) {
      if (matchedAccount.status === 'inactive') {
        throw new Error('This account has been deactivated by the General Manager.')
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
      activeReservationCode: 'TH-301-9041',
      suiteNumber: 'Suite 301',
      status: 'active',
      lastLogin: new Date().toISOString(),
    }

    setCurrentUser(guestSession)
    return guestSession
  }

  /**
   * Public Registration (Strictly creates role: 'guest')
   */
  const registerGuest = ({ name, email, phone }) => {
    const cleanEmail = email.trim().toLowerCase()
    
    // Check if email already exists
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

    // Save into accounts and log in immediately
    setStaffAccounts((prev) => [...prev, newGuest])
    setCurrentUser(newGuest)
    return newGuest
  }

  /**
   * Admin Function: Create new staff member
   */
  const createStaffAccount = ({ name, email, role, phone }) => {
    const cleanEmail = email.trim().toLowerCase()
    
    if (staffAccounts.some((acc) => acc.email.toLowerCase() === cleanEmail)) {
      throw new Error('An account with this email already exists.')
    }

    const roleLabels = {
      receptionist: 'Front Desk Receptionist',
      housekeeping: 'Housekeeping Staff',
      admin: 'Operations Manager',
    }

    const newStaff = {
      id: `usr-${role.slice(0, 3)}-${Date.now().toString().slice(-3)}`,
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
    return newStaff
  }

  /**
   * Admin Function: Toggle account activation (active / inactive)
   */
  const toggleStaffStatus = (id) => {
    setStaffAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === id) {
          const nextStatus = acc.status === 'active' ? 'inactive' : 'active'
          return { ...acc, status: nextStatus }
        }
        return acc
      })
    )
  }

  /**
   * Log out active session
   */
  const logout = () => {
    setCurrentUser(null)
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
