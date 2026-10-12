# CERBERUS

**Local-first desktop DevSecOps security scanner · React + FastAPI + Python scanner + Tauri**

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)
[![CI](https://github.com/ibrahim1101/Cerberus/actions/workflows/ci.yml/badge.svg)](https://github.com/ibrahim1101/Cerberus/actions/workflows/ci.yml)
[![Windows desktop](https://github.com/ibrahim1101/Cerberus/actions/workflows/desktop-check.yml/badge.svg)](https://github.com/ibrahim1101/Cerberus/actions/workflows/desktop-check.yml)
[![Windows package](https://github.com/ibrahim1101/Cerberus/actions/workflows/desktop-sidecar.yml/badge.svg)](https://github.com/ibrahim1101/Cerberus/actions/workflows/desktop-sidecar.yml)

> **Status · October 12, 2026:** Active development / pre-release Windows beta candidate. Automated checks passed on the consolidated `main` merge `a5a7e2d`; this is **not** a production security certification or evidence of completed physical installer acceptance. No public stable release is claimed.

CERBERUS brings code and dependency security findings, local scan history, report exports and workflow-focused investigation tools into a desktop application. The project evolved from the PipelineGuard UI into a separately branded application. **The standalone [PipelineGuard](https://github.com/ibrahim1101/PipelineGuard) repository is a different project and is not modified by CERBERUS documentation or releases.**

## What exists today

| Area | Current implementation / limitation |
| --- | --- |
| Desktop interface | React workspaces for Dashboard, Scan Project, Findings, Dependencies, OSV Intelligence, Reports, History, Settings and AI & Integrations; in-app How to Use and contextual help |
| Local scanner | Bundled `engine/` used by bridge/CI; progress, masked secret evidence, local findings and scan accounting (scanned/reused/skipped/discovered) |
| Scan controls | Cooperative cancellation and active-scan close confirmation; cancellation is not guaranteed instantaneous during blocking operations |
| Reports | Local scan history and JSON/HTML/SARIF-related report paths; automated HTML/JSON integration coverage exists, but physical export acceptance remains part of the release gate |
| Dependency intelligence | Optional OSV lookup; network-dependent and user permission/consent considerations apply |
| Desktop runtime | Tauri 2 native shell, Python FastAPI bridge, Windows packaged Python sidecar and unsigned NSIS installer build; Linux/macOS portable preview CI is experimental |
| Security | Loopback-focused bridge, desktop launch token, authenticated routes in desktop mode, path/preview checks, masked evidence, OS-backed integration key storage where available |
| AI & Integrations | Provider catalog, floating assistant launcher, credential save/status/delete controls. **Actual AI chat, provider connectivity, threat-intel adapters and outbound webhook delivery are not yet implemented.** |

## Repository layout

```text
frontend/                 React UI and component tests
backend/                  FastAPI bridge, integration registry and tests
engine/                   Bundled scanner implementation used by this app
desktop/src-tauri/        Tauri 2 native desktop shell
.github/workflows/        Frontend/backend, bridge, Windows and Unix preview CI
docs/                     Engineering history, development journey, release gates
```

## Development and local execution

Requirements vary by workflow: Node.js with Yarn 1.x, Python 3.11+, and Rust/Tauri desktop prerequisites for native builds. Read the workflow files for the tested build matrix and exact setup steps.

```sh
cd frontend
yarn install --frozen-lockfile
yarn test --watchAll=false
yarn build
```

Python bridge tests and packaged-desktop validation are executed by GitHub Actions; see [CI](.github/workflows/ci.yml), [managed bridge](.github/workflows/managed-bridge-smoke.yml), [desktop validation](.github/workflows/desktop-check.yml), [Windows packaging](.github/workflows/desktop-sidecar.yml) and [Unix preview](.github/workflows/unix-preview.yml). Do not assume a development browser session is equivalent to the native desktop security model.

**Bridge security:** desktop mode requires a per-launch unpredictable token; the native shell forwards authenticated requests to the local bridge. Browser development without a token can expose unauthenticated API routes: keep the bridge bound to `127.0.0.1` and **never expose it to LAN/public networks**. CORS is not authentication. Do not submit secret evidence or source files to external providers. OSV requests are optional and network-dependent.

## Development journey and verification

- [**Development Journey**](docs/DEVELOPMENT_JOURNEY.md) — milestones, architecture, known bugs, failed approaches, fixes, tests, CI outcomes and remaining work.
- [**Detailed Engineering History**](docs/ENGINEERING_HISTORY.md) — extensive commit/run-level engineering notes and troubleshooting.
- [**v0.1.0 beta release gate**](docs/RELEASE_GATE_V0.1.0_BETA.md) — mandatory physical Windows, security, packaging and documentation acceptance.
- [**Draft beta release notes**](docs/RELEASE_NOTES_V0.1.0_BETA1_DRAFT.md) — unsigned installer and distribution caveats.
- [**AI/webhook roadmap**](docs/INTEGRATIONS_AI_WEBHOOKS_ROADMAP.md) — planned provider integrations, consent and SSRF requirements.

### Consolidation checkpoint

On October 12, 2026, [PR #1](https://github.com/ibrahim1101/Cerberus/pull/1) merged 36 feature-branch commits into `main` at `a5a7e2d`. The exact merged commit passed [frontend/backend CI](https://github.com/ibrahim1101/Cerberus/actions/runs/38270711792), [managed bridge smoke](https://github.com/ibrahim1101/Cerberus/actions/runs/38270711875), [desktop shell](https://github.com/ibrahim1101/Cerberus/actions/runs/38270711902) and [Windows packaged-sidecar validation](https://github.com/ibrahim1101/Cerberus/actions/runs/38270711873). The repository was subsequently renamed to **Cerberus**, with `main` as the only branch.

### Known release blockers and limitations

- Re-test the latest packaged installer on a physical Windows PC: folder-picker IPC previously returned an invalid bridge response; backend path tests alone do not prove the GUI bug is resolved.
- Complete real-world scan/export, checksum, installation/uninstallation, cancellation and close-confirmation acceptance against the **same installer**.
- Verify exact packaged OS-keychain behavior; missing OS keyring must fail closed.
- Linux/macOS previews are not validated native installers; real-device acceptance is pending.
- Provider catalog and assistant launcher are not proof of functioning AI or webhook integrations.
- Security scanners can report false positives or miss vulnerabilities; investigate findings and do not treat any scan as a guarantee of safety.

## License

Copyright © 2026 CERBERUS contributors. CERBERUS original project code is offered under **[GNU General Public License version 3 only](LICENSE)** (`GPL-3.0-only`), subject to ownership and any third-party license obligations. Third-party dependencies and any independently licensed or imported components retain their respective licenses; review them before redistribution. The software comes **without warranty**.

## Contributing

Please include reproducible steps, affected platform/build, redacted logs, expected/actual behavior and test coverage when reporting issues. **Never post API keys, unmasked scanner evidence or private source files in public issues.** Development history should document failed approaches and verified outcomes, not only successful changes.
