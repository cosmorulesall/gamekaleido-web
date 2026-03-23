"use client";

import type { Question } from "@/lib/wizard-types";

interface NameListProps {
  question: Question;
  value: string[];
  onChange: (value: string[]) => void;
}

export default function NameList({ question, value, onChange }: NameListProps) {
  const count = question.count ?? 4;

  // Ensure array has correct length
  const values = Array.from({ length: count }, (_, i) => value[i] ?? "");

  function handleChange(index: number, newVal: string) {
    const updated = [...values];
    updated[index] = newVal;
    onChange(updated);
  }

  return (
    <div className="space-y-3">
      {values.map((val, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-warm-muted/40 text-sm w-6 text-right flex-shrink-0">
            {i + 1}.
          </span>
          <input
            type="text"
            value={val}
            onChange={(e) => handleChange(i, e.target.value)}
            placeholder={question.placeholder}
            className="glass-input flex-1"
            autoFocus={i === 0}
          />
          {question.hints?.[i] && (
            <span className="text-warm-muted/40 text-xs hidden sm:block max-w-[200px] truncate">
              {question.hints[i]}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
