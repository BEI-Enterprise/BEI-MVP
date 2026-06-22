'use client'
import { useCurrency, formatPrice, getCurrencySymbol } from '../../lib/currency'
import Nav from '../components/Nav'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function PricingContent() {
  const currency = useCurrency()
  const sym = getCurrencySymbol(currency)
  const searchParams = useSearchParams()
  const reason = searchParams.get('reason')
  const gold = '#C8A24A'

  const plans = [
    {
      name: 'MRI Analysis',
      price: 199,
      originalPrice: sym + '332',
      saving: sym + '1,596',
      period: '/month',
      desc: 'Full constraint intelligence for businesses under ' + sym + '1M revenue.',
      opportunity: sym + '40k+ avg opportunity identified',
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
      price: 399,
      originalPrice: sym + '665',
      saving: sym + '3,192',
      period: '/month',
      desc: 'Full intelligence with quantified opportunity mapping.',
      opportunity: sym + '200k+ avg opportunity identified',
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
      price: 999,
      originalPrice: sym + '1,665',
      saving: sym + '7,992',
      period: '/month',
      desc: 'Complete intelligence, deployment and outcome tracking.',
      opportunity: sym + '1.2M+ avg opportunity identified',
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
    {
      name: 'Corporate Group',
      price: 1599,
      originalPrice: '£2,665',
      saving: sym + '12,792',
      period: '/month',
      desc: 'Full platform intelligence across up to 3 businesses simultaneously.',
      opportunity: sym + '3M+ avg opportunity across portfolio',
      features: [
        'Everything in Full Platform',
        'Up to 3 connected businesses',
        'Portfolio-level health dashboard',
        'Cross-business constraint comparison',
        'Group risk overview and alerts',
        'Consolidated MRI reporting',
        'Multi-business deployment engine',
        'Group-level BEI advisor',
        'Executive briefing pack monthly',
      ],
      cta: 'Corporate Access',
      popular: false,
      color: '#fff',
      badge: 'MULTI-BUSINESS',
    },
    {
      name: 'Enterprise',
      price: null,
      originalPrice: null,
      saving: null,
      period: null,
      desc: 'Custom intelligence infrastructure for enterprises valued £100M–£5B.',
      opportunity: 'Custom benchmarking specific to your enterprise',
      features: [
        'Everything in Corporate Group',
        'Custom enterprise benchmark system',
        'Bespoke intelligence framework build',
        'Unlimited connected businesses',
        'Enterprise-grade data connectors',
        'Dedicated intelligence team',
        'Board-level reporting suite',
        'Custom deployment architecture',
        'SLA-backed response times',
        'Strategic advisory retainer',
      ],
      cta: 'Enquire Now',
      popular: false,
      color: gold,
      badge: 'ENTERPRISE',
      enquire: true,
      priceRange: '£2,500–£25,000/month',
    },
  ]

  const nav = [
    { label: 'Home', href: '/' },
    { label: 'Platform', href: '/platform' },
    { label: 'Our Clients', href: '/clients' },
    { label: 'Pricing', href: '/pricing', active: true },
    { label: 'Example Report', href: '/example-report' },
  ]

  return (
    <main style={{ backgroundColor: '#050505', color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', minHeight: '100vh' }}>
      <Nav active="/pricing" />

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
        <div style={{maxWidth:'1400px',margin:'0 auto'}}><div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'24px',marginBottom:'24px'}}>
          {plans.slice(0,3).map((plan: any) => (
            <div key={plan.name} style={{padding:'36px',border:`1px solid ${plan.enquire?'rgba(200,162,74,0.4)':plan.popular?gold:plan.badge?'rgba(200,162,74,0.2)':'#1a1a1a'}`,borderRadius:'12px',backgroundColor:plan.enquire?'#0d0a04':plan.popular?'#0d0a04':plan.badge?'#09080a':'#080808',position:'relative' as const,display:'flex',flexDirection:'column' as const}}>
              {(plan.popular || plan.badge) && (
                <div style={{position:'absolute' as const,top:'-12px',left:'50%',transform:'translateX(-50%)',padding:'4px 16px',backgroundColor:plan.enquire?'#1a1000':gold,border:`1px solid ${gold}`,borderRadius:'20px',fontSize:'11px',fontWeight:'700',color:plan.enquire?gold:'#050505',whiteSpace:'nowrap' as const,letterSpacing:'0.1em'}}>
                  {plan.badge || 'MOST POPULAR'}
                </div>
              )}
              <div style={{marginBottom:'8px',fontSize:'11px',color:'#555',letterSpacing:'0.15em',textTransform:'uppercase' as const}}>{plan.name}</div>
              <div style={{marginBottom:'16px',fontSize:'13px',color:'#666',lineHeight:'1.6'}}>{plan.desc}</div>
              <div style={{marginBottom:'20px'}}>
                {plan.enquire ? (
                  <div>
                    <div style={{fontSize:'14px',color:gold,fontWeight:'700',marginBottom:'4px'}}>Custom Pricing</div>
                    <div style={{fontSize:'13px',color:'#888'}}>{plan.priceRange}</div>
                  </div>
                ) : (
                  <div style={{display:'flex',alignItems:'baseline',gap:'4px'}}>
                    <span style={{fontSize:'44px',fontWeight:'700',color:plan.popular?gold:plan.badge?gold:'#fff'}}>{formatPrice(plan.price, currency)}</span>
                    <span style={{fontSize:'14px',color:'#555'}}>/month</span>
                  </div>
                )}
                {plan.originalPrice && !plan.enquire && <div style={{fontSize:'12px',color:'#444',marginTop:'4px'}}>Value: {plan.originalPrice}/month · Annual saving: {plan.saving}</div>}
              </div>
              <div style={{padding:'10px 14px',backgroundColor:'rgba(200,162,74,0.06)',border:'1px solid rgba(200,162,74,0.15)',borderRadius:'6px',marginBottom:'20px',fontSize:'12px',color:gold,fontWeight:'600'}}>
                {plan.opportunity}
              </div>
              <div style={{flex:1,marginBottom:'24px'}}>
                {plan.features.map((f: string) => (
                  <div key={f} style={{display:'flex',gap:'10px',alignItems:'flex-start',marginBottom:'10px'}}>
                    <span style={{color:'#4aaa4a',fontSize:'12px',marginTop:'2px',flexShrink:0}}>✓</span>
                    <span style={{fontSize:'13px',color:'#888',lineHeight:'1.5'}}>{f}</span>
                  </div>
                ))}
              </div>
              {plan.enquire ? (
                <a href="/book" style={{display:'block',textAlign:'center' as const,padding:'14px',backgroundColor:'transparent',color:gold,border:`1px solid ${gold}`,borderRadius:'6px',textDecoration:'none',fontWeight:'700',fontSize:'14px'}}>
                  {plan.cta} →
                </a>
              ) : (
                <a href="/register" style={{display:'block',textAlign:'center' as const,padding:'14px',backgroundColor:plan.popular?gold:plan.badge?gold:'transparent',color:plan.popular?'#050505':plan.badge?'#050505':gold,border:`1px solid ${gold}`,borderRadius:'6px',textDecoration:'none',fontWeight:'700',fontSize:'14px'}}>
                  {plan.cta} →
                </a>
              )}
            </div>
          ))}
          </div>
          {/* Second row: Corporate + Enterprise centred */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'24px',maxWidth:'900px',margin:'0 auto'}}>
          {plans.slice(3).map((plan: any) => (
            <div key={plan.name} style={{padding:'36px',border:`1px solid ${(plan as any).enquire?'rgba(200,162,74,0.4)':(plan as any).badge?'rgba(200,162,74,0.2)':'#1a1a1a'}`,borderRadius:'12px',backgroundColor:(plan as any).enquire?'#0d0a04':(plan as any).badge?'#09080a':'#080808',position:'relative' as const,display:'flex',flexDirection:'column' as const}}>
              {((plan as any).badge) && (
                <div style={{position:'absolute' as const,top:'-12px',left:'50%',transform:'translateX(-50%)',padding:'4px 16px',backgroundColor:(plan as any).enquire?'#1a1000':'rgba(200,162,74,0.15)',border:'1px solid rgba(200,162,74,0.4)',borderRadius:'20px',fontSize:'11px',fontWeight:'700',color:'#C8A24A',whiteSpace:'nowrap' as const,letterSpacing:'0.1em'}}>
                  {(plan as any).badge}
                </div>
              )}
              <div style={{marginBottom:'8px',fontSize:'11px',color:'#555',letterSpacing:'0.15em',textTransform:'uppercase' as const}}>{plan.name}</div>
              <div style={{marginBottom:'16px',fontSize:'13px',color:'#666',lineHeight:'1.6'}}>{plan.desc}</div>
              <div style={{marginBottom:'20px'}}>
                {(plan as any).enquire ? (
                  <div>
                    <div style={{fontSize:'24px',color:'#C8A24A',fontWeight:'800',marginBottom:'4px'}}>Custom Pricing</div>
                    <div style={{fontSize:'13px',color:'#888'}}>{(plan as any).priceRange}</div>
                  </div>
                ) : (
                  <div style={{display:'flex',alignItems:'baseline',gap:'4px'}}>
                    <span style={{fontSize:'44px',fontWeight:'700',color:'#C8A24A'}}>{formatPrice(plan.price, currency)}</span>
                    <span style={{fontSize:'14px',color:'#555'}}>/month</span>
                  </div>
                )}
                {plan.originalPrice && !(plan as any).enquire && <div style={{fontSize:'12px',color:'#444',marginTop:'4px'}}>Value: {plan.originalPrice}/month · Annual saving: {plan.saving}</div>}
              </div>
              <div style={{padding:'10px 14px',backgroundColor:'rgba(200,162,74,0.06)',border:'1px solid rgba(200,162,74,0.15)',borderRadius:'6px',marginBottom:'20px',fontSize:'12px',color:'#C8A24A',fontWeight:'600'}}>
                {plan.opportunity}
              </div>
              <div style={{flex:1,marginBottom:'24px'}}>
                {plan.features.map((f: string) => (
                  <div key={f} style={{display:'flex',gap:'10px',alignItems:'flex-start',marginBottom:'10px'}}>
                    <span style={{color:'#4aaa4a',fontSize:'12px',marginTop:'2px',flexShrink:0}}>✓</span>
                    <span style={{fontSize:'13px',color:'#888',lineHeight:'1.5'}}>{f}</span>
                  </div>
                ))}
              </div>
              {(plan as any).enquire ? (
                <a href="/book" style={{display:'block',textAlign:'center' as const,padding:'14px',backgroundColor:'transparent',color:'#C8A24A',border:'1px solid #C8A24A',borderRadius:'6px',textDecoration:'none',fontWeight:'700',fontSize:'14px'}}>
                  {plan.cta} →
                </a>
              ) : (
                <a href="/register" style={{display:'block',textAlign:'center' as const,padding:'14px',backgroundColor:'#C8A24A',color:'#050505',border:'1px solid #C8A24A',borderRadius:'6px',textDecoration:'none',fontWeight:'700',fontSize:'14px'}}>
                  {plan.cta} →
                </a>
              )}
            </div>
          ))}
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW SECTION */}
      <section style={{padding:'80px 48px',borderTop:'1px solid #111',borderBottom:'1px solid #111'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{textAlign:'center' as const,marginBottom:'48px'}}>
            <div style={{fontSize:'11px',color:'#C8A24A',letterSpacing:'0.25em',textTransform:'uppercase' as const,marginBottom:'16px',fontWeight:'600'}}>The Intelligence Hub</div>
            <h2 style={{fontSize:'44px',fontWeight:'800',letterSpacing:'-0.02em',marginBottom:'20px',lineHeight:'1.1'}}>Everything you need.<br /><span style={{color:'#C8A24A'}}>In one executive dashboard.</span></h2>
            <p style={{fontSize:'17px',color:'#888',maxWidth:'560px',margin:'0 auto',lineHeight:'1.8'}}>Your Business Twin, constraint network, health scores, deployment packages and intelligence signals — all in one place, updated continuously.</p>
          </div>
          <div
            onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = '0 0 20px rgba(200,162,74,0.3), 0 0 60px rgba(200,162,74,0.2), 0 0 120px rgba(200,162,74,0.1)'; el.style.borderColor = 'rgba(200,162,74,0.5)' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = '0 0 40px rgba(0,0,0,0.6)'; el.style.borderColor = 'rgba(200,162,74,0.2)' }}
            style={{borderRadius:'12px',overflow:'hidden',border:'1px solid rgba(200,162,74,0.2)',boxShadow:'0 0 40px rgba(0,0,0,0.6)',transition:'box-shadow 0.6s ease, border-color 0.6s ease'}}>
            <img src='/BEIDASH.png' alt='BEI Executive Dashboard' style={{width:'100%',height:'auto',display:'block'}} />
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'20px',marginTop:'40px'}}>
            {[
              {n:'8 tabs',l:'Intelligence areas',s:'Every dimension of your business covered'},
              {n:'Live',l:'Continuous signals',s:'Intelligence updated in real time'},
              {n:'3 tiers',l:'Deployment packages',s:'From automatic to strategic execution'},
              {n:'100/100',l:'Max health score',s:'Clear target with measurable progress'},
            ].map(m => (
              <div key={m.l} style={{padding:'24px',backgroundColor:'#0a0a0a',border:'1px solid #1a1a1a',borderRadius:'10px',textAlign:'center' as const}}>
                <div style={{fontSize:'24px',fontWeight:'700',color:'#C8A24A',marginBottom:'6px'}}>{m.n}</div>
                <div style={{fontSize:'13px',color:'#e0e0e0',fontWeight:'600',marginBottom:'4px'}}>{m.l}</div>
                <div style={{fontSize:'12px',color:'#666'}}>{m.s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW SECTION */}
      <section style={{padding:'80px 48px',borderTop:'1px solid #111',borderBottom:'1px solid #111'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{textAlign:'center' as const,marginBottom:'48px'}}>
            <div style={{fontSize:'11px',color:'#C8A24A',letterSpacing:'0.25em',textTransform:'uppercase' as const,marginBottom:'16px',fontWeight:'600'}}>The Intelligence Hub</div>
            <h2 style={{fontSize:'44px',fontWeight:'800',letterSpacing:'-0.02em',marginBottom:'20px',lineHeight:'1.1'}}>Everything you need.<br /><span style={{color:'#C8A24A'}}>In one executive dashboard.</span></h2>
            <p style={{fontSize:'17px',color:'#888',maxWidth:'560px',margin:'0 auto',lineHeight:'1.8'}}>Your Business Twin, constraint network, health scores, deployment packages and intelligence signals — all in one place, updated continuously.</p>
          </div>
          <div onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = '0 0 20px rgba(200,162,74,0.3), 0 0 60px rgba(200,162,74,0.2), 0 0 120px rgba(200,162,74,0.1)'; el.style.borderColor = 'rgba(200,162,74,0.5)' }} onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = '0 0 40px rgba(0,0,0,0.6)'; el.style.borderColor = 'rgba(200,162,74,0.2)' }} style={{borderRadius:'12px',overflow:'hidden',border:'1px solid rgba(200,162,74,0.2)',boxShadow:'0 0 40px rgba(0,0,0,0.6)',transition:'box-shadow 0.6s ease, border-color 0.6s ease'}}>
            <img src='/BEIDASH.png' alt='BEI Executive Dashboard' style={{width:'100%',height:'auto',display:'block'}} />
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'20px',marginTop:'40px'}}>
            {[{n:'8 tabs',l:'Intelligence areas',s:'Every dimension covered'},{n:'Live',l:'Continuous signals',s:'Updated in real time'},{n:'3 tiers',l:'Deployment packages',s:'Automatic to strategic'},{n:'100/100',l:'Max health score',s:'Clear measurable target'}].map(m => (
              <div key={m.l} style={{padding:'24px',backgroundColor:'#0a0a0a',border:'1px solid #1a1a1a',borderRadius:'10px',textAlign:'center' as const}}>
                <div style={{fontSize:'24px',fontWeight:'700',color:'#C8A24A',marginBottom:'6px'}}>{m.n}</div>
                <div style={{fontSize:'13px',color:'#e0e0e0',fontWeight:'600',marginBottom:'4px'}}>{m.l}</div>
                <div style={{fontSize:'12px',color:'#666'}}>{m.s}</div>
              </div>
            ))}
          </div>
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
        <a href="/register" style={{display:'inline-block',padding:'16px 48px',backgroundColor:gold,color:'#050505',fontWeight:'700',borderRadius:'6px',textDecoration:'none',fontSize:'16px'}}>Generate Free MRI →</a>
      </section>

      <footer style={{padding:'32px 48px',borderTop:'1px solid #111',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{fontSize:'16px',fontWeight:'800',color:gold,letterSpacing:'0.12em'}}>BEI</div>
        <div style={{fontSize:'12px',color:'#333'}}>Business Execution Intelligence · Constraint Intelligence Platform</div>
        <div style={{display:'flex',gap:'24px'}}>
          <a href="/" style={{fontSize:'12px',color:'#444',textDecoration:'none'}}>Home</a>
          <a href="/login" style={{fontSize:'12px',color:'#444',textDecoration:'none'}}>Login</a>
          <a href="/register" style={{fontSize:'12px',color:'#444',textDecoration:'none'}}>Free MRI</a>
        </div>
      </footer>
    </main>
  )
}

export default function PricingPage() {
  return <Suspense fallback={<div style={{backgroundColor:'#050505',minHeight:'100vh'}}/>}><PricingContent /></Suspense>
}
