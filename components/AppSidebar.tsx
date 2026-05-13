'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  LayoutDashboard, Users, FolderOpen, Zap, BarChart2,
  BrainCircuit, Inbox, Settings, LogOut, ChevronLeft,
  ChevronRight, Target, Receipt, Landmark, BookOpen,
  FlaskConical, Presentation,
} from 'lucide-react'
import Logo from '@/components/Logo'

const NAV = [
  { href: '/dashboard',       icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/households',      icon: Users,           label: 'Clients' },
  { href: '/portfolios',      icon: FolderOpen,      label: 'Portfolios' },
  { href: '/planning',        icon: Target,          label: 'Planning' },
  { href: '/tax',             icon: Receipt,         label: 'Tax' },
  { href: '/estate',          icon: Landmark,        label: 'Estate' },
  { href: '/coaching',        icon: BookOpen,        label: 'Coaching' },
  { href: '/research',        icon: FlaskConical,    label: 'Research' },
  { href: '/presentations',   icon: Presentation,    label: 'Presentations' },
  { href: '/upload',          icon: Zap,             label: 'Stress Test' },
  { href: '/compare',         icon: BarChart2,       label: 'Compare' },
  { href: '/intelligence',    icon: BrainCircuit,    label: 'Intelligence' },
  { href: '/inbox',           icon: Inbox,           label: 'Inbox' },
]

export default function AppSidebar() {
  const pathname  = usePathname()
  const { data: session } = useSession()
  const [collapsed, setCollapsed] = useState(false)

  const w = collapsed ? 'w-[60px]' : 'w-[220px]'

  return (
    <aside
      className={`${w} flex-shrink-0 bg-slate-50 border-r border-slate-200
        flex flex-col transition-all duration-200 h-screen sticky top-0 z-40`}
    >
      {/* Logo */}
      <div className={`h-14 flex items-center px-4 border-b border-slate-200 ${collapsed ? 'justify-center' : 'gap-2'}`}>
        <Link href='/' title='Back to home'>
          {collapsed
            ? <Logo variant='dark' size={22} />
            : <Logo variant='dark' size={18} />}
        </Link>
      </div>

      {/* Nav */}
      <nav className='flex-1 px-2 py-3 space-y-0.5 overflow-y-auto'>
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 py-2 rounded-md text-sm font-medium
                transition-colors duration-150 group relative
                ${active
                  ? 'bg-white border border-slate-200 shadow-sm text-[#0B1B2E] border-l-[3px] border-l-[#2563EB] pl-[10px] pr-3'
                  : 'px-3 text-slate-600 hover:text-[#0B1B2E] hover:bg-white'}`}
            >
              <Icon size={16} className='shrink-0' />
              {!collapsed && <span>{label}</span>}
              {label === 'Inbox' && !collapsed && (
                <span className='ml-auto bg-[#2563EB] text-white text-[10px] font-bold
                  px-1.5 py-0.5 rounded-full leading-none'>
                  3
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom: settings + user */}
      <div className='border-t border-slate-200 px-2 py-3 space-y-0.5'>
        <Link
          href='/settings'
          title={collapsed ? 'Settings' : undefined}
          className={`flex items-center gap-3 py-2 rounded-md text-sm font-medium
            transition-colors text-slate-600 hover:text-[#0B1B2E] hover:bg-white
            ${pathname.startsWith('/settings')
              ? 'bg-white border border-slate-200 shadow-sm text-[#0B1B2E] border-l-[3px] border-l-[#2563EB] pl-[10px] pr-3'
              : 'px-3'}`}
        >
          <Settings size={16} className='shrink-0' />
          {!collapsed && <span>Settings</span>}
        </Link>

        {session?.user && (
          <div className={`flex items-center gap-2 px-3 py-2 ${collapsed ? 'justify-center' : ''}`}>
            <div className='w-6 h-6 rounded-full bg-[#2563EB]/15 flex items-center justify-center
              text-[#2563EB] text-[10px] font-bold shrink-0'>
              {(session.user.name ?? session.user.email ?? 'U')[0].toUpperCase()}
            </div>
            {!collapsed && (
              <div className='flex-1 min-w-0'>
                <p className='text-xs font-medium text-[#0B1B2E] truncate'>
                  {session.user.name ?? session.user.email}
                </p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={() => signOut({ callbackUrl: '/auth/sign-in' })}
                title='Sign out'
                className='text-slate-400 hover:text-[#B91C1C] transition-colors'
              >
                <LogOut size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className='absolute -right-3 top-[52px] w-6 h-6 bg-white border border-slate-200
          rounded-full flex items-center justify-center text-slate-400 hover:text-[#0B1B2E]
          hover:border-slate-300 transition-all shadow-sm'
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  )
}
