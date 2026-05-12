import Link from 'next/link'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import Logo from '@/components/Logo'

export const metadata = { title: 'Sign-in error — Vantage' }

const MESSAGES: Record<string, string> = {
  Configuration: 'There is a problem with the server configuration. Please contact support.',
  AccessDenied: 'You do not have permission to sign in to this workspace.',
  Verification: 'The sign-in code has expired. Please request a new one.',
  OAuthSignin: 'Could not start the OAuth sign-in flow. Please try again.',
  OAuthCallback: 'OAuth sign-in failed. Please try again or use a different method.',
  OAuthAccountNotLinked: 'This email is already registered with a different sign-in method.',
  Default: 'An unexpected error occurred during sign-in. Please try again.',
}

export default async function AuthError({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const message = MESSAGES[error ?? ''] ?? MESSAGES.Default

  return (
    <main className='min-h-screen bg-[#0A0F1E] flex items-center justify-center px-4'>
      <div className='fixed inset-0 pointer-events-none' aria-hidden>
        <div className='absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full opacity-[0.05]'
          style={{ background: 'radial-gradient(circle at center, #3B82F6 0%, transparent 68%)' }} />
      </div>

      <div className='relative w-full max-w-sm text-center'>
        <div className='flex justify-center mb-8'>
          <Logo size={24} />
        </div>

        <div className='w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl
          flex items-center justify-center mx-auto mb-5'>
          <AlertTriangle size={24} className='text-red-400' />
        </div>

        <h1 className='text-xl font-bold text-white mb-2 tracking-tight'>Sign-in error</h1>
        <p className='text-gray-400 text-sm mb-8 leading-relaxed max-w-xs mx-auto'>{message}</p>

        <Link href='/auth/sign-in'
          className='inline-flex items-center gap-2 text-[#3B82F6] hover:text-[#3B82F6]/80
            text-sm font-medium transition-colors'>
          <ArrowLeft size={14} />
          Back to sign in
        </Link>
      </div>
    </main>
  )
}
