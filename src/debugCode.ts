import { Keyboard } from "isaac-typescript-definitions";
import { log, printConsole, setLogFunctionsGlobal } from "isaacscript-common";
import { getRandomDiversityItems } from "./features/speedrun/season3/callbacks/postGameStarted";
import g from "./globals";
import { mod } from "./mod";
import { hotkeys } from "./modConfigMenu";

/** Currently, F2 is set to execute this function. */
function debugCode(_params?: string) {
  // Add code here.
  const player = Isaac.GetPlayer();
  const startSeed = Seeds.String2Seed("ZS4Q 8C3Y");
  const [collectibleTypes, trinketType] = getRandomDiversityItems(
    player,
    startSeed,
  );
  Isaac.DebugString(`GETTING HERE - ${trinketType}`);
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
  mod.saveDataManagerSetGlobal();
  setLogFunctionsGlobal();

  log("Entering debug function.");
  debugCode(params);
  log("Exiting debug function.");
}
