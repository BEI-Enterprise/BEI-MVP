'use client'

import { useEffect, useState } from 'react'

export default function DeploymentsPage() {
  const [result, setResult] = useState<Record<string, any> | null>(null)
  const [loading, setLoading] = useState(true)
  const [businessName, setBusinessName] = useState('Your Business')
  const [approved, setApproved] = useState<Set<string>>(new Set())

  useEffect(() => {
    const load = async () => {
      try {
        const { createClient } = await import('@supabase/supabase-js')
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        const { data } = await supabase
          .from('businesses')
          .select('id, business_name, mri_result')
          .eq('status', 'mri_complete')
          .order('updated_at', { ascending: false })
          .limit(1)
          .single()
        if (data) {
          setBusinessName(data.business_name || 'Your Business')
          if (data.mri_result) setResult(data.mri_result)
        }
      } catch (e) {}
      setLoading(false)
    }
    load()
  }, [])

  const nav = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Health', href: '/health' },
    { label: 'Constraints', href: '/constraints' },
    { label: 'Opportunities', href: '/opportunities' },
    { label: 'Deployments', href: '/deployments', active: true },
    { label: 'Outcomes', href: '/outcomes' },
  ]

  if (loading) return <main style={{backgroundColor:'#050505',minHeight:'100vh'}}></main>

  if (!result) return (
    <main style={{backgroundColor:'#050505',color:'#fff',fontFamily:'Inter,system-ui,sans-serif',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <a href="/book" style={{padding:'14px 32px',backgroundColor:'#C8A24A',color:'#050505',fontWeight:'700',borderRadius:'4px',textDecoration:'none'}}>Start Your MRI</a>
    </main>
  )

  const primary = result.primary_constraint
  const secondary = result.secondary_constraints || []

  // Build deployment packages from result data
  const buildPackages = () => {
    if (!primary) return { tier1: [], tier2: [], tier3: [] }

    const tierMap: Record<number, any[]> = { 1: [], 2: [], 3: [] }

    const addPackages = (constraint: any, isPrimary: boolean) => {
      const key = constraint?.key || ''
      const name = constraint?.name || ''

      const catalogue: Record<string, any[]> = {
        trust_infrastructure_deficit: [
          { tier: 1, title: 'Activate Automated Review Request System', desc: 'Configure post-service review request sequence via email and SMS.', type: 'review_system' },
          { tier: 2, title: 'Build Trust and Social Proof Page', desc: 'Prepare and publish a dedicated trust page with case studies and testimonials.', type: 'trust_infrastructure' },
          { tier: 3, title: 'Content and PR Trust Strategy', desc: 'Strategic recommendation to build long-term authority through content and PR.', type: 'content_strategy' },
        ],
        lead_response_deficit: [
          { tier: 1, title: 'Configure Instant Lead Routing and Alerts', desc: 'Set up CRM lead routing with 1-hour response SLA and instant alerts.', type: 'lead_routing' },
          { tier: 2, title: 'Build Lead Nurture Sequence', desc: 'Prepare a 6-touch nurture sequence for leads that do not convert immediately.', type: 'crm_config' },
        ],
        founder_dependency: [
          { tier: 2, title: 'Build Delegation and Handover Framework', desc: 'Identify and document the top 5 tasks dependent on the founder with handover plans.', type: 'tasks' },
          { tier: 3, title: 'Organisational Structure Redesign', desc: 'Strategic recommendation to redesign organisational structure.', type: 'management' },
        ],
        capacity_constraint: [
          { tier: 2, title: 'Build Capacity Monitoring Dashboard', desc: 'Real-time capacity dashboard showing team utilisation and pipeline load.', type: 'reporting' },
          { tier: 3, title: 'Capacity Growth Plan', desc: 'Strategic recommendation to resolve capacity through hiring or automation.', type: 'staffing' },
        ],
        offer_weakness: [
          { tier: 2, title: 'Rebuild Core Offer Page and SEO Content', desc: 'Complete rewrite of core offer page with clear positioning and proof points.', type: 'seo_content' },
          { tier: 3, title: 'Offer Repositioning Strategy', desc: 'Strategic recommendation to reposition the core offer for stronger differentiation.', type: 'strategic' },
        ],
        pricing_constraint: [
          { tier: 3, title: 'Pricing Audit and Strategy', desc: 'Full pricing audit and confident pricing strategy development.', type: 'pricing' },
        ],
        revenue_concentration_risk: [
          { tier: 2, title: 'Client Concentration Risk Dashboard', desc: 'Real-time revenue concentration dashboard with alerts.', type: 'reporting' },
          { tier: 3, title: 'Client Diversification Strategy', desc: 'Strategic recommendation to reduce revenue concentration.', type: 'strategic' },
        ],
      }

      const packages = catalogue[key] || []
      packages.forEach((pkg, idx) => {
        const id = `${key}-tier${pkg.tier}-${idx}`
        tierMap[pkg.tier].push({
          id,
          constraintKey: key,
          constraintName: name,
          isPrimary,
          ...pkg,
        })
      })
    }

    addPackages(primary, true)
    secondary.slice(0, 2).forEach((c: any) => addPackages(c, false))

    return {
      tier1: tierMap[1],
      tier2: tierMap[2],
      tier3: tierMap[3],
    }
  }

  const packages = buildPackages()

  const tierConfig = {
    1: { label: 'Tier 1 — Automatic', color: '#4aaa4a', bg: '#0a2a0a', desc: 'Ready to execute immediately. No approval required.' },
    2: { label: 'Tier 2 — Approval Required', color: '#C8A24A', bg: '#2a1a00', desc: 'BEI has prepared these actions. Review and approve to proceed.' },
    3: { label: 'Tier 3 — Recommendations', color: '#6ab0d4', bg: '#0a1a2a', desc: 'Strategic recommendations requiring human execution.' },
  }

  const renderPackage = (pkg: any, tier: 1 | 2 | 3) => {
    const tc = tierConfig[tier]
    const isApproved = approved.has(pkg.id)

    return (
      <div key={pkg.id} style={{padding:'20px 24px',border:'1px solid #1a1a1a',borderRadius:'6px',backgroundColor:'#080808',marginBottom:'12px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'10px'}}>
          <div style={{flex:1}}>
            {pkg.isPrimary && <div style={{fontSize:'10px',color:'#C8A24A',letterSpacing:'0.12em',marginBottom:'4px'}}>PRIMARY CONSTRAINT</div>}
            <div style={{fontSize:'14px',fontWeight:'600',marginBottom:'4px'}}>{pkg.title}</div>
            <div style={{fontSize:'12px',color:'#555',marginBottom:'8px'}}>{pkg.constraintName} · {pkg.type?.replace(/_/g,' ')}</div>
            <div style={{fontSize:'12px',color:'#666',lineHeight:'1.6'}}>{pkg.desc}</div>
          </div>
          <div style={{marginLeft:'20px',flexShrink:0}}>
            {tier === 1 && (
              <div style={{padding:'6px 14px',borderRadius:'4px',fontSize:'12px',fontWeight:'600',color:'#4aaa4a',backgroundColor:'#0a2a0a',border:'1px solid #4aaa4a'}}>
                Ready
              </div>
            )}
            {tier === 2 && !isApproved && (
              <button
                onClick={() => setApproved(prev => new Set([...prev, pkg.id]))}
                style={{padding:'8px 16px',borderRadius:'4px',fontSize:'12px',fontWeight:'600',color:'#050505',backgroundColor:'#C8A24A',border:'none',cursor:'pointer'}}
              >
                Approve
              </button>
            )}
            {tier === 2 && isApproved && (
              <div style={{padding:'6px 14px',borderRadius:'4px',fontSize:'12px',fontWeight:'600',color:'#4aaa4a',backgroundColor:'#0a2a0a',border:'1px solid #4aaa4a'}}>
                ✓ Approved
              </div>
            )}
            {tier === 3 && (
              <div style={{padding:'6px 14px',borderRadius:'4px',fontSize:'12px',color:'#6ab0d4',backgroundColor:'#0a1a2a',border:'1px solid #6ab0d4'}}>
                Recommendation
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <main style={{backgroundColor:'#050505',color:'#fff',fontFamily:'Inter,system-ui,sans-serif',minHeight:'100vh'}}>
      <nav style={{padding:'0 48px',borderBottom:'1px solid #1a1a1a',display:'flex',justifyContent:'space-between',alignItems:'center',height:'60px'}}>
        <span style={{fontSize:'18px',fontWeight:'700',color:'#C8A24A',letterSpacing:'0.1em'}}>BEI</span>
        <div style={{display:'flex'}}>
          {nav.map(n => (
            <a key={n.href} href={n.href} style={{padding:'0 20px',height:'60px',display:'flex',alignItems:'center',fontSize:'13px',color:n.active?'#C8A24A':'#555',borderBottom:n.active?'2px solid #C8A24A':'2px solid transparent',textDecoration:'none'}}>{n.label}</a>
          ))}
        </div>
        <span style={{fontSize:'12px',color:'#333'}}>{businessName}</span>
      </nav>

      <div style={{maxWidth:'1100px',margin:'0 auto',padding:'40px 24px'}}>
        <div style={{fontSize:'24px',fontWeight:'700',marginBottom:'4px'}}>Deployment Centre</div>
        <div style={{fontSize:'14px',color:'#555',marginBottom:'40px'}}>Actions prepared from your verified constraints</div>

        {([1, 2, 3] as const).map(tier => {
          const tc = tierConfig[tier]
          const pkgs = packages[`tier${tier}` as 'tier1'|'tier2'|'tier3']
          if (!pkgs || pkgs.length === 0) return null
          return (
            <div key={tier} style={{marginBottom:'40px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'8px'}}>
                <div style={{padding:'4px 12px',borderRadius:'4px',fontSize:'12px',fontWeight:'600',color:tc.color,backgroundColor:tc.bg,border:`1px solid ${tc.color}`}}>
                  {tc.label}
                </div>
                <div style={{fontSize:'12px',color:'#555'}}>{tc.desc}</div>
              </div>
              <div style={{marginTop:'16px'}}>
                {pkgs.map((pkg: any) => renderPackage(pkg, tier))}
              </div>
            </div>
          )
        })}

        <div style={{padding:'16px 20px',border:'1px solid #111',borderRadius:'6px',backgroundColor:'#080808'}}>
          <div style={{fontSize:'11px',color:'#333',lineHeight:'1.8'}}>
            <strong style={{color:'#444'}}>Golden Rule 6:</strong> Approval Before Execution. Tier 2 actions will not execute until explicitly approved. Pricing, staffing, management and strategic decisions are never auto-deployed and will always appear as Tier 3 recommendations only.
          </div>
        </div>
      </div>
    </main>
  )
}
