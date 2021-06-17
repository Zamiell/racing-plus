/*
export function main(pickup: EntityPickup): void {
  const sprite = pickup.GetSprite();

  // Keep track of pickups that are touched
  // (used for moving pickups on top of a trapdoor/crawlspace)
  if (
    (sprite.IsPlaying("Collect") || // Most pickups have a "Collect" animation
      sprite.IsPlaying("Open")) && // Chests do not have a "Collect" animation
    !pickup.Touched
  ) {
    pickup.Touched = true;

    // Some pickups should count as "starting" a Challenge Room or Boss Rush
    if (
      pickup.Variant === PickupVariant.PICKUP_CHEST || // 50
      pickup.Variant === PickupVariant.PICKUP_BOMBCHEST || // 51
      pickup.Variant === PickupVariant.PICKUP_SPIKEDCHEST || // 52
      pickup.Variant === PickupVariant.PICKUP_ETERNALCHEST || // 53
      pickup.Variant === PickupVariant.PICKUP_MIMICCHEST || // 54
      pickup.Variant === PickupVariant.PICKUP_LOCKEDCHEST || // 60
      pickup.Variant === PickupVariant.PICKUP_GRAB_BAG || // 69
      pickup.Variant === PickupVariant.PICKUP_REDCHEST // 360
    ) {
      g.run.room.touchedPickup = true;
      Isaac.DebugString(
        `Touched pickup: ${pickup.Type}.${pickup.Variant}.${pickup.SubType}`,
      );
    }

    if (
      pickup.Variant === PickupVariant.PICKUP_LIL_BATTERY ||
      (pickup.Variant === PickupVariant.PICKUP_KEY &&
        pickup.SubType === KeySubType.KEY_CHARGED)
    ) {
      // Recharge the Wraith Skull
      // (we have to do this manually because the charges on the Wraith Skull are ! handled
      // naturally by the game)
      samael.CheckRechargeWraithSkull();
    }
  }

  // Make sure that pickups are not overlapping with trapdoors / beams of light / crawlspaces
  if (!pickup.Touched) {
    // Pickups will still exist for 15 frames after being picked up since they will be playing the
    // "Collect" animation
    // So we don't want to move a pickup that is already collected, or it will duplicate it
    // ("Touched" was manually set to true by the mod above)
    // Alternatively, we could check for "entity.EntityCollisionClass !== 0",
    // but this is bad because the collision is 0 during the long "Appear" animation
    // Additionally, we can't use the PostPickupInit callback for this because the position
    // for newly initialized pickups is always equal to (0, 0)
    fastTravel.entity.checkPickupTouching(pickup);
  }
}

// PickupVariant.PICKUP_HEART (10)
export function heart(pickup: EntityPickup): void {
  // We only care about freshly spawned black hearts
  if (pickup.FrameCount !== 1 || pickup.SubType !== HeartSubType.HEART_BLACK) {
    return;
  }

  // If this black heart is in the same position as a dead NPC,
  // assume that it was spawned from a Maw of the Void or Athame
  let parentNPC: BlackHeartNPC | undefined;
  for (const entity of g.run.room.blackHeartNPCs.values()) {
    if (
      entity.position.X === pickup.Position.X &&
      entity.position.Y === pickup.Position.Y
    ) {
      parentNPC = entity;
      break;
    }
  }
  if (parentNPC === undefined) {
    // It must be a black heart from something else (like a room drop)
    return;
  }

  // We only allow 1 black heart drop from a particular init seed
  let currentBlackHeartCount = g.run.room.blackHeartCount.get(
    parentNPC.initSeed,
  );
  if (currentBlackHeartCount === undefined) {
    currentBlackHeartCount = 0;
  }

  currentBlackHeartCount += 1;
  g.run.room.blackHeartCount.set(parentNPC.initSeed, currentBlackHeartCount);

  if (currentBlackHeartCount >= 2) {
    pickup.Remove();
    Isaac.DebugString(
      "Removed a bugged black heart from a multi-segment enemy.",
    );
  }
}

// PickupVariant.PICKUP_COIN (20)
export function coin(pickup: EntityPickup): void {
  const sprite = pickup.GetSprite();
  const data = pickup.GetData();

  if (pickup.SubType === CoinSubType.COIN_STICKYNICKEL) {
    if (sprite.IsPlaying("Touched")) {
      sprite.Play("TouchedStick", true);
    }
  } else if (data.WasStickyNickel) {
    // Check for our WasStickyNickel data
    data.WasStickyNickel = false;
    sprite.Load("gfx/005.022_nickel.anm2", true); // Revert the nickel sprite to the original sprite
    sprite.Play("Idle", true);
  }
}

// PickupVariant.PICKUP_COLLECTIBLE (100)
export function collectible(pickup: EntityPickup): void {
  // We manually manage the seed of all collectible items
  pedestals.replace(pickup);
}

// PickupVariant.PICKUP_TAROTCARD (300)
export function tarotCard(pickup: EntityPickup): void {
  season8.postPickupUpdateTarotCard(pickup);
}

// PickupVariant.PICKUP_TRINKET (350)
export function trinket(pickup: EntityPickup): void {
  season8.postPickupUpdateTrinket(pickup);
}
*/
