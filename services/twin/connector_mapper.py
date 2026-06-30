"""
BEI Connector-to-Twin Mapper.
Maps real connector/manual data into the exact MRI-band vocabulary
expected by build_twin(), detect_constraints() and calculate_health().
This ensures connector data flows through the SAME verified pipeline
as MRI intake answers -- no parallel logic, no duplicate engine.

Golden Rule 8: Accuracy Over Volume -- only real data enters the pipeline.
Golden Rule 2: Verification Before Recommendation -- connector data still
passes through the same detection -> verification -> decision chain.
"""

from typing import Any


def _n(data: dict, key: str, default: float = 0.0) -> float:
    try:
        return float(data.get(key, default) or default)
    except (TypeError, ValueError):
        return default


def _band(value: float, thresholds: list, default: str) -> str:
    for max_val, label in thresholds:
        if value <= max_val:
            return label
    return default


def map_connector_data_to_answers(data: dict) -> dict:
    answers = {}

    growth = _n(data, 'revenue_growth_rate_pct')
    if 'revenue_growth_rate_pct' in data:
        answers['revenue_trend'] = _band(growth, [
            (-100, 'Declining fast'), (0, 'Declining slowly'),
            (5, 'Stayed about the same'), (15, 'Growing slowly'),
        ], 'Growing quickly')

    leads = _n(data, 'total_leads')
    if 'total_leads' in data:
        answers['lead_volume'] = _band(leads, [
            (5, '0-5'), (20, '6-20'), (50, '21-50'), (100, '51-100'),
        ], 'Over 100')

    conv = _n(data, 'lead_to_client_conversion') or _n(data, 'conversion_rate')
    if 'lead_to_client_conversion' in data or 'conversion_rate' in data:
        answers['conversion_rate'] = _band(conv, [
            (10, 'Less than 1 in 10'), (20, '1-2 in 10'),
            (40, '2-4 in 10'), (60, '4-6 in 10'),
        ], 'More than 6 in 10')

    util = _n(data, 'avg_utilisation_pct')
    if 'avg_utilisation_pct' in data:
        answers['capacity_utilisation'] = _band(util, [
            (50, 'Less than half'), (70, 'About half to 70%'),
            (85, '70-85%'), (95, '85-95%'),
        ], 'Fully stretched')

    owner_dep = _n(data, 'owner_dependency_pct')
    if 'owner_dependency_pct' in data:
        answers['founder_dependency'] = _band(owner_dep, [
            (20, 'It would run smoothly without me'),
            (40, 'It would mostly be fine'),
            (60, 'It would manage with some issues'),
            (80, 'It would struggle a lot'),
        ], 'It would stop without me')

    price_pos = str(data.get('price_vs_market', '')).lower()
    avg_discount = _n(data, 'avg_discount_pct')
    if price_pos or 'avg_discount_pct' in data:
        if 'above' in price_pos or 'premium' in price_pos:
            answers['pricing_confidence'] = 'Very confident' if avg_discount < 5 else 'Fairly confident'
        elif 'below' in price_pos:
            answers['pricing_confidence'] = 'A little unsure' if avg_discount < 15 else 'Not confident at all'
        else:
            answers['pricing_confidence'] = _band(avg_discount, [
                (5, 'Completely confident'), (10, 'Very confident'),
                (15, 'Fairly confident'), (25, 'A little unsure'),
            ], 'Not confident at all')

    nps = _n(data, 'nps_score')
    if 'nps_score' in data:
        answers['offer_clarity'] = _band(nps, [
            (-20, 'Not at all clear'), (10, 'A bit confusing'),
            (30, 'Reasonably clear'), (50, 'Clear'),
        ], 'Crystal clear')

    market_share = _n(data, 'market_share_pct')
    if 'market_share_pct' in data:
        answers['market_position'] = _band(market_share, [
            (1, 'Pretty much the same as everyone else'),
            (3, 'Slightly different'), (6, 'Somewhat different'),
            (10, 'Clearly different'),
        ], 'Nobody else offers what we do')

    top3 = _n(data, 'top_3_clients_revenue_pct')
    if 'top_3_clients_revenue_pct' in data:
        answers['revenue_concentration'] = _band(top3, [
            (20, 'Less than a fifth'), (40, 'A fifth to two-fifths'),
            (60, 'Two-fifths to three-fifths'), (80, 'Three-fifths to four-fifths'),
        ], 'Most of it')

    reviews = _n(data, 'google_review_count')
    if 'google_review_count' in data:
        answers['trust_infrastructure'] = _band(reviews, [
            (0, 'None'), (10, 'Very little'), (30, 'Some'), (80, 'A good amount'),
        ], 'Plenty')

    runway = _n(data, 'cash_runway_months')
    if 'cash_runway_months' in data:
        answers['cash_flow_stability'] = _band(runway, [
            (2, 'Very unpredictable'), (4, 'Unpredictable'),
            (6, 'Okay, some swings'), (12, 'Fairly steady'),
        ], 'Very steady')

    key_people = _n(data, 'key_person_dependency')
    if 'key_person_dependency' in data:
        answers['key_person_risk'] = _band(key_people, [
            (0, 'Barely any impact'), (1, 'Minor disruption'),
            (3, 'Noticeable impact'), (6, 'Serious damage'),
        ], 'The business would likely fail')

    if 'revenue_growth_rate_pct' in data:
        answers['market_growth'] = _band(growth, [
            (-10, 'Shrinking quickly'), (0, 'Shrinking'),
            (3, 'Staying flat'), (15, 'Growing'),
        ], 'Growing quickly')

    tam = _n(data, 'total_addressable_market')
    if market_share and tam:
        answers['competition_intensity'] = _band(market_share, [
            (1, 'Intense competition'), (3, 'A lot'),
            (8, 'A moderate amount'), (15, 'A little'),
        ], 'Very little')

    lost = _n(data, 'lost_clients_last_12m')
    newc = _n(data, 'new_clients_last_12m')
    if newc > 0:
        retention_pct = max(0, 100 - (lost / newc * 100))
        answers['client_retention'] = _band(retention_pct, [
            (50, 'Under 50%'), (65, '50-65%'), (80, '65-80%'), (90, '80-90%'),
        ], 'Over 90%')

    headcount = _n(data, 'total_headcount')
    if 'total_headcount' in data:
        answers['team_size'] = _band(headcount, [
            (1, 'Just me'), (5, '2-5'), (10, '6-10'), (25, '11-25'), (50, '26-50'),
        ], 'Over 50')

    on_time = _n(data, 'project_on_time_pct')
    if 'project_on_time_pct' in data:
        if on_time < 60:
            answers['delivery_bottleneck'] = 'Doing the actual work'
        elif on_time < 75:
            answers['delivery_bottleneck'] = 'Managing the team'
        else:
            answers['delivery_bottleneck'] = 'Nothing really slows us down'

    if conv and conv < 15:
        answers['biggest_challenge'] = 'Turning enquiries into clients'
    elif util and util > 88:
        answers['biggest_challenge'] = 'Team size and workload'
    elif top3 and top3 > 60:
        answers['biggest_challenge'] = 'Keeping clients long-term'

    annual_revenue = _n(data, 'annual_revenue')
    if annual_revenue:
        monthly = annual_revenue / 12
        answers['monthly_revenue'] = _band(monthly, [
            (10000, 'Under £10k'), (25000, '£10k-£25k'), (50000, '£25k-£50k'),
            (100000, '£50k-£100k'), (250000, '£100k-£250k'),
        ], 'Over £250k')

    # --- Enterprise pass-through fields (Section 8 Twin coverage) ---
    # These come from manual intake sections that have no MRI-band
    # equivalent (finance_divisional, strategy_corporate, strategy_governance,
    # risk_concentration, risk_compliance, risk_enterprise, context_market,
    # context_brand, tech_systems, tech_data, people_leadership,
    # operations_enterprise). Passed through directly rather than invented
    # bands, since fabricating bands here would itself be a Golden Rule 11
    # risk (unverifiable derived values).
    PASSTHROUGH_FIELDS = [
        'years_trading', 'business_stage', 'market_share_pct', 'nps_score',
        'brand_awareness_pct', 'competitive_set', 'differentiation_strength',
        'revenue_target_12m', 'primary_growth_strategy', 'strategic_blockers',
        'competitive_advantage', 'exit_strategy', 'legal_structure',
        'ownership_structure', 'board_meeting_frequency',
        'decision_making_structure', 'total_headcount',
        'employee_engagement_score', 'staff_turnover_12m', 'c_suite_size',
        'leadership_vacancies', 'succession_planning', 'avg_leadership_tenure',
        'tech_stack_maturity', 'cloud_adoption_pct', 'legacy_system_risk',
        'data_maturity_score', 'ai_ml_adoption', 'cyber_security_maturity',
        'top_client_revenue_pct', 'cyber_incidents_12m', 'gdpr_compliant',
        'pending_litigation', 'contract_renewal_risk',
    ]
    for field in PASSTHROUGH_FIELDS:
        if field in data and data[field] not in (None, ''):
            answers[field] = data[field]

    return answers


def map_annual_revenue_to_band(annual_revenue: float) -> str:
    if annual_revenue <= 0:
        return "Under £250k"
    return _band(annual_revenue, [
        (250000, "Under £250k"),
        (500000, "£250k - £500k"),
        (1000000, "£500k - £1M"),
        (3000000, "£1M - £3M"),
        (10000000, "£3M - £10M"),
    ], "Over £10M")
