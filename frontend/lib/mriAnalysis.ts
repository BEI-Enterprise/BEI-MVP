type Severity = 'high' | 'medium' | 'low'

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

function scoreOption(value: string, scale: string[]): number {
  const idx = scale.indexOf(value)
  if (idx === -1) return 2
  return idx
}

export function runRulesBasedAnalysis(
  answers: Record<string, string>,
  revenueBand: string
): MRIResult {
  const flags: ConstraintFlag[] = []

  // Trust Infrastructure Deficit
  if (['None', 'Very little'].includes(answers.trust_infrastructure)) {
    flags.push({
      key: 'trust_infrastructure_deficit',
      name: 'Trust Infrastructure Deficit',
      severity: answers.trust_infrastructure === 'None' ? 'high' : 'medium',
      score: answers.trust_infrastructure === 'None' ? 9 : 6,
      evidence: [
        'You reported ' + answers.trust_infrastructure.toLowerCase() +
        ' proof (reviews, case studies, testimonials) to show new customers.'
      ],
    })
  }

  // Lead Response Deficit
  if (['Less than 1 in 10', '1-2 in 10'].includes(answers.conversion_rate)) {
    flags.push({
      key: 'lead_response_deficit',
      name: 'Lead Response Deficit',
      severity: answers.conversion_rate === 'Less than 1 in 10' ? 'high' : 'medium',
      score: answers.conversion_rate === 'Less than 1 in 10' ? 8 : 6,
      evidence: [
        'Your enquiry-to-client conversion rate is ' + answers.conversion_rate +
        ', below typical benchmarks for your sector.'
      ],
    })
  }

  // Pricing Constraint
  if (['Not confident at all', 'A little unsure'].includes(answers.pricing_confidence)) {
    flags.push({
      key: 'pricing_constraint',
      name: 'Pricing Constraint',
      severity: answers.pricing_confidence === 'Not confident at all' ? 'high' : 'medium',
      score: answers.pricing_confidence === 'Not confident at all' ? 8 : 5,
      evidence: [
        'You indicated you are "' + answers.pricing_confidence.toLowerCase() +
        '" that your pricing is set correctly.'
      ],
    })
  }

  // Capacity Constraint
  if (['Fully stretched', '85-95%'].includes(answers.capacity_utilisation)) {
    flags.push({
      key: 'capacity_constraint',
      name: 'Capacity Constraint',
      severity: answers.capacity_utilisation === 'Fully stretched' ? 'high' : 'medium',
      score: answers.capacity_utilisation === 'Fully stretched' ? 8 : 6,
      evidence: [
        'Team capacity is reported at "' + answers.capacity_utilisation +
        '", leaving little room to take on more work.'
      ],
    })
  }

  // Founder Dependency
  if (
    ['It would stop without me', 'It would struggle a lot']
    .includes(answers.founder_dependency)
  ) {
    flags.push({
      key: 'founder_dependency',
      name: 'Founder Dependency',
      severity: answers.founder_dependency === 'It would stop without me' ? 'high' : 'medium',
      score: answers.founder_dependency === 'It would stop without me' ? 9 : 7,
      evidence: [
        'You reported the business "' + answers.founder_dependency.toLowerCase() +
        '" if you took a 2-week holiday.'
      ],
    })
  }

  // Revenue Concentration Risk
  if (
    ['Three-fifths to four-fifths', 'Most of it']
    .includes(answers.revenue_concentration)
  ) {
    flags.push({
      key: 'revenue_concentration_risk',
      name: 'Revenue Concentration Risk',
      severity: answers.revenue_concentration === 'Most of it' ? 'high' : 'medium',
      score: answers.revenue_concentration === 'Most of it' ? 8 : 6,
      evidence: [
        'Your top 3 clients account for "' + answers.revenue_concentration.toLowerCase() +
        '" of total income.'
      ],
    })
  }

  // Offer Weakness
  if (['Not at all clear', 'A bit confusing'].includes(answers.offer_clarity)) {
    flags.push({
      key: 'offer_weakness',
      name: 'Offer Weakness',
      severity: answers.offer_clarity === 'Not at all clear' ? 'high' : 'medium',
      score: answers.offer_clarity === 'Not at all clear' ? 7 : 5,
      evidence: [
        'You rated your offer as "' + answers.offer_clarity.toLowerCase() +
        '" to a stranger visiting your website.'
      ],
    })
  }

  // Market Selection Risk
  if (['Shrinking quickly', 'Shrinking'].includes(answers.market_growth)) {
    flags.push({
      key: 'market_selection_risk',
      name: 'Market Selection Risk',
      severity: answers.market_growth === 'Shrinking quickly' ? 'high' : 'medium',
      score: answers.market_growth === 'Shrinking quickly' ? 7 : 5,
      evidence: [
        'You reported demand in your market is "' + answers.market_growth.toLowerCase() + '".'
      ],
    })
  }

  // Management Bottleneck
  if (answers.delivery_bottleneck === 'Managing the team') {
    flags.push({
      key: 'management_bottleneck',
      name: 'Management Bottleneck',
      severity: 'medium',
      score: 6,
      evidence: ['You identified "managing the team" as where things slow down most often.'],
    })
  }

  // Staffing Inefficiency
  if (
    answers.delivery_bottleneck === 'Doing the actual work' &&
    ['Just me', '2-5'].includes(answers.team_size)
  ) {
    flags.push({
      key: 'staffing_inefficiency',
      name: 'Staffing Inefficiency',
      severity: 'medium',
      score: 6,
      evidence: [
        'You identified "doing the actual work" as the main bottleneck with a team of ' +
        answers.team_size + '.'
      ],
    })
  }

  flags.sort((a, b) => b.score - a.score)
  const likelyConstraint = flags.length > 0 ? flags[0] : null
  const secondaryConstraints = flags.slice(1, 4)

  // Pillar scores
  const growthAnswers = [
    scoreOption(answers.revenue_trend, ['Dropped quickly','Dropped slowly','Stayed about the same','Growing slowly','Growing quickly']),
    scoreOption(answers.lead_volume, ['0-5','6-20','21-50','51-100','Over 100']),
    scoreOption(answers.conversion_rate, ['Less than 1 in 10','1-2 in 10','2-4 in 10','4-6 in 10','More than 6 in 10']),
  ]
  const growthScore = Math.round((growthAnswers.reduce((a, b) => a + b, 0) / (growthAnswers.length * 4)) * 100)

  const opsAnswers = [
    (4 - scoreOption(answers.capacity_utilisation, ['Less than half','About half to 70%','70-85%','85-95%','Fully stretched'])),
    scoreOption(answers.founder_dependency, ['It would stop without me','It would struggle a lot','It would manage with some issues','It would mostly be fine','It would run smoothly without me']),
  ]
  const opsScore = Math.round((opsAnswers.reduce((a, b) => a + b, 0) / (opsAnswers.length * 4)) * 100)

  const strategyAnswers = [
    scoreOption(answers.pricing_confidence, ['Not confident at all','A little unsure','Fairly confident','Very confident','Completely confident']),
    scoreOption(answers.offer_clarity, ['Not at all clear','A bit confusing','Reasonably clear','Clear','Crystal clear']),
    scoreOption(answers.market_position, ['Pretty much the same as everyone else','Slightly different','Somewhat different','Clearly different','Nobody else offers what we do']),
  ]
  const strategyScore = Math.round((strategyAnswers.reduce((a, b) => a + b, 0) / (strategyAnswers.length * 4)) * 100)

  const riskAnswers = [
    scoreOption(answers.revenue_concentration, ['Most of it','Three-fifths to four-fifths','Two-fifths to three-fifths','A fifth to two-fifths','Less than a fifth']),
    scoreOption(answers.trust_infrastructure, ['None','Very little','Some','A good amount','Plenty']),
    scoreOption(answers.cash_flow_stability, ['Very unpredictable','Unpredictable','Okay, some swings','Fairly steady','Very steady']),
    scoreOption(answers.key_person_risk, ['The business would likely fail','Serious damage','Noticeable impact','Minor disruption','Barely any impact']),
  ]
  const riskScore = Math.round((riskAnswers.reduce((a, b) => a + b, 0) / (riskAnswers.length * 4)) * 100)

  const contextAnswers = [
    scoreOption(answers.market_growth, ['Shrinking quickly','Shrinking','Staying flat','Growing','Growing quickly']),
    (4 - scoreOption(answers.competition_intensity, ['Very little','A little','A moderate amount','A lot','Intense competition'])),
    scoreOption(answers.client_retention, ['Under 50%','50-65%','65-80%','80-90%','Over 90%']),
  ]
  const contextScore = Math.round((contextAnswers.reduce((a, b) => a + b, 0) / (contextAnswers.length * 4)) * 100)

  const pillarScores: PillarScore[] = [
    { pillar: 'Growth', score: growthScore, label: growthScore >= 70 ? 'Strong' : growthScore >= 45 ? 'Moderate' : 'Needs Attention' },
    { pillar: 'Operations', score: opsScore, label: opsScore >= 70 ? 'Strong' : opsScore >= 45 ? 'Moderate' : 'Needs Attention' },
    { pillar: 'Strategy', score: strategyScore, label: strategyScore >= 70 ? 'Strong' : strategyScore >= 45 ? 'Moderate' : 'Needs Attention' },
    { pillar: 'Risk', score: riskScore, label: riskScore >= 70 ? 'Strong' : riskScore >= 45 ? 'Moderate' : 'Needs Attention' },
    { pillar: 'Context', score: contextScore, label: contextScore >= 70 ? 'Strong' : contextScore >= 45 ? 'Moderate' : 'Needs Attention' },
  ]

  const overallHealth = Math.round(
    pillarScores.reduce((a, p) => a + p.score, 0) / pillarScores.length
  )

  // Indicative opportunity range
  const revenueMidpoints: Record<string, number> = {
    'Under 10k': 60000,
    '10k-25k': 210000,
    '25k-50k': 450000,
    '50k-100k': 900000,
    '100k-250k': 2100000,
    'Over 250k': 4000000,
  }
  const baseRevenue = revenueMidpoints[revenueBand] || 500000
  const sevMultiplier = likelyConstraint
    ? likelyConstraint.severity === 'high' ? 3 : likelyConstraint.severity === 'medium' ? 2 : 1
    : 1
  const opportunityRangeLow = Math.round((baseRevenue * 0.03 * sevMultiplier) / 1000) * 1000
  const opportunityRangeHigh = Math.round((baseRevenue * 0.08 * sevMultiplier) / 1000) * 1000

  const nextSteps: string[] = []
  if (likelyConstraint) {
    nextSteps.push(
      'Review the evidence behind your Likely Constraint with your team to confirm it matches what you see day to day.'
    )
    nextSteps.push(
      'Focus one priority action this quarter directly on "' + likelyConstraint.name +
      '" rather than spreading effort across multiple issues.'
    )
  }
  nextSteps.push('Revisit this assessment in 90 days to track whether your Business Health scores have improved.')
  nextSteps.push('Speak with a BEI advisor to move from this preliminary read to a fully verified constraint analysis.')

  return {
    likelyConstraint,
    secondaryConstraints,
    pillarScores,
    overallHealth,
    opportunityRangeLow,
    opportunityRangeHigh,
    nextSteps,
  }
}
