import { config } from "../../../../../modConfigMenu";
import * as extraStartingItems from "../extraStartingItems";

export function extraStartingItemsPostGameStarted(): void {
  if (!config.ExtraStartingItems) {
    return;
  }

  extraStartingItems.postGameStarted();
}
