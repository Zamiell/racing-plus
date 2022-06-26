import { HeartSubType, Keyboard } from "isaac-typescript-definitions";
import {
  getPlayerHealth,
  printConsole,
  setPlayerHealth,
} from "isaacscript-common";
import { hotkeys } from "./modConfigMenu";

export function debugCode(_params?: string): void {
  // Add code here.
  const player = Isaac.GetPlayer();
  const playerHealth = getPlayerHealth(player);
  playerHealth.soulHearts = 4;
  playerHealth.soulHeartTypes = [HeartSubType.SOUL, HeartSubType.SOUL];
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
