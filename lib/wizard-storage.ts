import type { WizardState } from "./wizard-types";

interface WizardDraft {
  state: WizardState;
  history: string[];
  savedAt: string;
}

const STORAGE_PREFIX = "gk_wizard_draft_";

function getKey(archetype: string): string {
  return `${STORAGE_PREFIX}${archetype}`;
}

export function saveDraft(archetype: string, state: WizardState, history: string[]): void {
  try {
    const draft: WizardDraft = { state, history, savedAt: new Date().toISOString() };
    localStorage.setItem(getKey(archetype), JSON.stringify(draft));
  } catch {
    // localStorage full or unavailable — fail silently
  }
}

export function loadDraft(archetype: string): WizardDraft | null {
  try {
    const raw = localStorage.getItem(getKey(archetype));
    if (!raw) return null;
    return JSON.parse(raw) as WizardDraft;
  } catch {
    return null;
  }
}

export function clearDraft(archetype: string): void {
  try {
    localStorage.removeItem(getKey(archetype));
  } catch {
    // fail silently
  }
}
