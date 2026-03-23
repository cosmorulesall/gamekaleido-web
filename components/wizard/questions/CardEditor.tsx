"use client";

import { useState } from "react";
import type { Question, CardEntry } from "@/lib/wizard-types";

interface CardEditorProps {
  question: Question;
  value: CardEntry[];
  onChange: (value: CardEntry[]) => void;
  onRegenerate?: () => void;
}

export default function CardEditor({
  question,
  value,
  onChange,
  onRegenerate,
}: CardEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  // Empty state
  if (value.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-teal/10 border border-teal/20 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-teal-light">
            <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-warm-muted text-sm mb-1">No cards yet</p>
        <p className="text-warm-muted/50 text-xs mb-4">
          Cards will be generated based on your game&apos;s theme
        </p>
        {onRegenerate && (
          <button type="button" onClick={onRegenerate} className="btn-generate">
            Generate cards
          </button>
        )}
      </div>
    );
  }

  function updateCard(id: string, text: string) {
    onChange(value.map((c) => (c.id === id ? { ...c, text } : c)));
  }

  return (
    <div>
      {/* Header with regenerate */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-warm-muted text-xs">
          {value.length} cards
        </p>
        {onRegenerate && (
          <button
            type="button"
            onClick={onRegenerate}
            className="btn-generate"
          >
            Regenerate All
          </button>
        )}
      </div>

      {/* Card list */}
      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
        {value.map((card, i) => (
          <div
            key={card.id}
            className="flex items-start gap-3 px-4 py-3 rounded-lg bg-surface border border-warm-border group"
          >
            <span className="text-warm-muted/30 text-xs mt-1 w-5 flex-shrink-0">
              {i + 1}
            </span>

            {editingId === card.id ? (
              <textarea
                value={card.text}
                onChange={(e) => updateCard(card.id, e.target.value)}
                onBlur={() => setEditingId(null)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    setEditingId(null);
                  }
                }}
                className="flex-1 bg-transparent text-warm-white text-sm outline-none resize-none min-h-[40px]"
                autoFocus
                rows={2}
              />
            ) : (
              <p
                className="flex-1 text-warm-white text-sm cursor-pointer hover:text-warm-white/80 transition-colors"
                onClick={() => setEditingId(card.id)}
              >
                {card.text}
              </p>
            )}

            <button
              type="button"
              onClick={() => setEditingId(card.id)}
              className="text-warm-muted/20 hover:text-warm-muted transition-colors opacity-0 group-hover:opacity-100 mt-0.5"
              aria-label="Edit card"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M10.5 1.5l2 2-8 8H2.5v-2l8-8z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
