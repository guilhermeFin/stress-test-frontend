import NextAuth, { type NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import MicrosoftEntra from 'next-auth/providers/microsoft-entra-id'
import Credentials from 'next-auth/providers/credentials'
import { SignJWT, jwtVerify } from 'jose'
import type { JWT } from 'next-auth/jwt'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

const config: NextAuthConfig = {
  pages: {
    signIn: '/auth/sign-in',
    error: '/auth/error',
  },
  session: { strategy: 'jwt' },
  // Produce standard HS256 JWTs so FastAPI can verify with AUTH_SECRET
  jwt: {
    async encode({ secret, token, maxAge = 30 * 24 * 60 * 60 }) {
      const key = new TextEncoder().encode(
        Array.isArray(secret) ? secret[0] : (secret as string)
      )
      return new SignJWT(token as Record<string, unknown>)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(Math.floor(Date.now() / 1000) + maxAge)
        .sign(key)
    },
    async decode({ secret, token }) {
      if (!token) return null
      try {
        const key = new TextEncoder().encode(
          Array.isArray(secret) ? secret[0] : (secret as string)
        )
        const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] })
        return payload as JWT
      } catch {
        return null
      }
    },
  },
  callbacks: {
    // Middleware authorization: only /clients, /household, /settings require auth
    authorized({ auth: session, request: { nextUrl } }) {
      const { pathname } = nextUrl
      const requiresAuth =
        pathname.startsWith('/clients') ||
        pathname.startsWith('/household') ||
        pathname.startsWith('/settings')
      if (!requiresAuth) return true
      return !!session?.user
    },
    // On first sign-in, sync user with FastAPI to get firm context
    async jwt({ token, account, trigger }) {
      if (trigger === 'signIn' || trigger === 'signUp') {
        try {
          const res = await fetch(`${API_URL}/api/v1/auth/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: token.email,
              name: token.name ?? token.email,
              provider: account?.provider ?? 'credentials',
            }),
            signal: AbortSignal.timeout(5000),
          })
          if (res.ok) {
            const data = await res.json() as {
              user_id: string
              firm_id: string
              role: string
              plan: string
            }
            token.userId = data.user_id
            token.firmId = data.firm_id
            token.role = data.role
            token.plan = data.plan
          }
        } catch {
          // Backend sync not yet wired — JWT is still valid, defaults applied in session callback
        }
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: (token.userId as string) ?? token.sub ?? '',
          firmId: (token.firmId as string) ?? '',
          role: (token.role as string) ?? 'owner',
          plan: (token.plan as string) ?? 'starter',
        },
      }
    },
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID ?? '',
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? '',
    }),
    MicrosoftEntra({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID ?? '',
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET ?? '',
      // For single-tenant, set issuer: `https://login.microsoftonline.com/${tenantId}/v2.0`
      ...(process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID && {
        issuer: `https://login.microsoftonline.com/${process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID}/v2.0`,
      }),
    }),
    Credentials({
      id: 'otp',
      name: 'Email OTP',
      credentials: {
        email: { type: 'email' },
        otp: { type: 'text' },
      },
      async authorize(credentials) {
        const email = credentials?.email as string
        const otp = credentials?.otp as string
        if (!email || !otp) return null
        try {
          const res = await fetch(`${API_URL}/api/v1/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp }),
            signal: AbortSignal.timeout(5000),
          })
          if (!res.ok) return null
          const user = await res.json() as { email: string; name?: string }
          return { id: user.email, email: user.email, name: user.name ?? email }
        } catch {
          return null
        }
      },
    }),
  ],
}

export const { handlers, auth, signIn, signOut } = NextAuth(config)
