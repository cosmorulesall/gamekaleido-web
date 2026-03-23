"use client";

import React from "react";
import { motion } from "framer-motion";
import type { WizardConfig, WizardState } from "@/lib/wizard-types";

interface CompletionSummaryProps {
  config: WizardConfig;
  state: WizardState;
  onStartFresh: () => void;
  onGoBack: () => void;
}

export default function CompletionSummary({
  config,
  state,
  onStartFresh,
  onGoBack,
}: CompletionSummaryProps) {
  const answers = state.answers;

  function handleDownload() {
    const data = {
      archetype: config.wizard.archetype,
      edition: state.edition,
      mode: state.mode,
      answers: answers,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gamekaleido-${config.wizard.archetype}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Build sections with their answered questions
  const sections = config.sections
    .map((section) => {
      const answeredQuestions = section.questions
        .filter((q) => {
          const key = q.maps_to ?? q.id;
          const val = answers[key];
          return val !== undefined && val !== "" && !isEmptyCollection(val);
        })
        .map((q) => ({
          label: q.text,
          key: q.maps_to ?? q.id,
          value: answers[q.maps_to ?? q.id],
          type: q.type,
        }));
      return { title: section.title, questions: answeredQuestions };
    })
    .filter((s) => s.questions.length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col items-center"
    >
      {/* Header */}
      <div className="w-14 h-14 rounded-full bg-amber/15 border border-amber/25 flex items-center justify-center mb-6">
        <svg
          width="24"
          height="24"
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
      <h2 className="font-display text-display-md text-warm-white mb-2">
        Wizard Complete
      </h2>
      <p className="text-warm-muted text-sm mb-8 max-w-md text-center">
        Here&apos;s everything you entered. In production, this would submit to
        the backend and redirect to Stripe Checkout.
      </p>

      {/* Summary card */}
      <div className="glass-panel p-6 w-full max-w-lg text-left mb-6 max-h-[60vh] overflow-y-auto">
        {/* Meta row */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-warm-border">
          <span className="text-xs text-warm-muted/50 uppercase tracking-wider">
            {state.edition} Edition
          </span>
          <span className="text-warm-border">|</span>
          <span className="text-xs text-warm-muted/50 uppercase tracking-wider">
            {state.mode} mode
          </span>
        </div>

        {/* Sections */}
        {sections.map((section, si) => (
          <div key={si} className="mb-6 last:mb-0">
            <h4 className="text-xs text-warm-muted/40 uppercase tracking-wider mb-3">
              {section.title}
            </h4>
            <div className="space-y-3">
              {section.questions.map((q) => (
                <div key={q.key}>
                  <p className="text-warm-muted text-xs mb-0.5">{q.label}</p>
                  <div className="text-warm-white text-sm">
                    {renderAnswerValue(q.value, q.type)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button type="button" onClick={onStartFresh} className="btn-ghost">
          Start fresh
        </button>
        <button type="button" onClick={onGoBack} className="btn-ghost">
          Go back and edit
        </button>
        <button type="button" onClick={handleDownload} className="btn-primary">
          Download JSON
        </button>
      </div>
    </motion.div>
  );
}

function isEmptyCollection(val: unknown): boolean {
  if (Array.isArray(val)) return val.length === 0;
  if (typeof val === "object" && val !== null) return Object.keys(val).length === 0;
  return false;
}

function renderAnswerValue(value: unknown, questionType: string): React.ReactNode {
  if (value === null || value === undefined) return <span className="text-warm-muted/30">—</span>;

  // String values
  if (typeof value === "string") {
    // Clean up prefixed values from SingleChoice other / StylePicker freeform
    if (value.startsWith("__freeform__:")) return value.slice("__freeform__:".length);
    if (questionType === "single_choice" && value.includes(":")) return value.slice(value.indexOf(":") + 1);
    return value;
  }

  // Array of strings (tag_input, colour_palette, name_list)
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === "string") {
    return (
      <div className="flex flex-wrap gap-1.5">
        {(value as string[]).filter(Boolean).map((item, i) => (
          <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-warm-border/30 text-warm-white">
            {item}
          </span>
        ))}
      </div>
    );
  }

  // Array of objects (place_input, card_editor)
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === "object") {
    return (
      <ul className="space-y-1">
        {(value as Record<string, unknown>[]).map((item, i) => (
          <li key={i} className="text-xs text-warm-muted">
            {item.name ? String(item.name) : item.text ? String(item.text) : JSON.stringify(item)}
            {item.note != null && <span className="text-warm-muted/40 ml-1">({String(item.note)})</span>}
          </li>
        ))}
      </ul>
    );
  }

  // Record objects (property_grid, category_name_editor, question_editor)
  if (typeof value === "object" && value !== null) {
    const entries = Object.entries(value as Record<string, unknown>).filter(
      ([, v]) => v !== undefined && v !== ""
    );
    if (entries.length === 0) return <span className="text-warm-muted/30">—</span>;

    // question_editor: Record<category, TriviaQuestion[]>
    if (questionType === "question_editor") {
      return (
        <div className="space-y-1">
          {entries.map(([cat, qs]) => (
            <p key={cat} className="text-xs text-warm-muted">
              {cat}: {Array.isArray(qs) ? `${qs.length} questions` : "—"}
            </p>
          ))}
        </div>
      );
    }

    // property_grid / category_name_editor: Record<slot, name>
    return (
      <div className="flex flex-wrap gap-1.5">
        {entries.slice(0, 12).map(([key, val]) => (
          <span key={key} className="text-xs px-2 py-0.5 rounded-full bg-warm-border/30 text-warm-white">
            {String(val)}
          </span>
        ))}
        {entries.length > 12 && (
          <span className="text-xs text-warm-muted/40">+{entries.length - 12} more</span>
        )}
      </div>
    );
  }

  return String(value);
}
