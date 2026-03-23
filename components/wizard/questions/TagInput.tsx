"use client";

import { useState, useRef, type KeyboardEvent } from "react";
import type { Question } from "@/lib/wizard-types";

interface TagInputProps {
  question: Question;
  value: string[];
  onChange: (value: string[]) => void;
}

export default function TagInput({ question, value, onChange }: TagInputProps) {
  const [inputText, setInputText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const max = question.max_items ?? 20;
  const min = question.min_items ?? 0;

  function addTag() {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    if (value.includes(trimmed)) return;
    if (value.length >= max) return;

    onChange([...value, trimmed]);
    setInputText("");
  }

  function removeTag(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
    if (e.key === "Backspace" && !inputText && value.length > 0) {
      removeTag(value.length - 1);
    }
  }

  return (
    <div>
      {/* Tags display */}
      <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
        {value.map((tag, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm
                       bg-amber/10 border border-amber/20 text-warm-white"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(i)}
              className="text-warm-muted hover:text-warm-white transition-colors ml-0.5"
              aria-label={`Remove ${tag}`}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M3 3l6 6M9 3l-6 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </span>
        ))}
      </div>

      {/* Input */}
      {value.length < max && (
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={question.placeholder ?? "Type and press Enter"}
            className="glass-input flex-1"
            autoFocus
          />
          <button
            type="button"
            onClick={addTag}
            disabled={!inputText.trim()}
            className="btn-ghost px-4 whitespace-nowrap"
          >
            Add
          </button>
        </div>
      )}

      {/* Count indicator */}
      <p className="text-warm-muted/50 text-xs mt-3">
        {value.length} / {max} added
        {min > 0 && value.length < min && (
          <span className="text-crimson-light ml-2">
            (minimum {min} required)
          </span>
        )}
      </p>
    </div>
  );
}
