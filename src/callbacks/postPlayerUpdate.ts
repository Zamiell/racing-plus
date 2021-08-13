import * as sawblade from "../features/items/sawblade";
import fastTravelPostPlayerUpdate from "../features/optional/major/fastTravel/callbacks/postPlayerUpdate";
import * as startWithD6 from "../features/optional/major/startWithD6";

export function main(player: EntityPlayer): void {
  // Core
  sawblade.postPlayerUpdate(player);

  // Major features
  startWithD6.postPlayerUpdate(player);
  fastTravelPostPlayerUpdate(player);
}
