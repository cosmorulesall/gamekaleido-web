import fs from "fs";
import path from "path";
import type { WizardConfig } from "./wizard-types";

/**
 * Load and parse a wizard JSON file at build time.
 */
export function loadWizardConfig(archetypeId: string): WizardConfig | null {
  const filePath = path.join(
    process.cwd(),
    "data",
    "wizards",
    `${archetypeId}.json`
  );

  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContents) as WizardConfig;
  } catch {
    return null;
  }
}

/**
 * Get all available archetype IDs (for generateStaticParams)
 */
export function getAvailableArchetypes(): string[] {
  const wizardsDir = path.join(process.cwd(), "data", "wizards");
  try {
    const files = fs.readdirSync(wizardsDir);
    return files
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(".json", ""));
  } catch {
    return [];
  }
}
