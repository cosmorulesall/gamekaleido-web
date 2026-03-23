"use client";

import type { GameInstance } from "@/lib/load-instance";

interface CardsPanelProps {
  instance: GameInstance;
}

export default function CardsPanel({ instance }: CardsPanelProps) {
  return (
    <div>
      <h2 className="font-display text-lg text-warm-white mb-4">Card Decks</h2>

      {Object.entries(instance.card_decks).map(([deckId, deck]) => (
        <div key={deckId} className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-warm-white text-sm font-medium">
              {deck.name}
            </h3>
            <span className="text-warm-muted/50 text-xs">
              {deck.cards.length} cards
            </span>
          </div>

          {/* Draw button — disabled, needs game engine */}
          <button
            type="button"
            disabled
            className="w-full py-3 rounded-lg bg-surface border border-warm-border text-warm-muted text-sm mb-3 cursor-not-allowed opacity-50"
          >
            Draw a card
          </button>

          {/* Last drawn card — empty state */}
          <div className="px-4 py-6 rounded-lg bg-surface/50 border border-warm-border/30 text-center">
            <p className="text-warm-muted/40 text-xs">
              No card drawn yet
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
