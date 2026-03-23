"use client";

import { useState } from "react";
import type { Question, TriviaQuestion } from "@/lib/wizard-types";

interface QuestionEditorProps {
  question: Question;
  value: Record<string, TriviaQuestion[]>;
  onChange: (value: Record<string, TriviaQuestion[]>) => void;
  onRegenerateCategory?: (categoryId: string) => void;
}

const CATEGORIES = [
  { id: "personal", label: "Personal", colour: "#DB7093" },
  { id: "pop_culture", label: "Pop Culture", colour: "#FFD700" },
  { id: "history_and_places", label: "History & Places", colour: "#4169E1" },
  { id: "science_and_nature", label: "Science & Nature", colour: "#228B22" },
  { id: "sports_and_leisure", label: "Sports & Leisure", colour: "#FF8C00" },
  { id: "food_and_drink", label: "Food & Drink", colour: "#8B008B" },
];

// Stub: generate mock questions
function generateMockQuestions(categoryId: string): TriviaQuestion[] {
  return Array.from({ length: 5 }, (_, i) => ({
    id: `${categoryId}_q${i + 1}`,
    category: categoryId,
    text: `Sample ${categoryId.replace(/_/g, " ")} question ${i + 1}?`,
    options: ["Option A", "Option B", "Option C", "Option D"],
    correct_answer: 0,
    difficulty: i < 2 ? "easy" : i < 4 ? "medium" : "hard",
    fun_fact: "This is a fun fact that appears after the answer is revealed.",
  }));
}

export default function QuestionEditor({
  question,
  value,
  onChange,
  onRegenerateCategory,
}: QuestionEditorProps) {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [editingQ, setEditingQ] = useState<string | null>(null);

  // Auto-populate with mocks if empty
  const questions = Object.keys(value).length > 0
    ? value
    : CATEGORIES.reduce((acc, cat) => {
        acc[cat.id] = generateMockQuestions(cat.id);
        return acc;
      }, {} as Record<string, TriviaQuestion[]>);

  if (Object.keys(value).length === 0) {
    setTimeout(() => onChange(questions), 0);
  }

  const activeQuestions = questions[activeCategory] ?? [];

  function updateQuestion(qId: string, text: string) {
    const updated = { ...questions };
    updated[activeCategory] = activeQuestions.map((q) =>
      q.id === qId ? { ...q, text } : q
    );
    onChange(updated);
  }

  return (
    <div>
      {/* Category tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-2 -mx-1 px-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? "bg-warm-white/10 text-warm-white"
                : "text-warm-muted hover:text-warm-white/70"
            }`}
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: cat.colour }}
            />
            {cat.label}
            <span className="text-warm-muted/40">
              ({(questions[cat.id] ?? []).length})
            </span>
          </button>
        ))}
      </div>

      {/* Regenerate category */}
      <div className="flex justify-end mb-3">
        {onRegenerateCategory && (
          <button
            type="button"
            onClick={() => onRegenerateCategory(activeCategory)}
            className="btn-generate text-xs"
          >
            Regenerate Category
          </button>
        )}
      </div>

      {/* Questions list */}
      <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
        {activeQuestions.map((q, i) => (
          <div
            key={q.id}
            className="px-4 py-3 rounded-lg bg-surface border border-warm-border group"
          >
            <div className="flex items-start gap-3">
              <span className="text-warm-muted/30 text-xs mt-0.5 w-5 flex-shrink-0">
                {i + 1}
              </span>

              {editingQ === q.id ? (
                <textarea
                  value={q.text}
                  onChange={(e) => updateQuestion(q.id, e.target.value)}
                  onBlur={() => setEditingQ(null)}
                  className="flex-1 bg-transparent text-warm-white text-sm outline-none resize-none"
                  autoFocus
                  rows={2}
                />
              ) : (
                <p
                  className="flex-1 text-warm-white text-sm cursor-pointer"
                  onClick={() => setEditingQ(q.id)}
                >
                  {q.text}
                </p>
              )}

              <span
                className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${
                  q.difficulty === "easy"
                    ? "text-green-400/60 bg-green-400/5"
                    : q.difficulty === "hard"
                    ? "text-red-400/60 bg-red-400/5"
                    : "text-yellow-400/60 bg-yellow-400/5"
                }`}
              >
                {q.difficulty}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
