import { PickupVariant } from "isaac-typescript-definitions";
import { isFirstPlayer, isKeeper } from "isaacscript-common";
import g from "../../../../globals";
import { insertPickup } from "./insertPickup";
import v from "./v";

export function insertPickupAndUpdateDelta(
  pickup: EntityPickup,
  player: EntityPlayer,
): void {
  const hearts = player.GetHearts();

  // Some pickups cannot be automatically inserted.
  const pickupInserted = insertPickup(pickup, player);
  if (pickupInserted !== undefined) {
    // Mark that we are removing this pickup by hijacking the vanilla "Touched" property.
    // This is necessary for inserting multiple pickups from the UseCard callback.
    pickup.Touched = true;

    // Only remove the pickup if it has been successfully inserted.
    pickup.Remove();

    // Track what it inserted so that we can display it on the UI.
    updateDelta(player, pickupInserted, hearts);
  }
}

function updateDelta(
  player: EntityPlayer,
  pickupInserted: [PickupVariant, int],
  oldHearts: int,
) {
  const gameFrameCount = g.g.GetFrameCount();

  // Determining where to draw the UI indicators for players other than the first player is too
  // difficult, so ignore this case.
  if (!isFirstPlayer(player)) {
    return;
  }

  const [pickupType, value] = pickupInserted;
  switch (pickupType) {
    case PickupVariant.HEART: {
      if (v.run.delta.bloodOrSoulCharge === null) {
        v.run.delta.bloodOrSoulCharge = 0;
      }
      v.run.delta.bloodOrSoulCharge += value;
      v.run.delta.bloodOrSoulChargeFrame = gameFrameCount;

      return;
    }

    case PickupVariant.COIN: {
      const hearts = player.GetHearts();
      const heartDelta = hearts - oldHearts;
      if (isKeeper(player) && heartDelta > 0) {
        // The coin that we just inserted healed Keeper by one or more coin containers.
        return;
      }

      if (v.run.delta.coins === null) {
        v.run.delta.coins = 0;
      }
      v.run.delta.coins += value;
      v.run.delta.coinsFrame = gameFrameCount;

      return;
    }

    case PickupVariant.BOMB: {
      if (v.run.delta.bombs === null) {
        v.run.delta.bombs = 0;
      }
      v.run.delta.bombs += value;
      v.run.delta.bombsFrame = gameFrameCount;

      return;
    }

    case PickupVariant.KEY: {
      if (v.run.delta.keys === null) {
        v.run.delta.keys = 0;
      }
      v.run.delta.keys += value;
      v.run.delta.keysFrame = gameFrameCount;

      return;
    }

    case PickupVariant.TAROT_CARD:
    case PickupVariant.PILL: {
      if (v.run.delta.pocketItem === null) {
        v.run.delta.pocketItem = 0;
      }
      v.run.delta.pocketItem += value;
      v.run.delta.pocketItemFrame = gameFrameCount;

      return;
    }

    case PickupVariant.TRINKET: {
      if (v.run.delta.trinket === null) {
        v.run.delta.trinket = 0;
      }
      v.run.delta.trinket += value;
      v.run.delta.trinketFrame = gameFrameCount;

      return;
    }

    default: {
      error(
        `Unknown pickup variant of "${pickupType}" in the updateDelta function.`,
      );
    }
  }
}
