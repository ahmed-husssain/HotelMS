import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import { verifyPaymentSession } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useHotelData } from '../context/HotelDataContext'

/**
 * PaymentVerifyPage — Authoritative Safepay Verification & Settlement Landing
 * 
 * Viva Defense Concept:
 * - Anti-Tamper Verification: The frontend does NOT confirm bookings on its own.
 * - S2S Handshake: Calls POST /api/payments/verify-session to verify the tracker token
 *   directly against MongoDB and Safepay before granting room confirmation.
 */
export default function PaymentVerifyPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { linkReservationCode } = useAuth()
  const { createReservation } = useHotelData()

  const [status, setStatus] = useState('verifying') // 'verifying' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('')

  const bookingRef = searchParams.get('ref') || searchParams.get('bookingReference')
  const trackerToken = searchParams.get('tracker') || searchParams.get('token')

  useEffect(() => {
    let isMounted = true

    async function runVerification() {
      if (!bookingRef) {
        setStatus('error')
        setErrorMessage('No booking reference provided in verification URL.')
        return
      }

      try {
        const response = await verifyPaymentSession(bookingRef, trackerToken)

        if (response.success && response.data) {
          const { booking, payment } = response.data

          // Link reservation to user session if available
          if (linkReservationCode) {
            linkReservationCode(booking.bookingReference, booking.roomNumber)
          }

          // Format booking data for confirmation page
          const formattedBooking = {
            bookingRef: booking.bookingReference,
            roomNumber: booking.roomNumber,
            residence: {
              roomNumber: booking.roomNumber,
              name: booking.room?.name || `Suite ${booking.roomNumber}`,
              tier: booking.room?.tier || 'Presidential Penthouse',
              nightlyRate: booking.pricingSnapshot.nightlyRate,
            },
            nights: booking.numberOfNights,
            guestDossier: booking.guestDetails,
            total: booking.pricingSnapshot.totalAmount,
            advance: booking.pricingSnapshot.advancePaid || booking.pricingSnapshot.advanceAmount,
            balance: booking.pricingSnapshot.balanceDue,
            sindhTax: booking.pricingSnapshot.taxAmount,
            receiptNumber: payment?.receiptNumber || `RCP-${Date.now()}`,
            safepayRef: payment?.safepayReference || trackerToken,
            paymentMethod: payment?.paymentMethod || 'SAFEPAY_ONLINE',
            createdAt: booking.createdAt,
          }

          if (createReservation) {
            createReservation(formattedBooking)
          }

          if (isMounted) {
            setStatus('success')
            setTimeout(() => {
              navigate('/confirmation', {
                state: { booking: formattedBooking },
                replace: true,
              })
            }, 1200)
          }
        } else {
          throw new Error(response.message || 'Payment verification could not be completed.')
        }
      } catch (err) {
        console.error('[PaymentVerify] Verification error:', err.message)
        if (isMounted) {
          setStatus('error')
          setErrorMessage(err.message || 'Payment verification failed. Please contact concierge.')
        }
      }
    }

    runVerification()

    return () => {
      isMounted = false
    }
  }, [bookingRef, trackerToken, navigate, linkReservationCode, createReservation])

  return (
    <div className="min-h-screen bg-[#0E1201] text-[#FAF8F5] flex flex-col justify-between p-6 sm:p-12 font-sans-clean select-none">
      {/* Top Header */}
      <header className="max-w-xl w-full mx-auto flex items-center justify-between border-b border-slate-800 pb-4">
        <BrandLogo variant="full" theme="light" size="sm" to="/" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#A8A29E]">
          Safepay S2S Verification
        </span>
      </header>

      {/* Main Verification Card */}
      <main className="max-w-md w-full mx-auto my-auto bg-[#FAF8F5] text-slate-900 p-8 sm:p-10 rounded-[2px] shadow-2xl text-center space-y-6">
        {status === 'verifying' && (
          <div className="space-y-5 animate-fade-in">
            <div className="w-14 h-14 mx-auto rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
            
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono tracking-[0.25em] font-extrabold text-slate-500 uppercase block">
                Cryptographic Handshake
              </span>
              <h1 className="font-serif-grand text-2xl font-normal text-slate-900">
                Verifying Advance Deposit...
              </h1>
              <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                Confirming order settlement with Safepay and appending transaction to immutable ledger.
              </p>
            </div>

            <div className="p-3 bg-slate-100 rounded-[2px] font-mono text-[11px] text-slate-700 flex items-center justify-between">
              <span>Reference:</span>
              <strong className="text-slate-900">{bookingRef || '---'}</strong>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4 animate-fade-in">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl font-bold">
              ✓
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-[0.25em] font-extrabold text-emerald-800 uppercase block">
                Payment Authorized
              </span>
              <h2 className="font-serif-grand text-2xl font-normal text-slate-900">
                Reservation Confirmed!
              </h2>
              <p className="text-xs text-slate-600">
                Redirecting to your luxury reservation confirmation...
              </p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4 animate-fade-in">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-100 text-red-800 flex items-center justify-center text-xl font-bold">
              ✕
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-[0.25em] font-extrabold text-red-800 uppercase block">
                Verification Issue
              </span>
              <h2 className="font-serif-grand text-xl font-normal text-slate-900">
                Could Not Complete
              </h2>
              <p className="text-xs text-red-700 leading-relaxed">
                {errorMessage}
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                to={`/reserve${bookingRef ? `?ref=${bookingRef}` : ''}`}
                className="w-full py-3 bg-slate-900 hover:bg-[#0E1201] text-[#FAF8F5] font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] transition-colors"
              >
                Return to Reservation Flow &rarr;
              </Link>
              <Link
                to="/"
                className="text-xs font-mono text-slate-500 hover:text-slate-900 underline"
              >
                Back to Home
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center font-mono text-[9px] text-slate-500 max-w-xl mx-auto">
        Stayza Hotel &bull; Zero-Trust 2-Stage Payment Gateway &bull; Safepay Sandbox
      </footer>
    </div>
  )
}
