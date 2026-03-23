export function rollDice(): [number, number] {
  return [
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
  ];
}

export function isDoubles(dice: [number, number]): boolean {
  return dice[0] === dice[1];
}

export function diceTotal(dice: [number, number]): number {
  return dice[0] + dice[1];
}
