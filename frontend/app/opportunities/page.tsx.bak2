'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase'
import { colors, fontSize, fontWeight, navHeight, cardStyle, pageWrapper, contentWrapper } from '../../lib/design'

const supabase = createClient()

import DashboardShell from '../components/DashboardShell'
export default function OpportunitiesPage() {
  const [result, setResult] = useState<Record<string, any> | null>(null)
  const [businessName, setBusinessName] = useState('Your Business')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase.from('businesses').select('id, business_name, mri_result').eq('status', 'mri_complete').order('updated_at', { ascending: false }).limit(1).single()
        if (data) { setBusinessName(data.business_name || 'Your Business'); if (data.mri_result) setResult(data.mri_result) }
      } catch (e) {}
      setLoading(false)
    }
    load()
  }, [])

  const nav = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Health', href: '/health' },
    { label: 'Constraints', href: '/constraints' },
    { label: 'Opportunities', href: '/opportunities', active: true },
    { label: 'Deployments', href: '/deployments' },
    { label: 'Outcomes', href: '/outcomes' },
    { label: 'Connect', href: '/connect' },
  ]

  const dimensionLabels: Record<string, string> = {
    revenue: 'Revenue Opportunity', profit: 'Profit Opportunity', capacity: 'Capacity Opportunity',
    risk_reduction: 'Risk Reduction', enterprise_value: 'Enterprise Value',
  }
  const dimensionColors: Record<string, string> = {
    revenue: colors.gold, profit: colors.success, capacity: '#6ab0d4',
    risk_reduction: '#a06ab0', enterprise_value: '#d46a6a',
  }

  if (loading) return <main style={pageWrapper}></main>
  if (!result) return (
    <main style={pageWrapper}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <a href='/book' style={{ padding: '14px 32px', backgroundColor: colors.gold, color: '#050505', fontWeight: fontWeight.bold, borderRadius: '4px', textDecoration: 'none' }}>Start Your MRI</a>
      </div>
    </main>
  )

  const primary = result.primary_constraint
  const secondary = result.secondary_constraints || []
  const total = result.total_opportunity || {}
  const allConstraints = [primary, ...secondary].filter(Boolean)

  return (
    <DashboardShell activeId="opportunities"><main style={pageWrapper}>
      <nav style={{ padding: '0 48px', borderBottom: `1px solid ${colors.borderSubtle}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: navHeight, backgroundColor: colors.bgBase }}>
        <span style={{ fontSize: '20px', fontWeight: fontWeight.extrabold, color: colors.gold, letterSpacing: '0.1em' }}>BEI</span>
        <div style={{ display: 'flex' }}>
          {nav.map(n => (
            <a key={n.href} href={n.href} style={{ padding: '0 18px', height: navHeight, display: 'flex', alignItems: 'center', fontSize: fontSize.base, color: (n as any).active ? colors.gold : colors.textMuted, borderBottom: (n as any).active ? `2px solid ${colors.gold}` : '2px solid transparent', textDecoration: 'none', fontWeight: (n as any).active ? fontWeight.semibold : fontWeight.normal }}>{n.label}</a>
          ))}
        </div>
        <span style={{ fontSize: fontSize.sm, color: colors.textDisabled }}>{businessName}</span>
      </nav>

      <div style={contentWrapper}>
        <div style={{ fontSize: '28px', fontWeight: fontWeight.bold, marginBottom: '6px' }}>Opportunity Centre</div>
        <div style={{ fontSize: fontSize.md, color: colors.textSecondary, marginBottom: '36px' }}>Quantified value available from resolving each verified constraint</div>

        {/* Total opportunity */}
        <div style={{ ...cardStyle, marginBottom: '28px', display: 'flex', gap: '48px', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '11px', color: colors.textMuted, letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: '10px', fontWeight: fontWeight.semibold }}>Total Opportunity Range</div>
            <div style={{ fontSize: '44px', fontWeight: fontWeight.extrabold, color: colors.gold }}>
              £{Math.round((total.total_low || 0) / 1000)}k — £{Math.round((total.total_high || 0) / 1000)}k
            </div>
            <div style={{ fontSize: fontSize.base, color: colors.textSecondary, marginTop: '8px' }}>Annual value available to recover or unlock</div>
          </div>
          <div style={{ flex: 1, borderLeft: `1px solid ${colors.borderBase}`, paddingLeft: '48px' }}>
            <div style={{ fontSize: fontSize.base, color: colors.textBody, lineHeight: '1.8' }}>{total.note}</div>
          </div>
        </div>

        <div style={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, marginBottom: '20px', color: colors.textPrimary }}>Opportunity By Constraint</div>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '16px' }}>
          {allConstraints.map((c: any, idx: number) => {
            const opp = c.opportunity || {}
            const dim = opp.dimension || 'revenue'
            const color = dimensionColors[dim] || colors.gold
            return (
              <div key={c.key} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    {idx === 0 && <div style={{ fontSize: '11px', color: colors.gold, letterSpacing: '0.2em', marginBottom: '8px', fontWeight: fontWeight.semibold }}>PRIMARY CONSTRAINT</div>}
                    <div style={{ fontSize: fontSize.lg, fontWeight: fontWeight.semibold, marginBottom: '8px' }}>{c.name}</div>
                    <div style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '3px', fontSize: fontSize.sm, color, backgroundColor: '#0a0a0a', border: `1px solid ${color}` }}>
                      {dimensionLabels[dim] || dim}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' as const }}>
                    <div style={{ fontSize: '28px', fontWeight: fontWeight.extrabold, color }}> £{(opp.value_low || 0).toLocaleString()} — £{(opp.value_high || 0).toLocaleString()}</div>
                    <div style={{ fontSize: fontSize.sm, color: colors.textMuted, marginTop: '4px' }}>Confidence: {opp.confidence || 'indicative'}</div>
                  </div>
                </div>
                <div style={{ fontSize: fontSize.base, color: colors.textBody, lineHeight: '1.75' }}>{opp.explanation}</div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  </DashboardShell>
  )
}
