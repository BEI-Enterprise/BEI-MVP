'use client'
import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase'

const supabase = createClient()

const CONNECTOR_WEIGHTS: Record<string, number> = {
  hubspot: 8, salesforce: 8, xero: 8, quickbooks: 8, hibob: 6, workday: 6, google_analytics: 5,
  manual_crm: 4, manual_finance: 5, finance_advanced: 5, finance_divisional: 5,
  growth_revenue: 6, growth_pricing: 5, operations_team: 5, operations_processes: 5, operations_enterprise: 5,
  strategy_vision: 5, strategy_corporate: 4, strategy_governance: 3,
  risk_concentration: 4, risk_compliance: 4, risk_enterprise: 4,
  context_market: 4, context_brand: 4, people_workforce: 5, people_leadership: 5,
  tech_systems: 5, tech_data: 5,
}

function mergeData(connectors: any[]): Record<string, any> {
  const data: Record<string, any> = {}
  connectors.forEach((c: any) => { if (c.status === 'active' && c.data_snapshot) Object.assign(data, c.data_snapshot) })
  return data
}

function detect(data: Record<string, any>) {
  const out: any[] = []
  const n = (k: string, d = 0) => parseFloat(data[k] || String(d))
  const conv = n('lead_to_client_conversion'), rg = n('revenue_growth_rate_pct'), util = n('avg_utilisation_pct')
  const turn = n('staff_turnover_12m'), onTime = n('project_on_time_pct'), gm = n('gross_margin_pct')
  const top1 = n('top_client_revenue_pct'), cash = n('cash_runway_months'), npsVal = n('nps_score')
  const disc = n('avg_discount_pct'), rev = n('annual_revenue'), rph = n('revenue_per_head')
  const roles = n('open_roles'), hc = n('total_headcount'), lost = n('lost_clients_last_12m'), newC = n('new_clients_last_12m')
  const dte = n('debt_to_ebitda'), cyber = n('cyber_security_maturity'), lpi = n('last_price_increase_months')

  if (conv > 0 && conv < 15) out.push({ name: 'Sales Conversion Bottleneck', category: 'Growth', severity: conv < 8 ? 'critical' : 'high', verification_score: 82, hypothesis: 'Conversion of ' + conv + '% is below the 25-35% benchmark — suppressing revenue and inflating CAC.', affected_pillars: ['Growth','Operations'], opportunity_multiplier: 0.30, is_root_cause: conv < 10 })
  if (rg > 0 && rg < 5) out.push({ name: 'Revenue Growth Stagnation', category: 'Growth', severity: rg < 2 ? 'critical' : 'high', verification_score: 78, hypothesis: 'Revenue growth of ' + rg + '% YoY is below inflation — losing real-terms market share.', affected_pillars: ['Growth','Strategy'], opportunity_multiplier: 0.25, is_root_cause: rg < 2 })
  if (util > 0 && util > 88) out.push({ name: 'Capacity Ceiling Constraint', category: 'Operations', severity: util > 95 ? 'critical' : 'high', verification_score: 85, hypothesis: 'Team utilisation at ' + util + '% — delivery risk, quality deterioration and growth blockage.', affected_pillars: ['Operations','Growth'], opportunity_multiplier: 0.32, is_root_cause: true })
  if (turn > 0 && turn > 20) out.push({ name: 'Workforce Retention Crisis', category: 'Operations', severity: turn > 30 ? 'critical' : 'high', verification_score: 80, hypothesis: 'Staff turnover of ' + turn + '% exceeds benchmark. Each departure costs 50-200% of annual salary.', affected_pillars: ['Operations','Growth','Risk'], opportunity_multiplier: 0.22, is_root_cause: false })
  if (onTime > 0 && onTime < 75) out.push({ name: 'Delivery Execution Gap', category: 'Operations', severity: onTime < 60 ? 'critical' : 'high', verification_score: 76, hypothesis: 'Only ' + onTime + '% on time — damages client trust, increases churn and generates rework costs.', affected_pillars: ['Operations','Client'], opportunity_multiplier: 0.20, is_root_cause: false })
  if (gm > 0 && gm < 30) out.push({ name: 'Margin Compression', category: 'Strategy', severity: gm < 20 ? 'critical' : 'high', verification_score: 83, hypothesis: 'Gross margin of ' + gm + '% is below sustainable levels for investment, talent and growth.', affected_pillars: ['Strategy','Growth','Risk'], opportunity_multiplier: 0.30, is_root_cause: true })
  if (disc > 0 && disc > 15) out.push({ name: 'Systematic Discounting Erosion', category: 'Strategy', severity: 'high', verification_score: 79, hypothesis: 'Average discount of ' + disc + '% eroding margin integrity. Every 1% reduction in ASP hits EBITDA directly.', affected_pillars: ['Strategy','Growth'], opportunity_multiplier: 0.15, is_root_cause: false })
  if (lpi > 24) out.push({ name: 'Pricing Confidence Deficit', category: 'Strategy', severity: 'high', verification_score: 77, hypothesis: 'No price increase in ' + lpi + ' months — compressing real-terms margin and signalling underconfidence.', affected_pillars: ['Strategy','Growth'], opportunity_multiplier: 0.18, is_root_cause: false })
  if (top1 > 0 && top1 > 25) out.push({ name: 'Single Client Concentration Risk', category: 'Risk', severity: top1 > 40 ? 'critical' : 'high', verification_score: 88, hypothesis: top1 + '% revenue from one client creates existential risk — loss would be business-critical.', affected_pillars: ['Risk','Growth'], opportunity_multiplier: 0.30, is_root_cause: false })
  if (cash > 0 && cash < 6) out.push({ name: 'Cash Runway Critical', category: 'Risk', severity: cash < 3 ? 'critical' : 'high', verification_score: 92, hypothesis: 'Cash runway of ' + cash + ' months constrains strategy, hiring and negotiating position critically.', affected_pillars: ['Risk','Strategy','Growth'], opportunity_multiplier: 0.40, is_root_cause: true })
  if (dte > 0 && dte > 4) out.push({ name: 'Debt Leverage Risk', category: 'Risk', severity: dte > 6 ? 'critical' : 'high', verification_score: 80, hypothesis: 'Net debt to EBITDA of ' + dte + 'x exceeds comfort threshold — limits investment capacity.', affected_pillars: ['Risk','Strategy'], opportunity_multiplier: 0.18, is_root_cause: false })
  if (cyber > 0 && cyber < 5) out.push({ name: 'Cyber Security Exposure', category: 'Risk', severity: cyber < 3 ? 'critical' : 'high', verification_score: 75, hypothesis: 'Cyber maturity of ' + cyber + '/10 — significant breach risk and regulatory fine exposure at this scale.', affected_pillars: ['Risk','Operations'], opportunity_multiplier: 0.15, is_root_cause: false })
  if (npsVal !== 0 && npsVal < 20) out.push({ name: 'Client Advocacy Deficit', category: 'Context', severity: npsVal < 0 ? 'critical' : 'high', verification_score: 78, hypothesis: 'NPS of ' + npsVal + ' — weak advocacy correlates with higher churn, fewer referrals and pricing pressure.', affected_pillars: ['Context','Growth'], opportunity_multiplier: 0.18, is_root_cause: false })
  if (lost > 0 && newC > 0 && (lost/newC) > 0.4) out.push({ name: 'Client Retention Constraint', category: 'Context', severity: (lost/newC) > 0.6 ? 'critical' : 'high', verification_score: 80, hypothesis: 'Losing ' + lost + ' vs acquiring ' + newC + ' clients — ' + Math.round(lost/newC*100) + '% churn-to-acquisition ratio undermining growth.', affected_pillars: ['Context','Growth'], opportunity_multiplier: 0.22, is_root_cause: false })
  if (hc > 100 && rph > 0 && rph < 80000) out.push({ name: 'Revenue Per Head Underperformance', category: 'Operations', severity: 'medium', verification_score: 73, hypothesis: 'Revenue per head of GBP' + rph.toLocaleString() + ' is below the GBP120-180K benchmark for businesses of this scale.', affected_pillars: ['Operations','Growth'], opportunity_multiplier: 0.18, is_root_cause: false })
  if (roles > 0 && hc > 0 && (roles/hc) > 0.08) out.push({ name: 'Talent Acquisition Bottleneck', category: 'Operations', severity: 'high', verification_score: 74, hypothesis: roles + ' open roles (' + Math.round(roles/hc*100) + '% of workforce) limiting capacity and constraining growth.', affected_pillars: ['Operations','Growth'], opportunity_multiplier: 0.15, is_root_cause: false })

  return out
}

function scoreHealth(data: Record<string, any>, constraints: any[]) {
  const n = (k: string, d = 0) => parseFloat(data[k] || String(d))
  const crit = constraints.filter(c => c.severity === 'critical').length
  const high = constraints.filter(c => c.severity === 'high').length
  const gm = n('gross_margin_pct', 55), util = n('avg_utilisation_pct', 75), conv = n('lead_to_client_conversion', 20)
  const turn = n('staff_turnover_12m', 15), npsVal = n('nps_score', 30), onTime = n('project_on_time_pct', 80)
  const g = Math.max(0, Math.min(20, Math.round((Math.min(gm,80)/80*7)+(Math.min(conv,40)/40*7)+(Math.min(n('revenue_growth_rate_pct',10),30)/30*6))))
  const o = Math.max(0, Math.min(20, Math.round((util>85?8-(util-85)*0.5:util/85*8)+Math.max(0,(30-turn)/30*6)+(onTime/100*6))))
  const s = Math.max(0, Math.min(20, Math.round((Math.min(gm,70)/70*8)+(data.planning_horizon?6:3)+(data.competitive_advantage?6:3))))
  const r = Math.max(0, Math.min(20, Math.round(20-crit*4-high*2)))
  const c = Math.max(0, Math.min(20, Math.round((Math.min(Math.max(npsVal+100,0),200)/200*8)+(Math.min(n('referral_revenue_pct',20),60)/60*6)+(n('years_trading',5)>=5?6:n('years_trading',1)*1.2))))
  return { overall: g+o+s+r+c, pillars: { growth:{score:g,label:'Growth'}, operations:{score:o,label:'Operations'}, strategy:{score:s,label:'Strategy'}, risk:{score:r,label:'Risk'}, context:{score:c,label:'Context'} } }
}

function selectPrimary(constraints: any[], data: Record<string, any>) {
  if (!constraints.length) return null
  const scored = constraints.map(c => ({ ...c, total_score: (c.severity==='critical'?40:c.severity==='high'?25:10)+(c.is_root_cause?20:0)+(c.verification_score||70)*0.3+(c.opportunity_multiplier||0.1)*100 }))
  scored.sort((a,b) => b.total_score-a.total_score)
  const p = scored[0]
  const rev = parseFloat(data.annual_revenue||'0')
  const base = rev*(p.opportunity_multiplier||0.2)
  return { ...p, opportunity: { value_low: Math.round(base*0.6), value_high: Math.round(base*1.4) } }
}

export function useBEIIntelligence() {
  const [loading, setLoading] = useState(true)
  const [business, setBusiness] = useState<any>(null)
  const [connectors, setConnectors] = useState<any[]>([])
  const [intelligence, setIntelligence] = useState<any>(null)
  const [completeness, setCompleteness] = useState(0)

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setLoading(false); return }
        const { data: biz } = await supabase.from('businesses').select('id,business_name,industry,location_country,subscription_tier,subscription_status,mri_result,updated_at').eq('email', user.email).order('updated_at',{ascending:false}).limit(1).single()
        if (!biz) { setLoading(false); return }
        setBusiness(biz)
        const { data: connData } = await supabase.from('connectors').select('connector_type,status,data_snapshot,last_synced_at').eq('business_id', biz.id)
        const active = (connData||[]).filter((c:any) => c.status==='active')
        setConnectors(active)
        let comp = 0
        active.forEach((c:any) => { if (CONNECTOR_WEIGHTS[c.connector_type]) comp += CONNECTOR_WEIGHTS[c.connector_type] })
        comp = Math.min(100, comp)
        setCompleteness(comp)
        if (comp >= 75) {
          const raw = mergeData(active)
          const detected = detect(raw)
          const health = scoreHealth(raw, detected)
          const primary = selectPrimary(detected, raw)
          const secondary = primary ? detected.filter(c => c.name !== primary.name).slice(0,5) : detected.slice(0,5)
          const mult = Math.min(0.4, detected.reduce((s,c) => s+(c.opportunity_multiplier||0), 0))
          const rev = parseFloat(raw.annual_revenue||'0')
          setIntelligence({ primary, secondary, health, total_opportunity:{ total_low:Math.round(rev*mult*0.6), total_high:Math.round(rev*mult*1.4) }, raw_data:raw, constraints_detected:detected.length })
        }
      } catch(e) {}
      setLoading(false)
    }
    load()
  }, [])

  return { loading, business, connectors, intelligence, completeness }
}
