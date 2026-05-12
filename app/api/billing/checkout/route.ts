import { auth } from '@/auth'
import { stripe, PLANS, type Plan } from '@/lib/stripe'

const APP_URL = process.env.NEXTAUTH_URL ?? process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return Response.json({ error: 'Unauthenticated' }, { status: 401 })
  }

  const body = await req.json() as { plan?: string }
  const plan = body.plan as Plan | undefined
  if (!plan || !PLANS[plan]) {
    return Response.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const priceId = PLANS[plan].priceId
  if (!priceId || priceId === 'undefined') {
    return Response.json(
      { error: 'Plan price not configured. Add STRIPE_PRICE_* env vars.' },
      { status: 503 }
    )
  }

  try {
    const checkout = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: session.user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        firm_id: session.user.firmId ?? '',
        user_id: session.user.id ?? '',
        plan,
      },
      success_url: `${APP_URL}/settings/billing?success=true&plan=${plan}`,
      cancel_url: `${APP_URL}/settings/billing?canceled=true`,
    })
    return Response.json({ url: checkout.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Stripe error'
    return Response.json({ error: message }, { status: 500 })
  }
}
