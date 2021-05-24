import * as postPlayerChange from "../customCallbacks/postPlayerChange";
import * as fastDrop from "../features/optional/hotkeys/fastDrop";
import * as fastClearPostUpdates from "../features/optional/major/fastClear/callbacks/postUpdate";
import * as startWithD6 from "../features/optional/major/startWithD6";

export function main(): void {
  // Custom callbacks
  postPlayerChange.postUpdate();

  // Optional features - Major
  startWithD6.postUpdate();
  fastClearPostUpdates.main();
  fastDrop.postUpdate();
}
