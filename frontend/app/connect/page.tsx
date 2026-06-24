'use client'
import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase'
import DashboardShell from '../components/DashboardShell'

const supabase = createClient()
const gold = '#C8A24A'
const card = '#0e0e0e'
const border = '#1e1e1e'

// Each connector contributes a % to Twin completeness
// Manual MRI data = 40% base (always present after MRI)
// Each connector adds its boost
const CONNECTOR_WEIGHTS: Record<string, number> = {
  hubspot: 10, salesforce: 10, manual_crm: 6,
  xero: 12, quickbooks: 12, manual_finance: 7,
  hibob: 8, workday: 8, manual_hr: 5,
  google_analytics: 7, manual_analytics: 4,
  manual_strategy: 6, manual_market: 5,
}
const MRI_BASE = 40 // always present after MRI

const CONNECTOR_GROUPS = [
  { group: 'CRM & Sales', twin_impact: 'Sales, Operations', icon: '◈',
    connectors: [
      { id: 'hubspot', name: 'HubSpot', boost: 10, auth: 'oauth',
        fields: [{ key: 'client_id', label: 'Client ID' }, { key: 'client_secret', label: 'Client Secret', secret: true }] },
      { id: 'salesforce', name: 'Salesforce', boost: 10, auth: 'oauth',
        fields: [{ key: 'client_id', label: 'Consumer Key' }, { key: 'client_secret', label: 'Consumer Secret', secret: true }] },
      { id: 'manual_crm', name: 'Manual CRM Data', boost: 6, auth: 'manual',
        fields: [
          { key: 'total_leads', label: 'Total Leads (last 90 days)', inputType: 'number' },
          { key: 'converted_leads', label: 'Converted to Clients', inputType: 'number' },
          { key: 'avg_response_time_hours', label: 'Avg Response Time (hours)', inputType: 'number' },
          { key: 'avg_deal_value', label: 'Average Deal Value (£)', inputType: 'number' },
        ] },
    ]},
  { group: 'Finance', twin_impact: 'Growth, Risk', icon: '£',
    connectors: [
      { id: 'xero', name: 'Xero', boost: 12, auth: 'oauth',
        fields: [{ key: 'client_id', label: 'Client ID' }, { key: 'client_secret', label: 'Client Secret', secret: true }] },
      { id: 'quickbooks', name: 'QuickBooks', boost: 12, auth: 'oauth',
        fields: [{ key: 'client_id', label: 'Client ID' }, { key: 'client_secret', label: 'Client Secret', secret: true }] },
      { id: 'manual_finance', name: 'Manual Finance Data', boost: 7, auth: 'manual',
        fields: [
          { key: 'monthly_revenue', label: 'Monthly Revenue (£)', inputType: 'number' },
          { key: 'revenue_last_12m', label: 'Revenue Last 12 Months (£)', inputType: 'number' },
          { key: 'gross_margin_pct', label: 'Gross Margin %', inputType: 'number' },
          { key: 'monthly_costs', label: 'Monthly Costs (£)', inputType: 'number' },
        ] },
    ]},
  { group: 'Growth Pillar', twin_impact: 'Growth', icon: '▲',
    connectors: [
      { id: 'growth_revenue', name: 'Revenue & Pipeline Intelligence', boost: 8, auth: 'manual',
        fields: [
          { key: 'annual_revenue', label: 'Annual Revenue (£)', inputType: 'number', placeholder: '500000' },
          { key: 'revenue_growth_rate', label: 'Revenue Growth Rate Last 12 Months (%)', inputType: 'number', placeholder: '15' },
          { key: 'average_client_value', label: 'Average Client / Project Value (£)', inputType: 'number', placeholder: '8000' },
          { key: 'number_of_active_clients', label: 'Number of Active Clients', inputType: 'number', placeholder: '25' },
          { key: 'pipeline_value', label: 'Current Sales Pipeline Value (£)', inputType: 'number', placeholder: '120000' },
          { key: 'lead_to_client_conversion', label: 'Lead to Client Conversion Rate (%)', inputType: 'number', placeholder: '22' },
          { key: 'average_sales_cycle_days', label: 'Average Sales Cycle Length (days)', inputType: 'number', placeholder: '30' },
          { key: 'new_clients_last_12m', label: 'New Clients Acquired Last 12 Months', inputType: 'number', placeholder: '18' },
        ] },
      { id: 'growth_pricing', name: 'Pricing & Margin Intelligence', boost: 6, auth: 'manual',
        fields: [
          { key: 'gross_margin_pct', label: 'Gross Margin (%)', inputType: 'number', placeholder: '62' },
          { key: 'net_profit_margin_pct', label: 'Net Profit Margin (%)', inputType: 'number', placeholder: '18' },
          { key: 'pricing_model', label: 'Primary Pricing Model (e.g. fixed fee, retainer, hourly, subscription)', placeholder: 'Monthly retainer' },
          { key: 'last_price_increase_months', label: 'Months Since Last Price Increase', inputType: 'number', placeholder: '18' },
          { key: 'price_vs_market', label: 'How does your pricing compare to competitors? (below / at / above market)', placeholder: 'At market' },
          { key: 'upsell_revenue_pct', label: 'Revenue from Upsells / Expansions (%)', inputType: 'number', placeholder: '15' },
        ] },
    ]},
  { group: 'Operations Pillar', twin_impact: 'Operations', icon: '⚙',
    connectors: [
      { id: 'operations_team', name: 'Team & Capacity Intelligence', boost: 7, auth: 'manual',
        fields: [
          { key: 'total_headcount', label: 'Total Headcount (full time equivalent)', inputType: 'number', placeholder: '12' },
          { key: 'billable_team_size', label: 'Billable / Delivery Team Size', inputType: 'number', placeholder: '8' },
          { key: 'avg_utilisation_pct', label: 'Average Team Utilisation (%)', inputType: 'number', placeholder: '72' },
          { key: 'max_capacity_clients', label: 'Maximum Client Capacity at Current Team Size', inputType: 'number', placeholder: '35' },
          { key: 'time_owner_in_delivery', label: 'Hours Per Week Owner Spends in Delivery (not management)', inputType: 'number', placeholder: '20' },
          { key: 'staff_turnover_12m', label: 'Staff Turnover Last 12 Months (%)', inputType: 'number', placeholder: '8' },
          { key: 'open_roles', label: 'Current Open / Unfilled Roles', inputType: 'number', placeholder: '2' },
        ] },
      { id: 'operations_processes', name: 'Process & Delivery Intelligence', boost: 6, auth: 'manual',
        fields: [
          { key: 'documented_processes', label: 'Are core delivery processes documented? (yes / partial / no)', placeholder: 'Partial' },
          { key: 'onboarding_time_days', label: 'Average New Client Onboarding Time (days)', inputType: 'number', placeholder: '7' },
          { key: 'project_on_time_pct', label: 'Projects / Work Delivered On Time (%)', inputType: 'number', placeholder: '80' },
          { key: 'repeat_errors_frequency', label: 'How often do the same operational errors recur? (rarely / monthly / weekly)', placeholder: 'Monthly' },
          { key: 'toolstack', label: 'Primary Tools Used (e.g. Asana, Monday, Notion, custom)', placeholder: 'Asana, Slack, Xero' },
          { key: 'automation_level', label: 'Proportion of Admin Tasks Automated (%)', inputType: 'number', placeholder: '30' },
        ] },
    ]},
  { group: 'Strategy Pillar', twin_impact: 'Strategy', icon: '◈',
    connectors: [
      { id: 'strategy_vision', name: 'Vision & Growth Strategy Intelligence', boost: 7, auth: 'manual',
        fields: [
          { key: 'revenue_target_12m', label: '12 Month Revenue Target (£)', inputType: 'number', placeholder: '750000' },
          { key: 'revenue_target_3yr', label: '3 Year Revenue Target (£)', inputType: 'number', placeholder: '2000000' },
          { key: 'primary_growth_strategy', label: 'Primary Growth Strategy (e.g. new clients, upsell, new markets, M&A)', placeholder: 'New client acquisition' },
          { key: 'strategic_blockers', label: 'Biggest Strategic Blocker Right Now', placeholder: 'Management capacity' },
          { key: 'competitive_advantage', label: 'Primary Competitive Advantage', placeholder: 'Speed and specialist expertise' },
          { key: 'planning_horizon', label: 'How far ahead does the business actively plan? (3m / 6m / 12m / 3yr)', placeholder: '12 months' },
          { key: 'decision_making_structure', label: 'Who makes major business decisions? (owner only / leadership team / board)', placeholder: 'Owner only' },
        ] },
    ]},
  { group: 'Risk Pillar', twin_impact: 'Risk', icon: '⚠',
    connectors: [
      { id: 'risk_concentration', name: 'Revenue Concentration & Dependency Risk', boost: 7, auth: 'manual',
        fields: [
          { key: 'top_client_revenue_pct', label: 'Revenue from Top 1 Client (%)', inputType: 'number', placeholder: '28' },
          { key: 'top_3_clients_revenue_pct', label: 'Revenue from Top 3 Clients Combined (%)', inputType: 'number', placeholder: '55' },
          { key: 'key_person_dependency', label: 'Business-Critical People (would severely impact delivery if they left)', inputType: 'number', placeholder: '2' },
          { key: 'owner_dependency_pct', label: 'Proportion of Revenue Dependent on Owner Personally (%)', inputType: 'number', placeholder: '70' },
          { key: 'contract_renewal_risk', label: 'Contracts Up for Renewal in Next 90 Days (%)', inputType: 'number', placeholder: '20' },
          { key: 'cash_runway_months', label: 'Current Cash Runway (months)', inputType: 'number', placeholder: '4' },
          { key: 'outstanding_debt', label: 'Total Outstanding Business Debt (£)', inputType: 'number', placeholder: '50000' },
        ] },
      { id: 'risk_compliance', name: 'Compliance & Operational Risk', boost: 5, auth: 'manual',
        fields: [
          { key: 'gdpr_compliant', label: 'GDPR / Data Protection Compliant? (yes / partial / no)', placeholder: 'Yes' },
          { key: 'professional_insurance', label: 'Professional Indemnity Insurance in Place? (yes / no)', placeholder: 'Yes' },
          { key: 'contracts_in_place', label: 'Written Contracts with All Clients? (all / most / some / none)', placeholder: 'Most' },
          { key: 'ip_protected', label: 'Intellectual Property Protected? (yes / partial / no)', placeholder: 'Partial' },
          { key: 'last_financial_review', label: 'Last External Financial / Accounts Review (months ago)', inputType: 'number', placeholder: '6' },
        ] },
    ]},
  { group: 'Context Pillar', twin_impact: 'Context', icon: '⊞',
    connectors: [
      { id: 'context_market', name: 'Market Position & Trust Infrastructure', boost: 6, auth: 'manual',
        fields: [
          { key: 'years_trading', label: 'Years Trading', inputType: 'number', placeholder: '5' },
          { key: 'google_review_count', label: 'Number of Google Reviews', inputType: 'number', placeholder: '47' },
          { key: 'google_review_rating', label: 'Average Google Review Rating (1-5)', inputType: 'number', placeholder: '4.6' },
          { key: 'nps_score', label: 'Net Promoter Score (NPS) if known (-100 to +100)', inputType: 'number', placeholder: '42' },
          { key: 'referral_revenue_pct', label: 'Revenue from Referrals (%)', inputType: 'number', placeholder: '40' },
          { key: 'awards_accreditations', label: 'Industry Awards or Accreditations (list or none)', placeholder: 'Xero Certified Partner' },
          { key: 'market_geography', label: 'Primary Market Geography', placeholder: 'UK — London and South East' },
          { key: 'business_stage', label: 'Business Stage (startup / growth / scale / mature / exit planning)', placeholder: 'Growth' },
        ] },
    ]},
  { group: 'Analytics & Market', twin_impact: 'Growth, Strategy', icon: '⊞',
    connectors: [
      { id: 'google_analytics', name: 'Google Analytics', boost: 7, auth: 'oauth',
        fields: [{ key: 'client_id', label: 'Client ID' }, { key: 'client_secret', label: 'Client Secret', secret: true }] },
    ]},
]

export default function BusinessTwinPage() {
  const [user, setUser] = useState<any>(null)
  const [selected, setSelected] = useState<any>(null)
  const [connectorStates, setConnectorStates] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [showAllConnectors, setShowAllConnectors] = useState(false)
  const [showAllManual, setShowAllManual] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        if (user) {
          const { data: biz } = await supabase
            .from('businesses')
            .select('id, business_name, mri_result, subscription_tier, industry, location_country, updated_at')
            .eq('email', user.email)
            .order('updated_at', { ascending: false })
          if (biz && biz.length > 0) {
            setSelected(biz[0])
            const { data: conns } = await supabase
              .from('connectors')
              .select('connector_type, status, last_synced_at, data_snapshot')
              .eq('business_id', biz[0].id)
            if (conns) {
              const states: Record<string, any> = {}
              conns.forEach((c: any) => { states[c.connector_type] = c })
              setConnectorStates(states)
            }
          }
        }
      } catch (e) {}
      setLoading(false)
    }
    load()
  }, [])

  const saveManualData = async (connectorId: string) => {
    if (!selected) return
    setSaving(true)
    try {
      await supabase.from('connectors').upsert({
        business_id: selected.id,
        connector_type: connectorId,
        connector_name: connectorId,
        status: 'active',
        data_snapshot: formData,
        last_synced_at: new Date().toISOString(),
      }, { onConflict: 'business_id,connector_type' })
      setConnectorStates(prev => ({ ...prev, [connectorId]: { status: 'active', last_synced_at: new Date().toISOString(), data_snapshot: formData } }))
      setActiveModal(null)
      setFormData({})
    } catch (e) {}
    setSaving(false)
  }

  if (loading) return <main style={{ backgroundColor: '#050505', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ fontSize: '11px', color: gold, letterSpacing: '0.3em' }}>LOADING BUSINESS TWIN...</div></main>
  if (!user) return <main style={{ backgroundColor: '#050505', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><a href='/login' style={{ padding: '12px 28px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '6px', textDecoration: 'none' }}>Sign In</a></main>

  const hasMRI = !!(selected?.mri_result)
  const result = selected?.mri_result || null
  const health = result?.health || {}
  const businessName = selected?.business_name || 'Your Business'
  const tier = (selected?.subscription_tier || 'analysis').toUpperCase()
  const lastUpdated = selected?.updated_at ? new Date(selected.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

  // Calculate REAL twin completeness
  let completeness = hasMRI ? MRI_BASE : 0
  const activeConnectors: string[] = []
  Object.entries(connectorStates).forEach(([id, state]: [string, any]) => {
    if (state.status === 'active' && CONNECTOR_WEIGHTS[id]) {
      completeness += CONNECTOR_WEIGHTS[id]
      activeConnectors.push(id)
    }
  })
  completeness = Math.min(100, completeness)

  const gc = (p: number) => p >= 85 ? '#4aaa4a' : p >= 70 ? '#C8A24A' : '#e8923a'
  const totalConnectors = CONNECTOR_GROUPS.reduce((s, g) => s + g.connectors.length, 0)
  const connectedCount = activeConnectors.length + (hasMRI ? 1 : 0)

  // Coverage by dimension based on real data
  const dims = [
    { label: 'Financial', pct: Math.min(100, (hasMRI ? 30 : 0) + (connectorStates['xero']?.status === 'active' ? 40 : 0) + (connectorStates['quickbooks']?.status === 'active' ? 40 : 0) + (connectorStates['manual_finance']?.status === 'active' ? 25 : 0)), color: '' },
    { label: 'Operations', pct: Math.min(100, (hasMRI ? 35 : 0) + (connectorStates['hibob']?.status === 'active' ? 30 : 0) + (connectorStates['manual_hr']?.status === 'active' ? 20 : 0)), color: '' },
    { label: 'People', pct: Math.min(100, (hasMRI ? 25 : 0) + (connectorStates['hibob']?.status === 'active' ? 35 : 0) + (connectorStates['workday']?.status === 'active' ? 35 : 0) + (connectorStates['manual_hr']?.status === 'active' ? 25 : 0)), color: '' },
    { label: 'Strategy', pct: Math.min(100, (hasMRI ? 40 : 0) + (connectorStates['manual_strategy']?.status === 'active' ? 45 : 0)), color: '' },
    { label: 'Market', pct: Math.min(100, (hasMRI ? 30 : 0) + (connectorStates['google_analytics']?.status === 'active' ? 30 : 0) + (connectorStates['manual_analytics']?.status === 'active' ? 20 : 0) + (connectorStates['manual_market']?.status === 'active' ? 25 : 0)), color: '' },
    { label: 'Clients', pct: Math.min(100, (hasMRI ? 30 : 0) + (connectorStates['hubspot']?.status === 'active' ? 40 : 0) + (connectorStates['salesforce']?.status === 'active' ? 40 : 0) + (connectorStates['manual_crm']?.status === 'active' ? 25 : 0)), color: '' },
  ].map(d => ({ ...d, color: gc(d.pct) }))

  const n = dims.length
  const radarPts = dims.map((d, i) => {
    const a = (i / n) * 2 * Math.PI - Math.PI / 2
    const r = (d.pct / 100) * 100
    return { x: 120 + r * Math.cos(a), y: 120 + r * Math.sin(a), lx: 120 + 118 * Math.cos(a), ly: 120 + 118 * Math.sin(a), ...d }
  })

  const activeModal_connector = activeModal ? CONNECTOR_GROUPS.flatMap(g => g.connectors).find(c => c.id === activeModal) : null

  return (
    <DashboardShell activeId="twin">
      {activeModal && activeModal_connector && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setActiveModal(null)}>
          <div style={{ backgroundColor: '#0e0e0e', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '12px', padding: '28px', width: '480px', maxWidth: '90vw' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.2em', marginBottom: '4px' }}>MANUAL DATA INPUT</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>{activeModal_connector.name}</div>
              </div>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '18px' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px', marginBottom: '20px' }}>
              {activeModal_connector.fields.map((f: any) => (
                <div key={f.key}>
                  <div style={{ fontSize: '11px', color: '#888', marginBottom: '5px' }}>{f.label}</div>
                  <input
                    type={f.secret ? 'password' : f.inputType || 'text'}
                    value={formData[f.key] || (connectorStates[activeModal]?.data_snapshot?.[f.key] || '')}
                    onChange={e => setFormData(prev => ({ ...prev, [f.key]: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0a0a0a', border: '1px solid #2a2a2a', borderRadius: '6px', color: '#e0e0e0', fontSize: '13px', outline: 'none', boxSizing: 'border-box' as const }}
                  />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => saveManualData(activeModal)} disabled={saving} style={{ flex: 1, padding: '10px', backgroundColor: gold, color: '#050505', border: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
                {saving ? 'Saving...' : 'Save & Update Twin'}
              </button>
              <button onClick={() => setActiveModal(null)} style={{ padding: '10px 20px', backgroundColor: 'transparent', border: '1px solid #2a2a2a', borderRadius: '6px', color: '#888', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* HERO ROW */}
      <div style={{ border: '1px solid rgba(200,162,74,0.25)', borderRadius: '14px', overflow: 'hidden', marginBottom: '16px', position: 'relative' as const, backgroundColor: '#050505', minHeight: '180px' }}>
        <div style={{ position: 'absolute' as const, top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #C8A24A 40%, #C8A24A 60%, transparent)', zIndex: 2 }} />
        <div style={{ position: 'absolute' as const, bottom: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(200,162,74,0.2), transparent)', zIndex: 2 }} />
        {/* Network illustration background */}
        <svg style={{ position: 'absolute' as const, right: '280px', top: 0, height: '100%', width: '460px', opacity: 0.6 }} viewBox="0 0 460 180" preserveAspectRatio="xMidYMid slice">
          {[
            [230,90,180,50],[230,90,290,40],[230,90,160,130],[230,90,310,140],
            [180,50,120,30],[180,50,140,100],[290,40,350,25],[290,40,360,90],
            [160,130,100,150],[310,140,380,160],[120,30,70,60],[350,25,420,50],
            [100,150,60,170],[380,160,440,140],[70,60,30,40],[420,50,455,80],
          ].map(([x1,y1,x2,y2],i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C8A24A" strokeWidth="0.6" opacity="0.4"/>
          ))}
          {[
            [230,90,5,'#FFD060',0.95],[180,50,3.5,'#C8A24A',0.85],[290,40,3.5,'#C8A24A',0.85],
            [160,130,3,'#C8A24A',0.75],[310,140,3,'#C8A24A',0.75],[120,30,2.5,'#C8A24A',0.65],
            [350,25,2.5,'#C8A24A',0.65],[100,150,2,'#8a6f33',0.55],[380,160,2,'#8a6f33',0.55],
            [70,60,2,'#8a6f33',0.5],[420,50,2,'#8a6f33',0.5],[30,40,1.5,'#6a5020',0.4],
            [455,80,1.5,'#6a5020',0.4],[60,170,1.5,'#6a5020',0.4],[440,140,1.5,'#6a5020',0.4],
          ].map(([cx,cy,r,fill,op],i) => (
            <circle key={i} cx={cx} cy={cy} r={r as number} fill={fill as string} opacity={op as number}/>
          ))}
          {/* Central glow */}
          <circle cx="230" cy="90" r="40" fill="rgba(200,162,74,0.04)"/>
          <circle cx="230" cy="90" r="20" fill="rgba(200,162,74,0.06)"/>
        </svg>
        <div style={{ position: 'absolute' as const, inset: 0, background: 'linear-gradient(90deg, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.75) 45%, rgba(5,5,5,0.4) 70%, rgba(5,5,5,0.75) 100%)' }} />
        <div style={{ position: 'relative' as const, zIndex: 1, display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'stretch' }}>
          {/* Left content */}
          <div style={{ padding: '20px 28px' }}>
            <div style={{ fontSize: '9px', color: gold, letterSpacing: '0.25em', marginBottom: '6px', fontWeight: '600' }}>COMMAND CENTRE</div>
            <h1 style={{ fontSize: '26px', fontWeight: '900', letterSpacing: '-0.025em', margin: '0 0 6px', lineHeight: 1.1, color: '#ffffff' }}>Business Twin™ Centre</h1>
            <div style={{ fontSize: '12px', color: '#777', marginBottom: '10px' }}>The intelligence foundation powering every BEI recommendation</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' as const }}>
              <div style={{ fontSize: '11px', color: '#444' }}>{businessName} · {tier} · Last updated {lastUpdated}</div>
              {hasMRI && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '2px 9px', backgroundColor: 'rgba(74,170,74,0.08)', border: '1px solid rgba(74,170,74,0.2)', borderRadius: '20px' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#4aaa4a', boxShadow: '0 0 5px rgba(74,170,74,0.8)' }} />
                  <span style={{ fontSize: '10px', color: '#4aaa4a', fontWeight: '600', letterSpacing: '0.06em' }}>Intelligence Active</span>
                </div>
              )}
            </div>
            {!hasMRI && (
              <div style={{ marginTop: '10px', padding: '8px 12px', backgroundColor: 'rgba(204,68,68,0.08)', border: '1px solid rgba(204,68,68,0.2)', borderRadius: '6px', display: 'inline-block' }}>
                <div style={{ fontSize: '11px', color: '#cc4444', fontWeight: '600' }}>⚠ No Business MRI found — complete your MRI to activate the Business Twin™</div>
              </div>
            )}
          </div>
          {/* Right status panel */}
          <div style={{ padding: '20px 24px', borderLeft: '1px solid rgba(200,162,74,0.15)', display: 'flex', flexDirection: 'column' as const, justifyContent: 'center', alignItems: 'flex-start', gap: '6px', minWidth: '220px', backgroundColor: 'rgba(200,162,74,0.03)' }}>
            <div style={{ fontSize: '9px', color: '#555', letterSpacing: '0.18em', fontWeight: '600' }}>BUSINESS TWIN™ STATUS</div>
            <div style={{ fontSize: '24px', fontWeight: '900', color: gold, lineHeight: 1.1, letterSpacing: '-0.02em' }}>Intelligence<br/>Ready</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: hasMRI ? '#4aaa4a' : '#cc4444', boxShadow: `0 0 7px ${hasMRI ? 'rgba(74,170,74,0.8)' : 'rgba(204,68,68,0.8)'}` }} />
              <span style={{ fontSize: '10px', color: hasMRI ? '#4aaa4a' : '#cc4444', fontWeight: '700', letterSpacing: '0.1em' }}>{hasMRI ? 'ACTIVE' : 'INACTIVE'}</span>
            </div>
            <div style={{ marginTop: '4px', width: '48px', height: '48px', borderRadius: '50%', border: `2px solid ${hasMRI ? '#4aaa4a' : '#cc4444'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 14px ${hasMRI ? 'rgba(74,170,74,0.15)' : 'rgba(204,68,68,0.15)'}` }}>
              {hasMRI
                ? <svg width="22" height="22" viewBox="0 0 28 28"><polyline points="5,14 11,20 23,8" fill="none" stroke="#4aaa4a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                : <span style={{ fontSize: '18px', color: '#cc4444' }}>✕</span>
              }
            </div>
          </div>
        </div>
      </div>

      {/* INTELLIGENCE OVERVIEW PANEL — compact single row */}
      <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', marginBottom: '14px', padding: '14px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '20px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <div style={{ fontSize: '36px', fontWeight: '900', color: gc(completeness), lineHeight: 1, letterSpacing: '-0.03em' }}>{completeness}%</div>
            <div>
              <div style={{ fontSize: '10px', color: '#aaaaaa', letterSpacing: '0.12em', fontWeight: '700' }}>TWIN COMPLETENESS</div>
              <div style={{ fontSize: '10px', color: gc(completeness), fontWeight: '600' }}>{completeness >= 80 ? 'Excellent' : completeness >= 60 ? 'Good' : completeness >= 40 ? 'Building' : 'Getting started'} · {hasMRI ? 'MRI + ' + activeConnectors.length + ' connector' + (activeConnectors.length !== 1 ? 's' : '') : 'No MRI'}</div>
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#111', gap: '2px', marginBottom: '6px' }}>
              <div style={{ width: MRI_BASE + '%', height: '100%', backgroundColor: hasMRI ? '#4aaa4a' : '#2a2a2a', borderRadius: '4px 0 0 4px', flexShrink: 0 }} />
              {CONNECTOR_GROUPS.flatMap(g => g.connectors).filter(c => activeConnectors.includes(c.id)).map((c, i) => (
                <div key={i} style={{ width: c.boost + '%', height: '100%', backgroundColor: gold, flexShrink: 0 }} />
              ))}
              <div style={{ flex: 1, height: '100%', backgroundColor: '#111', borderRadius: '0 4px 4px 0' }} />
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '8px', height: '5px', borderRadius: '2px', backgroundColor: hasMRI ? '#4aaa4a' : '#2a2a2a' }} />
                <span style={{ fontSize: '9px', color: '#666' }}>MRI ({MRI_BASE}%) — {hasMRI ? 'Complete' : 'Missing'}</span>
              </div>
              {CONNECTOR_GROUPS.flatMap(g => g.connectors).filter(c => activeConnectors.includes(c.id)).slice(0, 3).map(c => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '8px', height: '5px', borderRadius: '2px', backgroundColor: gold }} />
                  <span style={{ fontSize: '9px', color: '#666' }}>{c.name} (+{c.boost}%)</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { label: 'ACCURACY', value: completeness >= 60 ? '96%' : '78%', color: '#4aaa4a' },
              { label: 'CONFIDENCE', value: completeness >= 60 ? 'HIGH' : completeness >= 40 ? 'MEDIUM' : 'LOW', color: gc(completeness) },
              { label: 'SOURCES', value: connectedCount.toString(), color: gold },
              { label: 'READINESS', value: completeness >= 40 ? 'Verified' : 'Incomplete', color: completeness >= 40 ? '#4aaa4a' : '#cc4444' },
            ].map((k, i) => (
              <div key={i} style={{ padding: '8px 12px', backgroundColor: '#0a0a0a', border: '1px solid ' + border, borderRadius: '6px', textAlign: 'center' as const, minWidth: '70px' }}>
                <div style={{ fontSize: '8px', color: '#555', letterSpacing: '0.1em', marginBottom: '3px', fontWeight: '600' }}>{k.label}</div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: k.color, lineHeight: 1 }}>{k.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* 6-METRIC KPI BAR */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '10px', marginBottom: '14px' }}>
        {[
          { label: 'COMPLETENESS', value: completeness + '%', color: gc(completeness), trend: completeness > 40 ? '↑ ' + (completeness - 40) + '% added' : 'Base MRI only', sub: 'vs last 30 days' },
          { label: 'ACCURACY', value: completeness >= 60 ? '96%' : completeness >= 40 ? '78%' : '—', color: '#4aaa4a', trend: completeness >= 60 ? '↑ 4%' : '↑ 0%', sub: 'vs last 30 days' },
          { label: 'DATA CONFIDENCE', value: completeness >= 60 ? '94%' : completeness >= 40 ? '72%' : '—', color: gc(completeness), trend: completeness >= 40 ? '↑ 5%' : '—', sub: 'vs last 30 days' },
          { label: 'CONNECTED SOURCES', value: connectedCount.toString(), color: gold, trend: 'Active', sub: 'of ' + (totalConnectors + 1) + ' available' },
          { label: 'MANUAL INPUTS', value: activeConnectors.filter((id: string) => id.startsWith('manual_') || !['hubspot','salesforce','xero','quickbooks','google_analytics','hibob','workday'].includes(id)).length + '%', color: '#4aaa4a', trend: activeConnectors.filter((id: string) => id.startsWith('manual_') || !['hubspot','salesforce','xero','quickbooks','google_analytics','hibob','workday'].includes(id)).length > 0 ? 'Active' : 'Pending', sub: 'complete' },
          { label: 'INTELLIGENCE READINESS', value: completeness >= 60 ? 'Verified' : completeness >= 40 ? 'Partial' : 'Low', color: completeness >= 60 ? '#4aaa4a' : completeness >= 40 ? gold : '#cc4444', trend: completeness >= 40 ? 'High Confidence' : 'Add more data', sub: 'Production grade' },
        ].map((k, i) => (
          <div key={i} style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '8px', padding: '14px 16px' }}>
            <div style={{ fontSize: '9px', color: '#aaaaaa', letterSpacing: '0.12em', marginBottom: '8px', fontWeight: '700' }}>{k.label}</div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: k.color, lineHeight: 1, marginBottom: '3px' }}>{k.value}</div>
            <div style={{ fontSize: '10px', color: k.color, fontWeight: '600', marginBottom: '2px' }}>{k.trend}</div>
            <div style={{ fontSize: '10px', color: '#555' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* 4-COLUMN GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '14px', alignItems: 'stretch' }}>

        {/* DATA SOURCE ARCHITECTURE TABLE */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '18px', display: 'flex', flexDirection: 'column' as const }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ fontSize: '10px', color: '#e0e0e0', letterSpacing: '0.15em', fontWeight: '600' }}>DATA SOURCE ARCHITECTURE™</div>
            <button onClick={() => setShowAllConnectors(true)} style={{ fontSize: '10px', color: gold, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>View all connectors →</button>
          </div>
          <div style={{ fontSize: '11px', color: '#555', marginBottom: '12px' }}>Connected systems feeding your Business Twin™</div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '0', marginBottom: '6px' }}>
            {['SOURCE','STATUS','QUALITY','BOOST'].map(h => (
              <div key={h} style={{ fontSize: '8px', color: '#444', letterSpacing: '0.1em', padding: '4px 0', borderBottom: '1px solid #1a1a1a', fontWeight: '600' }}>{h}</div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0', flex: 1, overflowY: 'auto' as const, maxHeight: '300px' }}>
            {CONNECTOR_GROUPS.flatMap(g => g.connectors).filter(c => c.auth === 'oauth').slice(0, 6).map((c, i) => {
              const state = connectorStates[c.id]
              const isActive = state?.status === 'active'
              return (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '0', padding: '8px 0', borderBottom: '1px solid #111', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: isActive ? '#4aaa4a' : '#333', flexShrink: 0 }} />
                    <span style={{ fontSize: '11px', color: isActive ? '#e0e0e0' : '#777', fontWeight: isActive ? '600' : '400' }}>{c.name}</span>
                  </div>
                  <div style={{ fontSize: '10px', color: isActive ? '#4aaa4a' : '#444', fontWeight: '600' }}>{isActive ? 'Connected' : 'Available'}</div>
                  <div style={{ fontSize: '10px', color: isActive ? '#4aaa4a' : '#333' }}>{isActive ? '92%' : '—'}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '10px', color: isActive ? gold : '#555' }}>+{c.boost}%</span>
                    {!isActive && (
                      <button onClick={() => { setActiveModal(c.id); setFormData({}) }} style={{ padding: '3px 8px', backgroundColor: 'rgba(200,162,74,0.08)', border: '1px solid rgba(200,162,74,0.2)', borderRadius: '3px', color: gold, fontSize: '9px', cursor: 'pointer', fontWeight: '600' }}>ADD</button>
                    )}
                    {isActive && <span style={{ fontSize: '10px', color: '#4aaa4a' }}>✓</span>}
                  </div>
                </div>
              )
            })}
          </div>
          <button onClick={() => setShowAllConnectors(true)} style={{ width: '100%', marginTop: '12px', padding: '9px', backgroundColor: 'rgba(200,162,74,0.06)', border: '1px solid rgba(200,162,74,0.15)', borderRadius: '6px', color: gold, fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}>View all connectors ({CONNECTOR_GROUPS.flatMap(g => g.connectors).filter(c => c.auth === 'oauth').length}) →</button>
        </div>

        {/* MANUAL INTELLIGENCE INPUTS */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '18px', display: 'flex', flexDirection: 'column' as const }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ fontSize: '10px', color: '#e0e0e0', letterSpacing: '0.15em', fontWeight: '600' }}>MANUAL INTELLIGENCE INPUTS™</div>
            <button onClick={() => setShowAllManual(true)} style={{ fontSize: '10px', color: gold, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>View all inputs →</button>
          </div>
          <div style={{ fontSize: '11px', color: '#555', marginBottom: '12px' }}>Add data manually to improve Business Twin™ completeness</div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px', flex: 1, overflowY: 'auto' as const, maxHeight: '340px' }}>
            {CONNECTOR_GROUPS.flatMap(g => g.connectors).filter(c => c.auth === 'manual').slice(0, 6).map((c, i) => {
              const state = connectorStates[c.id]
              const isActive = state?.status === 'active'
              return (
                <div key={i} style={{ padding: '11px 12px', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid ' + (isActive ? '#1a2a1a' : border) }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                    <div style={{ fontSize: '12px', color: '#e0e0e0', fontWeight: '600' }}>{c.name}</div>
                    <div style={{ fontSize: '10px', color: isActive ? '#4aaa4a' : gold, fontWeight: '600' }}>+{c.boost}%</div>
                  </div>
                  <div style={{ fontSize: '10px', color: '#555', marginBottom: '7px' }}>
                    {isActive ? '✓ Submitted · ' + (state?.last_synced_at ? new Date(state.last_synced_at).toLocaleDateString('en-GB') : '') : c.fields.length + ' fields required'}
                  </div>
                  <button onClick={() => { setActiveModal(c.id); setFormData({}) }} style={{ width: '100%', padding: '6px', backgroundColor: isActive ? 'rgba(74,170,74,0.08)' : 'rgba(200,162,74,0.08)', border: '1px solid ' + (isActive ? 'rgba(74,170,74,0.2)' : 'rgba(200,162,74,0.2)'), borderRadius: '4px', color: isActive ? '#4aaa4a' : gold, fontSize: '10px', cursor: 'pointer', fontWeight: '600' }}>
                    {isActive ? '✏ Update Data' : '+ Add Data'}
                  </button>
                </div>
              )
            })}
          </div>
          <button onClick={() => setShowAllManual(true)} style={{ width: '100%', marginTop: '12px', padding: '9px', backgroundColor: 'rgba(200,162,74,0.06)', border: '1px solid rgba(200,162,74,0.15)', borderRadius: '6px', color: gold, fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}>View all inputs ({CONNECTOR_GROUPS.flatMap(g => g.connectors).filter(c => c.auth === 'manual').length}) →</button>
        </div>

        {/* COVERAGE MAP */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '18px', display: 'flex', flexDirection: 'column' as const }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ fontSize: '10px', color: '#e0e0e0', letterSpacing: '0.15em', fontWeight: '600' }}>COVERAGE MAP™</div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: gc(completeness) }}>{completeness}%</div>
          </div>
          <div style={{ fontSize: '11px', color: '#555', marginBottom: '10px' }}>Real-time intelligence dimension coverage</div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <svg width="100%" viewBox="0 0 260 280" style={{ maxWidth: '280px' }}>
              <defs><filter id="gw"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
              <circle cx="130" cy="140" r="130" fill="#050505"/>
              {[25,50,75,100].map(ring => (
                <polygon key={ring} points={dims.map((_, i) => { const a=(i/n)*2*Math.PI-Math.PI/2; const r=(ring/100)*100; return `${130+r*Math.cos(a)},${140+r*Math.sin(a)}` }).join(' ')} fill="none" stroke="#1a2a1a" strokeWidth="0.8"/>
              ))}
              {dims.map((_, i) => { const a=(i/n)*2*Math.PI-Math.PI/2; return <line key={i} x1="130" y1="140" x2={130+100*Math.cos(a)} y2={140+100*Math.sin(a)} stroke="#1a2a1a" strokeWidth="0.8"/> })}
              {radarPts.map((p, i) => { const next=radarPts[(i+1)%n]; return <polygon key={i} points={`130,140 ${p.x},${p.y} ${next.x},${next.y}`} fill={p.color+'18'} stroke={p.color} strokeWidth="1.5" filter="url(#gw)"/> })}
              {radarPts.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="5" fill={p.color} filter="url(#gw)"/>
                  <circle cx={p.x} cy={p.y} r="2" fill="#fff"/>
                  <text x={p.lx} y={p.ly-5} textAnchor="middle" fill="#888" fontSize="9" fontWeight="600">{p.label}</text>
                  <text x={p.lx} y={p.ly+7} textAnchor="middle" fill={p.color} fontSize="11" fontWeight="800">{p.pct}%</text>
                </g>
              ))}
              <text x="130" y="136" textAnchor="middle" fill={gold} fontSize="16" fontWeight="900">{completeness}</text>
              <text x="130" y="148" textAnchor="middle" fill="#555" fontSize="7" letterSpacing="0.1em">TWIN</text>
            </svg>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '8px', flexWrap: 'wrap' as const }}>
            {[['#4aaa4a','Strong'],['#C8A24A','Moderate'],['#e8923a','Weak']].map(([c,l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: c }} />
                <span style={{ fontSize: '9px', color: '#555' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RECOMMENDED IMPROVEMENTS */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '18px', display: 'flex', flexDirection: 'column' as const }}>
          <div style={{ fontSize: '10px', color: '#e0e0e0', letterSpacing: '0.15em', fontWeight: '600', marginBottom: '4px' }}>RECOMMENDED IMPROVEMENTS™</div>
          <div style={{ fontSize: '11px', color: '#555', marginBottom: '14px' }}>Actions to increase Twin completeness</div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
            {(() => {
              // Group connectors by purpose — show primary + manual alternative
              const recommendations: {primary: any, manual: any | null}[] = []
              const seen = new Set<string>()
              CONNECTOR_GROUPS.forEach(g => {
                const apiConns = g.connectors.filter(c => c.auth === 'oauth' && !activeConnectors.includes(c.id))
                const manualConn = g.connectors.find(c => c.auth === 'manual' && !activeConnectors.includes(c.id))
                apiConns.forEach(c => {
                  if (!seen.has(c.id)) {
                    seen.add(c.id)
                    recommendations.push({ primary: c, manual: manualConn || null })
                  }
                })
                if (!apiConns.length && manualConn && !seen.has(manualConn.id)) {
                  seen.add(manualConn.id)
                  recommendations.push({ primary: manualConn, manual: null })
                }
              })
              return recommendations.slice(0, 6).map((rec, i) => (
                <div key={i} style={{ padding: '10px 12px', backgroundColor: '#0a0a0a', borderRadius: '6px', border: '1px solid ' + border }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: rec.manual ? '6px' : '0' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '11px', color: '#e0e0e0', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{rec.primary.name}</div>
                      <div style={{ fontSize: '10px', color: '#4aaa4a', marginTop: '1px' }}>+{rec.primary.boost}% completeness</div>
                    </div>
                    <button onClick={() => { setActiveModal(rec.primary.id); setFormData({}) }} style={{ padding: '4px 10px', backgroundColor: 'rgba(200,162,74,0.1)', border: '1px solid rgba(200,162,74,0.2)', borderRadius: '4px', color: gold, fontSize: '10px', cursor: 'pointer', fontWeight: '600', flexShrink: 0 }}>
                      Connect
                    </button>
                  </div>
                  {rec.manual && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingTop: '6px', borderTop: '1px solid #1a1a1a' }}>
                      <div style={{ fontSize: '10px', color: '#555', flex: 1 }}>or add manually · +{rec.manual.boost}%</div>
                      <button onClick={() => { setActiveModal(rec.manual.id); setFormData({}) }} style={{ padding: '3px 8px', backgroundColor: 'transparent', border: '1px solid #2a2a2a', borderRadius: '4px', color: '#666', fontSize: '9px', cursor: 'pointer' }}>
                        Add Manual Data
                      </button>
                    </div>
                  )}
                </div>
              ))
            })()}
            {CONNECTOR_GROUPS.flatMap(g => g.connectors).filter(c => !activeConnectors.includes(c.id)).length === 0 && (
              <div style={{ textAlign: 'center' as const, padding: '20px', color: '#4aaa4a', fontSize: '13px' }}>✓ All connectors active — Twin at maximum completeness</div>
            )}
          </div>
        </div>
      </div>
      {/* DATA QUALITY ENGINE + INTELLIGENCE CONFIDENCE ENGINE */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>

        {/* DATA QUALITY ENGINE */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '18px' }}>
          <div style={{ fontSize: '10px', color: '#e0e0e0', letterSpacing: '0.15em', fontWeight: '600', marginBottom: '4px' }}>DATA QUALITY ENGINE™</div>
          <div style={{ fontSize: '11px', color: '#555', marginBottom: '16px' }}>Quality directly impacts intelligence accuracy</div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between', marginBottom: '20px' }}>
            {[
              { label: 'Completeness', value: completeness },
              { label: 'Freshness', value: completeness >= 60 ? 95 : completeness >= 40 ? 80 : 50 },
              { label: 'Consistency', value: completeness >= 60 ? 93 : completeness >= 40 ? 76 : 45 },
              { label: 'Coverage', value: completeness >= 60 ? 90 : completeness >= 40 ? 68 : 40 },
              { label: 'Verification', value: hasMRI ? 94 : 0 },
            ].map((m, i) => {
              const r = 22
              const circ = r * 2 * Math.PI
              const fill = (m.value / 100) * circ
              const c = m.value >= 85 ? '#4aaa4a' : m.value >= 70 ? gold : '#e8923a'
              return (
                <div key={i} style={{ textAlign: 'center' as const }}>
                  <svg width="72" height="72" viewBox="0 0 52 52">
                    <circle cx="26" cy="26" r={r} fill="none" stroke="#1a1a1a" strokeWidth="4"/>
                    <circle cx="26" cy="26" r={r} fill="none" stroke={c} strokeWidth="4"
                      strokeDasharray={String(fill) + ' ' + String(circ - fill)}
                      strokeDashoffset={String(circ * 0.25)}
                      strokeLinecap="round"
                      transform="rotate(-90 26 26)"/>
                    <text x="26" y="30" textAnchor="middle" fill={c} fontSize="11" fontWeight="800">{m.value}%</text>
                  </svg>
                  <div style={{ fontSize: '10px', color: '#888', marginTop: '5px', lineHeight: 1.3, textAlign: 'center' as const }}>{m.label}</div>
                </div>
              )
            })}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '14px', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid ' + border }}>
            <div>
              <div style={{ fontSize: '9px', color: '#555', letterSpacing: '0.1em', marginBottom: '4px', fontWeight: '600' }}>OVERALL DATA QUALITY SCORE</div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: gc(completeness), lineHeight: 1 }}>{Math.round(completeness * 0.93)}<span style={{ fontSize: '14px', color: '#555' }}>/100</span></div>
              <div style={{ fontSize: '10px', color: '#4aaa4a', marginTop: '4px' }}>↑ {Math.round(completeness * 0.06)} pts vs last 30 days</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ padding: '10px 12px', backgroundColor: 'rgba(200,162,74,0.06)', border: '1px solid rgba(200,162,74,0.15)', borderRadius: '6px', fontSize: '10px', color: '#aaa', lineHeight: 1.5 }}>
                {completeness >= 60 ? 'Good data quality = high confidence intelligence' : completeness >= 40 ? 'Medium quality — add more sources to improve' : 'Low quality — complete your MRI first'}
              </div>
            </div>
          </div>
        </div>

        {/* INTELLIGENCE CONFIDENCE ENGINE */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '18px' }}>
          <div style={{ fontSize: '10px', color: '#e0e0e0', letterSpacing: '0.15em', fontWeight: '600', marginBottom: '4px' }}>INTELLIGENCE CONFIDENCE ENGINE™</div>
          <div style={{ fontSize: '11px', color: '#555', marginBottom: '16px' }}>How Business Twin™ quality impacts your intelligence</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '8px', marginBottom: '20px' }}>
            {[
              { label: 'Constraint Detection', value: hasMRI ? Math.round(completeness * 0.94) : 0 },
              { label: 'Health Scores', value: hasMRI ? Math.round(completeness * 0.95) : 0 },
              { label: 'Verification Scores', value: hasMRI ? Math.round(completeness * 0.93) : 0 },
              { label: 'Opportunity Forecasting', value: hasMRI ? Math.round(completeness * 0.89) : 0 },
              { label: 'Risk Intelligence', value: hasMRI ? Math.round(completeness * 0.92) : 0 },
              { label: 'Benchmark Accuracy', value: hasMRI ? Math.round(completeness * 0.91) : 0 },
            ].map((m, i) => {
              const r = 20
              const circ = r * 2 * Math.PI
              const fill = (m.value / 100) * circ
              const c = m.value >= 85 ? '#4aaa4a' : m.value >= 70 ? gold : '#e8923a'
              return (
                <div key={i} style={{ textAlign: 'center' as const }}>
                  <svg width="72" height="72" viewBox="0 0 46 46">
                    <circle cx="23" cy="23" r={r} fill="none" stroke="#1a1a1a" strokeWidth="3.5"/>
                    <circle cx="23" cy="23" r={r} fill="none" stroke={c} strokeWidth="3.5"
                      strokeDasharray={String(fill) + ' ' + String(circ - fill)}
                      strokeDashoffset={String(circ * 0.25)}
                      strokeLinecap="round"
                      transform="rotate(-90 23 23)"/>
                    <text x="23" y="27" textAnchor="middle" fill={c} fontSize="10" fontWeight="800">{m.value}%</text>
                  </svg>
                  <div style={{ fontSize: '10px', color: '#777', marginTop: '5px', lineHeight: 1.3, textAlign: 'center' as const }}>{m.label}</div>
                </div>
              )
            })}
          </div>
          <div style={{ padding: '12px 14px', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid ' + border }}>
            <div style={{ fontSize: '9px', color: '#555', letterSpacing: '0.1em', marginBottom: '6px', fontWeight: '600' }}>OVERALL INTELLIGENCE CONFIDENCE</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ fontSize: '28px', fontWeight: '900', color: gc(completeness), lineHeight: 1 }}>{hasMRI ? Math.round(completeness * 0.93) : 0}%</div>
              <div style={{ fontSize: '12px', color: gc(completeness), fontWeight: '600' }}>{completeness >= 60 ? 'High Confidence' : completeness >= 40 ? 'Medium Confidence' : 'Low — Complete MRI'}</div>
            </div>
            <div style={{ height: '6px', backgroundColor: '#1a1a1a', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: (hasMRI ? completeness * 0.93 : 0) + '%', height: '100%', background: 'linear-gradient(90deg, #cc4444 0%, ' + gold + ' 45%, #4aaa4a 80%)', borderRadius: '3px', transition: 'width 1s ease' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              {['Low','Medium','High','Very High'].map(l => <span key={l} style={{ fontSize: '8px', color: '#333' }}>{l}</span>)}
            </div>
          </div>
        </div>
      </div>

      {/* TWIN TIMELINE */}
      <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '18px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <div style={{ fontSize: '10px', color: '#e0e0e0', letterSpacing: '0.15em', fontWeight: '600', marginBottom: '2px' }}>BUSINESS TWIN™ TIMELINE</div>
            <div style={{ fontSize: '11px', color: '#555' }}>Live audit trail of intelligence generation</div>
          </div>
          <a href="#" style={{ fontSize: '10px', color: gold, textDecoration: 'none' }}>View full timeline →</a>
        </div>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' as const }}>
          {[
            { icon: '◈', label: 'MRI completed', desc: 'Business profile captured', time: lastUpdated, color: gold },
            { icon: '↗', label: 'Constraint detected', desc: result?.primary_constraint?.name || 'Primary constraint identified', time: lastUpdated, color: '#4aaa4a' },
            { icon: '✓', label: 'Verification passed', desc: 'Intelligence grade: ' + (result?.confidence || 'pending'), time: lastUpdated, color: '#4aaa4a' },
            ...activeConnectors.slice(0,3).map(id => ({ icon: '⊞', label: id + ' connected', desc: 'Data synced successfully', time: 'Active', color: gold })),
            { icon: '◎', label: 'Twin active', desc: 'All systems operational', time: 'Now', color: '#4aaa4a' },
          ].map((ev, i) => (
            <div key={i} style={{ flexShrink: 0, display: 'flex', gap: '10px', padding: '10px 14px', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid ' + border, minWidth: '200px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: ev.color + '18', border: '1px solid ' + ev.color + '44', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '11px', color: ev.color }}>
                {ev.icon}
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#e0e0e0', fontWeight: '600', marginBottom: '2px' }}>{ev.label}</div>
                <div style={{ fontSize: '10px', color: '#555', marginBottom: '3px' }}>{ev.desc}</div>
                <div style={{ fontSize: '9px', color: '#333' }}>{ev.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ALL CONNECTORS MODAL */}
      {showAllConnectors && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '40px', overflowY: 'auto' as const }} onClick={() => setShowAllConnectors(false)}>
          <div style={{ backgroundColor: '#0e0e0e', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '14px', padding: '32px', width: '860px', maxWidth: '95vw', marginBottom: '40px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.2em', marginBottom: '4px', fontWeight: '600' }}>ALL CONNECTORS</div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#fff' }}>Data Source Architecture™</div>
                <div style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>Connect external systems to improve Business Twin™ completeness</div>
              </div>
              <button onClick={() => setShowAllConnectors(false)} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '6px', color: '#888', cursor: 'pointer', fontSize: '18px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            {CONNECTOR_GROUPS.map((group, gi) => (
              <div key={gi} style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', paddingBottom: '8px', borderBottom: '1px solid #1a1a1a' }}>
                  <div style={{ fontSize: '9px', color: gold, letterSpacing: '0.15em', fontWeight: '600' }}>{group.group.toUpperCase()}</div>
                  <div style={{ fontSize: '10px', color: '#444' }}>Impacts: {group.twin_impact}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {group.connectors.filter(c => c.auth === 'oauth').map((c, i) => {
                    const state = connectorStates[c.id]
                    const isActive = state?.status === 'active'
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid ' + (isActive ? '#1a2a1a' : '#1e1e1e') }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isActive ? '#4aaa4a' : '#333', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', color: '#e0e0e0', fontWeight: '600' }}>{c.name}</div>
                          <div style={{ fontSize: '10px', color: isActive ? '#4aaa4a' : '#555', marginTop: '2px' }}>{isActive ? '✓ Connected · Active' : '+' + c.boost + '% completeness when connected'}</div>
                        </div>
                        {!isActive ? (
                          <button onClick={() => { setActiveModal(c.id); setFormData({}); setShowAllConnectors(false) }} style={{ padding: '6px 14px', backgroundColor: 'rgba(200,162,74,0.1)', border: '1px solid rgba(200,162,74,0.25)', borderRadius: '5px', color: gold, fontSize: '11px', cursor: 'pointer', fontWeight: '600', flexShrink: 0 }}>Connect</button>
                        ) : (
                          <div style={{ fontSize: '11px', color: '#4aaa4a', fontWeight: '600' }}>✓ Active</div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ALL MANUAL INPUTS MODAL */}
      {showAllManual && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '40px', overflowY: 'auto' as const }} onClick={() => setShowAllManual(false)}>
          <div style={{ backgroundColor: '#0e0e0e', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '14px', padding: '32px', width: '860px', maxWidth: '95vw', marginBottom: '40px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.2em', marginBottom: '4px', fontWeight: '600' }}>ALL MANUAL INPUTS</div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#fff' }}>Manual Intelligence Inputs™</div>
                <div style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>Add your business data manually to strengthen Business Twin™ intelligence</div>
              </div>
              <button onClick={() => setShowAllManual(false)} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '6px', color: '#888', cursor: 'pointer', fontSize: '18px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            {CONNECTOR_GROUPS.map((group, gi) => {
              const manualConns = group.connectors.filter(c => c.auth === 'manual')
              if (manualConns.length === 0) return null
              return (
                <div key={gi} style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', paddingBottom: '8px', borderBottom: '1px solid #1a1a1a' }}>
                    <div style={{ fontSize: '9px', color: gold, letterSpacing: '0.15em', fontWeight: '600' }}>{group.group.toUpperCase()}</div>
                    <div style={{ fontSize: '10px', color: '#444' }}>Impacts: {group.twin_impact}</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                    {manualConns.map((c, i) => {
                      const state = connectorStates[c.id]
                      const isActive = state?.status === 'active'
                      return (
                        <div key={i} style={{ padding: '14px', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid ' + (isActive ? '#1a2a1a' : '#1e1e1e') }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                            <div style={{ fontSize: '13px', color: '#e0e0e0', fontWeight: '600', flex: 1 }}>{c.name}</div>
                            <div style={{ fontSize: '10px', color: isActive ? '#4aaa4a' : gold, fontWeight: '600', marginLeft: '8px' }}>+{c.boost}%</div>
                          </div>
                          <div style={{ fontSize: '10px', color: '#555', marginBottom: '10px' }}>
                            {isActive ? '✓ Data submitted · ' + (state?.last_synced_at ? new Date(state.last_synced_at).toLocaleDateString('en-GB') : '') : c.fields.length + ' fields required'}
                          </div>
                          <button onClick={() => { setActiveModal(c.id); setFormData({}); setShowAllManual(false) }} style={{ width: '100%', padding: '7px', backgroundColor: isActive ? 'rgba(74,170,74,0.08)' : 'rgba(200,162,74,0.08)', border: '1px solid ' + (isActive ? 'rgba(74,170,74,0.2)' : 'rgba(200,162,74,0.2)'), borderRadius: '5px', color: isActive ? '#4aaa4a' : gold, fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}>
                            {isActive ? '✏ Update Data' : '+ Add Data'}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

    </DashboardShell>
  )
}
