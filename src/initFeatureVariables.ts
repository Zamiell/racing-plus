import * as fireworks from "./features/mandatory/fireworks";
import * as planetariumFix from "./features/mandatory/planetariumFix";
import * as preventSacrificeRoomTeleport from "./features/mandatory/preventSacrificeRoomTeleport";
import * as replacePhotos from "./features/mandatory/replacePhotos";
import * as seededDeath from "./features/mandatory/seededDeath/v";
import * as seededDrops from "./features/mandatory/seededDrops";
import * as seededFloors from "./features/mandatory/seededFloors";
import * as seededGBBug from "./features/mandatory/seededGBBug";
import * as seededTeleports from "./features/mandatory/seededTeleports";
import * as streakText from "./features/mandatory/streakText";
import * as tempMoreOptions from "./features/mandatory/tempMoreOptions";
import * as autofire from "./features/optional/hotkeys/autofire";
import * as fastDrop from "./features/optional/hotkeys/fastDrop";
import * as roll from "./features/optional/hotkeys/roll";
import * as schoolbagSwitch from "./features/optional/hotkeys/schoolbagSwitch";
import * as betterDevilAngelRoomsVars from "./features/optional/major/betterDevilAngelRooms/v";
import * as fastClearVars from "./features/optional/major/fastClear/v";
import * as fastTravelVars from "./features/optional/major/fastTravel/v";
import * as automaticItemInsertion from "./features/optional/quality/automaticItemInsertion/v";
import * as showDreamCatcherItemVars from "./features/optional/quality/showDreamCatcherItem/v";
import * as customConsole from "./features/race/customConsole";
import * as shadows from "./features/race/shadows/shadows";
import * as socketClient from "./features/race/socketClient";
import * as raceVars from "./features/race/v";
import * as speedrunVars from "./features/speedrun/v";
import { mod } from "./mod";
import * as modConfigMenu from "./modConfigMenu";
import * as modConfigMenuVanilla from "./modConfigMenuVanilla";

export function initFeatureVariables(): void {
  // Core
  modConfigMenu.init();
  modConfigMenuVanilla.init();
  raceVars.init();
  socketClient.init();
  shadows.init();
  planetariumFix.init();
  speedrunVars.init();

  // Mandatory
  streakText.init();
  replacePhotos.init();
  tempMoreOptions.init();
  seededDrops.init();
  seededTeleports.init();
  seededFloors.init();
  seededGBBug.init();
  fireworks.init();
  preventSacrificeRoomTeleport.init();
  seededDeath.init();

  // Major
  fastClearVars.init();
  fastTravelVars.init();
  betterDevilAngelRoomsVars.init();

  // Hotkeys
  fastDrop.init();
  schoolbagSwitch.init();
  autofire.init();

  // QoL
  showDreamCatcherItemVars.init(); // 566
  automaticItemInsertion.init();

  // Other
  customConsole.init();
  roll.init();

  // Now that all of the features have been initialized, we can get the save data manager to load
  // data from disk before the first run begins. (This prevents bugs with `isaacscript-watcher` when
  // reloading the mod in the middle of a run.)
  mod.saveDataManagerLoad();
}
