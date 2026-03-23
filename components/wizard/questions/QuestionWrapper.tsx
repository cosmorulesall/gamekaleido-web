"use client";

import { motion } from "framer-motion";
import type { Question, WizardMode } from "@/lib/wizard-types";
import { shouldShowGenerate } from "@/lib/wizard-engine";

interface QuestionWrapperProps {
  question: Question;
  mode: WizardMode;
  onNext: () => void;
  onBack: () => void;
  onGenerate?: () => void;
  canGoBack: boolean;
  canGoNext: boolean;
  children: React.ReactNode;
}

export default function QuestionWrapper({
  question,
  mode,
  onNext,
  onBack,
  onGenerate,
  canGoBack,
  canGoNext,
  children,
}: QuestionWrapperProps) {
  const showGenerate = shouldShowGenerate(question, mode);

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col h-full"
    >
      {/* Question header */}
      <div className="mb-8">
        <h2 className="font-display text-display-md text-warm-white mb-3">
          {question.text}
        </h2>
        {question.sublabel && (
          <p className="text-warm-muted text-sm leading-relaxed max-w-lg">
            {question.sublabel}
          </p>
        )}
      </div>

      {/* Question content */}
      <div className="flex-1 min-h-0">{children}</div>

      {/* Hint */}
      {question.hint && (
        <p className="text-warm-muted/60 text-xs mt-4 italic">
          {question.hint}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-warm-border">
        <div>
          {canGoBack && (
            <button onClick={onBack} className="btn-ghost" type="button">
              Back
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {showGenerate && onGenerate && (
            <button
              onClick={onGenerate}
              className="btn-generate"
              type="button"
            >
              <GenerateIcon />
              Generate for me
            </button>
          )}

          {!question.required && (
            <button
              onClick={onNext}
              className="btn-ghost text-warm-muted/50"
              type="button"
            >
              Skip
            </button>
          )}

          <button
            onClick={onNext}
            className="btn-primary"
            disabled={!canGoNext && question.required}
            type="button"
          >
            Continue
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function GenerateIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className="opacity-80"
    >
      <path
        d="M7 1v2M7 11v2M1 7h2M11 7h2M3.05 3.05l1.41 1.41M9.54 9.54l1.41 1.41M3.05 10.95l1.41-1.41M9.54 4.46l1.41-1.41"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
