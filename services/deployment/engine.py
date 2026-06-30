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
