'use client'
import { useState } from 'react'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', company: '', industry: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const gold = '#C8A24A'

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const inputStyle = { width: '100%', padding: '12px 14px', backgroundColor: '#0d0d0d', border: '1px solid #2a2a2a', borderRadius: '6px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const }
  const labelStyle = { fontSize: '12px', color: '#666', marginBottom: '6px', display: 'block' as const }

  if (submitted) return (
    <main style={{backgroundColor:'#050505',color:'#fff',fontFamily:'Inter,system-ui,sans-serif',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center',maxWidth:'480px',padding:'0 24px'}}>
        <div style={{fontSize:'32px',marginBottom:'16px',color:gold}}>◈</div>
        <div style={{fontSize:'24px',fontWeight:'700',marginBottom:'12px'}}>Request received.</div>
        <div style={{fontSize:'15px',color:'#666',lineHeight:'1.8',marginBottom:'32px'}}>We review all access requests within 48 hours. You will receive an email from the BEI team shortly.</div>
        <a href="/" style={{padding:'14px 32px',backgroundColor:gold,color:'#050505',fontWeight:'700',borderRadius:'6px',textDecoration:'none',fontSize:'14px'}}>Return to home</a>
      </div>
    </main>
  )

  return (
    <main style={{backgroundColor:'#050505',color:'#fff',fontFamily:'Inter,system-ui,sans-serif',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'40px 24px'}}>
      <div style={{width:'100%',maxWidth:'480px'}}>
        <a href="/" style={{display:'block',fontSize:'22px',fontWeight:'800',color:gold,letterSpacing:'0.12em',textDecoration:'none',marginBottom:'48px',textAlign:'center'}}>BEI</a>
        <div style={{padding:'40px',border:'1px solid #1a1a1a',borderRadius:'12px',backgroundColor:'#080808'}}>
          <div style={{fontSize:'11px',color:gold,letterSpacing:'0.2em',textTransform:'uppercase' as const,marginBottom:'8px'}}>Invitation Only</div>
          <div style={{fontSize:'24px',fontWeight:'700',marginBottom:'8px'}}>Request Access</div>
          <div style={{fontSize:'14px',color:'#555',marginBottom:'32px'}}>BEI accounts require approval. Tell us about your business and we will be in touch within 48 hours.</div>
          <div style={{display:'flex',flexDirection:'column' as const,gap:'16px'}}>
            <div>
              <label style={labelStyle}>Full name</label>
              <input value={form.name} onChange={e=>update('name',e.target.value)} placeholder="Your name" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Work email</label>
              <input value={form.email} onChange={e=>update('email',e.target.value)} type="email" placeholder="you@company.com" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Company name</label>
              <input value={form.company} onChange={e=>update('company',e.target.value)} placeholder="Your company" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Industry</label>
              <select value={form.industry} onChange={e=>update('industry',e.target.value)}
                style={{...inputStyle,color:form.industry?'#fff':'#555'}}>
                <option value="">Select your industry</option>
                <option>Estate Agency</option>
                <option>Marketing Agency</option>
                <option>Accountancy Firm</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>What is the biggest constraint on your growth right now?</label>
              <textarea value={form.message} onChange={e=>update('message',e.target.value)} rows={3} placeholder="Brief description..."
                style={{...inputStyle,resize:'none' as const}} />
            </div>
          </div>
          <button onClick={()=>setSubmitted(true)}
            style={{width:'100%',marginTop:'24px',padding:'14px',backgroundColor:gold,color:'#050505',fontWeight:'700',borderRadius:'6px',border:'none',cursor:'pointer',fontSize:'15px'}}>
            Request Access →
          </button>
          <div style={{marginTop:'20px',textAlign:'center',fontSize:'13px',color:'#555'}}>
            Already have an account?{' '}
            <a href="/login" style={{color:gold,textDecoration:'none'}}>Sign in</a>
          </div>
        </div>
      </div>
    </main>
  )
}
