import * as moreStartingItems from "../moreStartingItems";
import * as replacePlaceholdersOnEden from "../replacePlaceholdersOnEden";

export default function moreStartingItemsPostGameStarted(): void {
  replacePlaceholdersOnEden.postGameStarted();
  moreStartingItems.postGameStarted();
}
