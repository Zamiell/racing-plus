import { Keyboard } from "isaac-typescript-definitions";
import {
  log,
  printConsole,
  saveDataManagerSetGlobal,
  setLogFunctionsGlobal,
} from "isaacscript-common";
import g from "./globals";
import { hotkeys } from "./modConfigMenu";

/** Currently, F2 is set to execute this function. */
function debugCode(_params?: string) {
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

export function debugFunction(params?: string): void {
  g.debug = true;
  saveDataManagerSetGlobal();
  setLogFunctionsGlobal();

  log("Entering debug function.");
  debugCode(params);
  log("Exiting debug function.");
}
