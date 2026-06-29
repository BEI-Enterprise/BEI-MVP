'use client'
import React, { useState, useEffect } from 'react'
import AskBEI from './AskBEI'
import { ThemeProvider, applyTheme } from './ThemeProvider'
import { createClient } from '../../lib/supabase'

const gold = '#C8A24A'
const sidebar = '#0a0a0a'
const sidebarBorder = '#1a1a1a'

export default function DashboardShell({ children, activeId }: { children: React.ReactNode, activeId?: string }) {
  const [user, setUser] = useState<any>(null)
  const [collapsed, setCollapsed] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [theme, setTheme] = useState('dark')
  const [searchVal, setSearchVal] = useState('')
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const saved = localStorage.getItem('bei_theme') || 'dark'
    setTheme(saved)
    applyTheme(saved)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    applyTheme(next)
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Executive'
  const userInitial = userName.charAt(0).toUpperCase()

  const navSections = [
    { section: 'COMMAND CENTRE', items: [
      { id: 'dashboard', label: 'Executive Command Centre', href: '/dashboard' },
      { id: 'twin', label: 'Business Twin™ Centre', href: '/connect' },
      { id: 'constraints', label: 'Constraint Intelligence™', href: '/constraints' },
      { id: 'opportunities', label: 'Opportunity Centre™', href: '/opportunities' },
      { id: 'risk', label: 'Risk Intelligence™', href: '/risk' },
      { id: 'performance', label: 'Performance Intelligence™', href: '/performance' },
      { id: 'industry', label: 'Industry Intelligence™', href: '/industry' },
    ]},
    { section: 'EXECUTION', items: [
      { id: 'deployment', label: 'Outcome & Deployment™', href: '/deployments' },
      { id: 'operations', label: 'Intelligence Operations™', href: '/intelligence-ops' },
      { id: 'admin', label: 'Settings', href: '/settings' },
    ]},
  ]

  const icons: Record<string, (a: boolean) => React.ReactElement> = {
    dashboard: (a) => <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 1L1 7h2v7h4v-4h2v4h4V7h2L8 1z" stroke={a?gold:'#555'} strokeWidth="1.3" fill={a?'rgba(200,162,74,0.15)':'none'} strokeLinejoin="round"/></svg>,
    twin: (a) => <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke={a?gold:'#555'} strokeWidth="1.2"/><circle cx="8" cy="8" r="2.5" stroke={a?gold:'#555'} strokeWidth="1.2" fill={a?'rgba(200,162,74,0.2)':'none'}/><line x1="8" y1="1.5" x2="8" y2="5" stroke={a?gold:'#555'} strokeWidth="1.2"/><line x1="8" y1="11" x2="8" y2="14.5" stroke={a?gold:'#555'} strokeWidth="1.2"/><line x1="1.5" y1="8" x2="5" y2="8" stroke={a?gold:'#555'} strokeWidth="1.2"/><line x1="11" y1="8" x2="14.5" y2="8" stroke={a?gold:'#555'} strokeWidth="1.2"/></svg>,
    constraints: (a) => <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke={a?gold:'#555'} strokeWidth="1.2"/><circle cx="8" cy="8" r="3" stroke={a?gold:'#555'} strokeWidth="1.2" fill={a?'rgba(200,162,74,0.15)':'none'}/><line x1="8" y1="5" x2="8" y2="3" stroke={a?gold:'#555'} strokeWidth="1.2"/><line x1="11" y1="8" x2="13" y2="8" stroke={a?gold:'#555'} strokeWidth="1.2"/><line x1="8" y1="11" x2="8" y2="13" stroke={a?gold:'#555'} strokeWidth="1.2"/><line x1="5" y1="8" x2="3" y2="8" stroke={a?gold:'#555'} strokeWidth="1.2"/></svg>,
    opportunities: (a) => <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 1.5L10 6h4.5L11 9l1.5 4.5L8 11l-4.5 2.5L5 9 1.5 6H6L8 1.5z" stroke={a?gold:'#555'} strokeWidth="1.2" fill={a?'rgba(200,162,74,0.15)':'none'} strokeLinejoin="round"/></svg>,
    risk: (a) => <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 1.5L14.5 13H1.5L8 1.5z" stroke={a?gold:'#555'} strokeWidth="1.2" fill={a?'rgba(200,162,74,0.1)':'none'} strokeLinejoin="round"/><line x1="8" y1="6" x2="8" y2="9.5" stroke={a?gold:'#555'} strokeWidth="1.4"/><circle cx="8" cy="11.5" r="0.8" fill={a?gold:'#555'}/></svg>,
    performance: (a) => <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><polyline points="1,12 5,7 8,9 11,4 15,6" stroke={a?gold:'#555'} strokeWidth="1.4" fill="none" strokeLinejoin="round" strokeLinecap="round"/><polyline points="11,4 15,4 15,8" stroke={a?gold:'#555'} strokeWidth="1.2" fill="none" strokeLinejoin="round" strokeLinecap="round"/></svg>,
    industry: (a) => <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke={a?gold:'#555'} strokeWidth="1.2"/><ellipse cx="8" cy="8" rx="3" ry="6.5" stroke={a?gold:'#555'} strokeWidth="1.2"/><line x1="1.5" y1="5.5" x2="14.5" y2="5.5" stroke={a?gold:'#555'} strokeWidth="1"/><line x1="1.5" y1="10.5" x2="14.5" y2="10.5" stroke={a?gold:'#555'} strokeWidth="1"/></svg>,
    deployment: (a) => <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 1.5C8 1.5 13 5 13 9a5 5 0 01-10 0c0-4 5-7.5 5-7.5z" stroke={a?gold:'#555'} strokeWidth="1.2" fill={a?'rgba(200,162,74,0.1)':'none'}/><line x1="8" y1="9" x2="8" y2="14" stroke={a?gold:'#555'} strokeWidth="1.2"/><line x1="5.5" y1="12" x2="10.5" y2="12" stroke={a?gold:'#555'} strokeWidth="1.2"/></svg>,
    operations: (a) => <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke={a?gold:'#555'} strokeWidth="1.2" fill={a?'rgba(200,162,74,0.15)':'none'}/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.1 3.1l1.4 1.4M11.5 11.5l1.4 1.4M3.1 12.9l1.4-1.4M11.5 4.5l1.4-1.4" stroke={a?gold:'#555'} strokeWidth="1.2" strokeLinecap="round"/></svg>,
    admin: (a) => <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke={a?gold:'#555'} strokeWidth="1.2" fill={a?'rgba(200,162,74,0.15)':'none'}/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.1 3.1l1.4 1.4M11.5 11.5l1.4 1.4M3.1 12.9l1.4-1.4M11.5 4.5l1.4-1.4" stroke={a?gold:'#555'} strokeWidth="1.2" strokeLinecap="round"/></svg>,
  }

  return (
    <><ThemeProvider />
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* SIDEBAR */}
      <div style={{ width: collapsed ? '60px' : '240px', minHeight: '100vh', backgroundColor: sidebar, borderRight: '1px solid var(--sidebar-border)', display: 'flex', flexDirection: 'column' as const, position: 'fixed' as const, top: 0, left: 0, bottom: 0, zIndex: 50, transition: 'width 0.2s ease', overflowX: 'hidden' as const, overflowY: 'auto' as const }}>

        {/* Logo */}
        <div style={{ padding: collapsed ? '18px 0' : '18px 18px', borderBottom: '1px solid var(--sidebar-border)', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', minHeight: '60px', flexShrink: 0 }}>
          {!collapsed && <div><div style={{ fontSize: '20px', fontWeight: '900', color: gold, letterSpacing: '0.15em' }}>BEI<sup style={{ fontSize: '16px', verticalAlign: 'super' }}>TM</sup></div><div style={{ fontSize: '16px', color: 'var(--text-secondary)', letterSpacing: '0.18em', marginTop: '2px' }}>BUSINESS EXECUTION INTELLIGENCE</div></div>}
          <button onClick={() => setCollapsed(!collapsed)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '16px', padding: '4px', flexShrink: 0 }}>{collapsed ? '▶' : '◀'}</button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' as const }}>
          {navSections.map(({ section, items }) => (
            <div key={section}>
              {!collapsed && <div style={{ fontSize: '16px', color: 'var(--text-faint)', letterSpacing: '0.2em', fontWeight: '700', padding: '12px 18px 5px', textTransform: 'uppercase' as const }}>{section}</div>}
              {items.map(item => {
                const isActive = activeId === item.id
                const Icon = icons[item.id]
                return (
                  <a key={item.id} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: collapsed ? '10px 0' : '9px 16px', justifyContent: collapsed ? 'center' : 'flex-start', textDecoration: 'none', backgroundColor: isActive ? 'rgba(200,162,74,0.08)' : 'transparent', borderLeft: isActive ? `2px solid ${gold}` : '2px solid transparent', color: isActive ? gold : '#777', fontSize: '16px', fontWeight: isActive ? '600' : '400', transition: 'all 0.15s', whiteSpace: 'nowrap' as const }}
                    onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.color = '#ccc'; (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.03)' }}}
                    onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.color = '#777'; (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}}
                  >
                    <span style={{ flexShrink: 0, width: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Icon && Icon(isActive)}</span>
                    {!collapsed && <span>{item.label}</span>}
                  </a>
                )
              })}
              {!collapsed && <div style={{ height: '1px', backgroundColor: 'var(--bg-elevated)', margin: '6px 0' }} />}
            </div>
          ))}
        </nav>

        {/* BEI Assistant panel */}
        {!collapsed && (
          <div style={{ margin: '0 12px 10px', flexShrink: 0 }}>
            <button onClick={() => window.dispatchEvent(new CustomEvent('open-ask-bei'))} style={{ width: '100%', backgroundColor: 'rgba(200,162,74,0.05)', border: '1px solid rgba(200,162,74,0.15)', borderRadius: '10px', padding: '11px 13px', cursor: 'pointer', textAlign: 'left' as const, display: 'block' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '16px', color: gold }}>✦</span>
                  <span style={{ fontSize: '16px', fontWeight: '700', color: gold, letterSpacing: '0.05em' }}>BEI ASSISTANT</span>
                </div>
                <div style={{ width: '20px', height: '20px', borderRadius: '5px', backgroundColor: 'rgba(200,162,74,0.12)', border: '1px solid rgba(200,162,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', color: gold }}>→</div>
              </div>
              <div style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>Ask BEI anything about your Business Twin...</div>
            </button>
          </div>
        )}

        {/* Status */}
        {!collapsed && (
          <div style={{ padding: '10px 16px', borderTop: '1px solid var(--sidebar-border)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#4aaa4a', boxShadow: '0 0 5px rgba(74,170,74,0.7)' }} />
              <span style={{ fontSize: '16px', color: '#4aaa4a', fontWeight: '600', letterSpacing: '0.12em' }}>INTELLIGENCE ACTIVE</span>
            </div>
            <div style={{ fontSize: '16px', color: 'var(--text-faint)', marginTop: '2px' }}>All systems operational</div>
          </div>
        )}
      </div>

      {/* MAIN AREA */}
      <div style={{ marginLeft: collapsed ? '60px' : '240px', flex: 1, display: 'flex', flexDirection: 'column' as const, transition: 'margin-left 0.2s ease', minWidth: 0 }}>

        {/* TOP BAR */}
        <div style={{ height: '56px', backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--sidebar-border)', display: 'flex', alignItems: 'center', padding: '0 20px', gap: '12px', position: 'sticky' as const, top: 0, zIndex: 40 }}>
          <div style={{ flex: 1, maxWidth: '380px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', padding: '7px 12px' }}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="#444" strokeWidth="1.5"/><line x1="10.5" y1="10.5" x2="14" y2="14" stroke="#444" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <input value={searchVal} onChange={e => setSearchVal(e.target.value)} placeholder="Search BEI Intelligence..." style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-muted)', fontSize: '16px', flex: 1, minWidth: 0 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                <kbd style={{ fontSize: '16px', color: 'var(--text-faint)', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '3px', padding: '1px 4px' }}>⌘</kbd>
                <kbd style={{ fontSize: '16px', color: 'var(--text-faint)', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '3px', padding: '1px 4px' }}>K</kbd>
              </div>
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <button onClick={() => window.dispatchEvent(new CustomEvent('open-ask-bei'))} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 16px', backgroundColor: 'rgba(200,162,74,0.1)', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '8px', color: gold, fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
            <span>✦</span> Ask BEI
          </button>
          <button onClick={toggleTheme} title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'} style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '16px' }}>
            {theme === 'dark' ? '☀' : '◑'}
          </button>
          <button onClick={() => setNotifOpen(!notifOpen)} style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' as const }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5C5.5 1.5 4 3.5 4 6v4l-1.5 1.5h11L12 10V6c0-2.5-1.5-4.5-4-4.5z" stroke="#666" strokeWidth="1.3" fill="none"/><path d="M6.5 13a1.5 1.5 0 003 0" stroke="#666" strokeWidth="1.3" fill="none"/></svg>
            <div style={{ position: 'absolute' as const, top: '7px', right: '7px', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#cc4444', border: '1.5px solid #050505' }} />
          </button>
          <a href="/book" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '16px', textDecoration: 'none', whiteSpace: 'nowrap' as const }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="3.5" width="13" height="11" rx="1.5" stroke="#555" strokeWidth="1.3"/><line x1="1.5" y1="7" x2="14.5" y2="7" stroke="#555" strokeWidth="1.3"/><line x1="5" y1="1.5" x2="5" y2="5" stroke="#555" strokeWidth="1.3" strokeLinecap="round"/><line x1="11" y1="1.5" x2="11" y2="5" stroke="#555" strokeWidth="1.3" strokeLinecap="round"/></svg>
            Book Session
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '6px', backgroundColor: 'rgba(200,162,74,0.12)', border: '1px solid rgba(200,162,74,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '700', color: gold }}>{userInitial}</div>
            <div><div style={{ fontSize: '16px', color: '#ccc', fontWeight: '600', lineHeight: '1' }}>{userName}</div><div style={{ fontSize: '16px', color: 'var(--text-secondary)', marginTop: '2px' }}>Executive</div></div>
            <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/login' }} style={{ background: 'none', border: 'none', color: 'var(--text-faint)', cursor: 'pointer', fontSize: '16px', padding: '2px 4px' }}>Sign out</button>
          </div>
        </div>

        {/* PAGE CONTENT */}
        <div style={{ flex: 1, padding: '24px', minWidth: 0 }}>{children}</div>

        <AskBEI />

        {/* BOTTOM BAR */}
        <div style={{ height: '30px', backgroundColor: 'var(--bg-sidebar)', borderTop: '1px solid var(--sidebar-border)', display: 'flex', alignItems: 'center', padding: '0 20px', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#4aaa4a' }} />
            <span style={{ fontSize: '16px', color: '#4aaa4a', letterSpacing: '0.08em' }}>BEI Intelligence Active</span>
          </div>
          <span style={{ fontSize: '16px', color: '#222' }}>All systems operational</span>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: '16px', color: '#222' }}>Last sync: Just now ✓</span>
        </div>
      </div>
    </div>
    </>
  )
}
