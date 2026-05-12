import Link from 'next/link'
import { ChevronRight, CreditCard, Building2, Mail, Shield, User } from 'lucide-react'

const SECTIONS = [
  {
    href:  '/settings/billing',
    icon:  CreditCard,
    label: 'Billing & Plan',
    desc:  'Manage your subscription, upgrade or downgrade, view invoices.',
    accent: '#3B82F6',
  },
  {
    href:  '/settings/custodians',
    icon:  Building2,
    label: 'Custodian Sync',
    desc:  'Connect Schwab, Fidelity, or IBKR to auto-import holdings.',
    accent: '#10B981',
  },
  {
    href:  '/settings/email',
    icon:  Mail,
    label: 'Weekly Intelligence Email',
    desc:  'Configure automated weekly digest delivery per household.',
    accent: '#8B5CF6',
  },
  {
    href:  '/settings/enterprise',
    icon:  Shield,
    label: 'Enterprise Settings',
    desc:  'SSO, audit log export, custom scenarios, priority routing.',
    accent: '#F59E08',
  },
]

export default function SettingsPage() {
  return (
    <div className='max-w-3xl mx-auto px-6 py-10'>
      <div className='mb-10'>
        <h1 className='text-2xl font-bold tracking-tight mb-2'>Settings</h1>
        <p className='text-sm text-gray-500'>Firm configuration, integrations, and account preferences.</p>
      </div>

      {/* Firm profile card */}
      <div className='bg-white/[0.025] border border-white/[0.06] rounded-2xl p-5 mb-6 flex items-center gap-4'>
        <div className='w-12 h-12 rounded-xl bg-[#3B82F6]/20 flex items-center justify-center shrink-0'>
          <User size={20} className='text-[#3B82F6]' />
        </div>
        <div className='flex-1 min-w-0'>
          <p className='text-sm font-semibold text-white'>Firm Profile</p>
          <p className='text-xs text-gray-500 mt-0.5'>Name, logo, compliance footer, advisor list, roles.</p>
        </div>
        <span className='text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20
          rounded-full px-2 py-0.5'>
          Coming soon
        </span>
      </div>

      <div className='grid grid-cols-1 gap-3'>
        {SECTIONS.map(({ href, icon: Icon, label, desc, accent }) => (
          <Link key={href} href={href}
            className='group flex items-center gap-4 bg-white/[0.025] border border-white/[0.06]
              hover:border-white/12 rounded-2xl p-5 transition-all'>
            <div className='w-10 h-10 rounded-xl flex items-center justify-center shrink-0'
              style={{ background: `${accent}18` }}>
              <Icon size={18} style={{ color: accent }} />
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-semibold text-white'>{label}</p>
              <p className='text-xs text-gray-500 mt-0.5'>{desc}</p>
            </div>
            <ChevronRight size={16} className='text-gray-600 group-hover:text-white
              group-hover:translate-x-0.5 transition-all' />
          </Link>
        ))}
      </div>
    </div>
  )
}
