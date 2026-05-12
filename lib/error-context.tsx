'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { ErrorAlertDialog } from '@/components/ui/error-alert-dialog'

interface ErrorState {
  title?: string
  description?: string
  errorCode?: string
}

interface ErrorContextValue {
  showError: (description: string, opts?: { title?: string; errorCode?: string }) => void
}

const ErrorContext = createContext<ErrorContextValue | null>(null)

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<ErrorState | null>(null)

  const showError = useCallback((description: string, opts?: { title?: string; errorCode?: string }) => {
    setError({ description, title: opts?.title, errorCode: opts?.errorCode })
  }, [])

  return (
    <ErrorContext.Provider value={{ showError }}>
      {children}
      <ErrorAlertDialog
        open={error !== null}
        onDismiss={() => setError(null)}
        title={error?.title}
        description={error?.description}
        errorCode={error?.errorCode}
      />
    </ErrorContext.Provider>
  )
}

export function useError() {
  const ctx = useContext(ErrorContext)
  if (!ctx) throw new Error('useError must be used inside ErrorProvider')
  return ctx
}
