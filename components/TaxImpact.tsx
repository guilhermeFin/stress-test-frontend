'use client'

import { useMemo } from 'react'
import { Scissors, Receipt, Wallet, ArrowRight } from 'lucide-react'
import { StressTestResult } from '@/lib/api'
import { ClientProfile } from '@/components/ClientImpact'

function computeTaxImpact(results: StressTestResult, profile: ClientProfile) {
  const { positions, summary } = results
  const { taxBracket, taxablePct, traditionalPct, annualWithdrawal } = profile
  const longTermRate = taxBracket <= 0.24 ? 0.15 : 0.20

  // 1. Tax-loss harvesting — all positions down in the stress scenario
  const harvestableAll = positions
    .filter(p => p.stressed_value < p.value)
    .map(p => {
      const harvestableLoss = p.value - p.stressed_value
      const taxSavings = harvestableLoss * (taxablePct / 100) * taxBracket
      return {
        ticker: p.ticker,
        value: p.value,
        stressedValue: p.stressed_value,
        harvestableLoss,
        taxSavings,
      }
    })
    .sort((a, b) => b.harvestableLoss - a.harvestableLoss)

  const top5 = harvestableAll.slice(0, 5)
  const totalTaxSavings = harvestableAll.reduce((s, p) => s + p.taxSavings, 0)

  // 2. Capital gains tax if rebalancing — positions with small losses, likely sold
  let shortTermTax = 0
  let longTermTax = 0

  for (const p of positions.filter(p => p.loss_pct > -5)) {
    const estimatedGain = p.stressed_value - p.value * 0.85
    if (estimatedGain > 0) {
      shortTermTax += estimatedGain * 0.5 * taxBracket    * (taxablePct / 100)
      longTermTax  += estimatedGain * 0.5 * longTermRate  * (taxablePct / 100)
    }
  }
  const totalRebalancingTax = shortTermTax + longTermTax

  // 3. Withdrawal tax impact
  const taxFromTaxable     = annualWithdrawal * (taxablePct     / 100) * longTermRate
  const taxFromTraditional = annualWithdrawal * (traditionalPct / 100) * taxBracket
  const totalWithdrawalTax = taxFromTaxable + taxFromTraditional
  const effectiveRate      = annualWithdrawal > 0 ? totalWithdrawalTax / annualWithdrawal : 0
  const afterTaxWithdrawal = annualWithdrawal - totalWithdrawalTax

  // 4. After-tax portfolio — harvesting losses nets a tax refund against the stressed value
  const preTaxStressed   = summary.stressed_value
  const afterTaxStressed = preTaxStressed + totalTaxSavings

  return {
    top5,
    harvestCount: harvestableAll.length,
    totalTaxSavings,
    shortTermTax,
    longTermTax,
    totalRebalancingTax,
    totalWithdrawalTax,
    effectiveRate,
    afterTaxWithdrawal,
    preTaxStressed,
    afterTaxStressed,
  }
}

export default function TaxImpact({
  results,
  profile,
}: {
  results: StressTestResult
  profile: ClientProfile
}) {
  const tax = useMemo(() => computeTaxImpact(results, profile), [results, profile])

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD', maximumFractionDigits: 0,
    }).format(n)

  const fmtPct = (n: number) => `${(n * 100).toFixed(1)}%`

  return (
    <div className='space-y-4'>

      {/* Card 1: Tax-loss harvesting — full width */}
      <div className='bg-white/3 rounded-2xl border border-white/8 p-5'>
        <div className='flex items-center gap-2 mb-2'>
          <Scissors size={16} className='text-green-400' />
          <h3 className='font-semibold text-gray-200'>Tax-loss harvesting opportunities</h3>
        </div>
        <div className='flex items-baseline gap-3 mb-1'>
          <span className='text-3xl font-bold text-green-400'>{fmt(tax.totalTaxSavings)}</span>
          <span className='text-sm text-gray-500'>estimated tax savings</span>
        </div>
        <p className='text-xs text-gray-500 mb-4'>
          By harvesting losses in {tax.harvestCount} position
          {tax.harvestCount !== 1 ? 's' : ''} in your taxable accounts
        </p>

        {tax.top5.length > 0 ? (
          <div className='overflow-x-auto mb-4'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='text-xs text-gray-500 border-b border-white/8'>
                  <th className='text-left pb-2'>Ticker</th>
                  <th className='text-right pb-2'>Current Value</th>
                  <th className='text-right pb-2'>Stressed Value</th>
                  <th className='text-right pb-2'>Harvestable Loss</th>
                  <th className='text-right pb-2'>Est. Tax Savings</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-white/5'>
                {tax.top5.map(p => (
                  <tr key={p.ticker} className='text-gray-300'>
                    <td className='py-2 font-medium text-white'>{p.ticker}</td>
                    <td className='py-2 text-right text-gray-300'>{fmt(p.value)}</td>
                    <td className='py-2 text-right text-red-400'>{fmt(p.stressedValue)}</td>
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
          <p className='text-sm text-gray-500 italic mb-4'>
            No positions are at a loss under this scenario.
          </p>
        )}

        <div className='bg-green-950/30 border border-green-800/40 rounded-xl p-3'>
          <p className='text-xs text-green-200/70 leading-relaxed'>
            You could save approximately{' '}
            <strong className='text-green-300'>{fmt(tax.totalTaxSavings)}</strong> in taxes by selling
            {tax.harvestCount > 0 ? ' these positions' : ' loss positions'} at a loss and reinvesting in
            similar (but not substantially identical) assets to maintain market exposure while locking in
            the tax benefit.
          </p>
        </div>
      </div>

      {/* Cards 2 & 3 — half width */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

        {/* Card 2: Rebalancing tax cost */}
        <div className='bg-white/3 rounded-2xl border border-white/8 p-5'>
          <div className='flex items-center gap-2 mb-4'>
            <Receipt size={16} className='text-orange-400' />
            <h3 className='font-semibold text-gray-200'>Capital gains tax if rebalancing</h3>
          </div>
          <div className='space-y-2 mb-4'>
            {[
              { label: 'Short-term gains tax', value: fmt(tax.shortTermTax),        color: 'text-red-400'    },
              { label: 'Long-term gains tax',  value: fmt(tax.longTermTax),         color: 'text-orange-400' },
              { label: 'Total rebalancing cost', value: fmt(tax.totalRebalancingTax), color: 'text-red-400'  },
            ].map(({ label, value, color }, i) => (
              <div key={label}
                className={`flex justify-between items-center rounded-lg px-3 py-2
                  ${i === 2 ? 'bg-white/8 border border-white/10' : 'bg-white/5'}`}>
                <span className={`text-xs ${i === 2 ? 'text-gray-300 font-medium' : 'text-gray-400'}`}>
                  {label}
                </span>
                <span className={`text-sm font-bold ${color}`}>{value}</span>
              </div>
            ))}
          </div>
          <p className='text-xs text-gray-500 leading-relaxed'>
            Selling to rebalance would trigger approximately{' '}
            <span className='text-gray-300'>{fmt(tax.totalRebalancingTax)}</span> in capital gains taxes.
            Consider tax-loss harvesting first to offset these gains.
          </p>
        </div>

        {/* Card 3: Withdrawal tax drag */}
        <div className='bg-white/3 rounded-2xl border border-white/8 p-5'>
          <div className='flex items-center gap-2 mb-4'>
            <Wallet size={16} className='text-blue-400' />
            <h3 className='font-semibold text-gray-200'>Withdrawal tax impact</h3>
          </div>
          <div className='space-y-2 mb-4'>
            {[
              { label: 'Annual withdrawal need', value: fmt(profile.annualWithdrawal),    color: 'text-white'      },
              { label: 'Effective tax rate',     value: fmtPct(tax.effectiveRate),        color: 'text-orange-400' },
              { label: 'After-tax withdrawal',   value: fmt(tax.afterTaxWithdrawal),      color: 'text-green-400'  },
              { label: 'Tax drag per year',      value: fmt(tax.totalWithdrawalTax),      color: 'text-red-400'    },
            ].map(({ label, value, color }) => (
              <div key={label} className='flex justify-between items-center bg-white/5 rounded-lg px-3 py-2'>
                <span className='text-xs text-gray-400'>{label}</span>
                <span className={`text-sm font-bold ${color}`}>{value}</span>
              </div>
            ))}
          </div>
          <div className='space-y-1.5 mb-3'>
            <p className='text-xs text-gray-500'>Account breakdown</p>
            {[
              { label: 'Taxable',     pct: profile.taxablePct,     color: 'bg-green-500'  },
              { label: 'Traditional', pct: profile.traditionalPct, color: 'bg-blue-500'   },
              { label: 'Roth',        pct: profile.rothPct,        color: 'bg-purple-500' },
            ].map(({ label, pct, color }) => (
              <div key={label} className='flex items-center gap-2'>
                <div className={`w-2 h-2 rounded-full shrink-0 ${color}`} />
                <span className='text-xs text-gray-400 w-20'>{label}</span>
                <div className='flex-1 h-1 bg-white/10 rounded-full overflow-hidden'>
                  <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                </div>
                <span className='text-xs text-gray-400 w-8 text-right'>{pct}%</span>
              </div>
            ))}
          </div>
          <p className='text-xs text-gray-500 leading-relaxed'>
            Withdrawing <span className='text-gray-300'>{fmt(profile.annualWithdrawal)}/year</span> from
            your current account mix results in an effective tax rate of{' '}
            <span className='text-gray-300'>{fmtPct(tax.effectiveRate)}</span>, leaving{' '}
            <span className='text-gray-300'>{fmt(tax.afterTaxWithdrawal)}</span> after taxes.
          </p>
        </div>
      </div>

      {/* Card 4: After-tax portfolio summary — full width */}
      <div className='bg-white/3 rounded-2xl border border-white/8 p-5'>
        <h3 className='font-semibold text-gray-200 mb-6'>After-tax portfolio summary</h3>
        <div className='flex items-center justify-center gap-6'>
          <div className='text-center'>
            <p className='text-xs text-gray-500 mb-2'>Pre-tax stressed value</p>
            <p className='text-3xl font-bold text-red-400'>{fmt(tax.preTaxStressed)}</p>
          </div>
          <ArrowRight size={24} className='text-gray-600 shrink-0' />
          <div className='text-center'>
            <p className='text-xs text-gray-500 mb-2'>After-tax value (with harvesting)</p>
            <p className='text-3xl font-bold text-orange-400'>{fmt(tax.afterTaxStressed)}</p>
          </div>
        </div>
        <div className='mt-4 text-center'>
          <span className='text-sm font-semibold text-green-400'>
            +{fmt(tax.totalTaxSavings)} from tax savings
          </span>
        </div>
        <p className='text-xs text-gray-600 italic text-center mt-3'>
          Tax estimates are illustrative. Consult a tax advisor before acting.
        </p>
      </div>

    </div>
  )
}
