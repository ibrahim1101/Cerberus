import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { api } from "./api";

// A native close request is paused until the user has reviewed active work.
export function useDesktopCloseConfirmation(scanState, reportsLoading) {
  const latest = useRef({ scanState, reportsLoading });
  const pending = useRef(false);
  latest.current = { scanState, reportsLoading };

  useEffect(() => {
    async function handleClose() {
      if (pending.current) return;
      pending.current = true;
      try {
        const work = latest.current;
        const activities = [];
        let state = work.scanState;
        try {
          state = await api.scanState();
        } catch {
          activities.push("Scanner status could not be verified");
        }
        if (state?.status === "running") {
          activities.push("Security scan: " + (state.project || "selected project") +
            " — " + (state.current_stage || "Starting") +
            " (" + Math.round(state.progress || 0) + "%)");
        }
        if (work.reportsLoading) activities.push("Loading reports and scan history");
        const warning = activities.length
          ? "CERBERUS is still working:\n\n" + activities.join("\n") +
            "\n\nClosing will stop the desktop backend and interrupt unfinished work. Close anyway?"
          : null;
        if (!warning || window.confirm(warning)) {
          await window.__TAURI__?.core?.invoke?.("confirm_desktop_close");
        }
      } catch {
        toast.error("Could not confirm desktop exit; CERBERUS remains open");
      } finally {
        pending.current = false;
      }
    }
    window.addEventListener("cerberus-close-requested", handleClose);
    return () => window.removeEventListener("cerberus-close-requested", handleClose);
  }, []);
}
