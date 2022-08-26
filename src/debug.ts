import { Keyboard } from "isaac-typescript-definitions";
import {
  getRandomSetElement,
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
  const mySet = new Set([{ foo: 1 }, { bar: 2 }, { baz: 3 }]);
  print(getRandomSetElement(mySet));
}

/** Hotkey 1 is bound to F2. */
export function hotkey1Function(): void {
  printConsole("Hotkey 1 activated.");
  debugCode();
}

/** Hotkey 2 is bound to F3. */
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
