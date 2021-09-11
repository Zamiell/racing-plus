// Saving & quitting in a Genesis room will reset the "options" property of all of the item
// pedestals
// Prevent players from abusing this by deleting all item pedestals in the room upon re-entry

import { inGenesisRoom } from "isaacscript-common";
import { removeAllCollectibles } from "../../util";

export function postGameStartedContinued(): void {
  if (inGenesisRoom()) {
    removeAllCollectibles();
  }
}