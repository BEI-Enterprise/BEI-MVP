'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '../../lib/supabase'

const gold = '#C8A24A'
const dark = '#050505'
const card = '#0a0a0a'
const border = '#1e1e1e'
const ADMIN_EMAILS = ['admin@bei.io', 'hello@bei.io', 'jacob.fisher@hamptonhillsgroup.com']
const TIER_PRICES: Record<string, number> = { analysis: 199, opportunity: 399, platform: 999, corporate: 1599 }
const TIER_COLORS: Record<string, string> = { analysis: '#4a8ab0', opportunity: '#C8A24A', platform: '#4aaa4a', corporate: '#cc4444' }

function NetworkGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    const nodes = Array.from({ length: 28 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
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
        if (d < 120) {
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = `rgba(200,162,74,${0.12 * (1 - d / 120)})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }))
      nodes.forEach(n => {
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(200,162,74,0.5)'
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])
  return <canvas ref={canvasRef} style={{ position: 'absolute' as const, inset: 0, width: '100%', height: '100%', opacity: 0.4 }} />
}

function GlowCard({ label, value, color, sub }: { label: string, value: string, color: string, sub?: string }) {
  return (
    <div
      style={{ padding: '24px', backgroundColor: card, border: '1px solid ' + border, borderLeft: '3px solid ' + color, borderRadius: '8px', transition: 'all 0.3s ease', cursor: 'default' }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 0 24px rgba(200,162,74,0.15)'; el.style.backgroundColor = '#0d0d0d' }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = 'none'; el.style.backgroundColor = card }}
    >
      <div style={{ fontSize: '10px', color: '#555', letterSpacing: '0.15em', marginBottom: '10px' }}>{label}</div>
      <div style={{ fontSize: '28px', fontWeight: '800', color }}>{value}</div>
      {sub && <div style={{ fontSize: '11px', color: '#444', marginTop: '6px' }}>{sub}</div>}
    </div>
  )
}

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [businesses, setBusinesses] = useState<any[]>([])
  const [meetings, setMeetings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [unauthorized, setUnauthorized] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview'|'users'|'meetings'|'health'>('overview')
  const [actionMsg, setActionMsg] = useState('')
  const [actioning, setActioning] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterIndustry, setFilterIndustry] = useState('')
  const [filterPlan, setFilterPlan] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [railwayStatus, setRailwayStatus] = useState<'checking'|'online'|'offline'>('checking')

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u || !ADMIN_EMAILS.includes(u.email || '')) { setUnauthorized(true); setLoading(false); return }
      setUser(u)
      const { data: bizData } = await supabase
        .from('businesses')
        .select('id, business_name, email, industry, subscription_tier, subscription_status, stripe_customer_id, status, mri_completed, mri_requested, created_at, annual_revenue_band, location_country, mri_version')
        .order('created_at', { ascending: false })
      setBusinesses(bizData || [])
      const { data: meetData } = await supabase
        .from('meetings')
        .select('id, business_id, meeting_type, status, notes, reviewed_by_admin, requested_at, businesses(business_name, email)')
        .order('requested_at', { ascending: false })
        .limit(100)
      setMeetings(meetData || [])
      setLoading(false)
      // Ping Railway
      try {
        const r = await fetch('https://mindful-reverence-production-e010.up.railway.app/health', { signal: AbortSignal.timeout(5000) })
        setRailwayStatus(r.ok ? 'online' : 'offline')
      } catch { setRailwayStatus('offline') }
    }
    load()
  }, [])

  const toast = (msg: string) => { setActionMsg(msg); setTimeout(() => setActionMsg(''), 3000) }

  const deactivate = async (id: string, name: string) => {
    setActioning(id)
    const supabase = createClient()
    await supabase.from('businesses').update({ status: 'suspended' }).eq('id', id)
    setBusinesses(prev => prev.map(b => b.id === id ? { ...b, status: 'suspended' } : b))
    toast(name + ' suspended'); setActioning(null)
  }

  const reactivate = async (id: string, name: string) => {
    setActioning(id)
    const supabase = createClient()
    await supabase.from('businesses').update({ status: 'active' }).eq('id', id)
    setBusinesses(prev => prev.map(b => b.id === id ? { ...b, status: 'active' } : b))
    toast(name + ' reactivated'); setActioning(null)
  }

  const cancelSub = async (id: string, stripeId: string, name: string) => {
    if (!stripeId) { toast('No Stripe ID'); return }
    setActioning(id)
    const res = await fetch('/api/admin/cancel-subscription', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stripe_customer_id: stripeId, business_id: id }) })
    if (res.ok) { setBusinesses(prev => prev.map(b => b.id === id ? { ...b, subscription_status: 'inactive', subscription_tier: 'free' } : b)); toast(name + ' subscription cancelled') }
    else toast('Cancel failed'); setActioning(null)
  }

  const markReviewed = async (id: string) => {
    const supabase = createClient()
    await supabase.from('meetings').update({ reviewed_by_admin: true }).eq('id', id)
    setMeetings(prev => prev.map(m => m.id === id ? { ...m, reviewed_by_admin: true } : m))
  }

  const updateMeetingStatus = async (id: string, status: string) => {
    const supabase = createClient()
    await supabase.from('meetings').update({ status, reviewed_by_admin: true }).eq('id', id)
    setMeetings(prev => prev.map(m => m.id === id ? { ...m, status, reviewed_by_admin: true } : m))
    toast('Meeting updated')
  }

  if (loading) return <main style={{ backgroundColor: dark, color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter,system-ui,sans-serif' }}><div style={{ fontSize: '13px', color: '#555' }}>Loading...</div></main>
  if (unauthorized) return <main style={{ backgroundColor: dark, color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter,system-ui,sans-serif' }}><div style={{ textAlign: 'center' as const }}><div style={{ fontSize: '11px', color: '#cc4444', letterSpacing: '0.2em', marginBottom: '12px' }}>ACCESS DENIED</div><a href="/dashboard" style={{ color: gold, textDecoration: 'none' }}>← Dashboard</a></div></main>

  // Stats
  const now = new Date()
  const thisMonth = businesses.filter(b => new Date(b.created_at) > new Date(now.getFullYear(), now.getMonth(), 1))
  const mriDone = businesses.filter(b => b.mri_completed)
  const activeSubs = businesses.filter(b => b.subscription_status === 'active' && b.subscription_tier !== 'free')
  const mrr = activeSubs.reduce((s, b) => s + (TIER_PRICES[b.subscription_tier] || 0), 0)
  const mriRate = businesses.length > 0 ? Math.round((mriDone.length / businesses.length) * 100) : 0
  const unreviewed = meetings.filter(m => !m.reviewed_by_admin)

  // Filtered/sorted businesses
  let filtered = businesses
  if (search) filtered = filtered.filter(b => (b.business_name || '').toLowerCase().includes(search.toLowerCase()) || (b.email || '').toLowerCase().includes(search.toLowerCase()))
  if (filterIndustry) filtered = filtered.filter(b => b.industry === filterIndustry)
  if (filterPlan) filtered = filtered.filter(b => b.subscription_tier === filterPlan)
  if (sortBy === 'created_at') filtered = [...filtered].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  if (sortBy === 'plan') filtered = [...filtered].sort((a, b) => (TIER_PRICES[b.subscription_tier] || 0) - (TIER_PRICES[a.subscription_tier] || 0))
  if (sortBy === 'mri') filtered = [...filtered].sort((a, b) => (b.mri_completed ? 1 : 0) - (a.mri_completed ? 1 : 0))

  // Calendar for meetings tab
  const calDays = Array.from({ length: new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() }, (_, i) => i + 1)
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay()
  const adjFirst = firstDay === 0 ? 6 : firstDay - 1
  const meetingDays = new Set(meetings.map(m => new Date(m.requested_at).getDate()))

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Users (' + businesses.length + ')' },
    { id: 'meetings', label: 'Meetings' + (unreviewed.length > 0 ? ' · ' + unreviewed.length + ' new' : '') },
    { id: 'health', label: 'Platform Health' },
  ]

  return (
    <main style={{ backgroundColor: dark, color: '#fff', minHeight: '100vh', fontFamily: 'Inter,system-ui,sans-serif' }}>

      {/* Cinematic header */}
      <div style={{ position: 'relative' as const, height: '140px', overflow: 'hidden', borderBottom: '1px solid #161616' }}>
        <NetworkGraph />
        <div style={{ position: 'absolute' as const, inset: 0, background: 'linear-gradient(90deg, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.7) 50%, rgba(5,5,5,0.95) 100%)' }} />
        <div style={{ position: 'absolute' as const, inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px' }}>
          <div>
            <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.3em', marginBottom: '8px', fontWeight: '600' }}>BEI — ADMIN INTERFACE</div>
            <div style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.01em' }}>Platform Command Centre</div>
            <div style={{ fontSize: '13px', color: '#555', marginTop: '4px' }}>{user?.email}</div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', padding: '6px 14px', backgroundColor: 'rgba(74,170,74,0.1)', border: '1px solid rgba(74,170,74,0.2)', borderRadius: '20px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4aaa4a', boxShadow: '0 0 6px rgba(74,170,74,0.8)' }} />
              <span style={{ fontSize: '11px', color: '#4aaa4a', fontWeight: '600' }}>LIVE</span>
            </div>
            <a href="/account" style={{ fontSize: '13px', color: gold, textDecoration: 'none', fontWeight: '600', padding: '8px 16px', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '6px' }}>User View →</a>
            <a href="/dashboard" style={{ padding: '8px 18px', border: '1px solid #2a2a2a', borderRadius: '6px', fontSize: '13px', color: '#777', textDecoration: 'none' }}>Dashboard</a>
          </div>
        </div>
      </div>

      {/* Toast */}
      {actionMsg && <div style={{ position: 'fixed' as const, top: '20px', right: '24px', padding: '12px 20px', backgroundColor: '#4aaa4a', color: '#fff', borderRadius: '6px', fontSize: '13px', fontWeight: '600', zIndex: 200 }}>✓ {actionMsg}</div>}

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 48px' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid #1a1a1a', marginBottom: '32px' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id as any)} style={{ padding: '12px 28px', background: 'none', border: 'none', borderBottom: '2px solid ' + (activeTab === t.id ? gold : 'transparent'), color: activeTab === t.id ? gold : '#555', fontSize: '14px', fontWeight: activeTab === t.id ? '600' : '400', cursor: 'pointer', fontFamily: 'Inter,system-ui,sans-serif', transition: 'color 0.2s' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '14px', marginBottom: '32px' }}>
              <GlowCard label="TOTAL BUSINESSES" value={businesses.length.toString()} color={gold} />
              <GlowCard label="NEW THIS MONTH" value={thisMonth.length.toString()} color="#4aaa4a" sub={now.toLocaleString('default', { month: 'long' })} />
              <GlowCard label="MRIs COMPLETED" value={mriDone.length.toString()} color="#4a8ab0" />
              <GlowCard label="MRI RATE" value={mriRate + '%'} color={mriRate >= 50 ? '#4aaa4a' : gold} />
              <GlowCard label="MONTHLY REVENUE" value={'£' + mrr.toLocaleString()} color={gold} />
              <GlowCard label="ANNUAL REVENUE" value={'£' + (mrr * 12).toLocaleString()} color="#4aaa4a" />
            </div>

            {/* Revenue chart */}
            <div style={{ padding: '28px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', marginBottom: '24px' }}>
              <div style={{ fontSize: '11px', color: '#555', letterSpacing: '0.2em', marginBottom: '24px', fontWeight: '600' }}>REVENUE BY TIER</div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', height: '160px' }}>
                {['analysis', 'opportunity', 'platform', 'corporate'].map(tier => {
                  const count = businesses.filter(b => b.subscription_tier === tier && b.subscription_status === 'active').length
                  const rev = count * (TIER_PRICES[tier] || 0)
                  const maxRev = Math.max(...['analysis', 'opportunity', 'platform', 'corporate'].map(t => businesses.filter(b => b.subscription_tier === t && b.subscription_status === 'active').length * (TIER_PRICES[t] || 0)), 1)
                  const pct = Math.max((rev / maxRev) * 100, count > 0 ? 8 : 2)
                  return (
                    <div key={tier} style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                      <div style={{ fontSize: '12px', color: TIER_COLORS[tier], fontWeight: '700' }}>£{rev.toLocaleString()}</div>
                      <div style={{ width: '100%', height: pct + '%', backgroundColor: TIER_COLORS[tier], borderRadius: '4px 4px 0 0', opacity: count > 0 ? 0.85 : 0.15, transition: 'height 0.5s ease', minHeight: '4px' }} />
                      <div style={{ fontSize: '10px', color: '#555', textTransform: 'capitalize' as const, letterSpacing: '0.05em' }}>{tier}</div>
                      <div style={{ fontSize: '11px', color: '#444' }}>{count} active</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Recent businesses */}
            <div style={{ padding: '28px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px' }}>
              <div style={{ fontSize: '11px', color: '#555', letterSpacing: '0.2em', marginBottom: '20px', fontWeight: '600' }}>RECENT SIGNUPS</div>
              {businesses.slice(0, 6).map(b => (
                <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #111' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#e0e0e0' }}>{b.business_name}</div>
                    <div style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>{b.email} · {new Date(b.created_at).toLocaleDateString('en-GB')}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: TIER_COLORS[b.subscription_tier] || '#555', fontWeight: '600', textTransform: 'capitalize' as const }}>{b.subscription_tier || 'free'}</span>
                    <span style={{ fontSize: '11px', color: b.mri_completed ? '#4aaa4a' : '#555' }}>{b.mri_completed ? '✓ MRI done' : 'No MRI'}</span>
                    <a href={'/report/' + b.id} style={{ fontSize: '12px', color: gold, textDecoration: 'none' }}>Report →</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USERS */}
        {activeTab === 'users' && (
          <div>
            {/* Filters */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' as const }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or email..." style={{ flex: 1, minWidth: '200px', padding: '10px 16px', backgroundColor: '#111', border: '1px solid #2a2a2a', borderRadius: '6px', color: '#fff', fontSize: '13px', outline: 'none', fontFamily: 'Inter,system-ui,sans-serif' }} />
              <select value={filterIndustry} onChange={e => setFilterIndustry(e.target.value)} style={{ padding: '10px 14px', backgroundColor: '#111', border: '1px solid #2a2a2a', borderRadius: '6px', color: '#fff', fontSize: '13px', outline: 'none' }}>
                <option value="">All Industries</option>
                <option value="estate_agency">Estate Agency</option>
                <option value="marketing_agency">Marketing Agency</option>
                <option value="accountancy_firm">Accountancy</option>
              </select>
              <select value={filterPlan} onChange={e => setFilterPlan(e.target.value)} style={{ padding: '10px 14px', backgroundColor: '#111', border: '1px solid #2a2a2a', borderRadius: '6px', color: '#fff', fontSize: '13px', outline: 'none' }}>
                <option value="">All Plans</option>
                <option value="analysis">Analysis</option>
                <option value="opportunity">Opportunity</option>
                <option value="platform">Platform</option>
                <option value="corporate">Corporate</option>
                <option value="free">Free</option>
              </select>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '10px 14px', backgroundColor: '#111', border: '1px solid #2a2a2a', borderRadius: '6px', color: '#fff', fontSize: '13px', outline: 'none' }}>
                <option value="created_at">Sort: Newest</option>
                <option value="plan">Sort: Plan Value</option>
                <option value="mri">Sort: MRI Status</option>
              </select>
              <div style={{ fontSize: '13px', color: '#555', display: 'flex', alignItems: 'center' }}>{filtered.length} results</div>
            </div>

            {/* Table */}
            <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 0.8fr 0.8fr 160px', padding: '12px 20px', backgroundColor: '#111', borderBottom: '1px solid #1a1a1a' }}>
                {['Business', 'Industry', 'Plan', 'Status', 'MRI', 'Actions'].map(h => (
                  <div key={h} style={{ fontSize: '10px', color: '#555', letterSpacing: '0.15em', fontWeight: '600' }}>{h.toUpperCase()}</div>
                ))}
              </div>
              {filtered.map(b => (
                <div key={b.id}>
                  <div
                    onClick={() => setExpandedRow(expandedRow === b.id ? null : b.id)}
                    style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 0.8fr 0.8fr 160px', padding: '14px 20px', borderBottom: '1px solid #111', alignItems: 'center', cursor: 'pointer', transition: 'background 0.2s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#0d0d0d'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = expandedRow === b.id ? '#0d0d0d' : 'transparent'}
                  >
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#e0e0e0' }}>{b.business_name}</div>
                      <div style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>{b.email}</div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#777', textTransform: 'capitalize' as const }}>{(b.industry || '').replace(/_/g, ' ')}</div>
                    <div style={{ fontSize: '12px', color: TIER_COLORS[b.subscription_tier] || '#555', fontWeight: '600', textTransform: 'capitalize' as const }}>{b.subscription_tier || 'free'}</div>
                    <div><span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '10px', backgroundColor: b.status === 'active' ? 'rgba(74,170,74,0.1)' : 'rgba(204,68,68,0.1)', color: b.status === 'active' ? '#4aaa4a' : '#cc4444', fontWeight: '600' }}>{b.status || 'active'}</span></div>
                    <div style={{ fontSize: '12px', color: b.mri_completed ? '#4aaa4a' : '#555' }}>{b.mri_completed ? '✓' : '—'}</div>
                    <div style={{ display: 'flex', gap: '6px' }} onClick={e => e.stopPropagation()}>
                      {b.status === 'suspended' ? (
                        <button onClick={() => reactivate(b.id, b.business_name)} disabled={actioning === b.id} style={{ padding: '5px 10px', backgroundColor: 'transparent', color: '#4aaa4a', border: '1px solid #4aaa4a', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}>Reactivate</button>
                      ) : (
                        <button onClick={() => deactivate(b.id, b.business_name)} disabled={actioning === b.id} style={{ padding: '5px 10px', backgroundColor: 'transparent', color: '#cc4444', border: '1px solid #cc4444', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}>Suspend</button>
                      )}
                      {b.subscription_status === 'active' && b.stripe_customer_id && (
                        <button onClick={() => cancelSub(b.id, b.stripe_customer_id, b.business_name)} disabled={actioning === b.id} style={{ padding: '5px 8px', backgroundColor: 'transparent', color: '#888', border: '1px solid #333', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>Cancel</button>
                      )}
                    </div>
                  </div>
                  {expandedRow === b.id && (
                    <div style={{ padding: '20px 24px', backgroundColor: '#0d0d0d', borderBottom: '1px solid #1a1a1a', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                      {[
                        { label: 'Revenue Band', value: (b.annual_revenue_band || '—').replace(/_/g, ' ') },
                        { label: 'Location', value: b.location_country || '—' },
                        { label: 'MRI Version', value: b.mri_version || '—' },
                        { label: 'Stripe ID', value: b.stripe_customer_id ? b.stripe_customer_id.slice(0, 18) + '...' : '—' },
                        { label: 'Joined', value: new Date(b.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) },
                        { label: 'Sub Status', value: b.subscription_status || '—' },
                        { label: 'MRI Requested', value: b.mri_requested ? 'Yes' : 'No' },
                        { label: 'Business ID', value: b.id.slice(0, 16) + '...' },
                      ].map(f => (
                        <div key={f.label}>
                          <div style={{ fontSize: '10px', color: '#555', letterSpacing: '0.1em', marginBottom: '4px' }}>{f.label.toUpperCase()}</div>
                          <div style={{ fontSize: '13px', color: '#999' }}>{f.value}</div>
                        </div>
                      ))}
                      <div style={{ gridColumn: 'span 4', paddingTop: '12px', borderTop: '1px solid #1a1a1a', display: 'flex', gap: '10px' }}>
                        <a href={'/report/' + b.id} style={{ fontSize: '12px', color: gold, textDecoration: 'none', fontWeight: '600' }}>View MRI Report →</a>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {filtered.length === 0 && <div style={{ padding: '40px', textAlign: 'center' as const, fontSize: '13px', color: '#444' }}>No businesses match your filters.</div>}
            </div>
          </div>
        )}

        {/* MEETINGS */}
        {activeTab === 'meetings' && (
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px' }}>
            {/* Calendar */}
            <div style={{ padding: '24px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', alignSelf: 'start' }}>
              <div style={{ fontSize: '11px', color: '#555', letterSpacing: '0.2em', marginBottom: '16px', fontWeight: '600' }}>
                {now.toLocaleString('default', { month: 'long' }).toUpperCase()} {now.getFullYear()}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '6px' }}>
                {['M','T','W','T','F','S','S'].map((d, i) => <div key={i} style={{ fontSize: '10px', color: '#555', textAlign: 'center' as const, padding: '4px 0', fontWeight: '600' }}>{d}</div>)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
                {Array.from({ length: adjFirst }, (_, i) => <div key={'e' + i} />)}
                {calDays.map(day => (
                  <div key={day} style={{ padding: '6px 2px', textAlign: 'center' as const, fontSize: '12px', borderRadius: '4px', backgroundColor: day === now.getDate() ? gold : meetingDays.has(day) ? 'rgba(200,162,74,0.15)' : 'transparent', color: day === now.getDate() ? '#050505' : meetingDays.has(day) ? gold : day < now.getDate() ? '#333' : '#ccc', fontWeight: day === now.getDate() || meetingDays.has(day) ? '700' : '400' }}>
                    {day}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #1a1a1a' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: gold }} />
                  <span style={{ fontSize: '11px', color: '#555' }}>Today</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'rgba(200,162,74,0.3)' }} />
                  <span style={{ fontSize: '11px', color: '#555' }}>Has meetings</span>
                </div>
              </div>
              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #1a1a1a' }}>
                <div style={{ fontSize: '10px', color: '#555', marginBottom: '8px', letterSpacing: '0.1em' }}>SUMMARY</div>
                <div style={{ fontSize: '13px', color: '#888', marginBottom: '4px' }}>{meetings.length} total requests</div>
                <div style={{ fontSize: '13px', color: unreviewed.length > 0 ? gold : '#555' }}>{unreviewed.length} unreviewed</div>
              </div>
            </div>

            {/* Meeting cards */}
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
              {meetings.length === 0 && <div style={{ padding: '40px', textAlign: 'center' as const, backgroundColor: card, border: '1px solid ' + border, borderRadius: '8px', fontSize: '13px', color: '#444' }}>No meeting requests yet.</div>}
              {meetings.map(m => (
                <div key={m.id} style={{ padding: '20px 24px', backgroundColor: card, border: '1px solid ' + (m.reviewed_by_admin ? border : 'rgba(200,162,74,0.3)'), borderRadius: '8px', position: 'relative' as const }}>
                  {!m.reviewed_by_admin && <div style={{ position: 'absolute' as const, top: '14px', right: '14px', fontSize: '10px', color: gold, backgroundColor: 'rgba(200,162,74,0.1)', padding: '3px 10px', borderRadius: '10px', fontWeight: '600' }}>NEW</div>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', paddingRight: m.reviewed_by_admin ? '0' : '60px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#e0e0e0', marginBottom: '4px' }}>{(m.businesses as any)?.business_name || 'Unknown'}</div>
                      <div style={{ fontSize: '12px', color: '#555' }}>{(m.businesses as any)?.email} · {m.meeting_type} · {new Date(m.requested_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    </div>
                    <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '10px', flexShrink: 0, backgroundColor: m.status === 'completed' ? 'rgba(74,170,74,0.1)' : m.status === 'scheduled' ? 'rgba(74,138,176,0.1)' : m.status === 'cancelled' ? 'rgba(204,68,68,0.1)' : 'rgba(200,162,74,0.1)', color: m.status === 'completed' ? '#4aaa4a' : m.status === 'scheduled' ? '#4a8ab0' : m.status === 'cancelled' ? '#cc4444' : gold, fontWeight: '600' }}>{m.status.toUpperCase()}</span>
                  </div>
                  {m.notes && <div style={{ padding: '12px 16px', backgroundColor: '#111', borderRadius: '6px', fontSize: '13px', color: '#999', lineHeight: '1.7', marginBottom: '14px', borderLeft: '3px solid rgba(200,162,74,0.3)' }}>{m.notes}</div>}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
                    {m.status !== 'scheduled' && <button onClick={() => updateMeetingStatus(m.id, 'scheduled')} style={{ padding: '6px 14px', backgroundColor: 'transparent', color: '#4a8ab0', border: '1px solid #4a8ab0', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}>Mark Scheduled</button>}
                    {m.status !== 'completed' && <button onClick={() => updateMeetingStatus(m.id, 'completed')} style={{ padding: '6px 14px', backgroundColor: 'transparent', color: '#4aaa4a', border: '1px solid #4aaa4a', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}>Mark Complete</button>}
                    {m.status !== 'cancelled' && <button onClick={() => updateMeetingStatus(m.id, 'cancelled')} style={{ padding: '6px 14px', backgroundColor: 'transparent', color: '#cc4444', border: '1px solid #cc4444', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>}
                    {!m.reviewed_by_admin && <button onClick={() => markReviewed(m.id)} style={{ padding: '6px 14px', backgroundColor: 'transparent', color: gold, border: '1px solid rgba(200,162,74,0.4)', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}>Mark Reviewed</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PLATFORM HEALTH */}
        {activeTab === 'health' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ padding: '28px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px' }}>
              <div style={{ fontSize: '11px', color: '#555', letterSpacing: '0.2em', marginBottom: '20px', fontWeight: '600' }}>INTELLIGENCE SERVER</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: railwayStatus === 'online' ? '#4aaa4a' : railwayStatus === 'offline' ? '#cc4444' : '#888', boxShadow: railwayStatus === 'online' ? '0 0 8px rgba(74,170,74,0.8)' : 'none' }} />
                <div style={{ fontSize: '16px', fontWeight: '700', color: railwayStatus === 'online' ? '#4aaa4a' : railwayStatus === 'offline' ? '#cc4444' : '#888' }}>
                  {railwayStatus === 'online' ? 'Online' : railwayStatus === 'offline' ? 'Offline' : 'Checking...'}
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#555', marginBottom: '8px' }}>Railway — Python Intelligence Server</div>
              <div style={{ fontSize: '11px', color: '#444' }}>mindful-reverence-production-e010.up.railway.app</div>
            </div>

            <div style={{ padding: '28px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px' }}>
              <div style={{ fontSize: '11px', color: '#555', letterSpacing: '0.2em', marginBottom: '20px', fontWeight: '600' }}>SUPABASE</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#4aaa4a', boxShadow: '0 0 8px rgba(74,170,74,0.8)' }} />
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#4aaa4a' }}>Connected</div>
              </div>
              <div style={{ fontSize: '12px', color: '#555', marginBottom: '8px' }}>Database — businesses, meetings, audit_log</div>
              <div style={{ fontSize: '11px', color: '#444' }}>{businesses.length} business records loaded</div>
            </div>

            <div style={{ padding: '28px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px' }}>
              <div style={{ fontSize: '11px', color: '#555', letterSpacing: '0.2em', marginBottom: '20px', fontWeight: '600' }}>STRIPE</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: activeSubs.length > 0 ? '#4aaa4a' : '#888', boxShadow: activeSubs.length > 0 ? '0 0 8px rgba(74,170,74,0.8)' : 'none' }} />
                <div style={{ fontSize: '16px', fontWeight: '700', color: activeSubs.length > 0 ? '#4aaa4a' : '#888' }}>{activeSubs.length > 0 ? 'Active' : 'No active subs'}</div>
              </div>
              <div style={{ fontSize: '12px', color: '#555', marginBottom: '8px' }}>{activeSubs.length} active subscriptions</div>
              <div style={{ fontSize: '11px', color: '#444' }}>MRR: £{mrr.toLocaleString()} · ARR: £{(mrr * 12).toLocaleString()}</div>
            </div>

            <div style={{ padding: '28px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px' }}>
              <div style={{ fontSize: '11px', color: '#555', letterSpacing: '0.2em', marginBottom: '20px', fontWeight: '600' }}>VERCEL</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#4aaa4a', boxShadow: '0 0 8px rgba(74,170,74,0.8)' }} />
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#4aaa4a' }}>Live</div>
              </div>
              <div style={{ fontSize: '12px', color: '#555', marginBottom: '8px' }}>officialbei.com — Next.js 16</div>
              <a href="https://vercel.com/bei-enterprise" target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: gold, textDecoration: 'none' }}>Open Vercel Dashboard →</a>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}
