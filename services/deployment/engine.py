"""
BEI Deployment Engine — Phase 10
Converts approved opportunities into executed actions.
Aligned with BEI Master Architecture Section 10 — Deployment Engine.
Aligned with BEI Master Context Section 19, 20 — Deployment Philosophy.

Three deployment tiers:
  Tier 1: Automatic — BEI executes without approval
  Tier 2: Approval-Based — BEI prepares, user approves, BEI executes
  Tier 3: Recommendation — Human execution, BEI guides

Golden Rule 5: Opportunity Before Deployment.
Golden Rule 6: Approval Before Execution.
Golden Rule 9: Business Impact Over Activity.
Golden Rule 10: Every Decision Must Be Explainable.
Golden Rule 12: Every Deployment Must Be Measurable.

MVP 1 Deployment Scope:
  Allowed: CRM, Lead Routing, Tasks, Notifications, Reviews,
           Trust Systems, SEO Content, Content Publishing,
           Internal Linking, Reporting, Monitoring
  Never auto-deploy: Pricing, Staffing, Management, Strategic decisions
"""

from typing import Any
import uuid


# ============================================================
# DEPLOYMENT CATALOGUE
# Defines all available deployments per constraint.
# Each constraint maps to one or more deployment packages
# across the three tiers.
# ============================================================

DEPLOYMENT_CATALOGUE = {

    "trust_infrastructure_deficit": [
        {
            "tier": 1,
            "tier_name": "Automatic",
            "action_type": "review_system",
            "action_title": "Activate Automated Review Request System",
            "action_description": (
                "Automatically configure a post-service review request sequence. "
                "Every completed client interaction triggers a review request "
                "via email and SMS within 24 hours."
            ),
            "implementation_steps": [
                "Configure review request trigger in CRM on deal completion",
                "Set up email template: 'How did we do? Leave us a review'",
                "Set up SMS follow-up 48 hours after email if no response",
                "Link directly to Google Business Profile review page",
                "Set monthly review count reporting",
            ],
            "expected_outcome": (
                "Minimum 2 new Google reviews per month within 90 days. "
                "Google rating maintained above 4.5 stars."
            ),
            "measurement_plan": (
                "Track: review count monthly, average rating monthly, "
                "conversion rate before and after 90 days."
            ),
            "requires_approval": False,
            "rollback_plan": "Disable review request automation in CRM. No data loss.",
        },
        {
            "tier": 2,
            "tier_name": "Approval-Based",
            "action_type": "trust_infrastructure",
            "action_title": "Build Trust and Social Proof Page",
            "action_description": (
                "Prepare and publish a dedicated trust page featuring client "
                "case studies, testimonials, results and credentials. "
                "Requires approval before publishing."
            ),
            "implementation_steps": [
                "Draft template for 3 client case studies",
                "Prepare testimonial request emails for top 5 clients",
                "Build trust page structure with results and credentials",
                "SEO optimise page for '[service] + [location] + reviews'",
                "Submit for approval before publishing",
            ],
            "expected_outcome": (
                "Trust page live within 30 days. "
                "Measurable improvement in enquiry-to-booking conversion rate."
            ),
            "measurement_plan": (
                "Track: trust page traffic, time on page, "
                "conversion rate from trust page visitors."
            ),
            "requires_approval": True,
            "rollback_plan": "Unpublish trust page. Revert to previous site structure.",
        },
        {
            "tier": 3,
            "tier_name": "Recommendation",
            "action_type": "content_strategy",
            "action_title": "Content and PR Trust Strategy",
            "action_description": (
                "Strategic recommendation to build long-term authority and trust "
                "through content marketing, PR and thought leadership. "
                "Human execution required."
            ),
            "implementation_steps": [
                "Identify 3 industry publications for guest articles",
                "Develop 90-day content calendar around expertise topics",
                "Submit to relevant industry award programmes",
                "Build LinkedIn thought leadership posting schedule",
            ],
            "expected_outcome": "Measurable improvement in brand authority within 6 months.",
            "measurement_plan": "Track: organic traffic, mentions, inbound enquiry quality.",
            "requires_approval": False,
            "rollback_plan": "N/A — recommendation only.",
        },
    ],

    "lead_response_deficit": [
        {
            "tier": 1,
            "tier_name": "Automatic",
            "action_type": "lead_routing",
            "action_title": "Configure Instant Lead Routing and Alert System",
            "action_description": (
                "Automatically configure CRM lead routing so every new enquiry "
                "triggers an immediate alert to the assigned team member "
                "with a 1-hour response SLA."
            ),
            "implementation_steps": [
                "Set up CRM lead routing rules by source and type",
                "Configure instant email and SMS alert on new lead",
                "Set 1-hour response SLA with escalation if not actioned",
                "Create lead response dashboard showing average response time",
                "Configure weekly response time report",
            ],
            "expected_outcome": (
                "Average lead response time under 1 hour within 30 days. "
                "Conversion rate improvement measurable within 90 days."
            ),
            "measurement_plan": (
                "Track: average response time daily, "
                "leads responded to within 1 hour as percentage, "
                "conversion rate monthly."
            ),
            "requires_approval": False,
            "rollback_plan": "Remove routing rules. Revert to manual lead management.",
        },
        {
            "tier": 2,
            "tier_name": "Approval-Based",
            "action_type": "crm_config",
            "action_title": "Build Lead Nurture Sequence",
            "action_description": (
                "Prepare a structured lead nurture sequence for leads that "
                "do not convert immediately. Multi-touch follow-up over 30 days. "
                "Requires approval before activation."
            ),
            "implementation_steps": [
                "Map current lead journey from enquiry to conversion",
                "Design 6-touch nurture sequence: day 1, 3, 7, 14, 21, 30",
                "Write email templates for each touch",
                "Configure CRM automation for sequence",
                "Submit for approval before activating",
            ],
            "expected_outcome": "5-10% improvement in lead-to-client conversion within 90 days.",
            "measurement_plan": "Track: sequence open rates, reply rates, conversion from sequence.",
            "requires_approval": True,
            "rollback_plan": "Disable nurture sequence automation. No data loss.",
        },
    ],

    "capacity_constraint": [
        {
            "tier": 2,
            "tier_name": "Approval-Based",
            "action_type": "reporting",
            "action_title": "Build Capacity Monitoring Dashboard",
            "action_description": (
                "Prepare a real-time capacity dashboard showing team utilisation, "
                "pipeline load and capacity headroom. "
                "Requires approval before deployment."
            ),
            "implementation_steps": [
                "Map all active client work to team members in CRM",
                "Set capacity thresholds per team member",
                "Build dashboard showing utilisation vs capacity",
                "Configure weekly capacity report to leadership",
                "Submit for approval before deploying",
            ],
            "expected_outcome": "Full visibility of capacity within 14 days.",
            "measurement_plan": "Track: team utilisation weekly, pipeline vs capacity ratio.",
            "requires_approval": True,
            "rollback_plan": "Remove dashboard. No operational impact.",
        },
        {
            "tier": 3,
            "tier_name": "Recommendation",
            "action_type": "staffing",
            "action_title": "Capacity Growth Plan",
            "action_description": (
                "Strategic recommendation to resolve capacity constraint through "
                "hiring, offshoring or process automation. Human decision required."
            ),
            "implementation_steps": [
                "Audit current delivery process for automation opportunities",
                "Calculate cost of hiring vs cost of lost revenue",
                "Define role profile for first hire",
                "Build business case for capacity investment",
            ],
            "expected_outcome": "Capacity growth plan ready for decision within 30 days.",
            "measurement_plan": "Track: revenue per team member, capacity utilisation trend.",
            "requires_approval": False,
            "rollback_plan": "N/A — recommendation only.",
        },
    ],

    "founder_dependency": [
        {
            "tier": 2,
            "tier_name": "Approval-Based",
            "action_type": "tasks",
            "action_title": "Build Delegation and Handover Framework",
            "action_description": (
                "Prepare a structured delegation framework identifying the top 5 "
                "tasks currently dependent on the founder with clear handover plans. "
                "Requires approval before implementation."
            ),
            "implementation_steps": [
                "Audit founder's weekly activities for the last 30 days",
                "Identify top 5 tasks that could be delegated",
                "Document each task as a standard operating procedure",
                "Identify team member for each delegation",
                "Build 30-day handover plan with checkpoints",
                "Submit for approval before starting handovers",
            ],
            "expected_outcome": (
                "Founder free from at least 3 key tasks within 60 days. "
                "Business operates normally during 5-day founder absence within 90 days."
            ),
            "measurement_plan": (
                "Track: founder hours in business weekly, "
                "tasks completed without founder involvement, "
                "test: 5-day absence within 90 days."
            ),
            "requires_approval": True,
            "rollback_plan": "Revert delegated tasks to founder. No data loss.",
        },
        {
            "tier": 3,
            "tier_name": "Recommendation",
            "action_type": "management",
            "action_title": "Organisational Structure Redesign",
            "action_description": (
                "Strategic recommendation to redesign the organisational structure "
                "to reduce founder dependency at a systemic level. "
                "Human execution required."
            ),
            "implementation_steps": [
                "Map current decision-making responsibilities",
                "Design target organisational structure",
                "Identify leadership gaps",
                "Build hiring and development plan",
                "Create 12-month transition roadmap",
            ],
            "expected_outcome": "Organisational design ready for implementation within 60 days.",
            "measurement_plan": "Track: founder dependency score quarterly.",
            "requires_approval": False,
            "rollback_plan": "N/A — recommendation only.",
        },
    ],

    "revenue_concentration_risk": [
        {
            "tier": 2,
            "tier_name": "Approval-Based",
            "action_type": "reporting",
            "action_title": "Client Concentration Risk Dashboard",
            "action_description": (
                "Build a real-time revenue concentration dashboard showing "
                "revenue by client with concentration risk alerts. "
                "Requires approval before deployment."
            ),
            "implementation_steps": [
                "Map all revenue by client in CRM",
                "Set concentration alert at 20% threshold",
                "Build monthly revenue concentration report",
                "Configure alert when any client exceeds 25% of revenue",
                "Submit for approval",
            ],
            "expected_outcome": "Full visibility of concentration risk within 14 days.",
            "measurement_plan": "Track: revenue concentration ratio monthly.",
            "requires_approval": True,
            "rollback_plan": "Remove dashboard. No operational impact.",
        },
        {
            "tier": 3,
            "tier_name": "Recommendation",
            "action_type": "strategic",
            "action_title": "Client Diversification Strategy",
            "action_description": (
                "Strategic recommendation to actively reduce revenue concentration "
                "through targeted new business development. Human execution required."
            ),
            "implementation_steps": [
                "Set diversification target: no client above 20% of revenue",
                "Identify 10 target new clients in underrepresented segments",
                "Build outreach campaign for diversification targets",
                "Set quarterly diversification progress review",
            ],
            "expected_outcome": "Revenue concentration reduced below 40% for top client within 12 months.",
            "measurement_plan": "Track: revenue concentration ratio quarterly.",
            "requires_approval": False,
            "rollback_plan": "N/A — recommendation only.",
        },
    ],

    "offer_weakness": [
        {
            "tier": 2,
            "tier_name": "Approval-Based",
            "action_type": "seo_content",
            "action_title": "Rebuild Core Offer Page and SEO Content",
            "action_description": (
                "Prepare a complete rewrite of the core offer page with clear "
                "positioning, benefits and proof points. SEO optimised. "
                "Requires approval before publishing."
            ),
            "implementation_steps": [
                "Audit current offer page against clarity framework",
                "Research top 5 keywords for offer positioning",
                "Rewrite page: problem, solution, proof, CTA structure",
                "A/B test headline with current version",
                "Submit for approval before publishing",
            ],
            "expected_outcome": (
                "Offer page conversion rate improvement within 60 days. "
                "Organic visibility improvement within 90 days."
            ),
            "measurement_plan": "Track: page conversion rate, organic traffic, bounce rate.",
            "requires_approval": True,
            "rollback_plan": "Revert to previous offer page. No data loss.",
        },
        {
            "tier": 3,
            "tier_name": "Recommendation",
            "action_type": "strategic",
            "action_title": "Offer Repositioning Strategy",
            "action_description": (
                "Strategic recommendation to reposition the core offer for "
                "stronger market differentiation. Human execution required."
            ),
            "implementation_steps": [
                "Complete competitive positioning analysis",
                "Identify unique value proposition elements",
                "Test new positioning with 10 existing clients",
                "Develop repositioned offer narrative",
            ],
            "expected_outcome": "Repositioned offer ready for testing within 45 days.",
            "measurement_plan": "Track: enquiry quality, conversion rate, average deal value.",
            "requires_approval": False,
            "rollback_plan": "N/A — recommendation only.",
        },
    ],

    "pricing_constraint": [
        {
            "tier": 3,
            "tier_name": "Recommendation",
            "action_type": "pricing",
            "action_title": "Pricing Audit and Strategy",
            "action_description": (
                "Strategic recommendation to conduct a full pricing audit and "
                "develop a confident pricing strategy. Human execution required. "
                "Pricing changes are never auto-deployed."
            ),
            "implementation_steps": [
                "Audit current pricing vs market rates",
                "Calculate true cost of delivery per service line",
                "Test 10-15% price increase with new enquiries only",
                "Monitor conversion rate at new price point for 30 days",
                "Review and set pricing strategy based on results",
            ],
            "expected_outcome": "Pricing strategy in place within 60 days.",
            "measurement_plan": "Track: average deal value, margin per service line, conversion rate.",
            "requires_approval": False,
            "rollback_plan": "N/A — recommendation only.",
        },
    ],

    "staffing_inefficiency": [
        {
            "tier": 3,
            "tier_name": "Recommendation",
            "action_type": "process",
            "action_title": "Delivery Process Audit",
            "action_description": (
                "Strategic recommendation to audit the delivery process and "
                "identify where time is being wasted. Human execution required."
            ),
            "implementation_steps": [
                "Time-track all delivery activities for 2 weeks",
                "Identify top 3 time sinks in delivery",
                "Research automation tools for repetitive tasks",
                "Build business case for process investment",
                "Implement top automation quick win",
            ],
            "expected_outcome": "20% reduction in delivery time per client within 90 days.",
            "measurement_plan": "Track: hours per client delivery, revenue per team member.",
            "requires_approval": False,
            "rollback_plan": "N/A — recommendation only.",
        },
    ],

    "management_bottleneck": [
        {
            "tier": 3,
            "tier_name": "Recommendation",
            "action_type": "management",
            "action_title": "Management Framework and Decision Authority",
            "action_description": (
                "Strategic recommendation to build a management framework that "
                "removes the bottleneck. Human execution required."
            ),
            "implementation_steps": [
                "Map all decisions that currently require management approval",
                "Classify: decisions that can be delegated immediately",
                "Build decision authority matrix",
                "Run team workshop on decision framework",
                "Review after 30 days",
            ],
            "expected_outcome": "Management response time reduced by 50% within 60 days.",
            "measurement_plan": "Track: decisions made without escalation, delivery turnaround time.",
            "requires_approval": False,
            "rollback_plan": "N/A — recommendation only.",
        },
    ],

    "market_selection_risk": [
        {
            "tier": 3,
            "tier_name": "Recommendation",
            "action_type": "strategic",
            "action_title": "Market Position and Adjacent Market Strategy",
            "action_description": (
                "Strategic recommendation to identify defensible positioning "
                "within a declining market or adjacent market opportunities. "
                "Human execution required."
            ),
            "implementation_steps": [
                "Analyse market decline rate and trajectory",
                "Identify defensible niche within current market",
                "Research 3 adjacent market opportunities",
                "Build business case for market pivot or niche focus",
                "Present to leadership for decision",
            ],
            "expected_outcome": "Market strategy decision made within 90 days.",
            "measurement_plan": "Track: revenue from target market segment, market share trend.",
            "requires_approval": False,
            "rollback_plan": "N/A — recommendation only.",
        },
    ],

    # ---------- Batch 7.1 (Finance) ----------
    "weak_gross_margin": [
        {
            "tier": 1,
            "tier_name": "Automatic",
            "action_type": "margin_monitoring",
            "action_title": "Activate Gross Margin Monitoring & Alerts",
            "action_description": (
                "Automatically track gross margin monthly against the industry "
                "benchmark and the business's own historical baseline. "
                "Trigger an alert if margin drops below the threshold or "
                "declines for two consecutive months."
            ),
            "implementation_steps": [
                "Pull monthly revenue and COGS from connected financial data",
                "Calculate gross margin % monthly",
                "Compare against industry benchmark and 12-month rolling average",
                "Trigger alert on breach of threshold or 2-month consecutive decline",
                "Log margin trend to the Business Twin for the Learning Engine",
            ],
            "expected_outcome": (
                "Margin deterioration is flagged within 30 days of occurring, "
                "rather than discovered at year-end."
            ),
            "measurement_plan": (
                "Track: gross margin % monthly, variance vs benchmark, "
                "time-to-alert from first deterioration."
            ),
            "requires_approval": False,
            "rollback_plan": "Disable margin monitoring alerts. No data loss; historical tracking remains.",
        },
        {
            "tier": 3,
            "tier_name": "Recommendation",
            "action_type": "margin_restructuring",
            "action_title": "Gross Margin Improvement Plan",
            "action_description": (
                "BEI prepares a structured margin diagnosis — pricing position, "
                "input cost trends, and service/product mix — and a prioritised "
                "set of margin-improvement options for the owner to evaluate "
                "and execute. Human judgement and negotiation required; "
                "not software-executable."
            ),
            "implementation_steps": [
                "Break down margin erosion by cost driver (COGS, labour, discounting)",
                "Benchmark pricing and costs against industry comparables",
                "Identify highest-impact, lowest-disruption improvement levers",
                "Present prioritised recommendations with estimated margin impact",
                "Owner reviews and decides which actions to pursue",
            ],
            "expected_outcome": (
                "Owner has a clear, evidenced set of options to close the "
                "margin gap, ranked by expected impact and difficulty."
            ),
            "measurement_plan": (
                "Track: gross margin % at 90/180 days post-recommendation "
                "vs. the plan's projected improvement."
            ),
            "requires_approval": True,
            "rollback_plan": "No system changes are made automatically; nothing to roll back.",
        },
    ],

    "profitability_erosion": [
        {
            "tier": 1,
            "tier_name": "Automatic",
            "action_type": "profitability_monitoring",
            "action_title": "Activate Profitability Trend Monitoring",
            "action_description": (
                "Automatically track net/operating profit trend monthly, "
                "isolating whether erosion is revenue-driven, cost-driven, "
                "or both, and alert on sustained decline."
            ),
            "implementation_steps": [
                "Pull monthly revenue, COGS, and operating expense data",
                "Calculate operating margin trend over trailing 6 months",
                "Decompose trend into revenue vs. cost contribution",
                "Trigger alert on 2+ consecutive months of margin decline",
                "Log profitability trend to the Business Twin",
            ],
            "expected_outcome": (
                "Profitability erosion is identified and attributed to a "
                "cause (revenue or cost) within 30 days of onset."
            ),
            "measurement_plan": (
                "Track: operating margin % monthly, erosion attribution accuracy, "
                "time-to-alert."
            ),
            "requires_approval": False,
            "rollback_plan": "Disable profitability monitoring alerts. No data loss.",
        },
        {
            "tier": 3,
            "tier_name": "Recommendation",
            "action_type": "profitability_recovery_plan",
            "action_title": "Profitability Recovery Plan",
            "action_description": (
                "BEI prepares a diagnosis of whether erosion is structural "
                "(pricing, cost base) or cyclical (one-off cost spike, "
                "temporary revenue dip), with recommended corrective actions. "
                "Requires owner judgement and execution."
            ),
            "implementation_steps": [
                "Classify erosion as structural vs. cyclical using trend data",
                "Identify largest controllable cost and revenue levers",
                "Model the profit impact of 2-3 corrective scenarios",
                "Present recommendations ranked by impact and risk",
                "Owner reviews and decides on execution",
            ],
            "expected_outcome": (
                "Owner has an evidenced view of why profitability is eroding "
                "and a ranked set of corrective options."
            ),
            "measurement_plan": (
                "Track: operating margin % at 90/180 days vs. pre-erosion baseline."
            ),
            "requires_approval": True,
            "rollback_plan": "No system changes are made automatically; nothing to roll back.",
        },
    ],

    "cash_runway_risk": [
        {
            "tier": 1,
            "tier_name": "Automatic",
            "action_type": "runway_monitoring",
            "action_title": "Activate Cash Runway Monitoring & Early Warning",
            "action_description": (
                "Automatically calculate cash runway monthly from current cash "
                "position and trailing burn rate, and trigger an escalating "
                "alert as runway shortens below safe thresholds."
            ),
            "implementation_steps": [
                "Pull current cash position and monthly burn rate",
                "Calculate runway in months (cash / average monthly burn)",
                "Set alert thresholds (e.g. <6 months, <3 months)",
                "Trigger escalating alert as runway crosses each threshold",
                "Log runway trend to the Business Twin",
            ],
            "expected_outcome": (
                "Owner has continuous visibility of runway with no more than "
                "a 30-day lag, and an early warning before the position becomes critical."
            ),
            "measurement_plan": (
                "Track: runway in months monthly, alert lead time before "
                "critical threshold, false-alarm rate."
            ),
            "requires_approval": False,
            "rollback_plan": "Disable runway monitoring alerts. No data loss.",
        },
        {
            "tier": 3,
            "tier_name": "Recommendation",
            "action_type": "cash_preservation_plan",
            "action_title": "Cash Runway Extension Plan",
            "action_description": (
                "BEI prepares a structured options analysis for extending "
                "runway — cost reduction, collections acceleration, financing, "
                "or revenue actions — with estimated impact on runway. "
                "Financial and legal judgement required; not software-executable."
            ),
            "implementation_steps": [
                "Identify largest near-term controllable cash levers (cost, collections)",
                "Estimate runway extension from each lever in isolation and combined",
                "Flag any financing or facility options worth exploring",
                "Present ranked options with estimated runway impact and risk",
                "Owner reviews and decides which actions to pursue",
            ],
            "expected_outcome": (
                "Owner has a clear, evidenced set of options to extend runway "
                "before the position becomes critical, ranked by impact and speed."
            ),
            "measurement_plan": (
                "Track: runway in months at 30/60/90 days post-recommendation "
                "vs. the plan's projected extension."
            ),
            "requires_approval": True,
            "rollback_plan": "No system changes are made automatically; nothing to roll back.",
        },
    ],

    # ---------- Batch 7.2 (Finance) ----------
    "unfavourable_cac_ltv_ratio": [
        {
            "tier": 1,
            "tier_name": "Automatic",
            "action_type": "cac_ltv_monitoring",
            "action_title": "Activate CAC:LTV Ratio Monitoring",
            "action_description": (
                "Automatically calculate customer acquisition cost and lifetime "
                "value monthly, track the ratio against the healthy benchmark "
                "(typically 3:1 or better), and alert on sustained deterioration."
            ),
            "implementation_steps": [
                "Pull monthly marketing/sales spend and new customer count for CAC",
                "Pull average customer revenue and retention/churn data for LTV",
                "Calculate CAC:LTV ratio monthly",
                "Compare against 3:1 benchmark and trailing 6-month trend",
                "Trigger alert if ratio falls below 3:1 or trends downward 2+ months",
            ],
            "expected_outcome": (
                "CAC:LTV deterioration is flagged within 30 days, with visibility "
                "into whether CAC or LTV is the driver."
            ),
            "measurement_plan": (
                "Track: CAC:LTV ratio monthly, CAC trend, LTV trend, "
                "time-to-alert from first deterioration."
            ),
            "requires_approval": False,
            "rollback_plan": "Disable CAC:LTV monitoring alerts. No data loss.",
        },
        {
            "tier": 2,
            "tier_name": "Approval-Based",
            "action_type": "retention_lifecycle_system",
            "action_title": "Build Customer Retention & Lifecycle Sequence",
            "action_description": (
                "Prepare and activate an automated lifecycle sequence "
                "(onboarding, engagement check-ins, renewal/repeat-purchase "
                "prompts) aimed at lifting LTV by improving retention and "
                "repeat revenue. Requires approval before activating."
            ),
            "implementation_steps": [
                "Map current customer lifecycle and identify the highest-churn stage",
                "Draft onboarding sequence to improve early retention",
                "Draft mid-lifecycle engagement/check-in sequence",
                "Draft renewal or repeat-purchase prompt sequence",
                "Submit for approval before activating in CRM/email platform",
            ],
            "expected_outcome": (
                "Lifecycle sequence live within 30 days. Measurable improvement "
                "in retention rate and repeat revenue within 90 days."
            ),
            "measurement_plan": (
                "Track: retention rate, repeat purchase rate, LTV, "
                "CAC:LTV ratio at 90/180 days post-activation."
            ),
            "requires_approval": True,
            "rollback_plan": "Deactivate lifecycle sequence. Revert to previous customer communication flow.",
        },
        {
            "tier": 3,
            "tier_name": "Recommendation",
            "action_type": "acquisition_efficiency_plan",
            "action_title": "CAC Reduction & Channel Efficiency Plan",
            "action_description": (
                "BEI prepares a diagnosis of acquisition cost drivers by "
                "channel and a prioritised set of options to reduce CAC "
                "(channel mix, targeting, conversion funnel). Requires "
                "owner judgement on budget reallocation and execution."
            ),
            "implementation_steps": [
                "Break down CAC by acquisition channel",
                "Identify highest-cost, lowest-efficiency channels",
                "Benchmark channel performance against industry comparables",
                "Present prioritised reallocation/efficiency recommendations",
                "Owner reviews and decides which actions to pursue",
            ],
            "expected_outcome": (
                "Owner has an evidenced view of where acquisition spend is "
                "inefficient and a ranked set of options to reduce CAC."
            ),
            "measurement_plan": (
                "Track: CAC by channel, blended CAC, CAC:LTV ratio "
                "at 90/180 days post-recommendation."
            ),
            "requires_approval": True,
            "rollback_plan": "No system changes are made automatically; nothing to roll back.",
        },
    ],

    "excessive_leverage": [
        {
            "tier": 1,
            "tier_name": "Automatic",
            "action_type": "leverage_monitoring",
            "action_title": "Activate Debt & Leverage Ratio Monitoring",
            "action_description": (
                "Automatically track total debt relative to revenue/EBITDA "
                "monthly and alert if leverage exceeds the healthy threshold "
                "or trends upward over consecutive periods."
            ),
            "implementation_steps": [
                "Pull total debt obligations and monthly revenue/EBITDA data",
                "Calculate debt-to-revenue and debt-to-EBITDA ratios monthly",
                "Compare against industry-appropriate leverage threshold",
                "Trigger alert on threshold breach or 2+ month upward trend",
                "Log leverage trend to the Business Twin",
            ],
            "expected_outcome": (
                "Rising leverage risk is flagged within 30 days of occurring, "
                "before it constrains financing options or covenant headroom."
            ),
            "measurement_plan": (
                "Track: debt-to-revenue ratio monthly, debt-to-EBITDA ratio monthly, "
                "time-to-alert from threshold breach."
            ),
            "requires_approval": False,
            "rollback_plan": "Disable leverage monitoring alerts. No data loss.",
        },
        {
            "tier": 3,
            "tier_name": "Recommendation",
            "action_type": "debt_restructuring_plan",
            "action_title": "Leverage Reduction & Debt Structuring Plan",
            "action_description": (
                "BEI prepares a diagnosis of the debt structure and a "
                "prioritised set of options to reduce leverage or improve "
                "terms (refinancing, paydown sequencing, covenant review). "
                "Financial and legal judgement required; not software-executable."
            ),
            "implementation_steps": [
                "Map current debt structure: facility, rate, maturity, covenants",
                "Identify highest-cost or highest-risk obligations",
                "Model impact of paydown, refinancing, or restructuring options",
                "Present ranked options with estimated leverage and cost impact",
                "Owner reviews and decides which actions to pursue",
            ],
            "expected_outcome": (
                "Owner has a clear, evidenced set of options to reduce leverage "
                "risk, ranked by impact and feasibility."
            ),
            "measurement_plan": (
                "Track: debt-to-revenue and debt-to-EBITDA ratios at "
                "90/180 days post-recommendation vs. the plan's projection."
            ),
            "requires_approval": True,
            "rollback_plan": "No system changes are made automatically; nothing to roll back.",
        },
    ],

    "revenue_growth_stagnation": [
        {
            "tier": 1,
            "tier_name": "Automatic",
            "action_type": "growth_monitoring",
            "action_title": "Activate Revenue Growth Trend Monitoring",
            "action_description": (
                "Automatically track revenue growth rate monthly against the "
                "business's historical trend and industry benchmark, and "
                "alert on sustained stagnation or deceleration."
            ),
            "implementation_steps": [
                "Pull monthly revenue data",
                "Calculate trailing 3/6/12-month growth rate",
                "Compare against historical growth trend and industry benchmark",
                "Trigger alert on 2+ consecutive periods of deceleration or flat growth",
                "Log growth trend to the Business Twin",
            ],
            "expected_outcome": (
                "Growth stagnation is flagged within 30 days of onset, "
                "rather than discovered at year-end review."
            ),
            "measurement_plan": (
                "Track: revenue growth rate monthly, variance vs. historical trend "
                "and benchmark, time-to-alert."
            ),
            "requires_approval": False,
            "rollback_plan": "Disable growth monitoring alerts. No data loss.",
        },
        {
            "tier": 3,
            "tier_name": "Recommendation",
            "action_type": "growth_strategy_plan",
            "action_title": "Revenue Growth Re-Acceleration Plan",
            "action_description": (
                "BEI prepares a diagnosis of where growth has stalled "
                "(new business, expansion, retention, market saturation) "
                "and a prioritised set of growth levers. Strategic judgement "
                "and execution required; not software-executable."
            ),
            "implementation_steps": [
                "Decompose revenue growth into new business, expansion, and retention",
                "Identify which component is driving the stagnation",
                "Benchmark growth drivers against industry comparables",
                "Present prioritised growth levers ranked by impact and feasibility",
                "Owner reviews and decides which actions to pursue",
            ],
            "expected_outcome": (
                "Owner has an evidenced view of why growth has stalled and a "
                "ranked set of options to re-accelerate it."
            ),
            "measurement_plan": (
                "Track: revenue growth rate at 90/180 days vs. pre-stagnation baseline."
            ),
            "requires_approval": True,
            "rollback_plan": "No system changes are made automatically; nothing to roll back.",
        },
    ],

    # ---------- Batch 7.3 (Sales/Pipeline) ----------
    "pipeline_coverage_gap": [
        {
            "tier": 1,
            "tier_name": "Automatic",
            "action_type": "pipeline_monitoring",
            "action_title": "Activate Pipeline Coverage Monitoring",
            "action_description": (
                "Automatically calculate pipeline coverage ratio (open pipeline "
                "value vs. revenue target) monthly and alert when coverage "
                "falls below the healthy threshold (typically 3x target)."
            ),
            "implementation_steps": [
                "Pull open pipeline value and revenue target from CRM",
                "Calculate pipeline coverage ratio monthly",
                "Compare against 3x target benchmark",
                "Trigger alert on breach or declining trend over 2+ months",
                "Log coverage trend to the Business Twin",
            ],
            "expected_outcome": (
                "Coverage shortfalls are flagged within 30 days, before they "
                "translate into a revenue miss."
            ),
            "measurement_plan": (
                "Track: pipeline coverage ratio monthly, time-to-alert from "
                "first breach."
            ),
            "requires_approval": False,
            "rollback_plan": "Disable pipeline coverage alerts. No data loss.",
        },
        {
            "tier": 2,
            "tier_name": "Approval-Based",
            "action_type": "outbound_prospecting_sequence",
            "action_title": "Build Outbound Pipeline-Generation Sequence",
            "action_description": (
                "Prepare and activate an outbound prospecting sequence "
                "(targeted outreach, follow-up cadence) to rebuild pipeline "
                "coverage. Requires approval before activating."
            ),
            "implementation_steps": [
                "Identify target segment with strongest historical conversion",
                "Draft multi-touch outbound sequence (email/call/LinkedIn)",
                "Set follow-up cadence and qualification criteria",
                "Submit for approval before activating in CRM/outreach tool",
                "Track new opportunities generated by the sequence",
            ],
            "expected_outcome": (
                "Pipeline coverage ratio returns above 3x target within 90 days."
            ),
            "measurement_plan": (
                "Track: new pipeline value generated, coverage ratio at "
                "30/60/90 days post-activation."
            ),
            "requires_approval": True,
            "rollback_plan": "Deactivate outbound sequence. Revert to previous outreach process.",
        },
    ],

    "long_sales_cycle": [
        {
            "tier": 1,
            "tier_name": "Automatic",
            "action_type": "sales_cycle_monitoring",
            "action_title": "Activate Sales Cycle Length Monitoring",
            "action_description": (
                "Automatically track average sales cycle length monthly "
                "against the industry benchmark and the business's own "
                "historical baseline, and alert on sustained lengthening."
            ),
            "implementation_steps": [
                "Pull deal creation and close dates from CRM",
                "Calculate average sales cycle length monthly (rolling 90 days)",
                "Compare against historical baseline and industry benchmark",
                "Trigger alert on 2+ consecutive months of lengthening",
                "Log cycle trend to the Business Twin",
            ],
            "expected_outcome": (
                "Cycle lengthening is flagged within 30 days, before it "
                "compounds into a pipeline coverage or cash flow problem."
            ),
            "measurement_plan": (
                "Track: average sales cycle length monthly, stage-by-stage "
                "duration, time-to-alert."
            ),
            "requires_approval": False,
            "rollback_plan": "Disable sales cycle monitoring alerts. No data loss.",
        },
        {
            "tier": 2,
            "tier_name": "Approval-Based",
            "action_type": "deal_acceleration_workflow",
            "action_title": "Build Deal Stage Follow-Up & Nurture Automation",
            "action_description": (
                "Prepare and activate automated follow-up sequences at each "
                "pipeline stage to reduce time-in-stage and prevent deals "
                "from stalling. Requires approval before activating."
            ),
            "implementation_steps": [
                "Identify the stage with the longest average dwell time",
                "Draft stage-specific follow-up sequence and task triggers",
                "Set automatic reminders for reps when a deal exceeds normal dwell time",
                "Submit for approval before activating in CRM",
                "Track stage dwell time before and after activation",
            ],
            "expected_outcome": (
                "Average sales cycle length reduced measurably within 90 days, "
                "with the longest-dwell stage shortened first."
            ),
            "measurement_plan": (
                "Track: average sales cycle length, stage dwell time, "
                "at 30/60/90 days post-activation."
            ),
            "requires_approval": True,
            "rollback_plan": "Deactivate follow-up automation. Revert to previous manual process.",
        },
    ],

    "client_churn_exceeds_growth": [
        {
            "tier": 1,
            "tier_name": "Automatic",
            "action_type": "churn_growth_monitoring",
            "action_title": "Activate Churn vs. Growth Rate Monitoring",
            "action_description": (
                "Automatically track client churn rate against new client "
                "growth rate monthly, and alert when churn exceeds growth "
                "(net client base shrinking)."
            ),
            "implementation_steps": [
                "Pull monthly client gain and loss data",
                "Calculate churn rate and growth rate monthly",
                "Compare churn rate against growth rate",
                "Trigger alert when churn exceeds growth for the period",
                "Log churn/growth trend to the Business Twin",
            ],
            "expected_outcome": (
                "Net client base shrinkage is flagged within 30 days of onset."
            ),
            "measurement_plan": (
                "Track: churn rate monthly, growth rate monthly, net client "
                "change, time-to-alert."
            ),
            "requires_approval": False,
            "rollback_plan": "Disable churn/growth monitoring alerts. No data loss.",
        },
        {
            "tier": 2,
            "tier_name": "Approval-Based",
            "action_type": "retention_winback_sequence",
            "action_title": "Build Client Retention & Win-Back Sequence",
            "action_description": (
                "Prepare and activate an at-risk-client check-in sequence "
                "and a win-back sequence for recently churned clients. "
                "Requires approval before activating."
            ),
            "implementation_steps": [
                "Identify churn risk signals (usage drop, support tickets, late payment)",
                "Draft proactive check-in sequence for at-risk clients",
                "Draft win-back offer sequence for clients churned in last 90 days",
                "Submit for approval before activating in CRM/email platform",
                "Track retained and recovered clients post-activation",
            ],
            "expected_outcome": (
                "Churn rate reduced and a measurable share of recently "
                "churned clients recovered within 90 days."
            ),
            "measurement_plan": (
                "Track: churn rate, win-back recovery rate, net client change "
                "at 30/60/90 days post-activation."
            ),
            "requires_approval": True,
            "rollback_plan": "Deactivate retention/win-back sequence. Revert to previous client communication flow.",
        },
    ],

    # ---------- Batch 7.4 (Sales/Pipeline, Pricing) ----------
    "low_win_rate": [
        {
            "tier": 1,
            "tier_name": "Automatic",
            "action_type": "win_rate_monitoring",
            "action_title": "Activate Win Rate Monitoring",
            "action_description": (
                "Automatically track proposal/quote win rate monthly against "
                "the industry benchmark and historical baseline, and alert "
                "on sustained decline."
            ),
            "implementation_steps": [
                "Pull proposal/quote outcomes (won/lost) from CRM",
                "Calculate win rate monthly (rolling 90 days)",
                "Compare against historical baseline and industry benchmark",
                "Trigger alert on 2+ consecutive months of decline",
                "Log win rate trend to the Business Twin",
            ],
            "expected_outcome": (
                "Win rate decline is flagged within 30 days, before it "
                "compounds into a revenue shortfall."
            ),
            "measurement_plan": (
                "Track: win rate monthly, variance vs. benchmark, time-to-alert."
            ),
            "requires_approval": False,
            "rollback_plan": "Disable win rate monitoring alerts. No data loss.",
        },
        {
            "tier": 2,
            "tier_name": "Approval-Based",
            "action_type": "proposal_followup_system",
            "action_title": "Build Proposal Follow-Up & Objection-Handling Sequence",
            "action_description": (
                "Prepare and activate a structured follow-up sequence for "
                "outstanding proposals, including timed check-ins and "
                "common-objection responses. Requires approval before activating."
            ),
            "implementation_steps": [
                "Review lost-deal reasons from CRM to identify top objections",
                "Draft a timed follow-up cadence for outstanding proposals",
                "Draft response templates for the most common objections",
                "Submit for approval before activating in CRM",
                "Track win rate on proposals using the new sequence",
            ],
            "expected_outcome": (
                "Win rate improves measurably within 90 days of activation."
            ),
            "measurement_plan": (
                "Track: win rate, proposal follow-up response rate, "
                "at 30/60/90 days post-activation."
            ),
            "requires_approval": True,
            "rollback_plan": "Deactivate follow-up sequence. Revert to previous proposal process.",
        },
    ],

    "expansion_revenue_shortfall": [
        {
            "tier": 1,
            "tier_name": "Automatic",
            "action_type": "expansion_monitoring",
            "action_title": "Activate Expansion Revenue Monitoring",
            "action_description": (
                "Automatically track expansion revenue (upsell/cross-sell) "
                "as a share of total revenue monthly against benchmark, "
                "and alert on sustained shortfall."
            ),
            "implementation_steps": [
                "Pull existing-client revenue change data monthly",
                "Calculate expansion revenue as % of total revenue",
                "Compare against industry benchmark and historical baseline",
                "Trigger alert on shortfall or 2+ month declining trend",
                "Log expansion trend to the Business Twin",
            ],
            "expected_outcome": (
                "Expansion revenue shortfall is flagged within 30 days of onset."
            ),
            "measurement_plan": (
                "Track: expansion revenue % monthly, variance vs. benchmark, "
                "time-to-alert."
            ),
            "requires_approval": False,
            "rollback_plan": "Disable expansion monitoring alerts. No data loss.",
        },
        {
            "tier": 2,
            "tier_name": "Approval-Based",
            "action_type": "upsell_crosssell_sequence",
            "action_title": "Build Upsell & Cross-Sell Outreach Sequence",
            "action_description": (
                "Prepare and activate a targeted upsell/cross-sell sequence "
                "for existing clients based on usage and fit signals. "
                "Requires approval before activating."
            ),
            "implementation_steps": [
                "Identify existing clients with strongest upsell/cross-sell fit",
                "Draft targeted outreach sequence highlighting relevant add-ons",
                "Set timing triggers (e.g. usage milestone, renewal window)",
                "Submit for approval before activating in CRM/email platform",
                "Track expansion revenue generated by the sequence",
            ],
            "expected_outcome": (
                "Expansion revenue as % of total revenue improves measurably "
                "within 90 days."
            ),
            "measurement_plan": (
                "Track: expansion revenue %, upsell conversion rate, "
                "at 30/60/90 days post-activation."
            ),
            "requires_approval": True,
            "rollback_plan": "Deactivate upsell/cross-sell sequence. Revert to previous account management process.",
        },
    ],

    "stale_pricing_position": [
        {
            "tier": 1,
            "tier_name": "Automatic",
            "action_type": "pricing_position_monitoring",
            "action_title": "Activate Pricing Position Monitoring",
            "action_description": (
                "Automatically track time since last competitive pricing "
                "review and flag when pricing position has not been "
                "reassessed against the market within a healthy interval."
            ),
            "implementation_steps": [
                "Track months since last documented pricing position review",
                "Compare against the 12-month threshold for reassessment",
                "Trigger alert when threshold is exceeded",
                "Log pricing review status to the Business Twin",
            ],
            "expected_outcome": (
                "Stale pricing position is flagged before it causes "
                "sustained margin or competitiveness erosion."
            ),
            "measurement_plan": (
                "Track: months since last pricing review, time-to-alert "
                "from threshold breach."
            ),
            "requires_approval": False,
            "rollback_plan": "Disable pricing position alerts. No data loss.",
        },
        {
            "tier": 3,
            "tier_name": "Recommendation",
            "action_type": "pricing_strategy_review",
            "action_title": "Pricing Position Review & Repositioning Plan",
            "action_description": (
                "BEI prepares a competitive pricing position analysis and a "
                "set of repositioning options. Pricing decisions require "
                "owner judgement and market context; not software-executable."
            ),
            "implementation_steps": [
                "Benchmark current pricing against industry comparables",
                "Identify any pricing-to-value misalignment",
                "Model impact of 2-3 repositioning scenarios",
                "Present ranked options with estimated margin and demand impact",
                "Owner reviews and decides which actions to pursue",
            ],
            "expected_outcome": (
                "Owner has an evidenced view of current pricing position and "
                "a ranked set of repositioning options."
            ),
            "measurement_plan": (
                "Track: gross margin and win rate at 90/180 days "
                "post-recommendation vs. pre-review baseline."
            ),
            "requires_approval": True,
            "rollback_plan": "No system changes are made automatically; nothing to roll back.",
        },
    ],

    # ---------- Batch 7.5 (Pricing, Operations/Process) ----------
    "stale_price_review": [
        {
            "tier": 1,
            "tier_name": "Automatic",
            "action_type": "price_review_monitoring",
            "action_title": "Activate Price Review Cadence Monitoring",
            "action_description": (
                "Automatically track time since the last formal price review "
                "and alert when the business has exceeded its review cadence."
            ),
            "implementation_steps": [
                "Track months since last documented price review",
                "Compare against the 12-month threshold",
                "Trigger alert when threshold is exceeded",
                "Log review cadence status to the Business Twin",
            ],
            "expected_outcome": (
                "Overdue price reviews are flagged before pricing drifts "
                "further from cost and market reality."
            ),
            "measurement_plan": (
                "Track: months since last price review, time-to-alert "
                "from threshold breach."
            ),
            "requires_approval": False,
            "rollback_plan": "Disable price review alerts. No data loss.",
        },
        {
            "tier": 3,
            "tier_name": "Recommendation",
            "action_type": "price_review_plan",
            "action_title": "Formal Price Review & Adjustment Plan",
            "action_description": (
                "BEI prepares a structured price review covering cost "
                "inflation, margin trend, and competitor movement, with "
                "recommended adjustments. Pricing decisions require owner "
                "judgement; not software-executable."
            ),
            "implementation_steps": [
                "Review cost base changes since last price review",
                "Review margin trend and competitor pricing movement",
                "Model impact of proposed price adjustments",
                "Present recommended adjustment with implementation timeline",
                "Owner reviews and decides on execution",
            ],
            "expected_outcome": (
                "Owner has an evidenced, current basis for a pricing decision, "
                "rather than acting on stale assumptions."
            ),
            "measurement_plan": (
                "Track: gross margin at 90/180 days post-recommendation "
                "vs. pre-review baseline."
            ),
            "requires_approval": True,
            "rollback_plan": "No system changes are made automatically; nothing to roll back.",
        },
    ],

    "low_process_documentation": [
        {
            "tier": 1,
            "tier_name": "Automatic",
            "action_type": "documentation_coverage_monitoring",
            "action_title": "Activate Process Documentation Coverage Monitoring",
            "action_description": (
                "Automatically track the share of core business processes "
                "with current, documented procedures and alert when "
                "coverage falls below a healthy threshold."
            ),
            "implementation_steps": [
                "Inventory core business processes from the Business Twin",
                "Track which have current documented procedures",
                "Calculate documentation coverage % monthly",
                "Trigger alert when coverage falls below threshold",
                "Log coverage trend to the Business Twin",
            ],
            "expected_outcome": (
                "Documentation gaps are visible on an ongoing basis rather "
                "than discovered during a crisis or staff departure."
            ),
            "measurement_plan": (
                "Track: documentation coverage % monthly, time-to-alert "
                "from threshold breach."
            ),
            "requires_approval": False,
            "rollback_plan": "Disable documentation coverage alerts. No data loss.",
        },
        {
            "tier": 2,
            "tier_name": "Approval-Based",
            "action_type": "sop_draft_generation",
            "action_title": "Draft Standard Operating Procedures for Undocumented Processes",
            "action_description": (
                "BEI drafts SOP templates for the highest-priority "
                "undocumented core processes, based on available process "
                "data. Requires owner/team review and approval before "
                "being adopted as official procedure."
            ),
            "implementation_steps": [
                "Identify the highest-risk undocumented processes (by usage/impact)",
                "Draft SOP structure and step sequence for each",
                "Flag sections needing subject-matter-expert input",
                "Submit drafts for approval and review",
                "Publish approved SOPs to the team knowledge base",
            ],
            "expected_outcome": (
                "Documentation coverage for the highest-priority processes "
                "reaches 100% within 60 days of approval."
            ),
            "measurement_plan": (
                "Track: documentation coverage %, SOP adoption rate, "
                "at 30/60 days post-approval."
            ),
            "requires_approval": True,
            "rollback_plan": "Unpublish draft SOPs. No operational changes were made.",
        },
    ],

    "low_automation_coverage": [
        {
            "tier": 1,
            "tier_name": "Automatic",
            "action_type": "automation_coverage_monitoring",
            "action_title": "Activate Automation Coverage Monitoring",
            "action_description": (
                "Automatically track the share of repeatable operational "
                "tasks currently automated and alert when coverage falls "
                "below a healthy threshold for the business's size and stage."
            ),
            "implementation_steps": [
                "Inventory repeatable operational tasks from the Business Twin",
                "Track which are currently automated vs. manual",
                "Calculate automation coverage % monthly",
                "Trigger alert when coverage falls below threshold",
                "Log coverage trend to the Business Twin",
            ],
            "expected_outcome": (
                "Automation gaps are visible on an ongoing basis, supporting "
                "a prioritised automation roadmap."
            ),
            "measurement_plan": (
                "Track: automation coverage % monthly, time-to-alert "
                "from threshold breach."
            ),
            "requires_approval": False,
            "rollback_plan": "Disable automation coverage alerts. No data loss.",
        },
        {
            "tier": 3,
            "tier_name": "Recommendation",
            "action_type": "automation_roadmap",
            "action_title": "Automation Opportunity Roadmap",
            "action_description": (
                "BEI prepares a prioritised list of manual, repeatable "
                "tasks best suited for automation, ranked by time saved "
                "and implementation difficulty. Tool selection and rollout "
                "require owner decision and execution."
            ),
            "implementation_steps": [
                "Identify highest-volume manual repeatable tasks",
                "Estimate time cost and automation feasibility for each",
                "Rank by expected time savings vs. implementation effort",
                "Present roadmap with suggested sequencing",
                "Owner reviews and decides which to pursue and how",
            ],
            "expected_outcome": (
                "Owner has a clear, prioritised automation roadmap rather "
                "than an ad hoc list of ideas."
            ),
            "measurement_plan": (
                "Track: automation coverage % at 90/180 days vs. "
                "pre-recommendation baseline."
            ),
            "requires_approval": True,
            "rollback_plan": "No system changes are made automatically; nothing to roll back.",
        },
    ],
    # ---------- Batch 7.6 (Operations/Process) ----------
    "low_operational_resilience": [
        {
            "tier": 1,
            "tier_name": "Automatic",
            "action_type": "resilience_monitoring",
            "action_title": "Activate Operational Resilience Monitoring",
            "action_description": (
                "Automatically track key resilience indicators (single "
                "points of failure, key-person dependencies, backup "
                "coverage) monthly and alert on deterioration."
            ),
            "implementation_steps": [
                "Pull resilience indicators from the Business Twin",
                "Calculate a composite resilience score monthly",
                "Compare against historical baseline",
                "Trigger alert on score decline",
                "Log resilience trend to the Business Twin",
            ],
            "expected_outcome": (
                "Resilience deterioration is flagged before a single point "
                "of failure causes a business disruption."
            ),
            "measurement_plan": (
                "Track: resilience score monthly, time-to-alert from decline."
            ),
            "requires_approval": False,
            "rollback_plan": "Disable resilience monitoring alerts. No data loss.",
        },
        {
            "tier": 3,
            "tier_name": "Recommendation",
            "action_type": "resilience_improvement_plan",
            "action_title": "Operational Resilience Improvement Plan",
            "action_description": (
                "BEI prepares a diagnosis of the business's key single "
                "points of failure and a prioritised set of mitigation "
                "options. Implementation requires owner judgement and "
                "often organisational change."
            ),
            "implementation_steps": [
                "Identify single points of failure (people, systems, suppliers)",
                "Assess likelihood and impact of each",
                "Identify mitigation options (cross-training, redundancy, backups)",
                "Present ranked recommendations by risk reduction and cost",
                "Owner reviews and decides which to pursue",
            ],
            "expected_outcome": (
                "Owner has a clear, evidenced view of the business's "
                "resilience gaps and a ranked mitigation plan."
            ),
            "measurement_plan": (
                "Track: resilience score at 90/180 days post-recommendation."
            ),
            "requires_approval": True,
            "rollback_plan": "No system changes are made automatically; nothing to roll back.",
        },
    ],

    "no_business_continuity_plan": [
        {
            "tier": 1,
            "tier_name": "Automatic",
            "action_type": "bcp_status_monitoring",
            "action_title": "Activate Business Continuity Plan Status Monitoring",
            "action_description": (
                "Automatically track whether a documented, current business "
                "continuity plan exists and alert if none is on file or it "
                "has not been reviewed within 12 months."
            ),
            "implementation_steps": [
                "Track BCP existence and last-review-date status",
                "Compare against the 12-month review threshold",
                "Trigger alert if no BCP exists or it is overdue for review",
                "Log BCP status to the Business Twin",
            ],
            "expected_outcome": (
                "Absence of a current BCP is flagged on an ongoing basis "
                "rather than discovered during an actual disruption."
            ),
            "measurement_plan": (
                "Track: BCP existence status, time since last review, "
                "time-to-alert."
            ),
            "requires_approval": False,
            "rollback_plan": "Disable BCP status alerts. No data loss.",
        },
        {
            "tier": 2,
            "tier_name": "Approval-Based",
            "action_type": "bcp_draft_generation",
            "action_title": "Draft Business Continuity Plan",
            "action_description": (
                "BEI drafts a baseline business continuity plan covering "
                "key risks, critical functions, and response procedures, "
                "based on available business data. Requires owner review "
                "and approval before being adopted as official policy."
            ),
            "implementation_steps": [
                "Identify critical business functions and dependencies",
                "Draft risk scenarios (key-person loss, system outage, supplier failure)",
                "Draft response procedures and responsible-owner assignments",
                "Submit draft for approval and review",
                "Publish approved BCP to the team and store on file",
            ],
            "expected_outcome": (
                "A documented, owner-approved BCP exists within 30 days "
                "of approval."
            ),
            "measurement_plan": (
                "Track: BCP existence status, time-to-approval, "
                "review cadence going forward."
            ),
            "requires_approval": True,
            "rollback_plan": "Discard draft BCP. No operational changes were made.",
        },
    ],

    "high_absenteeism": [
        {
            "tier": 1,
            "tier_name": "Automatic",
            "action_type": "absenteeism_monitoring",
            "action_title": "Activate Absenteeism Rate Monitoring",
            "action_description": (
                "Automatically track staff absenteeism rate monthly against "
                "the industry benchmark and alert on sustained elevation."
            ),
            "implementation_steps": [
                "Pull monthly absence data from HR/people system",
                "Calculate absenteeism rate monthly",
                "Compare against industry benchmark and historical baseline",
                "Trigger alert on 2+ consecutive months above benchmark",
                "Log absenteeism trend to the Business Twin",
            ],
            "expected_outcome": (
                "Elevated absenteeism is flagged within 30 days, before it "
                "compounds into a capacity or culture problem."
            ),
            "measurement_plan": (
                "Track: absenteeism rate monthly, variance vs. benchmark, "
                "time-to-alert."
            ),
            "requires_approval": False,
            "rollback_plan": "Disable absenteeism monitoring alerts. No data loss.",
        },
        {
            "tier": 3,
            "tier_name": "Recommendation",
            "action_type": "absenteeism_response_plan",
            "action_title": "Absenteeism Root Cause & Response Plan",
            "action_description": (
                "BEI prepares a structured diagnosis of likely absenteeism "
                "drivers (workload, engagement, role-specific patterns) and "
                "a set of response options. People management decisions "
                "require owner/HR judgement; not software-executable."
            ),
            "implementation_steps": [
                "Break down absenteeism by team, role, and time pattern",
                "Identify likely contributing factors from available data",
                "Present response options (workload review, engagement check-ins, policy review)",
                "Owner/HR reviews and decides which actions to pursue",
            ],
            "expected_outcome": (
                "Owner has an evidenced view of absenteeism patterns and "
                "a ranked set of response options."
            ),
            "measurement_plan": (
                "Track: absenteeism rate at 90/180 days post-recommendation "
                "vs. baseline."
            ),
            "requires_approval": True,
            "rollback_plan": "No system changes are made automatically; nothing to roll back.",
        },
    ],

    # ---------- Batch 7.7 (Risk/Compliance) ----------
    "stale_financial_review": [
        {
            "tier": 1,
            "tier_name": "Automatic",
            "action_type": "financial_review_monitoring",
            "action_title": "Activate Financial Review Cadence Monitoring",
            "action_description": (
                "Automatically track months since the last external "
                "financial review and alert when the business exceeds "
                "the 12-month threshold."
            ),
            "implementation_steps": [
                "Track months since last documented external financial review",
                "Compare against the 12-month threshold",
                "Trigger alert when threshold is exceeded",
                "Log review status to the Business Twin",
            ],
            "expected_outcome": (
                "Overdue financial reviews are flagged before material "
                "risks or errors go undetected for an extended period."
            ),
            "measurement_plan": (
                "Track: months since last review, time-to-alert from "
                "threshold breach."
            ),
            "requires_approval": False,
            "rollback_plan": "Disable financial review alerts. No data loss.",
        },
        {
            "tier": 3,
            "tier_name": "Recommendation",
            "action_type": "financial_review_engagement",
            "action_title": "External Financial Review Engagement Plan",
            "action_description": (
                "BEI prepares a recommendation to engage an external "
                "reviewer or auditor, with a scoping summary of areas "
                "warranting attention. Engaging a third party requires "
                "owner decision; not software-executable."
            ),
            "implementation_steps": [
                "Summarise time elapsed and any flagged financial anomalies",
                "Identify areas warranting particular review attention",
                "Present recommendation to engage an external reviewer",
                "Owner reviews and decides on engagement and timeline",
            ],
            "expected_outcome": (
                "Owner has a clear basis and scope for commissioning a "
                "timely external financial review."
            ),
            "measurement_plan": (
                "Track: time-to-engagement, review completion status."
            ),
            "requires_approval": True,
            "rollback_plan": "No system changes are made automatically; nothing to roll back.",
        },
    ],

    "insufficient_insurance_cover": [
        {
            "tier": 1,
            "tier_name": "Automatic",
            "action_type": "insurance_cover_monitoring",
            "action_title": "Activate Insurance Cover Ratio Monitoring",
            "action_description": (
                "Automatically calculate total insurance cover relative to "
                "annual revenue monthly and alert when the cover-to-revenue "
                "ratio falls below the 1x baseline threshold."
            ),
            "implementation_steps": [
                "Pull total insurance cover and annual revenue data",
                "Calculate cover-to-revenue ratio",
                "Compare against the 1x baseline threshold",
                "Trigger alert on breach or when revenue growth outpaces cover",
                "Log cover ratio to the Business Twin",
            ],
            "expected_outcome": (
                "Insurance shortfalls are flagged within 30 days, including "
                "shortfalls caused by revenue growth outpacing cover."
            ),
            "measurement_plan": (
                "Track: cover-to-revenue ratio monthly, time-to-alert "
                "from threshold breach."
            ),
            "requires_approval": False,
            "rollback_plan": "Disable insurance cover alerts. No data loss.",
        },
        {
            "tier": 3,
            "tier_name": "Recommendation",
            "action_type": "insurance_review_plan",
            "action_title": "Insurance Cover Review & Broker Engagement Plan",
            "action_description": (
                "BEI prepares a summary of the current cover shortfall and "
                "a recommendation to engage an insurance broker for review. "
                "Insurance decisions require owner judgement and "
                "professional advice; not software-executable."
            ),
            "implementation_steps": [
                "Summarise current cover-to-revenue gap and risk exposure",
                "Identify the business's highest-exposure risk categories",
                "Present recommendation to engage a broker for review",
                "Owner reviews and decides on engagement and coverage changes",
            ],
            "expected_outcome": (
                "Owner has a clear, evidenced basis for reviewing and "
                "adjusting insurance cover."
            ),
            "measurement_plan": (
                "Track: cover-to-revenue ratio at 90/180 days "
                "post-recommendation."
            ),
            "requires_approval": True,
            "rollback_plan": "No system changes are made automatically; nothing to roll back.",
        },
    ],

    "missing_client_contracts": [
        {
            "tier": 1,
            "tier_name": "Automatic",
            "action_type": "contract_coverage_monitoring",
            "action_title": "Activate Client Contract Coverage Monitoring",
            "action_description": (
                "Automatically track the share of active clients with a "
                "signed written contract on file and alert when coverage "
                "is below 100%."
            ),
            "implementation_steps": [
                "Pull active client list and contract-on-file status",
                "Calculate contract coverage % monthly",
                "Trigger alert when coverage is below 100%",
                "Log contract coverage to the Business Twin",
            ],
            "expected_outcome": (
                "Contract gaps are visible on an ongoing basis rather than "
                "discovered during a dispute."
            ),
            "measurement_plan": (
                "Track: contract coverage % monthly, time-to-alert."
            ),
            "requires_approval": False,
            "rollback_plan": "Disable contract coverage alerts. No data loss.",
        },
        {
            "tier": 2,
            "tier_name": "Approval-Based",
            "action_type": "contract_template_rollout",
            "action_title": "Standard Client Contract Template & Rollout Sequence",
            "action_description": (
                "BEI prepares a standard client contract template and an "
                "outreach sequence to obtain signed contracts from clients "
                "currently without one on file. Requires owner/legal "
                "approval before sending."
            ),
            "implementation_steps": [
                "Identify clients without a contract currently on file",
                "Prepare a standard contract template for review",
                "Draft an outreach sequence requesting signature",
                "Submit template and sequence for approval before sending",
                "Track signed-contract coverage post-rollout",
            ],
            "expected_outcome": (
                "Contract coverage reaches 100% within 60 days of approval."
            ),
            "measurement_plan": (
                "Track: contract coverage %, signature response rate, "
                "at 30/60 days post-approval."
            ),
            "requires_approval": True,
            "rollback_plan": "Stop outreach sequence. No contracts are sent without explicit approval.",
        },
    ],

    # ---------- Batch 7.8 (Risk/Compliance, Technology) ----------
    "weak_data_governance": [
        {
            "tier": 1,
            "tier_name": "Automatic",
            "action_type": "data_governance_monitoring",
            "action_title": "Activate Data Governance Status Monitoring",
            "action_description": (
                "Automatically track whether a documented data governance "
                "framework exists and alert if none is on file."
            ),
            "implementation_steps": [
                "Track data governance framework existence status",
                "Trigger alert if no framework is on file",
                "Log governance status to the Business Twin",
            ],
            "expected_outcome": (
                "Absence of a data governance framework is flagged on an "
                "ongoing basis rather than discovered during an incident."
            ),
            "measurement_plan": (
                "Track: data governance status, time-to-alert."
            ),
            "requires_approval": False,
            "rollback_plan": "Disable data governance status alerts. No data loss.",
        },
        {
            "tier": 3,
            "tier_name": "Recommendation",
            "action_type": "data_governance_framework_plan",
            "action_title": "Data Governance Framework Plan",
            "action_description": (
                "BEI prepares a recommended data governance framework "
                "covering data ownership, access control, and retention "
                "policy. Adoption requires owner/legal judgement given "
                "compliance and risk implications; not software-executable."
            ),
            "implementation_steps": [
                "Inventory data types collected and current handling practices",
                "Identify gaps against baseline data protection practice",
                "Draft recommended policy areas (ownership, access, retention)",
                "Present plan with prioritised adoption steps",
                "Owner reviews and decides on adoption and rollout",
            ],
            "expected_outcome": (
                "Owner has a clear, evidenced basis for adopting a data "
                "governance framework."
            ),
            "measurement_plan": (
                "Track: data governance status at 90/180 days "
                "post-recommendation."
            ),
            "requires_approval": True,
            "rollback_plan": "No system changes are made automatically; nothing to roll back.",
        },
    ],

    "low_cloud_adoption": [
        {
            "tier": 1,
            "tier_name": "Automatic",
            "action_type": "cloud_adoption_monitoring",
            "action_title": "Activate Cloud Adoption Monitoring",
            "action_description": (
                "Automatically track cloud infrastructure adoption % "
                "monthly and alert when it remains below the healthy "
                "baseline threshold."
            ),
            "implementation_steps": [
                "Track cloud infrastructure adoption % from the Business Twin",
                "Compare against the 30% baseline threshold",
                "Trigger alert when adoption remains below threshold",
                "Log adoption trend to the Business Twin",
            ],
            "expected_outcome": (
                "Low cloud adoption is flagged on an ongoing basis, "
                "supporting a prioritised migration conversation."
            ),
            "measurement_plan": (
                "Track: cloud adoption % monthly, time-to-alert."
            ),
            "requires_approval": False,
            "rollback_plan": "Disable cloud adoption alerts. No data loss.",
        },
        {
            "tier": 3,
            "tier_name": "Recommendation",
            "action_type": "cloud_migration_plan",
            "action_title": "Cloud Migration Roadmap",
            "action_description": (
                "BEI prepares a prioritised cloud migration roadmap "
                "identifying which systems to migrate first based on "
                "risk and benefit. Migration execution requires technical "
                "judgement and is not software-executable by BEI directly."
            ),
            "implementation_steps": [
                "Inventory current on-premise/legacy systems",
                "Assess migration complexity and benefit for each",
                "Rank systems by priority for migration",
                "Present roadmap with suggested sequencing and timeline",
                "Owner reviews and decides on execution",
            ],
            "expected_outcome": (
                "Owner has a clear, prioritised migration roadmap rather "
                "than an undifferentiated backlog."
            ),
            "measurement_plan": (
                "Track: cloud adoption % at 90/180 days post-recommendation."
            ),
            "requires_approval": True,
            "rollback_plan": "No system changes are made automatically; nothing to roll back.",
        },
    ],

    "underinvested_in_technology": [
        {
            "tier": 1,
            "tier_name": "Automatic",
            "action_type": "it_spend_monitoring",
            "action_title": "Activate IT Spend Ratio Monitoring",
            "action_description": (
                "Automatically track IT spend as a % of revenue monthly "
                "and alert when it remains below the healthy baseline "
                "threshold."
            ),
            "implementation_steps": [
                "Pull IT spend and revenue data monthly",
                "Calculate IT spend as % of revenue",
                "Compare against the 1.5% baseline threshold",
                "Trigger alert when spend remains below threshold",
                "Log spend trend to the Business Twin",
            ],
            "expected_outcome": (
                "Chronic technology underinvestment is flagged on an "
                "ongoing basis rather than compounding silently."
            ),
            "measurement_plan": (
                "Track: IT spend % of revenue monthly, time-to-alert."
            ),
            "requires_approval": False,
            "rollback_plan": "Disable IT spend monitoring alerts. No data loss.",
        },
        {
            "tier": 3,
            "tier_name": "Recommendation",
            "action_type": "technology_investment_plan",
            "action_title": "Technology Investment Prioritisation Plan",
            "action_description": (
                "BEI prepares a prioritised view of where additional "
                "technology investment would have the highest impact "
                "(security, automation, infrastructure). Budget allocation "
                "requires owner decision; not software-executable."
            ),
            "implementation_steps": [
                "Identify areas of highest technology risk or opportunity cost",
                "Estimate impact of closing the gap in each area",
                "Rank investment areas by impact and urgency",
                "Present plan with suggested budget allocation",
                "Owner reviews and decides on investment",
            ],
            "expected_outcome": (
                "Owner has a clear, prioritised basis for technology "
                "investment decisions."
            ),
            "measurement_plan": (
                "Track: IT spend % of revenue at 90/180 days "
                "post-recommendation."
            ),
            "requires_approval": True,
            "rollback_plan": "No system changes are made automatically; nothing to roll back.",
        },
    ],
    # ---------- Batch 7.9 (Technology, People/Leadership) ----------
    "early_stage_digital_transformation": [
        {
            "tier": 1,
            "tier_name": "Automatic",
            "action_type": "digital_maturity_monitoring",
            "action_title": "Activate Digital Transformation Maturity Monitoring",
            "action_description": (
                "Automatically track digital transformation stage and key "
                "maturity indicators monthly, alerting when progress stalls "
                "or key milestones are overdue."
            ),
            "implementation_steps": [
                "Track digital transformation stage from the Business Twin",
                "Monitor key maturity indicators (cloud adoption, automation coverage, data maturity)",
                "Flag when stage has not progressed for 6+ months",
                "Log maturity trend to the Business Twin",
            ],
            "expected_outcome": (
                "Digital transformation stagnation is flagged before it "
                "causes a compounding technology capability gap."
            ),
            "measurement_plan": (
                "Track: digital maturity stage monthly, key indicator trends, time-to-alert."
            ),
            "requires_approval": False,
            "rollback_plan": "Disable digital maturity monitoring alerts. No data loss.",
        },
        {
            "tier": 3,
            "tier_name": "Recommendation",
            "action_type": "digital_transformation_roadmap",
            "action_title": "Digital Transformation Acceleration Roadmap",
            "action_description": (
                "BEI prepares a prioritised digital transformation roadmap "
                "covering the highest-impact capability gaps. Technology "
                "investment and change management require owner decision "
                "and execution; not software-executable."
            ),
            "implementation_steps": [
                "Assess current digital capability gaps vs. business-stage benchmark",
                "Identify highest-impact transformation priorities",
                "Estimate investment and complexity for each",
                "Present prioritised roadmap with suggested sequencing",
                "Owner reviews and decides on execution",
            ],
            "expected_outcome": (
                "Owner has a clear, prioritised digital transformation roadmap "
                "rather than an undifferentiated backlog."
            ),
            "measurement_plan": (
                "Track: digital maturity stage at 90/180 days post-recommendation."
            ),
            "requires_approval": True,
            "rollback_plan": "No system changes are made automatically; nothing to roll back.",
        },
    ],
    "leadership_capacity_gap": [
        {
            "tier": 1,
            "tier_name": "Automatic",
            "action_type": "leadership_vacancy_monitoring",
            "action_title": "Activate Leadership Vacancy Rate Monitoring",
            "action_description": (
                "Automatically track senior leadership vacancy rate monthly "
                "and alert when unfilled roles exceed 15% of the leadership "
                "team, indicating a decision-making capacity risk."
            ),
            "implementation_steps": [
                "Pull leadership team size and vacancy count from the Business Twin",
                "Calculate vacancy rate monthly",
                "Trigger alert when vacancy rate exceeds 15%",
                "Log vacancy trend to the Business Twin",
            ],
            "expected_outcome": (
                "Leadership capacity shortfalls are flagged before they "
                "cause execution bottlenecks or delivery failures."
            ),
            "measurement_plan": (
                "Track: leadership vacancy rate monthly, time-to-alert from threshold breach."
            ),
            "requires_approval": False,
            "rollback_plan": "Disable leadership vacancy monitoring alerts. No data loss.",
        },
        {
            "tier": 3,
            "tier_name": "Recommendation",
            "action_type": "leadership_hiring_plan",
            "action_title": "Senior Leadership Hiring & Interim Coverage Plan",
            "action_description": (
                "BEI prepares a structured hiring plan for the open senior "
                "roles, including interim coverage options to bridge "
                "the gap. Hiring decisions require owner judgement and "
                "are not software-executable."
            ),
            "implementation_steps": [
                "Identify which open roles are highest-priority by business impact",
                "Assess interim/fractional coverage options for each",
                "Prepare role specification and hiring timeline for each",
                "Present plan with recommended sequencing",
                "Owner reviews and decides on execution",
            ],
            "expected_outcome": (
                "Owner has a clear, prioritised hiring plan with interim "
                "coverage bridging the gap."
            ),
            "measurement_plan": (
                "Track: leadership vacancy rate at 30/60/90 days "
                "post-recommendation vs. target."
            ),
            "requires_approval": True,
            "rollback_plan": "No system changes are made automatically; nothing to roll back.",
        },
    ],
    "succession_risk": [
        {
            "tier": 1,
            "tier_name": "Automatic",
            "action_type": "succession_status_monitoring",
            "action_title": "Activate Succession Planning Status Monitoring",
            "action_description": (
                "Automatically track whether a documented succession plan "
                "exists for key leadership roles and alert if none is on "
                "file or it has not been reviewed within 12 months."
            ),
            "implementation_steps": [
                "Track succession plan existence and last-review date",
                "Compare against the 12-month review threshold",
                "Trigger alert if no plan exists or it is overdue",
                "Log succession status to the Business Twin",
            ],
            "expected_outcome": (
                "Absence of a succession plan is flagged on an ongoing basis "
                "rather than discovered during an unplanned departure."
            ),
            "measurement_plan": (
                "Track: succession plan status, time since last review, time-to-alert."
            ),
            "requires_approval": False,
            "rollback_plan": "Disable succession status alerts. No data loss.",
        },
        {
            "tier": 2,
            "tier_name": "Approval-Based",
            "action_type": "succession_plan_draft",
            "action_title": "Draft Succession Plan for Key Leadership Roles",
            "action_description": (
                "BEI drafts a succession plan template identifying "
                "internal candidates, development gaps, and interim "
                "options for each key leadership role. Requires owner "
                "review and approval before being adopted as policy."
            ),
            "implementation_steps": [
                "Identify key roles where sudden departure would be most damaging",
                "Assess internal candidate readiness for each role",
                "Identify development gaps for each candidate",
                "Draft interim coverage options where no internal candidate is ready",
                "Submit plan for owner review and approval",
            ],
            "expected_outcome": (
                "A documented, owner-approved succession plan exists for "
                "key roles within 30 days of approval."
            ),
            "measurement_plan": (
                "Track: succession plan status, coverage for key roles, "
                "review cadence going forward."
            ),
            "requires_approval": True,
            "rollback_plan": "Discard draft succession plan. No operational changes were made.",
        },
    ],
    # ---------- Batch 7.10 (Cyber/Risk/Compliance) ----------
    "technology_debt_risk": [
        {
            "tier": 1,
            "tier_name": "Automatic",
            "action_type": "tech_debt_monitoring",
            "action_title": "Activate Technology Debt Risk Monitoring",
            "action_description": (
                "Automatically track technology stack maturity and legacy "
                "system risk indicators monthly, alerting when debt levels "
                "reach or exceed the high-risk threshold."
            ),
            "implementation_steps": [
                "Pull tech stack maturity and legacy risk status from the Business Twin",
                "Calculate a composite tech debt risk indicator monthly",
                "Trigger alert when risk reaches high or critical level",
                "Log tech debt trend to the Business Twin",
            ],
            "expected_outcome": (
                "Technology debt risk is flagged before it causes an "
                "operational incident or blocks a critical system migration."
            ),
            "measurement_plan": (
                "Track: tech debt risk indicator monthly, time-to-alert from threshold."
            ),
            "requires_approval": False,
            "rollback_plan": "Disable tech debt monitoring alerts. No data loss.",
        },
        {
            "tier": 3,
            "tier_name": "Recommendation",
            "action_type": "tech_debt_remediation_plan",
            "action_title": "Technology Debt Remediation Roadmap",
            "action_description": (
                "BEI prepares a prioritised technology debt remediation "
                "roadmap identifying the highest-risk legacy systems and "
                "recommended migration or replacement options. Technical "
                "execution requires specialist judgement; not software-executable."
            ),
            "implementation_steps": [
                "Inventory legacy systems and assess failure/risk probability",
                "Identify highest-risk systems requiring urgent attention",
                "Research migration or replacement options for each",
                "Present prioritised roadmap with estimated cost and complexity",
                "Owner reviews and decides on execution",
            ],
            "expected_outcome": (
                "Owner has a clear, prioritised view of technology debt "
                "risk and a roadmap to reduce it."
            ),
            "measurement_plan": (
                "Track: tech stack maturity and legacy risk status at "
                "90/180 days post-recommendation."
            ),
            "requires_approval": True,
            "rollback_plan": "No system changes are made automatically; nothing to roll back.",
        },
    ],
    "cyber_security_exposure": [
        {
            "tier": 1,
            "tier_name": "Automatic",
            "action_type": "cyber_risk_monitoring",
            "action_title": "Activate Cyber Security Risk Monitoring",
            "action_description": (
                "Automatically track cyber security maturity score and "
                "incident count monthly, alerting when maturity falls "
                "below safe thresholds or incidents occur."
            ),
            "implementation_steps": [
                "Pull cyber maturity score and incident data from the Business Twin",
                "Trigger alert when maturity score falls below 5/10 threshold",
                "Trigger immediate alert if any cyber incident is reported",
                "Log cyber risk trend to the Business Twin",
            ],
            "expected_outcome": (
                "Cyber risk deterioration and any incidents are flagged "
                "within 30 days or immediately, respectively."
            ),
            "measurement_plan": (
                "Track: cyber maturity score monthly, incident count, time-to-alert."
            ),
            "requires_approval": False,
            "rollback_plan": "Disable cyber risk monitoring alerts. No data loss.",
        },
        {
            "tier": 3,
            "tier_name": "Recommendation",
            "action_type": "cyber_security_improvement_plan",
            "action_title": "Cyber Security Improvement Plan",
            "action_description": (
                "BEI prepares a diagnosis of the business's cyber security "
                "maturity gaps and a prioritised set of improvement "
                "recommendations. Cyber security implementation requires "
                "specialist expertise; not software-executable."
            ),
            "implementation_steps": [
                "Assess current cyber maturity gaps vs. baseline requirements",
                "Identify highest-risk exposure areas",
                "Recommend priority controls (access management, patching, backup, training)",
                "Present plan ranked by risk reduction and implementation effort",
                "Owner decides on engagement of cyber specialist for execution",
            ],
            "expected_outcome": (
                "Owner has a clear, prioritised cyber security improvement "
                "plan and a basis for engaging a specialist."
            ),
            "measurement_plan": (
                "Track: cyber maturity score at 90/180 days post-recommendation."
            ),
            "requires_approval": True,
            "rollback_plan": "No system changes are made automatically; nothing to roll back.",
        },
    ],
    "client_concentration_risk_enterprise": [
        {
            "tier": 1,
            "tier_name": "Automatic",
            "action_type": "client_concentration_monitoring",
            "action_title": "Activate Client Concentration Risk Monitoring",
            "action_description": (
                "Automatically track top-client revenue concentration "
                "monthly and alert when a single client exceeds 25% of "
                "total revenue."
            ),
            "implementation_steps": [
                "Pull top-client revenue share from the Business Twin",
                "Calculate concentration ratio monthly",
                "Trigger alert when single client exceeds 25% threshold",
                "Log concentration trend to the Business Twin",
            ],
            "expected_outcome": (
                "Concentration risk is flagged before it becomes critical, "
                "giving time for deliberate diversification."
            ),
            "measurement_plan": (
                "Track: top-client revenue % monthly, time-to-alert from threshold."
            ),
            "requires_approval": False,
            "rollback_plan": "Disable concentration monitoring alerts. No data loss.",
        },
        {
            "tier": 3,
            "tier_name": "Recommendation",
            "action_type": "revenue_diversification_plan",
            "action_title": "Revenue Diversification Plan",
            "action_description": (
                "BEI prepares a structured plan to reduce revenue "
                "concentration by identifying and pursuing new client "
                "segments or expanding within existing secondary clients. "
                "Business development execution requires owner judgement."
            ),
            "implementation_steps": [
                "Map current revenue distribution by client",
                "Identify target segments for diversification based on fit",
                "Assess capacity to take on new clients without quality risk",
                "Present prioritised diversification actions",
                "Owner reviews and decides on execution",
            ],
            "expected_outcome": (
                "Top-client revenue concentration reduced below 25% "
                "within 12 months."
            ),
            "measurement_plan": (
                "Track: top-client revenue % at 90/180/365 days "
                "post-recommendation."
            ),
            "requires_approval": True,
            "rollback_plan": "No system changes are made automatically; nothing to roll back.",
        },
    ],
    # ---------- Batch 7.11 (Pre-existing gaps: Governance, Delivery, Pricing) ----------
    "governance_maturity_gap": [
        {
            "tier": 1,
            "tier_name": "Automatic",
            "action_type": "governance_monitoring",
            "action_title": "Activate Governance Maturity Monitoring",
            "action_description": (
                "Automatically track governance maturity indicators "
                "(board meeting frequency, reporting cadence, decision "
                "structure) monthly and alert when they fall below "
                "the expected standard for the business scale."
            ),
            "implementation_steps": [
                "Pull governance indicators from the Business Twin",
                "Assess against expected standards for revenue scale",
                "Trigger alert when governance is below standard",
                "Log governance status to the Business Twin",
            ],
            "expected_outcome": (
                "Governance gaps are flagged before they cause a "
                "material oversight failure or investor concern."
            ),
            "measurement_plan": (
                "Track: governance maturity score monthly, time-to-alert."
            ),
            "requires_approval": False,
            "rollback_plan": "Disable governance monitoring alerts. No data loss.",
        },
        {
            "tier": 3,
            "tier_name": "Recommendation",
            "action_type": "governance_improvement_plan",
            "action_title": "Governance Maturity Improvement Plan",
            "action_description": (
                "BEI prepares a structured governance improvement plan "
                "covering board cadence, reporting structure, and "
                "decision-making framework maturity. Governance changes "
                "require owner and board decision; not software-executable."
            ),
            "implementation_steps": [
                "Assess current governance against the business-stage benchmark",
                "Identify priority governance gaps by risk",
                "Recommend improvements to cadence, reporting, and structure",
                "Present plan with suggested implementation sequencing",
                "Owner and board review and decide on adoption",
            ],
            "expected_outcome": (
                "Governance maturity improves measurably within 90 days "
                "of owner decision."
            ),
            "measurement_plan": (
                "Track: governance maturity indicators at 90/180 days "
                "post-recommendation."
            ),
            "requires_approval": True,
            "rollback_plan": "No system changes are made automatically; nothing to roll back.",
        },
    ],
    "delivery_execution_gap": [
        {
            "tier": 1,
            "tier_name": "Automatic",
            "action_type": "delivery_performance_monitoring",
            "action_title": "Activate On-Time Delivery Monitoring",
            "action_description": (
                "Automatically track on-time delivery rate monthly against "
                "the 80% benchmark and alert on sustained underperformance."
            ),
            "implementation_steps": [
                "Pull project delivery data and on-time rate from operations",
                "Calculate on-time delivery rate monthly",
                "Trigger alert when rate falls below 80% for 2+ months",
                "Log delivery trend to the Business Twin",
            ],
            "expected_outcome": (
                "Delivery performance deterioration is flagged within 30 days "
                "before it damages client relationships."
            ),
            "measurement_plan": (
                "Track: on-time delivery rate monthly, variance vs. 80% benchmark."
            ),
            "requires_approval": False,
            "rollback_plan": "Disable delivery monitoring alerts. No data loss.",
        },
        {
            "tier": 3,
            "tier_name": "Recommendation",
            "action_type": "delivery_improvement_plan",
            "action_title": "Delivery Execution Improvement Plan",
            "action_description": (
                "BEI prepares a root cause diagnosis of delivery shortfalls "
                "(capacity, process, planning) and a prioritised improvement "
                "plan. Operational changes require owner and team execution."
            ),
            "implementation_steps": [
                "Break down delivery failures by cause (capacity, process, scope creep)",
                "Identify the single highest-impact contributing factor",
                "Present prioritised improvement actions by impact and effort",
                "Owner reviews and decides which to pursue",
            ],
            "expected_outcome": (
                "On-time delivery rate improves measurably within 90 days "
                "of owner decision."
            ),
            "measurement_plan": (
                "Track: on-time delivery rate at 90/180 days post-recommendation."
            ),
            "requires_approval": True,
            "rollback_plan": "No system changes are made automatically; nothing to roll back.",
        },
    ],
    "systematic_discounting_erosion": [
        {
            "tier": 1,
            "tier_name": "Automatic",
            "action_type": "discount_rate_monitoring",
            "action_title": "Activate Discount Rate Monitoring",
            "action_description": (
                "Automatically track average discount rate monthly and "
                "alert when it exceeds 15% — the threshold associated "
                "with margin-damaging discount habits."
            ),
            "implementation_steps": [
                "Pull discount data from CRM or invoicing system",
                "Calculate average discount rate monthly",
                "Trigger alert when average exceeds 15% for the period",
                "Log discount trend to the Business Twin",
            ],
            "expected_outcome": (
                "Systematic discounting is flagged within 30 days of "
                "exceeding the threshold."
            ),
            "measurement_plan": (
                "Track: average discount rate monthly, gross margin trend, time-to-alert."
            ),
            "requires_approval": False,
            "rollback_plan": "Disable discount rate monitoring alerts. No data loss.",
        },
        {
            "tier": 2,
            "tier_name": "Approval-Based",
            "action_type": "discount_governance_policy",
            "action_title": "Build Discount Governance Policy & Approval Workflow",
            "action_description": (
                "BEI drafts a discount governance policy setting thresholds "
                "for when discounts require escalation/approval, and builds "
                "an automated approval workflow in the CRM. Requires owner "
                "approval before activation."
            ),
            "implementation_steps": [
                "Define discount threshold tiers (e.g. up to 10% self-approve, 10-20% manager approval, 20%+ owner approval)",
                "Draft discount governance policy document",
                "Build approval routing workflow in CRM",
                "Submit policy and workflow for owner approval",
                "Activate workflow after approval",
            ],
            "expected_outcome": (
                "Average discount rate reduces measurably within 90 days "
                "of policy activation."
            ),
            "measurement_plan": (
                "Track: average discount rate, approval escalation rate, "
                "gross margin at 30/60/90 days post-activation."
            ),
            "requires_approval": True,
            "rollback_plan": "Deactivate discount workflow. Revert to previous approval process.",
        },
        {
            "tier": 3,
            "tier_name": "Recommendation",
            "action_type": "pricing_confidence_programme",
            "action_title": "Pricing Confidence & Value Communication Plan",
            "action_description": (
                "BEI prepares a plan to improve pricing confidence — "
                "strengthening value communication to reduce the perceived "
                "need to discount. Requires owner decision and sales team "
                "execution."
            ),
            "implementation_steps": [
                "Analyse which deal types or sales reps generate the highest discounts",
                "Identify common objections that trigger discounting",
                "Prepare value-articulation messaging for top objection scenarios",
                "Present to owner/sales leadership for review",
                "Owner decides on rollout to sales team",
            ],
            "expected_outcome": (
                "Average discount rate reduces measurably and pricing "
                "confidence improves within 90 days of rollout."
            ),
            "measurement_plan": (
                "Track: average discount rate, win rate, gross margin "
                "at 90/180 days post-rollout."
            ),
            "requires_approval": True,
            "rollback_plan": "No system changes are made automatically; nothing to roll back.",
        },
    ],
}


def build_deployment_packages(
    primary_constraint: dict[str, Any],
    secondary_constraints: list[dict[str, Any]],
    business_id: str,
    industry: str = "",
) -> dict[str, Any]:
    """
    Build deployment packages for primary and secondary constraints.
    Returns tier-classified packages ready for agent preparation.
    Golden Rule 6: Approval Before Execution.
    Golden Rule 12: Every Deployment Must Be Measurable.
    """

    all_constraints = [primary_constraint] + secondary_constraints[:2]
    all_packages = []

    for constraint in all_constraints:
        key = constraint.get("key", "")
        name = constraint.get("name", "")
        is_primary = constraint["key"] == primary_constraint["key"]

        deployments = DEPLOYMENT_CATALOGUE.get(key, [])

        for deployment in deployments:
            package = {
                "deployment_id": str(uuid.uuid4()),
                "business_id": business_id,
                "constraint_key": key,
                "constraint_name": name,
                "is_primary_constraint": is_primary,
                "tier": deployment["tier"],
                "tier_name": deployment["tier_name"],
                "action_type": deployment["action_type"],
                "action_title": deployment["action_title"],
                "action_description": deployment["action_description"],
                "implementation_steps": deployment["implementation_steps"],
                "expected_outcome": deployment["expected_outcome"],
                "measurement_plan": deployment["measurement_plan"],
                "requires_approval": deployment["requires_approval"],
                "approved": False,
                "status": "pending",
                "rollback_plan": deployment["rollback_plan"],
                "industry": industry,
            }
            all_packages.append(package)

    # Sort: Tier 1 first, then Tier 2, then Tier 3
    # Primary constraint packages first within each tier
    all_packages.sort(key=lambda x: (
        x["tier"],
        0 if x["is_primary_constraint"] else 1,
    ))

    tier1 = [p for p in all_packages if p["tier"] == 1]
    tier2 = [p for p in all_packages if p["tier"] == 2]
    tier3 = [p for p in all_packages if p["tier"] == 3]

    return {
        "business_id": business_id,
        "total_packages": len(all_packages),
        "tier1_automatic": tier1,
        "tier2_approval": tier2,
        "tier3_recommendation": tier3,
        "immediate_actions": tier1,
        "pending_approval": tier2,
        "recommendations": tier3,
        "deployment_summary": (
            f"{len(tier1)} automatic action(s) ready to execute. "
            f"{len(tier2)} action(s) prepared and awaiting your approval. "
            f"{len(tier3)} strategic recommendation(s) requiring human execution."
        ),
    }


def approve_deployment(
    packages: dict[str, Any],
    deployment_id: str,
) -> dict[str, Any]:
    """
    Approve a Tier 2 deployment package.
    Golden Rule 6: Approval Before Execution.
    Returns updated packages with approval status.
    """

    for package in packages.get("tier2_approval", []):
        if package["deployment_id"] == deployment_id:
            package["approved"] = True
            package["status"] = "approved"
            return {
                "success": True,
                "deployment_id": deployment_id,
                "message": f"'{package['action_title']}' approved and ready to execute.",
            }

    return {
        "success": False,
        "deployment_id": deployment_id,
        "message": "Deployment not found or not eligible for approval.",
    }
