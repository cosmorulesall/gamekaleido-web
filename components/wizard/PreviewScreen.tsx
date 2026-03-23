"use client";

import { motion } from "framer-motion";
import type { WizardConfig, WizardState } from "@/lib/wizard-types";

interface PreviewScreenProps {
  config: WizardConfig;
  state: WizardState;
  onEdit: () => void;
  onConfirm: () => void;
}

export default function PreviewScreen({
  config,
  state,
  onEdit,
  onConfirm,
}: PreviewScreenProps) {
  const answers = state.answers;
  const preview = config.preview;

  // Extract key answers for display
  const gameName =
    (answers["personalisation.board_name"] as string) ??
    (answers["personalisation.game_name"] as string) ??
    "Your Game";
  const theme = (answers["personalisation.theme"] as string) ?? "";
  const playerNames = (answers["personalisation.player_names"] as string[]) ?? [];
  const currency = (answers["personalisation.currency_name"] as string) ?? "";
  const edition = state.edition === "digital" ? "Digital" : "Physical";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col items-center text-center"
    >
      <h2 className="font-display text-display-lg text-warm-white mb-2">
        {preview.title}
      </h2>
      <p className="text-warm-muted text-sm mb-10 max-w-md">
        {preview.description}
      </p>

      {/* Preview card */}
      <div className="glass-panel p-8 w-full max-w-lg text-left mb-8">
        {/* Game name */}
        <h3 className="font-display text-2xl text-warm-white mb-6">
          {gameName}
        </h3>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-y-4 gap-x-6 mb-6">
          {theme && (
            <DetailRow label="Theme" value={theme} />
          )}
          {currency && (
            <DetailRow label="Currency" value={currency} />
          )}
          <DetailRow label="Edition" value={`${edition} Edition`} />
          <DetailRow
            label="Players"
            value={
              playerNames.length > 0
                ? `${playerNames.length} (${playerNames.slice(0, 3).join(", ")}${
                    playerNames.length > 3 ? "..." : ""
                  })`
                : "Not set"
            }
          />
        </div>

        {/* Placeholder board render area */}
        <div className="w-full aspect-video rounded-lg bg-obsidian/50 border border-warm-border flex items-center justify-center mb-4">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber/10 border border-amber/20 flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-amber-light"
              >
                <path
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V4.5a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v15a1.5 1.5 0 001.5 1.5z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-warm-muted/40 text-xs">
              Board preview will appear here
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button type="button" onClick={onEdit} className="btn-ghost">
          Go back and edit
        </button>
        <button type="button" onClick={onConfirm} className="btn-primary">
          {preview.cta_label}
        </button>
      </div>
    </motion.div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-warm-muted/50 text-xs uppercase tracking-wider mb-0.5">
        {label}
      </p>
      <p className="text-warm-white text-sm">{value}</p>
    </div>
  );
}
