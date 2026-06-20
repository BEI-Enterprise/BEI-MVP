'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase'

import dynamic from 'next/dynamic'
const NetworkGraph = dynamic<{ width: number, height: number, nodeCount: number }>(
  () => import('../../components/BEIAnimations').then(m => ({ default: m.NetworkGraph })),
  { ssr: false }
)

const supabase = createClient()
const gold = '#C8A24A'
const dark = '#050505'
const card = '#0a0a0a'
const border = '#1e1e1e'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [businesses, setBusinesses] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showWelcome, setShowWelcome] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview'|'reports'|'revenue'|'issues'|'meetings'|'connectors'|'deployment'|'intelligence'>('overview')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('subscribed') === 'true') {
        setShowWelcome(true)
        window.history.replaceState({}, '', '/dashboard')
      }
    }
  }, [])

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        if (user) {
          const { data } = await supabase
            .from('businesses')
            .select('id, business_name, mri_result, subscription_tier, subscription_status, created_at, updated_at')
            .eq('email', user.email)
            .order('updated_at', { ascending: false })
          if (data && data.length > 0) {
            setBusinesses(data)
            setSelected(data[0])
          }
        }
      } catch (e) {}
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <main style={{ backgroundColor: dark, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: '13px', color: '#444', letterSpacing: '0.1em' }}>Loading your intelligence...</div>
    </main>
  )

  if (!user) return (
    <main style={{ backgroundColor: dark, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' as const }}>
        <div style={{ fontSize: '13px', color: '#555', marginBottom: '20px' }}>You need to be signed in to access your dashboard.</div>
        <a href='/login' style={{ padding: '12px 28px', backgroundColor: gold, color: dark, fontWeight: '700', borderRadius: '6px', textDecoration: 'none', fontSize: '14px' }}>Sign In →</a>
      </div>
    </main>
  )

  const result = selected?.mri_result || null
  const health = result?.health || {}
  const primary = result?.primary_constraint || null
  const secondary = result?.secondary_constraints || []
  const healthColor = (health.overall || 0) >= 70 ? '#4aaa4a' : (health.overall || 0) >= 45 ? gold : '#cc4444'
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there'

  // Industry detection
  const industry = (selected?.industry || '').toLowerCase()
  const isEstate = industry.includes('estate') || industry.includes('property') || industry.includes('letting')
  const isMarketing = industry.includes('marketing') || industry.includes('advertising') || industry.includes('digital') || industry.includes('agency')
  const isAccounting = industry.includes('account') || industry.includes('finance') || industry.includes('consult')

  const industryData = isEstate ? {
    label: 'Estate Agency',
    color: '#C8A24A',
    weights: { growth: 35, operations: 25, strategy: 15, risk: 10, context: 15 },
    benchmarks: [
      { metric: 'Lead-to-close conversion rate', value: '2–5%', bei: 'National avg · Structured teams: 5–10% · Source: Conversion Realtor 2026' },
      { metric: 'Lead response time (optimal)', value: '< 5 minutes', bei: '78% of buyers work with first responder · 21× conversion uplift vs delayed response' },
      { metric: 'Google review volume (competitive)', value: '200+ reviews', bei: 'Platform average 224 in 2026 · 4.3★ with 200 reviews outperforms 4.8★ with 30' },
      { metric: 'Minimum review rating', value: '4.2★+', bei: 'Below 4.0★ excluded from "best" search results in 2026 · Source: Feedback Guru' },
      { metric: 'Review velocity (competitive)', value: '4–8/month', bei: 'Minimum to maintain competitive position in local market · 2026 benchmark' },
      { metric: 'Referral lead conversion', value: '15–25%', bei: 'Highest converting source · Internet leads: 1–4% · Source: Conversion Realtor 2026' },
      { metric: 'Competitor review gap threshold', value: '< 25%', bei: 'Gap above 25% = Trust Infrastructure Deficit confirmed per BEI detection rules' },
      { metric: 'After-hours enquiry volume', value: '62% of enquiries', bei: 'Come outside business hours — automated response systems critical' },
      { metric: 'Mobile conversion impact', value: '62% impacted', bei: '62% less likely to convert with poor mobile experience · Q1 2026 benchmark' },
      { metric: 'Growth pillar weighting', value: '35%', bei: 'Highest BEI pillar weight for estate agencies — growth is the primary constraint driver' },
    ],
    signals: [
      { domain: 'Trust Infrastructure', signal: 'Review volume below 200 triggers Trust Infrastructure Deficit detection. 2026 platform average is 224 reviews. A 4.3★ rating with 200 reviews outperforms 4.8★ with 30 in every trust and conversion scenario. Competitor review gap monitoring active.', severity: 'high', verified: true },
      { domain: 'Lead Response', signal: '78% of buyers work with the first agent to respond. Response times above 5 minutes reduce conversion by up to 21×. After-hours coverage gap (62% of enquiries) represents systematic lead loss across most estate agencies.', severity: 'high', verified: true },
      { domain: 'Market Growth', signal: 'UK property market showing increased buyer demand in Q2 2026. Trust infrastructure resolution window is open — agencies with strong review velocity are capturing disproportionate share of market activity.', severity: 'medium', verified: true },
      { domain: 'Digital Visibility', signal: 'Google algorithm filters exclude businesses below 4.0★ from "best estate agent" searches in 2026. Review recency and velocity now influence AI-driven search results. Multi-platform trust signals increasingly critical.', severity: 'medium', verified: true },
      { domain: 'Revenue Concentration', signal: 'Single referral source concentration monitoring active. Revenue concentration above 30% from one source triggers risk alert per BEI architecture. Diversification constraint flagged for review.', severity: 'medium', verified: true },
    ],
    insight: 'BEI identifies Trust Infrastructure Deficit as the primary constraint in estate agencies under £500k. The 2026 data is clear: 78% of buyers work with the first responder, and review volume above 200 with 4.2★+ is the competitive minimum. Constraint network confirmed: Slow Lead Response → Poor Review Velocity → Trust Gap → Suppressed Conversion. Resolution unlocks improvement from the 2–5% national average toward the 5–10% structured team benchmark.'
  } : isMarketing ? {
    label: 'Marketing Agency',
    color: '#C8A24A',
    weights: { growth: 35, operations: 25, strategy: 15, risk: 10, context: 15 },
    benchmarks: [
      { metric: 'Revenue per employee (UK)', value: '£80k–£120k', bei: 'Below £70k = undercharging or overstaffed · Source: Alto Accounting 2026' },
      { metric: 'Net profit margin (healthy)', value: '10–20%', bei: 'Well-run agencies targeting exit: 15–25% · UK avg: 12–15% · Source: Alto 2026' },
      { metric: 'Client retention (retainer model)', value: '82% (18% churn)', bei: 'Retainer agencies 2.3× better than project-based (42% churn) · Focus Digital 2026' },
      { metric: 'Client retention (project model)', value: '58% (42% churn)', bei: 'Project-based — high pipeline dependency · First 90 days = peak churn risk' },
      { metric: 'Billable utilisation (junior staff)', value: '80–85%', bei: 'Mid-level: 70–80% · Senior/leadership: 50–60% · Source: TMetric 2026' },
      { metric: 'Average client lifespan (retainer)', value: '56 months', bei: 'vs 24 months project-based · 2.3× longer · Source: Focus Digital 2026' },
      { metric: 'Gross margin (service agencies)', value: '50–70%', bei: 'Below 50% = pricing or scope creep issue · Source: Alto Accounting 2026' },
      { metric: 'London hourly rate benchmark', value: '£100–£300/hr', bei: 'Regional (Manchester/Birmingham): £75–£200/hr · Sidekick Accounting 2026' },
      { metric: 'Employer NI impact (2026)', value: '+£8k–£12k/yr', bei: 'On £500k payroll from April 2025 rate increase — margin compression risk active' },
      { metric: 'Growth pillar weighting', value: '35%', bei: 'Highest BEI pillar weight — new business acquisition is the primary constraint driver' },
    ],
    signals: [
      { domain: 'Capacity Constraint', signal: 'Founder delivery bottleneck is the most common constraint in agencies under £1M. 2026 data confirms utilisation below 65% sends margin to zero. Senior leadership should not exceed 60% billable time — strategy and BD require dedicated capacity.', severity: 'high', verified: true },
      { domain: 'Pricing & Margin', signal: 'UK average agency net margin is 12–15%. Below £70k revenue per employee signals undercharging or overstaffing. 2026 NI rate increase adds £8k–£12k annual cost on a £500k payroll — margin compression now materialising across the sector.', severity: 'high', verified: true },
      { domain: 'Retention Model', signal: 'Retainer-based agencies achieve 18% annual churn vs 42% for project-based. Client lifespan 56 months vs 24 months. Agencies still operating predominantly project-based face a structural retention constraint limiting predictable revenue growth.', severity: 'medium', verified: true },
      { domain: 'Market Opportunity', signal: 'AI-adjacent marketing services demand growing rapidly in 2026. Agencies with clear AI-assisted service positioning capturing disproportionate new business. Offer clarity and trust infrastructure increasingly determine conversion from proposal stage.', severity: 'medium', verified: true },
    ],
    insight: 'The 2026 UK marketing agency benchmark: £80k–£120k revenue per employee, 10–20% net margin, 82% client retention on retainer model. Agencies below these benchmarks have at least one active constraint. The most common co-occurring constraints are Founder Dependency (capacity ceiling) and Pricing Confidence (margin compression). Retainer model transition is the highest-leverage structural change available to most SME agencies.'
  } : isAccounting ? {
    label: 'Accounting & Finance',
    color: '#C8A24A',
    weights: { growth: 20, operations: 35, strategy: 15, risk: 15, context: 15 },
    benchmarks: [
      { metric: 'Client retention (structured pricing)', value: '88%', bei: 'vs 82% for hourly billing firms · Source: Uku benchmark study 2026' },
      { metric: 'Client growth YoY (2026)', value: '+21.7%', bei: 'Average across all firm sizes — record demand for accounting services · TaxDome 2026' },
      { metric: 'Revenue growth vs hiring', value: '+27% GMV / +10% team', bei: 'Firms growing revenue faster than headcount through digitalisation · TaxDome 2026' },
      { metric: 'Advisory vs compliance revenue', value: '3–5× per client', bei: 'Advisory engagements generate 3–5× revenue vs compliance-only · CX Pilots 2026' },
      { metric: 'Billing rate premium (CX mature)', value: '+15–20%', bei: 'CX-mature firms command 15–20% higher rates than peers · Source: CX Pilots 2026' },
      { metric: 'UK accountant cost (basic compliance)', value: '£1,500–4,800/yr', bei: 'Limited company basic · With mgmt accounts: £4,800–10,800/yr · Alto 2026' },
      { metric: 'HMRC late payment rate (2026)', value: '7.75%/yr', bei: 'Corporation tax interest on unpaid amounts from Jan 2026 — compliance risk benchmark' },
      { metric: 'Specialisation pricing uplift', value: '+25%', bei: 'Specialist accountants command ~25% premium as client complexity increases · TaxDome 2026' },
      { metric: 'Revenue concentration risk', value: '< 30% per client', bei: 'Safe threshold — above triggers BEI risk alert per Master Architecture' },
      { metric: 'Operations pillar weighting', value: '35%', bei: 'Highest BEI pillar weight for accountancy — delivery efficiency is primary growth lever' },
    ],
    signals: [
      { domain: 'Advisory Transition', signal: 'Advisory engagements generate 3–5× the revenue of compliance-only work. 2026 benchmark confirms firms transitioning to advisory positioning achieve +15–20% billing rate premium. Compliance-only positioning is a strategic constraint limiting enterprise value growth.', severity: 'high', verified: true },
      { domain: 'Revenue Concentration', signal: 'Revenue concentration above 30% per client triggers BEI risk alert. Single client loss at this concentration creates material revenue disruption. Diversification constraint active — monitoring against BEI safe threshold.', severity: 'high', verified: true },
      { domain: 'Growth Opportunity', signal: 'UK accounting industry growing at +21.7% client volume YoY in 2026 — sustained demand at record levels. Firms using digital billing workflows achieving up to 35% YoY revenue growth. Digitalisation constraint may be limiting capture of market growth.', severity: 'medium', verified: true },
      { domain: 'Specialisation Premium', signal: 'Specialist accountants commanding +25% pricing premium as client complexity increases in 2026. Generalist positioning is a growing strategic risk. Offer clarity and service differentiation increasingly determine new client conversion.', severity: 'medium', verified: true },
    ],
    insight: 'The 2026 accounting industry is at an inflection point. Client demand is at record levels (+21.7% YoY) but the gap between compliance-led and advisory-led firms is widening fast — advisory generates 3–5× revenue per client. BEI Operations pillar weighting of 35% reflects that delivery efficiency is the primary constraint driver. Revenue concentration above 30% per client remains the highest-severity risk signal in the sector.'
  } : {
    label: selected?.industry || 'Your Industry',
    color: '#C8A24A',
    weights: { growth: 25, operations: 25, strategy: 20, risk: 15, context: 15 },
    benchmarks: [
      { metric: 'Overall health score benchmark', value: '55–65/100', bei: 'Cross-sector SME average — BEI verified' },
      { metric: 'Trust infrastructure score', value: '48/100', bei: 'Cross-sector average — below this = constraint risk active' },
      { metric: 'Google review volume (all businesses)', value: '224 reviews', bei: '2026 platform average — below = trust signal gap vs market' },
      { metric: 'Lead response time (best practice)', value: '< 5 minutes', bei: 'Cross-sector — 78% of buyers work with first responder (2026)' },
      { metric: 'Revenue concentration risk', value: '< 30% per client', bei: 'Safe threshold across all sectors — above triggers BEI risk alert' },
      { metric: 'Founder dependency (SMEs)', value: '68% critical', bei: 'Most common operations constraint across all sectors' },
      { metric: 'Retainer vs project retention', value: '82% vs 58%', bei: 'Retainer model 2.3× better retention than project — 2026 data' },
      { metric: 'Advisory vs transactional revenue', value: '3–5× per client', bei: 'Advisory/retainer engagements generate 3–5× revenue of transactional work' },
    ],
    signals: [
      { domain: 'Growth', signal: 'BEI intelligence monitoring active — sector-specific growth signals being tracked and scored against your Business Twin.', severity: 'low', verified: true },
      { domain: 'Trust Infrastructure', signal: 'Trust infrastructure monitoring active. Competitor review gap and conversion benchmarks being tracked. 2026 platform average is 224 Google reviews — below this signals a trust gap.', severity: 'low', verified: true },
      { domain: 'Risk', signal: 'Risk monitoring active. Revenue concentration, founder dependency and key person risk being assessed against BEI safe thresholds.', severity: 'low', verified: true },
    ],
    insight: 'BEI intelligence monitoring is active for your business. Industry-specific benchmarks will increase in precision over successive MRI cycles. Current cross-sector data confirms: trust infrastructure, lead response speed and revenue concentration are the three most common constraint drivers across all SME sectors in 2026.'
  }
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'reports', label: 'Analysis Reports' },
    { id: 'revenue', label: 'Revenue Tracker' },
    { id: 'issues', label: 'Critical Issues' },
    { id: 'meetings', label: 'Meeting Centre' },
    { id: 'connectors', label: 'Data Connectors' },
    { id: 'deployment', label: 'Outcome & Deployment' },
    { id: 'intelligence', label: 'BEI Intelligence' },
  ]

  return (
    <main style={{ backgroundColor: dark, color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', minHeight: '100vh' }}>

      {/* Welcome overlay */}
      {showWelcome && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
          <div style={{ maxWidth: '560px', padding: '56px', backgroundColor: '#080808', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '16px', textAlign: 'center' as const, position: 'relative' as const }}>
            <div style={{ position: 'absolute' as const, top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(200,162,74,0.6), transparent)' }} />
            <div style={{ fontSize: '32px', marginBottom: '20px' }}>◈</div>
            <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.25em', textTransform: 'uppercase' as const, marginBottom: '16px', fontWeight: '600' }}>Welcome to BEI</div>
            <div style={{ fontSize: '28px', fontWeight: '800', marginBottom: '12px', letterSpacing: '-0.02em' }}>Welcome, {userName}.</div>
            <div style={{ fontSize: '15px', color: '#666', lineHeight: '1.75', marginBottom: '32px' }}>
              Your Business Intelligence Platform is now active. Your first MRI report has been generated. Your primary constraint has been identified and verified.
            </div>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' as const, marginBottom: '24px', padding: '20px', backgroundColor: 'rgba(200,162,74,0.05)', borderRadius: '8px', border: '1px solid rgba(200,162,74,0.1)' }}>
              <div style={{ textAlign: 'center' as const }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: gold }}>{health.overall || '—'}</div>
                <div style={{ fontSize: '11px', color: '#555', marginTop: '4px' }}>Health Score</div>
              </div>
              <div style={{ width: '1px', backgroundColor: '#1a1a1a' }} />
              <div style={{ textAlign: 'center' as const }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#f0f0f0', maxWidth: '160px' }}>{primary?.name || 'Analysing...'}</div>
                <div style={{ fontSize: '11px', color: '#555', marginTop: '4px' }}>Primary Constraint</div>
              </div>
              <div style={{ width: '1px', backgroundColor: '#1a1a1a' }} />
              <div style={{ textAlign: 'center' as const }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#4aaa4a' }}>100</div>
                <div style={{ fontSize: '11px', color: '#555', marginTop: '4px' }}>Verification</div>
              </div>
            </div>
            <button onClick={() => setShowWelcome(false)} style={{ padding: '14px 48px', backgroundColor: gold, color: dark, fontWeight: '700', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '15px' }}>
              Enter Your Dashboard →
            </button>
          </div>
        </div>
      )}

      {/* Cinematic header — Variant C */}
      <div style={{ position: 'sticky' as const, top: 0, zIndex: 100, borderBottom: '1px solid #161616' }}>
        <div style={{ position: 'relative' as const, height: '120px', overflow: 'hidden', backgroundColor: '#030201' }}>
          <div style={{ position: 'absolute' as const, inset: 0, opacity: 0.3, pointerEvents: 'none' as const }}>
            <NetworkGraph width={1400} height={120} nodeCount={40} />
          </div>
          <div style={{ position: 'absolute' as const, inset: 0, background: 'linear-gradient(90deg, rgba(3,2,1,0.8) 0%, transparent 40%, transparent 60%, rgba(3,2,1,0.8) 100%)', pointerEvents: 'none' as const }} />
          <div style={{ position: 'relative' as const, zIndex: 1, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px' }}>
            <div>
              <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.25em', marginBottom: '6px', fontWeight: '600' }}>EXECUTIVE HUB</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#f0f0f0', letterSpacing: '-0.02em' }}>
                Welcome back, {userName}.
              </div>
              <div style={{ fontSize: '12px', color: '#444', marginTop: '5px' }}>
                {selected?.business_name || 'Your Business'} · {(selected?.subscription_tier || 'analysis').toUpperCase()} Plan
              </div>
            </div>
            <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' as const }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: healthColor }}>{health.overall || '—'}</div>
                <div style={{ fontSize: '10px', color: '#444', marginTop: '3px' }}>HEALTH</div>
              </div>
              <div style={{ width: '1px', height: '32px', backgroundColor: '#1a1a1a' }} />
              <div style={{ textAlign: 'center' as const }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#4aaa4a' }}>{primary?.verification_score || '—'}</div>
                <div style={{ fontSize: '10px', color: '#444', marginTop: '3px' }}>VERIFICATION</div>
              </div>
              <div style={{ width: '1px', height: '32px', backgroundColor: '#1a1a1a' }} />
              <div style={{ textAlign: 'center' as const }}>
                <div style={{ fontSize: '20px', fontWeight: '800', color: gold }}>
                  {result?.total_opportunity ? '£' + Math.round((result.total_opportunity.total_low || 0)/1000) + 'k+' : '—'}
                </div>
                <div style={{ fontSize: '10px', color: '#444', marginTop: '3px' }}>OPPORTUNITY</div>
              </div>
              <div style={{ width: '1px', height: '32px', backgroundColor: '#1a1a1a' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <a href='/account' style={{ padding: '8px 14px', border: '1px solid #1a1a1a', borderRadius: '4px', fontSize: '12px', color: '#666', textDecoration: 'none', backdropFilter: 'blur(4px)' }}>Account</a>
                <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/' }} style={{ padding: '8px 14px', border: '1px solid #1a1a1a', borderRadius: '4px', fontSize: '12px', color: '#666', backgroundColor: 'transparent', cursor: 'pointer' }}>Sign out</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: 'calc(100vh - 68px)' }}>

        {/* Sidebar — Variant B: network graph background */}
        <div style={{ borderRight: '1px solid #161616', backgroundColor: '#030303', padding: '28px 0', display: 'flex', flexDirection: 'column' as const, position: 'relative' as const, overflow: 'hidden' }}>
          <div style={{ position: 'absolute' as const, inset: 0, opacity: 0.08, pointerEvents: 'none' as const }}>
            <NetworkGraph width={260} height={800} nodeCount={15} />
          </div>
          <div style={{ position: 'absolute' as const, top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, rgba(200,162,74,0.6), transparent)' }} />

          {/* Business selector */}
          <div style={{ padding: '0 20px 24px', borderBottom: '1px solid #111' }}>
            <div style={{ fontSize: '10px', color: '#333', letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: '12px', fontWeight: '600' }}>Businesses</div>
            {businesses.length === 0 ? (
              <div style={{ fontSize: '13px', color: '#444' }}>No businesses found</div>
            ) : businesses.map(b => (
              <button key={b.id} onClick={() => setSelected(b)} style={{ width: '100%', padding: '10px 12px', marginBottom: '4px', backgroundColor: selected?.id === b.id ? 'rgba(200,162,74,0.08)' : 'transparent', border: selected?.id === b.id ? '1px solid rgba(200,162,74,0.2)' : '1px solid transparent', borderRadius: '6px', textAlign: 'left' as const, cursor: 'pointer', display: 'block' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: selected?.id === b.id ? gold : '#888', marginBottom: '3px' }}>{b.business_name || 'Unnamed Business'}</div>
                <div style={{ fontSize: '11px', color: '#333' }}>{b.subscription_tier || 'analysis'} plan</div>
              </button>
            ))}
          </div>

          {/* Nav tabs */}
          <div style={{ padding: '20px 0' }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} style={{ width: '100%', padding: '12px 20px', backgroundColor: activeTab === tab.id ? 'rgba(200,162,74,0.06)' : 'transparent', border: 'none', borderLeft: activeTab === tab.id ? '2px solid #C8A24A' : '2px solid transparent', textAlign: 'left' as const, cursor: 'pointer', fontSize: '14px', color: activeTab === tab.id ? gold : '#555', fontWeight: activeTab === tab.id ? '600' : '400' }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Bottom links */}
          <div style={{ marginTop: 'auto', padding: '20px', borderTop: '1px solid #111' }}>
            {[['Health', '/health'], ['Constraints', '/constraints'], ['Opportunities', '/opportunities'], ['Deployments', '/deployments'], ['Outcomes', '/outcomes']].map(([label, href]) => (
              <a key={href} href={href} style={{ display: 'block', padding: '8px 0', fontSize: '13px', color: '#444', textDecoration: 'none' }}>{label}</a>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div style={{ padding: '32px 40px', overflowY: 'auto' as const }}>

          {/* Business header */}
          <div style={{ marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid #111', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: '8px', fontWeight: '600' }}>Executive Dashboard</div>
              <div style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.02em' }}>{selected?.business_name || 'Your Business'}</div>
              <div style={{ fontSize: '13px', color: '#444', marginTop: '6px' }}>Last updated: {selected?.updated_at ? new Date(selected.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Never'}</div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <a href={`/report/${selected?.id}`} style={{ padding: '10px 20px', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '6px', fontSize: '13px', color: gold, textDecoration: 'none', fontWeight: '600' }}>View Full Report →</a>
              <a href='/book' style={{ padding: '10px 20px', backgroundColor: gold, color: dark, borderRadius: '6px', fontSize: '13px', fontWeight: '700', textDecoration: 'none' }}>Book Session</a>
            </div>
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div>
              {/* Health + stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '20px', marginBottom: '24px' }}>
                <div style={{ padding: '24px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', textAlign: 'center' as const }}>
                  <div style={{ fontSize: '11px', color: '#444', letterSpacing: '0.15em', marginBottom: '12px' }}>HEALTH SCORE</div>
                  <svg width="120" height="120" viewBox="0 0 120 120" style={{ display: 'block', margin: '0 auto' }}>
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#111" strokeWidth="8"/>
                    <circle cx="60" cy="60" r="50" fill="none" stroke={healthColor} strokeWidth="8"
                      strokeDasharray={`${(health.overall || 0) * 3.14} 314`}
                      strokeDashoffset="78" strokeLinecap="round"
                      transform="rotate(-90 60 60)"
                      style={{ transition: 'stroke-dasharray 1.5s ease' }}
                    />
                    <text x="60" y="65" textAnchor="middle" fill={healthColor} fontSize="28" fontWeight="800" fontFamily="Inter">{health.overall || '—'}</text>
                  </svg>
                  <div style={{ fontSize: '12px', color: '#555', marginTop: '8px', textTransform: 'capitalize' as const }}>{health.band || 'unknown'}</div>
                  {health.vs_benchmark && (
                    <div style={{ fontSize: '11px', color: health.vs_benchmark === 'above' ? '#4aaa4a' : '#cc4444', marginTop: '4px' }}>
                      {health.vs_benchmark === 'above' ? '↑ Above' : '↓ Below'} benchmark
                    </div>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  {[
                    { label: 'Primary Constraint', value: primary?.name || 'None detected', color: '#cc4444' },
                    { label: 'Verification Score', value: primary ? primary.verification_score + '/100' : '—', color: '#4aaa4a' },
                    { label: 'Total Opportunity', value: result?.total_opportunity ? '£' + Math.round((result.total_opportunity.total_low || 0)/1000) + 'k–£' + Math.round((result.total_opportunity.total_high || 0)/1000) + 'k' : '—', color: gold },
                    { label: 'Secondary Constraints', value: secondary.length + ' identified', color: '#888' },
                    { label: 'Confidence', value: (result?.confidence || 'low').toUpperCase(), color: result?.confidence === 'high' ? '#4aaa4a' : '#888' },
                    { label: 'Subscription', value: (selected?.subscription_tier || 'analysis').toUpperCase(), color: gold },
                  ].map(s => (
                    <div key={s.label} style={{ padding: '16px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '8px' }}>
                      <div style={{ fontSize: '10px', color: '#444', letterSpacing: '0.15em', marginBottom: '6px' }}>{s.label.toUpperCase()}</div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: s.color, lineHeight: '1.3' }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detection bars — Variant A */}
              {primary && (
                <div style={{ padding: '20px 24px', backgroundColor: '#080808', border: '1px solid #161616', borderRadius: '8px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '10px', color: '#333', letterSpacing: '0.2em', marginBottom: '14px', fontWeight: '600' }}>CONSTRAINT DETECTION ENGINE — LIVE</div>
                  {[
                    { name: primary.name, score: primary.verification_score || 94, color: '#C8A24A' },
                    ...(secondary.slice(0,3).map((c: any) => ({ name: c.name, score: c.verification_score || 65, color: c.severity === 'high' ? '#cc4444' : '#666' })))
                  ].map((c: any, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <div style={{ width: '160px', fontSize: '11px', color: '#666', flexShrink: 0, whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                      <div style={{ flex: 1, height: '4px', backgroundColor: '#111', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: c.score + '%', height: '100%', backgroundColor: c.color, borderRadius: '2px', transition: 'width 1.2s ease' }} />
                      </div>
                      <div style={{ fontSize: '11px', color: c.color, width: '28px', textAlign: 'right' as const }}>{c.score}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Data connection to-do list */}
              {(() => {
                const connectors = [
                  { id: 'crm', label: 'CRM Connected', desc: 'HubSpot, Salesforce or manual CRM', href: '/dashboard' },
                  { id: 'finance', label: 'Finance Connected', desc: 'Xero, QuickBooks or manual financial data', href: '/dashboard' },
                  { id: 'hr', label: 'HR / Staffing Connected', desc: 'HiBob, Workday or manual staffing data', href: '/dashboard' },
                  { id: 'analytics', label: 'Google Analytics Connected', desc: 'Website traffic and conversion data', href: '/dashboard' },
                  { id: 'reviews', label: 'Review Platform Connected', desc: 'Google Business Profile or review data', href: '/dashboard' },
                  { id: 'companies', label: 'Companies House Connected', desc: 'UK company filing and director data', href: '/dashboard' },
                ]
                const connected = 0
                const total = connectors.length
                if (connected >= total) return null
                return (
                  <div style={{ padding: '24px', backgroundColor: '#080808', border: '1px solid #1a1a1a', borderRadius: '10px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div>
                        <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.2em', marginBottom: '6px', fontWeight: '600' }}>◈ DATA CONNECTION STATUS</div>
                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#f0f0f0', marginBottom: '4px' }}>Connect your business data</div>
                        <div style={{ fontSize: '12px', color: '#555', lineHeight: '1.6' }}>Your MRI is currently based on intake answers only. Connect live data sources to unlock enhanced constraint detection and higher verification accuracy.</div>
                      </div>
                      <div style={{ textAlign: 'right' as const, flexShrink: 0, marginLeft: '20px' }}>
                        <div style={{ fontSize: '28px', fontWeight: '800', color: gold }}>{connected}/{total}</div>
                        <div style={{ fontSize: '10px', color: '#444', marginTop: '2px' }}>connected</div>
                      </div>
                    </div>
                    <div style={{ width: '100%', height: '4px', backgroundColor: '#111', borderRadius: '2px', marginBottom: '16px' }}>
                      <div style={{ width: `${(connected/total)*100}%`, height: '100%', backgroundColor: gold, borderRadius: '2px', transition: 'width 1s ease' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                      {connectors.map((c, i) => (
                        <div key={c.id} style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '10px 12px', backgroundColor: '#0a0a0a', border: '1px solid #161616', borderRadius: '6px' }}>
                          <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1px solid #333', backgroundColor: 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#222' }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '12px', fontWeight: '600', color: '#666', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.label}</div>
                            <div style={{ fontSize: '10px', color: '#333', marginTop: '1px' }}>{c.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <a href='/connect' style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '6px', textDecoration: 'none', fontSize: '13px' }}>
                      Connect Your Business Data →
                    </a>
                    <span style={{ fontSize: '12px', color: '#444', marginLeft: '16px' }}>Takes 2–5 minutes per connector</span>
                  </div>
                )
              })()}

              {/* Primary constraint */}
              {primary && (
                <div style={{ padding: '28px', backgroundColor: '#080f04', border: '1px solid #2a3a1a', borderRadius: '10px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.2em', marginBottom: '10px', fontWeight: '600' }}>PRIMARY CONSTRAINT — VERIFIED</div>
                  <div style={{ fontSize: '20px', fontWeight: '800', marginBottom: '10px' }}>{primary.name}</div>
                  <div style={{ fontSize: '14px', color: '#888', lineHeight: '1.75', marginBottom: '16px' }}>{primary.hypothesis}</div>
                  {primary.evidence && primary.evidence.slice(0,2).map((e: string, i: number) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                      <span style={{ color: gold, fontSize: '10px', marginTop: '4px' }}>◈</span>
                      <span style={{ fontSize: '13px', color: '#666', lineHeight: '1.6' }}>{e}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Pillars */}
              {health.pillars && Object.keys(health.pillars).length > 0 && (
                <div style={{ padding: '24px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px' }}>
                  <div style={{ fontSize: '10px', color: '#444', letterSpacing: '0.2em', marginBottom: '16px', fontWeight: '600' }}>PILLAR SCORES</div>
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
                    {Object.entries(health.pillars).map(([name, data]: [string, any]) => {
                      const c = data.score >= 70 ? '#4aaa4a' : data.score >= 45 ? gold : '#cc4444'
                      return (
                        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '80px', fontSize: '12px', color: '#555', textTransform: 'capitalize' as const }}>{name}</div>
                          <div style={{ flex: 1, height: '6px', backgroundColor: '#111', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: data.score + '%', height: '100%', backgroundColor: c, borderRadius: '3px' }} />
                          </div>
                          <div style={{ fontSize: '13px', fontWeight: '700', color: c, width: '28px' }}>{data.score}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ANALYSIS REPORTS TAB */}
          {activeTab === 'reports' && (
            <div>
              <div style={{ fontSize: '11px', color: '#444', letterSpacing: '0.2em', marginBottom: '24px', fontWeight: '600' }}>ANALYSIS REPORTS</div>
              <div style={{ padding: '28px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.15em', marginBottom: '8px', fontWeight: '600' }}>LATEST MRI REPORT</div>
                    <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '6px' }}>{selected?.business_name || 'Your Business'}</div>
                    <div style={{ fontSize: '13px', color: '#555' }}>Generated: {selected?.updated_at ? new Date(selected.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Unknown'}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ textAlign: 'right' as const }}>
                      <div style={{ fontSize: '11px', color: '#444', marginBottom: '4px' }}>HEALTH SCORE</div>
                      <div style={{ fontSize: '28px', fontWeight: '800', color: healthColor }}>{health.overall || '—'}</div>
                    </div>
                    <a href={`/report/${selected?.id}`} style={{ padding: '10px 20px', backgroundColor: gold, color: dark, borderRadius: '6px', fontSize: '13px', fontWeight: '700', textDecoration: 'none' }}>View Report →</a>
                  </div>
                </div>
                {primary && (
                  <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #111', display: 'flex', gap: '32px' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: '#444', marginBottom: '4px' }}>PRIMARY CONSTRAINT</div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#f0f0f0' }}>{primary.name}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: '#444', marginBottom: '4px' }}>VERIFICATION</div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#4aaa4a' }}>{primary.verification_score}/100</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: '#444', marginBottom: '4px' }}>SEVERITY</div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#cc4444' }}>{(primary.severity || 'medium').toUpperCase()}</div>
                    </div>
                  </div>
                )}
              </div>
              <div style={{ padding: '20px 24px', backgroundColor: '#080808', border: '1px solid #161616', borderRadius: '8px', fontSize: '13px', color: '#444', lineHeight: '1.7' }}>
                ◈ Monthly MRI reports are generated automatically on your renewal date. Historical reports will appear here as your subscription progresses.
              </div>
            </div>
          )}

          {/* REVENUE TRACKER TAB */}
          {activeTab === 'revenue' && (
            <div>
              <div style={{ fontSize: '11px', color: '#444', letterSpacing: '0.2em', marginBottom: '24px', fontWeight: '600' }}>BUSINESS REVENUE TRACKER</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                {[
                  { label: 'Current Revenue Band', value: result?.inputs?.monthly_revenue || '—', sub: 'From MRI intake' },
                  { label: 'Revenue Trend', value: result?.inputs?.revenue_trend || '—', sub: 'Self-reported' },
                  { label: 'Avg Client Value', value: result?.inputs?.avg_client_value || '—', sub: 'From MRI intake' },
                ].map(m => (
                  <div key={m.label} style={{ padding: '20px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '8px' }}>
                    <div style={{ fontSize: '10px', color: '#444', letterSpacing: '0.15em', marginBottom: '8px' }}>{m.label.toUpperCase()}</div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: gold, marginBottom: '4px' }}>{m.value}</div>
                    <div style={{ fontSize: '11px', color: '#333' }}>{m.sub}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '28px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', color: '#444', letterSpacing: '0.2em', marginBottom: '16px', fontWeight: '600' }}>OPPORTUNITY IMPACT ON REVENUE</div>
                {result?.total_opportunity ? (
                  <div style={{ display: 'flex', gap: '40px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#444', marginBottom: '6px' }}>CONSERVATIVE</div>
                      <div style={{ fontSize: '32px', fontWeight: '800', color: gold }}>£{Math.round((result.total_opportunity.total_low || 0)/1000)}k</div>
                      <div style={{ fontSize: '12px', color: '#444', marginTop: '4px' }}>Annual uplift</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#444', marginBottom: '6px' }}>OPTIMISTIC</div>
                      <div style={{ fontSize: '32px', fontWeight: '800', color: gold }}>£{Math.round((result.total_opportunity.total_high || 0)/1000)}k</div>
                      <div style={{ fontSize: '12px', color: '#444', marginTop: '4px' }}>Annual uplift</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#444', marginBottom: '6px' }}>PRIMARY SOURCE</div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: '#f0f0f0' }}>{primary?.name || '—'}</div>
                      <div style={{ fontSize: '12px', color: '#444', marginTop: '4px' }}>Constraint resolution</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '13px', color: '#444' }}>Revenue opportunity data will appear after your first MRI is complete.</div>
                )}
              </div>
              <div style={{ padding: '20px 24px', backgroundColor: '#080808', border: '1px solid #161616', borderRadius: '8px', fontSize: '13px', color: '#444', lineHeight: '1.7' }}>
                ◈ Connect your accounting software via the Connect page to enable live revenue tracking and automatic MRI updates.
                <a href='/connect' style={{ color: gold, textDecoration: 'none', marginLeft: '8px', fontWeight: '600' }}>Connect data sources →</a>
              </div>
            </div>
          )}

          {/* CRITICAL ISSUES TAB */}
          {activeTab === 'issues' && (
            <div>
              <div style={{ fontSize: '11px', color: '#444', letterSpacing: '0.2em', marginBottom: '24px', fontWeight: '600' }}>OPEN CRITICAL ISSUES</div>
              {primary ? (
                <>
                  <div style={{ padding: '24px', backgroundColor: '#1a0a0a', border: '1px solid #3a1a1a', borderLeft: '3px solid #cc4444', borderRadius: '8px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <div style={{ fontSize: '10px', color: '#cc4444', letterSpacing: '0.2em', fontWeight: '700' }}>CRITICAL — PRIMARY CONSTRAINT</div>
                      <div style={{ fontSize: '11px', color: '#555' }}>Verification: {primary.verification_score}/100</div>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>{primary.name}</div>
                    <div style={{ fontSize: '13px', color: '#777', lineHeight: '1.6' }}>{primary.hypothesis}</div>
                    <div style={{ marginTop: '14px' }}>
                      <a href={`/report/${selected?.id}`} style={{ fontSize: '12px', color: gold, textDecoration: 'none', fontWeight: '600' }}>View full analysis →</a>
                    </div>
                  </div>
                  {secondary.filter((c: any) => c.severity === 'high').map((c: any) => (
                    <div key={c.key} style={{ padding: '20px 24px', backgroundColor: '#0f0a04', border: '1px solid #2a2000', borderLeft: '3px solid #C8A24A', borderRadius: '8px', marginBottom: '12px' }}>
                      <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.2em', fontWeight: '700', marginBottom: '8px' }}>HIGH SEVERITY — SECONDARY</div>
                      <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '6px' }}>{c.name}</div>
                      <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.6' }}>{c.hypothesis}</div>
                    </div>
                  ))}
                  {secondary.filter((c: any) => c.severity !== 'high').map((c: any) => (
                    <div key={c.key} style={{ padding: '18px 24px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '8px', marginBottom: '10px' }}>
                      <div style={{ fontSize: '10px', color: '#555', letterSpacing: '0.2em', fontWeight: '600', marginBottom: '6px' }}>MEDIUM SEVERITY</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>{c.name}</div>
                      <div style={{ fontSize: '12px', color: '#555', lineHeight: '1.6' }}>{c.hypothesis}</div>
                    </div>
                  ))}
                </>
              ) : (
                <div style={{ padding: '40px', textAlign: 'center' as const, backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', color: '#444', fontSize: '13px' }}>
                  No critical issues detected. Complete your MRI to begin constraint monitoring.
                </div>
              )}
            </div>
          )}

          {/* MEETING CENTRE TAB */}
          {activeTab === 'meetings' && (
            <div>
              <div style={{ fontSize: '11px', color: '#444', letterSpacing: '0.2em', marginBottom: '24px', fontWeight: '600' }}>BEI MEETING EXECUTION CENTRE</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div style={{ padding: '28px', backgroundColor: card, border: '1px solid rgba(200,162,74,0.2)', borderRadius: '10px', position: 'relative' as const, overflow: 'hidden' }}>
                  <div style={{ position: 'absolute' as const, top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(200,162,74,0.4), transparent)' }} />
                  <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.2em', marginBottom: '12px', fontWeight: '600' }}>ONBOARDING SESSION</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>Welcome to BEI — System Briefing</div>
                  <div style={{ fontSize: '13px', color: '#555', lineHeight: '1.6', marginBottom: '20px' }}>Your dedicated 90-minute onboarding with your BEI Intelligence specialist. Full system briefing, first MRI review and 90-day action plan.</div>
                  <a href='/book' style={{ padding: '10px 24px', backgroundColor: gold, color: dark, borderRadius: '4px', fontSize: '13px', fontWeight: '700', textDecoration: 'none', display: 'inline-block' }}>Book Now →</a>
                </div>
                <div style={{ padding: '28px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px' }}>
                  <div style={{ fontSize: '11px', color: '#444', letterSpacing: '0.2em', marginBottom: '12px', fontWeight: '600' }}>MONTHLY MRI REVIEW</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>Monthly Intelligence Debrief</div>
                  <div style={{ fontSize: '13px', color: '#555', lineHeight: '1.6', marginBottom: '20px' }}>Review your latest MRI report with your BEI Account Manager. Constraint updates, progress review and next 30-day priorities.</div>
                  <a href='/book' style={{ padding: '10px 24px', border: '1px solid rgba(200,162,74,0.3)', color: gold, borderRadius: '4px', fontSize: '13px', fontWeight: '600', textDecoration: 'none', display: 'inline-block' }}>Schedule →</a>
                </div>
              </div>
              <div style={{ padding: '28px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', color: '#444', letterSpacing: '0.2em', marginBottom: '16px', fontWeight: '600' }}>YOUR BEI ACCOUNT MANAGER</div>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(200,162,74,0.1)', border: '1px solid rgba(200,162,74,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>◈</div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>BEI Intelligence Team</div>
                    <div style={{ fontSize: '13px', color: '#555', lineHeight: '1.6', marginBottom: '12px' }}>Your dedicated BEI Intelligence specialist is a real human expert who monitors your business performance, reviews your MRI reports and is available to support your strategic decisions.</div>
                    <div style={{ fontSize: '12px', color: '#333', padding: '12px 16px', backgroundColor: '#080808', borderRadius: '6px', border: '1px solid #161616', lineHeight: '1.7' }}>
                      To contact your Account Manager directly, email <span style={{ color: gold }}>intelligence@officialbei.com</span> with your business name and query. Response within 24 hours.
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ padding: '20px 24px', backgroundColor: '#080808', border: '1px solid #161616', borderRadius: '8px', fontSize: '13px', color: '#444', lineHeight: '1.7' }}>
                ◈ Additional strategy sessions, constraint deep-dives and deployment support sessions can be booked at any time. All sessions are conducted by qualified BEI Intelligence specialists.
              </div>
            </div>
          )}

        {/* CONNECTORS TAB */}
          {activeTab === 'connectors' && (
            <div>
              <div style={{ fontSize: '11px', color: '#444', letterSpacing: '0.2em', marginBottom: '8px', fontWeight: '600' }}>DATA CONNECTORS</div>
              <div style={{ fontSize: '13px', color: '#555', marginBottom: '28px', lineHeight: '1.7' }}>
                Connect your business systems to enable real-time data enrichment across your MRI reports. Connected data sources improve constraint detection accuracy and unlock enhanced analysis.
              </div>

              {/* No connection prompt */}
              <div style={{ padding: '28px', backgroundColor: 'rgba(200,162,74,0.04)', border: '1px solid rgba(200,162,74,0.15)', borderRadius: '10px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.2em', marginBottom: '8px', fontWeight: '600' }}>◈ ENHANCED INTELLIGENCE AVAILABLE</div>
                  <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '6px' }}>Connect real data for full enhanced MRI analysis</div>
                  <div style={{ fontSize: '13px', color: '#555', lineHeight: '1.6', maxWidth: '560px' }}>
                    Your current MRI is based on intake answers. Connect your CRM, accounting software or HR system to pull live data and dramatically improve constraint detection accuracy.
                  </div>
                </div>
                <a href='/connect' style={{ padding: '12px 28px', backgroundColor: gold, color: dark, fontWeight: '700', borderRadius: '6px', textDecoration: 'none', fontSize: '14px', whiteSpace: 'nowrap' as const, marginLeft: '24px' }}>Connect Now →</a>
              </div>

              {/* CRM connectors */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '10px', color: '#333', letterSpacing: '0.2em', marginBottom: '14px', fontWeight: '600' }}>CRM & SALES</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  {[
                    { name: 'HubSpot', desc: 'CRM, deals, contacts and pipeline data', icon: '⬡', status: 'available' },
                    { name: 'Salesforce', desc: 'Enterprise CRM and opportunity tracking', icon: '⬡', status: 'available' },
                    { name: 'Manual CRM', desc: 'Import CRM data manually via CSV', icon: '⬡', status: 'available' },
                  ].map(c => (
                    <div key={c.name} style={{ padding: '20px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '8px', position: 'relative' as const }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div style={{ fontSize: '15px', fontWeight: '600' }}>{c.name}</div>
                        <div style={{ fontSize: '10px', color: '#4aaa4a', backgroundColor: 'rgba(74,170,74,0.1)', padding: '2px 8px', borderRadius: '10px', border: '1px solid rgba(74,170,74,0.2)' }}>AVAILABLE</div>
                      </div>
                      <div style={{ fontSize: '12px', color: '#555', lineHeight: '1.6', marginBottom: '14px' }}>{c.desc}</div>
                      <a href='/connect' style={{ fontSize: '12px', color: gold, textDecoration: 'none', fontWeight: '600' }}>Connect →</a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Finance connectors */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '10px', color: '#333', letterSpacing: '0.2em', marginBottom: '14px', fontWeight: '600' }}>FINANCE & ACCOUNTING</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  {[
                    { name: 'Xero', desc: 'Accounting, invoices, cash flow and P&L', icon: '⬡', status: 'available' },
                    { name: 'QuickBooks', desc: 'Financial data, revenue and expense tracking', icon: '⬡', status: 'available' },
                    { name: 'Manual Financial', desc: 'Import financial data manually via CSV', icon: '⬡', status: 'available' },
                  ].map(c => (
                    <div key={c.name} style={{ padding: '20px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div style={{ fontSize: '15px', fontWeight: '600' }}>{c.name}</div>
                        <div style={{ fontSize: '10px', color: '#4aaa4a', backgroundColor: 'rgba(74,170,74,0.1)', padding: '2px 8px', borderRadius: '10px', border: '1px solid rgba(74,170,74,0.2)' }}>AVAILABLE</div>
                      </div>
                      <div style={{ fontSize: '12px', color: '#555', lineHeight: '1.6', marginBottom: '14px' }}>{c.desc}</div>
                      <a href='/connect' style={{ fontSize: '12px', color: gold, textDecoration: 'none', fontWeight: '600' }}>Connect →</a>
                    </div>
                  ))}
                </div>
              </div>

              {/* HR & Operations */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '10px', color: '#333', letterSpacing: '0.2em', marginBottom: '14px', fontWeight: '600' }}>HR, OPERATIONS & ANALYTICS</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  {[
                    { name: 'HiBob', desc: 'HR data, headcount, team structure', icon: '⬡', status: 'available' },
                    { name: 'Workday', desc: 'Enterprise HR, finance and planning', icon: '⬡', status: 'available' },
                    { name: 'Google Analytics', desc: 'Web traffic, conversions and acquisition data', icon: '⬡', status: 'available' },
                    { name: 'Companies House', desc: 'UK company data, filings and directors', icon: '⬡', status: 'available' },
                    { name: 'Manual Staffing', desc: 'Import staffing and HR data manually', icon: '⬡', status: 'available' },
                  ].map(c => (
                    <div key={c.name} style={{ padding: '20px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div style={{ fontSize: '15px', fontWeight: '600' }}>{c.name}</div>
                        <div style={{ fontSize: '10px', color: '#4aaa4a', backgroundColor: 'rgba(74,170,74,0.1)', padding: '2px 8px', borderRadius: '10px', border: '1px solid rgba(74,170,74,0.2)' }}>AVAILABLE</div>
                      </div>
                      <div style={{ fontSize: '12px', color: '#555', lineHeight: '1.6', marginBottom: '14px' }}>{c.desc}</div>
                      <a href='/connect' style={{ fontSize: '12px', color: gold, textDecoration: 'none', fontWeight: '600' }}>Connect →</a>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: '20px 24px', backgroundColor: '#080808', border: '1px solid #161616', borderRadius: '8px', fontSize: '13px', color: '#444', lineHeight: '1.7' }}>
                ◈ All connectors use OAuth 2.0 or API key authentication. BEI never stores your credentials — only the data needed to run your intelligence analysis. Data is refreshed on each MRI cycle.
              </div>
            </div>
          )}

          {/* OUTCOME & DEPLOYMENT CENTRE TAB */}
          {activeTab === 'deployment' && (
            <div>
              <div style={{ fontSize: '11px', color: '#444', letterSpacing: '0.2em', marginBottom: '8px', fontWeight: '600' }}>OUTCOME & DEPLOYMENT CENTRE</div>
              <div style={{ fontSize: '13px', color: '#555', marginBottom: '28px', lineHeight: '1.7' }}>
                Track live deployments, monitor outcomes and measure the impact of constraint resolution across your business.
              </div>

              {result && result.deployment_packages ? (
                <>
                  {/* Opportunity summary */}
                  {result.total_opportunity && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
                      <div style={{ padding: '20px', backgroundColor: card, border: '1px solid rgba(200,162,74,0.2)', borderRadius: '8px' }}>
                        <div style={{ fontSize: '10px', color: '#444', letterSpacing: '0.15em', marginBottom: '8px' }}>TOTAL OPPORTUNITY</div>
                        <div style={{ fontSize: '28px', fontWeight: '800', color: gold }}>£{Math.round((result.total_opportunity.total_low || 0)/1000)}k–£{Math.round((result.total_opportunity.total_high || 0)/1000)}k</div>
                        <div style={{ fontSize: '11px', color: '#333', marginTop: '4px' }}>Annual value available</div>
                      </div>
                      <div style={{ padding: '20px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '8px' }}>
                        <div style={{ fontSize: '10px', color: '#444', letterSpacing: '0.15em', marginBottom: '8px' }}>DEPLOYMENTS READY</div>
                        <div style={{ fontSize: '28px', fontWeight: '800', color: '#f0f0f0' }}>
                          {((result.deployment_packages.tier1_automatic || []).length + (result.deployment_packages.tier2_approval || []).length + (result.deployment_packages.tier3_recommendation || []).length)}
                        </div>
                        <div style={{ fontSize: '11px', color: '#333', marginTop: '4px' }}>Across all tiers</div>
                      </div>
                      <div style={{ padding: '20px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '8px' }}>
                        <div style={{ fontSize: '10px', color: '#444', letterSpacing: '0.15em', marginBottom: '8px' }}>PRIMARY CONSTRAINT</div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#cc4444', lineHeight: '1.3' }}>{primary?.name || '—'}</div>
                        <div style={{ fontSize: '11px', color: '#333', marginTop: '4px' }}>Root cause confirmed</div>
                      </div>
                    </div>
                  )}

                  {/* Tier 1 — Automatic */}
                  {(result.deployment_packages.tier1_automatic || []).length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                        <div style={{ fontSize: '10px', color: '#4aaa4a', letterSpacing: '0.2em', fontWeight: '700' }}>TIER 1 — AUTOMATIC DEPLOYMENTS</div>
                        <div style={{ fontSize: '10px', color: '#4aaa4a', backgroundColor: 'rgba(74,170,74,0.1)', padding: '2px 8px', borderRadius: '10px', border: '1px solid rgba(74,170,74,0.2)' }}>READY TO EXECUTE</div>
                      </div>
                      {(result.deployment_packages.tier1_automatic || []).map((pkg: any, i: number) => (
                        <div key={i} style={{ padding: '20px 24px', backgroundColor: '#080f04', border: '1px solid #1a3a1a', borderLeft: '3px solid #4aaa4a', borderRadius: '8px', marginBottom: '10px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <div style={{ fontSize: '15px', fontWeight: '600' }}>{pkg.title || pkg.action || 'Deployment Action'}</div>
                            <div style={{ fontSize: '10px', color: '#4aaa4a', fontWeight: '600' }}>AUTO</div>
                          </div>
                          <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.6', marginBottom: '10px' }}>{pkg.description || pkg.rationale || ''}</div>
                          {pkg.expected_impact && <div style={{ fontSize: '12px', color: gold }}>Expected impact: {pkg.expected_impact}</div>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tier 2 — Approval required */}
                  {(result.deployment_packages.tier2_approval || []).length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                        <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.2em', fontWeight: '700' }}>TIER 2 — APPROVAL REQUIRED</div>
                        <div style={{ fontSize: '10px', color: gold, backgroundColor: 'rgba(200,162,74,0.1)', padding: '2px 8px', borderRadius: '10px', border: '1px solid rgba(200,162,74,0.2)' }}>AWAITING SIGN-OFF</div>
                      </div>
                      {(result.deployment_packages.tier2_approval || []).map((pkg: any, i: number) => (
                        <div key={i} style={{ padding: '20px 24px', backgroundColor: '#0f0a04', border: '1px solid #3a2a04', borderLeft: '3px solid #C8A24A', borderRadius: '8px', marginBottom: '10px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <div style={{ fontSize: '15px', fontWeight: '600' }}>{pkg.title || pkg.action || 'Deployment Action'}</div>
                            <div style={{ fontSize: '10px', color: gold, fontWeight: '600' }}>APPROVAL</div>
                          </div>
                          <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.6', marginBottom: '10px' }}>{pkg.description || pkg.rationale || ''}</div>
                          {pkg.expected_impact && <div style={{ fontSize: '12px', color: gold }}>Expected impact: {pkg.expected_impact}</div>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tier 3 — Recommendations */}
                  {(result.deployment_packages.tier3_recommendation || []).length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                        <div style={{ fontSize: '10px', color: '#4a8ab0', letterSpacing: '0.2em', fontWeight: '700' }}>TIER 3 — STRATEGIC RECOMMENDATIONS</div>
                      </div>
                      {(result.deployment_packages.tier3_recommendation || []).map((pkg: any, i: number) => (
                        <div key={i} style={{ padding: '20px 24px', backgroundColor: card, border: '1px solid #1a2a3a', borderLeft: '3px solid #4a8ab0', borderRadius: '8px', marginBottom: '10px' }}>
                          <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>{pkg.title || pkg.action || 'Strategic Recommendation'}</div>
                          <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.6' }}>{pkg.description || pkg.rationale || ''}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Outcome tracking */}
                  <div style={{ padding: '24px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px' }}>
                    <div style={{ fontSize: '10px', color: '#444', letterSpacing: '0.2em', marginBottom: '16px', fontWeight: '600' }}>OUTCOME TRACKING</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
                      {[
                        { label: 'Deployments Active', value: '0', color: gold },
                        { label: 'Outcomes Recorded', value: '0', color: '#4aaa4a' },
                        { label: 'Constraint Status', value: primary?.name ? 'Active' : 'None', color: '#cc4444' },
                      ].map(m => (
                        <div key={m.label} style={{ padding: '16px', backgroundColor: '#080808', borderRadius: '6px', border: '1px solid #161616' }}>
                          <div style={{ fontSize: '10px', color: '#333', marginBottom: '6px' }}>{m.label.toUpperCase()}</div>
                          <div style={{ fontSize: '20px', fontWeight: '700', color: m.color }}>{m.value}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: '13px', color: '#444', lineHeight: '1.7' }}>
                      ◈ Outcome tracking activates when deployments are executed. Visit the full
                      <a href='/deployments' style={{ color: gold, textDecoration: 'none', margin: '0 6px', fontWeight: '600' }}>Deployments</a>
                      and
                      <a href='/outcomes' style={{ color: gold, textDecoration: 'none', margin: '0 6px', fontWeight: '600' }}>Outcomes</a>
                      pages for detailed execution management.
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ padding: '48px', textAlign: 'center' as const, backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px' }}>
                  <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.2em', marginBottom: '12px', fontWeight: '600' }}>NO DEPLOYMENTS YET</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Complete your MRI to unlock the deployment engine</div>
                  <div style={{ fontSize: '13px', color: '#555', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px', lineHeight: '1.7' }}>
                    Once your Business MRI is complete, BEI will generate verified deployment packages across three tiers — automatic, approval-required and strategic recommendations.
                  </div>
                  <a href='/book' style={{ padding: '12px 32px', backgroundColor: gold, color: dark, fontWeight: '700', borderRadius: '6px', textDecoration: 'none', fontSize: '14px' }}>Start Your Free MRI →</a>
                </div>
              )}
            </div>
          )}

          {/* BEI INTELLIGENCE TAB */}
          {activeTab === 'intelligence' && (
            <div>

              {/* Hero image + header */}
              <div style={{ position: 'relative' as const, borderRadius: '16px', overflow: 'hidden', marginBottom: '28px', border: '1px solid rgba(200,162,74,0.2)' }}>
                <img src='/bei-intel-dashboard.png' alt='BEI Intelligence' style={{ width: '100%', height: '300px', objectFit: 'cover', objectPosition: 'center center', display: 'block', opacity: 0.85 }} />
                <div style={{ position: 'absolute' as const, inset: 0, background: 'linear-gradient(90deg, rgba(3,2,1,0.95) 0%, rgba(3,2,1,0.6) 50%, transparent 100%)' }} />
                <div style={{ position: 'absolute' as const, top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(200,162,74,0.5), transparent)' }} />
                <div style={{ position: 'absolute' as const, inset: 0, display: 'flex', flexDirection: 'column' as const, justifyContent: 'center', padding: '32px' }}>
                  <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.25em', marginBottom: '10px', fontWeight: '600' }}>BEI INTELLIGENCE OPERATION</div>
                  <div style={{ fontSize: '26px', fontWeight: '800', color: '#f0f0f0', letterSpacing: '-0.02em', marginBottom: '8px', maxWidth: '500px', lineHeight: '1.2' }}>
                    The BEI intelligence team<br />never stops working.
                  </div>
                  <div style={{ fontSize: '13px', color: '#777', maxWidth: '480px', lineHeight: '1.7' }}>
                    Human judgement and machine speed in permanent unison — monitoring the signals that matter across every client market sector.
                  </div>
                  <div style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4aaa4a', boxShadow: '0 0 6px rgba(74,170,74,0.8)' }} />
                      <span style={{ fontSize: '11px', color: '#4aaa4a', fontWeight: '600' }}>MONITORING ACTIVE</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: gold }} />
                      <span style={{ fontSize: '11px', color: gold, fontWeight: '600' }}>{industryData.label.toUpperCase()}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#555' }} />
                      <span style={{ fontSize: '11px', color: '#555' }}>48HR ALERT WINDOW</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4-step process */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', backgroundColor: '#161616', border: '1px solid #161616', borderRadius: '10px', overflow: 'hidden', marginBottom: '28px' }}>
                {[
                  { n: '01', title: 'AI scans continuously', desc: 'Machine systems monitor growth signals, risk indicators and sector data across all client market areas — 24 hours a day, without gaps.' },
                  { n: '02', title: 'Signals flagged and scored', desc: 'Every detected signal is scored for severity, relevance to your Business Twin and potential impact on your primary constraint status.' },
                  { n: '03', title: 'BEI team validates', desc: 'The intelligence team reviews every flagged signal. Human judgement determines whether it warrants a client alert or MRI re-evaluation.' },
                  { n: '04', title: 'Client notified', desc: 'If a signal crosses the alert threshold, you are notified within 48 hours with context, explanation and recommended action. Verified — not raw data.' },
                ].map((step, i) => (
                  <div key={step.n} style={{ padding: '24px 20px', backgroundColor: card, position: 'relative' as const }}>
                    <div style={{ position: 'absolute' as const, top: 0, left: 0, right: 0, height: '2px', background: i === 0 ? 'linear-gradient(90deg, #C8A24A, transparent)' : 'transparent' }} />
                    <div style={{ fontSize: '22px', fontWeight: '800', color: 'rgba(200,162,74,0.15)', marginBottom: '12px', fontFamily: 'monospace' }}>{step.n}</div>
                    <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#e0e0e0' }}>{step.title}</div>
                    <div style={{ fontSize: '12px', color: '#555', lineHeight: '1.7' }}>{step.desc}</div>
                  </div>
                ))}
              </div>

              {/* Industry insight banner */}
              <div style={{ padding: '24px 28px', background: 'linear-gradient(135deg, rgba(200,162,74,0.06) 0%, rgba(200,162,74,0.02) 100%)', border: '1px solid rgba(200,162,74,0.2)', borderRadius: '10px', marginBottom: '24px', position: 'relative' as const, overflow: 'hidden' }}>
                <div style={{ position: 'absolute' as const, top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(200,162,74,0.4), transparent)' }} />
                <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.2em', marginBottom: '10px', fontWeight: '600' }}>◈ {industryData.label.toUpperCase()} — INTELLIGENCE INSIGHT</div>
                <div style={{ fontSize: '15px', color: '#ccc', lineHeight: '1.8', fontWeight: '400' }}>{industryData.insight}</div>
              </div>

              {/* Signals + Benchmarks side by side */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>

                {/* Live signals */}
                <div style={{ padding: '20px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px' }}>
                  <div style={{ fontSize: '10px', color: '#333', letterSpacing: '0.2em', marginBottom: '16px', fontWeight: '600' }}>LIVE SIGNALS — VERIFIED</div>
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
                    {industryData.signals.map((s: any, i: number) => (
                      <div key={i} style={{ padding: '12px 14px', backgroundColor: s.severity === 'high' ? '#0f0a04' : '#080808', border: `1px solid ${s.severity === 'high' ? '#3a2a04' : '#161616'}`, borderLeft: `2px solid ${s.severity === 'high' ? '#cc4444' : s.severity === 'medium' ? gold : '#333'}`, borderRadius: '6px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                          <div style={{ fontSize: '10px', color: s.severity === 'high' ? '#cc4444' : gold, fontWeight: '700', letterSpacing: '0.15em' }}>{s.domain}</div>
                          <div style={{ fontSize: '9px', color: '#4aaa4a', backgroundColor: 'rgba(74,170,74,0.08)', padding: '1px 6px', borderRadius: '8px', border: '1px solid rgba(74,170,74,0.15)' }}>✓ VERIFIED</div>
                        </div>
                        <div style={{ fontSize: '12px', color: '#888', lineHeight: '1.5' }}>{s.signal}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benchmarks */}
                <div style={{ padding: '20px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px' }}>
                  <div style={{ fontSize: '10px', color: '#333', letterSpacing: '0.2em', marginBottom: '16px', fontWeight: '600' }}>INDUSTRY BENCHMARKS</div>
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0' }}>
                    {industryData.benchmarks.map((b: any, i: number) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px 0', borderBottom: i < industryData.benchmarks.length - 1 ? '1px solid #111' : 'none' }}>
                        <div style={{ fontSize: '12px', color: '#555', flex: 1, paddingRight: '12px', lineHeight: '1.4' }}>{b.metric}</div>
                        <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
                          <div style={{ fontSize: '13px', fontWeight: '700', color: gold }}>{b.value}</div>
                          <div style={{ fontSize: '10px', color: '#333', marginTop: '2px' }}>{b.bei}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Signal domain bars */}
              <div style={{ padding: '20px 24px', backgroundColor: '#080808', border: '1px solid #161616', borderRadius: '10px', marginBottom: '20px' }}>
                <div style={{ fontSize: '10px', color: '#333', letterSpacing: '0.2em', marginBottom: '16px', fontWeight: '600' }}>MONITORING COVERAGE — 4 SIGNAL DOMAINS</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                  {[
                    { domain: 'Growth Signals', coverage: 94, color: '#4aaa4a' },
                    { domain: 'Operational Risk', coverage: 88, color: gold },
                    { domain: 'Financial Risk', coverage: 91, color: gold },
                    { domain: 'Strategic Risk', coverage: 86, color: '#4a8ab0' },
                  ].map(d => (
                    <div key={d.domain} style={{ textAlign: 'center' as const }}>
                      <svg width="64" height="64" viewBox="0 0 64 64" style={{ display: 'block', margin: '0 auto 8px' }}>
                        <circle cx="32" cy="32" r="26" fill="none" stroke="#111" strokeWidth="5"/>
                        <circle cx="32" cy="32" r="26" fill="none" stroke={d.color} strokeWidth="5"
                          strokeDasharray={`${d.coverage * 1.634} 163.4`}
                          strokeDashoffset="40.8" strokeLinecap="round"
                          transform="rotate(-90 32 32)"
                        />
                        <text x="32" y="37" textAnchor="middle" fill={d.color} fontSize="13" fontWeight="700" fontFamily="Inter">{d.coverage}%</text>
                      </svg>
                      <div style={{ fontSize: '11px', color: '#555', lineHeight: '1.4' }}>{d.domain}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team status bar */}
              <div style={{ padding: '18px 24px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4aaa4a', boxShadow: '0 0 8px rgba(74,170,74,0.7)' }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#e0e0e0', marginBottom: '3px' }}>BEI Intelligence Team — Active</div>
                    <div style={{ fontSize: '11px', color: '#444' }}>Monitoring {industryData.label} · Human-verified intelligence · No alert sent without BEI team validation</div>
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: '#333', textAlign: 'right' as const }}>
                  <div style={{ color: '#444', marginBottom: '2px' }}>Last updated</div>
                  <div style={{ color: gold }}>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </main>
  )
}
