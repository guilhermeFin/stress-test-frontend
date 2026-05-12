'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Inbox, AlertTriangle, BarChart3, Calendar, Heart, Newspaper,
  Bell, CheckCircle, Clock, ChevronRight, Filter,
} from 'lucide-react'
import { listInbox, patchInboxItem, type InboxItem, type AlertType } from '@/lib/households'

const TYPE_META: Record<AlertType, { label: string; icon: React.ElementType; color: string }> = {
  drift:         { label: 'Drift Alert',    icon: BarChart3,     color: 'text-amber-400 bg-amber-400/10' },
  plan_checkin:  { label: 'Plan Check-in',  icon: Calendar,      color: 'text-blue-400 bg-blue-400/10' },
  rmd:           { label: 'RMD Due',        icon: Bell,          color: 'text-orange-400 bg-orange-400/10' },
  market:        { label: 'Market Alert',   icon: Newspaper,     color: 'text-purple-400 bg-purple-400/10' },
  life_event:    { label: 'Life Event',     icon: Heart,         color: 'text-pink-400 bg-pink-400/10' },
  run_complete:  { label: 'Run Complete',   icon: BarChart3,     color: 'text-emerald-400 bg-emerald-400/10' },
}

const SEVERITY_BADGE: Record<string, string> = {
  critical: 'bg-red-500/10 text-red-400 border border-red-500/20',
  warning:  'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  info:     'bg-white/5 text-gray-400 border border-white/10',
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

// ── MOCK items ───────────────────────────────────────────────────────────────

const MOCK: InboxItem[] = [
  {
    id: 'i1', type: 'drift', severity: 'warning',
    household_id: '2', household_name: 'Patel Trust',
    title: 'US Equity overweight by 12%',
    body: 'Patel Trust Growth portfolio has drifted 12% above its 60% US equity target. Consider rebalancing before year-end.',
    status: 'unread', created_at: new Date(Date.now() - 30 * 60000).toISOString(),
    action_url: '/households/2',
  },
  {
    id: 'i2', type: 'rmd', severity: 'critical',
    household_id: '4', household_name: 'Reyes IRA',
    title: 'Q4 RMD deadline approaching',
    body: 'Maria Reyes must take her annual Required Minimum Distribution by December 31. Estimated amount: $34,200.',
    status: 'unread', created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    action_url: '/households/4',
  },
  {
    id: 'i3', type: 'plan_checkin', severity: 'info',
    household_id: '1', household_name: 'Harrison Family',
    title: 'Annual plan review overdue',
    body: 'Harrison Family\'s investment policy statement review is 14 days overdue. Schedule the annual check-in to update goals and risk tolerance.',
    status: 'unread', created_at: new Date(Date.now() - 86400000).toISOString(),
    action_url: '/households/1',
  },
  {
    id: 'i4', type: 'market', severity: 'warning',
    title: 'Fed meeting outcome: rates held',
    body: 'The Federal Reserve held rates steady at 4.25%–4.50%. Review your rate-sensitive positions — particularly Patel Trust\'s fixed income ladder.',
    status: 'read', created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'i5', type: 'run_complete', severity: 'info',
    household_id: '3', household_name: 'Chen Portfolio',
    title: 'Stress test complete: 2008 GFC scenario',
    body: 'Chen Portfolio scored 5.2/10 under 2008 GFC conditions. Maximum drawdown: -38.4%. Review the AI memo for recommended actions.',
    status: 'read', created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    action_url: '/portfolios',
  },
]

// ── Page ─────────────────────────────────────────────────────────────────────

type Filter = 'all' | 'unread' | AlertType

export default function InboxPage() {
  const [items, setItems] = useState<InboxItem[]>(MOCK)
  const [filter, setFilter] = useState<Filter>('all')
  const [acting, setActing] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const data = await listInbox()
      setItems(data)
    } catch {
      // keep mock
    }
  }, [])

  useEffect(() => { load() }, [load])

  const visible = items.filter(it => {
    if (it.status === 'dismissed') return false
    if (filter === 'unread') return it.status === 'unread'
    if (filter === 'all') return true
    return it.type === filter
  })

  const unreadCount = items.filter(i => i.status === 'unread').length

  const act = async (id: string, action: 'dismiss' | 'read' | 'snooze') => {
    setActing(id)
    try {
      await patchInboxItem(id, action)
    } catch { /* optimistic only */ }
    setItems(prev => prev.map(i =>
      i.id === id
        ? { ...i, status: action === 'dismiss' ? 'dismissed' : action === 'read' ? 'read' : 'snoozed' }
        : i
    ))
    setActing(null)
  }

  const markAllRead = () => {
    setItems(prev => prev.map(i => ({ ...i, status: i.status === 'unread' ? 'read' : i.status })))
  }

  return (
    <div className='max-w-3xl mx-auto px-6 py-10'>

      {/* Header */}
      <div className='flex items-start justify-between mb-6'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight flex items-center gap-2'>
            Inbox
            {unreadCount > 0 && (
              <span className='bg-[#3B82F6] text-white text-xs font-bold px-2 py-0.5 rounded-full'>
                {unreadCount}
              </span>
            )}
          </h1>
          <p className='text-sm text-gray-500 mt-1'>
            All alerts and notifications across your clients.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className='flex items-center gap-1.5 text-xs text-gray-500 hover:text-white
              border border-white/10 hover:border-white/20 rounded-lg px-3 py-1.5 transition-colors'
          >
            <CheckCircle size={12} /> Mark all read
          </button>
        )}
      </div>

      {/* Filter bar */}
      <div className='flex items-center gap-1.5 mb-6 flex-wrap'>
        <Filter size={12} className='text-gray-600 shrink-0' />
        {([
          { key: 'all',          label: 'All' },
          { key: 'unread',       label: 'Unread' },
          { key: 'drift',        label: 'Drift' },
          { key: 'rmd',          label: 'RMD' },
          { key: 'plan_checkin', label: 'Check-ins' },
          { key: 'market',       label: 'Market' },
          { key: 'life_event',   label: 'Life events' },
        ] as { key: Filter; label: string }[]).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors
              ${filter === key
                ? 'bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20'
                : 'text-gray-500 border border-white/[0.06] hover:text-white hover:border-white/10'
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Items */}
      {visible.length === 0 ? (
        <div className='text-center py-20 border border-dashed border-white/10 rounded-2xl'>
          <Inbox size={28} className='text-gray-600 mx-auto mb-3' />
          <p className='text-gray-500 text-sm'>All clear — nothing here.</p>
        </div>
      ) : (
        <div className='space-y-2'>
          {visible.map(item => {
            const meta = TYPE_META[item.type] ?? { label: item.type, icon: Bell, color: 'text-gray-400 bg-white/5' }
            const Icon = meta.icon
            const isUnread = item.status === 'unread'

            return (
              <div
                key={item.id}
                className={`relative bg-white/[0.02] border rounded-2xl p-4 transition-all
                  ${isUnread ? 'border-white/10' : 'border-white/[0.05] opacity-70'}`}
              >
                {/* Unread dot */}
                {isUnread && (
                  <span className='absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#3B82F6]' />
                )}

                <div className={`flex gap-4 ${isUnread ? 'pl-4' : ''}`}>
                  {/* Icon */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${meta.color}`}>
                    <Icon size={15} />
                  </div>

                  {/* Content */}
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-start justify-between gap-2 mb-1'>
                      <div className='flex items-center gap-2 flex-wrap'>
                        <p className={`text-sm font-semibold ${isUnread ? 'text-white' : 'text-gray-300'}`}>
                          {item.title}
                        </p>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${SEVERITY_BADGE[item.severity]}`}>
                          {item.severity}
                        </span>
                      </div>
                      <p className='text-[10px] text-gray-600 shrink-0 flex items-center gap-1'>
                        <Clock size={9} /> {timeAgo(item.created_at)}
                      </p>
                    </div>

                    {item.household_name && (
                      <p className='text-xs text-[#3B82F6] mb-1'>{item.household_name}</p>
                    )}

                    <p className='text-xs text-gray-400 leading-relaxed mb-3'>{item.body}</p>

                    {/* Actions */}
                    <div className='flex items-center gap-2'>
                      {item.action_url && (
                        <Link
                          href={item.action_url}
                          onClick={() => act(item.id, 'read')}
                          className='flex items-center gap-1 text-xs text-[#3B82F6] hover:underline'
                        >
                          Review <ChevronRight size={11} />
                        </Link>
                      )}
                      {isUnread && (
                        <button
                          onClick={() => act(item.id, 'read')}
                          disabled={acting === item.id}
                          className='text-xs text-gray-600 hover:text-gray-300 transition-colors'
                        >
                          Mark read
                        </button>
                      )}
                      <button
                        onClick={() => act(item.id, 'snooze')}
                        disabled={acting === item.id}
                        className='text-xs text-gray-600 hover:text-gray-300 transition-colors'
                      >
                        Snooze
                      </button>
                      <button
                        onClick={() => act(item.id, 'dismiss')}
                        disabled={acting === item.id}
                        className='text-xs text-gray-600 hover:text-red-400 transition-colors ml-auto'
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
