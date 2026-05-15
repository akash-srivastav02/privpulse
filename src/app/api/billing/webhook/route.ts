import { NextRequest, NextResponse } from 'next/server'
// Lemon Squeezy webhook handler
// Docs: https://docs.lemonsqueezy.com/help/webhooks
export async function POST(request: NextRequest) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET
  if (!secret) return NextResponse.json({error:'Not configured'},{status:500})
  try {
    const body = await request.text()
    const sig = request.headers.get('X-Signature')
    // TODO: Verify HMAC signature
    // TODO: Parse event type (subscription_created, subscription_cancelled, etc.)
    // TODO: Update user plan in Supabase sites table
    console.log('Webhook received:', sig)
    return NextResponse.json({ok:true})
  } catch (err) {
    return NextResponse.json({error:'Webhook error'},{status:400})
  }
}
