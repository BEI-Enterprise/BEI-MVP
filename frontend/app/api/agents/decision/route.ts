import { NextRequest, NextResponse } from "next/server"

const INTELLIGENCE_API = process.env.INTELLIGENCE_API_URL || 'https://mindful-reverence-production-e010.up.railway.app'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { primary, secondary, confidence, industry, businessName, question, decision_explanation } = body

    const contextLines = [
      businessName ? 'Business: ' + businessName : '',
      industry ? 'Industry: ' + industry : '',
      confidence ? 'Confidence: ' + confidence.toUpperCase() : '',
      primary ? [
        'Primary Constraint: ' + (primary.name || 'Unknown'),
        'Verification Score: ' + (primary.verification_score || 70) + '/100',
        'Severity: ' + (primary.severity || 'high'),
        'Is Root Cause: ' + (primary.is_root_cause !== false),
        'Opportunity: £' + (primary.opportunity?.value_low || 0).toLocaleString() + ' – £' + (primary.opportunity?.value_high || 0).toLocaleString(),
        'Hypothesis: ' + (primary.hypothesis || 'Identified from MRI analysis'),
      ].join('\n') : 'No primary constraint identified',
      secondary?.length > 0 ? 'Secondary Constraints: ' + secondary.map((c: any) => c.name).join(', ') : '',
      decision_explanation ? 'Additional Context:\n' + decision_explanation : '',
    ].filter(Boolean).join('\n')

    const res = await fetch(`${INTELLIGENCE_API}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: question || 'Explain my primary constraint and what I should focus on.',
        context: contextLines,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error('Intelligence server error: ' + err)
    }

    const data = await res.json()
    return NextResponse.json({ success: true, response: data.response })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
