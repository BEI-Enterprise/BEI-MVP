'use client'

import { useEffect, useState } from 'react'

export default function OpportunitiesPage() {
  const [result, setResult] = useState<Record<string, any> | null>(null)
  const [loading, setLoading] = useState(true)
  const [businessName, setBusinessName] = useState('Your Business')

  useEffect(() => {
    const load = async () => {
      try {
        const { createClient } = await import('@supabase/supabase-js')
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        const { data } = await supabase
          .from('businesses')
          .select('id, business_name, mri_result')
          .eq('status', 'mri_complete')
          .order('updated_at', { ascending: false })
          .limit(1)
          .single()
        if (data) {
          setBusinessName(data.business_name || 'Your Business')
          if (data.mri_result) setResult(data.mri_result)
        }
      } catch (e) {}
      setLoading(false)
    }
    load()
  }, [])

  const nav = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Health', href: '/health' },
    { label: 'Constraints', href: '/constraints' },
    { label: 'Opportunities', href: '/opportunities', active: true },
    { label: 'Deployments', href: '/deployments' },
    { label: 'Outcomes', href: '/outcomes' },
  ]

  if (loading) return <main style={{backgroundColor:'#050505',minHeight:'100vh'}}></main>

  if (!result) return (
    <main style={{backgroundColor:'#050505',color:'#fff',fontFamily:'Inter,system-ui,sans-serif',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <a href="/book" style={{padding:'14px 32px',backgroundColor:'#C8A24A',color:'#050505',fontWeight:'700',borderRadius:'4px',textDecoration:'none'}}>Start Your MRI</a>
    </main>
  )

  const primary = result.primary_constraint
  const secondary = result.secondary_constraints || []
  const total = result.total_opportunity || {}
  const allConstraints = [primary, ...secondary].filter(Boolean)

  const dimensionLabels: Record<string, string> = {
    revenue: 'Revenue Opportunity',
    profit: 'Profit Opportunity',
    capacity: 'Capacity Opportunity',
    risk_reduction: 'Risk Reduction',
    enterprise_value: 'Enterprise Value',
  }

  const dimensionColors: Record<string, string> = {
    revenue: '#C8A24A', profit: '#4aaa4a', capacity: '#6ab0d4',
    risk_reduction: '#a06ab0', enterprise_value: '#d46a6a',
  }

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
        <div style={{fontSize:'24px',fontWeight:'700',marginBottom:'4px'}}>Opportunity Centre</div>
        <div style={{fontSize:'14px',color:'#555',marginBottom:'40px'}}>Quantified value available from resolving each verified constraint</div>

        {/* Total opportunity */}
        <div style={{padding:'32px',border:'1px solid #2a2a2a',borderRadius:'8px',backgroundColor:'#080808',marginBottom:'32px',display:'flex',gap:'48px',alignItems:'center'}}>
          <div>
            <div style={{fontSize:'11px',color:'#444',letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:'8px'}}>Total Opportunity Range</div>
            <div style={{fontSize:'40px',fontWeight:'700',color:'#C8A24A'}}>
              £{Math.round((total.total_low||0)/1000)}k — £{Math.round((total.total_high||0)/1000)}k
            </div>
            <div style={{fontSize:'13px',color:'#555',marginTop:'6px'}}>Annual value available to recover or unlock</div>
          </div>
          <div style={{flex:1,borderLeft:'1px solid #1a1a1a',paddingLeft:'48px'}}>
            <div style={{fontSize:'13px',color:'#666',lineHeight:'1.8'}}>{total.note}</div>
          </div>
        </div>

        {/* Per constraint */}
        <div style={{fontSize:'16px',fontWeight:'600',marginBottom:'20px'}}>Opportunity By Constraint</div>
        <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
          {allConstraints.map((c: any, idx: number) => {
            const opp = c.opportunity || {}
            const dim = opp.dimension || 'revenue'
            const color = dimensionColors[dim] || '#C8A24A'
            return (
              <div key={c.key} style={{padding:'24px',border:'1px solid #1a1a1a',borderRadius:'8px',backgroundColor:'#080808'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'16px'}}>
                  <div>
                    {idx === 0 && <div style={{fontSize:'10px',color:'#C8A24A',letterSpacing:'0.15em',marginBottom:'6px'}}>PRIMARY CONSTRAINT</div>}
                    <div style={{fontSize:'16px',fontWeight:'600',marginBottom:'4px'}}>{c.name}</div>
                    <div style={{display:'inline-block',padding:'2px 8px',borderRadius:'3px',fontSize:'11px',color,backgroundColor:'#0a0a0a',border:`1px solid ${color}`}}>
                      {dimensionLabels[dim] || dim}
                    </div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:'24px',fontWeight:'700',color}}>
                      £{(opp.value_low||0).toLocaleString()} — £{(opp.value_high||0).toLocaleString()}
                    </div>
                    <div style={{fontSize:'11px',color:'#444',marginTop:'4px'}}>Confidence: {opp.confidence || 'indicative'}</div>
                  </div>
                </div>
                <div style={{fontSize:'12px',color:'#555',lineHeight:'1.7'}}>{opp.explanation}</div>
              </div>
            )
          })}
        </div>

        <div style={{marginTop:'32px',padding:'16px 20px',border:'1px solid #111',borderRadius:'6px',backgroundColor:'#080808'}}>
          <div style={{fontSize:'11px',color:'#333',lineHeight:'1.8'}}>
            <strong style={{color:'#444'}}>Golden Rule 5:</strong> Opportunity Before Deployment. All opportunity values are indicative estimates based on rules-based analysis of your intake responses. Actual impact will vary. Confidence will improve as connector data is added and outcomes are measured.
          </div>
        </div>
      </div>
    </main>
  )
}
