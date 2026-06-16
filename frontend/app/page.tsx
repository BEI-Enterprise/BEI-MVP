import Link from 'next/link'

export default function Home() {
  return (
    <main style={{backgroundColor: '#050505', color: '#ffffff', fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh'}}>
      
      {/* Navigation */}
      <nav style={{padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1a1a1a'}}>
        <div style={{fontSize: '20px', fontWeight: '700', color: '#C8A24A', letterSpacing: '0.1em'}}>BEI</div>
        <Link href="/book" style={{backgroundColor: '#C8A24A', color: '#050505', padding: '12px 28px', borderRadius: '6px', fontWeight: '600', fontSize: '14px', textDecoration: 'none'}}>
          Book Your MRI
        </Link>
      </nav>

      {/* Hero */}
      <section style={{padding: '120px 48px', maxWidth: '900px', margin: '0 auto', textAlign: 'center'}}>
        <div style={{fontSize: '12px', fontWeight: '600', letterSpacing: '0.2em', color: '#C8A24A', marginBottom: '24px', textTransform: 'uppercase'}}>
          Business Execution Intelligence
        </div>
        <h1 style={{fontSize: '56px', fontWeight: '700', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-0.02em'}}>
          What is the one thing holding your business back right now?
        </h1>
        <p style={{fontSize: '20px', color: '#888888', lineHeight: '1.6', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px'}}>
          BEI identifies the highest-value root constraint limiting your business — then tells you exactly what to do about it.
        </p>
        <Link href="/book" style={{backgroundColor: '#C8A24A', color: '#050505', padding: '18px 48px', borderRadius: '6px', fontWeight: '700', fontSize: '16px', textDecoration: 'none', display: 'inline-block'}}>
          Book Your Free Business MRI
        </Link>
        <p style={{marginTop: '16px', fontSize: '13px', color: '#555555'}}>Takes 15 minutes. No obligation. Instant report.</p>
      </section>

      {/* Problem */}
      <section style={{padding: '80px 48px', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a', backgroundColor: '#0a0a0a'}}>
        <div style={{maxWidth: '800px', margin: '0 auto', textAlign: 'center'}}>
          <h2 style={{fontSize: '36px', fontWeight: '700', marginBottom: '24px'}}>Most businesses are solving the wrong problems.</h2>
          <p style={{fontSize: '18px', color: '#888888', lineHeight: '1.7'}}>
            They optimise symptoms. They ignore root causes. They focus on visible problems rather than important ones. More leads when the real problem is capacity. Better marketing when the real problem is trust. BEI finds the actual constraint — not the loudest one.
          </p>
        </div>
      </section>

      {/* What BEI Does */}
      <section style={{padding: '100px 48px'}}>
        <div style={{maxWidth: '1000px', margin: '0 auto'}}>
          <div style={{textAlign: 'center', marginBottom: '64px'}}>
            <div style={{fontSize: '12px', fontWeight: '600', letterSpacing: '0.2em', color: '#C8A24A', marginBottom: '16px', textTransform: 'uppercase'}}>How It Works</div>
            <h2 style={{fontSize: '40px', fontWeight: '700'}}>Intelligence, not dashboards.</h2>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px'}}>
            {[
              {step: '01', title: 'Business MRI', desc: 'We build a complete digital twin of your business across Growth, Operations, Strategy, Risk and Context.'},
              {step: '02', title: 'Constraint Detection', desc: 'Our intelligence engine identifies and verifies the root constraints limiting your performance — not just symptoms.'},
              {step: '03', title: 'Execution Intelligence', desc: 'BEI tells you exactly what to fix first, what it is costing you, and what the opportunity looks like when resolved.'},
            ].map((item) => (
              <div key={item.step} style={{backgroundColor: '#111111', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '40px 32px'}}>
                <div style={{fontSize: '12px', fontWeight: '700', color: '#C8A24A', letterSpacing: '0.15em', marginBottom: '16px'}}>{item.step}</div>
                <h3 style={{fontSize: '20px', fontWeight: '600', marginBottom: '12px'}}>{item.title}</h3>
                <p style={{fontSize: '15px', color: '#888888', lineHeight: '1.6'}}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section style={{padding: '80px 48px', backgroundColor: '#0a0a0a', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a'}}>
        <div style={{maxWidth: '1000px', margin: '0 auto'}}>
          <div style={{textAlign: 'center', marginBottom: '56px'}}>
            <div style={{fontSize: '12px', fontWeight: '600', letterSpacing: '0.2em', color: '#C8A24A', marginBottom: '16px', textTransform: 'uppercase'}}>Who It Is For</div>
            <h2 style={{fontSize: '40px', fontWeight: '700'}}>Built for three industries to start.</h2>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px'}}>
            {[
              {title: 'Estate Agencies', desc: 'Identify whether your constraint is lead volume, valuation conversion, instruction rate, trust deficit or operational capacity.'},
              {title: 'Marketing Agencies', desc: 'Find whether your real problem is pricing, utilisation, client retention, offer clarity or founder dependency.'},
              {title: 'Accountancy Firms', desc: 'Understand whether partner dependency, capacity, recurring revenue or pricing is the primary constraint on your growth.'},
            ].map((item) => (
              <div key={item.title} style={{backgroundColor: '#111111', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '36px 28px'}}>
                <div style={{width: '40px', height: '3px', backgroundColor: '#C8A24A', marginBottom: '20px', borderRadius: '2px'}}></div>
                <h3 style={{fontSize: '20px', fontWeight: '600', marginBottom: '12px'}}>{item.title}</h3>
                <p style={{fontSize: '15px', color: '#888888', lineHeight: '1.6'}}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding: '120px 48px', textAlign: 'center'}}>
        <div style={{maxWidth: '700px', margin: '0 auto'}}>
          <h2 style={{fontSize: '44px', fontWeight: '700', marginBottom: '24px', lineHeight: '1.15'}}>
            Find out what is actually holding your business back.
          </h2>
          <p style={{fontSize: '18px', color: '#888888', marginBottom: '48px', lineHeight: '1.6'}}>
            Book a free Business MRI. 15 minutes. Rules-based analysis. Instant report showing your primary constraint and the opportunity available when you fix it.
          </p>
          <Link href="/book" style={{backgroundColor: '#C8A24A', color: '#050505', padding: '20px 56px', borderRadius: '6px', fontWeight: '700', fontSize: '18px', textDecoration: 'none', display: 'inline-block'}}>
            Book Your Free Business MRI
          </Link>
          <p style={{marginTop: '20px', fontSize: '13px', color: '#555555'}}>BEI MRI v1.0 — Rules-Based Analysis</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{padding: '40px 48px', borderTop: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{fontSize: '16px', fontWeight: '700', color: '#C8A24A'}}>BEI</div>
        <div style={{fontSize: '13px', color: '#555555'}}>Business Execution Intelligence — MVP 1.0</div>
      </footer>

    </main>
  )
}
