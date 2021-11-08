import { config } from "../../../../../modConfigMenu";
import * as extraStartingItems from "../extraStartingItems";

export function extraStartingItemsPostUpdate(): void {
  if (!config.extraStartingItems) {
    return;
  }

  extraStartingItems.postUpdate();
}
