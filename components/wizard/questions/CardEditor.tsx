"use client";

import { useState } from "react";
import type { Question, CardEntry } from "@/lib/wizard-types";

interface CardEditorProps {
  question: Question;
  value: CardEntry[];
  onChange: (value: CardEntry[]) => void;
  onRegenerate?: () => void;
}

// Stub: generate mock cards if none exist
function generateMockCards(count: number): CardEntry[] {
  const effects = [
    "Collect 200 from the bank",
    "Pay 50 to the bank",
    "Move forward 3 spaces",
    "Move back 2 spaces",
    "Collect 100 from each player",
    "Go directly to jail",
    "Get out of jail free",
    "Pay 25 per house you own",
    "Swap positions with any player",
    "You are immune to rent for 1 turn",
    "Next property at 50% off",
    "Steal 75 from any player",
    "Collect 150 from the bank",
    "Pay 100 to the bank",
    "Advance to the nearest station",
    "Collect 25% of all rent for 2 rounds",
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `card_${i + 1}`,
    text: effects[i % effects.length],
    effect: effects[i % effects.length],
  }));
}

export default function CardEditor({
  question,
  value,
  onChange,
  onRegenerate,
}: CardEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  // Auto-populate with mock cards if empty
  const cards = value.length > 0 ? value : generateMockCards(16);
  if (value.length === 0) {
    // Trigger initial population
    setTimeout(() => onChange(cards), 0);
  }

  function updateCard(id: string, text: string) {
    onChange(cards.map((c) => (c.id === id ? { ...c, text } : c)));
  }

  return (
    <div>
      {/* Header with regenerate */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-warm-muted text-xs">
          {cards.length} cards
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
        {cards.map((card, i) => (
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
