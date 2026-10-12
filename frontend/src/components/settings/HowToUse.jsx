import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/common/Panel";

const sections = [
  ["Getting started", [
    ["Dashboard", "Shows the latest scan overview, risk metrics and entry points to analysis. Run a scan first if the dashboard has no results."],
    ["Scan Project", "Choose a local folder with Browse or enter an absolute path. Optionally choose a JSON policy file, select a profile, configure live OSV checks and start the scan. Large folders can take time."],
    ["Project folder", "The local directory to analyze. Choose a source-code repository when possible. Binary-heavy game installations may produce noisy secret detections; findings require verification."],
    ["Configuration file", "Optional JSON engine policy. Choose a file and click Validate before starting. Leave blank to use engine defaults."],
    ["Scan profile", "Select Quick for shorter analysis, Standard for routine use, or Deep/Release/Forensic when the engine exposes those profiles and you need more comprehensive checks. Exact stages are listed by the profile picker."],
    ["Cancel Scan", "Available while a scan runs. Requests a cooperative stop at a scanner checkpoint; large file operations or online requests may delay cancellation. A cancelled scan is not a completed report."],
    ["Close confirmation", "When the desktop detects an active scan, closing asks for confirmation and shows the project, current stage and progress. Keep Open preserves the session. Close Anyway stops the managed backend."],
  ]],
  ["Understanding findings", [
    ["Findings", "Lists potential security issues found in the selected scan. Review severity, category, rule, file location and evidence before taking action."],
    ["Critical / High / Medium / Low", "Severity estimates the potential impact or urgency of a finding; it does not guarantee that the issue is exploitable or even a true positive."],
    ["Warnings and incomplete checks", "A warning can mean a scanner could not complete a check, not that a vulnerability was confirmed. Inspect the explanation and scan settings."],
    ["Private-key findings", "Treat potential keys as sensitive. Verify that the evidence contains a valid key structure before rotating credentials. Binary DLLs and executables may generate false positives; do not delete them solely because of a match."],
    ["Evidence", "Use the evidence view to inspect the rule and affected location. Avoid sharing raw secret values in screenshots, tickets or exported reports."],
    ["Score", "The scan score summarizes the engine's assessment against its rules and policy. Compare it with the findings and incomplete checks; it is not a certification of security."],
  ]],
  ["Dependencies and intelligence", [
    ["Dependencies", "Review packages identified in project manifests and their versions. Check the ecosystem and source manifest before acting on a dependency."],
    ["OSV Intelligence", "Look up published vulnerability advisories for recognized packages and versions. Online checks require connectivity and may not cover every package or ecosystem."],
    ["Live OSV lookup", "When enabled, package name, version and ecosystem are sent to the OSV service. Source code and local file paths are not sent by the documented lookup flow."],
    ["Offline dependency check", "Package inventory can still work offline, but vulnerability matching may be incomplete. A dependency-check warning is not itself proof of a vulnerable package."],
  ]],
  ["Reports and exports", [
    ["Reports", "After a completed scan, choose HTML, JSON or SARIF, select a destination and click Generate. Use Existing Reports to review saved outputs."],
    ["HTML report", "Best for people. Open the .html file in a browser. Read the scan summary and score first, then severity counts, individual findings, evidence, affected files and dependency advisories."],
    ["JSON report", "Best for scripts and advanced investigation. Open with a JSON viewer or editor. Review scan metadata, summary, findings, dependencies and status fields. Preserve the original file for auditability."],
    ["SARIF 2.1.0 report", "Best for compatible code-scanning tools. Import the .sarif file into a SARIF-capable viewer. Inspect runs, results, rule IDs, levels and locations. Not every CERBERUS field necessarily maps one-to-one."],
    ["Reading file locations", "A file path points to the affected artifact; line numbers may be unavailable or unreliable for compiled binaries. Verify against source files when possible."],
    ["Interpreting exports safely", "Findings are leads for investigation, not automatic proof. Reports may contain sensitive file paths or evidence; restrict sharing and remove secrets before publishing."],
    ["PDF", "Direct PDF export is not currently implemented. For a printable copy, open an HTML report and use your browser's Print to PDF function."],
  ]],
  ["History and settings", [
    ["Scan History", "Browse previous completed scan records and select one to review results. Comparison features depend on available stored scans. Clearing history removes stored records and should be intentional."],
    ["Default scan profile", "Select the profile preselected for future scans. You can override it from Scan Project."],
    ["Default project folder", "Local folder automatically selected when CERBERUS starts. Change it if you frequently scan the same repository."],
    ["Default configuration file", "Optional JSON policy used by default for new scans. Validate policy changes before relying on them."],
    ["Scan Engine settings", "Inspect or edit supported engine policy values. These affect scan behavior and release gates; keep a backup of working configurations."],
    ["Vulnerability Intelligence settings", "Enable or disable online OSV lookup by default. Per-scan settings may override the default."],
    ["Appearance", "Adjust text size, density and reduced motion. The current desktop theme is Premium Dark Titanium."],
    ["Default export folder", "Location where new reports are saved. Confirm the path exists and that CERBERUS has permission to write there."],
    ["Preferred report format", "Preselects HTML, JSON or SARIF in the Reports workspace."],
    ["Save preferences", "Saves local application settings. Unsaved changes are not guaranteed to persist when you leave the page."],
    ["About and diagnostics", "Shows application, engine and platform information, backend connection status and local data directory. Useful when reporting problems."],
  ]],
  ["Troubleshooting and safety", [
    ["Bridge unavailable", "The desktop cannot communicate with its local Python backend. Restart CERBERUS and check the status bar; collect the exact error when reporting an issue."],
    ["Slow scan", "Large game directories and binaries may require substantial time. Start with a smaller source repository or Quick profile; use Cancel Scan if you selected the wrong target."],
    ["Unexpected results", "Verify findings in source context and consider false positives. Do not automatically delete DLLs, rotate credentials or modify files without confirming the evidence."],
    ["What CERBERUS does not do", "CERBERUS primarily identifies and reports potential issues. General-purpose automatic vulnerability repair, guaranteed false-positive elimination and PDF export are not implemented."],
  ]],
];


const detailedInstructions = {
  "Dashboard": ["After CERBERUS starts, check the engine bridge indicator at the bottom of the window. A connected bridge means local scanning and report features can communicate with the Python engine.", "Run a scan from Scan Project, then return to Dashboard. Read the overall result alongside the number and severity of findings; a high score does not prove that every security issue was discovered.", "If the displayed result seems old, check the scan date and select the intended scan from Scan History before making decisions."],
  "Scan Project": ["Select Browse beside Project folder and choose the directory containing the application or repository you want to inspect. Check the path carefully: selecting an entire game installation or system directory may cause long scans and binary false positives.", "Choose a profile appropriate to the time and coverage you need. Add an optional JSON policy only if you understand its rules; use Validate to catch configuration errors before starting.", "Decide whether online vulnerability intelligence is appropriate, start the scan and watch the progress monitor. Wait for completion before treating the findings or exported report as final. Use Cancel Scan if you selected the wrong target."],
  "Project folder": ["Use Browse to select a local folder, or paste its absolute path. Make sure the directory exists and the current Windows account can read it.", "Prefer a source repository containing readable source code and dependency manifests. Compiled DLL and executable files are not equivalent to source code and can produce misleading pattern matches.", "Check the selected path before clicking Start Scan. If a very large folder was selected accidentally, click Cancel Scan and wait for cancellation to finish."],
  "Configuration file": ["A configuration file is an optional JSON policy that changes how the scan is evaluated. It is not required for a normal first scan.", "Click Choose to select the file, then Validate. Read the minimum-score, blocked-rule and advisory-gate feedback before scanning.", "If validation fails, correct the JSON or remove the optional path to return to the engine defaults. Keep a backup before changing a shared release policy."],
  "Scan profile": ["Open the profile picker to inspect the profiles supplied by the running engine. Different profiles can enable different stages and trade speed for coverage.", "For a first run on a large directory, prefer a lighter profile when available. For release review, select a more comprehensive profile only when the project and runtime allow it.", "Record the chosen profile when comparing two scan reports; results from different profiles are not necessarily directly comparable."],
  "Cancel Scan": ["While a scan is running, click Cancel Scan once and watch for the cancellation state. CERBERUS requests cooperative cancellation rather than forcibly terminating every file operation.", "A long-running file read or network operation may delay the stop. Avoid repeatedly restarting or closing the application while cancellation is pending.", "A cancelled scan is not a clean security assessment. Start a new scan with the correct folder and wait for completion before exporting conclusions."],
  "Close confirmation": ["If a scan is active and you click the Windows close button, CERBERUS displays a confirmation describing the work it knows about.", "Choose Keep Open or Cancel to return to the application without intentionally interrupting the scan. Choose Close Anyway only when you are willing to stop the desktop backend.", "The dialog is a safeguard against accidental clicks, not a substitute for saving or completing a scan. Some other background operations may not yet be individually identified."],
  "Findings": ["Open Findings after a completed scan. Use the search field, severity filter and category controls to narrow the list.", "Select a row to read the rule, affected file, status, evidence and general remediation advice. A finding is an investigation lead; verify it before changing production files.", "When reporting an issue, record its rule, severity, path and scan context. Never publish raw credentials or other secrets as evidence."],
  "Private-key findings": ["Check whether the flagged location is readable text or a compiled binary. A binary DLL can contain random byte sequences that resemble a secret pattern.", "Confirm a valid private-key structure and whether it is actually used by the application. Do not delete a DLL or rotate credentials based only on a pattern match.", "If a real active private key is exposed, follow your organization's incident procedure to revoke or rotate it, remove it from tracked source and investigate its exposure."],
  "Dependencies": ["Open Dependencies to inspect recognized package manifests and versions. Confirm that the package name, version and ecosystem match the application actually being deployed.", "A dependency inventory is not the same as a completed vulnerability check. If online advisory lookup was unavailable, read the incomplete-check warning rather than assuming the packages are safe.", "For confirmed advisories, consult the affected-version ranges and the package maintainer's update guidance. Test any version changes outside CERBERUS before deployment."],
  "OSV Intelligence": ["Open OSV Intelligence to review advisory lookups for supported packages. Enable online access only when you accept sending package names, versions and ecosystems to the external service.", "Match an advisory against the installed version and its affected ranges. Advisory severity and practical exploitability are different considerations.", "If lookup fails, check connectivity and try again. Do not interpret a failed lookup as evidence that a dependency has no known vulnerabilities."],
  "Reports": ["Complete a scan, then open Reports and verify the Latest scan summary refers to the intended project and date.", "Choose HTML for a human-readable document, JSON for machine-readable data or SARIF for compatible code-scanning integrations. Enter a writable destination folder and generate the report.", "Open the saved file in a suitable viewer. Keep reports private when they contain internal paths or sensitive evidence, and verify that the scan completed successfully before sharing."],
  "HTML report": ["Choose HTML in Reports, enter a destination folder and click Generate HTML report. Open the saved .html file with a browser; internet access is not normally needed just to read the file.", "Begin with the scan date, target, profile, status, score and severity counts. Then read individual findings, their file locations, evidence and recommendations.", "Treat incomplete dependency checks and possible false positives separately from confirmed vulnerabilities. For a printable copy, use the browser's Print → Save as PDF feature."],
  "JSON report": ["Choose JSON and generate the report. Open the .json file in a code editor or JSON viewer rather than trying to interpret it as a formatted web page.", "Locate metadata and status first, then examine summary counts, findings and dependency information. The exact structure depends on the engine report schema.", "JSON is suitable for automation and archiving. Avoid editing the original audit record, and sanitize sensitive paths or evidence before uploading it to third-party tools."],
  "SARIF 2.1.0 report": ["Choose SARIF and generate the report. Import the .sarif file into a viewer or code-scanning integration that supports SARIF 2.1.0.", "Look inside runs for tool metadata, results for individual issues, rule IDs and levels for classification, and locations for affected artifacts.", "A SARIF consumer may display fewer fields than CERBERUS because formats and viewers differ. Keep the HTML or JSON report available for fuller investigation."],
  "Scan History": ["Open Scan History to locate previous completed scans. Identify the correct run by project name, timestamp and status before reviewing its findings.", "Use history to compare changes cautiously: different scan profiles, network conditions or engine versions can change results.", "Preserve any reports you need for an audit before deleting local history records."],
  "Bridge unavailable": ["Check the engine bridge status in the footer. If it is disconnected, scanning and report requests may fail even though the interface opens.", "Close and restart the desktop application. If the problem persists, record the displayed error and the About diagnostics information.", "Avoid deleting the local data folder as a first troubleshooting step; it may contain history, preferences and saved reports."],
  "Slow scan": ["Check the selected folder size and whether it contains large binaries, archives or game assets. Scanning a source repository is usually more informative than scanning a full installed game.", "Watch the current stage and progress indicator. Some stages can take longer without frequent progress updates.", "Use Cancel Scan when appropriate, wait for the stopped state, then select a smaller target or a lighter profile for a new run."],
  "Unexpected results": ["Read the affected file path and evidence before acting. Binary patterns, incomplete online lookups and unsupported file types can produce results that need manual interpretation.", "Verify the rule against the source or actual dependency version. Do not delete compiled libraries or change credentials without confirmation.", "If a result looks incorrect, preserve a sanitized example, engine version and profile so the detection can be improved and regression-tested."],
};

export default function HowToUse() {
  const [query, setQuery] = useState("");
  const search = query.trim().toLowerCase();
  const visible = sections.map(([heading, entries]) => [heading, entries.filter(([title, body]) =>
    !search || heading.toLowerCase().includes(search) || title.toLowerCase().includes(search) || body.toLowerCase().includes(search)
  )]).filter(([, entries]) => entries.length);
  return (
    <Panel title="How to Use CERBERUS" testId="settings-how-to-use-panel">
      <p className="text-sm text-pg-muted mb-4">Offline, searchable instructions for every main workspace, scanning, interpreting results, exporting reports and configuring the app.</p>
      <Input aria-label="Search help topics" placeholder="Search features, findings, reports, OSV…" value={query} onChange={(e) => setQuery(e.target.value)} className="bg-pg-bg mb-5" data-testid="help-search" />
      <div className="space-y-6">
        {visible.map(([heading, entries]) => (
          <section key={heading} aria-label={heading}>
            <h3 className="text-pg-accent font-semibold text-base mb-2">{heading}</h3>
            <div className="space-y-2">
              {entries.map(([title, body]) => (
                <details key={title} className="border border-pg-line/60 rounded-lg bg-pg-bg/50 px-3 py-2">
                  <summary className="cursor-pointer text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-pg-accent">{title}</summary>
                  <div className="text-sm text-pg-muted leading-7 mt-3 pb-2 space-y-3"><p>{body}</p>{(detailedInstructions[title] || [`Open the relevant CERBERUS workspace and locate the ${title} control. Review its current value and any accompanying description before changing it.`, `Make one change at a time, save preferences where applicable, and confirm the expected behavior in the related scan or report.`, `For unexpected results, consult the Troubleshooting and safety section and avoid modifying security-sensitive files without verifying the finding.`]).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
                </details>
              ))}
            </div>
          </section>
        ))}
        {!visible.length && <p className="text-sm text-pg-muted" role="status">No help topics match your search.</p>}
      </div>
    </Panel>
  );
}
