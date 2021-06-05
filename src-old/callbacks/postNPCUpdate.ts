/*
export function main(npc: EntityNPC): void {
  // Check for dying enemies so that we can fix the bug where multi-segment enemies drop multiple
  // black hearts
  // We need to track enemy positions as a workaround because black hearts will not have a Parent or
  // SpawnerEntity
  if (npc.IsDead()) {
    if (g.run.room.blackHeartNPCs.has(npc.Index)) {
      // An enemy has died for the first time (and begun its death animation on this frame)
      // Make an entry in the blackHeartNPCs map
      g.run.room.blackHeartNPCs.set(npc.Index, {
        initSeed: npc.InitSeed,
        position: Vector(npc.Position.X, npc.Position.Y),
      });
    }
  }

  // Track all NPCs for the purposes of opening the doors early
  fastClear.PostNPCUpdate(npc);
}

// EntityType.ENTITY_CHUB (28)
export function chub(npc: EntityNPC): void {
  // Local variables
  const gameFrameCount = g.g.GetFrameCount();

  // We only care about Chubs spawned from The Matriarch
  if (!g.run.room.matriarch.spawned) {
    return;
  }

  // When Matriarch is killed, it will morph into a Chub
  // (and the PostEntityKill callback will never fire)
  // When this happens, the other segments of Chub will spawn (it is a multi-segment entity)
  // The new segments will start at frame 0, but the main segment will retain the FrameCount of the
  // Matriarch entity
  // We want to find the index of the main Chub so that we can stun it
  if (
    g.run.room.matriarch.chubIndex === -1 &&
    // Frame count can be any value higher than 1,
    // since the new segments will first appear here on frame 1,
    // but use 30 frames to be safe
    npc.FrameCount > 30
  ) {
    g.run.room.matriarch.chubIndex = npc.Index;
    g.run.room.matriarch.stunFrame = gameFrameCount + 1;

    // The Matriarch has died, so also nerf the fight slightly by killing everything in the room
    // to clear things up a little bit
    for (const entity of Isaac.GetRoomEntities()) {
      if (
        entity.ToNPC() !== null &&
        entity.Type !== EntityType.ENTITY_CHUB &&
        entity.Type !== EntityTypeCustom.ENTITY_ROOM_CLEAR_DELAY_NPC
      ) {
        entity.Kill();
      }
    }
  }

  // Stun (slow down) the Chub that spawns from The Matriarch
  if (
    npc.Index === g.run.room.matriarch.chubIndex &&
    gameFrameCount <= g.run.room.matriarch.stunFrame
  ) {
    npc.State = NpcState.STATE_UNIQUE_DEATH; // (the state after he eats a bomb)
    g.sfx.Stop(SoundEffect.SOUND_MONSTER_ROAR_2);
  }
}

// EntityType.ENTITY_FLAMINGHOPPER (54)
export function flamingHopper(npc: EntityNPC): void {
  // Local variables
  const gameFrameCount = g.g.GetFrameCount();

  // Prevent Flaming Hopper softlocks
  let currentHopper = g.run.room.currentHoppers.get(npc.Index);
  if (currentHopper === undefined) {
    currentHopper = {
      npc,
      posX: npc.Position.X,
      posY: npc.Position.Y,
      lastMoveFrame: gameFrameCount,
    };
    g.run.room.currentHoppers.set(npc.Index, currentHopper);
  }

  // Find out if it moved
  if (
    currentHopper.posX !== npc.Position.X ||
    currentHopper.posY !== npc.Position.Y
  ) {
    // Update the position
    currentHopper.posX = npc.Position.X;
    currentHopper.posY = npc.Position.Y;
    currentHopper.lastMoveFrame = gameFrameCount;
    return;
  }

  // It hasn't moved since the last time we checked
  if (gameFrameCount - currentHopper.lastMoveFrame >= 150) {
    // 5 seconds
    npc.Kill();
  }
}

// EntityType.ENTITY_PIN (62)
export function pin(npc: EntityNPC): void {
  // We only care about the head
  if (npc.Parent !== null) {
    return;
  }

  // Don't do anything if there is more than one Pin in the room
  const pins = Isaac.FindByType(EntityType.ENTITY_PIN);
  let numPins = 0;
  for (const pinEntity of pins) {
    if (pinEntity.Parent === null) {
      numPins += 1;
    }
  }
  if (numPins > 1) {
    return;
  }

  // Local variables
  const roomShape = g.r.GetRoomShape();

  // Normally, Pin/Frail/Scolex first attacks on frame 73, so speed this up
  if (npc.FrameCount === 30) {
    // Changing the state to 3 will cause it to leap at the player on the next frame
    npc.State = 3;
  } else if (npc.FrameCount === 31) {
    // We also need to adjust the "charge" velocity, or else the first attack will be really wimpy
    if (
      g.l.EnterDoor === DoorSlot.UP0 || // 1
      g.l.EnterDoor === DoorSlot.DOWN0 // 3
    ) {
      // From the bottom/top door, the vanilla V1 velocity (on frame 74) is 6.08
      // From the bottom/top door, the frame 31 V1 velocity is 3.69
      npc.V1 = npc.V1.__mul(1.65);
    } else {
      // From the left/right door, the vanilla V1 velocity (on frame 74) is 6.92
      // From the left/right door, the frame 16 V1 velocity is 2.13
      npc.V1 = npc.V1.__mul(3.25);
    }

    while (math.abs(npc.V1.X) > 7 || math.abs(npc.V1.Y) > 7) {
      npc.V1 = npc.V1.__mul(0.9);
    }

    if (roomShape > 3) {
      // 1-3 are 1x1 room types
      npc.Velocity = npc.Velocity.__mul(-1);
    }
  }
}

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
