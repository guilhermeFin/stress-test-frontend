import { Suspense } from 'react'
import SignInForm from './SignInForm'

export const metadata = { title: 'Sign in — Vantage' }

export default function SignInPage() {
  return (
    <Suspense fallback={<div className='min-h-screen bg-[#0A0F1E]' />}>
      <SignInForm />
    </Suspense>
  )
}
