"use client";

import type { WizardConfig, WizardMode } from "@/lib/wizard-types";
import { getVisibleSections, calculateProgress } from "@/lib/wizard-engine";

interface WizardProgressProps {
  config: WizardConfig;
  currentSectionIndex: number;
  mode: WizardMode;
  isPreview: boolean;
}

export default function WizardProgress({
  config,
  currentSectionIndex,
  mode,
  isPreview,
}: WizardProgressProps) {
  const visibleSections = getVisibleSections(config, mode);
  const progress = calculateProgress(config, currentSectionIndex, mode, isPreview);
  const currentSection = config.sections[currentSectionIndex];

  return (
    <div className="w-full">
      {/* Section title */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-warm-muted text-xs tracking-wider uppercase">
          {isPreview ? "Preview" : currentSection?.title ?? ""}
        </p>
        <p className="text-warm-muted/40 text-xs">
          {Math.round(progress * 100)}%
        </p>
      </div>

      {/* Progress bar */}
      <div className="relative h-[2px] w-full bg-warm-border rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${progress * 100}%`,
            background: "linear-gradient(90deg, var(--crimson), var(--amber))",
          }}
        />
      </div>

      {/* Section dots */}
      <div className="flex gap-1.5 mt-3 justify-center">
        {visibleSections.map((section, i) => {
          const isActive = section.id === currentSection?.id;
          const isPast =
            visibleSections.findIndex((s) => s.id === currentSection?.id) > i;

          return (
            <div
              key={section.id}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                isActive
                  ? "bg-amber w-3"
                  : isPast
                  ? "bg-amber/40"
                  : "bg-warm-border"
              }`}
              title={section.title}
            />
          );
        })}
        {/* Preview dot */}
        <div
          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
            isPreview ? "bg-amber w-3" : "bg-warm-border"
          }`}
          title="Preview"
        />
      </div>
    </div>
  );
}
