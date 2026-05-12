'use client'

import { useState, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, ArrowLeft, Zap, Shield, Building2, ExternalLink, AlertCircle } from 'lucide-react'
import Logo from '@/components/Logo'
import { Button } from '@/components/ui/neon-button'
import { PLANS, type Plan } from '@/lib/stripe'

const PLAN_ICONS = {
  starter: Zap,
  professional: Shield,
  enterprise: Building2,
}

function BillingContent() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const router = useRouter()

  const currentPlan = (session?.user?.plan ?? 'starter') as Plan
  const success  = searchParams.get('success') === 'true'
  const canceled = searchParams.get('canceled') === 'true'

  const [upgrading, setUpgrading]   = useState<Plan | null>(null)
  const [portaling, setPortaling]   = useState(false)
  const [error, setError]           = useState('')

  const handleUpgrade = async (plan: Plan) => {
    if (plan === currentPlan) return
    setUpgrading(plan)
    setError('')
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json() as { url?: string; error?: string }
      if (!res.ok || !data.url) {
        setError(data.error ?? 'Failed to start checkout. Please try again.')
        return
      }
      window.location.href = data.url
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setUpgrading(null)
    }
  }

  const handlePortal = async () => {
    setPortaling(true)
    setError('')
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' })
      const data = await res.json() as { url?: string; error?: string }
      if (!res.ok || !data.url) {
        setError(data.error ?? 'Could not open billing portal.')
        return
      }
      window.location.href = data.url
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setPortaling(false)
    }
  }

  return (
    <main className='min-h-screen bg-[#0A0F1E] text-white'>
      <div className='max-w-5xl mx-auto px-6 py-12'>

        {/* Header */}
        <div className='flex items-center gap-3 mb-12'>
          <Link href='/' className='text-gray-500 hover:text-gray-300 transition-colors'>
            <ArrowLeft size={16} />
          </Link>
          <Logo size={20} />
          <div className='h-4 w-px bg-white/10' />
          <span className='text-sm text-gray-500'>Billing & Plan</span>
        </div>

        {/* Success / canceled banners */}
        {success && (
          <div className='flex items-center gap-3 bg-green-950/50 border border-green-700/40
            rounded-xl px-4 py-3 mb-8'>
            <CheckCircle2 size={16} className='text-green-400 shrink-0' />
            <p className='text-sm text-green-300'>
              Your plan has been upgraded. Thank you!
            </p>
            <button onClick={() => router.replace('/settings/billing')}
              className='ml-auto text-green-600 hover:text-green-400 text-xs transition-colors'>
              Dismiss
            </button>
          </div>
        )}
        {canceled && (
          <div className='flex items-center gap-3 bg-yellow-950/40 border border-yellow-700/30
            rounded-xl px-4 py-3 mb-8'>
            <AlertCircle size={16} className='text-yellow-400 shrink-0' />
            <p className='text-sm text-yellow-300'>Checkout canceled — your plan has not changed.</p>
            <button onClick={() => router.replace('/settings/billing')}
              className='ml-auto text-yellow-600 hover:text-yellow-400 text-xs transition-colors'>
              Dismiss
            </button>
          </div>
        )}

        <div className='mb-10'>
          <h1 className='text-2xl font-bold tracking-tight mb-1'>Billing & Plan</h1>
          <p className='text-gray-400 text-sm'>
            Current plan:{' '}
            <span className='text-white font-medium capitalize'>{currentPlan}</span>
            {session?.user?.email && (
              <span className='text-gray-600'> · {session.user.email}</span>
            )}
          </p>
        </div>

        {error && (
          <div className='flex items-center gap-2 bg-red-950/40 border border-red-700/30
            rounded-xl px-4 py-3 mb-8 text-red-300 text-sm'>
            <AlertCircle size={14} className='shrink-0' />
            {error}
          </div>
        )}

        {/* Plan cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-10'>
          {(Object.keys(PLANS) as Plan[]).map((key) => {
            const plan    = PLANS[key]
            const Icon    = PLAN_ICONS[key]
            const isCurrent = key === currentPlan
            const isPopular  = key === 'professional'
            const isLoading  = upgrading === key

            return (
              <div key={key} className='relative'>
                {isPopular && (
                  <div className='absolute -top-4 inset-x-0 flex justify-center'>
                    <span className='px-3 py-1 bg-[#3B82F6] text-white text-xs
                      font-semibold rounded-full shadow-lg shadow-[#3B82F6]/20'>
                      Most Popular
                    </span>
                  </div>
                )}
                <div className={`h-full rounded-[1.5rem] border p-6 flex flex-col
                  transition-all duration-300
                  ${isCurrent
                    ? 'bg-[#3B82F6]/10 border-[#3B82F6]/40 shadow-[0_0_30px_rgba(59,130,246,0.08)]'
                    : 'bg-white/[0.03] border-white/8 hover:border-white/15'}`}>

                  <div className='flex items-center justify-between mb-5'>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center
                      ${isCurrent ? 'bg-[#3B82F6]/20' : 'bg-white/5'}`}>
                      <Icon size={17} className={isCurrent ? 'text-[#3B82F6]' : 'text-gray-400'} />
                    </div>
                    {isCurrent && (
                      <span className='text-xs font-semibold text-[#3B82F6] bg-[#3B82F6]/10
                        border border-[#3B82F6]/20 px-2.5 py-0.5 rounded-full'>
                        Current plan
                      </span>
                    )}
                  </div>

                  <h3 className='font-semibold text-white mb-0.5'>{plan.name}</h3>
                  <div className='flex items-baseline gap-1 mb-5'>
                    <span className='text-3xl font-black text-white'>${plan.price}</span>
                    <span className='text-gray-500 text-sm'>/mo</span>
                  </div>

                  <ul className='space-y-2.5 flex-1 mb-6'>
                    {plan.features.map(f => (
                      <li key={f} className='flex items-start gap-2 text-xs text-gray-400'>
                        <CheckCircle2 size={13}
                          className={`shrink-0 mt-0.5 ${isCurrent ? 'text-[#3B82F6]' : 'text-green-400'}`} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {isCurrent ? (
                    <button
                      onClick={handlePortal}
                      disabled={portaling}
                      className='w-full flex items-center justify-center gap-2 py-2.5
                        rounded-xl border border-white/10 text-sm font-medium text-gray-400
                        hover:border-white/20 hover:text-white transition-all duration-200
                        disabled:opacity-50 disabled:cursor-not-allowed'>
                      {portaling
                        ? <span className='w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                        : <><ExternalLink size={13} /> Manage subscription</>}
                    </button>
                  ) : key === 'enterprise' ? (
                    <a href='mailto:hello@vantage.app'
                      className='w-full flex items-center justify-center gap-2 py-2.5
                        rounded-xl border border-white/10 text-sm font-medium text-gray-400
                        hover:border-white/20 hover:text-white transition-all duration-200'>
                      Contact sales
                    </a>
                  ) : (
                    <Button
                      onClick={() => handleUpgrade(key)}
                      disabled={!!upgrading}
                      variant='solid'
                      className='w-full py-2.5 rounded-xl text-sm font-semibold
                        disabled:opacity-50 disabled:cursor-not-allowed mx-0'>
                      {isLoading
                        ? <span className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                        : `Upgrade to ${plan.name}`}
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <p className='text-xs text-gray-600 text-center'>
          Payments are processed securely by Stripe. Cancel anytime from the billing portal.
        </p>
      </div>
    </main>
  )
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div className='min-h-screen bg-[#0A0F1E]' />}>
      <BillingContent />
    </Suspense>
  )
}
