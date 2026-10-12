# CERBERUS integrations roadmap — webhooks and AI assistance

Status: planned, not shipped. Protect the v0.1.0-beta.1 release gate; do not silently expand beta scope.

## Goals
- Provider-independent outbound webhooks and optional AI-assisted explanations of scan findings, dependencies, reports and remediation.
- Local-first and opt-in. No raw source, credentials, private-key evidence, or internal file paths transmitted by default.
- Support local inference (Ollama, LM Studio, vLLM, llama.cpp OpenAI-compatible servers), OpenAI-compatible hosted providers, and explicit provider adapters where protocol differences require them.
- Support generic JSON HTTPS webhooks and adapters for Slack, Discord, Teams Workflows, automation platforms (n8n, Make, Zapier) and custom SIEM/SOAR endpoints.

## Phase 1 — foundations
- Settings > Integrations > Webhooks / AI Providers; separate feature flags, enable/disable, connection tests and clear provider status.
- Credentials in OS-protected storage where available; never plaintext app settings, reports, logs or Git history. Mask secrets and support rotation.
- Restrict outbound URLs and redirects; reject cloud metadata/private-network SSRF destinations for remote webhooks, with explicit local AI endpoint allowance. Validate TLS by default.
- Explicit privacy preview before any remote AI request or webhook delivery; opt-in scope and per-provider data controls.
- Typed event schema versioning, audit log, rate limits, bounded queue, timeout, exponential backoff and idempotency keys; no duplicate deliveries after retries.
- Unit/integration tests with mock HTTP servers; no real keys in CI.

## Phase 2 — webhooks
- Events: scan.started, scan.progress (throttled), scan.completed, scan.cancelled, scan.failed, finding.detected, severity.threshold, dependency.advisory, export.completed.
- Payload templates: generic JSON, Slack text/blocks, Discord embeds, Teams Workflows cards. Respect provider payload limits and rate limits.
- Custom headers, optional HMAC-SHA256 signature for generic endpoints, secret rotation, delivery history, replay with explicit user action, redacted test event.
- Incoming webhooks, if later required, must be authenticated and disabled by default; never expose desktop bridge publicly.

## Phase 3 — AI assistant
- Provider registry: OpenAI-compatible chat-completions as baseline, Ollama native and Anthropic/Gemini adapters as needed. Feature-detect streaming, tools, context and model listing instead of assuming identical behavior.
- Ask about a finding, explain severity and evidence, suggest safe verification and remediation steps, summarize scans, translate technical reports into plain language.
- Read-only by default: no silent code edits, key rotation, deletions, shell commands or auto-remediation. Cite finding IDs, file paths locally, and label model outputs as unverified guidance.
- Local AI default for sensitive investigations; cloud calls only after user approves sanitized preview. Support no-key local endpoints and API-key remote endpoints.
- Cancellation, token/usage limits, model selection, timeouts, streaming and provider-specific error messages.

## Release criteria
- Do not claim maximum/universal compatibility: maintain a documented compatibility matrix and tested protocol versions.
- Security review for prompt injection, exfiltration, SSRF, credential leaks and tool-use authorization.
- Complete beta first, then deliver integrations as a tested follow-up release unless release gate is explicitly revised.
