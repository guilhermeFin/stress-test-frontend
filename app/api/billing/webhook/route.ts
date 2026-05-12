import { stripe } from '@/lib/stripe'
import type Stripe from 'stripe'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

// Events that affect the firm's plan
const HANDLED_EVENTS = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
])

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return Response.json({ error: 'Missing signature or webhook secret' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch {
    return Response.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (!HANDLED_EVENTS.has(event.type)) {
    return Response.json({ received: true })
  }

  // Forward the event to FastAPI for business logic (firm.plan update, etc.)
  try {
    await fetch(`${API_URL}/api/v1/billing/webhook-sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: event.type, data: event.data.object }),
      signal: AbortSignal.timeout(10000),
    })
  } catch {
    // Log but don't fail — Stripe will retry on 5xx
    console.error('[webhook] Failed to sync event to backend:', event.type)
    return Response.json({ error: 'Backend sync failed' }, { status: 500 })
  }

  return Response.json({ received: true })
}
