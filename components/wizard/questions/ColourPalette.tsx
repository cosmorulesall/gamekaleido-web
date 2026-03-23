"use client";

import { useState } from "react";
import type { Question } from "@/lib/wizard-types";

interface ColourPaletteProps {
  question: Question;
  value: string[];
  onChange: (value: string[]) => void;
}

// Curated swatch palette — jewel tones + versatile options
const SWATCHES = [
  { hex: "#9B1B30", name: "Crimson" },
  { hex: "#C62B45", name: "Rose" },
  { hex: "#D4820A", name: "Amber" },
  { hex: "#F0A030", name: "Gold" },
  { hex: "#1A7A7A", name: "Teal" },
  { hex: "#2AA0A0", name: "Aqua" },
  { hex: "#5B2D8E", name: "Violet" },
  { hex: "#7B45B5", name: "Lavender" },
  { hex: "#1D4ED8", name: "Royal Blue" },
  { hex: "#059669", name: "Emerald" },
  { hex: "#DC2626", name: "Red" },
  { hex: "#EA580C", name: "Burnt Orange" },
  { hex: "#CA8A04", name: "Ochre" },
  { hex: "#16A34A", name: "Green" },
  { hex: "#4F46E5", name: "Indigo" },
  { hex: "#DB2777", name: "Pink" },
  { hex: "#0D0B10", name: "Obsidian" },
  { hex: "#F5F0EB", name: "Ivory" },
];

export default function ColourPalette({
  question,
  value,
  onChange,
}: ColourPaletteProps) {
  const [hexInput, setHexInput] = useState("");
  const max = question.max_selections ?? 3;

  function toggleColour(hex: string) {
    if (value.includes(hex)) {
      onChange(value.filter((c) => c !== hex));
    } else if (value.length < max) {
      onChange([...value, hex]);
    }
  }

  function addHex() {
    const hex = hexInput.trim().toUpperCase();
    if (!hex.match(/^#?[0-9A-F]{6}$/)) return;
    const normalized = hex.startsWith("#") ? hex : `#${hex}`;
    if (value.includes(normalized)) return;
    if (value.length >= max) return;

    onChange([...value, normalized]);
    setHexInput("");
  }

  return (
    <div>
      {/* Selected colours */}
      {value.length > 0 && (
        <div className="flex gap-3 mb-6">
          {value.map((hex) => (
            <button
              key={hex}
              type="button"
              onClick={() => toggleColour(hex)}
              className="group flex flex-col items-center gap-1.5"
            >
              <div
                className="w-12 h-12 rounded-lg border-2 border-warm-white/20 shadow-lg transition-transform group-hover:scale-110"
                style={{ backgroundColor: hex }}
              />
              <span className="text-[10px] text-warm-muted uppercase tracking-wider">
                {hex}
              </span>
            </button>
          ))}
          {value.length < max && (
            <div className="w-12 h-12 rounded-lg border border-dashed border-warm-border flex items-center justify-center">
              <span className="text-warm-muted/30 text-lg">+</span>
            </div>
          )}
        </div>
      )}

      {/* Swatch grid */}
      <div className="grid grid-cols-6 sm:grid-cols-9 gap-2 mb-6">
        {SWATCHES.map((swatch) => {
          const isSelected = value.includes(swatch.hex);
          return (
            <button
              key={swatch.hex}
              type="button"
              onClick={() => toggleColour(swatch.hex)}
              title={swatch.name}
              disabled={!isSelected && value.length >= max}
              className={`w-full aspect-square rounded-lg transition-all duration-200 border-2 ${
                isSelected
                  ? "border-warm-white/40 scale-110 shadow-lg"
                  : "border-transparent hover:border-warm-white/10 disabled:opacity-30"
              }`}
              style={{ backgroundColor: swatch.hex }}
            />
          );
        })}
      </div>

      {/* Hex input */}
      {question.show_hex_input && (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-muted text-sm">
              #
            </span>
            <input
              type="text"
              value={hexInput}
              onChange={(e) => setHexInput(e.target.value.replace(/[^0-9a-fA-F#]/g, ""))}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addHex())}
              placeholder="Custom hex code"
              maxLength={7}
              className="glass-input pl-7"
            />
          </div>
          <button
            type="button"
            onClick={addHex}
            disabled={value.length >= max}
            className="btn-ghost px-4"
          >
            Add
          </button>
        </div>
      )}

      <p className="text-warm-muted/50 text-xs mt-3">
        {value.length} / {max} colours selected
      </p>
    </div>
  );
}
