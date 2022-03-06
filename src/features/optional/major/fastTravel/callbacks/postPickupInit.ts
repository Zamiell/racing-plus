import { config } from "../../../../../modConfigMenu";
import * as bc from "../bigChest";

export function bigChest(pickup: EntityPickup): void {
  if (!config.fastTravel) {
    return;
  }

  bc.postPickupInitBigChest(pickup);
}
