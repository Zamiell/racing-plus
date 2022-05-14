import { debugFunction } from "../../debugFunction";

// ModCallback.POST_USE_ITEM (3)
// CollectibleTypeCustom.DEBUG
export function useItemDebug(): boolean {
  debugFunction();
  return true; // Display the "use" animation
}
