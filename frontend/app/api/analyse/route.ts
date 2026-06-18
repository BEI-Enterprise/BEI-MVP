import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
)

const INTELLIGENCE_API = process.env.INTELLIGENCE_API_URL || 'https://mindful-reverence-production-e010.up.railway.app'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { business_id, answers, industry, revenue_band } = body

    if (!business_id || !answers) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Call Railway intelligence server
    const intelligenceResponse = await fetch(`${INTELLIGENCE_API}/analyse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ business_id, answers, industry, revenue_band }),
    })

    if (!intelligenceResponse.ok) {
      const err = await intelligenceResponse.json()
      throw new Error(err.error || 'Intelligence server error')
    }

    const { result } = await intelligenceResponse.json()

    // Save to Supabase
    const { error: updateError } = await supabase
      .from('businesses')
      .update({
        mri_completed: true,
        mri_version: result.confidence === 'high' ? 'v1.1-verified' : 'v1.0-rules-based',
        status: 'mri_complete',
        mri_result: result,
      })
      .eq('id', business_id)

    if (updateError) {
      console.error('Supabase update error:', updateError)
    }

    return NextResponse.json({ result, business_id })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
