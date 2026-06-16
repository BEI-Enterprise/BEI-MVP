"""
BEI Base Connector
All connectors inherit from this base class.
Aligned with BEI Master Architecture — Connector Layer.
"""

from typing import Any
from abc import ABC, abstractmethod
from datetime import datetime


class BaseConnector(ABC):
    """
    Base class for all BEI connectors.
    Every connector must implement: connect, fetch, normalise.
    """

    connector_type: str = ""
    connector_name: str = ""

    def __init__(self, business_id: str, credentials: dict[str, Any]):
        self.business_id = business_id
        self.credentials = credentials
        self.synced_at = None
        self.error = None

    @abstractmethod
    def connect(self) -> bool:
        """Test the connection. Returns True if successful."""
        pass

    @abstractmethod
    def fetch(self) -> dict[str, Any]:
        """Fetch raw data from the external source."""
        pass

    @abstractmethod
    def normalise(self, raw_data: dict[str, Any]) -> dict[str, Any]:
        """
        Normalise raw data into BEI standard format.
        Output must map to Business Twin fields.
        """
        pass

    def run(self) -> dict[str, Any]:
        """
        Run the full connector pipeline:
        connect → fetch → normalise → return
        """
        try:
            connected = self.connect()
            if not connected:
                return {
                    "success": False,
                    "connector_type": self.connector_type,
                    "error": "Connection failed",
                    "data": {},
                }

            raw = self.fetch()
            normalised = self.normalise(raw)
            self.synced_at = datetime.utcnow().isoformat()

            return {
                "success": True,
                "connector_type": self.connector_type,
                "connector_name": self.connector_name,
                "synced_at": self.synced_at,
                "data": normalised,
                "raw": raw,
            }

        except Exception as e:
            self.error = str(e)
            return {
                "success": False,
                "connector_type": self.connector_type,
                "error": str(e),
                "data": {},
            }
