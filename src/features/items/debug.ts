import { debugFunction } from "../../debugFunction";

// ModCallbacks.MC_USE_ITEM (3)
// CollectibleTypeCustom.COLLECTIBLE_DEBUG
export function useItemDebug(): boolean {
  debugFunction();
  return true; // Display the "use" animation
}
