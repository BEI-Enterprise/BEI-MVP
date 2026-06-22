'use client'
import { useCurrencyContext } from '../context/CurrencyContext'

const gold = '#C8A24A'

export default function CurrencyToggle({ style }: { style?: React.CSSProperties }) {
  const { currency, setCurrency } = useCurrencyContext()
  return (
    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#0a0a0a', border: '1px solid #222', borderRadius: '6px', padding: '2px', gap: '2px', ...style }}>
      <button onClick={() => setCurrency('GBP')} style={{ padding: '6px 14px', borderRadius: '4px', border: 'none', backgroundColor: currency === 'GBP' ? gold : 'transparent', color: currency === 'GBP' ? '#050505' : '#444', fontSize: '13px', fontWeight: '700', cursor: 'pointer', letterSpacing: '0.04em', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '6px' }}>
        🇬🇧 GBP
      </button>
      <button onClick={() => setCurrency('USD')} style={{ padding: '6px 14px', borderRadius: '4px', border: 'none', backgroundColor: currency === 'USD' ? gold : 'transparent', color: currency === 'USD' ? '#050505' : '#444', fontSize: '13px', fontWeight: '700', cursor: 'pointer', letterSpacing: '0.04em', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '6px' }}>
        🇺🇸 USD
      </button>
    </div>
  )
}
