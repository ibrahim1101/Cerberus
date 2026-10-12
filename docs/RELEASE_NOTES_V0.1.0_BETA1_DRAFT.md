# CERBERUS v0.1.0-beta.1 — Windows pre-release notes (DRAFT)

**Status: draft, not published.** The exact release commit, installer checksum and final interactive acceptance evidence must be filled in before publication.

## What this beta includes
- Windows desktop application with bundled local Python security scanning engine and managed backend lifecycle.
- Dashboard, project scanning, findings, dependencies, optional online OSV intelligence, reports, history and settings.
- Scan progress, cooperative cancellation and close confirmation while scanning.
- Searchable offline Settings → How to Use guide, contextual help in key workflows, and fullscreen scrolling improvements.
- HTML, JSON and SARIF 2.1.0 report export.

## Installation
1. Download `Cerberus-Setup-0.1.0.exe` and the matching SHA-256 checksum file from **this release**.
2. On Windows PowerShell, run `Get-FileHash .\Cerberus-Setup-0.1.0.exe -Algorithm SHA256` and compare the output to the published checksum.
3. Run the installer. This beta is **unsigned**; Windows may warn about an unknown publisher. Only proceed if you trust this GitHub repository and the checksum matches.
4. Launch CERBERUS from its installed shortcut. Confirm the engine bridge reports connected.
5. Open Settings → How to Use, select a local source repository, run a scan and review findings before exporting a report.

## Limitations and security notes
- Windows-only beta; Linux and macOS packages are not verified.
- Detection is advisory, not proof of exploitability. Binary files may cause false-positive secret matches; do not delete DLLs or rotate keys without validation.
- Online OSV lookup shares package names, versions and ecosystems with the advisory service. Local source code is not sent by the documented lookup flow.
- Scan cancellation is cooperative and can be delayed by blocking operations.
- General automatic remediation, webhook integrations, AI provider configuration and direct PDF export are **not included** in this beta.
- The local desktop bridge must remain loopback-only and authenticated. Do not expose the development backend to the network.
- Exported reports can contain sensitive paths or evidence. Review and sanitize before sharing.
- No code-signing certificate is used for this beta.

## Final publication checklist
- [ ] Confirm release commit SHA and all required CI checks.
- [ ] Verify installed Windows GUI, folder picker, sample scan, cancel, close, reports, history, OSV, restart and uninstall.
- [ ] Check secret redaction, bridge authentication and Windows Defender/SmartScreen behavior.
- [ ] Verify installer SHA-256 against the checksum artifact from the **same workflow run**.
- [ ] Review licensing and redistribution rights of bundled code and dependencies.
- [ ] Replace draft markers with release SHA, CI URLs, checksum and known issues; publish as a **pre-release**, not a stable release.
