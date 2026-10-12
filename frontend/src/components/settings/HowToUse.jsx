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
                  <p className="text-sm text-pg-muted leading-relaxed mt-2 pb-1">{body}</p>
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
