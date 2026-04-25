'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { runStressTest } from '@/lib/api'
import {
  Upload, AlertCircle, TrendingDown, Download,
  Shield, BarChart3, Brain, Activity, ChevronRight, Clock, ArrowLeft
} from 'lucide-react'
import ShockBuilder from '@/components/ShockBuilder'
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
    color: 'from-yellow-600/20 to-yellow-800/10 border-yellow-700/30 hover:border-yellow-600/50',
    badge: 'bg-yellow-900/50 text-yellow-400',
    severity: 'Extreme',
    text: 'Black Monday 1987: market crashes 22% in a single day, volatility spikes 300%, liquidity evaporates, portfolio insurance fails',
  },
  {
    label: '2022 Rate Shock',
    year: '2022',
    color: 'from-blue-600/20 to-blue-800/10 border-blue-700/30 hover:border-blue-600/50',
    badge: 'bg-blue-900/50 text-blue-400',
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] },
    onDrop: (files) => setFile(files[0]),
    maxFiles: 1,
  })

  const handleSubmit = async () => {
    if (!file || !scenario) {
      setError('Please upload a portfolio file and describe a scenario.')
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
    <main className='min-h-screen bg-[#0A0F1E] text-white'>

      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px]
          bg-blue-950/25 rounded-full blur-3xl' />
      </div>

      <div className='relative max-w-6xl mx-auto px-6 py-12'>

        {/* Header */}
        <div className='flex items-center justify-between mb-16'>
          <div className='flex items-center gap-3'>
            <Link href='/' className='flex items-center gap-2 text-gray-400
              hover:text-white transition-colors mr-1'>
              <ArrowLeft size={14} />
            </Link>
            <div className='w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center'>
              <TrendingDown size={18} className='text-white' />
            </div>
            <span className='font-bold text-lg tracking-tight'>PortfolioStress</span>
          </div>
          <div className='flex items-center gap-2'>
            <Link href='/household'
              className='flex items-center gap-2 px-4 py-2 rounded-xl
                bg-white/5 hover:bg-white/10 border border-white/10
                text-sm text-gray-300 transition-all'>
              <Brain size={14} className='text-blue-400' />
              Household View
            </Link>
            <Link href='/compare'
              className='flex items-center gap-2 px-4 py-2 rounded-xl
                bg-white/5 hover:bg-white/10 border border-white/10
                text-sm text-gray-300 transition-all'>
              <Shield size={14} className='text-purple-400' />
              Compare Portfolios
            </Link>
            <Link href='/intelligence'
              className='flex items-center gap-2 px-4 py-2 rounded-xl
                bg-white/5 hover:bg-white/10 border border-white/10
                text-sm text-gray-300 transition-all'>
              <Brain size={14} className='text-blue-400' />
              Custom Portfolio
            </Link>
          </div>
        </div>

        {/* Hero */}
        <div className='text-center mb-16'>
          <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs
            font-medium mb-6'>
            <span className='w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse' />
            Institutional-grade portfolio risk analysis
          </div>
          <h1 className='text-5xl md:text-6xl font-bold tracking-tight mb-6
            bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent'>
            Know your risk<br />before it knows you
          </h1>
          <p className='text-gray-400 text-lg max-w-xl mx-auto leading-relaxed'>
            Upload any portfolio. Describe a scenario. Get institutional-grade
            stress testing, factor analysis, and AI-powered insights in seconds.
          </p>
        </div>

        {/* Feature pills */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mb-12'>
          {FEATURES.map(({ icon: Icon, label, desc }) => (
            <div key={label}
              className='bg-white/3 hover:bg-white/6 border border-white/8
                rounded-2xl p-4 transition-all group'>
              <div className='w-8 h-8 bg-blue-600/20 rounded-lg flex items-center
                justify-center mb-3 group-hover:bg-blue-600/30 transition-all'>
                <Icon size={16} className='text-blue-400' />
              </div>
              <p className='text-sm font-medium text-white mb-1'>{label}</p>
              <p className='text-xs text-gray-500 leading-relaxed'>{desc}</p>
            </div>
          ))}
        </div>

        {/* Main card */}
        <div className='bg-white/3 border border-white/8 rounded-3xl p-8 backdrop-blur-sm'>

          <div className='flex items-center gap-3 mb-6'>
            <div className='flex-1 h-px bg-white/8' />
            <span className='text-xs text-gray-500'>upload your portfolio</span>
            <div className='flex-1 h-px bg-white/8' />
          </div>

          <button
            onClick={handleDownloadTemplate}
            className='w-full mb-5 flex items-center justify-center gap-2
              py-2.5 rounded-xl border border-white/10 hover:border-white/20
              text-gray-400 hover:text-gray-200 text-sm transition-all'>
            <Download size={15} />
            Download Portfolio Template (.xlsx)
          </button>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center
              cursor-pointer transition-all mb-5
              ${isDragActive
                ? 'border-blue-500 bg-blue-500/10'
                : file
                ? 'border-green-500/50 bg-green-500/5'
                : 'border-white/10 hover:border-white/20 hover:bg-white/2'
              }`}>
            <input {...getInputProps()} />
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center
              mx-auto mb-3 ${file ? 'bg-green-500/20' : 'bg-white/5'}`}>
              <Upload size={22} className={file ? 'text-green-400' : 'text-gray-500'} />
            </div>
            {file ? (
              <div>
                <p className='text-green-400 font-medium text-sm'>{file.name}</p>
                <p className='text-gray-500 text-xs mt-1'>Ready to analyze</p>
              </div>
            ) : (
              <div>
                <p className='text-gray-300 text-sm font-medium'>Drop your portfolio here</p>
                <p className='text-gray-500 text-xs mt-1'>.xlsx file · up to any size</p>
              </div>
            )}
          </div>

          <div className='mb-3'>
            <div className='flex items-center justify-between mb-2'>
              <label className='text-xs text-gray-400 font-medium'>
                Describe the stress scenario
              </label>
              {activeHistorical && (
                <span className='text-xs text-blue-400 flex items-center gap-1'>
                  <Clock size={10} />
                  {activeHistorical} loaded
                </span>
              )}
            </div>
            <textarea
              value={scenario}
              onChange={(e) => { setScenario(e.target.value); setActiveHistorical(null) }}
              className='w-full bg-white/3 border border-white/10 rounded-xl p-4
                text-white placeholder-gray-600 resize-none focus:outline-none
                focus:border-blue-500/50 text-sm transition-all'
              rows={3}
              placeholder='e.g. Market crashes 30%, rates rise 2%, tech sector drops 50%'
            />
          </div>

          <div className='flex flex-wrap gap-2 mb-4'>
            {SAMPLE_SCENARIOS.map((s) => (
              <button key={s} onClick={() => { setScenario(s); setActiveHistorical(null) }}
                className='text-xs bg-white/3 hover:bg-white/8 border border-white/8
                  hover:border-white/15 text-gray-400 hover:text-gray-200
                  px-3 py-1.5 rounded-lg transition-all'>
                {s.split(':')[0].split(',')[0]}
              </button>
            ))}
          </div>

          <div className='mb-5'>
            <div className='flex items-center gap-2 mb-3'>
              <Clock size={13} className='text-gray-500' />
              <span className='text-xs text-gray-500 font-medium'>Historical crisis scenarios</span>
            </div>
            <div className='grid grid-cols-3 md:grid-cols-6 gap-2'>
              {HISTORICAL_SCENARIOS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => handleHistorical(s)}
                  className={`p-2.5 rounded-xl border bg-gradient-to-br text-left
                    transition-all ${s.color}
                    ${activeHistorical === s.label ? 'ring-1 ring-white/20' : ''}`}>
                  <div className='text-xs font-bold text-white mb-0.5'>{s.label}</div>
                  <div className='text-xs text-gray-500 mb-1.5'>{s.year}</div>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${s.badge}`}>
                    {s.severity}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className='mb-5'>
            <ShockBuilder onApply={(s) => { setScenario(s); setActiveHistorical(null) }} />
          </div>

          {error && (
            <div className='mb-4 flex items-center gap-2 text-red-400 text-sm
              bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3'>
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className='w-full py-4 rounded-2xl font-semibold text-sm
              transition-all duration-150 active:scale-[0.98]
              disabled:opacity-50 disabled:cursor-not-allowed
              bg-blue-600 hover:bg-blue-500 active:bg-blue-700
              shadow-lg shadow-blue-900/40'>
            {loading ? (
              <span className='flex items-center justify-center gap-2'>
                <span className='w-4 h-4 border-2 border-white/30 border-t-white
                  rounded-full animate-spin' />
                Running analysis...
              </span>
            ) : (
              <span className='flex items-center justify-center gap-2'>
                Run Stress Test
                <ChevronRight size={16} />
              </span>
            )}
          </button>
        </div>

        <div className='mt-8 text-center text-xs text-gray-600'>
          Powered by Claude AI · Live FRED & SEC data · Institutional stress scenarios
        </div>

      </div>
    </main>
  )
}
