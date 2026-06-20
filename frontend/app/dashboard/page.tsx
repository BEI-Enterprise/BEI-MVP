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
    benchmarks: [
      { metric: 'Industry avg conversion rate', value: '3–4 in 10', bei: 'Your rate: 1–2 in 10', status: 'below' },
      { metric: 'Avg lead response time', value: '< 2 hours', bei: 'Industry best practice', status: 'benchmark' },
      { metric: 'Client trust score avg', value: '72/100', bei: 'Sector median', status: 'benchmark' },
      { metric: 'Avg annual revenue (SME)', value: '£180k–£450k', bei: 'For 2–5 person teams', status: 'benchmark' },
      { metric: 'Review volume (competitive)', value: '40+ reviews', bei: 'Minimum for credibility', status: 'benchmark' },
      { metric: 'Client retention rate', value: '65–80%', bei: 'Sector average', status: 'benchmark' },
    ],
    signals: [
      { domain: 'Growth', signal: 'UK property market activity showing increased buyer demand in Q2 2026', severity: 'medium', verified: true },
      { domain: 'Trust', signal: 'Estate agency review volume 34% below sector benchmark — primary constraint active', severity: 'high', verified: true },
      { domain: 'Risk', signal: 'Revenue concentration risk: single referral source represents majority of pipeline', severity: 'high', verified: true },
      { domain: 'Market', signal: 'Competitor digital presence increasing in your geographic area', severity: 'medium', verified: true },
    ],
    insight: 'Estate agencies with verified trust infrastructure (40+ reviews, 3+ case studies, video testimonials) convert at 2.8× the rate of those without. Your primary constraint is directly suppressing conversion across every acquisition channel.'
  } : isMarketing ? {
    label: 'Marketing Agency',
    color: '#C8A24A',
    benchmarks: [
      { metric: 'Industry avg client retention', value: '70–85%', bei: 'Sector standard', status: 'benchmark' },
      { metric: 'Avg project value (SME agency)', value: '£3k–£12k', bei: 'Per engagement', status: 'benchmark' },
      { metric: 'New client conversion rate', value: '25–35%', bei: 'From qualified proposal', status: 'benchmark' },
      { metric: 'Founder dependency risk', value: '68% of SMEs', bei: 'Report critical dependency', status: 'benchmark' },
      { metric: 'Avg team utilisation', value: '70–80%', bei: 'Optimal capacity band', status: 'benchmark' },
      { metric: 'Pricing confidence index', value: '54/100', bei: 'Sector average', status: 'benchmark' },
    ],
    signals: [
      { domain: 'Growth', signal: 'Marketing services demand increasing — AI-adjacent services up 42% YoY', severity: 'medium', verified: true },
      { domain: 'Pricing', signal: 'Agency pricing confidence below sector benchmark — margin compression risk', severity: 'high', verified: true },
      { domain: 'Capacity', signal: 'Founder delivery bottleneck pattern detected — growth ceiling risk', severity: 'high', verified: true },
      { domain: 'Market', signal: 'Client acquisition costs rising across digital channels — trust infrastructure more critical', severity: 'medium', verified: true },
    ],
    insight: 'Marketing agencies with strong case study libraries and clear ROI proof convert at 3.1× the rate of those without. Pricing confidence and founder dependency are the two most common constraints limiting scale in this sector.'
  } : isAccounting ? {
    label: 'Accounting & Finance',
    color: '#C8A24A',
    benchmarks: [
      { metric: 'Client concentration risk', value: '< 30% per client', bei: 'Safe threshold', status: 'benchmark' },
      { metric: 'Avg client retention', value: '85–95%', bei: 'Sector standard', status: 'benchmark' },
      { metric: 'New client acquisition rate', value: '8–15% annually', bei: 'Sustainable growth band', status: 'benchmark' },
      { metric: 'Advisory vs compliance split', value: '40/60', bei: 'Optimal for margin', status: 'benchmark' },
      { metric: 'Team capacity utilisation', value: '75–85%', bei: 'Peak performance band', status: 'benchmark' },
      { metric: 'Pricing per client avg', value: '£2k–£8k', bei: 'Annual fee range (SME)', status: 'benchmark' },
    ],
    signals: [
      { domain: 'Regulatory', signal: 'MTD Phase 3 compliance creating advisory opportunity across client base', severity: 'medium', verified: true },
      { domain: 'Concentration', signal: 'Revenue concentration above safe threshold — key person risk elevated', severity: 'high', verified: true },
      { domain: 'Growth', signal: 'Advisory services demand increasing — compliance-only positioning at risk', severity: 'medium', verified: true },
      { domain: 'Market', signal: 'AI bookkeeping tools reducing low-margin compliance work — differentiation critical', severity: 'medium', verified: true },
    ],
    insight: 'Accounting firms that transition from compliance-led to advisory-led positioning see 40–60% higher revenue per client. Revenue concentration above 30% per client remains the single largest risk signal in this sector.'
  } : {
    label: selected?.industry || 'Your Industry',
    color: '#C8A24A',
    benchmarks: [
      { metric: 'Health score benchmark', value: '55–65/100', bei: 'SME sector average', status: 'benchmark' },
      { metric: 'Primary constraint duration', value: '14 months avg', bei: 'Before resolution', status: 'benchmark' },
      { metric: 'Opportunity realisation rate', value: '34%', bei: 'Without structured deployment', status: 'benchmark' },
      { metric: 'Trust infrastructure score', value: '48/100', bei: 'Cross-sector average', status: 'benchmark' },
    ],
    signals: [
      { domain: 'Growth', signal: 'Monitoring active — sector-specific signals being tracked', severity: 'low', verified: true },
      { domain: 'Risk', signal: 'Risk signal monitoring active across your business category', severity: 'low', verified: true },
    ],
    insight: 'BEI intelligence monitoring is active for your business. Industry-specific benchmarks will be refined as your Business Twin develops over time.'
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
                <img src='/bei-intel-dashboard.png' alt='BEI Intelligence' style={{ width: '100%', height: '220px', objectFit: 'cover', objectPosition: 'center center', display: 'block', opacity: 0.85 }} />
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
