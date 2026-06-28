import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { primary, secondary, confidence, industry, businessName, question, decision_explanation } = body

    const context = [
      businessName ? 'Business: ' + businessName : '',
      industry ? 'Industry: ' + industry : '',
      confidence ? 'Confidence: ' + confidence.toUpperCase() : '',
      primary ? 'Primary Constraint: ' + (primary.name || 'Unknown') + '\nVerification: ' + (primary.verification_score || 70) + '/100\nSeverity: ' + (primary.severity || 'high') + '\nHypothesis: ' + (primary.hypothesis || 'Identified from MRI analysis') + '\nOpportunity: £' + (primary.opportunity?.value_low || 0).toLocaleString() + ' – £' + (primary.opportunity?.value_high || 0).toLocaleString() : 'No primary constraint identified',
      secondary?.length > 0 ? 'Secondary Constraints: ' + secondary.map((c: any) => c.name).join(', ') : '',
      decision_explanation || '',
    ].filter(Boolean).join('\n')

    const systemPrompt = `You are BEI Intelligence — the AI assistant for Business Execution Intelligence platform.
You are a senior business analyst helping executives understand their BEI intelligence reports.
Be concise, specific and executive-grade. Always refer to the specific business context provided.
Never give generic advice — always tie answers to the actual data given.
Keep responses under 200 words. Be direct and actionable.

BUSINESS CONTEXT:
${context}`

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 600,
        messages: [{ role: "user", content: question || "Explain my primary constraint and what I should focus on." }],
        system: systemPrompt,
      }),
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.error?.message || 'API error')
    const text = data.content?.[0]?.text || ""
    return NextResponse.json({ success: true, response: text })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
