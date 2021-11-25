import * as debugFunction from "../debugFunction";
import { changeCharOrderPostUpdate } from "../features/changeCharOrder/callbacks/postUpdate";
import * as debugPowers from "../features/mandatory/debugPowers";
import * as fireworks from "../features/mandatory/fireworks";
import * as runTimer from "../features/mandatory/runTimer";
import * as showLevelText from "../features/mandatory/showLevelText";
import * as trophy from "../features/mandatory/trophy";
import * as battery9VoltSynergy from "../features/optional/bugfix/battery9VoltSynergy";
import { extraStartingItemsPostUpdate } from "../features/optional/gameplay/extraStartingItems/callbacks/postUpdate";
import { fastClearPostUpdate } from "../features/optional/major/fastClear/callbacks/postUpdate";
import * as showMaxFamiliars from "../features/optional/quality/showMaxFamiliars";
import * as showPills from "../features/optional/quality/showPills";
import { racePostUpdate } from "../features/race/callbacks/postUpdate";
import { speedrunPostUpdate } from "../features/speedrun/callbacks/postUpdate";

export function main(): void {
  // Mandatory
  trophy.postUpdate();
  fireworks.postUpdate();
  showLevelText.postUpdate();
  runTimer.postUpdate();
  debugPowers.postUpdate();
  debugFunction.postUpdate();

  // Major
  racePostUpdate();
  speedrunPostUpdate();
  changeCharOrderPostUpdate();
  fastClearPostUpdate();

  // QoL
  showPills.postUpdate();
  showMaxFamiliars.postUpdate();

  // Gameplay
  extraStartingItemsPostUpdate();

  // Bug fixes
  battery9VoltSynergy.postUpdate();
}
