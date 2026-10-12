# CERBERUS v0.1.0 beta — release readiness gate

Target: **October 13, 2026** (subject to evidence). Repository: `ibrahim1101/pipelineguard-ui`, branch `main`. Never modify the separate `PipelineGuard` repository as part of this release.

## Release scope and evidence

- **Desktop:** Windows Tauri shell with managed packaged Python bridge; GitHub-hosted build and installer smoke checks have passed in prior runs. Interactive user-device startup, GUI shutdown, and uninstallation still require confirmation.
- **Workspaces:** Dashboard, Scan Project, Findings, Dependencies, OSV Intelligence, Reports, History and Settings. Source exists; verify every control in the packaged app.
- **Scanning:** Local secret/dependency scanning and optional OSV intelligence. Local fixture regression tests passed in CI; physical Locat rescan is pending. Do not claim all real-world false positives eliminated.
- **Reports:** JSON, HTML and SARIF writers. HTML export/preview/listing covered by CI integration test; manual exported HTML inspection remains pending.
- **Progress:** Final secret scan accounting is separated from progress-event counters; physical 255/256 case not yet reproduced or resolved.
- **Platforms:** Release Windows beta first. Do not claim verified Linux/macOS builds or installers without their own tests.
- **Security:** Loopback-only desktop bridge and token requirements must be rechecked in the actual installer. Never advertise the unauthenticated development bridge as a network service.

## Release blockers — must be green before publishing

**Physical Windows blocker observed October 12:** the project-folder picker displayed `Cerberus desktop bridge is unavailable` while the footer showed `Engine bridge: connected`. Launch and UI rendering were confirmed, but directory browsing is not accepted. The native IPC adapter now distinguishes allowlisted native error reasons from generic failures (`cbda802`); reproduce on a new build and capture the precise message before declaring the issue fixed.

CI backend smoke now uses the repository's bundled engine (commit `957ff48`), rather than checking out the separate PipelineGuard development branch. This change requires a fresh green workflow run before the release gate can be checked.

- [ ] Latest React tests, Python bridge smoke **against the bundled `engine/` tree**, local scanner regressions, and packaged Windows sidecar workflow all green on the *same* release commit.
- [ ] Download and install the generated `Cerberus-Setup-0.1.0.exe` on a real Windows machine; confirm Start menu shortcut, launch, bridge health, restart, clean close and uninstall.
- [ ] Run a sample-project scan, inspect findings and dependencies, test OSV offline/online states, and export/open HTML, JSON and SARIF reports.
- [ ] Rescan Locat; record exact fixture findings and final discovered/scanned/reused/skipped counts. Investigate any true-positive loss or unexplained discrepancy.
- [ ] Check Settings, History, error states and filesystem access; verify no credentials or secret values appear in logs/reports unexpectedly.
- [ ] Check installer with Windows Defender/SmartScreen; clearly disclose unsigned beta status if applicable.
- [ ] Verify installer checksum CI artifact (`cerberus-windows-nsis-installer-checksum`) matches the uploaded `Cerberus-Setup-0.1.0.exe` from the **same run**.
- [ ] Create GitHub pre-release `v0.1.0-beta.1` with tested installer, SHA-256 checksum, installation steps, known limitations and CI links. Do not publish until above evidence is captured.

## Portfolio/job-application deliverables

- [ ] Update README to distinguish implemented source, CI-tested workflows and physically verified release behavior.
- [ ] Capture real screenshots (dashboard, scan, findings, report) with no sensitive values.
- [ ] Publish an architecture diagram and a concise security/threat-model explanation.
- [ ] Write a release changelog, limitations, reproducible setup and test instructions.
- [ ] Draft LinkedIn project description and resume bullets grounded only in demonstrated features.

## Release decision

**NOT RELEASE-READY YET** until current frontend CI is green and the physical Windows acceptance checks pass. A time deadline must not override a failing test or unresolved security concern.
