import * as sawblade from "../features/items/sawblade";
import * as startWithD6 from "../features/optional/major/startWithD6";

export function main(player: EntityPlayer): void {
  // Core
  sawblade.postPlayerInit(player);

  // Major features
  startWithD6.postPlayerInit(player);
}
