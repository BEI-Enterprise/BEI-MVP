'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function PricingContent() {
  const searchParams = useSearchParams()
  const reason = searchParams.get('reason')
  const gold = '#C8A24A'

  const plans = [
    {
      name: 'MRI Analysis',
      price: '£199',
      originalPrice: '£332',
      saving: '£1,596',
      period: '/month',
      desc: 'Full constraint intelligence for businesses under £1M revenue.',
      opportunity: '£40k+ avg opportunity identified',
      features: [
        'Business MRI — full 6-step intake',
        'Business Health Score — 5 pillars',
        'Constraint Detection — all 10 types',
        'Constraint Verification — 5-test framework',
        'Primary Constraint identification',
        'Decision Intelligence explanation',
        'Monthly MRI refresh',
        'PDF report export',
      ],
      cta: 'Get Started',
      popular: false,
      color: '#fff',
    },
    {
      name: 'Analysis + Opportunity',
      price: '£399',
      originalPrice: '£665',
      saving: '£3,192',
      period: '/month',
      desc: 'Full intelligence with quantified opportunity mapping.',
      opportunity: '£200k+ avg opportunity identified',
      features: [
        'Everything in MRI Analysis',
        'Opportunity Engine — 5 dimensions',
        'Revenue, profit and capacity mapping',
        'Risk reduction quantification',
        'Enterprise value opportunity',
        'Prioritisation Engine',
        'Secondary constraint ranking',
        'Quarterly strategy review',
      ],
      cta: 'Most Popular',
      popular: true,
      color: gold,
    },
    {
      name: 'Full Platform',
      price: '£999',
      originalPrice: '£1,665',
      saving: '£7,992',
      period: '/month',
      desc: 'Complete intelligence, deployment and outcome tracking.',
      opportunity: '£1.2M+ avg opportunity identified',
      features: [
        'Everything in Analysis + Opportunity',
        'Deployment Engine — 3-tier system',
        'Automatic deployment execution',
        'Approval-based deployment workflow',
        'Outcome measurement tracking',
        'Learning Engine — continuous improvement',
        'AI Agent suite — 7 agents',
        'Dedicated BEI advisor',
      ],
      cta: 'Full Access',
      popular: false,
      color: '#fff',
    },
  ]

  const nav = [
    { label: 'Home', href: '/' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Example Report', href: '/example-report' },
  ]

  return (
    <main style={{backgroundColor:'#050505',color:'#fff',fontFamily:'Inter,system-ui,sans-serif',minHeight:'100vh'}}>
      <nav style={{padding:'0 48px',borderBottom:'1px solid #111',display:'flex',justifyContent:'space-between',alignItems:'center',height:'64px',backgroundColor:'rgba(5,5,5,0.95)',position:'sticky' as const,top:0,zIndex:100}}>
        <a href="/" style={{fontSize:'20px',fontWeight:'800',color:gold,letterSpacing:'0.12em',textDecoration:'none'}}>BEI</a>
        <div style={{display:'flex',gap:'32px',alignItems:'center'}}>
          {nav.map(n => <a key={n.href} href={n.href} style={{fontSize:'13px',color:'#666',textDecoration:'none'}}>{n.label}</a>)}
          <a href="/login" style={{fontSize:'13px',color:'#888',textDecoration:'none'}}>Sign in</a>
          <a href="/book" style={{padding:'8px 20px',backgroundColor:gold,color:'#050505',fontWeight:'700',borderRadius:'4px',textDecoration:'none',fontSize:'13px'}}>Free MRI →</a>
        </div>
      </nav>

      <section style={{padding:'80px 48px 60px',textAlign:'center' as const}}>
        {reason === 'subscription_required' && (
          <div style={{padding:'14px 20px',backgroundColor:'#0d0a04',border:'1px solid rgba(200,162,74,0.3)',borderRadius:'8px',marginBottom:'24px',fontSize:'14px',color:'#C8A24A',textAlign:'center' as const}}>
            ◈ A subscription is required to access this feature. Select a plan below to unlock full access.
          </div>
        )}
        <div style={{display:'inline-flex',alignItems:'center',gap:'8px',padding:'6px 16px',backgroundColor:'rgba(200,162,74,0.08)',border:'1px solid rgba(200,162,74,0.25)',borderRadius:'20px',fontSize:'12px',color:gold,fontWeight:'600',marginBottom:'24px',letterSpacing:'0.05em'}}>
          ◈ Launch Offer — 40% off for 12 months · No contract · Cancel anytime
        </div>
        <div style={{fontSize:'11px',color:gold,letterSpacing:'0.25em',textTransform:'uppercase' as const,marginBottom:'16px',fontWeight:'600'}}>Pricing</div>
        <h1 style={{fontSize:'48px',fontWeight:'700',letterSpacing:'-0.02em',marginBottom:'16px'}}>Intelligence that pays for itself.</h1>
        <p style={{fontSize:'18px',color:'#666',maxWidth:'560px',margin:'0 auto 16px',lineHeight:'1.7'}}>Every plan starts with a free Business MRI. Subscribe to unlock the full intelligence platform.</p>
        <div style={{display:'inline-flex',alignItems:'center',gap:'8px',padding:'10px 20px',border:'1px solid #1a1a1a',borderRadius:'6px',fontSize:'13px',color:'#555',marginTop:'8px'}}>
          <span style={{color:'#4aaa4a'}}>✓</span> No contract · Cancel anytime · Free MRI included · Prices locked for 12 months
        </div>
      </section>

      <section style={{padding:'0 48px 80px'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'24px'}}>
          {plans.map(plan => (
            <div key={plan.name} style={{padding:'36px',border:`1px solid ${plan.popular?gold:'#1a1a1a'}`,borderRadius:'12px',backgroundColor:plan.popular?'#0d0a04':'#080808',position:'relative' as const,display:'flex',flexDirection:'column' as const}}>
              {plan.popular && (
                <div style={{position:'absolute' as const,top:'-13px',left:'50%',transform:'translateX(-50%)',padding:'4px 18px',backgroundColor:gold,color:'#050505',fontSize:'11px',fontWeight:'700',borderRadius:'20px',letterSpacing:'0.1em'}}>MOST POPULAR</div>
              )}
              <div style={{fontSize:'13px',color:'#888',marginBottom:'6px'}}>{plan.name}</div>
              <div style={{marginBottom:'4px',display:'flex',alignItems:'center',gap:'8px'}}>
                <span style={{fontSize:'13px',color:'#444',textDecoration:'line-through'}}>{(plan as any).originalPrice}/mo</span>
                <span style={{fontSize:'11px',padding:'2px 8px',backgroundColor:'rgba(200,162,74,0.12)',color:gold,borderRadius:'3px',fontWeight:'600'}}>40% OFF</span>
              </div>
              <div style={{display:'flex',alignItems:'baseline',gap:'4px',marginBottom:'4px'}}>
                <span style={{fontSize:'44px',fontWeight:'700',color:plan.popular?gold:'#fff'}}>{plan.price}</span>
                <span style={{fontSize:'14px',color:'#555'}}>{plan.period}</span>
              </div>
              <div style={{fontSize:'12px',color:'#4aaa4a',marginBottom:'8px'}}>Save {(plan as any).saving}/year</div>
              <div style={{fontSize:'13px',color:'#666',marginBottom:'8px',lineHeight:'1.6'}}>{plan.desc}</div>
              <div style={{padding:'10px 14px',backgroundColor:'#0a0a0a',borderRadius:'6px',border:'1px solid #1a1a1a',marginBottom:'24px'}}>
                <span style={{fontSize:'12px',color:gold}}>◈ {plan.opportunity}</span>
              </div>
              <div style={{display:'flex',flexDirection:'column' as const,gap:'10px',marginBottom:'32px',flex:1}}>
                {plan.features.map(f => (
                  <div key={f} style={{display:'flex',gap:'10px',alignItems:'flex-start',fontSize:'13px',color:'#888'}}>
                    <span style={{color:'#4aaa4a',flexShrink:0,marginTop:'1px'}}>✓</span>{f}
                  </div>
                ))}
              </div>
              <a href="/book" style={{display:'block',textAlign:'center' as const,padding:'14px',backgroundColor:plan.popular?gold:'transparent',color:plan.popular?'#050505':gold,border:`1px solid ${gold}`,borderRadius:'6px',textDecoration:'none',fontWeight:'700',fontSize:'14px'}}>
                {plan.cta} →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison note */}
      <section style={{padding:'0 48px 80px'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto',padding:'32px',border:'1px solid #1a1a1a',borderRadius:'8px',backgroundColor:'#080808'}}>
          <div style={{fontSize:'16px',fontWeight:'600',marginBottom:'20px',textAlign:'center' as const}}>All plans include</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'24px'}}>
            {[
              {icon:'◈',title:'Free Business MRI',desc:'Complete 8-minute intake with full intelligence output.'},
              {icon:'◈',title:'12 Golden Rules',desc:'Every analysis enforces all 12 BEI intelligence rules.'},
              {icon:'◈',title:'Verified Intelligence',desc:'No recommendation without verification. Ever.'},
              {icon:'◈',title:'Explainable Decisions',desc:'Every constraint decision is fully explained.'},
            ].map(item => (
              <div key={item.title} style={{textAlign:'center' as const}}>
                <div style={{fontSize:'20px',color:gold,marginBottom:'8px'}}>{item.icon}</div>
                <div style={{fontSize:'14px',fontWeight:'600',marginBottom:'6px'}}>{item.title}</div>
                <div style={{fontSize:'12px',color:'#555',lineHeight:'1.7'}}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding:'60px 48px 80px',textAlign:'center' as const,borderTop:'1px solid #111'}}>
        <h2 style={{fontSize:'36px',fontWeight:'700',letterSpacing:'-0.02em',marginBottom:'16px'}}>Start with a free MRI.</h2>
        <p style={{fontSize:'16px',color:'#666',marginBottom:'32px'}}>No subscription required. See your primary constraint in under 10 minutes.</p>
        <a href="/book" style={{display:'inline-block',padding:'16px 48px',backgroundColor:gold,color:'#050505',fontWeight:'700',borderRadius:'6px',textDecoration:'none',fontSize:'16px'}}>Generate Free MRI →</a>
      </section>

      <footer style={{padding:'32px 48px',borderTop:'1px solid #111',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{fontSize:'16px',fontWeight:'800',color:gold,letterSpacing:'0.12em'}}>BEI</div>
        <div style={{fontSize:'12px',color:'#333'}}>Business Execution Intelligence · Constraint Intelligence Platform</div>
        <div style={{display:'flex',gap:'24px'}}>
          <a href="/" style={{fontSize:'12px',color:'#444',textDecoration:'none'}}>Home</a>
          <a href="/login" style={{fontSize:'12px',color:'#444',textDecoration:'none'}}>Login</a>
          <a href="/book" style={{fontSize:'12px',color:'#444',textDecoration:'none'}}>Free MRI</a>
        </div>
      </footer>
    </main>
  )
}

export default function PricingPage() {
  return <Suspense fallback={<div style={{backgroundColor:'#050505',minHeight:'100vh'}}/>}><PricingContent /></Suspense>
}
