import { isChildPlayer } from "isaacscript-common";
import * as sawblade from "../features/items/sawblade";
import fastTravelPostPlayerUpdate from "../features/optional/major/fastTravel/callbacks/postPlayerUpdate";
import * as startWithD6 from "../features/optional/major/startWithD6";
import * as chargePocketItemFirst from "../features/optional/quality/chargePocketItemFirst";
import * as combinedDualityDoors from "../features/optional/quality/combinedDualityDoors";

export function main(player: EntityPlayer): void {
  if (isChildPlayer(player)) {
    return;
  }

  // Core
  sawblade.postPlayerUpdate(player);

  // Major features
  startWithD6.postPlayerUpdate(player);
  fastTravelPostPlayerUpdate(player);

  // Gameplay changes
  combinedDualityDoors.postPlayerUpdate(player);

  // Quality of life
  chargePocketItemFirst.postPlayerUpdate(player);
}
