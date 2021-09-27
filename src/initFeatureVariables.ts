import * as changeCharOrderVars from "./features/changeCharOrder/v";
import * as beastPreventEnd from "./features/mandatory/beastPreventEnd";
import * as debugPowers from "./features/mandatory/debugPowers";
import * as disableMultiplayer from "./features/mandatory/disableMultiplayer";
import * as drawVersion from "./features/mandatory/drawVersion";
import * as dummyDPS from "./features/mandatory/dummyDPS";
import * as errors from "./features/mandatory/errors";
import * as fireworks from "./features/mandatory/fireworks";
import * as preventItemRotate from "./features/mandatory/preventItemRotate";
import * as removeGlitchedItems from "./features/mandatory/removeGlitchedItems";
import * as removeGloballyBannedItems from "./features/mandatory/removeGloballyBannedItems/removeGloballyBannedItems";
import * as replacePhotos from "./features/mandatory/replacePhotos";
import * as runTimer from "./features/mandatory/runTimer";
import * as seededDrops from "./features/mandatory/seededDrops";
import * as seededFloors from "./features/mandatory/seededFloors";
import * as seededGBBug from "./features/mandatory/seededGBBug";
import * as seededTeleports from "./features/mandatory/seededTeleports";
import * as streakText from "./features/mandatory/streakText";
import * as tempMoreOptions from "./features/mandatory/tempMoreOptions";
import * as trophy from "./features/mandatory/trophy";
import * as consistentAngels from "./features/optional/bosses/consistentAngels";
import * as fastPin from "./features/optional/bosses/fastPin";
import * as killExtraEnemies from "./features/optional/bosses/killExtraEnemies";
import * as battery9VoltSynergy from "./features/optional/bugfix/battery9VoltSynergy";
import * as showEdenStartingItems from "./features/optional/characters/showEdenStartingItems";
import * as extraStartingItems from "./features/optional/gameplay/extraStartingItems/extraStartingItems";
import * as autofire from "./features/optional/hotkeys/autofire";
import * as betterDevilAngelRoomsVars from "./features/optional/major/betterDevilAngelRooms/v";
import * as fastClearVars from "./features/optional/major/fastClear/v";
import * as fastReset from "./features/optional/major/fastReset";
import * as fastTravelVars from "./features/optional/major/fastTravel/v";
import * as freeDevilItem from "./features/optional/major/freeDevilItem";
import * as startWithD6 from "./features/optional/major/startWithD6";
import * as customConsole from "./features/optional/other/customConsole";
import * as automaticItemInsertion from "./features/optional/quality/automaticItemInsertion/automaticItemInsertion";
import * as chargePocketItemFirst from "./features/optional/quality/chargePocketItemFirst";
import * as combinedDualityDoors from "./features/optional/quality/combinedDualityDoors";
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
import * as characterProgress from "./features/speedrun/characterProgress";
import * as speedrunVars from "./features/speedrun/v";
import * as detectSlideAnimation from "./features/util/detectSlideAnimation";
import * as restartOnNextFrame from "./features/util/restartOnNextFrame";
import * as roomsEntered from "./features/util/roomsEntered";
import * as modConfigMenu from "./modConfigMenu";
import * as passiveItemsForEden from "./passiveItemsForEden";

export default function initFeatureVariables(): void {
  // Core
  modConfigMenu.init();
  raceVars.init();
  socketClient.init();
  shadows.init();
  speedrunVars.init();
  changeCharOrderVars.init();
  characterProgress.init();
  passiveItemsForEden.init();

  // Util
  detectSlideAnimation.init();
  restartOnNextFrame.init();
  roomsEntered.init();

  // Mandatory
  streakText.init();
  removeGloballyBannedItems.init();
  removeGlitchedItems.init();
  replacePhotos.init();
  preventItemRotate.init();
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
  debugPowers.init();
  errors.init();

  // Major
  startWithD6.init();
  fastClearVars.init();
  fastTravelVars.init();
  fastReset.init();
  betterDevilAngelRoomsVars.init();
  freeDevilItem.init();

  // Hotkeys
  autofire.init();

  // Boss
  killExtraEnemies.init();
  fastPin.init();
  consistentAngels.init();

  // QoL
  showPills.init();
  showNumSacrifices.init();
  showEdenStartingItems.init();
  leadPencilChargeBar.init();
  showDreamCatcherItemVars.init();
  showMaxFamiliars.init();
  speedUpFadeIn.init();
  automaticItemInsertion.init();
  removePerfectionVelocity.init();
  chargePocketItemFirst.init();

  // Gameplay
  combinedDualityDoors.init();
  extraStartingItems.init();

  // Bug fixes
  battery9VoltSynergy.init();

  // Other
  customConsole.init();
}
