# BEI Enterprise Field Wiring Plan

**Status: SUPERSEDED.** The original placeholder version of this file (committed in `901f889`) was never actually populated — it contained only literal placeholder text and was never a real field-by-field plan.

As of commit `b5fd16c`, this gap is closed: all 164 real fields collected by `frontend/app/connect/page.tsx` are wired into `build_twin()` in `services/twin/engine.py`. The remaining 2 collected fields (`client_id`, `client_secret`) are connector OAuth credentials and are correctly never wired into the twin.

See `BEI_Session4_Master_Status.md` for the full history of how this was closed out, including 5 reconciliation fixes between numeric enterprise fields and banded MRI fields:
1. `avg_utilisation_pct` <-> `capacity_utilisation`
2. `top_3_clients_revenue_pct` <-> `revenue_concentration`
3. `avg_response_time_hours` -> added as 2nd trigger on `lead_response_deficit`
4. `project_on_time_pct` / `avg_discount_pct` -> new constraints `delivery_execution_gap` / `systematic_discounting_erosion`
5. `lead_to_client_conversion` <-> `conversion_rate`

**Next step:** Step 4 -- writing constraint definitions in `services/detection/engine.py` so this wired data actually drives constraint detection, not just sits in the twin object unread (Golden Rule 1/8). See the Master Status doc's Step 4 list for the full field list still needing constraint coverage.
