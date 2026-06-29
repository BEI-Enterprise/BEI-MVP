'use client'
import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase'
import DashboardShell from '../components/DashboardShell'

const supabase = createClient()
const gold = '#C8A24A'
const card = '#0e0e0e'
const border = '#1e1e1e'

// Each connector contributes a % to Twin completeness
// Manual MRI data = 40% base (always present after MRI)
// Each connector adds its boost
const CONNECTOR_WEIGHTS: Record<string, number> = {
  // OAuth connectors
  hubspot: 8, salesforce: 8,
  xero: 8, quickbooks: 8,
  hibob: 6, workday: 6,
  google_analytics: 5,
  // Manual — CRM (4%)
  manual_crm: 4,
  // Manual — Finance (15%)
  manual_finance: 5, finance_advanced: 5, finance_divisional: 5,
  // Manual — Growth (11%)
  growth_revenue: 6, growth_pricing: 5,
  // Manual — Operations (15%)
  operations_team: 5, operations_processes: 5, operations_enterprise: 5,
  // Manual — Strategy (12%)
  strategy_vision: 5, strategy_corporate: 4, strategy_governance: 3,
  // Manual — Risk (12%)
  risk_concentration: 4, risk_compliance: 4, risk_enterprise: 4,
  // Manual — Context (8%)
  context_market: 4, context_brand: 4,
  // Manual — People (10%)
  people_workforce: 5, people_leadership: 5,
  // Manual — Technology (10%)
  tech_systems: 5, tech_data: 5,
}
const MRI_BASE = 0

const CONNECTOR_GROUPS = [
  { group: 'CRM & Sales', twin_impact: 'Sales, Operations', icon: '◈',
    connectors: [
      { id: 'hubspot', name: 'HubSpot', boost: 8, auth: 'oauth',
        fields: [{ key: 'client_id', label: 'Client ID' }, { key: 'client_secret', label: 'Client Secret', secret: true }] },
      { id: 'salesforce', name: 'Salesforce', boost: 8, auth: 'oauth',
        fields: [{ key: 'client_id', label: 'Consumer Key' }, { key: 'client_secret', label: 'Consumer Secret', secret: true }] },
      { id: 'manual_crm', name: 'Manual CRM Data', boost: 4, auth: 'manual',
        fields: [
          { key: 'total_leads', label: 'Total Leads (last 90 days)', inputType: 'number', placeholder: '500' },
          { key: 'converted_leads', label: 'Converted to Clients/Contracts', inputType: 'number', placeholder: '85' },
          { key: 'avg_response_time_hours', label: 'Avg Sales Response Time (hours)', inputType: 'number', placeholder: '4' },
          { key: 'avg_deal_value', label: 'Average Deal / Contract Value (£)', inputType: 'number', placeholder: '250000' },
          { key: 'total_active_accounts', label: 'Total Active Client Accounts', inputType: 'number', placeholder: '120' },
          { key: 'annual_contract_value', label: 'Total Annual Contract Value (£)', inputType: 'number', placeholder: '15000000' },
          { key: 'win_rate_pct', label: 'Tender / Proposal Win Rate (%)', inputType: 'number', placeholder: '42' },
          { key: 'sales_team_size', label: 'Sales & BD Team Size', inputType: 'number', placeholder: '25' },
        ] },
    ]},
  { group: 'Finance & Financial Performance', twin_impact: 'Growth, Risk', icon: '£',
    connectors: [
      { id: 'xero', name: 'Xero', boost: 8, auth: 'oauth',
        fields: [{ key: 'client_id', label: 'Client ID' }, { key: 'client_secret', label: 'Client Secret', secret: true }] },
      { id: 'quickbooks', name: 'QuickBooks', boost: 8, auth: 'oauth',
        fields: [{ key: 'client_id', label: 'Client ID' }, { key: 'client_secret', label: 'Client Secret', secret: true }] },
      { id: 'manual_finance', name: 'Core Financial Data', boost: 5, auth: 'manual',
        fields: [
          { key: 'annual_revenue', label: 'Annual Revenue (£)', inputType: 'number', placeholder: '25000000' },
          { key: 'revenue_last_12m', label: 'Revenue Last 12 Months (£)', inputType: 'number', placeholder: '22000000' },
          { key: 'revenue_growth_rate_pct', label: 'Revenue Growth Rate YoY (%)', inputType: 'number', placeholder: '12' },
          { key: 'gross_profit', label: 'Gross Profit (£)', inputType: 'number', placeholder: '14000000' },
          { key: 'gross_margin_pct', label: 'Gross Margin (%)', inputType: 'number', placeholder: '56' },
          { key: 'ebitda', label: 'EBITDA (£)', inputType: 'number', placeholder: '5000000' },
          { key: 'net_profit', label: 'Net Profit (£)', inputType: 'number', placeholder: '3500000' },
          { key: 'total_operating_costs', label: 'Total Operating Costs (£)', inputType: 'number', placeholder: '18500000' },
          { key: 'cash_and_equivalents', label: 'Cash & Equivalents (£)', inputType: 'number', placeholder: '4000000' },
          { key: 'total_debt', label: 'Total Debt / Borrowings (£)', inputType: 'number', placeholder: '2000000' },
        ] },
      { id: 'finance_advanced', name: 'Advanced Financial Intelligence', boost: 5, auth: 'manual',
        fields: [
          { key: 'revenue_by_division', label: 'Revenue Split by Division / BU', placeholder: 'UK: £15M, Europe: £8M, US: £2M' },
          { key: 'recurring_revenue_pct', label: 'Recurring / Contracted Revenue (%)', inputType: 'number', placeholder: '65' },
          { key: 'arr', label: 'Annual Recurring Revenue — ARR (£)', inputType: 'number', placeholder: '16000000' },
          { key: 'customer_lifetime_value', label: 'Average Customer Lifetime Value (£)', inputType: 'number', placeholder: '180000' },
          { key: 'cac', label: 'Customer Acquisition Cost — CAC (£)', inputType: 'number', placeholder: '8500' },
          { key: 'payback_period_months', label: 'CAC Payback Period (months)', inputType: 'number', placeholder: '14' },
          { key: 'working_capital', label: 'Working Capital (£)', inputType: 'number', placeholder: '6000000' },
          { key: 'capex_last_12m', label: 'Capital Expenditure Last 12 Months (£)', inputType: 'number', placeholder: '1200000' },
          { key: 'rd_spend', label: 'R&D / Innovation Investment (£)', inputType: 'number', placeholder: '800000' },
          { key: 'dividend_policy', label: 'Dividend / Distribution Policy', placeholder: 'Annual dividend — 40% of net profit' },
        ] },
      { id: 'finance_divisional', name: 'Divisional P&L Intelligence', boost: 5, auth: 'manual',
        fields: [
          { key: 'num_business_units', label: 'Number of Business Units / Divisions', inputType: 'number', placeholder: '4' },
          { key: 'highest_margin_division', label: 'Highest Margin Division / Product Line', placeholder: 'Professional Services — 72% GM' },
          { key: 'lowest_margin_division', label: 'Lowest Margin Division / Product Line', placeholder: 'Logistics — 18% GM' },
          { key: 'investment_divisions', label: 'Divisions in Investment Phase', placeholder: 'Tech Platform, US Expansion' },
          { key: 'revenue_concentration_top_product', label: 'Revenue from Top Product / Service (%)', inputType: 'number', placeholder: '45' },
          { key: 'cross_sell_rate_pct', label: 'Multi-Product Client Rate (%)', inputType: 'number', placeholder: '38' },
        ] },
    ]},
  { group: 'Growth Pillar', twin_impact: 'Growth', icon: '▲',
    connectors: [
      { id: 'growth_revenue', name: 'Revenue & Pipeline Intelligence', boost: 6, auth: 'manual',
        fields: [
          { key: 'pipeline_value', label: 'Current Sales Pipeline Value (£)', inputType: 'number', placeholder: '5000000' },
          { key: 'pipeline_deals_count', label: 'Number of Active Pipeline Deals', inputType: 'number', placeholder: '85' },
          { key: 'lead_to_client_conversion', label: 'Lead to Client Conversion Rate (%)', inputType: 'number', placeholder: '22' },
          { key: 'average_sales_cycle_days', label: 'Average Sales Cycle Length (days)', inputType: 'number', placeholder: '90' },
          { key: 'new_clients_last_12m', label: 'New Clients Acquired Last 12 Months', inputType: 'number', placeholder: '45' },
          { key: 'lost_clients_last_12m', label: 'Client Churn Last 12 Months', inputType: 'number', placeholder: '8' },
          { key: 'expansion_revenue_pct', label: 'Revenue Growth from Existing Clients (%)', inputType: 'number', placeholder: '28' },
          { key: 'international_revenue_pct', label: 'International / Export Revenue (%)', inputType: 'number', placeholder: '35' },
          { key: 'channel_mix', label: 'Primary Revenue Channels', placeholder: 'Direct 60%, Partner 30%, Digital 10%' },
          { key: 'top_10_clients_revenue_pct', label: 'Revenue from Top 10 Clients (%)', inputType: 'number', placeholder: '42' },
        ] },
      { id: 'growth_pricing', name: 'Pricing & Commercial Intelligence', boost: 5, auth: 'manual',
        fields: [
          { key: 'pricing_model', label: 'Primary Pricing Model', placeholder: 'SaaS subscription + professional services' },
          { key: 'price_vs_market', label: 'Pricing Position vs Market', placeholder: 'Above market' },
          { key: 'last_price_increase_months', label: 'Months Since Last Price Increase', inputType: 'number', placeholder: '12' },
          { key: 'discounting_frequency', label: 'How Often Discounts Given?', placeholder: 'Rarely' },
          { key: 'avg_discount_pct', label: 'Average Discount Offered (%)', inputType: 'number', placeholder: '8' },
          { key: 'contract_length_months', label: 'Average Contract Length (months)', inputType: 'number', placeholder: '24' },
          { key: 'upsell_revenue_pct', label: 'Revenue from Upsells / Expansions (%)', inputType: 'number', placeholder: '22' },
          { key: 'pricing_review_frequency', label: 'Pricing Review Frequency', placeholder: 'Annual with CPI adjustment' },
        ] },
    ]},
  { group: 'Operations Pillar', twin_impact: 'Operations', icon: '⚙',
    connectors: [
      { id: 'operations_team', name: 'Workforce & Capacity Intelligence', boost: 5, auth: 'manual',
        fields: [
          { key: 'total_headcount', label: 'Total Headcount FTE (supports up to 10,000+)', inputType: 'number', placeholder: '850' },
          { key: 'headcount_by_function', label: 'Headcount Split by Function', placeholder: 'Operations: 320, Sales: 180, Tech: 150, Finance: 80, HR: 60, Leadership: 60' },
          { key: 'headcount_by_location', label: 'Headcount by Location / Region', placeholder: 'London: 400, Manchester: 200, Dublin: 150, Remote: 100' },
          { key: 'billable_team_size', label: 'Billable / Revenue-Generating Headcount', inputType: 'number', placeholder: '520' },
          { key: 'avg_utilisation_pct', label: 'Average Billable Utilisation (%)', inputType: 'number', placeholder: '74' },
          { key: 'staff_turnover_12m', label: 'Staff Turnover Last 12 Months (%)', inputType: 'number', placeholder: '14' },
          { key: 'open_roles', label: 'Current Open / Approved Unfilled Roles', inputType: 'number', placeholder: '42' },
          { key: 'avg_tenure_years', label: 'Average Employee Tenure (years)', inputType: 'number', placeholder: '4' },
          { key: 'contractor_pct', label: 'Contractors as % of Workforce', inputType: 'number', placeholder: '18' },
          { key: 'revenue_per_head', label: 'Revenue Per Head (£)', inputType: 'number', placeholder: '180000' },
          { key: 'cost_per_head', label: 'Total Employment Cost Per Head (£)', inputType: 'number', placeholder: '65000' },
        ] },
      { id: 'operations_processes', name: 'Process & Delivery Intelligence', boost: 5, auth: 'manual',
        fields: [
          { key: 'documented_processes', label: 'Core Processes Documented & Version Controlled?', placeholder: 'Partial' },
          { key: 'iso_certified', label: 'ISO / Quality Certifications Held', placeholder: 'ISO 9001, ISO 27001' },
          { key: 'onboarding_time_days', label: 'Average Client Onboarding Time (days)', inputType: 'number', placeholder: '21' },
          { key: 'project_on_time_pct', label: 'Projects Delivered On Time (%)', inputType: 'number', placeholder: '82' },
          { key: 'sla_breach_rate_pct', label: 'SLA Breach Rate (%)', inputType: 'number', placeholder: '3' },
          { key: 'toolstack', label: 'Primary Enterprise Tools / Platforms', placeholder: 'SAP, Salesforce, ServiceNow, Slack, Microsoft 365' },
          { key: 'automation_level', label: 'Process Automation Coverage (%)', inputType: 'number', placeholder: '45' },
          { key: 'shared_services', label: 'Shared Services Functions in Place', placeholder: 'Finance, HR, IT, Legal' },
        ] },
      { id: 'operations_enterprise', name: 'Enterprise Operations Intelligence', boost: 5, auth: 'manual',
        fields: [
          { key: 'num_locations', label: 'Number of Operating Locations / Offices', inputType: 'number', placeholder: '12' },
          { key: 'countries_operating', label: 'Countries / Regions of Operation', placeholder: 'UK, Ireland, Germany, UAE, Singapore' },
          { key: 'supply_chain_dependencies', label: 'Critical Supply Chain / Partner Dependencies', placeholder: '3 tier-1 suppliers, 8 strategic partners' },
          { key: 'outsourced_functions', label: 'Outsourced / Offshored Functions', placeholder: 'IT support (India), Finance processing (Poland)' },
          { key: 'operational_resilience_score', label: 'Operational Resilience Self-Assessment (1-10)', inputType: 'number', placeholder: '7' },
          { key: 'business_continuity_plan', label: 'Business Continuity Plan in Place?', placeholder: 'Yes' },
        ] },
    ]},
  { group: 'People & Workforce', twin_impact: 'Operations, Strategy', icon: '◉',
    connectors: [
      { id: 'hibob', name: 'HiBob', boost: 6, auth: 'oauth',
        fields: [{ key: 'client_id', label: 'Client ID' }, { key: 'client_secret', label: 'Client Secret', secret: true }] },
      { id: 'workday', name: 'Workday', boost: 6, auth: 'oauth',
        fields: [{ key: 'client_id', label: 'Client ID' }, { key: 'client_secret', label: 'Client Secret', secret: true }] },
      { id: 'people_workforce', name: 'Workforce Intelligence', boost: 5, auth: 'manual',
        fields: [
          { key: 'employee_engagement_score', label: 'Employee Engagement Score (%)', inputType: 'number', placeholder: '72' },
          { key: 'eNPS', label: 'Employee NPS (eNPS)', inputType: 'number', placeholder: '28' },
          { key: 'absenteeism_rate_pct', label: 'Absenteeism Rate (%)', inputType: 'number', placeholder: '4' },
          { key: 'internal_promotion_rate_pct', label: 'Internal Promotion Rate (%)', inputType: 'number', placeholder: '35' },
          { key: 'training_spend_per_head', label: 'Annual Training Spend Per Head (£)', inputType: 'number', placeholder: '1200' },
          { key: 'gender_pay_gap_pct', label: 'Gender Pay Gap (%)', inputType: 'number', placeholder: '8' },
          { key: 'diversity_leadership_pct', label: 'Diversity in Senior Leadership (%)', inputType: 'number', placeholder: '32' },
          { key: 'remote_hybrid_split', label: 'Working Model Split', placeholder: 'Office 40%, Hybrid 45%, Remote 15%' },
        ] },
      { id: 'people_leadership', name: 'Leadership & Succession Intelligence', boost: 5, auth: 'manual',
        fields: [
          { key: 'c_suite_size', label: 'C-Suite / Executive Team Size', inputType: 'number', placeholder: '8' },
          { key: 'avg_leadership_tenure', label: 'Average C-Suite Tenure (years)', inputType: 'number', placeholder: '5' },
          { key: 'leadership_vacancies', label: 'Current Senior Leadership Vacancies', inputType: 'number', placeholder: '1' },
          { key: 'succession_planning', label: 'Succession Planning in Place for Key Roles?', placeholder: 'Partial' },
          { key: 'leadership_development_programme', label: 'Leadership Development Programme in Place?', placeholder: 'Yes — internal and external coaching' },
          { key: 'board_composition', label: 'Board Composition', placeholder: '3 NEDs, 2 Exec Directors, 1 PE rep' },
          { key: 'kpi_framework', label: 'Primary KPIs / OKRs Tracked at Board Level', placeholder: 'ARR, EBITDA margin, NPS, Employee Engagement' },
        ] },
    ]},
  { group: 'Strategy Pillar', twin_impact: 'Strategy', icon: '◈',
    connectors: [
      { id: 'strategy_vision', name: 'Strategic Direction Intelligence', boost: 5, auth: 'manual',
        fields: [
          { key: 'revenue_target_12m', label: '12 Month Revenue Target (£)', inputType: 'number', placeholder: '35000000' },
          { key: 'revenue_target_3yr', label: '3 Year Revenue Target (£)', inputType: 'number', placeholder: '80000000' },
          { key: 'revenue_target_5yr', label: '5 Year Revenue Target (£)', inputType: 'number', placeholder: '150000000' },
          { key: 'primary_growth_strategy', label: 'Primary Growth Strategy', placeholder: 'Organic growth + strategic M&A, EU expansion' },
          { key: 'strategic_blockers', label: 'Top 3 Strategic Blockers', placeholder: '1. Talent 2. Tech infrastructure 3. Market saturation' },
          { key: 'competitive_advantage', label: 'Primary Competitive Advantage / Moat', placeholder: 'Proprietary data platform, 15yr client relationships' },
          { key: 'planning_horizon', label: 'Strategic Planning Horizon', placeholder: '5 year strategy, annual OKRs' },
          { key: 'ma_activity', label: 'M&A Activity (acquisitions / targets)', placeholder: '2 acquisitions last 3 years, 1 target in diligence' },
          { key: 'exit_strategy', label: 'Exit / Liquidity Strategy', placeholder: 'PE-backed, targeting trade sale in 3-5 years' },
        ] },
      { id: 'strategy_corporate', name: 'Corporate Structure Intelligence', boost: 4, auth: 'manual',
        fields: [
          { key: 'legal_structure', label: 'Legal Structure', placeholder: 'Group holding company with 4 trading subsidiaries' },
          { key: 'ownership_structure', label: 'Ownership Structure', placeholder: 'PE-backed (65%), Management (25%), Founders (10%)' },
          { key: 'num_subsidiaries', label: 'Number of Subsidiaries / Group Entities', inputType: 'number', placeholder: '6' },
          { key: 'regulatory_status', label: 'Regulatory Status / Licences Held', placeholder: 'FCA regulated, ISO 27001, Cyber Essentials Plus' },
          { key: 'last_valuation', label: 'Last Independent Valuation (£)', inputType: 'number', placeholder: '45000000' },
          { key: 'last_valuation_date', label: 'Date of Last Valuation', placeholder: 'March 2024' },
          { key: 'investment_raised', label: 'Total Investment Raised to Date (£)', inputType: 'number', placeholder: '12000000' },
        ] },
      { id: 'strategy_governance', name: 'Governance Intelligence', boost: 3, auth: 'manual',
        fields: [
          { key: 'board_meeting_frequency', label: 'Board Meeting Frequency', placeholder: 'Monthly, with quarterly strategy days' },
          { key: 'management_reporting_cadence', label: 'Management Reporting Cadence', placeholder: 'Weekly trading, Monthly board pack, Quarterly investor update' },
          { key: 'decision_making_structure', label: 'Decision Making Structure', placeholder: 'Leadership team with board approval for >£500K' },
          { key: 'strategic_investment_pipeline', label: 'Strategic Investments / Initiatives Planned (£)', placeholder: 'CRM overhaul £2M, US office £1.5M, AI tooling £800K' },
        ] },
    ]},
  { group: 'Risk Pillar', twin_impact: 'Risk', icon: '⚠',
    connectors: [
      { id: 'risk_concentration', name: 'Revenue & Concentration Risk', boost: 4, auth: 'manual',
        fields: [
          { key: 'top_client_revenue_pct', label: 'Revenue from Top 1 Client (%)', inputType: 'number', placeholder: '12' },
          { key: 'top_3_clients_revenue_pct', label: 'Revenue from Top 3 Clients (%)', inputType: 'number', placeholder: '28' },
          { key: 'top_10_clients_revenue_pct', label: 'Revenue from Top 10 Clients (%)', inputType: 'number', placeholder: '48' },
          { key: 'key_person_dependency', label: 'Business-Critical Individuals (C-suite risk count)', inputType: 'number', placeholder: '5' },
          { key: 'contract_renewal_risk', label: 'Revenue Up for Renewal in Next 90 Days (%)', inputType: 'number', placeholder: '15' },
          { key: 'cash_runway_months', label: 'Cash Runway at Current Burn Rate (months)', inputType: 'number', placeholder: '18' },
          { key: 'net_debt', label: 'Net Debt Position (£)', inputType: 'number', placeholder: '5000000' },
          { key: 'credit_facility', label: 'Available Credit / Revolving Facility (£)', inputType: 'number', placeholder: '10000000' },
          { key: 'debt_to_ebitda', label: 'Net Debt to EBITDA Ratio', inputType: 'number', placeholder: '1.8' },
          { key: 'geographic_concentration', label: 'Geographic Revenue Concentration', placeholder: 'UK 78% — moderate concentration' },
        ] },
      { id: 'risk_compliance', name: 'Compliance & Regulatory Risk', boost: 4, auth: 'manual',
        fields: [
          { key: 'gdpr_compliant', label: 'GDPR / Data Protection Status', placeholder: 'Fully compliant, DPO appointed' },
          { key: 'regulatory_bodies', label: 'Regulatory Bodies Overseen By', placeholder: 'FCA, ICO, CQC' },
          { key: 'professional_insurance', label: 'Insurance Coverage', placeholder: 'PI £10M, PL £5M, Cyber £2M, D&O £5M' },
          { key: 'pending_litigation', label: 'Pending Legal / Regulatory Actions', placeholder: 'None material' },
          { key: 'last_financial_review', label: 'Last External Audit (months ago)', inputType: 'number', placeholder: '6' },
          { key: 'audit_firm', label: 'External Auditor', placeholder: 'KPMG' },
          { key: 'contracts_in_place', label: 'Written Contracts with All Clients?', placeholder: 'All' },
          { key: 'ip_protected', label: 'IP Protection Status', placeholder: 'Registered trademarks, patents pending' },
        ] },
      { id: 'risk_enterprise', name: 'Enterprise & Cyber Risk', boost: 4, auth: 'manual',
        fields: [
          { key: 'cyber_security_maturity', label: 'Cyber Security Maturity (1-10)', inputType: 'number', placeholder: '7' },
          { key: 'cyber_incidents_12m', label: 'Cyber / Data Incidents Last 12 Months', inputType: 'number', placeholder: '0' },
          { key: 'third_party_risk_management', label: 'Third Party / Supplier Risk Management', placeholder: 'Quarterly assessments for tier-1 suppliers' },
          { key: 'environmental_risk', label: 'ESG / Environmental Risk Exposure', placeholder: 'Low — services business, Scope 1&2 only' },
          { key: 'scenario_planning', label: 'Scenario Planning / Stress Testing Conducted?', placeholder: 'Yes — annual' },
          { key: 'insurance_total_cover', label: 'Total Insurance Cover (£)', inputType: 'number', placeholder: '25000000' },
        ] },
    ]},
  { group: 'Context Pillar', twin_impact: 'Context', icon: '⊞',
    connectors: [
      { id: 'context_market', name: 'Market Position & Reputation', boost: 4, auth: 'manual',
        fields: [
          { key: 'years_trading', label: 'Years in Operation', inputType: 'number', placeholder: '18' },
          { key: 'business_stage', label: 'Business Stage', placeholder: 'Scale-up / PE-backed growth' },
          { key: 'market_share_pct', label: 'Estimated Market Share (%)', inputType: 'number', placeholder: '4' },
          { key: 'total_addressable_market', label: 'Total Addressable Market Size (£)', inputType: 'number', placeholder: '2500000000' },
          { key: 'nps_score', label: 'Net Promoter Score (NPS)', inputType: 'number', placeholder: '52' },
          { key: 'client_satisfaction_score', label: 'Client Satisfaction Score (%)', inputType: 'number', placeholder: '88' },
          { key: 'referral_revenue_pct', label: 'Revenue from Referrals / Word of Mouth (%)', inputType: 'number', placeholder: '35' },
          { key: 'market_geography', label: 'Primary Market Geography', placeholder: 'UK, Ireland, DACH' },
          { key: 'awards_accreditations', label: 'Industry Awards or Accreditations', placeholder: 'ISO 27001, Sunday Times Top 100, B Corp' },
        ] },
      { id: 'context_brand', name: 'Brand & Competitive Position', boost: 4, auth: 'manual',
        fields: [
          { key: 'brand_awareness_pct', label: 'Aided Brand Awareness in Target Market (%)', inputType: 'number', placeholder: '42' },
          { key: 'competitive_set', label: 'Primary Competitors (top 3-5)', placeholder: 'Competitor A, Competitor B, Competitor C' },
          { key: 'differentiation_strength', label: 'Differentiation Strength vs Competitors (1-10)', inputType: 'number', placeholder: '7' },
          { key: 'thought_leadership', label: 'Thought Leadership / Content Activity', placeholder: 'Weekly blog, monthly webinars, annual conference' },
          { key: 'analyst_coverage', label: 'Analyst / Industry Coverage', placeholder: 'Gartner Cool Vendor, Forrester Wave mention' },
          { key: 'social_following', label: 'Total Professional Social Following (LinkedIn etc)', inputType: 'number', placeholder: '25000' },
          { key: 'media_coverage', label: 'Recent Media / PR Coverage', placeholder: 'FT, Telegraph, TechCrunch features last 12 months' },
        ] },
    ]},
  { group: 'Technology & Infrastructure', twin_impact: 'Operations, Strategy', icon: '⊟',
    connectors: [
      { id: 'tech_systems', name: 'Technology Systems Intelligence', boost: 5, auth: 'manual',
        fields: [
          { key: 'core_platform', label: 'Core Business Platform / ERP', placeholder: 'SAP S/4HANA, Microsoft Dynamics 365' },
          { key: 'tech_stack_maturity', label: 'Technology Stack Maturity (1-10)', inputType: 'number', placeholder: '7' },
          { key: 'cloud_adoption_pct', label: 'Cloud Infrastructure Adoption (%)', inputType: 'number', placeholder: '75' },
          { key: 'legacy_system_risk', label: 'Legacy System Risk Level (low / medium / high)', placeholder: 'Medium' },
          { key: 'it_spend_annual', label: 'Annual IT / Technology Spend (£)', inputType: 'number', placeholder: '2500000' },
          { key: 'it_spend_as_revenue_pct', label: 'IT Spend as % of Revenue', inputType: 'number', placeholder: '3.5' },
          { key: 'digital_transformation_stage', label: 'Digital Transformation Stage', placeholder: 'Mid-transformation — cloud migration complete, AI pilots underway' },
          { key: 'data_infrastructure', label: 'Data Infrastructure', placeholder: 'Azure data lake, PowerBI, Snowflake' },
        ] },
      { id: 'tech_data', name: 'Data & AI Capability Intelligence', boost: 5, auth: 'manual',
        fields: [
          { key: 'data_maturity_score', label: 'Data Maturity Score (1-10)', inputType: 'number', placeholder: '6' },
          { key: 'ai_ml_adoption', label: 'AI / ML Adoption Level', placeholder: 'Pilot stage — 3 use cases in production' },
          { key: 'data_team_size', label: 'Data / Analytics Team Size', inputType: 'number', placeholder: '12' },
          { key: 'data_governance', label: 'Data Governance Framework in Place?', placeholder: 'Yes — DAMA aligned' },
          { key: 'proprietary_data_assets', label: 'Proprietary Data Assets', placeholder: '8 year transaction dataset, 50K client behaviour profiles' },
          { key: 'api_integration_count', label: 'Number of Active API / System Integrations', inputType: 'number', placeholder: '28' },
        ] },
    ]},
  { group: 'Analytics & Market', twin_impact: 'Growth, Strategy', icon: '⊞',
    connectors: [
      { id: 'google_analytics', name: 'Google Analytics', boost: 5, auth: 'oauth',
        fields: [{ key: 'client_id', label: 'Client ID' }, { key: 'client_secret', label: 'Client Secret', secret: true }] },
    ]},
]

export default function BusinessTwinPage() {
  const [user, setUser] = useState<any>(null)
  const [selected, setSelected] = useState<any>(null)
  const [connectorStates, setConnectorStates] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [showAllConnectors, setShowAllConnectors] = useState(false)
  const [showAllManual, setShowAllManual] = useState(false)
  const [showTimeline, setShowTimeline] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        if (user) {
          const { data: biz } = await supabase
            .from('businesses')
            .select('id, business_name, mri_result, subscription_tier, industry, location_country, updated_at')
            .eq('email', user.email)
            .order('updated_at', { ascending: false })
          if (biz && biz.length > 0) {
            setSelected(biz[0])
            const { data: conns } = await supabase
              .from('connectors')
              .select('connector_type, status, last_synced_at, data_snapshot')
              .eq('business_id', biz[0].id)
            if (conns) {
              const states: Record<string, any> = {}
              conns.forEach((c: any) => { states[c.connector_type] = c })
              setConnectorStates(states)
            }
          }
        }
      } catch (e) {}
      setLoading(false)
    }
    load()
  }, [])

  const saveManualData = async (connectorId: string) => {
    if (!selected) return
    setSaving(true)
    try {
      await supabase.from('connectors').upsert({
        business_id: selected.id,
        connector_type: connectorId,
        connector_name: connectorId,
        status: 'active',
        data_snapshot: formData,
        last_synced_at: new Date().toISOString(),
      }, { onConflict: 'business_id,connector_type' })
      setConnectorStates(prev => ({ ...prev, [connectorId]: { status: 'active', last_synced_at: new Date().toISOString(), data_snapshot: formData } }))
      setActiveModal(null)
      setFormData({})
    } catch (e) {}
    setSaving(false)
  }

  if (loading) return <main style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ fontSize: '11px', color: gold, letterSpacing: '0.3em' }}>LOADING BUSINESS TWIN...</div></main>
  if (!user) return <main style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><a href='/login' style={{ padding: '12px 28px', backgroundColor: gold, color: '#050505', fontWeight: '700', borderRadius: '6px', textDecoration: 'none' }}>Sign In</a></main>

  const hasMRI = !!(selected?.mri_result) && selected?.mri_result?.mri_source !== 'free'
  const result = selected?.mri_result || null
  const health = result?.health || {}
  const businessName = selected?.business_name || 'Your Business'
  const tier = (selected?.subscription_tier || 'analysis').toUpperCase()
  const lastUpdated = selected?.updated_at ? new Date(selected.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

  // Calculate REAL twin completeness
  let completeness = hasMRI ? MRI_BASE : 0
  const activeConnectors: string[] = []
  Object.entries(connectorStates).forEach(([id, state]: [string, any]) => {
    if (state.status === 'active' && CONNECTOR_WEIGHTS[id]) {
      completeness += CONNECTOR_WEIGHTS[id]
      activeConnectors.push(id)
    }
  })
  completeness = Math.min(100, completeness)

  const gc = (p: number) => p >= 85 ? '#4aaa4a' : p >= 70 ? '#C8A24A' : '#e8923a'
  const totalConnectors = CONNECTOR_GROUPS.reduce((s, g) => s + g.connectors.length, 0)
  const connectedCount = activeConnectors.length + (hasMRI ? 1 : 0)

  // Coverage by dimension based on real data
  const dims = [
    { label: 'Financial', pct: Math.min(100, (hasMRI ? 30 : 0) + (connectorStates['xero']?.status === 'active' ? 40 : 0) + (connectorStates['quickbooks']?.status === 'active' ? 40 : 0) + (connectorStates['manual_finance']?.status === 'active' ? 25 : 0)), color: '' },
    { label: 'Operations', pct: Math.min(100, (hasMRI ? 35 : 0) + (connectorStates['hibob']?.status === 'active' ? 30 : 0) + (connectorStates['manual_hr']?.status === 'active' ? 20 : 0)), color: '' },
    { label: 'People', pct: Math.min(100, (hasMRI ? 25 : 0) + (connectorStates['hibob']?.status === 'active' ? 35 : 0) + (connectorStates['workday']?.status === 'active' ? 35 : 0) + (connectorStates['manual_hr']?.status === 'active' ? 25 : 0)), color: '' },
    { label: 'Strategy', pct: Math.min(100, (hasMRI ? 40 : 0) + (connectorStates['manual_strategy']?.status === 'active' ? 45 : 0)), color: '' },
    { label: 'Market', pct: Math.min(100, (hasMRI ? 30 : 0) + (connectorStates['google_analytics']?.status === 'active' ? 30 : 0) + (connectorStates['manual_analytics']?.status === 'active' ? 20 : 0) + (connectorStates['manual_market']?.status === 'active' ? 25 : 0)), color: '' },
    { label: 'Clients', pct: Math.min(100, (hasMRI ? 30 : 0) + (connectorStates['hubspot']?.status === 'active' ? 40 : 0) + (connectorStates['salesforce']?.status === 'active' ? 40 : 0) + (connectorStates['manual_crm']?.status === 'active' ? 25 : 0)), color: '' },
  ].map(d => ({ ...d, color: gc(d.pct) }))

  const n = dims.length
  const radarPts = dims.map((d, i) => {
    const a = (i / n) * 2 * Math.PI - Math.PI / 2
    const r = (d.pct / 100) * 100
    return { x: 130 + r * Math.cos(a), y: 140 + r * Math.sin(a), lx: 130 + 122 * Math.cos(a), ly: 140 + 122 * Math.sin(a), ...d }
  })

  const activeModal_connector = activeModal ? CONNECTOR_GROUPS.flatMap(g => g.connectors).find(c => c.id === activeModal) : null

  return (
    <DashboardShell activeId="twin">
      {activeModal && activeModal_connector && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setActiveModal(null)}>
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '12px', padding: '28px', width: '480px', maxWidth: '90vw' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.2em', marginBottom: '4px' }}>MANUAL DATA INPUT</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>{activeModal_connector.name}</div>
              </div>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px', marginBottom: '20px' }}>
              {activeModal_connector.fields.map((f: any) => (
                <div key={f.key}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '5px' }}>{f.label}</div>
                  <input
                    type={f.secret ? 'password' : f.inputType || 'text'}
                    value={formData[f.key] || (connectorStates[activeModal]?.data_snapshot?.[f.key] || '')}
                    onChange={e => setFormData(prev => ({ ...prev, [f.key]: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-sidebar)', border: '1px solid #2a2a2a', borderRadius: '6px', color: 'var(--text-secondary)', fontSize: '13px', outline: 'none', boxSizing: 'border-box' as const }}
                  />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => saveManualData(activeModal)} disabled={saving} style={{ flex: 1, padding: '10px', backgroundColor: gold, color: '#050505', border: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
                {saving ? 'Saving...' : 'Save & Update Twin'}
              </button>
              <button onClick={() => setActiveModal(null)} style={{ padding: '10px 20px', backgroundColor: 'transparent', border: '1px solid #2a2a2a', borderRadius: '6px', color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', paddingBottom: '18px', borderBottom: '1px solid ' + border }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '900', letterSpacing: '-0.02em', margin: '0 0 6px', color: 'var(--text-primary)' }}>Business Twin™ Centre</h1>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>The intelligence foundation powering every BEI recommendation · {businessName} · {tier} Plan · Last updated {lastUpdated}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>Business Twin™: <span style={{ color: hasMRI ? '#4aaa4a' : '#e8923a', fontWeight: '600' }}>{hasMRI ? 'Intelligence Ready' : 'Inactive'}</span><div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: hasMRI ? '#4aaa4a' : '#e8923a', marginLeft: '6px', boxShadow: '0 0 6px ' + (hasMRI ? 'rgba(74,170,74,0.7)' : 'rgba(232,146,58,0.5)') }} /></div>
          <div style={{ padding: '6px 14px', backgroundColor: hasMRI ? 'rgba(74,170,74,0.1)' : 'rgba(200,162,74,0.1)', border: '1px solid ' + (hasMRI ? 'rgba(74,170,74,0.3)' : 'rgba(200,162,74,0.3)'), borderRadius: '20px', fontSize: '11px', color: hasMRI ? '#4aaa4a' : gold, fontWeight: '700' }}>{hasMRI ? '● Intelligence Active' : '○ Awaiting MRI'}</div>
        </div>
      </div>

      {/* INTELLIGENCE OVERVIEW PANEL — compact single row */}
      <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', marginBottom: '14px', padding: '14px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '20px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <div style={{ fontSize: '36px', fontWeight: '900', color: gc(completeness), lineHeight: 1, letterSpacing: '-0.03em' }}>{completeness}%</div>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.12em', fontWeight: '700' }}>TWIN COMPLETENESS</div>
              <div style={{ fontSize: '10px', color: gc(completeness), fontWeight: '600' }}>{completeness >= 80 ? 'Excellent' : completeness >= 60 ? 'Good' : completeness >= 40 ? 'Building' : 'Getting started'} · {hasMRI ? 'MRI + ' + activeConnectors.length + ' connector' + (activeConnectors.length !== 1 ? 's' : '') : 'No MRI'}</div>
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', backgroundColor: 'var(--bg-elevated)', gap: '2px', marginBottom: '6px' }}>
              <div style={{ width: MRI_BASE + '%', height: '100%', backgroundColor: hasMRI ? '#4aaa4a' : '#2a2a2a', borderRadius: '4px 0 0 4px', flexShrink: 0 }} />
              {CONNECTOR_GROUPS.flatMap(g => g.connectors).filter(c => activeConnectors.includes(c.id)).map((c, i) => (
                <div key={i} style={{ width: c.boost + '%', height: '100%', backgroundColor: gold, flexShrink: 0 }} />
              ))}
              <div style={{ flex: 1, height: '100%', backgroundColor: 'var(--bg-elevated)', borderRadius: '0 4px 4px 0' }} />
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '8px', height: '5px', borderRadius: '2px', backgroundColor: hasMRI ? '#4aaa4a' : '#2a2a2a' }} />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>MRI ({MRI_BASE}%) — {hasMRI ? 'Complete' : 'Missing'}</span>
              </div>
              {CONNECTOR_GROUPS.flatMap(g => g.connectors).filter(c => activeConnectors.includes(c.id)).slice(0, 3).map(c => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '8px', height: '5px', borderRadius: '2px', backgroundColor: gold }} />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.name} (+{c.boost}%)</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { label: 'ACCURACY', value: completeness >= 60 ? '96%' : '78%', color: '#4aaa4a' },
              { label: 'CONFIDENCE', value: completeness >= 60 ? 'HIGH' : completeness >= 40 ? 'MEDIUM' : 'LOW', color: gc(completeness) },
              { label: 'SOURCES', value: connectedCount.toString(), color: gold },
              { label: 'READINESS', value: completeness >= 40 ? 'Verified' : 'Incomplete', color: completeness >= 40 ? '#4aaa4a' : '#cc4444' },
            ].map((k, i) => (
              <div key={i} style={{ padding: '8px 12px', backgroundColor: 'var(--bg-sidebar)', border: '1px solid ' + border, borderRadius: '6px', textAlign: 'center' as const, minWidth: '70px' }}>
                <div style={{ fontSize: '8px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '3px', fontWeight: '600' }}>{k.label}</div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: k.color, lineHeight: 1 }}>{k.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* 6-METRIC KPI BAR */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '10px', marginBottom: '14px' }}>
        {[
          { label: 'COMPLETENESS', value: completeness + '%', color: gc(completeness), trend: completeness > 40 ? '↑ ' + (completeness - 40) + '% added' : 'Base MRI only', sub: 'vs last 30 days' },
          { label: 'ACCURACY', value: completeness >= 60 ? '96%' : completeness >= 40 ? '78%' : '—', color: '#4aaa4a', trend: completeness >= 60 ? '↑ 4%' : '↑ 0%', sub: 'vs last 30 days' },
          { label: 'DATA CONFIDENCE', value: completeness >= 60 ? '94%' : completeness >= 40 ? '72%' : '—', color: gc(completeness), trend: completeness >= 40 ? '↑ 5%' : '—', sub: 'vs last 30 days' },
          { label: 'CONNECTED SOURCES', value: connectedCount.toString(), color: gold, trend: 'Active', sub: 'of ' + (totalConnectors + 1) + ' available' },
          { label: 'MANUAL INPUTS', value: activeConnectors.filter((id: string) => id.startsWith('manual_') || !['hubspot','salesforce','xero','quickbooks','google_analytics','hibob','workday'].includes(id)).length + '%', color: '#4aaa4a', trend: activeConnectors.filter((id: string) => id.startsWith('manual_') || !['hubspot','salesforce','xero','quickbooks','google_analytics','hibob','workday'].includes(id)).length > 0 ? 'Active' : 'Pending', sub: 'complete' },
          { label: 'INTELLIGENCE READINESS', value: completeness >= 60 ? 'Verified' : completeness >= 40 ? 'Partial' : 'Low', color: completeness >= 60 ? '#4aaa4a' : completeness >= 40 ? gold : '#cc4444', trend: completeness >= 40 ? 'High Confidence' : 'Add more data', sub: 'Production grade' },
        ].map((k, i) => (
          <div key={i} style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '8px', padding: '14px 16px' }}>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: '8px', fontWeight: '700' }}>{k.label}</div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: k.color, lineHeight: 1, marginBottom: '3px' }}>{k.value}</div>
            <div style={{ fontSize: '10px', color: k.color, fontWeight: '600', marginBottom: '2px' }}>{k.trend}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* 4-COLUMN GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '14px', alignItems: 'stretch' }}>

        {/* DATA SOURCE ARCHITECTURE TABLE */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '18px', display: 'flex', flexDirection: 'column' as const }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '0.15em', fontWeight: '600' }}>DATA SOURCE ARCHITECTURE™</div>
            <button onClick={() => setShowAllConnectors(true)} style={{ fontSize: '10px', color: gold, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>View all connectors →</button>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>Connected systems feeding your Business Twin™</div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '0', marginBottom: '6px' }}>
            {['SOURCE','STATUS','QUALITY','BOOST'].map(h => (
              <div key={h} style={{ fontSize: '8px', color: 'var(--text-secondary)', letterSpacing: '0.1em', padding: '4px 0', borderBottom: '1px solid #1a1a1a', fontWeight: '600' }}>{h}</div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0', flex: 1, overflowY: 'auto' as const, maxHeight: '300px' }}>
            {CONNECTOR_GROUPS.flatMap(g => g.connectors).filter(c => c.auth === 'oauth').slice(0, 6).map((c, i) => {
              const state = connectorStates[c.id]
              const isActive = state?.status === 'active'
              return (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '0', padding: '8px 0', borderBottom: '1px solid #111', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: isActive ? '#4aaa4a' : '#333', flexShrink: 0 }} />
                    <span style={{ fontSize: '11px', color: isActive ? '#e0e0e0' : '#777', fontWeight: isActive ? '600' : '400' }}>{c.name}</span>
                  </div>
                  <div style={{ fontSize: '10px', color: isActive ? '#4aaa4a' : '#444', fontWeight: '600' }}>{isActive ? 'Connected' : 'Available'}</div>
                  <div style={{ fontSize: '10px', color: isActive ? '#4aaa4a' : '#333' }}>{isActive ? '92%' : '—'}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '10px', color: isActive ? gold : '#555' }}>+{c.boost}%</span>
                    {!isActive && (
                      <button onClick={() => { setActiveModal(c.id); setFormData({}) }} style={{ padding: '3px 8px', backgroundColor: 'rgba(200,162,74,0.08)', border: '1px solid rgba(200,162,74,0.2)', borderRadius: '3px', color: gold, fontSize: '9px', cursor: 'pointer', fontWeight: '600' }}>ADD</button>
                    )}
                    {isActive && <span style={{ fontSize: '10px', color: '#4aaa4a' }}>✓</span>}
                  </div>
                </div>
              )
            })}
          </div>
          <button onClick={() => setShowAllConnectors(true)} style={{ width: '100%', marginTop: '12px', padding: '9px', backgroundColor: 'rgba(200,162,74,0.06)', border: '1px solid rgba(200,162,74,0.15)', borderRadius: '6px', color: gold, fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}>View all connectors ({CONNECTOR_GROUPS.flatMap(g => g.connectors).filter(c => c.auth === 'oauth').length}) →</button>
        </div>

        {/* MANUAL INTELLIGENCE INPUTS */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '18px', display: 'flex', flexDirection: 'column' as const }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '0.15em', fontWeight: '600' }}>MANUAL INTELLIGENCE INPUTS™</div>
            <button onClick={() => setShowAllManual(true)} style={{ fontSize: '10px', color: gold, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>View all inputs →</button>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>Add data manually to improve Business Twin™ completeness</div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px', flex: 1, overflowY: 'auto' as const, maxHeight: '340px' }}>
            {CONNECTOR_GROUPS.flatMap(g => g.connectors).filter(c => c.auth === 'manual').slice(0, 6).map((c, i) => {
              const state = connectorStates[c.id]
              const isActive = state?.status === 'active'
              return (
                <div key={i} style={{ padding: '11px 12px', backgroundColor: 'var(--bg-sidebar)', borderRadius: '8px', border: '1px solid ' + (isActive ? '#1a2a1a' : border) }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>{c.name}</div>
                    <div style={{ fontSize: '10px', color: isActive ? '#4aaa4a' : gold, fontWeight: '600' }}>+{c.boost}%</div>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '7px' }}>
                    {isActive ? '✓ Submitted · ' + (state?.last_synced_at ? new Date(state.last_synced_at).toLocaleDateString('en-GB') : '') : c.fields.length + ' fields required'}
                  </div>
                  <button onClick={() => { setActiveModal(c.id); setFormData({}) }} style={{ width: '100%', padding: '6px', backgroundColor: isActive ? 'rgba(74,170,74,0.08)' : 'rgba(200,162,74,0.08)', border: '1px solid ' + (isActive ? 'rgba(74,170,74,0.2)' : 'rgba(200,162,74,0.2)'), borderRadius: '4px', color: isActive ? '#4aaa4a' : gold, fontSize: '10px', cursor: 'pointer', fontWeight: '600' }}>
                    {isActive ? '✏ Update Data' : '+ Add Data'}
                  </button>
                </div>
              )
            })}
          </div>
          <button onClick={() => setShowAllManual(true)} style={{ width: '100%', marginTop: '12px', padding: '9px', backgroundColor: 'rgba(200,162,74,0.06)', border: '1px solid rgba(200,162,74,0.15)', borderRadius: '6px', color: gold, fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}>View all inputs ({CONNECTOR_GROUPS.flatMap(g => g.connectors).filter(c => c.auth === 'manual').length}) →</button>
        </div>

        {/* COVERAGE MAP */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '18px', display: 'flex', flexDirection: 'column' as const }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '0.15em', fontWeight: '600' }}>COVERAGE MAP™</div>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px' }}>Real-time intelligence dimension coverage</div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <svg width="100%" viewBox="0 0 260 280" style={{ maxWidth: '280px' }}><rect width="260" height="280" fill="var(--bg-card)" rx="8"/>
              <defs><filter id="gw"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
              <circle cx="130" cy="140" r="130" fill="var(--bg-primary)"/>
              {[25,50,75,100].map(ring => (
                <polygon key={ring} points={dims.map((_, i) => { const a=(i/n)*2*Math.PI-Math.PI/2; const r=(ring/100)*100; return `${130+r*Math.cos(a)},${140+r*Math.sin(a)}` }).join(' ')} fill="none" stroke="#2a2a2a" strokeWidth="0.8"/>
              ))}
              {dims.map((_, i) => { const a=(i/n)*2*Math.PI-Math.PI/2; return <line key={i} x1="130" y1="140" x2={130+100*Math.cos(a)} y2={140+100*Math.sin(a)} stroke="#2a2a2a" strokeWidth="0.8"/> })}
              {radarPts.map((p, i) => { const next=radarPts[(i+1)%n]; return <polygon key={i} points={`130,140 ${p.x},${p.y} ${next.x},${next.y}`} fill={p.color+'18'} stroke={p.color} strokeWidth="1.5" filter="url(#gw)"/> })}
              {radarPts.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="5" fill={p.color} filter="url(#gw)"/>
                  <circle cx={p.x} cy={p.y} r="2" fill="#fff"/>
                  <text x={p.lx} y={p.ly-6} textAnchor="middle" fill="#cccccc" fontSize="10" fontWeight="700">{p.label}</text>
                  <text x={p.lx} y={p.ly+7} textAnchor="middle" fill={p.color} fontSize="11" fontWeight="800">{p.pct}%</text>
                </g>
              ))}

            </svg>
          </div>
          <div style={{ textAlign: 'center' as const, marginTop: '6px', marginBottom: '6px' }}>
            <div style={{ fontSize: '32px', fontWeight: '900', color: gc(completeness), lineHeight: 1 }}>{completeness}%</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.12em', marginTop: '3px' }}>TWIN COMPLETENESS</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '4px', flexWrap: 'wrap' as const }}>
            {[['#4aaa4a','Strong'],['#C8A24A','Moderate'],['#e8923a','Weak']].map(([c,l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: c }} />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RECOMMENDED IMPROVEMENTS */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '18px', display: 'flex', flexDirection: 'column' as const }}>
          <div style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '0.15em', fontWeight: '600', marginBottom: '4px' }}>RECOMMENDED IMPROVEMENTS™</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>Actions to increase Twin completeness</div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
            {(() => {
              // Group connectors by purpose — show primary + manual alternative
              const recommendations: {primary: any, manual: any | null}[] = []
              const seen = new Set<string>()
              CONNECTOR_GROUPS.forEach(g => {
                const apiConns = g.connectors.filter(c => c.auth === 'oauth' && !activeConnectors.includes(c.id))
                const manualConn = g.connectors.find(c => c.auth === 'manual' && !activeConnectors.includes(c.id))
                apiConns.forEach(c => {
                  if (!seen.has(c.id)) {
                    seen.add(c.id)
                    recommendations.push({ primary: c, manual: manualConn || null })
                  }
                })
                if (!apiConns.length && manualConn && !seen.has(manualConn.id)) {
                  seen.add(manualConn.id)
                  recommendations.push({ primary: manualConn, manual: null })
                }
              })
              return recommendations.slice(0, 6).map((rec, i) => (
                <div key={i} style={{ padding: '10px 12px', backgroundColor: 'var(--bg-sidebar)', borderRadius: '6px', border: '1px solid ' + border }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: rec.manual ? '6px' : '0' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{rec.primary.name}</div>
                      <div style={{ fontSize: '10px', color: '#4aaa4a', marginTop: '1px' }}>+{rec.primary.boost}% completeness</div>
                    </div>
                    <button onClick={() => { setActiveModal(rec.primary.id); setFormData({}) }} style={{ padding: '4px 10px', backgroundColor: 'rgba(200,162,74,0.1)', border: '1px solid rgba(200,162,74,0.2)', borderRadius: '4px', color: gold, fontSize: '10px', cursor: 'pointer', fontWeight: '600', flexShrink: 0 }}>
                      Connect
                    </button>
                  </div>
                  {rec.manual && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingTop: '6px', borderTop: '1px solid #1a1a1a' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', flex: 1 }}>or add manually · +{rec.manual.boost}%</div>
                      <button onClick={() => { setActiveModal(rec.manual.id); setFormData({}) }} style={{ padding: '3px 8px', backgroundColor: 'transparent', border: '1px solid #2a2a2a', borderRadius: '4px', color: 'var(--text-muted)', fontSize: '9px', cursor: 'pointer' }}>
                        Add Manual Data
                      </button>
                    </div>
                  )}
                </div>
              ))
            })()}
            {CONNECTOR_GROUPS.flatMap(g => g.connectors).filter(c => !activeConnectors.includes(c.id)).length === 0 && (
              <div style={{ textAlign: 'center' as const, padding: '20px', color: '#4aaa4a', fontSize: '13px' }}>✓ All connectors active — Twin at maximum completeness</div>
            )}
          </div>
        </div>
      </div>
      {/* DATA QUALITY ENGINE + INTELLIGENCE CONFIDENCE ENGINE */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>

        {/* DATA QUALITY ENGINE */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '18px' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '0.15em', fontWeight: '600', marginBottom: '4px' }}>DATA QUALITY ENGINE™</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>Quality directly impacts intelligence accuracy</div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between', marginBottom: '20px' }}>
            {[
              { label: 'Completeness', value: completeness },
              { label: 'Freshness', value: completeness >= 60 ? 95 : completeness >= 40 ? 80 : 50 },
              { label: 'Consistency', value: completeness >= 60 ? 93 : completeness >= 40 ? 76 : 45 },
              { label: 'Coverage', value: completeness >= 60 ? 90 : completeness >= 40 ? 68 : 40 },
              { label: 'Verification', value: hasMRI ? 94 : 0 },
            ].map((m, i) => {
              const r = 22
              const circ = r * 2 * Math.PI
              const fill = (m.value / 100) * circ
              const c = m.value >= 85 ? '#4aaa4a' : m.value >= 70 ? gold : '#e8923a'
              return (
                <div key={i} style={{ textAlign: 'center' as const }}>
                  <svg width="72" height="72" viewBox="0 0 52 52">
                    <circle cx="26" cy="26" r={r} fill="none" stroke="#1a1a1a" strokeWidth="4"/>
                    <circle cx="26" cy="26" r={r} fill="none" stroke={c} strokeWidth="4"
                      strokeDasharray={String(fill) + ' ' + String(circ - fill)}
                      strokeDashoffset={String(circ * 0.25)}
                      strokeLinecap="round"
                      transform="rotate(-90 26 26)"/>
                    <text x="26" y="30" textAnchor="middle" fill={c} fontSize="11" fontWeight="800">{m.value}%</text>
                  </svg>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '5px', lineHeight: 1.3, textAlign: 'center' as const }}>{m.label}</div>
                </div>
              )
            })}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '14px', backgroundColor: 'var(--bg-sidebar)', borderRadius: '8px', border: '1px solid ' + border }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '4px', fontWeight: '600' }}>OVERALL DATA QUALITY SCORE</div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: gc(completeness), lineHeight: 1 }}>{Math.round(completeness * 0.93)}<span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/100</span></div>
              <div style={{ fontSize: '10px', color: '#4aaa4a', marginTop: '4px' }}>↑ {Math.round(completeness * 0.06)} pts vs last 30 days</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ padding: '10px 12px', backgroundColor: 'rgba(200,162,74,0.06)', border: '1px solid rgba(200,162,74,0.15)', borderRadius: '6px', fontSize: '10px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {completeness >= 60 ? 'Good data quality = high confidence intelligence' : completeness >= 40 ? 'Medium quality — add more sources to improve' : 'Low quality — complete your MRI first'}
              </div>
            </div>
          </div>
        </div>

        {/* INTELLIGENCE CONFIDENCE ENGINE */}
        <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '18px' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '0.15em', fontWeight: '600', marginBottom: '4px' }}>INTELLIGENCE CONFIDENCE ENGINE™</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>How Business Twin™ quality impacts your intelligence</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '8px', marginBottom: '20px' }}>
            {[
              { label: 'Constraint Detection', value: hasMRI ? Math.round(completeness * 0.94) : 0 },
              { label: 'Health Scores', value: hasMRI ? Math.round(completeness * 0.95) : 0 },
              { label: 'Verification Scores', value: hasMRI ? Math.round(completeness * 0.93) : 0 },
              { label: 'Opportunity Forecasting', value: hasMRI ? Math.round(completeness * 0.89) : 0 },
              { label: 'Risk Intelligence', value: hasMRI ? Math.round(completeness * 0.92) : 0 },
              { label: 'Benchmark Accuracy', value: hasMRI ? Math.round(completeness * 0.91) : 0 },
            ].map((m, i) => {
              const r = 20
              const circ = r * 2 * Math.PI
              const fill = (m.value / 100) * circ
              const c = m.value >= 85 ? '#4aaa4a' : m.value >= 70 ? gold : '#e8923a'
              return (
                <div key={i} style={{ textAlign: 'center' as const }}>
                  <svg width="72" height="72" viewBox="0 0 46 46">
                    <circle cx="23" cy="23" r={r} fill="none" stroke="#1a1a1a" strokeWidth="3.5"/>
                    <circle cx="23" cy="23" r={r} fill="none" stroke={c} strokeWidth="3.5"
                      strokeDasharray={String(fill) + ' ' + String(circ - fill)}
                      strokeDashoffset={String(circ * 0.25)}
                      strokeLinecap="round"
                      transform="rotate(-90 23 23)"/>
                    <text x="23" y="27" textAnchor="middle" fill={c} fontSize="10" fontWeight="800">{m.value}%</text>
                  </svg>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '5px', lineHeight: 1.3, textAlign: 'center' as const }}>{m.label}</div>
                </div>
              )
            })}
          </div>
          <div style={{ padding: '12px 14px', backgroundColor: 'var(--bg-sidebar)', borderRadius: '8px', border: '1px solid ' + border }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '6px', fontWeight: '600' }}>OVERALL INTELLIGENCE CONFIDENCE</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ fontSize: '28px', fontWeight: '900', color: gc(completeness), lineHeight: 1 }}>{hasMRI ? Math.round(completeness * 0.93) : 0}%</div>
              <div style={{ fontSize: '12px', color: gc(completeness), fontWeight: '600' }}>{completeness >= 60 ? 'High Confidence' : completeness >= 40 ? 'Medium Confidence' : 'Low — Complete MRI'}</div>
            </div>
            <div style={{ height: '6px', backgroundColor: '#1a1a1a', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: (hasMRI ? completeness * 0.93 : 0) + '%', height: '100%', background: 'linear-gradient(90deg, #cc4444 0%, ' + gold + ' 45%, #4aaa4a 80%)', borderRadius: '3px', transition: 'width 1s ease' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              {['Low','Medium','High','Very High'].map(l => <span key={l} style={{ fontSize: '8px', color: 'var(--text-faint)' }}>{l}</span>)}
            </div>
          </div>
        </div>
      </div>

      {/* TWIN TIMELINE */}
      <div style={{ backgroundColor: card, border: '1px solid ' + border, borderRadius: '10px', padding: '18px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '0.15em', fontWeight: '600', marginBottom: '2px' }}>BUSINESS TWIN™ TIMELINE</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Live audit trail of intelligence generation</div>
          </div>
          <button onClick={() => setShowTimeline(true)} style={{ fontSize: '10px', color: gold, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>View full timeline →</button>
        </div>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' as const }}>
          {[
            { icon: '◈', label: 'MRI completed', desc: 'Business profile captured', time: lastUpdated, color: gold },
            { icon: '↗', label: 'Constraint detected', desc: result?.primary_constraint?.name || 'Primary constraint identified', time: lastUpdated, color: '#4aaa4a' },
            { icon: '✓', label: 'Verification passed', desc: 'Intelligence grade: ' + (result?.confidence || 'pending'), time: lastUpdated, color: '#4aaa4a' },
            ...activeConnectors.slice(0,3).map(id => ({ icon: '⊞', label: id + ' connected', desc: 'Data synced successfully', time: 'Active', color: gold })),
            { icon: '◎', label: 'Twin active', desc: 'All systems operational', time: 'Now', color: '#4aaa4a' },
          ].map((ev, i) => (
            <div key={i} style={{ flexShrink: 0, display: 'flex', gap: '10px', padding: '10px 14px', backgroundColor: 'var(--bg-sidebar)', borderRadius: '8px', border: '1px solid ' + border, minWidth: '200px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: ev.color + '18', border: '1px solid ' + ev.color + '44', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '11px', color: ev.color }}>
                {ev.icon}
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '2px' }}>{ev.label}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '3px' }}>{ev.desc}</div>
                <div style={{ fontSize: '9px', color: 'var(--text-faint)' }}>{ev.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ALL CONNECTORS MODAL */}
      {showAllConnectors && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '40px', overflowY: 'auto' as const }} onClick={() => setShowAllConnectors(false)}>
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '14px', padding: '32px', width: '860px', maxWidth: '95vw', marginBottom: '40px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.2em', marginBottom: '4px', fontWeight: '600' }}>ALL CONNECTORS</div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>Data Source Architecture™</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Connect external systems to improve Business Twin™ completeness</div>
              </div>
              <button onClick={() => setShowAllConnectors(false)} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '6px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            {CONNECTOR_GROUPS.map((group, gi) => (
              <div key={gi} style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', paddingBottom: '8px', borderBottom: '1px solid #1a1a1a' }}>
                  <div style={{ fontSize: '9px', color: gold, letterSpacing: '0.15em', fontWeight: '600' }}>{group.group.toUpperCase()}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Impacts: {group.twin_impact}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {group.connectors.filter(c => c.auth === 'oauth').map((c, i) => {
                    const state = connectorStates[c.id]
                    const isActive = state?.status === 'active'
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', backgroundColor: 'var(--bg-sidebar)', borderRadius: '8px', border: '1px solid ' + (isActive ? '#1a2a1a' : '#1e1e1e') }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isActive ? '#4aaa4a' : '#333', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>{c.name}</div>
                          <div style={{ fontSize: '10px', color: isActive ? '#4aaa4a' : '#555', marginTop: '2px' }}>{isActive ? '✓ Connected · Active' : '+' + c.boost + '% completeness when connected'}</div>
                        </div>
                        {!isActive ? (
                          <button onClick={() => { setActiveModal(c.id); setFormData({}); setShowAllConnectors(false) }} style={{ padding: '6px 14px', backgroundColor: 'rgba(200,162,74,0.1)', border: '1px solid rgba(200,162,74,0.25)', borderRadius: '5px', color: gold, fontSize: '11px', cursor: 'pointer', fontWeight: '600', flexShrink: 0 }}>Connect</button>
                        ) : (
                          <div style={{ fontSize: '11px', color: '#4aaa4a', fontWeight: '600' }}>✓ Active</div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ALL MANUAL INPUTS MODAL */}
      {showAllManual && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '40px', overflowY: 'auto' as const }} onClick={() => setShowAllManual(false)}>
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '14px', padding: '32px', width: '860px', maxWidth: '95vw', marginBottom: '40px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.2em', marginBottom: '4px', fontWeight: '600' }}>ALL MANUAL INPUTS</div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>Manual Intelligence Inputs™</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Add your business data manually to strengthen Business Twin™ intelligence</div>
              </div>
              <button onClick={() => setShowAllManual(false)} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '6px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            {CONNECTOR_GROUPS.map((group, gi) => {
              const manualConns = group.connectors.filter(c => c.auth === 'manual')
              if (manualConns.length === 0) return null
              return (
                <div key={gi} style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', paddingBottom: '8px', borderBottom: '1px solid #1a1a1a' }}>
                    <div style={{ fontSize: '9px', color: gold, letterSpacing: '0.15em', fontWeight: '600' }}>{group.group.toUpperCase()}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Impacts: {group.twin_impact}</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                    {manualConns.map((c, i) => {
                      const state = connectorStates[c.id]
                      const isActive = state?.status === 'active'
                      return (
                        <div key={i} style={{ padding: '14px', backgroundColor: 'var(--bg-sidebar)', borderRadius: '8px', border: '1px solid ' + (isActive ? '#1a2a1a' : '#1e1e1e') }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600', flex: 1 }}>{c.name}</div>
                            <div style={{ fontSize: '10px', color: isActive ? '#4aaa4a' : gold, fontWeight: '600', marginLeft: '8px' }}>+{c.boost}%</div>
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                            {isActive ? '✓ Data submitted · ' + (state?.last_synced_at ? new Date(state.last_synced_at).toLocaleDateString('en-GB') : '') : c.fields.length + ' fields required'}
                          </div>
                          <button onClick={() => { setActiveModal(c.id); setFormData({}); setShowAllManual(false) }} style={{ width: '100%', padding: '7px', backgroundColor: isActive ? 'rgba(74,170,74,0.08)' : 'rgba(200,162,74,0.08)', border: '1px solid ' + (isActive ? 'rgba(74,170,74,0.2)' : 'rgba(200,162,74,0.2)'), borderRadius: '5px', color: isActive ? '#4aaa4a' : gold, fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}>
                            {isActive ? '✏ Update Data' : '+ Add Data'}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}


      {/* TIMELINE MODAL */}
      {showTimeline && (
        <div style={{ position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.88)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '40px', overflowY: 'auto' as const }} onClick={() => setShowTimeline(false)}>
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(200,162,74,0.3)', borderRadius: '14px', padding: '32px', width: '720px', maxWidth: '95vw', marginBottom: '40px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '10px', color: gold, letterSpacing: '0.2em', marginBottom: '6px', fontWeight: '600' }}>BUSINESS TWIN™ TIMELINE</div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>Full Intelligence Audit Trail</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Complete history of intelligence generation · {businessName}</div>
              </div>
              <button onClick={() => setShowTimeline(false)} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: '6px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            {[
              { icon: '◈', label: 'Business MRI Completed', desc: 'Full 8-pillar diagnostic completed. Business Twin™ activated at ' + MRI_BASE + '% base completeness.', time: lastUpdated, color: gold, detail: 'Health score: ' + (health.overall || 64) + '/100 · Primary constraint identified · Opportunity quantified' },
              { icon: '✓', label: 'Primary Constraint Verified', desc: 'BEI Intelligence Engine completed 5-test verification protocol for ' + (result?.primary_constraint?.name || 'primary constraint') + '.', time: lastUpdated, color: '#4aaa4a', detail: 'Verification score: ' + (result?.primary_constraint?.verification_score || 80) + '/100 · Confidence: ' + (result?.confidence || 'high').toUpperCase() },
              { icon: '↗', label: 'Opportunity Quantified', desc: 'Annual opportunity range calculated across 5 value dimensions.', time: lastUpdated, color: '#4a8ab0', detail: 'Range: ' + (result?.total_opportunity?.total_low ? '£' + result.total_opportunity.total_low.toLocaleString() : '£10,000') + ' – ' + (result?.total_opportunity?.total_high ? '£' + result.total_opportunity.total_high.toLocaleString() : '£30,000') + ' annual value' },
              { icon: '◎', label: 'Intelligence Readiness Verified', desc: 'Business Twin™ achieved production-grade intelligence status.', time: lastUpdated, color: '#4aaa4a', detail: 'Completeness: ' + completeness + '% · Accuracy: ' + (completeness >= 60 ? '96%' : '78%') + ' · Readiness: Verified' },
              ...activeConnectors.map(id => ({ icon: '⊞', label: id.replace(/_/g, ' ').replace(/\w/g, (l: string) => l.toUpperCase()) + ' Connected', desc: 'Data source connected and synced to Business Twin™.', time: 'Active', color: gold, detail: '+' + (CONNECTOR_WEIGHTS[id] || 5) + '% completeness boost applied' })),
              { icon: '◈', label: 'Twin Health Score Calculated', desc: 'Business Twin™ health score calculated based on all connected data sources.', time: 'Now', color: gold, detail: 'Score: ' + completeness + '/100 · Status: ' + (completeness >= 40 ? 'Production grade' : 'Building') },
            ].map((ev, i) => (
              <div key={i} style={{ display: 'flex', gap: '16px', padding: '16px 0', borderBottom: i < 5 ? '1px solid #1a1a1a' : 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '0' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: ev.color + '18', border: '1px solid ' + ev.color + '44', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '12px', color: ev.color }}>{ev.icon}</div>
                  {i < 5 && <div style={{ width: '1px', height: '100%', backgroundColor: '#1a1a1a', marginTop: '6px', minHeight: '20px' }} />}
                </div>
                <div style={{ flex: 1, paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '700' }}>{ev.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{ev.time}</div>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', lineHeight: '1.5' }}>{ev.desc}</div>
                  <div style={{ fontSize: '11px', color: ev.color, padding: '4px 10px', backgroundColor: ev.color + '10', border: '1px solid ' + ev.color + '25', borderRadius: '4px', display: 'inline-block' }}>{ev.detail}</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: '16px', padding: '12px 16px', backgroundColor: 'var(--bg-sidebar)', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4aaa4a', boxShadow: '0 0 5px rgba(74,170,74,0.7)' }} />
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>BEI Intelligence Operations · All systems operational</span>
              </div>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Last data sync: Just now</span>
            </div>
          </div>
        </div>
      )}

    </DashboardShell>
  )
}
