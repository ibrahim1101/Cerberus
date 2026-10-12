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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function IntegrationCatalog({ selected }) {
  const [open, setOpen] = useState(selected || "ai");
  const [category, setCategory] = useState(selected === "webhooks" ? "Notifications" : "All");
  useEffect(() => { if (selected) { setOpen(selected); setCategory(selected === "webhooks" || ["smtp","discord","slack"].includes(selected) ? "Notifications" : "All"); } }, [selected]);
  return <Panel title="Integrations & Providers" testId="settings-integrations-panel">
    <p className="text-xs text-pg-muted mb-3">Choose Webhooks & Notifications to configure alert delivery. Provider connections remain unavailable until the secure backend is implemented.</p>
    <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Integration categories">
      {["All", "AI", "Threat Intelligence", "Notifications"].map(group => <button type="button" key={group} onClick={() => { setCategory(group); setOpen(group === "Notifications" ? "webhooks" : group === "AI" ? "ai" : null); }} className={`rounded-md border px-3 py-2 text-xs ${category === group ? "border-pg-accent text-pg-text bg-pg-surface2" : "border-pg-line text-pg-muted"}`} data-testid={`integration-category-${group.toLowerCase().replaceAll(" ", "-")}`}>{group === "Notifications" ? "Webhooks & Notifications" : group}</button>)}
    </div>
    {PROVIDERS.filter(provider => category === "All" || provider.category === category).map(provider => <div key={provider.id} className="border-b border-pg-line/50 last:border-0">
      <button type="button" className="w-full text-left py-3 flex items-center justify-between gap-3" aria-expanded={open === provider.id} onClick={() => setOpen(open === provider.id ? null : provider.id)} data-testid={`integration-${provider.id}-toggle`}>
        <span><span className="text-sm font-medium">{provider.title}</span><span className="block text-xs text-pg-muted">{provider.description}</span></span>
        <span className="text-xs shrink-0 text-pg-muted">{open === provider.id ? "▾" : "▸"} Planned</span>
      </button>
      {open === provider.id && <div className="bg-pg-bg/50 rounded-lg p-3 mb-3 space-y-2" data-testid={`integration-${provider.id}-details`}>
        <p className="text-xs text-pg-muted">Category: {provider.category}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div><Label htmlFor={`provider-${provider.id}-endpoint`}>Endpoint / Server URL</Label><Input id={`provider-${provider.id}-endpoint`} placeholder={provider.id === "ai" ? "http://127.0.0.1:11434" : provider.id === "webhooks" ? "https://example.com/webhook" : "Provider endpoint"} disabled className="mt-1" /></div>
          <div><Label htmlFor={`provider-${provider.id}-secret`}>API Key / Credential</Label><Input id={`provider-${provider.id}-secret`} type="password" placeholder="Secure credential vault pending" disabled className="mt-1" /></div>
          {provider.id === "ai" && <div><Label htmlFor="provider-ai-model">Model</Label><Input id="provider-ai-model" placeholder="Select or enter model" disabled className="mt-1" /></div>}
          {provider.id === "smtp" && <div><Label htmlFor="provider-smtp-port">SMTP Port</Label><Input id="provider-smtp-port" placeholder="587" disabled className="mt-1" /></div>}
        </div>
        <p className="text-xs text-pg-muted">Fields are disabled until secure backend storage and connection tests are available. No credentials are accepted in this preview.</p>
        <p className="text-xs text-pg-warn">Not connected — no requests or data are being sent.</p>
      </div>}
    </div>)}
  </Panel>;
}

