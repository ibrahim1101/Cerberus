# CERBERUS v0.1.0 beta — release readiness gate

Target: **October 13, 2026** (subject to evidence). Repository: `ibrahim1101/Cerberus`, branch `main`. Never modify the separate `PipelineGuard` repository as part of this release.

## Release scope and evidence

- **Desktop:** Windows Tauri shell with managed packaged Python bridge; GitHub-hosted build and installer smoke checks have passed in prior runs. Interactive user-device startup, GUI shutdown, and uninstallation still require confirmation.
- **Workspaces:** Dashboard, Scan Project, Findings, Dependencies, OSV Intelligence, Reports, History and Settings. Source exists; verify every control in the packaged app.
- **Scanning:** Local secret/dependency scanning and optional OSV intelligence. Local fixture regression tests passed in CI; physical Locat rescan is pending. Do not claim all real-world false positives eliminated.
- **Reports:** JSON, HTML and SARIF writers. HTML export/preview/listing covered by CI integration test; manual exported HTML inspection remains pending.
- **Progress:** Final secret scan accounting is separated from progress-event counters; physical 255/256 case not yet reproduced or resolved.
- **Platforms:** Release Windows beta first. Do not claim verified Linux/macOS builds or installers without their own tests.
- **Security:** Loopback-only desktop bridge and token requirements must be rechecked in the actual installer. Never advertise the unauthenticated development bridge as a network service.

## Release blockers — must be green before publishing

**Physical Windows retest October 12:** folder picker now shows `Cerberus desktop bridge: Invalid bridge response`. Native Rust JSON parsing previously hid non-JSON HTTP errors; commit `a4179ee` preserves status with a safe error detail, and `8f1cce1` guards Windows directory metadata. Retest updated installer; do not mark fixed until verified.\n\n**Physical Windows blocker observed October 12:** the project-folder picker displayed `Cerberus desktop bridge is unavailable` while the footer showed `Engine bridge: connected`. Launch and UI rendering were confirmed, but directory browsing is not accepted. The native IPC adapter now distinguishes allowlisted native error reasons from generic failures (`cbda802`); reproduce on a new build and capture the precise message before declaring the issue fixed.

CI backend smoke now uses the repository's bundled engine (commit `957ff48`), rather than checking out the separate PipelineGuard development branch. This change requires a fresh green workflow run before the release gate can be checked.

- [ ] Latest React tests, Python bridge smoke **against the bundled `engine/` tree**, local scanner regressions, and packaged Windows sidecar workflow all green on the *same* release commit.
- [ ] Verify authenticated `/api/fs/list` directory/JSON listing and unauthenticated rejection in the offline scan integration suite (`9529848`), including Windows CI.
- [ ] Verify packaged Windows `/api/fs/list` fixture smoke (including URL-encoded drive paths and directories with spaces) and native Rust IPC request-path regression tests; neither alone proves GUI picker functionality.
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

### Cooperative scan cancellation (October 12 candidate)
- [ ] Verify new `POST /api/scan/cancel` requires authentication and rejects idle scans.
- [ ] Verify the UI cancel button appears only during running scans, requests cancellation once, and shows `cancelled` after a scanner callback checkpoint.
- [ ] Verify cancellation does not create completed scan history or partial reports, and a new scan can start after cancellation.
- [ ] Test large-file and online OSV cancellation latency on physical Windows. **Cancellation is cooperative and may not interrupt a blocking operation immediately.**
- [ ] Verify fresh frontend/backend and Windows installer workflows before distributing cancellation build.

### Desktop exit protection (October 12 candidate)
- [ ] Verify Windows title-bar X intercepts close when a scan is active, showing selected project, current stage and progress; **Keep Open** preserves the scan.
- [ ] Verify confirming exit closes the app and its managed backend; cancelled or interrupted scans must not be presented as completed.
- [ ] Verify report/history loading triggers an exit warning and inability to query scanner state triggers a conservative warning.
- [ ] Verify an idle application closes normally without a prompt and repeated X clicks do not create duplicate prompts.
- [ ] Confirm native close handling works on the installed Windows build; React tests alone are insufficient.
- [ ] Other operations that do not expose tracked progress must be audited before claiming *all* background tasks are protected.

### In-app documentation and contextual help (October 12 candidate)
- [ ] Settings → How to Use opens a searchable offline guide covering each main workspace, scan profiles, cancellation, findings, dependencies, OSV, history, settings and troubleshooting.
- [ ] HTML, JSON and SARIF sections explain intended readers, inspection steps, and sensitive-report handling.
- [ ] Verify contextual ? tooltips on settings fields, project/config selection, scan profiles and report export; audit remaining individual controls for help coverage before claiming every option has a tooltip.
- [ ] Verify keyboard focus, tooltip accessibility, scrolling and no nested interactive controls on installed Windows build.
- [ ] Run fresh React tests, Windows desktop validation and installer packaging on the final guide commit.

### Physical Windows user acceptance evidence — October 12
- User confirmed active scan cancellation control works and the native close-confirmation popup appears during scanning.
- User confirmed the expanded How to Use guide is substantially improved and fullscreen scrolling no longer continues into empty space.
- Do not extrapolate these confirmations to unreported export formats, Windows uninstall, bridge authentication, false-positive resolution or SmartScreen behavior.
- Green packaged-sidecar run `38237311580` (application commit `091a0f8`) produced installer-preview and checksum artifacts; **their matching contents have not yet been independently checked**.
- Documentation-only commits after the application commit require release SHA selection and final acceptance before publishing.

### Physical Windows uninstall confirmation
- User reports CERBERUS uninstall succeeded on earlier installed Windows builds. Mark the uninstall behavior as user-verified for those builds; exact final release installer upgrade/uninstall remains a distinct acceptance check.
- Linux/macOS portable preview source is merged into `main`, with CI on Linux x64, macOS Intel and macOS ARM64. Physical OS testing is deferred until volunteer feedback; do not advertise those previews as verified supported releases.


### 2026-10-12 — Cross-platform acceptance policy and next Windows release checkpoint
- User does not currently have Linux/macOS test hardware. Accept CI-only Linux/macOS **portable preview** artifacts as experimental; collect external tester feedback later. This is **not** native installer or production platform certification.
- Linux/macOS workflow trigger was corrected to `main` in `4802eb2`. [Workflow run 38279419759](https://github.com/ibrahim1101/Cerberus/actions/runs/38279419759) was still running at the last check; never mark green until completed.
- Main React/backend CI [38279419623](https://github.com/ibrahim1101/Cerberus/actions/runs/38279419623) passed on `4802eb2`.
- Windows packaged sidecar [38277217579](https://github.com/ibrahim1101/Cerberus/actions/runs/38277217579) passed on documentation commit `5e762bc8`. Final release installer requires same-commit CI and physical acceptance.
- The separate `ibrahim1101/PipelineGuard` repository is now archived, not deleted; CERBERUS bundles the engine.
- **Windows retest update:** user subsequently confirmed the five-step acceptance flow works; retain remaining untested release gates before publication.

### 2026-10-12 — User-confirmed Windows smoke acceptance
- User reports that the latest tested Windows CERBERUS build successfully launches with engine bridge connected, opens the native folder picker, selects a source directory, scans and displays findings, and exports/opens an HTML report (confirmation to the requested five-step sequence).
- This resolves the **previously observed folder-picker blocker for that tested build**; keep regression coverage and retest if installer binaries change.
- This does **not** confirm JSON/SARIF export, OSV behavior, credential redaction, installer checksum matching, Defender/SmartScreen, authenticated endpoint rejection, or final release installation lifecycle.
- React/backend CI [38279607009](https://github.com/ibrahim1101/Cerberus/actions/runs/38279607009) passed on `092676e`. Linux/macOS preview [38279419759](https://github.com/ibrahim1101/Cerberus/actions/runs/38279419759) was still running when checked.

### 2026-10-12 — Final five Windows checks confirmed by user
- **PASS (user-reported):** JSON and SARIF exports work; History displays completed scans and reports; OSV Intelligence handles online/offline states; CERBERUS closes and relaunches; Windows Defender/SmartScreen showed no unexpected security warnings on the tested machine.
- These results complement the earlier user-confirmed folder picker, scan, findings and HTML export acceptance. They do not establish security approval by Defender or universal SmartScreen reputation.
- Windows packaging workflow branch triggers were restricted to `main` in commit `8858be9` to remove the obsolete deleted feature branch.
- **Remaining before publication:** validate exact release SHA and matching installer/checksum artifact, verify GPL/third-party redistribution compatibility, and confirm any outstanding bridge authentication/redaction and final installer lifecycle checks. Do not silently mark those as passed.

### 2026-10-12 — Independent installer artifact verification
- Windows packaging workflow [38282741534](https://github.com/ibrahim1101/Cerberus/actions/runs/38282741534) and UI/backend CI [38282741427](https://github.com/ibrahim1101/Cerberus/actions/runs/38282741427) both passed for commit `f3dcd08db464db1c649e698f6d30719371486c3a`.
- Downloaded both distinct Actions ZIP artifacts, extracted `Cerberus-Setup-0.1.0.exe` and `SHA256SUMS.txt`, computed SHA-256 independently, and confirmed exact equality.
- **Verified installer SHA-256:** `b97723ef0509795b7c8d1ded65ab31ec5a4492026f639c898dcd0798b8fb1f4a`.
- Checksum validates artifact integrity against the manifest from the same workflow, **not** publisher identity, malware-free status, or license compliance.
- Final candidate source commit is `f3dcd08`; later documentation-only commits do not alter this installer but must not be mislabeled as the installer source SHA.
- **Still pending:** third-party license/redistribution review, exact candidate's interactive installation acceptance if required, GitHub prerelease creation and asset upload. Do not claim published until release API confirms.

### 2026-10-12 — Third-party redistribution inventory opened
- Added [third-party license audit](THIRD_PARTY_LICENSE_AUDIT_V0.1.0_BETA.md) reviewing shipped/runtime dependency manifests, bundled fonts, PyInstaller, Rust/JavaScript transitive packages, and source-code provenance.
- **License gate remains OPEN:** manifest inspection does not establish compatibility or satisfy required redistribution notices. Do not publish until exact packaged dependency inventories and obligations are reviewed.
