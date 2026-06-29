'use client'
import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase'
import DashboardShell from '../components/DashboardShell'

const supabase = createClient()
const gold = '#C8A24A'
const card = '#0e0e0e'
const border = '#1e1e1e'

export default function RiskIntelligencePage() {
  const [result, setResult] = useState<Record<string, any> | null>(null)
  const [businessName, setBusinessName] = useState('Your Business')
  const [loading, setLoading] = useState(true)
  const [showHeatMapModal, setShowHeatMapModal] = useState(false)
  const [showRiskRegisterModal, setShowRiskRegisterModal] = useState(false)
  const [showBreakdownModal, setShowBreakdownModal] = useState(false)
  const [showTrendModal, setShowTrendModal] = useState(false)
  const [showInsightsModal, setShowInsightsModal] = useState(false)
  const [showMitigationModal, setShowMitigationModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [selectedRisk, setSelectedRisk] = useState<any>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data } = await supabase
            .from('businesses')
            .select('id, business_name, mri_result, location_country, industry')
            .eq('email', user.email)
            .order('updated_at', { ascending: false })
            .limit(1)
            .single()
          if (data) {
            setBusinessName(data.business_name || 'Your Business')
            if (data.mri_result) setResult(data.mri_result)
          }
        }
      } catch (e) {}
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <main style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: '17px', color: gold, letterSpacing: '0.3em' }}>LOADING RISK INTELLIGENCE...</div>
    </main>
  )

  const primary = result?.primary_constraint || null
  const totalOpp = result?.total_opportunity || {}
  const oppHigh = totalOpp?.total_high || 30000
  const fmt = (n: number) => '£' + Math.round(n).toLocaleString('en-GB')
  const overallRiskScore = 62

  const risks = [
    { id: 1, name: 'Revenue Concentration', desc: 'High dependency on top 3 clients', category: 'Strategic', severity: 'critical', sevColor: '#cc4444', likelihood: 'High', impact: 'Very High', value: Math.round(oppHigh * 1.07), px: 4, py: 5 },
    { id: 2, name: 'Key Person Dependency', desc: 'Business heavily dependent on key individuals', category: 'People', severity: 'high', sevColor: '#e8923a', likelihood: 'High', impact: 'Very High', value: Math.round(oppHigh * 0.6), px: 4, py: 5 },
    { id: 3, name: 'Operational Inefficiency', desc: 'Process gaps causing productivity loss', category: 'Operational', severity: 'high', sevColor: '#e8923a', likelihood: 'High', impact: 'High', value: Math.round(oppHigh * 0.37), px: 4, py: 4 },
    { id: 4, name: 'Cyber Security Threat', desc: 'Increasing cyber attack surface', category: 'Technology', severity: 'high', sevColor: '#e8923a', likelihood: 'Medium', impact: 'Very High', value: Math.round(oppHigh * 0.15), px: 3, py: 5 },
    { id: 5, name: 'Compliance & Regulatory', desc: 'Exposure to regulatory changes', category: 'Compliance', severity: 'medium', sevColor: gold, likelihood: 'Medium', impact: 'Medium', value: Math.round(oppHigh * 0.12), px: 3, py: 3 },
    { id: 6, name: 'Cash Flow Volatility', desc: 'Irregular revenue affecting liquidity', category: 'Financial', severity: 'medium', sevColor: gold, likelihood: 'Medium', impact: 'High', value: Math.round(oppHigh * 0.10), px: 3, py: 4 },
    { id: 7, name: 'Market Competition', desc: 'Increasing competitive pressure', category: 'Strategic', severity: 'medium', sevColor: gold, likelihood: 'High', impact: 'Medium', value: Math.round(oppHigh * 0.09), px: 4, py: 3 },
    { id: 8, name: 'Technology Debt', desc: 'Ageing systems reducing efficiency', category: 'Technology', severity: 'low', sevColor: '#4a8ab0', likelihood: 'Low', impact: 'Medium', value: Math.round(oppHigh * 0.07), px: 2, py: 3 },
    { id: 9, name: 'Supplier Dependency', desc: 'Single-source supplier concentration', category: 'Operational', severity: 'low', sevColor: '#4a8ab0', likelihood: 'Low', impact: 'Medium', value: Math.round(oppHigh * 0.06), px: 2, py: 3 },
    { id: 10, name: 'Talent Retention', desc: 'Risk of losing key team members', category: 'People', severity: 'low', sevColor: '#4a8ab0', likelihood: 'Medium', impact: 'Low', value: Math.round(oppHigh * 0.05), px: 3, py: 2 },
  ]

  const riskCategories = [
    { label: 'Strategic Risk', score: 65, trend: 6, dir: 'Increasing', color: '#cc4444', desc: 'Long-term strategic threats and uncertainties' },
    { label: 'Operational Risk', score: 60, trend: 4, dir: 'Increasing', color: '#e8923a', desc: 'Internal process and execution risks' },
    { label: 'Financial Risk', score: 58, trend: -2, dir: 'Stable', color: gold, desc: 'Financial exposure and liquidity risks' },
    { label: 'Compliance Risk', score: 55, trend: 1, dir: 'Stable', color: '#4aaa4a', desc: 'Regulatory and compliance obligations' },
    { label: 'People Risk', score: 63, trend: 5, dir: 'Increasing', color: '#4a8ab0', desc: 'Human capital and talent risks' },
    { label: 'Technology Risk', score: 59, trend: 3, dir: 'Increasing', color: '#9a6ab0', desc: 'Technology and cybersecurity risks' },
  ]

  const mitigations = [
    { n: 1, title: 'Diversify Revenue Base', desc: 'Reduce concentration risk', severity: 'critical', sevColor: '#cc4444', status: 'In Progress', progress: 60 },
    { n: 2, title: 'Key Person Succession Plan', desc: 'Reduce dependency risk', severity: 'high', sevColor: '#e8923a', status: 'In Progress', progress: 40 },
    { n: 3, title: 'Process Optimisation', desc: 'Improve operational efficiency', severity: 'high', sevColor: '#e8923a', status: 'Planned', progress: 0 },
    { n: 4, title: 'Cyber Security Enhancement', desc: 'Strengthen security posture', severity: 'high', sevColor: '#e8923a', status: 'In Progress', progress: 75 },
    { n: 5, title: 'Compliance Framework Update', desc: 'Update compliance processes', severity: 'medium', sevColor: gold, status: 'Planned', progress: 0 },
  ]

  const criticalCount = risks.filter(r => r.severity === 'critical').length
  const highCount = risks.filter(r => r.severity === 'high').length
  const mediumCount = risks.filter(r => r.severity === 'medium').length
  const lowCount = risks.filter(r => r.severity === 'low').length
  const totalRiskValue = risks.reduce((s, r) => s + r.value, 0)

  const heatColors: Record<string, string> = {
    '5,1':'#1a3a10','5,2':'#2a5a10','5,3':'#8a6a00','5,4':'#aa4400','5,5':'#881010',
    '4,1':'#1a3a10','4,2':'#2a5a10','4,3':'#6a6a00','4,4':'#cc4400','4,5':'#aa1818',
    '3,1':'#102a08','3,2':'#1a4a10','3,3':'#4a5a00','3,4':'#8a5a00','3,5':'#884400',
    '2,1':'#0a1a08','2,2':'#102808','2,3':'#2a3a08','2,4':'#3a4a00','2,5':'#5a3a00',
    '1,1':'#080e08','1,2':'#0a1408','1,3':'#141a08','1,4':'#1a2208','1,5':'#2a2808',
  }
  const heatRisks: Record<string, number[]> = {}
  risks.forEach(r => {
    const key = r.py + ',' + r.px
    if (!heatRisks[key]) heatRisks[key] = []
    heatRisks[key].push(r.id)
  })

  const sevBadge = (sev: string, color: string) => (
    <div style={{ padding: '2px 7px', backgroundColor: color + '18', border: '1px solid ' + color + '44', borderRadius: '4px', fontSize: '17px', color, fontWeight: '700', whiteSpace: 'nowrap' as const }}>{sev.toUpperCase()}</div>
  )

  const progressBar = (pct: number, color: string) => (
    <div style={{ height: '4px', backgroundColor: '#1a1a1a', borderRadius: '2px', overflow: 'hidden', flex: 1 }}>
      <div style={{ width: pct + '%', height: '100%', backgroundColor: color, borderRadius: '2px' }} />
    </div>
  )

  return (
    <DashboardShell activeId="risk">

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', paddingBottom: '18px', borderBottom: '1px solid ' + border }}>
        <div>
          <h1 style={{ fontSize: '29px', fontWeight: '900', letterSpacing: '-0.02em', margin: '0 0 6px', color: 'var(--text-primary)' }}>Risk Intelligence™</h1>
          <div style={{ fontSize: '17px', color: 'var(--text-muted)' }}>Identify, assess and monitor the risks that could impact your business performance.</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '17px', color: 'var(--text-muted)' }}>
            Business Twin™: <span style={{ color: '#4aaa4a', fontWeight: '600' }}>Active</span>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#4aaa4a', boxShadow: '0 0 6px rgba(74,170,74,0.7)' }} />
          </div>
          <button onClick={() => setShowReportModal(true)} style={{ padding: '8px 14px', backgroundColor: 'rgba(200,162,74,0.1)', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '6px', color: gold, fontSize: '17px', fontWeight: '600', cursor: 'pointer' }}>⊙ Risk Scan</button>
          <div style={{ width: '32px', height: '32px', border: '1px solid ' + border, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '17px' }}>⋮</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '10px', marginBottom: '16px' }}>
        {[
          { label: 'OVERALL RISK SCORE', value: overallRiskScore + '/100', sub: 'vs last 30 days', trend: '↑ 8 pts', trendColor: '#cc4444' },
          { label: 'TOTAL RISKS IDENTIFIED', value: String(risks.length), sub: 'vs last 30 days', trend: '↑ 5', trendColor: '#e8923a' },
          { label: 'CRITICAL RISKS', value: String(criticalCount), sub: 'vs last 30 days', trend: '↑ 1', trendColor: '#cc4444' },
          { label: 'HIGH RISKS', value: String(highCount), sub: 'vs last 30 days', trend: '↑ 2', trendColor: '#e8923a' },
          { label: 'RISK EXPOSURE VALUE', value: fmt(totalRiskValue), sub: 'Potential impact', trend: '↑ £120,000', trendColor: '#cc4444' },
          { label: 'RISK TREND', value: 'Increasing', sub: 'Upward trend', trend: 'vs last 30 days', trendColor: '#cc4444' },
        ].map((k, i) => (
          <div key={i} style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '8px', padding: '14px 16px' }}>
            <div style={{ fontSize: '17px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '6px', fontWeight: '700' }}>{k.label}</div>
            <div style={{ fontSize: i === 5 ? '16px' : '22px', fontWeight: '900', color: i === 5 ? '#cc4444' : '#ffffff', lineHeight: 1, marginBottom: '3px' }}>{k.value}</div>
            {i === 0 && <div style={{ fontSize: '17px', color: '#cc4444', fontWeight: '700', marginBottom: '3px' }}>High</div>}
            <div style={{ fontSize: '17px', color: 'var(--text-muted)', marginBottom: '4px' }}>{k.sub}</div>
            <div style={{ fontSize: '17px', color: k.trendColor, fontWeight: '600' }}>{k.trend}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>

        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ fontSize: '17px', color: '#dddddd', letterSpacing: '0.15em', fontWeight: '600' }}>RISK HEAT MAP</div>
            <button onClick={() => setShowHeatMapModal(true)} style={{ fontSize: '17px', color: gold, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>View full risk map →</button>
          </div>
          <div style={{ fontSize: '17px', color: 'var(--text-muted)', marginBottom: '10px' }}>Impact vs Likelihood</div>
          <div style={{ display: 'flex', gap: '4px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' as const, justifyContent: 'space-between', paddingBottom: '18px' }}>
              {['Very High','High','Medium','Low','Very Low'].map(l => (
                <div key={l} style={{ fontSize: '7.5px', color: 'var(--text-secondary)', textAlign: 'right' as const, width: '38px', lineHeight: '26px' }}>{l}</div>
              ))}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '3px', marginBottom: '3px' }}>
                {[5,4,3,2,1].map(row => [1,2,3,4,5].map(col => {
                  const key = row + ',' + col
                  const ids = heatRisks[key] || []
                  return (
                    <div key={col} style={{ height: '26px', backgroundColor: heatColors[key] || '#0a0a0a', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.03)', gap: '1px' }}>
                      {ids.map(id => (
                        <div key={id} onClick={() => setSelectedRisk(risks[id-1])} style={{ width: '15px', height: '15px', borderRadius: '50%', backgroundColor: risks[id-1]?.sevColor || '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', color: 'var(--text-primary)', fontWeight: '700', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.2)' }}>{id}</div>
                      ))}
                    </div>
                  )
                }))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '3px', marginBottom: '2px' }}>
                {['Very Low','Low','Medium','High','Very High'].map(l => (
                  <div key={l} style={{ fontSize: '7px', color: 'var(--text-secondary)', textAlign: 'center' as const }}>{l}</div>
                ))}
              </div>
              <div style={{ fontSize: '17px', color: 'var(--text-faint)', textAlign: 'center' as const, letterSpacing: '0.1em' }}>LIKELIHOOD</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' as const }}>
            {[['#cc4444','Critical ('+criticalCount+')'],['#e8923a','High ('+highCount+')'],['#C8A24A','Medium ('+mediumCount+')'],['#4aaa4a','Low ('+lowCount+')']].map(([c,l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: c }} />
                <span style={{ fontSize: '17px', color: 'var(--text-muted)' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '17px', color: '#dddddd', letterSpacing: '0.15em', fontWeight: '600' }}>TOP RISK EXPOSURES</div>
            <button onClick={() => setShowRiskRegisterModal(true)} style={{ fontSize: '17px', color: gold, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>View all →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '5px' }}>
            {risks.slice(0,5).map((r, i) => (
              <div key={i} onClick={() => setSelectedRisk(r)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', backgroundColor: 'var(--bg-sidebar)', borderRadius: '7px', border: '1px solid ' + border, cursor: 'pointer' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '6px', backgroundColor: r.sevColor + '18', border: '1px solid ' + r.sevColor + '44', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '17px', color: r.sevColor, fontWeight: '700' }}>{r.id}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '17px', color: 'var(--text-secondary)', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{r.name}</div>
                  <div style={{ fontSize: '17px', color: 'var(--text-muted)' }}>{r.desc}</div>
                </div>
                {sevBadge(r.severity, r.sevColor)}
                <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
                  <div style={{ fontSize: '17px', color: 'var(--text-secondary)', fontWeight: '700' }}>{fmt(r.value)}</div>
                  <div style={{ fontSize: '17px', color: 'var(--text-muted)' }}>Potential impact</div>
                </div>
                <div style={{ fontSize: '17px', color: 'var(--text-secondary)' }}>›</div>
              </div>
            ))}
          </div>
          <button onClick={() => setShowRiskRegisterModal(true)} style={{ width: '100%', marginTop: '10px', padding: '8px', backgroundColor: 'transparent', border: '1px solid rgba(200,162,74,0.2)', borderRadius: '6px', color: gold, fontSize: '17px', fontWeight: '600', cursor: 'pointer' }}>View full risk register →</button>
        </div>

        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ fontSize: '17px', color: '#dddddd', letterSpacing: '0.15em', fontWeight: '600' }}>RISK SCORE BREAKDOWN</div>
            <button onClick={() => setShowBreakdownModal(true)} style={{ fontSize: '17px', color: gold, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>View breakdown →</button>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
            <svg width="120" height="120" viewBox="0 0 80 80" style={{ flexShrink: 0 }}>
              {(() => {
                let offset = 0
                const r = 27, c = r * 2 * Math.PI
                return riskCategories.map((cat, i) => {
                  const dash = (1/6) * c
                  const el = <circle key={i} cx="40" cy="40" r={r} fill="none" stroke={cat.color} strokeWidth="11" strokeDasharray={String(dash-2)+' '+String(c-dash+2)} strokeDashoffset={String(-offset)} strokeOpacity="0.85" transform="rotate(-90 40 40)"/>
                  offset += dash
                  return el
                })
              })()}
              <text x="40" y="36" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="900">{overallRiskScore}</text>
              <text x="40" y="46" textAnchor="middle" fill="#555" fontSize="6.5">/100</text>
              <text x="40" y="55" textAnchor="middle" fill="#555" fontSize="5.5">Risk Score</text>
            </svg>
            <div style={{ flex: 1 }}>
              {riskCategories.map((cat, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '2px', backgroundColor: cat.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, fontSize: '17px', color: 'var(--text-muted)' }}>{cat.label}</div>
                  <div style={{ fontSize: '17px', color: cat.color, fontWeight: '700' }}>{cat.score}/100</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '6px', paddingTop: '10px', borderTop: '1px solid ' + border }}>
            {[{ label: 'High Risk', value: '62%', color: '#cc4444' },{ label: 'Medium Risk', value: '28%', color: gold },{ label: 'Low Risk', value: '10%', color: '#4aaa4a' }].map((s,i) => (
              <div key={i} style={{ textAlign: 'center' as const }}>
                <div style={{ fontSize: '22px', fontWeight: '800', color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '17px', color: 'var(--text-muted)', marginTop: '2px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>

        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ fontSize: '17px', color: '#dddddd', letterSpacing: '0.15em', fontWeight: '600' }}>RISK TRENDS OVER TIME</div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button onClick={() => setShowTrendModal(true)} style={{ fontSize: '17px', color: gold, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>View trend analysis →</button>
            </div>
          </div>
          <svg width="100%" height="160" viewBox="0 0 300 160">
            {[0,1,2,3].map(i => <line key={i} x1="28" y1={i*38+8} x2="295" y2={i*38+8} stroke="#111" strokeWidth="0.8"/>)}
            {[100,75,50,25].map((l,i) => <text key={l} x="0" y={i*38+12} fill="#333" fontSize="8">{l}</text>)}
            {riskCategories.map((cat, ci) => {
              const base = 8 + (1 - cat.score/100) * 134
              const pts = [28,72,116,160,204,248,295].map((x,j) => x+','+(base+(j%3-1)*4*(ci%2===0?1:-1))).join(' ')
              return <polyline key={ci} points={pts} fill="none" stroke={cat.color} strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.85"/>
            })}
            {['23M','6A','20A','4M','18M','1J','15J'].map((l,i) => (
              <text key={l} x={28+i*44.5} y="158" fill="#333" fontSize="6.5">{l}</text>
            ))}
          </svg>
          <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' as const }}>
            {riskCategories.map((cat,i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <div style={{ width: '8px', height: '3px', backgroundColor: cat.color, borderRadius: '1px' }} />
                <span style={{ fontSize: '17px', color: 'var(--text-muted)' }}>{cat.label.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ fontSize: '17px', color: '#dddddd', letterSpacing: '0.15em', fontWeight: '600' }}>RISK CATEGORY INSIGHTS</div>
            <button onClick={() => setShowInsightsModal(true)} style={{ fontSize: '17px', color: gold, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>View insights →</button>
          </div>
          {riskCategories.map((cat, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 0', borderBottom: i < riskCategories.length-1 ? '1px solid #111' : 'none' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '6px', backgroundColor: cat.color+'18', border: '1px solid '+cat.color+'33', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '17px', color: cat.color, fontWeight: '700' }}>{['S','O','F','C','P','T'][i]}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '17px', color: 'var(--text-secondary)', fontWeight: '600' }}>{cat.label}</div>
                <div style={{ fontSize: '17px', color: 'var(--text-muted)' }}>{cat.desc}</div>
              </div>
              <div style={{ fontSize: '17px', fontWeight: '800', color: cat.color, flexShrink: 0 }}>{cat.score}/100</div>
              <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
                <div style={{ fontSize: '17px', color: cat.trend > 0 ? '#cc4444' : '#4aaa4a', fontWeight: '600' }}>{cat.trend > 0 ? '↑ ' : '↓ '}{Math.abs(cat.trend)}</div>
                <div style={{ fontSize: '17px', color: cat.dir === 'Increasing' ? '#cc4444' : '#4aaa4a' }}>{cat.dir}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ fontSize: '17px', color: '#dddddd', letterSpacing: '0.15em', fontWeight: '600' }}>RISK MITIGATION ACTIONS</div>
            <button onClick={() => setShowMitigationModal(true)} style={{ fontSize: '17px', color: gold, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>View all actions →</button>
          </div>
          {mitigations.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', padding: '8px 0', borderBottom: i < mitigations.length-1 ? '1px solid #111' : 'none', alignItems: 'center' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: m.sevColor+'18', border: '1px solid '+m.sevColor+'44', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '17px', fontWeight: '700', color: m.sevColor }}>{m.n}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '17px', color: 'var(--text-secondary)', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{m.title}</div>
                <div style={{ fontSize: '17px', color: 'var(--text-muted)', marginBottom: '4px' }}>{m.desc}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  {progressBar(m.progress, m.sevColor)}
                  <span style={{ fontSize: '17px', color: 'var(--text-muted)', flexShrink: 0 }}>{m.progress}%</span>
                </div>
              </div>
              {sevBadge(m.severity, m.sevColor)}
              <div style={{ fontSize: '17px', color: m.status === 'In Progress' ? '#4aaa4a' : '#555', fontWeight: '600', flexShrink: 0 }}>{m.status}</div>
            </div>
          ))}
          <button onClick={() => setShowMitigationModal(true)} style={{ width: '100%', marginTop: '10px', padding: '7px', backgroundColor: 'transparent', border: '1px solid rgba(200,162,74,0.2)', borderRadius: '6px', color: gold, fontSize: '17px', fontWeight: '600', cursor: 'pointer' }}>View all mitigation plans →</button>
        </div>
      </div>

      <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '16px' }}>
        <div style={{ fontSize: '17px', color: '#dddddd', letterSpacing: '0.15em', fontWeight: '600', marginBottom: '12px' }}>RISK INTELLIGENCE SUMMARY</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '10px', alignItems: 'stretch' }}>
          {[
            { badge: 'PRIMARY RISK DRIVER', badgeColor: '#cc4444', icon: '⊘', name: risks[0].name, meta: 'Impact: ' + fmt(risks[0].value) },
            { badge: 'EMERGING RISK', badgeColor: '#e8923a', icon: '⚡', name: risks[3].name, meta: 'Rising in technology sector' },
            { badge: 'BIGGEST IMPROVEMENT OPPORTUNITY', badgeColor: '#4aaa4a', icon: '↗', name: risks[2].name, meta: 'Potential savings: ' + fmt(risks[2].value) },
            { badge: 'MONITORING PRIORITY', badgeColor: gold, icon: '◎', name: risks[1].name, meta: 'High impact concentration' },
          ].map((s, i) => (
            <div key={i} style={{ padding: '12px 14px', backgroundColor: 'var(--bg-sidebar)', borderRadius: '8px', border: '1px solid ' + border }}>
              <div style={{ fontSize: '17px', color: s.badgeColor, letterSpacing: '0.08em', fontWeight: '700', marginBottom: '7px' }}>{s.badge}</div>
              <div style={{ display: 'flex', gap: '7px', alignItems: 'center', marginBottom: '5px' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '6px', backgroundColor: s.badgeColor+'18', border: '1px solid '+s.badgeColor+'33', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', color: s.badgeColor }}>{s.icon}</div>
                <div style={{ fontSize: '17px', color: 'var(--text-primary)', fontWeight: '700', lineHeight: 1.2 }}>{s.name}</div>
              </div>
              <div style={{ fontSize: '17px', color: 'var(--text-muted)' }}>{s.meta}</div>
            </div>
          ))}
          <button onClick={() => setShowReportModal(true)} style={{ padding: '12px 18px', backgroundColor: 'rgba(200,162,74,0.08)', border: '1px solid rgba(200,162,74,0.25)', borderRadius: '8px', color: gold, fontSize: '17px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' as const }}>⊙ Generate Risk Report →</button>
        </div>
      </div>

      {selectedRisk && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.88)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '40px', overflowY: 'auto' as const }} onClick={() => setSelectedRisk(null)}>
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '14px', padding: '32px', width: '680px', maxWidth: '95vw', marginBottom: '40px' }} onClick={(e: any) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '17px', color: gold, letterSpacing: '0.2em', marginBottom: '6px', fontWeight: '600' }}>RISK DETAIL</div>
                <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>{selectedRisk.name}</div>
                <div style={{ fontSize: '17px', color: 'var(--text-muted)' }}>{selectedRisk.desc} · {selectedRisk.category}</div>
              </div>
              <button onClick={() => setSelectedRisk(null)} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '6px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '22px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '14px' }}>
              {[
                { label: 'SEVERITY', value: selectedRisk.severity.toUpperCase(), color: selectedRisk.sevColor },
                { label: 'LIKELIHOOD', value: selectedRisk.likelihood, color: gold },
                { label: 'IMPACT', value: selectedRisk.impact, color: '#cc4444' },
                { label: 'POTENTIAL VALUE', value: fmt(selectedRisk.value), color: gold },
              ].map((m, i) => (
                <div key={i} style={{ padding: '12px', backgroundColor: 'var(--bg-sidebar)', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center' as const }}>
                  <div style={{ fontSize: '17px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '5px', fontWeight: '600' }}>{m.label}</div>
                  <div style={{ fontSize: '17px', fontWeight: '800', color: m.color }}>{m.value}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div style={{ padding: '14px', backgroundColor: 'var(--bg-sidebar)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '17px', color: gold, letterSpacing: '0.12em', marginBottom: '8px', fontWeight: '600' }}>RISK DRIVERS</div>
                {['Owner identified as key risk driver', 'Concentration above industry threshold', 'Verification score confirms exposure'].map((e, i) => (
                  <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                    <span style={{ color: '#cc4444', fontSize: '17px', flexShrink: 0 }}>⚠</span>
                    <span style={{ fontSize: '17px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{e}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: '14px', backgroundColor: 'var(--bg-sidebar)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '17px', color: gold, letterSpacing: '0.12em', marginBottom: '8px', fontWeight: '600' }}>MITIGATION APPROACH</div>
                {['Immediate: implement risk controls', 'Short-term: develop contingency plan', 'Long-term: structural risk reduction'].map((e, i) => (
                  <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                    <span style={{ color: '#4aaa4a', fontSize: '17px', flexShrink: 0 }}>→</span>
                    <span style={{ fontSize: '17px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{e}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: '12px 14px', backgroundColor: 'rgba(204,68,68,0.06)', border: '1px solid rgba(204,68,68,0.2)', borderRadius: '8px' }}>
              <div style={{ fontSize: '17px', color: '#cc4444', letterSpacing: '0.12em', marginBottom: '6px', fontWeight: '600' }}>RECOMMENDED ACTION</div>
              <div style={{ fontSize: '17px', color: 'var(--text-primary)', fontWeight: '600' }}>Deploy mitigation framework — estimated risk reduction: 40–60%</div>
            </div>
          </div>
        </div>
      )}

      {showHeatMapModal && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.88)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '40px', overflowY: 'auto' as const }} onClick={() => setShowHeatMapModal(false)}>
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '14px', padding: '32px', width: '780px', maxWidth: '95vw', marginBottom: '40px' }} onClick={(e: any) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div><div style={{ fontSize: '17px', color: gold, letterSpacing: '0.2em', marginBottom: '6px', fontWeight: '600' }}>RISK HEAT MAP</div><div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>Full Risk Heat Map Analysis</div></div>
              <button onClick={() => setShowHeatMapModal(false)} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '6px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '22px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '16px' }}>
              {[{l:'CRITICAL ZONE',v:criticalCount+' risks',c:'#cc4444'},{l:'HIGH ZONE',v:highCount+' risks',c:'#e8923a'},{l:'MEDIUM ZONE',v:mediumCount+' risks',c:gold},{l:'LOW ZONE',v:lowCount+' risks',c:'#4aaa4a'}].map((m,i) => (
                <div key={i} style={{ padding: '12px', backgroundColor: 'var(--bg-sidebar)', borderRadius: '8px', border: '1px solid '+m.c+'33', textAlign: 'center' as const }}>
                  <div style={{ fontSize: '17px', color: m.c, letterSpacing: '0.1em', marginBottom: '4px', fontWeight: '600' }}>{m.l}</div>
                  <div style={{ fontSize: '22px', fontWeight: '800', color: m.c }}>{m.v}</div>
                </div>
              ))}
            </div>
            {risks.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', padding: '10px', backgroundColor: 'var(--bg-sidebar)', borderRadius: '7px', border: '1px solid var(--border)', marginBottom: '6px', alignItems: 'center' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: r.sevColor+'18', border: '1px solid '+r.sevColor+'44', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', fontWeight: '700', color: r.sevColor, flexShrink: 0 }}>{r.id}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '17px', color: 'var(--text-primary)', fontWeight: '700' }}>{r.name}</div>
                  <div style={{ fontSize: '17px', color: 'var(--text-muted)' }}>{r.desc} · {r.category}</div>
                </div>
                <div style={{ fontSize: '17px', color: 'var(--text-muted)' }}>Likelihood: <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>{r.likelihood}</span></div>
                <div style={{ fontSize: '17px', color: 'var(--text-muted)' }}>Impact: <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>{r.impact}</span></div>
                {sevBadge(r.severity, r.sevColor)}
                <div style={{ fontSize: '17px', fontWeight: '700', color: r.sevColor }}>{fmt(r.value)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showRiskRegisterModal && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.88)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '40px', overflowY: 'auto' as const }} onClick={() => setShowRiskRegisterModal(false)}>
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '14px', padding: '32px', width: '820px', maxWidth: '95vw', marginBottom: '40px' }} onClick={(e: any) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div><div style={{ fontSize: '17px', color: gold, letterSpacing: '0.2em', marginBottom: '6px', fontWeight: '600' }}>RISK REGISTER</div><div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>Full Risk Register</div><div style={{ fontSize: '17px', color: 'var(--text-muted)' }}>{businessName} · {risks.length} risks · Total exposure: {fmt(totalRiskValue)}</div></div>
              <button onClick={() => setShowRiskRegisterModal(false)} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '6px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '22px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 0.8fr 0.8fr 0.8fr 1fr', gap: '0', padding: '8px 0', borderBottom: '1px solid #1a1a1a', marginBottom: '4px' }}>
              {['RISK','CATEGORY','SEVERITY','LIKELIHOOD','IMPACT','VALUE'].map(h => <div key={h} style={{ fontSize: '17px', color: 'var(--text-secondary)', letterSpacing: '0.08em', fontWeight: '600' }}>{h}</div>)}
            </div>
            {risks.map((r, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 0.8fr 0.8fr 0.8fr 1fr', gap: '0', padding: '10px 0', borderBottom: i < risks.length-1 ? '1px solid #111' : 'none', alignItems: 'center' }}>
                <div><div style={{ fontSize: '17px', color: 'var(--text-secondary)', fontWeight: '600' }}>{r.name}</div><div style={{ fontSize: '17px', color: 'var(--text-muted)' }}>{r.desc}</div></div>
                <div style={{ fontSize: '17px', color: 'var(--text-muted)' }}>{r.category}</div>
                {sevBadge(r.severity, r.sevColor)}
                <div style={{ fontSize: '17px', color: 'var(--text-muted)' }}>{r.likelihood}</div>
                <div style={{ fontSize: '17px', color: 'var(--text-muted)' }}>{r.impact}</div>
                <div style={{ fontSize: '17px', fontWeight: '700', color: r.sevColor }}>{fmt(r.value)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showBreakdownModal && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.88)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '40px', overflowY: 'auto' as const }} onClick={() => setShowBreakdownModal(false)}>
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '14px', padding: '32px', width: '660px', maxWidth: '95vw', marginBottom: '40px' }} onClick={(e: any) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div><div style={{ fontSize: '17px', color: gold, letterSpacing: '0.2em', marginBottom: '6px', fontWeight: '600' }}>RISK SCORE BREAKDOWN</div><div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>Risk Category Analysis</div></div>
              <button onClick={() => setShowBreakdownModal(false)} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '6px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '22px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            {riskCategories.map((cat, i) => (
              <div key={i} style={{ padding: '14px', backgroundColor: 'var(--bg-sidebar)', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: cat.color }} />
                    <span style={{ fontSize: '17px', color: 'var(--text-secondary)', fontWeight: '700' }}>{cat.label}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ fontSize: '17px', color: cat.dir === 'Increasing' ? '#cc4444' : '#4aaa4a', fontWeight: '600' }}>{cat.trend > 0 ? '↑ ' : '↓ '}{Math.abs(cat.trend)} {cat.dir}</span>
                    <span style={{ fontSize: '22px', fontWeight: '900', color: cat.color }}>{cat.score}/100</span>
                  </div>
                </div>
                <div style={{ height: '6px', backgroundColor: '#1a1a1a', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: cat.score+'%', height: '100%', backgroundColor: cat.color, borderRadius: '3px' }} />
                </div>
                <div style={{ fontSize: '17px', color: 'var(--text-muted)', marginTop: '6px' }}>{cat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showTrendModal && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.88)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '40px', overflowY: 'auto' as const }} onClick={() => setShowTrendModal(false)}>
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '14px', padding: '32px', width: '720px', maxWidth: '95vw', marginBottom: '40px' }} onClick={(e: any) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div><div style={{ fontSize: '17px', color: gold, letterSpacing: '0.2em', marginBottom: '6px', fontWeight: '600' }}>TREND ANALYSIS</div><div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>Risk Score Trends — Last 90 Days</div></div>
              <button onClick={() => setShowTrendModal(false)} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '6px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '22px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '16px' }}>
              {riskCategories.slice(0,3).map((cat,i) => (
                <div key={i} style={{ padding: '12px', backgroundColor: 'var(--bg-sidebar)', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center' as const }}>
                  <div style={{ fontSize: '17px', color: 'var(--text-muted)', marginBottom: '4px' }}>{cat.label}</div>
                  <div style={{ fontSize: '22px', fontWeight: '800', color: cat.color }}>{cat.score}</div>
                  <div style={{ fontSize: '17px', color: cat.dir === 'Increasing' ? '#cc4444' : '#4aaa4a', fontWeight: '600' }}>{cat.dir}</div>
                </div>
              ))}
            </div>
            <svg width="100%" height="220" viewBox="0 0 640 220">
              {[0,1,2,3,4].map(i => <line key={i} x1="40" y1={i*32+8} x2="630" y2={i*32+8} stroke="#1a1a1a" strokeWidth="0.8"/>)}
              {[100,75,50,25,0].map((l,i) => <text key={l} x="0" y={i*32+12} fill="#333" fontSize="8">{l}</text>)}
              {riskCategories.map((cat, ci) => {
                const base = 8 + (1 - cat.score/100) * 128
                const pts = [40,135,230,325,420,515,630].map((x,j) => x+','+(base+(j%2===0?-3:3)*(ci%2===0?1:-1))).join(' ')
                return <polyline key={ci} points={pts} fill="none" stroke={cat.color} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.9"/>
              })}
              {['23 Mar','6 Apr','20 Apr','4 May','18 May','1 Jun','15 Jun'].map((l,i) => (
                <text key={l} x={40+i*98.3} y="156" fill="#333" fontSize="8">{l}</text>
              ))}
            </svg>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap' as const }}>
              {riskCategories.map((cat,i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '10px', height: '3px', backgroundColor: cat.color, borderRadius: '2px' }} />
                  <span style={{ fontSize: '17px', color: 'var(--text-muted)' }}>{cat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showInsightsModal && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.88)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '40px', overflowY: 'auto' as const }} onClick={() => setShowInsightsModal(false)}>
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '14px', padding: '32px', width: '700px', maxWidth: '95vw', marginBottom: '40px' }} onClick={(e: any) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div><div style={{ fontSize: '17px', color: gold, letterSpacing: '0.2em', marginBottom: '6px', fontWeight: '600' }}>RISK CATEGORY INSIGHTS</div><div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>Full Category Intelligence</div></div>
              <button onClick={() => setShowInsightsModal(false)} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '6px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '22px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            {riskCategories.map((cat, i) => (
              <div key={i} style={{ padding: '16px', backgroundColor: 'var(--bg-sidebar)', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '6px', backgroundColor: cat.color+'18', border: '1px solid '+cat.color+'33', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', color: cat.color, fontWeight: '700' }}>{['S','O','F','C','P','T'][i]}</div>
                    <div><div style={{ fontSize: '17px', color: 'var(--text-secondary)', fontWeight: '700' }}>{cat.label}</div><div style={{ fontSize: '17px', color: 'var(--text-muted)' }}>{cat.desc}</div></div>
                  </div>
                  <div style={{ textAlign: 'right' as const }}>
                    <div style={{ fontSize: '22px', fontWeight: '900', color: cat.color }}>{cat.score}/100</div>
                    <div style={{ fontSize: '17px', color: cat.dir === 'Increasing' ? '#cc4444' : '#4aaa4a', fontWeight: '600' }}>{cat.trend > 0 ? '↑' : '↓'} {Math.abs(cat.trend)} — {cat.dir}</div>
                  </div>
                </div>
                <div style={{ height: '4px', backgroundColor: '#1a1a1a', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: cat.score+'%', height: '100%', backgroundColor: cat.color, borderRadius: '2px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showMitigationModal && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.88)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '40px', overflowY: 'auto' as const }} onClick={() => setShowMitigationModal(false)}>
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '14px', padding: '32px', width: '760px', maxWidth: '95vw', marginBottom: '40px' }} onClick={(e: any) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div><div style={{ fontSize: '17px', color: gold, letterSpacing: '0.2em', marginBottom: '6px', fontWeight: '600' }}>MITIGATION PLANS</div><div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>All Mitigation Actions</div></div>
              <button onClick={() => setShowMitigationModal(false)} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '6px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '22px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            {[...mitigations,
              { n: 6, title: 'Cash Flow Management', desc: 'Improve cash flow predictability', severity: 'medium', sevColor: gold, status: 'Planned', progress: 0 },
              { n: 7, title: 'Technology Modernisation', desc: 'Upgrade legacy systems', severity: 'low', sevColor: '#4a8ab0', status: 'Planned', progress: 0 },
              { n: 8, title: 'Market Diversification', desc: 'Enter new market segments', severity: 'low', sevColor: '#4a8ab0', status: 'Planned', progress: 0 },
            ].map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', padding: '14px', backgroundColor: 'var(--bg-sidebar)', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '7px', alignItems: 'center' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: m.sevColor+'18', border: '1px solid '+m.sevColor+'44', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '17px', fontWeight: '700', color: m.sevColor }}>{m.n}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '17px', color: 'var(--text-primary)', fontWeight: '700', marginBottom: '2px' }}>{m.title}</div>
                  <div style={{ fontSize: '17px', color: 'var(--text-muted)', marginBottom: '6px' }}>{m.desc}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {progressBar(m.progress, m.sevColor)}
                    <span style={{ fontSize: '17px', color: 'var(--text-muted)', flexShrink: 0 }}>{m.progress}%</span>
                  </div>
                </div>
                {sevBadge(m.severity, m.sevColor)}
                <div style={{ fontSize: '17px', color: m.status === 'In Progress' ? '#4aaa4a' : '#555', fontWeight: '600', flexShrink: 0 }}>{m.status}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showReportModal && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.88)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '40px', overflowY: 'auto' as const }} onClick={() => setShowReportModal(false)}>
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '14px', padding: '32px', width: '720px', maxWidth: '95vw', marginBottom: '40px' }} onClick={(e: any) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div><div style={{ fontSize: '17px', color: gold, letterSpacing: '0.2em', marginBottom: '6px', fontWeight: '600' }}>RISK INTELLIGENCE REPORT</div><div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>Full Risk Intelligence Report</div><div style={{ fontSize: '17px', color: 'var(--text-muted)' }}>{businessName} · Score: {overallRiskScore}/100 · {risks.length} risks</div></div>
              <button onClick={() => setShowReportModal(false)} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '6px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '22px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '14px' }}>
              {[{l:'OVERALL SCORE',v:overallRiskScore+'/100',c:'#cc4444'},{l:'CRITICAL RISKS',v:String(criticalCount),c:'#cc4444'},{l:'TOTAL EXPOSURE',v:fmt(totalRiskValue),c:gold},{l:'RISK TREND',v:'Increasing',c:'#cc4444'}].map((m,i) => (
                <div key={i} style={{ padding: '12px', backgroundColor: 'var(--bg-sidebar)', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center' as const }}>
                  <div style={{ fontSize: '17px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '4px', fontWeight: '600' }}>{m.l}</div>
                  <div style={{ fontSize: '17px', fontWeight: '800', color: m.c }}>{m.v}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: '14px', backgroundColor: 'var(--bg-sidebar)', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '12px' }}>
              <div style={{ fontSize: '17px', color: gold, letterSpacing: '0.12em', marginBottom: '8px', fontWeight: '600' }}>EXECUTIVE RISK SUMMARY</div>
              <div style={{ fontSize: '17px', color: 'var(--text-secondary)', lineHeight: '1.75' }}>
                {businessName} presents a risk profile of {overallRiskScore}/100 — classified as High Risk. The primary driver is {risks[0].name}, with {criticalCount} critical and {highCount} high-severity risks. Total potential exposure: {fmt(totalRiskValue)}. Immediate mitigation recommended for {risks[0].name} and {risks[1].name}.
              </div>
            </div>
            {risks.slice(0,5).map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 4 ? '1px solid #111' : 'none' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {sevBadge(r.severity, r.sevColor)}
                  <span style={{ fontSize: '17px', color: 'var(--text-secondary)', fontWeight: '600' }}>{r.name}</span>
                </div>
                <div style={{ fontSize: '17px', color: r.sevColor, fontWeight: '700' }}>{fmt(r.value)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

    </DashboardShell>
  )
}
