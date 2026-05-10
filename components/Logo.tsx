'use client'

import { Audiowide } from 'next/font/google'
import { CSSProperties } from 'react'

const audiowide = Audiowide({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-audiowide',
  display: 'swap',
})

interface LogoProps {
  variant?: 'default' | 'icon' | 'dark'
  className?: string
  /** Font size of the wordmark in pixels (logo scales with this) */
  size?: number
}

const WHITE = '#FFFFFF'
const DARK  = '#0A0F1E'
const BLUE  = '#3B82F6'

export default function Logo({
  variant = 'default',
  className = '',
  size = 24,
}: LogoProps) {
  const color = variant === 'dark' ? DARK : WHITE

  if (variant === 'icon') {
    const px = size
    return (
      <svg
        viewBox="0 0 24 24"
        height={px}
        width={px}
        className={className}
        fill="none"
        aria-label="Vantage"
      >
        <path
          d="M 3,22 L 12,2 L 21,22 M 6.5,14 L 17.5,14"
          stroke={color}
          strokeWidth="2.4"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        <polygon points="9,21 15,21 12,15.5" fill={BLUE} />
      </svg>
    )
  }

  const triangleSize = size * 0.18
  const triangleStyle: CSSProperties = {
    display: 'inline-block',
    width: 0,
    height: 0,
    borderLeft: `${triangleSize / 2}px solid transparent`,
    borderRight: `${triangleSize / 2}px solid transparent`,
    borderBottom: `${triangleSize}px solid ${BLUE}`,
    position: 'absolute',
    bottom: `${size * 0.06}px`,
    left: '50%',
    transform: 'translateX(-50%)',
    pointerEvents: 'none',
  }

  // Build the letters of "VANTAGE", with the A's wrapped so we can layer the triangle
  return (
    <span
      className={`${audiowide.className} ${className}`}
      style={{
        fontSize: `${size}px`,
        color,
        letterSpacing: '0.08em',
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
      }}
      aria-label="VANTAGE"
    >
      <span>V</span>
      <span style={{ position: 'relative', display: 'inline-block' }}>
        A<span style={triangleStyle} />
      </span>
      <span>NT</span>
      <span style={{ position: 'relative', display: 'inline-block' }}>
        A<span style={triangleStyle} />
      </span>
      <span>GE</span>
    </span>
  )
}
