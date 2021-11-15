import { config } from "../../../../../modConfigMenu";
import * as extraStartingItems from "../extraStartingItems";
import * as replacePlaceholdersOnEden from "../replacePlaceholdersOnEden";

export function extraStartingItemsPostGameStarted(): void {
  if (!config.extraStartingItems) {
    return;
  }

  replacePlaceholdersOnEden.postGameStarted();
  extraStartingItems.postGameStarted();
}
