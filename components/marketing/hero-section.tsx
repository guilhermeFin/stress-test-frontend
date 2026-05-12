import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Logo from '@/components/Logo'

export default function HeroSection() {
  return (
    <section className='relative overflow-hidden'>

      {/* Ambient gradient orbs */}
      <div aria-hidden className='pointer-events-none absolute inset-0 z-0'>
        <div className='absolute -left-[8%] -top-[18%] h-[55vw] w-[55vw] rounded-full opacity-[0.07]'
          style={{ background: 'radial-gradient(circle at center, #3B82F6 0%, transparent 68%)' }} />
        <div className='absolute right-[-6%] bottom-[5%] h-[38vw] w-[38vw] rounded-full opacity-[0.04]'
          style={{ background: 'radial-gradient(circle at center, #8B5CF6 0%, transparent 68%)' }} />
        {/* Diagonal light beam — desktop only */}
        <div className='absolute left-0 top-0 hidden h-[80rem] w-[35rem] -rotate-45 rounded-full opacity-50 lg:block'
          style={{ background: 'radial-gradient(68.54% 68.72% at 55.02% 31.46%, rgba(59,130,246,0.07) 0%, rgba(59,130,246,0.02) 50%, transparent 80%)', transform: 'translateY(-20%) rotate(-45deg)' }} />
      </div>

      {/* Hero copy */}
      <div className='relative z-10 mx-auto max-w-5xl px-6 pt-32 pb-0 text-center'>

        <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full
          bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-xs
          font-medium mb-10'>
          <span className='w-1.5 h-1.5 bg-[#3B82F6] rounded-full animate-pulse' />
          Built for Wealth Managers &amp; RIAs
        </div>

        <h1 className='font-black tracking-tight mb-6
          bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent'
          style={{ fontSize: 'clamp(52px, 7vw, 88px)', lineHeight: '1.0' }}>
          Stress test.<br />Build confidence.
        </h1>

        <p className='text-lg font-medium text-gray-300 max-w-xl mx-auto mb-4'>
          Institutional-grade portfolio risk analysis in 60 seconds.
        </p>

        <p className='text-gray-400 max-w-2xl mx-auto leading-relaxed mb-12'>
          Vantage turns complex market data into clear, actionable insights so you
          can lead with confidence when your clients need it most.
        </p>

        <div className='flex flex-wrap items-center justify-center gap-4 mb-6'>
          <Button asChild size='lg' className='gap-2 font-semibold rounded-full px-8'>
            <Link href='/upload'>
              Start Stress Test <ArrowRight size={14} />
            </Link>
          </Button>
          <Button asChild variant='outline' size='lg' className='rounded-full px-8'>
            <a href='#how-it-works'>See How It Works</a>
          </Button>
        </div>

        <Link href='/auth/sign-in'
          className='inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300
            transition-colors duration-300 group mb-20'>
          Already a customer?
          <span className='text-[#3B82F6] font-medium group-hover:underline'>
            Sign in <ArrowRight size={12} className='inline' />
          </span>
        </Link>
      </div>

      {/* Perspective dashboard mockup */}
      <div className='relative z-10 mx-auto max-w-7xl -mt-4
        [mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)]'>
        <div className='[perspective:1200px]
          [mask-image:linear-gradient(to_right,black_60%,transparent_100%)]
          -mr-16 pl-16 lg:-mr-56 lg:pl-56'>
          <div style={{ transform: 'rotateX(18deg)' }}>
            <div className='relative lg:h-[44rem] skew-x-[0.36rad]'>
              <DashboardMockup />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function DashboardMockup() {
  return (
    <div className='rounded-xl border border-white/10 overflow-hidden shadow-2xl
      shadow-black/60 bg-[#0d1117] text-white min-h-[600px]'>

      {/* Top bar */}
      <div className='flex items-center justify-between px-5 py-3
        border-b border-white/[0.07] bg-[#0d1117]'>
        <div className='flex items-center gap-3'>
          <Logo size={16} />
          <span className='w-px h-4 bg-white/10' />
          <div className='flex items-center gap-0.5'>
            {['Summary', 'Factors', 'Liquidity', 'Monte Carlo', 'Tax', 'AI Analysis'].map((s, i) => (
              <span key={s}
                className={`relative text-xs px-2.5 py-1 rounded-md whitespace-nowrap
                  ${i === 0 ? 'text-white' : 'text-gray-600'}`}>
                {s}
                {i === 0 && <span className='absolute bottom-0 left-1.5 right-1.5 h-0.5 bg-[#3B82F6] rounded-full' />}
              </span>
            ))}
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-[11px] px-2.5 py-1 rounded-full bg-yellow-500/10
            border border-yellow-500/20 text-yellow-400 font-medium'>
            6.2 / 10 health
          </span>
          <span className='text-[11px] px-2.5 py-1 rounded-full bg-[#3B82F6]/10
            border border-[#3B82F6]/20 text-[#3B82F6] font-medium'>
            2008 GFC
          </span>
        </div>
      </div>

      {/* Metric strip */}
      <div className='flex items-center gap-6 px-5 py-2.5
        border-b border-white/[0.05] bg-white/[0.01] text-xs'>
        {[
          { l: 'Portfolio value', v: '$2,400,000',  c: 'text-white'     },
          { l: 'Stressed value',  v: '$1,838,240',  c: 'text-red-400'   },
          { l: 'Total loss',      v: '−$561,760',   c: 'text-red-400'   },
          { l: 'Recovery time',   v: '3.1 yrs',     c: 'text-[#3B82F6]' },
          { l: 'Ruin probability',v: '12%',          c: 'text-yellow-400'},
          { l: 'Tax savings',     v: '+$14,200',     c: 'text-green-400' },
        ].map(m => (
          <div key={m.l} className='shrink-0'>
            <p className='text-gray-600 mb-0.5'>{m.l}</p>
            <p className={`font-semibold tabular-nums ${m.c}`}>{m.v}</p>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className='grid grid-cols-3 gap-3 p-4'>

        {/* Smart Risk Summary */}
        <div className='col-span-1 bg-white/[0.03] border border-white/[0.07] rounded-xl p-4'>
          <p className='text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-3'>
            Smart risk summary
          </p>
          <div className='flex items-center gap-3 mb-4'>
            <div className='relative w-14 h-14 shrink-0'>
              <svg viewBox='0 0 36 36' className='w-full h-full -rotate-90'>
                <circle cx='18' cy='18' r='15.9' fill='none' stroke='rgba(255,255,255,0.06)' strokeWidth='3.5' />
                <circle cx='18' cy='18' r='15.9' fill='none' stroke='#F59E0B' strokeWidth='3.5'
                  strokeDasharray='62 100' strokeLinecap='round' />
              </svg>
              <div className='absolute inset-0 flex flex-col items-center justify-center'>
                <span className='text-base font-bold text-white leading-none'>6.2</span>
              </div>
            </div>
            <div>
              <p className='text-sm font-semibold text-yellow-400'>Moderate Risk</p>
              <p className='text-[11px] text-gray-500 mt-0.5 leading-relaxed'>
                Elevated tech concentration. Recommend trimming AAPL &amp; MSFT.
              </p>
            </div>
          </div>
          {[
            { l: 'Drawdown',       s: 4 },
            { l: 'Liquidity',      s: 7 },
            { l: 'Diversification',s: 8 },
          ].map(d => (
            <div key={d.l} className='flex items-center gap-2 mb-1.5'>
              <span className='text-[11px] text-gray-600 w-24 shrink-0'>{d.l}</span>
              <div className='flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden'>
                <div className='h-full rounded-full'
                  style={{ width: `${d.s * 10}%`, background: d.s >= 7 ? '#10B981' : d.s >= 5 ? '#F59E0B' : '#EF4444' }} />
              </div>
              <span className='text-[11px] tabular-nums text-gray-600 w-6 text-right'>{d.s}</span>
            </div>
          ))}
        </div>

        {/* Factor attribution */}
        <div className='col-span-1 bg-white/[0.03] border border-white/[0.07] rounded-xl p-4'>
          <p className='text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-3'>
            Factor attribution
          </p>
          <div className='space-y-2.5'>
            {[
              { l: 'Market beta',   v: '−14.2%', w: 82 },
              { l: 'Rate risk',     v: '−5.1%',  w: 55 },
              { l: 'Credit spread', v: '−2.8%',  w: 34 },
              { l: 'Inflation',     v: '−1.9%',  w: 22 },
              { l: 'Growth',        v: '−0.6%',  w: 10 },
            ].map(f => (
              <div key={f.l} className='flex items-center gap-2'>
                <span className='text-[11px] text-gray-500 w-22 shrink-0'>{f.l}</span>
                <div className='flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden'>
                  <div className='h-full bg-red-500/60 rounded-full' style={{ width: `${f.w}%` }} />
                </div>
                <span className='text-[11px] text-red-400 tabular-nums w-10 text-right'>{f.v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Memo */}
        <div className='col-span-1 bg-[#3B82F6]/10 border border-[#3B82F6]/20 rounded-xl p-4'>
          <div className='flex items-center gap-1.5 mb-3'>
            <div className='w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse' />
            <p className='text-[10px] font-semibold uppercase tracking-widest text-[#3B82F6]'>
              AI analyst memo
            </p>
          </div>
          <p className='text-xs text-gray-300 leading-relaxed mb-3'>
            Under a 2008-style scenario, this portfolio faces a{' '}
            <span className='text-white font-semibold'>23.4% drawdown</span>, driven primarily
            by market beta (61%) and rate sensitivity.
          </p>
          <p className='text-xs text-gray-400 leading-relaxed mb-4'>
            Priority: trim AAPL and MSFT — they account for{' '}
            <span className='text-white font-medium'>67% of total stress loss</span>.
            Harvest $38K in losses before year-end to offset gains.
          </p>
          <div className='space-y-1.5'>
            {['Reduce AAPL: 18% → 10%', 'Increase AGG: 8% → 14%', 'Harvest INTC losses ($12K)'].map(a => (
              <div key={a} className='flex items-center gap-2 text-[11px] text-gray-400'>
                <span className='w-1.5 h-1.5 rounded-full bg-[#3B82F6]/60 shrink-0' />
                {a}
              </div>
            ))}
          </div>
        </div>

        {/* Monte Carlo */}
        <div className='col-span-2 bg-white/[0.03] border border-white/[0.07] rounded-xl p-4'>
          <p className='text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-3'>
            Monte Carlo — 1,000 paths
          </p>
          <div className='flex items-end gap-1 h-20 mb-3'>
            {[3,5,8,14,22,31,38,34,26,18,12,7,4,2].map((h, i) => {
              const max = 38
              return (
                <div key={i} className='flex-1 rounded-sm'
                  style={{
                    height: `${(h / max) * 100}%`,
                    background: i < 3 ? '#EF4444' : i > 10 ? '#10B981' : '#3B82F6',
                    opacity: 0.55 + (i / 14) * 0.35,
                  }} />
              )
            })}
          </div>
          <div className='grid grid-cols-3 gap-2'>
            {[
              { l: 'P10 (worst 10%)', v: '$1.2M', c: 'text-red-400' },
              { l: 'P50 (median)',     v: '$2.1M', c: 'text-[#3B82F6]' },
              { l: 'P90 (best 10%)',  v: '$3.4M', c: 'text-green-400' },
            ].map(s => (
              <div key={s.l} className='bg-white/[0.04] border border-white/[0.06] rounded-xl p-2.5 text-center'>
                <p className='text-[10px] text-gray-600 mb-1'>{s.l}</p>
                <p className={`text-sm font-semibold tabular-nums ${s.c}`}>{s.v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tax + Rebalancing */}
        <div className='col-span-1 bg-white/[0.03] border border-white/[0.07] rounded-xl p-4'>
          <p className='text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-3'>
            Tax &amp; rebalancing
          </p>
          <div className='space-y-2'>
            {[
              { l: 'TLH opportunities', v: '$38,400',  c: 'text-green-400' },
              { l: 'Est. tax savings',   v: '$11,200',  c: 'text-green-400' },
              { l: 'Withdrawal drag',    v: '−$4,800',  c: 'text-red-400'   },
            ].map(r => (
              <div key={r.l} className='flex items-center justify-between py-1.5
                border-b border-white/[0.04] last:border-0'>
                <span className='text-[11px] text-gray-500'>{r.l}</span>
                <span className={`text-xs font-semibold tabular-nums ${r.c}`}>{r.v}</span>
              </div>
            ))}
          </div>
          <div className='mt-3 pt-3 border-t border-white/[0.06]'>
            <p className='text-[10px] text-gray-600 mb-1.5'>Suggested trades</p>
            {[
              { t: 'AAPL', a: 'Reduce', c: 'text-red-400' },
              { t: 'AGG',  a: 'Increase', c: 'text-green-400' },
            ].map(r => (
              <div key={r.t} className='flex items-center gap-2 text-[11px] mb-1'>
                <span className='font-semibold text-white w-8'>{r.t}</span>
                <span className={r.c}>{r.a}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className='flex items-center justify-between px-5 py-2
        border-t border-white/[0.05] bg-white/[0.01]'>
        <p className='text-[10px] text-gray-700'>
          AI-assisted analysis — verify before client delivery
        </p>
        <div className='flex items-center gap-3'>
          <button className='text-[11px] text-[#3B82F6] font-medium hover:underline'>
            Export PDF
          </button>
          <button className='text-[11px] text-[#3B82F6] font-medium hover:underline'>
            Present to client
          </button>
        </div>
      </div>
    </div>
  )
}
