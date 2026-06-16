'use client'

export default function TestEnv() {
  return (
    <div>
      <p>SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
      <p>SUPABASE_KEY: {process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}</p>
    </div>
  )
}

