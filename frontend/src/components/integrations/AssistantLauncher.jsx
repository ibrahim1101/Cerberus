import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, Settings2, X } from "lucide-react";

export default function AssistantLauncher() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  return <div className="fixed bottom-14 right-5 z-40 flex flex-col items-end" data-testid="assistant-launcher">
    {open && <section role="dialog" aria-label="CERBERUS AI assistant" className="w-[310px] max-w-[calc(100vw-40px)] rounded-xl border border-pg-line bg-pg-surface shadow-2xl mb-2 overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b border-pg-line"><strong className="text-sm">CERBERUS AI Assistant</strong><button type="button" aria-label="Close assistant" onClick={() => setOpen(false)}><X className="h-4 w-4" /></button></div>
      <div className="p-4 space-y-3 text-sm"><p className="text-pg-muted">AI chat is not connected yet. Configure a provider to enable it when the secure backend is ready.</p>
      <button type="button" onClick={() => { setOpen(false); navigate("/integrations?integration=ai"); }} className="flex items-center gap-2 rounded-md border border-pg-line px-3 py-2 hover:bg-pg-surface2"><Settings2 className="h-4 w-4" /> Configure AI provider</button></div>
    </section>}
    <button type="button" aria-label={open ? "Hide AI assistant" : "Open AI assistant"} aria-expanded={open} onClick={() => setOpen(v => !v)} className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-pg-accent bg-pg-surface shadow-[0_0_22px_rgba(163,207,79,0.35)] hover:bg-pg-surface2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-pg-accent"><Bot className="h-7 w-7 text-pg-accent" /></button>
  </div>;
}
