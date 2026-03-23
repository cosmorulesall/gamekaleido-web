import type {
  GameState,
  PlayerState,
  PropertyState,
  DeckState,
} from "./types";
import type { GameInstance } from "../load-instance";

export function createInitialGameState(instance: GameInstance): GameState {
  const players: PlayerState[] = instance.players.map((name) => ({
    name,
    position: 0,
    money: instance.game_rules.starting_money,
    in_jail: false,
    jail_turns: 0,
    properties_owned: [],
    get_out_of_jail_cards: 0,
    active_effects: [],
    is_bankrupt: false,
  }));

  const properties: Record<number, PropertyState> = {};
  for (const space of instance.board.spaces) {
    if (
      space.type === "property" ||
      space.type === "station" ||
      space.type === "utility"
    ) {
      properties[space.position] = {
        owner: null,
        houses: 0,
        hotels: 0,
        mortgaged: false,
      };
    }
  }

  const chanceDeck = shuffleDeck(instance.card_decks.chance.cards.length);
  const treasuryDeck = shuffleDeck(instance.card_decks.treasury.cards.length);

  return {
    players,
    properties,
    chance_deck: { remaining: chanceDeck, discard: [] },
    treasury_deck: { remaining: treasuryDeck, discard: [] },
    free_parking_pot: 0,
    current_player_index: 0,
    doubles_count: 0,
    last_dice: null,
    turn_phase: "pre_roll",
    pending_action: null,
    game_over: false,
    winner: null,
  };
}

function shuffleDeck(count: number): number[] {
  const indices = Array.from({ length: count }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
}
