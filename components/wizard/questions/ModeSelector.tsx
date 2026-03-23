"use client";

import type { Question, WizardMode } from "@/lib/wizard-types";

interface ModeSelectorProps {
  question: Question;
  value: WizardMode;
  onChange: (value: WizardMode) => void;
}

export default function ModeSelector({
  question,
  value,
  onChange,
}: ModeSelectorProps) {
  return (
    <div className="grid gap-4 max-w-xl">
      {question.options?.map((option) => {
        const isSelected = value === option.value;
        const isRecommended = option.sublabel?.includes("Recommended") || option.sublabel?.includes("⭐");

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value as WizardMode)}
            className={`relative text-left px-6 py-5 rounded-xl transition-all duration-300 border ${
              isSelected
                ? "border-amber/50 bg-amber/8 shadow-glow"
                : "border-warm-border bg-transparent hover:border-warm-border/50"
            }`}
          >
            {isRecommended && !isSelected && (
              <span className="absolute -top-2.5 right-4 text-[10px] tracking-wider uppercase font-medium px-2 py-0.5 rounded-full bg-amber/15 text-amber-light border border-amber/20">
                Recommended
              </span>
            )}

            <div className="flex items-start gap-4">
              {/* Radio indicator */}
              <span
                className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                  isSelected
                    ? "border-amber bg-amber"
                    : "border-warm-muted/30"
                }`}
              >
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-obsidian" />
                )}
              </span>

              <div>
                <span className={`text-base font-medium block ${
                  isSelected ? "text-warm-white" : "text-warm-muted"
                }`}>
                  {option.label}
                </span>
                {option.sublabel && (
                  <span className="block text-sm text-warm-muted/60 mt-1 leading-relaxed">
                    {option.sublabel.replace(" ⭐", "")}
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
