'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { colors, fontSize, fontWeight, cardStyle, pageWrapper } from '../../../lib/design'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ReportPage() {
  const params = useParams()
  const businessId = params.business_id as string
  const [result, setResult] = useState<Record<string, any> | null>(null)
  const [businessName, setBusinessName] = useState('Your Business')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [hasSubscription, setHasSubscription] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      // Load MRI result
      const { data } = await supabase
        .from('businesses')
        .select('business_name, mri_result')
        .eq('id', businessId)
        .single()
      if (data) {
        setBusinessName(data.business_name || 'Your Business')
        if (data.mri_result) setResult(data.mri_result)
      }

      // Check auth status
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setIsLoggedIn(true)
        const { data: business } = await supabase
          .from('businesses')
          .select('subscription_status, subscription_tier')
          .eq('email', user.email)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()
        if (business?.subscription_status === 'active' && business?.subscription_tier !== 'free') {
          setHasSubscription(true)
        }
      }
      setLoading(false)
    }
    load()
  }, [businessId])

  if (loading) return <main style={pageWrapper}></main>

  if (!result) return (
    <main style={{ ...pageWrapper, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: colors.textMuted, fontSize: fontSize.md }}>No MRI report found.</p>
    </main>
  )

  const health = result.health || {}
  const overall = health.overall || 0
  const pillars = health.pillars || {}
  const primary = result.primary_constraint
  const secondary = result.secondary_constraints || []
  const confidence = result.confidence || 'low'
  const version = confidence === 'high' ? 'BEI MRI v1.1 — Verified Analysis' : 'BEI MRI v1.0 — Rules-Based Analysis'
  const healthColor = overall >= 70 ? colors.success : overall >= 45 ? colors.gold : colors.error

  const LockOverlay = ({ message, cta, href }: { message: string, cta: string, href: string }) => (
    <div style={{ position: 'relative' as const, marginTop: '20px' }}>
      <div style={{ filter: 'blur(5px)', opacity: 0.35, pointerEvents: 'none' as const, padding: '28px', border: `1px solid ${colors.borderBase}`, borderRadius: '8px', backgroundColor: colors.bgCard }}>
        <div style={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, marginBottom: '12px', color: colors.textPrimary }}>Opportunity Map</div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {['Revenue +£45k', 'Profit +12%', 'Enterprise +£200k', 'Risk Reduction'].map(t => (
            <div key={t} style={{ padding: '8px 14px', backgroundColor: '#111', borderRadius: '4px', fontSize: fontSize.base, color: colors.textBody }}>{t}</div>
          ))}
        </div>
        <div style={{ marginTop: '16px', fontSize: fontSize.base, color: colors.textSecondary, lineHeight: '1.7' }}>
          Deployment recommendations and constraint network analysis available with full access.
        </div>
      </div>
      <div style={{ position: 'absolute' as const, inset: 0, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(5,5,5,0.85)', borderRadius: '8px', backdropFilter: 'blur(2px)', gap: '12px' }}>
        <div style={{ fontSize: '11px', color: colors.gold, letterSpacing: '0.2em', textTransform: 'uppercase' as const, fontWeight: fontWeight.semibold }}>🔒 {message}</div>
        <a href={href} style={{ padding: '12px 32px', backgroundColor: colors.gold, color: '#050505', fontWeight: fontWeight.bold, borderRadius: '4px', textDecoration: 'none', fontSize: fontSize.base }}>{cta}</a>
      </div>
    </div>
  )

  return (
    <main style={{ ...pageWrapper, paddingBottom: '80px' }}>
      {/* Nav */}
      <nav style={{ padding: '0 48px', borderBottom: `1px solid ${colors.borderSubtle}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '68px', backgroundColor: colors.bgBase }}>
        <a href='/' style={{ fontSize: '20px', fontWeight: fontWeight.extrabold, color: colors.gold, letterSpacing: '0.1em', textDecoration: 'none' }}>BEI</a>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {isLoggedIn ? (
            <a href='/dashboard' style={{ padding: '10px 20px', backgroundColor: colors.gold, color: '#050505', fontWeight: fontWeight.bold, borderRadius: '4px', textDecoration: 'none', fontSize: fontSize.base }}>Go to Dashboard →</a>
          ) : (
            <>
              <a href='/login' style={{ fontSize: fontSize.base, color: colors.textMuted, textDecoration: 'none' }}>Sign in</a>
              <a href='/register' style={{ padding: '10px 20px', backgroundColor: colors.gold, color: '#050505', fontWeight: fontWeight.bold, borderRadius: '4px', textDecoration: 'none', fontSize: fontSize.base }}>Unlock Full Report →</a>
            </>
          )}
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Report header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div>
            <div style={{ fontSize: '11px', color: colors.gold, letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: '8px', fontWeight: fontWeight.semibold }}>Business MRI Report</div>
            <div style={{ fontSize: '28px', fontWeight: fontWeight.bold, color: colors.textPrimary }}>{businessName}</div>
          </div>
          <div style={{ padding: '6px 14px', border: `1px solid ${confidence === 'high' ? colors.successBorder : colors.borderBase}`, borderRadius: '4px', fontSize: '11px', color: confidence === 'high' ? colors.success : colors.textMuted, fontWeight: fontWeight.semibold }}>
            {version}
          </div>
        </div>

        {/* FREE SECTION 1 — Health Score */}
        <div style={{ ...cardStyle, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '48px' }}>
          <div style={{ textAlign: 'center' as const, minWidth: '120px' }}>
            <div style={{ fontSize: '11px', color: colors.textMuted, letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: '12px' }}>Health Score</div>
            <div style={{ fontSize: '80px', fontWeight: fontWeight.extrabold, color: healthColor, lineHeight: '1' }}>{overall}</div>
            <div style={{ fontSize: fontSize.sm, color: colors.textMuted, marginTop: '8px', textTransform: 'capitalize' as const }}>{health.band || 'unknown'}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
              {Object.entries(pillars).map(([name, data]: [string, any]) => {
                const c = data.score >= 70 ? colors.success : data.score >= 45 ? colors.gold : colors.error
                return (
                  <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '80px', fontSize: fontSize.sm, color: colors.textSecondary, textTransform: 'capitalize' as const }}>{name}</div>
                    <div style={{ flex: 1, height: '6px', backgroundColor: '#111', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: data.score + '%', height: '100%', backgroundColor: c, borderRadius: '3px' }} />
                    </div>
                    <div style={{ fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: c, width: '28px' }}>{data.score}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* FREE SECTION 2 — Primary Constraint */}
        {primary && (
          <div style={{ ...cardStyle, borderColor: colors.borderActive, backgroundColor: '#080f04', marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', color: colors.gold, letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: '12px', fontWeight: fontWeight.semibold }}>Primary Constraint Identified</div>
            <div style={{ fontSize: '22px', fontWeight: fontWeight.bold, color: colors.textPrimary, marginBottom: '10px' }}>{primary.name}</div>
            <div style={{ fontSize: fontSize.md, color: colors.textBody, lineHeight: '1.75', marginBottom: '20px' }}>{primary.hypothesis}</div>
            <div style={{ display: 'flex', gap: '40px' }}>
              <div>
                <div style={{ fontSize: '11px', color: colors.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Opportunity Estimate</div>
                <div style={{ fontSize: '24px', fontWeight: fontWeight.extrabold, color: colors.gold }}>
                  £{((primary.opportunity?.value_low || 0) / 1000).toFixed(0)}k – £{((primary.opportunity?.value_high || 0) / 1000).toFixed(0)}k
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: colors.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Verification Score</div>
                <div style={{ fontSize: '24px', fontWeight: fontWeight.extrabold, color: colors.success }}>{primary.verification_score}/100</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: colors.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>Severity</div>
                <div style={{ fontSize: '24px', fontWeight: fontWeight.extrabold, color: primary.severity === 'high' ? colors.error : colors.gold, textTransform: 'capitalize' as const }}>{primary.severity}</div>
              </div>
            </div>
          </div>
        )}

        {/* FREE SECTION 3 — Executive Summary */}
        {result.recommended_focus && (
          <div style={{ ...cardStyle, marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', color: colors.textMuted, letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: '12px', fontWeight: fontWeight.semibold }}>Executive Summary</div>
            <div style={{ fontSize: fontSize.md, color: colors.textBody, lineHeight: '1.8' }}>{result.recommended_focus}</div>
          </div>
        )}

        {/* LOCKED SECTIONS — shown differently based on auth state */}
        {!isLoggedIn && (
          <>
            <div style={{ padding: '32px', border: `2px solid ${colors.gold}`, borderRadius: '10px', backgroundColor: '#0d0a04', marginBottom: '20px', textAlign: 'center' as const }}>
              <div style={{ fontSize: '11px', color: colors.gold, letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: '12px', fontWeight: fontWeight.semibold }}>Your Report Is Ready</div>
              <div style={{ fontSize: '22px', fontWeight: fontWeight.bold, marginBottom: '12px' }}>Create your account to unlock your full MRI</div>
              <div style={{ fontSize: fontSize.md, color: colors.textSecondary, marginBottom: '24px', lineHeight: '1.7', maxWidth: '500px', margin: '0 auto 24px' }}>
                Your Health Score and Primary Constraint are visible above. Create a free account to save your results and unlock the full opportunity map, constraint network and deployment recommendations.
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' as const, flexWrap: 'wrap' as const }}>
                <a href={`/register?business_id=${businessId}`} style={{ padding: '14px 36px', backgroundColor: colors.gold, color: '#050505', fontWeight: fontWeight.bold, borderRadius: '6px', textDecoration: 'none', fontSize: fontSize.md }}>Create Account — Free →</a>
                <a href='/login' style={{ padding: '14px 24px', border: `1px solid ${colors.borderStrong}`, color: colors.textSecondary, borderRadius: '6px', textDecoration: 'none', fontSize: fontSize.base }}>Already have an account?</a>
              </div>
            </div>

            <LockOverlay
              message="Full opportunity map requires account"
              cta="Create Free Account →"
              href={`/register?business_id=${businessId}`}
            />
          </>
        )}

        {isLoggedIn && !hasSubscription && (
          <>
            <div style={{ padding: '28px', border: `1px solid ${colors.borderActive}`, borderRadius: '10px', backgroundColor: '#080f04', marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', color: colors.gold, letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: '10px', fontWeight: fontWeight.semibold }}>Partial Report Unlocked</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: '16px' }}>
                <div>
                  <div style={{ fontSize: fontSize.lg, fontWeight: fontWeight.semibold, marginBottom: '6px' }}>
                    {primary?.name} — £{((primary?.opportunity?.value_low || 0) / 1000).toFixed(0)}k–£{((primary?.opportunity?.value_high || 0) / 1000).toFixed(0)}k opportunity
                  </div>
                  <div style={{ fontSize: fontSize.base, color: colors.textSecondary }}>Upgrade to access the full intelligence platform</div>
                </div>
                <a href='/pricing' style={{ padding: '12px 28px', backgroundColor: colors.gold, color: '#050505', fontWeight: fontWeight.bold, borderRadius: '4px', textDecoration: 'none', fontSize: fontSize.base, whiteSpace: 'nowrap' as const }}>Upgrade to Full Access →</a>
              </div>
            </div>

            <LockOverlay
              message="Full analysis requires subscription"
              cta="View Plans →"
              href="/pricing"
            />
          </>
        )}

        {isLoggedIn && hasSubscription && (
          <>
            {/* Full secondary constraints */}
            {secondary.length > 0 && (
              <div style={{ ...cardStyle, marginBottom: '20px' }}>
                <div style={{ fontSize: '11px', color: colors.textMuted, letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: '16px', fontWeight: fontWeight.semibold }}>Secondary Constraints</div>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
                  {secondary.slice(0, 3).map((c: any) => (
                    <div key={c.key} style={{ padding: '16px', backgroundColor: '#0d0d0d', borderRadius: '6px', border: `1px solid ${colors.borderBase}` }}>
                      <div style={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, marginBottom: '4px' }}>{c.name}</div>
                      <div style={{ fontSize: fontSize.base, color: colors.textSecondary }}>{c.hypothesis}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Full opportunity map */}
            {primary?.opportunity && (
              <div style={{ ...cardStyle, marginBottom: '20px' }}>
                <div style={{ fontSize: '11px', color: colors.textMuted, letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: '16px', fontWeight: fontWeight.semibold }}>Opportunity Map</div>
                <div style={{ fontSize: fontSize.md, color: colors.textBody, lineHeight: '1.75' }}>{primary.opportunity.explanation}</div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <a href='/dashboard' style={{ padding: '14px 28px', backgroundColor: colors.gold, color: '#050505', fontWeight: fontWeight.bold, borderRadius: '4px', textDecoration: 'none', fontSize: fontSize.base }}>View Full Dashboard →</a>
              <a href='/constraints' style={{ padding: '14px 28px', border: `1px solid ${colors.borderStrong}`, color: colors.textSecondary, borderRadius: '4px', textDecoration: 'none', fontSize: fontSize.base }}>Constraint Intelligence</a>
              <a href='/opportunities' style={{ padding: '14px 28px', border: `1px solid ${colors.borderStrong}`, color: colors.textSecondary, borderRadius: '4px', textDecoration: 'none', fontSize: fontSize.base }}>Opportunity Centre</a>
            </div>
          </>
        )}

        {/* Footer note */}
        <div style={{ marginTop: '40px', padding: '16px 20px', border: `1px solid ${colors.borderSubtle}`, borderRadius: '6px', backgroundColor: colors.bgCard }}>
          <div style={{ fontSize: fontSize.sm, color: colors.textDisabled, lineHeight: '1.8' }}>
            {version} — {confidence === 'high' ? 'This report has passed the BEI Verification Framework. All constraints verified before recommendation.' : 'Rules-based analysis. Verification score reflects confidence level.'}
          </div>
        </div>
      </div>
    </main>
  )
}
