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

  const pillarList = Object.entries(pillars).map(([name, data]: [string, any]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    score: data.score || 0,
    color: (data.score || 0) >= 70 ? '#4aaa4a' : (data.score || 0) >= 45 ? gold : '#cc4444'
  }))

  const alerts = [
    primary && { level: 'critical', title: primary.name, desc: 'Primary constraint verified · Immediate attention recommended', time: 'Active' },
    secondary[0] && { level: 'high', title: secondary[0].name, desc: 'Secondary constraint detected', time: 'Active' },
    { level: 'medium', title: 'Intelligence monitoring active', desc: industryLabel + ' signals being tracked', time: 'Live' },
  ].filter(Boolean)

  const actions = [
    primary && { priority: 'CRITICAL', color: '#cc4444', bg: 'rgba(204,68,68,0.08)', title: primary.name, desc: primary.hypothesis?.slice(0, 60) + '...' || 'Review primary constraint', value: oppHigh > 0 ? fmt(oppHigh) + ' at risk' : 'High impact' },
    secondary[0] && { priority: 'HIGH', color: '#e8923a', bg: 'rgba(232,146,58,0.08)', title: secondary[0].name, desc: 'Secondary constraint requires monitoring', value: 'Medium impact' },
    { priority: 'MEDIUM', color: gold, bg: 'rgba(200,162,74,0.08)', title: 'Review deployment packages', desc: 'Tier 1 actions available for immediate execution', value: 'Awaiting review' },
    { priority: 'LOW', color: '#4a8ab0', bg: 'rgba(74,138,176,0.08)', title: 'Connect additional data sources', desc: 'Improve intelligence accuracy with more connectors', value: 'Optional' },
  ].filter(Boolean)

  const feed = [
    primary && `${primary.name} has been identified as the highest-value intervention area based on current constraint analysis.`,
    oppHigh > 0 && `Total opportunity value of ${fmt(oppLow)}–${fmt(oppHigh)} identified across verified constraints.`,
    `${industryLabel} intelligence signals are active. ${secondary.length} secondary constraint${secondary.length !== 1 ? 's' : ''} identified.`,
    `Business health score of ${healthScore}/100 places this business ${healthScore >= 60 ? 'above' : 'below'} sector average.`,
    confidence === 'high' && 'High confidence verification achieved. Constraint intelligence is production-grade.',
  ].filter(Boolean)

  return (
    <DashboardShell activeId="dashboard">
      {/* PAGE HEADER */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.25em', marginBottom: '6px', fontWeight: '600' }}>EXECUTIVE COMMAND CENTRE</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-0.02em', margin: 0 }}>Welcome back, {userName}.</h1>
            <div style={{ fontSize: '13px', color: '#555', marginTop: '4px' }}>{businessName} · {tier} Plan · {industryLabel}</div>
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
          { label: 'OVERALL HEALTH', value: healthScore + '/100', color: healthColor, sub: health.band || 'unknown' },
          { label: 'VERIFICATION', value: verificationScore + '/100', color: verificationScore >= 70 ? '#4aaa4a' : gold, sub: 'Primary constraint' },
          { label: 'OPPORTUNITY', value: oppLow > 0 ? fmt(oppLow) + '+' : '—', color: gold, sub: 'Annual uplift' },
          { label: 'CONFIDENCE', value: confidence.toUpperCase(), color: confColor, sub: 'Intelligence grade' },
          { label: 'CONSTRAINTS', value: (1 + secondary.length).toString(), color: '#e0e0e0', sub: (secondary.length) + ' secondary' },
          { label: 'PLAN STATUS', value: tier, color: gold, sub: 'Active' },
        ].map((k, i) => (
          <div key={i} style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '8px', padding: '18px 20px' }}>
            <div style={{ fontSize: '9px', color: '#666', letterSpacing: '0.12em', marginBottom: '10px', fontWeight: '600' }}>{k.label}</div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: k.color, lineHeight: 1 }}>{k.value}</div>
            <div style={{ fontSize: '11px', color: '#555', marginTop: '6px' }}>{k.sub}</div>
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '24px' }}>
                <div>
                  <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.25em', fontWeight: '600', marginBottom: '10px' }}>PRIMARY CONSTRAINT — VERIFIED</div>
                  <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#fff', marginBottom: '12px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{primary.name}</h2>
                  <p style={{ fontSize: '14px', color: '#bbb', lineHeight: '1.7', marginBottom: '20px', maxWidth: '520px' }}>{primary.hypothesis || 'This constraint is limiting business performance and has been verified by the BEI intelligence engine.'}</p>
                  <div style={{ display: 'flex', gap: '24px', marginBottom: '20px' }}>
                    <div>
                      <div style={{ fontSize: '9px', color: '#555', letterSpacing: '0.15em', marginBottom: '4px' }}>VERIFICATION SCORE</div>
                      <div style={{ fontSize: '22px', fontWeight: '800', color: verificationScore >= 70 ? '#4aaa4a' : gold }}>{verificationScore}/100</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '9px', color: '#555', letterSpacing: '0.15em', marginBottom: '4px' }}>CONFIDENCE</div>
                      <div style={{ fontSize: '22px', fontWeight: '800', color: confColor }}>{confidence.toUpperCase()}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '9px', color: '#555', letterSpacing: '0.15em', marginBottom: '4px' }}>ANNUAL OPPORTUNITY</div>
                      <div style={{ fontSize: '22px', fontWeight: '800', color: gold }}>{oppLow > 0 ? fmt(oppLow) + '–' + fmt(oppHigh) : 'Calculating'}</div>
                    </div>
                  </div>
                  {primary.evidence && primary.evidence.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ fontSize: '10px', color: '#555', letterSpacing: '0.1em', marginBottom: '8px' }}>KEY EVIDENCE</div>
                      {primary.evidence.slice(0, 2).map((e: string, i: number) => (
                        <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                          <span style={{ color: gold, flexShrink: 0, fontSize: '10px', marginTop: '3px' }}>◈</span>
                          <span style={{ fontSize: '13px', color: '#999', lineHeight: '1.5' }}>{e}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <a href="/constraints" style={{ padding: '9px 20px', backgroundColor: gold, color: '#050505', borderRadius: '6px', fontSize: '12px', fontWeight: '700', textDecoration: 'none' }}>View Constraint Intelligence →</a>
                    <a href="/deployments" style={{ padding: '9px 20px', border: '1px solid #2a2a2a', color: '#888', borderRadius: '6px', fontSize: '12px', textDecoration: 'none' }}>Deployment Packages</a>
                  </div>
                </div>
                {/* Verification gauge */}
                <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '8px' }}>
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#1a1a1a" strokeWidth="6"/>
                    <circle cx="50" cy="50" r="42" fill="none" stroke={verificationScore >= 70 ? '#4aaa4a' : gold} strokeWidth="6"
                      strokeDasharray={`${verificationScore * 2.64} 264`} strokeDashoffset="66" strokeLinecap="round"
                      transform="rotate(-90 50 50)" style={{ transition: 'stroke-dasharray 1.5s ease' }}
                    />
                    <text x="50" y="46" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="800">{verificationScore}</text>
                    <text x="50" y="60" textAnchor="middle" fill="#555" fontSize="8">VERIFIED</text>
                  </svg>
                  <div style={{ fontSize: '9px', color: '#555', textAlign: 'center' as const, letterSpacing: '0.1em' }}>ROOT CAUSE<br/>{primary.is_root_cause ? 'CONFIRMED' : 'SUSPECTED'}</div>
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
                <svg width="100%" viewBox="0 0 200 200" style={{ display: 'block', margin: '0 auto 12px' }}>
                  {[5,10,15,20].map(ring => (
                    <polygon key={ring} points={pillarList.map((_: any, i: number) => {
                      const a = (i/pillarList.length)*2*Math.PI - Math.PI/2
                      const r = (ring/20)*72
                      return `${100+r*Math.cos(a)},${100+r*Math.sin(a)}`
                    }).join(' ')} fill="none" stroke="#1e1e1e" strokeWidth="1"/>
                  ))}
                  {pillarList.map((_: any, i: number) => {
                    const a = (i/pillarList.length)*2*Math.PI - Math.PI/2
                    return <line key={i} x1="100" y1="100" x2={100+72*Math.cos(a)} y2={100+72*Math.sin(a)} stroke="#222" strokeWidth="1"/>
                  })}
                  <polygon points={pillarList.map((p: any, i: number) => {
                    const a = (i/pillarList.length)*2*Math.PI - Math.PI/2
                    const r = (p.score/20)*72
                    return `${100+r*Math.cos(a)},${100+r*Math.sin(a)}`
                  }).join(' ')} fill="rgba(200,162,74,0.12)" stroke={gold} strokeWidth="1.5"/>
                  {pillarList.map((p: any, i: number) => {
                    const a = (i/pillarList.length)*2*Math.PI - Math.PI/2
                    const r = (p.score/20)*72
                    const lx = 100+90*Math.cos(a), ly = 100+95*Math.sin(a)
                    return <g key={i}>
                      <circle cx={100+r*Math.cos(a)} cy={100+r*Math.sin(a)} r="3" fill={p.color}/>
                      <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fill="#666" fontSize="8">{p.name}</text>
                    </g>
                  })}
                  <text x="100" y="96" textAnchor="middle" fill={healthColor} fontSize="20" fontWeight="800">{healthScore}</text>
                  <text x="100" y="110" textAnchor="middle" fill="#555" fontSize="8">HEALTH</text>
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
    </DashboardShell>
  )
}
