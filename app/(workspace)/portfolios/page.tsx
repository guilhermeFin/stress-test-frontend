'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import {
  FolderOpen, Plus, Trash2, Clock, BarChart3,
  ArrowLeft, AlertCircle, ChevronRight,
} from 'lucide-react'
import { type Portfolio, listPortfolios, deletePortfolio } from '@/lib/portfolios'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function PortfoliosPage() {
  const { data: session } = useSession()
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [deleting, setDeleting]     = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await listPortfolios()
      setPortfolios(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load portfolios')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? All stress runs will be lost.`)) return
    setDeleting(id)
    try {
      await deletePortfolio(id)
      setPortfolios(p => p.filter(x => x.id !== id))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className='max-w-5xl mx-auto px-6 py-10'>

        {/* Header */}
        <div className='flex items-start justify-between mb-8'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight mb-1'>Portfolios</h1>
            <p className='text-sm text-gray-500'>
              {session?.user?.email && `${session.user.email} · `}
              Each portfolio keeps a full history of stress runs.
            </p>
          </div>
          <Link href='/'>
            <button className='flex items-center gap-1.5 text-sm font-semibold text-white
              bg-[#3B82F6] hover:bg-[#2563EB] rounded-lg px-4 py-2 transition-colors'>
              <Plus size={14} />
              New stress test
            </button>
          </Link>
        </div>

        {error && (
          <div className='flex items-center gap-2 bg-red-950/40 border border-red-700/30
            rounded-xl px-4 py-3 mb-6 text-red-300 text-sm'>
            <AlertCircle size={14} className='shrink-0' />
            {error}
            <button onClick={load} className='ml-auto text-red-400 hover:text-red-300 underline text-xs'>
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            {[...Array(4)].map((_, i) => (
              <div key={i} className='h-[110px] rounded-2xl bg-white/[0.03] border border-white/6 animate-pulse' />
            ))}
          </div>
        ) : portfolios.length === 0 ? (
          <div className='text-center py-24 border border-dashed border-white/10 rounded-2xl'>
            <div className='w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4'>
              <FolderOpen size={22} className='text-gray-600' />
            </div>
            <p className='text-gray-500 text-sm mb-6'>No saved portfolios yet.</p>
            <Link href='/'
              className='inline-flex items-center gap-2 text-sm font-semibold text-white
                bg-[#3B82F6] hover:bg-[#2563EB] rounded-lg px-4 py-2 transition-colors'>
              <Plus size={14} /> Run your first stress test
            </Link>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            {portfolios.map(p => (
              <div key={p.id}
                className='group relative bg-white/[0.03] border border-white/8
                  hover:border-white/15 rounded-2xl p-5 transition-all duration-200'>
                <Link href={`/portfolios/${p.id}`} className='block'>
                  <div className='flex items-start justify-between mb-3'>
                    <div>
                      <p className='font-semibold text-white group-hover:text-[#3B82F6] transition-colors'>
                        {p.name}
                      </p>
                      <p className='text-xs text-gray-600 mt-0.5 flex items-center gap-1'>
                        <Clock size={10} />
                        {p.last_run_at ? `Last run ${timeAgo(p.last_run_at)}` : 'No runs yet'}
                      </p>
                    </div>
                    <ChevronRight size={16} className='text-gray-600 group-hover:text-gray-400 mt-0.5 transition-colors' />
                  </div>
                  <div className='flex items-center gap-4'>
                    <div className='flex items-center gap-1.5 text-xs text-gray-500'>
                      <BarChart3 size={11} className='text-[#3B82F6]' />
                      {p.run_count} {p.run_count === 1 ? 'run' : 'runs'}
                    </div>
                  </div>
                </Link>

                <button
                  onClick={() => handleDelete(p.id, p.name)}
                  disabled={deleting === p.id}
                  className='absolute top-4 right-12 opacity-0 group-hover:opacity-100
                    text-gray-600 hover:text-red-400 transition-all duration-150 disabled:opacity-30'>
                  {deleting === p.id
                    ? <span className='w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin block' />
                    : <Trash2 size={14} />}
                </button>
              </div>
            ))}
          </div>
        )}
    </div>
  )
}
