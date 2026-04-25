'use client'

import { useState, useMemo } from 'react'
import {
  User, Target, TrendingDown, Calendar, Clock, ArrowRight,
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts'

export interface ClientProfile {
  age: number
  retirementAge: number
  annualWithdrawal: number
  monthlyContribution: number
  riskTolerance: 'conservative' | 'moderate' | 'aggressive'
  inflationRate: number
  taxBracket: 0.22 | 0.24 | 0.32 | 0.37
  taxablePct: number
  traditionalPct: number
  rothPct: number
}

export const DEFAULT_PROFILE: ClientProfile = {
  age: 45,
  retirementAge: 65,
  annualWithdrawal: 60000,
  monthlyContribution: 2000,
  riskTolerance: 'moderate',
  inflationRate: 0.03,
  taxBracket: 0.24,
  taxablePct: 60,
  traditionalPct: 30,
  rothPct: 10,
}

function gaussianRandom(mean: number, std: number): number {
  const u1 = Math.random()
  const u2 = Math.random()
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
  return mean + std * z0
}

function fmtShort(n: number): string {
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `$${(n / 1_000).toFixed(0)}k`
  return `$${n}`
}

function computeImpact(
  portfolioValue: number,
  stressedValue: number,
  profile: ClientProfile,
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

  // Monte Carlo ruin probability — 500 paths × 40-year retirement
  const PATHS = 500
  let normalSurvived = 0
  let stressedSurvived = 0
  for (let p = 0; p < PATHS; p++) {
    let nPort = projectedNormal
    let sPort = projectedStressed
    let nRuined = false
    let sRuined = false
    for (let yr = 0; yr < 40; yr++) {
      const shock      = gaussianRandom(0, 0.12)
      const withdrawal = profile.annualWithdrawal * Math.pow(1 + profile.inflationRate, yr)
      if (!nRuined) {
        nPort = nPort * (1 + annualReturn + shock) - withdrawal
        if (nPort <= 0) nRuined = true
      }
      if (!sRuined) {
        sPort = sPort * (1 + annualReturn + shock) - withdrawal
        if (sPort <= 0) sRuined = true
      }
    }
    if (!nRuined) normalSurvived++
    if (!sRuined) stressedSurvived++
  }
  const probNormal   = Math.round((normalSurvived / PATHS) * 100)
  const probStressed = Math.round((stressedSurvived / PATHS) * 100)

  // Recovery time: stressed portfolio back to original portfolioValue
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

  // Realistic retirement age under stress
  let realisticRetirementAge = 80
  for (let candidateAge = profile.retirementAge; candidateAge <= 80; candidateAge++) {
    const yrs = Math.max(0, candidateAge - profile.age)
    let val = stressedValue
    for (let i = 0; i < yrs; i++) {
      val = val * (1 + annualReturn) + annualContrib
    }
    if (val * safeWithdrawalRate >= profile.annualWithdrawal) {
      realisticRetirementAge = candidateAge
      break
    }
  }

  return {
    projectedNormal:       Math.round(projectedNormal),
    projectedStressed:     Math.round(projectedStressed),
    sustainableNormal:     Math.round(sustainableNormal),
    sustainableStressed:   Math.round(sustainableStressed),
    yearsNormal:           Math.round(yearsNormal),
    yearsStressed:         Math.round(yearsStressed),
    probNormal,
    probStressed,
    retirementDelay,
    lossAmount:            Math.round(lossAmount),
    lossPct:               Math.round(lossPct * 100),
    yearsToRetire,
    realisticRetirementAge,
    annualReturn,
    annualContrib,
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

function InputField({ label, value, onChange, min, max, step = 1, prefix, suffix }: {
  label: string; value: number; onChange: (v: number) => void;
  min?: number; max?: number; step?: number; prefix?: string; suffix?: string;
}) {
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
  profile,
  setProfile,
}: {
  portfolioValue: number
  stressedValue: number
  profile: ClientProfile
  setProfile: (p: ClientProfile) => void
}) {
  const [expanded, setExpanded] = useState(true)

  const set = (key: keyof ClientProfile) => (val: number | string) =>
    setProfile({ ...profile, [key]: val })

  const handleTaxableChange = (val: number) => {
    const taxable = Math.min(100, Math.max(0, val))
    const remaining = 100 - taxable
    const otherTotal = profile.traditionalPct + profile.rothPct
    if (otherTotal === 0) {
      const half = Math.round(remaining / 2)
      setProfile({ ...profile, taxablePct: taxable, traditionalPct: half, rothPct: remaining - half })
    } else {
      const newTrad = Math.round(profile.traditionalPct / otherTotal * remaining)
      setProfile({ ...profile, taxablePct: taxable, traditionalPct: newTrad, rothPct: remaining - newTrad })
    }
  }

  const handleTraditionalChange = (val: number) => {
    const trad = Math.min(100 - profile.taxablePct, Math.max(0, val))
    setProfile({ ...profile, traditionalPct: trad, rothPct: 100 - profile.taxablePct - trad })
  }

  const handleRothChange = (val: number) => {
    const roth = Math.min(100 - profile.taxablePct, Math.max(0, val))
    setProfile({ ...profile, rothPct: roth, traditionalPct: 100 - profile.taxablePct - roth })
  }

  const impact = useMemo(
    () => computeImpact(portfolioValue, stressedValue, profile),
    [portfolioValue, stressedValue, profile],
  )

  const currentYear = useMemo(() => new Date().getFullYear(), [])

  // 20-year recovery path from current stressed value
  const recoveryPathData = useMemo(() => {
    const data: { yr: number; calYear: number; withContrib: number; noContrib: number }[] = []
    let withC = stressedValue
    let noC   = stressedValue
    for (let yr = 0; yr <= 20; yr++) {
      data.push({
        yr,
        calYear: currentYear + yr,
        withContrib: Math.round(withC),
        noContrib:   Math.round(noC),
      })
      withC = withC * (1 + impact.annualReturn) + impact.annualContrib
      noC   = noC   * (1 + impact.annualReturn)
    }
    return data
  }, [stressedValue, currentYear, impact.annualReturn, impact.annualContrib])

  const breakEvenYr      = recoveryPathData.find(d => d.withContrib >= portfolioValue)?.yr ?? null
  const noContribRecovers = recoveryPathData.some(d => d.noContrib >= portfolioValue)

  // 40-year retirement depletion simulation
  const depletionResult = useMemo(() => {
    const retirementCalYear = currentYear + impact.yearsToRetire
    const data: { yr: number; calYear: number; normal: number | null; stressed: number | null }[] = []
    let nPort   = impact.projectedNormal
    let sPort   = impact.projectedStressed
    let nRuined = false
    let sRuined = false
    let nRuinYr: number | null = null
    let sRuinYr: number | null = null

    for (let yr = 0; yr <= 40; yr++) {
      data.push({
        yr,
        calYear:  retirementCalYear + yr,
        normal:   nRuined ? null : Math.max(0, Math.round(nPort)),
        stressed: sRuined ? null : Math.max(0, Math.round(sPort)),
      })
      const withdrawal = profile.annualWithdrawal * Math.pow(1 + profile.inflationRate, yr)
      if (!nRuined) {
        nPort = nPort * (1 + impact.annualReturn) - withdrawal
        if (nPort <= 0) { nRuinYr = yr + 1; nRuined = true }
      }
      if (!sRuined) {
        sPort = sPort * (1 + impact.annualReturn) - withdrawal
        if (sPort <= 0) { sRuinYr = yr + 1; sRuined = true }
      }
    }
    return { data, nRuinYr, sRuinYr, retirementCalYear }
  }, [
    impact.projectedNormal, impact.projectedStressed, impact.annualReturn,
    impact.yearsToRetire, profile.annualWithdrawal, profile.inflationRate, currentYear,
  ])

  const fmt = (n: number) => new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0,
  }).format(n)

  const probColor = (p: number) =>
    p >= 75 ? '#10B981' : p >= 55 ? '#F59E0B' : '#EF4444'

  const inflationAdjustedWithdrawal = Math.round(
    profile.annualWithdrawal * Math.pow(1 + profile.inflationRate, impact.yearsToRetire),
  )

  const chartTooltipStyle = {
    contentStyle: {
      background: '#0f172a',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: '8px',
      padding: '8px 12px',
    },
    labelStyle: { color: '#9CA3AF', fontSize: 11 },
    itemStyle:  { fontSize: 12 },
  }

  return (
    <div className='space-y-4'>

      {/* Client Profile */}
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
              <InputField
                label='Inflation Assumption'
                value={+(profile.inflationRate * 100).toFixed(1)}
                onChange={(v: number) => set('inflationRate')(v / 100)}
                min={0} max={10} step={0.5} suffix='%'
              />
              <div>
                <label className='block text-xs text-gray-400 mb-1'>Risk Tolerance</label>
                <select
                  value={profile.riskTolerance}
                  onChange={e => set('riskTolerance')(e.target.value)}
                  className='w-full bg-[#0d1528] border border-white/10 rounded-lg
                    px-3 py-2 text-white text-sm focus:outline-none'>
                  <option value='conservative' className='bg-[#0d1528] text-white'>Conservative (5% return)</option>
                  <option value='moderate' className='bg-[#0d1528] text-white'>Moderate (7% return)</option>
                  <option value='aggressive' className='bg-[#0d1528] text-white'>Aggressive (9% return)</option>
                </select>
              </div>
            </div>

            {/* Tax profile */}
            <div className='border-t border-white/8 pt-4 space-y-3'>
              <p className='text-xs text-gray-500 uppercase tracking-wider'>Tax profile</p>

              <div>
                <label className='block text-xs text-gray-400 mb-1'>Tax bracket</label>
                <select
                  value={profile.taxBracket}
                  onChange={e =>
                    setProfile({ ...profile, taxBracket: Number(e.target.value) as ClientProfile['taxBracket'] })
                  }
                  className='w-full bg-[#0d1528] border border-white/10 rounded-lg
                    px-3 py-2 text-white text-sm focus:outline-none'>
                  <option value={0.22} className='bg-[#0d1528] text-white'>22%</option>
                  <option value={0.24} className='bg-[#0d1528] text-white'>24%</option>
                  <option value={0.32} className='bg-[#0d1528] text-white'>32%</option>
                  <option value={0.37} className='bg-[#0d1528] text-white'>37%</option>
                </select>
              </div>

              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <p className='text-xs text-gray-400'>Account type mix</p>
                  <span className={`text-xs font-medium ${
                    profile.taxablePct + profile.traditionalPct + profile.rothPct === 100
                      ? 'text-green-400' : 'text-red-400'
                  }`}>
                    = {profile.taxablePct + profile.traditionalPct + profile.rothPct}%
                  </span>
                </div>

                <div>
                  <div className='flex justify-between text-xs text-gray-400 mb-1'>
                    <span>Taxable accounts</span>
                    <span className='text-white'>{profile.taxablePct}%</span>
                  </div>
                  <input type='range' min={0} max={100} value={profile.taxablePct}
                    onChange={e => handleTaxableChange(Number(e.target.value))}
                    className='w-full accent-green-500' />
                </div>

                <div>
                  <div className='flex justify-between text-xs text-gray-400 mb-1'>
                    <span>Traditional IRA / 401k</span>
                    <span className='text-white'>{profile.traditionalPct}%</span>
                  </div>
                  <input type='range' min={0} max={Math.max(0, 100 - profile.taxablePct)}
                    value={profile.traditionalPct}
                    onChange={e => handleTraditionalChange(Number(e.target.value))}
                    className='w-full accent-blue-500' />
                </div>

                <div>
                  <div className='flex justify-between text-xs text-gray-400 mb-1'>
                    <span>Roth IRA / 401k</span>
                    <span className='text-white'>{profile.rothPct}%</span>
                  </div>
                  <input type='range' min={0} max={Math.max(0, 100 - profile.taxablePct)}
                    value={profile.rothPct}
                    onChange={e => handleRothChange(Number(e.target.value))}
                    className='w-full accent-purple-500' />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2-column: gauges + projection table */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

        <div className='bg-white/3 rounded-2xl p-5 border border-white/8'>
          <div className='flex items-center gap-2 mb-4'>
            <Target size={16} className='text-blue-400' />
            <h3 className='font-semibold text-gray-200'>Goal Achievement Probability</h3>
          </div>
          <div className='grid grid-cols-2 gap-6'>
            <div className='text-center'>
              <Gauge value={impact.probNormal} color={probColor(impact.probNormal)} />
              <p className='text-xs text-gray-400 mt-2'>Before stress</p>
              <p className='text-sm font-medium text-gray-200 mt-1'>
                {impact.probNormal >= 75 ? 'On track'
                  : impact.probNormal >= 55 ? 'At risk' : 'Off track'}
              </p>
            </div>
            <div className='text-center'>
              <Gauge value={impact.probStressed} color={probColor(impact.probStressed)} />
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
              { label: 'Portfolio at retirement (normal)',   value: fmt(impact.projectedNormal),   color: 'text-green-400' },
              { label: 'Portfolio at retirement (stressed)', value: fmt(impact.projectedStressed), color: 'text-red-400'   },
              { label: 'Sustainable annual income (normal)',   value: fmt(impact.sustainableNormal),   color: 'text-green-400' },
              { label: 'Sustainable annual income (stressed)', value: fmt(impact.sustainableStressed), color: 'text-red-400'   },
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

      {/* 4-column stat grid (was 3) */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
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

        {/* 4th card: realistic retirement age */}
        <div className='bg-white/3 rounded-2xl p-5 border border-white/8 text-center'>
          <Calendar size={20} className='text-blue-400 mx-auto mb-2' />
          <p className='text-xs text-gray-400 mb-2'>Realistic retirement age</p>
          {impact.realisticRetirementAge === profile.retirementAge ? (
            <>
              <p className='text-3xl font-bold text-green-400'>
                {impact.realisticRetirementAge}
              </p>
              <p className='text-xs text-green-400 mt-1'>On track</p>
            </>
          ) : (
            <>
              <div className='flex items-center justify-center gap-1 mt-1'>
                <span className='text-lg font-bold text-gray-500 line-through'>
                  {profile.retirementAge}
                </span>
                <ArrowRight size={14} className='text-red-400' />
                <span className='text-2xl font-bold text-red-400'>
                  {impact.realisticRetirementAge}
                </span>
              </div>
              <p className='text-xs text-red-400 mt-1'>
                +{impact.realisticRetirementAge - profile.retirementAge} year
                {impact.realisticRetirementAge - profile.retirementAge !== 1 ? 's' : ''} delayed
              </p>
            </>
          )}
        </div>
      </div>

      {/* Recovery Path Chart */}
      <div className='bg-white/3 rounded-2xl p-5 border border-white/8'>
        <div className='flex items-center gap-2 mb-4'>
          <Clock size={16} className='text-blue-400' />
          <h3 className='font-semibold text-gray-200'>Recovery Path</h3>
        </div>
        <ResponsiveContainer width='100%' height={220}>
          <LineChart data={recoveryPathData} margin={{ top: 8, right: 20, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray='3 3' stroke='rgba(255,255,255,0.06)' />
            <XAxis
              dataKey='calYear'
              ticks={recoveryPathData.filter(d => d.yr % 5 === 0).map(d => d.calYear)}
              tick={{ fill: '#6B7280', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickFormatter={fmtShort}
              tick={{ fill: '#6B7280', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={58}
            />
            <Tooltip
              {...chartTooltipStyle}
              formatter={(v: any) => [fmtShort(Number(v ?? 0))]}
            />
            <ReferenceLine
              y={portfolioValue}
              stroke='rgba(255,255,255,0.25)'
              strokeDasharray='6 3'
              label={{ value: 'Pre-stress', fill: 'rgba(255,255,255,0.45)', fontSize: 10, position: 'insideTopRight' }}
            />
            {breakEvenYr !== null && (
              <ReferenceLine
                x={currentYear + breakEvenYr}
                stroke='#60A5FA'
                strokeDasharray='4 2'
                label={{
                  value: `Recovery: ${currentYear + breakEvenYr}`,
                  fill: '#60A5FA', fontSize: 10, position: 'insideTopLeft',
                }}
              />
            )}
            <Line dataKey='withContrib' name='With contributions'
              stroke='#3B82F6' strokeWidth={2} dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }} />
            <Line dataKey='noContrib' name='No contributions'
              stroke='#F97316' strokeWidth={2} strokeDasharray='6 3' dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }} />
            <Legend wrapperStyle={{ fontSize: 11, color: '#9CA3AF', paddingTop: 8 }} />
          </LineChart>
        </ResponsiveContainer>
        {!noContribRecovers && (
          <p className='text-xs text-orange-400/80 mt-2 text-right'>
            No recovery without contributions within 20 years
          </p>
        )}
      </div>

      {/* Retirement Depletion Chart */}
      <div className='bg-white/3 rounded-2xl p-5 border border-white/8'>
        <div className='flex items-center gap-2 mb-4'>
          <TrendingDown size={16} className='text-red-400' />
          <h3 className='font-semibold text-gray-200'>Retirement Depletion</h3>
        </div>
        <ResponsiveContainer width='100%' height={220}>
          <LineChart data={depletionResult.data} margin={{ top: 8, right: 20, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray='3 3' stroke='rgba(255,255,255,0.06)' />
            <XAxis
              dataKey='calYear'
              ticks={depletionResult.data.filter(d => d.yr % 10 === 0).map(d => d.calYear)}
              tick={{ fill: '#6B7280', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickFormatter={fmtShort}
              tick={{ fill: '#6B7280', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={58}
            />
            <Tooltip
              {...chartTooltipStyle}
              formatter={(v: any) => [v != null ? fmtShort(Number(v)) : '—']}
            />
            <ReferenceLine y={0} stroke='rgba(255,255,255,0.2)' />
            {depletionResult.nRuinYr !== null && (
              <ReferenceLine
                x={depletionResult.retirementCalYear + depletionResult.nRuinYr}
                stroke='#10B981'
                strokeDasharray='4 2'
                label={{
                  value: `Ruin: ${depletionResult.retirementCalYear + depletionResult.nRuinYr}`,
                  fill: '#10B981', fontSize: 10, position: 'insideTopLeft',
                }}
              />
            )}
            {depletionResult.sRuinYr !== null && (
              <ReferenceLine
                x={depletionResult.retirementCalYear + depletionResult.sRuinYr}
                stroke='#EF4444'
                strokeDasharray='4 2'
                label={{
                  value: `Ruin: ${depletionResult.retirementCalYear + depletionResult.sRuinYr}`,
                  fill: '#EF4444', fontSize: 10, position: 'insideTopRight',
                }}
              />
            )}
            <Line dataKey='normal' name='Normal'
              stroke='#10B981' strokeWidth={2} dot={false} connectNulls={false}
              activeDot={{ r: 4, strokeWidth: 0 }} />
            <Line dataKey='stressed' name='Stressed'
              stroke='#EF4444' strokeWidth={2} dot={false} connectNulls={false}
              activeDot={{ r: 4, strokeWidth: 0 }} />
            <Legend wrapperStyle={{ fontSize: 11, color: '#9CA3AF', paddingTop: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Plain-English Summary (updated) */}
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
          {' '}At {(profile.inflationRate * 100).toFixed(1)}% annual inflation, your{' '}
          {fmt(profile.annualWithdrawal)} withdrawal goal will require approximately{' '}
          <strong>{fmt(inflationAdjustedWithdrawal)}/year</strong> in nominal terms by retirement.
          {impact.realisticRetirementAge !== profile.retirementAge && (
            <> Under this stress scenario, the earliest realistic retirement age rises
            from {profile.retirementAge} to{' '}
            <strong>{impact.realisticRetirementAge}</strong>{' '}
            ({impact.realisticRetirementAge - profile.retirementAge} year
            {impact.realisticRetirementAge - profile.retirementAge !== 1 ? 's' : ''} later).</>
          )}
        </p>
      </div>

    </div>
  )
}
