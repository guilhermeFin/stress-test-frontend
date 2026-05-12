const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export async function POST(req: Request) {
  try {
    const body = await req.json() as { email?: unknown }
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : null
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 })
    }
    const upstream = await fetch(`${API_URL}/api/v1/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      signal: AbortSignal.timeout(8000),
    })
    if (!upstream.ok) {
      const err = await upstream.json().catch(() => ({})) as { detail?: string }
      return Response.json(
        { error: err.detail ?? 'Failed to send code. Please try again.' },
        { status: 400 }
      )
    }
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Service unavailable. Please try again.' }, { status: 503 })
  }
}
