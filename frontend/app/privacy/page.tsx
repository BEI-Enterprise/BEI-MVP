'use client'
import Nav from '../components/Nav'

const gold = '#C8A24A'

export default function PrivacyPage() {
  return (
    <main style={{ backgroundColor: '#050505', color: '#fff', fontFamily: 'Inter,system-ui,sans-serif', minHeight: '100vh' }}>
      <Nav />
      <section style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 48px' }}>
        <div style={{ fontSize: '11px', color: gold, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '16px', fontWeight: '600' }}>Legal</div>
        <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '12px', letterSpacing: '-0.02em' }}>Privacy Policy</h1>
        <p style={{ fontSize: '13px', color: '#555', marginBottom: '48px' }}>Last updated: June 2026</p>

        {[
          { title: '1. Who We Are', body: 'Business Execution Intelligence ("BEI", "we", "us") is a SaaS platform operated from the United Kingdom. We provide constraint intelligence and business diagnostic services to SMEs. Our registered address and contact details are available at officialbei.com. For privacy matters, contact us at hello@bei.io.' },
          { title: '2. What Data We Collect', body: 'We collect information you provide directly: your name, email address, business name, industry, revenue band, and business profile data submitted during the Business MRI intake. We also collect usage data automatically, including page views, session identifiers, IP addresses, and browser information. Payment information is processed by Stripe and is never stored on our servers.' },
          { title: '3. How We Use Your Data', body: 'We use your data to deliver the BEI platform — including generating your Business MRI report, building your Business Twin, identifying and verifying constraints, and providing deployment recommendations. We also use data to improve our intelligence models, send platform notifications, and communicate subscription information. We do not sell your data to third parties.' },
          { title: '4. Legal Basis for Processing', body: 'We process your data under the following legal bases: contract performance (to deliver the services you have subscribed to), legitimate interests (to improve our platform and intelligence accuracy), and consent (for marketing communications, which you may withdraw at any time).' },
          { title: '5. Data Sharing', body: 'We share data only with trusted service providers necessary to operate the platform: Supabase (database), Stripe (payments), Vercel (hosting), and Railway (intelligence server). All providers are bound by data processing agreements. We do not share your business data with other BEI clients or third-party advertisers.' },
          { title: '6. Data Retention', body: 'We retain your account and business data for as long as your account is active. If you close your account, we delete your personal data within 90 days, except where we are required to retain it for legal or financial compliance purposes.' },
          { title: '7. Your Rights', body: 'Under UK GDPR, you have the right to access, correct, or delete your personal data; to restrict or object to processing; and to data portability. To exercise any of these rights, contact us at hello@bei.io. You also have the right to lodge a complaint with the Information Commissioner\'s Office (ICO).' },
          { title: '8. Cookies', body: 'We use essential cookies to maintain your session and authentication state. We do not use advertising or tracking cookies. You can disable cookies in your browser settings, though this may affect platform functionality.' },
          { title: '9. Security', body: 'We implement industry-standard security measures including encrypted connections (HTTPS), row-level security on our database, and access controls. No method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.' },
          { title: '10. Changes to This Policy', body: 'We may update this policy from time to time. We will notify you of material changes by email or via the platform. Continued use of BEI after changes constitutes acceptance of the updated policy.' },
        ].map(s => (
          <div key={s.title} style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: gold, marginBottom: '12px' }}>{s.title}</h2>
            <p style={{ fontSize: '15px', color: '#999', lineHeight: '1.9' }}>{s.body}</p>
          </div>
        ))}
      </section>
      <footer style={{ padding: '32px 48px', borderTop: '1px solid #111', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: '#444' }}>© 2026 Business Execution Intelligence · <a href="/terms" style={{ color: '#444', textDecoration: 'none' }}>Terms</a> · <a href="/privacy" style={{ color: '#444', textDecoration: 'none' }}>Privacy</a></p>
      </footer>
    </main>
  )
}
