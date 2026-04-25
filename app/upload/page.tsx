'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { runStressTest } from '@/lib/api'
import {
  Upload, AlertCircle, TrendingDown, Download,
  Shield, BarChart3, Brain, Activity, ChevronRight, Clock, ArrowLeft, Calendar
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
    color: 'from-[#494fdf]/20 to-[#3d43d4]/10 border-[#494fdf]/30 hover:border-[#494fdf]/50',
    badge: 'bg-[#494fdf]/20 text-[#494fdf]',
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
    <main className='min-h-screen bg-[#191c1f] text-white'>
      <div className='relative max-w-6xl mx-auto px-6 py-12'>

        {/* Header */}
        <div className='flex items-center justify-between mb-16'>
          <div className='flex items-center gap-3'>
            <Link href='/' className='flex items-center gap-2 text-[#8d969e]
              hover:text-white transition-colors mr-1'>
              <ArrowLeft size={14} />
            </Link>
            <div className='w-9 h-9 bg-[#494fdf] rounded-xl flex items-center justify-center'>
              <TrendingDown size={18} className='text-white' />
            </div>
            <span className='font-medium text-lg'>PortfolioStress</span>
          </div>
          <div className='flex items-center gap-2'>
            <Link href='/clients'
              className='flex items-center gap-2 px-4 py-2 rounded-full
                bg-white/5 hover:opacity-85 border border-white/10
                text-sm text-gray-300 transition-opacity'>
              <Calendar size={14} className='text-[#00a87e]' />
              Annual Review
            </Link>
            <Link href='/compare'
              className='flex items-center gap-2 px-4 py-2 rounded-full
                bg-white/5 hover:opacity-85 border border-white/10
                text-sm text-gray-300 transition-opacity'>
              <Shield size={14} className='text-[#b09000]' />
              Compare Portfolios
            </Link>
            <Link href='/intelligence'
              className='flex items-center gap-2 px-4 py-2 rounded-full
                bg-white/5 hover:opacity-85 border border-white/10
                text-sm text-gray-300 transition-opacity'>
              <Brain size={14} className='text-[#494fdf]' />
              Custom Portfolio
            </Link>
          </div>
        </div>

        {/* Hero */}
        <div className='text-center mb-16'>
          <div className='inline-flex items-center gap-2 px-5 py-2 rounded-full
            bg-[#494fdf]/10 border border-[#494fdf]/20 text-[#494fdf] text-xs
            font-medium mb-6'>
            <span className='w-1.5 h-1.5 bg-[#494fdf] rounded-full' />
            Institutional-grade portfolio risk analysis
          </div>
          <h1 className='font-medium text-white mb-6'
            style={{ fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: '1.05', letterSpacing: '-0.8px' }}>
            Know your risk<br />before it knows you
          </h1>
          <p className='text-[#8d969e] text-lg max-w-xl mx-auto leading-relaxed'
            style={{ letterSpacing: '0.16px' }}>
            Upload any portfolio. Describe a scenario. Get institutional-grade
            stress testing, factor analysis, and AI-powered insights in seconds.
          </p>
        </div>

        {/* Feature pills */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mb-12'>
          {FEATURES.map(({ icon: Icon, label, desc }) => (
            <div key={label}
              className='bg-white/4 hover:bg-white/6 border border-white/10
                rounded-2xl p-4 transition-all group'>
              <div className='w-8 h-8 bg-[#494fdf]/20 rounded-lg flex items-center
                justify-center mb-3 group-hover:bg-[#494fdf]/30 transition-all'>
                <Icon size={16} className='text-[#494fdf]' />
              </div>
              <p className='text-sm font-medium text-white mb-1'>{label}</p>
              <p className='text-xs text-[#8d969e] leading-relaxed'>{desc}</p>
            </div>
          ))}
        </div>

        {/* Main card */}
        <div className='bg-white/4 border border-white/10 rounded-3xl p-8'>

          <div className='flex items-center gap-3 mb-6'>
            <div className='flex-1 h-px bg-white/8' />
            <span className='text-xs text-[#8d969e]'>upload your portfolio</span>
            <div className='flex-1 h-px bg-white/8' />
          </div>

          <button
            onClick={handleDownloadTemplate}
            className='w-full mb-5 flex items-center justify-center gap-2
              py-2.5 rounded-full border border-white/10 hover:border-white/20
              text-[#8d969e] hover:text-gray-200 text-sm transition-all'>
            <Download size={15} />
            Download Portfolio Template (.xlsx)
          </button>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center
              cursor-pointer transition-all mb-5
              ${isDragActive
                ? 'border-[#494fdf] bg-[#494fdf]/10'
                : file
                ? 'border-[#00a87e]/50 bg-[#00a87e]/5'
                : 'border-white/10 hover:border-white/20 hover:bg-white/2'
              }`}>
            <input {...getInputProps()} />
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center
              mx-auto mb-3 ${file ? 'bg-[#00a87e]/20' : 'bg-white/5'}`}>
              <Upload size={22} className={file ? 'text-[#00a87e]' : 'text-gray-500'} />
            </div>
            {file ? (
              <div>
                <p className='text-[#00a87e] font-medium text-sm'>{file.name}</p>
                <p className='text-[#8d969e] text-xs mt-1'>Ready to analyze</p>
              </div>
            ) : (
              <div>
                <p className='text-gray-300 text-sm font-medium'>Drop your portfolio here</p>
                <p className='text-[#8d969e] text-xs mt-1'>.xlsx file · up to any size</p>
              </div>
            )}
          </div>

          <div className='mb-3'>
            <div className='flex items-center justify-between mb-2'>
              <label className='text-xs text-[#8d969e] font-medium'>
                Describe the stress scenario
              </label>
              {activeHistorical && (
                <span className='text-xs text-[#494fdf] flex items-center gap-1'>
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
                focus:border-[#494fdf]/50 text-sm transition-all'
              rows={3}
              placeholder='e.g. Market crashes 30%, rates rise 2%, tech sector drops 50%'
            />
          </div>

          <div className='flex flex-wrap gap-2 mb-4'>
            {SAMPLE_SCENARIOS.map((s) => (
              <button key={s} onClick={() => { setScenario(s); setActiveHistorical(null) }}
                className='text-xs bg-white/3 hover:bg-white/8 border border-white/8
                  hover:border-white/15 text-[#8d969e] hover:text-gray-200
                  px-3 py-1.5 rounded-full transition-all'>
                {s.split(':')[0].split(',')[0]}
              </button>
            ))}
          </div>

          <div className='mb-5'>
            <div className='flex items-center gap-2 mb-3'>
              <Clock size={13} className='text-[#8d969e]' />
              <span className='text-xs text-[#8d969e] font-medium'>Historical crisis scenarios</span>
            </div>
            <div className='grid grid-cols-3 md:grid-cols-6 gap-2'>
              {HISTORICAL_SCENARIOS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => handleHistorical(s)}
                  className={`p-2.5 rounded-xl border bg-gradient-to-br text-left
                    transition-all ${s.color}
                    ${activeHistorical === s.label ? 'ring-1 ring-white/20' : ''}`}>
                  <div className='text-xs font-medium text-white mb-0.5'>{s.label}</div>
                  <div className='text-xs text-[#8d969e] mb-1.5'>{s.year}</div>
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
            <div className='mb-4 flex items-center gap-2 text-[#e23b4a] text-sm
              bg-[#e23b4a]/10 border border-[#e23b4a]/20 rounded-xl px-4 py-3'>
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className='w-full py-4 rounded-full font-medium text-sm
              transition-opacity duration-150 active:scale-[0.98]
              disabled:opacity-50 disabled:cursor-not-allowed
              bg-[#494fdf] hover:opacity-85'>
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

        <div className='mt-8 text-center text-xs text-[#505a63]'
          style={{ letterSpacing: '0.16px' }}>
          Powered by Claude AI · Live FRED &amp; SEC data · Institutional stress scenarios
        </div>

      </div>
    </main>
  )
}
