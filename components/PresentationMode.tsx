'use client'

import { useState, useEffect, useCallback } from 'react'
import { StressTestResult } from '@/lib/api'
import { ClientProfile } from './ClientImpact'
import {
  X, ChevronLeft, ChevronRight, Brain,
  TrendingDown, CheckCircle, AlertTriangle, XCircle,
  Lightbulb, Target, BarChart3, Activity,
} from 'lucide-react'

interface Props {
  results: StressTestResult
  profile: ClientProfile
  onClose: () => void
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export default function PresentationMode({ results, profile, onClose }: Props) {
  const [slide, setSlide] = useState(0)

  const { summary, positions, explanation } = results

  const healthScore = Math.max(1, Math.min(10, 10 + summary.total_loss_pct / 5))
  const healthColor = healthScore >= 7 ? '#10B981' : healthScore >= 5 ? '#F59E0B' : healthScore >= 3 ? '#F97316' : '#EF4444'
  const healthLabel = healthScore >= 7 ? 'Healthy' : healthScore >= 5 ? 'At Risk' : healthScore >= 3 ? 'Vulnerable' : 'Critical'

  const onTrack  = summary.total_loss_pct > -15
  const atRisk   = summary.total_loss_pct <= -15 && summary.total_loss_pct > -30
  const GoalIcon = onTrack ? CheckCircle : atRisk ? AlertTriangle : XCircle
  const goalColor = onTrack ? 'text-green-400' : atRisk ? 'text-yellow-400' : 'text-red-400'
  const goalLabel = onTrack ? 'On Track' : atRisk ? 'At Risk' : 'Off Track'
  const goalText  = onTrack
    ? 'Based on this scenario, your retirement goals remain on track. No immediate action is required.'
    : atRisk
    ? 'This scenario may push your retirement timeline back by 1–2 years. Some adjustments would help.'
    : 'This scenario has a significant impact on your long-term goals. We should discuss rebalancing.'

  let rv = 0
  let val = summary.stressed_value
  while (val < summary.total_value && rv < 30) { val = val * 1.07 + 24000; rv++ }
  const recoveryYear = new Date().getFullYear() + rv

  const sortedLosers = [...positions].sort((a, b) => a.loss_pct - b.loss_pct)
  const worstPosition = sortedLosers[0]
  const avgBeta = positions.length
    ? positions.reduce((s, p) => s + (p.beta || 1), 0) / positions.length : 1

  const recommendation = summary.total_loss_pct < -20
    ? `Reduce equity beta by trimming ${worstPosition?.ticker} and adding short-duration bonds or gold.`
    : summary.total_loss_pct < -10
    ? `Consider trimming your largest losers and increasing cash or defensive positions by 5–10%.`
    : `Portfolio shows good resilience. Maintain diversification and monitor closely.`

  const TOTAL_SLIDES = 7

  const prev = useCallback(() => setSlide(s => Math.max(0, s - 1)), [])
  const next = useCallback(() => setSlide(s => Math.min(TOTAL_SLIDES - 1, s + 1)), [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape')       { onClose(); return }
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next() }
      if (e.key === 'ArrowLeft')    { e.preventDefault(); prev() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [next, prev, onClose])

  const slides = [
    // 0 — Cover
    <div key='cover' className='flex flex-col items-center justify-center h-full text-center px-12'>
      <div className='w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-8'>
        <BarChart3 size={32} className='text-blue-400' />
      </div>
      <p className='text-sm font-semibold text-blue-400 uppercase tracking-widest mb-4'>
        Portfolio Stress Test
      </p>
      <h1 className='text-5xl md:text-6xl font-black text-white mb-6 leading-tight'>
        Your Portfolio
      </h1>
      <div className='bg-white/5 border border-white/10 rounded-2xl px-8 py-4 max-w-xl mx-auto'>
        <p className='text-gray-300 text-lg leading-relaxed'>
          {summary.scenario_text.split(',').slice(0, 2).join(',')}
        </p>
      </div>
      <p className='text-gray-600 text-sm mt-6'>
        {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
    </div>,

    // 1 — The big number
    <div key='loss' className='flex flex-col items-center justify-center h-full text-center px-12'>
      <p className='text-sm font-semibold text-gray-500 uppercase tracking-widest mb-6'>
        Under this scenario
      </p>
      <div className='text-8xl md:text-9xl font-black mb-4' style={{
        color: summary.total_loss_pct < -25 ? '#EF4444' : summary.total_loss_pct < -10 ? '#F97316' : '#F59E0B'
      }}>
        {summary.total_loss_pct.toFixed(1)}%
      </div>
      <p className='text-2xl text-gray-300 mb-8 font-light'>
        potential portfolio decline
      </p>
      <div className='grid grid-cols-2 gap-6 max-w-lg w-full'>
        <div className='bg-white/5 border border-white/10 rounded-2xl p-6 text-left'>
          <p className='text-xs text-gray-500 uppercase tracking-wider mb-2'>Portfolio today</p>
          <p className='text-3xl font-bold text-white'>{fmt(summary.total_value)}</p>
        </div>
        <div className='bg-red-950/40 border border-red-900/60 rounded-2xl p-6 text-left'>
          <p className='text-xs text-gray-500 uppercase tracking-wider mb-2'>Under stress</p>
          <p className='text-3xl font-bold text-red-400'>{fmt(summary.stressed_value)}</p>
        </div>
      </div>
      <p className='mt-6 text-gray-500 text-sm'>
        That's <span className='text-red-400 font-semibold'>{fmt(Math.abs(summary.total_loss))}</span> in potential losses
      </p>
    </div>,

    // 2 — Health score
    <div key='health' className='flex flex-col items-center justify-center h-full text-center px-12'>
      <p className='text-sm font-semibold text-gray-500 uppercase tracking-widest mb-8'>
        Portfolio health
      </p>
      <div className='relative w-48 h-48 mb-8'>
        <svg viewBox='0 0 120 120' className='w-full h-full -rotate-90'>
          <circle cx='60' cy='60' r='50' fill='none' stroke='rgba(255,255,255,0.06)' strokeWidth='10' />
          <circle cx='60' cy='60' r='50' fill='none'
            stroke={healthColor} strokeWidth='10'
            strokeDasharray={`${healthScore * 10 * 3.14} 314`}
            strokeLinecap='round' />
        </svg>
        <div className='absolute inset-0 flex flex-col items-center justify-center'>
          <span className='text-4xl font-black text-white'>{healthScore.toFixed(1)}</span>
          <span className='text-gray-400 text-sm'>/10</span>
        </div>
      </div>
      <p className='text-4xl font-bold mb-4' style={{ color: healthColor }}>{healthLabel}</p>
      <p className='text-xl text-gray-300 max-w-md leading-relaxed'>
        {healthScore >= 7
          ? 'Your portfolio is holding up well under this scenario.'
          : healthScore >= 5
          ? 'Your portfolio faces some pressure — manageable with adjustments.'
          : healthScore >= 3
          ? 'This scenario puts meaningful strain on your portfolio.'
          : 'This scenario has a significant impact on your portfolio.'}
      </p>
    </div>,

    // 3 — Top 3 risks
    <div key='risks' className='flex flex-col justify-center h-full px-12 max-w-3xl mx-auto w-full'>
      <p className='text-sm font-semibold text-gray-500 uppercase tracking-widest mb-8 text-center'>
        3 key risks identified
      </p>
      <div className='space-y-4'>
        {[
          {
            icon: TrendingDown,
            color: 'text-red-400',
            bg: 'bg-red-950/40 border-red-900/60',
            title: `${worstPosition?.ticker} is your biggest drag`,
            detail: `${worstPosition?.ticker} would lose ${worstPosition?.loss_pct.toFixed(1)}% under this scenario — the single largest contributor to portfolio losses.`,
          },
          {
            icon: BarChart3,
            color: 'text-orange-400',
            bg: 'bg-orange-950/40 border-orange-900/60',
            title: avgBeta > 1.2 ? 'High market sensitivity amplifies losses' : 'Correlated assets move together under stress',
            detail: avgBeta > 1.2
              ? `Your portfolio has an average beta of ${avgBeta.toFixed(2)} — meaning losses are amplified when markets decline sharply.`
              : 'During a crisis, assets that normally move independently tend to fall together, reducing the benefit of diversification.',
          },
          {
            icon: Activity,
            color: 'text-yellow-400',
            bg: 'bg-yellow-950/40 border-yellow-900/60',
            title: positions.filter(p => p.loss_pct < -15).length > 0 ? `${positions.filter(p => p.loss_pct < -15).length} position${positions.filter(p => p.loss_pct < -15).length !== 1 ? 's' : ''} at elevated risk` : 'Portfolio is relatively resilient',
            detail: positions.filter(p => p.loss_pct < -15).length > 0
              ? `${positions.filter(p => p.loss_pct < -15).map(p => p.ticker).join(', ')} ${positions.filter(p => p.loss_pct < -15).length === 1 ? 'is' : 'are'} each down more than 15% under stress — worth reviewing allocation.`
              : 'Most positions show manageable losses. The portfolio benefits from diversification across sectors.',
          },
        ].map(({ icon: Icon, color, bg, title, detail }, i) => (
          <div key={i} className={`rounded-2xl border p-5 flex items-start gap-4 ${bg}`}>
            <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0`}>
              <Icon size={20} className={color} />
            </div>
            <div>
              <p className='font-semibold text-white text-lg mb-1'>{title}</p>
              <p className='text-gray-300 leading-relaxed'>{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>,

    // 4 — Recovery timeline
    <div key='recovery' className='flex flex-col items-center justify-center h-full text-center px-12'>
      <p className='text-sm font-semibold text-gray-500 uppercase tracking-widest mb-6'>
        Recovery timeline
      </p>
      {rv >= 30 ? (
        <>
          <p className='text-7xl font-black text-orange-400 mb-4'>30+ years</p>
          <p className='text-xl text-gray-300 max-w-lg leading-relaxed'>
            At current contribution rates and historical average returns, full recovery
            would take more than 30 years. We should discuss adjustments.
          </p>
        </>
      ) : (
        <>
          <div className='flex items-baseline gap-4 mb-4'>
            <span className='text-8xl font-black text-blue-400'>{rv}</span>
            <span className='text-3xl text-gray-400 font-semibold'>
              {rv === 1 ? 'year' : 'years'}
            </span>
          </div>
          <p className='text-2xl text-white font-semibold mb-4'>
            Recovery by <span className='text-blue-400'>{recoveryYear}</span>
          </p>
          <p className='text-lg text-gray-300 max-w-lg leading-relaxed'>
            Continuing regular contributions at historical average returns,
            your portfolio would recover to current levels by {recoveryYear}.
          </p>
        </>
      )}
      <div className='mt-8 bg-white/5 border border-white/10 rounded-2xl px-6 py-3'>
        <p className='text-sm text-gray-500'>
          Assumes 7% avg annual return + $2,000/month contributions
        </p>
      </div>
    </div>,

    // 5 — Goal impact
    <div key='goals' className='flex flex-col items-center justify-center h-full text-center px-12'>
      <p className='text-sm font-semibold text-gray-500 uppercase tracking-widest mb-8'>
        Impact on your goals
      </p>
      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 ${
        onTrack ? 'bg-green-950/50' : atRisk ? 'bg-yellow-950/50' : 'bg-red-950/50'
      }`}>
        <GoalIcon size={40} className={goalColor} />
      </div>
      <p className={`text-5xl font-black mb-6 ${goalColor}`}>{goalLabel}</p>
      <p className='text-xl text-gray-300 max-w-lg leading-relaxed mb-8'>{goalText}</p>
      {profile.retirementAge > 0 && (
        <div className='bg-white/5 border border-white/10 rounded-2xl px-8 py-4'>
          <p className='text-sm text-gray-400'>
            Target retirement at age <span className='text-white font-semibold'>{profile.retirementAge}</span>
            {profile.annualWithdrawal > 0 && (
              <> · Annual withdrawal goal of <span className='text-white font-semibold'>{fmt(profile.annualWithdrawal)}</span></>
            )}
          </p>
        </div>
      )}
    </div>,

    // 6 — Recommendation / Next steps
    <div key='action' className='flex flex-col justify-center h-full px-12 max-w-3xl mx-auto w-full'>
      <p className='text-sm font-semibold text-gray-500 uppercase tracking-widest mb-8 text-center'>
        Our recommendation
      </p>
      <div className='bg-blue-950/40 border border-blue-800/60 rounded-2xl p-7 mb-6'>
        <div className='flex items-start gap-4'>
          <div className='w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center shrink-0'>
            <Lightbulb size={20} className='text-blue-400' />
          </div>
          <div>
            <p className='text-blue-300 font-semibold text-lg mb-2'>Key action</p>
            <p className='text-blue-100/90 text-lg leading-relaxed'>{recommendation}</p>
          </div>
        </div>
      </div>
      {explanation?.client_explanation && (
        <div className='bg-white/3 border border-white/8 rounded-2xl p-6 mb-6'>
          <div className='flex items-center gap-3 mb-3'>
            <Brain size={18} className='text-blue-400' />
            <p className='text-white font-semibold'>What this means for you</p>
          </div>
          <p className='text-gray-300 leading-relaxed line-clamp-4'>
            {explanation.client_explanation}
          </p>
        </div>
      )}
      <div className='grid grid-cols-2 gap-4'>
        <div className='bg-white/3 border border-white/8 rounded-xl p-4 flex items-center gap-3'>
          <Target size={18} className='text-green-400 shrink-0' />
          <p className='text-gray-300 text-sm'>Review asset allocation</p>
        </div>
        <div className='bg-white/3 border border-white/8 rounded-xl p-4 flex items-center gap-3'>
          <Activity size={18} className='text-blue-400 shrink-0' />
          <p className='text-gray-300 text-sm'>Consider rebalancing options</p>
        </div>
      </div>
    </div>,
  ]

  return (
    <div className='fixed inset-0 z-50 bg-[#060B18] flex flex-col'>
      {/* Top bar */}
      <div className='flex items-center justify-between px-8 py-4 border-b border-white/8 shrink-0'>
        <div className='flex items-center gap-3'>
          <div className='w-2 h-2 rounded-full bg-blue-400 animate-pulse' />
          <span className='text-sm font-semibold text-gray-300'>Client Presentation</span>
        </div>
        <div className='flex items-center gap-6'>
          <span className='text-xs text-gray-600'>
            {slide + 1} / {TOTAL_SLIDES}
          </span>
          <button onClick={onClose}
            className='w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center
              justify-center transition-colors'>
            <X size={16} className='text-gray-400' />
          </button>
        </div>
      </div>

      {/* Slide progress bar */}
      <div className='h-0.5 bg-white/5 shrink-0'>
        <div className='h-full bg-blue-500 transition-all duration-300'
          style={{ width: `${((slide + 1) / TOTAL_SLIDES) * 100}%` }} />
      </div>

      {/* Slide content */}
      <div className='flex-1 overflow-hidden relative'>
        {slides[slide]}
      </div>

      {/* Bottom nav */}
      <div className='flex items-center justify-between px-8 py-5 border-t border-white/8 shrink-0'>
        <button
          onClick={prev}
          disabled={slide === 0}
          className='flex items-center gap-2 px-5 py-2.5 rounded-xl
            bg-white/5 hover:bg-white/8 border border-white/10
            text-sm text-gray-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed'>
          <ChevronLeft size={16} />
          Previous
        </button>

        {/* Dot indicators */}
        <div className='flex items-center gap-2'>
          {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              className={`rounded-full transition-all ${
                i === slide ? 'w-4 h-2 bg-blue-400' : 'w-2 h-2 bg-white/20 hover:bg-white/40'
              }`} />
          ))}
        </div>

        {slide < TOTAL_SLIDES - 1 ? (
          <button
            onClick={next}
            className='flex items-center gap-2 px-5 py-2.5 rounded-xl
              bg-blue-600 hover:bg-blue-500 border border-blue-500
              text-sm text-white font-semibold transition-all'>
            Next
            <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={onClose}
            className='flex items-center gap-2 px-5 py-2.5 rounded-xl
              bg-white/5 hover:bg-white/10 border border-white/10
              text-sm text-gray-300 transition-all'>
            Close
            <X size={14} />
          </button>
        )}
      </div>

      <p className='text-center text-xs text-gray-700 pb-3 shrink-0'>
        Use ← → arrow keys to navigate · ESC to exit
      </p>
    </div>
  )
}
