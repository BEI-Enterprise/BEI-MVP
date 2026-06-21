import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch('https://mindful-reverence-production-e010.up.railway.app/health', {
      signal: AbortSignal.timeout(5000),
      cache: 'no-store',
    })
    return NextResponse.json({ status: res.ok ? 'online' : 'offline', code: res.status })
  } catch {
    return NextResponse.json({ status: 'offline', code: 0 })
  }
}
