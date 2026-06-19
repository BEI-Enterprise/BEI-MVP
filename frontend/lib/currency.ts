'use client'
import { useState, useEffect } from 'react'

export type Currency = 'GBP' | 'USD'

export function useCurrency(): Currency {
  const [currency, setCurrency] = useState<Currency>('GBP')
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
      const locale = navigator.language || ''
      if (tz.startsWith('America/') || locale.startsWith('en-US')) {
        setCurrency('USD')
      }
    } catch (e) {}
  }, [])
  return currency
}

export function formatPrice(gbp: number, currency: Currency): string {
  if (currency === 'USD') {
    const usd = Math.round(gbp * 1.27)
    return '$' + usd.toLocaleString()
  }
  return '£' + gbp.toLocaleString()
}

export function getCurrencySymbol(currency: Currency): string {
  return currency === 'USD' ? '$' : '£'
}
