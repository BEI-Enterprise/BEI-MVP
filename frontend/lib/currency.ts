'use client'
import { useState, useEffect } from 'react'

export type Currency = 'GBP' | 'USD'

export function useCurrency(savedLocation?: string): Currency {
  const [currency, setCurrency] = useState<Currency>('GBP')

  useEffect(() => {
    // localStorage takes priority over everything
    const stored = localStorage.getItem('bei_currency') as Currency
    if (stored === 'USD' || stored === 'GBP') {
      setCurrency(stored)
      return
    }
    // Fall back to savedLocation preference
    if (savedLocation) {
      setCurrency(savedLocation === 'United States' ? 'USD' : 'GBP')
      return
    }
    // Fall back to timezone detection
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
      const locale = navigator.language
      if (tz.startsWith('America/') || locale.startsWith('en-US')) {
        setCurrency('USD')
      }
    } catch {}

    // Listen for toggle changes without reload
    const handler = (e: any) => setCurrency(e.detail)
    window.addEventListener('bei_currency_change', handler)
    return () => window.removeEventListener('bei_currency_change', handler)
  }, [savedLocation])

  return currency
}

export function formatPrice(gbp: number, currency: Currency): string {
  if (currency === 'USD') return '$' + Math.round(gbp * 1.27).toLocaleString()
  return '£' + gbp.toLocaleString()
}

export function getCurrencySymbol(currency: Currency): string {
  return currency === 'USD' ? '$' : '£'
}
