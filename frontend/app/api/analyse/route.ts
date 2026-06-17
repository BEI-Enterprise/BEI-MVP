import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { spawn } from 'child_process'
import path from 'path'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { business_id, answers, industry, revenue_band } = body

    if (!business_id || !answers) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Run Python intelligence orchestrator
    const result = await runPythonOrchestrator(business_id, industry, revenue_band, answers)

    // Store result in Supabase
    const { error: updateError } = await supabase
      .from('businesses')
      .update({
        mri_completed: true,
        mri_version: result.confidence === 'high' ? 'v1.1-verified' : 'v1.0-rules-based',
        status: 'mri_complete',
        mri_result: result,
      })
      .eq('id', business_id)

    if (updateError) {
      console.error('Supabase update error:', updateError)
    }

    return NextResponse.json({ success: true, result })

  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Analysis failed' },
      { status: 500 }
    )
  }
}

function runPythonOrchestrator(
  business_id: string,
  industry: string,
  revenue_band: string,
  answers: Record<string, string>
): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const repoRoot = path.resolve(process.cwd(), '..')
    const scriptPath = path.join(repoRoot, 'services', 'run_intelligence.py')

    const input = JSON.stringify({ business_id, industry, revenue_band, answers })

    const py = spawn('python3', [scriptPath], {
      cwd: repoRoot,
    })

    let output = ''
    let errOutput = ''

    py.stdin.write(input)
    py.stdin.end()

    py.stdout.on('data', (data) => { output += data.toString() })
    py.stderr.on('data', (data) => { errOutput += data.toString() })

    py.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python error: ${errOutput}`))
      } else {
        try {
          resolve(JSON.parse(output))
        } catch {
          reject(new Error(`Invalid JSON from Python: ${output}`))
        }
      }
    })
  })
}
