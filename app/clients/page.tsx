'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  TrendingDown, ArrowLeft, Trash2, ChevronRight,
  Users, Calendar, BarChart3, AlertTriangle, CheckCircle,
  XCircle, RefreshCw, Clock,
} from 'lucide-react'
import { StressTestResult } from '@/lib/api'

interface SavedReview {
  id: string
  clientName: string
  date: string
  scenario: string
  totalLossPct: number
  healthScore: number
  severityLabel: string
  portfolioValue: number
  stressedValue: number
  results: StressTestResult
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function HealthDot({ score }: { score: number }) {
  const cls = score >= 7 ? 'bg-[#00a87e]' : score >= 5 ? 'bg-[#b09000]' : score >= 3 ? 'bg-[#ec7e00]' : 'bg-[#e23b4a]'
  return <div className={`w-2 h-2 rounded-full shrink-0 ${cls}`} />
}

function DeltaBadge({ current, previous }: { current: number; previous: number }) {
  const delta = current - previous
  if (Math.abs(delta) < 0.5) return <span className='text-xs text-[#505a63]'>Unchanged</span>
  const improved = delta > 0
  return (
    <span className={`text-xs font-medium ${improved ? 'text-[#00a87e]' : 'text-[#e23b4a]'}`}>
      {improved ? '↑' : '↓'} {Math.abs(delta).toFixed(1)} pts
    </span>
  )
}

function ClientCard({ reviews, onDelete }: { reviews: SavedReview[]; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const latest = reviews[0]
  const previous = reviews[1]

  const healthColor = latest.healthScore >= 7 ? 'text-[#00a87e]'
    : latest.healthScore >= 5 ? 'text-[#b09000]'
    : latest.healthScore >= 3 ? 'text-[#ec7e00]'
    : 'text-[#e23b4a]'

  const GoalIcon = latest.totalLossPct > -15 ? CheckCircle
    : latest.totalLossPct > -30 ? AlertTriangle : XCircle
  const goalColor = latest.totalLossPct > -15 ? 'text-[#00a87e]'
    : latest.totalLossPct > -30 ? 'text-[#b09000]' : 'text-[#e23b4a]'

  return (
    <div className='bg-white/3 border border-white/8 rounded-2xl overflow-hidden'>
      <button
        onClick={() => setExpanded(e => !e)}
        className='w-full flex items-center gap-4 px-5 py-4 hover:bg-white/2 transition-colors text-left'>
        <div className='w-10 h-10 bg-[#494fdf]/20 rounded-xl flex items-center justify-center shrink-0'>
          <Users size={18} className='text-[#494fdf]' />
        </div>
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2 mb-0.5'>
            <HealthDot score={latest.healthScore} />
            <span className='font-medium text-white truncate'>{latest.clientName}</span>
          </div>
          <p className='text-xs text-[#505a63] truncate'>
            Last review: {fmtDate(latest.date)} · {reviews.length} review{reviews.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className='text-right shrink-0'>
          <div className={`text-lg font-medium tabular-nums ${latest.totalLossPct <= -10 ? 'text-[#e23b4a]' : 'text-[#ec7e00]'}`}>
            {latest.totalLossPct.toFixed(1)}%
          </div>
          <div className={`text-xs font-medium ${healthColor}`}>
            {latest.healthScore.toFixed(1)}/10
          </div>
        </div>
        <ChevronRight size={16} className={`text-[#505a63] shrink-0 transition-transform
          ${expanded ? 'rotate-90' : ''}`} />
      </button>

      {expanded && (
        <div className='border-t border-white/8'>
          {previous && (
            <div className='px-5 py-4 border-b border-white/6'>
              <div className='flex items-center gap-2 mb-3'>
                <RefreshCw size={13} className='text-[#494fdf]' />
                <span className='text-xs font-medium text-[#8d969e] uppercase tracking-wider'>
                  Annual comparison
                </span>
              </div>
              <div className='grid grid-cols-3 gap-3'>
                <div className='bg-white/3 rounded-xl p-3'>
                  <p className='text-xs text-[#505a63] mb-1'>Health score</p>
                  <div className='flex items-center gap-2'>
                    <p className={`text-lg font-medium ${
                      latest.healthScore >= 7 ? 'text-[#00a87e]' : latest.healthScore >= 5 ? 'text-[#b09000]' : 'text-[#e23b4a]'
                    }`}>
                      {latest.healthScore.toFixed(1)}
                    </p>
                    <DeltaBadge current={latest.healthScore} previous={previous.healthScore} />
                  </div>
                  <p className='text-xs text-[#505a63] mt-0.5'>was {previous.healthScore.toFixed(1)}</p>
                </div>
                <div className='bg-white/3 rounded-xl p-3'>
                  <p className='text-xs text-[#505a63] mb-1'>Stress loss</p>
                  <div className='flex items-center gap-2'>
                    <p className='text-lg font-medium text-[#e23b4a] tabular-nums'>
                      {latest.totalLossPct.toFixed(1)}%
                    </p>
                    <DeltaBadge current={latest.totalLossPct} previous={previous.totalLossPct} />
                  </div>
                  <p className='text-xs text-[#505a63] mt-0.5'>was {previous.totalLossPct.toFixed(1)}%</p>
                </div>
                <div className='bg-white/3 rounded-xl p-3'>
                  <p className='text-xs text-[#505a63] mb-1'>Portfolio value</p>
                  <p className='text-lg font-medium text-white tabular-nums'>
                    {fmt(latest.portfolioValue)}
                  </p>
                  <p className='text-xs text-[#505a63] mt-0.5'>was {fmt(previous.portfolioValue)}</p>
                </div>
              </div>
            </div>
          )}

          <div className='px-5 py-4'>
            <p className='text-xs font-medium text-[#505a63] uppercase tracking-wider mb-3'>
              Latest review — {fmtDate(latest.date)}
            </p>

            <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mb-4'>
              <div className='bg-white/3 rounded-xl p-3'>
                <p className='text-xs text-[#505a63] mb-1'>Portfolio</p>
                <p className='text-sm font-medium text-white'>{fmt(latest.portfolioValue)}</p>
              </div>
              <div className='bg-white/3 rounded-xl p-3'>
                <p className='text-xs text-[#505a63] mb-1'>Stressed value</p>
                <p className='text-sm font-medium text-[#e23b4a]'>{fmt(latest.stressedValue)}</p>
              </div>
              <div className='bg-white/3 rounded-xl p-3'>
                <p className='text-xs text-[#505a63] mb-1'>Health score</p>
                <p className={`text-sm font-medium ${healthColor}`}>{latest.healthScore.toFixed(1)}/10</p>
              </div>
              <div className='bg-white/3 rounded-xl p-3'>
                <p className='text-xs text-[#505a63] mb-1'>Goals</p>
                <div className='flex items-center gap-1.5'>
                  <GoalIcon size={13} className={goalColor} />
                  <p className={`text-sm font-medium ${goalColor}`}>
                    {latest.totalLossPct > -15 ? 'On track' : latest.totalLossPct > -30 ? 'At risk' : 'Off track'}
                  </p>
                </div>
              </div>
            </div>

            <div className='bg-white/2 rounded-xl px-4 py-3 mb-4'>
              <p className='text-xs text-[#505a63] leading-relaxed line-clamp-2'>
                <span className='text-[#8d969e] font-medium'>Scenario: </span>
                {latest.scenario}
              </p>
            </div>

            <div className='space-y-1.5 mb-4'>
              {reviews.map((review, i) => (
                <div key={review.id} className='flex items-center gap-3 py-2 px-3
                  bg-white/2 rounded-lg hover:bg-white/3 transition-colors group'>
                  <Clock size={12} className='text-[#505a63] shrink-0' />
                  <span className='text-xs text-[#505a63] flex-1'>{fmtDate(review.date)}</span>
                  <span className={`text-xs font-medium tabular-nums ${
                    review.totalLossPct > -10 ? 'text-[#ec7e00]' : 'text-[#e23b4a]'
                  }`}>
                    {review.totalLossPct.toFixed(1)}%
                  </span>
                  <span className={`text-xs tabular-nums ${
                    review.healthScore >= 7 ? 'text-[#00a87e]'
                    : review.healthScore >= 5 ? 'text-[#b09000]' : 'text-[#e23b4a]'
                  }`}>
                    {review.healthScore.toFixed(1)}/10
                  </span>
                  {i === 0 && (
                    <span className='text-[10px] text-[#494fdf] bg-[#494fdf]/10 border border-[#494fdf]/20
                      px-1.5 py-0.5 rounded-full shrink-0'>
                      Latest
                    </span>
                  )}
                  <button
                    onClick={e => { e.stopPropagation(); onDelete(review.id) }}
                    className='text-[#505a63] hover:text-[#e23b4a] transition-colors
                      opacity-0 group-hover:opacity-100 shrink-0'>
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ClientsPage() {
  const [reviews, setReviews] = useState<SavedReview[]>([])
  const [loaded, setLoaded]   = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('savedReviews')
      if (raw) setReviews(JSON.parse(raw))
    } catch {}
    setLoaded(true)
  }, [])

  const deleteReview = (id: string) => {
    setReviews(prev => {
      const next = prev.filter(r => r.id !== id)
      localStorage.setItem('savedReviews', JSON.stringify(next))
      return next
    })
  }

  const grouped = reviews.reduce<Record<string, SavedReview[]>>((acc, r) => {
    const key = r.clientName
    if (!acc[key]) acc[key] = []
    acc[key].push(r)
    return acc
  }, {})

  Object.values(grouped).forEach(g => g.sort((a, b) => b.date.localeCompare(a.date)))

  const clientNames = Object.keys(grouped).sort((a, b) => {
    const latestA = grouped[a][0].date
    const latestB = grouped[b][0].date
    return latestB.localeCompare(latestA)
  })

  return (
    <main className='min-h-screen bg-[#191c1f] text-white'>
      <div className='max-w-3xl mx-auto px-6 py-12'>

        {/* Header */}
        <div className='flex items-center justify-between mb-14'>
          <div className='flex items-center gap-3'>
            <Link href='/upload' className='flex items-center gap-2 text-[#8d969e]
              hover:text-white transition-colors'>
              <ArrowLeft size={14} />
            </Link>
            <div className='w-9 h-9 bg-[#494fdf] rounded-xl flex items-center justify-center'>
              <TrendingDown size={18} className='text-white' />
            </div>
            <span className='font-medium'>PortfolioStress</span>
          </div>
          <Link href='/upload'
            className='flex items-center gap-2 px-4 py-2 rounded-full
              bg-[#494fdf] hover:opacity-85 text-sm text-white font-medium transition-opacity'>
            New analysis
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* Page title */}
        <div className='mb-10'>
          <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            bg-[#494fdf]/10 border border-[#494fdf]/20 text-[#494fdf] text-xs font-medium mb-5'>
            <Calendar size={11} />
            Annual Review
          </div>
          <h1 className='font-medium text-white mb-3'
            style={{ fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: '1.1', letterSpacing: '-0.8px' }}>
            Saved client reviews
          </h1>
          <p className='text-[#8d969e] leading-relaxed' style={{ letterSpacing: '0.16px' }}>
            Track how each client's portfolio risk evolves over time.
            Save a review from any stress test results page.
          </p>
        </div>

        {!loaded ? (
          <div className='flex items-center justify-center py-20'>
            <div className='w-5 h-5 border-2 border-[#494fdf]/30 border-t-[#494fdf] rounded-full animate-spin' />
          </div>
        ) : clientNames.length === 0 ? (
          <div className='bg-white/3 border border-white/8 rounded-2xl p-12 text-center'>
            <div className='w-14 h-14 bg-[#494fdf]/20 rounded-2xl flex items-center
              justify-center mx-auto mb-5'>
              <Users size={24} className='text-[#494fdf]' />
            </div>
            <h3 className='text-xl font-medium text-white mb-2'>No reviews saved yet</h3>
            <p className='text-[#8d969e] text-sm leading-relaxed max-w-xs mx-auto mb-6'>
              After running a stress test, click "Save Review" to start tracking
              a client's portfolio health over time.
            </p>
            <Link href='/upload'
              className='inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                bg-[#494fdf] hover:opacity-85 text-sm text-white font-medium transition-opacity'>
              Run a stress test
              <ChevronRight size={14} />
            </Link>
          </div>
        ) : (
          <div className='space-y-3'>
            <div className='flex items-center justify-between mb-4'>
              <span className='text-sm text-[#8d969e]'>
                {clientNames.length} client{clientNames.length !== 1 ? 's' : ''} ·{' '}
                {reviews.length} review{reviews.length !== 1 ? 's' : ''} total
              </span>
            </div>
            {clientNames.map(name => (
              <ClientCard
                key={name}
                reviews={grouped[name]}
                onDelete={deleteReview}
              />
            ))}
          </div>
        )}

        <div className='mt-8 text-center text-xs text-[#505a63]'>
          Reviews are stored locally in your browser
        </div>
      </div>
    </main>
  )
}
