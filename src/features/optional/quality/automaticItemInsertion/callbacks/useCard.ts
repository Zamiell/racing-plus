import {
  getClosestEntityTo,
  getPickups,
  initArray,
  isBethany,
  repeat,
} from "isaacscript-common";
import { config } from "../../../../../modConfigMenu";
import { insertPickupAndUpdateDelta } from "../automaticItemInsertion";

// Card.CARD_HIEROPHANT (6)
export function automaticItemInsertionUseCardHierophant(
  player: EntityPlayer,
): void {
  if (!config.automaticItemInsertion) {
    return;
  }

  const character = player.GetPlayerType();

  if (character !== PlayerType.PLAYER_BETHANY) {
    return;
  }

  addHeartsOnBethanys(player);
}

// Card.CARD_LOVERS (7)
export function automaticItemInsertionUseCardLovers(
  player: EntityPlayer,
): void {
  if (!config.automaticItemInsertion) {
    return;
  }

  const character = player.GetPlayerType();

  if (character !== PlayerType.PLAYER_BETHANY_B) {
    return;
  }

  addHeartsOnBethanys(player);
}

function addHeartsOnBethanys(player: EntityPlayer) {
  // The PostPickupInit callback fires before this one, so we cannot use the existing queue system
  // to automatically insert items
  // Instead, find the nearest hearts to the player
  const hasTarotCloth = player.HasCollectible(
    CollectibleType.COLLECTIBLE_TAROT_CLOTH,
  );
  const numHearts = hasTarotCloth ? 3 : 2;
  const pickupVariants = initArray(PickupVariant.PICKUP_HEART, numHearts);

  for (const pickupVariant of pickupVariants) {
    const pickup = getClosestPickupToPlayer(player, pickupVariant);
    if (pickup !== null) {
      insertPickupAndUpdateDelta(pickup, player);
    }
  }
}

// Card.CARD_JUSTICE (9)
export function automaticItemInsertionUseCardJustice(
  player: EntityPlayer,
): void {
  if (!config.automaticItemInsertion) {
    return;
  }

  // The PostPickupInit callback fires before this one, so we cannot use the existing queue system
  // to automatically insert items
  // Instead, find the nearest coin, bomb, and key to the player
  const hasTarotCloth = player.HasCollectible(
    CollectibleType.COLLECTIBLE_TAROT_CLOTH,
  );
  const numEachPickup = hasTarotCloth ? 2 : 1;
  const pickupVariants: PickupVariant[] = [];
  repeat(numEachPickup, () => {
    pickupVariants.push(
      PickupVariant.PICKUP_COIN, // 20
      PickupVariant.PICKUP_KEY, // 30
      PickupVariant.PICKUP_BOMB, // 40
    );

    if (isBethany(player)) {
      pickupVariants.push(PickupVariant.PICKUP_HEART);
    }
  });

  for (const pickupVariant of pickupVariants) {
    const pickup = getClosestPickupToPlayer(player, pickupVariant);
    if (pickup !== null) {
      insertPickupAndUpdateDelta(pickup, player);
    }
  }
}

function getClosestPickupToPlayer(
  player: EntityPlayer,
  pickupVariant: PickupVariant,
) {
  const pickups = getPickups(pickupVariant);
  const filteredPickups = pickups.filter(
    (pickup) =>
      pickup.Price === 0 &&
      // We set the vanilla "Touched" property to true if we have already inserted this pickup
      !pickup.Touched &&
      !pickup.GetSprite().IsPlaying("Collect"),
  );

  return getClosestEntityTo(player, filteredPickups);
}
