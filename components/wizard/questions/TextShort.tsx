"use client";

import type { Question } from "@/lib/wizard-types";

interface TextShortProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

export default function TextShort({ question, value, onChange }: TextShortProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={question.placeholder}
      className="glass-input text-lg"
      autoFocus
    />
  );
}
