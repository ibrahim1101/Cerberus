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
