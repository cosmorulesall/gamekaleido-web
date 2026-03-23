"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import type {
  WizardConfig,
  WizardState,
  WizardMode,
  Edition,
  Question,
  PlaceEntry,
  CardEntry,
  TriviaQuestion,
} from "@/lib/wizard-types";
import {
  createInitialState,
  findQuestion,
  resolveNext,
  shouldShowGenerate,
} from "@/lib/wizard-engine";

import { saveDraft, loadDraft, clearDraft } from "@/lib/wizard-storage";
import WizardShell from "./WizardShell";
import EditionPicker from "./EditionPicker";
import PreviewScreen from "./PreviewScreen";
import CompletionSummary from "./CompletionSummary";
import QuestionWrapper from "./questions/QuestionWrapper";

// Question type components
import TextShort from "./questions/TextShort";
import TextLong from "./questions/TextLong";
import SingleChoice from "./questions/SingleChoice";
import TagInput from "./questions/TagInput";
import ModeSelector from "./questions/ModeSelector";
import InfoScreen from "./questions/InfoScreen";
import StylePicker from "./questions/StylePicker";
import ColourPalette from "./questions/ColourPalette";
import PlaceInput from "./questions/PlaceInput";
import NameList from "./questions/NameList";
import CardEditor from "./questions/CardEditor";
import PropertyGrid from "./questions/PropertyGrid";
import CategoryNameEditor from "./questions/CategoryNameEditor";
import QuestionEditor from "./questions/QuestionEditor";

interface WizardRendererProps {
  config: WizardConfig;
  archetype: string;
}

export default function WizardRenderer({ config, archetype }: WizardRendererProps) {
  const [state, setState] = useState<WizardState | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [pulse, setPulse] = useState(0);
  const [draftChecked, setDraftChecked] = useState(false);
  const [pendingDraft, setPendingDraft] = useState<{ state: WizardState; history: string[]; savedAt: string } | null>(null);

  // Check for existing draft on mount
  useEffect(() => {
    if (!draftChecked) {
      const draft = loadDraft(archetype);
      if (draft) {
        setPendingDraft(draft);
      }
      setDraftChecked(true);
    }
  }, [archetype, draftChecked]);

  // Auto-save draft on state/history change
  useEffect(() => {
    if (state && !state.isComplete) {
      saveDraft(archetype, state, history);
    }
  }, [state, history, archetype]);

  // Clear draft on completion
  useEffect(() => {
    if (state?.isComplete) {
      clearDraft(archetype);
    }
  }, [state?.isComplete, archetype]);

  function triggerPulse() {
    setPulse((p) => p + 1);
  }

  function getDefaultForType(q: Question): unknown {
    switch (q.type) {
      case "tag_input":
      case "colour_palette":
      case "place_input":
      case "name_list":
      case "card_editor":
        return [];
      case "property_grid":
      case "category_name_editor":
      case "question_editor":
        return {};
      case "mode_selector":
        return state?.mode ?? "hybrid";
      default:
        return "";
    }
  }

  // Get current question — always call this hook
  const currentQuestion = useMemo(() => {
    if (!state?.currentQuestionId) return null;
    const found = findQuestion(config, state.currentQuestionId);
    return found?.question ?? null;
  }, [config, state?.currentQuestionId]);

  // Navigate to next question — always call this hook
  const handleNext = useCallback(() => {
    if (!currentQuestion || !state) return;

    const currentAnswer = state.answers[currentQuestion.maps_to ?? currentQuestion.id] ?? getDefaultForType(currentQuestion);
    const { questionId, sectionIndex, isPreview } = resolveNext(
      config,
      currentQuestion,
      currentAnswer,
      state.currentSectionIndex,
      state.mode
    );

    // Check edit-mode return before setState so we can skip history push
    const willReturnToSummary =
      state.returnToSummary &&
      state.editSectionId &&
      (sectionIndex !== state.currentSectionIndex || isPreview);

    setState((prev) => {
      if (!prev) return prev;

      // Edit mode: return to summary when leaving the editing section
      if (prev.returnToSummary && prev.editSectionId) {
        const leavingSection = sectionIndex !== prev.currentSectionIndex || isPreview;
        if (leavingSection) {
          return {
            ...prev,
            isComplete: true,
            isPreview: false,
            returnToSummary: undefined,
            editSectionId: undefined,
          };
        }
      }

      return {
        ...prev,
        currentQuestionId: questionId,
        currentSectionIndex: sectionIndex,
        isPreview,
      };
    });

    if (questionId && !willReturnToSummary) {
      setHistory((h) => [...h, questionId]);
    }
    triggerPulse();
  }, [currentQuestion, state, config]);

  // Navigate back — always call this hook
  const handleBack = useCallback(() => {
    // Edit mode: if at start of section, return to summary
    if (state?.returnToSummary && history.length < 2) {
      setState((prev) =>
        prev
          ? {
              ...prev,
              isComplete: true,
              isPreview: false,
              returnToSummary: undefined,
              editSectionId: undefined,
            }
          : prev
      );
      return;
    }

    if (history.length < 2) return;
    const prevId = history[history.length - 2];
    const found = findQuestion(config, prevId);
    if (!found) return;

    setState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        currentQuestionId: prevId,
        currentSectionIndex: found.sectionIndex,
        isPreview: false,
      };
    });
    setHistory((h) => h.slice(0, -1));
  }, [history, config, state?.returnToSummary]);

  // --- All hooks are above this line. Conditional returns below. ---

  // Wait for draft check before rendering (avoids hydration mismatch)
  if (!state && !draftChecked) {
    return (
      <WizardShell
        config={config}
        currentSectionIndex={0}
        mode="hybrid"
        isPreview={false}
        pulse={pulse}
      >
        <div />
      </WizardShell>
    );
  }

  // Edition not yet selected — show picker (or resume prompt)
  if (!state) {
    return (
      <WizardShell
        config={config}
        currentSectionIndex={0}
        mode="hybrid"
        isPreview={false}
        pulse={pulse}
      >
        {pendingDraft ? (
          <div className="flex flex-col items-center justify-center text-center py-8">
            <div className="w-14 h-14 rounded-full bg-amber/15 border border-amber/25 flex items-center justify-center mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-light">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="font-display text-display-md text-warm-white mb-2">
              Welcome back
            </h2>
            <p className="text-warm-muted text-sm mb-8 max-w-sm">
              You have an unfinished draft from{" "}
              {formatTimeAgo(pendingDraft.savedAt)}. Resume where you left off?
            </p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  clearDraft(archetype);
                  setPendingDraft(null);
                }}
              >
                Start fresh
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setState(pendingDraft.state);
                  setHistory(pendingDraft.history);
                  setPendingDraft(null);
                  triggerPulse();
                }}
              >
                Resume
              </button>
            </div>
          </div>
        ) : (
          <EditionPicker
            onSelect={(edition: Edition) => {
              setState(createInitialState(config, edition));
              const firstQ = config.sections[0]?.questions[0];
              if (firstQ) setHistory([firstQ.id]);
              triggerPulse();
            }}
          />
        )}
      </WizardShell>
    );
  }

  // Get answer value for current question
  function getAnswer(q: Question): unknown {
    if (!state) return "";
    const key = q.maps_to ?? q.id;
    return state.answers[key] ?? getDefaultForType(q);
  }

  // Set answer for current question
  function setAnswer(q: Question, value: unknown) {
    const key = q.maps_to ?? q.id;
    setState((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, answers: { ...prev.answers, [key]: value } };

      // If mode_selector, update the wizard mode
      if (q.type === "mode_selector" && typeof value === "string") {
        updated.mode = value as WizardMode;
      }

      return updated;
    });
  }

  // Stub: handle generate
  function handleGenerate() {
    console.log("Generate triggered for:", currentQuestion?.id);
  }

  // Check if can proceed
  function canGoNext(): boolean {
    if (!currentQuestion || !state) return false;
    if (!currentQuestion.required) return true;

    const answer = state.answers[currentQuestion.maps_to ?? currentQuestion.id] ?? getDefaultForType(currentQuestion);
    if (answer === undefined || answer === null || answer === "") return false;
    if (Array.isArray(answer) && answer.length === 0) {
      return !(currentQuestion.min_items && currentQuestion.min_items > 0);
    }
    return true;
  }

  // Preview screen
  if (state.isPreview) {
    return (
      <WizardShell
        config={config}
        currentSectionIndex={state.currentSectionIndex}
        mode={state.mode}
        isPreview={true}
        pulse={pulse}
        showSaveStatus={false}
      >
        <PreviewScreen
          config={config}
          state={state}
          onEdit={handleBack}
          onConfirm={() => {
            setState((prev) =>
              prev ? { ...prev, isComplete: true, isPreview: false } : prev
            );
          }}
        />
      </WizardShell>
    );
  }

  // Complete screen
  if (state.isComplete) {
    return (
      <WizardShell
        config={config}
        currentSectionIndex={state.currentSectionIndex}
        mode={state.mode}
        isPreview={true}
        pulse={pulse}
        showSaveStatus={false}
      >
        <CompletionSummary
          config={config}
          state={state}
          onStartFresh={() => {
            clearDraft(archetype);
            setState(null);
            setHistory([]);
            setPendingDraft(null);
          }}
          onGoBack={() => {
            setState((prev) =>
              prev ? { ...prev, isComplete: false, isPreview: true } : prev
            );
          }}
          onEditSection={(sectionId) => {
            const sectionIndex = config.sections.findIndex((s) => s.id === sectionId);
            if (sectionIndex === -1) return;
            const section = config.sections[sectionIndex];
            const firstQuestion = section.questions[0];
            if (!firstQuestion) return;

            setState((prev) =>
              prev
                ? {
                    ...prev,
                    isComplete: false,
                    isPreview: false,
                    currentQuestionId: firstQuestion.id,
                    currentSectionIndex: sectionIndex,
                    returnToSummary: true,
                    editSectionId: sectionId,
                  }
                : prev
            );
            // Fresh history for edit mode — prevents Back from going to prior sections
            setHistory([firstQuestion.id]);
          }}
        />
      </WizardShell>
    );
  }

  // No question found — shouldn't happen
  if (!currentQuestion) {
    return null;
  }

  return (
    <WizardShell
      config={config}
      currentSectionIndex={state.currentSectionIndex}
      mode={state.mode}
      isPreview={false}
      pulse={pulse}
      showSaveStatus={true}
    >
      <AnimatePresence mode="wait">
        <QuestionWrapper
          key={currentQuestion.id}
          question={currentQuestion}
          mode={state.mode}
          onNext={handleNext}
          onBack={handleBack}
          onGenerate={
            shouldShowGenerate(currentQuestion, state.mode)
              ? handleGenerate
              : undefined
          }
          canGoBack={history.length > 1 || !!state.returnToSummary}
          canGoNext={canGoNext()}
        >
          {renderQuestionInput(currentQuestion, state, getAnswer, setAnswer)}
        </QuestionWrapper>
      </AnimatePresence>
    </WizardShell>
  );
}

function formatTimeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

// Dispatch to the correct question type component
function renderQuestionInput(
  question: Question,
  state: WizardState,
  getAnswer: (q: Question) => unknown,
  setAnswer: (q: Question, value: unknown) => void
) {
  const answer = getAnswer(question);

  switch (question.type) {
    case "text_short":
      return (
        <TextShort
          question={question}
          value={(answer as string) ?? ""}
          onChange={(v) => setAnswer(question, v)}
        />
      );

    case "text_long":
      return (
        <TextLong
          question={question}
          value={(answer as string) ?? ""}
          onChange={(v) => setAnswer(question, v)}
        />
      );

    case "single_choice":
      return (
        <SingleChoice
          question={question}
          value={(answer as string) ?? ""}
          onChange={(v) => setAnswer(question, v)}
        />
      );

    case "tag_input":
      return (
        <TagInput
          question={question}
          value={(answer as string[]) ?? []}
          onChange={(v) => setAnswer(question, v)}
        />
      );

    case "mode_selector":
      return (
        <ModeSelector
          question={question}
          value={(answer as WizardMode) ?? "hybrid"}
          onChange={(v) => setAnswer(question, v)}
        />
      );

    case "info":
      return (
        <InfoScreen
          question={question}
          edition={state.edition}
          answers={state.answers}
        />
      );

    case "style_picker":
      return (
        <StylePicker
          question={question}
          value={(answer as string) ?? ""}
          onChange={(v) => setAnswer(question, v)}
        />
      );

    case "colour_palette":
      return (
        <ColourPalette
          question={question}
          value={(answer as string[]) ?? []}
          onChange={(v) => setAnswer(question, v)}
        />
      );

    case "place_input":
      return (
        <PlaceInput
          question={question}
          value={(answer as PlaceEntry[]) ?? []}
          onChange={(v) => setAnswer(question, v)}
        />
      );

    case "name_list":
      return (
        <NameList
          question={question}
          value={(answer as string[]) ?? []}
          onChange={(v) => setAnswer(question, v)}
        />
      );

    case "card_editor":
      return (
        <CardEditor
          question={question}
          value={(answer as CardEntry[]) ?? []}
          onChange={(v) => setAnswer(question, v)}
        />
      );

    case "property_grid":
      return (
        <PropertyGrid
          question={question}
          value={(answer as Record<string, string>) ?? {}}
          onChange={(v) => setAnswer(question, v)}
        />
      );

    case "category_name_editor":
      return (
        <CategoryNameEditor
          question={question}
          value={(answer as Record<string, string>) ?? {}}
          onChange={(v) => setAnswer(question, v)}
        />
      );

    case "question_editor":
      return (
        <QuestionEditor
          question={question}
          value={(answer as Record<string, TriviaQuestion[]>) ?? {}}
          onChange={(v) => setAnswer(question, v)}
        />
      );

    default:
      return (
        <p className="text-warm-muted text-sm">
          Unknown question type: {question.type}
        </p>
      );
  }
}
