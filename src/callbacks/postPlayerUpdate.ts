import { isChildPlayer } from "isaacscript-common";
import { fastTravelPostPlayerUpdate } from "../features/optional/major/fastTravel/callbacks/postPlayerUpdate";
import * as startWithD6 from "../features/optional/major/startWithD6";
import * as roll from "../features/optional/other/roll";
import * as chargePocketItemFirst from "../features/optional/quality/chargePocketItemFirst";
import * as combinedDualityDoors from "../features/optional/quality/combinedDualityDoors";

export function main(player: EntityPlayer): void {
  if (isChildPlayer(player)) {
    return;
  }

  // Major
  startWithD6.postPlayerUpdate(player);
  fastTravelPostPlayerUpdate(player);

  // Gameplay
  combinedDualityDoors.postPlayerUpdate(player);

  // QoL
  chargePocketItemFirst.postPlayerUpdate(player);

  // Other
  roll.postPlayerUpdate(player);
}
