'use client'
import Nav from '../components/Nav'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '../../lib/supabase'
import { useCurrency, getCurrencySymbol } from '../../lib/currency'

export default function AccountPage() {
  const gold = '#C8A24A'
  const ADMIN_EMAILS = ['admin@bei.io', 'hello@bei.io', 'jacob.fisher@hamptonhillsgroup.com']
  const currency = useCurrency()
  const sym = getCurrencySymbol(currency)
  const [user, setUser] = useState<any>(null)
  const isAdmin = ADMIN_EMAILS.includes(user?.email || '')
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
  const bgRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = bgRef.current
    if (!canvas) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const nodes = Array.from({ length: 35 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, r: Math.random() * 2 + 1
    }))
    let raf: number
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1
      })
      nodes.forEach((a, i) => nodes.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y)
        if (d < 140) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = 'rgba(200,162,74,' + (0.12 * (1 - d / 140)) + ')'
          ctx.lineWidth = 0.5; ctx.stroke()
        }
      }))
      nodes.forEach(n => {
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(200,162,74,0.4)'; ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])

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
      const { error } = await supabase.from('businesses').delete().eq('id', id)
      if (error) console.error('Delete error:', error)
    }
    // Reload businesses list after deletion
    const supabase2 = createClient()
    const { data: fresh } = await supabase2
      .from('businesses')
      .select('id, business_name, industry, subscription_tier, subscription_status, location_country')
      .eq('email', (user as any)?.email)
      .order('updated_at', { ascending: false })
    const freshList = Array.isArray(fresh) ? fresh : []
    setAllBusinesses(freshList)
    const firstBiz = freshList.length > 0 ? freshList[0] : null
    setBusiness(firstBiz)
    if (firstBiz) {
      setIndustryValue((firstBiz as any).industry || '')
      setLocationValue((firstBiz as any).location_country || '')
    }
    setDeleteBusinessConfirm(false)
    setSelectedBusinessIds([])
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
    { id: 'analysis', name: 'MRI Analysis', price: 199, features: ['Full MRI Report', 'Health Score', 'Constraint Detection', 'Monthly Updates'] },
    { id: 'opportunity', name: 'Analysis + Opportunity', price: 399, features: ['Everything in Analysis', 'Opportunity Mapping', 'Prioritisation Engine'], popular: true },
    { id: 'platform', name: 'Full Platform', price: 999, features: ['Everything above', 'Deployment Engine', 'Outcome Tracking', 'Learning Engine'] },
    { id: 'corporate', name: 'Corporate Group', price: 1599, features: ['Everything in Full Platform', 'Up to 3 businesses', 'Portfolio dashboard', 'Group risk overview', 'Executive briefing pack'], badge: 'MULTI-BUSINESS' },
    { id: 'enterprise', name: 'Enterprise', price: null, features: ['Everything in Corporate', 'Custom benchmark system', 'Unlimited businesses', 'Dedicated intelligence team', 'Board-level reporting'], badge: 'ENTERPRISE', enquire: true },
  ]

  return (
    <main style={{ backgroundColor: '#050505', color: '#fff', minHeight: '100vh', fontFamily: 'Inter,system-ui,sans-serif', position: 'relative' as const }}>

      {/* Animated background */}
      <div style={{ position: 'fixed' as const, inset: 0, zIndex: 0, pointerEvents: 'none' as const, overflow: 'hidden' }}>
        <canvas ref={bgRef} style={{ position: 'absolute' as const, inset: 0, width: '100vw', height: '100vh', opacity: 0.15 }} />
      </div>

      <div style={{ position: 'relative' as const, zIndex: 1 }}>
        <Nav />

        {/* Cinematic header */}
        <div style={{ padding: '48px 48px 32px', borderBottom: '1px solid #161616', background: 'linear-gradient(180deg, rgba(200,162,74,0.04) 0%, transparent 100%)' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.3em', marginBottom: '10px', fontWeight: '600' }}>YOUR ACCOUNT</div>
            <div style={{ fontSize: '32px', fontWeight: '800', marginBottom: '6px', letterSpacing: '-0.01em' }}>
              {user?.email?.split('@')[0] || 'Account'}
            </div>
            <div style={{ fontSize: '13px', color: '#888', marginBottom: '20px' }}>{user?.email}</div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const }}>
              <div style={{ padding: '6px 16px', backgroundColor: 'rgba(200,162,74,0.08)', border: '1px solid rgba(200,162,74,0.2)', borderRadius: '20px', fontSize: '12px', color: gold, fontWeight: '600' }}>
                {(business?.subscription_tier || 'free').toUpperCase()} PLAN
              </div>
              <div style={{ padding: '6px 16px', backgroundColor: 'rgba(74,170,74,0.06)', border: '1px solid rgba(74,170,74,0.2)', borderRadius: '20px', fontSize: '12px', color: '#4aaa4a', fontWeight: '600' }}>
                ● ACTIVE
              </div>
              {isAdmin && (
                <a href="/admin" style={{ padding: '6px 16px', backgroundColor: 'rgba(200,162,74,0.15)', border: '1px solid rgba(200,162,74,0.4)', borderRadius: '20px', fontSize: '12px', color: gold, fontWeight: '700', textDecoration: 'none' }}>
                  ⚡ ADMIN INTERFACE →
                </a>
              )}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 48px' }}>

          {/* Back to dashboard */}
          <a href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#888', textDecoration: 'none', marginBottom: '32px' }}>
            ← Back to Dashboard
          </a>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
            {[
              { label: 'Current Plan', value: (business?.subscription_tier || 'Free').toUpperCase(), color: gold },
              { label: 'Industry', value: (business?.industry || '—').replace(/_/g, ' '), color: '#e0e0e0' },
              { label: 'Businesses', value: allBusinesses.length.toString(), color: '#4aaa4a' },
            ].map(s => (
              <div key={s.label}
                style={{ padding: '24px', backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a', borderLeft: '3px solid ' + s.color, borderRadius: '8px', transition: 'all 0.3s ease', cursor: 'default' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor = '#0d0d0d'; el.style.boxShadow = '0 0 24px rgba(200,162,74,0.1)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor = '#0a0a0a'; el.style.boxShadow = 'none' }}
              >
                <div style={{ fontSize: '10px', color: '#888', letterSpacing: '0.15em', marginBottom: '10px' }}>{s.label.toUpperCase()}</div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: s.color, textTransform: 'capitalize' as const }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Industry selector */}
          <div style={{ padding: '28px', backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '10px', marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', color: '#888', letterSpacing: '0.2em', marginBottom: '16px', fontWeight: '600' }}>BUSINESS TYPE</div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' as const, marginBottom: '16px' }}>
              {[
                { value: 'estate_agency', label: '🏠 Estate Agency' },
                { value: 'marketing_agency', label: '📈 Marketing Agency' },
                { value: 'accountancy_firm', label: '📊 Accountancy' },
              ].map(opt => (
                <button key={opt.value} onClick={() => setIndustryValue(opt.value)}
                  style={{ padding: '10px 20px', backgroundColor: industryValue === opt.value ? 'rgba(200,162,74,0.12)' : '#111', border: '1px solid ' + (industryValue === opt.value ? 'rgba(200,162,74,0.4)' : '#2a2a2a'), borderRadius: '6px', color: industryValue === opt.value ? gold : '#666', fontSize: '13px', cursor: 'pointer', fontWeight: industryValue === opt.value ? '600' : '400', fontFamily: 'Inter,system-ui,sans-serif', transition: 'all 0.2s ease' }}>
                  {opt.label}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button onClick={saveIndustry} disabled={industrySaving || !industryValue}
                style={{ padding: '10px 24px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '6px', border: 'none', cursor: industryValue ? 'pointer' : 'not-allowed', fontSize: '13px', opacity: industryValue ? 1 : 0.5 }}>
                {industrySaving ? 'Saving...' : 'Save'}
              </button>
              {industrySaved && <span style={{ fontSize: '12px', color: '#4aaa4a', fontWeight: '600' }}>✓ Saved</span>}
            </div>
          </div>

          {/* Current subscription */}
          <div style={{ padding: '28px', backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '10px', marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', color: '#888', letterSpacing: '0.2em', marginBottom: '16px', fontWeight: '600' }}>CURRENT SUBSCRIPTION</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: '16px' }}>
              <div>
                <div style={{ fontSize: '22px', fontWeight: '800', color: gold, marginBottom: '4px', textTransform: 'capitalize' as const }}>
                  {business?.subscription_tier || 'Free'} Plan
                </div>
                <div style={{ fontSize: '13px', color: '#888' }}>
                  Status: <span style={{ color: business?.subscription_status === 'active' ? '#4aaa4a' : '#888', fontWeight: '600' }}>{business?.subscription_status || 'inactive'}</span>
                </div>
              </div>
              <a href="/pricing" style={{ padding: '10px 24px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '6px', textDecoration: 'none', fontSize: '13px' }}>
                Upgrade Plan →
              </a>
            </div>
          </div>

          {/* Plan cards */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', color: '#888', letterSpacing: '0.2em', marginBottom: '16px', fontWeight: '600' }}>AVAILABLE PLANS</div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
              {[
                { id: 'analysis', name: 'MRI Analysis', price: 199, features: ['Full MRI Report', 'Health Score', 'Constraint Detection', 'Monthly Updates'] },
                { id: 'opportunity', name: 'Analysis + Opportunity', price: 399, features: ['Everything in Analysis', 'Opportunity Mapping', 'Prioritisation Engine'], popular: true },
                { id: 'platform', name: 'Full Platform', price: 999, features: ['Everything above', 'Deployment Engine', 'Outcome Tracking', 'Learning Engine'] },
                { id: 'corporate', name: 'Corporate Group', price: 1599, features: ['Everything in Full Platform', 'Up to 3 businesses', 'Portfolio dashboard', 'Group risk overview', 'Executive briefing pack'], badge: 'MULTI-BUSINESS' },
                { id: 'enterprise', name: 'Enterprise', price: null, features: ['Everything in Corporate', 'Custom benchmark system', 'Unlimited businesses', 'Dedicated intelligence team', 'Board-level reporting'], badge: 'ENTERPRISE', enquire: true },
              ].map(plan => (
                <div key={plan.id}
                  style={{ padding: '20px 24px', border: '1px solid ' + ((plan as any).popular ? gold : '#1a1a1a'), borderRadius: '8px', backgroundColor: (plan as any).popular ? '#0d0a04' : '#080808', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.3s ease', cursor: 'default' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(200,162,74,0.4)'; el.style.boxShadow = '0 0 20px rgba(200,162,74,0.08)' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = (plan as any).popular ? gold : '#1a1a1a'; el.style.boxShadow = 'none' }}
                >
                  <div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#e0e0e0' }}>{plan.name}</div>
                      {(plan as any).popular && <div style={{ fontSize: '10px', padding: '2px 8px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '10px' }}>POPULAR</div>}
                      {(plan as any).badge && !(plan as any).popular && <div style={{ fontSize: '10px', padding: '2px 8px', backgroundColor: 'rgba(200,162,74,0.15)', color: gold, fontWeight: '700', borderRadius: '10px', border: '1px solid rgba(200,162,74,0.3)' }}>{(plan as any).badge}</div>}
                    </div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const }}>
                      {plan.features.slice(0, 3).map(f => (
                        <span key={f} style={{ fontSize: '11px', color: '#888' }}>✓ {f}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' as const, flexShrink: 0, marginLeft: '16px' }}>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: (plan as any).popular || (plan as any).badge ? gold : '#fff', marginBottom: '8px' }}>
                      {(plan as any).enquire ? '' : sym}{(plan as any).enquire ? sym + '2,500–' + sym + '25,000/mo' : (plan.price as number).toLocaleString() + '/mo'}
                    </div>
                    <a href="/pricing" style={{ padding: '8px 20px', border: '1px solid ' + gold, color: gold, borderRadius: '4px', textDecoration: 'none', fontSize: '12px', fontWeight: '600' }}>
                      {(plan as any).enquire ? 'Enquire →' : 'Select →'}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Account details */}
          <div style={{ padding: '28px', backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '10px', marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', color: '#888', letterSpacing: '0.2em', marginBottom: '16px', fontWeight: '600' }}>ACCOUNT DETAILS</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '10px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '6px' }}>EMAIL</div>
                <div style={{ fontSize: '14px', color: '#888' }}>{user?.email}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: '#aaa', letterSpacing: '0.1em', marginBottom: '6px' }}>MEMBER SINCE</div>
                <div style={{ fontSize: '14px', color: '#888' }}>{user?.created_at ? new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}</div>
              </div>
            </div>
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #1a1a1a', display: 'flex', gap: '10px' }}>
              <button onClick={handleSignOut} style={{ padding: '10px 20px', backgroundColor: 'transparent', color: '#999', border: '1px solid #2a2a2a', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontFamily: 'Inter,system-ui,sans-serif' }}>
                Sign Out
              </button>
            </div>
          </div>

          {/* Danger zone */}
          <div>
            {allBusinesses.length > 0 && (
              <div style={{ marginBottom: '20px', padding: '28px', border: '1px solid rgba(204,68,68,0.3)', borderRadius: '10px', backgroundColor: 'rgba(204,68,68,0.03)' }}>
                <div style={{ fontSize: '11px', color: '#cc4444', letterSpacing: '0.2em', marginBottom: '8px', fontWeight: '600' }}>DANGER ZONE</div>
                <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '6px' }}>Delete Businesses</div>
                <div style={{ fontSize: '13px', color: '#888', marginBottom: '20px', lineHeight: '1.6' }}>Select one or more businesses to permanently delete. All MRI data will be removed. This cannot be undone.</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ fontSize: '12px', color: '#888' }}>{selectedBusinessIds.length} of {allBusinesses.length} selected</div>
                  <button onClick={selectAllBusinesses} style={{ padding: '6px 14px', backgroundColor: 'transparent', color: '#999', border: '1px solid #333', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontFamily: 'Inter,system-ui,sans-serif' }}>
                    {selectedBusinessIds.length === allBusinesses.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px', marginBottom: '20px' }}>
                  {allBusinesses.map((b: any) => (
                    <div key={b.id} onClick={() => toggleSelectBusiness(b.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: selectedBusinessIds.includes(b.id) ? 'rgba(204,68,68,0.08)' : '#0a0a0a', border: '1px solid ' + (selectedBusinessIds.includes(b.id) ? 'rgba(204,68,68,0.4)' : '#1a1a1a'), borderRadius: '6px', cursor: 'pointer' }}>
                      <div style={{ width: '18px', height: '18px', borderRadius: '4px', border: '2px solid ' + (selectedBusinessIds.includes(b.id) ? '#cc4444' : '#333'), backgroundColor: selectedBusinessIds.includes(b.id) ? '#cc4444' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {selectedBusinessIds.includes(b.id) && <span style={{ color: '#fff', fontSize: '11px', fontWeight: '700' }}>✓</span>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: selectedBusinessIds.includes(b.id) ? '#f0f0f0' : '#888' }}>{b.business_name || 'Unnamed Business'}</div>
                        <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>{b.industry || 'No industry set'} · {b.subscription_tier || 'analysis'} plan</div>
                      </div>
                    </div>
                  ))}
                </div>
                {!deleteBusinessConfirm ? (
                  <button onClick={() => selectedBusinessIds.length > 0 && setDeleteBusinessConfirm(true)} disabled={selectedBusinessIds.length === 0}
                    style={{ padding: '10px 20px', backgroundColor: 'transparent', color: selectedBusinessIds.length > 0 ? '#cc4444' : '#444', border: '1px solid ' + (selectedBusinessIds.length > 0 ? '#cc4444' : '#333'), borderRadius: '4px', cursor: selectedBusinessIds.length > 0 ? 'pointer' : 'not-allowed', fontSize: '13px', fontWeight: '600', fontFamily: 'Inter,system-ui,sans-serif' }}>
                    Delete {selectedBusinessIds.length > 0 ? selectedBusinessIds.length + ' Business' + (selectedBusinessIds.length > 1 ? 'es' : '') : 'Selected'}
                  </button>
                ) : (
                  <div style={{ padding: '16px', backgroundColor: 'rgba(204,68,68,0.06)', border: '1px solid rgba(204,68,68,0.2)', borderRadius: '6px' }}>
                    <div style={{ fontSize: '13px', color: '#cc4444', fontWeight: '700', marginBottom: '12px' }}>Are you sure? This is permanent and cannot be undone.</div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={deleteBusiness} disabled={deleting} style={{ padding: '10px 20px', backgroundColor: '#cc4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: 'Inter,system-ui,sans-serif' }}>
                        {deleting ? 'Deleting...' : 'Yes, Delete'}
                      </button>
                      <button onClick={() => setDeleteBusinessConfirm(false)} style={{ padding: '10px 16px', backgroundColor: 'transparent', color: '#999', border: '1px solid #333', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontFamily: 'Inter,system-ui,sans-serif' }}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div style={{ padding: '28px', border: '1px solid rgba(204,68,68,0.3)', borderRadius: '10px', backgroundColor: 'rgba(204,68,68,0.03)' }}>
              <div style={{ fontSize: '11px', color: '#cc4444', letterSpacing: '0.2em', marginBottom: '8px', fontWeight: '600' }}>DELETE ACCOUNT</div>
              <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '6px' }}>Permanently Delete Your Account</div>
              <div style={{ fontSize: '13px', color: '#888', marginBottom: '20px', lineHeight: '1.6' }}>This will permanently delete your account, all business data, MRI reports and login credentials. This cannot be undone.</div>
              {!deleteAccountConfirm ? (
                <button onClick={() => setDeleteAccountConfirm(true)} style={{ padding: '10px 20px', backgroundColor: 'transparent', color: '#cc4444', border: '1px solid #cc4444', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', fontFamily: 'Inter,system-ui,sans-serif' }}>
                  Delete My Account
                </button>
              ) : (
                <div style={{ padding: '16px', backgroundColor: 'rgba(204,68,68,0.06)', border: '1px solid rgba(204,68,68,0.2)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '14px', color: '#cc4444', fontWeight: '700', marginBottom: '8px' }}>⚠ Final confirmation — this cannot be reversed.</div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                    <button onClick={deleteAccount} disabled={deleting} style={{ padding: '10px 20px', backgroundColor: '#cc4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: 'Inter,system-ui,sans-serif' }}>
                      {deleting ? 'Deleting...' : 'Yes, delete everything permanently'}
                    </button>
                    <button onClick={() => setDeleteAccountConfirm(false)} style={{ padding: '10px 16px', backgroundColor: 'transparent', color: '#999', border: '1px solid #333', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontFamily: 'Inter,system-ui,sans-serif' }}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}