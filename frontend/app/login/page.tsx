'use client'
import { useState } from 'react'
import { createClient } from '../../lib/supabase'
import { colors, fontSize, fontWeight, inputStyle, labelStyle, pageWrapper } from '../../lib/design'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!email || !password) { setError('Please enter your email and password.'); return }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setLoading(false)
      setError(authError.message.includes('Invalid login') || authError.message.includes('user')
        ? 'No account found for this email.'
        : authError.message)
      return
    }
    window.location.href = '/dashboard'
  }

  return (
    <main style={pageWrapper}>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <a href='/' style={{ display: 'block', fontSize: '22px', fontWeight: fontWeight.extrabold, color: colors.gold, letterSpacing: '0.12em', textDecoration: 'none', marginBottom: '48px', textAlign: 'center' as const }}>BEI</a>
          <div style={{ padding: '40px', border: `1px solid ${colors.borderBase}`, borderRadius: '12px', backgroundColor: colors.bgCard }}>
            <div style={{ fontSize: '11px', color: colors.gold, letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: '8px', fontWeight: fontWeight.semibold }}>Intelligence Platform</div>
            <div style={{ fontSize: '26px', fontWeight: fontWeight.bold, marginBottom: '8px' }}>Sign in</div>
            <div style={{ fontSize: fontSize.base, color: colors.textSecondary, marginBottom: '32px', lineHeight: '1.6' }}>Access your Business Intelligence dashboard.</div>
            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Email address</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type='email' placeholder='you@company.com' onKeyDown={e => e.key === 'Enter' && handleSubmit()} style={inputStyle} />
            </div>
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={labelStyle}>Password</label>
                <a href='/forgot-password' style={{ fontSize: fontSize.sm, color: colors.gold, textDecoration: 'none' }}>Forgot password?</a>
              </div>
              <input value={password} onChange={e => setPassword(e.target.value)} type='password' placeholder='••••••••' onKeyDown={e => e.key === 'Enter' && handleSubmit()} style={inputStyle} />
            </div>
            {error && (
              <div style={{ padding: '14px 16px', backgroundColor: colors.errorBg, border: `1px solid ${colors.errorBorder}`, borderRadius: '6px', fontSize: fontSize.base, color: colors.error, marginBottom: '18px', lineHeight: '1.6' }}>
                {error}{' '}
                {error.includes('No account') && (
                  <a href='/register' style={{ color: colors.gold, textDecoration: 'none', fontWeight: fontWeight.semibold }}>Request access →</a>
                )}
              </div>
            )}
            <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '14px', backgroundColor: colors.gold, color: '#050505', fontWeight: fontWeight.bold, borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: fontSize.md, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
            <div style={{ marginTop: '24px', textAlign: 'center' as const, fontSize: fontSize.base, color: colors.textMuted }}>
              Don&#39;t have an account?{' '}
              <a href='/register' style={{ color: colors.gold, textDecoration: 'none', fontWeight: fontWeight.medium }}>Request access</a>
            </div>
          </div>
          <div style={{ marginTop: '24px', padding: '16px 20px', border: `1px solid ${colors.borderSubtle}`, borderRadius: '8px', backgroundColor: colors.bgCard, display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '16px', color: colors.gold }}>◈</div>
            <div style={{ fontSize: fontSize.base, color: colors.textMuted, lineHeight: '1.7' }}>BEI is an invitation-only intelligence platform. Account access requires approval from the BEI team.</div>
          </div>
        </div>
      </div>
    </main>
  )
}
