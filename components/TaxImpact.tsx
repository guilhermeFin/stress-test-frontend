'use client'

import { useState, useMemo } from 'react'
import { Calculator, Scissors, DollarSign } from 'lucide-react'
import { StressTestResult } from '@/lib/api'

interface TaxProfile {
  taxBracket: 0.22 | 0.24 | 0.32 | 0.37
  taxablePercent: number
  iraPercent: number
  rothPercent: number
  holdingPeriod: 'short' | 'long' | 'mixed'
}

const DEFAULT_TAX_PROFILE: TaxProfile = {
  taxBracket: 0.24,
  taxablePercent: 60,
  iraPercent: 30,
  rothPercent: 10,
  holdingPeriod: 'mixed',
}

function getLongTermRate(bracket: number): number {
  if (bracket >= 0.32) return 0.20
  if (bracket >= 0.24) return 0.15
  return 0.0
}

function computeTax(results: StressTestResult, profile: TaxProfile, annualWithdrawal: number) {
  const { positions, summary } = results
  const taxablePortion = profile.taxablePercent / 100
  const longTermRate = getLongTermRate(profile.taxBracket)
  const shortTermRate = profile.taxBracket

  // 1. Tax-Loss Harvesting
  const harvestable = positions
    .filter(p => p.loss_pct < -5)
    .map(p => {
      const harvestableLoss = p.value - p.stressed_value
      const taxSavings = harvestableLoss * taxablePortion * profile.taxBracket
      return { ticker: p.ticker, loss_pct: p.loss_pct, harvestableLoss, taxSavings }
    })
    .sort((a, b) => b.taxSavings - a.taxSavings)
    .slice(0, 5)

  const totalHarvestableLoss = harvestable.reduce((s, p) => s + p.harvestableLoss, 0)
  const totalTaxSavings = harvestable.reduce((s, p) => s + p.taxSavings, 0)

  // 2. Capital Gains Tax on Rebalancing
  const flagged = positions.filter(
    p => p.loss_pct < -15 || (p.beta > 1.4 && p.loss_pct < -10),
  )
  let rebalancingTaxCost = 0
  let rebalancingTaxBenefit = 0
  const rebalancingDetails: { ticker: string; gain: number; taxImpact: number; isGain: boolean }[] = []

  for (const p of flagged) {
    const gain = p.stressed_value - p.value * 0.7
    if (gain > 0) {
      const effectiveRate = profile.holdingPeriod === 'short' ? shortTermRate
        : profile.holdingPeriod === 'long' ? longTermRate
        : (shortTermRate + longTermRate) / 2
      const taxCost = gain * taxablePortion * effectiveRate
      rebalancingTaxCost += taxCost
      rebalancingDetails.push({ ticker: p.ticker, gain, taxImpact: taxCost, isGain: true })
    } else {
      const taxBenefit = Math.abs(gain) * taxablePortion * profile.taxBracket
      rebalancingTaxBenefit += taxBenefit
      rebalancingDetails.push({ ticker: p.ticker, gain, taxImpact: taxBenefit, isGain: false })
    }
  }
  const netRebalancingTax = rebalancingTaxCost - rebalancingTaxBenefit

  // 3. Withdrawal Tax Impact
  const withdrawalFromTaxable = annualWithdrawal * (profile.taxablePercent / 100)
  const withdrawalFromIRA = annualWithdrawal * (profile.iraPercent / 100)
  const withdrawalFromRoth = annualWithdrawal * (profile.rothPercent / 100)
  const taxOnWithdrawal =
    withdrawalFromTaxable * profile.taxBracket * 0.15 +
    withdrawalFromIRA * profile.taxBracket
  const effectiveTaxRate = annualWithdrawal > 0 ? taxOnWithdrawal / annualWithdrawal : 0
  const netAfterTaxWithdrawal = annualWithdrawal - taxOnWithdrawal

  // suppress unused-variable warning while keeping the destructure symmetrical
  void withdrawalFromTaxable
  void withdrawalFromRoth

  // 4. After-Tax Portfolio Values
  const preTaxNormal = summary.total_value
  const preTaxStressed = summary.stressed_value
  const taxLiabilityOnCurrentGains =
    (summary.total_value - summary.total_cost_basis) * taxablePortion * longTermRate
  const afterTaxNormal = preTaxNormal - taxLiabilityOnCurrentGains
  const afterTaxStressed =
    preTaxStressed - Math.max(0, taxLiabilityOnCurrentGains - totalTaxSavings)

  return {
    harvestable,
    totalHarvestableLoss,
    totalTaxSavings,
    rebalancingDetails,
    rebalancingTaxCost,
    rebalancingTaxBenefit,
    netRebalancingTax,
    taxOnWithdrawal,
    effectiveTaxRate,
    netAfterTaxWithdrawal,
    preTaxNormal,
    preTaxStressed,
    afterTaxNormal,
    afterTaxStressed,
  }
}

export default function TaxImpact({ results }: { results: StressTestResult }) {
  const [hasConfigured, setHasConfigured] = useState(false)
  const [profile, setProfile] = useState<TaxProfile>(DEFAULT_TAX_PROFILE)
  const [profileExpanded, setProfileExpanded] = useState(true)
  const [annualWithdrawal, setAnnualWithdrawal] = useState(60000)

  const handleTaxableChange = (val: number) => {
    setProfile(prev => {
      const taxable = Math.min(100, Math.max(0, val))
      const cappedIra = Math.min(prev.iraPercent, 100 - taxable)
      return { ...prev, taxablePercent: taxable, iraPercent: cappedIra, rothPercent: 100 - taxable - cappedIra }
    })
  }

  const handleIraChange = (val: number) => {
    setProfile(prev => {
      const cappedIra = Math.min(Math.max(0, val), 100 - prev.taxablePercent)
      return { ...prev, iraPercent: cappedIra, rothPercent: 100 - prev.taxablePercent - cappedIra }
    })
  }

  const tax = useMemo(
    () => computeTax(results, profile, annualWithdrawal),
    [results, profile, annualWithdrawal],
  )

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

  const sumOk = profile.taxablePercent + profile.iraPercent + profile.rothPercent === 100
  const top2Tickers = tax.harvestable.slice(0, 2).map(p => p.ticker).join(' and ')

  const summaryText =
    `Based on your ${(profile.taxBracket * 100).toFixed(0)}% tax bracket and ` +
    `${profile.taxablePercent}% taxable account mix, you could save approximately ` +
    `${fmt(tax.totalTaxSavings)} by harvesting losses${top2Tickers ? ` in ${top2Tickers}` : ''}. ` +
    `Rebalancing would cost an estimated ${fmt(tax.rebalancingTaxCost)} in capital gains tax. ` +
    `Withdrawing ${fmt(annualWithdrawal)}/year carries an effective tax rate of ` +
    `${(tax.effectiveTaxRate * 100).toFixed(1)}% given your account mix, with Roth withdrawals ` +
    `providing ${fmt(annualWithdrawal * profile.rothPercent / 100)} in tax-free income.`

  if (!hasConfigured) {
    return (
      <div className='bg-white/3 rounded-2xl border border-white/8 p-8 text-center'>
        <div className='w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center mx-auto mb-4'>
          <Calculator size={22} className='text-green-400' />
        </div>
        <h3 className='text-lg font-semibold text-white mb-2'>Tax impact analysis</h3>
        <p className='text-sm text-gray-400 max-w-md mx-auto mb-6'>
          Add your tax details to see after-tax impact, harvesting opportunities, and rebalancing tax cost
        </p>
        <button
          onClick={() => setHasConfigured(true)}
          className='px-5 py-2.5 rounded-xl bg-green-600/20 hover:bg-green-600/30
            border border-green-700/50 text-green-300 text-sm font-medium
            transition-all duration-150 active:scale-[0.98]'>
          Configure Tax Profile
        </button>
      </div>
    )
  }

  return (
    <div className='space-y-4'>

      {/* Tax Profile Form */}
      <div className='bg-white/3 rounded-2xl border border-white/8 overflow-hidden'>
        <button
          onClick={() => setProfileExpanded(e => !e)}
          className='w-full flex items-center justify-between p-5
            hover:bg-white/5 transition-colors'>
          <div className='flex items-center gap-2'>
            <Calculator size={16} className='text-green-400' />
            <span className='font-semibold text-gray-200'>Tax Profile</span>
            <span className='text-xs text-gray-500'>— customize your tax situation</span>
          </div>
          <span className='text-gray-400 text-xs'>{profileExpanded ? '▲ Hide' : '▼ Edit'}</span>
        </button>

        {profileExpanded && (
          <div className='px-5 pb-5 border-t border-white/8 space-y-5 pt-4'>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-xs text-gray-400 mb-1'>Tax bracket</label>
                <select
                  value={profile.taxBracket}
                  onChange={e =>
                    setProfile(prev => ({ ...prev, taxBracket: Number(e.target.value) as TaxProfile['taxBracket'] }))
                  }
                  className='w-full bg-[#0d1528] border border-white/10 rounded-lg
                    px-3 py-2 text-white text-sm focus:outline-none'>
                  <option value={0.22} className='bg-[#0d1528] text-white'>22%</option>
                  <option value={0.24} className='bg-[#0d1528] text-white'>24%</option>
                  <option value={0.32} className='bg-[#0d1528] text-white'>32%</option>
                  <option value={0.37} className='bg-[#0d1528] text-white'>37%</option>
                </select>
              </div>

              <div>
                <label className='block text-xs text-gray-400 mb-1'>Holding period</label>
                <select
                  value={profile.holdingPeriod}
                  onChange={e =>
                    setProfile(prev => ({ ...prev, holdingPeriod: e.target.value as TaxProfile['holdingPeriod'] }))
                  }
                  className='w-full bg-[#0d1528] border border-white/10 rounded-lg
                    px-3 py-2 text-white text-sm focus:outline-none'>
                  <option value='short' className='bg-[#0d1528] text-white'>Short-term (&lt;1 yr)</option>
                  <option value='long' className='bg-[#0d1528] text-white'>Long-term (&gt;1 yr)</option>
                  <option value='mixed' className='bg-[#0d1528] text-white'>Mixed</option>
                </select>
              </div>
            </div>

            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <p className='text-xs text-gray-400'>Account type mix</p>
                <span className={`text-xs font-medium ${sumOk ? 'text-gray-500' : 'text-red-400'}`}>
                  ∑ {profile.taxablePercent + profile.iraPercent + profile.rothPercent}%
                  {!sumOk && ' — must equal 100%'}
                </span>
              </div>

              <div>
                <div className='flex justify-between text-xs text-gray-400 mb-1'>
                  <span>Taxable account</span>
                  <span className='text-white'>{profile.taxablePercent}%</span>
                </div>
                <input
                  type='range' min={0} max={100} value={profile.taxablePercent}
                  onChange={e => handleTaxableChange(Number(e.target.value))}
                  className='w-full accent-green-500'
                />
              </div>

              <div>
                <div className='flex justify-between text-xs text-gray-400 mb-1'>
                  <span>Traditional IRA/401k</span>
                  <span className='text-white'>{profile.iraPercent}%</span>
                </div>
                <input
                  type='range' min={0} max={Math.max(0, 100 - profile.taxablePercent)}
                  value={profile.iraPercent}
                  onChange={e => handleIraChange(Number(e.target.value))}
                  className='w-full accent-blue-500'
                />
              </div>

              <div>
                <div className='flex justify-between text-xs text-gray-400 mb-1'>
                  <span>Roth IRA/401k</span>
                  <span className='text-white'>{profile.rothPercent}%</span>
                </div>
                <div className='h-1.5 rounded-full bg-white/10 relative overflow-hidden'>
                  <div
                    className='absolute inset-y-0 left-0 bg-purple-500 rounded-full transition-all'
                    style={{ width: `${profile.rothPercent}%` }}
                  />
                </div>
                <p className='text-xs text-gray-600 mt-1'>Auto-computed: 100 − taxable − IRA</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Card 1: Tax-Loss Harvesting */}
      <div className='bg-white/3 rounded-2xl border border-white/8 p-5'>
        <div className='flex items-center justify-between mb-3'>
          <div className='flex items-center gap-2'>
            <Scissors size={16} className='text-green-400' />
            <h3 className='font-semibold text-gray-200'>Tax-loss harvesting opportunities</h3>
          </div>
          <span className='bg-green-900/50 border border-green-700/50 text-green-300
            text-xs font-semibold px-2.5 py-1 rounded-full'>
            {fmt(tax.totalTaxSavings)} potential savings
          </span>
        </div>
        <p className='text-sm text-gray-400 mb-4'>
          You could save approximately{' '}
          <strong className='text-white'>{fmt(tax.totalTaxSavings)}</strong> in taxes by
          harvesting losses in these {tax.harvestable.length} position
          {tax.harvestable.length !== 1 ? 's' : ''}.
        </p>
        {tax.harvestable.length > 0 ? (
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='text-xs text-gray-500 border-b border-white/8'>
                  <th className='text-left pb-2'>Ticker</th>
                  <th className='text-right pb-2'>Stressed Loss</th>
                  <th className='text-right pb-2'>Harvestable Amount</th>
                  <th className='text-right pb-2'>Est. Tax Savings</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-white/5'>
                {tax.harvestable.map(p => (
                  <tr key={p.ticker} className='text-gray-300'>
                    <td className='py-2 font-medium text-white'>{p.ticker}</td>
                    <td className='py-2 text-right'>
                      <span className='bg-red-900/40 text-red-300 text-xs px-2 py-0.5 rounded-full'>
                        {p.loss_pct.toFixed(1)}%
                      </span>
                    </td>
                    <td className='py-2 text-right text-red-400'>{fmt(p.harvestableLoss)}</td>
                    <td className='py-2 text-right'>
                      <span className='bg-green-900/40 text-green-300 text-xs px-2 py-0.5 rounded-full'>
                        {fmt(p.taxSavings)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className='text-sm text-gray-500 italic'>
            No positions with losses greater than 5% under this scenario.
          </p>
        )}
      </div>

      {/* Card 2: Rebalancing Tax Cost */}
      <div className='bg-white/3 rounded-2xl border border-white/8 p-5'>
        <h3 className='font-semibold text-gray-200 mb-4'>Rebalancing tax impact</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>

          <div className='bg-white/3 rounded-xl p-4 border border-white/8'>
            <p className='text-xs text-gray-500 mb-3'>Tax cost of rebalancing</p>
            {tax.rebalancingDetails.filter(d => d.isGain).length > 0 ? (
              <div className='space-y-2'>
                {tax.rebalancingDetails.filter(d => d.isGain).map(d => (
                  <div key={d.ticker} className='flex justify-between text-sm'>
                    <span className='text-gray-400'>{d.ticker}</span>
                    <span className='text-red-400'>{fmt(d.taxImpact)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-sm text-gray-500 italic'>No gain positions flagged</p>
            )}
            <div className='border-t border-white/10 mt-3 pt-3 flex justify-between'>
              <span className='text-xs text-gray-400'>Total tax cost</span>
              <span className='text-sm font-bold text-red-400'>{fmt(tax.rebalancingTaxCost)}</span>
            </div>
          </div>

          <div className='bg-white/3 rounded-xl p-4 border border-white/8'>
            <p className='text-xs text-gray-500 mb-3'>Tax benefit from loss positions</p>
            {tax.rebalancingDetails.filter(d => !d.isGain).length > 0 ? (
              <div className='space-y-2'>
                {tax.rebalancingDetails.filter(d => !d.isGain).map(d => (
                  <div key={d.ticker} className='flex justify-between text-sm'>
                    <span className='text-gray-400'>{d.ticker}</span>
                    <span className='text-green-400'>{fmt(d.taxImpact)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-sm text-gray-500 italic'>No loss positions flagged</p>
            )}
            <div className='border-t border-white/10 mt-3 pt-3 flex justify-between'>
              <span className='text-xs text-gray-400'>Total tax benefit</span>
              <span className='text-sm font-bold text-green-400'>{fmt(tax.rebalancingTaxBenefit)}</span>
            </div>
          </div>
        </div>

        <div className={`rounded-xl p-4 border flex items-center justify-between ${
          tax.netRebalancingTax <= 0
            ? 'bg-green-950/30 border-green-800'
            : 'bg-red-950/30 border-red-800'
        }`}>
          <span className='text-sm text-gray-300'>Net rebalancing tax impact</span>
          <span className={`text-lg font-bold ${
            tax.netRebalancingTax <= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {tax.netRebalancingTax <= 0 ? '-' : '+'}{fmt(Math.abs(tax.netRebalancingTax))}
          </span>
        </div>
      </div>

      {/* Card 3: Withdrawal Tax Impact */}
      <div className='bg-white/3 rounded-2xl border border-white/8 p-5'>
        <h3 className='font-semibold text-gray-200 mb-4'>Withdrawal tax impact</h3>

        <div className='mb-4'>
          <label className='block text-xs text-gray-400 mb-1'>Estimated annual withdrawal</label>
          <div className='flex items-center bg-white/5 border border-white/10
            rounded-lg overflow-hidden w-48'>
            <span className='px-3 py-2 text-gray-400 text-sm border-r border-white/10'>$</span>
            <input
              type='number'
              value={annualWithdrawal}
              onChange={e => setAnnualWithdrawal(Number(e.target.value))}
              min={0}
              step={5000}
              className='flex-1 bg-transparent px-3 py-2 text-white text-sm focus:outline-none'
            />
          </div>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mb-4'>
          {[
            { label: 'Gross Withdrawal',  value: fmt(annualWithdrawal),              color: 'text-white'      },
            { label: 'Tax Drag',          value: fmt(tax.taxOnWithdrawal),            color: 'text-red-400'    },
            { label: 'Net After-Tax',     value: fmt(tax.netAfterTaxWithdrawal),      color: 'text-green-400'  },
            { label: 'Effective Rate',    value: `${(tax.effectiveTaxRate * 100).toFixed(1)}%`, color: 'text-orange-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className='bg-white/5 rounded-xl p-4 text-center'>
              <p className='text-xs text-gray-500 mb-1'>{label}</p>
              <p className={`text-lg font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <div>
          <p className='text-xs text-gray-500 mb-2'>Withdrawal source breakdown</p>
          <div className='h-3 rounded-full overflow-hidden flex'>
            <div className='bg-green-500 transition-all' style={{ width: `${profile.taxablePercent}%` }} />
            <div className='bg-blue-500 transition-all'  style={{ width: `${profile.iraPercent}%` }} />
            <div className='bg-purple-500 transition-all' style={{ width: `${profile.rothPercent}%` }} />
          </div>
          <div className='flex gap-4 mt-2'>
            {[
              { label: 'Taxable', pct: profile.taxablePercent, color: 'bg-green-500' },
              { label: 'IRA',     pct: profile.iraPercent,     color: 'bg-blue-500'  },
              { label: 'Roth',    pct: profile.rothPercent,    color: 'bg-purple-500' },
            ].map(({ label, pct, color }) => (
              <div key={label} className='flex items-center gap-1.5 text-xs text-gray-400'>
                <div className={`w-2 h-2 rounded-full ${color}`} />
                {label} {pct}%
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card 4: After-Tax Portfolio Values */}
      <div className='bg-white/3 rounded-2xl border border-white/8 p-5'>
        <h3 className='font-semibold text-gray-200 mb-4'>After-tax portfolio values</h3>
        <div className='grid grid-cols-2 gap-4'>
          {[
            { label: 'Pre-tax current',   value: tax.preTaxNormal,    color: 'text-gray-200',   sub: 'Before scenario' },
            { label: 'After-tax current', value: tax.afterTaxNormal,  color: 'text-green-400',  sub: 'Net of unrealized tax liability' },
            { label: 'Pre-tax stressed',  value: tax.preTaxStressed,  color: 'text-red-400',    sub: 'Under stress scenario' },
            { label: 'After-tax stressed', value: tax.afterTaxStressed, color: 'text-orange-400', sub: 'With harvesting offset' },
          ].map(({ label, value, color, sub }) => (
            <div key={label} className='bg-white/5 rounded-xl p-4'>
              <p className='text-xs text-gray-500 mb-1'>{label}</p>
              <p className={`text-xl font-bold ${color}`}>{fmt(value)}</p>
              <p className='text-xs text-gray-600 mt-0.5'>{sub}</p>
            </div>
          ))}
        </div>
        <div className='mt-3 bg-white/3 rounded-xl p-3 border border-white/6
          flex items-center justify-between'>
          <span className='text-xs text-gray-400'>Harvesting closes the tax gap by</span>
          <span className='text-sm font-bold text-green-400'>{fmt(tax.totalTaxSavings)}</span>
        </div>
      </div>

      {/* Card 5: Plain-English Summary */}
      <div className='bg-blue-950/40 border border-blue-800 rounded-xl p-5'>
        <div className='flex items-center gap-2 mb-3'>
          <DollarSign size={15} className='text-blue-400 shrink-0' />
          <p className='text-blue-300 font-medium text-sm'>Tax impact summary</p>
        </div>
        <p className='text-blue-200/80 text-sm leading-relaxed'>{summaryText}</p>
        <p className='text-xs text-gray-500 italic mt-3'>
          Tax estimates are illustrative. Consult a tax advisor before making decisions.
        </p>
      </div>

    </div>
  )
}
