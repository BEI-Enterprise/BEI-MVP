'use client'
import { useState, useEffect } from 'react'
import { createClient } from '../../lib/supabase'

export default function AccountPage() {
  const gold = '#C8A24A'
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) return <main style={{backgroundColor:'#050505',minHeight:'100vh'}}/>

  const plans = [
    { id: 'analysis', name: 'MRI Analysis', price: '£199', features: ['Full MRI Report', 'Health Score', 'Constraint Detection', 'Monthly Updates'] },
    { id: 'opportunity', name: 'Analysis + Opportunity', price: '£399', features: ['Everything in Analysis', 'Opportunity Mapping', 'Prioritisation Engine'], popular: true },
    { id: 'platform', name: 'Full Platform', price: '£999', features: ['Everything above', 'Deployment Engine', 'Outcome Tracking', 'Learning Engine'] },
  ]

  return (
    <main style={{backgroundColor:'#050505',color:'#fff',fontFamily:'Inter,system-ui,sans-serif',minHeight:'100vh'}}>
      <nav style={{padding:'0 48px',borderBottom:'1px solid #161616',display:'flex',justifyContent:'space-between',alignItems:'center',height:'68px',backgroundColor:'rgba(5,5,5,0.97)',backdropFilter:'blur(12px)',position:'sticky' as const,top:0,zIndex:100}}>
        <a href="/" style={{fontSize:'20px',fontWeight:'800',color:gold,letterSpacing:'0.12em',textDecoration:'none'}}>BEI</a>
        <div style={{display:'flex',gap:'24px',alignItems:'center'}}>
          <a href="/dashboard" style={{fontSize:'13px',color:'#666',textDecoration:'none'}}>Dashboard</a>
          <button onClick={handleSignOut} style={{fontSize:'13px',color:'#666',background:'none',border:'none',cursor:'pointer',padding:0}}>Sign out</button>
        </div>
      </nav>

      <div style={{maxWidth:'800px',margin:'0 auto',padding:'48px 24px'}}>

        {/* Account header */}
        <div style={{marginBottom:'48px'}}>
          <div style={{fontSize:'11px',color:gold,letterSpacing:'0.2em',textTransform:'uppercase' as const,marginBottom:'8px'}}>Account</div>
          <h1 style={{fontSize:'32px',fontWeight:'700',marginBottom:'8px'}}>Your Account</h1>
          <div style={{fontSize:'14px',color:'#555'}}>{user?.email}</div>
        </div>

        {/* Current subscription */}
        <div style={{marginBottom:'48px',padding:'28px',border:'1px solid #1a1a1a',borderRadius:'8px',backgroundColor:'#080808'}}>
          <div style={{fontSize:'11px',color:'#555',letterSpacing:'0.15em',textTransform:'uppercase' as const,marginBottom:'16px'}}>Current Plan</div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <div style={{fontSize:'18px',fontWeight:'600',marginBottom:'4px'}}>Free Account</div>
              <div style={{fontSize:'13px',color:'#555'}}>MRI generation only — subscribe to unlock full intelligence platform</div>
            </div>
            <a href="/pricing" style={{padding:'10px 24px',backgroundColor:gold,color:'#050505',fontWeight:'700',borderRadius:'4px',textDecoration:'none',fontSize:'13px',flexShrink:0,marginLeft:'24px'}}>Upgrade →</a>
          </div>
        </div>

        {/* Plan options */}
        <div style={{marginBottom:'48px'}}>
          <div style={{fontSize:'16px',fontWeight:'600',marginBottom:'20px'}}>Available Plans</div>
          <div style={{display:'flex',flexDirection:'column' as const,gap:'12px'}}>
            {plans.map(plan => (
              <div key={plan.id} style={{padding:'20px 24px',border:`1px solid ${(plan as any).popular?gold:'#1a1a1a'}`,borderRadius:'8px',backgroundColor:(plan as any).popular?'#0d0a04':'#080808',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px'}}>
                    <div style={{fontSize:'15px',fontWeight:'600'}}>{plan.name}</div>
                    {(plan as any).popular && <div style={{fontSize:'10px',padding:'2px 8px',backgroundColor:gold,color:'#050505',fontWeight:'700',borderRadius:'10px'}}>POPULAR</div>}
                  </div>
                  <div style={{display:'flex',gap:'12px',flexWrap:'wrap' as const}}>
                    {plan.features.map(f => (
                      <span key={f} style={{fontSize:'12px',color:'#555'}}>✓ {f}</span>
                    ))}
                  </div>
                </div>
                <div style={{textAlign:'right' as const,flexShrink:0,marginLeft:'24px'}}>
                  <div style={{fontSize:'20px',fontWeight:'700',color:(plan as any).popular?gold:'#fff',marginBottom:'8px'}}>{plan.price}/mo</div>
                  <a href="/pricing" style={{padding:'8px 20px',border:`1px solid ${gold}`,color:gold,borderRadius:'4px',textDecoration:'none',fontSize:'12px',fontWeight:'600'}}>Select →</a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account details */}
        <div style={{marginBottom:'48px',padding:'28px',border:'1px solid #1a1a1a',borderRadius:'8px',backgroundColor:'#080808'}}>
          <div style={{fontSize:'11px',color:'#555',letterSpacing:'0.15em',textTransform:'uppercase' as const,marginBottom:'20px'}}>Account Details</div>
          <div style={{display:'flex',flexDirection:'column' as const,gap:'16px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingBottom:'16px',borderBottom:'1px solid #111'}}>
              <div>
                <div style={{fontSize:'13px',color:'#666',marginBottom:'2px'}}>Email address</div>
                <div style={{fontSize:'15px'}}>{user?.email || '—'}</div>
              </div>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingBottom:'16px',borderBottom:'1px solid #111'}}>
              <div>
                <div style={{fontSize:'13px',color:'#666',marginBottom:'2px'}}>Account status</div>
                <div style={{fontSize:'15px',color:'#4aaa4a'}}>Active</div>
              </div>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div style={{fontSize:'13px',color:'#666',marginBottom:'2px'}}>Member since</div>
                <div style={{fontSize:'15px'}}>{user?.created_at ? new Date(user.created_at).toLocaleDateString('en-GB', {day:'numeric',month:'long',year:'numeric'}) : '—'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div style={{padding:'24px',border:'1px solid #2a1a1a',borderRadius:'8px',backgroundColor:'#0a0808'}}>
          <div style={{fontSize:'13px',color:'#555',marginBottom:'16px'}}>Sign out of your BEI account on this device.</div>
          <button onClick={handleSignOut}
            style={{padding:'10px 24px',border:'1px solid #cc4444',color:'#cc4444',backgroundColor:'transparent',borderRadius:'4px',fontSize:'13px',cursor:'pointer',fontWeight:'600'}}>
            Sign out
          </button>
        </div>

      </div>
    </main>
  )
}
