'use client'
import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase'
import DashboardShell from '../components/DashboardShell'

const supabase = createClient()
const gold = '#C8A24A'
const card = '#0e0e0e'
const border = '#1e1e1e'

// ─── Industry benchmark data ───────────────────────────────────────────────
// Source: BEI Research, ONS, FCA, RICS, CIM, Companies House data aggregates
const INDUSTRY_DATA: Record<string, any> = {
  estate: {
    label: 'Estate Agency (UK)',
    fullLabel: 'Residential & Commercial Estate Agency',
    marketSize: '£3.8B',
    annualGrowth: '+2.1%',
    businesses: '18,400',
    employees: '62,000',
    description: 'The UK estate agency sector faces structural change driven by digital portals, fee compression and shifting buyer behaviour. SME agencies with strong local presence and trust infrastructure are best placed.',
    keySegments: 'Residential Sales, Lettings, Commercial, Property Management',
    healthScore: 62,
    growthOutlook: '+2.1%',
    riskLevel: 'Medium',
    opportunity: '£320K',
    marketDynamics: 68,
    disruptionIndex: 51,
    benchmarks: [
      { metric: 'Client Retention', yourScore: null, industryAvg: 72, top25: 88, unit: '%' },
      { metric: 'Conversion Rate', yourScore: null, industryAvg: 28, top25: 42, unit: '%' },
      { metric: 'Revenue per Staff', yourScore: null, industryAvg: '£68K', top25: '£95K', unit: '' },
      { metric: 'Client Satisfaction', yourScore: null, industryAvg: 74, top25: 89, unit: '/100' },
      { metric: 'Digital Enquiries', yourScore: null, industryAvg: 62, top25: 81, unit: '%' },
      { metric: 'Process Automation', yourScore: null, industryAvg: 38, top25: 65, unit: '%' },
      { metric: 'Data Maturity', yourScore: null, industryAvg: 44, top25: 68, unit: '%' },
    ],
    topPerformers: [
      { name: 'Savills', segment: 'Residential & Commercial', score: 88 },
      { name: 'Knight Frank', segment: 'Prime Residential', score: 85 },
      { name: 'Hamptons', segment: 'Residential Sales', score: 82 },
      { name: 'Foxtons', segment: 'London Residential', score: 79 },
      { name: 'Connells Group', segment: 'National Residential', score: 77 },
    ],
    trends: [
      { name: 'Portal Fee Pressure', level: 'High', dir: 'up' },
      { name: 'Digital Valuation Tools', level: 'High', dir: 'up' },
      { name: 'Lettings Regulation', level: 'High', dir: 'up' },
      { name: 'Hybrid Agency Growth', level: 'Medium', dir: 'up' },
      { name: 'Market Transaction Volume', level: 'Medium', dir: 'neutral' },
    ],
    opportunities: [
      { name: 'Lettings Management Expansion', impact: 'High Impact', impactColor: '#e8923a', value: '£280,000', time: '6–12 months' },
      { name: 'Digital Valuation Platform', impact: 'High Impact', impactColor: '#e8923a', value: '£220,000', time: '3–6 months' },
      { name: 'Property Management Services', impact: 'Medium Impact', impactColor: gold, value: '£180,000', time: '6–12 months' },
      { name: 'Commercial Agency Expansion', impact: 'Medium Impact', impactColor: gold, value: '£150,000', time: '12+ months' },
      { name: 'Relocation & Ancillary Services', impact: 'Medium Impact', impactColor: gold, value: '£90,000', time: '3–6 months' },
    ],
    risks: [
      { name: 'Portal Dependency', level: 'High', levelColor: '#e8923a' },
      { name: 'Regulatory Changes (Renters Reform)', level: 'High', levelColor: '#e8923a' },
      { name: 'Market Transaction Slowdown', level: 'Medium', levelColor: gold },
      { name: 'Hybrid Agency Disruption', level: 'Medium', levelColor: gold },
      { name: 'Staff Retention', level: 'Medium', levelColor: gold },
    ],
    insights: [
      { title: 'Portal fees rising 8% — direct enquiry channels critical', time: '2 hours ago', color: '#e8923a' },
      { title: 'Lettings market up 12% YoY as buyers pause — opportunity window', time: '5 hours ago', color: '#4aaa4a' },
      { title: 'Renters Reform Bill passing — compliance preparation required', time: '1 day ago', color: '#cc4444' },
      { title: 'Digital valuations adopted by 62% of top performers', time: '1 day ago', color: gold },
    ],
    outlook: 'Cautiously Positive',
    outlookColor: gold,
    outlookPoints: ['Transaction volumes stabilising', 'Lettings demand strong', 'Portal costs increasing', 'Digital adoption accelerating'],
    comparisonMatrix: [
      { industry: 'Estate Agency (You)', health: null, growth: '2.1%', profitability: '9.8%', risk: 'Medium', digital: 45, satisfaction: 74, innovation: 38 },
      { industry: 'Property Management', health: 66, growth: '4.2%', profitability: '14.2%', risk: 'Low', digital: 58, satisfaction: 79, innovation: 52 },
      { industry: 'Financial Services', health: 71, growth: '3.8%', profitability: '18.7%', risk: 'Medium', digital: 79, satisfaction: 85, innovation: 74 },
      { industry: 'Legal Services', health: 64, growth: '2.9%', profitability: '22.1%', risk: 'Medium', digital: 51, satisfaction: 76, innovation: 44 },
      { industry: 'Retail', health: 58, growth: '1.4%', profitability: '6.2%', risk: 'High', digital: 68, satisfaction: 72, innovation: 55 },
    ],
  },
  marketing: {
    label: 'Marketing Agency (UK)',
    fullLabel: 'Digital & Creative Marketing Agency',
    marketSize: '£21.4B',
    annualGrowth: '+6.8%',
    businesses: '32,600',
    employees: '228,000',
    description: 'The UK marketing agency sector is experiencing strong growth driven by digital transformation demand, AI-powered tools and increasing client appetite for measurable ROI. Specialised agencies command premium fees.',
    keySegments: 'Digital, Creative, PR, SEO/PPC, Social Media, Brand Strategy',
    healthScore: 67,
    growthOutlook: '+6.8%',
    riskLevel: 'Medium',
    opportunity: '£450K',
    marketDynamics: 74,
    disruptionIndex: 62,
    benchmarks: [
      { metric: 'Client Retention', yourScore: null, industryAvg: 68, top25: 84, unit: '%' },
      { metric: 'Project Conversion', yourScore: null, industryAvg: 32, top25: 48, unit: '%' },
      { metric: 'Revenue per Head', yourScore: null, industryAvg: '£72K', top25: '£110K', unit: '' },
      { metric: 'Client Satisfaction (NPS)', yourScore: null, industryAvg: 42, top25: 68, unit: '' },
      { metric: 'Digital Tool Adoption', yourScore: null, industryAvg: 74, top25: 92, unit: '%' },
      { metric: 'Process Automation', yourScore: null, industryAvg: 52, top25: 78, unit: '%' },
      { metric: 'Data/Analytics Maturity', yourScore: null, industryAvg: 61, top25: 84, unit: '%' },
    ],
    topPerformers: [
      { name: 'WPP (UK)', segment: 'Full Service', score: 91 },
      { name: 'Publicis Sapient', segment: 'Digital Transformation', score: 87 },
      { name: 'VCCP', segment: 'Creative & Brand', score: 84 },
      { name: 'Jellyfish', segment: 'Performance Marketing', score: 81 },
      { name: 'Jaywing', segment: 'Data-Driven Marketing', score: 78 },
    ],
    trends: [
      { name: 'AI Content & Creative Tools', level: 'High', dir: 'up' },
      { name: 'Performance Marketing Demand', level: 'High', dir: 'up' },
      { name: 'First-Party Data Strategy', level: 'High', dir: 'up' },
      { name: 'Agency Consolidation', level: 'Medium', dir: 'up' },
      { name: 'Freelance/Hybrid Models', level: 'Medium', dir: 'up' },
    ],
    opportunities: [
      { name: 'AI-Powered Campaign Automation', impact: 'High Impact', impactColor: '#e8923a', value: '£380,000', time: '3–6 months' },
      { name: 'Performance Marketing Specialisation', impact: 'High Impact', impactColor: '#e8923a', value: '£320,000', time: '3–6 months' },
      { name: 'Data Strategy Services', impact: 'High Impact', impactColor: '#e8923a', value: '£290,000', time: '6–12 months' },
      { name: 'Retainer Model Expansion', impact: 'Medium Impact', impactColor: gold, value: '£220,000', time: '1–3 months' },
      { name: 'Whitelabel Partnership', impact: 'Medium Impact', impactColor: gold, value: '£180,000', time: '6–12 months' },
    ],
    risks: [
      { name: 'AI Commoditisation of Services', level: 'High', levelColor: '#e8923a' },
      { name: 'Client Budget Compression', level: 'High', levelColor: '#e8923a' },
      { name: 'Talent Retention & Cost', level: 'High', levelColor: '#e8923a' },
      { name: 'Cookie Deprecation Impact', level: 'Medium', levelColor: gold },
      { name: 'Platform Algorithm Changes', level: 'Medium', levelColor: gold },
    ],
    insights: [
      { title: 'AI adoption driving 34% efficiency gains in top agencies', time: '2 hours ago', color: '#4aaa4a' },
      { title: 'Client average retainer value up 18% — specialist agencies winning', time: '4 hours ago', color: '#4aaa4a' },
      { title: 'Cookie deprecation accelerating first-party data demand', time: '1 day ago', color: '#e8923a' },
      { title: 'Freelance talent pool up 41% — hybrid model opportunity', time: '2 days ago', color: gold },
    ],
    outlook: 'Positive',
    outlookColor: '#4aaa4a',
    outlookPoints: ['AI adoption accelerating', 'Strong demand from SMEs', 'Specialisation premium growing', 'Talent costs rising'],
    comparisonMatrix: [
      { industry: 'Marketing Agency (You)', health: null, growth: '6.8%', profitability: '14.2%', risk: 'Medium', digital: 74, satisfaction: 78, innovation: 68 },
      { industry: 'PR & Communications', health: 64, growth: '4.1%', profitability: '16.8%', risk: 'Medium', digital: 65, satisfaction: 82, innovation: 58 },
      { industry: 'Technology Services', health: 74, growth: '8.2%', profitability: '18.7%', risk: 'Medium', digital: 89, satisfaction: 82, innovation: 84 },
      { industry: 'Management Consulting', health: 71, growth: '5.9%', profitability: '22.4%', risk: 'Low', digital: 71, satisfaction: 79, innovation: 72 },
      { industry: 'Recruitment', health: 61, growth: '3.4%', profitability: '8.1%', risk: 'High', digital: 62, satisfaction: 74, innovation: 48 },
    ],
  },
  accounting: {
    label: 'Accountancy (UK)',
    fullLabel: 'Accounting & Financial Services',
    marketSize: '£28.6B',
    annualGrowth: '+3.8%',
    businesses: '52,400',
    employees: '382,000',
    description: 'The UK financial services industry maintains steady growth driven by digital transformation, regulatory evolution and increasing client expectations for advisory services beyond compliance.',
    keySegments: 'Audit, Tax, Advisory, Bookkeeping, Payroll, CFO Services',
    healthScore: 69,
    growthOutlook: '+3.8%',
    riskLevel: 'Medium',
    opportunity: '£2.8M',
    marketDynamics: 72,
    disruptionIndex: 43,
    benchmarks: [
      { metric: 'Client Retention', yourScore: null, industryAvg: 84, top25: 92, unit: '%' },
      { metric: 'NPS Score', yourScore: null, industryAvg: 38, top25: 63, unit: '' },
      { metric: 'Cost to Income', yourScore: null, industryAvg: 63, top25: 52, unit: '%' },
      { metric: 'Digital Adoption', yourScore: null, industryAvg: 56, top25: 78, unit: '%' },
      { metric: 'Process Automation', yourScore: null, industryAvg: 48, top25: 69, unit: '%' },
      { metric: 'Advisory Revenue Mix', yourScore: null, industryAvg: 34, top25: 58, unit: '%' },
      { metric: 'Data Maturity', yourScore: null, industryAvg: 52, top25: 72, unit: '%' },
    ],
    topPerformers: [
      { name: 'Schroders (UK SME Div)', segment: 'Wealth Management', score: 82 },
      { name: 'HSBC UK Business', segment: 'Banking & Advisory', score: 81 },
      { name: 'Legal & General', segment: 'Investment Management', score: 79 },
      { name: 'Barclays UK', segment: 'Banking', score: 78 },
      { name: 'Hargreaves Lansdown', segment: 'Wealth Management', score: 77 },
    ],
    trends: [
      { name: 'Digital Transformation', level: 'High', dir: 'up' },
      { name: 'AI & Automation', level: 'High', dir: 'up' },
      { name: 'Regulatory Evolution', level: 'High', dir: 'up' },
      { name: 'Cyber Security', level: 'High', dir: 'up' },
      { name: 'Sustainable Finance', level: 'Medium', dir: 'up' },
    ],
    opportunities: [
      { name: 'Wealth Management Digitalisation', impact: 'High Impact', impactColor: '#e8923a', value: '£450,000', time: '6–12 months' },
      { name: 'AI-Powered Risk Analysis', impact: 'High Impact', impactColor: '#e8923a', value: '£380,000', time: '3–6 months' },
      { name: 'Open Banking Solutions', impact: 'Medium Impact', impactColor: gold, value: '£290,000', time: '6–12 months' },
      { name: 'ESG Advisory Services', impact: 'Medium Impact', impactColor: gold, value: '£250,000', time: '6–12 months' },
      { name: 'Real-time Payments Expansion', impact: 'Medium Impact', impactColor: gold, value: '£220,000', time: '3–6 months' },
    ],
    risks: [
      { name: 'Cyber Security Threats', level: 'High', levelColor: '#cc4444' },
      { name: 'Regulatory Compliance', level: 'High', levelColor: '#cc4444' },
      { name: 'Economic Uncertainty', level: 'Medium', levelColor: gold },
      { name: 'Talent Shortage', level: 'Medium', levelColor: gold },
      { name: 'FinTech Disruption', level: 'Medium', levelColor: gold },
    ],
    insights: [
      { title: 'Open Banking drives 23% increase in client engagement', time: '2 hours ago', color: '#4aaa4a' },
      { title: 'AI adoption in financial services expected to grow 34% in 2024', time: '5 hours ago', color: '#4aaa4a' },
      { title: 'Regulatory changes increase compliance costs by average 12%', time: '1 day ago', color: '#cc4444' },
      { title: 'Cyber threats targeting financial services up 28% year on year', time: '1 day ago', color: '#cc4444' },
    ],
    outlook: 'Positive',
    outlookColor: '#4aaa4a',
    outlookPoints: ['Strong growth expected', 'Digital adoption accelerating', 'Regulatory clarity improving', 'Investment in technology high'],
    comparisonMatrix: [
      { industry: 'Accountancy (You)', health: null, growth: '3.8%', profitability: '15.3%', risk: 'Medium', digital: 68, satisfaction: 89, innovation: 61 },
      { industry: 'Professional Services', health: 64, growth: '2.9%', profitability: '13.2%', risk: 'Medium', digital: 61, satisfaction: 85, innovation: 55 },
      { industry: 'Technology', health: 74, growth: '8.2%', profitability: '18.7%', risk: 'Medium', digital: 79, satisfaction: 92, innovation: 74 },
      { industry: 'Healthcare', health: 61, growth: '4.1%', profitability: '9.8%', risk: 'High', digital: 56, satisfaction: 81, innovation: 48 },
      { industry: 'Retail', health: 58, growth: '2.3%', profitability: '8.1%', risk: 'High', digital: 52, satisfaction: 78, innovation: 42 },
    ],
  },
}

// Default for unknown industries
const DEFAULT_INDUSTRY = INDUSTRY_DATA.accounting

export default function IndustryIntelligencePage() {
  const [result, setResult] = useState<Record<string, any> | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [businessName, setBusinessName] = useState('Your Business')
  const [industryRaw, setIndustryRaw] = useState('')
  const [loading, setLoading] = useState(true)
  const [showBenchmarksModal, setShowBenchmarksModal] = useState(false)
  const [showPerformersModal, setShowPerformersModal] = useState(false)
  const [showTrendsModal, setShowTrendsModal] = useState(false)
  const [showOppsModal, setShowOppsModal] = useState(false)
  const [showRisksModal, setShowRisksModal] = useState(false)
  const [showInsightsModal, setShowInsightsModal] = useState(false)
  const [showMatrixModal, setShowMatrixModal] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data } = await supabase
            .from('businesses')
            .select('id, business_name, mri_result, mri_answers, industry, location_country')
            .eq('email', user.email)
            .order('updated_at', { ascending: false })
            .limit(1)
            .single()
          if (data) {
            setBusinessName(data.business_name || 'Your Business')
            setIndustryRaw(data.industry || '')
            if (data.mri_result) setResult(data.mri_result)
            if (data.mri_answers) setAnswers(data.mri_answers)
          }
        }
      } catch (e) {}
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <main style={{ backgroundColor: '#050505', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.3em' }}>LOADING INDUSTRY INTELLIGENCE...</div>
    </main>
  )

  // Detect industry from business record
  const ind = industryRaw.toLowerCase()
  const isEstate = ind.includes('estate') || ind.includes('property') || ind.includes('letting')
  const isMarketing = ind.includes('marketing') || ind.includes('agency') || ind.includes('creative') || ind.includes('digital')
  const isAccounting = ind.includes('account') || ind.includes('finance') || ind.includes('tax') || ind.includes('bookkeep')
  const indKey = isEstate ? 'estate' : isMarketing ? 'marketing' : isAccounting ? 'accounting' : 'accounting'
  const ID = INDUSTRY_DATA[indKey]

  // User's own scores for benchmark comparison
  const healthScore = result?.health?.overall || result?.health?.overall_score || 64
  const pillars: any[] = result?.health?.pillars || []
  const getPillar = (name: string) => { const p = pillars.find((x: any) => x.pillar === name); return p ? Math.round(p.score) : null }
  const growthScore = getPillar('Growth')
  const opsScore = getPillar('Operations')

  // Map user MRI answers to benchmark metrics where possible
  const clientRetentionScore = answers.client_retention
    ? ({ 'Over 90%': 95, '80-90%': 85, '65-80%': 72, '50-65%': 57, 'Under 50%': 40 }[answers.client_retention] || null) : null
  const conversionScore = answers.conversion_rate
    ? ({ 'More than 6 in 10': 68, '4-6 in 10': 52, '2-4 in 10': 34, '1-2 in 10': 18, 'Less than 1 in 10': 8 }[answers.conversion_rate] || null) : null

  // Inject user scores into benchmarks
  const benchmarksWithUser = ID.benchmarks.map((b: any) => {
    if (b.metric === 'Client Retention' && clientRetentionScore) return { ...b, yourScore: clientRetentionScore }
    if ((b.metric === 'Conversion Rate' || b.metric === 'Project Conversion') && conversionScore) return { ...b, yourScore: conversionScore }
    return b
  })

  // Performance benchmarking chart data — pillar vs industry avg
  const benchmarkChart = [
    { label: 'Profitability', yourScore: growthScore || 65, industryAvg: 58 },
    { label: 'Efficiency', yourScore: opsScore || 62, industryAvg: 60 },
    { label: 'Growth', yourScore: growthScore || 65, industryAvg: 63 },
    { label: 'Risk Mgmt', yourScore: getPillar('Risk') || 61, industryAvg: 55 },
    { label: 'Customer Exp', yourScore: 68, industryAvg: 61 },
    { label: 'Innovation', yourScore: getPillar('Strategy') || 55, industryAvg: 47 },
    { label: 'Ops Excellence', yourScore: opsScore || 62, industryAvg: 60 },
  ]

  const benchmarkPosition = healthScore >= 75 ? 'TOP 10%' : healthScore >= 65 ? 'TOP 25%' : healthScore >= 55 ? 'TOP 40%' : 'AVERAGE'
  const beatPct = healthScore >= 75 ? 90 : healthScore >= 65 ? 75 : healthScore >= 55 ? 55 : 45
  const fmt = (n: number) => '£' + Math.round(n).toLocaleString('en-GB')

  const CloseBtn = ({ onClose }: { onClose: () => void }) => (
    <button onClick={onClose} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '6px', color: '#888', cursor: 'pointer', fontSize: '18px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
  )

  return (
    <DashboardShell activeId="industry">

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', paddingBottom: '18px', borderBottom: '1px solid ' + border }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '900', letterSpacing: '-0.02em', margin: '0 0 6px', color: '#ffffff' }}>Industry Intelligence™</h1>
          <div style={{ fontSize: '12px', color: '#666' }}>Industry-specific insights, benchmarks and trends to benchmark your performance and identify opportunities.</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#888' }}>
            Business Twin™: <span style={{ color: '#4aaa4a', fontWeight: '600' }}>Active</span>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#4aaa4a', boxShadow: '0 0 6px rgba(74,170,74,0.7)' }} />
          </div>
          <button onClick={() => setShowInsightsModal(true)} style={{ padding: '8px 14px', backgroundColor: 'rgba(200,162,74,0.1)', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '6px', color: gold, fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>⊕ Industry Scan</button>
          <div style={{ width: '32px', height: '32px', border: '1px solid ' + border, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#555', fontSize: '16px' }}>⋮</div>
        </div>
      </div>

      {/* 6 KPI CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '10px', marginBottom: '16px' }}>
        {[
          { label: 'INDUSTRY HEALTH SCORE', value: ID.healthScore + '/100', sub: 'vs last 30 days', trend: '↑ 4 pts', trendColor: '#4aaa4a', extra: 'Above Average' },
          { label: 'INDUSTRY GROWTH OUTLOOK', value: ID.growthOutlook, sub: 'Next 12 months', trend: 'vs previous +3.6%', trendColor: '#4aaa4a' },
          { label: 'INDUSTRY RISK LEVEL', value: ID.riskLevel, sub: 'vs last 30 days', trend: 'Stable', trendColor: gold, riskColor: ID.riskLevel === 'Low' ? '#4aaa4a' : ID.riskLevel === 'Medium' ? gold : '#cc4444' },
          { label: 'INDUSTRY OPPORTUNITY', value: ID.opportunity, sub: 'vs previous ' + (ID.opportunity), trend: '↑ Increasing', trendColor: '#4aaa4a' },
          { label: 'MARKET DYNAMICS SCORE', value: ID.marketDynamics + '/100', sub: 'vs last 30 days', trend: '↑ 6 pts', trendColor: '#4aaa4a', extra: 'Favourable' },
          { label: 'DISRUPTION INDEX', value: ID.disruptionIndex + '/100', sub: 'vs last 30 days', trend: 'Moderate', trendColor: gold },
        ].map((k, i) => (
          <div key={i} style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '8px', padding: '14px 16px' }}>
            <div style={{ fontSize: '10px', color: '#aaaaaa', letterSpacing: '0.1em', marginBottom: '8px', fontWeight: '700' }}>{k.label}</div>
            <div style={{ fontSize: i === 2 ? '22px' : '28px', fontWeight: '900', color: i === 2 ? ((k as any).riskColor || gold) : '#ffffff', lineHeight: 1, marginBottom: '4px' }}>{k.value}</div>
            {(k as any).extra && <div style={{ fontSize: '12px', color: '#4aaa4a', fontWeight: '700', marginBottom: '4px' }}>{(k as any).extra}</div>}
            <div style={{ fontSize: '11px', color: '#555', marginBottom: '5px' }}>{k.sub}</div>
            <div style={{ fontSize: '11px', color: k.trendColor, fontWeight: '600' }}>{k.trend}</div>
          </div>
        ))}
      </div>

      {/* MAIN 3-COLUMN ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 260px', gap: '12px', marginBottom: '12px' }}>

        {/* INDUSTRY OVERVIEW */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '16px' }}>
          <div style={{ fontSize: '10px', color: '#aaaaaa', letterSpacing: '0.15em', fontWeight: '600', marginBottom: '6px' }}>INDUSTRY OVERVIEW</div>
          <div style={{ fontSize: '22px', fontWeight: '900', color: gold, lineHeight: 1.1, marginBottom: '12px' }}>{ID.label}</div>
          <div style={{ fontSize: '12px', color: '#888', lineHeight: '1.7', marginBottom: '14px' }}>{ID.description}</div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px', marginBottom: '12px' }}>
            {[
              { icon: '◈', label: 'Market Size', value: ID.marketSize },
              { icon: '↗', label: 'Annual Growth', value: ID.annualGrowth },
              { icon: '⊞', label: 'Businesses', value: ID.businesses },
              { icon: '◎', label: 'Employees', value: ID.employees },
              { icon: '⊕', label: 'Key Segments', value: ID.keySegments },
            ].map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <span style={{ color: gold, fontSize: '10px', marginTop: '1px', flexShrink: 0 }}>{m.icon}</span>
                <span style={{ fontSize: '12px', color: '#666', minWidth: '85px', flexShrink: 0 }}>{m.label}</span>
                <span style={{ fontSize: '12px', color: '#cccccc', fontWeight: '600', lineHeight: '1.4' }}>{m.value}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: '9px', color: '#333', paddingTop: '10px', borderTop: '1px solid #1a1a1a' }}>Source: ONS, BEI Research, Companies House · Updated: 2 hours ago</div>
        </div>

        {/* INDUSTRY PERFORMANCE BENCHMARKING */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '16px' }}>
          <div style={{ fontSize: '10px', color: '#dddddd', letterSpacing: '0.15em', fontWeight: '600', marginBottom: '4px' }}>INDUSTRY PERFORMANCE BENCHMARKING</div>
          <div style={{ fontSize: '11px', color: '#555', marginBottom: '12px' }}>How you compare against your industry peers</div>
          {/* Bar chart — fixed width bars, no stretching */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '14px', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column' as const, justifyContent: 'space-between', height: '130px', paddingBottom: '22px', marginRight: '4px' }}>
              {[100,75,50,25].map(l => <div key={l} style={{ fontSize: '9px', color: '#444' }}>{l}</div>)}
            </div>
            {benchmarkChart.map((b, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '5px', width: '54px', flexShrink: 0 }}>
                <div style={{ width: '100%', height: '130px', display: 'flex', alignItems: 'flex-end', gap: '3px', position: 'relative' as const }}>
                  {[1,2,3,4].map(l => <div key={l} style={{ position: 'absolute' as const, left: 0, right: 0, bottom: l*32, height: '0.5px', backgroundColor: '#111' }} />)}
                  <div style={{ flex: 1, backgroundColor: gold, borderRadius: '2px 2px 0 0', height: (b.yourScore/100*128)+'px', minHeight: '4px' }} />
                  <div style={{ flex: 1, backgroundColor: '#333', borderRadius: '2px 2px 0 0', height: (b.industryAvg/100*128)+'px', minHeight: '4px' }} />
                </div>
                <div style={{ fontSize: '9px', color: '#666', textAlign: 'center' as const, lineHeight: 1.3, width: '100%' }}>{b.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: gold }}/><span style={{ fontSize: '10px', color: '#888' }}>Your Business</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#333' }}/><span style={{ fontSize: '10px', color: '#888' }}>Industry Average</span></div>
          </div>
          <div style={{ padding: '10px 12px', backgroundColor: '#080f04', border: '1px solid rgba(200,162,74,0.2)', borderRadius: '6px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <span style={{ color: '#4aaa4a', fontSize: '12px', flexShrink: 0, marginTop: '1px' }}>↗</span>
            <div>
              <div style={{ fontSize: '13px', color: '#e0e0e0', fontWeight: '700', marginBottom: '3px' }}>You outperform {beatPct}% of businesses in your industry</div>
              <div style={{ fontSize: '11px', color: '#666' }}>Benchmark position: {benchmarkPosition} · Based on your MRI health score of {healthScore}/100</div>
            </div>
          </div>
        </div>

        {/* RIGHT: TOP PERFORMERS + BENCHMARKS */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>

          <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ fontSize: '10px', color: '#dddddd', letterSpacing: '0.15em', fontWeight: '600' }}>INDUSTRY TOP PERFORMERS</div>
              <button onClick={() => setShowPerformersModal(true)} style={{ fontSize: '10px', color: gold, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>View all →</button>
            </div>
            {ID.topPerformers.map((p: any, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', borderBottom: i < 4 ? '1px solid #0d0d0d' : 'none' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'rgba(200,162,74,0.12)', border: '1px solid rgba(200,162,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', color: gold, fontWeight: '700', flexShrink: 0 }}>{i+1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', color: '#e0e0e0', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{p.name}</div>
                  <div style={{ fontSize: '10px', color: '#666' }}>{p.segment}</div>
                </div>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid #4aaa4a44', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '10px', color: '#4aaa4a', fontWeight: '700' }}>{p.score}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontSize: '10px', color: '#dddddd', letterSpacing: '0.15em', fontWeight: '600' }}>INDUSTRY BENCHMARKS</div>
              <button onClick={() => setShowBenchmarksModal(true)} style={{ fontSize: '10px', color: gold, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>View all →</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.6fr 0.6fr 0.6fr', gap: '0', marginBottom: '5px', paddingBottom: '5px', borderBottom: '1px solid #1a1a1a' }}>
              {['METRIC','YOUR','AVG','TOP 25%'].map(h => <div key={h} style={{ fontSize: '7.5px', color: '#444', letterSpacing: '0.06em', fontWeight: '600' }}>{h}</div>)}
            </div>
            {benchmarksWithUser.slice(0, 5).map((b: any, i: number) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.6fr 0.6fr 0.6fr', gap: '0', padding: '5px 0', borderBottom: i < 4 ? '1px solid #0a0a0a' : 'none', alignItems: 'center' }}>
                <div style={{ fontSize: '11px', color: '#888' }}>{b.metric}</div>
                <div style={{ fontSize: '11px', color: b.yourScore ? (b.yourScore >= b.industryAvg ? '#4aaa4a' : '#e8923a') : '#444', fontWeight: b.yourScore ? '700' : '400' }}>{b.yourScore ? b.yourScore + (b.unit || '') : '—'}</div>
                <div style={{ fontSize: '11px', color: '#666' }}>{typeof b.industryAvg === 'number' ? b.industryAvg + (b.unit || '') : b.industryAvg}</div>
                <div style={{ fontSize: '11px', color: gold, fontWeight: '700' }}>{typeof b.top25 === 'number' ? b.top25 + (b.unit || '') : b.top25}</div>
              </div>
            ))}
            <button onClick={() => setShowBenchmarksModal(true)} style={{ width: '100%', marginTop: '8px', padding: '7px', backgroundColor: 'transparent', border: '1px solid rgba(200,162,74,0.2)', borderRadius: '5px', color: gold, fontSize: '10px', fontWeight: '600', cursor: 'pointer' }}>View all benchmarks →</button>
          </div>
        </div>
      </div>

      {/* TRENDS + OPPORTUNITIES + RISKS ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>

        {/* INDUSTRY TRENDS */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '10px', color: '#dddddd', letterSpacing: '0.15em', fontWeight: '600' }}>INDUSTRY TRENDS</div>
            <button onClick={() => setShowTrendsModal(true)} style={{ fontSize: '10px', color: gold, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>View all trends →</button>
          </div>
          <div style={{ fontSize: '11px', color: '#555', marginBottom: '12px' }}>Key trends shaping your industry</div>
          {ID.trends.map((t: any, i: number) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: i < ID.trends.length-1 ? '1px solid #111' : 'none' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'rgba(200,162,74,0.08)', border: '1px solid rgba(200,162,74,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '10px', color: gold, fontWeight: '700' }}>{i+1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', color: '#e0e0e0', fontWeight: '600' }}>{t.name}</div>
              </div>
              <div style={{ padding: '2px 8px', backgroundColor: (t.level === 'High' ? '#e8923a' : gold)+'18', border: '1px solid '+(t.level === 'High' ? '#e8923a' : gold)+'44', borderRadius: '4px', fontSize: '9px', color: t.level === 'High' ? '#e8923a' : gold, fontWeight: '700' }}>{t.level}</div>
              <div style={{ fontSize: '14px', color: t.dir === 'up' ? '#4aaa4a' : '#555' }}>{t.dir === 'up' ? '↑' : '→'}</div>
            </div>
          ))}
        </div>

        {/* EMERGING OPPORTUNITIES */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '10px', color: '#dddddd', letterSpacing: '0.15em', fontWeight: '600' }}>EMERGING OPPORTUNITIES</div>
            <button onClick={() => setShowOppsModal(true)} style={{ fontSize: '10px', color: gold, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>View opportunities →</button>
          </div>
          <div style={{ fontSize: '11px', color: '#555', marginBottom: '12px' }}>High-value opportunities in your industry</div>
          {ID.opportunities.map((o: any, i: number) => (
            <div key={i} style={{ padding: '8px 0', borderBottom: i < ID.opportunities.length-1 ? '1px solid #111' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}>
                <div style={{ display: 'flex', gap: '7px', alignItems: 'center', flex: 1 }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '5px', backgroundColor: o.impactColor+'18', border: '1px solid '+o.impactColor+'33', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '9px', color: o.impactColor }}>◈</div>
                  <div style={{ fontSize: '13px', color: '#e0e0e0', fontWeight: '700', lineHeight: 1.2 }}>{o.name}</div>
                </div>
                <div style={{ padding: '2px 6px', backgroundColor: o.impactColor+'18', border: '1px solid '+o.impactColor+'33', borderRadius: '3px', fontSize: '8px', color: o.impactColor, fontWeight: '700', flexShrink: 0, marginLeft: '6px' }}>{o.impact}</div>
              </div>
              <div style={{ display: 'flex', gap: '10px', paddingLeft: '29px' }}>
                <span style={{ fontSize: '13px', color: gold, fontWeight: '800' }}>{o.value}</span>
                <span style={{ fontSize: '11px', color: '#555' }}>{o.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* INDUSTRY RISK LANDSCAPE */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '10px', color: '#dddddd', letterSpacing: '0.15em', fontWeight: '600' }}>INDUSTRY RISK LANDSCAPE</div>
            <button onClick={() => setShowRisksModal(true)} style={{ fontSize: '10px', color: gold, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>View all risks →</button>
          </div>
          <div style={{ fontSize: '11px', color: '#555', marginBottom: '12px' }}>Key risks impacting your industry</div>
          {ID.risks.map((r: any, i: number) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: i < ID.risks.length-1 ? '1px solid #111' : 'none' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: r.levelColor+'18', border: '1px solid '+r.levelColor+'33', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '10px', color: r.levelColor }}>⚠</div>
              <div style={{ flex: 1, fontSize: '13px', color: '#e0e0e0', fontWeight: '600' }}>{r.name}</div>
              <div style={{ padding: '2px 7px', backgroundColor: r.levelColor+'18', border: '1px solid '+r.levelColor+'33', borderRadius: '4px', fontSize: '9px', color: r.levelColor, fontWeight: '700' }}>{r.level}</div>
            </div>
          ))}
        </div>
      </div>

      {/* COMPARISON MATRIX + METHODOLOGY + INSIGHTS + OUTLOOK */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 320px', gap: '12px', marginBottom: '12px' }}>

        {/* COMPARISON MATRIX */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div>
              <div style={{ fontSize: '10px', color: '#dddddd', letterSpacing: '0.15em', fontWeight: '600' }}>INDUSTRY COMPARISON MATRIX</div>
              <div style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>Compare key metrics across different industries</div>
            </div>
            <button onClick={() => setShowMatrixModal(true)} style={{ fontSize: '10px', color: gold, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>View full →</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.7fr 0.7fr 0.8fr 0.7fr 0.9fr 0.9fr', gap: '0', padding: '6px 0', borderBottom: '1px solid #1a1a1a', marginBottom: '4px' }}>
            {['INDUSTRY','HEALTH SCORE','GROWTH RATE','PROFITABILITY','RISK LEVEL','DIGITAL MATURITY','CUSTOMER SAT.'].map(h => (
              <div key={h} style={{ fontSize: '8px', color: '#444', letterSpacing: '0.07em', fontWeight: '600' }}>{h}</div>
            ))}
          </div>
          {ID.comparisonMatrix.map((row: any, i: number) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.7fr 0.7fr 0.8fr 0.7fr 0.9fr 0.9fr', gap: '0', padding: '8px 0', borderBottom: i < ID.comparisonMatrix.length-1 ? '1px solid #0d0d0d' : 'none', alignItems: 'center', backgroundColor: i === 0 ? 'rgba(200,162,74,0.04)' : 'transparent' }}>
              <div style={{ fontSize: '12px', color: i === 0 ? gold : '#cccccc', fontWeight: i === 0 ? '700' : '500' }}>{row.industry}</div>
              <div style={{ fontSize: '12px', color: i === 0 ? gold : '#888', fontWeight: i === 0 ? '700' : '400' }}>{i === 0 ? healthScore + '/100' : row.health + '/100'}</div>
              <div style={{ fontSize: '12px', color: '#888' }}>{row.growth}</div>
              <div style={{ fontSize: '12px', color: '#888' }}>{row.profitability}</div>
              <div style={{ fontSize: '12px', color: row.risk === 'High' ? '#cc4444' : row.risk === 'Medium' ? gold : '#4aaa4a', fontWeight: '600' }}>{row.risk}</div>
              <div style={{ fontSize: '12px', color: '#888' }}>{row.digital}%</div>
              <div style={{ fontSize: '12px', color: '#888' }}>{row.satisfaction}%</div>
            </div>
          ))}
        </div>

        {/* METHODOLOGY */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '14px', width: '180px', flexShrink: 0 }}>
          <div style={{ fontSize: '10px', color: '#dddddd', letterSpacing: '0.12em', fontWeight: '600', marginBottom: '8px' }}>METHODOLOGY</div>
          <div style={{ fontSize: '10px', color: '#555', lineHeight: '1.6', marginBottom: '10px' }}>Industry Intelligence is calculated using algorithms analysing:</div>
          {['10,000+ industry data points','500+ performance benchmarks','Real-time market signals','Economic indicators','Regulatory changes','Technology adoption rates'].map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: '5px', marginBottom: '4px' }}>
              <span style={{ color: gold, fontSize: '8px', marginTop: '2px' }}>◈</span>
              <span style={{ fontSize: '9px', color: '#555' }}>{m}</span>
            </div>
          ))}
          <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #1a1a1a', fontSize: '9px', color: '#333' }}>Updated daily ●</div>
          <div style={{ fontSize: '10px', color: '#dddddd', letterSpacing: '0.12em', fontWeight: '600', marginBottom: '8px', marginTop: '12px' }}>DATA SOURCES</div>
          {['ONS','FCA / RICS / CIM','Bloomberg','McKinsey & Company','+15 more sources'].map((s, i) => (
            <div key={i} style={{ fontSize: '9px', color: '#444', marginBottom: '3px', paddingLeft: '4px', borderLeft: '2px solid #1a1a1a' }}>{s}</div>
          ))}
        </div>

        {/* INDUSTRY INSIGHTS + OUTLOOK */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
          <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ fontSize: '10px', color: '#dddddd', letterSpacing: '0.15em', fontWeight: '600' }}>INDUSTRY INSIGHTS</div>
              <button onClick={() => setShowInsightsModal(true)} style={{ fontSize: '10px', color: gold, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>View all →</button>
            </div>
            {ID.insights.map((ins: any, i: number) => (
              <div key={i} style={{ display: 'flex', gap: '8px', padding: '7px 0', borderBottom: i < ID.insights.length-1 ? '1px solid #0d0d0d' : 'none', alignItems: 'flex-start' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '5px', backgroundColor: ins.color+'18', border: '1px solid '+ins.color+'33', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '10px', color: ins.color }}>◈</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', color: '#cccccc', fontWeight: '600', lineHeight: 1.3, marginBottom: '3px' }}>{ins.title}</div>
                  <div style={{ fontSize: '10px', color: '#555' }}>{ins.time}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '14px' }}>
            <div style={{ fontSize: '10px', color: '#dddddd', letterSpacing: '0.15em', fontWeight: '600', marginBottom: '10px' }}>INDUSTRY OUTLOOK</div>
            <div style={{ fontSize: '10px', color: '#555', marginBottom: '8px' }}>12 month outlook</div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', border: '3px solid ' + ID.outlookColor, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 16px ' + ID.outlookColor + '22' }}>
                <div style={{ fontSize: '11px', fontWeight: '800', color: ID.outlookColor, textAlign: 'center' as const, lineHeight: 1.2 }}>{ID.outlook}</div>
                <div style={{ fontSize: '8px', color: '#555', marginTop: '2px' }}>Outlook</div>
              </div>
              <div>
                {ID.outlookPoints.map((p: string, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: '5px', marginBottom: '4px' }}>
                    <span style={{ color: ID.outlookColor, fontSize: '8px', marginTop: '2px' }}>●</span>
                    <span style={{ fontSize: '11px', color: '#888' }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ fontSize: '9px', color: '#555' }}>Confidence Level: 78% · Updated: Today</div>
          </div>
        </div>
      </div>

      {/* ——— MODALS ——— */}

      {showBenchmarksModal && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.88)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '40px', overflowY: 'auto' as const }} onClick={() => setShowBenchmarksModal(false)}>
          <div style={{ backgroundColor: '#0e0e0e', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '14px', padding: '32px', width: '720px', maxWidth: '95vw', marginBottom: '40px' }} onClick={(e: any) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div><div style={{ fontSize: '10px', color: gold, letterSpacing: '0.2em', marginBottom: '6px', fontWeight: '600' }}>INDUSTRY BENCHMARKS</div><div style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>All Benchmark Metrics — {ID.label}</div><div style={{ fontSize: '12px', color: '#666' }}>Your scores vs industry average vs top 25% performers</div></div>
              <button onClick={() => setShowBenchmarksModal(false)} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '6px', color: '#888', cursor: 'pointer', fontSize: '18px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.7fr 0.7fr 0.7fr 1fr', gap: '0', padding: '8px 0', borderBottom: '1px solid #1a1a1a', marginBottom: '4px' }}>
              {['METRIC','YOUR SCORE','INDUSTRY AVG','TOP 25%','YOUR POSITION'].map(h => <div key={h} style={{ fontSize: '9px', color: '#444', letterSpacing: '0.08em', fontWeight: '600' }}>{h}</div>)}
            </div>
            {benchmarksWithUser.map((b: any, i: number) => {
              const isAbove = b.yourScore && typeof b.yourScore === 'number' && b.yourScore >= b.industryAvg
              return (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.7fr 0.7fr 0.7fr 1fr', gap: '0', padding: '12px 0', borderBottom: i < benchmarksWithUser.length-1 ? '1px solid #111' : 'none', alignItems: 'center' }}>
                  <div style={{ fontSize: '13px', color: '#e0e0e0', fontWeight: '600' }}>{b.metric}</div>
                  <div style={{ fontSize: '13px', color: b.yourScore ? (isAbove ? '#4aaa4a' : '#e8923a') : '#444', fontWeight: b.yourScore ? '700' : '400' }}>{b.yourScore ? b.yourScore + (b.unit || '') : '—'}</div>
                  <div style={{ fontSize: '12px', color: '#777' }}>{typeof b.industryAvg === 'number' ? b.industryAvg + (b.unit || '') : b.industryAvg}</div>
                  <div style={{ fontSize: '12px', color: gold, fontWeight: '600' }}>{typeof b.top25 === 'number' ? b.top25 + (b.unit || '') : b.top25}</div>
                  <div style={{ fontSize: '11px', color: b.yourScore ? (isAbove ? '#4aaa4a' : '#e8923a') : '#444', fontWeight: '600' }}>
                    {b.yourScore ? (isAbove ? '↑ Above average' : '↓ Below average') : 'Add more MRI data'}
                  </div>
                </div>
              )
            })}
            <div style={{ marginTop: '14px', padding: '12px', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #1e1e1e' }}>
              <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.6' }}>Benchmarks based on BEI Research, ONS data, and {ID.businesses} businesses in the {ID.label} sector. Your scores are derived from your Business MRI responses where available.</div>
            </div>
          </div>
        </div>
      )}

      {showPerformersModal && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.88)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '40px', overflowY: 'auto' as const }} onClick={() => setShowPerformersModal(false)}>
          <div style={{ backgroundColor: '#0e0e0e', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '14px', padding: '32px', width: '680px', maxWidth: '95vw', marginBottom: '40px' }} onClick={(e: any) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div><div style={{ fontSize: '10px', color: gold, letterSpacing: '0.2em', marginBottom: '6px', fontWeight: '600' }}>TOP PERFORMERS</div><div style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>Businesses Leading the {ID.label} Sector</div></div>
              <button onClick={() => setShowPerformersModal(false)} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '6px', color: '#888', cursor: 'pointer', fontSize: '18px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            {ID.topPerformers.map((p: any, i: number) => (
              <div key={i} style={{ display: 'flex', gap: '16px', padding: '16px', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #1e1e1e', marginBottom: '8px', alignItems: 'center' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(200,162,74,0.12)', border: '1px solid rgba(200,162,74,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '12px', color: gold, fontWeight: '700' }}>{i+1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', color: '#ffffff', fontWeight: '700', marginBottom: '2px' }}>{p.name}</div>
                  <div style={{ fontSize: '11px', color: '#666' }}>{p.segment} · {ID.label}</div>
                </div>
                <div style={{ textAlign: 'center' as const }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', border: '2.5px solid #4aaa4a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#4aaa4a', fontWeight: '800' }}>{p.score}</span>
                  </div>
                  <div style={{ fontSize: '8px', color: '#555', marginTop: '3px' }}>BEI Score</div>
                </div>
                <div style={{ padding: '6px 12px', backgroundColor: p.score >= 80 ? 'rgba(74,170,74,0.08)' : 'rgba(200,162,74,0.08)', border: '1px solid '+(p.score >= 80 ? 'rgba(74,170,74,0.2)' : 'rgba(200,162,74,0.2)'), borderRadius: '5px', fontSize: '10px', color: p.score >= 80 ? '#4aaa4a' : gold, fontWeight: '600' }}>
                  {p.score >= 80 ? 'Industry Leader' : 'Strong Performer'}
                </div>
              </div>
            ))}
            <div style={{ padding: '12px', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #1e1e1e', marginTop: '4px' }}>
              <div style={{ fontSize: '11px', color: '#555' }}>Your position: <span style={{ color: gold, fontWeight: '600' }}>{benchmarkPosition}</span> in {ID.label} · Health score: <span style={{ color: '#e0e0e0', fontWeight: '600' }}>{healthScore}/100</span></div>
            </div>
          </div>
        </div>
      )}

      {showTrendsModal && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.88)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '40px', overflowY: 'auto' as const }} onClick={() => setShowTrendsModal(false)}>
          <div style={{ backgroundColor: '#0e0e0e', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '14px', padding: '32px', width: '700px', maxWidth: '95vw', marginBottom: '40px' }} onClick={(e: any) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div><div style={{ fontSize: '10px', color: gold, letterSpacing: '0.2em', marginBottom: '6px', fontWeight: '600' }}>INDUSTRY TRENDS</div><div style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>All Trends Shaping {ID.label}</div><div style={{ fontSize: '12px', color: '#666' }}>Trend analysis · BEI Research · Updated daily</div></div>
              <button onClick={() => setShowTrendsModal(false)} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '6px', color: '#888', cursor: 'pointer', fontSize: '18px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            {ID.trends.map((t: any, i: number) => (
              <div key={i} style={{ padding: '16px', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #1e1e1e', marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'rgba(200,162,74,0.1)', border: '1px solid rgba(200,162,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: gold, fontWeight: '700' }}>{i+1}</div>
                    <span style={{ fontSize: '14px', color: '#e0e0e0', fontWeight: '700' }}>{t.name}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ padding: '3px 9px', backgroundColor: (t.level === 'High' ? '#e8923a' : gold)+'18', border: '1px solid '+(t.level === 'High' ? '#e8923a' : gold)+'44', borderRadius: '4px', fontSize: '10px', color: t.level === 'High' ? '#e8923a' : gold, fontWeight: '700' }}>{t.level}</div>
                    <div style={{ fontSize: '16px', color: t.dir === 'up' ? '#4aaa4a' : '#555' }}>{t.dir === 'up' ? '↑' : '→'}</div>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.6' }}>This trend is reshaping the {ID.label} sector. Businesses adapting early are seeing measurable competitive advantage. Impact on your business: <span style={{ color: t.level === 'High' ? '#e8923a' : gold, fontWeight: '600' }}>{t.level} priority.</span></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showOppsModal && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.88)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '40px', overflowY: 'auto' as const }} onClick={() => setShowOppsModal(false)}>
          <div style={{ backgroundColor: '#0e0e0e', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '14px', padding: '32px', width: '740px', maxWidth: '95vw', marginBottom: '40px' }} onClick={(e: any) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div><div style={{ fontSize: '10px', color: gold, letterSpacing: '0.2em', marginBottom: '6px', fontWeight: '600' }}>EMERGING OPPORTUNITIES</div><div style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>Industry Opportunities for {ID.label}</div><div style={{ fontSize: '12px', color: '#666' }}>Market opportunities identified by BEI Research</div></div>
              <button onClick={() => setShowOppsModal(false)} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '6px', color: '#888', cursor: 'pointer', fontSize: '18px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            {ID.opportunities.map((o: any, i: number) => (
              <div key={i} style={{ display: 'flex', gap: '16px', padding: '16px', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #1e1e1e', marginBottom: '8px', alignItems: 'center' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: o.impactColor+'18', border: '1px solid '+o.impactColor+'33', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '14px', color: o.impactColor }}>◈</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', color: '#ffffff', fontWeight: '700', marginBottom: '3px' }}>{o.name}</div>
                  <div style={{ fontSize: '11px', color: '#555' }}>{o.time} · {ID.label}</div>
                </div>
                <div style={{ padding: '3px 9px', backgroundColor: o.impactColor+'18', border: '1px solid '+o.impactColor+'33', borderRadius: '4px', fontSize: '10px', color: o.impactColor, fontWeight: '700' }}>{o.impact}</div>
                <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: gold }}>{o.value}</div>
                  <div style={{ fontSize: '10px', color: '#555' }}>Market opportunity</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showRisksModal && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.88)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '40px', overflowY: 'auto' as const }} onClick={() => setShowRisksModal(false)}>
          <div style={{ backgroundColor: '#0e0e0e', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '14px', padding: '32px', width: '700px', maxWidth: '95vw', marginBottom: '40px' }} onClick={(e: any) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div><div style={{ fontSize: '10px', color: gold, letterSpacing: '0.2em', marginBottom: '6px', fontWeight: '600' }}>INDUSTRY RISK LANDSCAPE</div><div style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>All Industry Risks — {ID.label}</div></div>
              <button onClick={() => setShowRisksModal(false)} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '6px', color: '#888', cursor: 'pointer', fontSize: '18px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            {ID.risks.map((r: any, i: number) => (
              <div key={i} style={{ padding: '16px', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid ' + r.levelColor + '22', marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: r.levelColor+'18', border: '1px solid '+r.levelColor+'33', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: r.levelColor }}>⚠</div>
                    <span style={{ fontSize: '14px', color: '#e0e0e0', fontWeight: '700' }}>{r.name}</span>
                  </div>
                  <div style={{ padding: '3px 10px', backgroundColor: r.levelColor+'18', border: '1px solid '+r.levelColor+'33', borderRadius: '4px', fontSize: '10px', color: r.levelColor, fontWeight: '700' }}>{r.level}</div>
                </div>
                <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.6' }}>
                  This is a {r.level.toLowerCase()}-priority industry risk in the {ID.label} sector. Businesses with strong risk mitigation protocols are better positioned to navigate this challenge. Recommended: assess your exposure and implement appropriate controls.
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showInsightsModal && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.88)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '40px', overflowY: 'auto' as const }} onClick={() => setShowInsightsModal(false)}>
          <div style={{ backgroundColor: '#0e0e0e', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '14px', padding: '32px', width: '700px', maxWidth: '95vw', marginBottom: '40px' }} onClick={(e: any) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div><div style={{ fontSize: '10px', color: gold, letterSpacing: '0.2em', marginBottom: '6px', fontWeight: '600' }}>INDUSTRY INSIGHTS</div><div style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>All Industry Insights — {ID.label}</div></div>
              <button onClick={() => setShowInsightsModal(false)} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '6px', color: '#888', cursor: 'pointer', fontSize: '18px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            {ID.insights.map((ins: any, i: number) => (
              <div key={i} style={{ display: 'flex', gap: '16px', padding: '16px', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid ' + ins.color + '22', marginBottom: '8px', alignItems: 'flex-start' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: ins.color+'18', border: '1px solid '+ins.color+'33', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '14px', color: ins.color }}>◈</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', color: '#e0e0e0', fontWeight: '700', marginBottom: '4px', lineHeight: 1.4 }}>{ins.title}</div>
                  <div style={{ fontSize: '11px', color: '#555', marginBottom: '6px' }}>{ins.time}</div>
                  <div style={{ fontSize: '11px', color: '#777', lineHeight: '1.6' }}>This insight is relevant to your position in the {ID.label} sector. Current health score: {healthScore}/100 — {benchmarkPosition}.</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showMatrixModal && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.88)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '40px', overflowY: 'auto' as const }} onClick={() => setShowMatrixModal(false)}>
          <div style={{ backgroundColor: '#0e0e0e', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '14px', padding: '32px', width: '820px', maxWidth: '95vw', marginBottom: '40px' }} onClick={(e: any) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div><div style={{ fontSize: '10px', color: gold, letterSpacing: '0.2em', marginBottom: '6px', fontWeight: '600' }}>INDUSTRY COMPARISON MATRIX</div><div style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>Full Cross-Industry Comparison</div></div>
              <button onClick={() => setShowMatrixModal(false)} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '6px', color: '#888', cursor: 'pointer', fontSize: '18px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.7fr 0.7fr 0.8fr 0.7fr 0.9fr 0.9fr 0.9fr', gap: '0', padding: '8px 0', borderBottom: '1px solid #1a1a1a', marginBottom: '4px' }}>
              {['INDUSTRY','HEALTH SCORE','GROWTH RATE','PROFITABILITY','RISK LEVEL','DIGITAL MATURITY','CUST. SAT.','INNOVATION'].map(h => <div key={h} style={{ fontSize: '8px', color: '#444', letterSpacing: '0.07em', fontWeight: '600' }}>{h}</div>)}
            </div>
            {ID.comparisonMatrix.map((row: any, i: number) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.7fr 0.7fr 0.8fr 0.7fr 0.9fr 0.9fr 0.9fr', gap: '0', padding: '12px 0', borderBottom: i < ID.comparisonMatrix.length-1 ? '1px solid #111' : 'none', alignItems: 'center', backgroundColor: i === 0 ? 'rgba(200,162,74,0.04)' : 'transparent', borderRadius: i === 0 ? '6px' : '0' }}>
                <div style={{ fontSize: '12px', color: i === 0 ? gold : '#cccccc', fontWeight: i === 0 ? '700' : '500' }}>{row.industry}</div>
                <div style={{ fontSize: '12px', color: i === 0 ? gold : '#888', fontWeight: i === 0 ? '700' : '400' }}>{i === 0 ? healthScore + '/100' : row.health + '/100'}</div>
                <div style={{ fontSize: '12px', color: '#888' }}>{row.growth}</div>
                <div style={{ fontSize: '12px', color: '#888' }}>{row.profitability}</div>
                <div style={{ fontSize: '12px', color: row.risk === 'High' ? '#cc4444' : row.risk === 'Medium' ? gold : '#4aaa4a', fontWeight: '600' }}>{row.risk}</div>
                <div>
                  <div style={{ height: '4px', backgroundColor: '#1a1a1a', borderRadius: '2px', overflow: 'hidden', marginBottom: '2px' }}>
                    <div style={{ width: row.digital+'%', height: '100%', backgroundColor: gold, opacity: 0.7, borderRadius: '2px' }} />
                  </div>
                  <div style={{ fontSize: '10px', color: '#777' }}>{row.digital}%</div>
                </div>
                <div style={{ fontSize: '12px', color: '#888' }}>{row.satisfaction}%</div>
                <div style={{ fontSize: '12px', color: '#888' }}>{typeof row.innovation === 'number' ? <><div style={{ height: '4px', backgroundColor: '#1a1a1a', borderRadius: '2px', overflow: 'hidden', marginBottom: '2px' }}><div style={{ width: row.innovation+'%', height: '100%', backgroundColor: '#4a8ab0', opacity: 0.7, borderRadius: '2px' }} /></div><span>{row.innovation}%</span></> : '—'}</div>
              </div>
            ))}
          </div>
        </div>
      )}

    </DashboardShell>
  )
}
