import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/** Contextual help. Text is bundled locally; no network requests or telemetry. */
export default function HelpTip({ title, children }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" aria-label={`Help: ${title}`} data-testid="context-help"
          className="inline-flex items-center justify-center rounded-full text-pg-muted hover:text-pg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-pg-accent ml-1.5">
          <HelpCircle className="w-4 h-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs bg-pg-surface border border-pg-line text-pg-text p-3 text-xs leading-relaxed">
        <strong className="block mb-1">{title}</strong>
        <span>{children}</span>
      </TooltipContent>
    </Tooltip>
  );
}
