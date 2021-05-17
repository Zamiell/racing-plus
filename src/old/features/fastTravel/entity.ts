// These are shared functions for fast-travel entities:
// - trapdoors
// - heaven doors
// - void portals

import { ZERO_VECTOR } from "../../constants";
import g from "../../globals";
import * as misc from "../../misc";
import { EffectVariantCustom } from "../../types/enums";
import {
  FastTravelState,
  JUMP_DOWN_ANIMATION_FRAME_LENGTH,
  TRAPDOOR_OPEN_DISTANCE,
  TRAPDOOR_PICKUP_TOUCH_DISTANCE,
  TRAPDOOR_TOUCH_DISTANCE,
} from "./constants";

export function checkPickupTouching(pickup: EntityPickup): void {
  // Local variables
  const roomIndex = misc.getRoomIndex();

  // We don't need to move Big Chests, Trophies, or Beds
  if (
    pickup.Variant === PickupVariant.PICKUP_BIGCHEST || // 340
    pickup.Variant === PickupVariant.PICKUP_TROPHY || // 370
    pickup.Variant === PickupVariant.PICKUP_BED // 380
  ) {
    return;
  }

  for (const trapdoor of g.run.level.replacedTrapdoors) {
    if (
      roomIndex === trapdoor.room &&
      pickup.Position.Distance(trapdoor.pos) <= TRAPDOOR_PICKUP_TOUCH_DISTANCE
    ) {
      movePickupAway(pickup, trapdoor.pos);
      return;
    }
  }

  for (const heavenDoor of g.run.level.replacedHeavenDoors) {
    if (
      roomIndex === heavenDoor.room &&
      pickup.Position.Distance(heavenDoor.pos) <= TRAPDOOR_PICKUP_TOUCH_DISTANCE
    ) {
      movePickupAway(pickup, heavenDoor.pos);
      return;
    }
  }

  for (const crawlspace of g.run.level.replacedCrawlspaces) {
    if (
      roomIndex === crawlspace.room &&
      pickup.Position.Distance(crawlspace.pos) <= TRAPDOOR_PICKUP_TOUCH_DISTANCE
    ) {
      movePickupAway(pickup, crawlspace.pos);
      return;
    }
  }
}

function movePickupAway(pickup: EntityPickup, posEntity: Vector) {
  // If this is a collectibles that is overlapping with the trapdoor, move it manually
  // (this is rare but possible with a Small Rock)
  if (pickup.Variant === PickupVariant.PICKUP_COLLECTIBLE) {
    pickup.Position = g.r.FindFreePickupSpawnPosition(pickup.Position, 1, true);
    return;
  }

  // Make pickups with velocity "bounce" off of the entity
  if (
    (pickup.Velocity.X !== 0 || pickup.Velocity.Y !== 0) &&
    pickup.Position.X !== posEntity.X &&
    pickup.Position.Y !== posEntity.Y
  ) {
    // Invert the velocity
    const reverseVelocity = Vector(pickup.Velocity.X, pickup.Velocity.Y);
    if (math.abs(reverseVelocity.X) === math.abs(reverseVelocity.Y)) {
      reverseVelocity.X *= -1;
      reverseVelocity.Y *= -1;
    } else if (math.abs(reverseVelocity.X) > math.abs(reverseVelocity.Y)) {
      reverseVelocity.X *= -1;
    } else if (math.abs(reverseVelocity.X) < math.abs(reverseVelocity.Y)) {
      reverseVelocity.Y *= -1;
    }
    pickup.Velocity = reverseVelocity;

    // Use the inverted velocity to slightly move it outside of the trapdoor hitbox
    const newPos = Vector(pickup.Position.X, pickup.Position.Y);
    let pushedOut = false;
    for (let i = 0; i < 100; i++) {
      // The velocity of a pickup decreases over time, so we might hit the threshold where
      // it decreases by just the right amount to not move outside of the hole in 1 iteration,
      // in which case it will need 2 iterations; but just do 100 iterations to be safe
      newPos.X += reverseVelocity.X;
      newPos.Y += reverseVelocity.Y;
      if (newPos.Distance(posEntity) > TRAPDOOR_PICKUP_TOUCH_DISTANCE) {
        pushedOut = true;
        break;
      }
    }
    if (!pushedOut) {
      Isaac.DebugString(
        "Error: Was not able to move the pickup out of the entity after 100 iterations.",
      );
    }
    pickup.Position = newPos;

    return;
  }

  // Generate new spawn positions until we find one that doesn't overlap with the hole
  let newPos: Vector | null = null;
  for (let i = 0; i < 100; i++) {
    const potentialNewPos = g.r.FindFreePickupSpawnPosition(
      pickup.Position,
      i,
      true,
    );
    if (potentialNewPos.Distance(posEntity) > TRAPDOOR_PICKUP_TOUCH_DISTANCE) {
      newPos = potentialNewPos;
    }
  }
  if (newPos === null) {
    // We were not able to find a free location after 100 attempts,
    // so give up and just delete the pickup
    pickup.Remove();
    Isaac.DebugString(
      `Error: Failed to find a free location after 100 attempts for pickup: ${pickup.Type}.${pickup.Variant}.${pickup.SubType}`,
    );
  } else {
    // Move it
    pickup.Position = newPos;
    Isaac.DebugString(
      `Moved a pickup that was overlapping with a hole: ${pickup.Type}.${pickup.Variant}.${pickup.SubType}`,
    );
  }
}

// This is only for trapdoors, beams of light, and void portals
// Crawlspaces are handled in the "crawlspace.checkPlayerTouching()" function
export function checkPlayerTouching(
  effect: EntityEffect,
  upwards: boolean,
): void {
  // Local variables
  const stage = g.l.GetStage();

  // Do nothing if we are already travelling to the next floor
  if (g.run.trapdoor.state !== FastTravelState.DISABLED) {
    return;
  }

  // Do nothing if the fast travel entity is not open
  if (effect.State !== 0) {
    return;
  }

  // Check to see if a player is touching the fast travel entity
  for (let i = 0; i < g.g.GetNumPlayers(); i++) {
    const player = Isaac.GetPlayer(i);
    if (player === null) {
      continue;
    }

    // Players cannot interact with fast travel entities while playing certain animations
    if (
      !player.IsHoldingItem() &&
      !player.GetSprite().IsPlaying("Happy") && // Account for lucky pennies
      !player.GetSprite().IsPlaying("Jump") // Account for How to Jump
    ) {
      continue;
    }

    // We want the player to be forced to dodge the final wave of tears from It Lives!
    if (
      upwards &&
      stage === 8 &&
      effect.FrameCount < 40 &&
      // The beam of light is initially spawned with an InitSeed equal to the room seed
      // The beam of light is spawned with an InitSeed of 0 when re-entering a room
      effect.InitSeed !== 0
    ) {
      continue;
    }

    if (player.Position.Distance(effect.Position) <= TRAPDOOR_TOUCH_DISTANCE) {
      playerTouched(effect, player, upwards);
    }
  }
}

function playerTouched(
  effect: EntityEffect,
  player: EntityPlayer,
  upwards: boolean,
) {
  // Local variables
  const gameFrameCount = g.g.GetFrameCount();

  // State 1 is activated the moment we touch the trapdoor
  g.run.trapdoor.state = FastTravelState.PLAYER_ANIMATION;
  g.run.trapdoor.upwards = upwards;
  g.run.trapdoor.frame = gameFrameCount + JUMP_DOWN_ANIMATION_FRAME_LENGTH;
  g.run.trapdoor.voidPortal =
    effect.Variant === EffectVariantCustom.VOID_PORTAL_FAST_TRAVEL;
  g.run.trapdoor.megaSatan =
    effect.Variant === EffectVariantCustom.MEGA_SATAN_TRAPDOOR;

  // If we are The Soul, the Forgotten body will also need to be teleported
  // However, if we change its position manually, it will just warp back to the same spot on the
  // next frame
  // Thus, just manually switch to the Forgotten to avoid this bug
  const character = g.p.GetPlayerType();
  if (character === PlayerType.PLAYER_THESOUL) {
    g.run.switchForgotten = true;

    // Also warp the body to where The Soul is so that The Forgotten won't jump down through a
    // normal floor
    const forgottenBodies = Isaac.FindByType(
      EntityType.ENTITY_FAMILIAR,
      900, // Forgotten Body (has no enum)
      -1,
      false,
      false,
    );
    for (const forgottenBody of forgottenBodies) {
      forgottenBody.Position = g.p.Position;
    }
  }

  player.ControlsEnabled = false;

  // We need to modify the collision class so that enemy attacks don't move the player while they
  // are doing the jumping animation
  player.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE;

  player.Position = effect.Position; // Teleport the player on top of the trapdoor
  player.Velocity = ZERO_VECTOR; // Remove all of the player's momentum

  if (upwards) {
    // The vanilla "LightTravel" animation is 28 frames long,
    // but we need to delay for longer than that to make it look smooth,
    // so it is modified it to be 40 frames in the anm2 file
    player.PlayExtraAnimation("LightTravel");
  } else {
    // The vanilla "Trapdoor" animation is 16 frames long,
    // but we need to delay for longer than that to make it look smooth,
    // So we use a custom "TrapDoor2" animation that is 40 frames long)
    player.PlayExtraAnimation("Trapdoor2");
  }
}

// Called from the "CheckEntities.NonGrid()" function
export function checkOpen(effect: EntityEffect): void {
  // Local variables
  const roomType = g.r.GetType();

  // Don't do anything if the trapdoor / crawlspace is already open
  if (effect.State === 0) {
    return;
  }

  // Don't do anything if we are in an uncleared room
  if (!isRoomClear(effect)) {
    return;
  }

  // Don't do anything if it is freshly spawned in a boss room and one or more players are
  // relatively close
  const playerRelativelyClose = isPlayerClose(
    effect.Position,
    TRAPDOOR_OPEN_DISTANCE * 2.5,
  );
  if (
    roomType === RoomType.ROOM_BOSS &&
    effect.FrameCount <= 30 &&
    effect.DepthOffset !== -101 && // We use -101 to signify that it is a respawned trapdoor
    playerRelativelyClose
  ) {
    return;
  }

  // Don't do anything if the player is standing too close to the entity
  const playerClose = isPlayerClose(effect.Position, TRAPDOOR_OPEN_DISTANCE);
  if (playerClose) {
    return;
  }

  // Open it
  effect.State = 0;
  effect.GetSprite().Play("Open Animation", true);
}

// Called from the "CheckEntities.NonGrid()" function
export function checkClose(effect: EntityEffect): void {
  // Don't do anything if the entity is already closed
  if (effect.State === 1) {
    return;
  }

  // Don't do anything if we are in an cleared room
  if (isRoomClear(effect)) {
    return;
  }

  // Close it
  effect.State = 1;
  effect.GetSprite().Play("Closed", true);
}

export function isRoomClear(entity: Entity | null): boolean {
  // Local variables
  const roomType = g.r.GetType();

  // Racing+ will use mgln's custom mechanic until the release of Repentance
  // This means that freshly spawned trapdoors will always be open,
  // regardless of whether the room is clear or not
  if (entity !== null) {
    const data = entity.GetData();
    if (data.fresh) {
      return true;
    }
  }

  // 11
  if (roomType === RoomType.ROOM_CHALLENGE) {
    if (g.run.level.challengeRoom.started) {
      return g.run.level.challengeRoom.finished;
    }

    return true;
  }

  // 17
  if (roomType === RoomType.ROOM_BOSSRUSH) {
    if (g.run.bossRush.started) {
      return g.run.bossRush.finished;
    }

    return true;
  }

  return g.r.IsClear();
}

// Called from the PostNewRoom callback
export function checkRespawn(): void {
  checkRespawnTrapdoors();
  checkRespawnCrawlspaces();
  checkRespawnHeavenDoors();
}

function checkRespawnTrapdoors() {
  // Local variables
  const roomIndex = misc.getRoomIndex();
  const stage = g.l.GetStage();

  for (const trapdoor of g.run.level.replacedTrapdoors) {
    if (trapdoor.room === roomIndex) {
      removeOverlappingGridEntity(trapdoor.pos);

      // Spawn the new custom entity
      let effectVariant: EffectVariantCustom;
      if (roomIndex === GridRooms.ROOM_BLUE_WOOM_IDX) {
        effectVariant = EffectVariantCustom.BLUE_WOMB_TRAPDOOR_FAST_TRAVEL;
      } else if (stage === 6 || stage === 7) {
        effectVariant = EffectVariantCustom.WOMB_TRAPDOOR_FAST_TRAVEL;
      } else {
        effectVariant = EffectVariantCustom.TRAPDOOR_FAST_TRAVEL;
      }
      const effect = Isaac.Spawn(
        EntityType.ENTITY_EFFECT,
        effectVariant,
        0,
        trapdoor.pos,
        ZERO_VECTOR,
        null,
      ).ToEffect();
      if (effect === null) {
        error("Failed to spawn a fast travel trapdoor.");
      }

      // This is needed so that the entity will not appear on top of the player
      // We use -101 instead of -100 to signify that it is a respawned trapdoor
      effect.DepthOffset = -101;

      // Figure out if it should spawn open or closed,
      // depending on if one or more players is close to it
      const playerClose = isPlayerClose(
        effect.Position,
        TRAPDOOR_OPEN_DISTANCE,
      );
      if (
        !isRoomClear(effect) ||
        playerClose ||
        // Always spawn trapdoors closed in the Boss Rush to prevent specific bugs
        roomIndex === GridRooms.ROOM_BOSSRUSH_IDX
      ) {
        effect.State = 1;
        effect.GetSprite().Play("Closed", true);
        Isaac.DebugString("Respawned trapdoor (closed, state 1).");
      } else {
        // The default animation is "Opened", which is what we want
        Isaac.DebugString("Respawned trapdoor (opened, state 0).");
      }
    }
  }
}

function checkRespawnCrawlspaces() {
  // Local variables
  const roomIndex = misc.getRoomIndex();

  for (const crawlspace of g.run.level.replacedCrawlspaces) {
    if (crawlspace.room === roomIndex) {
      removeOverlappingGridEntity(crawlspace.pos);

      // Spawn the new custom entity
      const effect = Isaac.Spawn(
        EntityType.ENTITY_EFFECT,
        EffectVariantCustom.CRAWLSPACE_FAST_TRAVEL,
        0,
        crawlspace.pos,
        ZERO_VECTOR,
        null,
      ).ToEffect();
      if (effect === null) {
        error("Failed to spawn a fast travel crawlspace.");
      }

      // This is needed so that the entity will ! appear on top of the player
      effect.DepthOffset = -100;

      // Figure out if it should spawn open or closed,
      // depending on if one or more players is close to it
      const playerClose = isPlayerClose(
        effect.Position,
        TRAPDOOR_OPEN_DISTANCE,
      );
      if (!isRoomClear(effect) || playerClose || roomIndex < 0) {
        // Always spawn crawlspaces closed in rooms outside the grid to prevent specific bugs;
        // e.g. if ( we need to teleport back to a crawlspace && it is open, the player can softlock
        effect.State = 1;
        effect.GetSprite().Play("Closed", true);
        Isaac.DebugString("Respawned crawlspace (closed, state 1).");
      } else {
        // The default animation is "Opened", which is what we want
        Isaac.DebugString("Respawned crawlspace (opened, state 0).");
      }
    }
  }
}

function checkRespawnHeavenDoors() {
  // Local variables
  const roomIndex = misc.getRoomIndex();

  for (const heavenDoor of g.run.level.replacedHeavenDoors) {
    if (heavenDoor.room === roomIndex) {
      // Spawn the new custom entity
      // (we use an InitSeed of 0 instead of a random seed to signify that it is a respawned entity)
      const entity = g.g.Spawn(
        EntityType.ENTITY_EFFECT,
        EffectVariantCustom.HEAVEN_DOOR_FAST_TRAVEL,
        heavenDoor.pos,
        ZERO_VECTOR,
        null,
        0,
        0,
      );
      entity.DepthOffset = 15; // The default offset of 0 is too low, && 15 is just about perfect
      Isaac.DebugString("Respawned a heaven door.");
    }
  }
}

// Remove any grid entities that will overlap with the custom trapdoor/crawlspace
// (this is needed because rocks/poop will respawn in the room after reentering)
function removeOverlappingGridEntity(pos: Vector) {
  // Check for the existence of an overlapping grid entity
  const gridIndex = g.r.GetGridIndex(pos);
  const gridEntity = g.r.GetGridEntity(gridIndex);
  if (gridEntity === null) {
    return;
  }

  g.r.RemoveGridEntity(gridIndex, 0, false); // entity.Destroy() does not work
  Isaac.DebugString(
    `Removed a grid entity at index ${gridIndex} that would interfere with a fast travel entity.`,
  );

  // If this was a Corny Poop, it will turn the Eternal Fly into an Attack Fly
  const saveState = gridEntity.GetSaveState();
  if (
    saveState.Type === GridEntityType.GRID_POOP &&
    saveState.Variant === 2 // Corny Poop
  ) {
    const flies = Isaac.FindByType(
      EntityType.ENTITY_ETERNALFLY,
      -1,
      -1,
      false,
      false,
    );
    for (const fly of flies) {
      fly.Remove();
      Isaac.DebugString(
        "Removed an Eternal Fly associated with the removed Corny Poop.",
      );
    }
  }
}

export function isPlayerClose(position: Vector, distance: float): boolean {
  for (let i = 0; i < g.g.GetNumPlayers(); i++) {
    const player = Isaac.GetPlayer(i);
    if (player !== null && player.Position.Distance(position) <= distance) {
      return true;
    }
  }

  return false;
}
