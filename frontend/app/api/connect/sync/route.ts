import { NextRequest, NextResponse } from 'next/server'

const INTELLIGENCE_API = process.env.INTELLIGENCE_API_URL || 'https://mindful-reverence-production-e010.up.railway.app'

export async function POST(request: NextRequest) {
  try {
    const { business_id, connector_type, credentials } = await request.json()

    if (!business_id || !connector_type) {
      return NextResponse.json({ error: 'Missing business_id or connector_type' }, { status: 400 })
    }

    const res = await fetch(`${INTELLIGENCE_API}/connector/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        business_id,
        connector_type,
        credentials,
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return NextResponse.json({ success: false, error: err.error || 'Intelligence server error' }, { status: 502 })
    }

    const data = await res.json()
    return NextResponse.json({ success: true, data })

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
