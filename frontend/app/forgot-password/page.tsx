'use client'
import { useState } from 'react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const gold = '#C8A24A'

  if (submitted) return (
    <main style={{backgroundColor:'#050505',color:'#fff',fontFamily:'Inter,system-ui,sans-serif',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center',maxWidth:'420px',padding:'0 24px'}}>
        <div style={{fontSize:'32px',color:gold,marginBottom:'16px'}}>◈</div>
        <div style={{fontSize:'24px',fontWeight:'700',marginBottom:'12px'}}>Check your email</div>
        <div style={{fontSize:'14px',color:'#666',lineHeight:'1.8',marginBottom:'32px'}}>If an account exists for {email}, you will receive a password reset link shortly.</div>
        <a href="/login" style={{padding:'14px 32px',backgroundColor:gold,color:'#050505',fontWeight:'700',borderRadius:'6px',textDecoration:'none',fontSize:'14px'}}>Back to sign in</a>
      </div>
    </main>
  )

  return (
    <main style={{backgroundColor:'#050505',color:'#fff',fontFamily:'Inter,system-ui,sans-serif',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{width:'100%',maxWidth:'420px',padding:'0 24px'}}>
        <a href="/" style={{display:'block',fontSize:'22px',fontWeight:'800',color:gold,letterSpacing:'0.12em',textDecoration:'none',marginBottom:'48px',textAlign:'center'}}>BEI</a>
        <div style={{padding:'40px',border:'1px solid #1a1a1a',borderRadius:'12px',backgroundColor:'#080808'}}>
          <div style={{fontSize:'24px',fontWeight:'700',marginBottom:'8px'}}>Reset password</div>
          <div style={{fontSize:'14px',color:'#555',marginBottom:'32px'}}>Enter your email and we will send you a reset link.</div>
          <div style={{marginBottom:'24px'}}>
            <div style={{fontSize:'12px',color:'#666',marginBottom:'6px'}}>Email address</div>
            <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@company.com"
              style={{width:'100%',padding:'12px 14px',backgroundColor:'#0d0d0d',border:'1px solid #2a2a2a',borderRadius:'6px',color:'#fff',fontSize:'14px',outline:'none',boxSizing:'border-box'}} />
          </div>
          <button onClick={()=>setSubmitted(true)}
            style={{width:'100%',padding:'14px',backgroundColor:gold,color:'#050505',fontWeight:'700',borderRadius:'6px',border:'none',cursor:'pointer',fontSize:'15px'}}>
            Send reset link →
          </button>
          <div style={{marginTop:'20px',textAlign:'center',fontSize:'13px',color:'#555'}}>
            <a href="/login" style={{color:gold,textDecoration:'none'}}>← Back to sign in</a>
          </div>
        </div>
      </div>
    </main>
  )
}
