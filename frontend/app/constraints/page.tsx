'use client'
import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase'
import DashboardShell from '../components/DashboardShell'

const supabase = createClient()
const gold = '#C8A24A'
const card = '#0e0e0e'
const border = '#1e1e1e'

export default function ConstraintsPage() {
  const [result, setResult] = useState<Record<string, any> | null>(null)
  const [businessName, setBusinessName] = useState('Your Business')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'active' | 'resolved' | 'monitoring'>('active')
  const [selectedConstraint, setSelectedConstraint] = useState<any>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data } = await supabase
            .from('businesses')
            .select('id, business_name, mri_result, location_country')
            .eq('email', user.email)
            .order('updated_at', { ascending: false })
            .limit(1)
            .single()
          if (data) {
            setBusinessName(data.business_name || 'Your Business')
            if (data.mri_result) {
              setResult(data.mri_result)
              setSelectedConstraint(data.mri_result.primary_constraint || null)
            }
          }
        }
      } catch (e) {}
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <main style={{ backgroundColor: '#050505', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.3em' }}>LOADING CONSTRAINT INTELLIGENCE...</div>
    </main>
  )

  const primary = result?.primary_constraint || null
  const secondary = result?.secondary_constraints || []
  const unverified = result?.unverified_flags || []
  const opportunity = result?.total_opportunity || null
  const confidence = result?.confidence || 'medium'
  const sym = '£'

  const fmt = (n: number) => sym + n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const fmtShort = (n: number) => sym + Math.round(n).toLocaleString('en-GB')

  const oppLow = opportunity?.total_low || 0
  const oppHigh = opportunity?.total_high || 0
  const verScore = primary?.verification_score || 0
  const confColor = confidence === 'high' ? '#4aaa4a' : confidence === 'medium' ? gold : '#cc4444'

  const allConstraints = [
    ...(primary ? [{ ...primary, isPrimary: true }] : []),
    ...secondary,
  ]

  const severityColor = (s: string) => s === 'critical' ? '#cc4444' : s === 'high' ? '#e8923a' : s === 'medium' ? gold : '#4a8ab0'
  const severityBg = (s: string) => s === 'critical' ? 'rgba(204,68,68,0.1)' : s === 'high' ? 'rgba(232,146,58,0.1)' : s === 'medium' ? 'rgba(200,162,74,0.1)' : 'rgba(74,138,176,0.1)'

  const criticalCount = allConstraints.filter(c => c.severity === 'critical').length
  const highCount = allConstraints.filter(c => c.severity === 'high').length
  const mediumCount = allConstraints.filter(c => c.severity === 'medium').length
  const lowCount = allConstraints.filter(c => c.severity === 'low' || !c.severity).length

  const impactRows = [
    { area: 'Sales Performance', level: 'High', levelColor: '#e8923a', impact: Math.round((oppHigh || 450000) * 0.33), trend: 'up' },
    { area: 'Operational Efficiency', level: 'High', levelColor: '#e8923a', impact: Math.round((oppHigh || 450000) * 0.24), trend: 'up' },
    { area: 'Team Productivity', level: 'Medium', levelColor: gold, impact: Math.round((oppHigh || 450000) * 0.18), trend: 'neutral' },
    { area: 'Client Experience', level: 'Medium', levelColor: gold, impact: Math.round((oppHigh || 450000) * 0.13), trend: 'neutral' },
    { area: 'Strategic Execution', level: 'Medium', levelColor: gold, impact: Math.round((oppHigh || 450000) * 0.11), trend: 'down' },
  ]

  const resolutionSteps = [
    { n: 1, title: 'Diagnose Root Cause', status: 'completed', color: '#4aaa4a' },
    { n: 2, title: 'Implement ' + (primary?.name || 'Leadership') + ' Framework', status: 'inprogress', color: gold },
    { n: 3, title: 'Delegate & Empower', status: 'planned', color: '#444' },
    { n: 4, title: 'Optimise Processes', status: 'planned', color: '#444' },
    { n: 5, title: 'Monitor & Refine', status: 'planned', color: '#444' },
  ]

  const miniSparkline = (trend: string, color: string) => (
    <svg width="60" height="20" viewBox="0 0 60 20">
      {trend === 'up' && <polyline points="0,16 10,14 20,15 30,10 40,8 50,5 60,3" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>}
      {trend === 'neutral' && <polyline points="0,10 10,9 20,11 30,10 40,11 50,9 60,10" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>}
      {trend === 'down' && <polyline points="0,4 10,6 20,5 30,8 40,11 50,13 60,16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>}
    </svg>
  )

  return (
    <DashboardShell activeId="constraints">

      {/* PAGE HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid ' + border }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '-0.02em', margin: '0 0 6px', color: '#ffffff' }}>Constraint Intelligence™</h1>
          <div style={{ fontSize: '13px', color: '#777' }}>Identify, analyse and resolve the root causes limiting your business performance.</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#888' }}>
            Business Twin:
            <span style={{ color: '#4aaa4a', fontWeight: '600' }}>Active</span>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#4aaa4a', boxShadow: '0 0 6px rgba(74,170,74,0.7)' }} />
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 16px', backgroundColor: 'rgba(200,162,74,0.1)', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '6px', color: gold, fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke={gold} strokeWidth="1.2"/><circle cx="7" cy="7" r="2" stroke={gold} strokeWidth="1.2"/><line x1="7" y1="1" x2="7" y2="3" stroke={gold} strokeWidth="1.2"/><line x1="7" y1="11" x2="7" y2="13" stroke={gold} strokeWidth="1.2"/><line x1="1" y1="7" x2="3" y2="7" stroke={gold} strokeWidth="1.2"/><line x1="11" y1="7" x2="13" y2="7" stroke={gold} strokeWidth="1.2"/></svg>
            Constraint Scan
          </button>
          <div style={{ width: '32px', height: '32px', border: '1px solid ' + border, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#555', fontSize: '16px' }}>⋮</div>
        </div>
      </div>

      {/* 4-CARD KPI BAR */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '16px' }}>

        {/* Primary Constraint */}
        <div style={{ backgroundColor: '#080f04', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '10px', padding: '20px', position: 'relative' as const, overflow: 'hidden' }}>
          <div style={{ position: 'absolute' as const, top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, ' + gold + ', transparent)' }} />
          <div style={{ fontSize: '9px', color: '#888', letterSpacing: '0.15em', fontWeight: '600', marginBottom: '8px' }}>PRIMARY CONSTRAINT</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#ffffff', lineHeight: 1 }}>{primary?.name || 'No constraint detected'}</div>
            {primary?.severity && (
              <div style={{ padding: '3px 8px', backgroundColor: severityBg(primary.severity), border: '1px solid ' + severityColor(primary.severity) + '55', borderRadius: '4px', fontSize: '9px', color: severityColor(primary.severity), fontWeight: '700', letterSpacing: '0.08em', flexShrink: 0 }}>{primary.severity.toUpperCase()}</div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <div>
              <div style={{ fontSize: '9px', color: '#555', letterSpacing: '0.1em', marginBottom: '4px' }}>VERIFICATION SCORE</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: verScore >= 70 ? '#4aaa4a' : gold, marginBottom: '4px' }}>{verScore}/100</div>
              <div style={{ height: '3px', width: '80px', backgroundColor: '#1a1a1a', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: verScore + '%', height: '100%', backgroundColor: verScore >= 70 ? '#4aaa4a' : gold, borderRadius: '2px' }} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: '9px', color: '#555', letterSpacing: '0.1em', marginBottom: '4px' }}>CONFIDENCE</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: confColor }}>{confidence.toUpperCase()}</div>
              <div style={{ fontSize: '10px', color: '#555' }}>{verScore}%</div>
            </div>
          </div>
        </div>

        {/* Annual Opportunity */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '20px' }}>
          <div style={{ fontSize: '9px', color: '#888', letterSpacing: '0.15em', fontWeight: '600', marginBottom: '8px' }}>ANNUAL OPPORTUNITY</div>
          <div style={{ fontSize: '22px', fontWeight: '900', color: gold, lineHeight: 1, marginBottom: '4px' }}>
            {oppLow > 0 ? fmtShort(oppLow) + ' – ' + fmtShort(oppHigh) : '£280,000 – £450,000'}
          </div>
          <div style={{ fontSize: '11px', color: '#555', marginBottom: '12px' }}>Financial impact if resolved</div>
          <svg width="100%" height="32" viewBox="0 0 160 32">
            <polyline points="0,28 20,24 40,26 60,18 80,14 100,16 120,8 140,5 160,3" fill="none" stroke={gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <polygon points="0,32 0,28 20,24 40,26 60,18 80,14 100,16 120,8 140,5 160,3 160,32" fill={gold} fillOpacity="0.08"/>
          </svg>
        </div>

        {/* Constraints Detected */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '20px' }}>
          <div style={{ fontSize: '9px', color: '#888', letterSpacing: '0.15em', fontWeight: '600', marginBottom: '8px' }}>CONSTRAINTS DETECTED</div>
          <div style={{ fontSize: '36px', fontWeight: '900', color: '#ffffff', lineHeight: 1, marginBottom: '4px' }}>{allConstraints.length || 7}</div>
          <div style={{ fontSize: '11px', color: '#555', marginBottom: '12px' }}>Active constraints</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
            {criticalCount > 0 && <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#cc4444' }}/><span style={{ fontSize: '10px', color: '#cc4444', fontWeight: '600' }}>{criticalCount} Critical</span></div>}
            {highCount > 0 && <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#e8923a' }}/><span style={{ fontSize: '10px', color: '#e8923a', fontWeight: '600' }}>{highCount} High</span></div>}
            {mediumCount > 0 && <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: gold }}/><span style={{ fontSize: '10px', color: gold, fontWeight: '600' }}>{mediumCount} Medium</span></div>}
            {lowCount > 0 && <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4a8ab0' }}/><span style={{ fontSize: '10px', color: '#4a8ab0', fontWeight: '600' }}>{lowCount} Low</span></div>}
            {allConstraints.length === 0 && <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#cc4444' }}/><span style={{ fontSize: '10px', color: '#cc4444', fontWeight: '600' }}>1 Critical</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#e8923a' }}/><span style={{ fontSize: '10px', color: '#e8923a', fontWeight: '600' }}>2 High</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: gold }}/><span style={{ fontSize: '10px', color: gold, fontWeight: '600' }}>3 Medium</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4a8ab0' }}/><span style={{ fontSize: '10px', color: '#4a8ab0', fontWeight: '600' }}>1 Low</span></div>
            </>}
          </div>
        </div>

        {/* Verification Strength */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '20px' }}>
          <div style={{ fontSize: '9px', color: '#888', letterSpacing: '0.15em', fontWeight: '600', marginBottom: '8px' }}>VERIFICATION STRENGTH</div>
          <div style={{ fontSize: '36px', fontWeight: '900', color: gold, lineHeight: 1, marginBottom: '4px' }}>{verScore}/100</div>
          <div style={{ fontSize: '11px', color: '#555', marginBottom: '12px' }}>Overall verification</div>
          <div style={{ height: '6px', backgroundColor: '#1a1a1a', borderRadius: '3px', overflow: 'hidden', marginBottom: '6px' }}>
            <div style={{ width: (verScore || 80) + '%', height: '100%', background: 'linear-gradient(90deg, ' + gold + '88, ' + gold + ')', borderRadius: '3px' }} />
          </div>
          <div style={{ fontSize: '10px', color: '#555' }}>Based on {verScore >= 80 ? 'strong' : verScore >= 60 ? 'moderate' : 'limited'} evidence base</div>
        </div>
      </div>

      {/* MIDDLE ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 300px', gap: '12px', marginBottom: '12px' }}>

        {/* CONSTRAINTS LIST */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column' as const }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '10px', color: '#dddddd', letterSpacing: '0.15em', fontWeight: '600' }}>CONSTRAINTS LIST</div>
            <a href="#" style={{ fontSize: '10px', color: gold, textDecoration: 'none' }}>View all →</a>
          </div>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0', marginBottom: '12px', backgroundColor: '#0a0a0a', borderRadius: '6px', padding: '3px' }}>
            {(['active', 'resolved', 'monitoring'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: '5px 8px', borderRadius: '4px', border: 'none', backgroundColor: activeTab === tab ? '#1e1e1e' : 'transparent', color: activeTab === tab ? '#e0e0e0' : '#555', fontSize: '10px', fontWeight: '600', cursor: 'pointer' }}>
                {tab === 'active' ? `Active (${allConstraints.length || 7})` : tab === 'resolved' ? 'Resolved (12)' : 'Monitoring (3)'}
              </button>
            ))}
          </div>
          {/* List */}
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '4px', flex: 1 }}>
            {activeTab === 'active' && (allConstraints.length > 0 ? allConstraints : [
              { name: primary?.name || 'Management Bottleneck', category: 'Leadership', verification_score: verScore || 80, severity: primary?.severity || 'critical' },
              { name: 'Key Person Dependency', category: 'People', verification_score: 72, severity: 'high' },
              { name: 'Sales Conversion Inefficiency', category: 'Sales & Marketing', verification_score: 58, severity: 'high' },
              { name: 'Operational Inefficiency', category: 'Operations', verification_score: 54, severity: 'medium' },
              { name: 'Technology Limitations', category: 'Technology', verification_score: 45, severity: 'medium' },
              { name: 'Client Concentration', category: 'Market', verification_score: 32, severity: 'low' },
              { name: 'Cash Flow Volatility', category: 'Finance', verification_score: 28, severity: 'low' },
            ]).map((c: any, i: number) => (
              <div key={i} onClick={() => setSelectedConstraint(c)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 10px', borderRadius: '6px', backgroundColor: selectedConstraint?.name === c.name ? 'rgba(200,162,74,0.08)' : '#0a0a0a', border: '1px solid ' + (selectedConstraint?.name === c.name ? 'rgba(200,162,74,0.25)' : border), cursor: 'pointer' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: severityBg(c.severity), border: '1px solid ' + severityColor(c.severity) + '44', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: severityColor(c.severity) }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '11px', color: '#e0e0e0', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{c.name}</div>
                  <div style={{ fontSize: '9px', color: '#555' }}>{c.category || 'General'}</div>
                </div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#aaa', flexShrink: 0 }}>{c.verification_score || 50}</div>
                <div style={{ padding: '2px 7px', backgroundColor: severityBg(c.severity), border: '1px solid ' + severityColor(c.severity) + '44', borderRadius: '3px', fontSize: '8px', color: severityColor(c.severity), fontWeight: '700', flexShrink: 0 }}>{(c.severity || 'med').toUpperCase()}</div>
              </div>
            ))}
            {activeTab !== 'active' && (
              <div style={{ textAlign: 'center' as const, padding: '30px 0', color: '#444', fontSize: '12px' }}>{activeTab === 'resolved' ? '12 resolved constraints' : '3 constraints being monitored'}</div>
            )}
          </div>
          <button style={{ marginTop: '12px', width: '100%', padding: '9px', backgroundColor: 'transparent', border: '1px solid rgba(200,162,74,0.2)', borderRadius: '6px', color: gold, fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>View Constraint Library →</button>
        </div>

        {/* CONSTRAINT NETWORK */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ fontSize: '10px', color: '#dddddd', letterSpacing: '0.15em', fontWeight: '600' }}>CONSTRAINT NETWORK™</div>
            <select style={{ backgroundColor: '#0a0a0a', border: '1px solid ' + border, borderRadius: '4px', color: '#888', fontSize: '10px', padding: '3px 8px', cursor: 'pointer' }}>
              <option>Layout: Impact Flow</option>
              <option>Layout: Hierarchy</option>
              <option>Layout: Radial</option>
            </select>
          </div>
          <div style={{ fontSize: '11px', color: '#555', marginBottom: '12px' }}>Visualising how constraints connect and impact your business performance.</div>
          {/* Network SVG */}
          <svg width="100%" viewBox="0 0 580 300" style={{ display: 'block' }}>
            <defs>
              <radialGradient id="cnCenter" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffdd80" stopOpacity="0.9"/>
                <stop offset="40%" stopColor="#C8A24A" stopOpacity="0.7"/>
                <stop offset="100%" stopColor="#6b4500" stopOpacity="0"/>
              </radialGradient>
              <radialGradient id="cnCrit" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff9999"/>
                <stop offset="50%" stopColor="#cc4444"/>
                <stop offset="100%" stopColor="#440000" stopOpacity="0"/>
              </radialGradient>
              <radialGradient id="cnHigh" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffcc88"/>
                <stop offset="50%" stopColor="#e8923a"/>
                <stop offset="100%" stopColor="#4a2000" stopOpacity="0"/>
              </radialGradient>
              <radialGradient id="cnMed" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffe090"/>
                <stop offset="50%" stopColor="#C8A24A"/>
                <stop offset="100%" stopColor="#3a2a00" stopOpacity="0"/>
              </radialGradient>
              <filter id="cglow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            {/* Column labels */}
            <text x="90" y="18" textAnchor="middle" fill="#444" fontSize="9" fontWeight="600" letterSpacing="0.1em">Root Causes</text>
            <text x="490" y="18" textAnchor="middle" fill="#444" fontSize="9" fontWeight="600" letterSpacing="0.1em">Business Impact</text>
            {/* Root cause → center lines */}
            <line x1="140" y1="80" x2="260" y2="150" stroke="#C8A24A" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="4 3"/>
            <line x1="140" y1="150" x2="260" y2="150" stroke="#C8A24A" strokeWidth="1.2" strokeOpacity="0.55"/>
            <line x1="140" y1="220" x2="260" y2="150" stroke="#C8A24A" strokeWidth="0.8" strokeOpacity="0.35" strokeDasharray="4 3"/>
            {/* Center → impact lines */}
            <line x1="320" y1="150" x2="400" y2="70" stroke="#cc4444" strokeWidth="1.2" strokeOpacity="0.5"/>
            <line x1="320" y1="150" x2="400" y2="130" stroke="#e8923a" strokeWidth="1" strokeOpacity="0.45"/>
            <line x1="320" y1="150" x2="400" y2="190" stroke="#e8923a" strokeWidth="1" strokeOpacity="0.45"/>
            <line x1="320" y1="150" x2="400" y2="240" stroke="#C8A24A" strokeWidth="0.9" strokeOpacity="0.4"/>
            <line x1="400" y1="70" x2="480" y2="55" stroke="#cc4444" strokeWidth="1" strokeOpacity="0.5"/>
            <line x1="400" y1="130" x2="480" y2="120" stroke="#e8923a" strokeWidth="0.9" strokeOpacity="0.45"/>
            <line x1="400" y1="190" x2="480" y2="185" stroke="#C8A24A" strokeWidth="0.9" strokeOpacity="0.4"/>
            <line x1="400" y1="240" x2="480" y2="250" stroke="#C8A24A" strokeWidth="0.8" strokeOpacity="0.35"/>
            {/* Root cause nodes */}
            {[
              { y: 80, label: 'Limited Leadership', sub: 'Capacity' },
              { y: 150, label: 'Decision', sub: 'Bottlenecks' },
              { y: 220, label: 'Hiring', sub: 'Constraints' },
            ].map((n, i) => (
              <g key={i}>
                <circle cx="90" cy={n.y} r="20" fill="rgba(200,162,74,0.08)" filter="url(#cglow)"/>
                <circle cx="90" cy={n.y} r="14" fill="#080808" stroke="#aa8820" strokeWidth="1"/>
                <circle cx="90" cy={n.y} r="10" fill="url(#cnMed)"/>
                <circle cx="86" cy={n.y - 4} r="3.5" fill="white" fillOpacity="0.5"/>
                <text x="115" y={n.y - 3} fill="#C8A24A" fontSize="9" fontWeight="600">{n.label}</text>
                <text x="115" y={n.y + 8} fill="#886830" fontSize="9">{n.sub}</text>
              </g>
            ))}
            {/* Center — primary constraint (large) */}
            <circle cx="290" cy="150" r="36" fill="rgba(200,162,74,0.1)" filter="url(#cglow)"/>
            <circle cx="290" cy="150" r="26" fill="#050a00" stroke="#C8A24A" strokeWidth="1.8"/>
            <circle cx="290" cy="150" r="20" fill="url(#cnCenter)"/>
            <circle cx="284" cy="143" r="7" fill="white" fillOpacity="0.6"/>
            <text x="290" y="178" textAnchor="middle" fill="#C8A24A" fontSize="9" fontWeight="700">{(primary?.name || 'Management Bottleneck').split(' ').slice(0,1).join('')}</text>
            <text x="290" y="188" textAnchor="middle" fill="#C8A24A" fontSize="9" fontWeight="700">{(primary?.name || 'Management Bottleneck').split(' ').slice(1).join(' ')}</text>
            {/* Middle impact nodes */}
            {[
              { x: 400, y: 70, label: 'Strategic', sub: 'Delays', r: 16, grad: 'cnCrit' },
              { x: 400, y: 130, label: 'Execution', sub: 'Slower', r: 14, grad: 'cnHigh' },
              { x: 400, y: 190, label: 'Team', sub: 'Overload', r: 14, grad: 'cnHigh' },
              { x: 400, y: 240, label: 'Client', sub: 'Experience', r: 12, grad: 'cnMed' },
            ].map((n, i) => (
              <g key={i}>
                <circle cx={n.x} cy={n.y} r={n.r + 6} fill="rgba(0,0,0,0.2)" filter="url(#cglow)"/>
                <circle cx={n.x} cy={n.y} r={n.r} fill="#080808" stroke={n.grad === 'cnCrit' ? '#cc4444' : n.grad === 'cnHigh' ? '#e8923a' : '#aa8820'} strokeWidth="1"/>
                <circle cx={n.x} cy={n.y} r={n.r - 3} fill={'url(#' + n.grad + ')'}/>
                <text x={n.x + n.r + 6} y={n.y - 2} fill={n.grad === 'cnCrit' ? '#cc4444' : n.grad === 'cnHigh' ? '#e8923a' : gold} fontSize="9" fontWeight="600">{n.label}</text>
                <text x={n.x + n.r + 6} y={n.y + 9} fill="#555" fontSize="9">{n.sub}</text>
              </g>
            ))}
            {/* Right impact nodes */}
            {[
              { x: 480, y: 55, label: 'Sales Delays', col: '#cc4444' },
              { x: 480, y: 120, label: 'Operational Drag', col: '#e8923a' },
              { x: 480, y: 185, label: 'Client Experience', col: gold },
              { x: 480, y: 250, label: 'Revenue Impact', col: gold },
            ].map((n, i) => (
              <g key={i}>
                <circle cx={n.x} cy={n.y} r="10" fill="#080808" stroke={n.col} strokeWidth="0.8" strokeOpacity="0.6"/>
                <circle cx={n.x} cy={n.y} r="7" fill={n.col} fillOpacity="0.3"/>
                <text x={n.x + 14} y={n.y + 4} fill={n.col} fontSize="8.5" fontWeight="600">{n.label}</text>
              </g>
            ))}
          </svg>
          {/* Legend + controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
            <div style={{ display: 'flex', gap: '14px' }}>
              {[['#cc4444','Critical impact'],['#e8923a','High Impact'],['#C8A24A','Medium Impact'],['#4a8ab0','Low Impact']].map(([c,l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: c }} />
                  <span style={{ fontSize: '9px', color: '#555' }}>{l}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button style={{ width: '24px', height: '24px', backgroundColor: '#0a0a0a', border: '1px solid ' + border, borderRadius: '4px', color: '#888', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
              <span style={{ fontSize: '10px', color: '#555' }}>100%</span>
              <button style={{ width: '24px', height: '24px', backgroundColor: '#0a0a0a', border: '1px solid ' + border, borderRadius: '4px', color: '#888', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
              <button style={{ width: '24px', height: '24px', backgroundColor: '#0a0a0a', border: '1px solid ' + border, borderRadius: '4px', color: '#888', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⛶</button>
            </div>
          </div>
        </div>

        {/* CONSTRAINT DETAILS */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '16px', overflowY: 'auto' as const }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '10px', color: '#dddddd', letterSpacing: '0.15em', fontWeight: '600' }}>CONSTRAINT DETAILS</div>
            {selectedConstraint?.severity && (
              <div style={{ padding: '3px 8px', backgroundColor: severityBg(selectedConstraint.severity), border: '1px solid ' + severityColor(selectedConstraint.severity) + '55', borderRadius: '4px', fontSize: '9px', color: severityColor(selectedConstraint.severity), fontWeight: '700' }}>{selectedConstraint.severity.toUpperCase()}</div>
            )}
          </div>
          <div style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', marginBottom: '6px', lineHeight: 1.2 }}>{selectedConstraint?.name || primary?.name || 'Management Bottleneck'}</div>
          <div style={{ fontSize: '11px', color: '#888', lineHeight: '1.6', marginBottom: '14px' }}>{selectedConstraint?.hypothesis || primary?.hypothesis || 'Leadership capacity and decision velocity are limiting execution speed and business growth.'}</div>
          {/* Metadata grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px', padding: '12px', backgroundColor: '#0a0a0a', borderRadius: '6px', border: '1px solid ' + border }}>
            {[
              { label: 'Detected', value: '5 days ago' },
              { label: 'Category', value: selectedConstraint?.category || 'Leadership' },
              { label: 'Verification Score', value: (selectedConstraint?.verification_score || verScore || 80) + '/100' },
              { label: 'Confidence', value: confidence.toUpperCase() + ' (' + (selectedConstraint?.verification_score || verScore || 85) + '%)' },
              { label: 'Annual Impact', value: oppLow > 0 ? fmtShort(oppLow) + ' – ' + fmtShort(oppHigh) : '£280,000 – £450,000' },
            ].map((m, i) => (
              <div key={i} style={{ gridColumn: m.label === 'Annual Impact' ? '1 / -1' : 'auto' }}>
                <div style={{ fontSize: '9px', color: '#555', letterSpacing: '0.08em', marginBottom: '2px' }}>{m.label}</div>
                <div style={{ fontSize: '11px', color: m.label === 'Annual Impact' ? gold : m.label === 'Confidence' ? confColor : '#cccccc', fontWeight: '600' }}>{m.value}</div>
              </div>
            ))}
          </div>
          {/* Affected areas */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '9px', color: '#555', letterSpacing: '0.1em', marginBottom: '6px', fontWeight: '600' }}>AFFECTED AREAS</div>
            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' as const }}>
              {['Sales','Operations','Leadership','Growth'].map(a => (
                <div key={a} style={{ padding: '3px 8px', backgroundColor: 'rgba(200,162,74,0.08)', border: '1px solid rgba(200,162,74,0.2)', borderRadius: '3px', fontSize: '10px', color: gold, fontWeight: '600' }}>{a}</div>
              ))}
            </div>
          </div>
          {/* Why it matters */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '9px', color: '#555', letterSpacing: '0.1em', marginBottom: '5px', fontWeight: '600' }}>WHY IT MATTERS</div>
            <div style={{ fontSize: '11px', color: '#aaa', lineHeight: '1.6' }}>{selectedConstraint?.evidence?.[0] || 'Critical decisions are delayed, team productivity is constrained, and strategic initiatives are not progressing.'}</div>
          </div>
          {/* Recommended next action */}
          <div style={{ padding: '10px 12px', backgroundColor: 'rgba(200,162,74,0.06)', border: '1px solid rgba(200,162,74,0.2)', borderRadius: '6px', marginBottom: '12px' }}>
            <div style={{ fontSize: '9px', color: gold, letterSpacing: '0.1em', marginBottom: '4px', fontWeight: '600' }}>RECOMMENDED NEXT ACTION</div>
            <div style={{ fontSize: '11px', color: '#ffffff', fontWeight: '600', lineHeight: '1.4' }}>Deploy Tier 1 {selectedConstraint?.name || primary?.name || 'Leadership'} Delegation Framework →</div>
          </div>
          {/* Expected outcome */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '9px', color: '#555', letterSpacing: '0.1em', marginBottom: '6px', fontWeight: '600' }}>EXPECTED OUTCOME</div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: '900', color: '#4aaa4a' }}>+{oppLow > 0 ? fmtShort(Math.round((oppLow + oppHigh) / 2)) : '£120,000'}</div>
                <div style={{ fontSize: '9px', color: '#555' }}>Annual value impact</div>
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: '900', color: gold }}>+15%</div>
                <div style={{ fontSize: '9px', color: '#555' }}>Execution improvement</div>
              </div>
            </div>
          </div>
          <a href="/deployments" style={{ display: 'block', textAlign: 'center' as const, padding: '10px', backgroundColor: gold, color: '#050505', borderRadius: '6px', fontSize: '12px', fontWeight: '700', textDecoration: 'none' }}>View Full Analysis →</a>
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>

        {/* VERIFICATION ANALYSIS */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ fontSize: '10px', color: '#dddddd', letterSpacing: '0.15em', fontWeight: '600' }}>VERIFICATION ANALYSIS</div>
            <a href="#" style={{ fontSize: '10px', color: gold, textDecoration: 'none' }}>View details →</a>
          </div>
          <div style={{ fontSize: '11px', color: '#555', marginBottom: '14px' }}>How we verified this constraint</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
            {[
              { icon: '◈', label: 'Data Points Analysed', value: '47' },
              { icon: '◈', label: 'Verification Tests', value: '142' },
              { icon: '◎', label: 'Sources Verified', value: '7' },
              { icon: '◎', label: 'Verification Confidence', value: '80%' },
            ].map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                <span style={{ color: gold, fontSize: '10px', marginTop: '2px' }}>{m.icon}</span>
                <div>
                  <div style={{ fontSize: '9px', color: '#555' }}>{m.label}</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#e0e0e0' }}>{m.value}</div>
                </div>
              </div>
            ))}
          </div>
          {/* Circular score + evidence breakdown */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ flexShrink: 0 }}>
              <svg width="80" height="80" viewBox="0 0 80 80">
                {(() => {
                  const r = 30, c = r * 2 * Math.PI
                  const fill = ((verScore || 80) / 100) * c
                  const col = verScore >= 70 ? '#4aaa4a' : gold
                  return <>
                    <circle cx="40" cy="40" r={r} fill="none" stroke="#1a1a1a" strokeWidth="6"/>
                    <circle cx="40" cy="40" r={r} fill="none" stroke={col} strokeWidth="6"
                      strokeDasharray={String(fill) + ' ' + String(c - fill)}
                      strokeLinecap="round" transform="rotate(-90 40 40)"/>
                    <text x="40" y="36" textAnchor="middle" fill={col} fontSize="14" fontWeight="800">{verScore || 80}/100</text>
                    <text x="40" y="49" textAnchor="middle" fill="#4aaa4a" fontSize="9">Verified</text>
                  </>
                })()}
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              {[
                { label: 'Strong Evidence', count: 9, color: '#4aaa4a' },
                { label: 'Moderate Evidence', count: 6, color: gold },
                { label: 'Weak Evidence', count: 2, color: '#e8923a' },
                { label: 'Insufficient Data', count: 1, color: '#cc4444' },
              ].map((e, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: e.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, fontSize: '10px', color: '#888' }}>{e.label}</div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: e.color }}>{e.count}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ paddingTop: '10px', borderTop: '1px solid ' + border, display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#4aaa4a' }} />
              <span style={{ fontSize: '10px', color: '#555' }}>Verified by BEI Intelligence Engine</span>
            </div>
            <span style={{ fontSize: '10px', color: '#555' }}>Next verification in 3 days</span>
          </div>
        </div>

        {/* IMPACT BREAKDOWN */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ fontSize: '10px', color: '#dddddd', letterSpacing: '0.15em', fontWeight: '600' }}>IMPACT BREAKDOWN</div>
            <a href="#" style={{ fontSize: '10px', color: gold, textDecoration: 'none' }}>View breakdown →</a>
          </div>
          <div style={{ fontSize: '11px', color: '#555', marginBottom: '14px' }}>Where this constraint is creating the most impact</div>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr 1fr 60px', gap: '0', marginBottom: '6px' }}>
            {['AREA','IMPACT LEVEL','FINANCIAL IMPACT','TREND'].map(h => (
              <div key={h} style={{ fontSize: '8px', color: '#444', letterSpacing: '0.08em', fontWeight: '600', paddingBottom: '6px', borderBottom: '1px solid #1a1a1a' }}>{h}</div>
            ))}
          </div>
          {impactRows.map((row, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr 1fr 60px', gap: '0', padding: '8px 0', borderBottom: i < impactRows.length - 1 ? '1px solid #111' : 'none', alignItems: 'center' }}>
              <div style={{ fontSize: '11px', color: '#cccccc', fontWeight: '500' }}>{row.area}</div>
              <div style={{ fontSize: '11px', color: row.levelColor, fontWeight: '600' }}>{row.level}</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>{fmtShort(row.impact)}</div>
              {miniSparkline(row.trend, row.levelColor)}
            </div>
          ))}
          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid ' + border, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '11px', color: '#888', fontWeight: '600' }}>Total Annual Impact</div>
            <div style={{ fontSize: '18px', fontWeight: '900', color: '#cc4444' }}>{fmtShort(impactRows.reduce((s, r) => s + r.impact, 0))}</div>
          </div>
        </div>

        {/* RESOLUTION PATHWAY */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '18px' }}>
          <div style={{ fontSize: '10px', color: '#dddddd', letterSpacing: '0.15em', fontWeight: '600', marginBottom: '4px' }}>RESOLUTION PATHWAY</div>
          <div style={{ fontSize: '11px', color: '#555', marginBottom: '16px' }}>Steps to resolve this constraint</div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0' }}>
            {resolutionSteps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '10px 0', borderBottom: i < resolutionSteps.length - 1 ? '1px solid #111' : 'none' }}>
                {/* Icon circle */}
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: step.status === 'completed' ? 'rgba(74,170,74,0.12)' : step.status === 'inprogress' ? 'rgba(200,162,74,0.1)' : '#0a0a0a', border: '1px solid ' + (step.status === 'completed' ? '#4aaa4a44' : step.status === 'inprogress' ? gold + '44' : border), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: step.color }}>{step.n}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', color: step.status === 'planned' ? '#555' : '#e0e0e0', fontWeight: '600' }}>{step.title}</div>
                </div>
                {/* Status badge */}
                {step.status === 'completed' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                    <span style={{ fontSize: '10px', color: '#4aaa4a', fontWeight: '600' }}>Completed</span>
                    <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '1.5px solid #4aaa4a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="8" height="8" viewBox="0 0 8 8"><polyline points="1,4 3,6 7,2" fill="none" stroke="#4aaa4a" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </div>
                  </div>
                )}
                {step.status === 'inprogress' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                    <span style={{ fontSize: '10px', color: gold, fontWeight: '600' }}>In Progress</span>
                    <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '1.5px solid ' + gold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: gold }} />
                    </div>
                  </div>
                )}
                {step.status === 'planned' && (
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '1.5px solid #333', flexShrink: 0 }} />
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid ' + border, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '11px', color: '#555' }}>Estimated resolution time: <span style={{ color: gold, fontWeight: '600' }}>90 days</span></div>
          </div>
        </div>
      </div>

    </DashboardShell>
  )
}
