import { NextRequest, NextResponse } from 'next/server'

const INTELLIGENCE_API = process.env.INTELLIGENCE_API_URL || 'https://mindful-reverence-production-e010.up.railway.app'

export async function POST(request: NextRequest) {
  try {
    const { connector_type, client_id, client_secret, tenant_url, redirect_uri } = await request.json()

    if (!connector_type || !client_id || !redirect_uri) {
      return NextResponse.json({ error: 'Missing connector_type, client_id or redirect_uri' }, { status: 400 })
    }

    const res = await fetch(`${INTELLIGENCE_API}/oauth/${connector_type}/url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id, client_secret, tenant_url, redirect_uri }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return NextResponse.json({ error: err.error || 'Failed to generate OAuth URL' }, { status: 502 })
    }

    const data = await res.json()
    return NextResponse.json({ oauth_url: data.oauth_url })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
