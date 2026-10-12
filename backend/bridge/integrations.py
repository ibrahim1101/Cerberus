"""Provider capabilities and safe, read-only integration discovery.

Never report a provider as connected until a verified adapter test succeeds.
No API keys or secret material are accepted by this module.
"""
from fastapi import APIRouter

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
