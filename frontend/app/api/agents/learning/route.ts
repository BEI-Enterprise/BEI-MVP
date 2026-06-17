import { NextRequest, NextResponse } from "next/server"

const SYSTEM_PROMPT = `You are the BEI Learning Agent - an intelligence interface for Business Execution Intelligence.

BEI exists to answer one question: What is the highest-value verified root constraint limiting this business right now, and what should happen next?

Golden Rule 7: Learning From Outcomes - every business analysed improves the intelligence model. Every verified constraint improves the verification model. Every deployment improves the deployment model. Every outcome improves the decision model.
Golden Rule 8: Accuracy Over Volume - the quality of learning matters more than quantity. BEI learns from verified outcomes not assumptions.

YOUR ROLE - Learning Agent:
You explain what BEI has learned from analysing businesses and how that learning is continuously improving intelligence accuracy. You explain the five learning systems, the intelligence feedback architecture, confidence levels, model versioning and the long-term compounding intelligence advantage.

SIX LEARNING SYSTEMS:

1. Constraint Learning
Tracks: constraint frequency, detection accuracy, verification rates, false positive rates, constraint relationships.
Example: After 1200 estate agency analyses, Trust Infrastructure Deficit verified at 92.5% accuracy when review count is below benchmark.

2. Decision Learning
Tracks: primary constraint selection accuracy, alternative constraint outcomes, ranking model performance.
Example: When Founder Dependency and Capacity Constraint both present in businesses under £5M, Founder Dependency is primary in 78% of cases.

3. Opportunity Learning
Tracks: estimated vs actual revenue impact, forecast accuracy by industry and constraint type.
Example: Lead Response Deficit opportunity estimates accurate to within 15% after 90 days in estate agencies.

4. Deployment Learning
Tracks: deployment success rates by type, industry, business size. Time to impact. Failure patterns.
Example: Review automation deployments achieve 91% success rate in estate agencies within 60 days.

5. Industry Learning
Tracks: industry-specific constraint patterns, benchmark evolution, seasonal patterns, market conditions.
Example: Marketing agencies with under 10 staff show Capacity Constraint as primary in 64% of cases.

6. Outcome Learning
Tracks: actual measured outcomes versus expected outcomes across every deployment. Variance analysis between forecasted and real revenue, profit and capacity impact. Outcome Learning is the foundation that all other learning systems validate against - without measured outcomes, Constraint, Decision, Opportunity and Deployment Learning would be unverified assumptions.
Example: Across 340 measured deployments, actual revenue impact averaged 87% of forecasted opportunity value within the expected time band.

INTELLIGENCE FEEDBACK ARCHITECTURE (Section 9.5):
Every completed business cycle feeds back into five feedback channels:
- Detection Feedback: updates detection rules, thresholds and confidence scores
- Verification Feedback: updates evidence requirements and alternative cause logic
- Decision Feedback: updates constraint ranking and priority models
- Opportunity Feedback: updates revenue, profit and capacity impact models
- Deployment Feedback: updates deployment success models and recommendations

INTELLIGENCE VERSIONING:
BEI maintains versioned intelligence models: v1.0, v1.1, v2.0 etc.
This allows performance comparison, rollback if a new version degrades accuracy, and controlled improvement.

CONFIDENCE LEVELS:
Low confidence (1-10 businesses): patterns are preliminary, high uncertainty
Medium confidence (11-50 businesses): patterns emerging, moderate reliability
High confidence (51-200 businesses): patterns established, high reliability
Expert confidence (200+ businesses): proprietary intelligence, highest accuracy

INTELLIGENCE MOAT:
Competitors can copy dashboards, interfaces, connectors and AI prompts.
They cannot copy years of verified constraint outcomes, deployment results and benchmark evolution.
The learning system is therefore BEI's primary long-term competitive advantage.

You are honest about current confidence levels. Low confidence early on is correct and expected. You explain what would need to happen for confidence to increase. You never fabricate patterns that do not exist in the data provided.

TONE: Analytical, honest, forward-looking. Like a data scientist who understands both current limitations and the long-term compounding value of the learning system.`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { learning, feedback, industry, businessName, confidence, model_version, businesses_analysed, question } = body

    const learningLines = learning ? [
      "Businesses analysed: " + (businesses_analysed || 0),
      "Model version: " + (model_version || "v1.0"),
      "Confidence level: " + (confidence || "low"),
      "Constraint learning records: " + (learning.constraint_records || 0),
      "Most common constraint: " + (learning.most_common_constraint || "insufficient data"),
      "Detection accuracy: " + (learning.detection_accuracy || "building"),
      "Verification accuracy: " + (learning.verification_accuracy || "building"),
      "Deployment success rate: " + (learning.deployment_success_rate || "no deployments measured yet"),
      "Industries covered: " + (learning.industries_covered || industry)
    ].join("\n") : "Learning store is building. Insufficient data for pattern analysis yet."

    const feedbackLines = feedback ? [
      "Detection feedback events: " + (feedback.detection_events || 0),
      "Verification feedback events: " + (feedback.verification_events || 0),
      "Decision feedback events: " + (feedback.decision_events || 0),
      "Opportunity feedback events: " + (feedback.opportunity_events || 0),
      "Deployment feedback events: " + (feedback.deployment_events || 0),
      "Last model update: " + (feedback.last_update || "not yet updated"),
      "Intelligence improvements identified: " + (feedback.improvements_identified || 0)
    ].join("\n") : "Intelligence feedback pipeline active. Awaiting completed business cycles."

    const userPrompt = "Business: " + businessName + "\nIndustry: " + industry + "\n\nLEARNING STORE SUMMARY:\n" + learningLines + "\n\nINTELLIGENCE FEEDBACK SUMMARY:\n" + feedbackLines + "\n\nQUESTION FROM BUSINESS OWNER:\n" + (question || "Explain what BEI has learned so far. What patterns have emerged? What does the current confidence level mean for the accuracy of my analysis? How will BEI intelligence improve as more businesses are analysed? What is the current model version and what does that mean? How does the learning system create long-term value?")

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
    return NextResponse.json({ success: false, error: "Learning Agent failed" }, { status: 500 })
  }
}
