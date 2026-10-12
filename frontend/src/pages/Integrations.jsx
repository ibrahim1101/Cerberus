import { useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/common/Panel";
import IntegrationCatalog from "@/components/integrations/IntegrationCatalog";

export default function Integrations() {
  const [params] = useSearchParams();
  return <>
    <PageHeader title="AI & Integrations" description="Configure AI assistants, security intelligence, webhooks and notification services." />
    <IntegrationCatalog selected={params.get("integration")} />
  </>;
}
