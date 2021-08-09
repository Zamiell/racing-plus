/*
export function main(collectibleType: CollectibleType): void {
  const gameFrameCount = g.g.GetFrameCount();
  const activeItem = g.p.GetActiveItem();
  const activeCharge = g.p.GetActiveCharge();
  const batteryCharge = g.p.GetBatteryCharge();
  const activeItemMaxCharges = misc.getItemMaxCharges(activeItem);

  // Fix The Battery + 9 Volt synergy (1/2)
  if (
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_BATTERY) &&
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_NINE_VOLT) &&
    activeItemMaxCharges >= 2 &&
    activeCharge === activeItemMaxCharges &&
    batteryCharge === activeItemMaxCharges
  ) {
    g.run.giveExtraCharge = true;
  }
}

// CollectibleType.COLLECTIBLE_D6 (105)
export function d6(): void {
  // Used to prevent bugs with The Void + D6
  g.run.usedD6Frame = g.g.GetFrameCount();
}

// CollectibleType.COLLECTIBLE_FORGET_ME_NOW (127)
// Also called manually when we touch a 5-pip Dice Room
export function forgetMeNow(): void {
  const stage = g.l.GetStage();
  const challenge = Isaac.GetChallenge();

  // Do nothing if we are are playing on a set seed
  if (playingOnSetSeed()) {
    return;
  }

  seededFloors.before(stage);
  g.run.forgetMeNow = true;
  Isaac.DebugString(
    "Forget Me Now / 5-pip Dice Room detected. Seeding the next floor.",
  );
  // We will call the "seededFloors.after()" function manually in the PostNewLevel callback
}

// CollectibleType.COLLECTIBLE_BLANK_CARD (286)
export function blankCard(): void {
  const card = g.p.GetCard(0);
  if (
    // Checking for "? Card" is not necessary
    card === Card.CARD_FOOL || // 1
    card === Card.CARD_EMPEROR || // 5
    card === Card.CARD_HERMIT || // 10
    card === Card.CARD_STARS || // 18
    card === Card.CARD_MOON || // 19
    card === Card.CARD_JOKER // 48
  ) {
    // We do not want to display the "use" animation
    // Blank Card is hard coded to queue the "use" animation, so stop it on the next frame
    g.run.usedBlankCard = true;
  }
}

// CollectibleType.COLLECTIBLE_VOID (477)
function UseItem.Void() {
  // Used to prevent bugs with The Void + D6
  g.run.usedVoidFrame = g.g.GetFrameCount()

  // Voided pedestal items should count as starting a Challenge Room or the Boss Rush
  const collectibles = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
  )
  if (collectibles.length > 0 ) {
    g.run.touchedPickup = true
  }
}

// CollectibleType.COLLECTIBLE_MOVING_BOX (523)
function UseItem.MovingBox() {
  Isaac.DebugString("Moving Box activated.")
  if ( g.run.movingBoxOpen ) {
    // Check to see if ( there are any pickups on the ground
    const pickupsPresent = false
    const pickups = Isaac.FindByType(EntityType.ENTITY_PICKUP)
    for (const pickup of pickups) {
      if ( (
        pickup.Variant !== PickupVariant.PICKUP_BIGCHEST // 340
        && pickup.Variant !== PickupVariant.PICKUP_TROPHY // 370
        && pickup.Variant !== PickupVariant.PICKUP_BED // 380
      ) ) {
        pickupsPresent = true
        break
      }
    }
    if ( pickupsPresent ) {
      g.run.movingBoxOpen = false
      Isaac.DebugString("Set the Moving Box graphic to the open state.")
    } else {
      Isaac.DebugString("No pickups found.")
    }
  } else {
    g.run.movingBoxOpen = true
    Isaac.DebugString("Set the Moving Box graphic to the closed state.")
  }
}

// Racing+ manually seeds all pedestal items based on the room seed
// This is a problem for player-created pedestals, since they will be able to be rerolled into
// different items depending on which room they are used in
function UseItem.PlayerGeneratedPedestal() {
  const gameFrameCount = g.g.GetFrameCount()
  g.run.playerGenPedFrame = gameFrameCount + 1
}

*/
