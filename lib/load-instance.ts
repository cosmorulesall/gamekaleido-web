import fs from "fs";
import path from "path";

export interface GameInstance {
  meta: { archetype: string; order_id: string; created_at: string };
  identity: { game_name: string; tagline: string; currency_name: string; currency_symbol: string };
  players: string[];
  board: { total_spaces: number; spaces: BoardSpace[] };
  card_decks: Record<string, CardDeck>;
  game_rules: GameRules;
  colour_groups: Record<string, ColourGroup>;
}

export interface BoardSpace {
  position: number;
  type: string;
  name: string;
  colour_group?: string;
  price?: number;
  rent?: number[];
  amount?: number;
  mortgage?: number;
}

export interface CardDeck {
  name: string;
  cards: GameCard[];
}

export interface GameCard {
  id: string;
  text: string;
  effect: string;
  params: Record<string, unknown>;
}

export interface GameRules {
  starting_money: number;
  go_collect: number;
  jail_fine: number;
  jail_turns_max: number;
  doubles_roll_again: boolean;
  three_doubles_go_to_jail: boolean;
  max_houses_per_property: number;
  houses_before_hotel: number;
  house_limit_total: number;
  hotel_limit_total: number;
  auction_on_decline: boolean;
  monopoly_rent_multiplier: number;
  station_base_rent: number;
  utility_multiplier_one: number;
  utility_multiplier_two: number;
  house_rules: { free_parking_pot: boolean; no_auctions: boolean };
}

export interface ColourGroup {
  colour: string;
  properties: number[];
  house_cost: number;
  hotel_cost: number;
}

export function loadGameInstance(slug: string): GameInstance | null {
  // For now, load from demo files. In production, fetch from API.
  const demoPath = path.join(process.cwd(), "data", "demo", `${slug}.json`);
  try {
    const raw = fs.readFileSync(demoPath, "utf8");
    return JSON.parse(raw) as GameInstance;
  } catch {
    return null;
  }
}

export function getAvailableDemos(): string[] {
  const demoDir = path.join(process.cwd(), "data", "demo");
  try {
    return fs.readdirSync(demoDir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(".json", ""));
  } catch {
    return [];
  }
}
