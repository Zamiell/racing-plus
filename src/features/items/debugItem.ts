import { debugFunction } from "../../debug";

// ModCallback.POST_USE_ITEM (3)
// CollectibleTypeCustom.DEBUG
export function postUseItemDebug(): boolean {
  debugFunction();
  return true; // Display the "use" animation
}
