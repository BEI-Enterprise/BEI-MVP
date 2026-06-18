"""
BEI Workday Connector
Real integration with Workday REST API.
Pulls: headcount, roles, departments, capacity data.
Maps to: Business Twin — Operations sub-twin.
Golden Rule 8: Accuracy Over Volume — only real verified data enters the pipeline.

Workday requires:
- tenant_url: your Workday tenant URL e.g. https://wd2-impl-services1.workday.com/ccx/service/yourcompany
- client_id: from Workday API Client setup
- client_secret: from Workday API Client setup
- refresh_token: from Workday OAuth flow
"""

from typing import Any
from services.connectors.base import BaseConnector
import urllib.request
import urllib.parse
import json
import base64


class WorkdayConnector(BaseConnector):

    connector_type = "workday"
    connector_name = "Workday"

    def connect(self) -> bool:
        return bool(
            self.credentials.get('access_token') and
            self.credentials.get('tenant_url')
        )

    def _refresh_token_if_needed(self) -> str:
        if self.credentials.get('access_token'):
            return self.credentials['access_token']
        tenant_url = self.credentials['tenant_url'].rstrip('/')
        client_id = self.credentials['client_id']
        client_secret = self.credentials['client_secret']
        refresh_token = self.credentials['refresh_token']
        creds = base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()
        body = urllib.parse.urlencode({
            'grant_type': 'refresh_token',
            'refresh_token': refresh_token,
        }).encode()
        req = urllib.request.Request(
            f"{tenant_url}/oauth2/token",
            data=body,
            headers={
                "Authorization": f"Basic {creds}",
                "Content-Type": "application/x-www-form-urlencoded",
            },
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=15) as resp:
            tokens = json.loads(resp.read().decode())
        return tokens['access_token']

    def _api_get(self, path: str) -> dict:
        access_token = self._refresh_token_if_needed()
        tenant_url = self.credentials['tenant_url'].rstrip('/')
        url = f"{tenant_url}{path}"
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
        workers = self._api_get("/staffing/v6/workers?limit=500")
        try:
            orgs = self._api_get("/organization/v2/organizations?limit=100")
        except Exception:
            orgs = {}
        return {'workers': workers, 'organizations': orgs}

    def normalise(self, raw: dict[str, Any]) -> dict[str, Any]:
        workers = raw.get('workers', {}).get('data', [])
        team_size = len(workers)

        dept_counts: dict[str, int] = {}
        job_families: dict[str, int] = {}

        for worker in workers:
            primary_job = worker.get('primaryJob', {})
            dept = primary_job.get('businessSiteName', 'Unknown')
            job_family = primary_job.get('jobFamilyName', 'Unknown')
            dept_counts[dept] = dept_counts.get(dept, 0) + 1
            job_families[job_family] = job_families.get(job_family, 0) + 1

        from datetime import datetime
        tenures = []
        for worker in workers:
            hire_date = worker.get('hireDate', '')
            if hire_date:
                try:
                    hire_dt = datetime.strptime(hire_date[:10], '%Y-%m-%d')
                    tenure_months = (datetime.now() - hire_dt).days / 30.44
                    tenures.append(tenure_months)
                except Exception:
                    pass

        avg_tenure_months = round(sum(tenures) / len(tenures), 1) if tenures else 0.0

        if team_size == 1:
            team_band = "Just me"
        elif team_size <= 5:
            team_band = "2-5"
        elif team_size <= 10:
            team_band = "6-10"
        elif team_size <= 25:
            team_band = "11-25"
        elif team_size <= 50:
            team_band = "26-50"
        else:
            team_band = "Over 50"

        return {
            'source': 'workday',
            'available': True,
            'team_size': team_size,
            'team_band': team_band,
            'department_breakdown': dept_counts,
            'job_family_breakdown': job_families,
            'avg_tenure_months': avg_tenure_months,
            'twin_mappings': {
                'ops.team_size': team_band,
                'ops.avg_tenure_months': avg_tenure_months,
            }
        }


def get_oauth_url(client_id: str, redirect_uri: str, tenant_url: str) -> str:
    """Generate Workday OAuth authorisation URL."""
    tenant_url = tenant_url.rstrip('/')
    params = urllib.parse.urlencode({
        'response_type': 'code',
        'client_id': client_id,
        'redirect_uri': redirect_uri,
    })
    return f"{tenant_url}/oauth2/authorize?{params}"


def exchange_code_for_tokens(code: str, redirect_uri: str, client_id: str, client_secret: str, tenant_url: str) -> dict:
    """Exchange OAuth code for Workday tokens."""
    tenant_url = tenant_url.rstrip('/')
    creds = base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()
    body = urllib.parse.urlencode({
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': redirect_uri,
    }).encode()
    req = urllib.request.Request(
        f"{tenant_url}/oauth2/token",
        data=body,
        headers={
            "Authorization": f"Basic {creds}",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        method="POST"
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode())
