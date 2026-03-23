import type { GameState, GameEvent, TurnResult } from "./types";
import type { GameInstance, BoardSpace } from "../load-instance";

/**
 * Calculate rent for a space given current game state.
 * - Property: base rent, monopoly 2x, houses, hotels (from rent[] array)
 * - Station: base_rent * 2^(n-1) where n = stations owned
 * - Utility: diceTotal * multiplier (4 for 1, 10 for 2)
 */
export function calculateRent(
  space: BoardSpace,
  state: GameState,
  instance: GameInstance,
  currentDiceTotal: number
): number {
  const propState = state.properties[space.position];
  if (!propState || !propState.owner || propState.mortgaged) return 0;

  const owner = propState.owner;

  if (space.type === "station") {
    const stationsOwned = countOwnedOfType(owner, "station", state, instance);
    return (
      instance.game_rules.station_base_rent *
      Math.pow(2, stationsOwned - 1)
    );
  }

  if (space.type === "utility") {
    const utilitiesOwned = countOwnedOfType(
      owner,
      "utility",
      state,
      instance
    );
    const multiplier =
      utilitiesOwned >= 2
        ? instance.game_rules.utility_multiplier_two
        : instance.game_rules.utility_multiplier_one;
    return currentDiceTotal * multiplier;
  }

  // Property type
  if (!space.rent || space.rent.length === 0) return 0;

  if (propState.hotels > 0) {
    // Hotel rent is the last entry in rent array
    return space.rent[space.rent.length - 1];
  }

  if (propState.houses > 0) {
    // rent[0] = base, rent[1] = 1 house, rent[2] = 2 houses, etc.
    const houseIndex = Math.min(propState.houses, space.rent.length - 2);
    return space.rent[houseIndex];
  }

  // Base rent — double if monopoly
  const baseRent = space.rent[0];
  if (
    space.colour_group &&
    hasMonopoly(owner, space.colour_group, state, instance)
  ) {
    return baseRent * instance.game_rules.monopoly_rent_multiplier;
  }

  return baseRent;
}

/**
 * Check if a player owns all properties in a colour group.
 */
export function hasMonopoly(
  owner: string,
  colourGroup: string,
  state: GameState,
  instance: GameInstance
): boolean {
  const group = instance.colour_groups[colourGroup];
  if (!group) return false;

  return group.properties.every(
    (pos) => state.properties[pos]?.owner === owner
  );
}

/**
 * Count how many spaces of a given type a player owns.
 */
function countOwnedOfType(
  owner: string,
  spaceType: string,
  state: GameState,
  instance: GameInstance
): number {
  return instance.board.spaces.filter(
    (s) =>
      s.type === spaceType && state.properties[s.position]?.owner === owner
  ).length;
}

/**
 * Buy a property for a player.
 */
export function buyProperty(
  state: GameState,
  playerIndex: number,
  position: number,
  price: number,
  instance: GameInstance
): TurnResult {
  const player = state.players[playerIndex];
  const space = instance.board.spaces.find((s) => s.position === position);
  const events: GameEvent[] = [];

  const updatedPlayers = state.players.map((p, i) =>
    i === playerIndex
      ? {
          ...p,
          money: p.money - price,
          properties_owned: [...p.properties_owned, position],
        }
      : p
  );

  const updatedProperties = {
    ...state.properties,
    [position]: { ...state.properties[position], owner: player.name },
  };

  events.push({
    type: "PropertyPurchased",
    message: `${player.name} bought ${space?.name ?? `position ${position}`} for ${instance.identity.currency_symbol}${price}`,
    data: { player: player.name, position, price },
  });

  return {
    state: {
      ...state,
      players: updatedPlayers,
      properties: updatedProperties,
      pending_action: null,
    },
    events,
  };
}

/**
 * Pay rent from one player to another.
 * Checks for rent_immunity active effect on payer.
 * Checks for collect_fraction_of_rents active effects on all other players.
 */
export function payRent(
  state: GameState,
  payerIndex: number,
  ownerName: string,
  amount: number,
  instance: GameInstance
): TurnResult {
  const payer = state.players[payerIndex];
  const events: GameEvent[] = [];

  // Check rent immunity
  const hasImmunity = payer.active_effects.some(
    (e) => e.type === "rent_immunity" && e.turns_remaining > 0
  );

  if (hasImmunity) {
    events.push({
      type: "RentImmunity",
      message: `${payer.name} has rent immunity! No rent paid.`,
      data: { player: payer.name, saved: amount },
    });
    return {
      state: { ...state, pending_action: null },
      events,
    };
  }

  // Calculate fraction collectors
  let remainingRent = amount;
  let updatedPlayers = [...state.players];
  let freeParkingPot = state.free_parking_pot;

  // Process collect_fraction_of_rents effects from other players
  for (let i = 0; i < updatedPlayers.length; i++) {
    if (i === payerIndex) continue;
    if (updatedPlayers[i].name === ownerName) continue;

    const fractionEffect = updatedPlayers[i].active_effects.find(
      (e) =>
        e.type === "collect_fraction_of_rents" && e.turns_remaining > 0
    );
    if (fractionEffect && fractionEffect.params) {
      const fraction = (fractionEffect.params.fraction as number) ?? 0;
      const cut = Math.floor(amount * fraction);
      remainingRent -= cut;
      updatedPlayers = updatedPlayers.map((p, idx) =>
        idx === i ? { ...p, money: p.money + cut } : p
      );
      events.push({
        type: "FractionCollected",
        message: `${updatedPlayers[i].name} collected ${instance.identity.currency_symbol}${cut} as a rent fraction`,
        data: {
          player: updatedPlayers[i].name,
          amount: cut,
          fraction,
        },
      });
    }
  }

  // Payer pays, owner receives remaining
  const actualPayment = Math.min(remainingRent, payer.money);
  updatedPlayers = updatedPlayers.map((p, i) => {
    if (i === payerIndex) {
      const newMoney = p.money - actualPayment;
      return {
        ...p,
        money: newMoney,
        is_bankrupt: newMoney < 0,
      };
    }
    if (p.name === ownerName) {
      return { ...p, money: p.money + actualPayment };
    }
    return p;
  });

  events.push({
    type: "RentPaid",
    message: `${payer.name} paid ${instance.identity.currency_symbol}${actualPayment} rent to ${ownerName}`,
    data: {
      payer: payer.name,
      owner: ownerName,
      amount: actualPayment,
    },
  });

  if (actualPayment < remainingRent) {
    events.push({
      type: "PlayerBankrupt",
      message: `${payer.name} couldn't afford full rent and is bankrupt!`,
      data: { player: payer.name },
    });
  }

  return {
    state: {
      ...state,
      players: updatedPlayers,
      free_parking_pot: freeParkingPot,
      pending_action: null,
    },
    events,
  };
}
