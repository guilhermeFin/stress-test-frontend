'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, XCircle, RefreshCw, Plus } from 'lucide-react'

type ConnectionStatus = 'connected' | 'disconnected' | 'pending'

interface Custodian {
  id: string
  name: string
  logo: string
  description: string
  status: ConnectionStatus
  accounts?: number
  last_sync?: string
}

const CUSTODIANS: Custodian[] = [
  {
    id: 'schwab',
    name: 'Charles Schwab',
    logo: '🟠',
    description: 'Individual, joint, IRA, trust, and corporate accounts. OAuth 2.0.',
    status: 'disconnected',
  },
  {
    id: 'fidelity',
    name: 'Fidelity Investments',
    logo: '🟢',
    description: 'Brokerage, retirement, and managed accounts. API key + OAuth.',
    status: 'disconnected',
  },
  {
    id: 'ibkr',
    name: 'Interactive Brokers',
    logo: '🔵',
    description: 'Multi-currency, options, futures, equities. Flex Query API.',
    status: 'connected',
    accounts: 8,
    last_sync: '2026-05-11 09:14 ET',
  },
]

function StatusBadge({ status }: { status: ConnectionStatus }) {
  if (status === 'connected')
    return (
      <span className='flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-400/10
        border border-emerald-400/20 rounded-full px-2 py-0.5'>
        <CheckCircle2 size={9} /> Connected
      </span>
    )
  if (status === 'pending')
    return (
      <span className='flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-400/10
        border border-amber-400/20 rounded-full px-2 py-0.5'>
        <RefreshCw size={9} className='animate-spin' /> Connecting…
      </span>
    )
  return (
    <span className='flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-white/5
      border border-white/10 rounded-full px-2 py-0.5'>
      <XCircle size={9} /> Not connected
    </span>
  )
}

export default function CustodiansPage() {
  const [custodians, setCustodians] = useState<Custodian[]>(CUSTODIANS)
  const [syncing, setSyncing] = useState<string | null>(null)

  const connect = (id: string) =>
    setCustodians(cs => cs.map(c => c.id === id ? { ...c, status: 'pending' } : c))

  const disconnect = (id: string) =>
    setCustodians(cs => cs.map(c => c.id === id
      ? { ...c, status: 'disconnected', accounts: undefined, last_sync: undefined }
      : c))

  const sync = (id: string) => {
    setSyncing(id)
    setTimeout(() => {
      setCustodians(cs => cs.map(c => c.id === id
        ? { ...c, last_sync: new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }) + ' ET' }
        : c))
      setSyncing(null)
    }, 1200)
  }

  return (
    <div className='max-w-3xl mx-auto px-6 py-10'>

      <Link href='/settings'
        className='flex items-center gap-1.5 text-sm text-gray-500 hover:text-white
          transition-colors mb-6'>
        <ArrowLeft size={14} /> Settings
      </Link>

      <div className='mb-8'>
        <h1 className='text-2xl font-bold tracking-tight mb-1'>Custodian Sync</h1>
        <p className='text-sm text-gray-500'>
          Connect custodians to auto-import holdings into Vantage portfolios. Data refreshes nightly.
        </p>
      </div>

      <div className='space-y-4 mb-8'>
        {custodians.map(c => (
          <div key={c.id}
            className='bg-white/[0.025] border border-white/[0.06] rounded-2xl p-5'>
            <div className='flex items-start gap-4'>
              <span className='text-3xl leading-none mt-0.5'>{c.logo}</span>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2 mb-1'>
                  <p className='text-sm font-semibold text-white'>{c.name}</p>
                  <StatusBadge status={c.status} />
                </div>
                <p className='text-xs text-gray-500'>{c.description}</p>
                {c.status === 'connected' && (
                  <div className='flex gap-4 mt-2 text-xs text-gray-600'>
                    {c.accounts && <span>{c.accounts} accounts linked</span>}
                    {c.last_sync && <span>Last sync: {c.last_sync}</span>}
                  </div>
                )}
              </div>
              <div className='flex items-center gap-2 shrink-0'>
                {c.status === 'connected' && (
                  <>
                    <button onClick={() => sync(c.id)}
                      className='flex items-center gap-1 text-xs text-gray-500 hover:text-white
                        border border-white/10 hover:border-white/20 rounded-lg px-2.5 py-1.5 transition-colors'>
                      <RefreshCw size={11} className={syncing === c.id ? 'animate-spin' : ''} />
                      Sync now
                    </button>
                    <button onClick={() => disconnect(c.id)}
                      className='text-xs text-gray-600 hover:text-red-400 transition-colors
                        border border-white/10 rounded-lg px-2.5 py-1.5'>
                      Disconnect
                    </button>
                  </>
                )}
                {c.status === 'disconnected' && (
                  <button onClick={() => connect(c.id)}
                    className='flex items-center gap-1.5 text-xs font-semibold text-white
                      bg-[#3B82F6] hover:bg-[#2563EB] rounded-lg px-3 py-1.5 transition-colors'>
                    <Plus size={11} /> Connect
                  </button>
                )}
                {c.status === 'pending' && (
                  <span className='text-xs text-gray-500'>Awaiting authorization…</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4'>
        <p className='text-xs text-gray-500 leading-relaxed'>
          <span className='text-white font-medium'>Data refresh cadence:</span> Holdings and positions
          are pulled nightly at 12:00 AM ET. Manual sync available at any time. Data is read-only —
          Vantage never places trades or modifies positions at your custodian.
        </p>
      </div>
    </div>
  )
}
