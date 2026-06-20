'use client'
import Nav from '../components/Nav'
import { useState, useEffect } from 'react'
import { createClient } from '../../lib/supabase'

export default function AccountPage() {
  const gold = '#C8A24A'
  const [user, setUser] = useState<any>(null)
  const [business, setBusiness] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [industryValue, setIndustryValue] = useState('')
  const [industrySaving, setIndustrySaving] = useState(false)
  const [industrySaved, setIndustrySaved] = useState(false)
  const [locationValue, setLocationValue] = useState('')
  const [locationSaving, setLocationSaving] = useState(false)
  const [locationSaved, setLocationSaved] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user)
      if (data.user) {
        const { data: biz } = await supabase
          .from('businesses')
          .select('id, business_name, industry, subscription_tier, subscription_status, location_country')
          .eq('email', data.user.email)
          .order('updated_at', { ascending: false })
          .limit(1)
          .single()
        if (biz) {
          setBusiness(biz)
          setIndustryValue(biz.industry || '')
          setLocationValue(biz.location_country || '')
        }
      }
      setLoading(false)
    })
  }, [])

  const saveLocation = async () => {
    if (!business || !locationValue) return
    setLocationSaving(true)
    const supabase = createClient()
    await supabase.from('businesses').update({ location_country: locationValue }).eq('id', business.id)
    setLocationSaving(false)
    setLocationSaved(true)
    setTimeout(() => setLocationSaved(false), 3000)
  }

  const saveIndustry = async () => {
    if (!business || !industryValue) return
    setIndustrySaving(true)
    const supabase = createClient()
    await supabase.from('businesses').update({ industry: industryValue }).eq('id', business.id)
    setIndustrySaving(false)
    setIndustrySaved(true)
    setTimeout(() => setIndustrySaved(false), 3000)
  }

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
    { id: 'corporate', name: 'Corporate Group', price: '£1,599', features: ['Everything in Full Platform', 'Up to 3 businesses', 'Portfolio dashboard', 'Group risk overview', 'Executive briefing pack'], badge: 'MULTI-BUSINESS' },
    { id: 'enterprise', name: 'Enterprise', price: '£2,500–£25,000', features: ['Everything in Corporate', 'Custom benchmark system', 'Unlimited businesses', 'Dedicated intelligence team', 'Board-level reporting'], badge: 'ENTERPRISE', enquire: true },
  ]

  return (
    <main style={{ backgroundColor: '#050505', color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', minHeight: '100vh' }}>
      <Nav />

      <div style={{maxWidth:'800px',margin:'0 auto',padding:'48px 24px'}}>

        {/* Back to dashboard */}
        <div style={{marginBottom:'24px'}}>
          <a href='/dashboard' style={{display:'inline-flex',alignItems:'center',gap:'6px',fontSize:'13px',color:'#555',textDecoration:'none',padding:'8px 16px',border:'1px solid #1a1a1a',borderRadius:'4px',backgroundColor:'#080808'}}>
            ← Back to Dashboard
          </a>
        </div>
        {/* Account header */}
        <div style={{marginBottom:'48px'}}>
          <div style={{fontSize:'11px',color:gold,letterSpacing:'0.2em',textTransform:'uppercase' as const,marginBottom:'8px'}}>Account</div>
          <h1 style={{fontSize:'32px',fontWeight:'700',marginBottom:'8px'}}>Your Account</h1>
          <div style={{fontSize:'14px',color:'#555'}}>{user?.email}</div>
        </div>

        {/* Business type selector */}
        <div style={{marginBottom:'32px',padding:'28px',border:'1px solid #1a1a1a',borderRadius:'8px',backgroundColor:'#0a0a0a'}}>
          <div style={{fontSize:'11px',color:gold,letterSpacing:'0.2em',textTransform:'uppercase' as const,marginBottom:'6px'}}>Business Intelligence Settings</div>
          <div style={{fontSize:'16px',fontWeight:'700',marginBottom:'4px'}}>Business Type</div>
          <div style={{fontSize:'13px',color:'#555',marginBottom:'20px',lineHeight:'1.6'}}>Select your business category. This tells BEI which industry benchmarks, market signals and intelligence framework to apply to your MRI reports and dashboard.</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px',marginBottom:'20px'}}>
            {[
              { value: 'Estate Agency', label: 'Estate Agency', desc: 'Property sales, lettings, valuations' },
              { value: 'Marketing Agency', label: 'Marketing Agency', desc: 'Digital, creative, performance agencies' },
              { value: 'Accounting', label: 'Accounting & Finance', desc: 'Accountancy firms, bookkeeping, advisory' },
            ].map(opt => (
              <button key={opt.value} onClick={() => setIndustryValue(opt.value)} style={{padding:'16px',backgroundColor:industryValue===opt.value?'rgba(200,162,74,0.08)':'#080808',border:`1px solid ${industryValue===opt.value?'rgba(200,162,74,0.4)':'#1a1a1a'}`,borderRadius:'8px',textAlign:'left' as const,cursor:'pointer'}}>
                <div style={{fontSize:'14px',fontWeight:'700',color:industryValue===opt.value?gold:'#ccc',marginBottom:'4px'}}>{opt.label}</div>
                <div style={{fontSize:'11px',color:'#555',lineHeight:'1.5'}}>{opt.desc}</div>
                {industryValue===opt.value && <div style={{fontSize:'10px',color:gold,marginTop:'6px',fontWeight:'600'}}>◈ SELECTED</div>}
              </button>
            ))}
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
            <button onClick={saveIndustry} disabled={industrySaving||!industryValue} style={{padding:'10px 24px',backgroundColor:industryValue?gold:'#1a1a1a',color:industryValue?'#050505':'#444',fontWeight:'700',borderRadius:'4px',border:'none',cursor:industryValue?'pointer':'not-allowed',fontSize:'13px'}}>
              {industrySaving?'Saving...':'Save Business Type'}
            </button>
            {industrySaved && <div style={{fontSize:'12px',color:'#4aaa4a',fontWeight:'600'}}>✓ Saved — dashboard intelligence updated</div>}
            {business?.industry && !industrySaved && <div style={{fontSize:'12px',color:'#555'}}>Current: {business.industry}</div>}
          </div>
        </div>

        {/* Location selector */}
        <div style={{marginBottom:'32px',padding:'28px',border:'1px solid #1a1a1a',borderRadius:'8px',backgroundColor:'#0a0a0a'}}>
          <div style={{fontSize:'11px',color:gold,letterSpacing:'0.2em',textTransform:'uppercase' as const,marginBottom:'6px'}}>Location Settings</div>
          <div style={{fontSize:'16px',fontWeight:'700',marginBottom:'4px'}}>Your Location</div>
          <div style={{fontSize:'13px',color:'#555',marginBottom:'20px',lineHeight:'1.6'}}>Select your location. This sets your currency display across the entire platform — UK shows £ and US shows $.</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'12px',marginBottom:'20px'}}>
            {[
              { value: 'United Kingdom', label: '🇬🇧 United Kingdom', desc: 'All prices shown in £ GBP' },
              { value: 'United States', label: '🇺🇸 United States', desc: 'All prices shown in $ USD' },
            ].map(opt => (
              <button key={opt.value} onClick={() => setLocationValue(opt.value)} style={{padding:'16px',backgroundColor:locationValue===opt.value?'rgba(200,162,74,0.08)':'#080808',border:`1px solid ${locationValue===opt.value?'rgba(200,162,74,0.4)':'#1a1a1a'}`,borderRadius:'8px',textAlign:'left' as const,cursor:'pointer'}}>
                <div style={{fontSize:'16px',fontWeight:'700',color:locationValue===opt.value?gold:'#ccc',marginBottom:'4px'}}>{opt.label}</div>
                <div style={{fontSize:'11px',color:'#555',lineHeight:'1.5'}}>{opt.desc}</div>
                {locationValue===opt.value && <div style={{fontSize:'10px',color:gold,marginTop:'6px',fontWeight:'600'}}>◈ SELECTED</div>}
              </button>
            ))}
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
            <button onClick={saveLocation} disabled={locationSaving||!locationValue} style={{padding:'10px 24px',backgroundColor:locationValue?gold:'#1a1a1a',color:locationValue?'#050505':'#444',fontWeight:'700',borderRadius:'4px',border:'none',cursor:locationValue?'pointer':'not-allowed',fontSize:'13px'}}>
              {locationSaving?'Saving...':'Save Location'}
            </button>
            {locationSaved && <div style={{fontSize:'12px',color:'#4aaa4a',fontWeight:'600'}}>✓ Saved — currency updated across platform</div>}
            {business?.location_country && !locationSaved && <div style={{fontSize:'12px',color:'#555'}}>Current: {business.location_country}</div>}
          </div>
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
                    {(plan as any).popular && <div style={{fontSize:'10px',padding:'2px 8px',backgroundColor:gold,color:'#050505',fontWeight:'700',borderRadius:'10px'}}>POPULAR</div>}{(plan as any).badge && !(plan as any).popular && <div style={{fontSize:'10px',padding:'2px 8px',backgroundColor:'rgba(200,162,74,0.15)',color:gold,fontWeight:'700',borderRadius:'10px',border:'1px solid rgba(200,162,74,0.3)'}}>{(plan as any).badge}</div>}
                  </div>
                  <div style={{display:'flex',gap:'12px',flexWrap:'wrap' as const}}>
                    {plan.features.map(f => (
                      <span key={f} style={{fontSize:'12px',color:'#555'}}>✓ {f}</span>
                    ))}
                  </div>
                </div>
                <div style={{textAlign:'right' as const,flexShrink:0,marginLeft:'24px'}}>
                  <div style={{fontSize:'20px',fontWeight:'700',color:(plan as any).popular||(plan as any).badge?gold:'#fff',marginBottom:'8px'}}>{(plan as any).enquire?'Custom':(plan as any).badge&&plan.id==='corporate'?'£1,599/mo':plan.price+'/mo'}</div>
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
