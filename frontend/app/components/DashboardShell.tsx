'use client'
import { useState, useEffect } from 'react'
import { createClient } from '../../lib/supabase'

const gold = '#C8A24A'
const sidebar = '#0a0a0a'
const sidebarBorder = '#1a1a1a'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Executive Command Centre', icon: '◈', href: '/dashboard' },
  { id: 'twin', label: 'Business Twin™ Centre', icon: '⬡', href: '/connect' },
  { id: 'constraints', label: 'Constraint Intelligence™', icon: '⊗', href: '/constraints' },
  { id: 'opportunities', label: 'Opportunity Centre™', icon: '◎', href: '/opportunities' },
  { id: 'risk', label: 'Risk Intelligence™', icon: '⚠', href: '/health' },
  { id: 'performance', label: 'Performance Intelligence™', icon: '▲', href: '/outcomes' },
  { id: 'industry', label: 'Industry Intelligence™', icon: '⊞', href: '/clients' },
  { id: 'deployment', label: 'Outcome & Deployment', icon: '▶', href: '/deployments' },
  { id: 'operations', label: 'Intelligence Operations™', icon: '⊙', href: '/connect' },
  { id: 'admin', label: 'Administration', icon: '⚙', href: '/account' },
]

export default function DashboardShell({ children, activeId }: { children: React.ReactNode, activeId?: string }) {
  const [user, setUser] = useState<any>(null)
  const [collapsed, setCollapsed] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Executive'
  const userInitial = userName.charAt(0).toUpperCase()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#050505', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* SIDEBAR */}
      <div style={{
        width: collapsed ? '60px' : '240px',
        minHeight: '100vh',
        backgroundColor: sidebar,
        borderRight: `1px solid ${sidebarBorder}`,
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed' as const,
        top: 0, left: 0, bottom: 0,
        zIndex: 50,
        transition: 'width 0.2s ease',
        overflowX: 'hidden',
      }}>
        {/* Logo */}
        <div style={{ padding: collapsed ? '20px 0' : '20px 20px', borderBottom: `1px solid ${sidebarBorder}`, display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', minHeight: '64px' }}>
          {!collapsed && (
            <div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: gold, letterSpacing: '0.15em' }}>BEI</div>
              <div style={{ fontSize: '8px', color: '#555', letterSpacing: '0.2em', marginTop: '2px' }}>BUSINESS EXECUTION INTELLIGENCE</div>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '14px', padding: '4px', flexShrink: 0 }}>
            {collapsed ? '▶' : '◀'}
          </button>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
          {NAV_ITEMS.map(item => {
            const isActive = activeId === item.id
            return (
              <a key={item.id} href={item.href} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: collapsed ? '10px 0' : '10px 16px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                textDecoration: 'none',
                backgroundColor: isActive ? 'rgba(200,162,74,0.1)' : 'transparent',
                borderLeft: isActive ? `2px solid ${gold}` : '2px solid transparent',
                color: isActive ? gold : '#666',
                fontSize: '12px',
                fontWeight: isActive ? '600' : '400',
                letterSpacing: '0.02em',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap' as const,
              }}
              onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.color = '#aaa'; (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.03)' }}}
              onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.color = '#666'; (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}}
              >
                <span style={{ fontSize: '14px', flexShrink: 0, width: '16px', textAlign: 'center' as const }}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </a>
            )
          })}
        </nav>

        {/* Bottom status */}
        {!collapsed && (
          <div style={{ padding: '12px 16px', borderTop: `1px solid ${sidebarBorder}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4aaa4a', boxShadow: '0 0 6px rgba(74,170,74,0.6)' }} />
              <span style={{ fontSize: '10px', color: '#4aaa4a', fontWeight: '600', letterSpacing: '0.1em' }}>INTELLIGENCE ACTIVE</span>
            </div>
            <div style={{ fontSize: '9px', color: '#333', letterSpacing: '0.05em' }}>All systems operational</div>
          </div>
        )}
      </div>

      {/* MAIN AREA */}
      <div style={{ marginLeft: collapsed ? '60px' : '240px', flex: 1, display: 'flex', flexDirection: 'column', transition: 'margin-left 0.2s ease', minWidth: 0 }}>

        {/* TOP COMMAND BAR */}
        <div style={{
          height: '56px',
          backgroundColor: 'rgba(5,5,5,0.95)',
          borderBottom: `1px solid ${sidebarBorder}`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          gap: '16px',
          position: 'sticky' as const,
          top: 0,
          zIndex: 40,
          backdropFilter: 'blur(12px)',
        }}>
          {/* Search */}
          <div style={{ flex: 1, maxWidth: '360px', position: 'relative' as const }}>
            <span style={{ position: 'absolute' as const, left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: '#444' }}>⌕</span>
            <input
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder="Search BEI Intelligence..."
              style={{
                width: '100%',
                padding: '7px 12px 7px 30px',
                backgroundColor: '#0e0e0e',
                border: '1px solid #1e1e1e',
                borderRadius: '6px',
                color: '#aaa',
                fontSize: '12px',
                outline: 'none',
                boxSizing: 'border-box' as const,
              }}
            />
            <span style={{ position: 'absolute' as const, right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '10px', color: '#333' }}>⌘K</span>
          </div>

          <div style={{ flex: 1 }} />

          {/* Ask BEI */}
          <a href="/dashboard#ask-bei" style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '7px 14px',
            backgroundColor: 'rgba(200,162,74,0.1)',
            border: `1px solid rgba(200,162,74,0.3)`,
            borderRadius: '6px',
            color: gold,
            fontSize: '12px',
            fontWeight: '600',
            textDecoration: 'none',
            letterSpacing: '0.05em',
          }}>
            <span style={{ fontSize: '14px' }}>✦</span> Ask BEI
          </a>

          {/* Notifications */}
          <div style={{ position: 'relative' as const }}>
            <button onClick={() => setNotifOpen(!notifOpen)} style={{
              background: 'none', border: '1px solid #1e1e1e', borderRadius: '6px',
              color: '#666', cursor: 'pointer', padding: '7px 10px', fontSize: '14px',
              position: 'relative' as const,
            }}>
              🔔
              <span style={{ position: 'absolute' as const, top: '4px', right: '4px', width: '8px', height: '8px', backgroundColor: '#cc4444', borderRadius: '50%', fontSize: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>1</span>
            </button>
            {notifOpen && (
              <div style={{ position: 'absolute' as const, right: 0, top: '44px', width: '280px', backgroundColor: '#0e0e0e', border: '1px solid #1e1e1e', borderRadius: '8px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', zIndex: 100, padding: '8px 0' }}>
                <div style={{ padding: '8px 16px', fontSize: '10px', color: '#555', letterSpacing: '0.1em', borderBottom: '1px solid #1a1a1a' }}>INTELLIGENCE ALERTS</div>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #1a1a1a' }}>
                  <div style={{ fontSize: '12px', color: '#e0e0e0', marginBottom: '4px' }}>Primary constraint verified</div>
                  <div style={{ fontSize: '11px', color: '#666' }}>New verification complete · Just now</div>
                </div>
                <div style={{ padding: '12px 16px' }}>
                  <a href="/dashboard" onClick={() => setNotifOpen(false)} style={{ fontSize: '11px', color: gold, textDecoration: 'none' }}>View all intelligence →</a>
                </div>
              </div>
            )}
          </div>

          {/* Book Session */}
          <a href="/book" style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '7px 14px',
            backgroundColor: 'transparent',
            border: '1px solid #2a2a2a',
            borderRadius: '6px',
            color: '#888',
            fontSize: '12px',
            textDecoration: 'none',
          }}>
            📅 Book Session
          </a>

          {/* User */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 10px', border: '1px solid #1e1e1e', borderRadius: '6px', cursor: 'pointer' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: 'rgba(200,162,74,0.2)', border: `1px solid rgba(200,162,74,0.4)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: gold }}>
              {userInitial}
            </div>
            <div style={{ lineHeight: 1.3 }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: '#e0e0e0' }}>{userName}</div>
              <div style={{ fontSize: '9px', color: '#555', letterSpacing: '0.05em' }}>Executive</div>
            </div>
            <span style={{ fontSize: '10px', color: '#444' }}>▾</span>
          </div>

          {/* Sign out */}
          <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/login' }} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: '12px', padding: '4px 8px' }}>
            Sign out
          </button>
        </div>

        {/* PAGE CONTENT */}
        <div style={{ flex: 1, padding: '24px', minWidth: 0 }}>
          {children}
        </div>

        {/* BOTTOM STATUS BAR */}
        <div style={{ height: '32px', backgroundColor: '#080808', borderTop: `1px solid ${sidebarBorder}`, display: 'flex', alignItems: 'center', padding: '0 24px', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#4aaa4a' }} />
            <span style={{ fontSize: '10px', color: '#4aaa4a', letterSpacing: '0.08em' }}>BEI Intelligence Operations</span>
          </div>
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#2a2a2a' }} />
          <span style={{ fontSize: '10px', color: '#444' }}>All systems operational</span>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: '10px', color: '#333' }}>Last data sync: Just now ✓</span>
        </div>
      </div>
    </div>
  )
}
