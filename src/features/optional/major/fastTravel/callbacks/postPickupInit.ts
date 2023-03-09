import * as bc from "../../../../../classes/features/optional/major/fastTravel/bigChest";
import { config } from "../../../../../modConfigMenu";

export function bigChest(pickup: EntityPickup): void {
  if (!config.FastTravel) {
    return;
  }

  bc.postPickupInitBigChest(pickup);
}
