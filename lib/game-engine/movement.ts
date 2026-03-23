import type { GameState, GameEvent, TurnResult } from "./types";
import type { GameInstance } from "../load-instance";

/**
 * Move a player forward by a number of spaces.
 * Handles GO passing (collect go_collect when wrapping past position 0).
 */
export function movePlayer(
  state: GameState,
  playerIndex: number,
  spaces: number,
  instance: GameInstance
): TurnResult {
  const player = state.players[playerIndex];
  const totalSpaces = instance.board.total_spaces;
  const oldPosition = player.position;
  const newPosition = (oldPosition + spaces) % totalSpaces;
  const passedGo = spaces > 0 && newPosition < oldPosition;

  const events: GameEvent[] = [];
  let moneyChange = 0;

  if (passedGo) {
    moneyChange = instance.game_rules.go_collect;
    events.push({
      type: "PassedGo",
      message: `${player.name} passed GO and collected ${instance.identity.currency_symbol}${moneyChange}`,
      data: { player: player.name, amount: moneyChange },
    });
  }

  const updatedPlayers = state.players.map((p, i) =>
    i === playerIndex
      ? { ...p, position: newPosition, money: p.money + moneyChange }
      : p
  );

  const spaceName =
    instance.board.spaces.find((s) => s.position === newPosition)?.name ??
    `space ${newPosition}`;
  events.push({
    type: "PlayerMoved",
    message: `${player.name} moved to ${spaceName} (position ${newPosition})`,
    data: {
      player: player.name,
      from: oldPosition,
      to: newPosition,
      spaces,
    },
  });

  return { state: { ...state, players: updatedPlayers }, events };
}

/**
 * Move a player directly to a target position.
 * Optionally collect GO money if they pass GO going forward.
 */
export function movePlayerTo(
  state: GameState,
  playerIndex: number,
  targetPosition: number,
  collectGoIfPassed: boolean,
  instance: GameInstance
): TurnResult {
  const player = state.players[playerIndex];
  const totalSpaces = instance.board.total_spaces;
  const oldPosition = player.position;

  const events: GameEvent[] = [];
  let moneyChange = 0;

  // Determine if we pass GO (moving forward and wrapping)
  const passedGo =
    collectGoIfPassed &&
    targetPosition !== oldPosition &&
    targetPosition <= oldPosition;

  if (passedGo) {
    moneyChange = instance.game_rules.go_collect;
    events.push({
      type: "PassedGo",
      message: `${player.name} passed GO and collected ${instance.identity.currency_symbol}${moneyChange}`,
      data: { player: player.name, amount: moneyChange },
    });
  }

  const updatedPlayers = state.players.map((p, i) =>
    i === playerIndex
      ? { ...p, position: targetPosition, money: p.money + moneyChange }
      : p
  );

  const spaceName =
    instance.board.spaces.find((s) => s.position === targetPosition)?.name ??
    `space ${targetPosition}`;
  events.push({
    type: "PlayerMoved",
    message: `${player.name} moved to ${spaceName} (position ${targetPosition})`,
    data: {
      player: player.name,
      from: oldPosition,
      to: targetPosition,
    },
  });

  return { state: { ...state, players: updatedPlayers }, events };
}

/**
 * Find the nearest space of a given type, moving forward from current position.
 */
export function findNearestSpace(
  currentPosition: number,
  spaceType: string,
  instance: GameInstance
): number {
  const totalSpaces = instance.board.total_spaces;
  for (let offset = 1; offset <= totalSpaces; offset++) {
    const pos = (currentPosition + offset) % totalSpaces;
    const space = instance.board.spaces.find((s) => s.position === pos);
    if (space && space.type === spaceType) {
      return pos;
    }
  }
  return currentPosition; // fallback — shouldn't happen with valid board
}
