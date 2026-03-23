"use client";

import type { Question, Edition } from "@/lib/wizard-types";

interface InfoScreenProps {
  question: Question;
  edition: Edition;
  answers: Record<string, unknown>;
}

export default function InfoScreen({
  question,
  edition,
  answers,
}: InfoScreenProps) {
  // Interpolate {{variables}} in text
  const interpolated = interpolate(question.text, { edition, ...answers });
  const sublabel =
    edition === "digital"
      ? question.sublabel_digital
      : question.sublabel_physical;

  return (
    <div className="flex flex-col items-center text-center py-8">
      <div className="w-16 h-16 rounded-full bg-amber/10 border border-amber/20 flex items-center justify-center mb-6">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-amber-light"
        >
          <path
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <p className="font-display text-display-md text-warm-white mb-3">
        {interpolated}
      </p>

      {sublabel && (
        <p className="text-warm-muted text-sm max-w-md leading-relaxed">
          {sublabel}
        </p>
      )}
    </div>
  );
}

function interpolate(
  text: string,
  vars: Record<string, unknown>
): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const val = vars[key];
    if (val === undefined || val === null) return `{{${key}}}`;
    return String(val);
  });
}
