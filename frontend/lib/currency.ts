'use client'
import { useState, useEffect } from 'react'

export type Currency = 'GBP' | 'USD'

function getStoredCurrency(): Currency {
  if (typeof window === 'undefined') return 'GBP'
  const stored = localStorage.getItem('bei_currency')
  return stored === 'USD' ? 'USD' : 'GBP'
}

export function useCurrency(savedLocation?: string): Currency {
  const [currency, setCurrency] = useState<Currency>(getStoredCurrency)

  useEffect(() => {
    const handler = (e: any) => setCurrency(e.detail as Currency)
    window.addEventListener('bei_currency_change', handler)
    return () => window.removeEventListener('bei_currency_change', handler)
  }, [])

  return currency
}

export function formatPrice(gbp: number, currency: Currency): string {
  if (currency === 'USD') return '$' + Math.round(gbp * 1.27).toLocaleString()
  return '£' + gbp.toLocaleString()
}

export function getCurrencySymbol(currency: Currency): string {
  return currency === 'USD' ? '$' : '£'
}
