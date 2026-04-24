'use client'

import { useState, useMemo } from 'react'
import { User, Target, TrendingDown, Calendar } from 'lucide-react'

interface ClientProfile {
  age: number
  retirementAge: number
  annualWithdrawal: number
  monthlyContribution: number
  riskTolerance: 'conservative' | 'moderate' | 'aggressive'
}

const DEFAULT_PROFILE: ClientProfile = {
  age: 45,
  retirementAge: 65,
  annualWithdrawal: 60000,
  monthlyContribution: 2000,
  riskTolerance: 'moderate',
}

function computeImpact(
  portfolioValue: number,
  stressedValue: number,
  profile: ClientProfile
) {
  const lossAmount    = portfolioValue - stressedValue
  const lossPct       = lossAmount / portfolioValue
  const yearsToRetire = Math.max(0, profile.retirementAge - profile.age)
  const annualReturn  = profile.riskTolerance === 'conservative' ? 0.05
    : profile.riskTolerance === 'moderate' ? 0.07 : 0.09
  const safeWithdrawalRate = 0.04

  const annualContrib = profile.monthlyContribution * 12
  const projectPortfolio = (startVal: number) => {
    let val = startVal
    for (let i = 0; i < yearsToRetire; i++) {
      val = val * (1 + annualReturn) + annualContrib
    }
    return val
  }

  const projectedNormal   = projectPortfolio(portfolioValue)
  const projectedStressed = projectPortfolio(stressedValue)

  const sustainableNormal   = projectedNormal   * safeWithdrawalRate
  const sustainableStressed = projectedStressed * safeWithdrawalRate

  const yearsNormal   = projectedNormal   / profile.annualWithdrawal
  const yearsStressed = projectedStressed / profile.annualWithdrawal

  const goalMet       = profile.annualWithdrawal <= sustainableNormal
  const goalMetStress = profile.annualWithdrawal <= sustainableStressed

  const probNormal = goalMet
    ? Math.min(92, 60 + (sustainableNormal / profile.annualWithdrawal - 1) * 40)
    : Math.max(20, 45 - (1 - sustainableNormal / profile.annualWithdrawal) * 30)

  const stressPenalty = lossPct * 80
  const probStressed  = Math.max(15, probNormal - stressPenalty)

  let retirementDelay = 0
  if (stressedValue < portfolioValue) {
    let val = stressedValue
    let years = 0
    while (val < portfolioValue && years < 20) {
      val = val * (1 + annualReturn) + annualContrib
      years++
    }
    retirementDelay = years
  }

  return {
    projectedNormal:     Math.round(projectedNormal),
    projectedStressed:   Math.round(projectedStressed),
    sustainableNormal:   Math.round(sustainableNormal),
    sustainableStressed: Math.round(sustainableStressed),
    yearsNormal:         Math.round(yearsNormal),
    yearsStressed:       Math.round(yearsStressed),
    probNormal:          Math.round(probNormal),
    probStressed:        Math.round(probStressed),
    retirementDelay,
    lossAmount:          Math.round(lossAmount),
    lossPct:             Math.round(lossPct * 100),
    yearsToRetire,
  }
}

function Gauge({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className='relative w-24 h-24 mx-auto'>
      <svg viewBox='0 0 36 36' className='w-full h-full -rotate-90'>
        <circle cx='18' cy='18' r='15.9' fill='none'
          stroke='rgba(255,255,255,0.1)' strokeWidth='3' />
        <circle cx='18' cy='18' r='15.9' fill='none'
          stroke={color} strokeWidth='3'
          strokeDasharray={`${pct} 100`}
          strokeLinecap='round' />
      </svg>
      <div className='absolute inset-0 flex items-center justify-center'>
        <span className='text-lg font-bold text-white'>{value}%</span>
      </div>
    </div>
  )
}

function InputField({ label, value, onChange, min, max, step = 1, prefix, suffix }: any) {
  return (
    <div>
      <label className='block text-xs text-gray-400 mb-1'>{label}</label>
      <div className='flex items-center bg-white/5 border border-white/10
        rounded-lg overflow-hidden'>
        {prefix && (
          <span className='px-3 py-2 text-gray-400 text-sm border-r border-white/10'>
            {prefix}
          </span>
        )}
        <input
          type='number'
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className='flex-1 bg-transparent px-3 py-2 text-white text-sm
            focus:outline-none w-full'
        />
        {suffix && (
          <span className='px-3 py-2 text-gray-400 text-sm border-l border-white/10'>
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

export default function ClientImpact({
  portfolioValue,
  stressedValue,
}: {
  portfolioValue: number
  stressedValue: number
}) {
  const [profile, setProfile] = useState<ClientProfile>(DEFAULT_PROFILE)
  const [expanded, setExpanded] = useState(true)

  const set = (key: keyof ClientProfile) => (val: any) =>
    setProfile(prev => ({ ...prev, [key]: val }))

  const impact = useMemo(
    () => computeImpact(portfolioValue, stressedValue, profile),
    [portfolioValue, stressedValue, profile]
  )

  const fmt = (n: number) => new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0
  }).format(n)

  const probColor = (p: number) =>
    p >= 75 ? '#10B981' : p >= 55 ? '#F59E0B' : '#EF4444'

  return (
    <div className='space-y-4'>

      <div className='bg-white/3 rounded-2xl border border-white/8 overflow-hidden'>
        <button
          onClick={() => setExpanded(e => !e)}
          className='w-full flex items-center justify-between p-5
            hover:bg-white/5 transition-colors'>
          <div className='flex items-center gap-2'>
            <User size={16} className='text-blue-400' />
            <span className='font-semibold text-gray-200'>Client Profile</span>
            <span className='text-xs text-gray-500'>— adjust to personalize impact</span>
          </div>
          <span className='text-gray-400 text-xs'>{expanded ? '▲ Hide' : '▼ Edit'}</span>
        </button>

        {expanded && (
          <div className='px-5 pb-5 border-t border-white/8'>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mt-4'>
              <InputField label='Current Age' value={profile.age}
                onChange={set('age')} min={20} max={80} suffix='yrs' />
              <InputField label='Target Retirement Age' value={profile.retirementAge}
                onChange={set('retirementAge')} min={50} max={85} suffix='yrs' />
              <InputField label='Annual Withdrawal Need' value={profile.annualWithdrawal}
                onChange={set('annualWithdrawal')} min={10000} max={500000}
                step={5000} prefix='$' />
              <InputField label='Monthly Contribution' value={profile.monthlyContribution}
                onChange={set('monthlyContribution')} min={0} max={50000}
                step={500} prefix='$' />
              <div>
                <label className='block text-xs text-gray-400 mb-1'>Risk Tolerance</label>
                <select
                  value={profile.riskTolerance}
                  onChange={e => set('riskTolerance')(e.target.value)}
                  className='w-full bg-white/5 border border-white/10 rounded-lg
                    px-3 py-2 text-white text-sm focus:outline-none'>
                  <option value='conservative'>Conservative (5% return)</option>
                  <option value='moderate'>Moderate (7% return)</option>
                  <option value='aggressive'>Aggressive (9% return)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

        <div className='bg-white/3 rounded-2xl p-5 border border-white/8'>
          <div className='flex items-center gap-2 mb-4'>
            <Target size={16} className='text-blue-400' />
            <h3 className='font-semibold text-gray-200'>Goal Achievement Probability</h3>
          </div>
          <div className='grid grid-cols-2 gap-6'>
            <div className='text-center'>
              <Gauge value={impact.probNormal}
                color={probColor(impact.probNormal)} />
              <p className='text-xs text-gray-400 mt-2'>Before stress</p>
              <p className='text-sm font-medium text-gray-200 mt-1'>
                {impact.probNormal >= 75 ? 'On track'
                  : impact.probNormal >= 55 ? 'At risk' : 'Off track'}
              </p>
            </div>
            <div className='text-center'>
              <Gauge value={impact.probStressed}
                color={probColor(impact.probStressed)} />
              <p className='text-xs text-gray-400 mt-2'>After stress</p>
              <p className='text-sm font-medium text-gray-200 mt-1'>
                {impact.probStressed >= 75 ? 'On track'
                  : impact.probStressed >= 55 ? 'At risk' : 'Off track'}
              </p>
            </div>
          </div>
          <div className='mt-4 bg-white/5 rounded-xl p-3 text-center'>
            <p className='text-xs text-gray-400'>Probability drop</p>
            <p className='text-xl font-bold text-red-400 mt-1'>
              -{impact.probNormal - impact.probStressed}%
            </p>
          </div>
        </div>

        <div className='bg-white/3 rounded-2xl p-5 border border-white/8'>
          <div className='flex items-center gap-2 mb-4'>
            <Calendar size={16} className='text-blue-400' />
            <h3 className='font-semibold text-gray-200'>Retirement Projection</h3>
          </div>
          <div className='space-y-3'>
            {[
              {
                label: 'Portfolio at retirement (normal)',
                value: fmt(impact.projectedNormal),
                color: 'text-green-400',
              },
              {
                label: 'Portfolio at retirement (stressed)',
                value: fmt(impact.projectedStressed),
                color: 'text-red-400',
              },
              {
                label: 'Sustainable annual income (normal)',
                value: fmt(impact.sustainableNormal),
                color: 'text-green-400',
              },
              {
                label: 'Sustainable annual income (stressed)',
                value: fmt(impact.sustainableStressed),
                color: 'text-red-400',
              },
            ].map(({ label, value, color }) => (
              <div key={label} className='flex justify-between items-center
                bg-white/5 rounded-lg px-3 py-2'>
                <span className='text-xs text-gray-400'>{label}</span>
                <span className={`text-sm font-bold ${color}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='bg-white/3 rounded-2xl p-5 border border-white/8 text-center'>
          <TrendingDown size={20} className='text-red-400 mx-auto mb-2' />
          <p className='text-xs text-gray-400 mb-1'>Withdrawal years lost</p>
          <p className='text-3xl font-bold text-red-400'>
            -{Math.max(0, impact.yearsNormal - impact.yearsStressed)}
          </p>
          <p className='text-xs text-gray-500 mt-1'>
            {impact.yearsStressed} yrs remaining vs {impact.yearsNormal} yrs
          </p>
        </div>

        <div className='bg-white/3 rounded-2xl p-5 border border-white/8 text-center'>
          <Calendar size={20} className='text-orange-400 mx-auto mb-2' />
          <p className='text-xs text-gray-400 mb-1'>Estimated recovery time</p>
          <p className='text-3xl font-bold text-orange-400'>
            {impact.retirementDelay === 0 ? '<1' : impact.retirementDelay}
          </p>
          <p className='text-xs text-gray-500 mt-1'>
            years to recover losses at {profile.riskTolerance} returns
          </p>
        </div>

        <div className='bg-white/3 rounded-2xl p-5 border border-white/8 text-center'>
          <Target size={20} className='text-yellow-400 mx-auto mb-2' />
          <p className='text-xs text-gray-400 mb-1'>Income shortfall (stressed)</p>
          <p className='text-3xl font-bold text-yellow-400'>
            {fmt(Math.max(0, profile.annualWithdrawal - impact.sustainableStressed))}
          </p>
          <p className='text-xs text-gray-500 mt-1'>annual gap vs withdrawal goal</p>
        </div>
      </div>

      <div className='bg-blue-950/40 border border-blue-800 rounded-xl p-4'>
        <p className='text-blue-300 font-medium text-sm mb-2'>Client impact summary</p>
        <p className='text-blue-200/80 text-sm leading-relaxed'>
          Based on your profile (age {profile.age}, retiring at {profile.retirementAge},
          targeting {fmt(profile.annualWithdrawal)}/year), this stress scenario reduces
          your projected retirement portfolio from{' '}
          <strong>{fmt(impact.projectedNormal)}</strong> to{' '}
          <strong>{fmt(impact.projectedStressed)}</strong>.
          {impact.retirementDelay > 0 && (
            <> Recovery to pre-stress levels would take approximately{' '}
            <strong>{impact.retirementDelay} years</strong> at current
            contribution rates.</>
          )}
          {' '}Sustainable annual income drops from{' '}
          <strong>{fmt(impact.sustainableNormal)}</strong> to{' '}
          <strong>{fmt(impact.sustainableStressed)}</strong>,
          {impact.sustainableStressed < profile.annualWithdrawal
            ? ` creating a ${fmt(profile.annualWithdrawal - impact.sustainableStressed)} annual shortfall against your withdrawal goal.`
            : ' which still covers your withdrawal goal.'
          }
        </p>
      </div>

    </div>
  )
}