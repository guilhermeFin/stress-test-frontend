'use client'

import { ElegantShape } from '@/components/ui/shape-landing-hero'

export default function GlobalBackground() {
  return (
    <div
      className='fixed inset-0 z-0 overflow-hidden pointer-events-none'
      aria-hidden
    >
      {/* Large left anchor — blue */}
      <ElegantShape
        delay={0.2}
        width={620}
        height={145}
        rotate={12}
        gradient='from-blue-500/[0.13]'
        className='left-[-12%] top-[10%]'
      />
      {/* Right mid — indigo */}
      <ElegantShape
        delay={0.45}
        width={520}
        height={120}
        rotate={-15}
        gradient='from-indigo-500/[0.12]'
        className='right-[-8%] top-[55%]'
      />
      {/* Bottom-left — cyan */}
      <ElegantShape
        delay={0.35}
        width={340}
        height={85}
        rotate={-8}
        gradient='from-cyan-500/[0.10]'
        className='left-[3%] bottom-[8%]'
      />
      {/* Top-right — blue lighter */}
      <ElegantShape
        delay={0.6}
        width={220}
        height={62}
        rotate={22}
        gradient='from-blue-400/[0.12]'
        className='right-[18%] top-[8%]'
      />
      {/* Upper-center-left — violet */}
      <ElegantShape
        delay={0.7}
        width={160}
        height={44}
        rotate={-28}
        gradient='from-violet-500/[0.11]'
        className='left-[22%] top-[4%]'
      />
      {/* Center-right lower — indigo small */}
      <ElegantShape
        delay={0.55}
        width={280}
        height={70}
        rotate={18}
        gradient='from-indigo-400/[0.09]'
        className='right-[5%] bottom-[30%]'
      />
      {/* Bottom-right — cyan small */}
      <ElegantShape
        delay={0.8}
        width={190}
        height={52}
        rotate={-10}
        gradient='from-cyan-400/[0.10]'
        className='right-[35%] bottom-[5%]'
      />
    </div>
  )
}
