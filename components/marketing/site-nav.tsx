'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Menu, X, ArrowRight, ChevronDown } from 'lucide-react'
import Logo from '@/components/Logo'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { navConfig, type NavColumn, type MegaMenu } from './nav-config'
import { cn } from '@/lib/utils'

// ── Mega-menu panel ─────────────────────────────────────────────────────────

function NavItem({ item }: { item: NonNullable<NavColumn['items']>[number] }) {
  return (
    <NavigationMenuLink asChild>
      <Link
        href={item.href}
        className='group flex items-start gap-3 rounded-lg px-2.5 py-2
          hover:bg-white/[0.06] transition-colors duration-150
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]'
      >
        <div className='min-w-0 flex-1'>
          <div className='flex items-center gap-2 mb-0.5'>
            <span className='text-sm font-medium text-white/90 group-hover:text-[#3B82F6] transition-colors'>
              {item.title}
            </span>
            {item.badge && (
              <span
                aria-label='Coming soon'
                className='text-[10px] font-semibold text-[#3B82F6] bg-[#3B82F6]/10
                  border border-[#3B82F6]/20 rounded-full px-1.5 py-px leading-none'
              >
                {item.badge}
              </span>
            )}
          </div>
          <p className='text-xs text-gray-500 leading-relaxed'>{item.description}</p>
        </div>
      </Link>
    </NavigationMenuLink>
  )
}

function FeaturedCard({ featured }: { featured: NonNullable<NavColumn['featured']> }) {
  return (
    <NavigationMenuLink asChild>
      <Link
        href={featured.href}
        className='group flex flex-col h-full rounded-xl bg-gradient-to-br
          from-[#3B82F6]/10 to-[#3B82F6]/5 border border-[#3B82F6]/20
          p-5 hover:border-[#3B82F6]/40 transition-all duration-200
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]'
      >
        <span className='text-[10px] font-semibold uppercase tracking-widest text-[#3B82F6] mb-3'>
          {featured.eyebrow}
        </span>
        <p className='text-sm font-semibold text-white leading-snug flex-1 mb-4'>
          {featured.title}
        </p>
        <span className='text-xs font-medium text-[#3B82F6] group-hover:gap-2 flex items-center gap-1.5 transition-all'>
          {featured.cta}
        </span>
      </Link>
    </NavigationMenuLink>
  )
}

function MegaMenuPanel({ menu }: { menu: MegaMenu }) {
  const colCount = menu.columns.length
  const gridClass = colCount === 4
    ? 'grid-cols-4'
    : colCount === 3
    ? 'grid-cols-3'
    : 'grid-cols-2'

  return (
    <div
      className={`grid gap-6 p-8 w-[min(1080px,calc(100vw-48px))]`}
      style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}
    >
      {menu.columns.map((col) => (
        <div key={col.heading}>
          <p className='text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-3'>
            {col.heading}
          </p>
          {col.items && (
            <ul className='space-y-0.5'>
              {col.items.map((item) => (
                <li key={item.href + item.title}>
                  <NavItem item={item} />
                </li>
              ))}
            </ul>
          )}
          {col.featured && <FeaturedCard featured={col.featured} />}
        </div>
      ))}
    </div>
  )
}

// ── Mobile accordion item ────────────────────────────────────────────────────

function MobileSection({ menu, onClose }: { menu: MegaMenu; onClose: () => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div className='border-b border-white/[0.06]'>
      <button
        onClick={() => setOpen(v => !v)}
        className='flex items-center justify-between w-full px-4 py-4 text-sm font-medium
          text-gray-300 hover:text-white transition-colors'
      >
        {menu.label}
        <ChevronDown size={15} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className='px-4 pb-4 space-y-4'>
          {menu.columns.map((col) => (
            <div key={col.heading}>
              {col.items && (
                <>
                  <p className='text-[10px] font-semibold uppercase tracking-widest text-gray-600 mb-2'>
                    {col.heading}
                  </p>
                  <ul className='space-y-0.5'>
                    {col.items.map((item) => (
                      <li key={item.href + item.title}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className='flex items-center justify-between py-2 text-sm text-gray-400
                            hover:text-white transition-colors'
                        >
                          <span>{item.title}</span>
                          {item.badge && (
                            <span className='text-[10px] text-[#3B82F6] bg-[#3B82F6]/10
                              border border-[#3B82F6]/20 rounded-full px-1.5 py-px'>
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {col.featured && (
                <Link
                  href={col.featured.href}
                  onClick={onClose}
                  className='block rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 p-4 mt-2'
                >
                  <p className='text-[10px] uppercase tracking-widest text-[#3B82F6] mb-1'>
                    {col.featured.eyebrow}
                  </p>
                  <p className='text-sm text-white font-medium leading-snug mb-2'>
                    {col.featured.title}
                  </p>
                  <span className='text-xs text-[#3B82F6]'>{col.featured.cta}</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main nav ────────────────────────────────────────────────────────────────

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 h-16',
        'bg-[#0A0F1E]/80 backdrop-blur-xl transition-all duration-200',
        scrolled && 'border-b border-white/[0.08]',
      )}
    >
      <div className='max-w-7xl mx-auto px-6 h-full flex items-center justify-between gap-8'>

        {/* Logo */}
        <Link href='/' className='shrink-0 flex items-center'>
          <Logo size={20} />
        </Link>

        {/* Desktop center nav */}
        <div className='hidden md:flex flex-1 items-center justify-center'>
          <NavigationMenu>
            <NavigationMenuList>

              {/* Product mega-menu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  {navConfig.product.label}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <MegaMenuPanel menu={navConfig.product} />
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Solutions mega-menu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  {navConfig.solutions.label}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <MegaMenuPanel menu={navConfig.solutions} />
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Plain links */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href={navConfig.howItWorks.href}
                    className='inline-flex h-9 items-center px-3 py-2 text-sm font-medium
                      text-gray-300 hover:text-white transition-colors rounded-md
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]'
                  >
                    {navConfig.howItWorks.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href={navConfig.pricing.href}
                    className='inline-flex h-9 items-center px-3 py-2 text-sm font-medium
                      text-gray-300 hover:text-white transition-colors rounded-md
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]'
                  >
                    {navConfig.pricing.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuIndicator />
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Desktop right CTAs */}
        <div className='hidden md:flex items-center gap-3 shrink-0'>
          <Link
            href='/auth/sign-in'
            className='text-sm font-medium text-gray-400 hover:text-white
              transition-colors px-3 py-2 rounded-md
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]'
          >
            Sign in
          </Link>
          <Link
            href='/demo'
            className='flex items-center gap-1.5 text-sm font-semibold text-white
              bg-[#3B82F6] hover:bg-[#2563EB] rounded-lg px-4 py-2 transition-colors
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]'
          >
            Start free trial <ArrowRight size={13} />
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className='md:hidden text-gray-400 hover:text-white transition-colors p-2 -mr-2'
          onClick={() => setDrawerOpen(true)}
          aria-label='Open menu'
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile drawer */}
      <DialogPrimitive.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay
            className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm
              data-[state=open]:animate-in data-[state=closed]:animate-out
              data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 duration-200'
          />
          <DialogPrimitive.Content
            className='fixed right-0 top-0 bottom-0 z-50 w-80 max-w-[90vw]
              bg-[#0D1120] border-l border-white/[0.08] flex flex-col
              data-[state=open]:animate-in data-[state=closed]:animate-out
              data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right
              duration-300'
          >
            <DialogPrimitive.Title className='sr-only'>Navigation menu</DialogPrimitive.Title>

            {/* Drawer header */}
            <div className='flex items-center justify-between px-4 h-16 border-b border-white/[0.06] shrink-0'>
              <Logo size={18} />
              <DialogPrimitive.Close
                className='text-gray-500 hover:text-white transition-colors p-2'
                aria-label='Close menu'
              >
                <X size={20} />
              </DialogPrimitive.Close>
            </div>

            {/* Drawer body */}
            <div className='flex-1 overflow-y-auto py-2'>
              <MobileSection menu={navConfig.product} onClose={() => setDrawerOpen(false)} />
              <MobileSection menu={navConfig.solutions} onClose={() => setDrawerOpen(false)} />

              <div className='border-b border-white/[0.06]'>
                <Link
                  href={navConfig.howItWorks.href}
                  onClick={() => setDrawerOpen(false)}
                  className='flex items-center px-4 py-4 text-sm font-medium text-gray-300
                    hover:text-white transition-colors'
                >
                  {navConfig.howItWorks.label}
                </Link>
              </div>
              <div className='border-b border-white/[0.06]'>
                <Link
                  href={navConfig.pricing.href}
                  onClick={() => setDrawerOpen(false)}
                  className='flex items-center px-4 py-4 text-sm font-medium text-gray-300
                    hover:text-white transition-colors'
                >
                  {navConfig.pricing.label}
                </Link>
              </div>
            </div>

            {/* Drawer footer CTAs */}
            <div className='p-4 border-t border-white/[0.06] space-y-2 shrink-0'>
              <Link
                href='/auth/sign-in'
                onClick={() => setDrawerOpen(false)}
                className='flex items-center justify-center w-full py-2.5 text-sm font-medium
                  text-gray-300 hover:text-white border border-white/10 hover:border-white/20
                  rounded-lg transition-colors'
              >
                Sign in
              </Link>
              <Link
                href='/demo'
                onClick={() => setDrawerOpen(false)}
                className='flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold
                  text-white bg-[#3B82F6] hover:bg-[#2563EB] rounded-lg transition-colors'
              >
                Start free trial <ArrowRight size={13} />
              </Link>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </header>
  )
}
