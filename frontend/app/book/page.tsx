'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function BookPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    business_name: '', contact_name: '', email: '', phone: '', industry: '', revenue_band: '',
  })

  const industries = ['estate_agency', 'marketing_agency', 'accountancy_firm']
  const revenueBands = ['Under £250k', '£250k – £500k', '£500k – £1M', '£1M – £3M', '£3M – £10M', 'Over £10M']
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    setError('')
    if (!form.business_name || !form.contact_name || !form.email || !form.industry || !form.revenue_band) {
      setError('Please complete all required fields.')
      return
    }
    setLoading(true)
    try {
      const { data, error: dbError } = await supabase
        .from('businesses')
        .insert([{
          business_name: form.business_name,
          industry: form.industry,
          annual_revenue_band: form.revenue_band,
          email: form.email,
          phone: form.phone,
          status: 'active',
          mri_requested: true,
          mri_completed: false,
        }])
        .select()
        .single()
      if (dbError) throw dbError
      router.push('/intake/' + data.id)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setLoading(false)
    }
  }

  const inp: React.CSSProperties = {width:'100%',backgroundColor:'#111111',border:'1px solid #1a1a1a',borderRadius:'8px',padding:'14px 16px',color:'#ffffff',fontSize:'15px',outline:'none',boxSizing:'border-box'}
  const lbl: React.CSSProperties = {display:'block',fontSize:'13px',fontWeight:'600',color:'#888888',marginBottom:'8px',letterSpacing:'0.05em',textTransform:'uppercase'}

  return (
    <main style={{backgroundColor:'#050505',color:'#ffffff',fontFamily:'Inter,system-ui,sans-serif',minHeight:'100vh'}}>
      <nav style={{padding:'24px 48px',display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'1px solid #1a1a1a'}}>
        <a href="/" style={{fontSize:'20px',fontWeight:'700',color:'#C8A24A',letterSpacing:'0.1em',textDecoration:'none'}}>BEI</a>
        <div style={{fontSize:'13px',color:'#555555'}}>Business MRI Booking</div>
      </nav>
      <section style={{padding:'80px 48px',maxWidth:'640px',margin:'0 auto'}}>
        <div style={{marginBottom:'48px'}}>
          <div style={{fontSize:'12px',fontWeight:'600',letterSpacing:'0.2em',color:'#C8A24A',marginBottom:'16px',textTransform:'uppercase'}}>Step 1 of 3</div>
          <h1 style={{fontSize:'36px',fontWeight:'700',marginBottom:'12px',lineHeight:'1.2'}}>Book Your Business MRI</h1>
          <p style={{fontSize:'16px',color:'#888888',lineHeight:'1.6'}}>Tell us about your business. Takes 2 minutes.</p>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
          <div><label style={lbl}>Business Name *</label><input name="business_name" value={form.business_name} onChange={handleChange} placeholder="e.g. Smith and Co Estate Agents" style={inp} /></div>
          <div><label style={lbl}>Your Name *</label><input name="contact_name" value={form.contact_name} onChange={handleChange} placeholder="e.g. James Smith" style={inp} /></div>
          <div><label style={lbl}>Email Address *</label><input name="email" type="email" value={form.email} onChange={handleChange} placeholder="e.g. james@smithco.co.uk" style={inp} /></div>
          <div><label style={lbl}>Phone Number</label><input name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. 07700 900000" style={inp} /></div>
          <div><label style={lbl}>Industry *</label>
            <select name="industry" value={form.industry} onChange={handleChange} style={{...inp,color:form.industry?'#ffffff':'#555555'}}>
              <option value="" disabled>Select your industry</option>
              {industries.map(i => <option key={i} value={i} style={{color:'#ffffff'}}>{i}</option>)}
            </select>
          </div>
          <div><label style={lbl}>Annual Revenue *</label>
            <select name="revenue_band" value={form.revenue_band} onChange={handleChange} style={{...inp,color:form.revenue_band?'#ffffff':'#555555'}}>
              <option value="" disabled>Select revenue band</option>
              {revenueBands.map(r => <option key={r} value={r} style={{color:'#ffffff'}}>{r}</option>)}
            </select>
          </div>
          {error && <div style={{backgroundColor:'#1a0a0a',border:'1px solid #3a1a1a',borderRadius:'8px',padding:'14px 16px',color:'#ff6b6b',fontSize:'14px'}}>{error}</div>}
          <button onClick={handleSubmit} disabled={loading} style={{backgroundColor:loading?'#8a6e32':'#C8A24A',color:'#050505',padding:'18px',borderRadius:'8px',fontWeight:'700',fontSize:'16px',border:'none',cursor:loading?'not-allowed':'pointer',marginTop:'8px'}}>
            {loading ? 'Creating your MRI...' : 'Start My Business MRI'}
          </button>
          <p style={{textAlign:'center',fontSize:'12px',color:'#444444'}}>BEI MRI v1.0 - Rules-Based Analysis. No obligation.</p>
        </div>
      </section>
    </main>
  )
}