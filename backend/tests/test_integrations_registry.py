"""Regression checks for integration discovery. No credentials or network calls."""
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from bridge.integrations import providers

def test_provider_registry_never_claims_connection():
    items = providers()["providers"]
    assert {"ai", "webhooks", "virustotal", "abuseipdb", "smtp"} <= {p["id"] for p in items}
    assert len({p["id"] for p in items}) == len(items)
    assert all(p["status"] == "not_implemented" and not p["configured"] and not p["connection_tested"] for p in items)
    assert all("key" not in str(p).lower() and "secret" not in str(p).lower() for p in items)
