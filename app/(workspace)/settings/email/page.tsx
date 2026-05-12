'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Check } from 'lucide-react'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const TIMES = ['06:00', '08:00', '09:00', '17:00', '18:00', '20:00']

const SECTIONS = [
  { id: 'market_recap',    label: 'Market Recap',         desc: 'Weekly macro summary and index performance.' },
  { id: 'holdings_news',  label: 'Holdings News Roll-up', desc: 'Top 5 news items per household, summarized by AI.' },
  { id: 'drift_alerts',   label: 'Drift Alerts',          desc: 'Portfolios that drifted beyond target bands.' },
  { id: 'planning_nudges',label: 'Planning Nudges',        desc: 'Upcoming check-ins, RMDs, and plan reviews.' },
  { id: 'talking_points', label: 'Three Talking Points',  desc: 'AI-generated conversation starters for each client.' },
]

interface Config {
  enabled: boolean
  day: string
  time: string
  sections: Record<string, boolean>
}

const DEFAULT_CONFIG: Config = {
  enabled: false,
  day: 'Sunday',
  time: '18:00',
  sections: Object.fromEntries(SECTIONS.map(s => [s.id, true])),
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role='switch'
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`relative w-9 h-5 rounded-full transition-colors shrink-0
        ${on ? 'bg-[#3B82F6]' : 'bg-white/10'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white
        shadow transition-transform ${on ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
  )
}

export default function EmailSettingsPage() {
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG)
  const [saved, setSaved] = useState(false)

  const setField = <K extends keyof Config>(k: K, v: Config[K]) =>
    setConfig(c => ({ ...c, [k]: v }))

  const toggleSection = (id: string) =>
    setConfig(c => ({ ...c, sections: { ...c.sections, [id]: !c.sections[id] } }))

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className='max-w-2xl mx-auto px-6 py-10'>

      <Link href='/settings'
        className='flex items-center gap-1.5 text-sm text-gray-500 hover:text-white
          transition-colors mb-6'>
        <ArrowLeft size={14} /> Settings
      </Link>

      <div className='mb-8'>
        <h1 className='text-2xl font-bold tracking-tight mb-1'>Weekly Intelligence Email</h1>
        <p className='text-sm text-gray-500'>
          A branded digest per household, delivered on your schedule.
        </p>
      </div>

      {/* Master enable */}
      <div className='bg-white/[0.025] border border-white/[0.06] rounded-2xl p-5 mb-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-9 h-9 rounded-xl bg-[#8B5CF6]/15 flex items-center justify-center'>
              <Mail size={16} className='text-[#8B5CF6]' />
            </div>
            <div>
              <p className='text-sm font-semibold text-white'>Enable weekly digest</p>
              <p className='text-xs text-gray-500'>Sends to all households with an advisor of record assigned.</p>
            </div>
          </div>
          <Toggle on={config.enabled} onChange={v => setField('enabled', v)} />
        </div>
      </div>

      <div className={`space-y-4 transition-opacity ${config.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>

        {/* Schedule */}
        <div className='bg-white/[0.025] border border-white/[0.06] rounded-2xl p-5'>
          <h2 className='text-sm font-semibold mb-4'>Delivery schedule</h2>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='text-xs text-gray-500 mb-1.5 block'>Day of week</label>
              <div className='flex flex-wrap gap-1.5'>
                {DAYS.map(d => (
                  <button key={d} onClick={() => setField('day', d)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                      config.day === d
                        ? 'bg-[#3B82F6]/15 text-[#3B82F6] border-[#3B82F6]/30'
                        : 'text-gray-500 border-white/10 hover:border-white/20 hover:text-white'}`}>
                    {d.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className='text-xs text-gray-500 mb-1.5 block'>Time (ET)</label>
              <div className='flex flex-wrap gap-1.5'>
                {TIMES.map(t => (
                  <button key={t} onClick={() => setField('time', t)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                      config.time === t
                        ? 'bg-[#3B82F6]/15 text-[#3B82F6] border-[#3B82F6]/30'
                        : 'text-gray-500 border-white/10 hover:border-white/20 hover:text-white'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className='bg-white/[0.025] border border-white/[0.06] rounded-2xl p-5'>
          <h2 className='text-sm font-semibold mb-4'>Email sections</h2>
          <div className='space-y-3'>
            {SECTIONS.map(s => (
              <div key={s.id} className='flex items-center justify-between gap-4'>
                <div>
                  <p className='text-sm text-white'>{s.label}</p>
                  <p className='text-xs text-gray-500'>{s.desc}</p>
                </div>
                <Toggle on={config.sections[s.id]} onChange={() => toggleSection(s.id)} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='mt-6 flex items-center gap-3'>
        <button
          onClick={handleSave}
          className='flex items-center gap-1.5 text-sm font-semibold text-white
            bg-[#3B82F6] hover:bg-[#2563EB] rounded-lg px-4 py-2 transition-colors'>
          {saved ? <><Check size={14} /> Saved</> : 'Save settings'}
        </button>
        {config.enabled && (
          <p className='text-xs text-gray-500'>
            Next send: {config.day}s at {config.time} ET
          </p>
        )}
      </div>

      <p className='text-[10px] text-gray-600 mt-4'>
        AI-assisted — all digest content carries an "AI-generated" label. Advisors can review before delivery is enabled. Clients can opt out per household.
      </p>
    </div>
  )
}
