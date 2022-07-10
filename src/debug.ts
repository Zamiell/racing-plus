import { Keyboard } from "isaac-typescript-definitions";
import { printConsole } from "isaacscript-common";
import g from "./globals";
import { hotkeys } from "./modConfigMenu";

/** Currently, F2 is set up to execute this function. */
export function debugCode(_params?: string): void {
  // Add code here.
  g.race.message = "Hispa arrived on this floor.\n(Ahead by: 34 seconds)";
  g.frameLastClientMessageReceived = Isaac.GetFrameCount();
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
