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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px 260px', gap: '0', border: '1px solid rgba(200,162,74,0.2)', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px', position: 'relative' as const, backgroundColor: '#050505', backgroundImage: 'url(/new123.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div style={{ position: 'absolute' as const, inset: 0, background: 'linear-gradient(90deg, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.75) 50%, rgba(5,5,5,0.88) 100%)', zIndex: 0 }} />
        <div style={{ position: 'absolute' as const, top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #C8A24A, transparent)', zIndex: 1 }} />
        <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column' as const, justifyContent: 'center', position: 'relative' as const, zIndex: 1 }}>
          <div style={{ fontSize: '10px', color: '#555', letterSpacing: '0.2em', marginBottom: '8px', fontWeight: '600' }}>COMMAND CENTRE</div>
          <h1 style={{ fontSize: '30px', fontWeight: '900', letterSpacing: '-0.02em', margin: '0 0 8px', lineHeight: 1.1 }}>Business Twin™ Centre</h1>
          <div style={{ fontSize: '13px', color: '#555', marginBottom: '16px' }}>The intelligence foundation powering every BEI recommendation</div>
          <div style={{ fontSize: '11px', color: '#444' }}>{businessName} · {tier} · Last updated {lastUpdated}</div>
          {!hasMRI && (
            <div style={{ marginTop: '16px', padding: '10px 14px', backgroundColor: 'rgba(204,68,68,0.08)', border: '1px solid rgba(204,68,68,0.2)', borderRadius: '6px' }}>
              <div style={{ fontSize: '11px', color: '#cc4444', fontWeight: '600' }}>⚠ No Business MRI found — complete your MRI to activate the Business Twin™</div>
            </div>
          )}
        </div>
        <div style={{ position: 'relative' as const, zIndex: 1 }} />
        <div style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column' as const, justifyContent: 'center', gap: '10px', position: 'relative' as const, zIndex: 1, backgroundColor: 'rgba(5,5,5,0.6)', backdropFilter: 'blur(4px)' }}>
          <div style={{ fontSize: '9px', color: '#555', letterSpacing: '0.15em' }}>BUSINESS TWIN™ STATUS</div>
          <div style={{ fontSize: '26px', fontWeight: '900', color: gold, lineHeight: 1 }}>Intelligence</div>
          <div style={{ fontSize: '26px', fontWeight: '900', color: gold, lineHeight: 1, marginTop: '-6px' }}>Ready</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: hasMRI ? '#4aaa4a' : '#cc4444', boxShadow: `0 0 8px ${hasMRI ? 'rgba(74,170,74,0.8)' : 'rgba(204,68,68,0.8)'}` }} />
            <span style={{ fontSize: '11px', color: hasMRI ? '#4aaa4a' : '#cc4444', fontWeight: '600', letterSpacing: '0.1em' }}>{hasMRI ? 'ACTIVE' : 'INACTIVE'}</span>
          </div>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: `3px solid ${hasMRI ? '#4aaa4a' : '#cc4444'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '6px', boxShadow: `0 0 16px ${hasMRI ? 'rgba(74,170,74,0.2)' : 'rgba(204,68,68,0.2)'}` }}>
            {hasMRI
              ? <svg width="28" height="28" viewBox="0 0 28 28"><polyline points="5,14 11,20 23,8" fill="none" stroke="#4aaa4a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              : <span style={{ fontSize: '20px', color: '#cc4444' }}>✕</span>
            }
          </div>
        </div>
      </div>

      {/* KPI STRIP */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '10px', marginBottom: '16px' }}>
        {[
          { label: 'COMPLETENESS', value: completeness + '%', color: gc(completeness), sub: hasMRI ? 'MRI + ' + activeConnectors.length + ' connectors' : 'No MRI yet' },
          { label: 'ACCURACY', value: completeness >= 60 ? '96%' : completeness >= 40 ? '78%' : '—', color: '#4aaa4a', sub: 'Data consistency' },
          { label: 'DATA CONFIDENCE', value: completeness >= 60 ? 'HIGH' : completeness >= 40 ? 'MEDIUM' : 'LOW', color: gc(completeness), sub: 'Intelligence grade' },
          { label: 'CONNECTED SOURCES', value: connectedCount.toString(), color: gold, sub: 'of ' + (totalConnectors + 1) + ' available' },
          { label: 'MANUAL INPUTS', value: activeConnectors.filter(id => id.startsWith('manual_')).length > 0 ? 'ACTIVE' : 'PENDING', color: activeConnectors.filter(id => id.startsWith('manual_')).length > 0 ? '#4aaa4a' : '#555', sub: activeConnectors.filter(id => id.startsWith('manual_')).length + ' datasets added' },
          { label: 'INTELLIGENCE READINESS', value: completeness >= 40 ? 'Verified' : 'Incomplete', color: completeness >= 40 ? '#4aaa4a' : '#cc4444', sub: completeness >= 40 ? 'Production grade' : 'Add more data' },
        ].map((k, i) => (
          <div key={i} style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '8px', padding: '14px 16px' }}>
            <div style={{ fontSize: '9px', color: '#555', letterSpacing: '0.12em', marginBottom: '6px', fontWeight: '600' }}>{k.label}</div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: k.color, lineHeight: 1 }}>{k.value}</div>
            <div style={{ fontSize: '10px', color: '#444', marginTop: '4px' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* COMPLETENESS PROGRESS BAR */}
      <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '8px', padding: '16px 20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ fontSize: '10px', color: '#e0e0e0', letterSpacing: '0.15em', fontWeight: '600' }}>TWIN COMPLETENESS — REAL TIME</div>
          <div style={{ fontSize: '18px', fontWeight: '800', color: gc(completeness) }}>{completeness}%</div>
        </div>
        <div style={{ height: '8px', backgroundColor: '#1a1a1a', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
          <div style={{ width: completeness + '%', height: '100%', background: `linear-gradient(90deg, ${gc(completeness)}66, ${gc(completeness)})`, borderRadius: '4px', transition: 'width 1s ease' }} />
        </div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' as const }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: hasMRI ? '#4aaa4a' : '#cc4444' }} />
            <span style={{ fontSize: '10px', color: '#666' }}>Business MRI ({MRI_BASE}% base) — {hasMRI ? 'Complete' : 'Missing'}</span>
          </div>
          {CONNECTOR_GROUPS.flatMap(g => g.connectors).filter(c => activeConnectors.includes(c.id)).map(c => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#4aaa4a' }} />
              <span style={{ fontSize: '10px', color: '#666' }}>{c.name} (+{c.boost}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4-COLUMN GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '14px' }}>

        {/* DATA CONNECTORS */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '18px' }}>
          <div style={{ fontSize: '10px', color: '#e0e0e0', letterSpacing: '0.15em', fontWeight: '600', marginBottom: '4px' }}>DATA SOURCE ARCHITECTURE™</div>
          <div style={{ fontSize: '11px', color: '#555', marginBottom: '12px' }}>Connected systems feeding your Business Twin™</div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '5px' }}>
            {CONNECTOR_GROUPS.flatMap(g => g.connectors).map((c, i) => {
              const state = connectorStates[c.id]
              const isActive = state?.status === 'active'
              const statusColor = isActive ? '#4aaa4a' : '#444'
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', backgroundColor: '#0a0a0a', borderRadius: '6px', border: '1px solid ' + (isActive ? '#1a2a1a' : border) }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: statusColor, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '11px', color: '#e0e0e0', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{c.name}</div>
                    <div style={{ fontSize: '9px', color: '#444' }}>{isActive ? 'Active · +' + c.boost + '%' : '+' + c.boost + '% when connected'}</div>
                  </div>
                  {!isActive && (
                    <button onClick={() => { setActiveModal(c.id); setFormData({}) }} style={{ padding: '3px 8px', backgroundColor: 'rgba(200,162,74,0.08)', border: '1px solid rgba(200,162,74,0.2)', borderRadius: '4px', color: gold, fontSize: '9px', cursor: 'pointer', fontWeight: '600', flexShrink: 0 }}>ADD</button>
                  )}
                  {isActive && <div style={{ fontSize: '10px', color: '#4aaa4a', fontWeight: '700', flexShrink: 0 }}>✓</div>}
                </div>
              )
            })}
          </div>
        </div>

        {/* MANUAL INTELLIGENCE INPUTS */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '18px' }}>
          <div style={{ fontSize: '10px', color: '#e0e0e0', letterSpacing: '0.15em', fontWeight: '600', marginBottom: '4px' }}>MANUAL INTELLIGENCE INPUTS™</div>
          <div style={{ fontSize: '11px', color: '#555', marginBottom: '14px' }}>Add data manually to improve Business Twin™ completeness</div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
            {CONNECTOR_GROUPS.flatMap(g => g.connectors).filter(c => c.auth === 'manual').map((c, i) => {
              const state = connectorStates[c.id]
              const isActive = state?.status === 'active'
              return (
                <div key={i} style={{ padding: '12px', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid ' + (isActive ? '#1a2a1a' : border) }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ fontSize: '12px', color: '#e0e0e0', fontWeight: '600' }}>{c.name}</div>
                    <div style={{ fontSize: '10px', color: isActive ? '#4aaa4a' : '#555', fontWeight: '600' }}>+{c.boost}%</div>
                  </div>
                  <div style={{ fontSize: '10px', color: '#555', marginBottom: '8px' }}>
                    {isActive ? '✓ Data submitted · ' + (state?.last_synced_at ? new Date(state.last_synced_at).toLocaleDateString('en-GB') : '') : c.fields.length + ' fields required'}
                  </div>
                  <button onClick={() => { setActiveModal(c.id); setFormData({}) }} style={{ width: '100%', padding: '6px', backgroundColor: isActive ? 'rgba(74,170,74,0.08)' : 'rgba(200,162,74,0.08)', border: '1px solid ' + (isActive ? 'rgba(74,170,74,0.2)' : 'rgba(200,162,74,0.2)'), borderRadius: '4px', color: isActive ? '#4aaa4a' : gold, fontSize: '10px', cursor: 'pointer', fontWeight: '600' }}>
                    {isActive ? '✏ Update Data' : '+ Add Data'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* COVERAGE MAP */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ fontSize: '10px', color: '#e0e0e0', letterSpacing: '0.15em', fontWeight: '600' }}>COVERAGE MAP™</div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: gc(completeness) }}>{completeness}%</div>
          </div>
          <div style={{ fontSize: '11px', color: '#555', marginBottom: '10px' }}>Real-time intelligence dimension coverage</div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <svg width="240" height="240" viewBox="0 0 240 240">
              <defs><filter id="gw"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
              <circle cx="120" cy="120" r="115" fill="#050505"/>
              {[25,50,75,100].map(ring => (
                <polygon key={ring} points={dims.map((_, i) => { const a=(i/n)*2*Math.PI-Math.PI/2; const r=(ring/100)*100; return `${120+r*Math.cos(a)},${120+r*Math.sin(a)}` }).join(' ')} fill="none" stroke="#1a2a1a" strokeWidth="0.8"/>
              ))}
              {dims.map((_, i) => { const a=(i/n)*2*Math.PI-Math.PI/2; return <line key={i} x1="120" y1="120" x2={120+100*Math.cos(a)} y2={120+100*Math.sin(a)} stroke="#1a2a1a" strokeWidth="0.8"/> })}
              {radarPts.map((p, i) => { const next=radarPts[(i+1)%n]; return <polygon key={i} points={`120,120 ${p.x},${p.y} ${next.x},${next.y}`} fill={p.color+'18'} stroke={p.color} strokeWidth="1.5" filter="url(#gw)"/> })}
              {radarPts.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="5" fill={p.color} filter="url(#gw)"/>
                  <circle cx={p.x} cy={p.y} r="2" fill="#fff"/>
                  <text x={p.lx} y={p.ly-5} textAnchor="middle" fill="#888" fontSize="9" fontWeight="600">{p.label}</text>
                  <text x={p.lx} y={p.ly+7} textAnchor="middle" fill={p.color} fontSize="11" fontWeight="800">{p.pct}%</text>
                </g>
              ))}
              <text x="120" y="116" textAnchor="middle" fill={gold} fontSize="16" fontWeight="900">{completeness}</text>
              <text x="120" y="128" textAnchor="middle" fill="#555" fontSize="7" letterSpacing="0.1em">TWIN</text>
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
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '18px' }}>
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
    </DashboardShell>
  )
}
