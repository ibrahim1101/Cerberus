# CERBERUS AI and webhook implementation — Phase 1

Branch: `feat/cerberus-ai-webhook-integrations`. This branch is independent of `feat/cerberus-linux-macos-preview` and the Windows beta on `main`.

## Phase 1 acceptance
- Settings tabs: AI Providers and Webhooks, with disabled/unconfigured states and no fake connection success.
- Backend: provider-neutral config models and validated API routes, not client-side direct secret storage.
- Secret handling: platform keychain when available; do not persist plaintext keys to existing JSON settings, reports, browser localStorage or logs.
- AI: support OpenAI-compatible chat-completions as first adapter, including Ollama localhost and LM Studio. Verify model list, model selection, timeout and test request; no cloud upload without explicit approval.
- Webhooks: outbound HTTPS generic JSON with allowlisted destination rules, test payload, signing secret, bounded retries and audit log. Provider-specific formatting later.
- Network security: SSRF protections and redirect policy, local-only exception for explicitly approved AI endpoints, response size and timeout bounds.
- Privacy: redact detected secrets and file contents from all remote payloads by default; user must preview and approve any sensitive context.
- Tests: fake local HTTP server, invalid URL, missing key, invalid credentials, timeout, disabled configuration, masking and no data leakage.
- CI: frontend and Python tests, native Windows bridge validation before merging.
- UX: show real provider errors and unsupported capabilities rather than claiming universal compatibility.

## Sequence
1. Provider/config schemas and secure credential abstraction.
2. AI provider CRUD, model discovery and connection test.
3. Webhook CRUD, test delivery, event filters and delivery audit.
4. Read-only finding explanation, scan summary and report Q&A.
5. Provider adapters, delivery templates and advanced AI capabilities.

No integration is shipped or usable merely because this specification exists.

## Expanded compatibility requirements (2026-10-12)
User requests maximum extensibility with all providers configured through expandable navigation, not a separate block.
- Navigation: expandable sections for AI Security Assistant, Threat Intelligence, Vulnerability Intelligence, Notifications & Automation, Security Platform Connectors. Provider submenus open configuration forms. Name opens feature; arrow expands. Persist collapsed state locally; keyboard and screen-reader accessible.
- AI: Ollama, LM Studio, llama.cpp, vLLM, OpenAI-compatible, OpenAI, Anthropic, Gemini, Azure OpenAI, Groq, OpenRouter, Together, Hugging Face. Adapter capability flags distinguish chat, streaming, tool calling, embeddings, model discovery and vision; do not claim all models support all functions.
- Threat intelligence: VirusTotal v3, AbuseIPDB v2, AlienVault OTX, GreyNoise, Shodan, Censys, URLhaus, MalwareBazaar. Optional manual lookups and safe auto-enrichment; no automatic file uploads.
- Vulnerabilities: OSV, NVD, CISA KEV, GitHub Security Advisories, FIRST EPSS.
- Notifications: generic HTTPS webhook, Discord, Slack, Teams Workflows, n8n, SMTP, optional email providers. Event filters for scan complete, critical findings, failures; test, retries, status, deduplication.
- SIEM/SOAR: generic syslog/CEF/LEEF and JSON HTTP first, then Splunk HEC, Elastic, Wazuh, Microsoft Sentinel; STIX/TAXII feed support later.
- Every provider: Enabled, Status, Configure, Test, Last checked, supported features, privacy disclosure, limits, and clear error messages. No invented online/offline status.
- Credentials: OS credential store, masking, delete/rotate, no plaintext logs. Local AI should work with no API key.
- License/terms: VirusTotal Public API has non-commercial restrictions and strict quotas; require appropriate licensed tier for commercial CERBERUS usage. AbuseIPDB use current APIv2.
- Scope: aspirational provider catalog; adapters must be individually implemented and tested before marked supported.
