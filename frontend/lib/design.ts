/**
 * BEI Design System — Shared Tokens
 * Single source of truth for all UI values across the marketing layer.
 * Dark theme optimised for readability and premium intelligence platform feel.
 */

export const colors = {
  gold: '#C8A24A',
  goldLight: '#D4B468',
  bgBase: '#050505',
  bgCard: '#0a0a0a',
  bgInput: '#0d0d0d',
  bgActive: '#0a0f04',
  bgError: '#0f0804',
  borderBase: '#1e1e1e',
  borderSubtle: '#161616',
  borderStrong: '#2a2a2a',
  borderInput: '#333333',
  borderActive: '#2a3a1a',
  borderError: '#3a1a1a',
  textPrimary: '#f0f0f0',
  textBody: '#cccccc',
  textSecondary: '#999999',
  textMuted: '#777777',
  textDisabled: '#555555',
  textPlaceholder: '#444444',
  success: '#4aaa4a',
  successBg: '#0a1a0a',
  successBorder: '#1a3a1a',
  error: '#cc4444',
  errorBg: '#1a0a0a',
  errorBorder: '#3a1a1a',
}

export const fontSize = {
  xs: '11px',
  sm: '13px',
  base: '15px',
  md: '16px',
  lg: '18px',
  xl: '22px',
  '2xl': '28px',
  '3xl': '36px',
  '4xl': '48px',
}

export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
}

export const radius = {
  sm: '4px',
  base: '6px',
  md: '8px',
  lg: '12px',
}

export const navHeight = '68px'

export const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  backgroundColor: '#0d0d0d',
  border: '1px solid #333333',
  borderRadius: '4px',
  color: '#f0f0f0',
  fontSize: '15px',
  outline: 'none',
  boxSizing: 'border-box' as const,
}

export const labelStyle = {
  display: 'block',
  fontSize: '13px',
  color: '#999999',
  marginBottom: '6px',
  fontWeight: '500',
}

export const cardStyle = {
  backgroundColor: '#0a0a0a',
  border: '1px solid #1e1e1e',
  borderRadius: '8px',
  padding: '28px',
}

export const pageWrapper = {
  backgroundColor: '#050505',
  color: '#f0f0f0',
  fontFamily: 'Inter, system-ui, sans-serif',
  minHeight: '100vh',
}

export const contentWrapper = {
  maxWidth: '1100px',
  margin: '0 auto',
  padding: '40px 24px',
}

export const navStyle = {
  padding: '0 48px',
  borderBottom: '1px solid #161616',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '68px',
  backgroundColor: '#050505',
}

export const navLinkBase = (active: boolean) => ({
  padding: '0 20px',
  height: '68px',
  display: 'flex',
  alignItems: 'center',
  fontSize: '15px',
  color: active ? '#C8A24A' : '#777777',
  borderBottom: active ? '2px solid #C8A24A' : '2px solid transparent',
  textDecoration: 'none',
  fontWeight: active ? '600' : '400',
})

export const buttonPrimary = {
  padding: '12px 28px',
  backgroundColor: '#C8A24A',
  color: '#050505',
  fontWeight: '700',
  borderRadius: '4px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '15px',
}

export const buttonSecondary = {
  padding: '12px 28px',
  backgroundColor: 'transparent',
  color: '#999999',
  fontWeight: '600',
  borderRadius: '4px',
  border: '1px solid #2a2a2a',
  cursor: 'pointer',
  fontSize: '15px',
}
