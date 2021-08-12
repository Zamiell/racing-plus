import * as sawblade from "../features/items/sawblade";
import fastTravelPostPlayerUpdate from "../features/optional/major/fastTravel/callbacks/postPlayerUpdate";

export function main(player: EntityPlayer): void {
  fastTravelPostPlayerUpdate(player);
  sawblade.postPlayerUpdate(player);
}
