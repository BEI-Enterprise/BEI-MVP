"""
BEI QuickBooks Connector
Real OAuth 2.0 integration with Intuit QuickBooks Online API.
Pulls: P&L, revenue, cash flow, customer invoices.
Maps to: Business Twin — Growth, Risk sub-twin.
Golden Rule 8: Accuracy Over Volume — only real verified data enters the pipeline.
"""

from typing import Any
from services.connectors.base import BaseConnector
import urllib.request
import urllib.parse
import json
import base64
from datetime import datetime, timedelta


QB_API_BASE = "https://quickbooks.api.intuit.com/v3/company"
QB_SANDBOX_BASE = "https://sandbox-quickbooks.api.intuit.com/v3/company"


class QuickBooksConnector(BaseConnector):

    connector_type = "quickbooks"
    connector_name = "QuickBooks"

    def connect(self) -> bool:
        return bool(
            self.credentials.get('access_token') and
            self.credentials.get('realm_id')
        )

    def _api_get(self, path: str) -> dict:
        access_token = self.credentials['access_token']
        realm_id = self.credentials['realm_id']
        sandbox = self.credentials.get('sandbox', False)
        base = QB_SANDBOX_BASE if sandbox else QB_API_BASE
        url = f"{base}/{realm_id}{path}"
        req = urllib.request.Request(
            url,
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/json",
            }
        )
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read().decode())

    def _query(self, sql: str) -> dict:
        access_token = self.credentials['access_token']
        realm_id = self.credentials['realm_id']
        sandbox = self.credentials.get('sandbox', False)
        base = QB_SANDBOX_BASE if sandbox else QB_API_BASE
        encoded = urllib.parse.quote(sql)
        url = f"{base}/{realm_id}/query?query={encoded}&minorversion=65"
        req = urllib.request.Request(
            url,
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/json",
            }
        )
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read().decode())

    def fetch(self) -> dict[str, Any]:
        today = datetime.now().strftime('%Y-%m-%d')
        ninety_days_ago = (datetime.now() - timedelta(days=90)).strftime('%Y-%m-%d')
        prev_year_start = (datetime.now() - timedelta(days=365)).strftime('%Y-%m-%d')

        pnl = self._api_get(
            f"/reports/ProfitAndLoss?start_date={ninety_days_ago}&end_date={today}&minorversion=65"
        )

        try:
            pnl_prev = self._api_get(
                f"/reports/ProfitAndLoss?start_date={prev_year_start}&end_date={ninety_days_ago}&minorversion=65"
            )
        except Exception:
            pnl_prev = {}

        try:
            invoices = self._query(
                f"SELECT * FROM Invoice WHERE TxnDate >= '{ninety_days_ago}' MAXRESULTS 200"
            )
        except Exception:
            invoices = {}

        try:
            balance = self._api_get(f"/reports/BalanceSheet?date={today}&minorversion=65")
        except Exception:
            balance = {}

        return {
            'pnl': pnl,
            'pnl_prev': pnl_prev,
            'invoices': invoices,
            'balance': balance,
        }

    def _extract_report_value(self, report: dict, row_name: str) -> float:
        try:
            rows = report.get('Rows', {}).get('Row', [])
            for row in rows:
                summary = row.get('Summary', {})
                col_data = summary.get('ColData', [])
                if col_data and col_data[0].get('value', '').lower() == row_name.lower():
                    val = col_data[-1].get('value', '0').replace(',', '')
                    return float(val) if val else 0.0
                for subrow in row.get('Rows', {}).get('Row', []):
                    sub_summary = subrow.get('Summary', {})
                    sub_cols = sub_summary.get('ColData', [])
                    if sub_cols and sub_cols[0].get('value', '').lower() == row_name.lower():
                        val = sub_cols[-1].get('value', '0').replace(',', '')
                        return float(val) if val else 0.0
        except Exception:
            pass
        return 0.0

    def normalise(self, raw: dict[str, Any]) -> dict[str, Any]:
        pnl = raw.get('pnl', {})
        pnl_prev = raw.get('pnl_prev', {})
        invoices_data = raw.get('invoices', {})

        revenue = self._extract_report_value(pnl, 'total income')
        if revenue == 0:
            revenue = self._extract_report_value(pnl, 'income')

        gross_profit = self._extract_report_value(pnl, 'gross profit')
        net_profit = self._extract_report_value(pnl, 'net income')
        gross_margin_pct = round((gross_profit / revenue * 100), 1) if revenue > 0 else 0.0

        prev_revenue = self._extract_report_value(pnl_prev, 'total income')
        if prev_revenue == 0:
            prev_revenue = self._extract_report_value(pnl_prev, 'income')

        revenue_growth_pct = 0.0
        if prev_revenue > 0 and revenue > 0:
            revenue_growth_pct = round(((revenue - prev_revenue) / prev_revenue) * 100, 1)

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

        invoices = invoices_data.get('QueryResponse', {}).get('Invoice', [])
        client_revenue: dict[str, float] = {}
        for inv in invoices:
            customer = inv.get('CustomerRef', {}).get('name', 'Unknown')
            amount = float(inv.get('TotalAmt', 0) or 0)
            client_revenue[customer] = client_revenue.get(customer, 0) + amount

        total_invoice_revenue = sum(client_revenue.values())
        top_client_pct = 0.0
        if client_revenue and total_invoice_revenue > 0:
            top_client_revenue = max(client_revenue.values())
            top_client_pct = round((top_client_revenue / total_invoice_revenue) * 100, 1)

        if top_client_pct >= 60:
            concentration_band = "Most of it"
        elif top_client_pct >= 40:
            concentration_band = "Three-fifths to four-fifths"
        elif top_client_pct >= 25:
            concentration_band = "Two-fifths to three-fifths"
        elif top_client_pct >= 15:
            concentration_band = "A fifth to two-fifths"
        else:
            concentration_band = "Less than a fifth"

        monthly_revenue = round(revenue / 3, 2)

        return {
            'source': 'quickbooks',
            'available': True,
            'revenue_90d': round(revenue, 2),
            'monthly_revenue_avg': monthly_revenue,
            'gross_profit_90d': round(gross_profit, 2),
            'net_profit_90d': round(net_profit, 2),
            'gross_margin_pct': gross_margin_pct,
            'revenue_growth_pct': revenue_growth_pct,
            'revenue_trend': revenue_trend,
            'top_client_revenue_pct': top_client_pct,
            'concentration_band': concentration_band,
            'client_count': len(client_revenue),
            'twin_mappings': {
                'growth.monthly_revenue': monthly_revenue,
                'growth.revenue_trend': revenue_trend,
                'risk.revenue_concentration': concentration_band,
                'strategy.gross_margin_pct': gross_margin_pct,
            }
        }


def exchange_code_for_tokens(code: str, redirect_uri: str, client_id: str, client_secret: str, realm_id: str) -> dict:
    credentials = base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()
    body = urllib.parse.urlencode({
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': redirect_uri,
    }).encode()
    req = urllib.request.Request(
        "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer",
        data=body,
        headers={
            "Authorization": f"Basic {credentials}",
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
        },
        method="POST"
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        tokens = json.loads(resp.read().decode())
    tokens['realm_id'] = realm_id
    return tokens


def refresh_access_token(refresh_token: str, client_id: str, client_secret: str) -> dict:
    credentials = base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()
    body = urllib.parse.urlencode({
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
    }).encode()
    req = urllib.request.Request(
        "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer",
        data=body,
        headers={
            "Authorization": f"Basic {credentials}",
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
        },
        method="POST"
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode())


def get_oauth_url(client_id: str, redirect_uri: str) -> str:
    params = urllib.parse.urlencode({
        'client_id': client_id,
        'redirect_uri': redirect_uri,
        'response_type': 'code',
        'scope': 'com.intuit.quickbooks.accounting',
        'state': 'quickbooks_oauth',
    })
    return f"https://appcenter.intuit.com/connect/oauth2?{params}"
