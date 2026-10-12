# CERBERUS Windows beta — third-party redistribution audit (in progress)

Date: 2026-10-12. Target release: v0.1.0-beta.1. Candidate binary built from `f3dcd08db464db1c649e698f6d30719371486c3a`.

## Verified from repository manifests

- Original project code declares GPL-3.0-only in the root `LICENSE`. This declaration alone does **not** relicense third-party dependencies or imported code.
- Windows sidecar packaging installs `backend/requirements-desktop.txt`: FastAPI 0.110.1, Uvicorn 0.25.0, python-dotenv >=1.0.1, keyring >=25,<27, plus PyInstaller >=6,<7 as build tooling. Transitive packages and the PyInstaller bootloader may be included in the distributed executable.
- Native Windows shell uses Tauri 2, tauri-build 2, serde 1, serde_json 1, reqwest 0.12 (rustls), url 2, rand 0.8, and transitive Rust crates; exact resolved versions and license expressions require a Cargo dependency inventory.
- Frontend is bundled from `frontend/package.json` and contains React, Radix UI, Fontsource fonts (Chakra Petch, IBM Plex Sans, JetBrains Mono), icon and UI packages, and transitive JavaScript dependencies. **Font license files and copyright notices must be reviewed** before redistribution.
- Frontend dev dependencies include externally hosted `@emergentbase/overlay` and `@emergentbase/visual-edits` tarballs. Confirm they are build-only and do not appear in shipped frontend or runtime. Do not assume their licenses.
- `backend/requirements.txt` and `engine/requirements.txt` include development/template dependencies. Windows workflow installs the smaller desktop requirements file; do not label every repo manifest dependency as shipped without inspecting packaged artifacts.
- Repository tree inspection found no standalone `THIRD_PARTY_NOTICES` or third-party license inventory document before this audit.

## Unresolved gates — do not claim license approval

1. Produce the **resolved runtime inventory** from the exact Windows candidate installer: Python distribution metadata and bundled license files; Rust `cargo metadata`/license report; frontend production bundle and installed npm dependency license report.
2. Check GPLv3 compatibility, redistribution permissions, required notices, attribution, and source-availability obligations for each shipped component, including fonts and PyInstaller bootloader. Resolve unknown/proprietary or conflicting license terms with a maintainer or qualified reviewer.
3. Trace origin and copyright of bundled `engine/`, frontend templates, and any imported project code. Confirm ownership and permission to distribute under GPL-3.0-only; do not treat a GPL root file as evidence of provenance.
4. Ship all required third-party notices/license texts with the release and update the installer/package if required. Rebuild and reverify checksum after any binary changes.
5. Confirm unsigned-installer warnings and GPL warranty notice are accurately represented in release notes.

## Integrity evidence, distinct from licensing

- Windows packaged-sidecar workflow [38282741534](https://github.com/ibrahim1101/Cerberus/actions/runs/38282741534) passed on candidate `f3dcd08`.
- Independently compared the extracted installer against the same-run `SHA256SUMS.txt` manifest; SHA-256: `b97723ef0509795b7c8d1ded65ab31ec5a4492026f639c898dcd0798b8fb1f4a`.
- **Do not publish v0.1.0-beta.1 as license-cleared** until the above obligations are verified. This document is an inventory and checklist, not legal advice or certification.

## CI artifact review — 2026-10-12
- [Windows license-inventory workflow #38285349542](https://github.com/ibrahim1101/Cerberus/actions/runs/38285349542) completed successfully at `e0b64c7`. Its `cerberus-windows-license-inventory` artifact was downloaded and inspected.
- Python **build environment**: 29 distributions, all with at least one license/classifier metadata field. This is not an exact list of bundled Python files.
- Rust `cargo metadata`: 447 packages, including the root `pipelineguard-desktop` package, whose own Cargo metadata has no license field; 446 third-party packages report a license expression. Some include MPL-2.0 or CDLA-Permissive-2.0. This is dependency metadata, not a legal compatibility ruling.
- npm `npm ls --all --json --long --omit=dev`: 1,414 distinct package-name/version combinations were observed in the recursive output, with 25 lacking a license field. **Important:** the output also reports invalid and missing peer dependencies, and may contain dev/build-only packages despite the omit flag; do not treat these counts as a definitive shipped-runtime SBOM.
- Direct frontend font packages `@fontsource/chakra-petch`, `@fontsource/ibm-plex-sans`, `@fontsource/jetbrains-mono` report OFL-1.1 metadata. Required font notices and embedded font redistribution still need inspection.
- **Priority fixes:** classify npm entries without license metadata; inspect npm tree problems; distinguish build-only from distributed code; add the root Cargo package license metadata after verifying code provenance; collect full notice texts and license obligations from resolved packages.
- The new CI workflow builds a fresh candidate and does not alter the previously verified installer from commit `f3dcd08`. Do not reuse that older installer checksum for the newer artifact.

### npm tree triage (artifact 11762888421)
- Inspected `npm-production-tree.json` from the successful Windows audit workflow. The npm root includes **7 dependency-tree problems**; examples are incompatible peer declarations for React 19, date-fns 4 and ESLint 9, plus a missing TypeScript peer dependency for fork-ts-checker-webpack-plugin 6.5.3. These are install-tree warnings, not evidence of a shipped binary failure.
- A recursive traversal of package nodes identified **two named third-party entries without a `license` field**: `esprima@1.2.5` and `exit@0.1.2`. The root `frontend@0.1.0` also lacks a license field, but it is first-party and should be audited against the repository's GPLv3 statement. The earlier broad count of 25 was an overcount arising from a different traversal; these are the precisely identified nodes from this artifact.
- Missing metadata does **not** imply unlicensed code. Retrieve actual package LICENSE files and determine whether each package is in the distributed frontend bundle, build toolchain only, or unused.
- Before release, separately audit font license text and bundled engine/template provenance. Keep release gate open.

### Verified structured summary — workflow 38290244949 (commit `65e7795`)
Downloaded `cerberus-windows-license-inventory` artifact **11765880854** and read its generated `summary.json`:
- Python build-environment packages: **29**.
- Cargo metadata packages: **447**; only `pipelineguard-desktop` (first-party root package) lacks a license field.
- Distinct npm package name/version nodes: **1,392**; missing license fields: `esprima@1.2.5`, `exit@0.1.2`, and first-party `frontend@0.1.0`.
- Seven npm tree problems: invalid `react@19.0.0`, `date-fns@4.1.0`, `eslint@9.23.0`, `picomatch@2.3.2`; missing TypeScript peer dependencies for `fork-ts-checker-webpack-plugin@6.5.3`, `tsutils@3.21.0`, and `ts-node@10.9.2`.
- Counts are from the workflow's installed dependency tree, **not** the final distributed payload. Review package LICENSE texts, shipping status and provenance before asserting compliance. Do not interpret successful build as resolving peer warnings.

### 2026-10-13 — Independent package-license research
- `esprima@1.2.5`: independently identified as **BSD-2-Clause** (Snyk package-version record and upstream Esprima BSD license). Sources: https://security.snyk.io/package/npm/esprima/1.2.5 and https://github.com/jquery/esprima/blob/main/LICENSE.BSD . Still verify license file of exact installed archive and whether included in distributable.
- `exit@0.1.2`: upstream npm README explicitly says **MIT**, and Snyk detects MIT, despite npm metadata listing license as 'none'. Sources: https://www.npmjs.com/package/exit?activeTab=readme and https://security.snyk.io/package/npm/exit/0.1.2 . Still verify exact archive's license text and shipped/build-only classification.
- **No evidence these two metadata omissions are incompatible licenses.** This does not clear other components or the full release.

### 2026-10-13 — Installed license-file collection verified
- Windows packaging workflow [38295544835](https://github.com/ibrahim1101/Cerberus/actions/runs/38295544835) **passed** after YAML fix (`6759705`). Downloaded its `cerberus-windows-license-inventory` artifact **11768068153** and inspected `npm-license-file-review.json` and the copied license files.
- **Found exact installed license texts**: `esprima` — `LICENSE.BSD`; `exit` — `LICENSE-MIT`; `@fontsource/chakra-petch` — `OFL.txt`; `@fontsource/ibm-plex-sans` — `OFL.txt`; `@fontsource/jetbrains-mono` — `OFL.txt`.
- These five installed package folders were present and license texts were successfully collected. This **closes the missing-text investigation for these five specific packages**, but not the entire redistribution audit: full resolved dependencies, attribution/notice packaging, imported-code provenance, and shipped-vs-build-only classification still require verification.
- The collected text files are retained in the workflow artifact for audit. Do not assert that the installer includes the notices until they are explicitly staged into the distributable and validated.

### 2026-10-13 — Final multi-platform artifact verification (physical testing deferred)
- Independently downloaded and inspected GitHub Actions artifacts from Windows run [38298142839](https://github.com/ibrahim1101/Cerberus/actions/runs/38298142839) and Linux/macOS run [38298814425](https://github.com/ibrahim1101/Cerberus/actions/runs/38298814425).
- Windows `Cerberus-Setup-0.1.0.exe`: **19,307,519 bytes**, SHA-256 `158c8564bb06122fdad6ac814d82b7ee4d945e1020fee381469db4db35f2a080`; **matches** workflow `SHA256SUMS.txt`.
- Linux x64 `Cerberus-0.1.0-beta.1-linux-x64-portable.tar.gz`: SHA-256 `3e6d8330ecfa20631c11e7ac472441e30d6e8084bcc0c81c7648e0bf3b10498e`; checksum **matches**, archive opens, native executable and sidecar present.
- macOS Intel `Cerberus-0.1.0-beta.1-macos-x64-portable.tar.gz`: SHA-256 `ca8c5056249977ab402d371e0b0cffcc2410b684e6e827e9cfbafab9aee93d6b`; checksum **matches**, archive opens, native executable and sidecar present.
- macOS Apple Silicon `Cerberus-0.1.0-beta.1-macos-arm64-portable.tar.gz`: SHA-256 `6b72af1e10c71dbef9a102e7f13dd42462243755c8a49627257018842763770e`; checksum **matches**, archive opens, native executable and sidecar present.
- Windows standalone artifact contains five staged third-party license files: Esprima BSD, exit MIT, and the three fontsource package LICENSE files. All five package folders and original installed license files also confirmed in the Windows license inventory.
- **Residual redistribution obligations NOT fully resolved:** exhaustive license and attribution text for all distributed Rust/Python/JS dependencies, provenance and license of imported engine/templates, whether Unix packages carry the required notices, and platform-specific distribution obligations. Integrity and CI validation do not establish full legal compliance.
- **Decision:** Technical artifact-integrity gate passed; legal/compliance gate remains **OPEN**. Do not represent the release as fully license-cleared. Physical runtime testing explicitly deferred by maintainer; Unix packages experimental.


## Consolidated release licensing decision — 2026-10-13

**Decision: NOT CLEARED for an unqualified claim of compliant public binary redistribution.** This is a single consolidated audit decision, not a request for incremental CI tasks. The maintainer may choose whether to defer release or seek a qualified rights review, but an automated review cannot grant rights to code of unverified origin.

### Verified evidence

- CERBERUS repository root contains the GPL version 3 license text; desktop Rust package declares `GPL-3.0-only`. Neither fact proves that all incorporated code is owned by the maintainer or licensed compatibly.
- The exact Windows installer from [run 38298142839](https://github.com/ibrahim1101/Cerberus/actions/runs/38298142839) matched its same-run SHA-256 checksum: `158c8564bb06122fdad6ac814d82b7ee4d945e1020fee381469db4db35f2a080`.
- The Linux x64, macOS x64 and macOS arm64 portable archives from [run 38298814425](https://github.com/ibrahim1101/Cerberus/actions/runs/38298814425) each matched the accompanying archive checksum. This establishes artifact integrity, **not** runtime functionality or licensing.
- Windows standalone payload contains the collected license texts for Esprima, exit, Chakra Petch, IBM Plex Sans and JetBrains Mono. The five source package license files were observed in the CI license inventory. This is not an exhaustive notice set.
- Python build-environment, Cargo and npm dependency metadata were inventoried previously, but are not a verified bill of materials of each distributed executable, bundled web asset or platform archive.

### Remaining redistribution blockers, consolidated

1. **Imported source provenance and permission:** Establish authorship/rights or valid incoming licenses for the engine, frontend templates and any Emergent-origin source, including any third-party copied code. Repository GPL text does not itself establish permission.
2. **Complete shipped-component notice coverage:** Generate an exact payload-level dependency/asset inventory, review all applicable license terms (including Python bootloader, Rust crates, JS bundle, fonts and platform-specific dependencies), and include any mandatory license texts, copyright notices, attributions and source notices in **each** distributed platform package. Five notices in the Windows package are not enough to demonstrate completion.
3. **GPLv3 redistribution obligations:** Provide complete corresponding source for the distributed version, applicable build/install scripts, GPL license and warranty disclaimers, and any notices required by third-party licenses. Confirm the release's source reference corresponds to the exact binaries; do not present mixed-build commits as a single reproducible candidate.
4. **Unresolved license compatibility:** Review packages with multiple, missing or ambiguous license expressions and any proprietary source/assets before concluding GPL-3.0-only compatibility. A successful build or package-manager metadata field is not legal clearance.

### Practical outcome

- **Technical artifact integrity:** PASS for the inspected four artifacts.
- **Five specifically collected Windows license texts:** PRESENT.
- **Full third-party notice completeness:** NOT VERIFIED.
- **Imported-code redistribution rights:** NOT VERIFIED.
- **Overall legal redistribution clearance:** **BLOCKED / NOT ESTABLISHED**.
- **Physical device testing:** DEFERRED by maintainer; it is not a licensing prerequisite and is not represented as complete.

No automated scan or assistant statement can convert unknown rights into permission. Obtain original source license/provenance evidence and confirm notice/source obligations before publicly distributing binaries as license-cleared. This document is a technical compliance review, not a legal opinion.


## AI-assisted source provenance clarification — 2026-10-13

The maintainer states that CERBERUS was created using **Emergent and ChatGPT**. This changes the source-provenance assessment from "no identified origin" to "AI-assisted development, with named providers."

Official provider terms reviewed:
- Emergent Terms of Service, sections 7.2–7.3: https://app.emergentagent.com/terms-of-service — states users retain ownership of generated code/applications and may distribute and open-source their implementations, **subject to third-party open-source licenses**.
- Emergent ownership guidance: https://help.emergent.sh/your-data-ownership — reiterates user ownership of generated applications.
- OpenAI Terms of Use: https://openai.com/policies/terms-of-use/ — assigns OpenAI's rights, if any, in output to the user to the extent permitted by law, excluding third-party output.

**Updated provenance decision:** Use of Emergent and ChatGPT **does not itself create a provider-ownership barrier** to publishing the generated application. This resolves the question whether the providers categorically forbid redistribution of user-generated CERBERUS code. It does **not** establish that every generated file is original or clear any embedded third-party code, proprietary platform assets, templates, or dependencies. The maintainer's statement is not an independently authenticated file-by-file rights audit.

**Overall redistribution decision remains NOT VERIFIED** pending complete packaged third-party notices, GPLv3 corresponding-source delivery, and review of any third-party-origin code/assets. Do not represent this clarification as full legal certification.
