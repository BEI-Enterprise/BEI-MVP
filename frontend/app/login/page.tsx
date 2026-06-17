'use client'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const gold = '#C8A24A'

  const handleSubmit = async () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1500)
  }

  return (
    <main style={{backgroundColor:'#050505',color:'#fff',fontFamily:'Inter,system-ui,sans-serif',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{width:'100%',maxWidth:'420px',padding:'0 24px'}}>
        <a href="/" style={{display:'block',fontSize:'22px',fontWeight:'800',color:gold,letterSpacing:'0.12em',textDecoration:'none',marginBottom:'48px',textAlign:'center'}}>BEI</a>
        <div style={{padding:'40px',border:'1px solid #1a1a1a',borderRadius:'12px',backgroundColor:'#080808'}}>
          <div style={{fontSize:'11px',color:gold,letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:'8px'}}>Intelligence Platform</div>
          <div style={{fontSize:'24px',fontWeight:'700',marginBottom:'8px'}}>Sign in</div>
          <div style={{fontSize:'14px',color:'#555',marginBottom:'32px'}}>Access your Business Intelligence dashboard.</div>
          <div style={{marginBottom:'16px'}}>
            <div style={{fontSize:'12px',color:'#666',marginBottom:'6px'}}>Email address</div>
            <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@company.com"
              style={{width:'100%',padding:'12px 14px',backgroundColor:'#0d0d0d',border:'1px solid #2a2a2a',borderRadius:'6px',color:'#fff',fontSize:'14px',outline:'none',boxSizing:'border-box'}} />
          </div>
          <div style={{marginBottom:'24px'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}>
              <span style={{fontSize:'12px',color:'#666'}}>Password</span>
              <a href="/forgot-password" style={{fontSize:'12px',color:gold,textDecoration:'none'}}>Forgot password?</a>
            </div>
            <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="••••••••"
              style={{width:'100%',padding:'12px 14px',backgroundColor:'#0d0d0d',border:'1px solid #2a2a2a',borderRadius:'6px',color:'#fff',fontSize:'14px',outline:'none',boxSizing:'border-box'}} />
          </div>
          <button onClick={handleSubmit} disabled={loading}
            style={{width:'100%',padding:'14px',backgroundColor:gold,color:'#050505',fontWeight:'700',borderRadius:'6px',border:'none',cursor:'pointer',fontSize:'15px'}}>
            {loading ? 'Signing in...' : 'Sign in →'}
          </button>
          <div style={{marginTop:'24px',textAlign:'center',fontSize:'13px',color:'#555'}}>
            Don&#39;t have an account?{' '}
            <a href="/register" style={{color:gold,textDecoration:'none'}}>Request access</a>
          </div>
        </div>
        <div style={{marginTop:'24px',padding:'16px 20px',border:'1px solid #111',borderRadius:'8px',backgroundColor:'#080808',display:'flex',gap:'12px',alignItems:'flex-start'}}>
          <div style={{fontSize:'16px',color:gold}}>◈</div>
          <div style={{fontSize:'12px',color:'#444',lineHeight:'1.7'}}>BEI is an invitation-only intelligence platform. Account access requires approval from the BEI team.</div>
        </div>
      </div>
    </main>
  )
}
