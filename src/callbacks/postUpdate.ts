import * as fastDrop from "../features/optional/hotkeys/fastDrop";
import * as fastClearPostUpdates from "../features/optional/major/fastClear/callbacks/postUpdate";

export function main(): void {
  fastClearPostUpdates.main();
  fastDrop.postUpdate();
}
