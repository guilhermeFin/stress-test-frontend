'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useError } from '@/lib/error-context'
import { useDropzone } from 'react-dropzone'
import { runStressTest, runBrazilStressFile, listBrazilScenarios, BrazilScenarioMeta } from '@/lib/api'
import {
  Upload, AlertCircle, Download,
  Shield, BarChart3, Brain, Activity, ChevronRight, Clock
} from 'lucide-react'
import ShockBuilder from '@/components/ShockBuilder'
import { Button } from '@/components/ui/neon-button'
import { LumaSpin } from '@/components/ui/luma-spin'
import Link from 'next/link'

const HISTORICAL_SCENARIOS = [
  {
    label: '2008 GFC',
    year: '2008',
    accentColor: 'border-l-red-500',
    badge: 'bg-red-50 text-red-700 border border-red-200',
    severity: 'Extreme',
    text: '2008 Global Financial Crisis: market crashes 57%, credit markets freeze, spreads widen 300bps, financials drop 80%, real estate collapses 65%',
  },
  {
    label: 'COVID Crash',
    year: '2020',
    accentColor: 'border-l-orange-500',
    badge: 'bg-orange-50 text-orange-700 border border-orange-200',
    severity: 'Severe',
    text: 'COVID-19 crash: market drops 34% in 5 weeks, energy sector collapses 55%, consumer discretionary falls 40%, rates cut to zero, gold surges 15%',
  },
  {
    label: 'Dot-Com Bust',
    year: '2000',
    accentColor: 'border-l-purple-500',
    badge: 'bg-purple-50 text-purple-700 border border-purple-200',
    severity: 'Extreme',
    text: 'Dot-com bust: tech sector crashes 78%, communication services drops 65%, market falls 49% over 2 years, rates fall 2.5%',
  },
  {
    label: '1987 Black Monday',
    year: '1987',
    accentColor: 'border-l-amber-500',
    badge: 'bg-amber-50 text-amber-700 border border-amber-200',
    severity: 'Extreme',
    text: 'Black Monday 1987: market crashes 22% in a single day, volatility spikes 300%, liquidity evaporates, portfolio insurance fails',
  },
  {
    label: '2022 Rate Shock',
    year: '2022',
    accentColor: 'border-l-[#2563EB]',
    badge: 'bg-blue-50 text-[#2563EB] border border-blue-200',
    severity: 'Severe',
    text: '2022 rate shock: Fed raises rates 425bps, bonds crash 15%, tech drops 35%, inflation hits 9%, growth stocks fall 50%',
  },
  {
    label: 'Stagflation',
    year: '1970s',
    accentColor: 'border-l-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    severity: 'Severe',
    text: 'Stagflation scenario: inflation surges to 8%, GDP contracts 3%, unemployment rises to 8%, oil prices surge 40%, rates rise 3%',
  },
]

const FEATURES = [
  { icon: Brain,     label: 'AI Signal Classification',  desc: 'Claude analyzes 130+ live news & SEC signals' },
  { icon: Shield,    label: 'Multi-Scenario Stress Test', desc: '4 institutional scenarios with tax impact' },
  { icon: BarChart3, label: 'Factor Risk Model',          desc: '5-factor attribution: beta, rates, credit & more' },
  { icon: Activity,  label: 'Monte Carlo Simulation',     desc: '1,000 path simulation with fan chart' },
]

const SAMPLE_SCENARIOS = [
  'Market crashes 25%, interest rates rise 2%, tech drops 40%',
  '2008-style crisis: equities fall 50%, credit markets freeze',
  'Stagflation: inflation at 8%, GDP contracts 3%, rates at 7%',
  'China conflict: Asian markets crash 35%, commodities surge 20%',
]

export default function UploadPage() {
  const router = useRouter()
  const { showError } = useError()
  const [file, setFile]         = useState<File | null>(null)
  const [scenario, setScenario] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [activeHistorical, setActiveHistorical] = useState<string | null>(null)

  // Brazil state
  const [brazilScenarios, setBrazilScenarios]   = useState<BrazilScenarioMeta[]>([])
  const [brazilScenarioId, setBrazilScenarioId] = useState<string | null>(null)
  const [brlUsdRate, setBrlUsdRate]             = useState(5.20)
  const [scenarioTab, setScenarioTab]           = useState<'global' | 'brazil'>('global')

  useEffect(() => {
    listBrazilScenarios().then(setBrazilScenarios).catch(() => {})
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] },
    onDrop: (files) => setFile(files[0]),
    maxFiles: 1,
  })

  const handleSubmit = async () => {
    if (!file) {
      setError('Please upload a portfolio file.')
      return
    }
    if (scenarioTab === 'brazil') {
      if (!brazilScenarioId) {
        setError('Please select a Brazil scenario.')
        return
      }
      setLoading(true)
      setError('')
      try {
        const results = await runBrazilStressFile(file, brazilScenarioId, brlUsdRate)
        sessionStorage.setItem('brazilStressResults', JSON.stringify(results))
        router.push('/wealth-presentation')
      } catch (e) {
        const msg = 'Brazil stress analysis failed. Please check your file format and try again.'
        setError(msg)
        showError(msg, { title: 'Analysis Failed', errorCode: e instanceof Error ? e.message : undefined })
      } finally {
        setLoading(false)
      }
    } else {
      if (!scenario) {
        setError('Please describe a stress scenario.')
        return
      }
      setLoading(true)
      setError('')
      try {
        const results = await runStressTest(file, scenario)
        sessionStorage.setItem('stressResults', JSON.stringify(results))
        router.push('/results')
      } catch (e) {
        const msg = 'Analysis failed. Please check your file format and try again.'
        setError(msg)
        showError(msg, { title: 'Analysis Failed', errorCode: e instanceof Error ? e.message : undefined })
      } finally {
        setLoading(false)
      }
    }
  }

  const handleDownloadTemplate = () =>
    window.open(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/download-template`,
      '_blank'
    )

  const handleHistorical = (s: typeof HISTORICAL_SCENARIOS[0]) => {
    setScenario(s.text)
    setActiveHistorical(s.label)
  }

  return (
    <main className='min-h-screen text-[#0B1B2E] relative'>
      {/* Full-screen loading overlay */}
      {loading && (
        <div className='absolute inset-0 z-50 flex flex-col items-center justify-center
          bg-white/95 backdrop-blur-sm'>
          <LumaSpin size={65} />
          <p className='mt-6 text-sm text-slate-600 font-medium'>Running analysis…</p>
          <p className='mt-1 text-xs text-slate-400'>This usually takes 15–45 seconds</p>
        </div>
      )}
      <div className='relative max-w-6xl mx-auto px-6 py-12'>

        {/* Hero */}
        <div className='text-center mb-16'>
          <div className='inline-flex items-center gap-2 px-5 py-2 rounded-full
            bg-[#2563EB]/8 border border-[#2563EB]/20 text-[#2563EB] text-xs
            font-medium mb-6'>
            <span className='w-1.5 h-1.5 bg-[#2563EB] rounded-full' />
            Institutional-grade portfolio risk analysis
          </div>
          <h1 className='font-semibold text-[#0B1B2E] mb-6'
            style={{ fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: '1.05', letterSpacing: '-0.8px' }}>
            Know your risk<br />before it knows you
          </h1>
          <p className='text-slate-600 text-lg max-w-xl mx-auto leading-relaxed'>
            Upload any portfolio. Describe a scenario. Get institutional-grade
            stress testing, factor analysis, and AI-powered insights in seconds.
          </p>
        </div>

        {/* Feature pills */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mb-12'>
          {FEATURES.map(({ icon: Icon, label, desc }) => (
            <div key={label}
              className='bg-white border border-slate-200 rounded-lg p-4 shadow-sm
                transition-shadow duration-150 hover:shadow-md group'>
              <div className='w-8 h-8 bg-[#2563EB]/10 rounded-lg flex items-center
                justify-center mb-3'>
                <Icon size={16} className='text-[#2563EB]' />
              </div>
              <p className='text-sm font-medium text-[#0B1B2E] mb-1'>{label}</p>
              <p className='text-xs text-slate-500 leading-relaxed'>{desc}</p>
            </div>
          ))}
        </div>

        {/* Main card */}
        <div className='bg-white border border-slate-200 rounded-xl p-8 shadow-sm'>

          <div className='flex items-center gap-3 mb-6'>
            <div className='flex-1 h-px bg-slate-200' />
            <span className='text-xs text-slate-400'>upload your portfolio</span>
            <div className='flex-1 h-px bg-slate-200' />
          </div>

          <button
            onClick={handleDownloadTemplate}
            className='w-full mb-5 flex items-center justify-center gap-2 py-2.5 rounded-lg
              border border-slate-200 text-slate-500 hover:text-[#0B1B2E] hover:border-slate-300
              text-sm transition-colors bg-white'>
            <Download size={15} />
            Download Portfolio Template (.xlsx)
          </button>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl py-12 px-8 text-center
              cursor-pointer transition-all duration-150 mb-5
              ${isDragActive
                ? 'border-[#2563EB] bg-[#2563EB]/5'
                : file
                ? 'border-[#15803D]/50 bg-[#15803D]/5'
                : 'border-slate-300 hover:border-[#2563EB] hover:bg-[#2563EB]/3'
              }`}>
            <input {...getInputProps()} />
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center
              mx-auto mb-3 ${file ? 'bg-[#15803D]/10' : 'bg-slate-100'}`}>
              <Upload size={22} className={file ? 'text-[#15803D]' : 'text-slate-400'} />
            </div>
            {file ? (
              <div>
                <p className='text-[#15803D] font-medium text-sm'>{file.name}</p>
                <p className='text-slate-500 text-xs mt-1'>Ready to analyze</p>
              </div>
            ) : (
              <div>
                <p className='text-[#0B1B2E] text-sm font-medium'>Drop your portfolio here</p>
                <p className='text-slate-400 text-xs mt-1'>.xlsx file · up to any size</p>
              </div>
            )}
          </div>

          {scenarioTab === 'global' && (
            <>
              <div className='mb-3'>
                <div className='flex items-center justify-between mb-2'>
                  <label className='text-xs text-slate-500 font-medium'>
                    Describe the stress scenario
                  </label>
                  {activeHistorical && (
                    <span className='text-xs text-[#2563EB] flex items-center gap-1'>
                      <Clock size={10} />
                      {activeHistorical} loaded
                    </span>
                  )}
                </div>
                <textarea
                  value={scenario}
                  onChange={(e) => { setScenario(e.target.value); setActiveHistorical(null) }}
                  className='w-full bg-slate-50 border border-slate-200 rounded-lg p-4
                    text-[#0B1B2E] placeholder-slate-400 resize-none focus:outline-none
                    focus:border-[#2563EB] text-sm leading-relaxed transition-all'
                  rows={3}
                  placeholder='e.g. Market crashes 30%, rates rise 2%, tech sector drops 50%'
                />
              </div>

              <div className='flex flex-wrap gap-2 mb-4'>
                {SAMPLE_SCENARIOS.map((s) => (
                  <button key={s} onClick={() => { setScenario(s); setActiveHistorical(null) }}
                    className='text-xs text-slate-500 hover:text-[#0B1B2E] px-3 py-1.5 rounded-full
                      border border-slate-200 hover:border-slate-300 bg-white transition-colors'>
                    {s.split(':')[0].split(',')[0]}
                  </button>
                ))}
              </div>
            </>
          )}

          <div className='mb-5'>
            {/* Tab toggle */}
            <div className='flex items-center gap-1 mb-3 p-1 bg-slate-100 rounded-lg w-fit'>
              <button
                onClick={() => { setScenarioTab('global'); setBrazilScenarioId(null) }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all
                  ${scenarioTab === 'global'
                    ? 'bg-white text-[#0B1B2E] shadow-sm'
                    : 'text-slate-500 hover:text-[#0B1B2E]'}`}
              >
                <Clock size={11} />
                Global scenarios
              </button>
              <button
                onClick={() => { setScenarioTab('brazil'); setActiveHistorical(null) }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all
                  ${scenarioTab === 'brazil'
                    ? 'bg-white text-[#0B1B2E] shadow-sm'
                    : 'text-slate-500 hover:text-[#0B1B2E]'}`}
              >
                🇧🇷 Brazil scenarios
              </button>
            </div>

            {scenarioTab === 'global' && (
              <div className='grid grid-cols-3 md:grid-cols-6 gap-2'>
                {HISTORICAL_SCENARIOS.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => handleHistorical(s)}
                    className={`relative p-2.5 rounded-xl border-l-4 border text-left
                      transition-all duration-150 bg-white hover:shadow-md
                      ${s.accentColor}
                      ${activeHistorical === s.label
                        ? 'border-slate-300 shadow-[0_0_0_1px_rgba(37,99,235,0.15)] ring-1 ring-[#2563EB]/20'
                        : 'border-slate-200 hover:border-slate-300'}`}>
                    <div className='text-xs font-medium text-[#0B1B2E] mb-0.5'>{s.label}</div>
                    <div className='text-xs text-slate-400 mb-1.5'>{s.year}</div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${s.badge}`}>
                      {s.severity}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {scenarioTab === 'brazil' && (
              <div className='space-y-3'>
                <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                  {brazilScenarios.map((s) => {
                    const severityColors = ['', 'text-[#15803D]', 'text-amber-700', 'text-orange-700', 'text-[#B91C1C]', 'text-[#B91C1C]']
                    const severityBg    = ['', 'bg-emerald-50 border border-emerald-200', 'bg-amber-50 border border-amber-200', 'bg-orange-50 border border-orange-200', 'bg-red-50 border border-red-200', 'bg-red-50 border border-red-200']
                    const severityLabel = ['', 'Mild', 'Moderate', 'Significant', 'Severe', 'Extreme']
                    const isActive      = brazilScenarioId === s.id
                    return (
                      <button
                        key={s.id}
                        onClick={() => setBrazilScenarioId(s.id)}
                        className={`p-3 rounded-xl border text-left transition-all bg-white hover:shadow-md
                          ${isActive
                            ? 'border-[#2563EB] ring-1 ring-[#2563EB]/20'
                            : 'border-slate-200 hover:border-slate-300'}`}
                      >
                        <div className='text-xs font-semibold text-[#0B1B2E] mb-0.5 leading-tight'>{s.name}</div>
                        <div className='text-xs text-slate-400 mb-1.5'>{s.year}</div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${severityBg[s.severity]} ${severityColors[s.severity]}`}>
                          {severityLabel[s.severity]}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {brazilScenarioId && (() => {
                  const selected = brazilScenarios.find(s => s.id === brazilScenarioId)
                  return selected ? (
                    <div className='bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-slate-700 leading-relaxed'>
                      <p className='text-amber-700 font-semibold mb-1'>{selected.name}</p>
                      <p>{selected.narrative}</p>
                      <p className='text-slate-500 mt-1'>Recovery: ~{selected.recovery_months} months</p>
                    </div>
                  ) : null
                })()}

                <div className='flex items-center gap-3'>
                  <label className='text-xs text-slate-500'>BRL/USD rate</label>
                  <input
                    type='number'
                    step='0.01'
                    value={brlUsdRate}
                    onChange={(e) => setBrlUsdRate(parseFloat(e.target.value) || 5.20)}
                    className='w-24 text-xs text-right bg-slate-50 border border-slate-200
                      rounded-lg px-3 py-1.5 text-[#0B1B2E] focus:outline-none focus:border-[#2563EB]'
                  />
                  <span className='text-xs text-slate-400'>Results show USD and BRL impact</span>
                </div>
              </div>
            )}
          </div>

          {scenarioTab === 'global' && (
            <div className='mb-5'>
              <ShockBuilder onApply={(s) => { setScenario(s); setActiveHistorical(null) }} />
            </div>
          )}

          {error && (
            <div className='mb-4 flex items-center gap-2 text-[#B91C1C] text-sm
              bg-red-50 border border-red-200 rounded-lg px-4 py-3'>
              <AlertCircle size={15} className='shrink-0' />
              {error}
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={loading}
            variant='solid'
            className='w-full py-4 rounded-full font-medium text-sm transition-opacity duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mx-0'>
            {loading ? (
              <span className='flex items-center justify-center gap-2'>
                <span className='w-4 h-4 border-2 border-white/30 border-t-white
                  rounded-full animate-spin' />
                Running analysis...
              </span>
            ) : (
              <span className='flex items-center justify-center gap-2'>
                {scenarioTab === 'brazil' ? '🇧🇷 Run Brazil Stress Test' : 'Run Stress Test'}
                <ChevronRight size={16} />
              </span>
            )}
          </Button>
        </div>

        <div className='mt-8 text-center text-xs text-slate-400'
          style={{ letterSpacing: '0.16px' }}>
          Powered by Claude AI · Live FRED &amp; SEC data · Institutional stress scenarios
        </div>

      </div>
    </main>
  )
}
