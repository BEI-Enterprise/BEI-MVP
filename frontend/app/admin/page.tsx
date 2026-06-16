'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

type Business = {
  id: string
  business_name: string
  industry: string
  annual_revenue_band: string
  status: string
  mri_requested: boolean
  mri_completed: boolean
  created_at: string
}

export default function AdminPage() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('businesses')
        .select('id, business_name, industry, annual_revenue_band, status, mri_requested, mri_completed, created_at')
        .order('created_at', { ascending: false })
      if (data) setBusinesses(data)
      setLoading(false)
    }
    load()
  }, [])

  const total = businesses.length
  const mriRequested = businesses.filter(b => b.mri_requested).length
  const mriCompleted = businesses.filter(b => b.mri_completed).length

  const s: Record<string, React.CSSProperties> = {
    page: { backgroundColor: '#050505', color: '#ffffff', fontFamily: 'Inter,system-ui,sans-serif', minHeight: '100vh' },
    nav: { padding: '24px 48px', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    logo: { fontSize: '20px', fontWeight: '700', color: '#C8A24A', letterSpacing: '0.1em' },
    label: { fontSize: '12px', color: '#444', letterSpacing: '0.1em' },
    inner: { maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' },
    h1: { fontSize: '28px', fontWeight: '700', marginBottom: '8px' },
    sub: { color: '#666', fontSize: '14px', marginBottom: '40px' },
    statRow: { display: 'flex', gap: '24px', marginBottom: '48px' },
    stat: { flex: 1, padding: '24px', border: '1px solid #1a1a1a', borderRadius: '8px', backgroundColor: '#080808' },
    statNum: { fontSize: '36px', fontWeight: '700', color: '#C8A24A' },
    statLbl: { fontSize: '12px', color: '#555', marginTop: '4px', textTransform: 'uppercase' as const, letterSpacing: '0.1em' },
    table: { width: '100%', borderCollapse: 'collapse' as const },
    th: { textAlign: 'left' as const, fontSize: '11px', color: '#444', letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '12px 16px', borderBottom: '1px solid #1a1a1a' },
    td: { padding: '14px 16px', borderBottom: '1px solid #0f0f0f', fontSize: '13px', color: '#aaa' },
  }

  return (
    <main style={s.page}>
      <nav style={s.nav}>
        <span style={s.logo}>BEI</span>
        <span style={s.label}>ADMIN PORTAL</span>
      </nav>
      <div style={s.inner}>
        <h1 style={s.h1}>Admin Portal</h1>
        <p style={s.sub}>All MRI submissions — internal use only</p>
        <div style={s.statRow}>
          <div style={s.stat}>
            <div style={s.statNum}>{total}</div>
            <div style={s.statLbl}>Total Businesses</div>
          </div>
          <div style={s.stat}>
            <div style={s.statNum}>{mriRequested}</div>
            <div style={s.statLbl}>MRI Requested</div>
          </div>
          <div style={s.stat}>
            <div style={s.statNum}>{mriCompleted}</div>
            <div style={s.statLbl}>MRI Completed</div>
          </div>
          <div style={s.stat}>
            <div style={s.statNum}>{total - mriCompleted}</div>
            <div style={s.statLbl}>Awaiting Completion</div>
          </div>
        </div>
        {loading ? (
          <p style={{ color: '#444' }}>Loading...</p>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Business</th>
                <th style={s.th}>Industry</th>
                <th style={s.th}>Revenue Band</th>
                <th style={s.th}>Status</th>
                <th style={s.th}>MRI</th>
                <th style={s.th}>Submitted</th>
                <th style={s.th}>Report</th>
              </tr>
            </thead>
            <tbody>
              {businesses.map(b => (
                <tr key={b.id}>
                  <td style={{...s.td, color: '#ffffff', fontWeight: '500'}}>{b.business_name}</td>
                  <td style={s.td}>{b.industry.replace(/_/g, ' ').replace(/bw/g, (c: string) => c.toUpperCase())}</td>
                  <td style={s.td}>{b.annual_revenue_band}</td>
                  <td style={s.td}>
                    <span style={{ padding: '3px 8px', borderRadius: '3px', fontSize: '11px', backgroundColor: '#1a1a1a', color: '#888' }}>{b.status}</span>
                  </td>
                  <td style={s.td}>
                    <span style={{ color: b.mri_requested ? '#C8A24A' : '#333' }}>{b.mri_requested ? '✓ Requested' : '—'}</span>
                  </td>
                  <td style={s.td}>{new Date(b.created_at).toLocaleDateString('en-GB')}</td>
                  <td style={s.td}>
                    <a href={'/report/' + b.id} style={{ color: '#C8A24A', textDecoration: 'none', fontSize: '12px' }}>View →</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  )
}
