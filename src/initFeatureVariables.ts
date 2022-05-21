import { saveDataManagerLoad } from "isaacscript-common";
import * as debugFunction from "./debugFunction";
import * as changeCharOrderVars from "./features/changeCharOrder/v";
import * as flipCustom from "./features/items/flipCustom";
import * as nLuck from "./features/items/nLuck";
import * as sawblade from "./features/items/sawblade";
import * as beastPreventEnd from "./features/mandatory/beastPreventEnd";
import * as disableMultiplayer from "./features/mandatory/disableMultiplayer";
import * as drawVersion from "./features/mandatory/drawVersion";
import * as dummyDPS from "./features/mandatory/dummyDPS";
import * as errors from "./features/mandatory/errors";
import * as fireworks from "./features/mandatory/fireworks";
import * as planetariumFix from "./features/mandatory/planetariumFix";
import * as preventSacrificeRoomTeleport from "./features/mandatory/preventSacrificeRoomTeleport";
import * as removeGlitchedItems from "./features/mandatory/removeGlitchedItems";
import * as removeGloballyBannedItems from "./features/mandatory/removeGloballyBannedItems/removeGloballyBannedItems";
import * as replacePhotos from "./features/mandatory/replacePhotos";
import * as runTimer from "./features/mandatory/runTimer";
import * as seededDeath from "./features/mandatory/seededDeath/v";
import * as seededDrops from "./features/mandatory/seededDrops";
import * as seededFloors from "./features/mandatory/seededFloors";
import * as seededGBBug from "./features/mandatory/seededGBBug";
import * as seededTeleports from "./features/mandatory/seededTeleports";
import * as streakText from "./features/mandatory/streakText";
import * as tempMoreOptions from "./features/mandatory/tempMoreOptions";
import * as trophy from "./features/mandatory/trophy";
import * as consistentAngels from "./features/optional/bosses/consistentAngels";
import * as fastAngels from "./features/optional/bosses/fastAngels";
import * as fastKrampus from "./features/optional/bosses/fastKrampus";
import * as fastPin from "./features/optional/bosses/fastPin";
import * as fastSatan from "./features/optional/bosses/fastSatan";
import * as killExtraEnemies from "./features/optional/bosses/killExtraEnemies";
import * as preventVictoryLapPopup from "./features/optional/bosses/preventVictoryLapPopup";
import * as battery9VoltSynergy from "./features/optional/bugfix/battery9VoltSynergy";
import * as keeperHeal from "./features/optional/bugfix/keeperHeal";
import * as showEdenStartingItems from "./features/optional/characters/showEdenStartingItems";
import * as globinSoftlock from "./features/optional/enemies/globinSoftlock";
import * as extraStartingItems from "./features/optional/gameplay/extraStartingItems/extraStartingItems";
import * as stickyNickel from "./features/optional/graphics/stickyNickel";
import * as autofire from "./features/optional/hotkeys/autofire";
import * as betterDevilAngelRoomsVars from "./features/optional/major/betterDevilAngelRooms/v";
import * as fastClearVars from "./features/optional/major/fastClear/v";
import * as fastReset from "./features/optional/major/fastReset";
import * as fastTravelVars from "./features/optional/major/fastTravel/v";
import * as freeDevilItem from "./features/optional/major/freeDevilItem";
import * as startWithD6 from "./features/optional/major/startWithD6";
import * as customConsole from "./features/optional/other/customConsole";
import * as roll from "./features/optional/other/roll";
import * as automaticItemInsertion from "./features/optional/quality/automaticItemInsertion/v";
import * as bloodyLustChargeBar from "./features/optional/quality/bloodyLustChargeBar/v";
import * as chargePocketItemFirst from "./features/optional/quality/chargePocketItemFirst";
import * as combinedDualityDoors from "./features/optional/quality/combinedDualityDoors";
import * as fastVanishingTwin from "./features/optional/quality/fastVanishingTwin";
import * as leadPencilChargeBar from "./features/optional/quality/leadPencilChargeBar";
import * as removePerfectionVelocity from "./features/optional/quality/removePerfectionVelocity";
import * as showDreamCatcherItemVars from "./features/optional/quality/showDreamCatcherItem/v";
import * as showMaxFamiliars from "./features/optional/quality/showMaxFamiliars";
import * as showNumSacrifices from "./features/optional/quality/showNumSacrifices";
import * as showPills from "./features/optional/quality/showPills";
import * as speedUpFadeIn from "./features/optional/quality/speedUpFadeIn";
import * as shadows from "./features/race/shadows/shadows";
import * as socketClient from "./features/race/socketClient";
import * as raceVars from "./features/race/v";
import * as season2 from "./features/speedrun/season2/v";
import * as speedrunVars from "./features/speedrun/v";
import * as restartOnNextFrame from "./features/utils/restartOnNextFrame";
import * as roomsEntered from "./features/utils/roomsEntered";
import * as modConfigMenu from "./modConfigMenu";
import * as modConfigMenuVanilla from "./modConfigMenuVanilla";

export function initFeatureVariables(): void {
  // Core
  modConfigMenu.init();
  modConfigMenuVanilla.init();
  debugFunction.init();
  raceVars.init();
  socketClient.init();
  shadows.init();
  planetariumFix.init();
  speedrunVars.init();
  season2.init();
  changeCharOrderVars.init();

  // Util
  restartOnNextFrame.init();
  roomsEntered.init();

  // Mandatory
  streakText.init();
  removeGloballyBannedItems.init();
  removeGlitchedItems.init();
  replacePhotos.init();
  beastPreventEnd.init();
  tempMoreOptions.init();
  seededDrops.init();
  seededTeleports.init();
  seededFloors.init();
  seededGBBug.init();
  runTimer.init();
  trophy.init();
  fireworks.init();
  disableMultiplayer.init();
  drawVersion.init();
  dummyDPS.init();
  errors.init();
  preventSacrificeRoomTeleport.init();
  seededDeath.init();

  // Major
  startWithD6.init();
  fastClearVars.init();
  fastTravelVars.init();
  fastReset.init();
  betterDevilAngelRoomsVars.init();
  freeDevilItem.init();

  // Hotkeys
  autofire.init();

  // Enemies
  globinSoftlock.init();

  // Boss
  killExtraEnemies.init(); // 45, 78
  fastPin.init(); // 62
  fastKrampus.init(); // 81
  fastSatan.init(); // 84
  consistentAngels.init(); // 271, 272
  fastAngels.init(); // 271, 272
  preventVictoryLapPopup.init(); // 273

  // QoL
  showPills.init();
  showNumSacrifices.init();
  showEdenStartingItems.init();
  bloodyLustChargeBar.init(); // 157
  leadPencilChargeBar.init(); // 444
  showDreamCatcherItemVars.init(); // 566
  fastVanishingTwin.init(); // 697
  removePerfectionVelocity.init(); // 145
  showMaxFamiliars.init();
  speedUpFadeIn.init();
  automaticItemInsertion.init();
  chargePocketItemFirst.init();

  // Gameplay
  combinedDualityDoors.init();
  extraStartingItems.init();

  // Bug fixes
  keeperHeal.init();
  battery9VoltSynergy.init();

  // Graphics fixes
  stickyNickel.init();

  // Items
  nLuck.init();
  flipCustom.init();
  sawblade.init();

  // Other
  customConsole.init();
  roll.init();

  // Now that all of the features have been initialized, we can get the save data manager to load
  // data from disk before the first run begins. (This prevents bugs with `isaacscript-watcher` when
  // reloading the mod in the middle of a run.)
  saveDataManagerLoad();
}
