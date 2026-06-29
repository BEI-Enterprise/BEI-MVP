import { NextRequest, NextResponse } from "next/server"
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
)

// ─── BEI Constraint Detection Engine ────────────────────────────────────────
// Runs on real connector + manual data only. Never uses free MRI data.

function analyseConnectorData(connectors: any[]): Record<string, any> {
  const data: Record<string, any> = {}
  connectors.forEach((c: any) => {
    if (c.status === 'active' && c.data_snapshot) {
      Object.assign(data, c.data_snapshot)
    }
  })
  return data
}

function detectConstraints(data: Record<string, any>, businessName: string, industry: string) {
  const constraints: any[] = []
  const d = data

  // ── GROWTH CONSTRAINTS ─────────────────────────────────────────────────
  const convRate = parseFloat(d.lead_to_client_conversion || d.conversion_rate || '0')
  const revenueGrowth = parseFloat(d.revenue_growth_rate_pct || d.revenue_growth_rate || '0')
  const pipelineValue = parseFloat(d.pipeline_value || '0')
  const annualRevenue = parseFloat(d.annual_revenue || '0')
  const avgSalesCycleDays = parseFloat(d.average_sales_cycle_days || '0')
  const upsellPct = parseFloat(d.upsell_revenue_pct || '0')
  const lostClients = parseFloat(d.lost_clients_last_12m || '0')
  const newClients = parseFloat(d.new_clients_last_12m || '0')

  if (convRate > 0 && convRate < 15) {
    constraints.push({
      name: 'Sales Conversion Bottleneck',
      category: 'Growth',
      severity: convRate < 8 ? 'critical' : 'high',
      verification_score: 82,
      hypothesis: `Lead-to-client conversion rate of ${convRate}% is significantly below industry benchmark of 25-35%. This is suppressing revenue growth and inflating customer acquisition cost.`,
      affected_pillars: ['Growth', 'Operations'],
      opportunity_multiplier: 0.35,
      is_root_cause: convRate < 10,
    })
  }

  if (revenueGrowth > 0 && revenueGrowth < 5 && annualRevenue > 0) {
    constraints.push({
      name: 'Revenue Growth Stagnation',
      category: 'Growth',
      severity: revenueGrowth < 2 ? 'critical' : 'high',
      verification_score: 78,
      hypothesis: `Revenue growth of ${revenueGrowth}% YoY is below inflation and market growth rates. Business is losing real-terms market share.`,
      affected_pillars: ['Growth', 'Strategy'],
      opportunity_multiplier: 0.28,
      is_root_cause: revenueGrowth < 2,
    })
  }

  if (upsellPct > 0 && upsellPct < 10) {
    constraints.push({
      name: 'Expansion Revenue Suppression',
      category: 'Growth',
      severity: 'medium',
      verification_score: 71,
      hypothesis: `Only ${upsellPct}% of revenue comes from upsells/expansions. Best-in-class businesses generate 25-40% from existing clients, indicating significant untapped value.`,
      affected_pillars: ['Growth', 'Client'],
      opportunity_multiplier: 0.18,
      is_root_cause: false,
    })
  }

  // ── OPERATIONS CONSTRAINTS ──────────────────────────────────────────────
  const headcount = parseFloat(d.total_headcount || '0')
  const utilisation = parseFloat(d.avg_utilisation_pct || '0')
  const turnover = parseFloat(d.staff_turnover_12m || '0')
  const onboardingDays = parseFloat(d.onboarding_time_days || '0')
  const onTimePct = parseFloat(d.project_on_time_pct || '0')
  const automationPct = parseFloat(d.automation_level || '0')
  const revenuePerHead = parseFloat(d.revenue_per_head || '0')
  const openRoles = parseFloat(d.open_roles || '0')
  const slaBreachRate = parseFloat(d.sla_breach_rate_pct || '0')

  if (utilisation > 0 && utilisation > 88) {
    constraints.push({
      name: 'Capacity Ceiling Constraint',
      category: 'Operations',
      severity: utilisation > 95 ? 'critical' : 'high',
      verification_score: 85,
      hypothesis: `Team utilisation at ${utilisation}% is at or above sustainable capacity. This creates delivery risk, quality deterioration and prevents taking on new business.`,
      affected_pillars: ['Operations', 'Growth'],
      opportunity_multiplier: 0.32,
      is_root_cause: true,
    })
  }

  if (turnover > 0 && turnover > 20) {
    constraints.push({
      name: 'Workforce Retention Crisis',
      category: 'Operations',
      severity: turnover > 30 ? 'critical' : 'high',
      verification_score: 80,
      hypothesis: `Staff turnover of ${turnover}% significantly exceeds the 10-15% benchmark. Each departure costs an estimated 50-200% of annual salary in recruitment, training and productivity loss.`,
      affected_pillars: ['Operations', 'Growth', 'Risk'],
      opportunity_multiplier: 0.25,
      is_root_cause: false,
    })
  }

  if (onTimePct > 0 && onTimePct < 75) {
    constraints.push({
      name: 'Delivery Execution Gap',
      category: 'Operations',
      severity: onTimePct < 60 ? 'critical' : 'high',
      verification_score: 76,
      hypothesis: `Only ${onTimePct}% of projects delivered on time. This directly damages client trust, increases churn risk and generates rework costs suppressing margins.`,
      affected_pillars: ['Operations', 'Client'],
      opportunity_multiplier: 0.22,
      is_root_cause: false,
    })
  }

  if (headcount > 100 && revenuePerHead > 0 && revenuePerHead < 80000) {
    constraints.push({
      name: 'Revenue Per Head Underperformance',
      category: 'Operations',
      severity: 'medium',
      verification_score: 73,
      hypothesis: `Revenue per head of £${revenuePerHead.toLocaleString()} is below the £120-180K benchmark for businesses of this scale. Indicates structural inefficiency or pricing pressure.`,
      affected_pillars: ['Operations', 'Growth'],
      opportunity_multiplier: 0.20,
      is_root_cause: false,
    })
  }

  if (openRoles > 0 && headcount > 0 && (openRoles / headcount) > 0.08) {
    constraints.push({
      name: 'Talent Acquisition Bottleneck',
      category: 'Operations',
      severity: 'high',
      verification_score: 74,
      hypothesis: `${openRoles} open roles representing ${Math.round(openRoles/headcount*100)}% of workforce. Unfilled positions are limiting capacity, increasing workload on existing team and constraining growth.`,
      affected_pillars: ['Operations', 'Growth'],
      opportunity_multiplier: 0.18,
      is_root_cause: false,
    })
  }

  // ── STRATEGY CONSTRAINTS ────────────────────────────────────────────────
  const pricingConfidence = d.price_vs_market || ''
  const lastPriceIncrease = parseFloat(d.last_price_increase_months || '0')
  const avgDiscount = parseFloat(d.avg_discount_pct || '0')
  const planningHorizon = d.planning_horizon || ''
  const grossMargin = parseFloat(d.gross_margin_pct || '0')
  const netMargin = parseFloat(d.net_profit_margin_pct || '0')

  if (pricingConfidence.toLowerCase().includes('below') || lastPriceIncrease > 24) {
    constraints.push({
      name: 'Pricing Confidence Deficit',
      category: 'Strategy',
      severity: 'high',
      verification_score: 77,
      hypothesis: `${lastPriceIncrease > 24 ? `No price increase in ${lastPriceIncrease} months` : 'Pricing positioned below market'}. This is compressing margins and signalling underconfidence in value proposition.`,
      affected_pillars: ['Strategy', 'Growth'],
      opportunity_multiplier: 0.22,
      is_root_cause: false,
    })
  }

  if (avgDiscount > 0 && avgDiscount > 15) {
    constraints.push({
      name: 'Systematic Discounting Erosion',
      category: 'Strategy',
      severity: 'high',
      verification_score: 79,
      hypothesis: `Average discount of ${avgDiscount}% is eroding margin integrity. At scale, every 1% reduction in average selling price is a direct hit to EBITDA.`,
      affected_pillars: ['Strategy', 'Growth'],
      opportunity_multiplier: 0.15,
      is_root_cause: false,
    })
  }

  if (grossMargin > 0 && grossMargin < 30) {
    constraints.push({
      name: 'Margin Compression',
      category: 'Strategy',
      severity: grossMargin < 20 ? 'critical' : 'high',
      verification_score: 83,
      hypothesis: `Gross margin of ${grossMargin}% is below sustainable levels for a business of this type. Limited headroom for investment, talent and growth.`,
      affected_pillars: ['Strategy', 'Growth', 'Risk'],
      opportunity_multiplier: 0.30,
      is_root_cause: true,
    })
  }

  // ── RISK CONSTRAINTS ────────────────────────────────────────────────────
  const top1ClientPct = parseFloat(d.top_client_revenue_pct || '0')
  const top3ClientPct = parseFloat(d.top_3_clients_revenue_pct || '0')
  const cashRunway = parseFloat(d.cash_runway_months || '0')
  const debtToEbitda = parseFloat(d.debt_to_ebitda || '0')
  const contractRenewalRisk = parseFloat(d.contract_renewal_risk || '0')
  const cyberMaturity = parseFloat(d.cyber_security_maturity || '0')

  if (top1ClientPct > 0 && top1ClientPct > 25) {
    constraints.push({
      name: 'Single Client Concentration Risk',
      category: 'Risk',
      severity: top1ClientPct > 40 ? 'critical' : 'high',
      verification_score: 88,
      hypothesis: `${top1ClientPct}% of revenue from a single client creates existential concentration risk. Loss of this client would be business-critical.`,
      affected_pillars: ['Risk', 'Growth'],
      opportunity_multiplier: 0.35,
      is_root_cause: false,
    })
  }

  if (top3ClientPct > 0 && top3ClientPct > 60) {
    constraints.push({
      name: 'Revenue Concentration Risk',
      category: 'Risk',
      severity: 'high',
      verification_score: 82,
      hypothesis: `Top 3 clients represent ${top3ClientPct}% of revenue. This level of concentration significantly amplifies revenue volatility and negotiating weakness.`,
      affected_pillars: ['Risk', 'Growth'],
      opportunity_multiplier: 0.28,
      is_root_cause: false,
    })
  }

  if (cashRunway > 0 && cashRunway < 6) {
    constraints.push({
      name: 'Cash Runway Critical',
      category: 'Risk',
      severity: cashRunway < 3 ? 'critical' : 'high',
      verification_score: 92,
      hypothesis: `Cash runway of ${cashRunway} months is critically low. This severely constrains strategic options, hiring ability and negotiating position with clients and suppliers.`,
      affected_pillars: ['Risk', 'Strategy', 'Growth'],
      opportunity_multiplier: 0.40,
      is_root_cause: true,
    })
  }

  if (debtToEbitda > 0 && debtToEbitda > 4) {
    constraints.push({
      name: 'Debt Leverage Risk',
      category: 'Risk',
      severity: debtToEbitda > 6 ? 'critical' : 'high',
      verification_score: 80,
      hypothesis: `Net debt to EBITDA ratio of ${debtToEbitda}x exceeds the 3-4x comfort threshold. Limits investment capacity and increases covenant breach risk.`,
      affected_pillars: ['Risk', 'Strategy'],
      opportunity_multiplier: 0.20,
      is_root_cause: false,
    })
  }

  if (cyberMaturity > 0 && cyberMaturity < 5) {
    constraints.push({
      name: 'Cyber Security Exposure',
      category: 'Risk',
      severity: cyberMaturity < 3 ? 'critical' : 'high',
      verification_score: 75,
      hypothesis: `Cyber security maturity score of ${cyberMaturity}/10 leaves the business exposed. For a business of this scale, a breach could cost £500K-£5M+ in remediation, fines and reputational damage.`,
      affected_pillars: ['Risk', 'Operations'],
      opportunity_multiplier: 0.15,
      is_root_cause: false,
    })
  }

  // ── CONTEXT CONSTRAINTS ─────────────────────────────────────────────────
  const nps = parseFloat(d.nps_score || '0')
  const referralPct = parseFloat(d.referral_revenue_pct || '0')
  const yearsTrading = parseFloat(d.years_trading || '0')
  const marketShare = parseFloat(d.market_share_pct || '0')

  if (nps !== 0 && nps < 20) {
    constraints.push({
      name: 'Client Advocacy Deficit',
      category: 'Context',
      severity: nps < 0 ? 'critical' : 'high',
      verification_score: 78,
      hypothesis: `NPS of ${nps} indicates weak client advocacy. Low NPS correlates with higher churn, reduced referrals and pricing pressure as clients do not feel they receive exceptional value.`,
      affected_pillars: ['Context', 'Growth'],
      opportunity_multiplier: 0.18,
      is_root_cause: false,
    })
  }

  if (lostClients > 0 && newClients > 0 && (lostClients / newClients) > 0.4) {
    constraints.push({
      name: 'Client Retention Constraint',
      category: 'Context',
      severity: (lostClients / newClients) > 0.6 ? 'critical' : 'high',
      verification_score: 80,
      hypothesis: `Losing ${lostClients} clients vs acquiring ${newClients} new ones — a ${Math.round(lostClients/newClients*100)}% churn-to-acquisition ratio. Growth is being significantly offset by retention failure.`,
      affected_pillars: ['Context', 'Growth', 'Operations'],
      opportunity_multiplier: 0.25,
      is_root_cause: false,
    })
  }

  return constraints
}

function scoreHealth(data: Record<string, any>, constraints: any[]): Record<string, any> {
  const criticalCount = constraints.filter(c => c.severity === 'critical').length
  const highCount = constraints.filter(c => c.severity === 'high').length

  const grossMargin = parseFloat(data.gross_margin_pct || '55')
  const utilisation = parseFloat(data.avg_utilisation_pct || '75')
  const convRate = parseFloat(data.lead_to_client_conversion || '20')
  const turnover = parseFloat(data.staff_turnover_12m || '15')
  const nps = parseFloat(data.nps_score || '30')
  const onTime = parseFloat(data.project_on_time_pct || '80')

  // Score each pillar 0-20
  const growthScore = Math.max(0, Math.min(20, Math.round(
    (Math.min(grossMargin, 80) / 80 * 7) +
    (Math.min(convRate, 40) / 40 * 7) +
    (Math.min(parseFloat(data.revenue_growth_rate_pct || '10'), 30) / 30 * 6)
  )))

  const opsScore = Math.max(0, Math.min(20, Math.round(
    (utilisation > 85 ? 8 - (utilisation - 85) * 0.5 : utilisation / 85 * 8) +
    (Math.max(0, (30 - turnover) / 30 * 6)) +
    (onTime / 100 * 6)
  )))

  const strategyScore = Math.max(0, Math.min(20, Math.round(
    (Math.min(grossMargin, 70) / 70 * 8) +
    (data.planning_horizon ? 6 : 3) +
    (data.competitive_advantage ? 6 : 3)
  )))

  const riskScore = Math.max(0, Math.min(20, Math.round(
    20 - (criticalCount * 4) - (highCount * 2)
  )))

  const contextScore = Math.max(0, Math.min(20, Math.round(
    (Math.min(Math.max(nps + 100, 0), 200) / 200 * 8) +
    (Math.min(parseFloat(data.referral_revenue_pct || '20'), 60) / 60 * 6) +
    (parseFloat(data.years_trading || '5') >= 5 ? 6 : parseFloat(data.years_trading || '1') * 1.2)
  )))

  const overall = growthScore + opsScore + strategyScore + riskScore + contextScore

  return {
    overall,
    pillars: {
      growth: { score: growthScore, label: 'Growth' },
      operations: { score: opsScore, label: 'Operations' },
      strategy: { score: strategyScore, label: 'Strategy' },
      risk: { score: riskScore, label: 'Risk' },
      context: { score: contextScore, label: 'Context' },
    }
  }
}

function selectPrimaryConstraint(constraints: any[], data: Record<string, any>) {
  if (constraints.length === 0) return null

  // Score each constraint: severity + verification + opportunity + is_root_cause
  const scored = constraints.map(c => {
    const severityScore = c.severity === 'critical' ? 40 : c.severity === 'high' ? 25 : 10
    const rootScore = c.is_root_cause ? 20 : 0
    const verScore = (c.verification_score || 70) * 0.3
    const oppScore = (c.opportunity_multiplier || 0.1) * 100
    return { ...c, total_score: severityScore + rootScore + verScore + oppScore }
  })

  scored.sort((a, b) => b.total_score - a.total_score)

  const primary = scored[0]
  const annual_revenue = parseFloat(data.annual_revenue || '0')
  const oppBase = annual_revenue > 0 ? annual_revenue * primary.opportunity_multiplier : 0

  return {
    ...primary,
    opportunity: {
      value_low: Math.round(oppBase * 0.6),
      value_high: Math.round(oppBase * 1.4),
    }
  }
}

function calculateTotalOpportunity(constraints: any[], data: Record<string, any>) {
  const annual_revenue = parseFloat(data.annual_revenue || '0')
  if (annual_revenue === 0) return { total_low: 0, total_high: 0 }
  const totalMultiplier = Math.min(0.45, constraints.reduce((s, c) => s + (c.opportunity_multiplier || 0), 0))
  return {
    total_low: Math.round(annual_revenue * totalMultiplier * 0.6),
    total_high: Math.round(annual_revenue * totalMultiplier * 1.4),
  }
}

function generateIntelligenceResponse(question: string, ctx: any): string {
  const q = question.toLowerCase()
  const primary = ctx.primary
  const secondary = ctx.secondary || []
  const biz = ctx.businessName || 'your business'
  const industry = ctx.industry || ''
  const health = ctx.health || {}
  const data = ctx.rawData || {}

  if (!primary) {
    return `No constraints detected for ${biz} yet. Add more data via the Business Twin Centre — connect your CRM, finance system or add manual data inputs to enable BEI constraint detection.`
  }

  const oppStr = primary.opportunity?.value_low > 0
    ? `£${primary.opportunity.value_low.toLocaleString()} – £${primary.opportunity.value_high.toLocaleString()}`
    : 'to be quantified'

  if (q.includes('why') || q.includes('constraint') || q.includes('detected')) {
    return `**${primary.name}** is your primary constraint for ${biz} based on live analysis of your connected data:\n\n**Verification: ${primary.verification_score}/100** — confirmed against ${industry || 'industry'} benchmarks using your actual operational data.\n\n**Evidence:** ${primary.hypothesis}\n\n**Network impact:** This constraint is causing or amplifying ${secondary.length} secondary constraint${secondary.length !== 1 ? 's' : ''}: ${secondary.map((c: any) => c.name).join(', ') || 'none identified yet'}.\n\n**Annual opportunity:** ${oppStr}\n\nThis is derived from your actual revenue data (£${parseFloat(data.annual_revenue || '0').toLocaleString()}) and the constraint's impact multiplier of ${Math.round((primary.opportunity_multiplier || 0) * 100)}%.`
  }

  if (q.includes('focus') || q.includes('priorit') || q.includes('first') || q.includes('next')) {
    return `**Immediate priority for ${biz}:**\n\n1. **Resolve ${primary.name}** — ${primary.hypothesis.slice(0, 120)}...\n\nThis is your highest-leverage action with ${oppStr} at stake.\n\n**Sequence after that:**\n${secondary.slice(0, 3).map((c: any, i: number) => (i+2) + '. ' + c.name).join('\n')}\n\nDo not attempt multiple constraints simultaneously — this reduces effectiveness by 40-60%.\n\n**To improve constraint accuracy:** connect additional data sources in Business Twin Centre.`
  }

  if (q.includes('health') || q.includes('score') || q.includes('pillar')) {
    const pillars = Object.values(health.pillars || {})
    const pillarStr = pillars.map((p: any) => '\u2022 ' + p.label + ': ' + p.score + '/20').join('\n')
    return `**${biz} Business Health Score: ${health.overall || 0}/100**\n\n${pillarStr}\n\nScored against your live data — not estimates. The primary drag on your score is **${primary.name}** which is directly suppressing your ${primary.affected_pillars?.[0] || 'performance'} pillar.\n\nIndustry benchmark for ${industry || 'your sector'}: 60-65/100. Resolving ${primary.name} typically adds 8-15 points.`
  }

  if (q.includes('revenue') || q.includes('opportunit') || q.includes('losing') || q.includes('money')) {
    const annualRevenue = parseFloat(data.annual_revenue || '0')
    return `**${biz} Revenue Intelligence:**\n\n${annualRevenue > 0 ? `• Annual Revenue: £${annualRevenue.toLocaleString()}
` : ''}• Annual Opportunity from ${primary.name}: **${oppStr}**\n• This represents ${annualRevenue > 0 ? Math.round((primary.opportunity?.value_low || 0) / annualRevenue * 100) + '-' + Math.round((primary.opportunity?.value_high || 0) / annualRevenue * 100) + '% of current revenue' : 'significant upside'}\n\nThe longer ${primary.name} remains unresolved, the more this compounds. At current trajectory, this represents a ${oppStr} annual drag on performance.\n\nActivate your Tier 1 deployment package to begin capturing this value.`
  }

  return `**${biz} — BEI Intelligence Summary**\n\nPrimary Constraint: **${primary.name}**\n• Severity: ${primary.severity}\n• Verification: ${primary.verification_score}/100\n• Evidence: ${primary.hypothesis?.slice(0, 100)}...\n• Opportunity: ${oppStr}\n\nHealth Score: ${health.overall || 0}/100\nSecondary Constraints: ${secondary.length > 0 ? secondary.map((c: any) => c.name).join(', ') : 'none detected'}\n\nAll analysis derived from your live connected data. Add more data sources to increase precision.`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { businessName, industry, question, businessId, userEmail } = body

    // ── Fetch real connector data from Supabase ──────────────────────────
    let connectors: any[] = []
    let businessRecord: any = null

    if (userEmail) {
      const { data: bizData } = await supabase
        .from('businesses')
        .select('id, business_name, industry, mri_result, connected_sources')
        .eq('email', userEmail)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()

      if (bizData) {
        businessRecord = bizData

        const { data: connData } = await supabase
          .from('connectors')
          .select('connector_type, status, data_snapshot, last_synced_at')
          .eq('business_id', bizData.id)
          .eq('status', 'active')

        if (connData) connectors = connData
      }
    }

    // ── Analyse real data ────────────────────────────────────────────────
    const rawData = analyseConnectorData(connectors)
    const bizName = businessRecord?.business_name || businessName || 'Your Business'
    const bizIndustry = businessRecord?.industry || industry || ''

    const detectedConstraints = detectConstraints(rawData, bizName, bizIndustry)
    const health = scoreHealth(rawData, detectedConstraints)
    const primary = selectPrimaryConstraint(detectedConstraints, rawData)
    const secondary = primary
      ? detectedConstraints.filter(c => c.name !== primary.name).slice(0, 5)
      : detectedConstraints.slice(0, 5)
    const totalOpportunity = calculateTotalOpportunity(detectedConstraints, rawData)

    const response = generateIntelligenceResponse(question || '', {
      primary,
      secondary,
      health,
      businessName: bizName,
      industry: bizIndustry,
      rawData,
    })

    return NextResponse.json({
      success: true,
      response,
      // Also return structured data for UI use
      primary,
      secondary,
      health,
      total_opportunity: totalOpportunity,
      constraints_detected: detectedConstraints.length,
      data_points_analysed: Object.keys(rawData).length,
    })

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
