import * as ghostForm from "../customCallbacks/ghostForm";
import * as postPlayerChange from "../customCallbacks/postPlayerChange";
import * as postRoomClear from "../customCallbacks/postRoomClear";
import * as fastDrop from "../features/optional/hotkeys/fastDrop";
import * as fastClearPostUpdates from "../features/optional/major/fastClear/callbacks/postUpdate";
import * as startWithD6 from "../features/optional/major/startWithD6";

export function main(): void {
  // Custom callbacks
  postPlayerChange.postUpdate();
  postRoomClear.postUpdate();
  ghostForm.postUpdate();

  // Optional features - Major
  startWithD6.postUpdate();
  fastClearPostUpdates.main();
  fastDrop.postUpdate();
}
