"use client";

import { motion } from "framer-motion";
import type { Edition } from "@/lib/wizard-types";

interface EditionPickerProps {
  onSelect: (edition: Edition) => void;
}

const editions = [
  {
    id: "digital" as Edition,
    title: "Digital Edition",
    price: "~£40",
    description:
      "Interactive companion page with game assistant, card decks, dice roller, and tracker. Board PDF included as a bonus download.",
    features: [
      "Companion page (unique URL)",
      "Interactive card decks & dice",
      "Game assistant with notifications",
      "Print-ready board PDF",
    ],
    accent: "teal",
  },
  {
    id: "physical" as Edition,
    title: "Physical Edition",
    price: "£150+",
    description:
      "The full experience — a premium, printed board game manufactured and shipped to your door. Plus everything in the Digital Edition.",
    features: [
      "Everything in Digital, plus:",
      "Printed game board (quad-fold)",
      "Full card decks & money set",
      "Player tokens, houses & hotels",
    ],
    accent: "amber",
  },
];

export default function EditionPicker({ onSelect }: EditionPickerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col items-center text-center"
    >
      <h1 className="font-display text-display-lg text-warm-white mb-3">
        Choose your edition
      </h1>
      <p className="text-warm-muted text-sm mb-10 max-w-md">
        Both editions include a fully personalised game. Pick what suits you
        best — you can always upgrade later.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl">
        {editions.map((ed) => (
          <button
            key={ed.id}
            type="button"
            onClick={() => onSelect(ed.id)}
            className="glass-panel p-6 text-left hover:shadow-glass-hover transition-all duration-300 group cursor-pointer"
          >
            {/* Price badge */}
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-display text-xl text-warm-white">
                {ed.title}
              </h3>
              <span
                className={`text-sm font-medium px-2.5 py-1 rounded-md ${
                  ed.accent === "teal"
                    ? "bg-teal/10 text-teal-light border border-teal/20"
                    : "bg-amber/10 text-amber-light border border-amber/20"
                }`}
              >
                {ed.price}
              </span>
            </div>

            <p className="text-warm-muted text-sm leading-relaxed mb-5">
              {ed.description}
            </p>

            {/* Features */}
            <ul className="space-y-2 mb-6">
              {ed.features.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-warm-muted/70 text-sm"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    className={`mt-0.5 flex-shrink-0 ${
                      ed.accent === "teal" ? "text-teal-light" : "text-amber-light"
                    }`}
                  >
                    <path
                      d="M3 7l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div
              className={`w-full py-3 rounded-lg text-center text-sm font-medium transition-all duration-200 ${
                ed.accent === "teal"
                  ? "bg-teal/10 text-teal-light border border-teal/20 group-hover:bg-teal/20"
                  : "bg-amber/10 text-amber-light border border-amber/20 group-hover:bg-amber/20"
              }`}
            >
              Select {ed.title.split(" ")[0]}
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
