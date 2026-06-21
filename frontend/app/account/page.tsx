'use client'
import Nav from '../components/Nav'
import { useState, useEffect } from 'react'
import { createClient } from '../../lib/supabase'

export default function AccountPage() {
  const gold = '#C8A24A'
  const [user, setUser] = useState<any>(null)
  const [business, setBusiness] = useState<any>(null)
  const [allBusinesses, setAllBusinesses] = useState<any[]>([])
  const [selectedBusinessIds, setSelectedBusinessIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [industryValue, setIndustryValue] = useState('')
  const [industrySaving, setIndustrySaving] = useState(false)
  const [industrySaved, setIndustrySaved] = useState(false)
  const [locationValue, setLocationValue] = useState('')
  const [locationSaving, setLocationSaving] = useState(false)
  const [locationSaved, setLocationSaved] = useState(false)
  const [deleteBusinessConfirm, setDeleteBusinessConfirm] = useState(false)
  const [deleteAccountConfirm, setDeleteAccountConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user)
      if (data.user) {
        const { data: bizArr } = await supabase
          .from('businesses')
          .select('id, business_name, industry, subscription_tier, subscription_status, location_country')
          .eq('email', data.user.email)
          .order('updated_at', { ascending: false })
        const bizList = Array.isArray(bizArr) ? bizArr : []
        setAllBusinesses(bizList)
        const biz = bizList.length > 0 ? bizList[0] : null
        if (biz && (biz as any).id) {
          setBusiness(biz)
          setIndustryValue((biz as any).industry || '')
          setLocationValue((biz as any).location_country || '')
        }
      }
      setLoading(false)
    })
  }, [])

  const saveLocation = async () => {
    if (!business || !locationValue) return
    setLocationSaving(true)
    const supabase = createClient()
    const { error: locErr } = await supabase.from('businesses').update({ location_country: locationValue }).eq('id', business.id); if (locErr) console.error('Location save error:', locErr)
    setLocationSaving(false)
    setLocationSaved(true)
    setTimeout(() => setLocationSaved(false), 3000)
  }

  const saveIndustry = async () => {
    if (!business || !industryValue) return
    setIndustrySaving(true)
    const supabase = createClient()
    const { error: indErr } = await supabase.from('businesses').update({ industry: industryValue }).eq('id', business.id); if (indErr) console.error('Industry save error:', indErr)
    setIndustrySaving(false)
    setIndustrySaved(true)
    setTimeout(() => setIndustrySaved(false), 3000)
  }

  const toggleSelectBusiness = (id: string) => {
    setSelectedBusinessIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const selectAllBusinesses = () => {
    if (selectedBusinessIds.length === allBusinesses.length) {
      setSelectedBusinessIds([])
    } else {
      setSelectedBusinessIds(allBusinesses.map((b: any) => b.id))
    }
  }

  const deleteBusiness = async () => {
    if (selectedBusinessIds.length === 0) return
    setDeleting(true)
    const supabase = createClient()
    for (const id of selectedBusinessIds) {
      await supabase.from('businesses').delete().eq('id', id)
    }
    setDeleting(false)
    setDeleteBusinessConfirm(false)
    setSelectedBusinessIds([])
    // Reload businesses list in account page
    const supabase2 = createClient()
    const { data: fresh } = await supabase2
      .from('businesses')
      .select('id, business_name, industry, subscription_tier, subscription_status, location_country')
      .eq('email', user?.email)
      .order('updated_at', { ascending: false })
    setAllBusinesses(Array.isArray(fresh) ? fresh : [])
    const firstBiz = Array.isArray(fresh) && fresh.length > 0 ? fresh[0] : null
    setBusiness(firstBiz)
    setDeleting(false)
  }

  const deleteAccount = async () => {
    if (!user) return
    setDeleting(true)
    const supabase = createClient()
    await supabase.from('businesses').delete().eq('email', user.email)
    await supabase.auth.admin?.deleteUser(user.id).catch(() => {})
    await supabase.auth.signOut()
    window.location.href = '/'
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
          {/* Delete business */}
          {allBusinesses.length > 0 && (
            <div style={{marginBottom:'32px',padding:'28px',border:'1px solid rgba(204,68,68,0.3)',borderRadius:'8px',backgroundColor:'rgba(204,68,68,0.03)'}}>
              <div style={{fontSize:'11px',color:'#cc4444',letterSpacing:'0.2em',textTransform:'uppercase' as const,marginBottom:'8px',fontWeight:'600'}}>Danger Zone</div>
              <div style={{fontSize:'16px',fontWeight:'700',marginBottom:'4px'}}>Delete Businesses</div>
              <div style={{fontSize:'13px',color:'#555',marginBottom:'20px',lineHeight:'1.6'}}>
                Select one or more businesses to permanently delete. All associated MRI data will be removed. This cannot be undone.
              </div>

              {/* Select all toggle */}
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
                <div style={{fontSize:'12px',color:'#555'}}>{selectedBusinessIds.length} of {allBusinesses.length} selected</div>
                <button onClick={selectAllBusinesses} style={{padding:'6px 14px',backgroundColor:'transparent',color:'#666',border:'1px solid #333',borderRadius:'4px',cursor:'pointer',fontSize:'12px'}}>
                  {selectedBusinessIds.length === allBusinesses.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              {/* Business list with checkboxes */}
              <div style={{display:'flex',flexDirection:'column' as const,gap:'8px',marginBottom:'20px'}}>
                {allBusinesses.map((b: any) => (
                  <div key={b.id} onClick={() => toggleSelectBusiness(b.id)} style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px 16px',backgroundColor:selectedBusinessIds.includes(b.id)?'rgba(204,68,68,0.08)':'#0a0a0a',border:`1px solid ${selectedBusinessIds.includes(b.id)?'rgba(204,68,68,0.4)':'#1a1a1a'}`,borderRadius:'6px',cursor:'pointer'}}>
                    <div style={{width:'18px',height:'18px',borderRadius:'4px',border:`2px solid ${selectedBusinessIds.includes(b.id)?'#cc4444':'#333'}`,backgroundColor:selectedBusinessIds.includes(b.id)?'#cc4444':'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                      {selectedBusinessIds.includes(b.id) && <span style={{color:'#fff',fontSize:'11px',fontWeight:'700'}}>✓</span>}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:'14px',fontWeight:'600',color:selectedBusinessIds.includes(b.id)?'#f0f0f0':'#888'}}>{b.business_name || 'Unnamed Business'}</div>
                      <div style={{fontSize:'11px',color:'#444',marginTop:'2px'}}>{b.industry || 'No industry set'} · {b.subscription_tier || 'analysis'} plan</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delete button */}
              {!deleteBusinessConfirm ? (
                <button
                  onClick={() => selectedBusinessIds.length > 0 && setDeleteBusinessConfirm(true)}
                  disabled={selectedBusinessIds.length === 0}
                  style={{padding:'10px 20px',backgroundColor:'transparent',color:selectedBusinessIds.length>0?'#cc4444':'#444',border:`1px solid ${selectedBusinessIds.length>0?'#cc4444':'#333'}`,borderRadius:'4px',cursor:selectedBusinessIds.length>0?'pointer':'not-allowed',fontSize:'13px',fontWeight:'600'}}
                >
                  Delete {selectedBusinessIds.length > 0 ? `${selectedBusinessIds.length} Business${selectedBusinessIds.length>1?'es':''}` : 'Selected'}
                </button>
              ) : (
                <div style={{padding:'16px',backgroundColor:'rgba(204,68,68,0.06)',border:'1px solid rgba(204,68,68,0.2)',borderRadius:'6px'}}>
                  <div style={{fontSize:'13px',color:'#cc4444',fontWeight:'700',marginBottom:'8px'}}>
                    Are you sure? This will permanently delete {selectedBusinessIds.length} business{selectedBusinessIds.length>1?'es':''} and all their data.
                  </div>
                  <div style={{display:'flex',gap:'10px',marginTop:'12px'}}>
                    <button onClick={deleteBusiness} disabled={deleting} style={{padding:'10px 20px',backgroundColor:'#cc4444',color:'#fff',border:'none',borderRadius:'4px',cursor:'pointer',fontSize:'13px',fontWeight:'700'}}>
                      {deleting ? 'Deleting...' : `Yes, Delete ${selectedBusinessIds.length} Business${selectedBusinessIds.length>1?'es':''}`}
                    </button>
                    <button onClick={() => setDeleteBusinessConfirm(false)} style={{padding:'10px 16px',backgroundColor:'transparent',color:'#666',border:'1px solid #333',borderRadius:'4px',cursor:'pointer',fontSize:'13px'}}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Delete account */}
          <div style={{marginBottom:'32px',padding:'28px',border:'1px solid rgba(204,68,68,0.3)',borderRadius:'8px',backgroundColor:'rgba(204,68,68,0.03)'}}>
            <div style={{fontSize:'11px',color:'#cc4444',letterSpacing:'0.2em',textTransform:'uppercase' as const,marginBottom:'8px',fontWeight:'600'}}>Delete Account</div>
            <div style={{fontSize:'16px',fontWeight:'700',marginBottom:'6px'}}>Permanently Delete Your Account</div>
            <div style={{fontSize:'13px',color:'#555',marginBottom:'20px',lineHeight:'1.6'}}>
              This will permanently delete your account, all business data, MRI reports and login credentials. This cannot be undone.
            </div>
            {!deleteAccountConfirm ? (
              <button onClick={() => setDeleteAccountConfirm(true)} style={{padding:'10px 20px',backgroundColor:'transparent',color:'#cc4444',border:'1px solid #cc4444',borderRadius:'4px',cursor:'pointer',fontSize:'13px',fontWeight:'600'}}>
                Delete My Account
              </button>
            ) : (
              <div style={{padding:'16px',backgroundColor:'rgba(204,68,68,0.06)',border:'1px solid rgba(204,68,68,0.2)',borderRadius:'6px'}}>
                <div style={{fontSize:'14px',color:'#cc4444',fontWeight:'700',marginBottom:'8px'}}>⚠ Final confirmation</div>
                <div style={{fontSize:'13px',color:'#888',marginBottom:'16px',lineHeight:'1.6'}}>
                  You are about to permanently delete your BEI account and all data. This cannot be reversed.
                </div>
                <div style={{display:'flex',gap:'10px'}}>
                  <button onClick={deleteAccount} disabled={deleting} style={{padding:'10px 20px',backgroundColor:'#cc4444',color:'#fff',border:'none',borderRadius:'4px',cursor:'pointer',fontSize:'13px',fontWeight:'700'}}>
                    {deleting ? 'Deleting...' : 'Yes, delete everything permanently'}
                  </button>
                  <button onClick={() => setDeleteAccountConfirm(false)} style={{padding:'10px 16px',backgroundColor:'transparent',color:'#666',border:'1px solid #333',borderRadius:'4px',cursor:'pointer',fontSize:'13px'}}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <button onClick={handleSignOut}
            style={{padding:'10px 24px',border:'1px solid #cc4444',color:'#cc4444',backgroundColor:'transparent',borderRadius:'4px',fontSize:'13px',cursor:'pointer',fontWeight:'600'}}>
            Sign out
          </button>
        </div>

      </div>
    </main>
  )
}
