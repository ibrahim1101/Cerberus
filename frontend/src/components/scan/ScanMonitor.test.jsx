import React, { act } from "react";
import { createRoot } from "react-dom/client";
import ScanMonitor from "./ScanMonitor";
import { useApp } from "@/context/AppContext";

jest.mock("@/context/AppContext", () => ({ useApp: jest.fn() }));
jest.mock("react-router-dom", () => ({ useNavigate: () => jest.fn() }));
global.IS_REACT_ACT_ENVIRONMENT = true;

describe("completed scan accounting", () => {
  let node, root;
  beforeEach(() => {
    node = document.createElement("div");
    document.body.appendChild(node);
    root = createRoot(node);
  });
  afterEach(async () => {
    await act(async () => root.unmount());
    node.remove();
    jest.clearAllMocks();
  });
  async function renderState(state) {
    useApp.mockReturnValue({ scanState: state, latest: null });
    await act(async () => root.render(<ScanMonitor />));
  }
  const base = {
    status: "completed", scan_id: "scan-1", profile: "standard",
    online_effective: false, progress: 100, stages: [],
    files_processed: 255, files_discovered: 256, findings_detected: 0,
  };

  test("shows final scanned reused and skipped counts separately from progress", async () => {
    await renderState({ ...base, secret_scan_metrics: {
      discovered: 256, scanned: 250, reused: 5,
      skipped_size: 1, skipped_changed: 0, skipped_error: 0,
    } });
    expect(node.querySelector('[data-testid="scan-files"]').textContent).toBe("255 / 256");
    expect(node.querySelector('[data-testid="scan-file-accounting"]').textContent)
      .toMatch(/250 scanned.*5 reused.*1 skipped.*256 discovered/);
  });

  test("does not display stale final accounting while scan is running", async () => {
    await renderState({ ...base, status: "running", progress: 75, secret_scan_metrics: {
      discovered: 256, scanned: 250, reused: 5, skipped_size: 1,
      skipped_changed: 0, skipped_error: 0,
    } });
    expect(node.querySelector('[data-testid="scan-file-accounting"]')).toBeNull();
  });

  test("works with older bridge state lacking accounting", async () => {
    await renderState(base);
    expect(node.querySelector('[data-testid="scan-file-accounting"]')).toBeNull();
  });
});
