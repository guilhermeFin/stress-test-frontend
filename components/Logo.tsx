interface LogoProps {
  variant?: 'default' | 'icon' | 'dark'
  className?: string
  height?: number
}

const WHITE = '#FFFFFF'
const DARK  = '#0A0F1E'
const BLUE  = '#3B82F6'

export default function Logo({ variant = 'default', className = '', height = 24 }: LogoProps) {
  const color = variant === 'dark' ? DARK : WHITE

  if (variant === 'icon') {
    return (
      <svg
        viewBox="0 0 24 24"
        height={height}
        width={height}
        className={className}
        fill="none"
        aria-label="Vantage"
      >
        <path
          d="M 3,22 L 12,2 L 21,22 M 6.5,14 L 17.5,14"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        <polygon points="9,21 15,21 12,15.5" fill={BLUE} />
      </svg>
    )
  }

  const w = height * (148 / 30)

  return (
    <svg
      viewBox="0 0 148 30"
      height={height}
      width={w}
      className={className}
      fill="none"
      aria-label="VANTAGE"
    >
      {/* V */}
      <path d="M 2,2 L 11,28 L 20,2" stroke={color} strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />

      {/* A */}
      <path d="M 23,28 L 32,2 L 41,28 M 27,17 L 37,17" stroke={color} strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
      <polygon points="29,26 35,26 32,19" fill={BLUE} />

      {/* N */}
      <path d="M 44,28 L 44,2 L 62,28 L 62,2" stroke={color} strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />

      {/* T */}
      <path d="M 65,2 L 83,2 M 74,2 L 74,28" stroke={color} strokeWidth="2" strokeLinecap="square" />

      {/* A */}
      <path d="M 86,28 L 95,2 L 104,28 M 90,17 L 100,17" stroke={color} strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
      <polygon points="92,26 98,26 95,19" fill={BLUE} />

      {/* G */}
      <path d="M 125,2 L 107,2 L 107,28 L 125,28 L 125,16 L 117,16" stroke={color} strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />

      {/* E */}
      <path d="M 128,2 L 128,28 M 128,2 L 146,2 M 128,15 L 140,15 M 128,28 L 146,28" stroke={color} strokeWidth="2" strokeLinecap="square" />
    </svg>
  )
}
