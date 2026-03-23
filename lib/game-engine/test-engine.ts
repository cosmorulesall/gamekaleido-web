/**
 * Manual test script for the Property Trading game engine.
 * Loads demo instance, creates initial state, simulates 10 turns.
 *
 * Run: npx tsx lib/game-engine/test-engine.ts
 */
import fs from "fs";
import path from "path";
import type { GameInstance } from "../load-instance";
import { createInitialGameState } from "./state";
import { processRoll, endTurn } from "./turn";
import { buyProperty, payRent } from "./property";
import { resolveChoosePlayer } from "./effects";
import type { GameState, GameEvent } from "./types";

// Load instance
const instancePath = path.join(
  process.cwd(),
  "data",
  "demo",
  "property-trading-instance.json"
);
const raw = fs.readFileSync(instancePath, "utf8");
const instance: GameInstance = JSON.parse(raw);

console.log(`=== ${instance.identity.game_name} ===`);
console.log(`Tagline: ${instance.identity.tagline}`);
console.log(`Players: ${instance.players.join(", ")}`);
console.log(`Currency: ${instance.identity.currency_name} (${instance.identity.currency_symbol})`);
console.log(`Starting money: ${instance.identity.currency_symbol}${instance.game_rules.starting_money}`);
console.log("");

let state: GameState = createInitialGameState(instance);

function printEvents(events: GameEvent[]) {
  for (const e of events) {
    console.log(`  [${e.type}] ${e.message}`);
  }
}

function printBalances(state: GameState) {
  const sym = instance.identity.currency_symbol;
  const balances = state.players
    .map(
      (p) =>
        `${p.name}: ${sym}${p.money}${p.is_bankrupt ? " (BANKRUPT)" : ""}${p.in_jail ? " (IN JAIL)" : ""}`
    )
    .join(" | ");
  console.log(`  Balances: ${balances}`);
}

let turnCount = 0;
const MAX_TURNS = 10;

while (turnCount < MAX_TURNS && !state.game_over) {
  turnCount++;
  const currentPlayer = state.players[state.current_player_index];
  console.log(`--- Turn ${turnCount}: ${currentPlayer.name} ---`);

  // Roll
  const rollResult = processRoll(state, instance);
  state = rollResult.state;
  printEvents(rollResult.events);

  // Handle pending actions automatically
  let safety = 0;
  while (state.pending_action && safety < 10) {
    safety++;
    const action = state.pending_action;

    if (action.type === "buy_property") {
      const player = state.players[state.current_player_index];
      const price = action.discounted_price ?? action.price;
      if (player.money >= price) {
        // Auto-buy
        const buyResult = buyProperty(
          state,
          state.current_player_index,
          action.position,
          price,
          instance
        );
        state = buyResult.state;
        printEvents(buyResult.events);

        // Consume discount effect if used
        if (action.discounted_price !== undefined) {
          const updatedPlayers = state.players.map((p, i) => {
            if (i !== state.current_player_index) return p;
            const effects = p.active_effects.filter(
              (e) => e.type !== "property_discount"
            );
            return { ...p, active_effects: effects };
          });
          state = { ...state, players: updatedPlayers };
          console.log(`  [DiscountUsed] Property discount consumed`);
        }
      } else {
        // Can't afford — decline
        console.log(
          `  [Declined] ${player.name} can't afford ${instance.identity.currency_symbol}${price}`
        );
        state = { ...state, pending_action: null, turn_phase: "turn_end" };
      }
    } else if (action.type === "pay_rent") {
      const rentResult = payRent(
        state,
        state.current_player_index,
        action.to,
        action.amount,
        instance
      );
      state = rentResult.state;
      printEvents(rentResult.events);
    } else if (action.type === "choose_player") {
      // Auto-choose first non-current, non-bankrupt player
      const otherIndex = state.players.findIndex(
        (p, i) => i !== state.current_player_index && !p.is_bankrupt
      );
      if (otherIndex >= 0) {
        const chooseResult = resolveChoosePlayer(
          state,
          state.current_player_index,
          otherIndex,
          action.effect,
          action.params,
          instance
        );
        state = chooseResult.state;
        printEvents(chooseResult.events);
      } else {
        state = { ...state, pending_action: null, turn_phase: "turn_end" };
      }
    } else if (action.type === "jail_decision") {
      // Auto-stay (will be handled by processRoll next turn)
      state = { ...state, pending_action: null, turn_phase: "turn_end" };
    } else {
      // auction or unknown — skip
      state = { ...state, pending_action: null, turn_phase: "turn_end" };
    }
  }

  // Handle doubles roll-again within the same turn
  let doublesRolls = 0;
  while (state.turn_phase === "pre_roll" && !state.game_over && doublesRolls < 3) {
    doublesRolls++;
    console.log(`  (Doubles — rolling again)`);
    const rerollResult = processRoll(state, instance);
    state = rerollResult.state;
    printEvents(rerollResult.events);

    // Handle pending actions from re-roll
    let innerSafety = 0;
    while (state.pending_action && innerSafety < 10) {
      innerSafety++;
      const action = state.pending_action;

      if (action.type === "buy_property") {
        const player = state.players[state.current_player_index];
        const price = action.discounted_price ?? action.price;
        if (player.money >= price) {
          const buyResult = buyProperty(
            state,
            state.current_player_index,
            action.position,
            price,
            instance
          );
          state = buyResult.state;
          printEvents(buyResult.events);
        } else {
          state = { ...state, pending_action: null, turn_phase: "turn_end" };
        }
      } else if (action.type === "pay_rent") {
        const rentResult = payRent(
          state,
          state.current_player_index,
          action.to,
          action.amount,
          instance
        );
        state = rentResult.state;
        printEvents(rentResult.events);
      } else if (action.type === "choose_player") {
        const otherIndex = state.players.findIndex(
          (p, i) => i !== state.current_player_index && !p.is_bankrupt
        );
        if (otherIndex >= 0) {
          const chooseResult = resolveChoosePlayer(
            state,
            state.current_player_index,
            otherIndex,
            action.effect,
            action.params,
            instance
          );
          state = chooseResult.state;
          printEvents(chooseResult.events);
        } else {
          state = { ...state, pending_action: null, turn_phase: "turn_end" };
        }
      } else {
        state = { ...state, pending_action: null, turn_phase: "turn_end" };
      }
    }
  }

  // End turn
  if (state.turn_phase === "turn_end" || state.turn_phase === "landed" || state.turn_phase === "post_roll") {
    const endResult = endTurn(state);
    state = endResult.state;
    if (endResult.events.length > 0) printEvents(endResult.events);
  }

  printBalances(state);
  console.log("");
}

// Final summary
console.log("=== FINAL STATE ===");
const sym = instance.identity.currency_symbol;
for (const p of state.players) {
  console.log(
    `${p.name}: ${sym}${p.money} | Position: ${p.position} | Properties: ${p.properties_owned.length} | Jail: ${p.in_jail} | Bankrupt: ${p.is_bankrupt}`
  );
}
console.log(`Game over: ${state.game_over}`);
if (state.winner) console.log(`Winner: ${state.winner}`);
console.log(`\nEngine test completed successfully.`);
