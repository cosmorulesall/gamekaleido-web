"use client";

import type { GameInstance } from "@/lib/load-instance";

interface RulesPanelProps {
  instance: GameInstance;
}

function RuleRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-warm-border/20 last:border-0">
      <span className="text-warm-muted text-sm">{label}</span>
      <span className="text-warm-white text-sm">{value}</span>
    </div>
  );
}

export default function RulesPanel({ instance }: RulesPanelProps) {
  const rules = instance.game_rules;
  const sym = instance.identity.currency_symbol;

  return (
    <div>
      <h2 className="font-display text-lg text-warm-white mb-4">Game Rules</h2>

      {/* Money */}
      <div className="mb-6">
        <h3 className="text-warm-muted/50 text-[10px] uppercase tracking-widest mb-2">
          Money
        </h3>
        <div className="px-4 py-2 rounded-lg bg-surface/50 border border-warm-border/30">
          <RuleRow label="Starting money" value={`${sym}${rules.starting_money}`} />
          <RuleRow label="Pass GO collect" value={`${sym}${rules.go_collect}`} />
        </div>
      </div>

      {/* Jail */}
      <div className="mb-6">
        <h3 className="text-warm-muted/50 text-[10px] uppercase tracking-widest mb-2">
          Jail
        </h3>
        <div className="px-4 py-2 rounded-lg bg-surface/50 border border-warm-border/30">
          <RuleRow label="Jail fine" value={`${sym}${rules.jail_fine}`} />
          <RuleRow label="Max turns in jail" value={`${rules.jail_turns_max}`} />
          <RuleRow label="Doubles escape jail" value="Yes" />
        </div>
      </div>

      {/* Dice */}
      <div className="mb-6">
        <h3 className="text-warm-muted/50 text-[10px] uppercase tracking-widest mb-2">
          Dice
        </h3>
        <div className="px-4 py-2 rounded-lg bg-surface/50 border border-warm-border/30">
          <RuleRow label="Doubles roll again" value={rules.doubles_roll_again ? "Yes" : "No"} />
          <RuleRow label="Three doubles = jail" value={rules.three_doubles_go_to_jail ? "Yes" : "No"} />
        </div>
      </div>

      {/* Property */}
      <div className="mb-6">
        <h3 className="text-warm-muted/50 text-[10px] uppercase tracking-widest mb-2">
          Property
        </h3>
        <div className="px-4 py-2 rounded-lg bg-surface/50 border border-warm-border/30">
          <RuleRow label="Monopoly rent multiplier" value={`${rules.monopoly_rent_multiplier}x`} />
          <RuleRow label="Max houses per property" value={`${rules.max_houses_per_property}`} />
          <RuleRow label="Houses before hotel" value={`${rules.houses_before_hotel}`} />
          <RuleRow label="Total houses available" value={`${rules.house_limit_total}`} />
          <RuleRow label="Total hotels available" value={`${rules.hotel_limit_total}`} />
          <RuleRow label="Auction on decline" value={rules.auction_on_decline ? "Yes" : "No"} />
        </div>
      </div>

      {/* Stations & Utilities */}
      <div className="mb-6">
        <h3 className="text-warm-muted/50 text-[10px] uppercase tracking-widest mb-2">
          Stations &amp; Utilities
        </h3>
        <div className="px-4 py-2 rounded-lg bg-surface/50 border border-warm-border/30">
          <RuleRow label="Station base rent" value={`${sym}${rules.station_base_rent}`} />
          <RuleRow label="Utility (1 owned) multiplier" value={`${rules.utility_multiplier_one}x dice`} />
          <RuleRow label="Utility (2 owned) multiplier" value={`${rules.utility_multiplier_two}x dice`} />
        </div>
      </div>

      {/* House rules */}
      <div className="mb-2">
        <h3 className="text-warm-muted/50 text-[10px] uppercase tracking-widest mb-2">
          House Rules
        </h3>
        <div className="px-4 py-2 rounded-lg bg-surface/50 border border-warm-border/30">
          <RuleRow label="Free parking pot" value={rules.house_rules.free_parking_pot ? "On" : "Off"} />
          <RuleRow label="No auctions" value={rules.house_rules.no_auctions ? "On" : "Off"} />
        </div>
      </div>
    </div>
  );
}
