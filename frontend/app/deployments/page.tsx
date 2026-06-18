'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase'
import { colors, fontSize, fontWeight, navHeight, cardStyle, pageWrapper, contentWrapper } from '../../lib/design'

const supabase = createClient()

export default function DeploymentsPage() {
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
    { label: 'Opportunities', href: '/opportunities' },
    { label: 'Deployments', href: '/deployments', active: true },
    { label: 'Outcomes', href: '/outcomes' },
    { label: 'Connect', href: '/connect' },
  ]

  if (loading) return <main style={pageWrapper}></main>
  if (!result) return (
    <main style={pageWrapper}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <a href='/book' style={{ padding: '14px 32px', backgroundColor: colors.gold, color: '#050505', fontWeight: fontWeight.bold, borderRadius: '4px', textDecoration: 'none' }}>Start Your MRI</a>
      </div>
    </main>
  )

  const packages = result.deployment_packages || {}
  const tier1 = packages.tier1_automatic || []
  const tier2 = packages.tier2_approval || []
  const tier3 = packages.tier3_recommendation || []

  const PackageCard = ({ pkg, tier }: { pkg: any, tier: number }) => {
    const tierColors = { 1: colors.success, 2: colors.gold, 3: colors.info || '#4a8ab0' }
    const tierLabels = { 1: 'Automatic', 2: 'Awaiting Approval', 3: 'Recommendation' }
    const tColor = tierColors[tier as keyof typeof tierColors] || colors.gold
    return (
      <div style={{ ...cardStyle, marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div>
            <div style={{ fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.textPrimary, marginBottom: '6px' }}>{pkg.action_title}</div>
            <div style={{ fontSize: fontSize.sm, color: colors.textMuted }}>{pkg.constraint_name}</div>
          </div>
          <div style={{ padding: '4px 12px', backgroundColor: '#0a0a0a', border: `1px solid ${tColor}`, borderRadius: '20px', fontSize: '11px', color: tColor, fontWeight: fontWeight.semibold, whiteSpace: 'nowrap' as const }}>
            Tier {tier} — {tierLabels[tier as keyof typeof tierLabels]}
          </div>
        </div>
        <div style={{ fontSize: fontSize.base, color: colors.textBody, lineHeight: '1.75', marginBottom: '16px' }}>{pkg.action_description}</div>
        <div style={{ borderTop: `1px solid ${colors.borderBase}`, paddingTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '6px', fontWeight: fontWeight.medium }}>EXPECTED OUTCOME</div>
            <div style={{ fontSize: fontSize.base, color: colors.textBody, lineHeight: '1.6' }}>{pkg.expected_outcome}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '6px', fontWeight: fontWeight.medium }}>MEASUREMENT PLAN</div>
            <div style={{ fontSize: fontSize.base, color: colors.textBody, lineHeight: '1.6' }}>{pkg.measurement_plan}</div>
          </div>
        </div>
        {tier === 2 && (
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${colors.borderBase}` }}>
            <button style={{ padding: '10px 24px', backgroundColor: colors.gold, color: '#050505', fontWeight: fontWeight.bold, borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: fontSize.base }}>
              Approve Deployment →
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <main style={pageWrapper}>
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
        <div style={{ fontSize: '28px', fontWeight: fontWeight.bold, marginBottom: '6px' }}>Deployment Centre</div>
        <div style={{ fontSize: fontSize.md, color: colors.textSecondary, marginBottom: '12px' }}>Actions prepared for your primary constraint</div>

        {packages.deployment_summary && (
          <div style={{ ...cardStyle, borderColor: colors.borderActive, backgroundColor: '#080f04', marginBottom: '32px' }}>
            <div style={{ fontSize: fontSize.base, color: colors.textBody, lineHeight: '1.75' }}>{packages.deployment_summary}</div>
          </div>
        )}

        {tier1.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, marginBottom: '16px', color: colors.success, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>●</span> Tier 1 — Automatic Actions ({tier1.length})
            </div>
            {tier1.map((pkg: any) => <PackageCard key={pkg.deployment_id} pkg={pkg} tier={1} />)}
          </div>
        )}

        {tier2.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, marginBottom: '16px', color: colors.gold, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>●</span> Tier 2 — Awaiting Your Approval ({tier2.length})
            </div>
            {tier2.map((pkg: any) => <PackageCard key={pkg.deployment_id} pkg={pkg} tier={2} />)}
          </div>
        )}

        {tier3.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, marginBottom: '16px', color: colors.textSecondary, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>●</span> Tier 3 — Strategic Recommendations ({tier3.length})
            </div>
            {tier3.map((pkg: any) => <PackageCard key={pkg.deployment_id} pkg={pkg} tier={3} />)}
          </div>
        )}

        {tier1.length === 0 && tier2.length === 0 && tier3.length === 0 && (
          <div style={{ ...cardStyle, textAlign: 'center' as const, padding: '48px' }}>
            <div style={{ fontSize: fontSize.lg, color: colors.textSecondary, marginBottom: '8px' }}>No deployment packages available.</div>
            <div style={{ fontSize: fontSize.base, color: colors.textMuted }}>Complete your MRI to generate deployment recommendations.</div>
          </div>
        )}
      </div>
    </main>
  )
}
