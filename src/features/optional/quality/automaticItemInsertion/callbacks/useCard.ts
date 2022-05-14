import {
  CollectibleType,
  PickupVariant,
  PlayerType,
} from "isaac-typescript-definitions";
import {
  anyPlayerIs,
  getClosestEntityTo,
  getPickups,
  initArray,
  isBethany,
  isCharacter,
  repeat,
} from "isaacscript-common";
import { config } from "../../../../../modConfigMenu";
import { insertPickupAndUpdateDelta } from "../automaticItemInsertion";

// Card.HIEROPHANT (6)
export function automaticItemInsertionUseCardHierophant(
  player: EntityPlayer,
): void {
  if (!config.automaticItemInsertion) {
    return;
  }

  if (!isCharacter(player, PlayerType.BETHANY)) {
    return;
  }

  addHeartsOnBethanys(player);
}

// Card.LOVERS (7)
export function automaticItemInsertionUseCardLovers(
  player: EntityPlayer,
): void {
  if (!config.automaticItemInsertion) {
    return;
  }

  if (!isCharacter(player, PlayerType.BETHANY_B)) {
    return;
  }

  addHeartsOnBethanys(player);
}

function addHeartsOnBethanys(player: EntityPlayer) {
  // The PostPickupInit callback fires before this one, so we cannot use the existing queue system
  // to automatically insert items.
  // Instead, find the nearest hearts to the player.
  const hasTarotCloth = player.HasCollectible(CollectibleType.TAROT_CLOTH);
  const numHearts = hasTarotCloth ? 3 : 2;
  const pickupVariants = initArray(PickupVariant.HEART, numHearts);

  for (const pickupVariant of pickupVariants) {
    const pickup = getClosestPickupToPlayer(player, pickupVariant);
    if (pickup !== undefined) {
      insertPickupAndUpdateDelta(pickup, player);
    }
  }
}

// Card.JUSTICE (9)
export function automaticItemInsertionUseCardJustice(
  player: EntityPlayer,
): void {
  if (!config.automaticItemInsertion) {
    return;
  }

  // The PostPickupInit callback fires before this one, so we cannot use the existing queue system
  // to automatically insert items.
  // Instead, find the nearest coin, bomb, and key to the player.
  const pickups = getPickupsFromJusticeCard(player);
  for (const pickup of pickups) {
    insertPickupAndUpdateDelta(pickup, player);
  }
}

function getPickupsFromJusticeCard(player: EntityPlayer) {
  const hasTarotCloth = player.HasCollectible(CollectibleType.TAROT_CLOTH);
  const numEachPickup = hasTarotCloth ? 2 : 1;

  const pickupVariants: PickupVariant[] = [];
  repeat(numEachPickup, () => {
    pickupVariants.push(
      PickupVariant.COIN, // 20
      PickupVariant.KEY, // 30
    );

    const bombPickupVariant = anyPlayerIs(PlayerType.BLUE_BABY_B)
      ? PickupVariant.POOP
      : PickupVariant.BOMB;
    pickupVariants.push(bombPickupVariant);

    if (isBethany(player)) {
      pickupVariants.push(PickupVariant.HEART);
    }
  });

  const pickups: EntityPickup[] = [];
  for (const pickupVariant of pickupVariants) {
    const pickup = getClosestPickupToPlayer(player, pickupVariant);
    if (pickup !== undefined) {
      pickups.push(pickup);
    }
  }

  return pickups;
}

function getClosestPickupToPlayer(
  player: EntityPlayer,
  pickupVariant: PickupVariant,
) {
  const pickups = getPickups(pickupVariant);
  const filteredPickups = pickups.filter(
    (pickup) =>
      pickup.Price === 0 &&
      // We set the vanilla "Touched" property to true if we have already inserted this pickup.
      !pickup.Touched &&
      !pickup.GetSprite().IsPlaying("Collect"),
  );

  return getClosestEntityTo(player, filteredPickups);
}
