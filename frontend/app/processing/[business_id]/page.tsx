'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

const stages = [
  'Building Business Twin',
  'Analysing Business Health',
  'Identifying Constraints',
  'Calculating Opportunities',
  'Generating MRI Report',
]

export default function ProcessingPage() {
  const router = useRouter()
  const params = useParams()
  const businessId = params.business_id as string
  const [activeStage, setActiveStage] = useState(0)

  useEffect(() => {
    const stageDuration = 700
    const timers: ReturnType<typeof setTimeout>[] = []

    stages.forEach((_, i) => {
      timers.push(setTimeout(() => setActiveStage(i), i * stageDuration))
    })

    const redirectTimer = setTimeout(() => {
      router.push('/report/' + businessId)
    }, stages.length * stageDuration + 400)

    timers.push(redirectTimer)
    return () => timers.forEach(t => clearTimeout(t))
  }, [businessId, router])

  return (
    <main style={{backgroundColor:'#050505',color:'#ffffff',fontFamily:'Inter,system-ui,sans-serif',minHeight:'100vh',display:'flex',flexDirection:'column'}}>
      <nav style={{padding:'24px 48px',borderBottom:'1px solid #1a1a1a'}}>
        <span style={{fontSize:'20px',fontWeight:'700',color:'#C8A24A',letterSpacing:'0.1em'}}>BEI</span>
      </nav>

      <section style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{maxWidth:'480px',width:'100%',padding:'0 24px'}}>
          <div style={{textAlign:'center',marginBottom:'48px'}}>
            <div style={{fontSize:'12px',fontWeight:'600',letterSpacing:'0.2em',color:'#C8A24A',marginBottom:'16px',textTransform:'uppercase'}}>Generating Your MRI</div>
            <h1 style={{fontSize:'28px',fontWeight:'700',lineHeight:'1.3'}}>Building your Business MRI</h1>
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:'4px'}}>
            {stages.map((stage, i) => {
              const isDone = i < activeStage
              const isActive = i === activeStage
              return (
                <div key={stage} style={{display:'flex',alignItems:'center',gap:'16px',padding:'14px 0'}}>
                  <div style={{
                    width:'24px',height:'24px',borderRadius:'50%',flexShrink:0,
                    backgroundColor: isDone ? '#2a4a2a' : isActive ? '#C8A24A' : '#111111',
                    border: isDone || isActive ? 'none' : '1px solid #2a2a2a',
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontSize:'12px',fontWeight:'700',
                    color: isDone ? '#4aaa4a' : isActive ? '#050505' : '#444444',
                    transition:'all 0.3s ease',
                  }}>
                    {isDone ? '✓' : isActive ?
                      <span style={{display:'inline-block',width:'8px',height:'8px',borderRadius:'50%',backgroundColor:'#050505',animation:'pulse 1s infinite'}} /> :
                      ''}
                  </div>
                  <span style={{
                    fontSize:'15px',
                    color: isDone ? '#666666' : isActive ? '#ffffff' : '#444444',
                    fontWeight: isActive ? '600' : '400',
                    transition:'all 0.3s ease',
                  }}>
                    {stage}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <p style={{textAlign:'center',paddingBottom:'32px',fontSize:'12px',color:'#333333'}}>BEI MRI v1.0 - Rules-Based Analysis</p>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </main>
  )
}