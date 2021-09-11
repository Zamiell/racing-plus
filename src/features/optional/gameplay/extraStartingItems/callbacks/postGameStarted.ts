import { config } from "../../../../../modConfigMenu";
import * as extraStartingItems from "../extraStartingItems";
import * as replacePlaceholdersOnEden from "../replacePlaceholdersOnEden";

export default function extraStartingItemsPostGameStarted(): void {
  if (!config.extraStartingItems) {
    return;
  }

  replacePlaceholdersOnEden.postGameStarted();
  extraStartingItems.postGameStarted();
}
