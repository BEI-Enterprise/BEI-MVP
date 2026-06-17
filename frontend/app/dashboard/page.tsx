'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [result, setResult] = useState<Record<string, any> | null>(null)
  const [businessName, setBusinessName] = useState('Your Business')
  const [businessId, setBusinessId] = useState('')

  useEffect(() => {
    // Find most recent result in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('bei_result_')) {
        const id = key.replace('bei_result_', '')
        setBusinessId(id)
        const stored = localStorage.getItem(key)
        if (stored) setResult(JSON.parse(stored))
        const meta = localStorage.getItem('bei_meta_' + id)
        if (meta) setBusinessName(JSON.parse(meta).businessName || 'Your Business')
        break
      }
    }
  }, [])

  if (!result) {
    return (
      <main style={{backgroundColor:'#050505',color:'#fff',fontFamily:'Inter,system-ui,sans-serif',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:'20px',fontWeight:'700',color:'#C8A24A',marginBottom:'16px'}}>BEI</div>
          <p style={{color:'#666',marginBottom:'24px'}}>No MRI report found. Complete your Business MRI first.</p>
          <a href="/book" style={{padding:'14px 32px',backgroundColor:'#C8A24A',color:'#050505',fontWeight:'700',borderRadius:'4px',textDecoration:'none',fontSize:'14px'}}>Start Your MRI</a>
        </div>
      </main>
    )
  }

  const health = result.health || {}
  const overall = health.overall || 0
  const band = health.band || 'unknown'
  const vsBenchmark = health.vs_benchmark || 'unknown'
  const pillars = health.pillars || {}
  const primary = result.primary_constraint
  const secondary = result.secondary_constraints || []
  const totalOpp = result.total_opportunity || {}
  const confidence = result.confidence || 'low'
  const recommendedFocus = result.recommended_focus || ''

  const healthColor = overall >= 70 ? '#4aaa4a' : overall >= 45 ? '#C8A24A' : '#cc4444'
  const bandColors: Record<string, string> = {
    exceptional: '#4aaa4a', strong: '#4aaa4a', moderate: '#C8A24A',
    weak: '#cc4444', critical: '#cc4444'
  }

  const nav = [
    { label: 'Dashboard', href: '/dashboard', active: true },
    { label: 'Health', href: '/health' },
    { label: 'Constraints', href: '/constraints' },
    { label: 'Opportunities', href: '/opportunities' },
    { label: 'Deployments', href: '/deployments' },
    { label: 'Outcomes', href: '/outcomes' },
  ]

  const s = {
    page: { backgroundColor: '#050505', color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', minHeight: '100vh' },
    nav: { padding: '0 48px', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px' },
    navLinks: { display: 'flex', gap: '0' },
    navLink: (active: boolean) => ({
      padding: '0 20px', height: '60px', display: 'flex', alignItems: 'center',
      fontSize: '13px', color: active ? '#C8A24A' : '#555',
      borderBottom: active ? '2px solid #C8A24A' : '2px solid transparent',
      textDecoration: 'none', cursor: 'pointer',
    }),
    inner: { maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' },
    greeting: { fontSize: '24px', fontWeight: '700', marginBottom: '4px' },
    sub: { fontSize: '14px', color: '#555', marginBottom: '40px' },
    grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '32px' },
    card: { padding: '24px', border: '1px solid #1a1a1a', borderRadius: '8px', backgroundColor: '#080808' },
    cardLabel: { fontSize: '11px', color: '#444', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: '12px' },
    bigNum: (color: string) => ({ fontSize: '48px', fontWeight: '700', color, lineHeight: '1' }),
    cardSub: { fontSize: '13px', color: '#555', marginTop: '8px' },
    section: { marginBottom: '32px' },
    sectionTitle: { fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: '#fff' },
    primaryCard: { padding: '28px', border: '1px solid #2a2a2a', borderRadius: '8px', backgroundColor: '#080808', marginBottom: '20px' },
    badge: (color: string, bg: string) => ({
      display: 'inline-block', padding: '4px 10px', borderRadius: '4px',
      fontSize: '11px', fontWeight: '600', color, backgroundColor: bg,
      border: `1px solid ${color}`, marginBottom: '12px',
    }),
    pillarsGrid: { display: 'flex', flexDirection: 'column' as const, gap: '10px' },
    pillarRow: { display: 'flex', alignItems: 'center', gap: '12px' },
    actionCard: { padding: '16px 20px', border: '1px solid #1a1a1a', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', textDecoration: 'none' as const, cursor: 'pointer' as const },
  }

  return (
    <main style={s.page}>
      <nav style={s.nav}>
        <span style={{fontSize:'18px',fontWeight:'700',color:'#C8A24A',letterSpacing:'0.1em'}}>BEI</span>
        <div style={s.navLinks}>
          {nav.map(n => (
            <a key={n.href} href={n.href} style={s.navLink(!!n.active)}>{n.label}</a>
          ))}
        </div>
        <span style={{fontSize:'12px',color:'#333'}}>{businessName}</span>
      </nav>

      <div style={s.inner}>
        <div style={s.greeting}>Good morning, {businessName}</div>
        <div style={s.sub}>Business Intelligence Dashboard · Last updated today · {confidence.toUpperCase()} confidence</div>

        {/* Top stats */}
        <div style={s.grid3}>
          <div style={s.card}>
            <div style={s.cardLabel}>Business Health</div>
            <div style={s.bigNum(healthColor)}>{overall}</div>
            <div style={s.cardSub}>{band.charAt(0).toUpperCase() + band.slice(1)} · {vsBenchmark} industry benchmark</div>
          </div>
          <div style={s.card}>
            <div style={s.cardLabel}>Total Opportunity</div>
            <div style={s.bigNum('#C8A24A')}>£{Math.round((totalOpp.total_low || 0) / 1000)}k–{Math.round((totalOpp.total_high || 0) / 1000)}k</div>
            <div style={s.cardSub}>Annual value available to recover</div>
          </div>
          <div style={s.card}>
            <div style={s.cardLabel}>Constraints Identified</div>
            <div style={s.bigNum('#ffffff')}>{result.verified_count || 0}</div>
            <div style={s.cardSub}>{result.detected_count || 0} detected · {result.verified_count || 0} verified</div>
          </div>
        </div>

        {/* Primary Constraint */}
        {primary && (
          <div style={s.section}>
            <div style={s.sectionTitle}>Primary Constraint</div>
            <div style={s.primaryCard}>
              <div style={s.badge(
                primary.severity === 'high' ? '#cc4444' : '#C8A24A',
                primary.severity === 'high' ? '#2a0a0a' : '#2a1a00'
              )}>
                {primary.severity?.toUpperCase()} PRIORITY
              </div>
              <div style={{fontSize:'22px',fontWeight:'700',marginBottom:'8px'}}>{primary.name}</div>
              <div style={{fontSize:'14px',color:'#777',marginBottom:'16px',fontStyle:'italic'}}>{primary.hypothesis}</div>
              <div style={{fontSize:'13px',color:'#888',marginBottom:'16px',lineHeight:'1.7'}}>{recommendedFocus}</div>
              <div style={{display:'flex',gap:'32px'}}>
                <div>
                  <div style={{fontSize:'11px',color:'#444',marginBottom:'4px'}}>OPPORTUNITY</div>
                  <div style={{fontSize:'18px',fontWeight:'700',color:'#C8A24A'}}>
                    £{(primary.opportunity?.value_low || 0).toLocaleString()} — £{(primary.opportunity?.value_high || 0).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{fontSize:'11px',color:'#444',marginBottom:'4px'}}>VERIFICATION</div>
                  <div style={{fontSize:'18px',fontWeight:'700',color:'#4aaa4a'}}>{primary.verification_score}/100</div>
                </div>
                <div>
                  <div style={{fontSize:'11px',color:'#444',marginBottom:'4px'}}>TESTS PASSED</div>
                  <div style={{fontSize:'18px',fontWeight:'700',color:'#fff'}}>{primary.tests_passed}/{primary.total_tests}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Health Pillars */}
        <div style={s.section}>
          <div style={s.sectionTitle}>Business Health Pillars</div>
          <div style={s.pillarsGrid}>
            {Object.entries(pillars).map(([name, data]: [string, any]) => (
              <div key={name} style={s.pillarRow}>
                <div style={{width:'100px',fontSize:'13px',color:'#888',textTransform:'capitalize'}}>{name}</div>
                <div style={{flex:1,height:'6px',backgroundColor:'#111',borderRadius:'3px',overflow:'hidden'}}>
                  <div style={{width:data.score+'%',height:'100%',backgroundColor:data.score>=70?'#4aaa4a':data.score>=45?'#C8A24A':'#cc4444',borderRadius:'3px'}}/>
                </div>
                <div style={{width:'36px',fontSize:'13px',color:'#666',textAlign:'right'}}>{data.score}</div>
                <div style={{width:'80px',fontSize:'11px',color:bandColors[data.band] || '#888'}}>{data.band}</div>
                <div style={{width:'100px',fontSize:'11px',color:'#444'}}>
                  {data.vs_benchmark === 'above' ? '↑ above' : data.vs_benchmark === 'below' ? '↓ below' : '→ at'} benchmark
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div style={s.section}>
          <div style={s.sectionTitle}>Quick Navigation</div>
          {[
            { label: 'View full constraint analysis', sub: 'Verification details, network map, root causes', href: '/constraints' },
            { label: 'See all opportunities', sub: 'Revenue, profit, capacity and risk opportunities', href: '/opportunities' },
            { label: 'Review deployment actions', sub: 'Automatic actions, approval queue, recommendations', href: '/deployments' },
            { label: 'Track outcomes', sub: 'Measure what is improving', href: '/outcomes' },
          ].map(action => (
            <a key={action.href} href={action.href} style={{...s.actionCard, color:'inherit'}}>
              <div>
                <div style={{fontSize:'14px',fontWeight:'600',marginBottom:'3px'}}>{action.label}</div>
                <div style={{fontSize:'12px',color:'#555'}}>{action.sub}</div>
              </div>
              <div style={{color:'#C8A24A',fontSize:'18px'}}>→</div>
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}
