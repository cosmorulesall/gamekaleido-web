"use client";

import type { GameInstance } from "@/lib/load-instance";

interface TrackerPanelProps {
  instance: GameInstance;
}

const PLAYER_COLOURS = ["#DC143C", "#4169E1", "#228B22", "#FFD700", "#FF8C00", "#8B008B"];

export default function TrackerPanel({ instance }: TrackerPanelProps) {
  return (
    <div>
      <h2 className="font-display text-lg text-warm-white mb-4">Player Tracker</h2>
      <p className="text-warm-muted text-xs mb-6">
        {instance.players.length} players &middot; Starting balance: {instance.identity.currency_symbol}{instance.game_rules.starting_money}
      </p>

      <div className="space-y-3">
        {instance.players.map((name, i) => (
          <div
            key={name}
            className="flex items-center gap-4 px-4 py-3 rounded-lg bg-surface/50 border border-warm-border/30"
          >
            {/* Player colour dot */}
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: PLAYER_COLOURS[i % PLAYER_COLOURS.length] }}
            />

            {/* Name */}
            <span className="text-warm-white text-sm flex-1">{name}</span>

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs">
              <div className="text-center">
                <p className="text-warm-muted/50">Balance</p>
                <p className="text-warm-white">
                  {instance.identity.currency_symbol}{instance.game_rules.starting_money}
                </p>
              </div>
              <div className="text-center">
                <p className="text-warm-muted/50">Position</p>
                <p className="text-warm-white">GO</p>
              </div>
              <div className="text-center">
                <p className="text-warm-muted/50">Properties</p>
                <p className="text-warm-white">0</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-warm-muted/30 text-xs mt-6 text-center">
        Player tracking will update live once the game engine is connected
      </p>
    </div>
  );
}
