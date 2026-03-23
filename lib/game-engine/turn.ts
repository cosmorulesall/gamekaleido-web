import type { GameState, GameEvent, TurnResult, PendingAction } from "./types";
import type { GameInstance } from "../load-instance";
import { rollDice, isDoubles, diceTotal } from "./dice";
import { movePlayer } from "./movement";
import { calculateRent, buyProperty, payRent } from "./property";
import { drawCard, holdCard } from "./cards";
import { resolveCardEffect, tickEffects } from "./effects";

/**
 * Process a dice roll and the resulting turn actions.
 * This is the main turn orchestrator.
 *
 * 1. Roll dice (or use override)
 * 2. Jail logic (doubles escape, forced fine after max turns)
 * 3. Three doubles -> jail
 * 4. Move player
 * 5. Process landing
 * 6. Doubles roll again if no pending action
 */
export function processRoll(
  state: GameState,
  instance: GameInstance,
  diceOverride?: [number, number]
): TurnResult {
  const dice = diceOverride ?? rollDice();
  const playerIndex = state.current_player_index;
  const player = state.players[playerIndex];
  const events: GameEvent[] = [];
  const sym = instance.identity.currency_symbol;

  let currentState: GameState = {
    ...state,
    last_dice: dice,
    turn_phase: "post_roll",
  };

  events.push({
    type: "DiceRolled",
    message: `${player.name} rolled ${dice[0]} + ${dice[1]} = ${diceTotal(dice)}${isDoubles(dice) ? " (DOUBLES!)" : ""}`,
    data: {
      player: player.name,
      dice,
      total: diceTotal(dice),
      doubles: isDoubles(dice),
    },
  });

  // --- Jail logic ---
  if (player.in_jail) {
    if (isDoubles(dice)) {
      // Doubles: escape jail
      const updatedPlayers = currentState.players.map((p, i) =>
        i === playerIndex
          ? { ...p, in_jail: false, jail_turns: 0 }
          : p
      );
      currentState = { ...currentState, players: updatedPlayers, doubles_count: 0 };
      events.push({
        type: "JailEscape",
        message: `${player.name} rolled doubles and escaped jail!`,
        data: { player: player.name },
      });
      // Continue to move below
    } else {
      // No doubles
      const newJailTurns = player.jail_turns + 1;
      if (newJailTurns >= instance.game_rules.jail_turns_max) {
        // Forced to pay fine and move
        const updatedPlayers = currentState.players.map((p, i) =>
          i === playerIndex
            ? {
                ...p,
                in_jail: false,
                jail_turns: 0,
                money: p.money - instance.game_rules.jail_fine,
              }
            : p
        );
        currentState = { ...currentState, players: updatedPlayers };
        events.push({
          type: "JailFinePaid",
          message: `${player.name} paid ${sym}${instance.game_rules.jail_fine} fine after ${newJailTurns} turns in jail`,
          data: {
            player: player.name,
            fine: instance.game_rules.jail_fine,
          },
        });
        // Continue to move below
      } else {
        // Stay in jail
        const updatedPlayers = currentState.players.map((p, i) =>
          i === playerIndex
            ? { ...p, jail_turns: newJailTurns }
            : p
        );
        currentState = {
          ...currentState,
          players: updatedPlayers,
          turn_phase: "turn_end",
        };
        events.push({
          type: "JailStay",
          message: `${player.name} stays in jail (turn ${newJailTurns}/${instance.game_rules.jail_turns_max})`,
          data: { player: player.name, jailTurns: newJailTurns },
        });
        return { state: currentState, events };
      }
    }
  } else {
    // Not in jail — check three doubles rule
    if (isDoubles(dice)) {
      const newDoublesCount = currentState.doubles_count + 1;
      if (
        instance.game_rules.three_doubles_go_to_jail &&
        newDoublesCount >= 3
      ) {
        const jailPos =
          instance.board.spaces.find((s) => s.type === "jail")?.position ?? 10;
        const updatedPlayers = currentState.players.map((p, i) =>
          i === playerIndex
            ? { ...p, position: jailPos, in_jail: true, jail_turns: 0 }
            : p
        );
        currentState = {
          ...currentState,
          players: updatedPlayers,
          doubles_count: 0,
          turn_phase: "turn_end",
        };
        events.push({
          type: "ThreeDoubles",
          message: `${player.name} rolled three doubles in a row — sent to jail!`,
          data: { player: player.name },
        });
        return { state: currentState, events };
      }
      currentState = { ...currentState, doubles_count: newDoublesCount };
    } else {
      currentState = { ...currentState, doubles_count: 0 };
    }
  }

  // --- Move player ---
  const moveResult = movePlayer(
    currentState,
    playerIndex,
    diceTotal(dice),
    instance
  );
  currentState = moveResult.state;
  events.push(...moveResult.events);

  // --- Process landing ---
  const landingResult = processLanding(
    currentState,
    playerIndex,
    dice,
    instance
  );
  currentState = landingResult.state;
  events.push(...landingResult.events);

  // If there's a pending action, stay in awaiting_decision phase
  if (currentState.pending_action) {
    return { state: currentState, events };
  }

  // --- Doubles roll again ---
  if (
    isDoubles(dice) &&
    instance.game_rules.doubles_roll_again &&
    !currentState.players[playerIndex].in_jail
  ) {
    currentState = { ...currentState, turn_phase: "pre_roll" };
    events.push({
      type: "DoublesRollAgain",
      message: `${player.name} rolled doubles — roll again!`,
      data: { player: player.name },
    });
  } else {
    currentState = { ...currentState, turn_phase: "turn_end" };
  }

  return { state: currentState, events };
}

/**
 * Process what happens when a player lands on a space.
 */
function processLanding(
  state: GameState,
  playerIndex: number,
  dice: [number, number],
  instance: GameInstance
): TurnResult {
  const player = state.players[playerIndex];
  const position = player.position;
  const space = instance.board.spaces.find((s) => s.position === position);
  const events: GameEvent[] = [];
  const sym = instance.identity.currency_symbol;

  if (!space) return { state, events };

  switch (space.type) {
    case "property":
    case "station":
    case "utility": {
      const propState = state.properties[position];
      if (!propState) return { state, events };

      if (propState.owner === null) {
        // Unowned — offer to buy
        const price = space.price ?? 0;
        // Check property_discount effect
        const discountEffect = player.active_effects.find(
          (e) => e.type === "property_discount" && e.turns_remaining > 0
        );
        let discountedPrice: number | undefined;
        if (discountEffect && discountEffect.params) {
          const pct = (discountEffect.params.discount_percent as number) ?? 0;
          discountedPrice = Math.floor(price * (1 - pct / 100));
        }

        return {
          state: {
            ...state,
            turn_phase: "awaiting_decision",
            pending_action: {
              type: "buy_property",
              position,
              price,
              discounted_price: discountedPrice,
            },
          },
          events,
        };
      } else if (propState.owner !== player.name) {
        // Owned by someone else — pay rent
        const rent = calculateRent(space, state, instance, diceTotal(dice));
        if (rent > 0) {
          return {
            state: {
              ...state,
              turn_phase: "awaiting_decision",
              pending_action: {
                type: "pay_rent",
                position,
                amount: rent,
                to: propState.owner,
              },
            },
            events,
          };
        }
      }
      // Own property or zero rent — nothing to do
      return { state, events };
    }

    case "chance":
    case "treasury": {
      const deckName = space.type === "chance" ? "chance" : "treasury";
      const drawResult = drawCard(state, deckName);
      let currentState = drawResult.state;
      events.push(...drawResult.events);

      const cardIndex = drawResult.cardIndex;
      const card = instance.card_decks[deckName].cards[cardIndex];

      if (!card) return { state: currentState, events };

      // If GOOJF, hold the card (don't discard)
      if (card.effect === "get_out_of_jail_free") {
        currentState = holdCard(currentState, deckName, cardIndex);
      } else {
        // Add to discard
        const deckKey = deckName === "chance" ? "chance_deck" : "treasury_deck";
        currentState = {
          ...currentState,
          [deckKey]: {
            ...currentState[deckKey],
            discard: [...currentState[deckKey].discard, cardIndex],
          },
        };
      }

      const effectResult = resolveCardEffect(
        currentState,
        playerIndex,
        card,
        instance
      );
      events.push(...effectResult.events);

      return { state: effectResult.state, events };
    }

    case "tax": {
      const amount = space.amount ?? 0;
      let freeParkingPot = state.free_parking_pot;
      if (instance.game_rules.house_rules.free_parking_pot) {
        freeParkingPot += amount;
      }
      const updatedPlayers = state.players.map((p, i) =>
        i === playerIndex ? { ...p, money: p.money - amount } : p
      );
      events.push({
        type: "TaxPaid",
        message: `${player.name} paid ${sym}${amount} in tax`,
        data: { player: player.name, amount },
      });
      return {
        state: {
          ...state,
          players: updatedPlayers,
          free_parking_pot: freeParkingPot,
        },
        events,
      };
    }

    case "go_to_jail": {
      const jailPos =
        instance.board.spaces.find((s) => s.type === "jail")?.position ?? 10;
      const updatedPlayers = state.players.map((p, i) =>
        i === playerIndex
          ? { ...p, position: jailPos, in_jail: true, jail_turns: 0 }
          : p
      );
      events.push({
        type: "SentToJail",
        message: `${player.name} was sent to jail!`,
        data: { player: player.name },
      });
      return {
        state: {
          ...state,
          players: updatedPlayers,
          doubles_count: 0,
          turn_phase: "turn_end",
        },
        events,
      };
    }

    case "free_parking": {
      if (
        instance.game_rules.house_rules.free_parking_pot &&
        state.free_parking_pot > 0
      ) {
        const pot = state.free_parking_pot;
        const updatedPlayers = state.players.map((p, i) =>
          i === playerIndex ? { ...p, money: p.money + pot } : p
        );
        events.push({
          type: "FreeParkingCollected",
          message: `${player.name} collected ${sym}${pot} from Free Parking!`,
          data: { player: player.name, amount: pot },
        });
        return {
          state: {
            ...state,
            players: updatedPlayers,
            free_parking_pot: 0,
          },
          events,
        };
      }
      return { state, events };
    }

    default:
      // go, jail (visiting), etc. — nothing happens
      return { state, events };
  }
}

/**
 * End the current turn.
 * Tick effects, advance to next non-bankrupt player, check for winner.
 */
export function endTurn(state: GameState): TurnResult {
  const events: GameEvent[] = [];
  let currentState = state;

  // Tick effects for current player
  currentState = tickEffects(currentState, currentState.current_player_index);

  // Advance to next non-bankrupt player
  const totalPlayers = currentState.players.length;
  let nextIndex =
    (currentState.current_player_index + 1) % totalPlayers;

  let attempts = 0;
  while (
    currentState.players[nextIndex].is_bankrupt &&
    attempts < totalPlayers
  ) {
    nextIndex = (nextIndex + 1) % totalPlayers;
    attempts++;
  }

  // Check for winner (only one non-bankrupt player)
  const activePlayers = currentState.players.filter((p) => !p.is_bankrupt);
  if (activePlayers.length <= 1 && currentState.players.length > 1) {
    const winner = activePlayers[0]?.name ?? null;
    events.push({
      type: "GameOver",
      message: winner
        ? `${winner} wins the game!`
        : "Game over — no active players!",
      data: { winner },
    });
    return {
      state: {
        ...currentState,
        game_over: true,
        winner,
        turn_phase: "pre_roll",
      },
      events,
    };
  }

  currentState = {
    ...currentState,
    current_player_index: nextIndex,
    doubles_count: 0,
    turn_phase: "pre_roll",
    pending_action: null,
  };

  return { state: currentState, events };
}
