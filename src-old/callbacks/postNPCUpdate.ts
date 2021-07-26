/*
// EntityType.ENTITY_DINGLE (261)
export function dingle(npc: EntityNPC): void {
  // We only care about Dangles that are freshly spawned
  if (npc.Variant === 1 && npc.State === NpcState.STATE_INIT) {
    // Fix the bug where a Dangle spawned from a Brownie will be faded
    npc.SetColor(Color.Default, 1000, 0, true, true);
  }
}

// EntityType.ENTITY_THE_LAMB (273)
export function theLamb(npc: EntityNPC): void {
  if (
    npc.Variant === 10 && // Lamb Body (273.10)
    npc.IsInvincible() && // It only turns invincible once it is defeated
    // This is necessary because the callback will be hit again during the removal
    !npc.IsDead()
  ) {
    // Remove the body once it is defeated so that it does not interfere with taking the trophy
    npc.Kill(); // This plays the blood and guts animation, but does not actually remove the entity
    npc.Remove();
  }
}

// EntityType.ENTITY_MEGA_SATAN_2 (275)
export function megaSatan2(npc: EntityNPC): void {
  if (g.run.room.megaSatanDead || !npc.GetSprite().IsPlaying("Death")) {
    return;
  }

  // Stop the room from being cleared, which has a chance to take us back to the menu
  g.run.room.megaSatanDead = true;
  const roomClearDelayNPC = Isaac.Spawn(
    EntityTypeCustom.ENTITY_ROOM_CLEAR_DELAY_NPC,
    0,
    0,
    Vector.Zero,
    Vector.Zero,
    null,
  );
  roomClearDelayNPC.ClearEntityFlags(EntityFlag.FLAG_APPEAR);
  roomClearDelayNPC.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE;

  // Give a charge to the player's active item
  if (g.p.NeedsCharge() === true) {
    const currentCharge = g.p.GetActiveCharge();
    g.p.SetActiveCharge(currentCharge + 1);
  }

  // Spawn a big chest (which will get replaced with a trophy if we happen to be in a race)
  Isaac.Spawn(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_BIGCHEST,
    0,
    g.r.GetCenterPos(),
    Vector.Zero,
    null,
  );

  // Set the room status to clear so that the player cannot fight Mega Satan a second time
  // (e.g. if they use a Fool Card)
  g.r.SetClear(true);
}

// EntityType.ENTITY_ULTRA_GREED (406)
export function ultraGreed(npc: EntityNPC): void {
  if (npc.State === NpcState.STATE_APPEAR_CUSTOM) {
    npc.State = NpcState.STATE_IDLE;
  }
}

// EntityType.ENTITY_BIG_HORN (411)
export function bigHorn(npc: EntityNPC): void {
  // Speed up coming out of the ground
  if (
    npc.State === NpcState.STATE_MOVE &&
    npc.StateFrame >= 67 &&
    npc.StateFrame < 100
  ) {
    npc.StateFrame = 100;
  }
}

// EntityType.ENTITY_MATRIARCH (413)
export function matriarch(_npc: EntityNPC): void {
  // Mark that we are fighting a Matriarch so that we can slow down the Chub later
  g.run.room.matriarch.spawned = true;
}

// EntityType.ENTITY_HOST (27)
// EntityType.ENTITY_MOBILE_HOST (204)
// EntityType.ENTITY_FORSAKEN (403)
export function fearImmunity(npc: EntityNPC): void {
  if (npc.HasEntityFlags(EntityFlag.FLAG_FEAR)) {
    // We can't use "npc.ClearEntityFlags(EntityFlag.FLAG_FEAR)" because
    // it will not remove the color change
    npc.RemoveStatusEffects();
    Isaac.DebugString("Unfeared a Host / Mobile Host / Forsaken.");
  }
}

// EntityType.ENTITY_BLASTOCYST_BIG (74)
// EntityType.ENTITY_BLASTOCYST_MEDIUM (75)
// EntityType.ENTITY_BLASTOCYST_SMALL (76)
export function freezeImmunity(npc: EntityNPC): void {
  if (npc.HasEntityFlags(EntityFlag.FLAG_FREEZE)) {
    // We can't use "npc.ClearEntityFlags(EntityFlag.FLAG_FREEZE)" because
    // it will not remove the color change
    npc.RemoveStatusEffects();
  }
}
*/
