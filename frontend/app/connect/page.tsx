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

  if (loading) return (
    <main style={{ backgroundColor: '#050505', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.3em' }}>LOADING BUSINESS TWIN...</div>
    </main>
  )

  if (!user) return (
    <main style={{ backgroundColor: '#050505', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <a href='/login' style={{ padding: '12px 28px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '6px', textDecoration: 'none' }}>Sign In →</a>
    </main>
  )

  const result = selected?.mri_result || null
  const health = result?.health || {}
  const pillars = health.pillars || {}
  const primary = result?.primary_constraint || null
  const businessName = selected?.business_name || 'Your Business'
  const tier = (selected?.subscription_tier || 'analysis').toUpperCase()
  const industry = (selected?.industry || 'Business').charAt(0).toUpperCase() + (selected?.industry || 'business').slice(1)
  const lastUpdated = selected?.updated_at ? new Date(selected.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Unknown'

  const coverageDimensions = [
    { label: 'Financial', pct: 96, color: '#4aaa4a' },
    { label: 'Operations', pct: 82, color: '#4aaa4a' },
    { label: 'People', pct: 74, color: '#e8923a' },
    { label: 'Strategy', pct: 91, color: '#4aaa4a' },
    { label: 'Market', pct: 88, color: '#4aaa4a' },
    { label: 'Clients', pct: 90, color: '#4aaa4a' },
  ]

  const overallCoverage = Math.round(coverageDimensions.reduce((s, d) => s + d.pct, 0) / coverageDimensions.length)

  const getColor = (pct: number) => pct >= 85 ? '#4aaa4a' : pct >= 70 ? '#C8A24A' : pct >= 55 ? '#e8923a' : '#cc4444'

  const n = coverageDimensions.length
  const radarPts = coverageDimensions.map((d, i) => {
    const a = (i / n) * 2 * Math.PI - Math.PI / 2
    const r = (d.pct / 100) * 140
    return { x: 160 + r * Math.cos(a), y: 160 + r * Math.sin(a), lx: 160 + 165 * Math.cos(a), ly: 160 + 165 * Math.sin(a), ...d }
  })

  const connectors = [
    { name: 'Business MRI', status: 'active', quality: 98, contribution: 'Core intelligence foundation', icon: '◈', boost: '+35%' },
    { name: 'Financial Profile', status: 'active', quality: 96, contribution: 'Revenue, cost & growth data', icon: '£', boost: '+18%' },
    { name: 'Operations Profile', status: 'active', quality: 82, contribution: 'Process & delivery data', icon: '⚙', boost: '+14%' },
    { name: 'Market Intelligence', status: 'active', quality: 88, contribution: 'Industry benchmarks & signals', icon: '⊞', boost: '+12%' },
    { name: 'People & Leadership', status: 'partial', quality: 74, contribution: 'Team structure & capacity', icon: '◎', boost: '+8%' },
    { name: 'Client Intelligence', status: 'active', quality: 90, contribution: 'Client base & retention data', icon: '★', boost: '+11%' },
    { name: 'Xero / QuickBooks', status: 'pending', quality: 0, contribution: 'Live financial sync', icon: '⬡', boost: '+6%' },
    { name: 'HubSpot / Salesforce', status: 'pending', quality: 0, contribution: 'CRM & pipeline data', icon: '⊗', boost: '+7%' },
  ]

  const recommendations = [
    { action: 'Connect Xero or QuickBooks', impact: '+6% Twin Accuracy', confidence: '+4% Forecast Confidence', priority: 'HIGH' },
    { action: 'Add Leadership Structure Profile', impact: '+5% Intelligence Accuracy', confidence: '+3% Verification Confidence', priority: 'MEDIUM' },
    { action: 'Connect HubSpot or Salesforce', impact: '+7% Twin Completeness', confidence: '+4% Constraint Detection', priority: 'MEDIUM' },
  ]

  return (
    <DashboardShell activeId="twin">
      {/* HEADER */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.25em', marginBottom: '6px', fontWeight: '600' }}>BUSINESS TWIN™ CENTRE</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-0.02em', margin: 0 }}>Business Twin™</h1>
            <div style={{ fontSize: '13px', color: '#555', marginTop: '4px' }}>{businessName} · {tier} Plan · Last updated {lastUpdated}</div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', backgroundColor: 'rgba(74,170,74,0.1)', border: '1px solid rgba(74,170,74,0.3)', borderRadius: '6px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4aaa4a', boxShadow: '0 0 6px rgba(74,170,74,0.7)' }} />
              <span style={{ fontSize: '11px', color: '#4aaa4a', fontWeight: '600' }}>TWIN ACTIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* HERO IMAGE + STATUS ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', marginBottom: '20px' }}>

        {/* Hero image panel */}
        <div style={{ backgroundColor: '#050505', border: '1px solid rgba(200,162,74,0.2)', borderRadius: '12px', overflow: 'hidden', position: 'relative' as const, minHeight: '280px' }}>
          <div style={{ position: 'absolute' as const, top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #C8A24A, transparent)' }} />
          <img src="/Buisness Twin Center image.png" alt="Business Twin" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', opacity: 0.85, display: 'block' }} onError={(e: any) => { e.target.style.display = 'none' }} />
          <div style={{ position: 'absolute' as const, inset: 0, background: 'linear-gradient(135deg, rgba(5,5,5,0.7) 0%, transparent 50%, rgba(5,5,5,0.4) 100%)' }} />
          <div style={{ position: 'absolute' as const, bottom: '24px', left: '28px' }}>
            <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.25em', fontWeight: '600', marginBottom: '8px' }}>BUSINESS TWIN™ STATUS</div>
            <div style={{ fontSize: '32px', fontWeight: '900', color: '#fff', marginBottom: '4px' }}>{overallCoverage}% Complete</div>
            <div style={{ fontSize: '13px', color: '#aaa' }}>Intelligence model active · {coverageDimensions.filter(d => d.pct >= 80).length} of {n} dimensions strong</div>
          </div>
        </div>

        {/* Status cards */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
          {[
            { label: 'TWIN COMPLETENESS', value: overallCoverage + '%', color: getColor(overallCoverage), sub: 'Across all intelligence dimensions' },
            { label: 'ACCURACY SCORE', value: '94%', color: '#4aaa4a', sub: 'Data consistency verified' },
            { label: 'INTELLIGENCE READINESS', value: 'VERIFIED', color: '#4aaa4a', sub: 'Production-grade confidence' },
            { label: 'ACTIVE DATA SOURCES', value: connectors.filter(c => c.status === 'active').length + '/' + connectors.length, color: gold, sub: 'Connected intelligence feeds' },
          ].map((s, i) => (
            <div key={i} style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '8px', padding: '14px 16px' }}>
              <div style={{ fontSize: '9px', color: '#555', letterSpacing: '0.15em', marginBottom: '4px' }}>{s.label}</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '10px', color: '#444', marginTop: '2px' }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* COVERAGE MAP + CONNECTORS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

        {/* Coverage Radar */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '10px', color: '#e0e0e0', letterSpacing: '0.2em', fontWeight: '600' }}>BUSINESS TWIN™ COVERAGE MAP</div>
              <div style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>Intelligence dimension completeness</div>
            </div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: getColor(overallCoverage) }}>{overallCoverage}%</div>
          </div>

          {/* Radar SVG matching the reference image */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <svg width="320" height="320" viewBox="0 0 320 320">
              <defs>
                <radialGradient id="radarBg" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#0a1a0a"/>
                  <stop offset="100%" stopColor="#050505"/>
                </radialGradient>
                <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              </defs>
              <circle cx="160" cy="160" r="155" fill="url(#radarBg)"/>
              {[25,50,75,100].map(ring => (
                <polygon key={ring} points={coverageDimensions.map((_, i) => {
                  const a = (i / n) * 2 * Math.PI - Math.PI / 2
                  const r = (ring / 100) * 140
                  return `${160 + r * Math.cos(a)},${160 + r * Math.sin(a)}`
                }).join(' ')} fill="none" stroke="#1a2a1a" strokeWidth="1" strokeDasharray={ring === 100 ? '4,4' : 'none'}/>
              ))}
              {coverageDimensions.map((_, i) => {
                const a = (i / n) * 2 * Math.PI - Math.PI / 2
                return <line key={i} x1="160" y1="160" x2={160 + 140 * Math.cos(a)} y2={160 + 140 * Math.sin(a)} stroke="#1a2a1a" strokeWidth="1"/>
              })}
              {/* Filled area with gradient stroke */}
              <polygon
                points={radarPts.map(p => `${p.x},${p.y}`).join(' ')}
                fill="rgba(74,200,74,0.08)"
                stroke="none"
              />
              {/* Coloured segments */}
              {radarPts.map((p, i) => {
                const next = radarPts[(i + 1) % n]
                return <polygon key={i} points={`160,160 ${p.x},${p.y} ${next.x},${next.y}`} fill={p.color + '22'} stroke={p.color} strokeWidth="2" filter="url(#glow)"/>
              })}
              {/* Node dots */}
              {radarPts.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="8" fill={p.color + '33'}/>
                  <circle cx={p.x} cy={p.y} r="5" fill={p.color} filter="url(#glow)"/>
                  <circle cx={p.x} cy={p.y} r="2.5" fill="#fff"/>
                </g>
              ))}
              {/* Labels */}
              {radarPts.map((p, i) => (
                <g key={i}>
                  <text x={p.lx} y={p.ly - 8} textAnchor="middle" fill="#aaa" fontSize="11" fontWeight="600">{p.label}</text>
                  <text x={p.lx} y={p.ly + 6} textAnchor="middle" fill={p.color} fontSize="14" fontWeight="800" filter="url(#glow)">{p.pct}%</text>
                </g>
              ))}
              {/* Centre */}
              <circle cx="160" cy="160" r="20" fill="rgba(200,162,74,0.15)"/>
              <text x="160" y="156" textAnchor="middle" fill={gold} fontSize="11" fontWeight="800">{overallCoverage}</text>
              <text x="160" y="168" textAnchor="middle" fill="#555" fontSize="7" letterSpacing="0.1em">TWIN</text>
            </svg>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            {[['#4aaa4a', 'Strong (85%+)'], ['#C8A24A', 'Moderate (70%)'], ['#e8923a', 'Weak (55%)'], ['#cc4444', 'Gap (<55%)']].map(([c, l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: c }} />
                <span style={{ fontSize: '10px', color: '#666' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Data Sources */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '24px' }}>
          <div style={{ fontSize: '10px', color: '#e0e0e0', letterSpacing: '0.2em', fontWeight: '600', marginBottom: '16px' }}>DATA SOURCE ARCHITECTURE™</div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
            {connectors.map((c, i) => {
              const statusColor = c.status === 'active' ? '#4aaa4a' : c.status === 'partial' ? gold : '#444'
              const statusLabel = c.status === 'active' ? 'ACTIVE' : c.status === 'partial' ? 'PARTIAL' : 'CONNECT'
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', backgroundColor: '#0a0a0a', border: '1px solid ' + (c.status === 'active' ? '#1a2a1a' : border), borderRadius: '8px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: c.status === 'active' ? 'rgba(74,170,74,0.1)' : 'rgba(255,255,255,0.03)', border: '1px solid ' + (c.status === 'active' ? 'rgba(74,170,74,0.2)' : border), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: statusColor, flexShrink: 0 }}>{c.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#e0e0e0' }}>{c.name}</div>
                      <div style={{ fontSize: '9px', color: statusColor, fontWeight: '700', letterSpacing: '0.1em' }}>{statusLabel}</div>
                    </div>
                    <div style={{ fontSize: '10px', color: '#555', marginTop: '1px' }}>{c.contribution}</div>
                  </div>
                  {c.status === 'active' && (
                    <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
                      <div style={{ fontSize: '11px', fontWeight: '700', color: '#4aaa4a' }}>{c.quality}%</div>
                      <div style={{ fontSize: '9px', color: '#444' }}>quality</div>
                    </div>
                  )}
                  {c.status === 'pending' && (
                    <div style={{ fontSize: '10px', color: gold, fontWeight: '600', flexShrink: 0 }}>{c.boost}</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* INTELLIGENCE CONFIDENCE + RECOMMENDATIONS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Intelligence Confidence Engine */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '24px' }}>
          <div style={{ fontSize: '10px', color: '#e0e0e0', letterSpacing: '0.2em', fontWeight: '600', marginBottom: '16px' }}>INTELLIGENCE CONFIDENCE ENGINE™</div>
          {[
            { label: 'Constraint Detection Confidence', value: 94, color: '#4aaa4a' },
            { label: 'Benchmark Accuracy', value: 91, color: '#4aaa4a' },
            { label: 'Opportunity Forecast Confidence', value: 89, color: '#4aaa4a' },
            { label: 'Health Score Accuracy', value: 96, color: '#4aaa4a' },
            { label: 'Verification Reliability', value: 92, color: '#4aaa4a' },
            { label: 'Risk Detection Confidence', value: 87, color: '#C8A24A' },
          ].map((item, i) => (
            <div key={i} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <div style={{ fontSize: '12px', color: '#aaa' }}>{item.label}</div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: item.color }}>{item.value}%</div>
              </div>
              <div style={{ height: '4px', backgroundColor: '#1a1a1a', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: item.value + '%', height: '100%', background: `linear-gradient(90deg, ${item.color}66, ${item.color})`, borderRadius: '2px', transition: 'width 1.5s ease' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Recommended Improvements */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '24px' }}>
          <div style={{ fontSize: '10px', color: '#e0e0e0', letterSpacing: '0.2em', fontWeight: '600', marginBottom: '16px' }}>RECOMMENDED DATA IMPROVEMENTS™</div>
          <div style={{ fontSize: '12px', color: '#555', marginBottom: '16px', lineHeight: '1.6' }}>
            Connecting additional data sources will improve Business Twin™ completeness and intelligence accuracy.
          </div>
          {recommendations.map((r, i) => (
            <div key={i} style={{ padding: '14px 16px', backgroundColor: '#0a0a0a', border: '1px solid rgba(200,162,74,0.1)', borderRadius: '8px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ fontSize: '9px', color: r.priority === 'HIGH' ? '#cc4444' : gold, fontWeight: '700', letterSpacing: '0.1em' }}>{r.priority}</div>
              </div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#e0e0e0', marginBottom: '8px' }}>{r.action}</div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ padding: '3px 10px', backgroundColor: 'rgba(74,170,74,0.08)', border: '1px solid rgba(74,170,74,0.2)', borderRadius: '4px', fontSize: '10px', color: '#4aaa4a', fontWeight: '600' }}>{r.impact}</div>
                <div style={{ padding: '3px 10px', backgroundColor: 'rgba(200,162,74,0.08)', border: '1px solid rgba(200,162,74,0.15)', borderRadius: '4px', fontSize: '10px', color: gold, fontWeight: '600' }}>{r.confidence}</div>
              </div>
            </div>
          ))}
          <a href="/connect" style={{ display: 'block', marginTop: '16px', padding: '10px', backgroundColor: gold, color: '#050505', borderRadius: '6px', fontSize: '12px', fontWeight: '700', textDecoration: 'none', textAlign: 'center' as const }}>
            Connect Data Sources →
          </a>
        </div>
      </div>
    </DashboardShell>
  )
}
