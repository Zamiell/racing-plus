import * as itemPickup from "../customCallbacks/itemPickup";
import * as postGridEntityUpdate from "../customCallbacks/postGridEntityUpdate";
import * as postPlayerChange from "../customCallbacks/postPlayerChange";
import * as postRoomClear from "../customCallbacks/postRoomClear";
import * as postTransformation from "../customCallbacks/postTransformation";
import * as runTimer from "../features/mandatory/runTimer";
import * as showLevelText from "../features/mandatory/showLevelText";
import * as fastDrop from "../features/optional/hotkeys/fastDrop";
import * as fastClearPostUpdate from "../features/optional/major/fastClear/callbacks/postUpdate";
import * as startWithD6 from "../features/optional/major/startWithD6";
import * as showMaxFamiliars from "../features/optional/quality/showMaxFamiliars";
import * as showPills from "../features/optional/quality/showPills";

export function main(): void {
  // Custom callbacks
  postRoomClear.postUpdate(); // This must be before postGridEntityUpdate
  postGridEntityUpdate.postUpdate();
  postPlayerChange.postUpdate();
  postTransformation.postUpdate();
  itemPickup.postUpdate();

  // Mandatory features
  showLevelText.postUpdate();
  runTimer.postUpdate();

  // Major features
  startWithD6.postUpdate();
  fastClearPostUpdate.main();
  fastDrop.postUpdate();

  // QoL
  showPills.postUpdate();
  showMaxFamiliars.postUpdate();
}
