import * as debugPowers from "../features/mandatory/debugPowers";
import * as fireworks from "../features/mandatory/fireworks";
import * as preventItemRotate from "../features/mandatory/preventItemRotate";
import * as runTimer from "../features/mandatory/runTimer";
import * as showLevelText from "../features/mandatory/showLevelText";
import * as trophy from "../features/mandatory/trophy";
import * as fastDrop from "../features/optional/hotkeys/fastDrop";
import fastClearPostUpdate from "../features/optional/major/fastClear/callbacks/postUpdate";
import * as startWithD6 from "../features/optional/major/startWithD6";
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
  startWithD6.postUpdate();
  fastClearPostUpdate();
  fastDrop.postUpdate();

  // Quality of life
  showPills.postUpdate();
  showMaxFamiliars.postUpdate();
}
