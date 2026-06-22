'use client'
import { useState, useEffect } from 'react'

export type Currency = 'GBP' | 'USD'

export function useCurrency(savedLocation?: string): Currency {
  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === 'undefined') return 'GBP'
    const stored = localStorage.getItem('bei_currency')
    if (stored === 'USD' || stored === 'GBP') return stored
    if (savedLocation === 'United States') return 'USD'
    return 'GBP'
  })

  useEffect(() => {
    const stored = localStorage.getItem('bei_currency')
    if (stored === 'USD' || stored === 'GBP') setCurrency(stored)
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
