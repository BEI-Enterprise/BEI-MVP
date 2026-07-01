"""
BEI Benchmark Evolution Engine — Phase 13
Builds proprietary benchmarks that evolve with real data.
Aligned with BEI Master Architecture Section 13 — Benchmark Evolution.

BEI's intelligence advantage compounds over time.
Static benchmarks evolve into dynamic proprietary benchmarks.
Every business analysed improves benchmark accuracy.

Benchmark confidence levels:
  seed:      Phase 4 static values — no real data
  low:       1-4 businesses
  medium:    5-19 businesses
  high:      20-99 businesses
  very_high: 100+ businesses

Seed data now lives in industry_benchmarks.py (10 industries, 43
constraint types, field-level thresholds) — this file owns the
evolution mechanics only, not the static values.
"""

from typing import Any
from datetime import datetime

from . import industry_benchmarks
from .industry_benchmarks import SEED_BENCHMARKS, REVENUE_BANDS


# ============================================================
# BENCHMARK CONFIDENCE
# ============================================================

def _get_confidence(business_count: int) -> str:
    if business_count == 0:
        return "seed"
    elif business_count < 5:
        return "low"
    elif business_count < 20:
        return "medium"
    elif business_count < 100:
        return "high"
    return "very_high"


def _get_evolution_weight(business_count: int) -> float:
    if business_count <= 1:
        return 0.90
    elif business_count <= 5:
        return 0.85
    elif business_count <= 20:
        return 0.80
    elif business_count <= 50:
        return 0.75
    return 0.70


def get_revenue_band(annual_revenue) -> str:
    """
    Maps a raw annual revenue figure to the standard revenue band
    used throughout industry_benchmarks.py. Falls back to
    'over_100m' when revenue is missing/zero.
    """
    try:
        rev = float(annual_revenue)
    except (TypeError, ValueError):
        return "over_100m"

    if rev <= 0:
        return "over_100m"
    elif rev < 1_000_000:
        return "under_1m"
    elif rev < 10_000_000:
        return "1m_to_10m"
    elif rev < 50_000_000:
        return "10m_to_50m"
    elif rev < 100_000_000:
        return "50m_to_100m"
    return "over_100m"


# ============================================================
# BENCHMARK STORE
# ============================================================

class BenchmarkStore:
    def __init__(self):
        self.benchmarks = {}
        self.business_counts = {}
        self.evolution_history = []
        self.created_at = datetime.utcnow().isoformat()

        for industry, data in SEED_BENCHMARKS.items():
            self.benchmarks[industry] = {
                **data,
                "confidence": "seed",
                "business_count": 0,
                "last_updated": datetime.utcnow().isoformat(),
            }
            self.business_counts[industry] = 0

    def get_health_benchmarks(self, industry: str) -> dict:
        bench = self.benchmarks.get(
            industry,
            self.benchmarks.get("default", {})
        )
        return bench.get("health", SEED_BENCHMARKS["default"]["health"])

    def get_constraint_frequency(self, industry: str) -> dict:
        bench = self.benchmarks.get(industry, {})
        return bench.get(
            "constraint_frequency",
            SEED_BENCHMARKS.get(industry, SEED_BENCHMARKS["default"])["constraint_frequency"]
        )

    def get_field_threshold(self, field: str, industry: str, revenue_band: str = "over_100m") -> dict:
        return industry_benchmarks.get_field_threshold(field, industry, revenue_band)

    def get_avg_opportunity(self, industry: str, revenue_band: str = "over_100m") -> dict:
        bench = self.benchmarks.get(industry, {})
        opp = bench.get("avg_opportunity", {})
        return opp.get(revenue_band) or opp.get("over_100m") or industry_benchmarks.get_avg_opportunity(industry, revenue_band)

    def get_confidence(self, industry: str) -> str:
        count = self.business_counts.get(industry, 0)
        return _get_confidence(count)

    def evolve(
        self,
        industry: str,
        new_health_scores: dict,
        detected_constraint_keys: list[str],
        opportunity_values: dict = None,
        revenue_band: str = "over_100m",
    ) -> dict:
        if industry not in self.benchmarks:
            self.benchmarks[industry] = {
                **SEED_BENCHMARKS.get("default", {}),
                "confidence": "seed",
                "business_count": 0,
                "last_updated": datetime.utcnow().isoformat(),
            }
            self.business_counts[industry] = 0

        if revenue_band not in REVENUE_BANDS:
            revenue_band = "over_100m"

        count = self.business_counts.get(industry, 0)
        weight = _get_evolution_weight(count)
        new_weight = 1.0 - weight

        current = self.benchmarks[industry]
        changes = {}

        current_health = current.get("health", {})
        new_health = {}
        for pillar, current_score in current_health.items():
            new_score = new_health_scores.get(pillar, current_score)
            evolved = round(
                (current_score * weight) + (new_score * new_weight)
            )
            new_health[pillar] = evolved
            if evolved != current_score:
                changes[f"health.{pillar}"] = {
                    "from": current_score,
                    "to": evolved,
                    "new_data": new_score,
                }

        current_freq = current.get("constraint_frequency", {})
        new_freq = {}
        all_constraint_keys = list(current_freq.keys())

        for key in all_constraint_keys:
            current_rate = current_freq.get(key, 0.3)
            new_rate = 1.0 if key in detected_constraint_keys else 0.0
            evolved_rate = round(
                (current_rate * weight) + (new_rate * new_weight), 3
            )
            new_freq[key] = evolved_rate

        current_opp_all = current.get("avg_opportunity", {})
        current_band_opp = (
            current_opp_all.get(revenue_band)
            or current_opp_all.get("over_100m")
            or {"low": 0, "high": 0}
        )
        new_opp_all = dict(current_opp_all)

        if opportunity_values:
            opp_low = opportunity_values.get("total_low", current_band_opp.get("low", 0))
            opp_high = opportunity_values.get("total_high", current_band_opp.get("high", 0))
            new_band_opp = dict(current_band_opp)
            if opp_low > 0:
                new_band_opp["low"] = round(
                    (current_band_opp.get("low", opp_low) * weight) +
                    (opp_low * new_weight)
                )
            if opp_high > 0:
                new_band_opp["high"] = round(
                    (current_band_opp.get("high", opp_high) * weight) +
                    (opp_high * new_weight)
                )
            new_opp_all[revenue_band] = new_band_opp
            if new_band_opp != current_band_opp:
                changes[f"avg_opportunity.{revenue_band}"] = {
                    "from": current_band_opp,
                    "to": new_band_opp,
                }

        self.business_counts[industry] = count + 1
        new_count = self.business_counts[industry]

        self.benchmarks[industry] = {
            **current,
            "health": new_health,
            "constraint_frequency": new_freq,
            "avg_opportunity": new_opp_all,
            "confidence": _get_confidence(new_count),
            "business_count": new_count,
            "last_updated": datetime.utcnow().isoformat(),
        }

        history_entry = {
            "industry": industry,
            "revenue_band": revenue_band,
            "business_count": new_count,
            "confidence": _get_confidence(new_count),
            "changes": changes,
            "evolved_at": datetime.utcnow().isoformat(),
        }
        self.evolution_history.append(history_entry)

        return {
            "industry": industry,
            "revenue_band": revenue_band,
            "business_count": new_count,
            "confidence": _get_confidence(new_count),
            "changes_made": len(changes),
            "changes": changes,
        }

    def summary(self) -> dict:
        return {
            "industries_tracked": list(self.benchmarks.keys()),
            "business_counts": self.business_counts,
            "confidence_levels": {
                industry: _get_confidence(count)
                for industry, count in self.business_counts.items()
            },
            "evolution_events": len(self.evolution_history),
            "current_benchmarks": {
                industry: {
                    "health_overall": data.get("health", {}).get("overall", 0),
                    "confidence": data.get("confidence", "seed"),
                    "business_count": data.get("business_count", 0),
                }
                for industry, data in self.benchmarks.items()
            },
        }


def evolve_benchmarks_from_result(
    result: dict[str, Any],
    store: BenchmarkStore,
    industry: str,
    revenue_band: str = "over_100m",
) -> dict[str, Any]:
    health = result.get("health", {})
    pillars = health.get("pillars", {})

    new_health_scores = {
        pillar: data.get("score", 50)
        for pillar, data in pillars.items()
    }
    new_health_scores["overall"] = health.get("overall", 50)

    all_constraints = (
        [result.get("primary_constraint")] +
        result.get("secondary_constraints", []) +
        result.get("unverified_flags", [])
    )
    detected_keys = [
        c.get("key", "") for c in all_constraints if c
    ]

    total_opportunity = result.get("total_opportunity", {})

    evolution = store.evolve(
        industry=industry,
        new_health_scores=new_health_scores,
        detected_constraint_keys=detected_keys,
        opportunity_values=total_opportunity,
        revenue_band=revenue_band,
    )

    return evolution
