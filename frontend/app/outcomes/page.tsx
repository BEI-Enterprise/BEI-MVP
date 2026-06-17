'use client'

import { useEffect, useState } from 'react'

export default function OutcomesPage() {
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
        const supabase = createClient()
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
    { label: 'Opportunities', href: '/opportunities' },
    { label: 'Deployments', href: '/deployments' },
    { label: 'Outcomes', href: '/outcomes', active: true },
  ]

  if (loading) return <main style={{backgroundColor:'#050505',minHeight:'100vh'}}></main>

  if (!result) return (
    <main style={{backgroundColor:'#050505',color:'#fff',fontFamily:'Inter,system-ui,sans-serif',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <a href="/book" style={{padding:'14px 32px',backgroundColor:'#C8A24A',color:'#050505',fontWeight:'700',borderRadius:'4px',textDecoration:'none'}}>Start Your MRI</a>
    </main>
  )

  const primary = result.primary_constraint
  const confidence = result.confidence || 'low'
  const version = confidence === 'high' ? 'BEI MRI v1.1 — Verified Analysis' : 'BEI MRI v1.0 — Rules-Based Analysis'

  // Build outcome tracking items from primary and secondary constraints
  const allConstraints = [primary, ...(result.secondary_constraints || [])].filter(Boolean)

  const metricsMap: Record<string, { metric: string, unit: string, timeframe: string }[]> = {
    trust_infrastructure_deficit: [
      { metric: 'Google Review Count', unit: 'reviews', timeframe: '90 days' },
      { metric: 'Google Rating', unit: 'stars', timeframe: '90 days' },
      { metric: 'Enquiry Conversion Rate', unit: '%', timeframe: '90 days' },
    ],
    lead_response_deficit: [
      { metric: 'Average Lead Response Time', unit: 'hours', timeframe: '30 days' },
      { metric: 'Lead to Client Conversion Rate', unit: '%', timeframe: '90 days' },
    ],
    founder_dependency: [
      { metric: 'Founder Hours Per Week', unit: 'hours', timeframe: '60 days' },
      { metric: 'Decisions Without Founder', unit: '%', timeframe: '90 days' },
    ],
    capacity_constraint: [
      { metric: 'Team Utilisation', unit: '%', timeframe: '60 days' },
      { metric: 'Revenue Per Team Member', unit: 'GBP', timeframe: '90 days' },
    ],
    offer_weakness: [
      { metric: 'Offer Page Conversion Rate', unit: '%', timeframe: '60 days' },
      { metric: 'Organic Traffic', unit: 'visits', timeframe: '90 days' },
    ],
    pricing_constraint: [
      { metric: 'Average Deal Value', unit: 'GBP', timeframe: '90 days' },
      { metric: 'Gross Margin', unit: '%', timeframe: '90 days' },
    ],
    revenue_concentration_risk: [
      { metric: 'Top Client Revenue Percentage', unit: '%', timeframe: '180 days' },
      { metric: 'Active Client Count', unit: 'clients', timeframe: '180 days' },
    ],
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
        <div style={{fontSize:'24px',fontWeight:'700',marginBottom:'4px'}}>Outcome Centre</div>
        <div style={{fontSize:'14px',color:'#555',marginBottom:'40px'}}>Track what is improving after deployment</div>

        {/* Status banner */}
        <div style={{padding:'20px 24px',border:'1px solid #2a2a2a',borderRadius:'8px',backgroundColor:'#080808',marginBottom:'32px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <div style={{fontSize:'14px',fontWeight:'600',marginBottom:'4px'}}>Outcome Tracking Active</div>
            <div style={{fontSize:'13px',color:'#555'}}>Measurements will be recorded as deployments are executed and time passes.</div>
          </div>
          <div style={{padding:'6px 14px',borderRadius:'4px',fontSize:'11px',color:'#C8A24A',backgroundColor:'#2a1a00',border:'1px solid #C8A24A'}}>
            Pending Deployment
          </div>
        </div>

        {/* Measurement plan per constraint */}
        <div style={{fontSize:'16px',fontWeight:'600',marginBottom:'20px'}}>Measurement Plans</div>
        <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
          {allConstraints.slice(0, 3).map((c: any, idx: number) => {
            const metrics = metricsMap[c.key] || []
            if (metrics.length === 0) return null
            return (
              <div key={c.key} style={{padding:'24px',border:'1px solid #1a1a1a',borderRadius:'8px',backgroundColor:'#080808'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'16px'}}>
                  <div>
                    {idx === 0 && <div style={{fontSize:'10px',color:'#C8A24A',letterSpacing:'0.12em',marginBottom:'4px'}}>PRIMARY CONSTRAINT</div>}
                    <div style={{fontSize:'15px',fontWeight:'600'}}>{c.name}</div>
                  </div>
                  <div style={{fontSize:'11px',color:'#555',padding:'4px 10px',border:'1px solid #1a1a1a',borderRadius:'3px'}}>Awaiting baseline</div>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                  {metrics.map((m, mi) => (
                    <div key={mi} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 14px',backgroundColor:'#0a0a0a',borderRadius:'4px',border:'1px solid #111'}}>
                      <div>
                        <div style={{fontSize:'13px',color:'#888'}}>{m.metric}</div>
                        <div style={{fontSize:'11px',color:'#444',marginTop:'2px'}}>Measure in: {m.timeframe}</div>
                      </div>
                      <div style={{display:'flex',gap:'24px',fontSize:'12px',color:'#333'}}>
                        <div style={{textAlign:'center'}}>
                          <div style={{color:'#444',marginBottom:'2px'}}>Baseline</div>
                          <div>—</div>
                        </div>
                        <div style={{textAlign:'center'}}>
                          <div style={{color:'#444',marginBottom:'2px'}}>Expected</div>
                          <div>—</div>
                        </div>
                        <div style={{textAlign:'center'}}>
                          <div style={{color:'#444',marginBottom:'2px'}}>Actual</div>
                          <div>—</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div style={{marginTop:'32px',padding:'20px 24px',border:'1px solid #1a1a1a',borderRadius:'6px',backgroundColor:'#080808'}}>
          <div style={{fontSize:'13px',fontWeight:'600',marginBottom:'8px',color:'#888'}}>How Outcome Tracking Works</div>
          <div style={{fontSize:'12px',color:'#555',lineHeight:'1.8'}}>
            When a deployment is executed BEI records a baseline measurement for each metric. At the end of the measurement timeframe BEI records the actual result and calculates whether the deployment exceeded, met, partially met or did not meet expectations. Every outcome feeds the BEI Learning Engine to improve future intelligence accuracy.
          </div>
          <div style={{marginTop:'16px',fontSize:'11px',color:'#333'}}>
            Golden Rule 12: Every Deployment Must Be Measurable. · Golden Rule 7: Learning From Outcomes.
          </div>
        </div>
      </div>
    </main>
  )
}
