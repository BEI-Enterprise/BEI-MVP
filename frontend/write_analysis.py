import os
os.makedirs('lib', exist_ok=True)

code = open('write_analysis.py').read()

content = '''type Severity = "high" | "medium" | "low"

export type ConstraintFlag = {
  key: string
  name: string
  severity: Severity
  score: number
  evidence: string[]
}

export type PillarScore = {
  pillar: string
  score: number
  label: string
}

export type MRIResult = {
  likelyConstraint: ConstraintFlag | null
  secondaryConstraints: ConstraintFlag[]
  pillarScores: PillarScore[]
  overallHealth: number
  opportunityRangeLow: number
  opportunityRangeHigh: number
  nextSteps: string[]
}
'''

with open('lib/mriAnalysis.ts', 'w') as f:
    f.write(content)
print('Done')
