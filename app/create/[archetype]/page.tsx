import { notFound } from "next/navigation";
import { loadWizardConfig, getAvailableArchetypes } from "@/lib/load-wizard";
import WizardRenderer from "@/components/wizard/WizardRenderer";

interface PageProps {
  params: { archetype: string };
}

// Pre-render known archetypes at build time
export function generateStaticParams() {
  return getAvailableArchetypes().map((id) => ({
    archetype: id.replace(/_/g, "-"),
  }));
}

export function generateMetadata({ params }: PageProps) {
  const archetypeId = params.archetype.replace(/-/g, "_");
  const config = loadWizardConfig(archetypeId);

  if (!config) return { title: "Gamekaleido" };

  const displayName = config.wizard.archetype
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `Create Your ${displayName} Game — Gamekaleido`,
    description: `Design a personalised ${displayName.toLowerCase()} board game in minutes.`,
  };
}

export default function CreateWizardPage({ params }: PageProps) {
  // Convert URL slug to archetype ID (property-trading → property_trading)
  const archetypeId = params.archetype.replace(/-/g, "_");
  const config = loadWizardConfig(archetypeId);

  if (!config) {
    notFound();
  }

  return <WizardRenderer config={config} archetype={archetypeId} />;
}
