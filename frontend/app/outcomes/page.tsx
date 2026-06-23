'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase'
import { colors, fontSize, fontWeight, navHeight, cardStyle, pageWrapper, contentWrapper } from '../../lib/design'

const supabase = createClient()

import DashboardShell from '../components/DashboardShell'
export default function OutcomesPage() {
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
    { label: 'Deployments', href: '/deployments' },
    { label: 'Outcomes', href: '/outcomes', active: true },
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

  const primary = result.primary_constraint
  const packages = result.deployment_packages || {}
  const allPackages = [
    ...(packages.tier1_automatic || []),
    ...(packages.tier2_approval || []),
  ]

  return (
    <DashboardShell activeId="performance"><main style={pageWrapper}>
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
        <div style={{ fontSize: '28px', fontWeight: fontWeight.bold, marginBottom: '6px' }}>Outcome Centre</div>
        <div style={{ fontSize: fontSize.md, color: colors.textSecondary, marginBottom: '36px' }}>Track actual results against expected outcomes from every deployment</div>

        <div style={{ ...cardStyle, borderColor: colors.borderActive, backgroundColor: '#080f04', marginBottom: '32px' }}>
          <div style={{ fontSize: '11px', color: colors.gold, letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: '12px', fontWeight: fontWeight.semibold }}>Golden Rule 12</div>
          <div style={{ fontSize: fontSize.base, color: colors.textBody, lineHeight: '1.75' }}>
            Every Deployment Must Be Measurable. Outcome tracking begins when a deployment is approved and executed. Baselines are recorded at deployment time. Actual values are recorded at the measurement date.
          </div>
        </div>

        {allPackages.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '16px' }}>
            {allPackages.map((pkg: any) => (
              <div key={pkg.deployment_id} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.textPrimary, marginBottom: '6px' }}>{pkg.action_title}</div>
                    <div style={{ fontSize: fontSize.base, color: colors.textSecondary }}>{pkg.constraint_name}</div>
                  </div>
                  <div style={{ padding: '4px 12px', backgroundColor: '#0f0f04', border: `1px solid ${colors.borderActive}`, borderRadius: '20px', fontSize: '11px', color: colors.textMuted, fontWeight: fontWeight.semibold }}>
                    PENDING EXECUTION
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '8px', fontWeight: fontWeight.medium }}>MEASUREMENT PLAN</div>
                <div style={{ fontSize: fontSize.base, color: colors.textBody, lineHeight: '1.75', marginBottom: '16px' }}>{pkg.measurement_plan}</div>
                <div style={{ padding: '14px 16px', backgroundColor: '#0d0d0d', borderRadius: '6px', border: `1px solid ${colors.borderBase}` }}>
                  <div style={{ fontSize: fontSize.sm, color: colors.textMuted }}>Outcome tracking activates when this deployment is approved and executed.</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ ...cardStyle, textAlign: 'center' as const, padding: '48px' }}>
            <div style={{ fontSize: fontSize.lg, color: colors.textSecondary, marginBottom: '8px' }}>No active deployments to track.</div>
            <div style={{ fontSize: fontSize.base, color: colors.textMuted, marginBottom: '24px' }}>Approve deployments in the Deployment Centre to begin outcome tracking.</div>
            <a href='/deployments' style={{ padding: '12px 28px', backgroundColor: colors.gold, color: '#050505', fontWeight: fontWeight.bold, borderRadius: '4px', textDecoration: 'none', fontSize: fontSize.base }}>Go to Deployments</a>
          </div>
        )}
      </div>
    </main>
  </DashboardShell>
  )
}
