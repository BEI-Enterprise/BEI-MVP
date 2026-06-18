"""
BEI Google Analytics Connector
Real OAuth 2.0 integration with Google Analytics Data API (GA4).
Pulls: sessions, conversions, channel breakdown, bounce rate, top pages.
Maps to: Business Twin — Growth sub-twin.
Golden Rule 8: Accuracy Over Volume — only real verified data enters the pipeline.

OAuth flow:
1. Frontend redirects to /oauth/google_analytics/start
2. User authorises Google Analytics access
3. Google redirects to /oauth/google_analytics/callback with code
4. We exchange code for access_token + refresh_token
5. Tokens stored in Supabase connectors table
6. Connector uses access_token + property_id to pull data
"""

from typing import Any
from services.connectors.base import BaseConnector
import urllib.request
import urllib.parse
import json


GA4_API_BASE = "https://analyticsdata.googleapis.com/v1beta"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"


class GoogleAnalyticsConnector(BaseConnector):

    connector_type = "google_analytics"
    connector_name = "Google Analytics"

    def connect(self) -> bool:
        return bool(
            self.credentials.get('access_token') and
            self.credentials.get('property_id')
        )

    def _api_post(self, path: str, body: dict) -> dict:
        access_token = self.credentials['access_token']
        url = f"{GA4_API_BASE}{path}"
        data = json.dumps(body).encode()
        req = urllib.request.Request(
            url,
            data=data,
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json",
            },
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read().decode())

    def fetch(self) -> dict[str, Any]:
        property_id = self.credentials['property_id']

        # Last 90 days traffic and conversion data
        traffic_report = self._api_post(
            f"/properties/{property_id}:runReport",
            {
                "dateRanges": [{"startDate": "90daysAgo", "endDate": "today"}],
                "dimensions": [{"name": "sessionDefaultChannelGroup"}],
                "metrics": [
                    {"name": "sessions"},
                    {"name": "conversions"},
                    {"name": "bounceRate"},
                    {"name": "averageSessionDuration"},
                    {"name": "newUsers"},
                ]
            }
        )

        # Top landing pages
        pages_report = self._api_post(
            f"/properties/{property_id}:runReport",
            {
                "dateRanges": [{"startDate": "90daysAgo", "endDate": "today"}],
                "dimensions": [{"name": "landingPage"}],
                "metrics": [
                    {"name": "sessions"},
                    {"name": "conversions"},
                    {"name": "bounceRate"},
                ],
                "orderBys": [{"metric": {"metricName": "sessions"}, "desc": True}],
                "limit": 10,
            }
        )

        # Previous 90 days for trend comparison
        try:
            trend_report = self._api_post(
                f"/properties/{property_id}:runReport",
                {
                    "dateRanges": [{"startDate": "180daysAgo", "endDate": "90daysAgo"}],
                    "metrics": [
                        {"name": "sessions"},
                        {"name": "conversions"},
                    ]
                }
            )
        except Exception:
            trend_report = {}

        return {
            'traffic_report': traffic_report,
            'pages_report': pages_report,
            'trend_report': trend_report,
        }

    def normalise(self, raw: dict[str, Any]) -> dict[str, Any]:
        traffic = raw.get('traffic_report', {})
        pages = raw.get('pages_report', {})
        trend = raw.get('trend_report', {})

        total_sessions = 0
        total_conversions = 0
        total_bounce_rate = 0.0
        total_new_users = 0
        channel_breakdown: dict[str, int] = {}
        row_count = 0

        for row in traffic.get('rows', []):
            dims = row.get('dimensionValues', [])
            metrics = row.get('metricValues', [])
            channel = dims[0].get('value', 'Unknown') if dims else 'Unknown'
            sessions = int(metrics[0].get('value', 0)) if len(metrics) > 0 else 0
            conversions = int(float(metrics[1].get('value', 0))) if len(metrics) > 1 else 0
            bounce = float(metrics[2].get('value', 0)) if len(metrics) > 2 else 0.0
            new_users = int(metrics[4].get('value', 0)) if len(metrics) > 4 else 0

            total_sessions += sessions
            total_conversions += conversions
            total_bounce_rate += bounce
            total_new_users += new_users
            channel_breakdown[channel] = sessions
            row_count += 1

        avg_bounce_rate = round(total_bounce_rate / row_count, 1) if row_count > 0 else 0.0
        conversion_rate = round(total_conversions / total_sessions, 4) if total_sessions > 0 else 0.0

        # Previous period for trend
        prev_sessions = 0
        for row in trend.get('rows', []):
            metrics = row.get('metricValues', [])
            prev_sessions += int(metrics[0].get('value', 0)) if metrics else 0

        traffic_trend = "stable"
        if prev_sessions > 0:
            change_pct = ((total_sessions - prev_sessions) / prev_sessions) * 100
            if change_pct > 15:
                traffic_trend = "growing"
            elif change_pct < -15:
                traffic_trend = "declining"

        # Top pages
        top_pages = []
        for row in pages.get('rows', [])[:5]:
            dims = row.get('dimensionValues', [])
            metrics = row.get('metricValues', [])
            top_pages.append({
                'page': dims[0].get('value', '') if dims else '',
                'sessions': int(metrics[0].get('value', 0)) if metrics else 0,
                'conversions': int(float(metrics[1].get('value', 0))) if len(metrics) > 1 else 0,
            })

        organic_sessions = channel_breakdown.get('Organic Search', 0)
        organic_pct = round((organic_sessions / total_sessions * 100), 1) if total_sessions > 0 else 0.0

        if conversion_rate < 0.01:
            conversion_band = "Less than 1 in 10"
        elif conversion_rate < 0.02:
            conversion_band = "1-2 in 10"
        elif conversion_rate < 0.04:
            conversion_band = "2-4 in 10"
        elif conversion_rate < 0.06:
            conversion_band = "4-6 in 10"
        else:
            conversion_band = "More than 6 in 10"

        return {
            'source': 'google_analytics',
            'available': True,
            'total_sessions_90d': total_sessions,
            'total_conversions_90d': total_conversions,
            'conversion_rate': conversion_rate,
            'conversion_band': conversion_band,
            'avg_bounce_rate_pct': avg_bounce_rate,
            'new_users_90d': total_new_users,
            'organic_sessions': organic_sessions,
            'organic_pct': organic_pct,
            'traffic_trend': traffic_trend,
            'channel_breakdown': channel_breakdown,
            'top_pages': top_pages,
            'twin_mappings': {
                'growth.website_sessions': total_sessions,
                'growth.website_conversion_rate': conversion_band,
                'growth.organic_traffic_pct': organic_pct,
                'growth.traffic_trend': traffic_trend,
            }
        }


def exchange_code_for_tokens(code: str, redirect_uri: str, client_id: str, client_secret: str) -> dict:
    """Exchange OAuth code for Google tokens."""
    body = urllib.parse.urlencode({
        'grant_type': 'authorization_code',
        'code': code,
        'client_id': client_id,
        'client_secret': client_secret,
        'redirect_uri': redirect_uri,
    }).encode()
    req = urllib.request.Request(
        GOOGLE_TOKEN_URL,
        data=body,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST"
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode())


def refresh_access_token(refresh_token: str, client_id: str, client_secret: str) -> dict:
    """Refresh an expired Google access token."""
    body = urllib.parse.urlencode({
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': client_id,
        'client_secret': client_secret,
    }).encode()
    req = urllib.request.Request(
        GOOGLE_TOKEN_URL,
        data=body,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST"
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode())


def get_oauth_url(client_id: str, redirect_uri: str) -> str:
    """Generate Google Analytics OAuth authorisation URL."""
    params = urllib.parse.urlencode({
        'client_id': client_id,
        'redirect_uri': redirect_uri,
        'response_type': 'code',
        'scope': 'https://www.googleapis.com/auth/analytics.readonly',
        'access_type': 'offline',
        'prompt': 'consent',
        'state': 'google_analytics_oauth',
    })
    return f"https://accounts.google.com/o/oauth2/v2/auth?{params}"
