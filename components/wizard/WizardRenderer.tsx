"use client";

import { useState, useCallback, useMemo } from "react";
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

import WizardShell from "./WizardShell";
import EditionPicker from "./EditionPicker";
import PreviewScreen from "./PreviewScreen";
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
}

export default function WizardRenderer({ config }: WizardRendererProps) {
  const [state, setState] = useState<WizardState | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [pulse, setPulse] = useState(0);

  // Edition not yet selected — show picker
  if (!state) {
    return (
      <WizardShell
        config={config}
        currentSectionIndex={0}
        mode="hybrid"
        isPreview={false}
        pulse={pulse}
      >
        <EditionPicker
          onSelect={(edition: Edition) => {
            setState(createInitialState(config, edition));
            const firstQ = config.sections[0]?.questions[0];
            if (firstQ) setHistory([firstQ.id]);
            triggerPulse();
          }}
        />
      </WizardShell>
    );
  }

  function triggerPulse() {
    setPulse((p) => p + 1);
  }

  // Get current question
  const currentQuestion = useMemo(() => {
    if (!state?.currentQuestionId) return null;
    const found = findQuestion(config, state.currentQuestionId);
    return found?.question ?? null;
  }, [config, state?.currentQuestionId]);

  // Get answer value for current question
  function getAnswer(q: Question): unknown {
    if (!state) return "";
    const key = q.maps_to ?? q.id;
    return state.answers[key] ?? getDefaultForType(q);
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

  // Navigate to next question
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

    setState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        currentQuestionId: questionId,
        currentSectionIndex: sectionIndex,
        isPreview,
      };
    });

    if (questionId) {
      setHistory((h) => [...h, questionId]);
    }
    triggerPulse();
  }, [currentQuestion, state, config]);

  // Navigate back
  const handleBack = useCallback(() => {
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
  }, [history, config]);

  // Stub: handle generate
  function handleGenerate() {
    // In the real implementation, this calls the AI backend
    // For now, it's a no-op placeholder
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
      >
        <PreviewScreen
          config={config}
          state={state}
          onEdit={handleBack}
          onConfirm={() => {
            setState((prev) => (prev ? { ...prev, isComplete: true } : prev));
            // In production: submit to backend
            console.log("Wizard complete:", state.answers);
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
      >
        <div className="flex flex-col items-center justify-center text-center py-12">
          <div className="w-16 h-16 rounded-full bg-amber/15 border border-amber/25 flex items-center justify-center mb-6">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-amber-light"
            >
              <path
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="font-display text-display-md text-warm-white mb-3">
            You&apos;re all set
          </h2>
          <p className="text-warm-muted text-sm max-w-md">
            Your game is being crafted. In the real flow, this would redirect to
            Stripe Checkout, and you&apos;d receive your companion page URL via email.
          </p>
        </div>
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
          canGoBack={history.length > 1}
          canGoNext={canGoNext()}
        >
          {renderQuestionInput(currentQuestion, state, getAnswer, setAnswer)}
        </QuestionWrapper>
      </AnimatePresence>
    </WizardShell>
  );
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
