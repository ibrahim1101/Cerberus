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

from fastapi import HTTPException
from bridge import credential_vault
from bridge.integrations import CredentialWrite, credential_status, save_credential, delete_credential
import pytest

def test_credential_lifecycle_without_exposing_secret(monkeypatch):
    memory = {}
    monkeypatch.setattr(credential_vault, "store", lambda p, s: memory.__setitem__(p, s))
    monkeypatch.setattr(credential_vault, "exists", lambda p: p in memory)
    monkeypatch.setattr(credential_vault, "remove", lambda p: memory.pop(p, None))
    secret = "TEST-SECRET-NOT-TO-BE-RETURNED"
    assert save_credential("ai", CredentialWrite(credential=secret)) == {"provider": "ai", "configured": True}
    assert credential_status("ai")["configured"] is True
    assert secret not in str(credential_status("ai"))
    assert secret not in str(delete_credential("ai"))
    assert credential_status("ai")["configured"] is False

def test_unknown_provider_rejected():
    with pytest.raises(HTTPException) as error:
        save_credential("arbitrary", CredentialWrite(credential="secret"))
    assert error.value.status_code == 404

def test_missing_vault_fails_closed(monkeypatch):
    def unavailable(_):
        raise credential_vault.VaultUnavailable("test")
    monkeypatch.setattr(credential_vault, "exists", unavailable)
    with pytest.raises(HTTPException) as error:
        credential_status("ai")
    assert error.value.status_code == 503
