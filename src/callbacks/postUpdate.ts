import * as fastClearPostUpdates from "../features/fastClear/callbacks/postUpdate";
import * as fastDrop from "../features/fastDrop";

export function main(): void {
  fastClearPostUpdates.main();
  fastDrop.postUpdate();
}
