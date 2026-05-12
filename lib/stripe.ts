import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set')
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-04-22.dahlia',
    })
  }
  return _stripe
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop]
  },
})

export const PLANS = {
  starter: {
    name: 'Starter',
    price: 99,
    priceId: process.env.STRIPE_PRICE_STARTER!,
    features: [
      '25 stress tests / month',
      'Excel upload + template',
      '6 historical crisis scenarios',
      'Factor risk model & correlation',
      'Monte Carlo simulation (1,000 paths)',
      'Benchmark comparison',
      'PDF export',
      'Email support',
    ],
  },
  professional: {
    name: 'Professional',
    price: 299,
    priceId: process.env.STRIPE_PRICE_PROFESSIONAL!,
    features: [
      'Unlimited stress tests',
      'Everything in Starter',
      'Custom scenario builder + sliders',
      'Tax impact analysis',
      'AI analyst memo',
      'Client presentation mode',
      'Portfolio comparison tool',
      'Custom ticker portfolios',
      'Household / multi-account view',
      'Branded PDF reports',
      'Priority support',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    price: 799,
    priceId: process.env.STRIPE_PRICE_ENTERPRISE!,
    features: [
      'Everything in Professional',
      'Unlimited team seats',
      'White-labeled client portal',
      'CRM integration (Salesforce, Redtail)',
      'Custodian sync (Schwab, Fidelity)',
      'Compliance audit trail',
      'API access',
      'Dedicated account manager',
    ],
  },
} as const

export type Plan = keyof typeof PLANS
