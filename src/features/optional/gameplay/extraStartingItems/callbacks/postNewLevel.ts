import { config } from "../../../../../modConfigMenu";
import * as extraStartingItems from "../extraStartingItems";

export function extraStartingItemsPostNewLevel(): void {
  if (!config.extraStartingItems) {
    return;
  }

  extraStartingItems.postNewLevel();
}
