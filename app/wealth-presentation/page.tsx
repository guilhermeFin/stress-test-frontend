'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import WealthPresentation, { SAMPLE_DATA } from '@/components/results/WealthPresentation'
import type { BrazilStressResult } from '@/lib/api'

// Transform a brazil stress result into WealthPresentation's PortfolioData shape
function toPortfolioData(r: BrazilStressResult) {
  const s  = r.scenario
  const ps = r.portfolio_summary

  // Build allocation buckets from positions
  const buckets: Record<string, number> = {}
  for (const p of r.positions) {
    const label = p.currency === 'BRL' ? 'Brazil (BRL)' : 'International (USD)'
    buckets[label] = (buckets[label] ?? 0) + (p.original_value ?? p.value ?? 0)
  }
  const totalForPct = Object.values(buckets).reduce((a, b) => a + b, 0) || 1
  const COLORS: Record<string, string> = {
    'Brazil (BRL)':       '#C9A84C',
    'International (USD)':'#4A7FC1',
  }
  const allocation = Object.entries(buckets).map(([name, v]) => ({
    name,
    pct:   Math.round((v / totalForPct) * 100),
    color: COLORS[name] ?? '#8888AA',
  }))

  const impactBrl = ps.original_value_brl - ps.stressed_value_brl

  return {
    clientName:  'Your Portfolio',
    advisorName: 'PortfolioStress',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    totalUsd:   ps.original_value_usd,
    brlPerUsd:  ps.brl_usd_rate_original,
    allocation,
    performance: {
      oneMonth:  0,
      ytd:       0,
      oneYear:   0,
      benchmark: { oneMonth: 0, ytd: 0, oneYear: 0 },
      benchmarkName: '60/40 Blend',
    },
    scenarios: [{
      id:             s.id,
      name:           s.name,
      year:           s.year,
      narrative:      s.narrative,
      severity:       s.severity,
      impactUsd:      ps.impact_usd,
      impactPct:      ps.impact_pct,
      impactBrl:      -impactBrl,
      recoveryMonths: s.recovery_months,
      recoveryNote:   s.recovery_note,
    }],
    goals:         [],
    illiquidAssets:[],
    recommendedAction: '',
  }
}

export default function WealthPresentationPage() {
  const [advisorMode,   setAdvisorMode]   = useState(false)
  const [portfolioData, setPortfolioData] = useState(SAMPLE_DATA)
  const [usingSample,   setUsingSample]   = useState(true)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('brazilStressResults')
      if (raw) {
        const result: BrazilStressResult = JSON.parse(raw)
        setPortfolioData(toPortfolioData(result) as typeof SAMPLE_DATA)
        setUsingSample(false)
      }
    } catch {}
  }, [])

  return (
    <main className='min-h-screen bg-[#0A1628]'>
      {/* Thin control bar — hidden when printing */}
      <div className='print:hidden sticky top-0 z-50 bg-[#0A1628]/95 backdrop-blur border-b border-white/8'>
        <div className='max-w-4xl mx-auto px-4 md:px-8 py-2 flex items-center justify-between'>
          <Link
            href='/upload'
            className='text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1'
          >
            ← Run new test
          </Link>

          <div className='flex items-center gap-3'>
            {usingSample && (
              <span className='text-xs text-yellow-500/70 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-full'>
                Sample data — upload a portfolio to see your results
              </span>
            )}
            <label className='flex items-center gap-2 cursor-pointer'>
              <span className='text-xs text-slate-400'>Advisor mode</span>
              <button
                onClick={() => setAdvisorMode(v => !v)}
                className={`w-9 h-5 rounded-full transition-colors ${advisorMode ? 'bg-yellow-500' : 'bg-white/20'}`}
              >
                <span className={`block w-4 h-4 bg-white rounded-full ml-0.5 transition-transform ${advisorMode ? 'translate-x-4' : ''}`} />
              </button>
            </label>
          </div>
        </div>
      </div>

      <WealthPresentation portfolioData={portfolioData} advisorMode={advisorMode} />
    </main>
  )
}
