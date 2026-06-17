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
"""

from typing import Any
from datetime import datetime


# ============================================================
# SEED BENCHMARKS
# Starting values from Phase 4 static benchmarks.
# These evolve as real business data accumulates.
# ============================================================

SEED_BENCHMARKS = {
    "estate_agency": {
        "health": {
            "growth":     60,
            "operations": 55,
            "strategy":   50,
            "risk":       55,
            "context":    60,
            "overall":    56,
        },
        "constraint_frequency": {
            "trust_infrastructure_deficit": 0.70,
            "lead_response_deficit":        0.60,
            "pricing_constraint":           0.45,
            "founder_dependency":           0.50,
            "capacity_constraint":          0.35,
            "offer_weakness":               0.40,
            "revenue_concentration_risk":   0.30,
            "staffing_inefficiency":        0.25,
            "management_bottleneck":        0.30,
            "market_selection_risk":        0.15,
        },
        "avg_opportunity": {
            "revenue_low":  15000,
            "revenue_high": 45000,
        },
        "deployment_success": {
            "review_system":   75,
            "lead_routing":    70,
            "trust_infrastructure": 65,
            "crm_config":      60,
        },
    },
    "marketing_agency": {
        "health": {
            "growth":     55,
            "operations": 50,
            "strategy":   60,
            "risk":       50,
            "context":    55,
            "overall":    54,
        },
        "constraint_frequency": {
            "founder_dependency":           0.75,
            "capacity_constraint":          0.70,
            "offer_weakness":               0.60,
            "pricing_constraint":           0.55,
            "staffing_inefficiency":        0.50,
            "revenue_concentration_risk":   0.45,
            "trust_infrastructure_deficit": 0.35,
            "lead_response_deficit":        0.30,
            "management_bottleneck":        0.40,
            "market_selection_risk":        0.15,
        },
        "avg_opportunity": {
            "revenue_low":  20000,
            "revenue_high": 60000,
        },
        "deployment_success": {
            "seo_content":  70,
            "crm_config":   65,
            "tasks":        60,
            "reporting":    65,
        },
    },
    "accountancy_firm": {
        "health": {
            "growth":     50,
            "operations": 65,
            "strategy":   55,
            "risk":       65,
            "context":    55,
            "overall":    58,
        },
        "constraint_frequency": {
            "capacity_constraint":          0.70,
            "staffing_inefficiency":        0.65,
            "founder_dependency":           0.55,
            "revenue_concentration_risk":   0.50,
            "pricing_constraint":           0.45,
            "offer_weakness":               0.40,
            "trust_infrastructure_deficit": 0.30,
            "management_bottleneck":        0.35,
            "lead_response_deficit":        0.20,
            "market_selection_risk":        0.15,
        },
        "avg_opportunity": {
            "revenue_low":  18000,
            "revenue_high": 50000,
        },
        "deployment_success": {
            "reporting":    75,
            "crm_config":   65,
            "tasks":        60,
            "monitoring":   65,
        },
    },
}


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
    """
    Weight for existing benchmark in weighted moving average.
    Higher weight = existing benchmark changes more slowly.
    Decreases as more businesses contribute.
    """
    if business_count <= 1:
        return 0.90
    elif business_count <= 5:
        return 0.85
    elif business_count <= 20:
        return 0.80
    elif business_count <= 50:
        return 0.75
    return 0.70


# ============================================================
# BENCHMARK STORE
# Holds current benchmarks and evolution history.
# ============================================================

class BenchmarkStore:
    """
    Stores and evolves benchmarks for all industries.
    MVP 1: in-memory store initialised from seed values.
    Future: persists to Supabase benchmark_records table.
    """

    def __init__(self):
        self.benchmarks = {}
        self.business_counts = {}
        self.evolution_history = []
        self.created_at = datetime.utcnow().isoformat()

        # Initialise from seed benchmarks
        for industry, data in SEED_BENCHMARKS.items():
            self.benchmarks[industry] = {
                **data,
                "confidence": "seed",
                "business_count": 0,
                "last_updated": datetime.utcnow().isoformat(),
            }
            self.business_counts[industry] = 0

    def get_health_benchmarks(self, industry: str) -> dict:
        """Get current health benchmarks for an industry."""
        bench = self.benchmarks.get(
            industry,
            self.benchmarks.get("estate_agency", {})
        )
        return bench.get("health", SEED_BENCHMARKS["estate_agency"]["health"])

    def get_constraint_frequency(self, industry: str) -> dict:
        """Get constraint frequency rates for an industry."""
        bench = self.benchmarks.get(industry, {})
        return bench.get(
            "constraint_frequency",
            SEED_BENCHMARKS.get(industry, SEED_BENCHMARKS["estate_agency"])["constraint_frequency"]
        )

    def get_confidence(self, industry: str) -> str:
        count = self.business_counts.get(industry, 0)
        return _get_confidence(count)

    def evolve(
        self,
        industry: str,
        new_health_scores: dict,
        detected_constraint_keys: list[str],
        opportunity_values: dict = None,
    ) -> dict:
        """
        Update benchmarks with data from a new business analysis.
        Uses weighted moving average to evolve benchmarks gradually.
        """

        if industry not in self.benchmarks:
            # New industry — initialise from closest seed
            self.benchmarks[industry] = {
                **SEED_BENCHMARKS.get("estate_agency", {}),
                "confidence": "seed",
                "business_count": 0,
                "last_updated": datetime.utcnow().isoformat(),
            }
            self.business_counts[industry] = 0

        count = self.business_counts.get(industry, 0)
        weight = _get_evolution_weight(count)
        new_weight = 1.0 - weight

        current = self.benchmarks[industry]
        changes = {}

        # Evolve health benchmarks
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

        # Evolve constraint frequency
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

        # Evolve opportunity benchmarks
        current_opp = current.get("avg_opportunity", {})
        new_opp = dict(current_opp)
        if opportunity_values:
            opp_low = opportunity_values.get("total_low", current_opp.get("revenue_low", 0))
            opp_high = opportunity_values.get("total_high", current_opp.get("revenue_high", 0))
            if opp_low > 0:
                new_opp["revenue_low"] = round(
                    (current_opp.get("revenue_low", opp_low) * weight) +
                    (opp_low * new_weight)
                )
            if opp_high > 0:
                new_opp["revenue_high"] = round(
                    (current_opp.get("revenue_high", opp_high) * weight) +
                    (opp_high * new_weight)
                )

        # Update store
        self.business_counts[industry] = count + 1
        new_count = self.business_counts[industry]

        self.benchmarks[industry] = {
            **current,
            "health": new_health,
            "constraint_frequency": new_freq,
            "avg_opportunity": new_opp,
            "confidence": _get_confidence(new_count),
            "business_count": new_count,
            "last_updated": datetime.utcnow().isoformat(),
        }

        # Record evolution history
        history_entry = {
            "industry": industry,
            "business_count": new_count,
            "confidence": _get_confidence(new_count),
            "changes": changes,
            "evolved_at": datetime.utcnow().isoformat(),
        }
        self.evolution_history.append(history_entry)

        return {
            "industry": industry,
            "business_count": new_count,
            "confidence": _get_confidence(new_count),
            "changes_made": len(changes),
            "changes": changes,
        }

    def summary(self) -> dict:
        """Return benchmark store summary."""
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
) -> dict[str, Any]:
    """
    Update benchmarks from a completed intelligence result.
    Called after every business analysis.
    """

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
    )

    return evolution
