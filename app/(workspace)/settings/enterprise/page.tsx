'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Shield, Download, Zap, Lock, Check, ExternalLink } from 'lucide-react'

function FeatureRow({ icon: Icon, label, desc, badge, action }: {
  icon: React.ElementType
  label: string
  desc: string
  badge?: string
  action?: React.ReactNode
}) {
  return (
    <div className='flex items-start gap-4 py-4 border-b border-white/[0.06] last:border-0'>
      <div className='w-9 h-9 rounded-xl bg-[#F59E08]/10 flex items-center justify-center shrink-0 mt-0.5'>
        <Icon size={16} className='text-[#F59E08]' />
      </div>
      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2 mb-0.5'>
          <p className='text-sm font-semibold text-white'>{label}</p>
          {badge && (
            <span className='text-[10px] font-bold text-[#F59E08] bg-[#F59E08]/10 border border-[#F59E08]/20
              rounded-full px-2 py-0.5'>
              {badge}
            </span>
          )}
        </div>
        <p className='text-xs text-gray-500 leading-relaxed'>{desc}</p>
      </div>
      {action && <div className='shrink-0'>{action}</div>}
    </div>
  )
}

export default function EnterprisePage() {
  const [ssoEnabled, setSsoEnabled] = useState(false)
  const [priorityRouting, setPriorityRouting] = useState(false)
  const [exporting, setExporting] = useState(false)

  const exportAuditLog = () => {
    setExporting(true)
    setTimeout(() => setExporting(false), 1500)
  }

  return (
    <div className='max-w-2xl mx-auto px-6 py-10'>

      <Link href='/settings'
        className='flex items-center gap-1.5 text-sm text-gray-500 hover:text-white
          transition-colors mb-6'>
        <ArrowLeft size={14} /> Settings
      </Link>

      <div className='mb-8'>
        <h1 className='text-2xl font-bold tracking-tight mb-1'>Enterprise Settings</h1>
        <p className='text-sm text-gray-500'>SSO, audit controls, custom scenarios, and infrastructure options.</p>
      </div>

      <div className='bg-white/[0.025] border border-white/[0.06] rounded-2xl p-5 mb-6'>

        <FeatureRow
          icon={Lock}
          label='SAML SSO'
          desc='Single sign-on via your identity provider (Okta, Azure AD, Google Workspace). Powered by WorkOS.'
          badge='Enterprise'
          action={
            <div className='flex items-center gap-2'>
              <button
                onClick={() => setSsoEnabled(v => !v)}
                className={`relative w-9 h-5 rounded-full transition-colors ${ssoEnabled ? 'bg-[#3B82F6]' : 'bg-white/10'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow
                  transition-transform ${ssoEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          }
        />

        {ssoEnabled && (
          <div className='bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 mb-4'>
            <p className='text-xs text-gray-500 mb-3'>Configure your SAML provider in the WorkOS dashboard, then paste the metadata URL below.</p>
            <input
              type='url'
              placeholder='https://your-idp.com/saml/metadata'
              className='w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm
                text-white placeholder:text-gray-600 focus:outline-none focus:border-white/20'
            />
            <a href='#' className='flex items-center gap-1 text-xs text-[#3B82F6] mt-2 hover:underline'>
              Open WorkOS dashboard <ExternalLink size={10} />
            </a>
          </div>
        )}

        <FeatureRow
          icon={Download}
          label='Audit Log Export'
          desc='Export a timestamped CSV of all advice-affecting writes (plan changes, stress runs, client letters) for compliance review.'
          badge='Enterprise'
          action={
            <button
              onClick={exportAuditLog}
              className='flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-white
                border border-white/10 hover:border-white/20 rounded-lg px-3 py-1.5 transition-all'>
              {exporting ? <><Check size={11} className='text-emerald-400' /> Exported</> : <><Download size={11} /> Export CSV</>}
            </button>
          }
        />

        <FeatureRow
          icon={Shield}
          label='Custom Scenario Library'
          desc='Build and save proprietary stress scenarios (custom shock vectors, historical events, regional crises) for reuse across all portfolios.'
          badge='Enterprise'
          action={
            <button className='text-xs text-gray-500 border border-white/10 rounded-lg px-3 py-1.5 hover:text-white hover:border-white/20 transition-all'>
              Manage
            </button>
          }
        />

        <FeatureRow
          icon={Zap}
          label='Priority Claude Routing'
          desc='Your stress tests and AI memos are routed to dedicated capacity — guaranteed response under 45 seconds even during peak demand.'
          badge='Enterprise'
          action={
            <div className='flex items-center gap-2'>
              <button
                onClick={() => setPriorityRouting(v => !v)}
                className={`relative w-9 h-5 rounded-full transition-colors ${priorityRouting ? 'bg-[#3B82F6]' : 'bg-white/10'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow
                  transition-transform ${priorityRouting ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          }
        />

      </div>

      <div className='bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4'>
        <p className='text-xs text-gray-500'>
          Enterprise features require the Enterprise plan ($799/mo).{' '}
          <Link href='/settings/billing' className='text-[#3B82F6] hover:underline'>Upgrade in billing settings.</Link>
        </p>
      </div>
    </div>
  )
}
