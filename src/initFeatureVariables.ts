import * as customConsole from "./features/race/customConsole";
import * as socketClient from "./features/race/socketClient";
import * as raceVars from "./features/race/v";
import { mod } from "./mod";
import * as modConfigMenu from "./modConfigMenu";
import * as modConfigMenuVanilla from "./modConfigMenuVanilla";

export function initFeatureVariables(): void {
  // Core
  modConfigMenu.init();
  modConfigMenuVanilla.init();
  raceVars.init();
  socketClient.init();

  // Other
  customConsole.init();

  // Now that all of the features have been initialized, we can get the save data manager to load
  // data from disk before the first run begins. (This prevents bugs with `isaacscript-watcher` when
  // reloading the mod in the middle of a run.)
  mod.saveDataManagerLoad();
}
