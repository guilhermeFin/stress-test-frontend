'use client'

interface BorderBeamProps {
  duration?: number
  colorFrom?: string
  colorTo?: string
}

export function BorderBeam({
  duration = 8,
  colorFrom = '#3B82F6',
  colorTo = '#8B5CF6',
}: BorderBeamProps) {
  return (
    <div className='absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none'>
      <div
        className='absolute inset-[-50%]'
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, transparent 0%, transparent 74%, ${colorFrom} 87%, ${colorTo} 94%, transparent 100%)`,
          animation: `border-beam-rotate ${duration}s linear infinite`,
        }}
      />
    </div>
  )
}
