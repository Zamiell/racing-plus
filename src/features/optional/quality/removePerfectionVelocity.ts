// Since the Perfection trinket spawns with a velocity,
// it can sometimes go over pits and become inaccessible

import { saveDataManager } from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";
import { findFreePosition } from "../../../utilGlobals";

const v = {
  run: {
    spawnedPerfection: false,
  },
};

export function init(): void {
  saveDataManager("removePerfectionVelocity", v, featureEnabled);
}

function featureEnabled() {
  return config.removePerfectionVelocity;
}

// ModCallbacks.MC_POST_PICKUP_INIT (34)
// PickupVariant.PICKUP_TRINKET (350)
export function postPickupInitTrinket(pickup: EntityPickup): void {
  if (!config.removePerfectionVelocity) {
    return;
  }

  if (pickup.SubType !== TrinketType.TRINKET_PERFECTION) {
    return;
  }

  if (v.run.spawnedPerfection) {
    return;
  }

  // Normally, the Perfection trinket will be flung outward from the location of the boss
  // Instead, set it to be a free tile near the center of the room
  // This is guaranteed to be accessible because there are no boss rooms that have divided islands
  const centerPos = g.r.GetCenterPos();
  pickup.Position = findFreePosition(centerPos);
  pickup.Velocity = Vector.Zero;

  v.run.spawnedPerfection = true;
}
