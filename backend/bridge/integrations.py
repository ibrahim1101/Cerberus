"""Provider capabilities and safe, read-only integration discovery.

Never report a provider as connected until a verified adapter test succeeds.
No API keys or secret material are accepted by this module.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from bridge import credential_vault

router = APIRouter(prefix="/api/integrations", tags=["integrations"])

PROVIDERS = (
    ("ai", "AI Security Assistant", "ai", ("chat", "model-selection")),
    ("virustotal", "VirusTotal", "threat-intelligence", ("hash", "domain", "ip", "url")),
    ("abuseipdb", "AbuseIPDB", "threat-intelligence", ("ip-reputation",)),
    ("otx", "AlienVault OTX", "threat-intelligence", ("indicators",)),
    ("greynoise", "GreyNoise", "threat-intelligence", ("ip-context",)),
    ("shodan", "Shodan", "threat-intelligence", ("host-intelligence",)),
    ("webhooks", "Generic Webhooks", "notifications", ("scan-events", "https")),
    ("smtp", "SMTP / Email", "notifications", ("email-alerts",)),
    ("discord", "Discord", "notifications", ("webhook-alerts",)),
    ("slack", "Slack", "notifications", ("webhook-alerts",)),
    ("teams", "Microsoft Teams", "notifications", ("workflow-alerts",)),
    ("n8n", "n8n", "notifications", ("automation",)),
)

@router.get("/providers")
def providers():
    return {"providers": [
        {"id": identifier, "name": name, "category": category,
         "planned_capabilities": list(capabilities), "status": "not_implemented",
         "configured": False, "connection_tested": False}
        for identifier, name, category, capabilities in PROVIDERS
    ]}

# Credential routes are authenticated by the existing desktop bridge middleware.
# Credentials never appear in responses, logs, or frontend persistent storage.
CREDENTIAL_PROVIDERS = frozenset({"ai", "virustotal", "abuseipdb", "otx", "greynoise", "shodan", "smtp"})

class CredentialWrite(BaseModel):
    credential: str = Field(min_length=1, max_length=8192)

def _allowed(provider: str) -> None:
    if provider not in CREDENTIAL_PROVIDERS:
        raise HTTPException(status_code=404, detail="Unsupported credential provider")

def _vault_error(exc: credential_vault.VaultUnavailable):
    raise HTTPException(status_code=503, detail="Secure operating system credential storage unavailable") from exc

@router.get("/credentials/{provider}")
def credential_status(provider: str):
    _allowed(provider)
    try:
        return {"provider": provider, "configured": credential_vault.exists(provider)}
    except credential_vault.VaultUnavailable as exc:
        _vault_error(exc)

@router.put("/credentials/{provider}")
def save_credential(provider: str, payload: CredentialWrite):
    _allowed(provider)
    try:
        credential_vault.store(provider, payload.credential)
    except credential_vault.VaultUnavailable as exc:
        _vault_error(exc)
    return {"provider": provider, "configured": True}

@router.delete("/credentials/{provider}")
def delete_credential(provider: str):
    _allowed(provider)
    try:
        credential_vault.remove(provider)
    except credential_vault.VaultUnavailable as exc:
        _vault_error(exc)
    return {"provider": provider, "configured": False}
