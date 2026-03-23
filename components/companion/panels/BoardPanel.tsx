"use client";

import type { GameInstance } from "@/lib/load-instance";

interface BoardPanelProps {
  instance: GameInstance;
}

const COLOUR_MAP: Record<string, string> = {
  brown: "#8B5E3C",
  light_blue: "#6AABBF",
  pink: "#DB7093",
  orange: "#FF8C00",
  red: "#DC143C",
  yellow: "#FFD700",
  green: "#228B22",
  dark_blue: "#191970",
};

const TYPE_LABELS: Record<string, string> = {
  go: "GO",
  property: "Property",
  treasury: "Treasury",
  tax: "Tax",
  station: "Station",
  chance: "Chance",
  jail: "Jail",
  utility: "Utility",
  free_parking: "Free Parking",
  go_to_jail: "Go to Jail",
};

function getBoardSide(position: number): string {
  if (position <= 9) return "Bottom";
  if (position <= 19) return "Left";
  if (position <= 29) return "Top";
  return "Right";
}

export default function BoardPanel({ instance }: BoardPanelProps) {
  const sides = ["Bottom", "Left", "Top", "Right"];

  return (
    <div>
      <h2 className="font-display text-lg text-warm-white mb-4">Game Board</h2>
      <p className="text-warm-muted text-xs mb-6">
        {instance.board.total_spaces} spaces around the board
      </p>

      {sides.map((side) => {
        const spaces = instance.board.spaces.filter(
          (s) => getBoardSide(s.position) === side
        );

        return (
          <div key={side} className="mb-6">
            <h3 className="text-warm-muted/50 text-[10px] uppercase tracking-widest mb-2">
              {side} Side
            </h3>
            <div className="space-y-1">
              {spaces.map((space) => (
                <div
                  key={space.position}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg bg-surface/50 border border-warm-border/30"
                >
                  <span className="text-warm-muted/30 text-xs w-5 text-right flex-shrink-0">
                    {space.position}
                  </span>

                  {space.colour_group && (
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: COLOUR_MAP[space.colour_group] ?? "#888" }}
                    />
                  )}
                  {!space.colour_group && <span className="w-2.5 flex-shrink-0" />}

                  <span className="text-warm-white text-sm flex-1">
                    {space.name}
                  </span>

                  <span className="text-warm-muted/40 text-[10px] uppercase">
                    {TYPE_LABELS[space.type] ?? space.type}
                  </span>

                  {space.price && (
                    <span className="text-warm-muted text-xs">
                      {instance.identity.currency_symbol}{space.price}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
