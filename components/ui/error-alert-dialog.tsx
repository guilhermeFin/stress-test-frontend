'use client'

import { XCircle } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface ErrorAlertDialogProps {
  open: boolean
  onDismiss: () => void
  title?: string
  description?: string
  errorCode?: string
}

export function ErrorAlertDialog({
  open,
  onDismiss,
  title = 'Error Detected',
  description = "We've encountered an error processing your request. Please try again or contact support if the issue persists.",
  errorCode,
}: ErrorAlertDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={v => { if (!v) onDismiss() }}>
      <AlertDialogContent className='bg-gray-900 text-white border-0'>
        <AlertDialogHeader>
          <div className='flex items-center gap-2'>
            <XCircle className='h-5 w-5 text-rose-400' />
            <AlertDialogTitle className='text-white'>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className='text-gray-300'>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {errorCode && (
          <div className='bg-gray-800 p-3 rounded-md my-2 text-sm text-gray-300 font-mono'>
            {errorCode}
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={onDismiss}
            className='bg-gray-700 border-gray-700 hover:bg-gray-800 text-white hover:text-white'>
            Dismiss
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => window.open('mailto:support@vantage.app', '_blank')}
            className='bg-rose-500 hover:bg-rose-600 text-white hover:text-white'>
            Contact Support
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
