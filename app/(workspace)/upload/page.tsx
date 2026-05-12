'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
    color: 'from-red-600/20 to-red-800/10 border-red-700/30 hover:border-red-600/50',
    badge: 'bg-red-900/50 text-red-400',
    severity: 'Extreme',
    text: '2008 Global Financial Crisis: market crashes 57%, credit markets freeze, spreads widen 300bps, financials drop 80%, real estate collapses 65%',
  },
  {
    label: 'COVID Crash',
    year: '2020',
    color: 'from-orange-600/20 to-orange-800/10 border-orange-700/30 hover:border-orange-600/50',
    badge: 'bg-orange-900/50 text-orange-400',
    severity: 'Severe',
    text: 'COVID-19 crash: market drops 34% in 5 weeks, energy sector collapses 55%, consumer discretionary falls 40%, rates cut to zero, gold surges 15%',
  },
  {
    label: 'Dot-Com Bust',
    year: '2000',
    color: 'from-purple-600/20 to-purple-800/10 border-purple-700/30 hover:border-purple-600/50',
    badge: 'bg-purple-900/50 text-purple-400',
    severity: 'Extreme',
    text: 'Dot-com bust: tech sector crashes 78%, communication services drops 65%, market falls 49% over 2 years, rates fall 2.5%',
  },
  {
    label: '1987 Black Monday',
    year: '1987',
    color: 'from-blue-600/20 to-blue-800/10 border-blue-700/30 hover:border-blue-600/50',
    badge: 'bg-yellow-900/50 text-yellow-400',
    severity: 'Extreme',
    text: 'Black Monday 1987: market crashes 22% in a single day, volatility spikes 300%, liquidity evaporates, portfolio insurance fails',
  },
  {
    label: '2022 Rate Shock',
    year: '2022',
    color: 'from-[#3B82F6]/20 to-[#3B82F6]/5 border-[#3B82F6]/30 hover:border-[#3B82F6]/50',
    badge: 'bg-[#3B82F6]/20 text-[#3B82F6]',
    severity: 'Severe',
    text: '2022 rate shock: Fed raises rates 425bps, bonds crash 15%, tech drops 35%, inflation hits 9%, growth stocks fall 50%',
  },
  {
    label: 'Stagflation',
    year: '1970s',
    color: 'from-green-600/20 to-green-800/10 border-green-700/30 hover:border-green-600/50',
    badge: 'bg-green-900/50 text-green-400',
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
      } catch {
        setError('Brazil stress analysis failed. Please check your file format and try again.')
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
      } catch {
        setError('Analysis failed. Please check your file format and try again.')
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
    <main className='min-h-screen text-white relative'>
      {/* Full-screen loading overlay */}
      {loading && (
        <div className='absolute inset-0 z-50 flex flex-col items-center justify-center
          bg-[#0A0F1E]/90 backdrop-blur-sm'>
          <LumaSpin size={65} />
          <p className='mt-6 text-sm text-gray-400 font-medium'>Running analysis…</p>
          <p className='mt-1 text-xs text-gray-600'>This usually takes 15–45 seconds</p>
        </div>
      )}
      <div className='relative max-w-6xl mx-auto px-6 py-12'>


        {/* Hero */}
        <div className='text-center mb-16'>
          <div className='inline-flex items-center gap-2 px-5 py-2 rounded-full
            bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-xs
            font-medium mb-6'>
            <span className='w-1.5 h-1.5 bg-[#3B82F6] rounded-full' />
            Institutional-grade portfolio risk analysis
          </div>
          <h1 className='font-medium text-white mb-6'
            style={{ fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: '1.05', letterSpacing: '-0.8px' }}>
            Know your risk<br />before it knows you
          </h1>
          <p className='text-gray-400 text-lg max-w-xl mx-auto leading-relaxed'
            style={{ letterSpacing: '0.16px' }}>
            Upload any portfolio. Describe a scenario. Get institutional-grade
            stress testing, factor analysis, and AI-powered insights in seconds.
          </p>
        </div>

        {/* Feature pills */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mb-12'>
          {FEATURES.map(({ icon: Icon, label, desc }) => (
            <div key={label}
              className='bg-[#0A0F1E]/80 backdrop-blur-md border border-white/10
                rounded-2xl p-4 transition-all duration-500 group
                hover:shadow-[0_0_40px_rgba(59,130,246,0.12)] hover:border-white/15'>
              <div className='w-8 h-8 bg-[#3B82F6]/20 rounded-lg flex items-center
                justify-center mb-3 group-hover:bg-[#3B82F6]/30 transition-all'>
                <Icon size={16} className='text-[#3B82F6]' />
              </div>
              <p className='text-sm font-medium text-white mb-1'>{label}</p>
              <p className='text-xs text-gray-400 leading-relaxed'>{desc}</p>
            </div>
          ))}
        </div>

        {/* Main card */}
        <div className='bg-[#0A0F1E]/80 backdrop-blur-md border border-white/10 rounded-3xl p-8
          shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]
          hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] transition-shadow duration-500'>

          <div className='flex items-center gap-3 mb-6'>
            <div className='flex-1 h-px bg-white/8' />
            <span className='text-xs text-gray-400'>upload your portfolio</span>
            <div className='flex-1 h-px bg-white/8' />
          </div>

          <Button
            onClick={handleDownloadTemplate}
            variant='default'
            className='w-full mb-5 flex items-center justify-center gap-2 py-2.5 rounded-full text-gray-400 hover:text-gray-200 text-sm transition-all mx-0'>
            <Download size={15} />
            Download Portfolio Template (.xlsx)
          </Button>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl py-12 px-8 text-center
              cursor-pointer transition-all duration-300 mb-5
              ${isDragActive
                ? 'border-blue-500/60 bg-blue-500/5'
                : file
                ? 'border-green-500/50 bg-green-600/5'
                : 'border-white/15 hover:border-blue-500/60 hover:bg-blue-500/5'
              }`}>
            <input {...getInputProps()} />
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center
              mx-auto mb-3 ${file ? 'bg-green-600/20' : 'bg-white/5'}`}>
              <Upload size={22} className={file ? 'text-green-400' : 'text-gray-500'} />
            </div>
            {file ? (
              <div>
                <p className='text-green-400 font-medium text-sm'>{file.name}</p>
                <p className='text-gray-400 text-xs mt-1'>Ready to analyze</p>
              </div>
            ) : (
              <div>
                <p className='text-gray-300 text-sm font-medium'>Drop your portfolio here</p>
                <p className='text-gray-400 text-xs mt-1'>.xlsx file · up to any size</p>
              </div>
            )}
          </div>

          {scenarioTab === 'global' && (
            <>
              <div className='mb-3'>
                <div className='flex items-center justify-between mb-2'>
                  <label className='text-xs text-gray-400 font-medium'>
                    Describe the stress scenario
                  </label>
                  {activeHistorical && (
                    <span className='text-xs text-[#3B82F6] flex items-center gap-1'>
                      <Clock size={10} />
                      {activeHistorical} loaded
                    </span>
                  )}
                </div>
                <textarea
                  value={scenario}
                  onChange={(e) => { setScenario(e.target.value); setActiveHistorical(null) }}
                  className='w-full bg-[#0A0F1E]/60 backdrop-blur-sm border border-white/10 rounded-xl p-4
                    text-white placeholder-gray-600 resize-none focus:outline-none
                    focus:border-blue-500 text-base leading-relaxed transition-all'
                  rows={3}
                  placeholder='e.g. Market crashes 30%, rates rise 2%, tech sector drops 50%'
                />
              </div>

              <div className='flex flex-wrap gap-2 mb-4'>
                {SAMPLE_SCENARIOS.map((s) => (
                  <Button key={s} onClick={() => { setScenario(s); setActiveHistorical(null) }}
                    variant='ghost'
                    className='text-xs text-gray-400 hover:text-gray-200 px-3 py-1.5 rounded-full mx-0'>
                    {s.split(':')[0].split(',')[0]}
                  </Button>
                ))}
              </div>
            </>
          )}

          <div className='mb-5'>
            {/* Tab toggle */}
            <div className='flex items-center gap-1 mb-3'>
              <Button
                onClick={() => { setScenarioTab('global'); setBrazilScenarioId(null) }}
                variant='ghost'
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all mx-0
                  ${scenarioTab === 'global'
                    ? 'bg-white/10 text-white'
                    : 'text-gray-500 hover:text-gray-300'}`}
              >
                <Clock size={11} />
                Global scenarios
              </Button>
              <Button
                onClick={() => { setScenarioTab('brazil'); setActiveHistorical(null) }}
                variant='ghost'
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all mx-0
                  ${scenarioTab === 'brazil'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'text-gray-500 hover:text-gray-300'}`}
              >
                🇧🇷 Brazil scenarios
              </Button>
            </div>

            {scenarioTab === 'global' && (
              <div className='grid grid-cols-3 md:grid-cols-6 gap-2'>
                {HISTORICAL_SCENARIOS.map((s) => (
                  <Button
                    key={s.label}
                    onClick={() => handleHistorical(s)}
                    variant='ghost'
                    neon={false}
                    className={`relative overflow-hidden p-2.5 rounded-xl border bg-gradient-to-br
                      backdrop-blur-md text-left transition-all duration-300 mx-0
                      after:absolute after:bottom-0 after:left-1/4 after:right-1/4 after:h-px
                      after:bg-blue-500 after:scale-x-0 hover:after:scale-x-100
                      after:transition-transform after:duration-300
                      ${s.color}
                      ${activeHistorical === s.label ? 'ring-1 ring-white/20' : ''}`}>
                    <div className='text-xs font-medium text-white mb-0.5'>{s.label}</div>
                    <div className='text-xs text-gray-400 mb-1.5'>{s.year}</div>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${s.badge}`}>
                      {s.severity}
                    </span>
                  </Button>
                ))}
              </div>
            )}

            {scenarioTab === 'brazil' && (
              <div className='space-y-3'>
                <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                  {brazilScenarios.map((s) => {
                    const severityColors = ['', 'text-green-400', 'text-yellow-300', 'text-orange-400', 'text-red-400', 'text-red-500']
                    const severityBg    = ['', 'bg-green-900/40', 'bg-yellow-900/40', 'bg-orange-900/40', 'bg-red-900/40', 'bg-red-900/60']
                    const severityLabel = ['', 'Mild', 'Moderate', 'Significant', 'Severe', 'Extreme']
                    const isActive      = brazilScenarioId === s.id
                    return (
                      <Button
                        key={s.id}
                        onClick={() => setBrazilScenarioId(s.id)}
                        variant='ghost'
                        neon={false}
                        className={`p-3 rounded-xl border text-left transition-all mx-0
                          bg-gradient-to-br from-blue-600/10 to-blue-900/5
                          ${isActive
                            ? 'border-blue-500/60 ring-1 ring-blue-500/30'
                            : 'border-blue-700/20 hover:border-blue-600/40'}`}
                      >
                        <div className='text-xs font-semibold text-white mb-0.5 leading-tight'>{s.name}</div>
                        <div className='text-xs text-gray-400 mb-1.5'>{s.year}</div>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${severityBg[s.severity]} ${severityColors[s.severity]}`}>
                          {severityLabel[s.severity]}
                        </span>
                      </Button>
                    )
                  })}
                </div>

                {brazilScenarioId && (() => {
                  const selected = brazilScenarios.find(s => s.id === brazilScenarioId)
                  return selected ? (
                    <div className='bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3 text-xs text-slate-300 leading-relaxed'>
                      <p className='text-yellow-400 font-semibold mb-1'>{selected.name}</p>
                      <p>{selected.narrative}</p>
                      <p className='text-slate-500 mt-1'>Recovery: ~{selected.recovery_months} months</p>
                    </div>
                  ) : null
                })()}

                <div className='flex items-center gap-3'>
                  <label className='text-xs text-gray-400'>BRL/USD rate</label>
                  <input
                    type='number'
                    step='0.01'
                    value={brlUsdRate}
                    onChange={(e) => setBrlUsdRate(parseFloat(e.target.value) || 5.20)}
                    className='w-24 text-xs text-right bg-white/5 border border-white/15 rounded-lg px-3 py-1.5 text-white'
                  />
                  <span className='text-xs text-gray-500'>Results show USD and BRL impact</span>
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
            <div className='mb-4 flex items-center gap-2 text-red-400 text-sm
              bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3'>
              <AlertCircle size={15} />
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

        <div className='mt-8 text-center text-xs text-gray-600'
          style={{ letterSpacing: '0.16px' }}>
          Powered by Claude AI · Live FRED &amp; SEC data · Institutional stress scenarios
        </div>

      </div>
    </main>
  )
}

