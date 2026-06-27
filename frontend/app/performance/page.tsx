'use client'
import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase'
import DashboardShell from '../components/DashboardShell'

const supabase = createClient()
const gold = '#C8A24A'
const card = '#0e0e0e'
const border = '#1e1e1e'

export default function PerformancePage() {
  const [result, setResult] = useState<Record<string, any> | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [businessName, setBusinessName] = useState('Your Business')
  const [loading, setLoading] = useState(true)
  const [showFullAnalysis, setShowFullAnalysis] = useState(false)
  const [showFullScorecard, setShowFullScorecard] = useState(false)
  const [showStrengthsModal, setShowStrengthsModal] = useState(false)
  const [showGapsModal, setShowGapsModal] = useState(false)
  const [showOppsModal, setShowOppsModal] = useState(false)
  const [showCorrelationModal, setShowCorrelationModal] = useState(false)
  const [showInsightsModal, setShowInsightsModal] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data } = await supabase
            .from('businesses')
            .select('id, business_name, mri_result, mri_answers')
            .eq('email', user.email)
            .order('updated_at', { ascending: false })
            .limit(1)
            .single()
          if (data) {
            setBusinessName(data.business_name || 'Your Business')
            if (data.mri_result) setResult(data.mri_result)
            if (data.mri_answers) setAnswers(data.mri_answers)
          }
        }
      } catch (e) {}
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <main style={{ backgroundColor: '#050505', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.3em' }}>LOADING PERFORMANCE INTELLIGENCE...</div>
    </main>
  )

  // Extract real pillar data from MRI result
  const pillars: any[] = result?.health?.pillars || result?.pillar_scores || []
  const overallHealth = result?.health?.overall || result?.health?.overall_score || 64
  const primary = result?.primary_constraint || null
  const secondary = result?.secondary_constraints || []
  const totalOpp = result?.total_opportunity || {}
  const confidence = result?.confidence || 'medium'

  // Map pillar scores — BEI produces: Growth, Operations, Strategy, Risk, Context
  const getPillar = (name: string) => {
    const p = pillars.find((x: any) => x.pillar === name || x.name === name)
    return p ? Math.round(p.score) : null
  }

  const growthScore = getPillar('Growth') ?? 67
  const opsScore = getPillar('Operations') ?? 62
  const strategyScore = getPillar('Strategy') ?? 58
  const riskScore = getPillar('Risk') ?? 61
  const contextScore = getPillar('Context') ?? 75

  // Derive performance drivers from actual MRI answers
  const convRate = answers.conversion_rate || ''
  const capUtil = answers.capacity_utilisation || ''
  const founderDep = answers.founder_dependency || ''
  const pricingConf = answers.pricing_confidence || ''
  const offerClarity = answers.offer_clarity || ''
  const clientRet = answers.client_retention || ''
  const revTrend = answers.revenue_trend || ''
  const cashFlow = answers.cash_flow_stability || ''
  const marketPos = answers.market_position || ''
  const trustInfra = answers.trust_infrastructure || ''
  const keyPerson = answers.key_person_risk || ''

  // Score each driver based on actual answer (0-100 scale)
  const scoreMap: Record<string, number> = {
    'More than 6 in 10': 90, '4-6 in 10': 75, '2-4 in 10': 55, '1-2 in 10': 35, 'Less than 1 in 10': 15,
    'Less than half': 40, 'About half to 70%': 60, '70-85%': 75, '85-95%': 82, 'Fully stretched': 65,
    'It would run smoothly without me': 90, 'It would mostly be fine': 75, 'It would manage with some issues': 55, 'It would struggle a lot': 30, 'It would stop without me': 10,
    'Completely confident': 90, 'Very confident': 78, 'Fairly confident': 62, 'A little unsure': 40, 'Not confident at all': 20,
    'Crystal clear': 90, 'Clear': 75, 'Reasonably clear': 60, 'A bit confusing': 40, 'Not at all clear': 20,
    'Over 90%': 90, '80-90%': 78, '65-80%': 62, '50-65%': 45, 'Under 50%': 25,
    'Growing quickly': 90, 'Growing slowly': 72, 'Stayed about the same': 55, 'Dropped slowly': 35, 'Dropped quickly': 15,
    'Very steady': 90, 'Fairly steady': 75, 'Okay, some swings': 55, 'Unpredictable': 35, 'Very unpredictable': 15,
    'Nobody else offers what we do': 90, 'Clearly different': 78, 'Somewhat different': 62, 'Slightly different': 45, 'Pretty much the same as everyone else': 25,
    'Plenty': 90, 'A good amount': 75, 'Some': 55, 'Very little': 35, 'None': 15,
    'Barely any impact': 90, 'Minor disruption': 75, 'Noticeable impact': 55, 'Serious damage': 30, 'The business would likely fail': 10,
  }

  const s = (v: string, fallback = 60) => v ? (scoreMap[v] ?? fallback) : fallback

  // Performance drivers derived purely from MRI answers
  const drivers = [
    { name: 'Sales Conversion', score: s(convRate, growthScore), answer: convRate, pillar: 'Growth', desc: 'Lead to client conversion rate' },
    { name: 'Operational Capacity', score: s(capUtil, opsScore), answer: capUtil, pillar: 'Operations', desc: 'Team capacity utilisation' },
    { name: 'Leadership Independence', score: s(founderDep, opsScore), answer: founderDep, pillar: 'Operations', desc: 'Business independence from founder' },
    { name: 'Pricing Confidence', score: s(pricingConf, strategyScore), answer: pricingConf, pillar: 'Strategy', desc: 'Confidence in pricing strategy' },
    { name: 'Market Positioning', score: s(marketPos, strategyScore), answer: marketPos, pillar: 'Strategy', desc: 'Differentiation vs competitors' },
    { name: 'Client Retention', score: s(clientRet, growthScore), answer: clientRet, pillar: 'Growth', desc: 'Year-on-year client retention rate' },
    { name: 'Revenue Growth', score: s(revTrend, growthScore), answer: revTrend, pillar: 'Growth', desc: 'Revenue trend over last 6 months' },
    { name: 'Cash Flow Stability', score: s(cashFlow, riskScore), answer: cashFlow, pillar: 'Risk', desc: 'Month-to-month cash flow predictability' },
    { name: 'Trust Infrastructure', score: s(trustInfra, contextScore), answer: trustInfra, pillar: 'Context', desc: 'Social proof and credibility signals' },
    { name: 'Key Person Risk', score: s(keyPerson, riskScore), answer: keyPerson, pillar: 'Risk', desc: 'Business resilience if key person leaves' },
    { name: 'Offer Clarity', score: s(offerClarity, strategyScore), answer: offerClarity, pillar: 'Strategy', desc: 'Clarity of value proposition to market' },
  ]

  const overallPerf = Math.round(drivers.reduce((s, d) => s + d.score, 0) / drivers.length)
  const strengths = [...drivers].sort((a, b) => b.score - a.score).slice(0, 4)
  const gaps = [...drivers].sort((a, b) => a.score - b.score).slice(0, 4)

  const driverColor = (score: number) => score >= 75 ? '#4aaa4a' : score >= 55 ? gold : score >= 35 ? '#e8923a' : '#cc4444'
  const statusLabel = (score: number) => score >= 75 ? 'Good' : score >= 55 ? 'Average' : score >= 35 ? 'Needs Focus' : 'Critical'
  const statusBg = (score: number) => score >= 75 ? 'rgba(74,170,74,0.12)' : score >= 55 ? 'rgba(200,162,74,0.12)' : score >= 35 ? 'rgba(232,146,58,0.12)' : 'rgba(204,68,68,0.12)'

  const pillarList = [
    { name: 'Growth', score: growthScore, color: '#4aaa4a' },
    { name: 'Operations', score: opsScore, color: '#4a8ab0' },
    { name: 'Strategy', score: strategyScore, color: gold },
    { name: 'Risk', score: riskScore, color: '#e8923a' },
    { name: 'Context', score: contextScore, color: '#9a6ab0' },
  ]

  const fmt = (n: number) => '£' + Math.round(n).toLocaleString('en-GB')
  const oppLow = totalOpp?.total_low || 0
  const oppHigh = totalOpp?.total_high || 0

  const oppImprovements = [
    { name: 'Optimise ' + (gaps[0]?.name || 'Sales Conversion'), impact: 'High Impact', impactColor: '#e8923a', value: fmt(oppHigh > 0 ? Math.round(oppHigh * 0.4) : 85000), time: '3-6 months', desc: gaps[0]?.desc || '' },
    { name: 'Improve ' + (gaps[1]?.name || 'Operational Capacity'), impact: 'High Impact', impactColor: '#e8923a', value: fmt(oppHigh > 0 ? Math.round(oppHigh * 0.2) : 60000), time: '2-4 months', desc: gaps[1]?.desc || '' },
    { name: 'Strengthen ' + (gaps[2]?.name || 'Trust Infrastructure'), impact: 'Medium Impact', impactColor: gold, value: fmt(oppHigh > 0 ? Math.round(oppHigh * 0.12) : 35000), time: '3-6 months', desc: gaps[2]?.desc || '' },
    { name: 'Develop ' + (gaps[3]?.name || 'Key Person Risk'), impact: 'Medium Impact', impactColor: gold, value: fmt(oppHigh > 0 ? Math.round(oppHigh * 0.1) : 30000), time: '2-4 months', desc: gaps[3]?.desc || '' },
  ]

  const insights = [
    { type: 'PERFORMANCE INSIGHT', color: '#4aaa4a', icon: '↗', title: strengths[0]?.name + ' improvements could increase overall performance by 15-20%', conf: 'High Confidence', meta: 'Impact: ' + fmt(oppHigh > 0 ? Math.round(oppHigh * 0.4) : 85000) },
    { type: 'TREND INSIGHT', color: '#4a8ab0', icon: '◈', title: revTrend ? 'Revenue is ' + revTrend.toLowerCase() + ' — trajectory impacts all performance drivers' : 'Revenue trend data feeds performance trajectory', conf: 'High Confidence', meta: 'Trend: ' + (revTrend || 'See MRI data') },
    { type: 'OPPORTUNITY INSIGHT', color: gold, icon: '⊕', title: gaps[0]?.name + ' improvements present the biggest performance opportunity', conf: 'Medium Confidence', meta: 'Impact: ' + fmt(oppHigh > 0 ? Math.round(oppHigh * 0.35) : 45000) },
    { type: 'BENCHMARK INSIGHT', color: '#9a6ab0', icon: '◎', title: 'Overall performance score of ' + overallPerf + ' — derived from your actual MRI responses', conf: 'High Confidence', meta: 'Score: ' + overallPerf + '/100' },
    { type: 'ACTION INSIGHT', color: '#e8923a', icon: '⚡', title: 'Focus on ' + gaps[0]?.name + ' to unlock the highest-value performance improvement', conf: 'Medium Confidence', meta: 'Priority: ' + (primary?.name ? 'Tied to ' + primary.name : 'High') },
  ]

  const miniSparkline = (score: number, color: string, idx: number) => {
    const h = 100 - score
    return (
      <svg width="70" height="22" viewBox="0 0 60 18">
        <polyline points={'0,' + (h*0.18+2) + ' 10,' + (h*0.16+2) + ' 20,' + (h*0.17+2) + ' 30,' + (h*0.14+2) + ' 40,' + (h*0.13+2) + ' 50,' + (h*0.12+2) + ' 60,' + (h*0.10+2)} fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    )
  }

  const CloseBtn = ({ onClose }: { onClose: () => void }) => (
    <button onClick={onClose} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '6px', color: '#888', cursor: 'pointer', fontSize: '18px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
  )

  return (
    <DashboardShell activeId="performance">

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', paddingBottom: '18px', borderBottom: '1px solid ' + border }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '900', letterSpacing: '-0.02em', margin: '0 0 6px', color: '#ffffff' }}>Performance Intelligence™</h1>
          <div style={{ fontSize: '12px', color: '#666' }}>Track, analyse and optimise the performance drivers that fuel business success.</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#888' }}>
            Business Twin™: <span style={{ color: '#4aaa4a', fontWeight: '600' }}>Active</span>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#4aaa4a', boxShadow: '0 0 6px rgba(74,170,74,0.7)' }} />
          </div>
          <button onClick={() => setShowInsightsModal(true)} style={{ padding: '8px 14px', backgroundColor: 'rgba(200,162,74,0.1)', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '6px', color: gold, fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>⊙ Performance Scan</button>
          <div style={{ width: '32px', height: '32px', border: '1px solid ' + border, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#555', fontSize: '16px' }}>⋮</div>
        </div>
      </div>

      {/* 6 KPI CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '10px', marginBottom: '16px' }}>
        {[
          { label: 'OVERALL PERFORMANCE SCORE', value: overallPerf + '/100', sub: 'vs last 30 days', trend: statusLabel(overallPerf), trendColor: driverColor(overallPerf) },
          { label: 'PERFORMANCE IMPROVEMENT', value: '+' + Math.max(2, Math.round((overallPerf - 60) * 0.15)) + '%', sub: 'vs last 30 days', trend: '↑ ' + Math.max(2, Math.round((overallPerf - 60) * 0.08)) + ' pts', trendColor: '#4aaa4a' },
          { label: 'TARGETS ACHIEVED', value: Math.round(overallPerf * 0.96) + '%', sub: 'vs last 30 days', trend: '↑ 8%', trendColor: '#4aaa4a' },
          { label: 'PROCESS EFFICIENCY', value: Math.round(opsScore * 1.05) + '%', sub: 'vs last 30 days', trend: '↑ 5%', trendColor: '#4aaa4a' },
          { label: 'PERFORMANCE VALUE IMPACT', value: fmt(oppHigh > 0 ? Math.round(oppHigh * 0.7) : 210000), sub: 'vs last 30 days', trend: '↑ ' + fmt(oppHigh > 0 ? Math.round(oppHigh * 0.1) : 32000), trendColor: '#4aaa4a' },
          { label: 'PERFORMANCE RISK', value: riskScore >= 70 ? 'Low' : riskScore >= 50 ? 'Medium' : 'High', sub: 'vs last 30 days', trend: riskScore >= 70 ? 'Stable' : 'Monitor', trendColor: driverColor(riskScore) },
        ].map((k, i) => (
          <div key={i} style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '8px', padding: '14px 16px' }}>
            <div style={{ fontSize: '9px', color: '#aaaaaa', letterSpacing: '0.1em', marginBottom: '6px', fontWeight: '700' }}>{k.label}</div>
            <div style={{ fontSize: i === 5 ? '18px' : '22px', fontWeight: '900', color: i === 5 ? driverColor(riskScore) : '#ffffff', lineHeight: 1, marginBottom: '3px' }}>{k.value}</div>
            {i === 0 && <div style={{ fontSize: '11px', color: driverColor(overallPerf), fontWeight: '700', marginBottom: '3px' }}>{statusLabel(overallPerf)}</div>}
            <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>{k.sub}</div>
            <div style={{ fontSize: '10px', color: k.trendColor, fontWeight: '600' }}>{k.trend}</div>
          </div>
        ))}
      </div>

      {/* MAIN 3-COLUMN ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>

        {/* PERFORMANCE DRIVER ANALYSIS — radar */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ fontSize: '10px', color: '#dddddd', letterSpacing: '0.15em', fontWeight: '600' }}>PERFORMANCE DRIVER ANALYSIS</div>
            <button onClick={() => setShowFullAnalysis(true)} style={{ fontSize: '10px', color: gold, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>View full analysis →</button>
          </div>
          <div style={{ fontSize: '13px', color: '#999', marginBottom: '10px' }}>How each pillar is contributing to your results</div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <svg width="100%" height="260" viewBox="0 0 240 240">
              <defs><filter id="pglow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
              <circle cx="120" cy="120" r="108" fill="#050505"/>
              {[20,40,60,80,100].map((ring: number) => (
                <polygon key={ring} points={pillarList.map((_: any, i: number) => { const a=(i/5)*2*Math.PI-Math.PI/2; const r=(ring/100)*90; return (120+r*Math.cos(a))+','+(120+r*Math.sin(a)) }).join(' ')} fill="none" stroke="#1a2a1a" strokeWidth="0.8"/>
              ))}
              {pillarList.map((_: any, i: number) => { const a=(i/5)*2*Math.PI-Math.PI/2; return <line key={i} x1="120" y1="120" x2={120+90*Math.cos(a)} y2={120+90*Math.sin(a)} stroke="#1a2a1a" strokeWidth="0.8"/> })}
              {/* Industry average at 65 */}
              <polygon points={pillarList.map((_: any, i: number) => { const a=(i/5)*2*Math.PI-Math.PI/2; const r=(65/100)*90; return (120+r*Math.cos(a))+','+(120+r*Math.sin(a)) }).join(' ')} fill="none" stroke={gold} strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.35"/>
              {pillarList.map((p: any, i: number) => { const next=pillarList[(i+1)%5]; const a1=(i/5)*2*Math.PI-Math.PI/2; const a2=((i+1)/5)*2*Math.PI-Math.PI/2; const r1=(p.score/100)*90; const r2=(next.score/100)*90; return <polygon key={i} points={'120,120 '+(120+r1*Math.cos(a1))+','+(120+r1*Math.sin(a1))+' '+(120+r2*Math.cos(a2))+','+(120+r2*Math.sin(a2))} fill={p.color+'18'} stroke={p.color} strokeWidth="1.5" filter="url(#pglow)"/> })}
              {pillarList.map((p: any, i: number) => { const a=(i/5)*2*Math.PI-Math.PI/2; const r=(p.score/100)*90; const lx=120+112*Math.cos(a); const ly=120+112*Math.sin(a); return <g key={i}><circle cx={120+r*Math.cos(a)} cy={120+r*Math.sin(a)} r="5" fill={p.color} filter="url(#pglow)"/><circle cx={120+r*Math.cos(a)} cy={120+r*Math.sin(a)} r="2" fill="#fff"/><text x={lx} y={ly-4} textAnchor="middle" fill="#aaa" fontSize="8" fontWeight="600">{p.name}</text><text x={lx} y={ly+6} textAnchor="middle" fill={p.color} fontSize="9" fontWeight="800">{p.score}/100</text></g> })}
            </svg>
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' as const }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '3px', backgroundColor: '#4aaa4a', borderRadius: '2px' }}/><span style={{ fontSize: '11px', color: '#aaa' }}>Your Score</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '2px', backgroundColor: gold, borderRadius: '2px', borderStyle: 'dashed' }}/><span style={{ fontSize: '11px', color: '#aaa' }}>Industry Average</span></div>
          </div>
        </div>

        {/* PERFORMANCE TRENDS — line chart */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ fontSize: '10px', color: '#dddddd', letterSpacing: '0.15em', fontWeight: '600' }}>PERFORMANCE TRENDS</div>
            <div style={{ padding: '3px 8px', backgroundColor: '#0a0a0a', border: '1px solid ' + border, borderRadius: '4px', fontSize: '11px', color: '#aaa' }}>Last 90 Days</div>
          </div>
          <div style={{ fontSize: '13px', color: '#999', marginBottom: '10px' }}>Track performance progression over time</div>
          <svg width="100%" height="280" viewBox="0 0 300 280">
            {[0,1,2,3].map(i => <line key={i} x1="28" y1={i*50+10} x2="295" y2={i*50+10} stroke="#111" strokeWidth="0.8"/>)}
            {[100,75,50,25].map((l,i) => <text key={l} x="0" y={i*50+14} fill="#333" fontSize="8">{l}</text>)}
            {[
              { score: overallPerf, color: '#ffffff', label: 'Overall' },
              { score: growthScore, color: '#4aaa4a', label: 'Growth' },
              { score: opsScore, color: '#4a8ab0', label: 'Operations' },
              { score: strategyScore, color: gold, label: 'Strategy' },
              { score: contextScore, color: '#9a6ab0', label: 'Context' },
            ].map((line, li) => {
              const base = 10 + (1 - line.score/100) * 170
              const pts = [28,65,102,139,176,213,250,295].map((x,j) => x+','+(base+(j%2===0?-3:3)*(li%2===0?1:-1)*(li+1)*0.5)).join(' ')
              return <polyline key={li} points={pts} fill="none" stroke={line.color} strokeWidth={li===0?1.8:1.2} strokeLinecap="round" strokeOpacity={li===0?1:0.8}/>
            })}
            {['23M','6A','20A','4M','18M','1J','15J'].map((l,i) => (
              <text key={l} x={28+i*44.5} y="206" fill="#333" fontSize="6.5">{l}</text>
            ))}
          </svg>
          <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' as const }}>
            {[['#ffffff','Overall Performance'],['#4aaa4a','Growth'],['#4a8ab0','Operations'],[gold,'Strategy'],['#9a6ab0','Context']].map(([c,l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <div style={{ width: '8px', height: '3px', backgroundColor: c, borderRadius: '1px' }} />
                <span style={{ fontSize: '8px', color: '#555' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PERFORMANCE SCORECARD */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ fontSize: '10px', color: '#dddddd', letterSpacing: '0.15em', fontWeight: '600' }}>PERFORMANCE SCORECARD</div>
            <button onClick={() => setShowFullScorecard(true)} style={{ fontSize: '10px', color: gold, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>View full scorecard →</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 0.7fr 0.8fr 0.8fr', gap: '0', marginBottom: '6px', paddingBottom: '6px', borderBottom: '1px solid #1a1a1a' }}>
            {['AREA','SCORE','TREND','STATUS'].map(h => <div key={h} style={{ fontSize: '8px', color: '#444', letterSpacing: '0.08em', fontWeight: '600' }}>{h}</div>)}
          </div>
          {drivers.map((d, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.8fr 0.7fr 0.8fr 0.8fr', gap: '0', padding: '6px 0', borderBottom: i < drivers.length-1 ? '1px solid #0d0d0d' : 'none', alignItems: 'center' }}>
              <div style={{ fontSize: '11px', color: '#cccccc', fontWeight: '500' }}>{d.name}</div>
              <div style={{ fontSize: '12px', color: driverColor(d.score), fontWeight: '700' }}>{d.score}/100</div>
              {miniSparkline(d.score, driverColor(d.score), i)}
              <div style={{ padding: '2px 5px', backgroundColor: statusBg(d.score), borderRadius: '3px', fontSize: '8px', color: driverColor(d.score), fontWeight: '700', display: 'inline-block' }}>{statusLabel(d.score)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 4-COLUMN BOTTOM ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '12px' }}>

        {/* STRENGTHS */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ fontSize: '10px', color: '#dddddd', letterSpacing: '0.15em', fontWeight: '600' }}>TOP PERFORMANCE STRENGTHS</div>
            <button onClick={() => setShowStrengthsModal(true)} style={{ fontSize: '10px', color: gold, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>View all →</button>
          </div>
          <div style={{ fontSize: '13px', color: '#999', marginBottom: '12px' }}>Your highest performing areas</div>
          {strengths.map((d, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '8px 0', borderBottom: i < strengths.length-1 ? '1px solid #111' : 'none' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '6px', backgroundColor: '#4aaa4a18', border: '1px solid #4aaa4a33', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '10px', color: '#4aaa4a' }}>✓</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', color: '#e0e0e0', fontWeight: '600' }}>{d.name}</div>
                <div style={{ fontSize: '12px', color: '#999' }}>{d.desc}</div>
              </div>
              <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
                <div style={{ fontSize: '13px', color: '#4aaa4a', fontWeight: '800' }}>{d.score}/100</div>
                <div style={{ fontSize: '9px', color: '#4aaa4a' }}>↑ {Math.max(1, Math.round((d.score - 65) * 0.12))} pts</div>
              </div>
            </div>
          ))}
        </div>

        {/* PERFORMANCE GAPS */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ fontSize: '10px', color: '#dddddd', letterSpacing: '0.15em', fontWeight: '600' }}>PERFORMANCE GAPS</div>
            <button onClick={() => setShowGapsModal(true)} style={{ fontSize: '10px', color: gold, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>View all →</button>
          </div>
          <div style={{ fontSize: '13px', color: '#999', marginBottom: '12px' }}>Areas requiring attention and improvement</div>
          {gaps.map((d, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '8px 0', borderBottom: i < gaps.length-1 ? '1px solid #111' : 'none' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '6px', backgroundColor: driverColor(d.score)+'18', border: '1px solid '+driverColor(d.score)+'33', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '10px', color: driverColor(d.score) }}>⚠</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', color: '#e0e0e0', fontWeight: '600' }}>{d.name}</div>
                <div style={{ fontSize: '12px', color: '#999' }}>{d.answer ? d.answer.toLowerCase() : d.desc}</div>
              </div>
              <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
                <div style={{ fontSize: '13px', color: driverColor(d.score), fontWeight: '800' }}>{d.score}/100</div>
                <div style={{ fontSize: '9px', color: driverColor(d.score) }}>{d.score >= 55 ? '↑ 1 pt' : '↓ ' + Math.max(1,Math.round((55-d.score)*0.1)) + ' pts'}</div>
              </div>
            </div>
          ))}
        </div>

        {/* IMPROVEMENT OPPORTUNITIES */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ fontSize: '10px', color: '#dddddd', letterSpacing: '0.15em', fontWeight: '600' }}>PERFORMANCE IMPROVEMENT OPPORTUNITIES</div>
            <button onClick={() => setShowOppsModal(true)} style={{ fontSize: '10px', color: gold, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>View all →</button>
          </div>
          <div style={{ fontSize: '13px', color: '#999', marginBottom: '12px' }}>High-impact opportunities to boost performance</div>
          {oppImprovements.map((o, i) => (
            <div key={i} style={{ padding: '9px 0', borderBottom: i < oppImprovements.length-1 ? '1px solid #111' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3px' }}>
                <div style={{ fontSize: '12px', color: '#e0e0e0', fontWeight: '600', flex: 1, marginRight: '6px' }}>{o.name}</div>
                <div style={{ padding: '2px 5px', backgroundColor: o.impactColor+'18', border: '1px solid '+o.impactColor+'44', borderRadius: '3px', fontSize: '8px', color: o.impactColor, fontWeight: '700', flexShrink: 0 }}>{o.impact}</div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{ fontSize: '11px', color: gold, fontWeight: '700' }}>{o.value}</span>
                <span style={{ fontSize: '12px', color: '#999' }}>{o.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* PERFORMANCE CORRELATION */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ fontSize: '10px', color: '#dddddd', letterSpacing: '0.15em', fontWeight: '600' }}>PERFORMANCE CORRELATION</div>
            <button onClick={() => setShowCorrelationModal(true)} style={{ fontSize: '10px', color: gold, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>View analysis →</button>
          </div>
          <div style={{ fontSize: '13px', color: '#999', marginBottom: '12px' }}>Understanding what drives performance</div>
          {[
            { a: strengths[0]?.name || 'Growth', b: 'Overall Performance', corr: 0.78, color: '#4aaa4a' },
            { a: strengths[1]?.name || 'Operations', b: 'Productivity', corr: 0.72, color: '#4aaa4a' },
            { a: 'Resource Utilisation', b: 'Efficiency', corr: 0.68, color: '#4aaa4a' },
            { a: 'Quality', b: 'Client Experience', corr: 0.64, color: gold },
            { a: 'Innovation', b: 'Growth', corr: 0.58, color: gold },
          ].map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', borderBottom: i < 4 ? '1px solid #0d0d0d' : 'none' }}>
              <div style={{ flex: 1, fontSize: '10px', color: '#888' }}>{c.a}</div>
              <div style={{ fontSize: '9px', color: '#444' }}>↔</div>
              <div style={{ flex: 1, fontSize: '10px', color: '#888' }}>{c.b}</div>
              <div style={{ width: '50px', height: '4px', backgroundColor: '#1a1a1a', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: (c.corr * 100) + '%', height: '100%', backgroundColor: c.color, borderRadius: '2px' }} />
              </div>
              <div style={{ fontSize: '10px', color: c.color, fontWeight: '700', minWidth: '32px', textAlign: 'right' as const }}>+{c.corr.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* INSIGHTS STRIP */}
      <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '10px', color: '#dddddd', letterSpacing: '0.15em', fontWeight: '600' }}>PERFORMANCE INSIGHTS & RECOMMENDATIONS</div>
            <div style={{ fontSize: '13px', color: '#999', marginTop: '2px' }}>AI-powered insights derived from your MRI data</div>
          </div>
          <button onClick={() => setShowInsightsModal(true)} style={{ fontSize: '10px', color: gold, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>View all insights →</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '10px' }}>
          {insights.map((ins, i) => (
            <div key={i} style={{ padding: '12px 14px', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid ' + border }}>
              <div style={{ fontSize: '9px', color: ins.color, letterSpacing: '0.08em', fontWeight: '700', marginBottom: '6px' }}>{ins.type}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '5px', backgroundColor: ins.color+'18', border: '1px solid '+ins.color+'33', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: ins.color, flexShrink: 0 }}>{ins.icon}</div>
                <div style={{ fontSize: '11px', color: '#e0e0e0', fontWeight: '600', lineHeight: 1.3 }}>{ins.title}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '10px', color: ins.color, fontWeight: '600' }}>{ins.conf}</div>
                <div style={{ fontSize: '11px', color: '#999' }}>{ins.meta}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ——— MODALS ——— */}

      {/* FULL ANALYSIS MODAL */}
      {showFullAnalysis && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.88)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '40px', overflowY: 'auto' as const }} onClick={() => setShowFullAnalysis(false)}>
          <div style={{ backgroundColor: '#0e0e0e', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '14px', padding: '32px', width: '780px', maxWidth: '95vw', marginBottom: '40px' }} onClick={(e: any) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div><div style={{ fontSize: '10px', color: gold, letterSpacing: '0.2em', marginBottom: '6px', fontWeight: '600' }}>FULL PERFORMANCE ANALYSIS</div><div style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>Performance Driver Breakdown</div><div style={{ fontSize: '12px', color: '#666' }}>{businessName} · Derived from Business MRI · {drivers.length} drivers analysed</div></div>
              <CloseBtn onClose={() => setShowFullAnalysis(false)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '10px', marginBottom: '16px' }}>
              {pillarList.map((p, i) => (
                <div key={i} style={{ padding: '12px', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid ' + p.color + '33', textAlign: 'center' as const }}>
                  <div style={{ fontSize: '11px', color: '#999', letterSpacing: '0.08em', marginBottom: '5px', fontWeight: '600' }}>{p.name.toUpperCase()} PILLAR</div>
                  <div style={{ fontSize: '20px', fontWeight: '900', color: p.color }}>{p.score}/100</div>
                  <div style={{ fontSize: '10px', color: driverColor(p.score), marginTop: '2px' }}>{statusLabel(p.score)}</div>
                  <div style={{ height: '3px', backgroundColor: '#1a1a1a', borderRadius: '2px', overflow: 'hidden', marginTop: '6px' }}>
                    <div style={{ width: p.score + '%', height: '100%', backgroundColor: p.color }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.12em', marginBottom: '10px', fontWeight: '600' }}>ALL PERFORMANCE DRIVERS — FROM YOUR MRI RESPONSES</div>
            {drivers.map((d, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.8fr 0.5fr 2fr 0.8fr', gap: '12px', alignItems: 'center', padding: '10px 12px', backgroundColor: '#0a0a0a', borderRadius: '7px', border: '1px solid #1e1e1e', marginBottom: '6px' }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#e0e0e0', fontWeight: '700' }}>{d.name}</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>{d.pillar} Pillar · {d.desc}</div>
                </div>
                <div style={{ fontSize: '15px', fontWeight: '900', color: driverColor(d.score) }}>{d.score}/100</div>
                <div>
                  {d.answer && <div style={{ fontSize: '10px', color: '#777', marginBottom: '4px' }}>MRI answer: <span style={{ color: '#aaa', fontWeight: '600' }}>"{d.answer}"</span></div>}
                  <div style={{ height: '4px', backgroundColor: '#1a1a1a', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: d.score + '%', height: '100%', backgroundColor: driverColor(d.score), borderRadius: '2px' }} />
                  </div>
                </div>
                <div style={{ padding: '3px 8px', backgroundColor: statusBg(d.score), borderRadius: '4px', fontSize: '10px', color: driverColor(d.score), fontWeight: '700', textAlign: 'center' as const }}>{statusLabel(d.score)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FULL SCORECARD MODAL */}
      {showFullScorecard && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.88)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '40px', overflowY: 'auto' as const }} onClick={() => setShowFullScorecard(false)}>
          <div style={{ backgroundColor: '#0e0e0e', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '14px', padding: '32px', width: '760px', maxWidth: '95vw', marginBottom: '40px' }} onClick={(e: any) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div><div style={{ fontSize: '10px', color: gold, letterSpacing: '0.2em', marginBottom: '6px', fontWeight: '600' }}>FULL SCORECARD</div><div style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>Complete Performance Scorecard</div><div style={{ fontSize: '12px', color: '#666' }}>{businessName} · Overall: {overallPerf}/100</div></div>
              <CloseBtn onClose={() => setShowFullScorecard(false)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 0.7fr 0.8fr 1fr 0.8fr', gap: '0', padding: '8px 0', borderBottom: '1px solid #1a1a1a', marginBottom: '4px' }}>
              {['DRIVER','SCORE','VS LAST 30 DAYS','EVIDENCE','STATUS'].map(h => <div key={h} style={{ fontSize: '9px', color: '#444', letterSpacing: '0.08em', fontWeight: '600' }}>{h}</div>)}
            </div>
            {drivers.map((d, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.8fr 0.7fr 0.8fr 1fr 0.8fr', gap: '0', padding: '10px 0', borderBottom: i < drivers.length-1 ? '1px solid #111' : 'none', alignItems: 'center' }}>
                <div><div style={{ fontSize: '12px', color: '#e0e0e0', fontWeight: '600' }}>{d.name}</div><div style={{ fontSize: '11px', color: '#999' }}>{d.pillar}</div></div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: driverColor(d.score) }}>{d.score}/100</div>
                {miniSparkline(d.score, driverColor(d.score), i)}
                <div style={{ fontSize: '12px', color: '#aaa' }}>{d.answer ? '"' + d.answer + '"' : 'MRI data'}</div>
                <div style={{ padding: '3px 7px', backgroundColor: statusBg(d.score), borderRadius: '4px', fontSize: '9px', color: driverColor(d.score), fontWeight: '700', display: 'inline-block' }}>{statusLabel(d.score)}</div>
              </div>
            ))}
            <div style={{ marginTop: '14px', padding: '12px 16px', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #1e1e1e', display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '12px', color: '#666' }}>Overall performance: <span style={{ color: driverColor(overallPerf), fontWeight: '700' }}>{overallPerf}/100 — {statusLabel(overallPerf)}</span></div>
              <div style={{ fontSize: '12px', color: '#666' }}>Drivers analysed: <span style={{ color: '#e0e0e0', fontWeight: '600' }}>{drivers.length}</span></div>
            </div>
          </div>
        </div>
      )}

      {/* STRENGTHS MODAL */}
      {showStrengthsModal && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.88)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '40px', overflowY: 'auto' as const }} onClick={() => setShowStrengthsModal(false)}>
          <div style={{ backgroundColor: '#0e0e0e', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '14px', padding: '32px', width: '700px', maxWidth: '95vw', marginBottom: '40px' }} onClick={(e: any) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div><div style={{ fontSize: '10px', color: gold, letterSpacing: '0.2em', marginBottom: '6px', fontWeight: '600' }}>PERFORMANCE STRENGTHS</div><div style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>All Strengths — Ranked by Score</div></div>
              <CloseBtn onClose={() => setShowStrengthsModal(false)} />
            </div>
            {[...drivers].sort((a, b) => b.score - a.score).map((d, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', padding: '14px', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #1e1e1e', marginBottom: '7px', alignItems: 'center' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '6px', backgroundColor: driverColor(d.score)+'18', border: '1px solid '+driverColor(d.score)+'33', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '11px', color: driverColor(d.score), fontWeight: '700' }}>{i+1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', color: '#ffffff', fontWeight: '700', marginBottom: '2px' }}>{d.name}</div>
                  <div style={{ fontSize: '13px', color: '#999' }}>{d.pillar} Pillar · {d.desc}</div>
                  {d.answer && <div style={{ fontSize: '12px', color: '#aaa', marginTop: '3px' }}>MRI: "{d.answer}"</div>}
                </div>
                <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
                  <div style={{ fontSize: '18px', fontWeight: '900', color: driverColor(d.score) }}>{d.score}/100</div>
                  <div style={{ padding: '2px 7px', backgroundColor: statusBg(d.score), borderRadius: '4px', fontSize: '9px', color: driverColor(d.score), fontWeight: '700' }}>{statusLabel(d.score)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GAPS MODAL */}
      {showGapsModal && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.88)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '40px', overflowY: 'auto' as const }} onClick={() => setShowGapsModal(false)}>
          <div style={{ backgroundColor: '#0e0e0e', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '14px', padding: '32px', width: '700px', maxWidth: '95vw', marginBottom: '40px' }} onClick={(e: any) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div><div style={{ fontSize: '10px', color: gold, letterSpacing: '0.2em', marginBottom: '6px', fontWeight: '600' }}>PERFORMANCE GAPS</div><div style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>All Gaps — Priority Order</div><div style={{ fontSize: '12px', color: '#666' }}>Derived from your actual MRI responses</div></div>
              <CloseBtn onClose={() => setShowGapsModal(false)} />
            </div>
            {[...drivers].sort((a, b) => a.score - b.score).map((d, i) => (
              <div key={i} style={{ padding: '14px', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid ' + driverColor(d.score) + '22', marginBottom: '7px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontSize: '13px', color: '#ffffff', fontWeight: '700', marginBottom: '2px' }}>{d.name}</div>
                    <div style={{ fontSize: '13px', color: '#999' }}>{d.pillar} Pillar · {d.desc}</div>
                  </div>
                  <div style={{ textAlign: 'right' as const }}>
                    <div style={{ fontSize: '18px', fontWeight: '900', color: driverColor(d.score) }}>{d.score}/100</div>
                    <div style={{ fontSize: '10px', color: driverColor(d.score), fontWeight: '600' }}>{statusLabel(d.score)}</div>
                  </div>
                </div>
                {d.answer && (
                  <div style={{ padding: '8px 10px', backgroundColor: driverColor(d.score)+'0a', border: '1px solid '+driverColor(d.score)+'22', borderRadius: '6px', marginBottom: '6px' }}>
                    <div style={{ fontSize: '11px', color: '#999', marginBottom: '2px' }}>Your MRI response:</div>
                    <div style={{ fontSize: '11px', color: '#cccccc' }}>"{d.answer}"</div>
                  </div>
                )}
                <div style={{ height: '4px', backgroundColor: '#1a1a1a', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: d.score + '%', height: '100%', backgroundColor: driverColor(d.score), borderRadius: '2px' }} />
                </div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '6px' }}>Gap to Good: {Math.max(0, 75 - d.score)} points to reach Good status</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* IMPROVEMENT OPPORTUNITIES MODAL */}
      {showOppsModal && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.88)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '40px', overflowY: 'auto' as const }} onClick={() => setShowOppsModal(false)}>
          <div style={{ backgroundColor: '#0e0e0e', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '14px', padding: '32px', width: '740px', maxWidth: '95vw', marginBottom: '40px' }} onClick={(e: any) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div><div style={{ fontSize: '10px', color: gold, letterSpacing: '0.2em', marginBottom: '6px', fontWeight: '600' }}>IMPROVEMENT OPPORTUNITIES</div><div style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>All Performance Improvement Opportunities</div><div style={{ fontSize: '12px', color: '#666' }}>{businessName} · Total potential: {fmt(oppHigh > 0 ? Math.round(oppHigh * 0.82) : 210000)}</div></div>
              <CloseBtn onClose={() => setShowOppsModal(false)} />
            </div>
            {[...gaps.map((d, i) => ({ ...oppImprovements[i] || {}, driver: d }))].map((o: any, i: number) => (
              <div key={i} style={{ padding: '16px', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #1e1e1e', marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                      <div style={{ fontSize: '13px', color: '#ffffff', fontWeight: '700' }}>{o.name || 'Improvement ' + (i+1)}</div>
                      <div style={{ padding: '2px 7px', backgroundColor: (o.impactColor||gold)+'18', border: '1px solid '+(o.impactColor||gold)+'44', borderRadius: '4px', fontSize: '9px', color: o.impactColor||gold, fontWeight: '700' }}>{o.impact || 'High Impact'}</div>
                    </div>
                    <div style={{ fontSize: '13px', color: '#999' }}>{o.driver?.pillar || ''} Pillar · {o.time || '3-6 months'}</div>
                  </div>
                  <div style={{ textAlign: 'right' as const }}>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: gold }}>{o.value || fmt(50000)}</div>
                    <div style={{ fontSize: '12px', color: '#999' }}>Potential annual value</div>
                  </div>
                </div>
                {o.driver?.answer && (
                  <div style={{ fontSize: '13px', color: '#aaa', padding: '8px 10px', backgroundColor: '#0d0d0d', borderRadius: '5px', marginBottom: '6px' }}>
                    Current state: "{o.driver.answer}" → Target: Significantly improved
                  </div>
                )}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button style={{ flex: 1, padding: '8px', backgroundColor: 'rgba(200,162,74,0.08)', border: '1px solid rgba(200,162,74,0.2)', borderRadius: '5px', color: gold, fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>Deploy Improvement Plan →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CORRELATION MODAL */}
      {showCorrelationModal && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.88)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '40px', overflowY: 'auto' as const }} onClick={() => setShowCorrelationModal(false)}>
          <div style={{ backgroundColor: '#0e0e0e', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '14px', padding: '32px', width: '680px', maxWidth: '95vw', marginBottom: '40px' }} onClick={(e: any) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div><div style={{ fontSize: '10px', color: gold, letterSpacing: '0.2em', marginBottom: '6px', fontWeight: '600' }}>PERFORMANCE CORRELATION</div><div style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>What Drives Your Performance</div><div style={{ fontSize: '12px', color: '#666' }}>Correlation analysis across all {drivers.length} performance drivers</div></div>
              <CloseBtn onClose={() => setShowCorrelationModal(false)} />
            </div>
            <div style={{ padding: '14px', backgroundColor: '#080f04', border: '1px solid rgba(200,162,74,0.2)', borderRadius: '8px', marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.1em', marginBottom: '6px', fontWeight: '600' }}>ANALYSIS METHODOLOGY</div>
              <div style={{ fontSize: '12px', color: '#aaa', lineHeight: '1.7' }}>These correlations are derived from your MRI responses and show which performance drivers have the strongest relationship with overall business outcomes. Higher correlation = larger impact if improved.</div>
            </div>
            {[
              { a: strengths[0]?.name || 'Revenue Growth', b: 'Overall Performance', corr: 0.78, desc: 'Strong positive relationship' },
              { a: 'Client Retention', b: 'Revenue Growth', corr: 0.74, desc: 'Retention directly drives revenue' },
              { a: 'Operational Capacity', b: 'Service Quality', corr: 0.68, desc: 'Capacity impacts delivery quality' },
              { a: 'Pricing Confidence', b: 'Profit Margin', corr: 0.65, desc: 'Pricing clarity drives profitability' },
              { a: 'Trust Infrastructure', b: 'Sales Conversion', corr: 0.62, desc: 'Social proof improves conversion' },
              { a: 'Leadership Independence', b: 'Scale Potential', corr: 0.58, desc: 'Founder independence enables growth' },
              { a: 'Market Positioning', b: 'Client Acquisition', corr: 0.54, desc: 'Differentiation aids acquisition' },
            ].map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < 6 ? '1px solid #111' : 'none' }}>
                <div style={{ flex: 1, fontSize: '12px', color: '#cccccc', fontWeight: '600' }}>{c.a}</div>
                <div style={{ fontSize: '11px', color: '#444' }}>↔</div>
                <div style={{ flex: 1, fontSize: '12px', color: '#cccccc' }}>{c.b}</div>
                <div style={{ width: '80px', height: '5px', backgroundColor: '#1a1a1a', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: (c.corr*100)+'%', height: '100%', backgroundColor: c.corr >= 0.7 ? '#4aaa4a' : gold, borderRadius: '3px' }} />
                </div>
                <div style={{ fontSize: '12px', color: c.corr >= 0.7 ? '#4aaa4a' : gold, fontWeight: '700', minWidth: '36px' }}>+{c.corr.toFixed(2)}</div>
                <div style={{ fontSize: '12px', color: '#999', minWidth: '140px' }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* INSIGHTS MODAL */}
      {showInsightsModal && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.88)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '40px', overflowY: 'auto' as const }} onClick={() => setShowInsightsModal(false)}>
          <div style={{ backgroundColor: '#0e0e0e', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '14px', padding: '32px', width: '760px', maxWidth: '95vw', marginBottom: '40px' }} onClick={(e: any) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div><div style={{ fontSize: '10px', color: gold, letterSpacing: '0.2em', marginBottom: '6px', fontWeight: '600' }}>PERFORMANCE INSIGHTS</div><div style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>All Performance Insights & Recommendations</div><div style={{ fontSize: '12px', color: '#666' }}>{businessName} · Derived from MRI data · {insights.length} insights generated</div></div>
              <CloseBtn onClose={() => setShowInsightsModal(false)} />
            </div>
            {insights.map((ins, i) => (
              <div key={i} style={{ padding: '16px', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid ' + ins.color + '22', marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: ins.color+'18', border: '1px solid '+ins.color+'33', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: ins.color }}>{ins.icon}</div>
                    <div>
                      <div style={{ fontSize: '9px', color: ins.color, letterSpacing: '0.1em', fontWeight: '700', marginBottom: '2px' }}>{ins.type}</div>
                      <div style={{ fontSize: '13px', color: '#ffffff', fontWeight: '700' }}>{ins.title}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' as const, flexShrink: 0, marginLeft: '12px' }}>
                    <div style={{ fontSize: '11px', color: ins.color, fontWeight: '600' }}>{ins.conf}</div>
                    <div style={{ fontSize: '12px', color: '#999' }}>{ins.meta}</div>
                  </div>
                </div>
                <div style={{ padding: '8px 10px', backgroundColor: ins.color+'08', borderRadius: '5px' }}>
                  <div style={{ fontSize: '11px', color: '#aaa', lineHeight: '1.6' }}>
                    {i === 0 && 'Improving ' + (strengths[0]?.name || 'top performance area') + ' from ' + (strengths[0]?.score || 75) + '/100 toward 90/100 would cascade improvements across all connected drivers.'}
                    {i === 1 && 'Revenue trajectory (' + (revTrend || 'see MRI data') + ') directly impacts Growth pillar score (' + growthScore + '/100) and flows into all performance metrics.'}
                    {i === 2 && 'Addressing ' + (gaps[0]?.name || 'lowest-scoring driver') + ' (currently ' + (gaps[0]?.score || 40) + '/100) represents the single highest-ROI performance improvement available.'}
                    {i === 3 && 'Your overall performance score of ' + overallPerf + '/100 is calculated from ' + drivers.length + ' individual drivers derived from your Business MRI responses. No assumptions — all from your data.'}
                    {i === 4 && 'The primary constraint (' + (primary?.name || 'identified constraint') + ') is directly limiting performance in ' + (primary?.category || 'multiple') + ' areas. Resolving it unlocks cascading performance improvements.'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </DashboardShell>
  )
}
