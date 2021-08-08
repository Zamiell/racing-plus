import * as replacePhotos from "./features/mandatory/replacePhotos";
import * as taintedIsaacStuckItems from "./features/mandatory/taintedIsaacStuckItems";
import * as fastClearVars from "./features/optional/major/fastClear/v";
import * as fastTravelVars from "./features/optional/major/fastTravel/v";
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
  replacePhotos.init();
  taintedIsaacStuckItems.init();

  // Major features
  fastClearVars.init();
  fastTravelVars.init();

  // QoL
  showPills.init();
  showNumSacrifices.init();
}
