import type {
  WizardConfig,
  WizardMode,
  WizardState,
  Question,
  Section,
  Edition,
} from "./wizard-types";

// ============================================================================
// Wizard Engine — pure functions for navigation, branching, mode filtering
// ============================================================================

/**
 * Create initial wizard state
 */
export function createInitialState(
  config: WizardConfig,
  edition: Edition
): WizardState {
  const firstSection = config.sections[0];
  const firstQuestion = firstSection?.questions[0] ?? null;

  return {
    edition,
    mode: "hybrid", // default mode, updated when mode_selector is answered
    currentSectionIndex: 0,
    currentQuestionId: firstQuestion?.id ?? null,
    answers: {},
    isPreview: false,
    isComplete: false,
  };
}

/**
 * Check if a question is visible given current mode
 */
export function isQuestionVisible(
  question: Question,
  mode: WizardMode
): boolean {
  if (question.mode === "always") return true;
  if (question.mode === "configurable") {
    return mode === "hybrid" || mode === "full";
  }
  return false;
}

/**
 * Check if a section is visible given current mode
 */
export function isSectionVisible(
  section: Section,
  mode: WizardMode
): boolean {
  if (!section.mode) return true;
  if (section.mode === "configurable") {
    return mode === "hybrid" || mode === "full";
  }
  return true;
}

/**
 * Get all visible sections for current mode
 */
export function getVisibleSections(
  config: WizardConfig,
  mode: WizardMode
): Section[] {
  return config.sections.filter((s) => isSectionVisible(s, mode));
}

/**
 * Get all visible questions in a section for current mode
 */
export function getVisibleQuestions(
  section: Section,
  mode: WizardMode
): Question[] {
  return section.questions.filter((q) => isQuestionVisible(q, mode));
}

/**
 * Find a question by ID across all sections
 */
export function findQuestion(
  config: WizardConfig,
  questionId: string
): { question: Question; sectionIndex: number } | null {
  for (let si = 0; si < config.sections.length; si++) {
    const section = config.sections[si];
    const question = section.questions.find((q) => q.id === questionId);
    if (question) return { question, sectionIndex: si };
  }
  return null;
}

/**
 * Resolve the next question ID based on current question and answer
 */
export function resolveNext(
  config: WizardConfig,
  question: Question,
  answer: unknown,
  currentSectionIndex: number,
  mode: WizardMode
): { questionId: string | null; sectionIndex: number; isPreview: boolean } {
  const next = question.next;

  // Handle option-level next (from single_choice with per-option next)
  if (question.options && typeof answer === "string") {
    const selectedOption = question.options.find((o) => o.value === answer);
    if (selectedOption?.next) {
      return resolveNextTarget(config, selectedOption.next, currentSectionIndex, mode);
    }
  }

  // Handle question-level next
  if (!next) {
    // No explicit next — find the next visible question in this section
    return findNextInSection(config, question.id, currentSectionIndex, mode);
  }

  if (typeof next === "string") {
    return resolveNextTarget(config, next, currentSectionIndex, mode);
  }

  // Conditional next — map of answer_value → question_id
  if (typeof next === "object" && typeof answer === "string") {
    const target = next[answer];
    if (target) {
      return resolveNextTarget(config, target, currentSectionIndex, mode);
    }
  }

  // Fallback: next visible question in section
  return findNextInSection(config, question.id, currentSectionIndex, mode);
}

/**
 * Resolve a next target string (question ID, SECTION_END, or PREVIEW)
 */
function resolveNextTarget(
  config: WizardConfig,
  target: string,
  currentSectionIndex: number,
  mode: WizardMode
): { questionId: string | null; sectionIndex: number; isPreview: boolean } {
  if (target === "PREVIEW") {
    return { questionId: null, sectionIndex: currentSectionIndex, isPreview: true };
  }

  if (target === "SECTION_END") {
    return advanceToNextSection(config, currentSectionIndex, mode);
  }

  // It's a question ID — find it
  const found = findQuestion(config, target);
  if (found && isQuestionVisible(found.question, mode)) {
    return { questionId: target, sectionIndex: found.sectionIndex, isPreview: false };
  }

  // Target question not visible in this mode — skip to next section
  return advanceToNextSection(config, currentSectionIndex, mode);
}

/**
 * Find the next visible question after the given one in the same section
 */
function findNextInSection(
  config: WizardConfig,
  currentQuestionId: string,
  sectionIndex: number,
  mode: WizardMode
): { questionId: string | null; sectionIndex: number; isPreview: boolean } {
  const section = config.sections[sectionIndex];
  if (!section) {
    return { questionId: null, sectionIndex, isPreview: true };
  }

  const questions = section.questions;
  const currentIdx = questions.findIndex((q) => q.id === currentQuestionId);

  // Look for next visible question after current
  for (let i = currentIdx + 1; i < questions.length; i++) {
    if (isQuestionVisible(questions[i], mode)) {
      return { questionId: questions[i].id, sectionIndex, isPreview: false };
    }
  }

  // No more questions in this section — advance
  return advanceToNextSection(config, sectionIndex, mode);
}

/**
 * Advance to the first visible question in the next visible section
 */
function advanceToNextSection(
  config: WizardConfig,
  currentSectionIndex: number,
  mode: WizardMode
): { questionId: string | null; sectionIndex: number; isPreview: boolean } {
  for (let si = currentSectionIndex + 1; si < config.sections.length; si++) {
    const section = config.sections[si];
    if (!isSectionVisible(section, mode)) continue;

    const visibleQuestions = getVisibleQuestions(section, mode);
    if (visibleQuestions.length > 0) {
      return {
        questionId: visibleQuestions[0].id,
        sectionIndex: si,
        isPreview: false,
      };
    }
  }

  // No more sections — go to preview
  return {
    questionId: null,
    sectionIndex: config.sections.length - 1,
    isPreview: true,
  };
}

/**
 * Navigate back to the previous question.
 * Requires a history of visited question IDs.
 */
export function goBack(
  history: string[],
  config: WizardConfig
): { questionId: string; sectionIndex: number } | null {
  if (history.length < 2) return null;

  const prevId = history[history.length - 2];
  const found = findQuestion(config, prevId);
  if (!found) return null;

  return { questionId: prevId, sectionIndex: found.sectionIndex };
}

/**
 * Calculate wizard progress as a fraction (0-1).
 * Based on sections visited, not questions answered.
 */
export function calculateProgress(
  config: WizardConfig,
  currentSectionIndex: number,
  mode: WizardMode,
  isPreview: boolean
): number {
  if (isPreview) return 1;
  const visible = getVisibleSections(config, mode);
  if (visible.length === 0) return 0;

  // Find which visible section index we're at
  const currentSection = config.sections[currentSectionIndex];
  const visibleIndex = visible.findIndex((s) => s.id === currentSection?.id);

  if (visibleIndex === -1) return 0;
  return (visibleIndex + 1) / (visible.length + 1); // +1 for preview
}

/**
 * Whether the "Generate for me" button should show for a question
 */
export function shouldShowGenerate(
  question: Question,
  mode: WizardMode
): boolean {
  if (!question.generatable) return false;
  return mode === "hybrid";
}

/**
 * Whether the "Generate Remaining" global button should be visible
 */
export function shouldShowGenerateRemaining(
  config: WizardConfig,
  mode: WizardMode
): boolean {
  return config.wizard.generate_remaining_enabled && mode !== "full";
}
