// These are shared functions for fast-travel entities

// These are functions for both trapdoors and crawlspaces

// TODO CHECK IF NECESSARY, BETTER TO JUST SPAWN BEAMS OF LIGHT IN A CLOSED STATE
/*
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
*/

import g from "../../../../globals";
import { EffectVariantCustom } from "../../../../types/enums";
import {
  TRAPDOOR_OPEN_DISTANCE,
  TRAPDOOR_OPEN_DISTANCE_FOR_FRESH,
  TRAPDOOR_TOUCH_DISTANCE,
} from "./constants";
import { FastTravelEntityState, FastTravelState } from "./enums";

// Called from ModCallbacks.MC_POST_EFFECT_UPDATE (55)
export function checkShouldOpen(effect: EntityEffect): void {
  if (shouldOpen(effect)) {
    open(effect, true);
  }
}

function shouldOpen(effect: EntityEffect) {
  return (
    effect.State !== FastTravelEntityState.Open &&
    !shouldBeClosedBecauseOfEnemies(effect) &&
    !shouldBeClosedBecausePlayerClose(effect) &&
    !shouldBeClosedBecausePlayerCloseAndFreshSpawn(effect)
  );
}

function shouldBeClosedBecauseOfEnemies(effect: EntityEffect) {
  const isClear = g.r.IsClear();

  // Freshly spawned trapdoors and crawlspaces will always be open,
  // regardless of whether the room is clear or not
  const data = effect.GetData();
  if (data.fresh) {
    return false;
  }

  return !isClear;
}

function shouldBeClosedBecausePlayerClose(effect: EntityEffect) {
  const playersClose = Isaac.FindInRadius(
    effect.Position,
    TRAPDOOR_OPEN_DISTANCE,
    EntityPartition.PLAYER,
  );

  return playersClose.length > 0;
}

// In order to prevent a player from accidentally entering a freshly-spawned trap door after killing
// the boss of the floor, we use a wider open distance for 30 frames
function shouldBeClosedBecausePlayerCloseAndFreshSpawn(effect: EntityEffect) {
  const roomType = g.r.GetType();
  const playersClose = Isaac.FindInRadius(
    effect.Position,
    TRAPDOOR_OPEN_DISTANCE_FOR_FRESH,
    EntityPartition.PLAYER,
  );
  const data = effect.GetData();
  const respawned = data.respawned as boolean | null;

  return (
    roomType === RoomType.ROOM_BOSS &&
    effect.FrameCount <= 30 &&
    respawned === null &&
    playersClose.length > 0
  );
}

function open(effect: EntityEffect, playAnimation = false) {
  effect.State = FastTravelEntityState.Open;

  const sprite = effect.GetSprite();
  const animationName = playAnimation ? "Open Animation" : "Opened";
  sprite.Play(animationName, true);
}

function close(effect: EntityEffect) {
  effect.State = FastTravelEntityState.Closed;

  const sprite = effect.GetSprite();
  const animationName =
    effect.Variant === EffectVariantCustom.HEAVEN_DOOR_FAST_TRAVEL
      ? "Disappear"
      : "Closed";
  sprite.Play(animationName, true);
}

export function checkPlayerTouched(
  effect: EntityEffect,
  touchedFunction: (effect: EntityEffect) => void,
): void {
  if (g.run.fastTravel.state !== FastTravelState.DISABLED) {
    return;
  }

  if (effect.State === FastTravelEntityState.Closed) {
    return;
  }

  const playersTouching = Isaac.FindInRadius(
    effect.Position,
    TRAPDOOR_TOUCH_DISTANCE,
    EntityPartition.PLAYER,
  );
  for (const entity of playersTouching) {
    const player = entity.ToPlayer();
    if (player !== null && canInteractWith(player)) {
      touchedFunction(effect);
      return; // Prevent two players from touching the same entity
    }
  }
}

function canInteractWith(player: EntityPlayer) {
  // Players cannot interact with crawlspaces while playing certain animations
  const sprite = player.GetSprite();
  return (
    !player.IsHoldingItem() &&
    !sprite.IsPlaying("Happy") && // Account for lucky pennies
    !sprite.IsPlaying("Jump") // Account for How to Jump
  );
}

export function spawn(
  variant: EffectVariantCustom,
  position: Vector,
  shouldSpawnOpen: (effect: EntityEffect) => boolean,
): void {
  const roomFrameCount = g.r.GetFrameCount();

  const effect = Isaac.Spawn(
    EntityType.ENTITY_EFFECT,
    variant,
    0,
    position,
    Vector.Zero,
    null,
  ).ToEffect();
  if (effect === null) {
    error("Failed to spawn a new fast-travel effect.");
  }

  // This is needed so that the entity will not appear on top of the player
  if (variant === EffectVariantCustom.HEAVEN_DOOR_FAST_TRAVEL) {
    effect.DepthOffset = 15;
  } else {
    effect.DepthOffset = -100;
  }

  if (roomFrameCount > 0) {
    // Mark that this entity should be open even if the room is not cleared
    const data = effect.GetData();
    data.fresh = true;
  }

  if (shouldSpawnOpen(effect)) {
    open(effect);
  } else {
    close(effect);
  }
}

/*
import { getRoomIndex } from "../../../../misc";
import { TRAPDOOR_PICKUP_TOUCH_DISTANCE } from "./constants";

export function checkPickupTouching(pickup: EntityPickup): void {
  // Local variables
  const roomIndex = getRoomIndex();

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
  player.Velocity = Vector.Zero; // Remove all of the player's momentum

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
*/
