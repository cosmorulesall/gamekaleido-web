"use client";

import type { Question } from "@/lib/wizard-types";

interface CategoryNameEditorProps {
  question: Question;
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
}

const CATEGORIES = [
  { id: "personal", default_label: "All About Us", colour: "#DB7093" },
  { id: "pop_culture", default_label: "Pop Culture", colour: "#FFD700" },
  { id: "history_and_places", default_label: "History & Places", colour: "#4169E1" },
  { id: "science_and_nature", default_label: "Science & Nature", colour: "#228B22" },
  { id: "sports_and_leisure", default_label: "Sports & Leisure", colour: "#FF8C00" },
  { id: "food_and_drink", default_label: "Food & Drink", colour: "#8B008B" },
];

export default function CategoryNameEditor({
  question,
  value,
  onChange,
}: CategoryNameEditorProps) {
  function handleChange(categoryId: string, name: string) {
    onChange({ ...value, [categoryId]: name });
  }

  return (
    <div className="space-y-3">
      {CATEGORIES.map((cat) => (
        <div key={cat.id} className="flex items-center gap-3">
          <div
            className="w-4 h-4 rounded-full flex-shrink-0"
            style={{ backgroundColor: cat.colour }}
          />
          <input
            type="text"
            value={value[cat.id] ?? ""}
            onChange={(e) => handleChange(cat.id, e.target.value)}
            placeholder={cat.default_label}
            className="glass-input flex-1"
          />
        </div>
      ))}
    </div>
  );
}
