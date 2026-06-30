"""
BEI Supabase Client
Single shared Supabase client for the Python backend.
Uses the service_role key — this bypasses Row Level Security,
so this client must only ever be used server-side, never exposed
to the frontend or any client-facing response.
"""

import os
from supabase import create_client, Client

_client: Client | None = None


def get_supabase() -> Client:
    """
    Returns a singleton Supabase client, initialised on first call.
    Raises a clear error at call time if env vars are missing,
    rather than failing silently or crashing at import time.
    """
    global _client

    if _client is not None:
        return _client

    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

    if not url or not key:
        raise RuntimeError(
            "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must both be set "
            "as environment variables. Check Railway service variables."
        )

    _client = create_client(url, key)
    return _client
