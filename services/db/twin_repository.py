"""
BEI Business Twin Repository
Handles persistence of Business Twin records to Supabase.
One Twin per business — upsert on business_id (enforced by
a unique constraint added in migration 014).
"""

from typing import Any
from services.db.supabase_client import get_supabase


def persist_twin(twin_record: dict[str, Any]) -> str:
    """
    Upserts a Business Twin record into the business_twins table.
    Returns the business_twins.id (UUID, as a string) for the
    upserted row — required by every downstream table
    (constraints, opportunities) as a foreign key.

    Raises on failure rather than swallowing errors — a Twin
    write failing silently would corrupt every table built on
    top of it.
    """
    client = get_supabase()

    result = (
        client.table("business_twins")
        .upsert(twin_record, on_conflict="business_id")
        .execute()
    )

    if not result.data:
        raise RuntimeError(
            f"Twin upsert returned no data for business_id="
            f"{twin_record.get('business_id')}. Response: {result}"
        )

    return result.data[0]["id"]
