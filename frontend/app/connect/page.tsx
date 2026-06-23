'use client'
import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase'
import DashboardShell from '../components/DashboardShell'

const supabase = createClient()
const gold = '#C8A24A'
const card = '#0e0e0e'
const border = '#1e1e1e'

export default function BusinessTwinPage() {
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
            .select('id, business_name, mri_result, subscription_tier, industry, location_country, updated_at')
            .eq('email', user.email)
            .order('updated_at', { ascending: false })
          if (data && data.length > 0) setSelected(data[0])
        }
      } catch (e) {}
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <main style={{ backgroundColor: '#050505', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ fontSize: '11px', color: gold, letterSpacing: '0.3em' }}>LOADING BUSINESS TWIN...</div></main>
  if (!user) return <main style={{ backgroundColor: '#050505', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><a href='/login' style={{ padding: '12px 28px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '6px', textDecoration: 'none' }}>Sign In</a></main>

  const result = selected?.mri_result || null
  const health = result?.health || {}
  const pillars = health.pillars || {}
  const businessName = selected?.business_name || 'Your Business'
  const tier = (selected?.subscription_tier || 'analysis').toUpperCase()
  const lastUpdated = selected?.updated_at ? new Date(selected.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

  const dims = [
    { label: 'Financial', pct: 96, color: '#4aaa4a' },
    { label: 'Operations', pct: 82, color: '#4aaa4a' },
    { label: 'People', pct: 74, color: '#e8923a' },
    { label: 'Strategy', pct: 91, color: '#4aaa4a' },
    { label: 'Market', pct: 88, color: '#4aaa4a' },
    { label: 'Clients', pct: 90, color: '#4aaa4a' },
  ]
  const n = dims.length
  const overall = Math.round(dims.reduce((s, d) => s + d.pct, 0) / n)
  const gc = (p: number) => p >= 85 ? '#4aaa4a' : p >= 70 ? '#C8A24A' : '#e8923a'

  const radarPts = dims.map((d, i) => {
    const a = (i / n) * 2 * Math.PI - Math.PI / 2
    const r = (d.pct / 100) * 100
    return { x: 120 + r * Math.cos(a), y: 120 + r * Math.sin(a), lx: 120 + 118 * Math.cos(a), ly: 120 + 118 * Math.sin(a), ...d }
  })

  const sources = [
    { name: 'Business MRI', status: 'Connected', sync: 'Just now', quality: 98, boost: '+22%', color: '#4aaa4a' },
    { name: 'Financial Profile', status: 'Connected', sync: '2 hrs ago', quality: 96, boost: '+18%', color: '#4aaa4a' },
    { name: 'Operations Profile', status: 'Connected', sync: '3 hrs ago', quality: 82, boost: '+14%', color: '#4aaa4a' },
    { name: 'Market Intelligence', status: 'Connected', sync: '1 day ago', quality: 88, boost: '+12%', color: '#4aaa4a' },
    { name: 'People & Leadership', status: 'Partial', sync: '1 week ago', quality: 74, boost: '+8%', color: '#C8A24A' },
    { name: 'Client Intelligence', status: 'Connected', sync: '5 hrs ago', quality: 90, boost: '+11%', color: '#4aaa4a' },
    { name: 'Xero / QuickBooks', status: 'Connect', sync: '—', quality: 0, boost: '+6%', color: '#444' },
    { name: 'HubSpot / Salesforce', status: 'Connect', sync: '—', quality: 0, boost: '+7%', color: '#444' },
  ]

  const manualInputs = [
    { label: 'Business Profile', pct: 100, icon: '◈' },
    { label: 'Financial Inputs', pct: 94, icon: '£' },
    { label: 'Operations Inputs', pct: 86, icon: '⚙' },
    { label: 'Market Inputs', pct: 88, icon: '⊞' },
    { label: 'Leadership Inputs', pct: 82, icon: '◎' },
    { label: 'Strategy Inputs', pct: 90, icon: '▲' },
  ]

  const timeline = [
    { label: 'MRI data refreshed', time: 'Just now', color: gold },
    { label: 'Benchmarks updated', time: '2 hrs ago', color: '#4aaa4a' },
    { label: 'Constraint re-evaluated', time: '5 hrs ago', color: '#4aaa4a' },
    { label: 'Intelligence confidence recalculated', time: '6 hrs ago', color: '#4aaa4a' },
    { label: 'Market signals updated', time: '1 day ago', color: '#4a8ab0' },
    { label: 'Manual inputs submitted', time: '1 day ago', color: gold },
  ]

  const confidence = [
    { label: 'Constraint Detection', val: 94 },
    { label: 'Health Scores', val: 95 },
    { label: 'Verification Scores', val: 93 },
    { label: 'Opportunity Forecasting', val: 89 },
    { label: 'Risk Intelligence', val: 92 },
    { label: 'Benchmark Accuracy', val: 91 },
  ]

  return (
    <DashboardShell activeId="twin">

      {/* HERO ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px 280px', gap: '0', backgroundColor: '#050505', border: '1px solid rgba(200,162,74,0.2)', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px', position: 'relative' as const }}>
        <div style={{ position: 'absolute' as const, top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #C8A24A, transparent)' }} />

        {/* Left: Title */}
        <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column' as const, justifyContent: 'center' }}>
          <div style={{ fontSize: '10px', color: '#555', letterSpacing: '0.2em', marginBottom: '8px', fontWeight: '600' }}>COMMAND CENTRE</div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '-0.02em', margin: '0 0 8px', lineHeight: 1.1 }}>Business Twin™ Centre</h1>
          <div style={{ fontSize: '13px', color: '#555', marginBottom: '20px' }}>The intelligence foundation powering every BEI recommendation</div>
          <div style={{ fontSize: '11px', color: '#444' }}>{businessName} · {tier} Plan · Last updated {lastUpdated}</div>
        </div>

        {/* Centre: Building image */}
        <div style={{ position: 'relative' as const, overflow: 'hidden', minHeight: '220px' }}>
          <img src="/Buisness Twin Center image.png" alt="Business Twin" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }} onError={(e: any) => { e.target.style.display = 'none' }} />
        </div>

        {/* Right: Status */}
        <div style={{ padding: '28px 24px', borderLeft: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column' as const, justifyContent: 'center', gap: '12px' }}>
          <div style={{ fontSize: '9px', color: '#555', letterSpacing: '0.15em' }}>BUSINESS TWIN™ STATUS</div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: gold, lineHeight: 1 }}>Intelligence</div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: gold, lineHeight: 1, marginTop: '-8px' }}>Ready</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4aaa4a', boxShadow: '0 0 8px rgba(74,170,74,0.8)' }} />
            <span style={{ fontSize: '11px', color: '#4aaa4a', fontWeight: '600', letterSpacing: '0.1em' }}>ACTIVE</span>
          </div>
          <div style={{ fontSize: '11px', color: '#444', marginTop: '4px' }}>Last updated: 2 hours ago</div>
          {/* Big checkmark */}
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: '3px solid #4aaa4a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '8px', boxShadow: '0 0 20px rgba(74,170,74,0.2)' }}>
            <svg width="32" height="32" viewBox="0 0 32 32"><polyline points="6,16 13,23 26,9" fill="none" stroke="#4aaa4a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
      </div>

      {/* KPI STRIP */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '10px', marginBottom: '16px' }}>
        {[
          { label: 'COMPLETENESS', value: overall + '%', trend: '+6%', color: gc(overall), sub: 'vs last 30 days' },
          { label: 'ACCURACY', value: '96%', trend: '+4%', color: '#4aaa4a', sub: 'vs last 30 days' },
          { label: 'DATA CONFIDENCE', value: '94%', trend: '+5%', color: '#4aaa4a', sub: 'vs last 30 days' },
          { label: 'CONNECTED SOURCES', value: sources.filter(s => s.status === 'Connected').length.toString(), trend: 'Active', color: gold, sub: 'intelligence feeds' },
          { label: 'MANUAL INPUTS', value: '86%', trend: '+8%', color: '#4aaa4a', sub: 'complete' },
          { label: 'INTELLIGENCE READINESS', value: 'Verified', trend: 'High Confidence', color: '#4aaa4a', sub: 'Production grade' },
        ].map((k, i) => (
          <div key={i} style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '8px', padding: '14px 16px' }}>
            <div style={{ fontSize: '9px', color: '#555', letterSpacing: '0.12em', marginBottom: '6px', fontWeight: '600' }}>{k.label}</div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: k.color, lineHeight: 1 }}>{k.value}</div>
            <div style={{ fontSize: '10px', color: '#4aaa4a', marginTop: '4px' }}>↑ {k.trend}</div>
            <div style={{ fontSize: '10px', color: '#444', marginTop: '2px' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* 4-COLUMN MAIN GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '14px' }}>

        {/* DATA SOURCE ARCHITECTURE */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '10px', color: '#e0e0e0', letterSpacing: '0.15em', fontWeight: '600' }}>DATA SOURCE ARCHITECTURE™</div>
          </div>
          <div style={{ fontSize: '11px', color: '#555', marginBottom: '12px' }}>Connected systems feeding your Business Twin™</div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
            {sources.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 10px', backgroundColor: '#0a0a0a', borderRadius: '6px', border: '1px solid ' + (s.status === 'Connected' ? '#1a2a1a' : border) }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: s.color, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '11px', color: '#e0e0e0', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{s.name}</div>
                  <div style={{ fontSize: '9px', color: '#444' }}>{s.sync}</div>
                </div>
                <div style={{ fontSize: '9px', color: s.color, fontWeight: '700', flexShrink: 0 }}>{s.status === 'Connect' ? s.boost : s.quality + '%'}</div>
              </div>
            ))}
          </div>
          <button style={{ marginTop: '12px', width: '100%', padding: '8px', backgroundColor: 'transparent', border: '1px dashed #2a2a2a', borderRadius: '6px', color: gold, fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}>+ Connect new system</button>
        </div>

        {/* MANUAL INTELLIGENCE INPUTS */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '18px' }}>
          <div style={{ fontSize: '10px', color: '#e0e0e0', letterSpacing: '0.15em', fontWeight: '600', marginBottom: '4px' }}>MANUAL INTELLIGENCE INPUTS™</div>
          <div style={{ fontSize: '11px', color: '#555', marginBottom: '14px' }}>Your manual data strengthens the Business Twin™</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
            {manualInputs.map((m, i) => (
              <div key={i} style={{ padding: '12px', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid ' + (m.pct >= 90 ? '#1a2a1a' : border) }}>
                <div style={{ fontSize: '11px', color: '#888', marginBottom: '6px' }}>{m.label}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="32" height="32" viewBox="0 0 32 32">
                    <circle cx="16" cy="16" r="13" fill="none" stroke="#1a1a1a" strokeWidth="3"/>
                    <circle cx="16" cy="16" r="13" fill="none" stroke={gc(m.pct)} strokeWidth="3"
                      strokeDasharray={`${m.pct * 0.816} 81.6`} strokeDashoffset="20.4" strokeLinecap="round"
                      transform="rotate(-90 16 16)"/>
                  </svg>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: gc(m.pct) }}>{m.pct}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button style={{ width: '100%', padding: '8px', backgroundColor: 'rgba(200,162,74,0.08)', border: '1px solid rgba(200,162,74,0.2)', borderRadius: '6px', color: gold, fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}>+ Add / update manual data</button>
        </div>

        {/* COVERAGE MAP */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ fontSize: '10px', color: '#e0e0e0', letterSpacing: '0.15em', fontWeight: '600' }}>BUSINESS TWIN™ COVERAGE MAP</div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: gc(overall) }}>{overall}%</div>
          </div>
          <div style={{ fontSize: '11px', color: '#555', marginBottom: '10px' }}>What BEI currently understands about your business</div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <svg width="240" height="240" viewBox="0 0 240 240">
              <defs>
                <filter id="glow2"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              </defs>
              <circle cx="120" cy="120" r="115" fill="#050505"/>
              {[25,50,75,100].map(ring => (
                <polygon key={ring} points={dims.map((_, i) => {
                  const a = (i/n)*2*Math.PI - Math.PI/2
                  const r = (ring/100)*100
                  return `${120+r*Math.cos(a)},${120+r*Math.sin(a)}`
                }).join(' ')} fill="none" stroke="#1a2a1a" strokeWidth="0.8" strokeDasharray={ring===100?'3,3':'none'}/>
              ))}
              {dims.map((_, i) => { const a=(i/n)*2*Math.PI-Math.PI/2; return <line key={i} x1="120" y1="120" x2={120+100*Math.cos(a)} y2={120+100*Math.sin(a)} stroke="#1a2a1a" strokeWidth="0.8"/> })}
              {radarPts.map((p, i) => {
                const next = radarPts[(i+1)%n]
                return <polygon key={i} points={`120,120 ${p.x},${p.y} ${next.x},${next.y}`} fill={p.color+'18'} stroke={p.color} strokeWidth="1.5" filter="url(#glow2)"/>
              })}
              {radarPts.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="5" fill={p.color} filter="url(#glow2)"/>
                  <circle cx={p.x} cy={p.y} r="2" fill="#fff"/>
                  <text x={p.lx} y={p.ly-5} textAnchor="middle" fill="#888" fontSize="9" fontWeight="600">{p.label}</text>
                  <text x={p.lx} y={p.ly+7} textAnchor="middle" fill={p.color} fontSize="11" fontWeight="800">{p.pct}%</text>
                </g>
              ))}
              <text x="120" y="116" textAnchor="middle" fill={gold} fontSize="16" fontWeight="900">{overall}</text>
              <text x="120" y="128" textAnchor="middle" fill="#555" fontSize="7" letterSpacing="0.1em">TWIN</text>
            </svg>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '8px', flexWrap: 'wrap' as const }}>
            {[['#4aaa4a','Strong'],['#C8A24A','Moderate'],['#e8923a','Weak'],['#cc4444','Gap']].map(([c,l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: c }} />
                <span style={{ fontSize: '9px', color: '#555' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* TWIN TIMELINE */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '18px' }}>
          <div style={{ fontSize: '10px', color: '#e0e0e0', letterSpacing: '0.15em', fontWeight: '600', marginBottom: '4px' }}>BUSINESS TWIN™ TIMELINE</div>
          <div style={{ fontSize: '11px', color: '#555', marginBottom: '14px' }}>Live audit trail of intelligence generation</div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0' }}>
            {timeline.map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', paddingBottom: '12px', position: 'relative' as const }}>
                <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: t.color, marginTop: '3px', boxShadow: `0 0 6px ${t.color}88` }} />
                  {i < timeline.length - 1 && <div style={{ width: '1px', flex: 1, backgroundColor: '#1a1a1a', marginTop: '4px' }} />}
                </div>
                <div style={{ flex: 1, paddingBottom: '4px' }}>
                  <div style={{ fontSize: '11px', color: '#e0e0e0', fontWeight: '600', lineHeight: '1.3' }}>{t.label}</div>
                  <div style={{ fontSize: '10px', color: '#444', marginTop: '2px' }}>{t.time}</div>
                </div>
              </div>
            ))}
          </div>
          <button style={{ width: '100%', padding: '8px', backgroundColor: 'transparent', border: '1px solid #1a1a1a', borderRadius: '6px', color: '#555', fontSize: '11px', cursor: 'pointer' }}>View full timeline →</button>
        </div>
      </div>

      {/* BOTTOM 4-COLUMN ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px' }}>

        {/* DATA QUALITY ENGINE */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '18px' }}>
          <div style={{ fontSize: '10px', color: '#e0e0e0', letterSpacing: '0.15em', fontWeight: '600', marginBottom: '4px' }}>DATA QUALITY ENGINE™</div>
          <div style={{ fontSize: '11px', color: '#555', marginBottom: '14px' }}>Quality directly impacts intelligence accuracy</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '12px' }}>
            {[['Completeness','92'],['Freshness','95'],['Consistency','93'],['Coverage','90'],['Verification','94']].map(([l,v]) => (
              <div key={l} style={{ textAlign: 'center' as const, padding: '10px 6px', backgroundColor: '#0a0a0a', borderRadius: '6px' }}>
                <svg width="40" height="40" viewBox="0 0 40 40" style={{ display: 'block', margin: '0 auto 4px' }}>
                  <circle cx="20" cy="20" r="16" fill="none" stroke="#1a1a1a" strokeWidth="3"/>
                  <circle cx="20" cy="20" r="16" fill="none" stroke="#4aaa4a" strokeWidth="3"
                    strokeDasharray={`${parseInt(v)*1.005} 100.5`} strokeDashoffset="25" strokeLinecap="round"
                    transform="rotate(-90 20 20)"/>
                  <text x="20" y="24" textAnchor="middle" fill="#4aaa4a" fontSize="10" fontWeight="800">{v}</text>
                </svg>
                <div style={{ fontSize: '9px', color: '#555' }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: '12px', backgroundColor: '#0a0a0a', borderRadius: '6px', border: '1px solid #1a2a1a' }}>
            <div style={{ fontSize: '11px', color: '#555', marginBottom: '4px' }}>OVERALL DATA QUALITY SCORE</div>
            <div style={{ fontSize: '28px', fontWeight: '900', color: '#4aaa4a' }}>93/100</div>
            <div style={{ fontSize: '10px', color: '#4aaa4a', marginTop: '2px' }}>↑ 6 pts vs last 30 days</div>
          </div>
        </div>

        {/* INTELLIGENCE CONFIDENCE ENGINE */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '18px' }}>
          <div style={{ fontSize: '10px', color: '#e0e0e0', letterSpacing: '0.15em', fontWeight: '600', marginBottom: '4px' }}>INTELLIGENCE CONFIDENCE ENGINE™</div>
          <div style={{ fontSize: '11px', color: '#555', marginBottom: '14px' }}>How Business Twin™ quality impacts your intelligence</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '12px' }}>
            {confidence.map((c, i) => (
              <div key={i} style={{ textAlign: 'center' as const, padding: '10px 6px', backgroundColor: '#0a0a0a', borderRadius: '6px' }}>
                <svg width="40" height="40" viewBox="0 0 40 40" style={{ display: 'block', margin: '0 auto 4px' }}>
                  <circle cx="20" cy="20" r="16" fill="none" stroke="#1a1a1a" strokeWidth="3"/>
                  <circle cx="20" cy="20" r="16" fill="none" stroke={gc(c.val)} strokeWidth="3"
                    strokeDasharray={`${c.val*1.005} 100.5`} strokeDashoffset="25" strokeLinecap="round"
                    transform="rotate(-90 20 20)"/>
                  <text x="20" y="24" textAnchor="middle" fill={gc(c.val)} fontSize="10" fontWeight="800">{c.val}</text>
                </svg>
                <div style={{ fontSize: '9px', color: '#555', lineHeight: '1.2' }}>{c.label.split(' ').slice(0,2).join(' ')}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: '12px', backgroundColor: '#0a0a0a', borderRadius: '6px' }}>
            <div style={{ fontSize: '11px', color: '#555', marginBottom: '6px' }}>OVERALL INTELLIGENCE CONFIDENCE</div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#4aaa4a', marginBottom: '6px' }}>93% <span style={{ fontSize: '12px', color: '#4aaa4a' }}>High Confidence</span></div>
            <div style={{ height: '6px', backgroundColor: '#1a1a1a', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: '93%', height: '100%', background: 'linear-gradient(90deg, #cc4444, #e8923a, #C8A24A, #4aaa4a)', borderRadius: '3px' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              {['Low','Medium','High','Very High'].map(l => <span key={l} style={{ fontSize: '8px', color: '#333' }}>{l}</span>)}
            </div>
          </div>
        </div>

        {/* RECOMMENDED IMPROVEMENTS */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '18px' }}>
          <div style={{ fontSize: '10px', color: '#e0e0e0', letterSpacing: '0.15em', fontWeight: '600', marginBottom: '4px' }}>RECOMMENDED DATA IMPROVEMENTS</div>
          <div style={{ fontSize: '11px', color: '#555', marginBottom: '14px' }}>Increase accuracy and unlock more intelligence</div>
          {[
            { icon: '⬡', name: 'Connect HubSpot', impact: '+7% Completeness', conf: '+6% Confidence', priority: 'HIGH', color: '#cc4444' },
            { icon: '◎', name: 'Add Leadership Structure', impact: '+5% Accuracy', conf: '+3% Confidence', priority: 'MEDIUM', color: gold },
            { icon: '⊞', name: 'Update Market Positioning', impact: '+4% Accuracy', conf: '+2% Confidence', priority: 'MEDIUM', color: gold },
            { icon: '⚙', name: 'Complete Operations Profile', impact: '+6% Accuracy', conf: '+3% Confidence', priority: 'LOW', color: '#4a8ab0' },
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', backgroundColor: '#0a0a0a', borderRadius: '6px', marginBottom: '8px', border: '1px solid ' + border }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: r.color + '15', border: '1px solid ' + r.color + '44', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>{r.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '11px', color: '#e0e0e0', fontWeight: '600' }}>{r.name}</div>
                <div style={{ fontSize: '9px', color: '#555', marginTop: '2px' }}>{r.impact} · {r.conf}</div>
              </div>
              <button style={{ padding: '4px 10px', backgroundColor: 'rgba(200,162,74,0.1)', border: '1px solid rgba(200,162,74,0.2)', borderRadius: '4px', color: gold, fontSize: '10px', cursor: 'pointer', fontWeight: '600', flexShrink: 0 }}>Update</button>
            </div>
          ))}
          <button style={{ width: '100%', padding: '8px', backgroundColor: 'transparent', border: '1px solid #1a1a1a', borderRadius: '6px', color: '#555', fontSize: '11px', cursor: 'pointer' }}>View all recommendations →</button>
        </div>

        {/* TWIN HEALTH TREND */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ fontSize: '10px', color: '#e0e0e0', letterSpacing: '0.15em', fontWeight: '600' }}>TWIN HEALTH TREND</div>
            <div style={{ fontSize: '10px', color: '#555', padding: '3px 8px', border: '1px solid #1a1a1a', borderRadius: '4px' }}>30 Days ▾</div>
          </div>
          <div style={{ fontSize: '11px', color: '#555', marginBottom: '14px' }}>30 day trend</div>
          <svg width="100%" height="120" viewBox="0 0 240 120" style={{ display: 'block', marginBottom: '12px' }}>
            <defs>
              <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C8A24A" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#C8A24A" stopOpacity="0"/>
              </linearGradient>
            </defs>
            {[25,50,75,100].map(line => (
              <line key={line} x1="0" y1={120-(line/100)*100} x2="240" y2={120-(line/100)*100} stroke="#1a1a1a" strokeWidth="0.5"/>
            ))}
            <polyline points="0,80 40,72 80,68 120,55 160,45 200,38 240,28" fill="none" stroke="#C8A24A" strokeWidth="2" strokeLinecap="round"/>
            <polygon points="0,80 40,72 80,68 120,55 160,45 200,38 240,28 240,120 0,120" fill="url(#trendGrad)"/>
            <polyline points="0,70 40,68 80,72 120,65 160,60 200,58 240,55" fill="none" stroke="#1a1a1a" strokeWidth="1" strokeDasharray="4,3"/>
            <circle cx="240" cy="28" r="4" fill="#C8A24A"/>
            <text x="230" y="22" textAnchor="middle" fill="#C8A24A" fontSize="10" fontWeight="700">93</text>
          </svg>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px', marginBottom: '12px' }}>
            {['23 May','30 May','6 Jun','13 Jun','20 Jun'].map(d => (
              <div key={d} style={{ fontSize: '9px', color: '#333', flex: 1, textAlign: 'center' as const }}>{d}</div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '16px', height: '2px', backgroundColor: gold }} />
              <span style={{ fontSize: '9px', color: '#555' }}>Twin Score</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '16px', height: '1px', backgroundColor: '#444', borderTop: '1px dashed #444' }} />
              <span style={{ fontSize: '9px', color: '#555' }}>Industry Average</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
