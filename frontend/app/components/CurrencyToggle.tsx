'use client'
import { useCurrencyContext } from '../context/CurrencyContext'

export default function CurrencyToggle({ style }: { style?: React.CSSProperties }) {
  const { currency, setCurrency } = useCurrencyContext()
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '4px', backgroundColor: '#0a0a0a', border: '1px solid #1e1e1e', borderRadius: '20px', ...style }}>
      <button
        onClick={() => setCurrency('GBP')}
        style={{
          padding: '4px 10px',
          borderRadius: '16px',
          border: 'none',
          backgroundColor: currency === 'GBP' ? '#C8A24A' : 'transparent',
          color: currency === 'GBP' ? '#050505' : '#555',
          fontSize: '12px',
          fontWeight: currency === 'GBP' ? '700' : '400',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        🇬🇧 £
      </button>
      <button
        onClick={() => setCurrency('USD')}
        style={{
          padding: '4px 10px',
          borderRadius: '16px',
          border: 'none',
          backgroundColor: currency === 'USD' ? '#C8A24A' : 'transparent',
          color: currency === 'USD' ? '#050505' : '#555',
          fontSize: '12px',
          fontWeight: currency === 'USD' ? '700' : '400',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        🇺🇸 $
      </button>
    </div>
  )
}
