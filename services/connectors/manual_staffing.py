"""
BEI Manual Staffing Connector
For businesses not on Workday or HiBob.
User enters real numbers from their own HR records.
Maps to: Business Twin — Operations sub-twin.
Golden Rule 8: Accuracy Over Volume — only real data enters the pipeline.
"""

from typing import Any
from services.connectors.base import BaseConnector


class ManualStaffingConnector(BaseConnector):

    connector_type = "manual_staffing"
    connector_name = "Staffing & Capacity (Manual Entry)"

    def connect(self) -> bool:
        return bool(self.credentials.get('team_size'))

    def fetch(self) -> dict[str, Any]:
        return self.credentials

    def normalise(self, raw: dict[str, Any]) -> dict[str, Any]:
        try:
            team_size = int(raw.get('team_size', 0))
            avg_utilisation_pct = float(raw.get('avg_utilisation_pct', 0))
            billable_staff = int(raw.get('billable_staff', 0))
            management_staff = int(raw.get('management_staff', 0))
            admin_staff = int(raw.get('admin_staff', 0))
            open_roles = int(raw.get('open_roles', 0))
            avg_tenure_months = float(raw.get('avg_tenure_months', 0))
        except (ValueError, TypeError) as e:
            return {'source': 'manual_staffing', 'available': False, 'error': str(e)}

        if avg_utilisation_pct >= 95:
            capacity_band = "Fully stretched"
        elif avg_utilisation_pct >= 85:
            capacity_band = "85-95%"
        elif avg_utilisation_pct >= 70:
            capacity_band = "70-85%"
        elif avg_utilisation_pct >= 50:
            capacity_band = "About half to 70%"
        else:
            capacity_band = "Under half"

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

        management_ratio = management_staff / team_size if team_size > 0 else 0
        billable_ratio = billable_staff / team_size if team_size > 0 else 0

        return {
            'source': 'manual_staffing',
            'available': True,
            'team_size': team_size,
            'team_band': team_band,
            'avg_utilisation_pct': avg_utilisation_pct,
            'capacity_band': capacity_band,
            'billable_staff': billable_staff,
            'management_staff': management_staff,
            'admin_staff': admin_staff,
            'open_roles': open_roles,
            'avg_tenure_months': avg_tenure_months,
            'management_ratio': round(management_ratio, 2),
            'billable_ratio': round(billable_ratio, 2),
            'twin_mappings': {
                'ops.team_size': team_band,
                'ops.capacity_utilisation': capacity_band,
                'ops.billable_ratio': billable_ratio,
                'ops.management_ratio': management_ratio,
            }
        }
