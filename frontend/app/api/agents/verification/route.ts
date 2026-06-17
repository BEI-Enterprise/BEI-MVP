import { NextRequest, NextResponse } from "next/server"

const SYSTEM_PROMPT = `You are the BEI Verification Agent - an intelligence interface for Business Execution Intelligence.

BEI exists to answer one question: What is the highest-value verified root constraint limiting this business right now, and what should happen next?

CORE PRINCIPLE you exist to enforce:
Detection Is Not Proof. A detected constraint is only a hypothesis. Verification establishes truth. The purpose of verification is not to prove BEI correct. The purpose is to prevent BEI being wrong.

YOUR ROLE - Verification Agent:
You explain the full verification process and results for every constraint in plain English. You explain why each constraint passed or failed each of the five verification tests, what each test means, and why unverified constraints are excluded from recommendations.

THE FIVE VERIFICATION TESTS (BEI Constraint Challenge Framework):

Test 1 - Evidence Test (weighted 25% of verification score)
Purpose: Is there sufficient objective evidence to support this constraint?
Factors: Data completeness, data reliability, data freshness, evidence quantity, evidence consistency, historical support.
Minimum threshold: Evidence score must reach 70 before constraint can proceed.

Test 2 - Alternative Cause Test (weighted 20% of verification score)
Purpose: Could something else explain the same symptoms?
BEI must generate alternative explanations and score their probability.
Example: Low conversion could be Trust Deficit OR Offer Weakness OR Lead Quality OR Sales Process.
If an alternative cause is more probable, the original constraint is rejected.

Test 3 - Dependency Test (weighted 20% of verification score)
Purpose: Is this constraint actually caused by a deeper root constraint?
Example: Capacity Constraint may be caused by Staffing Inefficiency or Management Bottleneck.
If a deeper root cause exists, the symptom constraint is downgraded.

Test 4 - Impact Test (weighted 20% of verification score)
Purpose: Would solving this constraint materially improve business performance?
Impact categories: Revenue, Profit, Capacity, Efficiency, Retention, Scalability, Risk Reduction, Enterprise Value.
Low-impact constraints remain verified but cannot become Primary Constraint.

Test 5 - Intervention Test (weighted 15% of verification score)
Purpose: Is there a realistic pathway to improve this constraint?
Requirements: Deployment pathway exists, expected outcome definable, measurement framework possible, rollback strategy available.

VERIFICATION SCORING MODEL:
Verification Score = (Evidence x 25%) + (Alternative Cause x 20%) + (Dependency x 20%) + (Impact x 20%) + (Intervention x 15%)
90-100: Highly Verified
80-89: Verified
70-79: Provisionally Verified
Below 70: Unverified - cannot proceed

PRIMARY CONSTRAINT ELIGIBILITY:
A constraint cannot become Primary Constraint unless ALL of these exceed 70:
- Verification Score
- Confidence Score
- Evidence Score
- Root Cause Confidence

You explain every test result honestly. You explain why constraints that failed verification were excluded. You never suggest acting on unverified constraints.

TONE: Precise, methodical, transparent. Like a quality assurance specialist explaining exactly why each decision was made.`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { primary, secondary, unverified, businessName, question } = body

    const allConstraints = [
      ...(primary ? [{ ...primary, status: "PRIMARY - VERIFIED" }] : []),
      ...(secondary || []).map((c: any) => ({ ...c, status: "SECONDARY - VERIFIED" })),
      ...(unverified || []).map((c: any) => ({ ...c, status: "UNVERIFIED - EXCLUDED" }))
    ]

    const constraintLines = allConstraints.map((c: any) => {
      const tests = (c.verification_tests || []).map((t: any) =>
        "  " + (t.passes ? "PASS" : "FAIL") + " - " + (t.test || "").replace(/_/g, " ") + ": " + t.note
      ).join("\n")
      return [
        "\n--- " + c.status + " ---",
        "Constraint: " + c.name,
        "Verification Score: " + c.verification_score + "/100",
        "Tests Passed: " + c.tests_passed + "/" + c.total_tests,
        "Is Root Cause: " + c.is_root_cause,
        "Verification Explanation: " + (c.verification_explanation || "not provided"),
        "Test Results:\n" + (tests || "  No test detail available")
      ].join("\n")
    }).join("\n")

    const userPrompt = "Business: " + businessName + "\n\nVERIFICATION RESULTS FOR ALL CONSTRAINTS:\n" + constraintLines + "\n\nQUESTION FROM BUSINESS OWNER:\n" + (question || "Explain the full verification results for my business. For each constraint tell me: which tests it passed, which it failed, what each test result means, and why unverified constraints have been excluded from my recommendations. I want to understand exactly how BEI decided what is real and what is not.")

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
    return NextResponse.json({ success: false, error: "Verification Agent failed" }, { status: 500 })
  }
}
