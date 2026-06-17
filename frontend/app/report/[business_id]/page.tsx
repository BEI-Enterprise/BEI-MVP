'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ReportPage() {
  const params = useParams()
  const businessId = params.business_id as string
  const [result, setResult] = useState<Record<string, any> | null>(null)
  const [businessName, setBusinessName] = useState('Your Business')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('business_name, mri_result')
        .eq('id', businessId)
        .single()
      if (data) {
        setBusinessName(data.business_name || 'Your Business')
        if (data.mri_result) setResult(data.mri_result)
      }
      setLoading(false)
    }
    load()
  }, [businessId])

  if (loading) return <main style={{backgroundColor:'#050505',minHeight:'100vh'}}></main>

  if (!result) {
    return (
      <main style={{backgroundColor:'#050505',color:'#ffffff',fontFamily:'Inter,system-ui,sans-serif',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <p style={{color:'#666'}}>No MRI report found.</p>
      </main>
    )
  }

  const health = result.health || {}
  const overall = health.overall || 0
  const pillars = health.pillars || {}
  const primary = result.primary_constraint
  const secondary = result.secondary_constraints || []
  const explanation = result.decision_explanation || ''
  const confidence = result.confidence || 'low'
  const version = confidence === 'high' ? 'BEI MRI v1.1 — Verified Analysis' : 'BEI MRI v1.0 — Rules-Based Analysis'
  const healthColor = overall >= 70 ? '#4aaa4a' : overall >= 45 ? '#C8A24A' : '#cc4444'

  const nextSteps = [
    primary ? `Review the evidence behind your Primary Constraint — "${primary.name}" — with your team to confirm it matches what you see day to day.` : null,
    primary ? `Focus one priority action this quarter directly on "${primary.name}" rather than spreading effort across multiple issues.` : null,
    'Revisit this assessment in 90 days to track whether your Business Health scores have improved.',
    'Speak with a BEI advisor to move from this preliminary read to a fully verified constraint analysis.',
  ].filter(Boolean) as string[]

  return (
    <main style={{backgroundColor:'#050505',color:'#ffffff',fontFamily:'Inter,system-ui,sans-serif',minHeight:'100vh'}}>
      <nav style={{padding:'24px 48px',borderBottom:'1px solid #1a1a1a',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span style={{fontSize:'20px',fontWeight:'700',color:'#C8A24A',letterSpacing:'0.1em'}}>BEI</span>
        <span style={{fontSize:'12px',color:'#444',letterSpacing:'0.1em'}}>BUSINESS MRI REPORT</span>
      </nav>
      <div style={{maxWidth:'860px',margin:'0 auto',padding:'48px 24px'}}>

        {/* Header */}
        <div style={{marginBottom:'48px',paddingBottom:'32px',borderBottom:'1px solid #1a1a1a'}}>
          <div style={{fontSize:'12px',fontWeight:'600',letterSpacing:'0.2em',color:'#C8A24A',marginBottom:'12px',textTransform:'uppercase'}}>Business MRI Report</div>
          <h1 style={{fontSize:'32px',fontWeight:'700',marginBottom:'8px'}}>{businessName}</h1>
          <p style={{color:'#666',fontSize:'14px',marginBottom:'4px'}}>Generated: {new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}</p>
          <div style={{marginTop:'16px',display:'inline-block',padding:'6px 14px',border:'1px solid #2a2a2a',borderRadius:'4px',fontSize:'11px',color: confidence==='high'?'#4aaa4a':'#555',letterSpacing:'0.1em'}}>{version}</div>
        </div>

        {/* Health Overview */}
        <div style={{marginBottom:'48px'}}>
          <h2 style={{fontSize:'18px',fontWeight:'600',marginBottom:'24px'}}>Business Health Overview</h2>
          <div style={{display:'flex',alignItems:'center',gap:'32px',marginBottom:'32px'}}>
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:'56px',fontWeight:'700',color:healthColor,lineHeight:'1'}}>{overall}</div>
              <div style={{fontSize:'12px',color:'#666',marginTop:'4px'}}>Overall Score</div>
            </div>
            <div style={{flex:1,fontSize:'14px',color:'#888'}}>
              {overall>=70?'Your business is in strong health across most areas.':overall>=45?'Your business has solid foundations with some areas needing attention.':'Several areas of your business need focused attention.'}
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
            {Object.entries(pillars).map(([name, data]: [string, any]) => (
              <div key={name} style={{display:'flex',alignItems:'center',gap:'16px'}}>
                <div style={{width:'100px',fontSize:'13px',color:'#888',textTransform:'capitalize'}}>{name}</div>
                <div style={{flex:1,height:'6px',backgroundColor:'#111',borderRadius:'3px',overflow:'hidden'}}>
                  <div style={{width:data.score+'%',height:'100%',backgroundColor:data.score>=70?'#4aaa4a':data.score>=45?'#C8A24A':'#cc4444',borderRadius:'3px'}}/>
                </div>
                <div style={{width:'40px',fontSize:'13px',color:'#666',textAlign:'right'}}>{data.score}</div>
                <div style={{width:'120px',fontSize:'12px',color:data.score>=70?'#4aaa4a':data.score>=45?'#C8A24A':'#cc4444'}}>{data.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Primary Constraint */}
        {primary && (
          <div style={{marginBottom:'48px',padding:'32px',border:'1px solid #2a2a2a',borderRadius:'8px',backgroundColor:'#080808'}}>
            <div style={{fontSize:'11px',fontWeight:'600',letterSpacing:'0.2em',color:'#C8A24A',marginBottom:'16px',textTransform:'uppercase'}}>Primary Constraint</div>
            <h2 style={{fontSize:'24px',fontWeight:'700',marginBottom:'8px'}}>{primary.name}</h2>
            <div style={{display:'flex',gap:'8px',marginBottom:'20px',flexWrap:'wrap'}}>
              <div style={{padding:'4px 10px',borderRadius:'4px',fontSize:'11px',fontWeight:'600',backgroundColor:primary.severity==='high'?'#2a0a0a':'#2a1a00',color:primary.severity==='high'?'#cc4444':'#C8A24A',border:'1px solid '+(primary.severity==='high'?'#cc4444':'#C8A24A')}}>
                {(primary.severity||'').toUpperCase()} PRIORITY
              </div>
              <div style={{padding:'4px 10px',borderRadius:'4px',fontSize:'11px',color:'#555',border:'1px solid #1a1a1a'}}>
                Verification: {primary.verification_score}/100
              </div>
              <div style={{padding:'4px 10px',borderRadius:'4px',fontSize:'11px',color:'#555',border:'1px solid #1a1a1a'}}>
                Tests passed: {primary.tests_passed}/{primary.total_tests}
              </div>
            </div>
            <div style={{fontSize:'14px',color:'#777',marginBottom:'20px',fontStyle:'italic'}}>{primary.hypothesis}</div>
            <div style={{marginBottom:'20px'}}>
              <div style={{fontSize:'12px',color:'#555',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'0.1em'}}>Supporting Evidence</div>
              {(primary.evidence||[]).map((e: string, i: number) => (
                <div key={i} style={{fontSize:'14px',color:'#aaa',paddingLeft:'16px',borderLeft:'2px solid #2a2a2a',marginBottom:'8px'}}>{e}</div>
              ))}
            </div>
            {primary.opportunity && (
              <div style={{padding:'16px',backgroundColor:'#0a0a0a',borderRadius:'4px',border:'1px solid #1a1a1a'}}>
                <div style={{fontSize:'11px',color:'#444',marginBottom:'4px'}}>INDICATIVE OPPORTUNITY RANGE</div>
                <div style={{fontSize:'20px',fontWeight:'700',color:'#C8A24A'}}>£{(primary.opportunity.value_low||0).toLocaleString()} — £{(primary.opportunity.value_high||0).toLocaleString()}</div>
                <div style={{fontSize:'11px',color:'#444',marginTop:'4px'}}>{primary.opportunity.basis}</div>
              </div>
            )}
          </div>
        )}

        {/* Decision Explanation */}
        {explanation && (
          <div style={{marginBottom:'48px',padding:'24px',border:'1px solid #1a1a1a',borderRadius:'6px',backgroundColor:'#080808'}}>
            <div style={{fontSize:'11px',fontWeight:'600',letterSpacing:'0.2em',color:'#555',marginBottom:'12px',textTransform:'uppercase'}}>Decision Intelligence — Why This Constraint</div>
            <div style={{fontSize:'14px',color:'#888',lineHeight:'1.8'}}>{explanation}</div>
          </div>
        )}

        {/* Secondary Constraints */}
        {secondary.length > 0 && (
          <div style={{marginBottom:'48px'}}>
            <h2 style={{fontSize:'18px',fontWeight:'600',marginBottom:'20px'}}>Additional Areas Flagged</h2>
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {secondary.map((c: any) => (
                <div key={c.key} style={{padding:'20px',border:'1px solid #1a1a1a',borderRadius:'6px',display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                  <div>
                    <div style={{fontSize:'15px',fontWeight:'600',marginBottom:'4px'}}>{c.name}</div>
                    <div style={{fontSize:'13px',color:'#666',marginBottom:'4px'}}>{(c.evidence||[])[0]}</div>
                    <div style={{fontSize:'12px',color:'#444'}}>Verification: {c.verification_score}/100</div>
                  </div>
                  <div style={{fontSize:'11px',fontWeight:'600',color:c.severity==='high'?'#cc4444':'#C8A24A',marginLeft:'16px',flexShrink:0}}>{(c.severity||'').toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div style={{marginBottom:'48px'}}>
          <h2 style={{fontSize:'18px',fontWeight:'600',marginBottom:'20px'}}>Recommended Next Steps</h2>
          <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
            {nextSteps.map((step, i) => (
              <div key={i} style={{display:'flex',gap:'16px',padding:'16px',border:'1px solid #1a1a1a',borderRadius:'6px'}}>
                <div style={{width:'24px',height:'24px',borderRadius:'50%',backgroundColor:'#1a1a1a',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:'700',color:'#C8A24A',flexShrink:0}}>{i+1}</div>
                <div style={{fontSize:'14px',color:'#aaa',lineHeight:'1.6'}}>{step}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{padding:'24px',border:'1px solid #1a1a1a',borderRadius:'6px',backgroundColor:'#080808',marginBottom:'32px'}}>
          <div style={{fontSize:'12px',color:'#444',lineHeight:'1.8'}}>
            <strong style={{color:'#555'}}>Important:</strong> {version}. {confidence==='high'?'This report has passed the BEI Verification Framework — all five verification tests completed.':'This report is generated using rules-based analysis. Results should be treated as a preliminary assessment only.'}
          </div>
        </div>

        {/* Dashboard CTA */}
        <div style={{padding:'24px',border:'1px solid #2a2a2a',borderRadius:'8px',backgroundColor:'#080808',marginBottom:'24px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <div style={{fontSize:'16px',fontWeight:'600',marginBottom:'4px'}}>Access Your Intelligence Dashboard</div>
            <div style={{fontSize:'13px',color:'#555'}}>View full constraint analysis, opportunities, deployment actions and outcome tracking.</div>
          </div>
          <a href="/dashboard" style={{padding:'12px 24px',backgroundColor:'#C8A24A',color:'#050505',fontWeight:'700',borderRadius:'4px',textDecoration:'none',fontSize:'14px',flexShrink:0,marginLeft:'24px'}}>View Dashboard →</a>
        </div>

        {/* CTA */}
        <div style={{textAlign:'center',padding:'48px 0'}}>
          <div style={{fontSize:'20px',fontWeight:'600',marginBottom:'8px'}}>Want a fully verified BEI analysis?</div>
          <div style={{fontSize:'14px',color:'#666',marginBottom:'24px'}}>Speak with a BEI advisor to move beyond rules-based analysis.</div>
          <a href="mailto:hello@bei.io" style={{display:'inline-block',padding:'16px 40px',backgroundColor:'#C8A24A',color:'#050505',fontWeight:'700',borderRadius:'4px',textDecoration:'none',fontSize:'14px'}}>Book a BEI Advisory Call</a>
        </div>
      </div>
      <div style={{borderTop:'1px solid #1a1a1a',padding:'24px',textAlign:'center',fontSize:'11px',color:'#333'}}>{version} — Not a verified BEI output</div>
    </main>
  )
