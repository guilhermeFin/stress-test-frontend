'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Star, AlertTriangle } from 'lucide-react'
import { MOCK_MANAGERS, type Manager, type ManagerRating } from '@/lib/research'

const RATING_CONFIG: Record<ManagerRating, { label: string; color: string }> = {
  buy:   { label: 'Buy',   color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  hold:  { label: 'Hold',  color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  watch: { label: 'Watch', color: 'text-orange-400 bg-orange-400/10 border-orange-400/20' },
  sell:  { label: 'Sell',  color: 'text-red-400 bg-red-400/10 border-red-400/20' },
}

function ReturnCell({ value, benchmark }: { value: number; benchmark?: number }) {
  const color = value >= 10 ? 'text-emerald-400' : value >= 5 ? 'text-white' : value >= 0 ? 'text-amber-400' : 'text-red-400'
  return (
    <span className={`text-sm font-semibold tabular-nums ${color}`}>
      {value >= 0 ? '+' : ''}{value.toFixed(1)}%
    </span>
  )
}

const BLANK: Omit<Manager, 'id' | 'last_reviewed'> = {
  name: '', firm: '', strategy: '', asset_class: 'US Equity',
  aum_bn: 0, inception_year: 2010, expense_ratio: 0.75,
  return_1y: 0, return_3y: 0, return_5y: 0,
  sharpe_3y: 0, max_drawdown: 0,
  benchmark: 'Russell 1000', rating: 'hold', notes: '',
}

export default function ManagersPage() {
  const [managers, setManagers] = useState<Manager[]>(MOCK_MANAGERS)
  const [showAdd, setShowAdd]   = useState(false)
  const [form, setForm]         = useState({ ...BLANK })
  const [editNotes, setEditNotes] = useState<string | null>(null)
  const [notesMap, setNotesMap] = useState<Record<string, string>>({})

  const setField = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }))

  const addManager = (e: React.FormEvent) => {
    e.preventDefault()
    setManagers(ms => [{ ...form, id: crypto.randomUUID(), last_reviewed: new Date().toISOString().slice(0, 10) }, ...ms])
    setForm({ ...BLANK })
    setShowAdd(false)
  }

  const removeManager = (id: string) => setManagers(ms => ms.filter(m => m.id !== id))

  const cycleRating = (id: string) => {
    const order: ManagerRating[] = ['buy', 'hold', 'watch', 'sell']
    setManagers(ms => ms.map(m => {
      if (m.id !== id) return m
      const next = order[(order.indexOf(m.rating) + 1) % order.length]
      return { ...m, rating: next }
    }))
  }

  return (
    <div className='max-w-6xl mx-auto px-6 py-10'>

      <Link href='/research'
        className='flex items-center gap-1.5 text-sm text-gray-500 hover:text-white
          transition-colors mb-6'>
        <ArrowLeft size={14} /> Research
      </Link>

      <div className='flex items-start justify-between mb-8'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight mb-1'>Manager Due Diligence</h1>
          <p className='text-sm text-gray-500'>{managers.length} managers under evaluation</p>
        </div>
        <button onClick={() => setShowAdd(v => !v)}
          className='flex items-center gap-1.5 text-sm font-semibold text-white
            bg-[#3B82F6] hover:bg-[#2563EB] rounded-lg px-4 py-2 transition-colors'>
          <Plus size={14} /> Add manager
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <form onSubmit={addManager}
          className='bg-white/[0.02] border border-[#3B82F6]/20 rounded-2xl p-5 mb-6'>
          <h3 className='text-sm font-semibold mb-4'>New manager</h3>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mb-3'>
            {([
              { key: 'name',         label: 'Fund name',        type: 'text' },
              { key: 'firm',         label: 'Management firm',  type: 'text' },
              { key: 'strategy',     label: 'Strategy',         type: 'text' },
              { key: 'benchmark',    label: 'Benchmark',        type: 'text' },
              { key: 'aum_bn',       label: 'AUM ($B)',         type: 'number', step: 0.1 },
              { key: 'inception_year', label: 'Inception year', type: 'number', step: 1 },
              { key: 'expense_ratio',  label: 'Expense ratio',  type: 'number', step: 0.01 },
              { key: 'return_1y',    label: '1Y return (%)',    type: 'number', step: 0.1 },
              { key: 'return_3y',    label: '3Y return (%)',    type: 'number', step: 0.1 },
              { key: 'return_5y',    label: '5Y return (%)',    type: 'number', step: 0.1 },
              { key: 'sharpe_3y',    label: '3Y Sharpe',        type: 'number', step: 0.01 },
              { key: 'max_drawdown', label: 'Max drawdown (%)', type: 'number', step: 0.1 },
            ] as { key: keyof typeof form; label: string; type: string; step?: number }[]).map(({ key, label, type, step }) => (
              <div key={key}>
                <label className='text-xs text-gray-500 mb-1 block'>{label}</label>
                <input type={type} step={step} value={(form as Record<string, unknown>)[key] as string}
                  onChange={setField(key)} required
                  className='w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5
                    text-sm text-white focus:outline-none focus:border-white/20' />
              </div>
            ))}
          </div>
          <div className='flex gap-2'>
            <button type='submit'
              className='bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-semibold
                rounded-lg px-4 py-2 transition-colors'>
              Add
            </button>
            <button type='button' onClick={() => setShowAdd(false)}
              className='text-sm text-gray-500 hover:text-white border border-white/10
                hover:border-white/20 rounded-lg px-4 py-2 transition-colors'>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className='bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='text-[10px] text-gray-500 uppercase tracking-wide border-b border-white/[0.06]'>
                {['Manager', 'Asset Class', 'AUM', 'Exp Ratio', '1Y', '3Y', '5Y', 'Sharpe', 'Max DD', 'Rating', ''].map(h => (
                  <th key={h} className='px-4 py-3 text-left font-medium whitespace-nowrap'>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className='divide-y divide-white/[0.04]'>
              {managers.map(m => (
                <>
                  <tr key={m.id} className='hover:bg-white/[0.02] group'>
                    <td className='px-4 py-3'>
                      <p className='font-medium text-white'>{m.name}</p>
                      <p className='text-[10px] text-gray-500'>{m.firm} · {m.strategy}</p>
                    </td>
                    <td className='px-4 py-3 text-xs text-gray-400 whitespace-nowrap'>{m.asset_class}</td>
                    <td className='px-4 py-3 text-xs tabular-nums'>${m.aum_bn.toFixed(1)}B</td>
                    <td className='px-4 py-3 text-xs tabular-nums'>{(m.expense_ratio * 100).toFixed(2)}%</td>
                    <td className='px-4 py-3'><ReturnCell value={m.return_1y} /></td>
                    <td className='px-4 py-3'><ReturnCell value={m.return_3y} /></td>
                    <td className='px-4 py-3'><ReturnCell value={m.return_5y} /></td>
                    <td className='px-4 py-3 text-xs tabular-nums text-gray-300'>{m.sharpe_3y.toFixed(2)}</td>
                    <td className='px-4 py-3 text-xs tabular-nums text-red-400'>{m.max_drawdown.toFixed(1)}%</td>
                    <td className='px-4 py-3'>
                      <button onClick={() => cycleRating(m.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors
                          ${RATING_CONFIG[m.rating].color}`}>
                        {RATING_CONFIG[m.rating].label}
                      </button>
                    </td>
                    <td className='px-4 py-3'>
                      <div className='flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                        <button onClick={() => setEditNotes(editNotes === m.id ? null : m.id)}
                          className='text-gray-600 hover:text-[#3B82F6] transition-colors' title='Notes'>
                          <Star size={13} />
                        </button>
                        <button onClick={() => removeManager(m.id)}
                          className='text-gray-600 hover:text-red-400 transition-colors'>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {editNotes === m.id && (
                    <tr key={`${m.id}-notes`}>
                      <td colSpan={11} className='px-4 pb-4 bg-white/[0.01]'>
                        <textarea
                          defaultValue={notesMap[m.id] ?? m.notes}
                          onChange={e => setNotesMap(n => ({ ...n, [m.id]: e.target.value }))}
                          rows={2}
                          placeholder='Research notes, qualitative assessment, review date…'
                          className='w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs
                            text-gray-300 placeholder:text-gray-700 resize-none
                            focus:outline-none focus:border-white/20'
                        />
                        <p className='text-[10px] text-gray-600 mt-1'>Last reviewed: {m.last_reviewed}</p>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className='text-[10px] text-gray-600 mt-3 flex items-center gap-1.5'>
        <AlertTriangle size={10} className='text-amber-500' />
        Past performance does not predict future results. AI-assisted — verify all data before client presentation.
      </p>
    </div>
  )
}
