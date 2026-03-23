"use client";

import { useState } from "react";
import type { Question, PlaceEntry } from "@/lib/wizard-types";

interface PlaceInputProps {
  question: Question;
  value: PlaceEntry[];
  onChange: (value: PlaceEntry[]) => void;
}

export default function PlaceInput({
  question,
  value,
  onChange,
}: PlaceInputProps) {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const max = question.max_items ?? 30;

  function addPlace() {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    if (value.length >= max) return;

    onChange([...value, { name: trimmedName, note: note.trim() || undefined }]);
    setName("");
    setNote("");
  }

  function removePlace(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div>
      {/* Added places */}
      {value.length > 0 && (
        <div className="space-y-2 mb-6 max-h-[280px] overflow-y-auto pr-1">
          {value.map((place, i) => (
            <div
              key={i}
              className="flex items-start gap-3 px-4 py-3 rounded-lg bg-surface border border-warm-border group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-warm-white text-sm font-medium truncate">
                  {place.name}
                </p>
                {place.note && (
                  <p className="text-warm-muted/60 text-xs mt-0.5 truncate">
                    {place.note}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removePlace(i)}
                className="text-warm-muted/30 hover:text-warm-white transition-colors opacity-0 group-hover:opacity-100"
                aria-label={`Remove ${place.name}`}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M4 4l6 6M10 4l-6 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add form */}
      {value.length < max && (
        <div className="space-y-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addPlace();
              }
            }}
            placeholder={question.placeholder_name ?? "Place name"}
            className="glass-input"
            autoFocus
          />
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addPlace();
              }
            }}
            placeholder={question.placeholder_note ?? "Why it matters (optional)"}
            className="glass-input text-sm opacity-70"
          />
          <button
            type="button"
            onClick={addPlace}
            disabled={!name.trim()}
            className="btn-ghost text-sm"
          >
            + Add place
          </button>
        </div>
      )}

      <p className="text-warm-muted/50 text-xs mt-3">
        {value.length} places added{max && ` (max ${max})`}
      </p>
    </div>
  );
}
