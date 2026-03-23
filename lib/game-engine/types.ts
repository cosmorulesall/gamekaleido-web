export interface PlayerState {
  name: string;
  position: number;
  money: number;
  in_jail: boolean;
  jail_turns: number;
  properties_owned: number[]; // space positions
  get_out_of_jail_cards: number;
  active_effects: ActiveEffect[];
  is_bankrupt: boolean;
}

export interface ActiveEffect {
  type: "rent_immunity" | "property_discount" | "collect_fraction_of_rents";
  turns_remaining: number;
  params?: Record<string, unknown>;
}

export interface PropertyState {
  owner: string | null; // player name or null
  houses: number;
  hotels: number;
  mortgaged: boolean;
}

export interface DeckState {
  remaining: number[]; // card indices
  discard: number[];
}

export interface GameState {
  players: PlayerState[];
  properties: Record<number, PropertyState>; // keyed by space position
  chance_deck: DeckState;
  treasury_deck: DeckState;
  free_parking_pot: number;
  current_player_index: number;
  doubles_count: number;
  last_dice: [number, number] | null;
  turn_phase: TurnPhase;
  pending_action: PendingAction | null;
  game_over: boolean;
  winner: string | null;
}

export type TurnPhase =
  | "pre_roll"
  | "post_roll"
  | "landed"
  | "awaiting_decision"
  | "turn_end";

export type PendingAction =
  | {
      type: "buy_property";
      position: number;
      price: number;
      discounted_price?: number;
    }
  | { type: "pay_rent"; position: number; amount: number; to: string }
  | {
      type: "choose_player";
      effect: string;
      card_id: string;
      params: Record<string, unknown>;
    }
  | { type: "jail_decision" }
  | { type: "auction"; position: number; starting_bid: number };

export interface GameEvent {
  type: string;
  message: string;
  data?: Record<string, unknown>;
}

export interface TurnResult {
  state: GameState;
  events: GameEvent[];
}
