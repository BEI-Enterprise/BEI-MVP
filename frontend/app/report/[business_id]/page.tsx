'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ReportPage() {
  const params = useParams()
  const businessId = params.business_id as string
  const [business, setBusiness] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error: err } = await supabase
          .from('businesses')
          .select('*')
          .eq('id', businessId)
          .single()
        if (err || !data) throw new Error('Report not found')
        setBusiness(data)
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load report')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [businessId])

  if (loading) return (
    <main style={{backgroundColor:'#050505',color:'#ffffff',fontFamily:'Inter,system-ui,sans-serif',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <p style={{color:'#888888'}}>Loading your MRI report...</p>
    </main>
  )

  if (error) return (
    <main style={{backgroundColor:'#050505',color:'#ffffff',fontFamily:'Inter,system-ui,sans-serif',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <p style={{color:'#ff6b6b'}}>{error}</p>
    </main>
  )

  const meta = (business?.metadata || {}) as Record<string, unknown>
  const constraints = (meta.constraints || []) as {type: string, severity: number, evidence: string}[]
  const primaryConstraint = meta.primary_constraint as string || 'Unknown'
  const opportunityValue = meta.opportunity_value as number || 0
  const healthScore = meta.health_score as number || business?.health_score as number || 0

  const card: React.CSSProperties = {backgroundColor:'#111111',border:'1px solid #1a1a1a',borderRadius:'12px',padding:'32px',marginBottom:'24px'}
  const label: React.CSSProperties = {fontSize:'11px',fontWeight:'700',letterSpacing:'0.15em',color:'#C8A24A',textTransform:'uppercase',marginBottom:'12px',display:'block'}

  return (
    <main style={{backgroundColor:'#050505',color:'#ffffff',fontFamily:'Inter,system-ui,sans-serif',minHeight:'100vh'}}>
      <nav style={{padding:'20px 48px',display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'1px solid #1a1a1a'}}>
        <a href="/" style={{fontSize:'20px',fontWeight:'700',color:'#C8A24A',textDecoration:'none'}}>BEI</a>
        <div style={{fontSize:'12px',color:'#555555'}}>BEI MRI v1.0 — Rules-Based Analysis</div>
      </nav>

      <section style={{padding:'60px 48px',maxWidth:'900px',margin:'0 auto'}}>

        <div style={{marginBottom:'48px'}}>
          <div style={{fontSize:'12px',fontWeight:'600',letterSpacing:'0.2em',color:'#C8A24A',marginBottom:'12px',textTransform:'uppercase'}}>Business MRI Report</div>
          <h1 style={{fontSize:'36px',fontWeight:'700',marginBottom:'8px'}}>{business?.name as string}</h1>
          <p style={{fontSize:'15px',color:'#888888'}}>{business?.industry as string} · {business?.revenue_band as string}</p>
        </div>

        <div style={card}>
          <span style={label}>Business Health Score</span>
          <div style={{display:'flex',alignItems:'flex-end',gap:'16px',marginBottom:'16px'}}>
            <div style={{fontSize:'64px',fontWeight:'700',color:healthScore>=70?'#4aaa4a':healthScore>=50?'#C8A24A':'#ff6b6b',lineHeight:'1'}}>{healthScore}</div>
            <div style={{fontSize:'20px',color:'#555555',marginBottom:'8px'}}>/100</div>
          </div>
          <div style={{backgroundColor:'#1a1a1a',borderRadius:'4px',height:'8px',overflow:'hidden'}}>
            <div style={{height:'100%',width:healthScore+'%',backgroundColor:healthScore>=70?'#4aaa4a':healthScore>=50?'#C8A24A':'#ff6b6b',borderRadius:'4px'}}></div>
          </div>
        </div>

        <div style={card}>
          <span style={label}>Primary Constraint Identified</span>
          <h2 style={{fontSize:'28px',fontWeight:'700',color:'#C8A24A',marginBottom:'16px'}}>{primaryConstraint}</h2>
          <p style={{fontSize:'15px',color:'#888888',lineHeight:'1.6'}}>
            This is the highest-value root constraint limiting your business performance. Resolving this constraint should be your primary focus before addressing secondary issues.
          </p>
        </div>

        <div style={card}>
          <span style={label}>Opportunity Value</span>
          <div style={{fontSize:'48px',fontWeight:'700',color:'#ffffff',marginBottom:'8px'}}>
            £{opportunityValue.toLocaleString()}
          </div>
          <p style={{fontSize:'14px',color:'#888888'}}>Estimated annual value available when primary constraint is resolved.</p>
        </div>

        {constraints.length > 1 && (
          <div style={card}>
            <span style={label}>Secondary Constraints</span>
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {constraints.slice(1).map((c, i) => (
                <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 16px',backgroundColor:'#0a0a0a',borderRadius:'8px',border:'1px solid #1a1a1a'}}>
                  <span style={{fontSize:'14px',color:'#cccccc'}}>{c.type}</span>
                  <span style={{fontSize:'12px',color:'#C8A24A',fontWeight:'600'}}>Severity {c.severity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={card}>
          <span style={label}>Recommended Next Step</span>
          <p style={{fontSize:'16px',color:'#ffffff',lineHeight:'1.7'}}>
            Focus all available resource on resolving <strong style={{color:'#C8A24A'}}>{primaryConstraint}</strong>. This is the single highest-leverage action available to your business right now. Secondary constraints should not be addressed until the primary constraint is resolved or materially improved.
          </p>
        </div>

        <div style={{textAlign:'center',padding:'32px',borderTop:'1px solid #1a1a1a',marginTop:'16px'}}>
          <p style={{fontSize:'12px',color:'#333333'}}>BEI MRI v1.0 — Rules-Based Analysis · Generated {new Date().toLocaleDateString('en-GB')}</p>
        </div>

      </section>
    </main>
  )
}