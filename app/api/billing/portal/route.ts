import { auth } from '@/auth'
import { stripe } from '@/lib/stripe'

const APP_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export async function POST() {
  const session = await auth()
  if (!session?.user?.email) {
    return Response.json({ error: 'Unauthenticated' }, { status: 401 })
  }

  try {
    // Look up the Stripe customer by email
    const customers = await stripe.customers.list({ email: session.user.email, limit: 1 })
    if (!customers.data.length) {
      return Response.json({ error: 'No Stripe customer found' }, { status: 404 })
    }
    const portal = await stripe.billingPortal.sessions.create({
      customer: customers.data[0].id,
      return_url: `${APP_URL}/settings/billing`,
    })
    return Response.json({ url: portal.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Stripe error'
    return Response.json({ error: message }, { status: 500 })
  }
}
