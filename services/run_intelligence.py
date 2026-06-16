"""
BEI Intelligence Runner
Called by the Next.js API route.
Reads JSON from stdin, runs the intelligence pipeline, outputs JSON to stdout.
"""

import sys
import os
import json

# Ensure repo root is on the Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.orchestrator import run_intelligence


def main():
    raw = sys.stdin.read()
    data = json.loads(raw)

    result = run_intelligence(
        answers=data["answers"],
        business_id=data["business_id"],
        industry=data.get("industry", ""),
        revenue_band=data.get("revenue_band", "Under 250k"),
    )

    print(json.dumps(result, ensure_ascii=False, default=str))


if __name__ == "__main__":
    main()
