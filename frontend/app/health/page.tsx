'use client'

import { useEffect, useState } from 'react'

export default function HealthPage() {
  const [result, setResult] = useState<Record<string, any> | null>(null)
  const [businessName, setBusinessName] = useState('Your Business')

  useEffect(() => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('bei_result_')) {
        const id = key.replace('bei_result_', '')
        const stored = localStorage.getItem(key)
        if (stored) setResult(JSON.parse(stored))
        const meta = localStorage.getItem('bei_meta_' + id)
        if (meta) setBusinessName(JSON.parse(meta).businessName || 'Your Business')
        break
      }
    }
  }, [])

  const nav = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Health', href: '/health', active: true },
    { label: 'Constraints', href: '/constraints' },
    { label: 'Opportunities', href: '/opportunities' },
    { label: 'Deployments', href: '/deployments' },
    { label: 'Outcomes', href: '/outcomes' },
  ]

  const pillarDescriptions: Record<string, string> = {
    growth: 'Revenue trend, lead volume and conversion rate. How well the business is growing.',
    operations: 'Team capacity, founder dependency and operational maturity. How well the business runs.',
    strategy: 'Pricing confidence, offer clarity and market position. How well the business is positioned.',
    risk: 'Revenue concentration, trust infrastructure, cash flow and key person risk. How exposed the business is.',
    context: 'Market growth, competition intensity and client retention. The environment the business operates in.',
  }

  if (!result) {
    return (
      <main style={{backgroundColor:'#050505',color:'#fff',fontFamily:'Inter,system-ui,sans-serif',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{textAlign:'center'}}>
          <p style={{color:'#666',marginBottom:'24px'}}>No MRI data found.</p>
          <a href="/book" style={{padding:'14px 32px',backgroundColor:'#C8A24A',color:'#050505',fontWeight:'700',borderRadius:'4px',textDecoration:'none',fontSize:'14px'}}>Start Your MRI</a>
        </div>
      </main>
    )
  }

  const health = result.health || {}
  const overall = health.overall || 0
  const band = health.band || 'unknown'
  const pillars = health.pillars || {}
  const industryBenchmark = health.industry_benchmark || 55
  const vsBenchmark = health.vs_benchmark || 'unknown'
  const healthColor = overall >= 70 ? '#4aaa4a' : overall >= 45 ? '#C8A24A' : '#cc4444'

  return (
    <main style={{backgroundColor:'#050505',color:'#fff',fontFamily:'Inter,system-ui,sans-serif',minHeight:'100vh'}}>
      <nav style={{padding:'0 48px',borderBottom:'1px solid #1a1a1a',display:'flex',justifyContent:'space-between',alignItems:'center',height:'60px'}}>
        <span style={{fontSize:'18px',fontWeight:'700',color:'#C8A24A',letterSpacing:'0.1em'}}>BEI</span>
        <div style={{display:'flex'}}>
          {nav.map(n => (
            <a key={n.href} href={n.href} style={{padding:'0 20px',height:'60px',display:'flex',alignItems:'center',fontSize:'13px',color:n.active?'#C8A24A':'#555',borderBottom:n.active?'2px solid #C8A24A':'2px solid transparent',textDecoration:'none'}}>{n.label}</a>
          ))}
        </div>
        <span style={{fontSize:'12px',color:'#333'}}>{businessName}</span>
      </nav>

      <div style={{maxWidth:'1100px',margin:'0 auto',padding:'40px 24px'}}>
        <div style={{fontSize:'24px',fontWeight:'700',marginBottom:'4px'}}>Business Health</div>
        <div style={{fontSize:'14px',color:'#555',marginBottom:'40px'}}>Five pillar assessment benchmarked against your industry</div>

        {/* Overall score */}
        <div style={{padding:'32px',border:'1px solid #1a1a1a',borderRadius:'8px',backgroundColor:'#080808',marginBottom:'32px',display:'flex',alignItems:'center',gap:'48px'}}>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:'72px',fontWeight:'700',color:healthColor,lineHeight:'1'}}>{overall}</div>
            <div style={{fontSize:'12px',color:'#555',marginTop:'8px'}}>Overall Score</div>
          </div>
          <div style={{flex:1}}>
            <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'12px'}}>
              <div style={{fontSize:'20px',fontWeight:'600',textTransform:'capitalize'}}>{band}</div>
              <div style={{padding:'4px 10px',borderRadius:'4px',fontSize:'11px',fontWeight:'600',
                color:vsBenchmark==='above'?'#4aaa4a':vsBenchmark==='below'?'#cc4444':'#C8A24A',
                backgroundColor:vsBenchmark==='above'?'#0a2a0a':vsBenchmark==='below'?'#2a0a0a':'#2a1a00',
                border:`1px solid ${vsBenchmark==='above'?'#4aaa4a':vsBenchmark==='below'?'#cc4444':'#C8A24A'}`
              }}>
                {vsBenchmark === 'above' ? '↑ Above' : vsBenchmark === 'below' ? '↓ Below' : '→ At'} Industry Benchmark ({industryBenchmark})
              </div>
            </div>
            <div style={{fontSize:'14px',color:'#666',lineHeight:'1.7'}}>
              {overall >= 70
                ? 'Your business is in strong health. Focus on maintaining this position while addressing any remaining constraints.'
                : overall >= 50
                ? 'Your business has solid foundations with clear areas for improvement. Addressing the primary constraint will have the most impact.'
                : overall >= 30
                ? 'Several areas of your business need focused attention. Prioritise the primary constraint before spreading effort.'
                : 'Your business health is critical. Immediate focus on the primary constraint is essential.'}
            </div>
          </div>
        </div>

        {/* Pillar breakdown */}
        <div style={{fontSize:'16px',fontWeight:'600',marginBottom:'20px'}}>Pillar Breakdown</div>
        <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
          {Object.entries(pillars).map(([name, data]: [string, any]) => {
            const pillarColor = data.score >= 70 ? '#4aaa4a' : data.score >= 45 ? '#C8A24A' : '#cc4444'
            const vsText = data.vs_benchmark === 'above' ? `↑ ${data.score - data.benchmark} above` : data.vs_benchmark === 'below' ? `↓ ${data.benchmark - data.score} below` : '→ at'
            return (
              <div key={name} style={{padding:'24px',border:'1px solid #1a1a1a',borderRadius:'8px',backgroundColor:'#080808'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'16px'}}>
                  <div>
                    <div style={{fontSize:'16px',fontWeight:'600',textTransform:'capitalize',marginBottom:'4px'}}>{name}</div>
                    <div style={{fontSize:'12px',color:'#555'}}>{pillarDescriptions[name] || ''}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:'28px',fontWeight:'700',color:pillarColor}}>{data.score}</div>
                    <div style={{fontSize:'11px',color:'#444',marginTop:'2px'}}>benchmark: {data.benchmark}</div>
                  </div>
                </div>
                <div style={{height:'8px',backgroundColor:'#111',borderRadius:'4px',overflow:'hidden',marginBottom:'8px'}}>
                  <div style={{width:data.score+'%',height:'100%',backgroundColor:pillarColor,borderRadius:'4px'}}/>
                </div>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <div style={{fontSize:'12px',color:pillarColor,fontWeight:'600',textTransform:'capitalize'}}>{data.band}</div>
                  <div style={{fontSize:'12px',color:data.vs_benchmark==='above'?'#4aaa4a':data.vs_benchmark==='below'?'#cc4444':'#888'}}>
                    {vsText} industry benchmark
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{marginTop:'32px',padding:'20px',border:'1px solid #1a1a1a',borderRadius:'6px',backgroundColor:'#080808'}}>
          <div style={{fontSize:'12px',color:'#444',lineHeight:'1.8'}}>
            <strong style={{color:'#555'}}>About this assessment:</strong> Health scores are calculated using BEI Intelligence v1.0 and benchmarked against industry averages for your sector. Scores reflect your intake responses and will improve in accuracy as connector data is added. Health provides visibility — it does not make decisions.
          </div>
        </div>
      </div>
    </main>
  )
}
