"use client"

export default function AdminPage() {
  return (
    <main style={{backgroundColor: '#050505', color: '#ffffff', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif'}}>
      <nav style={{padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1a1a1a'}}>
        <a href="/" style={{fontSize: '20px', fontWeight: '700', color: '#C8A24A', letterSpacing: '0.1em', textDecoration: 'none'}}>
          BEI
        </a>
        <div style={{fontSize: '13px', color: '#555555'}}>Admin Portal</div>
      </nav>

      <section style={{padding: '80px 48px', maxWidth: '960px', margin: '0 auto'}}>
        <h1 style={{fontSize: '36px', fontWeight: '700', marginBottom: '24px', color: '#C8A24A'}}>
          Admin Portal
        </h1>
        <p style={{fontSize: '16px', color: '#888888'}}>
          This is the Admin Portal landing page for managing businesses, constraints, opportunities, deployments, and more.
        </p>
        {/* Add admin management UI/components here as next steps */}
      </section>
    </main>
  )
}
