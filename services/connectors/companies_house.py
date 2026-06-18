"""
BEI Companies House Connector
UK government free API — no OAuth required.
Pulls: company profile, SIC codes, filing history, directors, incorporation date.
Maps to: Business Twin — Risk, Context sub-twin.
Golden Rule 8: Accuracy Over Volume — only real verified data enters the pipeline.
"""

from typing import Any
from services.connectors.base import BaseConnector
import urllib.request
import urllib.parse
import json
import base64


class CompaniesHouseConnector(BaseConnector):

    connector_type = "companies_house"
    connector_name = "Companies House"
    BASE_URL = "https://api.company-information.service.gov.uk"

    def connect(self) -> bool:
        return bool(
            self.credentials.get('company_number') and
            self.credentials.get('api_key')
        )

    def _get(self, path: str) -> dict:
        api_key = self.credentials['api_key']
        url = f"{self.BASE_URL}{path}"
        token = base64.b64encode(f"{api_key}:".encode()).decode()
        req = urllib.request.Request(
            url,
            headers={"Authorization": f"Basic {token}"}
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            return json.loads(resp.read().decode())

    def fetch(self) -> dict[str, Any]:
        company_number = self.credentials['company_number'].strip().upper()
        profile = self._get(f"/company/{company_number}")

        try:
            officers = self._get(f"/company/{company_number}/officers")
        except Exception:
            officers = {}

        try:
            filings = self._get(f"/company/{company_number}/filing-history?items_per_page=10")
        except Exception:
            filings = {}

        return {
            'profile': profile,
            'officers': officers,
            'filings': filings,
        }

    def normalise(self, raw: dict[str, Any]) -> dict[str, Any]:
        profile = raw.get('profile', {})
        officers = raw.get('officers', {})
        filings = raw.get('filings', {})

        company_name = profile.get('company_name', '')
        company_status = profile.get('company_status', '')
        incorporation_date = profile.get('date_of_creation', '')
        company_type = profile.get('type', '')
        sic_codes = profile.get('sic_codes', [])

        accounts = profile.get('accounts', {})
        next_accounts_due = accounts.get('next_due', '')
        last_accounts_made_up = accounts.get('last_accounts', {}).get('made_up_to', '')

        confirmation_statement = profile.get('confirmation_statement', {})
        next_confirmation_due = confirmation_statement.get('next_due', '')

        director_list = []
        for officer in officers.get('items', []):
            if officer.get('officer_role') == 'director' and not officer.get('resigned_on'):
                director_list.append({
                    'name': officer.get('name', ''),
                    'appointed_on': officer.get('appointed_on', ''),
                })

        recent_filings = []
        for filing in filings.get('items', [])[:5]:
            recent_filings.append({
                'type': filing.get('type', ''),
                'date': filing.get('date', ''),
                'description': filing.get('description', ''),
            })

        is_active = company_status == 'active'
        director_count = len(director_list)

        from datetime import datetime
        company_age_years = 0
        if incorporation_date:
            try:
                inc = datetime.strptime(incorporation_date, '%Y-%m-%d')
                company_age_years = round((datetime.now() - inc).days / 365.25, 1)
            except Exception:
                pass

        return {
            'source': 'companies_house',
            'available': True,
            'company_name': company_name,
            'company_number': self.credentials['company_number'],
            'company_status': company_status,
            'is_active': is_active,
            'company_type': company_type,
            'incorporation_date': incorporation_date,
            'company_age_years': company_age_years,
            'sic_codes': sic_codes,
            'director_count': director_count,
            'directors': director_list,
            'next_accounts_due': next_accounts_due,
            'last_accounts_made_up': last_accounts_made_up,
            'next_confirmation_due': next_confirmation_due,
            'recent_filings': recent_filings,
            'twin_mappings': {
                'context.company_age_years': company_age_years,
                'context.company_status': company_status,
                'context.sic_codes': sic_codes,
                'risk.director_count': director_count,
                'risk.filing_compliance': is_active,
            }
        }
