import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string
      firmId: string
      role: string
      plan: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string
    firmId?: string
    role?: string
    plan?: string
  }
}
