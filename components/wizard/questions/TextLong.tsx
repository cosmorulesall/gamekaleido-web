"use client";

import type { Question } from "@/lib/wizard-types";

interface TextLongProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

export default function TextLong({ question, value, onChange }: TextLongProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={question.placeholder}
      rows={5}
      className="glass-input text-base leading-relaxed resize-none min-h-[160px]"
      autoFocus
    />
  );
}
