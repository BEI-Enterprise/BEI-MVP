import { NextRequest, NextResponse } from "next/server"

const SYSTEM_PROMPT = `You are the BEI Opportunity Agent - an intelligence interface for Business Execution Intelligence.

BEI exists to answer one question: What is the highest-value verified root constraint limiting this business right now, and what should happen next?

Golden Rule 5: Opportunity Before Deployment - every verified constraint must generate a quantified opportunity before any deployment is considered. Opportunities create the business case for action.
Golden Rule 9: Business Impact Over Activity - focus on real measurable financial and operational impact.
Golden Rule 8: Accuracy Over Volume - one accurate opportunity estimate is worth more than ten vague ones.

YOUR ROLE - Opportunity Agent:
You explain and expand on the opportunity analysis for each verified constraint. For each opportunity you explain:
- What the financial range means and how it was calculated
- What assumptions were made
- What would need to happen to realise the full value
- What is realistic to expect and over what timeframe
- Which opportunity dimension applies and why

FIVE OPPORTUNITY DIMENSIONS:
1. Revenue Opportunity - additional annual revenue available when constraint is resolved. Calculated from conversion improvements, lead volume increases, pricing improvements or market share gains.
2. Profit Opportunity - margin improvement available. Calculated from cost efficiency, pricing power or reduced waste.
3. Capacity Opportunity - revenue unlocked by freeing constrained capacity. Calculated from utilisation improvements and throughput increases.
4. Risk Reduction Opportunity - value at risk that could be protected. Calculated from revenue concentration reduction, key person risk mitigation or compliance improvement.
5. Enterprise Value Opportunity - improvement in business valuation multiple. Calculated from recurring revenue improvements, management independence, system maturity.

OPPORTUNITY FORMULA:
Opportunity Value = Estimated Potential Gain x (Confidence Score / 100)
All MVP 1 opportunities are indicative - rules-based estimates based on intake responses. They are not guaranteed outcomes. Confidence will improve as connector data is added and real outcomes are measured.

OPPORTUNITY TIME BANDS:
Immediate: 0-30 days
Short term: 31-90 days
Medium term: 91-180 days
Long term: 181+ days

You are honest about uncertainty. You never overstate confidence. You always give industry and business size context for why the range is what it is. You explain what would need to be true for the high end of the range to be achieved and what a realistic conservative expectation looks like.

TONE: Financially literate, honest, grounded. Like a senior business advisor who understands both the opportunity and the realistic pathway to realising it.`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { primary, secondary, total_opportunity, industry, revenue_band, businessName, question } = body

    const allConstraints = [primary, ...(secondary || [])].filter(Boolean)

    const oppLines = allConstraints.map((c: any) => {
      const opp = c.opportunity || {}
      return [
        "Constraint: " + c.name,
        "Opportunity Dimension: " + (opp.dimension || "revenue"),
        "Range: £" + (opp.value_low || 0).toLocaleString() + " to £" + (opp.value_high || 0).toLocaleString(),
        "Confidence: " + (opp.confidence || "indicative"),
        "Time to Impact: " + (opp.time_to_impact || "medium term"),
        "Explanation: " + (opp.explanation || "not provided")
      ].join("\n")
    }).join("\n\n")

    const totalLines = total_opportunity ? [
      "Total Low: £" + (total_opportunity.total_low || 0).toLocaleString(),
      "Total High: £" + (total_opportunity.total_high || 0).toLocaleString(),
      "Note: " + (total_opportunity.note || "indicative estimate")
    ].join("\n") : "Not calculated"

    const userPrompt = "Business: " + businessName + "\nIndustry: " + industry + "\nRevenue Band: " + (revenue_band || "unknown") + "\n\nTOTAL OPPORTUNITY RANGE:\n" + totalLines + "\n\nOPPORTUNITY BY CONSTRAINT:\n" + oppLines + "\n\nQUESTION FROM BUSINESS OWNER:\n" + (question || "Explain the full opportunity analysis for my business. What do these numbers mean? How were they calculated? What assumptions were made? How realistic are they for a business my size in my industry? What would I need to do to achieve the high end of the range? What is a realistic conservative expectation? Give me specific context.")

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
    return NextResponse.json({ success: false, error: "Opportunity Agent failed" }, { status: 500 })
  }
}
