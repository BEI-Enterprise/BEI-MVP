'use client'

import { useState, useEffect } from 'react'

const gold = '#C8A24A'

type NavProps = {
  active?: string
}

export default function Nav({ active }: NavProps) {
  const [productsOpen, setProductsOpen] = useState(false)
  const [currency, setCurrencyState] = useState<'GBP' | 'USD'>('GBP')

  useEffect(() => {
    const saved = localStorage.getItem('bei_currency')
    if (saved === 'USD' || saved === 'GBP') setCurrencyState(saved)
    const handler = (e: any) => setCurrencyState(e.detail)
    window.addEventListener('bei_currency_change', handler)
    return () => window.removeEventListener('bei_currency_change', handler)
  }, [])

  const toggleCurrency = (c: 'GBP' | 'USD') => {
    if (currency === c) return
    localStorage.setItem('bei_currency', c)
    setCurrencyState(c)
    window.dispatchEvent(new CustomEvent('bei_currency_change', { detail: c }))
  }

  const links = [
    { l: 'Platform', h: '/platform' },
    { l: 'Products', h: '#', dropdown: true },
    { l: 'Our Clients', h: '/clients' },
    { l: 'Pricing', h: '/pricing' },
    { l: 'Example Report', h: '/example-report' },
  ]

  const productLinks = [
    { l: 'Business MRI™', h: '/products/business-mri', desc: 'Full constraint intelligence report' },
    { l: 'Outcome & Deployment Centre™', h: '/products/outcome-deployment', desc: 'Deployment tiers and opportunity tracking' },
    { l: 'BEI Intelligence™', h: '/products/bei-intelligence', desc: 'Human + AI continuous monitoring' },
  ]

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 100, padding: '0 48px', height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #161616', backgroundColor: 'rgba(5,5,5,0.97)', backdropFilter: 'blur(12px)' }}>
      <a href='/' style={{ fontSize: '20px', fontWeight: '800', color: gold, letterSpacing: '0.12em', textDecoration: 'none' }}>BEI</a>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        {links.map(n => (
          n.dropdown ? (
            <div
              key="products"
              style={{ position: 'relative' }}
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
            >
              <button style={{
                padding: '0 20px',
                height: '68px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '15px',
                color: active === 'products' ? gold : '#777777',
                borderBottom: active === 'products' ? '2px solid #C8A24A' : '2px solid transparent',
                background: 'none',
                border: 'none',
                borderBottomWidth: '2px',
                borderBottomStyle: 'solid',
                borderBottomColor: active === 'products' ? '#C8A24A' : 'transparent',
                cursor: 'pointer',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: active === 'products' ? '600' : '400',
              }}>
                Products
                <span style={{ fontSize: '10px', color: '#888', marginTop: '1px' }}>▼</span>
              </button>

              {productsOpen && (
                <div style={{
                  position: 'absolute',
                  top: '68px',
                  left: '0',
                  backgroundColor: '#0a0a0a',
                  border: '1px solid #1e1e1e',
                  borderRadius: '8px',
                  padding: '8px',
                  minWidth: '280px',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
                  zIndex: 200,
                }}>
                  {productLinks.map(p => (
                    <a key={p.h} href={p.h} style={{
                      display: 'block',
                      padding: '12px 16px',
                      textDecoration: 'none',
                      borderRadius: '6px',
                      borderBottom: 'none',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#141414')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#f0f0f0', marginBottom: '3px' }}>{p.l}</div>
                      <div style={{ fontSize: '12px', color: '#888' }}>{p.desc}</div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <a key={n.h} href={n.h} style={{
              padding: '0 20px',
              height: '68px',
              display: 'flex',
              alignItems: 'center',
              fontSize: '15px',
              color: active === n.h ? gold : '#777777',
              borderBottom: active === n.h ? '2px solid #C8A24A' : '2px solid transparent',
              textDecoration: 'none',
              fontWeight: active === n.h ? '600' : '400',
            }}>{n.l}</a>
          )
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#0a0a0a', border: '1px solid #222', borderRadius: '6px', padding: '2px', gap: '2px' }}>
          <button onClick={() => toggleCurrency('GBP')} style={{ padding: '6px 14px', borderRadius: '4px', border: 'none', backgroundColor: currency === 'GBP' ? gold : 'transparent', color: currency === 'GBP' ? '#050505' : '#444', fontSize: '13px', fontWeight: '700', cursor: 'pointer', letterSpacing: '0.04em', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '6px' }}>
            🇬🇧 GBP
          </button>
          <button onClick={() => toggleCurrency('USD')} style={{ padding: '6px 14px', borderRadius: '4px', border: 'none', backgroundColor: currency === 'USD' ? gold : 'transparent', color: currency === 'USD' ? '#050505' : '#444', fontSize: '13px', fontWeight: '700', cursor: 'pointer', letterSpacing: '0.04em', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '6px' }}>
            🇺🇸 USD
          </button>
        </div>
        <a href='/login' style={{ fontSize: '15px', color: '#777777', textDecoration: 'none' }}>Sign in</a>
        <a href='/book' style={{ padding: '10px 22px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '6px', textDecoration: 'none', fontSize: '15px' }}>Free MRI →</a>
      </div>
    </nav>
  )
}
