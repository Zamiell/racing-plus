import { HeartSubType, Keyboard } from "isaac-typescript-definitions";
import {
  newPlayerHealth,
  printConsole,
  setPlayerHealth,
} from "isaacscript-common";
import { hotkeys } from "./modConfigMenu";

/** Currently, F2 is set up to execute this function. */
export function debugCode(_params?: string): void {
  // Add code here.
  const playerHealth = {
    ...newPlayerHealth(),
    maxHearts: 2,
    hearts: 1,
    soulHearts: 1,
    soulHeartTypes: [HeartSubType.SOUL],
  };

  const player = Isaac.GetPlayer();
  setPlayerHealth(player, playerHealth);
}

export function hotkey1Function(): void {
  printConsole("Hotkey 1 activated.");
  debugCode();
}

export function hotkey2Function(): void {
  hotkeys.fastDropAll = Keyboard.Z;
  hotkeys.autofire = Keyboard.F;
  hotkeys.roll = Keyboard.G;

  printConsole("Test hotkeys set.");
}
