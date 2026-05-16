import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getIp } from '@/lib/parse-request'
import { isRateLimited } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  if (await isRateLimited(`contact:${getIp(request)}`)) {
    return NextResponse.json({ error: 'Too many messages. Please try again later.' }, { status: 429 })
  }

  const { email, message } = await request.json()
  const cleanEmail = String(email || '').trim()
  const cleanMessage = String(message || '').trim()
  if (!cleanEmail.includes('@') || cleanMessage.length < 10) {
    return NextResponse.json({ error: 'Enter a valid email and message.' }, { status: 400 })
  }

  if (!process.env.RESEND_API_KEY) {
    console.log('[contact]', { email: cleanEmail, message: cleanMessage })
    return NextResponse.json({ ok: true, queued: false })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const to = process.env.SUPPORT_EMAIL || process.env.AUTH_FROM_EMAIL || 'hello@privpulse.in'
  const from = process.env.EMAIL_FROM || process.env.AUTH_FROM_EMAIL || 'PrivPulse <onboarding@resend.dev>'
  const result = await resend.emails.send({
    from,
    to,
    reply_to: cleanEmail,
    subject: 'PrivPulse support request',
    text: `From: ${cleanEmail}\n\n${cleanMessage}`,
  })

  if (result.error) return NextResponse.json({ error: result.error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
