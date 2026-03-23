import type {
  GameState,
  GameEvent,
  TurnResult,
  ActiveEffect,
} from "./types";
import type { GameInstance, GameCard } from "../load-instance";
import { movePlayerTo, movePlayer, findNearestSpace } from "./movement";

/**
 * Resolve a card effect for the active player.
 * Returns updated state and events. Some effects set pending_action for player choice.
 */
export function resolveCardEffect(
  state: GameState,
  playerIndex: number,
  card: GameCard,
  instance: GameInstance
): TurnResult {
  const player = state.players[playerIndex];
  const events: GameEvent[] = [];
  const params = card.params;
  const sym = instance.identity.currency_symbol;

  events.push({
    type: "CardEffect",
    message: `${player.name}: "${card.text}"`,
    data: { player: player.name, card_id: card.id, effect: card.effect },
  });

  switch (card.effect) {
    case "collect_money": {
      const amount = params.amount as number;
      const updatedPlayers = state.players.map((p, i) =>
        i === playerIndex ? { ...p, money: p.money + amount } : p
      );
      events.push({
        type: "MoneyCollected",
        message: `${player.name} collected ${sym}${amount}`,
        data: { player: player.name, amount },
      });
      return { state: { ...state, players: updatedPlayers }, events };
    }

    case "pay_money": {
      const amount = params.amount as number;
      const actualPay = Math.min(amount, player.money);
      let freeParkingPot = state.free_parking_pot;
      if (instance.game_rules.house_rules.free_parking_pot) {
        freeParkingPot += actualPay;
      }
      const updatedPlayers = state.players.map((p, i) =>
        i === playerIndex
          ? { ...p, money: p.money - actualPay, is_bankrupt: p.money - actualPay < 0 }
          : p
      );
      events.push({
        type: "MoneyPaid",
        message: `${player.name} paid ${sym}${actualPay}`,
        data: { player: player.name, amount: actualPay },
      });
      return {
        state: { ...state, players: updatedPlayers, free_parking_pot: freeParkingPot },
        events,
      };
    }

    case "move_to_space": {
      const target = params.target_position as number;
      const collectGo = (params.collect_go_if_passed as boolean) ?? true;
      const moveResult = movePlayerTo(
        state,
        playerIndex,
        target,
        collectGo,
        instance
      );
      return {
        state: moveResult.state,
        events: [...events, ...moveResult.events],
      };
    }

    case "move_to_nearest_type": {
      const spaceType = params.space_type as string;
      const target = findNearestSpace(player.position, spaceType, instance);
      const moveResult = movePlayerTo(
        state,
        playerIndex,
        target,
        true,
        instance
      );
      return {
        state: moveResult.state,
        events: [...events, ...moveResult.events],
      };
    }

    case "move_forward": {
      const spaces = params.spaces as number;
      const moveResult = movePlayer(state, playerIndex, spaces, instance);
      return {
        state: moveResult.state,
        events: [...events, ...moveResult.events],
      };
    }

    case "move_back": {
      const spaces = params.spaces as number;
      const totalSpaces = instance.board.total_spaces;
      const newPos =
        (player.position - spaces + totalSpaces) % totalSpaces;
      // Moving back does NOT collect GO
      const updatedPlayers = state.players.map((p, i) =>
        i === playerIndex ? { ...p, position: newPos } : p
      );
      const spaceName =
        instance.board.spaces.find((s) => s.position === newPos)?.name ??
        `space ${newPos}`;
      events.push({
        type: "PlayerMoved",
        message: `${player.name} moved back ${spaces} spaces to ${spaceName}`,
        data: { player: player.name, from: player.position, to: newPos },
      });
      return { state: { ...state, players: updatedPlayers }, events };
    }

    case "get_out_of_jail_free": {
      const updatedPlayers = state.players.map((p, i) =>
        i === playerIndex
          ? { ...p, get_out_of_jail_cards: p.get_out_of_jail_cards + 1 }
          : p
      );
      events.push({
        type: "GOOJFReceived",
        message: `${player.name} received a Get Out of Jail Free card`,
        data: { player: player.name },
      });
      // Card is held, not discarded
      return { state: { ...state, players: updatedPlayers }, events };
    }

    case "go_to_jail": {
      const jailPosition = instance.board.spaces.find(
        (s) => s.type === "jail"
      )?.position ?? 10;
      const updatedPlayers = state.players.map((p, i) =>
        i === playerIndex
          ? {
              ...p,
              position: jailPosition,
              in_jail: true,
              jail_turns: 0,
            }
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
        },
        events,
      };
    }

    case "pay_per_property": {
      const costPerHouse = params.cost_per_house as number;
      const costPerHotel = params.cost_per_hotel as number;
      let totalCost = 0;
      for (const pos of player.properties_owned) {
        const prop = state.properties[pos];
        if (prop) {
          totalCost += prop.houses * costPerHouse;
          totalCost += prop.hotels * costPerHotel;
        }
      }
      const actualPay = Math.min(totalCost, player.money);
      let freeParkingPot = state.free_parking_pot;
      if (instance.game_rules.house_rules.free_parking_pot) {
        freeParkingPot += actualPay;
      }
      const updatedPlayers = state.players.map((p, i) =>
        i === playerIndex ? { ...p, money: p.money - actualPay } : p
      );
      events.push({
        type: "PropertyRepairs",
        message: `${player.name} paid ${sym}${actualPay} for property repairs`,
        data: { player: player.name, amount: actualPay },
      });
      return {
        state: { ...state, players: updatedPlayers, free_parking_pot: freeParkingPot },
        events,
      };
    }

    case "collect_from_each_player": {
      const amount = params.amount as number;
      let totalCollected = 0;
      const updatedPlayers = state.players.map((p, i) => {
        if (i === playerIndex) return p; // handle collector after
        if (p.is_bankrupt) return p;
        const pay = Math.min(amount, p.money);
        totalCollected += pay;
        return { ...p, money: p.money - pay };
      });
      // Now update collector
      const finalPlayers = updatedPlayers.map((p, i) =>
        i === playerIndex
          ? { ...p, money: p.money + totalCollected }
          : p
      );
      events.push({
        type: "CollectedFromPlayers",
        message: `${player.name} collected ${sym}${totalCollected} from all players`,
        data: { player: player.name, amount: totalCollected },
      });
      return { state: { ...state, players: finalPlayers }, events };
    }

    case "pay_each_player": {
      const amount = params.amount as number;
      const activePlayers = state.players.filter(
        (p, i) => i !== playerIndex && !p.is_bankrupt
      );
      const totalPay = amount * activePlayers.length;
      const actualPay = Math.min(totalPay, player.money);
      const perPlayer =
        activePlayers.length > 0
          ? Math.floor(actualPay / activePlayers.length)
          : 0;

      const updatedPlayers = state.players.map((p, i) => {
        if (i === playerIndex) return { ...p, money: p.money - actualPay };
        if (p.is_bankrupt) return p;
        return { ...p, money: p.money + perPlayer };
      });
      events.push({
        type: "PaidToPlayers",
        message: `${player.name} paid ${sym}${perPlayer} to each player`,
        data: { player: player.name, perPlayer, total: actualPay },
      });
      return { state: { ...state, players: updatedPlayers }, events };
    }

    case "swap_positions": {
      // Requires choosing a player
      return {
        state: {
          ...state,
          turn_phase: "awaiting_decision",
          pending_action: {
            type: "choose_player",
            effect: "swap_positions",
            card_id: card.id,
            params: {},
          },
        },
        events,
      };
    }

    case "steal_from_player": {
      const amount = params.amount as number;
      return {
        state: {
          ...state,
          turn_phase: "awaiting_decision",
          pending_action: {
            type: "choose_player",
            effect: "steal_from_player",
            card_id: card.id,
            params: { amount },
          },
        },
        events,
      };
    }

    case "rent_immunity": {
      const turns = (params.turns as number) ?? 1;
      const effect: ActiveEffect = {
        type: "rent_immunity",
        turns_remaining: turns,
      };
      const updatedPlayers = state.players.map((p, i) =>
        i === playerIndex
          ? { ...p, active_effects: [...p.active_effects, effect] }
          : p
      );
      events.push({
        type: "EffectApplied",
        message: `${player.name} gained rent immunity for ${turns} turn(s)`,
        data: { player: player.name, effect: "rent_immunity", turns },
      });
      return { state: { ...state, players: updatedPlayers }, events };
    }

    case "property_discount": {
      const discountPercent = params.discount_percent as number;
      const expiresInTurns = (params.expires_in_turns as number) ?? 3;
      const effect: ActiveEffect = {
        type: "property_discount",
        turns_remaining: expiresInTurns,
        params: { discount_percent: discountPercent },
      };
      const updatedPlayers = state.players.map((p, i) =>
        i === playerIndex
          ? { ...p, active_effects: [...p.active_effects, effect] }
          : p
      );
      events.push({
        type: "EffectApplied",
        message: `${player.name} gets ${discountPercent}% off next property purchase (expires in ${expiresInTurns} turns)`,
        data: {
          player: player.name,
          effect: "property_discount",
          discountPercent,
          expiresInTurns,
        },
      });
      return { state: { ...state, players: updatedPlayers }, events };
    }

    case "collect_fraction_of_rents": {
      const fraction = params.fraction as number;
      const rounds = (params.rounds as number) ?? 2;
      const effect: ActiveEffect = {
        type: "collect_fraction_of_rents",
        turns_remaining: rounds,
        params: { fraction },
      };
      const updatedPlayers = state.players.map((p, i) =>
        i === playerIndex
          ? { ...p, active_effects: [...p.active_effects, effect] }
          : p
      );
      events.push({
        type: "EffectApplied",
        message: `${player.name} will collect ${fraction * 100}% of all rent for ${rounds} round(s)`,
        data: {
          player: player.name,
          effect: "collect_fraction_of_rents",
          fraction,
          rounds,
        },
      });
      return { state: { ...state, players: updatedPlayers }, events };
    }

    default: {
      events.push({
        type: "UnknownEffect",
        message: `Unknown card effect: ${card.effect}`,
        data: { effect: card.effect },
      });
      return { state, events };
    }
  }
}

/**
 * Resolve a "choose player" pending action (for swap_positions, steal_from_player).
 */
export function resolveChoosePlayer(
  state: GameState,
  activePlayerIndex: number,
  chosenPlayerIndex: number,
  effect: string,
  params: Record<string, unknown>,
  instance: GameInstance
): TurnResult {
  const activePlayer = state.players[activePlayerIndex];
  const chosenPlayer = state.players[chosenPlayerIndex];
  const events: GameEvent[] = [];
  const sym = instance.identity.currency_symbol;

  switch (effect) {
    case "swap_positions": {
      const activePos = activePlayer.position;
      const chosenPos = chosenPlayer.position;
      const updatedPlayers = state.players.map((p, i) => {
        if (i === activePlayerIndex) return { ...p, position: chosenPos };
        if (i === chosenPlayerIndex) return { ...p, position: activePos };
        return p;
      });
      events.push({
        type: "PositionsSwapped",
        message: `${activePlayer.name} swapped positions with ${chosenPlayer.name}`,
        data: {
          player1: activePlayer.name,
          player2: chosenPlayer.name,
          pos1: activePos,
          pos2: chosenPos,
        },
      });
      return {
        state: {
          ...state,
          players: updatedPlayers,
          pending_action: null,
          turn_phase: "turn_end",
        },
        events,
      };
    }

    case "steal_from_player": {
      const amount = params.amount as number;
      const stolen = Math.min(amount, chosenPlayer.money);
      const updatedPlayers = state.players.map((p, i) => {
        if (i === activePlayerIndex)
          return { ...p, money: p.money + stolen };
        if (i === chosenPlayerIndex)
          return { ...p, money: p.money - stolen };
        return p;
      });
      events.push({
        type: "MoneyStolen",
        message: `${activePlayer.name} stole ${sym}${stolen} from ${chosenPlayer.name}`,
        data: {
          thief: activePlayer.name,
          victim: chosenPlayer.name,
          amount: stolen,
        },
      });
      return {
        state: {
          ...state,
          players: updatedPlayers,
          pending_action: null,
          turn_phase: "turn_end",
        },
        events,
      };
    }

    default:
      return { state: { ...state, pending_action: null }, events };
  }
}

/**
 * Tick down active effects for a player at end of their turn.
 * Removes expired effects.
 */
export function tickEffects(
  state: GameState,
  playerIndex: number
): GameState {
  const player = state.players[playerIndex];
  const updatedEffects = player.active_effects
    .map((e) => ({ ...e, turns_remaining: e.turns_remaining - 1 }))
    .filter((e) => e.turns_remaining > 0);

  const updatedPlayers = state.players.map((p, i) =>
    i === playerIndex ? { ...p, active_effects: updatedEffects } : p
  );

  return { ...state, players: updatedPlayers };
}
