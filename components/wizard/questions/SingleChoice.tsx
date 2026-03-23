"use client";

import { useState, useEffect } from "react";
import type { Question } from "@/lib/wizard-types";

interface SingleChoiceProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

export default function SingleChoice({
  question,
  value,
  onChange,
}: SingleChoiceProps) {
  const otherVal = question.show_other_input_if;
  const isOther = !!otherVal && (value === otherVal || value.startsWith(otherVal + ":"));
  const [otherText, setOtherText] = useState(() =>
    otherVal && value.startsWith(otherVal + ":")
      ? value.slice(otherVal.length + 1)
      : ""
  );

  useEffect(() => {
    if (otherVal && value.startsWith(otherVal + ":")) {
      setOtherText(value.slice(otherVal.length + 1));
    } else if (!isOther) {
      setOtherText("");
    }
  }, [value, otherVal, isOther]);

  return (
    <div className="space-y-3">
      {question.options?.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`w-full text-left px-5 py-4 rounded-xl transition-all duration-200 border ${
            value === option.value || (option.value === question.show_other_input_if && value.startsWith(option.value + ":"))
              ? "border-amber/40 bg-amber/8 text-warm-white"
              : "border-warm-border bg-transparent text-warm-muted hover:border-warm-border/50 hover:text-warm-white"
          }`}
        >
          <span className="text-base">{option.label}</span>
          {option.sublabel && (
            <span className="block text-sm text-warm-muted/70 mt-1">
              {option.sublabel}
            </span>
          )}
        </button>
      ))}

      {isOther && (
        <input
          type="text"
          value={otherText}
          onChange={(e) => {
            setOtherText(e.target.value);
            onChange(e.target.value ? `${otherVal}:${e.target.value}` : otherVal);
          }}
          placeholder="Please specify..."
          className="glass-input mt-2"
          autoFocus
        />
      )}
    </div>
  );
}
