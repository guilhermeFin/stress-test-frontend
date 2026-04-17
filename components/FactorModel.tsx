'use client'

import { useMemo } from 'react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ReferenceLine
} from 'recharts'

const TOOLTIP_STYLE = {
  background: '#1F2937',
  border: '1px solid #374151',
  borderRadius: 8,
  color: '#F9FAFB'
}

const FACTOR_EXPOSURES: Record<string, {
  market: number; rates: number; inflation: number; credit: number; growth: number
}> = {
  AAPL: { market:  0.85, rates: -0.30, inflation: -0.20, credit:  0.10, growth:  0.80 },
  MSFT: { market:  0.82, rates: -0.25, inflation: -0.15, credit:  0.15, growth:  0.75 },
  AMZN: { market:  0.90, rates: -0.35, inflation: -0.10, credit:  0.05, growth:  0.85 },
  JPM:  { market:  0.88, rates:  0.40, inflation:  0.10, credit: -0.60, growth: -0.20 },
  XOM:  { market:  0.65, rates: -0.10, inflation:  0.75, credit: -0.15, growth: -0.50 },
  JNJ:  { market:  0.45, rates: -0.15, inflation:  0.20, credit:  0.10, growth: -0.30 },
  NEE:  { market:  0.50, rates: -0.55, inflation:  0.30, credit: -0.10, growth: -0.10 },
  GLD:  { market:  0.05, rates: -0.20, inflation:  0.90, credit:  0.20, growth: -0.80 },
  TLT:  { market: -0.20, rates: -0.95, inflation: -0.40, credit:  0.30, growth: -0.60 },
  LQD:  { market:  0.15, rates: -0.70, inflation: -0.20, credit: -0.75, growth: -0.40 },
  BTC:  { market:  0.70, rates: -0.15, inflation:  0.40, credit:  0.05, growth:  0.90 },
  VNQ:  { market:  0.60, rates: -0.65, inflation:  0.35, credit: -0.30, growth: -0.20 },
}

const DEFAULT_EXPOSURE = { market: 0.5, rates: -0.2, inflation: 0.1, credit: -0.1, growth: 0.1 }

const FACTOR_LABELS: Record<string, string> = {
  market:    'Market Beta',
  rates:     'Rate Sensitivity',
  inflation: 'Inflation',
  credit:    'Credit Spread',
  growth:    'Growth/Value',
}

const FACTOR_DESCRIPTIONS: Record<string, string> = {
  market:    'Sensitivity to broad equity market moves',
  rates:     'Impact of interest rate changes on portfolio',
  inflation: 'Benefit or harm from rising inflation',
  credit:    'Exposure to credit spread widening',
  growth:    'Tilt toward growth vs defensive/value stocks',
}

const FACTOR_COLORS: Record<string, string> = {
  market:    '#3B82F6',
  rates:     '#F59E0B',
  inflation: '#F97316',
  credit:    '#EF4444',
  growth:    '#8B5CF6',
}

// Parse scenario text into factor shocks
function parseScenarioToShocks(scenarioText: string): Record<string, number> {
  const text = scenarioText.toLowerCase()

  // Extract market shock
  let market = -0.25
  const marketMatch = text.match(/market[^%\d]*(\d+(?:\.\d+)?)%/) ||
    text.match(/s&p[^%\d]*(\d+(?:\.\d+)?)%/) ||
    text.match(/equit[^%\d]*(\d+(?:\.\d+)?)%/) ||
    text.match(/crash[^%\d]*(\d+(?:\.\d+)?)%/) ||
    text.match(/drops?[^%\d]*(\d+(?:\.\d+)?)%/)
  if (marketMatch) {
    market = -(parseFloat(marketMatch[1]) / 100)
  }

  // Extract rate shock
  let rates = 0.02
  const rateMatch = text.match(/rates?[^%\d]*(\d+(?:\.\d+)?)%/) ||
    text.match(/interest[^%\d]*(\d+(?:\.\d+)?)%/) ||
    text.match(/(\d+(?:\.\d+)?)\s*bps/)
  if (rateMatch) {
    const val = parseFloat(rateMatch[1])
    rates = text.includes('bps') ? val / 10000 : val / 100
    if (text.includes('fall') || text.includes('cut') || text.includes('drop')) {
      rates = -rates
    }
  }

  // Extract inflation shock
  let inflation = 0.01
  const inflMatch = text.match(/inflation[^%\d]*(\d+(?:\.\d+)?)%/) ||
    text.match(/cpi[^%\d]*(\d+(?:\.\d+)?)%/)
  if (inflMatch) {
    inflation = parseFloat(inflMatch[1]) / 100
  }

  // Extract credit shock (from spreads or crisis language)
  let credit = 0.5
  if (text.includes('credit crisis') || text.includes('credit markets freeze')) credit = 3.0
  else if (text.includes('recession')) credit = 1.5
  else if (text.includes('stagflation')) credit = 1.0
  const spreadMatch = text.match(/spread[^%\d]*(\d+(?:\.\d+)?)\s*bps/)
  if (spreadMatch) credit = parseFloat(spreadMatch[1]) / 100

  // Extract tech/growth shock
  let growth = -0.15
  const techMatch = text.match(/tech[^%\d]*(\d+(?:\.\d+)?)%/)
  if (techMatch) {
    growth = -(parseFloat(techMatch[1]) / 100) * 0.5
  }

  // Oil/commodity → affects inflation factor
  const oilMatch = text.match(/oil[^%\d]*(\d+(?:\.\d+)?)%/)
  if (oilMatch) {
    const oilShock = parseFloat(oilMatch[1]) / 100
    inflation = Math.max(inflation, oilShock * 0.3)
  }

  return { market, rates, inflation, credit, growth }
}

export default function FactorModel({
  positions,
  scenarioText,
}: {
  positions: any[]
  scenarioText?: string
}) {
  const totalValue = positions.reduce((s: number, p: any) => s + p.value, 0)

  // Parse scenario into shocks
  const shocks = useMemo(() =>
    parseScenarioToShocks(scenarioText || ''),
    [scenarioText]
  )

  // Portfolio-level factor exposures
  const portfolioFactors = useMemo(() => {
    const factors = { market: 0, rates: 0, inflation: 0, credit: 0, growth: 0 }
    positions.forEach((p: any) => {
      const weight = p.value / totalValue
      const exp    = FACTOR_EXPOSURES[p.ticker] ?? DEFAULT_EXPOSURE
      Object.keys(factors).forEach(f => {
        factors[f as keyof typeof factors] +=
          exp[f as keyof typeof exp] * weight
      })
    })
    return factors
  }, [positions, totalValue])

  // Factor contribution to loss
  const factorContributions = useMemo(() => {
    return Object.entries(portfolioFactors).map(([factor, exposure]) => {
      const shock        = shocks[factor] ?? 0
      const contribution = exposure * shock * 100
      return {
        factor,
        label:        FACTOR_LABELS[factor],
        exposure:     Number(exposure.toFixed(3)),
        shock,
        contribution: Number(contribution.toFixed(2)),
        color:        FACTOR_COLORS[factor],
        description:  FACTOR_DESCRIPTIONS[factor],
      }
    }).sort((a, b) => a.contribution - b.contribution)
  }, [portfolioFactors, shocks])

  const totalFactorLoss = factorContributions.reduce((s, f) => s + f.contribution, 0)

  // Radar data
  const radarData = Object.entries(portfolioFactors).map(([factor, value]) => ({
    factor: FACTOR_LABELS[factor],
    portfolio:  Number((Math.abs(value) * 100).toFixed(1)),
    benchmark:  30,
  }))

  // Per-position factor breakdown
  const positionFactors = positions.map((p: any) => {
    const exp    = FACTOR_EXPOSURES[p.ticker] ?? DEFAULT_EXPOSURE
    const weight = p.value / totalValue
    const contrib = Object.entries(shocks).reduce((sum, [f, shock]) => {
      return sum + (exp[f as keyof typeof exp] ?? 0) * shock * weight * 100
    }, 0)
    return { ticker: p.ticker, weight: Number((weight * 100).toFixed(1)),
      ...exp, factorLoss: Number(contrib.toFixed(2)) }
  }).sort((a, b) => a.factorLoss - b.factorLoss)

  const fmt = (n: number) => `${n > 0 ? '+' : ''}${n.toFixed(2)}%`

  return (
    <div className='space-y-6'>

      {/* Scenario shocks detected */}
      {scenarioText && (
        <div className='bg-gray-800 rounded-xl px-4 py-3 flex flex-wrap gap-4'>
          <span className='text-xs text-gray-400 self-center'>Detected shocks:</span>
          {Object.entries(shocks).map(([factor, shock]) => (
            <div key={factor} className='flex items-center gap-1.5'>
              <div className='w-2 h-2 rounded-full'
                style={{ background: FACTOR_COLORS[factor] }} />
              <span className='text-xs text-gray-300'>
                {FACTOR_LABELS[factor]}:{' '}
                <span className={shock < 0 ? 'text-red-400' : 'text-green-400'}>
                  {shock > 0 ? '+' : ''}{(shock * 100).toFixed(1)}
                  {factor === 'credit' ? 'bps×100' : '%'}
                </span>
              </span>
            </div>
          ))}
        </div>
      )}

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>

        <div className='bg-gray-900 rounded-2xl p-6 border border-gray-800'>
          <h3 className='font-semibold text-gray-200 mb-1'>Factor Loss Attribution</h3>
          <p className='text-xs text-gray-500 mb-4'>
            How much each risk factor contributes to portfolio loss
          </p>
          <ResponsiveContainer width='100%' height={260}>
            <BarChart data={factorContributions} layout='vertical'>
              <XAxis type='number' tick={{ fill: '#6B7280', fontSize: 11 }}
                tickFormatter={v => `${v}%`} />
              <YAxis dataKey='label' type='category'
                tick={{ fill: '#9CA3AF', fontSize: 11 }} width={120} />
              <Tooltip
                formatter={(v: any) => [`${Number(v).toFixed(2)}%`, 'Loss contribution']}
                contentStyle={TOOLTIP_STYLE}
                labelStyle={{ color: '#F9FAFB' }}
                itemStyle={{ color: '#F9FAFB' }} />
              <ReferenceLine x={0} stroke='#374151' />
              <Bar dataKey='contribution' radius={[0, 4, 4, 0]}>
                {factorContributions.map((entry, i) => (
                  <Cell key={i}
                    fill={entry.contribution < -5 ? '#EF4444'
                      : entry.contribution < -2 ? '#F59E0B'
                      : entry.contribution < 0  ? '#6B7280'
                      : '#10B981'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className='mt-3 bg-gray-800 rounded-xl p-3 flex justify-between'>
            <span className='text-xs text-gray-400'>Total factor-explained loss</span>
            <span className='text-sm font-bold text-red-400'>
              {totalFactorLoss.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className='bg-gray-900 rounded-2xl p-6 border border-gray-800'>
          <h3 className='font-semibold text-gray-200 mb-1'>Factor Exposure Radar</h3>
          <p className='text-xs text-gray-500 mb-4'>
            Portfolio factor intensity vs diversified benchmark
          </p>
          <ResponsiveContainer width='100%' height={260}>
            <RadarChart data={radarData}>
              <PolarGrid stroke='#374151' />
              <PolarAngleAxis dataKey='factor'
                tick={{ fill: '#9CA3AF', fontSize: 10 }} />
              <Radar name='Portfolio' dataKey='portfolio'
                stroke='#3B82F6' fill='#3B82F6' fillOpacity={0.3} />
              <Radar name='Benchmark' dataKey='benchmark'
                stroke='#10B981' fill='#10B981' fillOpacity={0.1}
                strokeDasharray='4 4' />
            </RadarChart>
          </ResponsiveContainer>
          <div className='flex items-center gap-6 justify-center mt-2'>
            <div className='flex items-center gap-2'>
              <div className='w-3 h-3 rounded-full bg-blue-500' />
              <span className='text-xs text-gray-400'>Your portfolio</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-3 h-3 rounded-full bg-green-500' />
              <span className='text-xs text-gray-400'>Diversified benchmark</span>
            </div>
          </div>
        </div>
      </div>

      {/* Factor detail cards */}
      <div className='grid grid-cols-1 md:grid-cols-5 gap-3'>
        {factorContributions.map(({ factor, label, exposure, shock, contribution, description, color }) => (
          <div key={factor} className='bg-gray-900 rounded-xl p-4 border border-gray-800'>
            <div className='flex items-center gap-2 mb-2'>
              <div className='w-2 h-2 rounded-full' style={{ background: color }} />
              <span className='text-xs font-medium text-gray-300'>{label}</span>
            </div>
            <div className='text-lg font-bold text-white mb-0.5'>
              {exposure > 0 ? '+' : ''}{(exposure * 100).toFixed(0)}
            </div>
            <div className='text-xs text-gray-600 mb-1'>
              Shock: <span className={shock < 0 ? 'text-red-400' : 'text-green-400'}>
                {shock > 0 ? '+' : ''}{(shock * 100).toFixed(1)}%
              </span>
            </div>
            <div className='text-xs text-gray-500 mb-2'>{description}</div>
            <div className={`text-sm font-bold ${
              contribution < -2 ? 'text-red-400'
              : contribution < 0 ? 'text-orange-400'
              : 'text-green-400'
            }`}>
              {fmt(contribution)} contribution
            </div>
          </div>
        ))}
      </div>

      {/* Position factor table */}
      <div className='bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden'>
        <div className='p-5 pb-3'>
          <h3 className='font-semibold text-gray-200'>Position Factor Exposures</h3>
          <p className='text-xs text-gray-500 mt-1'>
            Each position's sensitivity to the 5 key risk factors
          </p>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead className='bg-gray-800 text-gray-400 text-xs'>
              <tr>
                <th className='px-4 py-3 text-left'>Ticker</th>
                <th className='px-4 py-3 text-right'>Weight</th>
                <th className='px-4 py-3 text-right text-blue-400'>Market β</th>
                <th className='px-4 py-3 text-right text-yellow-400'>Rates</th>
                <th className='px-4 py-3 text-right text-orange-400'>Inflation</th>
                <th className='px-4 py-3 text-right text-red-400'>Credit</th>
                <th className='px-4 py-3 text-right text-purple-400'>Growth</th>
                <th className='px-4 py-3 text-right'>Factor Loss</th>
              </tr>
            </thead>
            <tbody>
              {positionFactors.map((p: any, i: number) => (
                <tr key={p.ticker}
                  className={`border-t border-gray-800 hover:bg-gray-800/50
                    ${i % 2 === 0 ? '' : 'bg-gray-900/50'}`}>
                  <td className='px-4 py-3 font-medium text-white'>{p.ticker}</td>
                  <td className='px-4 py-3 text-right text-gray-300'>{p.weight}%</td>
                  <td className='px-4 py-3 text-right text-blue-400'>
                    {p.market > 0 ? '+' : ''}{p.market.toFixed(2)}</td>
                  <td className='px-4 py-3 text-right text-yellow-400'>
                    {p.rates > 0 ? '+' : ''}{p.rates.toFixed(2)}</td>
                  <td className='px-4 py-3 text-right text-orange-400'>
                    {p.inflation > 0 ? '+' : ''}{p.inflation.toFixed(2)}</td>
                  <td className='px-4 py-3 text-right text-red-400'>
                    {p.credit > 0 ? '+' : ''}{p.credit.toFixed(2)}</td>
                  <td className='px-4 py-3 text-right text-purple-400'>
                    {p.growth > 0 ? '+' : ''}{p.growth.toFixed(2)}</td>
                  <td className={`px-4 py-3 text-right font-medium ${
                    p.factorLoss < -2 ? 'text-red-400'
                    : p.factorLoss < 0 ? 'text-orange-400'
                    : 'text-green-400'
                  }`}>{fmt(p.factorLoss)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className='bg-gray-800 border-t border-gray-700'>
              <tr>
                <td colSpan={7} className='px-4 py-3 text-xs text-gray-400 font-medium'>
                  Total factor-explained loss
                </td>
                <td className='px-4 py-3 text-right font-bold text-red-400'>
                  {totalFactorLoss.toFixed(2)}%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}