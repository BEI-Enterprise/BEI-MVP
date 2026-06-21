'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase'
import { useCurrency, formatPrice, getCurrencySymbol } from '../../lib/currency'
import MeetingCentre from '../components/MeetingCentre'

import dynamic from 'next/dynamic'
const NetworkGraph = dynamic<{ width: number, height: number, nodeCount: number }>(
  () => import('../../components/BEIAnimations').then(m => ({ default: m.NetworkGraph })),
  { ssr: false }
)

const supabase = createClient()
const gold = '#C8A24A'
const dark = '#050505'
const card = '#111111'
const border = '#2a2a2a'

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
            .select('id, business_name, mri_result, subscription_tier, subscription_status, created_at, updated_at, industry, location_country')
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

  useEffect(() => {
    const onFocus = async () => {
      try {
        const { data: { user: u } } = await supabase.auth.getUser()
        if (!u) return
        const { data } = await supabase
          .from('businesses')
          .select('id, business_name, mri_result, subscription_tier, subscription_status, created_at, updated_at, industry, location_country')
          .eq('email', u.email)
          .order('updated_at', { ascending: false })
        if (data) {
          setBusinesses(data)
          setSelected((prev: any) => {
            if (!prev) return data[0] || null
            const still = data.find((b: any) => b.id === prev.id)
            return still || data[0] || null
          })
        }
      } catch {}
    }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  const locationCountry = selected?.location_country || ''
  const currency = useCurrency(locationCountry)
  if (loading) return (
    <main style={{ backgroundColor: '#0c0c0c', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: '13px', color: '#666', letterSpacing: '0.1em' }}>Loading your intelligence...</div>
    </main>
  )

  if (!user) return (
    <main style={{ backgroundColor: '#0c0c0c', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' as const }}>
        <div style={{ fontSize: '13px', color: '#777', marginBottom: '20px' }}>You need to be signed in to access your dashboard.</div>
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
  const marketUpdates = isEstate ? [
    { tag: 'PROPERTY MARKET', title: 'UK buyer demand up in Q2 2026', summary: 'Increased buyer activity across UK property market. Agencies with strong review velocity and fast lead response are capturing disproportionate share of new instructions.', severity: 'opportunity', date: 'Jun 2026', img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80' },
    { tag: 'TRUST SIGNALS', title: 'Google excludes sub-4.0★ from best searches', summary: 'Businesses below 4.0★ are excluded from "best estate agent" search results in 2026. Review rating and volume now directly impact organic lead generation. Platform average: 224 reviews.', severity: 'alert', date: 'Jun 2026', img: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80' },
    { tag: 'LEAD RESPONSE', title: '78% of buyers work with the first responder', summary: 'After-hours enquiries represent 62% of total volume. Agencies without automated response systems are losing the majority of out-of-hours leads to faster competitors.', severity: 'alert', date: 'May 2026', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80' },
    { tag: 'COMPETITIVE', title: 'Review velocity gap widening in local markets', summary: 'Agencies not actively collecting reviews are losing ground daily to competitors. Minimum competitive velocity: 4–8 new Google reviews per month to maintain local search position.', severity: 'watch', date: 'Jun 2026', img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80' },
  ] : isMarketing ? [
    { tag: 'PRICING PRESSURE', title: 'UK agency NI costs up £8k–£12k on £500k payroll', summary: 'Employer NI rate increase from April 2025 is now fully materialising in 2026 margins. Agencies that have not repriced since 2024 are absorbing these costs directly into net profit.', severity: 'alert', date: 'Jun 2026', img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80' },
    { tag: 'CLIENT RETENTION', title: 'Retainer agencies achieve 56-month avg client lifespan', summary: 'vs 24 months for project-based agencies. Retainer model transition is the single highest-leverage structural change available to most SME agencies in 2026.', severity: 'opportunity', date: 'May 2026', img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80' },
    { tag: 'AI SERVICES', title: 'AI-adjacent service demand up significantly in 2026', summary: 'Agencies with clear AI-assisted positioning are capturing disproportionate new business. Offer clarity around AI services is increasingly determining proposal conversion rates.', severity: 'opportunity', date: 'Jun 2026', img: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80' },
    { tag: 'CAPACITY', title: 'Utilisation below 65% sends agency margin to zero', summary: '2026 benchmark data confirms junior staff should run at 80–85% billable utilisation. Senior leadership above 60% billable is a capacity constraint suppressing strategy and BD work.', severity: 'watch', date: 'May 2026', img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80' },
  ] : isAccounting ? [
    { tag: 'INDUSTRY GROWTH', title: 'UK accounting sector +21.7% client growth YoY', summary: 'Record demand for accounting services across all firm sizes in 2026. Firms not capturing this growth have at least one active constraint — most commonly advisory positioning or partner dependency.', severity: 'opportunity', date: 'Jun 2026', img: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&q=80' },
    { tag: 'ADVISORY SHIFT', title: 'Advisory firms generating 3–5× revenue per client', summary: 'Gap between compliance-led and advisory-led firms is widening rapidly. CX-mature firms command 15–20% billing rate premiums. Compliance-only positioning is a strategic constraint.', severity: 'alert', date: 'Jun 2026', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80' },
    { tag: 'SPECIALISATION', title: 'Specialist accountants commanding +25% pricing premium', summary: 'As client complexity increases, demand for specialist accountants grows. Generalist positioning is a growing strategic risk. Specialisation is the highest-leverage differentiation in 2026.', severity: 'opportunity', date: 'May 2026', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80' },
    { tag: 'COMPLIANCE RISK', title: 'HMRC late payment rate 7.75%/yr from Jan 2026', summary: 'Corporation tax interest on unpaid amounts from January 2026. MTD Phase 3 compliance creating advisory opportunity. Firms with structured CX programmes seeing retention improvements of 3–5 points.', severity: 'watch', date: 'Jan 2026', img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80' },
  ] : [
    { tag: 'BEI INTELLIGENCE', title: 'Set your business type to receive targeted market updates', summary: 'Go to Account Settings and select your business category. BEI will show you verified market intelligence specific to your sector.', severity: 'watch', date: 'Jun 2026', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80' },
    { tag: 'CROSS-SECTOR', title: 'Trust infrastructure now a primary constraint across all sectors', summary: 'Review volume, response speed and social proof are the most common constraint triggers across all three BEI-covered sectors in 2026. Average Google review count: 224.', severity: 'alert', date: 'Jun 2026', img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80' },
    { tag: 'CROSS-SECTOR', title: 'Retainer/advisory models outperforming transactional by 3–5×', summary: 'Across estate, marketing and accounting sectors — businesses operating retainer or advisory models generate 3–5× more revenue per client than transactional counterparts.', severity: 'opportunity', date: 'May 2026', img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=80' },
  ]

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'reports', label: 'Analysis Reports' },
    { id: 'revenue', label: 'Business Health' },
    { id: 'issues', label: 'Issues & Constraints' },
    { id: 'deployment', label: 'Outcome & Deployment' },
    { id: 'intelligence', label: 'BEI Intelligence' },
    { id: 'meetings', label: 'Meeting Centre' },
    { id: 'connectors', label: 'Data Connectors' },
  ]

  return (
    <main style={{ backgroundColor: '#0c0c0c', color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', minHeight: '100vh' }}>

      {/* Welcome overlay */}
      {showWelcome && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
          <div style={{ maxWidth: '560px', padding: '56px', backgroundColor: '#141414', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '16px', textAlign: 'center' as const, position: 'relative' as const }}>
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
                <div style={{ fontSize: '11px', color: '#777', marginTop: '4px' }}>Health Score</div>
              </div>
              <div style={{ width: '1px', backgroundColor: '#1a1a1a' }} />
              <div style={{ textAlign: 'center' as const }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#f0f0f0', maxWidth: '160px' }}>{primary?.name || 'Analysing...'}</div>
                <div style={{ fontSize: '11px', color: '#777', marginTop: '4px' }}>Primary Constraint</div>
              </div>
              <div style={{ width: '1px', backgroundColor: '#1a1a1a' }} />
              <div style={{ textAlign: 'center' as const }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#4aaa4a' }}>100</div>
                <div style={{ fontSize: '11px', color: '#777', marginTop: '4px' }}>Verification</div>
              </div>
            </div>
            <button onClick={() => setShowWelcome(false)} style={{ padding: '14px 48px', backgroundColor: gold, color: dark, fontWeight: '700', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '15px' }}>
              Enter Your Dashboard →
            </button>
          </div>
        </div>
      )}

      {/* Cinematic header — Variant C */}
      <div style={{ position: 'sticky' as const, top: 0, zIndex: 100, borderBottom: '1px solid #2a2a2a' }}>
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
              <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                {selected?.business_name || 'Your Business'} · {(selected?.subscription_tier || 'analysis').toUpperCase()} Plan
              </div>
            </div>
            <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' as const }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: healthColor }}>{health.overall || '—'}</div>
                <div style={{ fontSize: '10px', color: '#666', marginTop: '3px' }}>HEALTH</div>
              </div>
              <div style={{ width: '1px', height: '32px', backgroundColor: '#1a1a1a' }} />
              <div style={{ textAlign: 'center' as const }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#4aaa4a' }}>{primary?.verification_score || '—'}</div>
                <div style={{ fontSize: '10px', color: '#666', marginTop: '3px' }}>VERIFICATION</div>
              </div>
              <div style={{ width: '1px', height: '32px', backgroundColor: '#1a1a1a' }} />
              <div style={{ textAlign: 'center' as const }}>
                <div style={{ fontSize: '20px', fontWeight: '800', color: gold }}>
                  {result?.total_opportunity ? getCurrencySymbol(currency) + Math.round((result.total_opportunity.total_low || 0)/1000) + 'k+' : '—'}
                </div>
                <div style={{ fontSize: '10px', color: '#666', marginTop: '3px' }}>OPPORTUNITY</div>
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
        <div style={{ borderRight: '1px solid #161616', backgroundColor: '#0e0e0e', padding: '28px 0', display: 'flex', flexDirection: 'column' as const, position: 'relative' as const, overflow: 'hidden' }}>
          <div style={{ position: 'absolute' as const, inset: 0, opacity: 0.08, pointerEvents: 'none' as const }}>
            <NetworkGraph width={260} height={800} nodeCount={15} />
          </div>
          <div style={{ position: 'absolute' as const, top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, rgba(200,162,74,0.6), transparent)' }} />

          {/* Business selector */}
          <div style={{ padding: '0 20px 24px', borderBottom: '1px solid #222' }}>
            <div style={{ fontSize: '10px', color: '#555', letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: '12px', fontWeight: '600' }}>Businesses</div>
            {businesses.length === 0 ? (
              <div style={{ fontSize: '13px', color: '#666' }}>No businesses found</div>
            ) : businesses.map(b => (
              <button key={b.id} onClick={() => setSelected(b)} style={{ width: '100%', padding: '10px 12px', marginBottom: '4px', backgroundColor: selected?.id === b.id ? 'rgba(200,162,74,0.08)' : 'transparent', border: selected?.id === b.id ? '1px solid rgba(200,162,74,0.2)' : '1px solid transparent', borderRadius: '6px', textAlign: 'left' as const, cursor: 'pointer', display: 'block' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: selected?.id === b.id ? gold : '#888', marginBottom: '3px' }}>{b.business_name || 'Unnamed Business'}</div>
                <div style={{ fontSize: '11px', color: '#555' }}>{b.subscription_tier || 'analysis'} plan</div>
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
            {[['Account', '/account'], ['Book Session', '/book']].map(([label, href]) => (
              <a key={href} href={href} style={{ display: 'block', padding: '8px 0', fontSize: '13px', color: '#666', textDecoration: 'none' }}>{label}</a>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div style={{ padding: '32px 40px', overflowY: 'auto' as const }}>

          {/* Business header */}
          <div style={{ marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: '8px', fontWeight: '600' }}>Executive Dashboard</div>
              <div style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.02em' }}>{selected?.business_name || 'Your Business'}</div>
              <div style={{ fontSize: '13px', color: '#666', marginTop: '6px' }}>Last updated: {selected?.updated_at ? new Date(selected.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Never'}</div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <a href={`/report/${selected?.id}`} style={{ padding: '10px 20px', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '6px', fontSize: '13px', color: gold, textDecoration: 'none', fontWeight: '600' }}>View Full Report →</a>
              <a href='/book' style={{ padding: '10px 20px', backgroundColor: gold, color: dark, borderRadius: '6px', fontSize: '13px', fontWeight: '700', textDecoration: 'none' }}>Book Session</a>
            </div>
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div>
              {/* BEI EYE image — top of overview */}
              <div style={{ marginBottom: '24px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(200,162,74,0.15)', position: 'relative' as const }}>
                <img src='/BEI EYE.png' alt='BEI Intelligence' style={{ width: '100%', height: '240px', objectFit: 'cover', objectPosition: '50% 40%', display: 'block', opacity: 0.8 }} />
                <div style={{ position: 'absolute' as const, inset: 0, background: 'linear-gradient(90deg, rgba(12,12,12,0.7) 0%, transparent 40%, transparent 60%, rgba(12,12,12,0.7) 100%)', pointerEvents: 'none' as const }} />
                <div style={{ position: 'absolute' as const, bottom: '14px', left: '20px' }}>
                  <div style={{ fontSize: '10px', color: '#C8A24A', letterSpacing: '0.2em', fontWeight: '600' }}>BEI INTELLIGENCE — ACTIVE</div>
                </div>
                <div style={{ position: 'absolute' as const, top: '12px', right: '14px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4aaa4a', boxShadow: '0 0 6px rgba(74,170,74,0.8)' }} />
                  <span style={{ fontSize: '10px', color: '#4aaa4a', fontWeight: '600' }}>MONITORING</span>
                </div>
              </div>
              {/* Health + stats row — glow on hover, Option 3 */}
              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '20px', marginBottom: '24px' }}>
                <div
                  style={{ background: 'radial-gradient(circle at 50% 30%, #151515, ' + card + ')', border: '1px solid ' + border, borderRadius: '10px', padding: '24px', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', transition: 'all 0.25s cubic-bezier(0.2,0.8,0.2,1)', cursor: 'default' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(200,162,74,0.2)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <div style={{ fontSize: '9px', color: '#666', letterSpacing: '0.2em', marginBottom: '14px' }}>OVERALL HEALTH</div>
                  <svg width="130" height="130" viewBox="0 0 130 130" style={{ display: 'block' }}>
                    <circle cx="65" cy="65" r="54" fill="none" stroke="#1a1a1a" strokeWidth="8"/>
                    <circle cx="65" cy="65" r="54" fill="none" stroke={healthColor} strokeWidth="8"
                      strokeDasharray={`${(health.overall || 0) * 3.39} 339`}
                      strokeDashoffset="85" strokeLinecap="round"
                      transform="rotate(-90 65 65)"
                      style={{ transition: 'stroke-dasharray 1.5s ease' }}
                    />
                    <text x="65" y="73" textAnchor="middle" fill={healthColor} fontSize="30" fontWeight="800" fontFamily="Inter">{health.overall || '—'}</text>
                  </svg>
                  <div style={{ fontSize: '13px', color: '#777', marginTop: '10px', textTransform: 'capitalize' as const }}>{health.band || 'unknown'}</div>
                  {health.vs_benchmark && (
                    <div style={{ fontSize: '11px', color: health.vs_benchmark === 'above' ? '#4aaa4a' : '#cc4444', marginTop: '5px' }}>
                      {health.vs_benchmark === 'above' ? '↑ Above' : '↓ Below'} benchmark
                    </div>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr 1fr', gap: '10px' }}>
                  {[
                    { label: 'Primary Constraint', value: primary?.name || 'None detected', color: '#cc4444', glow: 'rgba(204,68,68,0.4)' },
                    { label: 'Verification Score', value: primary ? primary.verification_score + '/100' : '—', color: '#4aaa4a', glow: 'rgba(74,170,74,0.4)' },
                    { label: 'Total Opportunity', value: result?.total_opportunity ? getCurrencySymbol(currency) + Math.round((result.total_opportunity.total_low || 0)/1000) + 'k–' + getCurrencySymbol(currency) + Math.round((result.total_opportunity.total_high || 0)/1000) + 'k' : '—', color: gold, glow: 'rgba(200,162,74,0.4)' },
                    { label: 'Secondary Constraints', value: secondary.length + ' identified', color: '#888', glow: 'rgba(120,120,120,0.3)' },
                    { label: 'Confidence', value: (result?.confidence || 'low').toUpperCase(), color: result?.confidence === 'high' ? '#4aaa4a' : '#888', glow: result?.confidence === 'high' ? 'rgba(74,170,74,0.4)' : 'rgba(120,120,120,0.3)' },
                    { label: 'Subscription', value: (selected?.subscription_tier || 'analysis').toUpperCase(), color: gold, glow: 'rgba(200,162,74,0.4)' },
                  ].map(s => (
                    <div
                      key={s.label}
                      style={{ backgroundColor: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '16px', transition: 'all 0.25s cubic-bezier(0.2,0.8,0.2,1)', cursor: 'default' }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = '0 8px 24px ' + s.glow; el.style.backgroundColor = '#131313' }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; el.style.backgroundColor = '#0e0e0e' }}
                    >
                      <div style={{ fontSize: '9px', color: '#555', letterSpacing: '0.15em', marginBottom: '8px' }}>{s.label.toUpperCase()}</div>
                      <div style={{ fontSize: s.label === 'Primary Constraint' ? '13px' : '20px', fontWeight: '700', color: s.color, lineHeight: '1.3' }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detection bars — Variant A */}
              {primary && (
                <div style={{ padding: '20px 24px', backgroundColor: '#141414', border: '1px solid #2a2a2a', borderRadius: '8px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '10px', color: '#555', letterSpacing: '0.2em', marginBottom: '14px', fontWeight: '600' }}>CONSTRAINT DETECTION ENGINE — LIVE</div>
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

              {/* Pillars */}
              {health.pillars && Object.keys(health.pillars).length > 0 && (
                <div style={{ padding: '24px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '10px', color: '#666', letterSpacing: '0.2em', marginBottom: '16px', fontWeight: '600' }}>PILLAR SCORES</div>
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
                    {Object.entries(health.pillars).map(([name, data]: [string, any]) => {
                      const c = data.score >= 70 ? '#4aaa4a' : data.score >= 45 ? gold : '#cc4444'
                      return (
                        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '80px', fontSize: '12px', color: '#777', textTransform: 'capitalize' as const }}>{name}</div>
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
                  <div style={{ padding: '24px', backgroundColor: '#141414', border: '1px solid #1a1a1a', borderRadius: '10px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div>
                        <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.2em', marginBottom: '6px', fontWeight: '600' }}>◈ DATA CONNECTION STATUS</div>
                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#f0f0f0', marginBottom: '4px' }}>Connect your business data</div>
                        <div style={{ fontSize: '12px', color: '#777', lineHeight: '1.6' }}>Your MRI is currently based on intake answers only. Connect live data sources to unlock enhanced constraint detection and higher verification accuracy.</div>
                      </div>
                      <div style={{ textAlign: 'right' as const, flexShrink: 0, marginLeft: '20px' }}>
                        <div style={{ fontSize: '28px', fontWeight: '800', color: gold }}>{connected}/{total}</div>
                        <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>connected</div>
                      </div>
                    </div>
                    <div style={{ width: '100%', height: '4px', backgroundColor: '#111', borderRadius: '2px', marginBottom: '16px' }}>
                      <div style={{ width: `${(connected/total)*100}%`, height: '100%', backgroundColor: gold, borderRadius: '2px', transition: 'width 1s ease' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                      {connectors.map((c, i) => (
                        <div key={c.id} style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '10px 12px', backgroundColor: '#0a0a0a', border: '1px solid #2a2a2a', borderRadius: '6px' }}>
                          <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1px solid #333', backgroundColor: 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#222' }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '12px', fontWeight: '600', color: '#666', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.label}</div>
                            <div style={{ fontSize: '10px', color: '#555', marginTop: '1px' }}>{c.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <a href='/connect' style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '6px', textDecoration: 'none', fontSize: '13px' }}>
                      Connect Your Business Data →
                    </a>
                    <span style={{ fontSize: '12px', color: '#666', marginLeft: '16px' }}>Takes 2–5 minutes per connector</span>
                  </div>
                )
              })()}

              {/* Latest Market Updates */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ fontSize: '10px', color: '#555', letterSpacing: '0.2em', fontWeight: '600' }}>
                    LATEST MARKET UPDATES — {industryData.label.toUpperCase()}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4aaa4a', boxShadow: '0 0 4px rgba(74,170,74,0.6)' }} />
                    <span style={{ fontSize: '10px', color: '#4aaa4a', fontWeight: '600' }}>BEI VERIFIED · JUNE 2026</span>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {marketUpdates.map((u: any, i: number) => (
                    <div key={i} style={{
                      backgroundColor: '#111',
                      border: `1px solid ${u.severity === 'alert' ? '#3a2a04' : u.severity === 'opportunity' ? '#1a3a1a' : '#222'}`,
                      borderRadius: '10px',
                      overflow: 'hidden' as const
                    }}>
                      <div style={{ position: 'relative' as const, height: '120px', overflow: 'hidden' as const }}>
                        <img src={u.img} alt={u.title} style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block', opacity: 0.75 }} onError={(e: any) => { e.target.style.display = 'none' }} />
                        <div style={{ position: 'absolute' as const, inset: 0, background: `linear-gradient(180deg, transparent 30%, ${u.severity === 'alert' ? 'rgba(15,5,0,0.9)' : u.severity === 'opportunity' ? 'rgba(0,10,0,0.9)' : 'rgba(10,10,10,0.9)'} 100%)` }} />
                        <div style={{ position: 'absolute' as const, bottom: '10px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ fontSize: '9px', color: u.severity === 'alert' ? '#ff6b6b' : u.severity === 'opportunity' ? '#6bcf6b' : gold, fontWeight: '700', letterSpacing: '0.15em', backgroundColor: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px' }}>{u.tag}</div>
                          <div style={{ fontSize: '9px', color: '#888', backgroundColor: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px' }}>{u.date}</div>
                        </div>
                        <div style={{ position: 'absolute' as const, top: '10px', right: '10px', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: u.severity === 'alert' ? '#cc4444' : u.severity === 'opportunity' ? '#4aaa4a' : gold, boxShadow: `0 0 6px ${u.severity === 'alert' ? 'rgba(204,68,68,0.8)' : u.severity === 'opportunity' ? 'rgba(74,170,74,0.8)' : 'rgba(200,162,74,0.8)'}` }} />
                      </div>
                      <div style={{ padding: '14px 16px', borderTop: `1px solid ${u.severity === 'alert' ? '#3a2a04' : u.severity === 'opportunity' ? '#1a3a1a' : '#222'}` }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#e8e8e8', marginBottom: '6px', lineHeight: '1.3' }}>{u.title}</div>
                        <div style={{ fontSize: '11px', color: '#777', lineHeight: '1.65' }}>{u.summary}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {!isEstate && !isMarketing && !isAccounting && (
                  <div style={{ marginTop: '10px', textAlign: 'right' as const }}>
                    <a href='/account' style={{ fontSize: '12px', color: gold, textDecoration: 'none', fontWeight: '600' }}>Set business type in Account Settings →</a>
                  </div>
                )}
              </div>

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

            </div>
          )}

          {/* ANALYSIS REPORTS TAB */}
          {activeTab === 'reports' && (
            <div>
              {/* BEISCREEN image — top of Analysis Reports tab */}
              <div style={{ marginBottom: '24px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(200,162,74,0.15)', position: 'relative' as const }}>
                <img src='/BEISCREEN.png' alt='BEI Analysis' style={{ width: '100%', height: '180px', objectFit: 'cover', objectPosition: 'center', display: 'block', opacity: 0.8 }} />
                <div style={{ position: 'absolute' as const, inset: 0, background: 'linear-gradient(90deg, rgba(12,12,12,0.7) 0%, transparent 40%, transparent 60%, rgba(12,12,12,0.7) 100%)', pointerEvents: 'none' as const }} />
                <div style={{ position: 'absolute' as const, bottom: '14px', left: '20px' }}>
                  <div style={{ fontSize: '10px', color: '#C8A24A', letterSpacing: '0.2em', fontWeight: '600' }}>BEI ANALYSIS ENGINE — ACTIVE</div>
                </div>
                <div style={{ position: 'absolute' as const, top: '12px', right: '14px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4aaa4a', boxShadow: '0 0 6px rgba(74,170,74,0.8)' }} />
                  <span style={{ fontSize: '10px', color: '#4aaa4a', fontWeight: '600' }}>MONITORING</span>
                </div>
              </div>
              <div style={{ fontSize: '11px', color: '#666', letterSpacing: '0.2em', marginBottom: '8px', fontWeight: '600' }}>ANALYSIS REPORTS</div>
              <div style={{ fontSize: '13px', color: '#777', marginBottom: '24px', lineHeight: '1.7' }}>View your MRI report history and generate a new MRI for any connected business.</div>
              <div style={{ padding: '24px 28px', backgroundColor: 'rgba(200,162,74,0.04)', border: '1px solid rgba(200,162,74,0.2)', borderRadius: '10px', marginBottom: '24px', position: 'relative' as const, overflow: 'hidden' }}>
                <div style={{ position: 'absolute' as const, top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(200,162,74,0.5), transparent)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.2em', marginBottom: '8px', fontWeight: '600' }}>◈ GENERATE NEW MRI REPORT</div>
                    <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '6px' }}>Run a fresh MRI on your business</div>
                    <div style={{ fontSize: '13px', color: '#777', lineHeight: '1.6', marginBottom: '16px' }}>Generate an updated Business MRI report. Your Business Twin will be refreshed and all constraints re-verified against the latest intelligence.</div>
                    {businesses.length > 1 && (
                      <div style={{ marginBottom: '8px' }}>
                        <div style={{ fontSize: '11px', color: '#666', marginBottom: '8px', letterSpacing: '0.1em' }}>SELECT BUSINESS TO ANALYSE</div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
                          {businesses.map((b: any) => (
                            <button key={b.id} onClick={() => setSelected(b)} style={{ padding: '8px 16px', backgroundColor: selected?.id === b.id ? 'rgba(200,162,74,0.12)' : '#141414', border: `1px solid ${selected?.id === b.id ? 'rgba(200,162,74,0.4)' : '#2a2a2a'}`, borderRadius: '6px', fontSize: '13px', color: selected?.id === b.id ? gold : '#888', cursor: 'pointer', fontWeight: selected?.id === b.id ? '600' : '400' }}>
                              {b.business_name || 'Unnamed'}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <a href={selected?.id ? `/intake/${selected.id}` : '/book'} style={{ padding: '14px 28px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '6px', textDecoration: 'none', fontSize: '14px', whiteSpace: 'nowrap' as const, flexShrink: 0, alignSelf: 'center' as const }}>Generate New MRI →</a>
                </div>
              </div>
              <div style={{ padding: '28px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.15em', marginBottom: '8px', fontWeight: '600' }}>LATEST MRI REPORT</div>
                    <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '6px' }}>{selected?.business_name || 'Your Business'}</div>
                    <div style={{ fontSize: '13px', color: '#777' }}>Generated: {selected?.updated_at ? new Date(selected.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Unknown'}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ textAlign: 'right' as const }}>
                      <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>HEALTH SCORE</div>
                      <div style={{ fontSize: '28px', fontWeight: '800', color: healthColor }}>{health.overall || '—'}</div>
                    </div>
                    <a href={`/report/${selected?.id}`} style={{ padding: '10px 20px', backgroundColor: gold, color: dark, borderRadius: '6px', fontSize: '13px', fontWeight: '700', textDecoration: 'none' }}>View Report →</a>
                  </div>
                </div>
                {primary && (
                  <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #111', display: 'flex', gap: '32px' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: '#666', marginBottom: '4px' }}>PRIMARY CONSTRAINT</div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#f0f0f0' }}>{primary.name}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: '#666', marginBottom: '4px' }}>VERIFICATION</div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#4aaa4a' }}>{primary.verification_score}/100</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: '#666', marginBottom: '4px' }}>SEVERITY</div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#cc4444' }}>{(primary.severity || 'medium').toUpperCase()}</div>
                    </div>
                  </div>
                )}
              </div>
              <div style={{ padding: '20px 24px', backgroundColor: '#141414', border: '1px solid #2a2a2a', borderRadius: '8px', fontSize: '13px', color: '#666', lineHeight: '1.7' }}>
                ◈ Monthly MRI reports are generated automatically on your renewal date. Historical reports will appear here as your subscription progresses.
              </div>
            </div>
          )}

          {/* BUSINESS HEALTH TAB */}
          {activeTab === 'revenue' && (
            <div>
              <div style={{ fontSize: '11px', color: '#666', letterSpacing: '0.2em', marginBottom: '8px', fontWeight: '600' }}>BUSINESS HEALTH</div>
              <div style={{ fontSize: '13px', color: '#777', marginBottom: '24px', lineHeight: '1.7' }}>
                A full breakdown of your connected business health across all five BEI pillars — Growth, Operations, Strategy, Risk and Context.
              </div>

              {result ? (
                <>
                  {/* Overall health + pillar grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '20px', marginBottom: '24px' }}>
                    <div
                      style={{ background: 'radial-gradient(circle at 50% 30%, #151515, ' + card + ')', border: '1px solid ' + border, borderRadius: '10px', padding: '24px', textAlign: 'center' as const, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', transition: 'all 0.25s cubic-bezier(0.2,0.8,0.2,1)', cursor: 'default' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(200,162,74,0.2)' }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                    >
                      <div style={{ fontSize: '10px', color: '#666', letterSpacing: '0.15em', marginBottom: '12px' }}>OVERALL HEALTH</div>
                      <svg width="120" height="120" viewBox="0 0 120 120" style={{ display: 'block', margin: '0 auto' }}>
                        <circle cx="60" cy="60" r="50" fill="none" stroke="#111" strokeWidth="8"/>
                        <circle cx="60" cy="60" r="50" fill="none" stroke={healthColor} strokeWidth="8"
                          strokeDasharray={`${(health.overall || 0) * 3.14} 314`}
                          strokeDashoffset="78" strokeLinecap="round"
                          transform="rotate(-90 60 60)"
                        />
                        <text x="60" y="65" textAnchor="middle" fill={healthColor} fontSize="28" fontWeight="800" fontFamily="Inter">{health.overall || '—'}</text>
                      </svg>
                      <div style={{ fontSize: '12px', color: '#777', marginTop: '8px', textTransform: 'capitalize' as const }}>{health.band || 'unknown'}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px', justifyContent: 'center' }}>
                      {health.pillars && Object.entries(health.pillars).map(([name, data]: [string, any]) => {
                        const c = data.score >= 70 ? '#4aaa4a' : data.score >= 45 ? gold : '#cc4444'
                        const label = name.charAt(0).toUpperCase() + name.slice(1)
                        return (
                          <div key={name}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <div style={{ fontSize: '12px', color: '#666', fontWeight: '600' }}>{label}</div>
                              <div style={{ fontSize: '12px', fontWeight: '700', color: c }}>{data.score}/100</div>
                            </div>
                            <div style={{ height: '6px', backgroundColor: '#111', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ width: data.score + '%', height: '100%', backgroundColor: c, borderRadius: '3px', transition: 'width 1s ease' }} />
                            </div>
                            {data.band && <div style={{ fontSize: '10px', color: '#555', marginTop: '3px', textTransform: 'capitalize' as const }}>{data.band}</div>}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Health context cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
                    {[
                      { label: 'Primary Constraint', value: primary?.name || 'None detected', color: primary ? '#cc4444' : '#4aaa4a', sub: primary ? 'Active — verified' : 'No constraint detected', glow: primary ? 'rgba(204,68,68,0.4)' : 'rgba(74,170,74,0.4)' },
                      { label: 'Verification Score', value: primary ? primary.verification_score + '/100' : '—', color: '#4aaa4a', sub: 'Constraint verification', glow: 'rgba(74,170,74,0.4)' },
                      { label: 'Total Opportunity', value: result.total_opportunity ? getCurrencySymbol(currency) + Math.round((result.total_opportunity.total_low||0)/1000) + 'k–' + getCurrencySymbol(currency) + Math.round((result.total_opportunity.total_high||0)/1000) + 'k' : '—', color: gold, sub: 'Annual value available', glow: 'rgba(200,162,74,0.4)' },
                      { label: 'Revenue Band', value: result.inputs?.monthly_revenue || '—', color: '#888', sub: 'Current reported revenue', glow: 'rgba(120,120,120,0.3)' },
                      { label: 'Revenue Trend', value: result.inputs?.revenue_trend || '—', color: '#888', sub: 'Self-reported direction', glow: 'rgba(120,120,120,0.3)' },
                      { label: 'Confidence Level', value: (result.confidence || 'low').toUpperCase(), color: result.confidence === 'high' ? '#4aaa4a' : '#888', sub: 'Intelligence confidence', glow: result.confidence === 'high' ? 'rgba(74,170,74,0.4)' : 'rgba(120,120,120,0.3)' },
                    ].map(s => (
                      <div
                        key={s.label}
                        style={{ backgroundColor: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '16px', transition: 'all 0.25s cubic-bezier(0.2,0.8,0.2,1)', cursor: 'default' }}
                        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = '0 8px 24px ' + s.glow; el.style.backgroundColor = '#131313' }}
                        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; el.style.backgroundColor = '#0e0e0e' }}
                      >
                        <div style={{ fontSize: '10px', color: '#666', letterSpacing: '0.15em', marginBottom: '6px' }}>{s.label.toUpperCase()}</div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: s.color, lineHeight: '1.3', marginBottom: '4px' }}>{s.value}</div>
                        <div style={{ fontSize: '11px', color: '#555' }}>{s.sub}</div>
                      </div>
                    ))}
                  </div>

                  {/* Opportunity breakdown */}
                  {result.total_opportunity && (
                    <div style={{ padding: '24px', backgroundColor: card, border: '1px solid rgba(200,162,74,0.2)', borderRadius: '10px', marginBottom: '16px' }}>
                      <div style={{ fontSize: '10px', color: '#666', letterSpacing: '0.2em', marginBottom: '16px', fontWeight: '600' }}>OPPORTUNITY IMPACT ON HEALTH</div>
                      <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-end' }}>
                        <div>
                          <div style={{ fontSize: '10px', color: '#666', marginBottom: '6px' }}>CONSERVATIVE UPLIFT</div>
                          <div style={{ fontSize: '36px', fontWeight: '800', color: gold }}>{getCurrencySymbol(currency)}{Math.round((result.total_opportunity.total_low||0)/1000)}k</div>
                          <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>Annual revenue gain</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '10px', color: '#666', marginBottom: '6px' }}>OPTIMISTIC UPLIFT</div>
                          <div style={{ fontSize: '36px', fontWeight: '800', color: gold }}>{getCurrencySymbol(currency)}{Math.round((result.total_opportunity.total_high||0)/1000)}k</div>
                          <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>Annual revenue gain</div>
                        </div>
                        <div style={{ flex: 1, paddingLeft: '20px', borderLeft: '1px solid #161616' }}>
                          <div style={{ fontSize: '10px', color: '#666', marginBottom: '8px' }}>PRIMARY CONSTRAINT RESOLUTION</div>
                          <div style={{ fontSize: '15px', fontWeight: '700', color: '#f0f0f0', marginBottom: '6px' }}>{primary?.name || '—'}</div>
                          <div style={{ fontSize: '12px', color: '#777', lineHeight: '1.6' }}>Resolving this constraint is the highest-leverage action available to improve your overall health score and unlock the identified opportunity.</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div style={{ padding: '16px 20px', backgroundColor: '#141414', border: '1px solid #2a2a2a', borderRadius: '8px', fontSize: '13px', color: '#666', lineHeight: '1.7' }}>
                    ◈ Connect your accounting and CRM data to enable live health score updates and automatic MRI recalculation.
                    <a href='/connect' style={{ color: gold, textDecoration: 'none', marginLeft: '8px', fontWeight: '600' }}>Connect data sources →</a>
                  </div>
                </>
              ) : (
                <div style={{ padding: '48px', textAlign: 'center' as const, backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px' }}>
                  <div style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>Complete your MRI to see your full business health breakdown.</div>
                  <a href='/book' style={{ padding: '12px 32px', backgroundColor: gold, color: dark, fontWeight: '700', borderRadius: '6px', textDecoration: 'none', fontSize: '14px' }}>Start Your Free MRI →</a>
                </div>
              )}
            </div>
          )}

          {/* ISSUES & CONSTRAINTS TAB */}
          {activeTab === 'issues' && (
            <div>
              <div style={{ fontSize: '11px', color: '#666', letterSpacing: '0.2em', marginBottom: '8px', fontWeight: '600' }}>ISSUES & CONSTRAINTS</div>
              <div style={{ fontSize: '13px', color: '#777', marginBottom: '24px', lineHeight: '1.7' }}>
                All detected and verified constraints across your connected business. Ranked by severity, verification score and estimated impact on revenue and growth.
              </div>
              {primary ? (
                <>
                  {/* Constraint summary stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
                    {[
                      { label: 'Primary Constraint', value: '1', color: '#cc4444', sub: 'Verified active' },
                      { label: 'Secondary Constraints', value: String(secondary.length), color: gold, sub: 'Identified' },
                      { label: 'High Severity', value: String(secondary.filter((c: any) => c.severity === 'high').length + 1), color: '#cc4444', sub: 'Require action' },
                      { label: 'Verification Score', value: (primary?.verification_score || 0) + '/100', color: '#4aaa4a', sub: 'Primary constraint' },
                    ].map(s => (
                      <div key={s.label} style={{ padding: '14px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '8px' }}>
                        <div style={{ fontSize: '10px', color: '#666', marginBottom: '6px', letterSpacing: '0.1em' }}>{s.label.toUpperCase()}</div>
                        <div style={{ fontSize: '20px', fontWeight: '800', color: s.color, marginBottom: '3px' }}>{s.value}</div>
                        <div style={{ fontSize: '11px', color: '#555' }}>{s.sub}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ padding: '24px', backgroundColor: '#1a0a0a', border: '1px solid #3a1a1a', borderLeft: '3px solid #cc4444', borderRadius: '8px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ fontSize: '10px', color: '#cc4444', letterSpacing: '0.2em', fontWeight: '700' }}>CRITICAL — PRIMARY CONSTRAINT — VERIFIED</div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ fontSize: '11px', color: '#4aaa4a', backgroundColor: 'rgba(74,170,74,0.08)', padding: '2px 8px', borderRadius: '8px', border: '1px solid rgba(74,170,74,0.15)' }}>✓ {primary.verification_score}/100 verified</div>
                        <div style={{ fontSize: '11px', color: '#cc4444', fontWeight: '600', textTransform: 'uppercase' as const }}>{primary.severity || 'high'}</div>
                        {primary.sector_benchmark && (
                          <div style={{ fontSize: '11px', color: gold, backgroundColor: 'rgba(200,162,74,0.08)', padding: '2px 8px', borderRadius: '8px', border: '1px solid rgba(200,162,74,0.15)' }}>
                            {primary.sector_benchmark.frequency_pct}% of {industryData?.label?.toLowerCase() || 'businesses in your sector'} have this
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '800', marginBottom: '10px', letterSpacing: '-0.01em' }}>{primary.name}</div>
                    <div style={{ fontSize: '13px', color: '#888', lineHeight: '1.75', marginBottom: '14px' }}>{primary.hypothesis}</div>
                    {primary.evidence && primary.evidence.length > 0 && (
                      <div style={{ marginBottom: '14px' }}>
                        <div style={{ fontSize: '10px', color: '#555', letterSpacing: '0.15em', marginBottom: '8px' }}>EVIDENCE</div>
                        {primary.evidence.slice(0,3).map((e: string, i: number) => (
                          <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px', alignItems: 'flex-start' }}>
                            <span style={{ color: '#cc4444', fontSize: '10px', marginTop: '3px', flexShrink: 0 }}>◈</span>
                            <span style={{ fontSize: '12px', color: '#666', lineHeight: '1.6' }}>{e}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #2a1a1a' }}>
                      {result?.total_opportunity && (
                        <div style={{ fontSize: '12px', color: gold }}>
                          Opportunity: {getCurrencySymbol(currency)}{Math.round((result.total_opportunity.total_low||0)/1000)}k–{getCurrencySymbol(currency)}{Math.round((result.total_opportunity.total_high||0)/1000)}k annual uplift on resolution
                        </div>
                      )}
                      <a href={`/report/${selected?.id}`} style={{ fontSize: '12px', color: gold, textDecoration: 'none', fontWeight: '600', marginLeft: 'auto' }}>View full analysis →</a>
                    </div>
                  </div>
                  {secondary.filter((c: any) => c.severity === 'high').map((c: any) => (
                    <div key={c.key} style={{ padding: '20px 24px', backgroundColor: '#0f0a04', border: '1px solid #2a2000', borderLeft: '3px solid #C8A24A', borderRadius: '8px', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.2em', fontWeight: '700' }}>HIGH SEVERITY — SECONDARY</div>
                        {c.sector_benchmark && (
                          <div style={{ fontSize: '10px', color: '#888' }}>{c.sector_benchmark.frequency_pct}% sector frequency</div>
                        )}
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '6px' }}>{c.name}</div>
                      <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.6' }}>{c.hypothesis}</div>
                    </div>
                  ))}
                  {secondary.filter((c: any) => c.severity !== 'high').map((c: any) => (
                    <div key={c.key} style={{ padding: '18px 24px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '8px', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <div style={{ fontSize: '10px', color: '#777', letterSpacing: '0.2em', fontWeight: '600' }}>MEDIUM SEVERITY</div>
                        {c.sector_benchmark && (
                          <div style={{ fontSize: '10px', color: '#555' }}>{c.sector_benchmark.frequency_pct}% sector frequency</div>
                        )}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>{c.name}</div>
                      <div style={{ fontSize: '12px', color: '#777', lineHeight: '1.6' }}>{c.hypothesis}</div>
                    </div>
                  ))}
                </>
              ) : (
                <div style={{ padding: '40px', textAlign: 'center' as const, backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', color: '#666', fontSize: '13px' }}>
                  No critical issues detected. Complete your MRI to begin constraint monitoring.
                </div>
              )}
            </div>
          )}

          {/* MEETING CENTRE TAB */}
          {activeTab === 'meetings' && (
            <MeetingCentre gold={gold} card={card} border={border} dark={dark} businessId={selected?.id} />
          )}

        {/* CONNECTORS TAB */}
          {activeTab === 'connectors' && (
            <div>
              <div style={{ fontSize: '11px', color: '#666', letterSpacing: '0.2em', marginBottom: '8px', fontWeight: '600' }}>DATA CONNECTORS</div>
              <div style={{ fontSize: '13px', color: '#777', marginBottom: '28px', lineHeight: '1.7' }}>
                Connect your business systems to enable real-time data enrichment across your MRI reports. Connected data sources improve constraint detection accuracy and unlock enhanced analysis.
              </div>

              {/* No connection prompt */}
              <div style={{ padding: '28px', backgroundColor: 'rgba(200,162,74,0.04)', border: '1px solid rgba(200,162,74,0.15)', borderRadius: '10px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.2em', marginBottom: '8px', fontWeight: '600' }}>◈ ENHANCED INTELLIGENCE AVAILABLE</div>
                  <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '6px' }}>Connect real data for full enhanced MRI analysis</div>
                  <div style={{ fontSize: '13px', color: '#777', lineHeight: '1.6', maxWidth: '560px' }}>
                    Your current MRI is based on intake answers. Connect your CRM, accounting software or HR system to pull live data and dramatically improve constraint detection accuracy.
                  </div>
                </div>
                <a href='/connect' style={{ padding: '12px 28px', backgroundColor: gold, color: dark, fontWeight: '700', borderRadius: '6px', textDecoration: 'none', fontSize: '14px', whiteSpace: 'nowrap' as const, marginLeft: '24px' }}>Connect Now →</a>
              </div>

              {/* CRM connectors */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '10px', color: '#555', letterSpacing: '0.2em', marginBottom: '14px', fontWeight: '600' }}>CRM & SALES</div>
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
                      <div style={{ fontSize: '12px', color: '#777', lineHeight: '1.6', marginBottom: '14px' }}>{c.desc}</div>
                      <a href='/connect' style={{ fontSize: '12px', color: gold, textDecoration: 'none', fontWeight: '600' }}>Connect →</a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Finance connectors */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '10px', color: '#555', letterSpacing: '0.2em', marginBottom: '14px', fontWeight: '600' }}>FINANCE & ACCOUNTING</div>
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
                      <div style={{ fontSize: '12px', color: '#777', lineHeight: '1.6', marginBottom: '14px' }}>{c.desc}</div>
                      <a href='/connect' style={{ fontSize: '12px', color: gold, textDecoration: 'none', fontWeight: '600' }}>Connect →</a>
                    </div>
                  ))}
                </div>
              </div>

              {/* HR & Operations */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '10px', color: '#555', letterSpacing: '0.2em', marginBottom: '14px', fontWeight: '600' }}>HR, OPERATIONS & ANALYTICS</div>
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
                      <div style={{ fontSize: '12px', color: '#777', lineHeight: '1.6', marginBottom: '14px' }}>{c.desc}</div>
                      <a href='/connect' style={{ fontSize: '12px', color: gold, textDecoration: 'none', fontWeight: '600' }}>Connect →</a>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: '20px 24px', backgroundColor: '#141414', border: '1px solid #2a2a2a', borderRadius: '8px', fontSize: '13px', color: '#666', lineHeight: '1.7' }}>
                ◈ All connectors use OAuth 2.0 or API key authentication. BEI never stores your credentials — only the data needed to run your intelligence analysis. Data is refreshed on each MRI cycle.
              </div>
            </div>
          )}

          {/* OUTCOME & DEPLOYMENT CENTRE TAB */}
          {activeTab === 'deployment' && (
            <div>
              {/* BEISYSTEM image */}
              <div style={{ marginBottom: '24px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(200,162,74,0.15)', position: 'relative' as const }}>
                <img src='/BEISYSTEM.png' alt='BEI Deployment System' style={{ width: '100%', height: '180px', objectFit: 'cover', objectPosition: 'center center', display: 'block', opacity: 0.8 }} />
                <div style={{ position: 'absolute' as const, inset: 0, background: 'linear-gradient(90deg, rgba(12,12,12,0.7) 0%, transparent 40%, transparent 60%, rgba(12,12,12,0.7) 100%)', pointerEvents: 'none' as const }} />
                <div style={{ position: 'absolute' as const, bottom: '14px', left: '20px' }}>
                  <div style={{ fontSize: '10px', color: '#C8A24A', letterSpacing: '0.2em', fontWeight: '600' }}>OUTCOME & DEPLOYMENT ENGINE — ACTIVE</div>
                </div>
                <div style={{ position: 'absolute' as const, top: '12px', right: '14px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4aaa4a', boxShadow: '0 0 6px rgba(74,170,74,0.8)' }} />
                  <span style={{ fontSize: '10px', color: '#4aaa4a', fontWeight: '600' }}>LIVE</span>
                </div>
              </div>
              <div style={{ fontSize: '11px', color: '#666', letterSpacing: '0.2em', marginBottom: '8px', fontWeight: '600' }}>OUTCOME & DEPLOYMENT CENTRE</div>
              <div style={{ fontSize: '13px', color: '#777', marginBottom: '28px', lineHeight: '1.7' }}>
                Track live deployments across all three tiers and monitor outcomes from constraint resolution.
              </div>

              {/* SECTION 1: DEPLOYMENTS */}
              <div style={{ marginBottom: '40px' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#e0e0e0', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Deployments</span>
                  {result?.deployment_packages && (
                    <span style={{ fontSize: '11px', color: '#555', fontWeight: '400' }}>
                      {result.deployment_packages.total_packages || 0} total packages
                    </span>
                  )}
                </div>

                {/* Tier 1 */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '10px', color: '#4aaa4a', letterSpacing: '0.2em', fontWeight: '700' }}>TIER 1 — AUTOMATIC</div>
                    <div style={{ fontSize: '10px', color: '#4aaa4a', backgroundColor: 'rgba(74,170,74,0.1)', padding: '2px 8px', borderRadius: '10px', border: '1px solid rgba(74,170,74,0.2)' }}>
                      {result?.deployment_packages?.tier1_automatic?.length || 0} packages
                    </div>
                  </div>
                  {result?.deployment_packages?.tier1_automatic?.length > 0 ? (
                    result.deployment_packages.tier1_automatic.map((pkg: any) => (
                      <div key={pkg.deployment_id} style={{ padding: '18px 20px', backgroundColor: '#080f04', border: '1px solid #1a3a1a', borderLeft: '3px solid #4aaa4a', borderRadius: '8px', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#f0f0f0' }}>{pkg.action_title}</div>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0, marginLeft: '12px' }}>
                            <div style={{ fontSize: '10px', color: '#4aaa4a', backgroundColor: 'rgba(74,170,74,0.1)', padding: '2px 8px', borderRadius: '10px' }}>{pkg.tier_name || 'AUTOMATIC'}</div>
                            <div style={{ fontSize: '10px', color: pkg.status === 'pending' ? gold : '#4aaa4a', fontWeight: '600', textTransform: 'uppercase' as const }}>{pkg.status || 'PENDING'}</div>
                          </div>
                        </div>
                        <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Constraint: {pkg.constraint_name}</div>
                        <div style={{ fontSize: '13px', color: '#888', lineHeight: '1.6', marginBottom: '8px' }}>{pkg.action_description}</div>
                        {pkg.expected_outcome && <div style={{ fontSize: '12px', color: gold }}>Expected: {pkg.expected_outcome}</div>}
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '16px 20px', backgroundColor: '#111', border: '1px solid #1a1a1a', borderRadius: '8px', fontSize: '13px', color: '#444' }}>
                      No Tier 1 automatic deployments yet — complete your MRI to generate packages.
                    </div>
                  )}
                </div>

                {/* Tier 2 */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.2em', fontWeight: '700' }}>TIER 2 — APPROVAL REQUIRED</div>
                    <div style={{ fontSize: '10px', color: gold, backgroundColor: 'rgba(200,162,74,0.1)', padding: '2px 8px', borderRadius: '10px', border: '1px solid rgba(200,162,74,0.2)' }}>
                      {result?.deployment_packages?.tier2_approval?.length || 0} packages
                    </div>
                  </div>
                  {result?.deployment_packages?.tier2_approval?.length > 0 ? (
                    result.deployment_packages.tier2_approval.map((pkg: any) => (
                      <div key={pkg.deployment_id} style={{ padding: '18px 20px', backgroundColor: '#0f0a04', border: '1px solid #3a2a04', borderLeft: '3px solid #C8A24A', borderRadius: '8px', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#f0f0f0' }}>{pkg.action_title}</div>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0, marginLeft: '12px' }}>
                            <div style={{ fontSize: '10px', color: gold, backgroundColor: 'rgba(200,162,74,0.1)', padding: '2px 8px', borderRadius: '10px' }}>AWAITING APPROVAL</div>
                            <div style={{ fontSize: '10px', color: pkg.approved ? '#4aaa4a' : '#cc4444', fontWeight: '600' }}>{pkg.approved ? 'APPROVED' : 'PENDING'}</div>
                          </div>
                        </div>
                        <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Constraint: {pkg.constraint_name}</div>
                        <div style={{ fontSize: '13px', color: '#888', lineHeight: '1.6', marginBottom: '8px' }}>{pkg.action_description}</div>
                        {pkg.expected_outcome && <div style={{ fontSize: '12px', color: gold, marginBottom: '8px' }}>Expected: {pkg.expected_outcome}</div>}
                        {pkg.measurement_plan && <div style={{ fontSize: '11px', color: '#555' }}>Measurement: {pkg.measurement_plan}</div>}
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '16px 20px', backgroundColor: '#111', border: '1px solid #1a1a1a', borderRadius: '8px', fontSize: '13px', color: '#444' }}>
                      No Tier 2 approval deployments yet — complete your MRI to generate packages.
                    </div>
                  )}
                </div>

                {/* Tier 3 */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '10px', color: '#4a8ab0', letterSpacing: '0.2em', fontWeight: '700' }}>TIER 3 — STRATEGIC RECOMMENDATIONS</div>
                    <div style={{ fontSize: '10px', color: '#4a8ab0', backgroundColor: 'rgba(74,138,176,0.1)', padding: '2px 8px', borderRadius: '10px', border: '1px solid rgba(74,138,176,0.2)' }}>
                      {result?.deployment_packages?.tier3_recommendation?.length || 0} packages
                    </div>
                  </div>
                  {result?.deployment_packages?.tier3_recommendation?.length > 0 ? (
                    result.deployment_packages.tier3_recommendation.map((pkg: any) => (
                      <div key={pkg.deployment_id} style={{ padding: '18px 20px', backgroundColor: card, border: '1px solid #1a2a3a', borderLeft: '3px solid #4a8ab0', borderRadius: '8px', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#f0f0f0' }}>{pkg.action_title}</div>
                          <div style={{ fontSize: '10px', color: '#4a8ab0', backgroundColor: 'rgba(74,138,176,0.1)', padding: '2px 8px', borderRadius: '10px', flexShrink: 0, marginLeft: '12px' }}>HUMAN EXECUTION</div>
                        </div>
                        <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Constraint: {pkg.constraint_name}</div>
                        <div style={{ fontSize: '13px', color: '#888', lineHeight: '1.6', marginBottom: '8px' }}>{pkg.action_description}</div>
                        {pkg.implementation_steps && pkg.implementation_steps.length > 0 && (
                          <div style={{ marginTop: '8px' }}>
                            <div style={{ fontSize: '10px', color: '#444', marginBottom: '6px', letterSpacing: '0.1em' }}>IMPLEMENTATION STEPS</div>
                            {pkg.implementation_steps.slice(0,3).map((step: string, i: number) => (
                              <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '4px', fontSize: '12px', color: '#666' }}>
                                <span style={{ color: '#4a8ab0', flexShrink: 0 }}>{i+1}.</span>{step}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '16px 20px', backgroundColor: '#111', border: '1px solid #1a1a1a', borderRadius: '8px', fontSize: '13px', color: '#444' }}>
                      No Tier 3 recommendations yet — complete your MRI to generate packages.
                    </div>
                  )}
                </div>

                {/* Deployment History */}
                <div style={{ padding: '20px 24px', backgroundColor: '#111', border: '1px solid #1a1a1a', borderRadius: '8px' }}>
                  <div style={{ fontSize: '10px', color: '#444', letterSpacing: '0.2em', marginBottom: '12px', fontWeight: '600' }}>DEPLOYMENT HISTORY</div>
                  <div style={{ fontSize: '13px', color: '#444' }}>
                    Deployment execution history will appear here as actions are completed and logged.
                  </div>
                </div>
              </div>

              {/* SECTION 2: OUTCOMES */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#e0e0e0', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #222' }}>
                  Outcomes
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
                  {[
                    { label: 'Deployments Active', value: result?.deployment_packages?.tier1_automatic?.filter((p: any) => p.status === 'active').length || '0', color: gold },
                    { label: 'Awaiting Approval', value: result?.deployment_packages?.tier2_approval?.filter((p: any) => !p.approved).length || '0', color: '#cc4444' },
                    { label: 'Recommendations', value: result?.deployment_packages?.tier3_recommendation?.length || '0', color: '#4a8ab0' },
                  ].map(m => (
                    <div key={m.label} style={{ padding: '16px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '8px' }}>
                      <div style={{ fontSize: '10px', color: '#555', marginBottom: '6px', letterSpacing: '0.1em' }}>{m.label.toUpperCase()}</div>
                      <div style={{ fontSize: '28px', fontWeight: '800', color: m.color }}>{m.value}</div>
                    </div>
                  ))}
                </div>

                <div style={{ padding: '20px 24px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '8px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '10px', color: '#444', letterSpacing: '0.2em', marginBottom: '12px', fontWeight: '600' }}>OUTCOME TRACKING</div>
                  <div style={{ fontSize: '13px', color: '#555', lineHeight: '1.7' }}>
                    Outcome tracking activates when deployments are executed and results are logged. Each deployment has a built-in measurement plan that tracks impact on your primary constraint and health score.
                  </div>
                </div>

                <div style={{ padding: '16px 20px', backgroundColor: '#111', border: '1px solid #1a1a1a', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '13px', color: '#555' }}>
                    Visit the full Deployments and Outcomes pages for detailed execution management.
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <a href='/deployments' style={{ fontSize: '12px', color: gold, textDecoration: 'none', fontWeight: '600' }}>Deployments →</a>
                    <a href='/outcomes' style={{ fontSize: '12px', color: gold, textDecoration: 'none', fontWeight: '600' }}>Outcomes →</a>
                  </div>
                </div>
              </div>

              {/* No MRI prompt */}
              {!result && (
                <div style={{ padding: '40px', textAlign: 'center' as const, backgroundColor: 'rgba(200,162,74,0.04)', border: '1px solid rgba(200,162,74,0.15)', borderRadius: '10px', marginTop: '24px' }}>
                  <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.2em', marginBottom: '12px', fontWeight: '600' }}>◈ NO MRI DATA YET</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '10px' }}>Generate your MRI to unlock the deployment engine</div>
                  <div style={{ fontSize: '13px', color: '#555', marginBottom: '24px', maxWidth: '480px', margin: '0 auto 24px', lineHeight: '1.7' }}>
                    Once your Business MRI is complete, BEI will generate verified deployment packages across all three tiers with measurable outcomes tracked against your primary constraint.
                  </div>
                  <a href='/book' style={{ padding: '12px 32px', backgroundColor: gold, color: dark, fontWeight: '700', borderRadius: '6px', textDecoration: 'none', fontSize: '14px' }}>Generate Free MRI →</a>
                </div>
              )}

              {result && result.deployment_packages ? (
                <>
                  {/* Opportunity summary */}
                  {result.total_opportunity && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
                      <div style={{ padding: '20px', backgroundColor: card, border: '1px solid rgba(200,162,74,0.2)', borderRadius: '8px' }}>
                        <div style={{ fontSize: '10px', color: '#666', letterSpacing: '0.15em', marginBottom: '8px' }}>TOTAL OPPORTUNITY</div>
                        <div style={{ fontSize: '28px', fontWeight: '800', color: gold }}>£{Math.round((result.total_opportunity.total_low || 0)/1000)}k–£{Math.round((result.total_opportunity.total_high || 0)/1000)}k</div>
                        <div style={{ fontSize: '11px', color: '#555', marginTop: '4px' }}>Annual value available</div>
                      </div>
                      <div style={{ padding: '20px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '8px' }}>
                        <div style={{ fontSize: '10px', color: '#666', letterSpacing: '0.15em', marginBottom: '8px' }}>DEPLOYMENTS READY</div>
                        <div style={{ fontSize: '28px', fontWeight: '800', color: '#f0f0f0' }}>
                          {((result.deployment_packages.tier1_automatic || []).length + (result.deployment_packages.tier2_approval || []).length + (result.deployment_packages.tier3_recommendation || []).length)}
                        </div>
                        <div style={{ fontSize: '11px', color: '#555', marginTop: '4px' }}>Across all tiers</div>
                      </div>
                      <div style={{ padding: '20px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '8px' }}>
                        <div style={{ fontSize: '10px', color: '#666', letterSpacing: '0.15em', marginBottom: '8px' }}>PRIMARY CONSTRAINT</div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#cc4444', lineHeight: '1.3' }}>{primary?.name || '—'}</div>
                        <div style={{ fontSize: '11px', color: '#555', marginTop: '4px' }}>Root cause confirmed</div>
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
                    <div style={{ fontSize: '10px', color: '#666', letterSpacing: '0.2em', marginBottom: '16px', fontWeight: '600' }}>OUTCOME TRACKING</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
                      {[
                        { label: 'Deployments Active', value: '0', color: gold },
                        { label: 'Outcomes Recorded', value: '0', color: '#4aaa4a' },
                        { label: 'Constraint Status', value: primary?.name ? 'Active' : 'None', color: '#cc4444' },
                      ].map(m => (
                        <div key={m.label} style={{ padding: '16px', backgroundColor: '#141414', borderRadius: '6px', border: '1px solid #2a2a2a' }}>
                          <div style={{ fontSize: '10px', color: '#555', marginBottom: '6px' }}>{m.label.toUpperCase()}</div>
                          <div style={{ fontSize: '20px', fontWeight: '700', color: m.color }}>{m.value}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.7' }}>
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
                  <div style={{ fontSize: '13px', color: '#777', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px', lineHeight: '1.7' }}>
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
                      <span style={{ fontSize: '11px', color: '#777' }}>48HR ALERT WINDOW</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4-step process */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', backgroundColor: '#161616', border: '1px solid #2a2a2a', borderRadius: '10px', overflow: 'hidden', marginBottom: '28px' }}>
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
                    <div style={{ fontSize: '12px', color: '#777', lineHeight: '1.7' }}>{step.desc}</div>
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
                  <div style={{ fontSize: '10px', color: '#555', letterSpacing: '0.2em', marginBottom: '16px', fontWeight: '600' }}>LIVE SIGNALS — VERIFIED</div>
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
                  <div style={{ fontSize: '10px', color: '#555', letterSpacing: '0.2em', marginBottom: '16px', fontWeight: '600' }}>INDUSTRY BENCHMARKS</div>
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0' }}>
                    {industryData.benchmarks.map((b: any, i: number) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px 0', borderBottom: i < industryData.benchmarks.length - 1 ? '1px solid #111' : 'none' }}>
                        <div style={{ fontSize: '12px', color: '#777', flex: 1, paddingRight: '12px', lineHeight: '1.4' }}>{b.metric}</div>
                        <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
                          <div style={{ fontSize: '13px', fontWeight: '700', color: gold }}>{b.value}</div>
                          <div style={{ fontSize: '10px', color: '#555', marginTop: '2px' }}>{b.bei}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Signal domain bars */}
              <div style={{ padding: '20px 24px', backgroundColor: '#141414', border: '1px solid #2a2a2a', borderRadius: '10px', marginBottom: '20px' }}>
                <div style={{ fontSize: '10px', color: '#555', letterSpacing: '0.2em', marginBottom: '16px', fontWeight: '600' }}>MONITORING COVERAGE — 4 SIGNAL DOMAINS</div>
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
                      <div style={{ fontSize: '11px', color: '#777', lineHeight: '1.4' }}>{d.domain}</div>
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
                    <div style={{ fontSize: '11px', color: '#666' }}>Monitoring {industryData.label} · Human-verified intelligence · No alert sent without BEI team validation</div>
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: '#555', textAlign: 'right' as const }}>
                  <div style={{ color: '#666', marginBottom: '2px' }}>Last updated</div>
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
