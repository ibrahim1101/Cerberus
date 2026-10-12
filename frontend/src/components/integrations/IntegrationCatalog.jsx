const PROVIDERS = [
  { id: "ai", title: "AI Security Assistant", category: "AI", description: "Ollama, LM Studio, OpenAI-compatible, OpenAI, Anthropic, Gemini, Groq, OpenRouter and more." },
  { id: "virustotal", title: "VirusTotal", category: "Threat Intelligence", description: "File hash, URL, domain and IP reputation. Public API usage and licensing limits apply." },
  { id: "abuseipdb", title: "AbuseIPDB", category: "Threat Intelligence", description: "IP address abuse reports and reputation." },
  { id: "otx", title: "AlienVault OTX", category: "Threat Intelligence", description: "Community threat intelligence pulses and indicators." },
  { id: "greynoise", title: "GreyNoise", category: "Threat Intelligence", description: "Internet scanning and IP context." },
  { id: "shodan", title: "Shodan", category: "Threat Intelligence", description: "Internet-facing asset intelligence." },
  { id: "webhooks", title: "Generic Webhooks", category: "Notifications", description: "Outbound HTTPS event notifications with filters and retries." },
  { id: "smtp", title: "SMTP / Email", category: "Notifications", description: "Email reports and scan alerts." },
  { id: "discord", title: "Discord", category: "Notifications", description: "Channel alerts through Discord webhooks." },
  { id: "slack", title: "Slack", category: "Notifications", description: "Workspace alert delivery." },
];
import { useEffect, useState } from "react";
import { Panel } from "@/components/common/Panel";

export default function IntegrationCatalog({ selected }) {
  const [open, setOpen] = useState(selected || "ai");
  useEffect(() => { if (selected) setOpen(selected); }, [selected]);
  return <Panel title="Integrations & Providers" testId="settings-integrations-panel">
    <p className="text-xs text-pg-muted mb-3">Expandable provider configurations. Connections are not yet available; no API keys are collected or stored in this preview.</p>
    {PROVIDERS.map(provider => <div key={provider.id} className="border-b border-pg-line/50 last:border-0">
      <button type="button" className="w-full text-left py-3 flex items-center justify-between gap-3" aria-expanded={open === provider.id} onClick={() => setOpen(open === provider.id ? null : provider.id)} data-testid={`integration-${provider.id}-toggle`}>
        <span><span className="text-sm font-medium">{provider.title}</span><span className="block text-xs text-pg-muted">{provider.description}</span></span>
        <span className="text-xs shrink-0 text-pg-muted">{open === provider.id ? "▾" : "▸"} Planned</span>
      </button>
      {open === provider.id && <div className="bg-pg-bg/50 rounded-lg p-3 mb-3 space-y-2" data-testid={`integration-${provider.id}-details`}>
        <p className="text-xs text-pg-muted">Category: {provider.category}</p>
        <p className="text-sm">Configuration, credential vault, connection test and provider-specific settings will be enabled after the backend adapter is implemented and verified.</p>
        <p className="text-xs text-pg-warn">Not connected — no requests or data are being sent.</p>
      </div>}
    </div>)}
  </Panel>;
}

