'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, ArrowRight, AlertCircle } from 'lucide-react'
import Logo from '@/components/Logo'
import { Button } from '@/components/ui/neon-button'

type Step = 'initial' | 'otp'

export default function SignInForm() {
  const searchParams  = useSearchParams()
  const callbackUrl   = searchParams.get('callbackUrl') ?? '/dashboard'
  const urlError      = searchParams.get('error')

  const [step, setStep]       = useState<Step>('initial')
  const [email, setEmail]     = useState('')
  const [otp, setOtp]         = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(
    urlError ? 'Authentication failed. Please try again.' : ''
  )

  const handleSendOtp = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Enter a valid email address.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
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

  return (
    <main className='min-h-screen bg-[#0A0F1E] flex items-center justify-center px-4'>
      <div className='fixed inset-0 pointer-events-none overflow-hidden' aria-hidden>
        <div className='absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full opacity-[0.05]'
          style={{ background: 'radial-gradient(circle at center, #3B82F6 0%, transparent 68%)' }} />
        <div className='absolute bottom-0 right-[-5%] w-[30vw] h-[30vw] rounded-full opacity-[0.03]'
          style={{ background: 'radial-gradient(circle at center, #3B82F6 0%, transparent 68%)' }} />
      </div>

      <div className='relative w-full max-w-sm'>

        <Link href='/'
          className='inline-flex items-center gap-2 text-gray-500 hover:text-gray-300
            text-sm transition-colors mb-8 group'>
          <ArrowLeft size={14} className='group-hover:-translate-x-0.5 transition-transform' />
          Back to Vantage
        </Link>

        {/* Card */}
        <div className='p-[1.5px] rounded-[1.75rem] bg-gradient-to-b from-white/10 to-white/5'>
          <div className='rounded-[calc(1.75rem-1.5px)] bg-[#0D1120] p-8
            shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'>

            <div className='flex items-center gap-3 mb-8'>
              <Logo size={20} />
              <div className='h-4 w-px bg-white/10' />
              <span className='text-xs text-gray-500 uppercase tracking-wider'>Advisor portal</span>
            </div>

            <h1 className='text-2xl font-bold text-white mb-1.5 tracking-tight'>Welcome back</h1>
            <p className='text-sm text-gray-500 mb-7'>Sign in to your Vantage workspace</p>

            {/* OAuth */}
            <div className='space-y-2.5 mb-6'>
              <button
                onClick={() => signIn('google', { callbackUrl })}
                className='w-full flex items-center justify-center gap-3 px-4 py-3
                  bg-white/[0.04] hover:bg-white/[0.07] border border-white/10
                  hover:border-white/20 rounded-xl text-sm font-medium text-white
                  transition-all duration-200 group'>
                <GoogleIcon />
                Continue with Google
              </button>
              <button
                onClick={() => signIn('microsoft-entra-id', { callbackUrl })}
                className='w-full flex items-center justify-center gap-3 px-4 py-3
                  bg-white/[0.04] hover:bg-white/[0.07] border border-white/10
                  hover:border-white/20 rounded-xl text-sm font-medium text-white
                  transition-all duration-200'>
                <MicrosoftIcon />
                Continue with Microsoft
              </button>
            </div>

            <div className='flex items-center gap-4 mb-6'>
              <div className='flex-1 h-px bg-white/8' />
              <span className='text-xs text-gray-600'>or sign in with email</span>
              <div className='flex-1 h-px bg-white/8' />
            </div>

            {/* Email OTP flow */}
            {step === 'initial' ? (
              <div className='space-y-3'>
                <div className='relative'>
                  <Mail size={14} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500' />
                  <input
                    type='email'
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError('') }}
                    onKeyDown={e => { if (e.key === 'Enter') handleSendOtp() }}
                    placeholder='Work email address'
                    autoComplete='email'
                    className='w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-3
                      text-sm text-white placeholder-gray-600 focus:outline-none
                      focus:border-[#3B82F6]/50 transition-colors'
                  />
                </div>
                {error && (
                  <div className='flex items-start gap-2 text-red-400 text-xs leading-relaxed'>
                    <AlertCircle size={12} className='mt-0.5 shrink-0' />
                    {error}
                  </div>
                )}
                <Button
                  onClick={handleSendOtp}
                  disabled={loading || !email.trim()}
                  variant='solid'
                  className='w-full py-3 rounded-xl text-sm font-semibold disabled:opacity-50
                    disabled:cursor-not-allowed mx-0 flex items-center justify-center gap-2'>
                  {loading
                    ? <span className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                    : <><Mail size={14} /> Send sign-in code</>}
                </Button>
              </div>
            ) : (
              <div className='space-y-3'>
                <p className='text-xs text-gray-500'>
                  6-digit code sent to <span className='text-gray-300 font-medium'>{email}</span>
                </p>
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
                {error && (
                  <div className='flex items-start gap-2 text-red-400 text-xs leading-relaxed'>
                    <AlertCircle size={12} className='mt-0.5 shrink-0' />
                    {error}
                  </div>
                )}
                <Button
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.length < 6}
                  variant='solid'
                  className='w-full py-3 rounded-xl text-sm font-semibold disabled:opacity-50
                    disabled:cursor-not-allowed mx-0 flex items-center justify-center gap-2'>
                  {loading
                    ? <span className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                    : <>Sign in <ArrowRight size={14} /></>}
                </Button>
                <button
                  onClick={() => { setStep('initial'); setOtp(''); setError('') }}
                  className='w-full text-xs text-gray-600 hover:text-gray-400 py-1 transition-colors'>
                  Use a different email
                </button>
              </div>
            )}
          </div>
        </div>

        <p className='text-center text-xs text-gray-700 mt-5 leading-relaxed'>
          By signing in you agree to our{' '}
          <a href='#' className='text-gray-500 hover:text-gray-300 underline underline-offset-2 transition-colors'>
            Terms of Service
          </a>{' '}
          and{' '}
          <a href='#' className='text-gray-500 hover:text-gray-300 underline underline-offset-2 transition-colors'>
            Privacy Policy
          </a>
        </p>

        {/* Dev bypass — remove before launch */}
        <div className='mt-6 text-center'>
          <a
            href='/dashboard'
            className='text-xs text-gray-700 hover:text-gray-500 transition-colors
              border border-white/[0.06] rounded-lg px-3 py-1.5 hover:border-white/10'
          >
            Skip sign-in (dev only)
          </a>
        </div>
      </div>
    </main>
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
