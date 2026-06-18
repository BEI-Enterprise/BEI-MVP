'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

// ============================================================
// BEI Visual Enhancement Components
// Marketing layer only. Never import into intelligence engines.
// Ideas 1 + 3 + 6: Network graph, detection bars, scroll reveals
// ============================================================

// IDEA 6 — Premium scroll reveal with staggered delays
export function RevealSection({ children, delay = 0, className }: { children: ReactNode, delay?: number, className?: string }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.08 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(28px)',
      transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    }}>
      {children}
    </div>
  )
}

// IDEA 6 — Gold border glow on hover card
export function GlowCard({ children, style }: { children: ReactNode, style?: React.CSSProperties }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        backgroundColor: '#0a0a0a',
        border: `1px solid ${hovered ? 'rgba(200,162,74,0.4)' : '#1e1e1e'}`,
        borderRadius: '12px',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        boxShadow: hovered ? '0 0 40px rgba(200,162,74,0.08)' : 'none',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: hovered
          ? 'linear-gradient(90deg, transparent, rgba(200,162,74,0.6), transparent)'
          : 'linear-gradient(90deg, transparent, rgba(200,162,74,0.2), transparent)',
        transition: 'background 0.3s ease',
      }} />
      {children}
    </div>
  )
}

// IDEA 1 — Animated constraint network graph
export function NetworkGraph({ width = 600, height = 400, nodeCount = 18 }: { width?: number, height?: number, nodeCount?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2.5 + 2,
      pulse: Math.random() * Math.PI * 2,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      nodes.forEach(n => {
        n.x += n.vx
        n.y += n.vy
        n.pulse += 0.018
        if (n.x < 0 || n.x > width) n.vx *= -1
        if (n.y < 0 || n.y > height) n.vy *= -1
      })
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const maxDist = width * 0.28
          if (dist < maxDist) {
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `rgba(200,162,74,${(1 - dist / maxDist) * 0.4})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }
      nodes.forEach(n => {
        const pulsed = n.r + Math.sin(n.pulse) * 0.8
        ctx.beginPath()
        ctx.arc(n.x, n.y, pulsed, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(200,162,74,0.85)'
        ctx.fill()
        ctx.beginPath()
        ctx.arc(n.x, n.y, pulsed * 3, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(200,162,74,0.08)'
        ctx.fill()
      })
      animRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(animRef.current)
  }, [width, height, nodeCount])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  )
}

// IDEA 3 — Constraint detection bars
export function DetectionBars({ constraints, visible }: { constraints: { name: string, score: number, color: string }[], visible: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {constraints.map((c, i) => (
        <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '180px', fontSize: '13px', color: '#777', flexShrink: 0 }}>{c.name}</div>
          <div style={{ flex: 1, height: '6px', backgroundColor: '#111', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              backgroundColor: c.color,
              borderRadius: '3px',
              width: visible ? `${c.score}%` : '0%',
              transition: `width 1.2s cubic-bezier(0.16,1,0.3,1) ${i * 120}ms`,
            }} />
          </div>
          <div style={{
            fontSize: '12px',
            color: c.color,
            fontWeight: '600',
            width: '32px',
            opacity: visible ? 1 : 0,
            transition: `opacity 0.4s ease ${i * 120 + 800}ms`,
          }}>{c.score}</div>
        </div>
      ))}
    </div>
  )
}

// IDEA 3 wrapper with scroll trigger
export function DetectionBarsSection({ constraints }: { constraints: { name: string, score: number, color: string }[] }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return (
    <div ref={ref}>
      <DetectionBars constraints={constraints} visible={visible} />
    </div>
  )
}

// Gold top-line card (used across all marketing pages)
export function GoldTopCard({ children, style }: { children: ReactNode, style?: React.CSSProperties }) {
  return (
    <div style={{
      position: 'relative',
      backgroundColor: '#0a0a0a',
      border: '1px solid #1e1e1e',
      borderRadius: '12px',
      overflow: 'hidden',
      ...style,
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(200,162,74,0.35), transparent)',
      }} />
      {children}
    </div>
  )
}
