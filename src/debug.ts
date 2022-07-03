import { Keyboard } from "isaac-typescript-definitions";
import { printConsole } from "isaacscript-common";
import { hotkeys } from "./modConfigMenu";

/** Currently, F2 is set up to execute this function. */
export function debugCode(_params?: string): void {
  // Add code here.
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
