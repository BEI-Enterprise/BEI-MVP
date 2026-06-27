'use client'
import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase'
import DashboardShell from '../components/DashboardShell'

const supabase = createClient()
const gold = '#C8A24A'
const card = '#0e0e0e'
const border = '#1e1e1e'

export default function OutcomeDeploymentPage() {
  const [result, setResult] = useState<Record<string, any> | null>(null)
  const [businessName, setBusinessName] = useState('Your Business')
  const [industry, setIndustry] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview'|'deployments'|'tracker'|'value'|'impact'>('overview')
  const [selectedDeploy, setSelectedDeploy] = useState<any>(null)
  const [agentLoading, setAgentLoading] = useState(false)
  const [agentContent, setAgentContent] = useState('')
  const [approvedTier2, setApprovedTier2] = useState<Set<string>>(new Set())
  const [showAllPlansModal, setShowAllPlansModal] = useState(false)
  const [showAtRiskModal, setShowAtRiskModal] = useState(false)
  const [showOutcomesModal, setShowOutcomesModal] = useState(false)
  const [showForecastModal, setShowForecastModal] = useState(false)
  const [showDriverModal, setShowDriverModal] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data } = await supabase
            .from('businesses')
            .select('id, business_name, mri_result, industry')
            .eq('email', user.email)
            .order('updated_at', { ascending: false })
            .limit(1)
            .single()
          if (data) {
            setBusinessName(data.business_name || 'Your Business')
            setIndustry(data.industry || '')
            if (data.mri_result) setResult(data.mri_result)
          }
        }
      } catch (e) {}
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <main style={{ backgroundColor: '#050505', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.3em' }}>LOADING OUTCOME & DEPLOYMENT...</div>
    </main>
  )

  const primary = result?.primary_constraint || null
  const secondary = result?.secondary_constraints || []
  const packages = result?.deployment_packages || {}
  const totalOpp = result?.total_opportunity || {}
  const confidence = result?.confidence || 'medium'
  const oppLow = totalOpp?.total_low || 0
  const oppHigh = totalOpp?.total_high || 0
  const oppMid = oppLow > 0 ? Math.round((oppLow + oppHigh) / 2) : 20000

  const fmt = (n: number) => '£' + Math.round(n).toLocaleString('en-GB')

  // Pull real tier packages from MRI result
  const tier1Raw: any[] = packages.tier1_automatic || []
  const tier2Raw: any[] = packages.tier2_approval || []
  const tier3Raw: any[] = packages.tier3_recommendation || []

  // Build deployment pipeline from real data + intelligent fallbacks
  const buildDeployments = () => {
    const all: any[] = []
    tier1Raw.forEach((p: any, i: number) => all.push({
      id: p.deployment_id || 't1-' + i,
      title: p.action_title || 'Automatic Action ' + (i+1),
      area: p.constraint_name || (primary?.name || 'Primary Constraint'),
      tier: 1, tierLabel: 'Automatic', tierColor: '#4aaa4a',
      status: 'Planned', progress: 0,
      expectedValue: fmt(Math.round(oppMid * 0.15)),
      eta: '7 days',
      desc: p.action_description || '',
      outcome: p.expected_outcome || '',
      measurement: p.measurement_plan || '',
      raw: p,
    }))
    tier2Raw.forEach((p: any, i: number) => all.push({
      id: p.deployment_id || 't2-' + i,
      title: p.action_title || 'Approval Required ' + (i+1),
      area: p.constraint_name || (primary?.name || 'Primary Constraint'),
      tier: 2, tierLabel: 'Awaiting Approval', tierColor: gold,
      status: 'In Progress', progress: 60,
      expectedValue: fmt(Math.round(oppMid * 0.25)),
      eta: '15 days',
      desc: p.action_description || '',
      outcome: p.expected_outcome || '',
      measurement: p.measurement_plan || '',
      raw: p,
    }))
    tier3Raw.forEach((p: any, i: number) => all.push({
      id: p.deployment_id || 't3-' + i,
      title: p.action_title || 'Strategic Recommendation ' + (i+1),
      area: p.constraint_name || (primary?.name || 'Strategy'),
      tier: 3, tierLabel: 'Recommendation', tierColor: '#4a8ab0',
      status: 'Validating', progress: 75,
      expectedValue: fmt(Math.round(oppMid * 0.35)),
      eta: '25 days',
      desc: p.action_description || '',
      outcome: p.expected_outcome || '',
      measurement: p.measurement_plan || '',
      raw: p,
    }))
    // If no real packages yet, show intelligent defaults based on primary constraint
    if (all.length === 0 && primary) {
      all.push(
        { id: 'd1', title: primary.name + ' — Delegation Framework', area: primary.name, tier: 1, tierLabel: 'Automatic', tierColor: '#4aaa4a', status: 'In Progress', progress: 60, expectedValue: fmt(Math.round(oppMid * 0.27)), eta: '15 days', desc: 'Automated leadership delegation framework to reduce founder dependency.', outcome: 'Reduce owner operational involvement by 40%', measurement: 'Track time-to-decision and owner hours in delivery weekly' },
        { id: 'd2', title: 'Process Optimisation Initiative', area: 'Operational Efficiency', tier: 1, tierLabel: 'Automatic', tierColor: '#4aaa4a', status: 'In Progress', progress: 40, expectedValue: fmt(Math.round(oppMid * 0.21)), eta: '25 days', desc: 'Automated process optimisation across core delivery operations.', outcome: 'Reduce operational friction by 30%', measurement: 'Track delivery time and error rate monthly' },
        { id: 'd3', title: 'Key Person Succession Plan', area: 'People & Leadership', tier: 2, tierLabel: 'Awaiting Approval', tierColor: gold, status: 'Validating', progress: 75, expectedValue: fmt(Math.round(oppMid * 0.18)), eta: '10 days', desc: 'Structured succession plan to reduce key person dependency risk.', outcome: 'Business can operate without key person for 2+ weeks', measurement: 'Test operational continuity quarterly' },
        { id: 'd4', title: 'CRM & Sales Process Enhancement', area: 'Revenue Growth', tier: 2, tierLabel: 'Awaiting Approval', tierColor: gold, status: 'Realising Value', progress: 70, expectedValue: fmt(Math.round(oppMid * 0.15)), eta: '5 days', desc: 'CRM configuration and sales workflow to improve conversion.', outcome: 'Increase lead-to-client conversion by 15%', measurement: 'Track conversion rate weekly via CRM' },
        { id: 'd5', title: 'Cost Management Programme', area: 'Cost Reduction', tier: 3, tierLabel: 'Recommendation', tierColor: '#4a8ab0', status: 'Realising Value', progress: 65, expectedValue: fmt(Math.round(oppMid * 0.12)), eta: '12 days', desc: 'Strategic cost review and reduction programme across operations.', outcome: 'Reduce operational costs by 10-15%', measurement: 'Monthly P&L review against baseline' },
        { id: 'd6', title: 'Market Positioning Review', area: 'Strategy', tier: 3, tierLabel: 'Recommendation', tierColor: '#4a8ab0', status: 'Planned', progress: 0, expectedValue: fmt(Math.round(oppMid * 0.07)), eta: '30 days', desc: 'Strategic market repositioning to improve competitive differentiation.', outcome: 'Improved pricing power and win rate', measurement: 'Track win rate and average deal value quarterly' },
      )
    }
    return all
  }

  const deployments = buildDeployments()
  const planned = deployments.filter(d => d.status === 'Planned').length
  const inProgress = deployments.filter(d => d.status === 'In Progress').length
  const validating = deployments.filter(d => d.status === 'Validating').length
  const realisingValue = deployments.filter(d => d.status === 'Realising Value').length
  const completed = deployments.filter(d => d.status === 'Completed').length

  const totalExpected = oppHigh > 0 ? oppHigh : deployments.reduce((s, d) => s + (parseInt(d.expectedValue.replace(/[£,]/g,'')) || 0), 0)
  const valueRealised = Math.round(totalExpected * 0.41)
  const realisationRate = 41

  // Outcome impact rows
  const outcomeAreas = [
    { area: 'Revenue Growth', expected: fmt(Math.round(totalExpected * 0.27)), realised: fmt(Math.round(valueRealised * 0.31)), rate: 47, trend: 'up' },
    { area: 'Operational Efficiency', expected: fmt(Math.round(totalExpected * 0.21)), realised: fmt(Math.round(valueRealised * 0.23)), rate: 44, trend: 'up' },
    { area: 'Cost Reduction', expected: fmt(Math.round(totalExpected * 0.18)), realised: fmt(Math.round(valueRealised * 0.19)), rate: 44, trend: 'neutral' },
    { area: 'Client Retention', expected: fmt(Math.round(totalExpected * 0.16)), realised: fmt(Math.round(valueRealised * 0.15)), rate: 38, trend: 'up' },
    { area: 'Risk Reduction', expected: fmt(Math.round(totalExpected * 0.12)), realised: fmt(Math.round(valueRealised * 0.07)), rate: 22, trend: 'down' },
    { area: 'People & Leadership', expected: fmt(Math.round(totalExpected * 0.06)), realised: fmt(Math.round(valueRealised * 0.05)), rate: 33, trend: 'neutral' },
  ]

  const recentOutcomes = [
    { title: (primary?.name || 'Leadership') + ' Capacity Improvement', area: primary?.name || 'Management Bottleneck', value: fmt(Math.round(oppMid * 0.09)), time: '2 days ago', color: '#4aaa4a' },
    { title: 'Automated Reporting Implementation', area: 'Operational Efficiency', value: fmt(Math.round(oppMid * 0.06)), time: '4 days ago', color: '#4aaa4a' },
    { title: 'Supplier Cost Optimisation', area: 'Cost Reduction', value: fmt(Math.round(oppMid * 0.05)), time: '1 week ago', color: '#4aaa4a' },
    { title: 'Sales Process Standardisation', area: 'Revenue Growth', value: fmt(Math.round(oppMid * 0.08)), time: '1 week ago', color: '#4aaa4a' },
    { title: 'Client Onboarding Optimisation', area: 'Client Retention', value: fmt(Math.round(oppMid * 0.04)), time: '2 weeks ago', color: '#4aaa4a' },
  ]

  const outcomeDrivers = [
    { label: 'Leadership & People', pct: 35, value: fmt(Math.round(valueRealised * 0.35)), color: '#4aaa4a' },
    { label: 'Process & Operations', pct: 28, value: fmt(Math.round(valueRealised * 0.28)), color: '#4a8ab0' },
    { label: 'Technology & Automation', pct: 18, value: fmt(Math.round(valueRealised * 0.18)), color: gold },
    { label: 'Sales & Marketing', pct: 12, value: fmt(Math.round(valueRealised * 0.12)), color: '#9a6ab0' },
    { label: 'Finance & Cost', pct: 7, value: fmt(Math.round(valueRealised * 0.07)), color: '#cc4444' },
  ]

  const recommendations = [
    { icon: '↗', title: 'Accelerate ' + (primary?.name || 'Leadership') + ' Framework', desc: 'Increase deployment resources to realise ' + fmt(Math.round(oppMid * 0.12)) + ' value 2 weeks faster.', impact: 'High Impact', impactColor: '#e8923a', value: fmt(Math.round(oppMid * 0.12)) },
    { icon: '⚠', title: 'Address At-Risk Initiative', desc: 'Process Optimisation Initiative is at risk of 20% value reduction.', impact: 'Medium Impact', impactColor: gold, value: fmt(Math.round(oppMid * 0.09)) },
    { icon: '⊕', title: 'Remove Implementation Blocker', desc: 'CRM integration dependency is delaying 3 initiatives.', impact: 'High Impact', impactColor: '#e8923a', value: fmt(Math.round(oppMid * 0.15)) },
    { icon: '◈', title: 'Scale Successful Initiative', desc: (primary?.name || 'Leadership') + ' Capacity Improvement could deliver 40% more value if scaled.', impact: 'High Impact', impactColor: '#e8923a', value: fmt(Math.round(oppMid * 0.09)) },
    { icon: '⊞', title: 'Optimise Resource Allocation', desc: 'Reallocate 2 resources to improve overall value realisation by 15%.', impact: 'Medium Impact', impactColor: gold, value: fmt(Math.round(oppMid * 0.11)) },
  ]

  const callDeploymentAgent = async (deployment: any) => {
    setAgentLoading(true)
    setAgentContent('')
    try {
      const res = await fetch('/api/agents/deployment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deployment: { title: deployment.title, type: deployment.area, tier: deployment.tier, desc: deployment.desc, expectedOutcome: deployment.outcome },
          constraint: primary,
          opportunity: totalOpp,
          businessName,
          industry,
          question: 'Write the complete ready-to-use deployment content for this action. Include step-by-step implementation, measurement criteria, and expected outcomes.',
        }),
      })
      const data = await res.json()
      setAgentContent(data.response || 'Unable to generate deployment content.')
    } catch (e) {
      setAgentContent('Error contacting deployment agent. Please try again.')
    }
    setAgentLoading(false)
  }

  const statusColor = (s: string) => s === 'In Progress' ? '#4aaa4a' : s === 'Validating' ? gold : s === 'Realising Value' ? '#4aaa4a' : s === 'Completed' ? '#4a8ab0' : '#555'

  const trendSpark = (trend: string, color: string) => (
    <svg width="60" height="20" viewBox="0 0 50 16">
      {trend === 'up' && <polyline points="0,14 10,15 20,12 30,8 40,8 50,3" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>}
      {trend === 'neutral' && <polyline points="0,8 10,7 20,9 30,7 40,8 50,7" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>}
      {trend === 'down' && <polyline points="0,3 10,5 20,7 30,9 40,15 50,14" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>}
    </svg>
  )

  return (
    <DashboardShell activeId="deployment">

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid ' + border }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '900', letterSpacing: '-0.02em', margin: '0 0 6px', color: '#ffffff' }}>Outcome & Deployment</h1>
          <div style={{ fontSize: '12px', color: '#666' }}>Track expected outcomes, manage deployment plans and measure real-world impact.</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#888' }}>
            Business Twin™: <span style={{ color: '#4aaa4a', fontWeight: '600' }}>Active</span>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#4aaa4a', boxShadow: '0 0 6px rgba(74,170,74,0.7)' }} />
          </div>
          <button style={{ padding: '8px 14px', backgroundColor: 'rgba(200,162,74,0.1)', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '6px', color: gold, fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>⊙ Outcome Scan</button>
          <div style={{ width: '32px', height: '32px', border: '1px solid ' + border, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#555', fontSize: '16px' }}>⋮</div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '16px', borderBottom: '1px solid ' + border }}>
        {(['overview','deployments','tracker','value','impact'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '10px 18px', border: 'none', backgroundColor: 'transparent', color: activeTab === tab ? gold : '#cccccc', fontSize: '13px', fontWeight: activeTab === tab ? '700' : '600', cursor: 'pointer', borderBottom: activeTab === tab ? '2px solid ' + gold : '2px solid transparent', marginBottom: '-1px', textTransform: 'capitalize' as const }}>
            {tab === 'overview' ? 'Outcome Overview' : tab === 'deployments' ? 'Deployment Plans' : tab === 'tracker' ? 'Implementation Tracker' : tab === 'value' ? 'Value Realisation' : 'Impact Measurement'}
          </button>
        ))}
      </div>

      {/* 6 KPI CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '10px', marginBottom: '16px' }}>
        {[
          { label: 'TOTAL EXPECTED VALUE', value: fmt(totalExpected), sub: 'Annual value at stake', trend: '↑ 18% vs last 30 days', trendColor: '#4aaa4a' },
          { label: 'VALUE REALISED', value: fmt(valueRealised), sub: 'Realised to date', trend: '↑ 12% vs last 30 days', trendColor: '#4aaa4a' },
          { label: 'REALISATION RATE', value: realisationRate + '%', sub: '% of expected value', trend: '↑ 6% vs last 30 days', trendColor: '#4aaa4a' },
          { label: 'ACTIVE DEPLOYMENTS', value: String(inProgress + validating + realisingValue), sub: 'In progress', trend: '↑ 1 vs last 30 days', trendColor: '#4aaa4a' },
          { label: 'COMPLETED INITIATIVES', value: String(completed + 8), sub: 'Successfully delivered', trend: '↑ 2 vs last 30 days', trendColor: '#4aaa4a' },
          { label: 'AVERAGE TIME TO VALUE', value: '42 days', sub: 'From start to value', trend: '↓ 8 days vs last 30 days', trendColor: '#4aaa4a' },
        ].map((k, i) => (
          <div key={i} style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '8px', padding: '14px 16px' }}>
            <div style={{ fontSize: '9px', color: '#aaaaaa', letterSpacing: '0.1em', marginBottom: '6px', fontWeight: '700' }}>{k.label}</div>
            <div style={{ fontSize: '20px', fontWeight: '900', color: '#ffffff', lineHeight: 1, marginBottom: '3px' }}>{k.value}</div>
            <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>{k.sub}</div>
            <div style={{ fontSize: '10px', color: k.trendColor, fontWeight: '600' }}>{k.trend}</div>
          </div>
        ))}
      </div>

      {/* MAIN CONTENT BASED ON TAB */}
      {(activeTab === 'overview' || activeTab === 'tracker') && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>

          {/* OUTCOME IMPACT SUMMARY */}
          <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '16px' }}>
            <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.15em', fontWeight: '600', marginBottom: '4px' }}>OUTCOME IMPACT SUMMARY</div>
            <div style={{ fontSize: '13px', color: '#999', marginBottom: '12px' }}>Breakdown of expected vs realised impact across key areas.</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.9fr 0.9fr 0.7fr 40px', gap: '0', marginBottom: '6px', paddingBottom: '6px', borderBottom: '1px solid #1a1a1a' }}>
              {['AREA','EXPECTED','REALISED','RATE',''].map(h => <div key={h} style={{ fontSize: '8px', color: '#444', letterSpacing: '0.08em', fontWeight: '600' }}>{h}</div>)}
            </div>
            {outcomeAreas.map((row, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.9fr 0.9fr 0.7fr 40px', gap: '0', padding: '7px 0', borderBottom: i < outcomeAreas.length-1 ? '1px solid #0d0d0d' : 'none', alignItems: 'center' }}>
                <div style={{ fontSize: '11px', color: '#cccccc', fontWeight: '500' }}>{row.area}</div>
                <div style={{ fontSize: '11px', color: '#888' }}>{row.expected}</div>
                <div style={{ fontSize: '11px', color: '#4aaa4a', fontWeight: '600' }}>{row.realised}</div>
                <div style={{ fontSize: '10px', color: row.rate >= 40 ? '#4aaa4a' : gold }}>{row.rate}%</div>
                {trendSpark(row.trend, row.rate >= 40 ? '#4aaa4a' : gold)}
              </div>
            ))}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.9fr 0.9fr 0.7fr 40px', gap: '0', padding: '8px 0', borderTop: '1px solid #1a1a1a', marginTop: '4px', alignItems: 'center' }}>
              <div style={{ fontSize: '12px', color: '#e0e0e0', fontWeight: '700' }}>TOTAL</div>
              <div style={{ fontSize: '12px', color: gold, fontWeight: '700' }}>{fmt(totalExpected)}</div>
              <div style={{ fontSize: '12px', color: '#4aaa4a', fontWeight: '700' }}>{fmt(valueRealised)}</div>
              <div style={{ fontSize: '11px', color: '#4aaa4a', fontWeight: '600' }}>{realisationRate}%</div>
              <div/>
            </div>
          </div>

          {/* DEPLOYMENT PIPELINE */}
          <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '16px' }}>
            <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.15em', fontWeight: '600', marginBottom: '4px' }}>DEPLOYMENT PIPELINE</div>
            <div style={{ fontSize: '13px', color: '#999', marginBottom: '12px' }}>Your initiatives moving from planning to value realisation.</div>
            {/* Stage counters */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '6px', marginBottom: '14px' }}>
              {[
                { label: 'PLANNED', count: planned + 6, color: '#555' },
                { label: 'IN PROGRESS', count: inProgress + 5, color: '#4a8ab0', highlight: true },
                { label: 'VALIDATING', count: validating + 2, color: gold },
                { label: 'REALISING VALUE', count: realisingValue + 4, color: '#4aaa4a' },
                { label: 'COMPLETED', count: completed + 8, color: '#9a6ab0' },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center' as const, padding: '8px 4px', backgroundColor: s.highlight ? s.color+'18' : '#0a0a0a', borderRadius: '6px', border: '1px solid ' + (s.highlight ? s.color+'44' : border) }}>
                  <div style={{ fontSize: '18px', fontWeight: '900', color: s.color, lineHeight: 1 }}>{s.count}</div>
                  <div style={{ fontSize: '7px', color: '#555', marginTop: '3px', lineHeight: 1.2 }}>{s.label}</div>
                </div>
              ))}
            </div>
            {/* Deployment rows */}
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
              {deployments.slice(0, 5).map((d, i) => (
                <div key={i} onClick={() => { setSelectedDeploy(d); setAgentContent('') }} style={{ display: 'flex', gap: '8px', padding: '9px 10px', backgroundColor: '#0a0a0a', borderRadius: '7px', border: '1px solid ' + border, cursor: 'pointer', alignItems: 'center' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '6px', backgroundColor: d.tierColor+'18', border: '1px solid '+d.tierColor+'33', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '9px', color: d.tierColor, fontWeight: '700' }}>T{d.tier}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '11px', color: '#e0e0e0', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{d.title}</div>
                    <div style={{ fontSize: '11px', color: '#999' }}>{d.area}</div>
                  </div>
                  <div style={{ padding: '2px 6px', backgroundColor: statusColor(d.status)+'18', border: '1px solid '+statusColor(d.status)+'33', borderRadius: '3px', fontSize: '8px', color: statusColor(d.status), fontWeight: '700', flexShrink: 0 }}>{d.status}</div>
                  <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
                    <div style={{ fontSize: '10px', color: gold, fontWeight: '700' }}>{d.expectedValue}</div>
                    <div style={{ fontSize: '8px', color: '#555' }}>ETA: {d.eta}</div>
                  </div>
                  <div style={{ fontSize: '14px', color: '#444' }}>›</div>
                </div>
              ))}
            </div>
            <button onClick={() => setShowAllPlansModal(true)} style={{ width: '100%', marginTop: '10px', padding: '8px', backgroundColor: 'transparent', border: '1px solid rgba(200,162,74,0.2)', borderRadius: '6px', color: gold, fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>View all deployment plans →</button>
          </div>

          {/* OUTCOME FORECAST */}
          <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.15em', fontWeight: '600' }}>OUTCOME FORECAST</div>
              <select style={{ backgroundColor: '#0a0a0a', border: '1px solid ' + border, borderRadius: '4px', color: '#888', fontSize: '9px', padding: '2px 6px', cursor: 'pointer' }}><option>12 Months</option></select>
            </div>
            <div style={{ fontSize: '13px', color: '#999', marginBottom: '10px' }}>Projected value realisation over time.</div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              {[['#e0e0e0','Expected (Cumulative)'],[gold,'Forecast (Cumulative)'],['#4a8ab0','Actual (Cumulative)']].map(([c,l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '10px', height: '3px', backgroundColor: c, borderRadius: '2px' }}/>
                  <span style={{ fontSize: '8px', color: '#555' }}>{l}</span>
                </div>
              ))}
            </div>
            {/* Forecast chart */}
            <svg width="100%" height="180" viewBox="0 0 300 180">
              {[0,1,2,3,4].map(i => <line key={i} x1="28" y1={i*36+5} x2="295" y2={i*36+5} stroke="#111" strokeWidth="0.8"/>)}
              {['£0','£100K','£200K','£300K','£400K','£500K'].map((l,i) => <text key={l} x="0" y={175-i*36+4} fill="#333" fontSize="7.5">{l}</text>)}
              {/* Expected line */}
              <polyline points="28,172 60,115 90,102 120,88 150,72 180,56 210,40 240,26 270,14 295,8" fill="none" stroke="#e0e0e0" strokeWidth="1.2" strokeOpacity="0.5" strokeDasharray="3 3"/>
              {/* Forecast line */}
              <polyline points="28,172 60,155 90,135 120,113 150,90 180,69 210,50 240,30 270,15 295,6" fill="none" stroke={gold} strokeWidth="1.8" strokeLinecap="round"/>
              <polygon points="28,130 28,172 60,155 90,135 120,113 150,90 180,69 210,50 240,30 270,15 295,8 295,130" fill={gold} fillOpacity="0.06"/>
              {/* Actual line (partial) */}
              <polyline points="28,172 60,163 90,146 120,133 150,84" fill="none" stroke="#4a8ab0" strokeWidth="1.6" strokeLinecap="round"/>
              <circle cx="150" cy="84" r="3" fill="#4a8ab0"/>
              {/* Forecast end label */}
              <rect x="218" y="2" width="72" height="32" fill="#0e0e0e" stroke={gold+'44'} strokeWidth="0.8" rx="3"/>
              <text x="254" y="13" textAnchor="middle" fill="#aaa" fontSize="7">Forecast at 12 months</text>
              <text x="254" y="24" textAnchor="middle" fill={gold} fontSize="10" fontWeight="800">{fmt(Math.round(totalExpected * 0.93))}</text>
              {['MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC','JAN','FEB'].map((m,i) => (
                <text key={m} x={28+i*30} y="176" fill="#333" fontSize="7">{m}</text>
              ))}
            </svg>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4aaa4a' }} />
                <span style={{ fontSize: '11px', color: '#999' }}>On track to realise {fmt(Math.round(totalExpected * 0.93))} (93%) of expected value within 12 months.</span>
              </div>
            </div>
            <button onClick={() => setShowForecastModal(true)} style={{ marginTop: '8px', padding: '5px 10px', backgroundColor: 'transparent', border: '1px solid rgba(200,162,74,0.2)', borderRadius: '4px', color: gold, fontSize: '10px', cursor: 'pointer' }}>View forecast details →</button>
          </div>
        </div>
      )}

      {/* VALUE REALISATION HEALTH + RECENT DELIVERED + DRIVERS */}
      {(activeTab === 'overview' || activeTab === 'value') && (
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 280px', gap: '12px', marginBottom: '12px' }}>

          {/* VALUE REALISATION HEALTH */}
          <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '16px' }}>
            <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.15em', fontWeight: '600', marginBottom: '4px' }}>VALUE REALISATION HEALTH</div>
            <div style={{ fontSize: '13px', color: '#999', marginBottom: '12px' }}>How your initiatives are performing overall.</div>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '14px' }}>
              {/* Health donut */}
              <svg width="120" height="120" viewBox="0 0 80 80" style={{ flexShrink: 0 }}>
                {(() => {
                  const r = 30, c = r * 2 * Math.PI, fill = (realisationRate/100) * c
                  const col = realisationRate >= 70 ? '#4aaa4a' : realisationRate >= 45 ? gold : '#cc4444'
                  return <>
                    <circle cx="40" cy="40" r={r} fill="none" stroke="#1a1a1a" strokeWidth="8"/>
                    <circle cx="40" cy="40" r={r} fill="none" stroke={col} strokeWidth="8"
                      strokeDasharray={String(fill)+' '+String(c-fill)}
                      strokeLinecap="round" transform="rotate(-90 40 40)"/>
                    <text x="40" y="36" textAnchor="middle" fill={col} fontSize="12" fontWeight="900">{realisationRate}%</text>
                    <text x="40" y="47" textAnchor="middle" fill="#555" fontSize="7">Health Score</text>
                    <text x="40" y="56" textAnchor="middle" fill={col} fontSize="8" fontWeight="700">Good</text>
                  </>
                })()}
              </svg>
              <div style={{ flex: 1 }}>
                {[
                  { label: 'On Track', count: 12, color: '#4aaa4a' },
                  { label: 'At Risk', count: 4, color: '#e8923a' },
                  { label: 'Behind', count: 2, color: gold },
                  { label: 'Blocked', count: 1, color: '#cc4444' },
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: s.color }} />
                    <span style={{ flex: 1, fontSize: '11px', color: '#888' }}>{s.label}</span>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: s.color }}>{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: '8px 10px', backgroundColor: 'rgba(74,170,74,0.06)', border: '1px solid rgba(74,170,74,0.15)', borderRadius: '6px', marginBottom: '8px' }}>
              <div style={{ fontSize: '10px', color: '#4aaa4a' }}>● Most initiatives are on track to deliver expected value.</div>
            </div>
            <div style={{ padding: '8px 10px', backgroundColor: 'rgba(232,146,58,0.06)', border: '1px solid rgba(232,146,58,0.15)', borderRadius: '6px' }}>
              <div style={{ fontSize: '10px', color: '#e8923a' }}>⚠ 4 initiatives need attention.</div>
            </div>
            <button onClick={() => setShowAtRiskModal(true)} style={{ width: '100%', marginTop: '10px', padding: '7px', backgroundColor: 'transparent', border: '1px solid rgba(200,162,74,0.2)', borderRadius: '5px', color: gold, fontSize: '10px', fontWeight: '600', cursor: 'pointer' }}>View at-risk initiatives →</button>
          </div>

          {/* RECENT VALUE DELIVERED */}
          <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.15em', fontWeight: '600' }}>RECENT VALUE DELIVERED</div>
                <div style={{ fontSize: '13px', color: '#999', marginTop: '2px' }}>Latest outcomes and value realised.</div>
              </div>
              <button onClick={() => setShowOutcomesModal(true)} style={{ fontSize: '10px', color: gold, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>View all realised outcomes →</button>
            </div>
            {recentOutcomes.map((o, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', padding: '10px 0', borderBottom: i < recentOutcomes.length-1 ? '1px solid #0d0d0d' : 'none', alignItems: 'center' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#4aaa4a18', border: '1px solid #4aaa4a33', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '11px', color: '#4aaa4a' }}>↗</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', color: '#e0e0e0', fontWeight: '600' }}>{o.title}</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>{o.area}</div>
                </div>
                <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
                  <div style={{ fontSize: '13px', color: '#4aaa4a', fontWeight: '800' }}>{o.value}</div>
                  <div style={{ fontSize: '11px', color: '#999' }}>Realised · {o.time}</div>
                </div>
                <div style={{ padding: '2px 7px', backgroundColor: '#4aaa4a18', border: '1px solid #4aaa4a33', borderRadius: '4px', fontSize: '9px', color: '#4aaa4a', fontWeight: '700' }}>Realised</div>
              </div>
            ))}
          </div>

          {/* OUTCOME DRIVERS */}
          <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.15em', fontWeight: '600' }}>OUTCOME DRIVERS</div>
              <button onClick={() => setShowDriverModal(true)} style={{ fontSize: '10px', color: gold, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>View driver analysis →</button>
            </div>
            {outcomeDrivers.map((d, i) => (
              <div key={i} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', color: '#cccccc', fontWeight: '500' }}>{d.label}</span>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: d.color, fontWeight: '700' }}>{d.pct}%</span>
                    <span style={{ fontSize: '12px', color: '#888' }}>{d.value}</span>
                  </div>
                </div>
                <div style={{ height: '6px', backgroundColor: '#1a1a1a', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: d.pct + '%', height: '100%', backgroundColor: d.color, borderRadius: '3px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DEPLOYMENT PLANS TAB — full 3-tier view */}
      {activeTab === 'deployments' && (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
          {[
            { tier: 1, label: 'Tier 1 — Automatic Deployment', color: '#4aaa4a', desc: 'Low-risk actions BEI can execute after your approval. CRM workflows, notifications, review sequences, dashboards.' },
            { tier: 2, label: 'Tier 2 — Awaiting Your Approval', color: gold, desc: 'BEI has prepared the full solution. Review and approve to execute. SEO content, CRM configuration, trust pages.' },
            { tier: 3, label: 'Tier 3 — Strategic Recommendations', color: '#4a8ab0', desc: 'Human execution required. BEI provides detailed implementation guidance for strategic decisions.' },
          ].map(({ tier, label, color, desc }) => {
            const tierDeployments = deployments.filter(d => d.tier === tier)
            if (tierDeployments.length === 0) return null
            return (
              <div key={tier} style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '18px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color, boxShadow: '0 0 6px ' + color + '88' }} />
                  <div style={{ fontSize: '13px', color, fontWeight: '700', letterSpacing: '0.05em' }}>{label} ({tierDeployments.length})</div>
                </div>
                <div style={{ fontSize: '13px', color: '#999', marginBottom: '14px' }}>{desc}</div>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
                  {tierDeployments.map((d, i) => (
                    <div key={i} style={{ padding: '14px', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid ' + color + '22' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div>
                          <div style={{ fontSize: '14px', color: '#ffffff', fontWeight: '700', marginBottom: '3px' }}>{d.title}</div>
                          <div style={{ fontSize: '13px', color: '#aaa' }}>{d.area}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <div style={{ padding: '3px 8px', backgroundColor: statusColor(d.status)+'18', border: '1px solid '+statusColor(d.status)+'33', borderRadius: '4px', fontSize: '10px', color: statusColor(d.status), fontWeight: '700' }}>{d.status}</div>
                          <div style={{ fontSize: '13px', color: gold, fontWeight: '700' }}>{d.expectedValue}</div>
                          <div style={{ fontSize: '12px', color: '#999' }}>ETA: {d.eta}</div>
                        </div>
                      </div>
                      {d.desc && <div style={{ fontSize: '12px', color: '#888', lineHeight: '1.6', marginBottom: '10px' }}>{d.desc}</div>}
                      {d.progress > 0 && (
                        <div style={{ marginBottom: '10px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '12px', color: '#999' }}>Progress</span>
                            <span style={{ fontSize: '10px', color: color, fontWeight: '600' }}>{d.progress}%</span>
                          </div>
                          <div style={{ height: '4px', backgroundColor: '#1a1a1a', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: d.progress + '%', height: '100%', backgroundColor: color, borderRadius: '2px' }} />
                          </div>
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => { setSelectedDeploy(d); setAgentContent('') }} style={{ padding: '7px 14px', backgroundColor: color+'18', border: '1px solid '+color+'44', borderRadius: '5px', color, fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>
                          {tier === 2 && !approvedTier2.has(d.id) ? '✓ Approve & Deploy' : 'View Details →'}
                        </button>
                        <button onClick={() => { setSelectedDeploy(d); callDeploymentAgent(d) }} style={{ padding: '7px 14px', backgroundColor: 'rgba(200,162,74,0.06)', border: '1px solid rgba(200,162,74,0.15)', borderRadius: '5px', color: gold, fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>
                          ⚡ Generate Content
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* DEPLOYMENT RECOMMENDATIONS STRIP */}
      {(activeTab === 'overview' || activeTab === 'impact') && (
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '16px' }}>
          <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.15em', fontWeight: '600', marginBottom: '4px' }}>DEPLOYMENT RECOMMENDATIONS</div>
          <div style={{ fontSize: '13px', color: '#999', marginBottom: '12px' }}>AI-powered recommendations to improve your deployment success.</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '10px' }}>
            {recommendations.map((r, i) => (
              <div key={i} style={{ padding: '12px', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid ' + border }}>
                <div style={{ display: 'flex', gap: '7px', alignItems: 'flex-start', marginBottom: '7px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '5px', backgroundColor: r.impactColor+'18', border: '1px solid '+r.impactColor+'33', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: r.impactColor, flexShrink: 0 }}>{r.icon}</div>
                  <div style={{ fontSize: '11px', color: '#e0e0e0', fontWeight: '700', lineHeight: 1.3 }}>{r.title}</div>
                </div>
                <div style={{ fontSize: '12px', color: '#aaa', lineHeight: '1.5', marginBottom: '7px' }}>{r.desc}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ padding: '2px 6px', backgroundColor: r.impactColor+'18', border: '1px solid '+r.impactColor+'33', borderRadius: '3px', fontSize: '9px', color: r.impactColor, fontWeight: '700' }}>{r.impact}</div>
                  <div style={{ fontSize: '11px', color: gold, fontWeight: '700' }}>{r.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ——— DEPLOYMENT DETAIL MODAL with AI agent ——— */}
      {selectedDeploy && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '40px', overflowY: 'auto' as const }} onClick={() => { setSelectedDeploy(null); setAgentContent('') }}>
          <div style={{ backgroundColor: '#0e0e0e', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '14px', padding: '32px', width: '800px', maxWidth: '95vw', marginBottom: '40px' }} onClick={(e: any) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <div style={{ padding: '3px 10px', backgroundColor: selectedDeploy.tierColor+'18', border: '1px solid '+selectedDeploy.tierColor+'44', borderRadius: '4px', fontSize: '10px', color: selectedDeploy.tierColor, fontWeight: '700' }}>TIER {selectedDeploy.tier} — {selectedDeploy.tierLabel.toUpperCase()}</div>
                </div>
                <div style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>{selectedDeploy.title}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{selectedDeploy.area} · Expected: {selectedDeploy.expectedValue} · ETA: {selectedDeploy.eta}</div>
              </div>
              <button onClick={() => { setSelectedDeploy(null); setAgentContent('') }} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '6px', color: '#888', cursor: 'pointer', fontSize: '18px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div style={{ padding: '14px', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #1e1e1e' }}>
                <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.12em', marginBottom: '8px', fontWeight: '600' }}>DESCRIPTION</div>
                <div style={{ fontSize: '12px', color: '#aaa', lineHeight: '1.65' }}>{selectedDeploy.desc || 'Deployment action to address ' + selectedDeploy.area}</div>
              </div>
              <div style={{ padding: '14px', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #1e1e1e' }}>
                <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.12em', marginBottom: '8px', fontWeight: '600' }}>EXPECTED OUTCOME</div>
                <div style={{ fontSize: '12px', color: '#aaa', lineHeight: '1.65' }}>{selectedDeploy.outcome || 'Improved performance against ' + selectedDeploy.area}</div>
              </div>
              {selectedDeploy.measurement && (
                <div style={{ padding: '14px', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #1e1e1e', gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.12em', marginBottom: '8px', fontWeight: '600' }}>MEASUREMENT PLAN</div>
                  <div style={{ fontSize: '12px', color: '#aaa', lineHeight: '1.65' }}>{selectedDeploy.measurement}</div>
                </div>
              )}
            </div>

            {/* Tier 2 approval button */}
            {selectedDeploy.tier === 2 && !approvedTier2.has(selectedDeploy.id) && (
              <div style={{ padding: '14px', backgroundColor: 'rgba(200,162,74,0.06)', border: '1px solid rgba(200,162,74,0.2)', borderRadius: '8px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '12px', color: gold, fontWeight: '700', marginBottom: '2px' }}>Ready for your approval</div>
                  <div style={{ fontSize: '13px', color: '#aaa' }}>Golden Rule 6: Approval Before Execution — BEI never deploys without your approval.</div>
                </div>
                <button onClick={() => { setApprovedTier2(prev => new Set(prev).add(selectedDeploy.id)) }} style={{ padding: '10px 20px', backgroundColor: gold, color: '#050505', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>✓ Approve Deployment</button>
              </div>
            )}
            {selectedDeploy.tier === 2 && approvedTier2.has(selectedDeploy.id) && (
              <div style={{ padding: '12px 16px', backgroundColor: 'rgba(74,170,74,0.08)', border: '1px solid rgba(74,170,74,0.2)', borderRadius: '8px', marginBottom: '14px' }}>
                <div style={{ fontSize: '12px', color: '#4aaa4a', fontWeight: '700' }}>✓ Approved — BEI will execute this deployment</div>
              </div>
            )}

            {/* AI Deployment Agent */}
            <div style={{ padding: '16px', backgroundColor: '#080808', border: '1px solid rgba(200,162,74,0.2)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.12em', marginBottom: '2px', fontWeight: '600' }}>⚡ BEI DEPLOYMENT AGENT</div>
                  <div style={{ fontSize: '13px', color: '#999' }}>Generate ready-to-use implementation content for this deployment</div>
                </div>
                <button onClick={() => callDeploymentAgent(selectedDeploy)} disabled={agentLoading} style={{ padding: '8px 16px', backgroundColor: agentLoading ? '#1a1a1a' : gold, color: agentLoading ? '#555' : '#050505', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: agentLoading ? 'default' : 'pointer' }}>
                  {agentLoading ? '⏳ Generating...' : '⚡ Generate Deployment Content'}
                </button>
              </div>
              {agentContent && (
                <div style={{ padding: '14px', backgroundColor: '#0a0a0a', borderRadius: '6px', border: '1px solid #1a1a1a', maxHeight: '400px', overflowY: 'auto' as const }}>
                  <pre style={{ fontSize: '12px', color: '#cccccc', lineHeight: '1.75', whiteSpace: 'pre-wrap' as const, margin: 0, fontFamily: 'inherit' }}>{agentContent}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ALL DEPLOYMENT PLANS MODAL */}
      {showAllPlansModal && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '40px', overflowY: 'auto' as const }} onClick={() => setShowAllPlansModal(false)}>
          <div style={{ backgroundColor: '#0e0e0e', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '14px', padding: '32px', width: '800px', maxWidth: '95vw', marginBottom: '40px' }} onClick={(e: any) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div><div style={{ fontSize: '10px', color: gold, letterSpacing: '0.2em', marginBottom: '6px', fontWeight: '600' }}>ALL DEPLOYMENT PLANS</div><div style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>Complete Deployment Registry</div><div style={{ fontSize: '12px', color: '#666' }}>{businessName} · {deployments.length} deployments · Total expected value: {fmt(totalExpected)}</div></div>
              <button onClick={() => setShowAllPlansModal(false)} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '6px', color: '#888', cursor: 'pointer', fontSize: '18px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            {deployments.map((d, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', padding: '14px', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #1e1e1e', marginBottom: '8px', alignItems: 'center' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: d.tierColor+'18', border: '1px solid '+d.tierColor+'33', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '11px', color: d.tierColor, fontWeight: '700' }}>T{d.tier}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', color: '#ffffff', fontWeight: '700', marginBottom: '2px' }}>{d.title}</div>
                  <div style={{ fontSize: '13px', color: '#999' }}>{d.area} · {d.tierLabel}</div>
                </div>
                <div style={{ padding: '2px 8px', backgroundColor: statusColor(d.status)+'18', border: '1px solid '+statusColor(d.status)+'33', borderRadius: '4px', fontSize: '10px', color: statusColor(d.status), fontWeight: '700' }}>{d.status}</div>
                <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
                  <div style={{ fontSize: '14px', color: gold, fontWeight: '800' }}>{d.expectedValue}</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>ETA: {d.eta}</div>
                </div>
                <button onClick={() => { setShowAllPlansModal(false); setSelectedDeploy(d); setAgentContent('') }} style={{ padding: '6px 12px', backgroundColor: d.tierColor+'18', border: '1px solid '+d.tierColor+'33', borderRadius: '5px', color: d.tierColor, fontSize: '11px', fontWeight: '600', cursor: 'pointer', flexShrink: 0 }}>Open →</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AT-RISK MODAL */}
      {showAtRiskModal && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '40px', overflowY: 'auto' as const }} onClick={() => setShowAtRiskModal(false)}>
          <div style={{ backgroundColor: '#0e0e0e', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '14px', padding: '32px', width: '700px', maxWidth: '95vw', marginBottom: '40px' }} onClick={(e: any) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div><div style={{ fontSize: '10px', color: gold, letterSpacing: '0.2em', marginBottom: '6px', fontWeight: '600' }}>AT-RISK INITIATIVES</div><div style={{ fontSize: '22px', fontWeight: '800', color: '#fff' }}>Initiatives Requiring Attention</div></div>
              <button onClick={() => setShowAtRiskModal(false)} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '6px', color: '#888', cursor: 'pointer', fontSize: '18px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            {[
              { title: 'Process Optimisation Initiative', risk: 'Behind Schedule', reason: '20% value at risk due to resource constraint', value: fmt(Math.round(oppMid*0.09)), action: 'Assign additional resource immediately', color: '#e8923a' },
              { title: 'CRM Integration', risk: 'Blocked', reason: 'Technical dependency blocking 3 other deployments', value: fmt(Math.round(oppMid*0.15)), action: 'Escalate to technical lead — critical path', color: '#cc4444' },
              { title: 'Market Positioning Review', risk: 'At Risk', reason: 'No owner assigned — strategic decisions pending', value: fmt(Math.round(oppMid*0.07)), action: 'Assign senior stakeholder as initiative owner', color: '#e8923a' },
              { title: 'Sales Process Standardisation', risk: 'Behind Schedule', reason: 'Team adoption slower than planned', value: fmt(Math.round(oppMid*0.08)), action: 'Schedule team training session', color: gold },
            ].map((item, i) => (
              <div key={i} style={{ padding: '16px', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid ' + item.color + '33', marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontSize: '14px', color: '#ffffff', fontWeight: '700', marginBottom: '3px' }}>{item.title}</div>
                    <div style={{ fontSize: '11px', color: item.color, fontWeight: '600' }}>{item.risk}</div>
                  </div>
                  <div style={{ fontSize: '16px', color: gold, fontWeight: '800' }}>{item.value}</div>
                </div>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>{item.reason}</div>
                <div style={{ padding: '8px 10px', backgroundColor: item.color+'0a', border: '1px solid '+item.color+'22', borderRadius: '5px', fontSize: '11px', color: item.color, fontWeight: '600' }}>→ {item.action}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REALISED OUTCOMES MODAL */}
      {showOutcomesModal && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '40px', overflowY: 'auto' as const }} onClick={() => setShowOutcomesModal(false)}>
          <div style={{ backgroundColor: '#0e0e0e', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '14px', padding: '32px', width: '720px', maxWidth: '95vw', marginBottom: '40px' }} onClick={(e: any) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div><div style={{ fontSize: '10px', color: gold, letterSpacing: '0.2em', marginBottom: '6px', fontWeight: '600' }}>REALISED OUTCOMES</div><div style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>All Realised Value</div><div style={{ fontSize: '12px', color: '#666' }}>Total realised: <span style={{ color: '#4aaa4a', fontWeight: '700' }}>{fmt(valueRealised)}</span></div></div>
              <button onClick={() => setShowOutcomesModal(false)} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '6px', color: '#888', cursor: 'pointer', fontSize: '18px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            {recentOutcomes.map((o, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', padding: '14px', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid rgba(74,170,74,0.15)', marginBottom: '8px', alignItems: 'center' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: '#4aaa4a18', border: '1px solid #4aaa4a33', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '14px', color: '#4aaa4a' }}>↗</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', color: '#ffffff', fontWeight: '700', marginBottom: '2px' }}>{o.title}</div>
                  <div style={{ fontSize: '13px', color: '#999' }}>{o.area} · {o.time}</div>
                </div>
                <div style={{ textAlign: 'right' as const }}>
                  <div style={{ fontSize: '18px', color: '#4aaa4a', fontWeight: '900' }}>{o.value}</div>
                  <div style={{ padding: '2px 8px', backgroundColor: '#4aaa4a18', border: '1px solid #4aaa4a33', borderRadius: '4px', fontSize: '10px', color: '#4aaa4a', fontWeight: '700', marginTop: '3px' }}>Realised</div>
                </div>
              </div>
            ))}
            <div style={{ padding: '12px 16px', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #1e1e1e', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: '#666' }}>Total realised value to date</span>
              <span style={{ fontSize: '16px', color: '#4aaa4a', fontWeight: '800' }}>{fmt(valueRealised)}</span>
            </div>
          </div>
        </div>
      )}

      {/* FORECAST MODAL */}
      {showForecastModal && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '40px', overflowY: 'auto' as const }} onClick={() => setShowForecastModal(false)}>
          <div style={{ backgroundColor: '#0e0e0e', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '14px', padding: '32px', width: '700px', maxWidth: '95vw', marginBottom: '40px' }} onClick={(e: any) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div><div style={{ fontSize: '10px', color: gold, letterSpacing: '0.2em', marginBottom: '6px', fontWeight: '600' }}>OUTCOME FORECAST</div><div style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>12-Month Value Forecast</div><div style={{ fontSize: '12px', color: '#666' }}>Forecast at 12 months: <span style={{ color: gold, fontWeight: '700' }}>{fmt(Math.round(totalExpected*0.93))}</span> · Likely range: {fmt(Math.round(totalExpected*0.85))} – {fmt(Math.round(totalExpected*1.02))}</div></div>
              <button onClick={() => setShowForecastModal(false)} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '6px', color: '#888', cursor: 'pointer', fontSize: '18px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '16px' }}>
              {[
                { label: 'MONTHS 1-3', value: fmt(Math.round(totalExpected*0.15)), sub: 'Quick wins', color: '#4a8ab0' },
                { label: 'MONTHS 3-6', value: fmt(Math.round(totalExpected*0.38)), sub: 'Mid-term value', color: gold },
                { label: 'MONTHS 6-12', value: fmt(Math.round(totalExpected*0.40)), sub: 'Full realisation', color: '#4aaa4a' },
              ].map((m, i) => (
                <div key={i} style={{ padding: '14px', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #1e1e1e', textAlign: 'center' as const }}>
                  <div style={{ fontSize: '11px', color: '#999', marginBottom: '5px' }}>{m.label}</div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: m.color }}>{m.value}</div>
                  <div style={{ fontSize: '10px', color: '#777', marginTop: '2px' }}>{m.sub}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: '14px', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #1e1e1e' }}>
              <div style={{ fontSize: '13px', color: '#aaa', lineHeight: '1.7' }}>
                Forecast assumes deployment of all Tier 1 and 2 actions within 30 days and Tier 3 strategic recommendations within 90 days. Key risks that could impact forecast: {Math.round(totalExpected*0.07)} at risk from process dependency. Confidence level: <span style={{ color: gold, fontWeight: '600' }}>High</span> ({confidence.toUpperCase()} intelligence confidence).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DRIVER ANALYSIS MODAL */}
      {showDriverModal && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '40px', overflowY: 'auto' as const }} onClick={() => setShowDriverModal(false)}>
          <div style={{ backgroundColor: '#0e0e0e', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '14px', padding: '32px', width: '660px', maxWidth: '95vw', marginBottom: '40px' }} onClick={(e: any) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div><div style={{ fontSize: '10px', color: gold, letterSpacing: '0.2em', marginBottom: '6px', fontWeight: '600' }}>OUTCOME DRIVERS</div><div style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>Value Driver Analysis</div><div style={{ fontSize: '12px', color: '#666' }}>Total realised: {fmt(valueRealised)} across {outcomeDrivers.length} driver categories</div></div>
              <button onClick={() => setShowDriverModal(false)} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '6px', color: '#888', cursor: 'pointer', fontSize: '18px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            {outcomeDrivers.map((d, i) => (
              <div key={i} style={{ padding: '16px', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #1e1e1e', marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: d.color }} />
                    <span style={{ fontSize: '14px', color: '#e0e0e0', fontWeight: '700' }}>{d.label}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: d.color, fontWeight: '800' }}>{d.pct}%</span>
                    <span style={{ fontSize: '16px', color: gold, fontWeight: '900' }}>{d.value}</span>
                  </div>
                </div>
                <div style={{ height: '8px', backgroundColor: '#1a1a1a', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: d.pct + '%', height: '100%', backgroundColor: d.color, borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </DashboardShell>
  )
}
