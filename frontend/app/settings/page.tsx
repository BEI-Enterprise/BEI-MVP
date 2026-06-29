'use client'
import { applyTheme } from '../components/ThemeProvider'
import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase'
import DashboardShell from '../components/DashboardShell'

const supabase = createClient()
const gold = '#C8A24A'
const card = '#0e0e0e'
const border = '#1e1e1e'

type Tab = 'general' | 'notifications' | 'security' | 'data' | 'integrations' | 'advanced'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('general')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState('')
  const [businessId, setBusinessId] = useState('')
  const [loading, setLoading] = useState(true)

  // General
  const [orgName, setOrgName] = useState('')
  const [timezone, setTimezone] = useState('(UTC+00:00) London')
  const [dateFormat, setDateFormat] = useState('DD MMM YYYY')
  const [language, setLanguage] = useState('English')

  // Display
  const [defaultDash, setDefaultDash] = useState('Overview')
  const [currentTheme, setCurrentTheme] = useState('Dark')
  const [chartRange, setChartRange] = useState('Last 90 days')
  const [itemsPerPage, setItemsPerPage] = useState('25')

  // System prefs
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [dataQualityWarnings, setDataQualityWarnings] = useState(true)
  const [compactMode, setCompactMode] = useState(false)

  // Access
  const [defaultAccess, setDefaultAccess] = useState('Viewer')
  const [dashVisibility, setDashVisibility] = useState('All users')
  const [reportVisibility, setReportVisibility] = useState('All users')
  const [dataSensitivity, setDataSensitivity] = useState('Internal')

  // Notifications
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [constraintAlerts, setConstraintAlerts] = useState(true)
  const [deploymentAlerts, setDeploymentAlerts] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(true)
  const [dataQualityNotifs, setDataQualityNotifs] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [notifEmail, setNotifEmail] = useState('')

  // Security
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [twoFactor, setTwoFactor] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState('8 hours')
  const [pwError, setPwError] = useState('')

  // Data
  const [dataRetention, setDataRetention] = useState('12 months')
  const [autoBackup, setAutoBackup] = useState(true)
  const [anonymiseData, setAnonymiseData] = useState(false)
  const [exportFormat, setExportFormat] = useState('CSV')

  // Advanced
  const [apiAccess, setApiAccess] = useState(false)
  const [betaFeatures, setBetaFeatures] = useState(false)
  const [debugMode, setDebugMode] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('bei_theme') || 'dark'
    setCurrentTheme(saved === 'light' ? 'Light' : 'Dark')
    applyTheme(saved)
    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setUserEmail(user.email || '')
          setNotifEmail(user.email || '')
          const { data } = await supabase
            .from('businesses')
            .select('id, business_name')
            .eq('email', user.email)
            .order('updated_at', { ascending: false })
            .limit(1)
            .single()
          if (data) {
            setOrgName(data.business_name || '')
            setBusinessId(data.id)
          }
        }
      } catch (e) {}
      setLoading(false)
    }
    load()
  }, [])

  const flash = (key: string) => { setSaved(key); setTimeout(() => setSaved(null), 2500) }

  const saveGeneral = async () => {
    setSaving(true)
    try {
      if (businessId) await supabase.from('businesses').update({ business_name: orgName }).eq('id', businessId)
      flash('general')
    } catch (e) {}
    setSaving(false)
  }

  const changePassword = async () => {
    setPwError('')
    if (newPassword.length < 8) { setPwError('Password must be at least 8 characters'); return }
    if (newPassword !== confirmPassword) { setPwError('Passwords do not match'); return }
    setSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) setPwError(error.message)
      else { flash('password'); setNewPassword(''); setConfirmPassword('') }
    } catch (e) { setPwError('Failed to update password') }
    setSaving(false)
  }

  const handleSignOut = async () => { await supabase.auth.signOut(); window.location.href = '/login' }

  if (loading) return (
    <main style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.3em' }}>LOADING SETTINGS...</div>
    </main>
  )

  const inp: React.CSSProperties = { width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-sidebar)', border: '1px solid #2a2a2a', borderRadius: '6px', color: 'var(--text-secondary)', fontSize: '13px', outline: 'none', boxSizing: 'border-box' as const }
  const sel: React.CSSProperties = { ...inp, cursor: 'pointer', appearance: 'none' as const, backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23666'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '32px' }
  const fieldLabel: React.CSSProperties = { fontSize: '13px', color: 'var(--text-muted)', marginBottom: '7px', display: 'block' }
  const row: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 0', borderBottom: '1px solid #0d0d0d' }

  const SaveRow = ({ k, onSave }: { k: string; onSave: () => void }) => (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', gap: '12px', alignItems: 'center' }}>
      {saved === k && <span style={{ fontSize: '12px', color: '#4aaa4a', fontWeight: '600' }}>✓ Saved</span>}
      <button onClick={onSave} disabled={saving} style={{ padding: '9px 22px', backgroundColor: 'transparent', border: '1px solid ' + gold, borderRadius: '6px', color: gold, fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Save changes</button>
    </div>
  )

  const Toggle = ({ val, set }: { val: boolean; set: (v: boolean) => void }) => (
    <div onClick={() => set(!val)} style={{ width: '44px', height: '24px', borderRadius: '12px', backgroundColor: val ? '#4aaa4a' : '#222', cursor: 'pointer', position: 'relative' as const, flexShrink: 0, border: '1px solid ' + (val ? '#4aaa4a' : '#333'), transition: 'background 0.2s' }}>
      <div style={{ position: 'absolute' as const, top: '3px', left: val ? '22px' : '3px', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#fff', transition: 'left 0.2s' }} />
    </div>
  )

  const Card = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
    <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '24px', ...style }}>{children}</div>
  )

  const CardTitle = ({ title, sub }: { title: string; sub: string }) => (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>{title}</div>
      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{sub}</div>
    </div>
  )

  const tabs: { id: Tab; label: string }[] = [
    { id: 'general', label: 'General' }, { id: 'notifications', label: 'Notifications' },
    { id: 'security', label: 'Security' }, { id: 'data', label: 'Data & Retention' },
    { id: 'integrations', label: 'Integrations' }, { id: 'advanced', label: 'Advanced' },
  ]

  return (
    <DashboardShell activeId="admin">

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid ' + border }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '900', letterSpacing: '-0.02em', margin: '0 0 6px', color: 'var(--text-primary)' }}>Settings</h1>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Configure BEI Intelligence to match your organisation's needs.</div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{userEmail}</span>
          <button onClick={handleSignOut} style={{ padding: '7px 14px', backgroundColor: 'transparent', border: '1px solid #2a2a2a', borderRadius: '6px', color: 'var(--text-muted)', fontSize: '12px', cursor: 'pointer' }}>Sign out</button>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', marginBottom: '20px', borderBottom: '1px solid ' + border }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: '10px 18px', border: 'none', backgroundColor: 'transparent', color: activeTab === t.id ? gold : '#cccccc', fontSize: '13px', fontWeight: activeTab === t.id ? '700' : '600', cursor: 'pointer', borderBottom: activeTab === t.id ? '2px solid ' + gold : '2px solid transparent', marginBottom: '-1px' }}>{t.label}</button>
        ))}
      </div>

      {/* ── GENERAL ── */}
      {activeTab === 'general' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Card>
            <CardTitle title="General Settings" sub="Manage your organisation and regional preferences." />
            {[
              { label: 'Organisation Name', type: 'input', val: orgName, set: setOrgName },
              { label: 'Time Zone', type: 'select', val: timezone, set: setTimezone, opts: ['(UTC+00:00) London','(UTC+01:00) Paris','(UTC-05:00) New York','(UTC-08:00) Los Angeles','(UTC+10:00) Sydney','(UTC+10:00) Australian Eastern (AEST)'] },
              { label: 'Date Format', type: 'select', val: dateFormat, set: setDateFormat, opts: ['DD MMM YYYY','DD/MM/YYYY','MM/DD/YYYY','YYYY-MM-DD'] },
              { label: 'Language', type: 'select', val: language, set: setLanguage, opts: ['English','French','German','Spanish'] },
            ].map((f, i) => (
              <div key={i} style={{ marginBottom: '16px' }}>
                <label style={fieldLabel}>{f.label}</label>
                {f.type === 'input'
                  ? <input value={f.val} onChange={e => f.set(e.target.value)} style={inp} />
                  : <select value={f.val} onChange={e => f.set(e.target.value)} style={sel}>{(f.opts||[]).map(o => <option key={o} value={o} style={{ backgroundColor: 'var(--bg-elevated)' }}>{o}</option>)}</select>
                }
              </div>
            ))}
            <SaveRow k="general" onSave={saveGeneral} />
          </Card>

          <Card>
            <CardTitle title="Display Preferences" sub="Customise how information is displayed across the platform." />
            {[
              { label: 'Theme', val: currentTheme, set: (v: string) => { setCurrentTheme(v); applyTheme(v.toLowerCase()); }, opts: ['Dark', 'Light'], disabled: false },
              { label: 'Default Dashboard', val: defaultDash, set: setDefaultDash, opts: ['Overview','Executive Dashboard','Performance Intelligence','Risk Intelligence','Industry Intelligence'] },
              { label: 'Chart Time Range', val: chartRange, set: setChartRange, opts: ['Last 24 hours','Last 7 days','Last 30 days','Last 90 days','Last 12 months'] },
              { label: 'Items Per Page', val: itemsPerPage, set: setItemsPerPage, opts: ['10','25','50','100'] },
            ].map((f, i) => (
              <div key={i} style={{ marginBottom: '16px' }}>
                <label style={fieldLabel}>{f.label}</label>
                <select value={f.val} onChange={e => f.set && f.set(e.target.value)} disabled={f.disabled} style={{ ...sel, opacity: f.disabled ? 0.5 : 1 }}>
                  {(f.opts||[]).map(o => <option key={o} value={o} style={{ backgroundColor: 'var(--bg-elevated)' }}>{o}</option>)}
                </select>
              </div>
            ))}
            <SaveRow k="display" onSave={() => flash('display')} />
          </Card>

          <Card>
            <CardTitle title="System Preferences" sub="Configure system behaviour and default settings." />
            {[
              { label: 'Auto-refresh dashboards', sub: 'Automatically refresh dashboard data at regular intervals', val: autoRefresh, set: setAutoRefresh },
              { label: 'Show onboarding tips', sub: 'Display helpful tips and guidance in the platform', val: showOnboarding, set: setShowOnboarding },
              { label: 'Enable data quality warnings', sub: 'Show data quality warnings across dashboards and reports', val: dataQualityWarnings, set: setDataQualityWarnings },
              { label: 'Compact mode', sub: 'Reduce padding and spacing for a more compact view', val: compactMode, set: setCompactMode },
            ].map((f, i, arr) => (
              <div key={i} style={{ ...row, ...(i === arr.length-1 ? { borderBottom: 'none' } : {}) }}>
                <div><div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>{f.label}</div><div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>{f.sub}</div></div>
                <Toggle val={f.val} set={f.set} />
              </div>
            ))}
            <SaveRow k="system" onSave={() => flash('system')} />
          </Card>

          <Card>
            <CardTitle title="Access & Visibility" sub="Control default access and visibility settings." />
            {[
              { label: 'Default access level for new users', sub: 'Set the default role for newly invited users', val: defaultAccess, set: setDefaultAccess, opts: ['Viewer','Editor','Admin'] },
              { label: 'Dashboard visibility', sub: 'Control who can view shared dashboards by default', val: dashVisibility, set: setDashVisibility, opts: ['All users','Admins only','Specific roles'] },
              { label: 'Report visibility', sub: 'Control who can view shared reports by default', val: reportVisibility, set: setReportVisibility, opts: ['All users','Admins only','Specific roles'] },
              { label: 'Data sensitivity level', sub: 'Default sensitivity classification for new data sources', val: dataSensitivity, set: setDataSensitivity, opts: ['Public','Internal','Confidential','Restricted'] },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
                <div style={{ flex: 1 }}><div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>{f.label}</div><div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>{f.sub}</div></div>
                <select value={f.val} onChange={e => f.set(e.target.value)} style={{ ...sel, width: '155px', flexShrink: 0 }}>
                  {f.opts.map(o => <option key={o} value={o} style={{ backgroundColor: 'var(--bg-elevated)' }}>{o}</option>)}
                </select>
              </div>
            ))}
            <SaveRow k="access" onSave={() => flash('access')} />
          </Card>
        </div>
      )}

      {/* ── NOTIFICATIONS ── */}
      {activeTab === 'notifications' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Card>
            <CardTitle title="Email Notifications" sub="Control which email alerts you receive from BEI." />
            <div style={{ marginBottom: '16px' }}>
              <label style={fieldLabel}>Notification email address</label>
              <input value={notifEmail} onChange={e => setNotifEmail(e.target.value)} style={inp} placeholder="your@email.com" />
            </div>
            {[
              { label: 'Email alerts', sub: 'Receive system alerts via email', val: emailAlerts, set: setEmailAlerts },
              { label: 'Constraint alerts', sub: 'Get notified when new constraints are detected', val: constraintAlerts, set: setConstraintAlerts },
              { label: 'Deployment alerts', sub: 'Notifications for deployment status changes', val: deploymentAlerts, set: setDeploymentAlerts },
              { label: 'Weekly digest', sub: 'Weekly summary of your BEI intelligence', val: weeklyDigest, set: setWeeklyDigest },
              { label: 'Data quality notifications', sub: 'Alerts when data quality drops below threshold', val: dataQualityNotifs, set: setDataQualityNotifs },
              { label: 'Marketing emails', sub: 'Product updates and feature announcements', val: marketingEmails, set: setMarketingEmails },
            ].map((f, i, arr) => (
              <div key={i} style={{ ...row, ...(i === arr.length-1 ? { borderBottom: 'none' } : {}) }}>
                <div><div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>{f.label}</div><div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>{f.sub}</div></div>
                <Toggle val={f.val} set={f.set} />
              </div>
            ))}
            <SaveRow k="notifications" onSave={() => flash('notifications')} />
          </Card>

          <Card>
            <CardTitle title="In-App Notifications" sub="Configure notifications shown within the BEI platform." />
            <div style={{ padding: '14px', backgroundColor: 'var(--bg-sidebar)', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: gold, fontWeight: '600', marginBottom: '8px' }}>Notification preview</div>
              <div style={{ display: 'flex', gap: '10px', padding: '10px', backgroundColor: 'rgba(74,170,74,0.08)', borderRadius: '6px', border: '1px solid rgba(74,170,74,0.2)', marginBottom: '6px' }}>
                <span style={{ color: '#4aaa4a' }}>✓</span>
                <div><div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>Constraint detected</div><div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>New primary constraint identified · 2 mins ago</div></div>
              </div>
              <div style={{ display: 'flex', gap: '10px', padding: '10px', backgroundColor: 'rgba(232,146,58,0.08)', borderRadius: '6px', border: '1px solid rgba(232,146,58,0.2)' }}>
                <span style={{ color: '#e8923a' }}>⚠</span>
                <div><div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>Deployment requires approval</div><div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Tier 2 deployment awaiting review · 1 hour ago</div></div>
              </div>
            </div>
            {[
              { label: 'Show constraint notifications', val: constraintAlerts, set: setConstraintAlerts },
              { label: 'Show deployment updates', val: deploymentAlerts, set: setDeploymentAlerts },
              { label: 'Show data sync status', val: dataQualityNotifs, set: setDataQualityNotifs },
              { label: 'Show weekly insights summary', val: weeklyDigest, set: setWeeklyDigest },
            ].map((f, i, arr) => (
              <div key={i} style={{ ...row, ...(i === arr.length-1 ? { borderBottom: 'none' } : {}) }}>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>{f.label}</div>
                <Toggle val={f.val} set={f.set} />
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* ── SECURITY ── */}
      {activeTab === 'security' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Card>
            <CardTitle title="Change Password" sub="Update your BEI account password." />
            {[
              { label: 'New Password', val: newPassword, set: setNewPassword },
              { label: 'Confirm New Password', val: confirmPassword, set: setConfirmPassword },
            ].map((f, i) => (
              <div key={i} style={{ marginBottom: '14px' }}>
                <label style={fieldLabel}>{f.label}</label>
                <input type="password" value={f.val} onChange={e => f.set(e.target.value)} style={inp} placeholder="••••••••" />
              </div>
            ))}
            {pwError && <div style={{ fontSize: '12px', color: '#cc4444', marginBottom: '12px', padding: '8px 10px', backgroundColor: 'rgba(204,68,68,0.08)', borderRadius: '5px', border: '1px solid rgba(204,68,68,0.2)' }}>{pwError}</div>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', alignItems: 'center' }}>
              {saved === 'password' && <span style={{ fontSize: '12px', color: '#4aaa4a', fontWeight: '600' }}>✓ Password updated</span>}
              <button onClick={changePassword} disabled={saving} style={{ padding: '9px 22px', backgroundColor: 'transparent', border: '1px solid ' + gold, borderRadius: '6px', color: gold, fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Update password</button>
            </div>
          </Card>

          <Card>
            <CardTitle title="Security Settings" sub="Manage your account security preferences." />
            <div style={{ marginBottom: '16px' }}>
              <label style={fieldLabel}>Session timeout</label>
              <select value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)} style={sel}>
                {['1 hour','4 hours','8 hours','24 hours','Never'].map(o => <option key={o} value={o} style={{ backgroundColor: 'var(--bg-elevated)' }}>{o}</option>)}
              </select>
            </div>
            <div style={{ ...row }}>
              <div><div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>Two-factor authentication</div><div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>Add an extra layer of security to your account</div></div>
              <Toggle val={twoFactor} set={setTwoFactor} />
            </div>
            <div style={{ padding: '14px', backgroundColor: 'var(--bg-sidebar)', borderRadius: '8px', border: '1px solid var(--border)', marginTop: '16px', marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>Signed in as</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>{userEmail}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={handleSignOut} style={{ padding: '8px 14px', backgroundColor: 'transparent', border: '1px solid #2a2a2a', borderRadius: '6px', color: 'var(--text-muted)', fontSize: '12px', cursor: 'pointer' }}>Sign out all devices</button>
              <SaveRow k="security" onSave={() => flash('security')} />
            </div>
          </Card>
        </div>
      )}

      {/* ── DATA & RETENTION ── */}
      {activeTab === 'data' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Card>
            <CardTitle title="Data Retention" sub="Control how long BEI retains your business data." />
            {[
              { label: 'Data retention period', val: dataRetention, set: setDataRetention, opts: ['3 months','6 months','12 months','24 months','Indefinitely'] },
              { label: 'Export format', val: exportFormat, set: setExportFormat, opts: ['CSV','JSON','Excel (.xlsx)','PDF'] },
            ].map((f, i) => (
              <div key={i} style={{ marginBottom: '16px' }}>
                <label style={fieldLabel}>{f.label}</label>
                <select value={f.val} onChange={e => f.set(e.target.value)} style={sel}>{f.opts.map(o => <option key={o} value={o} style={{ backgroundColor: 'var(--bg-elevated)' }}>{o}</option>)}</select>
              </div>
            ))}
            {[
              { label: 'Automatic backups', sub: 'Automatically back up your BEI data daily', val: autoBackup, set: setAutoBackup },
              { label: 'Anonymise exported data', sub: 'Remove personally identifiable information from exports', val: anonymiseData, set: setAnonymiseData },
            ].map((f, i) => (
              <div key={i} style={{ ...row, ...(i === 1 ? { borderBottom: 'none' } : {}) }}>
                <div><div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>{f.label}</div><div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>{f.sub}</div></div>
                <Toggle val={f.val} set={f.set} />
              </div>
            ))}
            <SaveRow k="data" onSave={() => flash('data')} />
          </Card>

          <Card>
            <CardTitle title="Export & Download" sub="Export your BEI data and reports." />
            {[
              { label: 'Export MRI Results', desc: 'Download your Business MRI analysis as a PDF report', icon: '◈', color: gold, href: '/dashboard' },
              { label: 'Export Deployment Plans', desc: 'Download all deployment packages and plans', icon: '↗', color: '#4aaa4a', href: '/deployments' },
              { label: 'Export Constraint Data', desc: 'Export constraint analysis and evidence', icon: '⊕', color: '#4a8ab0', href: '/constraints' },
              { label: 'Export All Business Data', desc: 'Full data export in your chosen format (' + exportFormat + ')', icon: '⊞', color: '#9a6ab0', href: '/dashboard' },
            ].map((e, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px', backgroundColor: 'var(--bg-sidebar)', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '10px', alignItems: 'center' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: e.color+'18', border: '1px solid '+e.color+'33', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '14px', color: e.color }}>{e.icon}</div>
                <div style={{ flex: 1 }}><div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>{e.label}</div><div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{e.desc}</div></div>
                <a href={e.href} style={{ fontSize: '11px', color: gold, fontWeight: '600', textDecoration: 'none', flexShrink: 0 }}>Download →</a>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* ── INTEGRATIONS ── */}
      {activeTab === 'integrations' && (
        <Card>
          <CardTitle title="Integrations" sub="Manage your connected data sources and third-party integrations." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '20px' }}>
            {[
              { name: 'HubSpot CRM', desc: 'Sales & marketing data', color: '#e8923a', available: true },
              { name: 'Salesforce', desc: 'CRM & pipeline data', color: '#4a8ab0', available: true },
              { name: 'Xero', desc: 'Accounting & financials', color: '#4aaa4a', available: true },
              { name: 'QuickBooks', desc: 'Accounting & invoicing', color: '#4aaa4a', available: true },
              { name: 'Google Analytics', desc: 'Website & traffic data', color: gold, available: true },
              { name: 'Slack', desc: 'Team notifications', color: '#9a6ab0', available: false },
            ].map((int, i) => (
              <div key={i} style={{ padding: '16px', backgroundColor: 'var(--bg-sidebar)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: int.color+'18', border: '1px solid '+int.color+'33', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', color: int.color, fontWeight: '700' }}>{int.name.charAt(0)}</div>
                  <div style={{ padding: '2px 7px', backgroundColor: int.available ? 'rgba(74,170,74,0.1)' : '#111', border: '1px solid '+(int.available ? 'rgba(74,170,74,0.3)' : '#2a2a2a'), borderRadius: '4px', fontSize: '10px', color: int.available ? '#4aaa4a' : '#555', fontWeight: '600' }}>{int.available ? 'Available' : 'Coming soon'}</div>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '700', marginBottom: '3px' }}>{int.name}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>{int.desc}</div>
                <a href="/connect" style={{ display: 'block', textAlign: 'center' as const, padding: '7px', backgroundColor: int.available ? int.color+'12' : 'transparent', border: '1px solid '+(int.available ? int.color+'33' : '#1a1a1a'), borderRadius: '5px', color: int.available ? int.color : '#444', fontSize: '11px', fontWeight: '600', textDecoration: 'none' }}>{int.available ? 'Connect →' : 'Notify me'}</a>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' as const }}>
            <a href="/connect" style={{ padding: '10px 24px', backgroundColor: 'rgba(200,162,74,0.08)', border: '1px solid rgba(200,162,74,0.2)', borderRadius: '6px', color: gold, textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>Manage all integrations in Business Twin™ Centre →</a>
          </div>
        </Card>
      )}

      {/* ── ADVANCED ── */}
      {activeTab === 'advanced' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Card>
            <CardTitle title="Advanced Features" sub="Enable experimental and developer features." />
            {[
              { label: 'API Access', sub: 'Enable API access for custom integrations', val: apiAccess, set: setApiAccess },
              { label: 'Beta Features', sub: 'Access new features before they are released', val: betaFeatures, set: setBetaFeatures },
              { label: 'Debug Mode', sub: 'Show detailed debug information in the platform', val: debugMode, set: setDebugMode },
            ].map((f, i) => (
              <div key={i} style={{ ...row, ...(i === 2 ? { borderBottom: 'none' } : {}) }}>
                <div><div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>{f.label}</div><div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>{f.sub}</div></div>
                <Toggle val={f.val} set={f.set} />
              </div>
            ))}
            {apiAccess && (
              <div style={{ marginTop: '16px', padding: '14px', backgroundColor: 'var(--bg-sidebar)', borderRadius: '8px', border: '1px solid rgba(200,162,74,0.2)' }}>
                <div style={{ fontSize: '11px', color: gold, fontWeight: '600', marginBottom: '6px' }}>API KEY</div>
                <div style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--text-muted)', wordBreak: 'break-all' as const, marginBottom: '8px' }}>bei_sk_live_••••••••••••••••••••••••••••••••</div>
                <button style={{ padding: '5px 12px', backgroundColor: 'transparent', border: '1px solid #2a2a2a', borderRadius: '4px', color: 'var(--text-muted)', fontSize: '11px', cursor: 'pointer' }}>Regenerate key</button>
              </div>
            )}
            <SaveRow k="advanced" onSave={() => flash('advanced')} />
          </Card>

          <Card>
            <CardTitle title="Danger Zone" sub="Irreversible actions — proceed with caution." />
            {[
              { label: 'Reset MRI Data', desc: 'Clear all MRI results and start fresh. Your account will be preserved.', btn: 'Reset MRI', color: '#e8923a' },
              { label: 'Clear All Connectors', desc: 'Disconnect and remove all data source integrations.', btn: 'Clear Connectors', color: '#e8923a' },
              { label: 'Delete Account', desc: 'Permanently delete your account and all data. Cannot be undone.', btn: 'Delete Account', color: '#cc4444', danger: true },
            ].map((a, i) => (
              <div key={i} style={{ padding: '14px', backgroundColor: 'var(--bg-sidebar)', borderRadius: '8px', border: '1px solid '+(a.danger ? 'rgba(204,68,68,0.2)' : '#1a1a1a'), marginBottom: '10px' }}>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '700', marginBottom: '4px' }}>{a.label}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px' }}>{a.desc}</div>
                <button onClick={() => a.danger && setShowDeleteConfirm(true)} style={{ padding: '7px 14px', backgroundColor: 'transparent', border: '1px solid '+a.color+'44', borderRadius: '5px', color: a.color, fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>{a.btn}</button>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteConfirm && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowDeleteConfirm(false)}>
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(204,68,68,0.4)', borderRadius: '14px', padding: '32px', width: '440px', maxWidth: '95vw' }} onClick={(e: any) => e.stopPropagation()}>
            <div style={{ fontSize: '12px', color: '#cc4444', letterSpacing: '0.2em', marginBottom: '8px', fontWeight: '600' }}>DANGER ZONE</div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>Delete Account</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '20px' }}>This will permanently delete your account and all associated data. Type <span style={{ color: '#cc4444', fontWeight: '700' }}>DELETE</span> to confirm.</div>
            <input value={deleteConfirmText} onChange={e => setDeleteConfirmText(e.target.value)} placeholder="Type DELETE to confirm" style={{ ...inp, marginBottom: '16px', borderColor: 'rgba(204,68,68,0.3)' }} />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText('') }} style={{ padding: '9px 18px', backgroundColor: 'transparent', border: '1px solid #2a2a2a', borderRadius: '6px', color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
              <button disabled={deleteConfirmText !== 'DELETE'} onClick={handleSignOut} style={{ padding: '9px 18px', backgroundColor: deleteConfirmText === 'DELETE' ? '#cc4444' : '#1a1a1a', border: 'none', borderRadius: '6px', color: deleteConfirmText === 'DELETE' ? '#fff' : '#444', fontSize: '13px', fontWeight: '700', cursor: deleteConfirmText === 'DELETE' ? 'pointer' : 'default' }}>Delete Account</button>
            </div>
          </div>
        </div>
      )}

    </DashboardShell>
  )
}
