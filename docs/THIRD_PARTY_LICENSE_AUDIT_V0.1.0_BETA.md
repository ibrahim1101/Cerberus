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
