import { initTransformationTracking } from "isaacscript-common";
import * as changeCharOrderVars from "./features/changeCharOrder/v";
import * as sawblade from "./features/items/sawblade";
import * as beastPreventEnd from "./features/mandatory/beastPreventEnd";
import * as debugPowers from "./features/mandatory/debugPowers";
import * as detectSlideAnimation from "./features/mandatory/detectSlideAnimation";
import * as errors from "./features/mandatory/errors";
import * as fireworks from "./features/mandatory/fireworks";
import * as preventItemRotate from "./features/mandatory/preventItemRotate";
import * as removeGlitchedItems from "./features/mandatory/removeGlitchedItems";
import * as replacePhotos from "./features/mandatory/replacePhotos";
import * as runTimer from "./features/mandatory/runTimer";
import * as seededDrops from "./features/mandatory/seededDrops";
import * as seededTeleports from "./features/mandatory/seededTeleports";
import * as streakText from "./features/mandatory/streakText";
import * as switchForgotten from "./features/mandatory/switchForgotten";
import * as tempMoreOptions from "./features/mandatory/tempMoreOptions";
import * as trophy from "./features/mandatory/trophy";
import * as betterDevilAngelRoomsVars from "./features/optional/major/betterDevilAngelRooms/v";
import * as fastClearVars from "./features/optional/major/fastClear/v";
import * as fastReset from "./features/optional/major/fastReset";
import * as fastTravelVars from "./features/optional/major/fastTravel/v";
import * as freeDevilItem from "./features/optional/major/freeDevilItem";
import * as startWithD6 from "./features/optional/major/startWithD6";
import * as automaticItemInsertion from "./features/optional/quality/automaticItemInsertion/automaticItemInsertion";
import * as showDreamCatcherItemSprites from "./features/optional/quality/showDreamCatcherItem/sprites";
import * as showDreamCatcherItemVars from "./features/optional/quality/showDreamCatcherItem/v";
import * as showEdenStartingItems from "./features/optional/quality/showEdenStartingItems";
import * as showMaxFamiliars from "./features/optional/quality/showMaxFamiliars";
import * as showNumSacrifices from "./features/optional/quality/showNumSacrifices";
import * as showPills from "./features/optional/quality/showPills";
import * as speedUpFadeIn from "./features/optional/quality/speedUpFadeIn";
import * as socketClient from "./features/race/socketClient";
import * as raceVars from "./features/race/v";
import * as characterProgress from "./features/speedrun/characterProgress";
import * as speedrunVars from "./features/speedrun/v";
import * as globals from "./globals";
import * as modConfigMenu from "./modConfigMenu";

export default function initFeatureVariables(): void {
  // IsaacScript features
  initTransformationTracking();

  // Core
  modConfigMenu.init();
  globals.init();
  raceVars.init();
  socketClient.init();
  speedrunVars.init();
  changeCharOrderVars.init();
  characterProgress.init();
  sawblade.init();

  // Mandatory features
  streakText.init();
  removeGlitchedItems.init();
  replacePhotos.init();
  preventItemRotate.init();
  beastPreventEnd.init();
  tempMoreOptions.init();
  seededDrops.init();
  seededTeleports.init();
  runTimer.init();
  switchForgotten.init();
  detectSlideAnimation.init();
  trophy.init();
  fireworks.init();
  debugPowers.init();
  errors.init();

  // Major features
  startWithD6.init();
  fastClearVars.init();
  fastTravelVars.init();
  fastReset.init();
  betterDevilAngelRoomsVars.init();
  freeDevilItem.init();

  // Quality of life
  showPills.init();
  showNumSacrifices.init();
  showEdenStartingItems.init();
  showDreamCatcherItemVars.init();
  showDreamCatcherItemSprites.init();
  showMaxFamiliars.init();
  speedUpFadeIn.init();
  automaticItemInsertion.init();
}
