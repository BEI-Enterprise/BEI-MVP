"""
BEI Google Business Profile Connector
Fetches review data and business info from Google Business Profile.
Aligned with BEI Master Architecture — Connector Layer.
Maps to: Business Twin — Trust Infrastructure, Marketing sub-twin.
"""

from typing import Any
from services.connectors.base import BaseConnector
import urllib.request
import json


class GoogleBusinessConnector(BaseConnector):

    connector_type = "google_business_profile"
    connector_name = "Google Business Profile"

    def connect(self) -> bool:
        """Verify the place_id is present in credentials."""
        return bool(self.credentials.get("place_id"))

    def fetch(self) -> dict[str, Any]:
        """
        Fetch business data from Google Places API.
        Requires: place_id, api_key in credentials.
        """
        place_id = self.credentials.get("place_id", "")
        api_key = self.credentials.get("api_key", "")

        if not api_key:
            return {"error": "No API key provided", "mock": True, "place_id": place_id}

        url = (
            f"https://maps.googleapis.com/maps/api/place/details/json"
            f"?place_id={place_id}"
            f"&fields=name,rating,user_ratings_total,reviews,formatted_address,business_status"
            f"&key={api_key}"
        )

        try:
            with urllib.request.urlopen(url, timeout=10) as response:
                return json.loads(response.read().decode())
        except Exception as e:
            return {"error": str(e), "mock": True, "place_id": place_id}

    def normalise(self, raw_data: dict[str, Any]) -> dict[str, Any]:
        """
        Normalise Google Business Profile data into BEI twin format.
        Maps to: trust_infrastructure, review_score, review_count.
        """

        if raw_data.get("mock") or raw_data.get("error"):
            return {
                "source": "google_business_profile",
                "available": False,
                "error": raw_data.get("error", "Mock data"),
            }

        result = raw_data.get("result", {})
        rating = result.get("rating", 0)
        review_count = result.get("user_ratings_total", 0)
        reviews = result.get("reviews", [])

        # Map rating to BEI trust_infrastructure scale
        if review_count == 0:
            trust_level = "None"
        elif review_count < 10:
            trust_level = "Very little"
        elif review_count < 25:
            trust_level = "Some"
        elif review_count < 50:
            trust_level = "A good amount"
        else:
            trust_level = "Plenty"

        # Extract recent review sentiments
        recent_reviews = []
        for r in reviews[:5]:
            recent_reviews.append({
                "rating": r.get("rating"),
                "text": r.get("text", "")[:200],
                "time": r.get("relative_time_description", ""),
            })

        return {
            "source": "google_business_profile",
            "available": True,
            "business_name": result.get("name", ""),
            "address": result.get("formatted_address", ""),
            "rating": rating,
            "review_count": review_count,
            "trust_infrastructure": trust_level,
            "recent_reviews": recent_reviews,
            "business_status": result.get("business_status", ""),
            "twin_mappings": {
                "marketing.trust_infrastructure": trust_level,
                "marketing.google_rating": rating,
                "marketing.google_review_count": review_count,
            }
        }
