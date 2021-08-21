import changeCharOrderPostUpdate from "../features/changeCharOrder/callbacks/postUpdate";
import * as debugPowers from "../features/mandatory/debugPowers";
import * as fireworks from "../features/mandatory/fireworks";
import * as preventItemRotate from "../features/mandatory/preventItemRotate";
import * as runTimer from "../features/mandatory/runTimer";
import * as showLevelText from "../features/mandatory/showLevelText";
import * as trophy from "../features/mandatory/trophy";
import * as combinedDualityDoors from "../features/optional/gameplay/combinedDualityDoors";
import extraStartingItemsPostUpdate from "../features/optional/gameplay/extraStartingItems/callbacks/postUpdate";
import * as fastDrop from "../features/optional/hotkeys/fastDrop";
import fastClearPostUpdate from "../features/optional/major/fastClear/callbacks/postUpdate";
import fastTravelPostUpdate from "../features/optional/major/fastTravel/callbacks/postUpdate";
import * as showMaxFamiliars from "../features/optional/quality/showMaxFamiliars";
import * as showPills from "../features/optional/quality/showPills";
import racePostUpdate from "../features/race/callbacks/postUpdate";
import speedrunPostUpdate from "../features/speedrun/callbacks/postUpdate";

export function main(): void {
  // Mandatory features
  trophy.postUpdate();
  fireworks.postUpdate();
  showLevelText.postUpdate();
  runTimer.postUpdate();
  preventItemRotate.postUpdate();
  debugPowers.postUpdate();

  // Major features
  racePostUpdate();
  speedrunPostUpdate();
  changeCharOrderPostUpdate();
  fastClearPostUpdate();
  fastTravelPostUpdate();
  fastDrop.postUpdate();

  // Quality of life
  showPills.postUpdate();
  showMaxFamiliars.postUpdate();

  // Gameplay changes
  combinedDualityDoors.postUpdate();
  extraStartingItemsPostUpdate();
}
