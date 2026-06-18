"""
BEI Manual Financial Connector
For businesses not on QuickBooks or Xero.
User enters real numbers from their own accounts or bookkeeper.
Maps to: Business Twin — Growth, Risk sub-twin.
Golden Rule 8: Accuracy Over Volume — only real data enters the pipeline.
"""

from typing import Any
from services.connectors.base import BaseConnector


class ManualFinancialConnector(BaseConnector):

    connector_type = "manual_financial"
    connector_name = "Financial Data (Manual Entry)"

    def connect(self) -> bool:
        return bool(self.credentials.get('monthly_revenue'))

    def fetch(self) -> dict[str, Any]:
        return self.credentials

    def normalise(self, raw: dict[str, Any]) -> dict[str, Any]:
        try:
            monthly_revenue = float(raw.get('monthly_revenue', 0))
            gross_margin_pct = float(raw.get('gross_margin_pct', 0))
            top_client_revenue_pct = float(raw.get('top_client_revenue_pct', 0))
            cash_reserves_months = float(raw.get('cash_reserves_months', 0))
            revenue_last_12m = float(raw.get('revenue_last_12m', 0))
            revenue_prev_12m = float(raw.get('revenue_prev_12m', 0))
        except (ValueError, TypeError) as e:
            return {'source': 'manual_financial', 'available': False, 'error': str(e)}

        annual_revenue = revenue_last_12m if revenue_last_12m > 0 else monthly_revenue * 12

        revenue_growth_pct = 0.0
        if revenue_prev_12m > 0 and revenue_last_12m > 0:
            revenue_growth_pct = round(
                ((revenue_last_12m - revenue_prev_12m) / revenue_prev_12m) * 100, 1
            )

        if revenue_growth_pct > 20:
            revenue_trend = "Growing quickly"
        elif revenue_growth_pct > 5:
            revenue_trend = "Growing slowly"
        elif revenue_growth_pct >= -5:
            revenue_trend = "Stayed about the same"
        elif revenue_growth_pct >= -20:
            revenue_trend = "Declining slowly"
        else:
            revenue_trend = "Declining fast"

        if top_client_revenue_pct >= 60:
            concentration_band = "Most of it"
        elif top_client_revenue_pct >= 40:
            concentration_band = "Three-fifths to four-fifths"
        elif top_client_revenue_pct >= 25:
            concentration_band = "Two-fifths to three-fifths"
        elif top_client_revenue_pct >= 15:
            concentration_band = "A fifth to two-fifths"
        else:
            concentration_band = "Less than a fifth"

        if cash_reserves_months >= 6:
            cash_stability = "Very steady"
        elif cash_reserves_months >= 3:
            cash_stability = "Fairly steady"
        elif cash_reserves_months >= 1.5:
            cash_stability = "Okay, some swings"
        elif cash_reserves_months >= 0.5:
            cash_stability = "Unpredictable"
        else:
            cash_stability = "Very unpredictable"

        return {
            'source': 'manual_financial',
            'available': True,
            'monthly_revenue': monthly_revenue,
            'annual_revenue': annual_revenue,
            'gross_margin_pct': gross_margin_pct,
            'top_client_revenue_pct': top_client_revenue_pct,
            'cash_reserves_months': cash_reserves_months,
            'revenue_growth_pct': revenue_growth_pct,
            'revenue_trend': revenue_trend,
            'concentration_band': concentration_band,
            'cash_stability': cash_stability,
            'twin_mappings': {
                'growth.monthly_revenue': monthly_revenue,
                'growth.annual_revenue': annual_revenue,
                'growth.revenue_trend': revenue_trend,
                'risk.revenue_concentration': concentration_band,
                'risk.cash_position': cash_stability,
                'strategy.gross_margin_pct': gross_margin_pct,
            }
        }
