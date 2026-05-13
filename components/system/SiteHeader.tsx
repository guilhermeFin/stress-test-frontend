'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Search, Menu, X, Bell } from 'lucide-react'
import Logo from '@/components/Logo'

const UTIL_NAV = [
  { label: 'Product', href: '/product/scenarios' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'How it works', href: '/how-it-works' },
]

const SECTION_NAV = [
  { label: 'Stress Test', href: '/upload' },
  { label: 'Methodology', href: '/how-it-works' },
  { label: 'Customers', href: '/customers/example-ria' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Roadmap', href: '/roadmap' },
]

interface SiteHeaderProps {
  variant?: 'marketing' | 'app'
  workspaceName?: string
}

export default function SiteHeader({ variant = 'marketing', workspaceName }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  if (variant === 'app') {
    return (
      <header className="h-14 bg-white border-b border-slate-200 flex items-center px-6 gap-3 shrink-0 z-30">
        <Logo variant="dark" size={16} />
        {workspaceName && (
          <>
            <span className="text-slate-300 select-none">/</span>
            <span className="text-sm font-medium text-[#0B1B2E]">{workspaceName}</span>
          </>
        )}
        <div className="flex-1" />
        <div
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-200
            text-sm text-slate-400 cursor-pointer hover:border-slate-300 transition-colors duration-150
            max-w-sm w-full"
        >
          <Search size={13} />
          <span className="flex-1">Search clients, portfolios…</span>
          <kbd className="text-[10px] text-slate-300 font-mono">⌘K</kbd>
        </div>
        <div className="flex-1" />
      </header>
    )
  }

  return (
    <>
      {/* Layer 1 — utility strip (desktop only) */}
      <div className="hidden md:block bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-8 flex items-center justify-between">
          <nav className="flex items-center gap-0.5 text-xs text-slate-500">
            {UTIL_NAV.map((item, i) => (
              <span key={item.label} className="flex items-center">
                {i > 0 && <span className="text-slate-300 select-none px-0.5">·</span>}
                <Link
                  href={item.href}
                  className="px-1.5 py-0.5 hover:text-[#0B1B2E] transition-colors duration-150"
                >
                  {item.label}
                </Link>
              </span>
            ))}
          </nav>
          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/auth/sign-in"
              className="text-slate-500 hover:text-[#0B1B2E] transition-colors duration-150"
            >
              Sign in
            </Link>
            <Link
              href="/demo"
              className="text-[#2563EB] font-semibold hover:text-[#1D4ED8] transition-colors duration-150"
            >
              Start free trial
            </Link>
          </div>
        </div>
      </div>

      {/* Layer 2 — brand bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <Link href="/" aria-label="Vantage home">
            <Logo variant="dark" size={20} />
          </Link>
          <div className="flex items-center gap-4">
            <button
              aria-label="Search"
              className="hidden md:flex w-8 h-8 items-center justify-center
                text-slate-400 hover:text-[#0B1B2E] transition-colors duration-150"
            >
              <Search size={15} />
            </button>
            <Link
              href="/auth/sign-in"
              className="hidden md:block text-sm text-slate-600 hover:text-[#0B1B2E] transition-colors duration-150"
            >
              Sign in
            </Link>
            <button
              className="md:hidden text-slate-500 hover:text-[#0B1B2E] p-1 transition-colors duration-150"
              onClick={() => setMobileOpen(v => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Layer 3 — primary nav (desktop only) */}
      <div className="hidden md:block h-12 bg-[#0B1B2E]">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <nav className="flex items-center gap-6">
            {SECTION_NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm text-white/70 hover:text-white transition-colors duration-150"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <span className="block w-1.5 h-1.5 rounded-full bg-[#DC2626] animate-pulse" />
            <span className="text-xs text-white/50 tracking-wide">Live · Stress Engine Active</span>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 shadow-sm">
          <nav className="max-w-7xl mx-auto px-6 py-4 space-y-1">
            {SECTION_NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block text-sm text-[#0B1B2E] py-2.5 border-b border-slate-100
                  hover:text-[#2563EB] transition-colors duration-150 last:border-0"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center gap-4 pt-3">
              <Link
                href="/auth/sign-in"
                onClick={() => setMobileOpen(false)}
                className="text-sm text-slate-500 hover:text-[#0B1B2E] transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/demo"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
              >
                Start free trial →
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
