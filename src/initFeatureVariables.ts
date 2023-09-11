import { customConsoleInit } from "./features/race/customConsole";
import { socketClientInit } from "./features/race/socketClient";
import { raceVarsInit } from "./features/race/v";
import { mod } from "./mod";
import { modConfigMenuInit } from "./modConfigMenu";
import { modConfigMenuVanillaInit } from "./modConfigMenuVanilla";

export function initFeatureVariables(): void {
  // Core
  modConfigMenuInit();
  modConfigMenuVanillaInit();
  raceVarsInit();
  socketClientInit();

  // Other
  customConsoleInit();

  // Now that all of the features have been initialized, we can get the save data manager to load
  // data from disk before the first run begins. (This prevents bugs with `isaacscript-watcher` when
  // reloading the mod in the middle of a run.)
  mod.saveDataManagerLoad();
}
