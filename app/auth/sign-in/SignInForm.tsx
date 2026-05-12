'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { ArrowRight, Mail, AlertCircle, BarChart3, Shield, TrendingDown, User, ArrowLeft } from 'lucide-react'
import Logo from '@/components/Logo'
import Link from 'next/link'

type Mode = 'signin' | 'signup'
type Step = 'initial' | 'otp'

export default function SignInForm() {
  const searchParams = useSearchParams()
  const callbackUrl  = searchParams.get('callbackUrl') ?? '/dashboard'
  const urlError     = searchParams.get('error')

  const [mode, setMode]       = useState<Mode>('signin')
  const [step, setStep]       = useState<Step>('initial')
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [otp, setOtp]         = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(
    urlError ? 'Authentication failed. Please try again.' : ''
  )

  const switchMode = (m: Mode) => {
    setMode(m)
    setStep('initial')
    setError('')
    setOtp('')
  }

  const handleSendOtp = async () => {
    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your full name.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), name: name.trim() || undefined }),
      })
      const data = await res.json() as { error?: string }
      if (!res.ok) {
        setError(data.error ?? 'Failed to send code. Please try again.')
        return
      }
      setStep('otp')
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (otp.length < 6) return
    setLoading(true)
    setError('')
    const result = await signIn('otp', { email: email.trim().toLowerCase(), otp, redirect: false })
    setLoading(false)
    if (result?.error) {
      setError('Invalid or expired code. Please try again.')
      setOtp('')
    } else {
      window.location.href = callbackUrl
    }
  }

  const isSignUp = mode === 'signup'

  return (
    <div className='min-h-screen bg-[#0A0F1E] flex items-center justify-center p-4'>
      <div className='w-full max-w-5xl flex flex-col md:flex-row rounded-[2rem] overflow-hidden
        shadow-2xl shadow-black/60 border border-white/[0.07]'>

        {/* ── Left panel ──────────────────────────────────────────────── */}
        <div className='relative md:w-1/2 bg-[#07090F] p-10 md:p-14 flex flex-col
          justify-between overflow-hidden min-h-[280px] md:min-h-[680px]'>

          <div className='absolute top-[-20%] left-[-15%] w-[70%] h-[70%] rounded-full pointer-events-none'
            style={{ background: 'radial-gradient(circle, #3B82F620 0%, transparent 70%)' }} />
          <div className='absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full pointer-events-none'
            style={{ background: 'radial-gradient(circle, #8B5CF615 0%, transparent 70%)' }} />
          <div className='absolute inset-0 pointer-events-none'
            style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.015) 60px, rgba(255,255,255,0.015) 61px)' }} />
          <div className='absolute inset-0 bg-gradient-to-b from-black/40 to-transparent pointer-events-none' />

          <div className='relative z-10'>
            <Link href='/'>
              <Logo size={20} />
            </Link>
          </div>

          <div className='relative z-10'>
            <p className='text-[10px] font-semibold uppercase tracking-widest text-[#3B82F6] mb-4'>
              Institutional-grade risk
            </p>
            <h2 className='text-2xl md:text-3xl font-bold text-white leading-snug tracking-tight mb-6'>
              Clarity in uncertainty.<br />Confidence in every decision.
            </h2>

            <div className='grid grid-cols-3 gap-3 mb-8'>
              {[
                { icon: BarChart3,    label: 'Analysis sections', value: '12'  },
                { icon: TrendingDown, label: 'Crisis scenarios',   value: '6+' },
                { icon: Shield,       label: 'Time to results',    value: '60s'},
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className='bg-white/[0.04] border border-white/[0.07] rounded-xl p-3'>
                  <Icon size={14} className='text-[#3B82F6] mb-2' />
                  <p className='text-lg font-bold text-white leading-none mb-1'>{value}</p>
                  <p className='text-[10px] text-gray-600 leading-tight'>{label}</p>
                </div>
              ))}
            </div>

            <p className='text-xs text-gray-600'>
              Trusted by independent wealth managers and RIAs.
            </p>
          </div>
        </div>

        {/* ── Right panel ─────────────────────────────────────────────── */}
        <div className='relative md:w-1/2 bg-[#0D1120] p-10 md:p-14 flex flex-col justify-center'>

          {/* Back to home */}
          <Link href='/'
            className='inline-flex items-center gap-1.5 text-xs text-gray-500
              hover:text-gray-300 transition-colors mb-8 self-start'>
            <ArrowLeft size={12} />
            Back to home
          </Link>

          {/* Logo mark */}
          <div className='w-10 h-10 rounded-xl bg-[#3B82F6]/15 border border-[#3B82F6]/25
            flex items-center justify-center mb-8'>
            <div className='w-4 h-4 rounded-md bg-[#3B82F6]' />
          </div>

          {/* Mode toggle — only show on initial step */}
          {step === 'initial' && (
            <div className='flex items-center gap-1 p-1 rounded-xl bg-white/[0.04]
              border border-white/[0.07] mb-8 self-start'>
              {(['signin', 'signup'] as Mode[]).map(m => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    mode === m
                      ? 'bg-[#3B82F6] text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {m === 'signin' ? 'Sign in' : 'Create account'}
                </button>
              ))}
            </div>
          )}

          <h1 className='text-2xl font-bold text-white tracking-tight mb-1.5'>
            {step === 'otp'
              ? 'Check your email'
              : isSignUp
              ? 'Create your account'
              : 'Welcome back'}
          </h1>
          <p className='text-sm text-gray-500 mb-8'>
            {step === 'otp'
              ? `We sent a 6-digit code to ${email}`
              : isSignUp
              ? 'Start your 14-day free trial — no credit card required'
              : 'Sign in to your Vantage advisor workspace'}
          </p>

          {/* OAuth — only on initial step */}
          {step === 'initial' && (
            <>
              <div className='space-y-2.5 mb-6'>
                <button
                  onClick={() => signIn('google', { callbackUrl })}
                  className='w-full flex items-center justify-center gap-3 px-4 py-3
                    bg-white/[0.04] hover:bg-white/[0.07] border border-white/10
                    hover:border-white/20 rounded-xl text-sm font-medium text-white
                    transition-all duration-200'>
                  <GoogleIcon />
                  {isSignUp ? 'Sign up with Google' : 'Continue with Google'}
                </button>
                <button
                  onClick={() => signIn('microsoft-entra-id', { callbackUrl })}
                  className='w-full flex items-center justify-center gap-3 px-4 py-3
                    bg-white/[0.04] hover:bg-white/[0.07] border border-white/10
                    hover:border-white/20 rounded-xl text-sm font-medium text-white
                    transition-all duration-200'>
                  <MicrosoftIcon />
                  {isSignUp ? 'Sign up with Microsoft' : 'Continue with Microsoft'}
                </button>
              </div>

              <div className='flex items-center gap-4 mb-6'>
                <div className='flex-1 h-px bg-white/8' />
                <span className='text-xs text-gray-600'>or with email</span>
                <div className='flex-1 h-px bg-white/8' />
              </div>
            </>
          )}

          {/* Form fields */}
          {step === 'initial' ? (
            <div className='space-y-3'>
              {/* Name field — sign-up only */}
              {isSignUp && (
                <div>
                  <label className='block text-xs font-medium text-gray-400 mb-1.5'>
                    Full name
                  </label>
                  <div className='relative'>
                    <User size={14} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600' />
                    <input
                      type='text'
                      value={name}
                      onChange={e => { setName(e.target.value); setError('') }}
                      onKeyDown={e => { if (e.key === 'Enter') handleSendOtp() }}
                      placeholder='Jane Smith'
                      autoComplete='name'
                      className='w-full bg-white/[0.04] border border-white/10 rounded-xl
                        pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600
                        focus:outline-none focus:border-[#3B82F6]/50 transition-colors'
                    />
                  </div>
                </div>
              )}

              <div>
                <label className='block text-xs font-medium text-gray-400 mb-1.5'>
                  Work email address
                </label>
                <div className='relative'>
                  <Mail size={14} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600' />
                  <input
                    type='email'
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError('') }}
                    onKeyDown={e => { if (e.key === 'Enter') handleSendOtp() }}
                    placeholder='you@yourfirm.com'
                    autoComplete='email'
                    className='w-full bg-white/[0.04] border border-white/10 rounded-xl
                      pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600
                      focus:outline-none focus:border-[#3B82F6]/50 transition-colors'
                  />
                </div>
              </div>

              {error && (
                <div className='flex items-start gap-2 text-red-400 text-xs'>
                  <AlertCircle size={12} className='mt-0.5 shrink-0' />
                  {error}
                </div>
              )}

              <button
                onClick={handleSendOtp}
                disabled={loading || !email.trim()}
                className='w-full flex items-center justify-center gap-2 py-3 rounded-xl
                  text-sm font-semibold text-white bg-[#3B82F6] hover:bg-[#2563EB]
                  transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                {loading
                  ? <span className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                  : isSignUp
                  ? <><Mail size={14} /> Create account</>
                  : <><Mail size={14} /> Send sign-in code</>}
              </button>

              {isSignUp && (
                <p className='text-[11px] text-gray-600 text-center leading-relaxed'>
                  We'll send a verification code to confirm your email.
                </p>
              )}
            </div>
          ) : (
            <div className='space-y-3'>
              <div>
                <label className='block text-xs font-medium text-gray-400 mb-1.5'>
                  6-digit code
                </label>
                <input
                  type='text'
                  inputMode='numeric'
                  pattern='[0-9]*'
                  maxLength={6}
                  value={otp}
                  onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); setError('') }}
                  onKeyDown={e => { if (e.key === 'Enter') handleVerifyOtp() }}
                  placeholder='000000'
                  autoFocus
                  className='w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3
                    text-sm text-white placeholder-gray-600 focus:outline-none
                    focus:border-[#3B82F6]/50 tracking-[0.4em] text-center font-mono transition-colors'
                />
              </div>

              {error && (
                <div className='flex items-start gap-2 text-red-400 text-xs'>
                  <AlertCircle size={12} className='mt-0.5 shrink-0' />
                  {error}
                </div>
              )}

              <button
                onClick={handleVerifyOtp}
                disabled={loading || otp.length < 6}
                className='w-full flex items-center justify-center gap-2 py-3 rounded-xl
                  text-sm font-semibold text-white bg-[#3B82F6] hover:bg-[#2563EB]
                  transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                {loading
                  ? <span className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                  : isSignUp
                  ? <>Verify &amp; create account <ArrowRight size={14} /></>
                  : <>Sign in <ArrowRight size={14} /></>}
              </button>

              <button
                onClick={() => { setStep('initial'); setOtp(''); setError('') }}
                className='w-full text-xs text-gray-600 hover:text-gray-400 py-1 transition-colors'>
                Use a different email
              </button>
            </div>
          )}

          {/* Footer */}
          <p className='text-xs text-gray-700 mt-8 leading-relaxed'>
            By continuing you agree to our{' '}
            <a href='#' className='text-gray-500 hover:text-gray-300 underline underline-offset-2 transition-colors'>Terms</a>
            {' '}and{' '}
            <a href='#' className='text-gray-500 hover:text-gray-300 underline underline-offset-2 transition-colors'>Privacy Policy</a>.
          </p>

          {/* Dev bypass */}
          <div className='mt-4 text-center'>
            <a href='/dashboard'
              className='text-xs text-gray-800 hover:text-gray-600 transition-colors
                border border-white/[0.04] rounded-lg px-3 py-1.5 hover:border-white/[0.08]'>
              Skip sign-in (dev only)
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width='16' height='16' viewBox='0 0 24 24' aria-hidden='true'>
      <path d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' fill='#4285F4' />
      <path d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' fill='#34A853' />
      <path d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' fill='#FBBC05' />
      <path d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' fill='#EA4335' />
    </svg>
  )
}

function MicrosoftIcon() {
  return (
    <svg width='16' height='16' viewBox='0 0 21 21' aria-hidden='true'>
      <rect x='1' y='1' width='9' height='9' fill='#f25022' />
      <rect x='11' y='1' width='9' height='9' fill='#7fba00' />
      <rect x='1' y='11' width='9' height='9' fill='#00a4ef' />
      <rect x='11' y='11' width='9' height='9' fill='#ffb900' />
    </svg>
  )
}
