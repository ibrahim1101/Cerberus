import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { useDesktopCloseConfirmation } from "./useDesktopCloseConfirmation";
import { api } from "./api";

jest.mock("./api", () => ({ api: { scanState: jest.fn() } }));
jest.mock("sonner", () => ({ toast: { error: jest.fn() } }));

function Guard({ scanState, reportsLoading = false }) {
  useDesktopCloseConfirmation(scanState, reportsLoading);
  return null;
}

describe("desktop close confirmation", () => {
  let node;
  let root;
  let invoke;
  beforeEach(() => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    node = document.createElement("div");
    root = createRoot(node);
    invoke = jest.fn().mockResolvedValue(undefined);
    window.__TAURI__ = { core: { invoke } };
    window.confirm = jest.fn(() => false);
  });
  afterEach(async () => {
    await act(async () => root.unmount());
    delete window.__TAURI__;
    jest.restoreAllMocks();
  });
  async function close() {
    await act(async () => {
      window.dispatchEvent(new Event("cerberus-close-requested"));
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  }
  test("shows scan project and stage, respects Keep Open", async () => {
    api.scanState.mockResolvedValue({ status: "running", project: "C:/Games", current_stage: "Secret analysis", progress: 42 });
    await act(async () => root.render(<Guard scanState={{ status: "running" }} />));
    await close();
    expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining("C:/Games"));
    expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining("Secret analysis"));
    expect(invoke).not.toHaveBeenCalled();
  });
  test("closes without a prompt when idle", async () => {
    api.scanState.mockResolvedValue({ status: "idle" });
    await act(async () => root.render(<Guard scanState={{ status: "idle" }} />));
    await close();
    expect(window.confirm).not.toHaveBeenCalled();
    expect(invoke).toHaveBeenCalledWith("confirm_desktop_close");
  });
  test("warns if background state cannot be verified", async () => {
    api.scanState.mockRejectedValue(new Error("offline"));
    await act(async () => root.render(<Guard scanState={{ status: "idle" }} />));
    await close();
    expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining("could not be verified"));
    expect(invoke).not.toHaveBeenCalled();
  });
});
