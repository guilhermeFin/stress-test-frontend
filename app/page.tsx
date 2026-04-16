'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { runStressTest } from '@/lib/api'
import { Upload, AlertCircle, TrendingDown } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [scenario, setScenario] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
    } catch (err) {
      setError('Something went wrong. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const SAMPLE_SCENARIOS = [
    'Market crashes 25%, interest rates rise 2%, tech drops 40%',
    '2008-style crisis: equities fall 50%, credit markets freeze',
    'Stagflation: inflation at 8%, GDP contracts 3%, rates at 7%',
    'China conflict: Asian markets crash 35%, commodities surge 20%',
  ]

  return (
    <main className='min-h-screen bg-gray-950 text-white p-8'>
      <div className='max-w-2xl mx-auto'>
        <div className='flex items-center gap-3 mb-2'>
          <TrendingDown className='text-blue-400' size={32} />
          <h1 className='text-3xl font-bold'>Portfolio Stress Test</h1>
        </div>
        <p className='text-gray-400 mb-10'>
          Upload a portfolio, describe a market scenario, get instant analysis.
        </p>

        <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-10
          text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-400 bg-blue-900/20' : 'border-gray-700 hover:border-gray-500'}
          ${file ? 'border-green-500 bg-green-900/10' : ''}
        `}>
          <input {...getInputProps()} />
          <Upload className='mx-auto mb-3 text-gray-500' size={40} />
          {file ? (
            <p className='text-green-400 font-medium'>{file.name} loaded</p>
          ) : (
            <p className='text-gray-400'>Drag and drop your portfolio .xlsx here,
              <br />or click to browse</p>
          )}
        </div>

        <div className='mt-6'>
          <label className='block text-sm text-gray-400 mb-2'>
            Describe the stress scenario in plain English
          </label>
          <textarea
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            className='w-full bg-gray-900 border border-gray-700 rounded-xl p-4
              text-white placeholder-gray-600 resize-none focus:outline-none
              focus:border-blue-500'
            rows={3}
            placeholder='e.g. Market crashes 30%, rates rise 2%, tech sector drops 50%'
          />
        </div>

        <div className='mt-3 flex flex-wrap gap-2'>
          {SAMPLE_SCENARIOS.map((s) => (
            <button key={s} onClick={() => setScenario(s)}
              className='text-xs bg-gray-800 hover:bg-gray-700 text-gray-300
                px-3 py-1.5 rounded-full transition-colors'>
              {s.split(':')[0].split(',')[0]}
            </button>
          ))}
        </div>

        {error && (
          <div className='mt-4 flex items-center gap-2 text-red-400 text-sm'>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className='mt-6 w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700
            text-white font-semibold py-4 rounded-xl transition-colors text-lg'>
          {loading ? 'Running analysis...' : 'Run Stress Test'}
        </button>
      </div>
    </main>
  )
}