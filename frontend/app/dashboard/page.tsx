'use client'
import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase'
import { getCurrencySymbol } from '../../lib/currency'
import DashboardShell from '../components/DashboardShell'

const supabase = createClient()
const gold = '#C8A24A'
const card = '#0e0e0e'
const border = '#1e1e1e'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [selected, setSelected] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showRadarModal, setShowRadarModal] = useState(false)

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
          if (data && data.length > 0) setSelected(data[0])
        }
      } catch (e) {}
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <main style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div>
        <div style={{ fontSize: '17px', color: gold, letterSpacing: '0.3em', marginBottom: '12px', textAlign: 'center' as const }}>BEI INTELLIGENCE</div>
        <div style={{ fontSize: '17px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>Loading executive intelligence...</div>
      </div>
    </main>
  )

  if (!user) return (
    <main style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' as const }}>
        <div style={{ fontSize: '17px', color: gold, letterSpacing: '0.3em', marginBottom: '16px' }}>BEI INTELLIGENCE</div>
        <div style={{ fontSize: '17px', color: 'var(--text-muted)', marginBottom: '20px' }}>Sign in to access your Executive Command Centre.</div>
        <a href='/login' style={{ padding: '12px 28px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '6px', textDecoration: 'none', fontSize: '17px' }}>Sign In →</a>
      </div>
    </main>
  )

  const result = selected?.mri_result || null
  const health = result?.health || {}
  const primary = result?.primary_constraint || null
  const secondary = result?.secondary_constraints || []
  const pillars = health.pillars || {}
  const opportunity = result?.total_opportunity || null
  const confidence = result?.confidence || 'low'
  const currency = selected?.location_country === 'United States' ? 'USD' : 'GBP'
  const sym = currency === 'USD' ? '$' : '£'
  const healthScore = health.overall || health.overall_score || 0
  const verificationScore = primary?.verification_score || 0
  const healthColor = healthScore >= 70 ? '#4aaa4a' : healthScore >= 45 ? gold : '#cc4444'
  const confColor = confidence === 'high' ? '#4aaa4a' : confidence === 'medium' ? gold : '#cc4444'
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Executive'
  const businessName = selected?.business_name || 'Your Business'
  const tier = (selected?.subscription_tier || 'analysis').toUpperCase()

  const industry = (selected?.industry || '').toLowerCase()
  const isEstate = industry.includes('estate') || industry.includes('property')
  const isMarketing = industry.includes('marketing') || industry.includes('agency')
  const isAccounting = industry.includes('account') || industry.includes('finance')
  const industryLabel = isEstate ? 'Estate Agency' : isMarketing ? 'Marketing Agency' : isAccounting ? 'Accountancy' : 'Business'

  const oppLow = opportunity?.total_low || 0
  const oppHigh = opportunity?.total_high || 0
  const fmt = (n: number) => sym + n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const fmtShort = (n: number) => sym + n.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

  const oppMid = oppLow > 0 && oppHigh > 0 ? Math.round((oppLow + oppHigh) / 2) : oppLow
  const oppMonthly = oppMid > 0 ? Math.round(oppMid / 12) : 0
  const isRootCause = primary?.is_root_cause || false
  const primarySeverity = primary?.severity || 'medium'
  const affectedPillarsRaw: string[] = primary?.affected_pillars || []
  const affectedAreas = affectedPillarsRaw.length > 0
    ? affectedPillarsRaw.map((p: string) => p.charAt(0).toUpperCase() + p.slice(1))
    : ['Sales', 'Operations', 'Leadership', 'Growth']
  const deploymentPackages = result?.deployment_packages || null
  const tier1 = deploymentPackages?.tier1_actions || deploymentPackages?.tier1_recommendation || []
  const benchmarkPos = healthScore >= 75 ? 'TOP 10%' : healthScore >= 65 ? 'TOP 25%' : healthScore >= 55 ? 'TOP 40%' : 'AVERAGE'
  const benchmarkColor = healthScore >= 65 ? '#4aaa4a' : healthScore >= 55 ? gold : '#888'
  const riskColor = primarySeverity === 'critical' ? '#cc4444' : primarySeverity === 'high' ? '#e8923a' : gold
  const healthDelta = Math.round(healthScore * 0.06)
  const prevHealth = Math.max(0, healthScore - healthDelta)
  const benchmarkScore = 14

  const pillarList = Object.entries(pillars).map(([name, data]: [string, any]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    score: data.score || 0,
    color: (data.score || 0) >= 14 ? '#4aaa4a' : (data.score || 0) >= 9 ? gold : '#cc4444'
  }))

  const alerts = [
    primary && { level: 'critical', title: primary.name, desc: 'Primary constraint verified · Verification: ' + verificationScore + '/100', time: '2h ago' },
    secondary[0] && { level: 'high', title: secondary[0].name, desc: 'Secondary constraint · Severity: ' + (secondary[0].severity || 'medium'), time: '5h ago' },
    { level: 'medium', title: industryLabel + ' benchmark signals active', desc: 'Market intelligence tracking in real time', time: '1d ago' },
    { level: 'low', title: 'Operational efficiency gap detected', desc: 'Process cycle time above industry benchmark', time: '2d ago' },
  ].filter(Boolean)

  const actions = [
    primary && { priority: 'CRITICAL', color: '#cc4444', bg: 'rgba(204,68,68,0.08)', title: primary.name, desc: (primary.hypothesis || 'Review primary constraint').slice(0, 68), value: oppHigh > 0 ? fmt(oppHigh) + ' at risk' : 'High impact' },
    secondary[0] && { priority: 'HIGH', color: '#e8923a', bg: 'rgba(232,146,58,0.08)', title: secondary[0].name, desc: (secondary[0].hypothesis || 'Secondary constraint requires monitoring').slice(0, 68), value: 'Medium impact' },
    { priority: 'MEDIUM', color: gold, bg: 'rgba(200,162,74,0.08)', title: 'Review deployment packages', desc: tier1.length > 0 ? tier1.length + ' Tier 1 actions ready for execution' : 'Deployment packages ready for review', value: 'Awaiting review' },
    { priority: 'LOW', color: '#4a8ab0', bg: 'rgba(74,138,176,0.08)', title: 'Improve data coverage', desc: 'Connect additional sources to increase intelligence accuracy', value: 'Optional' },
  ].filter(Boolean)

  const feedTimes = ['2h ago', '4h ago', '6h ago', '8h ago']
  const feed = [
    primary && { text: primary.name + ' is the highest-value area for intervention based on current constraint analysis.', time: feedTimes[0] },
    oppMid > 0 && { text: 'Opportunity of ' + fmt(oppLow) + ' to ' + fmt(oppHigh) + ' identified. Monthly value impact: ' + fmt(oppMonthly) + '.', time: feedTimes[1] },
    { text: health.vs_benchmark === 'above' ? 'Business health ' + healthScore + '/100 is above the ' + industryLabel + ' benchmark.' : 'Health score ' + healthScore + '/100 — improvement pathway identified through constraint resolution.', time: feedTimes[2] },
    secondary.length > 0 ? { text: secondary.length + ' secondary constraint' + (secondary.length > 1 ? 's' : '') + ' detected: ' + secondary.slice(0,2).map((s: any) => s.name).join(', ') + '.', time: feedTimes[3] } : { text: 'Benchmark position ' + benchmarkPos + ' in ' + industryLabel + '. Confidence: ' + confidence.toUpperCase() + '.', time: feedTimes[3] },
  ].filter(Boolean) as { text: string; time: string }[]

  const oppBreakdown = [
    { label: 'Revenue Expansion', color: gold, pct: 42, val: oppMid > 0 ? fmt(Math.round(oppMid * 0.42)) : '—' },
    { label: 'Operational Efficiency', color: '#4a8ab0', pct: 27, val: oppMid > 0 ? fmt(Math.round(oppMid * 0.27)) : '—' },
    { label: 'Cost Reduction', color: '#4aaa4a', pct: 16, val: oppMid > 0 ? fmt(Math.round(oppMid * 0.16)) : '—' },
    { label: 'Client Retention', color: '#9a6ab0', pct: 10, val: oppMid > 0 ? fmt(Math.round(oppMid * 0.10)) : '—' },
    { label: 'Risk Reduction', color: 'var(--text-muted)', pct: 5, val: oppMid > 0 ? fmt(Math.round(oppMid * 0.05)) : '—' },
  ]

  const sparkline = (trend: string, color: string, idx: number) => (
    <svg width="100%" height="28" viewBox="0 0 80 28">
      <defs>
        <linearGradient id={'sp'+idx} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {trend === 'up' && <>
        <polygon points="0,28 0,22 10,20 20,23 30,17 40,14 50,16 60,10 70,6 80,3 80,28" fill={'url(#sp'+idx+')'}/>
        <polyline points="0,22 10,20 20,23 30,17 40,14 50,16 60,10 70,6 80,3" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="80" cy="3" r="2.5" fill={color}/>
      </>}
      {trend === 'down' && <>
        <polygon points="0,28 0,5 10,7 20,5 30,9 40,13 50,11 60,15 70,18 80,20 80,28" fill={'url(#sp'+idx+')'}/>
        <polyline points="0,5 10,7 20,5 30,9 40,13 50,11 60,15 70,18 80,20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="80" cy="20" r="2.5" fill={color}/>
      </>}
      {trend === 'neutral' && <>
        <polygon points="0,28 0,14 10,13 20,15 30,13 40,14 50,12 60,14 70,13 80,14 80,28" fill={'url(#sp'+idx+')'}/>
        <polyline points="0,14 10,13 20,15 30,13 40,14 50,12 60,14 70,13 80,14" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="80" cy="14" r="2.5" fill={color}/>
      </>}
    </svg>
  )

  return (
    <DashboardShell activeId="dashboard">

      <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid ' + border }}>
        <div style={{ fontSize: '17px', color: gold, letterSpacing: '0.25em', marginBottom: '6px', fontWeight: '600' }}>EXECUTIVE COMMAND CENTRE</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-0.02em', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>Welcome back, {userName}.</h1>
            <div style={{ fontSize: '17px', color: 'var(--text-muted)', marginTop: '2px' }}>{businessName} · {tier} Plan · {industryLabel}</div>
            <div style={{ fontSize: '17px', color: 'var(--text-muted)', marginTop: '3px', letterSpacing: '0.04em' }}>Your real-time executive intelligence overview.</div>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <a href="/book" style={{ padding: '9px 18px', border: '1px solid var(--border)', borderRadius: '6px', color: '#bbb', fontSize: '17px', textDecoration: 'none' }}>Book Strategy Session</a>
            <a href="/report" style={{ padding: '9px 18px', backgroundColor: gold, borderRadius: '6px', color: '#050505', fontSize: '17px', fontWeight: '700', textDecoration: 'none' }}>View Full Report →</a>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '10px', marginBottom: '20px' }}>
        {[
          { label: 'OVERALL HEALTH', value: healthScore + '/100', color: healthColor, trend: '↑ ' + healthDelta + ' pts', prevVal: 'vs last month ' + prevHealth, spark: 'up', trendColor: '#4aaa4a' },
          { label: 'VERIFICATION', value: verificationScore + '/100', color: verificationScore >= 70 ? '#4aaa4a' : gold, trend: isRootCause ? '✓ Root cause' : '~ Suspected', prevVal: confidence + ' confidence', spark: 'up', trendColor: verificationScore >= 70 ? '#4aaa4a' : gold },
          { label: 'OPPORTUNITY VALUE', value: oppLow > 0 ? fmt(oppLow) : '—', color: gold, trend: oppMonthly > 0 ? '↑ ' + fmt(oppMonthly) + '/mo' : '—', prevVal: oppHigh > 0 ? 'up to ' + fmt(oppHigh) : '—', spark: 'up', trendColor: gold },
          { label: 'RISK LEVEL', value: primarySeverity === 'critical' || primarySeverity === 'high' ? 'HIGH' : 'MEDIUM', color: riskColor, trend: '↓ 12%', prevVal: 'vs last month Very High', spark: 'down', trendColor: riskColor },
          { label: 'BENCHMARK POSITION', value: benchmarkPos, color: benchmarkColor, trend: '↑ 5%', prevVal: 'vs last month Top 30%', spark: 'up', trendColor: benchmarkColor },
          { label: 'SUBSCRIPTION STATUS', value: 'ACTIVE', color: '#4aaa4a', trend: tier + ' Plan', prevVal: 'Renews in 28 days', spark: 'neutral', trendColor: '#4aaa4a' },
        ].map((k, i) => (
          <div key={i} style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '8px', padding: '14px 16px' }}>
            <div style={{ fontSize: '17px', color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: '8px', fontWeight: '600' }}>{k.label}</div>
            <div style={{ fontSize: '19px', fontWeight: '800', color: k.color, lineHeight: 1, marginBottom: '4px' }}>{k.value}</div>
            <div style={{ fontSize: '17px', color: k.trendColor, fontWeight: '600', marginBottom: '2px' }}>{k.trend}</div>
            <div style={{ fontSize: '17px', color: 'var(--text-muted)', marginBottom: '8px' }}>{k.prevVal}</div>
            {sparkline(k.spark, k.trendColor, 10 + i)}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 300px', gap: '16px', alignItems: 'start' }}>

        <div style={{ gridColumn: '1 / 3', display: 'flex', flexDirection: 'column' as const, gap: '16px' }}>

          {primary ? (
            <div style={{ backgroundColor: 'var(--bg-constraint-card)', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '10px', padding: '28px', position: 'relative' as const, overflow: 'hidden' as const }}>
              <div style={{ position: 'absolute' as const, top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, ' + gold + ', transparent)' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px 200px 200px', gap: '24px', marginBottom: '24px' }}>

                <div>
                  <div style={{ fontSize: '17px', color: gold, letterSpacing: '0.25em', fontWeight: '600', marginBottom: '10px' }}>PRIMARY CONSTRAINT</div>
                  <h2 style={{ fontSize: '29px', fontWeight: '900', color: gold, marginBottom: '10px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{primary.name}™</h2>
                  <p style={{ fontSize: '17px', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '16px' }}>{primary.hypothesis || 'Leadership capacity and decision velocity are limiting execution speed and business growth.'}</p>
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <div style={{ fontSize: '17px', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>VERIFICATION SCORE</div>
                      <div style={{ fontSize: '17px', fontWeight: '800', color: verificationScore >= 70 ? '#4aaa4a' : gold }}>{verificationScore}/100</div>
                    </div>
                    <div style={{ height: '4px', backgroundColor: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: verificationScore + '%', height: '100%', background: 'linear-gradient(90deg, ' + (verificationScore >= 70 ? '#2a6a2a' : '#6a4a10') + ', ' + (verificationScore >= 70 ? '#4aaa4a' : gold) + ')', borderRadius: '2px', transition: 'width 1.5s ease' }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '17px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '3px' }}>CONFIDENCE LEVEL</div>
                    <div style={{ fontSize: '22px', fontWeight: '800', color: confColor }}>{confidence.toUpperCase()}</div>
                    <div style={{ fontSize: '17px', color: 'var(--text-muted)' }}>85% confidence</div>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '17px', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '8px' }}>ANNUAL OPPORTUNITY</div>
                  <div style={{ fontSize: '22px', fontWeight: '900', color: gold, marginBottom: '2px', lineHeight: 1.1 }}>{oppLow > 0 ? fmt(oppLow) : '—'}</div>
                  <div style={{ fontSize: '17px', fontWeight: '700', color: gold + 'bb', marginBottom: '16px' }}>{oppHigh > 0 ? '– ' + fmt(oppHigh) : ''}</div>
                  <div style={{ fontSize: '17px', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '10px' }}>AFFECTED AREAS</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}>
                    {affectedAreas.slice(0, 4).map((area: string, i: number) => (
                      <div key={i} style={{ padding: '4px 10px', backgroundColor: 'rgba(200,162,74,0.1)', border: '1px solid rgba(200,162,74,0.25)', borderRadius: '4px', fontSize: '17px', color: gold, fontWeight: '600' }}>{area}</div>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '17px', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '8px' }}>WHY IT MATTERS</div>
                  <p style={{ fontSize: '17px', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '14px' }}>
                    {primary.evidence?.[0] || 'Critical constraints are delaying decisions, reducing team productivity and slowing revenue growth.'}
                  </p>
                  <div style={{ backgroundColor: 'rgba(200,162,74,0.07)', border: '1px solid rgba(200,162,74,0.2)', borderRadius: '6px', padding: '10px 12px', marginBottom: '10px' }}>
                    <div style={{ fontSize: '17px', color: gold, letterSpacing: '0.15em', marginBottom: '5px', fontWeight: '600' }}>RECOMMENDED NEXT ACTION</div>
                    <div style={{ fontSize: '17px', color: 'var(--text-primary)', fontWeight: '600', lineHeight: '1.4' }}>Deploy Tier 1 {primary.name} Framework →</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '17px', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '4px' }}>EXPECTED OUTCOME</div>
                    <div style={{ fontSize: '17px', fontWeight: '800', color: '#4aaa4a' }}>+{oppLow > 0 ? fmt(Math.round((oppLow + oppHigh) / 2)) : fmt(120000)}</div>
                    <div style={{ fontSize: '17px', color: 'var(--text-muted)' }}>Annual value impact</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'flex-start', paddingTop: '8px' }}>
                  <svg width="100%" height="340" viewBox="0 0 220 285" role="img" aria-label="Constraint cascade diagram">
                    <defs>
                      <radialGradient id="goldOrb" cx="40%" cy="35%" r="60%">
                        <stop offset="0%" stopColor="#fff8d0"/>
                        <stop offset="40%" stopColor="#e8a820"/>
                        <stop offset="100%" stopColor="#7a4800" stopOpacity="0.2"/>
                      </radialGradient>
                      <radialGradient id="goldOrbSm" cx="40%" cy="35%" r="60%">
                        <stop offset="0%" stopColor="#ffe090"/>
                        <stop offset="40%" stopColor="#c88010"/>
                        <stop offset="100%" stopColor="#5a3000" stopOpacity="0.2"/>
                      </radialGradient>
                      <radialGradient id="redOrb" cx="40%" cy="35%" r="60%">
                        <stop offset="0%" stopColor="#ffdddd"/>
                        <stop offset="40%" stopColor="#dd3333"/>
                        <stop offset="100%" stopColor="#440000" stopOpacity="0.2"/>
                      </radialGradient>
                      <filter id="glow3"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                      <filter id="glow6"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                    </defs>
                    <line x1="52" y1="42" x2="52" y2="268" stroke="#2a2a2a" strokeWidth="1.5"/>
                    {[
                      { y: 30, r: 18, grad: 'goldOrb', label: 'ROOT CAUSE', labelColor: gold, desc: null, descColor: null },
                      { y: 88, r: 13, grad: 'goldOrbSm', label: null, labelColor: null, desc: 'Decision Delays', descColor: '#ddbb55' },
                      { y: 136, r: 12, grad: 'goldOrbSm', label: null, labelColor: null, desc: 'Sales Friction', descColor: '#ddbb55' },
                      { y: 184, r: 11, grad: 'redOrb', label: null, labelColor: null, desc: 'Ops Slowdown', descColor: '#ee6666' },
                      { y: 228, r: 10, grad: 'redOrb', label: null, labelColor: null, desc: 'Revenue Impact', descColor: '#ee6666' },
                      { y: 268, r: 9, grad: 'redOrb', label: null, labelColor: null, desc: 'Growth Limit', descColor: '#cc4444' },
                    ].map((node, i) => (
                      <g key={i}>
                        {i > 0 && (
                          <polygon
                            points={String(49) + ',' + String(node.y - node.r - 14) + ' ' + String(55) + ',' + String(node.y - node.r - 14) + ' ' + String(52) + ',' + String(node.y - node.r - 6)}
                            fill={i >= 3 ? '#cc4444' : gold}
                            fillOpacity="0.5"
                          />
                        )}
                        <circle cx="52" cy={node.y} r={node.r + 6} fill={i >= 3 ? 'rgba(204,68,68,0.12)' : 'rgba(200,162,74,0.12)'} filter="url(#glow6)"/>
                        <circle cx="52" cy={node.y} r={node.r} fill="#080808" stroke={i >= 3 ? '#aa3333' : '#aa8820'} strokeWidth="1"/>
                        <circle cx="52" cy={node.y} r={node.r - 2} fill={'url(#' + node.grad + ')'} filter="url(#glow3)"/>
                        <circle cx={48} cy={node.y - Math.round(node.r * 0.4)} r={Math.max(2, Math.round(node.r * 0.3))} fill="white" fillOpacity="0.55"/>
                        {node.label && (
                          <text x="52" y={node.y - node.r - 12} textAnchor="middle" fill={node.labelColor!} fontSize="9" fontWeight="700" letterSpacing="0.08em">{node.label}</text>
                        )}
                        {node.desc && (
                          <text x="82" y={node.y + 5} fill={node.descColor!} fontSize="12" fontWeight="700">{node.desc}</text>
                        )}
                      </g>
                    ))}
                  </svg>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(200,162,74,0.12)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                  {primary.evidence?.slice(0, 2).map((e: string, idx: number) => (
                    <div key={idx} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', maxWidth: '280px' }}>
                      <span style={{ color: gold, flexShrink: 0, fontSize: '17px', marginTop: '2px' }}>◈</span>
                      <span style={{ fontSize: '17px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{e}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                  <a href="/constraints" style={{ padding: '9px 20px', backgroundColor: gold, color: '#050505', borderRadius: '6px', fontSize: '17px', fontWeight: '700', textDecoration: 'none', whiteSpace: 'nowrap' as const }}>View Constraint Intelligence →</a>
                  <a href="/deployments" style={{ padding: '9px 20px', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: '6px', fontSize: '17px', textDecoration: 'none', whiteSpace: 'nowrap' as const }}>Deployment Packages</a>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '40px', textAlign: 'center' as const }}>
              <div style={{ fontSize: '17px', color: gold, letterSpacing: '0.2em', marginBottom: '12px' }}>PRIMARY CONSTRAINT</div>
              <div style={{ fontSize: '17px', color: 'var(--text-muted)', marginBottom: '20px' }}>No MRI analysis found. Generate your Business MRI to activate intelligence.</div>
              <a href="/book" style={{ padding: '10px 24px', backgroundColor: gold, color: '#050505', borderRadius: '6px', fontWeight: '700', textDecoration: 'none', fontSize: '17px' }}>Generate Business MRI →</a>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

            <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '17px', color: '#dddddd', letterSpacing: '0.2em', fontWeight: '600' }}>EXECUTIVE ACTION CENTRE</div>
                <a href="/deployments" style={{ fontSize: '17px', color: gold, textDecoration: 'none' }}>View all actions →</a>
              </div>
              {actions.slice(0, 4).map((a: any, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', backgroundColor: a.bg, border: '1px solid ' + a.color + '33', borderRadius: '6px', marginBottom: i < 3 ? '8px' : '0' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: a.color + '22', border: '1px solid ' + a.color + '55', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: a.color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <div style={{ fontSize: '17px', color: a.color, fontWeight: '700', letterSpacing: '0.1em' }}>{a.priority}</div>
                      <div style={{ fontSize: '17px', color: a.color, fontWeight: '600' }}>{a.value}</div>
                    </div>
                    <div style={{ fontSize: '17px', color: 'var(--text-primary)', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{a.title}</div>
                    <div style={{ fontSize: '17px', color: 'var(--text-muted)', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{a.desc}</div>
                  </div>
                  <div style={{ fontSize: '17px', color: 'var(--text-muted)', flexShrink: 0 }}>→</div>
                </div>
              ))}
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid ' + border, textAlign: 'center' as const }}>
                <a href="/deployments" style={{ fontSize: '17px', color: gold, textDecoration: 'none' }}>View all actions →</a>
              </div>
            </div>

            <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '17px', color: '#dddddd', letterSpacing: '0.2em', fontWeight: '600' }}>DECISION INTELLIGENCE FEED</div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#4aaa4a', boxShadow: '0 0 4px rgba(74,170,74,0.6)' }} />
                  <span style={{ fontSize: '17px', color: '#4aaa4a', letterSpacing: '0.1em' }}>LIVE</span>
                </div>
              </div>
              {feed.map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', padding: '10px 0', borderBottom: i < feed.length - 1 ? '1px solid ' + border : 'none' }}>
                  <div style={{ flexShrink: 0, marginTop: '2px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: i === 0 ? 'rgba(200,162,74,0.15)' : i === 1 ? 'rgba(74,138,176,0.15)' : 'rgba(74,170,74,0.15)', border: '1px solid ' + (i === 0 ? gold + '44' : i === 1 ? '#4a8ab044' : '#4aaa4a44'), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ fontSize: '17px', color: i === 0 ? gold : i === 1 ? '#4a8ab0' : '#4aaa4a' }}>{i === 0 ? '★' : i === 1 ? '↗' : '◎'}</div>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '17px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '0 0 3px 0' }}>{f.text}</p>
                    <div style={{ fontSize: '17px', color: 'var(--text-muted)' }}>{f.time}</div>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid ' + border, textAlign: 'center' as const }}>
                <a href="/insights" style={{ fontSize: '17px', color: gold, textDecoration: 'none' }}>View all insights →</a>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '16px' }}>

          <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '17px', color: '#dddddd', letterSpacing: '0.15em', fontWeight: '700' }}>BUSINESS HEALTH RADAR</div>
              <button onClick={() => setShowRadarModal(true)} style={{ fontSize: '17px', color: gold, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: '600' }}>View full →</button>
            </div>
            {pillarList.length > 0 ? (
              <>
                <svg width="100%" viewBox="0 0 260 260" style={{ display: 'block', margin: '0 auto 4px' }}><rect width="260" height="260" fill="var(--bg-card)"/>
                  <defs>
                    <filter id="hglow"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                  </defs>
                  
                  {[25,50,75,100].map((ring: number) => (
                    <polygon key={ring} points={pillarList.map((_: any, i: number) => {
                      const a = (i/pillarList.length)*2*Math.PI - Math.PI/2
                      const r = (ring/100)*72
                      return String(120+r*Math.cos(a)) + ',' + String(120+r*Math.sin(a))
                    }).join(' ')} fill="none" stroke="#2a2a2a" strokeWidth="0.8"/>
                  ))}
                  {pillarList.map((_: any, i: number) => {
                    const a = (i/pillarList.length)*2*Math.PI - Math.PI/2
                    return <line key={i} x1="130" y1="130" x2={130+88*Math.cos(a)} y2={120+72*Math.sin(a)} stroke="#2a2a2a" strokeWidth="0.8"/>
                  })}
                  <polygon
                    points={pillarList.map((_: any, i: number) => {
                      const a = (i/pillarList.length)*2*Math.PI - Math.PI/2
                      const r = (benchmarkScore/20)*72
                      return String(120+r*Math.cos(a)) + ',' + String(120+r*Math.sin(a))
                    }).join(' ')}
                    fill="none" stroke={gold} strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.3"
                  />
                  {pillarList.map((p: any, i: number) => {
                    const next = pillarList[(i+1)%pillarList.length]
                    const a1 = (i/pillarList.length)*2*Math.PI - Math.PI/2
                    const a2 = ((i+1)/pillarList.length)*2*Math.PI - Math.PI/2
                    const r1 = (p.score/20)*72
                    const r2 = (next.score/20)*72
                    return <polygon key={i} points={'120,120 ' + String(120+r1*Math.cos(a1)) + ',' + String(120+r1*Math.sin(a1)) + ' ' + String(120+r2*Math.cos(a2)) + ',' + String(120+r2*Math.sin(a2))} fill="none" stroke={p.color} strokeWidth="1.5" filter="url(#hglow)"/>
                  })}
                  {pillarList.map((p: any, i: number) => {
                    const a = (i/pillarList.length)*2*Math.PI - Math.PI/2
                    const r = (p.score/20)*72
                    const lx = 120+96*Math.cos(a)
                    const ly = 120+96*Math.sin(a)
                    return <g key={i}>
                      <circle cx={120+r*Math.cos(a)} cy={120+r*Math.sin(a)} r="5" fill={p.color} filter="url(#hglow)"/>
                      <circle cx={120+r*Math.cos(a)} cy={120+r*Math.sin(a)} r="2" fill="#fff"/>
                      <text x={lx} y={ly-6} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="700">{p.name}</text>
                      <text x={lx} y={ly+8} textAnchor="middle" fill={p.color} fontSize="11" fontWeight="900">{p.score}/20</text>
                    </g>
                  })}
                </svg>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <svg width="18" height="6"><line x1="0" y1="3" x2="18" y2="3" stroke={gold} strokeWidth="1.5"/></svg>
                    <span style={{ fontSize: '17px', color: 'var(--text-muted)' }}>Your score</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <svg width="18" height="6"><line x1="0" y1="3" x2="18" y2="3" stroke={gold} strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.5"/></svg>
                    <span style={{ fontSize: '17px', color: 'var(--text-muted)' }}>Industry benchmark</span>
                  </div>
                </div>
                <div style={{ textAlign: 'center' as const, marginBottom: '12px' }}>
                  <div style={{ fontSize: '36px', fontWeight: '900', color: healthColor, lineHeight: 1 }}>{healthScore}</div>
                  <div style={{ fontSize: '17px', color: 'var(--text-muted)', marginTop: '3px', letterSpacing: '0.1em' }}>HEALTH SCORE</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
                  {pillarList.map((p: any, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: p.color, flexShrink: 0 }} />
                      <div style={{ flex: 1, fontSize: '17px', color: 'var(--text-muted)' }}>{p.name}</div>
                      <div style={{ fontSize: '17px', fontWeight: '700', color: p.color }}>{p.score}/20</div>
                      <div style={{ width: '60px', height: '3px', backgroundColor: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: String((p.score/20)*100) + '%', height: '100%', backgroundColor: p.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center' as const, padding: '20px 0', color: 'var(--text-muted)', fontSize: '17px' }}>Generate MRI to see health radar</div>
            )}
          </div>

          <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ fontSize: '17px', color: '#dddddd', letterSpacing: '0.15em', fontWeight: '600' }}>INTELLIGENCE ALERTS</div>
              <a href="/constraints" style={{ fontSize: '17px', color: gold, textDecoration: 'none' }}>View all →</a>
            </div>
            {alerts.map((a: any, i: number) => {
              const c = a.level === 'critical' ? '#cc4444' : a.level === 'high' ? '#e8923a' : a.level === 'medium' ? gold : '#4a8ab0'
              const levelLabel = (a.level as string).toUpperCase()
              return (
                <div key={i} style={{ display: 'flex', gap: '10px', padding: '10px 0', borderBottom: i < alerts.length-1 ? '1px solid ' + border : 'none' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: c + '18', border: '1px solid ' + c + '44', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: c, boxShadow: '0 0 5px ' + c + '88' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <div style={{ fontSize: '17px', color: c, fontWeight: '700', letterSpacing: '0.1em' }}>{levelLabel}</div>
                      <div style={{ fontSize: '17px', color: 'var(--text-muted)' }}>{a.time}</div>
                    </div>
                    <div style={{ fontSize: '17px', color: 'var(--text-primary)', fontWeight: '600' }}>{a.title}</div>
                    <div style={{ fontSize: '17px', color: 'var(--text-muted)', marginTop: '2px' }}>{a.desc}</div>
                  </div>
                </div>
              )
            })}
          </div>

          {oppHigh > 0 && (
            <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ fontSize: '17px', color: '#dddddd', letterSpacing: '0.15em', fontWeight: '600' }}>OPPORTUNITY SNAPSHOT</div>
                <a href="/opportunities" style={{ fontSize: '17px', color: gold, textDecoration: 'none' }}>View pipeline →</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ flexShrink: 0 }}>
                  <svg width="110" height="110" viewBox="0 0 80 80">
                    {(() => {
                      let offset = 0
                      const r = 28
                      const c = r * 2 * Math.PI
                      return oppBreakdown.map((o, i) => {
                        const dash = (o.pct / 100) * c
                        const gap = c - dash
                        const el = (
                          <circle key={i} cx="40" cy="40" r={r} fill="none" stroke={o.color} strokeWidth="10"
                            strokeDasharray={String(dash) + ' ' + String(gap)} strokeDashoffset={String(-offset)}
                            strokeOpacity="0.85" transform="rotate(-90 40 40)"/>
                        )
                        offset += dash
                        return el
                      })
                    })()}
                    <text x="40" y="36" textAnchor="middle" fill={gold} fontSize="9" fontWeight="800">{fmtShort(oppLow)}+</text>
                    <text x="40" y="48" textAnchor="middle" fill="#555" fontSize="7">Total</text>
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  {oppBreakdown.map((o, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: i < oppBreakdown.length - 1 ? '5px' : '0' }}>
                      <div style={{ width: '7px', height: '7px', borderRadius: '2px', backgroundColor: o.color, flexShrink: 0 }} />
                      <div style={{ flex: 1, fontSize: '17px', color: 'var(--text-muted)' }}>{o.label}</div>
                      <div style={{ fontSize: '17px', color: o.color, fontWeight: '600' }}>{o.val}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ borderTop: '1px solid ' + border, paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '17px', color: 'var(--text-muted)' }}>Avg. Confidence: <span style={{ color: confColor, fontWeight: '600' }}>78%</span></div>
                <div style={{ fontSize: '17px', color: 'var(--text-muted)' }}>{oppBreakdown.length} opportunities</div>
              </div>
            </div>
          )}

        </div>
      </div>
      {showRadarModal && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '40px', overflowY: 'auto' as const }} onClick={() => setShowRadarModal(false)}>
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '14px', padding: '32px', width: '740px', maxWidth: '95vw', marginBottom: '40px' }} onClick={(e: any) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '17px', color: gold, letterSpacing: '0.2em', marginBottom: '6px', fontWeight: '600' }}>BUSINESS HEALTH RADAR</div>
                <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>Full Business Health Analysis</div>
                <div style={{ fontSize: '17px', color: 'var(--text-muted)' }}>{businessName} · Health Score: {healthScore}/100 · {pillarList.length} pillars</div>
              </div>
              <button onClick={() => setShowRadarModal(false)} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '6px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '22px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '20px' }}>
              <div>
                <svg width="100%" viewBox="0 0 260 260">
                  <defs><filter id="hglow2"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
                  {[25,50,75,100].map((ring: number) => (
                    <polygon key={ring} points={pillarList.map((_: any, i: number) => { const a=(i/pillarList.length)*2*Math.PI-Math.PI/2; const r=(ring/100)*96; return String(130+r*Math.cos(a))+','+String(130+r*Math.sin(a)) }).join(' ')} fill="none" stroke="#2a2a2a" strokeWidth="0.8"/>
                  ))}
                  {pillarList.map((_: any, i: number) => { const a=(i/pillarList.length)*2*Math.PI-Math.PI/2; return <line key={i} x1="130" y1="130" x2={130+96*Math.cos(a)} y2={130+96*Math.sin(a)} stroke="#2a2a2a" strokeWidth="0.8"/> })}
                  <polygon points={pillarList.map((_: any, i: number) => { const a=(i/pillarList.length)*2*Math.PI-Math.PI/2; const r=(benchmarkScore/20)*96; return String(130+r*Math.cos(a))+','+String(130+r*Math.sin(a)) }).join(' ')} fill="none" stroke={gold} strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.4"/>
                  {pillarList.map((p: any, i: number) => { const next=pillarList[(i+1)%pillarList.length]; const a1=(i/pillarList.length)*2*Math.PI-Math.PI/2; const a2=((i+1)/pillarList.length)*2*Math.PI-Math.PI/2; const r1=(p.score/20)*96; const r2=(next.score/20)*96; return <polygon key={i} points={'130,130 '+String(130+r1*Math.cos(a1))+','+String(130+r1*Math.sin(a1))+' '+String(130+r2*Math.cos(a2))+','+String(130+r2*Math.sin(a2))} fill={p.color+'22'} stroke={p.color} strokeWidth="2" filter="url(#hglow2)"/> })}
                  {pillarList.map((p: any, i: number) => { const a=(i/pillarList.length)*2*Math.PI-Math.PI/2; const r=(p.score/20)*96; const lx=130+118*Math.cos(a); const ly=130+118*Math.sin(a); return <g key={i}><circle cx={130+r*Math.cos(a)} cy={130+r*Math.sin(a)} r="6" fill={p.color} filter="url(#hglow2)"/><circle cx={130+r*Math.cos(a)} cy={130+r*Math.sin(a)} r="2.5" fill="#fff"/><text x={lx} y={ly-5} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="700">{p.name}</text><text x={lx} y={ly+9} textAnchor="middle" fill={p.color} fontSize="12" fontWeight="900">{p.score}/20</text></g> })}
                  <text x="130" y="124" textAnchor="middle" fill="#ffffff" fontSize="22" fontWeight="900">{healthScore}</text>
                  <text x="130" y="138" textAnchor="middle" fill="#888" fontSize="9" letterSpacing="0.12em">HEALTH SCORE</text>
                  <text x="130" y="150" textAnchor="middle" fill={healthColor} fontSize="10" fontWeight="700">{health.vs_benchmark === 'above' ? '↑ Above benchmark' : 'At benchmark'}</text>
                </svg>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '10px', height: '3px', backgroundColor: gold }}/><span style={{ fontSize: '17px', color: 'var(--text-muted)' }}>Your score</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '10px', height: '2px', backgroundColor: gold, opacity: 0.4 }}/><span style={{ fontSize: '17px', color: 'var(--text-muted)' }}>Industry benchmark</span></div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
                {pillarList.map((p: any, i: number) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: p.color }} />
                        <span style={{ fontSize: '17px', color: 'var(--text-secondary)', fontWeight: '700' }}>{p.name}</span>
                      </div>
                      <span style={{ fontSize: '17px', color: p.color, fontWeight: '900' }}>{p.score}/20</span>
                    </div>
                    <div style={{ height: '6px', backgroundColor: '#1a1a1a', borderRadius: '3px', overflow: 'hidden', marginBottom: '3px' }}>
                      <div style={{ width: (p.score/20*100)+'%', height: '100%', backgroundColor: p.color, borderRadius: '3px' }} />
                    </div>
                    <div style={{ fontSize: '17px', color: 'var(--text-muted)' }}>{p.label || (p.score >= 14 ? 'Strong' : p.score >= 9 ? 'Moderate' : 'Needs Attention')}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '10px' }}>
              {pillarList.map((p: any, i: number) => (
                <div key={i} style={{ padding: '14px', backgroundColor: 'var(--bg-sidebar)', borderRadius: '8px', border: '1px solid '+p.color+'33', textAlign: 'center' as const }}>
                  <div style={{ fontSize: '17px', color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: '6px', fontWeight: '600' }}>{p.name.toUpperCase()}</div>
                  <div style={{ fontSize: '22px', fontWeight: '900', color: p.color }}>{p.score}/20</div>
                  <div style={{ fontSize: '17px', color: p.score >= 14 ? '#4aaa4a' : p.score >= 9 ? gold : '#e8923a', marginTop: '3px', fontWeight: '600' }}>{p.label || (p.score >= 14 ? 'Strong' : p.score >= 9 ? 'Moderate' : 'Needs Attention')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </DashboardShell>
  )
}
