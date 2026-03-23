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
  const shows: (string | Record<string, number>)[] = preview.shows ?? [];

  const gameName =
    (answers["personalisation.board_name"] as string) ??
    (answers["personalisation.game_name"] as string) ??
    "Your Game";
  const theme = (answers["personalisation.theme"] as string) ?? "";
  const edition = state.edition === "digital" ? "Digital" : "Physical";

  // Check if board render is in shows
  const showBoardPlaceholder = shows.some(
    (item) => typeof item === "string" && item === "one_quadrant_board_render"
  );

  // Resolve data-driven items (excluding board render, handled separately)
  const resolvedItems = shows
    .map((item) => resolvePreviewItem(item, answers))
    .filter((r): r is { label: string; value: React.ReactNode } => r !== null);

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

        {/* Always-present rows: edition and theme */}
        <div className="grid grid-cols-2 gap-y-4 gap-x-6 mb-6">
          {theme && <DetailRow label="Theme" value={theme} />}
          <DetailRow label="Edition" value={`${edition} Edition`} />

          {/* Data-driven rows */}
          {resolvedItems.map((item, i) => (
            <PreviewItem key={i} label={item.label} value={item.value} />
          ))}
        </div>

        {/* Placeholder board render area */}
        {showBoardPlaceholder && (
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
                Board preview available after payment
              </p>
            </div>
          </div>
        )}
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

function resolvePreviewItem(
  item: string | Record<string, number>,
  answers: Record<string, unknown>
): { label: string; value: React.ReactNode } | null {
  if (typeof item === "object") {
    const key = Object.keys(item)[0];
    if (key === "sample_personal_questions") {
      const count = item[key];
      const questions = answers["personalisation.questions"] as
        | Record<string, Array<{ text: string }>>
        | undefined;
      const personal = questions?.personal?.slice(0, count);
      if (!personal || personal.length === 0) return null;
      return {
        label: "Sample Questions",
        value: (
          <ul className="text-warm-white text-sm space-y-1">
            {personal.map((q, i) => (
              <li key={i} className="text-warm-muted text-xs">
                &ldquo;{q.text}&rdquo;
              </li>
            ))}
          </ul>
        ),
      };
    }
    return null;
  }

  switch (item) {
    case "game_name":
      return {
        label: "Game Name",
        value:
          (answers["personalisation.board_name"] as string) ??
          (answers["personalisation.game_name"] as string) ??
          "Your Game",
      };
    case "currency_name": {
      const currency = answers["personalisation.currency_name"] as string;
      return currency ? { label: "Currency", value: currency } : null;
    }
    case "player_count": {
      const players = answers["personalisation.player_names"] as
        | string[]
        | undefined;
      return {
        label: "Players",
        value: `${players?.length ?? 0} players`,
      };
    }
    case "property_count_confirmed":
      return { label: "Properties", value: "22 personalised properties" };
    case "card_count_confirmed": {
      const chance = (answers["personalisation.chance_cards"] as unknown[])
        ?.length ?? 16;
      const treasury = (answers["personalisation.treasury_cards"] as unknown[])
        ?.length ?? 16;
      return {
        label: "Cards",
        value: `${chance + treasury} cards (${chance} Chance + ${treasury} Treasury)`,
      };
    }
    case "question_count_confirmed": {
      const qs = answers["personalisation.questions"] as
        | Record<string, unknown[]>
        | undefined;
      const total = qs
        ? Object.values(qs).reduce((sum, arr) => sum + arr.length, 0)
        : 0;
      return {
        label: "Questions",
        value: `${total} questions across 6 categories`,
      };
    }
    case "category_names_with_colours": {
      const names = answers["personalisation.category_names"] as
        | Record<string, string>
        | undefined;
      if (!names) return null;
      const defaultColours: Record<string, string> = {
        personal: "#DB7093",
        pop_culture: "#FFD700",
        history_and_places: "#4169E1",
        science_and_nature: "#228B22",
        sports_and_leisure: "#FF8C00",
        food_and_drink: "#8B008B",
      };
      return {
        label: "Categories",
        value: (
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(names).map(([id, name]) => (
              <span
                key={id}
                className="text-xs px-2 py-0.5 rounded-full border"
                style={{
                  borderColor: `${defaultColours[id] ?? "#888"}40`,
                  color: defaultColours[id] ?? "#888",
                  background: `${defaultColours[id] ?? "#888"}10`,
                }}
              >
                {name}
              </span>
            ))}
          </div>
        ),
      };
    }
    case "one_quadrant_board_render":
      return null; // Handled separately as placeholder
    default:
      return null;
  }
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

function PreviewItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-warm-muted/50 text-xs uppercase tracking-wider mb-0.5">
        {label}
      </p>
      <div className="text-warm-white text-sm">{value}</div>
    </div>
  );
}
