'use client'
import { useState, useEffect } from 'react'
import { createClient } from '../../lib/supabase'

const gold = '#C8A24A'
const dark = '#050505'
const card = '#0a0a0a'
const border = '#1e1e1e'

const ADMIN_EMAILS = ['admin@bei.io', 'hello@bei.io']

const TIER_PRICES: Record<string, number> = {
  analysis: 199,
  opportunity: 399,
  platform: 999,
  corporate: 1599,
}

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [businesses, setBusinesses] = useState<any[]>([])
  const [meetings, setMeetings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [unauthorized, setUnauthorized] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview'|'users'|'meetings'>('overview')
  const [actionMsg, setActionMsg] = useState('')
  const [actioning, setActioning] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u || !ADMIN_EMAILS.includes(u.email || '')) {
        setUnauthorized(true)
        setLoading(false)
        return
      }
      setUser(u)
      const { data: bizData } = await supabase
        .from('businesses')
        .select('id, business_name, email, industry, subscription_tier, subscription_status, stripe_customer_id, status, mri_completed, mri_requested, created_at, annual_revenue_band')
        .order('created_at', { ascending: false })
      setBusinesses(bizData || [])
      const { data: meetData } = await supabase
        .from('meetings')
        .select('id, business_id, meeting_type, status, notes, reviewed_by_admin, requested_at, businesses(business_name, email)')
        .order('requested_at', { ascending: false })
        .limit(50)
      setMeetings(meetData || [])
      setLoading(false)
    }
    load()
  }, [])

  const deactivateBusiness = async (id: string, name: string) => {
    setActioning(id)
    const supabase = createClient()
    const { error } = await supabase.from('businesses').update({ status: 'suspended' }).eq('id', id)
    if (!error) {
      setBusinesses(prev => prev.map(b => b.id === id ? { ...b, status: 'suspended' } : b))
      setActionMsg(`${name} suspended`)
      setTimeout(() => setActionMsg(''), 3000)
    }
    setActioning(null)
  }

  const reactivateBusiness = async (id: string, name: string) => {
    setActioning(id)
    const supabase = createClient()
    const { error } = await supabase.from('businesses').update({ status: 'active' }).eq('id', id)
    if (!error) {
      setBusinesses(prev => prev.map(b => b.id === id ? { ...b, status: 'active' } : b))
      setActionMsg(`${name} reactivated`)
      setTimeout(() => setActionMsg(''), 3000)
    }
    setActioning(null)
  }

  const cancelSubscription = async (id: string, stripeCustomerId: string, name: string) => {
    if (!stripeCustomerId) { setActionMsg('No Stripe customer ID — cannot cancel'); return }
    setActioning(id)
    try {
      const res = await fetch('/api/admin/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stripe_customer_id: stripeCustomerId, business_id: id }),
      })
      if (res.ok) {
        setBusinesses(prev => prev.map(b => b.id === id ? { ...b, subscription_status: 'inactive', subscription_tier: 'free' } : b))
        setActionMsg(`${name} subscription cancelled`)
        setTimeout(() => setActionMsg(''), 3000)
      } else {
        setActionMsg('Cancel failed — check Stripe')
      }
    } catch {
      setActionMsg('Cancel failed — network error')
    }
    setActioning(null)
  }

  const markMeetingReviewed = async (meetingId: string) => {
    const supabase = createClient()
    await supabase.from('meetings').update({ reviewed_by_admin: true }).eq('id', meetingId)
    setMeetings(prev => prev.map(m => m.id === meetingId ? { ...m, reviewed_by_admin: true } : m))
  }

  if (loading) return (
    <main style={{ backgroundColor: dark, color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter,system-ui,sans-serif' }}>
      <div style={{ fontSize: '13px', color: '#555' }}>Loading admin interface...</div>
    </main>
  )

  if (unauthorized) return (
    <main style={{ backgroundColor: dark, color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter,system-ui,sans-serif' }}>
      <div style={{ textAlign: 'center' as const }}>
        <div style={{ fontSize: '11px', color: '#cc4444', letterSpacing: '0.2em', marginBottom: '12px' }}>ACCESS DENIED</div>
        <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Admin access required</div>
        <a href="/dashboard" style={{ color: gold, textDecoration: 'none', fontSize: '14px' }}>← Back to Dashboard</a>
      </div>
    </main>
  )

  const activeBusinesses = businesses.filter(b => b.status === 'active' || b.status === 'onboarding')
  const mriCompleted = businesses.filter(b => b.mri_completed)
  const activeSubs = businesses.filter(b => b.subscription_status === 'active' && b.subscription_tier !== 'free')
  const mrr = activeSubs.reduce((sum, b) => sum + (TIER_PRICES[b.subscription_tier] || 0), 0)
  const arr = mrr * 12
  const unreviewed = meetings.filter(m => !m.reviewed_by_admin)

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: `Users (${businesses.length})` },
    { id: 'meetings', label: `Meetings${unreviewed.length > 0 ? ' (' + unreviewed.length + ' new)' : ''}` },
  ]

  return (
    <main style={{ backgroundColor: dark, color: '#fff', minHeight: '100vh', fontFamily: 'Inter,system-ui,sans-serif' }}>

      {/* Nav */}
      <nav style={{ padding: '0 48px', height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #161616', backgroundColor: 'rgba(5,5,5,0.97)', position: 'sticky' as const, top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <a href="/" style={{ fontSize: '20px', fontWeight: '800', color: gold, letterSpacing: '0.12em', textDecoration: 'none' }}>BEI</a>
          <div style={{ fontSize: '11px', color: '#444', letterSpacing: '0.2em', fontWeight: '600' }}>ADMIN INTERFACE</div>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: '#555' }}>{user?.email}</span>
          <a href="/account" style={{ fontSize: '13px', color: gold, textDecoration: 'none', fontWeight: '600' }}>User View →</a>
          <a href="/dashboard" style={{ padding: '8px 18px', border: '1px solid #2a2a2a', borderRadius: '6px', fontSize: '13px', color: '#777', textDecoration: 'none' }}>Dashboard</a>
        </div>
      </nav>

      {/* Action toast */}
      {actionMsg && (
        <div style={{ position: 'fixed' as const, top: '80px', right: '24px', padding: '12px 20px', backgroundColor: '#4aaa4a', color: '#fff', borderRadius: '6px', fontSize: '13px', fontWeight: '600', zIndex: 200 }}>
          ✓ {actionMsg}
        </div>
      )}

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 48px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '11px', color: '#555', letterSpacing: '0.2em', marginBottom: '8px' }}>BEI ADMIN</div>
          <div style={{ fontSize: '28px', fontWeight: '800' }}>Platform Overview</div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid #1a1a1a', marginBottom: '32px' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id as any)} style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === t.id ? gold : 'transparent'}`, color: activeTab === t.id ? gold : '#555', fontSize: '14px', fontWeight: activeTab === t.id ? '600' : '400', cursor: 'pointer', fontFamily: 'Inter,system-ui,sans-serif' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
              {[
                { label: 'Active Businesses', value: activeBusinesses.length.toString(), color: gold },
                { label: 'MRIs Completed', value: mriCompleted.length.toString(), color: '#4aaa4a' },
                { label: 'Monthly Revenue', value: '£' + mrr.toLocaleString(), color: gold },
                { label: 'Annual Revenue', value: '£' + arr.toLocaleString(), color: '#4aaa4a' },
              ].map(s => (
                <div key={s.label}
                  style={{ padding: '24px', backgroundColor: card, border: '1px solid ' + border, borderLeft: '3px solid ' + s.color, borderRadius: '8px', transition: 'all 0.3s ease', cursor: 'default' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(200,162,74,0.15)'; (e.currentTarget as HTMLElement).style.borderColor = s.color }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.borderColor = border }}
                >
                  <div style={{ fontSize: '10px', color: '#555', letterSpacing: '0.15em', marginBottom: '10px' }}>{s.label.toUpperCase()}</div>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Subscription breakdown */}
            <div style={{ padding: '24px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '8px', marginBottom: '24px' }}>
              <div style={{ fontSize: '11px', color: '#555', letterSpacing: '0.2em', marginBottom: '20px', fontWeight: '600' }}>SUBSCRIPTION BREAKDOWN</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                {['analysis', 'opportunity', 'platform', 'corporate'].map(tier => {
                  const count = businesses.filter(b => b.subscription_tier === tier && b.subscription_status === 'active').length
                  return (
                    <div key={tier} style={{ padding: '16px', backgroundColor: '#111', borderRadius: '6px', border: '1px solid #1a1a1a' }}>
                      <div style={{ fontSize: '10px', color: '#555', letterSpacing: '0.1em', marginBottom: '6px', textTransform: 'capitalize' as const }}>{tier.toUpperCase()}</div>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: count > 0 ? gold : '#333' }}>{count}</div>
                      <div style={{ fontSize: '11px', color: '#444', marginTop: '4px' }}>£{(TIER_PRICES[tier] || 0).toLocaleString()}/mo each</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Recent MRIs */}
            <div style={{ padding: '24px', backgroundColor: card, border: '1px solid ' + border, borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: '#555', letterSpacing: '0.2em', marginBottom: '20px', fontWeight: '600' }}>RECENT MRI COMPLETIONS</div>
              {mriCompleted.length === 0 ? (
                <div style={{ fontSize: '13px', color: '#444' }}>No MRI completions yet.</div>
              ) : mriCompleted.slice(0, 8).map(b => (
                <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #111' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#e0e0e0' }}>{b.business_name}</div>
                    <div style={{ fontSize: '12px', color: '#555', marginTop: '2px' }}>{b.email} · {b.industry}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ fontSize: '11px', color: gold, fontWeight: '600', textTransform: 'capitalize' as const }}>{b.subscription_tier || 'free'}</div>
                    <a href={'/report/' + b.id} style={{ fontSize: '12px', color: gold, textDecoration: 'none', fontWeight: '600' }}>View Report →</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div>
            <div style={{ padding: '0', backgroundColor: card, border: '1px solid ' + border, borderRadius: '8px', overflow: 'hidden' }}>
              {/* Table header */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 140px', padding: '12px 20px', borderBottom: '1px solid #1a1a1a', backgroundColor: '#111' }}>
                {['Business', 'Industry', 'Plan', 'Status', 'MRI', 'Actions'].map(h => (
                  <div key={h} style={{ fontSize: '10px', color: '#555', letterSpacing: '0.15em', fontWeight: '600' }}>{h.toUpperCase()}</div>
                ))}
              </div>
              {businesses.map(b => (
                <div key={b.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 140px', padding: '14px 20px', borderBottom: '1px solid #111', alignItems: 'center' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#0d0d0d'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
                >
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#e0e0e0' }}>{b.business_name}</div>
                    <div style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>{b.email}</div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#777', textTransform: 'capitalize' as const }}>{(b.industry || '').replace('_', ' ')}</div>
                  <div style={{ fontSize: '12px', color: b.subscription_status === 'active' ? gold : '#555', fontWeight: '600', textTransform: 'capitalize' as const }}>{b.subscription_tier || 'free'}</div>
                  <div>
                    <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '10px', backgroundColor: b.status === 'active' ? 'rgba(74,170,74,0.1)' : b.status === 'suspended' ? 'rgba(204,68,68,0.1)' : 'rgba(100,100,100,0.1)', color: b.status === 'active' ? '#4aaa4a' : b.status === 'suspended' ? '#cc4444' : '#888', fontWeight: '600' }}>
                      {b.status || 'active'}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: b.mri_completed ? '#4aaa4a' : '#555' }}>
                    {b.mri_completed ? '✓ Done' : b.mri_requested ? 'Requested' : '—'}
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {b.status === 'suspended' ? (
                      <button onClick={() => reactivateBusiness(b.id, b.business_name)} disabled={actioning === b.id} style={{ padding: '5px 10px', backgroundColor: 'transparent', color: '#4aaa4a', border: '1px solid #4aaa4a', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}>
                        Reactivate
                      </button>
                    ) : (
                      <button onClick={() => deactivateBusiness(b.id, b.business_name)} disabled={actioning === b.id} style={{ padding: '5px 10px', backgroundColor: 'transparent', color: '#cc4444', border: '1px solid #cc4444', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}>
                        Suspend
                      </button>
                    )}
                    {b.subscription_status === 'active' && b.stripe_customer_id && (
                      <button onClick={() => cancelSubscription(b.id, b.stripe_customer_id, b.business_name)} disabled={actioning === b.id} style={{ padding: '5px 10px', backgroundColor: 'transparent', color: '#888', border: '1px solid #333', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>
                        Cancel Sub
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MEETINGS TAB */}
        {activeTab === 'meetings' && (
          <div>
            {meetings.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center' as const, backgroundColor: card, border: '1px solid ' + border, borderRadius: '8px', fontSize: '13px', color: '#444' }}>
                No meeting requests yet.
              </div>
            ) : meetings.map(m => (
              <div key={m.id} style={{ padding: '20px 24px', backgroundColor: card, border: '1px solid ' + (m.reviewed_by_admin ? border : 'rgba(200,162,74,0.3)'), borderRadius: '8px', marginBottom: '12px', position: 'relative' as const }}>
                {!m.reviewed_by_admin && (
                  <div style={{ position: 'absolute' as const, top: '16px', right: '16px', fontSize: '10px', color: gold, backgroundColor: 'rgba(200,162,74,0.1)', padding: '3px 10px', borderRadius: '10px', fontWeight: '600' }}>NEW</div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#e0e0e0', marginBottom: '4px' }}>
                      {(m.businesses as any)?.business_name || 'Unknown Business'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#555' }}>
                      {(m.businesses as any)?.email} · {m.meeting_type} · {new Date(m.requested_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '10px', backgroundColor: m.status === 'requested' ? 'rgba(200,162,74,0.1)' : 'rgba(74,170,74,0.1)', color: m.status === 'requested' ? gold : '#4aaa4a', fontWeight: '600' }}>
                      {m.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                {m.notes && (
                  <div style={{ padding: '12px 16px', backgroundColor: '#111', borderRadius: '6px', fontSize: '13px', color: '#999', lineHeight: '1.7', marginBottom: '12px', borderLeft: '3px solid rgba(200,162,74,0.3)' }}>
                    {m.notes}
                  </div>
                )}
                {!m.reviewed_by_admin && (
                  <button onClick={() => markMeetingReviewed(m.id)} style={{ padding: '7px 16px', backgroundColor: 'transparent', color: gold, border: '1px solid rgba(200,162,74,0.4)', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>
                    Mark Reviewed
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  )
}
