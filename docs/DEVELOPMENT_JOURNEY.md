# CERBERUS — Development Journey

**Living project record | Updated 2026-10-12 | Branch: `main` | Status: pre-release Windows beta candidate**

This is a curated chronology of confirmed development work, observed failures, regression tests, troubleshooting, remaining limitations and decisions. It complements the much longer [ENGINEERING_HISTORY.md](ENGINEERING_HISTORY.md), which retains original granular notes and commit/run links. This document **does not claim** that every historical test or feature has been physically verified. Historic CI status describes the exact commit tested, not all later commits.

## 1. Origin, identity and repository boundaries

CERBERUS began as a React UI and FastAPI bridge for the independent PipelineGuard scanner. The product was rebranded to CERBERUS as a standalone local-first DevSecOps desktop experience with a Tauri 2 shell, bundled scanner, reports, investigation views and optional future integrations. The app source is in this repository (`ibrahim1101/Cerberus`); the independent `ibrahim1101/PipelineGuard` engine repository is **not** a target of CERBERUS changes. Internal identifiers such as `pipelineguard-desktop`, `PIPELINEGUARD_TOKEN` and old CI labels remain technical legacy names and should be migrated carefully, not blindly renamed.

On **2026-10-12**, [PR #1](https://github.com/ibrahim1101/Cerberus/pull/1) merged **36 commits** from `feat/cerberus-ai-webhook-integrations` to `main` (merge `a5a7e2d06dab5076f582a979b37740bd0ae9e9a4`). At the last branch check, `main` was the only remaining branch; the repository had been renamed to Cerberus.

## 2. Architecture and security model

- **Frontend:** React, Tailwind/Radix-based components, routed dashboard/scanning/findings/dependencies/OSV/reports/history/settings/integrations pages; scan monitor, help tooltips and guide.
- **Backend:** Python FastAPI bridge handling scan orchestration, report/history, filesystem browsing, settings, OSV and provider registry. CI uses bundled `engine/`.
- **Desktop:** Tauri 2/Rust shell with local Python sidecar; Windows NSIS installer build, native IPC bridge and managed bridge lifecycle. Linux/macOS preview archives are experimental.
- **Secrets and authentication:** desktop bridge uses a per-launch token; native IPC validates API routes; secret findings are masked. Integration credential API uses Python keyring with fail-closed behavior when OS vault is unavailable; actual installed-platform keychain behavior is still to be tested.
- **Threat boundary:** the browser development bridge may operate without authentication when no desktop token is set. It must stay on loopback, not a public/LAN interface. OSV is optional network traffic; future AI/webhook exfiltration requires explicit consent and redaction.

## 3. Chronology of implemented features and engineering milestones

### October 9 — UI reliability, scan lifecycle and security foundations

1. **Reconnect, initialization and polling:** fixed stale refreshes, selection overwritten after reconnect, out-of-order responses, heartbeat races, overlapping scan polling, and updates after component unmount. Added React regression tests for reconnect, stale requests, polling cleanup, failure/recovery and report-refresh isolation.
2. **Separate connectivity from reports:** an unavailable report/history/activity endpoint must not make a healthy bridge appear offline. Report retry and warning are distinct from scan completion/failure notifications.
3. **Initial CI failures:** [run 37922969181](https://github.com/ibrahim1101/Cerberus/actions/runs/37922969181) failed because CI tried `pip install -e ./engine` on an engine tree without packaging metadata and Jest failed to resolve `@/lib/api`. Fixed the engine import path and test-compatible imports (`857c5fe`, `0fe65b8`). An early polling assertion incorrectly counted unrelated jsdom timers; replaced with an observable no-more-API-calls assertion (`02496d9`). [run 37924278586](https://github.com/ibrahim1101/Cerberus/actions/runs/37924278586) passed.
4. **More test fixture failures:** literal `\\n` escaped text in JSX caused Babel parse errors ([run 37926993456](https://github.com/ibrahim1101/Cerberus/actions/runs/37926993456)); `e2b49e9` corrected newlines and the mock scan lifecycle. Test runs `37928154757` and `37928177818` passed.
5. **Bridge security groundwork:** token-authenticated route checks, invalid scan-ID/traversal rejection, report preview allowlisting and size limits, symlink handling, loopback-only launcher and fresh token generation. Important caveat: the launcher by itself does not provide the desktop frontend token.
6. **Desktop shell work:** Tauri IPC and process management added in later phases; early global-JavaScript-token experiments were transitional and not a reason to assume hardened isolation.

### October 10–11 — Desktop UX, scanner precision and reports

1. **Scanner false-positive investigation:** a physical scan of Locat initially showed **18 findings (17 critical, 1 warning)**; suspected synthetic password test fixtures triggered generic secret patterns. Applied narrowly scoped exact-value test-fixture exemptions (including `test-password-long`, `oldpass8`, `incorrect`, `Velvet Orchard Moonlight`) without blanket suppression. Updated semantic cache version to invalidate stale results; regression cases check unknown credentials, non-test files and token rules. User's later screenshot showed **4 findings (3 critical, 1 warning)**. This demonstrates a reduction in reported findings, **not** proof all removed findings were false positives.
2. **Secret-scan caching and accounting:** previous cache signature tracked regex patterns but not scanner interpretation; introduced `SCANNER_SEMANTICS_VERSION` and invalidation. Added reconciliation `discovered = scanned + reused + skipped_size + skipped_changed + skipped_error` for covered fixtures. HTML report and live scan monitor distinguish scanned, reused, skipped and discovered counts. The physical **255/256** progress observation is not conclusively explained by these counters.
3. **Offline reporting:** backend integration tests exercise JSON and HTML exports, HTML preview and report listing. These do not substitute for physical Windows file-open/export checks.
4. **NSIS reliability:** [Windows packaging run 38156601839](https://github.com/ibrahim1101/Cerberus/actions/runs/38156601839) failed due to a **Chocolatey community feed HTTP 504** fetching NSIS; rerun passed without app changes. `45cb21f` added bounded install retries and compiler-path verification, not an untrusted alternate installer source.
5. **Installer integrity:** `2538bfd` added SHA-256 checksum generation for `Cerberus-Setup-0.1.0.exe`, plus artifact upload. Release gate requires matching the published installer to its same-run checksum.
6. **Bundled engine parity:** `957ff48` changed CI to validate this repository's `engine/` rather than depending on a separate PipelineGuard development branch.
7. **Frontend test failures:** `ScanMonitor.test.jsx` initially failed Jest alias resolution for `@/context/AppContext` ([run 38166155311](https://github.com/ibrahim1101/Cerberus/actions/runs/38166155311)); `adbf339` changed to relative import. Another failure involved transitive `@/lib/utils` from Button; `e09a16f` isolated unrelated UI dependencies in the test. Neither failure established a production scanner defect.

### October 12 — Physical Windows debugging and release work

1. **Folder picker failure:** physical Windows app rendered and reported `Engine bridge: connected`, but selecting a project folder failed with `Cerberus desktop bridge is unavailable`; a later screenshot showed `Invalid bridge response`. This was a **real GUI blocker**. Changes `cbda802` and `5d9d928` improved safe IPC error reporting; `a4179ee` converts non-JSON HTTP errors to status-only JSON; `8f1cce1` tolerates Windows directory metadata/disconnected-drive errors. `ca6a691`, `3bdf55d`, `a2537b7` and `9529848` added Windows encoded-path, route-traversal, packaged filesystem and authenticated `/api/fs/list` regressions. **Do not claim GUI folder picker fixed until retested on the exact current installer.**
2. **Cancellation:** `3cd9c5d` added cooperative cancellation event and `cancelled` state; `91f5c84` added authenticated `POST /api/scan/cancel`, `a443bbc` frontend API, `f329b8e` state handling and `c932323` UI. Idle and unauthenticated API tests added. User physically confirmed cancel scan and native close confirmation later. Blocking operations may still delay cancellation.
3. **Native close guard failure:** Rust validation [run 38230448592](https://github.com/ibrahim1101/Cerberus/actions/runs/38230448592) failed with **E0599** because `tauri::Window` lacked `get_webview`; earlier `window.eval` approach also failed. `3c97475` uses the app manager to retrieve the main webview window. User later verified the close confirmation on Windows.
4. **Help and onboarding:** added reusable HelpTip (`26537c7`), offline searchable How to Use (`36cb470`), Settings help, Scan Project context help and report-format guidance; corrected a nested-button issue (`b2fea6d`). Physical per-control audit remains pending.
5. **CI and beta discipline:** green frontend/backend and packaged Windows checks were repeatedly observed; every additional commit requires its own new validation. v0.1.0 beta checklist remains binding and the public release is not asserted.

### October 12 — Cross-platform previews and AI/webhook foundations

1. **Linux/macOS:** added CI-driven portable preview workflows and desktop validation; these are *not* signed/notarized macOS apps, native Linux distribution packages or physical-device acceptance.
2. **Integrations UI:** Settings AI & Integrations provider catalog with AI, threat-intel, webhook/notifications groupings; floating circular assistant launcher at lower right. A launcher is **not a working chatbot**.
3. **Backend registry:** `/api/integrations/providers` reports providers as `not_implemented`; credential routes `GET/PUT/DELETE /api/integrations/credentials/{provider}` support allowed provider names, masked existence/status, save/delete and vault-unavailable errors. No actual cloud AI, threat-intel lookup, SMTP or webhook delivery adapter is claimed.
4. **Credential vault:** Python `keyring` OS-vault adapter; no plaintext fallback; lazy import avoids crashing bridge startup on machines without a keyring. Initial CI failures involved literal escaped newlines in test imports and eager missing-keyring import; fixes included `0053a95` and `e375b0d`. Registry and credential tests include allowlist, masked responses, missing provider and vault-failure behavior.
5. **Frontend credentials:** `ebc99d8` API bridge, `8c6f792` credential form, `9b1f5d6` catalog wiring. Users can enter/remove a credential and see saved status; the UI labels provider as **not connected** until a real connection test exists.
6. **Verified checkpoint:** `e375b0d` passed frontend/backend, Windows desktop/packaging and Linux/macOS preview CI. Subsequent integration UI head `9b1f5d6` was merged into `main` through PR #1; **all four post-merge `main` checks passed**:
   - [Frontend/backend CI 38270711792](https://github.com/ibrahim1101/Cerberus/actions/runs/38270711792)
   - [Managed bridge 38270711875](https://github.com/ibrahim1101/Cerberus/actions/runs/38270711875)
   - [Desktop shell 38270711902](https://github.com/ibrahim1101/Cerberus/actions/runs/38270711902)
   - [Windows packaged sidecar 38270711873](https://github.com/ibrahim1101/Cerberus/actions/runs/38270711873)

## 4. Test coverage inventory (selected, not exhaustive)

| Area | Covered behavior | Important boundary |
| --- | --- | --- |
| React app lifecycle | Reconnect, stale responses, selection preservation, report isolation, polling cleanup, scan status | jsdom/Jest not physical desktop |
| Scanner precision | Known synthetic fixture suppression, unknown secret preservation, cache semantics, cold/warm accounting | No guarantee of zero false negatives |
| Bridge security | Missing/wrong token, authenticated reads, invalid scan IDs, preview allowlist, size/symlink cases | Browser development mode has different trust boundary |
| Filesystem picker | Windows paths with spaces, encoded drive paths, traversal denial, authenticated folder listing | Native GUI click-through remains separate |
| Scan/report integration | Offline scan, HTML/JSON export, preview, listing, cancellation idle/auth | Must retest actual installed build |
| Native Rust | IPC route validation, encoded traversal, Windows-specific path semantics | Passing compile/tests is not complete UX acceptance |
| Integrations | Registry status, provider allowlist, key existence masking, vault unavailable, credential API UI | No real provider traffic or delivery |
| Packaging | Windows sidecar startup, NSIS build/silent install/uninstall smoke, checksum generation | Unsigned; manual Windows acceptance and distribution checks remain |

## 5. Open bugs, risks and unfinished features

**Release blockers / high priority**
- Reproduce or close physical Windows folder-picker IPC failure using a fresh, same-run installer; log only sanitized status/error classes.
- Validate real Windows scan of a chosen folder, cancel/restart, close guard, HTML/JSON/SARIF export and file preview; confirm Locat synthetic fixture precision and scan count diagnostics.
- Verify installer checksum, signed/unsigned warning, uninstall, persisted settings and fresh-install behavior on a physical Windows PC.
- Audit local bridge auth and filesystem trust boundaries; keep loopback binding mandatory. Recheck native credential vault on installed Windows and OS keychain availability on other platforms.

**Planned, not shipped**
- Real AI model/provider discovery, opt-in read-only finding explanations and chat.
- HTTPS webhook destination validation (including SSRF and redirects), opt-in events, safe payload preview, retries, delivery history and provider adapters.
- Local Ollama/LM Studio model testing and explicit cloud AI consent; no automatic source/secret uploads.
- Real Linux/macOS app distribution, installer signing/notarization and physical QA.
- Gradual legacy internal naming cleanup without breaking compatibility or modifying independent PipelineGuard.

## 6. Troubleshooting playbook

1. **UI says offline but backend health works:** separate heartbeat failure from report retrieval; check request generation and stale response races.
2. **Jest import errors:** check CRACO `@/` alias resolution in tests and transitive component imports; prefer targeted relative imports or explicit test mocks.
3. **Python bridge cannot import engine:** use the bundled engine/source path; don't assume `pip install -e ./engine` is supported.
4. **Windows folder picker fails:** inspect safe IPC error category, HTTP status, token, path encoding and native-to-bridge JSON response; do not log full private paths or secrets.
5. **Windows NSIS download fails:** inspect Chocolatey 5xx; bounded retry in CI, then rerun; distinguish supply-chain outage from code failure.
6. **Secret findings seem stale:** inspect scanner semantic version in cache signature and perform fresh scan before changing regex suppression.
7. **Scan count off by one:** compare discovered, scanned, reused and each skipped bucket; progress-event count need not equal completed file count.
8. **Keyring unavailable:** fail closed, show user actionable unavailable status; never store keys in plaintext as a workaround.
9. **Build green but GUI broken:** run exact installer on physical Windows, reproduce action and record OS/build/commit; CI smoke is necessary but insufficient.

## 7. Development operating rules

- Use **one primary branch: `main`**. Commit meaningful, reviewable changes; inspect CI at the exact SHA and record failures/fixes.
- Maintain [ENGINEERING_HISTORY.md](ENGINEERING_HISTORY.md) as the detailed running log and this journey as an accurate narrative.
- Never fabricate security detections, provider connectivity, CI outcomes, screenshots, release publication or physical QA.
- Preserve separate PipelineGuard repository boundaries.
- Protect local source, file paths and masked findings from external AI/webhook destinations by default.
- Release only after [v0.1.0 beta gate](RELEASE_GATE_V0.1.0_BETA.md) passes on the distributed installer.

## 8. License and documentation provenance

The root [LICENSE](../LICENSE) contains **GNU GPL version 3 only (`GPL-3.0-only`)**. New original CERBERUS contributions should follow the project's license; third-party code retains its own notices and license obligations. The development chronology is based on the repository's engineering history, source structure, CI checkpoints and recorded physical user feedback. It is intentionally not a claim that every historic experiment or commit is exhaustively catalogued here; the detailed history remains the primary per-commit archive.
