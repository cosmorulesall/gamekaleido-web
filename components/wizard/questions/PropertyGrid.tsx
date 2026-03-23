"use client";

import type { Question } from "@/lib/wizard-types";

interface PropertyGridProps {
  question: Question;
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  onGenerateRemaining?: () => void;
}

// Property Trading colour groups with their spaces
const COLOUR_GROUPS = [
  {
    id: "brown",
    label: "Brown",
    colour: "#8B4513",
    slots: [
      { slot: 1, price: 60 },
      { slot: 2, price: 60 },
    ],
  },
  {
    id: "light_blue",
    label: "Light Blue",
    colour: "#87CEEB",
    slots: [
      { slot: 1, price: 100 },
      { slot: 2, price: 100 },
      { slot: 3, price: 120 },
    ],
  },
  {
    id: "pink",
    label: "Pink",
    colour: "#DB7093",
    slots: [
      { slot: 1, price: 140 },
      { slot: 2, price: 140 },
      { slot: 3, price: 160 },
    ],
  },
  {
    id: "orange",
    label: "Orange",
    colour: "#FF8C00",
    slots: [
      { slot: 1, price: 180 },
      { slot: 2, price: 180 },
      { slot: 3, price: 200 },
    ],
  },
  {
    id: "red",
    label: "Red",
    colour: "#DC143C",
    slots: [
      { slot: 1, price: 220 },
      { slot: 2, price: 220 },
      { slot: 3, price: 240 },
    ],
  },
  {
    id: "yellow",
    label: "Yellow",
    colour: "#FFD700",
    slots: [
      { slot: 1, price: 260 },
      { slot: 2, price: 260 },
      { slot: 3, price: 280 },
    ],
  },
  {
    id: "green",
    label: "Green",
    colour: "#228B22",
    slots: [
      { slot: 1, price: 300 },
      { slot: 2, price: 300 },
      { slot: 3, price: 320 },
    ],
  },
  {
    id: "dark_blue",
    label: "Dark Blue",
    colour: "#00008B",
    slots: [
      { slot: 1, price: 350 },
      { slot: 2, price: 400 },
    ],
  },
];

export default function PropertyGrid({
  question,
  value,
  onChange,
  onGenerateRemaining,
}: PropertyGridProps) {
  function handleChange(groupId: string, slot: number, name: string) {
    const key = `${groupId}_${slot}`;
    onChange({ ...value, [key]: name });
  }

  const filledCount = Object.values(value).filter((v) => v?.trim()).length;
  const totalSlots = COLOUR_GROUPS.reduce((sum, g) => sum + g.slots.length, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-warm-muted text-xs">
          {filledCount} / {totalSlots} properties named
        </p>
        {onGenerateRemaining && (
          <button
            type="button"
            onClick={onGenerateRemaining}
            className="btn-generate"
          >
            Generate Remaining
          </button>
        )}
      </div>

      {/* Grid by colour group */}
      <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
        {COLOUR_GROUPS.map((group) => (
          <div key={group.id}>
            {/* Group header */}
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-4 h-4 rounded-sm flex-shrink-0"
                style={{ backgroundColor: group.colour }}
              />
              <span className="text-warm-muted text-xs uppercase tracking-wider font-medium">
                {group.label}
              </span>
            </div>

            {/* Slots */}
            <div className="space-y-1.5">
              {group.slots.map((slot) => {
                const key = `${group.id}_${slot.slot}`;
                return (
                  <div key={key} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={value[key] ?? ""}
                      onChange={(e) =>
                        handleChange(group.id, slot.slot, e.target.value)
                      }
                      placeholder={`Property name...`}
                      className="glass-input flex-1 py-2 text-sm"
                    />
                    <span className="text-warm-muted/40 text-xs w-12 text-right flex-shrink-0">
                      {slot.price}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
