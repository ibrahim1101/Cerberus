import { HashRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { AppProvider, useApp } from "@/context/AppContext";
import { useDesktopCloseConfirmation } from "@/lib/useDesktopCloseConfirmation";

function DesktopExitGuard() {
  const { scanState, reportsLoading } = useApp();
  useDesktopCloseConfirmation(scanState, reportsLoading);
  return null;
}
import AppShell from "@/components/layout/AppShell";
import Dashboard from "@/pages/Dashboard";
import ScanProject from "@/pages/ScanProject";
import Findings from "@/pages/Findings";
import Dependencies from "@/pages/Dependencies";
import OsvIntel from "@/pages/OsvIntel";
import Reports from "@/pages/Reports";
import History from "@/pages/History";
import Settings from "@/pages/Settings";
import Integrations from "@/pages/Integrations";

export default function App() {
  return (
    <AppProvider>
      <DesktopExitGuard />
      <HashRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Dashboard />} />
            <Route path="scan" element={<ScanProject />} />
            <Route path="findings" element={<Findings />} />
            <Route path="dependencies" element={<Dependencies />} />
            <Route path="osv" element={<OsvIntel />} />
            <Route path="reports" element={<Reports />} />
            <Route path="history" element={<History />} />
            <Route path="settings" element={<Settings />} />
            <Route path="integrations" element={<Integrations />} />
          </Route>
        </Routes>
      </HashRouter>
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{ style: { background: "#1B2225", border: "1px solid #364144", color: "#F1F4F3" } }}
      />
    </AppProvider>
  );
}
