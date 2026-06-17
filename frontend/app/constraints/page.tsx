'use client'

import { useEffect, useState } from 'react'

export default function ConstraintsPage() {
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
    { label: 'Health', href: '/health' },
    { label: 'Constraints', href: '/constraints', active: true },
    { label: 'Opportunities', href: '/opportunities' },
    { label: 'Deployments', href: '/deployments' },
    { label: 'Outcomes', href: '/outcomes' },
  ]

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

  const primary = result.primary_constraint
  const secondary = result.secondary_constraints || []
  const unverified = result.unverified_flags || []
  const explanation = result.decision_explanation || ''

  const severityColor = (s: string) => s === 'high' ? '#cc4444' : '#C8A24A'
  const severityBg = (s: string) => s === 'high' ? '#2a0a0a' : '#2a1a00'

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
        <div style={{fontSize:'24px',fontWeight:'700',marginBottom:'4px'}}>Constraint Intelligence</div>
        <div style={{fontSize:'14px',color:'#555',marginBottom:'40px'}}>Verified root constraints limiting business performance</div>

        {/* Decision explanation */}
        {explanation && (
          <div style={{padding:'20px 24px',border:'1px solid #1a1a1a',borderRadius:'6px',backgroundColor:'#080808',marginBottom:'32px'}}>
            <div style={{fontSize:'11px',color:'#444',letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:'10px'}}>Decision Intelligence — Why This Constraint</div>
            <div style={{fontSize:'13px',color:'#777',lineHeight:'1.8'}}>{explanation}</div>
          </div>
        )}

        {/* Primary Constraint */}
        {primary && (
          <div style={{marginBottom:'40px'}}>
            <div style={{fontSize:'16px',fontWeight:'600',marginBottom:'16px'}}>Primary Constraint</div>
            <div style={{padding:'28px',border:'1px solid #2a2a2a',borderRadius:'8px',backgroundColor:'#080808'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'16px'}}>
                <div>
                  <div style={{display:'inline-block',padding:'3px 8px',borderRadius:'3px',fontSize:'10px',fontWeight:'600',color:'#4aaa4a',backgroundColor:'#0a2a0a',border:'1px solid #4aaa4a',marginBottom:'10px'}}>ROOT CAUSE · VERIFIED</div>
                  <div style={{fontSize:'22px',fontWeight:'700',marginBottom:'6px'}}>{primary.name}</div>
                  <div style={{fontSize:'14px',color:'#666',fontStyle:'italic'}}>{primary.hypothesis}</div>
                </div>
                <div style={{textAlign:'right',flexShrink:0,marginLeft:'24px'}}>
                  <div style={{padding:'4px 10px',borderRadius:'4px',fontSize:'11px',fontWeight:'600',
                    color:severityColor(primary.severity),backgroundColor:severityBg(primary.severity),
                    border:`1px solid ${severityColor(primary.severity)}`,marginBottom:'8px',textAlign:'center'}}>
                    {primary.severity?.toUpperCase()} PRIORITY
                  </div>
                  <div style={{fontSize:'22px',fontWeight:'700',color:'#4aaa4a'}}>{primary.verification_score}/100</div>
                  <div style={{fontSize:'11px',color:'#444'}}>verification score</div>
                </div>
              </div>

              {/* Evidence */}
              <div style={{marginBottom:'20px'}}>
                <div style={{fontSize:'11px',color:'#444',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:'10px'}}>Supporting Evidence</div>
                {(primary.evidence || []).map((e: string, i: number) => (
                  <div key={i} style={{fontSize:'13px',color:'#888',paddingLeft:'16px',borderLeft:'2px solid #2a2a2a',marginBottom:'8px',lineHeight:'1.6'}}>{e}</div>
                ))}
              </div>

              {/* Verification tests */}
              <div style={{marginBottom:'20px'}}>
                <div style={{fontSize:'11px',color:'#444',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:'10px'}}>Verification Tests — {primary.tests_passed}/{primary.total_tests} Passed</div>
                <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                  {(primary.verification_tests || []).map((t: any, i: number) => (
                    <div key={i} style={{display:'flex',gap:'10px',alignItems:'flex-start'}}>
                      <div style={{fontSize:'12px',color:t.passes?'#4aaa4a':'#cc4444',flexShrink:0,marginTop:'2px'}}>{t.passes?'✓':'✗'}</div>
                      <div style={{fontSize:'12px',color:'#666'}}>
                        <span style={{color:t.passes?'#888':'#555',fontWeight:'500',textTransform:'capitalize'}}>{t.test?.replace(/_/g,' ')}: </span>
                        {t.note}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Opportunity */}
              {primary.opportunity && (
                <div style={{padding:'16px',backgroundColor:'#0a0a0a',borderRadius:'4px',border:'1px solid #1a1a1a'}}>
                  <div style={{fontSize:'11px',color:'#444',marginBottom:'6px'}}>INDICATIVE OPPORTUNITY RANGE</div>
                  <div style={{fontSize:'20px',fontWeight:'700',color:'#C8A24A'}}>
                    £{(primary.opportunity.value_low || 0).toLocaleString()} — £{(primary.opportunity.value_high || 0).toLocaleString()}
                  </div>
                  <div style={{fontSize:'11px',color:'#444',marginTop:'4px',textTransform:'capitalize'}}>{primary.opportunity.dimension} opportunity</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Secondary Constraints */}
        {secondary.length > 0 && (
          <div style={{marginBottom:'40px'}}>
            <div style={{fontSize:'16px',fontWeight:'600',marginBottom:'16px'}}>Secondary Constraints</div>
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {secondary.map((c: any) => (
                <div key={c.key} style={{padding:'20px 24px',border:'1px solid #1a1a1a',borderRadius:'6px',backgroundColor:'#080808'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'10px'}}>
                    <div>
                      <div style={{display:'inline-block',padding:'2px 7px',borderRadius:'3px',fontSize:'10px',color:'#4aaa4a',backgroundColor:'#0a2a0a',border:'1px solid #4aaa4a',marginBottom:'6px'}}>VERIFIED</div>
                      <div style={{fontSize:'15px',fontWeight:'600'}}>{c.name}</div>
                    </div>
                    <div style={{fontSize:'11px',fontWeight:'600',color:severityColor(c.severity)}}>{c.severity?.toUpperCase()}</div>
                  </div>
                  <div style={{fontSize:'12px',color:'#666',marginBottom:'8px',fontStyle:'italic'}}>{c.hypothesis}</div>
                  <div style={{display:'flex',gap:'24px',fontSize:'12px',color:'#444'}}>
                    <span>Verification: {c.verification_score}/100</span>
                    <span>Tests passed: {c.tests_passed}/{c.total_tests}</span>
                    {c.opportunity && <span style={{color:'#C8A24A'}}>£{(c.opportunity.value_low||0).toLocaleString()}–£{(c.opportunity.value_high||0).toLocaleString()}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Unverified flags */}
        {unverified.length > 0 && (
          <div style={{marginBottom:'40px'}}>
            <div style={{fontSize:'16px',fontWeight:'600',marginBottom:'8px',color:'#555'}}>Unverified Signals</div>
            <div style={{fontSize:'13px',color:'#444',marginBottom:'16px'}}>These signals were detected but did not pass verification. They will not influence recommendations.</div>
            <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
              {unverified.map((c: any) => (
                <div key={c.key} style={{padding:'14px 20px',border:'1px solid #111',borderRadius:'6px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div style={{fontSize:'13px',color:'#444'}}>{c.name}</div>
                  <div style={{fontSize:'11px',color:'#333'}}>Verification: {c.verification_score}/100 — did not pass</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{padding:'16px 20px',border:'1px solid #111',borderRadius:'6px',backgroundColor:'#080808'}}>
          <div style={{fontSize:'11px',color:'#333',lineHeight:'1.8'}}>
            <strong style={{color:'#444'}}>Golden Rule 1:</strong> Detection Is Not Proof. All constraints shown have passed the BEI five-test verification framework before appearing here. Unverified signals are shown separately and never influence recommendations.
          </div>
        </div>
      </div>
    </main>
  )
}
