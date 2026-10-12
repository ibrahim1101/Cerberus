import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const ALLOWED = new Set(["ai", "virustotal", "abuseipdb", "otx", "greynoise", "shodan", "smtp"]);

export default function CredentialConfiguration({ provider }) {
  const [secret, setSecret] = useState("");
  const [configured, setConfigured] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    let alive = true;
    setSecret("");
    setConfigured(null);
    setMessage("");
    if (!ALLOWED.has(provider)) return;
    api.credentialStatus(provider).then(result => {
      if (alive) setConfigured(result.configured);
    }).catch(error => { if (alive) setMessage(error.message); });
    return () => { alive = false; };
  }, [provider]);

  if (!ALLOWED.has(provider)) return <p className="text-xs text-pg-muted">Credential configuration for this provider is not implemented.</p>;

  async function run(action) {
    setBusy(true);
    setMessage("");
    try {
      const result = action === "save"
        ? await api.saveCredential(provider, secret)
        : await api.deleteCredential(provider);
      setConfigured(result.configured);
      setSecret("");
      setMessage(action === "save" ? "Credential stored in the operating system vault. Connection not tested." : "Credential removed.");
    } catch (error) {
      setMessage(error.message || "Secure vault operation failed");
    } finally {
      setBusy(false);
    }
  }
  return <div className="space-y-2">
    <label htmlFor={`credential-${provider}`} className="block text-xs font-medium">API key / credential</label>
    <input id={`credential-${provider}`} type="password" autoComplete="off" value={secret}
      onChange={event => setSecret(event.target.value)} placeholder="Enter credential (never displayed after saving)"
      className="w-full rounded-md border border-pg-line bg-pg-bg p-2 text-sm" />
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" disabled={busy || !secret.trim()} onClick={() => run("save")}
        className="rounded-md border border-pg-accent px-3 py-1.5 text-xs disabled:opacity-40">Save to secure vault</button>
      <button type="button" disabled={busy || !configured} onClick={() => run("delete")}
        className="rounded-md border border-pg-line px-3 py-1.5 text-xs disabled:opacity-40">Remove key</button>
      <span className="text-xs text-pg-muted">{configured === null ? "Status unavailable" : configured ? "Key saved · not connected" : "No key saved"}</span>
    </div>
    {message && <p role="status" className="text-xs text-pg-muted">{message}</p>}
    <p className="text-xs text-pg-muted">This stores credentials only. Provider connectivity and AI/webhook delivery are not yet active. Do not enter a key if you do not trust this development build.</p>
  </div>;
}
