import * as beastPreventEnd from "./features/mandatory/beastPreventEnd";
import * as debugPowers from "./features/mandatory/debugPowers";
import * as errors from "./features/mandatory/errors";
import * as fireworks from "./features/mandatory/fireworks";
import * as preventItemRotate from "./features/mandatory/preventItemRotate";
import * as replacePhotos from "./features/mandatory/replacePhotos";
import * as seededTeleports from "./features/mandatory/seededTeleports";
import * as streakText from "./features/mandatory/streakText";
import * as tempMoreOptions from "./features/mandatory/tempMoreOptions";
import * as trophy from "./features/mandatory/trophy";
import * as fastClearVars from "./features/optional/major/fastClear/v";
import * as fastReset from "./features/optional/major/fastReset";
import * as fastTravelVars from "./features/optional/major/fastTravel/v";
import * as freeDevilItem from "./features/optional/major/freeDevilItem";
import * as startWithD6 from "./features/optional/major/startWithD6";
import * as showDreamCatcherItemVars from "./features/optional/quality/showDreamCatcherItem/v";
import * as showEdenStartingItems from "./features/optional/quality/showEdenStartingItems";
import * as showMaxFamiliars from "./features/optional/quality/showMaxFamiliars";
import * as showNumSacrifices from "./features/optional/quality/showNumSacrifices";
import * as showPills from "./features/optional/quality/showPills";
import * as raceVars from "./features/race/v";
import * as speedrunVars from "./features/speedrun/v";
import * as modConfigMenu from "./modConfigMenu";

export default function initFeatureVariables(): void {
  modConfigMenu.init();
  raceVars.init();
  speedrunVars.init();

  // Mandatory features
  streakText.init();
  replacePhotos.init();
  preventItemRotate.init();
  beastPreventEnd.init();
  tempMoreOptions.init();
  seededTeleports.init();
  trophy.init();
  fireworks.init();
  debugPowers.init();
  errors.init();

  // Major features
  startWithD6.init();
  fastClearVars.init();
  fastTravelVars.init();
  fastReset.init();
  freeDevilItem.init();

  // Quality of life
  showPills.init();
  showNumSacrifices.init();
  showEdenStartingItems.init();
  showDreamCatcherItemVars.init();
  showMaxFamiliars.init();
}
