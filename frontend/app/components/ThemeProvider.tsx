'use client'
import { useEffect } from 'react'

export function ThemeProvider() {
  useEffect(() => {
    const saved = localStorage.getItem('bei_theme') || 'dark'
    applyTheme(saved)
  }, [])
  return null
}

export function applyTheme(theme: string) {
  const root = document.documentElement
  if (theme === 'light') {
    root.style.setProperty('--bg-primary', '#f5f5f0')
    root.style.setProperty('--bg-card', '#ffffff')
    root.style.setProperty('--bg-sidebar', '#fafaf8')
    root.style.setProperty('--bg-elevated', '#f0f0ea')
    root.style.setProperty('--border', '#e0ddd8')
    root.style.setProperty('--text-primary', '#1a1a18')
    root.style.setProperty('--text-secondary', '#4a4a44')
    root.style.setProperty('--text-muted', '#888880')
    root.style.setProperty('--text-faint', '#bbb')
    root.style.setProperty('--sidebar-border', '#e8e5e0')
    root.style.setProperty('--input-bg', '#f0f0ea')
    root.classList.add('light')
    root.classList.remove('dark')
  } else {
    root.style.setProperty('--bg-primary', '#050505')
    root.style.setProperty('--bg-card', '#0e0e0e')
    root.style.setProperty('--bg-sidebar', '#0a0a0a')
    root.style.setProperty('--bg-elevated', '#111111')
    root.style.setProperty('--border', '#1e1e1e')
    root.style.setProperty('--text-primary', '#ffffff')
    root.style.setProperty('--text-secondary', '#cccccc')
    root.style.setProperty('--text-muted', '#888888')
    root.style.setProperty('--text-faint', '#333333')
    root.style.setProperty('--sidebar-border', '#1a1a1a')
    root.style.setProperty('--input-bg', '#0e0e0e')
    root.classList.add('dark')
    root.classList.remove('light')
  }
  localStorage.setItem('bei_theme', theme)
}
