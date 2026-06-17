import { NextRequest, NextResponse } from "next/server"

const BEI_GOLDEN_RULES = "1. Detection Is Not Proof. 2. Verification Before Recommendation. 3. Root Causes Over Symptoms. 4. One Primary Constraint. 5. Opportunity Before Deployment. 6. Approval Before Execution. 7. Learning From Outcomes. 8. Accuracy Over Volume. 9. Business Impact Over Activity. 10. Every Decision Must Be Explainable. 11. Every Constraint Must Be Verifiable. 12. Every Deployment Must Be Measurable."

const SYSTEM_PROMPT = `You are the BEI Business Twin Agent - an intelligence interface for Business Execution Intelligence.

BEI exists to answer one question: What is the highest-value verified root constraint limiting this business right now, and what should happen next?

You operate under the 12 BEI Golden Rules: ${BEI_GOLDEN_RULES}

YOUR ROLE - Business Twin Agent:
You explain the Business Twin and what it reveals about the business. The Business Twin is BEI's digital representation of a real business. It models Revenue, Marketing, Sales, Operations, Staffing, Management, Trust, Customer Experience, Strategy, Risk, Context, Competition, Pricing, Offers, Retention, Financial Performance, Operational Performance, Leadership Structure, Dependencies and Growth Infrastructure.

You explain five health pillars:
1. Growth - revenue trend, lead volume, conversion rate, trust signals, organic visibility
2. Operations - capacity utilisation, team size, response times, process maturity, CRM usage
3. Strategy - market position, pricing strength, offer clarity, founder dependency
4. Risk - revenue concentration, key person dependency, cash position, client retention
5. Context - business stage, primary objective, market conditions

You translate scores and data into plain English a business owner can understand and act on. You are direct, specific and honest. You never fabricate data. You only work with the data provided to you. You always explain what each score means, what is driving it, and what would improve it.

TONE: Professional, direct, intelligent. Like a trusted senior advisor who has studied this business carefully. Not generic. Specific to this business.`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { twin, health, businessName, industry, question } = body

    const pillarLines = Object.entries(health?.pillars || {})
      .map(([name, data]: [string, any]) =>
        name + ": " + data.score + "/100 (" + data.band + ") — " + data.vs_benchmark + " industry benchmark of " + data.benchmark
      ).join("\n")

    const twinSummary = [
      "Revenue trend: " + (twin?.growth_revenue_trend || "unknown"),
      "Monthly leads: " + (twin?.growth_lead_volume || "unknown"),
      "Conversion rate: " + (twin?.growth_conversion_rate || "unknown") + "%",
      "Review score: " + (twin?.growth_review_score || "unknown") + " (" + (twin?.growth_review_count || 0) + " reviews)",
      "Team size: " + (twin?.ops_team_size || "unknown"),
      "CRM in use: " + (twin?.ops_crm_in_use ? "Yes - " + twin.ops_crm_platform : "No"),
      "Lead response time: " + (twin?.ops_response_time_hours || "unknown") + " hours",
      "Process maturity: " + (twin?.ops_process_maturity || "unknown"),
      "Market position: " + (twin?.strategy_market_position || "unknown"),
      "Offer clarity: " + (twin?.strategy_offer_clarity || "unknown"),
      "Founder dependency: " + (twin?.strategy_founder_dependency || "unknown"),
      "Revenue concentration: " + (twin?.risk_revenue_concentration || "unknown"),
      "Cash position: " + (twin?.risk_cash_position || "unknown"),
      "Business stage: " + (twin?.context_business_stage || "unknown"),
      "Primary objective: " + (twin?.context_primary_objective || "unknown"),
      "Market conditions: " + (twin?.context_market_conditions || "unknown"),
      "Data confidence: " + (twin?.data_confidence_score || 0) + "/100"
    ].join("\n")

    const userPrompt = "Business: " + businessName + "\nIndustry: " + industry + "\n\nBUSINESS TWIN DATA:\n" + twinSummary + "\n\nHEALTH SCORES:\nOverall: " + (health?.overall || 0) + "/100 (" + (health?.band || "unknown") + ") — " + (health?.vs_benchmark || "unknown") + " industry benchmark\n\nPILLAR BREAKDOWN:\n" + pillarLines + "\n\nQUESTION FROM BUSINESS OWNER:\n" + (question || "Give me a complete plain English explanation of what the Business Twin reveals about my business. Be specific about what each score means, what is driving it, what is strong, what needs attention, and what should I understand about the state of my business right now.")

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
    return NextResponse.json({ success: false, error: "Twin Agent failed" }, { status: 500 })
  }
}
