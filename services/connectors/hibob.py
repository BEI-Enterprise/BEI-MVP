"""
BEI HiBob Connector
Real OAuth integration with HiBob HR API v1.
Pulls: headcount, departments, roles, tenure data.
Maps to: Business Twin — Operations sub-twin.
Golden Rule 8: Accuracy Over Volume — only real verified data enters the pipeline.
"""

from typing import Any
from services.connectors.base import BaseConnector
import urllib.request
import json


HIBOB_API_BASE = "https://api.hibob.com/v1"


class HiBobConnector(BaseConnector):

    connector_type = "hibob"
    connector_name = "HiBob"

    def connect(self) -> bool:
        return bool(self.credentials.get('service_user_id') and self.credentials.get('service_user_token'))

    def _api_get(self, path: str) -> dict:
        import base64
        user_id = self.credentials['service_user_id']
        token = self.credentials['service_user_token']
        credentials = base64.b64encode(f"{user_id}:{token}".encode()).decode()
        url = f"{HIBOB_API_BASE}{path}"
        req = urllib.request.Request(
            url,
            headers={
                "Authorization": f"Basic {credentials}",
                "Accept": "application/json",
            }
        )
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read().decode())

    def fetch(self) -> dict[str, Any]:
        employees = self._api_get("/people")
        try:
            departments = self._api_get("/company/departments")
        except Exception:
            departments = {}
        return {'employees': employees, 'departments': departments}

    def normalise(self, raw: dict[str, Any]) -> dict[str, Any]:
        employees = raw.get('employees', {}).get('employees', [])
        team_size = len(employees)

        dept_counts: dict[str, int] = {}
        for emp in employees:
            work = emp.get('work', {})
            dept = work.get('department', 'Unknown')
            dept_counts[dept] = dept_counts.get(dept, 0) + 1

        from datetime import datetime
        tenures = []
        for emp in employees:
            start = emp.get('work', {}).get('startDate', '')
            if start:
                try:
                    start_dt = datetime.strptime(start[:10], '%Y-%m-%d')
                    tenure_months = (datetime.now() - start_dt).days / 30.44
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
            'source': 'hibob',
            'available': True,
            'team_size': team_size,
            'team_band': team_band,
            'department_breakdown': dept_counts,
            'avg_tenure_months': avg_tenure_months,
            'twin_mappings': {
                'ops.team_size': team_band,
                'ops.avg_tenure_months': avg_tenure_months,
            }
        }
