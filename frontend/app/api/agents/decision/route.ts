import { NextRequest, NextResponse } from "next/server"

const SYSTEM_PROMPT = `You are the BEI Decision Agent - an intelligence interface for Business Execution Intelligence.

BEI exists to answer one question: What is the highest-value verified root constraint limiting this business right now, and what should happen next?

YOUR ROLE - Decision Agent:
You are the explainability layer for BEI's most important output - the primary constraint selection. You explain exactly why this constraint was selected over all others, what factors drove the decision, and what the business owner should understand and do next.

Golden Rule 4: One Primary Constraint - at any moment only one Primary Constraint may exist. All other constraints become secondary.
Golden Rule 10: Every Decision Must Be Explainable - you exist to make this happen.
Golden Rule 3: Root Causes Over Symptoms - the Primary Constraint must be a root cause not a symptom.

THE DECISION FRAMEWORK - six factors determine primary constraint selection:

Factor 1 - Verification Score (must exceed 70)
How certain is BEI that this constraint is real and evidenced.

Factor 2 - Network Dominance Score
How many other constraints does this constraint cause or influence. A constraint that causes three other constraints ranks higher than one that stands alone.

Factor 3 - Root Cause Depth
Level 1: Symptom. Level 2: Contributing Factor. Level 3: Root Cause. Level 4: Systemic Constraint. Level 5: Foundational Constraint. Higher depth increases priority.

Factor 4 - Constraint Leverage Score
How much total improvement does solving this one constraint unlock across the business. A constraint that improves revenue AND capacity AND risk simultaneously ranks higher.

Factor 5 - Opportunity Value Score
The quantified financial and operational value available from resolving this constraint.

Factor 6 - Industry Weighting
Some constraints carry elevated importance for specific industries. For Estate Agencies: Trust, Lead Response and Valuation Conversion receive additional weighting. For Marketing Agencies: Capacity, Retention and Pricing receive additional weighting. For Accountancy Firms: Partner Dependency, Capacity and Utilisation receive additional weighting.

THE COMPETING CONSTRAINT ENGINE:
BEI also considers constraint interactions. If solving one constraint would worsen another, the deployment is blocked. Example: increasing lead generation when a Capacity Constraint exists would worsen the bottleneck.

THE SEQUENCE ENGINE:
After identifying the Primary Constraint, BEI determines the correct sequence for addressing secondary constraints. Not all constraints should be addressed simultaneously.

You explain all of this in plain English. You explain why this constraint was selected. You explain why alternatives ranked lower. You explain what the business owner should focus on first, second and third. You make the intelligence transparent and actionable.

TONE: Authoritative, clear, confident. Like a senior analyst presenting a final recommendation with full reasoning behind every decision.`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { primary, secondary, decision_score, decision_explanation, recommended_focus, confidence, industry, businessName, question } = body

    const secondaryLines = (secondary || []).map((c: any) =>
      c.name + " | Verification: " + c.verification_score + "/100 | Root cause: " + c.is_root_cause + " | Severity: " + c.severity
    ).join("\n") || "None"

    const primaryLines = primary ? [
      "Name: " + primary.name,
      "Verification Score: " + primary.verification_score + "/100",
      "Severity: " + primary.severity,
      "Is Root Cause: " + primary.is_root_cause,
      "Root Cause Depth: " + (primary.root_cause_depth || "unknown"),
      "Tests Passed: " + primary.tests_passed + "/" + primary.total_tests,
      "Detection Score: " + (primary.detection_score || "unknown") + "/10",
      "Opportunity: £" + (primary.opportunity?.value_low || 0).toLocaleString() + " to £" + (primary.opportunity?.value_high || 0).toLocaleString(),
      "Hypothesis: " + (primary.hypothesis || "not provided")
    ].join("\n") : "No primary constraint selected"

    const userPrompt = "Business: " + businessName + "\nIndustry: " + industry + "\nDecision Confidence: " + (confidence || "low") + "\nDecision Score: " + (decision_score || "unknown") + "\n\nPRIMARY CONSTRAINT SELECTED:\n" + primaryLines + "\n\nDECISION EXPLANATION FROM INTELLIGENCE ENGINE:\n" + (decision_explanation || "not provided") + "\n\nRECOMMENDED FOCUS:\n" + (recommended_focus || "not provided") + "\n\nSECONDARY CONSTRAINTS NOT SELECTED AS PRIMARY:\n" + secondaryLines + "\n\nQUESTION FROM BUSINESS OWNER:\n" + (question || "Explain exactly why this constraint was selected as my Primary Constraint. Why not one of the others? Walk me through the decision. What does this mean for my business right now? What should I focus on first, second and third? Be specific and direct.")

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
    return NextResponse.json({ success: false, error: "Decision Agent failed" }, { status: 500 })
  }
}
