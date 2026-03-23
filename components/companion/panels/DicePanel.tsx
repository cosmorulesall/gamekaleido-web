"use client";

import { useState } from "react";
import type { GameInstance } from "@/lib/load-instance";

interface DicePanelProps {
  instance: GameInstance;
}

function DieFace({ value }: { value: number }) {
  // 3x3 grid positions for each pip
  const pipPositions: Record<number, [number, number][]> = {
    1: [[1, 1]],
    2: [[0, 0], [2, 2]],
    3: [[0, 0], [1, 1], [2, 2]],
    4: [[0, 0], [0, 2], [2, 0], [2, 2]],
    5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
    6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
  };

  const pips = pipPositions[value] ?? [];

  return (
    <div className="w-20 h-20 rounded-xl bg-warm-white/10 border border-warm-border p-2.5 grid grid-cols-3 grid-rows-3 gap-1">
      {Array.from({ length: 9 }, (_, i) => {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const hasPip = pips.some(([r, c]) => r === row && c === col);
        return (
          <div key={i} className="flex items-center justify-center">
            {hasPip && (
              <div className="w-3 h-3 rounded-full bg-warm-white" />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function DicePanel({ instance }: DicePanelProps) {
  const [dice, setDice] = useState<[number, number] | null>(null);
  const [rolling, setRolling] = useState(false);

  function handleRoll() {
    setRolling(true);

    // Brief animation delay
    setTimeout(() => {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      setDice([d1, d2]);
      setRolling(false);
    }, 300);
  }

  const total = dice ? dice[0] + dice[1] : null;
  const isDoubles = dice ? dice[0] === dice[1] : false;

  return (
    <div className="flex flex-col items-center">
      <h2 className="font-display text-lg text-warm-white mb-6">Dice Roller</h2>

      {/* Dice display */}
      <div className="flex items-center gap-4 mb-6">
        {dice ? (
          <>
            <DieFace value={dice[0]} />
            <DieFace value={dice[1]} />
          </>
        ) : (
          <>
            <div className="w-20 h-20 rounded-xl bg-warm-white/5 border border-warm-border/30 flex items-center justify-center">
              <span className="text-warm-muted/20 text-2xl">?</span>
            </div>
            <div className="w-20 h-20 rounded-xl bg-warm-white/5 border border-warm-border/30 flex items-center justify-center">
              <span className="text-warm-muted/20 text-2xl">?</span>
            </div>
          </>
        )}
      </div>

      {/* Result */}
      {total !== null && (
        <div className="text-center mb-6">
          <p className="text-warm-white text-2xl font-display">{total}</p>
          {isDoubles && (
            <p className="text-amber text-sm mt-1">Doubles!</p>
          )}
        </div>
      )}

      {/* Roll button */}
      <button
        type="button"
        onClick={handleRoll}
        disabled={rolling}
        className="btn-primary px-8"
      >
        {rolling ? "Rolling..." : dice ? "Roll Again" : "Roll Dice"}
      </button>

      {/* Currency reminder */}
      <p className="text-warm-muted/30 text-xs mt-6">
        Currency: {instance.identity.currency_name} ({instance.identity.currency_symbol})
      </p>
    </div>
  );
}
