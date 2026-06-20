'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Currency = 'GBP' | 'USD'

interface CurrencyContextType {
  currency: Currency
  setCurrency: (c: Currency) => void
  sym: string
  fmt: (gbp: number) => string
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'GBP',
  setCurrency: () => {},
  sym: '£',
  fmt: (n) => '£' + n.toLocaleString(),
})

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('GBP')

  useEffect(() => {
    const saved = localStorage.getItem('bei_currency') as Currency
    if (saved === 'USD' || saved === 'GBP') setCurrencyState(saved)
  }, [])

  const setCurrency = (c: Currency) => {
    setCurrencyState(c)
    localStorage.setItem('bei_currency', c)
  }

  const sym = currency === 'USD' ? '$' : '£'
  const fmt = (gbp: number) => {
    if (currency === 'USD') return '$' + Math.round(gbp * 1.27).toLocaleString()
    return '£' + gbp.toLocaleString()
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, sym, fmt }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrencyContext() {
  return useContext(CurrencyContext)
}
