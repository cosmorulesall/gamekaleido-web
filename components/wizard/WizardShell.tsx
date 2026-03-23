"use client";

import Kaleidoscope from "@/components/kaleidoscope/Kaleidoscope";
import WizardProgress from "./WizardProgress";
import type { WizardConfig, WizardMode } from "@/lib/wizard-types";

interface WizardShellProps {
  config: WizardConfig;
  currentSectionIndex: number;
  mode: WizardMode;
  isPreview: boolean;
  pulse: number;
  showSaveStatus?: boolean;
  children: React.ReactNode;
}

export default function WizardShell({
  config,
  currentSectionIndex,
  mode,
  isPreview,
  pulse,
  showSaveStatus,
  children,
}: WizardShellProps) {
  return (
    <div className="relative min-h-dvh w-full overflow-hidden">
      {/* Background — kaleidoscope ambient */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[800px] opacity-20">
          <Kaleidoscope className="w-full h-full" pulse={pulse} />
        </div>
      </div>

      {/* Atmospheric gradient overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(13,11,16,0.7) 50%, rgba(13,11,16,0.95) 100%)",
        }}
      />

      {/* Content layer */}
      <div className="relative z-10 min-h-dvh flex flex-col items-center px-4 py-8 sm:py-12">
        {/* Brand mark */}
        <div className="mb-6">
          <p className="font-display text-lg text-warm-muted/40 tracking-wide">
            Gamekaleido
          </p>
        </div>

        {/* Progress */}
        <div className="w-full max-w-xl mb-8">
          <WizardProgress
            config={config}
            currentSectionIndex={currentSectionIndex}
            mode={mode}
            isPreview={isPreview}
          />
        </div>

        {/* Main panel */}
        <div className="glass-panel w-full max-w-xl p-8 sm:p-10 flex-1 flex flex-col min-h-[400px]">
          {children}
        </div>

        {/* Footer */}
        {showSaveStatus && (
          <p className="mt-8 text-warm-muted/20 text-xs">
            Your progress is saved automatically
          </p>
        )}
      </div>
    </div>
  );
}
