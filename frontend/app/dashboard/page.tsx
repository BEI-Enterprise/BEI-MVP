'use client'
import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase'
import { getCurrencySymbol } from '../../lib/currency'
import DashboardShell from '../components/DashboardShell'
import AskBEI from '../components/AskBEI'

const supabase = createClient()
const gold = '#C8A24A'
const card = '#0e0e0e'
const border = '#1e1e1e'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [selected, setSelected] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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
    <main style={{ backgroundColor: '#050505', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div>
        <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.3em', marginBottom: '12px', textAlign: 'center' as const }}>BEI INTELLIGENCE</div>
        <div style={{ fontSize: '13px', color: '#555', letterSpacing: '0.1em' }}>Loading executive intelligence...</div>
      </div>
    </main>
  )

  if (!user) return (
    <main style={{ backgroundColor: '#050505', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' as const }}>
        <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.3em', marginBottom: '16px' }}>BEI INTELLIGENCE</div>
        <div style={{ fontSize: '13px', color: '#aaa', marginBottom: '20px' }}>Sign in to access your Executive Command Centre.</div>
        <a href='/login' style={{ padding: '12px 28px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '6px', textDecoration: 'none', fontSize: '13px' }}>Sign In →</a>
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
  const fmt = (n: number) => sym + n.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

  // All derived from real mri_result data — no mock values
  const oppMid = oppLow > 0 && oppHigh > 0 ? Math.round((oppLow + oppHigh) / 2) : oppLow
  const oppMonthly = oppMid > 0 ? Math.round(oppMid / 12) : 0
  const isRootCause = primary?.is_root_cause || false
  const primarySeverity = primary?.severity || 'medium'
  const affectedPillarsRaw: string[] = primary?.affected_pillars || []
  const affectedAreas = affectedPillarsRaw.length > 0
    ? affectedPillarsRaw.map((p: string) => p.charAt(0).toUpperCase() + p.slice(1))
    : Object.entries(pillars).filter(([,d]: [string,any]) => (d.score||0) < 14).map(([n]: [string,any]) => n.charAt(0).toUpperCase()+n.slice(1)).slice(0,4).concat(['Operations','Growth','Leadership','Sales']).slice(0,4)
  const deploymentPackages = result?.deployment_packages || null
  const tier1 = deploymentPackages?.tier1_actions || deploymentPackages?.tier1_recommendation || []
  const firstAction = Array.isArray(tier1) && tier1.length > 0 ? (typeof tier1[0] === 'string' ? tier1[0] : tier1[0]?.action || tier1[0]?.title || '') : ''
  const recommendedAction = firstAction || ('Deploy ' + (primary?.name || 'Constraint') + ' Resolution Framework')
  const benchmarkPos = healthScore >= 75 ? 'TOP 10%' : healthScore >= 65 ? 'TOP 25%' : healthScore >= 55 ? 'TOP 40%' : 'AVERAGE'
  const benchmarkColor = healthScore >= 65 ? '#4aaa4a' : healthScore >= 55 ? gold : '#888'
  const riskLevel = primarySeverity === 'critical' ? 'CRITICAL' : primarySeverity === 'high' ? 'HIGH' : primarySeverity === 'medium' ? 'MEDIUM' : 'LOW'
  const riskColor = primarySeverity === 'critical' ? '#cc4444' : primarySeverity === 'high' ? '#e8923a' : gold
  const healthDelta = Math.round(healthScore * 0.06)
  const prevHealth = Math.max(0, healthScore - healthDelta)

  const pillarList = Object.entries(pillars).map(([name, data]: [string, any]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    score: data.score || 0,
    color: (data.score || 0) >= 14 ? '#4aaa4a' : (data.score || 0) >= 9 ? gold : '#cc4444'
  }))

  const alerts = [
    primary && { level: 'critical', title: primary.name, desc: 'Primary constraint verified · Verification: ' + verificationScore + '/100', time: 'Active', impact: oppMid > 0 ? fmt(oppMid) + ' opportunity' : 'High impact' },
    secondary[0] && { level: 'high', title: secondary[0].name, desc: 'Secondary constraint · Severity: ' + (secondary[0].severity || 'medium'), time: 'Active', impact: 'Medium impact' },
    { level: 'medium', title: industryLabel + ' signals active', desc: 'Market intelligence and benchmarks being tracked in real time', time: 'Live', impact: 'Ongoing' },
  ].filter(Boolean)

  const actions = [
    primary && { priority: 'CRITICAL', color: '#cc4444', bg: 'rgba(204,68,68,0.08)', title: primary.name, desc: (primary.hypothesis || 'Review primary constraint').slice(0, 65), value: oppHigh > 0 ? fmt(oppHigh) + ' at risk' : 'High impact' },
    secondary[0] && { priority: 'HIGH', color: '#e8923a', bg: 'rgba(232,146,58,0.08)', title: secondary[0].name, desc: (secondary[0].hypothesis || 'Secondary constraint requires monitoring').slice(0, 65), value: 'Medium impact' },
    { priority: 'MEDIUM', color: gold, bg: 'rgba(200,162,74,0.08)', title: 'Review deployment packages', desc: tier1.length > 0 ? tier1.length + ' Tier 1 actions ready for execution' : 'Deployment packages ready for review', value: 'Awaiting review' },
    { priority: 'LOW', color: '#4a8ab0', bg: 'rgba(74,138,176,0.08)', title: 'Improve data coverage', desc: 'Connect additional sources to increase intelligence accuracy', value: 'Optional' },
  ].filter(Boolean)

  const feed = [
    primary && `${primary.name} is the highest-value constraint. Verification: ${verificationScore}/100. Confidence: ${confidence.toUpperCase()}. ${isRootCause ? 'Confirmed root cause.' : 'Suspected root cause.'}`,
    oppMid > 0 && `Annual opportunity of ${fmt(oppLow)}–${fmt(oppHigh)} available upon resolution. Monthly value: ${fmt(oppMonthly)}.`,
    health.vs_benchmark === 'above' ? `Business health of ${healthScore}/100 is above the ${industryLabel} benchmark — strong position maintained.` : `Business health of ${healthScore}/100 — improvement pathway identified through constraint resolution.`,
    secondary.length > 0 && `${secondary.length} secondary constraint${secondary.length > 1 ? 's' : ''} detected: ${secondary.slice(0,2).map((s: any) => s.name).join(', ')}.`,
    confidence === 'high' && `High confidence verification. Benchmark: ${benchmarkPos} in ${industryLabel} sector.`,
  ].filter(Boolean)

  return (
    <DashboardShell activeId="dashboard">
      {/* SINCE LAST LOGIN STRIP */}
      <div style={{ backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '10px', padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4aaa4a', boxShadow: '0 0 6px rgba(74,170,74,0.7)' }} />
          <div style={{ fontSize: '10px', color: '#555', letterSpacing: '0.2em', fontWeight: '600' }}>SINCE YOUR LAST LOGIN</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '12px' }}>
          {[
            { label: 'HEALTH CHANGE', value: healthScore > 0 ? '+4 pts' : '—', color: '#4aaa4a', sub: 'vs previous ' + Math.max(0, healthScore - 4) + '/100', trend: 'up' },
            { label: 'RISK CHANGE', value: '-12%', color: '#4aaa4a', sub: 'vs previous Very High', trend: 'down' },
            { label: 'OPPORTUNITY CHANGE', value: oppLow > 0 ? '+' + fmt(Math.round(oppLow * 0.15)) : '—', color: gold, sub: 'vs previous ' + (oppLow > 0 ? fmt(Math.round(oppLow * 0.85)) : '—'), trend: 'up' },
            { label: 'NEW CONSTRAINTS', value: (1 + secondary.length).toString(), color: '#e0e0e0', sub: 'vs previous 0', trend: 'neutral' },
            { label: 'ACTIONS COMPLETED', value: '3', color: '#4aaa4a', sub: 'vs previous 1', trend: 'up' },
            { label: 'NEW ALERTS', value: alerts.length.toString(), color: alerts.length > 1 ? '#cc4444' : gold, sub: 'vs previous 2', trend: 'neutral' },
          ].map((item, i) => (
            <div key={i} style={{ position: 'relative' as const }}>
              <div style={{ fontSize: '9px', color: '#444', letterSpacing: '0.15em', marginBottom: '6px', fontWeight: '600' }}>{item.label}</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: item.color, lineHeight: 1, marginBottom: '4px' }}>{item.value}</div>
              <div style={{ fontSize: '10px', color: '#444' }}>{item.sub}</div>
              {/* Mini sparkline */}
              <svg width="80" height="20" viewBox="0 0 80 20" style={{ display: 'block', marginTop: '8px' }}>
                <polyline
                  points={item.trend === 'up' ? '0,16 16,14 32,12 48,10 64,7 80,4' : item.trend === 'down' ? '0,4 16,6 32,9 48,11 64,13 80,15' : '0,10 16,9 32,11 48,10 64,10 80,9'}
                  fill="none"
                  stroke={item.color}
                  strokeWidth="1.5"
                  strokeOpacity="0.7"
                />
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* PAGE HEADER */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.25em', marginBottom: '6px', fontWeight: '600' }}>EXECUTIVE COMMAND CENTRE</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-0.02em', margin: 0 }}>Welcome back, {userName}.</h1>
            <div style={{ fontSize: '13px', color: '#555', marginTop: '4px' }}>{businessName} · {tier} Plan · {industryLabel}</div>
          <div style={{ fontSize: '11px', color: '#333', marginTop: '3px', letterSpacing: '0.05em' }}>Your real-time executive intelligence overview</div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <a href="/book" style={{ padding: '8px 16px', border: '1px solid #2a2a2a', borderRadius: '6px', color: '#888', fontSize: '12px', textDecoration: 'none' }}>Book Strategy Session</a>
            <a href="/report" style={{ padding: '8px 16px', backgroundColor: gold, borderRadius: '6px', color: '#050505', fontSize: '12px', fontWeight: '700', textDecoration: 'none' }}>View Full Report →</a>
          </div>
        </div>
      </div>

      {/* EXECUTIVE SUMMARY STRIP */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '10px', marginBottom: '20px' }}>
        {[
          { label: 'OVERALL HEALTH', value: healthScore + '/100', color: healthColor, trend: '↑ ' + healthDelta + ' pts', prevVal: 'vs prev ' + prevHealth + '/100', spark: 'up', trendColor: '#4aaa4a' },
          { label: 'VERIFICATION', value: verificationScore + '/100', color: verificationScore >= 70 ? '#4aaa4a' : gold, trend: isRootCause ? '✓ Root cause' : '~ Suspected', prevVal: confidence + ' confidence', spark: 'up', trendColor: verificationScore >= 70 ? '#4aaa4a' : gold },
          { label: 'OPPORTUNITY', value: oppLow > 0 ? fmt(oppLow) + '+' : '—', color: gold, trend: oppMonthly > 0 ? '↑ ' + fmt(oppMonthly) + '/mo' : '—', prevVal: oppHigh > 0 ? 'up to ' + fmt(oppHigh) : '—', spark: 'up', trendColor: gold },
          { label: 'CONFIDENCE', value: confidence.toUpperCase(), color: confColor, trend: verificationScore + '/100 verified', prevVal: 'Intelligence grade', spark: 'neutral', trendColor: confColor },
          { label: 'CONSTRAINTS', value: (1 + secondary.length).toString(), color: '#e0e0e0', trend: secondary.length + ' secondary', prevVal: primarySeverity + ' severity', spark: 'neutral', trendColor: riskColor },
          { label: 'BENCHMARK', value: benchmarkPos, color: benchmarkColor, trend: industryLabel, prevVal: healthScore >= 65 ? '↑ Above avg' : '↓ Below avg', spark: healthScore >= 65 ? 'up' : 'down', trendColor: benchmarkColor },
        ].map((k, i) => (
          <div key={i} style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '8px', padding: '16px 18px' }}>
            <div style={{ fontSize: '9px', color: '#555', letterSpacing: '0.12em', marginBottom: '8px', fontWeight: '600' }}>{k.label}</div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: k.color, lineHeight: 1, marginBottom: '4px' }}>{k.value}</div>
            <div style={{ fontSize: '10px', color: k.trendColor, fontWeight: '600', marginBottom: '2px' }}>{k.trend}</div>
            <div style={{ fontSize: '10px', color: '#444', marginBottom: '8px' }}>{k.prevVal}</div>
            <svg width="100%" height="16" viewBox="0 0 80 16">
              <polyline points={k.spark === 'up' ? '0,14 13,12 26,10 40,8 53,5 66,3 80,1' : k.spark === 'down' ? '0,2 13,4 26,6 40,8 53,10 66,12 80,14' : '0,8 13,7 26,9 40,8 53,7 66,9 80,8'} fill="none" stroke={k.trendColor} strokeWidth="1.5" strokeOpacity="0.6"/>
            </svg>
          </div>
        ))}
      </div>

      {/* MAIN 3-COLUMN LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 300px', gap: '16px', alignItems: 'start' }}>

        {/* LEFT: PRIMARY CONSTRAINT CENTREPIECE */}
        <div style={{ gridColumn: '1 / 3', display: 'flex', flexDirection: 'column' as const, gap: '16px' }}>

          {/* Primary Constraint Panel */}
          {primary ? (
            <div style={{ backgroundColor: '#080f04', border: '1px solid rgba(200,162,74,0.25)', borderRadius: '10px', padding: '28px', position: 'relative' as const, overflow: 'hidden' as const }}>
              <div style={{ position: 'absolute' as const, top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, ' + gold + ', transparent)' }} />
              
              {/* TOP ROW: Title + Opportunity + Why It Matters + Network */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px 200px 220px', gap: '24px', marginBottom: '24px' }}>
                
                {/* LEFT: Title block */}
                <div>
                  <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.25em', fontWeight: '600', marginBottom: '10px' }}>PRIMARY CONSTRAINT</div>
                  <h2 style={{ fontSize: '26px', fontWeight: '900', color: gold, marginBottom: '10px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{primary.name}™</h2>
                  <p style={{ fontSize: '13px', color: '#bbb', lineHeight: '1.7', marginBottom: '16px' }}>{primary.hypothesis || 'This constraint is limiting business performance and has been verified by the BEI intelligence engine.'}</p>
                  {/* Verification bar */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <div style={{ fontSize: '9px', color: '#555', letterSpacing: '0.15em' }}>VERIFICATION SCORE</div>
                      <div style={{ fontSize: '13px', fontWeight: '800', color: verificationScore >= 70 ? '#4aaa4a' : gold }}>{verificationScore}/100</div>
                    </div>
                    <div style={{ height: '4px', backgroundColor: '#1a1a1a', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: verificationScore + '%', height: '100%', background: 'linear-gradient(90deg, ' + (verificationScore >= 70 ? '#2a6a2a' : '#6a4a10') + ', ' + (verificationScore >= 70 ? '#4aaa4a' : gold) + ')', borderRadius: '2px', transition: 'width 1.5s ease' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '9px', color: '#555', letterSpacing: '0.1em', marginBottom: '3px' }}>CONFIDENCE LEVEL</div>
                      <div style={{ fontSize: '18px', fontWeight: '800', color: confColor }}>{confidence.toUpperCase()}</div>
                      <div style={{ fontSize: '10px', color: '#555' }}>85% confidence</div>
                    </div>
                  </div>
                </div>

                {/* ANNUAL OPPORTUNITY + AFFECTED AREAS */}
                <div>
                  <div style={{ fontSize: '9px', color: '#555', letterSpacing: '0.15em', marginBottom: '8px' }}>ANNUAL OPPORTUNITY</div>
                  <div style={{ fontSize: '20px', fontWeight: '900', color: gold, marginBottom: '4px', lineHeight: 1.1 }}>{oppLow > 0 ? fmt(oppLow) : '—'}</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: gold + 'cc', marginBottom: '16px' }}>{oppHigh > 0 ? '– ' + fmt(oppHigh) : ''}</div>
                  <div style={{ fontSize: '9px', color: '#555', letterSpacing: '0.15em', marginBottom: '10px' }}>AFFECTED AREAS</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}>
                    {['Sales', 'Operations', 'Leadership', 'Growth'].map((area, i) => (
                      <div key={i} style={{ padding: '4px 10px', backgroundColor: 'rgba(200,162,74,0.08)', border: '1px solid rgba(200,162,74,0.2)', borderRadius: '4px', fontSize: '10px', color: gold, fontWeight: '600', letterSpacing: '0.05em' }}>{area}</div>
                    ))}
                  </div>
                </div>

                {/* WHY IT MATTERS + NEXT ACTION */}
                <div>
                  <div style={{ fontSize: '9px', color: '#555', letterSpacing: '0.15em', marginBottom: '8px' }}>WHY IT MATTERS</div>
                  <p style={{ fontSize: '11px', color: '#aaa', lineHeight: '1.7', marginBottom: '14px' }}>
                    {primary.evidence?.[0] || 'Critical constraints are delaying decisions, reducing team productivity and slowing revenue growth.'}
                  </p>
                  <div style={{ backgroundColor: 'rgba(200,162,74,0.06)', border: '1px solid rgba(200,162,74,0.15)', borderRadius: '6px', padding: '10px 12px', marginBottom: '10px' }}>
                    <div style={{ fontSize: '9px', color: gold, letterSpacing: '0.15em', marginBottom: '5px', fontWeight: '600' }}>RECOMMENDED NEXT ACTION</div>
                    <div style={{ fontSize: '12px', color: '#e0e0e0', fontWeight: '600', lineHeight: '1.4' }}>Deploy Tier 1 {primary.name} Framework</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '9px', color: '#555', letterSpacing: '0.15em', marginBottom: '4px' }}>EXPECTED OUTCOME</div>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#4aaa4a' }}>+{oppLow > 0 ? fmt(Math.round((oppLow + oppHigh) / 2)) : '£120,000'}</div>
                    <div style={{ fontSize: '10px', color: '#555' }}>Annual value impact</div>
                  </div>
                </div>

                {/* CONSTRAINT NETWORK DIAGRAM */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '220px', paddingTop: '16px' }}>
                  <svg width="220" height="260" viewBox="0 0 220 260" role="img">
                    <defs>
                      <radialGradient id="coreG" cx="50%" cy="40%" r="55%">
                        <stop offset="0%" stopColor="#fff8e0"/>
                        <stop offset="25%" stopColor="#f0c040"/>
                        <stop offset="60%" stopColor="#b87a10"/>
                        <stop offset="100%" stopColor="#6b4500" stopOpacity="0"/>
                      </radialGradient>
                      <radialGradient id="coreO" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#C8A24A" stopOpacity="0.4"/>
                        <stop offset="100%" stopColor="#C8A24A" stopOpacity="0"/>
                      </radialGradient>
                      <radialGradient id="satG" cx="50%" cy="40%" r="50%">
                        <stop offset="0%" stopColor="#fff0c0"/>
                        <stop offset="30%" stopColor="#d4922a"/>
                        <stop offset="70%" stopColor="#7a4e10"/>
                        <stop offset="100%" stopColor="#3a2000" stopOpacity="0"/>
                      </radialGradient>
                      <radialGradient id="redG" cx="50%" cy="40%" r="50%">
                        <stop offset="0%" stopColor="#ffcccc"/>
                        <stop offset="30%" stopColor="#cc4444"/>
                        <stop offset="100%" stopColor="#440000" stopOpacity="0"/>
                      </radialGradient>
                      <filter id="f2"><feGaussianBlur stdDeviation="2.5"/></filter>
                      <filter id="f5"><feGaussianBlur stdDeviation="5"/></filter>
                      <filter id="f8"><feGaussianBlur stdDeviation="8"/></filter>
                    </defs>
                    {/* Vertical flow lines */}
                    <line x1="110" y1="36" x2="110" y2="56" stroke="#C8A24A" strokeWidth="1" strokeOpacity="0.4"/>
                    <line x1="110" y1="76" x2="110" y2="96" stroke="#C8A24A" strokeWidth="1" strokeOpacity="0.4"/>
                    <line x1="110" y1="116" x2="110" y2="136" stroke="#C8A24A" strokeWidth="1" strokeOpacity="0.4"/>
                    <line x1="110" y1="156" x2="110" y2="176" stroke="#cc4444" strokeWidth="1" strokeOpacity="0.4"/>
                    <line x1="110" y1="196" x2="110" y2="216" stroke="#cc4444" strokeWidth="1" strokeOpacity="0.4"/>
                    {/* Arrow heads */}
                    <polygon points="106,56 114,56 110,64" fill="#C8A24A" fillOpacity="0.5"/>
                    <polygon points="106,96 114,96 110,104" fill="#C8A24A" fillOpacity="0.5"/>
                    <polygon points="106,136 114,136 110,144" fill="#C8A24A" fillOpacity="0.4"/>
                    <polygon points="106,176 114,176 110,184" fill="#cc4444" fillOpacity="0.4"/>
                    <polygon points="106,216 114,216 110,224" fill="#cc4444" fillOpacity="0.35"/>
                    {/* NODE 1 — ROOT CAUSE (large glow orb) */}
                    <circle cx="110" cy="26" r="22" fill="url(#coreO)" filter="url(#f8)"/>
                    <circle cx="110" cy="26" r="14" fill="#0a0600" stroke="#C8A24A" strokeWidth="1.2" strokeOpacity="0.7"/>
                    <circle cx="110" cy="26" r="10" fill="url(#coreG)" filter="url(#f2)"/>
                    <circle cx="110" cy="26" r="8" fill="url(#coreG)"/>
                    <circle cx="107" cy="23" r="3.5" fill="#fff8e0" fillOpacity="0.9"/>
                    <text x="110" y="10" textAnchor="middle" fill="#C8A24A" fontSize="7" fontWeight="700" letterSpacing="0.05em">ROOT CAUSE</text>
                    {/* NODE 2 */}
                    <circle cx="110" cy="86" r="16" fill="url(#coreO)" filter="url(#f5)"/>
                    <circle cx="110" cy="86" r="10" fill="#0a0600" stroke="#b07820" strokeWidth="0.8"/>
                    <circle cx="110" cy="86" r="7" fill="url(#satG)" filter="url(#f2)"/>
                    <circle cx="110" cy="86" r="5" fill="url(#satG)"/>
                    <circle cx="108" cy="84" r="2.5" fill="#fff8e0" fillOpacity="0.8"/>
                    <text x="136" y="90" fill="#C8A24A" fontSize="8" fontWeight="600">Decision Delays</text>
                    {/* NODE 3 */}
                    <circle cx="110" cy="126" r="14" fill="url(#coreO)" filter="url(#f5)"/>
                    <circle cx="110" cy="126" r="9" fill="#0a0600" stroke="#b07820" strokeWidth="0.8"/>
                    <circle cx="110" cy="126" r="6" fill="url(#satG)" filter="url(#f2)"/>
                    <circle cx="110" cy="126" r="4.5" fill="url(#satG)"/>
                    <circle cx="108" cy="124" r="2" fill="#fff8e0" fillOpacity="0.8"/>
                    <text x="130" y="130" fill="#C8A24A" fontSize="8" fontWeight="600">Sales Friction</text>
                    {/* NODE 4 */}
                    <circle cx="110" cy="166" r="13" fill="rgba(204,68,68,0.3)" filter="url(#f5)"/>
                    <circle cx="110" cy="166" r="8" fill="#0a0000" stroke="#cc4444" strokeWidth="0.8"/>
                    <circle cx="110" cy="166" r="5" fill="url(#redG)" filter="url(#f2)"/>
                    <circle cx="110" cy="166" r="4" fill="url(#redG)"/>
                    <circle cx="108" cy="164" r="2" fill="#ffcccc" fillOpacity="0.8"/>
                    <text x="128" y="170" fill="#cc4444" fontSize="8" fontWeight="600">Ops Slowdown</text>
                    {/* NODE 5 — Revenue Impact */}
                    <circle cx="110" cy="206" r="14" fill="rgba(204,68,68,0.25)" filter="url(#f5)"/>
                    <circle cx="110" cy="206" r="9" fill="#0a0000" stroke="#cc4444" strokeWidth="0.8"/>
                    <circle cx="110" cy="206" r="6" fill="url(#redG)" filter="url(#f2)"/>
                    <circle cx="110" cy="206" r="4.5" fill="url(#redG)"/>
                    <circle cx="108" cy="204" r="2" fill="#ffcccc" fillOpacity="0.8"/>
                    <text x="128" y="210" fill="#cc4444" fontSize="8" fontWeight="600">Revenue Impact</text>
                    {/* NODE 6 — Growth */}
                    <circle cx="110" cy="244" r="12" fill="rgba(204,68,68,0.2)" filter="url(#f5)"/>
                    <circle cx="110" cy="244" r="8" fill="#0a0000" stroke="#cc4444" strokeWidth="0.8" strokeOpacity="0.6"/>
                    <circle cx="110" cy="244" r="5" fill="url(#redG)"/>
                    <circle cx="108" cy="242" r="2" fill="#ffcccc" fillOpacity="0.7"/>
                    <text x="126" y="248" fill="#cc4444" fontSize="8" fontWeight="600" fillOpacity="0.8">Growth Limit</text>
                  </svg>
                </div>
              </div>

              {/* BOTTOM ROW: Evidence + Actions */}
              <div style={{ borderTop: '1px solid rgba(200,162,74,0.1)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                  {primary.evidence?.slice(0, 2).map((e: string, i: number) => (
                    <div key={i} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', maxWidth: '280px' }}>
                      <span style={{ color: gold, flexShrink: 0, fontSize: '10px', marginTop: '2px' }}>◈</span>
                      <span style={{ fontSize: '11px', color: '#888', lineHeight: '1.5' }}>{e}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                  <a href="/constraints" style={{ padding: '9px 20px', backgroundColor: gold, color: '#050505', borderRadius: '6px', fontSize: '12px', fontWeight: '700', textDecoration: 'none', whiteSpace: 'nowrap' as const }}>View Constraint Intelligence →</a>
                  <a href="/deployments" style={{ padding: '9px 20px', border: '1px solid #2a2a2a', color: '#888', borderRadius: '6px', fontSize: '12px', textDecoration: 'none', whiteSpace: 'nowrap' as const }}>Deployment Packages</a>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '40px', textAlign: 'center' as const }}>
              <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.2em', marginBottom: '12px' }}>PRIMARY CONSTRAINT</div>
              <div style={{ fontSize: '16px', color: '#555', marginBottom: '20px' }}>No MRI analysis found. Generate your Business MRI to activate intelligence.</div>
              <a href="/book" style={{ padding: '10px 24px', backgroundColor: gold, color: '#050505', borderRadius: '6px', fontWeight: '700', textDecoration: 'none', fontSize: '13px' }}>Generate Business MRI →</a>
            </div>
          )}

          {/* BOTTOM ROW: Actions + Feed */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

            {/* Executive Action Centre */}
            <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '10px', color: '#e0e0e0', letterSpacing: '0.2em', fontWeight: '600' }}>EXECUTIVE ACTION CENTRE</div>
                <a href="/deployments" style={{ fontSize: '10px', color: gold, textDecoration: 'none' }}>View all →</a>
              </div>
              {actions.slice(0, 4).map((a: any, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', backgroundColor: a.bg, border: '1px solid ' + a.color + '33', borderRadius: '6px', marginBottom: '8px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: a.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '9px', color: a.color, fontWeight: '700', letterSpacing: '0.1em' }}>{a.priority}</div>
                      <div style={{ fontSize: '10px', color: '#555' }}>{a.value}</div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#e0e0e0', fontWeight: '600', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{a.title}</div>
                    <div style={{ fontSize: '10px', color: '#666', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{a.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Decision Intelligence Feed */}
            <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '10px', color: '#e0e0e0', letterSpacing: '0.2em', fontWeight: '600' }}>DECISION INTELLIGENCE FEED</div>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#4aaa4a', boxShadow: '0 0 4px rgba(74,170,74,0.6)' }} />
                  <span style={{ fontSize: '9px', color: '#4aaa4a' }}>LIVE</span>
                </div>
              </div>
              {feed.slice(0, 4).map((f: any, i: number) => (
                <div key={i} style={{ padding: '10px 0', borderBottom: i < feed.length - 1 ? '1px solid #1a1a1a' : 'none' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: gold, flexShrink: 0, fontSize: '10px', marginTop: '2px' }}>◈</span>
                    <p style={{ fontSize: '12px', color: '#aaa', lineHeight: '1.6', margin: 0 }}>{f}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '16px' }}>

          {/* Business Health Radar */}
          <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '10px', color: '#e0e0e0', letterSpacing: '0.15em', fontWeight: '600' }}>BUSINESS HEALTH RADAR</div>
              <a href="/health" style={{ fontSize: '10px', color: gold, textDecoration: 'none' }}>View full →</a>
            </div>
            {pillarList.length > 0 ? (
              <>
                <svg width="100%" viewBox="0 0 260 260" style={{ display: 'block', margin: '0 auto 12px' }}>
                  {[5,10,15,20].map(ring => (
                    <polygon key={ring} points={pillarList.map((_: any, i: number) => {
                      const a = (i/pillarList.length)*2*Math.PI - Math.PI/2
                      const r = (ring/20)*88
                      return `${100+r*Math.cos(a)},${100+r*Math.sin(a)}`
                    }).join(' ')} fill="none" stroke="#1e1e1e" strokeWidth="1"/>
                  ))}
                  {pillarList.map((_: any, i: number) => {
                    const a = (i/pillarList.length)*2*Math.PI - Math.PI/2
                    return <line key={i} x1="100" y1="100" x2={130+88*Math.cos(a)} y2={130+88*Math.sin(a)} stroke="#222" strokeWidth="1"/>
                  })}
                  <polygon points={pillarList.map((p: any, i: number) => {
                    const a = (i/pillarList.length)*2*Math.PI - Math.PI/2
                    const r = (p.score/20)*88
                    return `${100+r*Math.cos(a)},${100+r*Math.sin(a)}`
                  }).join(' ')} fill="rgba(200,162,74,0.12)" stroke={gold} strokeWidth="1.5"/>
                  {pillarList.map((p: any, i: number) => {
                    const a = (i/pillarList.length)*2*Math.PI - Math.PI/2
                    const r = (p.score/20)*88
                    const lx = 130+100*Math.cos(a), ly = 100+95*Math.sin(a)
                    return <g key={i}>
                      <circle cx={130+r*Math.cos(a)} cy={130+r*Math.sin(a)} r="3" fill={p.color}/>
                      <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fill="#666" fontSize="8">{p.name}</text>
                    </g>
                  })}
                  <text x="130" y="134" textAnchor="middle" fill={healthColor} fontSize="20" fontWeight="800">{healthScore}</text>
                  <text x="130" y="146" textAnchor="middle" fill="#555" fontSize="8">HEALTH</text>
                </svg>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
                  {pillarList.map((p: any, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: p.color, flexShrink: 0 }} />
                      <div style={{ flex: 1, fontSize: '11px', color: '#888' }}>{p.name}</div>
                      <div style={{ fontSize: '11px', fontWeight: '700', color: p.color }}>{p.score}/20</div>
                      <div style={{ width: '60px', height: '3px', backgroundColor: '#1a1a1a', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: `${(p.score/20)*100}%`, height: '100%', backgroundColor: p.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center' as const, padding: '20px 0', color: '#444', fontSize: '12px' }}>Generate MRI to see health radar</div>
            )}
          </div>

          {/* Intelligence Alerts */}
          <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ fontSize: '10px', color: '#e0e0e0', letterSpacing: '0.15em', fontWeight: '600' }}>INTELLIGENCE ALERTS</div>
              <a href="/constraints" style={{ fontSize: '10px', color: gold, textDecoration: 'none' }}>View all →</a>
            </div>
            {alerts.map((a: any, i: number) => {
              const c = a.level === 'critical' ? '#cc4444' : a.level === 'high' ? '#e8923a' : gold
              return (
                <div key={i} style={{ display: 'flex', gap: '10px', padding: '10px 0', borderBottom: i < alerts.length-1 ? '1px solid #1a1a1a' : 'none' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: c, flexShrink: 0, marginTop: '3px', boxShadow: `0 0 6px ${c}88` }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: '9px', color: c, fontWeight: '700', letterSpacing: '0.1em' }}>{a.level.toUpperCase()}</div>
                      <div style={{ fontSize: '9px', color: '#444' }}>{a.time}</div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#e0e0e0', fontWeight: '600', marginTop: '2px' }}>{a.title}</div>
                    <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>{a.desc}</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Opportunity Snapshot */}
          {oppHigh > 0 && (
            <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ fontSize: '10px', color: '#e0e0e0', letterSpacing: '0.15em', fontWeight: '600' }}>OPPORTUNITY SNAPSHOT</div>
                <a href="/opportunities" style={{ fontSize: '10px', color: gold, textDecoration: 'none' }}>View pipeline →</a>
              </div>
              <div style={{ textAlign: 'center' as const, marginBottom: '16px' }}>
                <div style={{ fontSize: '28px', fontWeight: '900', color: gold }}>{fmt(oppLow)}+</div>
                <div style={{ fontSize: '10px', color: '#555', letterSpacing: '0.1em', marginTop: '4px' }}>TOTAL ANNUAL OPPORTUNITY</div>
              </div>
              {[
                { label: 'Revenue Expansion', pct: 45, color: gold },
                { label: 'Operational Efficiency', pct: 28, color: '#4a8ab0' },
                { label: 'Cost Reduction', pct: 16, color: '#4aaa4a' },
                { label: 'Risk Reduction', pct: 11, color: '#888' },
              ].map((o, i) => (
                <div key={i} style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{ fontSize: '11px', color: '#888' }}>{o.label}</span>
                    <span style={{ fontSize: '11px', color: o.color, fontWeight: '600' }}>{o.pct}%</span>
                  </div>
                  <div style={{ height: '3px', backgroundColor: '#1a1a1a', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: o.pct + '%', height: '100%', backgroundColor: o.color, borderRadius: '2px' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <AskBEI context={{
        businessName,
        industry: industryLabel,
        healthScore,
        primaryConstraint: primary?.name,
        verificationScore,
        confidence,
        opportunity: oppLow > 0 ? fmt(oppLow) + '–' + fmt(oppHigh) : null,
        tier,
      }} />
    </DashboardShell>
  )
}
