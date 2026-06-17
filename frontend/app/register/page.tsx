'use client'
import { useState } from 'react'

export default function RegisterPage() {
  const [step, setStep] = useState<'plan' | 'details'>('plan')
  const [selectedPlan, setSelectedPlan] = useState('')
  const [form, setForm] = useState({ name: '', email: '', company: '', industry: '' })
  const [submitted, setSubmitted] = useState(false)
  const gold = '#C8A24A'

  const plans = [
    { id: 'analysis', name: 'MRI Analysis', price: '£199', original: '£332', saving: '£1,596', desc: 'Full constraint intelligence — sub £1M revenue' },
    { id: 'opportunity', name: 'Analysis + Opportunity', price: '£399', original: '£665', saving: '£3,192', desc: 'Full intelligence with opportunity mapping', popular: true },
    { id: 'platform', name: 'Full Platform', price: '£999', original: '£1,665', saving: '£7,992', desc: 'Complete intelligence, deployment and outcomes' },
  ]

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))
  const inputStyle = { width: '100%', padding: '12px 14px', backgroundColor: '#0d0d0d', border: '1px solid #2a2a2a', borderRadius: '6px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const }
  const labelStyle = { fontSize: '12px', color: '#666', marginBottom: '6px', display: 'block' as const }

  if (submitted) return (
    <main style={{backgroundColor:'#050505',color:'#fff',fontFamily:'Inter,system-ui,sans-serif',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center',maxWidth:'480px',padding:'0 24px'}}>
        <div style={{fontSize:'32px',marginBottom:'16px',color:gold}}>◈</div>
        <div style={{fontSize:'24px',fontWeight:'700',marginBottom:'12px'}}>Request received.</div>
        <div style={{fontSize:'15px',color:'#666',lineHeight:'1.8',marginBottom:'8px'}}>Selected plan: <strong style={{color:gold}}>{plans.find(p=>p.id===selectedPlan)?.name}</strong></div>
        <div style={{fontSize:'15px',color:'#666',lineHeight:'1.8',marginBottom:'32px'}}>We will email you within 48 hours with your Stripe payment link to activate your account.</div>
        <a href="/" style={{padding:'14px 32px',backgroundColor:gold,color:'#050505',fontWeight:'700',borderRadius:'6px',textDecoration:'none',fontSize:'14px'}}>Return to home</a>
      </div>
    </main>
  )

  return (
    <main style={{backgroundColor:'#050505',color:'#fff',fontFamily:'Inter,system-ui,sans-serif',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'40px 24px'}}>
      <div style={{width:'100%',maxWidth: step==='plan' ? '700px' : '480px'}}>
        <a href="/" style={{display:'block',fontSize:'22px',fontWeight:'800',color:gold,letterSpacing:'0.12em',textDecoration:'none',marginBottom:'40px',textAlign:'center'}}>BEI</a>

        {/* Step indicator */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',marginBottom:'32px'}}>
          {['Select Plan','Your Details'].map((s,i) => (
            <div key={s} style={{display:'flex',alignItems:'center',gap:'8px'}}>
              <div style={{width:'24px',height:'24px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:'700',
                backgroundColor: (i===0&&step==='plan')||(i===1&&step==='details') ? gold : i===0&&step==='details' ? '#4aaa4a' : '#111',
                color: (i===0&&step==='plan')||(i===1&&step==='details') ? '#050505' : i===0&&step==='details' ? '#050505' : '#444',
                border: `1px solid ${(i===0&&step==='plan')||(i===1&&step==='details') ? gold : i===0&&step==='details' ? '#4aaa4a' : '#2a2a2a'}`
              }}>{i===0&&step==='details' ? '✓' : i+1}</div>
              <span style={{fontSize:'12px',color:(i===0&&step==='plan')||(i===1&&step==='details')?'#fff':'#555'}}>{s}</span>
              {i===0 && <span style={{color:'#2a2a2a',fontSize:'16px',marginLeft:'4px'}}>→</span>}
            </div>
          ))}
        </div>

        {/* Step 1 — Plan selection */}
        {step === 'plan' && (
          <div>
            <div style={{textAlign:'center',marginBottom:'32px'}}>
              <div style={{fontSize:'24px',fontWeight:'700',marginBottom:'8px'}}>Choose your plan</div>
              <div style={{fontSize:'14px',color:'#555'}}>Select a plan to continue. You will not be charged until your account is approved.</div>
              <div style={{marginTop:'12px',display:'inline-flex',alignItems:'center',gap:'6px',padding:'6px 14px',backgroundColor:'rgba(200,162,74,0.08)',border:'1px solid rgba(200,162,74,0.2)',borderRadius:'20px',fontSize:'12px',color:gold}}>
                ◈ Launch offer — 40% off for 12 months · No contract
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column' as const,gap:'12px',marginBottom:'24px'}}>
              {plans.map(plan => (
                <div key={plan.id} onClick={()=>setSelectedPlan(plan.id)}
                  style={{padding:'20px 24px',border:`1px solid ${selectedPlan===plan.id ? gold : '#1a1a1a'}`,borderRadius:'8px',backgroundColor:selectedPlan===plan.id?'#0d0a04':'#080808',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center',position:'relative' as const}}>
                  {(plan as any).popular && <div style={{position:'absolute' as const,top:'-10px',left:'20px',padding:'2px 12px',backgroundColor:gold,color:'#050505',fontSize:'10px',fontWeight:'700',borderRadius:'10px'}}>MOST POPULAR</div>}
                  <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
                    <div style={{width:'20px',height:'20px',borderRadius:'50%',border:`2px solid ${selectedPlan===plan.id?gold:'#333'}`,backgroundColor:selectedPlan===plan.id?gold:'transparent',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
                      {selectedPlan===plan.id && <div style={{width:'8px',height:'8px',borderRadius:'50%',backgroundColor:'#050505'}}/>}
                    </div>
                    <div>
                      <div style={{fontSize:'15px',fontWeight:'600',marginBottom:'2px'}}>{plan.name}</div>
                      <div style={{fontSize:'12px',color:'#555'}}>{plan.desc}</div>
                    </div>
                  </div>
                  <div style={{textAlign:'right' as const,flexShrink:0,marginLeft:'16px'}}>
                    <div style={{fontSize:'12px',color:'#444',textDecoration:'line-through',marginBottom:'2px'}}>{plan.original}/mo</div>
                    <div style={{fontSize:'20px',fontWeight:'700',color:selectedPlan===plan.id?gold:'#fff'}}>{plan.price}<span style={{fontSize:'12px',color:'#555',fontWeight:'400'}}>/mo</span></div>
                    <div style={{fontSize:'11px',color:'#4aaa4a'}}>Save {plan.saving}/yr</div>
                  </div>
                </div>
              ))}
            </div>
            {!selectedPlan && (
              <div style={{padding:'12px 16px',backgroundColor:'#0d0a0a',border:'1px solid #2a1a1a',borderRadius:'6px',fontSize:'13px',color:'#888',marginBottom:'16px',textAlign:'center' as const}}>
                Please select a plan to continue with account creation.
              </div>
            )}
            <button onClick={()=>selectedPlan && setStep('details')} disabled={!selectedPlan}
              style={{width:'100%',padding:'14px',backgroundColor:selectedPlan?gold:'#111',color:selectedPlan?'#050505':'#444',fontWeight:'700',borderRadius:'6px',border:`1px solid ${selectedPlan?gold:'#1a1a1a'}`,cursor:selectedPlan?'pointer':'not-allowed',fontSize:'15px',transition:'all 0.2s'}}>
              Continue with {selectedPlan ? plans.find(p=>p.id===selectedPlan)?.name : 'selected plan'} →
            </button>
          </div>
        )}

        {/* Step 2 — Details */}
        {step === 'details' && (
          <div style={{padding:'40px',border:'1px solid #1a1a1a',borderRadius:'12px',backgroundColor:'#080808'}}>
            <div style={{padding:'12px 16px',backgroundColor:'#0d0a04',border:'1px solid rgba(200,162,74,0.2)',borderRadius:'6px',marginBottom:'24px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontSize:'13px',color:'#888'}}>Selected: <strong style={{color:gold}}>{plans.find(p=>p.id===selectedPlan)?.name}</strong> — {plans.find(p=>p.id===selectedPlan)?.price}/mo</span>
              <button onClick={()=>setStep('plan')} style={{fontSize:'12px',color:'#555',background:'none',border:'none',cursor:'pointer',textDecoration:'underline'}}>Change</button>
            </div>
            <div style={{fontSize:'24px',fontWeight:'700',marginBottom:'8px'}}>Your details</div>
            <div style={{fontSize:'14px',color:'#555',marginBottom:'28px'}}>Tell us about yourself. We will review your request and send a payment link within 48 hours.</div>
            <div style={{display:'flex',flexDirection:'column' as const,gap:'16px',marginBottom:'24px'}}>
              <div><label style={labelStyle}>Full name</label><input value={form.name} onChange={e=>update('name',e.target.value)} placeholder="Your name" style={inputStyle}/></div>
              <div><label style={labelStyle}>Work email</label><input value={form.email} onChange={e=>update('email',e.target.value)} type="email" placeholder="you@company.com" style={inputStyle}/></div>
              <div><label style={labelStyle}>Company name</label><input value={form.company} onChange={e=>update('company',e.target.value)} placeholder="Your company" style={inputStyle}/></div>
              <div>
                <label style={labelStyle}>Industry</label>
                <select value={form.industry} onChange={e=>update('industry',e.target.value)} style={{...inputStyle,color:form.industry?'#fff':'#555'}}>
                  <option value="">Select your industry</option>
                  <option>Estate Agency</option>
                  <option>Marketing Agency</option>
                  <option>Accountancy Firm</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <button onClick={()=>form.name&&form.email&&form.company&&setSubmitted(true)}
              style={{width:'100%',padding:'14px',backgroundColor:gold,color:'#050505',fontWeight:'700',borderRadius:'6px',border:'none',cursor:'pointer',fontSize:'15px'}}>
              Request Access →
            </button>
            <div style={{marginTop:'16px',textAlign:'center' as const,fontSize:'12px',color:'#444',lineHeight:'1.7'}}>
              You will not be charged until your account is approved and you complete payment via the secure Stripe link we send you.
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
