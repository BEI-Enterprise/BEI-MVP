'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

function getSessionId() {
  if (typeof window === 'undefined') return null
  let sid = sessionStorage.getItem('bei_sid')
  if (!sid) {
    sid = Math.random().toString(36).slice(2) + Date.now().toString(36)
    sessionStorage.setItem('bei_sid', sid)
  }
  return sid
}

export default function PageTracker() {
  const pathname = usePathname()
  useEffect(() => {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: pathname,
        referrer: document.referrer || '',
        session_id: getSessionId(),
      }),
    }).catch(() => {})
  }, [pathname])
  return null
}
