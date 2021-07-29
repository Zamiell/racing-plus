import * as itemPickup from "../customCallbacks/itemPickup";
import * as postEsauJr from "../customCallbacks/postEsauJr";
import * as postGridEntityUpdate from "../customCallbacks/postGridEntityUpdate";
import * as postPlayerChange from "../customCallbacks/postPlayerChange";
import * as postRoomClear from "../customCallbacks/postRoomClear";
import * as postTransformation from "../customCallbacks/postTransformation";
import { debugLog } from "../debugLog";
import * as fireworks from "../features/mandatory/fireworks";
import * as runTimer from "../features/mandatory/runTimer";
import * as showLevelText from "../features/mandatory/showLevelText";
import * as taintedIsaacStuckItems from "../features/mandatory/taintedIsaacStuckItems";
import * as trophy from "../features/mandatory/trophy";
import * as fastDrop from "../features/optional/hotkeys/fastDrop";
import fastClearPostUpdate from "../features/optional/major/fastClear/callbacks/postUpdate";
import * as startWithD6 from "../features/optional/major/startWithD6";
import * as showMaxFamiliars from "../features/optional/quality/showMaxFamiliars";
import * as showPills from "../features/optional/quality/showPills";
import racePostUpdate from "../features/race/callbacks/postUpdate";

export function main(): void {
  debugLog("MC_POST_UPDATE", true);

  // Custom callbacks
  postRoomClear.postUpdate(); // This must be before postGridEntityUpdate
  postGridEntityUpdate.postUpdate();
  postPlayerChange.postUpdate();
  postTransformation.postUpdate();
  itemPickup.postUpdate();
  postEsauJr.postUpdate();

  // Mandatory features
  trophy.postUpdate();
  fireworks.postUpdate();
  showLevelText.postUpdate();
  runTimer.postUpdate();
  taintedIsaacStuckItems.postUpdate();

  // Major features
  racePostUpdate();
  startWithD6.postUpdate();
  fastClearPostUpdate();
  fastDrop.postUpdate();

  // Quality of life
  showPills.postUpdate();
  showMaxFamiliars.postUpdate();

  debugLog("MC_POST_UPDATE", false);
}
