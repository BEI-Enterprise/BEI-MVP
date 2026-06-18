'use client'
import { useState } from 'react'
import { createClient } from '../../lib/supabase'
import { colors, fontSize, fontWeight, inputStyle, labelStyle, pageWrapper } from '../../lib/design'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!email) { setError('Please enter your email address.'); return }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/dashboard`,
    })
    setLoading(false)
    if (resetError) { setError(resetError.message); return }
    setSubmitted(true)
  }

  return (
    <main style={pageWrapper}>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <a href='/' style={{ display: 'block', fontSize: '22px', fontWeight: fontWeight.extrabold, color: colors.gold, letterSpacing: '0.12em', textDecoration: 'none', marginBottom: '48px', textAlign: 'center' as const }}>BEI</a>
          <div style={{ padding: '40px', border: `1px solid ${colors.borderBase}`, borderRadius: '12px', backgroundColor: colors.bgCard }}>
            {submitted ? (
              <>
                <div style={{ fontSize: '26px', fontWeight: fontWeight.bold, marginBottom: '16px' }}>Check your email</div>
                <div style={{ fontSize: fontSize.base, color: colors.textBody, lineHeight: '1.75', marginBottom: '28px' }}>
                  We have sent a password reset link to <strong style={{ color: colors.textPrimary }}>{email}</strong>. Check your inbox and follow the instructions.
                </div>
                <a href='/login' style={{ display: 'block', textAlign: 'center' as const, padding: '14px', backgroundColor: colors.gold, color: '#050505', fontWeight: fontWeight.bold, borderRadius: '6px', textDecoration: 'none', fontSize: fontSize.md }}>Back to sign in</a>
              </>
            ) : (
              <>
                <div style={{ fontSize: '26px', fontWeight: fontWeight.bold, marginBottom: '8px' }}>Reset password</div>
                <div style={{ fontSize: fontSize.base, color: colors.textSecondary, marginBottom: '32px', lineHeight: '1.6' }}>Enter your email address and we will send you a reset link.</div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={labelStyle}>Email address</label>
                  <input value={email} onChange={e => setEmail(e.target.value)} type='email' placeholder='you@company.com' onKeyDown={e => e.key === 'Enter' && handleSubmit()} style={inputStyle} />
                </div>
                {error && (
                  <div style={{ padding: '14px 16px', backgroundColor: colors.errorBg, border: `1px solid ${colors.errorBorder}`, borderRadius: '6px', fontSize: fontSize.base, color: colors.error, marginBottom: '18px' }}>{error}</div>
                )}
                <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '14px', backgroundColor: colors.gold, color: '#050505', fontWeight: fontWeight.bold, borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: fontSize.md, opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Sending...' : 'Send reset link →'}
                </button>
                <div style={{ marginTop: '24px', textAlign: 'center' as const, fontSize: fontSize.base, color: colors.textMuted }}>
                  <a href='/login' style={{ color: colors.gold, textDecoration: 'none' }}>← Back to sign in</a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
