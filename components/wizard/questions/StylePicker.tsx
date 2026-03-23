"use client";

import { useState, useEffect } from "react";
import type { Question } from "@/lib/wizard-types";

interface StylePickerProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

const FREEFORM_PREFIX = "__freeform__:";
const FREEFORM_SENTINEL = "__freeform__";

// Visual style thumbnails — abstract gradient-based placeholders per style
const STYLE_VISUALS: Record<string, { gradient: string; icon: string }> = {
  retro_vintage: {
    gradient: "from-amber-900/40 via-orange-800/30 to-yellow-900/20",
    icon: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25",
  },
  modern_minimal: {
    gradient: "from-zinc-800/40 via-neutral-700/30 to-stone-800/20",
    icon: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z",
  },
  illustrated: {
    gradient: "from-teal-800/40 via-emerald-700/30 to-green-900/20",
    icon: "M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42",
  },
  cinematic: {
    gradient: "from-violet-900/40 via-purple-800/30 to-indigo-900/20",
    icon: "M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0118 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 016 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125-.504-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125m1.5 3.75c-.621 0-1.125-.504-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125",
  },
  playful_cartoon: {
    gradient: "from-pink-800/40 via-rose-700/30 to-red-900/20",
    icon: "M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z",
  },
  elegant_luxury: {
    gradient: "from-yellow-900/40 via-amber-800/30 to-orange-900/20",
    icon: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z",
  },
};

export default function StylePicker({
  question,
  value,
  onChange,
}: StylePickerProps) {
  const [freeform, setFreeform] = useState(() =>
    value.startsWith(FREEFORM_PREFIX) ? value.slice(FREEFORM_PREFIX.length) : ""
  );
  const isFreeformActive = value === FREEFORM_SENTINEL || value.startsWith(FREEFORM_PREFIX);

  useEffect(() => {
    if (value.startsWith(FREEFORM_PREFIX)) {
      setFreeform(value.slice(FREEFORM_PREFIX.length));
    } else if (!value.startsWith(FREEFORM_SENTINEL)) {
      setFreeform("");
    }
  }, [value]);

  return (
    <div>
      {/* Style grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {question.options?.map((option) => {
          const visual = STYLE_VISUALS[option.value] ?? {
            gradient: "from-gray-800/40 to-gray-900/20",
            icon: "",
          };
          const isSelected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setFreeform("");
              }}
              className={`group relative rounded-xl overflow-hidden border transition-all duration-300 ${
                isSelected
                  ? "border-amber/40 ring-1 ring-amber/20"
                  : "border-warm-border hover:border-warm-border/50"
              }`}
            >
              {/* Visual area */}
              <div
                className={`h-24 bg-gradient-to-br ${visual.gradient} flex items-center justify-center`}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className={`transition-colors ${
                    isSelected ? "text-amber-light" : "text-warm-muted/40"
                  }`}
                >
                  <path d={visual.icon} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Label */}
              <div className="px-3 py-3 bg-surface">
                <p
                  className={`text-sm font-medium ${
                    isSelected ? "text-warm-white" : "text-warm-muted"
                  }`}
                >
                  {option.label}
                </p>
                <p className="text-xs text-warm-muted/50 mt-0.5">
                  {option.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Freeform option */}
      {question.allow_freeform && (
        <div className="mt-4">
          <label className="text-warm-muted text-sm block mb-2">
            {question.freeform_label ?? "Or describe it in your own words"}
          </label>
          <input
            type="text"
            value={freeform}
            onChange={(e) => {
              setFreeform(e.target.value);
              onChange(e.target.value ? `${FREEFORM_PREFIX}${e.target.value}` : "");
            }}
            onFocus={() => {
              if (freeform) onChange(`${FREEFORM_PREFIX}${freeform}`);
            }}
            placeholder={question.freeform_placeholder}
            className={`glass-input ${isFreeformActive ? "border-amber/30" : ""}`}
          />
        </div>
      )}
    </div>
  );
}
