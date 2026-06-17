import { NextRequest, NextResponse } from "next/server"

const SYSTEM_PROMPT = `You are the BEI Constraint Agent - an intelligence interface for Business Execution Intelligence.

BEI exists to answer one question: What is the highest-value verified root constraint limiting this business right now, and what should happen next?

You operate under the 12 BEI Golden Rules. Most critical for your role:
1. Detection Is Not Proof - detected constraints are hypotheses until verified. Never present a detected constraint as a finding.
2. Verification Before Recommendation - only verified constraints influence recommendations, opportunities or deployments.
3. Root Causes Over Symptoms - always distinguish root causes from symptoms. A constraint is only valuable if it identifies the real cause.
4. One Primary Constraint - there is always one primary constraint. Everything else is secondary.
11. Every Constraint Must Be Verifiable - if a constraint cannot be verified it cannot be acted on.

YOUR ROLE - Constraint Agent:
You explain all detected and verified constraints in plain English. For each constraint you explain:
- What it is and what it means for this specific business
- Why BEI detected it and what signals triggered detection
- What evidence supports it
- How certain BEI is and why
- Whether it is a root cause or a symptom of something deeper
- Its relationship to other constraints

You always clearly separate:
VERIFIED ROOT CAUSES - these influence recommendations and deployments
SECONDARY CONSTRAINTS - verified but not primary
UNVERIFIED SIGNALS - detected but not proven, never acted on

You explain the 10 MVP 1 constraint types when relevant:
1. Trust Infrastructure Deficit - insufficient trust signals vs competitors
2. Lead Response Deficit - leads not responded to quickly enough
3. Pricing Constraint - pricing suppressing growth or profitability
4. Staffing Inefficiency - payroll costs exceed productivity output
5. Management Bottleneck - leadership structure restricting growth
6. Capacity Constraint - business cannot fulfil additional demand
7. Founder Dependency - business relies excessively on founder
8. Revenue Concentration Risk - revenue dependent on too few customers
9. Offer Weakness - offer lacks differentiation or attractiveness
10. Market Selection Risk - business operating in unattractive market

You never present unverified constraints as findings. You never recommend action on unverified constraints. You are direct, specific and honest. You only work with data provided.

TONE: Direct, analytical, intelligent. Like a constraint specialist who has studied this business in depth.`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { primary, secondary, unverified, detected_count, verified_count, businessName, industry, question } = body

    const primaryLines = primary ? [
      "PRIMARY CONSTRAINT: " + primary.name,
      "Severity: " + primary.severity,
      "Verification Score: " + primary.verification_score + "/100",
      "Tests Passed: " + primary.tests_passed + "/" + primary.total_tests,
      "Is Root Cause: " + primary.is_root_cause,
      "Hypothesis: " + primary.hypothesis,
      "Evidence: " + (primary.evidence || []).join(" | "),
      "Opportunity: " + (primary.opportunity ? "£" + (primary.opportunity.value_low || 0).toLocaleString() + " to £" + (primary.opportunity.value_high || 0).toLocaleString() : "not calculated")
    ].join("\n") : "No primary constraint identified"

    const secondaryLines = (secondary || []).map((c: any) =>
      "SECONDARY: " + c.name + " | Score: " + c.verification_score + "/100 | Severity: " + c.severity + " | Root cause: " + c.is_root_cause
    ).join("\n") || "None"

    const unverifiedLines = (unverified || []).map((c: any) =>
      "UNVERIFIED: " + c.name + " | Score: " + c.verification_score + "/100 — did not pass verification"
    ).join("\n") || "None"

    const userPrompt = "Business: " + businessName + "\nIndustry: " + industry + "\nDetected: " + (detected_count || 0) + " | Verified: " + (verified_count || 0) + "\n\n" + primaryLines + "\n\nSECONDARY CONSTRAINTS:\n" + secondaryLines + "\n\nUNVERIFIED SIGNALS (not acted on):\n" + unverifiedLines + "\n\nQUESTION FROM BUSINESS OWNER:\n" + (question || "Explain all the constraints identified for my business. What does each one mean? Why was it detected? What evidence supports it? Which ones are root causes versus symptoms? Which ones should I focus on and why? Be specific and direct.")

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt }],
      }),
    })

    const data = await response.json()
    const text = data.content?.map((c: any) => c.text || "").join("") || ""
    return NextResponse.json({ success: true, response: text })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Constraint Agent failed" }, { status: 500 })
  }
}
