import { Resend } from 'resend'
import type { H3Event } from 'h3'

const resend = new Resend(process.env.NUXT_PRIVATE_RESEND_API_KEY)

// Rate limiter: track requests by IP address
const requests = new Map<string, { count: number; time: number }>()

function checkRateLimit(event: H3Event, maxRequests = 5, windowMs = 60_000) {
  const ip = getRequestIP(event) || 'unknown'
  const now = Date.now()

  const record = requests.get(ip)

  if (record && now - record.time < windowMs) {
    if (record.count >= maxRequests) {
      throw createError({ statusCode: 429, statusMessage: 'Too many requests. Please try again later.' })
    }
    record.count++
  }
  else {
    requests.set(ip, { count: 1, time: now })
  }
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    // Rate limiting: max 5 requests per 60 seconds per IP
    checkRateLimit(event)

    const body = (await readBody(event))
    
    // Honeypot check: if company field is filled, it's likely a bot
    if (body.company) {
      // Bot detected — pretend success
      return { ok: true }
    }
    
    const { email, subject, message, phone, fullname } = body
    return await resend.emails.send({
      from: process.env.NUXT_PRIVATE_CONTACT_FROM!,
      to: [process.env.NUXT_PRIVATE_CONTACT_TO!],
      subject: 'New message from my blog',
      html: `
      <p>A new message from your blog contact form.</p>
      <p>Message details:</p>
      <ul>
        <li>Name: ${fullname}</li>
        <li>Email: ${email}</li>
        <li>Phone: ${phone}</li>
        <li>Subject: ${subject}</li>
        <li>Message: ${message}</li>
      </ul>
      `,
    })
  }
  catch (error) {
    // Re-throw rate limit errors as-is
    if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 429) {
      throw error
    }
    throw createError({ statusCode: 500, statusMessage: 'Failed to send message' })
  }
})
