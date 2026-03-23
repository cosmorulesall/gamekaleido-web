import { notFound } from "next/navigation";
import { loadGameInstance, getAvailableDemos } from "@/lib/load-instance";
import CompanionShell from "@/components/companion/CompanionShell";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAvailableDemos().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps) {
  const instance = loadGameInstance(params.slug);
  if (!instance) return { title: "Gamekaleido" };

  return {
    title: `${instance.identity.game_name} — Gamekaleido`,
    description: instance.identity.tagline,
  };
}

export default function CompanionPage({ params }: PageProps) {
  const instance = loadGameInstance(params.slug);
  if (!instance) notFound();

  return <CompanionShell instance={instance} />;
}
