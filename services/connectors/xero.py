"""
BEI Xero Connector
Real OAuth 2.0 integration with Xero Accounting API.
Pulls: P&L, revenue, cash flow, invoices by client.
Maps to: Business Twin — Growth, Risk sub-twin.
Golden Rule 8: Accuracy Over Volume — only real verified data enters the pipeline.

OAuth flow:
1. Frontend redirects to /oauth/xero/start
2. User authorises in Xero
3. Xero redirects to /oauth/xero/callback with code
4. We exchange code for access_token + refresh_token + tenant_id
5. Tokens stored in Supabase connectors table
6. Connector uses access_token + tenant_id to pull data
"""

from typing import Any
from services.connectors.base import BaseConnector
import urllib.request
import urllib.parse
import json
import base64
from datetime import datetime, timedelta


XERO_API_BASE = "https://api.xero.com/api.xro/2.0"
XERO_CONNECTIONS_URL = "https://api.xero.com/connections"


class XeroConnector(BaseConnector):

    connector_type = "xero"
    connector_name = "Xero"

    def connect(self) -> bool:
        return bool(
            self.credentials.get('access_token') and
            self.credentials.get('tenant_id')
        )

    def _api_get(self, path: str, params: dict = None) -> dict:
        access_token = self.credentials['access_token']
        tenant_id = self.credentials['tenant_id']
        url = f"{XERO_API_BASE}{path}"
        if params:
            url += '?' + urllib.parse.urlencode(params)
        req = urllib.request.Request(
            url,
            headers={
                "Authorization": f"Bearer {access_token}",
                "Xero-Tenant-Id": tenant_id,
                "Accept": "application/json",
            }
        )
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read().decode())

    def fetch(self) -> dict[str, Any]:
        ninety_days_ago = (datetime.now() - timedelta(days=90)).strftime('%Y-%m-%d')
        today = datetime.now().strftime('%Y-%m-%d')
        prev_year_start = (datetime.now() - timedelta(days=365)).strftime('%Y-%m-%d')

        # P&L for last 90 days
        pnl = self._api_get('/Reports/ProfitAndLoss', {
            'fromDate': ninety_days_ago,
            'toDate': today,
        })

        # P&L for previous year (for trend)
        try:
            pnl_prev = self._api_get('/Reports/ProfitAndLoss', {
                'fromDate': prev_year_start,
                'toDate': ninety_days_ago,
            })
        except Exception:
            pnl_prev = {}

        # Invoices (for client concentration)
        invoices = self._api_get('/Invoices', {
            'where': f'Date>=DateTime({ninety_days_ago.replace("-", ",")})',
            'Status': 'AUTHORISED,PAID',
        })

        # Balance sheet for cash position
        try:
            balance = self._api_get('/Reports/BalanceSheet')
        except Exception:
            balance = {}

        return {
            'pnl': pnl,
            'pnl_prev': pnl_prev,
            'invoices': invoices,
            'balance': balance,
        }

    def _extract_pnl_value(self, report: dict, row_title: str) -> float:
        """Extract a value from a Xero P&L report by row title."""
        try:
            for section in report.get('Reports', [{}])[0].get('Rows', []):
                for row in section.get('Rows', []):
                    cells = row.get('Cells', [])
                    if cells and cells[0].get('Value', '').lower() == row_title.lower():
                        val = cells[-1].get('Value', '0').replace(',', '')
                        return float(val) if val else 0.0
        except Exception:
            pass
        return 0.0

    def normalise(self, raw: dict[str, Any]) -> dict[str, Any]:
        pnl = raw.get('pnl', {})
        pnl_prev = raw.get('pnl_prev', {})
        invoices_data = raw.get('invoices', {})

        revenue = self._extract_pnl_value(pnl, 'total income')
        if revenue == 0:
            revenue = self._extract_pnl_value(pnl, 'income')

        gross_profit = self._extract_pnl_value(pnl, 'gross profit')
        net_profit = self._extract_pnl_value(pnl, 'net profit')

        gross_margin_pct = round((gross_profit / revenue * 100), 1) if revenue > 0 else 0.0

        prev_revenue = self._extract_pnl_value(pnl_prev, 'total income')
        if prev_revenue == 0:
            prev_revenue = self._extract_pnl_value(pnl_prev, 'income')

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

        # Client concentration from invoices
        invoices = invoices_data.get('Invoices', [])
        client_revenue: dict[str, float] = {}
        for inv in invoices:
            contact = inv.get('Contact', {}).get('Name', 'Unknown')
            amount = float(inv.get('Total', 0) or 0)
            client_revenue[contact] = client_revenue.get(contact, 0) + amount

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
            'source': 'xero',
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


def exchange_code_for_tokens(code: str, redirect_uri: str, client_id: str, client_secret: str) -> dict:
    """Exchange OAuth code for Xero tokens."""
    credentials = base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()
    body = urllib.parse.urlencode({
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': redirect_uri,
    }).encode()
    req = urllib.request.Request(
        "https://identity.xero.com/connect/token",
        data=body,
        headers={
            "Authorization": f"Basic {credentials}",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        method="POST"
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        tokens = json.loads(resp.read().decode())

    # Get tenant ID
    tenant_req = urllib.request.Request(
        XERO_CONNECTIONS_URL,
        headers={"Authorization": f"Bearer {tokens['access_token']}"}
    )
    with urllib.request.urlopen(tenant_req, timeout=15) as resp:
        connections = json.loads(resp.read().decode())

    if connections:
        tokens['tenant_id'] = connections[0]['tenantId']
        tokens['tenant_name'] = connections[0].get('tenantName', '')

    return tokens


def refresh_access_token(refresh_token: str, client_id: str, client_secret: str) -> dict:
    """Refresh an expired Xero access token."""
    credentials = base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()
    body = urllib.parse.urlencode({
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
    }).encode()
    req = urllib.request.Request(
        "https://identity.xero.com/connect/token",
        data=body,
        headers={
            "Authorization": f"Basic {credentials}",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        method="POST"
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode())


def get_oauth_url(client_id: str, redirect_uri: str) -> str:
    """Generate Xero OAuth authorisation URL."""
    params = urllib.parse.urlencode({
        'response_type': 'code',
        'client_id': client_id,
        'redirect_uri': redirect_uri,
        'scope': 'openid profile email accounting.reports.read accounting.transactions.read',
        'state': 'xero_oauth',
    })
    return f"https://login.xero.com/identity/connect/authorize?{params}"
