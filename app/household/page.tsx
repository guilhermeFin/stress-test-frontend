'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  TrendingDown, ArrowLeft, Plus, Trash2,
  ChevronRight, Users, Briefcase, Lock, ArrowRight,
} from 'lucide-react'

const ACCOUNT_TYPES = ['Brokerage', 'IRA', 'Roth IRA', '401(k)', '403(b)', 'Pension', 'Trust', 'Other']

const HISTORICAL_SCENARIOS = [
  {
    key: '2008',
    label: '2008 GFC',
    badge: 'bg-red-900/50 text-red-400',
    severity: 'Extreme',
    text: '2008 Global Financial Crisis: market crashes 57%, credit markets freeze, spreads widen 300bps, financials drop 80%',
  },
  {
    key: 'covid',
    label: 'COVID Crash',
    badge: 'bg-orange-900/50 text-orange-400',
    severity: 'Severe',
    text: 'COVID-19 crash: market drops 34% in 5 weeks, energy sector collapses 55%, rates cut to zero, gold surges 15%',
  },
  {
    key: 'rate',
    label: '2022 Rate Shock',
    badge: 'bg-blue-900/50 text-blue-400',
    severity: 'Severe',
    text: '2022 rate shock: Fed raises rates 425bps, bonds crash 15%, tech drops 35%, inflation hits 9%, growth stocks fall 50%',
  },
]

interface Account {
  id: string
  name: string
  type: string
  aum: string
  positions: string
}

function uid() { return Math.random().toString(36).slice(2) }

function makeAccount(type = 'Brokerage'): Account {
  return { id: uid(), name: '', type, aum: '', positions: '' }
}

function parsePositionsText(text: string): { ticker: string; weight: number }[] {
  const items: { ticker: string; weight: number }[] = []
  const tokens = text.trim().split(/[\s,\n]+/).filter(Boolean)
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]
    if (t.includes(':')) {
      const [ticker, w] = t.split(':')
      if (ticker) items.push({ ticker: ticker.toUpperCase(), weight: parseFloat(w) || 10 })
    } else if (/^[A-Za-z]{1,5}$/.test(t)) {
      const nextNum = parseFloat(tokens[i + 1])
      if (!isNaN(nextNum)) {
        items.push({ ticker: t.toUpperCase(), weight: nextNum })
        i++
      } else {
        items.push({ ticker: t.toUpperCase(), weight: 10 })
      }
    }
  }
  return items
}

export default function HouseholdPage() {
  const router = useRouter()
  const [accounts, setAccounts] = useState<Account[]>([
    makeAccount('Brokerage'),
    makeAccount('IRA'),
  ])
  const [scenario, setScenario] = useState(HISTORICAL_SCENARIOS[0].text)
  const [activeScenarioKey, setActiveScenarioKey] = useState('2008')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const addAccount = () => setAccounts(a => [...a, makeAccount()])
  const removeAccount = (id: string) => setAccounts(a => a.filter(x => x.id !== id))
  const patchAccount = (id: string, patch: Partial<Account>) =>
    setAccounts(a => a.map(x => x.id === id ? { ...x, ...patch } : x))

  const totalAum = accounts.reduce((s, a) => {
    const n = parseFloat(a.aum.replace(/[$,]/g, ''))
    return s + (isNaN(n) ? 0 : n)
  }, 0)

  const handleRun = async () => {
    const filled = accounts.filter(a => a.positions.trim())
    if (filled.length < 1) { setError('Please enter positions for at least one account.'); return }
    if (!scenario.trim())  { setError('Please select or describe a scenario.'); return }

    setLoading(true)
    setError('')

    try {
      const rows: Array<Record<string, unknown>> = []

      for (const account of filled) {
        const accountAum = parseFloat(account.aum.replace(/[$,]/g, '')) || 100000
        const items = parsePositionsText(account.positions)
        if (!items.length) continue

        const totalW = items.reduce((s, p) => s + p.weight, 0)
        for (const item of items) {
          const weightFraction = item.weight / totalW
          const value = Math.round(accountAum * weightFraction)
          rows.push({
            ticker:       item.ticker,
            weight:       parseFloat(((accountAum / Math.max(totalAum, 1)) * weightFraction * 100).toFixed(2)),
            value,
            cost_basis:   Math.round(value * 0.85),
            shares:       Math.round(value / 100),
            account_type: account.type,
            geography:    'US',
          })
        }
      }

      if (!rows.length) { setError('No valid positions found. Use format: AAPL 40 MSFT 30'); return }

      // Re-normalise weights to sum to 100
      const wSum = rows.reduce((s, r) => s + (r.weight as number), 0)
      rows.forEach(r => { r.weight = parseFloat(((r.weight as number) / wSum * 100).toFixed(2)) })

      const headers = ['ticker', 'weight', 'value', 'cost_basis', 'shares', 'account_type', 'geography']
      const csv = [headers.join(','), ...rows.map(r => headers.map(h => r[h]).join(','))].join('\n')

      const file = new File([csv], 'household.csv', { type: 'text/csv' })
      const formData = new FormData()
      formData.append('file', file)
      formData.append('scenario', scenario)

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/stress-test`,
        { method: 'POST', body: formData }
      )
      if (!response.ok) throw new Error('API error')
      const results = await response.json()

      const householdData = filled.map(a => ({
        name:      a.name || a.type,
        type:      a.type,
        aum:       parseFloat(a.aum.replace(/[$,]/g, '')) || 0,
        positions: parsePositionsText(a.positions),
      }))

      sessionStorage.setItem('stressResults',   JSON.stringify(results))
      sessionStorage.setItem('householdData',    JSON.stringify(householdData))
      sessionStorage.removeItem('isDemoMode')
      router.push('/results')
    } catch {
      setError('Analysis failed. Please check your input and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='min-h-screen bg-[#0A0F1E] text-white'>

      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px]
          bg-blue-950/25 rounded-full blur-3xl' />
      </div>

      <div className='relative max-w-3xl mx-auto px-6 py-12'>

        {/* Header */}
        <div className='flex items-center justify-between mb-14'>
          <div className='flex items-center gap-3'>
            <Link href='/upload' className='flex items-center gap-2 text-gray-400
              hover:text-white transition-colors'>
              <ArrowLeft size={14} />
            </Link>
            <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
              <TrendingDown size={15} className='text-white' />
            </div>
            <span className='font-bold tracking-tight'>PortfolioStress</span>
          </div>
          <Link href='/upload'
            className='text-sm text-gray-400 hover:text-white transition-colors'>
            Single portfolio →
          </Link>
        </div>

        {/* Hero */}
        <div className='mb-8'>
          <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-5'>
            <Users size={11} />
            Household / Multi-Account View
          </div>
          <h1 className='text-4xl font-bold tracking-tight mb-3
            bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent'>
            Stress test the whole household
          </h1>
          <p className='text-gray-400 leading-relaxed'>
            Add all accounts — brokerage, IRA, 401(k), trusts — and see the combined
            stress impact across the entire household.
          </p>
        </div>

        {/* Professional plan gate */}
        <div className='bg-gradient-to-br from-[#0D1530] to-[#0A0F1E]
          border border-blue-500/20 rounded-2xl p-6 mb-8'>
          <div className='flex items-start gap-4'>
            <div className='w-10 h-10 bg-blue-600/20 rounded-xl flex items-center
              justify-center shrink-0'>
              <Lock size={18} className='text-blue-400' />
            </div>
            <div className='flex-1 min-w-0'>
              <p className='font-semibold text-white mb-1'>Professional plan feature</p>
              <p className='text-sm text-gray-400 leading-relaxed'>
                Household View is available on the Professional plan ($299/mo).
                This preview lets you explore the interface — upgrade to run live analyses.
              </p>
            </div>
            <Link href='/#pricing'
              className='flex items-center gap-1.5 px-4 py-2 rounded-xl
                bg-blue-600 hover:bg-blue-500 text-sm text-white font-semibold
                transition-all shrink-0 shadow-lg shadow-blue-900/30'>
              Upgrade
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Total AUM indicator */}
        {totalAum > 0 && (
          <div className='flex items-center gap-3 bg-white/3 border border-white/8
            rounded-xl px-5 py-3 mb-5'>
            <Briefcase size={15} className='text-blue-400 shrink-0' />
            <span className='text-sm text-gray-400'>Total household AUM</span>
            <span className='text-sm font-bold text-white ml-auto'>
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalAum)}
            </span>
          </div>
        )}

        {/* Accounts */}
        <div className='space-y-4 mb-5'>
          {accounts.map((account, idx) => (
            <div key={account.id}
              className='bg-white/3 border border-white/8 rounded-2xl overflow-hidden'>
              <div className='flex items-center gap-3 px-5 py-3.5 border-b border-white/8'>
                <div className='w-6 h-6 bg-blue-600/20 rounded-lg flex items-center
                  justify-center shrink-0 text-xs font-bold text-blue-400'>
                  {idx + 1}
                </div>
                <input
                  value={account.name}
                  onChange={e => patchAccount(account.id, { name: e.target.value })}
                  placeholder='Account label (e.g. John IRA)'
                  className='flex-1 bg-transparent text-sm text-white placeholder-gray-600
                    focus:outline-none'
                />
                {accounts.length > 1 && (
                  <button onClick={() => removeAccount(account.id)}
                    className='text-gray-600 hover:text-red-400 transition-colors ml-2'>
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              <div className='p-5 space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-xs text-gray-500 mb-1.5'>Account type</label>
                    <select
                      value={account.type}
                      onChange={e => patchAccount(account.id, { type: e.target.value })}
                      className='w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2
                        text-sm text-white focus:outline-none focus:border-blue-500/50
                        appearance-none cursor-pointer'>
                      {ACCOUNT_TYPES.map(t => (
                        <option key={t} value={t} className='bg-[#1a2035]'>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className='block text-xs text-gray-500 mb-1.5'>Account value (AUM)</label>
                    <input
                      value={account.aum}
                      onChange={e => patchAccount(account.id, { aum: e.target.value })}
                      placeholder='$250,000'
                      className='w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2
                        text-sm text-white placeholder-gray-600 focus:outline-none
                        focus:border-blue-500/50'
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-xs text-gray-500 mb-1.5'>
                    Positions &nbsp;
                    <span className='text-gray-600'>— TICKER WEIGHT per line, e.g. "AAPL 40 MSFT 30 AMZN 30"</span>
                  </label>
                  <textarea
                    value={account.positions}
                    onChange={e => patchAccount(account.id, { positions: e.target.value })}
                    placeholder={'AAPL 40\nMSFT 30\nAMZN 30'}
                    rows={4}
                    className='w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3
                      text-sm text-white placeholder-gray-600 focus:outline-none
                      focus:border-blue-500/50 resize-none font-mono'
                  />
                  {account.positions.trim() && (() => {
                    const parsed = parsePositionsText(account.positions)
                    return parsed.length > 0 ? (
                      <p className='text-xs text-green-400 mt-1'>
                        {parsed.length} position{parsed.length !== 1 ? 's' : ''} detected
                      </p>
                    ) : null
                  })()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add account */}
        <button
          onClick={addAccount}
          className='w-full py-3 rounded-2xl border border-dashed border-white/10
            hover:border-white/20 text-sm text-gray-500 hover:text-gray-300
            transition-all flex items-center justify-center gap-2 mb-8'>
          <Plus size={14} />
          Add another account
        </button>

        {/* Scenario */}
        <div className='mb-6'>
          <p className='text-xs text-gray-500 font-medium mb-3 px-1'>Choose a crisis scenario</p>
          <div className='grid grid-cols-3 gap-3 mb-4'>
            {HISTORICAL_SCENARIOS.map(s => (
              <button
                key={s.key}
                onClick={() => { setScenario(s.text); setActiveScenarioKey(s.key) }}
                className={`p-4 rounded-xl border text-left transition-all
                  ${activeScenarioKey === s.key
                    ? 'bg-white/8 border-white/20 ring-1 ring-white/15'
                    : 'bg-white/3 border-white/8 hover:bg-white/5'
                  }`}>
                <div className='flex items-start justify-between gap-2 mb-2'>
                  <span className='text-sm font-semibold text-white'>{s.label}</span>
                  {activeScenarioKey === s.key && (
                    <div className='w-4 h-4 bg-blue-600 rounded-full flex items-center
                      justify-center shrink-0'>
                      <div className='w-1.5 h-1.5 bg-white rounded-full' />
                    </div>
                  )}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.badge}`}>
                  {s.severity}
                </span>
              </button>
            ))}
          </div>
          <textarea
            value={scenario}
            onChange={e => { setScenario(e.target.value); setActiveScenarioKey('') }}
            placeholder='Or describe a custom scenario…'
            rows={2}
            className='w-full bg-white/3 border border-white/10 rounded-xl px-4 py-3
              text-sm text-white placeholder-gray-600 focus:outline-none
              focus:border-blue-500/50 resize-none'
          />
        </div>

        {error && (
          <div className='mb-4 text-sm text-red-400 bg-red-500/10 border
            border-red-500/20 rounded-xl px-4 py-3'>
            {error}
          </div>
        )}

        <button
          onClick={handleRun}
          disabled={loading}
          className='w-full py-4 rounded-2xl font-semibold text-sm transition-all
            duration-150 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed
            bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/40'>
          {loading ? (
            <span className='flex items-center justify-center gap-2'>
              <span className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
              Combining accounts and running analysis…
            </span>
          ) : (
            <span className='flex items-center justify-center gap-2'>
              Run Household Analysis
              <ChevronRight size={16} />
            </span>
          )}
        </button>

        <p className='text-center text-xs text-gray-600 mt-4'>
          All accounts are combined into a single stress test
        </p>
      </div>
    </main>
  )
}
