import { Resend } from 'resend'
import type { H3Event } from 'h3'

const resend = new Resend(process.env.NUXT_PRIVATE_RESEND_API_KEY)

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = (await readBody(event))
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
    throw createError({ statusCode: 500, statusMessage: 'Failed to send message' })
  }
})
