const nodemailer = require('nodemailer')
const { generateInvoicePDFBuffer } = require('./invoiceService')

/**
 * Email Service — Transactional Hotel Email & Invoicing Pipeline
 * 
 * Delivers official SRB-compliant PDF tax invoices and booking confirmations directly
 * to guest inboxes upon 30% Safepay online payment and 100% front desk check-out.
 * 
 * Transactional Email Service Architecture:
 * - Clean plain-English copy matching Stayza's luxury aesthetic (No AI jargon).
 * - Zero Disk Footprint: In-memory binary PDF buffer attached directly to outgoing mail.
 * - Non-blocking Resilience: Dispatch failures are caught gracefully and never break or
 *   block booking confirmation or front-desk check-out.
 */

// Cache transporter instance
let cachedTransporter = null

/**
 * Initialize or retrieve active Nodemailer transporter
 */
async function getTransporter() {
  if (cachedTransporter) return cachedTransporter

  const host = process.env.SMTP_HOST
  const port = parseInt(process.env.SMTP_PORT || '587', 10)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (user && pass) {
    // Production / Configured SMTP (e.g., Gmail, SendGrid, Brevo, AWS SES)
    cachedTransporter = nodemailer.createTransport({
      host: host || 'smtp.gmail.com',
      port,
      secure: port === 465,
      auth: { user, pass },
    })
    return cachedTransporter
  }

  // Graceful fallback for local development or staging tests (Ethereal virtual inbox)
  try {
    const testAccount = await nodemailer.createTestAccount()
    cachedTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    })
    console.log('[EmailService] Initialized Ethereal test mailer for virtual inboxes.')
    return cachedTransporter
  } catch (err) {
    console.warn('[EmailService] Could not initialize Ethereal; emails will run in simulation mode:', err.message)
    return null
  }
}

/**
 * Base email layout wrapper with Stayza styling
 */
function wrapEmailLayout({ preheader, contentHtml }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Stayza Hotel & Resort</title>
  <style>
    body { margin: 0; padding: 0; background-color: #FAF8F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0F172A; }
    table { border-collapse: collapse; }
  </style>
</head>
<body style="margin: 0; padding: 24px 10px; background-color: #FAF8F5;">
  <span style="display: none; font-size: 1px; color: #FAF8F5; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${preheader}
  </span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 580px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden;">
    <!-- Header -->
    <tr>
      <td style="background-color: #0F172A; padding: 28px 32px;">
        <div style="color: #FFFFFF; font-size: 16px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;">
          STAYZA HOTEL &amp; RESORT
        </div>
        <div style="color: #94A3B8; font-size: 11px; margin-top: 4px; letter-spacing: 0.04em;">
          Beachfront Avenue, Coastal Highway, Thatta, Sindh, Pakistan
        </div>
      </td>
    </tr>
    <!-- Main Body Content -->
    <tr>
      <td style="padding: 32px; font-size: 14px; line-height: 1.6; color: #334155;">
        ${contentHtml}
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="background-color: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 20px 32px; text-align: center; font-size: 11px; color: #94A3B8; line-height: 1.5;">
        Stayza Hotel &amp; Resort &bull; Beachfront Avenue, Thatta, Sindh<br>
        Direct: +92 21 3890 0000 &bull; Email: hello@stayza.com &bull; Web: www.stayza.com<br>
        NTN: 9821481-2 | STRN: 17-00-9821-001
      </td>
    </tr>
  </table>
</body>
</html>`
}

/**
 * Trigger 1: Send Booking Confirmation Email with 30% Deposit PDF
 */
async function sendBookingConfirmationEmail(booking, payment) {
  try {
    const recipientEmail = booking.guestDetails?.email
    if (!recipientEmail || recipientEmail === 'guest@stayza.com' || recipientEmail === 'guest@stayza.pk') {
      console.log(`[EmailService] Skipping booking confirmation: No real guest email on record (${recipientEmail})`)
      return { success: false, reason: 'NO_RECIPIENT_EMAIL' }
    }

    const transporter = await getTransporter()
    if (!transporter) {
      console.log('[EmailService] Transporter unavailable; skipping email dispatch.')
      return { success: false, reason: 'NO_TRANSPORTER' }
    }

    // 1. Generate official PDF in-memory buffer
    const pdfBuffer = await generateInvoicePDFBuffer(booking, payment ? [payment] : [])

    // 2. Format details
    const guestName = booking.guestDetails?.name || 'Valued Guest'
    const ref = booking.bookingReference
    const roomName = booking.room?.name || `Suite ${booking.roomNumber}`
    const nights = booking.numberOfNights || 1
    const checkInStr = booking.checkInDate
      ? new Date(booking.checkInDate).toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
      : 'Flexible'
    const checkOutStr = booking.checkOutDate
      ? new Date(booking.checkOutDate).toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
      : 'Flexible'

    const totalAmount = booking.pricingSnapshot?.totalAmount || 0
    const advancePaid = booking.pricingSnapshot?.advancePaid || booking.pricingSnapshot?.advanceAmount || Math.round(totalAmount * 0.3)
    const balanceDue = booking.pricingSnapshot?.balanceDue || Math.max(0, totalAmount - advancePaid)

    const contentHtml = `
      <div style="display: inline-block; background-color: #ECFDF5; color: #065F46; border: 1px solid #A7F3D0; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 16px;">
        Deposit Confirmed
      </div>
      <h2 style="margin: 0 0 12px 0; color: #0F172A; font-size: 20px; font-weight: 700;">
        Reservation Confirmed
      </h2>
      <p style="margin: 0 0 16px 0;">Dear ${guestName},</p>
      <p style="margin: 0 0 20px 0;">
        Thank you for booking with Stayza. We have received your 30% advance deposit payment via Safepay. Your room is reserved and guaranteed.
      </p>

      <table width="100%" cellpadding="8" cellspacing="0" style="background-color: #FAF8F5; border: 1px solid #E2E8F0; border-radius: 6px; margin-bottom: 20px; font-size: 13px;">
        <tr>
          <td style="color: #64748B; width: 40%; border-bottom: 1px solid #E2E8F0;">Booking Reference:</td>
          <td style="color: #0F172A; font-weight: 700; text-align: right; border-bottom: 1px solid #E2E8F0; font-family: monospace;">${ref}</td>
        </tr>
        <tr>
          <td style="color: #64748B; border-bottom: 1px solid #E2E8F0;">Suite Assigned:</td>
          <td style="color: #0F172A; font-weight: 600; text-align: right; border-bottom: 1px solid #E2E8F0;">Suite ${booking.roomNumber} (${roomName})</td>
        </tr>
        <tr>
          <td style="color: #64748B; border-bottom: 1px solid #E2E8F0;">Check-in:</td>
          <td style="color: #0F172A; font-weight: 600; text-align: right; border-bottom: 1px solid #E2E8F0;">${checkInStr} (from 2:00 PM)</td>
        </tr>
        <tr>
          <td style="color: #64748B; border-bottom: 1px solid #E2E8F0;">Check-out:</td>
          <td style="color: #0F172A; font-weight: 600; text-align: right; border-bottom: 1px solid #E2E8F0;">${checkOutStr} (until 12:00 PM)</td>
        </tr>
        <tr>
          <td style="color: #64748B;">Duration:</td>
          <td style="color: #0F172A; font-weight: 600; text-align: right;">${nights} ${nights === 1 ? 'Night' : 'Nights'}</td>
        </tr>
      </table>

      <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 16px; margin-bottom: 20px;">
        <table width="100%" cellpadding="4" cellspacing="0" style="font-size: 13px; color: #475569;">
          <tr>
            <td>Total Reservation (All-Inclusive Tariff):</td>
            <td style="text-align: right; font-weight: 700; color: #0F172A;">PKR ${totalAmount.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="color: #065F46; font-weight: 600;">30% Advance Deposit Paid (Safepay):</td>
            <td style="text-align: right; color: #065F46; font-weight: 700;">- PKR ${advancePaid.toLocaleString()}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding-top: 10px;">
              <div style="background-color: #FEF3C7; color: #92400E; padding: 8px 10px; border-radius: 4px; font-weight: 700; font-size: 13px;">
                Balance Due at Check-in: PKR ${balanceDue.toLocaleString()}
              </div>
            </td>
          </tr>
        </table>
      </div>

      <div style="background-color: #FAF8F5; border: 1px dashed #CBD5E1; border-radius: 6px; padding: 12px 16px; margin-bottom: 20px;">
        <span style="font-size: 18px; vertical-align: middle; margin-right: 8px;">&#128206;</span>
        <strong style="color: #0F172A; font-size: 13px;">Stayza-Deposit-Receipt-${ref}.pdf</strong>
        <div style="font-size: 12px; color: #64748B; margin-top: 2px;">
          Official SRB-compliant deposit receipt attached to this email.
        </div>
      </div>

      <div style="font-size: 12px; color: #64748B; line-height: 1.6; border-left: 3px solid #CBD5E1; padding-left: 12px; margin-bottom: 24px;">
        <strong>Check-in Notes:</strong><br>
        &bull; Please present this booking reference or valid CNIC/Passport at the front desk upon arrival.<br>
        &bull; The remaining balance can be settled at check-in using cash or debit/credit card (POS).<br>
        &bull; If your travel plans change or you require early check-in, please let us know.
      </div>

      <p style="margin: 0;">
        Warm regards,<br>
        <strong>Front Desk &amp; Reservations Team</strong><br>
        Stayza Hotel &amp; Resort
      </p>
    `

    const html = wrapEmailLayout({
      preheader: `Reservation Confirmed for Suite ${booking.roomNumber}. 30% advance deposit received.`,
      contentHtml,
    })

    const sender = process.env.SMTP_FROM || `"Stayza Hotel & Resort" <${process.env.SMTP_USER || 'hello@stayza.com'}>`

    const info = await transporter.sendMail({
      from: sender,
      to: recipientEmail,
      subject: `Reservation Confirmed — Suite ${booking.roomNumber} | Stayza Hotel & Resort`,
      html,
      attachments: [
        {
          filename: `Stayza-Deposit-Receipt-${ref}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    })

    console.log(`[EmailService] Booking confirmation email dispatched to ${recipientEmail} (MessageId: ${info.messageId})`)
    const previewUrl = nodemailer.getTestMessageUrl(info)
    if (previewUrl) {
      console.log(`[EmailService] Virtual Preview URL: ${previewUrl}`)
    }

    return { success: true, messageId: info.messageId, previewUrl }
  } catch (err) {
    console.error('[EmailService.sendBookingConfirmationEmail] Error dispatching mail:', err.message)
    return { success: false, error: err.message }
  }
}

/**
 * Trigger 2: Send Check-Out Final Tax Invoice Email (100% Settled)
 */
async function sendCheckoutInvoiceEmail(booking, payments = []) {
  try {
    const recipientEmail = booking.guestDetails?.email
    if (!recipientEmail || recipientEmail === 'guest@stayza.com' || recipientEmail === 'guest@stayza.pk') {
      console.log(`[EmailService] Skipping checkout invoice: No real guest email on record (${recipientEmail})`)
      return { success: false, reason: 'NO_RECIPIENT_EMAIL' }
    }

    const transporter = await getTransporter()
    if (!transporter) {
      console.log('[EmailService] Transporter unavailable; skipping checkout email dispatch.')
      return { success: false, reason: 'NO_TRANSPORTER' }
    }

    // 1. Generate official PDF in-memory buffer
    const pdfBuffer = await generateInvoicePDFBuffer(booking, payments)

    // 2. Format details
    const guestName = booking.guestDetails?.name || 'Valued Guest'
    const ref = booking.bookingReference
    const invoiceNum = `INV-2026-${ref.slice(-4)}`
    const roomName = booking.room?.name || `Suite ${booking.roomNumber}`
    const nights = booking.numberOfNights || 1
    const totalAmount = booking.pricingSnapshot?.totalAmount || 0
    const advancePaid = booking.pricingSnapshot?.advancePaid || booking.pricingSnapshot?.advanceAmount || Math.round(totalAmount * 0.3)
    const checkOutSettled = Math.max(0, totalAmount - advancePaid)

    const checkInStr = booking.checkInDate
      ? new Date(booking.checkInDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
      : 'Flexible'
    const checkOutStr = booking.checkedOutAt
      ? new Date(booking.checkedOutAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
      : new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })

    const contentHtml = `
      <div style="display: inline-block; background-color: #ECFDF5; color: #065F46; border: 1px solid #10B981; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 16px;">
        Account Settled &amp; Checked Out
      </div>
      <h2 style="margin: 0 0 12px 0; color: #0F172A; font-size: 20px; font-weight: 700;">
        Final Tax Invoice &amp; Stay Statement
      </h2>
      <p style="margin: 0 0 16px 0;">Dear ${guestName},</p>
      <p style="margin: 0 0 20px 0;">
        Thank you for staying with us at Stayza. Your check-out has been completed, and your account is settled in full.
      </p>

      <table width="100%" cellpadding="8" cellspacing="0" style="background-color: #FAF8F5; border: 1px solid #E2E8F0; border-radius: 6px; margin-bottom: 20px; font-size: 13px;">
        <tr>
          <td style="color: #64748B; width: 40%; border-bottom: 1px solid #E2E8F0;">Invoice Number:</td>
          <td style="color: #0F172A; font-weight: 700; text-align: right; border-bottom: 1px solid #E2E8F0; font-family: monospace;">${invoiceNum}</td>
        </tr>
        <tr>
          <td style="color: #64748B; border-bottom: 1px solid #E2E8F0;">Booking Reference:</td>
          <td style="color: #0F172A; font-weight: 700; text-align: right; border-bottom: 1px solid #E2E8F0; font-family: monospace;">${ref}</td>
        </tr>
        <tr>
          <td style="color: #64748B; border-bottom: 1px solid #E2E8F0;">Suite:</td>
          <td style="color: #0F172A; font-weight: 600; text-align: right; border-bottom: 1px solid #E2E8F0;">Suite ${booking.roomNumber} (${roomName})</td>
        </tr>
        <tr>
          <td style="color: #64748B; border-bottom: 1px solid #E2E8F0;">Stay Dates:</td>
          <td style="color: #0F172A; font-weight: 600; text-align: right; border-bottom: 1px solid #E2E8F0;">${checkInStr} &ndash; ${checkOutStr} (${nights}N)</td>
        </tr>
      </table>

      <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 16px; margin-bottom: 20px;">
        <table width="100%" cellpadding="4" cellspacing="0" style="font-size: 13px; color: #475569;">
          <tr>
            <td>Total Folio (All-Inclusive Tariff):</td>
            <td style="text-align: right; font-weight: 700; color: #0F172A;">PKR ${totalAmount.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="color: #065F46;">Online Advance Deposit Paid (Safepay):</td>
            <td style="text-align: right; color: #065F46; font-weight: 600;">- PKR ${advancePaid.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="color: #065F46;">Check-out Settlement:</td>
            <td style="text-align: right; color: #065F46; font-weight: 600;">- PKR ${checkOutSettled.toLocaleString()}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding-top: 10px;">
              <div style="background-color: #ECFDF5; color: #065F46; padding: 8px 10px; border-radius: 4px; font-weight: 700; font-size: 13px;">
                Final Outstanding Balance: PKR 0 (Fully Settled)
              </div>
            </td>
          </tr>
        </table>
      </div>

      <div style="background-color: #FAF8F5; border: 1px dashed #CBD5E1; border-radius: 6px; padding: 12px 16px; margin-bottom: 20px;">
        <span style="font-size: 18px; vertical-align: middle; margin-right: 8px;">&#128206;</span>
        <strong style="color: #0F172A; font-size: 13px;">Stayza-Tax-Invoice-${ref}.pdf</strong>
        <div style="font-size: 12px; color: #64748B; margin-top: 2px;">
          Official itemized tax invoice with SRB NTN/STRN certification attached.
        </div>
      </div>

      <p style="margin: 0 0 20px 0;">
        We hope you enjoyed your stay with us and had a safe trip home. We look forward to welcoming you back to Stayza on your next visit to the coast.
      </p>

      <p style="margin: 0;">
        Warm regards,<br>
        <strong>Accounts &amp; Guest Relations</strong><br>
        Stayza Hotel &amp; Resort
      </p>
    `

    const html = wrapEmailLayout({
      preheader: `Final Tax Invoice for Stayza Booking ${ref}. Account settled in full.`,
      contentHtml,
    })

    const sender = process.env.SMTP_FROM || `"Stayza Hotel & Resort" <${process.env.SMTP_USER || 'hello@stayza.com'}>`

    const info = await transporter.sendMail({
      from: sender,
      to: recipientEmail,
      subject: `Official Tax Invoice & Stay Statement — Stayza Hotel & Resort`,
      html,
      attachments: [
        {
          filename: `Stayza-Tax-Invoice-${ref}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    })

    console.log(`[EmailService] Check-out tax invoice dispatched to ${recipientEmail} (MessageId: ${info.messageId})`)
    const previewUrl = nodemailer.getTestMessageUrl(info)
    if (previewUrl) {
      console.log(`[EmailService] Virtual Preview URL: ${previewUrl}`)
    }

    return { success: true, messageId: info.messageId, previewUrl }
  } catch (err) {
    console.error('[EmailService.sendCheckoutInvoiceEmail] Error dispatching checkout mail:', err.message)
    return { success: false, error: err.message }
  }
}

/**
 * Trigger 3: Send One-Time Passcode (OTP) for Guest Password Reset
 */
async function sendPasswordResetOtpEmail({ email, name, otp }) {
  try {
    if (!email) {
      return { success: false, reason: 'NO_RECIPIENT_EMAIL' }
    }

    const transporter = await getTransporter()
    if (!transporter) {
      console.log(`[EmailService] Simulation Mode: OTP for ${email} is: [${otp}]`)
      return { success: true, simulated: true, otp }
    }

    const guestName = name || 'Valued Guest'
    const contentHtml = `
      <div style="display: inline-block; background-color: #FEF3C7; color: #92400E; border: 1px solid #FDE68A; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 16px;">
        Security Verification
      </div>
      <h2 style="margin: 0 0 12px 0; color: #0F172A; font-size: 20px; font-weight: 700;">
        Reset Your Stayza Account Password
      </h2>
      <p style="margin: 0 0 16px 0;">Dear ${guestName},</p>
      <p style="margin: 0 0 20px 0;">
        We received a request to reset the password for your Stayza account. Use the 6-digit verification code below to authorize this change:
      </p>

      <div style="background-color: #F8FAFC; border: 2px dashed #CBD5E1; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
        <span style="font-family: monospace, 'Courier New', Courier; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #065F46;">
          ${otp}
        </span>
        <div style="margin-top: 8px; font-size: 12px; color: #64748B;">
          This verification code expires in 10 minutes.
        </div>
      </div>

      <p style="margin: 0 0 12px 0; font-size: 13px; color: #64748B;">
        If you did not request this password reset, please ignore this email or notify the front desk immediately. Your current password will remain unchanged.
      </p>
    `

    const html = wrapEmailLayout({
      preheader: `Your Stayza verification code is ${otp}`,
      contentHtml,
    })

    const info = await transporter.sendMail({
      from: `"Stayza Security & Concierge" <${process.env.SMTP_FROM || 'concierge@stayza.com'}>`,
      to: email,
      subject: `${otp} is your Stayza verification code`,
      html,
    })

    console.log(`[EmailService] Password reset OTP dispatched to ${email} (MessageId: ${info.messageId})`)
    const previewUrl = nodemailer.getTestMessageUrl(info)
    if (previewUrl) {
      console.log(`[EmailService] Virtual Preview URL: ${previewUrl}`)
    }

    return { success: true, messageId: info.messageId, previewUrl, otp }
  } catch (err) {
    console.error('[EmailService.sendPasswordResetOtpEmail] Error dispatching OTP email:', err.message)
    return { success: false, error: err.message, otp }
  }
}

module.exports = {
  sendBookingConfirmationEmail,
  sendCheckoutInvoiceEmail,
  sendPasswordResetOtpEmail,
}
