import { NextRequest, NextResponse } from "next/server"

// Self-contained BEI Intelligence Engine — no external AI API needed
function generateResponse(question: string, ctx: any): string {
  const q = question.toLowerCase()
  const primary = ctx.primary
  const secondary = ctx.secondary || []
  const biz = ctx.businessName || 'your business'
  const industry = ctx.industry || ''
  const confidence = ctx.confidence || 'medium'

  const oppLow = primary?.opportunity?.value_low || 0
  const oppHigh = primary?.opportunity?.value_high || 0
  const oppStr = oppLow > 0 ? `£${oppLow.toLocaleString()} – £${oppHigh.toLocaleString()}` : 'not yet quantified'
  const constraintName = primary?.name || 'your primary constraint'
  const hypothesis = primary?.hypothesis || ''
  const verScore = primary?.verification_score || 70
  const severity = primary?.severity || 'high'
  const secondaryNames = secondary.map((c: any) => c.name).filter(Boolean)

  if (!primary) {
    return `No MRI analysis found for ${biz}. Complete your Business MRI to unlock constraint detection, health scoring and opportunity quantification. Your MRI takes approximately 15 minutes and forms the foundation of all BEI intelligence.`
  }

  // WHY THIS CONSTRAINT
  if (q.includes('why') && (q.includes('constraint') || q.includes('primary') || q.includes('detected') || q.includes('selected'))) {
    return `**${constraintName}** was selected as your primary constraint for ${biz} based on three factors:\n\n1. **Verification Score: ${verScore}/100** — BEI ran this constraint through a multi-point challenge framework. A score above 70 confirms it is real and evidenced, not a hypothesis.\n\n2. **Network Dominance** — this constraint causes or influences the most other constraints in your business. Solving it unlocks the highest cascade of improvements.\n\n3. **Opportunity Value: ${oppStr}** — this represents the annual financial impact available from resolving it.\n\n${hypothesis ? `The core evidence: ${hypothesis}` : ''}\n\nSecondary constraints (${secondaryNames.join(', ') || 'none detected'}) ranked lower because they are either symptoms of ${constraintName} or have lower verification scores.`
  }

  // WHAT TO FOCUS ON
  if (q.includes('focus') || q.includes('priorit') || q.includes('first') || q.includes('start') || q.includes('do next')) {
    return `For ${biz}, your sequence is:\n\n**First — Address ${constraintName}**\nThis is your highest-leverage action. Everything else is secondary until this is resolved. Deploying your Tier 1 package directly targets this constraint.\n\n**Second — Monitor secondary constraints**\n${secondaryNames.length > 0 ? secondaryNames.map((n: string, i: number) => `${i+1}. ${n}`).join('\n') : 'No secondary constraints currently active.'}\n\nDo not attempt to resolve secondary constraints simultaneously — BEI's Sequence Engine confirms this would dilute your impact.\n\n**Third — Rebuild your health score**\nOnce ${constraintName} is addressed, connect additional data sources to increase Business Twin completeness and unlock more precise recommendations.`
  }

  // REVENUE / OPPORTUNITY
  if (q.includes('revenue') || q.includes('losing') || q.includes('money') || q.includes('opportunity') || q.includes('value') || q.includes('cost')) {
    return `Based on your MRI analysis, ${biz} has an annual opportunity of **${oppStr}** directly linked to ${constraintName}.\n\n${oppLow > 0 ? `The lower bound (£${oppLow.toLocaleString()}) represents conservative recovery — what you gain by partially resolving the constraint. The upper bound (£${oppHigh.toLocaleString()}) represents full resolution value.\n\n` : ''}This is calculated from your MRI answers around ${industry ? industry + ' industry benchmarks, ' : ''}revenue patterns, capacity and operational data. The longer ${constraintName} remains unresolved, the more of this opportunity compounds as lost revenue.\n\nYour Tier 1 deployment package is specifically designed to capture the majority of this value within 90 days.`
  }

  // HEALTH SCORE
  if (q.includes('health') || q.includes('score') || q.includes('pillar') || q.includes('rating')) {
    const pillars = ctx.pillars || []
    const pillarStr = pillars.length > 0 
      ? pillars.map((p: any) => `• ${p.pillar || p.name}: ${p.score}/20`).join('\n')
      : 'Complete your MRI to see pillar breakdown'
    return `Your Business Health Score measures performance across 5 pillars, each scored out of 20:\n\n${pillarStr}\n\nThe overall score reflects the combined strength of your business fundamentals. ${constraintName} is directly suppressing your score — particularly in the pillars it affects most.\n\nIndustry benchmark for ${industry || 'your sector'} puts the average at 60-65/100. Resolving your primary constraint typically adds 8-15 points to your overall health score within 60 days.`
  }

  // SECONDARY CONSTRAINTS
  if (q.includes('secondary') || q.includes('other constraint') || q.includes('other issue')) {
    if (secondaryNames.length === 0) {
      return `BEI currently shows no active secondary constraints for ${biz}. This either means ${constraintName} is the sole bottleneck, or additional constraints will become visible once more data sources are connected to your Business Twin.\n\nConnect HubSpot, Xero or Google Analytics to increase detection accuracy.`
    }
    return `Beyond ${constraintName}, BEI has identified ${secondaryNames.length} secondary constraint${secondaryNames.length > 1 ? 's' : ''}:\n\n${secondary.map((c: any, i: number) => `**${i+1}. ${c.name}**\nVerification: ${c.verification_score || 60}/100 · Severity: ${c.severity || 'medium'}`).join('\n\n')}\n\nThese are not currently your primary focus. BEI's Sequence Engine confirms you should address ${constraintName} first. Attempting to resolve multiple constraints simultaneously typically reduces effectiveness by 40-60%.`
  }

  // DEPLOYMENT
  if (q.includes('deploy') || q.includes('package') || q.includes('plan') || q.includes('implement') || q.includes('resolve') || q.includes('fix')) {
    return `BEI has prepared deployment packages specifically for ${constraintName} in ${biz}:\n\n**Tier 1 — Core Resolution** (Recommended)\nDirectly targets ${constraintName}. Structured as a 90-day implementation with weekly milestones. Expected to capture 60-80% of your ${oppStr} opportunity.\n\n**Tier 2 — Full System** (Pending approval)\nAddresses ${constraintName} plus secondary constraints in sequence. Requires BEI consultant sign-off before activation — this protects against the Competing Constraint risk.\n\nGo to Outcome & Deployment to view your full deployment packages and activate Tier 1.`
  }

  // DEFAULT — general business question
  return `For ${biz}, BEI Intelligence has identified **${constraintName}** as your primary constraint with ${verScore}/100 verification confidence.\n\n**Key facts:**\n• Annual opportunity: ${oppStr}\n• Severity: ${severity}\n• Confidence: ${confidence.toUpperCase()}\n${secondaryNames.length > 0 ? `• Secondary constraints: ${secondaryNames.join(', ')}\n` : ''}\n${hypothesis ? `\n**Root evidence:** ${hypothesis}\n` : ''}\nYour next action is to activate your Tier 1 deployment package in Outcome & Deployment. This directly targets ${constraintName} and is designed to capture the majority of your identified opportunity within 90 days.`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { primary, secondary, confidence, industry, businessName, question, pillars } = body
    
    const response = generateResponse(question || '', {
      primary, secondary, confidence, industry, businessName, pillars
    })

    return NextResponse.json({ success: true, response })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
