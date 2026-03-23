import type { GameState, GameEvent, DeckState } from "./types";

interface DrawResult {
  state: GameState;
  cardIndex: number;
  events: GameEvent[];
}

/**
 * Draw the top card from a deck. Reshuffles discard pile if deck is empty.
 */
export function drawCard(
  state: GameState,
  deckName: "chance" | "treasury"
): DrawResult {
  const deckKey =
    deckName === "chance" ? "chance_deck" : "treasury_deck";
  const deck: DeckState = state[deckKey];
  const events: GameEvent[] = [];

  let remaining = [...deck.remaining];
  let discard = [...deck.discard];

  // Reshuffle if empty
  if (remaining.length === 0) {
    remaining = shuffleArray([...discard]);
    discard = [];
    events.push({
      type: "DeckReshuffled",
      message: `${deckName} deck reshuffled`,
      data: { deck: deckName },
    });
  }

  const cardIndex = remaining[0];
  remaining = remaining.slice(1);

  const updatedDeck: DeckState = { remaining, discard };
  const updatedState = { ...state, [deckKey]: updatedDeck };

  events.push({
    type: "CardDrawn",
    message: `Drew a ${deckName} card`,
    data: { deck: deckName, cardIndex },
  });

  return { state: updatedState, cardIndex, events };
}

/**
 * Hold a card (remove from discard — used for GOOJF cards).
 */
export function holdCard(
  state: GameState,
  deckName: "chance" | "treasury",
  cardIndex: number
): GameState {
  const deckKey =
    deckName === "chance" ? "chance_deck" : "treasury_deck";
  const deck: DeckState = state[deckKey];

  // Card is already removed from remaining by drawCard.
  // Just don't add it to discard — it's "held" by the player.
  return state;
}

/**
 * Return a held card to the discard pile (when GOOJF is used).
 */
export function returnCard(
  state: GameState,
  deckName: "chance" | "treasury",
  cardIndex: number
): GameState {
  const deckKey =
    deckName === "chance" ? "chance_deck" : "treasury_deck";
  const deck: DeckState = state[deckKey];

  return {
    ...state,
    [deckKey]: {
      ...deck,
      discard: [...deck.discard, cardIndex],
    },
  };
}

function shuffleArray(arr: number[]): number[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
