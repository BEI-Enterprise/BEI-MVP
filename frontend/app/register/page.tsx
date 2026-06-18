'use client'
import { useState } from 'react'
import { createClient } from '../../lib/supabase'
import { colors, fontSize, fontWeight, inputStyle, labelStyle, pageWrapper } from '../../lib/design'

const PLANS = [
  {
    id: 'analysis',
    name: 'MRI Analysis',
    price: '£199',
    period: '/month',
    was: '£332',
    features: ['Business MRI', 'Health Score', 'Primary Constraint', 'Monthly Updates'],
  },
  {
    id: 'opportunity',
    name: 'Analysis + Opportunity',
    price: '£399',
    period: '/month',
    was: '£665',
    features: ['Everything in Analysis', 'Opportunity Mapping', 'Prioritisation Engine', 'Opportunity Quantification'],
    popular: true,
  },
  {
    id: 'platform',
    name: 'Full Platform',
    price: '£999',
    period: '/month',
    was: '£1,665',
    features: ['Everything above', 'Deployment Engine', 'Execution Tracking', 'Outcome Monitoring', 'Continuous Optimisation'],
  },
]

export default function RegisterPage() {
  const [step, setStep] = useState<'plan' | 'details'>('plan')
  const [selectedPlan, setSelectedPlan] = useState('')
  const [form, setForm] = useState({ name: '', email: '', company: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleContinue = () => {
    if (!selectedPlan) { setError('Please select a plan to continue.'); return }
    setError('')
    setStep('details')
  }

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.company) { setError('Please complete all fields.'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan, email: form.email }),
      })
      const data = await res.json()
      if (data.url) { window.location.href = data.url; return }
      setError(data.error || 'Failed to start checkout. Please try again.')
    } catch (e) {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  return (
    <main style={pageWrapper}>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: step === 'plan' ? '900px' : '480px' }}>
          <a href='/' style={{ display: 'block', fontSize: '22px', fontWeight: fontWeight.extrabold, color: colors.gold, letterSpacing: '0.12em', textDecoration: 'none', marginBottom: '48px', textAlign: 'center' as const }}>BEI</a>

          {step === 'plan' ? (
            <>
              <div style={{ textAlign: 'center' as const, marginBottom: '40px' }}>
                <div style={{ fontSize: '11px', color: colors.gold, letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: '8px', fontWeight: fontWeight.semibold }}>Launch Offer — 40% Off</div>
                <div style={{ fontSize: '28px', fontWeight: fontWeight.bold, marginBottom: '8px' }}>Choose your plan</div>
                <div style={{ fontSize: fontSize.base, color: colors.textSecondary }}>Select a plan to continue. You will complete payment securely via Stripe.</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
                {PLANS.map(plan => (
                  <div
                    key={plan.id}
                    onClick={() => { setSelectedPlan(plan.id); setError('') }}
                    style={{ padding: '28px', border: `2px solid ${selectedPlan === plan.id ? colors.gold : colors.borderBase}`, borderRadius: '10px', backgroundColor: selectedPlan === plan.id ? '#0d0a04' : colors.bgCard, cursor: 'pointer', position: 'relative' as const, transition: 'border-color 0.15s' }}
                  >
                    {plan.popular && <div style={{ position: 'absolute' as const, top: '-12px', left: '50%', transform: 'translateX(-50%)', padding: '3px 14px', backgroundColor: colors.gold, color: '#050505', fontSize: '11px', fontWeight: fontWeight.bold, borderRadius: '20px' }}>MOST POPULAR</div>}
                    <div style={{ fontSize: fontSize.base, color: colors.textSecondary, marginBottom: '6px' }}>{plan.name}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '32px', fontWeight: fontWeight.extrabold, color: plan.popular ? colors.gold : colors.textPrimary }}>{plan.price}</span>
                      <span style={{ fontSize: fontSize.base, color: colors.textMuted }}>{plan.period}</span>
                    </div>
                    <div style={{ fontSize: fontSize.sm, color: colors.textDisabled, marginBottom: '20px', textDecoration: 'line-through' }}>was {plan.was}</div>
                    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
                      {plan.features.map(f => (
                        <div key={f} style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: fontSize.base, color: colors.textBody }}>
                          <span style={{ color: colors.success }}>✓</span>{f}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {error && <div style={{ padding: '14px 16px', backgroundColor: colors.errorBg, border: `1px solid ${colors.errorBorder}`, borderRadius: '6px', fontSize: fontSize.base, color: colors.error, marginBottom: '16px' }}>{error}</div>}
              <button onClick={handleContinue} style={{ width: '100%', padding: '16px', backgroundColor: colors.gold, color: '#050505', fontWeight: fontWeight.bold, borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: fontSize.md }}>
                Continue with {PLANS.find(p => p.id === selectedPlan)?.name || 'selected plan'} →
              </button>
              <div style={{ marginTop: '16px', textAlign: 'center' as const, fontSize: fontSize.sm, color: colors.textMuted }}>
                Already have an account?{' '}
                <a href='/login' style={{ color: colors.gold, textDecoration: 'none' }}>Sign in</a>
              </div>
            </>
          ) : (
            <div style={{ padding: '40px', border: `1px solid ${colors.borderBase}`, borderRadius: '12px', backgroundColor: colors.bgCard }}>
              <button onClick={() => setStep('plan')} style={{ background: 'none', border: 'none', color: colors.textMuted, cursor: 'pointer', fontSize: fontSize.base, marginBottom: '24px', padding: '0', display: 'flex', alignItems: 'center', gap: '6px' }}>← Back to plans</button>
              <div style={{ fontSize: '11px', color: colors.gold, letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: '8px', fontWeight: fontWeight.semibold }}>
                {PLANS.find(p => p.id === selectedPlan)?.name}
              </div>
              <div style={{ fontSize: '26px', fontWeight: fontWeight.bold, marginBottom: '8px' }}>Your details</div>
              <div style={{ fontSize: fontSize.base, color: colors.textSecondary, marginBottom: '32px', lineHeight: '1.6' }}>Complete your details then proceed to secure payment via Stripe.</div>
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Full name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder='Your full name' style={inputStyle} />
              </div>
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Business email</label>
                <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} type='email' placeholder='you@company.com' style={inputStyle} />
              </div>
              <div style={{ marginBottom: '28px' }}>
                <label style={labelStyle}>Company name</label>
                <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder='Your company name' style={inputStyle} />
              </div>
              {error && <div style={{ padding: '14px 16px', backgroundColor: colors.errorBg, border: `1px solid ${colors.errorBorder}`, borderRadius: '6px', fontSize: fontSize.base, color: colors.error, marginBottom: '18px' }}>{error}</div>}
              <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '14px', backgroundColor: colors.gold, color: '#050505', fontWeight: fontWeight.bold, borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: fontSize.md, opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Redirecting to payment...' : 'Continue to Payment →'}
              </button>
              <div style={{ marginTop: '16px', textAlign: 'center' as const, fontSize: fontSize.sm, color: colors.textMuted, lineHeight: '1.7' }}>
                You will be taken to Stripe to complete your subscription securely. No payment stored by BEI.
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
