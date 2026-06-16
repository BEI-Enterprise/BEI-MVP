'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const stages = [
  'Reading business profile',
  'Analysing Growth indicators',
  'Analysing Operations indicators',
  'Analysing Strategy indicators',
  'Analysing Risk indicators',
  'Analysing Context indicators',
  'Running constraint detection',
  'Calculating business health scores',
  'Identifying primary constraint',
  'Generating MRI report',
]

function detectConstraints(metadata: Record<string, string>, industry: string) {
  const constraints: {type: string, severity: number, evidence: string}[] = []

  if (metadata.founder_dependency === 'Fully dependent' || metadata.founder_dependency === 'Heavily dependent') {
    constraints.push({ type: 'Founder Dependency', severity: 85, evidence: metadata.founder_dependency })
  }
  if (metadata.trust_infrastructure === 'None' || metadata.trust_infrastructure === 'Very little') {
    constraints.push({ type: 'Trust Infrastructure Deficit', severity: 80, evidence: metadata.trust_infrastructure })
  }
  if (metadata.conversion_rate === 'Under 10%' || metadata.conversion_rate === '10-20%') {
    constraints.push({ type: 'Lead Response Deficit', severity: 75, evidence: metadata.conversion_rate })
  }
  if (metadata.pricing_confidence === 'Not confident' || metadata.pricing_confidence === 'Slightly confident') {
    constraints.push({ type: 'Pricing Constraint', severity: 75, evidence: metadata.pricing_confidence })
  }
  if (metadata.capacity_utilisation === 'Over 95%') {
    constraints.push({ type: 'Capacity Constraint', severity: 80, evidence: metadata.capacity_utilisation })
  }
  if (metadata.revenue_concentration === 'Over 80%' || metadata.revenue_concentration === '60-80%') {
    constraints.push({ type: 'Revenue Concentration Risk', severity: 70, evidence: metadata.revenue_concentration })
  }
  if (metadata.offer_clarity === 'Very unclear' || metadata.offer_clarity === 'Unclear') {
    constraints.push({ type: 'Offer Weakness', severity: 72, evidence: metadata.offer_clarity })
  }

  if (constraints.length === 0) {
    constraints.push({ type: 'Capacity Constraint', severity: 60, evidence: 'General operational review' })
  }

  constraints.sort((a, b) => b.severity - a.severity)
  return constraints
}

function calculateHealthScore(metadata: Record<string, string>) {
  let score = 70
  if (metadata.revenue_trend === 'Growing fast') score += 10
  if (metadata.revenue_trend === 'Declining fast') score -= 15
  if (metadata.capacity_utilisation === 'Over 95%') score -= 10
  if (metadata.trust_infrastructure === 'Extensive') score += 8
  if (metadata.client_retention === 'Over 90%') score += 8
  if (metadata.founder_dependency === 'Fully dependent') score -= 12
  return Math.min(100, Math.max(0, score))
}

export default function ProcessingPage() {
  const router = useRouter()
  const params = useParams()
  const businessId = params.business_id as string
  const [stage, setStage] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    const run = async () => {
      try {
        const { data: business, error: fetchError } = await supabase
          .from('businesses')
          .select('*')
          .eq('id', businessId)
          .single()

        if (fetchError || !business) throw new Error('Business not found')

        const metadata = business.metadata || {}
        const industry = business.industry || ''

        for (let i = 0; i < stages.length; i++) {
          setStage(i)
          await new Promise(r => setTimeout(r, 600))
        }

        const constraints = detectConstraints(metadata, industry)
        const healthScore = calculateHealthScore(metadata)
        const primaryConstraint = constraints[0]

        const opportunityValue = Math.round((primaryConstraint.severity / 100) * (
          business.revenue_band?.includes('£1M') ? 150000 :
          business.revenue_band?.includes('£3M') ? 400000 :
          business.revenue_band?.includes('£500k') ? 75000 : 40000
        ))

        await supabase.from('businesses').update({
          status: 'report_ready',
          health_score: healthScore,
          metadata: {
            ...metadata,
            constraints,
            primary_constraint: primaryConstraint.type,
            primary_constraint_severity: primaryConstraint.severity,
            opportunity_value: opportunityValue,
            health_score: healthScore,
            processed_at: new Date().toISOString(),
          }
        }).eq('id', businessId)

        router.push('/report/' + businessId)

      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Processing failed')
      }
    }
    run()
  }, [businessId, router])

  return (
    <main style={{backgroundColor:'#050505',color:'#ffffff',fontFamily:'Inter,system-ui,sans-serif',minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center',maxWidth:'500px',padding:'48px'}}>
        <div style={{fontSize:'12px',fontWeight:'600',letterSpacing:'0.2em',color:'#C8A24A',marginBottom:'32px',textTransform:'uppercase'}}>BEI MRI v1.0 — Processing</div>
        <h1 style={{fontSize:'28px',fontWeight:'700',marginBottom:'48px'}}>Analysing your business</h1>

        <div style={{display:'flex',flexDirection:'column',gap:'16px',textAlign:'left',marginBottom:'48px'}}>
          {stages.map((s, i) => (
            <div key={i} style={{display:'flex',alignItems:'center',gap:'12px'}}>
              <div style={{width:'20px',height:'20px',borderRadius:'50%',backgroundColor:i<stage?'#2a4a2a':i===stage?'#C8A24A':'#1a1a1a',border:i===stage?'none':i<stage?'none':'1px solid #2a2a2a',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',flexShrink:0}}>
                {i < stage ? '✓' : i === stage ? '•' : ''}
              </div>
              <span style={{fontSize:'14px',color:i<stage?'#4aaa4a':i===stage?'#ffffff':'#444444'}}>{s}</span>
            </div>
          ))}
        </div>

        {error && <div style={{backgroundColor:'#1a0a0a',border:'1px solid #3a1a1a',borderRadius:'8px',padding:'16px',color:'#ff6b6b',fontSize:'14px'}}>{error}</div>}

        <p style={{fontSize:'12px',color:'#333333'}}>BEI MRI v1.0 — Rules-Based Analysis</p>
      </div>
    </main>
  )
}