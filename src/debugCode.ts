import { CollectibleType, Keyboard } from "isaac-typescript-definitions";
import { log, logAndPrint, setLogFunctionsGlobal } from "isaacscript-common";
import { g } from "./globals";
import { mod } from "./mod";
import { hotkeys } from "./modConfigMenu";

/**
 * Currently, F2 is set to execute this function.
 *
 * If this function does nothing, ensure that the "g.debug" value is set to true.
 */
function debugCode(_params?: string) {
  // Add code here.
  const player = Isaac.GetPlayer();
  player.AddCollectible(CollectibleType.FORGET_ME_NOW);
}

/** Hotkey 1 is bound to F2. */
export function hotkey1Function(): void {
  logAndPrint("Hotkey 1 activated.");
  debugCode();
}

/** Hotkey 2 is bound to F3. */
export function hotkey2Function(): void {
  hotkeys.fastDropAll = Keyboard.Z;
  hotkeys.autofire = Keyboard.F;
  hotkeys.storage = Keyboard.X;
  hotkeys.roll = Keyboard.G;

  logAndPrint("Hotkey 2 activated. Test hotkeys set.");
}

/** Executed either from using the "debug" console command or using the "Debug" active item. */
export function debugFunction(params?: string): void {
  g.debug = true;
  mod.saveDataManagerSetGlobal();
  setLogFunctionsGlobal();

  log("Entering debug function.");
  debugCode(params);
  log("Exiting debug function.");
}
