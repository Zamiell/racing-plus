import { isFirstPlayer } from "isaacscript-common";
import g from "../../../../globals";
import { insertPickup } from "./insertPickup";
import v from "./v";

export function insertPickupAndUpdateDelta(
  pickup: EntityPickup,
  player: EntityPlayer,
): void {
  // Some pickups cannot be automatically inserted
  const pickupInserted = insertPickup(pickup, player);
  if (pickupInserted !== undefined) {
    // Only remove the pickup if it has been successfully inserted
    pickup.Remove();

    // Track what it inserted so that we can display it on the UI
    updateDelta(player, pickupInserted);
  }
}

function updateDelta(
  player: EntityPlayer,
  pickupInserted: [PickupVariant, int],
) {
  const gameFrameCount = g.g.GetFrameCount();

  // Determining where to draw the UI indicators for players other than the first player is too
  // difficult, so ignore this case
  if (!isFirstPlayer(player)) {
    return;
  }

  const [pickupType, value] = pickupInserted;
  switch (pickupType) {
    case PickupVariant.PICKUP_HEART: {
      if (v.run.delta.bloodOrSoulCharge === null) {
        v.run.delta.bloodOrSoulCharge = 0;
      }
      v.run.delta.bloodOrSoulCharge += value;
      v.run.delta.bloodOrSoulChargeFrame = gameFrameCount;

      return;
    }

    case PickupVariant.PICKUP_COIN: {
      if (v.run.delta.coins === null) {
        v.run.delta.coins = 0;
      }
      v.run.delta.coins += value;
      v.run.delta.coinsFrame = gameFrameCount;

      return;
    }

    case PickupVariant.PICKUP_BOMB: {
      if (v.run.delta.bombs === null) {
        v.run.delta.bombs = 0;
      }
      v.run.delta.bombs += value;
      v.run.delta.bombsFrame = gameFrameCount;

      return;
    }

    case PickupVariant.PICKUP_KEY: {
      if (v.run.delta.keys === null) {
        v.run.delta.keys = 0;
      }
      v.run.delta.keys += value;
      v.run.delta.keysFrame = gameFrameCount;

      return;
    }

    case PickupVariant.PICKUP_TAROTCARD:
    case PickupVariant.PICKUP_PILL: {
      if (v.run.delta.pocketItem === null) {
        v.run.delta.pocketItem = 0;
      }
      v.run.delta.pocketItem += value;
      v.run.delta.pocketItemFrame = gameFrameCount;

      return;
    }

    case PickupVariant.PICKUP_TRINKET: {
      if (v.run.delta.trinket === null) {
        v.run.delta.trinket = 0;
      }
      v.run.delta.trinket += value;
      v.run.delta.trinketFrame = gameFrameCount;

      return;
    }

    default: {
      error("Unknown pickup variant in the updateDelta");
    }
  }
}
