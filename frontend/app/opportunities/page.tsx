'use client'
import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase'
import DashboardShell from '../components/DashboardShell'

const supabase = createClient()
const gold = '#C8A24A'
const card = '#0e0e0e'
const border = '#1e1e1e'

export default function OpportunitiesPage() {
  const [result, setResult] = useState<Record<string, any> | null>(null)
  const [businessName, setBusinessName] = useState('Your Business')
  const [loading, setLoading] = useState(true)
  const [filterImpact, setFilterImpact] = useState<string[]>([])
  const [filterTime, setFilterTime] = useState('All Timeframes')
  const [filterType, setFilterType] = useState('All Types')
  const [filterArea, setFilterArea] = useState('All Areas')
  const [filterConfidence, setFilterConfidence] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [showReportModal, setShowReportModal] = useState(false)
  const [showForecastModal, setShowForecastModal] = useState(false)
  const [showTypeModal, setShowTypeModal] = useState(false)
  const [selectedOpp, setSelectedOpp] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)

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
      <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.3em' }}>LOADING OPPORTUNITY INTELLIGENCE...</div>
    </main>
  )

  const primary = result?.primary_constraint || null
  const secondary = result?.secondary_constraints || []
  const totalOpp = result?.total_opportunity || {}
  const confidence = result?.confidence || 'medium'

  const fmt = (n: number) => '£' + Math.round(n).toLocaleString('en-GB')
  const oppLow = totalOpp?.total_low || 0
  const oppHigh = totalOpp?.total_high || 0
  const oppMid = oppLow > 0 ? Math.round((oppLow + oppHigh) / 2) : 20000
  const confPct = confidence === 'high' ? 85 : confidence === 'medium' ? 78 : 60
  const confColor = confidence === 'high' ? '#4aaa4a' : confidence === 'medium' ? gold : '#cc4444'
  const verScore = primary?.verification_score || 80

  const opportunities = [
    { id: 1, name: 'Revenue Expansion', desc: 'Increase client value and win rate', type: 'Growth', icon: '↗', iconBg: '#4aaa4a', areas: ['Sales','Client','Growth'], impact: 'High', impactColor: '#e8923a', value: oppMid > 0 ? Math.round(oppMid * 0.27) : 120000, confidence: 85, timeToRealise: '3-6 months', trend: 'up', maturity: 'In Progress' },
    { id: 2, name: 'Operational Efficiency', desc: 'Streamline processes and reduce waste', type: 'Operations', icon: '⚙', iconBg: '#4a8ab0', areas: ['Operations','Team','Process'], impact: 'High', impactColor: '#e8923a', value: oppMid > 0 ? Math.round(oppMid * 0.21) : 95000, confidence: 82, timeToRealise: '1-3 months', trend: 'up', maturity: 'Planned' },
    { id: 3, name: 'Client Retention', desc: 'Improve retention and loyalty', type: 'Client', icon: '◎', iconBg: '#9a6ab0', areas: ['Sales','Client','Service'], impact: 'High', impactColor: '#e8923a', value: oppMid > 0 ? Math.round(oppMid * 0.18) : 80000, confidence: 75, timeToRealise: '3-6 months', trend: 'neutral', maturity: 'Analysing' },
    { id: 4, name: 'Cost Reduction', desc: 'Reduce unnecessary expenditure', type: 'Finance', icon: '▼', iconBg: '#cc4444', areas: ['Finance','Operations'], impact: 'Medium', impactColor: gold, value: oppMid > 0 ? Math.round(oppMid * 0.13) : 60000, confidence: 70, timeToRealise: '1-3 months', trend: 'up', maturity: 'Planned' },
    { id: 5, name: 'Productivity Improvement', desc: 'Increase team productivity and output', type: 'Operations', icon: '⬆', iconBg: '#e8923a', areas: ['Team','Operations','Leadership'], impact: 'Medium', impactColor: gold, value: oppMid > 0 ? Math.round(oppMid * 0.11) : 50000, confidence: 65, timeToRealise: '3-6 months', trend: 'neutral', maturity: 'Identified' },
    { id: 6, name: 'Risk Reduction', desc: 'Reduce exposure and strengthen controls', type: 'Risk', icon: '⊕', iconBg: '#555', areas: ['Risk','Finance','Compliance'], impact: 'Medium', impactColor: gold, value: oppMid > 0 ? Math.round(oppMid * 0.07) : 30000, confidence: 60, timeToRealise: '6-12 months', trend: 'neutral', maturity: 'Identified' },
    { id: 7, name: 'Market Expansion', desc: 'Enter new markets or segments', type: 'Growth', icon: '◈', iconBg: '#4a8ab0', areas: ['Growth','Strategy','Market'], impact: 'Low', impactColor: '#4a8ab0', value: oppMid > 0 ? Math.round(oppMid * 0.03) : 15000, confidence: 55, timeToRealise: '12+ months', trend: 'up', maturity: 'Identified' },
  ]

  const filteredOpps = opportunities.filter(o => {
    if (filterImpact.length > 0 && !filterImpact.includes(o.impact)) return false
    if (filterTime !== 'All Timeframes' && o.timeToRealise !== filterTime) return false
    if (filterType !== 'All Types' && o.type !== filterType) return false
    if (filterArea !== 'All Areas' && !o.areas.includes(filterArea)) return false
    if (o.confidence < filterConfidence) return false
    if (searchTerm && !o.name.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const perPage = 10
  const totalPages = Math.max(1, Math.ceil(filteredOpps.length / perPage))
  const pagedOpps = filteredOpps.slice((currentPage - 1) * perPage, currentPage * perPage)

  const totalValue = opportunities.reduce((s, o) => s + o.value, 0)
  const highImpactCount = opportunities.filter(o => o.impact === 'High' && o.value >= 25000).length
  const quickWinValue = opportunities.filter(o => o.timeToRealise === '1-3 months').reduce((s, o) => s + o.value, 0)
  const longTermValue = opportunities.filter(o => o.timeToRealise === '12+ months' || o.timeToRealise === '6-12 months').reduce((s, o) => s + o.value, 0)

  const typeBreakdown = [
    { label: 'Revenue Expansion', color: gold, pct: 27, val: opportunities[0].value },
    { label: 'Operational Efficiency', color: '#4a8ab0', pct: 21, val: opportunities[1].value },
    { label: 'Client Retention', color: '#9a6ab0', pct: 18, val: opportunities[2].value },
    { label: 'Cost Reduction', color: '#cc4444', pct: 13, val: opportunities[3].value },
    { label: 'Productivity Improvement', color: '#e8923a', pct: 11, val: opportunities[4].value },
    { label: 'Risk Reduction', color: 'var(--text-muted)', pct: 7, val: opportunities[5].value },
    { label: 'Market Expansion', color: '#4aaa4a', pct: 3, val: opportunities[6].value },
  ]

  const maturityStages = [
    { label: 'Identified', count: 16, val: 180000, color: '#4a8ab0' },
    { label: 'Analysing', count: 12, val: 95000, color: gold },
    { label: 'Planned', count: 8, val: 85000, color: '#e8923a' },
    { label: 'In Progress', count: 5, val: 60000, color: '#4aaa4a' },
    { label: 'Realised', count: 9, val: 30000, color: '#9a6ab0' },
  ]

  const sparkline = (trend: string, color: string, idx: number) => (
    <svg width="60" height="20" viewBox="0 0 60 20">
      <defs><linearGradient id={'osg' + idx} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.3"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs>
      {trend === 'up' && <><polygon points="0,18 0,14 10,12 20,14 30,9 40,7 50,4 60,2 60,18" fill={'url(#osg' + idx + ')'}/>
      <polyline points="0,14 10,12 20,14 30,9 40,7 50,4 60,2" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round"/></>}
      {trend === 'neutral' && <><polygon points="0,18 0,10 10,9 20,11 30,9 40,10 50,8 60,9 60,18" fill={'url(#osg' + idx + ')'}/>
      <polyline points="0,10 10,9 20,11 30,9 40,10 50,8 60,9" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round"/></>}
    </svg>
  )

  const confCircle = (pct: number, color: string) => {
    const r = 14, c = r * 2 * Math.PI, fill = (pct / 100) * c
    return (
      <svg width="40" height="40" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r={r} fill="none" stroke="#1a1a1a" strokeWidth="3"/>
        <circle cx="18" cy="18" r={r} fill="none" stroke={color} strokeWidth="3"
          strokeDasharray={String(fill) + ' ' + String(c - fill)}
          strokeLinecap="round" transform="rotate(-90 18 18)"/>
        <text x="18" y="22" textAnchor="middle" fill={color} fontSize="9" fontWeight="800">{pct}%</text>
      </svg>
    )
  }

  const impBadge = (level: string, color: string) => (
    <div style={{ padding: '3px 8px', backgroundColor: color + '18', border: '1px solid ' + color + '44', borderRadius: '4px', fontSize: '10px', color, fontWeight: '700', whiteSpace: 'nowrap' as const, display: 'inline-block', width: 'fit-content' }}>{level}</div>
  )

  return (
    <DashboardShell activeId="opportunities">

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid ' + border }}>
        <div>
          <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.25em', marginBottom: '6px', fontWeight: '600' }}>OPPORTUNITY CENTRE™</div>
          <h1 style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-0.02em', margin: '0 0 6px', color: 'var(--text-primary)', lineHeight: 1.1 }}>Discover, prioritise and realise your highest-value opportunities.</h1>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>AI-powered opportunity intelligence based on your business data, constraints and performance.</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0, marginLeft: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
            Business Twin: <span style={{ color: '#4aaa4a', fontWeight: '600' }}>Active</span>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#4aaa4a', boxShadow: '0 0 6px rgba(74,170,74,0.7)' }} />
          </div>
          <button onClick={() => setShowReportModal(true)} style={{ padding: '9px 16px', backgroundColor: gold, border: 'none', borderRadius: '6px', color: '#050505', fontSize: '12px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' as const }}>View Full Opportunity Report →</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '10px', marginBottom: '16px' }}>
        {[
          { label: 'TOTAL OPPORTUNITY', value: fmt(totalValue), sub: 'Annual value identified', color: gold, trend: '↑ 18% vs last 30 days' },
          { label: 'HIGH IMPACT', value: String(highImpactCount), sub: 'Opportunities ≥£25K', color: 'var(--text-primary)', trend: '↑ 12% vs last 30 days' },
          { label: 'AVG CONFIDENCE', value: confPct + '%', sub: 'Across all opportunities', color: confColor, trend: '↑ 6% vs last 30 days' },
          { label: 'QUICK WINS ≤90 DAYS', value: fmt(quickWinValue), sub: 'Potential value', color: '#4aaa4a', trend: '↑ 24% vs last 30 days' },
          { label: 'LONG TERM ≥12 MONTHS', value: fmt(longTermValue), sub: 'Strategic value', color: '#4a8ab0', trend: '↑ 15% vs last 30 days' },
          { label: 'REALISATION RATE', value: '64%', sub: 'Opportunities achieved', color: gold, trend: '↑ 8% vs last 30 days' },
        ].map((k, i) => (
          <div key={i} style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '8px', padding: '14px 16px' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '7px', fontWeight: '700' }}>{k.label}</div>
            <div style={{ fontSize: '24px', fontWeight: '900', color: k.color, lineHeight: 1, marginBottom: '4px' }}>{k.value}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>{k.sub}</div>
            <div style={{ fontSize: '11px', color: '#4aaa4a', fontWeight: '600' }}>{k.trend}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '210px 1fr 270px', gap: '12px', marginBottom: '16px' }}>

        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ fontSize: '10px', color: '#dddddd', letterSpacing: '0.15em', fontWeight: '600' }}>FILTER OPPORTUNITIES</div>
            <button onClick={() => { setFilterImpact([]); setFilterTime('All Timeframes'); setFilterType('All Types'); setFilterArea('All Areas'); setFilterConfidence(0); setSearchTerm('') }} style={{ fontSize: '10px', color: gold, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Clear all</button>
          </div>
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>Impact Level</div>
            {['Critical','High','Medium','Low'].map(level => {
              const c = level === 'Critical' ? '#cc4444' : level === 'High' ? '#e8923a' : level === 'Medium' ? gold : '#4a8ab0'
              const checked = filterImpact.includes(level)
              return (
                <div key={level} onClick={() => setFilterImpact(prev => checked ? prev.filter(x => x !== level) : [...prev, level])} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 0', cursor: 'pointer' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '3px', border: '1px solid ' + (checked ? c : '#333'), backgroundColor: checked ? c + '22' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {checked && <div style={{ width: '6px', height: '6px', borderRadius: '2px', backgroundColor: c }} />}
                  </div>
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: c }} />
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{level}</span>
                </div>
              )
            })}
          </div>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '600' }}>Time to Realise</div>
            <select value={filterTime} onChange={e => setFilterTime(e.target.value)} style={{ width: '100%', backgroundColor: 'var(--bg-sidebar)', border: '1px solid ' + border, borderRadius: '5px', color: 'var(--text-secondary)', fontSize: '11px', padding: '7px 8px', cursor: 'pointer' }}>
              {['All Timeframes','1-3 months','3-6 months','6-12 months','12+ months'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '600' }}>Opportunity Type</div>
            <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ width: '100%', backgroundColor: 'var(--bg-sidebar)', border: '1px solid ' + border, borderRadius: '5px', color: 'var(--text-secondary)', fontSize: '11px', padding: '7px 8px', cursor: 'pointer' }}>
              {['All Types','Growth','Operations','Finance','Client','Risk'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '600' }}>Affected Areas</div>
            <select value={filterArea} onChange={e => setFilterArea(e.target.value)} style={{ width: '100%', backgroundColor: 'var(--bg-sidebar)', border: '1px solid ' + border, borderRadius: '5px', color: 'var(--text-secondary)', fontSize: '11px', padding: '7px 8px', cursor: 'pointer' }}>
              {['All Areas','Sales','Operations','Finance','Team','Client','Leadership','Growth','Risk','Strategy','Market'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600' }}>Confidence</div>
              <span style={{ fontSize: '10px', color: gold }}>{filterConfidence}%</span>
            </div>
            <input type="range" min="0" max="100" step="5" value={filterConfidence} onChange={e => setFilterConfidence(Number(e.target.value))} style={{ width: '100%', accentColor: gold }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
              <span style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>0%</span><span style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>100%</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '600' }}>Search Opportunities</div>
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search by name..." style={{ width: '100%', backgroundColor: 'var(--bg-sidebar)', border: '1px solid ' + border, borderRadius: '5px', color: 'var(--text-secondary)', fontSize: '11px', padding: '7px 8px', boxSizing: 'border-box' as const }} />
          </div>
        </div>

        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '16px' }}>
          <div style={{ fontSize: '10px', color: '#dddddd', letterSpacing: '0.15em', fontWeight: '600', marginBottom: '12px' }}>OPPORTUNITY PIPELINE</div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 0.6fr 1fr 0.7fr 0.9fr 0.6fr 0.9fr 55px 20px', gap: '0', paddingBottom: '7px', borderBottom: '1px solid #1a1a1a', marginBottom: '2px' }}>
            {['OPPORTUNITY','TYPE','AFFECTED AREAS','IMPACT','VALUE','CONF.','TIME','TREND',''].map(h => (
              <div key={h} style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.08em', fontWeight: '600' }}>{h}</div>
            ))}
          </div>
          {pagedOpps.map((opp, i) => (
            <div key={opp.id} onClick={() => setSelectedOpp(opp)} style={{ display: 'grid', gridTemplateColumns: '2fr 0.6fr 1fr 0.7fr 0.9fr 0.6fr 0.9fr 55px 20px', gap: '0', padding: '9px 0', borderBottom: i < pagedOpps.length - 1 ? '1px solid #111' : 'none', alignItems: 'center', cursor: 'pointer' }}>
              <div style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '6px', backgroundColor: opp.iconBg + '22', border: '1px solid ' + opp.iconBg + '44', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '11px', color: opp.iconBg }}>{opp.icon}</div>
                <div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '700' }}>{opp.name}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{opp.desc}</div>
                </div>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{opp.type}</div>
              <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap' as const }}>
                {opp.areas.slice(0,2).map(a => (
                  <div key={a} style={{ padding: '1px 4px', backgroundColor: 'rgba(200,162,74,0.08)', border: '1px solid rgba(200,162,74,0.15)', borderRadius: '3px', fontSize: '8px', color: 'var(--text-muted)' }}>{a}</div>
                ))}
              </div>
              {impBadge(opp.impact, opp.impactColor)}
              <div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '700' }}>{fmt(opp.value)}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Annual</div>
              </div>
              {confCircle(opp.confidence, opp.confidence >= 80 ? '#4aaa4a' : opp.confidence >= 65 ? gold : '#e8923a')}
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{opp.timeToRealise}</div>
              {sparkline(opp.trend, opp.impactColor, opp.id)}
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>›</div>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid ' + border }}>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Showing {Math.min((currentPage-1)*perPage+1, filteredOpps.length)}–{Math.min(currentPage*perPage, filteredOpps.length)} of {filteredOpps.length}</div>
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
              <button onClick={() => setCurrentPage(p => Math.max(1,p-1))} disabled={currentPage===1} style={{ width: '26px', height: '26px', backgroundColor: 'var(--bg-sidebar)', border: '1px solid ' + border, borderRadius: '4px', color: currentPage===1 ? '#333' : '#888', cursor: currentPage===1 ? 'default' : 'pointer', fontSize: '12px' }}>‹</button>
              {Array.from({length: totalPages}, (_,i) => i+1).map(p => (
                <button key={p} onClick={() => setCurrentPage(p)} style={{ width: '26px', height: '26px', backgroundColor: p===currentPage ? gold : '#0a0a0a', border: '1px solid ' + (p===currentPage ? gold : border), borderRadius: '4px', color: p===currentPage ? '#050505' : '#888', cursor: 'pointer', fontSize: '11px', fontWeight: p===currentPage ? '700' : '400' }}>{p}</button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages,p+1))} disabled={currentPage===totalPages} style={{ width: '26px', height: '26px', backgroundColor: 'var(--bg-sidebar)', border: '1px solid ' + border, borderRadius: '4px', color: currentPage===totalPages ? '#333' : '#888', cursor: currentPage===totalPages ? 'default' : 'pointer', fontSize: '12px' }}>›</button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
          <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ fontSize: '10px', color: '#dddddd', letterSpacing: '0.15em', fontWeight: '600' }}>OPPORTUNITY BY TYPE</div>
              <button onClick={() => setShowTypeModal(true)} style={{ fontSize: '10px', color: gold, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>View full →</button>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <svg width="120" height="120" viewBox="0 0 80 80" style={{ flexShrink: 0 }}>
                {(() => {
                  let offset = 0
                  const r = 28, c = r * 2 * Math.PI
                  return typeBreakdown.map((o, i) => {
                    const dash = (o.pct / 100) * c
                    const el = <circle key={i} cx="40" cy="40" r={r} fill="none" stroke={o.color} strokeWidth="10" strokeDasharray={String(dash) + ' ' + String(c - dash)} strokeDashoffset={String(-offset)} strokeOpacity="0.9" transform="rotate(-90 40 40)"/>
                    offset += dash
                    return el
                  })
                })()}
                <text x="40" y="36" textAnchor="middle" fill={gold} fontSize="9" fontWeight="800">{fmt(totalValue)}</text>
                <text x="40" y="47" textAnchor="middle" fill="#444" fontSize="6">Total</text>
              </svg>
              <div style={{ flex: 1, minWidth: 0 }}>
                {typeBreakdown.slice(0,5).map((o, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '2px', backgroundColor: o.color, flexShrink: 0 }} />
                    <div style={{ flex: 1, fontSize: '9px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{o.label}</div>
                    <div style={{ fontSize: '9px', color: o.color, fontWeight: '600', flexShrink: 0 }}>{o.pct}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <div style={{ fontSize: '10px', color: '#dddddd', letterSpacing: '0.15em', fontWeight: '600' }}>VALUE OVER TIME</div>
              <button onClick={() => setShowForecastModal(true)} style={{ fontSize: '10px', color: gold, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>View forecast →</button>
            </div>
            <div style={{ fontSize: '16px', fontWeight: '800', color: gold, marginBottom: '2px' }}>{fmt(totalValue)}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Total forecasted value</div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '3px', backgroundColor: gold, borderRadius: '2px' }}/><span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Forecast</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '3px', backgroundColor: '#4aaa4a', borderRadius: '2px' }}/><span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Achieved</span></div>
            </div>
            <svg width="100%" height="110" viewBox="0 0 230 110">
              <polyline points="0,62 38,52 76,42 115,28 153,18 191,10 230,4" fill="none" stroke={gold} strokeWidth="1.5" strokeLinecap="round"/>
              <polygon points="0,70 0,62 38,52 76,42 115,28 153,18 191,10 230,4 230,70" fill={gold} fillOpacity="0.07"/>
              <polyline points="0,65 38,58 76,52 115,44 153,37 191,32 230,28" fill="none" stroke="#4aaa4a" strokeWidth="1.2" strokeDasharray="4 3"/>
              {['MAY','JUN','JUL','AUG','SEP','OCT'].map((m,i) => (
                <text key={m} x={i*46} y="68" fill="#333" fontSize="7">{m}</text>
              ))}
            </svg>
          </div>

          <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ fontSize: '10px', color: '#dddddd', letterSpacing: '0.15em', fontWeight: '600' }}>OPPORTUNITY MATURITY</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '4px', marginBottom: '8px' }}>
              {maturityStages.map((s, i) => (
                <div key={i} style={{ textAlign: 'center' as const }}>
                  <div style={{ fontSize: '18px', fontWeight: '900', color: s.color, lineHeight: 1 }}>{s.count}</div>
                  <div style={{ fontSize: '8px', color: 'var(--text-muted)', marginTop: '2px' }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '2px', height: '5px', borderRadius: '3px', overflow: 'hidden', marginBottom: '6px' }}>
              {maturityStages.map((s, i) => <div key={i} style={{ flex: s.count, backgroundColor: s.color, opacity: 0.7 }} />)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {maturityStages.map((s, i) => <div key={i} style={{ fontSize: '8px', color: s.color, fontWeight: '600' }}>{fmt(s.val)}</div>)}
            </div>
            <div style={{ fontSize: '9px', color: 'var(--text-secondary)', marginTop: '6px' }}>Avg time to realise: 4.2 months</div>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '16px' }}>
        <div style={{ fontSize: '10px', color: '#dddddd', letterSpacing: '0.15em', fontWeight: '600', marginBottom: '12px' }}>TOP OPPORTUNITY HIGHLIGHTS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '10px' }}>
          {[
            { badge: 'HIGHEST VALUE', badgeColor: gold, name: opportunities[0].name, metric: fmt(opportunities[0].value), metricSub: 'Annual value', extra: opportunities[0].confidence + '% confidence', icon: opportunities[0].icon, iconBg: opportunities[0].iconBg },
            { badge: 'QUICKEST WIN', badgeColor: '#4aaa4a', name: opportunities[1].name, metric: '1-3 months', metricSub: 'Time to realise', extra: opportunities[1].confidence + '% confidence', icon: opportunities[1].icon, iconBg: opportunities[1].iconBg },
            { badge: 'BEST CONFIDENCE', badgeColor: '#4aaa4a', name: opportunities[0].name, metric: opportunities[0].confidence + '%', metricSub: 'Confidence level', extra: fmt(opportunities[0].value) + ' value', icon: opportunities[0].icon, iconBg: opportunities[0].iconBg },
            { badge: 'HIGHEST IMPACT', badgeColor: '#e8923a', name: opportunities[0].name, metric: 'High', metricSub: 'Impact level', extra: fmt(opportunities[0].value) + ' value', icon: opportunities[0].icon, iconBg: '#cc4444' },
            { badge: 'STRATEGIC PLAY', badgeColor: '#4a8ab0', name: opportunities[6].name, metric: '12+ months', metricSub: 'Time to realise', extra: fmt(opportunities[6].value) + ' value', icon: opportunities[6].icon, iconBg: opportunities[6].iconBg },
          ].map((h, i) => (
            <div key={i} style={{ padding: '14px', backgroundColor: 'var(--bg-sidebar)', borderRadius: '8px', border: '1px solid ' + border }}>
              <div style={{ fontSize: '9px', color: h.badgeColor, letterSpacing: '0.1em', fontWeight: '700', marginBottom: '8px' }}>{h.badge}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '6px', backgroundColor: h.iconBg + '22', border: '1px solid ' + h.iconBg + '44', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: h.iconBg }}>{h.icon}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: '700', lineHeight: 1.2 }}>{h.name}</div>
              </div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: h.badgeColor, lineHeight: 1, marginBottom: '2px' }}>{h.metric}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '3px' }}>{h.metricSub}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{h.extra}</div>
            </div>
          ))}
        </div>
      </div>

      {selectedOpp && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.88)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '40px', overflowY: 'auto' as const }} onClick={() => setSelectedOpp(null)}>
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '14px', padding: '32px', width: '700px', maxWidth: '95vw', marginBottom: '40px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.2em', marginBottom: '6px', fontWeight: '600' }}>OPPORTUNITY DETAIL</div>
                <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>{selectedOpp.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{selectedOpp.desc} · Type: {selectedOpp.type}</div>
              </div>
              <button onClick={() => setSelectedOpp(null)} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '6px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '14px' }}>
              {[
                { label: 'ANNUAL VALUE', value: fmt(selectedOpp.value), color: gold },
                { label: 'IMPACT LEVEL', value: selectedOpp.impact, color: selectedOpp.impactColor },
                { label: 'CONFIDENCE', value: selectedOpp.confidence + '%', color: selectedOpp.confidence >= 80 ? '#4aaa4a' : gold },
                { label: 'TIME TO REALISE', value: selectedOpp.timeToRealise, color: 'var(--text-muted)' },
              ].map((m, i) => (
                <div key={i} style={{ padding: '12px', backgroundColor: 'var(--bg-sidebar)', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center' as const }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '5px', fontWeight: '600' }}>{m.label}</div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: m.color }}>{m.value}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div style={{ padding: '14px', backgroundColor: 'var(--bg-sidebar)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.12em', marginBottom: '8px', fontWeight: '600' }}>AFFECTED AREAS</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const }}>
                  {selectedOpp.areas.map((a: string) => (
                    <div key={a} style={{ padding: '4px 10px', backgroundColor: 'rgba(200,162,74,0.08)', border: '1px solid rgba(200,162,74,0.2)', borderRadius: '4px', fontSize: '11px', color: gold, fontWeight: '600' }}>{a}</div>
                  ))}
                </div>
              </div>
              <div style={{ padding: '14px', backgroundColor: 'var(--bg-sidebar)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.12em', marginBottom: '8px', fontWeight: '600' }}>MATURITY STATUS</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px' }}>{selectedOpp.maturity}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Current stage in opportunity pipeline</div>
              </div>
            </div>
            <div style={{ padding: '14px', backgroundColor: '#080f04', border: '1px solid rgba(200,162,74,0.2)', borderRadius: '8px', marginBottom: '14px' }}>
              <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.12em', marginBottom: '8px', fontWeight: '600' }}>HOW TO REALISE THIS OPPORTUNITY</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.75' }}>
                This {selectedOpp.name.toLowerCase()} opportunity of {fmt(selectedOpp.value)} can be realised within {selectedOpp.timeToRealise} by resolving the {primary?.name || 'primary constraint'} and implementing the recommended deployment framework. Verification score: {verScore}/100. Confidence: {selectedOpp.confidence}%.
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setSelectedOpp(null)} style={{ flex: 1, padding: '10px', backgroundColor: gold, color: '#050505', border: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>Deploy Resolution Framework →</button>
              <button onClick={() => setSelectedOpp(null)} style={{ padding: '10px 20px', backgroundColor: 'transparent', border: '1px solid #2a2a2a', borderRadius: '6px', color: 'var(--text-muted)', fontSize: '12px', cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showReportModal && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.88)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '40px', overflowY: 'auto' as const }} onClick={() => setShowReportModal(false)}>
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '14px', padding: '32px', width: '820px', maxWidth: '95vw', marginBottom: '40px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.2em', marginBottom: '6px', fontWeight: '600' }}>FULL OPPORTUNITY REPORT</div>
                <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>Complete Opportunity Intelligence</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{businessName} · Total: {fmt(totalValue)} · {opportunities.length} opportunities identified</div>
              </div>
              <button onClick={() => setShowReportModal(false)} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '6px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '16px' }}>
              {[
                { label: 'TOTAL PIPELINE', value: fmt(totalValue), color: gold },
                { label: 'HIGH IMPACT', value: highImpactCount + ' opportunities', color: '#e8923a' },
                { label: 'AVG CONFIDENCE', value: confPct + '%', color: confColor },
                { label: 'REALISATION RATE', value: '64%', color: '#4aaa4a' },
              ].map((m, i) => (
                <div key={i} style={{ padding: '12px', backgroundColor: 'var(--bg-sidebar)', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center' as const }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '5px', fontWeight: '600' }}>{m.label}</div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: m.color }}>{m.value}</div>
                </div>
              ))}
            </div>
            {opportunities.map((opp, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', padding: '12px', backgroundColor: 'var(--bg-sidebar)', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '7px', alignItems: 'center' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '6px', backgroundColor: opp.iconBg + '22', border: '1px solid ' + opp.iconBg + '44', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '13px', color: opp.iconBg }}>{opp.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '700', marginBottom: '2px' }}>{opp.name}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{opp.desc} · {opp.type} · {opp.timeToRealise}</div>
                    </div>
                    <div style={{ textAlign: 'right' as const, flexShrink: 0, marginLeft: '16px' }}>
                      <div style={{ fontSize: '15px', fontWeight: '800', color: gold }}>{fmt(opp.value)}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{opp.confidence}% confidence</div>
                    </div>
                  </div>
                </div>
                {impBadge(opp.impact, opp.impactColor)}
              </div>
            ))}
          </div>
        </div>
      )}

      {showForecastModal && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.88)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '40px', overflowY: 'auto' as const }} onClick={() => setShowForecastModal(false)}>
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '14px', padding: '32px', width: '680px', maxWidth: '95vw', marginBottom: '40px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.2em', marginBottom: '6px', fontWeight: '600' }}>VALUE FORECAST</div>
                <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>6-Month Value Realisation Forecast</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Projected value unlock based on deployment timeline</div>
              </div>
              <button onClick={() => setShowForecastModal(false)} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '6px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '16px' }}>
              {[
                { month: 'Month 1-3', value: fmt(Math.round(totalValue * 0.25)), label: 'Quick wins', color: '#4aaa4a' },
                { month: 'Month 3-6', value: fmt(Math.round(totalValue * 0.45)), label: 'Mid-term value', color: gold },
                { month: 'Month 6-12', value: fmt(Math.round(totalValue * 0.30)), label: 'Long-term strategic', color: '#4a8ab0' },
              ].map((m, i) => (
                <div key={i} style={{ padding: '14px', backgroundColor: 'var(--bg-sidebar)', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center' as const }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '5px' }}>{m.month}</div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: m.color, marginBottom: '3px' }}>{m.value}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{m.label}</div>
                </div>
              ))}
            </div>
            <svg width="100%" height="200" viewBox="0 0 580 200">
              {[0,1,2,3,4].map(i => <line key={i} x1="50" y1={i*26+10} x2="570" y2={i*26+10} stroke="#1a1a1a" strokeWidth="0.8"/>)}
              {['£0','£100K','£200K','£300K','£400K'].map((l,i) => <text key={l} x="0" y={110-i*26+4} fill="#333" fontSize="8">{l}</text>)}
              <polygon points="50,110 130,90 210,68 290,46 370,28 450,14 570,8 570,110" fill={gold} fillOpacity="0.07"/>
              <polyline points="50,110 130,90 210,68 290,46 370,28 450,14 570,8" fill="none" stroke={gold} strokeWidth="2" strokeLinecap="round"/>
              <polygon points="50,110 130,100 210,86 290,70 370,58 450,46 570,38 570,110" fill="#4aaa4a" fillOpacity="0.07"/>
              <polyline points="50,110 130,100 210,86 290,70 370,58 450,46 570,38" fill="none" stroke="#4aaa4a" strokeWidth="1.5" strokeDasharray="4 3"/>
              {['MAY','JUN','JUL','AUG','SEP','OCT','NOV'].map((m,i) => <text key={m} x={50+i*88} y="132" fill="#333" fontSize="8">{m}</text>)}
            </svg>
            <div style={{ padding: '12px', backgroundColor: 'var(--bg-sidebar)', borderRadius: '8px', border: '1px solid var(--border)', marginTop: '12px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>Forecast assumes deployment of Tier 1 actions within 30 days. Achieved line represents conservative 70% realisation rate based on industry benchmarks.</div>
            </div>
          </div>
        </div>
      )}

      {showTypeModal && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.88)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '40px', overflowY: 'auto' as const }} onClick={() => setShowTypeModal(false)}>
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '14px', padding: '32px', width: '660px', maxWidth: '95vw', marginBottom: '40px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.2em', marginBottom: '6px', fontWeight: '600' }}>OPPORTUNITY BY TYPE</div>
                <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>Full Type Breakdown</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>All opportunity types · Total: {fmt(totalValue)}</div>
              </div>
              <button onClick={() => setShowTypeModal(false)} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '6px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            {typeBreakdown.map((o, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.5fr 50px 2fr 80px', gap: '12px', alignItems: 'center', padding: '12px 0', borderBottom: i < typeBreakdown.length-1 ? '1px solid #111' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: o.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>{o.label}</span>
                </div>
                <div style={{ fontSize: '13px', color: o.color, fontWeight: '700' }}>{o.pct}%</div>
                <div style={{ height: '5px', backgroundColor: '#1a1a1a', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: o.pct + '%', height: '100%', backgroundColor: o.color, borderRadius: '3px' }} />
                </div>
                <div style={{ fontSize: '13px', color: o.color, fontWeight: '700', textAlign: 'right' as const }}>{fmt(o.val)}</div>
              </div>
            ))}
            <div style={{ marginTop: '14px', padding: '12px', backgroundColor: 'var(--bg-sidebar)', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total opportunity value</span>
              <span style={{ fontSize: '14px', fontWeight: '800', color: gold }}>{fmt(totalValue)}</span>
            </div>
          </div>
        </div>
      )}

    </DashboardShell>
  )
}
